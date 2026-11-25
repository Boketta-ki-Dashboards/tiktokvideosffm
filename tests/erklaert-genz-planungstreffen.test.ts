/**
 * „Gen Z regelt Frankfurt – was soll sich am 12. Dezember ändern?“ (FrankfurtErklaertGenZPlanungstreffen, #18, Stand 25.11.2026, 16:40 Uhr):
 * Kritik nur als AUSSAGE DER GRUPPE (Konjunktiv, Zitate wörtlich aus dem transkribierten Beitrag), konfrontative Sätze nicht übernommen,
 * Planungstreffen nur als Einladung (keine Ergebnisse), DGB-Haus ≠ Veranstalter, keine Spaltung/Wiedervereinigung, 12.12. = Ankündigung
 * der Gruppe ≠ Website („Standort folgt“) ≠ Anmeldung/Behörde, Rückblick-Zahlen laut Innenministerium nicht addiert, FrankfurtRedNews,
 * Screenshots nicht eingebettet, Längen-Ausnahme (Info ≤ 61,5 s, gesamt ≤ 66 s), Quellenzeile, Kopfzeile oben rechts, Titelbild nach COVER_ZONE.
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
import {ABSTIMMUNG, COVER, ORGA, POLIZEI, POST, SOURCE_LINE, STAND, STUFEN, TERMIN, TREFFEN} from '../src/videos/frankfurt-erklaert-genz-planungstreffen/content.ts';
import {PLANUNG_COVER_LAYOUT as L} from '../src/videos/frankfurt-erklaert-genz-planungstreffen/cover-layout.ts';
import {PLANUNG_KEYWORDS, PLANUNG_SCENES} from '../src/videos/frankfurt-erklaert-genz-planungstreffen/plan.ts';

const dir = '../src/videos/frankfurt-erklaert-genz-planungstreffen/';
const ref = '../references/frankfurt-erklaert-genz-planungstreffen/';
const read = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8');
const script = JSON.parse(read(`${dir}script.json`));
const manifest: VoiceoverManifest = JSON.parse(read(`${dir}voiceover.json`));
const videos = JSON.parse(read('../config/videos.json'));
const voice = {...JSON.parse(read('../config/voice.json')), ...JSON.parse(read('../config/voice-regeln.json'))};
const sources = read(`${ref}sources.md`);
const website = read(`${ref}website-2026-11-25-1640.txt`);
const imAuszug = read(`${ref}im-bilanz-20nov-auszug.txt`);
const tiktok = read(`${ref}tiktok-text.md`);
const caption = tiktok.split('```')[1] ?? '';
const scenesSrc = read(`${dir}scenes/Scenes.tsx`);
const visualsSrc = read(`${dir}visuals/Planning.tsx`);
const contentSrc = read(`${dir}content.ts`);
const compSrc = read(`${dir}FrankfurtErklaertGenZPlanungstreffen.tsx`);
const map = JSON.parse(read('../src/data/maps/frankfurt-gallus-gewerkschaftshaus.json'));
const display = (t: string) => t.replace(/\{([^|}]*)\|[^}]*\}/g, '$1');
const spoken = (t: string) => t.replace(/\{[^|}]*\|([^}]*)\}/g, '$1');
const seg = (id: string) => display(script.segments.find((s: {id: string}) => s.id === id).text);
const all = script.segments.map((s: {text: string}) => display(s.text)).join(' ');
const isAdam = String(manifest.source).startsWith('elevenlabs');
const cfg = videos.FrankfurtErklaertGenZPlanungstreffen;
/** Wortlaut des Beitrags (Transkription in sources.md, Abschnitt „Beitrag – wörtliche Transkription“). */
const post = sources.split('## Beitrag – wörtliche Transkription')[1].split('**Warum nicht eingebettet:**')[0].replace(/\n> ?/g, ' ').replace(/\s+/g, ' ');
const unquote = (q: string) => q.replace(/^„|“$/g, '');

