import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {springIn} from '../../lib/animation';
import {COLORS, FONTS, SHADOWS} from '../../theme/tokens';

export type KineticTextProps = {
	text: string;
	/** Wörter (exakte Schreibweise), die farbig hervorgehoben werden. */
	highlight?: string[];
	highlightColor?: string;
	delay?: number;
	/** Frames zwischen zwei Wörtern. */
	stagger?: number;
	fontSize?: number;
	fontWeight?: number;
	color?: string;
	align?: 'left' | 'center' | 'right';
	lineHeight?: number;
	maxWidth?: number;
	style?: React.CSSProperties;
};

/** Wort-für-Wort-Animation (Hochschieben aus einer Maske) – Standard für Titel. */
export const KineticText: React.FC<KineticTextProps> = ({
	text,
	highlight = [],
	highlightColor = COLORS.signal,
	delay = 0,
	stagger = 3,
	fontSize = 84,
	fontWeight = 900,
	color = COLORS.text,
	align = 'left',
	lineHeight = 1.05,
	maxWidth,
	style,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const words = text.split(' ');
	return (
		<div
			style={{
				display: 'flex',
				flexWrap: 'wrap',
				justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
				columnGap: fontSize * 0.26,
				rowGap: fontSize * 0.04,
				fontFamily: FONTS.heading,
				fontWeight,
				fontSize,
				lineHeight,
				maxWidth,
				textShadow: SHADOWS.text,
				...style,
			}}
		>
			{words.map((word, i) => {
				const s = springIn({frame, fps, delay: delay + i * stagger, damping: 15, stiffness: 160});
				const isHighlight = highlight.includes(word.replace(/[.,:!?]/g, ''));
				return (
					<span key={i} style={{display: 'inline-block', overflow: 'hidden', paddingBottom: fontSize * 0.06}}>
						<span
							style={{
								display: 'inline-block',
								// weit genug nach unten + unsichtbar vor dem Start, damit gedrehte Glyphen nicht aus der Maske ragen
								translate: `0 ${(1 - s) * 150}%`,
								rotate: `${(1 - s) * 5}deg`,
								opacity: Math.min(1, s * 4),
								color: isHighlight ? highlightColor : color,
							}}
						>
							{word}
						</span>
					</span>
				);
			})}
		</div>
	);
};
