import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {FrankfurtSkyline} from '../../../components/backgrounds/FrankfurtSkyline';
import {GradientSky} from '../../../components/backgrounds/GradientSky';
import {Camera} from '../../../components/camera/Camera';
import {Crowd} from '../../../components/characters/Crowd';
import {ComparisonBars} from '../../../components/infographics/ComparisonBars';
import {SafeArea} from '../../../components/layout/SafeArea';
import {SourceCredit} from '../../../components/media/SourceCredit';
import {Kicker} from '../../../components/text/Kicker';
import {KineticText} from '../../../components/text/KineticText';
import {clamp, EASE_OUT, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {COLORS, FONTS, RADII} from '../../../theme/tokens';
import {DEMANDS, TURNOUT} from '../content';
import {cue, type SceneProps} from '../cues';

const DemandChip: React.FC<{text: string; delay: number}> = ({text, delay}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = springIn({frame, fps, delay, damping: 14});
	return (
		<div
			style={{
				padding: '10px 20px',
				borderRadius: RADII.pill,
				background: withAlpha(COLORS.cyan, 0.16),
				border: `2px solid ${withAlpha(COLORS.cyan, 0.6)}`,
				fontFamily: FONTS.body,
				fontWeight: 700,
				fontSize: 27,
				color: COLORS.text,
				scale: String(s),
				opacity: Math.min(1, s * 1.5),
			}}
		>
			{text}
		</div>
	);
};

/** Szene 2: Demonstrationszug vor der Skyline + Teilnehmerzahlen (Polizei vs. Veranstalter). */
export const ProtestScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const c = cue(cues, 'protest', 6);
	const barsDelay = Math.max(8, c.from + Math.round((c.to - c.from) * 0.45));
	const panelIn = interpolate(frame, [4, 22], [0, 1], {...clamp, easing: EASE_OUT});
	const barsPanelIn = interpolate(frame, [barsDelay - 8, barsDelay + 4], [0, 1], {...clamp, easing: EASE_OUT});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night}}>
			<Camera keyframes={[{frame: 0, zoom: 1.0, x: 30}, {frame: durationInFrames, zoom: 1.06, x: -30}]}>
				<GradientSky stops={['#0B1035', '#2A1E5E', '#6B2F6E', '#C2556B']} glowY={0.7} glowStrength={0.45} />
				<AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center'}}>
					<FrankfurtSkyline
						width={1700}
						showRiver={false}
						showBridge={false}
						litRatio={0.34}
						style={{marginBottom: 20, opacity: 0.92}}
					/>
				</AbsoluteFill>
				{/* Straße */}
				<AbsoluteFill style={{top: 1560, background: 'linear-gradient(#1A1B3D, #0A0B1F)'}} />
				<AbsoluteFill>
					<svg width={1080} height={1920}>
						<Crowd width={1080} baseY={1880} rows={4} perRow={11} personHeight={250} marchSpeed={1.6} signRatio={0.3} />
					</svg>
				</AbsoluteFill>
			</Camera>

			<AbsoluteFill style={{background: 'linear-gradient(rgba(7,11,26,0.85) 0%, rgba(7,11,26,0.55) 45%, rgba(7,11,26,0) 62%)'}} />

			<SafeArea>
				<div style={{display: 'flex', flexDirection: 'column', gap: 26, marginTop: 10, opacity: panelIn}}>
					<Kicker text="GEN-Z-PROTEST" color={COLORS.violet} delay={2} />
					<KineticText text={`Demo der Initiative ${DEMANDS.organizer}`} highlight={['„Gen', 'Z', 'regelt“']} delay={6} stagger={3} fontSize={66} maxWidth={860} />
					<div style={{display: 'flex', flexWrap: 'wrap', gap: 12}}>
						{DEMANDS.items.map((d, i) => (
							<DemandChip key={d} text={d} delay={14 + i * 5} />
						))}
					</div>
					<SourceCredit sources={[DEMANDS.source]} delay={26} />
					<div
						style={{
							marginTop: 14,
							padding: '26px 28px',
							borderRadius: RADII.lg,
							background: 'rgba(10, 14, 36, 0.86)',
							border: `2px solid ${COLORS.panelBorder}`,
							opacity: barsPanelIn,
							translate: `0 ${(1 - barsPanelIn) * 40}px`,
						}}
					>
						<ComparisonBars
							title={TURNOUT.title}
							items={TURNOUT.items.map((it, i) => ({...it, color: i === 0 ? COLORS.signal : COLORS.cyan}))}
							delay={barsDelay}
							width={808}
						/>
						<SourceCredit sources={[TURNOUT.source]} delay={barsDelay + 10} style={{marginTop: 18}} />
					</div>
				</div>
			</SafeArea>
		</AbsoluteFill>
	);
};
