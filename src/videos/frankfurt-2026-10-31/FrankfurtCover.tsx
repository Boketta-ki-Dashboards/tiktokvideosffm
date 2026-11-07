import React from 'react';
import {Sequence} from 'remotion';
import {ensureFontsLoaded} from '../../theme/fonts';
import {IntroScene} from './scenes/IntroScene';

ensureFontsLoaded();

/** Bild der Intro-Szene, in dem Titel und Datum vollständig stehen. */
const COVER_FRAME = 75;

/**
 * TikTok-Titelbild (Cover).
 * Hinweis: In einer <Still> wird useCurrentFrame() auf 0 begrenzt – <Freeze> greift dort nicht.
 * Eine Sequence mit negativem `from` verschiebt die Zeit der Kinder auf COVER_FRAME.
 */
export const FrankfurtCover: React.FC = () => (
	<Sequence from={-COVER_FRAME} name="Cover (Intro-Frame)">
		<IntroScene cues={{}} durationInFrames={90} />
	</Sequence>
);
