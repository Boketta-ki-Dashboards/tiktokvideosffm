import React from 'react';
import type {CalculateMetadataFunction} from 'remotion';
import {flashCut, whipPan, zoomThrough} from '../../components/transitions/presentations';
import {type ErklaertEpisode, ErklaertFrame, type ErklaertProps, erklaertSchema, erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import type {VoiceoverManifest} from '../../lib/script-timing';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import videos from '../../../config/videos.json';
import {PHASE2_KEYWORDS, PHASE2_SCENES} from './plan';
import {BerlinScene, CitiesScene, CoverScene, IncidentsScene, NextScene, OutroScene, StatsScene} from './scenes/Scenes';
import script from './script.json';
import voiceoverManifest from './voiceover.json';

ensureFontsLoaded();

/**
 * Format B #07 „Gen Z regelt – Phase 2: friedliche Demos, aber 20 Festnahmen in Berlin“ (Proteste vom 14.11.2026,
 * Meldestand 15.11.). Hartes Limit 60,0 s inkl. Abo-Aufruf (config/videos.json → maxSeconds 60, keine Ausnahme).
 */
export const PHASE2_EPISODE: ErklaertEpisode = {
	episode: '#07',
	scenes: PHASE2_SCENES,
	keywords: PHASE2_KEYWORDS,
	components: {cover: CoverScene, cities: CitiesScene, berlin: BerlinScene, incidents: IncidentsScene, stats: StatsScene, next: NextScene, outro: OutroScene},
	transitions: {
		cities: zoomThrough({strength: 0.12, blur: 2}),
		berlin: zoomThrough({strength: 0.4, blur: 6}),
		incidents: whipPan(),
		stats: flashCut(),
		next: whipPan(),
		outro: zoomThrough({strength: 0.35, blur: 5}),
	},
	script: {tailMs: script.tailMs, maxDurationMs: script.maxDurationMs},
	badgeFrom: 48,
	maxSeconds: videos.FrankfurtErklaertGenZPhase2.maxSeconds,
};

export const erklaertGenZPhase2Schema = erklaertSchema;

export const erklaertGenZPhase2DefaultProps: ErklaertProps = {
	subtitles: true,
	sfx: true,
	music: true,
	voiceVolume: 1,
	sfxVolume: 1,
	showSafeArea: false,
	voiceover: voiceoverManifest as VoiceoverManifest,
};

export const calculateErklaertGenZPhase2Metadata: CalculateMetadataFunction<ErklaertProps> = ({props}) => {
	const timeline = erklaertTimeline(PHASE2_EPISODE, props.voiceover, VIDEO.fps);
	return {durationInFrames: timeline.durationInFrames, props: {...props, timeline}};
};

export const FrankfurtErklaertGenZPhase2: React.FC<ErklaertProps> = (props) => <ErklaertFrame ep={PHASE2_EPISODE} {...props} />;
