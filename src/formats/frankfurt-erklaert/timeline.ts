import type {VoiceoverManifest} from '../../lib/script-timing.ts';
import {buildTimeline, type SceneSpec, type Timeline} from '../../lib/timeline.ts';
import {FORMAT} from './theme.ts';

/**
 * Formatgrenze durchsetzen: Ist die Timeline länger als `maxFrames`, wird der stumme Nachlauf der letzten Szene gekürzt
 * (automatische Korrektur). Endet schon die STIMME zu spät, bricht die Produktion mit Erklärung ab – Schnitte werden nie
 * gegen die Stimme verschoben; Korrektur dann über einen kürzeren Sprechertext (nur geänderte Sätze werden neu vertont).
 */
export const enforceMaxFrames = (tl: Timeline, manifest: VoiceoverManifest, fps: number, maxFrames: number): Timeline => {
	const voiceEnd = Math.ceil((manifest.durationMs / 1000) * fps);
	if (voiceEnd + 3 > maxFrames) {
		throw new Error(
			`Format „${FORMAT.name}“: Die Sprecherspur endet bei ${(manifest.durationMs / 1000).toFixed(2)} s – Grenze ${(maxFrames / fps).toFixed(0)} s inkl. Outro. ` +
				`Sprechertext um mindestens ${((voiceEnd + 3 - maxFrames) / fps).toFixed(2)} s kürzen (script.json), dann neu vertonen.`,
		);
	}

	if (tl.durationInFrames <= maxFrames) return tl;
	const cut = tl.durationInFrames - maxFrames;
	const scenes = tl.scenes.map((s, i) => (i === tl.scenes.length - 1 ? {...s, durationInFrames: Math.max(1, s.durationInFrames - cut)} : s));
	return {scenes, durationInFrames: maxFrames};
};

/** Timeline einer Kurzfolge – nie länger als 60 s (1.800 Frames bei 30 fps). */
export const erklaertTimelineFor = (scenes: SceneSpec[], script: {tailMs: number; maxDurationMs?: number}, manifest: VoiceoverManifest, fps: number) =>
	enforceMaxFrames(
		buildTimeline({scenes, manifest, fps, tailMs: script.tailMs, maxDurationMs: Math.min(script.maxDurationMs ?? FORMAT.maxSeconds * 1000, FORMAT.maxSeconds * 1000)}),
		manifest,
		fps,
		Math.round(FORMAT.maxSeconds * fps),
	);
