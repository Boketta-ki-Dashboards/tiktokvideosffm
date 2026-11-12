import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

/**
 * Feines, animiertes Filmkorn + Vignette. Verleiht flachen Vektorgrafiken Tiefe
 * und reduziert Banding in Verläufen nach der H.264-Kompression.
 */
export const GrainOverlay: React.FC<{
	opacity?: number;
	vignette?: number;
}> = ({opacity = 0.07, vignette = 0.55}) => {
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();
	// Seed alle 2 Frames wechseln: lebendiges Korn ohne Flimmern
	const seed = Math.floor(frame / 2) % 50;

	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<svg width={width} height={height} style={{opacity, mixBlendMode: 'overlay'}}>
				<filter id={`grain-${seed}`}>
					<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} stitchTiles="stitch" />
					<feColorMatrix type="saturate" values="0" />
				</filter>
				<rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
			</svg>
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse 75% 60% at 50% 45%, transparent 55%, rgba(0,0,0,${vignette}) 100%)`,
				}}
			/>
		</AbsoluteFill>
	);
};
