import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, EASE_OUT, springIn} from '../../lib/animation';
import {withAlpha} from '../../lib/color';
import {COLORS, FONTS, RADII, SHADOWS} from '../../theme/tokens';

export type Hurdle = {id: string; titel: string; text: string; /** Frame, ab dem die Stufe erscheint. */ from: number};

export type HurdleLadderProps = {
	hurdles: Hurdle[];
	/** Beschriftung ganz oben (z. B. „VERBOT“). */
	topLabel: string;
	/** Frame, ab dem das Ziel „freigeschaltet“ wirkt (nach der letzten Stufe) – nur zur Betonung, kein Ergebnis. */
	topFrame: number;
	width?: number;
	color?: string;
};

/**
 * Treppe mit Hürden: Jede Stufe ist eine rechtliche Voraussetzung (laut Rechtsexperte). Oben steht das Verbot als „letztes Mittel“.
 * Sie zeigt Voraussetzungen, keine Prognose, ob ein Verbot kommt.
 */
export const HurdleLadder: React.FC<HurdleLadderProps> = ({hurdles, topLabel, topFrame, width = 866, color = COLORS.signal}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const top = springIn({frame, fps, delay: topFrame, damping: 12});
	return (
		<div style={{width, display: 'flex', flexDirection: 'column', gap: 14}}>
			<div
				style={{
					alignSelf: 'flex-end',
					padding: '18px 40px',
					borderRadius: RADII.lg,
					background: `linear-gradient(140deg, ${withAlpha(COLORS.alert, 0.9)}, #8E1E38)`,
					border: '4px dashed rgba(255,255,255,0.7)',
					fontFamily: FONTS.heading,
					fontWeight: 900,
					fontSize: 56,
					letterSpacing: 3,
					color: '#FFFFFF',
					opacity: 0.35 + 0.65 * top,
					scale: String(0.94 + 0.06 * top),
					boxShadow: top > 0.3 ? `0 0 ${30 * top}px ${withAlpha(COLORS.alert, 0.5)}` : undefined,
				}}
			>
				{topLabel}
			</div>
			{[...hurdles].reverse().map((h, ri) => {
				const idx = hurdles.length - 1 - ri;
				const p = springIn({frame, fps, delay: h.from, damping: 14, stiffness: 150});
				const indent = idx * 70;
				const lit = interpolate(frame, [h.from, h.from + 14], [0, 1], {...clamp, easing: EASE_OUT});
				return (
					<div
						key={h.id}
						style={{
							marginLeft: indent,
							display: 'flex',
							alignItems: 'center',
							gap: 22,
							padding: '22px 28px',
							borderRadius: RADII.md,
							background: 'linear-gradient(160deg, rgba(27,38,84,0.97), rgba(10,15,38,0.97))',
							border: `3px solid ${withAlpha(color, 0.25 + 0.65 * lit)}`,
							boxShadow: SHADOWS.card,
							opacity: Math.min(1, p * 1.6),
							translate: `${(1 - p) * -120}px 0`,
						}}
					>
						<div
							style={{
								flexShrink: 0,
								width: 64,
								height: 64,
								borderRadius: '50%',
								background: color,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontFamily: FONTS.heading,
								fontWeight: 900,
								fontSize: 36,
								color: '#0B1029',
							}}
						>
							{idx + 1}
						</div>
						<div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, color: COLORS.text, lineHeight: 1.05}}>{h.titel}</span>
							<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 28, lineHeight: 1.2, color: COLORS.textMuted}}>{h.text}</span>
						</div>
					</div>
				);
			})}
		</div>
	);
};
