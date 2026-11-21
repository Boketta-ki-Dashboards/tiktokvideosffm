/**
 * Inhalte „Gen-Z-Proteste: Was ist in Hamburg, Leipzig und den anderen Städten passiert?“ (Format B #15, Nachbetrachtung des 20.11.2026,
 * produziert 21.11.2026). Belege: references/frankfurt-erklaert-20nov-staedte/sources.md (Polizeimeldungen + Regionalmedien, Uhrzeiten).
 * Grundsätze: angemeldete Demonstration und spätere Ausschreitungen strikt trennen; nie „alle Demonstrierenden“; keine Steuerung durch eine
 * zentrale Organisation behaupten; Versammlungen und Städte nicht verknüpfen oder addieren; jede Zahl mit Urheber; neuester Meldestand.
 */

export type CityId = 'hamburg' | 'leipzig' | 'berlin' | 'stuttgart' | 'bremen' | 'frankfurt';
/** Einordnung nach Polizeiangaben: friedlich · Zwischenfälle während der Demo · Ausschreitungen nach dem Ende. */
export type Verlauf = 'friedlich' | 'waehrend' | 'danach';

export const STAND = {date: '21.11.2026', time: '17:51', label: 'STAND 21.11.2026'} as const;

export const VERLAUF: Record<Verlauf, {label: string; color: string}> = {
	friedlich: {label: 'WEITGEHEND FRIEDLICH', color: '#3DDC97'},
	waehrend: {label: 'ZWISCHENFÄLLE WÄHREND DER DEMO', color: '#FFB547'},
	danach: {label: 'AUSSCHREITUNGEN NACH DEM ENDE', color: '#FF4D5E'},
};

export const CITIES: {id: CityId; name: string; lat: number; lon: number; verlauf: Verlauf}[] = [
	{id: 'hamburg', name: 'HAMBURG', lat: 53.5511, lon: 9.9937, verlauf: 'danach'},
	{id: 'bremen', name: 'BREMEN', lat: 53.0793, lon: 8.8017, verlauf: 'waehrend'},
	{id: 'berlin', name: 'BERLIN', lat: 52.52, lon: 13.405, verlauf: 'friedlich'},
	{id: 'leipzig', name: 'LEIPZIG', lat: 51.3397, lon: 12.3731, verlauf: 'danach'},
	{id: 'frankfurt', name: 'FRANKFURT', lat: 50.1109, lon: 8.6821, verlauf: 'friedlich'},
	{id: 'stuttgart', name: 'STUTTGART', lat: 48.7758, lon: 9.1829, verlauf: 'waehrend'},
];

export const COVER = {
	kicker: 'GEN-Z-PROTESTE · 20.11.',
	big: ['HAMBURG', 'LEIPZIG'],
	more: '+ BERLIN · STUTTGART · BREMEN',
	card: 'WAS IST PASSIERT?',
	tag: 'NACHBETRACHTUNG',
	thumb: 'STAND 21.11. · POLIZEI & REGIONALMEDIEN',
};

/** Hamburg (NDR, Stand 21.11., 13:18 Uhr; NDR-Liveticker 20.11.; t-online/dpa 21.11., 7:13 Uhr). */
export const HAMBURG = {
	count: 4000,
	countBy: 'LAUT POLIZEI · in der Spitze · Abendzug „Gen Z regelt“',
	total: 'insgesamt ≈ 9.000 bei allen Demos des Tages (NDR)',
	route: ['DAMMTOR', 'SCHANZE'],
	demo: {label: 'DEMO', sub: 'weitgehend friedlich · vereinzelt Pyrotechnik', from: '18:06', to: '20:40'},
	after: {label: 'NACH DEM ENDE', sub: 'Pyrotechnik + Eier · Pfefferspray · Gewahrsam'},
	afterItems: ['Pyrotechnik + Eier auf Einsatzkräfte', 'Pfefferspray, Wasserwerfer rücken an', 'mehrere Menschen in Gewahrsam', 'Gruppe eingekesselt, Personalien (Meldung 22:54)'],
	correction: 'Polizei korrigierte: Pyrotechnik statt Flaschen',
	end: 'Demo beendet · Meldung 20:40',
};

