/**
 * Inhalte „Über 2.150 Kontrollen auf der Zeil – was hat die Polizei gefunden?“ (Format B #13, produziert 19.11.2026).
 * Jede Angabe mit Quelle; wörtliche Belege in references/frankfurt-erklaert-2150-kontrollen/sources.md.
 *
 * Hauptquelle: Hessisches Innenministerium, Pressemitteilung „Appell zur friedlichen Demonstration“, 18.11.2026 (Bilanz seit 01.11.2026).
 * Leitplanken: kontrolliert ≠ tatverdächtig/schuldig · Anzeige ≠ Verurteilung · Ordnungswidrigkeit ≠ Straftat · Platzverweis ≠ Festnahme ·
 * Zahlen nicht addieren · Gegenstände ohne behaupteten Demo-Bezug · Kritik und Bewertung als POSITION.
 */

export const STAND = 'Stand: Bilanz des Innenministeriums vom 18.11.2026';

/** Wörtliche Kernsätze (Tests prüfen, dass sources.md sie enthält). */
export const QUOTES = {
	bilanz: 'Seit dem 01. November wurden über 2.150 Personen kontrolliert, 78 Strafanzeigen gefertigt, 435 Ordnungswidrigkeiten festgestellt, 182 Platzverweise erteilt',
	items: 'mehrere Messer, mehrere Sturmhauben, mehrere Pfefferpistolen, mehrere Tierabwehrsprays, eine Axt, drei Teleskopschlagstöcke sowie mehrere für die Begehung von Einbrüchen geeignete Werkzeuge sichergestellt',
	unbescholtene: 'Dass auch Unbescholtene in Kontrollen hineingeraten können, lässt sich nicht ausschließen.',
	gewinn: 'Die BAO Zeil ist ein Sicherheitsgewinn für Frankfurt',
	zwei: 'Zwei Personen, die im Verdacht stehen, an den Krawallen vom 31. Oktober beteiligt gewesen zu sein, seien infolge der Kontrollen identifiziert worden.',
	neunundneunzig: 'Mittlerweile seien 99 Tatverdächtige ermittelt worden.',
	weiter: 'Poseck betonte, dass die Kontrollen auf der Zeil unabhängig vom Verlauf der Demonstrationen am Freitag weiter fortgesetzt werden sollen.',
	herkunft: '"Es geht nicht um Herkunft, es geht um Verhalten"',
	kritik: 'Der Vorwurf: Es handle sich um Racial Profiling',
} as const;

export const COVER = {
	big: '2.150+',
	card: 'POLIZEIKONTROLLEN AUF DER ZEIL',
	question: 'WAS HAT DIE POLIZEI GEFUNDEN?',
	small: 'SEIT 1. NOVEMBER 2026 · LAUT INNENMINISTERIUM',
	thumb: 'BILANZ VOM 18.11.2026',
};

export const CONTROLS = {
	value: 2150,
	plus: '+',
	label: 'KONTROLLIERTE PERSONEN',
	since: 'SEIT 1. NOVEMBER',
	stamp: 'KONTROLLIERT ≠ SCHULDIG',
	stampSub: 'nicht automatisch tatverdächtig · nicht festgenommen',
	quote: '„Dass auch Unbescholtene in Kontrollen hineingeraten können, lässt sich nicht ausschließen.“',
	quoteBy: 'Innenminister Roman Poseck, 18.11.2026',
};

export type StatId = 'anzeigen' | 'owi' | 'platzverweise';
export const STATS: {id: StatId; value: number; title: string; meaning: string; not: string; word: string}[] = [
	{id: 'anzeigen', value: 78, title: 'STRAFANZEIGEN', meaning: 'möglicher Straftatbestand erfasst', not: '≠ VERURTEILUNG', word: '78'},
	{id: 'owi', value: 435, title: 'ORDNUNGSWIDRIGKEITEN', meaning: 'Verstöße unterhalb einer Straftat', not: '≠ STRAFTAT', word: '435'},
	{id: 'platzverweise', value: 182, title: 'PLATZVERWEISE', meaning: 'Ort für eine Zeit verlassen', not: '≠ FESTNAHME', word: '182'},
];
export const NO_SUM = {title: 'NICHT ADDIEREN', sub: 'eine Person kann mehrfach erfasst sein'};

