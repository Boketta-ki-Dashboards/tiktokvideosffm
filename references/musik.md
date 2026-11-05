# Musik & Soundeffekte – Nachweis

| Datei | Herkunft | Rechte |
|---|---|---|
| `public/sfx/whoosh.wav`, `impact.wav`, `pop.wav` | synthetisch mit FFmpeg erzeugt (`scripts/audio/generate-sfx.mjs`) | eigene Produktion, keine Fremdsamples |
| `public/music/ambient-bed.mp3` | synthetisch mit FFmpeg erzeugt (`scripts/audio/generate-music.mjs`): Moll-Akkord-Teppich (A1, E2, A2, C3, E3, E4), langsames Tremolo, 24 s nahtloser Loop, 96 kbit/s (≈ 290 KB) | eigene Produktion (reine Sinustöne), keine Fremdsamples, keine Lizenzfragen |

Einsatz: `MusicBed` (Folge 3) spielt das Bett sehr leise (Lautstärke 0,5) und senkt es automatisch unter der Sprecherstimme (Ducking auf 0,2).
Gemessen: Bett allein −23,7 LUFS; im fertigen Video liegt es deutlich unter der Stimme (−14 LUFS). Ein-/Ausschalten per Prop `music`.

## Soundeffekte (ab „Wie Frankfurt weltweit Schlagzeilen machte“)

- **Selbst erzeugt** (`scripts/audio/generate-sfx.mjs`, reine FFmpeg-Synthese, keine Samples Dritter): `public/sfx/*.wav`
  – whoosh, impact, pop (Bestand), click, notify, blip, typewriter, paper, soft-impact, boom, riser, stamp (neu, Spitzenpegel −3 dBFS).
- **ElevenLabs Sound Effects** (`eleven_text_to_sound_v3`, erzeugt am 05.11.2026 im Workflow „Video produzieren“, Lauf 6, mit dem
  bezahlten Tarif des Kanalbetreibers): `public/sfx/premium/{boom,typewriter,notify,blip}.mp3`, Prompts in `config/sfx-elevenlabs.json`,
  Rohdateien + Metadaten in `voice-cache/elevenlabs-sfx/`. Ersetzen die gleichnamigen Synth-Effekte über `src/lib/sfx-premium.ts`.
