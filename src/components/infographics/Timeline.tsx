import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, EASE_OUT} from '../../lib/animation';
import {COLORS, FONTS} from '../../theme/tokens';

export type TimelineEvent = {time: string; label: string; color?: string};

/** Vertikale Chronologie (z. B. Uhrzeiten eines Tages). */
export const Timeline: React.FC<{events: TimelineEvent[]; delay?: number; stagger?: number; width?: number}> = ({
	events,
	delay = 0,
	stagger = 10,
	width = 820,
}) => {
	const frame = useCurrentFrame();
	const lineP = interpolate(frame, [delay, delay + stagger * events.length + 10], [0, 1], {...clamp, easing: EASE_OUT});
	return (
		<div style={{position: 'relative', width, paddingLeft: 56, display: 'flex', flexDirection: 'column', gap: 30}}>
			<div
				style={{
					position: 'absolute',
					left: 18,
					top: 10,
					width: 4,
					height: `calc(${lineP * 100}% - 20px)`,
					background: `linear-gradient(${COLORS.cyan}, ${COLORS.signal})`,
					borderRadius: 2,
				}}
			/>
			{events.map((e, i) => {
				const p = interpolate(frame, [delay + i * stagger, delay + i * stagger + 14], [0, 1], {...clamp, easing: EASE_OUT});
				return (
					<div key={i} style={{position: 'relative', opacity: p, translate: `${(1 - p) * 40}px 0`}}>
						<div
							style={{
								position: 'absolute',
								left: -48,
								top: 8,
								width: 24,
								height: 24,
								borderRadius: 12,
								background: e.color ?? COLORS.signal,
								border: '4px solid #0B1020',
							}}
						/>
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 36, color: e.color ?? COLORS.signal}}>{e.time}</div>
						<div style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 30, color: COLORS.text}}>{e.label}</div>
					</div>
				);
			})}
		</div>
	);
};
