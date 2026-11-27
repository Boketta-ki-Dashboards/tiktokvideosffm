import React from 'react';
import {AbsoluteFill} from 'remotion';
import {GradientSky} from '../../../components/backgrounds/GradientSky';
import {FollowCta} from '../../../components/cta/FollowCta';
import {COLORS} from '../../../theme/tokens';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';

/** Kompaktes Outro (≈ 2–3 s): gleiches Design wie Folge 1, Branding aus src/theme/brand.ts. */
export const OutroScene: React.FC<SceneProps> = ({cues}) => {
	const o = cue(cues, 'outro', 4);
	const tapFrame = wordFrame(cues, 'Plus', o.from + Math.round((o.to - o.from) * 0.45)) + 4;
	const commentFrame = Math.max(tapFrame + 12, wordFrame(cues, 'nicht', o.from + Math.round((o.to - o.from) * 0.75)));
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night}}>
			<GradientSky stops={['#140816', '#2A0E2A', '#4A1230']} glowY={0.45} glowColor="#C2283C" glowStrength={0.45} />
			<FollowCta tapFrame={tapFrame} commentFrame={commentFrame} avatarRadius={115} commentPrompt="Welches Thema als Nächstes?" />
		</AbsoluteFill>
	);
};
