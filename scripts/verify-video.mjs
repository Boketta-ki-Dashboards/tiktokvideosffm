#!/usr/bin/env node
/**
 * Prüft ein exportiertes Video gegen die SmokingTikTok-Exportnorm.
 *
 *   npm run verify -- output/FrankfurtHeadlines.mp4 [--min 15] [--max 60] [--allow-no-audio] [--json report.json]
 *
 * Prüft: Container MP4, H.264 (High/Main), 1080×1920, 30 fps, yuv420p, AAC-Ton, Dauer,
 * Faststart (moov vor mdat), fehlerfreie Dekodierung. Exit-Code ≠ 0 bei Fehlern.
 */
import {closeSync, openSync, readSync, statSync, writeFileSync, appendFileSync, existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {ffprobeJson} from './lib/ffmpeg.mjs';
import {parseArgs} from './lib/project.mjs';

const args = parseArgs(process.argv.slice(2));
const file = args._[0];
if (!file || !existsSync(file)) {
	console.error('✖ Bitte Videodatei angeben: npm run verify -- output/video.mp4');
	process.exit(2);
}

const minDur = Number(args.min ?? 1);
const maxDur = Number(args.max ?? 600);
const probe = ffprobeJson(file);
const v = probe.streams.find((s) => s.codec_type === 'video');
const a = probe.streams.find((s) => s.codec_type === 'audio');
const duration = Number(probe.format.duration);

/** Reihenfolge der MP4-Top-Level-Boxen lesen (moov vor mdat = Faststart). */
const topLevelBoxes = (f) => {
	const fd = openSync(f, 'r');
	const size = statSync(f).size;
	const boxes = [];
	let pos = 0;
	const buf = Buffer.alloc(16);
	while (pos < size && boxes.length < 50) {
		readSync(fd, buf, 0, 16, pos);
		let len = buf.readUInt32BE(0);
		const type = buf.toString('latin1', 4, 8);
		if (len === 1) len = Number(buf.readBigUInt64BE(8));
		if (len === 0) len = size - pos;
		boxes.push(type);
		if (len < 8) break;
		pos += len;
	}

	closeSync(fd);
	return boxes;
};

const boxes = topLevelBoxes(file);
const fps = v ? v.avg_frame_rate.split('/').reduce((n, d) => Number(n) / Number(d)) : 0;
const decode = spawnSync('ffmpeg', ['-hide_banner', '-nostdin', '-v', 'error', '-i', file, '-f', 'null', '-'], {encoding: 'utf8'});

const checks = [
	['Container MP4', /mp4/.test(probe.format.format_name), probe.format.format_name],
	['Videocodec H.264', v?.codec_name === 'h264', v?.codec_name],
	['H.264-Profil High/Main (iPhone)', ['High', 'Main', 'Constrained Baseline'].includes(v?.profile), v?.profile],
	['Auflösung 1080×1920', v?.width === 1080 && v?.height === 1920, `${v?.width}×${v?.height}`],
	['30 fps', Math.abs(fps - 30) < 0.01, fps.toFixed(3)],
	['Pixelformat yuv420p', v?.pix_fmt === 'yuv420p', v?.pix_fmt],
	['Audiospur AAC', args['allow-no-audio'] ? true : a?.codec_name === 'aac', a ? `${a.codec_name} ${a.sample_rate} Hz, ${a.channels} ch` : 'keine'],
	[`Dauer ${minDur}–${maxDur} s`, duration >= minDur && duration <= maxDur, `${duration.toFixed(2)} s`],
	['Faststart (moov vor mdat)', boxes.indexOf('moov') !== -1 && boxes.indexOf('moov') < boxes.indexOf('mdat'), boxes.join(' → ')],
	['Fehlerfreie Dekodierung', decode.status === 0 && decode.stderr.trim() === '', decode.stderr.trim().slice(0, 200) || 'ok'],
];

const sizeMb = statSync(file).size / 1024 / 1024;
const lines = [`Prüfbericht: ${path.basename(file)} (${sizeMb.toFixed(1)} MB, ${(Number(probe.format.bit_rate) / 1e6).toFixed(1)} Mbit/s)`];
for (const [name, ok, detail] of checks) {
	lines.push(`${ok ? '✔' : '✖'} ${name.padEnd(34)} ${detail ?? ''}`);
}

const failed = checks.filter(([, ok]) => !ok);
lines.push(failed.length === 0 ? '✔ Alle Prüfungen bestanden – bereit für TikTok/iPhone.' : `✖ ${failed.length} Prüfung(en) fehlgeschlagen.`);
console.log(lines.join('\n'));

if (args.json) {
	writeFileSync(args.json, JSON.stringify({file, sizeMb, duration, checks: checks.map(([name, ok, detail]) => ({name, ok, detail}))}, null, 2));
}

if (process.env.GITHUB_STEP_SUMMARY) {
	appendFileSync(
		process.env.GITHUB_STEP_SUMMARY,
		`### 🎬 ${path.basename(file)}\n\n| Prüfung | Ergebnis | Detail |\n|---|---|---|\n${checks
			.map(([name, ok, detail]) => `| ${name} | ${ok ? '✅' : '❌'} | ${String(detail ?? '').replace(/\|/g, '\\|')} |`)
			.join('\n')}\n\n**Größe:** ${sizeMb.toFixed(1)} MB · **Dauer:** ${duration.toFixed(2)} s\n`,
	);
}

process.exit(failed.length === 0 ? 0 : 1);
