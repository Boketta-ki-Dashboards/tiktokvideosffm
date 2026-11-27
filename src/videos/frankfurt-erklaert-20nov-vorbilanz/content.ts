/**
 * Inhalte „Frankfurt 20.11. – was ist heute wirklich passiert?“ (Format B #14, VORBILANZ vom Freitag, 20.11.2026).
 * Belege: references/frankfurt-erklaert-20nov-vorbilanz/sources.md (wörtliche Zitate, Uhrzeiten der Ticker-Meldungen, Abrufzeit).
 * Grundsätze: KEINE Tagesbilanz – nur der letzte überprüfbare Stand (Uhrzeit `STAND.time` = letzter Faktencheck). Versammlungen getrennt,
 * Zahlen nie addiert, jede Zahl mit Urheber; Uhrzeiten an Karte und Zeitleiste sind Zeitpunkte der MELDUNG (Ticker), keine erfundenen Minuten.
 */

export type DemoId = 'schulstreik' | 'werft' | 'zug';

/** Letzter Faktencheck (MEZ) – erscheint im Bild (Titelbild, Quellenzeile, Fazit), nicht im Ton. */
export const STAND = {
	date: '20.11.2026',
	time: '19:18',
	label: 'VORBILANZ',
	/** neueste ausgewertete Meldungen: HIT RADIO FFH 18:48 Uhr, hessenschau 18:58 Uhr (Bockenheimer Warte, Zuordnung unklar – nicht verwendet) */
	latest: 'hessenschau 18:58 Uhr',
} as const;

export const standText = () => `STAND ${STAND.time} UHR`;

export const COVER = {
	kicker: 'FRANKFURT 20.11.',
	big: ['DIE ERSTE', 'BILANZ!'],
	card: 'WAS IST HEUTE PASSIERT?',
	tag: STAND.label,
	thumb: `STAND ${STAND.date.slice(0, 6)}, ${STAND.time} UHR · KEINE ENDBILANZ`,
};

/** Zeitleiste „Was heute passiert ist“: Uhrzeiten = Zeitpunkt der jeweiligen Ticker-Meldung (nicht Planzeiten). */
export const DAY = [
	{id: 'schulstreik', time: '11:06', label: 'SCHUL-\nSTREIK', color: '#46C2FF', icon: 'book', source: 'hessenschau 11:06 – Demozug am Willy-Brandt-Platz gestartet'},
	{id: 'werft', time: '14:46', label: 'WERFT\nAUFGELÖST', color: '#FF3B4E', icon: 'sign', source: 'hessenschau 14:46 – Kundgebung an der Weseler Werft aufgelöst'},
	{id: 'oper', time: '17:36', label: 'ALTE\nOPER', color: '#FFB15C', icon: 'march', source: 'hessenschau 17:36 – Demozug auf Höhe der Alten Oper (laut Polizei)'},
	{id: 'bockenheim', time: '18:27', label: 'BOCKEN-\nHEIM', color: '#FFD23F', icon: 'flag', source: 'HIT RADIO FFH 18:27 – Demozug in Bockenheim angekommen'},
] as const;
export const DAY_NOTE = 'Uhrzeit = Zeitpunkt der Meldung';

/** Weseler Werft (Ostend): stationäre Kundgebung der Frankfurter Ortsgruppe, geplant 14–16:30 Uhr. */
export const WERFT = {
	name: 'WESELER WERFT',
	where: 'Ostend · am Main',
	planned: 'geplant 14:00–16:30 Uhr',
	/** t-online-Newsblog: „Die Polizei rechnet bis zu 4.000 Teilnehmenden.“ · FFH: „mit erwarteten 4.000 Teilnehmern“. hessenschau schreibt „angemeldete“ – vorsichtiger: ERWARTET. */
	expected: 4000,
	expectedLabel: 'ERWARTET',
	expectedBy: 'laut Polizei',
	/** hessenschau 14:46: „Lediglich 20 bis 30 Demonstrierende waren am frühen Nachmittag vor Ort.“ · t-online: „lediglich etwa 25 Teilnehmer“. */
	present: '20–30',
	presentLabel: 'VOR ORT',
	presentBy: 'laut Reportern · hessenschau 20–30 · t-online ≈ 25',
	presentDots: 25,
	/** hessenschau 14:46: „nach kurzer Zeit bereits offiziell aufgelöst“ · hessenschau-Bericht: „nach 14 Uhr vom Veranstalter beendet“. */
	ended: 'VORZEITIG BEENDET',
	endedNote: 'Meldung 14:46 Uhr · laut hessenschau aufgelöst',
	at: [50.1080116, 8.6978325] as [number, number],
};

