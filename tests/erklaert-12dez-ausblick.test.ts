/**
 * „Nach dem 20. November: Schon die nächste Demo geplant?“ (FrankfurtErklaert12DezemberAusblick, #16, Stand 22.11.2026): Ankündigung ≠ Anmeldung
 * ≠ Behörde, kein erfundener Treffpunkt (insbesondere nicht „Hauptbahnhof/Kaiserstraße“), keine Uhrzeit/Route, keine Spaltung, Online-Zusagen ≠
 * Teilnehmende, keine Prognose, 73 Städte = Website-Liste, 4 zentral, Längen-Ausnahme (Info ≤ 61,5 s + Abo-Aufruf, gesamt ≤ 66 s),
 * Quellenzeile unter den Untertiteln, Kopfzeile oben rechts, Titelbild nach COVER_ZONE.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {applyAussprache, ausspracheFor, voiceSettingsFor} from '../scripts/lib/aussprache.mjs';
import {resolveSourceLine} from '../src/formats/frankfurt-erklaert/source-line.ts';
import {COVER_ZONE, FORMAT, LAYOUT} from '../src/formats/frankfurt-erklaert/theme.ts';
import {erklaertTimelineFor} from '../src/formats/frankfurt-erklaert/timeline.ts';
import {type VoiceoverManifest} from '../src/lib/script-timing.ts';
import {CENTRAL, CITY_COUNT, COVER, FRAGE, FRANKFURT, ORGA, PLANUNGEN, RUECKBLICK, SOURCE_LINE, STAND, TERMIN, ZUSAGEN} from '../src/videos/frankfurt-erklaert-12dez-ausblick/content.ts';
import {AUSBLICK_COVER_LAYOUT as L} from '../src/videos/frankfurt-erklaert-12dez-ausblick/cover-layout.ts';
import {AUSBLICK_KEYWORDS, AUSBLICK_SCENES} from '../src/videos/frankfurt-erklaert-12dez-ausblick/plan.ts';

const dir = '../src/videos/frankfurt-erklaert-12dez-ausblick/';
const ref = '../references/frankfurt-erklaert-12dez-ausblick/';
const read = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8');
const script = JSON.parse(read(`${dir}script.json`));
const manifest: VoiceoverManifest = JSON.parse(read(`${dir}voiceover.json`));
const staedte = JSON.parse(read(`${dir}data/staedte.json`));
const staedte19 = JSON.parse(read('../src/videos/frankfurt-erklaert-20nov-bundesweit/data/staedte.json'));
const videos = JSON.parse(read('../config/videos.json'));
const voice = {...JSON.parse(read('../config/voice.json')), ...JSON.parse(read('../config/voice-regeln.json'))};
const sources = read(`${ref}sources.md`);
const tiktok = read(`${ref}tiktok-text.md`);
const scenesSrc = read(`${dir}scenes/Scenes.tsx`);
const contentSrc = read(`${dir}content.ts`);
const compSrc = read(`${dir}FrankfurtErklaert12DezemberAusblick.tsx`);
const display = (t: string) => t.replace(/\{([^|}]*)\|[^}]*\}/g, '$1');
const spoken = (t: string) => t.replace(/\{[^|}]*\|([^}]*)\}/g, '$1');
const seg = (id: string) => display(script.segments.find((s: {id: string}) => s.id === id).text);
const all = script.segments.map((s: {text: string}) => display(s.text)).join(' ');
const isAdam = String(manifest.source).startsWith('elevenlabs');
const cfg = videos.FrankfurtErklaert12DezemberAusblick;

test('Dramaturgie: Titelbild → kurzer Rückblick → neuer Termin → 73 Städte / 4 zentral → Frankfurt fest/offen → Orga → Zusagen → Frage + Abo', () => {
	assert.deepEqual(AUSBLICK_SCENES.map((s) => s.id), ['cover', 'rueckblick', 'planungen', 'termin', 'karte', 'frankfurt', 'orga', 'zusagen', 'outro']);
	assert.deepEqual(AUSBLICK_SCENES.flatMap((s) => s.segmentIds), script.segments.map((s: {id: string}) => s.id));
	for (const s of AUSBLICK_SCENES) assert.ok(AUSBLICK_KEYWORDS[s.id]?.length, `Schlüsselwörter für ${s.id}`);
	for (const s of AUSBLICK_SCENES.slice(1)) assert.ok((s.transitionInFrames ?? 0) <= 10);
	assert.equal(script.segments.at(-1).id, 'cta');
});

test('Rückblick auf den 20.11. kurz (≤ 10 s Ton) und ohne Nacherzählung früherer Folgen', () => {
	const r = manifest.segments.filter((s) => s.id === 'r1' || s.id === 'r2');
	assert.equal(r.length, 2);
	const ms = r.reduce((n, s) => n + (s.endMs - s.startMs), 0);
	assert.ok(ms <= 10000, `Rückblick ${ms} ms ≤ 10 s`);
	assert.doesNotMatch(all, /31\. Oktober|Halloween|Hamburg|Leipzig/);
});

test('Ankündigung ≠ Anmeldung ≠ Behörde – im Ton und im Bild', () => {
	assert.match(seg('n1'), /kündigt den nächsten bundesweiten Protesttag an/);
	assert.match(seg('f3'), /Veranstalter-Ankündigung – von Stadt oder Polizei gibt es dazu noch nichts\.$/);
	assert.equal(seg('f4'), 'Ob die Demo angemeldet ist, ist öffentlich nicht bekannt.');
	assert.deepEqual(FRANKFURT.steps.map((s) => [s.k, s.state]), [['ANKÜNDIGUNG', 'ok'], ['ANMELDUNG', 'open'], ['BEHÖRDE', 'open']]);
	assert.match(FRANKFURT.stepsNote, /heißt nicht, dass nichts angemeldet ist/);
	assert.doesNotMatch(all, /angemeldet hat|ist angemeldet|genehmigt|erlaubt|verboten|beschlossen/i);
	assert.equal(TERMIN.label, 'NÄCHSTER PROTESTTAG ANGEKÜNDIGT');
});

test('Kein erfundener Treffpunkt, keine Uhrzeit, keine Route – „folgt“ wie auf der Website', () => {
	assert.match(seg('f2'), /Treffpunkt und Uhrzeit stehen aber noch nicht fest – auf der Website steht nur: folgt\./);
	for (const t of [all, contentSrc, scenesSrc, tiktok]) {
		assert.doesNotMatch(t.replace(/Bahnhofsviertel|Kaisersack \(Hbf\)|Demozug ab dem Bahnhofsviertel/g, ''), /Hauptbahnhof|Kaiserstraße|Hbf\b/, 'kein Treffpunkt Hauptbahnhof/Kaiserstraße für den 12.12.');
	}
	assert.doesNotMatch(all + JSON.stringify(TERMIN) + JSON.stringify(FRANKFURT), /\b\d{1,2}(:\d{2})? Uhr\b/, 'keine Uhrzeit für den 12.12.');
	const rows = Object.fromEntries(FRANKFURT.rows.map((r) => [r.k, r]));
	assert.equal(rows.TREFFPUNKT.v, '„Standort folgt“');
	assert.equal(rows.UHRZEIT.v, '„Uhrzeit folgt“');
	assert.equal(rows.ROUTE.v, 'nicht veröffentlicht');
	assert.equal(rows.DATUM.state, 'ok');
	for (const k of ['TREFFPUNKT', 'UHRZEIT', 'ROUTE']) assert.equal(rows[k].state, 'open');
	assert.ok(sources.includes('„Standort folgt“ · „Samstag, 12.12., Uhrzeit folgt“'));
	assert.match(sources, /Treffpunkt Hauptbahnhof \/ Kaiserstraße/, 'Auftrags-Angabe unter „Bewusst NICHT verwendet“ begründet');
	assert.match(TERMIN.mapNote, /Treffpunkte für den 12\.12\. noch nicht veröffentlicht/);
});

test('Keine Spaltung, keine Auflösung, keine Prognose, kein Aufruf', () => {
	const text = all + JSON.stringify({PLANUNGEN, FRAGE, ORGA, TERMIN}) + tiktok.split('```')[1];
	assert.doesNotMatch(text, /gespalten|Spaltung|aufgelöst|zerstritten|Zerwürfnis/i);
	assert.match(seg('r2'), /unterschiedliche Planungen von Ortsgruppe und Bundesinitiative/);
	assert.match(PLANUNGEN.note, /keine Aussage über eine dauerhafte Trennung/);
	assert.doesNotMatch(text, /kommt alle|seid dabei|macht mit|Ticket holen|werden (bestimmt|sicher) mehr|Prozent|%/i);
	assert.match(seg('q1'), /\?$/);
	assert.equal(FRAGE.after.value, 'OFFEN');
	assert.match(FRAGE.before.by, /laut Polizei/);
	assert.doesNotMatch(tiktok.split('```')[1], /t\.me|telegram|gofundme/i, 'keine Telegram-/Spendenlinks in der Caption');
});

test('73 Städte = Website-Liste (namensgleich mit dem 19.11.), 4 zentral, Lage ≠ Treffpunkt', () => {
	assert.equal(staedte.cities.length, CITY_COUNT);
	assert.equal(CITY_COUNT, 73);
	const central = staedte.cities.filter((c: {central: boolean}) => c.central).map((c: {name: string}) => c.name).sort();
	assert.deepEqual(central, [...CENTRAL].sort());
	const norm = (n: string) => n.replace(' am Main', '').replace(' (Saale)', '');
	assert.deepEqual(staedte.cities.map((c: {name: string}) => norm(c.name)).sort(), staedte19.cities.map((c: {name: string}) => norm(c.name)).sort(), 'dieselbe Liste wie am 20.11.');
	for (const c of staedte.cities) assert.ok(c.lat > 47 && c.lat < 55.1 && c.lon > 5.8 && c.lon < 15.1, `${c.name} in Deutschland`);
	assert.match(staedte.$comment, /KEINE Treffpunkte/);
	assert.match(seg('n2'), /73 Städte – dieselbe Liste wie beim letzten Mal/);
	assert.match(seg('f1'), /vier Städten, in denen die Initiative selbst organisiert – neben Berlin, München und Köln/);
	assert.ok(sources.includes('„Hier organisiert Gen Z regelt Inhalte und Ablauf.“'));
});

test('Online-Zusagen ≠ Teilnehmende, Zähler nur als Momentaufnahme mit Uhrzeit', () => {
	assert.equal(seg('z1'), 'Wichtig: Online-Zusagen sind keine Teilnehmerzahlen, schreibt die Initiative selbst.');
	assert.equal(ZUSAGEN.neq, 'ONLINE-ZUSAGEN ≠ TEILNEHMER');
	assert.match(ZUSAGEN.countAt, new RegExp(`Stand 22\\.11\\., ${STAND.time} Uhr`));
	assert.ok(sources.includes('„Die Zahl zeigt, wie viele zugesagt haben. Sie ist keine Garantie, dass genau so viele Menschen vor Ort teilnehmen.“'));
	assert.ok(ZUSAGEN.quote.includes('Sie ist keine Garantie, dass genau so viele Menschen vor Ort teilnehmen.'));
	const snap = JSON.parse(read(`${ref}zusagen-zaehler-2026-11-22-${STAND.time.replace(':', '')}.json`));
	assert.equal(snap.total, ZUSAGEN.count, 'Zählerstand im Bild = gesicherter Rohwert');
	assert.doesNotMatch(all, /\b\d{3}\b.*Zusagen/, 'Zählerstand nicht im Ton');
});

test('Orga: Helfer / Ordner (ab 18, friedlicher Ablauf) / Team, Förderpool – wörtlich belegt', () => {
	assert.equal(seg('m1'), 'Neu: Die Initiative sucht Helfer – und Ordner, die für einen friedlichen Ablauf sorgen sollen.');
	assert.deepEqual(ORGA.roles.map((r) => r.k), ['HELFER*INNEN', 'ORDNER*INNEN', 'TEAM']);
	assert.match(ORGA.roles[1].v, /ab 18 · weiße Armbinde/);
	assert.match(ORGA.poolSub, /GoFundMe/);
	assert.match(ORGA.by, /wie viele mitmachen, ist nicht bekannt/);
	for (const q of [
		'„Ordner*innen sorgen dafür, dass der Protest sicher und friedlich bleibt.“',
		'Ordner*innen müssen mindestens 18 Jahre alt sein.',
		'„Das Geld im Pool stammt nur aus unserer GoFundMe-Sammlung.“',
	]) {
		assert.ok(sources.includes(q), `Wortlaut in sources.md: ${q}`);
	}
});

test('Rückblick-Zahlen mit Urheber und wörtlich belegt (jüngster Stand)', () => {
	assert.match(RUECKBLICK.fewerBy, /^laut Polizei ≈ 1\.700 bei vier Demos zusammen$/);
	assert.deepEqual(RUECKBLICK.facts, ['2.900 Einsatzkräfte', '10 Festnahmen', '342 Kontrollen']);
	assert.match(RUECKBLICK.factsBy, /Innenministerium laut hessenschau/);
	for (const q of [
		'beteiligten sich insgesamt nach Schätzungen der Polizei etwa 1.700 Menschen',
		'Laut Innenministerium waren 2.900 Polizisten und Polizistinnen im Einsatz.',
		'wurden zehn Personen in Frankfurt festgenommen',
		'Insgesamt wurden laut Innenministerium 342 Menschen in Frankfurt kontrolliert',
		'Deutlich weniger Menschen als angekündigt',
		'„Stand: 21.11.26, 12:17 Uhr“',
	]) {
		assert.ok(sources.includes(q), `Wortlaut in sources.md: ${q}`);
	}
	assert.equal(STAND.date, '22.11.2026');
	assert.ok(sources.includes(`Letzter Faktencheck: ${STAND.date}, ${STAND.time} Uhr`));
	assert.match(sources, /## Bewusst NICHT verwendet/);
});

test('Sprechertext: Adam kurzformat-60 (speed 1.20), Ewa→Eywa, „Gen Z regelt“ nach Satzzeichen, Abo-Aufruf aus dem Cache', () => {
	assert.equal(script.voice.profile, 'kurzformat-60');
	assert.deepEqual(voiceSettingsFor(voice, script), {...voice.elevenlabs.voiceSettings, speed: 1.2});
	assert.equal(voice.elevenlabs.voiceId, 'pNInz6obpgDQGcFmaJgB');
	assert.equal(applyAussprache('Ewa, Frankfurt!', ausspracheFor(voice, script.videoId)), '{Ewa|Eywa}, Frankfurt!');
	const n1 = script.segments.find((s: {id: string}) => s.id === 'n1').text;
	assert.match(n1, /– \{Gen Z regelt\|Dschen Zett regelt\}/, 'nach Gedankenstrich (Whisper hörte sonst „Dejen Zet“)');
	assert.equal(script.segments.at(-1).text, 'Folgt {FrankfurtRed3|Frankfurt Rett Drei} für mehr!');
	for (const s of script.segments) assert.ok(s.pauseAfterMs <= 300, `${s.id}: Pause ≤ 300 ms`);
	const chars = script.segments.filter((s: {id: string}) => s.id !== 'cta').reduce((n: number, s: {text: string}) => n + spoken(s.text).length, 0);
	assert.ok(chars >= 1000 && chars <= 1130, `Informationsteil ≈ 60 s (${chars} gesprochene Zeichen)`);
});

test('Längen-Ausnahme: Informationsteil ≤ 61,5 s (Ziel ≈ 60 s), Abo-Aufruf zuletzt, gesamt ≤ 66 s', () => {
	assert.equal(cfg.maxSeconds, 66);
	assert.equal(cfg.infoMaxSeconds, 61.5);
	assert.ok(String(cfg.ausnahme).length > 20);
	assert.equal(cfg.maxPauseMs, 400);
	assert.equal(cfg.outputName, 'FrankfurtRed3_GenZ_WieGehtEsWeiter_12Dezember');
	assert.equal(cfg.thumbnailName, 'FrankfurtRed3_GenZ_WieGehtEsWeiter_12Dezember_THUMBNAIL');
	const infoEnd = Math.max(...manifest.segments.filter((s) => s.id !== 'cta').map((s) => s.endMs));
	assert.ok(infoEnd <= cfg.infoMaxSeconds * 1000, `Informationsteil ${infoEnd} ms`);
	if (isAdam) {
		const greetEnd = manifest.segments.find((s) => s.id === 'hook1')!.endMs;
		assert.ok(infoEnd - greetEnd >= 57000, `Inhalt nach der Begrüßung ≈ 60 s (${infoEnd - greetEnd} ms)`);
	}
	const tl = erklaertTimelineFor(AUSBLICK_SCENES, script, manifest, 30, cfg.maxSeconds);
	assert.ok(tl.durationInFrames <= cfg.maxSeconds * 30, `${tl.durationInFrames} ≤ ${cfg.maxSeconds * 30}`);
	assert.ok(cfg.maxSeconds <= FORMAT.extendedMaxSeconds);
});

test('Kopfzeile oben rechts, Quellenzeile unter den Untertiteln, keine SourceBar', () => {
	assert.match(compSrc, /badgePlacement: 'top-right'/);
	assert.match(compSrc, /episode: '#16'/);
	assert.match(compSrc, /sourceLine: \[\.\.\.SOURCE_LINE\]/);
	assert.match(compSrc, /maxSeconds: videos\.FrankfurtErklaert12DezemberAusblick\.maxSeconds/);
	assert.doesNotMatch(scenesSrc, /SourceBar/);
	assert.match(scenesSrc, /ILLUSTRATION/);
	assert.match(scenesSrc, /OpenStreetMap-Mitwirkende/);
	const tl = erklaertTimelineFor(AUSBLICK_SCENES, script, manifest, 30, cfg.maxSeconds);
	for (const s of SOURCE_LINE) {
		assert.ok(s.text.length <= 112, `Quelle ≤ 112 Zeichen: ${s.text}`);
		assert.doesNotMatch(s.text, /https?:|www\./);
		assert.ok(script.segments.some((x: {id: string}) => x.id === s.from), `Segment ${s.from}`);
	}
	assert.ok(resolveSourceLine([...SOURCE_LINE], manifest, 30, {start: 48, end: tl.durationInFrames}).length >= 10);
	assert.ok(LAYOUT.sourceLineTop >= 1512 && LAYOUT.sourceLineMaxBottom <= 1630);
});

test('Titelbild nach COVER_ZONE', () => {
	assert.ok(L.brandTop >= COVER_ZONE.coreTop + 50 && L.brandTop <= 400);
	assert.ok(L.kickerTop >= L.brandBottom && L.bigTop >= L.kickerBottom && L.cardTop >= L.bigBottom && L.tagTop >= L.cardBottom && L.mapTop >= L.tagBottom && L.metaTop >= L.mapBottom && L.thumbTop >= L.metaBottom);
	assert.ok(L.tagBottom <= COVER_ZONE.rightButtonsTop, 'Plakette endet über den App-Knöpfen');
	assert.ok(L.mapRight <= 930);
	assert.ok(L.metaBottom <= COVER_ZONE.videoBottom);
	assert.ok(L.thumbBottom <= COVER_ZONE.coreBottom);
	assert.ok(L.sideMin >= COVER_ZONE.side);
	assert.equal(COVER.big, '12.12.');
	assert.match(COVER.tag, /^ANGEKÜNDIGT/);
});

test('Caption: Titel, Quellen-URLs, genau fünf Hashtags, ≤ 4.000 Zeichen, keine Autoveröffentlichung', () => {
	assert.match(tiktok, /NACH DEM 20\. NOVEMBER: SCHON DIE NÄCHSTE DEMO GEPLANT\?/);
	const caption = tiktok.split('```')[1] ?? '';
	assert.ok(caption.length > 300 && caption.length <= 4000, `Caption-Länge ${caption.length}`);
	const tags = caption.match(/#[\p{L}\p{N}]+/gu) ?? [];
	assert.equal(tags.length, 5);
	assert.ok(tags.includes('#GenZRegelt'));
	assert.match(caption, /genz-regelt\.de/);
	assert.match(caption, /hessenschau\.de/);
	assert.match(caption, /Ankündigung ≠ Anmeldung ≠ behördliche Entscheidung/);
	assert.match(caption, /keine Prognose/);
	assert.match(tiktok, /nicht automatisch veröffentlicht/i);
});
