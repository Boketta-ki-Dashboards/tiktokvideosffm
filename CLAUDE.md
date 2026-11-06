# CLAUDE.md – SmokingTikTok Studio

Dauerhafte Produktions- und Designvorgaben für dieses Repository. Gilt für jede Session.

## Projekt in einem Satz

Cloudbasiertes Produktionssystem für animierte TikTok-Erklärvideos (Nachrichten, Hintergründe) mit
**Remotion + React + TypeScript**, gerendert in **GitHub Actions**. Einziger bezahlter Dienst: **ElevenLabs** (Stimme Adam).

## Harte Regeln

1. **Standardstimme für ALLE FrankfurtRed3-Videos: ElevenLabs „Adam“** (Folge 3, 4, 5 …; Starter-Tarif des Kanalbetreibers).
   - Konfiguration nur zentral in `config/voice.json` (Voice-ID `pNInz6obpgDQGcFmaJgB`, Modell `eleven_multilingual_v2`,
     Stability/Similarity/Style/Speed). Keine Ersatz- oder Bibliotheksstimme mit ähnlichem Namen – das Skript prüft per API.
   - API-Key **nur** als GitHub-Actions-Secret `ELEVENLABS_API_KEY`; nie im Code, in Dateien, Logs, Commits – und nie im Chat
     danach fragen. Claude Code Cloud hat keinen Zugriff darauf → Erzeugung läuft im Workflow „Video produzieren (ElevenLabs Adam)“
     (vor dem Merge per `voice-jobs/auftrag.json`, siehe `voice-jobs/README.md`).
   - Credits sparen: erzeugte Sätze liegen in `voice-cache/elevenlabs/<video>/` (im Repository) und werden wiederverwendet,
     solange Text, Stimme und Einstellungen gleich sind. Erst Hörprobe (`aktion: hoerprobe`), dann die ganze Folge.
   - Fällt ElevenLabs aus, bricht der Workflow mit Erklärung ab. **Kein** automatischer Wechsel zu Chatterbox/Piper;
     diese bleiben nur als manueller Fallback (`npm run voice:chatterbox` / `voice:piper`).
   - Keine weiteren bezahlten Dienste/API-Keys ohne ausdrückliche Freigabe. Videos werden nie automatisch veröffentlicht.
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
   - **Prognose-Videos:** jede Aussage sichtbar als FAKT · ANGEKÜNDIGT · EINSCHÄTZUNG · OFFEN · FIKTION kennzeichnen (`StatusChip`); keine Prozentwerte,
     „Verbot diskutiert“ ≠ „verboten“; Witze mit erfundenen Firmen klar als Fiktion, ohne echte Namen/Beträge.
   - **Medienzählungen** („X Medien in Y Ländern“): nur selbst abgerufene Berichte mit wörtlich geprüfter Schlagzeile zählen; Agentur-Übernahme
     (Reuters/AFP/AP/dpa …) und eigener Bericht getrennt kennzeichnen; immer „mindestens“ + „Stichprobe“, nie als weltweite Gesamtzahl.
     Zahl im Ton muss aus den Daten folgen (Test). Virale Inhalte nur mit Herkunft (Agentur/Medium); keine View-/Like-Zahlen ohne Beleg;
     Nicht-Verifizierbares (z. B. „Power Rangers“) weglassen und unter „Bewusst NICHT verwendet“ begründen.
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
- Eine Sprecherspur erzeugt immer: Audio unter `public/voiceover/<id>/` + `src/videos/<id>/voiceover.json` (aktives Manifest).
  Adam: `voiceover-adam.mp3`, Untertitel exakt aus den ElevenLabs-Zeichen-Zeitstempeln (`captionsSource: elevenlabs-alignment`).
  Ältere Fassungen anderer Engines bleiben als `voiceover.<engine>.json` + eigene MP3 erhalten.
- Szenenlängen und Untertitel werden **aus dem Manifest berechnet** (`buildTimeline`) – nie Frames hart codieren,
  die an gesprochene Sätze gebunden sind. Schnitte werden NIE gegenüber der Stimme verschoben; mehr Zeit für eine
  Szene → `pauseAfterMs` im Skript erhöhen. `maxDurationMs` kürzt nur den Nachlauf (Tests: `npm test`).
- Piper ist leicht zufällig (Dauer schwankt ±0,3 s): nach jedem `voice:piper` Länge prüfen und die erzeugten
  Dateien committen – der Workflow (`voice: repo`) rendert dann reproduzierbar.
