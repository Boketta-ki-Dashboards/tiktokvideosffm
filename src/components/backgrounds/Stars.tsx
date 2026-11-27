import React, {useMemo} from 'react';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';

export type StarsProps = {
	count?: number;
	seed?: string;
	/** Nur im oberen Bereich (0–1 der Höhe). */
	maxY?: number;
	opacity?: number;
	color?: string;
};

/** Funkelnder Sternenhimmel – deterministisch über `seed`. */
export const Stars: React.FC<StarsProps> = ({
	count = 120,
	seed = 'stars',
	maxY = 0.55,
	opacity = 1,
	color = '#FFFFFF',
}) => {
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();

	const stars = useMemo(
		() =>
			new Array(count).fill(true).map((_, i) => ({
				x: random(`${seed}-x-${i}`) * width,
				y: random(`${seed}-y-${i}`) ** 1.4 * height * maxY,
				r: 0.8 + random(`${seed}-r-${i}`) * 2.2,
				speed: 0.04 + random(`${seed}-s-${i}`) * 0.12,
				phase: random(`${seed}-p-${i}`) * Math.PI * 2,
			})),
		[count, seed, width, height, maxY],
	);

	return (
		<AbsoluteFill style={{opacity}}>
			<svg width={width} height={height}>
				{stars.map((s, i) => (
					<circle
						key={i}
						cx={s.x}
						cy={s.y}
						r={s.r}
						fill={color}
						opacity={0.35 + 0.65 * (0.5 + 0.5 * Math.sin(frame * s.speed + s.phase))}
					/>
				))}
			</svg>
		</AbsoluteFill>
	);
};
