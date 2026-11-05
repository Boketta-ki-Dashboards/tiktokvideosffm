/**
 * ElevenLabs-Anbindung (offizielle REST-API) + reine Hilfsfunktionen (testbar ohne Netzwerk).
 *
 * Sicherheit: Der API-Key kommt AUSSCHLIESSLICH aus der Umgebungsvariable ELEVENLABS_API_KEY
 * (in GitHub Actions aus dem Secret gleichen Namens). Er wird nie geloggt, nie in Dateien geschrieben
 * und nie in Fehlermeldungen eingebaut.
 */
import {createHash} from 'node:crypto';

export const API_BASE = (process.env.ELEVENLABS_API_BASE ?? 'https://api.elevenlabs.io').replace(/\/$/, '');

/** Fehler mit verständlicher deutscher Erklärung (ohne Key). */
export class ElevenLabsError extends Error {
	constructor(message, {status, code, detail} = {}) {
		super(message);
		this.name = 'ElevenLabsError';
		this.status = status;
		this.code = code;
		this.detail = detail;
	}
}

const explain = (status, body) => {
	const detail = body?.detail;
	const code = typeof detail === 'object' && detail !== null && !Array.isArray(detail) ? detail.status ?? detail.code : undefined;
	const msg = typeof detail === 'string' ? detail : (detail?.message ?? (Array.isArray(detail) ? detail.map((d) => `${(d.loc ?? []).join('.')}: ${d.msg}`).join('; ') : ''));
	const hints = {
		401: 'API-Key ungültig oder ohne Berechtigung (Secret ELEVENLABS_API_KEY prüfen; bei eingeschränkten Keys „Text to Speech“ und „Voices: Read“ freigeben).',
		402: 'Tarif/Guthaben reicht nicht (Credits aufgebraucht oder Funktion nicht im Tarif).',
		404: 'Stimme oder Endpunkt nicht gefunden.',
		422: 'Anfrage ungültig (Parameter prüfen).',
		429: 'Zu viele Anfragen / Parallelitätslimit erreicht.',
	};
	if (code === 'quota_exceeded') return {code, text: `Credits aufgebraucht: ${msg}`};
	if (code === 'voice_not_found') return {code, text: `Stimme nicht gefunden: ${msg}`};
	if (code === 'missing_permissions') return {code, text: `Dem API-Key fehlt eine Berechtigung: ${msg}`};
	return {code, text: `${hints[status] ?? `HTTP ${status}`}${msg ? ` – ${msg}` : ''}`};
};

/**
 * Kleiner Client mit Wiederholungen bei 429/5xx. `fetchImpl` ist für Tests austauschbar.
 * @param {{apiKey?: string, fetchImpl?: typeof fetch, base?: string, log?: (s: string) => void}} o
 */
