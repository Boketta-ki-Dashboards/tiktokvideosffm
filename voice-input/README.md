# voice-input/ – fertige Sprecherdateien hochladen

So nutzt du eine eigene, fertige Sprecherdatei (MP3, WAV, M4A, AAC, OGG oder FLAC) – komplett über GitHub:

1. Datei so benennen wie den Video-Ordner, z. B. `frankfurt-2026-10-31.mp3`.
2. Auf GitHub in diesen Ordner wechseln → **Add file → Upload files** → Datei hochladen → **Commit changes**.
3. **Actions → „Video rendern“ → Run workflow** mit `voice: import` und passender `video_id`.

Der Workflow normalisiert die Lautstärke (−14 LUFS), schneidet Stille ab, erkennt die Satzgrenzen über
Sprechpausen und passt Szenen und Untertitel automatisch an. Der Text sollte dem Sprecherskript
`src/videos/<video_id>/script.json` entsprechen (gleiche Sätze, gleiche Reihenfolge).

Hinweise:
- Nur Dateien hochladen, die du nutzen darfst (Lizenz der Stimme/TTS-App prüfen und in `references/` notieren).
- Dateien klein halten (MP3 mit 128–192 kbit/s reicht; 20 s ≈ 0,5 MB).
