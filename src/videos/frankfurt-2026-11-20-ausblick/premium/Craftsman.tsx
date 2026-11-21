import React from 'react';
import {random, useCurrentFrame} from 'remotion';
import {useSvgId} from '../../../lib/svg';

/**
 * Sympathischer Comic-Handwerker (stilisiert, keine reale Person): Helm mit Glanz, freundliches Gesicht,
 * Latzhose mit Taschen, Werkzeuggürtel, Handschuhe, Sicherheitsschuhe, Akkuschrauber mit Funken.
 * `drilling` (0–1) steuert Schrauberbewegung + Funken; `wave` lässt ihn kurz grüßen.
 */
export const Craftsman: React.FC<{height: number; drilling: number; blink?: boolean; style?: React.CSSProperties}> = ({height, drilling, blink = false, style}) => {
	const frame = useCurrentFrame();
	const id = useSvgId('craft');
	const w = (height * 300) / 460;
	const jitter = drilling > 0 ? Math.sin(frame * 2.4) * 2.2 * drilling : 0;
	const armRot = -18 + drilling * 10 + jitter;
	const breathe = Math.sin(frame / 14) * 1.5;
	return (
		<svg width={w} height={height} viewBox="0 0 300 460" style={{overflow: 'visible', ...style}}>
			<defs>
				<linearGradient id={`${id}-helmet`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#FFE36A" />
					<stop offset="1" stopColor="#F2B705" />
				</linearGradient>
				<linearGradient id={`${id}-overall`} x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stopColor="#3D7BFF" />
					<stop offset="1" stopColor="#1F4FC2" />
				</linearGradient>
				<radialGradient id={`${id}-spark`}>
					<stop offset="0" stopColor="#FFFFFF" />
					<stop offset="0.4" stopColor="#FFE38A" />
					<stop offset="1" stopColor="#FF9A3D" stopOpacity={0} />
				</radialGradient>
			</defs>
			<ellipse cx={140} cy={452} rx={110} ry={10} fill="#000000" opacity={0.4} />
			{/* Beine + Schuhe */}
			<rect x={96} y={318} width={40} height={118} rx={14} fill="#1F4FC2" />
			<rect x={146} y={318} width={40} height={118} rx={14} fill="#1F4FC2" />
			<path d="M84 430 Q84 416 104 416 L136 416 L140 446 L84 446 Z" fill="#3A2A1E" />
			<path d="M146 416 L180 416 Q200 416 200 432 L200 446 L142 446 Z" fill="#3A2A1E" />
			<rect x={84} y={440} width={56} height={7} rx={3} fill="#1A120C" />
			<rect x={142} y={440} width={58} height={7} rx={3} fill="#1A120C" />
			<g transform={`translate(0 ${breathe * 0.4})`}>
				{/* Shirt + Latzhose */}
				<path d="M78 190 Q140 168 202 190 L210 250 L70 250 Z" fill="#E9483A" />
				<path d="M86 200 Q140 186 194 200 L200 336 Q140 346 80 336 Z" fill={`url(#${id}-overall)`} />
				<rect x={110} y={214} width={60} height={48} rx={8} fill="#2558D8" stroke="#163C9E" strokeWidth={3} />
				<path d="M120 230 h40" stroke="#163C9E" strokeWidth={3} />
				<circle cx={98} cy={210} r={6} fill="#FFD23F" />
				<circle cx={182} cy={210} r={6} fill="#FFD23F" />
				{/* Werkzeuggürtel */}
				<rect x={80} y={282} width={120} height={18} rx={6} fill="#8A5A2E" />
				<rect x={132} y={281} width={18} height={20} rx={3} fill="#D9B24A" />
				<rect x={88} y={298} width={30} height={34} rx={5} fill="#A06A36" />
				<path d="M100 298 L96 262 M104 298 L112 268" stroke="#4A4E60" strokeWidth={5} strokeLinecap="round" />
				<rect x={164} y={298} width={26} height={30} rx={5} fill="#A06A36" />
				<rect x={170} y={282} width={6} height={22} fill="#C0C6D8" />
				{/* linker Arm (hält Platte/Hüfte) */}
				<path d="M82 200 Q48 240 66 292" stroke="#E9483A" strokeWidth={30} strokeLinecap="round" fill="none" />
				<circle cx={68} cy={296} r={17} fill="#F2B705" />
				{/* rechter Arm mit Akkuschrauber */}
				<g transform={`rotate(${armRot} 196 200)`}>
					<path d="M196 200 Q246 214 258 172" stroke="#E9483A" strokeWidth={30} strokeLinecap="round" fill="none" />
					<circle cx={258} cy={166} r={17} fill="#F2B705" />
					<g transform="translate(244 112)">
						<rect x={0} y={34} width={26} height={44} rx={7} fill="#2A2E40" />
						<rect x={-6} y={4} width={64} height={34} rx={10} fill="#FF7A1A" />
						<rect x={-2} y={8} width={20} height={26} rx={6} fill="#2A2E40" />
						<rect x={58} y={16} width={16} height={10} rx={3} fill="#C0C6D8" />
						<rect x={74} y={19} width={18} height={4} fill="#E3E8F4" />
					</g>
					{drilling > 0.05
						? new Array(7).fill(true).map((_, i) => {
								const life = ((frame * 1.7 + i * 9) % 14) / 14;
								const a = -1.2 + random(`sp-a-${i}`) * 2.4;
								const r = 6 + life * (26 + random(`sp-r-${i}`) * 30);
								return <circle key={i} cx={338 + Math.cos(a) * r} cy={133 + Math.sin(a) * r} r={(1 - life) * 6} fill={`url(#${id}-spark)`} opacity={drilling} />;
							})
						: null}
				</g>
				{/* Kopf */}
				<rect x={128} y={168} width={26} height={22} rx={8} fill="#E9B48A" />
				<circle cx={140} cy={128} r={52} fill="#F2C29A" />
				<ellipse cx={88} cy={132} rx={9} ry={13} fill="#E9B48A" />
				<ellipse cx={192} cy={132} rx={9} ry={13} fill="#E9B48A" />
				{/* Gesicht: Augen mit Glanz, Brauen, Wangen, Schnurrbart, Lächeln */}
				{blink ? (
					<path d="M110 128 q8 5 16 0 M154 128 q8 5 16 0" stroke="#2A1A12" strokeWidth={4} strokeLinecap="round" fill="none" />
				) : (
					<g>
						<ellipse cx={118} cy={128} rx={8} ry={10} fill="#2A1A12" />
						<ellipse cx={162} cy={128} rx={8} ry={10} fill="#2A1A12" />
						<circle cx={121} cy={124} r={3} fill="#FFFFFF" />
						<circle cx={165} cy={124} r={3} fill="#FFFFFF" />
					</g>
				)}
				<path d="M106 110 q12 -8 24 -2 M150 108 q12 -6 24 2" stroke="#6A3E22" strokeWidth={5} strokeLinecap="round" fill="none" />
				<circle cx={104} cy={150} r={10} fill="#FF8A7A" opacity={0.45} />
				<circle cx={176} cy={150} r={10} fill="#FF8A7A" opacity={0.45} />
				<path d="M122 154 Q140 146 158 154 Q150 162 140 158 Q130 162 122 154 Z" fill="#6A3E22" />
				<path d="M126 164 Q140 178 154 164" stroke="#7A2E22" strokeWidth={5} strokeLinecap="round" fill="#B4473A" />
				{/* Helm mit Glanz */}
				<path d="M84 116 Q84 58 140 54 Q196 58 196 116 Z" fill={`url(#${id}-helmet)`} />
				<rect x={74} y={108} width={132} height={14} rx={7} fill="#E5A800" />
				<path d="M136 56 L136 112 M118 60 Q112 84 112 112 M158 60 Q166 84 166 112" stroke="#E5A800" strokeWidth={5} fill="none" />
				<path d="M100 82 Q108 66 124 62" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" opacity={0.65} fill="none" />
			</g>
		</svg>
	);
};
