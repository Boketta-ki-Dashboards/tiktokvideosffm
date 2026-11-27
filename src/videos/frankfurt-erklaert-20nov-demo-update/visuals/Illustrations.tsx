import React from 'react';
import {useCurrentFrame} from 'remotion';
import {mix, withAlpha} from '../../../lib/color';
import {FONTS} from '../../../theme/tokens';

/**
 * Eigene Illustrationen für „Gen-Z-Demo am 20.11. geändert!“ (#10) – stilisiert, keine Fotos, keine realen Personen, keine Logos.
 * - `FloesserPylons`: die zwei olivgrünen Pylone der Flößerbrücke am Nordufer mit Seilen (nach Wikipedia-Beschreibung, vereinfacht).
 * - `EzbTowers`: Doppelturm mit Atrium und flache Großmarkthalle (Silhouette, vereinfacht).
 * - `PressPodium`: Bühne mit drei Pulten (INNENMINISTERIUM · POLIZEI · STADT), Mikrofone, Blitzlichter – ohne Personen.
 * - `RuleGlyph`: Verbotssymbole der Auflagen (Pyro, Glas, Vermummung, Hund) und Stangen-Maß.
 */

/* ------------------------------------------------------------------ Flößerbrücke: zwei Pylone mit Seilen */

export const FloesserPylons: React.FC<{size?: number; glow?: number}> = ({size = 150, glow = 0}) => {
	const w = size;
	const h = size * 1.05;
	const olive = '#7E8A52';
	const oliveDark = '#4E5A30';
	const cable = withAlpha('#E8E6D0', 0.85);
	// Pylon-Fußpunkte und -Köpfe (viewBox 100 × 105, Fahrbahn auf y 96)
	const pyl = [
		{x: 40, top: 8},
		{x: 60, top: 12},
	];
	return (
		<svg width={w} height={h} viewBox="0 0 100 105" style={{overflow: 'visible'}}>
			{glow > 0 ? <ellipse cx={50} cy={98} rx={60} ry={10} fill={withAlpha('#FFE08A', 0.25 * glow)} /> : null}
			{/* Fahrbahn (Ausschnitt) */}
			<path d="M-14 96 L114 96" stroke="#5E6668" strokeWidth={5} strokeLinecap="round" />
			<path d="M-14 99.5 L114 99.5" stroke={withAlpha('#000000', 0.35)} strokeWidth={2} />
			{/* Seile zur Fahrbahn: je Pylon fächerförmig nach beiden Seiten */}
			{pyl.map((p, i) =>
				[0.18, 0.36, 0.54].map((t, j) => (
					<g key={`${i}-${j}`}>
						<line x1={p.x} y1={p.top + 6 + j * 3} x2={p.x - 18 - t * 70} y2={96} stroke={cable} strokeWidth={0.9} />
						<line x1={p.x} y1={p.top + 6 + j * 3} x2={p.x + 18 + t * 70} y2={96} stroke={cable} strokeWidth={0.9} />
					</g>
				)),
			)}
			{/* Pylone */}
			{pyl.map((p, i) => (
				<g key={i}>
					<path d={`M${p.x - 3.4} 96 L${p.x - 1.8} ${p.top} L${p.x + 1.8} ${p.top} L${p.x + 3.4} 96 Z`} fill={i === 0 ? olive : mix(olive, oliveDark, 0.35)} stroke={oliveDark} strokeWidth={0.6} />
					{/* Kopf (gold/rot laut Beschreibung) */}
					<rect x={p.x - 2.4} y={p.top - 6} width={4.8} height={6.5} rx={1} fill="#D9A93C" />
					<rect x={p.x - 2.4} y={p.top - 2.2} width={4.8} height={2.2} fill="#B8402E" />
				</g>
			))}
		</svg>
	);
};

/* ------------------------------------------------------------------ EZB: Doppelturm + Großmarkthalle (Silhouette) */

