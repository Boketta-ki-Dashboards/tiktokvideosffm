import type {SceneSpec} from '../../lib/timeline';

/**
 * Szenenplan „Wie Frankfurt weltweit Schlagzeilen machte“: Jede Szene wird von Sprechersegmenten
 * (script.json) getragen – Schnitte folgen immer der Adam-Aufnahme (buildTimeline).
 */
export const WORLDWIDE_SCENES: SceneSpec[] = [
	{id: 'hook', segmentIds: ['hook1', 'hook2'], minSeconds: 4},
	{id: 'night', segmentIds: ['ev1', 'ev2', 'ev3', 'ev4'], transitionInFrames: 16},
	{id: 'numbers', segmentIds: ['num1', 'num2'], transitionInFrames: 16},
	{id: 'batman', segmentIds: ['mem1', 'mem2', 'mem3'], transitionInFrames: 16},
	{id: 'shoes', segmentIds: ['mem4', 'mem5'], transitionInFrames: 16},
	{id: 'world', segmentIds: ['w1', 'w2'], transitionInFrames: 16},
	{id: 'cards', segmentIds: ['w3', 'w4'], transitionInFrames: 16},
	{id: 'finale', segmentIds: ['end1'], transitionInFrames: 16},
	{id: 'outro', segmentIds: ['outro'], transitionInFrames: 12},
];

/** Schlüsselwörter (Anzeigetext der Untertitel), deren Startframe die Szene als Cue bekommt. */
export const SCENE_KEYWORDS: Record<string, string[]> = {
	hook: ['plötzlich', 'Welt'],
	night: ['8.000', '18:20', 'Zeil', 'Personengruppe', '3'],
	numbers: ['17', 'fünf', '54', 'mindestens', '87'],
	batman: ['Batman-Kostüm', 'Feuer', 'AP', 'Reuters', 'Großbritannien', 'Indien', 'Demonstrant', 'Halloween-Gast', 'nicht'],
	shoes: ['Schuh-Memes', 'linke', 'Snipes', 'Verkaufsanzeigen', 'nie', 'Faktencheck', 'CORRECTIV'],
	world: ['Reuters', 'Randalierer', 'Südkorea', 'Saudi-Arabien', 'Australien', 'Eigene', 'Österreich', 'Polen', 'USA'],
	cards: ['Frankreich', 'greifen', 'Brennpunkt', 'mindestens', '26', '24', 'Stichprobe'],
	finale: ['Ausschreitungen', 'Bilder', 'Memes', 'Nachricht', 'Deutschland'],
	outro: ['Plus', 'nicht'],
};
