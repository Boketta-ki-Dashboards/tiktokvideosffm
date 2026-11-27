import React from 'react';
import type {CalculateMetadataFunction} from 'remotion';
import {flashCut, whipPan, zoomThrough} from '../../components/transitions/presentations';
import {type ErklaertEpisode, ErklaertFrame, type ErklaertProps, erklaertSchema, erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import type {VoiceoverManifest} from '../../lib/script-timing';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import videos from '../../../config/videos.json';
import {DEMO13_KEYWORDS, DEMO13_SCENES} from './plan';
import {CalendarScene, ContrastScene, CoverScene, MapScene, NextScene, OutroScene, PoliceScene} from './scenes/Scenes';
import script from './script.json';
import voiceoverManifest from './voiceover.json';

ensureFontsLoaded();

/**
 * Format B #08 „Nur 13 Demonstranten? – Warum war bei der Gen-Z-Demo kaum jemand?“ (Frankfurt, 14.11.2026; Stand 16.11.).
 * Begründete Längen-Ausnahme (config/videos.json): Informationsteil ≤ 61,5 s, danach Abo-Aufruf, gesamt ≤ 64 s.
 */
export const DEMO13_EPISODE: ErklaertEpisode = {
	episode: '#08',
	scenes: DEMO13_SCENES,
	keywords: DEMO13_KEYWORDS,
	components: {cover: CoverScene, contrast: ContrastScene, map: MapScene, calendar: CalendarScene, police: PoliceScene, next: NextScene, outro: OutroScene},
	transitions: {
		contrast: zoomThrough({strength: 0.3, blur: 4}),
		map: whipPan(),
		calendar: zoomThrough({strength: 0.35, blur: 5}),
		police: flashCut(),
		next: whipPan(),
		outro: zoomThrough({strength: 0.3, blur: 4}),
	},
	script: {tailMs: script.tailMs, maxDurationMs: script.maxDurationMs},
	badgeFrom: 48,
	maxSeconds: videos.FrankfurtErklaert13Demonstranten.maxSeconds,
};

export const erklaert13DemonstrantenSchema = erklaertSchema;

export const erklaert13DemonstrantenDefaultProps: ErklaertProps = {
	subtitles: true,
	sfx: true,
	music: true,
	voiceVolume: 1,
	sfxVolume: 1,
	showSafeArea: false,
	voiceover: voiceoverManifest as VoiceoverManifest,
};

export const calculateErklaert13DemonstrantenMetadata: CalculateMetadataFunction<ErklaertProps> = ({props}) => {
	const timeline = erklaertTimeline(DEMO13_EPISODE, props.voiceover, VIDEO.fps);
	return {durationInFrames: timeline.durationInFrames, props: {...props, timeline}};
};

export const FrankfurtErklaert13Demonstranten: React.FC<ErklaertProps> = (props) => <ErklaertFrame ep={DEMO13_EPISODE} {...props} />;
