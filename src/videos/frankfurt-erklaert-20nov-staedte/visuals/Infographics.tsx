import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {COLORS, FONTS} from '../../../theme/tokens';

/**
 * Infografiken für #15 (als SCHEMATISCH gekennzeichnet): Phasen-Leiste „Demo | nach dem Ende“ (trennt die angemeldete Versammlung strikt von
 * späteren Ausschreitungen), schematische Strecke Start → Ziel (Hamburg) und Innenstadtring (Leipzig). Keine echten Routenverläufe.
 */

export type Phase = {label: string; sub: string; color: string; fill: number};

/** Zwei Segmente nebeneinander, getrennt durch die Marke „ENDE DER DEMO“; `fill` 0–1 zeichnet das Segment von links ein. */
export const PhaseBar: React.FC<{width: number; demo: Phase; after: Phase; endLabel: string; endOn: number; demoFrom?: string; demoTo?: string}> = ({width, demo, after, endLabel, endOn, demoFrom, demoTo}) => {
	const split = 0.5;
	const h = 54;
	const seg = (p: Phase, x: number, w: number) => (
		<div style={{position: 'absolute', left: x, top: 34, width: w, height: h, borderRadius: 14, background: withAlpha(p.color, 0.1), border: `2px solid ${withAlpha(p.color, 0.45)}`, overflow: 'hidden', boxSizing: 'border-box'}}>
			<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${Math.min(1, p.fill) * 100}%`, background: `linear-gradient(90deg, ${withAlpha(p.color, 0.55)}, ${withAlpha(p.color, 0.85)})`}} />
			<div style={{position: 'absolute', left: 14, right: 10, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, letterSpacing: 1, color: '#FFFFFF', opacity: Math.min(1, p.fill * 3), whiteSpace: 'nowrap', textShadow: '0 2px 8px rgba(0,0,0,0.6)'}}>{p.label}</div>
		</div>
	);
	const wl = width * split - 8;
	return (
		<div style={{position: 'relative', width, height: 34 + h + 64}}>
			{demoFrom ? <div style={{position: 'absolute', left: 0, top: 0, fontFamily: FONTS.heading, fontWeight: 800, fontSize: 21, color: COLORS.textMuted, opacity: Math.min(1, demo.fill * 3)}}>{demoFrom}</div> : null}
			{seg(demo, 0, wl)}
			{seg(after, width * split + 8, width - wl - 16)}
			{/* Marke „Ende der Demo“ */}
			<div style={{position: 'absolute', left: width * split - 3, top: 22, width: 6, height: h + 24, borderRadius: 3, background: '#FFFFFF', opacity: endOn, boxShadow: '0 0 14px rgba(255,255,255,0.8)'}} />
			<div style={{position: 'absolute', left: width * split, top: 0, translate: '-50% 0', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 19, letterSpacing: 1.2, color: '#FFFFFF', whiteSpace: 'nowrap', opacity: endOn, padding: '1px 10px', borderRadius: 8, background: 'rgba(8,10,28,0.92)'}}>
				{endLabel}
				{demoTo ? <span style={{color: COLORS.textMuted}}> · {demoTo}</span> : null}
			</div>
			<div style={{position: 'absolute', left: 4, top: 34 + h + 8, width: wl - 8, fontFamily: FONTS.body, fontWeight: 700, fontSize: 21, lineHeight: 1.2, color: COLORS.textMuted, opacity: Math.min(1, demo.fill * 2)}}>{demo.sub}</div>
			<div style={{position: 'absolute', left: width * split + 12, top: 34 + h + 8, width: width - wl - 24, fontFamily: FONTS.body, fontWeight: 700, fontSize: 21, lineHeight: 1.2, color: withAlpha(after.color, 0.95), opacity: Math.min(1, after.fill * 2)}}>{after.sub}</div>
		</div>
	);
};

/** Schematische Strecke Start → Ziel mit wandernden Punkten (keine echte Route). */
export const RouteMini: React.FC<{width: number; height: number; from: string; to: string; color: string; draw: number}> = ({width, height, from, to, color, draw}) => {
	const frame = useCurrentFrame();
	const x0 = 70;
	const x1 = width - 70;
	const y = height * 0.48;
	const path = (t: number): [number, number] => [x0 + (x1 - x0) * t, y - Math.sin(t * Math.PI) * 26];
	const n = 26;
	const d = new Array(n + 1).fill(0).map((_, i) => {
		const [px, py] = path((i / n) * Math.min(1, draw));
		return `${i ? 'L' : 'M'}${px.toFixed(1)} ${py.toFixed(1)}`;
	}).join(' ');
	const dots = new Array(9).fill(0).map((_, i) => ((frame / 70 + i / 9) % 1) * Math.min(1, draw));
	return (
		<svg width={width} height={height}>
			<path d={d} fill="none" stroke={withAlpha(color, 0.35)} strokeWidth={16} strokeLinecap="round" />
			<path d={d} fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" strokeDasharray="12 10" strokeDashoffset={-frame * 1.5} />
			{dots.map((t, i) => {
				const [px, py] = path(t);
				return <circle key={i} cx={px} cy={py} r={6} fill={i % 3 === 0 ? COLORS.signal : '#FFFFFF'} />;
			})}
			<circle cx={x0} cy={y} r={11} fill={color} stroke="#FFFFFF" strokeWidth={3} />
			<circle cx={x1} cy={y} r={11} fill={color} stroke="#FFFFFF" strokeWidth={3} opacity={interpolate(draw, [0.85, 1], [0, 1], clamp)} />
			<text x={x0} y={y + 40} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={900} fontSize={20} fill="#FFFFFF">{from}</text>
			<text x={x1} y={y + 40} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={900} fontSize={20} fill="#FFFFFF" opacity={interpolate(draw, [0.85, 1], [0, 1], clamp)}>{to}</text>
		</svg>
	);
};

/** Schematischer Innenstadtring (Leipzig): Punkte laufen im Uhrzeigersinn um den Ring (laut Polizei), Start/Ziel markiert. */
export const RingMini: React.FC<{size: number; color: string; draw: number}> = ({size, color, draw}) => {
	const frame = useCurrentFrame();
	const c = size / 2;
	const r = size * 0.34;
	const a0 = Math.PI * 0.5; // Start unten (Wilhelm-Leuschner-Platz liegt im Süden des Rings)
	const pt = (t: number): [number, number] => [c + Math.cos(a0 + t * Math.PI * 2) * r * 1.15, c + Math.sin(a0 + t * Math.PI * 2) * r];
	const n = 48;
	const d = new Array(n + 1).fill(0).map((_, i) => {
		const [px, py] = pt((i / n) * Math.min(1, draw));
		return `${i ? 'L' : 'M'}${px.toFixed(1)} ${py.toFixed(1)}`;
	}).join(' ');
	const dots = new Array(12).fill(0).map((_, i) => ((frame / 110 + i / 12) % 1) * Math.min(1, draw));
	const [sx, sy] = pt(0);
	return (
		<svg width={size} height={size}>
			<path d={d} fill="none" stroke={withAlpha(color, 0.35)} strokeWidth={16} strokeLinecap="round" />
			<path d={d} fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" strokeDasharray="12 10" strokeDashoffset={-frame * 1.5} />
			{dots.map((t, i) => {
				const [px, py] = pt(t);
				return <circle key={i} cx={px} cy={py} r={5.5} fill={i % 3 === 0 ? COLORS.signal : '#FFFFFF'} />;
			})}
			<circle cx={sx} cy={sy} r={11} fill={color} stroke="#FFFFFF" strokeWidth={3} />
			<text x={c} y={c + 7} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={900} fontSize={18} fill={withAlpha('#FFFFFF', 0.85)}>RING</text>
		</svg>
	);
};
