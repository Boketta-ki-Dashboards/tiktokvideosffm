import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, EASE_OUT} from '../../lib/animation';
import {COLORS, FONTS, RADII} from '../../theme/tokens';

/** Bauchbinde: Ort/Name + Zusatzzeile. */
export const LowerThird: React.FC<{title: string; subtitle?: string; delay?: number; accent?: string}> = ({
	title,
	subtitle,
	delay = 0,
	accent = COLORS.signal,
}) => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [delay, delay + 16], [0, 1], {...clamp, easing: EASE_OUT});
	return (
		<div style={{display: 'flex', alignItems: 'stretch', opacity: p, translate: `${(1 - p) * -60}px 0`}}>
			<div style={{width: 10, background: accent, borderRadius: 5, marginRight: 18}} />
			<div
				style={{
					padding: '14px 24px',
					borderRadius: RADII.md,
					background: 'rgba(8, 12, 32, 0.8)',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 46, color: COLORS.text}}>{title}</span>
				{subtitle ? <span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 28, color: COLORS.textMuted}}>{subtitle}</span> : null}
			</div>
		</div>
	);
};
