import React from 'react';
import type {CalculateMetadataFunction} from 'remotion';
import {flashCut, whipPan, zoomThrough} from '../../components/transitions/presentations';
import {type ErklaertEpisode, ErklaertFrame, type ErklaertProps, erklaertSchema, erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import type {VoiceoverManifest} from '../../lib/script-timing';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import videos from '../../../config/videos.json';
import {SOURCE_LINE} from './content';
import {STAEDTE_KEYWORDS, STAEDTE_SCENES} from './plan';
import {CoverScene, HamburgScene, LeipzigScene, MehrScene, OutroScene, VergleichScene} from './scenes/Scenes';
import script from './script.json';
import voiceoverManifest from './voiceover.json';

ensureFontsLoaded();

/**
 * Format B #15 „Gen-Z-Proteste: Was ist in Hamburg, Leipzig und den anderen Städten passiert?“ (Nachbetrachtung des 20.11.2026, Meldestand
 * 21.11.2026): Hamburg (rund 4.000, Demo weitgehend friedlich | nach dem Ende Pyrotechnik, Eier, Gewahrsam) · Leipzig (rund 2.500, nach dem Ende
 * massive Ausschreitungen, Wasserwerfer, 5 verletzte Beamte, > 200 Identitäten, Ermittlungen § 125a) · Berlin (rund 4.000, ohne besondere
 * Vorkommnisse) · Stuttgart (über 20 vorläufige Festnahmen) · Bremen (Farbe gegen CDU-Büro, Brandversuch an Auto) · Frankfurt (Halloween-Bilder
 * nicht wiederholt) · Einordnung „Demo ≠ Ausschreitung“. Quellenzeile unter den Untertiteln, Serien-Overlay oben rechts. Hartes Limit 60 s.
 */
export const STAEDTE_EPISODE: ErklaertEpisode = {
	episode: '#15',
	scenes: STAEDTE_SCENES,
	keywords: STAEDTE_KEYWORDS,
	components: {cover: CoverScene, hamburg: HamburgScene, leipzig: LeipzigScene, mehr: MehrScene, vergleich: VergleichScene, outro: OutroScene},
	transitions: {
		hamburg: zoomThrough({strength: 0.2, blur: 3}),
		leipzig: whipPan(),
		mehr: zoomThrough({strength: 0.2, blur: 3}),
		vergleich: flashCut(),
		outro: zoomThrough({strength: 0.3, blur: 4}),
	},
	script: {tailMs: script.tailMs, maxDurationMs: script.maxDurationMs},
	badgeFrom: 48,
	badgePlacement: 'top-right',
	maxSeconds: videos.FrankfurtErklaert20NovemberStaedte.maxSeconds,
	sourceLine: [...SOURCE_LINE],
};

export const erklaertStaedteSchema = erklaertSchema;

export const erklaertStaedteDefaultProps: ErklaertProps = {
	subtitles: true,
	sfx: true,
	music: true,
	voiceVolume: 1,
	sfxVolume: 1,
	showSafeArea: false,
	voiceover: voiceoverManifest as VoiceoverManifest,
};

export const calculateErklaertStaedteMetadata: CalculateMetadataFunction<ErklaertProps> = ({props}) => {
	const timeline = erklaertTimeline(STAEDTE_EPISODE, props.voiceover, VIDEO.fps);
	return {durationInFrames: timeline.durationInFrames, props: {...props, timeline}};
};

export const FrankfurtErklaert20NovemberStaedte: React.FC<ErklaertProps> = (props) => <ErklaertFrame ep={STAEDTE_EPISODE} {...props} />;
