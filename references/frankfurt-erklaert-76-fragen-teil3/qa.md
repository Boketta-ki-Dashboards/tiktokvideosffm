# QA – „Frankfurt erklärt in 60 Sekunden“ #04: 76 Fragen – Teil 3

## 1. Abgleich mit Teil 1 und Teil 2 (keine Wiederholung)

| Thema | Teil 1 | Teil 2 | Teil 3 |
|---|---|---|---|
| Die 76 Fragen (Grüne 21 + FDP 55) | ausführlich | Einstieg | nur Einstieg („Nach den 76 Fragen …“) |
| Polizeibilanz 181 / 13 / 1.300 | – | ausführlich | nur **181 als Kontext** zu Frage 2 |
| Tatverdächtige (73, Alter, polizeibekannt, Wohnort) | – | ausführlich | nur „2 unter 14“ (neu) + „von 73“ klein im Bild |
| TikTok, 20. November, Herkunftsdebatte | Frage | ausführlich | **nicht** wiederholt (Test) |
| Teilnehmerprognose 2.000 vs. 8.000–9.000 | – | 8.000–9.000 nur im Kleingedruckten | **neu, Frage 1** |
| Gewalt vor/nach der Auflösung | – | „6 bis zur Auflösung“ nur Kleingedrucktes | **neu, Frage 2** |
| Strafunmündigkeit, Jugendamt, Haftung | – | – | **neu, Frage 3** |
| Schäden, Versicherung, Hilfe der Stadt | als Frage (VI.2, VI.4) | – | **neu, Frage 4** |

## 2. Sprechertext und Timing

- Ausgangsentwurf ≈ 1.240 gesprochene Zeichen ≈ 67 s bei Adam 1.20 (Kalibrierung an Teil 2: 1.033 Zeichen = 56,3 s) → gekürzt auf 1.054 Zeichen
  (Schätzung ≈ 57 s), alle vier Schwerpunkte und rechtlichen Einschränkungen erhalten.
- Pausen: 40 ms zwischen Sätzen, 120 ms zwischen den Fragen; Schnitt am letzten Buchstaben, Pausen im Satz ≤ 320 ms; `maxPauseMs` 400.

## 3. Titelbild

- Neue Positionsregel `COVER_ZONE` (Formatsystem): Serientitel ab y 420 (Teil 2: 210), große 76 y ≈ 520–844 (Teil 2: 330–690), Landtag ab 756,
  Themenkarte „4 FRAGEN BLEIBEN“ y 1060–1160, Untertitelzeile 1184, Datum/Account 1244–1296 – alles im Video über dem Untertitel-Band; im PNG
  zusätzlich die Themenzeile 01–04 bei y 1344–1420. Schwerpunkt der Coverelemente ≈ y 920 (Bildmitte 960).
- Prüfbogen `FrankfurtErklaert76FragenTeil3-CoverVorschau` (lokal gerendert): 9:16 mit Zonen, 3:4-Ausschnitt, Profilraster, Videoframe 15 mit App-Elementen.
  Ergebnis: Serientitel, „76“, „TEIL 3“ und „4 FRAGEN BLEIBEN“ in allen Ansichten vollständig; im Profilraster sieht man zum Vergleich, dass bei
  Teil 2 und Teil 1 der Serientitel oben angeschnitten wird. Rote Karte auf 68 px verkleinert, damit sie die rechte Knopfleiste nicht berührt.

## 4. Visuelle Prüfung (lokal, geschätzte Timings, vor der Vertonung)

Korrigiert: Zahl „8.000–9.000“ umbrach in zwei Zeilen · Faktor-Plakette „≈ 4×“ überdeckte die Quellenzeile der Prognose · Stempel
„STRAFUNMÜNDIG“ überdeckte „TATVERDÄCHTIGE“ · Karte „KEINE STRAFE“ zu viel Text · Cover-Inhalt zunächst nur bis y 1272 (unten zu leer).

## 5. Läufe

- Lauf #29 (Hörprobe): zweimal > 8 min im apt-Schritt „FFmpeg installieren“ hängen geblieben, abgebrochen – noch vor jedem ElevenLabs-Aufruf
  (0 Credits). Workflow: apt jetzt mit Zeitlimit (4 min je Versuch, 3 Versuche) statt unbegrenzt.
- Lauf #30: wieder > 7 min im apt-Schritt (Standardquellen) → abgebrochen, 0 Credits.
- Lauf #31: apt-Versuche alle gescheitert („Temporary failure resolving 'archive.ubuntu.com'“ – Ubuntu-Paketquellen vom Runner aus
  nicht erreichbar). Fehler im Workflow: `ffmpeg -version | head -1` ließ den Schritt trotz fehlendem FFmpeg grün enden → die Hörprobe wurde
  erzeugt (188 Zeichen) und ging beim nächsten Schritt (ffprobe fehlt) verloren. Behoben: Schritt bricht ohne ffmpeg/ffprobe VOR jedem
  ElevenLabs-Aufruf ab (`pipefail` + `command -v`), und ein neuer Schritt sichert bei jedem späteren Fehler die bereits erzeugten Sätze im Cache.
