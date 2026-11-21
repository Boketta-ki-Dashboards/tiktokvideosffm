# QA – #15 „Gen-Z-Proteste: Was ist in Hamburg, Leipzig und den anderen Städten passiert?“

Render **Lauf #81** (Workflow „Video produzieren (ElevenLabs Adam)“, `stimme: vorhanden` – kein ElevenLabs-Aufruf), 21.11.2026.
Export `FrankfurtRed3_20November_Staedte_ADAM_FINAL.mp4` + `…_THUMBNAIL.png` + `…_COVER_VORSCHAU.png` + `…_OVERLAY_PRUEFUNG.png` + `…_QUELLEN_PRUEFUNG.png`.

## Technik

| Prüfung | Ergebnis |
|---|---|
| Länge | **58,645 s = 1.759 Frames** (Grenze 60,0 s / 1.800) ✅ |
| Datei | 14,32 MB ✅ |
| Video | H.264 High · 1080 × 1920 · 30 fps konstant · yuv420p · BT.709 · Faststart ✅ |
| Audio | AAC 48 kHz · −14,5 LUFS · LRA 1,8 LU · True Peak −1,7 dBTP ✅ |
| Dekodierung (ffmpeg, komplette Datei) | fehlerfrei ✅ |
| Stille ≥ 0,4 s (−50 dB) / Schwarzbilder | keine / keine ✅ |
| Pausenprüfung Sprecherspur | längste Pause 390 ms (Grenze 400) ✅ |
| Whisper-Gegenprobe (medium) | alle Sätze korrekt; im Gesamtdurchlauf wiederholte Whisper „vom Dammtor in die Schanze“ im Berlin-Satz – Einzelabschnitt 28,1–34,1 s geprüft: „Berlin, rund 4.000 vom Alexanderplatz bis Kreuzberg …“ (Whisper-Halluzination, Aufnahme korrekt; ElevenLabs-Zeitstempel identisch) ✅ |
| Tests | `npm run check` grün (241 Tests), davon 9 in `tests/erklaert-20nov-staedte.test.ts` ✅ |

## Inhalt / Faktencheck

- Letzter Faktencheck **21.11.2026, 17:51 Uhr**: NDR (Stand 13:18 Uhr), Polizei Leipzig (Ergänzung 12:30 Uhr), Polizei Stuttgart/Bremen/Hamburg ohne neuere Meldung.
- Demo und spätere Ausschreitungen getrennt (Phasen-Leiste „DEMO | NACH DEM ENDE“, Einordnung „DEMO ≠ AUSSCHREITUNG“); nie „alle Demonstrierenden“, keine zentrale Steuerung behauptet.
- Jüngster Stand übernommen: Hamburg „Pyrotechnik statt Flaschen“ (Polizei-Korrektur), Leipzig > 200 Identitäten / § 125a / 5 verletzte Beamte (Ergänzungsmeldung).
- Oktober-Zahlen (Hamburg 120/130 Festnahmen, 12 Verletzte) und Medien-Datumsfehler („Samstagabend“) bewusst nicht verwendet.
- Städte nicht addiert; Karte nach Polizeiangaben eingefärbt, als Einordnung gekennzeichnet; Grafiken (Strecke, Ring) als schematisch.

## Visuelle Prüfung

- Standbilder `--every 45` mit echten Adam-Zeiten und Kontaktbogen der fertigen MP4 (0,5 fps, `kontaktbogen-run81.jpg`).
- Korrigiert vor dem Render: Titelbild-Karte flacher (2,5D-Band zwischen Plakette und Logo), Hamburg-Marke nicht mehr hinter der Kopfkarte,
  abgeschnittene Beschriftung „DAMMTOR“, überlappende Städtekarten (Abstände), „> 200“-Karte unter die Kopfkarte verschoben.
- Kopfzeile oben rechts (y 272), Quellenzeile unter den Untertiteln; Titelbild-Prüfbogen in allen vier Ansichten lesbar.

## Hinweise

- Der Auftrag brach nach dem Hamburg-Abschnitt ab („Was geschah danach“); Leipzig, Berlin, Stuttgart, Bremen und Frankfurt wurden nach den Prioritäten
  aus Abschnitt 1 recherchiert und umgesetzt, Hashtags nach dem Muster der letzten Folgen gewählt.
- Keine automatische Veröffentlichung.
