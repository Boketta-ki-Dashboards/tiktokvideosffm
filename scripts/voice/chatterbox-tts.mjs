#!/usr/bin/env node
/**
 * Natürliche deutsche Sprecherstimme mit Chatterbox Multilingual (MIT, lokal, kostenlos, kein API-Key).
 * Klangvorlage: voices/thorsten-cc0-ref.flac (echte Stimme von Thorsten Müller, CC0).
 *
 *   npm run voice:setup-chatterbox                       # einmalig (≈ 1,5 GB Python-Pakete, 3 GB Modell)
 *   npm run voice:chatterbox -- --video frankfurt-2026-10-31 [--check]
 *
 * Ablauf je Satz: „Vorlauf-Wort“ + Satz erzeugen (Chatterbox verschluckt sonst oft das erste Wort) →
 * Vorlauf an der ersten Sprechpause abschneiden → Stille trimmen → Tempo anpassen → Zusammenbau + Mastering.
 * --check: vergleicht jeden Satz per Whisper (falls installiert) mit dem Skript.
 * Satz klingt verschliffen? Im Skript beim Segment "seed": <Zahl> setzen → nur dieser Satz wird neu erzeugt.
 * Cache: Rohaufnahmen liegen in .cache/voice-segments/<video>/ – nur geänderte Sätze werden neu erzeugt
 *        (Pausen/Tempo ändern = Sekunden statt Minuten). --fresh erzwingt alles neu, --only id1,id2 gezielt.
 */
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {copyFileSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {parseSegmentText} from '../../src/lib/script-timing.ts';
import {detectSilences, durationSeconds, ffmpeg, trimSilenceFilter} from '../lib/ffmpeg.mjs';
import {parseArgs, readScript, ROOT} from '../lib/project.mjs';
import {assembleVoiceTrack} from '../lib/voice-build.mjs';

const args = parseArgs(process.argv.slice(2));
const videoId = args.video ?? 'frankfurt-2026-10-31';
const script = readScript(videoId);
const cfg = {
	reference: 'voices/thorsten-cc0-ref.flac',
	exaggeration: 0.7,
	cfgWeight: 0.3,
	temperature: 0.8,
	tempo: 1.0,
	seed: 7,
	prefix: 'Also.',
	...(script.voice?.chatterbox ?? {}),
};
const only = args.only ? String(args.only).split(',') : null;

const cache = path.join(ROOT, '.cache');
const python = process.env.CHATTERBOX_PYTHON ?? path.join(cache, 'chatterbox-venv', 'bin', 'python');
if (!existsSync(python)) {
	console.error(`✖ Chatterbox ist nicht installiert (${python}). Einmalig: npm run voice:setup-chatterbox`);
	process.exit(1);
}

const env = {...process.env, HF_HOME: process.env.HF_HOME ?? path.join(cache, 'huggingface'), TOKENIZERS_PARALLELISM: 'false'};
const SAMPLE_RATE = 24000;
const tmp = mkdtempSync(path.join(os.tmpdir(), 'chatterbox-'));
const segCache = path.join(cache, 'voice-segments', videoId);
mkdirSync(segCache, {recursive: true});
const keyFor = (segment, attempt) =>
	createHash('sha1')
		.update(
			JSON.stringify({
				spoken: parseSegmentText(segment.text).spoken,
				prefix: cfg.prefix,
				ref: cfg.reference,
				ex: cfg.exaggeration,
				cfg: cfg.cfgWeight,
				t: cfg.temperature,
				seed: Number(segment.seed ?? cfg.seed) + attempt * 101,
			}),
		)
		.digest('hex')
		.slice(0, 16);

const runWorker = (jobs) => {
	const jobsFile = path.join(tmp, `jobs-${Date.now()}.json`);
	writeFileSync(jobsFile, JSON.stringify(jobs));
	const res = spawnSync(
		python,
		[
			path.join(ROOT, 'scripts', 'voice', 'chatterbox_worker.py'),
			'--jobs', jobsFile,
			'--ref', path.join(ROOT, cfg.reference),
			'--out', tmp,
			'--exaggeration', String(cfg.exaggeration),
			'--cfg', String(cfg.cfgWeight),
			'--temperature', String(cfg.temperature),
		],
		{stdio: ['ignore', 'inherit', 'pipe'], encoding: 'utf8', env},
	);
	if (res.status !== 0) {
		throw new Error(`Chatterbox-Worker fehlgeschlagen:\n${res.stderr.slice(-3000)}`);
	}
};

/** Schneidet das Vorlauf-Wort an der ersten Pause ab; null, wenn keine passende Pause gefunden wurde. */
const cutPrefix = (raw, out) => {
	const pause = detectSilences(raw, {noiseDb: -38, minSeconds: 0.08}).find((s) => s.start > 0.15 && s.start < 1.6);
	if (!pause) {
		return null;
	}

	const cutAt = Math.max(pause.start + 0.02, pause.end - 0.04);
	const filters = [trimSilenceFilter(-45)];
	if (cfg.tempo && Number(cfg.tempo) !== 1) {
		filters.push(`atempo=${Number(cfg.tempo)}`);
	}

	ffmpeg(['-ss', cutAt.toFixed(3), '-i', raw, '-af', filters.join(','), '-ar', String(SAMPLE_RATE), '-ac', '1', '-c:a', 'pcm_s16le', out]);
	return out;
};

const whisperCheck = (file, expected) => {
	const cli = path.join(cache, 'whisper.cpp', 'build', 'bin', 'whisper-cli');
	const model = ['ggml-small.bin', 'ggml-base.bin'].map((m) => path.join(cache, 'whisper.cpp', m)).find((m) => existsSync(m));
	if (!existsSync(cli) || !model) {
		return null;
	}

	const wav16 = `${file}.16k.wav`;
	ffmpeg(['-i', file, '-ar', '16000', '-ac', '1', wav16]);
	const res = spawnSync(cli, ['-m', model, '-l', 'de', '-f', wav16, '-nt'], {encoding: 'utf8'});
	const heard = res.stdout.replace(/\s+/g, ' ').trim();
	return {heard, expected};
};

try {
	const targets = script.segments.filter((s) => !only || only.includes(s.id));
	const jobsFor = (segs, attempt) =>
		segs.map((s) => ({id: s.id, seed: Number(s.seed ?? cfg.seed) + attempt * 101, text: `${cfg.prefix} ${parseSegmentText(s.text).spoken}`}));

	let pending = targets;
	const done = new Map();
	for (let attempt = 0; attempt < 3 && pending.length > 0; attempt++) {
		// Cache-Treffer übernehmen
		const toGenerate = [];
		for (const s of pending) {
			const cached = path.join(segCache, `${keyFor(s, attempt)}.wav`);
			if (!args.fresh && existsSync(cached)) copyFileSync(cached, path.join(tmp, `${s.id}.wav`));
			else toGenerate.push(s);
		}

		if (toGenerate.length > 0) {
			console.log(`→ Chatterbox erzeugt ${toGenerate.length} Satz/Sätze (Versuch ${attempt + 1}, ${pending.length - toGenerate.length} aus Cache) …`);
			runWorker(jobsFor(toGenerate, attempt));
			for (const s of toGenerate) copyFileSync(path.join(tmp, `${s.id}.wav`), path.join(segCache, `${keyFor(s, attempt)}.wav`));
		} else {
			console.log(`→ Alle ${pending.length} Sätze aus dem Cache.`);
		}

		const failed = [];
		for (const s of pending) {
			const cut = cutPrefix(path.join(tmp, `${s.id}.wav`), path.join(tmp, `${s.id}.final.wav`));
			if (cut) done.set(s.id, cut);
			else failed.push(s);
		}

		pending = failed;
		if (failed.length > 0) {
			console.warn(`⚠ Vorlauf nicht sauber erkannt bei: ${failed.map((f) => f.id).join(', ')} – neuer Versuch mit anderem Seed.`);
		}
	}

	if (pending.length > 0) {
		throw new Error(`Keine saubere Aufnahme für: ${pending.map((p) => p.id).join(', ')}`);
	}

	if (only) {
		console.log('Hinweis: --only erzeugt nur Testdateien (kein Manifest). Dateien:', [...done.values()].join(', '));
	} else {
		for (const s of script.segments) {
			const f = done.get(s.id);
			const line = `  ${s.id.padEnd(12)} ${durationSeconds(f).toFixed(2)} s`;
			if (args.check) {
				const c = whisperCheck(f, parseSegmentText(s.text).display);
				console.log(c ? `${line}\n      Skript:  ${c.expected}\n      Whisper: ${c.heard}` : `${line} (Whisper nicht installiert)`);
			} else {
				console.log(line);
			}
		}

		const {outFile, manifestFile} = assembleVoiceTrack({
			videoId,
			script,
			segments: script.segments.map((s) => ({id: s.id, file: done.get(s.id)})),
			sampleRate: SAMPLE_RATE,
			source: `chatterbox-multilingual:${path.basename(cfg.reference)} (ex ${cfg.exaggeration}, cfg ${cfg.cfgWeight}, tempo ${cfg.tempo})`,
		});
		console.log(`✔ Sprecherspur: ${path.relative(ROOT, outFile)} (${durationSeconds(outFile).toFixed(2)} s)`);
		console.log(`✔ Manifest:     ${path.relative(ROOT, manifestFile)}`);
	}
} finally {
	rmSync(tmp, {recursive: true, force: true});
}