export const EzbTowers: React.FC<{size?: number; lit?: number}> = ({size = 240, lit = 0.5}) => {
	const frame = useCurrentFrame();
	const glass = '#5E7CC4';
	const glassDark = '#2C3C7A';
	const rows = 22;
	return (
		<svg width={size * 1.3} height={size} viewBox="0 0 130 100" style={{overflow: 'visible'}}>
			{/* Großmarkthalle (flach, lang, Tonnendach) */}
			<path d="M0 100 V86 Q2 82 6 82 H82 Q86 82 88 86 V100 Z" fill="#2A3366" stroke="#4A5AA0" strokeWidth={0.6} />
			{new Array(10).fill(0).map((_, i) => (
				<path key={i} d={`M${6 + i * 8} 86 q4 -3 8 0`} fill="none" stroke={withAlpha('#9FB4FF', 0.5)} strokeWidth={0.6} />
			))}
			{/* zwei polygonale Türme, leicht gegeneinander gedreht, mit Atrium dazwischen */}
			<path d="M78 100 V14 L88 6 L92 100 Z" fill={glass} />
			<path d="M88 6 L92 100 H96 V10 Z" fill={glassDark} />
			<path d="M96 100 V18 L104 12 L110 18 V100 Z" fill={mix(glass, glassDark, 0.25)} />
			<path d="M104 12 L110 18 V100 H114 V22 Z" fill={glassDark} />
			{/* Atrium-Verbindung */}
			<path d="M92 40 H96 M92 62 H96 M92 82 H96" stroke="#AFC4FF" strokeWidth={1.2} />
			{/* Fensterbänder */}
			{new Array(rows).fill(0).map((_, r) => {
				const y = 18 + r * 3.7;
				const on = ((r * 7 + Math.floor(frame / 50)) % 5) / 5 < lit;
				return (
					<g key={r}>
						<line x1={79} y1={y} x2={87.5} y2={y - 0.6} stroke={on ? '#FFE3A0' : withAlpha('#BFD0FF', 0.35)} strokeWidth={0.7} />
						{y > 22 ? <line x1={97} y1={y} x2={109} y2={y + 0.4} stroke={on && r % 2 ? '#FFE3A0' : withAlpha('#BFD0FF', 0.3)} strokeWidth={0.7} /> : null}
					</g>
				);
			})}
			{/* Dachlicht */}
			<circle cx={88} cy={5} r={1.1} fill="#FF5A5A" opacity={0.6 + 0.4 * Math.sin(frame / 6)} />
		</svg>
	);
};

/* ------------------------------------------------------------------ Pressepodium ohne Personen */

export const PressPodium: React.FC<{width: number; on?: readonly number[]; flash?: number}> = ({width, on = [1, 1, 1], flash = 0}) => {
	const frame = useCurrentFrame();
	const h = width * 0.27;
	const labels = ['INNEN-\nMINISTERIUM', 'POLIZEI', 'STADT'];
	const colors = ['#4FC3F7', '#6A8CFF', '#FFD23F'];
	// Blitzlichter: deterministische Folge von kurzen Blitzen
	const flashes = [7, 23, 41, 58, 77, 96].map((f, i) => {
		const d = (frame - f) % 110;
		const a = d >= 0 && d < 4 ? 1 - d / 4 : 0;
		return {x: [0.12, 0.86, 0.3, 0.7, 0.05, 0.94][i], y: [0.2, 0.3, 0.1, 0.15, 0.55, 0.6][i], a: a * (0.5 + 0.5 * flash)};
	});
	return (
		<div style={{position: 'relative', width, height: h}}>
			{/* Rückwand mit Lichtkegeln */}
			<div style={{position: 'absolute', inset: 0, borderRadius: 18, background: 'linear-gradient(#1A2258, #0D1236)', border: '1.5px solid rgba(255,255,255,0.12)', overflow: 'hidden'}}>
				{[0.2, 0.5, 0.8].map((x, i) => (
					<div key={i} style={{position: 'absolute', left: `${x * 100 - 18}%`, top: -20, width: '36%', height: h + 20, background: `radial-gradient(ellipse 50% 70% at 50% 0%, ${withAlpha('#FFF1C8', 0.2)}, rgba(0,0,0,0) 70%)`}} />
				))}
				<div style={{position: 'absolute', left: 0, right: 0, top: h * 0.08, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: h * 0.1, letterSpacing: 6, color: withAlpha('#FFFFFF', 0.18)}}>PRESSEKONFERENZ · FRANKFURT</div>
				{/* Bühnenkante */}
				<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: h * 0.12, background: 'linear-gradient(#232C66, #141A44)', borderTop: '1.5px solid rgba(255,255,255,0.18)'}} />
			</div>
			{/* drei Pulte */}
			{labels.map((l, i) => {
				const cx = width * (0.2 + i * 0.3);
				const pw = width * 0.22;
				const ph = h * 0.5;
				const o = on[i] ?? 1;
				return (
					<div key={i} style={{position: 'absolute', left: cx - pw / 2, bottom: h * 0.06, width: pw, height: ph, opacity: o, translate: `0 ${(1 - o) * 30}px`}}>
						{/* Mikrofone */}
						<svg width={pw} height={ph * 0.5} viewBox="0 0 100 50" style={{position: 'absolute', left: 0, top: -ph * 0.42, overflow: 'visible'}}>
							<path d="M44 50 Q42 26 34 14 M56 50 Q58 26 66 14" fill="none" stroke="#9AA6CC" strokeWidth={2.2} />
							<ellipse cx={34} cy={12} rx={4} ry={5.5} fill="#2A2F45" stroke="#9AA6CC" strokeWidth={1.2} />
							<ellipse cx={66} cy={12} rx={4} ry={5.5} fill="#2A2F45" stroke="#9AA6CC" strokeWidth={1.2} />
						</svg>
						<div style={{position: 'absolute', inset: 0, clipPath: 'polygon(6% 0, 94% 0, 100% 100%, 0 100%)', background: 'linear-gradient(#2E3A80, #1A2052)', borderTop: `4px solid ${colors[i]}`}} />
						<div style={{position: 'absolute', left: 0, right: 0, top: ph * 0.22, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: Math.min(26, pw * 0.13), lineHeight: 1.05, color: colors[i], whiteSpace: 'pre-line'}}>{l}</div>
					</div>
				);
			})}
			{/* Blitzlichter (Presse) */}
			{flashes.map((f, i) =>
				f.a > 0 ? <div key={i} style={{position: 'absolute', left: f.x * width - 40, top: f.y * h - 40, width: 80, height: 80, borderRadius: 40, background: `radial-gradient(circle, rgba(255,255,255,${0.9 * f.a}) 0%, rgba(255,255,255,${0.25 * f.a}) 30%, rgba(255,255,255,0) 70%)`}} /> : null,
			)}
		</div>
	);
};

