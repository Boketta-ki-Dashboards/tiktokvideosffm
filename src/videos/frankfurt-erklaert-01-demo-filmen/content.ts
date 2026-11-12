/**
 * „Frankfurt erklärt in 60 Sekunden“ #01 – Nur gefilmt – trotzdem Ärger?
 * Alle Aussagen mit Beleg: references/frankfurt-erklaert-01-demo-filmen/sources.md (Abruf 09.11.2026).
 * Allgemeine Information, keine Rechtsberatung. Keine erfundenen Fälle, Polizeiaussagen oder Urteile.
 */

export const STAND = 'Stand: 09.11.2026';
export const DISCLAIMER = 'Allgemeine Info, keine Rechtsberatung';

export const HOOK = {
	title: ['NUR GEFILMT –', 'TROTZDEM ÄRGER?'],
	tag: 'ILLUSTRATION',
};

export const DEMO = {
	chapter: {num: '1', text: 'NUR DABEI?'},
	right: {law: 'Art. 8 GG', title: 'VERSAMMLUNGSFREIHEIT', text: 'friedlich und ohne Waffen'},
	labels: {you: 'DU: FRIEDLICH', riot: 'EINZELNE RANDALIEREN'},
	equation: ['DABEI SEIN', 'STRAFBAR SEIN'] as const,
	roles: ['MITMACHEN', 'UNTERSTÜTZEN', 'ANSTACHELN'],
	banner: ['EIGENE BETEILIGUNG', 'ENTSCHEIDET'],
	law: '§ 125 StGB Landfriedensbruch',
	source: 'Art. 8 GG · § 125 StGB (gesetze-im-internet.de)',
};

export const FILM = {
	chapter: {num: '2', text: 'FILMEN?'},
	record: {title: 'AUFNEHMEN', text: 'grundsätzlich erlaubt – auch Polizeieinsätze'},
	distance: {title: 'NICHT BEHINDERN', text: 'Abstand halten, Wege frei lassen'},
	publish: {title: 'VERÖFFENTLICHEN', text: 'Persönlichkeitsrechte beachten', law: '§§ 22, 23 KUG'},
	speech: {title: 'PRIVATE GESPRÄCHE', text: 'nichtöffentlich gesprochenes Wort', law: '§ 201 StGB'},
	equation: ['FILMEN', 'ALLES POSTEN DÜRFEN'] as const,
	source: 'BVerfG 1 BvR 2501/13 (2015) · § 201 StGB · §§ 22, 23 KUG',
};

export const POLICE = {
	chapter: {num: '3', text: 'KONTROLLE?'},
	idCheck: {title: 'IDENTITÄTSKONTROLLE', text: 'auch als Zeuge möglich', law: '§ 163b Abs. 2 StPO'},
	cards: [
		{icon: 'id' as const, title: 'IDENTITÄT', text: 'Personalien', law: '§ 163b StPO'},
		{icon: 'camera' as const, title: 'BEWEISMITTEL', text: 'Videos können Beweis sein', law: '§ 94 StPO'},
		{icon: 'lock' as const, title: 'SICHERSTELLUNG', text: 'unter Voraussetzungen', law: '§§ 94, 98 StPO'},
	],
	banner: ['NICHT AUTOMATISCH', 'DIE GANZE GALERIE'],
	review: 'Daten-Durchsicht: eigene Regeln (§ 110 StPO) · §§ 94, 98, 163b StPO',
	source: '§§ 94, 98, 110, 163b StPO (gesetze-im-internet.de)',
};

export const DISSOLVE = {
	chapter: {num: '4', text: 'AUFGELÖST?'},
	board: ['VERSAMMLUNG', 'AUFGELÖST'],
	equation: ['AUFLÖSUNG', 'ENTFERNEN'] as const,
	law: '§ 14 Abs. 7 HVersFG',
	source: '§ 14 Abs. 7 HVersFG: „unverzüglich zu entfernen“',
};

export const FAZIT = {
	title: 'FAZIT',
	items: [
		{icon: 'calm' as const, title: 'RUHIG BLEIBEN', text: 'friedlich teilnehmen'},
		{icon: 'shield' as const, title: 'ABSTAND ZUR GEWALT', text: 'verantwortungsvoll filmen'},
		{icon: 'question' as const, title: 'SACHLICH NACHFRAGEN', text: 'Grund der Kontrolle'},
	],
	claim: 'DEINE RECHTE KENNEN.',
};

/** Belege (Kurzfassung, vollständig in sources.md). */
export const SOURCES = [
	{id: 'gg8', text: 'Art. 8 GG', url: 'https://www.gesetze-im-internet.de/gg/art_8.html'},
	{id: 'stgb125', text: '§ 125 StGB', url: 'https://www.gesetze-im-internet.de/stgb/__125.html'},
	{id: 'stgb201', text: '§ 201 StGB', url: 'https://www.gesetze-im-internet.de/stgb/__201.html'},
	{id: 'kug22', text: '§ 22 KUG', url: 'https://www.gesetze-im-internet.de/kunsturhg/__22.html'},
	{id: 'kug23', text: '§ 23 KUG', url: 'https://www.gesetze-im-internet.de/kunsturhg/__23.html'},
	{id: 'stpo94', text: '§ 94 StPO', url: 'https://www.gesetze-im-internet.de/stpo/__94.html'},
	{id: 'stpo98', text: '§ 98 StPO', url: 'https://www.gesetze-im-internet.de/stpo/__98.html'},
	{id: 'stpo110', text: '§ 110 StPO', url: 'https://www.gesetze-im-internet.de/stpo/__110.html'},
	{id: 'stpo163b', text: '§ 163b StPO', url: 'https://www.gesetze-im-internet.de/stpo/__163b.html'},
	{id: 'hversfg14', text: '§ 14 HVersFG (Wortlaut über gesetze.co; amtlich: Hessenrecht)', url: 'https://gesetze.co/HE/HVersFG/14'},
	{id: 'bverfg2015', text: 'BVerfG, Beschluss vom 24.07.2015 – 1 BvR 2501/13 (PM 72/2015)', url: 'https://www.bundesverfassungsgericht.de/SharedDocs/Pressemitteilungen/DE/2015/bvg15-072.html'},
	{id: 'bverfg2025', text: 'BVerfG, Beschluss vom 09.07.2025 – 1 BvR 975/25 (LTO-Bericht, nur Hintergrund)', url: 'https://www.lto.de/recht/nachrichten/n/1-bvr-975-25-bverfg-beschlagnahme-smartphone-polizei-einsatz-rechtmaessigkeit'},
];
