import React from 'react';
import {interpolate, random, useCurrentFrame} from 'remotion';
import {clamp} from '../../../lib/animation';
import {Person} from '../../frankfurt-2026-11-20-ausblick/premium/Person';

/**
 * Stilisierte Illustration der Frankfurter Hauptwache (Barockbau mit Mansarddach, Mittelrisalit mit Dreiecksgiebel und
 * Arkadenbögen) mit der Katharinenkirche dahinter – abendliche Lichtstimmung, Laternen, wenige anonyme Passanten.
 * Keine Fotovorlage, kein Anspruch auf maßstabsgetreue Wiedergabe → im Bild als „ILLUSTRATION“ gekennzeichnet.
 * viewBox 900 × 520; `light` 0 → 1 schaltet Fenster/Laternen hoch, `people` 0 → 1 blendet Passanten ein.
 */
export const HauptwacheIllustration: React.FC<{width: number; light?: number; people?: number; drift?: number}> = ({width, light = 1, people = 1, drift = 0}) => {
	const frame = useCurrentFrame();
	const h = (width * 520) / 900;
	const flicker = (i: number) => 0.85 + 0.15 * Math.sin(frame / 7 + i * 1.7);
	const wall = '#A9483A';
	const wallDark = '#7E3328';
	const trim = '#E2B48C';
	const slate = '#262B40';
	const warm = '#FFC772';
	const win = (x: number, y: number, w: number, hh: number, i: number) => (
		<g key={`w-${x}-${y}`}>
			<path d={`M${x} ${y + hh} V${y + w * 0.35} Q${x + w / 2} ${y - w * 0.12} ${x + w} ${y + w * 0.35} V${y + hh} Z`} fill={trim} />
			<path d={`M${x + 5} ${y + hh - 4} V${y + w * 0.38} Q${x + w / 2} ${y + 2} ${x + w - 5} ${y + w * 0.38} V${y + hh - 4} Z`} fill={warm} opacity={(0.55 + 0.45 * light) * flicker(i)} />
			<path d={`M${x + w / 2} ${y + 8} V${y + hh - 4} M${x + 5} ${y + hh * 0.55} H${x + w - 5}`} stroke="#5A2A1E" strokeWidth={2.5} opacity={0.7} />
		</g>
	);
	const crowd = new Array(14).fill(0).map((_, i) => ({
		x: 120 + random(`hw-p-x-${i}`) * 680,
		y: 492 + random(`hw-p-y-${i}`) * 22,
		h: 54 + random(`hw-p-h-${i}`) * 16,
		dir: (random(`hw-p-d-${i}`) > 0.5 ? 1 : -1) as 1 | -1,
		appear: random(`hw-p-a-${i}`),
	}));
	return (
		<svg width={width} height={h} viewBox="0 0 900 520" style={{overflow: 'visible'}}>
			<defs>
				<radialGradient id="hw-glow" cx="0.5" cy="0.6" r="0.6">
					<stop offset="0" stopColor={warm} stopOpacity={0.35 * light} />
					<stop offset="1" stopColor={warm} stopOpacity={0} />
				</radialGradient>
				<linearGradient id="hw-ground" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#3B3550" />
					<stop offset="1" stopColor="#14152A" />
				</linearGradient>
				<linearGradient id="hw-copper" x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor="#2F6B5E" />
					<stop offset="0.5" stopColor="#4D9483" />
					<stop offset="1" stopColor="#285A4F" />
				</linearGradient>
			</defs>
			{/* Katharinenkirche (hinten links) */}
			<g style={{translate: `${drift * -14}px 0`}} opacity={0.92}>
				<rect x={40} y={262} width={210} height={210} fill={wallDark} />
				<path d="M40 262 L145 200 L250 262 Z" fill={slate} />
				{[70, 120, 170, 220].map((x, i) => (
					<path key={x} d={`M${x - 14} 440 V330 Q${x} 300 ${x + 14} 330 V440 Z`} fill={warm} opacity={0.35 * light * flicker(i + 3)} />
				))}
				<rect x={112} y={120} width={66} height={150} fill={wall} />
				<rect x={118} y={128} width={54} height={8} fill={trim} opacity={0.8} />
				<circle cx={145} cy={170} r={17} fill="#F3E3C2" stroke={trim} strokeWidth={4} />
				<path d="M145 170 V160 M145 170 L152 174" stroke="#3A2A20" strokeWidth={3} strokeLinecap="round" />
				<path d="M116 120 Q145 72 174 120 Z" fill="url(#hw-copper)" />
				<rect x={137} y={58} width={16} height={26} fill="url(#hw-copper)" />
				<path d="M134 60 Q145 34 156 60 Z" fill="url(#hw-copper)" />
				<path d="M145 36 V8" stroke="#4D9483" strokeWidth={3} />
				<circle cx={145} cy={8} r={3} fill="#E9C46A" />
			</g>
			{/* Lichtkuppel über dem Platz */}
			<ellipse cx={540} cy={430} rx={420} ry={150} fill="url(#hw-glow)" />
			{/* Hauptwache */}
			<g>
				{/* Mansarddach */}
				<path d="M268 330 L300 238 H780 L812 330 Z" fill={slate} />
				<path d="M300 238 L318 214 H762 L780 238 Z" fill="#323852" />
				{[330, 392, 652, 714].map((x, i) => (
					<g key={x}>
						<path d={`M${x} 300 V272 Q${x + 18} 252 ${x + 36} 272 V300 Z`} fill="#3A4160" />
						<path d={`M${x + 7} 296 V274 Q${x + 18} 262 ${x + 29} 274 V296 Z`} fill={warm} opacity={0.45 * light * flicker(i + 8)} />
					</g>
				))}
				{/* Mauerwerk */}
				<rect x={268} y={330} width={544} height={142} fill={wall} />
				<rect x={262} y={322} width={556} height={12} fill={trim} />
				<rect x={262} y={466} width={556} height={8} fill={wallDark} />
				{[268, 340, 740, 806].map((x) => (
					<rect key={x} x={x - 6} y={334} width={12} height={132} fill={trim} opacity={0.85} />
				))}
				{[296, 368, 690, 762].map((x, i) => win(x - 18, 360, 40, 86, i))}
				{/* Mittelrisalit mit Giebel und Arkaden */}
				<rect x={452} y={316} width={176} height={158} fill="#B8523F" />
				<path d="M440 318 L540 250 L640 318 Z" fill={wall} stroke={trim} strokeWidth={8} strokeLinejoin="round" />
				<ellipse cx={540} cy={292} rx={20} ry={16} fill="#F3E3C2" stroke={trim} strokeWidth={3} />
				<path d="M532 296 Q540 280 548 296" stroke="#8C3B32" strokeWidth={3} fill="none" />
				{[470, 525, 580].map((x, i) => (
					<g key={x}>
						<path d={`M${x} 474 V376 Q${x + 15} 350 ${x + 30} 376 V474 Z`} fill="#2B1A1A" />
						<path d={`M${x + 4} 474 V378 Q${x + 15} 358 ${x + 26} 378 V474 Z`} fill={warm} opacity={(0.4 + 0.5 * light) * flicker(i + 12)} />
					</g>
				))}
				{[452, 507, 562, 617].map((x) => (
					<rect key={x} x={x - 2} y={352} width={14} height={122} fill={trim} />
				))}
			</g>
			{/* Platz */}
			<rect x={0} y={472} width={900} height={48} fill="url(#hw-ground)" />
			<path d="M0 476 H900" stroke="#6E6688" strokeWidth={2} opacity={0.6} />
			{/* Laternen */}
			{[200, 860].map((x, i) => (
				<g key={x}>
					<rect x={x - 3} y={392} width={6} height={84} fill="#1C1E30" />
					<circle cx={x} cy={388} r={11} fill={warm} opacity={0.9 * flicker(i + 20)} />
					<circle cx={x} cy={388} r={40} fill={warm} opacity={0.18 * light} />
				</g>
			))}
			{/* wenige anonyme Passanten */}
			{crowd.map((p, i) => {
				const o = interpolate(people, [p.appear * 0.6, p.appear * 0.6 + 0.4], [0, 1], clamp);
				if (o <= 0) return null;
				return (
					<g key={i} opacity={o}>
						<Person x={p.x + Math.sin(frame / 40 + i) * 6 * p.dir} y={p.y} h={p.h} seed={`hw-${i}`} costume={i % 5 === 0 ? 'hood' : i % 4 === 0 ? 'scarf' : 'none'} step={frame / 9 + i} dir={p.dir} light={warm} lightAmount={0.18} />
					</g>
				);
			})}
		</svg>
	);
};
