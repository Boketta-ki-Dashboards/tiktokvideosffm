import React from 'react';
import {Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {springIn} from '../../lib/animation';
import {withAlpha} from '../../lib/color';
import {COLORS, FONTS, RADII, SHADOWS} from '../../theme/tokens';
import {StorefrontIllustration, type StorefrontMotif} from './StorefrontIllustration';

export type DamageStatus = 'gepluendert' | 'beschaedigt' | 'ungeklaert';

export const STATUS_STYLE: Record<DamageStatus, {color: string; label: string}> = {
	gepluendert: {color: '#FF3B4E', label: 'GEPLÜNDERT'},
	beschaedigt: {color: '#FF9A2E', label: 'BESCHÄDIGT'},
	ungeklaert: {color: '#8C95B4', label: 'UNGEKLÄRT'},
};

export type ShopCardProps = {
	name: string;
	address: string;
	status: DamageStatus;
	description: string;
	/** Kurzer Belegvermerk, z. B. „hessenschau-Ticker 21:41“. */
	evidence: string;
	image:
		| {kind: 'photo'; file: string; credit: string}
		| {kind: 'illustration'; motif: StorefrontMotif};
	/** Frame, ab dem die Karte einfliegt (relativ zur Szene). */
	delay?: number;
	/** Frame, ab dem die Karte wieder ausblendet. */
	hideFrom?: number;
	width?: number;
	style?: React.CSSProperties;
};

/** Kompakte Informationskarte zu einem betroffenen Geschäft (Bild + Status + belegte Fakten). */
export const ShopCard: React.FC<ShopCardProps> = ({name, address, status, description, evidence, image, delay = 0, hideFrom, width = 900, style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = springIn({frame, fps, delay, damping: 15, stiffness: 150});
	const out = hideFrom === undefined ? 0 : springIn({frame, fps, delay: hideFrom, damping: 20, stiffness: 200});
	const p = Math.max(0, s - out);
	if (p <= 0.001) {
		return null;
	}

	const st = STATUS_STYLE[status];
	const imgW = 300;
	const imgH = 228;
	return (
		<div
			style={{
				width,
				display: 'flex',
				gap: 22,
				padding: 16,
				borderRadius: RADII.lg,
				background: 'linear-gradient(150deg, rgba(24, 31, 70, 0.97), rgba(9, 13, 34, 0.97))',
				border: `3px solid ${withAlpha(st.color, 0.75)}`,
				boxShadow: `${SHADOWS.card}, 0 0 40px ${withAlpha(st.color, 0.18)}`,
				opacity: Math.min(1, p * 1.4),
				translate: `0 ${(1 - p) * 140}px`,
				scale: String(0.92 + 0.08 * p),
				...style,
			}}
		>
			<div style={{position: 'relative', width: imgW, height: imgH, borderRadius: RADII.md, overflow: 'hidden', flexShrink: 0, background: '#0B1029'}}>
				{image.kind === 'photo' ? (
					<Img src={staticFile(image.file)} style={{width: '100%', height: '100%', objectFit: 'cover', scale: String(1.04 + 0.04 * (1 - p))}} />
				) : (
					<StorefrontIllustration motif={image.motif} width={imgW} height={imgH} cracked={status !== 'ungeklaert'} seed={name} />
				)}
				<div
					style={{
						position: 'absolute',
						left: 0,
						right: 0,
						bottom: 0,
						padding: '5px 10px',
						background: 'rgba(0,0,0,0.68)',
						fontFamily: FONTS.body,
						fontWeight: 700,
						fontSize: 17,
						color: '#FFFFFF',
					}}
				>
					{image.kind === 'photo' ? image.credit : 'Illustration – kein Foto'}
				</div>
			</div>
			<div style={{display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0, flex: 1, paddingTop: 2}}>
				<div
					style={{
						alignSelf: 'flex-start',
						padding: '5px 14px',
						borderRadius: RADII.pill,
						background: st.color,
						fontFamily: FONTS.heading,
						fontWeight: 900,
						fontSize: 22,
						letterSpacing: 1.5,
						color: '#FFFFFF',
					}}
				>
					{st.label}
				</div>
				<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, lineHeight: 1.05, color: COLORS.text}}>{name}</div>
				<div style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 24, color: COLORS.textMuted}}>{address}</div>
				<div style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 26, lineHeight: 1.22, color: COLORS.text}}>{description}</div>
				<div
					style={{
						fontFamily: FONTS.body,
						fontWeight: 600,
						fontSize: 20,
						color: COLORS.textDim,
						marginTop: 'auto',
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
					}}
				>
					Beleg: {evidence}
				</div>
			</div>
		</div>
	);
};
