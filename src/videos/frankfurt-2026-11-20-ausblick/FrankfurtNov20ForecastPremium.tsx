import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {linearTiming, type TransitionPresentation, TransitionSeries} from '@remotion/transitions';
import {GrainOverlay} from '../../components/backgrounds/GrainOverlay';
import {SafeAreaGuides} from '../../components/layout/SafeArea';
import {TikTokSubtitles} from '../../components/subtitles/TikTokSubtitles';
import {circleReveal, flashCut, whipPan, zoomThrough} from '../../components/transitions/presentations';
import type {VoiceoverManifest} from '../../lib/script-timing';
import {buildTimeline} from '../../lib/timeline';
import {ensureFontsLoaded} from '../../theme/fonts';
import type {Cues} from '../frankfurt-2026-10-31/cues';
// Outro: unverändert dasselbe wie im Original und in Folge 2/3 (Branding aus src/theme/brand.ts)
import {OutroScene} from '../frankfurt-2026-10-31-geschaefte/scenes/OutroScene';
import {FrankfurtNov20Forecast, type Nov20Props} from './FrankfurtNov20Forecast';
import {NOV20_KEYWORDS, NOV20_SCENES} from './plan';
import {HalloweenPremium} from './premium/scenes/HalloweenPremium';
import {HookPremium} from './premium/scenes/HookPremium';
import {PolicePremium} from './premium/scenes/PolicePremium';
import {QuestionPremium} from './premium/scenes/QuestionPremium';
import {ShopsPremium} from './premium/scenes/ShopsPremium';
import {SummaryPremium} from './premium/scenes/SummaryPremium';
import {TwistPremium} from './premium/scenes/TwistPremium';
import script from './script.json';

ensureFontsLoaded();

/**
 * PREMIUM-Fassung von „Frankfurt am 20. November – wieder Eskalation?“
 *
 * Nur die Bildebene ist neu. Ton, Timing und Inhalt kommen unverändert aus dem Original:
 * - Tonquelle ist die Original-Komposition selbst (unsichtbar gemountet, Untertitel aus): Adam-Stimme,
 *   Musikbett, alle Szenen-SFX und Schnitt-Whooshes laufen bit-gleich über denselben Code.
 * - Gleiche Timeline (buildTimeline aus demselben Manifest + plan.ts), gleiche Übergänge, gleiche Cue-Formeln
 *   → jede Premium-Animation sitzt auf demselben Frame wie der zugehörige Original-Effekt.
 * - Untertitel: dieselbe Komponente, dieselben Captions, dieselbe Position.
 */

const SCENE_COMPONENTS: Record<string, React.FC<{cues: Cues; durationInFrames: number}>> = {
	hook: HookPremium,
	halloween: HalloweenPremium,
	police: PolicePremium,
	shops: ShopsPremium,
	summary: SummaryPremium,
	twist: TwistPremium,
	question: QuestionPremium,
	outro: OutroScene,
};

/** Identisch mit FrankfurtNov20Forecast (gleiche Übergänge an denselben Schnitten). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TRANSITIONS: Record<string, TransitionPresentation<any>> = {
	halloween: whipPan(),
	police: zoomThrough({strength: 0.5, blur: 12}),
	shops: whipPan(),
	summary: circleReveal({x: '50%', y: '45%'}),
	twist: flashCut({color: '#FFE9A8'}),
	question: zoomThrough({strength: 0.45, blur: 12}),
	outro: circleReveal({x: '50%', y: '40%'}),
};

const plan = (manifest: VoiceoverManifest, fps: number) =>
	buildTimeline({scenes: NOV20_SCENES, manifest, fps, tailMs: script.tailMs, maxDurationMs: script.maxDurationMs});

const clean = (t: string) => t.trim().replace(/[.,:;!?–„“"]/g, '').toLowerCase();
const matchesKeyword = (word: string, keyword: string) => {
	const w = clean(word);
	const k = clean(keyword);
	return /^\d/.test(k) ? w === k : w.startsWith(k);
};

/** Gleiche Cue-Berechnung wie im Original (Segment- und Schlüsselwort-Frames relativ zum Szenenstart). */
export const premiumCuesFor = (sceneFrom: number, sceneId: string, segmentIds: string[], manifest: VoiceoverManifest, fps: number): Cues => {
	const cues: Cues = {};
	for (const s of manifest.segments) {
		if (segmentIds.includes(s.id)) {
			cues[s.id] = {from: Math.round((s.startMs / 1000) * fps) - sceneFrom, to: Math.round((s.endMs / 1000) * fps) - sceneFrom};
		}
	}

	const keywords = NOV20_KEYWORDS[sceneId];
	if (keywords) {
		const sceneSeg = manifest.segments.filter((s) => segmentIds.includes(s.id));
		const startMs = sceneSeg[0]?.startMs ?? 0;
		const endMs = sceneSeg[sceneSeg.length - 1]?.endMs ?? Number.POSITIVE_INFINITY;
		const words: Record<string, number> = {};
		for (const k of keywords) {
			const hit = manifest.captions.find((c) => c.startMs >= startMs && c.startMs <= endMs && matchesKeyword(c.text, k));
			if (hit) words[k] = Math.round((hit.startMs / 1000) * fps) - sceneFrom;
		}

		cues.words = words;
	}

	return cues;
};

export const FrankfurtNov20ForecastPremium: React.FC<Nov20Props> = (props) => {
	const {subtitles, showSafeArea, voiceover, timeline} = props;
	const {fps} = useVideoConfig();
	const tl = timeline ?? plan(voiceover, fps);
	const sceneCues = tl.scenes.map((scene, i) => premiumCuesFor(scene.from, scene.id, NOV20_SCENES[i].segmentIds, voiceover, fps));

	return (
		<AbsoluteFill style={{backgroundColor: '#070B1A'}}>
			{/* Tonquelle: Original-Komposition, unsichtbar (liefert Stimme, Musik, SFX unverändert) */}
			<AbsoluteFill style={{display: 'none'}}>
				<FrankfurtNov20Forecast {...props} timeline={tl} subtitles={false} showSafeArea={false} />
			</AbsoluteFill>

			<TransitionSeries>
				{tl.scenes.flatMap((scene, i) => {
					const Scene = SCENE_COMPONENTS[scene.id];
					const items: React.ReactNode[] = [];
					if (i > 0 && scene.transitionInFrames > 0) {
						items.push(
							<TransitionSeries.Transition key={`t-${scene.id}`} presentation={TRANSITIONS[scene.id]} timing={linearTiming({durationInFrames: scene.transitionInFrames})} />,
						);
					}

					items.push(
						<TransitionSeries.Sequence key={scene.id} name={`Premium: ${scene.id}`} durationInFrames={scene.durationInFrames}>
							<Scene cues={sceneCues[i]} durationInFrames={scene.durationInFrames} />
						</TransitionSeries.Sequence>,
					);
					return items;
				})}
			</TransitionSeries>

			<GrainOverlay opacity={0.045} vignette={0.42} />
			{subtitles ? <TikTokSubtitles captions={voiceover.captions} bottom={480} /> : null}
			{showSafeArea ? <SafeAreaGuides /> : null}
		</AbsoluteFill>
	);
};
