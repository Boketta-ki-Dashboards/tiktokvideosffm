/**
 * „Nur 13 Demonstranten? – Warum war bei der Gen-Z-Demo kaum jemand?“ (Format B #08, Frankfurt am 14.11.2026, Stand 16.11.2026).
 * Belege: references/frankfurt-erklaert-13-demonstranten-2026-11-14/sources.md (Abruf 16.11.2026).
 * Kategorien im Bild: BERICHT (FNP, Reporter vor Ort) · OFFIZIELL (Polizei) · AUSSAGE (Teilnehmer) · MÖGLICHE ERKLÄRUNG · ANGEKÜNDIGT · ILLUSTRATION.
 * Die 13 sind die Summe ZWEIER getrennter Kundgebungen (≈ 10 + 3) laut FNP-Beobachtung – keine amtliche Zählung.
 */
import type {LatLon} from '../../components/map/CityStreetMap';

/** Neuester Meldestand: FNP, Stand 16.11.2026, 13:06 Uhr; keine Polizeimeldung zum Verlauf bis 16.11., 13:42 Uhr. */
export const STAND = 'Stand: 16.11.2026';

/** Titelbild (= erste Szene). */
export const COVER = {
	big: '13',
	card: 'NUR 13 DEMONSTRANTEN?!',
	sub: 'Frankfurt am 14. November',
	thumbSub: '16 MANNSCHAFTSWAGEN IN BEREITSCHAFT',
	small: 'GEN Z REGELT · FRANKFURT · 14.11.',
};

/** Szene 2 – Gegenüberstellung (Größenordnung, KEINE räumliche Gegenüberstellung). */
export const CONTRAST = {
	vans: {value: 16, label: 'MANNSCHAFTSWAGEN', note: 'in Bereitschaft · laut FNP vor der Matthäuskirche'},
	people: {value: 13, label: 'DEMONSTRIERENDE', note: 'insgesamt · bei zwei Kundgebungen'},
	split: [
		{place: 'HAUPTWACHE', value: 'RUND 10'},
		{place: 'BOCKENHEIMER WARTE', value: '3'},
	],
	hint: 'Bereitstellungsort ≠ Kundgebungsort',
	compare: {label: '31.10. (Halloween)', value: 'RUND 8.000', note: 'laut Polizei · großer Protesttag, anderer Anlass'},
	source: 'Frankfurter Neue Presse (Reporter vor Ort), 16.11.2026 · 31.10.: Polizei laut hessenschau',
};

/** Szene 3 – Karte: zwei getrennte Kundgebungen + Bereitstellung (Orte, keine Routen). */
export const PLACES = {
	hauptwache: {
		name: 'HAUPTWACHE',
		at: [50.11347, 8.67875] as LatLon,
		count: 'RUND 10',
		window: 'angemeldet 12:30–15 Uhr (Polizei)',
		end: 'Schluss schon gegen 14 Uhr',
		quote: '„Sollte nur auf den Protesttag am 20. November hinweisen.“',
		quoteBy: 'Teilnehmer (19) laut FNP',
	},
	warte: {
		name: 'BOCKENHEIMER WARTE',
		at: [50.12011, 8.65089] as LatLon,
		count: '3',
		window: 'angemeldet 17–19 Uhr (Polizei)',
		end: 'nach etwa 30 Minuten vorbei',
		note: 'Anmelder laut Polizeisprecher nicht erschienen',
		passersby: 'Schaulustige zählen nicht mit',
	},
	staging: {
		name: 'BEREITSTELLUNG',
		at: [50.1104461, 8.657469] as LatLon,
		note: '16 Mannschaftswagen · laut FNP vor der Matthäuskirche',
	},
	mapNote: 'Orte laut Polizei/FNP · getrennte Kundgebungen · keine Routen',
	source: 'FNP 16.11. · Polizei Frankfurt, PM 13.11. · Karte: © OpenStreetMap-Mitwirkende',
};

