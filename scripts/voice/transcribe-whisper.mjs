#!/usr/bin/env node
/**
 * Optional: wortgenaue Untertitel per Whisper (whisper.cpp, lokal & kostenlos, keine API).
 * Ersetzt die geschätzten Wort-Timings im Manifest durch echte Zeitstempel.
 *
 *   npm run captions:whisper -- --video frankfurt-2026-10-31 [--model small]
 *
 * Beim ersten Lauf werden whisper.cpp kompiliert und das Modell geladen (small ≈ 470 MB).
 * Hinweis: Whisper schreibt Zahlen/Namen evtl. anders als das Skript – Ergebnis prüfen!
 */
import {readFileSync, rmSync, mkdtempSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {downloadWhisperModel, installWhisperCpp, toCaptions, transcribe} from '@remotion/install-whisper-cpp';
import {ffmpeg} from '../lib/ffmpeg.mjs';
import {manifestPath, parseArgs, ROOT, writeManifest} from '../lib/project.mjs';

const args = parseArgs(process.argv.slice(2));
const videoId = args.video ?? 'frankfurt-2026-10-31';
const model = args.model ?? 'small';
const version = args['whisper-version'] ?? '1.7.6';
// Ordner NICHT vorab anlegen – installWhisperCpp() erwartet ihn leer bzw. nicht vorhanden
const whisperPath = path.join(ROOT, '.cache', 'whisper.cpp');

const manifest = JSON.parse(readFileSync(manifestPath(videoId), 'utf8'));
if (!manifest.audioFile) {
	console.error('✖ Im Manifest ist keine Sprecherdatei eingetragen. Erst voice:import oder voice:piper ausführen.');
	process.exit(1);
}

await installWhisperCpp({to: whisperPath, version, printOutput: true});
await downloadWhisperModel({model, folder: whisperPath, printOutput: true});

const tmp = mkdtempSync(path.join(os.tmpdir(), 'whisper-'));
try {
	const wav = path.join(tmp, 'input.wav');
	ffmpeg(['-i', path.join(ROOT, 'public', manifest.audioFile), '-ar', '16000', '-ac', '1', '-c:a', 'pcm_s16le', wav]);
	const output = await transcribe({
		inputPath: wav,
		whisperPath,
		whisperCppVersion: version,
		model,
		tokenLevelTimestamps: true,
		language: 'de',
		splitOnWord: true,
	});
	const {captions} = toCaptions({whisperCppOutput: output});
	manifest.captions = captions;
	manifest.captionsSource = 'whisper';
	manifest.generatedAt = new Date().toISOString();
	writeManifest(videoId, manifest);
	console.log(`✔ ${captions.length} Wort-Untertitel aus Whisper (${model}) übernommen.`);
} finally {
	rmSync(tmp, {recursive: true, force: true});
}
