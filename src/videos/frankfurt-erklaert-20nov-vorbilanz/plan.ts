import type {SceneSpec} from '../../lib/timeline';

/**
 * Szenenplan „Frankfurt 20.11. – Vorbilanz“ (#14): Titelbild mit Tages-Zeitleiste (Meldungszeiten) → Weseler Werft 2,5D (4.000 erwartet →
 * 20–30 vor Ort → vorzeitig beendet) → Split-Screen Ortsgruppe vs. Bundesbewegung → Demozug-Karte Hbf → Taunusanlage → Alte Oper →
 * Bockenheimer Depot (nur gemeldete Punkte) mit Zähler → Erwartung vs. tatsächlich (getrennt, nicht addiert) → Polizei → offen + Abo-Aufruf.
 */
export const VORBILANZ_SCENES: SceneSpec[] = [
	{id: 'cover', segmentIds: ['hook1', 'hook2'], minSeconds: 1},
	{id: 'werft', segmentIds: ['w1', 'w2'], transitionInFrames: 8},
	{id: 'streit', segmentIds: ['k1', 'k2', 'k3', 'k4'], transitionInFrames: 8},
	{id: 'zug', segmentIds: ['d1', 'd2', 'd3'], transitionInFrames: 8},
	{id: 'zahlen', segmentIds: ['e1', 'e2'], transitionInFrames: 8},
	{id: 'polizei', segmentIds: ['p1'], transitionInFrames: 8},
	{id: 'outro', segmentIds: ['o1', 'q1', 'cta'], transitionInFrames: 8},
];

/** Schlüsselwörter für bildgenaue Einblendungen (Zahlen exakt ohne Satzzeichen, Wörter per Wortanfang). */
export const VORBILANZ_KEYWORDS: Record<string, string[]> = {
	cover: ['Ewa', 'Frankfurt', 'erste', 'Bilanz', 'Protesttag'],
	werft: ['Weseler', 'Werft', '4.000', 'erwartet', 'Reportern', '20', '30', 'schnell', 'Schluss'],
	streit: ['Grund', 'Zoff', 'Ortsgruppe', 'Stadt', 'Kundgebung', 'Bundesbewegung', 'Demozug', 'Hauptbahnhof', 'Ordner', 'Equipment', 'gestrichen'],
	zug: ['Zug', 'startete', 'halbe', 'spät', 'Alte', 'Oper', 'Bockenheim', 'angekommen', 'Stunde', 'Polizei', '1.000', 'Teilnehmenden'],
	zahlen: ['Erwartet', '1.500', 'Bundesbewegung', '5.000', 'Schulstreik', 'Vormittag', '600'],
	polizei: ['Polizei', 'friedlich', 'Demozug', 'Pyrotechnik', 'gezündet'],
	outro: ['offizielle', 'Bilanz', 'aus', 'dabei', 'Schreibt', 'Folgt', 'FrankfurtRed3'],
};
