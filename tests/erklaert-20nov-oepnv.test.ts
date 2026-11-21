/**
 * „Frankfurt morgen: Diese Bahnen sind betroffen!“ (FrankfurtErklaert20NovemberOepnv, #11, produziert 19.11.2026 für Freitag, 20.11.2026):
 * aktualisierte VGF-Meldung (19.11., 9 Uhr) wörtlich belegt: 11/12/14 ab 8:30 Uhr nicht über die Altstadtstrecke, zwischen Börneplatz und Hbf
 * kein Tram-Betrieb, Umleitung über Sachsenhausen (Verlauf nur schematisch) – KEIN Komplettausfall behauptet,
 * 18/30/M36 nur „möglicherweise“, U-Bahn nach bisherigem Stand nach Fahrplan, U4/U5 bedienen beide Hbf – Willy-Brandt-Platz – Dom/Römer –
 * Konstablerwache (OSM), Hinweis Wochenende (DTC) nicht für Freitag, fünf Veranstaltungen (Ordnungsamt) als Hintergrund, keine erfundenen Wege,
 * Abfahrtszeiten oder Live-Daten, hartes Limit 60 s, Kopfzeile oben rechts, Titelbild nach COVER_ZONE.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {applyAussprache, ausspracheFor, voiceSettingsFor} from '../scripts/lib/aussprache.mjs';
import {COVER_ZONE, FORMAT, LAYOUT} from '../src/formats/frankfurt-erklaert/theme.ts';
import {erklaertTimelineFor} from '../src/formats/frankfurt-erklaert/timeline.ts';
import {type VoiceoverManifest} from '../src/lib/script-timing.ts';
import {COVER, MAP, SOURCES, STAND, TRAM, UBAHN, VGF_QUOTES, WEEKEND, WHY} from '../src/videos/frankfurt-erklaert-20nov-oepnv/content.ts';
import {OEPNV_COVER_LAYOUT as L} from '../src/videos/frankfurt-erklaert-20nov-oepnv/cover-layout.ts';
import {OEPNV_KEYWORDS, OEPNV_SCENES} from '../src/videos/frankfurt-erklaert-20nov-oepnv/plan.ts';

const dir = '../src/videos/frankfurt-erklaert-20nov-oepnv/';
const ref = '../references/frankfurt-erklaert-20nov-oepnv/';
const read = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8');
const script = JSON.parse(read(`${dir}script.json`));
const manifest: VoiceoverManifest = JSON.parse(read(`${dir}voiceover.json`));
const videos = JSON.parse(read('../config/videos.json'));
const voice = {...JSON.parse(read('../config/voice.json')), ...JSON.parse(read('../config/voice-regeln.json'))};
const sources = read(`${ref}sources.md`);
const tiktok = read(`${ref}tiktok-text.md`);
const scenesSrc = read(`${dir}scenes/Scenes.tsx`);
const transitSrc = read(`${dir}visuals/Transit.tsx`);
const compSrc = read(`${dir}FrankfurtErklaert20NovemberOepnv.tsx`);
const map = JSON.parse(read('../src/data/maps/frankfurt-altstadt-oepnv.json'));
const routes = JSON.parse(read('../src/data/maps/frankfurt-altstadt-oepnv.routes.json'));
const display = (t: string) => t.replace(/\{([^|}]*)\|[^}]*\}/g, '$1');
const spoken = (t: string) => t.replace(/\{[^|}]*\|([^}]*)\}/g, '$1');
const seg = (id: string) => display(script.segments.find((s: {id: string}) => s.id === id).text);
const all = script.segments.map((s: {text: string}) => display(s.text)).join(' ');
const isAdam = String(manifest.source).startsWith('elevenlabs');
const cfg = videos.FrankfurtErklaert20NovemberOepnv;

test('Dramaturgie: Titelbild → Uhr + 11/12/14 → Karte (Altstadtstrecke, 18/30/M36) → U-Bahn → Hintergrund → Vor der Fahrt checken → Abo-Aufruf', () => {
	assert.deepEqual(
		OEPNV_SCENES.map((s) => s.id),
		['cover', 'tram', 'map', 'ubahn', 'why', 'check', 'outro'],
	);
	assert.deepEqual(
		script.segments.map((s: {id: string}) => s.id),
		['hook1', 'hook2', 't1', 't2', 'm1', 'u1', 'u2', 'u3', 'w1', 'c1', 'q1', 'cta'],
	);
	const used = OEPNV_SCENES.flatMap((s) => s.segmentIds);
	assert.deepEqual(used, script.segments.map((s: {id: string}) => s.id), 'jeder Satz genau einer Szene zugeordnet');
	for (const s of OEPNV_SCENES) assert.ok(OEPNV_KEYWORDS[s.id]?.length, `Schlüsselwörter für ${s.id}`);
	for (const s of OEPNV_SCENES.slice(1)) assert.ok((s.transitionInFrames ?? 0) <= 10);
	assert.match(STAND, /VGF, 19\.11\.2026, 9 Uhr/);
	for (const s of SOURCES) assert.ok(sources.includes(s.url), `sources.md: ${s.url}`);
	// keine Wiederholung früherer Folgen: keine Polizei-/Aufenthaltsverbot-/Halloween-/Batman-Inhalte
	assert.doesNotMatch(all, /Polizei|Aufenthaltsverbot|Meldeauflage|Halloween|Batman|Weseler Werft|Pyro/);
});

test('VGF-Meldung wörtlich belegt: aktualisierter Stand 19.11., 9 Uhr (zuerst 18.11., 14 Uhr) – am 19.11. geprüft', () => {
	for (const q of Object.values(VGF_QUOTES)) assert.ok(sources.includes(q), `Wortlaut in sources.md: ${q}`);
	assert.match(sources, /Zum jetzigen Zeitpunkt, 19\. November 2026, 9 Uhr/);
	assert.match(sources, /Zum jetzigen Zeitpunkt, 18\. November 2026, 14 Uhr/, 'erste Fassung dokumentiert');
	assert.match(sources, /## Aktualitätscheck 19\.11\.2026/);
	for (let i = 1; i <= 8; i++) assert.match(sources, new RegExp(`\\| ${i} \\|`), `Prüffrage ${i} beantwortet`);
});

test('Straßenbahn 11/12/14: ab 8:30 Uhr nicht über die Altstadtstrecke, Umleitung über Sachsenhausen – kein Komplettausfall, keine erfundene Endzeit', () => {
	assert.match(seg('t1'), /^Laut VGF fahren die Linien 11, 12 und 14 ab 8:30 Uhr nicht über die Altstadtstrecke\.$/);
	assert.match(seg('t2'), /^Von einem Komplettausfall ist keine Rede – es geht um die Strecke durch die Altstadt\.$/);
	assert.ok(sources.includes(VGF_QUOTES.detour), 'Umleitung über Sachsenhausen wörtlich belegt');
	assert.match(scenesSrc, /MAPTXT\.detour/);
	assert.match(seg('hook2'), /ab 8:30 Uhr/);
	assert.doesNotMatch(all, /ab 9 Uhr/, 'alter Stand (9 Uhr) nicht mehr im Ton');
	assert.deepEqual(TRAM.lines, ['11', '12', '14']);
	assert.equal(TRAM.time, '08:30');
	assert.match(MAP.detour, /UMLEITUNG ÜBER SACHSENHAUSEN/);
	assert.doesNotMatch(all, /fallen (komplett|ganz|ganztägig) aus|eingestellt|gesperrt bis|bis \d+ Uhr/i, 'kein Komplettausfall, keine Endzeit');
	assert.doesNotMatch(scenesSrc, /ALLE LINIEN KOMPLETT|KOMPLETT EINGESTELLT/);
	assert.match(MAP.noDetour, /nicht veröffentlicht/);
	assert.match(scenesSrc, /Umleitungsweg nicht veröffentlicht – Bogen schematisch/);
	// Altstadtstrecke = Strecke der Linien 11/12/14 zwischen Willy-Brandt-Platz und Börneplatz (OSM-Halte dazwischen)
	for (const l of ['11', '12', '14']) {
		for (const s of ['Willy-Brandt-Platz', 'Karmeliterkloster', 'Römer/Paulskirche', 'Börneplatz']) assert.ok(routes.routes[l].stops.includes(s), `${l} hält an ${s}`);
	}
});

test('Karte: gesperrter Abschnitt (Hbf–Börneplatz) enthält die Altstadt-Halte, aber nicht Hauptbahnhof/Konstablerwache; OSM-Hinweis sichtbar', () => {
	// Polygon aus dem Quelltext (Szenen sind .tsx und hier nicht ladbar), Projektion wie die Karte (Mittelpunkt + Meter pro Grad)
	const poly: [number, number][] = [...scenesSrc.split('export const ALTSTADT_CLIP')[1].split('];')[0].matchAll(/\[([\d.]+), ([\d.]+)\]/g)].map((m) => [Number(m[1]), Number(m[2])]);
	const projectLatLon = (_m: unknown, [lat, lon]: [number, number]) => [(lon - map.meta.center.lon) * map.meta.metersPerDegree.x, -(lat - map.meta.center.lat) * map.meta.metersPerDegree.y];
	assert.equal(poly.length, 12);
	const pts = poly.map((ll) => projectLatLon(map, ll));
	const inside = (x: number, y: number) => {
		let c = false;
		for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
			const [xi, yi] = pts[i];
			const [xj, yj] = pts[j];
			if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
		}
		return c;
	};
	for (const s of ['Karmeliterkloster', 'Römer/Paulskirche', 'Willy-Brandt-Platz', 'Weserstraße/Münchener Straße']) assert.ok(inside(routes.stops[s].x, routes.stops[s].y), `${s} im gesperrten Abschnitt`);
	for (const s of ['Hauptbahnhof', 'Konstablerwache', 'Hauptbahnhof/Münchener Straße', 'Börneplatz/Stoltzestraße']) assert.ok(!inside(routes.stops[s].x, routes.stops[s].y), `${s} NICHT im Altstadt-Ausschnitt`);
	assert.equal(map.meta.attribution, '© OpenStreetMap-Mitwirkende');
	assert.match(MAP.source, /© OpenStreetMap-Mitwirkende/);
	assert.match(scenesSrc, /kind="SCHEMATISCH"/);
});

test('18 · 30 · M36 nur „möglicherweise“ (Kurt-Schumacher-/Konrad-Adenauer-Straße) – keine bestätigte Sperrung', () => {
	assert.match(seg('m1'), /^Möglicherweise trifft's auch die 18 und die Busse 30 und M36 – auf der Kurt-Schumacher- und Konrad-Adenauer-Straße\.$/);
	assert.deepEqual(MAP.maybeLines.map((l) => l.ref), ['18', '30', 'M36']);
	assert.match(MAP.maybeNote, /möglicherweise/);
	assert.match(scenesSrc, /kind="MÖGLICH"/);
	assert.match(scenesSrc, /maybe glow/);
	assert.doesNotMatch(all, /(18|30|M36)[^.]*(gesperrt|fällt aus|fallen aus)/);
	for (const l of ['18', '30', 'M36']) assert.ok(routes.routes[l].stops.includes('Konstablerwache'), `${l} über Konstablerwache`);
	for (const st of MAP.maybeStreets) assert.ok(map.streets[st], `Straße ${st} in der Karte`);
});

test('U-Bahn: nach bisherigem Stand nach Fahrplan; U4 und U5 bedienen beide Hbf – Willy-Brandt-Platz – Dom/Römer – Konstablerwache; Stationen offen', () => {
	assert.match(seg('u1'), /U1 bis U5 und U8 sollen nach bisherigem Stand nach Fahrplan fahren/);
	assert.deepEqual(UBAHN.planned, ['U1', 'U2', 'U3', 'U4', 'U5', 'U8']);
	assert.match(seg('u2'), /^Willy-Brandt-Platz und Dom\/Römer bleiben offen – U4 und U5 nennt die VGF als Alternative zwischen Hauptbahnhof und Konstablerwache\.$/);
	for (const l of ['U4', 'U5']) {
		for (const s of ['Hauptbahnhof', 'Willy-Brandt-Platz', 'Dom/Römer', 'Konstablerwache']) assert.ok(routes.routes[l].stops.includes(s), `${l} hält an ${s}`);
	}
	assert.deepEqual(UBAHN.stations.filter((s) => s.open).map((s) => s.name), ['WILLY-BRANDT-PLATZ', 'DOM/RÖMER', 'KONSTABLERWACHE']);
	assert.match(UBAHN.alsoOpen, /Hauptwache und Alte Oper/);
	assert.match(scenesSrc, /kind="NACH BISHERIGEM STAND"/);
	assert.doesNotMatch(all, /garantiert|auf jeden Fall|sicher fahren/i);
	assert.match(sources, /dtc-testfahrten|DTC/);
});

test('Hinweis Wochenende (VGF, 16.11.): U4/U5 ab Sa ca. 3:30 Uhr bis Mo – ausdrücklich NICHT für Freitag', () => {
	assert.match(seg('u3'), /^Achtung: Ab Samstagfrüh fallen U4 und U5 wegen Testfahrten bis Montag aus\.$/);
	assert.match(WEEKEND.when, /SA 21\.11\. CA\. 3:30 UHR – MO 23\.11\./);
	assert.match(scenesSrc, /gilt NICHT für Freitag/);
	assert.match(sources, /Von Samstag, 21\. November, etwa 3:30 Uhr, bis Montag, 23\. November, zur gleichen Zeit, werden die Linien U4 und U5 eingestellt\./);
	assert.match(sources, /Die Stationen Seckbacher Landstraße, Höhenstraße, Merianplatz und Dom\/Römer bleiben während des gesamten Wochenendes geschlossen\./);
});

test('Hintergrund: fünf Versammlungen (Innenministerium); laut Ordnungsamt (über VGF) fünf Veranstaltungen, darunter vier Demozüge – keine Routen erfunden', () => {
	assert.match(seg('w1'), /^Hintergrund: Laut Innenministerium gibt's morgen sogar fünf Versammlungen\.$/);
	assert.doesNotMatch(all, /nannte noch vier/, 'überholter Halbsatz entfernt');
	assert.equal(WHY.count, 5);
	assert.equal(WHY.marches, 4);
	assert.match(WHY.note, /Änderungen sind möglich/);
	assert.match(sources, /fünf Versammlungslagen/);
});

test('Vor der Fahrt checken: VGF-Website und Anzeiger – Smartphone/Anzeigetafel als Illustration ohne Live-Daten oder Abfahrtszeiten', () => {
	assert.match(seg('c1'), /Änderungen sind möglich\. Checkt vor der Fahrt die VGF-Website oder die Anzeigen an der Haltestelle\./);
	assert.match(seg('q1'), /\?$/);
	assert.match(scenesSrc, /ILLUSTRATION|keine Live-Daten/i);
	// keine Uhrzeiten/Minuten/Verspätungen auf Telefon oder Tafel
	assert.doesNotMatch(transitSrc, /\d+ ?min\b|Verspätung|\+\d+'|Abfahrt \d/);
	assert.doesNotMatch(transitSrc, /logo|Logo\.|RMV|VGF/, 'keine fremden Marken nachgebaut');
});

test('Stimme: Adam kurzformat-60, Ewa → Eywa, Lautschrift für VGF/Linien, Abo-Aufruf, Untertitel nur Anzeige-Schreibweise', () => {
	assert.equal(script.voice.profile, 'kurzformat-60');
	assert.deepEqual(voiceSettingsFor(voice, script), {...voice.elevenlabs.voiceSettings, speed: 1.2});
	assert.equal(voice.elevenlabs.voiceSettings.speed, 1.16);
	assert.equal(seg('hook1'), 'Ewa, Frankfurt!');
	assert.equal(applyAussprache('Ewa, Frankfurt!', ausspracheFor(voice, script.videoId)), '{Ewa|Eywa}, Frankfurt!');
	for (const s of script.segments) assert.doesNotMatch(spoken(s.text), /\bVGF\b|\bU\d\b|\bM36\b/, `${s.id}: Abkürzungen nur in Lautschrift`);
	const cta = script.segments.at(-1);
	assert.equal(cta.id, 'cta');
	assert.equal(display(cta.text), 'Folgt FrankfurtRed3 für mehr!');
	assert.equal(spoken(cta.text), 'Folgt Frankfurt Rett Drei für mehr!');
	assert.ok(!manifest.captions.some((c) => /Eywa|Vau Geh|Rett|sechsunddreißig|vierzehn|Achtzehn/.test(c.text)), 'Untertitel zeigen nur die Anzeige-Schreibweise');
	const slang = (all.match(/gibt's|trifft's|Checkt/g) ?? []).length;
	assert.ok(slang >= 2 && slang <= 4, `Slang ${slang}`);
	if (isAdam) assert.equal((manifest as unknown as {voice: {voiceId: string}}).voice.voiceId, 'pNInz6obpgDQGcFmaJgB');
});

test('Länge: hartes Limit 60 s = 1.800 Frames inkl. Intro und Abo-Aufruf, keine Ausnahme; Pausen ≤ 400 ms; Untertitel im Satz', () => {
	assert.equal(cfg.maxSeconds, FORMAT.maxSeconds);
	assert.equal(cfg.maxSeconds, 60);
	assert.equal(cfg.ausnahme, undefined);
	assert.equal(cfg.sonderausnahme, undefined);
	assert.equal(cfg.maxPauseMs, 400);
	assert.equal(cfg.outputName, 'FrankfurtRed3_20November_OePNV_ADAM_FINAL');
	assert.equal(cfg.thumbnailName, 'FrankfurtRed3_20November_OePNV_THUMBNAIL');
	assert.match(compSrc, /maxSeconds: videos\.FrankfurtErklaert20NovemberOepnv\.maxSeconds/);
	const tl = erklaertTimelineFor(OEPNV_SCENES, script, manifest, 30, cfg.maxSeconds);
	assert.ok(tl.durationInFrames <= 1800, `${tl.durationInFrames} Frames`);
	if (isAdam) {
		assert.ok(tl.durationInFrames >= 53 * 30, `ohne Füllpausen ≥ 53 s, ist ${tl.durationInFrames / 30} s`);
		const segs = manifest.segments;
		for (let i = 1; i < segs.length; i++) assert.ok(segs[i].startMs - segs[i - 1].endMs <= 400, `Pause vor ${segs[i].id}`);
		for (const c of manifest.captions) {
			const s = segs.find((x) => c.startMs >= x.startMs - 1 && c.startMs < x.endMs);
			assert.ok(s && c.endMs <= s.endMs + 1, `Untertitel „${c.text}“ außerhalb seines Satzes`);
		}
	}
});

test('Kopfzeile: Serien-Overlay oben rechts + Szenen-Box links auf einer Linie; Prüfbögen registriert', () => {
	assert.match(compSrc, /badgePlacement: 'top-right'/);
	assert.match(compSrc, /episode: '#11'/);
	assert.equal(LAYOUT.badgeTopRight, 272);
	assert.match(scenesSrc, /<TopTag /);
	for (const m of scenesSrc.matchAll(/top: (3\d\d)[,}]/g)) assert.ok(Number(m[1]) >= LAYOUT.badgeTopRight + LAYOUT.topBarHeight, `Inhalt bei y ${m[1]} unter der Kopfzeile`);
	const root = read('../src/Root.tsx');
	for (const id of ['FrankfurtErklaert20NovemberOepnv"', 'FrankfurtErklaert20NovemberOepnv-Cover"', 'FrankfurtErklaert20NovemberOepnv-CoverVorschau"', 'FrankfurtErklaert20NovemberOepnv-OverlayCheck"']) {
		assert.ok(root.includes(`id="${id}`), id);
	}
	assert.match(read('../.github/workflows/video-produzieren.yml'), /- FrankfurtErklaert20NovemberOepnv/);
});

test('Offizielles Logo im Abo-Aufruf, Titelbild und Prüfbogen – kein „S“, Account nur aus BRAND', () => {
	assert.match(scenesSrc, /<BrandLogo size=\{250\}/);
	assert.match(scenesSrc, /<BrandLogo size=\{52\} \/>/);
	assert.doesNotMatch(scenesSrc, /BrandAvatar/);
	assert.match(read(`${dir}FrankfurtErklaert20NovemberOepnvCoverVorschau.tsx`), /avatar=\{\(s\) => <BrandLogo/);
	assert.doesNotMatch(scenesSrc, /@frankfurtred3/);
});

test('Titelbild: Kernzone, 3:4-Ausschnitt, Grafik vor den App-Knöpfen, Untertitel-Band im Video frei', () => {
	const tops = [L.brandTop, L.kickerTop, L.bigTop, L.cardTop, L.vizTop, L.smallTop, L.dateTop, L.metaTop];
	for (const y of tops) assert.ok(y >= COVER_ZONE.coreTop && y <= COVER_ZONE.coreBottom, `y=${y}`);
	assert.ok(L.brandTop >= 390, 'Serientitel nicht zu hoch');
	assert.ok(L.brandBottom <= L.kickerTop && L.kickerTop + L.kickerSize * 1.1 <= L.bigTop + 4 && L.bigBottom <= L.cardTop);
	assert.ok(L.cardBottom <= L.vizTop && L.vizBottom <= L.smallTop && L.smallBottom <= L.dateTop && L.dateBottom <= L.metaTop);
	assert.ok(L.vizBottom <= COVER_ZONE.rightButtonsTop, 'Grafik endet über den App-Knöpfen');
	assert.ok(L.vizLeft >= COVER_ZONE.side && L.vizLeft + L.vizWidth <= COVER_ZONE.rightButtonsX);
	assert.ok(L.metaBottom <= COVER_ZONE.videoBottom);
	assert.ok(L.questionTop >= COVER_ZONE.videoBottom && L.questionBottom <= COVER_ZONE.coreBottom);
	assert.ok(L.bigMaxWidth <= 1080 - 2 * COVER_ZONE.side);
	assert.ok(L.sideMin >= COVER_ZONE.side);
	assert.ok(L.bigSize >= 58 * 2);
	assert.equal(COVER.kicker, 'FRANKFURT');
	assert.equal(COVER.big, 'MORGEN!');
	assert.equal(COVER.sub, 'DIESE BAHNEN SIND BETROFFEN');
	assert.deepEqual(COVER.lines, ['11', '12', '14']);
});

test('TikTok-Text: Titel, Caption ≤ 4.000 Zeichen, genau die 5 vorgegebenen Hashtags, Kernfakten mit Quelle, Frage am Ende', () => {
	assert.match(tiktok, /## Titel\s+FRANKFURT MORGEN: DIESE BAHNEN SIND BETROFFEN! 🚨🚋/);
	const caption = (tiktok.split('## Caption')[1] ?? '').trim();
	assert.ok(caption.length >= 1200 && caption.length <= 4000, `Caption ${caption.length}`);
	assert.deepEqual(caption.match(/#[\wäöüÄÖÜß]+/g), ['#Frankfurt', '#FrankfurtAmMain', '#GenZRegelt', '#20112026', '#FYP']);
	for (const s of ['11, 12 und 14', '8:30 Uhr', 'Altstadtstrecke', 'Sachsenhausen', 'Börneplatz', '18', '30', 'M36', 'möglicherweise', 'U4', 'U5', 'Willy-Brandt-Platz', 'Dom/Römer', 'Konstablerwache', 'Hauptwache', 'Alte Oper', 'vgf-ffm.de', '19.11.2026', '9 Uhr', 'fünf']) {
		assert.ok(caption.includes(s), `Caption: ${s}`);
	}
	assert.match(caption, /\?\s*\n\s*#/);
	assert.doesNotMatch(caption, /komplett eingestellt|fallen komplett aus|\d+ Minuten Verspätung/i);
});
