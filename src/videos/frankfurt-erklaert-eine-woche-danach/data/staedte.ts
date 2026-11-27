/**
 * Zentrale Datenbasis der Sonderausgabe „Eine Woche danach“ (#20, Recherchestand 27.11.2026): EINE Quelle für die Stadtszenen UND das
 * bundesweite Dashboard – so können Szene und Übersicht nie unterschiedliche Zahlen zeigen (Test `tests/erklaert-eine-woche-danach.test.ts`).
 *
 * Regeln (siehe references/frankfurt-erklaert-eine-woche-danach/sources.md):
 * - jede Kennzahl mit eigener Kategorie (`main.label`) und eigenem Meldestand (`stand`) – Kategorien sind NICHT vergleichbar,
 *   es gibt keine Summe und keine Rangliste;
 * - Teilgruppen (Leipzig: Kinder/Jugendliche) stehen als „darunter …“ und werden nie addiert;
 * - fehlt eine Zahl (Hamburg), steht ein Text statt einer geschätzten Zahl (`main.value` ohne Ziffer, `count` fehlt).
 */
export type CityId = 'leipzig' | 'hamburg' | 'dresden' | 'stuttgart' | 'berlin' | 'frankfurt';

export type CitySource = {name: string; url: string; date: string};

export type CityStat = {
	id: CityId;
	name: string;
	/** WGS84 (Projektion über Natural Earth / d3-geo in `GermanyPlane`). */
	lat: number;
	lon: number;
	/** Hauptkennzahl: `value` wie im Bild (z. B. „ÜBER 200“), `count` nur für den Zähler (Zahl ohne Zusatz), `label` = Kategorie. */
	main: {value: string; count?: number; prefix?: string; label: string};
	/** Bis zu drei Zusatzangaben (kurz, im Dashboard ≥ 22 px). */
	extras: string[];
	/** Redaktionelle Einordnung (eine Zeile). */
	note: string;
	/** Meldestand der verwendeten Angaben (≠ Recherchedatum 27.11.). */
	stand: string;
	/** Kurzform für Karten: Meldestand ohne Jahr + Urheber. */
	standShort: string;
	sourceShort: string;
	sources: CitySource[];
	/** Aktualitätsprüfung 22.–27.11.2026. */
	update: string;
	/** Farbakzent der Stadt-Karte (kein Wertungsfarbcode – alle Karten gleich groß und gleich gewichtet). */
	color: string;
};

export const RECHERCHE = {date: '27.11.2026', time: '15:15', label: 'RECHERCHESTAND 27.11.2026'} as const;
export const EVENT = {date: '20.11.2026', label: '20. NOVEMBER 2026'} as const;

