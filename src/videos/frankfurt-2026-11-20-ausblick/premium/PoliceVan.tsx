import React from 'react';
import {useCurrentFrame} from 'remotion';
import {useSvgId} from '../../../lib/svg';

/**
 * Detaillierter, generischer Einsatz-Transporter (eigene Vektorzeichnung, Seitenansicht).
 * Keine Wappen, keine Kennzeichen, keine reale Fahrzeugmarke – nur das Gattungswort „POLIZEI“.
 */
export const PoliceVan: React.FC<{width: number; phase?: number; lights?: boolean; style?: React.CSSProperties}> = ({width, phase = 0, lights = true, style}) => {
	const frame = useCurrentFrame();
	const id = useSvgId('van');
	const blink = Math.floor((frame + phase) / 4) % 2 === 0;
	const h = (width * 250) / 520;
	return (
		<svg width={width} height={h} viewBox="0 0 520 250" style={{overflow: 'visible', ...style}}>
			<defs>
				<linearGradient id={`${id}-body`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#F7F9FF" />
					<stop offset="0.55" stopColor="#D9DFEE" />
					<stop offset="1" stopColor="#AEB7CF" />
				</linearGradient>
				<linearGradient id={`${id}-blue`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#2F6BE0" />
					<stop offset="1" stopColor="#1A47A8" />
				</linearGradient>
				<linearGradient id={`${id}-win`} x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stopColor="#5A7FB8" />
					<stop offset="1" stopColor="#16244A" />
				</linearGradient>
				<radialGradient id={`${id}-beam`}>
					<stop offset="0" stopColor={blink ? '#4F8BFF' : '#7FB0FF'} stopOpacity={0.7} />
					<stop offset="1" stopColor="#4F8BFF" stopOpacity={0} />
				</radialGradient>
			</defs>
			{lights ? <ellipse cx={blink ? 170 : 250} cy={34} rx={130} ry={48} fill={`url(#${id}-beam)`} /> : null}
			<ellipse cx={262} cy={226} rx={250} ry={12} fill="#000000" opacity={0.45} />
			{/* Karosserie */}
			<path d="M24 62 Q24 40 46 40 L372 40 Q392 40 404 56 L446 112 Q500 120 506 150 L508 200 Q508 210 498 210 L30 210 Q22 210 22 200 Z" fill={`url(#${id}-body)`} stroke="#3A4466" strokeWidth={4} strokeLinejoin="round" />
			{/* Lichtkante oben */}
			<path d="M46 46 L370 46" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={0.8} />
			{/* blaues Band + Schrift */}
			<path d="M23 140 L506 140 L507 176 L23 176 Z" fill={`url(#${id}-blue)`} />
			<path d="M23 136 L506 136" stroke="#FFD23F" strokeWidth={3} opacity={0.85} />
			<text x={196} y={169} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={900} fontSize={30} letterSpacing={6} fill="#FFFFFF">
				POLIZEI
			</text>
			{/* Fenster */}
			<rect x={52} y={60} width={120} height={56} rx={8} fill={`url(#${id}-win)`} stroke="#3A4466" strokeWidth={3} />
			<rect x={184} y={60} width={150} height={56} rx={8} fill={`url(#${id}-win)`} stroke="#3A4466" strokeWidth={3} />
			<path d="M352 60 L388 60 Q394 60 398 66 L428 108 L352 108 Z" fill={`url(#${id}-win)`} stroke="#3A4466" strokeWidth={3} />
			<path d="M64 108 L98 64 M196 108 L230 64" stroke="#FFFFFF" strokeWidth={6} opacity={0.18} />
			{/* Türfugen, Griff, Spiegel */}
			<path d="M178 60 V206 M346 56 V206" stroke="#7A84A6" strokeWidth={2.5} />
			<rect x={318} y={124} width={22} height={6} rx={3} fill="#4A5476" />
			<path d="M428 92 l14 -6 l4 16 l-14 4 z" fill="#2A3352" />
			{/* Lichtbalken */}
			<rect x={150} y={26} width={140} height={16} rx={7} fill="#1C2340" />
			<rect x={156} y={29} width={62} height={10} rx={4} fill={lights && blink ? '#5A95FF' : '#1E3A8A'} />
			<rect x={222} y={29} width={62} height={10} rx={4} fill={lights && !blink ? '#5A95FF' : '#1E3A8A'} />
			{/* Scheinwerfer / Rücklicht */}
			<path d="M492 150 l14 0 l1 16 l-15 0 z" fill="#FFF3C4" />
			<ellipse cx={540} cy={160} rx={46} ry={14} fill="#FFF3C4" opacity={0.25} />
			<rect x={22} y={150} width={8} height={22} rx={2} fill="#E0303E" />
			{/* Räder */}
			{[112, 410].map((x) => (
				<g key={x}>
					<path d={`M${x - 46} 210 A46 46 0 0 1 ${x + 46} 210`} fill="#1C2034" />
					<circle cx={x} cy={210} r={34} fill="#0E1020" />
					<circle cx={x} cy={210} r={20} fill="#9AA3BF" />
					<circle cx={x} cy={210} r={8} fill="#4A5270" />
					{[0, 72, 144, 216, 288].map((a) => (
						<circle key={a} cx={x + Math.cos(((a + frame * 18) * Math.PI) / 180) * 14} cy={210 + Math.sin(((a + frame * 18) * Math.PI) / 180) * 14} r={2.4} fill="#2E3450" />
					))}
				</g>
			))}
		</svg>
	);
};
