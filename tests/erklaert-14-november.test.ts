/**
 * Sondervideo „14.11. – doch eine Gen-Z-Demo in Frankfurt?“ (FrankfurtErklaert14November):
 * Datum genannt → entfernt → doch Aktionstag sauber getrennt, Polizei-Angaben wörtlich belegt, drei Versammlungen getrennt
 * (1.000 nur Goetheplatz/Irankonflikt), Zugangskontrollen nur im Bedarfsfall, kein erfundener Verlauf, 20.11. laut GEW,
 * Längen-Ausnahme (Info ≤ 61,5 s + Abo-Aufruf), Titelbild in der Kernzone, TikTok-Text.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {applyAussprache, ausspracheFor, voiceSettingsFor} from '../scripts/lib/aussprache.mjs';
import {COVER_ZONE, FORMAT} from '../src/formats/frankfurt-erklaert/theme.ts';
import {erklaertTimelineFor} from '../src/formats/frankfurt-erklaert/timeline.ts';
import {type VoiceoverManifest} from '../src/lib/script-timing.ts';
import {COVER, HAUPTWACHE, NEXT, POLICE, SOURCES, STAND, VENUES, WEBSITE} from '../src/videos/frankfurt-erklaert-14-november-2026/content.ts';
import {NOV14_COVER_LAYOUT as L} from '../src/videos/frankfurt-erklaert-14-november-2026/cover-layout.ts';
import {NOV14_KEYWORDS, NOV14_SCENES} from '../src/videos/frankfurt-erklaert-14-november-2026/plan.ts';

const dir = '../src/videos/frankfurt-erklaert-14-november-2026/';
const read = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8');
const script = JSON.parse(read(`${dir}script.json`));
const manifest: VoiceoverManifest = JSON.parse(read(`${dir}voiceover.json`));
const videos = JSON.parse(read('../config/videos.json'));
const voice = {...JSON.parse(read('../config/voice.json')), ...JSON.parse(read('../config/voice-regeln.json'))};
const sources = read('../references/frankfurt-erklaert-14-november-2026/sources.md');
const tiktok = read('../references/frankfurt-erklaert-14-november-2026/tiktok-text.md');
const display = (t: string) => t.replace(/\{([^|}]*)\|[^}]*\}/g, '$1');
const spoken = (t: string) => t.replace(/\{[^|}]*\|([^}]*)\}/g, '$1');
const seg = (id: string) => display(script.segments.find((s: {id: string}) => s.id === id).text);
const all = script.segments.map((s: {text: string}) => display(s.text)).join(' ');
const isAdam = String(manifest.source).startsWith('elevenlabs');
const cfg = videos.FrankfurtErklaert14November;

test('Dramaturgie: genannt → entfernt → 20.11. → doch Aktionstag → Hauptwache → drei Termine → Polizei → 20.11. → Frage', () => {
	assert.deepEqual(
		NOV14_SCENES.map((s) => s.id),
		['cover', 'website', 'hauptwache', 'venues', 'police', 'next', 'outro'],
	);
	for (const s of NOV14_SCENES) assert.ok(NOV14_KEYWORDS[s.id]?.length, `Schlüsselwörter für ${s.id}`);
	assert.match(seg('w1'), /stand der 14\. November kurz auf der Website von Gen Z regelt/);
	assert.match(seg('w2'), /Datum weg – nur noch: bald/);
	assert.match(seg('w4'), /Aktionstag/);
	assert.match(seg('w4'), /Phase 2/);
	// keine Behauptung einer offiziellen Absage oder heimlichen Wiederaufnahme
	assert.doesNotMatch(all, /abgesagt|heimlich|verboten|Verbot|randaliert|Krawalle heute|abgeriegelt|gesperrt/i);
	for (const s of ['wurde am Sonntagvormittag kurzzeitig ein weiterer Termin genannt - der 14. November', 'Inzwischen wurde das konkrete Datum entfernt, nun soll es lediglich "bald" neue Proteste geben', '«Phase 2 beginnt»', 'die für diesen Tag auch zu einem Aktionstag aufgerufen hat']) {
		assert.ok(sources.includes(s), `sources.md: „${s}“ fehlt`);
	}
});

test('Hauptwache: 12:30–15:00 laut Polizei Gen Z regelt zuzurechnen – Verlauf offen, keine Teilnehmerzahl', () => {
	assert.match(seg('f1'), /^Laut Polizei war dafür in Frankfurt eine Kundgebung an der Hauptwache angekündigt, von 12:30 bis 15 Uhr\.$/);
	assert.equal(HAUPTWACHE.time, '12:30–15:00 UHR');
	assert.match(HAUPTWACHE.note, /Ankündigung der Polizei vom 13\.11\./);
	assert.match(seg('f2'), /Bilanz .* bei Redaktionsschluss noch nicht/);
	assert.match(HAUPTWACHE.open, /NOCH KEINE POLIZEIBILANZ/);
	assert.match(STAND, /14\.11\.2026/);
	// keine erfundene Teilnehmerzahl für die Hauptwache, keine „Tausende demonstrierten“
	assert.doesNotMatch(seg('f1') + seg('f2') + JSON.stringify(HAUPTWACHE), /\b\d{1,3}(\.\d{3})*\s*(Teilnehm|Menschen|Demonstr|Personen)|Tausende|Hunderte|demonstrierten/);
	assert.ok(sources.includes('Eine dieser Versammlungen findet zwischen 12:30 Uhr und 15:00 Uhr an der Hauptwache statt.'));
});

test('Drei getrennte Versammlungen: 1.000 nur Goetheplatz (Irankonflikt), Bockenheimer Warte ohne Zuordnung, keine Routen', () => {
	assert.deepEqual(
		VENUES.map((v) => v.id),
		['hauptwache', 'bockenheimer-warte', 'goetheplatz'],
	);
	const gp = VENUES.find((v) => v.id === 'goetheplatz')!;
	const bw = VENUES.find((v) => v.id === 'bockenheimer-warte')!;
	assert.match(gp.kind, /IRANKONFLIKT/);
	assert.match(gp.note, /1\.000/);
	for (const v of VENUES.filter((x) => x.id !== 'goetheplatz')) assert.doesNotMatch(JSON.stringify(v), /1\.000/);
	assert.doesNotMatch(JSON.stringify(bw), /Gen Z|GEN-Z/i);
	assert.match(bw.note, /nicht genannt/);
	assert.match(seg('m2'), /laut Polizei zum Irankonflikt, also keine Gen-Z-Demo/);
	// Farben klar getrennt
	assert.equal(new Set(VENUES.map((v) => v.color)).size, 3);
	assert.doesNotMatch(read(`${dir}scenes/Scenes.tsx`), /sequence=|route|Route\b/);
	for (const s of ['Eine weitere Kundgebung findet zwischen 17:00 Uhr - 19:00 Uhr an der Bockenheimer Warte statt.', 'Der größte angezeigte Aufzug mit 1000 erwarteten Teilnehmenden im Zusammenhang mit dem aktuellen Irankonflikt beginnt um 16:00 Uhr am Goetheplatz']) {
		assert.ok(sources.includes(s), `sources.md: „${s}“ fehlt`);
	}
});

test('Polizei: mehr Kräfte, Zugangskontrollen nur im Bedarfsfall, keine konkreten Hinweise auf Ausschreitungen', () => {
	assert.match(seg('p1'), /mehr Kräfte ein als an Halloween/);
	assert.match(seg('p2'), /^Bei Bedarf kann sie alle Zugänge zur Zeil kontrollieren/);
	assert.match(seg('p3'), /Konkrete Hinweise auf geplante Ausschreitungen gab es laut Polizei aber nicht/);
	const gate = POLICE.items.find((i) => i.icon === 'gate')!;
	assert.match(gate.text, /nur im Bedarfsfall/);
	assert.equal(gate.status, 'VORBEREITET');
	assert.deepEqual([...POLICE.key], ['KEINE KONKRETEN HINWEISE', 'AUF GEPLANTE AUSSCHREITUNGEN']);
	for (const s of ['Im Vergleich zur Einsatzlage am 31.10.2026 wurde die Anzahl der Einsatzkräfte nochmals erhöht', 'Wir haben uns darauf vorbereitet, im Bedarfsfall kurzfristig sämtliche Zugänge zur Zeil zu kontrollieren.', 'Auch wenn derzeit keine konkreten Hinweise auf geplante Ausschreitungen vorliegen', 'Absperrgitter im Einsatzraum bereithalten']) {
		assert.ok(sources.includes(s), `sources.md: „${s}“ fehlt`);
	}
});

test('20. November laut GEW Hessen – nur Ankündigungen, kein Verbot, keine Zahlen', () => {
	assert.match(seg('n1'), /Schulstreik, Gen-Z-Demo und Gewerkschaftsjugend angekündigt/);
	assert.deepEqual(
		NEXT.items.map((i) => i.time),
		['10 UHR', '14 UHR', '17:30'],
	);
	assert.doesNotMatch(JSON.stringify(NEXT) + seg('n1'), /Verbot|verboten|\b\d{1,3}(\.\d{3})+\s*(Teilnehm|Menschen|Demonstr|erwartet)/);
	for (const s of ['10 Uhr Schulstreik gegen die Wehrpflicht - Demonstration beginnt am Willy-Brandt-Platz.', '14 Uhr Demonstration von Gen Z regelt - Ort und Demo-Route sind noch nicht bekannt.', '17.30 Uhr am Bockenheimer Depot']) {
		assert.ok(sources.includes(s), `sources.md: „${s}“ fehlt`);
	}
	for (const s of SOURCES) assert.ok(sources.includes(s.url), `sources.md: ${s.url}`);
	assert.match(WEBSITE.note, /keine Bildschirmaufnahme/);
});

test('Stimme: Adam kurzformat-60, Ewa → Eywa, „Gen Z“ als „Dschen Zett“ getrennt gesprochen, Abo-Aufruf ohne „Plus weg“', () => {
	assert.equal(script.voice.profile, 'kurzformat-60');
	assert.deepEqual(voiceSettingsFor(voice, script), {...voice.elevenlabs.voiceSettings, speed: 1.2});
	assert.equal(voice.elevenlabs.voiceSettings.speed, 1.16);
	assert.equal(seg('hook1'), 'Ewa, Frankfurt!');
	assert.equal(applyAussprache('Ewa, Frankfurt!', ausspracheFor(voice, script.videoId)), '{Ewa|Eywa}, Frankfurt!');
	for (const s of script.segments) assert.doesNotMatch(spoken(s.text), /Dschen-Zett|Gen Z|Gen-Z/, `${s.id}: „Gen Z“ nicht in Lautschrift`);
	const cta = script.segments.at(-1);
	assert.equal(cta.id, 'cta');
	assert.equal(display(cta.text), 'Folgt FrankfurtRed3 für die nächsten Entwicklungen!');
	assert.equal(spoken(cta.text), 'Folgt Frankfurt Rett Drei für die nächsten Entwicklungen!');
	assert.doesNotMatch(JSON.stringify(script), /Plus weg/i);
	assert.ok(!manifest.captions.some((c) => /Eywa|Dschen|Rett/.test(c.text)), 'Untertitel zeigen nur die Anzeige-Schreibweise');
	if (isAdam) assert.equal((manifest as unknown as {voice: {voiceId: string}}).voice.voiceId, 'pNInz6obpgDQGcFmaJgB');
});

test('Länge: Informationsteil ≤ 61,5 s (Ziel 58–60), Abo-Aufruf 3–4 s, gesamt ≤ 65 s; Pausen ≤ 400 ms; Untertitel im Satz', () => {
	assert.equal(cfg.maxSeconds, 66);
	assert.equal(cfg.infoMaxSeconds, FORMAT.infoMaxSeconds);
	assert.ok(cfg.ausnahme.length > 20);
	assert.equal(cfg.outputName, 'FrankfurtRed3_14November_ADAM_FINAL');
	assert.equal(cfg.thumbnailName, 'FrankfurtRed3_14November_THUMBNAIL');
	const tl = erklaertTimelineFor(NOV14_SCENES, script, manifest, 30, cfg.maxSeconds);
	assert.ok(tl.durationInFrames <= 65 * 30, `${tl.durationInFrames} Frames`);
	for (const s of NOV14_SCENES.slice(1)) assert.ok((s.transitionInFrames ?? 0) <= 10);
	if (isAdam) {
		const segs = manifest.segments;
		const infoEnd = Math.max(...segs.filter((s) => s.id !== 'cta').map((s) => s.endMs));
		const cta = segs.find((s) => s.id === 'cta')!;
		assert.ok(infoEnd >= 56000 && infoEnd <= cfg.infoMaxSeconds * 1000, `Informationsteil ${infoEnd} ms`);
		const ctaPart = (tl.durationInFrames / 30) * 1000 - cta.startMs;
		assert.ok(ctaPart >= 3000 && ctaPart <= 4200, `Abo-Aufruf ${ctaPart} ms`);
		for (let i = 1; i < segs.length; i++) assert.ok(segs[i].startMs - segs[i - 1].endMs <= 400, `Pause vor ${segs[i].id}`);
		for (const c of manifest.captions) {
			const s = segs.find((x) => c.startMs >= x.startMs - 1 && c.startMs < x.endMs);
			assert.ok(s && c.endMs <= s.endMs + 1, `Untertitel „${c.text}“ außerhalb seines Satzes`);
		}
	}
});

test('Titelbild: Kernzone, 3:4-Ausschnitt, Untertitel-Band im Video frei, rote Karte vor den App-Knöpfen', () => {
	const tops = [L.brandTop, L.calendarTop, L.dateTop, L.cardTop, L.subTop, L.metaTop];
	for (const y of tops) assert.ok(y >= COVER_ZONE.coreTop && y <= COVER_ZONE.coreBottom, `y=${y}`);
	assert.ok(L.brandTop >= 390, 'Serientitel nicht zu hoch');
	assert.ok(L.calendarBottom <= L.dateTop && L.metaBottom <= COVER_ZONE.videoBottom);
	assert.ok(L.chipsTop >= COVER_ZONE.videoBottom && L.chipsBottom <= COVER_ZONE.coreBottom);
	assert.ok(540 + L.cardMaxWidth / 2 <= COVER_ZONE.rightButtonsX - 10);
	assert.ok(L.sideMin >= COVER_ZONE.side);
	assert.equal(COVER.date, '14.11.2026');
	assert.equal(COVER.card, 'DOCH EINE GEN-Z-DEMO?');
	assert.equal(COVER.sub, 'Was ist heute wirklich angekündigt?');
	assert.deepEqual(NOV14_SCENES[0].segmentIds, ['hook1', 'hook2']);
});

test('TikTok-Text: Titel, Caption ≤ 4.000 Zeichen, genau 5 Hashtags, Quellen, Frage am Ende, keine Zuspitzung', () => {
	assert.match(tiktok, /## Titel\s+14\.11\. – DOCH EINE GEN-Z-DEMO IN FRANKFURT\?! 🚨/);
	const caption = (tiktok.split('## Caption')[1] ?? '').trim();
	assert.ok(caption.length >= 3500 && caption.length <= 4000, `Caption ${caption.length}`);
	assert.equal((caption.match(/#[\wäöüÄÖÜß]+/g) ?? []).length, 5);
	for (const s of ['Polizeipräsidium Frankfurt', 'tagesschau', 'GEW Hessen', 'im Bedarfsfall', 'keine konkreten Hinweise', 'Irankonflikt', 'bald']) assert.ok(caption.includes(s), `Caption: ${s}`);
	assert.match(caption, /\?\s*\n\s*#/);
	assert.doesNotMatch(caption, /abgeriegelt|komplett abgesagt|Tausende demonstrierten|Verbot besteht/i);
});
