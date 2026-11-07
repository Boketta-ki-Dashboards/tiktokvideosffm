import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {GridBackdrop} from '../../../components/backgrounds/GridBackdrop';
import {SafeArea} from '../../../components/layout/SafeArea';
import {ChatMock} from '../../../components/media/ChatMock';
import {SourceCredit} from '../../../components/media/SourceCredit';
import {Kicker} from '../../../components/text/Kicker';
import {clamp, EASE_OUT, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {COLORS, FONTS, RADII, SHADOWS} from '../../../theme/tokens';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {STUFE_STYLE} from '../termine';

/** Kleine Karte „Medienbericht“ – zeigt, warum der gelöschte Aufruf trotzdem kursiert. */
const EchoCard: React.FC<{from: number; source: string; text: string; delay: number; dx: number}> = ({from, source, text, delay, dx}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = springIn({frame, fps, delay: from + delay, damping: 14, stiffness: 150});
	return (
		<div
			style={{
				flex: 1,
				padding: '16px 20px',
				borderRadius: RADII.md,
				background: 'linear-gradient(160deg, rgba(40,48,98,0.98), rgba(14,20,48,0.98))',
				border: `3px solid ${withAlpha(COLORS.cyan, 0.5)}`,
				boxShadow: SHADOWS.card,
				opacity: Math.min(1, s * 1.6),
				translate: `${(1 - s) * dx}px ${(1 - s) * -300}px`,
				scale: String(0.7 + 0.3 * s),
			}}
		>
			<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, color: COLORS.cyan, letterSpacing: 1}}>{source}</div>
			<div style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 27, lineHeight: 1.22, color: COLORS.text, marginTop: 6}}>{text}</div>
		</div>
	);
};

/** Szene 2: 14. November – gelöschter Aufruf im Telegram-Kanal (nachgestellt) und seine Verbreitung. */
export const Day14Scene: React.FC<SceneProps> = ({cues}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const d = cue(cues, 'd14', 4);
	const span = d.to - d.from;
	const appear = d.from + Math.round(span * 0.28);
	const word = wordFrame(cues, 'gelöscht', d.from + Math.round(span * 0.85));
	// Löschung beginnt kurz VOR dem gesprochenen Wort, damit Stempel und Karten vor dem Szenenende wirken
	const del = word - 8;
	const echo = appear + 22;
	const echo2 = word - 2;
	const stamp = word + 8;
	const stampP = springIn({frame, fps, delay: stamp, damping: 9, stiffness: 220});
	const stampOn = frame >= stamp;
	const st = STUFE_STYLE.geruecht;
	const kick = interpolate(frame, [0, 20], [0, 1], {...clamp, easing: EASE_OUT});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night}}>
			<GridBackdrop accent={COLORS.cyan} seed="d14" />
			<SafeArea>
				<Kicker text="14. NOVEMBER · WAS IST DRAN?" color={COLORS.signal} delay={0} />
			</SafeArea>

			<div style={{position: 'absolute', top: 300, left: 64, width: 866, opacity: kick}}>
				<ChatMock
					channel="Gen Z regelt"
					message="Am 14.11. geht es weiter!"
					highlight="14.11."
					appearFrame={appear}
					deleteFrame={del}
					width={866}
					delay={2}
					caption="Nachgestellt nach Medienbericht (Apollo News, 01.11.) – kein Original-Screenshot"
				/>
			</div>

			{/* Verbreitung */}
			{frame >= echo - 4 ? (
				<div style={{position: 'absolute', top: 800, left: 64, width: 866}}>
					<div
						style={{
							fontFamily: FONTS.heading,
							fontWeight: 900,
							fontSize: 28,
							letterSpacing: 2,
							color: COLORS.textMuted,
							marginBottom: 12,
							opacity: interpolate(frame, [echo - 4, echo + 8], [0, 1], clamp),
						}}
					>
						MEDIEN MELDETEN DEN AUFRUF
					</div>
					<div style={{display: 'flex', gap: 16}}>
						<EchoCard from={echo} delay={0} dx={-200} source="DPA/LSW · 02.11." text="„weitere bundesweite Proteste am 14. November“ – ohne Städte" />
						<EchoCard from={echo2} delay={0} dx={200} source="APOLLO NEWS · 01.11." text="meldet den Aufruf – und seine Löschung" />
					</div>
				</div>
			) : null}

			{/* Stempel */}
			{stampOn ? (
				<div
					style={{
						position: 'absolute',
						top: 1050,
						left: 64,
						width: 866,
						display: 'flex',
						justifyContent: 'center',
						opacity: Math.min(1, stampP * 2),
						scale: String(2.2 - 1.2 * stampP),
						rotate: `${-3 + (1 - stampP) * 8}deg`,
					}}
				>
					<div
						style={{
							padding: '16px 34px',
							borderRadius: RADII.md,
							border: `6px solid ${st.color}`,
							background: 'rgba(7,10,28,0.9)',
							boxShadow: `0 0 50px ${withAlpha(st.color, 0.4)}`,
							fontFamily: FONTS.heading,
							fontWeight: 900,
							fontSize: 52,
							lineHeight: 1.08,
							letterSpacing: 1,
							color: COLORS.text,
							textAlign: 'center',
						}}
					>
						14. NOVEMBER –<br />
						<span style={{color: COLORS.signal}}>NICHT BESTÄTIGT</span>
					</div>
				</div>
			) : null}

			<div style={{position: 'absolute', left: 64, top: 1250}}>
				<SourceCredit sources={['Apollo News 01.11.', 'dpa/lsw 02.11.', 'genz-regelt.de 04.11.']} delay={echo + 10} />
			</div>
		</AbsoluteFill>
	);
};
