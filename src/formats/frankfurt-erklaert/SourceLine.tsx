import React from 'react';
import {interpolate, Sequence, useCurrentFrame} from 'remotion';
import {clamp} from '../../lib/animation';
import {FONTS} from '../../theme/tokens';
import {SOURCE_LINE_BOX, SOURCE_LINE_STYLE, type SourceLineEntry} from './source-line.ts';
import {LAYOUT} from './theme';

export {resolveSourceLine, type SourceCue, type SourceLineEntry, sourceLineHeight} from './source-line.ts';

const Pill: React.FC<{text: string; duration: number; fadeOut?: boolean}> = ({text, duration, fadeOut = false}) => {
	const frame = useCurrentFrame();
	const o = Math.min(interpolate(frame, [0, 6], [0, 1], clamp), fadeOut ? interpolate(frame, [duration - 5, duration], [1, 0], clamp) : 1);
	const y = interpolate(frame, [0, 6], [8, 0], clamp);
	const S = SOURCE_LINE_STYLE;
	return (
		<div style={{position: 'absolute', left: SOURCE_LINE_BOX.left, width: SOURCE_LINE_BOX.width, top: LAYOUT.sourceLineTop, display: 'flex', justifyContent: 'center', opacity: o, translate: `0 ${y}px`}}>
			<div style={{display: 'flex', alignItems: 'flex-start', gap: S.gap, maxWidth: SOURCE_LINE_BOX.width, padding: `${S.padY}px ${S.padX}px`, borderRadius: 14, background: S.background, boxSizing: 'border-box'}}>
				<svg width={S.iconSize} height={S.iconSize} viewBox="0 0 24 24" style={{flexShrink: 0, marginTop: (LAYOUT.sourceLineFont * LAYOUT.sourceLineLineHeight - S.iconSize) / 2}}>
					<path d="M6 2.5h8l4.5 4.5V21.5H6z" fill="none" stroke={S.icon} strokeWidth={2} strokeLinejoin="round" />
					<path d="M14 2.5V7h4.5M8.8 12h6.4M8.8 15.5h6.4M8.8 19h4" fill="none" stroke={S.icon} strokeWidth={2} strokeLinecap="round" />
				</svg>
				<span
					style={{
						fontFamily: FONTS.body,
						fontWeight: 600,
						fontSize: LAYOUT.sourceLineFont,
						lineHeight: LAYOUT.sourceLineLineHeight,
						color: S.color,
						textAlign: 'left',
						display: '-webkit-box',
						WebkitLineClamp: LAYOUT.sourceLineMaxLines,
						WebkitBoxOrient: 'vertical',
						overflow: 'hidden',
						textShadow: '0 1px 4px rgba(0,0,0,0.9)',
					}}
				>
					{text}
				</span>
			</div>
		</div>
	);
};

/**
 * Quellenzeile UNTER den Untertiteln (Format-Regel ab #12): hellgrau, kleines Dokument-Symbol, halbtransparenter Hintergrund, 1–2 Zeilen,
 * immer im selben Bereich (y 1.512–1.630) – unabhängig davon, ob die Untertitel ein- oder zweizeilig sind (diese wachsen nach oben).
 */
export const SourceLine: React.FC<{entries: SourceLineEntry[]}> = ({entries}) => (
	<>
		{entries.map((e, i) => (
			<Sequence key={`${e.from}-${i}`} from={e.from} durationInFrames={e.to - e.from} layout="none" name={`Quelle ${i + 1}`}>
				<Pill text={e.text} duration={e.to - e.from} fadeOut />
			</Sequence>
		))}
	</>
);
