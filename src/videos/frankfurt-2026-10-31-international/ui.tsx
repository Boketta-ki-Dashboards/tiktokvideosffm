import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Flag} from '../../components/media/flags/Flag';
import {MediaBadge} from '../../components/media/MediaBadge';
import {clamp, EASE_OUT, springIn} from '../../lib/animation';
import {withAlpha} from '../../lib/color';
import {COLORS, FONTS, RADII, SHADOWS} from '../../theme/tokens';
import {artLabel, type MediaEntry, shortDate} from './content';

/** Dunkles Panel im Studio-Look. */
export const Panel: React.FC<{children: React.ReactNode; accent?: string; style?: React.CSSProperties}> = ({children, accent = COLORS.panelBorder, style}) => (
	<div
		style={{
			padding: '18px 22px',
			borderRadius: RADII.md,
			background: 'linear-gradient(160deg, rgba(26, 36, 78, 0.95), rgba(9, 13, 34, 0.95))',
			border: `2px solid ${accent}`,
			boxShadow: SHADOWS.card,
			...style,
		}}
	>
		{children}
	</div>
);

/** Springt bei `delay` ein (Skalierung + Versatz). */
export const PopIn: React.FC<{delay: number; children: React.ReactNode; from?: 'left' | 'right' | 'bottom' | 'top' | 'none'; style?: React.CSSProperties; damping?: number}> = ({
	delay,
	children,
	from = 'bottom',
	style,
	damping = 14,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = springIn({frame, fps, delay, damping});
	const d = (1 - s) * 90;
	const t = from === 'left' ? `${-d}px 0` : from === 'right' ? `${d}px 0` : from === 'top' ? `0 ${-d}px` : from === 'bottom' ? `0 ${d}px` : '0 0';
	return <div style={{opacity: Math.min(1, s * 1.6), translate: t, scale: String(0.85 + 0.15 * s), ...style}}>{children}</div>;
};

/** Kompakte, belegte Schlagzeilenkarte: Flagge, neutrale Wortmarke, Datum, Wortlaut, „DE:“-Übersetzung, Art der Meldung. */
export const NewsCard: React.FC<{
	m: MediaEntry;
	width?: number;
	headlineSize?: number;
	showTranslation?: boolean;
	highlight?: {text: string; from: number};
	style?: React.CSSProperties;
}> = ({m, width = 866, headlineSize = 30, showTranslation = true, highlight, style}) => {
	const frame = useCurrentFrame();
	const text = m.nurErwaehnung && m.passage ? m.passage : m.headline;
	const hl = highlight && text.includes(highlight.text) ? highlight : undefined;
	const hlP = hl ? interpolate(frame, [hl.from, hl.from + 10], [0, 1], {...clamp, easing: EASE_OUT}) : 0;
	const parts = hl ? text.split(hl.text) : [text];
	return (
		<div
			style={{
				width,
				padding: '16px 20px',
				borderRadius: RADII.md,
				background: 'linear-gradient(160deg, rgba(30, 40, 84, 0.97), rgba(12, 17, 42, 0.97))',
				border: `2px solid ${COLORS.panelBorder}`,
				boxShadow: SHADOWS.card,
				display: 'flex',
				flexDirection: 'column',
				gap: 8,
				...style,
			}}
		>
			<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
				<Flag code={m.country} width={48} rounded={5} shadow={false} />
				<MediaBadge name={m.outlet} size="sm" />
				<div style={{flex: 1}} />
				<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted, whiteSpace: 'nowrap'}}>
					{m.land} · {shortDate(m.datum)}
				</span>
			</div>
			<div style={{fontFamily: FONTS.body, fontWeight: 800, fontSize: headlineSize, lineHeight: 1.16, color: COLORS.text}}>
				{m.nurErwaehnung ? <span style={{color: COLORS.textMuted, fontWeight: 700}}>Im Text: </span> : null}„
				{hl ? (
					<>
						{parts[0]}
						<span
							style={{
								color: hlP > 0.5 ? '#0B1029' : COLORS.text,
								background: withAlpha(COLORS.signal, hlP),
								borderRadius: 6,
								padding: '0 4px',
							}}
						>
							{hl.text}
						</span>
						{parts.slice(1).join(hl.text)}
					</>
				) : (
					text
				)}
				“
			</div>
			{showTranslation && m.de && m.sprache !== 'de' ? (
				<div style={{fontFamily: FONTS.body, fontWeight: 500, fontSize: 23, lineHeight: 1.22, color: COLORS.textMuted}}>
					<span style={{color: COLORS.signal, fontWeight: 800}}>DE: </span>
					{m.de}
				</div>
			) : null}
			<div style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, color: COLORS.textDim}}>{artLabel(m)}</div>
		</div>
	);
};

/** Stempel („FALSCH“, „NICHT BEKANNT“) – knallt mit leichtem Überschwinger auf. */
export const Stamp: React.FC<{text: string; sub?: string; at: number; color?: string; rotate?: number; size?: number}> = ({text, sub, at, color = COLORS.alert, rotate = -8, size = 92}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	if (frame < at) {
		return null;
	}

	const s = springIn({frame, fps, delay: at, damping: 9, stiffness: 220});
	return (
		<div
			style={{
				display: 'inline-flex',
				flexDirection: 'column',
				alignItems: 'center',
				padding: '10px 30px 12px',
				border: `8px solid ${color}`,
				borderRadius: 18,
				background: withAlpha('#070B1A', 0.82),
				rotate: `${rotate}deg`,
				scale: String(2.2 - 1.2 * s),
				opacity: Math.min(1, s * 2),
				boxShadow: `0 0 60px ${withAlpha(color, 0.45)}`,
			}}
		>
			<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: size, letterSpacing: 6, color, lineHeight: 1}}>{text}</span>
			{sub ? <span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, color: COLORS.text, marginTop: 6}}>{sub}</span> : null}
		</div>
	);
};

/** Kleine Info-Pille. */
export const Pill: React.FC<{children: React.ReactNode; color?: string; dark?: boolean; size?: number; style?: React.CSSProperties}> = ({children, color = COLORS.signal, dark = true, size = 30, style}) => (
	<div
		style={{
			display: 'inline-flex',
			alignItems: 'center',
			gap: 10,
			padding: '10px 22px',
			borderRadius: RADII.pill,
			background: dark ? withAlpha('#070B1A', 0.88) : color,
			border: `3px solid ${color}`,
			fontFamily: FONTS.heading,
			fontWeight: 900,
			fontSize: size,
			color: dark ? color : '#0B1029',
			whiteSpace: 'nowrap',
			...style,
		}}
	>
		{children}
	</div>
);

/** Erzwingt streng steigende Keyframe-Frames (interpolate verlangt das), auch wenn Cues eng beieinander liegen. */
export const increasing = <T extends {frame: number}>(keys: T[]): T[] => {
	let last = -Infinity;
	return keys.map((k) => {
		const frame = Math.max(k.frame, last + 1);
		last = frame;
		return {...k, frame};
	});
};
