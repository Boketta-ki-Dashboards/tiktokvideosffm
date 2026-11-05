#!/usr/bin/env node
/**
 * Optionale Premium-Soundeffekte über die ElevenLabs Sound Effects API (POST /v1/sound-generation).
 *
 *   node scripts/audio/elevenlabs-sfx.mjs              # fehlende Effekte erzeugen (Key nötig), sonst Cache nutzen
 *   node scripts/audio/elevenlabs-sfx.mjs --dry-run    # nur Plan anzeigen, keine Anfrage
 *   node scripts/audio/elevenlabs-sfx.mjs --offline    # nur Cache (keine Anfrage)
 *
 * Grundsätze (siehe CLAUDE.md):
 * - Konfiguration: config/sfx-elevenlabs.json (wenige, kurze Effekte; einmal erzeugt, für alle Folgen wiederverwendet).
 * - Cache im Repository: voice-cache/elevenlabs-sfx/<hash>.mp3 → public/sfx/premium/<name>.mp3 + src/lib/sfx-premium.ts.
 * - KEINE unnötigen Fehlversuche: Die erste fehlende Datei dient als Probe. Fehlt die Berechtigung, wird sofort
 *   abgebrochen (eine einzige Anfrage), erklärt und mit Exit 0 auf die selbst erzeugten Effekte zurückgefallen.
 * - Der API-Key kommt nur aus der Umgebung (GitHub-Secret ELEVENLABS_API_KEY) und wird nie ausgegeben.
 */
