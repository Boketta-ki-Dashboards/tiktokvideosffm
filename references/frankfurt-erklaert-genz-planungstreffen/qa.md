# QA – #18 „Gen Z regelt Frankfurt – was soll sich am 12. Dezember ändern?“ (FrankfurtRedNews)

Render **Lauf #95** (Workflow „Video produzieren (ElevenLabs Adam)“, `stimme: vorhanden` – kein ElevenLabs-Aufruf), 25.11.2026.
Export `FrankfurtRedNews_GenZ_Planungstreffen_12Dezember_25Nov2026.mp4` + `…_THUMBNAIL.png` + `…_COVER_VORSCHAU.png` + `…_OVERLAY_PRUEFUNG.png` +
`…_QUELLEN_PRUEFUNG.png`. Lauf #94 (gleicher Inhalt) wurde ersetzt, weil `blackdetect` zwei sehr dunkle Szenenanfänge meldete (siehe unten).

## Technik

| Prüfung | Ergebnis |
|---|---|
| Länge | **65,472 s = 1.964 Frames** (Längen-Ausnahme: gesamt ≤ 66 s / 1.980) ✅ |
| Informationsteil | **60,95 s** bis Ende von q1 (Grenze 61,5 s), davon **59,94 s nach der Begrüßung** (Ziel 58–63 s) ✅ |
| Intro / Outro | Begrüßung „Ewa, Frankfurt!“ 0,12–1,00 s (Titelbild bis ≈ 4,7 s) · Abo-Aufruf 61,07–63,99 s + 1,5 s Abo-Phase ✅ |
| Datei | 16,71 MB (17.524.339 Byte), SHA-256 `e4abd75e29112298…` ✅ |
| Video | H.264 High · 1080 × 1920 · 30 fps konstant · yuv420p · BT.709 · Faststart ✅ |
| Audio | AAC LC 48 kHz · **−14,6 LUFS** · LRA 1,6 LU · True Peak **−1,4 dBTP** ⚠️ (Ziel −1,5: schon die Sprecher-MP3 misst nach der MP3-Kodierung −1,3 dBTP – Überschwinger der Kodierung trotz `loudnorm TP=-1.5`; Abweichung 0,1 dB, Technikbericht bestanden) |
| Dekodierung (ffmpeg, komplette Datei) | fehlerfrei ✅ |
| Stille ≥ 0,4 s (−50 dB) | keine ✅ |
| Schwarzbilder (`blackdetect` d=0,2 s, 95 %) | Lauf #94: 12,63–13,27 s und 54,67–55,17 s (Szenenanfänge „Planung“ und „Was ist offen?“ – Inhalt vorhanden, aber Hintergrund zu dunkel) → Hintergrund aufgehellt, Zitatkarte ab Frame 6 → **Lauf #95: keine** ✅ |
| Pausenprüfung Sprecherspur | längste Pause 396 ms (Grenze 400) ✅ |
| Whisper-Gegenprobe (medium) | Gesamtspur korrekt; d1 in der Gesamtspur ausgelassen (bekannte Whisper-Lücke), einzeln geprüft: „Neuer Ansatz. Für Dienstag Abend lud die Gruppe zu einem offenen Planungstreffen im DGB-Haus ein.“ ✅ · Begrüßung „Ey wa Frankfurt!“ ✅ · „Gen-Z-Demos“, „Gallus-Anlage“, „Standort folgt“, „Frankfurt Red News“ ✅ |
| Tests | `npm run check` grün (TypeScript, ESLint, 283 Tests), davon 13 in `tests/erklaert-genz-planungstreffen.test.ts`; CI #129 grün ✅ |

## Stimme

ElevenLabs **Adam** (`pNInz6obpgDQGcFmaJgB`, `eleven_multilingual_v2`), Profil `kurzformat-60`: speed **1.20**, stability 0.45, similarity_boost 0.8,
style 0.2, use_speaker_boost true, seed 20261104, `mp3_44100_128`. Begrüßung und Abo-Aufruf (FrankfurtRedNews) aus dem Cache von #17, g1
(„Ob die Demo angemeldet ist, ist öffentlich nicht bekannt.“) wortgleich aus dem Cache von #16. Hörprobe #92 (190 Zeichen), Vollvertonung #93
(13 neue Sätze ≈ 1.000 Zeichen), Render #94 und #95 ohne ElevenLabs-Aufruf. Keine Nachvertonung nötig.

