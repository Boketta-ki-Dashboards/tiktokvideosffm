import React from 'react';
import type {CalculateMetadataFunction} from 'remotion';
import {flashCut, zoomThrough} from '../../components/transitions/presentations';
import {type ErklaertEpisode, ErklaertFrame, type ErklaertProps, erklaertSchema, erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import type {VoiceoverManifest} from '../../lib/script-timing';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import videos from '../../../config/videos.json';
import {SOURCE_LINE} from './content';
import {WOCHE_KEYWORDS, WOCHE_SCENES} from './plan';
import {BerlinScene, CoverScene, DashboardScene, DresdenScene, FrankfurtScene, HamburgScene, LeipzigScene, OutroScene, StuttgartScene} from './scenes/Scenes';
import script from './script.json';
import voiceoverManifest from './voiceover.json';

ensureFontsLoaded();

/**
 * Format B #20 „Eine Woche nach den Gen-Z-Protesten – was ist aus den Ermittlungen geworden?“ (FrankfurtRedNews, produziert 27.11.2026,
 * verlängerte Sonderausgabe): Kartenreise über eine 2,5D-Deutschlandkarte nach Leipzig (über 200 Personen mit festgestellter Identität,
 * § 125a, Einordnung), Hamburg (keine Gesamtzahl, Korrektur, zwei Anfragen vom 23.11.), Dresden (rund 80 Personalien), Stuttgart (über 20
 * vorläufige Festnahmen), Berlin (rund 4.000, friedlich), Frankfurt (10 Festnahmen, 16 Strafanzeigen) und bundesweites Dashboard aller sechs
 * Städte (getrennte Kategorien, keine Rangliste). Informationsteil ≈ 70 s nach der Begrüßung (≤ 73,5 s ab 0), danach Abo-Aufruf (cta).
 */
export const WOCHE_EPISODE: ErklaertEpisode = {
	episode: '#20',
	scenes: WOCHE_SCENES,
	keywords: WOCHE_KEYWORDS,
	components: {
		cover: CoverScene,
		leipzig: LeipzigScene,
		hamburg: HamburgScene,
		dresden: DresdenScene,
		stuttgart: StuttgartScene,
		berlin: BerlinScene,
		frankfurt: FrankfurtScene,
		dashboard: DashboardScene,
		outro: OutroScene,
	},
	transitions: {
		leipzig: zoomThrough({strength: 0.25, blur: 3}),
		hamburg: zoomThrough({strength: 0.2, blur: 3}),
		dresden: zoomThrough({strength: 0.2, blur: 3}),
		stuttgart: zoomThrough({strength: 0.2, blur: 3}),
		berlin: zoomThrough({strength: 0.2, blur: 3}),
		frankfurt: zoomThrough({strength: 0.2, blur: 3}),
		dashboard: zoomThrough({strength: 0.25, blur: 3}),
		outro: flashCut(),
	},
	script: {tailMs: script.tailMs, maxDurationMs: script.maxDurationMs},
	badgeFrom: 48,
	badgePlacement: 'top-right',
	maxSeconds: videos.FrankfurtErklaertEineWocheDanach.maxSeconds,
	sourceLine: [...SOURCE_LINE],
};

export const erklaertWocheSchema = erklaertSchema;

export const erklaertWocheDefaultProps: ErklaertProps = {
	subtitles: true,
	sfx: true,
	music: true,
	voiceVolume: 1,
	sfxVolume: 1,
	showSafeArea: false,
	voiceover: voiceoverManifest as VoiceoverManifest,
};

export const calculateErklaertWocheMetadata: CalculateMetadataFunction<ErklaertProps> = ({props}) => {
	const timeline = erklaertTimeline(WOCHE_EPISODE, props.voiceover, VIDEO.fps);
	return {durationInFrames: timeline.durationInFrames, props: {...props, timeline}};
};

export const FrankfurtErklaertEineWocheDanach: React.FC<ErklaertProps> = (props) => <ErklaertFrame ep={WOCHE_EPISODE} {...props} />;
