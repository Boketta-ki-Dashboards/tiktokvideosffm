/**
 * „76 Fragen – Teil 2: erste Antworten“ (FrankfurtErklaert76FragenTeil2) + neue Kurzformat-Regeln:
 * Zahlen mit Urheber, keine vorweggenommenen/erfundenen Ergebnisse, Stimmprofil 1.20 nur per Opt-in,
 * „Ewa“ geschrieben / „Eywa“ gesprochen, keine Leerlauf-Pausen, Titelbild in der ersten Sekunde.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {applyAussprache, ausspracheFor, voiceSettingsFor} from '../scripts/lib/aussprache.mjs';
import {compressGaps, letterWindow} from '../scripts/lib/tight-trim.mjs';
import {erklaertTimelineFor} from '../src/formats/frankfurt-erklaert/timeline.ts';
import {type VoiceoverManifest} from '../src/lib/script-timing.ts';
import {CONTRO, COVER, NOV20, NUMBERS, POLICE, SOURCES, STATUS, TIKTOK} from '../src/videos/frankfurt-erklaert-76-fragen-teil2/content.ts';
import {TEIL2_KEYWORDS, TEIL2_SCENES} from '../src/videos/frankfurt-erklaert-76-fragen-teil2/plan.ts';

const dir = '../src/videos/frankfurt-erklaert-76-fragen-teil2/';
const read = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8');
const script = JSON.parse(read(`${dir}script.json`));
const manifest: VoiceoverManifest = JSON.parse(read(`${dir}voiceover.json`));
const voice = {...JSON.parse(read('../config/voice.json')), ...JSON.parse(read('../config/voice-regeln.json'))};
const sources = read('../references/frankfurt-erklaert-76-fragen-teil2/sources.md');
const tiktok = read('../references/frankfurt-erklaert-76-fragen-teil2/tiktok-text.md');
const display = (t: string) => t.replace(/\{([^|}]*)\|[^}]*\}/g, '$1');
const seg = (id: string) => display(script.segments.find((s: {id: string}) => s.id === id).text);
const all = script.segments.map((s: {text: string}) => display(s.text)).join(' ');
const tl = erklaertTimelineFor(TEIL2_SCENES, script, manifest, 30);

test('Zahlen laut Innenminister (hr/dpa): 181 / 13 / 73 / 1.300, Anteile 2/3 · >1/2 · 1/4', () => {
	assert.equal(NUMBERS.injured, 181);
	assert.equal(NUMBERS.unfit, 13);
	assert.equal(NUMBERS.suspects, 73);
	assert.equal(POLICE.forces, 1300);
	assert.match(seg('num1'), /laut Poseck: 181 verletzte Polizisten, 13 davon bislang nicht dienstfähig/);
	assert.match(seg('num2'), /73 Tatverdächtige – rund zwei Drittel unter 21, mehr als die Hälfte/);
	assert.match(seg('num3'), /etwa ein Viertel wohnt in Frankfurt/);
	assert.match(seg('pol1'), /Laut Poseck waren über den Abend verteilt rund 1\.300 Einsatzkräfte/);
	for (const s of ['181 verletzte Polizisten registriert, 13 seien bislang nicht dienstfähig', 'über den Abend verteilt etwa 1.300 Einsatzkräfte', 'Zahl der Tatverdächtigen aktuell auf 73', 'zwei Drittel der Tatverdächtigen seien jünger als 21', 'Mehr als die Hälfte', 'Nur etwa ein Viertel', 'sechs Polizisten im Zeitraum bis zur Auflösung', '„Maßnahmenbündel“', 'Unterbindungsgewahrsam']) {
		assert.ok(sources.includes(s), `sources.md: „${s}“ fehlt`);
	}
	for (const s of SOURCES) assert.ok(sources.includes(s.url), `sources.md: ${s.url}`);
});

test('Keine Überdehnung: nicht „alle 76 beantwortet“, kein Verbot, keine Schuld-/TikTok-Behauptung', () => {
	assert.match(seg('hook2'), /erste Antworten/);
	assert.match(seg('pol2'), /nicht geklärt/);
	assert.match(seg('tiktok'), /bisher nicht öffentlich belegt/);
	assert.match(seg('nov2'), /pauschales Demo-Verbot ist das nicht/);
	assert.match(seg('note'), /nicht verurteilt.*die meisten Demonstrierenden waren friedlich/);
	assert.match(seg('contro'), /umstrittene Aussage.*verteidigte der Minister/);
	assert.match(seg('end'), /bleiben offen/);
	assert.doesNotMatch(all, /alle (76 )?Fragen (sind |wurden )?beantwortet|versagt|organisiert|ist verboten|wird verboten|beschlossen wurde|alle Teilnehm/i);
	assert.equal(NOV20.noBan, 'KEIN PAUSCHALES DEMO-VERBOT');
	assert.match(NOV20.items[1].text, /nur unter gesetzlichen Voraussetzungen/);
	assert.match(TIKTOK.stamp.join(' '), /BISHER NICHT ÖFFENTLICH BELEGT/);
	assert.equal(CONTRO.label, 'POSITION DES MINISTERS');
	assert.deepEqual(CONTRO.equation, ['VERDACHT', 'VERURTEILUNG']);
	assert.deepEqual(
		STATUS.map((s) => s.status),
		['TEILWEISE', 'OFFEN', 'OFFEN', 'TEILWEISE'],
	);
});

test('Stimme: Kurzformat-Profil speed 1.20 nur per Opt-in, Rest unverändert; ältere Videos bleiben 1.16', () => {
	assert.equal(script.voice.profile, 'kurzformat-60');
	assert.deepEqual(voice.profiles['kurzformat-60'].voiceSettings, {speed: 1.2});
	assert.deepEqual(voice.elevenlabs.voiceSettings, {stability: 0.45, similarity_boost: 0.8, style: 0.2, use_speaker_boost: true, speed: 1.16});
	assert.deepEqual(voiceSettingsFor(voice, script), {stability: 0.45, similarity_boost: 0.8, style: 0.2, use_speaker_boost: true, speed: 1.2});
	for (const id of ['frankfurt-erklaert-76-fragen-landtag', 'frankfurt-erklaert-01-demo-filmen', 'frankfurt-2026-11-polizeikontrollen']) {
		const old = JSON.parse(read(`../src/videos/${id}/script.json`));
		assert.equal(voiceSettingsFor(voice, old).speed, 1.16, id);
	}
	assert.equal((manifest as unknown as {voice: {voiceId: string}}).voice.voiceId, voice.elevenlabs.voiceId);
	assert.equal(manifest.captionsSource, 'elevenlabs-alignment');
});

test('„Ewa“ wird geschrieben, „Eywa“ gesprochen – nie „Eywa“ in Untertiteln; fertige Videos ausgenommen', () => {
	assert.deepEqual(voice.aussprache.regeln, {Ewa: 'Eywa'});
	assert.equal(applyAussprache('Ewa, Frankfurt!', voice.aussprache.regeln), '{Ewa|Eywa}, Frankfurt!');
	assert.equal(applyAussprache('{Ewa|Eva} Ewald', voice.aussprache.regeln), '{Ewa|Eva} Ewald');
	assert.deepEqual(ausspracheFor(voice, 'frankfurt-erklaert-76-fragen-landtag'), {});
	assert.deepEqual(ausspracheFor(voice, 'frankfurt-erklaert-76-fragen-teil2'), {Ewa: 'Eywa'});
	assert.equal(manifest.captions[0].text.trim(), 'Ewa,');
	assert.ok(!manifest.captions.some((c) => /eywa/i.test(c.text)), 'Eywa in Untertiteln');
	assert.match(seg('hook1'), /^Ewa, Frankfurt!$/);
});

test('Timing: Lücken zwischen Sätzen ≤ 400 ms, Länge 55–60 s, Szenen schließen direkt an', () => {
	assert.equal(script.maxPauseMs, 400);
	assert.equal(script.voice.trim.mode, 'letters');
	for (let i = 1; i < manifest.segments.length; i++) {
		const gap = manifest.segments[i].startMs - manifest.segments[i - 1].endMs;
		assert.ok(gap <= 400, `${manifest.segments[i].id}: ${gap} ms Lücke`);
	}
	for (const s of script.segments) assert.ok(s.pauseAfterMs <= 150, `${s.id}: pauseAfterMs ${s.pauseAfterMs}`);
	assert.ok(tl.durationInFrames <= 1800 && tl.durationInFrames >= 1650, `${tl.durationInFrames} Frames`);
	for (const [i, scene] of tl.scenes.entries()) {
		const first = manifest.segments.find((s) => s.id === TEIL2_SCENES[i].segmentIds[0]);
		assert.ok(first && Math.round((first.startMs / 1000) * 30) >= scene.cutFrame, scene.id);
		if (i > 0) assert.ok((TEIL2_SCENES[i].transitionInFrames ?? 0) <= 10, `${scene.id}: Übergang zu lang`);
	}
	const outro = tl.scenes.at(-1)!;
	assert.ok(tl.durationInFrames - outro.cutFrame <= 120, 'Schluss ≤ 4 s');
});

test('Titelbild ist die erste Szene (Frame 0, vollständiger Titel) und dieselbe Komponente wie das PNG', () => {
	assert.equal(TEIL2_SCENES[0].id, 'cover');
	assert.deepEqual(COVER.title, ['76 FRAGEN –', 'ERSTE ANTWORTEN']);
	const cover = read(`${dir}FrankfurtErklaert76FragenTeil2Cover.tsx`);
	assert.match(cover, /<Teil2Cover morph=\{0\} thumbnail \/>/);
	const comp = read(`${dir}FrankfurtErklaert76FragenTeil2.tsx`);
	assert.match(comp, /badgeFrom: 48/);
	for (const scene of TEIL2_SCENES) {
		const text = scene.segmentIds.map((id) => seg(id)).join(' ');
		const words = text.split(/\s+/).map((w) => w.replace(/[.,:;!?–„“"]/g, '').toLowerCase());
		for (const k of TEIL2_KEYWORDS[scene.id] ?? []) {
			const kk = k.replace(/[.,:;!?–„“"]/g, '').toLowerCase();
			assert.ok(/^\d/.test(kk) ? words.includes(kk) : words.some((w) => w.startsWith(kk)), `${scene.id}: „${k}“`);
		}
	}
});

test('Kurzformat-Schnitt: Buchstaben-Fenster + Pausenkürzung im Satz verschiebt Zeiten korrekt', () => {
	const al = {characters: ['A', 'b', '?', ' ', 'C', '!'], character_start_times_seconds: [0.1, 0.2, 0.3, 0.9, 1.5, 1.6], character_end_times_seconds: [0.2, 0.3, 0.9, 1.5, 1.6, 2.4]};
	assert.deepEqual(letterWindow(al), {first: 0.1, last: 1.6});
	const c = compressGaps(al, 0, 1.8, 0.3);
	assert.ok(Math.abs(c.removedSec - 0.9) < 1e-9);
	assert.ok(Math.abs(c.alignment.character_start_times_seconds[4] - 0.6) < 1e-9);
	assert.equal(c.ranges.length, 2);
});

test('TikTok-Text: Titel ohne „alle beantwortet“, Caption ≤ 4.000 Zeichen, genau 5 Hashtags, Quellen', () => {
	assert.match(tiktok, /76 FRAGEN – DAS KAM GESTERN IM LANDTAG RAUS! 🚨/);
	const caption = tiktok.split('## Caption')[1].split('```')[1].trim();
	assert.ok(caption.length >= 3500 && caption.length <= 4000, `Caption ${caption.length} Zeichen`);
	assert.equal((caption.match(/#[\p{L}\d_]+/gu) ?? []).length, 5);
	for (const s of ['181', '73', '1.300', '20. November', 'Unterbindungsgewahrsam', 'nicht verurteilt', 'hessenschau', 'Landtag', 'offen']) assert.ok(caption.includes(s), `Caption: ${s}`);
	assert.doesNotMatch(caption, /alle 76 Fragen (sind |wurden )?beantwortet/i);
});
