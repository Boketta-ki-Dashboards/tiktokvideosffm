/**
 * Geometrie der Tages-Timeline (`DayTimeline.tsx`) als reine Funktionen – für Layout-Tests ohne React/TSX.
 * `full`: große Fassung (Titelbild/Übersicht), `strip`: kompakte Orientierungsleiste in den Szenen.
 */

/** x-Position (px) der Markierung i von n bei gleichmäßigen Abständen (Reihenfolge, keine Zeitskala). */
export const dayTimelineX = (i: number, n: number, width: number) => (width * (i + 0.5)) / n;

export type DayTimelineGeometry = {d: number; timeFont: number; lineY: number; labelTop: number; labelFont: number; height: number};

/** Maße je Variante: Orb-Durchmesser `d`, Lage der Achse `lineY`, Oberkante der Kurztitel, Gesamthöhe (inkl. zweizeiliger Titel). */
export const dayTimelineGeometry = (variant: 'full' | 'strip', size?: number): DayTimelineGeometry => {
	if (variant === 'strip') {
		const d = size ?? 44;
		const timeFont = 24;
		const lineY = Math.round(timeFont * 1.15 + 6 + d / 2);
		return {d, timeFont, lineY, labelTop: lineY + d / 2 + 6, labelFont: 22, height: lineY + d / 2 + 6 + 26};
	}

	const d = size ?? 88;
	const timeFont = Math.round(d * 0.5);
	const lineY = Math.round(timeFont * 1.15 + 8 + d / 2);
	const labelFont = Math.max(20, Math.round(d * 0.24));
	return {d, timeFont, lineY, labelTop: lineY + d / 2 + 12, labelFont, height: lineY + d / 2 + 12 + labelFont * 2.2};
};
