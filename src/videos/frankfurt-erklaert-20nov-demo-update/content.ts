/**
 * „Gen-Z-Demo am 20.11. geändert!“ (Format B #10, Stand 18.11.2026, 16:38 Uhr – jüngste geprüfte Meldung: t-online nach der Pressekonferenz).
 * Belege: references/frankfurt-20nov-demo-update-2026-11-18/sources.md.
 * Hauptquellen: Stadt Frankfurt (17.11.2026, 14:46 Uhr; Inhalt über t-online 17.11., 13:27 Uhr) und Pressemitteilung des Hessischen
 * Innenministeriums „Appell zur friedlichen Demonstration“ zur Sicherheits-Pressekonferenz (18.11.2026, 14:07 Uhr, aktualisiert 15:28 Uhr).
 * Kategorien im Bild: LAUT STADT · LAUT INNENMINISTERIUM · LAUT POLIZEI · ILLUSTRATION. Keine erfundenen Routen, keine Prognosen.
 */

export const STAND = 'Stand: 18.11.2026, 16:38 Uhr';

/** Titelbild (= erste Szene). Bewusst NICHT „Kein Innenstadtmarsch mehr“: laut Innenministerium gibt es zusätzlich einen Aufzug der „GenZ regelt Bundesbewegung“. */
export const COVER = {
	kicker: 'GEN-Z-DEMO AM 20.11.',
	big: 'GEÄNDERT!',
	sub: 'KUNDGEBUNG STATT DEMOZUG',
	small: 'WESELER WERFT · 14–16:30 UHR',
	question: 'WAS IST JETZT ANDERS?',
};

/** Vorher/Nachher (laut Stadt): Demozug durch die Stadt → ortsfeste Kundgebung (Kooperationsgespräch mit der Anmelderin). */
export const CHANGE = {
	before: {label: 'URSPRÜNGLICH', title: 'DEMOZUG DURCH DIE STADT'},
	after: {label: 'JETZT', title: 'STATIONÄRE KUNDGEBUNG'},
	why: 'in Abstimmung mit der Anmelderin (Kooperationsgespräch mit der Stadt)',
	note: 'keine Route eingezeichnet – die ursprüngliche Strecke ist nicht veröffentlicht',
	source: 'Quelle: Stadt Frankfurt, 17.11.2026 (über t-online) · Innenministerium, 18.11.2026',
};

/** Weseler Werft (Ostend, Nordufer des Mains, zwischen Flößerbrücke und EZB) – OSM/Nominatim, Abruf 18.11.2026. */
export const WERFT = {
	name: 'WESELER WERFT',
	where: 'Ostend · am Main · zwischen Flößerbrücke und EZB',
	time: '14:00–16:30 UHR',
	timeNote: 'endet vor Einbruch der Dunkelheit',
	/** Abweichung: Ordnungsdezernent Schäfer (PM Innenministerium, 18.11.): „um 17 Uhr ein klares Ende“ – offen als Zitat gezeigt. */
	endQuote: 'Ordnungsdezernent: „um 17 Uhr ein klares Ende“',
	count: 4000,
	countLabel: 'ERWARTET',
	/** Stadt (über t-online): „Erwartet werden bis zu 4.000 Menschen.“ · Innenministerium: „4.000 Teilnehmer erwartet“ – ausdrücklich NICHT „angemeldet“ (das steht dort nur bei ver.di/Jugendverband). */
	countNote: 'erwartete Zahl laut Stadt und Polizei – Prognose, keine Zählung',
	at: [50.1080116, 8.6978325] as [number, number],
	source: 'Quelle: Stadt Frankfurt laut t-online, 17.11.2026 („Erwartet werden bis zu 4.000 Menschen“) · Innenministerium, 18.11.2026',
};

/** Auflagen der Stadt für alle angemeldeten Versammlungen (17.11.2026). */
export const RULES = [
	{id: 'pyro', title: 'KEINE PYROTECHNIK', sub: 'auch nichts abbrennen oder verbrennen'},
	{id: 'glass', title: 'KEIN ALKOHOL / GLAS', sub: 'keine alkoholischen Getränke, keine Glasflaschen'},
	{id: 'mask', title: 'KEINE VERMUMMUNG', sub: 'Vermummungsverbot für alle Teilnehmenden'},
	{id: 'pole', title: 'STANGEN MAX. 2 M', sub: 'Transparente nur an Stangen aus weichem Holz oder Kunststoff'},
] as const;
export const RULES_EXTRA = 'KEINE HUNDE';
export const RULES_SOURCE = 'Quelle: Auflagen der Stadt Frankfurt, 17.11.2026 (über t-online)';

