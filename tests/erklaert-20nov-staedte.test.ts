/**
 * „Gen-Z-Proteste: Was ist in Hamburg, Leipzig und den anderen Städten passiert?“ (FrankfurtErklaert20NovemberStaedte, #15, Nachbetrachtung
 * des 20.11.2026, Stand 21.11.2026): Demo und spätere Ausschreitungen getrennt, nie „alle Demonstrierenden“, keine zentrale Steuerung behauptet,
 * jede Zahl mit Urheber und aus der jüngsten Meldung (Hamburg-Korrektur, Leipzig-Ergänzung), Städte nicht addiert, Quellenzeile unter den
 * Untertiteln, hartes Limit 60 s, Kopfzeile oben rechts, Titelbild nach COVER_ZONE.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {applyAussprache, ausspracheFor, voiceSettingsFor} from '../scripts/lib/aussprache.mjs';
import {resolveSourceLine} from '../src/formats/frankfurt-erklaert/source-line.ts';
import {COVER_ZONE, FORMAT, LAYOUT} from '../src/formats/frankfurt-erklaert/theme.ts';
import {erklaertTimelineFor} from '../src/formats/frankfurt-erklaert/timeline.ts';
import {type VoiceoverManifest} from '../src/lib/script-timing.ts';
import {BERLIN, BREMEN, CITIES, COVER, FRANKFURT, HAMBURG, LEIPZIG, PRINCIPLE, SOURCE_LINE, STAND, STUTTGART} from '../src/videos/frankfurt-erklaert-20nov-staedte/content.ts';
import {STAEDTE_COVER_LAYOUT as L} from '../src/videos/frankfurt-erklaert-20nov-staedte/cover-layout.ts';
import {STAEDTE_KEYWORDS, STAEDTE_SCENES} from '../src/videos/frankfurt-erklaert-20nov-staedte/plan.ts';

const dir = '../src/videos/frankfurt-erklaert-20nov-staedte/';
const ref = '../references/frankfurt-erklaert-20nov-staedte/';
const read = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8');
const script = JSON.parse(read(`${dir}script.json`));
const manifest: VoiceoverManifest = JSON.parse(read(`${dir}voiceover.json`));
const videos = JSON.parse(read('../config/videos.json'));
const voice = {...JSON.parse(read('../config/voice.json')), ...JSON.parse(read('../config/voice-regeln.json'))};
const sources = read(`${ref}sources.md`);
const tiktok = read(`${ref}tiktok-text.md`);
const scenesSrc = read(`${dir}scenes/Scenes.tsx`);
const compSrc = read(`${dir}FrankfurtErklaert20NovemberStaedte.tsx`);
const display = (t: string) => t.replace(/\{([^|}]*)\|[^}]*\}/g, '$1');
const spoken = (t: string) => t.replace(/\{[^|}]*\|([^}]*)\}/g, '$1');
const seg = (id: string) => display(script.segments.find((s: {id: string}) => s.id === id).text);
const all = script.segments.map((s: {text: string}) => display(s.text)).join(' ');
const isAdam = String(manifest.source).startsWith('elevenlabs');
const cfg = videos.FrankfurtErklaert20NovemberStaedte;

test('Dramaturgie: Titelbild → Hamburg → Leipzig → Berlin · Stuttgart · Bremen → Frankfurt + Einordnung → Frage + Abo', () => {
	assert.deepEqual(STAEDTE_SCENES.map((s) => s.id), ['cover', 'hamburg', 'leipzig', 'mehr', 'vergleich', 'outro']);
	assert.deepEqual(STAEDTE_SCENES.flatMap((s) => s.segmentIds), script.segments.map((s: {id: string}) => s.id));
	for (const s of STAEDTE_SCENES) assert.ok(STAEDTE_KEYWORDS[s.id]?.length, `Schlüsselwörter für ${s.id}`);
	for (const s of STAEDTE_SCENES.slice(1)) assert.ok((s.transitionInFrames ?? 0) <= 10);
	// Reihenfolge der Städte wie im Auftrag
	const body = script.segments.slice(2).map((s: {text: string}) => display(s.text)).join(' ');
	const order = ['Hamburg', 'Leipzig', 'Berlin', 'Stuttgart', 'Bremen', 'Frankfurt'].map((c) => body.indexOf(`${c}`));
	assert.ok(order.every((i) => i >= 0), 'alle sechs Städte im Ton');
	assert.deepEqual([...order].sort((a, b) => a - b), order, 'Städte in der Reihenfolge der Prioritäten');
});

test('Demo und Ausschreitungen getrennt – nie „alle“, keine zentrale Steuerung, keine Verknüpfung/Summe', () => {
	assert.match(seg('h1'), /weitgehend friedlich\.$/);
	assert.match(seg('h2'), /^Nach dem Ende/);
	assert.match(seg('l1'), /nach dem Ende kam es zu massiven Ausschreitungen\.$/);
	assert.equal(seg('z1'), 'Wichtig: Nicht alle, die demonstriert haben, waren an Ausschreitungen beteiligt.');
	assert.equal(PRINCIPLE.title, 'DEMO ≠ AUSSCHREITUNG');
	assert.match(scenesSrc, /ENDE DER DEMO/);
	assert.doesNotMatch(all, /alle Demonstrierenden|die Demonstranten randalierten|Gen Z regelt (ordnete|steuerte|organisierte die Krawalle)|angeordnet|gesteuert/i);
	assert.doesNotMatch(all + tiktok, /insgesamt \d+[.\d]* (Demonstrierende|Menschen) in (allen|den) Städten|zusammen \d/i);
	assert.match(tiktok, /nicht zusammengezählt/);
});

test('Jüngster Meldestand: Hamburg-Korrektur (Pyrotechnik statt Flaschen), Leipzig-Ergänzung 21.11., keine Oktober-Zahlen', () => {
	assert.doesNotMatch(all, /Flasche/i, 'Hamburg: korrigierte Flaschenwürfe nicht im Ton');
	assert.match(HAMBURG.correction, /Pyrotechnik statt Flaschen/);
	assert.ok(sources.includes('Die zuvor berichteten Flaschenwürfe korrigierte die Polizei am Vormittag'));
	assert.ok(sources.includes('Update 21. November, 12:30 Uhr'));
	for (const old of ['120 Festnahmen', '130', 'zwölf Polizisten', '180 verletzte']) assert.ok(!all.includes(old) && !scenesSrc.includes(old), `alter Stand ${old} nicht im Video`);
	assert.match(sources, /## Bewusst NICHT verwendet/);
	assert.match(sources, /Samstagabend/, 'Datumsfehler der Medien dokumentiert');
	assert.equal(STAND.date, '21.11.2026');
	assert.ok(sources.includes(`Letzter Faktencheck: 21.11.2026, ${STAND.time} Uhr`));
});

test('Jede Zahl mit Urheber und wörtlich belegt', () => {
	assert.match(seg('h1'), /laut Polizei rund 4\.000/);
	assert.match(seg('l2'), /laut Polizei fünf verletzte Beamte/);
	assert.match(seg('b1'), /laut Polizei ohne besondere Vorkommnisse/);
	assert.match(seg('s1'), /laut Polizei über zwanzig vorläufige Festnahmen/);
	assert.match(seg('r1'), /laut Polizei der Versuch, ein Auto anzuzünden/);
	assert.match(seg('f1'), /^Und Frankfurt\? Laut Innenminister/);
	assert.equal(HAMBURG.count, 4000);
	assert.equal(LEIPZIG.count, 2500);
	assert.equal(LEIPZIG.injured, 5);
	assert.equal(LEIPZIG.ids, 200);
	assert.equal(LEIPZIG.noGuilt, 'VERDACHT ≠ SCHULD');
	assert.equal(BERLIN.count, '4.000');
	assert.match(STUTTGART.result, /ÜBER 20/);
	assert.match(BREMEN.what, /CDU-Parteibüro/);
	assert.match(FRANKFURT.quote, /31\. Oktober/);
	for (const q of [
		'An dem "Gen Z regelt"-Protest am Abend nahmen laut Polizei rund 4.000 Menschen teil.',
		'Vereinzelt flogen demnach Pyrotechnik und Eier in Richtung der Beamtinnen und Beamten. Die Polizei nahm mehrere Personen in Gewahrsam.',
		'startete um 17:00 Uhr ebenfalls auf dem Wilhelm-Leuschner-Platz mit circa 2.500 Teilnehmenden.',
		'Schlussendlich wurden die Identitäten von über 200 Personen festgestellt, darunter vier Kinder und über 40 Jugendliche.',
		'Mit aktuellem Stand wurden fünf Polizeibeamte verletzt.',
		'Rund 4000 junge Menschen beteiligten sich nach Polizeiangaben an einem Protestzug der Gruppe „Gen Z regelt“.',
		'über zwanzig vorläufigen Festnahmen',
		'Zudem wurden mehrere mit roter Farbe gefüllte Weihnachtskugeln an das CDU-Parteibüro geworfen.',
		'In der Humboldtstraße wurde offenbar versucht, ein Auto in Brand zu setzen.',
		'"Die Bilder vom 31. Oktober haben sich nicht wiederholt',
	]) {
		assert.ok(sources.includes(q), `Wortlaut in sources.md: ${q}`);
	}
});

test('Karte: sechs Städte mit Einordnung nach Polizeiangaben', () => {
	assert.deepEqual(CITIES.map((c) => c.id).sort(), ['berlin', 'bremen', 'frankfurt', 'hamburg', 'leipzig', 'stuttgart']);
	const v = Object.fromEntries(CITIES.map((c) => [c.id, c.verlauf]));
	assert.equal(v.hamburg, 'danach');
	assert.equal(v.leipzig, 'danach');
	assert.equal(v.berlin, 'friedlich');
	assert.equal(v.frankfurt, 'friedlich');
	assert.equal(v.stuttgart, 'waehrend');
	assert.equal(v.bremen, 'waehrend');
	for (const c of CITIES) assert.ok(c.lat > 47 && c.lat < 55.1 && c.lon > 5.8 && c.lon < 15.1, `${c.id} in Deutschland`);
	assert.match(PRINCIPLE.note, /Polizeiangaben/);
});

test('Sprechertext: Adam kurzformat-60, Ewa→Eywa, CDU buchstabiert, Abo-Aufruf aus dem Cache, Budget', () => {
	assert.equal(script.voice.profile, 'kurzformat-60');
	assert.deepEqual(voiceSettingsFor(voice, script), {...voice.elevenlabs.voiceSettings, speed: 1.2});
	assert.equal(applyAussprache('Ewa, Frankfurt!', ausspracheFor(voice, script.videoId)), '{Ewa|Eywa}, Frankfurt!');
	assert.match(script.segments.find((s: {id: string}) => s.id === 'r1').text, /\{CDU-Büro\|Ce De U Büro\}/);
	assert.equal(script.segments.at(-1).text, 'Folgt {FrankfurtRed3|Frankfurt Rett Drei} für mehr!');
	const chars = script.segments.reduce((n: number, s: {text: string}) => n + spoken(s.text).length, 0);
	assert.ok(chars <= 1040, `≤ 1.040 gesprochene Zeichen (${chars})`);
	for (const s of script.segments) assert.ok(s.pauseAfterMs <= 300, `${s.id}: Pause ≤ 300 ms`);
});

test('60-s-Grenze, Kopfzeile oben rechts, Quellenzeile unter den Untertiteln', () => {
	assert.equal(cfg.maxSeconds, 60);
	assert.equal(cfg.maxPauseMs, 400);
	assert.equal(cfg.outputName, 'FrankfurtRed3_20November_Staedte_ADAM_FINAL');
	assert.equal(cfg.thumbnailName, 'FrankfurtRed3_20November_Staedte_THUMBNAIL');
	assert.match(compSrc, /badgePlacement: 'top-right'/);
	assert.match(compSrc, /episode: '#15'/);
	assert.match(compSrc, /sourceLine: \[\.\.\.SOURCE_LINE\]/);
	assert.doesNotMatch(scenesSrc, /SourceBar/);
	const tl = erklaertTimelineFor(STAEDTE_SCENES, script, manifest, 30, cfg.maxSeconds);
	assert.ok(tl.durationInFrames <= FORMAT.maxFrames, `${tl.durationInFrames} ≤ 1800`);
	if (isAdam) assert.ok(tl.durationInFrames >= 50 * 30, `nicht auffällig kurz (${tl.durationInFrames})`);
	for (const s of SOURCE_LINE) {
		assert.ok(s.text.length <= 112, `Quelle ≤ 112 Zeichen: ${s.text}`);
		assert.doesNotMatch(s.text, /https?:|www\./);
		assert.ok(script.segments.some((x: {id: string}) => x.id === s.from), `Segment ${s.from}`);
	}
	assert.ok(resolveSourceLine([...SOURCE_LINE], manifest, 30, {start: 48, end: tl.durationInFrames}).length >= 9);
	assert.ok(LAYOUT.sourceLineTop >= 1512 && LAYOUT.sourceLineMaxBottom <= 1630);
});

test('Titelbild nach COVER_ZONE', () => {
	assert.ok(L.brandTop >= COVER_ZONE.coreTop + 50 && L.brandTop <= 400);
	assert.ok(L.kickerTop >= L.brandBottom && L.bigTop >= L.kickerBottom && L.moreTop >= L.bigBottom && L.cardTop >= L.moreBottom && L.tagTop >= L.cardBottom);
	assert.ok(L.tagBottom <= COVER_ZONE.rightButtonsTop, 'Plakette endet über den App-Knöpfen');
	assert.ok(L.mapRight <= 930);
	assert.ok(L.metaBottom <= COVER_ZONE.videoBottom);
	assert.ok(L.thumbBottom <= COVER_ZONE.coreBottom);
	assert.deepEqual(COVER.big, ['HAMBURG', 'LEIPZIG']);
});

test('Caption: Titel, Quellen-URLs, genau fünf Hashtags, ≤ 4.000 Zeichen, keine Autoveröffentlichung', () => {
	assert.match(tiktok, /GEN-Z-PROTESTE: WAS IST IN HAMBURG, LEIPZIG UND DEN ANDEREN STÄDTEN PASSIERT\?/);
	const caption = tiktok.split('```')[1] ?? '';
	assert.ok(caption.length > 300 && caption.length <= 4000, `Caption-Länge ${caption.length}`);
	const tags = caption.match(/#[\p{L}\p{N}]+/gu) ?? [];
	assert.equal(tags.length, 5);
	assert.ok(tags.includes('#GenZRegelt'));
	assert.match(caption, /polizei\.sachsen\.de/);
	assert.match(caption, /ndr\.de/);
	assert.match(caption, /presseportal\.de\/blaulicht\/pm\/110977/);
	assert.match(caption, /presseportal\.de\/blaulicht\/pm\/35235/);
	assert.match(tiktok, /nicht automatisch veröffentlicht/i);
	assert.match(caption, /Verdacht ≠ Schuld/);
});