- Wege: **Workflow „Video produzieren (ElevenLabs Adam)“** (Standard) bzw. `node scripts/voice/elevenlabs-tts.mjs --video <id>`
  (nur mit Secret; `--dry-run` zeigt Plan und Credits, `--offline` nutzt nur den Cache) ·
  Fallback: `npm run voice:chatterbox -- --check` · `npm run voice:piper` (schnell, künstlich) ·
  `npm run voice:import -- --file …` (fertige MP3/WAV,
  auch per Workflow: Datei nach `voice-input/<video-id>.mp3`, dann `voice: import`) ·
  `node scripts/voice/estimate-manifest.mjs` (stumm) · optional `npm run captions:whisper` (wortgenau).
- Soundeffekte und Musikbett nur selbst erzeugt (`scripts/audio/generate-sfx.mjs`, `generate-music.mjs`), CC0 mit Nachweis in `references/` (siehe `references/musik.md`)
  oder als ElevenLabs-Premium-Effekt (s. u.).
- **Reine Bild-Überarbeitungen (Premium-Fassungen):** neue Komposition, die die Original-Komposition unsichtbar (`display: none`, Untertitel aus) als
  einzige Tonquelle mountet; gleiche Timeline/Übergänge/Cue-Formeln; Premium-Szenen erzeugen keinen eigenen Ton. Workflow mit `stimme: vorhanden`
  (kein ElevenLabs-Aufruf), Eintrag `vergleich` in `config/videos.json` → Ton-Identitätsprüfung, FFprobe-Bericht (`scripts/tech-report.mjs`) und
  Vorher-Nachher-Bogen (`scripts/compare-scenes.mjs`). Die Original-Fassung bleibt unverändert erhalten.
- **SFX-System (ab `FrankfurtWorldwide` für alle neuen Videos):** Effekte nur über `src/lib/sfx.ts` (semantische Namen, dezente Grundlautstärken ≤ 0,4)
  und `<Sfx name="…" at={frame} />` direkt in der Szene neben der auslösenden Animation (bildgenau, an Stimm-Cues). Komposition umschließt alles mit
  `<SfxProvider enabled={sfx}>`. Zuordnung: Text/Kalender/Chips → `click`/`pop` · Social-Karten → `notify` · Statistik → `softImpact` · Karte/Land → `blip`,
  Schwenk → `whoosh` · Schlagzeilen → `typewriter`/`paper` · Faktencheck → `stamp` · Weltkarten-Finale → `riser` + `boom`.
  `generate-sfx.mjs` überschreibt vorhandene Dateien nie (fertige Folgen klingen gleich), `--force` nur bewusst.
- **ElevenLabs Sound Effects** (`POST /v1/sound-generation`, `eleven_text_to_sound_v3`): wenige kurze Effekte in `config/sfx-elevenlabs.json`, einmal erzeugt
  (`scripts/audio/elevenlabs-sfx.mjs`, Workflow-Schritt bei `aktion: video`), Cache `voice-cache/elevenlabs-sfx/`, Ausgabe `public/sfx/premium/` + `src/lib/sfx-premium.ts`
  (ersetzt gleichnamige Synth-Effekte automatisch, für alle Folgen wiederverwendet). Fehlt dem Key die Berechtigung: genau EINE Probe-Anfrage, Erklärung in der
  Zusammenfassung, Fallback auf Synth-Effekte – nie umgehen, nie nach dem Key fragen.
- **Sprechtempo: Adam `speed` 1.16 – zuletzt erfolgreich verwendet und vom Kanalbetreiber akzeptiert (Folge 3, Commit d99eacd); gilt fest für ALLE Folgen.**
  Übrige Adam-Werte ebenso fest: stability 0.45, similarity_boost 0.8, style 0.2, use_speaker_boost true, seed 20261104, `mp3_44100_128`.
  Nie automatisch zwischen Folgen ändern; nur auf ausdrücklichen Wunsch in `config/voice.json` (dann Hörprobe). (Fallback: Chatterbox `tempo` 1.05–1.12, Piper `lengthScale` 0.78–0.88).
- Adam-Lautschrift: Zahlen/Daten ausschreiben (`{14. November|vierzehnte November}`), `{Gen Z|Dschen Zett}`; nach jeder Erzeugung
  `node scripts/voice/check-sync.mjs` (läuft im Workflow) und, falls lokal vorhanden, Whisper-Gegenprobe (`--check`).
