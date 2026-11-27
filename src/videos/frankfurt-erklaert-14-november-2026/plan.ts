import type {SceneSpec} from '../../lib/timeline';

/**
 * Szenenplan Sondervideo 14.11.: Titelbild (Kalender) → Website: erst genannt, dann entfernt, dann doch Aktionstag →
 * Hauptwache → drei getrennte Versammlungen (Karte) → Polizei-Einsatzkonzept → 20.11. → Frage + Abo-Aufruf.
 * Schnitte an den Adam-Sätzen, Übergänge ≤ 10 Frames. Längen-Ausnahme: Informationsteil ≤ 61,5 s, danach `cta`.
 */
export const NOV14_SCENES: SceneSpec[] = [
	{id: 'cover', segmentIds: ['hook1', 'hook2'], minSeconds: 3},
	{id: 'website', segmentIds: ['w1', 'w2', 'w3', 'w4'], transitionInFrames: 10},
	{id: 'hauptwache', segmentIds: ['f1', 'f2'], transitionInFrames: 10},
	{id: 'venues', segmentIds: ['m1', 'm2'], transitionInFrames: 10},
	{id: 'police', segmentIds: ['p1', 'p2', 'p3'], transitionInFrames: 10},
	{id: 'next', segmentIds: ['n1'], transitionInFrames: 10},
	{id: 'outro', segmentIds: ['q1', 'cta'], transitionInFrames: 8},
];

/** Schlüsselwörter für bildgenaue Einblendungen (Zahlen exakt, Wörter per Wortanfang). */
export const NOV14_KEYWORDS: Record<string, string[]> = {
	cover: ['Ewa', 'gestrichen', 'warum', 'Kundgebung'],
	website: ['Halloween', 'Website', 'weg', 'bald', 'Nächstes', 'Inzwischen', 'Aktionstag', 'Motto'],
	hauptwache: ['Polizei', 'Hauptwache', 'angekündigt', 'Bilanz', 'Redaktionsschluss'],
	venues: ['Bockenheimer', 'Warte', 'größte', 'Goetheplatz', 'Erwartete', 'Irankonflikt', 'keine'],
	police: ['Polizei', 'Kräfte', 'Halloween', 'Verstärkung', 'Bedarf', 'Zugänge', 'Zeil', 'Absperrgitter', 'Konkrete', 'Hinweise', 'nicht'],
	next: ['Schulstreik', 'Demo', 'Gewerkschaftsjugend', 'angekündigt'],
	outro: ['Wie', 'erlebt', 'Folgt', 'FrankfurtRed3', 'Entwicklungen'],
};
