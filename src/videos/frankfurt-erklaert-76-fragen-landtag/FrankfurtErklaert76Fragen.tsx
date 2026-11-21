import React from 'react';
import type {CalculateMetadataFunction} from 'remotion';
import {circleReveal, whipPan, zoomThrough} from '../../components/transitions/presentations';
import {type ErklaertEpisode, ErklaertFrame, type ErklaertProps, erklaertSchema, erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import type {VoiceoverManifest} from '../../lib/script-timing';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import {FRAGEN76_KEYWORDS, FRAGEN76_SCENES} from './plan';
import {DocsScene, HookScene, NoteScene, OutroScene, Q1Scene, Q2Scene, Q3Scene, Q4Scene, SessionScene} from './scenes/Scenes';
import script from './script.json';
import voiceoverManifest from './voiceover.json';

ensureFontsLoaded();

/** Format B „Frankfurt erklärt in 60 Sekunden“ – #02: 76 Fragen nach der Krawallnacht (Teil 1: die Fragen). */
export const FRAGEN76_EPISODE: ErklaertEpisode = {
	episode: '#02',
	scenes: FRAGEN76_SCENES,
	keywords: FRAGEN76_KEYWORDS,
	components: {hook: HookScene, docs: DocsScene, q1: Q1Scene, q2: Q2Scene, q3: Q3Scene, q4: Q4Scene, session: SessionScene, note: NoteScene, outro: OutroScene},
	transitions: {
		docs: zoomThrough({strength: 0.45, blur: 8}),
		q1: whipPan(),
		q2: whipPan(),
		q3: whipPan(),
		q4: whipPan(),
		session: zoomThrough({strength: 0.45, blur: 8}),
		note: circleReveal({x: '50%', y: '45%'}),
		outro: circleReveal({x: '50%', y: '40%'}),
	},
	script: {tailMs: script.tailMs, maxDurationMs: script.maxDurationMs},
};

export const erklaert76Schema = erklaertSchema;

export const erklaert76DefaultProps: ErklaertProps = {
	subtitles: true,
	sfx: true,
	music: true,
	voiceVolume: 1,
	sfxVolume: 1,
	showSafeArea: false,
	voiceover: voiceoverManifest as VoiceoverManifest,
};

export const calculateErklaert76Metadata: CalculateMetadataFunction<ErklaertProps> = ({props}) => {
	const timeline = erklaertTimeline(FRAGEN76_EPISODE, props.voiceover, VIDEO.fps);
	return {durationInFrames: timeline.durationInFrames, props: {...props, timeline}};
};

export const FrankfurtErklaert76Fragen: React.FC<ErklaertProps> = (props) => <ErklaertFrame ep={FRAGEN76_EPISODE} {...props} />;
