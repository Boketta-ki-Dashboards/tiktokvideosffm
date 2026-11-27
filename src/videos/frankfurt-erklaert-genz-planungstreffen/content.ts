/**
 * Inhalte „Gen Z regelt Frankfurt – was soll sich am 12. Dezember ändern?“ (Format B #18, FrankfurtRedNews, produziert 25.11.2026).
 * Belege: references/frankfurt-erklaert-genz-planungstreffen/sources.md. Grundsätze: Kritik = AUSSAGE DER GRUPPE (Konjunktiv, wörtliche
 * Kurzzitate aus dem TikTok-Beitrag, Account im Screenshot nicht sichtbar → „eine Frankfurter Gruppe“); Planungstreffen nur als EINLADUNG
 * (keine Ergebnisse, kein „fand statt“); DGB-Haus = Ort, nicht Veranstalter; 12.12. = Ankündigung der Gruppe ≠ Anmeldung ≠ Behörde;
 * keine Spaltung/Wiedervereinigung, keine Route, keine Teilnehmerzahlen für den 12.12.; konfrontative Sätze des Beitrags nicht übernommen.
 */

/** Letzter Faktencheck (MEZ) – im Bild, nicht im Ton. */
export const STAND = {date: '25.11.2026', time: '17:08', label: 'STAND 25.11.2026'} as const;

export const COVER = {
	kicker: 'GEN Z REGELT FRANKFURT',
	big: '12.12.',
	card: 'WAS SOLL SICH ÄNDERN?',
	tag: 'NEUSTART GEPLANT?',
	thumb: 'KRITIK + PLANUNGSTREFFEN',
};

/** Kalenderleiste auf dem Titelbild: bisherige Demos → angekündigter Termin. */
export const DATES = [
	{day: '31', month: 'OKT', label: '31.10.', state: 'past'},
	{day: '20', month: 'NOV', label: '20.11.', state: 'past'},
	{day: '12', month: 'DEZ', label: '12.12.', state: 'next'},
] as const;

/** Der Beitrag (Screenshots vom Kanalbetreiber, nicht eingebettet – eigene Nachbildung). Zitate wörtlich (Kurzstellen). */
export const POST = {
	platform: 'TIKTOK-BEITRAG',
	by: 'AUSSAGE DER GRUPPE',
	hashtag: '#GEN Z REGELT',
	headline: 'FRANKFURTER GRUPPE ÄUSSERT KRITIK',
	quote1: '„Schlechte Planung“',
	dates: ['31.10.', '20.11.'],
	origin: 'Account im Screenshot nicht sichtbar · Inhalt wörtlich geprüft',
};

/** Kritik an der Planung (b1). */
export const ORGA = {
	headline: 'KRITIK AN KURZFRISTIGER PLANUNG',
	quote: '„drei Tage vorher ist plötzlich noch nichts organisiert“',
	items: [
		{key: 'ordner', label: 'ORDNER'},
		{key: 'technik', label: 'TECHNIK'},
		{key: 'route', label: 'ROUTE'},
	],
	countdown: 'TAGE VORHER',
};

/** Kritik an Kommunikation und Polizei (c1) + offizielle Einordnung (c2). */
export const POLIZEI = {
	headline: 'KRITIK AN KOMMUNIKATION UND POLIZEI',
	telegram: '„Telegramgruppe seit Ewigkeiten geschlossen“',
	claim: '„zu hunderten jeden Tag wahllos kontrolliert“',
	official: 'nicht die Herkunft eines Menschen, sondern konkretes Verhalten',
	officialBy: 'INNENMINISTERIUM, 18.11.',
	count: 'über 2.150 Personen kontrolliert seit 1.11. (Stand 18.11.) · 342 Kontrollen am 20.11. – laut Innenministerium',
};

/** Offenes Planungstreffen (Einladung im Beitrag). Gewerkschaftshaus laut OSM: Wilhelm-Leuschner-Straße 69–77. */
export const TREFFEN = {
	label: 'OFFENES PLANUNGSTREFFEN',
	when: 'DI 24.11. · 19 UHR',
	where: 'DGB-HAUS · SAAL A',
	invite: 'EINLADUNG DER GRUPPE',
	building: 'DGB-HAUS',
	dgb: 'Raum im DGB-Haus – eine Beteiligung des DGB ist nicht bekannt',
	lead: '18 TAGE VOR DEM 12.12.',
	result: 'ERGEBNISSE: NICHT ÖFFENTLICH BEKANNT',
	flip: ['ORDNER', 'TECHNIK', 'ROUTE', '12.12.'],
	at: [50.10358, 8.66705] as [number, number],
};

