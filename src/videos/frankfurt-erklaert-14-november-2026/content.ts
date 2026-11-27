/**
 * Sondervideo „14.11. – doch eine Gen-Z-Demo in Frankfurt?“ (Format B, 14.11.2026).
 * Belege: references/frankfurt-erklaert-14-november-2026/sources.md (Abruf 14.11.2026).
 * Kategorien im Bild: OFFIZIELL (Polizei) · BERICHT (Medien) · ANGEKÜNDIGT · OFFEN · ILLUSTRATION.
 */
import type {LatLon} from '../../components/map/CityStreetMap';

/** Stand der Recherche (vor der Vertonung erneut geprüft). */
export const STAND = 'Stand: 14.11.2026, 17:15 Uhr';

/** Titelbild (= erste Szene). */
export const COVER = {
	date: '14.11.2026',
	day: '14',
	month: 'NOVEMBER 2026',
	weekday: 'SAMSTAG',
	card: 'DOCH EINE GEN-Z-DEMO?',
	sub: 'Was ist heute wirklich angekündigt?',
	chips: ['HAUPTWACHE', 'BOCKENHEIMER WARTE', 'GOETHEPLATZ', '20.11.'],
};

/** Szene 2 – erst genannt, dann entfernt, dann doch Aktionstag. */
export const WEBSITE = {
	label: 'WEBSITE DER INITIATIVE',
	note: 'stilisiert · keine Bildschirmaufnahme',
	named: {title: '14.11. – KURZ GENANNT', when: 'Sonntag, 01.11. (laut tagesschau)'},
	removed: {title: '14.11. – DATUM ENTFERNT', when: 'danach nur noch: „bald“'},
	next: {title: '20.11. – WEITERER PROTESTTAG', when: 'Internationaler Jugendstreiktag'},
	back: {title: '14.11. – DOCH AKTIONSTAG', motto: '„PHASE 2“', when: 'Aufruf u. a. in Berlin, Düsseldorf, Aachen'},
	cities: ['BERLIN', 'DÜSSELDORF', 'AACHEN', 'FRANKFURT'],
	source: 'tagesschau.de 01.11. · taz 12.11. · dpa 14.11. · t-online 12.11. · Polizei Frankfurt 13.11.',
};

/** Szene 3 – Kundgebung an der Hauptwache (Polizeimeldung 13.11., 14:32 Uhr). */
export const HAUPTWACHE = {
	date: '14. NOVEMBER',
	place: 'HAUPTWACHE',
	time: '12:30–15:00 UHR',
	kind: 'GEN-Z-BEZOGENE KUNDGEBUNG',
	attribution: 'laut Polizei „Gen Z regelt“ zuzurechnen',
	note: 'Ankündigung der Polizei vom 13.11.',
	open: 'VERLAUF: NOCH KEINE POLIZEIBILANZ',
	source: 'Polizeipräsidium Frankfurt, PM 13.11.2026, 14:32 Uhr · Gebäude: Illustration',
};

/** Szene 4 – drei getrennte Versammlungen (nur öffentlich angekündigte Orte, keine Routen). */
export const VENUES = [
	{id: 'hauptwache', name: 'HAUPTWACHE', time: '12:30–15:00', kind: 'GEN-Z-BEZOGENE KUNDGEBUNG', note: '„Gen Z regelt“', at: [50.11347, 8.67875] as LatLon, color: '#FF4D5E'},
	{id: 'bockenheimer-warte', name: 'BOCKENHEIMER WARTE', time: '17–19', kind: 'WEITERE KUNDGEBUNG', note: 'Veranstalter nicht genannt', at: [50.12011, 8.65089] as LatLon, color: '#C9CEDF'},
	{id: 'goetheplatz', name: 'GOETHEPLATZ', time: '16–19', kind: 'AUFZUG ZUM IRANKONFLIKT', note: '≈ 1.000 erwartet', at: [50.11302, 8.6762] as LatLon, color: '#4FC3F7'},
] as const;
export const MAP_NOTE = 'Orte laut Polizei · getrennte Versammlungen · keine Routen';
export const MAP_SOURCE = 'Polizeipräsidium Frankfurt, PM 13.11.2026 · Karte: © OpenStreetMap-Mitwirkende';

