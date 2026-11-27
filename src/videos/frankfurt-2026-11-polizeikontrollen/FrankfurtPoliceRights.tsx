import React from 'react';
import {AbsoluteFill, type CalculateMetadataFunction, useVideoConfig} from 'remotion';
import {linearTiming, type TransitionPresentation, TransitionSeries} from '@remotion/transitions';
import {z} from 'zod';
import {Sfx, SfxProvider} from '../../components/audio/Sfx';
import {MusicBed, Voiceover} from '../../components/audio/Voiceover';
import {GrainOverlay} from '../../components/backgrounds/GrainOverlay';
import {SafeAreaGuides} from '../../components/layout/SafeArea';
import {TikTokSubtitles} from '../../components/subtitles/TikTokSubtitles';
import {circleReveal, whipPan, zoomThrough} from '../../components/transitions/presentations';
import type {VoiceoverManifest} from '../../lib/script-timing';
import {buildTimeline, type Timeline} from '../../lib/timeline';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import type {Cues} from '../frankfurt-2026-10-31/cues';
// Outro: dasselbe wie in den bisherigen Folgen (Branding aus src/theme/brand.ts)
import {OutroScene} from '../frankfurt-2026-10-31-geschaefte/scenes/OutroScene';
import {POLICE_RIGHTS_KEYWORDS, POLICE_RIGHTS_SCENES} from './plan';
import {BalanceScene} from './scenes/BalanceScene';
import {HookScene} from './scenes/HookScene';
import {LawScene} from './scenes/LawScene';
import {PhoneScene} from './scenes/PhoneScene';
import {QuestionScene} from './scenes/QuestionScene';
import {TipsScene} from './scenes/TipsScene';
import {WhyScene} from './scenes/WhyScene';
import script from './script.json';
import voiceoverManifest from './voiceover.json';

ensureFontsLoaded();

const SCENE_COMPONENTS: Record<string, React.FC<{cues: Cues; durationInFrames: number}>> = {
	hook: HookScene,
	why: WhyScene,
	phone: PhoneScene,
	law: LawScene,
	tips: TipsScene,
	balance: BalanceScene,
	question: QuestionScene,
	outro: OutroScene,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TRANSITIONS: Record<string, TransitionPresentation<any>> = {
	why: whipPan(),
	phone: zoomThrough({strength: 0.5, blur: 10}),
	law: whipPan(),
	tips: whipPan(),
	balance: circleReveal({x: '50%', y: '50%'}),
	question: zoomThrough({strength: 0.45, blur: 10}),
	outro: circleReveal({x: '50%', y: '40%'}),
};

export const policeRightsSchema = z.object({
	subtitles: z.boolean(),
	sfx: z.boolean(),
	music: z.boolean(),
	voiceVolume: z.number().min(0).max(2),
	sfxVolume: z.number().min(0).max(2),
	showSafeArea: z.boolean(),
	voiceover: z.any(),
	timeline: z.any().optional(),
});

export type PoliceRightsProps = {
	subtitles: boolean;
	sfx: boolean;
	music: boolean;
	voiceVolume: number;
	sfxVolume: number;
	showSafeArea: boolean;
	voiceover: VoiceoverManifest;
	timeline?: Timeline;
};

export const policeRightsDefaultProps: PoliceRightsProps = {
	subtitles: true,
	sfx: true,
	music: true,
	voiceVolume: 1,
	sfxVolume: 1,
	showSafeArea: false,
	voiceover: voiceoverManifest as VoiceoverManifest,
};

const plan = (manifest: VoiceoverManifest, fps: number) =>
	buildTimeline({scenes: POLICE_RIGHTS_SCENES, manifest, fps, tailMs: script.tailMs, maxDurationMs: script.maxDurationMs});

export const calculatePoliceRightsMetadata: CalculateMetadataFunction<PoliceRightsProps> = ({props}) => {
	const timeline = plan(props.voiceover, VIDEO.fps);
	return {durationInFrames: timeline.durationInFrames, props: {...props, timeline}};
};

const clean = (t: string) => t.trim().replace(/[.,:;!?–„“"]/g, '').toLowerCase();
/** Zahlen müssen exakt passen („3“ darf nicht „31.“ treffen), Wörter per Wortanfang. */
const matchesKeyword = (word: string, keyword: string) => {
	const w = clean(word);
	const k = clean(keyword);
	return /^\d/.test(k) ? w === k : w.startsWith(k);
};

/** Segment- und Schlüsselwort-Cues relativ zum Szenenstart (aus den echten Adam-Zeitstempeln). */
export const policeRightsCues = (sceneFrom: number, sceneId: string, segmentIds: string[], manifest: VoiceoverManifest, fps: number): Cues => {
	const cues: Cues = {};
	for (const s of manifest.segments) {
		if (segmentIds.includes(s.id)) {
			cues[s.id] = {from: Math.round((s.startMs / 1000) * fps) - sceneFrom, to: Math.round((s.endMs / 1000) * fps) - sceneFrom};
		}
	}

	const keywords = POLICE_RIGHTS_KEYWORDS[sceneId];
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

export const FrankfurtPoliceRights: React.FC<PoliceRightsProps> = ({subtitles, sfx, music, voiceVolume, sfxVolume, showSafeArea, voiceover, timeline}) => {
	const {fps} = useVideoConfig();
	const tl = timeline ?? plan(voiceover, fps);
	const sceneCues = tl.scenes.map((scene, i) => policeRightsCues(scene.from, scene.id, POLICE_RIGHTS_SCENES[i].segmentIds, voiceover, fps));

	return (
		<SfxProvider enabled={sfx} master={sfxVolume}>
			<AbsoluteFill style={{backgroundColor: '#05071A'}}>
				<TransitionSeries>
					{tl.scenes.flatMap((scene, i) => {
						const Scene = SCENE_COMPONENTS[scene.id];
						const items: React.ReactNode[] = [];
						if (i > 0 && scene.transitionInFrames > 0) {
							items.push(<TransitionSeries.Transition key={`t-${scene.id}`} presentation={TRANSITIONS[scene.id]} timing={linearTiming({durationInFrames: scene.transitionInFrames})} />);
						}

						items.push(
							<TransitionSeries.Sequence key={scene.id} name={`Szene: ${scene.id}`} durationInFrames={scene.durationInFrames}>
								<Scene cues={sceneCues[i]} durationInFrames={scene.durationInFrames} />
							</TransitionSeries.Sequence>,
						);
						return items;
					})}
				</TransitionSeries>

				<GrainOverlay opacity={0.045} vignette={0.4} />
				{subtitles ? <TikTokSubtitles captions={voiceover.captions} bottom={480} /> : null}
				<Voiceover manifest={voiceover} volume={voiceVolume} />
				{/* Musikbett bewusst leise (keine dramatische Musik) */}
				{music ? <MusicBed src="music/ambient-bed.mp3" segments={voiceover.segments} volume={0.32} duckedVolume={0.1} /> : null}
				{tl.scenes.slice(1).map((s) => (
					<Sfx key={`cut-${s.id}`} name="whoosh" at={Math.max(0, s.cutFrame - 6)} volume={s.id === 'outro' ? 0.7 : 0.8} />
				))}
				{showSafeArea ? <SafeAreaGuides /> : null}
			</AbsoluteFill>
		</SfxProvider>
	);
};
