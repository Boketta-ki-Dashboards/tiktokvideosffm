/**
 * Inhalte „Frankfurt am 20. November – wieder Eskalation?“ (FrankfurtNov20Forecast).
 * Status jeder Aussage: FAKT (mit Quelle) · EINSCHÄTZUNG (unsere Prognose) · FIKTION (Witz).
 * Belege: references/frankfurt-2026-11-20-ausblick/sources.md (Recherche-Stand 06.11.2026).
 */
export const STAND = '06.11.2026';

export const HOOK = {
	before: '31.10.2026',
	after: '20.11.2026',
	question: 'WIEDER HALLOWEEN 2.0?',
	fact: 'Gen Z regelt ruft zum Protest auf – und distanziert sich von Gewalt',
	factSource: 'genz-regelt.de / Telegram-Kanal, Abruf 06.11.2026',
	opinion: 'Diesmal könnte einiges anders laufen',
};

export const HALLOWEEN = {
	left: {date: '31.10.', label: 'Halloween', tags: ['Demo + Halloween-Feiernde', 'viele verkleidet', 'volle Innenstadt']},
	right: {date: '20.11.', label: 'Freitag im November', tags: ['kein Halloween', 'normaler Alltag']},
	disclaimer: 'Verkleidet ≠ Randalierer',
	opinion: 'Lage leichter zu überblicken?',
	source: 'hessenschau 28.10.2026 („Kostüm oder Vermummung?“)',
};

export const POLICE = {
	quote: 'Die Polizei wird bei etwaigen weiteren Versammlungen mit einem noch stärkeren Aufgebot im Einsatz sein',
	quoteFrom: 'Innenminister Roman Poseck · Hessisches Innenministerium, 02.11.2026',
	banQuestion: 'VERSAMMLUNGSVERBOT?',
	banStatus: 'Verbot diskutiert – entschieden ist nichts (Stand 06.11.2026)',
	deterrence: 'Abschreckung möglich – keine Garantie',
	law: 'Art. 8 GG: friedlicher Protest geschützt',
	source: 'innen.hessen.de 02.11.2026 · hessenschau 02.11.2026 · taz',
};

export const SHOPS = {
	fact: 'Vor Halloween: zahlreiche Geschäfte mit Holzplatten gesichert',
	factSource: 'hessenschau 29./30.10.2026',
	options: [
		{id: 'boards', label: 'Holzplatten'},
		{id: 'security', label: 'Security'},
		{id: 'close', label: 'früher schließen'},
	],
	maybe: 'Mögliche Vorbereitung',
	affected: ['Snipes', '11teamsports'],
	affectedNote: 'am 31.10. betroffen – Pläne für den 20.11. nicht bekannt',
};

export const SUMMARY = {
	factors: [
		{id: 'f1', title: 'Kein Halloween-Trubel', kind: 'EINSCHÄTZUNG'},
		{id: 'f2', title: 'Stärkeres Polizeiaufgebot', kind: 'ANGEKÜNDIGT'},
		{id: 'f3', title: 'Läden besser vorbereitet?', kind: 'EINSCHÄTZUNG'},
	],
	verdict: 'WENIGER ESKALATION MÖGLICH',
	caveat: 'keine Garantie · keine Prognose in Prozent',
};

export const TWIST = {
	question: 'UND WER GEWINNT AM 20.11.?',
	losers: ['Politik', 'Polizei'],
	company: 'Frankfurt Fenster-Schutz GmbH',
	fictional: 'Erfundene Firma – nur ein Witz',
};

export const QUESTION = {
	title: '20.11. – WAS GLAUBT IHR?',
	options: ['Deutlich ruhiger', 'Wieder Eskalation?'],
	hint: 'Schreibt’s in die Kommentare',
};
