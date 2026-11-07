#!/usr/bin/env node
/**
 * Lokaler Nachbau der ElevenLabs-API für Tests OHNE Credits/Key:
 *   node scripts/voice/elevenlabs-mock-server.mjs 8765 &
 *   ELEVENLABS_API_BASE=http://127.0.0.1:8765 ELEVENLABS_API_KEY=test node scripts/voice/elevenlabs-tts.mjs --video <id>
 * Liefert für jede TTS-Anfrage einen Sinuston passender Länge + gleichmäßige Zeichen-Zeitstempel.
 */
import {createServer} from 'node:http';
import {mkdtempSync, readFileSync, rmSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {ffmpeg} from '../lib/ffmpeg.mjs';

const port = Number(process.argv[2] ?? 8765);
const ADAM = {voice_id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam - Dominant, Firm', category: 'premade', labels: {accent: 'american', gender: 'male'}};
const send = (res, status, body) => {
	res.writeHead(status, {'Content-Type': 'application/json', 'request-id': `mock-${Date.now()}`});
	res.end(JSON.stringify(body));
};

createServer((req, res) => {
	if (req.headers['xi-api-key'] !== 'test') return send(res, 401, {detail: {status: 'invalid_api_key', message: 'Invalid API key'}});
	const url = new URL(req.url, 'http://x');
	if (req.method === 'GET' && url.pathname === `/v1/voices/${ADAM.voice_id}`) return send(res, 200, ADAM);
	if (req.method === 'GET' && url.pathname === '/v2/voices') return send(res, 200, {voices: [ADAM], has_more: false});
	if (req.method === 'GET' && url.pathname === '/v1/models') return send(res, 200, [{model_id: 'eleven_multilingual_v2', can_do_text_to_speech: true, languages: [{language_id: 'en'}, {language_id: 'de'}]}]);
	if (req.method === 'GET' && url.pathname === '/v1/user/subscription') return send(res, 200, {tier: 'starter', character_count: 1000, character_limit: 30000});
	if (req.method === 'POST' && url.pathname.endsWith('/with-timestamps')) {
		let raw = '';
		req.on('data', (c) => (raw += c));
		req.on('end', () => {
			const body = JSON.parse(raw);
			const chars = [...body.text];
			const lead = 0.25;
			const per = 0.055;
			const dur = lead + chars.length * per + 0.3;
			const tmp = mkdtempSync(path.join(os.tmpdir(), 'mock-el-'));
			const file = path.join(tmp, 'a.mp3');
			ffmpeg(['-f', 'lavfi', '-i', `sine=f=220:d=${dur.toFixed(3)}:r=44100`, '-af', `volume=0.3,afade=t=in:st=0:d=${lead}`, '-c:a', 'libmp3lame', '-b:a', '128k', file]);
			const audio = readFileSync(file).toString('base64');
			rmSync(tmp, {recursive: true, force: true});
			const starts = chars.map((_, i) => +(lead + i * per).toFixed(3));
			const alignment = {characters: chars, character_start_times_seconds: starts, character_end_times_seconds: starts.map((s) => +(s + per).toFixed(3))};
			send(res, 200, {audio_base64: audio, alignment, normalized_alignment: alignment});
		});
		return undefined;
	}

	if (req.method === 'POST' && url.pathname === '/v1/sound-generation') {
		// MOCK_SFX_DENY=1 simuliert einen Key ohne Sound-Effects-Berechtigung
		if (process.env.MOCK_SFX_DENY === '1') {
			return send(res, 401, {detail: {status: 'missing_permissions', message: 'The API key you used is missing the permission sound_generation to execute this operation.'}});
		}

		let raw = '';
		req.on('data', (c) => (raw += c));
		req.on('end', () => {
			const body = JSON.parse(raw);
			const tmp = mkdtempSync(path.join(os.tmpdir(), 'mock-sfx-'));
			const file = path.join(tmp, 's.mp3');
			ffmpeg(['-f', 'lavfi', '-i', `anoisesrc=d=${body.duration_seconds ?? 1}:c=pink:a=0.5:r=44100`, '-af', 'afade=t=out:st=0:d=1', '-c:a', 'libmp3lame', '-b:a', '128k', file]);
			const audio = readFileSync(file);
			rmSync(tmp, {recursive: true, force: true});
			res.writeHead(200, {'Content-Type': 'audio/mpeg', 'request-id': `mock-sfx-${Date.now()}`});
			res.end(audio);
		});
		return undefined;
	}

	return send(res, 404, {detail: {status: 'not_found', message: url.pathname}});
}).listen(port, '127.0.0.1', () => console.log(`Mock-ElevenLabs auf http://127.0.0.1:${port}`));