export const createClient = ({apiKey = process.env.ELEVENLABS_API_KEY, fetchImpl = fetch, base = API_BASE, log = () => {}} = {}) => {
	if (!apiKey || !String(apiKey).trim()) {
		throw new ElevenLabsError(
			'ELEVENLABS_API_KEY ist nicht gesetzt. In GitHub: Settings → Secrets and variables → Actions → Secret „ELEVENLABS_API_KEY“. ' +
				'Lokal wird der Key nicht benötigt (Audio wird aus dem Repository wiederverwendet).',
			{code: 'missing_key'},
		);
	}

	const request = async (method, path, {json, query, retries = 4, binary = false} = {}) => {
		const url = new URL(base + path);
		for (const [k, v] of Object.entries(query ?? {})) if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
		for (let attempt = 0; ; attempt++) {
			let res;
			try {
				res = await fetchImpl(url, {
					method,
					headers: {'xi-api-key': apiKey, Accept: binary ? 'audio/mpeg' : 'application/json', ...(json ? {'Content-Type': 'application/json'} : {})},
					body: json ? JSON.stringify(json) : undefined,
				});
			} catch (e) {
				if (attempt < retries) {
					log(`  Netzwerkfehler (${e.message}) – neuer Versuch in ${2 ** attempt} s`);
					await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
					continue;
				}

				throw new ElevenLabsError(`Netzwerkfehler bei ${method} ${path}: ${e.message}`, {code: 'network'});
			}

			if (res.ok) {
				return {body: binary ? Buffer.from(await res.arrayBuffer()) : await res.json(), headers: res.headers};
			}

			let body = null;
			try {
				body = await res.json();
			} catch {
				body = null;
			}

			if ((res.status === 429 || res.status >= 500) && attempt < retries) {
				log(`  HTTP ${res.status} – neuer Versuch in ${2 ** (attempt + 1)} s`);
				await new Promise((r) => setTimeout(r, 2000 * 2 ** attempt));
				continue;
			}

			const {code, text} = explain(res.status, body);
			throw new ElevenLabsError(`ElevenLabs ${method} ${path}: ${text}`, {status: res.status, code, detail: body?.detail});
		}
	};

	return {
		getVoice: (voiceId) => request('GET', `/v1/voices/${encodeURIComponent(voiceId)}`).then((r) => r.body),
		searchVoices: (search) => request('GET', '/v2/voices', {query: {search, page_size: 100, include_total_count: false}}).then((r) => r.body.voices ?? []),
		searchSharedVoices: (search) => request('GET', '/v1/shared-voices', {query: {search, page_size: 20}}).then((r) => r.body.voices ?? []),
		getModels: () => request('GET', '/v1/models').then((r) => r.body),
		getSubscription: () => request('GET', '/v1/user/subscription').then((r) => r.body),
		/** TTS mit Zeichen-Zeitstempeln → {audio: Buffer, alignment, normalizedAlignment, requestId} */
		ttsWithTimestamps: async ({voiceId, text, modelId, voiceSettings, outputFormat, seed, previousText, nextText, applyTextNormalization}) => {
			const {body, headers} = await request('POST', `/v1/text-to-speech/${encodeURIComponent(voiceId)}/with-timestamps`, {
				query: {output_format: outputFormat},
				json: {
					text,
					model_id: modelId,
					voice_settings: voiceSettings,
					seed,
					previous_text: previousText || undefined,
					next_text: nextText || undefined,
					apply_text_normalization: applyTextNormalization,
				},
			});
			if (!body?.audio_base64) {
				throw new ElevenLabsError('ElevenLabs lieferte keine Audiodaten (audio_base64 fehlt).', {code: 'no_audio'});
			}

			return {
				audio: Buffer.from(body.audio_base64, 'base64'),
				alignment: body.alignment ?? null,
				normalizedAlignment: body.normalized_alignment ?? null,
				requestId: headers.get('request-id') ?? headers.get('x-request-id') ?? null,
			};
		},
		/** Soundeffekt aus Text (POST /v1/sound-generation) → {audio: Buffer, requestId} */
		soundGeneration: async ({text, modelId, durationSeconds, promptInfluence, loop = false, outputFormat}) => {
			const {body, headers} = await request('POST', '/v1/sound-generation', {
				binary: true,
				retries: 2,
				query: {output_format: outputFormat},
				json: {text, model_id: modelId, duration_seconds: durationSeconds, prompt_influence: promptInfluence, loop},
			});
			if (!body?.length) {
				throw new ElevenLabsError('ElevenLabs lieferte keine Audiodaten für den Soundeffekt.', {code: 'no_audio'});
			}

			return {audio: body, requestId: headers.get('request-id') ?? headers.get('x-request-id') ?? null};
		},
	};
};

/** Cache-Schlüssel eines Soundeffekts (Prompt + Modell + Parameter). */
export const sfxCacheKey = ({modelId, outputFormat, text, durationSeconds, promptInfluence, loop = false}) =>
	createHash('sha256')
		.update(JSON.stringify({modelId, outputFormat, text, durationSeconds, promptInfluence, loop}))
		.digest('hex')
		.slice(0, 24);

