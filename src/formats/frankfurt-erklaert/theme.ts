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
	/** Outro-Länge ab Schnitt (≈ 3,3 s = Schluss-Satz ≈ 2,8 s + Ausklang ≥ 0,3 s, den check-sync nach der Stimme verlangt). */
	outroMaxFrames: 100,
	/**
	 * Ausnahme (nur mit Begründung `ausnahme` in config/videos.json, ab Teil 4 der „76 Fragen“): Informationsteil bis
	 * `infoMaxSeconds` (≤ 61,5 s), danach ein kurzer Abo-Aufruf (Segment-ID `cta`); gesamt höchstens `extendedMaxSeconds`.
	 */
	extendedMaxSeconds: 66,
	infoMaxSeconds: 61.5,
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

/**
 * Titelbild-Zonen (dauerhaft ab „76 Fragen – Teil 3“, für alle NEUEN Format-B-Folgen; y in px bei 1080 × 1920).
 * Anlass: Beim Upload von Teil 2 saßen Serientitel und große Zahl zu weit oben und wurden im TikTok-Profilraster
 * (mittiger 3:4-Ausschnitt) angeschnitten, unten blieb Fläche ungenutzt.
 * - Kernzone: Serientitel, große Zahl, Hauptgrafik, Themenkarte, Untertitelzeile.
 * - 3:4-Ausschnitt: was im Profilraster sichtbar bleibt (1080 × 1440, mittig).
 * - Im Video stehen ab ≈ 1.320 die TikTok-Untertitel → Coverelemente enden darüber (`videoBottom`).
 * - Seitenrand: wichtige Texte mindestens `side` px vom Rand (rechts zusätzlich TikTok-Knöpfe ab ≈ x 930, y 1.000).
 * Die Vorschau-Komposition `<Name>-CoverVorschau` (CoverPreviewSheet) prüft das vor jedem Export sichtbar.
 */
export const COVER_ZONE = {
	coreTop: 330,
	coreBottom: 1450,
	crop34Top: 240,
	crop34Bottom: 1680,
	videoBottom: 1300,
	side: 90,
	rightButtonsX: 930,
	rightButtonsTop: 1000,
} as const;
