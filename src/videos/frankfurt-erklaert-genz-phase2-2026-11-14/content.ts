/**
 * „Gen Z regelt – Phase 2: friedliche Demos, aber 20 Festnahmen in Berlin“ (Format B #07, Proteste vom 14.11.2026).
 * Belege: references/frankfurt-erklaert-genz-phase2-2026-11-14/sources.md (Abruf 15.11.2026).
 * Kategorien im Bild: OFFIZIELL (Polizei/Behörde) · BERICHT (Medien) · ANGEKÜNDIGT · OFFEN · ILLUSTRATION.
 * Zahlen immer mit Urheber; Bilanz Berlin = Stand Sonntag 15.11. (frühere Samstagsangaben nur als „zuerst genannt“).
 */
import type {LatLon} from '../../components/map/CityStreetMap';

/** Neuester überprüfbarer Meldestand (rbb24, aktualisiert 15.11.2026, 12:58 Uhr; SZ/dpa 11:09 Uhr). */
export const STAND = 'Stand: 15.11.2026, 13 Uhr';

/** Titelbild (= erste Szene). Nicht „Proteste in 4 Städten“: laut WDR auch Demos in Düsseldorf und Wuppertal. */
export const COVER = {
	kicker: 'GEN Z REGELT – PHASE 2',
	big: '20',
	bigLines: ['VORLÄUFIGE', 'FESTNAHMEN', 'IN BERLIN'] as const,
	sub: 'Bremen, Karlsruhe, Stuttgart: weitgehend friedlich',
	date: '14. NOVEMBER 2026',
	chips: ['BREMEN', 'KARLSRUHE', 'STUTTGART', 'BERLIN'],
	chipsNote: '4 STÄDTE IM ÜBERBLICK',
};

export type CityId = 'bremen' | 'karlsruhe' | 'stuttgart' | 'berlin' | 'frankfurt' | 'duesseldorf' | 'wuppertal';

/** Kartenorte (Stadtmitte, WGS84 [lon, lat] für die Deutschlandkarte). */
export const CITY_POS: Record<CityId, [number, number]> = {
	bremen: [8.8017, 53.0793],
	karlsruhe: [8.4037, 49.0069],
	stuttgart: [9.1829, 48.7758],
	berlin: [13.405, 52.52],
	frankfurt: [8.6821, 50.1109],
	duesseldorf: [6.7735, 51.2277],
	wuppertal: [7.1508, 51.2562],
};

/** Szene 2 – drei Städte (laut Polizei bzw. Ordnungsamt, über dpa/SWR). */
export const CITIES = [
	{
		id: 'bremen' as const,
		name: 'BREMEN',
		glyph: 'rathaus' as const,
		count: 670,
		prefix: 'BIS ZU',
		countNote: 'in der Spitze · laut Polizei',
		verdict: 'FRIEDLICH',
		verdictNote: '„Alles sei friedlich verlaufen“ (Polizei)',
		color: '#3DDC97',
		source: 't-online/dpa, 14.11., 21:26 Uhr',
	},
	{
		id: 'karlsruhe' as const,
		name: 'KARLSRUHE',
		glyph: 'pyramide' as const,
		count: 220,
		prefix: 'RUND',
		countNote: 'Schätzung der Polizei',
		verdict: 'WEITGEHEND FRIEDLICH',
		verdictNote: 'Ordnungsamt: „insgesamt friedlicher Verlauf“',
		color: '#3DDC97',
		source: 'SWR, 14.11., 21:15 Uhr',
	},
	{
		id: 'stuttgart' as const,
		name: 'STUTTGART',
		glyph: 'saeule' as const,
		count: null,
		prefix: '',
		countText: 'MEHRERE HUNDERT',
		countNote: 'laut Polizei · Schlossplatz',
		verdict: 'AUFZUG UNTERSAGT',
		verdictNote: 'stationäre Kundgebung · Stadt: Anmeldung zu spät – Organisatoren bestreiten das',
		color: '#FFD23F',
		source: 'SWR, 14.11., 21:15 Uhr',
	},
] as const;

/** Weitere Orte vom 14.11. (nicht im Ton, nur Kartenhinweis – Vollständigkeit statt „nur 4 Städte“). */
export const OTHER_CITIES = {
	text: 'AUCH: DÜSSELDORF RUND 100 · WUPPERTAL RUND 80',
	source: 'WDR/dpa, 14.11.',
};

export const CITIES_SOURCE = 'Polizei laut t-online/dpa (Bremen) · SWR (Karlsruhe, Stuttgart) · WDR/dpa · Karte: Natural Earth';

