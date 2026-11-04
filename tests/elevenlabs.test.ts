/**
 * ElevenLabs-Integration ohne Netzwerk: Konfiguration, Stimmprüfung, Cache-Schlüssel,
 * Zeichen-Zeitstempel → Untertitel und API-Fehlerbehandlung (mit Fake-fetch).
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {parseSegmentText} from '../src/lib/script-timing.ts';
import {
	captionsFromAlignment,
	createClient,
	isOriginalAdam,
	modelSupportsGerman,
	segmentCacheKey,
	speechWindow,
	tokenizeForAlignment,
} from '../scripts/lib/elevenlabs.mjs';

const read = (p: string) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'));
const voice = read('../config/voice.json');
const videos = read('../config/videos.json');

test('zentrale Konfiguration: Standard ist ElevenLabs Adam mit eleven_multilingual_v2, kein Key in der Datei', () => {
	assert.equal(voice.default, 'elevenlabs');
	const el = voice.elevenlabs;
	assert.equal(el.voiceName, 'Adam');
	assert.equal(el.modelId, 'eleven_multilingual_v2');
	assert.match(el.voiceId, /^[A-Za-z0-9]{20}$/);
	const s = el.voiceSettings;
	for (const k of ['stability', 'similarity_boost', 'style']) assert.ok(s[k] >= 0 && s[k] <= 1, k);
	assert.ok(s.speed >= 0.7 && s.speed <= 1.2, 'speed');
	const raw = readFileSync(new URL('../config/voice.json', import.meta.url), 'utf8');
	assert.ok(!/sk_[a-z0-9]{20,}|xi-api-key|"apiKey"/i.test(raw), 'kein API-Key in der Konfiguration');
	for (const [comp, v] of Object.entries<{videoId: string; outputName: string}>(videos)) {
		if (comp.startsWith('$')) continue;
		read(`../src/videos/${v.videoId}/script.json`);
		assert.match(v.outputName, /^FrankfurtRed3_Folge\d/);
	}
});

test('Tokenisierung für Zeitstempel = gleiche Wörter und gleicher gesprochener Text wie parseSegmentText', () => {
	for (const id of ['frankfurt-2026-10-31', 'frankfurt-2026-10-31-geschaefte', 'frankfurt-2026-11-04-naechste-demo']) {
		for (const seg of read(`../src/videos/${id}/script.json`).segments) {
			const ref = parseSegmentText(seg.text);
			const mine = tokenizeForAlignment(seg.text);
			assert.equal(mine.spoken, ref.spoken, `${id}/${seg.id}: gesprochen`);
			assert.deepEqual(
				mine.tokens.map((t: {text: string}) => t.text),
				ref.words.map((w) => w.text),
				`${id}/${seg.id}: Wörter`,
			);
			for (const t of mine.tokens) assert.ok(t.start < t.end && t.end <= mine.spoken.length, `${seg.id}: Bereich ${t.text}`);
		}
	}
});

test('Markup: Anzeige „14. November“ bekommt die Zeit von „vierzehnte November“', () => {
	const text = 'Der {14. November|vierzehnte November} kommt.';
	const {spoken, tokens} = tokenizeForAlignment(text);
	assert.equal(spoken, 'Der vierzehnte November kommt.');
	assert.equal(spoken.slice(tokens[1].start, tokens[1].end), 'vierzehnte');
	assert.equal(tokens[1].text, '14.');
	// gleichmäßige Fake-Zeitstempel: Zeichen i spricht von i*0,1 bis i*0,1+0,1 s
	const chars = [...spoken];
	const alignment = {characters: chars, character_start_times_seconds: chars.map((_, i) => i * 0.1), character_end_times_seconds: chars.map((_, i) => i * 0.1 + 0.1)};
	const {captions, exact} = captionsFromAlignment({text, alignment, offsetMs: 1000, cutStartSec: 0, first: true});
	assert.equal(exact, true);
	assert.deepEqual(
		captions.map((c: {text: string}) => c.text),
		['Der', ' 14.', ' November', ' kommt.'],
	);
	assert.equal(captions[1].startMs, 1000 + 4 * 100); // „vierzehnte“ beginnt bei Zeichen 4
	assert.equal(captions[1].endMs, 1000 + 14 * 100); // letztes „e“ = Zeichen 13, Ende 1,4 s
	for (let i = 1; i < captions.length; i++) assert.ok(captions[i].startMs >= captions[i - 1].endMs - 1);
	const w = speechWindow(alignment);
	assert.equal(w.first, 0);
	assert.ok(Math.abs(w.last - chars.length * 0.1) < 1e-9);
});

test('Nur die originale Adam-Stimme wird akzeptiert', () => {
	assert.ok(isOriginalAdam({name: 'Adam - Dominant, Firm', category: 'premade'}));
	assert.ok(isOriginalAdam({name: 'Adam', category: 'premade'}));
	assert.ok(!isOriginalAdam({name: 'Adam Stone - Deep', category: 'professional'}), 'Bibliotheks-Ersatz');
	assert.ok(!isOriginalAdam({name: 'Adamantis', category: 'premade'}));
	assert.ok(!isOriginalAdam({name: 'Brian', category: 'premade'}));
	assert.ok(modelSupportsGerman([{model_id: 'eleven_multilingual_v2', can_do_text_to_speech: true, languages: [{language_id: 'de'}]}], 'eleven_multilingual_v2').ok);
	assert.ok(!modelSupportsGerman([{model_id: 'eleven_monolingual_v1', languages: [{language_id: 'en'}]}], 'eleven_multilingual_v2').ok);
});

test('Cache-Schlüssel ändert sich nur bei Text/Stimme/Einstellungen', () => {
	const base = {voiceId: 'v', modelId: 'm', outputFormat: 'mp3_44100_128', voiceSettings: {stability: 0.45}, seed: 1, text: 'Hallo'};
	assert.equal(segmentCacheKey(base), segmentCacheKey({...base}));
	assert.notEqual(segmentCacheKey(base), segmentCacheKey({...base, text: 'Hallo!'}));
	assert.notEqual(segmentCacheKey(base), segmentCacheKey({...base, voiceSettings: {stability: 0.5}}));
	assert.notEqual(segmentCacheKey(base), segmentCacheKey({...base, voiceId: 'w'}));
});

test('API-Client: Key nie im Fehlertext, verständliche Meldungen, Wiederholung bei 429', async () => {
	assert.throws(() => createClient({apiKey: ''}), /ELEVENLABS_API_KEY ist nicht gesetzt/);
	let calls = 0;
	const seenKeys: string[] = [];
	const fakeFetch = async (_url: URL, init: {headers: Record<string, string>}) => {
		calls++;
		seenKeys.push(init.headers['xi-api-key']);
		if (calls === 1) return new Response(JSON.stringify({detail: {status: 'too_many_concurrent_requests', message: 'slow down'}}), {status: 429});
		return new Response(JSON.stringify({detail: {status: 'quota_exceeded', message: 'You have 0 credits left'}}), {status: 401});
	};
	const client = createClient({apiKey: 'sk_geheim_123', fetchImpl: fakeFetch as unknown as typeof fetch});
	await assert.rejects(client.getModels(), (e: Error) => {
		assert.match(e.message, /Credits aufgebraucht/);
		assert.ok(!e.message.includes('sk_geheim_123'), 'Key darf nicht im Fehlertext stehen');
		return true;
	});
	assert.equal(calls, 2, 'einmal wiederholt');
	assert.ok(seenKeys.every((k) => k === 'sk_geheim_123'), 'Key nur im Header');
});
