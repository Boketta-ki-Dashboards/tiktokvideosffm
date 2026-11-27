# Sprach-Aufträge (ElevenLabs) ohne „Run workflow“-Knopf

Solange der Workflow „Video produzieren“ noch nicht auf `main` liegt, startet ein Push dieser Datei ihn trotzdem:

`voice-jobs/auftrag.json`
```json
{"video": "FrankfurtWorldwide", "aktion": "video", "stimme": "wiederverwenden", "nr": 1}
```

- `video`: Komposition aus `config/videos.json`
- `aktion`: `hoerprobe` (nur ≈ 10-s-Probe) · `nur-stimme` (Sprecherspur, kein Video) · `video` (Stimme + Video)
- `stimme`: `wiederverwenden` (Standard – vorhandene Sätze aus `voice-cache/` nutzen, keine Credits) oder `neu-erzeugen`
  oder `vorhanden` (fertige Adam-Spur aus dem Repository, **kein einziger ElevenLabs-Aufruf** – Sprach- und SFX-Schritt werden übersprungen;
  gedacht für reine Bild-Überarbeitungen wie `FrankfurtNov20ForecastPremium`)
- `nr`: beliebig hochzählen, damit sich die Datei ändert

Bei `aktion: video` werden außerdem die optionalen ElevenLabs-Soundeffekte aus `config/sfx-elevenlabs.json` einmalig erzeugt
(fehlt dem Key die Berechtigung „Sound Effects“, bleibt es bei den selbst erzeugten Effekten – Hinweis in der Zusammenfassung).

Hat ein Video in `config/videos.json` einen Eintrag `vergleich` (z. B. Premium ↔ Original), rendert der Workflow zusätzlich die Original-Tonspur
(Ton-Identität Sample für Sample), einen strengen FFprobe-Prüfbericht (`…-Technikbericht-run<N>`) und einen Vorher-Nachher-Kontaktbogen
an identischen Frames (`…-Vorher-Nachher-run<N>`). Der Prüfbericht bricht ab, wenn die fertige Datei nicht 1080 × 1920 / 30 fps / H.264 / yuv420p / AAC ist.

Nach dem Merge ist dasselbe über **Actions → „Video produzieren (ElevenLabs Adam)“ → Run workflow** wählbar.
