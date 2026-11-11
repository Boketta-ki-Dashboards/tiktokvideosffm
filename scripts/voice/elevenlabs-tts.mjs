#!/usr/bin/env node
/**
 * Standard-Sprecherstimme für FrankfurtRed3: ElevenLabs „Adam“ (eleven_multilingual_v2).
 * Konfiguration zentral in config/voice.json – der API-Key kommt NUR aus ELEVENLABS_API_KEY (GitHub-Secret).
 *
 *   node scripts/voice/elevenlabs-tts.mjs --sample                     # ≈ 10-s-Hörprobe → public/voiceover/samples/
 *   node scripts/voice/elevenlabs-tts.mjs --sample --sample-from <id>  # Hörprobe mit „sampleText“ aus src/videos/<id>/script.json
 *   node scripts/voice/elevenlabs-tts.mjs --video <video-id>           # komplette Sprecherspur + Manifest
 *   Optionen: --force (alle Sätze neu, kostet Credits) · --dry-run (nur Plan/Credits, kein API-Aufruf)
 *             --check (Whisper-Gegenprobe, falls lokal installiert) · --offline (nie API, nur Cache)
 *
 * Ablauf: Stimme über die API prüfen (Name „Adam“, Kategorie premade) → Modell/Deutsch prüfen → Guthaben prüfen
 * → nur fehlende Sätze erzeugen (Cache voice-cache/elevenlabs/<video>/<hash>.mp3|json, im Repository)
 * → an den Zeichen-Zeitstempeln schneiden → Pausen laut Skript → Mastering (−14 LUFS)
 * → public/voiceover/<video>/voiceover-adam.mp3 + src/videos/<video>/voiceover.json (Untertitel aus den Zeitstempeln).
 * Fällt ElevenLabs aus, bricht das Skript mit Erklärung ab – es gibt KEINEN automatischen Wechsel zu Chatterbox/Piper.
 */
import {spawnSync} from 'node:child_process';
import {copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, appendFileSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
	captionsFromAlignment,
	createClient,
	ElevenLabsError,
	estimateCredits,
	isOriginalAdam,
	modelSupportsGerman,
	segmentCacheKey,
	speechWindow,
	tokenizeForAlignment,
} from '../lib/elevenlabs.mjs';
import {durationSeconds, ffmpeg, masterVoice} from '../lib/ffmpeg.mjs';
import {ensureDir, manifestPath, parseArgs, readScript, ROOT} from '../lib/project.mjs';
import {assembleVoiceTrack} from '../lib/voice-build.mjs';
import {applyAussprache, ausspracheFor, voiceSettingsFor} from '../lib/aussprache.mjs';
import {compressGaps, letterWindow} from '../lib/tight-trim.mjs';

const args = parseArgs(process.argv.slice(2));
const voiceConfig = {
	...JSON.parse(readFileSync(path.join(ROOT, 'config', 'voice.json'), 'utf8')),
	// Stimmprofile (Kurzformat) und Ausspracheregeln (Ewa → Eywa) – eigene Datei, voice.json bleibt unverändert
	...JSON.parse(readFileSync(path.join(ROOT, 'config', 'voice-regeln.json'), 'utf8')),
};
const sampleMode = Boolean(args.sample);
const videoId = sampleMode ? '_samples' : args.video;
if (!videoId) {
	console.error('✖ --video <video-id> oder --sample angeben.');
	process.exit(1);
}

const script = sampleMode ? null : readScript(videoId);
// Hörprobe optional mit dem Probesatz eines Videos (z. B. neue Slang-Sätze), ohne config/voice.json zu ändern
const sampleScript = sampleMode && args['sample-from'] ? readScript(String(args['sample-from'])) : null;
const settingsScript = script ?? sampleScript;
const cfg = {...voiceConfig.elevenlabs, ...(settingsScript?.voice?.elevenlabs ?? {})};
// Stimmprofil (z. B. kurzformat-60 → speed 1.20) nur, wenn das Skript es ausdrücklich nennt
cfg.voiceSettings = voiceSettingsFor(voiceConfig, settingsScript);
// Dauerhafte Ausspracheregeln (z. B. „Ewa“ → gesprochen „Eywa“), außer für bereits fertige Videos
const aussprache = ausspracheFor(voiceConfig, sampleMode ? String(args['sample-from'] ?? '_samples') : videoId);
const SAMPLE_RATE = 44100;
const summary = [];
const log = (s = '') => {
	console.log(s);
	summary.push(s);
};

