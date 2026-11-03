/** Frame-Bereiche der Sprechersegmente relativ zum Szenenstart. */
export type Cue = {from: number; to: number};
export type Cues = Record<string, Cue>;

export type SceneProps = {
	cues: Cues;
	durationInFrames: number;
};

/** Sicherer Zugriff mit Fallback, falls ein Segment (noch) fehlt. */
export const cue = (cues: Cues, id: string, fallbackFrom = 0): Cue => cues[id] ?? {from: fallbackFrom, to: fallbackFrom + 60};
