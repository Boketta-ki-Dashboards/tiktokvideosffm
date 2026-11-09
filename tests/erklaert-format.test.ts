/**
 * Format B „Frankfurt erklärt in 60 Sekunden“: gilt automatisch für JEDE Folge mit `maxSeconds` in config/videos.json.
 * Bricht vor dem Rendern ab, wenn die Sprecherspur die Grenze reißt (Korrektur: Sprechertext kürzen, neu vertonen).
 */
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {test} from 'node:test';
import {FORMAT} from '../src/formats/frankfurt-erklaert/theme.ts';

const read = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8');
const videos: Record<string, {videoId: string; format?: string; maxSeconds?: number}> = JSON.parse(read('../config/videos.json'));
const limited = Object.entries(videos).filter(([, v]) => v.maxSeconds !== undefined);

test('mindestens eine Kurzfolge ist registriert', () => {
	assert.ok(limited.length >= 1);
});

for (const [comp, v] of limited) {
	test(`${comp}: Sprecherspur + Nachlauf ≤ ${v.maxSeconds} s`, () => {
		assert.equal(v.format, 'frankfurt-erklaert-60');
		assert.equal(v.maxSeconds, FORMAT.maxSeconds);
		const dir = `../src/videos/${v.videoId}/`;
		const script = JSON.parse(read(`${dir}script.json`));
		assert.ok(script.maxDurationMs <= FORMAT.maxSeconds * 1000, 'maxDurationMs über der Formatgrenze');
		if (!existsSync(new URL(`${dir}voiceover.json`, import.meta.url))) return;
		const manifest = JSON.parse(read(`${dir}voiceover.json`));
		const over = manifest.durationMs + 100 - FORMAT.maxSeconds * 1000;
		assert.ok(over <= 0, `Stimme ${(manifest.durationMs / 1000).toFixed(2)} s – Sprechertext um ≥ ${(over / 1000).toFixed(2)} s kürzen`);
	});
}
