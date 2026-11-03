import React, {useMemo} from 'react';
import {random} from 'remotion';
import {shade} from '../../lib/color';

export type StreetFacadesProps = {
	width?: number;
	/** y der Bordsteinkante. */
	groundY?: number;
	seed?: string;
	colors?: string[];
	/** Anteil leuchtender Schaufenster. */
	litShops?: number;
	/** Anzahl verbarrikadierter Schaufenster (Holzplatten). */
	boarded?: number;
};

/**
 * Häuserzeile einer Einkaufsstraße bei Nacht (Schaufenster, Markisen, Obergeschosse).
 * Verbarrikadierte Fenster greifen belegte Berichte auf („Geschäfte verbarrikadierten ihre Schaufenster“).
 */
export const StreetFacades: React.FC<StreetFacadesProps> = ({
	width = 1080,
	groundY = 1500,
	seed = 'street',
	colors = ['#20264F', '#262B57', '#1B2046', '#2C2F5E'],
	litShops = 0.5,
	boarded = 2,
}) => {
	const houses = useMemo(() => {
		const out: Array<{x: number; w: number; h: number; color: string; lit: boolean; boarded: boolean; floors: number}> = [];
		let x = -20;
		let i = 0;
		while (x < width + 20) {
			const w = 190 + random(`${seed}-w-${i}`) * 90;
			const floors = 3 + Math.floor(random(`${seed}-f-${i}`) * 3);
			out.push({
				x,
				w,
				h: 170 + floors * 120,
				color: colors[i % colors.length],
				lit: random(`${seed}-l-${i}`) < litShops,
				boarded: false,
				floors,
			});
			x += w + 6;
			i++;
		}

		for (let b = 0; b < boarded && b < out.length; b++) {
			out[(b * 2 + 1) % out.length].boarded = true;
		}

		return out;
	}, [width, seed, colors, litShops, boarded]);

	return (
		<g>
			{houses.map((h, i) => {
				const top = groundY - h.h;
				const shopTop = groundY - 170;
				return (
					<g key={i}>
						<rect x={h.x} y={top} width={h.w} height={h.h} fill={h.color} />
						<rect x={h.x} y={top} width={h.w} height={10} fill={shade(h.color, 1.25)} />
						{/* Obergeschoss-Fenster */}
						{new Array(h.floors).fill(true).map((_, f) =>
							new Array(3).fill(true).map((__, c) => {
								const lit = random(`${seed}-win-${i}-${f}-${c}`) < 0.3;
								return (
									<rect
										key={`${f}-${c}`}
										x={h.x + 22 + c * ((h.w - 44) / 3)}
										y={top + 34 + f * 120}
										width={(h.w - 44) / 3 - 18}
										height={70}
										rx={4}
										fill={lit ? '#FFD98A' : shade(h.color, 0.6)}
										opacity={lit ? 0.85 : 1}
									/>
								);
							}),
						)}
						{/* Markise */}
						<path d={`M ${h.x + 6} ${shopTop - 10} h ${h.w - 12} l 16 34 h ${-(h.w + 20)} z`} fill={shade(h.color, 0.7)} />
						{/* Schaufenster */}
						<rect
							x={h.x + 14}
							y={shopTop + 30}
							width={h.w - 28}
							height={128}
							rx={6}
							fill={h.boarded ? '#8A6A45' : h.lit ? '#FFE6A8' : shade(h.color, 0.45)}
							opacity={h.lit && !h.boarded ? 0.75 : 1}
						/>
						{h.boarded
							? new Array(4).fill(true).map((_, k) => (
									<rect key={k} x={h.x + 14} y={shopTop + 34 + k * 31} width={h.w - 28} height={4} fill="#5E4630" />
								))
							: null}
					</g>
				);
			})}
			<rect x={0} y={groundY} width={width} height={14} fill="#3A3F6B" />
		</g>
	);
};