/** Szene 4 – Datumschaos (Kalender November 2026; 1.11. = Sonntag). */
export const TIMELINE = [
	{day: 1, label: '1.11.', text: '14.11. kurz auf der Website genannt – dann entfernt („bald“)', kind: 'BERICHT', source: 'tagesschau'},
	{day: 20, label: '20.11.', text: 'gilt als nächster großer Termin', kind: 'BERICHT', source: 'dpa/tagesschau'},
	{day: 12, label: 'bis 12.11.', text: 'doch Aktionstag am 14.: „Phase 2“', kind: 'BERICHT', source: 'taz 12.11.'},
	{day: 13, label: 'Fr 13.11.', text: 'Polizei nennt die Frankfurter Kundgebungen', kind: 'OFFIZIELL', source: 'Polizei-PM'},
	{day: 14, label: 'Sa 14.11.', text: 'zwei kleine Kundgebungen: rund 10 + 3', kind: 'BERICHT', source: 'FNP'},
] as const;
export const CONFUSION = {
	headline: 'WAR DAS DATUM ZU VERWIRREND?',
	tag: 'MÖGLICHE ERKLÄRUNG – NICHT BEWIESEN',
	note: 'Website-Ansicht stilisiert · keine Bildschirmaufnahme',
	source: 'tagesschau.de 01.11. · taz 12.11. · Polizei Frankfurt, PM 13.11. · FNP 16.11.',
};

/** Szene 5 – Vorbereitung vs. Verlauf. */
export const POLICE = {
	plan: {title: 'VORBEREITET', items: ['mehr Einsatzkräfte als am 31.10.', 'Absperrgitter bereitgehalten', 'Zugangskontrollen nur im Bedarfsfall'], source: 'Polizei, PM 13.11.'},
	outcome: {title: 'VERLAUF', items: ['ZEIL BLIEB RUHIG', 'ABSPERRUNGEN NICHT BENÖTIGT'], source: 'laut FNP'},
	why: 'Planung vorab nach möglichem Risiko – nicht nach der späteren Teilnehmerzahl',
	source: 'Polizei Frankfurt, PM 13.11.2026 · FNP 16.11.2026 · Zeil: Illustration',
};

/** Szene 6 – 20. November (laut Initiative). */
export const NEXT = {
	title: '20.11. – NÄCHSTER PROTESTTAG',
	sub: 'laut Initiative ab 14 Uhr, bundesweit · Frankfurt: Standort folgt',
	question: 'TERMINCHAOS ODER KLEINE WERBEAKTION?',
	source: 'genz-regelt.de, Abruf 16.11.2026',
};

export const CTA = {title: 'FOLGT FÜR MEHR', sub: 'FRANKFURT ERKLÄRT · IN 60 SEKUNDEN'};

/** Quellen (Abruf 16.11.2026; Wortlaute in sources.md). */
export const SOURCES = [
	{id: 'fnp', text: 'Frankfurter Neue Presse (Thomas J. Schmidt): „GenZ-Demo in Frankfurt: 16 Mannschaftswagen warten auf 13 Demonstranten“, Stand 16.11.2026, 13:06 Uhr', url: 'https://www.fnp.de/frankfurt/genz-demo-in-frankfurt-16-mannschaftswagen-warten-auf-13-demonstranten-94591171.html'},
	{id: 'pp', text: 'Polizeipräsidium Frankfurt am Main: „POL-F: 261113 - 1421 Frankfurt - Stadtgebiet: Mehrere Versammlungslagen in der Innenstadt“, 13.11.2026, 14:32 Uhr', url: 'https://www.presseportal.de/blaulicht/pm/4970/6390267'},
	{id: 'ts', text: 'tagesschau.de: „FAQ: Wie lief der „Gen Z regelt“-Protest? Wie geht es weiter?“, 01.11.2026', url: 'https://www.tagesschau.de/inland/gesellschaft/demonstration-protest-genz-100.html'},
	{id: 'ts2', text: 'tagesschau.de: „„Gen Z regelt“ will Demos fortsetzen“, 01.11.2026', url: 'https://www.tagesschau.de/inland/gesellschaft/gen-z-demos-bilanz-100.html'},
	{id: 'taz', text: 'taz: „Gen-Z-Proteste in Berlin: „Wir als Jugend sind sauer und wütend auf diese Politik““, 12.11.2026', url: 'https://taz.de/Gen-Z-Proteste-in-Berlin/!6227408/'},
	{id: 'hs', text: 'hessenschau.de: „Polizei löst Gen-Z-Protest in Frankfurt auf - tausende Teilnehmende“, 31.10.2026', url: 'https://www.hessenschau.de/panorama/polizei-loest-gen-z-protest-in-frankfurt-auf---tausende-teilnehmende-v16,frankfurt-gen-z-demo-100.html'},
	{id: 'genz', text: 'Initiative „Gen Z regelt“: genz-regelt.de (20.11.2026, ab 14 Uhr), Abruf 16.11.2026', url: 'https://genz-regelt.de/'},
	{id: 'osm', text: 'OpenStreetMap (Nominatim): Matthäuskirche, Friedrich-Ebert-Anlage 33', url: 'https://www.openstreetmap.org/search?query=Matth%C3%A4uskirche%20Frankfurt'},
];
