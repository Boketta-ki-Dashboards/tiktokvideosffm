/**
 * Typisierter Zugriff auf data/shops.json (Recherchedaten getrennt vom Animationscode).
 * Neue Geschäfte/Belege NUR in shops.json eintragen – Karte, Karten und Übersicht folgen automatisch.
 */
import type {DamageStatus} from '../../components/media/ShopCard';
import type {StorefrontMotif} from '../../components/media/StorefrontIllustration';
import data from './data/shops.json';

export type ShopSource = {art: 'presse' | 'polizei' | 'haendler' | 'video' | 'augenzeuge' | 'adresse'; name: string; datum: string; zeit?: string; url: string | null};

export type Shop = {
	id: string;
	name: string;
	kategorie: string;
	adresse: string;
	lat: number;
	lon: number;
	praezision: 'adresse' | 'strasse' | 'ungefaehr';
	status: DamageStatus;
	schaden: {sachschaden: boolean; eindringen: string; entwendung: string};
	kurz: string;
	details: string;
	belegstaerke: 'hoch' | 'mittel' | 'niedrig';
	quellen: ShopSource[];
	bild: {typ: 'foto'; datei: string; zeigt: string; credit: string} | {typ: 'illustration'; motiv: StorefrontMotif};
};

export const SHOP_DATA = data as unknown as {
	meta: {
		stand: string;
		offiziell: {
			beschaedigt: {anzahl: number; quelle: string; datum: string};
			gepluendert: {anzahl: number; quelle: string; datum: string};
		};
	};
	shops: Shop[];
	offeneFaelle: Array<{id: string; name: string; stand: string; details: string}>;
};

export const SHOPS = SHOP_DATA.shops;
export const shopById = (id: string) => {
	const s = SHOPS.find((x) => x.id === id);
	if (!s) throw new Error(`Geschäft "${id}" fehlt in shops.json`);
	return s;
};

/** Kennzahlen der eigenen Recherche – automatisch aus den Daten berechnet. */
export const RESEARCH_STATS = (() => {
	const named = SHOPS.filter((s) => s.status !== 'ungeklaert');
	return {
		identified: named.length,
		theft: SHOPS.filter((s) => s.status === 'gepluendert').length,
		unnamedPlaces: SHOPS.filter((s) => s.status === 'ungeklaert').length,
		openCases: SHOP_DATA.offeneFaelle.length,
	};
})();

/** Kurzer Belegvermerk für die Karte. */
export const evidenceLine = (shop: Shop) =>
	shop.quellen
		.filter((q) => q.art !== 'adresse')
		.slice(0, 2)
		.map((q) => (q.zeit ? `${q.name} ${q.zeit}` : `${q.name.split(' (')[0]}`))
		.join(' · ');

/** Reihenfolge der Tour: Sprechersegment → gezeigte Geschäfte. */
export const TOUR: Array<{segment: string; shops: string[]; note?: string}> = [
	{segment: 'snipes', shops: ['snipes']},
	{segment: 'hasengasse', shops: ['hasengasse']},
	{segment: 'parfum', shops: ['oil-de-parfum']},
	{segment: 'waffen', shops: ['waffen']},
	{segment: 'bayat', shops: ['bayat']},
	{segment: 'weinkosmetik', shops: ['wein', 'kosmetik']},
	{segment: 'laufshop', shops: ['laufshop'], note: 'Nebenan: großer Riss in einer Scheibe (dpa) – Laden nicht benannt'},
	{segment: 'elfteam', shops: ['11teamsports']},
	{segment: 'e43', shops: ['43einhalb']},
];

export const KNOWN_LOSSES = [
	{shop: 'Snipes', what: 'Kartons und Schuhe'},
	{shop: 'Frankfurter Laufshop', what: 'vor allem Kleidung, auch Schuhe'},
	{shop: '43einhalb', what: 'Ware aus der Auslage'},
	{shop: 'Waffengeschäft', what: 'mind. eine Waffe'},
	{shop: '11teamsports', what: 'Ware (Video der Nacht)'},
];
