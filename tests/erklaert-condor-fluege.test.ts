/**
 * „Zwei Flugzeuge – Passagiere krank an Bord“ (FrankfurtErklaertCondorFluege, #17, Stand 23.11.2026): 620 = alle an Bord ≠ Erkrankte, abweichende
 * Betroffenenzahlen getrennt (laut Condor ≈ 30 · andere Berichte ≈ 40), keine Notlandung/Lebensgefahr/Diagnose, Norovirus nur als Verdacht,
 * zwei Klinikaufnahmen mit Quelle, Gesundheitsamt prüft, neuer Kanalname FrankfurtRedNews im Abo-Aufruf (alte Folgen unverändert),
 * Längen-Ausnahme (Info ≤ 61,5 s, gesamt ≤ 66 s), Quellenzeile unter den Untertiteln, Kopfzeile oben rechts, Titelbild nach COVER_ZONE.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {applyAussprache, ausspracheFor, voiceSettingsFor} from '../scripts/lib/aussprache.mjs';
import {resolveSourceLine} from '../src/formats/frankfurt-erklaert/source-line.ts';
import {COVER_ZONE, FORMAT, LAYOUT} from '../src/formats/frankfurt-erklaert/theme.ts';
import {erklaertTimelineFor} from '../src/formats/frankfurt-erklaert/timeline.ts';
import {type VoiceoverManifest} from '../src/lib/script-timing.ts';
import {BRAND, BRAND_NEWS, handleWithAt} from '../src/theme/brand.ts';
import {AIRPORTS, AMT, COVER, FLIGHTS, KLINIK, ONBOARD, SOURCE_LINE, STAND, SYMPTOMS, URSACHE} from '../src/videos/frankfurt-erklaert-condor-fluege/content.ts';
import {CONDOR_COVER_LAYOUT as L} from '../src/videos/frankfurt-erklaert-condor-fluege/cover-layout.ts';
import {CONDOR_KEYWORDS, CONDOR_SCENES} from '../src/videos/frankfurt-erklaert-condor-fluege/plan.ts';

const dir = '../src/videos/frankfurt-erklaert-condor-fluege/';
const ref = '../references/frankfurt-erklaert-condor-fluege/';
const read = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8');
const script = JSON.parse(read(`${dir}script.json`));
const manifest: VoiceoverManifest = JSON.parse(read(`${dir}voiceover.json`));
const videos = JSON.parse(read('../config/videos.json'));
const voice = {...JSON.parse(read('../config/voice.json')), ...JSON.parse(read('../config/voice-regeln.json'))};
const sources = read(`${ref}sources.md`);
const tiktok = read(`${ref}tiktok-text.md`);
const caption = tiktok.split('```')[1] ?? '';
const scenesSrc = read(`${dir}scenes/Scenes.tsx`);
const visualsSrc = read(`${dir}visuals/Aviation.tsx`);
const compSrc = read(`${dir}FrankfurtErklaertCondorFluege.tsx`);
const display = (t: string) => t.replace(/\{([^|}]*)\|[^}]*\}/g, '$1');
const spoken = (t: string) => t.replace(/\{[^|}]*\|([^}]*)\}/g, '$1');
const seg = (id: string) => display(script.segments.find((s: {id: string}) => s.id === id).text);
const all = script.segments.map((s: {text: string}) => display(s.text)).join(' ');
const isAdam = String(manifest.source).startsWith('elevenlabs');
const cfg = videos.FrankfurtErklaertCondorFluege;

test('Dramaturgie: Titelbild → Route → Kabine → 620 ≠ Erkrankte → Rettungseinsatz → Klinik → Ursache → Gesundheitsamt → Abo-Aufruf', () => {
	assert.deepEqual(CONDOR_SCENES.map((s) => s.id), ['cover', 'route', 'kabine', 'bord', 'einsatz', 'klinik', 'ursache', 'amt', 'outro']);
	assert.deepEqual(CONDOR_SCENES.flatMap((s) => s.segmentIds), script.segments.map((s: {id: string}) => s.id));
	for (const s of CONDOR_SCENES) assert.ok(CONDOR_KEYWORDS[s.id]?.length, `Schlüsselwörter für ${s.id}`);
	for (const s of CONDOR_SCENES.slice(1)) assert.ok((s.transitionInFrames ?? 0) <= 10);
	assert.equal(script.segments.at(-1).id, 'cta');
});

test('620 = alle Menschen an Bord – nie als Zahl der Erkrankten', () => {
	assert.equal(seg('b1'), 'An Bord waren rund 620 Menschen – aber wichtig: Nicht alle waren krank!');
	assert.equal(ONBOARD.total, 620);
	assert.equal(ONBOARD.totalLabel, 'MENSCHEN AN BORD');
	assert.doesNotMatch(all + caption + JSON.stringify(ONBOARD), /620 (Erkrankte|Kranke|Passagiere erkrankt|erkrankt)|(?<!nicht )alle (\d+ )?(waren|sind) krank|alle an Bord (waren )?(krank|infiziert)/i);
	assert.match(scenesSrc, /NICHT ALLE <span[^>]*>KRANK/);
	assert.ok(sources.includes('Insgesamt befanden sich in den beiden Maschinen rund 620 Personen.'));
});

test('Abweichende Betroffenenzahlen getrennt: laut Condor ≈ 30 · andere Berichte ≈ 40, keine als endgültig', () => {
	assert.equal(seg('b2'), 'Laut Condor waren rund 30 Passagiere betroffen, andere Berichte nennen 40.');
	assert.equal(ONBOARD.condor, 30);
	assert.equal(ONBOARD.reports, 40);
	assert.match(ONBOARD.note, /nicht bestätigt/);
	assert.ok(sources.includes('Laut der Airline waren rund 30 Passagiere betroffen'));
	assert.ok(sources.includes('waren möglicherweise rund 40 Menschen betroffen'));
	assert.match(caption, /rund 30 .*rund 40/s);
});

test('Keine Notlandung, keine Lebensgefahr, keine Diagnose – Norovirus nur als Verdacht', () => {
	const text = all + caption + JSON.stringify({URSACHE, AMT, KLINIK});
	assert.doesNotMatch(text.replace(/[Kk]eine Notlandung/g, ''), /Notlandung|notgelandet|Lebensgefahr|Intensivstation|Todesfall|gestorben|evakuiert|Epidemie|verseucht|vergiftet/i);
	assert.match(seg('e2'), /Norovirus-Verdacht – bestätigt ist das aber nicht\.$/);
	assert.equal(URSACHE.stamp, 'NICHT BESTÄTIGT');
	assert.doesNotMatch(all, /Norovirus (war|ist) die Ursache|hatten (einen|das) Norovirus|Noroviren nachgewiesen/i);
	assert.doesNotMatch(all + caption, /AIDA|Aida/, 'kein Schiffsname');
	assert.doesNotMatch(all + caption + scenesSrc, /MANV|9:19/, 'unbestätigte Alarmstufe nicht verwendet');
	assert.doesNotMatch(all + COVER.card + COVER.big, /plötzlich/i);
	for (const s of ['MANV 25', 'Name des Kreuzfahrtschiffs', 'Düsseldorf', '„Plötzlich“ krank']) assert.ok(sources.includes(s), `begründet unter „Bewusst NICHT verwendet“: ${s}`);
});

test('Ablauf und Klinik: jede Angabe mit Urheber und wörtlich belegt', () => {
	assert.match(seg('c1'), /schon vor der Landung bereit/);
	assert.match(seg('c2'), /^Laut Fraport vorsorglich/);
	assert.match(seg('d1'), /laut Condor eine wegen Kreislaufproblemen, eine auf eigenen Wunsch/);
	assert.equal(KLINIK.count, 2);
	assert.match(KLINIK.perFlight, /je eine Person aus jedem Flug/);
	assert.deepEqual([...SYMPTOMS], ['ÜBELKEIT', 'UNWOHLSEIN', 'ERBRECHEN']);
	assert.match(seg('e3'), /^Laut Condor waren es Charterflüge nach einer Kreuzfahrt – laut hessenschau sollen/);
	assert.match(seg('f1'), /Gesundheitsamt wurde eingeschaltet/);
	assert.deepEqual(FLIGHTS.map((f) => f.no), ['DE3705', 'DE3845']);
	assert.equal(AIRPORTS.origin.name, 'LA ROMANA');
	for (const q of [
		'Wegen der unklaren Situation wurden Rettungskräfte bereits in Alarmbereitschaft versetzt, während sich die Flugzeuge noch in der Luft befanden.',
		'Zwei Passagiere seien in ein Krankenhaus gebracht worden – einer auf eigenen Wunsch, der andere wegen Kreislaufproblemen.',
		'zogen vorsorglich zusätzliche Rettungskräfte hinzu',
		'untersuchten medizinische Teams die Menschen an Bord',
		'Demnach waren es Charter-Flüge auf dem Rückweg von einer Kreuzfahrt.',
		'Laut hr-Informationen waren die Menschen bereits vor Abflug erkrankt.',
		'Flug DE3705 kam am Sonntagmorgen (22. November) um 9:32 Uhr an, Flug DE3845 um 10:56 Uhr.',
		'in diesem Fall das Frankfurter Gesundheitsamt',
	]) {
		assert.ok(sources.includes(q), `Wortlaut in sources.md: ${q}`);
	}
	assert.equal(STAND.date, '23.11.2026');
	assert.ok(sources.includes(`Letzter Faktencheck: ${STAND.date}, ${STAND.time} Uhr`));
	assert.match(sources, /## Bewusst NICHT verwendet/);
});

test('Neuer Kanalname FrankfurtRedNews nur in neuen Folgen – Profilbild unverändert, alte Folgen behalten @frankfurtred3', () => {
	assert.equal(BRAND_NEWS.name, 'FrankfurtRedNews');
	assert.equal(handleWithAt('news'), '@frankfurtrednews');
	assert.equal(handleWithAt(), '@frankfurtred3', 'Standard (alte Folgen) unverändert');
	assert.equal(BRAND.handle, 'frankfurtred3');
	assert.equal(BRAND.logoFile, 'brand/frankfurtred-logo.webp', 'Profilbild/Logo unverändert');
	assert.equal(script.segments.at(-1).text, 'Für mehr Nachrichten aus Frankfurt folgt {FrankfurtRedNews|Frankfurt Rett News}!');
	assert.doesNotMatch(JSON.stringify(script) + scenesSrc + caption, /FrankfurtRed3|frankfurtred3|Rett Drei/, 'alter Name nicht in der neuen Folge');
	assert.match(scenesSrc, /handleWithAt\(NEWS\)/);
	assert.match(read(`${dir}FrankfurtErklaertCondorFluegeCoverVorschau.tsx`), /handle=\{handleWithAt\('news'\)\}/);
	assert.match(read(`${dir}FrankfurtErklaertCondorFluegeOverlayCheck.tsx`), /handle=\{handleWithAt\('news'\)\}/);
	assert.match(cfg.outputName, /^FrankfurtRedNews_/);
	// alte Folgen: kein Wechsel auf den neuen Namen
	for (const old of ['frankfurt-erklaert-12dez-ausblick', 'frankfurt-erklaert-20nov-staedte']) {
		const s = JSON.parse(read(`../src/videos/${old}/script.json`));
		assert.match(s.segments.at(-1).text, /FrankfurtRed3/);
	}
});

test('Keine Airline-Lackierung/Logos, Illustrationen gekennzeichnet', () => {
	assert.doesNotMatch(visualsSrc, /<image|\.png|\.jpg|\.webp/, 'keine Fotos/Logos in den Illustrationen');
	assert.doesNotMatch(visualsSrc, />CONDOR<|Condor-Logo/);
	assert.match(scenesSrc, /ILLUSTRATION/);
	assert.match(scenesSrc, /Natural Earth/);
});

test('Sprechertext: Adam kurzformat-60 (speed 1.20), Ewa→Eywa, Budget ≈ 60 s Information', () => {
	assert.equal(script.voice.profile, 'kurzformat-60');
	assert.deepEqual(voiceSettingsFor(voice, script), {...voice.elevenlabs.voiceSettings, speed: 1.2});
	assert.equal(voice.elevenlabs.voiceId, 'pNInz6obpgDQGcFmaJgB');
	assert.equal(applyAussprache('Ewa, Frankfurt!', ausspracheFor(voice, script.videoId)), '{Ewa|Eywa}, Frankfurt!');
	for (const s of script.segments) assert.ok(s.pauseAfterMs <= 300, `${s.id}: Pause ≤ 300 ms`);
	const chars = script.segments.filter((s: {id: string}) => !['hook1', 'cta'].includes(s.id)).reduce((n: number, s: {text: string}) => n + spoken(s.text).length, 0);
	assert.ok(chars >= 1000 && chars <= 1130, `Informationsteil ≈ 60 s (${chars} gesprochene Zeichen)`);
});

test('Längen-Ausnahme: Informationsteil ≤ 61,5 s, Abo-Aufruf zuletzt, gesamt ≤ 66 s', () => {
	assert.equal(cfg.maxSeconds, 66);
	assert.equal(cfg.infoMaxSeconds, 61.5);
	assert.ok(String(cfg.ausnahme).length > 20);
	assert.equal(cfg.maxPauseMs, 400);
	assert.equal(cfg.outputName, 'FrankfurtRedNews_Condor_Flughafen_Krankheitsfaelle_23Nov2026');
	const infoEnd = Math.max(...manifest.segments.filter((s) => s.id !== 'cta').map((s) => s.endMs));
	assert.ok(infoEnd <= cfg.infoMaxSeconds * 1000, `Informationsteil ${infoEnd} ms`);
	if (isAdam) {
		const greetEnd = manifest.segments.find((s) => s.id === 'hook1')!.endMs;
		assert.ok(infoEnd - greetEnd >= 56500, `Inhalt nach der Begrüßung ≈ 58–60 s (${infoEnd - greetEnd} ms)`);
	}
	const tl = erklaertTimelineFor(CONDOR_SCENES, script, manifest, 30, cfg.maxSeconds);
	assert.ok(tl.durationInFrames <= cfg.maxSeconds * 30, `${tl.durationInFrames} ≤ ${cfg.maxSeconds * 30}`);
	assert.ok(cfg.maxSeconds <= FORMAT.extendedMaxSeconds);
});

test('Kopfzeile oben rechts, Quellenzeile unter den Untertiteln, keine SourceBar', () => {
	assert.match(compSrc, /badgePlacement: 'top-right'/);
	assert.match(compSrc, /episode: '#17'/);
	assert.match(compSrc, /sourceLine: \[\.\.\.SOURCE_LINE\]/);
	assert.match(compSrc, /maxSeconds: videos\.FrankfurtErklaertCondorFluege\.maxSeconds/);
	assert.doesNotMatch(scenesSrc, /SourceBar/);
	const tl = erklaertTimelineFor(CONDOR_SCENES, script, manifest, 30, cfg.maxSeconds);
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
	assert.ok(L.kickerTop >= L.brandBottom && L.bigTop >= L.kickerBottom && L.cardTop >= L.bigBottom && L.tagTop >= L.cardBottom && L.artTop >= L.tagBottom && L.metaTop >= L.artBottom && L.thumbTop >= L.metaBottom);
	assert.ok(L.tagBottom <= COVER_ZONE.rightButtonsTop, 'Plakette endet über den App-Knöpfen');
	assert.ok(L.artRight <= 930);
	assert.ok(L.metaBottom <= COVER_ZONE.videoBottom);
	assert.ok(L.thumbBottom <= COVER_ZONE.coreBottom);
	assert.ok(L.sideMin >= COVER_ZONE.side);
	assert.equal(COVER.big, '2 FLÜGE');
});

test('Caption: Titel, Quellen-URLs, genau fünf Hashtags, ≤ 4.000 Zeichen, keine Autoveröffentlichung', () => {
	assert.match(tiktok, /ZWEI FLUGZEUGE – PASSAGIERE KRANK AN BORD!/);
	assert.ok(caption.length > 300 && caption.length <= 4000, `Caption-Länge ${caption.length}`);
	const tags = caption.match(/#[\p{L}\p{N}]+/gu) ?? [];
	assert.equal(tags.length, 5);
	assert.match(caption, /hessenschau\.de/);
	assert.match(caption, /aerotelegraph\.com/);
	assert.match(caption, /NICHT alle waren krank/);
	assert.match(caption, /bestätigt ist das NICHT/);
	assert.match(tiktok, /nicht automatisch veröffentlicht/i);
});
