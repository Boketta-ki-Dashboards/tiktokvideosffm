/**
 * Lokale Schriften (SIL Open Font License) – kein Netzwerkzugriff beim Rendern nötig.
 * Montserrat = Überschriften/Untertitel, Inter = Fließtext/Quellen.
 * loadFont() hält das Rendering automatisch an, bis die Schrift geladen ist.
 */
import {loadFont} from '@remotion/fonts';
import inter500 from '@fontsource/inter/files/inter-latin-500-normal.woff2';
import inter600 from '@fontsource/inter/files/inter-latin-600-normal.woff2';
import inter700 from '@fontsource/inter/files/inter-latin-700-normal.woff2';
import inter800 from '@fontsource/inter/files/inter-latin-800-normal.woff2';
import montserrat700 from '@fontsource/montserrat/files/montserrat-latin-700-normal.woff2';
import montserrat800 from '@fontsource/montserrat/files/montserrat-latin-800-normal.woff2';
import montserrat900 from '@fontsource/montserrat/files/montserrat-latin-900-normal.woff2';

const fonts: Array<{family: string; url: string; weight: string}> = [
	{family: 'Inter', url: inter500, weight: '500'},
	{family: 'Inter', url: inter600, weight: '600'},
	{family: 'Inter', url: inter700, weight: '700'},
	{family: 'Inter', url: inter800, weight: '800'},
	{family: 'Montserrat', url: montserrat700, weight: '700'},
	{family: 'Montserrat', url: montserrat800, weight: '800'},
	{family: 'Montserrat', url: montserrat900, weight: '900'},
];

let loaded = false;

export const ensureFontsLoaded = () => {
	if (loaded) {
		return;
	}

	loaded = true;
	for (const font of fonts) {
		loadFont({...font, format: 'woff2'}).catch((err) => {
			console.error(`Schrift konnte nicht geladen werden: ${font.family} ${font.weight}`, err);
		});
	}
};
