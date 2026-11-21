import React, {useMemo} from 'react';
import {random, useCurrentFrame} from 'remotion';
import {shade} from '../../lib/color';
import {type PersonPalette, type SignSpec, VectorPerson, type VectorPersonProps} from './VectorPerson';

const SKIN = ['#F2C9A5', '#E0A982', '#C68863', '#9C6644', '#7A4E33', '#F6D7BE'];
const SHIRTS = ['#3DD9EB', '#FFD23F', '#FF4D5E', '#8B5CF6', '#34D399', '#F97316', '#E5E7EB', '#2563EB', '#111827'];
const PANTS = ['#1F2937', '#334155', '#1E3A8A', '#3F3F46', '#111827'];
const HAIR = ['#1C1917', '#3B2A1E', '#6B4226', '#C08A3E', '#E6C27A', '#7F1D1D'];
const STYLES: NonNullable<VectorPersonProps['hair']>[] = ['short', 'long', 'bun', 'cap', 'hood', 'short'];

export type CrowdProps = {
	width: number;
	/** y der vordersten Reihe (Füße). */
	baseY: number;
	rows?: number;
	perRow?: number;
	seed?: string;
	/** Höhe einer Figur in der vordersten Reihe. */
	personHeight?: number;
	/** px pro Frame (positiv = nach rechts). */
	marchSpeed?: number;
	signRatio?: number;
	signs?: SignSpec[];
	/** Silhouetten-Abdunklung hinterer Reihen (0–1). */
	depthFade?: number;
	opacity?: number;
};

/** Menschenmenge aus Vektorfiguren mit Tiefenstaffelung und Marschbewegung. */
export const Crowd: React.FC<CrowdProps> = ({
	width,
	baseY,
	rows = 4,
	perRow = 12,
	seed = 'crowd',
	personHeight = 170,
	marchSpeed = 1.2,
	signRatio = 0.25,
	signs = [{icon: 'book'}, {icon: 'euro', color: '#1D4ED8'}, {icon: 'heart'}],
	depthFade = 0.5,
	opacity = 1,
}) => {
	const frame = useCurrentFrame();

	const people = useMemo(() => {
		const out: Array<{
			row: number;
			x: number;
			palette: PersonPalette;
			hair: NonNullable<VectorPersonProps['hair']>;
			sign: SignSpec | null;
			phase: number;
			speed: number;
		}> = [];
		for (let r = rows - 1; r >= 0; r--) {
			for (let i = 0; i < perRow; i++) {
				const k = `${seed}-${r}-${i}`;
				const pick = <T,>(arr: T[], salt: string) => arr[Math.floor(random(`${k}-${salt}`) * arr.length)];
				out.push({
					row: r,
					x: (i + random(`${k}-x`) * 0.7) * ((width * 1.4) / perRow),
					palette: {skin: pick(SKIN, 's'), shirt: pick(SHIRTS, 'sh'), pants: pick(PANTS, 'p'), hair: pick(HAIR, 'h')},
					hair: pick(STYLES, 'st'),
					sign: random(`${k}-sign`) < signRatio ? pick(signs, 'sg') : null,
					phase: random(`${k}-ph`) * Math.PI * 2,
					speed: 0.22 + random(`${k}-sp`) * 0.06,
				});
			}
		}

		return out;
	}, [rows, perRow, seed, width, signRatio, signs]);

	const span = width * 1.4;

	return (
		<g opacity={opacity}>
			{people.map((p, i) => {
				const depth = 1 - p.row * 0.16;
				const h = personHeight * depth;
				const y = baseY - p.row * personHeight * 0.22;
				const x = ((((p.x + frame * marchSpeed * depth) % span) + span) % span) - width * 0.2;
				const fade = 1 - (p.row / Math.max(1, rows - 1)) * depthFade;
				const palette: PersonPalette =
					fade < 1
						? {
								skin: shade(p.palette.skin, fade),
								shirt: shade(p.palette.shirt, fade),
								pants: shade(p.palette.pants, fade),
								hair: shade(p.palette.hair, fade),
							}
						: p.palette;
				return (
					<g key={i}>
						<VectorPerson
							x={x}
							y={y}
							height={h}
							palette={palette}
							hair={p.hair}
							sign={p.sign}
							walkPhase={marchSpeed === 0 ? null : frame * p.speed + p.phase}
						/>
					</g>
				);
			})}
		</g>
	);
};