- Chatterbox-Lautschrift (Fallback): englische Namen eindeutschen (`{Snipes|Snaips}`), Zahlen/Uhrzeiten ausschreiben,
  Abkürzungen buchstabieren (`{AFP|A F P}`). Nach jeder Erzeugung `--check` (Whisper-Gegenprobe) lesen.
- Uhrzeiten nur so genau wie belegt („kurz vor 23 Uhr“ statt erfundener Minute); Ticker-Zeiten als „Meldung“ kennzeichnen.
- Karten: Bewegungen/Routen nur zeigen, wenn belegt – sonst „Reihenfolge der Meldungen“ und so beschriften.
  OpenStreetMap-Hinweis „© OpenStreetMap-Mitwirkende“ muss sichtbar sein (macht `CityStreetMap`).

## Videos

| Komposition | Ordner | Inhalt |
|---|---|---|
| `FrankfurtWorldwide` | `src/videos/frankfurt-2026-10-31-international/` | „Wie Frankfurt weltweit Schlagzeilen machte“ – Neufassung der unveröffentlichten Folge 1 (ohne Folgennummer im Bild): **V2:** kurzer Ablauf + Bilanz, virale Bilder (Batman mit Selbstdarstellung des Accounts @ichbinyounes – nie als Festgenommener/Täter, kein Gesicht; Meme „3 linke Schuhe“ als anonyme Illustration), Weltkarte, Schlagzeilen nach Regionen; Medienliste `data/medien.json` (Tests: `tests/international.test.ts`), Export `FrankfurtRed3_International_ADAM_FINAL_V2.mp4` |
| `FrankfurtNov20Forecast` | `src/videos/frankfurt-2026-11-20-ausblick/` | Ausblick „20. November – wieder Eskalation?“: Halloween-Faktor, Polizei (angekündigt), Läden (möglich), Fazit als Einschätzung, Plot-Twist mit erfundener Firma (als FIKTION markiert), Kommentarfrage; jede Aussage mit Status FAKT/ANGEKÜNDIGT/EINSCHÄTZUNG/OFFEN/FIKTION (Tests: `tests/nov20.test.ts`), Export `FrankfurtRed3_20November_Ausblick_ADAM_FINAL.mp4` |
| `FrankfurtNov20ForecastPremium` | `src/videos/frankfurt-2026-11-20-ausblick/` (`premium/`, `FrankfurtNov20ForecastPremium.tsx`) | PREMIUM-Bildfassung des Ausblicks: neue Szenen in `premium/scenes/`, Designsystem `premium/kit.tsx`, Illustrationen (NightCity, Storefront, Person, PoliceVan, Craftsman). Ton/Timing/Untertitel/Outro unverändert – Original-Komposition läuft unsichtbar als Tonquelle; Sperrdatei `premium/lock.json` (SHA-256 von Skript, Manifest, Adam-MP3, Musik, voice.json), Tests `tests/nov20-premium.test.ts`; Export `FrankfurtRed3_20November_Ausblick_ADAM_PREMIUM_FINAL.mp4` (Workflow mit `stimme: vorhanden`) |
| `FrankfurtHeadlines` | `src/videos/frankfurt-2026-10-31/` | Folge 1 (Sicherung, unveröffentlicht): Demo, Nacht, internationale Schlagzeilen |
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
5. Neues Video in `config/videos.json` und als Option im Workflow `video-produzieren.yml` eintragen.
6. `npm run check`, `npm run still -- --comp <Id> --every 30`, Bilder ansehen (auch Frame 0 = TikTok-Vorschau).
5a. Stimme immer mit Adam: Auftrag `{"video": "<Komposition>", "aktion": "hoerprobe"}` → anhören → `"aktion": "video"`.
7. `npm run render -- <Id>` → Prüfbericht muss grün sein → GitHub-Workflow „Video produzieren (ElevenLabs Adam)“ (Artefakt `FrankfurtRed3_Folge<N>_…`).

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
- Stimme Adam: ElevenLabs-Standardstimme; kommerzielle Nutzung durch den bezahlten Tarif (Starter) abgedeckt.
- Fallback-Stimme `de_DE-thorsten-high`: Datensatz Thorsten-Voice, CC0. Piper-Engine: GPL-3.0 (nur Werkzeug).
