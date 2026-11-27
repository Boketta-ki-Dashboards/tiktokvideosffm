/**
 * Repräsentative Frames je Szene (Anfang · Hauptanimation · Höhepunkt · Ende) aus der echten Timeline –
 * für Vorher-Nachher-Kontaktbögen. Nutzt dieselbe buildTimeline wie die Komposition.
 */
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {buildTimeline} from '../../src/lib/timeline.ts';
import {ROOT} from './project.mjs';

export const sceneFrames = async ({videoId, planModule, planExport, fps = 30}) => {
	const dir = path.join(ROOT, 'src', 'videos', videoId);
	const script = JSON.parse(readFileSync(path.join(dir, 'script.json'), 'utf8'));
	const manifest = JSON.parse(readFileSync(path.join(dir, 'voiceover.json'), 'utf8'));
	const plan = (await import(path.join(dir, planModule)))[planExport];
	const tl = buildTimeline({scenes: plan, manifest, fps, tailMs: script.tailMs, maxDurationMs: script.maxDurationMs});
	return tl.scenes.map((s) => {
		const a = s.cutFrame + 12;
		const b = s.from + s.durationInFrames - 14;
		const span = Math.max(1, b - a);
		return {id: s.id, frames: [a, a + Math.round(span * 0.33), a + Math.round(span * 0.66), b]};
	});
};
