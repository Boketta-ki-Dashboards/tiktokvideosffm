# Qualitätskontrolle – FrankfurtErklaert76Fragen („76 Fragen“, Teil 1)

## Prüfliste (Auftrag, Punkt 14)

| # | Prüfung | Ergebnis |
|---|---|---|
| 1 | Drucksachennummern | 21/5450 (Grüne) und 21/5459 (FDP) – identisch auf Tagesordnung und PDFs |
| 2 | 21 und 55 Fragen | selbst gezählt: 21/5450 Nr. 1–21; 21/5459 I 1–8, II 1–18, III 1–9, IV 1–9, V 1–7, VI 1–4 = 55 → 76 (Test) |
| 3 | Sitzung heute | Tagesordnung: „Dienstag, 10.11.2026, 20 Uhr“, „Sitzungsraum 501 A - im Anschluss an die Plenarsitzung“ (Abruf 16:11 Uhr). Produktion ab 16:10 Uhr, Slot 17:30–18:15 → Sitzung liegt in der Zukunft, „heute Abend“/„angesetzt“ korrekt |
| 4 | Fragen ≠ Antworten | Ton: „Das sind bisher Fragen, noch keine Antworten.“ Bild: „BISHER FRAGEN ≠ NOCH KEINE ANTWORTEN“, „20:00 UHR – GEPLANT“ |
| 5 | Keine vorweggenommenen Ergebnisse | Test prüft verbotene Formulierungen (versagt, organisiert, verboten, beschlossen …); TikTok-Panel „Gefragt – nicht belegt“ |
| 6 | Sprechertext ≤ 60 s | Adam-Spur 56,72 s, Video 1.713 Frames = 57,1 s |
| 7 | Adam-Stimme | `config/voice.json` unverändert (pNInz6obpgDQGcFmaJgB, eleven_multilingual_v2, speed 1.16, stability 0.45, similarity 0.8, style 0.2, speaker boost) – Lauf #21, Manifest prüft Voice-ID |
| 8 | Untertitel synchron | aus ElevenLabs-Zeitstempeln (109 Wörter); check-sync im Workflow |
| 9–12 | Animationen, Unterscheidbarkeit, Thumbnail, Safe Areas | Kontaktbogen vor dem Render (21 Frames) → Korrekturen s. u.; jede Frage eigene Farbe + eigene Illustration |
| 13–14 | 1080 × 1920, dekodierbar | FFprobe-Prüfbericht + verify-video im Workflow (siehe „Finaler Render“) |
| 15 | Projekttests | `npm run check` |

## Stimme

- Lauf #21 (`nur-stimme`): 11 Sätze, 797 gesprochene Zeichen → 47,2 s. Keine Hörprobe vorab (Zeitdruck); „Ewa, Frankfurt!“ ist seit Hörprobe #13 geprüft,
  übrige Wörter sind Standarddeutsch. Danach Pausen nach den Fragen (Zeit für die Animationen) offline aus dem Cache → 56,72 s, 0 Credits.
- Markenname nicht gesprochen („folgt uns!“, Handle im Bild), um eine ungeprüfte Aussprache von „FrankfurtRed3“ zu vermeiden.

## Visuelle Prüfung vor dem Render (Kontaktbogen, 21 Frames + Titelbild)

- Kleine Fragennummer (01–04) klebte am Titel → kleiner, Titel weiter rechts.
- „FOLGT FÜR TEIL 2“ brach in zwei Zeilen um → einzeilig (74 px).
- Titelbild: Landtag war von der Skyline verdeckt → Landtag als hintere Ebene sichtbar hinter der 76, Skyline vorne unten.
- Zweiter Durchgang (Einzelbilder in voller Größe): Sitzungskarte zeigte Raum/Ort erst nach „20 Uhr“ → von Beginn an vollständig; Plaketten in
  Frage 02 und 04 verdeckten die Quellenzeile → höher gesetzt; Quellenzeile der Sitzungsszene einzeilig.

## Finaler Render (GitHub Actions, Lauf #23, `stimme: vorhanden` – kein ElevenLabs-Aufruf)

| Prüfung | Ergebnis |
|---|---|
| FFprobe (strenger Prüfbericht) | 1080 × 1920 · 30/1 fps · **1.713 Frames = 57,109 s ≤ 60 s** · H.264 High · yuv420p · AAC LC 48 kHz Stereo ≈ 189 kbit/s · Faststart · 16,8 MB → **BESTANDEN** |
| Dekodierung | `ffmpeg -i … -f null -` ohne Fehler |
| Lautheit | −14,7 LUFS integriert · LRA 5,5 LU · True Peak **−1,1 dBTP** (Norm −1,5 dBTP – knapp darüber, wird vom Bericht nicht erzwungen; für TikTok unkritisch) |
| verify-video + check-sync | bestanden (Versatz 0 ms, Stimme vollständig, Untertitel innerhalb ihrer Sätze) |
| Titelbild | `FrankfurtRed3_76Fragen_THUMBNAIL.png`, 1080 × 1920, im Video-Artefakt |
| Whisper-Gegenprobe (medium, lokal, Adam-Spur) | alle 11 Sätze wortgetreu: „Eva, Frankfurt“ (= Ä-wa), „FDP“, „TikTok“, „76“, „Innenausschuss in Wiesbaden“, „20 Uhr“ |
| Kontaktbogen der MP4 (alle 2 s) | `kontaktbogen-run23.jpg`: alle 9 Szenen, Fragen 01–04 farblich und grafisch unterscheidbar, keine abgeschnittenen Texte |
| `npm run check` | TypeScript, ESLint, 83 Tests grün |

Lauf #22 (vor dem Feinschliff) war ebenfalls grün; Lauf #23 ist die finale Fassung.
