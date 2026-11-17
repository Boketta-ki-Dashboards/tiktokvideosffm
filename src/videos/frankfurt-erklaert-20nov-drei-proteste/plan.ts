import type {SceneSpec} from '../../lib/timeline';

/**
 * Szenenplan „Proteste am 20.11.“ (#09, überarbeitet 17.11. auf Wunsch des Kanalbetreibers): Titelbild mit Tages-Timeline → chronologisch je
 * ein eigener Punkt: Schulstreik 10:00 (Willy-Brandt-Platz) → kleiner Zug 11:00 (Campus Westend, OSM-Karte) → Gen Z regelt 14:00 (Skyline,
 * Weseler Werft, Forderungen – längster Teil) → Gewerkschaftsjugend 17:30 (Bockenheimer Depot) → Auflagen für alle vier → Batman (Younes'
 * eigene TikTok-Erzählung „20.11 Hausarrest“) → Abo-Aufruf mit Logo. Die Orientierungsleiste läuft nur vorwärts (Haken für Erledigtes).
 */
export const NOV20_SCENES: SceneSpec[] = [
	{id: 'cover', segmentIds: ['hook1', 'hook2'], minSeconds: 3},
	{id: 'schulstreik', segmentIds: ['s1', 's2'], transitionInFrames: 8},
	{id: 'campus', segmentIds: ['c1'], transitionInFrames: 10},
	{id: 'genz', segmentIds: ['z1', 'z2'], transitionInFrames: 10},
	{id: 'demands', segmentIds: ['z3'], transitionInFrames: 8},
	{id: 'gewerkschaft', segmentIds: ['g1', 'g2'], transitionInFrames: 10},
	{id: 'rules', segmentIds: ['z4'], transitionInFrames: 8},
	{id: 'batman', segmentIds: ['b1', 'b2', 'b3', 'b4', 'b5'], transitionInFrames: 10},
	{id: 'outro', segmentIds: ['cta'], transitionInFrames: 8},
];

/** Schlüsselwörter für bildgenaue Einblendungen (Zahlen exakt ohne Satzzeichen, Wörter per Wortanfang). */
export const NOV20_KEYWORDS: Record<string, string[]> = {
	cover: ['Freitag', 'Gen', 'vier', 'getrennte', 'angemeldet'],
	schulstreik: ['10', 'Willy', 'Schulstreik', 'Wehrpflicht', 'Aufruf', 'Krieg', 'Sozialkürzungen', '1.200', 'Ziel', 'Campus'],
	campus: ['Dort', '11', 'Internationale', '75', 'quer', 'Campus', 'Stadt', 'Schulstreik'],
	genz: ['14', 'Gen', 'Statt', 'Kundgebung', 'Weseler', '16:30', 'erwartet', '4.000'],
	demands: ['Initiative', 'Bildung', 'Gesundheit', 'bezahlbares', 'Wehrpflicht', 'Sparkurs'],
	gewerkschaft: ['17:30', 'Gewerkschaftsjugend', 'Bockenheimer', 'Wehrpflicht', 'Krieg', 'soziale', 'Route', 'prüft'],
	rules: ['vier', 'Pyro', 'Alkohol', 'Vermummung'],
	batman: ['Batman', 'Halloween', 'TikTok', 'gemeldet', 'Younes', 'Polizei', 'geklingelt', '20', 'Frankfurt', 'zweimal', 'Video', 'Hausarrest', 'Freitag', 'schlecht', 'ohne'],
	outro: ['Folgt', 'FrankfurtRed3'],
};
