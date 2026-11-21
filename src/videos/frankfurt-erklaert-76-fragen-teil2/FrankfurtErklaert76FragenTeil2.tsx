import React from 'react';
import type {CalculateMetadataFunction} from 'remotion';
import {flashCut, whipPan, zoomThrough} from '../../components/transitions/presentations';
import {type ErklaertEpisode, ErklaertFrame, type ErklaertProps, erklaertSchema, erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import type {VoiceoverManifest} from '../../lib/script-timing';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import {TEIL2_KEYWORDS, TEIL2_SCENES} from './plan';
import {ControScene, CoverScene, EndScene, Nov20Scene, NumbersScene, PoliceScene, TikTokScene} from './scenes/Scenes';
import script from './script.json';
import voiceoverManifest from './voiceover.json';

ensureFontsLoaded();

/** Format B #03 – „76 Fragen – Teil 2: erste Antworten“ (Titelbild ist die erste Szene, kurze Übergänge). */
export const TEIL2_EPISODE: ErklaertEpisode = {
	episode: '#03',
	scenes: TEIL2_SCENES,
	keywords: TEIL2_KEYWORDS,
	components: {cover: CoverScene, police: PoliceScene, numbers: NumbersScene, tiktok: TikTokScene, nov20: Nov20Scene, contro: ControScene, outro: EndScene},
	transitions: {
		police: zoomThrough({strength: 0.4, blur: 6}),
		numbers: flashCut(),
		tiktok: whipPan(),
		nov20: whipPan(),
		contro: zoomThrough({strength: 0.4, blur: 6}),
		outro: whipPan(),
	},
	script: {tailMs: script.tailMs, maxDurationMs: script.maxDurationMs},
	// Format-Badge erst nach dem Titelbild (das selbst „Frankfurt erklärt“ zeigt)
	badgeFrom: 48,
};

export const erklaert76Teil2Schema = erklaertSchema;

export const erklaert76Teil2DefaultProps: ErklaertProps = {
	subtitles: true,
	sfx: true,
	music: true,
	voiceVolume: 1,
	sfxVolume: 1,
	showSafeArea: false,
	voiceover: voiceoverManifest as VoiceoverManifest,
};

export const calculateErklaert76Teil2Metadata: CalculateMetadataFunction<ErklaertProps> = ({props}) => {
	const timeline = erklaertTimeline(TEIL2_EPISODE, props.voiceover, VIDEO.fps);
	return {durationInFrames: timeline.durationInFrames, props: {...props, timeline}};
};

export const FrankfurtErklaert76FragenTeil2: React.FC<ErklaertProps> = (props) => <ErklaertFrame ep={TEIL2_EPISODE} {...props} />;
