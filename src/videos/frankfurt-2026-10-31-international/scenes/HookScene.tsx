import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {Clouds} from '../../../components/backgrounds/Clouds';
import {EmergencyLights} from '../../../components/backgrounds/EmergencyLights';
import {FrankfurtSkyline} from '../../../components/backgrounds/FrankfurtSkyline';
import {GradientSky} from '../../../components/backgrounds/GradientSky';
import {Stars} from '../../../components/backgrounds/Stars';
import {Camera} from '../../../components/camera/Camera';
import {SafeArea} from '../../../components/layout/SafeArea';
import {Flag} from '../../../components/media/flags/Flag';
import {MediaBadge} from '../../../components/media/MediaBadge';
import {Kicker} from '../../../components/text/Kicker';
import {KineticText} from '../../../components/text/KineticText';
import {clamp, EASE_IN, springIn} from '../../../lib/animation';
import {COLORS} from '../../../theme/tokens';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {mediaById, TITLE} from '../content';

/** Wortmarken, die beim „ganzen Welt“ um den Titel aufploppen (alle belegt in data/medien.json). */
const CHIPS: Array<{id: string; x: number; y: number}> = [
	{id: 'cbs', x: 70, y: 850},
	{id: 'independent', x: 420, y: 820},
	{id: 'orf', x: 740, y: 900},
	{id: 'aljazeera', x: 90, y: 960},
	{id: 'koreatimes', x: 430, y: 980},
	{id: 'lanacion', x: 60, y: 1080},
	{id: 'abc', x: 400, y: 1110},
	{id: 'businesstoday', x: 620, y: 1060},
];

/** Szene 1: Skyline bei Nacht – „Eine Nacht in Frankfurt …“, dann ploppen Medien aus aller Welt auf. */
export const HookScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const h1 = cue(cues, 'hook1', 4);
	const h2 = cue(cues, 'hook2', h1.to + 6);
	const worldAt = wordFrame(cues, 'Welt', h2.from + Math.round((h2.to - h2.from) * 0.6));
	const chipsFrom = wordFrame(cues, 'plötzlich', h2.from) + 4;
	const diveIn = interpolate(frame, [durationInFrames - 24, durationInFrames], [0, 1], {...clamp, easing: EASE_IN});
	const push = interpolate(frame, [0, durationInFrames - 24], [0, 1], clamp);

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night}}>
			<Camera
				keyframes={[
					{frame: 0, zoom: 1.1, y: 30},
					{frame: Math.max(1, durationInFrames - 24), zoom: 1.0 + push * 0.1, y: 0},
					{frame: durationInFrames, zoom: 1.1 + diveIn * 0.8, y: -100 * diveIn},
				]}
			>
				<GradientSky stops={['#050920', '#121446', '#331B52', '#6E2A52']} glowY={0.72} glowColor="#C2454F" glowStrength={0.45} />
				<Stars count={90} maxY={0.4} opacity={0.6} />
				<Clouds count={5} opacity={0.07} band={[0.1, 0.36]} speed={0.5} />
				<AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center'}}>
					<FrankfurtSkyline width={1560} litRatio={0.28} style={{marginBottom: -40}} />
				</AbsoluteFill>
				<EmergencyLights intensity={0.26} y={0.86} />
			</Camera>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(6,9,26,0.9) 0%, rgba(6,9,26,0.45) 48%, rgba(6,9,26,0) 70%)'}} />

			<SafeArea>
				<Kicker text={TITLE.kicker} color={COLORS.alert} live delay={-20} />
				<div style={{position: 'absolute', top: 280, left: 64, width: 866}}>
					{/* Titel ist ab Frame 0 lesbar (TikTok-Vorschaubild) */}
					<KineticText text={TITLE.headline} highlight={TITLE.highlight} fontSize={98} delay={-24} stagger={3} maxWidth={866} lineHeight={1.0} />
				</div>
			</SafeArea>

			{/* Medien-Wortmarken mit Flagge – je eine echte, belegte Berichterstattung */}
			{CHIPS.map((c, i) => {
				const m = mediaById(c.id);
				const delay = chipsFrom + i * 4;
				const s = springIn({frame, fps, delay, damping: 11, stiffness: 170});
				if (frame < delay) {
					return null;
				}

				const bob = Math.sin((frame + random(`hook-${c.id}`) * 100) / 18) * 6;
				return (
					<div
						key={c.id}
						style={{
							position: 'absolute',
							left: c.x,
							top: c.y + bob,
							display: 'flex',
							alignItems: 'center',
							gap: 10,
							padding: '8px 14px 8px 10px',
							borderRadius: 999,
							background: 'rgba(8, 12, 32, 0.86)',
							border: `2px solid ${COLORS.panelBorder}`,
							scale: String(0.4 + 0.6 * s),
							opacity: Math.min(1, s * 1.5),
							rotate: `${(random(`rot-${c.id}`) - 0.5) * 8}deg`,
						}}
					>
						<Flag code={m.country} width={42} rounded={4} shadow={false} />
						<MediaBadge name={m.outlet} size="sm" />
					</div>
				);
			})}

			{CHIPS.map((c, i) => (
				<Sfx key={`s-${c.id}`} name={i % 2 === 0 ? 'pop' : 'click'} at={chipsFrom + i * 4} volume={0.7} />
			))}
			<Sfx name="notify" at={worldAt} />
		</AbsoluteFill>
	);
};
