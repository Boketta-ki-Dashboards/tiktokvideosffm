import React from 'react';
import {useCurrentFrame} from 'remotion';
import {useSvgId} from '../../../lib/svg';

/**
 * Stilisierte Figuren für die Kontrollszene (anonym, keine realen Personen): Einsatzkraft in dunkelblauer Uniform
 * mit Mütze und „POLIZEI“-Schriftzug, Jugendlicher mit Hoodie, Cap und Smartphone. Ruhige, respektvolle Körpersprache.
 * Lokales Raster 300 × 760 (Füße unten), `height` skaliert.
 */

const Face: React.FC<{skin: string; hair: string; blink: boolean; mood?: 'neutral' | 'friendly' | 'thinking'; cap?: React.ReactNode}> = ({skin, hair, blink, mood = 'neutral', cap}) => (
	<g>
		<rect x={128} y={150} width={44} height={40} rx={14} fill={skin} />
		<ellipse cx={150} cy={112} rx={52} ry={58} fill={skin} />
		<ellipse cx={99} cy={118} rx={9} ry={14} fill={skin} />
		<ellipse cx={201} cy={118} rx={9} ry={14} fill={skin} />
		{cap ?? <path d="M98 104 Q96 52 150 50 Q204 52 202 104 Q186 76 150 78 Q114 76 98 104 Z" fill={hair} />}
		{blink ? (
			<path d="M124 118 q8 5 16 0 M160 118 q8 5 16 0" stroke="#24180F" strokeWidth={4} strokeLinecap="round" fill="none" />
		) : (
			<g>
				<ellipse cx={132} cy={118} rx={6} ry={7.5} fill="#24180F" />
				<ellipse cx={168} cy={118} rx={6} ry={7.5} fill="#24180F" />
				<circle cx={134} cy={115} r={2.2} fill="#FFFFFF" />
				<circle cx={170} cy={115} r={2.2} fill="#FFFFFF" />
			</g>
		)}
		<path d={mood === 'thinking' ? 'M120 100 q12 -6 22 0 M158 98 q12 -2 22 4' : 'M120 102 q12 -6 22 -1 M158 101 q12 -5 22 1'} stroke={hair} strokeWidth={4.5} strokeLinecap="round" fill="none" />
		<path d="M150 124 q-4 12 2 16" stroke="#00000033" strokeWidth={3} fill="none" strokeLinecap="round" />
		<path d={mood === 'friendly' ? 'M136 146 Q150 158 164 146' : mood === 'thinking' ? 'M138 150 Q152 146 164 150' : 'M138 148 Q150 154 162 148'} stroke="#7A3A2A" strokeWidth={4.5} strokeLinecap="round" fill="none" />
	</g>
);

export const Officer: React.FC<{height: number; gesture?: number; talk?: boolean; style?: React.CSSProperties; flip?: boolean}> = ({height, gesture = 0, talk = false, style, flip = false}) => {
	const frame = useCurrentFrame();
	const id = useSvgId('officer');
	const w = (height * 300) / 760;
	const breathe = Math.sin(frame / 16) * 1.6;
	const blink = frame % 110 > 105;
	const armRot = -8 - gesture * 34 + (talk ? Math.sin(frame / 5) * 3 : 0);
	return (
		<svg width={w} height={height} viewBox="0 0 300 760" style={{overflow: 'visible', ...style}}>
			<defs>
				<linearGradient id={`${id}-uni`} x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stopColor="#2A3D6E" />
					<stop offset="1" stopColor="#16244A" />
				</linearGradient>
			</defs>
			<ellipse cx={150} cy={750} rx={120} ry={12} fill="#000000" opacity={0.4} />
			<g transform={flip ? 'translate(300 0) scale(-1 1)' : undefined}>
			{/* Beine */}
			<path d="M108 470 L100 728 L138 728 L148 480 Z" fill="#141C33" />
			<path d="M192 470 L200 728 L162 728 L152 480 Z" fill="#141C33" />
			<path d="M86 726 Q86 708 108 708 L140 708 L142 742 L86 742 Z M214 726 Q214 708 192 708 L160 708 L158 742 L214 742 Z" fill="#0B0D16" />
			<g transform={`translate(0 ${breathe * 0.3})`}>
				{/* Oberkörper: Jacke + Weste */}
				<path d="M82 214 Q150 190 218 214 L230 484 Q150 500 70 484 Z" fill={`url(#${id}-uni)`} />
				<path d="M100 236 L200 236 L206 440 L94 440 Z" fill="#1B2A52" stroke="#33477E" strokeWidth={3} />
				<rect x={104} y={300} width={92} height={28} rx={4} fill="#E3E8F6" />
				<rect x={118} y={250} width={20} height={34} rx={4} fill="#0F1630" />
				<rect x={120} y={238} width={6} height={16} rx={2} fill="#0F1630" />
				<path d="M150 236 L150 440" stroke="#0F1A38" strokeWidth={2} />
				<rect x={74} y={446} width={152} height={22} rx={6} fill="#0B0F1F" />
				<rect x={176} y={444} width={26} height={30} rx={4} fill="#1A1E2E" />
				{/* linker Arm (ruhig) */}
				<path d="M88 226 Q60 320 74 420" stroke="#1F3262" strokeWidth={42} strokeLinecap="round" fill="none" />
				<circle cx={76} cy={428} r={20} fill="#D9B08C" />
				{/* rechter Arm (Geste: offene Hand) */}
				<g transform={`rotate(${armRot} 214 228)`}>
					<path d="M214 226 Q244 322 232 408" stroke="#1F3262" strokeWidth={42} strokeLinecap="round" fill="none" />
					<path d="M220 404 q14 -8 26 2 l4 22 q-14 10 -28 4 z" fill="#D9B08C" />
				</g>
				{/* Kopf + Mütze */}
				<Face
					skin="#D9B08C"
					hair="#3A2A1E"
					blink={blink}
					mood={talk ? 'friendly' : 'neutral'}
					cap={
						<g>
							<path d="M92 84 Q96 34 150 30 Q204 34 208 84 Z" fill="#1A2546" />
							<rect x={86} y={78} width={128} height={14} rx={6} fill="#0E1430" />
							<path d="M98 90 Q150 102 202 90 L204 96 Q150 110 96 96 Z" fill="#0B0F22" />
							<circle cx={150} cy={58} r={10} fill="#C9D3EA" />
						</g>
					}
				/>
			</g>
			</g>
			{/* Schriftzug immer lesbar (nicht gespiegelt) */}
			<text x={150} y={321 + breathe * 0.3} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={900} fontSize={19} letterSpacing={2} fill="#1B2A52">
				POLIZEI
			</text>
		</svg>
	);
};

