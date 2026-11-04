# CLAUDE.md – SmokingTikTok Studio

Dauerhafte Produktions- und Designvorgaben für dieses Repository. Gilt für jede Session.

## Projekt in einem Satz

Cloudbasiertes Produktionssystem für animierte TikTok-Erklärvideos (Nachrichten, Hintergründe) mit
**Remotion + React + TypeScript**, gerendert in **GitHub Actions**, ohne kostenpflichtige Dienste.

## Harte Regeln

1. **Keine kostenpflichtigen Dienste, keine API-Keys.** Keine ElevenLabs-/OpenAI-/Cloud-TTS-Aufrufe einbauen,
   auch wenn ein Remotion-Skill das vorschlägt. Stimme: **Chatterbox (Standard, natürlich)**, Piper (schnelle
   Vorschau) – beide lokal – oder Import einer fertigen Datei. Stimmvorlagen nur mit Erlaubnis/Lizenz (`voices/README.md`).
2. **Fakten nur mit Beleg.** Jede Zahl, jedes Zitat, jede Schlagzeile steht mit Quelle und Abrufdatum in
   `references/<video-id>/sources.md` und im `content.ts` des Videos. Nichts erfinden, nichts zuspitzen.
   - Zahlen immer mit Urheber („laut Polizei“, „laut Veranstalter“, „laut Innenminister …“).
   - Bei abweichenden Angaben die vorsichtigere Formulierung („rund“, „mindestens“) oder beide nennen.
   - Schlagzeilen **wörtlich** übernehmen; Übersetzungen als „DE:“ kennzeichnen.
   - Umstrittene Einzelbehauptungen (z. B. Herkunft von Tatverdächtigen) nur mit sorgfältiger Einordnung – im
     Zweifel weglassen und in `sources.md` unter „Bewusst NICHT verwendet“ begründen.
   - Platzhalter (Showcase) klar als „Beispiel/Platzhalter“ kennzeichnen.
   - **Terminmeldungen** (Demos, Verbote): Stufen trennen – Gerücht · Ankündigung (Veranstalter) · Anmeldung · behördliche Entscheidung (siehe
     `references/frankfurt-2026-11-04-naechste-demo/sources.md`). Nie als „angekündigt/beschlossen“ ausgeben, was nur als Gerücht oder politische Äußerung belegt ist; Stand-Datum im Video nennen.
   - Eigene Beobachtung des Kanalbetreibers vor Ort ist ein Beleg (`"art": "augenzeuge"`), wenn sie im Video offen als solche
     benannt wird („wir haben es vor Ort gesehen“). Sie wird nie als Polizei- oder Medienangabe ausgegeben.
   - Referenzvideos **vollständig** Bild für Bild auswerten (Kontaktbogen mit 2 fps, verdächtige Stellen mit 5–10 fps), nicht nur Ausschnitte.
3. **Keine fremden Logos/Marken nachbauen.** Medien erscheinen als neutrale Wortmarke (`MediaBadge`).
   Echte Logos nur mit Nutzungsrecht als Datei in `public/` (`logoFile`-Prop).
4. **Keine realen Personen darstellen.** Figuren sind anonyme, stilisierte Vektorfiguren. Gewalt nicht
   explizit zeigen – Lichtstimmung, Symbole, Zahlen.
5. **Keine großen Binärdateien committen.** MP4/MOV/WebM sind per `.gitignore` ausgeschlossen; Renderings
   landen in `output/` (ignoriert) bzw. als GitHub-Artefakt. Erlaubt: Sprecher-MP3 (128 kbit/s, ≈ 1 MB pro Minute), kurze SFX-WAVs, kleine Standbilder (< 200 KB).
6. **Branding nur aus `src/theme/brand.ts`** (TikTok: **@frankfurtred3**, Profilbild „S“). Nie Accountnamen hart codieren.
7. **Schadensangaben dreistufig trennen:** sichtbarer Sachschaden · dokumentiertes Eindringen · nachgewiesene Entwendung.
   „Geplündert“ nur bei belegter Entwendung. Offizielle Zahlen (17 beschädigt / 5 davon geplündert) nie mit eigener
   Recherche-Zählung vermischen; die 5 sind Teil der 17. Keine erfundenen Schadenssummen.
8. **Fotos:** nur eigene/lizenzierte Bilder, keine erkennbaren Personen, Pressefotos nicht übernehmen; Fassadenfotos nie als
   Schadensfoto ausgeben; sonst `StorefrontIllustration` (im Bild als „Illustration“ gekennzeichnet). Rechte in `references/<id>/medienrechte.md`.
9. **Remotion-Pakete immer exakt gleiche Version** (`--save-exact`, aktuell 4.0.540). Upgrade mit
   `npx remotion upgrade`, danach Typecheck + Testrender.

## Exportnorm (TikTok / iPhone)

