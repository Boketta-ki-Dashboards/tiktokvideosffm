# Sprecherstimme – Recherche & Entscheidung (Stand 03.11.2026)

Ziel: natürliche, männliche deutsche KI-Stimme im TikTok-Stil, **kostenlos**, **rechtlich nutzbar**,
**automatisierbar** (GitHub Actions) – ohne kostenpflichtige API und ohne API-Keys.

## Update 03.11.2026: neuer Standard = Chatterbox (natürlich)

Rückmeldung: Piper klingt zu künstlich. Neuer Standard ist **Chatterbox Multilingual** von Resemble AI:
- **MIT-Lizenz**, läuft lokal (CPU reicht, ca. 5× Echtzeit), kein API-Key, keine Kosten.
- Modernes, ausdrucksstarkes Sprachmodell (Klasse von ElevenLabs & Co.), Deutsch wird unterstützt.
- **Klangvorlage:** `voices/thorsten-cc0-ref.flac` – 12 s echte Aufnahme von Thorsten Müller aus dem
  Datensatz *Thorsten-Voice TV-24kHz-2025.12-Neutral-FT-Mini* (**CC0**, ausdrücklich für Sprachsynthese freigegeben).
- Ausgaben enthalten das unhörbare „Perth“-Wasserzeichen von Resemble AI (Kennzeichnung als KI-Audio).

Erkenntnisse aus Tests (Whisper-Gegenprobe):
- Chatterbox verschluckt oft das **erste Wort** eines Satzes → die Pipeline setzt „Also.“ davor und schneidet es an
  der Sprechpause automatisch wieder ab (bei Fehlschlag neuer Versuch mit anderem Seed).
- **Lautschrift** im Skript (`{Anzeige|Gesprochen}`): englische Namen eindeutschen („Snipes“ → „Snaips“),
  Zahlen/Uhrzeiten ausschreiben („einundzwanzig Uhr vierzig“), Abkürzungen buchstabieren („A F P“).
- Einstellungen: `exaggeration 0.7`, `cfgWeight 0.3`, Tempo ×1,08 (TikTok-typisch zügig).

## Ergebnis (ursprüngliche Recherche)

| Option | Kosten | Rechtlich | Automatisierbar | Qualität (DE, männlich) | Status im Projekt |
|---|---|---|---|---|---|
| **Chatterbox Multilingual** + Vorlage Thorsten-Voice (CC0) | kostenlos | Modell **MIT**, Vorlage **CC0** | ✅ lokal, auch in GitHub Actions (`voice: chatterbox`, ≈ 10–20 min) | **natürlich**, betont, lebendig | **Standard** (`npm run voice:chatterbox`) |
| **Piper** + Stimme `de_DE-thorsten-high` | kostenlos | Datensatz „Thorsten-Voice“ **CC0**; Engine `piper-tts` GPL-3.0 (nur als Werkzeug genutzt, Audio-Ausgabe unberührt) | ✅ lokal/offline, sehr schnell | hörbar künstlich („Roboter“) | Schnelle Vorschau (`npm run voice:piper`) |
| Piper `de_DE-thorsten_emotional-medium` | kostenlos | CC0 (Thorsten-Voice) | ✅ | lebendiger, 8 Emotionen (Sprecher-IDs), etwas geringere Klangqualität | Alternative, nur `piperModel` + Sprecher-ID ändern |
| **Eigene fertige MP3/WAV** (z. B. aus der TikTok-App, eigener Aufnahme oder einem Dienst, dessen Lizenz kommerzielle Nutzung erlaubt) | – | abhängig von der Quelle – Lizenz in `references/` dokumentieren | ✅ Import-Skript | so gut wie die Quelle | `npm run voice:import` |
| TikTok-In-App-Text-zu-Sprache (die „typische TikTok-Stimme“) | kostenlos | nur **innerhalb der TikTok-App** gedacht; inoffizielle APIs verstoßen gegen die Nutzungsbedingungen | ❌ nicht legal automatisierbar | sehr typisch | Empfehlung: in der App über das fertige Video legen **oder** Export als Datei → Import |
| Coqui XTTS-v2 | kostenlos | Coqui Public Model License: **nicht kommerziell** | ✅ | sehr gut | ❌ verworfen (Lizenz) |
| F5-TTS (vortrainiert) | kostenlos | Modellgewichte CC-BY-NC: **nicht kommerziell** | ✅ | sehr gut | ❌ verworfen (Lizenz) |
| Microsoft Edge „Read aloud“ (edge-tts) | kostenlos | inoffizielle Nutzung eines Microsoft-Dienstes, Nutzungsbedingungen unklar | ⚠️ | sehr gut (z. B. „Conrad“, „Florian“) | ❌ nicht verwendet (rechtlich unsicher) |
| ElevenLabs / Azure / Google TTS | kostenpflichtig bzw. API-Key; ElevenLabs-Gratisplan nur nicht-kommerziell mit Namensnennung | kommerziell lizenzierbar (Bezahlplan) | ✅ | sehr gut | ❌ nicht automatisiert (Vorgabe). Wer einen Bezahlplan hat: MP3 auf der Website erzeugen → `voice-input/` → `voice: import` |

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
