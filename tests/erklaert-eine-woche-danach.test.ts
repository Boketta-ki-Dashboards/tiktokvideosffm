/**
 * „Eine Woche nach den Gen-Z-Protesten – was ist aus den Ermittlungen geworden?“ (FrankfurtErklaertEineWocheDanach, #20, Recherchestand 27.11.2026):
 * sechs Städte in fester Reihenfolge, Leipzig ausführlichster Abschnitt, Zahlen nur mit Urheber und Meldestand, Begriffe getrennt
 * (Identitätsfeststellung ≠ Festnahme ≠ Verurteilung), Teilgruppen nie addiert, 31.10. getrennt, eine Datenquelle für Szenen und Dashboard,
 * Dashboard ohne Rangliste/Summe innerhalb der Sicherheitszonen, verlängerte Sonderausgabe (≈ 70 s Information), FrankfurtRedNews.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {applyAussprache, ausspracheFor, voiceSettingsFor} from '../scripts/lib/aussprache.mjs';
import {resolveSourceLine} from '../src/formats/frankfurt-erklaert/source-line.ts';
import {COVER_ZONE, FORMAT, LAYOUT} from '../src/formats/frankfurt-erklaert/theme.ts';
import {erklaertTimelineFor} from '../src/formats/frankfurt-erklaert/timeline.ts';
import {DASHBOARD_LAYOUT, dashboardCell} from '../src/formats/frankfurt-erklaert/visuals/city-dashboard-geometry.ts';
import {type VoiceoverManifest} from '../src/lib/script-timing.ts';
import {BRAND, BRAND_NEWS, handleWithAt} from '../src/theme/brand.ts';
import {COVER, DASHBOARD, HAMBURG, LEIPZIG, SOURCE_LINE, STAND} from '../src/videos/frankfurt-erklaert-eine-woche-danach/content.ts';
import {WOCHE_COVER_LAYOUT as L} from '../src/videos/frankfurt-erklaert-eine-woche-danach/cover-layout.ts';
import {CITIES, RECHERCHE} from '../src/videos/frankfurt-erklaert-eine-woche-danach/data/staedte.ts';
import {WOCHE_KEYWORDS, WOCHE_SCENES} from '../src/videos/frankfurt-erklaert-eine-woche-danach/plan.ts';

const dir = '../src/videos/frankfurt-erklaert-eine-woche-danach/';
const ref = '../references/frankfurt-erklaert-eine-woche-danach/';
const read = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8');
const script = JSON.parse(read(`${dir}script.json`));
const manifest: VoiceoverManifest = JSON.parse(read(`${dir}voiceover.json`));
const videos = JSON.parse(read('../config/videos.json'));
const voice = {...JSON.parse(read('../config/voice.json')), ...JSON.parse(read('../config/voice-regeln.json'))};
const sources = read(`${ref}sources.md`);
const tiktok = read(`${ref}tiktok-text.md`);
const caption = tiktok.split('```')[1] ?? '';
const scenesSrc = read(`${dir}scenes/Scenes.tsx`);
const compSrc = read(`${dir}FrankfurtErklaertEineWocheDanach.tsx`);
const dashSrc = read('../src/formats/frankfurt-erklaert/visuals/CityDashboard.tsx');
const display = (t: string) => t.replace(/\{([^|}]*)\|[^}]*\}/g, '$1');
const spoken = (t: string) => t.replace(/\{[^|}]*\|([^}]*)\}/g, '$1');
const seg = (id: string) => display(script.segments.find((s: {id: string}) => s.id === id).text);
const all = script.segments.map((s: {text: string}) => display(s.text)).join(' ');
const isAdam = String(manifest.source).startsWith('elevenlabs');
const cfg = videos.FrankfurtErklaertEineWocheDanach;
const content = JSON.stringify({COVER, DASHBOARD, HAMBURG, LEIPZIG, CITIES});
const flat = (t: string) => t.replace(/\s+/g, ' ');

test('Dramaturgie: Überblick → Leipzig → Hamburg → Dresden → Stuttgart → Berlin → Frankfurt → Dashboard → Abo-Aufruf', () => {
	assert.deepEqual(WOCHE_SCENES.map((s) => s.id), ['cover', 'leipzig', 'hamburg', 'dresden', 'stuttgart', 'berlin', 'frankfurt', 'dashboard', 'outro']);
	assert.deepEqual(WOCHE_SCENES.flatMap((s) => s.segmentIds), script.segments.map((s: {id: string}) => s.id));
	for (const s of WOCHE_SCENES) assert.ok(WOCHE_KEYWORDS[s.id]?.length, `Schlüsselwörter für ${s.id}`);
	for (const s of WOCHE_SCENES.slice(1)) assert.ok((s.transitionInFrames ?? 0) <= 10);
	assert.deepEqual(CITIES.map((c) => c.id), ['leipzig', 'hamburg', 'dresden', 'stuttgart', 'berlin', 'frankfurt']);
	assert.equal(script.segments.at(-1).id, 'cta');
	// Jede Stadt eigener Sprecherabschnitt, Leipzig der längste
	if (isAdam) {
		const dur = (ids: string[]) => manifest.segments.filter((s) => ids.includes(s.id)).reduce((n, s) => n + s.endMs - s.startMs, 0);
		const parts = Object.fromEntries(WOCHE_SCENES.map((s) => [s.id, dur(s.segmentIds)]));
		for (const id of ['hamburg', 'dresden', 'stuttgart', 'berlin', 'frankfurt']) assert.ok(parts.leipzig > parts[id], `Leipzig länger als ${id}`);
		assert.ok(parts.berlin >= 3500 && parts.frankfurt >= 3500, 'Berlin und Frankfurt kurz, aber eigenständig');
		assert.ok(parts.dashboard >= 6000, `Dashboard-Text ${parts.dashboard} ms`);
	}
});

test('Leipzig: über 200 Personen mit festgestellter Identität, Kinder/Jugendliche als Teilgruppen, § 125a als Anfangsverdacht', () => {
	assert.match(seg('l1'), /Identität von über 200 Personen fest – darunter vier Kinder und über vierzig Jugendliche\./);
	assert.match(seg('l2'), /schweren Fall des Landfriedensbruchs/);
	assert.equal(seg('l3'), 'Wichtig: Beschuldigte sind keine Verurteilten – und Kinder unter vierzehn sind strafunmündig.');
	const le = CITIES[0];
	assert.equal(le.main.value, 'ÜBER 200');
	assert.match(le.main.label, /Identität festgestellt/);
	assert.ok(le.extras.some((x) => x.startsWith('darunter')), 'Teilgruppen als „darunter“');
	assert.match(LEIPZIG.notExtra, /nicht zusätzlich/);
	assert.doesNotMatch(all + content, /204|244|über 240|200 \+ 4|200 und 4/, 'Teilgruppen nie addiert');
	for (const q of [
		'Schlussendlich wurden die Identitäten von über 200 Personen festgestellt, darunter vier Kinder und über 40 Jugendliche.',
		'Somit wird gegen die Personen wegen des Anfangsverdachts des Verstoßes gegen § 125a Strafgesetzbuch ermittelt.',
		'Im Einsatz befanden sich circa 800 Einsatzkräfte der Polizei Sachsen sowie Kräfte aus Sachsen-Anhalt.',
		'Schuldunfähig ist, wer bei Begehung der Tat noch nicht vierzehn Jahre alt ist.',
	]) assert.ok(sources.includes(q), `Wortlaut: ${q}`);
	assert.doesNotMatch(all + caption + content, /Haftstrafe drohe|droht (eine )?Haft|Jahre Haft|verurteilt werden/i, 'keine Strafprognose');
	assert.equal(le.stand, '21.11.2026');
});

test('Hamburg: keine erfundene Gesamtzahl, Korrektur nur für diese Meldung, Anfragen ≠ Antworten', () => {
	const hh = CITIES[1];
	assert.equal(hh.main.count, undefined, 'keine geschätzte Zahl');
	assert.doesNotMatch(hh.main.value, /\d/);
	assert.match(seg('h1'), /eine Gesamtzahl ist öffentlich nicht bekannt/);
	assert.match(seg('h2'), /Seit dem 23\. November liegen dazu politische Anfragen vor – noch ohne Antwort\./);
	assert.deepEqual(HAMBURG.docs.map((d) => d.nr), ['Drs. 23/6066', 'Drs. 23-2220']);
	assert.ok(sources.includes('Korrektur: "Die Einsatzkräfte wurden nicht mit Flaschen, sondern mit Pyrotechnik beworfen."'));
	assert.match(scenesSrc, /betrifft diese eine Meldung/);
	assert.doesNotMatch(all + content + caption, /\b1[23]0 (vorläufige )?Festnahmen|keine Flaschen geworfen|nie Flaschen/i, '31.10.-Zahlen nicht übernommen, Korrektur nicht verallgemeinert');
	assert.ok(sources.includes('**Original bei Abruf nicht erreichbar**'), 'nicht erreichbares Original offen benannt');
});

test('Dresden, Stuttgart, Berlin, Frankfurt: Kategorie und Urheber stimmen mit den Quellen überein', () => {
	const [, , dd, st, be, ff] = CITIES;
	assert.match(seg('d1'), /Bei rund achtzig Personen nahm die Polizei die Personalien auf – Verdacht unter anderem: Landfriedensbruch\./);
	assert.match(dd.main.label, /Personalien aufgenommen/);
	assert.doesNotMatch(dd.main.label + dd.extras.join(' '), /Festnahme|festgenommen/);
	assert.ok(sources.includes('Dort wurden die etwa 80 Personen umschlossen.'));
	assert.match(seg('s1'), /über zwanzig vorläufige Festnahmen – Vorwürfe unter anderem: Vermummung, Beleidigung, Widerstand\./);
	assert.equal(st.main.label, 'vorläufige Festnahmen');
	assert.ok(st.extras.some((x) => /nicht jede Person/.test(x)));
	assert.ok(sources.includes('zu über zwanzig vorläufigen Festnahmen wegen versammlungstypischer Straftaten, darunter Verstöße gegen das Vermummungsverbot, Beleidigungen und Widerstände gegen Polizeibeamte.'));
	assert.match(seg('b1'), /Rund viertausend Menschen zogen laut Polizei friedlich durch die Stadt\./);
	assert.match(be.note, /4\.500/, 'abweichende Meldung offen genannt');
	assert.doesNotMatch(be.extras.join(' '), /keine Ermittlungen|keinerlei/, 'nicht behaupten, es gebe keinerlei Ermittlungen');
	assert.match(seg('f1'), /laut Innenministerium zehn Festnahmen und sechzehn Strafanzeigen/);
	assert.deepEqual([ff.main.value, ...ff.extras.slice(0, 2)], ['10', '16 Strafanzeigen', '342 Personenkontrollen']);
	assert.match(ff.main.label, /gesamter Einsatz/);
	assert.ok(sources.includes('In Frankfurt wurden 342 Personenkontrollen durchgeführt. Dabei kam es zu 10 Festnahmen, 2 Ingewahrsamnahmen und 52 Platzverweisen. Zudem wurden 16 Strafanzeigen gefertigt und 13 Ordnungswidrigkeiten festgestellt.'));
	assert.match(scenesSrc, /Haftrichter-Entscheidung nicht veröffentlicht|FRANKFURT\.halloween/);
});

test('31.10. getrennt, keine Addition, keine Rangliste, keine bundesweite Gesamtzahl', () => {
	assert.doesNotMatch(all + content + caption, /36 Tatverdächtige|57 Strafanzeigen|insgesamt \d+ (Festnahmen|Beschuldigte)|bundesweit \d/i);
	assert.doesNotMatch(content + dashSrc, /Platz \d|Rang \d|Spitzenreiter|gefährlichste|sortBy|\.sort\(/i);
	assert.match(DASHBOARD.hint.join(' '), /nicht direkt vergleichbar/);
	assert.match(DASHBOARD.hint.join(' '), /Beschuldigte sind keine Verurteilten/);
	assert.match(DASHBOARD.hint.join(' '), /Meldestände je Stadt unterschiedlich/);
	assert.ok(sources.includes('Stuttgart: 36 Tatverdächtige / 57 Strafanzeigen'), '31.10.-Meldung begründet ausgeschlossen');
	assert.match(seg('z2'), /Die meisten Zahlen sind noch die ersten Polizeimeldungen – Anklagen oder Urteile sind nicht bekannt\./);
});

test('Eine Datenquelle: Szenen und Dashboard lesen dieselben Städtedaten; Meldestand je Stadt; Koordinaten', () => {
	assert.match(scenesSrc, /from '\.\.\/data\/staedte'/);
	assert.match(scenesSrc, /dashboardCards = \(\): DashboardCard\[\] =>\n\tCITIES\.map/);
	assert.doesNotMatch(scenesSrc, /value=\{(200|80|20|4000|10|16)\}|total=\{(200|80)\}/, 'keine abweichend hart codierten Szenenzahlen');
	const ff = CITIES[5];
	assert.equal(ff.extras[0], `${ff.second!.count} ${ff.second!.label}`, 'Frankfurt: zweite Zahl in Szene und Dashboard identisch');
	const le = CITIES[0];
	assert.ok(le.groups!.reduce((n, g) => n + g.n, 0) < le.main.count!, 'Teilgruppen kleiner als die Gesamtmenge');
	assert.ok(le.extras.join(' ').includes('4 Kinder') && le.extras.join(' ').includes('über 40 Jugendliche'));
	const coords: Record<string, [number, number]> = {leipzig: [51.3397, 12.3731], hamburg: [53.5511, 9.9937], dresden: [51.0504, 13.7373], stuttgart: [48.7758, 9.1829], berlin: [52.52, 13.405], frankfurt: [50.1109, 8.6821]};
	for (const c of CITIES) {
		assert.deepEqual([c.lat, c.lon], coords[c.id], `${c.id}: Koordinaten`);
		assert.ok(c.stand && c.standShort && c.sourceShort && c.sources.length >= 1, `${c.id}: Meldestand + Quelle`);
		assert.ok(c.extras.length <= 3);
		for (const x of c.extras) assert.ok(x.length <= 38, `${c.id}: „${x}“ zu lang für die Karte`);
		assert.ok(c.main.label.length <= 34, `${c.id}: Kategorie kurz`);
		if (c.main.count !== undefined) assert.ok(c.main.value.replace(/\./g, '').includes(String(c.main.count)), `${c.id}: Zähler = Wert`);
		assert.doesNotMatch(c.stand, /27\.11/, 'Meldestand ≠ Recherchedatum');
	}
	assert.equal(RECHERCHE.date, '27.11.2026');
});

test('Dashboard: sechs gleich große Karten, innerhalb der Sicherheitszonen, ≥ 4 s vollständig stabil', () => {
	const cells = CITIES.map((_, i) => dashboardCell(i, CITIES.length));
	for (const c of cells) {
		assert.equal(Math.round(c.w), Math.round(cells[0].w));
		assert.equal(Math.round(c.h), Math.round(cells[0].h));
		assert.ok(c.x >= LAYOUT.left && c.x + c.w <= 930.5, 'rechte Spalte frei von App-Knöpfen');
		assert.ok(c.y >= 360 && c.y + c.h <= 1265, 'unterste Reihe über den Untertiteln');
	}
	assert.equal(DASHBOARD_LAYOUT.cols, 2);
	assert.ok(DASHBOARD_LAYOUT.valueSize >= 44 && DASHBOARD_LAYOUT.labelSize >= 20 && DASHBOARD_LAYOUT.extraSize >= 20 && DASHBOARD_LAYOUT.footSize >= 20);
	const build = Number(/export const DASHBOARD_BUILD = (\d+);/.exec(scenesSrc)![1]);
	const tl = erklaertTimelineFor(WOCHE_SCENES, script, manifest, 30, cfg.maxSeconds);
	const sc = tl.scenes.find((s) => s.id === 'dashboard')!;
	assert.ok(sc.durationInFrames - build >= 4 * 30, `stabil ${(sc.durationInFrames - build) / 30} s`);
	assert.ok(build <= 50, 'Aufbau ≤ 1,7 s');
	assert.match(read(`${dir}FrankfurtErklaertEineWocheDanachOverlayCheck.tsx`), /export const DASHBOARD_FRAME = \(scene\('dashboard'\)\?\.from \?\? 0\) \+ DASHBOARD_BUILD \+ 90;/);
	assert.ok(build + 90 < sc.durationInFrames - 10, 'Infografik-Frame liegt in der stabilen Phase');
	assert.equal(cfg.infografikName, 'FrankfurtRedNews_GenZ_BundesweiteStatistik_27Nov2026');
	assert.match(read('../.github/workflows/video-produzieren.yml'), /-Infografik/);
});

test('Sprechertext: Adam kurzformat-60 (speed 1.20), Ewa→Eywa, „Gen Z“ nicht gesprochen, ≈ 70 s Information', () => {
	assert.equal(script.voice.profile, 'kurzformat-60');
	assert.deepEqual(voiceSettingsFor(voice, script), {...voice.elevenlabs.voiceSettings, speed: 1.2});
	assert.equal(voice.elevenlabs.voiceId, 'pNInz6obpgDQGcFmaJgB');
	assert.equal(applyAussprache('Ewa, Frankfurt!', ausspracheFor(voice, script.videoId)), '{Ewa|Eywa}, Frankfurt!');
	for (const s of script.segments) assert.ok(s.pauseAfterMs <= 300, `${s.id}: Pause ≤ 300 ms`);
	assert.doesNotMatch(JSON.stringify(script.segments), /Gen Z|Dschen/, 'Gen Z nur im Bild (Aussprache-Risiko)');
	const chars = script.segments.filter((s: {id: string}) => !['hook1', 'cta'].includes(s.id)).reduce((n: number, s: {text: string}) => n + spoken(s.text).length, 0);
	assert.ok(chars >= 1200 && chars <= 1340, `Informationsteil ≈ 70 s (${chars} gesprochene Zeichen)`);
});

test('Sonderausgabe: Informationsteil ≈ 70 s nach der Begrüßung (68–72 s), ≤ 73,5 s ab 0, gesamt ≤ 80 s – nur diese Folge', () => {
	assert.equal(cfg.maxSeconds, 80);
	assert.equal(cfg.infoMaxSeconds, 73.5);
	assert.ok(String(cfg.sonderausgabe).length > 20 && String(cfg.ausnahme).length > 20);
	assert.equal(FORMAT.editionMaxSeconds, 80);
	assert.equal(FORMAT.editionInfoMaxSeconds, 73.5);
	assert.deepEqual(Object.entries(videos).filter(([, v]) => (v as {sonderausgabe?: string}).sonderausgabe).map(([k]) => k), ['FrankfurtErklaertEineWocheDanach'], 'keine andere Folge verlängert');
	assert.equal(FORMAT.maxSeconds, 60);
	assert.equal(FORMAT.extendedMaxSeconds, 66);
	const infoEnd = Math.max(...manifest.segments.filter((s) => s.id !== 'cta').map((s) => s.endMs));
	assert.ok(infoEnd <= cfg.infoMaxSeconds * 1000, `Informationsteil ${infoEnd} ms`);
	if (isAdam) {
		const greetEnd = manifest.segments.find((s) => s.id === 'hook1')!.endMs;
		const info = infoEnd - greetEnd;
		assert.ok(info >= 68000 && info <= 72000, `Information nach der Begrüßung ${info} ms`);
	}
	const tl = erklaertTimelineFor(WOCHE_SCENES, script, manifest, 30, cfg.maxSeconds);
	assert.ok(tl.durationInFrames <= cfg.maxSeconds * 30, `${tl.durationInFrames} ≤ ${cfg.maxSeconds * 30}`);
});

test('FrankfurtRedNews: Abo-Aufruf, Handle, Prüfbögen – Profilbild unverändert', () => {
	assert.equal(BRAND_NEWS.name, 'FrankfurtRedNews');
	assert.equal(handleWithAt('news'), '@frankfurtrednews');
	assert.equal(BRAND.logoFile, 'brand/frankfurtred-logo.webp');
	assert.equal(script.segments.at(-1).text, 'Für mehr Nachrichten aus Frankfurt folgt {FrankfurtRedNews|Frankfurt Rett News}!');
	assert.doesNotMatch(JSON.stringify(script) + scenesSrc + caption, /FrankfurtRed3|frankfurtred3|Rett Drei/);
	assert.match(scenesSrc, /handleWithAt\(NEWS\)/);
	assert.match(read(`${dir}FrankfurtErklaertEineWocheDanachCoverVorschau.tsx`), /handle=\{handleWithAt\('news'\)\}/);
	assert.equal(cfg.outputName, 'FrankfurtRedNews_GenZ_EineWocheDanach_Ermittlungsbilanz_27Nov2026');
});

test('Keine Logos/Fotos/realen Personen, Illustrationen gekennzeichnet', () => {
	const vis = read(`${dir}visuals/Cities.tsx`) + read(`${dir}visuals/Investigation.tsx`);
	assert.doesNotMatch(scenesSrc + vis, /<Img|<img|staticFile|\.jpg|\.png|\.webp/);
	assert.match(scenesSrc, /ILLUSTRATION/);
	assert.doesNotMatch(vis, /Bundesadler|Polizeistern|Landeswappen\b(?! )/);
});

test('Kopfzeile oben rechts, Quellenzeile unter den Untertiteln, keine SourceBar', () => {
	assert.match(compSrc, /badgePlacement: 'top-right'/);
	assert.match(compSrc, /episode: '#20'/);
	assert.match(compSrc, /sourceLine: \[\.\.\.SOURCE_LINE\]/);
	assert.match(compSrc, /maxSeconds: videos\.FrankfurtErklaertEineWocheDanach\.maxSeconds/);
	assert.doesNotMatch(scenesSrc, /SourceBar/);
	const tl = erklaertTimelineFor(WOCHE_SCENES, script, manifest, 30, cfg.maxSeconds);
	for (const s of SOURCE_LINE) {
		assert.ok(s.text.length <= 112, `Quelle ≤ 112 Zeichen: ${s.text}`);
		assert.doesNotMatch(s.text, /https?:|www\./);
		assert.ok(script.segments.some((x: {id: string}) => x.id === s.from), `Segment ${s.from}`);
	}
	assert.ok(resolveSourceLine([...SOURCE_LINE], manifest, 30, {start: 48, end: tl.durationInFrames}).length >= 9);
});

test('Titelbild nach COVER_ZONE, Recherchestand dokumentiert, Caption mit genau fünf Hashtags', () => {
	assert.ok(L.brandTop >= COVER_ZONE.coreTop + 50 && L.brandTop <= 400);
	assert.ok(L.kickerTop >= L.brandBottom && L.bigTop >= L.kickerBottom && L.tagTop >= L.bigBottom && L.artTop >= L.tagBottom && L.metaTop >= L.artBottom && L.thumbTop >= L.metaBottom);
	assert.ok(L.tagBottom <= COVER_ZONE.rightButtonsTop);
	assert.ok(L.artRight <= 930);
	assert.ok(L.metaBottom <= COVER_ZONE.videoBottom);
	assert.ok(L.thumbBottom <= COVER_ZONE.coreBottom);
	assert.ok(L.sideMin >= COVER_ZONE.side);
	assert.equal(COVER.kicker, 'GEN Z: EINE WOCHE DANACH');
	assert.equal(STAND.date, '27.11.2026');
	assert.ok(sources.includes(`**Letzter Faktencheck: ${STAND.date}, ${STAND.time} Uhr**`));
	assert.equal((caption.match(/#\w+/g) ?? []).length, 5);
	assert.match(flat(caption), /Recherchestand 27\.11\.2026/);
	assert.doesNotMatch(caption, /kommt (alle )?zur Demo|seid dabei|macht mit/i);
});
