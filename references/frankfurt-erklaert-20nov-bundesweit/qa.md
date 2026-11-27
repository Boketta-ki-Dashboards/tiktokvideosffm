# QA – „73 Städte – ein Protesttag! Was passiert morgen?“ (Frankfurt erklärt #12)

Produziert am 19.11.2026 für Freitag, 20.11.2026. **Stand im Video: 19.11.2026, 14 Uhr** (vor der Vertonung um 16:09 Uhr erneut geprüft –
unverändert 73 Städte, identische Liste, Zähler 20.130). Nicht automatisch veröffentlicht.

## Status: FERTIG – Lauf #72

- [Lauf #72](https://github.com/Boketta-ki-Dashboards/tiktokvideosffm/actions/runs/44565030222) (`stimme: vorhanden`, kein ElevenLabs-Aufruf) – grün.
- Artefakte: `FrankfurtRed3_20November_Bundesweit_ADAM_FINAL-run72` (MP4, Thumbnail, Titelbild-, Overlay- und Quellen-Prüfbogen, ID 14551853346),
  `…-Technikbericht-run72` (ID 14551354343), `…-Sprecher-Adam-run72` (ID 14552376203).

| Prüfung | Ergebnis |
|---|---|
| Datei | `FrankfurtRed3_20November_Bundesweit_ADAM_FINAL.mp4`, **14,49 MiB** (15.192.699 Byte, < 30 MB), SHA-256 `3c10ae198c6a2f948ffea75be008f0dad67804a3cfb55e72319cb8d91416134b` |
| Video | H.264 High, 1080 × 1920, 30/1 fps, yuv420p, BT.709, **1.698 Frames = 56,619 s** (≤ 1.800), Faststart |
| Audio | AAC LC, 48 kHz, Stereo, 189 kbit/s · **−14,6 LUFS**, LRA 2,3 LU, True Peak −1,7 dBTP |
| Dekodierung | vollständig fehlerfrei (ffmpeg, 0 Meldungen) |
| Stille ≥ 400 ms (−50 dB) / schwarze Bilder ≥ 0,2 s | keine / keine |
| Pausen in der Sprecherspur (−40 dB) | längste 385 ms (Grenze 400 ms) |
| Workflow-Prüfungen | `verify-video`, `check-sync`, `check-pauses`, `tech-report --max-seconds 60` – alle grün; `npm run check` 206/206 Tests |
| Kontaktbogen | `kontaktbogen-run72.jpg` (alle 2 s aus dem MP4) |
| Quellenzeile | `…_QUELLEN_PRUEFUNG.png`: Quelle bei 1- und 2-zeiligen Untertiteln an derselben Stelle (y 1.512–1.591), mit simulierter App lesbar |
| Titelbild | `…_THUMBNAIL.png`; Prüfbogen: „73“, „STÄDTE – EIN PROTESTTAG“ und Datum in allen vier Ansichten lesbar |

## Stimme

- Hörprobe **Lauf #70** (186 Zeichen), Whisper: „… Gen Z regelt, listet 73 Städte. In Köln rechnen die Anmelderinnen mit 5.000 bis 10.000 an der Deutzer Werft.“
- Vollvertonung **Lauf #71** (Adam, Profil kurzformat-60, speed 1.20); Begrüßung „Ewa, Frankfurt!“ und Abo-Aufruf aus dem geprüften #11-Cache (0 Credits).
  Lauf #71 scheiterte danach nur an der Pausenprüfung (412 ms nach „73 Städte!“) → `pauseAfterMs` 120 → 80, Spur offline aus dem Cache neu gebaut
  (0 Credits), längste Pause 385 ms. Danach Render in Lauf #72 ohne ElevenLabs-Aufruf.
- Whisper (medium) auf dem fertigen MP4: „Ey wa Frankfurt! Morgen ist nicht nur Frankfurt dran. JNZ regelt, listet 73 Städte. Von Kiel bis Lörrach,
  von Aachen bis Cottbus. Stand Donnerstag Mittag. … In Köln rechnen die Anmelderinnen laut Polizei mit 5.000 bis 10.000 … Bundesweit rund 20.000 …
  Folgt Frankfurt Red drei für mehr.“ – „JNZ“ ist Whispers Schreibweise für „Dschen Zett“ (wie in #06/#10); „Werbpflicht“ im Gesamttext, der isolierte
  Satz wird als „Nein zur Wehrpflicht“ erkannt.
- Länge 55,1 s Sprache + Abo-Phase = 56,6 s (Ziel 56–59,5 s).

## Korrekturen nach den Standbildern mit echten Adam-Zeiten

- Titelbild: Logo-Zeile blendet vor dem zweiten Satz aus (zweizeiliger Untertitel „Morgen ist nicht nur / Frankfurt“ hätte sie überdeckt).
- Karte: Die 73 Punkte aus dem Titelbild bleiben beim Schnitt stehen (vorher kurz verschwunden), die Nord-Süd-Welle lässt sie nur aufleuchten;
  „73“ steht sofort (im Titelbild schon gesprochen, kein Hochzählen ab 0).

## Abweichungen vom Auftrag (siehe sources.md)

| Auftrag | Video | Grund |
|---|---|---|
| 54 Städte | **73 Städte** (überall) | Website 19.11., 13:47 und 16:09 Uhr: 73; SZ 16.11.: 39 |
| Frankfurt „≈ 4.000 angemeldet“ | „bis zu 4.000 **erwartet** · laut Stadt“ | Quellen sagen „erwartet“ |
| Köln 5.000–10.000 (KStA 16.11.) | Erwartung der Anmelderinnen **laut Polizei Köln (PM 19.11., 7:58 Uhr)**, Deutzer Werft statt Innenstadt | neuere, behördliche Quelle |
| Berlin/München prüfen | Berlin 5.000 erwartet laut Polizei (Tagesspiegel), München „Zahl offen“ (nur Bild) | keine behördliche Zahl für München |

## Prüfliste

| Prüfpunkt | Ergebnis |
|---|---|
| Stadtzahl aktuell und überall gleich? | ✅ 73 (Test) |
| Karte mit echten Positionen? | ✅ Treffpunkt-Koordinaten der Website, Extrempunkte = Ton (Test) |
| Zentral vs. lokal mit Legende? | ✅ orange 4 / weiß 69 |
| Drei Zahlenarten getrennt? | ✅ Online-Zusage · Anmeldung/Erwartung · tatsächlich „NOCH OFFEN“ |
| „Angaben zur Planung – keine tatsächliche Teilnehmerzahl“? | ✅ Stempel bei „Planungszahlen“ |
| Keine Werbung, keine Krawall-Spekulation, keine Frankfurter Polizeiplanung? | ✅ (Test) |
| Forderungen neutral? | ✅ POSITION · laut Website · 3 von 6 |
| Quellen unter den Untertiteln? | ✅ `sourceLine`, Prüfbogen |
| Overlay oben rechts, TopTag links? | ✅ `…_OVERLAY_PRUEFUNG.png` |
| Offizielles Logo? | ✅ Titelbild, Abo-Aufruf |
| ≤ 60 s, 1080 × 1920, 30 fps, H.264/AAC, < 30 MB? | ✅ 56,619 s, 14,49 MiB |

Nicht automatisch veröffentlicht. Vor dem Posten am Abend lohnt ein letzter Blick auf die Website: nennt sie dann mehr als 73 Städte, stimmt der
Stand im Video („Donnerstagmittag“, „19.11., 14 Uhr“) trotzdem – die Caption sagt ebenfalls „Stand: 19.11.2026, ca. 14 Uhr“.
