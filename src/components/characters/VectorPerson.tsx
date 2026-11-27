import React from 'react';
import {shade} from '../../lib/color';

export type PersonPalette = {
	skin: string;
	shirt: string;
	pants: string;
	hair: string;
	shoes?: string;
};

export type SignSpec = {
	/** Symbol auf dem Schild – bewusst ohne erfundene Parolen. */
	icon: 'book' | 'euro' | 'heart' | 'none';
	color?: string;
	text?: string;
};

export type VectorPersonProps = {
	/** Fußposition. */
	x?: number;
	y?: number;
	/** Gesamthöhe in px. */
	height?: number;
	palette: PersonPalette;
	hair?: 'short' | 'long' | 'bun' | 'cap' | 'hood';
	/** Gehzyklus in Radiant (z. B. frame * 0.25). null = stehend. */
	walkPhase?: number | null;
	/** Arm hochreißen (Jubel/Ruf) 0–1. */
	cheer?: number;
	sign?: SignSpec | null;
	facing?: 1 | -1;
	opacity?: number;
};

const deg = (r: number) => (r * 180) / Math.PI;

const SignIcon: React.FC<{icon: SignSpec['icon']; color: string}> = ({icon, color}) => {
	switch (icon) {
		case 'book':
			return (
				<g fill="none" stroke={color} strokeWidth={3.2} strokeLinejoin="round">
					<path d="M -14 -6 q 7 -4 14 0 q 7 -4 14 0 v 16 q -7 -4 -14 0 q -7 -4 -14 0 z" />
					<line x1={0} y1={-6} x2={0} y2={10} />
				</g>
			);
		case 'euro':
			return (
				<text x={0} y={9} textAnchor="middle" fontSize={26} fontWeight={900} fill={color} fontFamily="Montserrat, sans-serif">
					€
				</text>
			);
		case 'heart':
			return <path d="M 0 10 C -18 -2 -10 -14 0 -6 C 10 -14 18 -2 0 10 Z" fill={color} />;
		default:
			return null;
	}
};

/**
 * Einfache, freundliche Vektorfigur (100 Einheiten hoch, Füße bei 0/0) mit Gehzyklus.
 * Bewusst stilisiert/anonym – keine realen Personen darstellen.
 */
export const VectorPerson: React.FC<VectorPersonProps> = ({
	x = 0,
	y = 0,
	height = 160,
	palette,
	hair = 'short',
	walkPhase = null,
	cheer = 0,
	sign = null,
	facing = 1,
	opacity = 1,
}) => {
	const s = height / 100;
	const walking = walkPhase !== null;
	const swing = walking ? Math.sin(walkPhase) : 0;
	const bob = walking ? Math.abs(Math.cos(walkPhase)) * 2 : 0;
	const legA = swing * 0.45;
	const armA = -swing * 0.5;
	const shoes = palette.shoes ?? '#0B0F22';

	// Schild wird mit dem vorderen Arm hochgehalten
	const signArm = sign ? Math.PI * 0.92 : cheer * Math.PI * 0.85 + armA * (1 - cheer);

	return (
		<g transform={`translate(${x} ${y}) scale(${s * facing} ${s})`} opacity={opacity}>
			<g transform={`translate(0 ${-bob})`}>
				{/* Beine */}
				<g stroke={palette.pants} strokeWidth={10} strokeLinecap="round">
					<line x1={-4} y1={-44} x2={-4} y2={-4} transform={`rotate(${deg(legA)} -4 -44)`} />
					<line x1={4} y1={-44} x2={4} y2={-4} transform={`rotate(${deg(-legA)} 4 -44)`} />
				</g>
				<g fill={shoes}>
					<ellipse cx={-4} cy={-1} rx={7} ry={3.5} transform={`rotate(${deg(legA)} -4 -44)`} />
					<ellipse cx={4} cy={-1} rx={7} ry={3.5} transform={`rotate(${deg(-legA)} 4 -44)`} />
				</g>

				{/* hinterer Arm */}
				<line
					x1={-8}
					y1={-72}
					x2={-8}
					y2={-44}
					strokeWidth={8}
					strokeLinecap="round"
					transform={`rotate(${deg(-armA)} -8 -72)`}
					stroke={shade(palette.shirt, 0.78)}
				/>

				{/* Oberkörper */}
				<rect x={-14} y={-80} width={28} height={40} rx={11} fill={palette.shirt} />

				{/* Kopf + Haare */}
				<rect x={-3.5} y={-84} width={7} height={6} fill={palette.skin} />
				<circle cx={0} cy={-91} r={10} fill={palette.skin} />
				{hair === 'short' ? <path d="M -10 -92 a 10 10 0 0 1 20 0 q -6 -5 -20 0 z" fill={palette.hair} /> : null}
				{hair === 'long' ? (
					<path d="M -11 -90 a 11 11 0 0 1 22 0 v 14 q -4 2 -6 -4 v -9 h -10 v 9 q -2 6 -6 4 z" fill={palette.hair} />
				) : null}
				{hair === 'bun' ? (
					<>
						<path d="M -10 -92 a 10 10 0 0 1 20 0 q -10 -4 -20 0 z" fill={palette.hair} />
						<circle cx={-4} cy={-103} r={5} fill={palette.hair} />
					</>
				) : null}
				{hair === 'cap' ? (
					<path d="M -10 -93 a 10 10 0 0 1 20 0 h 7 v 3 h -27 z" fill={palette.hair} />
				) : null}
				{hair === 'hood' ? <path d="M -12 -84 v -8 a 12 12 0 0 1 24 0 v 8 q -12 -6 -24 0 z" fill={palette.shirt} /> : null}

				{/* vorderer Arm (optional mit Schild) */}
				<g transform={`rotate(${deg(signArm)} 8 -72)`}>
					<line x1={8} y1={-72} x2={8} y2={-44} stroke={palette.shirt} strokeWidth={8} strokeLinecap="round" />
					<circle cx={8} cy={-42} r={4.2} fill={palette.skin} />
				</g>
				{sign ? (
					<g transform="translate(10 -112)">
						<rect x={-1.5} y={-8} width={3} height={50} fill="#C9A06A" />
						<rect x={-26} y={-44} width={52} height={38} rx={4} fill="#F5F1E6" stroke="#0B0F22" strokeWidth={1.5} />
						<g transform="translate(0 -25)">
							<SignIcon icon={sign.icon} color={sign.color ?? '#E23B4E'} />
							{sign.text ? (
								<text y={8} textAnchor="middle" fontSize={11} fontWeight={900} fill={sign.color ?? '#111'} fontFamily="Montserrat, sans-serif">
									{sign.text}
								</text>
							) : null}
						</g>
					</g>
				) : null}
			</g>
		</g>
	);
};
