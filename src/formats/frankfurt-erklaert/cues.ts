import type {VoiceoverManifest} from '../../lib/script-timing';
import type {SceneSpec} from '../../lib/timeline';
import type {Cues} from '../../videos/frankfurt-2026-10-31/cues';

const clean = (t: string) => t.trim().replace(/[.,:;!?–„“"]/g, '').toLowerCase();

/** Zahlen müssen exakt passen („3“ darf nicht „31.“ treffen), Wörter per Wortanfang. */
export const matchesKeyword = (word: string, keyword: string) => {
	const w = clean(word);
	const k = clean(keyword);
	return /^\d/.test(k) ? w === k : w.startsWith(k);
};

/** Segment- und Schlüsselwort-Cues relativ zum Szenenstart (aus den echten Adam-Zeitstempeln). */
export const cuesForScene = (sceneFrom: number, spec: SceneSpec, keywords: string[] | undefined, manifest: VoiceoverManifest, fps: number): Cues => {
	const cues: Cues = {};
	for (const s of manifest.segments) {
		if (spec.segmentIds.includes(s.id)) {
			cues[s.id] = {from: Math.round((s.startMs / 1000) * fps) - sceneFrom, to: Math.round((s.endMs / 1000) * fps) - sceneFrom};
		}
	}

	if (keywords) {
		const sceneSeg = manifest.segments.filter((s) => spec.segmentIds.includes(s.id));
		const startMs = sceneSeg[0]?.startMs ?? 0;
		const endMs = sceneSeg[sceneSeg.length - 1]?.endMs ?? Number.POSITIVE_INFINITY;
		const words: Record<string, number> = {};
		for (const k of keywords) {
			const hit = manifest.captions.find((c) => c.startMs >= startMs && c.startMs <= endMs && matchesKeyword(c.text, k));
			if (hit) words[k] = Math.round((hit.startMs / 1000) * fps) - sceneFrom;
		}

		cues.words = words;
	}

	return cues;
};
