/**
 * Prüft Folge 3: Szenenplan ↔ Skript ↔ Stimme. Schützt davor, dass ein neuer Satz keiner Szene zugeordnet ist
 * oder Schnitte nicht mehr an der Stimme hängen.
 */
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {test} from 'node:test';
import {type VoiceoverManifest} from '../src/lib/script-timing.ts';
import {buildTimeline} from '../src/lib/timeline.ts';
import {NEXT_DEMO_SCENES} from '../src/videos/frankfurt-2026-11-04-naechste-demo/plan.ts';

const dir = '../src/videos/frankfurt-2026-11-04-naechste-demo/';
const script = JSON.parse(readFileSync(new URL(`${dir}script.json`, import.meta.url), 'utf8'));
const manifest: VoiceoverManifest = JSON.parse(readFileSync(new URL(`${dir}voiceover.json`, import.meta.url), 'utf8'));

test('jedes Sprechersegment gehört zu genau einer Szene, in Skript-Reihenfolge', () => {
	const planned = NEXT_DEMO_SCENES.flatMap((s) => s.segmentIds);
	assert.deepEqual(
		planned,
		script.segments.map((s: {id: string}) => s.id),
	);
});

test('Sprecherspur: Datei vorhanden, alle Segmente zeitlich geordnet und ohne Überlappung', () => {
	assert.ok(manifest.audioFile, 'keine Sprecherdatei – stummes Manifest?');
	assert.ok(existsSync(new URL(`../public/${manifest.audioFile}`, import.meta.url)));
	for (let i = 1; i < manifest.segments.length; i++) {
		assert.ok(manifest.segments[i].startMs >= manifest.segments[i - 1].endMs, `${manifest.segments[i].id} überlappt`);
	}
});

test('Schnitte liegen kurz vor dem ersten Satz jeder Szene (± 0,3 s) und die Länge bleibt unter 80 s', () => {
	const fps = 30;
	const tl = buildTimeline({scenes: NEXT_DEMO_SCENES, manifest, fps, tailMs: script.tailMs, maxDurationMs: script.maxDurationMs});
	NEXT_DEMO_SCENES.forEach((spec, i) => {
		const first = manifest.segments.find((s) => s.id === spec.segmentIds[0])!;
		const cutMs = (tl.scenes[i].cutFrame / fps) * 1000;
		assert.ok(Math.abs(cutMs - first.startMs) <= 300, `${spec.id}: Schnitt ${cutMs} ms vs. Satzbeginn ${first.startMs} ms`);
	});
	assert.ok(tl.durationInFrames / fps < 80, `zu lang: ${(tl.durationInFrames / fps).toFixed(1)} s`);
});

test('Schlüsselwörter der Szenen kommen in den Untertiteln vor', () => {
	const words = manifest.captions.map((c) => c.text.trim().replace(/[.,:;!?–]/g, ''));
	for (const k of ['gelöscht', '34', 'Demonstrationsverbot', 'Plus', 'nicht']) {
		assert.ok(
			words.some((w) => w.startsWith(k)),
			`Schlüsselwort „${k}“ fehlt`,
		);
	}
});
