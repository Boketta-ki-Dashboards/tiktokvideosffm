/**
 * Sprechertext → Segment- und Wort-Timings.
 *
 * Diese Datei wird SOWOHL im Remotion-Bundle als auch von den Node-Skripten in
 * `scripts/voice/*` verwendet (Node ≥ 22.18 entfernt TypeScript-Typen automatisch).
 * Deshalb: keine Imports, nur „erasable“ TypeScript-Syntax.
 *
 * Markup im Sprechertext:
 *   {Anzeige|Gesprochen}  → Untertitel zeigen „Anzeige“, die TTS spricht „Gesprochen“.
 *   Beispiel: "{31. Oktober 2026|einunddreißigster Oktober zweitausendsechsundzwanzig}"
 */

export type ScriptSegment = {
	/** Eindeutige ID, wird für die Szenen-Synchronisation genutzt. */
	id: string;
	/** Text mit optionalem {Anzeige|Gesprochen}-Markup. */
	text: string;
	/** Pause nach dem Segment (ms). */
	pauseAfterMs?: number;
	/** Optional: eigener Zufallswert für die KI-Stimme (z. B. wenn ein Satz verschliffen klingt). */
	seed?: number;
};

export type VoiceSettings = {
	/** Piper-Stimmenname, z. B. "de_DE-thorsten-high". */
	piperModel?: string;
	/** < 1 = schneller (TikTok-typisch ~0.85–0.92). */
	lengthScale?: number;
	noiseScale?: number;
	noiseWScale?: number;
};

export type VideoScript = {
	videoId: string;
	language: string;
	/** Stille vor dem ersten Wort (ms). */
	leadInMs?: number;
	/** Nachlauf nach dem letzten Wort (ms) – Zeit für das Outro. */
	tailMs?: number;
	/** Harte Obergrenze der Videolänge (ms); der Nachlauf wird ggf. gekürzt (min. 1,5 s). */
	maxDurationMs?: number;
	voice?: VoiceSettings;
	segments: ScriptSegment[];
};

/** Kompatibel mit `Caption` aus @remotion/captions. */
export type Caption = {
	text: string;
	startMs: number;
	endMs: number;
	timestampMs: number | null;
	confidence: number | null;
};

export type SegmentTiming = {
	id: string;
	startMs: number;
	endMs: number;
};

export type VoiceoverManifest = {
	version: 1;
	videoId: string;
	/** z. B. "piper:de_DE-thorsten-high", "import:sprecher.mp3" oder "none". */
	source: string;
	/** Pfad relativ zu `public/` oder null, wenn (noch) keine Sprecherdatei existiert. */
	audioFile: string | null;
	durationMs: number;
	segments: SegmentTiming[];
	captions: Caption[];
	captionsSource: 'script-estimate' | 'whisper' | 'none';
	generatedAt: string;
};

export type ParsedWord = {
	text: string;
	weight: number;
};

export type ParsedSegment = {
	display: string;
	spoken: string;
	words: ParsedWord[];
};

