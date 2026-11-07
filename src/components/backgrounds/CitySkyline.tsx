import React, {useMemo} from 'react';
import {random, useCurrentFrame} from 'remotion';
import {FlickerWindows, makeWindows, StaticWindows} from './windows';

export type SkylineLayer = {
	count: number;
	minHeight: number;
	maxHeight: number;
	color: string;
	/** 0 = keine Fenster. */
	litRatio: number;
	/** Parallaxe-Faktor relativ zu `cameraX` (0 = fix, 1 = volle Bewegung). */
	parallax: number;
	minWidth?: number;
	maxWidth?: number;
};

export type CitySkylineProps = {
	seed?: string;
	width?: number;
	height?: number;
	/** y-Position der Straßenlinie im SVG. */
	groundY?: number;
	layers?: SkylineLayer[];
	/** Horizontale Kamerabewegung in px (für Parallaxe). */
	cameraX?: number;
	style?: React.CSSProperties;
};

const DEFAULT_LAYERS: SkylineLayer[] = [
	{count: 26, minHeight: 160, maxHeight: 420, color: '#1B2453', litRatio: 0, parallax: 0.25},
	{count: 20, minHeight: 120, maxHeight: 360, color: '#18204A', litRatio: 0.22, parallax: 0.55},
	{count: 14, minHeight: 80, maxHeight: 260, color: '#10163A', litRatio: 0.3, parallax: 1, minWidth: 90, maxWidth: 170},
];

type Roof = 'flat' | 'antenna' | 'spire' | 'step' | 'slant';
const ROOFS: Roof[] = ['flat', 'flat', 'antenna', 'spire', 'step', 'slant'];

/**
 * Generische, prozedural erzeugte 2D-Stadt (beliebige Städte, deterministisch per Seed).
 * Für bekannte Städte eigene Skyline-Komponenten bauen (siehe FrankfurtSkyline).
 */
export const CitySkyline: React.FC<CitySkylineProps> = ({
	seed = 'city',
	width = 1080,
	height = 700,
	groundY = 680,
	layers = DEFAULT_LAYERS,
	cameraX = 0,
	style,
}) => {
	const frame = useCurrentFrame();
	const built = useMemo(
		() =>
			layers.map((layer, li) => {
				const minW = layer.minWidth ?? 60;
				const maxW = layer.maxWidth ?? 140;
				const span = width * 1.6;
				const buildings = new Array(layer.count).fill(true).map((_, i) => {
					const w = minW + random(`${seed}-${li}-w-${i}`) * (maxW - minW);
					const h = layer.minHeight + random(`${seed}-${li}-h-${i}`) ** 1.3 * (layer.maxHeight - layer.minHeight);
					const x = -width * 0.3 + (i / layer.count) * span + random(`${seed}-${li}-x-${i}`) * 30;
					const roof = ROOFS[Math.floor(random(`${seed}-${li}-r-${i}`) * ROOFS.length)];
					return {x, w, h, roof};
				});
				const windows = layer.litRatio
					? buildings.flatMap((b, i) =>
							makeWindows({x: b.x, y: groundY - b.h, w: b.w, h: b.h, seed: `${seed}-${li}-${i}`, litRatio: layer.litRatio}),
						)
					: [];
				return {layer, buildings, windows};
			}),
		[layers, seed, width, groundY],
	);

	return (
		<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={style}>
			{built.map(({layer, buildings, windows}, li) => (
				<g key={li} transform={`translate(${-cameraX * layer.parallax} 0)`}>
					{buildings.map((b, i) => {
						const top = groundY - b.h;
						return (
							<g key={i} fill={layer.color}>
								<rect x={b.x} y={top} width={b.w} height={b.h} />
								{b.roof === 'antenna' ? <rect x={b.x + b.w / 2 - 2} y={top - 50} width={4} height={50} /> : null}
								{b.roof === 'spire' ? (
									<polygon points={`${b.x + b.w * 0.3},${top} ${b.x + b.w / 2},${top - 70} ${b.x + b.w * 0.7},${top}`} />
								) : null}
								{b.roof === 'step' ? (
									<>
										<rect x={b.x + b.w * 0.12} y={top - 24} width={b.w * 0.76} height={24} />
										<rect x={b.x + b.w * 0.3} y={top - 44} width={b.w * 0.4} height={20} />
									</>
								) : null}
								{b.roof === 'slant' ? <polygon points={`${b.x},${top} ${b.x + b.w},${top - 36} ${b.x + b.w},${top}`} /> : null}
							</g>
						);
					})}
					<StaticWindows windows={windows} />
					<FlickerWindows windows={windows} frame={frame} seed={`${seed}-${li}`} />
				</g>
			))}
		</svg>
	);
};
