import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, springIn} from '../../lib/animation';
import {withAlpha} from '../../lib/color';
import {COLORS, FONTS, RADII, SHADOWS} from '../../theme/tokens';

export type PressReleaseProps = {
	/** Absender (neutral als Text, ohne Wappen/Logo). */
	sender: string;
	/** Datum der Mitteilung. */
	date: string;
	/** Wörtliche Zitate, die nacheinander markiert werden. */
	quotes: Array<{text: string; from: number}>;
	delay?: number;
	width?: number;
};

/** Nachgezeichnete Pressemitteilung: Kopf, Textzeilen als Platzhalter, wörtliche Zitate hervorgehoben. */
export const PressRelease: React.FC<PressReleaseProps> = ({sender, date, quotes, delay = 0, width = 820}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = springIn({frame, fps, delay, damping: 15});
	return (
		<div
			style={{
				width,
				borderRadius: RADII.md,
				background: 'linear-gradient(170deg, #FFFFFF, #E8ECF8)',
				border: '4px solid #2A2F55',
				boxShadow: SHADOWS.card,
				padding: '26px 34px 30px',
				opacity: Math.min(1, s * 1.6),
				translate: `0 ${(1 - s) * 160}px`,
				rotate: `${(1 - s) * 5}deg`,
				scale: String(0.92 + 0.08 * s),
			}}
		>
			<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16}}>
				<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, letterSpacing: 2, color: '#2A2F55'}}>PRESSEMITTEILUNG</span>
				<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, color: '#4A5580'}}>{date}</span>
			</div>
			<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 31, color: '#0B1029', marginTop: 4}}>{sender}</div>
			<div style={{height: 4, background: '#2A2F55', opacity: 0.3, margin: '14px 0 16px'}} />
			{quotes.map((q, i) => {
				const p = interpolate(frame, [q.from, q.from + 14], [0, 1], clamp);
				return (
					<div key={i} style={{marginBottom: 16}}>
						<div style={{height: 10, width: '92%', borderRadius: 5, background: '#C9D0E8', marginBottom: 8}} />
						<div
							style={{
								fontFamily: 'Georgia, "Times New Roman", serif',
								fontWeight: 700,
								fontSize: 32,
								lineHeight: 1.25,
								color: '#0B1029',
								opacity: 0.3 + 0.7 * p,
							}}
						>
							<span style={{background: `linear-gradient(transparent 20%, ${withAlpha(COLORS.signal, 0.9 * p)} 20%)`, padding: '0 3px'}}>„{q.text}“</span>
						</div>
					</div>
				);
			})}
			<div style={{height: 10, width: '70%', borderRadius: 5, background: '#C9D0E8'}} />
		</div>
	);
};
