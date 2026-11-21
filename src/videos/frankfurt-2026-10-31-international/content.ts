/**
 * Inhalte „Wie Frankfurt weltweit Schlagzeilen machte“ (FrankfurtWorldwide).
 * Jede Angabe ist in references/frankfurt-2026-10-31-international/sources.md belegt (Abruf 05.11.2026).
 * Medienliste: data/medien.json (wörtliche Schlagzeilen, Art der Meldung, Land).
 */
import type {FlagCode} from '../../components/media/flags/Flag';
import type {GeoPoint} from '../../components/map/places';
import medienData from './data/medien.json';

export const TITLE = {
	kicker: '31. OKTOBER 2026 · FRANKFURT',
	headline: 'WIE FRANKFURT WELTWEIT SCHLAGZEILEN MACHTE',
	highlight: ['WELTWEIT', 'SCHLAGZEILEN'],
};

export type MediaArt = 'eigen' | 'agentur' | 'portal';
export type MediaRegion = 'europa' | 'amerika' | 'nahost' | 'asien' | 'ozeanien' | 'afrika';

export type MediaEntry = {
	id: string;
	outlet: string;
	/** Medienmarke (z. B. Arab News Pakistan → Arab News). */
	marke?: string;
	country: FlagCode | string;
	land: string;
	region: MediaRegion;
	at: GeoPoint;
	art: MediaArt;
	agentur?: string;
	headline: string;
	passage?: string;
	sprache: string;
	de?: string;
	datum: string | null;
	url: string;
	beleg: 'abruf';
	zaehlt: boolean;
	landZaehlt?: boolean;
	nurErwaehnung?: boolean;
	hinweis?: string;
};

export const MEDIA = medienData.medien as MediaEntry[];
export const AGENCIES = medienData.agenturen as Array<{id: string; name: string; sitz: string; country: string; at: GeoPoint; headline?: string; de?: string; datum?: string}>;
export const MEDIA_STAND = medienData.stand;

export const mediaById = (id: string): MediaEntry => {
	const m = MEDIA.find((x) => x.id === id);
	if (!m) {
		throw new Error(`Medium „${id}“ fehlt in data/medien.json`);
	}

	return m;
};

/** Zählung (Stichprobe): nur selbst abgerufene Berichte, ohne Deutschland, ohne reine Übernahmen. */
export const countMedia = (media: MediaEntry[] = MEDIA) => {
	const counted = media.filter((m) => m.zaehlt && m.beleg === 'abruf' && m.country !== 'DE');
	const brands = new Set(counted.map((m) => m.marke ?? m.outlet));
	const countries = new Set(counted.filter((m) => m.landZaehlt !== false).map((m) => m.country));
	return {brands: brands.size, countries: countries.size, countryCodes: [...countries]};
};

/** Datum TT.MM. für Karten. */
export const shortDate = (iso: string | null) => (iso ? `${iso.slice(8, 10)}.${iso.slice(5, 7)}.` : 'o. D.');

export const artLabel = (m: MediaEntry) =>
	m.art === 'agentur' ? `Agentur: ${m.agentur}` : m.art === 'portal' ? 'Online-Portal' : m.agentur ? `eigener Bericht · mit ${m.agentur}` : 'eigener Bericht';

// ---------------------------------------------------------------------------------------------
// Ablauf der Nacht (Polizei / hessenschau / dpa)
// ---------------------------------------------------------------------------------------------

export const NIGHT = {
	kicker: 'WAS GESCHAH',
	places: {
		hauptwache: [50.1138071, 8.6791483] as [number, number],
		konstablerwache: [50.1146301, 8.6868253] as [number, number],
		zeil: [50.11455, 8.6845] as [number, number],
		center: [50.1141, 8.6829] as [number, number],
	},
	clock: [
		{id: 'demo', label: 'Sa, 31.10.', note: 'Halloween · Demo laut Polizei ~8.000 Menschen'},
		{id: 'abend', label: 'Am Abend', note: 'Ausschreitungen rund um Hauptwache, Zeil, Konstablerwache'},
	],
	groups: [
		{id: 'demo', title: 'Demo', text: 'große Mehrheit friedlich', color: '#34D399'},
		{id: 'spaeter', title: 'Spätere Krawalle', text: 'laut Polizei andere Personengruppe', color: '#FF4D5E'},
		{id: 'halloween', title: 'Halloween', text: 'viele verkleidet unterwegs', color: '#8B5CF6'},
	],
	sources: ['Polizei Frankfurt', 'hessenschau.de 31.10./01.11.2026', 'dpa'],
};

// ---------------------------------------------------------------------------------------------
// Bilanz (Polizei / Innenministerium Hessen)
// ---------------------------------------------------------------------------------------------

export type Stat = {id: string; value: number; prefix?: string; label: string; sub?: string; accent: string; big?: boolean};

export const STATS: Stat[] = [
	{id: 'beschaedigt', value: 17, label: 'Geschäfte beschädigt', sub: 'davon 5 geplündert', accent: '#FF4D5E', big: true},
	{id: 'festnahmen', value: 54, label: 'Festnahmen', sub: '13 bis 29 Jahre', accent: '#FFD23F'},
	{id: 'verletzt', value: 100, prefix: 'mind. ', label: 'verletzte Polizisten', sub: 'laut Innenminister', accent: '#3DD9EB'},
	{id: 'anzeigen', value: 87, label: 'Strafanzeigen', accent: '#8B5CF6'},
	{id: 'platzverweise', value: 1225, label: 'Platzverweise', accent: '#B4BEDC'},
	{id: 'kontrollen', value: 366, label: 'Personenkontrollen', accent: '#B4BEDC'},
];

