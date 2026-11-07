import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {withAlpha} from '../../../lib/color';

/**
 * Abstrakte „Studio“-Bühne für Grafik-Szenen: Tiefenverlauf, zwei weiche Spotlights, perspektivischer
 * Boden mit Fluchtpunkt-Raster, schwebende Lichtpartikel. Erzeugt 2,5D-Raum hinter Karten.
 */
export const Studio: React.FC<{accent: string; second?: string; top?: string; bottom?: string; horizon?: number; seed?: string}> = ({
	accent,
	second = '#7C5CFF',
	top = '#070A1F',
	bottom = '#04050F',
	horizon = 1240,
	seed = 'studio',
}) => {
	const frame = useCurrentFrame();
	const sway = Math.sin(frame / 50) * 40;
	const lines = 14;
	return (
		<AbsoluteFill style={{overflow: 'hidden', background: `linear-gradient(180deg, ${top} 0%, ${bottom} 100%)`}}>
			<AbsoluteFill style={{background: `radial-gradient(ellipse 70% 40% at ${30 + sway / 20}% 18%, ${withAlpha(accent, 0.28)} 0%, ${withAlpha(accent, 0)} 70%)`}} />
			<AbsoluteFill style={{background: `radial-gradient(ellipse 60% 36% at ${76 - sway / 25}% 62%, ${withAlpha(second, 0.22)} 0%, ${withAlpha(second, 0)} 70%)`}} />
			<svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
				<defs>
					<linearGradient id={`${seed}-floor`} x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor={accent} stopOpacity={0} />
						<stop offset="1" stopColor={accent} stopOpacity={0.35} />
					</linearGradient>
				</defs>
				<rect x={0} y={horizon} width={1080} height={1920 - horizon} fill={`url(#${seed}-floor)`} opacity={0.35} />
				{new Array(lines).fill(true).map((_, i) => {
					const x = -600 + (i / (lines - 1)) * 2280;
					return <line key={`v-${i}`} x1={540} y1={horizon} x2={x} y2={1920} stroke={withAlpha(accent, 0.18)} strokeWidth={2} />;
				})}
				{new Array(9).fill(true).map((_, i) => {
					const t = ((i + (frame / 40) % 1) / 9) ** 2;
					const y = horizon + t * (1920 - horizon);
					return <line key={`h-${i}`} x1={0} y1={y} x2={1080} y2={y} stroke={withAlpha(accent, 0.1 + t * 0.2)} strokeWidth={2} />;
				})}
				<line x1={0} y1={horizon} x2={1080} y2={horizon} stroke={withAlpha(accent, 0.5)} strokeWidth={2} />
			</svg>
			{new Array(26).fill(true).map((_, i) => {
				const x = random(`${seed}-px-${i}`) * 1080;
				const y = (random(`${seed}-py-${i}`) * 1900 - frame * (0.3 + random(`${seed}-pv-${i}`) * 0.7) + 1920) % 1920;
				const s = 3 + random(`${seed}-ps-${i}`) * 6;
				return <div key={i} style={{position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: s, background: i % 3 ? withAlpha('#FFFFFF', 0.5) : withAlpha(accent, 0.8), boxShadow: `0 0 ${s * 3}px ${withAlpha(accent, 0.6)}`}} />;
			})}
		</AbsoluteFill>
	);
};

/** Abdunkelung oben (Lesbarkeit der Titel) + weiches Band hinter dem Untertitelbereich (Kontrast). */
export const Legibility: React.FC<{topStrength?: number; subtitleBand?: number}> = ({topStrength = 0.85, subtitleBand = 0.35}) => (
	<>
		<AbsoluteFill style={{background: `linear-gradient(rgba(5,7,22,${topStrength}) 0%, rgba(5,7,22,${topStrength * 0.45}) 42%, rgba(5,7,22,0) 62%)`}} />
		<AbsoluteFill style={{background: `linear-gradient(rgba(0,0,0,0) 60%, rgba(0,0,0,${subtitleBand}) 70%, rgba(0,0,0,${subtitleBand}) 76%, rgba(0,0,0,0) 86%)`}} />
	</>
);
