# Musik & Soundeffekte – Nachweis

| Datei | Herkunft | Rechte |
|---|---|---|
| `public/sfx/whoosh.wav`, `impact.wav`, `pop.wav` | synthetisch mit FFmpeg erzeugt (`scripts/audio/generate-sfx.mjs`) | eigene Produktion, keine Fremdsamples |
| `public/music/ambient-bed.mp3` | synthetisch mit FFmpeg erzeugt (`scripts/audio/generate-music.mjs`): Moll-Akkord-Teppich (A1, E2, A2, C3, E3, E4), langsames Tremolo, 24 s nahtloser Loop, 96 kbit/s (≈ 290 KB) | eigene Produktion (reine Sinustöne), keine Fremdsamples, keine Lizenzfragen |

Einsatz: `MusicBed` (Folge 3) spielt das Bett sehr leise (Lautstärke 0,5) und senkt es automatisch unter der Sprecherstimme (Ducking auf 0,2).
Gemessen: Bett allein −23,7 LUFS; im fertigen Video liegt es deutlich unter der Stimme (−14 LUFS). Ein-/Ausschalten per Prop `music`.
