import React, {useMemo} from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {mix} from '../../../lib/color';
import {useSvgId} from '../../../lib/svg';
import {Person} from '../../frankfurt-2026-11-20-ausblick/premium/Person';

/**
 * Frankfurter Zeil bei Nacht als echte Zentralperspektive (2,5D): Fassaden links/rechts mit Fensterraster und
 * beleuchteten Schaufenstern, eine verglaste Einkaufszentrum-Fassade mit Glas-Trichter (angelehnt an die
 * Architektur der Zeil, ohne Namen/Logos), Platanen, Laternen, Pflasterraster, Hochhaus-Silhouetten am Ende der
 * Straße, Passanten und Einsatzfahrzeuge (Rückansicht). Kamera über `dolly` (Meter vorwärts) und `pan` (seitlich).
 * Eigene Illustration – keine reale Fassade 1:1, keine Marken.
 */

const W = 1080;
const F = 860; // Brennweite in px
const CX = 540;
const HORIZON = 880;
const EYE = 1.65; // Augenhöhe in m
const HALF = 12; // halbe Straßenbreite bis Fassade (m)

type Vec = [number, number];

const makeProject = (dolly: number, pan: number) => (x: number, y: number, z: number): Vec => {
	const zz = Math.max(0.6, z - dolly);
	return [CX + (F * (x - pan)) / zz, HORIZON - (F * (y - EYE)) / zz];
};

const pts = (p: Vec[]) => p.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

type Building = {side: -1 | 1; z0: number; z1: number; h: number; style: 'stone' | 'glass' | 'mall' | 'modern'; tint: string; seed: string};

const buildStreet = (): Building[] => {
	const out: Building[] = [];
	for (const side of [-1, 1] as const) {
		let z = 3;
		let i = 0;
		while (z < 170) {
			const len = 11 + random(`len-${side}-${i}`) * 9;
			const isMall = side === 1 && z > 22 && z < 40 && !out.some((b) => b.style === 'mall');
			const style: Building['style'] = isMall ? 'mall' : (['stone', 'glass', 'modern', 'stone'] as const)[Math.floor(random(`st-${side}-${i}`) * 4)];
			const h = isMall ? 30 : 15 + random(`h-${side}-${i}`) * 12;
			const tint = ['#3A4172', '#45406E', '#334C72', '#4A3C64', '#3A4668'][Math.floor(random(`t-${side}-${i}`) * 5)];
			out.push({side, z0: z, z1: z + (isMall ? 26 : len), h, style, tint, seed: `b-${side}-${i}`});
			z += isMall ? 26 : len;
			i++;
		}
	}
	return out;
};

