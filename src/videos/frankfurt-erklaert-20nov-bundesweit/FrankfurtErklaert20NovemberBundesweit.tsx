import React from 'react';
import type {CalculateMetadataFunction} from 'remotion';
import {flashCut, whipPan, zoomThrough} from '../../components/transitions/presentations';
import {type ErklaertEpisode, ErklaertFrame, type ErklaertProps, erklaertSchema, erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import type {VoiceoverManifest} from '../../lib/script-timing';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import videos from '../../../config/videos.json';
import {SOURCE_LINE} from './content';
import {BUNDESWEIT_KEYWORDS, BUNDESWEIT_SCENES} from './plan';
import {CompareScene, CoverScene, DemandsScene, EndScene, MapScene, NumbersScene, OutroScene} from './scenes/Scenes';
import script from './script.json';
import voiceoverManifest from './voiceover.json';

ensureFontsLoaded();

/**
 * Format B #12 „73 Städte – ein Protesttag! Was passiert morgen?“ (produziert 19.11.2026 für Freitag, 20.11.2026; Stand 19.11., 14 Uhr):
 * 73 Städte laut Website „Gen Z regelt“ (4 selbst organisiert, 69 angeschlossen), Frankfurt vs. Köln als Planungszahlen, drei Arten von Zahlen,
 * Forderungen laut Website, Frage „Welche Stadt wird am größten?“. Erste Folge mit der Quellenzeile UNTER den Untertiteln (`sourceLine`).
 * Hartes Limit 60 s inkl. Abo-Aufruf.
 */
export const BUNDESWEIT_EPISODE: ErklaertEpisode = {
	episode: '#12',
	scenes: BUNDESWEIT_SCENES,
	keywords: BUNDESWEIT_KEYWORDS,
	components: {cover: CoverScene, map: MapScene, compare: CompareScene, numbers: NumbersScene, demands: DemandsScene, end: EndScene, outro: OutroScene},
	transitions: {
		map: zoomThrough({strength: 0.2, blur: 3}),
		compare: whipPan(),
		numbers: zoomThrough({strength: 0.3, blur: 4}),
		demands: whipPan(),
		end: flashCut(),
		outro: zoomThrough({strength: 0.3, blur: 4}),
	},
	script: {tailMs: script.tailMs, maxDurationMs: script.maxDurationMs},
	badgeFrom: 48,
	badgePlacement: 'top-right',
	maxSeconds: videos.FrankfurtErklaert20NovemberBundesweit.maxSeconds,
	sourceLine: [...SOURCE_LINE],
};

export const erklaertBundesweitSchema = erklaertSchema;

export const erklaertBundesweitDefaultProps: ErklaertProps = {
	subtitles: true,
	sfx: true,
	music: true,
	voiceVolume: 1,
	sfxVolume: 1,
	showSafeArea: false,
	voiceover: voiceoverManifest as VoiceoverManifest,
};

export const calculateErklaertBundesweitMetadata: CalculateMetadataFunction<ErklaertProps> = ({props}) => {
	const timeline = erklaertTimeline(BUNDESWEIT_EPISODE, props.voiceover, VIDEO.fps);
	return {durationInFrames: timeline.durationInFrames, props: {...props, timeline}};
};

export const FrankfurtErklaert20NovemberBundesweit: React.FC<ErklaertProps> = (props) => <ErklaertFrame ep={BUNDESWEIT_EPISODE} {...props} />;
