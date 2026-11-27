# Qualitätskontrolle – FrankfurtErklaert76FragenTeil2

## 1. Analyse Teil 1 (`FrankfurtRed3_76Fragen_Innenausschuss_ADAM_FINAL.mp4`, 57,1 s)

`node scripts/voice/check-pauses.mjs --video frankfurt-erklaert-76-fragen-landtag` (ffmpeg silencedetect, −40 dB) misst 11 Pausen über 400 ms:
1,06 s (≈ 6,3–7,4 s) · 1,81 s (18,1–19,9 s) · 2,24 s (23,8–26,0 s) · 2,35 s (31,4–33,7 s) · 2,08 s (38,7–40,8 s) · 1,60 s (46,5–48,1 s) · 1,41 s (51,4–52,8 s) u. a.
**Ursachen:**
1. **Absichtliche Füllpausen:** `pauseAfterMs` 1.700 ms nach jeder Frage sowie 1.100/900 ms vor dem Schluss – damals gesetzt, um die 47,2-s-Spur
   auf ≈ 57 s zu strecken. Weil Schnitte der Stimme folgen, standen die Szenen in diesen Pausen still.
2. **Versteckte Pausen am Satzende:** Der Schnitt endete am letzten *Zeichen*; ElevenLabs gibt dem Schlusszeichen (! . ?) 0,2–0,8 s
   (gemessen in Teil 2: „Eywa, Frankfurt!“ 0,78 s, „… polizeibekannt.“ 0,67 s).
3. **Pausen im Satz** nach „?“ und „:“ (0,5–0,6 s).

## 2. Korrekturen (dauerhaft für das Kurzformat, opt-in pro Skript – ältere Videos byte-gleich)

- `config/voice-regeln.json → profiles.kurzformat-60`: speed **1.20**, alle übrigen Adam-Werte unverändert; gilt nur mit `"voice": {"profile": "kurzformat-60"}`.
- `config/voice-regeln.json → aussprache`: `{"Ewa": "Eywa"}` – automatisch `{Ewa|Eywa}`; fertige Videos stehen in `ausnahmen`.
- `script.json → voice.trim {"mode": "letters", "maxInnerGapMs": 320}`: Schnitt am letzten Buchstaben, Pausen im Satz ≤ 320 ms (Stille aus der
  Mitte der Lücke entfernt, Zeichenzeiten verschoben → Untertitel bleiben synchron; Sprache nicht beschleunigt).
- `pauseAfterMs`: 0–60 ms zwischen Sätzen, 120 ms zwischen Themen. `maxPauseMs: 400` + `scripts/voice/check-pauses.mjs` (Workflow bricht ab).
- Gegenprobe: Erklärt #01 offline neu zusammengesetzt → MP3 byte-gleich (MD5 OK); Dry-Run Polizei, #01, #02, Nov20: 100 % Cache, speed 1.16.

## 3. Stimme Teil 2

| Lauf | Was | Ergebnis |
|---|---|---|
| #24 Hörprobe | „Ewa, Frankfurt! Neue Zahlen laut Poseck: 181 … 73 … 1.300 … 20. November: mögliche Auflagen und präventiver Gewahrsam.“ (12,8 s) | Whisper medium/small: alle Zahlen und Begriffe korrekt; „Poseck“ zweisilbig (Whisper schreibt „POSEC“, unbekannter Name); „Eywa“: Whisper erkennt das Kunstwort nicht („Eva“/„Neu war“), Spektrogramm zeigt Diphthong-Gleitlaut statt langem „E“ wie in Teil 1 |
| #25 Vollvertonung | 13 Sätze, 1.034 Credits, speed 1.20 | Rohspur 59,7 s mit 12 Pausen > 400 ms (Satzzeichen-Enden) |
| offline (0 Credits) | Buchstaben-Schnitt + Pausenkürzung + kurze `pauseAfterMs` | **56,28 s**, längste Pause **385 ms**, 133 Untertitel-Wörter, kein „Eywa“ in Untertiteln |

## 4. Visuelle Prüfung (Kontaktbogen vor dem Render, 27 Frames + Titelbild)

- Titelbild im Video: Titel kollidierte mit „HESSISCHER LANDTAG · WIESBADEN“ → Beschriftung nur im PNG.
- Zahlenszene begann mit „0“ → 181 rollt sofort von 76 (Anschluss ans Titelbild), OFFIZIELL-Chip ab Szenenstart.
- Kompakte 181-Zeile überlappte den Hinweis „13 bislang nicht dienstfähig“ → versetzt.
- Chip „Die meisten … friedlich“ erschien erst im letzten Frame der Szene → mit der Gleichung; deckender Hintergrund.