const Facade: React.FC<{b: Building; project: ReturnType<typeof makeProject>; dolly: number; glow: number; id: string}> = ({b, project, dolly, glow, id}) => {
	const frame = useCurrentFrame();
	const x = b.side * HALF;
	const z0 = Math.max(b.z0, dolly + 0.8);
	if (b.z1 <= dolly + 0.8) return null;
	const quad = [project(x, 0, z0), project(x, b.h, z0), project(x, b.h, b.z1), project(x, 0, b.z1)];
	const depthFade = Math.min(1, 26 / Math.max(8, b.z0 - dolly));
	const wall = mix(b.tint, '#0E1024', (1 - depthFade) * 0.7);
	const items: React.ReactNode[] = [];
	// Erdgeschoss: Schaufensterband
	const shopTop = 4.2;
	const segs = Math.max(1, Math.round((b.z1 - b.z0) / 4.5));
	for (let k = 0; k < segs; k++) {
		const za = b.z0 + ((b.z1 - b.z0) * k) / segs + 0.35;
		const zb = b.z0 + ((b.z1 - b.z0) * (k + 1)) / segs - 0.35;
		if (zb <= dolly + 0.8) continue;
		const zA = Math.max(za, dolly + 0.8);
		const warm = random(`${b.seed}-shop-${k}`);
		const fill = warm > 0.25 ? (warm > 0.6 ? '#FFE2B0' : '#CFE6FF') : '#2A2E46';
		items.push(<polygon key={`s-${k}`} points={pts([project(x, 0.25, zA), project(x, shopTop - 0.4, zA), project(x, shopTop - 0.4, zb), project(x, 0.25, zb)])} fill={fill} opacity={(warm > 0.25 ? 0.82 : 1) * (0.55 + 0.45 * depthFade)} />);
	}

	items.push(<polygon key="band" points={pts([project(x, shopTop - 0.4, z0), project(x, shopTop + 0.3, z0), project(x, shopTop + 0.3, b.z1), project(x, shopTop - 0.4, b.z1)])} fill="#0B0D1E" opacity={0.85} />);

	if (b.style === 'mall') {
		// Glasfassade mit Raster + Trichter
		const rows = 8;
		const cols = 9;
		for (let r = 0; r <= rows; r++) {
			const y = shopTop + 0.3 + ((b.h - shopTop - 0.3) * r) / rows;
			const [a1, a2] = [project(x, y, z0), project(x, y, b.z1)];
			items.push(<line key={`gr-${r}`} x1={a1[0]} y1={a1[1]} x2={a2[0]} y2={a2[1]} stroke="#7FD6FF" strokeWidth={1.2} opacity={0.45} />);
		}

		for (let c = 0; c <= cols; c++) {
			const z = b.z0 + ((b.z1 - b.z0) * c) / cols;
			if (z <= dolly + 0.8) continue;
			const [a1, a2] = [project(x, shopTop + 0.3, z), project(x, b.h, z)];
			items.push(<line key={`gc-${c}`} x1={a1[0]} y1={a1[1]} x2={a2[0]} y2={a2[1]} stroke="#7FD6FF" strokeWidth={1.2} opacity={0.4} />);
		}

		const zc = (b.z0 + b.z1) / 2;
		if (zc > dolly + 2) {
			const [cxp, cyp] = project(x, b.h * 0.62, zc);
			const rx = (F * 6.5) / (zc - dolly) * 0.42;
			const ry = (F * 6.5) / (zc - dolly);
			items.push(
				<g key="funnel">
					<ellipse cx={cxp} cy={cyp} rx={rx} ry={ry} fill={`url(#${id}-funnel)`} />
					{new Array(10).fill(true).map((_, k) => {
						const a = (k / 10) * Math.PI * 2 + frame / 90;
						return <path key={k} d={`M${cxp + Math.cos(a) * rx} ${cyp + Math.sin(a) * ry} Q${cxp + Math.cos(a + 0.9) * rx * 0.5} ${cyp + Math.sin(a + 0.9) * ry * 0.5} ${cxp} ${cyp}`} stroke="#9FE3FF" strokeWidth={1.4} fill="none" opacity={0.5} />;
					})}
				</g>,
			);
		}
	} else {
		const floorH = 3.5;
		const floors = Math.floor((b.h - shopTop - 1) / floorH);
		const colW = b.style === 'glass' ? 2.0 : 2.6;
		const cols = Math.floor((b.z1 - b.z0) / colW);
		for (let r = 0; r < floors; r++) {
			const y0 = shopTop + 1 + r * floorH;
			const y1 = y0 + (b.style === 'glass' ? floorH * 0.82 : floorH * 0.58);
			for (let c = 0; c < cols; c++) {
				const za = b.z0 + c * colW + (b.style === 'glass' ? 0.1 : 0.55);
				const zb = za + colW - (b.style === 'glass' ? 0.2 : 1.1);
				if (zb <= dolly + 0.8) continue;
				const lit = random(`${b.seed}-w-${r}-${c}`);
				const on = lit > (b.style === 'glass' ? 0.55 : 0.45);
				const flick = on && random(`${b.seed}-f-${r}-${c}`) > 0.93 ? 0.7 + Math.sin(frame / 7 + c) * 0.3 : 1;
				const color = on ? (lit > 0.85 ? '#FFD9A0' : b.style === 'glass' ? '#9CC8FF' : '#FFC67A') : b.style === 'glass' ? '#1E2A4A' : '#151A30';
				items.push(<polygon key={`w-${r}-${c}`} points={pts([project(x, y0, Math.max(za, dolly + 0.8)), project(x, y1, Math.max(za, dolly + 0.8)), project(x, y1, zb), project(x, y0, zb)])} fill={color} opacity={(on ? 0.85 * flick : 0.9) * (0.5 + 0.5 * depthFade)} />);
			}
		}
	}

	// Gesims
	items.push(<polygon key="corn" points={pts([project(x, b.h, z0), project(x, b.h + 0.6, z0), project(x, b.h + 0.6, b.z1), project(x, b.h, b.z1)])} fill={mix(wall, '#FFFFFF', 0.12)} />);
	return (
		<g>
			<polygon points={pts(quad)} fill={wall} />
			{items}
			<polygon points={pts(quad)} fill={b.side < 0 ? 'url(#zeil-shade-l)' : 'url(#zeil-shade-r)'} opacity={0.5} />
			{glow > 0 ? <polygon points={pts([project(x, 0, z0), project(x, 4, z0), project(x, 4, b.z1), project(x, 0, b.z1)])} fill="#FFB86B" opacity={0.08 * glow} /> : null}
		</g>
	);
};