| Parameter | Wert |
|---|---|
| Auflösung | 1080 × 1920 (9:16) |
| Bildrate | 30 fps |
| Video | H.264 High, yuv420p, BT.709, CRF 18, `+faststart` |
| Audio | AAC 192 kbit/s, 48 kHz; Sprecher auf −14 LUFS, True Peak −1,5 dBTP |
| Länge | Standard-News 20–60 s (Frankfurt-Video ≈ 50 s inkl. Abspann) |

`npm run render -- <Komposition>` erzeugt genau diese Norm, `npm run verify -- <datei>` prüft sie.

## Design-System

- Tokens ausschließlich aus `src/theme/tokens.ts` (Farben, Schriften, Größen, Sicherheitszonen).
- Schriften: **Montserrat** 700–900 (Titel, Untertitel), **Inter** 500–800 (Text, Quellen) – lokal über
  `@fontsource`, kein Netzwerk beim Rendern. Jede Komposition ruft `ensureFontsLoaded()` auf.
- Farben: Nachtblau-Basis (`night`, `navy`), Akzente `signal` (Gelb, Hervorhebung), `alert` (Rot, Eskalation),
  `cyan` (Verbindungen), `violet`.
- **TikTok-Sicherheitszonen** (`SAFE_AREA`): oben 200 px, rechts 150 px, unten 430 px, links 64 px.
  Texte, Zahlen, Quellen immer innerhalb (`<SafeArea>`). Untertitel sitzen ~550 px über dem unteren Rand.
- Mindestschriftgrößen: Titel ≥ 58 px, Fließtext ≥ 27 px, Quellen ≥ 22 px.
- Jede Szene hat Bewegung (Kamera-Drift, Parallaxe, Partikel) – kein statisches Standbild länger als 1 s.
- Untertitel: TikTok-Stil, 1–3 Wörter pro Seite, aktives Wort gelb, dicker schwarzer Rand.

## Animationsregeln (Remotion)

- Alles über `useCurrentFrame()` + `interpolate()`/`spring()` – **keine** CSS-Transitions/-Animationen.
- `useCurrentFrame()` so tief wie möglich verwenden (nur dort, wo animiert wird).
- Zeitangaben in Szenen über `fps` aus `useVideoConfig()` bzw. die Sprecher-`cues`.
- Bevorzugt CSS-Eigenschaften `scale`, `translate`, `rotate` statt `transform`-Strings.
- Zufall nur über `random(seed)` aus `remotion` (deterministisch).
- SVG für Grafiken (bleibt bei Kamera-Zoom scharf); teure Filter (Blur) sparsam.
- Übergänge: DOM-basiert (`src/components/transitions/presentations.tsx`, `@remotion/transitions` fade/slide/wipe).
  WebGL-/HtmlInCanvas-Übergänge nur nach Test im Headless-Render.

## Ton & Stimme

- Sprechertext steht in `src/videos/<id>/script.json`, Markup `{Anzeige|Gesprochen}` für Zahlen/Abkürzungen.
- Eine Sprecherspur erzeugt immer: `public/voiceover/<id>/voiceover.mp3` + `src/videos/<id>/voiceover.json`.
- Szenenlängen und Untertitel werden **aus dem Manifest berechnet** (`buildTimeline`) – nie Frames hart codieren,
  die an gesprochene Sätze gebunden sind. Schnitte werden NIE gegenüber der Stimme verschoben; mehr Zeit für eine
  Szene → `pauseAfterMs` im Skript erhöhen. `maxDurationMs` kürzt nur den Nachlauf (Tests: `npm test`).
- Piper ist leicht zufällig (Dauer schwankt ±0,3 s): nach jedem `voice:piper` Länge prüfen und die erzeugten
  Dateien committen – der Workflow (`voice: repo`) rendert dann reproduzierbar.
- Wege: `npm run voice:chatterbox -- --check` (natürlich, Standard) · `npm run voice:piper` (schnell, künstlich) ·
  `npm run voice:import -- --file …` (fertige MP3/WAV,
  auch per Workflow: Datei nach `voice-input/<video-id>.mp3`, dann `voice: import`) ·
  `node scripts/voice/estimate-manifest.mjs` (stumm) · optional `npm run captions:whisper` (wortgenau).
- Soundeffekte und Musikbett nur selbst erzeugt (`scripts/audio/generate-sfx.mjs`, `generate-music.mjs`) oder CC0 mit Nachweis in `references/` (siehe `references/musik.md`).
- Sprechtempo: Chatterbox `tempo` 1.05–1.12, Piper `lengthScale` 0.78–0.88 (TikTok-typisch zügig).
- Chatterbox-Lautschrift: englische Namen eindeutschen (`{Snipes|Snaips}`), Zahlen/Uhrzeiten ausschreiben,
  Abkürzungen buchstabieren (`{AFP|A F P}`). Nach jeder Erzeugung `--check` (Whisper-Gegenprobe) lesen.
