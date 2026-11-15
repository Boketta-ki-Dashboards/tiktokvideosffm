# QA – „Gen Z regelt – Phase 2: friedliche Demos, aber 20 Festnahmen in Berlin“ (Frankfurt erklärt #07)

## 1. Faktenprüfung (Details und Wortlaute: `sources.md`, Abruf 15.11.2026)

| Aussage im Auftrag | Ergebnis |
|---|---|
| Bremen 670, friedlich | bestätigt (Polizeisprecherin laut dpa/t-online: „In der Spitze … 670“, „Alles sei friedlich verlaufen“) → „bis zu 670“ |
| Karlsruhe 220, weitgehend friedlich | bestätigt (SWR: „nach Schätzung der Polizei 220“, Ordnungsamt „insgesamt friedlicher Verlauf“) → „rund 220“ |
| Stuttgart: mehrere Hundert, Aufzug untersagt, stationäre Kundgebung | bestätigt (SWR); zusätzlich: Stadt nennt zu späte Anmeldung, Organisatoren bestreiten das (im Bild); Knüppel-Einsatz + Pyrotechnik laut Polizei nur in der Caption (Zeit) |
| Berlin rund 1.200 (dpa 15.11.), 100 angemeldet, 700 Polizeikräfte | bestätigt (SZ/dpa 11:09 Uhr, rbb24, t-online, Berliner Kurier) |
| Route Savignyplatz → Ku'damm → Halensee | bestätigt (rbb24: Start gegen 17 Uhr Savignyplatz, über den Kurfürstendamm bis S-Bahnhof Halensee); **Verbindung Savignyplatz–Ku'damm nicht belegt** → gestrichelt, „schematisch“ |
| Polizeikette, Pyrotechnik, Auseinandersetzungen bei Festnahmen | bestätigt (Polizei laut dpa). Wortlaut „hätten Teilnehmer versucht“ → im Video „einige Teilnehmende“ (nicht „Einzelne“, nicht „die Demonstrierenden“) |
| Bilanz 15.11.: 20 vorläufige Festnahmen, 28 Strafanzeigen, 3 verletzte Polizisten | bestätigt (Polizeisprecherin am Sonntagmorgen laut dpa; rbb24 12:58 Uhr); Samstag zuerst 22 → nur als „zuerst: 22“; Polizei: Angaben vorläufig |
| „Proteste in 4 Städten“ (Titelbild-Wunsch) | **geändert**: laut WDR/dpa auch Düsseldorf (≈ 100) und Wuppertal (≈ 80) → „4 STÄDTE IM ÜBERBLICK“ + Kartenhinweis |
| 20.11. weitere Jugendproteste | bestätigt (GEW Hessen 12.11.; SZ/dpa: europaweiter Jugendstreik, Berlin 15.000 angemeldet laut Veranstaltern) |

Nachrecherche vor der Vertonung (15.11., ≈ 17:45 Uhr, tagesschau-Suche, rbb24, SZ): keine neueren Polizeiangaben als rbb24 12:58 Uhr.

## 2. Stimme (Adam, Profil kurzformat-60)

- Lauf #41 (Hörprobe, 245 Zeichen, 14,95 s): Whisper „Savignyplatz, Savignyplatz, über den Kuhdamm bis Hallensee … 20 vorläufige Festnahmen,
  28 Strafanzeigen. Folgt Frankfurt, Rett 3 für mehr.“ → beide Schreibweisen als „Savignyplatz“ erkannt; die Lautschrift `{Savignyplatz|Sawinjiplatz}`
  sichert die französische Aussprache.
- Lauf #42 (nur Stimme, 1.073 Zeichen): **60,82 s** – zu lang für das harte 60-s-Limit (Schätzung 54,6 s war zu optimistisch); zwei Pausen
  402/415 ms. Whisper: Begrüßung klang wie „Eva“.
- Lauf #43 (nur geänderte Sätze neu): Bremen/Stuttgart/Berlin gekürzt, `pauseAfterMs` 120 → 60 an den zwei Stellen, Begrüßung aus dem geprüften
  Cache des 14.11.-Videos (identischer Schlüssel, Whisper „Ey, war Frankfurt!“). Ergebnis **58,08 s**, längste Pause 386 ms ✅.
