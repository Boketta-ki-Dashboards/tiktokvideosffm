import React from 'react';
import {random} from 'remotion';
import {COLORS, FONTS} from '../../theme/tokens';

export type StorefrontMotif = 'shoe' | 'perfume' | 'shield' | 'carpet' | 'wine' | 'cosmetics' | 'run' | 'sports' | 'unknown';

const MOTIF_COLORS: Record<StorefrontMotif, string> = {
	shoe: '#3DD9EB',
	perfume: '#FF8FB1',
	shield: '#9AA5C8',
	carpet: '#E0A458',
	wine: '#B0435A',
	cosmetics: '#F6A6D7',
	run: '#7CE38B',
	sports: '#5BA8FF',
	unknown: '#8A93B5',
};

/** Branchensymbol in der Auslage (eigene, schlichte Zeichnung). */
const Motif: React.FC<{motif: StorefrontMotif; color: string}> = ({motif, color}) => {
	switch (motif) {
		case 'shoe':
			return <path d="M -46 12 L -46 -8 L -22 -12 L -8 0 L 16 4 L 40 8 Q 50 10 50 18 L 50 22 L -46 22 Z" fill={color} />;
		case 'perfume':
			return (
				<g fill={color}>
					<rect x={-20} y={-10} width={40} height={36} rx={8} />
					<rect x={-7} y={-22} width={14} height={12} />
					<rect x={-12} y={-30} width={24} height={9} rx={3} />
				</g>
			);
		case 'shield':
			return <path d="M 0 -32 L 28 -20 L 28 2 C 28 20 14 32 0 38 C -14 32 -28 20 -28 2 L -28 -20 Z" fill={color} />;
		case 'carpet':
			return (
				<g>
					<rect x={-44} y={-26} width={88} height={52} rx={4} fill={color} />
					<rect x={-34} y={-16} width={68} height={32} fill="none" stroke="#5A3418" strokeWidth={4} />
					<path d="M 0 -12 L 14 0 L 0 12 L -14 0 Z" fill="#5A3418" />
				</g>
			);
		case 'wine':
			return (
				<g fill={color}>
					<rect x={-26} y={-12} width={16} height={40} rx={5} />
					<rect x={-21} y={-26} width={6} height={16} />
					<rect x={6} y={-12} width={16} height={40} rx={5} />
					<rect x={11} y={-26} width={6} height={16} />
				</g>
			);
		case 'cosmetics':
			return (
				<g fill={color}>
					<rect x={-26} y={-6} width={14} height={32} rx={3} />
					<rect x={-24} y={-20} width={10} height={14} rx={4} />
					<circle cx={14} cy={14} r={14} />
				</g>
			);
		case 'run':
			return (
				<g fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round">
					<circle cx={8} cy={-24} r={7} fill={color} stroke="none" />
					<path d="M -18 30 L -4 6 L 10 14 L 10 32 M -26 -2 L -6 -14 L 12 -10 L 22 2 L 34 4 M -4 6 L -12 -8" />
				</g>
			);
		case 'sports':
			return (
				<g>
					<circle r={26} fill="#FFFFFF" />
					<path d="M 0 -10 L 9 -3 L 6 8 L -6 8 L -9 -3 Z" fill="#1A2247" />
				</g>
			);
		default:
			return (
				<text y={16} textAnchor="middle" fontFamily={FONTS.heading} fontWeight={900} fontSize={52} fill={color}>
					?
				</text>
			);
	}
};

export type StorefrontIllustrationProps = {
	motif: StorefrontMotif;
	width: number;
	height: number;
	/** Gesprungenes Glas zeigen (nur wenn Sachschaden belegt ist). */
	cracked?: boolean;
	/** Verbrettert (z. B. Spanplatte). */
	boarded?: boolean;
	seed?: string;
};

/**
 * Stilisierte Ladenfront als Platzhalter für fehlende, rechtlich nutzbare Fotos.
 * Wird immer mit dem Hinweis „Illustration“ gezeigt – nie als echtes Foto ausgeben.
 */
export const StorefrontIllustration: React.FC<StorefrontIllustrationProps> = ({motif, width, height, cracked = false, boarded = false, seed = 'shop'}) => {
	const color = MOTIF_COLORS[motif];
	const cracks = new Array(9).fill(true).map((_, i) => {
		const a = (i / 9) * Math.PI * 2 + random(`${seed}-a-${i}`) * 0.5;
		const len = 40 + random(`${seed}-l-${i}`) * 70;
		const midA = a + (random(`${seed}-m-${i}`) - 0.5) * 0.6;
		return `M 0 0 L ${Math.cos(midA) * len * 0.5} ${Math.sin(midA) * len * 0.5} L ${Math.cos(a) * len} ${Math.sin(a) * len}`;
	});
	return (
		<svg width={width} height={height} viewBox="0 0 300 220" preserveAspectRatio="xMidYMid slice">
			<rect width={300} height={220} fill="#151B3F" />
			{/* Fassade */}
			<rect x={0} y={0} width={300} height={42} fill="#232C5E" />
			<rect x={20} y={10} width={260} height={22} rx={4} fill="#0D1230" />
			{/* Markise */}
			<path d="M 14 42 L 286 42 L 296 62 L 4 62 Z" fill={color} opacity={0.85} />
			{/* Schaufenster */}
			<rect x={30} y={72} width={240} height={120} rx={6} fill="#0B1029" stroke="#3A4580" strokeWidth={4} />
			<rect x={34} y={76} width={232} height={112} rx={4} fill={color} opacity={0.08} />
			<g transform="translate(150 138)">
				<Motif motif={motif} color={color} />
			</g>
			<rect x={30} y={196} width={240} height={10} fill="#2A3366" />
			{boarded ? (
				<g>
					<rect x={34} y={76} width={232} height={112} fill="#B98A55" />
					{[0, 1, 2, 3].map((k) => (
						<rect key={k} x={34} y={86 + k * 28} width={232} height={4} fill="#8C643A" />
					))}
				</g>
			) : null}
			{cracked && !boarded ? (
				<g transform="translate(118 112)" stroke="#E8F1FF" strokeWidth={2.4} fill="none" opacity={0.9}>
					{cracks.map((d, i) => (
						<path key={i} d={d} />
					))}
					<circle r={10} fill="#E8F1FF" opacity={0.35} stroke="none" />
				</g>
			) : null}
			{/* Lichtreflex */}
			<path d="M 60 80 L 90 80 L 50 186 L 34 186 Z" fill="#FFFFFF" opacity={0.05} />
			<rect x={0} y={206} width={300} height={14} fill={COLORS.night} />
		</svg>
	);
};
