#!/usr/bin/env node
/**
 * Pausenprüfung der fertigen Sprecherspur (Kurzformat-Regel „keine Leerlauf-Pausen“):
 * misst alle Stillen (ffmpeg silencedetect, −40 dB) zwischen erstem und letztem Wort und bricht ab,
 * wenn eine Pause länger als `maxPauseMs` ist (script.json bzw. --max).
 *
 *   node scripts/voice/check-pauses.mjs --video <video-id> [--max 400] [--file <mp3>]
 */
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {parseArgs, readScript, ROOT} from '../lib/project.mjs';

const args = parseArgs(process.argv.slice(2));
const videoId = String(args.video ?? '');
const script = readScript(videoId);
const max = Number(args.max ?? script.maxPauseMs ?? 400);
const file = path.resolve(ROOT, String(args.file ?? `public/voiceover/${videoId}/voiceover-adam.mp3`));
const min = Math.max(0.15, (max / 1000) * 0.5);
const res = spawnSync('ffmpeg', ['-hide_banner', '-nostdin', '-i', file, '-af', `silencedetect=noise=-40dB:d=${min}`, '-f', 'null', '-'], {encoding: 'utf8'});
const log = res.stderr ?? '';
const starts = [...log.matchAll(/silence_start: ([\d.]+)/g)].map((m) => Number(m[1]));
const ends = [...log.matchAll(/silence_end: ([\d.]+) \| silence_duration: ([\d.]+)/g)].map((m) => ({end: Number(m[1]), dur: Number(m[2])}));
const total = Number((log.match(/time=(\d+):(\d+):([\d.]+)/g) ?? []).pop()?.replace('time=', '').split(':').reduce((a, v) => a * 60 + Number(v), 0) ?? 0);
const pauses = ends
	.map((e, i) => ({start: starts[i] ?? e.end - e.dur, end: e.end, ms: Math.round(e.dur * 1000)}))
	// Stille vor dem ersten bzw. nach dem letzten Wort ist kein Leerlauf
	.filter((p) => p.start > 0.05 && (total === 0 || p.end < total - 0.05));
const tooLong = pauses.filter((p) => p.ms > max);
console.log(`Pausenprüfung ${videoId}: ${pauses.length} Pausen ≥ ${Math.round(min * 1000)} ms, längste ${Math.max(0, ...pauses.map((p) => p.ms))} ms (Grenze ${max} ms)`);
for (const p of pauses) console.log(`${p.ms > max ? '✖' : '✔'} ${p.start.toFixed(2)}–${p.end.toFixed(2)} s · ${p.ms} ms`);
if (tooLong.length > 0) {
	console.error(`✖ ${tooLong.length} Pause(n) länger als ${max} ms – pauseAfterMs im Skript verringern bzw. Satzzeichen (Doppelpunkt) prüfen.`);
	process.exit(1);
}
console.log('✔ Keine Leerlauf-Pausen.');
