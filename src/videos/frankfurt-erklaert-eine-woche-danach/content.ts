/**
 * Inhalte #20 „Eine Woche nach den Gen-Z-Protesten – was ist aus den Ermittlungen geworden?“ (FrankfurtRedNews, produziert 27.11.2026).
 * Alle Zahlen kommen aus `data/staedte.ts` (eine Quelle für Stadtszenen UND Dashboard); hier stehen nur Texte, Etiketten und Quellenzeilen.
 * Belege: references/frankfurt-erklaert-eine-woche-danach/sources.md.
 */
import {RECHERCHE} from './data/staedte';

export const STAND = {date: RECHERCHE.date, time: RECHERCHE.time, label: RECHERCHE.label} as const;

export const COVER = {
	kicker: 'GEN Z: EINE WOCHE DANACH',
	big: 'WAS ERMITTELT DIE POLIZEI?',
	from: '20.11.',
	to: '27.11.',
	days: '7 TAGE',
	tag: '6 STÄDTE · RECHERCHESTAND 27.11.',
	thumb: 'ERMITTLUNGEN · FESTNAHMEN · ANFRAGEN',
} as const;

export const LEIPZIG = {
	tag: 'LEIPZIG · ERMITTLUNGEN',
	label: 'PERSONEN · IDENTITÄT FESTGESTELLT',
	policeWord: 'Polizei nennt sie „Beschuldigte“',
	subgroups: 'DARUNTER',
	teens: 'über 40 Jugendliche',
	kids: '4 Kinder',
	notExtra: 'Teilgruppen – nicht zusätzlich',
	paragraph: '§ 125a StGB',
	suspicion: 'ANFANGSVERDACHT',
	sta: 'Staatsanwaltschaft: schwerer Fall des Landfriedensbruchs',
	delikte: ['Brandstiftung', 'Körperverletzung', 'Sachbeschädigung', 'Hausfriedensbruch'],
	verfahren: 'Zahl der Verfahren: laut Polizei noch nicht abschließend',
	forces: 'rund 800 Einsatzkräfte',
	notGuilty: ['BESCHULDIGTE', 'VERURTEILTE'],
	kidsLaw: ['KINDER UNTER 14', 'STRAFUNMÜNDIG'],
	kidsLawRef: '§ 19 StGB: schuldunfähig, wer bei der Tat noch nicht 14 Jahre alt ist',
} as const;

export const HAMBURG = {
	tag: 'HAMBURG · AUFARBEITUNG',
	main: 'MEHRERE',
	label: 'FESTNAHMEN UND GEWAHRSAMNAHMEN',
	total: 'GESAMTZAHL: ÖFFENTLICH NICHT BEKANNT',
	correction: ['FRÜHERE MELDUNG KORRIGIERT', 'PYROTECHNIK STATT FLASCHEN'],
	correctionBy: 'Bundespolizei, 21.11., 11:07 Uhr',
	headline: 'PARLAMENTARISCHE AUFARBEITUNG',
	docs: [
		{body: 'BÜRGERSCHAFT', nr: 'Drs. 23/6066', kind: 'Kleine Anfrage', by: 'Die Linke', date: '23.11.2026'},
		{body: 'BEZIRKSVERSAMMLUNG MITTE', nr: 'Drs. 23-2220', kind: 'Anfrage', by: 'AfD-Fraktion', date: '23.11.2026'},
	],
	topics: 'FESTNAHMEN – SCHÄDEN – ERMITTLUNGEN',
	noAnswer: 'NOCH OHNE ANTWORT',
} as const;

export const DRESDEN = {
	tag: 'DRESDEN · POLIZEIBILANZ',
	label: 'PERSONEN · PERSONALIEN AUFGENOMMEN',
	notArrests: 'KEINE FESTNAHMEZAHL',
	suspicion: 'VERDACHT U. A. LANDFRIEDENSBRUCH',
	detail: 'laut Polizei: Barrikade + Flaschenwurf am Albertplatz (Verdacht)',
} as const;

export const STUTTGART = {
	tag: 'STUTTGART · FESTNAHMEN',
	label: 'VORLÄUFIGE FESTNAHMEN',
	head: 'VORWÜRFE U. A.',
	charges: ['VERMUMMUNG', 'BELEIDIGUNG', 'WIDERSTAND'],
	note: 'nicht jede Person jeder Vorwurf',
} as const;

export const BERLIN = {
	tag: 'BERLIN · VERLAUF',
	label: 'TEILNEHMENDE LAUT POLIZEI',
	peaceful: 'FRIEDLICHER VERLAUF',
	alt: 'eine Meldung nennt rund 4.500 (laut Polizei)',
} as const;

export const FRANKFURT = {
	tag: 'FRANKFURT · POLIZEIBILANZ',
	scope: 'GESAMTER POLIZEIEINSATZ',
	halloween: '1 Festnahme mit Bezug zum 31.10. – Haftrichter-Entscheidung nicht veröffentlicht',
	noRepeat: 'KEINE EXZESSE WIE AM 31.10.',
} as const;

export const DASHBOARD = {
	tag: 'BUNDESWEIT · ÜBERSICHT',
	kicker: '20. NOVEMBER 2026 · RECHERCHESTAND 27.11.',
	title: 'GEN-Z-PROTESTE: DIE BILANZ',
	hint: ['Unterschiedliche polizeiliche Kategorien – nicht direkt vergleichbar', 'Beschuldigte sind keine Verurteilten · Meldestände je Stadt unterschiedlich'],
} as const;

export const OUTRO = {line: 'FÜR MEHR NACHRICHTEN AUS FRANKFURT'} as const;

/** Quellenzeile UNTER den Untertiteln (y 1.512–1.630), wechselt mit dem Sprechersegment. */
export const SOURCE_LINE = [
	{from: 'o1', text: `Recherchestand ${STAND.date}, ${STAND.time} Uhr · Polizei, Staatsanwaltschaften, Parlamente, Medien – Meldestände 20.–23.11.`},
	{from: 'l1', text: 'Polizei Sachsen (PD Leipzig), Ergänzungsmeldung Nr. 417/26 vom 21.11.2026'},
	{from: 'l3', text: '§ 19 StGB (gesetze-im-internet.de) · keine Rechtsberatung'},
	{from: 'h1', text: 'NDR 21.11.2026 · Bundespolizei Hamburg, Korrektur 21.11.2026, 11:07 Uhr'},
	{from: 'h2', text: 'Hamburgische Bürgerschaft Drs. 23/6066 · Bezirksversammlung Hamburg-Mitte Drs. 23-2220 (beide 23.11.2026)'},
	{from: 'd1', text: 'Polizeidirektion Dresden, Medieninformation Nr. 581/26 vom 20.11.2026'},
	{from: 's1', text: 'Polizeipräsidium Stuttgart, Pressemitteilung vom 20.11.2026, 22:47 Uhr'},
	{from: 'b1', text: 'tagesschau 21.11.2026 · Tagesspiegel (dpa) 20.11.2026 – jeweils Polizeiangaben'},
	{from: 'f1', text: 'Hessisches Innenministerium, Bilanz vom 21.11.2026'},
	{from: 'z1', text: `Meldestände je Stadt (20.–23.11.) · keine Summe, keine Rangliste · Recherchestand ${STAND.date}`},
	{from: 'cta', text: `Recherchestand ${STAND.date}, ${STAND.time} Uhr`},
] as const;
