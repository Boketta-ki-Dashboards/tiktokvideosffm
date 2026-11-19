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
	/**
	 * Sonderausnahme (nur mit ausdrücklicher Freigabe des Kanalbetreibers je Folge, `sonderausnahme` in config/videos.json; erstmals #09
	 * „4 Proteste – 1 Freitag“, 17.11.2026: vier Versammlungen als eigene Punkte + längere Batman-Geschichte): Informationsteil bis 69 s,
	 * gesamt bis 75 s. Alle anderen Folgen bleiben bei 60 s bzw. 66 s.
	 */
	specialMaxSeconds: 75,
	specialInfoMaxSeconds: 69,
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
	/**
	 * Kopfzeile ab Folge #09 (17.11.2026, dauerhaft für alle neuen Folgen): kleines Serien-Overlay (Countdown + „FRANKFURT ERKLÄRT ·
	 * IN 60 SEKUNDEN · #NN“) rechtsbündig UNTER der TikTok-Suchleiste (in der App ≈ y 90–238), links davon die Szenen-Box (`TopTag`) –
	 * beide mit gleicher Oberkante `badgeTopRight` (y 272) und gleicher Höhe `topBarHeight` (70 px) → symmetrische Kopfzeile y 272–342.
	 * Abstand rechts 48 px, links `left` (64 px). Szenen-Inhalte beginnen darunter (≈ y 360+). Fertige Folgen behalten `top-left` (badgeTop).
	 */
	badgeTopRight: 272,
	badgeRightInset: 48,
	topBarHeight: 70,
	contentTop: 300,
	/** Unterkante für Inhalt oberhalb der Untertitel (Untertitel ≈ 1.320–1.440). */
	contentBottom: 1250,
	/** Alte Quellenzeile ÜBER den Untertiteln (`SourceBar`, Folgen #01–#11). Neue Folgen: `sourceLine*` (unter den Untertiteln). */
	sourceTop: 1196,
	/**
	 * Untertitel: Abstand der Untertitel-UNTERKANTE vom unteren Bildrand (Unterkante y 1.440). Mehrzeilige Seiten wachsen nach OBEN –
	 * deshalb bleibt alles darunter (Quellenzeile) bei 1, 2 oder 3 Zeilen an derselben Stelle.
	 */
	subtitleBottomPad: 480,
	/**
	 * Quellenzeile UNTER den Untertiteln (dauerhaft ab #12, 19.11.2026, für alle NEUEN Folgen – `ErklaertEpisode.sourceLine`):
	 * konstanter Bereich y 1.512–1.630 (≥ 24 px unter der Untertitel-Unterkante inkl. Kontur), höchstens 2 Zeilen, mittig auf der
	 * Untertitel-Achse (x 64–930, also links der App-Knöpfe). Liegt bewusst in der TikTok-Beschreibungszone – dass die Beschreibung die
	 * Quelle in der App teilweise überdeckt, ist vom Kanalbetreiber akzeptiert (Quellen bleiben im Video und beim Pausieren lesbar).
	 */
	sourceLineTop: 1512,
	sourceLineMaxBottom: 1630,
	sourceLineFont: 24,
	sourceLineLineHeight: 1.3,
	sourceLineMaxLines: 2,
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
