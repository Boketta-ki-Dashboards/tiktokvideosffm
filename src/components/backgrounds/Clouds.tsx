import React, {useMemo} from 'react';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';

export type CloudsProps = {
	count?: number;
	seed?: string;
	color?: string;
	opacity?: number;
	/** Pixel pro Frame. */
	speed?: number;
	/** Vertikaler Bereich [von, bis] als Anteil der Höhe. */
	band?: [number, number];
};

/** Weiche, langsam ziehende Wolkenbänder aus überlagerten Ellipsen. */
export const Clouds: React.FC<CloudsProps> = ({
	count = 7,
	seed = 'clouds',
	color = '#FFFFFF',
	opacity = 0.12,
	speed = 0.35,
	band = [0.08, 0.45],
}) => {
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();

	const clouds = useMemo(
		() =>
			new Array(count).fill(true).map((_, i) => {
				const w = 260 + random(`${seed}-w-${i}`) * 420;
				return {
					x: random(`${seed}-x-${i}`) * (width + w) - w / 2,
					y: (band[0] + random(`${seed}-y-${i}`) * (band[1] - band[0])) * height,
					w,
					h: w * (0.18 + random(`${seed}-h-${i}`) * 0.12),
					depth: 0.4 + random(`${seed}-d-${i}`) * 0.9,
				};
			}),
		[count, seed, width, height, band],
	);

	return (
		<AbsoluteFill style={{opacity}}>
			<svg width={width} height={height}>
				<defs>
					<filter id="cloud-blur" x="-20%" y="-50%" width="140%" height="200%">
						<feGaussianBlur stdDeviation="18" />
					</filter>
				</defs>
				<g filter="url(#cloud-blur)">
					{clouds.map((c, i) => {
						const span = width + c.w * 2;
						const x = ((c.x + frame * speed * c.depth) % span) - c.w;
						return (
							<g key={i} transform={`translate(${x} ${c.y})`}>
								<ellipse cx={0} cy={0} rx={c.w / 2} ry={c.h / 2} fill={color} />
								<ellipse cx={c.w * 0.18} cy={-c.h * 0.35} rx={c.w * 0.26} ry={c.h * 0.45} fill={color} />
								<ellipse cx={-c.w * 0.2} cy={-c.h * 0.2} rx={c.w * 0.2} ry={c.h * 0.35} fill={color} />
							</g>
						);
					})}
				</g>
			</svg>
		</AbsoluteFill>
	);
};
