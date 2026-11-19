/**
 * Inhalte „73 Städte – ein Protesttag! Was passiert morgen?“ (Format B #12, produziert 19.11.2026 für Freitag, 20.11.2026).
 * Jede Angabe mit Quelle; wörtliche Belege in references/frankfurt-erklaert-20nov-bundesweit/sources.md.
 *
 * Drei Arten von Zahlen werden IMMER getrennt: Online-Zusagen (Website) · Anmeldung/Erwartung (Behörden, Anmelder) · tatsächliche
 * Teilnahme (gibt es erst am 20.11.). Keine Krawall-Spekulation, keine Wiederholung der Frankfurter Polizeiplanung, keine Werbung für die Initiative.
 */

export type City = {id: string; name: string; lat: number; lon: number; central: boolean; pending: boolean};
/**
 * Zahl der Städte laut Website (Stand 19.11.2026, 13:47–14:02 Uhr) – dieselbe Zahl in Ton, Bild, Thumbnail, Titel und Caption (Test prüft sie
 * gegen die Liste in ./data/staedte.json, die Szenen über ./cities.ts laden).
 */
export const CITY_COUNT = 73;
export const CENTRAL_IDS = ['berlin', 'frankfurt', 'muenchen', 'koeln'] as const;
export type CentralId = (typeof CENTRAL_IDS)[number];
export const LOCAL_COUNT = CITY_COUNT - CENTRAL_IDS.length;

export const STAND = 'Stand: 19.11.2026, 14 Uhr';
export const STAND_SHORT = 'Stand 19.11., 14 Uhr';

export const COVER = {
	big: String(CITY_COUNT),
	card: 'STÄDTE – EIN PROTESTTAG',
	date: 'FREITAG · 20. NOVEMBER 2026',
	split: `4 ZENTRAL · ${LOCAL_COUNT} ANGESCHLOSSEN`,
	question: 'WAS PASSIERT MORGEN?',
	stand: 'LAUT WEBSITE „GEN Z REGELT“ · STAND 19.11.',
};

/** Extrempunkte der Städteliste (aus den Koordinaten berechnet, Test) – Ton „Von Kiel bis Lörrach, von Aachen bis Cottbus“. */
export const EXTREMES = {north: 'kiel', south: 'loerrach', west: 'aachen', east: 'cottbus'} as const;

export const MAP = {
	counterLabel: 'STÄDTE AM 20.11.',
	counterSub: 'laut Website „Gen Z regelt“',
	growth: '16.11.: 39 Städte (Stuttgarter Zeitung) → 19.11.: 73',
	pending: 'Treffpunkt folgt',
	legendCentral: {title: 'ORGANISIERT GEN Z REGELT SELBST', sub: 'Inhalte und Ablauf'},
	legendLocal: {title: 'ANGESCHLOSSEN', sub: 'Inhalt und Organisation: lokale Gruppen'},
	centralNames: {berlin: 'BERLIN', frankfurt: 'FRANKFURT', muenchen: 'MÜNCHEN', koeln: 'KÖLN'} as Record<CentralId, string>,
	/** Kleine Zusatzzeilen an den Orten (nur Bild). München: keine behördliche Erwartung gefunden → offen. */
	centralSub: {berlin: '5.000 erwartet · Polizei', frankfurt: 'bis 4.000 erwartet · Stadt', muenchen: 'Zahl offen', koeln: '5.000–10.000 · Anmelderinnen'} as Record<CentralId, string>,
	illustration: 'Karte: Natural Earth · Punkte = Treffpunkte laut Website',
};

/** Frankfurt vs. Köln – nur Planungszahlen (Erwartung/Anmeldung), keine Zählung. */
export const COMPARE = {
	frankfurt: {
		name: 'FRANKFURT',
		place: 'Weseler Werft',
		time: 'Kundgebung 14–16:30 Uhr',
		min: 0,
		max: 4000,
		label: 'BIS ZU 4.000',
		kind: 'ERWARTET · LAUT STADT',
		extra: 'dazu eigene Versammlung „GenZ regelt Bundesbewegung“ (bis 1.500, Innenministerium)',
	},
	koeln: {
		name: 'KÖLN',
		place: 'Deutzer Werft',
		placeNote: 'statt Innenstadt – Route laut Polizei abgelehnt',
		time: 'angesetzt 13–19 Uhr',
		min: 5000,
		max: 10000,
		label: '5.000–10.000',
		kind: 'ERWARTUNG DER ANMELDERINNEN · LAUT POLIZEI KÖLN',
	},
	stamp: 'ANGABEN ZUR PLANUNG',
	stampSub: 'KEINE TATSÄCHLICHE TEILNEHMERZAHL',
	illustration: 'ILLUSTRATION',
};