/** Szene 3 – Berlin: Teilnehmende, Einsatz, Strecke. */
export const BERLIN = {
	registered: 100,
	came: 1200,
	cameLabel: 'RUND 1.200',
	cameNote: 'laut Polizei',
	registeredNote: 'laut Polizei angemeldet',
	officers: 700,
	officersLabel: '700 EINSATZKRÄFTE',
	start: {name: 'SAVIGNYPLATZ', note: 'START gegen 17 Uhr', at: [52.505715, 13.322719] as LatLon},
	end: {name: 'S HALENSEE', note: 'ENDE · Auflösung am frühen Abend', at: [52.4960247, 13.2905555] as LatLon},
	street: {name: 'KURFÜRSTENDAMM', osm: 'Kurfürstendamm'},
	routeNote: 'Strecke laut rbb24 · Verbindung Savignyplatz–Ku’damm schematisch',
	source: 'Polizei Berlin laut dpa/rbb24, 15.11. · Karte: © OpenStreetMap-Mitwirkende',
};

/**
 * Ku'damm-Mittellinie aus OpenStreetMap (Knesebeckstraße → Halensee, in Zugrichtung von Ost nach West).
 * Der genaue Weg vom Savignyplatz zum Ku'damm ist nicht belegt → gestrichelt (`BERLIN_CONNECTOR`).
 */
export const KUDAMM: LatLon[] = (
	[
		[52.497478, 13.292787], [52.497512, 13.293739], [52.497667, 13.294266], [52.497836, 13.295237], [52.497941, 13.296157], [52.49813, 13.296982],
		[52.498285, 13.297668], [52.498469, 13.298453], [52.498574, 13.299282], [52.498714, 13.30017], [52.498855, 13.301015], [52.499043, 13.301943],
		[52.499216, 13.302764], [52.499371, 13.303771], [52.499516, 13.304522], [52.499701, 13.305554], [52.499786, 13.305918], [52.499988, 13.30704],
		[52.500153, 13.308266], [52.500177, 13.308785], [52.500284, 13.309447], [52.500337, 13.310764], [52.500502, 13.311226], [52.500506, 13.312261],
		[52.500634, 13.313105], [52.500731, 13.314003], [52.500912, 13.315033], [52.501044, 13.315831], [52.501168, 13.31675], [52.501361, 13.317397],
		[52.50141, 13.318694], [52.501566, 13.31919], [52.501678, 13.319936], [52.501804, 13.320839], [52.501962, 13.321833], [52.502116, 13.322774],
	] as LatLon[]
)
	.slice()
	.reverse();

/** Letztes Stück Ku'damm → S Halensee (Bahnhof liegt westlich des Ku'damm-Endes). */
export const ROUTE: LatLon[] = [...KUDAMM, BERLIN.end.at];
export const BERLIN_CONNECTOR: [LatLon, LatLon] = [BERLIN.start.at, KUDAMM[0]];

/** Szene 4 – Zwischenfälle laut Polizei (über dpa), stilisiert. */
export const INCIDENTS = {
	items: [
		{icon: 'line', title: 'VERSUCH, DIE POLIZEIKETTE ZU DURCHBRECHEN', note: 'vor dem Start des Aufzugs · laut Polizei einige Teilnehmende'},
		{icon: 'flare', title: 'PYROTECHNIK', note: 'laut Polizei gezündet'},
		{icon: 'alert', title: 'AUSEINANDERSETZUNGEN BEI FESTNAHMEN', note: 'laut Polizei Widerstand und Angriffe auf Einsatzkräfte'},
	] as const,
	label: 'ILLUSTRATION · keine Originalaufnahme · Ablauf laut Polizei',
	source: 'Polizei Berlin laut dpa (SZ, 15.11., 11:09 Uhr) · rbb24',
};

/** Szene 5 – Bilanz der Polizei Berlin (Stand Sonntag, 15.11.). */
export const STATS = [
	{value: 20, label: 'VORLÄUFIGE FESTNAHMEN', color: '#FF4D5E', note: 'Samstagabend zuerst: 22'},
	{value: 28, label: 'STRAFANZEIGEN', color: '#FFD23F', note: ''},
	{value: 3, label: 'VERLETZTE POLIZISTEN', color: '#4FC3F7', note: 'zu verletzten Teilnehmenden: keine Angabe'},
] as const;
export const CHARGES = ['LANDFRIEDENSBRUCH', 'TÄTLICHER ANGRIFF', 'WIDERSTAND', 'SPRENGSTOFFRECHT'];
export const CONTEXT = {
	left: 'FESTNAHME',
	right: 'VERURTEILUNG',
	line2: 'EINZELNE VORFÄLLE – NICHT ALLE DEMONSTRIERENDEN',
	caveat: 'Polizei: Angaben vorläufig, Auswertung läuft',
};
export const STATS_SOURCE = 'dpa / Polizei Berlin, Stand 15.11.2026';

