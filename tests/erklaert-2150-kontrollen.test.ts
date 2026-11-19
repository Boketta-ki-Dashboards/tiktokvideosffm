/**
 * „Über 2.150 Kontrollen auf der Zeil – was hat die Polizei gefunden?“ (FrankfurtErklaert2150Kontrollen, #13, produziert 19.11.2026):
 * Bilanz des Innenministeriums vom 18.11. wörtlich belegt (über 2.150 / 78 / 435 / 182, Gegenstände mit exakten Mengen), Leitplanken
 * kontrolliert ≠ schuldig · Anzeige ≠ Verurteilung · Ordnungswidrigkeit ≠ Straftat · Platzverweis ≠ Festnahme · nicht addieren,
 * 2 durch die Kontrollen identifizierte Halloween-Tatverdächtige getrennt von den insgesamt 99, Kritik und Bewertung als POSITION,
 * keine Wiederholung der Polizeiplanung für den 20.11., Quellenzeile unter den Untertiteln, hartes Limit 60 s, Kopfzeile oben rechts.
 */
import assert from 'node:assert/strict';
import {readdirSync, readFileSync} from 'node:fs';
import {test} from 'node:test';
import {applyAussprache, ausspracheFor, voiceSettingsFor} from '../scripts/lib/aussprache.mjs';
import {resolveSourceLine} from '../src/formats/frankfurt-erklaert/source-line.ts';
import {COVER_ZONE, FORMAT, LAYOUT} from '../src/formats/frankfurt-erklaert/theme.ts';
import {erklaertTimelineFor} from '../src/formats/frankfurt-erklaert/timeline.ts';
import {type VoiceoverManifest} from '../src/lib/script-timing.ts';
import {CONTROLS, COVER, DEBATE, ITEMS, NO_SUM, QUOTES, SOURCE_LINE, STATS, SUSPECTS} from '../src/videos/frankfurt-erklaert-2150-kontrollen/content.ts';
import {KONTROLLEN_COVER_LAYOUT as L} from '../src/videos/frankfurt-erklaert-2150-kontrollen/cover-layout.ts';
import {KONTROLLEN_KEYWORDS, KONTROLLEN_SCENES} from '../src/videos/frankfurt-erklaert-2150-kontrollen/plan.ts';

const dir = '../src/videos/frankfurt-erklaert-2150-kontrollen/';
const ref = '../references/frankfurt-erklaert-2150-kontrollen/';
const read = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8');
const script = JSON.parse(read(`${dir}script.json`));
const manifest: VoiceoverManifest = JSON.parse(read(`${dir}voiceover.json`));
const videos = JSON.parse(read('../config/videos.json'));
const voice = {...JSON.parse(read('../config/voice.json')), ...JSON.parse(read('../config/voice-regeln.json'))};
const sources = read(`${ref}sources.md`);
const tiktok = read(`${ref}tiktok-text.md`);
const scenesSrc = read(`${dir}scenes/Scenes.tsx`);
const compSrc = read(`${dir}FrankfurtErklaert2150Kontrollen.tsx`);
const display = (t: string) => t.replace(/\{([^|}]*)\|[^}]*\}/g, '$1');
const spoken = (t: string) => t.replace(/\{[^|}]*\|([^}]*)\}/g, '$1');
const seg = (id: string) => display(script.segments.find((s: {id: string}) => s.id === id).text);
const all = script.segments.map((s: {text: string}) => display(s.text)).join(' ');
const isAdam = String(manifest.source).startsWith('elevenlabs');
const cfg = videos.FrankfurtErklaert2150Kontrollen;

test('Dramaturgie: Titelbild → Zeil (2.150+, kontrolliert ≠ schuldig) → 78/435/182 → Sicherstellungen → Ermittlungen → Debatte + Ausblick → Frage + Abo', () => {
	assert.deepEqual(KONTROLLEN_SCENES.map((s) => s.id), ['cover', 'zeil', 'stats', 'items', 'suspects', 'debate', 'outro']);
	assert.deepEqual(script.segments.map((s: {id: string}) => s.id), ['hook1', 'z1', 'z2', 'b1', 'b2', 'b3', 'g1', 'h1', 'h2', 'p1', 'p2', 'w1', 'q1', 'cta']);
	assert.deepEqual(KONTROLLEN_SCENES.flatMap((s) => s.segmentIds), script.segments.map((s: {id: string}) => s.id));
	for (const s of KONTROLLEN_SCENES) assert.ok(KONTROLLEN_KEYWORDS[s.id]?.length, `Schlüsselwörter für ${s.id}`);
	for (const s of KONTROLLEN_SCENES.slice(1)) assert.ok((s.transitionInFrames ?? 0) <= 10);
});

