/**
 * „4 Proteste – 1 Freitag“ (FrankfurtErklaert20NovemberDreiProteste, #09): vier getrennte Versammlungen laut Stadt (10:00 · 11:00 · 14:00 · 17:30),
 * Orte/Zahlen nur mit Urheber, Bockenheimer DEPOT (nicht Warte), Route 17:30 offen, keine Routen/gemeinsamen Veranstalter, Batman-Gag auf belegter
 * Grundlage, Längen-Ausnahme (Info ≤ 61,5 s + Abo-Aufruf, ≤ 64 s), Serien-Overlay oben rechts unter der TikTok-Suchleiste, Titelbild nach COVER_ZONE.
 */
import assert from 'node:assert/strict';
import {readdirSync, readFileSync} from 'node:fs';
import {test} from 'node:test';
import {applyAussprache, ausspracheFor, voiceSettingsFor} from '../scripts/lib/aussprache.mjs';
import {COVER_ZONE, FORMAT, LAYOUT} from '../src/formats/frankfurt-erklaert/theme.ts';
import {erklaertTimelineFor} from '../src/formats/frankfurt-erklaert/timeline.ts';
import {dayTimelineGeometry, dayTimelineX} from '../src/formats/frankfurt-erklaert/visuals/day-timeline-geometry.ts';
import {type VoiceoverManifest} from '../src/lib/script-timing.ts';
import {COVER, DEMANDS, EVENTS, GENZ, GEWERK, SCHUL, SOURCES, STAND} from '../src/videos/frankfurt-erklaert-20nov-drei-proteste/content.ts';
import {NOV20_COVER_LAYOUT as L} from '../src/videos/frankfurt-erklaert-20nov-drei-proteste/cover-layout.ts';
import {NOV20_KEYWORDS, NOV20_SCENES} from '../src/videos/frankfurt-erklaert-20nov-drei-proteste/plan.ts';

const dir = '../src/videos/frankfurt-erklaert-20nov-drei-proteste/';
const ref = '../references/frankfurt-erklaert-20nov-drei-proteste/';
const read = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8');
const script = JSON.parse(read(`${dir}script.json`));
const manifest: VoiceoverManifest = JSON.parse(read(`${dir}voiceover.json`));
const videos = JSON.parse(read('../config/videos.json'));
const voice = {...JSON.parse(read('../config/voice.json')), ...JSON.parse(read('../config/voice-regeln.json'))};
const sources = read(`${ref}sources.md`);
const tiktok = read(`${ref}tiktok-text.md`);
const scenesSrc = read(`${dir}scenes/Scenes.tsx`);
const illuSrc = read(`${dir}visuals/Illustrations.tsx`);
const compSrc = read(`${dir}FrankfurtErklaert20NovemberDreiProteste.tsx`);
const display = (t: string) => t.replace(/\{([^|}]*)\|[^}]*\}/g, '$1');
const spoken = (t: string) => t.replace(/\{[^|}]*\|([^}]*)\}/g, '$1');
const seg = (id: string) => display(script.segments.find((s: {id: string}) => s.id === id).text);
const all = script.segments.map((s: {text: string}) => display(s.text)).join(' ');
const isAdam = String(manifest.source).startsWith('elevenlabs');
const cfg = videos.FrankfurtErklaert20NovemberDreiProteste;
const flat = (s: string) => s.replace(/\s+/g, ' ');

test('Dramaturgie: Titelbild → Schulstreik (10/11 Uhr) → Gewerkschaftsjugend (17:30) → Gen Z (14 Uhr, längster Teil) → Auflagen → Batman-Gag → Abo-Aufruf', () => {
	assert.deepEqual(
		NOV20_SCENES.map((s) => s.id),
		['cover', 'schulstreik', 'gewerkschaft', 'genz', 'demands', 'rules', 'batman', 'outro'],
	);
	for (const s of NOV20_SCENES) assert.ok(NOV20_KEYWORDS[s.id]?.length, `Schlüsselwörter für ${s.id}`);
	for (const s of NOV20_SCENES.slice(1)) assert.ok((s.transitionInFrames ?? 0) <= 10);
	assert.match(STAND, /17\.11\.2026/);
	for (const s of SOURCES) assert.ok(sources.includes(s.url), `sources.md: ${s.url}`);
	if (isAdam) {
		const dur = (ids: string[]) => ids.reduce((sum, id) => {
			const s = manifest.segments.find((x) => x.id === id)!;
			return sum + s.endMs - s.startMs;
		}, 0);
		const genz = dur(['z1', 'z2', 'z3', 'z4']);
		assert.ok(genz > dur(['s1', 's2']) && genz > dur(['g1', 'g2']), 'Gen-Z-Teil ist der längste');
	}
});

