import React from 'react';
import {random, useCurrentFrame} from 'remotion';
import {mix, withAlpha} from '../../../lib/color';
import {FONTS} from '../../../theme/tokens';
import {Person} from '../../frankfurt-2026-11-20-ausblick/premium/Person';

/**
 * Illustrationen der Folge „Proteste am 20.11.“ (eigene Vektorzeichnungen, stilisiert, im Bild als ILLUSTRATION gekennzeichnet):
 * Willy-Brandt-Platz mit Euro-Skulptur (Morgen), Bockenheimer Depot (Backsteinhalle mit Rundbogen, Uhr, Abend),
 * anonyme Figuren mit neutralen Schildern, Umhang-Figur (Kostüm ohne Logo) und Polizeifiguren ohne Abzeichen.
 * Keine realen Personen, keine Marken, keine Routen.
 */

/* ------------------------------------------------------------------ Figuren mit neutralen Schildern */

/** Anonyme Figur mit leerem Schild (nur Farbfläche + Striche, kein Text). */
export const SignPerson: React.FC<{x: number; y: number; h: number; seed: string; step: number; sign?: string; light?: string; lightAmount?: number; raise?: number}> = ({x, y, h, seed, step, sign, light, lightAmount = 0, raise = 1}) => {
	const s = h / 100;
	const hasSign = sign !== undefined;
	const lift = Math.sin(step * 0.8) * 3 * raise;
	return (
		<g>
			{hasSign ? (
				<g transform={`translate(${x} ${y}) scale(${s})`}>
					<path d={`M10 -66 L12 ${-128 + lift}`} stroke="#3A2E24" strokeWidth={3.2} strokeLinecap="round" />
					<g transform={`translate(12 ${-150 + lift}) rotate(${Math.sin(step * 0.6) * 4})`}>
						<rect x={-26} y={-20} width={52} height={36} rx={3} fill={sign} stroke={mix(sign!, '#000000', 0.35)} strokeWidth={1.5} />
						<path d="M-17 -8h34M-17 2h22" stroke={mix(sign!, '#000000', 0.45)} strokeWidth={3} strokeLinecap="round" opacity={0.55} />
					</g>
				</g>
			) : null}
			<Person x={x} y={y} h={h} seed={seed} step={step} light={light} lightAmount={lightAmount} />
		</g>
	);
};

/** Polizeifigur (stilisiert, ohne Abzeichen/Kennzeichen, kein Gesicht). Füße bei (x|y), Höhe h. */
export const OfficerFigure: React.FC<{x: number; y: number; h: number; step?: number; dir?: 1 | -1}> = ({x, y, h, step = 0, dir = 1}) => {
	const s = h / 100;
	const swing = Math.sin(step) * 5;
	return (
		<g transform={`translate(${x} ${y}) scale(${s * dir} ${s})`}>
			<ellipse cx={0} cy={0} rx={18} ry={3.4} fill="#000" opacity={0.4} />
			<path d={`M-6 -46 L${-6 - swing * 0.6} -3`} stroke="#141B33" strokeWidth={9} strokeLinecap="round" />
			<path d={`M6 -46 L${6 + swing * 0.6} -3`} stroke="#141B33" strokeWidth={9} strokeLinecap="round" />
			<path d="M-15 -80 Q0 -85 15 -80 L13 -42 Q0 -38 -13 -42 Z" fill="#1E2A55" />
			<path d="M-13 -60h26" stroke="#C9D6FF" strokeWidth={2.2} opacity={0.55} />
			<path d={`M-14 -77 Q-18 -62 ${-15 + swing * 0.6} -50`} stroke="#1E2A55" strokeWidth={7} strokeLinecap="round" fill="none" />
			<path d="M14 -77 Q22 -66 26 -60" stroke="#1E2A55" strokeWidth={7} strokeLinecap="round" fill="none" />
			<circle cx={0} cy={-91} r={8.2} fill="#C99A76" />
			<path d="M-10 -94 Q0 -106 10 -94 Z" fill="#162048" />
			<rect x={-11} y={-95} width={22} height={3.4} rx={1.5} fill="#0E1532" />
		</g>
	);
};

