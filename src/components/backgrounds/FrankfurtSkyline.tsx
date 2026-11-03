import React, {useMemo} from 'react';
import {random, useCurrentFrame} from 'remotion';
import {useSvgId} from '../../lib/svg';
import {FlickerWindows, makeWindows, StaticWindows, type WindowRect} from './windows';

/**
 * Stilisierte, handgezeichnete Frankfurt-Skyline (Blick von Sachsenhausen über den Main).
 * Wiedererkennbare Silhouetten: Europaturm, Tower 185, Messeturm, Westend Tower (Krone),
 * Trianon, Opernturm, Main Tower, Commerzbank Tower, Silberturm, Omniturm, Kaiserdom,
 * Altstadt-Giebel, EZB und der Eiserne Steg. Höhen ≈ maßstäblich (2,3 px pro Meter).
 */

export const SKYLINE_VIEWBOX = {width: 1400, height: 1100} as const;
const G = 820; // Uferlinie (y)
const K = 2.3; // px pro Meter
const m = (meters: number) => meters * K;
const top = (meters: number) => G - m(meters);

export type SkylinePalette = {
	far: string;
	mid: string;
	near: string;
	front: string;
	glass: string;
	glassHi: string;
	stone: string;
	sandstone: string;
	light: string;
	steel: string;
	tree: string;
	quay: string;
	waterTop: string;
	waterBottom: string;
	windows: string[];
	warning: string;
	lamp: string;
};

export const NIGHT_PALETTE: SkylinePalette = {
	far: '#26306A',
	mid: '#1C2557',
	near: '#161D47',
	front: '#0F1433',
	glass: '#223170',
	glassHi: '#3B53A6',
	stone: '#5A2C4E',
	sandstone: '#4C2236',
	light: '#3A4789',
	steel: '#080B1F',
	tree: '#0A0F26',
	quay: '#0C1130',
	waterTop: '#1A2257',
	waterBottom: '#060A1E',
	windows: ['#FFD98A', '#FFE9B8', '#A9DCFF', '#FFC66B'],
	warning: '#FF3B4E',
	lamp: '#FFD27A',
};

export type FrankfurtSkylineProps = {
	width?: number;
	palette?: Partial<SkylinePalette>;
	/** Anteil beleuchteter Fenster (0–1). */
	litRatio?: number;
	showRiver?: boolean;
	showBridge?: boolean;
	style?: React.CSSProperties;
};

type Built = {
	windows: WindowRect[];
};

const towerWindows = (litRatio: number): WindowRect[] => {
	const specs: Array<[string, number, number, number, number]> = [
		// id, x, w, yTop(m), yBottom(m)
		['t185', 34, 92, 196, 22],
		['messe', 156, 66, 220, 26],
		['westend', 266, 84, 190, 24],
		['trianon', 376, 78, 168, 24],
		['oper', 474, 64, 166, 26],
		['main-rect', 562, 44, 168, 24],
		['main-cyl', 600, 60, 197, 24],
		['coba', 686, 92, 248, 24],
		['silber', 806, 72, 160, 22],
		['omni-low', 909, 66, 58, 20],
		['omni-high', 909, 66, 186, 102],
		['ezb-l', 1226, 54, 176, 24],
		['ezb-r', 1298, 50, 160, 24],
	];
	return specs.flatMap(([id, x, w, t, b]) =>
		makeWindows({
			x,
			y: top(t),
			w,
			h: m(t) - m(b),
			seed: `ffm-${id}`,
			litRatio,
			colW: 9,
			rowH: 11,
			winW: 4,
			winH: 5,
			colors: NIGHT_PALETTE.windows,
		}),
	);
};

const frontRow = (seed: string) => {
	const out: Array<{x: number; w: number; h: number}> = [];
	let x = -10;
	while (x < SKYLINE_VIEWBOX.width + 10) {
		const w = 40 + random(`${seed}-w-${x}`) * 70;
		const h = 34 + random(`${seed}-h-${x}`) ** 1.6 * 110;
		out.push({x, w, h});
		x += w + 2;
	}

	return out;
};

