import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp} from '../../lib/animation';
import {COLORS, FONTS} from '../../theme/tokens';

export type SourceCreditProps = {
	/** Kurzangaben, z. B. ["hessenschau.de, 01.11.2026"]. */
	sources: string[];
	label?: string;
	delay?: number;
	align?: 'left' | 'center' | 'right';
	style?: React.CSSProperties;
};

/** Dezente, gut lesbare Quellenangabe – Pflicht bei jeder Zahl und jedem Zitat. */
export const SourceCredit: React.FC<SourceCreditProps> = ({sources, label = 'Quelle', delay = 0, align = 'left', style}) => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [delay, delay + 12], [0, 1], clamp);
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
				gap: 10,
				opacity: o,
				fontFamily: FONTS.body,
				fontSize: 22,
				fontWeight: 600,
				color: COLORS.textMuted,
				textShadow: '0 2px 8px rgba(0,0,0,0.8)',
				...style,
			}}
		>
			<svg width={22} height={22} viewBox="0 0 24 24" style={{flexShrink: 0}}>
				<circle cx={12} cy={12} r={10} fill="none" stroke={COLORS.textMuted} strokeWidth={2} />
				<rect x={11} y={10} width={2} height={7} fill={COLORS.textMuted} />
				<circle cx={12} cy={7} r={1.3} fill={COLORS.textMuted} />
			</svg>
			<span>
				{sources.length > 1 ? `${label}n` : label}: {sources.join(' · ')}
			</span>
		</div>
	);
};
