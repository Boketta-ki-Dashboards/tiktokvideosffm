#!/usr/bin/env node
/**
 * Erzeugt die Sprecherspur mit Piper (kostenlos, offline, keine API-Keys) – Satz für Satz,
 * damit Szenen und Untertitel exakt synchron sind.
 *
 *   npm run voice:setup-piper                      # einmalig
 *   npm run voice:piper -- --video frankfurt-2026-10-31 [--voice de_DE-thorsten-high] [--length-scale 0.84]
 *
 * Ergebnis:
 *   public/voiceover/<video>/voiceover.mp3        (gemastert: −14 LUFS, 48 kHz)
 *   src/videos/<video>/voiceover.json             (Segment-Timings + Untertitel)
 */
import {spawnSync} from 'node:child_process';
import {existsSync, mkdtempSync, rmSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {parseSegmentText} from '../../src/lib/script-timing.ts';
import {durationSeconds, ffmpeg, trimSilenceFilter} from '../lib/ffmpeg.mjs';
import {parseArgs, readScript, ROOT} from '../lib/project.mjs';
import {assembleVoiceTrack} from '../lib/voice-build.mjs';

const args = parseArgs(process.argv.slice(2));
const videoId = args.video ?? 'frankfurt-2026-10-31';
const script = readScript(videoId);
const voice = args.voice ?? script.voice?.piperModel ?? 'de_DE-thorsten-high';
const lengthScale = Number(args['length-scale'] ?? script.voice?.lengthScale ?? 0.9);
const noiseScale = Number(args['noise-scale'] ?? script.voice?.noiseScale ?? 0.667);
const noiseWScale = Number(args['noise-w'] ?? script.voice?.noiseWScale ?? 0.8);

const cache = process.env.PIPER_CACHE ?? path.join(ROOT, '.cache');
const piperBin = process.env.PIPER_BIN ?? path.join(cache, 'piper-venv', 'bin', 'piper');
const model = path.join(process.env.PIPER_VOICE_DIR ?? path.join(cache, 'piper-voices'), `${voice}.onnx`);

if (!existsSync(piperBin) || !existsSync(model)) {
	console.error(`✖ Piper oder Stimme fehlt (${piperBin}, ${model}).\n  Einmalig ausführen: npm run voice:setup-piper -- ${voice}`);
	process.exit(1);
}

const tmp = mkdtempSync(path.join(os.tmpdir(), 'piper-'));
const SAMPLE_RATE = 22050;

try {
	const segments = [];
	for (const [i, segment] of script.segments.entries()) {
		const {spoken} = parseSegmentText(segment.text);
		const raw = path.join(tmp, `${i}-raw.wav`);
		const res = spawnSync(
			piperBin,
			['-m', model, '-f', raw, '--length-scale', String(lengthScale), '--noise-scale', String(noiseScale), '--noise-w-scale', String(noiseWScale)],
			{input: spoken, encoding: 'utf8'},
		);
		if (res.status !== 0) {
			throw new Error(`Piper-Fehler bei Segment "${segment.id}":\n${res.stderr}`);
		}

		const trimmed = path.join(tmp, `${i}.wav`);
		ffmpeg(['-i', raw, '-af', trimSilenceFilter(), '-ar', String(SAMPLE_RATE), '-ac', '1', '-c:a', 'pcm_s16le', trimmed]);
		segments.push({id: segment.id, file: trimmed});
		console.log(`  ${segment.id.padEnd(12)} ${durationSeconds(trimmed).toFixed(2)} s  „${spoken}“`);
	}

	const {outFile, manifestFile} = assembleVoiceTrack({
		videoId,
		script,
		segments,
		sampleRate: SAMPLE_RATE,
		source: `piper:${voice} (length_scale ${lengthScale})`,
	});
	console.log(`✔ Sprecherspur: ${path.relative(ROOT, outFile)} (${durationSeconds(outFile).toFixed(2)} s)`);
	console.log(`✔ Manifest:     ${path.relative(ROOT, manifestFile)}`);
} finally {
	rmSync(tmp, {recursive: true, force: true});
}
