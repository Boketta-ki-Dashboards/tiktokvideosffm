# QA – #17 „Zwei Flugzeuge – Passagiere krank an Bord“ (Condor-Flüge, 22.11.2026)

Render **Lauf #91** (Workflow „Video produzieren (ElevenLabs Adam)“, `stimme: vorhanden` – kein ElevenLabs-Aufruf), 23.11.2026.
Export `FrankfurtRedNews_Condor_Flughafen_Krankheitsfaelle_23Nov2026.mp4` + `…_THUMBNAIL.png` + `…_COVER_VORSCHAU.png` + `…_OVERLAY_PRUEFUNG.png` + `…_QUELLEN_PRUEFUNG.png`.
Erste Folge unter dem Kanalnamen **FrankfurtRedNews**.

## Technik

| Prüfung | Ergebnis |
|---|---|
| Länge | **64,576 s = 1.937 Frames** (Längen-Ausnahme: gesamt ≤ 66 s / 1.980) ✅ |
| Informationsteil | **60,06 s** bis Ende von f2 (Grenze 61,5 s), davon **59,06 s nach der Begrüßung** (Ziel 58–63 s) ✅ |
| Intro / Outro | Begrüßung „Ewa, Frankfurt!“ 0,12–1,00 s (Titelbild bis ≈ 5,5 s) · Abo-Aufruf 60,18–63,10 s + 1,5 s Nachlauf (≈ 4,4 s) ✅ |
| Datei | 15,58 MB, SHA-256 `db002485bbdf625e…` ✅ |
| Video | H.264 High · 1080 × 1920 · 30 fps konstant · yuv420p · BT.709 · Faststart ✅ |
| Audio | AAC LC 48 kHz · −14,6 LUFS · LRA 2,1 LU · True Peak −1,7 dBTP ✅ |
| Dekodierung (ffmpeg, komplette Datei) | fehlerfrei ✅ |
| Stille ≥ 0,4 s (−50 dB) / Schwarzbilder | keine / keine ✅ |
| Pausenprüfung Sprecherspur | längste Pause 378 ms (Grenze 400; vorher 406 ms in b1 → Pausen im Satz ≤ 280 ms, offline, 0 Credits) ✅ |
| Whisper-Gegenprobe (medium) | alle Sätze korrekt; im Gesamtdurchlauf ließ Whisper den Anfang von c2 und den Abo-Aufruf aus – einzeln geprüft: „Laut Fraport vorsorglich mit zusätzlichen Kräften …“ und „Für mehr Nachrichten aus Frankfurt folgt Frankfurt Red News.“ ✅ |
| Tests | `npm run check` grün (269 Tests), davon 12 in `tests/erklaert-condor-fluege.test.ts` ✅ |

## Stimme

ElevenLabs **Adam** (`pNInz6obpgDQGcFmaJgB`, `eleven_multilingual_v2`), Profil `kurzformat-60`: speed **1.20**, stability 0.45, similarity_boost 0.8,
style 0.2, use_speaker_boost true, seed 20261104, `mp3_44100_128`. Begrüßung aus dem Cache (#11–#16), Abo-Aufruf neu („Frankfurt Rett News“).
Hörprobe #87 · Vollvertonung #88 abgebrochen (FFmpeg-Paketquellen auf dem Runner nicht erreichbar, Abbruch VOR jedem ElevenLabs-Aufruf, 0 Credits)
→ #89 erfolgreich · Nachvertonung #90 (nur f2, ≈ 38 Credits).

## Inhalt / Faktencheck

- Letzter Faktencheck **23.11.2026, 11:30 Uhr**: hessenschau-Artikel „Stand 23.11., 10:46 Uhr“ (≈ 30 Betroffene, Kreuzfahrt, vor Abflug erkrankt,
  Meldung ans Gesundheitsamt), hessenschau-Ticker 9:59 Uhr, dpa (Fraport), aeroTELEGRAPH, t-online, aero.de; Condor/Fraport ohne eigene Mitteilung.
- 620 = alle Menschen an Bord (Personenraster, „NICHT ALLE KRANK“); ≈ 30 laut Condor und ≈ 40 laut anderen Berichten getrennt.
- Keine Notlandung, keine Lebensgefahr, keine Diagnose; Norovirus nur als Verdacht („NICHT BESTÄTIGT“); kein Schiffsname, kein MANV-Stichwort.
- Zwei Klinikaufnahmen mit Quelle (Condor: Gründe; Fraport: je eine pro Flug); Gesundheitsamt: Fall gemeldet/eingeschaltet, Ergebnis nicht bekannt.

## Visuelle Prüfung

- Standbilder `--every 45` mit echten Adam-Zeiten und Kontaktbogen der fertigen MP4 (0,5 fps, `kontaktbogen-run91.jpg`).
- Korrigiert vor dem Render: Flugkarten überdeckten „La Romana“ (Karte höher, Karten früher), „≈“ brach um, Stempel „NICHT BESTÄTIGT“ über der
  Quellenzeile, Kabine zu hell (gedimmtes Kabinenlicht), leerer Einsatz-Anfang (Fahrzeuge ab Frame 0), Fraport-Zeile unter Condor-Chip (getrennt).
- Neuer Kanalname: Outro, Titelbild-Logozeile, Profilraster und App-Simulation zeigen **@frankfurtrednews**; Profilbild/Logo unverändert.
- Kopfzeile oben rechts (y 272), Quellenzeile unter den Untertiteln; Titelbild-Prüfbogen in allen vier Ansichten lesbar.

## Hinweise

- Titel bewusst ohne „plötzlich“ (laut hessenschau waren Betroffene schon vor dem Abflug erkrankt).
- Handle `@frankfurtrednews` aus dem neuen Namen abgeleitet – bitte vor dem Upload mit dem tatsächlichen TikTok-Handle abgleichen.
- Keine automatische Veröffentlichung.
