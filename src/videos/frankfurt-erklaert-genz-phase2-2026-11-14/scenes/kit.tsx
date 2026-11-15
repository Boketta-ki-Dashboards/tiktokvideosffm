import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, EASE_OUT, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {COLORS, FONTS} from '../../../theme/tokens';
import {Pop} from '../../../formats/frankfurt-erklaert/components';
import {ACCENT} from '../../../formats/frankfurt-erklaert/theme';

/** Bausteine der Folge „Gen Z regelt – Phase 2“ (eigene Kopie, damit fertige Folgen unverändert bleiben). */

export type P2IconName = 'pin' | 'shield' | 'check' | 'plus' | 'chat' | 'clock' | 'users' | 'info' | 'flare' | 'alert' | 'line' | 'doc' | 'gavel' | 'route' | 'school' | 'megaphone';

export const P2Icon: React.FC<{name: P2IconName; size?: number; color?: string; stroke?: number}> = ({name, size = 36, color = '#FFFFFF', stroke = 2.2}) => {
	const p = {fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
	const body = (() => {
		switch (name) {
			case 'pin':
				return (
					<>
						<path d="M12 21.5s-7-6.2-7-11.5a7 7 0 0 1 14 0c0 5.3-7 11.5-7 11.5z" {...p} />
						<circle cx={12} cy={10} r={2.6} {...p} />
					</>
				);
			case 'shield':
				return <path d="M12 2.5 20 5.5v6c0 5-3.5 8.7-8 10-4.5-1.3-8-5-8-10v-6l8-3z" {...p} />;
			case 'check':
				return <path d="m4.5 12.5 5 5 10-11" {...p} />;
			case 'plus':
				return <path d="M12 5v14M5 12h14" {...p} />;
			case 'chat':
				return <path d="M4 5h16v11H10l-5 4v-4H4z" {...p} />;
			case 'clock':
				return (
					<>
						<circle cx={12} cy={12} r={9} {...p} />
						<path d="M12 7v5l3.5 2" {...p} />
					</>
				);
			case 'users':
				return (
					<>
						<circle cx={9} cy={8} r={3.2} {...p} />
						<path d="M3 20v-1.5a6 6 0 0 1 12 0V20" {...p} />
						<circle cx={17.5} cy={9} r={2.5} {...p} />
						<path d="M16.5 14.2a4.8 4.8 0 0 1 5 4.6V20" {...p} />
					</>
				);
			case 'info':
				return (
					<>
						<circle cx={12} cy={12} r={9} {...p} />
						<path d="M12 11v6M12 7.5v.5" {...p} />
					</>
				);
			case 'flare':
				return <path d="M12 21v-7M9 14h6M12 14c-3-2.5-3-6 0-10 3 4 3 7.5 0 10zM5 6l2 2M19 6l-2 2M12 1.5v1" {...p} />;
			case 'alert':
				return <path d="M12 3 2.5 20h19L12 3zM12 10v4.5M12 17.2v.3" {...p} />;
			case 'line':
				return <path d="M3 16h18M5 16v-5M9 16v-5M13 16v-5M17 16v-5M12 4v4M9.5 6.5 12 9l2.5-2.5" {...p} />;
			case 'doc':
				return <path d="M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6" {...p} />;
			case 'gavel':
				return <path d="m14 4 6 6M11 7l6 6M12.5 5.5l-4 4 6 6 4-4M9.5 12.5 3 19M3 21h9" {...p} />;
			case 'route':
				return <path d="M6 19a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM18 10a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM8.5 16.5h6a3 3 0 0 0 0-6h-5a3 3 0 0 1 0-6h6" {...p} />;
			case 'school':
				return <path d="M2.5 9 12 4.5 21.5 9 12 13.5zM6 11v5c3.5 2.5 8.5 2.5 12 0v-5M21.5 9v6" {...p} />;
			case 'megaphone':
				return <path d="M3 10v4h3l8 5V5L6 10H3zM18 9a4 4 0 0 1 0 6" {...p} />;
			default:
				return null;
		}
	})();
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" style={{flexShrink: 0}}>
			{body}
		</svg>
	);
};

