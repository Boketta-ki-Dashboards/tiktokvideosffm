import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, EASE_OUT, springIn} from '../../lib/animation';
import {withAlpha} from '../../lib/color';
import {COLORS, FONTS} from '../../theme/tokens';
// Gemeinsames Premium-Designsystem (Glas-Karten, Typo-Skala) – nur importiert, nicht verändert
import {GlassCard} from '../frankfurt-2026-11-20-ausblick/premium/kit';
import type {InfoKind} from './content';

export {GlassCard, Rise, SectionLabel, SourceLine, TYPE} from '../frankfurt-2026-11-20-ausblick/premium/kit';

export type PIconName =
	| 'lock'
	| 'unlock'
	| 'fingerprint'
	| 'phone'
	| 'id'
	| 'upload'
	| 'eye'
	| 'x'
	| 'check'
	| 'gavel'
	| 'camera'
	| 'search'
	| 'shield'
	| 'scales'
	| 'chat'
	| 'doc'
	| 'tv'
	| 'person'
	| 'alert'
	| 'hand'
	| 'calm'
	| 'trash'
	| 'lawyer'
	| 'pin'
	| 'question'
	| 'image'
	| 'clock';

/** Linien-Icon-Set dieses Videos (24er Raster, runde Enden). */
export const PIcon: React.FC<{name: PIconName; size?: number; color?: string; stroke?: number}> = ({name, size = 36, color = '#FFFFFF', stroke = 2.2}) => {
	const p = {fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
	const body = (() => {
		switch (name) {
			case 'lock':
				return (
					<>
						<rect x={5} y={10.5} width={14} height={10} rx={2.2} {...p} />
						<path d="M8 10.5V7.5a4 4 0 018 0v3" {...p} />
						<circle cx={12} cy={15.5} r={1.1} fill={color} />
					</>
				);
			case 'unlock':
				return (
					<>
						<rect x={5} y={10.5} width={14} height={10} rx={2.2} {...p} />
						<path d="M8 10.5V7.5a4 4 0 017.6-1.8" {...p} />
					</>
				);
			case 'fingerprint':
				return <path d="M7.5 19c1-2 1.5-4 1.5-7a3 3 0 016 0c0 3-.4 5.5-1.4 8M11.9 12c0 3.5-.6 6-2 8.4M17.6 17c.3-1.5.4-3 .4-5a6 6 0 00-10.5-4M5.6 15c.3-1 .4-2 .4-3 0-1 .2-2 .6-2.8" {...p} />;
			case 'phone':
				return (
					<>
						<rect x={6.5} y={2.5} width={11} height={19} rx={2.5} {...p} />
						<path d="M10.5 5h3" {...p} />
					</>
				);
			case 'id':
				return (
					<>
						<rect x={2.5} y={5} width={19} height={14} rx={2.2} {...p} />
						<circle cx={8.5} cy={11} r={2.2} {...p} />
						<path d="M5.5 16.2c.6-1.4 1.7-2 3-2s2.4.6 3 2M14 10h4.5M14 13.5h3" {...p} />
					</>
				);
			case 'upload':
				return <path d="M12 15V4M7.5 8.5L12 4l4.5 4.5M4.5 15v3.5a2 2 0 002 2h11a2 2 0 002-2V15" {...p} />;
			case 'eye':
				return (
					<>
						<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" {...p} />
						<circle cx={12} cy={12} r={3} {...p} />
					</>
				);
			case 'x':
				return <path d="M6 6l12 12M18 6L6 18" {...p} />;
			case 'check':
				return <path d="M5 12.5l4.2 4.2L19 7" {...p} />;
			case 'gavel':
				return <path d="M13.5 4.5l6 6M11 7l6 6M12.2 5.8l-4 4 6 6 4-4M10.2 11.8L3.5 18.5M4 21h9" {...p} />;
			case 'camera':
				return (
					<>
						<path d="M3.5 8.5a2 2 0 012-2h2l1.5-2h6l1.5 2h2a2 2 0 012 2v9a2 2 0 01-2 2h-13a2 2 0 01-2-2z" {...p} />
						<circle cx={12} cy={13} r={3.5} {...p} />
					</>
				);
			case 'search':
				return (
					<>
						<circle cx={10.5} cy={10.5} r={6} {...p} />
						<path d="M15 15l5.5 5.5" {...p} />
					</>
				);
			case 'shield':
				return <path d="M12 2.5l7.5 3v6c0 4.7-3.2 8.6-7.5 10-4.3-1.4-7.5-5.3-7.5-10v-6z" {...p} />;
			case 'scales':
				return (
					<>
						<path d="M12 3v17M6 20h12M5 7h14" {...p} />
						<path d="M5 7l-3 6a3 3 0 006 0zM19 7l-3 6a3 3 0 006 0z" {...p} />
					</>
				);
			case 'chat':
				return <path d="M4 5h16v11H9l-5 4z" {...p} />;
			case 'doc':
				return <path d="M6.5 2.5h8l4 4v15h-12zM14.5 2.5v4h4M9 11h6M9 14.5h6M9 18h4" {...p} />;
			case 'tv':
				return (
					<>
						<rect x={3} y={6} width={18} height={12} rx={2} {...p} />
						<path d="M9 21h6M8.5 2.5L12 6l3.5-3.5" {...p} />
					</>
				);
			case 'person':
				return (
					<>
						<circle cx={12} cy={8} r={3.6} {...p} />
						<path d="M5 20.5c.8-3.6 3.6-5.6 7-5.6s6.2 2 7 5.6" {...p} />
					</>
				);
			case 'alert':
				return <path d="M12 3.5l9.5 16.5h-19zM12 10v4.5M12 17.2v.1" {...p} />;
			case 'hand':
				return <path d="M8 12V5.5a1.5 1.5 0 013 0V11M11 10V4a1.5 1.5 0 013 0v6M14 10V5.5a1.5 1.5 0 013 0V13c0 4-2.5 7.5-6.5 7.5-2.5 0-4-1.3-5.4-3.4L3.5 13.6a1.5 1.5 0 012.5-1.6L8 14.5" {...p} />;
			case 'calm':
				return (
					<>
						<circle cx={12} cy={12} r={9} {...p} />
						<path d="M8.2 10h1.6M14.2 10h1.6M8.5 14.8c1 .9 2.2 1.3 3.5 1.3s2.5-.4 3.5-1.3" {...p} />
					</>
				);
			case 'trash':
				return <path d="M4.5 6.5h15M9.5 6.5V4h5v2.5M6.5 6.5l1 14h9l1-14M10 10.5v6.5M14 10.5v6.5" {...p} />;
			case 'lawyer':
				return (
					<>
						<circle cx={12} cy={7} r={3.4} {...p} />
						<path d="M5 20.5c.6-3.4 3.4-5.4 7-5.4s6.4 2 7 5.4M12 15.1l-1.6 2.4L12 20.5l1.6-3z" {...p} />
					</>
				);
			case 'pin':
				return (
					<>
						<rect x={3.5} y={6.5} width={17} height={11} rx={2.5} {...p} />
						<circle cx={8} cy={12} r={1} fill={color} />
						<circle cx={12} cy={12} r={1} fill={color} />
						<circle cx={16} cy={12} r={1} fill={color} />
					</>
				);
			case 'question':
				return (
					<>
						<path d="M9 9a3 3 0 115.2 2c-.9.9-2.2 1.5-2.2 3" {...p} />
						<circle cx={12} cy={18} r={0.9} fill={color} />
					</>
				);
			case 'image':
				return (
					<>
						<rect x={3} y={4.5} width={18} height={15} rx={2.2} {...p} />
						<circle cx={8.5} cy={9.5} r={1.6} {...p} />
						<path d="M3.5 17l5-5 4 4 2.5-2.5 5.5 5.5" {...p} />
					</>
				);
			case 'clock':
				return (
					<>
						<circle cx={12} cy={12} r={9} {...p} />
						<path d="M12 7v5l3.5 2" {...p} />
					</>
				);
			default:
				return null;
		}
	})();
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" style={{flexShrink: 0, overflow: 'visible'}}>
			{body}
		</svg>
	);
};

