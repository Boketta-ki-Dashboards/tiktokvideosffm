# Sprecherstimme – Recherche & Entscheidung (Stand 03.11.2026)

Ziel: natürliche, männliche deutsche KI-Stimme im TikTok-Stil, **kostenlos**, **rechtlich nutzbar**,
**automatisierbar** (GitHub Actions) – ohne kostenpflichtige API und ohne API-Keys.

## Ergebnis

| Option | Kosten | Rechtlich | Automatisierbar | Qualität (DE, männlich) | Status im Projekt |
|---|---|---|---|---|---|
| **Piper** + Stimme `de_DE-thorsten-high` | kostenlos | Datensatz „Thorsten-Voice“ **CC0**; Engine `piper-tts` GPL-3.0 (nur als Werkzeug genutzt, Audio-Ausgabe unberührt) | ✅ lokal/offline, läuft in GitHub Actions | gut, klar, etwas „vorleserisch“ | **Standard** (`npm run voice:piper`) |
| Piper `de_DE-thorsten_emotional-medium` | kostenlos | CC0 (Thorsten-Voice) | ✅ | lebendiger, 8 Emotionen (Sprecher-IDs), etwas geringere Klangqualität | Alternative, nur `piperModel` + Sprecher-ID ändern |
| **Eigene fertige MP3/WAV** (z. B. aus der TikTok-App, eigener Aufnahme oder einem Dienst, dessen Lizenz kommerzielle Nutzung erlaubt) | – | abhängig von der Quelle – Lizenz in `references/` dokumentieren | ✅ Import-Skript | so gut wie die Quelle | `npm run voice:import` |
| TikTok-In-App-Text-zu-Sprache (die „typische TikTok-Stimme“) | kostenlos | nur **innerhalb der TikTok-App** gedacht; inoffizielle APIs verstoßen gegen die Nutzungsbedingungen | ❌ nicht legal automatisierbar | sehr typisch | Empfehlung: in der App über das fertige Video legen **oder** Export als Datei → Import |
| Coqui XTTS-v2 | kostenlos | Coqui Public Model License: **nicht kommerziell** | ✅ | sehr gut | ❌ verworfen (Lizenz) |
| F5-TTS (vortrainiert) | kostenlos | Modellgewichte CC-BY-NC: **nicht kommerziell** | ✅ | sehr gut | ❌ verworfen (Lizenz) |
| Chatterbox Multilingual (Resemble AI) | kostenlos | MIT-Lizenz | ⚠️ technisch möglich, aber ohne GPU in Actions sehr langsam | sehr natürlich, Stimmklonen | Kandidat für später (nur mit Stimme, an der Rechte bestehen) |
| Microsoft Edge „Read aloud“ (edge-tts) | kostenlos | inoffizielle Nutzung eines Microsoft-Dienstes, Nutzungsbedingungen unklar | ⚠️ | sehr gut (z. B. „Conrad“, „Florian“) | ❌ nicht verwendet (rechtlich unsicher) |
| ElevenLabs / Azure / Google TTS | kostenpflichtig bzw. API-Key | kommerziell lizenzierbar | ✅ | sehr gut | ❌ Vorgabe: keine kostenpflichtigen APIs |

> Hinweis: Lizenzangaben nach bestem Wissen zum Stand der Recherche – vor einer kommerziellen Nutzung die jeweils
> aktuelle Lizenz der Stimme/des Modells prüfen. Die Piper-Modellkarte wird beim Setup mit heruntergeladen
> (`.cache/piper-voices/<stimme>.MODEL_CARD`).

## Warum diese Architektur

Das Video hängt **nie** von einer bestimmten Stimme ab: Jede Quelle erzeugt dieselben zwei Dateien –
`public/voiceover/<video>/voiceover.mp3` und `src/videos/<video>/voiceover.json` (Segment-Timings + Untertitel).
Szenenlängen, Schnitte und Untertitel richten sich automatisch nach diesem Manifest. Fehlt die Stimme,
wird stumm mit geschätzten Timings gerendert.

## Klangbearbeitung (automatisch, FFmpeg)

Hochpass 75 Hz → leichte Absenkung 220 Hz → Präsenz +2,5 dB bei 3,2 kHz → Höhen +1,5 dB → Kompressor 3:1 →
Limiter → zweistufige Lautheitsnormalisierung auf **−14 LUFS**, True Peak −1,5 dBTP → 48 kHz.
