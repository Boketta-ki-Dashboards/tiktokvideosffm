# QA – „Gen-Z-Demo am 20.11. geändert!“ (Frankfurt erklärt #10)

Fassung: **`FrankfurtRed3_20November_DemoUpdate_ADAM_FINAL.mp4`** aus Lauf **#62** (18.11.2026). Stand im Video: **18.11.2026, 16:38 Uhr**
(t-online nach der Sicherheits-Pressekonferenz). Nicht automatisch veröffentlicht.

## 1. Prüfliste aus dem Auftrag

| # | Prüfpunkt | Ergebnis |
|---|---|---|
| 1 | Kein Verbot behauptet | ✅ Fazit „NICHT ABGESAGT – ABLAUF GEÄNDERT“, Ton „nicht abgesagt – sie läuft nur anders“; Caption „Ein Verbot gibt es nicht.“ |
| 2 | 4.000 nicht als tatsächliche Teilnehmerzahl | ✅ Ton „Erwartet werden bis zu 4.000 Leute – eine Prognose, keine Zählung“; Bild „BIS ZU 4.000 · ERWARTET · PROGNOSE · keine Zählung“. **Korrektur gegenüber dem Auftrag:** Stadt/Polizei sagen „erwartet“, nicht „angemeldet“ (`sources.md`, Abschnitt 3) |
| 3 | Nur belegte Pressekonferenz-Maßnahmen | ✅ über 2.000 statt 1.300 Kräfte, 49 Aufenthaltsverbote, 36 Meldeauflagen, Zeil-Kontrollen „bei Bedarf“ – alle aus der PM des Innenministeriums (18.11.); 2.150 Kontrollierte/78 Anzeigen/182 Platzverweise bewusst nicht verwendet |
| 4 | Kein gemeinsamer Veranstalter, keine finale Route | ✅ „GenZ regelt Bundesbewegung“ als **eigene Versammlung** (nicht die Kundgebung an der Werft); Start/Ziel laut Innenministerium, Verlauf gestrichelt + „Verlauf nicht veröffentlicht“; ursprüngliche Demo-Strecke nur SYMBOLISCH |
| 5 | Keine Krawall-Prognose | ✅ keine Einschätzung zum Verlauf; nur angekündigte Maßnahmen |
| 6 | Keine echten Personen, keine Livebilder | ✅ Pressekonferenz als Nachrichtengrafik mit drei leeren Pulten (ILLUSTRATION), keine nachgestellten Sprecher |
| 7 | Offizielles Logo, kein „S“ | ✅ `public/brand/frankfurtred-logo.webp` im Titelbild, Kopfzeile und Abo-Aufruf |
| 8 | Kopfzeile oben rechts, symmetrisch | ✅ Overlay y 272–342 rechts, `TopTag` links auf gleicher Linie (Overlay-Prüfbogen) |
| 9 | ≤ 60 s inkl. Intro und CTA | ✅ **58,112 s = 1.743 Frames** (Grenze 1.800) |
| 10 | Vorher/Nachher aufwendig, ohne erfundene Route | ✅ 2,5D-Abstraktstadt: Punkte-Zug läuft SYMBOLISCH, „DEMOZUG DURCH DIE STADT“ wird durchgestrichen, Punkte sammeln sich zum Ring an der Werft, Kamerafahrt; Hinweis „Symbolisch: Die ursprüngliche Strecke ist nicht veröffentlicht“ |
| 11 | Weseler Werft 2,5D mit großer 4.000 | ✅ perspektivische OSM-Karte (Main, Flößerbrücke mit Pylonen, EZB, Skyline), Werft-Fläche, Zeitkarte + Zitat Ordnungsdezernent, Zähler läuft bis 4.000 mit Akzent (softImpact + boom) |
| 12 | Auflagen + „Keine Hunde“ | ✅ fünf Stempel-Karten (Pyro · Alkohol/Glas · Hunde · Vermummung · Stangen max. 2 m) |

## 2. Recherche (Details in `sources.md`)

Letzter Abgleich 18.11.2026 abends: keine neuere Meldung als t-online 18.11., 16:38 Uhr. Dort bestätigt: Weseler Werft 14–16:30 Uhr, stationär,
Einigung der Stadt mit der Versammlungsleitung („in Abstimmung mit der Anmelderin“), bis zu 4.000 erwartet; Bundesbewegung Kaisersack →
Bockenheimer Depot, bis zu 1.500.

## 3. Stimme (Adam, Profil kurzformat-60, speed 1.20 – Werte unverändert)

- ElevenLabs-Störung „Increased latency and API errors“ (US, 18.11. ab 15:34 UTC): Läufe #55–#57 scheiterten schon an der Stimmabfrage – **0 Credits**.
  Kein Wechsel zu Chatterbox/Piper. Client seitdem mit Zeitgrenze pro Anfrage (GET 90 s, POST 180 s) und bis zu 7 Netzwerk-Wiederholungen.
