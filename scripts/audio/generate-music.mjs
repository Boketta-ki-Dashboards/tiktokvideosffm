#!/usr/bin/env node
/**
 * Erzeugt ein ruhiges, nahtlos loopbares Musikbett rein synthetisch mit FFmpeg
 * (Moll-Akkord-Teppich, langsames Tremolo – keine Samples Dritter → keine Lizenzfragen).
 * Alle Frequenzen und Tremolo-Raten ergeben in 24 s ganze Schwingungen → der Loop ist ohne Knacken.
 * Ausgabe: public/music/ambient-bed.mp3 (≈ 300 KB). Dokumentation: references/musik.md
 */
import path from 'node:path';
import {ffmpeg} from '../lib/ffmpeg.mjs';
import {ensureDir, ROOT} from '../lib/project.mjs';

const out = ensureDir(path.join(ROOT, 'public', 'music'));
const D = 24;
const tone = (f, vol, label) => `sine=f=${f}:d=${D}:r=44100[${label}raw];[${label}raw]volume=${vol}[${label}]`;

const graph = [
	tone(55, 0.5, 'a'), // A1
	tone(82.5, 0.35, 'b'), // E2
	tone(110, 0.3, 'c'), // A2
	tone(130.5, 0.22, 'd'), // C3 (Moll-Terz, 4 Cent tief – unhörbar)
	tone(165, 0.2, 'e'), // E3
	tone(330, 0.06, 'f'), // E4 – zarter Schimmer
	'[a]tremolo=f=0.5:d=0.55[a2]',
	'[f]tremolo=f=0.25:d=0.8[f2]',
	'[b][c][d][e]amix=inputs=4:normalize=0,tremolo=f=0.125:d=0.35[mid]',
	'[a2][mid][f2]amix=inputs=3:normalize=0,lowpass=f=1100,alimiter=limit=0.8,pan=stereo|c0=c0|c1=c0[out]',
].join(';');

ffmpeg(['-filter_complex', graph, '-map', '[out]', '-c:a', 'libmp3lame', '-b:a', '96k', path.join(out, 'ambient-bed.mp3')]);
console.log(`✔ ${path.relative(ROOT, path.join(out, 'ambient-bed.mp3'))}`);