- Whisper (medium): „Bremen. Laut Polizei bis zu 670 Leute. Friedlich. Karlsruhe. Rund 220. Weitgehend friedlich. Stuttgart. Mehrere hundert.
  Der Demozug wurde untersagt. Und Berlin? Krass! Angemeldet waren hundert. Gekommen sind laut Polizei rund zwölfhundert.“ · übrige Sätze
  wortgetreu (Lauf #42) · Ende einzeln: „Wie bewertet ihr Berlin? Folgt Frankfurt Red 3 für mehr.“ ✅
- ElevenLabs-Verbrauch dieser Folge: Hörprobe 245 + Vollvertonung 1.073 + Nachvertonung ≈ 200 Zeichen (Bremen, Stuttgart, Berlin) ≈ 1.520 Zeichen;
  keine Soundeffekte erzeugt.

## 3. Länge

- Sprache 0,12–58,08 s, `tailMs` 900 → **58,97 s = 1.769 Frames** (Limit 60,0 s / 1.800 Frames inkl. Abo-Aufruf) ✅ · Abo-Aufruf 56,51–58,08 s,
  Abo-Phase bis Ende 2,5 s.
- Szenen: Titelbild 4,8 s · Städte 11,9 s · Berlin 11,7 s · Zwischenfälle 7,9 s · Bilanz 16,0 s · 20.11. 4,5 s · Frage/Abo 4,1 s.

## 4. Visuelle Prüfung (lokal, echte Adam-Zeiten, alle 45 Frames)

Korrigiert: Deutschland- und Berlin-Beschriftungen wurden von Chrome am Rand der 3D-Ebene abgeschnitten („ARLSRUHE“) → Ortsmarken werden jetzt
exakt projiziert und als 2D-Ebene darübergelegt (`projectPlanePoint`) · START-Marke lag rechts außerhalb des Bildes → Berlin-Karte diagonal
gedreht (−24° … −42°), weicher Kartenrand per Maske · „1.200“ lief aus der Vergleichskarte, „LAUT POLIZEI“ brach um → Breiten angepasst, ab
„700“ kompakte Zeile · Zwischenfall-Szene: Menge verdeckte die Polizeikette → erhöhte Blickposition, Beschriftungen über der Kette ·
Zähler zeigten kurz „BIS ZU 0“ → zählen jetzt vom Erscheinen bis zum gesprochenen Wert · leere Szenenanfänge (Berlin, Bilanz) → Inhalte ab
Frame 0–6 · Stuttgart-Einordnung erschien erst kurz vor dem Schnitt → ab „Demozug“ · Lücke nach dem Titelbild → Kopfzeile „PHASE 2 ·
14. NOVEMBER · BUNDESWEIT“ verbindet Titelbild und Karte.

## 5. Titelbild

- `PHASE2_COVER_LAYOUT`: Serientitel ab y 430, Deutschlandkarte 500–860, rote Karte 880 (46 px, rechte Kante ≈ 890), „20“ + Zeilen 960–1130
  (rechte Kante ≈ 895 < App-Knöpfe 930), Städtezeile 1140, Logo + Account 1236–1290, im PNG Datum + „4 STÄDTE IM ÜBERBLICK“ 1340–1440 –
  kompakt um die Bildmitte, oberer Bildteil = Sternenhimmel.
- Prüfbogen `FrankfurtErklaertGenZPhase2-CoverVorschau` (lokal): 9:16, 3:4, Profilraster (neben 14.11. und Teil 4, Profilbild = offizielles
  Logo) und Videoframe mit App-Elementen – „GEN Z REGELT – PHASE 2“, „20 VORLÄUFIGE FESTNAHMEN IN BERLIN“ vollständig lesbar.

## 6. Finaler Render

Lauf **#44** (Run-ID 43740446411, Commit 526333b, `stimme: vorhanden` – kein ElevenLabs-Aufruf) – **erfolgreich**.
Artefakte: `FrankfurtRed3_GenZPhase2_15November_ADAM_FINAL-run44` (MP4, Thumbnail, Titelbild-Prüfbogen, ID 14172198924),
`…-Technikbericht-run44` (ID 14172363407), `…-Sprecher-Adam-run44` (ID 14172457823). CI-Lauf #59 (Standbilder inkl. Cover/Prüfbogen) grün.

Nachprüfung am heruntergeladenen Artefakt (15.11.2026):

| Prüfung | Ergebnis |
|---|---|
| Datei | `FrankfurtRed3_GenZPhase2_15November_ADAM_FINAL.mp4`, **19,93 MB** (< 30 MB, ohne Auflösungs- oder Bitratenreduktion), SHA-256 `dea9a12b215f2f96c4c00928a783b5bcd304066d11c26c46f8be9e528ec5d44e` |
| Länge | **58,987 s · 1.769 Frames** (hartes Limit 60,0 s / 1.800 Frames inkl. Abo-Aufruf) ✅ |
| Video | H.264 High, 1080 × 1920 (echte Pixel), 30/1 fps konstant, yuv420p, BT.709, ≈ 2,6 Mbit/s, Faststart (ftyp → moov → free → mdat) ✅ |
| Audio | AAC LC 48 kHz Stereo ≈ 189 kbit/s ✅ |
| Lautheit | −14,6 LUFS integriert · LRA 2,6 LU · True Peak −1,5 dBTP ✅ |
| Dekodierung | `ffmpeg -f null` ohne Fehler ✅ |
| Stille im MP4 | keine Stelle ≥ 400 ms unter −45 dB ✅ |
| Sync | `check-sync`/`check-pauses` im Workflow grün; Untertitel aus den ElevenLabs-Zeitstempeln, jeder innerhalb seines Satzes (Test) |
| Thumbnail | `FrankfurtRed3_GenZPhase2_THUMBNAIL.png` 1080 × 1920, byte-gleich mit dem Cover-Still |
| Titelbild-Prüfbogen | `FrankfurtRed3_GenZPhase2_COVER_VORSCHAU.png` 2420 × 1240 (verkleinert: `cover-vorschau-run44.jpg`) – alle vier Ansichten lesbar, Profilbild = offizielles Logo |
| Prüfbericht | `render.mjs --max`, `tech-report.mjs --max-seconds 60`: **BESTANDEN** |
| Tests | `npm run check`: 136 Tests grün (davon 11 neu in `tests/erklaert-genz-phase2.test.ts`) |

Kontaktbogen des fertigen MP4 (alle 2 s, 29 Bilder): `kontaktbogen-run44.jpg`.

**Zeitbezug:** Das Video gibt den Stand 15.11.2026, 13 Uhr wieder (Polizei: Angaben vorläufig). Ändert die Polizei Berlin die Bilanz vor der
Veröffentlichung, nur Segment `stats` (und ggf. `STATS` in `content.ts`) anpassen – nur dieser Satz wird neu vertont.
