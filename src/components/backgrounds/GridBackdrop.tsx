import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {withAlpha} from '../../lib/color';
import {COLORS} from '../../theme/tokens';

export type GridBackdropProps = {
	/** Akzentfarbe des Leuchtens und der Partikel. */
	accent?: string;
	/** Farbverlauf von oben nach unten. */
	stops?: [string, string];
	particles?: number;
	seed?: string;
	/** Rasterabstand in px. */
	gridSize?: number;
};

/** Ruhiger Nacht-Hintergrund mit langsam wanderndem Raster, Glow und Partikeln – Bewegung in jeder Szene. */
export const GridBackdrop: React.FC<GridBackdropProps> = ({accent = COLORS.cyan, stops = ['#0A1030', '#05081A'], particles = 26, seed = 'grid', gridSize = 90}) => {
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();
	const dots = useMemo(
		() =>
			new Array(particles).fill(0).map((_, i) => ({
				x: random(`${seed}-x-${i}`) * width,
				y: random(`${seed}-y-${i}`) * height,
				r: 2 + random(`${seed}-r-${i}`) * 5,
				v: 0.25 + random(`${seed}-v-${i}`) * 0.7,
				ph: random(`${seed}-p-${i}`) * Math.PI * 2,
			})),
		[particles, seed, width, height],
	);
	const drift = (frame * 0.35) % gridSize;
	const glow = 0.5 + 0.5 * Math.sin(frame * 0.03);
	return (
		<AbsoluteFill style={{background: `linear-gradient(180deg, ${stops[0]}, ${stops[1]})`}}>
			<AbsoluteFill
				style={{
					backgroundImage: `linear-gradient(${withAlpha(accent, 0.07)} 2px, transparent 2px), linear-gradient(90deg, ${withAlpha(accent, 0.07)} 2px, transparent 2px)`,
					backgroundSize: `${gridSize}px ${gridSize}px`,
					backgroundPosition: `${drift}px ${drift}px`,
					maskImage: 'radial-gradient(ellipse at 50% 38%, #000 0%, transparent 72%)',
				}}
			/>
			<AbsoluteFill style={{background: `radial-gradient(circle at 50% 30%, ${withAlpha(accent, 0.12 + glow * 0.08)}, transparent 55%)`}} />
			<svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
				{dots.map((d, i) => {
					const y = (d.y - frame * d.v + height * 4) % height;
					const o = 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(frame * 0.05 + d.ph));
					return <circle key={i} cx={d.x + Math.sin(frame * 0.02 + d.ph) * 12} cy={y} r={d.r} fill={withAlpha(accent, o)} />;
				})}
			</svg>
			<AbsoluteFill style={{background: `linear-gradient(0deg, rgba(5,8,26,${interpolate(frame, [0, 1], [0.35, 0.35])}), transparent 35%)`}} />
		</AbsoluteFill>
	);
};
