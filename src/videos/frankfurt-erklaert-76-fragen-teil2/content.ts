/**
 * „Frankfurt erklärt in 60 Sekunden“ #03 – 76 Fragen, Teil 2: die ersten Antworten (Innenausschuss 10.11.2026).
 * Belege: references/frankfurt-erklaert-76-fragen-teil2/sources.md (Abruf 11.11.2026, 11:00 Uhr).
 * Kategorien: OFFIZIELL (Angabe des Innenministers/Ministeriums, berichtet von hr/dpa) · BERICHT (journalistisch) ·
 * POSITION (politische Bewertung) · OFFEN (nicht beantwortet / nicht belegt).
 */

export const STAND = 'Stand: 11.11.2026';
export const ATTRIB = 'laut Innenminister Poseck im Innenausschuss (hr, dpa)';

export type Kind = 'offiziell' | 'bericht' | 'position' | 'offen' | 'angekuendigt';

export const COVER = {
	title: ['76 FRAGEN –', 'ERSTE ANTWORTEN'],
	sub: 'Neue Zahlen nach der Innenausschusssitzung',
	date: '11. NOVEMBER 2026',
	part: 'TEIL 2',
};

export const POLICE = {
	forces: 1300,
	forcesLabel: 'EINSATZKRÄFTE',
	forcesNote: 'über den Abend verteilt – nicht gleichzeitig an einem Ort',
	before: 'Vorab: Ministerium warnte vor gewaltbereiten Linksextremisten (29.10.)',
	open: 'WARUM TROTZDEM PLÜNDERUNGEN?',
	openNote: 'Schutz der Geschäfte: noch nicht geklärt',
	timeline: ['DEMO', 'AUFLÖSUNG', 'NACHT'],
};

export const NUMBERS = {
	injured: 181,
	injuredLabel: 'VERLETZTE POLIZISTEN',
	unfit: 13,
	unfitLabel: 'BISLANG NICHT DIENSTFÄHIG',
	beforeDissolution: 'davon 6 bis zur Auflösung verletzt, 1 schwer',
	suspects: 73,
	suspectsLabel: 'TATVERDÄCHTIGE',
	suspectsNote: 'Zahl wächst laut Minister weiter',
	/** gerundete Darstellung der Anteile (Punkte-Raster) */
	under21: {share: 2 / 3, label: 'RUND 2/3 UNTER 21'},
	known: {share: 0.5, label: 'MEHR ALS DIE HÄLFTE POLIZEIBEKANNT'},
	frankfurt: {share: 0.25, label: 'NUR ETWA 1/4 WOHNT IN FRANKFURT'},
	rounding: 'Punkte-Darstellung gerundet',
};

export const TIKTOK = {
	left: {title: 'DEMO-AUFRUFE', text: 'legale Mobilisierung'},
	right: {title: 'STRAFTATEN ABGESPROCHEN?', text: 'gefragt in Drs. 21/5459, I.8'},
	stamp: ['BISHER NICHT', 'ÖFFENTLICH BELEGT'],
	note: 'In den Berichten zur Sitzung: keine Angabe dazu',
};

export const NOV20 = {
	day: '20',
	month: 'NOV',
	headline: ['WEITERE MASSNAHMEN', 'ANGEKÜNDIGT'],
	items: [
		{icon: 'board' as const, title: 'MÖGLICHE AUFLAGEN', text: 'für die Versammlung'},
		{icon: 'shield' as const, title: 'UNTERBINDUNGSGEWAHRSAM', text: 'präventiv – nur unter gesetzlichen Voraussetzungen'},
	],
	noBan: 'KEIN PAUSCHALES DEMO-VERBOT',
	noBanNote: 'Stand: angekündigt, nicht beschlossen',
};

export const CONTRO = {
	name: 'ROMAN POSECK',
	role: 'Innenminister (CDU)',
	label: 'POSITION DES MINISTERS',
	quote: '„überwiegend migrantisch geprägt“',
	text: 'verteidigt seine umstrittene Aussage zur Tätergruppe',
	hint: 'Staatsangehörigkeit ≠ Migrationshintergrund',
	equation: ['VERDACHT', 'VERURTEILUNG'] as const,
	peaceful: 'Die meisten der 8.000–9.000 Demonstrierenden: friedlich',
};

/** Die vier Fragen aus Teil 1 mit Status nach der Sitzung. */
export const STATUS = [
	{num: '01', title: 'POLIZEI VORBEREITET?', status: 'TEILWEISE' as const, note: '1.300 Kräfte genannt'},
	{num: '02', title: 'PLÜNDERUNGEN TROTZ SCHUTZ?', status: 'OFFEN' as const, note: 'Ablauf nicht geklärt'},
	{num: '03', title: 'TIKTOK-ABSPRACHEN?', status: 'OFFEN' as const, note: 'nicht belegt'},
	{num: '04', title: 'KONSEQUENZEN?', status: 'TEILWEISE' as const, note: '73 Verdächtige, Maßnahmen angekündigt'},
];

export const CTA = {title: 'REICHEN EUCH DIESE ANTWORTEN?'};

export const SOURCES = [
	{id: 'hs', text: 'hessenschau (hr): „Nach Gen Z-Krawallen: Poseck verteidigt Aussagen zu Migrationshintergrund“, aktualisiert 11.11.2026, 06:18 Uhr', url: 'https://www.hessenschau.de/politik/nach-gen-z-krawallen-poseck-verteidigt-aussagen-zu-migrationshintergrund--v2,poseck-innenausschuss-100.html'},
	{id: 'ts', text: 'tagesschau.de (hr), 11.11.2026', url: 'https://www.tagesschau.de/inland/regional/hessen/hr-nach-gen-z-krawallen-poseck-verteidigt-aussagen-zu-migrationshintergrund-100.html'},
	{id: 'ffh', text: 'HIT RADIO FFH (dpa): „Krawalle in Frankfurt: Poseck verteidigt Aussagen zu Tätern“, 10.11.2026', url: 'https://www.ffh.de/nachrichten/hessen/wiesbaden/484307-krawalle-in-frankfurt-poseck-verteidigt-aussagen-zu-taetern.html'},
	{id: 'hmdi', text: 'Hessisches Innenministerium, PM 29.10.2026: „Polizei bereitet sich auf Protestbewegung der Generation Z vor“', url: 'https://innen.hessen.de/presse/polizei-bereitet-sich-auf-protestbewegung-der-generation-z-vor'},
	{id: 'to', text: 'Hessischer Landtag – Innenausschuss, 51. Sitzung (Tagesordnung)', url: 'https://hessischer-landtag.de/termine/innenausschuss-51-sitzung'},
];
