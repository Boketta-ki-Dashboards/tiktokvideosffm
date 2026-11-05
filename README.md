# SmokingTikTok Studio

Cloudbasiertes Produktionssystem für **animierte TikTok-Erklärvideos** – gebaut mit
[Remotion](https://www.remotion.dev) (React + TypeScript), gerendert in **GitHub Actions**.
Keine kostenpflichtigen Dienste, keine API-Keys, keine lokale Installation nötig.

**Erstes Testvideo:** „Wie die Ereignisse vom 31. Oktober 2026 in Frankfurt internationale Schlagzeilen machten“
– ca. 50 s, 1080 × 1920, 30 fps, H.264/AAC, mit natürlicher deutscher KI-Stimme, synchronen Untertiteln,
animiertem Stadtplan der Nacht (Läden, Uhrzeiten) und Folgen-Abspann.
Alle Fakten sind belegt: [`references/frankfurt-2026-10-31/sources.md`](references/frankfurt-2026-10-31/sources.md).

**„Wie Frankfurt weltweit Schlagzeilen machte“** (Komposition `FrankfurtWorldwide`, Neufassung der unveröffentlichten Folge 1, Stimme ElevenLabs Adam,
Export `FrankfurtRed3_International_ADAM_FINAL.mp4`): Ablauf der Nacht mit Übersichtskarte, offizielle Bilanz, virale Bilder (Batman-Kostüm laut
AP/Reuters-Bildunterschriften, Schuh-Memes mit CORRECTIV-Faktencheck), Weltkarte mit Bögen in 24 Länder und Schlagzeilen nach Regionen –
mindestens 26 Medien als Stichprobe. Neues SFX-System (`src/lib/sfx.ts`).
Daten: [`src/videos/frankfurt-2026-10-31-international/data/medien.json`](src/videos/frankfurt-2026-10-31-international/data/medien.json) ·
Quellen: [`references/frankfurt-2026-10-31-international/sources.md`](references/frankfurt-2026-10-31-international/sources.md)

**Folge 2 – „Welche Läden hat es getroffen?“** (Komposition `FrankfurtShops`, ≈ 77,5 s): animierte Schadenskarte der
Innenstadt mit allen recherchierten Geschäften (rot = Diebstahl belegt, orange = Sachschaden, grau = ungeklärt),
Infokarten mit Fotos/Illustrationen, Schadenshöhe, Gesamtbilanz (offiziell vs. Recherche) und Outro @frankfurtred3.
Daten: [`src/videos/frankfurt-2026-10-31-geschaefte/data/shops.json`](src/videos/frankfurt-2026-10-31-geschaefte/data/shops.json) ·
Tabelle & Quellen: [`references/frankfurt-2026-10-31-geschaefte/sources.md`](references/frankfurt-2026-10-31-geschaefte/sources.md) ·
Drehbuch: [`drehbuch.md`](references/frankfurt-2026-10-31-geschaefte/drehbuch.md) · Medienrechte: [`medienrechte.md`](references/frankfurt-2026-10-31-geschaefte/medienrechte.md)

**Folge 3 – „Frankfurt Part 2 – 14. oder 21. November? Wann geht es wirklich weiter?“** (Komposition `FrankfurtNextDemo`, ≈ 79 s, Stimme ElevenLabs Adam):
Kalenderkarten, Deutschlandkarte mit den 34 angekündigten Städten, Polizei-/Verbotsdebatte und Rechtslage (Art. 8 GG). Stand 04.11.2026.
Daten: [`src/videos/frankfurt-2026-11-04-naechste-demo/data/termine.json`](src/videos/frankfurt-2026-11-04-naechste-demo/data/termine.json) ·
Quellen: [`references/frankfurt-2026-11-04-naechste-demo/sources.md`](references/frankfurt-2026-11-04-naechste-demo/sources.md) ·
Drehbuch: [`drehbuch.md`](references/frankfurt-2026-11-04-naechste-demo/drehbuch.md) · Musik: [`musik.md`](references/musik.md)

---

## Video produzieren mit der Standardstimme ElevenLabs Adam

Alle FrankfurtRed3-Videos werden mit **ElevenLabs „Adam“** vertont (zentral in [`config/voice.json`](config/voice.json)).
Der API-Key liegt nur als GitHub-Secret `ELEVENLABS_API_KEY` vor und wird ausschließlich im Workflow genutzt.

1. **Actions → „Video produzieren (ElevenLabs Adam)“ → Run workflow** (nach dem Merge auf `main` sichtbar)
2. `video` wählen (z. B. `FrankfurtNextDemo`), `aktion`: `hoerprobe` · `nur-stimme` · `video`
3. `stimme`: `wiederverwenden` (Standard, keine Credits für unveränderte Sätze) oder `neu-erzeugen`
4. Nach dem Lauf unter **Artifacts**: `FrankfurtRed3_Folge3_ADAM_FINAL-run<N>` (MP4 + Titelbild + Prüfbericht) und
   `…-Sprecher-Adam-run<N>` (MP3 der Stimme). Das Video wird **nicht** automatisch veröffentlicht.

Vor dem Merge funktioniert dasselbe über die Auftragsdatei [`voice-jobs/auftrag.json`](voice-jobs/README.md) (ändern und pushen).
Der Workflow prüft die Stimme über die API (nur die originale Adam-Stimme), das Modell und das Guthaben, erzeugt nur fehlende
Sätze, schneidet sie an den ElevenLabs-Zeitstempeln, baut daraus wortgenaue Untertitel und prüft am Ende die Synchronität
(`scripts/voice/check-sync.mjs`). Bei einem API-Fehler bricht er mit Erklärung ab – ohne heimlich auf eine andere Stimme zu wechseln.

## Video herunterladen (GitHub Actions)

1. Im Repository oben auf **Actions** klicken.
2. Links den Workflow **„Video rendern“** wählen.
3. Rechts **„Run workflow“** → Branch wählen → Eingaben prüfen:
   - `composition`: `FrankfurtWorldwide` (international), `FrankfurtHeadlines` (Folge 1, Sicherung), `FrankfurtShops` (Folge 2) oder `FrankfurtNextDemo` (Folge 3)
   - `video_id`: `frankfurt-2026-10-31`, `frankfurt-2026-10-31-geschaefte` bzw. `frankfurt-2026-11-04-naechste-demo` (nur für Stimme neu erzeugen/importieren)
   - `voice`: `repo` (vorhandene Sprecherspur), `chatterbox` (natürliche Stimme neu erzeugen, ≈ 10–20 min),
     `import` (deine Datei aus `voice-input/`), `piper` (schnelle Roboterstimme) oder `none` (stumm)
   - `crf`: `18` (Qualität)
4. **„Run workflow“** klicken. Nach ca. 3–6 Minuten ist der Lauf grün.
5. Den Lauf öffnen → ganz unten unter **Artifacts** auf `<Komposition>-run<N>` (z. B. `FrankfurtShops-run4`) klicken
   → ZIP herunterladen. Darin: `<Komposition>.mp4`, `<Komposition>-cover.png` (Titelbild) und der Prüfbericht.

Vor dem Merge (der Knopf „Run workflow“ erscheint erst, wenn der Workflow auf `main` liegt): Ändert ein Pull Request
`render-video.yml`, rendert der Workflow automatisch **alle drei Folgen** – die Artefakte hängen am jeweiligen Lauf im PR.

Auf dem iPhone: ZIP in der Dateien-App öffnen → MP4 antippen → Teilen → „Video sichern“ → in TikTok hochladen.
Der Prüfbericht steht zusätzlich in der Zusammenfassung des Workflow-Laufs.

## Was drin ist

| Bereich | Komponenten (`src/components/…`) |
|---|---|
| Städte & Hintergründe | `GradientSky`, `Stars`, `Clouds`, `CitySkyline` (prozedural, jede Stadt), `FrankfurtSkyline` (handgezeichnet, mit Main & Eisernem Steg), `StreetFacades`, `EmergencyLights`, `GrainOverlay` |
| Figuren | `VectorPerson` (Gehzyklus, Jubeln, Schilder mit Symbolen), `Crowd` (Tiefenstaffelung, Marsch) |
| Weltkarte | `WorldMap` (Natural Earth 1:50 Mio., Kamerafahrten, Länder-Highlights, animierte Verbindungsbögen, Pins mit Flaggen-Labels), `PLACES`, `COUNTRY_IDS` |
| Stadtplan | `CityStreetMap` (echte OpenStreetMap-Geometrie, Kamerafahrt, Marker mit Info-Karten, Straßen-Sweeps, Brennpunkte, Abfolge-Linie); Daten per `scripts/maps/build-osm-map.mjs` |
| Abspann | `FollowCta` (Finger tippt auf das Folgen-Plus, Plus → Haken, Kommentar-Aufforderung); Account & Profilbild aus `src/theme/brand.ts` (**@frankfurtred3**, „S“) |
| Kalender & Termine | `CalendarCard` (Abreißkalender-Karte mit Status), `MonthGrid` (Monatsansicht mit Kamerafahrt auf einen Tag) |
| Deutschlandkarte | `GermanyMap` (Natural Earth, Städtepunkte mit Pop-in, Hervorhebung einer Stadt) |
| Recht & Politik | `ArticleCard` (Gesetzestext), `LawScale` (Waage), `HurdleLadder` (Voraussetzungen), `PressRelease`, `DecisionTrack` (Ankündigung ≠ Entscheidung), `PoliceCar`, `ChatMock` (nachgestellte Nachricht) |
| Schadenskarte | `DamagePins` (Status-Pins rot/orange/grau, Cluster statt Überlappung, kollisionsfreie Schilder, Verbindungslinien), `ShopCard`, `StorefrontIllustration`; automatische Straßennamen in `CityStreetMap` |
| Flaggen, Medien, Quellen | `Flag` (17 Länder + Fallback), `MediaBadge` (neutrale Wortmarke, optional lizenziertes Logo), `HeadlineCard` (Original-Schlagzeile + Übersetzung), `SourceCredit` |
| Statistiken & Infografiken | `AnimatedNumber` (deutsches Zahlenformat), `StatCard`, `ComparisonBars`, `ProgressRing`, `Timeline` |
| Kamera & Übergänge | `Camera` (Keyframes: Zoom, Schwenk, Neigung, Wackeln), `KenBurns`, `focusOn`; Übergänge `zoomThrough`, `whipPan`, `circleReveal`, `flashCut` + Remotion `fade`/`slide`/`wipe` |
| Text | `KineticText` (Wort-für-Wort), `Kicker`, `DateBadge`, `LowerThird` |
| Untertitel | `TikTokSubtitles` (1–3 Wörter/Seite, aktives Wort hervorgehoben) |
| Ton | `Voiceover`, `SoundEffect`, `MusicBed` (automatisches Ducking unter der Stimme) |

Alle Bausteine auf einen Blick: Komposition **`ComponentShowcase`** im Studio.

## Stimme

Die Videolänge, die Szenenschnitte und die Untertitel richten sich **automatisch** nach der Sprecherspur.
Jede Variante erzeugt `public/voiceover/<video>/voiceover.mp3` + `src/videos/<video>/voiceover.json`.

| Weg | Befehl | Wann |
|---|---|---|
| **ElevenLabs Adam** (Standard, bezahlt, Secret `ELEVENLABS_API_KEY`) | Workflow „Video produzieren (ElevenLabs Adam)“ bzw. `node scripts/voice/elevenlabs-tts.mjs --video <id>` | **Standard für alle Folgen** |
| Chatterbox (lokal, kostenlos; Fallback) | `npm run voice:setup-chatterbox` → `npm run voice:chatterbox -- --video frankfurt-2026-10-31 --check` | nur manuell |
| **Piper** (sehr schnell, aber künstlich) | `npm run voice:setup-piper` → `npm run voice:piper -- --video frankfurt-2026-10-31` | schnelle Vorschau |
| **Fertige MP3/WAV importieren** | `npm run voice:import -- --video frankfurt-2026-10-31 --file voice-input/sprecher.mp3` | eigene Aufnahme oder Datei aus einer TTS-App deiner Wahl |
| Wortgenaue Untertitel (Whisper, lokal) | `npm run captions:whisper -- --video frankfurt-2026-10-31` | nach einem Import, wenn die Schätzung nicht reicht |
| Stumm | `node scripts/voice/estimate-manifest.mjs --video …` | Vorschau ohne Stimme |

Der Import normalisiert automatisch (−14 LUFS, Präsenz-EQ, Kompressor), entfernt Stille und erkennt die
Satzgrenzen über Sprechpausen. Recherche zu kostenlosen, rechtlich nutzbaren Stimmen:
[`references/voices.md`](references/voices.md).

**Eigene MP3/WAV nur über GitHub einspielen (ohne lokale Installation):**

1. Datei wie den Video-Ordner benennen, z. B. `frankfurt-2026-10-31.mp3`.
2. Auf GitHub in den Ordner [`voice-input/`](voice-input/) → **Add file → Upload files** → **Commit changes**.
3. **Actions → „Video rendern“ → Run workflow** mit `voice: import`.

Der Workflow normalisiert, erkennt die Sätze, passt Schnitte und Untertitel an und rendert das Video.

## Lokal oder in Claude Code Cloud arbeiten

```bash
npm ci
npm run dev                                      # Remotion Studio (Vorschau im Browser)
npm run check                                    # TypeScript + ESLint + Unit-Tests
npm run still -- --comp FrankfurtHeadlines --every 30   # Kontrollbilder nach output/stills/
npm run render -- FrankfurtHeadlines             # MP4 nach output/ + automatische Prüfung
```

Voraussetzungen: Node.js ≥ 22.18, FFmpeg (für Stimme/Prüfung). Chrome Headless Shell lädt Remotion selbst
(`npx remotion browser ensure`); in Cloud-Containern wird eine vorinstallierte automatisch gefunden.

## Projektstruktur

```
src/components/   Bibliothek wiederverwendbarer Bausteine
src/lib/          Animation, Farben, Skript-Timing, Szenenplan (Stimme → Schnitte)
src/theme/        Design-Tokens, Schriften
src/videos/<id>/  ein Ordner pro Video (Skript, Fakten, Szenen, Komposition)
src/showcase/     Vorschau aller Bausteine
public/           Sprecherspuren, Soundeffekte
voice-input/      hier fertige Sprecherdateien hochladen (Workflow-Option voice: import)
tests/            Unit-Tests (Timing Stimme ↔ Szenen)
scripts/          Rendern, Prüfen, Stimme, Soundeffekte
references/       Quellen, Faktencheck, Lizenzen, Stimmen-Recherche
output/           Renderings (nicht im Git)
.github/workflows render-video.yml (manuell), ci.yml (bei jedem Push/PR)
.claude/skills/   offizielle Remotion Agent Skills
```

Produktions- und Designregeln: [`CLAUDE.md`](CLAUDE.md).

## Lizenzen & Hinweise

- **Remotion** ist frei für Einzelpersonen, Firmen bis 3 Mitarbeitende und Non-Profits; größere Firmen
  benötigen eine [Company License](https://www.remotion.pro/license).
- Kartendaten: Natural Earth (gemeinfrei) über `world-atlas`. Schriften: Montserrat & Inter (SIL OFL).
- Stimme: Thorsten-Voice-Datensatz (CC0) über Piper (GPL-3.0, nur als Werkzeug).
- Soundeffekte: synthetisch mit FFmpeg erzeugt (`scripts/audio/generate-sfx.mjs`), keine Fremdsamples.
- Medienlogos werden nicht nachgebaut; Medien erscheinen als neutrale Wortmarken.
