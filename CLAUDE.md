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
   - **Rechts-Erklärvideos:** allgemeine Info, im Bild „keine Rechtsberatung“ + Stand-Datum; Normen aus dem amtlichen Text (gesetze-im-internet.de) bzw.
     Landesrecht mit Stand; keine Pauschalaussagen („musst du nie …“), keine Aufforderung zu Widerstand; persönliche Schilderungen (auch von Politikern)
     nur im Konjunktiv als SCHILDERUNG, mit Hinweis, ob die Behörde sie bestätigt hat.
   - **Slang:** nur über die Wortwahl (≈ 2–4 Ausdrücke pro Video), nie über Stimme/Akzent; neue Ausdrücke vorab per Hörprobe
     (`sampleText` im Skript, Workflow `aktion: hoerprobe` nutzt ihn automatisch) + Whisper/Tonhöhe prüfen.
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
- **Aussprache (dauerhaft, alle neuen FrankfurtRed3-Videos):** „Ewa“ wird immer **Ewa** geschrieben/angezeigt und **„Eywa“** gesprochen.
  Zentral in `config/voice-regeln.json → aussprache.regeln` (`{"Ewa": "Eywa"}`), automatisch als `{Ewa|Eywa}` angewandt (`scripts/lib/aussprache.mjs`);
  Untertitel zeigen nie „Eywa“ (Test). Bereits fertige Videos stehen in `aussprache.ausnahmen` (byte-gleiche Spur aus dem Cache).
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
| `FrankfurtErklaert76FragenTeil4` | `src/videos/frankfurt-erklaert-76-fragen-teil4/` | **Format B** #05 „76 Fragen – Teil 4: 4 weitere Antworten“ (12.11.2026): bis zu 30 Einsatzorte gleichzeitig (Polizei 1.11., OSM-Karte mit 11 belegten Schadensorten, Schilde/Linien symbolisch, Erklärung ≠ Bewertung), Schaden 17/5 (offiziell) → 35/6 + sechsstellig nur als BERICHT des Wiesbadener Kurier (Bezahlinhalt, nicht selbst einsehbar), Waffengeschäft (Schreckschusswaffen sichergestellt, 18-Jähriger in U-Haft ≠ Verurteilung), Strafverfolgung 110/53/73 (nicht addieren, verdächtig ≠ verurteilt); „160 Durchsuchungen“, „vollständig/nicht schussfähig“ ohne Beleg → nicht verwendet; erste Folge mit Längen-Ausnahme (Info 59,4 s + Abo-Aufruf, 62,8 s); Tests `tests/erklaert-76-teil4.test.ts`; Export `FrankfurtRed3_76Fragen_Teil4_ADAM_FINAL.mp4` + `…_THUMBNAIL.png` + `…_COVER_VORSCHAU.png` |
| `FrankfurtErklaert76FragenTeil3` | `src/videos/frankfurt-erklaert-76-fragen-teil3/` | **Format B** #04 „76 Fragen – Teil 3: Was ist immer noch offen?“ (12.11.2026): vier Fragen ohne Wiederholung von Teil 2 – Teilnehmerprognose (Polizei ≈ 2.000 vs. 8.000–9.000, Ursache offen), Gewalt schon bis zur Auflösung (6 von insgesamt 181 laut Innenminister, Mehrheit friedlich), zwei Tatverdächtige unter 14 (§ 19 StGB, Jugendamt § 27 SGB VIII, § 828/§ 832 BGB – Eltern nicht automatisch, keine Rechtsberatung), Schäden (Versicherung zuerst, Stadt prüft ohne feste Zusage, Gesamtschaden nicht beziffert); erstes Cover nach `COVER_ZONE` + Prüfbogen `-CoverVorschau`; Tests `tests/erklaert-76-teil3.test.ts`; Export `FrankfurtRed3_76Fragen_Teil3_ADAM_FINAL.mp4` + `…_THUMBNAIL.png` + `…_COVER_VORSCHAU.png` |
| `FrankfurtErklaert76FragenTeil2` | `src/videos/frankfurt-erklaert-76-fragen-teil2/` | **Format B** #03 „76 Fragen – Teil 2: erste Antworten“ (11.11.2026): Angaben des Innenministers im Innenausschuss laut hr/dpa (181 verletzte Polizisten, 13 bislang nicht dienstfähig, 73 Tatverdächtige: ≈ 2/3 unter 21, > 1/2 polizeibekannt, ≈ 1/4 aus Frankfurt; ≈ 1.300 Kräfte über den Abend), offene Fragen (Plünderungen, TikTok), Maßnahmenbündel 20.11. (angekündigt, kein Verbot), Kontroverse als POSITION; Titelbild = erste Szene; Kurzformat-Stimme 1.20, Pausen ≤ 400 ms; Tests `tests/erklaert-76-teil2.test.ts`; Export `FrankfurtRed3_76Fragen_Teil2_ADAM_FINAL.mp4` + `FrankfurtRed3_76Fragen_Teil2_THUMBNAIL.png` |
| `FrankfurtErklaert76Fragen` | `src/videos/frankfurt-erklaert-76-fragen-landtag/` | **Format B** #02 „76 Fragen nach der Krawallnacht“ (Teil 1, 10.11.2026): Innenausschuss 51. Sitzung (20 Uhr geplant, Wiesbaden), Drs. 21/5450 (Grüne, 21 Fragen) + 21/5459 (FDP, 55 Fragen) = 76; vier Themen als FRAGEN (Gefahrenprognose I.1–8, Schutzkonzept V.6, TikTok I.8, Konsequenzen) – keine Antworten/Ergebnisse; 57,1 s; Politik-Bausteine `formats/frankfurt-erklaert/visuals/Politics.tsx` (Landtag, BigCount, QuestionNumber, Dossier, CalendarSheet, FeedPhone) für Teil 2 (`references/…/teil2-notiz.md`); Tests `tests/erklaert-76-fragen.test.ts`; Export `FrankfurtRed3_76Fragen_Innenausschuss_ADAM_FINAL.mp4` + `FrankfurtRed3_76Fragen_THUMBNAIL.png` |
| `FrankfurtErklaertDemoFilmen` | `src/videos/frankfurt-erklaert-01-demo-filmen/` (+ Formatsystem `src/formats/frankfurt-erklaert/`) | **Format B** „Frankfurt erklärt in 60 Sekunden“ #01 „Nur gefilmt – trotzdem Ärger?“: Art. 8 GG, § 125 StGB (eigene Beteiligung), Filmen grundsätzlich erlaubt vs. Veröffentlichen (§§ 22, 23 KUG, § 201 StGB), Kontrolle auch als Zeuge (§ 163b Abs. 2 StPO), Beweismittel/Sicherstellung (§§ 94, 98 StPO) ≠ automatische Galerie-Durchsicht (§ 110 StPO), Auflösung → unverzüglich entfernen (§ 14 Abs. 7 HVersFG); VG Frankfurt 2025 nicht verifizierbar → nicht verwendet; 59,1 s (1.773 Frames); Tests `tests/erklaert-demo-filmen.test.ts` + `tests/erklaert-format.test.ts`; Export `FrankfurtRed3_Erklaert01_DemoFilmen_ADAM_FINAL.mp4` |
| `FrankfurtPoliceRights` | `src/videos/frankfurt-2026-11-polizeikontrollen/` | „Polizei will deine Galerie sehen – musst du das?“: verstärkte Kontrollen auf der Zeil (hessenschau), Schilderung eines Stadtverordneten (nicht bestätigt), Zeugenaufruf ≠ Pflicht, freiwillige Bitte vs. angeordnete Maßnahme (§ 18 HSOG, §§ 94, 98, 110, 163b StPO, BGH 2 StR 232/24), Tipps für Kontrollen; Kategorien OFFIZIELL · BERICHT · SCHILDERUNG · RECHT · TIPP; leichter Frankfurter Slang (≈ 4 Ausdrücke, nur Wortwahl); 2,5D-Zeil (`visuals/ZeilStreet`), Smartphone-UI, Figuren; Tests `tests/polizeirechte.test.ts`; Export `FrankfurtRed3_Polizeikontrollen_Rechte_ADAM_FINAL.mp4` |
| `FrankfurtWorldwide` | `src/videos/frankfurt-2026-10-31-international/` | „Wie Frankfurt weltweit Schlagzeilen machte“ – Neufassung der unveröffentlichten Folge 1 (ohne Folgennummer im Bild): **V2:** kurzer Ablauf + Bilanz, virale Bilder (Batman mit Selbstdarstellung des Accounts @ichbinyounes – nie als Festgenommener/Täter, kein Gesicht; Meme „3 linke Schuhe“ als anonyme Illustration), Weltkarte, Schlagzeilen nach Regionen; Medienliste `data/medien.json` (Tests: `tests/international.test.ts`), Export `FrankfurtRed3_International_ADAM_FINAL_V2.mp4` |
| `FrankfurtNov20Forecast` | `src/videos/frankfurt-2026-11-20-ausblick/` | Ausblick „20. November – wieder Eskalation?“: Halloween-Faktor, Polizei (angekündigt), Läden (möglich), Fazit als Einschätzung, Plot-Twist mit erfundener Firma (als FIKTION markiert), Kommentarfrage; jede Aussage mit Status FAKT/ANGEKÜNDIGT/EINSCHÄTZUNG/OFFEN/FIKTION (Tests: `tests/nov20.test.ts`), Export `FrankfurtRed3_20November_Ausblick_ADAM_FINAL.mp4` |
| `FrankfurtNov20ForecastPremium` | `src/videos/frankfurt-2026-11-20-ausblick/` (`premium/`, `FrankfurtNov20ForecastPremium.tsx`) | PREMIUM-Bildfassung des Ausblicks: neue Szenen in `premium/scenes/`, Designsystem `premium/kit.tsx`, Illustrationen (NightCity, Storefront, Person, PoliceVan, Craftsman). Ton/Timing/Untertitel/Outro unverändert – Original-Komposition läuft unsichtbar als Tonquelle; Sperrdatei `premium/lock.json` (SHA-256 von Skript, Manifest, Adam-MP3, Musik, voice.json), Tests `tests/nov20-premium.test.ts`; Export `FrankfurtRed3_20November_Ausblick_ADAM_PREMIUM_FINAL.mp4` (Workflow mit `stimme: vorhanden`) |
| `FrankfurtHeadlines` | `src/videos/frankfurt-2026-10-31/` | Folge 1 (Sicherung, unveröffentlicht): Demo, Nacht, internationale Schlagzeilen |
| `FrankfurtShops` | `src/videos/frankfurt-2026-10-31-geschaefte/` | Folge 2 (veröffentlicht): Schadenskarte aller recherchierten Geschäfte; Daten in `data/shops.json` (Tests: `tests/shops.test.ts`) |
| `FrankfurtNextDemo` | `src/videos/frankfurt-2026-11-04-naechste-demo/` | Folge 3: „Wann geht es weiter?“ – Termine 14./20./21.11., Polizei, Verbotsdebatte, Recht; Daten in `data/termine.json` (Tests: `tests/termine.test.ts`) |