/* ------------------------------------------------------------------ Auflagen-Symbole */

export type RuleGlyphKind = 'pyro' | 'glass' | 'mask' | 'dog' | 'pole';

/** Verbotssymbol (rot) bzw. Stangen-Maß (gelb, `measure` 0–1 zeichnet den Maßpfeil „max. 2 m“). */
export const RuleGlyph: React.FC<{kind: RuleGlyphKind; on: number; size?: number; measure?: number}> = ({kind, on, size = 110, measure = 1}) => {
	const frame = useCurrentFrame();
	const red = '#FF4D5E';
	const p = {fill: 'none', stroke: '#FFFFFF', strokeWidth: 4.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
	if (kind === 'pole') {
		const y = '#FFD23F';
		const wave = Math.sin(frame / 6) * 2;
		return (
			<svg width={size} height={size} viewBox="0 0 96 96" style={{overflow: 'visible'}}>
				<circle cx={48} cy={48} r={42} fill={withAlpha(y, 0.12)} stroke={y} strokeWidth={5} />
				{/* zwei Stangen mit Transparent */}
				<path d="M28 82V20M60 82V20" {...p} />
				<path d={`M28 24 Q44 ${20 + wave} 60 24 V44 Q44 ${48 + wave} 28 44 Z`} fill={withAlpha('#FFFFFF', 0.85)} stroke="#FFFFFF" strokeWidth={2} />
				{/* Maßpfeil rechts */}
				<g opacity={Math.min(1, measure * 2)}>
					<line x1={74} y1={82} x2={74} y2={82 - 62 * measure} stroke={y} strokeWidth={4} strokeLinecap="round" />
					<path d="M68 82h12" stroke={y} strokeWidth={4} strokeLinecap="round" />
					{measure > 0.95 ? <path d="M68 20h12M70 26l4-6 4 6" fill="none" stroke={y} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" /> : null}
				</g>
			</svg>
		);
	}
	return (
		<svg width={size} height={size} viewBox="0 0 96 96">
			<circle cx={48} cy={48} r={42} fill={withAlpha(red, 0.16)} stroke={red} strokeWidth={6} />
			{kind === 'pyro' ? (
				<g>
					<path d="M48 76V54M40 54h16M48 54c-10-8-10-20 0-32 10 12 10 24 0 32z" {...p} />
					<path d="M30 30l4 4M66 30l-4 4M48 16v3" {...p} />
				</g>
			) : kind === 'glass' ? (
				<g>
					<path d="M38 18h10v12c5 3 7 7 7 12v32H31V42c0-5 2-9 7-12z" {...p} />
					<path d="M31 48h24" {...p} />
					<path d="M62 40h14l-2 34h-10z" {...p} strokeWidth={3.6} />
				</g>
			) : kind === 'mask' ? (
				<g>
					<path d="M24 40c0-12 10-20 24-20s24 8 24 20v8c0 14-10 26-24 26S24 62 24 48z" {...p} />
					<path d="M24 48h48M34 40h8M54 40h8" {...p} />
				</g>
			) : (
				<g>
					{/* Hund (Seitenansicht, vereinfacht) */}
					<path d="M24 62c0-8 4-12 12-12h18l6-10c2-3 6-3 8 0l3 5h5c2 0 3 2 2 4l-3 4h-6v9c0 2-1 4-3 4" {...p} />
					<path d="M30 62v12M40 62v12M58 66v8M66 62v12" {...p} />
					<path d="M24 56c-3-1-6-4-6-8" {...p} />
				</g>
			)}
			<line x1={20} y1={76} x2={20 + 56 * on} y2={76 - 56 * on} stroke={red} strokeWidth={7} strokeLinecap="round" />
		</svg>
	);
};
