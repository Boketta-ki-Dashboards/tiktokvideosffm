/**
 * Unit-Tests der Timing-Logik (Node-Test-Runner, ohne Zusatzpakete):  npm test
 * Sichern ab, dass Szenenschnitte IMMER an der Stimme verankert bleiben.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {buildEstimatedManifest, estimateCaptionsForSegments, parseSegmentText, type VideoScript} from '../src/lib/script-timing.ts';
import {buildTimeline, type SceneSpec} from '../src/lib/timeline.ts';

const script: VideoScript = JSON.parse(readFileSync(new URL('../src/videos/frankfurt-2026-10-31/script.json', import.meta.url), 'utf8'));

test('Markup trennt Anzeige und Gesprochenes', () => {
	const p = parseSegmentText('Laut Polizei rund {8.000|achttausend}.');
	assert.equal(p.display, 'Laut Polizei rund 8.000.');
	assert.equal(p.spoken, 'Laut Polizei rund achttausend.');
	assert.deepEqual(
		p.words.map((w) => w.text),
		['Laut', 'Polizei', 'rund', '8.000.'],
	);
});

test('Satzzeichen hängen ohne Leerzeichen am Wort, Gedankenstrich mit', () => {
	const p = parseSegmentText('Frankfurt, {31. Oktober|einunddreißigster Oktober} . Tausende – laut');
	assert.deepEqual(
		p.words.map((w) => w.text),
		['Frankfurt,', '31.', 'Oktober.', 'Tausende –', 'laut'],
	);
});

test('Wort-Untertitel liegen lückenlos innerhalb ihres Segments', () => {
	const timings = [{id: 'protest', startMs: 1000, endMs: 4000}];
	const caps = estimateCaptionsForSegments(script, timings);
	assert.ok(caps.length > 3);
	assert.equal(caps[0].startMs, 1000);
	assert.ok(Math.abs(caps[caps.length - 1].endMs - 4000) <= 1);
	for (let i = 1; i < caps.length; i++) {
		assert.ok(caps[i].startMs >= caps[i - 1].startMs);
		assert.ok(caps[i].text.startsWith(' '));
	}
});

test('Schnitte bleiben an der Stimme verankert (keine Verschiebung durch minSeconds)', () => {
	const manifest = buildEstimatedManifest(script);
	const fps = 30;
	const scenes: SceneSpec[] = [
		{id: 'a', segmentIds: ['intro'], minSeconds: 30},
		{id: 'b', segmentIds: ['protest'], transitionInFrames: 10},
		{id: 'c', segmentIds: ['escalation', 'bilanz'], transitionInFrames: 8},
		{id: 'd', segmentIds: [], startAfterSegment: {id: 'bilanz', offsetMs: 250}, transitionInFrames: 12},
	];
	const originalWarn = console.warn;
	console.warn = () => undefined;
	const tl = buildTimeline({scenes, manifest, fps, tailMs: 1000, anticipationMs: 120});
	console.warn = originalWarn;

	const seg = (id: string) => manifest.segments.find((s) => s.id === id)!;
	assert.equal(tl.scenes[1].cutFrame, Math.round(((seg('protest').startMs - 120) / 1000) * fps));
	assert.equal(tl.scenes[2].cutFrame, Math.round(((seg('escalation').startMs - 120) / 1000) * fps));
	assert.equal(tl.scenes[3].cutFrame, Math.round(((seg('bilanz').endMs + 250) / 1000) * fps));

	// TransitionSeries-Arithmetik: Start(i+1) = Start(i) + Dauer(i) − Übergang(i+1)
	for (let i = 0; i < tl.scenes.length - 1; i++) {
		const next = tl.scenes[i + 1];
		assert.equal(tl.scenes[i].from + tl.scenes[i].durationInFrames - next.transitionInFrames, next.from);
		assert.equal(next.from, next.cutFrame - Math.floor(next.transitionInFrames / 2));
	}

	const last = tl.scenes[tl.scenes.length - 1];
	assert.equal(last.from + last.durationInFrames, tl.durationInFrames);
});

test('maxDurationMs kürzt den Nachlauf, aber nie unter 1,5 s', () => {
	const manifest = {...buildEstimatedManifest(script), durationMs: 17000};
	const scenes: SceneSpec[] = [{id: 'a', segmentIds: ['intro']}];
	assert.equal(buildTimeline({scenes, manifest, fps: 30, tailMs: 5000, maxDurationMs: 20000}).durationInFrames, 600);
	assert.equal(buildTimeline({scenes, manifest, fps: 30, tailMs: 5000, maxDurationMs: 17500}).durationInFrames, Math.floor(18.5 * 30));
});
