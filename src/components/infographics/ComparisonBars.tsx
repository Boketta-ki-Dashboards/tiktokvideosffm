import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, EASE_OUT} from '../../lib/animation';
import {withAlpha} from '../../lib/color';
import {COLORS, FONTS} from '../../theme/tokens';
import {AnimatedNumber} from './AnimatedNumber';

export type ComparisonItem = {
	label: string;
	value: number;
	color?: string;
	/** Zusatz, z. B. „laut Polizei“. */
	note?: string;
};

export type ComparisonBarsProps = {
	items: ComparisonItem[];
	title?: string;
	delay?: number;
	stagger?: number;
	width?: number;
	/** Skalenmaximum (Standard: größter Wert). */
	max?: number;
};

/** Horizontale Balken, z. B. „Polizei vs. Veranstalter“ – immer mit Herkunft der Zahl. */
export const ComparisonBars: React.FC<ComparisonBarsProps> = ({items, title, delay = 0, stagger = 8, width = 860, max}) => {
	const frame = useCurrentFrame();
	const top = max ?? Math.max(...items.map((i) => i.value));
	return (
		<div style={{width, display: 'flex', flexDirection: 'column', gap: 22}}>
			{title ? (
				<div
					style={{
						fontFamily: FONTS.heading,
						fontWeight: 800,
						fontSize: 34,
						color: COLORS.text,
						opacity: interpolate(frame, [delay - 6, delay + 6], [0, 1], clamp),
					}}
				>
					{title}
				</div>
			) : null}
			{items.map((item, i) => {
				const start = delay + i * stagger;
				const p = interpolate(frame, [start, start + 26], [0, 1], {...clamp, easing: EASE_OUT});
				const color = item.color ?? COLORS.signal;
				return (
					<div key={item.label} style={{display: 'flex', flexDirection: 'column', gap: 8, opacity: Math.min(1, p * 2)}}>
						<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
							<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 30, color: COLORS.text}}>
								{item.label}
								{item.note ? <span style={{color: COLORS.textMuted, fontWeight: 600, fontSize: 24}}> · {item.note}</span> : null}
							</span>
							<AnimatedNumber
								value={item.value}
								delay={start}
								durationInFrames={26}
								style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 44, color}}
							/>
						</div>
						<div style={{height: 26, borderRadius: 13, background: withAlpha('#FFFFFF', 0.08), overflow: 'hidden'}}>
							<div
								style={{
									height: '100%',
									width: `${(item.value / top) * 100 * p}%`,
									borderRadius: 13,
									background: `linear-gradient(90deg, ${withAlpha(color, 0.65)}, ${color})`,
									boxShadow: `0 0 24px ${withAlpha(color, 0.5)}`,
								}}
							/>
						</div>
					</div>
				);
			})}
		</div>
	);
};
