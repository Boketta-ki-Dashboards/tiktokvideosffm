import React from 'react';
import {Sequence} from 'remotion';
import {createTikTokStyleCaptions} from '@remotion/captions';
import {erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import {OverlayCheckSheet} from '../../formats/frankfurt-erklaert/OverlayCheck';
import {handleWithAt} from '../../theme/brand';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import {erklaertGratisDefaultProps, FrankfurtErklaertGratisNahverkehr, GRATIS_EPISODE} from './FrankfurtErklaertGratisNahverkehr';

ensureFontsLoaded();

const timeline = erklaertTimeline(GRATIS_EPISODE, erklaertGratisDefaultProps.voiceover, VIDEO.fps);
const sceneAt = (id: string, fromEnd: number) => {
	const s = timeline.scenes.find((x) => x.id === id);
	return s ? s.from + s.durationInFrames - Math.round(fromEnd * VIDEO.fps) : 0;
};

/** Untertitel-Seiten wie im Video (TikTokSubtitles: 700 ms / 90 ms) – kürzeste (1 Zeile) und längste (2 Zeilen) Seite im Informationsteil. */
const pages = createTikTokStyleCaptions({captions: erklaertGratisDefaultProps.voiceover.captions, combineTokensWithinMilliseconds: 700, breakOnSilenceAfterMilliseconds: 90}).pages
	.map((p) => ({text: p.text.trim(), frame: Math.round((p.startMs / 1000) * VIDEO.fps) + 6}))
	.filter((p) => p.frame > 60 && p.frame < sceneAt('einordnung', 0));
const longest = pages.reduce((a, b) => (b.text.length > a.text.length ? b : a), pages[0] ?? {text: '', frame: 0});
const shortest = pages.filter((p) => p.text.length >= 4).reduce((a, b) => (b.text.length < a.text.length ? b : a), pages[0] ?? {text: '', frame: 0});

/** Prüfframes: Tarifkarte (2,5D-Karte + Stempel + Hinweis) und „Zwei Ereignisse – ein Datum“ (dichteste Szene) – je kurz vor Szenenende; Untertitel 1- und 2-zeilig. */
export const OVERLAY_CHECK_FRAMES = {calm: sceneAt('tarif', 0.4), busy: sceneAt('datum', 0.4), oneLine: shortest.frame, twoLines: longest.frame} as const;
export const SUBTITLE_SAMPLES = {oneLine: shortest.text, twoLines: longest.text} as const;

const Frame: React.FC<{at: number}> = ({at}) => (
	<Sequence from={-at}>
		<FrankfurtErklaertGratisNahverkehr {...erklaertGratisDefaultProps} timeline={timeline} />
	</Sequence>
);

const CAPTION = 'FRANKFURT MACHT BUS UND BAHN KOSTENLOS – AUSGERECHNET AM 12. DEZEMBER! … mehr';

/**
 * Serien-Overlay-Prüfung (Export FrankfurtRedNews_Kostenloser_Nahverkehr_12_19Dezember_26Nov2026_OVERLAY_PRUEFUNG.png, nicht zur Veröffentlichung):
 * 1) reiner Videoframe, 2) derselbe Frame mit simulierter TikTok-Suchleiste, 3) Datums-Szene mit Suchleiste.
 */
export const FrankfurtErklaertGratisNahverkehrOverlayCheck: React.FC = () => (
	<OverlayCheckSheet
		title="#19 · Gratis-ÖPNV"
		handle={handleWithAt('news')}
		panels={[
			{label: '1 · ROHFRAME', sub: `Frame ${OVERLAY_CHECK_FRAMES.calm} · ohne App-Elemente`, node: <Frame at={OVERLAY_CHECK_FRAMES.calm} />},
			{label: '2 · MIT SUCHLEISTE', sub: `Frame ${OVERLAY_CHECK_FRAMES.calm} · Tarifkarte`, node: <Frame at={OVERLAY_CHECK_FRAMES.calm} />, search: true},
			{label: '3 · DATUM', sub: `Frame ${OVERLAY_CHECK_FRAMES.busy} · zwei Ereignisse + Suchleiste`, node: <Frame at={OVERLAY_CHECK_FRAMES.busy} />, search: true},
		]}
	/>
);

/** Größe des Quellen-Prüfbogens (vier Ansichten). */
export const SOURCE_CHECK_SIZE = {width: 2280, height: 1180} as const;

/**
 * Quellenzeilen-Prüfung (Export FrankfurtRedNews_Kostenloser_Nahverkehr_12_19Dezember_26Nov2026_QUELLEN_PRUEFUNG.png, nicht zur Veröffentlichung): Quelle UNTER den
 * Untertiteln bei 1- und 2-zeiligen Untertiteln (mit Hilfslinien), Datum und Tarifkarte – jeweils mit neutral nachgezeichneter App-Oberfläche.
 */
export const FrankfurtErklaertGratisNahverkehrSourceCheck: React.FC = () => (
	<OverlayCheckSheet
		heading="QUELLENZEILEN-PRÜFUNG"
		note="Prüfansicht – App-Elemente nur simuliert, nicht im Video"
		title="#19 · Gratis-Nahverkehr"
		handle={handleWithAt('news')}
		panels={[
			{label: '1 · UNTERTITEL 1 ZEILE', sub: `Frame ${OVERLAY_CHECK_FRAMES.oneLine} · „${SUBTITLE_SAMPLES.oneLine}“`, node: <Frame at={OVERLAY_CHECK_FRAMES.oneLine} />, zones: true},
			{label: '2 · UNTERTITEL 2 ZEILEN', sub: `Frame ${OVERLAY_CHECK_FRAMES.twoLines} · „${SUBTITLE_SAMPLES.twoLines}“`, node: <Frame at={OVERLAY_CHECK_FRAMES.twoLines} />, zones: true},
			{label: '3 · DATUM + APP', sub: `Frame ${OVERLAY_CHECK_FRAMES.busy}`, node: <Frame at={OVERLAY_CHECK_FRAMES.busy} />, app: CAPTION},
			{label: '4 · TARIFKARTE + APP', sub: `Frame ${OVERLAY_CHECK_FRAMES.calm}`, node: <Frame at={OVERLAY_CHECK_FRAMES.calm} />, app: CAPTION},
		]}
	/>
);