const targets = sampleMode
	? [{id: 'hoerprobe', text: sampleScript?.sampleText ?? cfg.sampleText, pauseAfterMs: 0}]
	: script.segments.map((s) => ({id: s.id, text: s.text, pauseAfterMs: s.pauseAfterMs}));
for (const t of targets) {
	t.text = applyAussprache(t.text, aussprache);
	t.spoken = tokenizeForAlignment(t.text).spoken;
}

const cacheDir = ensureDir(path.join(ROOT, 'voice-cache', 'elevenlabs', videoId));
const keyOf = (t, voiceId) =>
	segmentCacheKey({voiceId, modelId: cfg.modelId, outputFormat: cfg.outputFormat, voiceSettings: cfg.voiceSettings, seed: cfg.seed, text: t.spoken});
const cached = (key) => existsSync(path.join(cacheDir, `${key}.mp3`)) && existsSync(path.join(cacheDir, `${key}.json`));

const writeSummary = () => {
	if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### ElevenLabs-Stimme\n\n\`\`\`\n${summary.join('\n')}\n\`\`\`\n`);
};

const fail = (e) => {
	const msg = e instanceof ElevenLabsError ? e.message : (e?.stack ?? String(e));
	log(`✖ ${msg}`);
	log('  Kein automatischer Wechsel zu Chatterbox/Piper (Vorgabe). Fehler beheben und erneut starten.');
	writeSummary();
	process.exit(1);
};

/** Stimme über die API bestätigen – nur die originale Adam-Stimme, keine Ersatzstimme. */
const resolveAdam = async (client) => {
	const want = {voiceName: cfg.voiceName, requireCategory: cfg.requireCategory ?? ['premade']};
	let voice = null;
	try {
		voice = await client.getVoice(cfg.voiceId);
	} catch (e) {
		if (!(e instanceof ElevenLabsError) || (e.status !== 404 && e.code !== 'voice_not_found' && e.status !== 400)) throw e;
	}

	if (isOriginalAdam(voice, want)) return voice;
	log(`  Hinterlegte Voice-ID ${cfg.voiceId} ist nicht (mehr) „${cfg.voiceName}“ – suche über /v2/voices …`);
	const found = (await client.searchVoices(cfg.voiceName)).filter((v) => isOriginalAdam(v, want));
	if (found.length > 0) {
		log(`  ⚠ Adam hat jetzt die ID ${found[0].voice_id} – bitte in config/voice.json eintragen.`);
		return found[0];
	}

	let candidates = [];
	try {
		candidates = (await client.searchSharedVoices(cfg.voiceName)).slice(0, 8).map((v) => `${v.name} (${v.voice_id}, ${v.category ?? 'shared'})`);
	} catch {
		// ignorieren – nur Hinweis
	}

	throw new ElevenLabsError(
		`Die originale Stimme „${cfg.voiceName}“ (Kategorie ${want.requireCategory.join('/')}) ist für diesen Account nicht verfügbar. ` +
			`Es wird bewusst KEINE ähnlich benannte Ersatzstimme genommen.${candidates.length ? ` Gefundene Bibliotheksstimmen: ${candidates.join('; ')}` : ''}`,
		{code: 'adam_not_found'},
	);
};

