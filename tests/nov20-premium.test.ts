/**
 * PREMIUM-Fassung von „20. November“ (FrankfurtNov20ForecastPremium): Nur die Bildebene darf neu sein.
 * Geprüft wird, dass Sprechertext, Adam-Ton, Musik, Timing, Szenenreihenfolge, Übergänge, Untertitel und Format
 * exakt am Original hängen – und dass die Premium-Szenen keinen eigenen Ton erzeugen.
 */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readdirSync, readFileSync} from 'node:fs';
import {test} from 'node:test';
import {type VoiceoverManifest} from '../src/lib/script-timing.ts';
import {buildTimeline} from '../src/lib/timeline.ts';
import {VIDEO} from '../src/theme/tokens.ts';
import {NOV20_SCENES} from '../src/videos/frankfurt-2026-11-20-ausblick/plan.ts';

const root = new URL('../', import.meta.url);
const read = (f: string) => readFileSync(new URL(f, root), 'utf8');
const dir = 'src/videos/frankfurt-2026-11-20-ausblick/';
const lock = JSON.parse(read(`${dir}premium/lock.json`));
const script = JSON.parse(read(`${dir}script.json`));
const manifest: VoiceoverManifest = JSON.parse(read(`${dir}voiceover.json`));
const original = read(`${dir}FrankfurtNov20Forecast.tsx`);
const premium = read(`${dir}FrankfurtNov20ForecastPremium.tsx`);
const premiumScenes = readdirSync(new URL(`${dir}premium/scenes/`, root)).map((f) => ({file: f, src: read(`${dir}premium/scenes/${f}`)}));
const originalScene = (id: string) => read(`${dir}scenes/${id}Scene.tsx`);

test('Sprechertext, Adam-Spur, Manifest, Musik und Stimmeinstellungen sind unverändert (SHA-256)', () => {
	for (const [file, hash] of Object.entries(lock.sha256 as Record<string, string>)) {
		const actual = createHash('sha256').update(readFileSync(new URL(file, root))).digest('hex');
		assert.equal(actual, hash, `${file} wurde verändert – Premium darf Ton/Text des Originals nicht anfassen`);
	}
});

test('gleiche Dauer und Szenenreihenfolge wie das Original (Timeline aus demselben Manifest)', () => {
	const tl = buildTimeline({scenes: NOV20_SCENES, manifest, fps: lock.fps, tailMs: script.tailMs, maxDurationMs: script.maxDurationMs});
	assert.equal(tl.durationInFrames, lock.durationInFrames);
	assert.deepEqual(
		tl.scenes.map((s) => s.id),
		['hook', 'halloween', 'police', 'shops', 'summary', 'twist', 'question', 'outro'],
	);
	assert.match(premium, /import \{NOV20_KEYWORDS, NOV20_SCENES\} from '\.\/plan'/);
	assert.match(premium, /import script from '\.\/script\.json'/);
});

test('Format: 1080 × 1920, 30 fps, beide Kompositionen mit denselben Metadaten registriert', () => {
	assert.equal(VIDEO.width, lock.width);
	assert.equal(VIDEO.height, lock.height);
	assert.equal(VIDEO.fps, lock.fps);
	const rootSrc = read('src/Root.tsx');
	const block = rootSrc.slice(rootSrc.indexOf('id="FrankfurtNov20ForecastPremium"'), rootSrc.indexOf('id="FrankfurtNov20ForecastPremium"') + 400);
	assert.match(block, /width=\{VIDEO\.width\}/);
	assert.match(block, /height=\{VIDEO\.height\}/);
	assert.match(block, /calculateMetadata=\{calculateNov20Metadata\}/);
	assert.match(block, /defaultProps=\{nov20DefaultProps\}/);
});

test('Ton kommt ausschließlich aus der unsichtbar gemounteten Original-Komposition', () => {
	assert.match(premium, /<AbsoluteFill style=\{\{display: 'none'\}\}>\s*<FrankfurtNov20Forecast \{\.\.\.props\} timeline=\{tl\} subtitles=\{false\}/);
	assert.doesNotMatch(premium, /<Voiceover|<MusicBed|<Sfx|<Audio|<Html5Audio/);
	for (const {file, src} of premiumScenes) {
		assert.doesNotMatch(src, /<Sfx|<Audio|<Html5Audio|<Voiceover|<MusicBed/, `${file} darf keinen eigenen Ton erzeugen`);
	}
});