export type AssemblyId = 'verdi10' | 'ijv' | 'genz' | 'bund' | 'verdi1730';
/** Fünf Versammlungslagen laut Innenministerium (18.11.2026), chronologisch. `isNew`: kam erst mit der Pressemitteilung vom 18.11. dazu. */
export const ASSEMBLIES = [
	{id: 'verdi10' as AssemblyId, time: '10:00', label: 'SCHUL-\nSTREIK', who: 'ver.di Jugend', detail: 'Aufzug Willy-Brandt-Platz → Bockenheimer Landstraße · 1.200 angemeldet', color: '#4FC3F7', icon: 'book' as const, isNew: false},
	{id: 'ijv' as AssemblyId, time: '11:00', label: 'JUGEND-\nVERBAND', who: 'Internationaler Jugendverband', detail: 'Aufzug Goethe-Uni → Gisèle-Freund-Platz · 75 angemeldet', color: '#B794F6', icon: 'flag' as const, isNew: false},
	{id: 'genz' as AssemblyId, time: '14:00', label: 'GEN Z\nWERFT', who: 'Gen Z regelt Frankfurt', detail: 'Kundgebung Weseler Werft · 4.000 erwartet', color: '#FF3B4E', icon: 'sign' as const, isNew: false},
	{id: 'bund' as AssemblyId, time: '15:00', label: 'BUNDES-\nBEWEGUNG', who: 'GenZ regelt Bundesbewegung', detail: 'Aufzug Kaisersack → Carlo-Schmid-Platz · bis 1.500 erwartet', color: '#FF8A3D', icon: 'march' as const, isNew: true},
	{id: 'verdi1730' as AssemblyId, time: '17:30', label: 'VER.DI-\nJUGEND', who: 'ver.di Jugend', detail: 'Aufzug Carlo-Schmid-Platz → Willy-Brandt-Platz · 500 angemeldet', color: '#FFD23F', icon: 'banner' as const, isNew: false},
] as const;

/** Der neu bekannt gewordene Aufzug (Innenministerium, 18.11.): Start/Ziel laut PM, Ortslage per OSM. Kein Streckenverlauf veröffentlicht. */
export const BUND = {
	title: 'NEU: „GENZ REGELT BUNDESBEWEGUNG“',
	time: '15:00–17:15 UHR',
	kind: 'AUFZUG',
	from: {name: 'KAISERSACK', hint: 'am Hauptbahnhof', at: [50.1075994, 8.6655345] as [number, number]},
	/** PM: Carlo-Schmid-Platz · t-online (18.11., 16:38): „zum Bockenheimer Depot“ – der Platz liegt direkt am Depot (OSM). */
	to: {name: 'CARLO-SCHMID-PLATZ', hint: 'Bockenheim · am Bockenheimer Depot', at: [50.1206019, 8.6510944] as [number, number]},
	count: 'BIS 1.500 ERWARTET',
	note: 'eigene Versammlung – nicht dieselbe wie „Gen Z regelt Frankfurt“ an der Weseler Werft',
	source: 'Quelle: Hessisches Innenministerium, Pressemitteilung 18.11.2026 (14:07 / 15:28 Uhr)',
};

/** Sicherheits-Pressekonferenz 18.11.2026, 14:30 Uhr – Angaben laut Pressemitteilung des Innenministeriums. */
export const PRESS = {
	date: '18.11.2026 · 14:30 UHR',
	title: 'SICHERHEITS-PRESSEKONFERENZ',
	podium: ['INNENMINISTERIUM', 'POLIZEI', 'STADT'],
	forces: {now: 2000, before: 1300, label: 'EINSATZKRÄFTE', nowLabel: 'ÜBER 2.000 · 20.11.', beforeLabel: '1.300 · 31.10.'},
	bans: {count: 49, label: 'AUFENTHALTSVERBOTE', sub: 'für bestimmte Bereiche Frankfurts'},
	reports: {count: 36, label: 'MELDEAUFLAGEN', sub: 'gegen identifizierte Tatverdächtige vom 31.10.'},
	zeil: 'ZEIL: BEI BEDARF ALLE ZUGÄNGE KONTROLLIERT',
	zeilSub: 'auch Nebenstraßen, B-Ebenen und Parkhäuser · Schwerpunkt Opernplatz – Hauptwache – Konstablerwache',
	source: 'Quelle: Hessisches Innenministerium, „Appell zur friedlichen Demonstration“, 18.11.2026',
};