test('Vier getrennte Versammlungen laut Stadt, chronologisch – Titel „4 PROTESTE“, kein gemeinsamer Zug/Veranstalter', () => {
	assert.match(seg('hook2'), /laut Stadt sind vier getrennte Versammlungen angemeldet!$/);
	assert.deepEqual(
		EVENTS.map((e) => e.time),
		['10:00', '11:00', '14:00', '17:30'],
	);
	assert.deepEqual(
		EVENTS.map((e) => e.place),
		['WILLY-BRANDT-PLATZ', 'CAMPUS WESTEND', 'WESELER WERFT', 'BOCKENHEIMER DEPOT'],
	);
	assert.equal(COVER.big, '4 PROTESTE');
	assert.equal(COVER.big2, '1 FREITAG');
	assert.doesNotMatch(all + JSON.stringify(COVER), /drei Proteste|3 PROTESTE|unterschiedliche Organisatoren|gemeinsam(e|er)? (Zug|Route|Demo)/i);
	assert.doesNotMatch(scenesSrc + illuSrc, /polyline|RouteLine|routePath/);
	assert.ok(flat(sources).includes('Die Stadt Frankfurt hat für den 20. November insgesamt vier Versammlungen registriert'));
});

test('Schulstreik 10 Uhr und kleiner Zug 11 Uhr: Zahlen laut Stadt, Themen „laut Aufruf“', () => {
	assert.match(seg('s1'), /^Um 10 startet am Willy-Brandt-Platz der Schulstreik gegen die Wehrpflicht – laut Aufruf auch gegen Krieg und Sozialkürzungen\.$/);
	assert.match(seg('s2'), /Bis zu 1\.200 sind angemeldet, Ziel ist der Campus Westend – dort startet ab 11 noch ein kleiner Zug mit 75 Leuten\./);
	assert.equal(SCHUL.count, 1200);
	assert.equal(SCHUL.small.count, 75);
	assert.match(SCHUL.small.by, /Internationaler Jugendverband/);
	assert.match(SCHUL.source, /Stadt Frankfurt laut t-online/);
	for (const s of ['Die ver.di-Jugend Frankfurt und Region will von 10 bis 15 Uhr mit bis zu 1.200 Menschen vom Willy-Brandt-Platz zum Café Koz am Campus Westend ziehen.', 'Angemeldet sind 75 Teilnehmer.', 'Jugendliche streiken gegen Sozialkürzungen Wehrpflicht und Krieg.']) {
		assert.ok(flat(sources).includes(s), `sources.md: „${s}“ fehlt`);
	}
});

test('Gewerkschaftsjugend 17:30: Bockenheimer DEPOT (nicht Warte), Motto laut Stadt, Route offen', () => {
	assert.match(seg('g1'), /^Um 17:30 Uhr folgt die Gewerkschaftsjugend am Bockenheimer Depot/);
	assert.equal(seg('g2'), 'Die Route prüft die Stadt noch.');
	assert.doesNotMatch(all + scenesSrc + JSON.stringify(EVENTS), /Bockenheimer Warte/);
	assert.equal(GEWERK.motto, '„Frankfurt gegen Wehrpflicht, Krieg und soziale Kürzungen“');
	assert.match(GEWERK.route, /WIRD NOCH GEPRÜFT/);
	assert.match(scenesSrc, /<Chip kind="OFFEN"/);
	for (const s of ['Die Route wird nach Angaben der Stadt noch von den Sicherheitsbehörden geprüft.', '17.30 Uhr am Bockenheimer Depot: Kundgebung der Gewerkschaftsjugend']) assert.ok(flat(sources).includes(s), s);
});