test('gleiche Übergänge an denselben Schnitten, gleiche Untertitel-Komponente und -Position', () => {
	const transitions = (src: string) => src.slice(src.indexOf('const TRANSITIONS'), src.indexOf('};', src.indexOf('const TRANSITIONS')));
	assert.equal(transitions(premium), transitions(original));
	assert.match(premium, /<TikTokSubtitles captions=\{voiceover\.captions\} bottom=\{480\} \/>/);
	assert.match(original, /<TikTokSubtitles captions=\{voiceover\.captions\} bottom=\{480\} \/>/);
	assert.match(premium, /OutroScene/);
});

test('Premium-Szenen nutzen exakt dieselben Stimm-Cues wie die Original-Szenen (Bild sitzt auf den Original-SFX)', () => {
	const cuesOf = (src: string) =>
		[...src.matchAll(/(?:wordFrame|cue)\(cues, '([^']+)'/g)]
			.map((m) => m[1])
			.sort()
			.join(',');
	for (const id of ['Hook', 'Halloween', 'Police', 'Shops', 'Summary', 'Twist', 'Question']) {
		const prem = premiumScenes.find((s) => s.file === `${id}Premium.tsx`);
		assert.ok(prem, `${id}Premium.tsx fehlt`);
		const orig = new Set(cuesOf(originalScene(id)).split(','));
		for (const c of cuesOf(prem.src).split(',')) {
			// Twist nutzt zusätzlich „Frankfurt“ (Schlüsselwort aus plan.ts) nur für Diskussionsblasen
			if (id === 'Twist' && c === 'Frankfurt') continue;
			assert.ok(orig.has(c), `${id}: Cue „${c}“ gibt es im Original nicht`);
		}
		for (const c of orig) assert.ok(cuesOf(prem.src).split(',').includes(c), `${id}: Original-Cue „${c}“ fehlt in Premium`);
	}
});

test('Premium bleibt redaktionell sauber: keine Prozentwerte, kein „verboten“, Fiktion gekennzeichnet', () => {
	const all = premiumScenes.map((s) => s.src).join('\n');
	// sichtbare Texte: JSX-Textknoten und text=/label=-Props (CSS-Prozente sind keine Aussagen)
	const visible = [...all.matchAll(/>([^<>{}]*[A-Za-zÄÖÜäöüß0-9][^<>{}]*)</g), ...all.matchAll(/(?:text|label)="([^"]*)"/g)].map((m) => m[1]).join(' | ');
	assert.ok(visible.includes('Verbot?') || visible.includes('ENTSCHIEDEN?'), 'Textextraktion greift nicht');
	assert.doesNotMatch(visible, /\d\s?%|Prozent|Wahrscheinlichkeit/);
	assert.doesNotMatch(visible, /\bverboten\b|Verbot beschlossen/i);
	assert.match(all, /FIKTION · \{TWIST\.fictional\}/);
	assert.match(all, /POLICE\.banStatus/);
	assert.match(all, /HALLOWEEN\.disclaimer/);
	// Polizeistärke ohne Zahl
	assert.match(all, /„noch stärker“ – angekündigt, ohne Zahl/);
});

test('Workflow-Konfiguration: Premium nutzt denselben Video-Ordner und eigenen Exportnamen', () => {
	const videos = JSON.parse(read('config/videos.json'));
	assert.equal(videos.FrankfurtNov20ForecastPremium.videoId, videos.FrankfurtNov20Forecast.videoId);
	assert.equal(videos.FrankfurtNov20ForecastPremium.outputName, 'FrankfurtRed3_20November_Ausblick_ADAM_PREMIUM_FINAL');
	assert.equal(videos.FrankfurtNov20Forecast.outputName, 'FrankfurtRed3_20November_Ausblick_ADAM_FINAL');
});
