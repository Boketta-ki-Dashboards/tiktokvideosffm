import React from 'react';
import {AbsoluteFill, type CalculateMetadataFunction, useVideoConfig} from 'remotion';
import {linearTiming, type TransitionPresentation, TransitionSeries} from '@remotion/transitions';
import {z} from 'zod';
import {MusicBed, SoundEffect, Voiceover} from '../../components/audio/Voiceover';
import {GrainOverlay} from '../../components/backgrounds/GrainOverlay';
import {SafeAreaGuides} from '../../components/layout/SafeArea';
import {TikTokSubtitles} from '../../components/subtitles/TikTokSubtitles';
import {circleReveal, flashCut, whipPan, zoomThrough} from '../../components/transitions/presentations';
import type {VoiceoverManifest} from '../../lib/script-timing';
import {buildTimeline, type Timeline} from '../../lib/timeline';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import type {Cues} from '../frankfurt-2026-10-31/cues';
// Outro: bewusst dasselbe wie in Folge 2 (Branding aus src/theme/brand.ts)
import {OutroScene} from '../frankfurt-2026-10-31-geschaefte/scenes/OutroScene';
import {Day14Scene} from './scenes/Day14Scene';
import {Day20Scene} from './scenes/Day20Scene';
import {Day21Scene} from './scenes/Day21Scene';
import {HookScene} from './scenes/HookScene';
import {NEXT_DEMO_SCENES} from './plan';
import {LawScene} from './scenes/LawScene';
import {PoliceScene} from './scenes/PoliceScene';
import {SummaryScene} from './scenes/SummaryScene';
import script from './script.json';
import voiceoverManifest from './voiceover.json';

ensureFontsLoaded();

/** Schlüsselwörter, deren Startframe die Szene als Cue bekommt (Wort muss im gesprochenen Text vorkommen). */
const SCENE_KEYWORDS: Record<string, string[]> = {
	d14: ['gelöscht'],
	d20: ['34'],
	police: ['Demonstrationsverbot'],
	outro: ['Plus', 'nicht'],
};

const SCENE_COMPONENTS: Record<string, React.FC<{cues: Cues; durationInFrames: number}>> = {
	hook: HookScene,
	d14: Day14Scene,
	d21: Day21Scene,
	d20: Day20Scene,
	police: PoliceScene,
	law: LawScene,
	summary: SummaryScene,
	outro: OutroScene,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TRANSITIONS: Record<string, TransitionPresentation<any>> = {
	d14: flashCut({color: '#BFD2FF'}),
	d21: whipPan(),
	d20: zoomThrough({strength: 0.5, blur: 12}),
	police: circleReveal({x: '30%', y: '35%'}),
	law: whipPan(),
	summary: zoomThrough({strength: 0.45, blur: 12}),
	outro: circleReveal({x: '50%', y: '40%'}),
};

export const nextDemoSchema = z.object({
	subtitles: z.boolean(),
	sfx: z.boolean(),
	music: z.boolean(),
	voiceVolume: z.number().min(0).max(2),
	showSafeArea: z.boolean(),
	voiceover: z.any(),
	timeline: z.any().optional(),
});

export type NextDemoProps = {
	subtitles: boolean;
	sfx: boolean;
	music: boolean;
	voiceVolume: number;
	showSafeArea: boolean;
	voiceover: VoiceoverManifest;
	timeline?: Timeline;
};

export const nextDemoDefaultProps: NextDemoProps = {
	subtitles: true,
	sfx: true,
	music: true,
	voiceVolume: 1,
	showSafeArea: false,
	voiceover: voiceoverManifest as VoiceoverManifest,
};

const plan = (manifest: VoiceoverManifest, fps: number) =>
	buildTimeline({scenes: NEXT_DEMO_SCENES, manifest, fps, tailMs: script.tailMs, maxDurationMs: script.maxDurationMs});

export const calculateNextDemoMetadata: CalculateMetadataFunction<NextDemoProps> = ({props}) => {
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
		const endMs = sceneSeg[sceneSeg.length - 1]?.endMs ?? Number.POSITIVE_INFINITY;
		const words: Record<string, number> = {};
		for (const k of keywords) {
			const hit = manifest.captions.find((c) => c.startMs >= startMs && c.startMs <= endMs && clean(c.text).startsWith(k));
			if (hit) words[k] = Math.round((hit.startMs / 1000) * fps) - sceneFrom;
		}

		cues.words = words;
	}

	return cues;
};

export const FrankfurtNextDemo: React.FC<NextDemoProps> = ({subtitles, sfx, music, voiceVolume, showSafeArea, voiceover, timeline}) => {
	const {fps} = useVideoConfig();
	const tl = timeline ?? plan(voiceover, fps);
	const sceneCues = tl.scenes.map((scene, i) => cuesFor(scene.from, scene.id, NEXT_DEMO_SCENES[i].segmentIds, voiceover, fps));
	const sceneStart = (id: string) => tl.scenes.find((s) => s.id === id)?.from ?? 0;
	const cuesOf = (id: string) => sceneCues[tl.scenes.findIndex((s) => s.id === id)];
	const gel = cuesOf('d14')?.words?.['gelöscht'];
	const to34 = cuesOf('d20')?.words?.['34'];

	return (
		<AbsoluteFill style={{backgroundColor: '#070B1A'}}>
			<TransitionSeries>
				{tl.scenes.flatMap((scene, i) => {
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
							<Scene cues={sceneCues[i]} durationInFrames={scene.durationInFrames} />
						</TransitionSeries.Sequence>,
					);
					return items;
				})}
			</TransitionSeries>

			<GrainOverlay opacity={0.05} vignette={0.4} />
			{subtitles ? <TikTokSubtitles captions={voiceover.captions} bottom={480} /> : null}
			<Voiceover manifest={voiceover} volume={voiceVolume} />
			{music ? <MusicBed src="music/ambient-bed.mp3" segments={voiceover.segments} volume={0.5} duckedVolume={0.2} /> : null}

			{sfx
				? [
						...tl.scenes.slice(1).map((s) => (
							<SoundEffect key={`sfx-${s.id}`} src="sfx/whoosh.wav" at={Math.max(0, s.cutFrame - 6)} volume={0.35} />
						)),
						gel !== undefined ? <SoundEffect key="sfx-stamp" src="sfx/impact.wav" at={sceneStart('d14') + gel + 10} volume={0.3} /> : null,
						to34 !== undefined ? <SoundEffect key="sfx-map" src="sfx/pop.wav" at={sceneStart('d20') + to34 + 8} volume={0.25} /> : null,
					]
				: null}

			{showSafeArea ? <SafeAreaGuides /> : null}
		</AbsoluteFill>
	);
};
