import React from 'react';
import {Sequence} from 'remotion';
import {createTikTokStyleCaptions} from '@remotion/captions';
import {erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import {OverlayCheckSheet} from '../../formats/frankfurt-erklaert/OverlayCheck';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import {AUSBLICK_EPISODE, erklaertAusblickDefaultProps, FrankfurtErklaert12DezemberAusblick} from './FrankfurtErklaert12DezemberAusblick';

ensureFontsLoaded();

const timeline = erklaertTimeline(AUSBLICK_EPISODE, erklaertAusblickDefaultProps.voiceover, VIDEO.fps);
const sceneAt = (id: string, fromEnd: number) => {
	const s = timeline.scenes.find((x) => x.id === id);
	return s ? s.from + s.durationInFrames - Math.round(fromEnd * VIDEO.fps) : 0;
};

/** Untertitel-Seiten wie im Video (TikTokSubtitles: 700 ms / 90 ms) – kürzeste (1 Zeile) und längste (2 Zeilen) Seite im Informationsteil. */
const pages = createTikTokStyleCaptions({captions: erklaertAusblickDefaultProps.voiceover.captions, combineTokensWithinMilliseconds: 700, breakOnSilenceAfterMilliseconds: 90}).pages
	.map((p) => ({text: p.text.trim(), frame: Math.round((p.startMs / 1000) * VIDEO.fps) + 6}))
	.filter((p) => p.frame > 60 && p.frame < sceneAt('zusagen', 0));
const longest = pages.reduce((a, b) => (b.text.length > a.text.length ? b : a), pages[0] ?? {text: '', frame: 0});
const shortest = pages.filter((p) => p.text.length >= 4).reduce((a, b) => (b.text.length < a.text.length ? b : a), pages[0] ?? {text: '', frame: 0});

/** Prüfframes: Rückblick (Zeil + Karten) und Frankfurt (Infokarte + Stufen, dichteste Szene) – je kurz vor Szenenende; Untertitel 1- und 2-zeilig. */
export const OVERLAY_CHECK_FRAMES = {calm: sceneAt('rueckblick', 0.4), busy: sceneAt('frankfurt', 0.4), oneLine: shortest.frame, twoLines: longest.frame} as const;
export const SUBTITLE_SAMPLES = {oneLine: shortest.text, twoLines: longest.text} as const;

const Frame: React.FC<{at: number}> = ({at}) => (
	<Sequence from={-at}>
		<FrankfurtErklaert12DezemberAusblick {...erklaertAusblickDefaultProps} timeline={timeline} />
	</Sequence>
);

const CAPTION = 'NACH DEM 20. NOVEMBER: SCHON DIE NÄCHSTE DEMO GEPLANT? … mehr';

/**
 * Serien-Overlay-Prüfung (Export FrankfurtRed3_GenZ_WieGehtEsWeiter_12Dezember_OVERLAY_PRUEFUNG.png, nicht zur Veröffentlichung):
 * 1) reiner Videoframe, 2) derselbe Frame mit simulierter TikTok-Suchleiste, 3) Frankfurt-Infokarte mit Suchleiste.
 */
export const FrankfurtErklaert12DezemberAusblickOverlayCheck: React.FC = () => (
	<OverlayCheckSheet
		title="#16 · Wie geht es weiter? 12.12."
		panels={[
			{label: '1 · ROHFRAME', sub: `Frame ${OVERLAY_CHECK_FRAMES.calm} · ohne App-Elemente`, node: <Frame at={OVERLAY_CHECK_FRAMES.calm} />},
			{label: '2 · MIT SUCHLEISTE', sub: `Frame ${OVERLAY_CHECK_FRAMES.calm} · Rückblick`, node: <Frame at={OVERLAY_CHECK_FRAMES.calm} />, search: true},
			{label: '3 · FRANKFURT', sub: `Frame ${OVERLAY_CHECK_FRAMES.busy} · Infokarte + Stufen + Suchleiste`, node: <Frame at={OVERLAY_CHECK_FRAMES.busy} />, search: true},
		]}
	/>
);

/** Größe des Quellen-Prüfbogens (vier Ansichten). */
export const SOURCE_CHECK_SIZE = {width: 2280, height: 1180} as const;

/**
 * Quellenzeilen-Prüfung (Export FrankfurtRed3_GenZ_WieGehtEsWeiter_12Dezember_QUELLEN_PRUEFUNG.png, nicht zur Veröffentlichung): Quelle UNTER den
 * Untertiteln bei 1- und 2-zeiligen Untertiteln (mit Hilfslinien), Frankfurt und Rückblick – jeweils mit neutral nachgezeichneter App-Oberfläche.
 */
export const FrankfurtErklaert12DezemberAusblickSourceCheck: React.FC = () => (
	<OverlayCheckSheet
		heading="QUELLENZEILEN-PRÜFUNG"
		note="Prüfansicht – App-Elemente nur simuliert, nicht im Video"
		title="#16 · Wie geht es weiter? 12.12."
		panels={[
			{label: '1 · UNTERTITEL 1 ZEILE', sub: `Frame ${OVERLAY_CHECK_FRAMES.oneLine} · „${SUBTITLE_SAMPLES.oneLine}“`, node: <Frame at={OVERLAY_CHECK_FRAMES.oneLine} />, zones: true},
			{label: '2 · UNTERTITEL 2 ZEILEN', sub: `Frame ${OVERLAY_CHECK_FRAMES.twoLines} · „${SUBTITLE_SAMPLES.twoLines}“`, node: <Frame at={OVERLAY_CHECK_FRAMES.twoLines} />, zones: true},
			{label: '3 · FRANKFURT + APP', sub: `Frame ${OVERLAY_CHECK_FRAMES.busy}`, node: <Frame at={OVERLAY_CHECK_FRAMES.busy} />, app: CAPTION},
			{label: '4 · RÜCKBLICK + APP', sub: `Frame ${OVERLAY_CHECK_FRAMES.calm}`, node: <Frame at={OVERLAY_CHECK_FRAMES.calm} />, app: CAPTION},
		]}
	/>
);
