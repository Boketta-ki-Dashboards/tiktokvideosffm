/**
 * „Wie Frankfurt weltweit Schlagzeilen machte“ (FrankfurtWorldwide): Daten ↔ Skript ↔ Szenenplan ↔ SFX.
 * Schützt vor erfundenen Zählungen, fehlenden Belegen und Schnitten, die nicht an der Stimme hängen.
 */
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {test} from 'node:test';
import {resolveSfx, SFX_LIBRARY, type SfxName} from '../src/lib/sfx.ts';
import {type VoiceoverManifest} from '../src/lib/script-timing.ts';
import {buildTimeline} from '../src/lib/timeline.ts';
import {COUNTRY_NUMERIC} from '../src/videos/frankfurt-2026-10-31-international/geo.ts';
import {SCENE_KEYWORDS, WORLDWIDE_SCENES} from '../src/videos/frankfurt-2026-10-31-international/plan.ts';

const dir = '../src/videos/frankfurt-2026-10-31-international/';
const read = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8');
const script = JSON.parse(read(`${dir}script.json`));
const manifest: VoiceoverManifest = JSON.parse(read(`${dir}voiceover.json`));
const data = JSON.parse(read(`${dir}data/medien.json`));
type M = {id: string; outlet: string; marke?: string; country: string; zaehlt: boolean; landZaehlt?: boolean; beleg: string; headline: string; url: string; art: string; agentur?: string; sprache: string; de?: string};
const media: M[] = data.medien;
const display = (t: string) => t.replace(/\{([^|}]*)\|[^}]*\}/g, '$1');

const counted = media.filter((m) => m.zaehlt && m.beleg === 'abruf' && m.country !== 'DE');
const brands = new Set(counted.map((m) => m.marke ?? m.outlet));
const countries = new Set(counted.filter((m) => m.landZaehlt !== false).map((m) => m.country));

