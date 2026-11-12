import {Easing, interpolate, spring} from 'remotion';

/** Standard-Easing für Ein-/Ausblendungen („ease-out-expo“-artig). */
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);

export const clamp = {
	extrapolateLeft: 'clamp',
	extrapolateRight: 'clamp',
} as const;

/** 0 → 1 Federanimation ab `delay` Frames. */
export const springIn = ({
	frame,
	fps,
	delay = 0,
	damping = 14,
	mass = 0.9,
	stiffness = 140,
	durationInFrames,
}: {
	frame: number;
	fps: number;
	delay?: number;
	damping?: number;
	mass?: number;
	stiffness?: number;
	durationInFrames?: number;
}) =>
	spring({
		frame: frame - delay,
		fps,
		config: {damping, mass, stiffness},
		durationInFrames,
	});

/** Linear-geclampter Fortschritt 0 → 1 zwischen zwei Frames, mit Easing. */
export const progress = (
	frame: number,
	start: number,
	end: number,
	easing: (t: number) => number = EASE_OUT,
) => interpolate(frame, [start, end], [0, 1], {...clamp, easing});

/**
 * Ein-/Ausblend-Hüllkurve: 0 → 1 (fadeIn) … 1 → 0 (fadeOut) innerhalb einer Dauer.
 */
export const fadeInOut = (
	frame: number,
	durationInFrames: number,
	fadeIn = 10,
	fadeOut = 10,
) => {
	if (durationInFrames <= fadeIn + fadeOut) {
		return interpolate(frame, [0, durationInFrames / 2, durationInFrames], [0, 1, 0], clamp);
	}

	return interpolate(
		frame,
		[0, fadeIn, durationInFrames - fadeOut, durationInFrames],
		[0, 1, 1, 0],
		clamp,
	);
};

/** Versatz für gestaffelte Animationen (z. B. Wort für Wort). */
export const stagger = (index: number, step = 3, base = 0) => base + index * step;
