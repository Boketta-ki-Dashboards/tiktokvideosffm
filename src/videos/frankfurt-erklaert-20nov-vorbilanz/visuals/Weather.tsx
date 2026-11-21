import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';

/**
 * Dauerregen (laut hessenschau und t-online am 20.11. den ganzen Tag) als dezente, deterministische Strich-Ebene.
 * Rein atmosphärisch – keine Aussage über einzelne Orte oder Uhrzeiten.
 */
export const Rain: React.FC<{n?: number; opacity?: number; seed?: string; angle?: number; speed?: number}> = ({n = 70, opacity = 0.28, seed = 'rain', angle = 12, speed = 38}) => {
	const frame = useCurrentFrame();
	const W = 1080;
	const H = 1920;
	const dx = Math.tan((angle * Math.PI) / 180);
	return (
		<AbsoluteFill style={{pointerEvents: 'none', opacity}}>
			<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
				{new Array(n).fill(0).map((_, i) => {
					const len = 40 + random(`${seed}-l${i}`) * 50;
					const v = speed * (0.75 + random(`${seed}-v${i}`) * 0.5);
					const y0 = random(`${seed}-y${i}`) * (H + 200);
					const y = ((y0 + frame * v) % (H + 200)) - 100;
					const x = random(`${seed}-x${i}`) * (W + 200) - 100 - y * dx;
					const w = 1.4 + random(`${seed}-w${i}`) * 1.6;
					return <line key={i} x1={x} y1={y} x2={x - len * dx} y2={y - len} stroke="#CFE0FF" strokeWidth={w} strokeLinecap="round" opacity={0.5 + random(`${seed}-o${i}`) * 0.5} />;
				})}
			</svg>
		</AbsoluteFill>
	);
};
