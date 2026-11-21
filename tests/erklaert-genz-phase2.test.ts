/**
 * „Gen Z regelt – Phase 2: friedliche Demos, aber 20 Festnahmen in Berlin“ (FrankfurtErklaertGenZPhase2):
 * Zahlen mit Urheber und Meldestand (Bilanz Sonntag 15.11., frühere Samstagszahlen nur als „zuerst“), Strecke nur soweit belegt,
 * keine Polizeibewegungen, Festnahme ≠ Verurteilung, hartes 60-s-Limit inkl. Abo-Aufruf, offizielles Logo statt „S“,
 * Titelbild nach COVER_ZONE, TikTok-Text.
 */
import assert from 'node:assert/strict';
import {readFileSync, statSync} from 'node:fs';
import {test} from 'node:test';
import {applyAussprache, ausspracheFor, voiceSettingsFor} from '../scripts/lib/aussprache.mjs';
import {COVER_ZONE, FORMAT} from '../src/formats/frankfurt-erklaert/theme.ts';
import {erklaertTimelineFor} from '../src/formats/frankfurt-erklaert/timeline.ts';
import {type VoiceoverManifest} from '../src/lib/script-timing.ts';
import {BRAND} from '../src/theme/brand.ts';
import {BERLIN, BERLIN_CONNECTOR, CHARGES, CITIES, CONTEXT, COVER, INCIDENTS, KUDAMM, NEXT, OTHER_CITIES, QUESTION, ROUTE, SOURCES, STAND, STATS, STATS_SOURCE} from '../src/videos/frankfurt-erklaert-genz-phase2-2026-11-14/content.ts';
import {PHASE2_COVER_LAYOUT as L} from '../src/videos/frankfurt-erklaert-genz-phase2-2026-11-14/cover-layout.ts';
import {PHASE2_KEYWORDS, PHASE2_SCENES} from '../src/videos/frankfurt-erklaert-genz-phase2-2026-11-14/plan.ts';

const dir = '../src/videos/frankfurt-erklaert-genz-phase2-2026-11-14/';
const read = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8');
const script = JSON.parse(read(`${dir}script.json`));
const manifest: VoiceoverManifest = JSON.parse(read(`${dir}voiceover.json`));
const videos = JSON.parse(read('../config/videos.json'));
const voice = {...JSON.parse(read('../config/voice.json')), ...JSON.parse(read('../config/voice-regeln.json'))};
const sources = read('../references/frankfurt-erklaert-genz-phase2-2026-11-14/sources.md');
const tiktok = read('../references/frankfurt-erklaert-genz-phase2-2026-11-14/tiktok-text.md');
const scenesSrc = read(`${dir}scenes/Scenes.tsx`);
const map = JSON.parse(read('../src/data/maps/berlin-charlottenburg.json'));
const display = (t: string) => t.replace(/\{([^|}]*)\|[^}]*\}/g, '$1');
const spoken = (t: string) => t.replace(/\{[^|}]*\|([^}]*)\}/g, '$1');
const seg = (id: string) => display(script.segments.find((s: {id: string}) => s.id === id).text);
const all = script.segments.map((s: {text: string}) => display(s.text)).join(' ');
const isAdam = String(manifest.source).startsWith('elevenlabs');
const cfg = videos.FrankfurtErklaertGenZPhase2;

test('Dramaturgie: Titelbild → drei Städte → Berlin → Zwischenfälle → Bilanz → 20.11. → Frage + Abo-Aufruf', () => {
	assert.deepEqual(
		PHASE2_SCENES.map((s) => s.id),
		['cover', 'cities', 'berlin', 'incidents', 'stats', 'next', 'outro'],
	);
	for (const s of PHASE2_SCENES) assert.ok(PHASE2_KEYWORDS[s.id]?.length, `Schlüsselwörter für ${s.id}`);
	for (const s of PHASE2_SCENES.slice(1)) assert.ok((s.transitionInFrames ?? 0) <= 10);
	assert.deepEqual(PHASE2_SCENES[0].segmentIds, ['hook1', 'hook2']);
	assert.match(STAND, /15\.11\.2026/);
	for (const s of SOURCES) assert.ok(sources.includes(s.url), `sources.md: ${s.url}`);
});