/** Streit innerhalb von „Gen Z regelt“ – beide Seiten mit Urheber; Schilderungen im Konjunktiv. */
export const CONFLICT = {
	title: 'ZOFF BEI GEN Z REGELT',
	left: {
		who: 'ORTSGRUPPE FRANKFURT',
		what: 'KUNDGEBUNG AM MAIN',
		how: 'mit der Stadt vereinbart: kein Demozug',
		/** hessenschau 14:46 (Frankfurter Organisator vor Ort) */
		quote: '„… und jetzt stehen wir hier allein.“',
		quoteBy: 'Frankfurter Organisator laut hessenschau',
	},
	right: {
		who: 'BUNDESBEWEGUNG',
		what: 'DEMOZUG AB HAUPTBAHNHOF',
		how: 'Aufruf per Instagram und Pressemitteilung',
		/** Stellungnahme laut FFH (9:56) und t-online */
		quote: '„… nicht auf einer abgelegenen Wiese“',
		quoteBy: 'Stellungnahme laut HIT RADIO FFH und t-online',
	},
	/** t-online: „Der Frankfurter Ortsgruppe seien demnach Ressourcen gestrichen worden, darunter Equipment für die Demo sowie Ordner …“ */
	claim: 'Ordner und Equipment seien gestrichen worden',
	claimBy: 'SCHILDERUNG DER ORTSGRUPPE (t-online) · nicht unabhängig bestätigt',
};

/** Demozug der „GenZ regelt Bundesbewegung“: nur gemeldete Punkte, Verlauf dazwischen schematisch. */
export const MARCH = {
	stops: [
		{id: 'start', name: 'HAUPTBAHNHOF', sub: 'START · BAHNHOFSVIERTEL', at: [50.1076, 8.6658] as [number, number], time: null as string | null},
		{id: 'taunus', name: 'TAUNUSANLAGE', sub: 'GEMELDET', at: [50.1125, 8.67] as [number, number], time: null as string | null},
		{id: 'oper', name: 'ALTE OPER', sub: 'MELDUNG 17:36', at: [50.1159, 8.672] as [number, number], time: '17:36'},
		{id: 'ziel', name: 'BOCKENHEIMER DEPOT', sub: 'ZIEL · MELDUNG 18:27', at: [50.1194, 8.6545] as [number, number], time: '18:27'},
	],
	/** t-online-Reporter: „mit einer Verspätung von einer halben Stunde“ (geplant 15:30 Uhr) */
	late: 'VERSPÄTETER START',
	lateNote: 'geplant 15:30 Uhr · laut t-online ≈ 30 Min. später',
	/** FFH 18:27: geplant gegen 17:15 Uhr, „erst rund eine Stunde später“ */
	arrived: 'BOCKENHEIM ERREICHT',
	arrivedNote: 'geplant ≈ 17:15 Uhr · laut FFH rund 1 Std. später',
	/** gemeldete Zwischenstände (verschiedene Urheber – nicht vermischen) */
	counts: [
		{time: '15:34', value: 'RUND 150', by: 'hessenschau-Reporter, vor dem Start'},
		{time: '17:36', value: 'RUND 700', by: 'Polizei'},
		{time: '17:57', value: 'RUND 1.000', by: 'Polizei'},
	],
	count: 1000,
	countBy: 'LAUT POLIZEI · hessenschau 17:57 · t-online: 900–1.000',
	unofficial: 'inoffiziell genannt: knapp 1.300 – nicht bestätigt',
	mapNote: 'Punkte laut Meldungen · Verlauf schematisch · © OpenStreetMap',
	highlight: [
		{name: 'Taunusanlage', note: 'gemeldet'},
		{name: 'Bockenheimer Landstraße', note: 'laut Polizei vorgesehen'},
	],
};

