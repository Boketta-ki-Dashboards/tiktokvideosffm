import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {GridBackdrop} from '../../../components/backgrounds/GridBackdrop';
import {SafeArea} from '../../../components/layout/SafeArea';
import {SourceCredit} from '../../../components/media/SourceCredit';
import {Kicker} from '../../../components/text/Kicker';
import {KineticText} from '../../../components/text/KineticText';
import {clamp, EASE_IN_OUT, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {COLORS, FONTS, RADII} from '../../../theme/tokens';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {SHOES} from '../content';
import {Pill, PopIn} from '../ui';

/** Stilisierter Sneaker (Seitenansicht, linker Schuh: Spitze nach links). */
const Sneaker: React.FC<{width: number; color: string; glow?: number}> = ({width, color, glow = 0}) => (
	<svg width={width} viewBox="0 0 220 110" style={{filter: glow > 0 ? `drop-shadow(0 0 ${20 * glow}px ${withAlpha(COLORS.signal, 0.8)})` : undefined}}>
		<path d="M14 70 Q12 40 30 34 L70 26 Q84 24 92 36 L112 58 Q150 62 190 70 Q210 74 208 90 L14 90 Z" fill={color} />
		<path d="M10 90 H210 Q214 100 204 104 H18 Q8 102 10 90 Z" fill="#F4F1EA" />
		<path d="M44 40 L60 64 M58 36 L74 60 M72 34 L88 56" stroke="#0B1029" strokeWidth={5} strokeLinecap="round" opacity={0.55} />
	</svg>
);

/** Anonyme Figur in Daunenjacke mit Kapuze – ohne Gesicht, keine reale Person. */
const HoodedFigure: React.FC<{height: number}> = ({height}) => (
	<svg height={height} viewBox="0 0 300 400">
		<path d="M150 20 C105 20 88 58 90 96 C92 128 112 150 150 150 C188 150 208 128 210 96 C212 58 195 20 150 20 Z" fill="#141B3A" />
		<path d="M115 70 C120 120 180 120 185 70 C185 110 170 132 150 132 C130 132 115 110 115 70 Z" fill="#070A18" />
		<path d="M60 400 L70 210 C74 172 104 150 150 150 C196 150 226 172 230 210 L240 400 Z" fill="#141B3A" />
		{[210, 250, 290, 330, 370].map((y) => (
			<path key={y} d={`M68 ${y} Q150 ${y + 14} 232 ${y}`} stroke="#2B3A6B" strokeWidth={4} fill="none" />
		))}
	</svg>
);

/** Echte Meme-Spur (Wortlaut aus Referenz/Quelle), als neutrale Karte. */
const MemeCard: React.FC<{kind: string; text: string; badge?: string; aiLabel?: string; aiAt: number; rotate: number; delay: number; from: 'left' | 'right'}> = ({
	kind,
	text,
	badge,
	aiLabel,
	aiAt,
	rotate,
	delay,
	from,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = springIn({frame, fps, delay, damping: 13, stiffness: 160});
	const ai = aiLabel ? springIn({frame, fps, delay: aiAt, damping: 10, stiffness: 200}) : 0;
	if (frame < delay) return null;
	return (
		<div
			style={{
				position: 'relative',
				padding: '16px 20px',
				borderRadius: RADII.md,
				background: 'linear-gradient(160deg, rgba(30, 40, 84, 0.97), rgba(12, 17, 42, 0.97))',
				border: `2px solid ${COLORS.panelBorder}`,
				boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
				rotate: `${rotate}deg`,
				translate: `${(1 - s) * (from === 'left' ? -700 : 700)}px 0`,
				display: 'flex',
				flexDirection: 'column',
				gap: 8,
			}}
		>
			<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
				<div style={{width: 30, height: 30, borderRadius: 15, background: '#3A4789'}} />
				<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 24, color: COLORS.textMuted}}>{kind}</span>
				{badge ? (
					<span style={{marginLeft: 'auto', padding: '2px 12px', borderRadius: 6, background: '#FFFFFF', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 24, color: '#0B1029'}}>{badge}</span>
				) : null}
			</div>
			<span style={{fontFamily: FONTS.body, fontWeight: 800, fontSize: 30, lineHeight: 1.18, color: COLORS.text}}>{text}</span>
			{aiLabel && frame >= aiAt ? (
				<span
					style={{
						alignSelf: 'flex-start',
						padding: '4px 12px',
						borderRadius: 8,
						background: withAlpha(COLORS.alert, 0.9),
						fontFamily: FONTS.body,
						fontWeight: 800,
						fontSize: 23,
						color: '#FFFFFF',
						scale: String(0.6 + 0.4 * ai),
						opacity: Math.min(1, ai * 2),
					}}
				>
					TikTok-Label: „{aiLabel}“
				</span>
			) : null}
		</div>
	);
};