export const FINAL = {stamp: 'NICHT ABGESAGT – ABLAUF GEÄNDERT', question: 'WAS HALTET IHR VON DEN ÄNDERUNGEN?'};
export const CTA = {title: 'FOLGT FÜR MEHR', sub: 'FRANKFURT ERKLÄRT · IN 60 SEKUNDEN'};

/** Quellen (Abruf 18.11.2026; Wortlaute in sources.md). */
export const SOURCES = [
	{id: 'innen', text: 'Hessisches Innenministerium: „Appell zur friedlichen Demonstration“, Pressemitteilung 18.11.2026, 14:07 Uhr (aktualisiert 15:28 Uhr)', url: 'https://innen.hessen.de/presse/appell-zur-friedlichen-demonstration'},
	{id: 'stadt', text: 'Stadt Frankfurt am Main: „Mehrere Versammlungen sind für den 20. November angemeldet“, 17.11.2026, 14:46 Uhr', url: 'https://frankfurt.de/de-de/aktuelle-meldung/meldungen/mehrere-versammlungen-angemeldet/'},
	{id: 'ton', text: 't-online Frankfurt: „Frankfurt: Neue Gen-Z-Demos schüren Angst vor weiteren Ausschreitungen“, 17.11.2026, 13:27 Uhr (Quelle u. a. Stadt Frankfurt per E-Mail)', url: 'https://frankfurt.t-online.de/region/frankfurt-am-main/id_101532898/frankfurt-neue-gen-z-demos-schueren-angst-vor-weiteren-ausschreitungen.html'},
	{id: 'ton2', text: 't-online Frankfurt: „Polizei rüstet auf: Frankfurt will neue Krawalle bei Gen-Z-Demos verhindern“, 18.11.2026, 16:38 Uhr (nach der Pressekonferenz)', url: 'https://frankfurt.t-online.de/region/frankfurt-am-main/id_101535276/gen-z-demos-frankfurt-polizei-faehrt-mit-2000-kraeften-auf.html'},
	{id: 'sz', text: 'Süddeutsche Zeitung/dpa: Ankündigung der Pressekonferenz am 18.11.2026, 14:30 Uhr', url: 'https://www.sueddeutsche.de/politik/bundesweite-gen-z-proteste-nach-krawallen-polizei-informiert-vor-dem-neuen-protesttag-dpa.urn-newsml-dpa-com-20090101-261118-930-11205'},
	{id: 'osthessen', text: 'Osthessen|News: „Frankfurt vor brisantem Demo-Freitag: Über 2.000 Polizisten im Einsatz“, 18.11.2026 (Übernahme der Pressemitteilung)', url: 'https://osthessen-news.de/n11803458/gen-z-auf-der-strasse-polizei-in-alarmbereitschaft-drohen-neue-krawalle.html'},
	{id: 'werft', text: 'Stadt Frankfurt: Weseler Werft (Ortsbeschreibung)', url: 'https://frankfurt.de/themen/umwelt-und-gruen/orte/parks/parks-von-a-bis-z/weseler-werft'},
	{id: 'osm', text: 'OpenStreetMap/Nominatim: Weseler Werft (50.10801, 8.69783), Flößerbrücke (50.10769, 8.69483), EZB (50.10963, 8.70292), Kaisersack (50.10760, 8.66553), Carlo-Schmid-Platz (50.12060, 8.65109), Abruf 18.11.2026', url: 'https://www.openstreetmap.org/search?query=Weseler%20Werft%20Frankfurt'},
	{id: 'wiki', text: 'Wikipedia: Flößerbrücke (Spannbetonbrücke mit zwei ≈ 21 m hohen Pylonen am Nordufer, olivgrün)', url: 'https://de.wikipedia.org/wiki/Fl%C3%B6%C3%9Ferbr%C3%BCcke'},
];
