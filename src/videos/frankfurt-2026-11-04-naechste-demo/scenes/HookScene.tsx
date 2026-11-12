import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Clouds} from '../../../components/backgrounds/Clouds';
import {EmergencyLights} from '../../../components/backgrounds/EmergencyLights';
import {FrankfurtSkyline} from '../../../components/backgrounds/FrankfurtSkyline';
import {GradientSky} from '../../../components/backgrounds/GradientSky';
import {Stars} from '../../../components/backgrounds/Stars';
import {CalendarCard} from '../../../components/calendar/CalendarCard';
import {Camera} from '../../../components/camera/Camera';
import {SafeArea} from '../../../components/layout/SafeArea';
import {Kicker} from '../../../components/text/Kicker';
import {KineticText} from '../../../components/text/KineticText';
import {clamp, EASE_IN, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {COLORS, FONTS, RADII} from '../../../theme/tokens';
import {cue, type SceneProps} from '../../frankfurt-2026-10-31/cues';
import {terminById} from '../termine';

const NEUTRAL = '#7C8CFF';

/** Szene 1: Skyline bei Nacht, Kamerafahrt auf die Innenstadt, drei Kalenderkarten, Titel „FRANKFURT PART 2?“. */
export const HookScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const h1 = cue(cues, 'hook1', 4);
	const h2 = cue(cues, 'hook2', h1.to + 4);
	const h3 = cue(cues, 'hook3', h2.to + 4);
	const t14 = terminById('14-11');
	const t20 = terminById('20-11');
	const t21 = terminById('21-11');
	// Fahrt „in die Stadt hinein“ am Ende – leitet zur nächsten Szene über
	const diveIn = interpolate(frame, [durationInFrames - 26, durationInFrames], [0, 1], {...clamp, easing: EASE_IN});
	const push = interpolate(frame, [0, durationInFrames - 26], [0, 1], clamp);
	const subIn = springIn({frame, fps, delay: h1.from + 18, damping: 13});
	const mid = h2.from + Math.round((h2.to - h2.from) * 0.55);
	const cardW = 262;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night}}>
			<Camera
				keyframes={[
					{frame: 0, zoom: 1.12, y: 40},
					{frame: Math.max(1, durationInFrames - 26), zoom: 1.0 + push * 0.12, y: 0},
					{frame: durationInFrames, zoom: 1.12 + diveIn * 0.9, y: -120 * diveIn},
				]}
			>
				<GradientSky stops={['#060A22', '#151548', '#3A1D55', '#7A2C55']} glowY={0.7} glowColor="#C2454F" glowStrength={0.5} />
				<Stars count={80} maxY={0.35} opacity={0.6} />
				<Clouds count={5} opacity={0.08} band={[0.12, 0.38]} speed={0.5} />
				<AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center'}}>
					<FrankfurtSkyline width={1560} litRatio={0.26} style={{marginBottom: -40}} />
				</AbsoluteFill>
				<EmergencyLights intensity={0.3} y={0.86} />
			</Camera>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(6,9,26,0.88) 0%, rgba(6,9,26,0.4) 45%, rgba(6,9,26,0) 68%)'}} />

			<SafeArea>
				<Kicker text="FOLGE 3 · NACH DEM 31. OKTOBER" color={COLORS.signal} live delay={0} />
				<div style={{position: 'absolute', top: 270, left: 64, width: 866}}>
					<KineticText text="FRANKFURT PART 2?" highlight={['PART', '2?']} fontSize={124} delay={4} stagger={4} maxWidth={866} lineHeight={0.98} />
				</div>

				{/* Drei Kalenderkarten */}
				<div style={{position: 'absolute', top: 640, left: 64, width: 866, display: 'flex', justifyContent: 'space-between'}}>
					<CalendarCard day={14} weekday={t14.wochentag} color={NEUTRAL} from="left" delay={h2.from - 2} width={cardW} tilt={-5} questionMark />
					<CalendarCard day={20} weekday={t20.wochentag} color={NEUTRAL} from="bottom" delay={h3.from + 2} width={cardW} tilt={2} floatPhase={1.7} style={{marginTop: -26}} />
					<CalendarCard day={21} weekday={t21.wochentag} color={NEUTRAL} from="right" delay={mid} width={cardW} tilt={5} floatPhase={3.1} questionMark />
				</div>

				{/* Untertitel-Pille */}
				<div
					style={{
						position: 'absolute',
						top: 1040,
						left: 64,
						width: 866,
						display: 'flex',
						justifyContent: 'center',
						opacity: Math.min(1, subIn * 1.6),
						scale: String(0.8 + 0.2 * subIn),
					}}
				>
					<div
						style={{
							padding: '14px 36px',
							borderRadius: RADII.pill,
							background: COLORS.signal,
							border: '4px solid #0B1029',
							boxShadow: `0 12px 40px ${withAlpha('#000000', 0.5)}`,
							fontFamily: FONTS.heading,
							fontWeight: 900,
							fontSize: 46,
							letterSpacing: 2,
							color: '#0B1029',
						}}
					>
						WANN GEHT ES WEITER?
					</div>
				</div>
			</SafeArea>
		</AbsoluteFill>
	);
};
