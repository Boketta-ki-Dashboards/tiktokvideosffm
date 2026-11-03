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
	place: 'Zeil · Frankfurter Innenstadt',
	when: 'Abend des 31. Oktober 2026',
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