const main = async () => {
	log(`Video: ${sampleMode ? 'Hörprobe' : videoId} · Stimme: ${cfg.voiceName} (${cfg.voiceId}) · Modell: ${cfg.modelId}`);
	log(`Einstellungen: ${JSON.stringify(cfg.voiceSettings)} · Seed ${cfg.seed} · Format ${cfg.outputFormat}`);

	let voiceId = cfg.voiceId;
	let voiceInfo = null;
	const missing = () => targets.filter((t) => args.force || !cached(keyOf(t, voiceId)));
	let todo = missing();
	const credits = estimateCredits(todo.map((t) => t.spoken));
	log(`Sätze: ${targets.length} · im Cache: ${targets.length - todo.length} · neu zu erzeugen: ${todo.length} (≈ ${credits} Credits)`);
	if (args['dry-run']) {
		for (const t of todo) log(`  → ${t.id}: ${t.spoken}`);
		writeSummary();
		return;
	}

	if (todo.length > 0) {
		if (args.offline) throw new ElevenLabsError(`--offline: ${todo.length} Satz/Sätze fehlen im Cache (${todo.map((t) => t.id).join(', ')}).`, {code: 'offline'});
		const client = createClient({log});
		voiceInfo = await resolveAdam(client);
		if (voiceInfo.voice_id !== voiceId) {
			voiceId = voiceInfo.voice_id;
			todo = missing();
		}

		log(`✔ Stimme bestätigt: „${voiceInfo.name}“ · ID ${voiceInfo.voice_id} · Kategorie ${voiceInfo.category}`);
		try {
			const model = modelSupportsGerman(await client.getModels(), cfg.modelId);
			if (!model.ok) throw new ElevenLabsError(model.reason, {code: 'model'});
			log(`✔ Modell ${cfg.modelId}: Text-to-Speech mit Deutsch verfügbar`);
		} catch (e) {
			// Eingeschränkte Keys dürfen die Modellliste oft nicht lesen (models_read) – dann prüft die Erzeugung selbst
			if (e.code !== 'missing_permissions' && e.status !== 401 && e.status !== 403) throw e;
			log(`  (Modellliste nicht abrufbar – Key ohne „models_read“; ${cfg.modelId} wird bei der Erzeugung geprüft)`);
		}
		try {
			const sub = await client.getSubscription();
			const left = Number(sub.character_limit ?? 0) - Number(sub.character_count ?? 0);
			log(`✔ Tarif: ${sub.tier ?? '?'} · verbleibende Credits: ${left} · benötigt: ≈ ${estimateCredits(todo.map((t) => t.spoken))}`);
			if (left < estimateCredits(todo.map((t) => t.spoken))) {
				throw new ElevenLabsError(`Nicht genug Credits (${left} übrig, ≈ ${estimateCredits(todo.map((t) => t.spoken))} nötig).`, {code: 'quota'});
			}
		} catch (e) {
			if (e.code === 'quota') throw e;
			log(`  (Guthaben nicht abfragbar: ${e.message.split(':').slice(-1)[0].trim()} – fahre fort)`);
		}

		for (const t of todo) {
			const i = targets.indexOf(t);
			const key = keyOf(t, voiceId);
			const res = await client.ttsWithTimestamps({
				voiceId,
				text: t.spoken,
				modelId: cfg.modelId,
				voiceSettings: cfg.voiceSettings,
				outputFormat: cfg.outputFormat,
				seed: cfg.seed,
				previousText: cfg.useContext && i > 0 ? targets[i - 1].spoken : undefined,
				nextText: cfg.useContext && i < targets.length - 1 ? targets[i + 1].spoken : undefined,
				applyTextNormalization: cfg.applyTextNormalization,
			});
			if (!res.alignment) throw new ElevenLabsError(`Keine Zeitstempel für „${t.id}“ erhalten.`, {code: 'no_alignment'});
			writeFileSync(path.join(cacheDir, `${key}.mp3`), res.audio);
			writeFileSync(
				path.join(cacheDir, `${key}.json`),
				`${JSON.stringify(
					{
						segmentId: t.id,
						text: t.spoken,
						voice: {id: voiceInfo.voice_id, name: voiceInfo.name, category: voiceInfo.category},
						modelId: cfg.modelId,
						voiceSettings: cfg.voiceSettings,
						seed: cfg.seed,
						outputFormat: cfg.outputFormat,
						requestId: res.requestId,
						createdAt: new Date().toISOString(),
						alignment: res.alignment,
					},
					null,
					'\t',
				)}\n`,
			);
			log(`  ✔ ${t.id.padEnd(10)} ${t.spoken.length} Zeichen erzeugt`);
		}
	}

	// ---------- Zusammenbau ----------
	const tmp = mkdtempSync(path.join(os.tmpdir(), 'elevenlabs-'));
	try {
		const pieces = targets.map((t) => {
			const key = keyOf(t, voiceId);
			const meta = JSON.parse(readFileSync(path.join(cacheDir, `${key}.json`), 'utf8'));
			const raw = path.join(cacheDir, `${key}.mp3`);
			const dur = durationSeconds(raw);
			// Kurzformat (opt-in): Schnitt an Buchstaben statt Satzzeichen, lange Pausen im Satz kürzen
			const tight = script?.voice?.trim?.mode === 'letters';
			const w = tight ? letterWindow(meta.alignment) : speechWindow(meta.alignment);
			const cutStart = Math.max(0, w.first - cfg.trim.leadSeconds);
			const cutEnd = Math.min(dur, w.last + cfg.trim.tailSeconds);
			const file = path.join(tmp, `${t.id}.wav`);
			const maxGap = tight ? Number(script.voice.trim.maxInnerGapMs ?? 0) / 1000 : 0;
			if (maxGap > 0) {
				const c = compressGaps(meta.alignment, cutStart, cutEnd, maxGap);
				const parts = c.ranges.map(([rs, re], k) => {
					const pf = path.join(tmp, `${t.id}-${k}.wav`);
					ffmpeg(['-i', raw, '-ss', rs.toFixed(3), '-to', re.toFixed(3), '-ar', String(SAMPLE_RATE), '-ac', '1', '-c:a', 'pcm_s16le', pf]);
					return pf;
				});
				if (parts.length === 1) copyFileSync(parts[0], file);
				else ffmpeg([...parts.flatMap((pf) => ['-i', pf]), '-filter_complex', `${parts.map((_, k) => `[${k}:a]`).join('')}concat=n=${parts.length}:v=0:a=1[o]`, '-map', '[o]', '-ar', String(SAMPLE_RATE), '-ac', '1', '-c:a', 'pcm_s16le', file]);
				if (c.removedSec > 0.01) log(`  ✂ ${t.id.padEnd(10)} Pausen im Satz gekürzt: −${(c.removedSec * 1000).toFixed(0)} ms`);
				return {id: t.id, file, key, meta, alignment: c.alignment, cutStart, target: t, tight};
			}

			ffmpeg(['-i', raw, '-ss', cutStart.toFixed(3), '-to', cutEnd.toFixed(3), '-ar', String(SAMPLE_RATE), '-ac', '1', '-c:a', 'pcm_s16le', file]);
			return {id: t.id, file, key, meta, alignment: meta.alignment, cutStart, target: t, tight};
		});
		const voice = pieces[0].meta.voice;
		if (pieces.some((p) => p.meta.voice.id !== voice.id)) throw new ElevenLabsError('Sätze stammen von unterschiedlichen Stimmen – mit --force neu erzeugen.', {code: 'mixed'});
		if (!isOriginalAdam(voice, {voiceName: cfg.voiceName, requireCategory: cfg.requireCategory ?? ['premade']})) {
			throw new ElevenLabsError(`Cache-Stimme ist nicht Adam (${voice.name}).`, {code: 'not_adam'});
		}

		const voiceMeta = {
			provider: 'elevenlabs',
			name: voice.name,
			voiceId: voice.id,
			category: voice.category,
			modelId: cfg.modelId,
			voiceSettings: cfg.voiceSettings,
			seed: cfg.seed,
			characters: estimateCredits(targets.map((t) => t.spoken)),
		};

		if (sampleMode) {
			const out = path.join(ROOT, 'public', cfg.sampleFile);
			ensureDir(path.dirname(out));
			masterVoice(pieces[0].file, out, {toneFilter: 'highpass=f=60'});
			writeFileSync(out.replace(/\.mp3$/, '.json'), `${JSON.stringify({text: targets[0].text, sampleFrom: sampleScript ? String(args['sample-from']) : null, ...voiceMeta, cacheKey: pieces[0].key, durationSeconds: durationSeconds(out)}, null, '\t')}\n`);
			log(`✔ Hörprobe: public/${cfg.sampleFile} (${durationSeconds(out).toFixed(2)} s) – Stimme „${voice.name}“ (${voice.id})`);
		} else {
			// Alte Fassung einer anderen Engine aufbewahren (nicht überschreiben)
			const current = manifestPath(videoId);
			const previous = existsSync(current) ? JSON.parse(readFileSync(current, 'utf8')) : null;
			if (previous) {
				const old = previous;
				const engine = String(old.source ?? 'alt').split(':')[0].split('-')[0] || 'alt';
				const archive = current.replace(/\.json$/, `.${engine}.json`);
				if (engine !== 'elevenlabs' && !existsSync(archive)) {
					copyFileSync(current, archive);
					log(`  Alte Fassung (${engine}) aufbewahrt: ${path.relative(ROOT, archive)}`);
				}
			}

			const byId = new Map(pieces.map((p) => [p.id, p]));
			const {outFile, manifest} = assembleVoiceTrack({
				videoId,
				script,
				segments: pieces.map((p) => ({id: p.id, file: p.file, meta: {hash: p.key}})),
				sampleRate: SAMPLE_RATE,
				source: `elevenlabs:${voice.name}:${voice.id}:${cfg.modelId}`,
				outFileName: cfg.audioFileName,
				captionsSource: 'elevenlabs-alignment',
				masterOptions: {toneFilter: 'highpass=f=60'},
				extra: {voice: voiceMeta},
				buildCaptions: (timings) => {
					const all = [];
					let inexact = 0;
					timings.forEach((tm, i) => {
						const p = byId.get(tm.id);
						const {captions, exact} = captionsFromAlignment({text: p.target.text, alignment: p.alignment, offsetMs: tm.startMs, cutStartSec: p.cutStart, first: i === 0});
						if (!exact) inexact++;
						// Kurzformat-Schnitt: das abgeschnittene Satzzeichen verlängert sonst das letzte Wort über das Satzende hinaus
						all.push(...(p.tight ? captions.map((c) => ({...c, startMs: Math.max(c.startMs, tm.startMs), endMs: Math.min(c.endMs, tm.endMs)})) : captions));
					});
					if (inexact > 0) log(`  ⚠ ${inexact} Satz/Sätze mit abweichender Zeichenfolge – Untertitel proportional zugeordnet`);
					return all;
				},
			});
			// Unverändert (nur Wiederverwendung)? Dann alten Zeitstempel behalten → kein überflüssiger Commit
			const strip = (m) => JSON.stringify({...m, generatedAt: null});
			if (previous && strip(previous) === strip(manifest)) {
				writeFileSync(current, `${JSON.stringify({...manifest, generatedAt: previous.generatedAt}, null, '\t')}\n`);
				log('  Sprecherspur unverändert (alles aus dem Cache) – Manifest bleibt gleich.');
			}

			log(`✔ Sprecherspur: ${path.relative(ROOT, outFile)} (${(manifest.durationMs / 1000).toFixed(2)} s) · Untertitel aus ElevenLabs-Zeitstempeln (${manifest.captions.length} Wörter)`);
			log(`✔ Manifest: ${path.relative(ROOT, manifestPath(videoId))}`);
			if (args.check) whisperCheck(path.join(ROOT, 'public', manifest.audioFile), manifest, tmp);
		}
	} finally {
		rmSync(tmp, {recursive: true, force: true});
	}

	writeSummary();
};

