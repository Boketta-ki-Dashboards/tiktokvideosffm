# QA – „Frankfurt erklärt in 60 Sekunden“ #04: 76 Fragen – Teil 3

## 1. Abgleich mit Teil 1 und Teil 2 (keine Wiederholung)

| Thema | Teil 1 | Teil 2 | Teil 3 |
|---|---|---|---|
| Die 76 Fragen (Grüne 21 + FDP 55) | ausführlich | Einstieg | nur Einstieg („Nach den 76 Fragen …“) |
| Polizeibilanz 181 / 13 / 1.300 | – | ausführlich | nur **181 als Kontext** zu Frage 2 |
| Tatverdächtige (73, Alter, polizeibekannt, Wohnort) | – | ausführlich | nur „2 unter 14“ (neu) + „von 73“ klein im Bild |
| TikTok, 20. November, Herkunftsdebatte | Frage | ausführlich | **nicht** wiederholt (Test) |
| Teilnehmerprognose 2.000 vs. 8.000–9.000 | – | 8.000–9.000 nur im Kleingedruckten | **neu, Frage 1** |
| Gewalt vor/nach der Auflösung | – | „6 bis zur Auflösung“ nur Kleingedrucktes | **neu, Frage 2** |
| Strafunmündigkeit, Jugendamt, Haftung | – | – | **neu, Frage 3** |
| Schäden, Versicherung, Hilfe der Stadt | als Frage (VI.2, VI.4) | – | **neu, Frage 4** |

## 2. Sprechertext und Timing

- Ausgangsentwurf ≈ 1.240 gesprochene Zeichen ≈ 67 s bei Adam 1.20 (Kalibrierung an Teil 2: 1.033 Zeichen = 56,3 s) → gekürzt auf 1.054 Zeichen
  (Schätzung ≈ 57 s), alle vier Schwerpunkte und rechtlichen Einschränkungen erhalten.
- Pausen: 40 ms zwischen Sätzen, 120 ms zwischen den Fragen; Schnitt am letzten Buchstaben, Pausen im Satz ≤ 320 ms; `maxPauseMs` 400.

## 3. Titelbild

- Neue Positionsregel `COVER_ZONE` (Formatsystem): Serientitel ab y 420 (Teil 2: 210), große 76 y ≈ 520–844 (Teil 2: 330–690), Landtag ab 756,
  Themenkarte „4 FRAGEN BLEIBEN“ y 1060–1160, Untertitelzeile 1184, Datum/Account 1244–1296 – alles im Video über dem Untertitel-Band; im PNG
  zusätzlich die Themenzeile 01–04 bei y 1344–1420. Schwerpunkt der Coverelemente ≈ y 920 (Bildmitte 960).
- Prüfbogen `FrankfurtErklaert76FragenTeil3-CoverVorschau` (lokal gerendert): 9:16 mit Zonen, 3:4-Ausschnitt, Profilraster, Videoframe 15 mit App-Elementen.
  Ergebnis: Serientitel, „76“, „TEIL 3“ und „4 FRAGEN BLEIBEN“ in allen Ansichten vollständig; im Profilraster sieht man zum Vergleich, dass bei
  Teil 2 und Teil 1 der Serientitel oben angeschnitten wird. Rote Karte auf 68 px verkleinert, damit sie die rechte Knopfleiste nicht berührt.

## 4. Visuelle Prüfung (lokal, geschätzte Timings, vor der Vertonung)

Korrigiert: Zahl „8.000–9.000“ umbrach in zwei Zeilen · Faktor-Plakette „≈ 4×“ überdeckte die Quellenzeile der Prognose · Stempel
„STRAFUNMÜNDIG“ überdeckte „TATVERDÄCHTIGE“ · Karte „KEINE STRAFE“ zu viel Text · Cover-Inhalt zunächst nur bis y 1272 (unten zu leer).

## 5. Läufe

- Lauf #29 (Hörprobe): zweimal > 8 min im apt-Schritt „FFmpeg installieren“ hängen geblieben, abgebrochen – noch vor jedem ElevenLabs-Aufruf
  (0 Credits). Workflow: apt jetzt mit Zeitlimit (4 min je Versuch, 3 Versuche) statt unbegrenzt.
