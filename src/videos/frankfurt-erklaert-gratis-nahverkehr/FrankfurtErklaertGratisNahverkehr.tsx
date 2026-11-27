import React from 'react';
import type {CalculateMetadataFunction} from 'remotion';
import {flashCut, whipPan, zoomThrough} from '../../components/transitions/presentations';
import {type ErklaertEpisode, ErklaertFrame, type ErklaertProps, erklaertSchema, erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import type {VoiceoverManifest} from '../../lib/script-timing';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import videos from '../../../config/videos.json';
import {SOURCE_LINE} from './content';
import {GRATIS_KEYWORDS, GRATIS_SCENES} from './plan';
import {CoverScene, DatumScene, EinordnungScene, FahrzeugeScene, HintergrundScene, KampagneScene, KostenScene, OutroScene, PaketScene, TarifScene, TermineScene} from './scenes/Scenes';
import script from './script.json';
import voiceoverManifest from './voiceover.json';

ensureFontsLoaded();

/**
 * Format B #19 „Frankfurt macht Bus und Bahn kostenlos – ausgerechnet am 12. Dezember“ (FrankfurtRedNews, produziert 26.11.2026):
 * Maßnahmenpaket der Stadt (Pressekonferenz 25.11.), Freifahrt am 12. und 19.12. für alle RMV-Verkehrsmittel im Tarifgebiet 5000 von 0 Uhr
 * bis 5 Uhr am Sonntagmorgen, Ausnahmen (Flughafen 5090, Umland bis zur Stadtgrenze regulär), Hintergrund 31.10., Kosten 400.000 € laut FAZ,
 * Kampagne „Frankfurt Christmas Shopping“ und „Zu Gast in Frankfurt“ am 6.1., zeitliche Überschneidung mit dem angekündigten Gen-Z-Protesttag
 * am 12.12. – ein direkter Zusammenhang ist nicht belegt. Längen-Ausnahme: Informationsteil ≤ 61,5 s, danach Abo-Aufruf (cta), gesamt ≤ 66 s.
 */
export const GRATIS_EPISODE: ErklaertEpisode = {
	episode: '#19',
	scenes: GRATIS_SCENES,
	keywords: GRATIS_KEYWORDS,
	components: {
		cover: CoverScene,
		paket: PaketScene,
		termine: TermineScene,
		fahrzeuge: FahrzeugeScene,
		tarif: TarifScene,
		hintergrund: HintergrundScene,
		kosten: KostenScene,
		kampagne: KampagneScene,
		datum: DatumScene,
		einordnung: EinordnungScene,
		outro: OutroScene,
	},
	transitions: {
		paket: zoomThrough({strength: 0.2, blur: 3}),
		termine: whipPan(),
		fahrzeuge: flashCut(),
		tarif: zoomThrough({strength: 0.25, blur: 3}),
		hintergrund: whipPan(),
		kosten: flashCut(),
		kampagne: whipPan(),
		datum: zoomThrough({strength: 0.25, blur: 3}),
		einordnung: flashCut(),
		outro: zoomThrough({strength: 0.3, blur: 4}),
	},
	script: {tailMs: script.tailMs, maxDurationMs: script.maxDurationMs},
	badgeFrom: 48,
	badgePlacement: 'top-right',
	maxSeconds: videos.FrankfurtErklaertGratisNahverkehr.maxSeconds,
	sourceLine: [...SOURCE_LINE],
};

export const erklaertGratisSchema = erklaertSchema;

export const erklaertGratisDefaultProps: ErklaertProps = {
	subtitles: true,
	sfx: true,
	music: true,
	voiceVolume: 1,
	sfxVolume: 1,
	showSafeArea: false,
	voiceover: voiceoverManifest as VoiceoverManifest,
};

export const calculateErklaertGratisMetadata: CalculateMetadataFunction<ErklaertProps> = ({props}) => {
	const timeline = erklaertTimeline(GRATIS_EPISODE, props.voiceover, VIDEO.fps);
	return {durationInFrames: timeline.durationInFrames, props: {...props, timeline}};
};

export const FrankfurtErklaertGratisNahverkehr: React.FC<ErklaertProps> = (props) => <ErklaertFrame ep={GRATIS_EPISODE} {...props} />;