/** Einsatzfahrzeug von hinten (Gattungswort, kein Wappen/Kennzeichen). */
const VanRear: React.FC<{cx: number; base: number; s: number; phase: number}> = ({cx, base, s, phase}) => {
	const frame = useCurrentFrame();
	const blink = Math.floor((frame + phase) / 6) % 2 === 0;
	const w = 2.1 * s;
	const h = 2.6 * s;
	return (
		<g>
			<ellipse cx={cx} cy={base} rx={w * 0.62} ry={w * 0.08} fill="#000000" opacity={0.45} />
			<ellipse cx={cx - w * 0.25} cy={base - h - w * 0.06} rx={w * 0.6} ry={w * 0.25} fill={blink ? '#3D7BFF' : '#7FB0FF'} opacity={0.28} />
			<rect x={cx - w / 2} y={base - h} width={w} height={h * 0.94} rx={w * 0.06} fill="#E7EBF6" />
			<rect x={cx - w / 2} y={base - h * 0.52} width={w} height={h * 0.14} fill="#2F64D6" />
			<text x={cx} y={base - h * 0.415} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={900} fontSize={h * 0.085} letterSpacing={h * 0.012} fill="#FFFFFF">
				POLIZEI
			</text>
			<rect x={cx - w * 0.42} y={base - h * 0.9} width={w * 0.38} height={h * 0.3} rx={w * 0.03} fill="#22305A" />
			<rect x={cx + w * 0.04} y={base - h * 0.9} width={w * 0.38} height={h * 0.3} rx={w * 0.03} fill="#22305A" />
			<rect x={cx - w * 0.5} y={base - h * 0.3} width={w * 0.1} height={h * 0.12} fill="#E0303E" />
			<rect x={cx + w * 0.4} y={base - h * 0.3} width={w * 0.1} height={h * 0.12} fill="#E0303E" />
			<rect x={cx - w * 0.3} y={base - h - w * 0.07} width={w * 0.6} height={w * 0.08} rx={w * 0.03} fill="#1B2342" />
			<rect x={cx - w * 0.28} y={base - h - w * 0.06} width={w * 0.26} height={w * 0.06} fill={blink ? '#5A95FF' : '#1E3A8A'} />
			<rect x={cx + w * 0.02} y={base - h - w * 0.06} width={w * 0.26} height={w * 0.06} fill={blink ? '#1E3A8A' : '#5A95FF'} />
			<rect x={cx - w * 0.47} y={base - h * 0.06} width={w * 0.2} height={h * 0.08} rx={w * 0.03} fill="#14161F" />
			<rect x={cx + w * 0.27} y={base - h * 0.06} width={w * 0.2} height={h * 0.08} rx={w * 0.03} fill="#14161F" />
		</g>
	);
};