- Lauf #58 Hörprobe (≈ 302 Credits) · Lauf #59 Vollvertonung (≈ 1.026 Credits) · Lauf #60 nur Satz v2 neu (≈ 136 Credits). Gesamt ≈ 1.464 Credits, keine Soundeffekte erzeugt.
- Begrüßung aus dem geprüften Cache (#06/#08/#09, gleicher Schlüssel `f50850868202c0738f23`, Whisper „Ey, war Frankfurt!“).
- Lautschrift: `{Gen-Z-Demo|Dschen Zett Demo}` wie in #06. v2 umgestellt auf „Darunter: „GenZ regelt Bundesbewegung“ – ein Zug …“, weil Whisper
  „Dedenzett regelt“ hörte; nach dem Doppelpunkt erkennt Whisper „Gen Z regelt“.
- Whisper (medium), ganze Spur: „Ey wa Frankfurt! Die JNZ-Demo am Freitag läuft jetzt ganz anders als geplant. Statt Demo-Zug durch die Stadt gibt's
  laut Stadt eine stationäre Kundgebung an der Weseler Werft. Von 14 bis halb fünf vor Einbruch der Dunkelheit. Erwartet werden bis zu 4.000 Leute.
  Eine Prognose, keine Zählung. Dazu gelten Auflagen. Keine Pyro, kein Alkohol, kein Glas, keine Hunde, keine Vermummung. Und Transparenzstangen.
  Höchstens zwei Meter. Neu seit heute. Laut Innenministerium sind es sogar fünf Versammlungen. […] Die Polizei plant mit über 2.000 Einsatzkräften.
  An Halloween waren es 1.300. Gegen 49 Personen laufen Aufenthaltsverbote. Gegen 36 tatverdächtige Meldeauflagen. Bei Bedarf werden alle Zugänge zur
  Zeil kontrolliert. Heißt, die Kundgebung ist nicht abgesagt. Sie läuft nur anders. Was haltet ihr von den Änderungen? Folgt Frankfurt. Rett drei
  für mehr.“ · v2 einzeln: „Darunter „Gen Z“ regelt Bundesbewegung, ein Zug ab 15 Uhr vom Hauptbahnhof nach Bockenheim bis zu 1500 erwartet.“ ✅
  („JNZ“ = Whispers Schreibweise für „Dschen Zett“, wie in #06; „Transparenzstangen“ klanggleich mit „Transparent-Stangen“.)
- Sprache 57,21 s; Pausen: längste 386 ms (`check-pauses` grün; Pause nach „keine Zählung.“ von 427 auf < 400 ms gekürzt, `pauseAfterMs` 120 → 40).

## 4. Visuelle Prüfung

Standbilder mit echten Adam-Zeiten (`--every 45`) und Kontaktbogen des fertigen MP4 (`kontaktbogen-run62.jpg`, alle 2 s). Korrigiert:
„MAIN“ lag in der Vorher/Nachher-Szene am Anfang auf der Quellenzeile und später am linken Bildrand → erscheint erst nach der Kamerafahrt, weiter rechts ·
„MAIN“ schaute in der Werft-Szene halb unter der 4.000-Karte hervor (Lauf #61) → blendet vor der Karte aus.
Zähler laufen vom Erscheinen bis zum gesprochenen Wert (4.000, 1.500); Wechsel 4 → 5 Versammlungen am Wort „fünf“; Stempel am Wort „abgesagt“.
Titelbild-Prüfbogen: Serientitel, „GEÄNDERT!“ und Themenkarte in allen vier Ansichten vollständig lesbar (9:16, 3:4, Profilraster neben #09/#08, Video + App).
Overlay-Prüfbogen: Kopfzeile unter der simulierten Suchleiste (Unterkante 238), Werft- und Pressekonferenz-Szene frei.

## 5. Finaler Render

Lauf #62 läuft (Werte folgen nach Prüfung des Artefakts).

## 6. Lauf-Historie

| Lauf | Auftrag | Ergebnis |
|---|---|---|
| #55, #56, #57 | Hörprobe | ✖ ElevenLabs-Störung (keine Antwort), 0 Credits |
| #58 | Hörprobe | ✅ |
| #59 | nur Stimme | ✅ (eine Pause 427 ms, v2 unklar) |
| #60 | nur Stimme (v2 neu) | ✅ |
| #61 | Video (`stimme: vorhanden`) | ✅ technisch grün; „MAIN“ halb unter der 4.000-Karte → ersetzt |
| #62 | Video (`stimme: vorhanden`) | läuft |
