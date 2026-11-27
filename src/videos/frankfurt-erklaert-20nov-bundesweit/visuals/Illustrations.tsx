import React from 'react';
import {interpolate, random, useCurrentFrame} from 'remotion';
import {clamp, EASE_OUT} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {FONTS} from '../../../theme/tokens';

/**
 * Stilisierte Illustrationen für #12 (alle als ILLUSTRATION gekennzeichnet, keine Personen, keine Logos):
 * Kölner Doppelturm-Silhouette, Smartphone mit Ticket, Anmelde-Dokument mit Stempel, anonyme Menge mit „?“, Forderungs-Symbole.
 */

/** Zwei gotische Türme als Silhouette (Köln) mit leuchtenden Fensterbändern. */
export const DomTowers: React.FC<{width: number; color?: string; glow?: number}> = ({width, color = '#2A3470', glow = 1}) => {
	const frame = useCurrentFrame();
	const h = width * 1.15;
	const tower = (x: number, k: string) => {
		const w = 84;
		return (
			<g key={k}>
				{/* Schaft */}
				<path d={`M${x} 420 L${x} 170 L${x + w * 0.12} 150 L${x + w * 0.88} 150 L${x + w} 170 L${x + w} 420 Z`} fill={color} stroke={withAlpha('#9CC2FF', 0.5)} strokeWidth={2} />
				{/* Helm */}
				<path d={`M${x + w * 0.08} 152 L${x + w / 2} 6 L${x + w * 0.92} 152 Z`} fill={color} stroke={withAlpha('#9CC2FF', 0.55)} strokeWidth={2} />
				{/* Kreuzblume */}
				<path d={`M${x + w / 2} 6 l0 -14 M${x + w / 2 - 7} -2 l14 0`} stroke="#FFD9A0" strokeWidth={3} strokeLinecap="round" />
				{/* Krabben am Helm */}
				{new Array(6).fill(0).map((_, i) => {
					const t = 0.15 + i * 0.13;
					const yy = 152 - (152 - 6) * t;
					const dx = (w * 0.42) * (1 - t);
					return (
						<g key={i}>
							<circle cx={x + w / 2 - dx} cy={yy} r={3} fill={withAlpha('#9CC2FF', 0.6)} />
							<circle cx={x + w / 2 + dx} cy={yy} r={3} fill={withAlpha('#9CC2FF', 0.6)} />
						</g>
					);
				})}
				{/* Spitzbogenfenster */}
				{[200, 270, 340].map((yy, i) => (
					<path
						key={i}
						d={`M${x + 22} ${yy + 46} L${x + 22} ${yy + 16} Q${x + w / 2} ${yy - 14} ${x + w - 22} ${yy + 16} L${x + w - 22} ${yy + 46} Z`}
						fill={withAlpha('#FFD9A0', (0.35 + 0.15 * Math.sin(frame / 18 + i + x)) * glow)}
					/>
				))}
			</g>
		);
	};
	return (
		<svg width={width} height={h} viewBox="-10 -30 300 470" style={{overflow: 'visible'}}>
			{tower(10, 'l')}
			{tower(186, 'r')}
			{/* Westfassade zwischen den Türmen */}
			<path d="M94 420 L94 250 L140 200 L186 250 L186 420 Z" fill={color} stroke={withAlpha('#9CC2FF', 0.45)} strokeWidth={2} />
			<circle cx={140} cy={262} r={18} fill={withAlpha('#FFD9A0', 0.45 * glow)} />
			<path d="M118 420 L118 330 Q140 296 162 330 L162 420 Z" fill={withAlpha('#FFD9A0', 0.28 * glow)} />
			<rect x={-10} y={418} width={300} height={6} rx={3} fill={withAlpha('#9CC2FF', 0.35)} />
		</svg>
	);
};

