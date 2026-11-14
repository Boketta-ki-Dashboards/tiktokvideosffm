import React from 'react';
import type {CalculateMetadataFunction} from 'remotion';
import {flashCut, whipPan, zoomThrough} from '../../components/transitions/presentations';
import {type ErklaertEpisode, ErklaertFrame, type ErklaertProps, erklaertSchema, erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import type {VoiceoverManifest} from '../../lib/script-timing';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import videos from '../../../config/videos.json';
import {NOV14_KEYWORDS, NOV14_SCENES} from './plan';
import {CoverScene, HauptwacheScene, NextScene, OutroScene, PoliceScene, VenuesScene, WebsiteScene} from './scenes/Scenes';
import script from './script.json';
import voiceoverManifest from './voiceover.json';

ensureFontsLoaded();

/**
 * Format B – Sondervideo „14.11. – doch eine Gen-Z-Demo in Frankfurt?“ (14.11.2026). Begründete Längen-Ausnahme
 * (config/videos.json): Informationsteil ≤ 61,5 s, danach kurzer Abo-Aufruf, gesamt ≤ 66 s.
 */
export const NOV14_EPISODE: ErklaertEpisode = {
	episode: '#06',
	scenes: NOV14_SCENES,
	keywords: NOV14_KEYWORDS,
	components: {cover: CoverScene, website: WebsiteScene, hauptwache: HauptwacheScene, venues: VenuesScene, police: PoliceScene, next: NextScene, outro: OutroScene},
	transitions: {
		website: zoomThrough({strength: 0.4, blur: 6}),
		hauptwache: whipPan(),
		venues: zoomThrough({strength: 0.35, blur: 5}),
		police: flashCut(),
		next: whipPan(),
		outro: zoomThrough({strength: 0.35, blur: 5}),
	},
	script: {tailMs: script.tailMs, maxDurationMs: script.maxDurationMs},
	badgeFrom: 48,
	maxSeconds: videos.FrankfurtErklaert14November.maxSeconds,
};

export const erklaert14NovemberSchema = erklaertSchema;

export const erklaert14NovemberDefaultProps: ErklaertProps = {
	subtitles: true,
	sfx: true,
	music: true,
	voiceVolume: 1,
	sfxVolume: 1,
	showSafeArea: false,
	voiceover: voiceoverManifest as VoiceoverManifest,
};

export const calculateErklaert14NovemberMetadata: CalculateMetadataFunction<ErklaertProps> = ({props}) => {
	const timeline = erklaertTimeline(NOV14_EPISODE, props.voiceover, VIDEO.fps);
	return {durationInFrames: timeline.durationInFrames, props: {...props, timeline}};
};

export const FrankfurtErklaert14November: React.FC<ErklaertProps> = (props) => <ErklaertFrame ep={NOV14_EPISODE} {...props} />;
