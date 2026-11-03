import React from 'react';
import {AbsoluteFill, type CalculateMetadataFunction, useVideoConfig} from 'remotion';
import {linearTiming, type TransitionPresentation, TransitionSeries} from '@remotion/transitions';
import {z} from 'zod';
import {SoundEffect, Voiceover} from '../../components/audio/Voiceover';
import {GrainOverlay} from '../../components/backgrounds/GrainOverlay';
import {SafeAreaGuides} from '../../components/layout/SafeArea';
import {TikTokSubtitles} from '../../components/subtitles/TikTokSubtitles';
import {flashCut, whipPan, zoomThrough} from '../../components/transitions/presentations';
import type {VoiceoverManifest} from '../../lib/script-timing';
import {buildTimeline, type SceneSpec, type Timeline} from '../../lib/timeline';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import type {Cues} from './cues';
import {EscalationScene} from './scenes/EscalationScene';
import {IntroScene} from './scenes/IntroScene';
import {MediaScene} from './scenes/MediaScene';
import {ProtestScene} from './scenes/ProtestScene';
import {WorldScene} from './scenes/WorldScene';
import script from './script.json';
import voiceoverManifest from './voiceover.json';

ensureFontsLoaded();

export const FRANKFURT_SCENES: SceneSpec[] = [
	{id: 'intro', segmentIds: ['intro'], minSeconds: 2.6},
	{id: 'protest', segmentIds: ['protest'], transitionInFrames: 10},
	{id: 'escalation', segmentIds: ['escalation', 'bilanz'], transitionInFrames: 8},
	{id: 'world', segmentIds: ['media1', 'media2'], transitionInFrames: 14},
	{id: 'media', segmentIds: [], startAfterSegment: {id: 'media2', offsetMs: 250}, transitionInFrames: 12},
];

const SCENE_COMPONENTS: Record<string, React.FC<{cues: Cues; durationInFrames: number}>> = {
	intro: IntroScene,
	protest: ProtestScene,
	escalation: EscalationScene,
	world: WorldScene,
	media: MediaScene,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TRANSITIONS: Record<string, TransitionPresentation<any>> = {
	protest: whipPan({direction: 'left'}),
	escalation: flashCut({color: '#FFFFFF'}),
	world: zoomThrough({strength: 0.4}),
	media: whipPan({direction: 'up'}),
};

export const frankfurtSchema = z.object({
	subtitles: z.boolean(),
	sfx: z.boolean(),
	voiceVolume: z.number().min(0).max(2),
	showSafeArea: z.boolean(),
	voiceover: z.any(),
	timeline: z.any().optional(),
});

export type FrankfurtProps = {
	subtitles: boolean;
	sfx: boolean;
	voiceVolume: number;
	showSafeArea: boolean;
	voiceover: VoiceoverManifest;
	timeline?: Timeline;
};

export const frankfurtDefaultProps: FrankfurtProps = {
	subtitles: true,
	sfx: true,
	voiceVolume: 1,
	showSafeArea: false,
	voiceover: voiceoverManifest as VoiceoverManifest,
};

/** Länge des Videos folgt automatisch der Sprecherdatei (bzw. der Textschätzung). */
export const calculateFrankfurtMetadata: CalculateMetadataFunction<FrankfurtProps> = ({props}) => {
	const timeline = buildTimeline({
		scenes: FRANKFURT_SCENES,
		manifest: props.voiceover,
		fps: VIDEO.fps,
		tailMs: script.tailMs,
		maxDurationMs: script.maxDurationMs,
	});
	return {
		durationInFrames: timeline.durationInFrames,
		props: {...props, timeline},
	};
};

const cuesFor = (sceneFrom: number, segmentIds: string[], manifest: VoiceoverManifest, fps: number): Cues => {
	const cues: Cues = {};
	for (const s of manifest.segments) {
		if (segmentIds.includes(s.id)) {
			cues[s.id] = {
				from: Math.round((s.startMs / 1000) * fps) - sceneFrom,
				to: Math.round((s.endMs / 1000) * fps) - sceneFrom,
			};
		}
	}

	return cues;
};

export const FrankfurtHeadlines: React.FC<FrankfurtProps> = ({subtitles, sfx, voiceVolume, showSafeArea, voiceover, timeline}) => {
	const {fps} = useVideoConfig();
	const plan = timeline ?? buildTimeline({scenes: FRANKFURT_SCENES, manifest: voiceover, fps, tailMs: script.tailMs, maxDurationMs: script.maxDurationMs});

	return (
		<AbsoluteFill style={{backgroundColor: '#070B1A'}}>
			<TransitionSeries>
				{plan.scenes.flatMap((scene, i) => {
					const spec = FRANKFURT_SCENES[i];
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
							<Scene cues={cuesFor(scene.from, spec.segmentIds, voiceover, fps)} durationInFrames={scene.durationInFrames} />
						</TransitionSeries.Sequence>,
					);
					return items;
				})}
			</TransitionSeries>

			<GrainOverlay opacity={0.06} vignette={0.45} />

			{subtitles ? <TikTokSubtitles captions={voiceover.captions} /> : null}

			<Voiceover manifest={voiceover} volume={voiceVolume} />
			{sfx
				? plan.scenes.slice(1).map((s) => (
						<SoundEffect
							key={`sfx-${s.id}`}
							src={s.id === 'escalation' ? 'sfx/impact.wav' : 'sfx/whoosh.wav'}
							at={Math.max(0, s.cutFrame - 6)}
							volume={0.35}
						/>
					))
				: null}

			{showSafeArea ? <SafeAreaGuides /> : null}
		</AbsoluteFill>
	);
};