/** Smartphone mit „Ticket“-Karte (neutrale Gestaltung, kein Logo); `fill` 0–1 lässt den Zähler laufen. */
export const TicketPhone: React.FC<{width: number; at: number; color: string; value: string}> = ({width, at, color, value}) => {
	const frame = useCurrentFrame();
	const h = width * 1.9;
	const t = interpolate(frame, [at, at + 16], [0, 1], {...clamp, easing: EASE_OUT});
	const tap = frame > at + 18 ? 1 + 0.06 * Math.max(0, Math.sin((frame - at - 18) / 4)) * Math.exp(-(frame - at - 18) / 30) : 1;
	return (
		<div style={{position: 'relative', width, height: h, borderRadius: width * 0.16, background: 'linear-gradient(160deg, #1B2148, #0B0E26)', border: '3px solid rgba(255,255,255,0.22)', boxShadow: '0 24px 50px rgba(0,0,0,0.55)', overflow: 'hidden'}}>
			<div style={{position: 'absolute', left: '50%', top: width * 0.06, translate: '-50% 0', width: width * 0.3, height: width * 0.06, borderRadius: 99, background: '#05060F'}} />
			<div style={{position: 'absolute', left: width * 0.1, right: width * 0.1, top: width * 0.24, height: width * 0.98, borderRadius: width * 0.08, background: `linear-gradient(160deg, ${withAlpha(color, 0.95)}, ${withAlpha(color, 0.7)})`, scale: String((0.7 + 0.3 * t) * tap), opacity: t, boxShadow: `0 0 30px ${withAlpha(color, 0.45)}`}}>
				{/* Perforation */}
				<div style={{position: 'absolute', left: -width * 0.04, top: '58%', width: width * 0.08, height: width * 0.08, borderRadius: 99, background: '#0F1330'}} />
				<div style={{position: 'absolute', right: -width * 0.04, top: '58%', width: width * 0.08, height: width * 0.08, borderRadius: 99, background: '#0F1330'}} />
				<div style={{position: 'absolute', left: '12%', right: '12%', top: '62%', borderTop: '3px dashed rgba(11,16,41,0.5)'}} />
				<div style={{position: 'absolute', left: 0, right: 0, top: '12%', textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: width * 0.13, letterSpacing: 2, color: '#0B1029'}}>ZUSAGE</div>
				<div style={{position: 'absolute', left: 0, right: 0, top: '30%', textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: width * 0.2, color: '#0B1029'}}>✓</div>
				<div style={{position: 'absolute', left: 0, right: 0, top: '70%', textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: width * 0.12, color: '#0B1029'}}>{value}</div>
			</div>
			<div style={{position: 'absolute', left: width * 0.14, right: width * 0.14, bottom: width * 0.2, height: width * 0.1, borderRadius: 99, background: withAlpha('#FFFFFF', 0.12)}} />
		</div>
	);
};

/** Anmelde-Dokument mit Stempel (stilisiert, Zeilen ohne Text). */
export const PlanDoc: React.FC<{width: number; at: number; color: string; stamp?: string}> = ({width, at, color, stamp = 'ANGEZEIGT'}) => {
	const frame = useCurrentFrame();
	const h = width * 1.3;
	const st = interpolate(frame, [at + 8, at + 14], [0, 1], clamp);
	return (
		<div style={{position: 'relative', width, height: h}}>
			<div style={{position: 'absolute', inset: 0, borderRadius: 12, background: '#F1EEE6', rotate: '-3deg', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', overflow: 'hidden'}}>
				<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: width * 0.16, background: withAlpha(color, 0.85)}} />
				{new Array(7).fill(0).map((_, i) => (
					<div key={i} style={{position: 'absolute', left: width * 0.12, top: width * 0.26 + i * width * 0.12, height: width * 0.045, borderRadius: 99, width: `${55 + random(`pd-${i}`) * 30}%`, background: '#BDB7AA'}} />
				))}
			</div>
			<div style={{position: 'absolute', right: -width * 0.08, bottom: width * 0.18, padding: `${width * 0.03}px ${width * 0.06}px`, border: `${Math.max(3, width * 0.025)}px solid ${color}`, borderRadius: 10, rotate: '-14deg', fontFamily: FONTS.heading, fontWeight: 900, fontSize: width * 0.12, letterSpacing: 1, color, background: withAlpha('#F1EEE6', 0.85), opacity: st, scale: String(1.6 - 0.6 * st)}}>{stamp}</div>
		</div>
	);
};

