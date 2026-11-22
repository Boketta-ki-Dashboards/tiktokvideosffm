# QA – #16 „Nach dem 20. November: Schon die nächste Demo geplant?“

Render **Lauf #86** (Workflow „Video produzieren (ElevenLabs Adam)“, `stimme: vorhanden` – kein ElevenLabs-Aufruf), 22.11.2026.
Export `FrankfurtRed3_GenZ_WieGehtEsWeiter_12Dezember.mp4` + `…_THUMBNAIL.png` + `…_COVER_VORSCHAU.png` + `…_OVERLAY_PRUEFUNG.png` + `…_QUELLEN_PRUEFUNG.png`.

## Technik

| Prüfung | Ergebnis |
|---|---|
| Länge | **65,408 s = 1.962 Frames** (Längen-Ausnahme: gesamt ≤ 66 s / 1.980) ✅ |
| Informationsteil | **60,95 s** bis Ende von q1 (Grenze 61,5 s), davon **59,95 s nach der Begrüßung** (Ziel ≈ 60 s) ✅ |
| Intro / Outro | Begrüßung „Ewa, Frankfurt!“ 0,12–1,00 s (Titelbild bis ≈ 4 s) · Abo-Aufruf 61,07–62,90 s + 2,5 s Abo-Phase ✅ |
| Datei | 18,88 MB, SHA-256 `67ae5ff1d1b04f00…` ✅ |
| Video | H.264 High · 1080 × 1920 · 30 fps konstant · yuv420p · BT.709 · Faststart ✅ |
| Audio | AAC LC 48 kHz · −14,7 LUFS · LRA 2,3 LU · True Peak −1,6 dBTP ✅ |
| Dekodierung (ffmpeg, komplette Datei) | fehlerfrei ✅ |
| Stille ≥ 0,4 s (−50 dB) / Schwarzbilder | keine / keine ✅ |
| Pausenprüfung Sprecherspur | längste Pause 397 ms (Grenze 400) ✅ |
| Whisper-Gegenprobe (medium) | Gesamtspur korrekt bis auf n1 der ersten Fassung („Trotzdem macht Dejen Zet regelt“, auch einzeln geprüft) → n1 umformuliert, „Gen Z regelt“ nach Gedankenstrich: „Trotzdem geht es weiter. Gen Z regelt, kündigt den nächsten bundesweiten Protesttag an. Samstag, der 12. Dezember.“ ✅ · f4 „Ob die Demo angemeldet ist, ist öffentlich nicht bekannt.“ ✅ · m1 „Neu, die Initiative sucht Helfer und Ordner, die für einen friedlichen Ablauf sorgen sollen.“ ✅ |
| Tests | `npm run check` grün (256 Tests), davon 14 in `tests/erklaert-12dez-ausblick.test.ts` ✅ |

## Stimme

ElevenLabs **Adam** (`pNInz6obpgDQGcFmaJgB`, `eleven_multilingual_v2`), Profil `kurzformat-60`: speed **1.20**, stability 0.45, similarity_boost 0.8,
style 0.2, use_speaker_boost true, seed 20261104, `mp3_44100_128`. Begrüßung und Abo-Aufruf aus dem Cache (#11–#15).
Hörprobe #82, Vollvertonung #83, Nachvertonung #84 (n1, f4: ≈ 181 Credits) und #85 (m1: ≈ 94 Credits); Pause nach r2 offline auf 40 ms.

## Inhalt / Faktencheck

- Letzter Faktencheck **22.11.2026, 17:54 Uhr**: Website unverändert (73 Städte = `data/staedte.json`, Frankfurt „Standort folgt“ / „Uhrzeit folgt“),
  Zähler 814 (vorher 794 um 17:26 → im Bild aktualisiert), Mitmachen/Förderpool wörtlich geprüft, Polizei Frankfurt + Innenministerium ohne Meldung zum
  12.12., hessenschau-Bericht vom 21.11. unverändert.
- Ankündigung ≠ Anmeldung ≠ Behörde im Ton (f3, f4) und als Stufenleiste im Bild; kein Treffpunkt, keine Uhrzeit, keine Route.
- „Treffpunkt Hauptbahnhof/Kaiserstraße“ aus dem Auftrag nicht belegt → nicht verwendet (Test, „Bewusst NICHT verwendet“).
- Keine Spaltung/Auflösung behauptet („unterschiedliche Planungen“, Hinweis „keine Aussage über eine dauerhafte Trennung“).
- m1 präzisiert: laut Website sorgen die **Ordner** für einen sicheren und friedlichen Ablauf (nicht die Helfer).
- Online-Zusagen ≠ Teilnehmende (Wortlaut der Website); Zählerstand nur im Bild mit Uhrzeit, Rohdaten gesichert.
- Schlussfrage ohne Prognose: Vergleich 20.11. (laut Polizei ≈ 1.700, vier Demos zusammen) | 12.12. OFFEN.

## Visuelle Prüfung

- Standbilder `--every 45` mit echten Adam-Zeiten (drei Durchgänge) und Kontaktbogen der fertigen MP4 (0,5 fps, `kontaktbogen-run86.jpg`).
- Korrigiert vor dem Render: Titelbild-Karte unsichtbar (Container ohne Höhe) → eigene Ebene, kleiner; Planungs-Marken am Bildrand abgeschnitten →
  Zoom 0,45 + Etiketten nach innen; Menschenmenge unsichtbar (SVG-Gruppe ohne `<svg>`) → `CrowdBand`; Hinweiszeilen als schmale Spalte → Deckkraft
  direkt am Hinweis; „BUNDESWEIT“ im Handy abgeschnitten; Fragekarte im Outro zu spät + missverständliche „12 ? ? ?“-Reihe → Vergleich 20.11. | 12.12.;
  Rollenschilder unter den Figuren statt winziger Armbinde.
- Kopfzeile oben rechts (y 272), Quellenzeile unter den Untertiteln (Prüfbogen: 1- und 3-zeilige Untertitel), Titelbild in allen vier Ansichten lesbar.

## Hinweise

- Keine automatische Veröffentlichung.
