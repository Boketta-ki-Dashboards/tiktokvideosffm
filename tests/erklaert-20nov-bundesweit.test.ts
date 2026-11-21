/**
 * „73 Städte – ein Protesttag! Was passiert morgen?“ (FrankfurtErklaert20NovemberBundesweit, #12, produziert 19.11.2026 für Freitag, 20.11.2026):
 * Stadtzahl aus der Website (73, nicht die 54 aus dem Auftrag) überall gleich (Ton, Bild, Titelbild, Titel, Caption), 4 zentral / 69 angeschlossen,
 * Frankfurt/Köln nur als Planungszahlen mit Urheber, drei Arten von Zahlen getrennt, keine Krawall-Spekulation, keine Werbung für die Initiative,
 * Koordinaten echte Treffpunkte (Extrempunkte stimmen mit dem Ton überein), Quellenzeile UNTER den Untertiteln (neue Format-Regel),
 * hartes Limit 60 s, Kopfzeile oben rechts, Titelbild nach COVER_ZONE.
 */
import assert from 'node:assert/strict';
import {readdirSync, readFileSync} from 'node:fs';
import {test} from 'node:test';
import {applyAussprache, ausspracheFor, voiceSettingsFor} from '../scripts/lib/aussprache.mjs';
import {resolveSourceLine, sourceLineHeight, SOURCE_LINE_BOX} from '../src/formats/frankfurt-erklaert/source-line.ts';
import {COVER_ZONE, FORMAT, LAYOUT} from '../src/formats/frankfurt-erklaert/theme.ts';
import {erklaertTimelineFor} from '../src/formats/frankfurt-erklaert/timeline.ts';
import {type VoiceoverManifest} from '../src/lib/script-timing.ts';
import {type City, CENTRAL_IDS, CITY_COUNT, COMPARE, COVER, DEMANDS, EXTREMES, LOCAL_COUNT, NUMBER_KINDS, PLEDGES, SOURCE_LINE, STAND} from '../src/videos/frankfurt-erklaert-20nov-bundesweit/content.ts';
import {BUNDESWEIT_COVER_LAYOUT as L} from '../src/videos/frankfurt-erklaert-20nov-bundesweit/cover-layout.ts';
import {BUNDESWEIT_KEYWORDS, BUNDESWEIT_SCENES} from '../src/videos/frankfurt-erklaert-20nov-bundesweit/plan.ts';

const dir = '../src/videos/frankfurt-erklaert-20nov-bundesweit/';
const ref = '../references/frankfurt-erklaert-20nov-bundesweit/';
const read = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8');
const script = JSON.parse(read(`${dir}script.json`));
const manifest: VoiceoverManifest = JSON.parse(read(`${dir}voiceover.json`));
const videos = JSON.parse(read('../config/videos.json'));
const voice = {...JSON.parse(read('../config/voice.json')), ...JSON.parse(read('../config/voice-regeln.json'))};
const sources = read(`${ref}sources.md`);
const tiktok = read(`${ref}tiktok-text.md`);
const counter = JSON.parse(read(`${ref}zusagen-zaehler.json`));
const staedte = JSON.parse(read(`${dir}data/staedte.json`));
const CITIES: City[] = staedte.cities;
const scenesSrc = read(`${dir}scenes/Scenes.tsx`);
const compSrc = read(`${dir}FrankfurtErklaert20NovemberBundesweit.tsx`);
const display = (t: string) => t.replace(/\{([^|}]*)\|[^}]*\}/g, '$1');
const spoken = (t: string) => t.replace(/\{[^|}]*\|([^}]*)\}/g, '$1');
const seg = (id: string) => display(script.segments.find((s: {id: string}) => s.id === id).text);
const all = script.segments.map((s: {text: string}) => display(s.text)).join(' ');
const isAdam = String(manifest.source).startsWith('elevenlabs');
const cfg = videos.FrankfurtErklaert20NovemberBundesweit;

