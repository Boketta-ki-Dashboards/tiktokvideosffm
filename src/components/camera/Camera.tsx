import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, EASE_IN_OUT} from '../../lib/animation';

export type CameraKeyframe = {
	frame: number;
	zoom?: number;
	/** Verschiebung in px (Bildschirmkoordinaten). */
	x?: number;
	y?: number;
	rotate?: number;
};

export type CameraProps = {
	keyframes: CameraKeyframe[];
	easing?: (t: number) => number;
	/** Handkamera-Wackeln in px (0 = aus). */
	shake?: number;
	children: React.ReactNode;
	style?: React.CSSProperties;
};

const track = (frame: number, keyframes: CameraKeyframe[], key: keyof Omit<CameraKeyframe, 'frame'>, fallback: number, easing: (t: number) => number) => {
	const points = keyframes.filter((k) => k[key] !== undefined);
	if (points.length === 0) {
		return fallback;
	}

	if (points.length === 1) {
		return points[0][key] as number;
	}

	return interpolate(
		frame,
		points.map((p) => p.frame),
		points.map((p) => p[key] as number),
		{...clamp, easing},
	);
};

/**
 * Virtuelle Kamera: Zoom, Schwenk, Neigung über Keyframes + optionales Wackeln.
 * Für Vektorgrafiken (SVG) bleibt das Bild auch bei starkem Zoom gestochen scharf.
 */
export const Camera: React.FC<CameraProps> = ({keyframes, easing = EASE_IN_OUT, shake = 0, children, style}) => {
	const frame = useCurrentFrame();
	const zoom = track(frame, keyframes, 'zoom', 1, easing);
	const x = track(frame, keyframes, 'x', 0, easing);
	const y = track(frame, keyframes, 'y', 0, easing);
	const rotate = track(frame, keyframes, 'rotate', 0, easing);
	const sx = shake ? Math.sin(frame * 0.37) * shake + Math.sin(frame * 0.91) * shake * 0.4 : 0;
	const sy = shake ? Math.cos(frame * 0.29) * shake * 0.8 + Math.sin(frame * 1.13) * shake * 0.3 : 0;

	return (
		<AbsoluteFill
			style={{
				translate: `${x + sx}px ${y + sy}px`,
				scale: String(zoom),
				rotate: `${rotate}deg`,
				transformOrigin: '50% 50%',
				...style,
			}}
		>
			{children}
		</AbsoluteFill>
	);
};

/** Langsamer „Ken Burns“-Push-in über die gesamte Sequenz. */
export const KenBurns: React.FC<{
	from?: number;
	to?: number;
	driftX?: number;
	driftY?: number;
	children: React.ReactNode;
}> = ({from = 1, to = 1.08, driftX = 0, driftY = 0, children}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	return (
		<AbsoluteFill
			style={{
				scale: String(interpolate(frame, [0, durationInFrames], [from, to], clamp)),
				translate: `${interpolate(frame, [0, durationInFrames], [0, driftX], clamp)}px ${interpolate(frame, [0, durationInFrames], [0, driftY], clamp)}px`,
			}}
		>
			{children}
		</AbsoluteFill>
	);
};

/** Verschiebung, die Punkt (px, py) bei gegebenem Zoom in die Bildmitte holt. */
export const focusOn = ({px, py, zoom, width, height}: {px: number; py: number; zoom: number; width: number; height: number}) => ({
	zoom,
	x: -(px - width / 2) * zoom,
	y: -(py - height / 2) * zoom,
});