/** Fehlt dem Key eine Berechtigung (oder ist er für diesen Endpunkt nicht freigeschaltet)? */
export const isPermissionError = (err) =>
	err?.code === 'missing_permissions' || err?.status === 401 || err?.status === 403;

// ---------------------------------------------------------------------------------------------
// Reine Hilfsfunktionen
// ---------------------------------------------------------------------------------------------

/** Cache-Schlüssel eines Satzes: ändert sich nur, wenn Text, Stimme, Modell oder Einstellungen sich ändern. */
export const segmentCacheKey = ({voiceId, modelId, outputFormat, voiceSettings, seed, text}) =>
	createHash('sha256')
		.update(JSON.stringify({p: 'elevenlabs', voiceId, modelId, outputFormat, voiceSettings, seed, text}))
		.digest('hex')
		.slice(0, 20);

/** Ist das die originale Adam-Stimme? Name beginnt mit „Adam“ (z. B. „Adam – Dominant, Firm“) und Kategorie passt. */
export const isOriginalAdam = (voice, {voiceName = 'Adam', requireCategory = ['premade']} = {}) =>
	Boolean(voice) &&
	new RegExp(`^${voiceName}(\\b|\\s|$)`, 'i').test(String(voice.name ?? '').trim()) &&
	(requireCategory.length === 0 || requireCategory.includes(voice.category));

/** Modell kann TTS und Deutsch? */
export const modelSupportsGerman = (models, modelId) => {
	const m = (Array.isArray(models) ? models : []).find((x) => x.model_id === modelId);
	if (!m) return {ok: false, reason: `Modell ${modelId} ist für diesen Account nicht verfügbar.`};
	if (m.can_do_text_to_speech === false) return {ok: false, reason: `Modell ${modelId} kann keine Text-to-Speech.`};
	const langs = (m.languages ?? []).map((l) => String(l.language_id ?? l).toLowerCase());
	if (langs.length > 0 && !langs.some((l) => l === 'de' || l.startsWith('de-'))) return {ok: false, reason: `Modell ${modelId} unterstützt kein Deutsch.`};
	return {ok: true, model: m};
};