test('Städte: Zahlen laut Polizei mit Einordnung; nicht „Proteste in 4 Städten“ (auch Düsseldorf/Wuppertal)', () => {
	const [bremen, karlsruhe, stuttgart] = CITIES;
	assert.equal(bremen.count, 670);
	assert.equal(bremen.prefix, 'BIS ZU');
	assert.match(bremen.countNote, /Spitze · laut Polizei/);
	assert.equal(bremen.verdict, 'FRIEDLICH');
	assert.equal(karlsruhe.count, 220);
	assert.equal(karlsruhe.prefix, 'RUND');
	assert.match(karlsruhe.countNote, /Schätzung der Polizei/);
	assert.equal(karlsruhe.verdict, 'WEITGEHEND FRIEDLICH');
	assert.equal(stuttgart.count, null);
	assert.equal(stuttgart.verdict, 'AUFZUG UNTERSAGT');
	assert.match(stuttgart.verdictNote, /stationäre Kundgebung/);
	assert.match(stuttgart.verdictNote, /Organisatoren bestreiten das/);
	assert.match(seg('bremen'), /laut Polizei bis zu 670 Leute, friedlich/);
	assert.match(seg('karlsruhe'), /rund 220, weitgehend friedlich/);
	assert.match(seg('stuttgart'), /mehrere Hundert – der Demozug wurde untersagt/);
	assert.match(OTHER_CITIES.text, /DÜSSELDORF RUND 100 · WUPPERTAL RUND 80/);
	assert.doesNotMatch(JSON.stringify(COVER) + all, /in (vier|4) Städten/i);
	assert.equal(COVER.chipsNote, '4 STÄDTE IM ÜBERBLICK');
	for (const s of ['In der Spitze seien es später 670 gewesen', 'Alles sei friedlich verlaufen.', 'In Karlsruhe zogen nach Schätzung der Polizei 220 Personen durch die Innenstadt.', 'insgesamt friedlichen Verlauf', 'In Stuttgart wurde ein solcher Protestzug untersagt', 'Die Beamten sprachen von mehreren hundert Teilnehmern.', 'Die Organisatoren bestreiten das.', 'In Düsseldorf kamen insgesamt rund 100 Menschen zusammen', 'rund 80 Menschen']) {
		assert.ok(sources.includes(s), `sources.md: „${s}“ fehlt`);
	}
});