/**
 * Umhang-Figur (Halloween-Kostüm, eigene Gestaltung: dunkler Anzug, langer Umhang, Maske mit kurzen Ohren –
 * KEIN Fledermaus-Logo, keine Film-/Comicvorlage, kein Gesicht). Füße bei (x|y), Höhe h.
 */
export const CapeFigure: React.FC<{x: number; y: number; h: number; step?: number; wind?: number; dir?: 1 | -1; outline?: boolean}> = ({x, y, h, step = 0, wind = 0, dir = 1, outline}) => {
	const s = h / 100;
	const swing = Math.sin(step) * 5;
	const flap = Math.sin(step * 1.3) * 4 + wind * 10;
	const suit = outline ? 'none' : '#2B2F3E';
	const cape = outline ? 'none' : '#171925';
	const st = outline ? {stroke: '#FFFFFF', strokeWidth: 2.4 / s, strokeDasharray: `${6 / s} ${5 / s}`} : {};
	return (
		<g transform={`translate(${x} ${y}) scale(${s * dir} ${s})`}>
			{outline ? null : <ellipse cx={0} cy={0} rx={18} ry={3.4} fill="#000" opacity={0.4} />}
			{/* Umhang */}
			<path d={`M-13 -82 Q${-30 - flap} -40 ${-34 - flap * 1.6} -4 L${-8 - flap * 0.4} -10 L0 -6 L${10 - flap * 0.2} -10 L${24 - flap * 0.6} -4 Q${20 - flap * 0.3} -40 13 -82 Z`} fill={cape} {...st} />
			{/* Beine, Körper, Arme */}
			<path d={`M-6 -46 L${-6 - swing * 0.6} -3`} stroke={outline ? '#FFFFFF' : suit} strokeWidth={outline ? 0 : 8.5} strokeLinecap="round" />
			<path d={`M6 -46 L${6 + swing * 0.6} -3`} stroke={outline ? '#FFFFFF' : suit} strokeWidth={outline ? 0 : 8.5} strokeLinecap="round" />
			<path d="M-14 -80 Q0 -84 14 -80 L12 -42 Q0 -38 -12 -42 Z" fill={suit} {...st} />
			{outline ? null : <path d="M-12 -47h24" stroke="#5A5F74" strokeWidth={3.2} />}
			{outline ? null : <path d={`M-13 -77 Q-17 -62 ${-15 + swing * 0.7} -50`} stroke={suit} strokeWidth={6.5} strokeLinecap="round" fill="none" />}
			{outline ? null : <path d={`M13 -77 Q17 -62 ${15 - swing * 0.7} -50`} stroke={suit} strokeWidth={6.5} strokeLinecap="round" fill="none" />}
			{/* Kopf mit Maske und kurzen Ohren */}
			<path d="M-8.6 -88 Q-9 -100 -6.5 -101 L-5.5 -107 L-2.6 -101 H2.6 L5.5 -107 L6.5 -101 Q9 -100 8.6 -88 Q8 -82 0 -81.5 Q-8 -82 -8.6 -88 Z" fill={outline ? 'none' : '#1F2230'} {...st} />
			{outline ? null : <path d="M-5.5 -91.5h4M1.5 -91.5h4" stroke="#E8ECF8" strokeWidth={1.6} strokeLinecap="round" opacity={0.75} />}
		</g>
	);
};

/* ------------------------------------------------------------------ Willy-Brandt-Platz (Morgen) */

const towerWindows = (x: number, y: number, w: number, h: number, seed: string, lit: number, cols = 6, rows = 18) =>
	new Array(cols * rows).fill(0).map((_, i) => {
		const c = i % cols;
		const r = Math.floor(i / cols);
		const on = random(`${seed}-${i}`) < lit;
		const ww = (w - 16) / cols;
		const wh = (h - 20) / rows;
		return <rect key={i} x={x + 8 + c * ww + 2} y={y + 10 + r * wh + 2} width={ww - 5} height={wh - 6} fill={on ? '#FFE3A0' : '#2A3866'} opacity={on ? 0.85 : 0.6} />;
	});

