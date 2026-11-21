import type {SceneSpec} from '../../lib/timeline';

/**
 * Szenenplan „73 Städte – ein Protesttag! Was passiert morgen?“ (#12): Titelbild (große 73 über der Deutschlandkarte) → 2,5D-Deutschlandkarte
 * mit allen 73 Treffpunkten (Kiel–Lörrach, Aachen–Cottbus) und zentral (4, orange) vs. angeschlossen (69, weiß) → Frankfurt vs. Köln (Planungszahlen)
 * → drei Arten von Zahlen (Online-Zusage · Anmeldung/Erwartung · tatsächlich) → Forderungen laut Website → „Welche Stadt wird am größten?“ → Abo-Aufruf.
 * Hartes Limit 60 s inkl. Abo-Aufruf.
 */
export const BUNDESWEIT_SCENES: SceneSpec[] = [
	{id: 'cover', segmentIds: ['hook1', 'hook2'], minSeconds: 3},
	{id: 'map', segmentIds: ['k1', 'z1', 'z2'], transitionInFrames: 6},
	{id: 'compare', segmentIds: ['f1', 'k2', 'n1'], transitionInFrames: 10},
	{id: 'numbers', segmentIds: ['n2', 'n3'], transitionInFrames: 8},
	{id: 'demands', segmentIds: ['d1'], transitionInFrames: 8},
	{id: 'end', segmentIds: ['e1', 'q1'], transitionInFrames: 8},
	{id: 'outro', segmentIds: ['cta'], transitionInFrames: 8},
];

/** Schlüsselwörter für bildgenaue Einblendungen (Zahlen exakt ohne Satzzeichen, Wörter per Wortanfang). */
export const BUNDESWEIT_KEYWORDS: Record<string, string[]> = {
	cover: ['Ewa', 'Morgen', 'Frankfurt', 'listet', '73', 'Städte'],
	map: ['Kiel', 'Lörrach', 'Aachen', 'Cottbus', 'Stand', 'Aber', 'Selbst', 'vier', 'Berlin', 'Frankfurt', 'München', 'Köln', 'anderen', '69', 'angeschlossen', 'lokale', 'zuständig'],
	compare: ['Frankfurt', 'Stadt', '4.000', 'Leute', 'Weseler', 'Köln', 'Anmelderinnen', 'Polizei', '5.000', '10.000', 'Deutzer', 'Innenstadt', 'Wichtig', 'Planungszahlen', 'Zählung'],
	numbers: ['Online-Zusagen', 'Bundesweit', '20.000', 'Garantie', 'kommen', 'wirklich', 'morgen'],
	demands: ['Forderungen', 'Website', 'Bildung', 'bezahlbares', 'Leben', 'Nein', 'Wehrpflicht'],
	end: ['Morgen', 'zeigt', 'groß', 'Protesttag', 'wirklich', 'Welche', 'Stadt', 'größten'],
	outro: ['Folgt', 'FrankfurtRed3'],
};
