import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, EASE_OUT, springIn} from '../../lib/animation';
import {withAlpha} from '../../lib/color';
import {COLORS, FONTS} from '../../theme/tokens';
import {GlassCard} from '../../videos/frankfurt-2026-11-20-ausblick/premium/kit';
import {PIcon, type PIconName} from '../../videos/frankfurt-2026-11-polizeikontrollen/ui';
import {ACCENT, LAYOUT} from './theme';

export {GlassCard, PIcon, type PIconName};

/** Einblenden mit Feder: Hub + Skalierung (rein frame-basiert). */
export const Pop: React.FC<{at: number; children: React.ReactNode; dx?: number; dy?: number; style?: React.CSSProperties; damping?: number}> = ({at, children, dx = 0, dy = 40, style, damping = 14}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	if (frame < at - 1) return null;
	const s = springIn({frame, fps, delay: at, damping, stiffness: 170});
	return <div style={{opacity: Math.min(1, s * 1.8), translate: `${(1 - s) * dx}px ${(1 - s) * dy}px`, scale: String(0.9 + 0.1 * s), ...style}}>{children}</div>;
};

/** Paragrafen-Chip („Art. 8 GG“, „§ 125 StGB“) – Quellen deutlich sichtbar. */
export const LawChip: React.FC<{text: string; size?: number; color?: string; style?: React.CSSProperties}> = ({text, size = 26, color = ACCENT.law, style}) => (
	<span
		style={{
			display: 'inline-flex',
			alignItems: 'center',
			gap: 8,
			padding: `${size * 0.25}px ${size * 0.55}px ${size * 0.25}px ${size * 0.4}px`,
			borderRadius: size * 0.45,
			background: withAlpha(color, 0.16),
			border: `2px solid ${withAlpha(color, 0.85)}`,
			boxShadow: `0 6px 18px ${withAlpha(color, 0.25)}`,
			...style,
		}}
	>
		<PIcon name="scales" size={size} color={color} stroke={2.3} />
		<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: size, letterSpacing: 0.5, color: COLORS.text, lineHeight: 1}}>{text}</span>
	</span>
);

