import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {withAlpha} from '../../../lib/color';
import {Person} from '../../frankfurt-2026-11-20-ausblick/premium/Person';

/**
 * Stilisierte Abendszene auf einem breiten Boulevard (ILLUSTRATION, kein Nachbau eines realen Ortes): anonyme Figuren,
 * eine Reihe Einsatzkräfte als Polizeikette (Silhouetten mit Schild, keine Gesichter), symbolische Pyrotechnik
 * (Lichtschein, Funken, Rauch). Keine Gewaltdarstellung – Druck auf die Kette nur als abstrakte Pfeile,
 * Auseinandersetzungen nur als pulsierende Markierung.
 */
const F = 900;
const CX = 540;
/** erhöhte Blickposition (≈ 4 m, leichte Aufsicht), damit die Kette hinter der Menge sichtbar bleibt */
const HORIZON = 690;
const EYE = 4.2;
const proj = (dolly: number) => (x: number, y: number, z: number): [number, number] => {
	const zz = Math.max(0.8, z - dolly);
	return [CX + (F * x) / zz, HORIZON - (F * (y - EYE)) / zz];
};

export type IncidentStreetProps = {
	dolly?: number;
	/** 0–1: Polizeikette hervorgehoben (Linie + Beschriftung) */
	line?: number;
	/** 0–1: abstrakte Druck-Pfeile auf die Kette */
	push?: number;
	/** 0–1: Pyrotechnik (Lichtschein, Funken, Rauch) */
	pyro?: number;
	/** 0–1: Markierung „bei Festnahmen“ */
	clash?: number;
	lineLabel?: string;
	clashLabel?: string;
};

const OFFICER_Z = 17.5;
const OFFICER_XS = [-5.4, -4.2, -3, -1.8, -0.6, 0.6, 1.8, 3, 4.2, 5.4];

const Officer: React.FC<{x: number; y: number; h: number; glow: number}> = ({x, y, h, glow}) => {
	const s = h / 100;
	return (
		<g transform={`translate(${x} ${y}) scale(${s})`}>
			<ellipse cx={0} cy={0} rx={20} ry={3.5} fill="#000" opacity={0.4} />
			<path d="M-9 0v-38h18V0z" fill="#141B33" />
			<path d="M-14 -40c0-18 4-26 14-26s14 8 14 26z" fill="#1B2547" />
			<circle cx={0} cy={-76} r={11} fill="#1B2547" />
			<path d="M-11 -78h22" stroke="#4A5A8C" strokeWidth={3} />
			{/* Schild */}
			<rect x={-17} y={-64} width={34} height={52} rx={6} fill={withAlpha('#9FB4E6', 0.22)} stroke={withAlpha('#C9D6FF', 0.55 + 0.3 * glow)} strokeWidth={2.5} />
			<path d="M-10 -40h20" stroke={withAlpha('#C9D6FF', 0.4)} strokeWidth={2} />
		</g>
	);
};