test('Gen Z regelt: Weseler Werft laut Stadt, stationär statt Demozug, bis 16:30, bis zu 4.000 erwartet; Website „Standort folgt“; kein Verbot', () => {
	assert.equal(seg('z1'), 'Und dann 14 Uhr: Gen Z regelt.');
	assert.match(seg('z2'), /^Statt Demozug gibt's laut Stadt eine Kundgebung an der Weseler Werft bis 16:30 Uhr – erwartet werden bis zu 4\.000\.$/);
	assert.match(GENZ.website, /Standort folgt/);
	assert.match(scenesSrc, /Lage schematisch/);
	assert.match(scenesSrc, /„Standort folgt“/);
	assert.doesNotMatch(all + JSON.stringify(GENZ), /verboten wird|Verbot beschlossen|Demo verboten/i);
	assert.deepEqual(
		DEMANDS.map((d) => d.title),
		['BILDUNG', 'GESUNDHEIT', 'BEZAHLBARES LEBEN', 'GEGEN WEHRPFLICHT'],
	);
	assert.match(seg('z3'), /^Die Initiative will/);
	assert.equal(seg('z4'), 'Für alle vier gilt: keine Pyro, kein Alkohol, keine Vermummung.');
	for (const s of ['Die Kundgebung soll von 14 bis 16.30 Uhr auf der Weseler Werft stattfinden.', 'In Abstimmung mit der Anmelderin gebe es nun eine stationäre Kundgebung.', 'Erwartet werden bis zu 4.000 Menschen.', 'Zudem gilt ein Vermummungsverbot.', 'Die Kürzungen gehen auf unseren Rücken', 'Frankfurt am Main | Platz 1 | Standort folgt']) {
		assert.ok(flat(sources).includes(s), `sources.md: „${s}“ fehlt`);
	}
	// Zitate in den Forderungskarten stehen wörtlich auf der Website
	for (const d of DEMANDS) for (const q of d.sub.match(/„([^“]+)“/g) ?? []) assert.ok(sources.includes(q.slice(1, -1)), q);
});

test('Batman-Gag: belegte Grundlage (Reuters/heute.at), als GAG/ILLUSTRATION gekennzeichnet, kein Logo, keine Person/Accounts, kein Türklopfen', () => {
	assert.match(seg('b1'), /^Ob Batman am 20\. dabei ist, wissen wir leider immer noch nicht\.$/);
	assert.match(seg('b2'), /an Halloween hat ihn die Polizei ja schon mitgenommen/);
	assert.doesNotMatch(all, /Tür|geklopft|klopf/i);
	assert.match(scenesSrc, /<Chip kind="GAG"/);
	assert.match(scenesSrc, /abgeführt ≠ schuldig/);
	assert.doesNotMatch(scenesSrc + illuSrc + all, /ichbinyounes|Younes|bat-?logo|batsignal/i);
	assert.match(illuSrc, /KEIN Fledermaus-Logo/);
	assert.ok(sources.includes('Police detain a demonstrator dressed as Batman during a nationwide protest by campaign group Gen Z regelt (Reuters)'));
	assert.ok(sources.includes('"Gen Z regelt"? Am Ende wird sogar Batman abgeführt'));
	assert.match(sources, /„Batman hat an der Tür geklopft“\*\* \(Auftrag\): kein Beleg/);
});

test('Stimme: Adam kurzformat-60, Ewa → Eywa, „Gen Z regelt“ getrennt gesprochen, Abo-Aufruf, Untertitel nur Anzeige-Schreibweise', () => {
	assert.equal(script.voice.profile, 'kurzformat-60');
	assert.deepEqual(voiceSettingsFor(voice, script), {...voice.elevenlabs.voiceSettings, speed: 1.2});
	assert.equal(voice.elevenlabs.voiceSettings.speed, 1.16);
	assert.equal(seg('hook1'), 'Ewa, Frankfurt!');
	assert.equal(applyAussprache('Ewa, Frankfurt!', ausspracheFor(voice, script.videoId)), '{Ewa|Eywa}, Frankfurt!');
	for (const s of script.segments) assert.doesNotMatch(spoken(s.text), /Gen Z|Gen-Z/, `${s.id}: „Gen Z“ nur in Lautschrift`);
	assert.doesNotMatch(all, /(zwei|der) Gen Z/i);
	const cta = script.segments.at(-1);
	assert.equal(cta.id, 'cta');
	assert.equal(display(cta.text), 'Folgt FrankfurtRed3 für mehr!');
	assert.equal(spoken(cta.text), 'Folgt Frankfurt Rett Drei für mehr!');
	assert.ok(!manifest.captions.some((c) => /Eywa|Dschen|Rett|zwölfhundert|viertausend/.test(c.text)), 'Untertitel zeigen nur die Anzeige-Schreibweise');
	const slang = (all.match(/gibt's|Pyro|Leuten/g) ?? []).length;
	assert.ok(slang >= 2 && slang <= 4, `Slang ${slang}`);
	if (isAdam) assert.equal((manifest as unknown as {voice: {voiceId: string}}).voice.voiceId, 'pNInz6obpgDQGcFmaJgB');
});

test('Länge: Informationsteil ≤ 61,5 s, Abo-Aufruf als letztes Segment, gesamt ≤ 64 s; Pausen ≤ 400 ms; Untertitel im Satz', () => {
	assert.equal(cfg.maxSeconds, 64);
	assert.equal(cfg.infoMaxSeconds, FORMAT.infoMaxSeconds);
	assert.ok(cfg.ausnahme.length > 20);
	assert.equal(cfg.outputName, 'FrankfurtRed3_20November_3Proteste_ADAM_FINAL');
	assert.equal(cfg.thumbnailName, 'FrankfurtRed3_20November_3Proteste_THUMBNAIL');
	const tl = erklaertTimelineFor(NOV20_SCENES, script, manifest, 30, cfg.maxSeconds);
	assert.ok(tl.durationInFrames <= 64 * 30, `${tl.durationInFrames} Frames`);
	if (isAdam) {
		const segs = manifest.segments;
		const infoEnd = Math.max(...segs.filter((s) => s.id !== 'cta').map((s) => s.endMs));
		const cta = segs.find((s) => s.id === 'cta')!;
		assert.ok(infoEnd >= 50000 && infoEnd <= cfg.infoMaxSeconds * 1000, `Informationsteil ${infoEnd} ms`);
		const ctaPart = (tl.durationInFrames / 30) * 1000 - cta.startMs;
		assert.ok(ctaPart >= 3000 && ctaPart <= 4200, `Abo-Aufruf ${ctaPart} ms`);
		for (let i = 1; i < segs.length; i++) assert.ok(segs[i].startMs - segs[i - 1].endMs <= 400, `Pause vor ${segs[i].id}`);
		for (const c of manifest.captions) {
			const s = segs.find((x) => c.startMs >= x.startMs - 1 && c.startMs < x.endMs);
			assert.ok(s && c.endMs <= s.endMs + 1, `Untertitel „${c.text}“ außerhalb seines Satzes`);
		}
	}
});

test('Serien-Overlay ab #09 oben rechts unter der TikTok-Suchleiste; fertige Folgen unverändert oben links', () => {
	assert.match(compSrc, /badgePlacement: 'top-right'/);
	assert.match(compSrc, /episode: '#09'/);
	// unter der Suchleiste (≈ y 90–238), Abstand rechts 40–70 px, Oberkante 300–360
	assert.ok(LAYOUT.badgeTopRight >= 300 && LAYOUT.badgeTopRight <= 360, `${LAYOUT.badgeTopRight}`);
	assert.ok(LAYOUT.badgeRightInset >= 40 && LAYOUT.badgeRightInset <= 70);
	assert.equal(LAYOUT.badgeTop, 196, 'Position der fertigen Folgen unverändert');
	const overlay = read('../src/formats/frankfurt-erklaert/OverlayCheck.tsx');
	const zone = /TIKTOK_SEARCH_ZONE = \{top: (\d+), bottom: (\d+)\}/.exec(overlay)!;
	assert.ok(LAYOUT.badgeTopRight >= Number(zone[2]) + 40, 'mindestens 40 px unter der Suchleiste');
	assert.match(read('../src/formats/frankfurt-erklaert/Branding.tsx'), /placement = 'top-left'/);
	for (const d of readdirSync(new URL('../src/videos/', import.meta.url))) {
		if (!d.startsWith('frankfurt-erklaert') || d === 'frankfurt-erklaert-20nov-drei-proteste') continue;
		for (const f of readdirSync(new URL(`../src/videos/${d}/`, import.meta.url)).filter((x) => x.endsWith('.tsx'))) {
			assert.doesNotMatch(read(`../src/videos/${d}/${f}`), /badgePlacement/, `${d}/${f} bleibt unverändert`);
		}
	}
	// Orientierungsleiste beginnt unter dem Overlay (Overlay ≈ 66 px hoch)
	assert.match(scenesSrc, /export const STRIP_TOP = (\d+);/);
	const stripTop = Number(/export const STRIP_TOP = (\d+);/.exec(scenesSrc)![1]);
	assert.ok(stripTop - 10 >= LAYOUT.badgeTopRight + 66 + 10, `Leiste ${stripTop}`);
	assert.match(read('../src/Root.tsx'), /id="FrankfurtErklaert20NovemberDreiProteste-OverlayCheck"/);
});

test('Offizielles Logo im Abo-Aufruf, Titelbild und Prüfbogen – kein „S“', () => {
	assert.match(scenesSrc, /<BrandLogo size=\{250\}/);
	assert.match(scenesSrc, /<BrandLogo size=\{52\} \/>/);
	assert.doesNotMatch(scenesSrc, /BrandAvatar/);
	assert.match(read(`${dir}FrankfurtErklaert20NovemberDreiProtesteCoverVorschau.tsx`), /avatar=\{\(s\) => <BrandLogo/);
	assert.doesNotMatch(scenesSrc, /@frankfurtred3/);
});

test('Titelbild: Kernzone, 3:4-Ausschnitt, Timeline vor den App-Knöpfen und über y 1000, Untertitel-Band im Video frei', () => {
	const tops = [L.brandTop, L.big1Top, L.big2Top, L.timelineTop, L.smallTop, L.chipTop, L.metaTop];
	for (const y of tops) assert.ok(y >= COVER_ZONE.coreTop && y <= COVER_ZONE.coreBottom, `y=${y}`);
	assert.ok(L.brandTop >= 390, 'Serientitel nicht zu hoch');
	assert.ok(L.brandBottom <= L.big1Top && L.bigBottom <= L.timelineTop);
	const g = dayTimelineGeometry('full', L.timelineOrb);
	assert.ok(L.timelineTop + g.height <= L.timelineBottom, `Timeline endet bei ${L.timelineTop + g.height}`);
	assert.ok(L.timelineBottom <= COVER_ZONE.rightButtonsTop, 'Timeline über den App-Knöpfen');
	assert.ok(L.timelineLeft + dayTimelineX(EVENTS.length - 1, EVENTS.length, L.timelineWidth) + 120 <= 1080 - L.sideMin + 30);
	assert.ok(L.timelineLeft >= COVER_ZONE.side && L.timelineLeft + L.timelineWidth <= COVER_ZONE.rightButtonsX);
	assert.ok(L.timelineBottom <= L.smallTop && L.smallBottom <= L.chipTop && L.chipBottom <= L.metaTop);
	assert.ok(L.metaBottom <= COVER_ZONE.videoBottom);
	assert.ok(L.questionTop >= COVER_ZONE.videoBottom && L.questionBottom <= COVER_ZONE.coreBottom);
	assert.ok(L.bigMaxWidth <= 1080 - 2 * COVER_ZONE.side);
	assert.ok(L.sideMin >= COVER_ZONE.side);
	assert.ok(L.bigSize >= 58 * 2);
	assert.equal(COVER.small, 'FRANKFURT · FREITAG, 20.11.2026');
});

test('TikTok-Text: Titel, Caption ≤ 4.000 Zeichen, genau die 5 vorgegebenen Hashtags, vier Versammlungen, Quellen, Frage am Ende', () => {
	assert.match(tiktok, /## Titel\s+4 PROTESTE AN EINEM FREITAG – WAS PASSIERT AM 20\.11\. IN FRANKFURT\? 🚨/);
	const caption = (tiktok.split('## Caption')[1] ?? '').trim();
	assert.ok(caption.length >= 2000 && caption.length <= 4000, `Caption ${caption.length}`);
	assert.deepEqual(caption.match(/#[\wäöüÄÖÜß]+/g), ['#Frankfurt', '#FrankfurtAmMain', '#GenZRegelt', '#20112026', '#FYP']);
	for (const s of ['vier', 'Willy-Brandt-Platz', 'Campus Westend', 'Weseler Werft', 'Bockenheimer Depot', '4.000', '1.200', '75', '500', 'Route', 'Standort folgt', 'Pressekonferenz', 't-online', 'GEW', 'Stand: 17.11.2026']) {
		assert.ok(caption.includes(s), `Caption: ${s}`);
	}
	assert.match(caption, /\?\s*\n\s*#/);
	assert.doesNotMatch(caption, /Indymedia|verboten wird|Tür geklopft|ichbinyounes/i);
});
