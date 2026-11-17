/**
 * „Proteste am 20.11. – was passiert am Freitag in Frankfurt?“ (Format B #09, Stand 17.11.2026).
 * Belege: references/frankfurt-erklaert-20nov-drei-proteste/sources.md (Abruf 17.11.2026).
 * Kategorien im Bild: LAUT STADT (Anmeldung/Auflagen) · ANGEKÜNDIGT (Aufrufe, GEW, Initiative) · OFFEN · ILLUSTRATION · GAG.
 * Getrennte Versammlungen – kein gemeinsamer Zug, keine gemeinsame Route, Organisatoren getrennt benannt.
 */

/** Neuester Meldestand: Stadt Frankfurt über t-online (17.11.2026, 13:27 Uhr); Pressekonferenz Stadt/Polizei/Innenministerium am Mi 18.11. */
export const STAND = 'Stand: 17.11.2026';

export type EventId = 'schulstreik' | 'campus' | 'genz' | 'gewerkschaft';

/** Tages-Timeline in chronologischer Reihenfolge (laut Stadt vier angemeldete Versammlungen). */
export const EVENTS = [
	{
		id: 'schulstreik' as EventId,
		time: '10:00',
		until: '15:00',
		title: 'SCHULSTREIK',
		label: 'SCHULSTREIK',
		place: 'WILLY-BRANDT-PLATZ',
		kind: 'Demozug',
		goal: 'Ziel: Campus Westend',
		registrant: 'Anmeldung laut Stadt: ver.di-Jugend Frankfurt und Region',
		expected: 'bis zu 1.200 angemeldet',
		topic: 'gegen Wehrpflicht – laut Aufruf auch gegen Krieg und Sozialkürzungen',
		motto: '„Fight for our future, not their wars!“',
		color: '#4FC3F7',
		icon: 'book' as const,
	},
	{
		id: 'campus' as EventId,
		time: '11:00',
		until: '13:30',
		title: 'KLEINER ZUG',
		label: 'KLEINER ZUG',
		place: 'CAMPUS WESTEND',
		kind: 'Demozug',
		goal: 'Adorno-Platz → Gisèle-Freund-Platz',
		registrant: 'Anmeldung laut Stadt: Internationaler Jugendverband',
		expected: '75 angemeldet',
		topic: 'im Zusammenhang mit dem Schulstreik',
		motto: '',
		color: '#9AA6CC',
		icon: 'flag' as const,
	},
	{
		id: 'genz' as EventId,
		time: '14:00',
		until: '16:30',
		title: 'GEN Z REGELT',
		label: 'GEN Z REGELT',
		place: 'WESELER WERFT',
		kind: 'stationäre Kundgebung',
		goal: 'statt Demozug · endet vor Einbruch der Dunkelheit',
		registrant: 'Anmeldung: Gen Z regelt',
		expected: 'bis zu 4.000 erwartet',
		topic: 'für Bildung, Gesundheit und bezahlbares Leben – gegen Wehrpflicht und Sparkurs',
		motto: '',
		color: '#FF3B4E',
		icon: 'sign' as const,
	},
	{
		id: 'gewerkschaft' as EventId,
		time: '17:30',
		until: '21:30',
		title: 'GEWERKSCHAFTSJUGEND',
		label: 'GEWERKSCHAFTS-\nJUGEND',
		place: 'BOCKENHEIMER DEPOT',
		kind: 'Versammlung · Route wird noch geprüft',
		goal: 'angekündigt als Kundgebung am Bockenheimer Depot (GEW)',
		registrant: 'Anmeldung laut Stadt: ver.di-Jugend',
		expected: 'bis zu 500 angemeldet',
		topic: '„Frankfurt gegen Wehrpflicht, Krieg und soziale Kürzungen“',
		motto: 'GEW: „Internationaler Aktionstag gegen Wehrpflicht, Aufrüstung und Sozialabbau“',
		color: '#FFD23F',
		icon: 'banner' as const,
	},
] as const;

/** Titelbild (= erste Szene). Nicht „3 Proteste“: laut Stadt sind vier Versammlungen angemeldet. */
export const COVER = {
	big: '4 PROTESTE',
	big2: '1 FREITAG',
	small: 'FRANKFURT · FREITAG, 20.11.2026',
	chip: '4 GETRENNTE VERSAMMLUNGEN',
	chipSource: 'LAUT STADT',
	/** nur im PNG (im Video steht dort der Untertitel) */
	question: 'WAS PASSIERT AM 20.11.?',
};

/** Szene Schulstreik + kleiner Zug (beide laut Stadt angemeldet; Ziel, keine Route im Bild). */
export const SCHUL = {
	tag: 'FREITAG, 10:00 UHR',
	topicCity: 'gegen die Wehrpflicht',
	topicCall: 'laut Aufruf auch: gegen Krieg & Sozialkürzungen',
	count: 1200,
	countLabel: 'BIS ZU 1.200 ANGEMELDET',
	goal: 'ZIEL: CAMPUS WESTEND',
	small: {time: '11:00', title: 'KLEINER ZUG AM CAMPUS', count: 75, countLabel: '75 ANGEMELDET', route: 'Adorno-Platz → Gisèle-Freund-Platz', by: 'Internationaler Jugendverband'},
	source: 'Quelle: Stadt Frankfurt laut t-online (17.11.) · Aufruf laut Frankfurter Info',
};

