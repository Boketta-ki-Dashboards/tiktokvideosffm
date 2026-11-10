/**
 * „Frankfurt erklärt in 60 Sekunden“ #02 – 76 Fragen nach der Krawallnacht (Teil 1: die Fragen).
 * Belege: references/frankfurt-erklaert-76-fragen-landtag/sources.md (Abruf 10.11.2026, 16:11 Uhr).
 * Es geht um eingereichte FRAGEN an die Landesregierung – keine Antworten, keine Beschlüsse.
 */

export const STAND = 'Stand: 10.11.2026, 16 Uhr';

export const SESSION = {
	date: '10.11.2026',
	weekday: 'Dienstag',
	body: 'INNENAUSSCHUSS',
	number: '51. Sitzung',
	time: '20:00 UHR – GEPLANT',
	after: 'im Anschluss an die Plenarsitzung',
	room: 'Sitzungsraum 501 A',
	place: 'Hessischer Landtag, Wiesbaden',
	agenda: 'Tagesordnung: 2 dringliche Berichtsanträge',
	source: 'hessischer-landtag.de · Tagesordnung INA, 51. Sitzung',
};

/** Die beiden Berichtsanträge (Drucksachen) – Fragen gezählt aus den Original-PDFs. */
export const DOCS = {
	gruene: {drs: '21/5450', party: 'BÜNDNIS 90/DIE GRÜNEN', questions: 21},
	fdp: {
		drs: '21/5459',
		party: 'FREIE DEMOKRATEN (FDP)',
		questions: 55,
		sections: [
			{num: 'I', title: 'Gefahrenprognose', count: 8},
			{num: 'II', title: 'Polizeieinsatz', count: 18},
			{num: 'III', title: 'Strafverfolgung', count: 9},
			{num: 'IV', title: 'Junge Gewalttäter', count: 9},
			{num: 'V', title: 'Einzelhandel', count: 7},
			{num: 'VI', title: 'Schäden & Hilfe', count: 4},
		],
	},
	total: 76,
};

/** Vier Themen im Video – jeweils mit den zugehörigen Fragen aus den Drucksachen. */
export const QUESTIONS = [
	{
		num: '01',
		title: ['WAS WUSSTE', 'DIE POLIZEI VORHER?'],
		folder: 'GEFAHRENPROGNOSE',
		refs: 'Drs. 21/5459, Abschnitt I (Fragen 1–8)',
	},
	{
		num: '02',
		title: ['WARUM TROTZDEM', 'PLÜNDERUNGEN?'],
		plaque: 'TROTZ SCHUTZKONZEPT?',
		refs: 'Drs. 21/5459, II.4, II.16, V.4, V.6',
	},
	{
		num: '03',
		title: ['WELCHE ROLLE', 'SPIELTE TIKTOK?'],
		left: {title: 'DEMO-AUFRUFE', text: 'Mobilisierung zur Versammlung'},
		right: {title: 'ABSPRACHEN ZU STRAFTATEN?', text: 'Gefragt – nicht belegt'},
		plaque: ['DEMO-AUFRUFE', 'ODER ABSPRACHEN?'],
		refs: 'Drs. 21/5459, I.8 – nennt ausdrücklich TikTok',
	},
	{
		num: '04',
		title: ['WAS SIND DIE', 'KONSEQUENZEN?'],
		items: [
			{label: 'ERMITTLUNGEN', sub: 'Verfahren, Tatverdächtige'},
			{label: 'HILFE FÜR LÄDEN', sub: 'Schäden, Unterstützung'},
			{label: 'KÜNFTIGE DEMOS', sub: '20.11.: Protesttag laut Veranstalter'},
		],
		plaque: 'WAS PASSIERT ALS NÄCHSTES?',
		refs: 'Drs. 21/5450 Nr. 20, 21 · 21/5459 III.8, IV.7, VI.2, VI.4',
	},
] as const;

export const NOTE = {
	equation: ['BISHER FRAGEN', 'NOCH KEINE ANTWORTEN'] as const,
	line: 'Berichtsantrag = Bitte um Bericht – kein Verbotsantrag',
};

export const OUTRO = {title: 'FOLGT FÜR TEIL 2', sub: 'WAS WURDE WIRKLICH BEANTWORTET?'};

export const SOURCES = [
	{id: 'to', text: 'Hessischer Landtag – Innenausschuss, 51. Sitzung (Tagesordnung)', url: 'https://hessischer-landtag.de/termine/innenausschuss-51-sitzung'},
	{id: 'drs5450', text: 'Drucksache 21/5450 – Dringlicher Berichtsantrag BÜNDNIS 90/DIE GRÜNEN', url: 'https://starweb.hessen.de/cache/DRS/21/0/05450.pdf'},
	{id: 'drs5459', text: 'Drucksache 21/5459 – Dringlicher Berichtsantrag Freie Demokraten', url: 'https://starweb.hessen.de/cache/DRS/21/9/05459.pdf'},
];