const MARKUP = /\{([^|{}]+)\|([^{}]+)\}/g;
const PUNCT_ONLY = /^[–—\-.,:;!?…"„“”'()]+$/;

/** Grobe deutsche Silbenschätzung (Vokalgruppen), Zahlen ≈ 1,6 Silben pro Ziffer. */
export const estimateSyllables = (word: string): number => {
	const digits = word.replace(/[^0-9]/g, '').length;
	const letters = word.toLowerCase().replace(/[^a-zäöüßéèêàâ]/g, '');
	const groups = letters.match(/[aeiouyäöüéèêàâ]+/g)?.length ?? 0;
	return Math.max(1, groups + Math.round(digits * 1.6));
};

const pauseWeight = (word: string): number => {
	const last = word.trim().slice(-1);
	if ('.!?'.includes(last)) {
		return 1.4;
	}

	if (':;'.includes(last)) {
		return 1.1;
	}

	if (last === ',') {
		return 0.7;
	}

	if (last === '–' || last === '—') {
		return 0.9;
	}

	return 0;
};

const splitWords = (text: string) => text.split(/\s+/).filter((w) => w.length > 0);

/** Satzzeichen-Tokens (z. B. ein freistehendes „–“) an das vorherige Wort hängen. */
const mergePunctuation = (words: ParsedWord[]): ParsedWord[] => {
	const out: ParsedWord[] = [];
	for (const w of words) {
		const prev = out[out.length - 1];
		if (PUNCT_ONLY.test(w.text) && prev) {
			// Satzzeichen direkt anhängen, Gedankenstriche mit Leerzeichen
			const joiner = /^[–—-]/.test(w.text) ? ' ' : '';
			prev.text = `${prev.text}${joiner}${w.text}`;
			prev.weight += w.weight;
		} else {
			out.push({...w});
		}
	}

	return out;
};

export const parseSegmentText = (text: string): ParsedSegment => {
	const words: ParsedWord[] = [];
	let display = '';
	let spoken = '';
	let lastIndex = 0;

	const pushPlain = (chunk: string) => {
		display += chunk;
		spoken += chunk;
		for (const w of splitWords(chunk)) {
			words.push({
				text: w,
				weight: PUNCT_ONLY.test(w) ? pauseWeight(w) : estimateSyllables(w) + pauseWeight(w),
			});
		}
	};

	for (const match of text.matchAll(MARKUP)) {
		const index = match.index ?? 0;
		pushPlain(text.slice(lastIndex, index));
		const [, shown, said] = match;
		display += shown;
		spoken += said;
		const shownWords = splitWords(shown);
		const total = splitWords(said).reduce((sum, w) => sum + estimateSyllables(w), 0);
		for (const w of shownWords) {
			words.push({text: w, weight: total / shownWords.length + pauseWeight(w)});
		}

		lastIndex = index + match[0].length;
	}

	pushPlain(text.slice(lastIndex));

	return {
		display: display.replace(/\s+/g, ' ').trim(),
		spoken: spoken.replace(/\s+/g, ' ').trim(),
		words: mergePunctuation(words),
	};
};

/** Verteilt die Wörter eines Segments proportional zu ihrer Silbenzahl auf dessen Dauer. */
export const estimateCaptionsForSegments = (
	script: VideoScript,
	timings: SegmentTiming[],
): Caption[] => {
	const captions: Caption[] = [];
	for (const timing of timings) {
		const segment = script.segments.find((s) => s.id === timing.id);
		if (!segment) {
			continue;
		}

		const {words} = parseSegmentText(segment.text);
		const total = words.reduce((sum, w) => sum + w.weight, 0) || 1;
		const span = Math.max(0, timing.endMs - timing.startMs);
		let cursor = timing.startMs;
		for (const word of words) {
			const length = (word.weight / total) * span;
			const startMs = Math.round(cursor);
			const endMs = Math.round(cursor + length);
			captions.push({
				text: captions.length === 0 ? word.text : ` ${word.text}`,
				startMs,
				endMs,
				timestampMs: Math.round((startMs + endMs) / 2),
				confidence: null,
			});
			cursor += length;
		}
	}

	return captions;
};

/** Sprechtempo für die Schätzung ohne Audiodatei (Silben pro Sekunde). */
const SYLLABLES_PER_SECOND = 6.2;

/**
 * Manifest ohne Sprecherdatei: Timings werden aus dem Text geschätzt.
 * So ist jedes Video auch ohne Stimme renderbar (stumme Vorschau mit Untertiteln).
 */
export const buildEstimatedManifest = (script: VideoScript): VoiceoverManifest => {
	const leadIn = script.leadInMs ?? 300;
	const segments: SegmentTiming[] = [];
	let cursor = leadIn;
	for (const segment of script.segments) {
		const {words} = parseSegmentText(segment.text);
		const weight = words.reduce((sum, w) => sum + w.weight, 0);
		const durationMs = Math.round((weight / SYLLABLES_PER_SECOND) * 1000);
		segments.push({id: segment.id, startMs: cursor, endMs: cursor + durationMs});
		cursor += durationMs + (segment.pauseAfterMs ?? 200);
	}

	const lastEnd = segments.length > 0 ? segments[segments.length - 1].endMs : leadIn;

	return {
		version: 1,
		videoId: script.videoId,
		source: 'none',
		audioFile: null,
		durationMs: lastEnd,
		segments,
		captions: estimateCaptionsForSegments(script, segments),
		captionsSource: 'script-estimate',
		generatedAt: new Date(0).toISOString(),
	};
};
