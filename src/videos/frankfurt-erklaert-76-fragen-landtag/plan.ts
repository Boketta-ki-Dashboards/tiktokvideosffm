import type {SceneSpec} from '../../lib/timeline';

/** Szenenplan „76 Fragen“: Schnitte folgen den Adam-Sätzen, Gesamtlänge ≤ 60 s. */
export const FRAGEN76_SCENES: SceneSpec[] = [
	{id: 'hook', segmentIds: ['hook1', 'hook2'], minSeconds: 6},
	{id: 'docs', segmentIds: ['docs1', 'docs2'], transitionInFrames: 12},
	{id: 'q1', segmentIds: ['q1'], transitionInFrames: 12},
	{id: 'q2', segmentIds: ['q2'], transitionInFrames: 12},
	{id: 'q3', segmentIds: ['q3'], transitionInFrames: 12},
	{id: 'q4', segmentIds: ['q4'], transitionInFrames: 12},
	{id: 'session', segmentIds: ['sess'], transitionInFrames: 12},
	{id: 'note', segmentIds: ['note'], transitionInFrames: 10},
	{id: 'outro', segmentIds: ['outro'], transitionInFrames: 12},
];

export const FRAGEN76_KEYWORDS: Record<string, string[]> = {
	hook: ['Ewa', 'Krawallnacht', 'landen', '76', 'Landtag'],
	docs: ['Grünen', 'FDP', 'wissen', 'Vier', 'spannend'],
	q1: ['Polizei', 'vorher', 'Gewalttäter'],
	q2: ['Geschäfte', 'geplündert', 'Schutzkonzept', 'angekündigt'],
	q3: ['TikTok', 'Demo-Aufrufe', 'Absprachen', 'Straftaten'],
	q4: ['Tatverdächtigen', 'Läden', 'Konsequenzen'],
	session: ['Heute', 'Innenausschuss', 'Wiesbaden', '20'],
	note: ['Wichtig', 'Fragen', 'Antworten'],
	outro: ['beantwortet', 'Teil', 'folgt'],
};