test('Bilanz wörtlich belegt (Innenministerium 18.11., seit 01.11.) – Zahlen in Ton, Bild und Caption identisch', () => {
	for (const q of Object.values(QUOTES)) assert.ok(sources.includes(q), `Wortlaut in sources.md: ${q}`);
	assert.match(seg('z1'), /seit Anfang November über 2\.150 Menschen kontrolliert!$/);
	assert.match(seg('b2'), /^78 Strafanzeigen, 435 Ordnungswidrigkeiten und 182 Platzverweise\.$/);
	assert.deepEqual(STATS.map((s) => s.value), [78, 435, 182]);
	assert.equal(CONTROLS.value, 2150);
	assert.equal(COVER.big, '2.150+');
	for (const n of ['über 2.150', '78 Strafanzeigen', '435', '182 Platzverweise']) assert.ok(tiktok.includes(n), `Caption: ${n}`);
	assert.match(sources, /## Aktualitätsprüfung \(19\.11\.2026/);
	for (let i = 1; i <= 8; i++) assert.match(sources, new RegExp(`\\| ${i} \\|`), `Prüffrage ${i} beantwortet`);
	// alte Wochenbilanz (08.11.) nicht im Video
	for (const old of ['945', '334', '72 Platzverweise']) assert.ok(!all.includes(old) && !scenesSrc.includes(old), `alter Stand ${old} nicht im Video`);
});

test('Leitplanken: kontrolliert ≠ schuldig, Anzeige ≠ Verurteilung, OWi ≠ Straftat, Platzverweis ≠ Festnahme, nicht addieren', () => {
	assert.equal(seg('z2'), 'Klar ist aber: Kontrolliert heißt nicht automatisch verdächtig.');
	assert.equal(CONTROLS.stamp, 'KONTROLLIERT ≠ SCHULDIG');
	assert.ok(sources.includes(QUOTES.unbescholtene));
	assert.match(seg('b3'), /Anzeige heißt nicht Verurteilung – und addieren darf man die Zahlen nicht\./);
	assert.deepEqual(STATS.map((s) => s.not), ['≠ VERURTEILUNG', '≠ STRAFTAT', '≠ FESTNAHME']);
	assert.equal(NO_SUM.title, 'NICHT ADDIEREN');
	assert.doesNotMatch(all, /verurteilt|Straftäter|Festnahmen|festgenommen/i, 'keine Gleichsetzung im Ton');
	assert.doesNotMatch(scenesSrc, /2\.150 TÄTER|2\.150 VERDÄCHTIGE|GESAMT: \d/);
});

test('Sicherstellungen: Mengen exakt wie in der Pressemitteilung, kein behaupteter Demo-Bezug, neutrale Illustration', () => {
	assert.deepEqual(ITEMS.map((i) => i.qty), ['MEHRERE', 'MEHRERE', 'MEHRERE', '1', 'MEHRERE', '3', 'MEHRERE']);
	assert.match(seg('g1'), /^Sichergestellt wurden unter anderem Messer, Pfefferpistolen, Sturmhauben und eine Axt\.$/);
	assert.match(read(`${dir}content.ts`), /kein belegter Bezug zur Demo am 20\.11\./);
	assert.doesNotMatch(all, /für die Demo|am Freitag einsetzen|bewaffnet/i);
	assert.match(read(`${dir}visuals/Evidence.tsx`), /keine realistischen Waffen, keine Handhabung/);
});

test('Ermittlungen: 2 durch die Kontrollen identifiziert (laut hessenschau) – getrennt von insgesamt 99, Verdacht ≠ Schuld', () => {
	assert.match(seg('h1'), /^Laut hessenschau identifizierte die Polizei so auch zwei Tatverdächtige der Halloween-Krawalle\.$/);
	assert.match(seg('h2'), /^Insgesamt sind laut Polizei schon 99 ermittelt\.$/);
	assert.equal(SUSPECTS.two.value, 2);
	assert.equal(SUSPECTS.total.value, 99);
	assert.match(SUSPECTS.two.by, /hessenschau/);
	assert.equal(SUSPECTS.note, 'VERDACHT ≠ SCHULD');
	assert.match(SUSPECTS.notAll, /NICHT die ganze Halloween-Bilanz/);
	assert.doesNotMatch(scenesSrc, /<img|photo|Foto/i, 'keine Personenbilder');
});

test('Debatte fair als POSITION/KRITIK – Vorwurf belegt, Zurückweisung zitiert, kein Urteil; Ausblick als ANGEKÜNDIGT', () => {
	assert.match(seg('p1'), /Sicherheitsgewinn/);
	assert.match(seg('p2'), /^Kritiker aus der Stadtpolitik sprechen von Kontrollen nach Aussehen – Poseck widerspricht\.$/);
	assert.ok(sources.includes('Racial Profiling'));
	assert.match(sources, /Khenissi/);
	assert.match(sources, /Avan/);
	assert.match(DEBATE.reply.quote, /Es geht nicht um Herkunft, es geht um Verhalten/);
	assert.match(scenesSrc, /<Chip kind="POSITION"/);
	assert.match(scenesSrc, /<Chip kind="KRITIK"/);
	assert.match(scenesSrc, /<Chip kind="ANGEKÜNDIGT"/);
	assert.match(seg('w1'), /nach Freitag sollen die Kontrollen weitergehen/);
	assert.ok(sources.includes(QUOTES.weiter));
	// keine Wiederholung der Polizeiplanung für den 20.11.
	assert.doesNotMatch(all, /2\.000 Polizisten|Meldeauflage|Aufenthaltsverbot|Weseler Werft|Großaufgebot/);
});

test('Quellenzeile unter den Untertiteln: alle Segmente abgedeckt, kurze Labels, keine SourceBar, keine URLs', () => {
	assert.match(compSrc, /sourceLine: \[\.\.\.SOURCE_LINE\]/);
	assert.doesNotMatch(scenesSrc, /SourceBar/);
	const ids = script.segments.map((s: {id: string}) => s.id);
	for (const s of SOURCE_LINE) {
		assert.ok(ids.includes(s.from), s.from);
		assert.doesNotMatch(s.text, /https?:\/\/|www\./);
		assert.ok(s.text.length <= 112, `${s.from}: ${s.text.length} Zeichen`);
	}
	assert.match(SOURCE_LINE.find((s) => s.from === 'h1')!.text, /hessenschau/);
	assert.match(SOURCE_LINE.find((s) => s.from === 'b1')!.text, /Innenministerium/);
	const entries = resolveSourceLine([...SOURCE_LINE], manifest, 30, {start: 48, end: 1800});
	for (let i = 1; i < entries.length; i++) assert.equal(entries[i].from, entries[i - 1].to);
});

test('Stimme: Adam kurzformat-60, Ewa → Eywa, Zahlen ausgeschrieben, Begrüßung + Abo-Aufruf aus dem Cache, ≤ 1.020 Zeichen', () => {
	assert.equal(script.voice.profile, 'kurzformat-60');
	assert.deepEqual(voiceSettingsFor(voice, script), {...voice.elevenlabs.voiceSettings, speed: 1.2});
	assert.equal(voice.elevenlabs.voiceSettings.speed, 1.16);
	assert.equal(seg('hook1'), 'Ewa, Frankfurt!');
	assert.equal(applyAussprache('Ewa, Frankfurt!', ausspracheFor(voice, script.videoId)), '{Ewa|Eywa}, Frankfurt!');
	for (const s of script.segments) assert.doesNotMatch(spoken(s.text), /\d/, `${s.id}: Zahlen ausgeschrieben`);
	assert.doesNotMatch(script.segments.map((s: {text: string}) => spoken(s.text)).join(' '), /Racial|Profiling/, 'englischer Fachbegriff nur im Bild');
	const cache = readdirSync(new URL('../voice-cache/elevenlabs/frankfurt-erklaert-2150-kontrollen/', import.meta.url));
	for (const k of ['f50850868202c0738f23', '61e51d89dc2c0f05aaa7']) assert.ok(cache.includes(`${k}.mp3`), k);
	const chars = script.segments.reduce((n: number, s: {text: string}) => n + spoken(s.text).length, 0);
	assert.ok(chars <= 1020, `${chars} Zeichen`);
	assert.ok(!manifest.captions.some((c) => /Eywa|Rett|zweitausend|achtundsiebzig|vierhundert|hundertzwei|neunundneunzig/.test(c.text)), 'Untertitel nur Anzeige-Schreibweise');
	if (isAdam) assert.equal((manifest as unknown as {voice: {voiceId: string}}).voice.voiceId, 'pNInz6obpgDQGcFmaJgB');
});

test('Länge: hartes Limit 60 s = 1.800 Frames; Pausen ≤ 400 ms; Untertitel im Satz; Config', () => {
	assert.equal(cfg.maxSeconds, FORMAT.maxSeconds);
	assert.equal(cfg.maxSeconds, 60);
	assert.equal(cfg.ausnahme, undefined);
	assert.equal(cfg.sonderausnahme, undefined);
	assert.equal(cfg.maxPauseMs, 400);
	assert.equal(cfg.outputName, 'FrankfurtRed3_2150Kontrollen_ADAM_FINAL');
	assert.equal(cfg.thumbnailName, 'FrankfurtRed3_2150Kontrollen_THUMBNAIL');
	assert.match(compSrc, /maxSeconds: videos\.FrankfurtErklaert2150Kontrollen\.maxSeconds/);
	const tl = erklaertTimelineFor(KONTROLLEN_SCENES, script, manifest, 30, cfg.maxSeconds);
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

test('Kopfzeile oben rechts + TopTag, Prüfbögen registriert, Logo, Illustrationen gekennzeichnet', () => {
	assert.match(compSrc, /badgePlacement: 'top-right'/);
	assert.match(compSrc, /episode: '#13'/);
	assert.match(scenesSrc, /<TopTag /);
	for (const m of scenesSrc.matchAll(/top: (3\d\d)[,}]/g)) assert.ok(Number(m[1]) >= LAYOUT.badgeTopRight + LAYOUT.topBarHeight, `Inhalt bei y ${m[1]}`);
	const root = read('../src/Root.tsx');
	for (const id of ['FrankfurtErklaert2150Kontrollen', 'FrankfurtErklaert2150Kontrollen-Cover', 'FrankfurtErklaert2150Kontrollen-CoverVorschau', 'FrankfurtErklaert2150Kontrollen-OverlayCheck', 'FrankfurtErklaert2150Kontrollen-QuellenCheck']) {
		assert.ok(root.includes(`id="${id}"`), id);
	}
	assert.match(read('../.github/workflows/video-produzieren.yml'), /- FrankfurtErklaert2150Kontrollen/);
	assert.match(scenesSrc, /<BrandLogo size=\{230\}/);
	assert.match(scenesSrc, /<BrandLogo size=\{52\} \/>/);
	assert.doesNotMatch(scenesSrc, /BrandAvatar|@frankfurtred3/);
	assert.match(scenesSrc, /ILLUSTRATION/);
});

test('Titelbild: Kernzone, 3:4-Ausschnitt, Zeile über den App-Knöpfen, Untertitel-Band im Video frei', () => {
	const tops = [L.brandTop, L.bigTop, L.cardTop, L.questionTop, L.smallTop, L.metaTop];
	for (const y of tops) assert.ok(y >= COVER_ZONE.coreTop && y <= COVER_ZONE.coreBottom, `y=${y}`);
	assert.ok(L.brandTop >= 390);
	assert.ok(L.brandBottom <= L.bigTop && L.bigBottom <= L.cardTop && L.cardBottom <= L.questionTop && L.questionBottom <= L.smallTop && L.smallBottom <= L.metaTop);
	assert.ok(L.smallBottom <= COVER_ZONE.rightButtonsTop);
	assert.ok(L.metaBottom <= COVER_ZONE.videoBottom);
	assert.ok(L.thumbTop >= COVER_ZONE.videoBottom && L.thumbBottom <= COVER_ZONE.coreBottom);
	assert.ok(L.bigMaxWidth <= 1080 - 2 * COVER_ZONE.side + 20 && L.cardMaxWidth <= 1080 - 2 * COVER_ZONE.side + 20);
	assert.ok(L.bigSize >= 58 * 2);
	assert.equal(COVER.card, 'POLIZEIKONTROLLEN AUF DER ZEIL');
	assert.equal(COVER.question, 'WAS HAT DIE POLIZEI GEFUNDEN?');
});

test('TikTok-Text: Titel, Caption ≤ 4.000 Zeichen, genau die 5 vorgegebenen Hashtags, Einordnungen und Quellen, Frage am Ende', () => {
	assert.match(tiktok, /## Titel\s+2\.150 KONTROLLEN AUF DER ZEIL – WAS HAT DIE POLIZEI GEFUNDEN\? 🚨/);
	const caption = (tiktok.split('## Caption')[1] ?? '').trim();
	assert.ok(caption.length >= 1500 && caption.length <= 4000, `Caption ${caption.length}`);
	assert.deepEqual(caption.match(/#[\wäöüÄÖÜß]+/g), ['#Frankfurt', '#FrankfurtAmMain', '#Zeil', '#GenZRegelt', '#FYP']);
	for (const s of ['BAO Zeil', 'Strafanzeige ist keine Verurteilung', 'keine Straftaten', 'keine Festnahme', 'nicht addieren', 'zwei Personen', '99', 'Racial Profiling', 'Es geht nicht um Herkunft', '20. November', 'innen.hessen.de', 'hessenschau']) {
		assert.ok(caption.includes(s), `Caption: ${s}`);
	}
	assert.match(caption, /\?\s*\n\s*#/);
});
