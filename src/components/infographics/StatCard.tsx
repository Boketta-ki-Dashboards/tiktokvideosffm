import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {springIn} from '../../lib/animation';
import {withAlpha} from '../../lib/color';
import {COLORS, FONTS, RADII, SHADOWS} from '../../theme/tokens';
import {AnimatedNumber} from './AnimatedNumber';

export type StatCardProps = {
	value: number;
	label: string;
	/** Wer die Zahl nennt, z. B. „Polizei“ oder „Innenminister Poseck“. */
	attribution?: string;
	prefix?: string;
	suffix?: string;
	accent?: string;
	delay?: number;
	icon?: React.ReactNode;
	width?: number | string;
	style?: React.CSSProperties;
};

/** Kennzahl-Karte mit Hochzähl-Animation, Label und Zuordnung der Quelle. */
export const StatCard: React.FC<StatCardProps> = ({
	value,
	label,
	attribution,
	prefix,
	suffix,
	accent = COLORS.signal,
	delay = 0,
	icon,
	width = '100%',
	style,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = springIn({frame, fps, delay, damping: 13});
	return (
		<div
			style={{
				width,
				display: 'flex',
				alignItems: 'center',
				gap: 26,
				padding: '22px 28px',
				borderRadius: RADII.lg,
				background: 'linear-gradient(135deg, rgba(25, 34, 76, 0.95), rgba(11, 16, 40, 0.95))',
				border: `2px solid ${withAlpha(accent, 0.55)}`,
				boxShadow: `${SHADOWS.card}, inset 0 0 40px ${withAlpha(accent, 0.08)}`,
				scale: String(0.6 + 0.4 * s),
				opacity: Math.min(1, s * 1.4),
				translate: `${(1 - s) * 80}px 0`,
				...style,
			}}
		>
			{icon ? (
				<div
					style={{
						width: 92,
						height: 92,
						borderRadius: 26,
						background: withAlpha(accent, 0.16),
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						flexShrink: 0,
					}}
				>
					{icon}
				</div>
			) : null}
			<div style={{display: 'flex', flexDirection: 'column', gap: 2}}>
				<AnimatedNumber
					value={value}
					delay={delay + 4}
					prefix={prefix}
					suffix={suffix}
					style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 92, lineHeight: 1, color: accent}}
				/>
				<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 38, color: COLORS.text, lineHeight: 1.1}}>{label}</span>
				{attribution ? (
					<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 24, color: COLORS.textMuted}}>{attribution}</span>
				) : null}
			</div>
		</div>
	);
};
