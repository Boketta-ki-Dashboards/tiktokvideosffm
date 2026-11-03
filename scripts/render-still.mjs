#!/usr/bin/env node
/**
 * Rendert einzelne Frames als PNG (schnelle visuelle Kontrolle ohne komplettes Video).
 *
 *   npm run still -- --comp FrankfurtHeadlines --frames 0,60,120 [--out output/stills] [--scale 0.5]
 *   npm run still -- --comp FrankfurtHeadlines --every 30
 */
import path from 'node:path';
import {renderStill, selectComposition} from '@remotion/renderer';
import {ensureDir, parseArgs, ROOT} from './lib/project.mjs';
import {findBrowserExecutable, makeBundle} from './lib/remotion.mjs';

const args = parseArgs(process.argv.slice(2));
const compId = args.comp ?? 'FrankfurtHeadlines';
const outDir = ensureDir(path.resolve(ROOT, args.out ?? 'output/stills'));
const scale = Number(args.scale ?? 0.5);
const inputProps = args.props ? JSON.parse(args.props) : {};

const serveUrl = await makeBundle();
const browserExecutable = findBrowserExecutable();
const composition = await selectComposition({serveUrl, id: compId, inputProps, browserExecutable});

let frames;
if (args.frames) {
	frames = String(args.frames)
		.split(',')
		.map((f) => Number(f.trim()))
		.filter((f) => Number.isFinite(f));
} else {
	const every = Number(args.every ?? 30);
	frames = [];
	for (let f = 0; f < composition.durationInFrames; f += every) {
		frames.push(f);
	}
}

console.log(`${compId}: ${composition.durationInFrames} Frames (${(composition.durationInFrames / composition.fps).toFixed(2)} s) – rendere ${frames.length} Standbilder`);
for (const frame of frames) {
	const clamped = Math.min(frame, composition.durationInFrames - 1);
	const output = path.join(outDir, `${compId}-${String(clamped).padStart(4, '0')}.png`);
	await renderStill({composition, serveUrl, output, frame: clamped, inputProps, scale, browserExecutable, imageFormat: 'png'});
	console.log(`✔ ${path.relative(ROOT, output)}`);
}
