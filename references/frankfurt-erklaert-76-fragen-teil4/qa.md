# QA – „Frankfurt erklärt in 60 Sekunden“ #05: 76 Fragen – Teil 4 (4 weitere Antworten)

## 1. Faktenprüfung (Details: `sources.md`)

| Vorgabe | Ergebnis |
|---|---|
| bis zu 30 Einsatzorte, Gassen/Innenhöfe, viele Randalierer, Verlagerung | belegt (Polizei/Innenministerium 1.11. über hessenschau; Ticker 23:27) |
| 17 beschädigt / 5 geplündert (Anfangsbilanz) | belegt (Innenministerium 2.11.; Polizei 1.11.) |
| 35 / 6 / sechsstellig „laut Wiesbadener Kurier“ | **nicht selbst prüfbar** (Bezahlinhalt); nur als BERICHT mit Urheber, Wortlaut wie vorgegeben |
| Waffen „nicht schussfähig“, „vollständig sichergestellt“ | **nicht belegt** → ersetzt durch „Schreckschusswaffen sichergestellt“ (Polizei 1.11.) |
| 18-Jähriger U-Haft | belegt (Justizministerium 2./3.11.; laut Polizei am 9.11. weiterhin) – „keine Verurteilung“ im Ton und im Bild |
| 110 Strafanzeigen | belegt über zwei Medienanfragen (Polizeipräsidium bzw. Innenministerium) |
| 160 Durchsuchungen | **nicht belegt** → weggelassen |
| 53 Festnahmen | belegt (Polizei via dpa 9.11.) |
| 73 Tatverdächtige | belegt (Innenminister 10.11.) – „verdächtig heißt nicht verurteilt“ |
| keine Rechtfertigung/Bewertung des Einsatzes | „Das erklärt die schwierige Lage – ob alles richtig lief, beantwortet es aber nicht.“ + ERKLÄRUNG ≠ BEWERTUNG |

## 2. Stimme (Adam)

- Lauf #35 (Hörprobe): „FrankfurtRed3“ klang wie „Frankfurt rät 3“ → gesprochen „Frankfurt Rett Drei“ (Anzeige bleibt „FrankfurtRed3“).
- Lauf #36 (Run-ID 43266634209): 17 Sätze erzeugt und committet (Commit bfb01cf), Spur 61,35 s.
- `check-pauses`: alle Pausen ≤ 371 ms (Grenze 400) ✅
- Whisper (medium) über die ganze Spur: alle Sätze wortgetreu („Ey war Frankfurt!“ = Eywa-Gleitlaut; „Posek“ = Poseck). Der letzte Satz
  wurde in der Gesamttranskription verkürzt („Red 3 für mehr.“); einzeln transkribiert (59,3–61,5 s): **„folgt Frankfurt Red 3 für mehr.“** ✅
- Informationsteil endet bei 59,38 s (Vorgabe 58–61 s, Grenze 61,5 s) ✅; Abo-Aufruf 59,50–61,35 s.

## 3. Länge

- Brief: Info 58–61 s, Abo-Aufruf 3–4 s, gesamt ≈ 62–65 s. Mit Nachlauf 400 ms wären es 61,75 s (Abo-Phase 2,25 s) gewesen → `tailMs` 1.500:
  **62,83 s = 1.885 Frames**, Abo-Phase 3,35 s, Knopf pulsiert bis zum Ende (kein Standbild). Keine neue Vertonung nötig.
- Antwort 1 = 18,2 s (längster Abschnitt, Vorgabe ≈ 18–20 s), Schaden 14,5 s, Waffen 11,3 s, Ermittlungen 9,9 s.

## 4. Visuelle Prüfung (lokal, echte Adam-Zeiten, alle 45 Frames)

Korrigiert:
- Karte Antwort 1: Zähler „bis zu 30“ überdeckte die Überschrift → unter die Überschrift (y 486); Gründe-Chips kollidierten mit Legende und
  Quellenzeile → kompakter, höher (y 912); Legende einzeilig; „Erklärung ≠ Bewertung“ höher (y 880), Legende blendet dabei aus.
- Karte Antwort 1 wirkte vor „30“ ≈ 5,7 s leer (nur Straßen) → Schilde der Einsatzkräfte ab Frame 4 gebündelt sichtbar, Brennpunkte leuchten
  ab „überall“ nacheinander auf; Legende nennt Schilde/Linien „symbolisch“.
- Ladenfront Waffengeschäft zeigte Trikots (Motiv „sports“) → neues neutrales Motiv „boxes“ (Kartons in Regalen) in `Storefront`
  (bestehende Motive unverändert, ältere Folgen rendern identisch); Hinweis „Berliner Straße · Name nicht genannt“ überlagerte das Ladenschild
  → unter das Schaufenster.
- Ermittlungen: „nicht dieselben Personen“ war nicht belegt (Festgenommene können auch Tatverdächtige sein) → „verschiedene Zählungen – nicht
  einfach addieren“.

## 5. Titelbild

- `TEIL4_COVER_LAYOUT`: Serientitel ab y 446 (Teil 3: 420), große 76 y 548–854, Landtag ab 790, „76 FRAGEN –“ 1006, rote Karte 1072,
  Unterzeile 1192, Account 1250–1300 (im Video über dem Untertitel-Band), Antwortzeile 01–04 nur im PNG (1346–1420).
- Prüfbogen `FrankfurtErklaert76FragenTeil4-CoverVorschau` (lokal): Die rote Karte reichte zunächst bis x ≈ 980 und berührte im Videoframe die
  App-Knopfleiste → Schrift 62 → 53 px, rechte Kante ≈ 907 (< 930, Test). Die App-Ansicht zeigte noch den Teil-3-Titel → `CoverPreviewSheet`
  hat jetzt eine `caption`-Eigenschaft (Standard = Teil-3-Text, der Teil-3-Bogen bleibt gleich). Ergebnis: Serientitel, 76, TEIL 4 und
  „4 WEITERE ANTWORTEN“ in 9:16, 3:4, Profilraster und Videoframe vollständig lesbar.

## 6. Finaler Render

(wird nach dem Lauf ergänzt)
