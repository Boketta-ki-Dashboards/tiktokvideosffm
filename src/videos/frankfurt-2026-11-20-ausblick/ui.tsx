import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {springIn} from '../../lib/animation';
import {withAlpha} from '../../lib/color';
import {COLORS, FONTS, RADII} from '../../theme/tokens';

export {increasing, Pill, PopIn, Stamp} from '../frankfurt-2026-10-31-international/ui';

/** Kennzeichnung jeder Aussage: belegter Fakt, Ankündigung, eigene Einschätzung, offen oder Witz. */
export type StatusKind = 'FAKT' | 'ANGEKÜNDIGT' | 'EINSCHÄTZUNG' | 'OFFEN' | 'FIKTION';

export const STATUS_COLORS: Record<StatusKind, string> = {
	FAKT: COLORS.green,
	ANGEKÜNDIGT: COLORS.cyan,
	EINSCHÄTZUNG: COLORS.signal,
	OFFEN: '#B4BEDC',
	FIKTION: COLORS.violet,
};

/** Zeile mit Status-Etikett + Text, springt bei `at` ein. */
export const StatusChip: React.FC<{kind: StatusKind; text: string; at: number; size?: number; style?: React.CSSProperties}> = ({kind, text, at, size = 31, style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	if (frame < at) return null;
	const s = springIn({frame, fps, delay: at, damping: 14});
	const color = STATUS_COLORS[kind];
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 14,
				padding: '12px 18px',
				borderRadius: RADII.md,
				background: 'rgba(7, 10, 28, 0.9)',
				border: `2px solid ${withAlpha(color, 0.75)}`,
				opacity: Math.min(1, s * 1.6),
				translate: `${(1 - s) * -80}px 0`,
				...style,
			}}
		>
			<span
				style={{
					flexShrink: 0,
					padding: '4px 10px',
					borderRadius: 8,
					background: color,
					fontFamily: FONTS.heading,
					fontWeight: 900,
					fontSize: 22,
					letterSpacing: 1,
					color: '#0B1029',
				}}
			>
				{kind}
			</span>
			<span style={{fontFamily: FONTS.body, fontWeight: 800, fontSize: size, lineHeight: 1.15, color: COLORS.text}}>{text}</span>
		</div>
	);
};
