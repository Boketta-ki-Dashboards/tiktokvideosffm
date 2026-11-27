import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, springIn} from '../../lib/animation';
import {withAlpha} from '../../lib/color';
import {COLORS, FONTS, RADII, SHADOWS} from '../../theme/tokens';

export type ArticleCardProps = {
	/** z. B. „ARTIKEL 8“ */
	heading: string;
	/** z. B. „GRUNDGESETZ“ */
	law: string;
	/** Wörtlicher Gesetzestext; `mark` wird gelb markiert (Wortlaut-genau). */
	text: string;
	mark?: string;
	delay?: number;
	markFrame?: number;
	width?: number;
};

/** Gesetzes-Karte (Paragraphen-Symbol, Wortlaut mit Markierung) – nur wörtliche Gesetzestexte einsetzen. */
export const ArticleCard: React.FC<ArticleCardProps> = ({heading, law, text, mark, delay = 0, markFrame = 0, width = 866}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = springIn({frame, fps, delay, damping: 15});
	const m = interpolate(frame, [markFrame, markFrame + 16], [0, 1], clamp);
	const i = mark ? text.indexOf(mark) : -1;
	return (
		<div
			style={{
				width,
				borderRadius: RADII.lg,
				background: 'linear-gradient(165deg, #F4F1E4, #E3DEC8)',
				border: '5px solid #2A2F55',
				boxShadow: `${SHADOWS.card}, 0 0 50px ${withAlpha(COLORS.signal, 0.25)}`,
				padding: '30px 38px 34px',
				opacity: Math.min(1, s * 1.6),
				translate: `0 ${(1 - s) * 140}px`,
				rotate: `${(1 - s) * -4}deg`,
				scale: String(0.92 + 0.08 * s),
			}}
		>
			<div style={{display: 'flex', alignItems: 'center', gap: 20}}>
				<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 96, lineHeight: 0.9, color: '#2A2F55'}}>§</div>
				<div style={{display: 'flex', flexDirection: 'column'}}>
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 52, color: '#0B1029', lineHeight: 1}}>{heading}</span>
					<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 28, letterSpacing: 4, color: '#4A5580'}}>{law}</span>
				</div>
			</div>
			<div style={{height: 4, background: '#2A2F55', opacity: 0.35, margin: '18px 0'}} />
			<div style={{fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 700, fontSize: 36, lineHeight: 1.3, color: '#0B1029'}}>
				„
				{i >= 0 && mark ? (
					<>
						{text.slice(0, i)}
						<span style={{background: `linear-gradient(transparent 20%, ${withAlpha(COLORS.signal, 0.9 * m)} 20%)`, padding: '0 4px'}}>{mark}</span>
						{text.slice(i + mark.length)}
					</>
				) : (
					text
				)}
				“
			</div>
		</div>
	);
};