test('Berlin: 100 angemeldet / rund 1.200 laut Polizei, 700 Kräfte, Strecke nur soweit belegt, keine Polizeibewegungen', () => {
	assert.equal(BERLIN.registered, 100);
	assert.equal(BERLIN.came, 1200);
	assert.equal(BERLIN.officers, 700);
	assert.match(seg('berlin1'), /Angemeldet waren 100, gekommen sind laut Polizei rund 1\.200/);
	assert.match(seg('berlin2'), /^700 Polizisten waren im Einsatz, der Zug lief vom Savignyplatz über den Ku'damm bis Halensee\.$/);
	// keine abweichende Samstagszahl als Fakt, keine behauptete Auflösung durch die Polizei
	assert.doesNotMatch(all + JSON.stringify({BERLIN, INCIDENTS}), /1\.?400|vorzeitig aufgelöst|aufgelöst worden|Kessel|eingekesselt|Wasserwerfer|abgedrängt|stürmte/i);
	assert.match(BERLIN.routeNote, /schematisch/);
	assert.match(BERLIN.source, /OpenStreetMap-Mitwirkende/);
	// Strecke: Ku'damm-Abschnitt von Ost nach West, Ende S Halensee, alles im Kartenausschnitt
	const {minlat, maxlat, minlon, maxlon} = map.meta.bbox;
	for (const [lat, lon] of [...ROUTE, BERLIN.start.at]) assert.ok(lat > minlat && lat < maxlat && lon > minlon && lon < maxlon, `${lat},${lon} außerhalb`);
	assert.ok(KUDAMM[0][1] > KUDAMM[KUDAMM.length - 1][1], 'Zugrichtung West');
	assert.deepEqual(ROUTE[ROUTE.length - 1], BERLIN.end.at);
	assert.deepEqual(BERLIN_CONNECTOR, [BERLIN.start.at, KUDAMM[0]]);
	assert.ok(map.streets.Kurfürstendamm, 'Ku’damm in den OSM-Daten');
	for (const s of ['Angemeldet waren lediglich 100.', 'Laut Polizei zogen rund 1.200 Demonstrantinnen und Demonstranten durch Berlin.', 'Die Polizei war mit 700 Einsatzkräften vor Ort.', 'Der Protestzug startete gegen 17 Uhr am Savignyplatz.', 'Die Demo zog anschließend über den Kurfürstendamm bis zum S-Bahnhof Halensee und löste sich dort am frühen Abend auf.']) {
		assert.ok(sources.includes(s), `sources.md: „${s}“ fehlt`);
	}
});

test('Zwischenfälle: laut Polizei, „einige Teilnehmende“ statt Pauschalurteil, stilisiert und als Illustration gekennzeichnet', () => {
	assert.match(seg('inc1'), /^Laut Polizei versuchten einige Teilnehmende, die Polizeikette zu durchbrechen\.$/);
	assert.match(seg('inc2'), /Pyrotechnik und Auseinandersetzungen bei Festnahmen/);
	assert.doesNotMatch(all, /Randalierer|Chaoten|Krawallmacher|alle Demonstr\w* (haben|waren)/i);
	assert.match(INCIDENTS.label, /ILLUSTRATION · keine Originalaufnahme/);
	assert.equal(INCIDENTS.items.length, 3);
	for (const s of ['hätten Teilnehmer versucht, die Polizeikette an der Spitze zu durchbrechen', 'Es ging unter anderem um das Abbrennen von Pyrotechnik.', 'Bei den Festnahmen sei es wiederholt zu Widerstandshandlungen gegen die Polizei und tätliche Angriffe auf Einsatzkräfte gekommen.']) {
		assert.ok(sources.includes(s), `sources.md: „${s}“ fehlt`);
	}
});

test('Bilanz: 20 / 28 / 3 laut Polizei Berlin (Stand Sonntag), 22 nur als frühere Angabe, Festnahme ≠ Verurteilung', () => {
	assert.deepEqual(
		STATS.map((s) => s.value),
		[20, 28, 3],
	);
	assert.equal(STATS_SOURCE, 'dpa / Polizei Berlin, Stand 15.11.2026');
	assert.match(seg('stats'), /^Die Bilanz von Sonntag: 20 vorläufige Festnahmen, 28 Strafanzeigen, drei verletzte Polizisten\.$/);
	assert.match(STATS[0].note, /zuerst: 22/);
	assert.match(STATS[2].note, /keine Angabe/);
	assert.doesNotMatch(all, /\b22\b|\b13 Strafanzeigen|zwei verletzte/);
	assert.deepEqual(CHARGES, ['LANDFRIEDENSBRUCH', 'TÄTLICHER ANGRIFF', 'WIDERSTAND', 'SPRENGSTOFFRECHT']);
	assert.match(seg('charges'), /unter anderem Landfriedensbruch und Widerstand/);
	assert.match(seg('context'), /einzelne Vorfälle, nicht alle Demonstrierenden – und festgenommen heißt nicht verurteilt/);
	assert.equal(CONTEXT.left, 'FESTNAHME');
	assert.equal(CONTEXT.right, 'VERURTEILUNG');
	assert.match(CONTEXT.caveat, /vorläufig/);
	for (const s of ['Es wurden 20 Menschen vorläufig festgenommen, wie eine Polizeisprecherin am Sonntagmorgen sagte.', 'Am Samstag war zunächst von 22 Festnahmen die Rede.', 'Es seien 28 Strafanzeigen aufgrund von Landfriedensbrüchen, tätlichem Angriff, Widerständen und Verstößen gegen Sprengstoffvorschriften gestellt worden.', 'drei Polizisten während er Demonstration verletzt', 'Zu verletzten Teilnehmern machte sie keine Angaben.', 'die Angaben könnten sich daher im Laufe des Tages noch einmal ändern']) {
		assert.ok(sources.includes(s), `sources.md: „${s}“ fehlt`);
	}
});

test('20. November: nur Ankündigungen (GEW Hessen, Veranstalter), kein Verbot; Frage zu Berlin', () => {
	assert.match(seg('ffm'), /weitere Jugendproteste angekündigt – auch in Frankfurt/);
	assert.equal(NEXT.title, 'WEITERE JUGENDPROTESTE ANGEKÜNDIGT');
	assert.deepEqual(
		NEXT.items.map((i) => i.time),
		['10 UHR', '14 UHR', '17:30'],
	);
	assert.match(NEXT.berlin, /laut Veranstaltern/);
	assert.doesNotMatch(JSON.stringify(NEXT) + seg('ffm'), /Verbot|verboten/);
	assert.equal(QUESTION, 'WIE BEWERTET IHR BERLIN?');
	assert.equal(seg('q1'), 'Wie bewertet ihr Berlin?');
	assert.ok(sources.includes('In der Bundeshauptstadt wurden von den Veranstaltern 15.000 Demonstranten angemeldet.'));
});

test('Stimme: Adam kurzformat-60, Ewa → Eywa, Savignyplatz in Lautschrift, Abo-Aufruf, Untertitel nur Anzeige-Schreibweise', () => {
	assert.equal(script.voice.profile, 'kurzformat-60');
	assert.deepEqual(voiceSettingsFor(voice, script), {...voice.elevenlabs.voiceSettings, speed: 1.2});
	assert.equal(voice.elevenlabs.voiceSettings.speed, 1.16);
	assert.equal(seg('hook1'), 'Ewa, Frankfurt!');
	assert.equal(applyAussprache('Ewa, Frankfurt!', ausspracheFor(voice, script.videoId)), '{Ewa|Eywa}, Frankfurt!');
	assert.match(JSON.stringify(script.segments), /\{Savignyplatz\|Sawinjiplatz\}/);
	for (const s of script.segments) assert.doesNotMatch(spoken(s.text), /Dschen-Zett|Gen Z|Gen-Z/, `${s.id}: „Gen Z“ nicht in Lautschrift`);
	const cta = script.segments.at(-1);
	assert.equal(cta.id, 'cta');
	assert.equal(display(cta.text), 'Folgt FrankfurtRed3 für mehr!');
	assert.equal(spoken(cta.text), 'Folgt Frankfurt Rett Drei für mehr!');
	assert.doesNotMatch(JSON.stringify(script), /Plus weg/i);
	assert.ok(!manifest.captions.some((c) => /Eywa|Dschen|Rett|Sawinji/.test(c.text)), 'Untertitel zeigen nur die Anzeige-Schreibweise');
	// mildes Slang nur über die Wortwahl (2–3 Ausdrücke)
	const slang = (all.match(/gab's|Leute|Krass/g) ?? []).length;
	assert.ok(slang >= 2 && slang <= 4, `Slang ${slang}`);
	if (isAdam) assert.equal((manifest as unknown as {voice: {voiceId: string}}).voice.voiceId, 'pNInz6obpgDQGcFmaJgB');
});

test('Länge: hartes Limit 60,0 s inkl. Abo-Aufruf (keine Ausnahme), Pausen ≤ 400 ms, Untertitel im Satz', () => {
	assert.equal(cfg.maxSeconds, 60);
	assert.equal(cfg.ausnahme, undefined);
	assert.equal(cfg.outputName, 'FrankfurtRed3_GenZPhase2_15November_ADAM_FINAL');
	assert.equal(cfg.thumbnailName, 'FrankfurtRed3_GenZPhase2_THUMBNAIL');
	assert.equal(script.maxDurationMs, 60000);
	const tl = erklaertTimelineFor(PHASE2_SCENES, script, manifest, 30, cfg.maxSeconds);
	assert.ok(tl.durationInFrames <= FORMAT.maxFrames, `${tl.durationInFrames} Frames`);
	if (isAdam) {
		const segs = manifest.segments;
		const end = Math.max(...segs.map((s) => s.endMs));
		assert.ok(end >= 55000 && end <= 59400, `Sprechzeit ${end} ms`);
		assert.ok((tl.durationInFrames / 30) * 1000 - end >= 300, 'Ausklang ≥ 0,3 s nach der Stimme');
		for (let i = 1; i < segs.length; i++) assert.ok(segs[i].startMs - segs[i - 1].endMs <= 400, `Pause vor ${segs[i].id}`);
		for (const c of manifest.captions) {
			const s = segs.find((x) => c.startMs >= x.startMs - 1 && c.startMs < x.endMs);
			assert.ok(s && c.endMs <= s.endMs + 1, `Untertitel „${c.text}“ außerhalb seines Satzes`);
		}
	}
});

test('Offizielles Logo: zentrale Datei, im Abo-Aufruf, im Titelbild und im Prüfbogen – kein „S“ als Ersatz', () => {
	assert.equal(BRAND.logoFile, 'brand/frankfurtred-logo.webp');
	assert.equal(BRAND.handle, 'frankfurtred3');
	const file = new URL(`../public/${BRAND.logoFile}`, import.meta.url);
	const head = readFileSync(file).subarray(0, 30);
	assert.equal(head.subarray(0, 4).toString(), 'RIFF');
	assert.equal(head.subarray(8, 12).toString(), 'WEBP');
	assert.ok(statSync(file).size < 200 * 1024);
	assert.match(scenesSrc, /<BrandLogo size=\{230\}/);
	assert.match(scenesSrc, /<BrandLogo size=\{52\} \/>/);
	assert.doesNotMatch(scenesSrc, /BrandAvatar/);
	assert.match(read(`${dir}FrankfurtErklaertGenZPhase2CoverVorschau.tsx`), /avatar=\{\(s\) => <BrandLogo/);
	assert.doesNotMatch(scenesSrc, /handle: ['"]|@frankfurtred3/);
});

test('Titelbild: Kernzone, 3:4-Ausschnitt, Untertitel-Band im Video frei, rote Karte vor den App-Knöpfen', () => {
	const tops = [L.brandTop, L.mapTop, L.cardTop, L.bigTop, L.cityLineTop, L.metaTop];
	for (const y of tops) assert.ok(y >= COVER_ZONE.coreTop && y <= COVER_ZONE.coreBottom, `y=${y}`);
	assert.ok(L.brandTop >= 390, 'Serientitel nicht zu hoch');
	assert.ok(L.mapBottom <= L.cardTop && L.bigBottom <= L.cityLineTop + 10 && L.metaBottom <= COVER_ZONE.videoBottom);
	assert.ok(L.chipsTop >= COVER_ZONE.videoBottom && L.chipsBottom <= COVER_ZONE.coreBottom);
	assert.ok(540 + L.cardMaxWidth / 2 <= COVER_ZONE.rightButtonsX - 10);
	assert.ok(L.sideMin >= COVER_ZONE.side);
	assert.equal(COVER.kicker, 'GEN Z REGELT – PHASE 2');
	assert.equal(COVER.big, '20');
	assert.deepEqual([...COVER.bigLines], ['VORLÄUFIGE', 'FESTNAHMEN', 'IN BERLIN']);
});

test('TikTok-Text: Titel, Caption ≤ 4.000 Zeichen, genau 5 Hashtags, Quellen, Frage am Ende, keine Zuspitzung', () => {
	assert.match(tiktok, /## Titel\s+GEN Z PHASE 2 – 20 FESTNAHMEN IN BERLIN! 🚨/);
	const caption = (tiktok.split('## Caption')[1] ?? '').trim();
	assert.ok(caption.length >= 3400 && caption.length <= 4000, `Caption ${caption.length}`);
	assert.equal((caption.match(/#[\wäöüÄÖÜß]+/g) ?? []).length, 5);
	for (const s of ['vorläufig', 'Stand', 'Polizei Berlin', 'dpa', 'rbb24', 'SWR', 'Düsseldorf', 'nicht verurteilt', '20. November']) assert.ok(caption.includes(s), `Caption: ${s}`);
	assert.match(caption, /\?\s*\n\s*#/);
	assert.doesNotMatch(caption, /Randalierer|Chaoten|1\.400|vorzeitig aufgelöst|alle Demonstrierenden waren/i);
});
