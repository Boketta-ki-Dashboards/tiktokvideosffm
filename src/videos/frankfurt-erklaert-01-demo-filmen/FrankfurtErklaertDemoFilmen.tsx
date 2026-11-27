import React from 'react';
import type {CalculateMetadataFunction} from 'remotion';
import {circleReveal, whipPan, zoomThrough} from '../../components/transitions/presentations';
import {type ErklaertEpisode, ErklaertFrame, type ErklaertProps, erklaertSchema, erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import type {VoiceoverManifest} from '../../lib/script-timing';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import {DEMO_FILMEN_KEYWORDS, DEMO_FILMEN_SCENES} from './plan';
import {DemoScene} from './scenes/DemoScene';
import {DissolveScene} from './scenes/DissolveScene';
import {FazitScene} from './scenes/FazitScene';
import {FilmScene} from './scenes/FilmScene';
import {HookScene} from './scenes/HookScene';
import {OutroScene} from './scenes/OutroScene';
import {PoliceScene} from './scenes/PoliceScene';
import script from './script.json';
import voiceoverManifest from './voiceover.json';

ensureFontsLoaded();

/** Format B „Frankfurt erklärt in 60 Sekunden“ – Folge #01: Nur gefilmt – trotzdem Ärger? */
export const DEMO_FILMEN_EPISODE: ErklaertEpisode = {
	episode: '#01',
	scenes: DEMO_FILMEN_SCENES,
	keywords: DEMO_FILMEN_KEYWORDS,
	components: {hook: HookScene, demo: DemoScene, film: FilmScene, police: PoliceScene, dissolve: DissolveScene, fazit: FazitScene, outro: OutroScene},
	transitions: {
		demo: zoomThrough({strength: 0.5, blur: 10}),
		film: whipPan(),
		police: whipPan(),
		dissolve: zoomThrough({strength: 0.45, blur: 8}),
		fazit: circleReveal({x: '50%', y: '45%'}),
		outro: circleReveal({x: '50%', y: '40%'}),
	},
	script: {tailMs: script.tailMs, maxDurationMs: script.maxDurationMs},
};

export const erklaertDemoFilmenSchema = erklaertSchema;

export const erklaertDemoFilmenDefaultProps: ErklaertProps = {
	subtitles: true,
	sfx: true,
	music: true,
	voiceVolume: 1,
	sfxVolume: 1,
	showSafeArea: false,
	voiceover: voiceoverManifest as VoiceoverManifest,
};

export const calculateErklaertDemoFilmenMetadata: CalculateMetadataFunction<ErklaertProps> = ({props}) => {
	const timeline = erklaertTimeline(DEMO_FILMEN_EPISODE, props.voiceover, VIDEO.fps);
	return {durationInFrames: timeline.durationInFrames, props: {...props, timeline}};
};

export const FrankfurtErklaertDemoFilmen: React.FC<ErklaertProps> = (props) => <ErklaertFrame ep={DEMO_FILMEN_EPISODE} {...props} />;
