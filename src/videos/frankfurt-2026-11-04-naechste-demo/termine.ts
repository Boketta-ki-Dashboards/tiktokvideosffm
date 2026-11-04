/**
 * Typisierter Zugriff auf data/termine.json (Recherche getrennt vom Animationscode).
 * Neue Termine/Belege NUR dort eintragen – Kalenderkarten, Karte und Zusammenfassung folgen automatisch.
 */
import data from './data/termine.json';

export type Stufe = 'geruecht' | 'ankuendigung' | 'anmeldung' | 'behoerdlich';

export type QuelleRef = {name: string; url: string; abgerufen: string; datum?: string};

export type Termin = {
	id: string;
	datum: string;
	tag: number;
	wochentag: string;
	stufe: Stufe;
	label: string;
	kurz: string;
	details: string;
	uhrzeit?: string;
	staedte?: number;
	frankfurt: string;
	anmeldung?: string;
	behoerdlicheEntscheidung?: string;
	quellen: string[];
};

export type Stadt = {id: string; name: string; lon: number; lat: number; selbst: boolean};

export const TERMIN_DATA = data as unknown as {
	meta: {title: string; stand: string; hinweis: string};
	quellen: Record<string, QuelleRef>;
	termine: Termin[];
	politik: {
		ankuendigungen: Array<{wer: string; was: string; datum: string; art: string; quelle: string}>;
		verbotBeschlossen: boolean;
		hinweisEntscheidung: string;
	};
	recht: {
		experte: string;
		quelle: string;
		artikel8: {absatz1: string; absatz2: string};
		huerden: Array<{id: string; titel: string; text: string}>;
	};
	staedte: Stadt[];
};

export const TERMINE = TERMIN_DATA.termine;
export const STAEDTE = TERMIN_DATA.staedte;

export const terminById = (id: string) => {
	const t = TERMINE.find((x) => x.id === id);
	if (!t) throw new Error(`Termin "${id}" fehlt in termine.json`);
	return t;
};

/** Städtezahl, die der Veranstalter für den 20.11. nennt – muss zur Städteliste passen (Test). */
export const ANNOUNCED_CITY_COUNT = terminById('20-11').staedte ?? 0;

/** Stufen-Beschriftung (kurz) und Farbe – eine Quelle der Wahrheit für alle Szenen. */
export const STUFE_STYLE: Record<Stufe, {label: string; color: string}> = {
	geruecht: {label: 'UNBESTÄTIGT', color: '#8C95B4'},
	ankuendigung: {label: 'ANGEKÜNDIGT', color: '#FFD23F'},
	anmeldung: {label: 'ANGEMELDET', color: '#3DD9EB'},
	behoerdlich: {label: 'BEHÖRDLICH ENTSCHIEDEN', color: '#34D399'},
};