/** Szene 6 – 20. November (Frankfurt laut GEW Hessen; Berlin laut Veranstaltern über dpa). */
export const NEXT = {
	title: 'WEITERE JUGENDPROTESTE ANGEKÜNDIGT',
	sub: 'europaweiter Jugendstreik · auch in Frankfurt',
	items: [
		{time: '10 UHR', text: 'Schulstreik', place: 'Willy-Brandt-Platz'},
		{time: '14 UHR', text: 'Gen-Z-Demo', place: 'Ort noch offen'},
		{time: '17:30', text: 'Gewerkschaftsjugend', place: 'Bockenheimer Depot'},
	],
	berlin: 'Berlin: 15.000 angemeldet (laut Veranstaltern, dpa)',
	source: 'GEW Hessen, PM 12.11.2026 · dpa 15.11.',
};

export const QUESTION = 'WIE BEWERTET IHR BERLIN?';
export const CTA = {title: 'FOLGT FÜR MEHR', sub: 'FRANKFURT ERKLÄRT · IN 60 SEKUNDEN'};

/** Quellen (Abruf 15.11.2026; Wortlaute in references/frankfurt-erklaert-genz-phase2-2026-11-14/sources.md). */
export const SOURCES = [
	{id: 'sz', text: 'Süddeutsche Zeitung (dpa): „1.200 Menschen bei Gen-Z-Demo in Berlin - 28 Strafanzeigen“, 15.11.2026, 11:09 Uhr', url: 'https://www.sueddeutsche.de/politik/demonstrationen-1-200-menschen-bei-gen-z-demo-in-berlin-28-strafanzeigen-dpa.urn-newsml-dpa-com-20090101-261115-930-997959'},
	{id: 'rbb', text: 'rbb24: „„Gen Z regelt“: 20 Festnahmen und 28 Strafanzeigen nach Protest auf dem Ku\'damm“, aktualisiert 15.11.2026, 12:58 Uhr', url: 'https://www.rbb24.de/panorama/beitrag/2026/11/berlin-charlottenburg-gen-z-regelt-demo-jugend-protest-polizei.html'},
	{id: 'ton-berlin', text: 't-online Berlin: „Berlin: 1.200 Menschen bei „GenZ regelt“-Demo in Charlottenburg“, aktualisiert 15.11.2026, 06:39 Uhr', url: 'https://berlin.t-online.de/region/berlin/id_101529126/berlin-1200-menschen-bei-genz-regelt-demo-in-charlottenburg-.html'},
	{id: 'bk', text: 'Berliner Kurier: „Nur 100 angemeldet, 1200 kamen: Gen-Z-Demo in Berlin eskaliert“, 15.11.2026', url: 'https://www.berliner-kurier.de/article/nur-100-angemeldet-1200-kamen-gen-z-demo-in-berlin-eskaliert-10599280'},
	{id: 'welt', text: 'WELT: „20 Festnahmen in Berlin: „Generationenvertrag ist gebrochen“ – Grünen-Chef verteidigt Gen-Z-Demonstrationen“, 15.11.2026', url: 'https://www.welt.de/politik/deutschland/article6af9914a9849eea0701e37f1/20-festnahmen-in-berlin-generationenvertrag-ist-gebrochen-gruenen-chef-verteidigt-gen-z-demonstrationen.html'},
	{id: 'ton-bremen', text: 't-online Bremen (dpa): „Bremen: Hunderte junge Menschen bei Gen-Z-Protest“, 14.11.2026, 21:26 Uhr', url: 'https://bremen.t-online.de/region/bremen/id_101529330/bremen-hunderte-junge-menschen-bei-gen-z-protest.html'},
	{id: 'swr', text: 'SWR Aktuell: „„Gen Z regelt“-Demos in BW weitgehend friedlich geblieben“, 14.11.2026, 21:15 Uhr', url: 'https://www.swr.de/swraktuell/baden-wuerttemberg/gen-z-demos-stuttgart-karlsruhe-100.html'},
	{id: 'wdr', text: 'WDR: „„Gen Z regelt“- Demos in Düsseldorf und Wuppertal“, 14.11.2026', url: 'https://www1.wdr.de/nrw/duesseldorf/genz-demo-duesseldorf-wuppertal-100.html'},
	{id: 'gew', text: 'GEW Hessen: „Politik muss Forderungen der Jugend ernst nehmen statt Situation anzuheizen“, PM 12.11.2026', url: 'https://www.gew-hessen.de/details/politik-muss-forderungen-der-jugend-ernst-nehmen-statt-situation-anzuheizen'},
];