/** Erwartung vs. tatsächlich – je Versammlung getrennt, gleiche Skala, NICHT addiert. */
export const COMPARE = {
	max: 5000,
	rows: [
		{id: 'zug' as DemoId, title: 'DEMOZUG BUNDESBEWEGUNG', expected: 1500, expectedText: 'bis 1.500 erwartet (Polizei)', claim: 5000, claimText: 'Gruppe selbst: bis 5.000', actual: 1000, actualText: 'RUND 1.000', actualBy: 'Polizei'},
		{id: 'werft' as DemoId, title: 'KUNDGEBUNG WESELER WERFT', expected: 4000, expectedText: 'bis 4.000 erwartet (Polizei)', claim: null as number | null, claimText: null as string | null, actual: 25, actualText: '20–30', actualBy: 'Reporter'},
		{id: 'schulstreik' as DemoId, title: 'SCHULSTREIK (VORMITTAG)', expected: null as number | null, expectedText: 'ver.di-Jugend', claim: null as number | null, claimText: null as string | null, actual: 600, actualText: 'RUND 600', actualBy: 'Polizei'},
	],
	noSum: 'NICHT ADDIEREN',
	noSumSub: 'getrennte Versammlungen · verschiedene Zählungen',
};

export const POLICE = {
	calm: 'BISHER FRIEDLICH',
	calmNote: 'Meldung 17:51 Uhr · Polizei laut HIT RADIO FFH',
	pyro: 'ABER: PYROTECHNIK GEZÜNDET',
	pyroNote: 'Meldung 18:48 Uhr · Polizei laut HIT RADIO FFH',
	gear: 'einzelne mit Fahrradhelmen, Schutzbrillen, Schienbeinschonern',
	force: 'mehr als 2.000 Einsatzkräfte angekündigt',
	forceBy: 'Innenministerium, 18.11.',
	zeil: 'Zeil/Hauptwache: laut Polizeisprecher „nichts passiert“ (15:34)',
};

export const OUTRO = {
	open: [
		{icon: 'doc', text: 'offizielle Bilanz der Polizei'},
		{icon: 'clock', text: 'Abend: ver.di-Jugend-Versammlung bis 21:30 Uhr angemeldet'},
	],
	openTitle: 'NOCH OFFEN',
	noFinal: 'KEINE ENDBILANZ',
	question: 'Wart ihr dabei? Schreibt’s unten rein!',
	cta: 'FOLGEN',
	ctaSub: 'FÜR DIE NÄCHSTE BILANZ',
};

/** Quellenzeile unter den Untertiteln (wechselt mit dem Sprechersegment). Kurze Labels, keine URLs (≤ 112 Zeichen, Test). */
export const SOURCE_LINE = [
	{from: 'hook2', text: `Live-Ticker hessenschau, HIT RADIO FFH, t-online · Stand 20.11.2026, ${STAND.time} Uhr`},
	{from: 'w1', text: 'Polizei laut t-online-Newsblog und HIT RADIO FFH, 20.11.2026'},
	{from: 'w2', text: 'hessenschau-Ticker, 14:46 Uhr (20 bis 30) · t-online-Reporter (etwa 25)'},
	{from: 'k1', text: 'hessenschau-Ticker, 20.11.2026, 14:15 und 14:46 Uhr'},
	{from: 'k3', text: 'Stellungnahme der Bundesbewegung laut HIT RADIO FFH (9:56 Uhr) und t-online'},
	{from: 'k4', text: 'Veranstalterin der Frankfurter Ortsgruppe laut t-online, 20.11.2026'},
	{from: 'd1', text: 't-online-Reporter, Newsblog vom 20.11.2026 (aktualisiert 18:40 Uhr)'},
	{from: 'd2', text: 'Polizei laut hessenschau, 17:36 Uhr · HIT RADIO FFH, 18:27 Uhr'},
	{from: 'd3', text: 'Polizei laut hessenschau, 17:57 Uhr · laut t-online 900 bis 1.000'},
	{from: 'e1', text: 'Polizei laut t-online · Bundesbewegung laut HIT RADIO FFH, 20.11.2026'},
	{from: 'e2', text: 'Polizei laut hessenschau, 20.11.2026'},
	{from: 'p1', text: 'Polizei laut HIT RADIO FFH, 17:51 und 18:48 Uhr'},
	{from: 'o1', text: `Polizei Frankfurt und Innenministerium: bis ${STAND.time} Uhr keine Bilanz veröffentlicht`},
	{from: 'q1', text: `VORBILANZ · Stand 20.11.2026, ${STAND.time} Uhr · keine endgültige Tagesbilanz`},
] as const;