test('Dramaturgie: Titelbild → Beitrag → Planung → Polizei → Planungstreffen → Abstimmung → 12.12. → offen → Frage → Abo-Aufruf', () => {
	assert.deepEqual(PLANUNG_SCENES.map((s) => s.id), ['cover', 'beitrag', 'orga', 'polizei', 'treffen', 'abstimmung', 'termin', 'offen', 'frage', 'outro']);
	assert.deepEqual(PLANUNG_SCENES.flatMap((s) => s.segmentIds), script.segments.map((s: {id: string}) => s.id));
	for (const s of PLANUNG_SCENES) assert.ok(PLANUNG_KEYWORDS[s.id]?.length, `Schlüsselwörter für ${s.id}`);
	for (const s of PLANUNG_SCENES.slice(1)) assert.ok((s.transitionInFrames ?? 0) <= 10);
	assert.equal(script.segments.at(-1).id, 'cta');
});

test('Kritik = Aussage der Gruppe: Konjunktiv im Ton, Zitate wörtlich aus dem Beitrag', () => {
	assert.equal(seg('a1'), 'Eine Frankfurter Gruppe kritisiert auf TikTok die Organisation der Demos vom 31. Oktober und 20. November.');
	assert.match(seg('b1'), /^Infos seien zu spät gekommen – Ordner, Technik, sogar eine Route hätten kurz vorher gefehlt\.$/);
	assert.match(seg('c1'), /Jugendliche würden zu Hunderten wahllos kontrolliert\.$/);
	assert.doesNotMatch(all, /Jugendliche werden .*kontrolliert|wurden wahllos/, 'Vorwurf nie als Tatsache');
	for (const q of [ORGA.quote, POLIZEI.telegram, POLIZEI.claim, POST.quote1]) assert.ok(post.includes(unquote(q)), `wörtlich im Beitrag: ${q}`);
	assert.match(scenesSrc, /AUSSAGE DER GRUPPE/);
	assert.match(contentSrc, /by: 'AUSSAGE DER GRUPPE'/);
	// Gegenposition offiziell und wörtlich
	assert.equal(seg('c2'), 'Laut Innenministerium zählt dabei Verhalten, nicht Herkunft.');
	assert.ok(sources.includes('Entscheidend für die polizeilichen Maßnahmen ist nicht die Herkunft eines'), 'Wortlaut Innenministerium');
	assert.ok(sources.replace(/\s+/g, ' ').includes(POLIZEI.official), 'Zitat im Bild wörtlich (nicht gekürzt)');
	assert.match(POLIZEI.count, /über 2\.150 .*Stand 18\.11\..*342 Kontrollen am 20\.11\./);
	assert.ok(imAuszug.includes('In Frankfurt wurden 342 Personenkontrollen durchgeführt.'));
});

test('Konfrontative Sätze und Wertungen des Beitrags nicht übernommen', () => {
	const text = all + caption + contentSrc + scenesSrc + visualsSrc;
	assert.doesNotMatch(text, /Schikane|zusammenstehen|unbeantwortet|kuscheln|Generalverdacht/i);
	for (const s of ['diese Schikane lassen wir nicht unbeantwortet', 'Wenn die Polizei kontrolliert muss GenZ zusammenstehen']) assert.ok(sources.includes(s), `begründet: ${s}`);
	assert.doesNotMatch(all + caption, /kommt (alle )?vorbei|seid dabei|macht mit|t\.me\/|Ticket/i, 'kein Aufruf, keine Links zu Telegram/Tickets');
});

