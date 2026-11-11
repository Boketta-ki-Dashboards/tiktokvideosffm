/**
 * „76 Fragen – Teil 3: Was ist immer noch offen?“ (FrankfurtErklaert76FragenTeil3):
 * vier Fragen mit belegten Angaben, keine erfundenen Ursachen/Summen/Zusagen, Recht korrekt eingeschränkt,
 * keine Wiederholung der Teil-2-Themen, Kurzformat-Stimme, Ewa/Eywa, kurze Pausen, Titelbild in der Kernzone.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {applyAussprache, ausspracheFor, voiceSettingsFor} from '../scripts/lib/aussprache.mjs';
import {COVER_ZONE} from '../src/formats/frankfurt-erklaert/theme.ts';
import {erklaertTimelineFor} from '../src/formats/frankfurt-erklaert/timeline.ts';
import {type VoiceoverManifest} from '../src/lib/script-timing.ts';
import {COVER, DAMAGE, FORECAST, PHASES, QUESTIONS, SOURCES, STATUS, UNDER14} from '../src/videos/frankfurt-erklaert-76-fragen-teil3/content.ts';
import {TEIL3_COVER_LAYOUT as L} from '../src/videos/frankfurt-erklaert-76-fragen-teil3/cover-layout.ts';
import {TEIL3_KEYWORDS, TEIL3_SCENES} from '../src/videos/frankfurt-erklaert-76-fragen-teil3/plan.ts';

const dir = '../src/videos/frankfurt-erklaert-76-fragen-teil3/';
const read = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8');
const script = JSON.parse(read(`${dir}script.json`));
const manifest: VoiceoverManifest = JSON.parse(read(`${dir}voiceover.json`));
const voice = {...JSON.parse(read('../config/voice.json')), ...JSON.parse(read('../config/voice-regeln.json'))};
const sources = read('../references/frankfurt-erklaert-76-fragen-teil3/sources.md');
const tiktok = read('../references/frankfurt-erklaert-76-fragen-teil3/tiktok-text.md');
const teil2 = JSON.parse(read('../src/videos/frankfurt-erklaert-76-fragen-teil2/script.json'));
const display = (t: string) => t.replace(/\{([^|}]*)\|[^}]*\}/g, '$1');
const seg = (id: string) => display(script.segments.find((s: {id: string}) => s.id === id).text);
const all = script.segments.map((s: {text: string}) => display(s.text)).join(' ');
const isAdam = String(manifest.source).startsWith('elevenlabs');

test('Alle vier Fragen kommen vor – in Reihenfolge, je mit eigener Szene', () => {
	assert.match(seg('q1a'), /^Erstens:/);
	assert.match(seg('q2a'), /^Zweitens:/);
	assert.match(seg('q3a'), /^Drittens:/);
	assert.match(seg('q4a'), /^Viertens:/);
	assert.deepEqual(
		TEIL3_SCENES.map((s) => s.id),
		['cover', 'forecast', 'phases', 'under14', 'damage', 'outro'],
	);
	assert.deepEqual(
		QUESTIONS.map((q) => q.num),
		['01', '02', '03', '04'],
	);
	for (const s of TEIL3_SCENES) assert.ok(TEIL3_KEYWORDS[s.id]?.length, `Schlüsselwörter für ${s.id}`);
});

test('Frage 1: Prognose ≠ tatsächliche Zahl, Ursache bleibt offen (nichts erfunden)', () => {
	assert.equal(FORECAST.expected, 2000);
	assert.equal(FORECAST.actualFrom, 8000);
	assert.equal(FORECAST.actualTo, 9000);
	assert.match(seg('q1a'), /Die Polizei erwartete rund 2\.000 Demonstrierende/);
	assert.match(seg('q1b'), /8\.000 bis 9\.000 – etwa viermal so viele/);
	// Faktor folgt aus den Daten: 8.000/2.000 = 4, 9.000/2.000 = 4,5
	assert.ok(FORECAST.actualFrom / FORECAST.expected >= 4 && FORECAST.actualTo / FORECAST.expected <= 4.5);
	assert.match(seg('q1c'), /bisher unklar/);
	assert.doesNotMatch(all, /absichtlich|heruntergerechnet|wegen (der|dieser) (Fehl)?einschätzung|deshalb geplündert|Versagen/i);
	for (const s of ['Die Polizei rechnet mit etwa 2.000 Teilnehmenden', 'Die Polizei hatte im Vorfeld nur mit 2.000 Teilnehmenden gerechnet', 'zwischen 8.000 bis 9.000 Demonstrierende', 'Die Polizei sprach am Nachmittag von 8.000 Teilnehmern', 'mehr als 11.000']) {
		assert.ok(sources.includes(s), `sources.md: „${s}“ fehlt`);
	}
});

test('Frage 2: Gewalt vor der Auflösung laut Innenminister – 6 sind Teil der 181, Mehrheit friedlich', () => {
	assert.equal(PHASES.injuredBefore, 6);
	assert.equal(PHASES.total, 181);
	assert.match(seg('q2a'), /Laut Innenminister begann die Gewalt schon vor der Auflösung/);
	assert.match(seg('q2b'), /sechs Polizisten verletzt, einer schwer – insgesamt waren es 181/);
	assert.match(seg('q2c'), /große Mehrheit blieb trotzdem friedlich/);
	assert.doesNotMatch(all, /187|sechs (weitere|zusätzlich)|plus sechs/);
	assert.match(PHASES.totalLabel, /insgesamt/);
	assert.match(PHASES.quote, /^„Ausschreitungen begannen nicht erst nach Auflösung der Versammlung\.“$/);
	for (const s of ['Ausschreitungen begannen nicht erst nach Auflösung der Versammlung', 'sechs Polizisten im Zeitraum bis zur Auflösung verletzt worden, einer davon schwer', '181 verletzte Polizisten registriert', 'die meisten Teilnehmer im Tagesverlauf friedlich']) {
		assert.ok(sources.includes(s), `sources.md: „${s}“ fehlt`);
	}
});

test('Frage 3: unter 14 – strafunmündig (§ 19 StGB), aber andere Folgen möglich; Eltern nicht automatisch', () => {
	assert.equal(UNDER14.count, 2);
	assert.match(seg('q3a'), /Zwei Tatverdächtige sind laut Minister unter 14/);
	assert.match(seg('q3b'), /strafunmündig – bestraft werden können sie nicht/);
	assert.match(seg('q3c'), /Jugendamt kann eingebunden werden, und Schadenersatz kann möglich sein/);
	assert.match(seg('q3d'), /Eltern haften nicht automatisch/);
	assert.doesNotMatch(all, /Eltern (müssen|zahlen) (immer|alles)|Eltern haften (immer|für alles)|keine Folgen|folgenlos bleiben/i);
	assert.deepEqual(
		UNDER14.items.map((i) => i.law),
		['§ 27 SGB VIII', '§ 828 Abs. 3 BGB', '§ 832 BGB'],
	);
	assert.match(UNDER14.law, /Schuldunfähig ist, wer bei Begehung der Tat noch nicht vierzehn Jahre alt ist\./);
	assert.match(UNDER14.disclaimer, /keine Rechtsberatung · Stand/);
	for (const s of ['Schuldunfähig ist, wer bei Begehung der Tat noch nicht vierzehn Jahre alt ist.', 'nicht die zur Erkenntnis der Verantwortlichkeit erforderliche Einsicht hat', 'Die Ersatzpflicht tritt nicht ein, wenn er seiner Aufsichtspflicht genügt', 'Zwei Personen sind Poseck zufolge unter 14 Jahre']) {
		assert.ok(sources.includes(s), `sources.md: „${s}“ fehlt`);
	}
});

test('Frage 4: Versicherung zuerst, Stadt prüft – keine Zahlungszusage, keine erfundene Summe', () => {
	assert.match(seg('q4b'), /Zuerst sind die Versicherungen gefragt/);
	assert.match(seg('q4c'), /prüft die Stadt finanzielle Hilfe – ohne feste Zusage/);
	assert.match(seg('q4d'), /nicht offiziell beziffert/);
	assert.doesNotMatch(all, /\d+ ?(Mio|Millionen|Euro|€)|alle Händler|vollständig entschädigt|zahlt die Stadt|ausgezahlt/i);
	assert.equal(DAMAGE.steps[2].kind, 'check');
	assert.match(DAMAGE.steps[2].text, /keine feste Zusage/);
	assert.match(DAMAGE.open, /NICHT OFFIZIELL BEZIFFERT/);
	for (const s of ['Für die Regulierung der entstandenen Schäden sind zunächst die jeweils zuständigen Versicherungen zu kontaktieren', 'bieten wir an, dass das Stadtmarketing prüfen wird, ob wir seitens der Stadt eine finanzielle Unterstützung leisten können', 'am Montag, 2. November']) {
		assert.ok(sources.includes(s), `sources.md: „${s}“ fehlt`);
	}
	for (const s of SOURCES) assert.ok(sources.includes(s.url), `sources.md: ${s.url}`);
});

test('Keine Wiederholung der Teil-2-Themen (Bilanz, TikTok, 20.11., Herkunftsdebatte)', () => {
	assert.doesNotMatch(all, /TikTok|migrantisch|Migrationshintergrund|20\. November|1\.300|dienstfähig|Unterbindungsgewahrsam|zwei Drittel|polizeibekannt|Viertel wohnt/i);
	// 181 nur als Kontext (ein Satz), kein Teil-2-Satz wörtlich übernommen
	assert.equal((all.match(/181/g) ?? []).length, 1);
	const t2 = new Set(teil2.segments.map((s: {text: string}) => s.text));
	for (const s of script.segments.filter((x: {id: string}) => x.id !== 'hook1')) assert.ok(!t2.has(s.text), `Satz aus Teil 2 wiederholt: ${s.id}`);
});

test('Kurzformat-Stimme: Adam mit Profil kurzformat-60 (speed 1.20), Rest unverändert; Ewa → Eywa nur gesprochen', () => {
	assert.equal(script.voice.profile, 'kurzformat-60');
	const vs = voiceSettingsFor(voice, script);
	assert.equal(vs.speed, 1.2);
	assert.deepEqual(vs, {...voice.elevenlabs.voiceSettings, speed: 1.2}, 'nur speed weicht ab');
	assert.equal(voice.elevenlabs.voiceId, 'pNInz6obpgDQGcFmaJgB');
	assert.equal(voice.elevenlabs.voiceSettings.speed, 1.16, 'Standard bleibt 1.16');
	if (isAdam) assert.equal((manifest as unknown as {voice: {voiceId: string}}).voice.voiceId, voice.elevenlabs.voiceId);
	assert.equal(seg('hook1'), 'Ewa, Frankfurt!');
	assert.equal(applyAussprache('Ewa, Frankfurt!', ausspracheFor(voice, script.videoId)), '{Ewa|Eywa}, Frankfurt!');
	assert.ok(!manifest.captions.some((c) => /Eywa/.test(c.text)), 'Untertitel zeigen nie „Eywa“');
});

test('Timing: kurze Pausen, Schnitt am letzten Buchstaben, ≤ 60 s, Übergänge ≤ 10 Frames', () => {
	assert.equal(script.maxPauseMs, 400);
	assert.deepEqual(script.voice.trim, {mode: 'letters', maxInnerGapMs: 320});
	for (const s of script.segments) assert.ok(s.pauseAfterMs <= 150, `${s.id}: pauseAfterMs ${s.pauseAfterMs}`);
	for (const s of TEIL3_SCENES.slice(1)) assert.ok((s.transitionInFrames ?? 0) <= 10, `${s.id}: Übergang zu lang`);
	const tl = erklaertTimelineFor(TEIL3_SCENES, script, manifest, 30);
	assert.ok(tl.durationInFrames <= 1800, `${tl.durationInFrames} Frames`);
	if (isAdam) {
		assert.ok(tl.durationInFrames >= 1650, `zu kurz/leer: ${tl.durationInFrames}`);
		const segs = manifest.segments;
		for (let i = 1; i < segs.length; i++) assert.ok(segs[i].startMs - segs[i - 1].endMs <= 400, `Pause vor ${segs[i].id}: ${segs[i].startMs - segs[i - 1].endMs} ms`);
		for (const c of manifest.captions) {
			const s = segs.find((x) => c.startMs >= x.startMs - 1 && c.startMs < x.endMs);
			assert.ok(s && c.endMs <= s.endMs + 1, `Untertitel „${c.text}“ außerhalb seines Satzes`);
		}
	}
});

test('Titelbild: tiefer gesetzt – Kernzone, 3:4-Profilausschnitt, Untertitel-Band im Video frei, Seitenränder', () => {
	const tops = [L.brandTop, L.numberTop, L.partTop, L.landtagTop, L.kickerTop, L.cardTop, L.subTop, L.metaTop];
	for (const y of tops) assert.ok(y >= COVER_ZONE.coreTop && y <= COVER_ZONE.coreBottom, `y=${y} außerhalb der Kernzone`);
	assert.ok(L.brandTop >= COVER_ZONE.coreTop + 60, 'Serientitel nicht zu hoch (Profilraster schneidet oben ab)');
	assert.ok(L.metaBottom <= COVER_ZONE.videoBottom, 'im Video über den Untertiteln');
	assert.ok(L.chipsBottom <= COVER_ZONE.coreBottom && L.chipsTop >= COVER_ZONE.videoBottom, 'Themenzeile nur im PNG, im Untertitel-Band');
	assert.ok(L.chipsBottom < COVER_ZONE.crop34Bottom && L.brandTop > COVER_ZONE.crop34Top);
	assert.ok(L.sideMin >= COVER_ZONE.side && L.partRight <= COVER_ZONE.rightButtonsX);
	// Schwerpunkt der Coverelemente liegt nahe der Bildmitte (nicht oben): Mitte des Bereichs ≥ 860
	assert.ok((L.brandTop + L.chipsBottom) / 2 >= 860, 'Cover-Schwerpunkt zu hoch');
	assert.equal(COVER.card, '4 FRAGEN BLEIBEN');
	assert.equal(COVER.part, 'TEIL 3');
	const cover = TEIL3_SCENES[0];
	assert.equal(cover.id, 'cover');
	assert.deepEqual(cover.segmentIds, ['hook1', 'hook2']);
});

test('Fazit-Status: nichts als vollständig geklärt markiert; TikTok-Text mit genau 5 Hashtags und Quellen', () => {
	assert.ok(STATUS.every((s) => s.status !== ('GEKLÄRT' as string)));
	assert.equal(STATUS[0].status, 'OFFEN');
	const caption = tiktok.split('## Caption')[1] ?? '';
	const tags = caption.match(/#[\wäöüÄÖÜß]+/g) ?? [];
	assert.equal(tags.length, 5, `Hashtags: ${tags.join(' ')}`);
	assert.ok(caption.trim().length >= 3400 && caption.trim().length <= 4000, `Caption ${caption.trim().length} Zeichen (TikTok-Grenze 4.000)`);
	for (const s of ['hessenschau', 'tagesschau', 'Stadt Frankfurt', '§ 19 StGB', '§ 828 BGB', '§ 832 BGB']) assert.ok(caption.includes(s), `Caption: ${s}`);
	assert.match(caption, /\?\s*\n[\s\S]*#/);
});