/** Online-Zusagen der Website (Zähler läuft weiter → gerundet, mit Uhrzeit). */
export const PLEDGES = {
	total: 20000,
	totalLabel: '≈ 20.000',
	stand: 'Zähler der Website, 19.11., 14 Uhr',
	cities: [
		{name: 'Frankfurt', value: '≈ 3.700'},
		{name: 'Köln', value: '≈ 2.300'},
		{name: 'Berlin', value: '≈ 1.400'},
		{name: 'München', value: '≈ 800'},
	],
	/** wörtlich von der Website */
	disclaimer: 'Die Zahl zeigt, wie viele zugesagt haben. Sie ist keine Garantie, dass genau so viele Menschen vor Ort teilnehmen.',
};

export const NUMBER_KINDS = [
	{id: 'online', title: 'ONLINE-ZUSAGE', value: PLEDGES.totalLabel, sub: 'bundesweit · „keine Garantie“ laut Website', chip: 'LAUT WEBSITE'},
	{id: 'plan', title: 'ANMELDUNG / ERWARTUNG', value: 'KÖLN 5.000–10.000', sub: 'Frankfurt bis 4.000 · Planung, keine Zählung', chip: 'PLANUNG'},
	{id: 'real', title: 'TATSÄCHLICH DA', value: 'NOCH OFFEN', sub: 'zeigt sich erst am Freitag', chip: 'OFFEN'},
] as const;

/** Forderungen laut Website – Auswahl 3 von 6 („Was wir fordern“). */
export const DEMANDS = {
	title: 'FORDERUNGEN',
	kind: 'POSITION · LAUT WEBSITE',
	note: 'Auswahl: 3 von 6 Themen',
	items: [
		{id: 'bildung', title: 'BILDUNG', sub: 'Geld für Schulen, Suchthilfe, Psychotherapie'},
		{id: 'leben', title: 'BEZAHLBARES LEBEN', sub: 'Lebenshaltungskosten'},
		{id: 'wehrpflicht', title: 'NEIN ZUR WEHRPFLICHT', sub: '„Über unsere Zukunft entscheidet niemand ohne uns.“'},
	],
};

export const END = {
	question: 'WELCHE STADT WIRD AM GRÖSSTEN?',
	sub: 'Schreibt es in die Kommentare',
	day: {day: '20', month: 'NOV', weekday: 'FREITAG'},
};

export const CTA = {title: 'FOLGEN FÜR MEHR', sub: 'FRANKFURT ERKLÄRT · IN 60 SEKUNDEN'};

/** Quellenzeile unter den Untertiteln: kurze Labels statt URLs, wechselt mit dem Sprechersegment (Format-Regel ab #12). */
export const SOURCE_LINE = [
	{from: 'hook2', text: `Website „Gen Z regelt“, Städteliste · ${STAND_SHORT}`},
	{from: 'k1', text: `Website „Gen Z regelt“ (Treffpunkte) · ${STAND_SHORT} · Karte: Natural Earth`},
	{from: 'z1', text: 'Website „Gen Z regelt“: „Unsere 4 Städte“ · Berlin: Polizei laut Tagesspiegel, 18.11. · Karte: Natural Earth'},
	{from: 'z2', text: 'Website „Gen Z regelt“: angeschlossen, „nicht für Inhalt und Organisation zuständig“ · Karte: Natural Earth'},
	{from: 'f1', text: 'Stadt Frankfurt (laut t-online, 17.11.) · Innenministerium Hessen, 18.11.'},
	{from: 'k2', text: 'Polizei Köln, Pressemitteilung vom 19.11.2026, 7:58 Uhr'},
	{from: 'n1', text: 'Stadt Frankfurt · Polizei Köln · Erwartungen vor dem Protest, keine Zählung'},
	{from: 'n2', text: `Website „Gen Z regelt“, Zusagen-Zähler · ${STAND_SHORT}`},
	{from: 'n3', text: 'Tatsächliche Teilnehmerzahlen gibt es erst nach den Protesten'},
	{from: 'd1', text: 'Website „Gen Z regelt“, „Was wir fordern“ (Auswahl 3 von 6)'},
	{from: 'e1', text: `Alle Angaben: ${STAND} · Änderungen möglich`},
] as const;