/** Szene 5: Das Meme der Nacht – „3 linke Schuhe“. Fokus: Bild → Meme; kurz: echt vs. KI. */
export const ShoesScene: React.FC<SceneProps> = ({cues}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s1 = cue(cues, 'shoe1', 6);
	const s2 = cue(cues, 'shoe2', s1.to + 6);
	const s3 = cue(cues, 'shoe3', s2.to + 6);
	const atThree = wordFrame(cues, 'drei', s1.from + 10);
	const atImage = wordFrame(cues, 'Bild', s2.from + 4);
	const atEdits = wordFrame(cues, 'Edits', s2.from + Math.round((s2.to - s2.from) * 0.7));
	const atMemes = wordFrame(cues, 'Memes', atEdits + 20);
	const atSnipes = wordFrame(cues, 'Snipes', s3.from + 30);
	const atAI = wordFrame(cues, 'KI-generiert', s3.from + Math.round((s3.to - s3.from) * 0.55));
	const atReal = wordFrame(cues, 'echt', s3.to - 12);
	const shrink = interpolate(frame, [atImage - 6, atImage + 10], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const cardsLift = interpolate(frame, [s3.from - 4, s3.from + 12], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const [post, hashtag, street] = SHOES.memes;

	return (
		<AbsoluteFill>
			<GridBackdrop accent={COLORS.signal} stops={['#0A1030', '#05081A']} particles={18} seed="shoes" />
			<SafeArea>
				<Kicker text={SHOES.kicker} color={COLORS.signal} delay={0} />
			</SafeArea>

			{/* Titel + Figur mit drei linken Schuhen */}
			<div style={{position: 'absolute', left: 64, width: 866, top: 280, opacity: 1 - cardsLift}}>
				<KineticText text={SHOES.title} highlight={['LINKE']} fontSize={104 - shrink * 30} delay={s1.from - 2} stagger={3} maxWidth={866} />
			</div>
			<div
				style={{
					position: 'absolute',
					left: 64,
					width: 866,
					top: 500 - shrink * 120,
					display: 'flex',
					justifyContent: 'center',
					scale: String(1 - shrink * 0.42),
					transformOrigin: '50% 0%',
					opacity: 1 - cardsLift,
				}}
			>
				<div style={{position: 'relative', width: 760, height: 560}}>
					<div style={{position: 'absolute', left: 0, top: 20}}>
						<HoodedFigure height={520} />
					</div>
					{[0, 1, 2].map((i) => {
						const s = springIn({frame, fps, delay: atThree + i * 5, damping: 11, stiffness: 180});
						return (
							<div key={i} style={{position: 'absolute', left: 330 + i * 24, top: 40 + i * 165, scale: String(s), opacity: Math.min(1, s * 2), rotate: `${-4 + i * 4}deg`}}>
								<Sneaker width={340} color={COLORS.signal} glow={0.6} />
								<span
									style={{
										position: 'absolute',
										right: -36,
										top: 6,
										width: 46,
										height: 46,
										borderRadius: 23,
										background: COLORS.alert,
										border: '3px solid #FFFFFF',
										fontFamily: FONTS.heading,
										fontWeight: 900,
										fontSize: 26,
										color: '#FFFFFF',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									L
								</span>
							</div>
						);
					})}
				</div>
			</div>
			<div style={{position: 'absolute', left: 64, top: 1068, opacity: (1 - shrink) * interpolate(frame, [atThree, atThree + 10], [0, 1], clamp)}}>
				<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, color: COLORS.textDim}}>{SHOES.figureNote}</span>
			</div>

			{/* Meme-Spuren (Wortlaut aus Referenz/Quelle) */}
			<div style={{position: 'absolute', left: 64, width: 866, top: 720 - cardsLift * 420, display: 'flex', flexDirection: 'column', gap: 16}}>
				<MemeCard kind={post.kind} text={post.text} badge={post.badge} aiLabel={post.aiLabel} aiAt={atAI} rotate={post.rotate} delay={atImage + 4} from="left" />
				<div style={{opacity: 1 - cardsLift}}>
					<MemeCard kind={hashtag.kind} text={hashtag.text} aiAt={atAI} rotate={hashtag.rotate} delay={atEdits} from="right" />
				</div>
				<div style={{opacity: 1 - cardsLift}}>
					<MemeCard kind={street.kind} text={street.text} aiAt={atAI} rotate={street.rotate} delay={atEdits + 10} from="left" />
				</div>
			</div>
			{frame >= atMemes - 4 && frame < s3.from + 4 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 1210, display: 'flex', gap: 12, opacity: 1 - cardsLift}}>
					{SHOES.labels.map((l, i) => (
						<PopIn key={l} delay={atMemes - 4 + i * 6}>
							<Pill color={i === 0 ? COLORS.signal : COLORS.cyan} dark={i !== 0} size={26}>
								{l}
							</Pill>
						</PopIn>
					))}
				</div>
			) : null}

			{/* Einordnung: echt vs. KI */}
			{frame >= atSnipes - 6 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 690}}>
					<PopIn delay={atSnipes - 6} from="right">
						<div style={{display: 'flex', gap: 16, alignItems: 'center', padding: '16px 20px', borderRadius: RADII.md, background: 'rgba(6, 30, 24, 0.95)', border: `2px solid ${COLORS.green}`}}>
							<svg width={52} height={52} viewBox="0 0 24 24" fill="none" stroke={COLORS.green} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
								<path d="M4 12l5 5L20 6" />
							</svg>
							<div style={{display: 'flex', flexDirection: 'column'}}>
								<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 31, color: COLORS.text, lineHeight: 1.15}}>{SHOES.real}</span>
								<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 23, color: COLORS.green}}>{SHOES.realSource}</span>
							</div>
						</div>
					</PopIn>
				</div>
			) : null}
			{frame >= atReal - 30 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 900, display: 'flex', justifyContent: 'center'}}>
					<PopIn delay={atReal - 30}>
						<Pill color={COLORS.alert} dark={false} size={32}>
							{SHOES.warning}
						</Pill>
					</PopIn>
				</div>
			) : null}
			<div style={{position: 'absolute', left: 64, width: 866, top: 1240, opacity: interpolate(frame, [s3.from, s3.from + 10], [0, 1], clamp)}}>
				<SourceCredit sources={SHOES.sources} />
			</div>

			<Sfx name="whoosh" at={s1.from} volume={0.7} />
			{[0, 1, 2].map((i) => (
				<Sfx key={`s-${i}`} name="pop" at={atThree + i * 5} />
			))}
			<Sfx name="notify" at={atImage + 4} />
			<Sfx name="notify" at={atEdits} volume={0.8} />
			<Sfx name="notify" at={atEdits + 10} volume={0.8} />
			<Sfx name="click" at={atMemes - 4} />
			<Sfx name="click" at={atMemes + 2} />
			<Sfx name="pop" at={atSnipes - 6} />
			<Sfx name="stamp" at={atAI} volume={0.7} />
			<Sfx name="softImpact" at={atReal - 30} volume={0.6} />
		</AbsoluteFill>
	);
};