/** Anonyme Menge als Silhouetten (Köpfe + Schultern) mit großem pulsierendem „?“. */
export const CrowdQuestion: React.FC<{width: number; at: number; color: string}> = ({width, at, color}) => {
	const frame = useCurrentFrame();
	const h = width * 0.7;
	const q = interpolate(frame, [at, at + 12], [0, 1], {...clamp, easing: EASE_OUT});
	const pulse = 1 + 0.05 * Math.sin((frame - at) / 6);
	const people = React.useMemo(
		() =>
			new Array(3).fill(0).flatMap((_, row) =>
				new Array(7 - row).fill(0).map((__, i) => ({
					row,
					x: (i + 0.5 + row * 0.5 + (random(`cq-x-${row}-${i}`) - 0.5) * 0.4) / 7,
					s: 1 - row * 0.18,
				})),
			),
		[],
	);
	return (
		<div style={{position: 'relative', width, height: h, overflow: 'visible'}}>
			<svg width={width} height={h} viewBox={`0 0 ${width} ${h}`}>
				{people
					.sort((a, b) => b.row - a.row)
					.map((p, i) => {
						const r = width * 0.055 * p.s;
						const cx = p.x * width;
						const base = h - p.row * h * 0.16;
						const bob = Math.sin(frame / 9 + i) * 2;
						const shade = 0.35 + p.row * 0.2;
						return (
							<g key={i} opacity={1 - shade * 0.6} transform={`translate(0 ${bob})`}>
								<circle cx={cx} cy={base - r * 3.3} r={r} fill="#3A4685" />
								<path d={`M${cx - r * 1.9} ${base} Q${cx - r * 1.8} ${base - r * 2.2} ${cx} ${base - r * 2.2} Q${cx + r * 1.8} ${base - r * 2.2} ${cx + r * 1.9} ${base} Z`} fill="#3A4685" />
							</g>
						);
					})}
			</svg>
			<div style={{position: 'absolute', left: 0, right: 0, top: -h * 0.18, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: h * 0.85, lineHeight: 1, color, opacity: q, scale: String((0.5 + 0.5 * q) * pulse), textShadow: `0 0 40px ${withAlpha(color, 0.6)}, 0 10px 30px rgba(0,0,0,0.8)`}}>?</div>
		</div>
	);
};

export type DemandIconName = 'bildung' | 'leben' | 'wehrpflicht';

/** Forderungs-Symbole (Linien-Icons): Buch, Einkaufskorb mit Euro, Helm durchgestrichen. */
export const DemandIcon: React.FC<{name: DemandIconName; size: number; color: string; draw?: number}> = ({name, size, color, draw = 1}) => {
	const p = {fill: 'none', stroke: color, strokeWidth: 2.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - draw};
	return (
		<svg width={size} height={size} viewBox="0 0 48 48">
			{name === 'bildung' ? (
				<>
					<path {...p} d="M6 12c6-3 12-3 18 1v24c-6-4-12-4-18-1z" />
					<path {...p} d="M42 12c-6-3-12-3-18 1v24c6-4 12-4 18-1z" />
					<path {...p} d="M10 18c3-1 6-1 9 1M10 24c3-1 6-1 9 1M29 19c3-2 6-2 9-1M29 25c3-2 6-2 9-1" />
				</>
			) : null}
			{name === 'leben' ? (
				<>
					<path {...p} d="M6 10h5l5 22h22l4-15H14" />
					<circle {...p} cx={19} cy={39} r={3} />
					<circle {...p} cx={34} cy={39} r={3} />
					<path {...p} d="M31 20.5a5 5 0 1 0 0 6.5M23 22.5h7M23 25.5h7" />
				</>
			) : null}
			{name === 'wehrpflicht' ? (
				<>
					<path {...p} d="M8 30c0-10 7-17 16-17s16 7 16 17z" />
					<path {...p} d="M5 30h38M24 13v-3" />
					<path {...p} d="M8 40L40 6" stroke="#FF4D5E" strokeWidth={3.2} />
				</>
			) : null}
		</svg>
	);
};
