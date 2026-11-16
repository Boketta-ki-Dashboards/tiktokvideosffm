/**
 * „Nur 13 Demonstranten?“ (FrankfurtErklaert13Demonstranten): 13 = Summe zweier getrennter Kundgebungen (≈ 10 + 3) laut FNP,
 * 16 Mannschaftswagen als Bereitstellung (nicht am Kundgebungsort), Teilnehmeraussage als AUSSAGE, Datumschaos nur als mögliche Erklärung,
 * keine erfundenen Zahlen/Kausalitäten, Längen-Ausnahme (Info ≤ 61,5 s + Abo-Aufruf, ≤ 64 s), offizielles Logo, Titelbild nach COVER_ZONE.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {applyAussprache, ausspracheFor, voiceSettingsFor} from '../scripts/lib/aussprache.mjs';
import {COVER_ZONE, FORMAT} from '../src/formats/frankfurt-erklaert/theme.ts';
import {erklaertTimelineFor} from '../src/formats/frankfurt-erklaert/timeline.ts';
import {type VoiceoverManifest} from '../src/lib/script-timing.ts';
import {CONFUSION, CONTRAST, COVER, NEXT, PLACES, POLICE, SOURCES, STAND, TIMELINE} from '../src/videos/frankfurt-erklaert-13-demonstranten-2026-11-14/content.ts';
import {DEMO13_COVER_LAYOUT as L} from '../src/videos/frankfurt-erklaert-13-demonstranten-2026-11-14/cover-layout.ts';
import {DEMO13_KEYWORDS, DEMO13_SCENES} from '../src/videos/frankfurt-erklaert-13-demonstranten-2026-11-14/plan.ts';

const dir = '../src/videos/frankfurt-erklaert-13-demonstranten-2026-11-14/';
const read = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8');
const script = JSON.parse(read(`${dir}script.json`));
const manifest: VoiceoverManifest = JSON.parse(read(`${dir}voiceover.json`));
const videos = JSON.parse(read('../config/videos.json'));
const voice = {...JSON.parse(read('../config/voice.json')), ...JSON.parse(read('../config/voice-regeln.json'))};
const sources = read('../references/frankfurt-erklaert-13-demonstranten-2026-11-14/sources.md');
const tiktok = read('../references/frankfurt-erklaert-13-demonstranten-2026-11-14/tiktok-text.md');
const scenesSrc = read(`${dir}scenes/Scenes.tsx`);
const map = JSON.parse(read('../src/data/maps/frankfurt-innenstadt-nordwest.json'));
const display = (t: string) => t.replace(/\{([^|}]*)\|[^}]*\}/g, '$1');
const spoken = (t: string) => t.replace(/\{[^|}]*\|([^}]*)\}/g, '$1');
const seg = (id: string) => display(script.segments.find((s: {id: string}) => s.id === id).text);
const all = script.segments.map((s: {text: string}) => display(s.text)).join(' ');
const isAdam = String(manifest.source).startsWith('elevenlabs');
const cfg = videos.FrankfurtErklaert13Demonstranten;

test('Dramaturgie: Titelbild → 16/13 → Karte → Datumschaos → Vorbereitung vs. Verlauf → 20.11. + Frage → Abo-Aufruf', () => {
	assert.deepEqual(
		DEMO13_SCENES.map((s) => s.id),
		['cover', 'contrast', 'map', 'calendar', 'police', 'next', 'outro'],
	);
	for (const s of DEMO13_SCENES) assert.ok(DEMO13_KEYWORDS[s.id]?.length, `Schlüsselwörter für ${s.id}`);
	for (const s of DEMO13_SCENES.slice(1)) assert.ok((s.transitionInFrames ?? 0) <= 10);
	assert.match(STAND, /16\.11\.2026/);
	for (const s of SOURCES) assert.ok(sources.includes(s.url), `sources.md: ${s.url}`);
});

test('13 = zwei getrennte Kundgebungen (rund 10 + 3) laut FNP – nie „13 an der Hauptwache“', () => {
	assert.match(seg('hook3'), /zwei Kundgebungen von Gen Z regelt kamen zusammen gerade mal 13 Leute/);
	assert.match(seg('hw1'), /^An der Hauptwache waren es rund zehn/);
	assert.match(seg('bw1'), /^An der Bockenheimer Warte waren es drei/);
	assert.equal(PLACES.hauptwache.count, 'RUND 10');
	assert.equal(PLACES.warte.count, '3');
	assert.deepEqual(
		CONTRAST.split.map((s) => s.value),
		['RUND 10', '3'],
	);
	assert.match(CONTRAST.people.note, /zwei Kundgebungen/);
	assert.doesNotMatch(all + JSON.stringify(PLACES), /13 (an|auf) der Hauptwache|Hauptwache[^.]*13/);
	assert.match(PLACES.warte.passersby, /Schaulustige zählen nicht mit/);
	for (const s of ['Ganze 13 Demonstranten waren auf den beiden Protestveranstaltungen.', 'es waren insgesamt rund zehn Demonstranten', 'Drei von ihnen, nach persönlicher Ansprache identifiziert', 'Die ganze Veranstaltung dauerte kaum bis 14 Uhr.', 'Nach etwa 30 Minuten']) {
		assert.ok(sources.includes(s), `sources.md: „${s}“ fehlt`);
	}
});

test('16 Mannschaftswagen: laut FNP, Bereitstellung vor der Matthäuskirche – nicht am Kundgebungsort, keine Gesamtzahl an Beamten', () => {
	assert.match(seg('hook2'), /laut Frankfurter Neuer Presse 16 Mannschaftswagen bereit/);
	assert.equal(CONTRAST.vans.value, 16);
	assert.match(CONTRAST.vans.note, /in Bereitschaft · laut FNP vor der Matthäuskirche/);
	assert.equal(CONTRAST.hint, 'Bereitstellungsort ≠ Kundgebungsort');
	assert.match(PLACES.staging.note, /laut FNP vor der Matthäuskirche/);
	// Bereitstellung liegt > 1 km von der Hauptwache entfernt (eigener Kartenpunkt)
	const d = Math.hypot((PLACES.staging.at[1] - PLACES.hauptwache.at[1]) * 71383, (PLACES.staging.at[0] - PLACES.hauptwache.at[0]) * 110574);
	assert.ok(d > 1000, `${d} m`);
	const {minlat, maxlat, minlon, maxlon} = map.meta.bbox;
	for (const p of [PLACES.hauptwache, PLACES.warte, PLACES.staging]) assert.ok(p.at[0] > minlat && p.at[0] < maxlat && p.at[1] > minlon && p.at[1] < maxlon, p.name);
	assert.doesNotMatch(all + JSON.stringify(POLICE), /\b\d{2,4}\s*(Polizisten|Beamt|Einsatzkräfte)/);
	assert.ok(sources.includes('16 Mannschaftswagen standen vor der Mattäuskirche'));
	assert.ok(sources.includes('Matthäuskirche, 33, Friedrich-Ebert-Anlage'));
});

test('Teilnehmer und Polizeisprecher korrekt zugeordnet; Hauptwache-Zeitfenster laut Polizei', () => {
	assert.match(seg('hw2'), /^Ein Teilnehmer sagte der Zeitung: Die Demo sollte nur auf den 20\. November hinweisen\.$/);
	assert.match(PLACES.hauptwache.quoteBy, /Teilnehmer \(19\) laut FNP/);
	assert.match(scenesSrc, /<Chip kind="AUSSAGE"/);
	assert.doesNotMatch(all + scenesSrc, /Andrej|Hoffmann/);
	assert.match(seg('bw1'), /laut Polizei kam nicht mal der Anmelder/);
	assert.match(PLACES.warte.note, /laut Polizeisprecher/);
	assert.match(PLACES.hauptwache.window, /12:30–15 Uhr \(Polizei\)/);
	assert.ok(sources.includes('„Diese Demonstration sollte nur auf den Protesttag nächste Woche, am 20. November, hinweisen.“'));
	assert.ok(sources.includes('Laut einem Polizeisprecher erschien dort nicht einmal der Anmelder selbst'));
});

test('Datumschaos: Abfolge belegt, Ursache nur als mögliche Erklärung – keine Kausalbehauptung', () => {
	assert.match(seg('d1'), /stand der 14\. kurz auf der Website der Initiative – dann war er wieder weg/);
	assert.match(seg('d2'), /nächster großer Termin galt der 20\./);
	assert.match(seg('d3'), /Polizei nannte die Kundgebungen am Freitag/);
	assert.match(seg('d4'), /^Ob das Hin und Her Leute ferngehalten hat, ist nicht belegt\.$/);
	assert.equal(CONFUSION.tag, 'MÖGLICHE ERKLÄRUNG – NICHT BEWIESEN');
	assert.match(CONFUSION.note, /keine Bildschirmaufnahme/);
	assert.deepEqual(
		TIMELINE.map((t) => t.label),
		['1.11.', '20.11.', 'bis 12.11.', 'Fr 13.11.', 'Sa 14.11.'],
	);
	assert.doesNotMatch(all, /wegen (der|des)|abgeschreckt|Absage|erst am Vortag|Bewegung (ist )?(am Ende|tot|vorbei)/i);
	for (const s of ['kurzzeitig ein weiterer Termin genannt - der 14. November', 'Inzwischen wurde das konkrete Datum entfernt', 'Wir wollen uns an den europaweiten Protesten am 20. November beteiligen', 'Gen Z regelt – Phase 2']) {
		assert.ok(sources.includes(s), `sources.md: „${s}“ fehlt`);
	}
});

test('Polizei: Vorbereitung (PM 13.11.) vs. Verlauf (laut FNP); 31.10. nur als Größenordnung; 20.11. nur angekündigt', () => {
	assert.match(seg('p1'), /vorgesorgt – für mögliche Störungen/);
	assert.match(seg('p2'), /nötig waren sie laut dem Bericht nicht\. Die Zeil blieb ruhig\./);
	assert.deepEqual([...POLICE.outcome.items], ['ZEIL BLIEB RUHIG', 'ABSPERRUNGEN NICHT BENÖTIGT']);
	assert.equal(POLICE.outcome.source, 'laut FNP');
	assert.match(POLICE.why, /nicht nach der späteren Teilnehmerzahl/);
	assert.doesNotMatch(all + JSON.stringify(POLICE), /unnötig|übertrieben|absurd|Ausweiskontroll/i);
	assert.match(CONTRAST.compare.note, /laut Polizei · großer Protesttag, anderer Anlass/);
	assert.match(seg('n1'), /ruft die Initiative wieder bundesweit auf – auch in Frankfurt/);
	assert.doesNotMatch(JSON.stringify(NEXT) + seg('n1'), /Verbot|verboten|Tausend|\b\d{1,3}(\.\d{3})+\s*(Teilnehm|Menschen|Demonstr|Leute|erwartet)/);
	assert.match(NEXT.sub, /Standort folgt/);
	for (const s of ['Nötig wurden sie nicht, auch am Abend blieb auf der Zeil alles ruhig.', 'Die Polizei sprach am Nachmittag von 8.000 Teilnehmern', 'Freitag, 20. November 2026 · ab 14 Uhr in 39 Städten', 'um auf mögliche Störungen und Gewalttaten vorbereitet zu sein.']) {
		assert.ok(sources.includes(s), `sources.md: „${s}“ fehlt`);
	}
});

test('Stimme: Adam kurzformat-60, Ewa → Eywa, „Gen Z regelt“ getrennt gesprochen, Abo-Aufruf, Untertitel nur Anzeige-Schreibweise', () => {
	assert.equal(script.voice.profile, 'kurzformat-60');
	assert.deepEqual(voiceSettingsFor(voice, script), {...voice.elevenlabs.voiceSettings, speed: 1.2});
	assert.equal(voice.elevenlabs.voiceSettings.speed, 1.16);
	assert.equal(seg('hook1'), 'Ewa, Frankfurt!');
	assert.equal(applyAussprache('Ewa, Frankfurt!', ausspracheFor(voice, script.videoId)), '{Ewa|Eywa}, Frankfurt!');
	for (const s of script.segments) assert.doesNotMatch(spoken(s.text), /Dschen-Zett|Gen Z|Gen-Z/, `${s.id}: „Gen Z“ nicht in Lautschrift`);
	const cta = script.segments.at(-1);
	assert.equal(cta.id, 'cta');
	assert.equal(display(cta.text), 'Folgt FrankfurtRed3 für mehr!');
	assert.equal(spoken(cta.text), 'Folgt Frankfurt Rett Drei für mehr!');
	assert.ok(!manifest.captions.some((c) => /Eywa|Dschen|Rett/.test(c.text)), 'Untertitel zeigen nur die Anzeige-Schreibweise');
	const slang = (all.match(/gerade mal|Leute|nicht mal|'ne/g) ?? []).length;
	assert.ok(slang >= 2 && slang <= 5, `Slang ${slang}`);
	if (isAdam) assert.equal((manifest as unknown as {voice: {voiceId: string}}).voice.voiceId, 'pNInz6obpgDQGcFmaJgB');
});

test('Länge: Informationsteil ≤ 61,5 s, Abo-Aufruf als letztes Segment, gesamt ≤ 64 s; Pausen ≤ 400 ms; Untertitel im Satz', () => {
	assert.equal(cfg.maxSeconds, 64);
	assert.equal(cfg.infoMaxSeconds, FORMAT.infoMaxSeconds);
	assert.ok(cfg.ausnahme.length > 20);
	assert.equal(cfg.outputName, 'FrankfurtRed3_13Demonstranten_ADAM_FINAL');
	assert.equal(cfg.thumbnailName, 'FrankfurtRed3_13Demonstranten_THUMBNAIL');
	const tl = erklaertTimelineFor(DEMO13_SCENES, script, manifest, 30, cfg.maxSeconds);
	assert.ok(tl.durationInFrames <= 64 * 30, `${tl.durationInFrames} Frames`);
	if (isAdam) {
		const segs = manifest.segments;
		const infoEnd = Math.max(...segs.filter((s) => s.id !== 'cta').map((s) => s.endMs));
		const cta = segs.find((s) => s.id === 'cta')!;
		assert.ok(infoEnd >= 55000 && infoEnd <= cfg.infoMaxSeconds * 1000, `Informationsteil ${infoEnd} ms`);
		const ctaPart = (tl.durationInFrames / 30) * 1000 - cta.startMs;
		assert.ok(ctaPart >= 3000 && ctaPart <= 4200, `Abo-Aufruf ${ctaPart} ms`);
		for (let i = 1; i < segs.length; i++) assert.ok(segs[i].startMs - segs[i - 1].endMs <= 400, `Pause vor ${segs[i].id}`);
		for (const c of manifest.captions) {
			const s = segs.find((x) => c.startMs >= x.startMs - 1 && c.startMs < x.endMs);
			assert.ok(s && c.endMs <= s.endMs + 1, `Untertitel „${c.text}“ außerhalb seines Satzes`);
		}
	}
});

test('Offizielles Logo im Abo-Aufruf, Titelbild und Prüfbogen – kein „S“', () => {
	assert.match(scenesSrc, /<BrandLogo size=\{250\}/);
	assert.match(scenesSrc, /<BrandLogo size=\{52\} \/>/);
	assert.doesNotMatch(scenesSrc, /BrandAvatar/);
	assert.match(read(`${dir}FrankfurtErklaert13DemonstrantenCoverVorschau.tsx`), /avatar=\{\(s\) => <BrandLogo/);
	assert.doesNotMatch(scenesSrc, /@frankfurtred3/);
});

test('Titelbild: Kernzone, 3:4-Ausschnitt, Untertitel-Band im Video frei, Karte vor den App-Knöpfen, 13 = größte Zahl', () => {
	const tops = [L.brandTop, L.bigTop, L.vansTop, L.cardTop, L.subTop, L.smallTop, L.metaTop];
	for (const y of tops) assert.ok(y >= COVER_ZONE.coreTop && y <= COVER_ZONE.coreBottom, `y=${y}`);
	assert.ok(L.brandTop >= 390, 'Serientitel nicht zu hoch');
	assert.ok(L.bigBottom <= L.cardTop && L.smallBottom <= L.metaTop && L.metaBottom <= COVER_ZONE.videoBottom);
	assert.ok(L.chipsTop >= COVER_ZONE.videoBottom && L.chipsBottom <= COVER_ZONE.coreBottom);
	assert.ok(540 + L.cardMaxWidth / 2 <= COVER_ZONE.rightButtonsX - 10);
	assert.ok(L.sideMin >= COVER_ZONE.side);
	assert.ok(L.bigSize >= 3 * L.cardFont, '13 ist die größte Zahl');
	assert.ok(L.subSize >= 27);
	assert.equal(COVER.card, 'NUR 13 DEMONSTRANTEN?!');
	assert.equal(COVER.thumbSub, '16 MANNSCHAFTSWAGEN IN BEREITSCHAFT');
	assert.equal(COVER.small, 'GEN Z REGELT · FRANKFURT · 14.11.');
});

test('TikTok-Text: Titel, Caption ≤ 4.000 Zeichen, genau 5 Hashtags, Bereitstellung erklärt, Quellen, Frage am Ende', () => {
	assert.match(tiktok, /## Titel\s+13 DEMONSTRANTEN – ABER 16 POLIZEIWAGEN\?! 🚨/);
	const caption = (tiktok.split('## Caption')[1] ?? '').trim();
	assert.ok(caption.length >= 3400 && caption.length <= 4000, `Caption ${caption.length}`);
	assert.equal((caption.match(/#[\wäöüÄÖÜß]+/g) ?? []).length, 5);
	for (const s of ['Bereitstellung', 'Matthäuskirche', 'Hauptwache', 'Bockenheimer Warte', 'Anmelder', '20. November', 'nicht belegt', 'Frankfurter Neue Presse', 'tagesschau', 'Polizei']) assert.ok(caption.includes(s), `Caption: ${s}`);
	assert.match(caption, /\?\s*\n\s*#/);
	assert.doesNotMatch(caption, /wegen der Absage|abgeschreckt|Bewegung ist (tot|am Ende)/i);
});
