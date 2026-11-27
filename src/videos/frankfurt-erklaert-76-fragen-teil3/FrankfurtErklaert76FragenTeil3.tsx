import React from 'react';
import type {CalculateMetadataFunction} from 'remotion';
import {flashCut, whipPan, zoomThrough} from '../../components/transitions/presentations';
import {type ErklaertEpisode, ErklaertFrame, type ErklaertProps, erklaertSchema, erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import type {VoiceoverManifest} from '../../lib/script-timing';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import {TEIL3_KEYWORDS, TEIL3_SCENES} from './plan';
import {CoverScene, DamageScene, EndScene, ForecastScene, PhasesScene, Under14Scene} from './scenes/Scenes';
import script from './script.json';
import voiceoverManifest from './voiceover.json';

ensureFontsLoaded();

/** Format B #04 – „76 Fragen – Teil 3: Was ist immer noch offen?“ (Titelbild = erste Szene, vier Fragen, kurze Übergänge). */
export const TEIL3_EPISODE: ErklaertEpisode = {
	episode: '#04',
	scenes: TEIL3_SCENES,
	keywords: TEIL3_KEYWORDS,
	components: {cover: CoverScene, forecast: ForecastScene, phases: PhasesScene, under14: Under14Scene, damage: DamageScene, outro: EndScene},
	transitions: {
		forecast: zoomThrough({strength: 0.4, blur: 6}),
		phases: whipPan(),
		under14: flashCut(),
		damage: whipPan(),
		outro: zoomThrough({strength: 0.35, blur: 5}),
	},
	script: {tailMs: script.tailMs, maxDurationMs: script.maxDurationMs},
	// Format-Badge erst nach dem Titelbild (das selbst „Frankfurt erklärt“ zeigt)
	badgeFrom: 48,
};

export const erklaert76Teil3Schema = erklaertSchema;

export const erklaert76Teil3DefaultProps: ErklaertProps = {
	subtitles: true,
	sfx: true,
	music: true,
	voiceVolume: 1,
	sfxVolume: 1,
	showSafeArea: false,
	voiceover: voiceoverManifest as VoiceoverManifest,
};

export const calculateErklaert76Teil3Metadata: CalculateMetadataFunction<ErklaertProps> = ({props}) => {
	const timeline = erklaertTimeline(TEIL3_EPISODE, props.voiceover, VIDEO.fps);
	return {durationInFrames: timeline.durationInFrames, props: {...props, timeline}};
};

export const FrankfurtErklaert76FragenTeil3: React.FC<ErklaertProps> = (props) => <ErklaertFrame ep={TEIL3_EPISODE} {...props} />;