test('Dramaturgie: Titelbild → Karte (73, 4 zentral/69 angeschlossen) → Frankfurt vs. Köln → 3 Arten Zahlen → Forderungen → Frage → Abo-Aufruf', () => {
	assert.deepEqual(BUNDESWEIT_SCENES.map((s) => s.id), ['cover', 'map', 'compare', 'numbers', 'demands', 'end', 'outro']);
	assert.deepEqual(script.segments.map((s: {id: string}) => s.id), ['hook1', 'hook2', 'k1', 'z1', 'z2', 'f1', 'k2', 'n1', 'n2', 'n3', 'd1', 'e1', 'q1', 'cta']);
	assert.deepEqual(BUNDESWEIT_SCENES.flatMap((s) => s.segmentIds), script.segments.map((s: {id: string}) => s.id), 'jeder Satz genau einer Szene zugeordnet');
	for (const s of BUNDESWEIT_SCENES) assert.ok(BUNDESWEIT_KEYWORDS[s.id]?.length, `Schlüsselwörter für ${s.id}`);
	for (const s of BUNDESWEIT_SCENES.slice(1)) assert.ok((s.transitionInFrames ?? 0) <= 10);
	assert.match(seg('e1'), /^Morgen zeigt sich/);
	assert.equal(seg('q1'), 'Welche Stadt wird am größten?');
});

