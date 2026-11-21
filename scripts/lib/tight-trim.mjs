/**
 * Kurzformat-Schnitt (opt-in über script.json → "voice": {"trim": {"mode": "letters", "maxInnerGapMs": 320}}):
 * 1. Schnitt am letzten/ersten BUCHSTABEN statt am letzten Zeichen – ElevenLabs gibt dem Satzzeichen am Ende
 *    (! . ?) oft 0,2–0,8 s, die sonst als Leerlauf-Pause in der Spur landen.
 * 2. Lange Pausen INNERHALB eines Satzes (nach „?“ oder „:“) werden auf maxInnerGapMs gekürzt: aus der Mitte der
 *    Lücke wird Stille entfernt, die Sprache selbst bleibt unverändert (keine Beschleunigung). Die Zeichenzeiten
 *    werden passend verschoben, damit Untertitel synchron bleiben.
 */
const isLetter = (c) => /[\p{L}\p{N}]/u.test(c);

export const letterWindow = (alignment) => {
	const ch = alignment?.characters ?? [];
	let first = null;
	let last = null;
	ch.forEach((c, i) => {
		if (isLetter(c)) {
			if (first === null) first = alignment.character_start_times_seconds[i];
			last = alignment.character_end_times_seconds[i];
		}
	});
	return {first: first ?? 0, last: last ?? 0};
};

/** Bereiche, die behalten werden, + verschobene Zeichenzeiten. */
export const compressGaps = (alignment, cutStart, cutEnd, maxGapSec) => {
	const ch = alignment.characters;
	const st = alignment.character_start_times_seconds;
	const en = alignment.character_end_times_seconds;
	const removed = [];
	let prev = -1;
	for (let i = 0; i < ch.length; i++) {
		if (!isLetter(ch[i])) continue;
		if (prev >= 0) {
			const gs = en[prev];
			const ge = st[i];
			if (ge - gs > maxGapSec && gs > cutStart && ge < cutEnd) removed.push([gs + maxGapSec / 2, ge - maxGapSec / 2]);
		}
		prev = i;
	}
	const ranges = [];
	let a = cutStart;
	for (const [rs, re] of removed) {
		ranges.push([a, rs]);
		a = re;
	}
	ranges.push([a, cutEnd]);
	const shift = (t) => {
		let s = 0;
		for (const [rs, re] of removed) {
			if (t >= re) s += re - rs;
			else if (t > rs) s += t - rs;
		}
		return t - s;
	};
	return {
		ranges,
		removedSec: removed.reduce((x, [rs, re]) => x + (re - rs), 0),
		alignment: {...alignment, character_start_times_seconds: st.map(shift), character_end_times_seconds: en.map(shift)},
	};
};
