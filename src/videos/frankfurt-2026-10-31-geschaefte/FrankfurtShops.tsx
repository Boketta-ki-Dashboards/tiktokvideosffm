import React from 'react';
import {AbsoluteFill, type CalculateMetadataFunction, useVideoConfig} from 'remotion';
import {linearTiming, type TransitionPresentation, TransitionSeries} from '@remotion/transitions';
import {z} from 'zod';
import {SoundEffect, Voiceover} from '../../components/audio/Voiceover';
import {GrainOverlay} from '../../components/backgrounds/GrainOverlay';
import {SafeAreaGuides} from '../../components/layout/SafeArea';
import {TikTokSubtitles} from '../../components/subtitles/TikTokSubtitles';
import {circleReveal, zoomThrough} from '../../components/transitions/presentations';
import type {VoiceoverManifest} from '../../lib/script-timing';
import {buildTimeline, type SceneSpec, type Timeline} from '../../lib/timeline';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import type {Cues} from '../frankfurt-2026-10-31/cues';
import {DamageMapScene} from './scenes/DamageMapScene';
import {HookScene} from './scenes/HookScene';
import {OutroScene} from './scenes/OutroScene';
import {TOUR} from './shops';
import script from './script.json';
import voiceoverManifest from './voiceover.json';

ensureFontsLoaded();

/** Folge 2 – „Welche Läden hat es getroffen?“ */
export const SHOPS_SCENES: SceneSpec[] = [
	{id: 'hook', segmentIds: ['hook1', 'hook2', 'hook3'], minSeconds: 5},
	{
		id: 'map',
		segmentIds: ['map1', ...TOUR.map((t) => t.segment), 'schaden', 'over1', 'over2'],
		transitionInFrames: 16,
	},
	{id: 'outro', segmentIds: ['outro'], transitionInFrames: 12},
];

const SCENE_KEYWORDS: Record<string, string[]> = {outro: ['Plus', 'nicht']};

const SCENE_COMPONENTS: Record<string, React.FC<{cues: Cues; durationInFrames: number}>> = {
	hook: HookScene,
	map: DamageMapScene,
	outro: OutroScene,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TRANSITIONS: Record<string, TransitionPresentation<any>> = {
	map: zoomThrough({strength: 0.55, blur: 14}),
	outro: circleReveal({x: '50%', y: '40%'}),
};

export const shopsSchema = z.object({
	subtitles: z.boolean(),
	sfx: z.boolean(),
	voiceVolume: z.number().min(0).max(2),
	showSafeArea: z.boolean(),
	voiceover: z.any(),
	timeline: z.any().optional(),
});

export type ShopsProps = {
	subtitles: boolean;
	sfx: boolean;
	voiceVolume: number;
	showSafeArea: boolean;
	voiceover: VoiceoverManifest;
	timeline?: Timeline;
};

export const shopsDefaultProps: ShopsProps = {
	subtitles: true,
	sfx: true,
	voiceVolume: 1,
	showSafeArea: false,
	voiceover: voiceoverManifest as VoiceoverManifest,
};

const plan = (manifest: VoiceoverManifest, fps: number) =>
	buildTimeline({scenes: SHOPS_SCENES, manifest, fps, tailMs: script.tailMs, maxDurationMs: script.maxDurationMs});

export const calculateShopsMetadata: CalculateMetadataFunction<ShopsProps> = ({props}) => {
	const timeline = plan(props.voiceover, VIDEO.fps);
	return {durationInFrames: timeline.durationInFrames, props: {...props, timeline}};
};

const clean = (t: string) => t.trim().replace(/[.,:;!?–]/g, '');

const cuesFor = (sceneFrom: number, sceneId: string, segmentIds: string[], manifest: VoiceoverManifest, fps: number): Cues => {
	const cues: Cues = {};
	for (const s of manifest.segments) {
		if (segmentIds.includes(s.id)) {
			cues[s.id] = {from: Math.round((s.startMs / 1000) * fps) - sceneFrom, to: Math.round((s.endMs / 1000) * fps) - sceneFrom};
		}
	}

	const keywords = SCENE_KEYWORDS[sceneId];
	if (keywords) {
		const sceneSeg = manifest.segments.filter((s) => segmentIds.includes(s.id));
		const startMs = sceneSeg[0]?.startMs ?? 0;
		const words: Record<string, number> = {};
		for (const k of keywords) {
			const hit = manifest.captions.find((c) => c.startMs >= startMs && clean(c.text).startsWith(k));
			if (hit) words[k] = Math.round((hit.startMs / 1000) * fps) - sceneFrom;
		}

		cues.words = words;
	}

	return cues;
};

export const FrankfurtShops: React.FC<ShopsProps> = ({subtitles, sfx, voiceVolume, showSafeArea, voiceover, timeline}) => {
	const {fps} = useVideoConfig();
	const tl = timeline ?? plan(voiceover, fps);
	const tourStarts = TOUR.map((t) => voiceover.segments.find((s) => s.id === t.segment)).filter(Boolean);

	return (
		<AbsoluteFill style={{backgroundColor: '#070B1A'}}>
			<TransitionSeries>
				{tl.scenes.flatMap((scene, i) => {
					const spec = SHOPS_SCENES[i];
					const Scene = SCENE_COMPONENTS[scene.id];
					const items: React.ReactNode[] = [];
					if (i > 0 && scene.transitionInFrames > 0) {
						items.push(
							<TransitionSeries.Transition
								key={`t-${scene.id}`}
								presentation={TRANSITIONS[scene.id]}
								timing={linearTiming({durationInFrames: scene.transitionInFrames})}
							/>,
						);
					}

					items.push(
						<TransitionSeries.Sequence key={scene.id} name={`Szene: ${scene.id}`} durationInFrames={scene.durationInFrames}>
							<Scene cues={cuesFor(scene.from, scene.id, spec.segmentIds, voiceover, fps)} durationInFrames={scene.durationInFrames} />
						</TransitionSeries.Sequence>,
					);
					return items;
				})}
			</TransitionSeries>

			<GrainOverlay opacity={0.05} vignette={0.4} />
			{subtitles ? <TikTokSubtitles captions={voiceover.captions} bottom={480} /> : null}
			<Voiceover manifest={voiceover} volume={voiceVolume} />

			{sfx
				? [
						...tl.scenes.slice(1).map((s) => (
							<SoundEffect key={`sfx-${s.id}`} src="sfx/whoosh.wav" at={Math.max(0, s.cutFrame - 6)} volume={0.35} />
						)),
						...tourStarts.map((s) => (
							<SoundEffect key={`pop-${s!.id}`} src="sfx/pop.wav" at={Math.round((s!.startMs / 1000) * fps) + 4} volume={0.22} />
						)),
					]
				: null}

			{showSafeArea ? <SafeAreaGuides /> : null}
		</AbsoluteFill>
	);
};
