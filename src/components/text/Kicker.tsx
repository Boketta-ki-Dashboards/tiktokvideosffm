import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, EASE_OUT} from '../../lib/animation';
import {COLORS, FONTS} from '../../theme/tokens';

/** Kleine Dachzeile über Titeln („EILMELDUNG“, „HINTERGRUND“ …) mit animiertem Balken. */
export const Kicker: React.FC<{
	text: string;
	color?: string;
	delay?: number;
	live?: boolean;
	style?: React.CSSProperties;
}> = ({text, color = COLORS.alert, delay = 0, live = false, style}) => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [delay, delay + 14], [0, 1], {...clamp, easing: EASE_OUT});
	const blink = live ? 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(frame * 0.25)) : 1;
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: 14, ...style}}>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 12,
					padding: '10px 20px',
					borderRadius: 10,
					background: color,
					clipPath: `inset(0 ${(1 - p) * 100}% 0 0 round 10px)`,
				}}
			>
				{live ? <div style={{width: 14, height: 14, borderRadius: 7, background: '#FFFFFF', opacity: blink}} /> : null}
				<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, letterSpacing: 2.5, color: '#FFFFFF'}}>{text}</span>
			</div>
		</div>
	);
};
