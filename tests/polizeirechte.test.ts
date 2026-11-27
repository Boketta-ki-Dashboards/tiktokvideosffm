/**
 * „Polizeikontrollen auf der Zeil – musst du dein Handy zeigen?“ (FrankfurtPoliceRights):
 * Plan ↔ Skript ↔ Adam-Stimme, Länge, Slang-Dosis und juristische/redaktionelle Leitplanken.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {type VoiceoverManifest} from '../src/lib/script-timing.ts';
import {buildTimeline} from '../src/lib/timeline.ts';
import {LAW, PHONE, TIPS} from '../src/videos/frankfurt-2026-11-polizeikontrollen/content.ts';
import {POLICE_RIGHTS_KEYWORDS, POLICE_RIGHTS_SCENES} from '../src/videos/frankfurt-2026-11-polizeikontrollen/plan.ts';

const dir = '../src/videos/frankfurt-2026-11-polizeikontrollen/';
const read = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8');
const script = JSON.parse(read(`${dir}script.json`));
const manifest: VoiceoverManifest = JSON.parse(read(`${dir}voiceover.json`));
const voice = JSON.parse(read('../config/voice.json'));
const sources = read('../references/frankfurt-2026-11-polizeikontrollen/sources.md');
const display = (t: string) => t.replace(/\{([^|}]*)\|[^}]*\}/g, '$1');
const seg = (id: string) => display(script.segments.find((s: {id: string}) => s.id === id).text);
const all = script.segments.map((s: {text: string}) => display(s.text)).join(' ');

test('jedes Segment gehört zu genau einer Szene, in Skript-Reihenfolge', () => {
	assert.deepEqual(
		POLICE_RIGHTS_SCENES.flatMap((s) => s.segmentIds),
		script.segments.map((s: {id: string}) => s.id),
	);
});

test('Schlüsselwörter der Szenen kommen im Text ihrer Segmente vor', () => {
	for (const scene of POLICE_RIGHTS_SCENES) {
		const text = scene.segmentIds.map((id) => seg(id)).join(' ');
		const words = text.split(/\s+/).map((w) => w.replace(/[.,:;!?–„“"]/g, '').toLowerCase());
		for (const k of POLICE_RIGHTS_KEYWORDS[scene.id] ?? []) {
			const kk = k.replace(/[.,:;!?–„“"]/g, '').toLowerCase();
			assert.ok(/^\d/.test(kk) ? words.includes(kk) : words.some((w) => w.startsWith(kk)), `${scene.id}: „${k}“ fehlt`);
		}
	}
});

test('Adam-Spur: ElevenLabs Adam, Untertitel aus Zeitstempeln, Sprechtempo 1.16 unverändert', () => {
	assert.equal(manifest.captionsSource, 'elevenlabs-alignment');
	assert.equal((manifest as unknown as {voice: {voiceId: string}}).voice.voiceId, voice.elevenlabs.voiceId);
	assert.equal(voice.elevenlabs.voiceSettings.speed, 1.16);
	assert.deepEqual(
		manifest.segments.map((s) => s.id),
		script.segments.map((s: {id: string}) => s.id),
	);
});

test('Länge ≈ 105–125 s, Schnitte folgen der Stimme', () => {
	const tl = buildTimeline({scenes: POLICE_RIGHTS_SCENES, manifest, fps: 30, tailMs: script.tailMs, maxDurationMs: script.maxDurationMs});
	const seconds = tl.durationInFrames / 30;
	assert.ok(seconds >= 105 && seconds <= 126, `Länge ${seconds.toFixed(1)} s`);
	for (const [i, scene] of tl.scenes.entries()) {
		const first = manifest.segments.find((s) => s.id === POLICE_RIGHTS_SCENES[i].segmentIds[0]);
		assert.ok(first && Math.round((first.startMs / 1000) * 30) >= scene.cutFrame, `${scene.id}: Satz beginnt vor dem Schnitt`);
	}
});

test('Slang dosiert: 2–4 Ausdrücke („Ewa“, „Bruder“, „Checkt mal“), kein künstlicher Dialekt', () => {
	const count = (re: RegExp) => (all.match(re) ?? []).length;
	const slang = count(/\bEwa\b/g) + count(/\bBruder\b/g) + count(/\bCheckt mal\b/g);
	assert.ok(slang >= 2 && slang <= 4, `Slang-Ausdrücke: ${slang}`);
	assert.doesNotMatch(all, /\b(Digga|Alter|wallah|yallah|isso|lan)\b/i);
	assert.match(seg('hook1'), /^Ewa, Frankfurt!$/);
});

test('Kern: freiwillige Bitte ≠ angeordnete Maßnahme – richtig und ohne Pauschalbehauptung', () => {
	assert.match(seg('law2'), /freiwillig.*grundsätzlich Nein sagen/);
	assert.match(seg('law3'), /Tatverdacht.*sichergestellt.*auch gegen deinen Willen/);
	assert.match(seg('law3'), /grundsätzlich vom Gericht, in Eilfällen auch von Staatsanwaltschaft oder Polizei/);
	assert.match(seg('law1'), /Personalien angeben.*nicht automatisch/);
	assert.match(LAW.review, /Staatsanwaltschaft.*Auftrag.*Okay/);
	// keine falschen Versprechen
	assert.doesNotMatch(all, /musst (die Polizei|der Polizei) nie|darfst .*verhindern|immer (ablehnen|verweigern)|nie(mals)? (zeigen|durchsuchen)/i);
	assert.doesNotMatch(all, /\bverboten\b|rechtswidrig|illegal/i);
});

test('PIN vs. Fingerabdruck exakt nach BGH 2 StR 232/24 (strenge Voraussetzungen, Beschuldigter)', () => {
	assert.match(seg('law4'), /PIN musst du als Beschuldigter nicht/);
	assert.match(seg('law4'), /Fingerabdruck.*strengen Voraussetzungen.*gegen deinen Willen.*Bundesgerichtshof/);
	assert.match(LAW.bgh, /13\.03\.2025 – 2 StR 232\/24/);
	assert.match(sources, /richterlich angeordnete Durchsuchung/);
});

test('Schilderung bleibt Schilderung: Konjunktiv, „freiwillig“ in Anführungszeichen, Polizei nicht bestätigt', () => {
	assert.match(seg('pho1'), /berichtet.*hätten/);
	assert.match(seg('pho1'), /„freiwillig“/);
	assert.match(seg('pho2'), /bestätigt hat die Polizei das bisher nicht/);
	assert.match(PHONE.notConfirmed, /nicht bestätigt \(Stand \d\d\.\d\d\.\d{4}\)/);
	// keine Übernahme von Wertungen/Vorwürfen aus dem Referenzvideo
	assert.doesNotMatch(all, /Schikane|kafkaesk|Racial Profiling|ohne (konkreten )?Anlass/i);
});

test('Zeugenaufruf ist freiwillig und wird klar von einer Pflicht getrennt', () => {
	assert.match(seg('pho3'), /bittet Zeugen.*freiwillig hochzuladen/);
	assert.match(seg('pho4'), /Zeugenaufruf heißt aber nicht/);
	assert.deepEqual(PHONE.equation, ['ZEUGENAUFRUF', 'PFLICHT ZUR HANDY-DURCHSICHT']);
});

test('Tipps deeskalieren: keine Gegenwehr, keine Beleidigung, nichts löschen; Satz 3 nur bei freiwilliger Bitte', () => {
	assert.match(seg('tip3'), /Keine Beleidigung, keine Gegenwehr, nichts löschen/);
	assert.match(seg('tip2'), /^Ist es freiwillig/);
	assert.match(TIPS.phrases[2], /Wenn es freiwillig ist/);
	assert.match(TIPS.phraseNotes[2], /Nur bei einer freiwilligen Bitte/);
});

test('Quellen dokumentiert: hessenschau, ARD, Polizei-Aufruf, Gesetze, BGH, Referenzvideo', () => {
	for (const s of ['hessenschau.de', 'ardmediathek.de', 'polizei.hessen.de', 'openlex.de/hessen/hsog/18', '§ 110', '§ 94', '§ 98', '§ 163b', '2 StR 232/24', '@deniz_avan_ffm', 'Bewusst NICHT verwendet']) {
		assert.ok(sources.includes(s), `sources.md: ${s} fehlt`);
	}
});
