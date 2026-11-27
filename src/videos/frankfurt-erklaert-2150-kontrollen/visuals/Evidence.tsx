import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, EASE_OUT} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {COLORS, FONTS} from '../../../theme/tokens';
import type {ItemId} from '../content';

/**
 * Neutrale Illustrationen für #13 (als ILLUSTRATION gekennzeichnet): Linien-Symbole der laut Innenministerium sichergestellten Gegenstände in
 * stilisierten Beweismitteltüten (keine realistischen Waffen, keine Handhabung), anonyme Silhouetten ohne Gesichter, kleine Personen-Symbole.
 */

/** Linien-Symbole (viewBox 64 × 64), bewusst schematisch. `draw` 0–1 zeichnet die Linien ein. */
export const ItemIcon: React.FC<{id: ItemId; size: number; color: string; draw?: number}> = ({id, size, color, draw = 1}) => {
	const p = {fill: 'none', stroke: color, strokeWidth: 2.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - draw};
	const body = (() => {
		switch (id) {
			case 'messer':
				return (
					<>
						<path {...p} d="M10 44 L38 16 Q46 12 44 22 L22 44 Z" />
						<path {...p} d="M22 44 L30 52 M18 40 L12 46 Q8 52 14 56 L20 50" />
					</>
				);
			case 'pfeffer':
				return (
					<>
						<path {...p} d="M8 22 H44 Q48 22 48 26 V30 H26 L22 46 H12 L16 30 H8 Z" />
						<path {...p} d="M30 30 Q30 36 24 36" />
						<circle {...p} cx={54} cy={22} r={2} />
						<circle {...p} cx={58} cy={28} r={1.6} />
						<circle {...p} cx={57} cy={16} r={1.4} />
					</>
				);
			case 'sturmhaube':
				return (
					<>
						<path {...p} d="M14 52 Q12 18 32 10 Q52 18 50 52 Q32 58 14 52 Z" />
						<path {...p} d="M19 30 H45 V37 H19 Z" />
						<path {...p} d="M28 46 H36" />
					</>
				);
			case 'axt':
				return (
					<>
						<path {...p} d="M18 56 L40 14" />
						<path {...p} d="M36 10 Q52 12 54 28 Q44 26 38 22 Z" />
					</>
				);
			case 'spray':
				return (
					<>
						<path {...p} d="M22 22 H38 V56 H22 Z" />
						<path {...p} d="M26 22 V14 H34 V22 M34 16 H40" />
						<circle {...p} cx={46} cy={14} r={1.6} />
						<circle {...p} cx={50} cy={10} r={1.4} />
						<circle {...p} cx={50} cy={18} r={1.4} />
						<path {...p} d="M22 34 H38" />
					</>
				);
			case 'stock':
				return (
					<>
						<path {...p} d="M12 54 L24 42" strokeWidth={5} />
						<path {...p} d="M24 42 L38 28" strokeWidth={3.6} />
						<path {...p} d="M38 28 L52 14" strokeWidth={2.4} />
					</>
				);
			case 'werkzeug':
				return (
					<>
						<path {...p} d="M14 54 L46 14 Q50 10 54 14" />
						<path {...p} d="M18 14 L44 46 M44 46 L50 52 Q54 56 50 58 L44 52" />
					</>
				);
		}
	})();
	return (
		<svg width={size} height={size} viewBox="0 0 64 64">
			{body}
		</svg>
	);
};

