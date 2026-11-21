import React from 'react';
import type {CalculateMetadataFunction} from 'remotion';
import {flashCut, whipPan, zoomThrough} from '../../components/transitions/presentations';
import {type ErklaertEpisode, ErklaertFrame, type ErklaertProps, erklaertSchema, erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import type {VoiceoverManifest} from '../../lib/script-timing';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import videos from '../../../config/videos.json';
import {SOURCE_LINE} from './content';
import {KONTROLLEN_KEYWORDS, KONTROLLEN_SCENES} from './plan';
import {CoverScene, DebateScene, ItemsScene, OutroScene, StatsScene, SuspectsScene, ZeilScene} from './scenes/Scenes';
import script from './script.json';
import voiceoverManifest from './voiceover.json';

ensureFontsLoaded();

/**
 * Format B #13 „Über 2.150 Kontrollen auf der Zeil – was hat die Polizei gefunden?“ (produziert 19.11.2026; Stand: Bilanz des Innenministeriums
 * vom 18.11.2026, Kontrollen seit 01.11.): 2.150+ Kontrollierte (≠ schuldig), 78 Strafanzeigen · 435 Ordnungswidrigkeiten · 182 Platzverweise
 * (nicht addieren), Sicherstellungen, 2 durch die Kontrollen identifizierte Halloween-Tatverdächtige (laut hessenschau; insgesamt 99 ermittelt),
 * Bewertung vs. Kritik, Fortsetzung nach Freitag. Quellenzeile unter den Untertiteln. Hartes Limit 60 s inkl. Abo-Aufruf.
 */
export const KONTROLLEN_EPISODE: ErklaertEpisode = {
	episode: '#13',
	scenes: KONTROLLEN_SCENES,
	keywords: KONTROLLEN_KEYWORDS,
	components: {cover: CoverScene, zeil: ZeilScene, stats: StatsScene, items: ItemsScene, suspects: SuspectsScene, debate: DebateScene, outro: OutroScene},
	transitions: {
		zeil: zoomThrough({strength: 0.2, blur: 3}),
		stats: zoomThrough({strength: 0.3, blur: 4}),
		items: whipPan(),
		suspects: flashCut(),
		debate: whipPan(),
		outro: zoomThrough({strength: 0.3, blur: 4}),
	},
	script: {tailMs: script.tailMs, maxDurationMs: script.maxDurationMs},
	badgeFrom: 48,
	badgePlacement: 'top-right',
	maxSeconds: videos.FrankfurtErklaert2150Kontrollen.maxSeconds,
	sourceLine: [...SOURCE_LINE],
};

export const erklaertKontrollenSchema = erklaertSchema;

export const erklaertKontrollenDefaultProps: ErklaertProps = {
	subtitles: true,
	sfx: true,
	music: true,
	voiceVolume: 1,
	sfxVolume: 1,
	showSafeArea: false,
	voiceover: voiceoverManifest as VoiceoverManifest,
};

export const calculateErklaertKontrollenMetadata: CalculateMetadataFunction<ErklaertProps> = ({props}) => {
	const timeline = erklaertTimeline(KONTROLLEN_EPISODE, props.voiceover, VIDEO.fps);
	return {durationInFrames: timeline.durationInFrames, props: {...props, timeline}};
};

export const FrankfurtErklaert2150Kontrollen: React.FC<ErklaertProps> = (props) => <ErklaertFrame ep={KONTROLLEN_EPISODE} {...props} />;
