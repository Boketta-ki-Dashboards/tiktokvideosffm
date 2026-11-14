# QA – Sondervideo „14.11. – doch eine Gen-Z-Demo in Frankfurt?“ (Frankfurt erklärt #06)

## 1. Faktenprüfung (Details und Wortlaute: `sources.md`)

| Aussage im Brief | Ergebnis |
|---|---|
| 14.11. zeitweise auf der Website genannt, dann entfernt (tagesschau, MDR) | **tagesschau** bestätigt wörtlich (01.11.: „am Sonntagvormittag kurzzeitig … der 14. November“, „konkrete Datum entfernt … "bald"“). Einen **MDR**-Bericht konnten wir nicht abrufen (mdr.de für unsere Werkzeuge gesperrt) → nur tagesschau zitiert. |
| Polizei-PM 13.11., Hauptwache 12:30–15:00, „Gen Z regelt“ zugerechnet, Aktionstag | bestätigt, wörtlich (Presseportal, 13.11., 14:32 Uhr) |
| Bockenheimer Warte 17–19 | bestätigt; Veranstalter von der Polizei **nicht** genannt → keine Zuordnung |
| Goetheplatz 16–19, 1.000 erwartet, Irankonflikt | bestätigt; 1.000 nur diesem Aufzug zugeordnet (Test) |
| mehr Kräfte als am 31.10., Unterstützung weiterer Präsidien, Achse Opernplatz–Hauptwache–Konstablerwache, Zugangskontrollen im Bedarfsfall, Absperrgitter, Kontrollen verdächtiger Gruppen | bestätigt, wörtlich |
| „keine konkreten Hinweise auf geplante Ausschreitungen“ | bestätigt (Stand der Mitteilung 13.11.) |
| 20.11.: GEW Hessen, Schulstreik, Jugend-/Bildungsproteste Frankfurt/Kassel | bestätigt (PM 12.11.): 10 Uhr Schulstreik Willy-Brandt-Platz, 14 Uhr Gen Z regelt (Ort offen), 17:30 Gewerkschaftsjugend Bockenheimer Depot |
| Verlauf/Teilnehmerzahl/Bilanz der Hauptwache-Kundgebung | **offen**: bis 14.11., 17:22 Uhr keine Polizeimeldung (Presseportal: nur 1422–1424 zu anderen Einsätzen) und kein Medienbericht → „bei Redaktionsschluss noch nicht“, im Bild „VERLAUF: NOCH KEINE POLIZEIBILANZ · Stand 14.11.2026, 17:15 Uhr“ |
| Zugangskontrollen tatsächlich aktiviert? | **nicht bestätigt** → nur „bei Bedarf“; FNP-Schlagzeile „sperrt alle Zugänge“ nicht übernommen |
| neu gefunden | Der 14.11. ist inzwischen doch ein Aktionstag der Initiative („Phase 2“, laut Polizei Frankfurt, dpa, taz, t-online) – das erklärt, warum trotz des entfernten Website-Datums heute Kundgebungen stattfinden. Im Video ergänzt. |

Schlussfrage: Statt „Wird Frankfurt heute ruhig bleiben?“ (Zukunftsfrage, die beim Ansehen am Abend/Folgetag überholt sein kann) die
zeitlich robuste Frage „Wie habt ihr den Tag erlebt?“.

## 2. Stimme (Adam, Profil kurzformat-60)

- Lauf #38 (Hörprobe, 231 Zeichen, 12,8 s): Whisper „Ewa Frankfurt … Hauptwache … Bockenheimer Warte … Goetheplatz zum Iran-Konflikt.
  Motto Phase 2, folgt Frankfurt Rett 3 …“; nur „Dschen-Zett-Kundgebung“ (mit Bindestrich) verschmolz zu „Ginzett“ → gesprochen jetzt getrennt
  „Dschen Zett Kundgebung/Demo“ (Anzeige bleibt „Gen-Z-Kundgebung/-Demo“; in Folge 3 erkannte Whisper „Dschen Zett regelt“ als „Gen Z regelt“).
- Lauf #39 (nur Stimme): 16 Sätze erzeugt und committet. Pausenprüfung: 418 ms (m2 → p1) und 409 ms (p3 → n1) > 400 → `pauseAfterMs` 120 → 60,
  offline aus dem Cache neu zusammengesetzt (0 Credits): **60,24 s**, längste Pause 358 ms ✅.
- Whisper (medium) über die ganze Spur: alle Sätze wortgetreu („Ey, war Frankfurt!“ = Eywa; „Gen Z“ als „J&Z“ = Dschen-Zett); am Ende
  halluziniert Whisper einen bekannten Abspanntext statt des Abo-Aufrufs → Abo-Aufruf einzeln transkribiert: „Wie habt Ihr den Tag erlebt?
  Folgt Frankfurt Red 3 für die nächsten Entwicklungen.“ ✅

## 3. Länge

- Informationsteil bis 58,08 s (Ziel 58–60 s, Grenze 61,5 s) ✅ · Abo-Aufruf 58,20–60,24 s · `tailMs` 1.100 → Video **61,33 s = 1.840 Frames**,
  Abo-Phase 3,1 s (Ziel 3–4 s) ✅ · gesamt ≤ 65 s ✅.
- Szenen: Titelbild 5,5 s · Website 14,0 s · Hauptwache 8,4 s · Karte 10,8 s · Polizei 13,5 s · 20.11. 6,2 s · Frage/Abo 4,8 s.

## 4. Visuelle Prüfung (lokal, echte Adam-Zeiten, alle 45 Frames)

Korrigiert: Kalenderkopf „NOVEMBER 2026“ brach um · Browser-Adressleiste wurde vom Illustrationshinweis verdeckt · Statuszeile verdeckte die
letzte Kalenderzeile · Chips „bald“ und „Jugendstreiktag“ verdeckten Kalendertage → „NEUE PROTESTE: „BALD““ und der Aktionstag-Stempel nutzen
jetzt die leere erste Kalenderzeile (Mo–Sa vor dem 1.11.) · Kartenkarten zu breit (Zeit + Art in einer Zeile) → untereinander · „≠ GEN-Z-DEMO“
lief in die Quellenzeile → als Stempel auf der Goetheplatz-Karte · dritte Polizei-Karte lief über · Quellenzeile auf der Hauptwache-Fassade
schwer lesbar → dunkles Band · 14/20-Kalender überlappten beim Wechsel → 20 fährt von rechts herein.

## 5. Titelbild

- `NOV14_COVER_LAYOUT`: Serientitel ab y 440, Kalenderblatt 572–908, Datum 930, rote Karte 1046 (50 px, rechte Kante ≈ 900), Unterzeile 1160,
  Account 1236–1290, im PNG Ortszeile 1344–1416 – kompakt um die Bildmitte, nichts am oberen Rand.
- Prüfbogen `FrankfurtErklaert14November-CoverVorschau` (lokal): Serientitel, Kalender, „14.11.2026“, „DOCH EINE GEN-Z-DEMO?“ und Unterzeile in
  9:16, 3:4, Profilraster (neben Teil 4/Teil 3) und Videoframe mit App-Elementen vollständig; rote Karte nach Verkleinerung (54 → 50 px) mit
  sichtbarem Abstand zur Knopfleiste.

## 6. Finaler Render

(wird nach dem Lauf ergänzt)
