/** Frame-Bereiche der Sprechersegmente relativ zum Szenenstart. */
export type Cue = {from: number; to: number};
export type Cues = Record<string, Cue> & {
	/** Startframes einzelner Schlüsselwörter (relativ zum Szenenstart), z. B. words.Plus */
	words?: Record<string, number>;
};

export type SceneProps = {
	cues: Cues;
	durationInFrames: number;
};

/** Sicherer Zugriff mit Fallback, falls ein Segment (noch) fehlt. */
export const cue = (cues: Cues, id: string, fallbackFrom = 0): Cue => {
	const c = (cues as Record<string, Cue | Record<string, number> | undefined>)[id];
	return c && 'from' in c ? (c as Cue) : {from: fallbackFrom, to: fallbackFrom + 60};
};

/** Startframe eines Schlüsselworts oder Fallback. */
export const wordFrame = (cues: Cues, word: string, fallback: number) => cues.words?.[word] ?? fallback;
