import type {SceneSpec} from '../../lib/timeline';

/** Szenenplan „20. November – wieder Eskalation?“: Schnitte folgen den Adam-Sätzen (buildTimeline). */
export const NOV20_SCENES: SceneSpec[] = [
	{id: 'hook', segmentIds: ['hook1', 'hook2', 'hook3'], minSeconds: 6},
	{id: 'halloween', segmentIds: ['hal1', 'hal2', 'hal3'], transitionInFrames: 16},
	{id: 'police', segmentIds: ['pol1', 'pol2', 'pol3'], transitionInFrames: 16},
	{id: 'shops', segmentIds: ['shop1', 'shop2', 'shop3'], transitionInFrames: 16},
	{id: 'summary', segmentIds: ['sum1', 'sum2'], transitionInFrames: 16},
	{id: 'twist', segmentIds: ['tw1', 'tw2', 'tw3'], transitionInFrames: 16},
	{id: 'question', segmentIds: ['end1'], transitionInFrames: 16},
	{id: 'outro', segmentIds: ['outro'], transitionInFrames: 12},
];

/** Schlüsselwörter (Anzeigetext der Untertitel) → Cue-Frames je Szene. Zahlen müssen exakt passen. */
export const NOV20_KEYWORDS: Record<string, string[]> = {
	hook: ['20', 'Halloween', 'Eskaliert', 'Fakt', 'Gewalt', 'Einschätzung'],
	halloween: ['Halloween', '31', 'verkleidet', 'Randalierer', 'voll', 'Trubel', 'überblicken'],
	police: ['Polizei', 'Aufgebot', 'vergleichbare', 'Verbot', 'entschieden', 'abschrecken', 'garantiert', 'Protest'],
	shops: ['Läden', 'Holzplatten', 'Plünderungen', 'Platten', 'Security', 'schließen', 'offen'],
	summary: ['Halloween-Trubel', 'Polizei', 'Läden', 'ruhiger', 'niemand'],
	twist: ['gewinnt', 'Politik', 'Polizei', 'Typ', 'Firma', 'Schaufenster-Schutzwände', 'Frankfurt', 'Holzplatte'],
	question: ['Einschätzung', 'ruhiger', 'Realistisch', 'Eskalation', 'Kommentare'],
	outro: ['Plus', 'nicht'],
};
