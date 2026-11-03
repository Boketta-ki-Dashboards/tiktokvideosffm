# SmokingTikTok Studio

Cloudbasiertes Produktionssystem für **animierte TikTok-Erklärvideos** – gebaut mit
[Remotion](https://www.remotion.dev) (React + TypeScript), gerendert in **GitHub Actions**.
Keine kostenpflichtigen Dienste, keine API-Keys, keine lokale Installation nötig.

**Erstes Testvideo:** „Wie die Ereignisse vom 31. Oktober 2026 in Frankfurt internationale Schlagzeilen machten“
– ca. 50 s, 1080 × 1920, 30 fps, H.264/AAC, mit natürlicher deutscher KI-Stimme, synchronen Untertiteln,
animiertem Stadtplan der Nacht (Läden, Uhrzeiten) und Folgen-Abspann.
Alle Fakten sind belegt: [`references/frankfurt-2026-10-31/sources.md`](references/frankfurt-2026-10-31/sources.md).

---

## Video herunterladen (GitHub Actions)

1. Im Repository oben auf **Actions** klicken.
2. Links den Workflow **„Video rendern“** wählen.
3. Rechts **„Run workflow“** → Branch wählen → Eingaben prüfen:
   - `composition`: `FrankfurtHeadlines`
   - `voice`: `repo` (vorhandene Sprecherspur), `chatterbox` (natürliche Stimme neu erzeugen, ≈ 10–20 min),
     `import` (deine Datei aus `voice-input/`), `piper` (schnelle Roboterstimme) oder `none` (stumm)
   - `crf`: `18` (Qualität)
4. **„Run workflow“** klicken. Nach ca. 3–6 Minuten ist der Lauf grün.
5. Den Lauf öffnen → ganz unten unter **Artifacts** auf `FrankfurtHeadlines-run<N>` klicken → ZIP herunterladen.
   Darin: `FrankfurtHeadlines.mp4`, `FrankfurtHeadlines-cover.png` (Titelbild) und der Prüfbericht.

Auf dem iPhone: ZIP in der Dateien-App öffnen → MP4 antippen → Teilen → „Video sichern“ → in TikTok hochladen.
Der Prüfbericht steht zusätzlich in der Zusammenfassung des Workflow-Laufs.

## Was drin ist

| Bereich | Komponenten (`src/components/…`) |
|---|---|
| Städte & Hintergründe | `GradientSky`, `Stars`, `Clouds`, `CitySkyline` (prozedural, jede Stadt), `FrankfurtSkyline` (handgezeichnet, mit Main & Eisernem Steg), `StreetFacades`, `EmergencyLights`, `GrainOverlay` |
| Figuren | `VectorPerson` (Gehzyklus, Jubeln, Schilder mit Symbolen), `Crowd` (Tiefenstaffelung, Marsch) |
| Weltkarte | `WorldMap` (Natural Earth 1:50 Mio., Kamerafahrten, Länder-Highlights, animierte Verbindungsbögen, Pins mit Flaggen-Labels), `PLACES`, `COUNTRY_IDS` |
| Stadtplan | `CityStreetMap` (echte OpenStreetMap-Geometrie, Kamerafahrt, Marker mit Info-Karten, Straßen-Sweeps, Brennpunkte, Abfolge-Linie); Daten per `scripts/maps/build-osm-map.mjs` |
| Abspann | `FollowCta` (Finger tippt auf das Folgen-Plus, Plus → Haken, Kommentar-Aufforderung) |
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
| **Chatterbox** (natürlich, kostenlos, lokal; MIT-Modell + CC0-Stimmvorlage) | `npm run voice:setup-chatterbox` → `npm run voice:chatterbox -- --video frankfurt-2026-10-31 --check` | **Standard**, auch im Workflow (`voice: chatterbox`) |
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