const Skyline: React.FC<{p: SkylinePalette; built: Built; frame: number; ids: {cyl: string}}> = ({p, built, frame, ids}) => {
	const blink = frame % 40 < 18 ? 1 : 0.15;
	const front = useMemo(() => frontRow('ffm-front'), []);
	const frontWindows = useMemo(
		() =>
			front.flatMap((b, i) =>
				makeWindows({x: b.x, y: G - b.h, w: b.w, h: b.h - 8, seed: `ffm-front-${i}`, litRatio: 0.32, colW: 9, rowH: 11, winW: 4, winH: 5}),
			),
		[front],
	);

	return (
		<g>
			{/* ---------- Hintere Ebene ---------- */}
			{/* Europaturm (Ginnheimer Spargel) */}
			<g fill={p.far}>
				<polygon points={`286,${G} 314,${G} 307,${top(300)} 293,${top(300)}`} />
				<rect x={266} y={top(234)} width={68} height={m(14)} rx={10} />
				<rect x={274} y={top(244)} width={52} height={m(6)} rx={6} />
				<rect x={298} y={top(337)} width={4} height={m(37)} />
			</g>
			{/* Opernturm */}
			<rect x={470} y={top(170)} width={72} height={m(170)} fill={p.far} />

			{/* ---------- Mittlere Ebene: Hochhäuser ---------- */}
			{/* Tower 185 */}
			<g fill={p.mid}>
				<rect x={30} y={top(200)} width={48} height={m(200)} />
				<rect x={82} y={top(192)} width={48} height={m(192)} />
				<rect x={12} y={top(26)} width={136} height={m(26)} />
			</g>
			<rect x={78} y={top(200)} width={4} height={m(180)} fill={p.light} opacity={0.5} />

			{/* Messeturm */}
			<g fill={p.stone}>
				<rect x={150} y={top(222)} width={78} height={m(222)} />
				<rect x={157} y={top(240)} width={64} height={m(18)} />
				<polygon points={`157,${top(240)} 189,${top(257)} 221,${top(240)}`} />
			</g>
			<rect x={155} y={top(222)} width={3} height={m(200)} fill={p.light} opacity={0.35} />
			<rect x={220} y={top(222)} width={3} height={m(200)} fill={p.light} opacity={0.35} />

			{/* Westend Tower mit Krone */}
			<rect x={262} y={top(192)} width={92} height={m(192)} fill={p.light} />
			<g stroke={p.light} strokeWidth={4} strokeLinecap="round">
				{new Array(9).fill(true).map((_, i) => {
					const t = (i - 4) / 4;
					return <line key={i} x1={308 + t * 30} y1={top(192)} x2={308 + t * 52} y2={top(208) + Math.abs(t) * 14} />;
				})}
			</g>

			{/* Trianon */}
			<g fill={p.glass}>
				<rect x={372} y={top(170)} width={86} height={m(170)} />
				<polygon points={`372,${top(170)} 415,${top(186)} 458,${top(170)}`} />
			</g>
			<polygon points={`392,${top(171)} 415,${top(181)} 438,${top(171)}`} fill={p.far} />

			{/* Main Tower */}
			<rect x={558} y={top(170)} width={50} height={m(170)} fill={p.mid} />
			<defs>
				<linearGradient id={ids.cyl} x1="0" x2="1" y1="0" y2="0">
					<stop offset="0" stopColor={p.glass} />
					<stop offset="0.45" stopColor={p.glassHi} />
					<stop offset="1" stopColor={p.glass} />
				</linearGradient>
			</defs>
			<rect x={596} y={top(200)} width={68} height={m(200)} rx={6} fill={`url(#${ids.cyl})`} />
			<rect x={591} y={top(202)} width={78} height={7} rx={3} fill={p.mid} />
			<rect x={628} y={top(240)} width={4} height={m(40)} fill={p.mid} />

			{/* Commerzbank Tower */}
			<g fill={p.near}>
				<rect x={680} y={top(250)} width={34} height={m(250)} />
				<rect x={714} y={top(259)} width={36} height={m(259)} />
				<rect x={750} y={top(244)} width={34} height={m(244)} />
				<polygon points={`714,${top(259)} 732,${top(268)} 750,${top(259)}`} />
				<rect x={729} y={top(300)} width={6} height={m(34)} />
			</g>
			{[52, 104, 156, 208].map((h, i) => (
				<rect key={h} x={i % 2 === 0 ? 684 : 752} y={top(h + 8)} width={28} height={m(8)} fill="#245E57" opacity={0.85} />
			))}

			{/* Silberturm */}
			<rect x={800} y={top(166)} width={84} height={m(166)} rx={18} fill={p.light} />
			<g fill={p.mid} opacity={0.55}>
				{new Array(Math.floor(m(160) / 10)).fill(true).map((_, i) => (
					<rect key={i} x={803} y={top(164) + i * 10} width={78} height={2} />
				))}
			</g>

			{/* Omniturm mit „Hüftschwung“ */}
			<g fill={p.glass}>
				<rect x={905} y={top(60)} width={74} height={m(60)} />
				{new Array(6).fill(true).map((_, i) => {
					const off = Math.sin(((i + 0.5) / 6) * Math.PI) * 14;
					return <rect key={i} x={905 + off} y={top(60 + (i + 1) * 7)} width={74} height={m(7) + 1} />;
				})}
				<rect x={905} y={top(190)} width={74} height={m(88)} />
			</g>

			{/* EZB mit Atrium + Großmarkthalle */}
			<g fill={p.mid}>
				<polygon points={`1220,${G} 1282,${G} 1286,${top(185)} 1226,${top(178)}`} />
				<polygon points={`1290,${G} 1352,${G} 1348,${top(163)} 1294,${top(185)}`} />
			</g>
			<polygon points={`1282,${G} 1290,${G} 1294,${top(185)} 1286,${top(185)}`} fill={p.glassHi} opacity={0.8} />

			<StaticWindows windows={built.windows} />
			<FlickerWindows windows={built.windows} frame={frame} seed="ffm-towers" />

			{/* ---------- Vordere Ebene: Uferbebauung ---------- */}
			<g fill={p.front}>
				{front.map((b, i) => (
					<rect key={i} x={b.x} y={G - b.h} width={b.w} height={b.h} />
				))}
			</g>
			<StaticWindows windows={frontWindows} opacity={0.85} />

			{/* Großmarkthalle (Bögen) */}
			<g fill={p.front}>
				{new Array(8).fill(true).map((_, i) => (
					<path key={i} d={`M ${1150 + i * 32} ${G - 40} q 16 -22 32 0 v 40 h -32 z`} />
				))}
			</g>

			{/* Kaiserdom St. Bartholomäus */}
			<g fill={p.sandstone}>
				<rect x={1010} y={top(55)} width={54} height={m(55)} />
				<rect x={1015} y={top(76)} width={44} height={m(21)} />
				<path d={`M 1015 ${top(76)} Q 1037 ${top(84)} 1059 ${top(76)} Z`} />
				<polygon points={`1022,${top(82)} 1037,${top(95)} 1052,${top(82)}`} />
				<rect x={1035} y={top(99)} width={4} height={m(5)} />
				<rect x={960} y={top(30)} width={60} height={m(30)} />
				<polygon points={`960,${top(30)} 990,${top(42)} 1020,${top(30)}`} />
			</g>
			<g fill={p.lamp} opacity={0.75}>
				{[1020, 1032, 1044].map((x) => (
					<path key={x} d={`M ${x} ${top(48)} v 16 h 7 v -16 q -3.5 -6 -7 0 z`} />
				))}
			</g>

			{/* Altstadt-Giebelhäuser */}
			{[0, 1, 2, 3].map((i) => {
				const x = 1078 + i * 30;
				const h = 54 + (i % 2) * 14;
				return (
					<g key={i} fill={i % 2 ? p.front : p.near}>
						<rect x={x} y={G - h} width={28} height={h} />
						<polygon points={`${x},${G - h} ${x + 14},${G - h - 22} ${x + 28},${G - h}`} />
						<rect x={x + 9} y={G - h + 10} width={4} height={6} fill={p.lamp} opacity={0.8} />
						<rect x={x + 16} y={G - h + 24} width={4} height={6} fill={p.lamp} opacity={0.6} />
					</g>
				);
			})}

			{/* Flugwarnlichter */}
			<g fill={p.warning} opacity={blink}>
				<circle cx={300} cy={top(337)} r={4} />
				<circle cx={732} cy={top(300)} r={4} />
				<circle cx={630} cy={top(240)} r={4} />
				<circle cx={189} cy={top(257)} r={3.5} />
				<circle cx={1290} cy={top(185)} r={3.5} />
			</g>

			{/* Ufer mit Bäumen und Laternen */}
			<g fill={p.tree}>
				{new Array(26).fill(true).map((_, i) => (
					<ellipse key={i} cx={i * 56 + 18} cy={G - 10} rx={26 + (i % 3) * 6} ry={16 + (i % 2) * 6} />
				))}
			</g>
			<rect x={0} y={G} width={SKYLINE_VIEWBOX.width} height={18} fill={p.quay} />
			<g fill={p.lamp}>
				{new Array(24).fill(true).map((_, i) => (
					<circle key={i} cx={i * 60 + 30} cy={G + 2} r={2.6} />
				))}
			</g>
		</g>
	);
};

