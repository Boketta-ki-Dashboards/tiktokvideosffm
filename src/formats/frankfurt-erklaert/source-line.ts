import type {VoiceoverManifest} from '../../lib/script-timing.ts';
import {LAYOUT} from './theme.ts';

/**
 * Quellenzeile UNTER den Untertiteln (Format-Regel ab #12, 19.11.2026) – reine Logik/Geometrie (ohne React, für Tests importierbar).
 * Darstellung: ./SourceLine.tsx.
 */

/** Ein Quellen-Label, das ab dem Sprechersegment `from` (Segment-ID aus script.json) gilt – bis zum nächsten Eintrag. */
export type SourceCue = {from: string; text: string};
export type SourceLineEntry = {from: number; to: number; text: string};

/** Hellgrau, klein, halbtransparent – bewusst zurückhaltender als die Untertitel. */
export const SOURCE_LINE_STYLE = {color: '#C6CBDA', icon: '#9EA5BC', background: 'rgba(6,8,22,0.58)', padX: 16, padY: 8, iconSize: 22, gap: 10} as const;

/** Untertitel-Achse: Untertitel sind zwischen x 64 und 930 zentriert (SAFE_AREA links 64, rechts 150) – die Quellenzeile ebenso. */
export const SOURCE_LINE_BOX = {left: LAYOUT.left, width: LAYOUT.width} as const;

/** Höhe der Quellenbox bei n Zeilen (px) → Test: 2 Zeilen enden über `LAYOUT.sourceLineMaxBottom`. */
export const sourceLineHeight = (lines: number) => Math.ceil(lines * LAYOUT.sourceLineFont * LAYOUT.sourceLineLineHeight + 2 * SOURCE_LINE_STYLE.padY);

/**
 * Zeitplan der Quellenzeile aus den echten Sprecher-Zeitstempeln: Wechsel 4 Frames vor dem Segment, gleiche Texte hintereinander werden
 * zusammengefasst (kein Flackern), nichts vor `start` (Titelbild), nichts ab `end` (Videoende bzw. vom Aufrufer gesetzt).
 */
export const resolveSourceLine = (cues: SourceCue[], manifest: VoiceoverManifest, fps: number, {start, end}: {start: number; end: number}): SourceLineEntry[] => {
	const at = (id: string) => {
		const seg = manifest.segments.find((s) => s.id === id);
		if (!seg) throw new Error(`Quellenzeile: Segment „${id}“ fehlt im Sprecher-Manifest.`);
		return Math.max(start, Math.round((seg.startMs / 1000) * fps) - 4);
	};
	const raw = cues.map((c) => ({from: at(c.from), text: c.text})).sort((a, b) => a.from - b.from);
	const merged = raw.filter((c, i) => i === 0 || c.text !== raw[i - 1].text);
	return merged
		.map((c, i) => ({from: c.from, to: Math.min(end, merged[i + 1]?.from ?? end), text: c.text}))
		.filter((e) => e.to - e.from > 0);
};
