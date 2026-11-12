/**
 * „Frankfurt erklärt in 60 Sekunden“ #02 – 76 Fragen nach der Krawallnacht (FrankfurtErklaert76Fragen):
 * Zahlen aus den Drucksachen, Fragen ≠ Antworten, keine vorweggenommenen Ergebnisse, 60-s-Grenze.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {erklaertTimelineFor} from '../src/formats/frankfurt-erklaert/timeline.ts';
import {type VoiceoverManifest} from '../src/lib/script-timing.ts';
import {DOCS, NOTE, QUESTIONS, SESSION, SOURCES} from '../src/videos/frankfurt-erklaert-76-fragen-landtag/content.ts';
import {FRAGEN76_KEYWORDS, FRAGEN76_SCENES} from '../src/videos/frankfurt-erklaert-76-fragen-landtag/plan.ts';

const dir = '../src/videos/frankfurt-erklaert-76-fragen-landtag/';
const read = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8');
const script = JSON.parse(read(`${dir}script.json`));
const manifest: VoiceoverManifest = JSON.parse(read(`${dir}voiceover.json`));
const voice = JSON.parse(read('../config/voice.json'));
const sources = read('../references/frankfurt-erklaert-76-fragen-landtag/sources.md');
const tiktok = read('../references/frankfurt-erklaert-76-fragen-landtag/tiktok-text.md');
const display = (t: string) => t.replace(/\{([^|}]*)\|[^}]*\}/g, '$1');
const seg = (id: string) => display(script.segments.find((s: {id: string}) => s.id === id).text);
const all = script.segments.map((s: {text: string}) => display(s.text)).join(' ');
const tl = erklaertTimelineFor(FRAGEN76_SCENES, script, manifest, 30);

test('76 = 21 (Grüne, Drs. 21/5450) + 55 (FDP, Drs. 21/5459 = 8+18+9+9+7+4)', () => {
	assert.equal(DOCS.gruene.drs, '21/5450');
	assert.equal(DOCS.fdp.drs, '21/5459');
	assert.equal(DOCS.gruene.questions, 21);
	assert.deepEqual(DOCS.fdp.sections.map((s) => s.count), [8, 18, 9, 9, 7, 4]);
	assert.equal(DOCS.fdp.sections.reduce((a, s) => a + s.count, 0), DOCS.fdp.questions);
	assert.equal(DOCS.gruene.questions + DOCS.fdp.questions, DOCS.total);
	assert.equal(DOCS.total, 76);
	assert.match(seg('hook2'), /76 Fragen/);
});

test('Sitzung: 10.11.2026, 20 Uhr (geplant), Wiesbaden, Raum 501 A, im Anschluss an die Plenarsitzung', () => {
	assert.equal(SESSION.date, '10.11.2026');
	assert.match(SESSION.time, /20:00 UHR – GEPLANT/);
	assert.match(SESSION.place, /Wiesbaden/);
	assert.match(SESSION.room, /501 A/);
	assert.match(SESSION.after, /Plenarsitzung/);
	assert.match(seg('sess'), /Wiesbaden.*angesetzt für 20 Uhr/);
});

test('Fragen ≠ Antworten: keine vorweggenommenen Ergebnisse, keine Schuldzuweisungen', () => {
	assert.match(seg('note'), /bisher Fragen, noch keine Antworten/);
	assert.match(NOTE.line, /kein Verbotsantrag/);
	assert.match(seg('q3'), /mögliche Absprachen/);
	assert.match(QUESTIONS[2].right.text, /nicht belegt/);
	assert.match(seg('q2'), /Schutzkonzept angekündigt/);
	const forbidden = /versagt|hat versagt|organisiert|verboten|Verbot beschlossen|beschlossen|Maßnahmen werden|entscheidet|Schuld/i;
	assert.doesNotMatch(all, forbidden);
	for (const q of QUESTIONS) assert.doesNotMatch(JSON.stringify(q), /versagt|organisiert|beschlossen|verboten/i);
});

test('Jedes Thema verweist auf Fragen der Drucksachen (I.8 nennt TikTok, V.6 Schutzkonzept)', () => {
	assert.match(QUESTIONS[0].refs, /21\/5459, Abschnitt I/);
	assert.match(QUESTIONS[1].refs, /V\.6/);
	assert.match(QUESTIONS[2].refs, /I\.8/);
	assert.match(QUESTIONS[3].refs, /21\/5450 Nr\. 20, 21/);
	for (const s of ['TikTok', 'Schutzkonzepts zu Schäden und Plünderungen', 'Gefahrenprognose', 'Schlüsse und Konsequenzen', 'Sitzungsraum 501 A']) {
		assert.ok(sources.includes(s), `sources.md: „${s}“ fehlt`);
	}
	for (const s of SOURCES) assert.ok(sources.includes(s.url), `sources.md: ${s.url} fehlt`);
});

test('60-Sekunden-Grenze, Schnitte an der Stimme, Schlüsselwörter vorhanden', () => {
	assert.ok(tl.durationInFrames <= 1800, `${tl.durationInFrames} Frames`);
	assert.ok(tl.durationInFrames >= 1650, `${tl.durationInFrames} Frames`);
	assert.deepEqual(
		FRAGEN76_SCENES.flatMap((s) => s.segmentIds),
		script.segments.map((s: {id: string}) => s.id),
	);
	for (const scene of FRAGEN76_SCENES) {
		const text = scene.segmentIds.map((id) => seg(id)).join(' ');
		const words = text.split(/\s+/).map((w) => w.replace(/[.,:;!?–„“"]/g, '').toLowerCase());
		for (const k of FRAGEN76_KEYWORDS[scene.id] ?? []) {
			const kk = k.replace(/[.,:;!?–„“"]/g, '').toLowerCase();
			assert.ok(/^\d/.test(kk) ? words.includes(kk) : words.some((w) => w.startsWith(kk)), `${scene.id}: „${k}“ fehlt`);
		}
	}
});

test('Adam unverändert, Untertitel aus Zeitstempeln, Slang ≤ 2', () => {
	assert.equal(manifest.captionsSource, 'elevenlabs-alignment');
	assert.equal((manifest as unknown as {voice: {voiceId: string}}).voice.voiceId, voice.elevenlabs.voiceId);
	assert.deepEqual(voice.elevenlabs.voiceSettings, {stability: 0.45, similarity_boost: 0.8, style: 0.2, use_speaker_boost: true, speed: 1.16});
	assert.ok((all.match(/\b(Ewa|Bruder|Checkt mal)\b/g) ?? []).length <= 2);
});

test('TikTok-Text: Titel, Caption ≤ 4.000 Zeichen, genau 5 Hashtags, Wiesbaden, Quelle Landtag', () => {
	assert.match(tiktok, /76 FRAGEN NACH HALLOWEEN – WAS PASSIERT HEUTE IM LANDTAG\? 🚨/);
	const caption = tiktok.split('## Caption')[1].split('```')[1].trim();
	assert.ok(caption.length <= 4000, `Caption ${caption.length} Zeichen`);
	assert.equal((caption.match(/#[\p{L}\d_]+/gu) ?? []).length, 5);
	for (const s of ['Wiesbaden', 'nicht in Frankfurt', '21/5450', '21/5459', 'hessischer-landtag.de', '?']) assert.ok(caption.includes(s), `Caption: ${s}`);
	assert.doesNotMatch(caption, /hat versagt|TikTok hat .* organisiert|wird verboten|beschlossen wurde/i);
});
