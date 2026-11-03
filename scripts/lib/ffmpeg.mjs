/** Dünne Wrapper um FFmpeg/FFprobe (System-Installation, z. B. `apt install ffmpeg`). */
import {spawnSync} from 'node:child_process';

const bin = (name) => process.env[`${name.toUpperCase()}_PATH`] ?? name;

export const run = (cmd, args, {quiet = true} = {}) => {
	const res = spawnSync(cmd, args, {encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe']});
	if (res.error) {
		throw new Error(`${cmd} konnte nicht gestartet werden: ${res.error.message}. Ist es installiert?`);
	}

	if (res.status !== 0) {
		throw new Error(`${cmd} ${args.join(' ')}\n→ Exit ${res.status}\n${res.stderr.slice(-4000)}`);
	}

	if (!quiet && res.stderr) {
		process.stderr.write(res.stderr);
	}

	return res;
};

export const ffmpeg = (args, opts) => run(bin('ffmpeg'), ['-hide_banner', '-nostdin', '-y', ...args], opts);

export const ffprobeJson = (file) => {
	const res = run(bin('ffprobe'), ['-v', 'error', '-print_format', 'json', '-show_format', '-show_streams', file]);
	return JSON.parse(res.stdout);
};

export const durationSeconds = (file) => Number(ffprobeJson(file).format.duration);

/** Erkennt Stillen (silencedetect) → [{start, end}] in Sekunden. */
export const detectSilences = (file, {noiseDb = -38, minSeconds = 0.18} = {}) => {
	const res = spawnSync(
		bin('ffmpeg'),
		['-hide_banner', '-nostdin', '-i', file, '-af', `silencedetect=noise=${noiseDb}dB:d=${minSeconds}`, '-f', 'null', '-'],
		{encoding: 'utf8', maxBuffer: 64 * 1024 * 1024},
	);
	const out = [];
	let start = null;
	for (const line of res.stderr.split('\n')) {
		const s = line.match(/silence_start: ([\d.]+)/);
		const e = line.match(/silence_end: ([\d.]+)/);
		if (s) {
			start = Number(s[1]);
		}

		if (e && start !== null) {
			out.push({start, end: Number(e[1])});
			start = null;
		}
	}

	return out;
};

/** Entfernt Stille am Anfang und Ende (für exakte Segmentgrenzen). */
export const trimSilenceFilter = (thresholdDb = -45) =>
	[
		`silenceremove=start_periods=1:start_threshold=${thresholdDb}dB:start_silence=0.03`,
		'areverse',
		`silenceremove=start_periods=1:start_threshold=${thresholdDb}dB:start_silence=0.05`,
		'areverse',
	].join(',');

/** Klangformung „TikTok-Sprecher“: Trittschall raus, Präsenz rauf, sanfte Kompression. */
export const VOICE_EQ_FILTER = [
	'highpass=f=75',
	'equalizer=f=220:t=q:w=1.2:g=-1.5',
	'equalizer=f=3200:t=q:w=1.0:g=2.5',
	'equalizer=f=9000:t=h:w=1:g=1.5',
	'acompressor=threshold=-20dB:ratio=3:attack=8:release=120:makeup=2',
	// Spitzen abfangen, damit −14 LUFS ohne Übersteuerung erreichbar sind
	'alimiter=limit=0.5:attack=3:release=60:level=false',
].join(',');

/** Einfache (einstufige) Variante – für Vorverarbeitung, wenn Präzision egal ist. */
export const VOICE_MASTER_FILTER = `${VOICE_EQ_FILTER},loudnorm=I=-14:TP=-1.5:LRA=7,aresample=48000`;

/**
 * Zweistufige Lautheitsnormalisierung (EBU R128) auf −14 LUFS / −1,5 dBTP –
 * Standard für TikTok/Instagram. Timing bleibt exakt erhalten.
 */
export const masterVoice = (input, output, {extraFilter = '', codecArgs = ['-c:a', 'libmp3lame', '-b:a', '192k']} = {}) => {
	const pre = [VOICE_EQ_FILTER, extraFilter].filter(Boolean).join(',');
	const res = spawnSync(
		bin('ffmpeg'),
		['-hide_banner', '-nostdin', '-i', input, '-af', `${pre},loudnorm=I=-14:TP=-1.5:LRA=7:print_format=json`, '-f', 'null', '-'],
		{encoding: 'utf8', maxBuffer: 64 * 1024 * 1024},
	);
	const json = res.stderr.slice(res.stderr.lastIndexOf('{'));
	const m = JSON.parse(json.slice(0, json.indexOf('}') + 1));
	const second = `loudnorm=I=-14:TP=-1.5:LRA=7:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`;
	ffmpeg(['-i', input, '-af', `${pre},${second},aresample=48000`, '-ac', '1', ...codecArgs, output]);
	return {measuredLufs: Number(m.input_i)};
};
