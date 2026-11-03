import React from 'react';
import {AbsoluteFill} from 'remotion';
import {COLORS} from '../../theme/tokens';

export type GradientSkyProps = {
	/** Farben von oben nach unten. */
	stops?: string[];
	/** Position des Horizont-Leuchtens (0 = oben, 1 = unten). */
	glowY?: number;
	glowColor?: string;
	glowStrength?: number;
	style?: React.CSSProperties;
};

/** Mehrstufiger Himmelsverlauf mit weichem Horizont-Leuchten (Sonnenuntergang, Nacht, Tag). */
export const GradientSky: React.FC<GradientSkyProps> = ({
	stops = [COLORS.duskTop, COLORS.duskMid, COLORS.duskLow, COLORS.duskHorizon],
	glowY = 0.62,
	glowColor = COLORS.duskHorizon,
	glowStrength = 0.55,
	style,
}) => {
	return (
		<AbsoluteFill
			style={{
				background: `linear-gradient(180deg, ${stops
					.map((c, i) => `${c} ${Math.round((i / Math.max(1, stops.length - 1)) * 100)}%`)
					.join(', ')})`,
				...style,
			}}
		>
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse 90% 28% at 50% ${glowY * 100}%, ${glowColor} 0%, transparent 70%)`,
					opacity: glowStrength,
				}}
			/>
		</AbsoluteFill>
	);
};
