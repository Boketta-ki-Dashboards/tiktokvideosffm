/**
 * „Frankfurt 20.11. – was ist heute wirklich passiert?“ (FrankfurtErklaert20NovemberVorbilanz, #14, VORBILANZ vom 20.11.2026):
 * keine Endbilanz (Stand-Uhrzeit im Bild), Versammlungen getrennt und nie addiert, jede Zahl mit Urheber, Uhrzeiten = Meldungszeiten,
 * Demozug nur über gemeldete Punkte (Verlauf schematisch), Schilderungen im Konjunktiv, nie „nur 25 in ganz Frankfurt“,
 * Quellenzeile unter den Untertiteln, hartes Limit 60 s, Kopfzeile oben rechts, Titelbild nach COVER_ZONE.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {applyAussprache, ausspracheFor, voiceSettingsFor} from '../scripts/lib/aussprache.mjs';
import {dayTimelineGeometry, dayTimelineX} from '../src/formats/frankfurt-erklaert/visuals/day-timeline-geometry.ts';
import {resolveSourceLine} from '../src/formats/frankfurt-erklaert/source-line.ts';
import {COVER_ZONE, FORMAT, LAYOUT} from '../src/formats/frankfurt-erklaert/theme.ts';
import {erklaertTimelineFor} from '../src/formats/frankfurt-erklaert/timeline.ts';
import {type VoiceoverManifest} from '../src/lib/script-timing.ts';
import {COMPARE, CONFLICT, COVER, DAY, MARCH, POLICE, SOURCE_LINE, STAND, WERFT} from '../src/videos/frankfurt-erklaert-20nov-vorbilanz/content.ts';
import {VORBILANZ_COVER_LAYOUT as L} from '../src/videos/frankfurt-erklaert-20nov-vorbilanz/cover-layout.ts';
import {VORBILANZ_KEYWORDS, VORBILANZ_SCENES} from '../src/videos/frankfurt-erklaert-20nov-vorbilanz/plan.ts';

const dir = '../src/videos/frankfurt-erklaert-20nov-vorbilanz/';
const ref = '../references/frankfurt-erklaert-20nov-vorbilanz/';
const read = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8');
const script = JSON.parse(read(`${dir}script.json`));
const manifest: VoiceoverManifest = JSON.parse(read(`${dir}voiceover.json`));
const videos = JSON.parse(read('../config/videos.json'));
const voice = {...JSON.parse(read('../config/voice.json')), ...JSON.parse(read('../config/voice-regeln.json'))};
const sources = read(`${ref}sources.md`);
const tiktok = read(`${ref}tiktok-text.md`);
const scenesSrc = read(`${dir}scenes/Scenes.tsx`);
const compSrc = read(`${dir}FrankfurtErklaert20NovemberVorbilanz.tsx`);
const display = (t: string) => t.replace(/\{([^|}]*)\|[^}]*\}/g, '$1');
const spoken = (t: string) => t.replace(/\{[^|}]*\|([^}]*)\}/g, '$1');
const seg = (id: string) => display(script.segments.find((s: {id: string}) => s.id === id).text);
const all = script.segments.map((s: {text: string}) => display(s.text)).join(' ');
const isAdam = String(manifest.source).startsWith('elevenlabs');
const cfg = videos.FrankfurtErklaert20NovemberVorbilanz;

test('Dramaturgie: Titelbild → Weseler Werft → Streit → Demozug → Erwartung vs. tatsächlich → Polizei → offen + Abo', () => {
	assert.deepEqual(VORBILANZ_SCENES.map((s) => s.id), ['cover', 'werft', 'streit', 'zug', 'zahlen', 'polizei', 'outro']);
	assert.deepEqual(VORBILANZ_SCENES.flatMap((s) => s.segmentIds), script.segments.map((s: {id: string}) => s.id));
	for (const s of VORBILANZ_SCENES) assert.ok(VORBILANZ_KEYWORDS[s.id]?.length, `Schlüsselwörter für ${s.id}`);
	for (const s of VORBILANZ_SCENES.slice(1)) assert.ok((s.transitionInFrames ?? 0) <= 10);
});

test('Vorbilanz, keine Endbilanz: Stand-Uhrzeit im Bild und in sources.md, nicht im Ton; „steht noch aus“', () => {
	assert.match(STAND.time, /^\d{1,2}:\d{2}$/);
	assert.equal(STAND.date, '20.11.2026');
	assert.equal(COVER.tag, 'VORBILANZ');
	assert.ok(sources.includes(`Letzter Faktencheck: 20.11.2026, ${STAND.time} Uhr`), 'Stand-Uhrzeit = letzter Faktencheck in sources.md');
	assert.doesNotMatch(all, /\d{1,2}:\d{2}|Uhr/, 'keine Uhrzeit im Ton (Stand nur im Bild)');
	assert.equal(seg('o1'), 'Eine offizielle Bilanz steht noch aus.');
	assert.doesNotMatch(all, /Endbilanz|Tagesbilanz|abschließend/i);
	assert.ok(SOURCE_LINE.some((s) => s.text.includes(`${STAND.time} Uhr`)));
	assert.match(tiktok, new RegExp(`VORBILANZ[^\\n]*${STAND.time}`));
});

test('Versammlungen getrennt, nie addiert – nie „nur 25 in ganz Frankfurt“', () => {
	assert.match(seg('w2'), /^Laut Reportern vor Ort kamen nur 20 bis 30/);
	assert.match(seg('w1'), /^An der Weseler Werft/);
	assert.doesNotMatch(all, /in ganz Frankfurt|insgesamt|zusammen/i);
	assert.doesNotMatch(tiktok, /nur 25 (Menschen )?in Frankfurt|insgesamt \d|zusammen \d/i);
	assert.equal(COMPARE.noSum, 'NICHT ADDIEREN');
	assert.deepEqual(COMPARE.rows.map((r) => r.id), ['zug', 'werft', 'schulstreik']);
	// keine Summe der Teilnehmerzahlen (1.000 + 25 + 600 …) irgendwo
	for (const sum of ['1.625', '1.620', '1.630', '1.600 Menschen']) {
		assert.ok(!all.includes(sum) && !scenesSrc.includes(sum) && !tiktok.includes(sum), `keine Summe ${sum}`);
	}
});

test('Jede Zahl mit Urheber; „erwartet“ statt „angemeldet“ (vorsichtiger)', () => {
	assert.match(seg('w1'), /bis zu 4\.000 Menschen erwartet\.$/);
	assert.equal(WERFT.expectedBy, 'laut Polizei');
	assert.equal(WERFT.expectedLabel, 'ERWARTET');
	assert.doesNotMatch(all, /angemeldet/);
	assert.match(seg('d3'), /^Die Polizei spricht inzwischen von rund 1\.000 Teilnehmenden\.$/);
	assert.match(seg('e1'), /^Erwartet hatte sie bis zu 1\.500, die Bundesbewegung sprach sogar von bis zu 5\.000\.$/);
	assert.match(seg('e2'), /laut Polizei rund 600/);
	assert.match(MARCH.unofficial, /nicht bestätigt/);
	for (const r of COMPARE.rows) assert.ok(r.actualBy, `Urheber für ${r.id}`);
	// Kernsätze wörtlich in sources.md
	for (const q of [
		'Lediglich 20 bis 30 Demonstrierende waren am frühen Nachmittag vor Ort.',
		'Mittlerweile spricht die Polizei von rund 1.000 Teilnehmenden.',
		'Die Polizei rechnet bis zu 4.000 Teilnehmenden.',
		'Laut Polizei wurde während des Demonstrationszugs allerdings Pyrotechnik gezündet.',
		'Die Polizei sagt uns: Alle Demos waren bisher absolut friedlich.',
		'begann der große Protest-Umzug im Bahnhofsviertel mit einer Verspätung von einer halben Stunde',
		'Tatsächlich erreichte der Demonstrationszug sein Ziel erst rund eine Stunde später.',
	]) {
		assert.ok(sources.includes(q), `Wortlaut in sources.md: ${q}`);
	}
});

test('Streit: beide Seiten mit Urheber, Schilderung im Konjunktiv und als solche gekennzeichnet', () => {
	assert.equal(seg('k4'), 'Laut Ortsgruppe seien ihr Ordner und Equipment gestrichen worden.');
	assert.match(CONFLICT.claimBy, /SCHILDERUNG/);
	assert.match(CONFLICT.claimBy, /nicht unabhängig bestätigt/);
	assert.match(CONFLICT.left.quoteBy, /hessenschau/);
	assert.match(CONFLICT.right.quoteBy, /FFH|t-online/);
	assert.ok(sources.includes('und jetzt stehen wir hier allein'));
	assert.ok(sources.includes('ihre Anliegen auf einer abgelegenen Wiese äußern soll'));
});

test('Demozug: nur gemeldete Punkte, Verlauf schematisch, Uhrzeiten = Meldungszeiten', () => {
	assert.deepEqual(MARCH.stops.map((s) => s.id), ['start', 'taunus', 'oper', 'ziel']);
	assert.deepEqual(MARCH.stops.filter((s) => s.time).map((s) => s.time), ['17:36', '18:27']);
	assert.match(MARCH.mapNote, /schematisch/);
	assert.match(MARCH.mapNote, /OpenStreetMap/);
	for (const d of DAY) assert.ok(sources.includes(`| ${d.time} |`), `Meldung ${d.time} in sources.md`);
	// Koordinaten im Kartenausschnitt (frankfurt-innenstadt-nordwest)
	for (const s of MARCH.stops) {
		assert.ok(s.at[0] > 50.105 && s.at[0] < 50.126 && s.at[1] > 8.644 && s.at[1] < 8.692, `${s.id} im Ausschnitt`);
	}
	assert.match(scenesSrc, /Verlauf zwischen gemeldeten Punkten/);
});

test('Polizei: „bisher friedlich“ + Pyrotechnik – beide mit Meldungszeit, keine erfundenen Festnahmen', () => {
	assert.equal(seg('p1'), 'Die Polizei meldet: bisher friedlich – im Demozug wurde aber Pyrotechnik gezündet.');
	assert.match(POLICE.calmNote, /17:51/);
	assert.match(POLICE.pyroNote, /18:48/);
	assert.doesNotMatch(all + scenesSrc, /Festnahmen? \d|\d+ Festnahmen|verletzt/i);
});

test('Sprechertext: Adam kurzformat-60, Ewa→Eywa, Gen Z sicher gesprochen, Abo-Aufruf aus dem Cache', () => {
	assert.equal(script.voice.profile, 'kurzformat-60');
	assert.deepEqual(voiceSettingsFor(voice, script), {...voice.elevenlabs.voiceSettings, speed: 1.2});
	assert.equal(applyAussprache('Ewa, Frankfurt!', ausspracheFor(voice, script.videoId)), '{Ewa|Eywa}, Frankfurt!');
	assert.match(script.segments.find((s: {id: string}) => s.id === 'k1').text, /\{Gen Z regelt\|Dschen Zett regelt\}/);
	assert.equal(script.segments.at(-1).text, 'Folgt {FrankfurtRed3|Frankfurt Rett Drei} für mehr!');
	const chars = script.segments.reduce((n: number, s: {text: string}) => n + spoken(s.text).length, 0);
	assert.ok(chars <= 1020, `≤ 1.020 gesprochene Zeichen (${chars})`);
	for (const s of script.segments) assert.ok(s.pauseAfterMs <= 300, `${s.id}: Pause ≤ 300 ms`);
});

test('60-s-Grenze, Kopfzeile oben rechts, Quellenzeile unter den Untertiteln', () => {
	assert.equal(cfg.maxSeconds, 60);
	assert.equal(cfg.maxPauseMs, 400);
	assert.equal(cfg.outputName, 'FrankfurtRed3_20November_Vorbilanz_ADAM_FINAL');
	assert.equal(cfg.thumbnailName, 'FrankfurtRed3_20November_Vorbilanz_THUMBNAIL');
	assert.match(compSrc, /badgePlacement: 'top-right'/);
	assert.match(compSrc, /sourceLine: \[\.\.\.SOURCE_LINE\]/);
	assert.doesNotMatch(scenesSrc, /SourceBar/);
	const tl = erklaertTimelineFor(VORBILANZ_SCENES, script, manifest, 30, cfg.maxSeconds);
	assert.ok(tl.durationInFrames <= FORMAT.maxFrames, `${tl.durationInFrames} ≤ 1800`);
	if (isAdam) assert.ok(tl.durationInFrames >= 50 * 30, `nicht auffällig kurz (${tl.durationInFrames})`);
	for (const s of SOURCE_LINE) {
		assert.ok(s.text.length <= 112, `Quelle ≤ 112 Zeichen: ${s.text}`);
		assert.doesNotMatch(s.text, /https?:|www\./);
		assert.ok(script.segments.some((x: {id: string}) => x.id === s.from), `Segment ${s.from}`);
	}
	const entries = resolveSourceLine([...SOURCE_LINE], manifest, 30, {start: 48, end: tl.durationInFrames});
	assert.ok(entries.length >= 10);
	assert.ok(LAYOUT.sourceLineTop >= 1512 && LAYOUT.sourceLineMaxBottom <= 1630);
});

test('Titelbild nach COVER_ZONE (Kernzone, App-Knöpfe rechts unten, Video-Unterkante)', () => {
	assert.ok(L.brandTop >= COVER_ZONE.coreTop + 50 && L.brandTop <= 400);
	assert.ok(L.kickerTop >= L.brandBottom && L.bigTop >= L.kickerBottom && L.cardTop >= L.bigBottom && L.tagTop >= L.cardBottom);
	assert.ok(L.tagBottom <= COVER_ZONE.rightButtonsTop, 'Plakette endet über den App-Knöpfen');
	assert.ok(L.timelineTop >= L.tagBottom);
	const g = dayTimelineGeometry('full', L.timelineOrb);
	assert.equal(L.timelineTop + g.height, L.timelineBottom);
	assert.ok(L.timelineLeft >= COVER_ZONE.side && L.timelineLeft + L.timelineWidth <= 930, 'Zeitleiste links der App-Knöpfe');
	const lastX = L.timelineLeft + dayTimelineX(DAY.length - 1, DAY.length, L.timelineWidth);
	assert.ok(lastX + 70 <= 930, 'letzte Markierung samt Beschriftung links von x 930');
	assert.ok(L.metaBottom <= COVER_ZONE.videoBottom);
	assert.ok(L.thumbBottom <= COVER_ZONE.coreBottom);
	assert.ok(L.bigMaxWidth <= 1080 - 2 * COVER_ZONE.side + 20);
});

test('Caption: Titel, Quellen-URLs, genau die fünf Hashtags, ≤ 4.000 Zeichen, keine Autoveröffentlichung', () => {
	assert.match(tiktok, /FRANKFURT 20\.11\. – DAS IST HEUTE PASSIERT! 🚨/);
	const caption = tiktok.split('```')[1] ?? '';
	assert.ok(caption.length > 200 && caption.length <= 4000, `Caption-Länge ${caption.length}`);
	const tags = caption.match(/#[\p{L}\p{N}]+/gu) ?? [];
	assert.deepEqual(tags, ['#Frankfurt', '#FrankfurtAmMain', '#GenZRegelt', '#20112026', '#FYP']);
	assert.match(caption, /https:\/\/www\.hessenschau\.de\//);
	assert.match(caption, /https:\/\/www\.ffh\.de\//);
	assert.match(caption, /t-online\.de\//);
	assert.match(tiktok, /nicht automatisch veröffentlicht/i);
});
