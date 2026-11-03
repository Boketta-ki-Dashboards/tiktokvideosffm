import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Clouds} from '../../../components/backgrounds/Clouds';
import {FrankfurtSkyline} from '../../../components/backgrounds/FrankfurtSkyline';
import {GradientSky} from '../../../components/backgrounds/GradientSky';
import {Stars} from '../../../components/backgrounds/Stars';
import {Camera} from '../../../components/camera/Camera';
import {EmergencyLights} from '../../../components/backgrounds/EmergencyLights';
import {AnimatedNumber} from '../../../components/infographics/AnimatedNumber';
import {SafeArea} from '../../../components/layout/SafeArea';
import {Kicker} from '../../../components/text/Kicker';
import {KineticText} from '../../../components/text/KineticText';
import {clamp, EASE_IN, EASE_OUT, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {COLORS, FONTS, RADII} from '../../../theme/tokens';
import {STATUS_STYLE} from '../../../components/media/ShopCard';
import {SHOP_DATA} from '../shops';
import {cue, type SceneProps} from '../../frankfurt-2026-10-31/cues';

const BigStat: React.FC<{value: number; label: string; source: string; color: string; delay: number}> = ({value, label, source, color, delay}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = springIn({frame, fps, delay, damping: 11, stiffness: 140});
	const glow = 0.5 + 0.5 * Math.sin((frame - delay) * 0.12);
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 28,
				padding: '18px 34px 18px 26px',
				borderRadius: RADII.lg,
				background: 'rgba(8, 11, 30, 0.82)',
				border: `3px solid ${withAlpha(color, 0.8)}`,
				boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 ${40 + glow * 30}px ${withAlpha(color, 0.35)}`,
				opacity: Math.min(1, s * 1.5),
				scale: String(0.6 + 0.4 * s),
				translate: `${(1 - s) * -120}px 0`,
			}}
		>
			<AnimatedNumber
				value={value}
				delay={delay + 2}
				durationInFrames={value > 9 ? 24 : 14}
				style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 190, lineHeight: 0.95, color, textShadow: `0 0 40px ${withAlpha(color, 0.6)}`}}
			/>
			<div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
				<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 48, lineHeight: 1.05, color: COLORS.text}}>{label}</span>
				<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 24, color: COLORS.textMuted}}>{source}</span>
			</div>
		</div>
	);
};

/** Szene 1: Skyline bei Nacht + die offiziellen Zahlen 17 / 5 + Leitfrage. */
export const HookScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const h1 = cue(cues, 'hook1', 4);
	const h2 = cue(cues, 'hook2', h1.to + 4);
	const h3 = cue(cues, 'hook3', h2.to + 4);
	const off = SHOP_DATA.meta.offiziell;
	// Am Ende Fahrt „in die Stadt hinein“ – leitet zur Karte über
	const diveIn = interpolate(frame, [durationInFrames - 26, durationInFrames], [0, 1], {...clamp, easing: EASE_IN});
	const statsOut = interpolate(frame, [h3.from - 4, h3.from + 8], [1, 0.0], clamp);
	const questionIn = interpolate(frame, [h3.from - 2, h3.from + 10], [0, 1], {...clamp, easing: EASE_OUT});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night}}>
			<Camera
				keyframes={[
					{frame: 0, zoom: 1.12, y: 40},
					{frame: Math.max(1, durationInFrames - 26), zoom: 1.0, y: 0},
					{frame: durationInFrames, zoom: 1.0 + diveIn * 0.9, y: -120 * diveIn},
				]}
			>
				<GradientSky stops={['#060A22', '#151548', '#3A1D55', '#7A2C55']} glowY={0.7} glowColor="#C2454F" glowStrength={0.5} />
				<Stars count={80} maxY={0.35} opacity={0.6} />
				<Clouds count={5} opacity={0.08} band={[0.12, 0.38]} speed={0.5} />
				<AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center'}}>
					<FrankfurtSkyline width={1560} litRatio={0.26} style={{marginBottom: -40}} />
				</AbsoluteFill>
				<EmergencyLights intensity={0.35} y={0.86} />
			</Camera>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(6,9,26,0.85) 0%, rgba(6,9,26,0.35) 40%, rgba(6,9,26,0) 60%)'}} />

			<SafeArea>
				<div style={{display: 'flex', flexDirection: 'column', gap: 30, marginTop: 6}}>
					<Kicker text="FOLGE 2 · KRAWALLNACHT FRANKFURT" color={COLORS.alert} live delay={0} />
					<div style={{display: 'flex', flexDirection: 'column', gap: 22, opacity: statsOut, marginTop: 24}}>
						<BigStat
							value={off.beschaedigt.anzahl}
							label="Geschäfte beschädigt"
							source="laut Innenministerium"
							color={STATUS_STYLE.beschaedigt.color}
							delay={Math.max(2, h1.from - 2)}
						/>
						<BigStat
							value={off.gepluendert.anzahl}
							label="davon geplündert"
							source="laut erster Polizeibilanz"
							color={STATUS_STYLE.gepluendert.color}
							delay={Math.max(10, h2.from - 2)}
						/>
					</div>
					<div style={{position: 'absolute', top: 360, left: 64, right: 150, opacity: questionIn}}>
						{frame >= h3.from - 2 ? (
							<KineticText text="Welche Läden hat es wirklich getroffen?" highlight={['wirklich', 'getroffen?']} fontSize={92} delay={h3.from - 2} stagger={3} maxWidth={866} />
						) : null}
					</div>
				</div>
			</SafeArea>
		</AbsoluteFill>
	);
};
