import type {SceneSpec} from '../../lib/timeline';

/**
 * Szenenplan „Wie Frankfurt weltweit Schlagzeilen machte“ (V2): Jede Szene wird von Sprechersegmenten
 * (script.json) getragen – Schnitte folgen immer der Adam-Aufnahme (buildTimeline).
 * V2: Mittelteil kurz („Was geschah“), dann „Warum online so groß“ (Batman/@ichbinyounes, 3 linke Schuhe).
 */
export const WORLDWIDE_SCENES: SceneSpec[] = [
	{id: 'hook', segmentIds: ['hook1', 'hook2'], minSeconds: 4},
	{id: 'night', segmentIds: ['ev1', 'ev2b'], transitionInFrames: 16},
	{id: 'numbers', segmentIds: ['num1b'], transitionInFrames: 16},
	{id: 'batman', segmentIds: ['viral1', 'bat1', 'bat2', 'bat3'], transitionInFrames: 16},
	{id: 'shoes', segmentIds: ['shoe1', 'shoe2', 'shoe3'], transitionInFrames: 16},
	{id: 'world', segmentIds: ['w1', 'w2'], transitionInFrames: 16},
	{id: 'cards', segmentIds: ['w3', 'w4'], transitionInFrames: 16},
	{id: 'finale', segmentIds: ['end1'], transitionInFrames: 16},
	{id: 'outro', segmentIds: ['outro'], transitionInFrames: 12},
];

/** Schlüsselwörter (Anzeigetext der Untertitel), deren Startframe die Szene als Cue bekommt. */
export const SCENE_KEYWORDS: Record<string, string[]> = {
	hook: ['plötzlich', 'Welt'],
	night: ['8.000', 'friedlich', 'eskaliert', 'Zeil'],
	numbers: ['17', 'fünf', 'mindestens'],
	batman: ['Bilder', 'Batman', 'Feuer', 'AP', 'Reuters', 'Großbritannien', 'Indien', 'TikTok', '@ichbinyounes', 'Batman-Kostüm', 'Hunderttausenden', 'Kostüm', 'wiedererkennbarer'],
	shoes: ['drei', 'Bild', 'Edits', 'Memes', 'Snipes', 'KI-generiert', 'echt'],
	world: ['Reuters', 'Randalierer', 'Südkorea', 'Saudi-Arabien', 'Australien', 'Eigene', 'Österreich', 'Polen', 'USA'],
	cards: ['Frankreich', 'greifen', 'Brennpunkt', 'mindestens', '26', '24', 'Stichprobe'],
	finale: ['Ausschreitungen', 'Bilder', 'Memes', 'Nachricht', 'Deutschland'],
	outro: ['Plus', 'nicht'],
};
