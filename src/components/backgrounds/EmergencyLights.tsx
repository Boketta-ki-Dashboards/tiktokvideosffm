import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

/**
 * Pulsierendes Blau-/Rotlicht (Einsatzfahrzeuge) als Lichtstimmung – ohne Gewaltdarstellung.
 */
export const EmergencyLights: React.FC<{intensity?: number; y?: number; colors?: [string, string]; speed?: number}> = ({
	intensity = 0.55,
	y = 0.72,
	colors = ['#2B6BFF', '#FF2B4A'],
	speed = 0.32,
}) => {
	const frame = useCurrentFrame();
	const a = Math.max(0, Math.sin(frame * speed)) ** 3;
	const b = Math.max(0, Math.sin(frame * speed + Math.PI)) ** 3;
	return (
		<AbsoluteFill style={{mixBlendMode: 'screen', pointerEvents: 'none'}}>
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse 70% 30% at 20% ${y * 100}%, ${colors[0]} 0%, transparent 70%)`,
					opacity: a * intensity,
				}}
			/>
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse 70% 30% at 80% ${y * 100}%, ${colors[1]} 0%, transparent 70%)`,
					opacity: b * intensity * 0.8,
				}}
			/>
		</AbsoluteFill>
	);
};
