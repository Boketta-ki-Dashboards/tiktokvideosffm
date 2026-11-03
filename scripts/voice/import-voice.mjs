#!/usr/bin/env node
/**
 * Importiert eine FERTIGE Sprecherdatei (MP3/WAV/M4A …, z. B. aus einer TTS-App oder eigener Aufnahme).
 *
 *   npm run voice:import -- --video frankfurt-2026-10-31 --file voice-input/sprecher.mp3
 *
 * Schritte:
 *   1. Prüfen (FFprobe), Stille am Anfang/Ende entfernen
 *   2. Mastering: −14 LUFS, Präsenz-EQ, Kompressor, 48 kHz
 *   3. Satzgrenzen über Sprechpausen erkennen (silencedetect) und den Skript-Segmenten zuordnen
 *   4. public/voiceover/<video>/voiceover.mp3 + src/videos/<video>/voiceover.json schreiben
 *
 * Optionen: --no-master (nur konvertieren) · --even (Segmente proportional statt per Pausen)
 *           --noise -40 (dB-Schwelle für Pausen) · --lead-in 300 (ms Stille vorab)
 * Für wortgenaue Untertitel danach: npm run captions:whisper -- --video <id>
 */
import {existsSync, mkdtempSync, rmSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {estimateCaptionsForSegments, parseSegmentText} from '../../src/lib/script-timing.ts';
import {detectSilences, durationSeconds, ffmpeg, ffprobeJson, masterVoice, trimSilenceFilter} from '../lib/ffmpeg.mjs';
import {ensureDir, parseArgs, readScript, ROOT, writeManifest} from '../lib/project.mjs';

const args = parseArgs(process.argv.slice(2));
const videoId = args.video ?? 'frankfurt-2026-10-31';
const input = args.file ?? args._[0];
if (!input || !existsSync(input)) {
	console.error('✖ Bitte eine vorhandene Audiodatei angeben: --file pfad/zur/datei.mp3');
	process.exit(1);
}

const probe = ffprobeJson(input);
const audio = probe.streams.find((s) => s.codec_type === 'audio');
if (!audio) {
	console.error('✖ Die Datei enthält keine Audiospur.');
	process.exit(1);
}

const script = readScript(videoId);
const leadInMs = Number(args['lead-in'] ?? script.leadInMs ?? 300);
const tmp = mkdtempSync(path.join(os.tmpdir(), 'voice-import-'));

try {
	console.log(`→ ${path.basename(input)}: ${audio.codec_name}, ${audio.sample_rate} Hz, ${audio.channels} Kanal/Kanäle, ${Number(probe.format.duration).toFixed(2)} s`);

	// 1 + 2: trimmen, (mastern), mono 48 kHz
	const trimmed = path.join(tmp, 'trimmed.wav');
	ffmpeg(['-i', input, '-af', `${trimSilenceFilter(-45)},aresample=48000`, '-ac', '1', '-c:a', 'pcm_s16le', trimmed]);
	const work = path.join(tmp, 'work.wav');
	if (args['no-master']) {
		ffmpeg(['-i', trimmed, '-c:a', 'pcm_s16le', work]);
	} else {
		const {measuredLufs} = masterVoice(trimmed, work, {codecArgs: ['-c:a', 'pcm_s16le']});
		console.log(`→ Lautheit vorher ${measuredLufs.toFixed(1)} LUFS → normalisiert auf −14 LUFS`);
	}
	const speechMs = Math.round(durationSeconds(work) * 1000);

	// 3: Segmentgrenzen bestimmen
	const weights = script.segments.map((s) => parseSegmentText(s.text).words.reduce((sum, w) => sum + w.weight, 0));
	const totalWeight = weights.reduce((a, b) => a + b, 0);
	const n = script.segments.length;
	let bounds = []; // n-1 Einträge {start, end} in ms (Pause zwischen Segment k und k+1)

	if (n > 1 && !args.even) {
		const silences = detectSilences(work, {noiseDb: Number(args.noise ?? -40), minSeconds: 0.12}).map((s) => ({
			start: s.start * 1000,
			end: s.end * 1000,
		}));
		let used = new Set();
		let cum = 0;
		for (let k = 0; k < n - 1; k++) {
			cum += weights[k];
			const expected = (cum / totalWeight) * speechMs;
			let best = null;
			let bestScore = Infinity;
			for (const [idx, s] of silences.entries()) {
				if (used.has(idx)) continue;
				const prev = bounds[bounds.length - 1];
				if (prev && s.start <= prev.end) continue;
				const mid = (s.start + s.end) / 2;
				const score = Math.abs(mid - expected) / 1000 - 1.5 * ((s.end - s.start) / 1000);
				if (score < bestScore) {
					bestScore = score;
					best = idx;
				}
			}

			if (best === null || bestScore > 2.5) {
				bounds = [];
				break;
			}

			used.add(best);
			bounds.push(silences[best]);
		}

		if (bounds.length !== n - 1) {
			console.warn('⚠ Pausen nicht eindeutig erkannt – verteile Segmente proportional zum Text.');
			bounds = [];
		}
	}

	if (bounds.length === 0 && n > 1) {
		let cum = 0;
		for (let k = 0; k < n - 1; k++) {
			cum += weights[k];
			const t = (cum / totalWeight) * speechMs;
			bounds.push({start: t, end: t});
		}
	}

	const timings = script.segments.map((s, k) => ({
		id: s.id,
		startMs: Math.round((k === 0 ? 0 : bounds[k - 1].end) + leadInMs),
		endMs: Math.round((k === n - 1 ? speechMs : bounds[k].start) + leadInMs),
	}));

	// 4: Ausgabe
	const outDir = ensureDir(path.join(ROOT, 'public', 'voiceover', videoId));
	const outFile = path.join(outDir, 'voiceover.mp3');
	ffmpeg(['-i', work, '-af', `adelay=${leadInMs}:all=1`, '-ac', '1', '-c:a', 'libmp3lame', '-b:a', '192k', outFile]);

	const manifest = {
		version: 1,
		videoId,
		source: `import:${path.basename(input)}`,
		audioFile: `voiceover/${videoId}/voiceover.mp3`,
		durationMs: timings[timings.length - 1].endMs,
		segments: timings,
		captions: estimateCaptionsForSegments(script, timings),
		captionsSource: 'script-estimate',
		generatedAt: new Date().toISOString(),
	};
	writeManifest(videoId, manifest);
	for (const t of timings) {
		console.log(`  ${t.id.padEnd(12)} ${(t.startMs / 1000).toFixed(2)}–${(t.endMs / 1000).toFixed(2)} s`);
	}

	console.log(`✔ Importiert: ${path.relative(ROOT, outFile)} (${(manifest.durationMs / 1000).toFixed(2)} s inkl. ${leadInMs} ms Vorlauf)`);
	console.log('  Tipp: Für wortgenaue Untertitel → npm run captions:whisper -- --video ' + videoId);
} finally {
	rmSync(tmp, {recursive: true, force: true});
}