export const STATS_SOURCE = ['Polizei / Innenministerium Hessen', 'hessenschau.de 01.11.2026', 'dpa'];

// ---------------------------------------------------------------------------------------------
// Virale Bilder
// ---------------------------------------------------------------------------------------------

export const BATMAN = {
	kicker: 'VIRALE BILDER',
	agencies: ['AP', 'Reuters'],
	media: ['independent', 'fpj', 'albeu'],
	sources: ['The Independent, 01.11.2026 (Bildunterschriften: AP, Reuters)', 'Free Press Journal, 01.11.2026'],
	moment: 'SOCIAL-MEDIA-MOMENT DER NACHT',
};

/**
 * TikTok-Account, der sich selbst als „Batman“ der Nacht zeigt – NUR Selbstdarstellung, Stand Screenshot des
 * Kanalbetreibers (November 2026). Nicht unabhängig bestätigt, ob er die Person auf den Agenturfotos ist.
 * Bewusst NICHT verwendet: Gesicht, Klarname, Festnahme-/Vorwurfs-Inhalte, Videotitel (siehe sources.md).
 */
export const BATMAN_ACCOUNT = {
	platform: 'TikTok',
	handle: '@ichbinyounes',
	followers: '238.747',
	likes: '51,2 Mio.',
	/** Aufrufe einzelner Batman-Clips laut Profilansicht. */
	clipViews: ['474.192', '290.700', '80.059'],
	stand: 'laut Profil · Screenshot, November 2026',
	note: 'Nachgebaute Ansicht · Selbstdarstellung des Accounts – nicht unabhängig bestätigt, ob er auf den Agenturfotos zu sehen ist',
};

export const SHOES = {
	kicker: 'DAS MEME DER NACHT',
	title: '3 LINKE SCHUHE',
	/** Echte, belegte Meme-Spuren (Wortlaut), keine erfundenen Beiträge. */
	memes: [
		{
			id: 'post',
			kind: 'TikTok-Fotopost',
			text: '„Bro braucht kein Talent, um weltberühmt zu werden. Ihm reichten 3 linke Schuhe …“',
			badge: 'LEGENDE',
			aiLabel: 'Enthält KI-generierte Medien',
			rotate: -4,
		},
		{id: 'hashtag', kind: 'Hashtag', text: '#3LinkeSchuhe', rotate: 3},
		{id: 'street', kind: 'Passant laut t-online', text: '„Hier sind die also eingebrochen, um sich drei linke Schuhe zu klauen.“', rotate: -2},
	],
	labels: ['WURDE SELBST ZUM MEME', 'VIRAL IN SOCIAL MEDIA'],
	real: 'Echt: viele einzelne linke Schuhe gestohlen',
	realSource: 'Snipes laut CORRECTIV, 03.11.2026',
	warning: 'NICHT ALLES, WAS VIRAL GEHT, IST ECHT',
	figureNote: 'Illustration · keine reale Person',
	sources: ['TikTok-Post (Screenshot, Nov. 2026)', 't-online 03.11.2026', 'CORRECTIV 03.11.2026'],
};

// ---------------------------------------------------------------------------------------------
// Weltkarte & Nachrichtenkarten
// ---------------------------------------------------------------------------------------------

/** Reihenfolge der Bögen: zuerst die im Ton genannten Agentur-Übernahmen, dann eigene Berichte, dann der Rest. */
export const WORLD = {
	kicker: 'WELTWEITE SCHLAGZEILEN',
	agencyPickups: ['koreatimes', 'arabnews', 'abc'],
	ownReports: ['orf', 'interia', 'cbs'],
	reuters: {outlet: 'Reuters', country: 'GB', headline: 'Rioters loot stores in Frankfurt as Gen Z-led protests in Germany turn violent', de: 'Randalierer plündern Geschäfte in Frankfurt, als Gen-Z-Proteste in Deutschland gewaltsam werden', date: '31.10.2026'},
};

/** Nachrichtenkarten nach Region (je Land eine Karte, keine Überlappung). */
export const CARD_REGIONS: Array<{id: string; title: string; ids: string[]}> = [
	{id: 'europa', title: 'Europa', ids: ['independent', 'orf', 'interia']},
	{id: 'amerika', title: 'Amerika', ids: ['cbs', 'excelsior', 'cnnbrasil']},
	{id: 'nahost', title: 'Nahost', ids: ['aljazeera', 'dailysabah', 'timesofisrael']},
	{id: 'asien', title: 'Asien & Ozeanien', ids: ['businesstoday', 'koreatimes', 'abc']},
];

/** Belege für den Tenor („greifen auf Deutschland über“, „Brennpunkt“). */
export const TENOR = {
	quotes: [
		{outlet: 'ABC News', country: 'AU', text: '„… as riots spread to Germany“', de: '… Krawalle greifen auf Deutschland über'},
		{outlet: 'Excélsior', country: 'MX', text: '„… ahora en Alemania“', de: '… jetzt in Deutschland'},
		{outlet: 'ABC News', country: 'AU', text: '„… emerged as the main flashpoint“', de: '… wurde zum Hauptbrennpunkt'},
	],
};

export const SUMMARY = {
	words: ['AUSSCHREITUNGEN', 'VIRALE BILDER', 'MEMES'],
	result: 'WELTNACHRICHT',
};
