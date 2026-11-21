/** Gemeinsame Helfer für Projekt-Skripte (Pfade, Argumente, Skript/Manifest lesen & schreiben). */
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

export const videoDir = (videoId) => path.join(ROOT, 'src', 'videos', videoId);

/** Sehr kleiner Parser: --key value, --flag, positionale Argumente unter `_`. */
export const parseArgs = (argv) => {
	const out = {_: []};
	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		if (a.startsWith('--')) {
			const key = a.slice(2);
			const next = argv[i + 1];
			if (key.includes('=')) {
				const [k, v] = key.split('=');
				out[k] = v;
			} else if (next === undefined || next.startsWith('--')) {
				out[key] = true;
			} else {
				out[key] = next;
				i++;
			}
		} else {
			out._.push(a);
		}
	}

	return out;
};

export const readScript = (videoId) => {
	const file = path.join(videoDir(videoId), 'script.json');
	if (!existsSync(file)) {
		throw new Error(`Kein Sprecherskript gefunden: ${file}`);
	}

	return JSON.parse(readFileSync(file, 'utf8'));
};

export const manifestPath = (videoId) => path.join(videoDir(videoId), 'voiceover.json');

export const writeManifest = (videoId, manifest) => {
	const file = manifestPath(videoId);
	writeFileSync(file, `${JSON.stringify(manifest, null, '\t')}\n`);
	return file;
};

export const ensureDir = (dir) => {
	mkdirSync(dir, {recursive: true});
	return dir;
};
