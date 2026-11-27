import React from 'react';
import type {CalculateMetadataFunction} from 'remotion';
import {flashCut, whipPan, zoomThrough} from '../../components/transitions/presentations';
import {type ErklaertEpisode, ErklaertFrame, type ErklaertProps, erklaertSchema, erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import type {VoiceoverManifest} from '../../lib/script-timing';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import videos from '../../../config/videos.json';
import {DEMOUPDATE_KEYWORDS, DEMOUPDATE_SCENES} from './plan';
import {ChangeScene, CoverScene, FinalScene, FiveScene, OutroScene, PressScene, RulesScene, WerftScene} from './scenes/Scenes';
import script from './script.json';
import voiceoverManifest from './voiceover.json';

ensureFontsLoaded();

/**
 * Format B #10 „Gen-Z-Demo am 20.11. geändert!“ (Frankfurt, Stand 18.11.2026, 15:28 Uhr): Kundgebung statt Demozug an der Weseler Werft,
 * Auflagen, jetzt fünf Versammlungen (neu: Aufzug „GenZ regelt Bundesbewegung“), Sicherheits-Pressekonferenz. Hartes Limit 60 s inkl. Abo-Aufruf.
 * Kopfzeile: Serien-Overlay oben rechts + TopTag links (symmetrisch, y 272–342).
 */
export const DEMOUPDATE_EPISODE: ErklaertEpisode = {
	episode: '#10',
	scenes: DEMOUPDATE_SCENES,
	keywords: DEMOUPDATE_KEYWORDS,
	components: {cover: CoverScene, change: ChangeScene, werft: WerftScene, rules: RulesScene, five: FiveScene, press: PressScene, final: FinalScene, outro: OutroScene},
	transitions: {
		change: zoomThrough({strength: 0.35, blur: 5}),
		werft: whipPan(),
		rules: flashCut(),
		five: whipPan(),
		press: zoomThrough({strength: 0.3, blur: 4}),
		final: whipPan(),
		outro: zoomThrough({strength: 0.3, blur: 4}),
	},
	script: {tailMs: script.tailMs, maxDurationMs: script.maxDurationMs},
	badgeFrom: 48,
	badgePlacement: 'top-right',
	maxSeconds: videos.FrankfurtErklaert20NovemberDemoUpdate.maxSeconds,
};

export const erklaertDemoUpdateSchema = erklaertSchema;

export const erklaertDemoUpdateDefaultProps: ErklaertProps = {
	subtitles: true,
	sfx: true,
	music: true,
	voiceVolume: 1,
	sfxVolume: 1,
	showSafeArea: false,
	voiceover: voiceoverManifest as VoiceoverManifest,
};

export const calculateErklaertDemoUpdateMetadata: CalculateMetadataFunction<ErklaertProps> = ({props}) => {
	const timeline = erklaertTimeline(DEMOUPDATE_EPISODE, props.voiceover, VIDEO.fps);
	return {durationInFrames: timeline.durationInFrames, props: {...props, timeline}};
};

export const FrankfurtErklaert20NovemberDemoUpdate: React.FC<ErklaertProps> = (props) => <ErklaertFrame ep={DEMOUPDATE_EPISODE} {...props} />;