/** Abstimmung + Rückblick 20.11. (Zahlen laut Innenministerium, 21.11. – nicht addieren). */
export const ABSTIMMUNG = {
	headline: 'DIESMAL BESSERE ABSTIMMUNG?',
	left: 'FRANKFURTER GRUPPE',
	right: 'BUNDESINITIATIVE',
	retro: '20.11.: GETRENNTE PLANUNGEN',
	a: {where: 'KUNDGEBUNG WESELER WERFT', n: 30, by: 'ca. 30 laut Innenministerium'},
	b: {where: 'ZUG DER BUNDESINITIATIVE', n: 1000, by: 'ca. 1.000 laut Innenministerium'},
	note: 'Zahlen laut Innenministerium (21.11.) · nicht addiert · keine Aussage über eine Trennung',
	open: 'Zusammenarbeit für den 12.12.: bislang nicht öffentlich geklärt',
};

/** 12.12. – Ankündigung der Gruppe vs. Website der Bundesinitiative. Gallusanlage laut OSM (Park). */
export const TERMIN = {
	day: '12',
	month: 'DEZ',
	date: '12. DEZEMBER',
	time: '14 UHR',
	place: 'GALLUSANLAGE',
	by: 'ANKÜNDIGUNG DER FRANKFURTER GRUPPE',
	at: [50.10919, 8.67281] as [number, number],
	hbf: [50.10715, 8.6635] as [number, number],
	website: 'WEBSITE DER BUNDESINITIATIVE',
	websiteCity: 'FRANKFURT AM MAIN',
	websitePlace: 'Standort folgt',
	websiteTime: 'Samstag, 12.12., Uhrzeit folgt',
	websiteStand: 'abgerufen 25.11., 17:08 Uhr',
	area: 'BANKENVIERTEL',
};

/** Stufen (g1) – Terminmeldungen getrennt. */
export const STUFEN = [
	{label: 'TERMIN ANGEKÜNDIGT', sub: 'laut Beitrag der Gruppe', state: 'yes'},
	{label: 'ANMELDUNG', sub: 'öffentlich nicht bekannt', state: 'open'},
	{label: 'BEHÖRDE', sub: 'keine Mitteilung', state: 'open'},
	{label: 'ZUSAMMENARBEIT', sub: 'noch offen', state: 'open'},
] as const;

export const FRAGE = {
	q: 'WIRD DIE NÄCHSTE DEMO BESSER ORGANISIERT?',
	open: 'OFFEN',
};

export const OUTRO = {
	cta: 'FOLGEN',
	ctaSub: 'FÜR MEHR NACHRICHTEN AUS FRANKFURT',
};

/** Quellenzeile unter den Untertiteln (≤ 112 Zeichen, keine URLs). */
export const SOURCE_LINE = [
	{from: 'hook2', text: 'TikTok-Beitrag mit #GENZREGELT (Screenshot, Account nicht sichtbar) · Stand 25.11.2026'},
	{from: 'a1', text: 'TikTok-Beitrag (Screenshot), wörtlich geprüft – Aussage der Gruppe, nicht überprüfbar'},
	{from: 'c2', text: 'Hessisches Innenministerium, Pressemitteilungen vom 18.11. und 21.11.2026'},
	{from: 'd1', text: 'Einladung im TikTok-Beitrag · Ort laut OpenStreetMap: Gewerkschaftshaus, Wilhelm-Leuschner-Str. 69–77'},
	{from: 'd3', text: 'Stand 25.11.2026, 17:08 Uhr: kein Bericht über das Treffen (Medien, Polizei, Innenministerium, DGB)'},
	{from: 'e2', text: 'hessenschau, Stand 21.11.2026, 12:17 Uhr · Innenministerium, Bilanz vom 21.11.2026'},
	{from: 'f1', text: 'Ankündigung im TikTok-Beitrag der Gruppe (Screenshot) · Karte © OpenStreetMap-Mitwirkende'},
	{from: 'f2', text: 'Website „Gen Z regelt“, abgerufen 25.11.2026, 17:08 Uhr'},
	{from: 'g1', text: 'Polizei Frankfurt, Innenministerium, Medien: keine Mitteilung zum 12.12. (Stand 25.11., 17:08 Uhr)'},
] as const;
