# QA – #14 „Frankfurt 20.11. – was ist heute wirklich passiert?“ (VORBILANZ)

Render **Lauf #78** (Workflow „Video produzieren (ElevenLabs Adam)“, `stimme: vorhanden` – kein ElevenLabs-Aufruf), 20.11.2026.
Export `FrankfurtRed3_20November_Vorbilanz_ADAM_FINAL.mp4` + `…_THUMBNAIL.png` + `…_COVER_VORSCHAU.png` + `…_OVERLAY_PRUEFUNG.png` + `…_QUELLEN_PRUEFUNG.png`.

## Technik (FFprobe-Prüfbericht des Workflows + eigene Prüfung)

| Prüfung | Ergebnis |
|---|---|
| Länge | **54,869 s = 1.646 Frames** (Grenze 60,0 s / 1.800) ✅ |
| Datei | 20,25 MB (< 30 MB) ✅ |
| Video | H.264 High · 1080 × 1920 · 30 fps konstant · yuv420p · BT.709 · Faststart ✅ |
| Audio | AAC 48 kHz · 189 kbit/s · −14,5 LUFS · True Peak −1,7 dBTP ✅ |
| Dekodierung (ffmpeg, komplette Datei) | fehlerfrei ✅ |
| Stille ≥ 0,4 s (−50 dB) | keine ✅ |
| Schwarzbilder | keine ✅ |
| Pausenprüfung Sprecherspur | längste Pause 378 ms (Grenze 400) ✅ – Pause nach „…vom Protesttag!“ war 408 ms → `pauseAfterMs` 80, offline aus dem Cache neu gebaut (0 Credits) |
| Whisper-Gegenprobe (medium) | „Ey wa Frankfurt! Hier ist die erste Bilanz vom Protesttag …“ – alle Sätze korrekt, „Gen Z regelt“, „T-Online“, „Frankfurt Red 3“ ✅ |
| Tests | `npm run check` grün (231 Tests), davon 11 in `tests/erklaert-20nov-vorbilanz.test.ts` ✅ |

## Inhalt / Faktencheck

- Letzter Faktencheck **20.11.2026, 19:18 Uhr** (hessenschau-Ticker Stand 18:58, FFH 18:48, t-online aktualisiert 18:40; Polizei Frankfurt und Innenministerium ohne Bilanz) – Uhrzeit im Titelbild, in der Quellenzeile und im Fazit.
- Versammlungen getrennt (Werft · Demozug · Schulstreik), Zahlen nie addiert, „NICHT ADDIEREN“ im Bild; keine Aussage „nur 25 in Frankfurt“.
- Jede Zahl mit Urheber (Polizei / Reporter / Bundesbewegung), Uhrzeiten = Meldungszeiten (im Titelbild ausdrücklich so beschriftet).
- Demozug-Karte: nur gemeldete Punkte (Hbf, Taunusanlage, Alte Oper, Bockenheimer Depot), Verlauf schematisch gekennzeichnet, © OpenStreetMap.
- Schilderung der Ortsgruppe im Konjunktiv und als „nicht unabhängig bestätigt“ markiert.
- Keine Festnahmen/Verletzten genannt (keine belegte Zahl bis 19:18 Uhr).

## Visuelle Prüfung (Standbilder `--every 45` mit echten Adam-Zeiten + Kontaktbogen der fertigen MP4)

- Titelbild = erste Szene, im Prüfbogen in 9:16, 3:4, Profilraster und Videoframe vollständig lesbar.
- Kopfzeile oben rechts (y 272), Szenen-Box links auf gleicher Linie; Quellenzeile unter den Untertiteln (Prüfbogen 1- und 2-zeilig).
- Korrigiert vor dem Render: leerer Anfang der Streit-Szene (Paneele jetzt ab Frame 2), Stempel „VORZEITIG BEENDET“ früher (nach „dreißig“),
  Kartenhinweis einzeilig, Start-Marke blendet während der Fahrt aus (lag angeschnitten am Rand), Balken „Gruppe selbst: bis 5.000“ deutlicher.

Kontaktbogen (0,5 fps): `kontaktbogen-run78.jpg`.

## Vor dem Upload (Kanalbetreiber)

- Video ist eine **Vorbilanz** (Stand 19:18 Uhr). Falls Polizei/Innenministerium inzwischen eine Bilanz veröffentlicht haben, nicht als aktuellen Stand hochladen – neue Fassung anfordern.
- Keine automatische Veröffentlichung.