import {appendFileSync, copyFileSync, existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {createClient, ElevenLabsError, isPermissionError, sfxCacheKey} from '../lib/elevenlabs.mjs';
import {ffmpeg} from '../lib/ffmpeg.mjs';
import {ROOT} from '../lib/project.mjs';

const argv = new Set(process.argv.slice(2));
const dryRun = argv.has('--dry-run');
const offline = argv.has('--offline');
const config = JSON.parse(readFileSync(path.join(ROOT, 'config', 'sfx-elevenlabs.json'), 'utf8'));
const cacheDir = path.join(ROOT, 'voice-cache', 'elevenlabs-sfx');
const outDir = path.join(ROOT, 'public', 'sfx', 'premium');
const manifestFile = path.join(ROOT, 'src', 'lib', 'sfx-premium.ts');
const statusFile = path.join(cacheDir, 'status.json');

const summary = (md) => {
	if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${md}\n`);
};

/** Status nur schreiben, wenn er sich inhaltlich ändert (sonst entstünden Bot-Commits nur wegen des Zeitstempels). */
const writeStatus = (status) => {
	const prev = existsSync(statusFile) ? JSON.parse(readFileSync(statusFile, 'utf8')) : null;
	const strip = (o) => JSON.stringify({...o, checkedAt: undefined});
	if (prev && strip(prev) === strip(status)) return;
	mkdirSync(cacheDir, {recursive: true});
	writeFileSync(statusFile, `${JSON.stringify({...status, checkedAt: new Date().toISOString()}, null, '\t')}\n`);
};

const maxVolumeDb = (file) => {
	const res = spawnSync('ffmpeg', ['-hide_banner', '-nostdin', '-i', file, '-af', 'volumedetect', '-f', 'null', '-'], {encoding: 'utf8'});
	const m = res.stderr.match(/max_volume: (-?[\d.]+) dB/);
	return m ? Number(m[1]) : 0;
};

const plan = config.effects.map((e) => {
	const key = sfxCacheKey({
		modelId: config.modelId,
		outputFormat: config.outputFormat,
		text: e.text,
		durationSeconds: e.durationSeconds,
		promptInfluence: config.promptInfluence,
		loop: false,
	});
	return {...e, key, cache: path.join(cacheDir, `${key}.mp3`)};
});

const missing = plan.filter((p) => !existsSync(p.cache));
const seconds = missing.reduce((s, p) => s + (p.durationSeconds ?? 0), 0);
console.log(`ElevenLabs-Soundeffekte (${config.modelId}): ${plan.length} konfiguriert, ${plan.length - missing.length} im Cache, ${missing.length} fehlen (${seconds.toFixed(1)} s Audio).`);

/** Cache → public/sfx/premium + Manifest (nur Effekte, die im Cache liegen). */
const publish = () => {
	mkdirSync(outDir, {recursive: true});
	const effects = {};
	for (const p of plan) {
		if (!existsSync(p.cache)) continue;
		const target = path.join(outDir, `${p.name}.mp3`);
		const tmp = `${target}.tmp.mp3`;
		copyFileSync(p.cache, tmp);
		const gain = (config.peakDb ?? -3) - maxVolumeDb(tmp);
		ffmpeg(['-i', tmp, '-af', `volume=${gain.toFixed(2)}dB`, '-ar', '48000', '-c:a', 'libmp3lame', '-b:a', '160k', target]);
		unlinkSync(tmp);
		effects[p.name] = {file: `sfx/premium/${p.name}.mp3`, prompt: p.text, model: config.modelId, cacheKey: p.key};
	}

	const before = existsSync(manifestFile) ? readFileSync(manifestFile, 'utf8') : '';
	const text =
		'/* eslint-disable */\n// Automatisch geschrieben von scripts/audio/elevenlabs-sfx.mjs – nicht von Hand ändern.\n' +
		'// Leer = nur selbst erzeugte Effekte (public/sfx/*.wav). Einträge ersetzen den gleichnamigen Effekt in src/lib/sfx.ts.\n' +
		`export const PREMIUM_SFX: Record<string, {file: string; prompt: string; model: string; cacheKey: string}> = ${JSON.stringify(effects, null, '\t')};\n`;
	if (text !== before) writeFileSync(manifestFile, text);
	console.log(`✔ ${Object.keys(effects).length} Premium-Effekt(e) aktiv: ${Object.keys(effects).join(', ') || '–'}`);
	return Object.keys(effects);
};

if (dryRun) {
	for (const p of missing) console.log(`  · würde erzeugen: ${p.name} (${p.durationSeconds} s) – „${p.text}“`);
	process.exit(0);
}

if (missing.length === 0 || offline) {
	publish();
	process.exit(0);
}

if (!process.env.ELEVENLABS_API_KEY) {
	console.log('ℹ Kein ELEVENLABS_API_KEY in der Umgebung → es bleiben die selbst erzeugten Effekte (public/sfx/*.wav).');
	publish();
	process.exit(0);
}

const client = createClient({log: (s) => console.log(s)});
mkdirSync(cacheDir, {recursive: true});
const generated = [];
try {
	for (const p of missing) {
		console.log(`→ ${p.name}: „${p.text}“ (${p.durationSeconds} s)`);
		const {audio, requestId} = await client.soundGeneration({
			text: p.text,
			modelId: config.modelId,
			durationSeconds: p.durationSeconds,
			promptInfluence: config.promptInfluence,
			outputFormat: config.outputFormat,
		});
		writeFileSync(p.cache, audio);
		writeFileSync(p.cache.replace(/\.mp3$/, '.json'), `${JSON.stringify({name: p.name, text: p.text, model: config.modelId, durationSeconds: p.durationSeconds, promptInfluence: config.promptInfluence, requestId, generatedAt: new Date().toISOString()}, null, '\t')}\n`);
		generated.push(p.name);
	}

	writeStatus({ok: true, model: config.modelId});
	const active = publish();
	summary(`### Soundeffekte (ElevenLabs ${config.modelId})\n\n✅ neu erzeugt: ${generated.join(', ') || '–'} · aktiv: ${active.join(', ')}\n`);
} catch (err) {
	const e = err instanceof ElevenLabsError ? err : new ElevenLabsError(String(err?.message ?? err));
	const permission = isPermissionError(e);
	const message = e.message.replace(/sk_[A-Za-z0-9]+/g, '***');
	writeStatus({ok: false, permissionMissing: permission, status: e.status ?? null, code: e.code ?? null, message});
	const hint = permission
		? 'Dem API-Key fehlt die Berechtigung für Soundeffekte. In ElevenLabs: Developers → API Keys → Key bearbeiten → ' +
			'Berechtigung „Sound Effects“ auf „Access“ stellen (API-Bezeichnung laut Fehlermeldung, i. d. R. `sound_generation`). Danach den Workflow erneut starten.'
		: 'Die Soundeffekt-Erzeugung ist fehlgeschlagen (siehe Meldung).';
	console.log(`::warning::ElevenLabs-Soundeffekte nicht verfügbar – ${message}`);
	console.log(`ℹ ${hint}`);
	console.log('ℹ Es werden die selbst erzeugten Effekte aus public/sfx/ verwendet. Es wurden keine weiteren Anfragen gestellt.');
	summary(`### Soundeffekte (ElevenLabs)\n\n⚠️ nicht verfügbar → selbst erzeugte Effekte aktiv.\n\n- Meldung: ${message}\n- ${hint}\n`);
	if (generated.length) console.log(`  (vor dem Fehler erzeugt: ${generated.join(', ')})`);
	publish();
}