export const KIND: Record<InfoKind, {color: string; icon: PIconName; label: string}> = {
	OFFIZIELL: {color: '#4FC3F7', icon: 'shield', label: 'OFFIZIELL'},
	BERICHT: {color: '#3DDC97', icon: 'tv', label: 'BERICHT'},
	SCHILDERUNG: {color: '#FFB15C', icon: 'person', label: 'SCHILDERUNG'},
	RECHT: {color: '#B794F6', icon: 'scales', label: 'RECHT'},
	TIPP: {color: '#FFD23F', icon: 'check', label: 'TIPP'},
};

/** Kleiner Kategorie-Chip (Kapitälchen + Icon). */
export const KindChip: React.FC<{kind: InfoKind; size?: number}> = ({kind, size = 22}) => {
	const k = KIND[kind];
	return (
		<span style={{display: 'inline-flex', alignItems: 'center', gap: 7, padding: '4px 11px 4px 8px', borderRadius: 9, background: k.color, boxShadow: `0 4px 14px ${withAlpha(k.color, 0.35)}`}}>
			<PIcon name={k.icon} size={size} color="#0B1029" stroke={2.6} />
			<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: size, letterSpacing: 1.5, color: '#0B1029', lineHeight: 1}}>{k.label}</span>
		</span>
	);
};

