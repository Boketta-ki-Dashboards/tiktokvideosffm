#!/usr/bin/env node
/**
 * Vorher-Nachher-Kontaktbogen zweier Kompositionen an identischen Zeitpunkten (je Szene 4 Frames aus der echten Timeline).
 *
 *   node scripts/compare-scenes.mjs --video frankfurt-2026-11-20-ausblick --plan plan.ts --export NOV20_SCENES \
 *        --a FrankfurtNov20Forecast --b FrankfurtNov20ForecastPremium --out output/vergleich
 *
 * Ohne --b entstehen nur die Referenzbilder von --a. Ergebnis: <out>/<comp>/*.png, <out>/vergleich-<szene>.png,
 * <out>/vergleich-gesamt.jpg (links Original, rechts Premium).
 */
import {mkdirSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {renderStill, selectComposition} from '@remotion/renderer';
import {ffmpeg} from './lib/ffmpeg.mjs';
import {parseArgs, ROOT} from './lib/project.mjs';
import {findBrowserExecutable, makeBundle} from './lib/remotion.mjs';
import {sceneFrames} from './lib/scene-frames.mjs';

const args = parseArgs(process.argv.slice(2));
const outDir = path.resolve(ROOT, args.out ?? 'output/vergleich');
const comps = [args.a, args.b].filter(Boolean);
const scale = Number(args.scale ?? 0.5);
const W = Math.round(1080 * scale);
const H = Math.round(1920 * scale);

const scenes = await sceneFrames({videoId: args.video, planModule: args.plan ?? 'plan.ts', planExport: args.export});
const serveUrl = await makeBundle();
const browserExecutable = findBrowserExecutable();

for (const id of comps) {
	const composition = await selectComposition({serveUrl, id, browserExecutable});
	mkdirSync(path.join(outDir, id), {recursive: true});
	for (const s of scenes) {
		for (const f of s.frames) {
			const frame = Math.min(f, composition.durationInFrames - 1);
			await renderStill({composition, serveUrl, output: path.join(outDir, id, `${s.id}-${String(frame).padStart(4, '0')}.png`), frame, scale, browserExecutable, imageFormat: 'png'});
		}
	}

	console.log(`✔ ${id}: ${scenes.length * 4} Referenzbilder`);
}

const label = (text, color) => `drawbox=x=0:y=0:w=iw:h=44:color=black@0.75:t=fill,drawtext=text='${text}':x=12:y=10:fontsize=24:fontcolor=${color}`;
const sheets = [];
for (const s of scenes) {
	const inputs = [];
	const filters = [];
	let n = 0;
	for (const f of s.frames) {
		for (const [ci, id] of comps.entries()) {
			inputs.push('-i', path.join(outDir, id, `${s.id}-${String(f).padStart(4, '0')}.png`));
			const tag = comps.length > 1 ? (ci === 0 ? 'ORIGINAL' : 'PREMIUM') : id;
			filters.push(`[${n}]scale=${W}:${H},${label(`${tag}  ${s.id}  Frame ${f}`, ci === 0 ? 'white' : 'yellow')}[v${n}]`);
			n++;
		}
	}

	const layout = Array.from({length: n}, (_, i) => `${i * W}_0`).join('|');
	const file = path.join(outDir, `vergleich-${s.id}.png`);
	ffmpeg([...inputs, '-filter_complex', `${filters.join(';')};${Array.from({length: n}, (_, i) => `[v${i}]`).join('')}xstack=inputs=${n}:layout=${layout}[out]`, '-map', '[out]', file]);
	sheets.push(file);
}

// Gesamtbogen: alle Szenen untereinander, verkleinert (JPEG, handyfreundlich)
const rowW = W * 4 * comps.length;
const total = path.join(outDir, 'vergleich-gesamt.jpg');
ffmpeg([
	...sheets.flatMap((f) => ['-i', f]),
	'-filter_complex',
	`${sheets.map((_, i) => `[${i}]scale=${Math.round(rowW / 2)}:-1[r${i}]`).join(';')};${sheets.map((_, i) => `[r${i}]`).join('')}vstack=inputs=${sheets.length}[out]`,
	'-map',
	'[out]',
	'-q:v',
	'3',
	total,
]);
writeFileSync(path.join(outDir, 'frames.json'), `${JSON.stringify(scenes, null, '\t')}\n`);
console.log(`✔ Kontaktbögen: ${path.relative(ROOT, outDir)} (${sheets.length} Szenen + vergleich-gesamt.jpg)`);
