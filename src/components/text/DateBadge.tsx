import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {springIn} from '../../lib/animation';
import {COLORS, FONTS, SHADOWS} from '../../theme/tokens';

/** Kalenderblatt-Badge, z. B. 31 · OKT · 2026. */
export const DateBadge: React.FC<{day: string; month: string; year: string; delay?: number; accent?: string}> = ({
	day,
	month,
	year,
	delay = 0,
	accent = COLORS.alert,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = springIn({frame, fps, delay, damping: 11});
	return (
		<div
			style={{
				width: 190,
				borderRadius: 26,
				overflow: 'hidden',
				background: '#FFFFFF',
				boxShadow: SHADOWS.card,
				scale: String(s),
				rotate: `${(1 - s) * -14 - 4}deg`,
				textAlign: 'center',
			}}
		>
			<div style={{background: accent, color: '#FFFFFF', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, padding: '8px 0', letterSpacing: 3}}>
				{month}
			</div>
			<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 104, lineHeight: 1, color: '#0B1020', paddingTop: 10}}>{day}</div>
			<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 30, color: '#4B5563', paddingBottom: 14}}>{year}</div>
		</div>
	);
};
