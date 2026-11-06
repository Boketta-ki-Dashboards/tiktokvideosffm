import React from 'react';
import {interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {useSvgId} from '../../../lib/svg';

export type Motif = 'shoe' | 'sports' | 'fashion';

const VB_W = 800;
const VB_H = 880;
const SHOP_TOP = 452;
const SHOP_BOTTOM = 820;

/** Generische Auslage (keine Marken): Schuhe, Trikots oder Schaufensterpuppen. */
const Display: React.FC<{x: number; w: number; motif: Motif; seed: string}> = ({x, w, motif, seed}) => {
	const shelves = [SHOP_TOP + 110, SHOP_TOP + 200, SHOP_TOP + 290];
	if (motif === 'shoe') {
		return (
			<g>
				{shelves.map((y) => (
					<g key={y}>
						<rect x={x + 10} y={y} width={w - 20} height={6} rx={2} fill="#E8D9C2" opacity={0.9} />
						{[0, 1, 2].map((k) => {
							const sx = x + 22 + k * ((w - 44) / 3);
							const c = ['#FF6B5A', '#FFFFFF', '#4FC3F7', '#FFD23F', '#B794F6'][Math.floor(random(`${seed}-${y}-${k}`) * 5)];
							return (
								<path
									key={k}
									d={`M${sx} ${y - 2} q2 -18 14 -20 l10 8 q18 2 26 8 q4 4 0 4 z`}
									fill={c}
									stroke="#1A1A28"
									strokeWidth={2}
								/>
							);
						})}
					</g>
				))}
			</g>
		);
	}

	if (motif === 'sports') {
		return (
			<g>
				<rect x={x + 14} y={SHOP_TOP + 70} width={w - 28} height={5} rx={2} fill="#C9CEDF" />
				{[0, 1, 2].map((k) => {
					const cx = x + 30 + k * ((w - 60) / 2.4);
					const c = ['#2E6BFF', '#FF4D5E', '#34D399'][k];
					return (
						<g key={k} transform={`translate(${cx} ${SHOP_TOP + 76})`}>
							<path d="M0 0 l-2 -8 q2 -6 6 0" stroke="#C9CEDF" strokeWidth={2} fill="none" />
							<path d="M-30 14 L-12 4 Q2 12 16 4 L34 14 L28 34 L22 32 L22 92 L-18 92 L-18 32 L-24 34 Z" fill={c} stroke="#121528" strokeWidth={2} />
							<rect x={-6} y={40} width={16} height={22} rx={3} fill="#FFFFFF" opacity={0.85} />
						</g>
					);
				})}
				<rect x={x + 10} y={shelves[2]} width={w - 20} height={6} rx={2} fill="#E8D9C2" opacity={0.9} />
				{[0, 1, 2, 3].map((k) => (
					<circle key={k} cx={x + 34 + k * ((w - 68) / 3)} cy={shelves[2] - 16} r={15} fill={k % 2 ? '#FFFFFF' : '#F2A93B'} stroke="#121528" strokeWidth={2} />
				))}
			</g>
		);
	}

	return (
		<g>
			{[0.3, 0.72].map((f, k) => {
				const cx = x + w * f;
				const c = ['#B794F6', '#FF8FA3'][k];
				return (
					<g key={k}>
						<rect x={cx - 3} y={SHOP_TOP + 210} width={6} height={150} fill="#9AA3BF" />
						<ellipse cx={cx} cy={SHOP_TOP + 358} rx={30} ry={7} fill="#9AA3BF" />
						<path d={`M${cx - 34} ${SHOP_TOP + 96} Q${cx} ${SHOP_TOP + 80} ${cx + 34} ${SHOP_TOP + 96} L${cx + 30} ${SHOP_TOP + 150} Q${cx + 44} ${SHOP_TOP + 200} ${cx + 40} ${SHOP_TOP + 220} L${cx - 40} ${SHOP_TOP + 220} Q${cx - 44} ${SHOP_TOP + 200} ${cx - 30} ${SHOP_TOP + 150} Z`} fill={c} stroke="#121528" strokeWidth={2} />
						<rect x={cx - 8} y={SHOP_TOP + 70} width={16} height={18} rx={4} fill="#E3E6F2" />
					</g>
				);
			})}
		</g>
	);
};

/** Holzplatte mit Maserung, Kanten und Schrauben. Wird per Feder von oben eingesetzt. */
const Board: React.FC<{x: number; y: number; w: number; h: number; grainId: string; t: number; screws: number; seed: string}> = ({x, y, w, h, grainId, t, screws, seed}) => {
	const dy = (1 - t) * -(h + 120);
	const rot = (1 - t) * (random(`${seed}-r`) > 0.5 ? 6 : -6);
	const corners: Array<[number, number]> = [
		[x + 18, y + 18],
		[x + w - 18, y + 18],
		[x + 18, y + h - 18],
		[x + w - 18, y + h - 18],
		[x + w / 2, y + h / 2],
	];
	return (
		<g transform={`translate(0 ${dy}) rotate(${rot} ${x + w / 2} ${y + h / 2})`}>
			{/* Schlagschatten auf Glas/Rahmen */}
			<rect x={x + 10} y={y + 12} width={w} height={h} rx={4} fill="#000000" opacity={0.35 * t} />
			<rect x={x} y={y} width={w} height={h} rx={4} fill={`url(#${grainId})`} />
			{/* Kantenlicht + Plattenfuge */}
			<rect x={x} y={y} width={w} height={h} rx={4} fill="none" stroke="#7A4A22" strokeWidth={5} />
			<rect x={x + 3} y={y + 3} width={w - 6} height={4} fill="#F5D3A0" opacity={0.6} />
			<line x1={x} y1={y + h * 0.52} x2={x + w} y2={y + h * 0.52} stroke="#8A5A2E" strokeWidth={3} opacity={0.7} />
			{corners.map(([cx, cy], k) => {
				const on = interpolate(screws, [k * 0.2, k * 0.2 + 0.2], [0, 1], clamp);
				return on > 0 ? (
					<g key={k} transform={`translate(${cx} ${cy}) scale(${on}) rotate(${on * 220})`}>
						<circle r={8} fill="#5A5E70" stroke="#2A2C38" strokeWidth={2} />
						<path d="M-5 0 H5 M0 -5 V5" stroke="#1C1E28" strokeWidth={2} />
					</g>
				) : null;
			})}
		</g>
	);
};

export type StorefrontProps = {
	width: number;
	label?: string;
	motif?: Motif;
	panes?: number;
	/** Frame, ab dem die Holzplatten eingesetzt werden (undefined = nie). */
	boardFrom?: number;
	boardStagger?: number;
	seed?: string;
	/** 0–1: Innenbeleuchtung. */
	light?: number;
	/** Oberes Geschoss mit zeigen. */
	upper?: boolean;
	style?: React.CSSProperties;
};

/**
 * Detaillierte, generische Ladenfront (Illustration, keine reale Fassade/Marke): Gesims, Obergeschoss,
 * beleuchtetes Ladenschild, Markise, Schaufenster mit Auslage und Spiegelungen; optional Holzplatten
 * mit Maserung, Schrauben und Schatten.
 */
export const Storefront: React.FC<StorefrontProps> = ({width, label = 'STORE', motif = 'shoe', panes = 3, boardFrom, boardStagger = 6, seed = 'shop', light = 1, upper = true, style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const id = useSvgId('shopfront');
	const top = upper ? 0 : 300;
	const vbH = VB_H - top;
	const height = (width * vbH) / VB_W;
	const innerX = 50;
	const innerW = VB_W - 100;
	const gap = 18;
	const paneW = (innerW - gap * (panes - 1)) / panes;
	const flicker = 0.92 + Math.sin(frame / 7) * 0.03;

	return (
		<svg width={width} height={height} viewBox={`0 ${top} ${VB_W} ${vbH}`} style={{overflow: 'visible', ...style}}>
			<defs>
				<linearGradient id={`${id}-stone`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#3A3F66" />
					<stop offset="1" stopColor="#262A4C" />
				</linearGradient>
				<linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stopColor="#FFE7B8" stopOpacity={0.95 * light} />
					<stop offset="0.6" stopColor="#F7C98A" stopOpacity={0.85 * light} />
					<stop offset="1" stopColor="#9A6A48" stopOpacity={0.9} />
				</linearGradient>
				<linearGradient id={`${id}-refl`} x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor="#FFFFFF" stopOpacity={0} />
					<stop offset="0.5" stopColor="#FFFFFF" stopOpacity={0.28} />
					<stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
				</linearGradient>
				<pattern id={`${id}-grain`} width={160} height={220} patternUnits="userSpaceOnUse">
					<rect width={160} height={220} fill="#D7A86E" />
					{new Array(14).fill(true).map((_, k) => {
						const yy = k * 16 + random(`${seed}-g-${k}`) * 6;
						return <path key={k} d={`M0 ${yy} C40 ${yy - 6} 80 ${yy + 7} 160 ${yy + 1}`} stroke="#A8743E" strokeWidth={1.4 + random(`${seed}-gw-${k}`) * 1.4} fill="none" opacity={0.45} />;
					})}
					<ellipse cx={52} cy={88} rx={9} ry={5} fill="#9A6634" opacity={0.6} />
					<ellipse cx={52} cy={88} rx={16} ry={9} fill="none" stroke="#A8743E" strokeWidth={1.4} opacity={0.5} />
					<ellipse cx={122} cy={172} rx={7} ry={4} fill="#9A6634" opacity={0.55} />
				</pattern>
				<radialGradient id={`${id}-spot`}>
					<stop offset="0" stopColor="#FFF2CF" stopOpacity={0.7} />
					<stop offset="1" stopColor="#FFF2CF" stopOpacity={0} />
				</radialGradient>
			</defs>

			{/* Obergeschoss */}
			{upper ? (
				<g>
					<rect x={0} y={20} width={VB_W} height={300} fill={`url(#${id}-stone)`} />
					<rect x={-10} y={0} width={VB_W + 20} height={30} rx={4} fill="#4A5080" />
					<rect x={-10} y={28} width={VB_W + 20} height={8} fill="#1C2040" opacity={0.6} />
					{[110, 330, 550].map((wx) => (
						<g key={wx}>
							<rect x={wx - 8} y={78} width={156} height={190} rx={8} fill="#1A1E3A" />
							<rect x={wx} y={86} width={140} height={174} rx={4} fill={withAlpha('#FFC874', 0.55 * flicker)} />
							<path d={`M${wx} 86 h140 v24 q-70 26 -140 0 z`} fill="#7A3A4A" opacity={0.7} />
							<line x1={wx + 70} y1={86} x2={wx + 70} y2={260} stroke="#1A1E3A" strokeWidth={6} />
							<line x1={wx} y1={170} x2={wx + 140} y2={170} stroke="#1A1E3A" strokeWidth={6} />
							<rect x={wx - 16} y={262} width={172} height={12} rx={3} fill="#4A5080" />
						</g>
					))}
				</g>
			) : null}

			{/* Ladenschild */}
			<rect x={20} y={320} width={VB_W - 40} height={84} rx={10} fill="#0B0E22" stroke="#4A5080" strokeWidth={4} />
			<text x={VB_W / 2} y={378} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={900} fontSize={46} letterSpacing={10} fill="#FFD23F" style={{filter: 'drop-shadow(0 0 10px rgba(255,210,63,0.6))'}}>
				{label}
			</text>
			{[160, 400, 640].map((sx) => (
				<g key={sx}>
					<rect x={sx - 10} y={308} width={20} height={12} rx={3} fill="#1A1E3A" />
					<ellipse cx={sx} cy={360} rx={90} ry={60} fill={`url(#${id}-spot)`} opacity={0.35} />
				</g>
			))}

			{/* Markise (gestreift, gewellte Kante) */}
			<path
				d={`M10 404 H${VB_W - 10} L${VB_W - 26} 444 ${new Array(10)
					.fill(true)
					.map((_, k) => {
						const x0 = VB_W - 26 - k * ((VB_W - 52) / 10);
						return `Q${x0 - (VB_W - 52) / 20} 458 ${x0 - (VB_W - 52) / 10} 444`;
					})
					.join(' ')} Z`}
				fill="#1F2F66"
			/>
			{new Array(10).fill(true).map((_, k) => (
				<path key={k} d={`M${26 + k * 75.6} 404 h37.8 l-2 40 h-37.8 z`} fill="#E9ECF8" opacity={0.85} />
			))}

			{/* Schaufensterzone */}
			<rect x={20} y={SHOP_TOP - 8} width={VB_W - 40} height={SHOP_BOTTOM - SHOP_TOP + 16} rx={6} fill="#14183A" />
			{new Array(panes).fill(true).map((_, i) => {
				const x = innerX + i * (paneW + gap);
				return (
					<g key={i}>
						<rect x={x} y={SHOP_TOP} width={paneW} height={SHOP_BOTTOM - SHOP_TOP} rx={4} fill={`url(#${id}-glass)`} />
						<rect x={x} y={SHOP_TOP} width={paneW} height={40} fill="#FFF6DE" opacity={0.25 * light} />
						<Display x={x} w={paneW} motif={motif} seed={`${seed}-${i}`} />
						{/* Spiegelungen */}
						<path d={`M${x + 20} ${SHOP_BOTTOM} L${x + paneW * 0.55} ${SHOP_TOP} L${x + paneW * 0.7} ${SHOP_TOP} L${x + 60} ${SHOP_BOTTOM} Z`} fill={`url(#${id}-refl)`} />
						<path d={`M${x + paneW * 0.6} ${SHOP_BOTTOM} L${x + paneW} ${SHOP_TOP + 120} L${x + paneW} ${SHOP_TOP + 170} L${x + paneW * 0.7} ${SHOP_BOTTOM} Z`} fill="#FFFFFF" opacity={0.08} />
						<rect x={x} y={SHOP_TOP} width={paneW} height={SHOP_BOTTOM - SHOP_TOP} rx={4} fill="none" stroke="#B9C2DE" strokeWidth={5} />
					</g>
				);
			})}

			{/* Sockel + Gehweg mit Lichtspiegelung */}
			<rect x={10} y={SHOP_BOTTOM} width={VB_W - 20} height={30} rx={4} fill="#2E3358" />
			<rect x={-40} y={SHOP_BOTTOM + 30} width={VB_W + 80} height={30} fill="#171A33" />
			<ellipse cx={VB_W / 2} cy={SHOP_BOTTOM + 44} rx={VB_W * 0.45} ry={12} fill="#FFD9A0" opacity={0.18 * light} />

			{/* Holzplatten */}
			{boardFrom !== undefined
				? new Array(panes).fill(true).map((_, i) => {
						const at = boardFrom + i * boardStagger;
						if (frame < at) return null;
						const t = springIn({frame, fps, delay: at, damping: 13, stiffness: 170});
						const screws = interpolate(frame, [at + 6, at + 18], [0, 1], clamp);
						const x = innerX + i * (paneW + gap);
						return <Board key={i} x={x - 8} y={SHOP_TOP - 8} w={paneW + 16} h={SHOP_BOTTOM - SHOP_TOP + 16} grainId={`${id}-grain`} t={t} screws={screws} seed={`${seed}-b-${i}`} />;
					})
				: null}
		</svg>
	);
};
