import React from 'react';
import {Sequence} from 'remotion';
import {erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import {OverlayCheckSheet} from '../../formats/frankfurt-erklaert/OverlayCheck';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import {erklaert20NovemberDefaultProps, FrankfurtErklaert20NovemberDreiProteste, NOV20_EPISODE} from './FrankfurtErklaert20NovemberDreiProteste';

ensureFontsLoaded();

const timeline = erklaertTimeline(NOV20_EPISODE, erklaert20NovemberDefaultProps.voiceover, VIDEO.fps);
const sceneAt = (id: string, sec: number) => (timeline.scenes.find((s) => s.id === id)?.from ?? 0) + Math.round(sec * VIDEO.fps);

/** Prüfframes: Schulstreik (ruhig) und Gen Z (vollste Szene, alle Karten sichtbar). */
export const OVERLAY_CHECK_FRAMES = {calm: sceneAt('schulstreik', 9.5), busy: sceneAt('genz', 7.6)} as const;

const Frame: React.FC<{at: number}> = ({at}) => (
	<Sequence from={-at}>
		<FrankfurtErklaert20NovemberDreiProteste {...erklaert20NovemberDefaultProps} timeline={timeline} />
	</Sequence>
);

/**
 * Serien-Overlay-Prüfung (Export FrankfurtRed3_20November_3Proteste_OVERLAY_PRUEFUNG.png, nicht zur Veröffentlichung):
 * 1) reiner Videoframe, 2) derselbe Frame mit simulierter TikTok-Suchleiste, 3) dichteste Szene mit Suchleiste.
 */
export const FrankfurtErklaert20NovemberDreiProtesteOverlayCheck: React.FC = () => (
	<OverlayCheckSheet
		title="#09 · 20.11."
		panels={[
			{label: '1 · ROHFRAME', sub: `Frame ${OVERLAY_CHECK_FRAMES.calm} · ohne App-Elemente`, node: <Frame at={OVERLAY_CHECK_FRAMES.calm} />},
			{label: '2 · MIT SUCHLEISTE', sub: `Frame ${OVERLAY_CHECK_FRAMES.calm} · simuliert`, node: <Frame at={OVERLAY_CHECK_FRAMES.calm} />, search: true},
			{label: '3 · VOLLE SZENE', sub: `Frame ${OVERLAY_CHECK_FRAMES.busy} · Gen Z + Suchleiste`, node: <Frame at={OVERLAY_CHECK_FRAMES.busy} />, search: true},
		]}
	/>
);
