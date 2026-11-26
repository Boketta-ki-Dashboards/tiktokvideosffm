import React from 'react';
import {random, useCurrentFrame} from 'remotion';
import {type PlaneBillboard, type PlaneCamera, TiltedPlane} from '../../../components/map/TiltedPlane';
import tarifMap from '../../../data/maps/frankfurt-tarif-uebersicht.json';
import {withAlpha} from '../../../lib/color';
import {useSvgId} from '../../../lib/svg';
import {COLORS, FONTS} from '../../../theme/tokens';

/**
 * Illustrationen #19 (eigene Vektorgrafik im Serienstil, keine Herstellerformen, keine Logos, keine Live-Daten):
 * Stadtbus und S-Bahn (Seitenansicht, passend zu `TramSide`/`UBahnTrain` aus #11), Lichterkette, Einkaufstüte, Münzstapel,
 * Tarifübersicht als 2,5D-Ebene (Verwaltungsgrenzen aus OpenStreetMap: Stadtgebiet = Tarifgebiet 5000, Stadtteil Flughafen = 5090).
 */

export const BUS_BODY = '#B794F6';
export const SBAHN_RED = '#E5394A';
const WARM = '#FFD27A';

/* ------------------------------------------------------------------ Stadtbus (Gelenkbus, Seitenansicht, fährt nach rechts) */

