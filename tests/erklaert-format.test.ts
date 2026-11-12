/**
 * Format B „Frankfurt erklärt in 60 Sekunden“: gilt automatisch für JEDE Folge mit `maxSeconds` in config/videos.json.
 * Bricht vor dem Rendern ab, wenn die Sprecherspur die Grenze reißt (Korrektur: Sprechertext kürzen, neu vertonen).
 */
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {test} from 'node:test';
import {FORMAT} from '../src/formats/frankfurt-erklaert/theme.ts';

const read = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8');
const videos: Record<string, {videoId: string; format?: string; maxSeconds?: number; infoMaxSeconds?: number; ausnahme?: string}> = JSON.parse(read('../config/videos.json'));
const limited = Object.entries(videos).filter(([, v]) => v.maxSeconds !== undefined);

test('mindestens eine Kurzfolge ist registriert', () => {
	assert.ok(limited.length >= 1);
});

for (const [comp, v] of limited) {
	test(`${comp}: Sprecherspur + Nachlauf ≤ ${v.maxSeconds} s`, () => {
		assert.equal(v.format, 'frankfurt-erklaert-60');
		// Regel: 60 s. Ausnahme nur mit Begründung (Informationsteil ≤ 61,5 s + Abo-Aufruf, gesamt ≤ 66 s)
		const max = v.maxSeconds ?? FORMAT.maxSeconds;
		if (max !== FORMAT.maxSeconds) {
			assert.ok(max <= FORMAT.extendedMaxSeconds, `maxSeconds ${max} > ${FORMAT.extendedMaxSeconds}`);
			assert.ok((v.ausnahme ?? '').length > 20, 'Längen-Ausnahme ohne Begründung (config/videos.json → ausnahme)');
			assert.ok((v.infoMaxSeconds ?? 99) <= FORMAT.infoMaxSeconds, 'infoMaxSeconds fehlt oder > 61,5 s');
		}
		const dir = `../src/videos/${v.videoId}/`;
		const script = JSON.parse(read(`${dir}script.json`));
		assert.ok(script.maxDurationMs <= max * 1000, 'maxDurationMs über der Formatgrenze');
		if (max !== FORMAT.maxSeconds) assert.equal(script.segments[script.segments.length - 1].id, 'cta', 'Ausnahme nur mit Abo-Aufruf als letztem Segment');
		// check-sync verlangt: Video ≥ Sprecher-MP3 + 0,3 s (MP3 ist ≈ 30 ms länger als das Manifest) → Nachlauf ≥ 350 ms
		assert.ok(script.tailMs >= 350, `tailMs ${script.tailMs} < 350 – check-sync würde „Stimme abgeschnitten“ melden`);
		if (!existsSync(new URL(`${dir}voiceover.json`, import.meta.url))) return;
		const manifest = JSON.parse(read(`${dir}voiceover.json`));
		const over = manifest.durationMs + 100 - max * 1000;
		assert.ok(over <= 0, `Stimme ${(manifest.durationMs / 1000).toFixed(2)} s – Sprechertext um ≥ ${(over / 1000).toFixed(2)} s kürzen`);
		if (max !== FORMAT.maxSeconds && String(manifest.source).startsWith('elevenlabs')) {
			// Informationsteil = alles vor dem Abo-Aufruf
			const cta = manifest.segments.find((x: {id: string}) => x.id === 'cta');
			assert.ok(cta, 'Segment cta fehlt im Manifest');
			const infoEnd = Math.max(...manifest.segments.filter((x: {id: string}) => x.id !== 'cta').map((x: {endMs: number}) => x.endMs));
			assert.ok(infoEnd <= (v.infoMaxSeconds ?? FORMAT.infoMaxSeconds) * 1000, `Informationsteil ${(infoEnd / 1000).toFixed(2)} s > ${v.infoMaxSeconds} s`);
		}
	});
}