export const FrankfurtSkyline: React.FC<FrankfurtSkylineProps> = ({
	width = 1400,
	palette,
	litRatio = 0.32,
	showRiver = true,
	showBridge = true,
	style,
}) => {
	const frame = useCurrentFrame();
	const p = useMemo(() => ({...NIGHT_PALETTE, ...palette}), [palette]);
	const built = useMemo<Built>(() => ({windows: towerWindows(litRatio)}), [litRatio]);
	const skylineId = useSvgId('ffm-skyline');
	const waterId = useSvgId('ffm-water');
	const fadeId = useSvgId('ffm-fade');
	const maskId = useSvgId('ffm-mask');
	const cylId = useSvgId('ffm-cyl');
	const height = (width * SKYLINE_VIEWBOX.height) / SKYLINE_VIEWBOX.width;
	const waterTop = G + 18;

	return (
		<svg
			width={width}
			height={height}
			viewBox={`0 0 ${SKYLINE_VIEWBOX.width} ${SKYLINE_VIEWBOX.height}`}
			style={{overflow: 'visible', ...style}}
		>
			<defs>
				<linearGradient id={waterId} x1="0" x2="0" y1="0" y2="1">
					<stop offset="0" stopColor={p.waterTop} />
					<stop offset="1" stopColor={p.waterBottom} />
				</linearGradient>
				<linearGradient id={fadeId} x1="0" x2="0" y1="0" y2="1">
					<stop offset="0" stopColor="#fff" stopOpacity={0.55} />
					<stop offset="0.7" stopColor="#fff" stopOpacity={0} />
				</linearGradient>
				<mask id={maskId}>
					<rect x={0} y={waterTop} width={SKYLINE_VIEWBOX.width} height={SKYLINE_VIEWBOX.height - waterTop} fill={`url(#${fadeId})`} />
				</mask>
			</defs>

			<g id={skylineId}>
				<Skyline p={p} built={built} frame={frame} ids={{cyl: cylId}} />
			</g>

			{showRiver ? (
				<g>
					<rect x={0} y={waterTop} width={SKYLINE_VIEWBOX.width} height={SKYLINE_VIEWBOX.height - waterTop} fill={`url(#${waterId})`} />
					{/* Spiegelung */}
					<g mask={`url(#${maskId})`}>
						<use href={`#${skylineId}`} transform={`translate(0 ${waterTop * 2}) scale(1 -1)`} />
					</g>
					{/* Wellen, die die Spiegelung aufbrechen */}
					<g fill={p.waterTop}>
						{new Array(34).fill(true).map((_, i) => {
							const y = waterTop + 6 + i * 7.5;
							const shift = Math.sin(frame * 0.05 + i * 1.7) * 26;
							return (
								<rect
									key={i}
									x={-40 + shift + (i % 3) * 40}
									y={y}
									width={SKYLINE_VIEWBOX.width + 80}
									height={1.6 + (i / 34) * 2.4}
									opacity={0.55}
								/>
							);
						})}
					</g>
				</g>
			) : null}

			{showBridge ? (
				<g>
					{/* Eiserner Steg */}
					<g stroke={p.steel} fill="none" strokeWidth={4}>
						<path d={`M 380 ${G + 74} Q 470 ${G + 44} 560 ${G + 74}`} />
						<path d={`M 560 ${G + 74} Q 690 ${G + 22} 820 ${G + 74}`} />
						<path d={`M 820 ${G + 74} Q 910 ${G + 44} 1000 ${G + 74}`} />
					</g>
					<g stroke={p.steel} strokeWidth={1.6}>
						{new Array(52).fill(true).map((_, i) => {
							const x = 384 + i * 12;
							let y: number;
							if (x < 560) {
								const t = (x - 380) / 180;
								y = G + 74 - 4 * 30 * t * (1 - t) * 0.5;
							} else if (x < 820) {
								const t = (x - 560) / 260;
								y = G + 74 - 4 * 52 * t * (1 - t) * 0.5;
							} else {
								const t = (x - 820) / 180;
								y = G + 74 - 4 * 30 * t * (1 - t) * 0.5;
							}

							return <line key={i} x1={x} y1={y} x2={x} y2={G + 74} />;
						})}
					</g>
					<rect x={370} y={G + 72} width={640} height={7} fill={p.steel} />
					<rect x={552} y={G + 78} width={16} height={46} fill={p.steel} />
					<rect x={812} y={G + 78} width={16} height={46} fill={p.steel} />
					<g fill={p.lamp}>
						{new Array(11).fill(true).map((_, i) => (
							<circle key={i} cx={390 + i * 60} cy={G + 70} r={2.2} />
						))}
					</g>
				</g>
			) : null}
		</svg>
	);
};
