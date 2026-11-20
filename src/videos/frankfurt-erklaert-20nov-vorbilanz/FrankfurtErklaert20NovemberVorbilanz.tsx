import React from 'react';
import type {CalculateMetadataFunction} from 'remotion';
import {flashCut, whipPan, zoomThrough} from '../../components/transitions/presentations';
import {type ErklaertEpisode, ErklaertFrame, type ErklaertProps, erklaertSchema, erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import type {VoiceoverManifest} from '../../lib/script-timing';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import videos from '../../../config/videos.json';
import {SOURCE_LINE} from './content';
import {VORBILANZ_KEYWORDS, VORBILANZ_SCENES} from './plan';
import {CoverScene, OutroScene, PolizeiScene, StreitScene, WerftScene, ZahlenScene, ZugScene} from './scenes/Scenes';
import script from './script.json';
import voiceoverManifest from './voiceover.json';

ensureFontsLoaded();

/**
 * Format B #14 „Frankfurt 20.11. – was ist heute wirklich passiert?“ (VORBILANZ, Freitag 20.11.2026; Stand = letzter Faktencheck, siehe
 * content.ts → STAND): Weseler Werft (bis 4.000 erwartet, 20–30 vor Ort, früh beendet) · Streit Ortsgruppe vs. Bundesbewegung ·
 * Demozug Hbf → Alte Oper → Bockenheim (verspätet, laut Polizei rund 1.000) · Erwartung vs. tatsächlich (nicht addiert) · Polizei
 * (bisher friedlich, Pyrotechnik) · offen. Quellenzeile unter den Untertiteln, Serien-Overlay oben rechts. Hartes Limit 60 s inkl. Abo-Aufruf.
 */
export const VORBILANZ_EPISODE: ErklaertEpisode = {
	episode: '#14',
	scenes: VORBILANZ_SCENES,
	keywords: VORBILANZ_KEYWORDS,
	components: {cover: CoverScene, werft: WerftScene, streit: StreitScene, zug: ZugScene, zahlen: ZahlenScene, polizei: PolizeiScene, outro: OutroScene},
	transitions: {
		werft: zoomThrough({strength: 0.25, blur: 3}),
		streit: whipPan(),
		zug: zoomThrough({strength: 0.25, blur: 3}),
		zahlen: whipPan(),
		polizei: flashCut(),
		outro: zoomThrough({strength: 0.3, blur: 4}),
	},
	script: {tailMs: script.tailMs, maxDurationMs: script.maxDurationMs},
	badgeFrom: 48,
	badgePlacement: 'top-right',
	maxSeconds: videos.FrankfurtErklaert20NovemberVorbilanz.maxSeconds,
	sourceLine: [...SOURCE_LINE],
};

export const erklaertVorbilanzSchema = erklaertSchema;

export const erklaertVorbilanzDefaultProps: ErklaertProps = {
	subtitles: true,
	sfx: true,
	music: true,
	voiceVolume: 1,
	sfxVolume: 1,
	showSafeArea: false,
	voiceover: voiceoverManifest as VoiceoverManifest,
};

export const calculateErklaertVorbilanzMetadata: CalculateMetadataFunction<ErklaertProps> = ({props}) => {
	const timeline = erklaertTimeline(VORBILANZ_EPISODE, props.voiceover, VIDEO.fps);
	return {durationInFrames: timeline.durationInFrames, props: {...props, timeline}};
};

export const FrankfurtErklaert20NovemberVorbilanz: React.FC<ErklaertProps> = (props) => <ErklaertFrame ep={VORBILANZ_EPISODE} {...props} />;