- Lauf #32 (Hörprobe, [Artefakt `Adam-Hoerprobe-run32`]): grün, FFmpeg wieder normal installierbar. 188 Zeichen = 10,25 s (ungekürzt, ≈ 18,3 Zeichen/s).
  Whisper (medium): „Ava, Frankfurt. Gekommen sind 8 bis 9.000, insgesamt 181. Sie sind strafunmündig, aber Schadenersatz kann möglich sein.
  Zuerst sind die Versicherungen gefragt.“ → Zahlen und Fachbegriffe verständlich; „Ewa“ wird als Gleitlaut gesprochen (Whisper kennt
  „Eywa“ nicht und schreibt „Ava“, wie bei Teil 2 „Eva“) – bitte selbst anhören. Tempo 1.20 bleibt (Verständlichkeit gegeben).
- Lauf #33 (Vollvertonung + Video): 17 Sätze erzeugt und committet (58,06 s). Pausenprüfung lokal: „offen. | Erstens:“ 421 ms > 400 ms →
  Lauf vor der QA abgebrochen (das Video wäre am Pausen-Check gescheitert). Korrektur offline aus dem Cache (0 Credits): `pauseAfterMs` nach dem
  Hook 120 → 60 ms → 58,00 s, längste Pause 391 ms. Whisper (medium) über die ganze Spur: alle Sätze wortgetreu, Begrüßung als „Ey war
  Frankfurt!“ (= Eywa-Gleitlaut).
- Visuelle Prüfung mit echten Adam-Zeiten (alle 40 Frames): Karte in Frage 1 wirkte vor „2.000“ ≈ 1,3 s leer → Platzhalter-Punkte ab Frame 0,
  Zahl rollt ab „erwartete“.

## 6. Finaler Render

Lauf **#34** (Run-ID 43087591069, Commit 01f7aa0, `stimme: vorhanden` – kein ElevenLabs-Aufruf) – **erfolgreich**.
Artefakte: `FrankfurtRed3_76Fragen_Teil3_ADAM_FINAL-run34` (MP4, Thumbnail, Titelbild-Prüfbogen, ID 13886404308),
`…-Technikbericht-run34` (ID 13886419380), `…-Sprecher-Adam-run34` (ID 13886923479).

Nachprüfung am heruntergeladenen Artefakt (11.11.2026):

| Prüfung | Ergebnis |
|---|---|
| Datei | `FrankfurtRed3_76Fragen_Teil3_ADAM_FINAL.mp4`, 14,02 MB, SHA-256 `1f96b1afd6248359af0f645a76d499dce3786d247b34965e77c4cfae13f0fc1c` |
| Länge | 58,368 s · 1.751 Frames (Grenze 1.800) ✅ |
| Video | H.264 High, 1080 × 1920 (echte Pixel), 30/1 fps konstant, yuv420p, Faststart ✅ |
| Audio | AAC LC 48 kHz Stereo ≈ 189 kbit/s ✅ |
| Lautheit | −14,6 LUFS integriert · LRA 2,1 LU · True Peak −1,6 dBTP ✅ |
| Dekodierung | `ffmpeg -f null` ohne Fehler ✅ |
| Stille im MP4 | keine Stelle ≥ 400 ms unter −45 dB ✅ (Sprecherspur: längste Pause 391 ms, `check-pauses` grün) |
| Sync | `check-sync` grün (Untertitel innerhalb ihrer Sätze, Video ≥ Stimme + 0,3 s) |
| Thumbnail | `FrankfurtRed3_76Fragen_Teil3_THUMBNAIL.png` 1080 × 1920, identisch mit dem Cover-Still |
| Titelbild-Prüfbogen | `FrankfurtRed3_76Fragen_Teil3_COVER_VORSCHAU.png` 2420 × 1240 (verkleinert: `cover-vorschau-run34.jpg`): Serientitel, 76, TEIL 3, „4 FRAGEN BLEIBEN“ in 9:16, 3:4, Profilraster und Videoframe vollständig; Teil 1/2 im Raster oben angeschnitten |
| Prüfbericht | `render.mjs --max`, `tech-report.mjs --max-seconds 60`: **BESTANDEN** |

Kontaktbogen des fertigen MP4 (alle 2 s, 30 Bilder): `kontaktbogen-run34.jpg` – Frame 0 = vollständiges Titelbild, ab „Nach den 76“
zerfällt die 76 in die vier Fragen-Kacheln; jede Einblendung (2.000, 8.000–9.000, ≈ 4×, Planungsakte, 6/181, friedlich, 14/strafunmündig,
Jugendamt/Schadenersatz/Eltern, Versicherung/Prüfung/keine feste Zusage, Gesamtschaden offen, Fazit) steht spätestens mit ihrem Satz im Bild.
