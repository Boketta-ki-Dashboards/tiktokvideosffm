import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, EASE_OUT, springIn} from '../../lib/animation';
import {shade, withAlpha} from '../../lib/color';
import {COLORS, FONTS, RADII, SHADOWS} from '../../theme/tokens';

export type CalendarCardProps = {
	day: number;
	month?: string;
	year?: string;
	weekday?: string;
	/** Statusfarbe (Kopfband, Rahmen, Etikett). */
	color: string;
	/** Etikett unter dem Datum, z. B. „UNBESTÄTIGT“. */
	status?: string;
	/** Frame, ab dem die Karte ins Bild fliegt. */
	delay?: number;
	/** Aus welcher Richtung die Karte hereinfliegt. */
	from?: 'left' | 'right' | 'top' | 'bottom';
	/** Kartenbreite in px (Höhe ≈ 1,22 × Breite). */
	width?: number;
	/** Grundneigung in Grad. */
	tilt?: number;
	/** Seed für sanftes Schweben (deterministisch). */
	floatPhase?: number;
	/** Fragezeichen-Siegel (z. B. im Hook). */
	questionMark?: boolean;
	/** Abgedunkelt (nicht im Fokus). */
	dim?: number;
	style?: React.CSSProperties;
};

const FLY: Record<NonNullable<CalendarCardProps['from']>, [number, number]> = {
	left: [-900, 40],
	right: [900, 40],
	top: [0, -900],
	bottom: [0, 900],
};

/** Gezeichnete Abreißkalender-Karte mit Ringen, Monat, großem Tag und Status. */
export const CalendarCard: React.FC<CalendarCardProps> = ({
	day,
	month = 'NOVEMBER',
	year = '2026',
	weekday,
	color,
	status,
	delay = 0,
	from = 'bottom',
	width = 270,
	tilt = 0,
	floatPhase = 0,
	questionMark = false,
	dim = 0,
	style,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = springIn({frame, fps, delay, damping: 13, stiffness: 120});
	const [fx, fy] = FLY[from];
	const height = Math.round(width * 1.22);
	const float = Math.sin((frame + floatPhase * 20) * 0.07) * 6;
	const settle = interpolate(frame - delay, [0, 24], [1, 0], {...clamp, easing: EASE_OUT});
	if (frame < delay - 1) {
		return null;
	}

	const u = width / 270;
	return (
		<div
			style={{
				position: 'relative',
				width,
				height,
				translate: `${fx * (1 - s)}px ${fy * (1 - s) + float}px`,
				rotate: `${tilt + settle * (fx >= 0 ? 14 : -14)}deg`,
				scale: String(0.7 + 0.3 * s),
				opacity: Math.min(1, s * 2) * (1 - dim * 0.65),
				filter: dim > 0 ? `saturate(${1 - dim * 0.6})` : undefined,
				...style,
			}}
		>
			{/* Karte */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					borderRadius: RADII.md * u,
					background: 'linear-gradient(170deg, #FFFFFF 0%, #E9EDF8 100%)',
					border: `${5 * u}px solid ${color}`,
					boxShadow: `${SHADOWS.card}, 0 0 ${60 * u}px ${withAlpha(color, 0.4)}`,
					overflow: 'hidden',
				}}
			>
				<div
					style={{
						height: 64 * u,
						background: `linear-gradient(180deg, ${shade(color, 1.1)}, ${shade(color, 0.8)})`,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontFamily: FONTS.heading,
						fontWeight: 900,
						fontSize: 23 * u,
						letterSpacing: 2 * u,
						whiteSpace: 'nowrap',
						color: '#0B1029',
					}}
				>
					{month} {year}
				</div>
				<div
					style={{
						marginTop: 6 * u,
						textAlign: 'center',
						fontFamily: FONTS.heading,
						fontWeight: 900,
						fontSize: 158 * u,
						lineHeight: 1,
						color: '#0B1029',
						letterSpacing: -4 * u,
					}}
				>
					{day}
				</div>
				{weekday ? (
					<div
						style={{
							textAlign: 'center',
							fontFamily: FONTS.heading,
							fontWeight: 800,
							fontSize: 27 * u,
							letterSpacing: 2 * u,
							color: '#4A5580',
							marginTop: -4 * u,
						}}
					>
						{weekday.toUpperCase()}
					</div>
				) : null}
				{status ? (
					<div
						style={{
							position: 'absolute',
							left: 12 * u,
							right: 12 * u,
							bottom: 12 * u,
							padding: `${7 * u}px 0`,
							borderRadius: RADII.pill,
							background: color,
							textAlign: 'center',
							fontFamily: FONTS.heading,
							fontWeight: 900,
							fontSize: 24 * u,
							letterSpacing: 1.5 * u,
							color: '#0B1029',
						}}
					>
						{status}
					</div>
				) : null}
			</div>
			{/* Aufhänge-Ringe */}
			{[0.13, 0.87].map((x) => (
				<div
					key={x}
					style={{
						position: 'absolute',
						top: -16 * u,
						left: `${x * 100}%`,
						width: 20 * u,
						height: 44 * u,
						translate: '-50% 0',
						borderRadius: 12 * u,
						background: 'linear-gradient(180deg, #FFFFFF, #8B93B8)',
						border: `${3 * u}px solid #232C55`,
					}}
				/>
			))}
			{questionMark ? (
				<div
					style={{
						position: 'absolute',
						right: -20 * u,
						top: -26 * u,
						width: 76 * u,
						height: 76 * u,
						borderRadius: '50%',
						background: COLORS.signal,
						border: `${5 * u}px solid #0B1029`,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontFamily: FONTS.heading,
						fontWeight: 900,
						fontSize: 52 * u,
						color: '#0B1029',
						rotate: '12deg',
						scale: String(1 + Math.sin(frame * 0.2) * 0.05),
					}}
				>
					?
				</div>
			) : null}
		</div>
	);
};