/** Beweismitteltüte (quadratisch) mit Symbol und Mengen-Plakette, darunter das Etikett (bis zwei Zeilen); fällt bei `at` federnd ins Raster. */
export const EvidenceTile: React.FC<{id: ItemId; name: string; qty: string; at: number; width: number; color: string; highlight?: number}> = ({id, name, qty, at, width, color, highlight = 0}) => {
	const frame = useCurrentFrame();
	const t = interpolate(frame, [at, at + 12], [0, 1], {...clamp, easing: EASE_OUT});
	const draw = interpolate(frame, [at + 4, at + 22], [0, 1], clamp);
	if (frame < at - 1) return null;
	return (
		<div style={{position: 'relative', width, height: width + 92, opacity: Math.min(1, t * 1.6), translate: `0 ${(1 - t) * -40}px`, rotate: `${(1 - t) * -6}deg`, scale: String(1 + 0.05 * highlight)}}>
			{/* Tüte */}
			<div style={{position: 'absolute', left: 0, top: 0, width, height: width, borderRadius: 18, background: 'linear-gradient(160deg, rgba(210,225,255,0.18), rgba(140,160,210,0.06))', border: `2px solid ${withAlpha('#C9D6F5', 0.45 + 0.4 * highlight)}`, boxShadow: `0 18px 40px rgba(0,0,0,0.45), 0 0 ${24 * highlight}px ${withAlpha(color, 0.6)}`}} />
			<div style={{position: 'absolute', left: 12, right: 12, top: 12, height: 6, borderRadius: 3, background: withAlpha('#C9D6F5', 0.5)}} />
			<div style={{position: 'absolute', left: 0, width, top: width * 0.16, display: 'flex', justifyContent: 'center'}}>
				<ItemIcon id={id} size={width * 0.62} color={withAlpha('#FFFFFF', 0.92)} draw={draw} />
			</div>
			{/* Mengen-Plakette */}
			<div style={{position: 'absolute', right: -8, top: -10, padding: '4px 10px', borderRadius: 10, background: color, border: '2px solid #FFFFFF', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 20, letterSpacing: 0.5, color: '#FFFFFF', boxShadow: '0 6px 16px rgba(0,0,0,0.5)'}}>{qty}</div>
			{/* Etikett */}
			<div style={{position: 'absolute', left: -6, right: -6, top: width + 10, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 21, lineHeight: 1.12, color: COLORS.text, whiteSpace: 'pre-line', textShadow: '0 3px 10px rgba(0,0,0,0.9)'}}>{name}</div>
		</div>
	);
};

/** Anonyme Silhouette (Kopf + Schultern, kein Gesicht) mit Fragezeichen. */
export const Silhouette: React.FC<{size: number; color?: string; q?: boolean}> = ({size, color = '#3A4685', q = true}) => (
	<svg width={size} height={size * 1.1} viewBox="0 0 100 110">
		<circle cx={50} cy={36} r={22} fill={color} />
		<path d="M10 108 Q12 66 50 64 Q88 66 90 108 Z" fill={color} />
		{q ? (
			<text x={50} y={45} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={900} fontSize={30} fill={withAlpha('#FFFFFF', 0.85)}>
				?
			</text>
		) : null}
	</svg>
);

/** Raster kleiner Personen-Symbole – `fill` 0–1 färbt sie nach und nach ein (Umfang der Kontrollen, keine Einzelpersonen). */
export const PeopleGrid: React.FC<{cols: number; rows: number; cell: number; fill: number; color: string}> = ({cols, rows, cell, fill, color}) => {
	const n = cols * rows;
	const lit = Math.round(n * Math.max(0, Math.min(1, fill)));
	return (
		<svg width={cols * cell} height={rows * cell} viewBox={`0 0 ${cols * cell} ${rows * cell}`}>
			{new Array(n).fill(0).map((_, i) => {
				const x = (i % cols) * cell + cell / 2;
				const y = Math.floor(i / cols) * cell + cell / 2;
				const on = i < lit;
				const c = on ? color : withAlpha('#FFFFFF', 0.16);
				return (
					<g key={i}>
						<circle cx={x} cy={y - cell * 0.16} r={cell * 0.14} fill={c} />
						<path d={`M${x - cell * 0.24} ${y + cell * 0.32} Q${x} ${y - cell * 0.06} ${x + cell * 0.24} ${y + cell * 0.32} Z`} fill={c} />
					</g>
				);
			})}
		</svg>
	);
};
