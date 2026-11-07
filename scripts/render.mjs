#!/usr/bin/env node
/**
 * Rendert eine Komposition als TikTok-/iPhone-kompatibles MP4 und prüft das Ergebnis.
 *
 *   npm run render -- FrankfurtHeadlines [--out output/frankfurt.mp4] [--crf 18] [--concurrency 4] [--no-verify]
 *
 * Standard: 1080×1920, 30 fps, H.264 High, yuv420p, BT.709, AAC 192 kbit/s, +faststart.
 */
import {renameSync, statSync} from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {ffmpeg} from './lib/ffmpeg.mjs';
import {ensureDir, parseArgs, ROOT} from './lib/project.mjs';
import {findBrowserExecutable} from './lib/remotion.mjs';

const args = parseArgs(process.argv.slice(2));
const compId = args._[0] ?? args.comp ?? 'FrankfurtHeadlines';
const out = path.resolve(ROOT, args.out ?? `output/${compId}.mp4`);
ensureDir(path.dirname(out));
const raw = out.replace(/\.mp4$/, '.raw.mp4');

const cliArgs = [
	'remotion',
	'render',
	'src/index.ts',
	compId,
	raw,
	'--codec=h264',
	`--crf=${args.crf ?? 18}`,
	'--pixel-format=yuv420p',
	'--color-space=bt709',
	'--x264-preset=medium',
	'--audio-codec=aac',
	'--audio-bitrate=192k',
	'--image-format=jpeg',
	'--jpeg-quality=92',
	'--overwrite',
];
if (args.concurrency) cliArgs.push(`--concurrency=${args.concurrency}`);
if (args.props) cliArgs.push(`--props=${args.props}`);
if (args.frames) cliArgs.push(`--frames=${args.frames}`);
const browser = findBrowserExecutable();
if (browser) cliArgs.push(`--browser-executable=${browser}`);

console.log(`→ Rendere ${compId} …`);
const started = Date.now();
const res = spawnSync('npx', cliArgs, {cwd: ROOT, stdio: 'inherit'});
if (res.status !== 0) {
	console.error('✖ Rendering fehlgeschlagen.');
	process.exit(res.status ?? 1);
}

// moov-Atom an den Anfang (schnelles Abspielen/Hochladen, iPhone/TikTok-freundlich)
ffmpeg(['-i', raw, '-map', '0', '-c', 'copy', '-movflags', '+faststart', out]);
renameSync(raw, `${raw}.tmp`);
spawnSync('rm', ['-f', `${raw}.tmp`]);

const mb = statSync(out).size / 1024 / 1024;
console.log(`✔ ${path.relative(ROOT, out)} (${mb.toFixed(1)} MB, ${((Date.now() - started) / 1000).toFixed(0)} s)`);

if (!args['no-verify']) {
	const verifyArgs = ['scripts/verify-video.mjs', out];
	for (const k of ['min', 'max', 'json']) if (args[k] !== undefined) verifyArgs.push(`--${k}`, String(args[k]));
	if (args['allow-no-audio']) verifyArgs.push('--allow-no-audio');
	const v = spawnSync('node', verifyArgs, {cwd: ROOT, stdio: 'inherit'});
	process.exit(v.status ?? 1);
}