/** Kleine stilisierte Einsatzkraft (Uniform dunkelblau, Mütze) – anonym. */
export const MiniOfficer: React.FC<{x: number; y: number; h: number; dir?: 1 | -1; step?: number}> = ({x, y, h, dir = 1, step = 0}) => {
	const s = h / 100;
	const sw = Math.sin(step) * 4;
	return (
		<g transform={`translate(${x} ${y}) scale(${s * dir} ${s})`}>
			<ellipse cx={0} cy={0} rx={17} ry={3.2} fill="#000" opacity={0.35} />
			<path d={`M-6 -46 L${-6 - sw * 0.5} -3 M6 -46 L${6 + sw * 0.5} -3`} stroke="#141C33" strokeWidth={8.5} strokeLinecap="round" />
			<path d="M-15 -80 Q0 -85 15 -80 L13 -42 Q0 -38 -13 -42 Z" fill="#1F2E57" />
			<rect x={-13} y={-62} width={26} height={8} fill="#C9D3EA" opacity={0.85} />
			<path d="M-14 -77 Q-18 -62 -16 -50 M14 -77 Q18 -62 16 -50" stroke="#1F2E57" strokeWidth={7} strokeLinecap="round" fill="none" />
			<rect x={-14} y={-46} width={28} height={4} fill="#0E1222" />
			<circle cx={0} cy={-91} r={8} fill="#D9B08C" />
			<path d="M-9.5 -94 Q0 -103 9.5 -94 L10 -91 L-10 -91 Z" fill="#1A2546" />
			<rect x={-11} y={-92.5} width={22} height={3} rx={1} fill="#0E1430" />
		</g>
	);
};

export type ZeilStreetProps = {
	dolly?: number;
	pan?: number;
	people?: number;
	officers?: number;
	vans?: boolean;
	warm?: number;
	blueLight?: number;
	seed?: string;
};

