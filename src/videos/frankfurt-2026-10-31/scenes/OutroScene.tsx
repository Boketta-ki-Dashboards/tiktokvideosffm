import React from 'react';
import {AbsoluteFill} from 'remotion';
import {GradientSky} from '../../../components/backgrounds/GradientSky';
import {FollowCta} from '../../../components/cta/FollowCta';
import {COLORS} from '../../../theme/tokens';
import {OUTRO} from '../content';
import {cue, type SceneProps, wordFrame} from '../cues';

/** Abspann: „Danke fürs Zusehen“ + Finger tippt auf das Folgen-Plus + Kommentar-Aufforderung. */
export const OutroScene: React.FC<SceneProps> = ({cues}) => {
	const o = cue(cues, 'outro', 8);
	const tapFrame = wordFrame(cues, 'Plus', o.from + Math.round((o.to - o.from) * 0.32)) + 6;
	const commentFrame = wordFrame(cues, 'Kommentare', o.from + Math.round((o.to - o.from) * 0.55));
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night}}>
			<GradientSky stops={['#0A0E2A', '#1C1650', '#3A1F6B']} glowY={0.45} glowColor="#6D4BE0" glowStrength={0.5} />
			<FollowCta
				tapFrame={tapFrame}
				commentFrame={commentFrame}
				title={OUTRO.title}
				commentPrompt={OUTRO.commentPrompt}
			/>
		</AbsoluteFill>
	);
};