## Inhalt / Faktencheck

- Letzter Faktencheck **25.11.2026, 17:08 Uhr** (erste Recherche 16:40 Uhr): Website der Bundesinitiative unverändert (Frankfurt „Standort folgt“,
  „Uhrzeit folgt“), presseportal (jüngste Meldung 1472, nichts zu Gen Z / 12.12.), innen.hessen.de/presse (keine Meldung zum 12.12.), hessenschau
  (kein neuer Artikel), Websuche: kein Medienbericht über das Planungstreffen oder die Gallusanlage.
- Kritik nur als **Aussage der Gruppe** (Konjunktiv, Chips „AUSSAGE DER GRUPPE“); Kurzzitate wörtlich aus dem transkribierten Beitrag (Test);
  Ministeriumszitat ungekürzt („nicht die Herkunft eines Menschen, sondern konkretes Verhalten“ – zunächst gekürzt, vor dem Render korrigiert, Test).
- Konfrontative Sätze („Schikane … nicht unbeantwortet“, „GenZ zusammenstehen“) und Wertungen („kuscheln“, „Generalverdacht“) nicht übernommen.
- Planungstreffen nur als **Einladung**; „Was dort besprochen wurde, ist öffentlich nicht bekannt.“; DGB-Haus = Ort, DGB-Beteiligung nicht bekannt.
- Keine Spaltung/Wiedervereinigung, kein „garantiert“, keine Route, keine Teilnehmerzahl für den 12.12.; Rückblick-Zahlen (ca. 30 / ca. 1.000 laut
  Innenministerium) nur im Bild, nicht addiert.
- 12.12.: Ankündigung der Gruppe (14 Uhr, Gallusanlage) ≠ Website der Bundesinitiative („Standort folgt“) ≠ Anmeldung (öffentlich nicht bekannt) ≠
  Behörde (keine Mitteilung) – im Ton (f1, f2, g1) und als Stufenleiste im Bild.
- **Herkunft:** Account im Screenshot nicht sichtbar, Ursprungsbeitrag nicht eindeutig zuzuordnen → „eine Frankfurter Gruppe“, im Bild und in der
  Caption offen benannt; Screenshots nicht eingebettet (eigene Nachbildung, „Nachbildung“).

## Visuelle Prüfung

- Standbilder `--every 45` mit echten Adam-Zeiten (zwei Durchgänge + Detailbilder) und Kontaktbogen der fertigen MP4 (0,5 fps, `kontaktbogen-run95.jpg`).
- Korrigiert vor dem ersten Render: „#GEN Z REGELT“ auf dem Handy abgeschnitten (fehlende `position: relative`) → zweizeilig; „−3 TAGE“-Kalender von den
  Ringen verdeckt → eigene Plakette „3 · TAGE VORHER“; Zeil-Illustration zu dunkel → aufgehellt; Stempel „Ergebnisse nicht öffentlich bekannt“ zu spät →
  ab „besprochen“; leere untere Hälfte in „Abstimmung?“ → Zeile „Zusammenarbeit für den 12.12.: bislang nicht öffentlich geklärt“; Hauptbahnhof-/DGB-Marken
  am Kartenrand → Kamera auf alle drei Punkte, Nebenmarken blenden vor dem Schwenk aus; Website-Karte tiefer; „OFFEN“-Stempel früher.
- Nach Lauf #94: dunkle Szenenanfänge (blackdetect) → Lauf #95.
- Kopfzeile oben rechts (y 272), Quellenzeile unter den Untertiteln (Prüfbogen: 1- und 2-zeilige Untertitel), Titelbild in allen vier Ansichten lesbar,
  @frankfurtrednews im Profilraster und in der App-Simulation.

## Hinweise

- Keine automatische Veröffentlichung.