test('Planungstreffen nur als Einladung – keine Ergebnisse, DGB-Haus ≠ Veranstalter', () => {
	assert.match(seg('d1'), /Für Dienstagabend lud die Gruppe zu einem offenen Planungstreffen im DGB-Haus ein\.$/);
	assert.equal(seg('d3'), 'Was dort besprochen wurde, ist öffentlich nicht bekannt.');
	assert.doesNotMatch(all + caption, /Treffen fand statt|fand (am Dienstag|ein offenes)|beschlossen|haben sich geeinigt|vereinbart|Teilnehmende beim Treffen/i);
	assert.equal(TREFFEN.result, 'ERGEBNISSE: NICHT ÖFFENTLICH BEKANNT');
	assert.match(TREFFEN.dgb, /Beteiligung des DGB ist nicht bekannt/);
	assert.doesNotMatch(all + caption + contentSrc, /DGB (organisiert|lädt|veranstaltet|unterstützt)|vom DGB/i);
	assert.doesNotMatch(visualsSrc + scenesSrc, /DGB-Logo|logoFile|<img/i);
	assert.ok(post.includes('Dienstag, 24.11. 19 Uhr · DGB Haus Saal A · Frankfurt'));
	// Ort laut OSM innerhalb des Kartenausschnitts
	const inBox = ([lat, lon]: [number, number]) => lat > map.meta.bbox.minlat && lat < map.meta.bbox.maxlat && lon > map.meta.bbox.minlon && lon < map.meta.bbox.maxlon;
	assert.ok(inBox(TREFFEN.at) && inBox(TERMIN.at) && inBox(TERMIN.hbf));
	assert.match(scenesSrc, /© OpenStreetMap-Mitwirkende/);
});

test('Keine Spaltung oder Wiedervereinigung, keine Garantien, keine Route/Teilnehmerzahl für den 12.12.', () => {
	const text = all + caption + JSON.stringify({ABSTIMMUNG, TERMIN, TREFFEN, STUFEN, POLIZEI, ORGA, POST, COVER});
	assert.doesNotMatch(text, /Spaltung|gespalten|Zerwürfnis|wiedervereint|versöhnt|wieder vereint|garantiert|alle Probleme gelöst|gemeinsame Demo (vereinbart|geplant)/i);
	assert.match(seg('e1'), /\?$/, 'Abstimmung nur als Frage');
	assert.match(seg('e2'), /getrennte Planungen/);
	assert.doesNotMatch(text, /Route (führt|geht|verläuft)|Demozug (von|ab) .* (nach|zum)|\d[\d.]* (Teilnehmende|Menschen) (erwartet|angemeldet)/i);
	assert.equal(ABSTIMMUNG.a.n, 30);
	assert.equal(ABSTIMMUNG.b.n, 1000);
	assert.doesNotMatch(text, /1\.030|1030/, 'Rückblick-Zahlen nicht addiert');
	assert.ok(imAuszug.includes('Die Kundgebung an der Weseler Werft blieb mit ca. 30 Teilnehmerinnen und Teilnehmern'));
	assert.ok(imAuszug.includes('ca. 1.000 Teilnehmern („Gen Z Bundesweit“)'));
	for (const s of ['„Zerwürfnis“ / „Spaltung“', 'Ergebnisse, Teilnehmerzahl oder „fand statt“ zum Planungstreffen', 'DGB als Veranstalter/Unterstützer']) assert.ok(sources.includes(s), `begründet unter „Bewusst NICHT verwendet“: ${s}`);
});

