/**
 * Inhalte des Testvideos „Wie die Ereignisse vom 31. Oktober 2026 in Frankfurt
 * internationale Schlagzeilen machten“.
 *
 * REGEL: Jede Zahl, jedes Zitat und jede Schlagzeile hier ist belegt – siehe
 * references/frankfurt-2026-10-31/sources.md (Abrufdatum 03.11.2026).
 * Nichts erfinden, nichts zuspitzen. Zahlen immer mit Urheber (Polizei, Ministerium, Veranstalter).
 */
import type {FlagCode} from '../../components/media/flags/Flag';
import {PLACES, COUNTRY_IDS, type GeoPoint} from '../../components/map/places';

export const SOURCES = {
	hrDemo: {
		outlet: 'hessenschau.de',
		title: 'Polizei löst Gen-Z-Protest in Frankfurt auf – tausende Teilnehmende',
		date: '31.10.2026',
		url: 'https://www.hessenschau.de/panorama/polizei-loest-gen-z-protest-in-frankfurt-auf---tausende-teilnehmende-v16,frankfurt-gen-z-demo-100.html',
	},
	hrBilanz: {
		outlet: 'hessenschau.de',
		title: 'Bilanz der Ausschreitungen in Frankfurt: Festnahmen und verletzte Polizisten',
		date: '01.11.2026',
		url: 'https://www.hessenschau.de/gesellschaft/krawalle-in-frankfurt-mehr-als-30-festnahmen-und-erhebliche-schaeden-v1,bilanz-frankfurt-100.html',
	},
	reuters: {
		outlet: 'Reuters',
		title: 'Rioters loot stores in Frankfurt as Gen Z-led protests in Germany turn violent',
		date: '31.10.2026',
		url: 'https://www.yahoo.com/news/articles/gen-z-protests-reach-germany-000319778.html',
	},
} as const;

export const TITLE = {
	kicker: '31.10.2026 · FRANKFURT',
	headline: 'Wie Frankfurt weltweit Schlagzeilen machte',
	highlight: ['weltweit', 'Schlagzeilen'],
};

/** Teilnehmerzahlen laut hessenschau.de (31.10.2026). */
export const TURNOUT = {
	title: 'Teilnehmende in Frankfurt',
	items: [
		{label: 'Polizei', note: 'Schätzung am Nachmittag', value: 8000},
		{label: 'Veranstalter', note: 'Angabe auf Instagram', value: 10000},
	],
	source: `${SOURCES.hrDemo.outlet}, ${SOURCES.hrDemo.date}`,
};

/** Forderungen laut Reuters (Sprecherin von „Gen Z regelt“) – ohne erfundene Parolen. */
export const DEMANDS = {
	organizer: '„Gen Z regelt“',
	items: ['Bessere Bildung', 'Niedrigere Lebenshaltungskosten', 'Gegen Wehrpflicht'],
	source: 'Reuters, 31.10.2026',
};

/** Bilanz laut Polizei / hessischem Innenministerium (hessenschau.de, 01.11.2026). */
export const TOLL = {
	place: 'Polizei & Innenministerium',
	when: 'Angaben vom 01.11.2026',
	stats: [
		{value: 54, label: 'Festnahmen', attribution: 'Polizei / Innenministerium'},
		{value: 100, prefix: 'rund ', label: 'verletzte Polizisten', attribution: 'laut Innenminister Poseck'},
		{value: 5, label: 'geplünderte Geschäfte', attribution: 'Polizei'},
	],
	source: `${SOURCES.hrBilanz.outlet}, ${SOURCES.hrBilanz.date}`,
};

export type Coverage = {
	id: string;
	segment: 'media1' | 'media2';
	country: FlagCode;
	countryName: string;
	countryId: string;
	outlet: string;
	at: GeoPoint;
	labelOffset: [number, number];
	labelAlign: 'left' | 'right' | 'center';
};

/** Belegte internationale Berichterstattung (Medium + Sitzland). */
export const COVERAGE: Coverage[] = [
	{
		id: 'gb',
		segment: 'media1',
		country: 'GB',
		countryName: 'Großbritannien',
		countryId: COUNTRY_IDS.unitedKingdom,
		outlet: 'Reuters',
		at: PLACES.london,
		labelOffset: [-26, -64],
		labelAlign: 'right',
	},
	{
		id: 'fr',
		segment: 'media1',
		country: 'FR',
		countryName: 'Frankreich',
		countryId: COUNTRY_IDS.france,
		outlet: 'AFP · France 24',
		at: PLACES.paris,
		labelOffset: [-26, 70],
		labelAlign: 'right',
	},
	{
		id: 'in',
		segment: 'media2',
		country: 'IN',
		countryName: 'Indien',
		countryId: COUNTRY_IDS.india,
		outlet: 'Business Today',
		at: PLACES.newDelhi,
		labelOffset: [-20, 62],
		labelAlign: 'center',
	},
	{
		id: 'kr',
		segment: 'media2',
		country: 'KR',
		countryName: 'Südkorea',
		countryId: COUNTRY_IDS.southKorea,
		outlet: 'The Korea Times',
		at: PLACES.seoul,
		labelOffset: [10, -62],
		labelAlign: 'right',
	},
	{
		id: 'au',
		segment: 'media2',
		country: 'AU',
		countryName: 'Australien',
		countryId: COUNTRY_IDS.australia,
		outlet: 'ABC News',
		at: PLACES.sydney,
		labelOffset: [-26, -62],
		labelAlign: 'right',
	},
];

