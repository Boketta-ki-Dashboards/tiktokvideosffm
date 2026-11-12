import React from 'react';
import {COLORS, FONTS, RADII, SHADOWS} from '../../theme/tokens';
import {Flag, type FlagCode} from './flags/Flag';
import {MediaBadge} from './MediaBadge';

export type HeadlineCardProps = {
	outlet: string;
	country: FlagCode | string;
	countryLabel?: string;
	/** Originalschlagzeile – wörtlich und unverändert übernehmen. */
	headline: string;
	/** Deutsche Übersetzung (klar als solche gekennzeichnet). */
	translation?: string;
	date: string;
	/** z. B. „via Reuters“ bei übernommenen Agenturmeldungen. */
	via?: string;
	width?: number;
	style?: React.CSSProperties;
};

/** Karte für eine echte, belegte Schlagzeile inkl. Medium, Land, Datum. */
export const HeadlineCard: React.FC<HeadlineCardProps> = ({
	outlet,
	country,
	countryLabel,
	headline,
	translation,
	date,
	via,
	width = 860,
	style,
}) => {
	return (
		<div
			style={{
				width,
				padding: '26px 30px 26px 30px',
				borderRadius: RADII.lg,
				background: 'linear-gradient(160deg, rgba(30, 40, 84, 0.96), rgba(12, 17, 42, 0.96))',
				border: `2px solid ${COLORS.panelBorder}`,
				boxShadow: SHADOWS.card,
				display: 'flex',
				flexDirection: 'column',
				gap: 14,
				...style,
			}}
		>
			<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
				<Flag code={country} width={58} rounded={6} />
				<MediaBadge name={outlet} size="md" />
				<div style={{flex: 1}} />
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
					<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, color: COLORS.textMuted}}>{date}</span>
					{countryLabel ? (
						<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 20, color: COLORS.textDim}}>{countryLabel}</span>
					) : null}
				</div>
			</div>
			<div
				style={{
					fontFamily: FONTS.body,
					fontWeight: 800,
					fontSize: 36,
					lineHeight: 1.18,
					color: COLORS.text,
				}}
			>
				„{headline}“
			</div>
			{translation ? (
				<div style={{fontFamily: FONTS.body, fontWeight: 500, fontSize: 25, lineHeight: 1.25, color: COLORS.textMuted}}>
					<span style={{color: COLORS.signal, fontWeight: 700}}>DE: </span>
					{translation}
				</div>
			) : null}
			{via ? <div style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 20, color: COLORS.textDim}}>{via}</div> : null}
		</div>
	);
};