test('12.12.: Ankündigung der Gruppe ≠ Website der Bundesinitiative ≠ Anmeldung/Behörde', () => {
	assert.equal(seg('f1'), 'Für den 12. Dezember nennt die Gruppe: 14 Uhr, Gallusanlage.');
	assert.equal(seg('f2'), 'Die Bundesinitiative nennt für Frankfurt bislang: Standort folgt.');
	assert.equal(seg('g1'), 'Ob die Demo angemeldet ist, ist öffentlich nicht bekannt.');
	assert.ok(post.includes('Demo 12.12. 14 Uhr Gallusanlage Demo'));
	assert.match(website, /Frankfurt am Main[\s\S]*Standort folgt[\s\S]*Samstag, 12\.12\., Uhrzeit folgt/);
	assert.match(website, /id: "frankfurt".*place: "Standort folgt"/);
	assert.equal(TERMIN.by, 'ANKÜNDIGUNG DER FRANKFURTER GRUPPE');
	assert.deepEqual(STUFEN.map((s) => [s.label, s.state]), [['TERMIN ANGEKÜNDIGT', 'yes'], ['ANMELDUNG', 'open'], ['BEHÖRDE', 'open'], ['ZUSAMMENARBEIT', 'open']]);
	assert.doesNotMatch(all + caption, /angemeldet ist(?!, ist)|wurde angemeldet|genehmigt|bestätigt die Polizei|laut Stadt/i);
	assert.equal(STAND.date, '25.11.2026');
	assert.ok(sources.includes(`Letzter Faktencheck: ${STAND.date}, ${STAND.time} Uhr`));
	assert.match(sources, /## Bewusst NICHT verwendet/);
});

test('Herkunft offen benannt, Screenshots nicht eingebettet, keine Logos', () => {
	assert.match(POST.origin, /Account im Screenshot nicht sichtbar/);
	assert.match(sources, /\*\*Warum nicht eingebettet:\*\*/);
	assert.doesNotMatch(scenesSrc + visualsSrc, /<Img|<img|staticFile|\.jpg|\.png|\.webp/, 'keine eingebetteten Bilder/Screenshots');
	assert.doesNotMatch(visualsSrc, /TikTok-Logo|Telegram-Logo|DGB-Logo/);
	assert.match(visualsSrc, /Nachbildung/);
	assert.match(scenesSrc, /ILLUSTRATION/);
	assert.match(scenesSrc, /SYMBOLBILD/);
	assert.doesNotMatch(all, /\bdie Ortsgruppe\b/, 'Zuordnung zur Ortsgruppe vom 20.11. nicht behauptet');
});

test('FrankfurtRedNews: Abo-Aufruf, Handle, Prüfbögen – Profilbild unverändert, alte Folgen unverändert', () => {
	assert.equal(BRAND_NEWS.name, 'FrankfurtRedNews');
	assert.equal(handleWithAt('news'), '@frankfurtrednews');
	assert.equal(handleWithAt(), '@frankfurtred3');
	assert.equal(BRAND.logoFile, 'brand/frankfurtred-logo.webp');
	assert.equal(script.segments.at(-1).text, 'Für mehr Nachrichten aus Frankfurt folgt {FrankfurtRedNews|Frankfurt Rett News}!');
	assert.doesNotMatch(JSON.stringify(script) + scenesSrc + caption, /FrankfurtRed3|frankfurtred3|Rett Drei/);
	assert.match(scenesSrc, /handleWithAt\(NEWS\)/);
	assert.match(read(`${dir}FrankfurtErklaertGenZPlanungstreffenCoverVorschau.tsx`), /handle=\{handleWithAt\('news'\)\}/);
	assert.match(read(`${dir}FrankfurtErklaertGenZPlanungstreffenOverlayCheck.tsx`), /handle=\{handleWithAt\('news'\)\}/);
	assert.equal(cfg.outputName, 'FrankfurtRedNews_GenZ_Planungstreffen_12Dezember_25Nov2026');
});

test('Sprechertext: Adam kurzformat-60 (speed 1.20), Ewa→Eywa, Budget ≈ 60 s Information', () => {
	assert.equal(script.voice.profile, 'kurzformat-60');
	assert.deepEqual(voiceSettingsFor(voice, script), {...voice.elevenlabs.voiceSettings, speed: 1.2});
	assert.equal(voice.elevenlabs.voiceId, 'pNInz6obpgDQGcFmaJgB');
	assert.equal(applyAussprache('Ewa, Frankfurt!', ausspracheFor(voice, script.videoId)), '{Ewa|Eywa}, Frankfurt!');
	assert.match(JSON.stringify(script), /\{Gen-Z-Demos\|Dschen Zett Demos\}/);
	for (const s of script.segments) assert.ok(s.pauseAfterMs <= 300, `${s.id}: Pause ≤ 300 ms`);
	const chars = script.segments.filter((s: {id: string}) => !['hook1', 'cta'].includes(s.id)).reduce((n: number, s: {text: string}) => n + spoken(s.text).length, 0);
	assert.ok(chars >= 1000 && chars <= 1130, `Informationsteil ≈ 60 s (${chars} gesprochene Zeichen)`);
});

test('Längen-Ausnahme: Informationsteil ≤ 61,5 s, Abo-Aufruf zuletzt, gesamt ≤ 66 s', () => {
	assert.equal(cfg.maxSeconds, 66);
	assert.equal(cfg.infoMaxSeconds, 61.5);
	assert.ok(String(cfg.ausnahme).length > 20);
	assert.equal(cfg.maxPauseMs, 400);
	const infoEnd = Math.max(...manifest.segments.filter((s) => s.id !== 'cta').map((s) => s.endMs));
	assert.ok(infoEnd <= cfg.infoMaxSeconds * 1000, `Informationsteil ${infoEnd} ms`);
	if (isAdam) {
		const greetEnd = manifest.segments.find((s) => s.id === 'hook1')!.endMs;
		assert.ok(infoEnd - greetEnd >= 57000, `Inhalt nach der Begrüßung 58–63 s (${infoEnd - greetEnd} ms)`);
	}
	const tl = erklaertTimelineFor(PLANUNG_SCENES, script, manifest, 30, cfg.maxSeconds);
	assert.ok(tl.durationInFrames <= cfg.maxSeconds * 30, `${tl.durationInFrames} ≤ ${cfg.maxSeconds * 30}`);
	assert.ok(cfg.maxSeconds <= FORMAT.extendedMaxSeconds);
});

test('Kopfzeile oben rechts, Quellenzeile unter den Untertiteln, keine SourceBar', () => {
	assert.match(compSrc, /badgePlacement: 'top-right'/);
	assert.match(compSrc, /episode: '#18'/);
	assert.match(compSrc, /sourceLine: \[\.\.\.SOURCE_LINE\]/);
	assert.match(compSrc, /maxSeconds: videos\.FrankfurtErklaertGenZPlanungstreffen\.maxSeconds/);
	assert.doesNotMatch(scenesSrc, /SourceBar/);
	const tl = erklaertTimelineFor(PLANUNG_SCENES, script, manifest, 30, cfg.maxSeconds);
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
	assert.ok(L.tagBottom <= COVER_ZONE.rightButtonsTop, 'Plakette endet über den App-Knöpfen');
	assert.ok(L.artRight <= 930);
	assert.ok(L.metaBottom <= COVER_ZONE.videoBottom);
	assert.ok(L.thumbBottom <= COVER_ZONE.coreBottom);
	assert.ok(L.sideMin >= COVER_ZONE.side);
	assert.equal(COVER.big, '12.12.');
	assert.equal(COVER.card, 'WAS SOLL SICH ÄNDERN?');
});

test('Caption: Titel, Quellen-URLs, genau fünf Hashtags, ≤ 4.000 Zeichen, keine Autoveröffentlichung', () => {
	assert.match(tiktok, /GEN Z REGELT FRANKFURT – WAS SOLL SICH AM 12\. DEZEMBER ÄNDERN\?/);
	assert.ok(caption.length > 300 && caption.length <= 4000, `Caption-Länge ${caption.length}`);
	assert.equal(caption.trim().split('\n').at(-1)!.match(/#[\p{L}\p{N}]+/gu)!.length, 5, 'genau fünf Hashtags in der Hashtag-Zeile');
	assert.match(caption, /genz-regelt\.de/);
	assert.match(caption, /innen\.hessen\.de/);
	assert.match(caption, /überprüfen konnten wir sie nicht/);
	assert.match(caption, /öffentlich nicht bekannt/);
	assert.match(tiktok, /nicht automatisch veröffentlicht/i);
});
