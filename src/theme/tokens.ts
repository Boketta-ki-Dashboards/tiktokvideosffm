/**
 * Design-Tokens von SmokingTikTok Studio.
 * Alle Komponenten beziehen Farben, Schriften und Abstände von hier,
 * damit jedes Video denselben, wiedererkennbaren Look hat.
 */

export const VIDEO = {
	width: 1080,
	height: 1920,
	fps: 30,
} as const;

/**
 * TikTok-Sicherheitszonen (px bei 1080×1920).
 * Oben: „Folge ich / Für dich“-Leiste, rechts: Like-/Kommentar-Buttons,
 * unten: Nutzername, Beschreibung, Sound-Leiste.
 * Wichtige Inhalte (Text, Zahlen, Quellen) gehören in den Bereich innerhalb dieser Ränder.
 */
export const SAFE_AREA = {
	top: 200,
	right: 150,
	bottom: 430,
	left: 64,
} as const;

export const COLORS = {
	// Hintergründe
	night: '#070B1A',
	navy: '#0D1530',
	deep: '#141E42',
	panel: 'rgba(255, 255, 255, 0.07)',
	panelStrong: 'rgba(255, 255, 255, 0.12)',
	panelBorder: 'rgba(255, 255, 255, 0.16)',

	// Text
	text: '#FFFFFF',
	textMuted: '#B4BEDC',
	textDim: '#7D88AB',

	// Akzente
	signal: '#FFD23F', // Hauptakzent (Gelb) – Hervorhebungen, aktive Untertitel-Wörter
	alert: '#FF4D5E', // Warnung / Eskalation
	cyan: '#3DD9EB', // Verbindungen, Karten-Linien
	violet: '#8B5CF6',
	green: '#34D399',

	// Karte
	ocean: '#0A1129',
	land: '#1C2850',
	landStroke: '#2B3A6B',
	landHighlight: '#3A4E8C',

	// Stadt / Himmel
	duskTop: '#0B1235',
	duskMid: '#3B2470',
	duskLow: '#E2557A',
	duskHorizon: '#FFB36B',
	windowLit: '#FFD98A',
	windowCool: '#9FD8FF',
} as const;

export const FONTS = {
	heading: '"Montserrat", "Inter", system-ui, sans-serif',
	body: '"Inter", system-ui, sans-serif',
} as const;

export const RADII = {
	sm: 12,
	md: 20,
	lg: 32,
	pill: 999,
} as const;

export const SHADOWS = {
	card: '0 18px 50px rgba(0, 0, 0, 0.45)',
	glow: (color: string) => `0 0 40px ${color}`,
	text: '0 4px 18px rgba(0, 0, 0, 0.65)',
} as const;

/** Typografische Skala für 1080 px Breite (TikTok-lesbar auf dem Handy). */
export const TYPE = {
	hero: 108,
	title: 84,
	h2: 64,
	h3: 48,
	body: 38,
	small: 30,
	caption: 26,
	micro: 22,
} as const;