test('jedes Medium ist belegt: Wortlaut, https-Link, Art der Meldung, Übersetzung bei Fremdsprache', () => {
	const ids = new Set<string>();
	for (const m of media) {
		assert.ok(!ids.has(m.id), `doppelte id ${m.id}`);
		ids.add(m.id);
		assert.ok(m.headline.length > 10, `${m.id}: Schlagzeile fehlt`);
		assert.match(m.url, /^https:\/\//, `${m.id}: Link`);
		assert.ok(['eigen', 'agentur', 'portal'].includes(m.art), `${m.id}: art`);
		if (m.art === 'agentur') assert.ok(m.agentur, `${m.id}: Agentur fehlt`);
		if (m.zaehlt && m.sprache !== 'de') assert.ok(m.de, `${m.id}: DE-Übersetzung fehlt`);
	}
});

test('gesprochene Zählung entspricht den Daten (Mindestanzahl, keine Übertreibung)', () => {
	const w4 = script.segments.find((s: {id: string}) => s.id === 'w4').text as string;
	const nums = [...w4.matchAll(/\{(\d+)\|/g)].map((x) => Number(x[1]));
	assert.deepEqual(nums, [brands.size, countries.size], `Skript nennt ${nums.join('/')}, Daten ergeben ${brands.size} Medien / ${countries.size} Länder`);
	assert.match(w4, /mindestens/);
	assert.match(w4, /Stichprobe/);
});

test('alle gezählten Länder sind auf der Weltkarte hervorhebbar', () => {
	for (const c of countries) assert.ok(COUNTRY_NUMERIC[c], `Länder-ID für ${c} fehlt in geo.ts`);
});

test('im Ton genannte Länder sind durch gezählte Berichte belegt', () => {
	const w2 = display(script.segments.find((s: {id: string}) => s.id === 'w2').text);
	const named: Record<string, string> = {Südkorea: 'KR', 'Saudi-Arabien': 'SA', Australien: 'AU', Österreich: 'AT', Polen: 'PL', USA: 'US'};
	for (const [name, code] of Object.entries(named)) {
		if (w2.includes(name)) assert.ok(countries.has(code), `${name} genannt, aber kein gezählter Bericht`);
	}
});

test('Meme-Teil: Fokus auf das „3 linke Schuhe“-Meme, keine Verkaufs-/Kleinanzeigen-Behauptungen', () => {
	const text = script.segments.map((s: {text: string}) => display(s.text)).join(' ');
	assert.match(text, /drei linken Schuhen/);
	assert.doesNotMatch(text, /Kleinanzeige|eBay|verkauft|Verkaufsanzeige/i);
	assert.match(text, /nicht alles, was viral geht, ist echt/);
});

test('@ichbinyounes nur als Selbstdarstellung – keine Festnahme-, Täter- oder Vorwurfsbegriffe', () => {
	const seg = script.segments.find((s: {text: string}) => s.text.includes('@ichbinyounes'));
	assert.ok(seg, 'Account-Bezug fehlt');
	assert.match(seg.text, /zeigt sich/);
	assert.doesNotMatch(seg.text, /festgenommen|verhaftet|abgeführt|Landfriedensbruch|Täter|Plünder|Randal/i);
	const content = read(`${dir}content.ts`);
	assert.match(content, /nicht unabhängig bestätigt/);
});

test('kein „Folge 1“ im neuen Video', () => {
	const all = read(`${dir}script.json`) + read(`${dir}content.ts`);
	assert.doesNotMatch(all, /Folge\s*1/i);
});

test('jedes Sprechersegment gehört zu genau einer Szene, in Skript-Reihenfolge', () => {
	assert.deepEqual(
		WORLDWIDE_SCENES.flatMap((s) => s.segmentIds),
		script.segments.map((s: {id: string}) => s.id),
	);
});

test('Schlüsselwörter der Szenen kommen im Text ihrer Segmente vor (sonst fehlen SFX-/Animations-Cues)', () => {
	for (const scene of WORLDWIDE_SCENES) {
		const text = scene.segmentIds.map((id) => display(script.segments.find((s: {id: string}) => s.id === id).text)).join(' ');
		const words = text.split(/\s+/).map((w) => w.replace(/[.,:;!?–„“"]/g, '').toLowerCase());
		for (const k of SCENE_KEYWORDS[scene.id] ?? []) {
			const kk = k.replace(/[.,:;!?–„“"]/g, '').toLowerCase();
			const hit = /^\d/.test(kk) ? words.includes(kk) : words.some((w) => w.startsWith(kk));
			assert.ok(hit, `${scene.id}: Schlüsselwort „${k}“ fehlt im Text`);
		}
	}
});

test('Schnitte folgen der Stimme und die Länge bleibt im Ziel (≤ 110 s)', () => {
	const fps = 30;
	const tl = buildTimeline({scenes: WORLDWIDE_SCENES, manifest, fps, tailMs: script.tailMs, maxDurationMs: script.maxDurationMs});
	WORLDWIDE_SCENES.forEach((spec, i) => {
		const first = manifest.segments.find((s) => s.id === spec.segmentIds[0])!;
		const cutMs = (tl.scenes[i].cutFrame / fps) * 1000;
		if (i > 0) assert.ok(Math.abs(cutMs - first.startMs) <= 300, `${spec.id}: Schnitt ${cutMs} ms vs. Satzbeginn ${first.startMs} ms`);
	});
	assert.ok(tl.durationInFrames / fps <= 110, `zu lang: ${(tl.durationInFrames / fps).toFixed(1)} s`);
});

test('Sprecherspur: Adam, wenn vorhanden – sonst ehrlich als stumm markiert', () => {
	if (manifest.audioFile) {
		assert.ok(existsSync(new URL(`../public/${manifest.audioFile}`, import.meta.url)));
		assert.equal(manifest.captionsSource, 'elevenlabs-alignment');
	} else {
		assert.equal(manifest.source, 'none');
	}
});

test('SFX-Bibliothek: jede Datei existiert, Lautstärken dezent (≤ 0,4)', () => {
	for (const name of Object.keys(SFX_LIBRARY) as SfxName[]) {
		const {src, volume} = resolveSfx(name);
		assert.ok(existsSync(new URL(`../public/${src}`, import.meta.url)), `${name}: ${src} fehlt`);
		assert.ok(volume > 0 && volume <= 0.4, `${name}: Lautstärke ${volume}`);
	}
});
