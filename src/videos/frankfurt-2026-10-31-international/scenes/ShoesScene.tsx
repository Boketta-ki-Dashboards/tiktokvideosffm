import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {GridBackdrop} from '../../../components/backgrounds/GridBackdrop';
import {SafeArea} from '../../../components/layout/SafeArea';
import {SourceCredit} from '../../../components/media/SourceCredit';
import {Kicker} from '../../../components/text/Kicker';
import {clamp, EASE_IN_OUT, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {COLORS, FONTS, RADII} from '../../../theme/tokens';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {SHOES} from '../content';
import {Pill, PopIn, Stamp} from '../ui';

/** Stilisierter Sneaker (Seitenansicht), `mirror` = rechter Schuh. */
const Sneaker: React.FC<{width: number; color: string; mirror?: boolean; glow?: number}> = ({width, color, mirror, glow = 0}) => (
	<svg
		width={width}
		viewBox="0 0 220 110"
		style={{scale: mirror ? '-1 1' : undefined, filter: glow > 0 ? `drop-shadow(0 0 ${24 * glow}px ${withAlpha(COLORS.signal, 0.85)})` : undefined}}
	>
		<path d="M14 70 Q12 40 30 34 L70 26 Q84 24 92 36 L112 58 Q150 62 190 70 Q210 74 208 90 L14 90 Z" fill={color} />
		<path d="M10 90 H210 Q214 100 204 104 H18 Q8 102 10 90 Z" fill="#F4F1EA" />
		<path d="M44 40 L60 64 M58 36 L74 60 M72 34 L88 56" stroke="#0B1029" strokeWidth={5} strokeLinecap="round" opacity={0.55} />
		<path d="M120 70 Q150 64 186 78" stroke="#F4F1EA" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.7} />
	</svg>
);

/** Nachgestellter Social-Beitrag: Plattform, Schuh, Platzhalterzeilen (kein erfundener Wortlaut). */
const PostCard: React.FC<{platform: string; delay: number; rotate: number}> = ({platform, delay, rotate}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = springIn({frame, fps, delay, damping: 12, stiffness: 170});
	if (frame < delay) return null;
	return (
		<div
			style={{
				width: 270,
				padding: 14,
				borderRadius: RADII.md,
				background: '#121A3A',
				border: `2px solid ${COLORS.panelBorder}`,
				boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
				rotate: `${rotate}deg`,
				translate: `0 ${(1 - s) * 220}px`,
				opacity: Math.min(1, s * 1.6),
				display: 'flex',
				flexDirection: 'column',
				gap: 10,
			}}
		>
			<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
				<div style={{width: 34, height: 34, borderRadius: 17, background: '#3A4789'}} />
				<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 24, color: COLORS.text}}>{platform}</span>
			</div>
			<div style={{height: 96, borderRadius: 10, background: '#0B1029', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<Sneaker width={150} color={COLORS.signal} />
			</div>
			<div style={{height: 12, width: '90%', borderRadius: 6, background: '#2B3A6B'}} />
			<div style={{height: 12, width: '60%', borderRadius: 6, background: '#2B3A6B'}} />
			<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted}}>„Kleinanzeige“ · 1 linker Schuh</span>
		</div>
	);
};

