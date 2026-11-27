import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {GradientSky} from '../../../components/backgrounds/GradientSky';
import {SafeArea} from '../../../components/layout/SafeArea';
import {HeadlineCard} from '../../../components/media/HeadlineCard';
import {MediaBadge} from '../../../components/media/MediaBadge';
import {SourceCredit} from '../../../components/media/SourceCredit';
import {Kicker} from '../../../components/text/Kicker';
import {KineticText} from '../../../components/text/KineticText';
import {clamp, EASE_OUT, springIn} from '../../../lib/animation';
import {COLORS, FONTS} from '../../../theme/tokens';
import {FINAL_SOURCES, HEADLINES, MORE_OUTLETS} from '../content';
import type {SceneProps} from '../cues';

const Card: React.FC<{index: number; children: React.ReactNode}> = ({index, children}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = springIn({frame, fps, delay: 3 + index * 5, damping: 16, stiffness: 170});
	return (
		<div
			style={{
				translate: `0 ${(1 - s) * 160}px`,
				opacity: Math.min(1, s * 1.6),
				rotate: `${(1 - s) * (index % 2 ? 4 : -4)}deg`,
			}}
		>
			{children}
		</div>
	);
};

/** Szene 5 (Outro): Medienübersicht mit echten Schlagzeilen im Wortlaut + Quellen. */
export const MediaScene: React.FC<SceneProps> = () => {
	const frame = useCurrentFrame();
	const moreIn = interpolate(frame, [20, 32], [0, 1], {...clamp, easing: EASE_OUT});
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night}}>
			<GradientSky stops={['#070B1A', '#0F1638', '#1B2152']} glowY={0.15} glowColor="#3B4FC4" glowStrength={0.4} />
			<SafeArea>
				<div style={{display: 'flex', flexDirection: 'column', gap: 18}}>
					<Kicker text="MEDIENÜBERSICHT" color={COLORS.signal} delay={0} style={{marginBottom: -4}} />
					<KineticText text="Die Schlagzeilen im Wortlaut" highlight={['Wortlaut']} delay={2} stagger={3} fontSize={58} maxWidth={866} />
					{HEADLINES.map((h, i) => (
						<Card key={h.outlet} index={i}>
							<HeadlineCard {...h} width={866} />
						</Card>
					))}
					<div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, opacity: moreIn, marginTop: 4}}>
						<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, color: COLORS.textMuted}}>Außerdem u. a.:</span>
						{MORE_OUTLETS.map((o) => (
							<MediaBadge key={o} name={o} size="sm" accent={COLORS.cyan} />
						))}
					</div>
					<SourceCredit sources={[...FINAL_SOURCES, 'Stand 03.11.2026']} label="Quelle" delay={24} />
				</div>
			</SafeArea>
		</AbsoluteFill>
	);
};
