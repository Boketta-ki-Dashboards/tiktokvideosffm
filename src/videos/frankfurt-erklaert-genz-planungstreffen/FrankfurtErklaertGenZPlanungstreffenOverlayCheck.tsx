import React from 'react';
import {Sequence} from 'remotion';
import {createTikTokStyleCaptions} from '@remotion/captions';
import {erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import {OverlayCheckSheet} from '../../formats/frankfurt-erklaert/OverlayCheck';
import {handleWithAt} from '../../theme/brand';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import {erklaertPlanungDefaultProps, FrankfurtErklaertGenZPlanungstreffen, PLANUNG_EPISODE} from './FrankfurtErklaertGenZPlanungstreffen';

ensureFontsLoaded();

const timeline = erklaertTimeline(PLANUNG_EPISODE, erklaertPlanungDefaultProps.voiceover, VIDEO.fps);
const sceneAt = (id: string, fromEnd: number) => {
	const s = timeline.scenes.find((x) => x.id === id);
	return s ? s.from + s.durationInFrames - Math.round(fromEnd * VIDEO.fps) : 0;
};

/** Untertitel-Seiten wie im Video (TikTokSubtitles: 700 ms / 90 ms) – kürzeste (1 Zeile) und längste (2 Zeilen) Seite im Informationsteil. */
const pages = createTikTokStyleCaptions({captions: erklaertPlanungDefaultProps.voiceover.captions, combineTokensWithinMilliseconds: 700, breakOnSilenceAfterMilliseconds: 90}).pages
	.map((p) => ({text: p.text.trim(), frame: Math.round((p.startMs / 1000) * VIDEO.fps) + 6}))
	.filter((p) => p.frame > 60 && p.frame < sceneAt('offen', 0));
const longest = pages.reduce((a, b) => (b.text.length > a.text.length ? b : a), pages[0] ?? {text: '', frame: 0});
const shortest = pages.filter((p) => p.text.length >= 4).reduce((a, b) => (b.text.length < a.text.length ? b : a), pages[0] ?? {text: '', frame: 0});

/** Prüfframes: Termin (Karte + Website-Karte) und Polizei (Zitat + offizielle Karte + Hinweis, dichteste Szene) – je kurz vor Szenenende; Untertitel 1- und 2-zeilig. */
export const OVERLAY_CHECK_FRAMES = {calm: sceneAt('termin', 0.4), busy: sceneAt('polizei', 0.4), oneLine: shortest.frame, twoLines: longest.frame} as const;
export const SUBTITLE_SAMPLES = {oneLine: shortest.text, twoLines: longest.text} as const;

const Frame: React.FC<{at: number}> = ({at}) => (
	<Sequence from={-at}>
		<FrankfurtErklaertGenZPlanungstreffen {...erklaertPlanungDefaultProps} timeline={timeline} />
	</Sequence>
);

const CAPTION = 'GEN Z REGELT FRANKFURT – WAS SOLL SICH AM 12. DEZEMBER ÄNDERN? … mehr';

/**
 * Serien-Overlay-Prüfung (Export FrankfurtRedNews_GenZ_Planungstreffen_12Dezember_25Nov2026_OVERLAY_PRUEFUNG.png, nicht zur Veröffentlichung):
 * 1) reiner Videoframe, 2) derselbe Frame mit simulierter TikTok-Suchleiste, 3) Polizei-Szene mit Suchleiste.
 */
export const FrankfurtErklaertGenZPlanungstreffenOverlayCheck: React.FC = () => (
	<OverlayCheckSheet
		title="#18 · Gen Z Planungstreffen"
		handle={handleWithAt('news')}
		panels={[
			{label: '1 · ROHFRAME', sub: `Frame ${OVERLAY_CHECK_FRAMES.calm} · ohne App-Elemente`, node: <Frame at={OVERLAY_CHECK_FRAMES.calm} />},
			{label: '2 · MIT SUCHLEISTE', sub: `Frame ${OVERLAY_CHECK_FRAMES.calm} · 12.12. Gallusanlage`, node: <Frame at={OVERLAY_CHECK_FRAMES.calm} />, search: true},
			{label: '3 · POLIZEI', sub: `Frame ${OVERLAY_CHECK_FRAMES.busy} · Aussage + offiziell + Suchleiste`, node: <Frame at={OVERLAY_CHECK_FRAMES.busy} />, search: true},
		]}
	/>
);

/** Größe des Quellen-Prüfbogens (vier Ansichten). */
export const SOURCE_CHECK_SIZE = {width: 2280, height: 1180} as const;

/**
 * Quellenzeilen-Prüfung (Export FrankfurtRedNews_GenZ_Planungstreffen_12Dezember_25Nov2026_QUELLEN_PRUEFUNG.png, nicht zur Veröffentlichung): Quelle UNTER den
 * Untertiteln bei 1- und 2-zeiligen Untertiteln (mit Hilfslinien), Polizei und Termin – jeweils mit neutral nachgezeichneter App-Oberfläche.
 */
export const FrankfurtErklaertGenZPlanungstreffenSourceCheck: React.FC = () => (
	<OverlayCheckSheet
		heading="QUELLENZEILEN-PRÜFUNG"
		note="Prüfansicht – App-Elemente nur simuliert, nicht im Video"
		title="#18 · Gen Z Planungstreffen"
		handle={handleWithAt('news')}
		panels={[
			{label: '1 · UNTERTITEL 1 ZEILE', sub: `Frame ${OVERLAY_CHECK_FRAMES.oneLine} · „${SUBTITLE_SAMPLES.oneLine}“`, node: <Frame at={OVERLAY_CHECK_FRAMES.oneLine} />, zones: true},
			{label: '2 · UNTERTITEL 2 ZEILEN', sub: `Frame ${OVERLAY_CHECK_FRAMES.twoLines} · „${SUBTITLE_SAMPLES.twoLines}“`, node: <Frame at={OVERLAY_CHECK_FRAMES.twoLines} />, zones: true},
			{label: '3 · POLIZEI + APP', sub: `Frame ${OVERLAY_CHECK_FRAMES.busy}`, node: <Frame at={OVERLAY_CHECK_FRAMES.busy} />, app: CAPTION},
			{label: '4 · TERMIN + APP', sub: `Frame ${OVERLAY_CHECK_FRAMES.calm}`, node: <Frame at={OVERLAY_CHECK_FRAMES.calm} />, app: CAPTION},
		]}
	/>
);