export const Youth: React.FC<{height: number; hoodie?: string; phoneUp?: number; calm?: boolean; style?: React.CSSProperties; skin?: string; flip?: boolean}> = ({
	height,
	hoodie = '#3D7BFF',
	phoneUp = 0,
	calm = true,
	style,
	skin = '#B98A66',
	flip = false,
}) => {
	const frame = useCurrentFrame();
	const id = useSvgId('youth');
	const w = (height * 300) / 760;
	const breathe = Math.sin(frame / 15) * 1.6;
	const blink = frame % 96 > 91;
	const armRot = -phoneUp * 48;
	return (
		<svg width={w} height={height} viewBox="0 0 300 760" style={{overflow: 'visible', ...style}}>
			<defs>
				<linearGradient id={`${id}-hood`} x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stopColor={hoodie} />
					<stop offset="1" stopColor="#1A2246" />
				</linearGradient>
			</defs>
			<ellipse cx={150} cy={750} rx={110} ry={11} fill="#000000" opacity={0.4} />
			<g transform={flip ? 'translate(300 0) scale(-1 1)' : undefined}>
			{/* Jogginghose + Sneaker */}
			<path d="M110 470 L104 724 L140 724 L150 480 Z" fill="#2A2C36" />
			<path d="M190 470 L196 724 L160 724 L150 480 Z" fill="#2A2C36" />
			<path d="M84 724 Q86 704 110 706 L142 708 L144 744 L84 744 Z" fill="#F2F4FA" />
			<path d="M216 724 Q214 704 190 706 L158 708 L156 744 L216 744 Z" fill="#F2F4FA" />
			<path d="M84 736 h60 M156 736 h60" stroke="#FF5A6A" strokeWidth={5} />
			<g transform={`translate(0 ${breathe * 0.3})`}>
				{/* Hoodie */}
				<path d="M86 218 Q150 194 214 218 L224 486 Q150 500 76 486 Z" fill={`url(#${id}-hood)`} />
				<path d="M112 380 L188 380 L182 440 L118 440 Z" fill="#00000026" />
				<path d="M128 218 L138 300 M172 218 L162 300" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={0.85} />
				<path d="M96 214 Q150 250 204 214 Q190 196 150 196 Q110 196 96 214 Z" fill="#00000040" />
				{/* linker Arm: in der Tasche / locker */}
				<path d="M92 228 Q66 320 92 400" stroke={hoodie} strokeWidth={42} strokeLinecap="round" fill="none" />
				<circle cx={96} cy={404} r={19} fill={skin} />
				{/* rechter Arm mit Smartphone */}
				<g transform={`rotate(${armRot} 210 232)`}>
					<path d="M210 230 Q238 320 214 392" stroke={hoodie} strokeWidth={42} strokeLinecap="round" fill="none" />
					<circle cx={212} cy={398} r={19} fill={skin} />
					<rect x={194} y={352} width={34} height={62} rx={7} fill="#0B0D18" stroke="#5A6078" strokeWidth={3} />
					<rect x={198} y={358} width={26} height={50} rx={4} fill={calm ? '#1E2A4A' : '#3D7BFF'} />
				</g>
				<Face
					skin={skin}
					hair="#1A1412"
					blink={blink}
					mood={calm ? 'neutral' : 'thinking'}
					cap={
						<g>
							<path d="M96 98 Q96 46 150 42 Q204 46 204 98 Z" fill="#14161F" />
							<path d="M96 98 Q60 104 54 116 Q90 112 132 104 Z" fill="#0B0C12" />
							<rect x={140} y={52} width={20} height={10} rx={3} fill="#FFD23F" opacity={0.85} />
						</g>
					}
				/>
			</g>
			</g>
		</svg>
	);
};
