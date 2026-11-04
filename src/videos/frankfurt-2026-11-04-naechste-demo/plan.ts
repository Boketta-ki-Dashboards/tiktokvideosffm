import type {SceneSpec} from '../../lib/timeline';

/**
 * Szenenplan Folge 3: Jede Szene wird von Sprechersegmenten (script.json) getragen,
 * Schnitte folgen deshalb immer der Stimme (siehe buildTimeline).
 */
export const NEXT_DEMO_SCENES: SceneSpec[] = [
	{id: 'hook', segmentIds: ['hook1', 'hook2', 'hook3'], minSeconds: 5},
	{id: 'd14', segmentIds: ['d14'], transitionInFrames: 14},
	{id: 'd21', segmentIds: ['d21'], transitionInFrames: 16},
	{id: 'd20', segmentIds: ['d20a', 'd20b'], transitionInFrames: 16},
	{id: 'police', segmentIds: ['pol1', 'pol2'], transitionInFrames: 16},
	{id: 'law', segmentIds: ['law1', 'law2'], transitionInFrames: 16},
	{id: 'summary', segmentIds: ['sum1', 'sum2'], transitionInFrames: 16},
	{id: 'outro', segmentIds: ['outro'], transitionInFrames: 12},
];