export type ItemId = 'messer' | 'pfeffer' | 'sturmhaube' | 'axt' | 'spray' | 'stock' | 'werkzeug';
/** Sichergestellte Gegenstände – Mengen exakt wie in der Pressemitteilung („mehrere“, „eine“, „drei“). */
export const ITEMS: {id: ItemId; name: string; qty: string; word?: string}[] = [
	{id: 'messer', name: 'MESSER', qty: 'MEHRERE', word: 'Messer'},
	{id: 'pfeffer', name: 'PFEFFER-\nPISTOLEN', qty: 'MEHRERE', word: 'Pfefferpistolen'},
	{id: 'sturmhaube', name: 'STURM-\nHAUBEN', qty: 'MEHRERE', word: 'Sturmhauben'},
	{id: 'axt', name: 'AXT', qty: '1', word: 'Axt'},
	{id: 'spray', name: 'TIERABWEHR-\nSPRAYS', qty: 'MEHRERE'},
	{id: 'stock', name: 'TELESKOP-\nSCHLAGSTÖCKE', qty: '3'},
	{id: 'werkzeug', name: 'EINBRUCHS-\nWERKZEUG', qty: 'MEHRERE'},
];
export const ITEMS_NOTE = 'Sichergestellt bei den Kontrollen seit 1.11. – kein belegter Bezug zur Demo am 20.11.';

export const SUSPECTS = {
	two: {value: 2, title: 'TATVERDÄCHTIGE IDENTIFIZIERT', sub: 'Krawalle vom 31. Oktober · durch die Zeil-Kontrollen', by: 'laut hessenschau / Polizeiangaben'},
	total: {value: 99, title: 'TATVERDÄCHTIGE INSGESAMT ERMITTELT', by: 'laut Polizeipräsident (hessenschau, 18.11.)'},
	note: 'VERDACHT ≠ SCHULD',
	notAll: 'Die 2 sind NICHT die ganze Halloween-Bilanz',
};

export const DEBATE = {
	left: {kicker: 'INNENMINISTER', title: 'SICHERHEITS-\nGEWINN', quote: '„Ich halte diese Kontrollintensität in Frankfurt gegenwärtig für notwendig.“', by: 'Roman Poseck (laut hessenschau)'},
	right: {kicker: 'KRITIK AUS DER STADTPOLITIK', title: 'KONTROLLEN\nNACH AUSSEHEN?', sub: 'Vorwurf: Racial Profiling · u. a. Stadtverordnete von SPD und Linke'},
	reply: {title: 'ZURÜCKGEWIESEN', quote: '„Es geht nicht um Herkunft, es geht um Verhalten.“', by: 'Poseck · Polizei und Ministerium weisen den Vorwurf zurück'},
	next: 'KONTROLLEN SOLLEN WEITERGEHEN',
	nextSub: 'auch nach Freitag, 20.11. – laut Poseck',
};

export const OUTRO = {question: 'SINNVOLLE VORSORGE ODER ZU VIEL KONTROLLE?', sub: 'Schreibt es in die Kommentare', cta: 'FOLGEN FÜR MEHR', ctaSub: 'FRANKFURT ERKLÄRT · IN 60 SEKUNDEN'};

/** Quellenzeile unter den Untertiteln (kurze Labels, wechseln mit dem Sprechersegment). */
export const SOURCE_LINE = [
	{from: 'z1', text: 'Hessisches Innenministerium, Pressemitteilung vom 18.11.2026 · Kontrollen seit 01.11.'},
	{from: 'z2', text: 'Innenminister Poseck, Pressemitteilung vom 18.11.2026'},
	{from: 'b1', text: 'Hessisches Innenministerium · Bilanz vom 18.11.2026 (seit 01.11.)'},
	{from: 'g1', text: 'Hessisches Innenministerium, 18.11.2026 · Gegenstände laut Pressemitteilung'},
	{from: 'h1', text: 'hessenschau, 18.11.2026 (Angaben der Polizei)'},
	{from: 'h2', text: 'hessenschau, 18.11.2026 · Polizeipräsident Stefan Müller'},
	{from: 'p1', text: 'Innenminister Poseck, Pressemitteilung vom 18.11.2026'},
	{from: 'p2', text: 't-online, 16.11.2026 · Die Linke im Römer, 04.11. · hessenschau, 18.11.'},
	{from: 'w1', text: 'hessenschau, 18.11.2026 (aktualisiert 19.11.)'},
	{from: 'q1', text: 'Stand aller Angaben: 18./19.11.2026 · keine neuere Bilanz veröffentlicht'},
] as const;
