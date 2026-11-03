import React from 'react';
import {Sequence} from 'remotion';
import {ensureFontsLoaded} from '../../theme/fonts';
import {HookScene} from './scenes/HookScene';

ensureFontsLoaded();

/** TikTok-Cover Folge 2: Hook-Bild mit beiden Zahlen (siehe Hinweis zu <Still> in CLAUDE.md). */
export const FrankfurtShopsCover: React.FC = () => (
	<Sequence from={-70} name="Cover (Hook-Frame)">
		<HookScene cues={{hook1: {from: 4, to: 40}, hook2: {from: 44, to: 70}, hook3: {from: 400, to: 460}}} durationInFrames={500} />
	</Sequence>
);
