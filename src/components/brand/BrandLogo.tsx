import React from 'react';
import {Img, staticFile} from 'remotion';
import {withAlpha} from '../../lib/color';
import {BRAND} from '../../theme/brand';

/**
 * Offizielles FrankfurtRed-Logo (public/brand/frankfurtred-logo.webp) im Kreis – Standard für alle NEUEN Outros,
 * Follow-CTAs und Profilhinweise. Das Logo ist selbst rund: Der Kreisrahmen schneidet nur die dunklen Ecken ab,
 * FR-Monogramm und Schriftzug „FRANKFURT RED“ bleiben vollständig sichtbar (unverzerrt, `objectFit: contain`).
 */
export const BrandLogo: React.FC<{size: number; ring?: number; border?: boolean; style?: React.CSSProperties}> = ({size, ring = 0, border = true, style}) => (
	<div
		style={{
			position: 'relative',
			width: size,
			height: size,
			borderRadius: size / 2,
			overflow: 'hidden',
			background: '#050507',
			border: border ? `${Math.max(2, size * 0.022)}px solid ${withAlpha('#FFFFFF', 0.92)}` : undefined,
			boxShadow: `0 0 0 ${ring}px ${withAlpha(BRAND.avatarGradient[0], 0.35)}, 0 0 ${size * 0.25}px ${withAlpha(BRAND.avatarGradient[0], 0.35)}, 0 18px 40px rgba(0,0,0,0.55)`,
			flexShrink: 0,
			...style,
		}}
	>
		<Img src={staticFile(BRAND.logoFile)} alt={BRAND.logoAlt} style={{width: '100%', height: '100%', objectFit: 'contain', display: 'block'}} />
	</div>
);