const MARKUP = /\{([^|{}]+)\|([^{}]+)\}/g;
const PUNCT_ONLY = /^[–—\-.,:;!?…"„“”'()]+$/;

/**
 * Zerlegt einen Skript-Satz in den gesprochenen Text (an ElevenLabs gesendet) und Anzeige-Wörter
 * mit Zeichenbereich im gesprochenen Text. Wortgrenzen und Satzzeichen-Zusammenfassung
 * entsprechen exakt `parseSegmentText()` (src/lib/script-timing.ts), damit Untertitel identisch bleiben.
 */
export const tokenizeForAlignment = (text) => {
	let spoken = '';
	const tokens = [];
	const append = (s) => {
		for (const ch of s) {
			if (/\s/.test(ch)) {
				if (spoken.length > 0 && !spoken.endsWith(' ')) spoken += ' ';
			} else {
				spoken += ch;
			}
		}
	};

	const words = (s, onWord) => {
		const re = /(\s+)|([^\s]+)/g;
		let m;
		while ((m = re.exec(s))) {
			if (m[1]) append(' ');
			else {
				const start = spoken.length;
				append(m[2]);
				onWord(m[2], start, spoken.length);
			}
		}
	};

	let last = 0;
	const plain = (s) => words(s, (w, start, end) => tokens.push({text: w, start, end}));
	for (const match of text.matchAll(MARKUP)) {
		plain(text.slice(last, match.index));
		const shown = match[1].split(/\s+/).filter(Boolean);
		const said = [];
		const saidStart = spoken.length + (spoken.length > 0 && !spoken.endsWith(' ') && /^\s/.test(match[2]) ? 1 : 0);
		words(match[2], (w, start, end) => said.push([start, end]));
		const saidEnd = spoken.length;
		if (said.length === shown.length) {
			shown.forEach((w, i) => tokens.push({text: w, start: said[i][0], end: said[i][1]}));
		} else {
			const s0 = said[0]?.[0] ?? saidStart;
			const span = saidEnd - s0;
			shown.forEach((w, i) => tokens.push({text: w, start: s0 + Math.round((span * i) / shown.length), end: s0 + Math.round((span * (i + 1)) / shown.length)}));
		}

		last = match.index + match[0].length;
	}

	plain(text.slice(last));
	spoken = spoken.trimEnd();

	// Satzzeichen-Tokens an das vorherige Wort hängen (wie mergePunctuation)
	const merged = [];
	for (const t of tokens) {
		const prev = merged[merged.length - 1];
		if (PUNCT_ONLY.test(t.text) && prev) {
			prev.text = `${prev.text}${/^[–—-]/.test(t.text) ? ' ' : ''}${t.text}`;
			prev.end = t.end;
		} else {
			merged.push({...t});
		}
	}

	return {spoken, tokens: merged};
};

/**
 * Zeitfenster des eigentlichen Sprechens (für sauberen Schnitt): erstes bis letztes Nicht-Leerzeichen.
 * @returns {{first: number, last: number}} Sekunden
 */
export const speechWindow = (alignment) => {
	const chars = alignment?.characters ?? [];
	let first = null;
	let last = null;
	chars.forEach((c, i) => {
		if (!/\s/.test(c)) {
			if (first === null) first = alignment.character_start_times_seconds[i];
			last = alignment.character_end_times_seconds[i];
		}
	});
	return {first: first ?? 0, last: last ?? 0};
};

/**
 * Wort-Untertitel aus den ElevenLabs-Zeichenzeiten.
 * @param {object} o
 * @param {string} o.text          Skript-Satz mit {Anzeige|Gesprochen}-Markup
 * @param {object} o.alignment     ElevenLabs `alignment` (bezogen auf den gesendeten Text)
 * @param {number} o.offsetMs      Position des geschnittenen Satzes in der Gesamtspur
 * @param {number} o.cutStartSec   Schnittbeginn innerhalb der Rohaufnahme
 * @param {boolean} o.first        erstes Wort des Videos (ohne führendes Leerzeichen)
 * @returns {{captions: Array, exact: boolean}}
 */
export const captionsFromAlignment = ({text, alignment, offsetMs, cutStartSec, first = false}) => {
	const {spoken, tokens} = tokenizeForAlignment(text);
	const chars = alignment?.characters ?? [];
	const exact = chars.join('') === spoken;
	const n = chars.length;
	// Bei Abweichung (z. B. andere Normalisierung): proportionale Zuordnung der Indizes
	const idx = (i) => (exact ? i : Math.min(n - 1, Math.max(0, Math.round((i / Math.max(1, spoken.length)) * n))));
	const at = (i, kind) => Number((kind === 'start' ? alignment.character_start_times_seconds : alignment.character_end_times_seconds)[idx(i)] ?? 0);
	const captions = [];
	let prevEnd = 0;
	tokens.forEach((t, k) => {
		let a = t.start;
		let b = t.end - 1;
		while (a < b && /\s/.test(spoken[a])) a++;
		while (b > a && /\s/.test(spoken[b])) b--;
		const startSec = Math.max(at(a, 'start'), prevEnd);
		const endSec = Math.max(startSec + 0.04, at(b, 'end'));
		prevEnd = endSec;
		const toMs = (s) => Math.round(offsetMs + (s - cutStartSec) * 1000);
		const startMs = Math.max(Math.round(offsetMs), toMs(startSec));
		const endMs = toMs(endSec);
		captions.push({
			text: first && k === 0 ? t.text : ` ${t.text}`,
			startMs,
			endMs,
			timestampMs: Math.round((startMs + endMs) / 2),
			confidence: exact ? 1 : 0.5,
		});
	});
	return {captions, exact};
};

/** Geschätzte Credits (eleven_multilingual_v2: 1 Credit pro Zeichen). */
export const estimateCredits = (texts) => texts.reduce((sum, t) => sum + t.length, 0);
