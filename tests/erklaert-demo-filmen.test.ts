/**
 * „Frankfurt erklärt in 60 Sekunden“ #01 – Nur gefilmt – trotzdem Ärger? (FrankfurtErklaertDemoFilmen):
 * 60-s-Grenze, Plan ↔ Skript ↔ Adam-Stimme, Slang-Dosis, juristische Leitplanken, Quellen.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {enforceMaxFrames, erklaertTimelineFor} from '../src/formats/frankfurt-erklaert/timeline.ts';
import {FORMAT} from '../src/formats/frankfurt-erklaert/theme.ts';
import {type VoiceoverManifest} from '../src/lib/script-timing.ts';
import {DEMO, DISSOLVE, FILM, POLICE, SOURCES} from '../src/videos/frankfurt-erklaert-01-demo-filmen/content.ts';
import {DEMO_FILMEN_KEYWORDS, DEMO_FILMEN_SCENES} from '../src/videos/frankfurt-erklaert-01-demo-filmen/plan.ts';

const dir = '../src/videos/frankfurt-erklaert-01-demo-filmen/';
const read = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8');
const script = JSON.parse(read(`${dir}script.json`));
const manifest: VoiceoverManifest = JSON.parse(read(`${dir}voiceover.json`));
const voice = JSON.parse(read('../config/voice.json'));
const videos = JSON.parse(read('../config/videos.json'));
const sources = read('../references/frankfurt-erklaert-01-demo-filmen/sources.md');
const tiktok = read('../references/frankfurt-erklaert-01-demo-filmen/tiktok-text.md');
const display = (t: string) => t.replace(/\{([^|}]*)\|[^}]*\}/g, '$1');
const seg = (id: string) => display(script.segments.find((s: {id: string}) => s.id === id).text);
const all = script.segments.map((s: {text: string}) => display(s.text)).join(' ');
const tl = erklaertTimelineFor(DEMO_FILMEN_SCENES, script, manifest, 30);

test('60-Sekunden-Grenze: ≤ 1.800 Frames inkl. Intro und Outro, möglichst nah an 60 s', () => {
	assert.equal(FORMAT.maxFrames, 1800);
	assert.equal(videos.FrankfurtErklaertDemoFilmen.maxSeconds, 60);
	assert.ok(tl.durationInFrames <= 1800, `${tl.durationInFrames} Frames`);
	assert.ok(tl.durationInFrames >= 1680, `nur ${(tl.durationInFrames / 30).toFixed(1)} s – Format soll ≈ 56–60 s nutzen`);
	assert.ok(manifest.durationMs <= 60_000 - 300, `Stimme endet bei ${manifest.durationMs} ms`);
	const outro = tl.scenes.at(-1)!;
	assert.equal(outro.id, 'outro');
	assert.ok(tl.durationInFrames - outro.cutFrame <= FORMAT.outroMaxFrames, `Outro ${tl.durationInFrames - outro.cutFrame} Frames`);
});

test('Formatgrenze wird durchgesetzt: Nachlauf gekürzt, zu lange Stimme bricht mit Erklärung ab', () => {
	const long = {scenes: tl.scenes.map((s, i) => (i === tl.scenes.length - 1 ? {...s, durationInFrames: s.durationInFrames + 90} : s)), durationInFrames: tl.durationInFrames + 90};
	assert.equal(enforceMaxFrames(long, manifest, 30, 1800).durationInFrames, 1800);
	assert.throws(() => enforceMaxFrames(tl, {...manifest, durationMs: 60_400}, 30, 1800), /Sprechertext um mindestens/);
});

test('jedes Segment gehört zu genau einer Szene; Schnitte folgen der Stimme', () => {
	assert.deepEqual(
		DEMO_FILMEN_SCENES.flatMap((s) => s.segmentIds),
		script.segments.map((s: {id: string}) => s.id),
	);
	for (const [i, scene] of tl.scenes.entries()) {
		const first = manifest.segments.find((s) => s.id === DEMO_FILMEN_SCENES[i].segmentIds[0]);
		assert.ok(first && Math.round((first.startMs / 1000) * 30) >= scene.cutFrame, `${scene.id}: Satz beginnt vor dem Schnitt`);
	}
});

test('Schlüsselwörter der Szenen kommen im Text ihrer Segmente vor', () => {
	for (const scene of DEMO_FILMEN_SCENES) {
		const text = scene.segmentIds.map((id) => seg(id)).join(' ');
		const words = text.split(/\s+/).map((w) => w.replace(/[.,:;!?–„“"]/g, '').toLowerCase());
		for (const k of DEMO_FILMEN_KEYWORDS[scene.id] ?? []) {
			const kk = k.replace(/[.,:;!?–„“"]/g, '').toLowerCase();
			assert.ok(/^\d/.test(kk) ? words.includes(kk) : words.some((w) => w.startsWith(kk)), `${scene.id}: „${k}“ fehlt`);
		}
	}
});

test('Adam-Spur: ElevenLabs Adam, Untertitel aus Zeitstempeln, Einstellungen unverändert', () => {
	assert.equal(manifest.captionsSource, 'elevenlabs-alignment');
	assert.equal((manifest as unknown as {voice: {voiceId: string}}).voice.voiceId, voice.elevenlabs.voiceId);
	assert.deepEqual(voice.elevenlabs.voiceSettings, {stability: 0.45, similarity_boost: 0.8, style: 0.2, use_speaker_boost: true, speed: 1.16});
	assert.deepEqual(
		manifest.segments.map((s) => s.id),
		script.segments.map((s: {id: string}) => s.id),
	);
});

test('Slang: höchstens 1–2 Ausdrücke („Ewa, Frankfurt!“), kein künstlicher Dialekt', () => {
	assert.match(seg('hook1'), /^Ewa, Frankfurt!$/);
	const slang = (all.match(/\b(Ewa|Bruder|Checkt mal|Stress)\b/g) ?? []).length;
	assert.ok(slang >= 1 && slang <= 2, `Slang-Ausdrücke: ${slang}`);
	assert.doesNotMatch(all, /\b(Digga|Alter|wallah|yallah|isso|lan)\b/i);
});

test('Recht präzise, ohne Pauschalversprechen', () => {
	// Art. 8 GG / § 125 StGB: Dabeisein allein nicht automatisch strafbar – eigene Beteiligung entscheidet
	assert.match(seg('demo2'), /nicht automatisch strafbar/);
	assert.match(seg('demo2'), /Landfriedensbruch.*mitmachst, unterstützt oder anstachelst/);
	// Filmen: grundsätzlich erlaubt, nicht behindern; Veröffentlichen ≠ Aufnehmen
	assert.match(seg('film1'), /grundsätzlich erlaubt.*behinder niemanden/);
	assert.match(seg('film2'), /Hochladen.*Erkennbare Leute.*private Gespräche.*problematisch/);
	// Polizei: Kontrolle unter Voraussetzungen, auch Zeugen; Sicherstellung ≠ automatische Galerie-Durchsuchung
	assert.match(seg('pol1'), /unter gesetzlichen Voraussetzungen.*auch als Zeuge/);
	assert.match(seg('pol2'), /unter Umständen.*sichergestellt.*nicht automatisch.*Galerie/);
	// Auflösung: unverzüglich entfernen (§ 14 Abs. 7 HVersFG)
	assert.match(seg('end1'), /aufgelöst.*unverzüglich entfernen/);
	assert.match(DISSOLVE.law, /§ 14 Abs\. 7 HVersFG/);
	// keine Versprechen „passiert dir nichts“, keine Aufforderung zu Widerstand
	assert.doesNotMatch(all, /nichts passieren|passiert dir nichts|immer erlaubt|niemals strafbar|darfst .*verhindern|wehr dich|verweiger/i);
	assert.doesNotMatch(all, /Gericht hat entschieden|Urteil|VG Frankfurt|Verwaltungsgericht/i);
	// Bildtexte
	assert.deepEqual(DEMO.equation, ['DABEI SEIN', 'STRAFBAR SEIN']);
	assert.deepEqual(FILM.equation, ['FILMEN', 'ALLES POSTEN DÜRFEN']);
	assert.deepEqual(POLICE.banner, ['NICHT AUTOMATISCH', 'DIE GANZE GALERIE']);
	assert.match(FILM.publish.law, /§§ 22, 23 KUG/);
	assert.match(FILM.speech.law, /§ 201 StGB/);
});

test('Quellen dokumentiert; VG-Frankfurt-2025-Entscheidung nicht verifizierbar → bewusst nicht verwendet', () => {
	for (const s of ['art_8', '__125', '__201', 'kunsturhg/__22', 'kunsturhg/__23', 'stpo/__94', 'stpo/__110', 'stpo/__163b', 'HVersFG/14', '1 BvR 2501/13', '1 BvR 975/25', 'Bewusst NICHT verwendet', 'VG Frankfurt']) {
		assert.ok(sources.includes(s), `sources.md: ${s} fehlt`);
	}
	for (const s of SOURCES) assert.ok(sources.includes(s.url), `sources.md: ${s.url} fehlt`);
});

test('TikTok-Text: Titel + Caption knapp unter 4.000 Zeichen mit genau 5 Hashtags', () => {
	const caption = tiktok.split('## Caption')[1].split('```')[1].trim();
	assert.ok(caption.length >= 3500 && caption.length <= 4000, `Caption: ${caption.length} Zeichen`);
	assert.equal((caption.match(/#[\p{L}\d_]+/gu) ?? []).length, 5);
	for (const s of ['Art. 8 GG', '§ 125 StGB', '§ 94 StPO', '§ 110 StPO', '§ 14 HVersFG', '§§ 22, 23 KUG', 'keine Rechtsberatung']) assert.ok(caption.includes(s), `Caption: ${s} fehlt`);
});
