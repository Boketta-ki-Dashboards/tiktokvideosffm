#!/usr/bin/env node
/**
 * Erzeugt lizenzfreie Soundeffekte rein synthetisch mit FFmpeg
 * (keine Samples Dritter → keine Lizenzfragen). Ausgabe: public/sfx/*.wav
 *
 *   node scripts/audio/generate-sfx.mjs            # nur fehlende Effekte erzeugen
 *   node scripts/audio/generate-sfx.mjs --force    # alle neu erzeugen (ändert bestehende Videos!)
 *
 * Bestehende Dateien werden standardmäßig NICHT überschrieben, damit fertige Folgen exakt gleich klingen.
 * Rausch-Effekte nutzen feste Seeds → reproduzierbar. Semantische Namen + Lautstärken: src/lib/sfx.ts.
 */
import {spawnSync} from 'node:child_process';
import {existsSync, unlinkSync} from 'node:fs';
import path from 'node:path';
import {ffmpeg} from '../lib/ffmpeg.mjs';
import {ensureDir, ROOT} from '../lib/project.mjs';

const force = process.argv.includes('--force');
const out = ensureDir(path.join(ROOT, 'public', 'sfx'));
const R = 48000;
const mono2stereo = 'pan=stereo|c0=c0|c1=c0';
/** Neue Effekte werden auf einen einheitlichen Spitzenpegel gebracht; die Mischung regelt src/lib/sfx.ts. */
const PEAK_DB = -3;
const LEGACY = new Set(['whoosh.wav', 'impact.wav', 'pop.wav']);

const maxVolumeDb = (file) => {
	const res = spawnSync('ffmpeg', ['-hide_banner', '-nostdin', '-i', file, '-af', 'volumedetect', '-f', 'null', '-'], {encoding: 'utf8'});
	const m = res.stderr.match(/max_volume: (-?[\d.]+) dB/);
	return m ? Number(m[1]) : 0;
};

/** Mehrere Tastenanschläge mit unregelmäßigen Abständen (deterministisch). */
const typewriter = () => {
	const hits = [0, 95, 170, 290, 345, 460, 520, 640, 730, 790, 905, 1010];
	const inputs = [];
	const parts = [];
	hits.forEach((ms, i) => {
		inputs.push('-f', 'lavfi', '-i', `anoisesrc=d=0.03:c=white:a=0.9:r=${R}:seed=${101 + i}`);
		const gain = (0.55 + ((i * 37) % 10) / 22).toFixed(2);
		parts.push(`[${i}]highpass=f=1800,lowpass=f=7500,afade=t=out:st=0.004:d=0.026:curve=exp,volume=${gain},adelay=${ms}|${ms}[k${i}]`);
	});
	inputs.push('-f', 'lavfi', '-i', `aevalsrc=exprs='0.35*sin(2*PI*180*t)*exp(-t*60)':d=0.08:s=${R}`);
	parts.push(`[${hits.length}]adelay=1010|1010[ding]`);
	const labels = hits.map((_, i) => `[k${i}]`).join('') + '[ding]';
	return [...inputs, '-filter_complex', `${parts.join(';')};${labels}amix=inputs=${hits.length + 1}:normalize=0,alimiter=limit=0.8,${mono2stereo}`];
};

