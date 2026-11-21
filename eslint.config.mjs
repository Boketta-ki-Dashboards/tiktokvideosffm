import {config} from '@remotion/eslint-config-flat';
import globals from 'globals';

export default [
	...config,
	{
		// Node-Skripte (Rendering, Stimme, Prüfung)
		files: ['scripts/**/*.{js,mjs}', 'remotion.config.ts'],
		languageOptions: {
			globals: globals.node,
		},
	},
	{
		ignores: ['node_modules/**', 'output/**', '.claude/**', '.cache/**', 'src/lib/sfx-premium.ts'],
	},
];
