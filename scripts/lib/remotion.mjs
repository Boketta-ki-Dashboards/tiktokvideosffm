/** Gemeinsame Remotion-Helfer für Node-Skripte (Bundle einmal bauen, Browser finden). */
import {existsSync} from 'node:fs';
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {ROOT} from './project.mjs';

/** Vorinstallierte Chrome-Headless-Shell (Cloud-Container), sonst lädt Remotion selbst. */
export const findBrowserExecutable = () => {
	if (process.env.REMOTION_BROWSER_EXECUTABLE) {
		return process.env.REMOTION_BROWSER_EXECUTABLE;
	}

	const candidates = ['/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell'];
	return candidates.find((c) => existsSync(c)) ?? null;
};

export const makeBundle = async () => {
	const entryPoint = path.join(ROOT, 'src', 'index.ts');
	return bundle({entryPoint, publicDir: path.join(ROOT, 'public'), onProgress: () => undefined});
};