/** Original-Schlagzeilen (wörtlich) mit deutscher Arbeitsübersetzung. */
export const HEADLINES = [
	{
		outlet: 'Reuters',
		country: 'GB' as FlagCode,
		countryLabel: 'Nachrichtenagentur',
		date: '31.10.2026',
		headline: 'Rioters loot stores in Frankfurt as Gen Z-led protests in Germany turn violent',
		translation: 'Randalierer plündern Geschäfte in Frankfurt, Gen-Z-Proteste in Deutschland werden gewalttätig',
	},
	{
		outlet: 'France 24 · AFP',
		country: 'FR' as FlagCode,
		countryLabel: 'Frankreich',
		date: '31.10.2026',
		headline: 'En Allemagne, des manifestations de la « Gen Z » suivies d’affrontements',
		translation: 'In Deutschland folgen auf „Gen Z“-Demonstrationen Zusammenstöße',
	},
	{
		outlet: 'ABC News',
		country: 'AU' as FlagCode,
		countryLabel: 'Australien',
		date: '02.11.2026 (Ortszeit)',
		headline: 'Protesters loot shops, 100 officers injured as riots spread to Germany',
		translation: 'Demonstranten plündern Geschäfte, 100 Polizisten verletzt – Krawalle erreichen Deutschland',
	},
];

export const MORE_OUTLETS = ['Euronews', 'The Korea Times', 'Business Today', 'Arab News'];

export const FINAL_SOURCES = ['hessenschau.de', 'Reuters', 'AFP/France 24', 'Euronews', 'ABC News'];

export type NightEvent = {
	id: string;
	segment: 'shop1' | 'shop2' | 'shop3' | 'shop4';
	title: string;
	status: string;
	/** Angezeigte Uhrzeit – nur so genau, wie belegt. */
	time: string;
	timeKind: 'Meldung' | 'Alarm laut Inhaber';
	/** Lage laut OpenStreetMap (Snipes, Laufshop, 43einhalb) bzw. nur Straße/Platz, wenn das Geschäft nicht genannt wird. */
	at: [number, number];
	icon: 'shoe' | 'perfume' | 'shield' | 'run';
	labelOffset: [number, number];
	labelAlign: 'left' | 'right' | 'center';
};

/**
 * Die Nacht in der Innenstadt – NUR belegte, in Medien genannte Fälle.
 * Uhrzeiten = Zeitpunkt der Meldung im hessenschau.de-Liveticker (Ereignis kann etwas früher liegen),
 * beim Laufshop die Alarmzeit laut Inhaber. Siehe references/frankfurt-2026-10-31/sources.md.
 */
export const NIGHT_EVENTS: NightEvent[] = [
	{
		id: 'snipes',
		segment: 'shop1',
		title: 'Snipes',
		status: 'geplündert · Zeil',
		time: '21:41',
		timeKind: 'Meldung',
		at: [50.1143647, 8.6837118],
		icon: 'shoe',
		labelOffset: [36, -70],
		labelAlign: 'left',
	},
	{
		id: 'parfum',
		segment: 'shop2',
		title: 'Parfümgeschäft',
		status: 'stark beschädigt · Liebfrauenberg',
		time: '22:37',
		timeKind: 'Meldung',
		at: [50.1128375, 8.6816387],
		icon: 'perfume',
		labelOffset: [-36, -64],
		labelAlign: 'right',
	},
	{
		id: 'waffen',
		segment: 'shop2',
		title: 'Waffengeschäft',
		status: 'angegriffen · Berliner Straße',
		time: '22:37',
		timeKind: 'Meldung',
		at: [50.1118278, 8.6822265],
		icon: 'shield',
		labelOffset: [36, 70],
		labelAlign: 'left',
	},
	{
		id: 'laufshop',
		segment: 'shop3',
		title: 'Frankfurter Laufshop',
		status: 'Einbruch · Große Friedberger Str.',
		time: 'kurz vor 23 Uhr',
		timeKind: 'Alarm laut Inhaber',
		at: [50.1163831, 8.6859088],
		icon: 'run',
		labelOffset: [-36, -66],
		labelAlign: 'right',
	},
	{
		id: '43einhalb',
		segment: 'shop4',
		title: '43einhalb',
		status: 'Scheibe eingeschlagen · Eschenheimer Tor',
		time: '00:47',
		timeKind: 'Meldung',
		at: [50.1167128, 8.6801031],
		icon: 'shoe',
		labelOffset: [36, 66],
		labelAlign: 'left',
	},
];

export const NIGHT_MAP = {
	kicker: 'DIE NACHT IN DER INNENSTADT',
	/** Polizei räumt den Bereich Hauptwache – Konstablerwache (hessenschau-Liveticker 22:03). */
	clearing: {street: 'Zeil', time: '22:03', label: 'Polizei räumt die Zeil'},
	/** Polizeimitteilung 23:27: Krawalle verlagern sich u. a. zum Eschenheimer Tor. */
	hotspot: {at: [50.1173865, 8.679264] as [number, number], time: '23:27', label: 'Krawalle verlagern sich'},
	places: {
		hauptwache: [50.1138071, 8.6791483] as [number, number],
		konstablerwache: [50.1146301, 8.6868253] as [number, number],
		eschenheimerTor: [50.1173865, 8.679264] as [number, number],
		center: [50.1139, 8.6826] as [number, number],
	},
	footnote:
		'Polizei: 5 Geschäfte geplündert – welche, wurde nicht veröffentlicht. Gezeigt: in Medien genannte Fälle. Linie = Reihenfolge der Meldungen, keine belegte Laufroute.',
	sources: ['hessenschau.de-Liveticker 31.10./01.11.2026', 'hessenschau.de 01.11.2026', 'TextilWirtschaft 01.11.2026'],
};

export const OUTRO = {
	title: 'Danke fürs Zusehen!',
	channelName: 'SmokingTikTok',
	initials: 'ST',
	commentPrompt: 'Welches Thema als Nächstes?',
};