export const CityBus: React.FC<{width: number; lit?: number; line?: string}> = ({width, lit = 1, line = '30'}) => {
	const frame = useCurrentFrame();
	const id = useSvgId('bus');
	const W = 900;
	const H = 280;
	const bob = Math.sin(frame / 6) * 1.4;
	return (
		<svg width={width} height={(width * H) / W} viewBox={`0 0 ${W} ${H}`} style={{overflow: 'visible'}}>
			<defs>
				<linearGradient id={`${id}-b`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#F4F6FB" />
					<stop offset="0.55" stopColor="#D9DEEC" />
					<stop offset="1" stopColor="#A9B2CC" />
				</linearGradient>
			</defs>
			<ellipse cx={450} cy={252} rx={440} ry={14} fill="rgba(0,0,0,0.45)" />
			<g transform={`translate(0 ${bob})`}>
				{/* zwei Wagenteile mit Gelenk */}
				<path d="M30 70 Q30 52 48 52 H430 V222 H48 Q30 222 30 204 Z" fill={`url(#${id}-b)`} />
				<path d="M452 52 H826 Q872 54 880 110 L884 204 Q884 222 866 222 H452 Z" fill={`url(#${id}-b)`} />
				<rect x={430} y={60} width={22} height={160} fill="#3B4268" />
				{[0, 1, 2, 3, 4, 5].map((k) => (
					<line key={k} x1={430} x2={452} y1={72 + k * 24} y2={72 + k * 24} stroke="#6B74A0" strokeWidth={3} />
				))}
				{/* Farbband */}
				<rect x={30} y={168} width={400} height={20} fill={BUS_BODY} />
				<rect x={452} y={168} width={432} height={20} fill={BUS_BODY} />
				{/* Fensterband */}
				<rect x={48} y={70} width={370} height={64} rx={8} fill="#132247" />
				<rect x={466} y={70} width={340} height={64} rx={8} fill="#132247" />
				<path d="M816 70 Q860 74 868 132 H816 Z" fill="#132247" />
				<rect x={48} y={70} width={370} height={64} rx={8} fill={withAlpha('#FFE8A8', 0.14 * lit)} />
				<rect x={466} y={70} width={340} height={64} rx={8} fill={withAlpha('#FFE8A8', 0.14 * lit)} />
				{/* Türen */}
				{[110, 330, 560, 760].map((x) => (
					<g key={x}>
						<rect x={x} y={70} width={52} height={146} rx={5} fill="#1E2B55" stroke="#EEF1F8" strokeWidth={4} />
						<line x1={x + 26} x2={x + 26} y1={72} y2={214} stroke="#EEF1F8" strokeWidth={3} />
					</g>
				))}
				{/* Zielanzeige vorn */}
				<rect x={700} y={56} width={130} height={22} rx={5} fill="#120E06" />
				<text x={712} y={73} fontFamily={FONTS.heading} fontWeight={900} fontSize={18} fill="#FFB938">
					{line}
				</text>
				<text x={746} y={73} fontFamily={FONTS.heading} fontWeight={800} fontSize={12} fill="#FFB938" opacity={0.85}>
					INNENSTADT
				</text>
				{/* Scheinwerfer */}
				<ellipse cx={872} cy={186} rx={9} ry={7} fill="#FFF6D6" />
				<ellipse cx={894} cy={188} rx={56 * lit} ry={20 * lit} fill={withAlpha('#FFF1B8', 0.22 * lit)} />
				{/* Räder */}
				{[140, 360, 760].map((x) => (
					<g key={x}>
						<circle cx={x} cy={222} r={28} fill="#1B2140" />
						<circle cx={x} cy={222} r={13} fill="#5B668F" />
						<line x1={x} y1={222} x2={x + 12 * Math.cos(frame / 3)} y2={222 + 12 * Math.sin(frame / 3)} stroke="#1B2140" strokeWidth={4} />
					</g>
				))}
			</g>
		</svg>
	);
};

/* ------------------------------------------------------------------ S-Bahn (Triebzug, Seitenansicht, fährt nach rechts) */

export const SBahnTrain: React.FC<{width: number; lit?: number; line?: string}> = ({width, lit = 1, line = 'S8'}) => {
	const frame = useCurrentFrame();
	const id = useSvgId('sb');
	const W = 1000;
	const H = 210;
	return (
		<svg width={width} height={(width * H) / W} viewBox={`0 0 ${W} ${H}`} style={{overflow: 'visible'}}>
			<defs>
				<linearGradient id={`${id}-b`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#FF6A78" />
					<stop offset="0.6" stopColor={SBAHN_RED} />
					<stop offset="1" stopColor="#A8202F" />
				</linearGradient>
			</defs>
			<ellipse cx={500} cy={196} rx={490} ry={10} fill="rgba(0,0,0,0.5)" />
			<rect x={0} y={186} width={W} height={6} rx={3} fill="#4A5680" />
			{[0, 1].map((car) => {
				const x0 = car * 492;
				const front = car === 1;
				return (
					<g key={car}>
						<path d={front ? `M${x0 + 10} 38 H${x0 + 420} Q${x0 + 486} 42 ${x0 + 494} 118 V172 H${x0 + 10} Z` : `M${x0 + 10} 38 H${x0 + 486} V172 H${x0 + 10} Z`} fill={`url(#${id}-b)`} />
						<rect x={x0 + 10} y={138} width={front ? 480 : 476} height={12} fill="#F2F4FA" />
						<rect x={x0 + 26} y={56} width={front ? 392 : 440} height={52} rx={8} fill="#122247" />
						<rect x={x0 + 26} y={56} width={front ? 392 : 440} height={52} rx={8} fill={withAlpha('#FFF0C2', 0.16 * lit)} />
						{front ? <path d={`M${x0 + 430} 56 Q${x0 + 470} 62 ${x0 + 482} 108 H${x0 + 430} Z`} fill="#122247" /> : null}
						{[70, 240, 400].map((dx) =>
							dx < (front ? 390 : 470) ? (
								<g key={dx}>
									<rect x={x0 + dx} y={54} width={46} height={114} rx={4} fill="#3A1420" stroke="#F2F4FA" strokeWidth={3} />
									<line x1={x0 + dx + 23} x2={x0 + dx + 23} y1={56} y2={166} stroke="#F2F4FA" strokeWidth={2} />
								</g>
							) : null,
						)}
						<rect x={x0 + 20} y={170} width={140} height={14} rx={5} fill="#232A48" />
						<rect x={x0 + 330} y={170} width={140} height={14} rx={5} fill="#232A48" />
					</g>
				);
			})}
			{/* Liniensymbol vorne (eigene Gestaltung) */}
			<circle cx={930} cy={64} r={20} fill="#FFFFFF" />
			<text x={930} y={72} textAnchor="middle" fontFamily={FONTS.heading} fontWeight={900} fontSize={20} fill={SBAHN_RED}>
				{line}
			</text>
			<ellipse cx={986} cy={150} rx={8} ry={6} fill="#FFF6D6" />
			<ellipse cx={1012} cy={152} rx={60 * lit} ry={18 * lit} fill={withAlpha('#FFF1B8', 0.25 * lit)} />
			{[0, 1, 2].map((i) => (
				<line key={i} x1={-60 - ((frame * 9 + i * 70) % 220)} x2={-10 - ((frame * 9 + i * 70) % 220)} y1={70 + i * 34} y2={70 + i * 34} stroke={withAlpha('#FFFFFF', 0.35)} strokeWidth={4} strokeLinecap="round" />
			))}
		</svg>
	);
};

/* ------------------------------------------------------------------ Lichterkette (Weihnachtsbeleuchtung über der Straße) */

export const Garland: React.FC<{width: number; sag?: number; bulbs?: number; seed?: string; on?: number}> = ({width, sag = 60, bulbs = 22, seed = 'g', on = 1}) => {
	const frame = useCurrentFrame();
	const H = sag + 40;
	const pts = new Array(bulbs).fill(0).map((_, i) => {
		const t = (i + 0.5) / bulbs;
		return {x: t * width, y: 10 + Math.sin(t * Math.PI) * sag, i};
	});
	const colors = [WARM, '#FF8FA0', '#9FE3FF', WARM, '#B9F5A0'];
	return (
		<svg width={width} height={H} viewBox={`0 0 ${width} ${H}`} style={{overflow: 'visible'}}>
			<path d={`M0 10 Q${width / 2} ${10 + sag * 2} ${width} 10`} fill="none" stroke="#2B2F4E" strokeWidth={3} />
			{pts.map((p) => {
				const tw = 0.6 + 0.4 * Math.sin(frame / 5 + random(`${seed}-${p.i}`) * 6.28);
				const c = colors[p.i % colors.length];
				const show = Math.max(0, Math.min(1, on * bulbs - p.i));
				return (
					<g key={p.i} opacity={show}>
						<circle cx={p.x} cy={p.y + 8} r={14} fill={withAlpha(c, 0.22 * tw)} />
						<circle cx={p.x} cy={p.y + 8} r={6} fill={c} opacity={0.6 + 0.4 * tw} />
					</g>
				);
			})}
		</svg>
	);
};

/* ------------------------------------------------------------------ Einkaufstüte, Münzstapel */

export const ShoppingBag: React.FC<{size: number; color?: string; ribbon?: string}> = ({size, color = '#FF6A78', ribbon = WARM}) => (
	<svg width={size} height={size} viewBox="0 0 100 110">
		<path d="M34 34 Q34 12 50 12 Q66 12 66 34" fill="none" stroke="#2B2F4E" strokeWidth={6} strokeLinecap="round" />
		<path d="M16 32 H84 L90 104 H10 Z" fill={color} />
		<path d="M16 32 H84 L85 44 H15 Z" fill="rgba(0,0,0,0.15)" />
		<rect x={46} y={32} width={8} height={72} fill={ribbon} />
		<path d="M50 52 l-14 -10 v20 z M50 52 l14 -10 v20 z" fill={ribbon} />
	</svg>
);

export const CoinStack: React.FC<{size: number; level?: number}> = ({size, level = 1}) => {
	const coins = Math.max(1, Math.round(8 * level));
	return (
		<svg width={size} height={size} viewBox="0 0 120 120">
			{new Array(coins).fill(0).map((_, i) => (
				<g key={i} transform={`translate(0 ${-i * 9})`}>
					<ellipse cx={60} cy={100} rx={40} ry={12} fill="#B98A1E" />
					<rect x={20} y={92} width={80} height={8} fill="#D9A62C" />
					<ellipse cx={60} cy={92} rx={40} ry={12} fill="#FFD166" />
					<text x={60} y={97} textAnchor="middle" fontFamily={FONTS.heading} fontWeight={900} fontSize={14} fill="#9A6E12">
						€
					</text>
				</g>
			))}
		</svg>
	);
};

/* ------------------------------------------------------------------ Tarifübersicht (2,5D) */

type TarifArea = {label: string; d: string; center: [number, number]};
const TM = tarifMap as unknown as {meta: {bounds: {minX: number; maxX: number; minY: number; maxY: number}}; areas: Record<string, TarifArea>};
export const TARIF_K = 0.03;
const B = TM.meta.bounds;
const PAD = 1500;
export const TARIF_SIZE = {width: Math.round((B.maxX - B.minX + 2 * PAD) * TARIF_K), height: Math.round((B.maxY - B.minY + 2 * PAD) * TARIF_K)};
/** Kartenmeter → px in der Ebene. */
export const tarifXY = (p: [number, number]): [number, number] => [(p[0] - B.minX + PAD) * TARIF_K, (p[1] - B.minY + PAD) * TARIF_K];
export const TARIF_AREAS = TM.areas;

export const TariffPlane: React.FC<{camera: PlaneCamera; anchor: [number, number]; zoneOn: number; airportOn: number; neighborsOn: number; route?: number; billboards?: PlaneBillboard[]}> = ({camera, anchor, zoneOn, airportOn, neighborsOn, route = 0, billboards = []}) => {
	const frame = useCurrentFrame();
	const id = useSvgId('tp');
	const W = TARIF_SIZE.width;
	const H = TARIF_SIZE.height;
	const vb = `${B.minX - PAD} ${B.minY - PAD} ${B.maxX - B.minX + 2 * PAD} ${B.maxY - B.minY + 2 * PAD}`;
	const A = TM.areas;
	const neighbors = ['offenbach', 'badhomburg', 'eschborn', 'neuisenburg'];
	const pulse = 0.5 + 0.5 * Math.sin(frame / 8);
	// Verbindung Offenbach → Frankfurt (schematisch, bis zur Stadtgrenze)
	const [ox, oy] = A.offenbach.center;
	const [fx, fy] = A.frankfurt.center;
	const t = Math.max(0, Math.min(1, route));
	const ex = ox + (fx - ox) * t;
	const ey = oy + (fy - oy) * t;
	const Svg: React.FC<{children: React.ReactNode}> = ({children}) => (
		<svg width={W} height={H} viewBox={vb} style={{overflow: 'visible'}}>
			{children}
		</svg>
	);
	const layers = [
		{
			key: 'ground',
			z: 0,
			node: (
				<Svg>
					<defs>
						<pattern id={`${id}-hatch`} width={420} height={420} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
							<rect width={420} height={420} fill={withAlpha('#FF5A6E', 0.25)} />
							<rect width={160} height={420} fill={withAlpha('#FF5A6E', 0.65)} />
						</pattern>
					</defs>
					<rect x={B.minX - PAD * 3} y={B.minY - PAD * 3} width={B.maxX - B.minX + PAD * 6} height={B.maxY - B.minY + PAD * 6} fill="#0A0F2B" />
					{neighbors.map((k) => (
						<path key={k} d={A[k].d} fill={withAlpha('#3A4478', 0.55 * neighborsOn)} stroke={withAlpha('#8E97BD', neighborsOn)} strokeWidth={70} strokeLinejoin="round" />
					))}
					<path d={A.frankfurt.d} fill={withAlpha('#1F3A8A', 0.6)} stroke="#4F6BD8" strokeWidth={90} strokeLinejoin="round" />
					<path d={A.frankfurt.d} fill={withAlpha('#3DDC84', 0.45 * zoneOn)} stroke={withAlpha('#3DDC84', zoneOn)} strokeWidth={140} strokeLinejoin="round" />
					<path d={A.flughafen.d} fill={`url(#${id}-hatch)`} opacity={airportOn} stroke={withAlpha('#FF5A6E', airportOn)} strokeWidth={110} strokeLinejoin="round" />
					{t > 0 ? (
						<g>
							<line x1={ox} y1={oy} x2={ex} y2={ey} stroke={withAlpha('#FFB547', 0.3)} strokeWidth={600} strokeLinecap="round" />
							<line x1={ox} y1={oy} x2={ex} y2={ey} stroke="#FFB547" strokeWidth={200} strokeLinecap="round" strokeDasharray="600 420" />
						</g>
					) : null}
				</Svg>
			),
		},
		{
			key: 'top',
			z: 6,
			opacity: 0.85,
			node: (
				<Svg>
					<path d={A.frankfurt.d} fill="none" stroke={withAlpha('#BFF5D6', 0.35 + 0.35 * pulse * zoneOn)} strokeWidth={60} strokeLinejoin="round" />
				</Svg>
			),
		},
	];
	return <TiltedPlane width={W} height={H} camera={camera} anchor={anchor} perspective={1400} layers={layers} billboards={billboards} mask="radial-gradient(ellipse 52% 52% at 50% 50%, #000 70%, rgba(0,0,0,0) 99%)" />;
};

/* ------------------------------------------------------------------ Nachrichtenkachel (neutral) */

export const NewsTile: React.FC<{width: number; kicker: string; title: string; lines: string[]; color: string; icon?: React.ReactNode}> = ({width, kicker, title, lines, color, icon}) => (
	<div style={{width, boxSizing: 'border-box', borderRadius: 20, overflow: 'hidden', background: 'rgba(10,14,40,0.96)', border: `3px solid ${color}`, boxShadow: `0 20px 50px rgba(0,0,0,0.55), 0 0 30px ${withAlpha(color, 0.25)}`}}>
		<div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: withAlpha(color, 0.22)}}>
			{icon}
			<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 18, letterSpacing: 1.4, color}}>{kicker}</span>
		</div>
		<div style={{padding: '10px 14px 12px'}}>
			<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, lineHeight: 1.08, color: COLORS.text}}>{title}</div>
			{lines.map((l) => (
				<div key={l} style={{marginTop: 6, fontFamily: FONTS.body, fontWeight: 700, fontSize: 19, lineHeight: 1.25, color: COLORS.textMuted}}>
					{l}
				</div>
			))}
		</div>
	</div>
);
