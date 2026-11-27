/**
 * Inhalte „Nach dem 20. November: Schon die nächste Demo geplant?“ (Format B #16, produziert 22.11.2026).
 * Belege: references/frankfurt-erklaert-12dez-ausblick/sources.md. Grundsätze: Veranstalterankündigung ≠ Anmeldung ≠ behördliche Entscheidung;
 * keine erfundene Uhrzeit, kein erfundener Treffpunkt, keine Route; keine Spaltung behaupten; Online-Zusagen ≠ Teilnehmende; keine Prognose.
 */

/** Letzter Faktencheck (MEZ) – im Bild, nicht im Ton. */
export const STAND = {date: '22.11.2026', time: '17:54', label: 'STAND 22.11.2026'} as const;

export const CITY_COUNT = 73;
export const CENTRAL = ['Frankfurt am Main', 'Berlin', 'München', 'Köln'] as const;

export const COVER = {
	kicker: 'GEN Z REGELT · NACH DEM 20.11.',
	big: '12.12.',
	card: 'SCHON DIE NÄCHSTE DEMO?',
	tag: 'ANGEKÜNDIGT · 73 STÄDTE',
	thumb: 'WIE GEHT ES IN FRANKFURT WEITER?',
};

/** Rückblick 20.11. (Innenministerium laut hessenschau, Stand 21.11.2026, 12:17 Uhr). */
export const RUECKBLICK = {
	date: '20.11.2026',
	calm: 'WEITGEHEND FRIEDLICH',
	calmBy: 'laut Polizei und Innenministerium',
	fewer: 'WENIGER TEILNEHMER ALS ANGEKÜNDIGT',
	fewerBy: 'laut Polizei ≈ 1.700 bei vier Demos zusammen',
	facts: ['2.900 Einsatzkräfte', '10 Festnahmen', '342 Kontrollen'],
	factsBy: 'Innenministerium laut hessenschau, 21.11.',
};

/** Unterschiedliche Planungen am 20.11. (hessenschau 21.11.2026, 12:17 Uhr; t-online Frankfurt 20.11.2026). */
export const PLANUNGEN = {
	left: {who: 'ORTSGRUPPE', where: 'WESELER WERFT', how: 'stationäre Kundgebung', at: [50.1080116, 8.6978325] as [number, number]},
	right: {who: 'BUNDESINITIATIVE', where: 'BAHNHOFSVIERTEL', how: 'Demozug ab Kaisersack (Hbf)', at: [50.1074, 8.6655] as [number, number]},
	note: 'Planungen vom 20.11. · keine Aussage über eine dauerhafte Trennung',
};

/** 12.12. laut Website genz-regelt.de (Stand 22.11.2026, 17:54 Uhr). */
export const TERMIN = {
	weekday: 'SAMSTAG',
	day: '12',
	month: 'DEZ',
	full: '12.12.2026',
	label: 'NÄCHSTER PROTESTTAG ANGEKÜNDIGT',
	by: 'laut Website der Initiative',
	sameList: 'dieselbe Städteliste wie am 20.11.',
	centralLabel: 'STÄDTE ORGANISIERT DIE INITIATIVE SELBST',
	centralSub: 'Inhalte und Ablauf · laut Website',
	otherSub: '69 weitere Städte: angeschlossen, andere Gruppen vor Ort',
	mapNote: 'Lage der Städte · Treffpunkte für den 12.12. noch nicht veröffentlicht',
};

/** Frankfurt am 12.12. – was steht fest, was nicht. */
export const FRANKFURT = {
	rows: [
		{k: 'DATUM', v: 'Samstag, 12.12.2026', state: 'ok' as const},
		{k: 'ORGANISATION', v: 'Gen Z regelt (Bundesinitiative)', state: 'ok' as const},
		{k: 'TREFFPUNKT', v: '„Standort folgt“', state: 'open' as const},
		{k: 'UHRZEIT', v: '„Uhrzeit folgt“', state: 'open' as const},
		{k: 'ROUTE', v: 'nicht veröffentlicht', state: 'open' as const},
	],
	steps: [
		{k: 'ANKÜNDIGUNG', v: 'Veranstalter (Website)', state: 'ok' as const},
		{k: 'ANMELDUNG', v: 'öffentlich nicht bekannt', state: 'open' as const},
		{k: 'BEHÖRDE', v: 'keine Mitteilung von Stadt/Polizei', state: 'open' as const},
	],
	stepsNote: 'Fehlende Mitteilung heißt nicht, dass nichts angemeldet ist',
};