test('Stadtzahl: 73 laut Website (Liste mit genau 73 Einträgen) – dieselbe Zahl in Ton, Bild, Titelbild, Titel und Caption; die 54 aus dem Auftrag nirgends', () => {
	assert.equal(staedte.cities.length, 73);
	assert.equal(staedte.count, 73);
	assert.equal(CITY_COUNT, 73);
	assert.equal(new Set(CITIES.map((c) => c.id)).size, 73);
	assert.ok(sources.includes('Protest am 20.11. in 73 Städten'), 'Seitentitel wörtlich belegt');
	assert.ok(sources.includes('Freitag, 20. November 2026 · ab 14 Uhr in 73 Städten'));
	assert.match(script.segments.find((s: {id: string}) => s.id === 'hook2').text, /\{73\|dreiundsiebzig\} Städte/);
	assert.equal(COVER.big, '73');
	assert.match(tiktok, /## Titel\s+73 STÄDTE – EIN PROTESTTAG! WAS PASSIERT MORGEN\? 🚨/);
	assert.match(tiktok, /in 73 Städten/);
	for (const t of [all, tiktok, COVER.big, COVER.card, scenesSrc, read(`${dir}content.ts`)]) assert.doesNotMatch(t, /\b54 (Städte|STÄDTE)|'54'/, 'veraltete Zahl 54 aus dem Auftrag');
	assert.match(sources, /Der Auftrag nannte 54 Städte/, 'Abweichung dokumentiert');
	assert.match(STAND, /19\.11\.2026, 14 Uhr/);
	assert.match(seg('k1'), /Stand: Donnerstagmittag\.$/);
});

test('Karte: echte Treffpunkt-Koordinaten in Deutschland; Extrempunkte (Kiel, Lörrach, Aachen, Cottbus) stimmen mit dem Ton überein', () => {
	for (const c of CITIES) {
		assert.ok(c.lat > 47.2 && c.lat < 55.1 && c.lon > 5.8 && c.lon < 15.1, `${c.name} liegt in Deutschland`);
	}
	const byLat = [...CITIES].sort((a, b) => b.lat - a.lat);
	const byLon = [...CITIES].sort((a, b) => a.lon - b.lon);
	assert.equal(byLat[0].id, EXTREMES.north);
	assert.equal(byLat.at(-1)!.id, EXTREMES.south);
	assert.equal(byLon[0].id, EXTREMES.west);
	assert.equal(byLon.at(-1)!.id, EXTREMES.east);
	assert.equal(seg('k1').replace(/ – .*/, ''), 'Von Kiel bis Lörrach, von Aachen bis Cottbus');
	// Plausibilität: bekannte Städte nahe ihrer echten Lage (Toleranz 0,15°)
	const near = (id: string, lat: number, lon: number) => {
		const c = CITIES.find((x) => x.id === id)!;
		assert.ok(Math.abs(c.lat - lat) < 0.15 && Math.abs(c.lon - lon) < 0.15, `${id} ${c.lat}/${c.lon}`);
	};
	near('berlin', 52.52, 13.41);
	near('frankfurt', 50.11, 8.68);
	near('muenchen', 48.14, 11.58);
	near('koeln', 50.94, 6.96);
	near('hamburg', 53.55, 10.0);
	// „Standort folgt“ nur Göttingen und Gladbeck
	assert.deepEqual(CITIES.filter((c) => c.pending).map((c) => c.id).sort(), ['gladbeck', 'goettingen']);
	assert.match(scenesSrc, /GermanyPlane/);
});

test('Zentral vs. angeschlossen: genau die 4 Städte laut Website, 69 angeschlossen mit lokaler Verantwortung', () => {
	assert.deepEqual(CITIES.filter((c) => c.central).map((c) => c.id).sort(), [...CENTRAL_IDS].sort());
	assert.equal(LOCAL_COUNT, 69);
	assert.match(seg('z1'), /nur vier – Berlin, Frankfurt, München und Köln\.$/);
	assert.match(script.segments.find((s: {id: string}) => s.id === 'z2').text, /\{69\|neunundsechzig\}/);
	assert.match(seg('z2'), /lokale Gruppen zuständig/);
	assert.ok(sources.includes('Weiß: Städte, die sich der Initiative Gen Z regelt\n  angeschlossen haben (wir sind nicht für Inhalt und Organisation zuständig)') || sources.includes('wir sind nicht für Inhalt und Organisation zuständig'));
	assert.ok(sources.includes('Unsere 4 Städte – Hier organisiert Gen Z regelt Inhalte und Ablauf.'));
});

test('Frankfurt vs. Köln: nur Planungszahlen mit Urheber – „erwartet“ statt „angemeldet“ für Frankfurt, Polizei Köln wörtlich, Stempel „keine tatsächliche Teilnehmerzahl“', () => {
	assert.match(seg('f1'), /erwartet die Stadt bis zu 4\.000/);
	assert.doesNotMatch(seg('f1'), /angemeldet/, 'Frankfurt: Quellen sagen „erwartet“');
	assert.match(seg('k2'), /rechnen die Anmelderinnen laut Polizei mit 5\.000 bis 10\.000/);
	assert.match(seg('k2'), /Deutzer Werft statt in der Innenstadt/);
	assert.ok(sources.includes('Die Versammlungsanmelderinnen rechnen mit 5.000 bis 10.000 Teilnehmenden'));
	assert.ok(sources.includes('hat die Polizei diese Streckenführung abgelehnt und alternativ die Deutzer Werft'));
	assert.ok(sources.includes('Erwartet werden bis zu 4.000 Menschen'));
	assert.equal(COMPARE.frankfurt.max, 4000);
	assert.deepEqual([COMPARE.koeln.min, COMPARE.koeln.max], [5000, 10000]);
	assert.match(COMPARE.frankfurt.kind, /ERWARTET · LAUT STADT/);
	assert.match(COMPARE.koeln.kind, /LAUT POLIZEI KÖLN/);
	assert.equal(COMPARE.stamp, 'ANGABEN ZUR PLANUNG');
	assert.equal(COMPARE.stampSub, 'KEINE TATSÄCHLICHE TEILNEHMERZAHL');
	assert.match(seg('n1'), /Planungszahlen, keine Zählung/);
	// Zähler laufen vom Erscheinen bis zum gesprochenen Wert
	assert.match(scenesSrc, /CountUp value=\{d\.max\} at=\{at\} dur=\{Math\.max\(14, atNum - at \+ 4\)\}/);
});

test('Drei Arten von Zahlen getrennt: Online-Zusagen (Zähler, „keine Garantie“) · Anmeldung/Erwartung · tatsächlich offen', () => {
	assert.deepEqual(NUMBER_KINDS.map((k) => k.id), ['online', 'plan', 'real']);
	assert.match(seg('n2'), /Bundesweit rund 20\.000 – laut Website keine Garantie/);
	assert.match(seg('n3'), /erst morgen/);
	assert.ok(sources.includes(PLEDGES.disclaimer), 'Hinweis der Website wörtlich');
	const last = counter.abrufe.at(-1);
	assert.ok(Math.abs(last.total - PLEDGES.total) / PLEDGES.total < 0.03, `„rund 20.000“ passt zum Zähler (${last.total})`);
	for (const c of PLEDGES.cities) {
		const key = {Frankfurt: 'frankfurt', Köln: 'koeln', Berlin: 'berlin', München: 'muenchen'}[c.name] as string;
		const shown = Number(c.value.replace(/[^\d]/g, ''));
		assert.ok(Math.abs(last[key] - shown) <= 100, `${c.name}: ${c.value} vs. ${last[key]}`);
	}
	assert.equal(NUMBER_KINDS[2].value, 'NOCH OFFEN');
});

test('Inhaltliche Leitplanken: keine Werbung, keine Krawall-Spekulation, keine Wiederholung der Frankfurter Polizeiplanung; Forderungen als Position', () => {
	assert.doesNotMatch(all, /Ticket hol|kommt alle|seid dabei|macht mit|geht hin|Krawall|Ausschreitung|Gewalt|Plünder|Pyro|Polizeikräfte|Einsatzkräfte|Aufenthaltsverbot|Meldeauflage/i);
	assert.doesNotMatch(tiktok, /Krawall|Ausschreitung|Gewaltaufruf|Kontrollstelle|Einsatzkräfte|holt euch|Ticket holen/i);
	assert.match(seg('d1'), /^Die Forderungen laut Website: Geld für Bildung, ein bezahlbares Leben – und Nein zur Wehrpflicht\.$/);
	assert.equal(DEMANDS.items.length, 3);
	assert.match(DEMANDS.kind, /POSITION · LAUT WEBSITE/);
	assert.match(sources, /Geld für Schulen, Suchthilfe und Psychotherapie statt Kürzungen/);
	assert.match(sources, /Nein zur Wehrpflicht\. Über unsere Zukunft entscheidet niemand ohne uns\./);
	assert.match(sources, /## Bewusst NICHT verwendet/);
	assert.match(sources, /Laufdemo 15:30–17 Uhr: Hauptbahnhof/, 'Abweichende Website-Angabe dokumentiert');
});

test('Quellenzeile UNTER den Untertiteln: jedes Segment mit Quelle abgedeckt, kurze Labels statt URLs, höchstens 2 Zeilen', () => {
	assert.match(compSrc, /sourceLine: \[\.\.\.SOURCE_LINE\]/);
	assert.doesNotMatch(scenesSrc, /SourceBar/, 'keine alte Quellenzeile über den Untertiteln');
	const ids = script.segments.map((s: {id: string}) => s.id);
	for (const s of SOURCE_LINE) {
		assert.ok(ids.includes(s.from), `Segment ${s.from}`);
		assert.doesNotMatch(s.text, /https?:\/\/|www\./, 'kein URL');
		assert.ok(s.text.length <= 112, `höchstens 2 Zeilen: ${s.text.length} Zeichen`);
	}
	const entries = resolveSourceLine([...SOURCE_LINE], manifest, 30, {start: 48, end: 1800});
	assert.ok(entries[0].from >= 48, 'nicht auf dem Titelbild-Frame 0');
	for (let i = 1; i < entries.length; i++) assert.equal(entries[i].from, entries[i - 1].to, 'lückenlos');
	assert.ok(entries.every((e) => e.to > e.from));
	assert.match(SOURCE_LINE.find((s) => s.from === 'k2')!.text, /Polizei Köln/);
	assert.match(SOURCE_LINE.find((s) => s.from === 'n2')!.text, /Zusagen-Zähler/);
	assert.ok(sourceLineHeight(2) + LAYOUT.sourceLineTop <= LAYOUT.sourceLineMaxBottom);
	assert.ok(SOURCE_LINE_BOX.left + SOURCE_LINE_BOX.width <= COVER_ZONE.rightButtonsX, 'links der App-Knöpfe');
});

test('Stimme: Adam kurzformat-60, Ewa → Eywa, „Gen Z regelt“ nach Doppelpunkt in Lautschrift, Zahlen ausgeschrieben, Abo-Aufruf aus #11-Cache', () => {
	assert.equal(script.voice.profile, 'kurzformat-60');
	assert.deepEqual(voiceSettingsFor(voice, script), {...voice.elevenlabs.voiceSettings, speed: 1.2});
	assert.equal(voice.elevenlabs.voiceSettings.speed, 1.16);
	assert.equal(seg('hook1'), 'Ewa, Frankfurt!');
	assert.equal(applyAussprache('Ewa, Frankfurt!', ausspracheFor(voice, script.videoId)), '{Ewa|Eywa}, Frankfurt!');
	assert.match(script.segments.find((s: {id: string}) => s.id === 'hook2').text, /dran: \{Gen Z regelt\|Dschen Zett regelt\}/);
	for (const s of script.segments) {
		assert.doesNotMatch(spoken(s.text), /\d/, `${s.id}: Zahlen ausgeschrieben`);
		assert.doesNotMatch(spoken(s.text), /(zwei|der) Dschen/i, `${s.id}: „Gen Z“ nicht nach „zwei“/„der“`);
	}
	const cta = script.segments.at(-1);
	assert.equal(cta.id, 'cta');
	assert.equal(display(cta.text), 'Folgt FrankfurtRed3 für mehr!');
	assert.equal(spoken(cta.text), 'Folgt Frankfurt Rett Drei für mehr!');
	const cache = readdirSync(new URL('../voice-cache/elevenlabs/frankfurt-erklaert-20nov-bundesweit/', import.meta.url));
	for (const k of ['f50850868202c0738f23', '61e51d89dc2c0f05aaa7']) assert.ok(cache.includes(`${k}.mp3`), `geprüfte Aufnahme ${k} vorab im Cache`);
	const chars = script.segments.reduce((n: number, s: {text: string}) => n + spoken(s.text).length, 0);
	assert.ok(chars <= 1020, `≤ 1.020 gesprochene Zeichen (${chars})`);
	const slang = (all.match(/Leute|steht's|gibt's|dran/g) ?? []).length;
	assert.ok(slang >= 2 && slang <= 4, `Slang ${slang}`);
	assert.ok(!manifest.captions.some((c) => /Eywa|Dschen|Rett|dreiundsiebzig|neunundsechzig|zwanzigtausend/.test(c.text)), 'Untertitel zeigen nur die Anzeige-Schreibweise');
	if (isAdam) assert.equal((manifest as unknown as {voice: {voiceId: string}}).voice.voiceId, 'pNInz6obpgDQGcFmaJgB');
});

test('Länge: hartes Limit 60 s = 1.800 Frames inkl. Intro und Abo-Aufruf; Pausen ≤ 400 ms; Untertitel im Satz', () => {
	assert.equal(cfg.maxSeconds, FORMAT.maxSeconds);
	assert.equal(cfg.maxSeconds, 60);
	assert.equal(cfg.ausnahme, undefined);
	assert.equal(cfg.sonderausnahme, undefined);
	assert.equal(cfg.maxPauseMs, 400);
	assert.equal(cfg.outputName, 'FrankfurtRed3_20November_Bundesweit_ADAM_FINAL');
	assert.equal(cfg.thumbnailName, 'FrankfurtRed3_20November_Bundesweit_THUMBNAIL');
	assert.match(compSrc, /maxSeconds: videos\.FrankfurtErklaert20NovemberBundesweit\.maxSeconds/);
	const tl = erklaertTimelineFor(BUNDESWEIT_SCENES, script, manifest, 30, cfg.maxSeconds);
	assert.ok(tl.durationInFrames <= 1800, `${tl.durationInFrames} Frames`);
	if (isAdam) {
		const segs = manifest.segments;
		for (let i = 1; i < segs.length; i++) assert.ok(segs[i].startMs - segs[i - 1].endMs <= 400, `Pause vor ${segs[i].id}`);
		for (const c of manifest.captions) {
			const s = segs.find((x) => c.startMs >= x.startMs - 1 && c.startMs < x.endMs);
			assert.ok(s && c.endMs <= s.endMs + 1, `Untertitel „${c.text}“ außerhalb seines Satzes`);
		}
	}
});

test('Kopfzeile oben rechts + TopTag; Prüfbögen (Titelbild, Overlay, Quellenzeile) registriert; Workflow-Option', () => {
	assert.match(compSrc, /badgePlacement: 'top-right'/);
	assert.match(compSrc, /episode: '#12'/);
	assert.match(scenesSrc, /<TopTag /);
	for (const m of scenesSrc.matchAll(/top: (3\d\d)[,}]/g)) assert.ok(Number(m[1]) >= LAYOUT.badgeTopRight + LAYOUT.topBarHeight, `Inhalt bei y ${m[1]} unter der Kopfzeile`);
	const root = read('../src/Root.tsx');
	for (const id of ['FrankfurtErklaert20NovemberBundesweit', 'FrankfurtErklaert20NovemberBundesweit-Cover', 'FrankfurtErklaert20NovemberBundesweit-CoverVorschau', 'FrankfurtErklaert20NovemberBundesweit-OverlayCheck', 'FrankfurtErklaert20NovemberBundesweit-QuellenCheck']) {
		assert.ok(root.includes(`id="${id}"`), id);
	}
	assert.match(read('../.github/workflows/video-produzieren.yml'), /- FrankfurtErklaert20NovemberBundesweit/);
	assert.match(scenesSrc, /<BrandLogo size=\{250\}/);
	assert.match(scenesSrc, /<BrandLogo size=\{52\} \/>/);
	assert.doesNotMatch(scenesSrc, /BrandAvatar|@frankfurtred3/);
	assert.match(read(`${dir}FrankfurtErklaert20NovemberBundesweitCoverVorschau.tsx`), /avatar=\{\(s\) => <BrandLogo/);
	assert.match(scenesSrc, /ILLUSTRATION|COMPARE\.illustration/);
});

test('Titelbild: Kernzone, 3:4-Ausschnitt, Zeile vor den App-Knöpfen, Untertitel-Band im Video frei', () => {
	const tops = [L.brandTop, L.bigTop, L.cardTop, L.dateTop, L.splitTop, L.metaTop];
	for (const y of tops) assert.ok(y >= COVER_ZONE.coreTop && y <= COVER_ZONE.coreBottom, `y=${y}`);
	assert.ok(L.brandTop >= 390, 'Serientitel nicht zu hoch');
	assert.ok(L.brandBottom <= L.bigTop && L.bigBottom <= L.cardTop && L.cardBottom <= L.dateTop && L.dateBottom <= L.splitTop && L.splitBottom <= L.metaTop);
	assert.ok(L.splitBottom <= COVER_ZONE.rightButtonsTop, 'Zeile endet über den App-Knöpfen');
	assert.ok(540 + L.splitMaxWidth / 2 <= COVER_ZONE.rightButtonsX + 40 && L.splitMaxWidth <= 1080 - 2 * COVER_ZONE.side);
	assert.ok(L.metaBottom <= COVER_ZONE.videoBottom);
	assert.ok(L.questionTop >= COVER_ZONE.videoBottom && L.questionBottom <= COVER_ZONE.coreBottom);
	assert.ok(L.bigMaxWidth <= 1080 - 2 * COVER_ZONE.side && L.cardMaxWidth <= 1080 - 2 * COVER_ZONE.side);
	assert.ok(L.sideMin >= COVER_ZONE.side);
	assert.ok(L.bigSize >= 58 * 2);
	assert.equal(COVER.card, 'STÄDTE – EIN PROTESTTAG');
	assert.equal(COVER.date, 'FREITAG · 20. NOVEMBER 2026');
	assert.equal(COVER.split, '4 ZENTRAL · 69 ANGESCHLOSSEN');
});

test('TikTok-Text: Titel, Caption ≤ 4.000 Zeichen, genau die 5 vorgegebenen Hashtags, Kernfakten mit Urheber, Frage am Ende', () => {
	const caption = (tiktok.split('## Caption')[1] ?? '').trim();
	assert.ok(caption.length >= 1200 && caption.length <= 4000, `Caption ${caption.length}`);
	assert.deepEqual(caption.match(/#[\wäöüÄÖÜß]+/g), ['#Frankfurt', '#GenZRegelt', '#Deutschland', '#20112026', '#FYP']);
	for (const s of ['73 Städten', 'Kiel', 'Lörrach', 'Berlin, Frankfurt, München und Köln', '69', 'laut Stadt', 'bis zu 4.000', 'Polizei Köln', '5.000 bis 10.000', 'Deutzer Werft', 'rund 20.000', 'keine Garantie', 'Bildung', 'bezahlbares Leben', 'Wehrpflicht', '19.11.2026']) {
		assert.ok(caption.includes(s), `Caption: ${s}`);
	}
	assert.match(caption, /Welche Stadt wird am größten\?\s*\n\s*#/);
});
