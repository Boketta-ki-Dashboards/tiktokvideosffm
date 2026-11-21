import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, EASE_OUT, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {COLORS, FONTS} from '../../../theme/tokens';
import type {StatusKind} from '../ui';

/**
 * Premium-Designsystem für „20. November“: eine Typo-Skala, ein Kartenstil, ein Icon-Set.
 * Alle Premium-Szenen bauen ausschließlich hierauf auf (Konsistenz von Radien, Schatten, Abständen).
 */
export const TYPE = {
	hero: 104,
	title: 64,
	h3: 40,
	body: 32,
	label: 24,
	source: 22,
} as const;

export const RADIUS = 28;

export const STATUS: Record<StatusKind, {color: string; icon: IconName}> = {
	FAKT: {color: '#3DDC97', icon: 'check'},
	ANGEKÜNDIGT: {color: '#4FC3F7', icon: 'megaphone'},
	EINSCHÄTZUNG: {color: '#FFD23F', icon: 'bulb'},
	OFFEN: {color: '#C3CAE6', icon: 'hourglass'},
	FIKTION: {color: '#B794F6', icon: 'sparkle'},
};

/** Glas-Karte mit Lichtkante, weichem Schatten und optionalem Akzentstreifen. */
export const GlassCard: React.FC<{children: React.ReactNode; accent?: string; padding?: string; style?: React.CSSProperties; tone?: 'dark' | 'light'}> = ({
	children,
	accent,
	padding = '22px 26px',
	style,
	tone = 'dark',
}) => (
	<div
		style={{
			position: 'relative',
			padding,
			borderRadius: RADIUS,
			background:
				tone === 'dark'
					? 'linear-gradient(165deg, rgba(34, 46, 98, 0.94) 0%, rgba(14, 19, 48, 0.95) 55%, rgba(9, 12, 32, 0.96) 100%)'
					: 'linear-gradient(165deg, #FFFFFF 0%, #EEF1FA 100%)',
			border: `1.5px solid ${tone === 'dark' ? 'rgba(255,255,255,0.14)' : 'rgba(10,16,40,0.12)'}`,
			boxShadow: `inset 0 1.5px 0 ${tone === 'dark' ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.9)'}, 0 28px 70px rgba(0,0,0,0.5), 0 8px 18px rgba(0,0,0,0.3)`,
			overflow: 'hidden',
			...style,
		}}
	>
		{accent ? <div style={{position: 'absolute', left: 0, top: 18, bottom: 18, width: 6, borderRadius: 3, background: accent, boxShadow: `0 0 18px ${withAlpha(accent, 0.7)}`}} /> : null}
		{children}
	</div>
);

/** Erscheinen: Feder + leichter Hub + Blur-freie Unschärfe-Simulation über Opazität. */
export const Rise: React.FC<{at: number; children: React.ReactNode; dy?: number; dx?: number; style?: React.CSSProperties; damping?: number}> = ({at, children, dy = 50, dx = 0, style, damping = 16}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	if (frame < at - 1) return null;
	const s = springIn({frame, fps, delay: at, damping, stiffness: 140});
	return <div style={{opacity: Math.min(1, s * 1.8), translate: `${(1 - s) * dx}px ${(1 - s) * dy}px`, scale: String(0.94 + 0.06 * s), ...style}}>{children}</div>;
};

export type IconName = 'check' | 'megaphone' | 'bulb' | 'hourglass' | 'sparkle' | 'shield' | 'scales' | 'clock' | 'board' | 'pumpkin' | 'calendar' | 'chat' | 'wave' | 'flame' | 'store' | 'question' | 'columns' | 'coin';