export const CITIES: CityStat[] = [
	{
		id: 'leipzig',
		name: 'LEIPZIG',
		lat: 51.3397,
		lon: 12.3731,
		main: {value: 'ÜBER 200', count: 200, prefix: 'ÜBER ', label: 'Personen – Identität festgestellt'},
		extras: ['darunter 4 Kinder', 'und über 40 Jugendliche', 'Anfangsverdacht § 125a StGB'],
		note: 'Staatsanwaltschaft: schwerer Fall des Landfriedensbruchs',
		stand: '21.11.2026',
		standShort: '21.11.',
		sourceShort: 'Polizei Sachsen',
		sources: [
			{name: 'Polizei Sachsen (PD Leipzig), Ergänzungsmeldung Nr. 417/26', url: 'https://www.medienservice.sachsen.de/medien/news/1101307', date: '21.11.2026, 12:26 Uhr'},
			{name: 'PD Leipzig, Medieninformation Nr. 416/26', url: 'https://medienservice.sachsen.de/medien/news/1101306', date: '20.11.2026, 23:40 Uhr'},
		],
		update: 'keine neuere Meldung bis 27.11.',
		color: '#FFD23F',
	},
	{
		id: 'hamburg',
		name: 'HAMBURG',
		lat: 53.5511,
		lon: 9.9937,
		main: {value: 'MEHRERE', label: 'Festnahmen und Gewahrsamnahmen'},
		extras: ['Gesamtzahl öffentlich nicht bekannt', 'Anfragen vom 23.11. – ohne Antwort', 'Korrektur: Pyrotechnik statt Flaschen'],
		note: 'Bürgerschaft (Drs. 23/6066) und Bezirksversammlung Mitte (Drs. 23-2220)',
		stand: '21.–23.11.2026',
		standShort: '21.–23.11.',
		sourceShort: 'NDR · BPol · Anfragen',
		sources: [
			{name: 'NDR, Polizeiangaben', url: 'https://www.ndr.de/nachrichten/hamburg/gen-z-regelt-nach-friedlichen-demos-in-hamburg-vereinzelt-ausschreitungen,genz-288.html', date: '21.11.2026, 13:18 Uhr'},
			{name: 'Bundespolizeiinspektion Hamburg, Korrektur', url: 'https://www.presseportal.de/blaulicht/pm/70254/6395189', date: '21.11.2026, 11:07 Uhr'},
			{name: 'Hamburgische Bürgerschaft, Drs. 23/6066 (Kleine Anfrage)', url: 'https://hamburg.parlamente.org/drucksache/23/6066', date: '23.11.2026'},
			{name: 'Bezirksversammlung Hamburg-Mitte, Drs. 23-2220 (Anfrage)', url: 'https://bv-hh.de/hamburg-mitte/documents/ausschreitungen-in-st-pauli-nach-der-gen-z-regelt-demonstration-am-20-11-2026-schaeden-im-oeffentlichen-raum-einsatzlage-und-folgen-fuer-den-stadtteil-anfrage-der-afd-fraktion-240533', date: '23.11.2026'},
		],
		update: 'neu: zwei Anfragen (23.11.), Antworten nicht veröffentlicht',
		color: '#4FC3F7',
	},
	{
		id: 'dresden',
		name: 'DRESDEN',
		lat: 51.0504,
		lon: 13.7373,
		main: {value: 'RUND 80', count: 80, prefix: 'RUND ', label: 'Personen – Personalien aufgenommen'},
		extras: ['Verdacht u. a. Landfriedensbruch', 'Barrikade + Flaschenwurf (Verdacht)', 'mind. 3 Polizisten leicht verletzt'],
		note: 'keine Festnahmezahl – Personalien aufgenommen',
		stand: '20.11.2026',
		standShort: '20.11.',
		sourceShort: 'Polizei Dresden',
		sources: [{name: 'Polizeidirektion Dresden, Medieninformation Nr. 581/26', url: 'https://www.medienservice.sachsen.de/medien/news/1101305', date: '20.11.2026, Stand 20:30 Uhr'}],
		update: 'keine neuere Meldung bis 27.11.',
		color: '#B794F6',
	},
	{
		id: 'stuttgart',
		name: 'STUTTGART',
		lat: 48.7758,
		lon: 9.1829,
		main: {value: 'ÜBER 20', count: 20, prefix: 'ÜBER ', label: 'vorläufige Festnahmen'},
		extras: ['Vorwürfe u. a.: Vermummung', 'Beleidigung · Widerstand', 'nicht jede Person jeder Vorwurf'],
		note: 'versammlungstypische Straftaten laut Polizei',
		stand: '20.11.2026',
		standShort: '20.11.',
		sourceShort: 'Polizei Stuttgart',
		sources: [{name: 'Polizeipräsidium Stuttgart', url: 'https://www.presseportal.de/blaulicht/pm/110977/6395101', date: '20.11.2026, 22:47 Uhr'}],
		update: 'keine Nachtragsmeldung bis 27.11.',
		color: '#FF9F43',
	},
	{
		id: 'berlin',
		name: 'BERLIN',
		lat: 52.52,
		lon: 13.405,
		main: {value: 'RUND 4.000', count: 4000, prefix: 'RUND ', label: 'Teilnehmende laut Polizei'},
		extras: ['friedlicher Verlauf', 'ohne besondere Vorkommnisse', 'keine Ermittlungszahlen genannt'],
		note: 'eine Meldung nennt rund 4.500 (laut Polizei)',
		stand: '20./21.11.2026',
		standShort: '20./21.11.',
		sourceShort: 'Polizei (dpa)',
		sources: [
			{name: 'tagesschau (Polizeiangaben)', url: 'https://www.tagesschau.de/inland/gesellschaft/jugendproteste-krawalle-gen-z-100.html', date: '21.11.2026, 03:38 Uhr'},
			{name: 'Tagesspiegel (dpa)', url: 'https://www.tagesspiegel.de/berlin/tausende-bei-gen-z-protesten-in-berlin-es-wird-so-viel-geld-in-aufrustung-gesteckt-und-die-universitaten-fallen-auseinander-16305132.html', date: '20.11.2026, 17:38 Uhr'},
		],
		update: 'keine Polizeimeldung zum Zug bis 27.11.',
		color: '#3DDC97',
	},
	{
		id: 'frankfurt',
		name: 'FRANKFURT',
		lat: 50.1109,
		lon: 8.6821,
		main: {value: '10', count: 10, label: 'Festnahmen (gesamter Einsatz)'},
		extras: ['16 Strafanzeigen', '342 Personenkontrollen', '52 Platzverweise · rund 2.900 Kräfte'],
		note: 'gesamter Polizeieinsatz (mehrere Versammlungen)',
		stand: '21.11.2026',
		standShort: '21.11.',
		sourceShort: 'Innenministerium',
		sources: [{name: 'Hessisches Innenministerium', url: 'https://innen.hessen.de/presse/polizei-zieht-bilanz-der-versammlungen-am-20-november', date: '21.11.2026'}],
		update: 'keine neuere Meldung bis 27.11.',
		color: '#FF5A6E',
	},
];

export const cityById = (id: CityId): CityStat => {
	const c = CITIES.find((x) => x.id === id);
	if (!c) throw new Error(`Stadt fehlt: ${id}`);
	return c;
};
