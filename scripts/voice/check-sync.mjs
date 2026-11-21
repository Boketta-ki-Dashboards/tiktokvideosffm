#!/usr/bin/env node
/**
 * Technische Synchron-Prüfung Stimme ↔ Video (ohne Spracherkennung):
 *   node scripts/voice/check-sync.mjs --video <video-id> --mp4 output/<name>.mp4
 *
 * 1. Versatz: Hüllkurven (10-ms-RMS) der Sprecherdatei und des MP4-Tons werden kreuzkorreliert →
 *    gemessener Versatz muss ≤ 40 ms sein (Stimme liegt exakt dort, wo die Untertitel sie erwarten).
 * 2. Vollständigkeit: MP4 ist länger als die Sprecherspur (Stimme/Outro nicht abgeschnitten).
 * 3. Untertitel: lückenlos geordnet, jedes Wort innerhalb seines Satzes, keine Wörter nach Spur-Ende.
 * 4. Lautheit des fertigen MP4: −14 LUFS ± 1,5.
 */
import {spawnSync} from 'node:child_process';
import {appendFileSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {durationSeconds} from '../lib/ffmpeg.mjs';
import {manifestPath, parseArgs, ROOT} from '../lib/project.mjs';

const args = parseArgs(process.argv.slice(2));
const manifest = JSON.parse(readFileSync(manifestPath(args.video), 'utf8'));
const mp4 = path.resolve(ROOT, args.mp4);
const voice = path.join(ROOT, 'public', manifest.audioFile);
const RATE = 8000;
const HOP = 80; // 10 ms

const pcm = (file) => {
	const res = spawnSync('ffmpeg', ['-hide_banner', '-nostdin', '-i', file, '-vn', '-ac', '1', '-ar', String(RATE), '-f', 's16le', '-'], {maxBuffer: 1024 * 1024 * 1024});
	if (res.status !== 0) throw new Error(`ffmpeg konnte ${file} nicht dekodieren`);
	return new Int16Array(res.stdout.buffer, res.stdout.byteOffset, Math.floor(res.stdout.length / 2));
};

const envelope = (s) => {
	const out = new Float64Array(Math.floor(s.length / HOP));
	for (let i = 0; i < out.length; i++) {
		let e = 0;
		for (let k = 0; k < HOP; k++) e += s[i * HOP + k] ** 2;
		out[i] = Math.log10(1 + Math.sqrt(e / HOP));
	}

	const mean = out.reduce((a, b) => a + b, 0) / out.length;
	return out.map((v) => v - mean);
};

const results = [];
const check = (ok, label, detail) => {
	results.push({ok, label, detail});
	console.log(`${ok ? '✔' : '✖'} ${label.padEnd(44)} ${detail}`);
};

const a = envelope(pcm(voice));
const b = envelope(pcm(mp4));
let best = {lag: 0, score: -Infinity};
for (let lag = -50; lag <= 50; lag++) {
	let s = 0;
	for (let i = 0; i < a.length; i++) {
		const j = i + lag;
		if (j >= 0 && j < b.length) s += a[i] * b[j];
	}

	if (s > best.score) best = {lag, score: s};
}

check(Math.abs(best.lag * 10) <= 40, 'Versatz Stimme ↔ Video (Kreuzkorrelation)', `${best.lag * 10} ms`);

const mp4Dur = durationSeconds(mp4);
const voiceDur = durationSeconds(voice);
check(mp4Dur >= voiceDur + 0.3, 'Stimme vollständig im Video (nicht abgeschnitten)', `Video ${mp4Dur.toFixed(2)} s ≥ Stimme ${voiceDur.toFixed(2)} s`);

const caps = manifest.captions;
let ordered = true;
let outside = 0;
for (let i = 0; i < caps.length; i++) {
	if (i > 0 && caps[i].startMs < caps[i - 1].startMs) ordered = false;
	if (!manifest.segments.some((s) => caps[i].startMs >= s.startMs - 5 && caps[i].endMs <= s.endMs + 5)) outside++;
}

check(ordered && outside === 0, 'Untertitel geordnet und innerhalb ihrer Sätze', `${caps.length} Wörter, ${outside} außerhalb`);
check(caps[caps.length - 1].endMs <= voiceDur * 1000 + 5, 'Keine Untertitel nach Ende der Stimme', `letztes Wort endet ${(caps[caps.length - 1].endMs / 1000).toFixed(2)} s`);
check(manifest.captionsSource !== 'script-estimate' || !String(manifest.source).startsWith('elevenlabs'), 'Untertitel aus echten Zeitstempeln', manifest.captionsSource);

const lufs = (() => {
	const res = spawnSync('ffmpeg', ['-hide_banner', '-nostdin', '-i', mp4, '-af', 'ebur128', '-f', 'null', '-'], {encoding: 'utf8', maxBuffer: 64 * 1024 * 1024});
	const m = [...res.stderr.matchAll(/I:\s+(-?[\d.]+) LUFS/g)].pop();
	return m ? Number(m[1]) : NaN;
})();
check(Math.abs(lufs + 14) <= 1.5, 'Lautheit des Videos', `${lufs} LUFS (Ziel −14)`);
if (manifest.voice) console.log(`ℹ Stimme laut Manifest: ${manifest.voice.name} (${manifest.voice.voiceId}), Modell ${manifest.voice.modelId}`);

if (process.env.GITHUB_STEP_SUMMARY) {
	appendFileSync(
		process.env.GITHUB_STEP_SUMMARY,
		`### Synchron-Prüfung\n\n| | Prüfung | Ergebnis |\n|---|---|---|\n${results.map((r) => `| ${r.ok ? '✅' : '❌'} | ${r.label} | ${r.detail} |`).join('\n')}\n` +
			(manifest.voice ? `\nStimme: **${manifest.voice.name}** (\`${manifest.voice.voiceId}\`), Modell \`${manifest.voice.modelId}\`\n` : ''),
	);
}

if (results.some((r) => !r.ok)) process.exit(1);
