import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {linearTiming, type TransitionPresentation, TransitionSeries} from '@remotion/transitions';
import {z} from 'zod';
import {Sfx, SfxProvider} from '../../components/audio/Sfx';
import {MusicBed, Voiceover} from '../../components/audio/Voiceover';
import {GrainOverlay} from '../../components/backgrounds/GrainOverlay';
import {SafeAreaGuides} from '../../components/layout/SafeArea';
import {TikTokSubtitles} from '../../components/subtitles/TikTokSubtitles';
import type {VoiceoverManifest} from '../../lib/script-timing';
import type {SceneSpec, Timeline} from '../../lib/timeline';
import type {Cues} from '../../videos/frankfurt-2026-10-31/cues';
import {FormatBadge} from './Branding';
import {cuesForScene} from './cues';
import {erklaertTimelineFor} from './timeline.ts';

export const erklaertSchema = z.object({
	subtitles: z.boolean(),
	sfx: z.boolean(),
	music: z.boolean(),
	voiceVolume: z.number().min(0).max(2),
	sfxVolume: z.number().min(0).max(2),
	showSafeArea: z.boolean(),
	voiceover: z.any(),
	timeline: z.any().optional(),
});

export type ErklaertProps = {
	subtitles: boolean;
	sfx: boolean;
	music: boolean;
	voiceVolume: number;
	sfxVolume: number;
	showSafeArea: boolean;
	voiceover: VoiceoverManifest;
	timeline?: Timeline;
};

export type ErklaertEpisode = {
	/** z. B. „#01“ */
	episode: string;
	scenes: SceneSpec[];
	keywords: Record<string, string[]>;
	components: Record<string, React.FC<{cues: Cues; durationInFrames: number}>>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	transitions: Record<string, TransitionPresentation<any>>;
	script: {tailMs: number; maxDurationMs?: number};
	/** Ab welchem Frame das Format-Badge erscheint (Standard 2; später, wenn das Titelbild im Video liegt). */
	badgeFrom?: number;
	/** Nur mit begründeter Ausnahme in config/videos.json (Informationsteil + Abo-Aufruf): Gesamtgrenze bis 66 s. */
	maxSeconds?: number;
};

/** Timeline einer Kurzfolge – nie länger als 60 s (Formatgrenze, siehe ./timeline.ts). */
export const erklaertTimeline = (ep: ErklaertEpisode, manifest: VoiceoverManifest, fps: number) => erklaertTimelineFor(ep.scenes, ep.script, manifest, fps, ep.maxSeconds);

/**
 * Rahmen jeder „Frankfurt erklärt“-Folge: Szenen mit Übergängen an den Stimm-Schnitten, Format-Badge mit 60-s-Ring,
 * TikTok-Untertitel, Adam-Stimme, leises Musikbett, Schnitt-Whooshes. Folgen liefern nur Szenen, Plan und Schlüsselwörter.
 */
export const ErklaertFrame: React.FC<ErklaertProps & {ep: ErklaertEpisode}> = ({ep, subtitles, sfx, music, voiceVolume, sfxVolume, showSafeArea, voiceover, timeline}) => {
	const {fps} = useVideoConfig();
	const tl = timeline ?? erklaertTimeline(ep, voiceover, fps);
	const sceneCues = tl.scenes.map((scene, i) => cuesForScene(scene.from, ep.scenes[i], ep.keywords[scene.id], voiceover, fps));
	const outro = tl.scenes.find((s) => s.id === 'outro');

	return (
		<SfxProvider enabled={sfx} master={sfxVolume}>
			<AbsoluteFill style={{backgroundColor: '#05071A'}}>
				<TransitionSeries>
					{tl.scenes.flatMap((scene, i) => {
						const Scene = ep.components[scene.id];
						const items: React.ReactNode[] = [];
						if (i > 0 && scene.transitionInFrames > 0) {
							items.push(<TransitionSeries.Transition key={`t-${scene.id}`} presentation={ep.transitions[scene.id]} timing={linearTiming({durationInFrames: scene.transitionInFrames})} />);
						}

						items.push(
							<TransitionSeries.Sequence key={scene.id} name={`Szene: ${scene.id}`} durationInFrames={scene.durationInFrames}>
								<Scene cues={sceneCues[i]} durationInFrames={scene.durationInFrames} />
							</TransitionSeries.Sequence>,
						);
						return items;
					})}
				</TransitionSeries>

				<FormatBadge episode={ep.episode} totalFrames={tl.durationInFrames} hideFrom={outro ? outro.cutFrame - 4 : undefined} showFrom={ep.badgeFrom} />
				<GrainOverlay opacity={0.04} vignette={0.38} />
				{subtitles ? <TikTokSubtitles captions={voiceover.captions} bottom={480} /> : null}
				<Voiceover manifest={voiceover} volume={voiceVolume} />
				{music ? <MusicBed src="music/ambient-bed.mp3" segments={voiceover.segments} volume={0.3} duckedVolume={0.09} /> : null}
				{tl.scenes.slice(1).map((s) => (
					<Sfx key={`cut-${s.id}`} name="whoosh" at={Math.max(0, s.cutFrame - 5)} volume={0.75} />
				))}
				{showSafeArea ? <SafeAreaGuides /> : null}
			</AbsoluteFill>
		</SfxProvider>
	);
};