/**
 * Willy-Brandt-Platz am Morgen (Illustration): Hochhaus-Silhouetten, Glasfassade des Theaters, Bäume, die Euro-Skulptur
 * (stilisiertes €-Zeichen mit Sternenkranz) und Jugendliche mit neutralen Schildern. `cam` 0–1 treibt Kamerafahrt und Parallaxe,
 * `crowd` 0–1 blendet die Gruppe ein. Vollbild 1080 × 1920.
 */
export const WillyBrandtPlatz: React.FC<{cam: number; crowd: number; morning?: number}> = ({cam, crowd, morning = 0.5}) => {
	const frame = useCurrentFrame();
	const sky0 = mix('#070C2A', '#0F1E52', morning);
	const sky1 = mix('#16245A', '#2E5296', morning);
	const sky2 = mix('#3A4A86', '#8FB0DA', morning);
	const far = -cam * 30;
	const mid = -cam * 70;
	const near = -cam * 130;
	const people = React.useMemo(
		() =>
			new Array(26).fill(0).map((_, i) => {
				const row = Math.floor(i / 9);
				const depth = row / 2;
				return {
					x: 40 + (i % 9) * 74 + (row % 2) * 37 + (random(`wbp-x-${i}`) - 0.5) * 24,
					y: 1236 + row * 46 + random(`wbp-y-${i}`) * 12,
					h: 84 + depth * 24,
					seed: `wbp-${i}`,
					sign: random(`wbp-s-${i}`) < 0.55 ? ['#F2EDE2', '#9FD8F5', '#FFE08A', '#F5B8C4', '#C9F2DA'][i % 5] : undefined,
					on: i / 26,
				};
			}),
		[],
	);
	return (
		<svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
			<defs>
				<linearGradient id="wbp-sky" x1={0} x2={0} y1={0} y2={1}>
					<stop offset={0} stopColor={sky0} />
					<stop offset={0.42} stopColor={sky1} />
					<stop offset={0.58} stopColor={sky2} />
					<stop offset={1} stopColor={sky2} />
				</linearGradient>
				<linearGradient id="wbp-ground" x1={0} x2={0} y1={0} y2={1}>
					<stop offset={0} stopColor="#3E4A74" />
					<stop offset={1} stopColor="#151B36" />
				</linearGradient>
				<linearGradient id="wbp-euro" x1={0} x2={1} y1={0} y2={1}>
					<stop offset={0} stopColor="#5AA8FF" />
					<stop offset={0.55} stopColor="#2563D8" />
					<stop offset={1} stopColor="#163C96" />
				</linearGradient>
				<linearGradient id="wbp-glass" x1={0} x2={0} y1={0} y2={1}>
					<stop offset={0} stopColor="#9CC6EE" stopOpacity={0.5} />
					<stop offset={1} stopColor="#2A4A86" stopOpacity={0.8} />
				</linearGradient>
			</defs>
			<rect width={1080} height={1920} fill="url(#wbp-sky)" />
			{/* Morgenlicht am Horizont */}
			<ellipse cx={760} cy={1040} rx={700} ry={220} fill={withAlpha('#FFD9A0', 0.18 + morning * 0.12)} />
			{/* ferne Hochhäuser */}
			<g transform={`translate(${far} 0)`} opacity={0.75}>
				{[
					[20, 700, 90, 340],
					[420, 640, 70, 400],
					[880, 690, 110, 350],
					[990, 760, 80, 280],
				].map(([x, y, w, hh], i) => (
					<rect key={i} x={x} y={y} width={w} height={hh} fill="#1C2A5C" />
				))}
			</g>
			{/* Hochhaus links (stilisiert, ohne Logo) */}
			<g transform={`translate(${mid} 0)`}>
				<rect x={120} y={430} width={210} height={620} fill="#18244E" />
				<rect x={120} y={430} width={14} height={620} fill="#22336A" />
				{towerWindows(120, 430, 210, 620, 'wbp-t1', 0.32, 7, 22)}
				<rect x={160} y={400} width={130} height={34} fill="#141E44" />
				<rect x={690} y={560} width={150} height={490} fill="#1A2858" />
				{towerWindows(690, 560, 150, 490, 'wbp-t2', 0.28, 5, 17)}
			</g>
			{/* Theater-Glasfassade */}
			<g transform={`translate(${mid * 1.2} 0)`}>
				<rect x={480} y={850} width={700} height={210} fill="url(#wbp-glass)" />
				{new Array(5).fill(0).map((_, i) => (
					<rect key={i} x={480} y={866 + i * 40} width={700} height={4} fill="#DCE9FF" opacity={0.35} />
				))}
				{new Array(14).fill(0).map((_, i) => (
					<rect key={i} x={480 + i * 50} y={850} width={2.5} height={210} fill="#DCE9FF" opacity={0.25} />
				))}
				<rect x={480} y={846} width={700} height={8} fill="#0F1838" />
			</g>
			{/* Boden: Platz mit Pflasterfugen in Fluchtperspektive */}
			<rect x={0} y={1050} width={1080} height={870} fill="url(#wbp-ground)" />
			<g opacity={0.25} transform={`translate(${near * 0.6} 0)`}>
				{new Array(19).fill(0).map((_, i) => (
					<line key={i} x1={540 + (i - 9) * 30} y1={1050} x2={540 + (i - 9) * 260} y2={1920} stroke="#AFC2F0" strokeWidth={1.4} />
				))}
				{[1090, 1150, 1230, 1340, 1490, 1700].map((yy) => (
					<line key={yy} x1={-200} y1={yy} x2={1300} y2={yy} stroke="#AFC2F0" strokeWidth={1.2} />
				))}
			</g>
			{/* Bäume */}
			<g transform={`translate(${mid * 1.4} 0)`}>
				{[60, 380, 960].map((x, i) => (
					<g key={x}>
						<rect x={x - 6} y={980} width={12} height={90} fill="#2A2030" />
						<circle cx={x} cy={950 + Math.sin(frame / 40 + i) * 2} r={62} fill="#1E4A44" />
						<circle cx={x - 26} cy={970} r={40} fill="#265A50" />
						<circle cx={x + 28} cy={975} r={36} fill="#1A3E3A" />
					</g>
				))}
			</g>
			{/* Euro-Skulptur: €-Zeichen auf Sockel, Sternenkranz */}
			<g transform={`translate(${near * 0.8 + 790} 0)`}>
				<ellipse cx={0} cy={1112} rx={210} ry={150} fill={withAlpha('#5AA8FF', 0.12)} />
				<rect x={-64} y={1196} width={128} height={30} rx={4} fill="#2A3150" />
				<rect x={-80} y={1222} width={160} height={16} rx={4} fill="#20263F" />
				<text x={0} y={1196} textAnchor="middle" fontFamily={FONTS.heading} fontWeight={900} fontSize={270} fill="url(#wbp-euro)" stroke="#0E2A6E" strokeWidth={3}>
					€
				</text>
				{new Array(12).fill(0).map((_, i) => {
					const a = Math.PI * (0.92 + (i / 11) * 1.16);
					const sx = Math.cos(a) * 158;
					const sy = 1046 + Math.sin(a) * 140;
					const tw = 0.75 + 0.25 * Math.sin(frame / 8 + i);
					return (
						<path
							key={i}
							transform={`translate(${sx} ${sy}) scale(${1.25 * tw})`}
							d="M0 -12 L3.5 -3.8 L12.4 -3.8 L5.2 1.6 L7.8 10.4 L0 5.2 L-7.8 10.4 L-5.2 1.6 L-12.4 -3.8 L-3.5 -3.8 Z"
							fill="#FFD23F"
						/>
					);
				})}
			</g>
			{/* Jugendliche mit neutralen Schildern (anonym, Rückenansicht) */}
			<g transform={`translate(${near} 0)`}>
				{people.map((p, i) => {
					const o = Math.max(0, Math.min(1, (crowd - p.on * 0.6) / 0.4));
					if (o <= 0) return null;
					return (
						<g key={i} opacity={o} transform={`translate(0 ${(1 - o) * 20})`}>
							<SignPerson x={p.x} y={p.y} h={p.h} seed={p.seed} step={frame / 9 + i} sign={p.sign} light="#9FC2FF" lightAmount={0.12} />
						</g>
					);
				})}
			</g>
		</svg>
	);
};

