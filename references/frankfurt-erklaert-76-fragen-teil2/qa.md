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

## 5. Finaler Render

Wird nach dem GitHub-Lauf ergänzt.
