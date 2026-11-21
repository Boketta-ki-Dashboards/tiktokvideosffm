/**
 * „76 Fragen – Teil 4: 4 weitere Antworten“ (FrankfurtErklaert76FragenTeil4):
 * vier Antworten mit Urheber, Kurier-Zahlen nur als Bericht, unbelegte Angaben (160 Durchsuchungen, „vollständig“, „nicht schussfähig“)
 * nicht verwendet, U-Haft ≠ Urteil, verdächtig ≠ verurteilt, Längen-Ausnahme (Info ≤ 61,5 s + Abo-Aufruf), Titelbild in der Kernzone.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {applyAussprache, ausspracheFor, voiceSettingsFor} from '../scripts/lib/aussprache.mjs';
import {COVER_ZONE, FORMAT} from '../src/formats/frankfurt-erklaert/theme.ts';
import {erklaertTimelineFor} from '../src/formats/frankfurt-erklaert/timeline.ts';
import {type VoiceoverManifest} from '../src/lib/script-timing.ts';
import {ANSWERS, COVER, CTA, DAMAGE, JUSTICE, SOURCES, SPOTS, WEAPONS} from '../src/videos/frankfurt-erklaert-76-fragen-teil4/content.ts';
import {TEIL4_COVER_LAYOUT as L} from '../src/videos/frankfurt-erklaert-76-fragen-teil4/cover-layout.ts';
import {TEIL4_KEYWORDS, TEIL4_SCENES} from '../src/videos/frankfurt-erklaert-76-fragen-teil4/plan.ts';

const dir = '../src/videos/frankfurt-erklaert-76-fragen-teil4/';
const read = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8');
const script = JSON.parse(read(`${dir}script.json`));
const manifest: VoiceoverManifest = JSON.parse(read(`${dir}voiceover.json`));
const videos = JSON.parse(read('../config/videos.json'));
const voice = {...JSON.parse(read('../config/voice.json')), ...JSON.parse(read('../config/voice-regeln.json'))};
const sources = read('../references/frankfurt-erklaert-76-fragen-teil4/sources.md');
const tiktok = read('../references/frankfurt-erklaert-76-fragen-teil4/tiktok-text.md');
const teil3 = JSON.parse(read('../src/videos/frankfurt-erklaert-76-fragen-teil3/script.json'));
const display = (t: string) => t.replace(/\{([^|}]*)\|[^}]*\}/g, '$1');
const spoken = (t: string) => t.replace(/\{[^|}]*\|([^}]*)\}/g, '$1');
const seg = (id: string) => display(script.segments.find((s: {id: string}) => s.id === id).text);
const all = script.segments.map((s: {text: string}) => display(s.text)).join(' ');
const isAdam = String(manifest.source).startsWith('elevenlabs');
const cfg = videos.FrankfurtErklaert76FragenTeil4;

test('Vier Antworten in Reihenfolge, je eigene Szene; „weitere Antworten“ statt „ungeklärte Fragen“', () => {
	assert.match(seg('hook2'), /vier weitere wichtige Erkenntnisse/);
	assert.match(seg('p1a'), /^Erstens:/);
	assert.match(seg('p2a'), /^Zweitens:/);
	assert.match(seg('p3a'), /^Drittens:/);
	assert.match(seg('p4a'), /^Viertens:/);
	assert.equal(seg('end'), 'Das waren vier weitere Antworten.');
	assert.doesNotMatch(all + JSON.stringify(COVER), /ungeklärt|bleiben offen|immer noch offen/i);
	assert.equal(COVER.card, '4 WEITERE ANTWORTEN');
	assert.equal(COVER.part, 'TEIL 4');
	assert.equal(COVER.sub, 'Neue Erkenntnisse zur Krawallnacht');
	assert.deepEqual(
		TEIL4_SCENES.map((s) => s.id),
		['cover', 'spots', 'damage', 'weapons', 'justice', 'outro'],
	);
	assert.deepEqual(
		ANSWERS.map((a) => a.num),
		['01', '02', '03', '04'],
	);
	for (const s of TEIL4_SCENES) assert.ok(TEIL4_KEYWORDS[s.id]?.length, `Schlüsselwörter für ${s.id}`);
});

test('Antwort 1: bis zu 30 Einsatzorte laut Polizei – Erklärung, keine Bewertung des Einsatzes', () => {
	assert.equal(SPOTS.max, 30);
	assert.match(seg('p1b'), /^Laut Polizei gab es zeitweise bis zu 30 Einsatzorte gleichzeitig/);
	assert.match(seg('p1c'), /Gassen und Innenhöfe/);
	assert.match(seg('p1d'), /ob alles richtig lief, beantwortet es aber nicht/);
	assert.doesNotMatch(all, /versagt|Versagen|richtig gehandelt|gerechtfertigt|optimal|Schaulustige/i);
	assert.deepEqual([...SPOTS.verdict], ['ERKLÄRUNG', 'BEWERTUNG']);
	assert.match(SPOTS.legend, /belegte Schadensorte \(Auswahl\)/);
	assert.match(SPOTS.legend, /symbolisch/);
	assert.match(SPOTS.source, /© OpenStreetMap-Mitwirkende/);
	assert.ok(SPOTS.points.length >= 8 && SPOTS.points.length <= 12, 'Karte mit 8–12 Brennpunkten');
	for (const s of ['Zeitweise habe es bis zu 30 Einsatzorte gleichzeitig gegeben', 'Das große Gebiet mit seinen zahlreichen Straßen, kleinen Gassen und Innenhöfen habe den Polizeieinsatz erheblich erschwert', 'Hinzu sei die große Zahl an Randalierern gekommen', 'u. a. zum Eschenheimer Tor', '„überwiegend erfolgreich“', 'ergebnisoffen aufarbeiten']) {
		assert.ok(sources.includes(s), `sources.md: „${s}“ fehlt`);
	}
});

test('Antwort 2: Anfangsbilanz 17/5 offiziell, 35/6 + sechsstellig nur als Kurier-Bericht, keine Summe', () => {
	assert.deepEqual([DAMAGE.before.damaged, DAMAGE.before.looted], [17, 5]);
	assert.deepEqual([DAMAGE.after.damaged, DAMAGE.after.looted], [35, 6]);
	assert.ok(DAMAGE.before.looted <= DAMAGE.before.damaged && DAMAGE.after.looted <= DAMAGE.after.damaged, 'Geplünderte sind Teil der Beschädigten');
	assert.match(DAMAGE.before.note, /davon 5 geplündert/);
	assert.match(seg('p2a'), /Anfangsbilanz nannte 17 beschädigte und 5 geplünderte Geschäfte/);
	assert.equal(seg('p2b'), 'Nach einem Bericht des Wiesbadener Kurier nannte Poseck später in der Sitzung 35 beschädigte sowie 6 geplünderte Läden und einen sechsstelligen Schaden.');
	assert.match(DAMAGE.after.when, /laut Wiesbadener Kurier/);
	assert.match(DAMAGE.sumNote, /keine genaue Summe/);
	assert.doesNotMatch(all, /\d[\d.]* ?(Euro|€|Mio|Millionen)/i);
	for (const s of ['Daneben wurden mit aktuellem Stand 17 Geschäfte beschädigt.', 'Insgesamt wurden nach Polizeiangaben fünf Geschäfte geplündert.', 'Bezahlinhalt', 'Volltext für uns nicht einsehbar']) {
		assert.ok(sources.includes(s), `sources.md: „${s}“ fehlt`);
	}
});

test('Antwort 3: Schreckschusswaffen sichergestellt, 18-Jähriger in U-Haft ≠ Verurteilung; nichts Unbelegtes', () => {
	assert.match(seg('p3b'), /^Laut Polizei wurden dort Schreckschusswaffen sichergestellt\.$/);
	assert.match(seg('p3c'), /18-Jähriger kam in Untersuchungshaft – Vorwurf: Diebstahl einer Waffe/);
	assert.equal(seg('p3d'), 'Das ist noch keine Verurteilung.');
	assert.deepEqual([...WEAPONS.equation], ['U-HAFT', 'VERURTEILUNG']);
	assert.doesNotMatch(all + JSON.stringify(WEAPONS), /vollständig|nicht schussfähig|Deko|Syrer|syrisch/i);
	for (const s of ['Dort konnte die Polizei mehrere Personen festnehmen und Schreckschusswaffen sicherstellen.', 'Ihm wird vorgeworfen, eine Waffe aus einem Waffengeschäft gestohlen zu haben', 'Das Amtsgericht Frankfurt erließ auf Antrag der Staatsanwaltschaft einen Haftbefehl.']) {
		assert.ok(sources.includes(s), `sources.md: „${s}“ fehlt`);
	}
});

test('Antwort 4: 110 / 53 / 73 mit Urheber, nicht addiert, verdächtig ≠ verurteilt; 160 Durchsuchungen nicht verwendet', () => {
	assert.deepEqual(
		JUSTICE.steps.map((s) => s.n),
		[110, 53, 73],
	);
	assert.match(seg('p4a'), /^Viertens: Laut Polizei gab es 110 Strafanzeigen und 53 Festnahmen\.$/);
	assert.match(seg('p4b'), /Der Minister zählt 73 Tatverdächtige/);
	assert.equal(seg('p4c'), 'Aber verdächtig heißt nicht verurteilt.');
	assert.deepEqual([...JUSTICE.equation], ['VERDÄCHTIG', 'VERURTEILT']);
	assert.match(JUSTICE.note, /Unschuldsvermutung/);
	assert.doesNotMatch(all + JSON.stringify(JUSTICE), /160|Durchsuchung|236/);
	assert.match(read(`${dir}scenes/Scenes.tsx`), /nicht einfach addieren/);
	for (const s of ['von zunächst 87 auf 110', 'Die Zahl der Anzeigen summierte sich auf 110.', 'insgesamt 53 Menschen festgenommen', 'beläuft sich die Zahl der Tatverdächtigen aktuell auf 73 Personen', '„160 Durchsuchungen“']) {
		assert.ok(sources.includes(s), `sources.md: „${s}“ fehlt`);
	}
	for (const s of SOURCES) assert.ok(sources.includes(s.url), `sources.md: ${s.url}`);
});

test('Abo-Aufruf: „Folgt FrankfurtRed3 für mehr“ (gesprochen „Frankfurt Rett Drei“), kein „Plus weg“', () => {
	const cta = script.segments.at(-1);
	assert.equal(cta.id, 'cta');
	assert.equal(display(cta.text), 'Folgt FrankfurtRed3 für mehr.');
	assert.equal(spoken(cta.text), 'Folgt Frankfurt Rett Drei für mehr.');
	assert.doesNotMatch(JSON.stringify(script), /Plus weg|Plus wegmachen/i);
	assert.equal(CTA.title, 'FOLGT FÜR MEHR');
	assert.ok(!manifest.captions.some((c) => /Rett|Drei/.test(c.text)), 'Untertitel zeigen „FrankfurtRed3“, nicht die Lautschrift');
});

test('Länge (begründete Ausnahme): Informationsteil 58–61,5 s, Abo-Aufruf 3–4 s, gesamt 62–65 s (≤ 66 s)', () => {
	assert.equal(cfg.maxSeconds, 66);
	assert.equal(cfg.infoMaxSeconds, FORMAT.infoMaxSeconds);
	assert.ok(cfg.ausnahme.length > 20);
	assert.equal(cfg.maxPauseMs, 400);
	const tl = erklaertTimelineFor(TEIL4_SCENES, script, manifest, 30, cfg.maxSeconds);
	assert.ok(tl.durationInFrames <= cfg.maxSeconds * 30, `${tl.durationInFrames} Frames`);
	if (isAdam) {
		const segs = manifest.segments;
		const info = segs.filter((s) => s.id !== 'cta');
		const infoEnd = info[info.length - 1].endMs;
		const cta = segs.find((s) => s.id === 'cta')!;
		assert.ok(infoEnd >= 58000 && infoEnd <= cfg.infoMaxSeconds * 1000, `Informationsteil ${infoEnd} ms`);
		const total = (tl.durationInFrames / 30) * 1000;
		assert.ok(total >= 62000 && total <= 65000, `gesamt ${total} ms`);
		const ctaPart = total - cta.startMs;
		assert.ok(ctaPart >= 3000 && ctaPart <= 4000, `Abo-Aufruf ${ctaPart} ms`);
		for (let i = 1; i < segs.length; i++) assert.ok(segs[i].startMs - segs[i - 1].endMs <= 400, `Pause vor ${segs[i].id}`);
		for (const c of manifest.captions) {
			const s = segs.find((x) => c.startMs >= x.startMs - 1 && c.startMs < x.endMs);
			assert.ok(s && c.endMs <= s.endMs + 1, `Untertitel „${c.text}“ außerhalb seines Satzes`);
		}
		// Antwort 1 ist der längste Abschnitt (≈ 18–20 s)
		const scene = (id: string) => tl.scenes.find((s) => s.id === id)!;
		const len = (id: string) => scene(id).durationInFrames / 30;
		assert.ok(len('spots') >= 17 && len('spots') <= 20.5, `Antwort 1: ${len('spots')} s`);
		for (const id of ['damage', 'weapons', 'justice']) assert.ok(len(id) < len('spots'), `${id} länger als Antwort 1`);
	}
	for (const s of TEIL4_SCENES.slice(1)) assert.ok((s.transitionInFrames ?? 0) <= 10, `${s.id}: Übergang zu lang`);
});

test('Stimme: Adam kurzformat-60 (1.20), Ewa → Eywa nur gesprochen; Teil 3 unverändert', () => {
	assert.equal(script.voice.profile, 'kurzformat-60');
	const vs = voiceSettingsFor(voice, script);
	assert.deepEqual(vs, {...voice.elevenlabs.voiceSettings, speed: 1.2});
	assert.equal(voice.elevenlabs.voiceSettings.speed, 1.16);
	assert.deepEqual(script.voice.trim, {mode: 'letters', maxInnerGapMs: 320});
	if (isAdam) assert.equal((manifest as unknown as {voice: {voiceId: string}}).voice.voiceId, 'pNInz6obpgDQGcFmaJgB');
	assert.equal(seg('hook1'), 'Ewa, Frankfurt!');
	assert.equal(applyAussprache('Ewa, Frankfurt!', ausspracheFor(voice, script.videoId)), '{Ewa|Eywa}, Frankfurt!');
	assert.ok(!manifest.captions.some((c) => /Eywa/.test(c.text)));
	assert.ok(teil3.segments.some((s: {text: string}) => s.text === 'Der Gesamtschaden ist bisher nicht offiziell beziffert.'), 'Teil 3 bleibt unverändert');
});

test('Titelbild: tiefer gesetzt – Kernzone, 3:4-Ausschnitt, Untertitel-Band frei, rote Karte vor den App-Knöpfen', () => {
	const tops = [L.brandTop, L.numberTop, L.partTop, L.landtagTop, L.kickerTop, L.cardTop, L.subTop, L.metaTop];
	for (const y of tops) assert.ok(y >= COVER_ZONE.coreTop && y <= COVER_ZONE.coreBottom, `y=${y} außerhalb der Kernzone`);
	assert.ok(L.brandTop >= COVER_ZONE.coreTop + 100, 'Serientitel tiefer als bei Teil 3');
	assert.ok(L.metaBottom <= COVER_ZONE.videoBottom, 'im Video über den Untertiteln');
	assert.ok(L.chipsTop >= COVER_ZONE.videoBottom && L.chipsBottom <= COVER_ZONE.coreBottom, 'Antwortzeile nur im PNG');
	assert.ok(L.sideMin >= COVER_ZONE.side && L.partRight <= COVER_ZONE.rightButtonsX);
	assert.ok(540 + L.cardMaxWidth / 2 <= COVER_ZONE.rightButtonsX - 10, 'rote Karte endet vor den App-Knöpfen');
	assert.ok((L.brandTop + L.chipsBottom) / 2 >= 900, 'Cover-Schwerpunkt nahe Bildmitte');
	assert.deepEqual(TEIL4_SCENES[0].segmentIds, ['hook1', 'hook2']);
	assert.ok(read(`${dir}FrankfurtErklaert76FragenTeil4CoverVorschau.tsx`).includes('4 WEITERE ANTWORTEN'), 'Prüfbogen zeigt den Teil-4-Titel');
});

test('TikTok-Text: Titel, Caption ≤ 4.000 Zeichen mit Quellen, Diskussionsfrage und genau 5 Hashtags', () => {
	assert.match(tiktok, /## Titel\s+76 FRAGEN – 4 WEITERE ANTWORTEN! 🚨/);
	const caption = (tiktok.split('## Caption')[1] ?? '').trim();
	assert.ok(caption.length >= 3000 && caption.length <= 4000, `Caption ${caption.length} Zeichen`);
	const tags = caption.match(/#[\wäöüÄÖÜß]+/g) ?? [];
	assert.equal(tags.length, 5, tags.join(' '));
	for (const s of ['hessenschau', 'Innenministerium', 'Justizministerium', 'Wiesbadener Kurier', 'Bezahlinhalt', 'Unschuldsvermutung']) assert.ok(caption.includes(s), `Caption: ${s}`);
	assert.match(caption, /\?\s*\n\s*#/);
	assert.doesNotMatch(caption, /160|vollständig sichergestellt|nicht schussfähig|ungeklärt/i);
});
