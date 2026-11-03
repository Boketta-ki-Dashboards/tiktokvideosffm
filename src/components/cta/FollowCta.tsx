import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, EASE_IN_OUT, EASE_OUT, springIn} from '../../lib/animation';
import {withAlpha} from '../../lib/color';
import {COLORS, FONTS, SHADOWS} from '../../theme/tokens';
import {KineticText} from '../text/KineticText';

export type FollowCtaProps = {
	/** Frame, in dem der Finger auf das Plus tippt. */
	tapFrame: number;
	/** Frame, ab dem die Kommentar-Aufforderung erscheint. */
	commentFrame: number;
	title?: string;
	/** Kurzname/Initialen im Profilbild. */
	initials?: string;
	channelName?: string;
	commentPrompt?: string;
};

/** Stilisierter Zeigefinger (eigene Zeichnung). Spitze liegt bei (0, 0). */
const PointingHand: React.FC<{press: number}> = ({press}) => (
	<g transform={`scale(${1 - press * 0.08})`}>
		<g fill="#F3C9A4" stroke="#3A2A22" strokeWidth={5} strokeLinejoin="round">
			{/* Zeigefinger */}
			<path d="M -18 6 Q -20 -2 -12 -4 L 12 -4 Q 20 -2 18 6 L 20 120 L -20 120 Z" transform="rotate(-18)" />
			{/* Handfläche + eingeklappte Finger */}
			<path d="M -48 96 Q -60 120 -54 170 Q -46 228 6 236 Q 70 240 84 190 Q 92 158 86 120 Q 80 96 58 96 Q 46 82 30 92 Q 16 80 0 92 L -12 96 Z" transform="rotate(-18)" />
			{/* Daumen */}
			<path d="M -48 130 Q -86 110 -96 132 Q -102 150 -70 172 L -46 180 Z" transform="rotate(-18)" />
		</g>
		{/* Fingernagel */}
		<path d="M -9 10 Q 0 2 9 10 L 8 28 Q 0 32 -8 28 Z" fill="#F9DCC3" transform="rotate(-18)" />
	</g>
);

const TypingDots: React.FC<{frame: number}> = ({frame}) => (
	<div style={{display: 'flex', gap: 10, alignItems: 'center', height: 30}}>
		{[0, 1, 2].map((i) => (
			<div
				key={i}
				style={{
					width: 14,
					height: 14,
					borderRadius: 7,
					background: COLORS.textMuted,
					translate: `0 ${Math.sin(frame * 0.35 - i * 0.9) * 6}px`,
				}}
			/>
		))}
	</div>
);

/**
 * Abspann-Aufforderung im TikTok-Stil: Finger tippt auf das „+“ am Profilbild (= Folgen),
 * das Plus wird zum Haken, danach erscheint eine Kommentar-Aufforderung.
 * Generische Gestaltung – keine TikTok-Logos oder -Schriftzüge.
 */