/** Szene 5 – Einsatzkonzept laut Polizei (PM 13.11.). */
export const POLICE = {
	items: [
		{icon: 'shield', title: 'MEHR EINSATZKRÄFTE', text: 'als am 31.10. · Verstärkung aus weiteren hessischen Präsidien', status: 'ANGEKÜNDIGT'},
		{icon: 'pin', title: 'ZEIL IM FOKUS', text: 'Achse Opernplatz – Hauptwache – Konstablerwache', status: 'ANGEKÜNDIGT'},
		{icon: 'gate', title: 'ZUGANGSKONTROLLEN', text: 'möglich – nur im Bedarfsfall · Absperrgitter bereitgehalten', status: 'VORBEREITET'},
	] as const,
	key: ['KEINE KONKRETEN HINWEISE', 'AUF GEPLANTE AUSSCHREITUNGEN'] as const,
	keyNote: 'laut Polizei, Stand der Mitteilung 13.11.',
	source: 'Polizeipräsidium Frankfurt, PM 13.11.2026 · Fahrzeuge: Illustration',
};

/** Szene 6 – 20. November (laut GEW Hessen, PM 12.11.). */
export const NEXT = {
	title: '20.11. – WEITERE JUGENDPROTESTE ANGEKÜNDIGT',
	sub: 'Internationaler Jugendstreiktag',
	items: [
		{time: '10 UHR', text: 'Schulstreik', place: 'Willy-Brandt-Platz'},
		{time: '14 UHR', text: 'Gen-Z-Demo', place: 'Ort noch nicht bekannt'},
		{time: '17:30', text: 'Gewerkschaftsjugend', place: 'Bockenheimer Depot'},
	],
	source: 'GEW Hessen, PM 12.11.2026 · tagesschau.de 01.11.',
};

export const QUESTION = 'WIE HABT IHR DEN TAG ERLEBT?';
export const CTA = {title: 'FOLGT FÜR MEHR', sub: 'DIE NÄCHSTEN ENTWICKLUNGEN'};

export const SOURCES = [
	{id: 'pp', text: 'Polizeipräsidium Frankfurt am Main: „POL-F: 261113 - 1421 Frankfurt - Stadtgebiet: Mehrere Versammlungslagen in der Innenstadt“, 13.11.2026, 14:32 Uhr', url: 'https://www.presseportal.de/blaulicht/pm/4970/6390267'},
	{id: 'ts', text: 'tagesschau.de: „„Gen Z regelt“ will Demos fortsetzen“, 01.11.2026', url: 'https://www.tagesschau.de/inland/gesellschaft/gen-z-demos-bilanz-100.html'},
	{id: 'ts-faq', text: 'tagesschau.de: „FAQ: Wie lief der „Gen Z“-Protest …“, 01.11.2026', url: 'https://www.tagesschau.de/inland/gesellschaft/demonstration-protest-genz-100.html'},
	{id: 'taz', text: 'taz: „Gen-Z-Proteste in Berlin: „Wir als Jugend sind sauer und wütend auf diese Politik““, 12.11.2026', url: 'https://taz.de/Gen-Z-Proteste-in-Berlin/!6227408/'},
	{id: 'dpa', text: 'Berliner Abendblatt (dpa/bb): „«Gen Z regelt» ruft erneut zu Demonstration in Berlin auf“, 14.11.2026', url: 'https://berliner-abendblatt.de/berlin-news/gen-z-regelt-ruft-erneut-zu-demonstration-in-berlin-auf-id354883'},
	{id: 'ton', text: 't-online Düsseldorf: „„Gen Z regelt“: Demo Samstag in Düsseldorf – Polizei warnt“, 12.11.2026', url: 'https://duesseldorf.t-online.de/region/duesseldorf/id_101526006/-gen-z-regelt-demo-samstag-in-duesseldorf-polizei-warnt.html'},
	{id: 'fnp', text: 'Frankfurter Neue Presse: „Nach Gen-Z-Krawallen: Polizei sperrt alle Zugänge zur Zeil ab“, 14.11.2026, 09:36 Uhr', url: 'https://www.fnp.de/frankfurt/nach-gen-krawallen-polizei-sperrt-alle-zugaenge-zur-zeil-ab-94589844.html'},
	{id: 'gew', text: 'GEW Hessen: „Politik muss Forderungen der Jugend ernst nehmen statt Situation anzuheizen“, PM 12.11.2026', url: 'https://www.gew-hessen.de/details/politik-muss-forderungen-der-jugend-ernst-nehmen-statt-situation-anzuheizen'},
];
