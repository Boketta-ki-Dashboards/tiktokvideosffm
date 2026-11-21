/**
 * „20. November – wieder Eskalation?“ (FrankfurtNov20Forecast): Plan ↔ Skript ↔ Stimme und redaktionelle Leitplanken.
 * Prognosen dürfen nie als Fakt formuliert sein; keine Prozentwerte, kein „verboten“ als Tatsache, keine erfundenen Händler-Pläne.
 */
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {test} from 'node:test';
import {type VoiceoverManifest} from '../src/lib/script-timing.ts';
import {buildTimeline} from '../src/lib/timeline.ts';
import {NOV20_KEYWORDS, NOV20_SCENES} from '../src/videos/frankfurt-2026-11-20-ausblick/plan.ts';

const dir = '../src/videos/frankfurt-2026-11-20-ausblick/';
const read = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8');
const script = JSON.parse(read(`${dir}script.json`));
const manifest: VoiceoverManifest = JSON.parse(read(`${dir}voiceover.json`));
const display = (t: string) => t.replace(/\{([^|}]*)\|[^}]*\}/g, '$1');
const all = script.segments.map((s: {text: string}) => display(s.text)).join(' ');

test('jedes Segment gehört zu genau einer Szene, in Skript-Reihenfolge', () => {
	assert.deepEqual(
		NOV20_SCENES.flatMap((s) => s.segmentIds),
		script.segments.map((s: {id: string}) => s.id),
	);
});

test('Schlüsselwörter der Szenen kommen im Text ihrer Segmente vor', () => {
	for (const scene of NOV20_SCENES) {
		const text = scene.segmentIds.map((id) => display(script.segments.find((s: {id: string}) => s.id === id).text)).join(' ');
		const words = text.split(/\s+/).map((w) => w.replace(/[.,:;!?–„“"]/g, '').toLowerCase());
		for (const k of NOV20_KEYWORDS[scene.id] ?? []) {
			const kk = k.replace(/[.,:;!?–„“"]/g, '').toLowerCase();
			assert.ok(/^\d/.test(kk) ? words.includes(kk) : words.some((w) => w.startsWith(kk)), `${scene.id}: „${k}“ fehlt`);
		}
	}
});

test('Prognose bleibt Prognose: Konjunktiv/Einschätzung, keine Garantie, keine Prozentwerte', () => {
	assert.match(all, /Unsere Einschätzung/);
	assert.match(all, /könnte/);
	assert.match(all, /Sicher vorhersagen kann das aber niemand/);
	assert.doesNotMatch(all, /\d+\s*(%|Prozent)/);
	assert.doesNotMatch(all, /wird (garantiert|sicher) (ruhig|friedlich)|bleibt (garantiert|sicher) friedlich/i);
});

test('Verbot nur als Debatte, nie als Tatsache', () => {
	assert.match(all, /Verbot wird diskutiert/);
	assert.match(all, /entschieden ist bisher nichts/);
	assert.doesNotMatch(all, /(ist|wurde) verboten|Demo-Verbot steht/i);
});

test('Händler: keine konkreten Schutzpläne behauptet; Firma der Pointe ist als Fiktion markiert', () => {
	assert.doesNotMatch(all, /Snipes|11teamsports/, 'konkrete Läden nur im Bild mit „Pläne nicht bekannt“');
	assert.match(all, /Wer das wirklich plant, ist aber noch offen/);
	const content = read(`${dir}content.ts`);
	assert.match(content, /Pläne für den 20\.11\. nicht bekannt/);
	assert.match(content, /Erfundene Firma/);
	assert.doesNotMatch(all, /Euro|€/);
});

test('Verkleidung ≠ Randale; keine Kleidungs-Profiling-Aussage', () => {
	assert.match(all, /Verkleidet heißt nicht Randalierer/);
	assert.doesNotMatch(all, /an der Kleidung erkennen|jeder Vermummte/i);
});

test('Schnitte folgen der Stimme; Länge ≤ 112 s', () => {
	const fps = 30;
	const tl = buildTimeline({scenes: NOV20_SCENES, manifest, fps, tailMs: script.tailMs, maxDurationMs: script.maxDurationMs});
	NOV20_SCENES.forEach((spec, i) => {
		if (i === 0) return;
		const first = manifest.segments.find((s) => s.id === spec.segmentIds[0])!;
		assert.ok(Math.abs((tl.scenes[i].cutFrame / fps) * 1000 - first.startMs) <= 300, spec.id);
	});
	assert.ok(tl.durationInFrames / fps <= 112);
});

test('Sprecherspur: Adam, wenn vorhanden – sonst ehrlich als stumm markiert', () => {
	if (manifest.audioFile) {
		assert.ok(existsSync(new URL(`../public/${manifest.audioFile}`, import.meta.url)));
		assert.equal(manifest.captionsSource, 'elevenlabs-alignment');
		assert.equal((manifest.voice as {voiceSettings?: {speed?: number}} | undefined)?.voiceSettings?.speed, 1.16);
	} else {
		assert.equal(manifest.source, 'none');
	}
});