/** Szene 5: Die Schuh-Memes – echt (linke Schuhe gestohlen) vs. falsch (Verkaufsanzeigen) laut CORRECTIV. */
export const ShoesScene: React.FC<SceneProps> = ({cues}) => {
	const frame = useCurrentFrame();
	const m4 = cue(cues, 'mem4', 6);
	const m5 = cue(cues, 'mem5', m4.to + 6);
	const atLeft = wordFrame(cues, 'linke', m4.from + Math.round((m4.to - m4.from) * 0.55));
	const atSnipes = wordFrame(cues, 'Snipes', m4.to - 18);
	const atAds = wordFrame(cues, 'Verkaufsanzeigen', m5.from + 6);
	const atNever = wordFrame(cues, 'nie', atAds + 20);
	const atCheck = wordFrame(cues, 'Faktencheck', atNever + 14);
	const left = interpolate(frame, [atLeft, atLeft + 10], [0, 1], clamp);
	const shrink = interpolate(frame, [atAds - 8, atAds + 6], [0, 1], {...clamp, easing: EASE_IN_OUT});

	return (
		<AbsoluteFill>
			<GridBackdrop accent={COLORS.signal} stops={['#0A1030', '#05081A']} particles={18} seed="shoes" />
			<SafeArea>
				<Kicker text={SHOES.kicker} color={COLORS.signal} delay={0} />
			</SafeArea>

			{/* Das Schuhpaar */}
			<div
				style={{
					position: 'absolute',
					left: 64,
					width: 866,
					top: 300 - shrink * 30,
					display: 'flex',
					justifyContent: 'center',
					gap: 30,
					scale: String(1 - shrink * 0.35),
					transformOrigin: '50% 0%',
				}}
			>
				<PopIn delay={m4.from} from="left">
					<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
						<Sneaker width={380} color={left > 0.5 ? COLORS.signal : '#E8E4DA'} glow={left} />
						<div style={{opacity: left}}>
							<Pill color={COLORS.signal} dark={false} size={36}>
								LINKS
							</Pill>
						</div>
					</div>
				</PopIn>
				<PopIn delay={m4.from + 4} from="right">
					<div style={{opacity: 1 - left * 0.75}}>
						<Sneaker width={380} color="#E8E4DA" mirror />
					</div>
				</PopIn>
			</div>

			{/* Echt (laut Snipes) */}
			<div style={{position: 'absolute', left: 64, width: 866, top: 640 - shrink * 120}}>
				<PopIn delay={atSnipes - 4} from="bottom">
					<div style={{display: 'flex', gap: 16, alignItems: 'center', padding: '16px 20px', borderRadius: RADII.md, background: 'rgba(6, 30, 24, 0.94)', border: `2px solid ${COLORS.green}`}}>
						<svg width={56} height={56} viewBox="0 0 24 24" fill="none" stroke={COLORS.green} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
							<path d="M4 12l5 5L20 6" />
						</svg>
						<div style={{display: 'flex', flexDirection: 'column'}}>
							<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 31, color: COLORS.text, lineHeight: 1.15}}>{SHOES.real}</span>
							<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 23, color: COLORS.green}}>{SHOES.realSource}</span>
						</div>
					</div>
				</PopIn>
			</div>

			{/* Falsch: die viralen Verkaufsanzeigen */}
			<div style={{position: 'absolute', left: 50, width: 900, top: 700, display: 'flex', justifyContent: 'space-between'}}>
				{SHOES.posts.map((p, i) => (
					<PostCard key={p.id} platform={p.platform} delay={atAds + i * 5} rotate={p.rotate} />
				))}
			</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 800, display: 'flex', justifyContent: 'center'}}>
				<Stamp text={SHOES.verdict} sub={`${SHOES.factchecker}-Faktencheck · ${SHOES.date}`} at={atCheck} rotate={-9} size={110} />
			</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 1110, opacity: interpolate(frame, [atNever, atNever + 10], [0, 1], clamp)}}>
				<div style={{padding: '12px 18px', borderRadius: RADII.md, background: 'rgba(40, 8, 16, 0.92)', border: `2px solid ${COLORS.alert}`}}>
					<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 30, color: COLORS.text}}>{SHOES.fake}</span>
					<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 23, color: COLORS.alert}}> · {SHOES.fakeSource}</span>
				</div>
				<div style={{marginTop: 8, fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, color: COLORS.textDim}}>Beiträge: {SHOES.reenactment}</div>
			</div>
			<div style={{position: 'absolute', left: 64, top: 1240, opacity: interpolate(frame, [atSnipes, atSnipes + 10], [0, 1], clamp)}}>
				<SourceCredit sources={['CORRECTIV, 03.11.2026']} />
			</div>

			<Sfx name="pop" at={m4.from} />
			<Sfx name="blip" at={atLeft} volume={1.4} />
			<Sfx name="click" at={atSnipes - 4} />
			{SHOES.posts.map((p, i) => (
				<Sfx key={`n-${p.id}`} name="notify" at={atAds + i * 5} volume={0.8} />
			))}
			<Sfx name="stamp" at={atCheck} />
		</AbsoluteFill>
	);
};
