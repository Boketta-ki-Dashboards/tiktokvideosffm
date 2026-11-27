import React from 'react';
import {Sequence} from 'remotion';
import {createTikTokStyleCaptions} from '@remotion/captions';
import {erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import {OverlayCheckSheet} from '../../formats/frankfurt-erklaert/OverlayCheck';
import {handleWithAt} from '../../theme/brand';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import {erklaertWocheDefaultProps, FrankfurtErklaertEineWocheDanach, WOCHE_EPISODE} from './FrankfurtErklaertEineWocheDanach';
import {DASHBOARD_BUILD} from './scenes/Scenes';

ensureFontsLoaded();

const timeline = erklaertTimeline(WOCHE_EPISODE, erklaertWocheDefaultProps.voiceover, VIDEO.fps);
const scene = (id: string) => timeline.scenes.find((x) => x.id === id);
const sceneAt = (id: string, fromEnd: number) => {
	const s = scene(id);
	return s ? s.from + s.durationInFrames - Math.round(fromEnd * VIDEO.fps) : 0;
};

/** Untertitel-Seiten wie im Video (TikTokSubtitles: 700 ms / 90 ms) – kürzeste (1 Zeile) und längste (2 Zeilen) Seite im Informationsteil. */
const pages = createTikTokStyleCaptions({captions: erklaertWocheDefaultProps.voiceover.captions, combineTokensWithinMilliseconds: 700, breakOnSilenceAfterMilliseconds: 90}).pages
	.map((p) => ({text: p.text.trim(), frame: Math.round((p.startMs / 1000) * VIDEO.fps) + 6}))
	.filter((p) => p.frame > 60 && p.frame < (scene('dashboard')?.from ?? 0));
const longest = pages.reduce((a, b) => (b.text.length > a.text.length ? b : a), pages[0] ?? {text: '', frame: 0});
const shortest = pages.filter((p) => p.text.length >= 4).reduce((a, b) => (b.text.length < a.text.length ? b : a), pages[0] ?? {text: '', frame: 0});

/**
 * Frame mit vollständig aufgebautem Dashboard (Aufbau + 3 s, mitten in der stabilen Phase) – derselbe Frame wird als Infografik-PNG exportiert.
 */
export const DASHBOARD_FRAME = (scene('dashboard')?.from ?? 0) + DASHBOARD_BUILD + 90;

/** Prüfframes: Leipzig (Personen-Raster), Hamburg (Drucksachen) und das bundesweite Dashboard (dichteste Szene); Untertitel 1- und 2-zeilig. */
export const OVERLAY_CHECK_FRAMES = {calm: sceneAt('leipzig', 0.4), docs: sceneAt('hamburg', 0.4), busy: DASHBOARD_FRAME, oneLine: shortest.frame, twoLines: longest.frame} as const;
export const SUBTITLE_SAMPLES = {oneLine: shortest.text, twoLines: longest.text} as const;

const Frame: React.FC<{at: number}> = ({at}) => (
	<Sequence from={-at}>
		<FrankfurtErklaertEineWocheDanach {...erklaertWocheDefaultProps} timeline={timeline} />
	</Sequence>
);

const CAPTION = 'GEN Z: EINE WOCHE DANACH – WAS ERMITTELT DIE POLIZEI? … mehr';

/**
 * Serien-Overlay-Prüfung (Export …_OVERLAY_PRUEFUNG.png, nicht zur Veröffentlichung): 1) Leipzig-Frame roh, 2) derselbe Frame mit simulierter
 * TikTok-Suchleiste, 3) Dashboard mit Suchleiste.
 */
export const FrankfurtErklaertEineWocheDanachOverlayCheck: React.FC = () => (
	<OverlayCheckSheet
		title="#20 · Eine Woche danach"
		handle={handleWithAt('news')}
		panels={[
			{label: '1 · ROHFRAME', sub: `Frame ${OVERLAY_CHECK_FRAMES.calm} · Leipzig`, node: <Frame at={OVERLAY_CHECK_FRAMES.calm} />},
			{label: '2 · SUCHLEISTE', sub: `Frame ${OVERLAY_CHECK_FRAMES.docs} · Hamburg`, node: <Frame at={OVERLAY_CHECK_FRAMES.docs} />, search: true},
			{label: '3 · DASHBOARD', sub: `Frame ${OVERLAY_CHECK_FRAMES.busy} · sechs Städte + Suchleiste`, node: <Frame at={OVERLAY_CHECK_FRAMES.busy} />, search: true},
		]}
	/>
);

/** Größe des Quellen-Prüfbogens (vier Ansichten). */
export const SOURCE_CHECK_SIZE = {width: 2280, height: 1180} as const;

/**
 * Quellenzeilen-Prüfung (Export …_QUELLEN_PRUEFUNG.png): Quelle UNTER den Untertiteln bei 1- und 2-zeiligen Untertiteln (mit Hilfslinien),
 * Dashboard und Hamburg – jeweils mit neutral nachgezeichneter App-Oberfläche (rechte Spalte und unterste Reihe sichtbar?).
 */
export const FrankfurtErklaertEineWocheDanachSourceCheck: React.FC = () => (
	<OverlayCheckSheet
		heading="QUELLENZEILEN-PRÜFUNG"
		note="Prüfansicht – App-Elemente nur simuliert, nicht im Video"
		title="#20 · Eine Woche danach"
		handle={handleWithAt('news')}
		panels={[
			{label: '1 · UNTERTITEL 1 ZEILE', sub: `Frame ${OVERLAY_CHECK_FRAMES.oneLine} · „${SUBTITLE_SAMPLES.oneLine}“`, node: <Frame at={OVERLAY_CHECK_FRAMES.oneLine} />, zones: true},
			{label: '2 · UNTERTITEL 2 ZEILEN', sub: `Frame ${OVERLAY_CHECK_FRAMES.twoLines} · „${SUBTITLE_SAMPLES.twoLines}“`, node: <Frame at={OVERLAY_CHECK_FRAMES.twoLines} />, zones: true},
			{label: '3 · DASHBOARD + APP', sub: `Frame ${OVERLAY_CHECK_FRAMES.busy}`, node: <Frame at={OVERLAY_CHECK_FRAMES.busy} />, app: CAPTION},
			{label: '4 · HAMBURG + APP', sub: `Frame ${OVERLAY_CHECK_FRAMES.docs}`, node: <Frame at={OVERLAY_CHECK_FRAMES.docs} />, app: CAPTION},
		]}
	/>
);

/**
 * Infografik (Export FrankfurtRedNews_GenZ_BundesweiteStatistik_27Nov2026.png): exakt der vollständig aufgebaute Dashboard-Frame aus dem Video
 * (1080 × 1920, inkl. Untertitel und Quellenzeile dieses Moments) – kein eigenes Zusatzdesign.
 */
export const FrankfurtErklaertEineWocheDanachInfografik: React.FC = () => <Frame at={DASHBOARD_FRAME} />;
