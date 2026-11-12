import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {clamp} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {Person} from '../../../videos/frankfurt-2026-11-20-ausblick/premium/Person';
import {ZeilStreet} from '../../../videos/frankfurt-2026-11-polizeikontrollen/visuals/ZeilStreet';

/**
 * Zeil als Demo-Kulisse (2,5D): nutzt die Zentralperspektive von ZeilStreet und legt Demonstrierende mit Schildern,
 * eine hervorgehobene Person, eine stilisierte Konfliktzone im Hintergrund (Lichtschein + abstrakte Flugbahnen,
 * keine realistische Gewalt) und optional ruhiges Auseinandergehen darüber. Gleiche Projektion wie ZeilStreet.
 */
const F = 860;
const CX = 540;
const HORIZON = 880;
const EYE = 1.65;
const project = (dolly: number, pan: number) => (x: number, y: number, z: number): [number, number] => {
	const zz = Math.max(0.6, z - dolly);
	return [CX + (F * (x - pan)) / zz, HORIZON - (F * (y - EYE)) / zz];
};

const SLOGANS = ['ZUKUNFT', 'LAUT!', 'FÜR UNS', 'FFM ♥', 'JETZT', 'WIR', 'HÖRT ZU', 'GEMEINSAM'];
const SIGN_COLORS = ['#FFD23F', '#FFFFFF', '#3DDC97', '#FF8FA3', '#4FC3F7', '#FFB15C'];

export type DemoStreetProps = {
	dolly?: number;
	pan?: number;
	crowd?: number;
	/** Index der hervorgehobenen Person (Lichtkegel + Ring), -1 = keine, 'auto' = Person nahe `highlightZ` links der Mitte. */
	highlight?: number | 'auto';
	highlightZ?: number;
	highlightAmount?: number;
	/** 0–1: Konfliktzone im Hintergrund (Lichtschein, Flugbahnen). */
	conflict?: number;
	/** Seitliche Lage der Konfliktzone (Meter, + = rechts). */
	conflictX?: number;
	/** 0–1: ruhiges Auseinandergehen (Personen bewegen sich zur Seite/nach vorn). */
	disperse?: number;
	officers?: number;
	seed?: string;
	/** Beschriftung über der hervorgehobenen Person bzw. der Konfliktzone (0–1 = Einblendung). */
	youLabel?: string;
	riotLabel?: string;
	labels?: number;
};

const Tag: React.FC<{x: number; y: number; text: string; color: string; o: number; dark?: boolean}> = ({x, y, text, color, o, dark = false}) => {
	const w = text.length * 19 + 44;
	return (
		<g opacity={o} transform={`translate(${x} ${y - (1 - o) * 20})`}>
			<line x1={0} y1={0} x2={0} y2={-46} stroke={color} strokeWidth={3} />
			<circle cx={0} cy={0} r={6} fill={color} />
			<rect x={-w / 2} y={-46 - 52} width={w} height={52} rx={14} fill={dark ? 'rgba(8,10,28,0.92)' : color} stroke={color} strokeWidth={3} />
			<text x={0} y={-46 - 16} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={900} fontSize={30} fill={dark ? '#FFFFFF' : '#0B1029'}>
				{text}
			</text>
		</g>
	);
};