/** Gleichung/Ungleichung als Kernaussage („DABEI SEIN ≠ STRAFBAR SEIN“). */
export const Equation: React.FC<{left: string; right: string; op?: '≠' | '='; at: number; leftColor?: string; rightColor?: string; size?: number; layout?: 'stack' | 'compact'}> = ({
	left,
	right,
	op = '≠',
	at,
	leftColor = ACCENT.yes,
	rightColor = ACCENT.no,
	size = 58,
	layout = 'stack',
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	if (frame < at - 1) return null;
	const a = springIn({frame, fps, delay: at, damping: 13, stiffness: 180});
	const o = springIn({frame, fps, delay: at + 6, damping: 10, stiffness: 200});
	const b = springIn({frame, fps, delay: at + 10, damping: 13, stiffness: 180});
	const slab = (text: string, color: string, s: number, dark: boolean) => (
		<div
			style={{
				padding: '14px 28px 16px',
				borderRadius: 22,
				background: dark ? 'rgba(8,10,28,0.94)' : `linear-gradient(160deg, ${color} 0%, ${withAlpha(color, 0.85)} 100%)`,
				border: dark ? `3px solid ${color}` : '3px solid rgba(255,255,255,0.35)',
				boxShadow: dark ? `0 20px 50px rgba(0,0,0,0.5)` : `0 5px 0 ${withAlpha('#000000', 0.25)}, 0 24px 50px rgba(0,0,0,0.5)`,
				fontFamily: FONTS.heading,
				fontWeight: 900,
				fontSize: size,
				lineHeight: 1.02,
				color: dark ? COLORS.text : ACCENT.ink,
				textAlign: 'center',
				opacity: Math.min(1, s * 2),
				scale: String(0.7 + 0.3 * s),
			}}
		>
			{text}
		</div>
	);
	const disc = (
		<div style={{width: size * 1.45, height: size * 1.45, borderRadius: size, background: COLORS.signal, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: size * 1.1, color: ACCENT.ink, boxShadow: `0 0 36px ${withAlpha(COLORS.signal, 0.6)}`, scale: String(o), rotate: `${(1 - o) * -120}deg`}}>
			{op}
		</div>
	);
	if (layout === 'compact') {
		return (
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
					{slab(left, leftColor, a, false)}
					{disc}
				</div>
				{slab(right, rightColor, b, true)}
			</div>
		);
	}

	return (
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
			{slab(left, leftColor, a, false)}
			<div style={{width: size * 1.45, height: size * 1.45, borderRadius: size, background: COLORS.signal, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: size * 1.1, color: ACCENT.ink, boxShadow: `0 0 36px ${withAlpha(COLORS.signal, 0.6)}`, scale: String(o), rotate: `${(1 - o) * -120}deg`}}>
				{op}
			</div>
			{slab(right, rightColor, b, true)}
		</div>
	);
};

/** Info-Karte mit großem Icon, Titel, Text und Paragraf. */
export const InfoCard: React.FC<{icon: PIconName; title: string; text?: string; law?: string; color: string; at: number; compact?: boolean; style?: React.CSSProperties}> = ({icon, title, text, law, color, at, compact = false, style}) => {
	const frame = useCurrentFrame();
	const sweep = interpolate(frame, [at + 4, at + 24], [-30, 130], {...clamp, easing: EASE_OUT});
	return (
		<Pop at={at} dy={50} style={style}>
			<GlassCard padding={compact ? '16px 16px 18px' : '18px 22px 20px'} accent={color} style={{height: '100%'}}>
				<div style={{display: 'flex', flexDirection: compact ? 'column' : 'row', alignItems: compact ? 'center' : 'flex-start', gap: compact ? 10 : 18, textAlign: compact ? 'center' : 'left'}}>
					<div style={{width: compact ? 92 : 78, height: compact ? 92 : 78, borderRadius: 24, flexShrink: 0, background: `radial-gradient(circle at 35% 30%, ${withAlpha(color, 0.55)}, ${withAlpha(color, 0.14)})`, border: `2.5px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 26px ${withAlpha(color, 0.35)}`}}>
						<PIcon name={icon} size={compact ? 54 : 46} color={color} stroke={2.1} />
					</div>
					<div style={{display: 'flex', flexDirection: 'column', gap: 6, alignItems: compact ? 'center' : 'flex-start'}}>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: compact ? 28 : 34, lineHeight: 1.05, color: COLORS.text}}>{title}</span>
						{text ? <span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 27, lineHeight: 1.2, color: COLORS.textMuted}}>{text}</span> : null}
						{law ? <span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 22, color}}>{law}</span> : null}
					</div>
				</div>
				<div style={{position: 'absolute', top: 0, bottom: 0, left: `${sweep}%`, width: 110, background: 'linear-gradient(100deg, rgba(255,255,255,0), rgba(255,255,255,0.1), rgba(255,255,255,0))', pointerEvents: 'none'}} />
			</GlassCard>
		</Pop>
	);
};

/** Große Kapitel-Nummer + Frage (einheitliche Szenenüberschrift des Formats). */
export const ChapterTitle: React.FC<{num: string; text: string; color: string; at?: number}> = ({num, text, color, at = 0}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = springIn({frame, fps, delay: at, damping: 15, stiffness: 160});
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: 16, opacity: Math.min(1, s * 2), translate: `${(1 - s) * -40}px 0`}}>
			<div style={{width: 66, height: 66, borderRadius: 20, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 38, color: ACCENT.ink, boxShadow: `0 10px 30px ${withAlpha(color, 0.45)}`}}>{num}</div>
			<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 58, lineHeight: 1.02, color: COLORS.text, textShadow: '0 6px 24px rgba(0,0,0,0.7)'}}>{text}</span>
		</div>
	);
};

/** Quellenzeile am festen Platz (unten in der Inhaltszone). */
export const SourceBar: React.FC<{text: string; at: number}> = ({text, at}) => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [at, at + 10], [0, 1], clamp);
	return (
		<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: LAYOUT.sourceTop, opacity: o, display: 'flex', alignItems: 'center', gap: 8}}>
			<PIcon name="doc" size={22} color={COLORS.textMuted} stroke={2} />
			<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, color: COLORS.textMuted, textShadow: '0 2px 8px rgba(0,0,0,0.95)'}}>{text}</span>
		</div>
	);
};
