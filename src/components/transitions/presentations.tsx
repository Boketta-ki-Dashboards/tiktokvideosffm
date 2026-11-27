import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import type {TransitionPresentation, TransitionPresentationComponentProps} from '@remotion/transitions';
import {clamp, EASE_IN, EASE_OUT} from '../../lib/animation';

/**
 * Eigene, DOM-basierte Übergänge (laufen in jedem Headless-Chrome, kein WebGL nötig).
 * Zusätzlich nutzbar: fade, slide, wipe, iris, clockWipe aus @remotion/transitions.
 */

// ---------- Zoom-Through: alte Szene fliegt auf die Kamera zu, neue zoomt heran ----------
type ZoomThroughProps = {strength?: number; blur?: number};

const ZoomThrough: React.FC<TransitionPresentationComponentProps<ZoomThroughProps>> = ({
	children,
	presentationDirection,
	presentationProgress: p,
	passedProps: {strength = 0.35, blur = 10},
}) => {
	const exiting = presentationDirection === 'exiting';
	const scale = exiting ? 1 + EASE_IN(p) * strength : 1 - (1 - EASE_OUT(p)) * strength * 0.5;
	const opacity = exiting ? interpolate(p, [0.35, 0.85], [1, 0], clamp) : interpolate(p, [0.2, 0.6], [0, 1], clamp);
	const b = exiting ? EASE_IN(p) * blur : (1 - EASE_OUT(p)) * blur;
	return (
		<AbsoluteFill style={{scale: String(scale), opacity, filter: b > 0.2 ? `blur(${b}px)` : undefined}}>{children}</AbsoluteFill>
	);
};

export const zoomThrough = (props: ZoomThroughProps = {}): TransitionPresentation<ZoomThroughProps> => ({
	component: ZoomThrough,
	props,
});

// ---------- Whip-Pan: schneller Schwenk mit Bewegungsunschärfe ----------
type WhipProps = {direction?: 'left' | 'right' | 'up' | 'down'; blur?: number};

const Whip: React.FC<TransitionPresentationComponentProps<WhipProps>> = ({
	children,
	presentationDirection,
	presentationProgress: p,
	passedProps: {direction = 'left', blur = 16},
}) => {
	const exiting = presentationDirection === 'exiting';
	const sign = direction === 'left' || direction === 'up' ? -1 : 1;
	const horizontal = direction === 'left' || direction === 'right';
	const eased = exiting ? EASE_IN(p) : EASE_OUT(p);
	const offset = exiting ? eased * 100 * sign : (1 - eased) * -100 * sign;
	const b = Math.sin(p * Math.PI) * blur;
	return (
		<AbsoluteFill
			style={{
				translate: horizontal ? `${offset}% 0` : `0 ${offset}%`,
				filter: b > 0.3 ? `blur(${b}px)` : undefined,
			}}
		>
			{children}
		</AbsoluteFill>
	);
};

export const whipPan = (props: WhipProps = {}): TransitionPresentation<WhipProps> => ({component: Whip, props});

// ---------- Kreis-Enthüllung von einem Punkt aus (z. B. von einer Stadt auf der Karte) ----------
type CircleRevealProps = {x?: string; y?: string};

const CircleReveal: React.FC<TransitionPresentationComponentProps<CircleRevealProps>> = ({
	children,
	presentationDirection,
	presentationProgress: p,
	passedProps: {x = '50%', y = '50%'},
}) => {
	if (presentationDirection === 'exiting') {
		return <AbsoluteFill style={{scale: String(1 + EASE_IN(p) * 0.06)}}>{children}</AbsoluteFill>;
	}

	const r = EASE_OUT(p) * 150;
	return <AbsoluteFill style={{clipPath: `circle(${r}% at ${x} ${y})`}}>{children}</AbsoluteFill>;
};

export const circleReveal = (props: CircleRevealProps = {}): TransitionPresentation<CircleRevealProps> => ({
	component: CircleReveal,
	props,
});

// ---------- Blitz-Schnitt: kurzer heller Flash, typisch für News-Clips ----------
type FlashProps = {color?: string};

const Flash: React.FC<TransitionPresentationComponentProps<FlashProps>> = ({
	children,
	presentationDirection,
	presentationProgress: p,
	passedProps: {color = '#FFFFFF'},
}) => {
	const exiting = presentationDirection === 'exiting';
	const visible = exiting ? p < 0.5 : p >= 0.5;
	const flash = interpolate(p, [0, 0.5, 1], [0, 0.85, 0], clamp);
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{opacity: visible ? 1 : 0}}>{children}</AbsoluteFill>
			{exiting ? null : <AbsoluteFill style={{backgroundColor: color, opacity: flash, pointerEvents: 'none'}} />}
		</AbsoluteFill>
	);
};

export const flashCut = (props: FlashProps = {}): TransitionPresentation<FlashProps> => ({component: Flash, props});
