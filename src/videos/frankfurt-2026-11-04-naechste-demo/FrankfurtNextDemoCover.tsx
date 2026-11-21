import React from 'react';
import {Sequence} from 'remotion';
import {ensureFontsLoaded} from '../../theme/fonts';
import {HookScene} from './scenes/HookScene';

ensureFontsLoaded();

/** TikTok-Cover Folge 3: Hook-Bild mit allen drei Kalenderkarten (siehe Hinweis zu <Still> in CLAUDE.md). */
export const FrankfurtNextDemoCover: React.FC = () => (
	<Sequence from={-135} name="Cover (Hook-Frame)">
		<HookScene cues={{hook1: {from: 4, to: 40}, hook2: {from: 44, to: 70}, hook3: {from: 74, to: 140}}} durationInFrames={500} />
	</Sequence>
);