## Formate (dauerhaft)

- **Format A – Hintergrund/News (bisherige Folgen):** 20–130 s, Thema/Ereignis im Mittelpunkt, freie Szenenzahl, Kategorien-Chips je Video,
  Outro aus Folge 2. Bisherige Folgen werden nicht nachträglich verändert (neue Fassungen nur als eigene Komposition).
- **Format B – „FRANKFURT ERKLÄRT · IN 60 SEKUNDEN“** (Marke FrankfurtRed3, `src/formats/frankfurt-erklaert/`):
  - Eine Frage pro Folge; **max. 60 s = 1.800 Frames bei 30 fps inkl. Intro und Outro**, Ziel 56–59,5 s.
  - Eintrag in `config/videos.json` mit `"format": "frankfurt-erklaert-60", "maxSeconds": 60`.
  - Aufbau: Format-Intro (`IntroSting`, unter „Ewa, Frankfurt!“) → Hook mit Frage-Plakette → 3–4 Kapitel mit Nummer im Bild (`ChapterTitle`;
    Nummerierung NICHT im Ton) → Fazit → `ShortOutro` (≤ 100 Frames).
  - Durchgehend `FormatBadge` (60-s-Ring), Untertitel, leises Musikbett, Whoosh an Schnitten.
  - Bausteine:
    - Rahmen und Kurzkarten: `ErklaertFrame`, `InfoCard`, `LawChip`, `Equation` (≠ / =, `layout="compact"`), `SourceBar`, `Pop`.
    - Bildszenen: `CameraPhone`/`CameraOverlay` (Aufnehmen vs. Veröffentlichen), `DemoStreet` (2,5D-Demo, Hervorhebung, abstrakte Konfliktzone, Auseinandergehen),
      `IsoCity` (erhöhte Stadtansicht, allgemeine Pfeile).
  - Eine Folge liefert nur `content.ts`, `plan.ts`, `scenes/`, eine `ErklaertEpisode` + Cover.
  - Höchstens 1–2 Slang-Ausdrücke. Bei Rechtsthemen „Allgemeine Info, keine Rechtsberatung · Stand“ im Bild; Szenen als „ILLUSTRATION“ kennzeichnen.
  - Gewalt nur abstrakt (Lichtschein, Flugbahnen); keine Taktiken, Fluchtwege oder Absperrungen; nie Widerstand gegen Maßnahmen nahelegen.
  - **Kurzformat-Regeln ab Teil 2 der „76 Fragen“ (11.11.2026, für alle NEUEN Format-B-Folgen):**
    - Stimme: `script.json → "voice": {"profile": "kurzformat-60"}` → Adam mit speed **1.20** (`config/voice-regeln.json → profiles`; `config/voice.json` selbst bleibt unverändert), alle anderen
      Werte unverändert; längere Videos und bereits fertige Folgen bleiben bei 1.16. Bei unnatürlichem Klang hat Verständlichkeit Vorrang (Hörprobe).
    - Timing: `"trim": {"mode": "letters", "maxInnerGapMs": 320}` (Schnitt am letzten Buchstaben statt am Satzzeichen, Pausen im Satz ≤ 320 ms),
      `pauseAfterMs` 0–60 ms zwischen Sätzen, ≈ 120 ms zwischen Themen, **keine Füllpausen** (lieber 55 s ohne Leerlauf als 60 s mit);
      `"maxPauseMs": 400` in Skript und `config/videos.json` → `scripts/voice/check-pauses.mjs` prüft die Spur (auch im Workflow).
    - Szenen: Übergänge ≤ 10 Frames; neue Grafik spätestens mit dem neuen Satz; Schlüsselwort-Cues für jede Einblendung; kein Element erst
      am Szenenende; keine leeren Szenenanfänge (erste Information ab Frame 0–6).
    - Inhalt: hohe Informationsdichte, Zahlen immer mit Urheber, Kategorien OFFIZIELL · BERICHT · POSITION · OFFEN · ANGEKÜNDIGT im Bild.
    - **Titelbild im Video:** die erste Szene IST das Titelbild (vollständiger Titel ab Frame 0, ≈ 1–1,5 s stehend), danach Verwandlung in die
      erste Inhaltsszene ohne Schwarzblende; dieselbe Komponente rendert das PNG (`<Name>-Cover`, Workflow `thumbnailName`);
      `ErklaertEpisode.badgeFrom` blendet das Format-Badge erst danach ein.
    - **Titelbild-Position (dauerhaft ab Teil 3 der „76 Fragen“, 12.11.2026):** Beim Upload von Teil 2 wurden Serientitel und Zahl im
      Profilraster (mittiger 3:4-Ausschnitt) oben angeschnitten, unten blieb Fläche frei. Deshalb gilt `COVER_ZONE`
      (`src/formats/frankfurt-erklaert/theme.ts`): Serientitel, große Zahl, Hauptgrafik, Themenkarte, Untertitelzeile in der Kernzone
      **y 330–1450**, alles Wesentliche im **3:4-Ausschnitt y 240–1680**, Serientitel nicht über ≈ y 390, Themenkarte nicht in der oberen
      Hälfte, Seitenrand ≥ 90 px, rechts ab x ≈ 930 / y ≈ 1000 liegen die App-Knöpfe. Im Video enden die Coverelemente über dem
      Untertitel-Band (≤ y 1300); das PNG darf dieses Band zusätzlich nutzen (z. B. Themenzeile). Oberer Bildteil = dekorativer Himmel.
      Layout-Werte als eigene `.ts`-Konstante (z. B. `cover-layout.ts`) und per Test gegen `COVER_ZONE` prüfen.
    - **Titelbild-Prüfbogen vor jedem Export:** Komposition `<Name>-CoverVorschau` (`CoverPreviewSheet`): 9:16 mit Zonen, 3:4-Ausschnitt,
      nachgebautes Profilraster neben den Vorgänger-Covern, Videoframe mit Untertitel und neutral nachgezeichneten App-Elementen (keine
      Logos). Der Workflow legt ihn als `*_COVER_VORSCHAU.png` ins Artefakt (nicht zur Veröffentlichung). Hauptüberschrift und Teil-Kennung
      müssen in allen vier Ansichten vollständig lesbar sein; sonst Layout verschieben/verkleinern und erneut prüfen.
      Bereits veröffentlichte Cover werden nicht nachträglich geändert.
  - **Längen-Ausnahme (ab Teil 4 der „76 Fragen“, 12.11.2026, nur auf ausdrücklichen Wunsch je Folge):** Informationsteil ≤ 61,5 s (`FORMAT.infoMaxSeconds`), danach ein kurzer Abo-Aufruf als letztes Segment mit der ID `cta` („Folgt {FrankfurtRed3|Frankfurt Rett Drei} für mehr.“ – Adam sprach „FrankfurtRed3“ sonst wie „Frankfurt rät 3“; kein „macht das Plus weg“), Abo-Phase 3–4 s über `tailMs`, gesamt ≤ 66 s (`FORMAT.extendedMaxSeconds`). Eintrag in `config/videos.json`: `maxSeconds` ≤ 66, `infoMaxSeconds`, Begründung `ausnahme`; `ErklaertEpisode.maxSeconds` aus der Config. `tests/erklaert-format.test.ts` prüft Begründung, `cta` und Informationsteil. Ohne Ausnahme gilt weiter 60 s.
  - **60-s-Grenze vierfach geprüft:**
    1. `enforceMaxFrames` (`src/formats/frankfurt-erklaert/timeline.ts`) kürzt automatisch den stummen Nachlauf bzw. bricht ab, wenn schon die Stimme
       zu lang ist (mit Angabe, um wie viel gekürzt werden muss).
    2. `tests/erklaert-format.test.ts` gilt für jede Folge mit `maxSeconds`.
    3. Workflow: `render.mjs --max` (verify).
    4. Workflow: `tech-report.mjs --max-seconds` (FFprobe am fertigen MP4).
  - Korrektur bei Überlänge: Sprechertext kürzen (nur geänderte Sätze werden neu vertont). Reine Pausen-Änderungen offline aus dem Cache:
    `node scripts/voice/elevenlabs-tts.mjs --video <id> --offline` (0 Credits).

## Projektstruktur

```
src/
  components/   wiederverwendbare Bausteine (backgrounds, characters, map, media, infographics,
                camera, transitions, text, subtitles, audio, layout)
  lib/          Animation, Farben, Format, Skript-Timing, Szenenplan
  formats/      Formatsysteme (z. B. frankfurt-erklaert = Format B „in 60 Sekunden“: Rahmen, Branding, Karten, Visuals)
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