/** Optionale Gegenprobe mit lokalem whisper.cpp (wie bei Chatterbox). */
const whisperCheck = (file, manifest, tmp) => {
	const cache = path.join(ROOT, '.cache', 'whisper.cpp');
	const cli = path.join(cache, 'build', 'bin', 'whisper-cli');
	const model = ['ggml-small.bin', 'ggml-base.bin'].map((m) => path.join(cache, m)).find((m) => existsSync(m));
	if (!existsSync(cli) || !model) {
		log('  (Whisper nicht installiert – Gegenprobe übersprungen)');
		return;
	}

	for (const seg of manifest.segments) {
		const wav = path.join(tmp, `chk-${seg.id}.wav`);
		ffmpeg(['-i', file, '-ss', (seg.startMs / 1000).toFixed(3), '-to', (seg.endMs / 1000).toFixed(3), '-ar', '16000', '-ac', '1', wav]);
		const res = spawnSync(cli, ['-m', model, '-l', 'de', '-f', wav, '-nt'], {encoding: 'utf8'});
		const words = manifest.captions.filter((c) => c.startMs >= seg.startMs - 5 && c.startMs < seg.endMs).map((c) => c.text.trim()).join(' ');
		log(`  ${seg.id.padEnd(6)} Skript:  ${words}\n         Whisper: ${res.stdout.replace(/\s+/g, ' ').trim()}`);
	}
};

mkdirSync(path.join(ROOT, 'voice-cache', 'elevenlabs'), {recursive: true});
main().catch(fail);
