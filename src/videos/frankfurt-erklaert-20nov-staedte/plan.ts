import type {SceneSpec} from '../../lib/timeline';

/**
 * Szenenplan „Gen-Z-Proteste in anderen Städten“ (#15): Titelbild über der 2,5D-Deutschlandkarte → Hamburg (Demo | nach dem Ende) →
 * Leipzig (Demo | nach dem Ende, Wasserwerfer, 5 Verletzte, >200 Identitäten) → Berlin · Stuttgart · Bremen → Frankfurt + Einordnung
 * (Legende friedlich / während / danach) → Frage + Abo-Aufruf. Hartes Limit 60 s.
 */
export const STAEDTE_SCENES: SceneSpec[] = [
	{id: 'cover', segmentIds: ['hook1', 'hook2'], minSeconds: 1},
	{id: 'hamburg', segmentIds: ['h1', 'h2'], transitionInFrames: 8},
	{id: 'leipzig', segmentIds: ['l1', 'l2', 'l3'], transitionInFrames: 8},
	{id: 'mehr', segmentIds: ['b1', 's1', 'r1'], transitionInFrames: 8},
	{id: 'vergleich', segmentIds: ['f1', 'z1'], transitionInFrames: 8},
	{id: 'outro', segmentIds: ['q1', 'cta'], transitionInFrames: 8},
];

/** Schlüsselwörter für bildgenaue Einblendungen (Zahlen exakt ohne Satzzeichen, Wörter per Wortanfang). */
export const STAEDTE_KEYWORDS: Record<string, string[]> = {
	cover: ['Ewa', 'Frankfurt', 'Freitag', 'anderen', 'Städten'],
	hamburg: ['Hamburg', '4.000', 'Dammtor', 'Schanze', 'friedlich', 'Ende', 'Pyrotechnik', 'Eier', 'Gewahrsam'],
	leipzig: ['Leipzig', '2.500', 'Ring', 'Ende', 'Ausschreitungen', 'Wasserwerfer', 'fünf', 'Beamte', '200', 'Personen', 'Landfriedensbruchs'],
	mehr: ['Berlin', 'Alexanderplatz', 'Kreuzberg', 'Vorkommnisse', 'Stuttgart', 'gestoppt', 'zwanzig', 'Festnahmen', 'Bremen', 'Farbe', 'Versuch', 'Auto'],
	vergleich: ['Frankfurt', 'Innenminister', 'Halloween-Bilder', 'wiederholt', 'Wichtig', 'Nicht', 'alle', 'Ausschreitungen'],
	outro: ['Freitag', 'erlebt', 'Folgt', 'FrankfurtRed3'],
};
