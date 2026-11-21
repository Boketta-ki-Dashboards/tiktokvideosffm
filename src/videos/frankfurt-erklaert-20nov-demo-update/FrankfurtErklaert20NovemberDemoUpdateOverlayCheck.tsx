import React from 'react';
import {Sequence} from 'remotion';
import {erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import {OverlayCheckSheet} from '../../formats/frankfurt-erklaert/OverlayCheck';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import {DEMOUPDATE_EPISODE, erklaertDemoUpdateDefaultProps, FrankfurtErklaert20NovemberDemoUpdate} from './FrankfurtErklaert20NovemberDemoUpdate';

ensureFontsLoaded();

const timeline = erklaertTimeline(DEMOUPDATE_EPISODE, erklaertDemoUpdateDefaultProps.voiceover, VIDEO.fps);
const sceneAt = (id: string, fromEnd: number) => {
	const s = timeline.scenes.find((x) => x.id === id);
	return s ? s.from + s.durationInFrames - Math.round(fromEnd * VIDEO.fps) : 0;
};

/** Prüfframes: Weseler Werft (Karte mit Titel) und Pressekonferenz (dichteste Szene, alle Karten sichtbar) – je kurz vor Szenenende. */
export const OVERLAY_CHECK_FRAMES = {calm: sceneAt('werft', 0.8), busy: sceneAt('press', 0.6)} as const;

const Frame: React.FC<{at: number}> = ({at}) => (
	<Sequence from={-at}>
		<FrankfurtErklaert20NovemberDemoUpdate {...erklaertDemoUpdateDefaultProps} timeline={timeline} />
	</Sequence>
);

/**
 * Serien-Overlay-Prüfung (Export FrankfurtRed3_20November_DemoUpdate_OVERLAY_PRUEFUNG.png, nicht zur Veröffentlichung):
 * 1) reiner Videoframe, 2) derselbe Frame mit simulierter TikTok-Suchleiste, 3) dichteste Szene mit Suchleiste.
 */
export const FrankfurtErklaert20NovemberDemoUpdateOverlayCheck: React.FC = () => (
	<OverlayCheckSheet
		title="#10 · Demo-Update"
		panels={[
			{label: '1 · ROHFRAME', sub: `Frame ${OVERLAY_CHECK_FRAMES.calm} · ohne App-Elemente`, node: <Frame at={OVERLAY_CHECK_FRAMES.calm} />},
			{label: '2 · MIT SUCHLEISTE', sub: `Frame ${OVERLAY_CHECK_FRAMES.calm} · simuliert`, node: <Frame at={OVERLAY_CHECK_FRAMES.calm} />, search: true},
			{label: '3 · VOLLE SZENE', sub: `Frame ${OVERLAY_CHECK_FRAMES.busy} · Pressekonferenz + Suchleiste`, node: <Frame at={OVERLAY_CHECK_FRAMES.busy} />, search: true},
		]}
	/>
);
