import type {SceneSpec} from '../../lib/timeline';

/**
 * Szenenplan „Gen Z regelt – Phase 2“: Titelbild (Deutschlandkarte) → drei Städte (2,5D-Kamerafahrt) → Berlin (Zahlen +
 * Strecke auf der perspektivischen Karte) → Zwischenfälle (stilisiert) → Bilanz → 20.11. → Frage + Abo-Aufruf.
 * Schnitte an den Adam-Sätzen, Übergänge ≤ 10 Frames. Hartes Limit 60,0 s inkl. Abo-Aufruf (keine Längen-Ausnahme).
 */
export const PHASE2_SCENES: SceneSpec[] = [
	{id: 'cover', segmentIds: ['hook1', 'hook2'], minSeconds: 3},
	{id: 'cities', segmentIds: ['bremen', 'karlsruhe', 'stuttgart'], transitionInFrames: 10},
	{id: 'berlin', segmentIds: ['berlin1', 'berlin2'], transitionInFrames: 10},
	{id: 'incidents', segmentIds: ['inc1', 'inc2'], transitionInFrames: 10},
	{id: 'stats', segmentIds: ['stats', 'charges', 'context'], transitionInFrames: 8},
	{id: 'next', segmentIds: ['ffm'], transitionInFrames: 10},
	{id: 'outro', segmentIds: ['q1', 'cta'], transitionInFrames: 8},
];

/** Schlüsselwörter für bildgenaue Einblendungen (Zahlen exakt, Wörter per Wortanfang). */
export const PHASE2_KEYWORDS: Record<string, string[]> = {
	cover: ['Ewa', 'Gestern', 'Städten', 'Phase'],
	cities: ['Bremen', '670', 'friedlich', 'Karlsruhe', '220', 'weitgehend', 'Stuttgart', 'Hundert', 'Demozug', 'untersagt'],
	berlin: ['Berlin', 'Krass', 'Angemeldet', '100', 'gekommen', '1.200', '700', 'Polizisten', 'Savignyplatz', "Ku'damm", 'Halensee'],
	incidents: ['Polizei', 'Teilnehmende', 'Polizeikette', 'durchbrechen', 'Später', 'Pyrotechnik', 'Auseinandersetzungen', 'Festnahmen'],
	stats: ['Bilanz', '20', 'Festnahmen', '28', 'Strafanzeigen', 'drei', 'Polizisten', 'Vorwürfe', 'Landfriedensbruch', 'Widerstand', 'betrifft', 'nicht', 'festgenommen', 'verurteilt'],
	next: ['20. November', 'Jugendproteste', 'angekündigt', 'Frankfurt'],
	outro: ['Wie', 'Berlin', 'Folgt', 'FrankfurtRed3'],
};
