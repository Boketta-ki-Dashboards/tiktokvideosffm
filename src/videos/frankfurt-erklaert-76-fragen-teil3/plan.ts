import type {SceneSpec} from '../../lib/timeline';

/**
 * Szenenplan „76 Fragen – Teil 3“: eine Szene je Frage, Schnitte an den Adam-Sätzen, kurze Übergänge (≤ 10 Frames),
 * damit die nächste Grafik mit dem neuen Satz einsetzt. Das Titelbild ist die erste Szene. Gesamtlänge ≤ 60 s.
 */
export const TEIL3_SCENES: SceneSpec[] = [
	{id: 'cover', segmentIds: ['hook1', 'hook2'], minSeconds: 3},
	{id: 'forecast', segmentIds: ['q1a', 'q1b', 'q1c'], transitionInFrames: 10},
	{id: 'phases', segmentIds: ['q2a', 'q2b', 'q2c'], transitionInFrames: 10},
	{id: 'under14', segmentIds: ['q3a', 'q3b', 'q3c', 'q3d'], transitionInFrames: 10},
	{id: 'damage', segmentIds: ['q4a', 'q4b', 'q4c', 'q4d'], transitionInFrames: 10},
	{id: 'outro', segmentIds: ['end'], transitionInFrames: 8},
];

/** Schlüsselwörter für bildgenaue Einblendungen (Zahlen exakt, Wörter per Wortanfang). */
export const TEIL3_KEYWORDS: Record<string, string[]> = {
	cover: ['Ewa', '76', 'vier', 'offen'],
	forecast: ['Polizei', 'erwartete', '2.000', 'Gekommen', 'viermal', 'Warum', 'Prognose', 'Einsatz', 'unklar'],
	phases: ['Innenminister', 'Gewalt', 'Auflösung', 'sechs', 'schwer', 'insgesamt', '181', 'Mehrheit', 'friedlich'],
	under14: ['Zwei', 'Tatverdächtige', '14', 'strafunmündig', 'bestraft', 'Jugendamt', 'Schadenersatz', 'Eltern', 'automatisch'],
	damage: ['Wer', 'Schäden', 'Stadt', 'Händlern', 'Versicherungen', 'Reicht', 'prüft', 'Zusage', 'Gesamtschaden', 'beziffert'],
	outro: ['geklärt', 'offen', 'Welche', 'wichtigsten'],
};
