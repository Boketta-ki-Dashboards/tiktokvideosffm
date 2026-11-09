/**
 * Format B – „FRANKFURT ERKLÄRT · IN 60 SEKUNDEN“ (Marke FrankfurtRed3).
 * Kompakte, dynamische Kurzfolgen: max. 60 s (1.800 Frames bei 30 fps) inkl. Outro, eine Frage pro Folge.
 * Farben/Schriften kommen aus den bestehenden Tokens – das Format setzt nur eigene Akzente.
 */
export const FORMAT = {
	name: 'FRANKFURT ERKLÄRT',
	sub: 'IN 60 SEKUNDEN',
	fps: 30,
	maxSeconds: 60,
	maxFrames: 1800,
	/** Outro-Länge (Format-Outro, max. ≈ 3 s). */
	outroMaxFrames: 95,
} as const;

/** Akzentfarben des Formats (konsistent über alle Folgen). */
export const ACCENT = {
	brand: '#FF3B4E',
	yes: '#3DDC97',
	no: '#FF4D5E',
	law: '#B794F6',
	info: '#4FC3F7',
	signal: '#FFD23F',
	ink: '#0B1029',
} as const;

/** Einheitliche Textpositionen (TikTok-Sicherheitszonen: oben 200, rechts 150, unten 430, links 64). */
export const LAYOUT = {
	left: 64,
	width: 866,
	badgeTop: 196,
	contentTop: 300,
	/** Unterkante für Inhalt oberhalb der Untertitel (Untertitel ≈ 1.320–1.440). */
	contentBottom: 1250,
	sourceTop: 1196,
} as const;
