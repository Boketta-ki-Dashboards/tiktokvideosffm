import type {SceneSpec} from '../../lib/timeline';

/**
 * Szenenplan „Gen-Z-Demo am 20.11. geändert!“ (#10): Titelbild → Vorher/Nachher (Demozug → stationäre Kundgebung) → Weseler Werft
 * (Uhrzeit, 4.000 angemeldet) → Auflagen → jetzt fünf Versammlungen (neu: „GenZ regelt Bundesbewegung“) → Sicherheits-Pressekonferenz
 * (Einsatzkräfte, Aufenthaltsverbote/Meldeauflagen, Zeil) → Fazit „nicht abgesagt“ → Abo-Aufruf mit Logo. Hartes Limit 60 s.
 */
export const DEMOUPDATE_SCENES: SceneSpec[] = [
	{id: 'cover', segmentIds: ['hook1', 'hook2'], minSeconds: 3},
	{id: 'change', segmentIds: ['w1'], transitionInFrames: 8},
	{id: 'werft', segmentIds: ['w2', 'w3'], transitionInFrames: 10},
	{id: 'rules', segmentIds: ['a1', 'a2'], transitionInFrames: 8},
	{id: 'five', segmentIds: ['v1', 'v2'], transitionInFrames: 10},
	{id: 'press', segmentIds: ['p1', 'p2', 'p3'], transitionInFrames: 10},
	{id: 'final', segmentIds: ['f1', 'q1'], transitionInFrames: 8},
	{id: 'outro', segmentIds: ['cta'], transitionInFrames: 8},
];

/** Schlüsselwörter für bildgenaue Einblendungen (Zahlen exakt ohne Satzzeichen, Wörter per Wortanfang). */
export const DEMOUPDATE_KEYWORDS: Record<string, string[]> = {
	cover: ['Ewa', 'Freitag', 'anders', 'geplant'],
	change: ['Statt', 'Demozug', 'Stadt', 'stationäre', 'Kundgebung', 'Weseler'],
	werft: ['14', '16:30', 'Dunkelheit', 'Angemeldet', '4.000', 'Planungszahl', 'Teilnehmerzahl'],
	rules: ['Auflagen', 'Pyro', 'Alkohol', 'Glas', 'Hunde', 'Vermummung', 'Transparent', 'zwei'],
	five: ['Neu', 'Innenministerium', 'fünf', 'Darunter', 'Bundesbewegung', '15', 'Hauptbahnhof', 'Bockenheim', '1.500'],
	press: ['Polizei', '2.000', 'Halloween', '1.300', '49', 'Aufenthaltsverbote', '36', 'Meldeauflagen', 'Bedarf', 'Zeil'],
	final: ['Heißt', 'abgesagt', 'anders', 'haltet', 'Änderungen'],
	outro: ['Folgt', 'FrankfurtRed3'],
};