/** Einheitliches Linien-Icon-Set (24er Raster, runde Enden). */
export const Icon: React.FC<{name: IconName; size?: number; color?: string; stroke?: number}> = ({name, size = 36, color = '#FFFFFF', stroke = 2.2}) => {
	const p = {fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
	const body = (() => {
		switch (name) {
			case 'check':
				return <path d="M5 12.5l4.2 4.2L19 7" {...p} />;
			case 'megaphone':
				return (
					<>
						<path d="M4 10v4h3l7 4V6L7 10z" {...p} />
						<path d="M17.5 9.5a3.5 3.5 0 010 5" {...p} />
					</>
				);
			case 'bulb':
				return (
					<>
						<path d="M9 17h6M10 20h4" {...p} />
						<path d="M12 3a6 6 0 00-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0012 3z" {...p} />
					</>
				);
			case 'hourglass':
				return <path d="M7 3h10M7 21h10M8 3c0 5 8 5 8 9s-8 4-8 9M16 3c0 5-8 5-8 9s8 4 8 9" {...p} />;
			case 'sparkle':
				return <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM18 16l.8 2.2L21 19l-2.2.8L18 22l-.8-2.2L15 19l2.2-.8z" {...p} />;
			case 'shield':
				return <path d="M12 2.5l7.5 3v6c0 4.7-3.2 8.6-7.5 10-4.3-1.4-7.5-5.3-7.5-10v-6z" {...p} />;
			case 'scales':
				return (
					<>
						<path d="M12 3v17M6 20h12M5 7h14M12 5l0 2" {...p} />
						<path d="M5 7l-3 6a3 3 0 006 0zM19 7l-3 6a3 3 0 006 0z" {...p} />
					</>
				);
			case 'clock':
				return (
					<>
						<circle cx={12} cy={12} r={9} {...p} />
						<path d="M12 7v5l3.5 2" {...p} />
					</>
				);
			case 'board':
				return (
					<>
						<rect x={3} y={4} width={18} height={16} rx={1.5} {...p} />
						<path d="M3 9.3h18M3 14.6h18" {...p} />
						<circle cx={6} cy={6.6} r={0.6} fill={color} />
						<circle cx={18} cy={6.6} r={0.6} fill={color} />
					</>
				);
			case 'pumpkin':
				return (
					<>
						<path d="M12 7c-5 0-8 2.6-8 6.3S7 20 12 20s8-3 8-6.7S17 7 12 7z" {...p} />
						<path d="M12 7c-2 0-3 2.6-3 6.5S10 20 12 20M12 7c2 0 3 2.6 3 6.5S14 20 12 20M12 7V4.5l2-1" {...p} />
					</>
				);
			case 'calendar':
				return (
					<>
						<rect x={3.5} y={5} width={17} height={15.5} rx={2.5} {...p} />
						<path d="M3.5 10h17M8 3v4M16 3v4" {...p} />
					</>
				);
			case 'chat':
				return <path d="M4 5h16v11H9l-5 4z" {...p} />;
			case 'wave':
				return <path d="M3 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0M3 17c2-3 4-3 6 0s4 3 6 0 4-3 6 0" {...p} />;
			case 'flame':
				return <path d="M12 3c1 3.5 5 5 5 10a5 5 0 01-10 0c0-2.5 1.5-3.6 2-5.5.8 1.6 1.5 2.2 2.5 2.5C12 7.5 11.5 5.5 12 3z" {...p} />;
			case 'store':
				return (
					<>
						<path d="M4 9.5V20h16V9.5M3 9.5l1.6-5h14.8l1.6 5z" {...p} />
						<path d="M9.5 20v-5.5h5V20" {...p} />
					</>
				);
			case 'columns':
				return <path d="M3 9.5L12 4l9 5.5M4.5 10v8M9.5 10v8M14.5 10v8M19.5 10v8M3 20.5h18" {...p} />;
			case 'coin':
				return (
					<>
						<circle cx={12} cy={12} r={8.5} {...p} />
						<path d="M14.5 8.8a3.6 3.6 0 100 6.4M7.8 11h5M7.8 13.2h5" {...p} />
					</>
				);
			case 'question':
				return (
					<>
						<path d="M9 9a3 3 0 115.2 2c-.9.9-2.2 1.5-2.2 3" {...p} />
						<circle cx={12} cy={18} r={0.9} fill={color} />
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

/** Status-Zeile im Premium-Stil: Icon-Disc, Kategorie in Kapitälchen, Aussage groß. */
export const StatusRow: React.FC<{kind: StatusKind; text: string; at: number; size?: number; style?: React.CSSProperties}> = ({kind, text, at, size = TYPE.body, style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	if (frame < at - 1) return null;
	const s = springIn({frame, fps, delay: at, damping: 16, stiffness: 150});
	const {color, icon} = STATUS[kind];
	const sweep = interpolate(frame, [at + 4, at + 22], [-30, 130], {...clamp, easing: EASE_OUT});
	return (
		<div style={{opacity: Math.min(1, s * 1.8), translate: `${(1 - s) * -70}px 0`, ...style}}>
			<GlassCard padding="16px 22px 16px 18px" accent={color}>
				<div style={{display: 'flex', alignItems: 'center', gap: 18}}>
					<div
						style={{
							width: 62,
							height: 62,
							borderRadius: 31,
							flexShrink: 0,
							background: `radial-gradient(circle at 35% 30%, ${withAlpha(color, 0.45)}, ${withAlpha(color, 0.14)})`,
							border: `2px solid ${withAlpha(color, 0.75)}`,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Icon name={icon} size={34} color={color} stroke={2.4} />
					</div>
					<div style={{display: 'flex', flexDirection: 'column', gap: 2}}>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: TYPE.label, letterSpacing: 2.5, color}}>{kind}</span>
						<span style={{fontFamily: FONTS.body, fontWeight: 800, fontSize: size, lineHeight: 1.16, color: COLORS.text}}>{text}</span>
					</div>
				</div>
				{/* Lichtkante, die einmal über die Karte streicht */}
				<div style={{position: 'absolute', top: 0, bottom: 0, left: `${sweep}%`, width: 120, background: 'linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0) 100%)', pointerEvents: 'none'}} />
			</GlassCard>
		</div>
	);
};

/** Abschnitts-Label oben links (ersetzt den einfachen Kicker) – Nummer + Titel. */
export const SectionLabel: React.FC<{num?: string; text: string; color: string; at?: number}> = ({num, text, color, at = -20}) => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [at, at + 14], [0, 1], {...clamp, easing: EASE_OUT});
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: 14, opacity: p, translate: `${(1 - p) * -30}px 0`}}>
			{num ? (
				<div style={{width: 54, height: 54, borderRadius: 16, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: '#0B1029', boxShadow: `0 10px 26px ${withAlpha(color, 0.45)}`}}>
					{num}
				</div>
			) : null}
			<div style={{display: 'flex', flexDirection: 'column'}}>
				<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, letterSpacing: 1, color: COLORS.text, lineHeight: 1}}>{text}</span>
				<div style={{marginTop: 8, height: 4, width: `${p * 100}%`, maxWidth: 220, borderRadius: 2, background: color}} />
			</div>
		</div>
	);
};

/** Quellenzeile, einheitlich. */
export const SourceLine: React.FC<{text: string; at: number; top?: number}> = ({text, at, top = 1238}) => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [at, at + 12], [0, 1], clamp);
	return (
		<div style={{position: 'absolute', left: 64, width: 866, top, opacity: o, display: 'flex', alignItems: 'center', gap: 8}}>
			<div style={{width: 6, height: 6, borderRadius: 3, background: COLORS.textMuted}} />
			<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: TYPE.source, color: COLORS.textMuted, textShadow: '0 2px 8px rgba(0,0,0,0.9)'}}>{text}</span>
		</div>
	);
};
