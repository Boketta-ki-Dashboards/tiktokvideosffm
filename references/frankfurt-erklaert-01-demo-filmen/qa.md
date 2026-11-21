# Qualitätskontrolle – FrankfurtErklaertDemoFilmen („Frankfurt erklärt in 60 Sekunden“ #01)

## Stimme (Adam, unverändert) und 60-Sekunden-Grenze

| Lauf | Was | Ergebnis |
|---|---|---|
| #16 (`nur-stimme`) | 11 Sätze, 965 Zeichen | **62,8 s – über der Formatgrenze.** Ursache: gesprochene Nummerierung („Erstens/Zweitens/Drittens“, „Wichtig:“) + Pausen. |
| #17 (`nur-stimme`) | Nummerierung nur noch im Bild (Kapitelnummern), Pausen gekürzt → 4 Sätze neu (≈ 304 Credits), 7 aus dem Cache | 56,7 s |
| lokal, `--offline` (0 Credits) | Atempausen an den Szenenschnitten (nur Stille aus dem Cache neu zusammengesetzt) | **58,70 s Sprechzeit** |
| #18 (`video`, `stimme: vorhanden`) | Render mit Nachlauf 250 ms → 58,94 s | Render + verify-video grün, aber **check-sync rot**: „Stimme vollständig im Video“ verlangt Video ≥ Sprecher-MP3 (58,73 s) + 0,3 s – nur 0,21 s. |
| Korrektur | Nachlauf 400 ms (Test `erklaert-format` prüft künftig ≥ 350 ms), Outro-Grenze 100 Frames | **1.773 Frames = 59,10 s** inkl. Intro/Outro (Grenze 1.800) |

- Adam `pNInz6obpgDQGcFmaJgB`, speed 1.16, stability 0.45, similarity 0.8, style 0.2, seed 20261104 – unverändert (Test).
- Slang: nur „Ewa, Frankfurt!“ (+ umgangssprachlich „Stress“) – Aussprache bereits in Hörprobe #13 geprüft (fallende Grußmelodie mit Ausrufezeichen),
  daher keine neue Hörprobe nötig.
- Untertitel: 124 Wörter aus den ElevenLabs-Zeichen-Zeitstempeln (`captionsSource: elevenlabs-alignment`).

## 60-s-Grenze in der Pipeline

1. `enforceMaxFrames` (`src/formats/frankfurt-erklaert/timeline.ts`): kürzt den stummen Nachlauf automatisch auf 1.800 Frames; endet schon die Stimme zu
   spät → Abbruch mit Angabe, um wie viele Sekunden der Sprechertext gekürzt werden muss (Test simuliert beide Fälle).
2. `tests/erklaert-format.test.ts`: gilt für jede Folge mit `maxSeconds` in `config/videos.json` (läuft im Workflow vor dem Rendern, `npm run check`).
3. Workflow `video-produzieren.yml`: `render.mjs --max 60` (verify-video) und `tech-report.mjs --max-seconds 60` (FFprobe am fertigen MP4, bricht ab).

## Visuelle Prüfung (Kontaktbogen vor dem finalen Render, 31 Frames über alle Szenen)

Gefundene Schwächen → Korrekturen:
- Frame 0 (TikTok-Vorschau): roter Balken „IN 60 SEKUNDEN“ war noch nicht fertig aufgebaut → Intro ab Frame 0 vollständig.
- Hook: Konfliktzone im Hintergrund kaum sichtbar → stärkerer Lichtschein, mehr/größere abstrakte Flugbahnen (weiterhin keine realistische Gewalt).
- Szene 2: Tags „DU: FRIEDLICH“ und „EINZELNE RANDALIEREN“ überlappten, „DU“ lag unter der Kernaussage → Konfliktzone seitlich versetzt, hervorgehobene
  Person weiter hinten links, Tag der Konfliktzone tiefer; Rollen-Chips/Banner höher gesetzt.
- Szene 3: Beim Start im Kamerabild war die REC-Anzeige am oberen Rand angeschnitten → tieferer Start-Zoom + Vollbild-REC-Rahmen.
- Szene 4: „AUCH ALS ZEUGE“ lag unter der Karte → zwischen die Figuren gesetzt.
- Szene 5: Menge auf dem Platz von vorderen Häusern verdeckt, Pfeile zu klein → vordere Blöcke flach, größere Figuren und Pfeile.
- Schriftgrößen an die Mindestwerte angepasst (Kapiteltitel 58 px, Badge/Quellen ≥ 22 px).

## Prüfung der fertigen MP4 aus Lauf #19 (alle Checks grün)

Kontaktbogen aus der MP4 (alle 2 s, 30 Bilder) und Einzelbilder in voller Größe → zwei Schönheitsfehler, danach neu gerendert:
- 13,5–15 s: der Chip „§ 125 StGB Landfriedensbruch“ war halbtransparent, der Tag „DU: FRIEDLICH“ schien durch → deckender Hintergrund.
- 25–31 s: „VERÖFFENTLICHEN“ stieß rechts an den Kartenrand → Kartenspalte breiter, Kartentitel 29 px.

## Finaler Render (GitHub Actions, Lauf #20, `stimme: vorhanden` – kein ElevenLabs-Aufruf)

| Prüfung | Ergebnis |
|---|---|
| FFprobe (am fertigen File, strenger Prüfbericht) | 1080 × 1920 · 30/1 fps · **1.773 Frames = 59,115 s ≤ 60 s** · H.264 High · yuv420p · BT.709 · AAC LC 48 kHz Stereo ≈ 189 kbit/s · Faststart · 18,8 MB → **BESTANDEN** (inkl. neuer Prüfung „Länge ≤ 60 s“) |
| Lautheit | −14,6 LUFS integriert · LRA 2,8 LU · True Peak −1,6 dBTP |
| `verify-video.mjs --max 60` + `check-sync.mjs` | bestanden (Versatz Stimme ↔ Video 0 ms, Stimme vollständig, 124 Untertitel-Wörter innerhalb ihrer Sätze) |
| Tonspur Lauf #19 ↔ #20 | identisch (MD5 der AAC-Pakete gleich) – nur das Bild wurde korrigiert |
| Whisper-Gegenprobe (medium, lokal, auf der fertigen MP4) | alle 11 Sätze vollständig erkannt; „Ewa, Frankfurt!“ als „Eva! Frankfurt!“ (= „Ä-wa“, fallende Grußmelodie). **Hinweis:** „Demo filmen ist“ hören medium und small als „Demo-Film ist“ – Adam verschleift die Endung („film'n“); das Wort hat laut ElevenLabs-Zeitstempeln die volle Länge (0,42 s), der Untertitel zeigt „filmen“. Nicht neu vertont (keine unnötigen Credits) – beim Anhören prüfen; Alternative bei Bedarf: „Auf einer öffentlichen Demo darfst du grundsätzlich filmen …“ (≈ 110 Credits, nur dieser Satz). |
| Kontaktbogen aus der MP4 (alle 2 s, 30 Bilder) | `kontaktbogen-run20.jpg`: alle 6 Szenen + Outro, Format-Badge mit 60-s-Ring durchgehend, Untertitel synchron, keine abgeschnittenen Texte, Texte in den Sicherheitszonen, „ILLUSTRATION“ und „keine Rechtsberatung · Stand“ sichtbar |
| `npm run check` | TypeScript, ESLint, 75 Tests grün (davon 11 für Format/Folge) |