/* ------------------------------------------------------------------ Bockenheimer Depot (Abend) */

/**
 * Bockenheimer Depot am Abend (Illustration, nicht die Bockenheimer Warte): Backsteinhalle mit Giebel, großem Rundbogenfenster,
 * kleineren Rundbogenfenstern, Uhr (zeigt 17:30) und warmem Licht; davor ein Banner ohne Text und wenige anonyme Figuren.
 * `cam` 0–1 Kamerafahrt, `crowd` 0–1, `lights` 0–1 (Fenster gehen an). Vollbild 1080 × 1920.
 */
export const BockenheimerDepot: React.FC<{cam: number; crowd: number; lights: number}> = ({cam, crowd, lights}) => {
	const frame = useCurrentFrame();
	const sc = 1 + cam * 0.08;
	const warm = '#FFC870';
	const glass = (o: number) => withAlpha(mix('#3A3050', warm, lights), 0.55 + 0.4 * lights * o);
	const arch = (x: number, y: number, w: number, h: number, key: string, bars = 3) => (
		<g key={key}>
			<path d={`M${x} ${y + h} V${y + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2} V${y + h} Z`} fill={glass(1)} stroke="#E8D2B0" strokeWidth={5} />
			{new Array(bars).fill(0).map((_, i) => (
				<line key={i} x1={x + ((i + 1) * w) / (bars + 1)} y1={y + 6} x2={x + ((i + 1) * w) / (bars + 1)} y2={y + h} stroke="#5A3A2A" strokeWidth={3} />
			))}
			<line x1={x} y1={y + w / 2 + (h - w / 2) * 0.45} x2={x + w} y2={y + w / 2 + (h - w / 2) * 0.45} stroke="#5A3A2A" strokeWidth={3} />
		</g>
	);
	const people = React.useMemo(
		() =>
			new Array(16).fill(0).map((_, i) => ({
				x: 120 + (i % 8) * 112 + (Math.floor(i / 8) % 2) * 56 + (random(`bd-x-${i}`) - 0.5) * 24,
				y: 1330 + Math.floor(i / 8) * 64,
				h: 120 + Math.floor(i / 8) * 26,
				seed: `bd-${i}`,
			})),
		[],
	);
	return (
		<svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
			<defs>
				<linearGradient id="bd-sky" x1={0} x2={0} y1={0} y2={1}>
					<stop offset={0} stopColor="#05081E" />
					<stop offset={0.45} stopColor="#141A46" />
					<stop offset={0.62} stopColor="#3A2A5A" />
					<stop offset={1} stopColor="#2A1E40" />
				</linearGradient>
				<pattern id="bd-brick" width={44} height={22} patternUnits="userSpaceOnUse">
					<rect width={44} height={22} fill="#8E3E2C" />
					<path d="M0 0.75H44M0 11.75H44M11 0V11M33 11V22" stroke="#5E2618" strokeWidth={1.6} />
					<rect x={2} y={3} width={18} height={7} fill="#9C4A34" opacity={0.5} />
					<rect x={24} y={14} width={16} height={6} fill="#7A3324" opacity={0.5} />
				</pattern>
				<radialGradient id="bd-lamp">
					<stop offset={0} stopColor="#FFD9A0" stopOpacity={0.6} />
					<stop offset={1} stopColor="#FFD9A0" stopOpacity={0} />
				</radialGradient>
			</defs>
			<rect width={1080} height={1920} fill="url(#bd-sky)" />
			<g transform={`translate(540 1180) scale(${sc}) translate(-540 -1180) translate(${-cam * 26} 0)`}>
				{/* Bäume dahinter */}
				{[70, 1010].map((x) => (
					<circle key={x} cx={x} cy={900} r={110} fill="#141E3A" />
				))}
				{/* Halle: Seitenflügel + Mittelgiebel */}
				<rect x={90} y={820} width={900} height={400} fill="url(#bd-brick)" />
				<path d="M250 820 L540 560 L830 820 Z" fill="url(#bd-brick)" />
				<path d="M240 826 L540 552 L840 826" fill="none" stroke="#E8D2B0" strokeWidth={10} strokeLinejoin="round" />
				<rect x={84} y={812} width={912} height={16} fill="#C9B08C" />
				<rect x={84} y={1212} width={912} height={14} fill="#6A2A1C" />
				{/* Lisenen */}
				{[250, 830].map((x) => (
					<rect key={x} x={x - 12} y={820} width={24} height={400} fill="#7A3324" />
				))}
				{/* großes Rundbogenfenster */}
				{arch(390, 790, 300, 420, 'big', 4)}
				{/* kleinere Rundbogenfenster */}
				{arch(118, 900, 100, 200, 's1', 1)}
				{arch(282, 900, 80, 200, 's2', 1)}
				{arch(718, 900, 80, 200, 's3', 1)}
				{arch(862, 900, 100, 200, 's4', 1)}
				{/* Uhr im Giebel: zeigt 17:30 */}
				<g transform="translate(540 700)">
					<circle r={44} fill="#F4EEDD" stroke="#E8D2B0" strokeWidth={7} />
					{new Array(12).fill(0).map((_, i) => (
						<line key={i} x1={Math.sin((i * Math.PI) / 6) * 33} y1={-Math.cos((i * Math.PI) / 6) * 33} x2={Math.sin((i * Math.PI) / 6) * 38} y2={-Math.cos((i * Math.PI) / 6) * 38} stroke="#2A2030" strokeWidth={3} />
					))}
					<line x1={0} y1={0} x2={Math.sin((5.5 * Math.PI) / 6) * 20} y2={-Math.cos((5.5 * Math.PI) / 6) * 20} stroke="#1A1420" strokeWidth={5} strokeLinecap="round" />
					<line x1={0} y1={0} x2={0} y2={32} stroke="#1A1420" strokeWidth={3.5} strokeLinecap="round" />
					<circle r={4} fill="#1A1420" />
				</g>
				{/* warmer Lichtschein vor der Halle */}
				<ellipse cx={540} cy={1240} rx={420} ry={60} fill={withAlpha(warm, 0.22 * lights)} />
			</g>
			{/* Straße */}
			<rect x={0} y={1226} width={1080} height={694} fill="#121730" />
			<rect x={0} y={1226} width={1080} height={6} fill="#2A3058" />
			{[0, 1, 2, 3].map((i) => (
				<rect key={i} x={140 + i * 240 - cam * 40} y={1560} width={120} height={8} fill="#3A4270" opacity={0.6} />
			))}
			{/* Laternen */}
			{[60, 1020].map((x, i) => (
				<g key={x}>
					<rect x={x - 4} y={1000} width={8} height={330} fill="#232A4A" />
					<circle cx={x} cy={996} r={14} fill="#FFE2B0" />
					<circle cx={x} cy={1000} r={140 + Math.sin(frame / 20 + i) * 6} fill="url(#bd-lamp)" />
				</g>
			))}
			{/* anonyme Figuren + Banner ohne Text */}
			<g opacity={crowd}>
				<g transform={`translate(${-cam * 40} 0)`}>
					{people.map((p, i) => (
						<Person key={i} x={p.x} y={p.y} h={p.h} seed={p.seed} step={frame / 10 + i} light={warm} lightAmount={0.18} />
					))}
					<g transform={`translate(0 ${Math.sin(frame / 14) * 2})`}>
						<path d="M300 1290 V1200 M780 1290 V1200" stroke="#3A2E24" strokeWidth={6} />
						<path d={`M300 1204 Q540 ${1194 + Math.sin(frame / 10) * 6} 780 1204 V1262 Q540 ${1252 + Math.sin(frame / 10 + 1) * 6} 300 1262 Z`} fill="#FFD23F" />
						<path d="M330 1222 H750 M330 1244 H660" stroke="#B88A10" strokeWidth={6} strokeLinecap="round" opacity={0.55} />
					</g>
				</g>
			</g>
		</svg>
	);
};
