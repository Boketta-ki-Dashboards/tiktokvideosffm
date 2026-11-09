# Qualitätskontrolle – FrankfurtErklaertDemoFilmen („Frankfurt erklärt in 60 Sekunden“ #01)

## Stimme (Adam, unverändert) und 60-Sekunden-Grenze

| Lauf | Was | Ergebnis |
|---|---|---|
| #16 (`nur-stimme`) | 11 Sätze, 965 Zeichen | **62,8 s – über der Formatgrenze.** Ursache: gesprochene Nummerierung („Erstens/Zweitens/Drittens“, „Wichtig:“) + Pausen. |
| #17 (`nur-stimme`) | Nummerierung nur noch im Bild (Kapitelnummern), Pausen gekürzt → 4 Sätze neu (≈ 304 Credits), 7 aus dem Cache | 56,7 s |
| lokal, `--offline` (0 Credits) | Atempausen an den Szenenschnitten (nur Stille aus dem Cache neu zusammengesetzt), Nachlauf 250 ms | **58,70 s Sprechzeit → 1.768 Frames = 58,93 s** inkl. Intro/Outro (Grenze 1.800) |

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

## Finaler Render

Wird nach dem GitHub-Lauf ergänzt (FFprobe, Lautheit, Whisper-Gegenprobe, Kontaktbogen aus der MP4).
