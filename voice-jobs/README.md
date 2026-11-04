# Sprach-Aufträge (ElevenLabs) ohne „Run workflow“-Knopf

Solange der Workflow „Video produzieren“ noch nicht auf `main` liegt, startet ein Push dieser Datei ihn trotzdem:

`voice-jobs/auftrag.json`
```json
{"video": "FrankfurtNextDemo", "aktion": "video", "stimme": "wiederverwenden", "nr": 1}
```

- `video`: Komposition aus `config/videos.json`
- `aktion`: `hoerprobe` (nur ≈ 10-s-Probe) · `nur-stimme` (Sprecherspur, kein Video) · `video` (Stimme + Video)
- `stimme`: `wiederverwenden` (Standard – vorhandene Sätze aus `voice-cache/` nutzen, keine Credits) oder `neu-erzeugen`
- `nr`: beliebig hochzählen, damit sich die Datei ändert

Nach dem Merge ist dasselbe über **Actions → „Video produzieren (ElevenLabs Adam)“ → Run workflow** wählbar.
