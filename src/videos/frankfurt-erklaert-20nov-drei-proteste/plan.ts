import type {SceneSpec} from '../../lib/timeline';

/**
 * Szenenplan „Proteste am 20.11.“ (#09): Titelbild mit Tages-Timeline → Schulstreik (Willy-Brandt-Platz) + kleiner Zug am Campus →
 * Gewerkschaftsjugend (Bockenheimer Depot) → Gen Z regelt (Skyline, Weseler Werft laut Stadt) → Forderungen → Auflagen für alle vier →
 * Batman-Gag → Abo-Aufruf mit Logo. Reihenfolge im Ton: 10 → 11 → 17:30 → 14 Uhr (Gen Z als längster Teil); die Orientierungsleiste
 * zeigt dabei immer die chronologische Tagesübersicht. Schnitte an den Adam-Sätzen, Übergänge ≤ 10 Frames.
 */
export const NOV20_SCENES: SceneSpec[] = [
	{id: 'cover', segmentIds: ['hook1', 'hook2'], minSeconds: 3},
	{id: 'schulstreik', segmentIds: ['s1', 's2'], transitionInFrames: 8},
	{id: 'gewerkschaft', segmentIds: ['g1', 'g2'], transitionInFrames: 10},
	{id: 'genz', segmentIds: ['z1', 'z2'], transitionInFrames: 10},
	{id: 'demands', segmentIds: ['z3'], transitionInFrames: 8},
	{id: 'rules', segmentIds: ['z4'], transitionInFrames: 8},
	{id: 'batman', segmentIds: ['b1', 'b2'], transitionInFrames: 10},
	{id: 'outro', segmentIds: ['cta'], transitionInFrames: 8},
];

/** Schlüsselwörter für bildgenaue Einblendungen (Zahlen exakt ohne Satzzeichen, Wörter per Wortanfang). */
export const NOV20_KEYWORDS: Record<string, string[]> = {
	cover: ['Freitag', 'Gen', 'vier', 'getrennte', 'angemeldet'],
	schulstreik: ['10', 'Willy', 'Schulstreik', 'Wehrpflicht', 'Aufruf', 'Krieg', 'Sozialkürzungen', '1.200', 'Ziel', 'Campus', '11', 'kleiner', '75'],
	gewerkschaft: ['17:30', 'Gewerkschaftsjugend', 'Bockenheimer', 'Wehrpflicht', 'Krieg', 'soziale', 'Route', 'prüft'],
	genz: ['14', 'Gen', 'Statt', 'Kundgebung', 'Weseler', '16:30', 'erwartet', '4.000'],
	demands: ['Initiative', 'Bildung', 'Gesundheit', 'bezahlbares', 'Wehrpflicht', 'Sparkurs'],
	rules: ['vier', 'Pyro', 'Alkohol', 'Vermummung'],
	batman: ['Batman', '20', 'wissen', 'nicht', 'Halloween', 'Polizei', 'mitgenommen', 'diesmal', 'ohne'],
	outro: ['Folgt', 'FrankfurtRed3'],
};
