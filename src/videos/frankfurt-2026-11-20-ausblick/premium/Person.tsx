import React from 'react';
import {random} from 'remotion';
import {mix} from '../../../lib/color';

export type Costume = 'none' | 'witch' | 'cat' | 'devil' | 'skeleton' | 'ghost' | 'umbrella' | 'hood' | 'scarf';

const SKIN = ['#E9C2A0', '#C99A76', '#9C6B4E', '#F1D3B8', '#7A4E36'];
const TOPS = ['#3A4A7A', '#5A3A5A', '#2F5A5A', '#6A4A2E', '#4A4A58', '#7A2E3A', '#2E3E62'];
const BOTTOMS = ['#1E2238', '#2A2A30', '#24304A', '#30262E'];

/**
 * Anonyme, stilisierte Figur (kein Gesicht, keine reale Person) mit optionalem Kostüm/Accessoire.
 * Lokales Raster: Füße bei (0|0), Höhe 100 Einheiten → per `h` skaliert. `light` tönt die Figur
 * Richtung Umgebungslicht, `rim` setzt eine Kantenlicht-Linie.
 */
export const Person: React.FC<{
	x: number;
	y: number;
	h: number;
	seed: string;
	costume?: Costume;
	step?: number;
	light?: string;
	lightAmount?: number;
	rim?: string;
	dir?: 1 | -1;
}> = ({x, y, h, seed, costume = 'none', step = 0, light = '#000000', lightAmount = 0, rim, dir = 1}) => {
	const pick = <T,>(arr: T[], k: string) => arr[Math.floor(random(`${seed}-${k}`) * arr.length)];
	const tint = (c: string) => (lightAmount > 0 ? mix(c, light, lightAmount) : c);
	const skin = tint(pick(SKIN, 'skin'));
	const top = tint(pick(TOPS, 'top'));
	const bottom = tint(pick(BOTTOMS, 'bottom'));
	const hair = tint(pick(['#1A1412', '#3A2418', '#6A4A2A', '#C9A46A', '#2A2A2A'], 'hair'));
	const s = h / 100;
	const swing = Math.sin(step) * 6;
	const bob = Math.abs(Math.cos(step)) * -1.2;
	const ghost = costume === 'ghost';
	return (
		<g transform={`translate(${x} ${y}) scale(${s * dir} ${s})`}>
			<ellipse cx={0} cy={0} rx={17} ry={3.2} fill="#000000" opacity={0.35} />
			<g transform={`translate(0 ${bob})`}>
				{/* Umhang hinter dem Körper */}
				{costume === 'witch' || costume === 'devil' ? <path d="M-13 -80 Q-22 -40 -20 -14 L20 -14 Q22 -40 13 -80 Z" fill={costume === 'witch' ? '#2A1238' : '#5A0E18'} /> : null}
				{/* Beine */}
				<path d={`M-6 -46 L${-6 - swing * 0.6} -3`} stroke={bottom} strokeWidth={8} strokeLinecap="round" />
				<path d={`M6 -46 L${6 + swing * 0.6} -3`} stroke={bottom} strokeWidth={8} strokeLinecap="round" />
				<ellipse cx={-6 - swing * 0.6 + 2} cy={-1.5} rx={6} ry={3} fill="#121218" />
				<ellipse cx={6 + swing * 0.6 + 2} cy={-1.5} rx={6} ry={3} fill="#121218" />
				{costume === 'skeleton' ? (
					<>
						<path d={`M-6 -42 L${-6 - swing * 0.6} -6 M6 -42 L${6 + swing * 0.6} -6`} stroke="#E8ECF8" strokeWidth={2.2} strokeDasharray="6 3" />
					</>
				) : null}
				{/* Arme */}
				<path d={`M-13 -77 Q-17 -62 ${-15 + swing * 0.7} -50`} stroke={top} strokeWidth={6.5} strokeLinecap="round" fill="none" />
				{costume === 'umbrella' ? (
					<path d="M13 -77 Q20 -84 14 -96" stroke={top} strokeWidth={6.5} strokeLinecap="round" fill="none" />
				) : (
					<path d={`M13 -77 Q17 -62 ${15 - swing * 0.7} -50`} stroke={top} strokeWidth={6.5} strokeLinecap="round" fill="none" />
				)}
				{/* Oberkörper / Jacke */}
				<path d="M-14 -80 Q0 -84 14 -80 L12 -42 Q0 -38 -12 -42 Z" fill={top} />
				<path d="M0 -80 L0 -44" stroke={mix(top, '#000000', 0.3)} strokeWidth={1.5} />
				{costume === 'scarf' ? <path d="M-9 -81 Q0 -76 9 -81 L8 -77 Q0 -72 -8 -77 Z M4 -77 l4 14 l-5 1 z" fill={tint('#C8423A')} /> : null}
				{costume === 'skeleton' ? <path d="M-8 -74 H8 M-9 -68 H9 M-8 -62 H8 M-7 -56 H7 M0 -78 V-48" stroke="#E8ECF8" strokeWidth={2.2} strokeLinecap="round" /> : null}
				{/* Kopf */}
				<rect x={-3} y={-86} width={6} height={6} fill={skin} />
				<circle cx={0} cy={-91} r={8} fill={skin} />
				{costume === 'hood' || costume === 'umbrella' ? (
					<path d="M-9.5 -88 Q-10 -102 0 -102 Q10 -102 9.5 -88 L8 -84 Q0 -96 -8 -84 Z" fill={top} />
				) : (
					<path d="M-8.4 -91 Q-9 -100.5 0 -100.5 Q9 -100.5 8.4 -91 Q4 -96 -8.4 -91 Z" fill={hair} />
				)}
				{costume === 'skeleton' ? <circle cx={0} cy={-91} r={8} fill="#E8ECF8" opacity={0.9} /> : null}
				{costume === 'witch' ? (
					<g>
						<ellipse cx={0} cy={-97} rx={15} ry={3} fill="#1A0E26" />
						<path d="M-8 -97 L3 -124 L6 -120 L8 -97 Z" fill="#1A0E26" />
						<rect x={-8} y={-100} width={16} height={3} fill="#F07A1E" />
					</g>
				) : null}
				{costume === 'cat' ? (
					<g fill={hair}>
						<path d="M-7.5 -96 L-6 -106 L-1.5 -99 Z" />
						<path d="M7.5 -96 L6 -106 L1.5 -99 Z" />
						<path d="M10 -46 Q24 -48 22 -64" stroke={hair} strokeWidth={2.5} fill="none" strokeLinecap="round" />
					</g>
				) : null}
				{costume === 'devil' ? (
					<g fill="#E03A3A">
						<path d="M-6 -98 Q-9 -106 -4 -108 Q-5 -103 -2.5 -99 Z" />
						<path d="M6 -98 Q9 -106 4 -108 Q5 -103 2.5 -99 Z" />
					</g>
				) : null}
				{ghost ? <path d="M-15 -86 Q-16 -104 0 -104 Q16 -104 15 -86 L17 -8 l-6 -4 l-5 5 l-6 -5 l-6 5 l-5 -5 l-6 4 Z" fill="#EEF0FA" opacity={0.95} /> : null}
				{costume === 'umbrella' ? (
					<g>
						<path d="M14 -96 L14 -126" stroke="#2A2E40" strokeWidth={1.6} />
						<path d="M-18 -122 Q14 -146 46 -122 Q38 -126 30 -122 Q22 -127 14 -122 Q6 -127 -2 -122 Q-10 -126 -18 -122 Z" fill={tint('#2A3A6A')} />
					</g>
				) : null}
				{rim ? <path d="M14 -80 L12 -42 M8.4 -91 A8 8 0 0 0 4 -98.5" stroke={rim} strokeWidth={1.6} fill="none" opacity={0.8} strokeLinecap="round" /> : null}
			</g>
		</g>
	);
};
