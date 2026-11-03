#!/usr/bin/env node
/**
 * Erzeugt einfache, lizenzfreie Soundeffekte rein synthetisch mit FFmpeg
 * (keine Samples Dritter → keine Lizenzfragen). Ausgabe: public/sfx/*.wav
 */
import path from 'node:path';
import {ffmpeg} from '../lib/ffmpeg.mjs';
import {ensureDir, ROOT} from '../lib/project.mjs';

const out = ensureDir(path.join(ROOT, 'public', 'sfx'));

const effects = {
	// Luftiger „Whoosh“ für Schnitte/Schwenks
	'whoosh.wav': [
		'-f', 'lavfi', '-i', 'anoisesrc=d=0.75:c=pink:a=0.9:r=48000',
		'-af', 'highpass=f=350,lowpass=f=5200,afade=t=in:d=0.42:curve=exp,afade=t=out:st=0.42:d=0.33:curve=exp,volume=0.9,aecho=0.6:0.4:35:0.25,pan=stereo|c0=c0|c1=c0',
	],
	// Tiefer Aufprall für harte Schnitte
	'impact.wav': [
		'-f', 'lavfi', '-i', 'sine=f=52:d=0.9:r=48000',
		'-f', 'lavfi', '-i', 'anoisesrc=d=0.9:c=brown:a=0.8:r=48000',
		'-filter_complex',
		'[0]volume=1.1,afade=t=out:st=0.05:d=0.8:curve=exp[a];[1]lowpass=f=700,afade=t=out:st=0.02:d=0.35:curve=exp,volume=0.8[b];[a][b]amix=inputs=2:normalize=0,alimiter=limit=0.9,pan=stereo|c0=c0|c1=c0',
	],
	// Kurzer „Pop“ für erscheinende Elemente
	'pop.wav': [
		'-f', 'lavfi', '-i', 'sine=f=880:d=0.14:r=48000',
		'-af', 'afade=t=in:d=0.005,afade=t=out:st=0.01:d=0.13:curve=exp,volume=0.6,pan=stereo|c0=c0|c1=c0',
	],
};

for (const [name, args] of Object.entries(effects)) {
	ffmpeg([...args, '-c:a', 'pcm_s16le', path.join(out, name)]);
	console.log(`✔ ${path.relative(ROOT, path.join(out, name))}`);
}