/** Leipzig (Polizeidirektion Leipzig, Medieninformation 416|26, 20.11., 23:40 Uhr; Ergänzungsmeldung 21.11., 12:30 Uhr). */
export const LEIPZIG = {
	count: 2500,
	countBy: 'LAUT POLIZEI · Zug um den Innenstadtring',
	demo: {label: 'DEMO', sub: 'bis zur Hälfte weitgehend friedlich, dann Pyrotechnik + Bewurf', from: '17:00', to: '≈ 19:00'},
	after: {label: 'NACH DEM ENDE', sub: 'Südvorstadt: Barrikaden, Flaschen, Steine'},
	water: 'WASSERWERFER',
	waterSub: 'kurzzeitig eingesetzt · dazu Pfefferspray',
	injured: 5,
	injuredLabel: 'VERLETZTE BEAMTE',
	injuredSub: 'laut Polizei · einer mit Knalltrauma',
	ids: 200,
	idsLabel: 'IDENTITÄTEN FESTGESTELLT',
	idsSub: 'darunter 4 Kinder und über 40 Jugendliche',
	probe: 'Ermittlungen wegen schweren Landfriedensbruchs (§ 125a StGB)',
	noGuilt: 'VERDACHT ≠ SCHULD',
	forces: 'rund 800 Einsatzkräfte',
};

/** Berlin (Tagesspiegel/dpa, Stand 20.11., 17:38 Uhr, Polizeiangaben). */
export const BERLIN = {
	count: '4.000',
	countBy: 'laut Polizei',
	route: 'Alexanderplatz → Kreuzberg',
	result: 'OHNE BESONDERE VORKOMMNISSE',
	resultBy: 'laut Polizei',
};

/** Stuttgart (Polizeipräsidium Stuttgart, Pressemitteilung 20.11.2026, 22:47 Uhr). */
export const STUTTGART = {
	count: 'MEHRERE HUNDERT',
	countBy: 'laut Polizei · angemeldet: 1.000',
	what: 'Pyrotechnik · Vermummung · Zug mehrfach gestoppt',
	result: 'ÜBER 20 VORLÄUFIGE FESTNAHMEN',
	resultBy: 'laut Polizei · Ermittlungen laufen',
};

/** Bremen (Polizei Bremen, Pressemitteilung Nr. 0733, 20.11.2026, 17:15 Uhr). */
export const BREMEN = {
	count: 'BIS ZU 1.800',
	countBy: 'laut Polizei · in der Spitze',
	what: 'Pyrotechnik · Farbe gegen das CDU-Parteibüro',
	result: 'VERSUCH, EIN AUTO ANZUZÜNDEN',
	resultBy: 'laut Polizei · leichte Schäden · Anzeigen u. a. wegen Landfriedensbruchs',
};

/** Frankfurt (Innenminister Poseck, 20.11. abends; Polizei Frankfurt laut t-online, aktualisiert 21.11., 11:22 Uhr). */
export const FRANKFURT = {
	quote: '„Die Bilder vom 31. Oktober haben sich nicht wiederholt“',
	quoteBy: 'Innenminister Poseck, 20.11.',
	police: 'laut Polizei weitgehend friedlich · in der Spitze rund 1.000',
	arrests: 'danach 4 vorläufige Festnahmen bei einer Kontrolle auf der Zeil',
};

export const PRINCIPLE = {
	title: 'DEMO ≠ AUSSCHREITUNG',
	sub: 'Nicht alle, die demonstriert haben, waren beteiligt',
	note: 'Einordnung nach Polizeiangaben · Städte nicht addiert',
};

export const OUTRO = {
	question: 'Wie habt ihr den Freitag erlebt?',
	cta: 'FOLGEN',
	ctaSub: 'FÜR MEHR AUS FRANKFURT',
};

/** Quellenzeile unter den Untertiteln (≤ 112 Zeichen, keine URLs). */
export const SOURCE_LINE = [
	{from: 'hook2', text: 'Polizeimeldungen und Regionalmedien, Stand 21.11.2026'},
	{from: 'h1', text: 'NDR, Stand 21.11.2026, 13:18 Uhr (Polizeiangaben) · NDR-Liveticker 20.11.'},
	{from: 'h2', text: 'NDR, 21.11.2026 (Polizeiangaben, Korrektur am Vormittag) · t-online/dpa'},
	{from: 'l1', text: 'Polizeidirektion Leipzig, Medieninformation 416|26 vom 20.11.2026'},
	{from: 'l2', text: 'Polizeidirektion Leipzig, Ergänzungsmeldung vom 21.11.2026, 12:30 Uhr'},
	{from: 'b1', text: 'Tagesspiegel/dpa, 20.11.2026, 17:38 Uhr (Polizeiangaben)'},
	{from: 's1', text: 'Polizeipräsidium Stuttgart, Pressemitteilung vom 20.11.2026, 22:47 Uhr'},
	{from: 'r1', text: 'Polizei Bremen, Pressemitteilung Nr. 0733 vom 20.11.2026'},
	{from: 'f1', text: 'Innenminister Poseck, 20.11.2026 (ZDF, t-online) · Polizei Frankfurt'},
	{from: 'z1', text: 'Einordnung nach den Polizeimeldungen der Städte · Stand 21.11.2026'},
	{from: 'q1', text: 'Nachbetrachtung · Stand 21.11.2026'},
] as const;
