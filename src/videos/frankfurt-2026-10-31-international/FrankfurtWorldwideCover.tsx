import React from 'react';
import {Sequence} from 'remotion';
import {ensureFontsLoaded} from '../../theme/fonts';
import type {Cues} from '../frankfurt-2026-10-31/cues';
import {HookScene} from './scenes/HookScene';

ensureFontsLoaded();

const COVER_CUES = {hook1: {from: 4, to: 40}, hook2: {from: 46, to: 110}, words: {plötzlich: 50, Welt: 96}} as unknown as Cues;

/** TikTok-Cover „Wie Frankfurt weltweit Schlagzeilen machte“: Hook-Bild mit allen Medien-Wortmarken (siehe Hinweis zu <Still> in CLAUDE.md). */
export const FrankfurtWorldwideCover: React.FC = () => (
	<Sequence from={-120} name="Cover (Hook-Frame)">
		<HookScene cues={COVER_CUES} durationInFrames={600} />
	</Sequence>
);
