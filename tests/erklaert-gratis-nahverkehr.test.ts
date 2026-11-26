/**
 * „Frankfurt macht Bus und Bahn kostenlos – ausgerechnet am 12. Dezember“ (FrankfurtErklaertGratisNahverkehr, #19, Stand 26.11.2026):
 * zwei befristete Aktionstage (12./19.12.), Geltungsbereich wie berichtet (Tarifgebiet 5000 inkl. Grenztarifgebiete, ohne Flughafen 5090,
 * Umland bis zur Stadtgrenze regulär), 0 bis 5 Uhr am Sonntagmorgen, Kosten nur „laut FAZ“, keine Umsatz-/Schadenssummen, weitere Maßnahmen
 * (Kampagne bis 19.12., 6.1.), Gen-Z-Protesttag nur als zeitliche Überschneidung („nicht belegt“), FrankfurtRedNews, Längen-Ausnahme,
 * Quellenzeile, Kopfzeile oben rechts, Titelbild nach COVER_ZONE, Tarifkarte aus OSM.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {applyAussprache, ausspracheFor, voiceSettingsFor} from '../scripts/lib/aussprache.mjs';
import {resolveSourceLine} from '../src/formats/frankfurt-erklaert/source-line.ts';
import {COVER_ZONE, FORMAT, LAYOUT} from '../src/formats/frankfurt-erklaert/theme.ts';
import {erklaertTimelineFor} from '../src/formats/frankfurt-erklaert/timeline.ts';
import {type VoiceoverManifest} from '../src/lib/script-timing.ts';
import {BRAND, BRAND_NEWS, handleWithAt} from '../src/theme/brand.ts';
import {AUSNAHMEN, COVER, GRATIS, HINTERGRUND, KAMPAGNE, SOURCE_LINE, STAND, TAGE, UEBERSCHNEIDUNG, ZEIT} from '../src/videos/frankfurt-erklaert-gratis-nahverkehr/content.ts';
import {GRATIS_COVER_LAYOUT as L} from '../src/videos/frankfurt-erklaert-gratis-nahverkehr/cover-layout.ts';
import {GRATIS_KEYWORDS, GRATIS_SCENES} from '../src/videos/frankfurt-erklaert-gratis-nahverkehr/plan.ts';

const dir = '../src/videos/frankfurt-erklaert-gratis-nahverkehr/';
const ref = '../references/frankfurt-erklaert-gratis-nahverkehr/';
const read = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8');
const script = JSON.parse(read(`${dir}script.json`));
const manifest: VoiceoverManifest = JSON.parse(read(`${dir}voiceover.json`));
const videos = JSON.parse(read('../config/videos.json'));
const voice = {...JSON.parse(read('../config/voice.json')), ...JSON.parse(read('../config/voice-regeln.json'))};
const sources = read(`${ref}sources.md`);
const wortlaute = read(`${ref}wortlaute-2026-11-26.md`).replace(/\s+/g, ' ');
const tiktok = read(`${ref}tiktok-text.md`);
const caption = tiktok.split('```')[1] ?? '';
const scenesSrc = read(`${dir}scenes/Scenes.tsx`);
const visualsSrc = read(`${dir}visuals/Transport.tsx`);
const compSrc = read(`${dir}FrankfurtErklaertGratisNahverkehr.tsx`);
const map = JSON.parse(read('../src/data/maps/frankfurt-tarif-uebersicht.json'));
const display = (t: string) => t.replace(/\{([^|}]*)\|[^}]*\}/g, '$1');
const spoken = (t: string) => t.replace(/\{[^|}]*\|([^}]*)\}/g, '$1');
const seg = (id: string) => display(script.segments.find((s: {id: string}) => s.id === id).text);
const all = script.segments.map((s: {text: string}) => display(s.text)).join(' ');
const isAdam = String(manifest.source).startsWith('elevenlabs');
const cfg = videos.FrankfurtErklaertGratisNahverkehr;
const content = JSON.stringify({AUSNAHMEN, COVER, GRATIS, HINTERGRUND, KAMPAGNE, TAGE, UEBERSCHNEIDUNG, ZEIT});

test('Dramaturgie: Titelbild → Paket → Termine → Verkehrsmittel → Tarif → Hintergrund → Kosten → Kampagne → ein Datum → Einordnung → Abo-Aufruf', () => {
	assert.deepEqual(GRATIS_SCENES.map((s) => s.id), ['cover', 'paket', 'termine', 'fahrzeuge', 'tarif', 'hintergrund', 'kosten', 'kampagne', 'datum', 'einordnung', 'outro']);
	assert.deepEqual(GRATIS_SCENES.flatMap((s) => s.segmentIds), script.segments.map((s: {id: string}) => s.id));
	for (const s of GRATIS_SCENES) assert.ok(GRATIS_KEYWORDS[s.id]?.length, `Schlüsselwörter für ${s.id}`);
	for (const s of GRATIS_SCENES.slice(1)) assert.ok((s.transitionInFrames ?? 0) <= 10);
	assert.equal(script.segments.at(-1).id, 'cta');
});

test('Aktionstage: 12. und 19.12., Samstage, 0 bis 5 Uhr am Sonntagmorgen – befristet, keine Dauerlösung', () => {
	assert.match(seg('a2'), /An zwei Samstagen, dem 12\. und 19\. Dezember, sind alle Busse und Bahnen im Frankfurter Tarifgebiet kostenlos\./);
	assert.match(seg('b1'), /von 0 Uhr bis 5 Uhr am Sonntagmorgen/);
	assert.deepEqual(TAGE.map((t) => [t.day, t.month, t.weekday]), [['12', 'DEZ', 'SAMSTAG'], ['19', 'DEZ', 'SAMSTAG']]);
	for (const d of ['2026-12-12', '2026-12-19']) assert.equal(new Date(`${d}T12:00:00Z`).getUTCDay(), 6, `${d} ist ein Samstag`);
	assert.equal(new Date('2026-12-13T12:00:00Z').getUTCDay(), 0, '3. Advent = Sonntag 13.12.');
	assert.match(GRATIS.notForever, /NUR AN DIESEN BEIDEN TAGEN/);
	assert.doesNotMatch(all + caption, /dauerhaft kostenlos|ab sofort kostenlos|immer kostenlos|ganzen Dezember/i);
	assert.ok(wortlaute.includes('Jeweils von 0 Uhr am Samstag bis 5 Uhr am Sonntagmorgen.'));
	assert.ok(wortlaute.includes('ab Mitternacht bis zum Betriebsschluss um fünf Uhr am Sonntagmorgen'));
	assert.equal(ZEIT.label, '0 UHR BIS 5 UHR AM FOLGETAG');
});

test('Geltungsbereich und Ausnahmen genau wie berichtet: Tarifgebiet 5000, Flughafen 5090 ausgenommen, Umland bis Stadtgrenze regulär', () => {
	assert.equal(seg('c1'), 'Aber Achtung: Der Flughafen ist ausgenommen.');
	assert.equal(seg('c2'), 'Wer aus dem Umland kommt, etwa aus Offenbach, zahlt bis zur Stadtgrenze den normalen Preis.');
	assert.match(GRATIS.scope, /TARIFGEBIET 5000/);
	assert.match(GRATIS.scopeBy, /Grenztarifgebiete/);
	assert.match(AUSNAHMEN.airportSub, /5090/);
	for (const q of ['umfasst das gesamte Tarifgebiet 5000 inklusive der Grenztarifgebiete', 'da das Tarifgebiet 5090 ausgenommen bleibt', 'bis zur Frankfurter Stadtgrenze regulär zahlen', 'Fahrten bis zum Flughafen oder über die Stadtgrenze bis nach Offenbach zählen also nicht dazu.']) {
		assert.ok(wortlaute.includes(q), `Wortlaut: ${q}`);
	}
	assert.doesNotMatch(all + caption + content, /ganze[ns]? RMV-Gebiet (ist )?kostenlos|\bICE\b|Intercity|Fernverkehr (ist )?kostenlos|ohne Fahrschein|kein Ticket nötig/i);
	assert.ok(sources.includes('Ticketpflicht / „ohne Fahrschein einsteigen“'), 'Ticketfrage begründet weggelassen');
	// Karte: OSM-Grenzen, schematisch gekennzeichnet, Grenztarifgebiete nicht eingezeichnet
	assert.equal(map.meta.attribution, '© OpenStreetMap-Mitwirkende');
	assert.deepEqual(Object.keys(map.areas).sort(), ['badhomburg', 'eschborn', 'flughafen', 'frankfurt', 'neuisenburg', 'offenbach']);
	assert.match(AUSNAHMEN.mapNote, /SCHEMATISCH.*OpenStreetMap.*Grenztarifgebiete nicht eingezeichnet/);
	assert.ok(map.areas.flughafen.center[0] < map.areas.frankfurt.center[0] && map.areas.flughafen.center[1] > map.areas.frankfurt.center[1], 'Flughafen liegt südwestlich der Innenstadt');
	assert.ok(map.areas.offenbach.center[0] > map.areas.frankfurt.center[0], 'Offenbach liegt östlich');
});

test('Hintergrund und Kosten: mit Urheber, keine erfundenen Summen', () => {
	assert.equal(seg('d2'), 'Die Freifahrten kosten die Stadt laut FAZ 400.000 Euro.');
	assert.equal(HINTERGRUND.cost, 400000);
	assert.ok(wortlaute.includes('Kostenpunkt für die Stadt: 400.000 Euro.'));
	assert.match(seg('d3'), /Händlern ohne Versicherung .* Sachschäden einstehen/);
	assert.ok(wortlaute.includes('Für Händler ohne Versicherung, die während der Ausschreitungen am 31. Oktober Sachschäden erlitten hätten, werde die Stadt einstehen.'));
	assert.ok(wortlaute.includes(HINTERGRUND.quote.replace(/^„|“$/g, '')), 'OB-Zitat wörtlich');
	assert.match(seg('d1'), /^Hintergrund: Nach den Ausschreitungen vom 31\. Oktober hatte die Stadt dem Handel Hilfe zugesagt\.$/);
	assert.doesNotMatch(all + caption + content, /Umsatzverlust(e)? von|Millionen Euro Schaden|Zusammenbruch|Pleite/i);
	assert.match(HINTERGRUND.land, /600\.000/);
	assert.ok(wortlaute.includes('600 000 Euro'), 'Landeshilfe belegt (Journal Frankfurt)');
});

test('Weitere Maßnahmen: Kampagne bis 19.12., „Zu Gast in Frankfurt“ am 6.1. – keine erfundenen Rabatte', () => {
	assert.match(seg('e1'), /Werbekampagne fürs Weihnachtsshopping und am 6\. Januar eine Einkaufsaktion/);
	assert.equal(KAMPAGNE.name, 'FRANKFURT CHRISTMAS SHOPPING');
	assert.equal(KAMPAGNE.until, 'BIS 19. DEZEMBER');
	assert.match(KAMPAGNE.jan.label, /ZU GAST IN FRANKFURT/);
	assert.ok(wortlaute.includes('„Frankfurt Christmas Shopping“') && wortlaute.includes('6. Januar 2027'));
	assert.doesNotMatch(all + caption + content, /Rabatt|Prozent günstiger|verkaufsoffen|Gutschein/i);
});

test('Zeitliche Überschneidung mit dem Gen-Z-Protesttag: nur Datum, kein belegter Zusammenhang, keine Aufforderung', () => {
	assert.equal(seg('f0'), 'Spannend ist der erste Termin.');
	assert.match(seg('f1'), /^Gen Z regelt hat für den 12\. Dezember auch in Frankfurt den nächsten Protesttag angekündigt\.$/);
	assert.equal(seg('f3'), 'Ein direkter Zusammenhang ist bislang nicht belegt.');
	assert.equal(UEBERSCHNEIDUNG.noLink, 'DIREKTER ZUSAMMENHANG NICHT BELEGT');
	assert.match(UEBERSCHNEIDUNG.rightBy, /Standort folgt/);
	assert.match(UEBERSCHNEIDUNG.rightGroup, /Frankfurter Gruppe.*14 Uhr, Gallusanlage/);
	const text = all + caption + content;
	assert.doesNotMatch(text, /damit mehr Menschen (zur|an der) Demo|wegen der Demo|gegen die Demo|um die Demo|kommt (alle )?zur Demo|seid dabei|macht mit/i);
	assert.doesNotMatch(text, /Ausschreitungen (am|beim) 12\.|Krawall(e)? erwartet|Chaos|Sperrung(en)? am 12/i, 'keine Prognose, keine erfundenen Verkehrsbehinderungen');
	// Gen-Z-Anteil ≈ 10–13 s
	if (isAdam) {
		const ids = ['f0', 'f1', 'f2', 'f3'];
		const ms = manifest.segments.filter((s) => ids.includes(s.id)).reduce((n, s) => n + s.endMs - s.startMs, 0);
		assert.ok(ms >= 9500 && ms <= 14500, `Überschneidung ${ms} ms`);
	}
	for (const s of ['„Kostenloser Nahverkehr wegen der Demo“ / „gegen die Demo“', 'Aussagen des OB zu künftigen Demos']) assert.ok(sources.includes(s), `begründet: ${s}`);
});

test('FrankfurtRedNews: Abo-Aufruf, Handle, Prüfbögen – Profilbild unverändert', () => {
	assert.equal(BRAND_NEWS.name, 'FrankfurtRedNews');
	assert.equal(handleWithAt('news'), '@frankfurtrednews');
	assert.equal(BRAND.logoFile, 'brand/frankfurtred-logo.webp');
	assert.equal(script.segments.at(-1).text, 'Für mehr Nachrichten aus Frankfurt folgt {FrankfurtRedNews|Frankfurt Rett News}!');
	assert.doesNotMatch(JSON.stringify(script) + scenesSrc + caption, /FrankfurtRed3|frankfurtred3|Rett Drei/);
	assert.match(scenesSrc, /handleWithAt\(NEWS\)/);
	assert.match(read(`${dir}FrankfurtErklaertGratisNahverkehrCoverVorschau.tsx`), /handle=\{handleWithAt\('news'\)\}/);
	assert.match(read(`${dir}FrankfurtErklaertGratisNahverkehrOverlayCheck.tsx`), /handle=\{handleWithAt\('news'\)\}/);
	assert.equal(cfg.outputName, 'FrankfurtRedNews_Kostenloser_Nahverkehr_12_19Dezember_26Nov2026');
});

test('Keine Logos/Fotos, Illustrationen gekennzeichnet, OSM-Hinweis sichtbar', () => {
	assert.doesNotMatch(scenesSrc + visualsSrc, /<Img|<img|staticFile|\.jpg|\.png|\.webp/);
	assert.doesNotMatch(visualsSrc, /RMV-Logo|VGF-Logo|DB-Logo|Deutsche Bahn/);
	assert.match(scenesSrc, /ILLUSTRATION/);
	assert.match(AUSNAHMEN.mapNote, /OpenStreetMap/);
});

test('Sprechertext: Adam kurzformat-60 (speed 1.20), Ewa→Eywa, Budget ≈ 60 s Information', () => {
	assert.equal(script.voice.profile, 'kurzformat-60');
	assert.deepEqual(voiceSettingsFor(voice, script), {...voice.elevenlabs.voiceSettings, speed: 1.2});
	assert.equal(voice.elevenlabs.voiceId, 'pNInz6obpgDQGcFmaJgB');
	assert.equal(applyAussprache('Ewa, Frankfurt!', ausspracheFor(voice, script.videoId)), '{Ewa|Eywa}, Frankfurt!');
	for (const s of script.segments) assert.ok(s.pauseAfterMs <= 300, `${s.id}: Pause ≤ 300 ms`);
	const chars = script.segments.filter((s: {id: string}) => !['hook1', 'cta'].includes(s.id)).reduce((n: number, s: {text: string}) => n + spoken(s.text).length, 0);
	assert.ok(chars >= 1000 && chars <= 1130, `Informationsteil ≈ 60 s (${chars} gesprochene Zeichen)`);
	assert.doesNotMatch(JSON.stringify(script.segments), /Er Em Vau/, 'keine Abkürzung, die Whisper falsch hört');
});

test('Längen-Ausnahme: Informationsteil ≤ 61,5 s (58–63 s nach der Begrüßung), Abo-Aufruf zuletzt, gesamt ≤ 66 s', () => {
	assert.equal(cfg.maxSeconds, 66);
	assert.equal(cfg.infoMaxSeconds, 61.5);
	assert.ok(String(cfg.ausnahme).length > 20);
	assert.equal(cfg.maxPauseMs, 400);
	const infoEnd = Math.max(...manifest.segments.filter((s) => s.id !== 'cta').map((s) => s.endMs));
	assert.ok(infoEnd <= cfg.infoMaxSeconds * 1000, `Informationsteil ${infoEnd} ms`);
	if (isAdam) {
		const greetEnd = manifest.segments.find((s) => s.id === 'hook1')!.endMs;
		assert.ok(infoEnd - greetEnd >= 58000, `Inhalt nach der Begrüßung ≥ 58 s (${infoEnd - greetEnd} ms)`);
	}
	const tl = erklaertTimelineFor(GRATIS_SCENES, script, manifest, 30, cfg.maxSeconds);
	assert.ok(tl.durationInFrames <= cfg.maxSeconds * 30, `${tl.durationInFrames} ≤ ${cfg.maxSeconds * 30}`);
	assert.ok(cfg.maxSeconds <= FORMAT.extendedMaxSeconds);
});

test('Kopfzeile oben rechts, Quellenzeile unter den Untertiteln, keine SourceBar', () => {
	assert.match(compSrc, /badgePlacement: 'top-right'/);
	assert.match(compSrc, /episode: '#19'/);
	assert.match(compSrc, /sourceLine: \[\.\.\.SOURCE_LINE\]/);
	assert.match(compSrc, /maxSeconds: videos\.FrankfurtErklaertGratisNahverkehr\.maxSeconds/);
	assert.doesNotMatch(scenesSrc, /SourceBar/);
	const tl = erklaertTimelineFor(GRATIS_SCENES, script, manifest, 30, cfg.maxSeconds);
	for (const s of SOURCE_LINE) {
		assert.ok(s.text.length <= 112, `Quelle ≤ 112 Zeichen: ${s.text}`);
		assert.doesNotMatch(s.text, /https?:|www\./);
		assert.ok(script.segments.some((x: {id: string}) => x.id === s.from), `Segment ${s.from}`);
	}
	assert.ok(resolveSourceLine([...SOURCE_LINE], manifest, 30, {start: 48, end: tl.durationInFrames}).length >= 8);
	assert.ok(LAYOUT.sourceLineTop >= 1512 && LAYOUT.sourceLineMaxBottom <= 1630);
});

test('Titelbild nach COVER_ZONE', () => {
	assert.ok(L.brandTop >= COVER_ZONE.coreTop + 50 && L.brandTop <= 400);
	assert.ok(L.kickerTop >= L.brandBottom && L.bigTop >= L.kickerBottom && L.cardTop >= L.bigBottom && L.tagTop >= L.cardBottom && L.artTop >= L.tagBottom && L.metaTop >= L.artBottom && L.thumbTop >= L.metaBottom);
	assert.ok(L.tagBottom <= COVER_ZONE.rightButtonsTop);
	assert.ok(L.artRight <= 930);
	assert.ok(L.metaBottom <= COVER_ZONE.videoBottom);
	assert.ok(L.thumbBottom <= COVER_ZONE.coreBottom);
	assert.ok(L.sideMin >= COVER_ZONE.side);
	assert.equal(COVER.big, '0,00 €');
	assert.equal(COVER.card, 'AUSGERECHNET AM 12.12.!');
	assert.equal(STAND.date, '26.11.2026');
	assert.ok(sources.includes(`Letzter Faktencheck: ${STAND.date}, ${STAND.time} Uhr`));
});

test('Caption: Titel, Quellen-URLs, genau fünf Hashtags, ≤ 4.000 Zeichen, keine Autoveröffentlichung', () => {
	assert.match(tiktok, /FRANKFURT MACHT BUS UND BAHN KOSTENLOS – AUSGERECHNET AM 12\. DEZEMBER!/);
	assert.ok(caption.length > 300 && caption.length <= 4000, `Caption-Länge ${caption.length}`);
	assert.equal((caption.match(/#[\p{L}\p{N}]+/gu) ?? []).length, 5);
	assert.match(caption, /faz\.net/);
	assert.match(caption, /hessenschau\.de/);
	assert.match(caption, /nicht belegt/);
	assert.match(caption, /keine dauerhafte Freifahrt/);
	assert.match(tiktok, /nicht automatisch veröffentlicht/i);
});