## 5. Renderläufe

| Lauf | Ergebnis |
|---|---|
| [#26](https://github.com/Boketta-ki-Dashboards/tiktokvideosffm/actions/runs/43003326012) | Render + verify-video grün (56,68 s, 1080×1920), Sync-Versatz 0 ms, Lautheit −14,6 LUFS – aber **check-sync rot**: „13 Untertitel außerhalb ihrer Sätze“. Ursache: Nach dem Buchstaben-Schnitt trug das letzte Wort jedes Satzes noch die Endzeit des abgeschnittenen Satzzeichens. Korrektur: im Kurzformat-Schnitt werden Untertitel auf ihr Satzende begrenzt (Ton unverändert); neuer Test spiegelt die check-sync-Regel. |

| [#27](https://github.com/Boketta-ki-Dashboards/tiktokvideosffm/actions/runs/43005027681) | komplett grün (56,683 s, 1.700 Frames, −14,6 LUFS, True Peak −1,5 dBTP, keine Stille ≥ 400 ms). Kontaktbogen der MP4: drei Kernaussagen erschienen erst beim letzten Wort und standen nur 1–1,5 s („BISHER NICHT ÖFFENTLICH BELEGT“, „KEIN PAUSCHALES DEMO-VERBOT“, „REICHEN EUCH DIESE ANTWORTEN?“) → jeweils zum Satzanfang vorgezogen, neu gerendert. |

## 6. Finaler Render

Lauf **#28** (Workflow „Video produzieren (ElevenLabs Adam)“, Run-ID 43006380625, Commit 0324f73, `stimme: vorhanden`-Pfad aus dem Cache – 0 neue Credits) – **erfolgreich**.
Artefakte: `FrankfurtRed3_76Fragen_Teil2_ADAM_FINAL-run28` (MP4 + Thumbnail, ID 13849465428), `…-Technikbericht-run28` (ID 13848707252),
`…-Sprecher-Adam-run28` (ID 13848517577).

Nachprüfung am heruntergeladenen Artefakt (11.11.2026):

| Prüfung | Ergebnis |
|---|---|
| Datei | `FrankfurtRed3_76Fragen_Teil2_ADAM_FINAL.mp4`, 14,13 MB, SHA-256 `43b15517f2e4eaf8d3874b18bd04b32729f62ee696ebc250dbede587f9037320` |
| Länge | 56,683 s · 1.700 Frames (Grenze 1.800) ✅ |
| Video | H.264 High, 1080 × 1920, 30/1 fps konstant, yuv420p, Faststart (moov vor mdat) ✅ |
| Audio | AAC LC 48 kHz Stereo ≈ 189 kbit/s ✅ |
| Lautheit | −14,6 LUFS integriert · LRA 1,8 LU · True Peak −1,5 dBTP ✅ |
| Dekodierung | `ffmpeg -f null` ohne Fehler ✅ |
| Stille im MP4 | keine Stelle ≥ 400 ms unter −45 dB ✅ (Sprecherspur: längste Pause 385 ms, `check-pauses` im Workflow grün) |
| Sync | `check-sync` grün (alle Untertitel innerhalb ihres Satzes, Video ≥ Stimme + 0,3 s) |
| Thumbnail | `FrankfurtRed3_76Fragen_Teil2_THUMBNAIL.png` 1080 × 1920, byte-gleich mit dem Cover-Still (MD5 24f48946…) |
| Prüfbericht | `render.mjs --max` und `tech-report.mjs --max-seconds 60`: **BESTANDEN** |

Kontaktbogen des fertigen MP4 (alle 2 s, 29 Bilder): `kontaktbogen-run28.jpg`. Frame 0 = vollständiges Titelbild
(„76 FRAGEN – ERSTE ANTWORTEN“, TEIL 2, Datum, Landtag); ab „Krawallnacht“ verwandelt sich die 76 in die Karten 181/73;
alle Kernaussagen (OFFEN-Plakette, Stempel „BISHER NICHT ÖFFENTLICH BELEGT“, „KEIN PAUSCHALES DEMO-VERBOT“, VERDACHT ≠ VERURTEILUNG,
„friedlich“, Status-Raster + CTA) stehen spätestens mit dem zugehörigen Satz im Bild.

Offene Hörprüfung durch den Kanalbetreiber: „Ewa“ → „Eywa“ (Whisper kann den Diphthong nicht sicher unterscheiden, transkribiert „Eva“;
Spektrogramm zeigt einen Gleitlaut) – bitte in der Hörprobe (Lauf #24, Artefakt `Adam-Hoerprobe-run24`) bzw. im Video anhören.
