import React from 'react';
import type {CalculateMetadataFunction} from 'remotion';
import {flashCut, whipPan, zoomThrough} from '../../components/transitions/presentations';
import {type ErklaertEpisode, ErklaertFrame, type ErklaertProps, erklaertSchema, erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import type {VoiceoverManifest} from '../../lib/script-timing';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import videos from '../../../config/videos.json';
import {SOURCE_LINE} from './content';
import {PLANUNG_KEYWORDS, PLANUNG_SCENES} from './plan';
import {AbstimmungScene, BeitragScene, CoverScene, FrageScene, OffenScene, OrgaScene, OutroScene, PolizeiScene, TerminScene, TreffenScene} from './scenes/Scenes';
import script from './script.json';
import voiceoverManifest from './voiceover.json';

ensureFontsLoaded();

/**
 * Format B #18 „Gen Z regelt Frankfurt – was soll sich am 12. Dezember ändern?“ (FrankfurtRedNews, produziert 25.11.2026, Stand 16:40 Uhr):
 * öffentliche Kritik einer Frankfurter Gruppe (TikTok-Beitrag, Aussage der Gruppe) an der Organisation der Demos vom 31.10. und 20.11.,
 * Einladung zum offenen Planungstreffen im DGB-Haus (Di 24.11., 19 Uhr – Ergebnisse nicht öffentlich bekannt), offene Frage nach besserer
 * Abstimmung mit der Bundesinitiative (Rückblick 20.11.: getrennte Planungen), 12.12. 14 Uhr Gallusanlage laut Gruppe vs. Website
 * „Standort folgt“, Anmeldung/Behörde offen, Schlussfrage ohne Prognose. Längen-Ausnahme: Informationsteil ≤ 61,5 s, danach Abo-Aufruf (cta), gesamt ≤ 66 s.
 */
export const PLANUNG_EPISODE: ErklaertEpisode = {
	episode: '#18',
	scenes: PLANUNG_SCENES,
	keywords: PLANUNG_KEYWORDS,
	components: {
		cover: CoverScene,
		beitrag: BeitragScene,
		orga: OrgaScene,
		polizei: PolizeiScene,
		treffen: TreffenScene,
		abstimmung: AbstimmungScene,
		termin: TerminScene,
		offen: OffenScene,
		frage: FrageScene,
		outro: OutroScene,
	},
	transitions: {
		beitrag: zoomThrough({strength: 0.2, blur: 3}),
		orga: whipPan(),
		polizei: flashCut(),
		treffen: zoomThrough({strength: 0.25, blur: 3}),
		abstimmung: whipPan(),
		termin: zoomThrough({strength: 0.2, blur: 3}),
		offen: whipPan(),
		frage: flashCut(),
		outro: zoomThrough({strength: 0.3, blur: 4}),
	},
	script: {tailMs: script.tailMs, maxDurationMs: script.maxDurationMs},
	badgeFrom: 48,
	badgePlacement: 'top-right',
	maxSeconds: videos.FrankfurtErklaertGenZPlanungstreffen.maxSeconds,
	sourceLine: [...SOURCE_LINE],
};

export const erklaertPlanungSchema = erklaertSchema;

export const erklaertPlanungDefaultProps: ErklaertProps = {
	subtitles: true,
	sfx: true,
	music: true,
	voiceVolume: 1,
	sfxVolume: 1,
	showSafeArea: false,
	voiceover: voiceoverManifest as VoiceoverManifest,
};

export const calculateErklaertPlanungMetadata: CalculateMetadataFunction<ErklaertProps> = ({props}) => {
	const timeline = erklaertTimeline(PLANUNG_EPISODE, props.voiceover, VIDEO.fps);
	return {durationInFrames: timeline.durationInFrames, props: {...props, timeline}};
};

export const FrankfurtErklaertGenZPlanungstreffen: React.FC<ErklaertProps> = (props) => <ErklaertFrame ep={PLANUNG_EPISODE} {...props} />;
