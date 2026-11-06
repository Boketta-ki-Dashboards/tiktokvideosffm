#!/usr/bin/env node
/**
 * Technischer Prüfbericht einer fertigen MP4 – direkt aus FFprobe/FFmpeg am echten File, nicht aus Render-Einstellungen.
 *
 *   node scripts/tech-report.mjs output/X.mp4 --md output/X.technik.md --json output/X.technik.json \
 *        [--audio-ref output/original-ton.m4a] [--voice public/voiceover/<id>/voiceover-adam.mp3] [--title "…"]
 *
 * Harte Prüfungen (Exit 1 bei Abweichung): 1080×1920, 30 fps konstant, H.264, yuv420p, AAC, Faststart.
 * Optional `--audio-ref`: dekodiert beide Tonspuren zu PCM und vergleicht Sample für Sample (Ton-Identität).
 */
import {createHash} from 'node:crypto';
import {closeSync, openSync, readFileSync, readSync, statSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {ffprobeJson} from './lib/ffmpeg.mjs';
import {parseArgs, ROOT} from './lib/project.mjs';

const args = parseArgs(process.argv.slice(2));
const file = path.resolve(ROOT, args._[0] ?? '');
const probe = ffprobeJson(file);
const v = probe.streams.find((s) => s.codec_type === 'video');
const a = probe.streams.find((s) => s.codec_type === 'audio');
const fps = (r) => {
	const [n, d] = String(r ?? '0/1').split('/').map(Number);
	return d ? n / d : 0;
};

const topBoxes = (f) => {
	const fd = openSync(f, 'r');
	const size = statSync(f).size;
	const boxes = [];
	let pos = 0;
	const head = Buffer.alloc(16);
	while (pos < size && boxes.length < 20) {
		readSync(fd, head, 0, 16, pos);
		let len = head.readUInt32BE(0);
		const type = head.toString('latin1', 4, 8);
		if (len === 1) len = Number(head.readBigUInt64BE(8));
		if (len < 8) break;
		boxes.push(type);
		pos += len;
	}

	closeSync(fd);
	return boxes;
};

const loudness = (f) => {
	const res = spawnSync('ffmpeg', ['-hide_banner', '-nostdin', '-i', f, '-map', '0:a:0', '-af', 'ebur128=peak=true', '-f', 'null', '-'], {encoding: 'utf8', maxBuffer: 64 * 1024 * 1024});
	const tail = res.stderr.slice(res.stderr.lastIndexOf('Summary:'));
	const num = (re) => Number(tail.match(re)?.[1]);
	return {integratedLufs: num(/I:\s+(-?[\d.]+) LUFS/), loudnessRangeLu: num(/LRA:\s+(-?[\d.]+) LU/), truePeakDbtp: num(/Peak:\s+(-?[\d.]+) dBFS/)};
};

const pcm = (f) => {
	const res = spawnSync('ffmpeg', ['-hide_banner', '-nostdin', '-i', f, '-map', '0:a:0', '-ac', '2', '-ar', '48000', '-f', 's16le', '-'], {maxBuffer: 512 * 1024 * 1024});
	if (res.status !== 0) throw new Error(`PCM-Dekodierung fehlgeschlagen: ${f}`);
	return new Int16Array(res.stdout.buffer, res.stdout.byteOffset, Math.floor(res.stdout.byteLength / 2));
};

const compareAudio = (fa, fb) => {
	const x = pcm(fa);
	const y = pcm(fb);
	const n = Math.min(x.length, y.length);
	let diff = 0;
	let maxAbs = 0;
	let sumSq = 0;
	for (let i = 0; i < n; i++) {
		const d = x[i] - y[i];
		if (d !== 0) {
			diff++;
			const ad = Math.abs(d);
			if (ad > maxAbs) maxAbs = ad;
			sumSq += d * d;
		}
	}

	const rms = Math.sqrt(sumSq / Math.max(1, n));
	return {
		reference: path.relative(ROOT, fa),
		samplesCompared: n,
		lengthDifferenceSamples: Math.abs(x.length - y.length),
		differingSamples: diff,
		maxAbsDifference: maxAbs,
		rmsDifferenceDbfs: rms === 0 ? null : Number((20 * Math.log10(rms / 32768)).toFixed(1)),
		identical: diff === 0 && x.length === y.length,
	};
};

const sha = (f) => createHash('sha256').update(readFileSync(f)).digest('hex');
const boxes = topBoxes(file);
const r = {
	file: path.relative(ROOT, file),
	sizeMb: Number((statSync(file).size / 1024 / 1024).toFixed(2)),
	sha256: sha(file),
	durationSeconds: Number(Number(probe.format.duration).toFixed(3)),
	container: probe.format.format_name,
	video: {
		codec: v?.codec_name,
		profile: v?.profile,
		width: v?.width,
		height: v?.height,
		frameRate: v?.r_frame_rate,
		avgFrameRate: v?.avg_frame_rate,
		frames: Number(v?.nb_frames),
		pixelFormat: v?.pix_fmt,
		colorSpace: v?.color_space ?? null,
		colorPrimaries: v?.color_primaries ?? null,
		colorTransfer: v?.color_transfer ?? null,
		bitrateKbps: Math.round(Number(v?.bit_rate) / 1000),
		sampleAspectRatio: v?.sample_aspect_ratio ?? null,
	},
	audio: a
		? {codec: a.codec_name, profile: a.profile, sampleRate: Number(a.sample_rate), channels: a.channels, bitrateKbps: Math.round(Number(a.bit_rate) / 1000), ...loudness(file)}
		: null,
	faststart: boxes.indexOf('moov') !== -1 && boxes.indexOf('moov') < boxes.indexOf('mdat'),
	topLevelBoxes: boxes,
	voiceTrack: args.voice ? {file: args.voice, sha256: sha(path.resolve(ROOT, String(args.voice)))} : null,
	audioIdentity: args['audio-ref'] ? compareAudio(path.resolve(ROOT, String(args['audio-ref'])), file) : null,
};

const checks = [
	['Auflösung 1080 × 1920 (echte Pixel, ffprobe)', r.video.width === 1080 && r.video.height === 1920, `${r.video.width} × ${r.video.height}`],
	['Bildrate 30 fps konstant', fps(r.video.frameRate) === 30 && Math.abs(fps(r.video.avgFrameRate) - 30) < 0.01, `${r.video.frameRate} (Ø ${r.video.avgFrameRate})`],
	['Video-Codec H.264', r.video.codec === 'h264', `${r.video.codec} ${r.video.profile ?? ''}`],
	['Pixelformat yuv420p', r.video.pixelFormat === 'yuv420p', r.video.pixelFormat],
	['Audio-Codec AAC', r.audio?.codec === 'aac', r.audio ? `${r.audio.codec} ${r.audio.sampleRate} Hz, ${r.audio.channels} ch, ${r.audio.bitrateKbps} kbit/s` : 'keine Tonspur'],
	['Faststart (moov vor mdat)', r.faststart, boxes.join(' → ')],
];
if (r.audioIdentity) {
	checks.push(['Tonspur identisch mit Original (PCM, Sample für Sample)', r.audioIdentity.identical, r.audioIdentity.identical ? '0 abweichende Samples' : `${r.audioIdentity.differingSamples} Samples abweichend, max |Δ| ${r.audioIdentity.maxAbsDifference}, RMS Δ ${r.audioIdentity.rmsDifferenceDbfs} dBFS`]);
}

r.checks = checks.map(([name, ok, value]) => ({name, ok, value}));
r.passed = checks.every(([, ok]) => ok);

const md = [
	`# Technischer Prüfbericht – ${args.title ?? path.basename(file)}`,
	'',
	`Datei: \`${r.file}\` · ${r.sizeMb} MB · ${r.durationSeconds} s · SHA-256 \`${r.sha256.slice(0, 16)}…\``,
	'',
	'| Prüfung | Ergebnis | Wert |',
	'|---|---|---|',
	...r.checks.map((c) => `| ${c.name} | ${c.ok ? '✅' : '❌'} | ${c.value} |`),
	'',
	'## FFprobe (Rohwerte)',
	'',
	'| Feld | Wert |',
	'|---|---|',
	`| Container | ${r.container} |`,
	`| Video | ${r.video.codec} · ${r.video.profile} · ${r.video.width}×${r.video.height} · ${r.video.frameRate} · ${r.video.frames} Frames · ${r.video.bitrateKbps} kbit/s |`,
	`| Pixelformat / Farbraum | ${r.video.pixelFormat} · ${r.video.colorSpace ?? '–'} / ${r.video.colorPrimaries ?? '–'} / ${r.video.colorTransfer ?? '–'} |`,
	r.audio ? `| Audio | ${r.audio.codec} ${r.audio.profile ?? ''} · ${r.audio.sampleRate} Hz · ${r.audio.channels} ch · ${r.audio.bitrateKbps} kbit/s |` : '| Audio | – |',
	r.audio ? `| Lautheit | ${r.audio.integratedLufs} LUFS integriert · LRA ${r.audio.loudnessRangeLu} LU · True Peak ${r.audio.truePeakDbtp} dBTP |` : null,
	`| MP4-Boxen | ${boxes.join(' → ')} |`,
	r.voiceTrack ? `| Adam-Sprecherspur | \`${r.voiceTrack.file}\` · SHA-256 \`${r.voiceTrack.sha256.slice(0, 16)}…\` |` : null,
	'',
	r.audioIdentity
		? `## Ton-Identität\n\nReferenz: \`${r.audioIdentity.reference}\` · verglichen: ${r.audioIdentity.samplesCompared.toLocaleString('de-DE')} Samples (48 kHz, Stereo) · abweichend: ${r.audioIdentity.differingSamples} · Längenunterschied: ${r.audioIdentity.lengthDifferenceSamples} Samples → **${r.audioIdentity.identical ? 'identisch' : 'NICHT identisch'}**\n`
		: null,
	`**Gesamt: ${r.passed ? 'BESTANDEN' : 'NICHT BESTANDEN'}**`,
	'',
]
	.filter((l) => l !== null)
	.join('\n');

if (args.md) writeFileSync(path.resolve(ROOT, String(args.md)), `${md}\n`);
if (args.json) writeFileSync(path.resolve(ROOT, String(args.json)), `${JSON.stringify(r, null, '\t')}\n`);
console.log(md);
if (!r.passed) {
	console.error('✖ Technische Prüfung nicht bestanden.');
	process.exit(1);
}