/** Szene Gewerkschaftsjugend (Bockenheimer Depot – nicht die Bockenheimer Warte). */
export const GEWERK = {
	tag: 'FREITAG, 17:30 UHR',
	motto: '„Frankfurt gegen Wehrpflicht, Krieg und soziale Kürzungen“',
	count: 'BIS ZU 500 ANGEMELDET',
	route: 'ROUTE: WIRD NOCH GEPRÜFT',
	routeNote: 'laut Stadt – von den Sicherheitsbehörden',
	source: 'Quelle: Stadt Frankfurt laut t-online (17.11.) · GEW Hessen (12.11.)',
};

/** Gen-Z-Abschnitt: Forderungen laut Website der Initiative (Abruf 17.11.2026). */
export const DEMANDS = [
	{id: 'bildung', title: 'BILDUNG', sub: 'statt kaputter Schulen', icon: 'school' as const, color: '#4FC3F7'},
	{id: 'gesundheit', title: 'GESUNDHEIT', sub: 'Suchthilfe & Psychotherapie', icon: 'health' as const, color: '#3DDC97'},
	{id: 'leben', title: 'BEZAHLBARES LEBEN', sub: 'gegen steigende Kosten', icon: 'cost' as const, color: '#FFD23F'},
	{id: 'wehrpflicht', title: 'GEGEN WEHRPFLICHT', sub: '& Sparkurs („auf unseren Rücken“)', icon: 'helmet' as const, color: '#FF8FA3'},
] as const;
export const GENZ = {
	selfDescription: 'laut eigener Erklärung „Friedlich, überparteilich, für alle.“',
	website: 'genz-regelt.de: „Standort folgt“ (Stand 17.11.)',
	city: 'laut Stadt: Kundgebung 14–16:30 Uhr, Weseler Werft, bis zu 4.000 erwartet',
	rules: ['KEINE PYROTECHNIK', 'KEIN ALKOHOL / GLAS', 'VERMUMMUNGSVERBOT'],
	rulesNote: 'Auflagen der Stadt für alle vier Versammlungen',
	source: 'Stadt Frankfurt laut t-online 17.11. · genz-regelt.de · GEW Hessen 12.11.',
};

/** Batman-Gag – humorvoll, aber auf belegter Grundlage (Agenturfotos 31.10.), ohne Namen/Gesicht. */
export const BATMAN = {
	label: 'GAG',
	note: 'Batman-Kostüm an Halloween laut Reuters-Bildunterschrift von der Polizei abgeführt · Illustration',
};

export const CTA = {title: 'FOLGT FÜR MEHR', sub: 'FRANKFURT ERKLÄRT · IN 60 SEKUNDEN'};

/** Quellen (Abruf 17.11.2026; Wortlaute in sources.md). */
export const SOURCES = [
	{id: 'ton', text: 't-online Frankfurt: „Frankfurt: Neue Gen-Z-Demos schüren Angst vor weiteren Ausschreitungen“, 17.11.2026, 13:27 Uhr (Quelle u. a.: Stadt Frankfurt, Übersicht per E-Mail)', url: 'https://frankfurt.t-online.de/region/frankfurt-am-main/id_101532898/frankfurt-neue-gen-z-demos-schueren-angst-vor-weiteren-ausschreitungen.html'},
	{id: 'gew', text: 'GEW Hessen: „Politik muss Forderungen der Jugend ernst nehmen statt Situation anzuheizen“, PM 12.11.2026', url: 'https://www.gew-hessen.de/details/politik-muss-forderungen-der-jugend-ernst-nehmen-statt-situation-anzuheizen'},
	{id: 'finfo', text: 'Frankfurter Info: Termin „Internationaler Jugendstreik“, 20.11.2026 ab 10 Uhr', url: 'https://www.frankfurter-info.org/termine/internationaler-jugendstreik'},
	{id: 'dfg', text: 'DFG-VK Frankfurt: Veranstaltungen – „Schulstreik gegen die „Wehrpflicht““, 20.11.2026, Willy-Brandt-Platz', url: 'https://frankfurt.dfg-vk.de/veranstaltungen/'},
	{id: 'genz', text: 'Initiative „Gen Z regelt“: genz-regelt.de (Frankfurt „Standort folgt“, ab 14 Uhr), Abruf 17.11.2026', url: 'https://genz-regelt.de/'},
	{id: 'ofi', text: 'Offenbacher FriedensInitiative: „Solidarität ist nötig“, 16.11.2026 (14 Uhr Weseler Werft)', url: 'https://offenbacher-friedensinitiative.de/?p=12968'},
	{id: 'hr', text: 'tagesschau.de/hessenschau: „Nächste Gen-Z-Demo in Frankfurt: Jurist warnt vor schnellen Verbotsforderungen“, 02./03.11.2026', url: 'https://www.tagesschau.de/inland/regional/hessen/hr-rechtsexperte-warnt-vor-schnellen-verbotsforderungen-nach-gen-z-protest-100.html'},
	{id: 'heute', text: 'heute.at: „"Gen Z regelt"? Am Ende wird sogar Batman abgeführt“, 01.11.2026', url: 'https://www.heute.at/s/gen-z-regelt-am-ende-wird-sogar-batman-abgefuehrt-120275172'},
	{id: 'independent', text: 'The Independent (via Yahoo): Bildunterschrift Reuters „Police detain a demonstrator dressed as Batman …“, 01.11.2026', url: 'https://sg.news.yahoo.com/protester-batman-costume-arrested-during-105646361.html'},
];