/** Mitmachen-Seite und Förderpool (genz-regelt.de, 22.11.2026). */
export const ORGA = {
	title: 'NEUE HELFER GESUCHT',
	roles: [
		{k: 'HELFER*INNEN', v: 'Flyer, Schilder, Auf- und Abbau'},
		{k: 'ORDNER*INNEN', v: 'ab 18 · weiße Armbinde · „sicher und friedlich“'},
		{k: 'TEAM', v: 'Orga, Social Media, Presse – über den 12.12. hinaus'},
	],
	pool: 'FÖRDERPOOL FÜR LOKALE GRUPPEN',
	poolSub: 'Geld für Bühne, Technik, Flyer – aus der GoFundMe-Sammlung, nur mit Bekenntnis zu gewaltfreien Regeln',
	by: 'laut Website der Initiative · wie viele mitmachen, ist nicht bekannt',
};

/** Online-Zusagen (Zähler der Website, Schnittstelle api/counts). */
export const ZUSAGEN = {
	count: 814,
	countAt: 'Stand 22.11., 17:54 Uhr · Zähler läuft weiter',
	quote: '„Sie ist keine Garantie, dass genau so viele Menschen vor Ort teilnehmen.“',
	quoteBy: 'Website der Initiative zum Zusagen-Zähler',
	neq: 'ONLINE-ZUSAGEN ≠ TEILNEHMER',
};

export const FRAGE = {
	question: 'KOMMEN WIEDER MEHR MENSCHEN?',
	/** Vergleich ohne Prognose: 20.11. = Polizeischätzung (alle vier Frankfurter Versammlungen zusammen), 12.12. = offen. */
	before: {date: '20.11.', value: '≈ 1.700', by: 'laut Polizei · vier Demos von Gen Z regelt und anderen Initiativen zusammen'},
	after: {date: '12.12.', value: 'OFFEN', by: 'Zahl erst nach dem Protesttag bekannt'},
	cta: 'FOLGEN',
	ctaSub: 'FÜR MEHR AUS FRANKFURT',
};

/** Quellenzeile unter den Untertiteln (≤ 112 Zeichen, keine URLs). */
export const SOURCE_LINE = [
	{from: 'hook2', text: 'Website „Gen Z regelt“, Stand 22.11.2026, 17:54 Uhr'},
	{from: 'r1', text: 'Innenministerium laut hessenschau, 21.11.2026, 12:17 Uhr · Polizeischätzung'},
	{from: 'r2', text: 'hessenschau, 21.11.2026, 12:17 Uhr · t-online Frankfurt, 20.11.2026'},
	{from: 'n1', text: 'Website „Gen Z regelt“: „Samstag, 12. Dezember 2026 in 73 Städten“ (22.11.2026)'},
	{from: 'f1', text: 'Website „Gen Z regelt“: „Unsere 4 Städte – hier organisiert Gen Z regelt Inhalte und Ablauf“'},
	{from: 'f2', text: 'Website „Gen Z regelt“, Frankfurt: „Standort folgt“, „Uhrzeit folgt“ (22.11.2026)'},
	{from: 'f3', text: 'Stadt Frankfurt, Polizei Frankfurt, Innenministerium: bis 22.11., 17:54 Uhr keine Mitteilung'},
	{from: 'f4', text: 'Keine öffentliche Angabe zu einer Anmeldung bei der Versammlungsbehörde (Stand 22.11.2026)'},
	{from: 'm1', text: 'Website „Gen Z regelt“, Seite „Mitmachen“ (22.11.2026)'},
	{from: 'm2', text: 'Website „Gen Z regelt“, Seite „Förderpool“ (22.11.2026)'},
	{from: 'z1', text: 'Website „Gen Z regelt“, Hinweis zum Zusagen-Zähler (22.11.2026)'},
	{from: 'q1', text: 'Ausblick · Stand 22.11.2026 · Veranstalterangaben, keine Prognose'},
] as const;
