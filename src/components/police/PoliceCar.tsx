import React from 'react';
import {useCurrentFrame} from 'remotion';

export type PoliceCarProps = {
	width?: number;
	/** Blaulicht blinkt (Frames-Phase). */
	lights?: boolean;
	phase?: number;
	/** Fahrtrichtung: 1 = nach rechts, -1 = nach links (spiegelt die Zeichnung). */
	direction?: 1 | -1;
};

/** Stilisierter Streifenwagen (eigene Vektorzeichnung, neutral – keine Wappen oder Kennzeichen). */
export const PoliceCar: React.FC<PoliceCarProps> = ({width = 330, lights = true, phase = 0, direction = 1}) => {
	const frame = useCurrentFrame();
	const blink = Math.floor((frame + phase) / 5) % 2 === 0;
	return (
		<svg width={width} height={width * 0.42} viewBox="0 0 330 138" style={{scale: `${direction} 1`, overflow: 'visible'}}>
			{/* Schein */}
			{lights ? (
				<>
					<ellipse cx={blink ? 120 : 190} cy={30} rx={70} ry={26} fill={blink ? '#2E6BFF' : '#FF3B4E'} opacity={0.35} />
					<ellipse cx={155} cy={128} rx={150} ry={9} fill="#000" opacity={0.4} />
				</>
			) : null}
			{/* Karosserie */}
			<path d="M 14 96 Q 12 70 40 66 L 92 58 Q 112 30 150 28 L 206 28 Q 236 32 252 58 L 296 66 Q 322 72 318 98 L 318 106 L 14 106 Z" fill="#F4F6FF" stroke="#232C55" strokeWidth={5} strokeLinejoin="round" />
			{/* Blaue Seitenstreifen */}
			<path d="M 14 84 L 318 84 L 318 98 L 14 98 Z" fill="#2E6BFF" />
			{/* Fenster */}
			<path d="M 104 60 Q 120 38 150 36 L 176 36 L 176 62 Z" fill="#8FD0FF" stroke="#232C55" strokeWidth={4} />
			<path d="M 184 36 L 204 36 Q 228 40 240 62 L 184 62 Z" fill="#8FD0FF" stroke="#232C55" strokeWidth={4} />
			{/* Lichtbalken */}
			<rect x={140} y={16} width={74} height={14} rx={6} fill="#232C55" />
			<rect x={144} y={18} width={31} height={10} rx={4} fill={lights && blink ? '#2E6BFF' : '#1B3A8C'} />
			<rect x={179} y={18} width={31} height={10} rx={4} fill={lights && !blink ? '#FF3B4E' : '#7A1E2E'} />
			{/* Räder */}
			{[78, 262].map((x) => (
				<g key={x}>
					<circle cx={x} cy={108} r={26} fill="#0B1029" stroke="#232C55" strokeWidth={4} />
					<circle cx={x} cy={108} r={12} fill="#8B93B8" />
				</g>
			))}
			<rect x={300} y={78} width={20} height={9} rx={4} fill="#FFE9A3" />
		</svg>
	);
};
