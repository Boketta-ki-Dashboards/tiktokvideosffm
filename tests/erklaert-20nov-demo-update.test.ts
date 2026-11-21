/**
 * „Gen-Z-Demo am 20.11. geändert!“ (FrankfurtErklaert20NovemberDemoUpdate, #10, Stand 18.11.2026, 16:38 Uhr): Kundgebung statt Demozug an der
 * Weseler Werft (laut Stadt), 4.000 nur als ERWARTETE Zahl, Auflagen, fünf Versammlungen laut Innenministerium (neu: „GenZ regelt Bundesbewegung“),
 * Sicherheits-Pressekonferenz nur mit belegten Ergebnissen, kein Verbot/keine Absage, keine erfundene Route, keine Krawall-Prognose,
 * hartes Limit 60 s inkl. Abo-Aufruf, symmetrische Kopfzeile oben, Titelbild nach COVER_ZONE.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {applyAussprache, ausspracheFor, voiceSettingsFor} from '../scripts/lib/aussprache.mjs';
import {COVER_ZONE, FORMAT, LAYOUT} from '../src/formats/frankfurt-erklaert/theme.ts';
import {erklaertTimelineFor} from '../src/formats/frankfurt-erklaert/timeline.ts';
import {dayTimelineGeometry} from '../src/formats/frankfurt-erklaert/visuals/day-timeline-geometry.ts';
import {type VoiceoverManifest} from '../src/lib/script-timing.ts';
import {ASSEMBLIES, BUND, CHANGE, COVER, PRESS, RULES, SOURCES, STAND, WERFT} from '../src/videos/frankfurt-erklaert-20nov-demo-update/content.ts';
import {DEMOUPDATE_COVER_LAYOUT as L} from '../src/videos/frankfurt-erklaert-20nov-demo-update/cover-layout.ts';
import {DEMOUPDATE_KEYWORDS, DEMOUPDATE_SCENES} from '../src/videos/frankfurt-erklaert-20nov-demo-update/plan.ts';

const dir = '../src/videos/frankfurt-erklaert-20nov-demo-update/';
const ref = '../references/frankfurt-20nov-demo-update-2026-11-18/';
const read = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8');
const script = JSON.parse(read(`${dir}script.json`));
const manifest: VoiceoverManifest = JSON.parse(read(`${dir}voiceover.json`));
const videos = JSON.parse(read('../config/videos.json'));
const voice = {...JSON.parse(read('../config/voice.json')), ...JSON.parse(read('../config/voice-regeln.json'))};
const sources = read(`${ref}sources.md`);
const tiktok = read(`${ref}tiktok-text.md`);
const scenesSrc = read(`${dir}scenes/Scenes.tsx`);
const compSrc = read(`${dir}FrankfurtErklaert20NovemberDemoUpdate.tsx`);
const display = (t: string) => t.replace(/\{([^|}]*)\|[^}]*\}/g, '$1');
const spoken = (t: string) => t.replace(/\{[^|}]*\|([^}]*)\}/g, '$1');
const seg = (id: string) => display(script.segments.find((s: {id: string}) => s.id === id).text);
const all = script.segments.map((s: {text: string}) => display(s.text)).join(' ');
const isAdam = String(manifest.source).startsWith('elevenlabs');
const cfg = videos.FrankfurtErklaert20NovemberDemoUpdate;

test('Dramaturgie: Titelbild → Vorher/Nachher → Weseler Werft → Auflagen → fünf Versammlungen → Pressekonferenz → Fazit → Abo-Aufruf', () => {
	assert.deepEqual(
		DEMOUPDATE_SCENES.map((s) => s.id),
		['cover', 'change', 'werft', 'rules', 'five', 'press', 'final', 'outro'],
	);
	assert.deepEqual(
		script.segments.map((s: {id: string}) => s.id),
		['hook1', 'hook2', 'w1', 'w2', 'w3', 'a1', 'a2', 'v1', 'v2', 'p1', 'p2', 'p3', 'f1', 'q1', 'cta'],
	);
	const used = DEMOUPDATE_SCENES.flatMap((s) => s.segmentIds);
	assert.deepEqual(used, script.segments.map((s: {id: string}) => s.id), 'jeder Satz genau einer Szene zugeordnet');
	for (const s of DEMOUPDATE_SCENES) assert.ok(DEMOUPDATE_KEYWORDS[s.id]?.length, `Schlüsselwörter für ${s.id}`);
	for (const s of DEMOUPDATE_SCENES.slice(1)) assert.ok((s.transitionInFrames ?? 0) <= 10);
	assert.match(STAND, /18\.11\.2026, 16:38 Uhr/);
	for (const s of SOURCES) assert.ok(sources.includes(s.url), `sources.md: ${s.url}`);
});

test('Änderung laut Stadt: stationäre Kundgebung statt Demozug, Weseler Werft 14–16:30 – nicht abgesagt, kein Verbot, keine erfundene Route', () => {
	assert.match(seg('w1'), /^Statt Demozug durch die Stadt gibt's laut Stadt eine stationäre Kundgebung an der Weseler Werft\.$/);
	assert.match(seg('w2'), /14.*16:30 Uhr.*vor Einbruch der Dunkelheit/);
	assert.equal(WERFT.time, '14:00–16:30 UHR');
	assert.match(seg('f1'), /nicht abgesagt/);
	assert.doesNotMatch(all, /verboten wird|ist verboten|abgesagt!|Verbot der|untersagt/i);
	assert.doesNotMatch(all, /Krawall|Ausschreitungen erwartet|Eskalation|wird eskalieren/i, 'keine Prognose von Ausschreitungen');
	// ursprüngliche Strecke nicht veröffentlicht → nur symbolische Bewegung, ausdrücklich so beschriftet
	assert.match(CHANGE.note, /nicht veröffentlicht/);
	assert.match(scenesSrc, /kind="SYMBOLISCH"/);
	assert.match(scenesSrc, /Symbolisch: Die ursprüngliche Strecke ist nicht veröffentlicht/);
	// Wortlaut der Quelle (t-online über die Stadt) in sources.md
	assert.match(sources, /Ursprünglich war ein Demonstrationszug durch die Stadt geplant\. In Abstimmung mit der Anmelderin gebe es nun eine stationäre Kundgebung\./);
	// Abweichung Ende 16:30 (Stadt/Polizei-Liste) vs. „um 17 Uhr ein klares Ende“ (Ordnungsdezernent) dokumentiert
	assert.match(sources, /um 17 Uhr ein klares Ende/);
	assert.match(scenesSrc, /WERFT\.endQuote/);
});

test('4.000 nur als ERWARTETE Zahl (Prognose), nie als angemeldete oder tatsächliche Teilnehmerzahl', () => {
	assert.equal(seg('w3'), 'Erwartet werden bis zu 4.000 Leute – eine Prognose, keine Zählung.');
	assert.equal(WERFT.count, 4000);
	assert.equal(WERFT.countLabel, 'ERWARTET');
	assert.doesNotMatch(all, /Angemeldet sind 4|4\.000 (Leute|Menschen) (waren|kamen)|4\.000 Teilnehmer(n)? da/);
	assert.match(scenesSrc, /kind="PROGNOSE"/);
	assert.match(sources, /Erwartet werden bis zu 4\.000 Menschen/);
	assert.match(sources, /4\.000 Teilnehmer erwartet/);
});

test('Auflagen laut Stadt: Pyro, Alkohol/Glas, Hunde, Vermummung, Stangen max. 2 m – alle im Bild und im Ton', () => {
	assert.match(seg('a1'), /keine Pyro, kein Alkohol, kein Glas, keine Hunde, keine Vermummung/);
	assert.match(seg('a2'), /höchstens zwei Meter/);
	assert.deepEqual(RULES.map((r) => r.id), ['pyro', 'glass', 'mask', 'pole']);
	for (const k of ["kind: 'pyro'", "kind: 'glass'", "kind: 'dog'", "kind: 'mask'", "kind: 'pole'"]) assert.ok(scenesSrc.includes(k), k);
	assert.doesNotMatch(scenesSrc, /angeleint/, 'nichts über Leinen erfinden');
	assert.match(sources, /Pyrotechnik, das Abbrennen oder Verbrennen von Gegenständen, Hunde, Alkohol und Glasflaschen sind verboten/);
});

test('Fünf Versammlungen laut Innenministerium, chronologisch; neu: Aufzug „GenZ regelt Bundesbewegung“ (eigene Versammlung, Verlauf nicht veröffentlicht)', () => {
	assert.match(seg('v1'), /Laut Innenministerium sind es sogar fünf Versammlungen\./);
	assert.deepEqual(
		ASSEMBLIES.map((a) => a.time),
		['10:00', '11:00', '14:00', '15:00', '17:30'],
	);
	assert.deepEqual(
		ASSEMBLIES.filter((a) => a.isNew).map((a) => a.id),
		['bund'],
	);
	assert.match(seg('v2'), /ab 15 Uhr vom Hauptbahnhof nach Bockenheim, bis zu 1\.500 erwartet/);
	assert.equal(BUND.time, '15:00–17:15 UHR');
	assert.equal(BUND.from.name, 'KAISERSACK');
	assert.equal(BUND.to.name, 'CARLO-SCHMID-PLATZ');
	assert.match(BUND.note, /nicht dieselbe/);
	assert.match(scenesSrc, /Verlauf nicht veröffentlicht/);
	assert.doesNotMatch(all, /gemeinsam(e|er)? (Veranstalter|Zug)|alle (fünf|5) (von|vom) Gen Z/i, 'kein gemeinsamer Veranstalter');
	// Kurztitel passen in die fünf Spalten der Timeline (≤ 10 Zeichen je Zeile)
	for (const a of ASSEMBLIES) for (const line of a.label.split('\n')) assert.ok(line.length <= 10, `${a.id}: „${line}“`);
	assert.match(sources, /15:00 Uhr -17:15 Uhr \(Kundgebung „GenZ regelt Bundesbewegung“\): bis 1\.500 Teilnehmer erwartet\. Aufzug von Kaisersack bis Carlo-Schmid-Platz/);
});

test('Pressekonferenz 18.11.: nur belegte Ergebnisse (über 2.000 statt 1.300, 49 Aufenthaltsverbote, 36 Meldeauflagen, Zeil bei Bedarf) – Illustration ohne Personen', () => {
	assert.match(seg('p1'), /über 2\.000 Einsatzkräften – an Halloween waren es 1\.300/);
	assert.match(seg('p2'), /Gegen 49 Personen laufen Aufenthaltsverbote, gegen 36 Tatverdächtige Meldeauflagen\./);
	assert.match(seg('p3'), /^Bei Bedarf werden alle Zugänge zur Zeil kontrolliert\.$/);
	assert.equal(PRESS.forces.now, 2000);
	assert.equal(PRESS.forces.before, 1300);
	assert.equal(PRESS.bans.count, 49);
	assert.equal(PRESS.reports.count, 36);
	for (const q of ['Über 2.000 Einsatzkräfte werden für Sicherheit sorgen', 'Meldeauflagen gegen 36 bereits identifizierte Tatverdächtige sowie Aufenthaltsverbote gegen 49 Personen', 'im Bedarfsfall kurzfristig sämtliche Zugänge zur Zeil zu kontrollieren']) {
		assert.ok(sources.includes(q), `Wortlaut in sources.md: ${q}`);
	}
	// stilisiertes Podium ohne Personen, als Illustration gekennzeichnet
	const illu = read(`${dir}visuals/Illustrations.tsx`);
	assert.match(illu, /PressPodium/);
	assert.doesNotMatch(illu, /import[^\n]*(Person|OfficerFigure|CapeFigure)/);
	assert.match(scenesSrc, /<PressPodium[\s\S]{0,320}<Chip kind="ILLUSTRATION"/);
	// nicht verwendete Aussagen bewusst dokumentiert
	assert.match(sources, /## Bewusst NICHT verwendet/);
	for (const k of ['99', 'Linksextrem', '2.150']) assert.ok(sources.split('## Bewusst NICHT verwendet')[1].includes(k), `nicht verwendet: ${k}`);
});

test('Stimme: Adam kurzformat-60, Ewa → Eywa, „Gen Z“ nur in Lautschrift, Abo-Aufruf, Untertitel nur Anzeige-Schreibweise', () => {
	assert.equal(script.voice.profile, 'kurzformat-60');
	assert.deepEqual(voiceSettingsFor(voice, script), {...voice.elevenlabs.voiceSettings, speed: 1.2});
	assert.equal(voice.elevenlabs.voiceSettings.speed, 1.16);
	assert.equal(seg('hook1'), 'Ewa, Frankfurt!');
	assert.equal(applyAussprache('Ewa, Frankfurt!', ausspracheFor(voice, script.videoId)), '{Ewa|Eywa}, Frankfurt!');
	for (const s of script.segments) assert.doesNotMatch(spoken(s.text), /Gen Z|Gen-Z|GenZ/, `${s.id}: „Gen Z“ nur in Lautschrift`);
	assert.doesNotMatch(all, /(zwei|der) Gen.?Z/i);
	const cta = script.segments.at(-1);
	assert.equal(cta.id, 'cta');
	assert.equal(display(cta.text), 'Folgt FrankfurtRed3 für mehr!');
	assert.equal(spoken(cta.text), 'Folgt Frankfurt Rett Drei für mehr!');
	assert.ok(!manifest.captions.some((c) => /Eywa|Dschen|Rett|viertausend|zweitausend|dreizehnhundert|fünfzehnhundert|neunundvierzig/.test(c.text)), 'Untertitel zeigen nur die Anzeige-Schreibweise');
	const slang = (all.match(/gibt's|Pyro|Leute|Heißt:/g) ?? []).length;
	assert.ok(slang >= 2 && slang <= 4, `Slang ${slang}`);
	if (isAdam) assert.equal((manifest as unknown as {voice: {voiceId: string}}).voice.voiceId, 'pNInz6obpgDQGcFmaJgB');
});

test('Länge: hartes Limit 60 s = 1.800 Frames inkl. Intro und Abo-Aufruf, keine Ausnahme; Pausen ≤ 400 ms; Untertitel im Satz', () => {
	assert.equal(cfg.maxSeconds, FORMAT.maxSeconds);
	assert.equal(cfg.maxSeconds, 60);
	assert.equal(cfg.ausnahme, undefined);
	assert.equal(cfg.sonderausnahme, undefined);
	assert.equal(cfg.maxPauseMs, 400);
	assert.equal(cfg.outputName, 'FrankfurtRed3_20November_DemoUpdate_ADAM_FINAL');
	assert.equal(cfg.thumbnailName, 'FrankfurtRed3_20November_DemoUpdate_THUMBNAIL');
	assert.match(compSrc, /maxSeconds: videos\.FrankfurtErklaert20NovemberDemoUpdate\.maxSeconds/);
	const tl = erklaertTimelineFor(DEMOUPDATE_SCENES, script, manifest, 30, cfg.maxSeconds);
	assert.ok(tl.durationInFrames <= 1800, `${tl.durationInFrames} Frames`);
	if (isAdam) {
		assert.ok(tl.durationInFrames >= 54 * 30, `Ziel 57–60 s, ist ${tl.durationInFrames / 30} s`);
		const segs = manifest.segments;
		for (let i = 1; i < segs.length; i++) assert.ok(segs[i].startMs - segs[i - 1].endMs <= 400, `Pause vor ${segs[i].id}`);
		for (const c of manifest.captions) {
			const s = segs.find((x) => c.startMs >= x.startMs - 1 && c.startMs < x.endMs);
			assert.ok(s && c.endMs <= s.endMs + 1, `Untertitel „${c.text}“ außerhalb seines Satzes`);
		}
	}
});

test('Kopfzeile ab #09: Serien-Overlay oben rechts + Szenen-Box links auf einer Linie; Overlay-Prüfbogen registriert', () => {
	assert.match(compSrc, /badgePlacement: 'top-right'/);
	assert.match(compSrc, /episode: '#10'/);
	assert.equal(LAYOUT.badgeTopRight, 272);
	assert.match(scenesSrc, /<TopTag /);
	assert.doesNotMatch(scenesSrc, /top: 290\}/);
	// Inhalte beginnen unter der Kopfzeile (y 342)
	for (const m of scenesSrc.matchAll(/top: (3\d\d)[,}]/g)) assert.ok(Number(m[1]) >= LAYOUT.badgeTopRight + LAYOUT.topBarHeight, `Inhalt bei y ${m[1]} unter der Kopfzeile`);
	const root = read('../src/Root.tsx');
	for (const id of ['FrankfurtErklaert20NovemberDemoUpdate"', 'FrankfurtErklaert20NovemberDemoUpdate-Cover"', 'FrankfurtErklaert20NovemberDemoUpdate-CoverVorschau"', 'FrankfurtErklaert20NovemberDemoUpdate-OverlayCheck"']) {
		assert.ok(root.includes(`id="${id}`), id);
	}
	assert.match(read('../.github/workflows/video-produzieren.yml'), /- FrankfurtErklaert20NovemberDemoUpdate/);
});

test('Offizielles Logo im Abo-Aufruf, Titelbild und Prüfbogen – kein „S“, Account nur aus BRAND', () => {
	assert.match(scenesSrc, /<BrandLogo size=\{250\}/);
	assert.match(scenesSrc, /<BrandLogo size=\{52\} \/>/);
	assert.doesNotMatch(scenesSrc, /BrandAvatar/);
	assert.match(read(`${dir}FrankfurtErklaert20NovemberDemoUpdateCoverVorschau.tsx`), /avatar=\{\(s\) => <BrandLogo/);
	assert.doesNotMatch(scenesSrc, /@frankfurtred3/);
});

test('Karte: OSM-Ausschnitt Weseler Werft mit Hinweis © OpenStreetMap-Mitwirkende, Fläche schematisch', () => {
	const map = JSON.parse(read('../src/data/maps/frankfurt-ostend-weseler-werft.json'));
	assert.equal(map.meta.attribution, '© OpenStreetMap-Mitwirkende');
	const [lat, lon] = WERFT.at;
	assert.ok(lat > map.meta.bbox.minlat && lat < map.meta.bbox.maxlat && lon > map.meta.bbox.minlon && lon < map.meta.bbox.maxlon, 'Werft liegt im Ausschnitt');
	assert.match(scenesSrc, /Fläche schematisch · Karte © OpenStreetMap-Mitwirkende/);
});

test('Titelbild: Kernzone, 3:4-Ausschnitt, Mini-Grafik vor den App-Knöpfen, Untertitel-Band im Video frei', () => {
	const tops = [L.brandTop, L.kickerTop, L.bigTop, L.cardTop, L.vizTop, L.smallTop, L.metaTop];
	for (const y of tops) assert.ok(y >= COVER_ZONE.coreTop && y <= COVER_ZONE.coreBottom, `y=${y}`);
	assert.ok(L.brandTop >= 390, 'Serientitel nicht zu hoch');
	assert.ok(L.brandBottom <= L.kickerTop && L.kickerTop + L.kickerSize * 1.1 <= L.bigTop + 4 && L.bigBottom <= L.cardTop);
	assert.ok(L.cardBottom <= L.vizTop && L.vizBottom <= L.smallTop && L.smallBottom <= L.metaTop);
	assert.ok(L.vizBottom <= COVER_ZONE.rightButtonsTop, 'Mini-Grafik endet über den App-Knöpfen');
	assert.ok(L.vizLeft >= COVER_ZONE.side && L.vizLeft + L.vizWidth <= COVER_ZONE.rightButtonsX);
	assert.ok(L.metaBottom <= COVER_ZONE.videoBottom);
	assert.ok(L.questionTop >= COVER_ZONE.videoBottom && L.questionBottom <= COVER_ZONE.coreBottom);
	assert.ok(L.bigMaxWidth <= 1080 - 2 * COVER_ZONE.side);
	assert.ok(L.sideMin >= COVER_ZONE.side);
	assert.ok(L.bigSize >= 58 * 2);
	assert.equal(COVER.kicker, 'GEN-Z-DEMO AM 20.11.');
	assert.equal(COVER.big, 'GEÄNDERT!');
	assert.equal(COVER.small, 'WESELER WERFT · 14–16:30 UHR');
	assert.ok(dayTimelineGeometry('full', 76).height <= 200, 'Timeline der Szene „fünf“ bleibt kompakt');
});

test('TikTok-Text: Titel, Caption ≤ 4.000 Zeichen, genau die 5 vorgegebenen Hashtags, Kernfakten mit Urheber, Frage am Ende', () => {
	assert.match(tiktok, /## Titel\s+GEN-Z-DEMO AM 20\.11\. GEÄNDERT! 🚨 NEUER ABLAUF IN FRANKFURT/);
	const caption = (tiktok.split('## Caption')[1] ?? '').trim();
	assert.ok(caption.length >= 1500 && caption.length <= 4000, `Caption ${caption.length}`);
	assert.deepEqual(caption.match(/#[\wäöüÄÖÜß]+/g), ['#Frankfurt', '#FrankfurtAmMain', '#GenZRegelt', '#20112026', '#FYP']);
	for (const s of ['Weseler Werft', '14 bis 16:30', '4.000', 'erwartet', 'fünf', 'Bundesbewegung', 'Kaisersack', 'Carlo-Schmid-Platz', '1.500', '2.000', '1.300', '49', '36', 'Zeil', 'nicht abgesagt', 'Stand: 18.11.2026', 'Innenministerium', 't-online']) {
		assert.ok(caption.includes(s), `Caption: ${s}`);
	}
	assert.match(caption, /\?\s*\n\s*#/);
	assert.doesNotMatch(caption, /angemeldet sind 4\.000|4\.000 angemeldet|verboten wird|Krawalle erwartet/i);
});
