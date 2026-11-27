import type {SceneSpec} from '../../lib/timeline';

/**
 * Szenenplan #18 „Gen Z regelt Frankfurt – was soll sich am 12. Dezember ändern?“: Titelbild (Kalender 31.10. · 20.11. → 12.12.) → TikTok-Beitrag
 * (Handy, Aussage der Gruppe) → Kritik an kurzfristiger Planung (Ordner, Technik, Route, 3 Tage vorher) → Kommunikation/Polizei (Chat geschlossen,
 * neutrale Kontrolle auf der Zeil, Aussage vs. Innenministerium) → Planungstreffen im DGB-Haus (aufwendigste Szene: Haus am Abend, Saal A,
 * Stuhlkreis, Flipchart, „Ergebnisse nicht öffentlich bekannt“) → Abstimmung? (zwei Strukturen, Rückblick 20.11.) → 12.12. Gallusanlage (OSM,
 * Bankenviertel) vs. Website „Standort folgt“ → Stufen (angekündigt / Anmeldung ? / Behörde ? / Zusammenarbeit offen) → Schlussfrage → Abo-Aufruf.
 */
export const PLANUNG_SCENES: SceneSpec[] = [
	{id: 'cover', segmentIds: ['hook1', 'hook2'], minSeconds: 1},
	{id: 'beitrag', segmentIds: ['a1'], transitionInFrames: 8},
	{id: 'orga', segmentIds: ['b1'], transitionInFrames: 8},
	{id: 'polizei', segmentIds: ['c1', 'c2'], transitionInFrames: 8},
	{id: 'treffen', segmentIds: ['d1', 'd2', 'd3'], transitionInFrames: 8},
	{id: 'abstimmung', segmentIds: ['e1', 'e2'], transitionInFrames: 8},
	{id: 'termin', segmentIds: ['f1', 'f2'], transitionInFrames: 8},
	{id: 'offen', segmentIds: ['g1'], transitionInFrames: 8},
	{id: 'frage', segmentIds: ['q1'], transitionInFrames: 8},
	{id: 'outro', segmentIds: ['cta'], transitionInFrames: 8},
];

/** Schlüsselwörter für bildgenaue Einblendungen (Zahlen exakt ohne Satzzeichen, Wörter per Wortanfang). */
export const PLANUNG_KEYWORDS: Record<string, string[]> = {
	cover: ['Ewa', 'Frankfurt', 'Gen-Z-Demos', 'ändern'],
	beitrag: ['Frankfurter', 'Gruppe', 'TikTok', 'Organisation', '31', '20'],
	orga: ['Infos', 'spät', 'Ordner', 'Technik', 'Route', 'kurz'],
	polizei: ['Telegram', 'Polizei', 'Jugendliche', 'Hunderten', 'wahllos', 'Innenministerium', 'Verhalten', 'Herkunft'],
	treffen: ['Ansatz', 'Dienstagabend', 'offenen', 'Planungstreffen', 'DGB-Haus', 'zwei', 'Wochen', 'besprochen', 'bekannt'],
	abstimmung: ['Frankfurter', 'Bundesinitiative', 'besser', '20', 'getrennte', 'Kundgebung', 'Weseler', 'Zug'],
	termin: ['12', 'Dezember', '14', 'Uhr', 'Gallusanlage', 'Bundesinitiative', 'Standort', 'folgt'],
	offen: ['angemeldet', 'öffentlich', 'bekannt'],
	frage: ['nächste', 'Demo', 'besser', 'organisiert', 'offen'],
	outro: ['Nachrichten', 'Frankfurt', 'folgt', 'FrankfurtRedNews'],
};
