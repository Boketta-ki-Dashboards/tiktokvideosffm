import React from 'react';
import {interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, EASE_IN, EASE_OUT, springIn} from '../../lib/animation';
import {withAlpha} from '../../lib/color';
import {COLORS, FONTS, RADII, SHADOWS} from '../../theme/tokens';

export type ChatMockProps = {
	/** Kanalname im Kopf (neutral, keine Messenger-Logos). */
	channel: string;
	/** Text der Nachricht (Zitat laut Medienbericht). */
	message: string;
	/** Teil der Nachricht, der gelb hervorgehoben wird (z. B. „14.11.“). */
	highlight?: string;
	/** Frame, ab dem die Nachricht erscheint. */
	appearFrame: number;
	/** Frame, ab dem die Nachricht gelöscht wird (Zerfall in Partikel). */
	deleteFrame: number;
	width?: number;
	/** Kennzeichnung unter dem Fenster, z. B. „Nachgestellt – laut Apollo News 01.11.“. */
	caption?: string;
	delay?: number;
};

const PARTS = 34;

/** Nachgestelltes Kanal-Fenster: eine Nachricht erscheint und zerfällt beim Löschen. Immer als „nachgestellt“ kennzeichnen. */
export const ChatMock: React.FC<ChatMockProps> = ({channel, message, highlight, appearFrame, deleteFrame, width = 860, caption, delay = 0}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const intro = springIn({frame, fps, delay, damping: 16});
	const msg = springIn({frame, fps, delay: appearFrame, damping: 13, stiffness: 160});
	const del = interpolate(frame, [deleteFrame, deleteFrame + 22], [0, 1], {...clamp, easing: EASE_IN});
	const deleted = frame >= deleteFrame + 22;
	const shake = frame >= deleteFrame && frame < deleteFrame + 10 ? Math.sin(frame * 3.2) * 7 : 0;
	const parts = message.split(highlight ?? '\u0000');
	const bubbleH = 150;

	return (
		<div style={{width, opacity: Math.min(1, intro * 1.5), translate: `0 ${(1 - intro) * 100}px`, scale: String(0.94 + 0.06 * intro)}}>
			<div
				style={{
					borderRadius: RADII.lg,
					background: 'linear-gradient(170deg, rgba(25,33,72,0.97), rgba(9,13,34,0.97))',
					border: `3px solid ${COLORS.panelBorder}`,
					boxShadow: SHADOWS.card,
					overflow: 'hidden',
				}}
			>
				{/* Kopf */}
				<div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '20px 26px', background: 'rgba(255,255,255,0.06)'}}>
					<div
						style={{
							width: 62,
							height: 62,
							borderRadius: '50%',
							background: 'linear-gradient(140deg, #FF9A2E, #C2283C)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontFamily: FONTS.heading,
							fontWeight: 900,
							fontSize: 30,
							color: '#FFFFFF',
						}}
					>
						G
					</div>
					<div style={{display: 'flex', flexDirection: 'column'}}>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 32, color: COLORS.text}}>{channel}</span>
						<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, color: COLORS.textMuted}}>öffentlicher Kanal</span>
					</div>
				</div>

				{/* Nachrichtenbereich */}
				<div style={{position: 'relative', height: bubbleH + 70, padding: 26}}>
					{!deleted ? (
						<div
							style={{
								width: 'fit-content',
								maxWidth: '92%',
								padding: '22px 28px',
								borderRadius: '26px 26px 26px 6px',
								background: 'linear-gradient(140deg, #2B3F86, #1B2A62)',
								border: `2px solid ${withAlpha('#FFFFFF', 0.18)}`,
								fontFamily: FONTS.body,
								fontWeight: 700,
								fontSize: 42,
								lineHeight: 1.2,
								color: COLORS.text,
								opacity: Math.min(1, msg * 1.6) * (1 - del),
								translate: `${shake + (1 - msg) * -60}px 0`,
								scale: String(0.9 + 0.1 * msg - del * 0.12),
								filter: del > 0 ? `blur(${del * 6}px)` : undefined,
							}}
						>
							{highlight ? (
								<>
									{parts[0]}
									<span style={{color: COLORS.signal, fontWeight: 900}}>{highlight}</span>
									{parts[1]}
								</>
							) : (
								message
							)}
						</div>
					) : (
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 14,
								fontFamily: FONTS.body,
								fontWeight: 700,
								fontSize: 32,
								fontStyle: 'italic',
								color: COLORS.textDim,
								opacity: interpolate(frame, [deleteFrame + 22, deleteFrame + 34], [0, 1], clamp),
							}}
						>
							<svg width={34} height={34} viewBox="0 0 24 24">
								<path d="M6 7h12l-1 13H7L6 7zm3-3h6l1 2H8l1-2z" fill="none" stroke={COLORS.textDim} strokeWidth={2} strokeLinejoin="round" />
							</svg>
							Nachricht gelöscht
						</div>
					)}

					{/* Zerfall in Partikel */}
					{del > 0 && !deleted
						? new Array(PARTS).fill(0).map((_, i) => {
								const a = random(`chat-a-${i}`) * Math.PI * 2;
								const dist = (60 + random(`chat-d-${i}`) * 220) * EASE_OUT(del);
								return (
									<div
										key={i}
										style={{
											position: 'absolute',
											left: 60 + random(`chat-x-${i}`) * 420,
											top: 50 + random(`chat-y-${i}`) * 80,
											width: 10 + random(`chat-s-${i}`) * 14,
											height: 10 + random(`chat-s-${i}`) * 14,
											borderRadius: 4,
											background: i % 4 === 0 ? COLORS.signal : '#4C63C4',
											opacity: 1 - del,
											translate: `${Math.cos(a) * dist}px ${Math.sin(a) * dist - del * 40}px`,
											rotate: `${del * 240 * (i % 2 ? 1 : -1)}deg`,
										}}
									/>
								);
							})
						: null}
				</div>
			</div>
			{caption ? (
				<div style={{marginTop: 14, textAlign: 'center', fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, color: COLORS.textMuted, letterSpacing: 0.5}}>
					{caption}
				</div>
			) : null}
		</div>
	);
};
