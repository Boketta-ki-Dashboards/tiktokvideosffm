import React from 'react';
import type {CalculateMetadataFunction} from 'remotion';
import {flashCut, whipPan, zoomThrough} from '../../components/transitions/presentations';
import {type ErklaertEpisode, ErklaertFrame, type ErklaertProps, erklaertSchema, erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import type {VoiceoverManifest} from '../../lib/script-timing';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import videos from '../../../config/videos.json';
import {NOV20_KEYWORDS, NOV20_SCENES} from './plan';
import {BatmanScene, CoverScene, DemandsScene, GenZScene, GewerkschaftScene, OutroScene, RulesScene, SchulstreikScene} from './scenes/Scenes';
import script from './script.json';
import voiceoverManifest from './voiceover.json';

ensureFontsLoaded();

/**
 * Format B #09 „Proteste am 20.11. – 4 Proteste, 1 Freitag“ (Frankfurt, Stand 17.11.2026).
 * Erste Folge mit dem Serien-Overlay oben RECHTS unter der TikTok-Suchleiste (`badgePlacement: 'top-right'`).
 * Begründete Längen-Ausnahme (config/videos.json): Informationsteil ≤ 61,5 s, danach Abo-Aufruf, gesamt ≤ 64 s.
 */
export const NOV20_EPISODE: ErklaertEpisode = {
	episode: '#09',
	scenes: NOV20_SCENES,
	keywords: NOV20_KEYWORDS,
	components: {cover: CoverScene, schulstreik: SchulstreikScene, gewerkschaft: GewerkschaftScene, genz: GenZScene, demands: DemandsScene, rules: RulesScene, batman: BatmanScene, outro: OutroScene},
	transitions: {
		schulstreik: zoomThrough({strength: 0.3, blur: 4}),
		gewerkschaft: whipPan(),
		genz: zoomThrough({strength: 0.35, blur: 5}),
		demands: whipPan(),
		rules: flashCut(),
		batman: zoomThrough({strength: 0.3, blur: 4}),
		outro: zoomThrough({strength: 0.3, blur: 4}),
	},
	script: {tailMs: script.tailMs, maxDurationMs: script.maxDurationMs},
	badgeFrom: 48,
	badgePlacement: 'top-right',
	maxSeconds: videos.FrankfurtErklaert20NovemberDreiProteste.maxSeconds,
};

export const erklaert20NovemberSchema = erklaertSchema;

export const erklaert20NovemberDefaultProps: ErklaertProps = {
	subtitles: true,
	sfx: true,
	music: true,
	voiceVolume: 1,
	sfxVolume: 1,
	showSafeArea: false,
	voiceover: voiceoverManifest as VoiceoverManifest,
};

export const calculateErklaert20NovemberMetadata: CalculateMetadataFunction<ErklaertProps> = ({props}) => {
	const timeline = erklaertTimeline(NOV20_EPISODE, props.voiceover, VIDEO.fps);
	return {durationInFrames: timeline.durationInFrames, props: {...props, timeline}};
};

export const FrankfurtErklaert20NovemberDreiProteste: React.FC<ErklaertProps> = (props) => <ErklaertFrame ep={NOV20_EPISODE} {...props} />;
