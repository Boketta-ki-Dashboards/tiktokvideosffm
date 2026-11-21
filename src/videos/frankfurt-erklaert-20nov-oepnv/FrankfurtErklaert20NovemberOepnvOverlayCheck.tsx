import React from 'react';
import {Sequence} from 'remotion';
import {erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import {OverlayCheckSheet} from '../../formats/frankfurt-erklaert/OverlayCheck';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import {erklaertOepnvDefaultProps, FrankfurtErklaert20NovemberOepnv, OEPNV_EPISODE} from './FrankfurtErklaert20NovemberOepnv';

ensureFontsLoaded();

const timeline = erklaertTimeline(OEPNV_EPISODE, erklaertOepnvDefaultProps.voiceover, VIDEO.fps);
const sceneAt = (id: string, fromEnd: number) => {
	const s = timeline.scenes.find((x) => x.id === id);
	return s ? s.from + s.durationInFrames - Math.round(fromEnd * VIDEO.fps) : 0;
};

/** Prüfframes: Uhr + Linien 11/12/14 (Titelkarte sichtbar) und ÖPNV-Karte (Titel, Linienkarte, Karte 18/30/M36) – je kurz vor Szenenende. */
export const OVERLAY_CHECK_FRAMES = {calm: sceneAt('tram', 0.5), busy: sceneAt('map', 0.6)} as const;

const Frame: React.FC<{at: number}> = ({at}) => (
	<Sequence from={-at}>
		<FrankfurtErklaert20NovemberOepnv {...erklaertOepnvDefaultProps} timeline={timeline} />
	</Sequence>
);

/**
 * Serien-Overlay-Prüfung (Export FrankfurtRed3_20November_OePNV_OVERLAY_PRUEFUNG.png, nicht zur Veröffentlichung):
 * 1) reiner Videoframe, 2) derselbe Frame mit simulierter TikTok-Suchleiste, 3) ÖPNV-Karte mit Suchleiste.
 */
export const FrankfurtErklaert20NovemberOepnvOverlayCheck: React.FC = () => (
	<OverlayCheckSheet
		title="#11 · ÖPNV am 20.11."
		panels={[
			{label: '1 · ROHFRAME', sub: `Frame ${OVERLAY_CHECK_FRAMES.calm} · ohne App-Elemente`, node: <Frame at={OVERLAY_CHECK_FRAMES.calm} />},
			{label: '2 · MIT SUCHLEISTE', sub: `Frame ${OVERLAY_CHECK_FRAMES.calm} · Linien 11/12/14`, node: <Frame at={OVERLAY_CHECK_FRAMES.calm} />, search: true},
			{label: '3 · KARTE', sub: `Frame ${OVERLAY_CHECK_FRAMES.busy} · ÖPNV-Karte + Suchleiste`, node: <Frame at={OVERLAY_CHECK_FRAMES.busy} />, search: true},
		]}
	/>
);