- Uhrzeiten nur so genau wie belegt („kurz vor 23 Uhr“ statt erfundener Minute); Ticker-Zeiten als „Meldung“ kennzeichnen.
- Karten: Bewegungen/Routen nur zeigen, wenn belegt – sonst „Reihenfolge der Meldungen“ und so beschriften.
  OpenStreetMap-Hinweis „© OpenStreetMap-Mitwirkende“ muss sichtbar sein (macht `CityStreetMap`).

## Videos

| Komposition | Ordner | Inhalt |
|---|---|---|
| `FrankfurtHeadlines` | `src/videos/frankfurt-2026-10-31/` | Folge 1: Demo, Nacht, internationale Schlagzeilen |
| `FrankfurtShops` | `src/videos/frankfurt-2026-10-31-geschaefte/` | Folge 2 (veröffentlicht): Schadenskarte aller recherchierten Geschäfte; Daten in `data/shops.json` (Tests: `tests/shops.test.ts`) |
| `FrankfurtNextDemo` | `src/videos/frankfurt-2026-11-04-naechste-demo/` | Folge 3: „Wann geht es weiter?“ – Termine 14./20./21.11., Polizei, Verbotsdebatte, Recht; Daten in `data/termine.json` (Tests: `tests/termine.test.ts`) |

## Projektstruktur

```
src/
  components/   wiederverwendbare Bausteine (backgrounds, characters, map, media, infographics,
                camera, transitions, text, subtitles, audio, layout)
  lib/          Animation, Farben, Format, Skript-Timing, Szenenplan
  theme/        Design-Tokens, Schriften
  videos/<id>/  ein Ordner pro Video: script.json, voiceover.json, content.ts, scenes/, Komposition
  showcase/     Vorschau aller Bausteine (Platzhalter)
  Root.tsx      Registrierung aller Kompositionen
public/         statische Dateien (voiceover/, sfx/)
voices/         Stimmvorlagen für Chatterbox (nur mit Lizenz, siehe voices/README.md)
src/data/maps/  Stadtpläne aus OpenStreetMap (ODbL)
voice-input/    hochgeladene Roh-Sprecherdateien (<video-id>.mp3|wav|m4a)
tests/          Unit-Tests (node --test)
scripts/        Node-Skripte: render, verify, still, voice/*, audio/*
references/     Quellen, Recherche, Lizenznachweise
output/         Renderings (nicht versioniert)
.claude/skills/ offizielle Remotion Agent Skills (remotion-dev/skills)
```

## Neues Video anlegen (Checkliste)

1. Recherche → `references/<id>/sources.md` (Quellen, Abrufdatum, „bewusst nicht verwendet“).
2. `src/videos/<id>/script.json` (Segmente = Sätze) und `content.ts` (alle Fakten mit Quelle).
3. Szenen in `scenes/` aus Bibliotheks-Bausteinen bauen; `SceneSpec`s den Segmenten zuordnen.
4. Komposition in `src/Root.tsx` registrieren (mit `calculateMetadata`).
5. Stimme: `npm run voice:piper -- --video <id>` oder `voice:import`.
6. `npm run check`, `npm run still -- --comp <Id> --every 30`, Bilder ansehen (auch Frame 0 = TikTok-Vorschau).
7. `npm run render -- <Id>` → Prüfbericht muss grün sein → GitHub-Workflow „Video rendern“.

## Befehle

```bash
npm run dev                                   # Remotion Studio (Vorschau)
npm run check                                 # TypeScript + ESLint + Unit-Tests
npm run still -- --comp FrankfurtHeadlines --every 30
npm run render -- FrankfurtHeadlines          # MP4 + Prüfbericht in output/
npm run verify -- output/FrankfurtHeadlines.mp4
npm run voice:setup-chatterbox && npm run voice:chatterbox -- --video frankfurt-2026-10-31 --check
npm run voice:setup-piper && npm run voice:piper -- --video frankfurt-2026-10-31
node scripts/maps/build-osm-map.mjs --bbox 8.6700,50.1085,8.6915,50.1185 --out src/data/maps/frankfurt-innenstadt.json
npm run voice:import -- --video frankfurt-2026-10-31 --file voice-input/sprecher.mp3
```

In Cloud-Containern mit vorinstallierter Chrome Headless Shell wird diese automatisch gefunden
(`scripts/lib/remotion.mjs`), sonst `REMOTION_BROWSER_EXECUTABLE` setzen oder `npx remotion browser ensure`.

## Lizenzen (Kurzfassung)

- Remotion: frei für Einzelpersonen, Firmen bis 3 Mitarbeitende und Non-Profits, sonst Firmenlizenz (remotion.pro).
- Stills: In `<Still>` ist `useCurrentFrame()` immer 0 → für Cover `<Sequence from={-N}>` statt `<Freeze>` nutzen.
- Kartendaten: Natural Earth (gemeinfrei) via `world-atlas` (ISC).
- Schriften: Montserrat, Inter – SIL Open Font License.
- Stimme `de_DE-thorsten-high`: Datensatz Thorsten-Voice, CC0. Piper-Engine: GPL-3.0 (nur Werkzeug).