/** Aussage-Zeile im Premium-Stil mit Kategorie-Disc, Text und Lichtkante. */
export const InfoRow: React.FC<{kind: InfoKind; text: string; at: number; sub?: string; size?: number; style?: React.CSSProperties}> = ({kind, text, at, sub, size = 31, style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	if (frame < at - 1) return null;
	const s = springIn({frame, fps, delay: at, damping: 16, stiffness: 150});
	const k = KIND[kind];
	const sweep = interpolate(frame, [at + 4, at + 22], [-30, 130], {...clamp, easing: EASE_OUT});
	return (
		<div style={{opacity: Math.min(1, s * 1.8), translate: `${(1 - s) * -70}px 0`, ...style}}>
			<GlassCard padding="15px 22px 15px 16px" accent={k.color}>
				<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
					<div
						style={{
							width: 58,
							height: 58,
							borderRadius: 29,
							flexShrink: 0,
							background: `radial-gradient(circle at 35% 30%, ${withAlpha(k.color, 0.45)}, ${withAlpha(k.color, 0.14)})`,
							border: `2px solid ${withAlpha(k.color, 0.75)}`,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<PIcon name={k.icon} size={32} color={k.color} stroke={2.3} />
					</div>
					<div style={{display: 'flex', flexDirection: 'column', gap: 3}}>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 22, letterSpacing: 2.5, color: k.color}}>{k.label}</span>
						<span style={{fontFamily: FONTS.body, fontWeight: 800, fontSize: size, lineHeight: 1.18, color: COLORS.text}}>{text}</span>
						{sub ? <span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, lineHeight: 1.2, color: COLORS.textMuted}}>{sub}</span> : null}
					</div>
				</div>
				<div style={{position: 'absolute', top: 0, bottom: 0, left: `${sweep}%`, width: 120, background: 'linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)', pointerEvents: 'none'}} />
			</GlassCard>
		</div>
	);
};

/** Sprechblase (weiß, mit Schwanz links/rechts/unten). */
export const Bubble: React.FC<{children: React.ReactNode; tail?: 'left' | 'right' | 'down-left' | 'down-right'; color?: string; textColor?: string; style?: React.CSSProperties; maxWidth?: number}> = ({
	children,
	tail = 'down-left',
	color = '#FFFFFF',
	textColor = '#0B1029',
	style,
	maxWidth = 760,
}) => {
	const tailStyle: React.CSSProperties =
		tail === 'left'
			? {left: -12, top: 26}
			: tail === 'right'
				? {right: -12, top: 26}
				: tail === 'down-left'
					? {left: 44, bottom: -12}
					: {right: 44, bottom: -12};
	return (
		<div style={{position: 'relative', maxWidth, padding: '16px 24px', borderRadius: 26, background: color, boxShadow: '0 16px 40px rgba(0,0,0,0.45)', fontFamily: FONTS.heading, fontWeight: 800, fontSize: 34, lineHeight: 1.18, color: textColor, ...style}}>
			{children}
			<div style={{position: 'absolute', width: 26, height: 26, background: color, rotate: '45deg', borderRadius: 4, ...tailStyle}} />
		</div>
	);
};

/** Unterzeile mit Hinweis „keine Rechtsberatung“ (dezent, immer in der Sicherheitszone). */
export const LegalNote: React.FC<{text: string; at: number; top?: number}> = ({text, at, top = 1196}) => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [at, at + 12], [0, 1], clamp);
	return (
		<div style={{position: 'absolute', left: 64, width: 866, top, opacity: o, display: 'flex', alignItems: 'center', gap: 8}}>
			<PIcon name="scales" size={22} color={COLORS.textMuted} stroke={2} />
			<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, color: COLORS.textMuted, textShadow: '0 2px 8px rgba(0,0,0,0.9)'}}>{text}</span>
		</div>
	);
};
