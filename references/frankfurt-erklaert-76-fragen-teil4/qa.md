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

Lauf **#37** (Run-ID 43269843173, Commit ab52ae7, `stimme: vorhanden` – kein ElevenLabs-Aufruf) – **erfolgreich**.
Artefakte: `FrankfurtRed3_76Fragen_Teil4_ADAM_FINAL-run37` (MP4, Thumbnail, Titelbild-Prüfbogen, ID 13968696552),
`…-Technikbericht-run37` (ID 13968566653), `…-Sprecher-Adam-run37` (ID 13968566657).
(Lauf #36 hatte dieselbe Spur bereits einmal mit dem älteren Layout gerendert – Zwischenstand, nicht zur Veröffentlichung.)

Nachprüfung am heruntergeladenen Artefakt (12.11.2026):

| Prüfung | Ergebnis |
|---|---|
| Datei | `FrankfurtRed3_76Fragen_Teil4_ADAM_FINAL.mp4`, 19,47 MB, SHA-256 `b9a0bc520baf4bb8674032b281d498cbecf218ce64d33066f2673a4bf6560fc9` |
| Länge | 62,848 s · 1.885 Frames (Ausnahme-Grenze 66 s = 1.980 Frames) ✅ · Informationsteil bis 59,38 s, Abo-Phase 3,35 s |
| Video | H.264 High, 1080 × 1920 (echte Pixel), 30/1 fps konstant, yuv420p, BT.709, Faststart ✅ |
| Audio | AAC LC 48 kHz Stereo ≈ 189 kbit/s ✅ |
| Lautheit | −14,5 LUFS integriert · LRA 2,2 LU · True Peak **−1,4 dBTP** – Sprecherspur selbst −1,5 dBTP; die 0,1 dB entstehen im Mix, wo Effekte auf der Stimme liegen (≈ 9,5 s Aufprall bei „30“, ≈ 37 s Schnitt zu Antwort 3). Unhörbar, Prüfbericht bestanden (Teil 1 lag bei −1,1 dBTP). |
| Dekodierung | `ffmpeg -f null` ohne Fehler ✅ |
| Stille im MP4 | keine Stelle ≥ 400 ms unter −45 dB ✅ (Sprecherspur: längste Pause 371 ms) |
| Sync | `check-sync` und `check-pauses` im Workflow grün |
| Thumbnail | `FrankfurtRed3_76Fragen_Teil4_THUMBNAIL.png` 1080 × 1920, byte-gleich mit dem Cover-Still |
| Titelbild-Prüfbogen | `FrankfurtRed3_76Fragen_Teil4_COVER_VORSCHAU.png` 2420 × 1240 (verkleinert: `cover-vorschau-run37.jpg`): Serientitel, 76, TEIL 4 und „4 WEITERE ANTWORTEN“ in 9:16, 3:4, Profilraster und Videoframe vollständig; rote Karte frei von der App-Knopfleiste; Beschreibungszeile mit Teil-4-Titel |
| Prüfbericht | `render.mjs --max`, `tech-report.mjs --max-seconds 66`: **BESTANDEN** |

Kontaktbogen des fertigen MP4 (alle 2 s, 32 Bilder): `kontaktbogen-run37.jpg` – Frame 0 = vollständiges Titelbild, ab „Nach den ersten“
werden aus der 76 die vier Antwort-Kacheln; Karte mit Schilden ab Szenenbeginn, Brennpunkte ab „überall“, Zähler „bis zu 30“, Gründe,
Verlagerungsbogen, „Erklärung ≠ Bewertung“; Anfangsbilanz 17/5 (OFFIZIELL) → 35/6 (BERICHT, Zahlen rollen hoch) + „sechsstellig“;
Waffengeschäft (Illustration) → Schreckschusswaffen/SICHERGESTELLT → 18 · Untersuchungshaft; 110 → 53 → 73 je an ihrer Zahl, VERDÄCHTIG ≠
VERURTEILT; Zusammenfassung, Abo-Aufruf mit Haken.
