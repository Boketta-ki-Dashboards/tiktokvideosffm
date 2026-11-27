import React from 'react';
import {Img, staticFile} from 'remotion';
import {COLORS, FONTS, RADII} from '../../theme/tokens';

export type MediaBadgeProps = {
	/** Name des Mediums, z. B. „Reuters“. */
	name: string;
	/**
	 * Optionales Logo in public/ (nur mit Nutzungsrecht!). Ohne Logo wird eine
	 * neutrale Wortmarke in Hausschrift gezeigt – keine Nachahmung fremder Markenlogos.
	 */
	logoFile?: string;
	size?: 'sm' | 'md' | 'lg';
	accent?: string;
	style?: React.CSSProperties;
};

const SIZES = {
	sm: {font: 22, padY: 6, padX: 14, logo: 26},
	md: {font: 28, padY: 8, padX: 18, logo: 34},
	lg: {font: 38, padY: 12, padX: 24, logo: 46},
} as const;

export const MediaBadge: React.FC<MediaBadgeProps> = ({name, logoFile, size = 'md', accent = COLORS.signal, style}) => {
	const s = SIZES[size];
	return (
		<div
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				gap: 10,
				padding: `${s.padY}px ${s.padX}px`,
				borderRadius: RADII.pill,
				background: '#FFFFFF',
				color: '#0B1020',
				fontFamily: FONTS.heading,
				fontWeight: 800,
				fontSize: s.font,
				letterSpacing: 0.3,
				boxShadow: `inset 0 -3px 0 ${accent}`,
				whiteSpace: 'nowrap',
				...style,
			}}
		>
			{logoFile ? <Img src={staticFile(logoFile)} style={{height: s.logo}} /> : null}
			<span>{name}</span>
		</div>
	);
};
