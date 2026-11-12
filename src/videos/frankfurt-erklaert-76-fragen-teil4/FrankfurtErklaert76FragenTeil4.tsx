import React from 'react';
import type {CalculateMetadataFunction} from 'remotion';
import {flashCut, whipPan, zoomThrough} from '../../components/transitions/presentations';
import {type ErklaertEpisode, ErklaertFrame, type ErklaertProps, erklaertSchema, erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import type {VoiceoverManifest} from '../../lib/script-timing';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import videos from '../../../config/videos.json';
import {TEIL4_KEYWORDS, TEIL4_SCENES} from './plan';
import {CoverScene, DamageScene, JusticeScene, OutroScene, SpotsScene, WeaponsScene} from './scenes/Scenes';
import script from './script.json';
import voiceoverManifest from './voiceover.json';

ensureFontsLoaded();

/**
 * Format B #05 – „76 Fragen – Teil 4: vier weitere Antworten“. Begründete Längen-Ausnahme (config/videos.json):
 * Informationsteil ≤ 61,5 s, danach kurzer Abo-Aufruf, gesamt ≤ 66 s.
 */
export const TEIL4_EPISODE: ErklaertEpisode = {
	episode: '#05',
	scenes: TEIL4_SCENES,
	keywords: TEIL4_KEYWORDS,
	components: {cover: CoverScene, spots: SpotsScene, damage: DamageScene, weapons: WeaponsScene, justice: JusticeScene, outro: OutroScene},
	transitions: {
		spots: zoomThrough({strength: 0.4, blur: 6}),
		damage: whipPan(),
		weapons: flashCut(),
		justice: whipPan(),
		outro: zoomThrough({strength: 0.35, blur: 5}),
	},
	script: {tailMs: script.tailMs, maxDurationMs: script.maxDurationMs},
	badgeFrom: 48,
	maxSeconds: videos.FrankfurtErklaert76FragenTeil4.maxSeconds,
};

export const erklaert76Teil4Schema = erklaertSchema;

export const erklaert76Teil4DefaultProps: ErklaertProps = {
	subtitles: true,
	sfx: true,
	music: true,
	voiceVolume: 1,
	sfxVolume: 1,
	showSafeArea: false,
	voiceover: voiceoverManifest as VoiceoverManifest,
};

export const calculateErklaert76Teil4Metadata: CalculateMetadataFunction<ErklaertProps> = ({props}) => {
	const timeline = erklaertTimeline(TEIL4_EPISODE, props.voiceover, VIDEO.fps);
	return {durationInFrames: timeline.durationInFrames, props: {...props, timeline}};
};

export const FrankfurtErklaert76FragenTeil4: React.FC<ErklaertProps> = (props) => <ErklaertFrame ep={TEIL4_EPISODE} {...props} />;
