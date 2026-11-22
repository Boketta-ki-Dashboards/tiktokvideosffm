import React from 'react';
import type {CalculateMetadataFunction} from 'remotion';
import {flashCut, whipPan, zoomThrough} from '../../components/transitions/presentations';
import {type ErklaertEpisode, ErklaertFrame, type ErklaertProps, erklaertSchema, erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import type {VoiceoverManifest} from '../../lib/script-timing';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import videos from '../../../config/videos.json';
import {SOURCE_LINE} from './content';
import {AUSBLICK_KEYWORDS, AUSBLICK_SCENES} from './plan';
import {CoverScene, FrankfurtScene, KarteScene, OrgaScene, OutroScene, PlanungenScene, RueckblickScene, TerminScene, ZusagenScene} from './scenes/Scenes';
import script from './script.json';
import voiceoverManifest from './voiceover.json';

ensureFontsLoaded();

/**
 * Format B #16 „Nach dem 20. November: Schon die nächste Demo geplant?“ (produziert 22.11.2026): kurzer Rückblick auf den 20.11. (weitgehend
 * friedlich, weniger Teilnehmende als angekündigt, unterschiedliche Planungen von Ortsgruppe und Bundesinitiative) → Ankündigung des nächsten
 * bundesweiten Protesttags am Samstag, 12.12.2026, laut Website in 73 Städten (dieselbe Liste), Frankfurt eine der vier selbst organisierten
 * Städte → Frankfurt: Datum fest, Treffpunkt/Uhrzeit „folgt“, Ankündigung ≠ Anmeldung ≠ Behörde → Helfer, Ordner, Förderpool → Online-Zusagen
 * ≠ Teilnehmende → offene Frage. Längen-Ausnahme: Informationsteil ≤ 61,5 s, danach Abo-Aufruf (cta), gesamt ≤ 66 s.
 */
export const AUSBLICK_EPISODE: ErklaertEpisode = {
	episode: '#16',
	scenes: AUSBLICK_SCENES,
	keywords: AUSBLICK_KEYWORDS,
	components: {
		cover: CoverScene,
		rueckblick: RueckblickScene,
		planungen: PlanungenScene,
		termin: TerminScene,
		karte: KarteScene,
		frankfurt: FrankfurtScene,
		orga: OrgaScene,
		zusagen: ZusagenScene,
		outro: OutroScene,
	},
	transitions: {
		rueckblick: zoomThrough({strength: 0.2, blur: 3}),
		planungen: whipPan(),
		termin: flashCut(),
		karte: zoomThrough({strength: 0.2, blur: 3}),
		frankfurt: zoomThrough({strength: 0.25, blur: 3}),
		orga: whipPan(),
		zusagen: flashCut(),
		outro: zoomThrough({strength: 0.3, blur: 4}),
	},
	script: {tailMs: script.tailMs, maxDurationMs: script.maxDurationMs},
	badgeFrom: 48,
	badgePlacement: 'top-right',
	maxSeconds: videos.FrankfurtErklaert12DezemberAusblick.maxSeconds,
	sourceLine: [...SOURCE_LINE],
};

export const erklaertAusblickSchema = erklaertSchema;

export const erklaertAusblickDefaultProps: ErklaertProps = {
	subtitles: true,
	sfx: true,
	music: true,
	voiceVolume: 1,
	sfxVolume: 1,
	showSafeArea: false,
	voiceover: voiceoverManifest as VoiceoverManifest,
};

export const calculateErklaertAusblickMetadata: CalculateMetadataFunction<ErklaertProps> = ({props}) => {
	const timeline = erklaertTimeline(AUSBLICK_EPISODE, props.voiceover, VIDEO.fps);
	return {durationInFrames: timeline.durationInFrames, props: {...props, timeline}};
};

export const FrankfurtErklaert12DezemberAusblick: React.FC<ErklaertProps> = (props) => <ErklaertFrame ep={AUSBLICK_EPISODE} {...props} />;