export const FollowCta: React.FC<FollowCtaProps> = ({
	tapFrame,
	commentFrame,
	title = 'Danke fürs Zusehen!',
	initials = 'ST',
	channelName = 'SmokingTikTok',
	commentPrompt = 'Welches Thema als Nächstes?',
}) => {
	const frame = useCurrentFrame();
	const {fps, width} = useVideoConfig();

	// Profilbild
	const avatarIn = springIn({frame, fps, delay: 4, damping: 12});
	const avatarX = width / 2;
	const avatarY = 760;
	const avatarR = 140;

	// Finger: kommt von rechts unten, tippt, zieht sich zurück
	const approach = interpolate(frame, [tapFrame - 22, tapFrame], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const retreat = interpolate(frame, [tapFrame + 10, tapFrame + 30], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const press = interpolate(frame, [tapFrame - 3, tapFrame, tapFrame + 5], [0, 1, 0], clamp);
	const plusX = avatarX;
	const plusY = avatarY + avatarR - 6;
	const handX = interpolate(approach - retreat, [0, 1], [plusX + 380, plusX + 6]);
	const handY = interpolate(approach - retreat, [0, 1], [plusY + 520, plusY + 8]) + press * 10;

	// Plus → Haken
	const tapped = frame >= tapFrame;
	const morph = interpolate(frame, [tapFrame, tapFrame + 8], [0, 1], {...clamp, easing: EASE_OUT});
	const badgeScale = tapped ? 1 + Math.sin(Math.min(1, (frame - tapFrame) / 10) * Math.PI) * 0.35 : 1 - press * 0.15;
	const burst = interpolate(frame, [tapFrame, tapFrame + 18], [0, 1], clamp);
	const followedLabel = interpolate(frame, [tapFrame + 4, tapFrame + 16], [0, 1], {...clamp, easing: EASE_OUT});

	// Kommentar
	const commentIn = springIn({frame, fps, delay: commentFrame, damping: 13});

	return (
		<AbsoluteFill>
			{/* schwebende Partikel */}
			<svg width={width} height={1920} style={{position: 'absolute'}}>
				{new Array(28).fill(true).map((_, i) => {
					const x = random(`cta-x-${i}`) * width;
					const speed = 0.6 + random(`cta-s-${i}`) * 1.4;
					const y = 1920 - ((frame * speed + random(`cta-y-${i}`) * 1920) % 1920);
					return <circle key={i} cx={x} cy={y} r={2 + random(`cta-r-${i}`) * 4} fill={i % 3 === 0 ? COLORS.signal : COLORS.cyan} opacity={0.25} />;
				})}
			</svg>

			<div style={{position: 'absolute', top: 260, left: 64, right: 150, display: 'flex', justifyContent: 'center'}}>
				<KineticText text={title} highlight={['Zusehen!']} align="center" fontSize={92} delay={2} stagger={4} maxWidth={866} />
			</div>

			{/* Profilbild mit Folgen-Plus */}
			<div
				style={{
					position: 'absolute',
					left: avatarX - avatarR,
					top: avatarY - avatarR,
					width: avatarR * 2,
					height: avatarR * 2,
					scale: String(avatarIn),
				}}
			>
				{/* Burst-Ring beim Tippen */}
				{tapped ? (
					<div
						style={{
							position: 'absolute',
							left: avatarR - 40 - burst * 90,
							top: avatarR * 2 - 46 - burst * 90,
							width: 80 + burst * 180,
							height: 80 + burst * 180,
							borderRadius: '50%',
							border: `6px solid ${withAlpha(COLORS.alert, 1 - burst)}`,
						}}
					/>
				) : null}
				<div
					style={{
						width: '100%',
						height: '100%',
						borderRadius: '50%',
						background: `linear-gradient(135deg, ${COLORS.violet}, ${COLORS.cyan})`,
						border: '8px solid #FFFFFF',
						boxShadow: SHADOWS.card,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontFamily: FONTS.heading,
						fontWeight: 900,
						fontSize: 110,
						color: '#FFFFFF',
						letterSpacing: -2,
					}}
				>
					{initials}
				</div>
				<div
					style={{
						position: 'absolute',
						left: avatarR - 42,
						top: avatarR * 2 - 48,
						width: 84,
						height: 84,
						borderRadius: 42,
						background: tapped ? '#FFFFFF' : COLORS.alert,
						border: '6px solid #FFFFFF',
						boxShadow: '0 8px 20px rgba(0,0,0,0.45)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						scale: String(badgeScale),
					}}
				>
					<svg width={48} height={48} viewBox="-24 -24 48 48">
						{tapped ? (
							<path
								d="M -13 1 L -4 10 L 14 -9"
								fill="none"
								stroke={COLORS.alert}
								strokeWidth={7}
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeDasharray={50}
								strokeDashoffset={50 * (1 - morph)}
							/>
						) : (
							<g stroke="#FFFFFF" strokeWidth={7} strokeLinecap="round">
								<line x1={-14} y1={0} x2={14} y2={0} />
								<line x1={0} y1={-14} x2={0} y2={14} />
							</g>
						)}
					</svg>
				</div>
			</div>

			<div
				style={{
					position: 'absolute',
					top: avatarY + avatarR + 56,
					left: 0,
					right: 0,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 8,
					opacity: avatarIn,
				}}
			>
				<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 40, color: COLORS.text}}>@{channelName}</span>
				<span
					style={{
						fontFamily: FONTS.heading,
						fontWeight: 900,
						fontSize: 34,
						color: tapped ? COLORS.green : COLORS.signal,
						scale: String(1 + Math.sin(followedLabel * Math.PI) * 0.12),
					}}
				>
					{tapped ? 'Gefolgt!' : 'Folgen = Plus antippen'}
				</span>
			</div>

			{/* Kommentar-Aufforderung */}
			<div
				style={{
					position: 'absolute',
					top: 1105,
					left: 110,
					right: 180,
					display: 'flex',
					alignItems: 'center',
					gap: 18,
					padding: '22px 28px',
					borderRadius: 30,
					background: 'rgba(255,255,255,0.96)',
					boxShadow: SHADOWS.card,
					scale: String(commentIn),
					opacity: Math.min(1, commentIn * 1.5),
					transformOrigin: 'left center',
				}}
			>
				<svg width={58} height={58} viewBox="0 0 24 24" style={{flexShrink: 0}}>
					<path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H10l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill={COLORS.violet} />
					<circle cx={8} cy={10.5} r={1.4} fill="#fff" />
					<circle cx={12} cy={10.5} r={1.4} fill="#fff" />
					<circle cx={16} cy={10.5} r={1.4} fill="#fff" />
				</svg>
				<div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 36, color: '#0B1020'}}>{commentPrompt}</span>
					<TypingDots frame={frame} />
				</div>
			</div>

			{/* Finger (über allem) */}
			{approach - retreat > 0.001 ? (
				<svg width={width} height={1920} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
					<g transform={`translate(${handX} ${handY})`} style={{filter: 'drop-shadow(0 18px 24px rgba(0,0,0,0.45))'}}>
						<PointingHand press={press} />
					</g>
				</svg>
			) : null}
		</AbsoluteFill>
	);
};
