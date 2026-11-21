/**
 * Gemeinsamer Zusammenbau einer Sprecherspur aus Einzelsätzen (Piper, Chatterbox, …):
 * Vorlauf + Sätze + Pausen → Mastering (−14 LUFS) → MP3 + Manifest mit exakten Segment-Timings.
 */
import {mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {estimateCaptionsForSegments} from '../../src/lib/script-timing.ts';
import {durationSeconds, ffmpeg, masterVoice} from './ffmpeg.mjs';
import {ensureDir, ROOT, writeManifest} from './project.mjs';

/**
 * @param {object} o
 * @param {string} o.videoId
 * @param {object} o.script            Inhalt von script.json
 * @param {Array<{id: string, file: string}>} o.segments  getrimmte WAVs (gleiche Abtastrate, mono)
 * @param {number} o.sampleRate
 * @param {string} o.source            z. B. "chatterbox:thorsten-cc0-ref"
 * @param {string} [o.outFileName]     Dateiname unter public/voiceover/<video>/ (Standard voiceover.mp3)
 * @param {(timings: Array<{id: string, startMs: number, endMs: number}>) => Array} [o.buildCaptions]
 *        echte Wort-Untertitel (z. B. aus ElevenLabs-Zeitstempeln); Standard: Schätzung aus dem Skript
 * @param {string} [o.captionsSource]
 * @param {object} [o.masterOptions]   an masterVoice() weitergereicht
 * @param {object} [o.extra]           zusätzliche Manifest-Felder (z. B. Stimmdaten)
 */
export const assembleVoiceTrack = ({
	videoId,
	script,
	segments,
	sampleRate,
	source,
	outFileName = 'voiceover.mp3',
	buildCaptions,
	captionsSource = 'script-estimate',
	masterOptions,
	extra = {},
}) => {
	const tmp = mkdtempSync(path.join(os.tmpdir(), 'voice-build-'));
	try {
		const silence = (ms, name) => {
			const file = path.join(tmp, name);
			ffmpeg(['-f', 'lavfi', '-i', `anullsrc=r=${sampleRate}:cl=mono`, '-t', (ms / 1000).toFixed(3), '-c:a', 'pcm_s16le', file]);
			return file;
		};

		const parts = [];
		const timings = [];
		let cursorMs = script.leadInMs ?? 300;
		parts.push(silence(cursorMs, 'lead.wav'));
		script.segments.forEach((segment, i) => {
			const seg = segments.find((s) => s.id === segment.id);
			if (!seg) {
				throw new Error(`Audio für Segment "${segment.id}" fehlt.`);
			}

			const normalized = path.join(tmp, `${i}.wav`);
			ffmpeg(['-i', seg.file, '-ar', String(sampleRate), '-ac', '1', '-c:a', 'pcm_s16le', normalized]);
			const ms = Math.round(durationSeconds(normalized) * 1000);
			timings.push({id: segment.id, startMs: cursorMs, endMs: cursorMs + ms, ...(seg.meta ?? {})});
			parts.push(normalized);
			cursorMs += ms;
			const pause = i < script.segments.length - 1 ? (segment.pauseAfterMs ?? 200) : 0;
			if (pause > 0) {
				parts.push(silence(pause, `${i}-pause.wav`));
				cursorMs += pause;
			}
		});

		const list = path.join(tmp, 'list.txt');
		writeFileSync(list, parts.map((p) => `file '${p}'`).join('\n'));
		const joined = path.join(tmp, 'joined.wav');
		ffmpeg(['-f', 'concat', '-safe', '0', '-i', list, '-c:a', 'pcm_s16le', joined]);

		const outDir = ensureDir(path.join(ROOT, 'public', 'voiceover', videoId));
		const outFile = path.join(outDir, outFileName);
		const mastered = masterVoice(joined, outFile, masterOptions);

		const manifest = {
			version: 1,
			videoId,
			source,
			audioFile: `voiceover/${videoId}/${outFileName}`,
			durationMs: timings[timings.length - 1].endMs,
			segments: timings,
			captions: buildCaptions ? buildCaptions(timings) : estimateCaptionsForSegments(script, timings),
			captionsSource,
			generatedAt: new Date().toISOString(),
			...extra,
			measuredLufsBeforeMaster: mastered?.measuredLufs,
		};
		const manifestFile = writeManifest(videoId, manifest);
		return {outFile, manifestFile, manifest};
	} finally {
		rmSync(tmp, {recursive: true, force: true});
	}
};
