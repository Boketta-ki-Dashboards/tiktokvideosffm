import type {SceneSpec} from '../../lib/timeline';

/**
 * Szenenplan „Nur 13 Demonstranten?“: Titelbild (13 + Mannschaftswagen) → Gegenüberstellung 16 Wagen / 13 Menschen (zwei Orte) →
 * Karte Hauptwache · Bockenheimer Warte · Bereitstellung → Datumschaos (Kalender + stilisierte Website) → Vorbereitung vs. Verlauf
 * (Zeil) → 20.11. + Frage → Abo-Aufruf mit Logo. Schnitte an den Adam-Sätzen, Übergänge ≤ 10 Frames.
 * Längen-Ausnahme (Wunsch Kanalbetreiber): Informationsteil ≤ 61,5 s, danach `cta`, gesamt ≤ 64 s.
 */
export const DEMO13_SCENES: SceneSpec[] = [
	{id: 'cover', segmentIds: ['hook1', 'hook2'], minSeconds: 3},
	{id: 'contrast', segmentIds: ['hook3'], transitionInFrames: 8},
	{id: 'map', segmentIds: ['hw1', 'hw2', 'bw1'], transitionInFrames: 10},
	{id: 'calendar', segmentIds: ['why', 'd1', 'd2', 'd3', 'd4'], transitionInFrames: 10},
	{id: 'police', segmentIds: ['p1', 'p2'], transitionInFrames: 10},
	{id: 'next', segmentIds: ['n1', 'q1'], transitionInFrames: 10},
	{id: 'outro', segmentIds: ['cta'], transitionInFrames: 8},
];

/** Schlüsselwörter für bildgenaue Einblendungen (Zahlen exakt, Wörter per Wortanfang). */
export const DEMO13_KEYWORDS: Record<string, string[]> = {
	cover: ['Ewa', 'Samstag', 'Frankfurter', '16', 'Mannschaftswagen', 'bereit'],
	contrast: ['zwei', 'Kundgebungen', 'zusammen', '13', 'Leute'],
	map: ['Hauptwache', 'zehn', '14', 'Schluss', 'Teilnehmer', 'Demo', '20', 'hinweisen', 'Bockenheimer', 'drei', 'Polizei', 'Anmelder'],
	calendar: ['Warum', 'Halloween', '14', 'Website', 'weg', 'nächster', '20', 'Später', 'Aktionstag', 'Polizei', 'Freitag', 'Hin', 'belegt'],
	police: ['Polizei', 'vorgesorgt', 'Störungen', 'Absperrgitter', 'nötig', 'Zeil', 'ruhig'],
	next: ['20', 'bundesweit', 'Frankfurt', 'meint', 'Terminchaos', 'Werbeaktion'],
	outro: ['Folgt', 'FrankfurtRed3'],
};