export const ZeilStreet: React.FC<ZeilStreetProps> = ({dolly = 0, pan = 0, people = 14, officers = 4, vans = true, warm = 0.6, blueLight = 0.25, seed = 'zeil'}) => {
	const frame = useCurrentFrame();
	const id = useSvgId('zeil');
	const buildings = useMemo(buildStreet, []);
	const project = makeProject(dolly, pan);
	const visible = buildings.filter((b) => b.z1 > dolly + 0.8).sort((a, b) => b.z0 - a.z0);
	const trees = [-1, 1].flatMap((side) => new Array(12).fill(true).map((_, k) => ({side, z: 6 + k * 12 + (side > 0 ? 6 : 0)})));
	const lamps = [-1, 1].flatMap((side) => new Array(9).fill(true).map((_, k) => ({side, z: 10 + k * 17 + (side > 0 ? 8 : 0)})));
	const crowd = new Array(people).fill(true).map((_, i) => {
		const z = 9 + random(`${seed}-pz-${i}`) * 55;
		const x = (random(`${seed}-px-${i}`) - 0.5) * 16;
		return {i, z, x};
	});
	const cops = new Array(officers).fill(true).map((_, i) => ({i, z: 16 + i * 2.2 + random(`${seed}-oz-${i}`) * 3, x: -4.5 + (i % 2) * 1.4 + random(`${seed}-ox-${i}`)}));
	const swayBlue = (Math.sin(frame / 4) + 1) / 2;

	// Ebenen von hinten nach vorne: Himmel, Türme, Fassaden, Boden, Bäume/Laternen/Personen nach Tiefe sortiert
	type Item = {z: number; node: React.ReactNode};
	const depthItems: Item[] = [];
	for (const t of trees) {
		const zz = t.z - dolly;
		if (zz < 1.2) continue;
		const [bx, by] = project(t.side * 8.4, 0, t.z);
		const [, ty] = project(t.side * 8.4, 4.2, t.z);
		const r = (F * 3.4) / zz;
		const [cxp, cyp] = project(t.side * 8.4, 6.2, t.z);
		depthItems.push({
			z: t.z,
			node: (
				<g key={`tree-${t.side}-${t.z}`} opacity={Math.min(1, 40 / zz) * Math.min(1, Math.max(0, (zz - 5) / 7))}>
					<line x1={bx} y1={by} x2={bx} y2={ty} stroke="#1B1712" strokeWidth={Math.max(1.5, (F * 0.35) / zz)} />
					<ellipse cx={cxp} cy={cyp} rx={r} ry={r * 0.82} fill={`url(#${id}-canopy)`} />
					<ellipse cx={cxp - r * 0.3} cy={cyp - r * 0.25} rx={r * 0.55} ry={r * 0.4} fill="#3E6A4A" opacity={0.35} />
				</g>
			),
		});
	}

	for (const l of lamps) {
		const zz = l.z - dolly;
		if (zz < 1.2) continue;
		const [bx, by] = project(l.side * 10, 0, l.z);
		const [tx, ty] = project(l.side * 10, 6, l.z);
		const r = (F * 2.4) / zz;
		depthItems.push({
			z: l.z - 0.1,
			node: (
				<g key={`lamp-${l.side}-${l.z}`}>
					<circle cx={tx} cy={ty} r={r * 1.6} fill={`url(#${id}-lamp)`} />
					<line x1={bx} y1={by} x2={tx} y2={ty} stroke="#0A0B14" strokeWidth={Math.max(1, (F * 0.14) / zz)} />
					<circle cx={tx} cy={ty} r={Math.max(1.5, (F * 0.22) / zz)} fill="#FFE7B8" />
				</g>
			),
		});
	}

	for (const p of crowd) {
		const zz = p.z - dolly;
		if (zz < 2) continue;
		const [px, py] = project(p.x, 0, p.z);
		const h = (F * 1.75) / zz;
		const walk = (frame + p.i * 13) / 7;
		depthItems.push({
			z: p.z,
			node: (
				<g key={`p-${p.i}`}>
					<Person x={px + Math.sin((frame + p.i * 40) / 60) * (F * 0.4) / zz} y={py} h={h} seed={`${seed}-person-${p.i}`} costume={(['none', 'hood', 'scarf', 'none'] as const)[p.i % 4]} step={walk} light="#FFB86B" lightAmount={0.15} rim="#FFD9A0" dir={random(`${seed}-d-${p.i}`) > 0.5 ? 1 : -1} />
				</g>
			),
		});
	}

	for (const c of cops) {
		const zz = c.z - dolly;
		if (zz < 2) continue;
		const [px, py] = project(c.x, 0, c.z);
		depthItems.push({z: c.z, node: <MiniOfficer key={`cop-${c.i}`} x={px} y={py} h={(F * 1.8) / zz} dir={c.i % 2 ? 1 : -1} step={frame / 20 + c.i} />});
	}

	if (vans) {
		for (const [k, v] of [
			[0, {x: 5.2, z: 34}],
			[1, {x: -6.2, z: 52}],
		] as const) {
			const zz = v.z - dolly;
			if (zz < 3) continue;
			const [px, py] = project(v.x, 0, v.z);
			depthItems.push({z: v.z, node: <VanRear key={`van-${k}`} cx={px} base={py} s={F / zz} phase={k * 3} />});
		}
	}

	depthItems.sort((a, b) => b.z - a.z);
	const [vx] = project(0, 0, 400);

	return (
		<AbsoluteFill style={{overflow: 'hidden', background: '#05071A'}}>
			<svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
				<defs>
					<linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor="#04061A" />
						<stop offset="0.6" stopColor="#141A46" />
						<stop offset="1" stopColor="#3A2A5E" />
					</linearGradient>
					<linearGradient id={`${id}-ground`} x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor="#3A3656" />
						<stop offset="0.4" stopColor="#25243C" />
						<stop offset="1" stopColor="#14142A" />
					</linearGradient>
					<radialGradient id={`${id}-lamp`}>
						<stop offset="0" stopColor="#FFD48A" stopOpacity={0.55} />
						<stop offset="1" stopColor="#FFD48A" stopOpacity={0} />
					</radialGradient>
					<radialGradient id={`${id}-canopy`} cx="0.45" cy="0.4">
						<stop offset="0" stopColor="#3F7550" />
						<stop offset="1" stopColor="#1A3324" />
					</radialGradient>
					<radialGradient id={`${id}-funnel`}>
						<stop offset="0" stopColor="#020410" />
						<stop offset="0.7" stopColor="#0E2440" />
						<stop offset="1" stopColor="#3A8EC0" stopOpacity={0.7} />
					</radialGradient>
					<radialGradient id={`${id}-pool`}>
						<stop offset="0" stopColor="#FFC27A" stopOpacity={0.35} />
						<stop offset="1" stopColor="#FFC27A" stopOpacity={0} />
					</radialGradient>
					<linearGradient id="zeil-shade-l" x1="0" y1="0" x2="1" y2="0">
						<stop offset="0" stopColor="#000" stopOpacity={0} />
						<stop offset="1" stopColor="#000" stopOpacity={0.55} />
					</linearGradient>
					<linearGradient id="zeil-shade-r" x1="1" y1="0" x2="0" y2="0">
						<stop offset="0" stopColor="#000" stopOpacity={0} />
						<stop offset="1" stopColor="#000" stopOpacity={0.55} />
					</linearGradient>
				</defs>
				<rect width={W} height={1920} fill={`url(#${id}-sky)`} />
				{/* Hochhäuser am Ende der Straße */}
				{[
					[-34, 235, 26],
					[-12, 300, 30],
					[16, 258, 24],
					[44, 200, 28],
					[-60, 170, 22],
					[70, 160, 26],
				].map(([x, h, w], k) => {
					const z = 520;
					const [x0, yb] = project(x - w / 2, 0, z);
					const [x1, yt] = project(x + w / 2, h, z);
					return (
						<g key={`tw-${k}`}>
							<rect x={x0} y={yt} width={x1 - x0} height={yb - yt} fill="#1A2152" />
							{new Array(30).fill(true).map((_, j) => (
								<rect key={j} x={x0 + 3 + random(`twx-${k}-${j}`) * (x1 - x0 - 6)} y={yt + 6 + random(`twy-${k}-${j}`) * (yb - yt - 12)} width={2.5} height={2.5} fill="#FFD9A0" opacity={0.6} />
							))}
							{k === 1 ? <circle cx={(x0 + x1) / 2} cy={yt - 4} r={3} fill="#FF3B4E" opacity={0.5 + 0.5 * Math.sin(frame / 10)} /> : null}
						</g>
					);
				})}
				{/* Boden */}
				<polygon points={pts([[0, HORIZON], [W, HORIZON], [W, 1920], [0, 1920]])} fill={`url(#${id}-ground)`} />
				{/* Pflasterraster */}
				{[-10.5, -7.5, -4.5, -1.5, 1.5, 4.5, 7.5, 10.5].map((x) => {
					const [a, b] = [project(x, 0, dolly + 1.5), project(x, 0, 300)];
					return <line key={`lx-${x}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#4A4668" strokeWidth={1.5} opacity={0.35} />;
				})}
				{new Array(40).fill(true).map((_, k) => {
					const z = Math.floor(dolly / 3) * 3 + 3 + k * 3;
					if (z - dolly < 1.5) return null;
					const [a, b] = [project(-HALF, 0, z), project(HALF, 0, z)];
					return <line key={`lz-${k}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#4A4668" strokeWidth={1} opacity={Math.min(0.3, 8 / (z - dolly))} />;
				})}
				{/* Lichtpfützen der Laternen */}
				{lamps.map((l) => {
					const zz = l.z - dolly;
					if (zz < 1.2) return null;
					const [px, py] = project(l.side * 8, 0, l.z);
					const r = (F * 6) / zz;
					return <ellipse key={`pool-${l.side}-${l.z}`} cx={px} cy={py} rx={r} ry={r * 0.22} fill={`url(#${id}-pool)`} opacity={warm} />;
				})}
				{visible.map((b) => (
					<Facade key={b.seed} b={b} project={project} dolly={dolly} glow={warm} id={id} />
				))}
				{depthItems.map((d) => d.node)}
				{/* Blaulicht-Reflex (dezent, ohne Sirene) */}
				{blueLight > 0 ? <ellipse cx={vx + 120} cy={HORIZON + 60} rx={520} ry={180} fill="#3D7BFF" opacity={blueLight * (0.1 + 0.12 * swayBlue)} /> : null}
			</svg>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 55% at 50% 52%, rgba(0,0,0,0) 50%, rgba(2,3,12,0.4) 100%)'}} />
		</AbsoluteFill>
	);
};