export const IncidentStreet: React.FC<IncidentStreetProps> = ({dolly = 0, line = 0, push = 0, pyro = 0, clash = 0, lineLabel = 'POLIZEIKETTE', clashLabel = 'BEI FESTNAHMEN'}) => {
	const frame = useCurrentFrame();
	const P = proj(dolly);
	const quad = (pts: [number, number, number][]) => pts.map((p) => P(...p).join(',')).join(' ');
	const crowd = React.useMemo(
		() =>
			new Array(34).fill(0).map((_, i) => {
				const row = Math.floor(i / 9);
				return {x: -5.6 + (i % 9) * 1.4 + (random(`ic-x-${i}`) - 0.5) * 0.7, z: 10 + row * 1.25 + random(`ic-z-${i}`) * 0.7, seed: `ic-${i}`, step: random(`ic-s-${i}`) * 6};
			}),
		[],
	);
	const sorted = crowd.slice().sort((a, b) => b.z - a.z);
	const flareAt: [number, number, number] = [-2.2, 2.4, 12.6];
	const [fx, fy] = P(...flareAt);
	const flick = 0.85 + 0.15 * Math.sin(frame * 1.7) * Math.sin(frame * 0.63);
	const [lx0, ly0] = P(-6.2, 0.05, OFFICER_Z - 0.6);
	const [lx1, ly1] = P(6.2, 0.05, OFFICER_Z - 0.6);
	const [, topY] = P(0, 2.4, OFFICER_Z);
	const [lblX] = P(-3.2, 0, OFFICER_Z);
	const [clx, cly] = P(3.4, 1.0, OFFICER_Z - 1.4);
	return (
		<AbsoluteFill>
			<svg width={1080} height={1920} viewBox="0 0 1080 1920">
				<defs>
					<linearGradient id="is-sky" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor="#05071A" />
						<stop offset="0.6" stopColor="#141A44" />
						<stop offset="1" stopColor="#2A2350" />
					</linearGradient>
					<linearGradient id="is-road" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor="#1A1F3E" />
						<stop offset="1" stopColor="#0A0D22" />
					</linearGradient>
					<radialGradient id="is-flare">
						<stop offset="0" stopColor="#FFF4E0" stopOpacity={1} />
						<stop offset="0.12" stopColor="#FF6A4D" stopOpacity={0.9} />
						<stop offset="0.45" stopColor="#FF3B4E" stopOpacity={0.35} />
						<stop offset="1" stopColor="#FF3B4E" stopOpacity={0} />
					</radialGradient>
					<radialGradient id="is-lamp">
						<stop offset="0" stopColor="#FFE2A8" stopOpacity={0.9} />
						<stop offset="1" stopColor="#FFE2A8" stopOpacity={0} />
					</radialGradient>
				</defs>
				<rect x={0} y={0} width={1080} height={HORIZON + 4} fill="url(#is-sky)" />
				<rect x={0} y={HORIZON} width={1080} height={1920 - HORIZON} fill="url(#is-road)" />
				{/* Gehwege + Fahrbahnmarkierung */}
				<polygon points={quad([[-14, 0, 2], [-8, 0, 2], [-8, 0, 90], [-14, 0, 90]])} fill="#232A52" />
				<polygon points={quad([[8, 0, 2], [14, 0, 2], [14, 0, 90], [8, 0, 90]])} fill="#232A52" />
				{new Array(12).fill(0).map((_, i) => (
					<polygon key={i} points={quad([[-0.12, 0.01, 4 + i * 7], [0.12, 0.01, 4 + i * 7], [0.12, 0.01, 7 + i * 7], [-0.12, 0.01, 7 + i * 7]])} fill="#4A527E" opacity={0.6} />
				))}
				{/* Fassaden links/rechts */}
				{[-1, 1].map((side) =>
					new Array(9).fill(0).map((_, i) => {
						const z0 = 6 + i * 9;
						const z1 = z0 + 8.6;
						const h = 14 + random(`is-h-${side}-${i}`) * 9;
						const x = side * 14;
						const tone = 18 + Math.floor(random(`is-t-${side}-${i}`) * 10);
						return (
							<g key={`${side}-${i}`}>
								<polygon points={quad([[x, 0, z0], [x, 0, z1], [x, h, z1], [x, h, z0]])} fill={`rgb(${tone}, ${tone + 6}, ${tone + 34})`} stroke="#2E3870" strokeWidth={1} />
								{new Array(4).fill(0).map((__, r) =>
									new Array(3).fill(0).map((___, c) => {
										const lit = random(`is-w-${side}-${i}-${r}-${c}`) > 0.45;
										const wz0 = z0 + 1 + c * 2.6;
										const wy0 = 3 + r * 3.2;
										return <polygon key={`${r}-${c}`} points={quad([[x, wy0, wz0], [x, wy0, wz0 + 1.4], [x, wy0 + 1.8, wz0 + 1.4], [x, wy0 + 1.8, wz0]])} fill={lit ? '#F6C979' : '#1A2046'} opacity={lit ? 0.75 : 1} />;
									}),
								)}
							</g>
						);
					}),
				)}
				{/* Laternen */}
				{[-1, 1].map((side) =>
					[8, 22, 36, 50].map((z) => {
						const [bx, by] = P(side * 7.6, 0, z);
						const [tx, ty] = P(side * 7.6, 5.2, z);
						const r = 900 / Math.max(1, z - dolly);
						return (
							<g key={`${side}-${z}`}>
								<circle cx={tx} cy={ty} r={r * 1.6} fill="url(#is-lamp)" opacity={0.5} />
								<line x1={bx} y1={by} x2={tx} y2={ty} stroke="#3A4270" strokeWidth={Math.max(1.5, r * 0.08)} />
								<circle cx={tx} cy={ty} r={Math.max(2, r * 0.12)} fill="#FFE9C0" />
							</g>
						);
					}),
				)}
				{/* Polizeikette */}
				{OFFICER_XS.map((x) => {
					const [px, py] = P(x, 0, OFFICER_Z);
					return <Officer key={x} x={px} y={py} h={(F * 1.85) / (OFFICER_Z - dolly)} glow={line} />;
				})}
				{line > 0 ? (
					<g opacity={line}>
						<line x1={lx0} y1={ly0} x2={lx0 + (lx1 - lx0) * Math.min(1, line * 1.2)} y2={ly1} stroke="#FFD23F" strokeWidth={6} strokeDasharray="18 10" strokeLinecap="round" />
						<line x1={lblX} y1={topY - 4} x2={lblX} y2={ly0 - 70} stroke="#FFD23F" strokeWidth={3} />
						<g transform={`translate(${lblX} ${topY - 30})`}>
							<rect x={-130} y={-24} width={260} height={48} rx={14} fill="rgba(8,10,28,0.92)" stroke="#FFD23F" strokeWidth={3} />
							<text x={0} y={10} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={900} fontSize={28} fill="#FFFFFF" letterSpacing={2}>
								{lineLabel}
							</text>
						</g>
					</g>
				) : null}
				{/* abstrakte Druck-Pfeile */}
				{push > 0
					? [-3, 0, 3].map((x, i) => {
							const t = ((frame / 16 + i * 0.33) % 1) * push;
							const [ax, ay] = P(x, 2.6, OFFICER_Z - 4 + t * 2.4);
							const sc = 900 / (OFFICER_Z - 4 + t * 2.4 - dolly) / 26;
							return (
								<g key={x} transform={`translate(${ax} ${ay}) scale(${sc})`} opacity={push * (1 - t * 0.5)}>
									<path d="M-12 10 0 -6 12 10M-12 22 0 6 12 22" fill="none" stroke="#FFD23F" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
								</g>
							);
						})
					: null}
				{/* Menge (Rückenansicht, anonym) */}
				{sorted.map((c) => {
					const [px, py] = P(c.x, 0, c.z);
					return <Person key={c.seed} x={px} y={py} h={(F * 1.72) / (c.z - dolly)} seed={c.seed} step={c.step + frame / 9} light="#FF3B4E" lightAmount={0.28 * pyro} />;
				})}
				{/* Auseinandersetzungen bei Festnahmen – nur Markierung */}
				{clash > 0 ? (
					<g opacity={clash}>
						<circle cx={clx} cy={cly} r={46 + 10 * Math.sin(frame / 4)} fill="none" stroke="#FF4D5E" strokeWidth={5} />
						<circle cx={clx} cy={cly} r={80 + 14 * Math.sin(frame / 4)} fill="none" stroke={withAlpha('#FF4D5E', 0.4)} strokeWidth={3} />
						<g transform={`translate(${clx + 40} ${topY - 30})`}>
							<rect x={-150} y={-24} width={300} height={48} rx={14} fill="rgba(8,10,28,0.92)" stroke="#FF4D5E" strokeWidth={3} />
							<text x={0} y={10} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={900} fontSize={26} fill="#FFFFFF" letterSpacing={1.5}>
								{clashLabel}
							</text>
						</g>
					</g>
				) : null}
				{/* Pyrotechnik – symbolisch */}
				{pyro > 0 ? (
					<g>
						<circle cx={fx} cy={fy} r={420 * pyro * flick} fill="url(#is-flare)" opacity={0.85} />
						{new Array(16).fill(0).map((_, i) => {
							const life = ((frame + i * 7) % 40) / 40;
							const ang = random(`is-sp-a-${i}`) * Math.PI * 2;
							const dist = 30 + life * (60 + random(`is-sp-d-${i}`) * 90);
							return <circle key={i} cx={fx + Math.cos(ang) * dist} cy={fy + Math.sin(ang) * dist * 0.7 - life * 40} r={2.5 * (1 - life) + 1} fill="#FFE0A8" opacity={pyro * (1 - life)} />;
						})}
						{new Array(6).fill(0).map((_, i) => {
							const life = ((frame / 70 + i / 6) % 1) * pyro;
							return <ellipse key={`s${i}`} cx={fx + 30 + i * 18 + life * 120} cy={fy - 40 - life * 300} rx={60 + life * 110} ry={40 + life * 70} fill={withAlpha('#B0A8C8', 0.16 * (1 - life))} />;
						})}
						<circle cx={fx} cy={fy} r={10 * flick} fill="#FFFFFF" opacity={pyro} />
					</g>
				) : null}
			</svg>
			{pyro > 0 ? <AbsoluteFill style={{background: `radial-gradient(ellipse 80% 50% at ${(fx / 1080) * 100}% ${(fy / 1920) * 100}%, rgba(255,59,78,${0.22 * pyro * flick}), rgba(255,59,78,0) 70%)`, mixBlendMode: 'screen'}} /> : null}
		</AbsoluteFill>
	);
};
