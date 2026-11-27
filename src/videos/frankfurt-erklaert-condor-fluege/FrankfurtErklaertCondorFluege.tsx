import React from 'react';
import type {CalculateMetadataFunction} from 'remotion';
import {flashCut, whipPan, zoomThrough} from '../../components/transitions/presentations';
import {type ErklaertEpisode, ErklaertFrame, type ErklaertProps, erklaertSchema, erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import type {VoiceoverManifest} from '../../lib/script-timing';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import videos from '../../../config/videos.json';
import {SOURCE_LINE} from './content';
import {CONDOR_KEYWORDS, CONDOR_SCENES} from './plan';
import {AmtScene, BordScene, CoverScene, EinsatzScene, KabineScene, KlinikScene, OutroScene, RouteScene, UrsacheScene} from './scenes/Scenes';
import script from './script.json';
import voiceoverManifest from './voiceover.json';

ensureFontsLoaded();

/**
 * Format B #17 „Zwei Flugzeuge – Passagiere krank an Bord“ (produziert 23.11.2026, Ereignis Sonntag 22.11.2026): zwei Condor-Flüge aus La Romana
 * (Dominikanische Republik) nach Frankfurt, Beschwerden an Bord laut Condor, rund 620 Menschen an Bord ≠ Erkrankte (laut Condor ≈ 30, andere
 * Berichte ≈ 40), Rettungskräfte schon vor der Landung bereit, Untersuchung an Bord (Fraport), zwei Personen im Krankenhaus, Norovirus nur als
 * unbestätigter Verdacht, Gesundheitsamt prüft. Erste Folge unter dem neuen Kanalnamen FrankfurtRedNews (Abo-Aufruf, Titelbild, Prüfbögen).
 * Längen-Ausnahme: Informationsteil ≤ 61,5 s, danach Abo-Aufruf (cta), gesamt ≤ 66 s.
 */
export const CONDOR_EPISODE: ErklaertEpisode = {
	episode: '#17',
	scenes: CONDOR_SCENES,
	keywords: CONDOR_KEYWORDS,
	components: {
		cover: CoverScene,
		route: RouteScene,
		kabine: KabineScene,
		bord: BordScene,
		einsatz: EinsatzScene,
		klinik: KlinikScene,
		ursache: UrsacheScene,
		amt: AmtScene,
		outro: OutroScene,
	},
	transitions: {
		route: zoomThrough({strength: 0.2, blur: 3}),
		kabine: whipPan(),
		bord: flashCut(),
		einsatz: zoomThrough({strength: 0.25, blur: 3}),
		klinik: whipPan(),
		ursache: zoomThrough({strength: 0.2, blur: 3}),
		amt: whipPan(),
		outro: zoomThrough({strength: 0.3, blur: 4}),
	},
	script: {tailMs: script.tailMs, maxDurationMs: script.maxDurationMs},
	badgeFrom: 48,
	badgePlacement: 'top-right',
	maxSeconds: videos.FrankfurtErklaertCondorFluege.maxSeconds,
	sourceLine: [...SOURCE_LINE],
};

export const erklaertCondorSchema = erklaertSchema;

export const erklaertCondorDefaultProps: ErklaertProps = {
	subtitles: true,
	sfx: true,
	music: true,
	voiceVolume: 1,
	sfxVolume: 1,
	showSafeArea: false,
	voiceover: voiceoverManifest as VoiceoverManifest,
};

export const calculateErklaertCondorMetadata: CalculateMetadataFunction<ErklaertProps> = ({props}) => {
	const timeline = erklaertTimeline(CONDOR_EPISODE, props.voiceover, VIDEO.fps);
	return {durationInFrames: timeline.durationInFrames, props: {...props, timeline}};
};

export const FrankfurtErklaertCondorFluege: React.FC<ErklaertProps> = (props) => <ErklaertFrame ep={CONDOR_EPISODE} {...props} />;