export const Tag: React.FC<{text: string; color: string; icon?: P2IconName; at?: number}> = ({text, color, icon = 'pin', at = 0}) => (
	<Pop at={at} dy={20}>
		<div style={{display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 16px 6px 8px', borderRadius: 12, background: 'rgba(8,10,28,0.9)', border: `2px solid ${color}`, boxShadow: `0 8px 24px ${withAlpha(color, 0.25)}`}}>
			<span style={{width: 34, height: 34, borderRadius: 8, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<P2Icon name={icon} size={24} color={ACCENT.ink} stroke={2.6} />
			</span>
			<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 24, letterSpacing: 1.5, color: COLORS.text}}>{text}</span>
		</div>
	</Pop>
);

export type StatusKind = 'OFFIZIELL' | 'BERICHT' | 'ANGEKÜNDIGT' | 'OFFEN' | 'ILLUSTRATION' | 'LAUT POLIZEI';
export const STATUS_COLOR: Record<StatusKind, string> = {OFFIZIELL: ACCENT.info, 'LAUT POLIZEI': ACCENT.info, BERICHT: '#FFB15C', ANGEKÜNDIGT: ACCENT.signal, OFFEN: ACCENT.no, ILLUSTRATION: '#9AA6CC'};
export const Status: React.FC<{kind: StatusKind; size?: number}> = ({kind, size = 20}) => {
	const c = STATUS_COLOR[kind];
	return <span style={{display: 'inline-block', padding: `${size * 0.2}px ${size * 0.5}px`, borderRadius: size * 0.4, background: withAlpha(c, 0.18), border: `2px solid ${c}`, fontFamily: FONTS.heading, fontWeight: 900, fontSize: size, letterSpacing: 1.5, color: c, whiteSpace: 'nowrap'}}>{kind}</span>;
};

export const Card: React.FC<{children: React.ReactNode; color: string; style?: React.CSSProperties; glow?: number}> = ({children, color, style, glow = 0.2}) => (
	<div style={{borderRadius: 24, background: 'linear-gradient(160deg, rgba(20,24,58,0.96), rgba(9,11,30,0.96))', border: `2.5px solid ${withAlpha(color, 0.85)}`, boxShadow: `0 28px 60px rgba(0,0,0,0.55), 0 0 44px ${withAlpha(color, glow)}, inset 0 1px 0 rgba(255,255,255,0.08)`, ...style}}>{children}</div>
);

export const IconOrb: React.FC<{name: P2IconName; color: string; size?: number}> = ({name, color, size = 72}) => (
	<div style={{width: size, height: size, borderRadius: size / 2, background: `radial-gradient(circle at 35% 30%, ${withAlpha(color, 0.35)}, ${withAlpha(color, 0.12)})`, border: `2px solid ${withAlpha(color, 0.7)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
		<P2Icon name={name} size={size * 0.56} color={color} />
	</div>
);

export const Stars: React.FC<{seed: string; n?: number; height?: number}> = ({seed, n = 40, height = 440}) => {
	const frame = useCurrentFrame();
	return (
		<svg width={1080} height={height} style={{position: 'absolute', left: 0, top: 0}}>
			{new Array(n).fill(0).map((_, i) => (
				<circle key={i} cx={random(`${seed}-x-${i}`) * 1080} cy={24 + random(`${seed}-y-${i}`) * (height - 40)} r={1 + random(`${seed}-r-${i}`) * 2} fill="#FFFFFF" opacity={(0.4 + 0.6 * Math.abs(Math.sin(frame / 18 + i))) * 0.7} />
			))}
		</svg>
	);
};

/** Zahl zählt ab `at` in `dur` Frames hoch (deutsches Tausenderformat). */
export const CountUp: React.FC<{value: number; at: number; dur?: number; style?: React.CSSProperties; prefix?: string}> = ({value, at, dur = 18, style, prefix = ''}) => {
	const frame = useCurrentFrame();
	const t = interpolate(frame, [at, at + dur], [0, 1], {...clamp, easing: EASE_OUT});
	const v = Math.round(value * t);
	return <span style={{fontVariantNumeric: 'tabular-nums', ...style}}>{prefix + v.toLocaleString('de-DE')}</span>;
};

/** Federnde Einblendung (Skalierung + Deckkraft) – Wert 0–1. */
export const useSpring = (at: number, damping = 13, stiffness = 180) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return springIn({frame, fps, delay: at, damping, stiffness});
};

/** Dezenter Vignetten-/Farbverlauf über Karten (Lesbarkeit oben und unten). */
export const MapShade: React.FC<{top?: number; bottom?: number}> = ({top = 0.9, bottom = 0.85}) => (
	<AbsoluteFill style={{background: `linear-gradient(rgba(4,6,20,${top}) 0%, rgba(4,6,20,${top * 0.55}) 22%, rgba(4,6,20,0) 38%, rgba(4,6,20,0) 62%, rgba(4,6,20,${bottom * 0.6}) 76%, rgba(4,6,20,${bottom}) 100%)`, pointerEvents: 'none'}} />
);

/** 2,5D-Abreißkalender: roter Kopf, große Tageszahl, Wochentag. */
export const CalendarBlock: React.FC<{day: string; month: string; weekday: string; width: number; accent?: string; tilt?: number; dayColor?: string}> = ({day, month, weekday, width, accent = ACCENT.brand, tilt = -4, dayColor = '#14141C'}) => {
	const h = width * 1.12;
	return (
		<div style={{position: 'relative', width, height: h, rotate: `${tilt}deg`}}>
			<div style={{position: 'absolute', left: 12, top: 16, width, height: h, borderRadius: 26, background: '#C8C2B4', opacity: 0.85}} />
			<div style={{position: 'absolute', left: 6, top: 8, width, height: h, borderRadius: 26, background: '#E3DED2'}} />
			<div style={{position: 'absolute', inset: 0, borderRadius: 26, background: '#F7F4EC', boxShadow: '0 34px 70px rgba(0,0,0,0.6)', overflow: 'hidden'}}>
				<div style={{height: h * 0.24, background: `linear-gradient(170deg, ${accent}, ${withAlpha(accent, 0.85)})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: width * (month.length > 9 ? 0.082 : 0.105), letterSpacing: 2, color: accent === ACCENT.signal ? ACCENT.ink : '#FFFFFF', whiteSpace: 'nowrap'}}>{month}</div>
				<div style={{height: h * 0.58, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: width * 0.56, letterSpacing: -6, color: dayColor, lineHeight: 1}}>{day}</div>
				<div style={{height: h * 0.18, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 800, fontSize: width * 0.085, letterSpacing: 4, color: '#6B6A78'}}>{weekday}</div>
			</div>
			{[0.25, 0.75].map((x) => (
				<div key={x} style={{position: 'absolute', left: width * x - 10, top: -14, width: 20, height: 36, borderRadius: 10, background: '#8A8FA8', border: '3px solid #2A2F48'}} />
			))}
		</div>
	);
};

/** Kleine Wahrzeichen-Glyphen für die Städtekarten (stilisierte Strichzeichnung, keine Fotos). */
export const CityGlyph: React.FC<{kind: 'rathaus' | 'pyramide' | 'saeule'; color: string; size?: number; draw?: number}> = ({kind, color, size = 120, draw = 1}) => {
	const p = {fill: 'none', stroke: color, strokeWidth: 3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, pathLength: 1, strokeDasharray: '1 1', strokeDashoffset: 1 - draw};
	const fill = withAlpha(color, 0.14 * draw);
	return (
		<svg width={size} height={size} viewBox="0 0 120 120">
			<rect x={4} y={4} width={112} height={112} rx={24} fill={withAlpha(color, 0.08)} stroke={withAlpha(color, 0.35)} strokeWidth={2} />
			{kind === 'rathaus' ? (
				<g>
					{/* Rathaus-Fassade: Arkaden, Mittelgiebel, Seitengiebel */}
					<path d="M18 96h84V60H18z" {...p} fill={fill} />
					<path d="M18 60l8-12 8 12M86 60l8-12 8 12M44 60V40l16-18 16 18v20" {...p} />
					{[24, 38, 52, 66, 80].map((x) => (
						<path key={x} d={`M${x} 96v-14a7 7 0 0 1 14 0v14`} {...p} />
					))}
					<path d="M18 74h84M55 46h10v10H55z" {...p} />
				</g>
			) : kind === 'pyramide' ? (
				<g>
					<path d="M30 92 60 30l30 62z" {...p} fill={fill} />
					<path d="M60 30v62M22 92h76M26 100h68" {...p} />
				</g>
			) : (
				<g>
					{/* Säule mit Figur auf dem Sockel */}
					<path d="M50 96V42h20v54" {...p} fill={fill} />
					<path d="M40 104h40M44 96h32M46 42h28M48 36h24M60 36V24M54 24l6-8 6 8M55 30h10" {...p} />
					<path d="M56 50v40M64 50v40" {...p} />
				</g>
			)}
		</svg>
	);
};