const effects = {
	// ---- Bestand (Folge 1–3) ----
	// Luftiger „Whoosh“ für Schnitte/Schwenks
	'whoosh.wav': [
		'-f', 'lavfi', '-i', `anoisesrc=d=0.75:c=pink:a=0.9:r=${R}`,
		'-af', `highpass=f=350,lowpass=f=5200,afade=t=in:d=0.42:curve=exp,afade=t=out:st=0.42:d=0.33:curve=exp,volume=0.9,aecho=0.6:0.4:35:0.25,${mono2stereo}`,
	],
	// Tiefer Aufprall für harte Schnitte
	'impact.wav': [
		'-f', 'lavfi', '-i', `sine=f=52:d=0.9:r=${R}`,
		'-f', 'lavfi', '-i', `anoisesrc=d=0.9:c=brown:a=0.8:r=${R}`,
		'-filter_complex',
		`[0]volume=1.1,afade=t=out:st=0.05:d=0.8:curve=exp[a];[1]lowpass=f=700,afade=t=out:st=0.02:d=0.35:curve=exp,volume=0.8[b];[a][b]amix=inputs=2:normalize=0,alimiter=limit=0.9,${mono2stereo}`,
	],
	// Kurzer „Pop“ für erscheinende Elemente
	'pop.wav': [
		'-f', 'lavfi', '-i', `sine=f=880:d=0.14:r=${R}`,
		'-af', `afade=t=in:d=0.005,afade=t=out:st=0.01:d=0.13:curve=exp,volume=0.6,${mono2stereo}`,
	],

	// ---- Neu (ab „FrankfurtWorldwide“) ----
	// Trockener UI-Klick (Text, Kalender, Chips)
	'click.wav': [
		'-f', 'lavfi', '-i', `anoisesrc=d=0.035:c=white:a=0.9:r=${R}:seed=7`,
		'-f', 'lavfi', '-i', `aevalsrc=exprs='0.5*sin(2*PI*2300*t)*exp(-t*220)':d=0.035:s=${R}`,
		'-filter_complex', `[0]highpass=f=2500,afade=t=out:st=0.002:d=0.03:curve=exp,volume=0.7[n];[n][1]amix=inputs=2:normalize=0,alimiter=limit=0.8,${mono2stereo}`,
	],
	// Zwei-Ton-Benachrichtigung (Social-Karten, Faktencheck-Hinweis)
	'notify.wav': [
		'-f', 'lavfi', '-i', `aevalsrc=exprs='0.45*sin(2*PI*1318.5*t)*exp(-t*14)+0.12*sin(2*PI*2637*t)*exp(-t*22)':d=0.32:s=${R}`,
		'-f', 'lavfi', '-i', `aevalsrc=exprs='0.45*sin(2*PI*1760*t)*exp(-t*9)+0.1*sin(2*PI*3520*t)*exp(-t*18)':d=0.45:s=${R}`,
		'-filter_complex', `[1]adelay=95|95[b];[0][b]amix=inputs=2:normalize=0,afade=t=out:st=0.38:d=0.15,alimiter=limit=0.8,aecho=0.7:0.3:60:0.18,${mono2stereo}`,
	],
	// Elektronischer Blip (Kartenpunkt, Land leuchtet auf)
	'blip.wav': [
		'-f', 'lavfi', '-i', `aevalsrc=exprs='0.5*sin(2*PI*(520*t+2600*t*t))*exp(-t*16)':d=0.2:s=${R}`,
		'-af', `afade=t=in:d=0.003,highpass=f=200,aecho=0.6:0.3:45:0.2,${mono2stereo}`,
	],
	// Tastatur-Tippen (Schlagzeilen erscheinen)
	'typewriter.wav': typewriter(),
	// Papier-Wischer (Nachrichtenkarte fliegt ein)
	'paper.wav': [
		'-f', 'lavfi', '-i', `anoisesrc=d=0.42:c=white:a=0.8:r=${R}:seed=23`,
		'-af', `highpass=f=1400,lowpass=f=7800,tremolo=f=26:d=0.45,afade=t=in:d=0.06:curve=exp,afade=t=out:st=0.12:d=0.3:curve=exp,volume=0.75,${mono2stereo}`,
	],
	// Weicher Aufprall (Statistik-Karten)
	'soft-impact.wav': [
		'-f', 'lavfi', '-i', `aevalsrc=exprs='0.85*sin(2*PI*(95*t-30*t*t))*exp(-t*8)':d=0.7:s=${R}`,
		'-f', 'lavfi', '-i', `anoisesrc=d=0.25:c=brown:a=0.6:r=${R}:seed=11`,
		'-filter_complex', `[1]lowpass=f=450,afade=t=out:st=0.01:d=0.22:curve=exp,volume=0.5[n];[0][n]amix=inputs=2:normalize=0,alimiter=limit=0.85,${mono2stereo}`,
	],
	// Tiefer cineastischer Akzent (Weltkarten-Finale)
	'boom.wav': [
		'-f', 'lavfi', '-i', `aevalsrc=exprs='0.9*sin(2*PI*(46*t-3.2*t*t))*exp(-t*1.25)':d=3.2:s=${R}`,
		'-f', 'lavfi', '-i', `anoisesrc=d=3.2:c=brown:a=0.7:r=${R}:seed=5`,
		'-filter_complex', `[1]lowpass=f=260,afade=t=in:d=0.02,afade=t=out:st=0.05:d=2.4:curve=exp,volume=0.6[n];[0][n]amix=inputs=2:normalize=0,aecho=0.8:0.5:120|240:0.3|0.2,afade=t=out:st=2.4:d=0.8,alimiter=limit=0.9,${mono2stereo}`,
	],
	// Aufsteigender Riser vor dem Finale
	'riser.wav': [
		'-f', 'lavfi', '-i', `aevalsrc=exprs='0.25*sin(2*PI*(180*t+260*t*t))*(t/1.4)':d=1.4:s=${R}`,
		'-f', 'lavfi', '-i', `anoisesrc=d=1.4:c=pink:a=0.6:r=${R}:seed=31`,
		'-filter_complex', `[1]highpass=f=900,afade=t=in:d=1.3:curve=exp,volume=0.45[n];[0][n]amix=inputs=2:normalize=0,afade=t=out:st=1.32:d=0.08,alimiter=limit=0.8,${mono2stereo}`,
	],
	// Stempel (Faktencheck „Falsch“)
	'stamp.wav': [
		'-f', 'lavfi', '-i', `aevalsrc=exprs='0.8*sin(2*PI*(150*t-60*t*t))*exp(-t*22)':d=0.3:s=${R}`,
		'-f', 'lavfi', '-i', `anoisesrc=d=0.08:c=white:a=0.7:r=${R}:seed=3`,
		'-filter_complex', `[1]bandpass=f=1800:w=1400,afade=t=out:st=0.005:d=0.07:curve=exp,volume=0.6[n];[0][n]amix=inputs=2:normalize=0,alimiter=limit=0.85,${mono2stereo}`,
	],
};

for (const [name, args] of Object.entries(effects)) {
	const file = path.join(out, name);
	if (existsSync(file) && !force) {
		console.log(`= ${path.relative(ROOT, file)} (vorhanden, unverändert)`);
		continue;
	}

	if (LEGACY.has(name)) {
		ffmpeg([...args, '-c:a', 'pcm_s16le', file]);
	} else {
		const tmp = file.replace(/\.wav$/, '.raw.wav');
		ffmpeg([...args, '-ar', String(R), '-c:a', 'pcm_s24le', tmp]);
		const gain = PEAK_DB - maxVolumeDb(tmp);
		ffmpeg(['-i', tmp, '-af', `volume=${gain.toFixed(2)}dB`, '-c:a', 'pcm_s16le', file]);
		unlinkSync(tmp);
	}

	console.log(`✔ ${path.relative(ROOT, file)}`);
}
