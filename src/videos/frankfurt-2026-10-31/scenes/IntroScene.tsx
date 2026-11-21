import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Clouds} from '../../../components/backgrounds/Clouds';
import {FrankfurtSkyline} from '../../../components/backgrounds/FrankfurtSkyline';
import {GradientSky} from '../../../components/backgrounds/GradientSky';
import {Stars} from '../../../components/backgrounds/Stars';
import {Camera} from '../../../components/camera/Camera';
import {SafeArea} from '../../../components/layout/SafeArea';
import {DateBadge} from '../../../components/text/DateBadge';
import {Kicker} from '../../../components/text/Kicker';
import {KineticText} from '../../../components/text/KineticText';
import {clamp, EASE_OUT} from '../../../lib/animation';
import {COLORS} from '../../../theme/tokens';
import {TITLE} from '../content';
import type {SceneProps} from '../cues';

/** Szene 1: Drohnenflug auf die Frankfurter Skyline in der Abenddämmerung + Titel. */
export const IntroScene: React.FC<SceneProps> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const skylineRise = interpolate(frame, [0, 40], [90, 0], {...clamp, easing: EASE_OUT});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night}}>
			<Camera
				keyframes={[
					{frame: 0, zoom: 1.18, y: 60},
					{frame: durationInFrames, zoom: 1.02, y: 0},
				]}
			>
				<GradientSky stops={['#0A1033', '#2C1D63', '#8E3B7A', '#F07A6A', '#FFC07A']} glowY={0.66} glowStrength={0.7} />
				<Stars count={90} maxY={0.35} opacity={0.7} />
				<Clouds count={6} opacity={0.1} band={[0.12, 0.4]} speed={0.6} />
				<AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', translate: `0 ${skylineRise}px`}}>
					<FrankfurtSkyline
						width={1560}
						litRatio={0.3}
						palette={{
							far: '#3A2F73',
							mid: '#2A2560',
							near: '#211E52',
							front: '#16163D',
							glass: '#33307A',
							glassHi: '#6A5FC4',
							light: '#4C4596',
							stone: '#5E2D5E',
							waterTop: '#4A2E6E',
							waterBottom: '#0B0C2A',
						}}
						style={{marginBottom: -40}}
					/>
				</AbsoluteFill>
			</Camera>

			<SafeArea>
				<div style={{display: 'flex', flexDirection: 'column', gap: 30, marginTop: 40}}>
					<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
						<div style={{display: 'flex', flexDirection: 'column', gap: 26}}>
							<Kicker text={TITLE.kicker} live delay={0} />
						</div>
						<DateBadge day="31" month="OKT" year="2026" delay={6} />
					</div>
					<KineticText text={TITLE.headline} highlight={TITLE.highlight} delay={4} stagger={4} fontSize={100} maxWidth={860} />
				</div>
			</SafeArea>
		</AbsoluteFill>
	);
};