export const DemoStreet: React.FC<DemoStreetProps> = ({
	dolly = 0,
	pan = 0,
	crowd = 26,
	highlight: hl = -1,
	highlightZ = 12,
	highlightAmount = 0,
	conflict = 0,
	conflictX = 1.5,
	disperse = 0,
	officers = 3,
	seed = 'demo',
	youLabel,
	riotLabel,
	labels = 0,
}) => {
	const frame = useCurrentFrame();
	const p = project(dolly, pan);
	const base = new Array(crowd).fill(true).map((_, i) => ({z: 10 + random(`${seed}-z-${i}`) * 34, x: (random(`${seed}-x-${i}`) - 0.5) * 15}));
	const highlight = hl === 'auto' ? base.reduce((best, b, i) => (b.x > -4 && b.x < -1 && (best < 0 || Math.abs(b.z - highlightZ) < Math.abs(base[best].z - highlightZ)) ? i : best), -1) : hl;
	const people = base.map(({z, x}, i) => {
		const side = x < 0 ? -1 : 1;
		const dx = side * disperse * (6 + random(`${seed}-dx-${i}`) * 5);
		const dz = -disperse * (3 + random(`${seed}-dz-${i}`) * 4);
		return {i, z: z + dz, x: x + dx, sign: random(`${seed}-s-${i}`) > 0.45};
	});
	people.sort((a, b) => b.z - a.z);
	const CZ = 50;
	const [gx, gy] = p(conflictX, 0, CZ);
	const glowR = (F * 15) / Math.max(4, CZ - dolly);

	return (
		<AbsoluteFill>
			<ZeilStreet dolly={dolly} pan={pan} people={6} officers={officers} vans warm={0.65} blueLight={0.25 + conflict * 0.3} seed={`${seed}-street`} />
			<svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
				<defs>
					<radialGradient id={`${seed}-conflict`}>
						<stop offset="0" stopColor="#FF9A4D" stopOpacity={0.85} />
						<stop offset="0.45" stopColor="#FF4D3D" stopOpacity={0.38} />
						<stop offset="1" stopColor="#FF4D3D" stopOpacity={0} />
					</radialGradient>
					<radialGradient id={`${seed}-spot`}>
						<stop offset="0" stopColor="#FFF4C8" stopOpacity={0.55} />
						<stop offset="1" stopColor="#FFF4C8" stopOpacity={0} />
					</radialGradient>
				</defs>
				{/* Konfliktzone hinten: Lichtschein + abstrakte Flugbahnen (keine Darstellung von Verletzungen) */}
				{conflict > 0 ? (
					<g opacity={conflict}>
						<ellipse cx={gx} cy={gy - glowR * 0.25} rx={glowR * 2} ry={glowR * 1.05} fill={`url(#${seed}-conflict)`} opacity={0.8 + Math.sin(frame / 3) * 0.15} />
						{new Array(7).fill(true).map((_, k) => {
							const t = ((frame + k * 9) % 34) / 34;
							const x0 = gx - 70 + random(`${seed}-fx-${k}`) * 140;
							const x = x0 + (random(`${seed}-fv-${k}`) - 0.5) * 260 * t;
							const y = gy - 30 - Math.sin(t * Math.PI) * (70 + random(`${seed}-fh-${k}`) * 90);
							return <rect key={k} x={x - 4} y={y - 11} width={8} height={22} rx={4} fill="#E9F2E2" opacity={0.9 * Math.sin(t * Math.PI)} transform={`rotate(${t * 540} ${x} ${y})`} />;
						})}
						{[-1.2, 0.4, 2.1].map((x, k) => {
							const [sx, sy] = p(x + conflictX, 0, CZ - 3 + k);
							const h = (F * 1.75) / Math.max(4, CZ - 3 + k - dolly);
							return (
								<g key={k}>
									<Person x={sx} y={sy} h={h} seed={`${seed}-c-${k}`} costume="hood" step={frame / 3 + k} light="#FF5A3A" lightAmount={0.45} rim="#FF8A3D" />
								</g>
							);
						})}
					</g>
				) : null}
				{/* Demonstrierende mit Schildern */}
				{people.map((pp) => {
					const zz = pp.z - dolly;
					if (zz < 2) return null;
					const [sx, sy] = p(pp.x, 0, pp.z);
					const h = (F * 1.75) / zz;
					const isHi = pp.i === highlight;
					const walk = disperse > 0 ? frame / 5 + pp.i : Math.sin((frame + pp.i * 17) / 30) * 0.4;
					const bob = Math.sin((frame + pp.i * 9) / 14) * h * 0.01;
					const signW = h * 0.48;
					const signH = h * 0.28;
					const color = SIGN_COLORS[pp.i % SIGN_COLORS.length];
					const dim = highlight >= 0 && !isHi ? 1 - highlightAmount * 0.45 : 1;
					return (
						<g key={pp.i} opacity={dim}>
							{isHi && highlightAmount > 0 ? (
								<g opacity={highlightAmount}>
									<path d={`M${sx - h * 0.1} ${sy - h * 3.2} L${sx - h * 0.55} ${sy} L${sx + h * 0.55} ${sy} L${sx + h * 0.1} ${sy - h * 3.2} Z`} fill={`url(#${seed}-spot)`} />
									<ellipse cx={sx} cy={sy} rx={h * 0.42} ry={h * 0.1} fill="none" stroke="#FFD23F" strokeWidth={Math.max(2, h * 0.025)} />
								</g>
							) : null}
							<Person x={sx} y={sy + bob} h={h} seed={`${seed}-p-${pp.i}`} costume={(['none', 'scarf', 'hood', 'none'] as const)[pp.i % 4]} step={walk} light="#FFB86B" lightAmount={0.12} rim={isHi ? '#FFD23F' : '#FFD9A0'} dir={pp.x > 0 ? -1 : 1} />
							{pp.sign && disperse < 0.5 ? (
								<g transform={`rotate(${Math.sin((frame + pp.i * 13) / 18) * 4} ${sx + h * 0.16} ${sy - h * 0.8})`}>
									<line x1={sx + h * 0.16} y1={sy - h * 0.62} x2={sx + h * 0.16} y2={sy - h * 1.18} stroke="#6A4A2A" strokeWidth={Math.max(1.5, h * 0.025)} />
									<rect x={sx + h * 0.16 - signW / 2} y={sy - h * 1.18 - signH} width={signW} height={signH} rx={h * 0.02} fill={color} stroke="#1A1A22" strokeWidth={Math.max(1, h * 0.012)} />
									<text x={sx + h * 0.16} y={sy - h * 1.18 - signH * 0.34} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={900} fontSize={signH * 0.42} fill="#14141C">
										{SLOGANS[pp.i % SLOGANS.length]}
									</text>
								</g>
							) : null}
						</g>
					);
				})}
				{/* Beschriftungen */}
				{labels > 0 && riotLabel && conflict > 0 ? <Tag x={gx} y={gy - glowR * 0.12} text={riotLabel} color="#FF4D5E" o={labels * Math.min(1, conflict * 1.5)} dark /> : null}
				{labels > 0 && youLabel && highlight >= 0
					? (() => {
							const pp = people.find((q) => q.i === highlight);
							if (!pp || pp.z - dolly < 2) return null;
							const [sx, sy] = p(pp.x, 0, pp.z);
							const h = (F * 1.75) / (pp.z - dolly);
							return <Tag x={sx} y={sy - h * 1.62} text={youLabel} color="#3DDC97" o={labels} />;
						})()
					: null}
			</svg>
			{conflict > 0 ? <AbsoluteFill style={{background: `radial-gradient(ellipse 60% 25% at 55% 45%, ${withAlpha('#FF5A3A', 0.12 * conflict)} 0%, rgba(0,0,0,0) 70%)`, opacity: interpolate(conflict, [0, 1], [0, 1], clamp)}} /> : null}
		</AbsoluteFill>
	);
};
