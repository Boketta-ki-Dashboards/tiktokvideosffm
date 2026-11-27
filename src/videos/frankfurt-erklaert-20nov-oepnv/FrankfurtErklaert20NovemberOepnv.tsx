import React from 'react';
import type {CalculateMetadataFunction} from 'remotion';
import {flashCut, whipPan, zoomThrough} from '../../components/transitions/presentations';
import {type ErklaertEpisode, ErklaertFrame, type ErklaertProps, erklaertSchema, erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import type {VoiceoverManifest} from '../../lib/script-timing';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import videos from '../../../config/videos.json';
import {OEPNV_KEYWORDS, OEPNV_SCENES} from './plan';
import {CheckScene, CoverScene, MapScene, OutroScene, TramScene, UBahnScene, WhyScene} from './scenes/Scenes';
import script from './script.json';
import voiceoverManifest from './voiceover.json';

ensureFontsLoaded();

/**
 * Format B #11 „Frankfurt morgen: Diese Bahnen sind betroffen!“ (produziert 19.11.2026 für Freitag, 20.11.2026; Stand VGF 18.11., 14 Uhr):
 * Straßenbahn 11/12/14 ab 9 Uhr nicht über die Altstadtstrecke, 18/30/M36 möglicherweise betroffen, U-Bahn nach Fahrplan (U4/U5 als Alternative),
 * Hinweis Wochenende (DTC-Testfahrten), fünf Versammlungen als Hintergrund, vor der Fahrt prüfen. Hartes Limit 60 s inkl. Abo-Aufruf.
 */
export const OEPNV_EPISODE: ErklaertEpisode = {
	episode: '#11',
	scenes: OEPNV_SCENES,
	keywords: OEPNV_KEYWORDS,
	components: {cover: CoverScene, tram: TramScene, map: MapScene, ubahn: UBahnScene, why: WhyScene, check: CheckScene, outro: OutroScene},
	transitions: {
		tram: zoomThrough({strength: 0.4, blur: 5}),
		map: zoomThrough({strength: 0.3, blur: 4}),
		ubahn: flashCut(),
		why: whipPan(),
		check: whipPan(),
		outro: zoomThrough({strength: 0.3, blur: 4}),
	},
	script: {tailMs: script.tailMs, maxDurationMs: script.maxDurationMs},
	badgeFrom: 48,
	badgePlacement: 'top-right',
	maxSeconds: videos.FrankfurtErklaert20NovemberOepnv.maxSeconds,
};

export const erklaertOepnvSchema = erklaertSchema;

export const erklaertOepnvDefaultProps: ErklaertProps = {
	subtitles: true,
	sfx: true,
	music: true,
	voiceVolume: 1,
	sfxVolume: 1,
	showSafeArea: false,
	voiceover: voiceoverManifest as VoiceoverManifest,
};

export const calculateErklaertOepnvMetadata: CalculateMetadataFunction<ErklaertProps> = ({props}) => {
	const timeline = erklaertTimeline(OEPNV_EPISODE, props.voiceover, VIDEO.fps);
	return {durationInFrames: timeline.durationInFrames, props: {...props, timeline}};
};

export const FrankfurtErklaert20NovemberOepnv: React.FC<ErklaertProps> = (props) => <ErklaertFrame ep={OEPNV_EPISODE} {...props} />;
