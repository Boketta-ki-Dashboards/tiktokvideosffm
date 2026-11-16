# QA – „Nur 13 Demonstranten? – Warum war bei der Gen-Z-Demo kaum jemand?“ (Frankfurt erklärt #08)

## 1. Faktenprüfung (Details und Wortlaute: `sources.md`, Abruf 16.11.2026)

| Prüfpunkt (Auftrag) | Ergebnis |
|---|---|
| 1. Rund 13 Demonstrierende über beide Kundgebungen? | ✅ FNP: „Ganze 13 Demonstranten waren auf den beiden Protestveranstaltungen.“ – Beobachtung des Reporters, keine amtliche Zählung (im Bild BERICHT / LAUT FNP) |
| 2. Aufteilung rund 10 + 3? | ✅ FNP: Hauptwache „insgesamt rund zehn Demonstranten“, Bockenheimer Warte „Drei von ihnen, nach persönlicher Ansprache identifiziert“; Passanten (≈ 20) nicht mitgezählt |
| 3. 16 Mannschaftswagen richtig zugeordnet? | ✅ „laut Frankfurter Neuer Presse“; FNP: „16 Mannschaftswagen standen vor der Mattäuskirche“ → Matthäuskirche, Friedrich-Ebert-Anlage 33 (OSM), ≈ 1,5 km von der Hauptwache |
| 4. Fahrzeuge nicht direkt vor den Demonstrierenden? | ✅ eigene graue Kartenmarke „BEREITSTELLUNG“, Hinweis „Bereitstellungsort ≠ Kundgebungsort“; Titelbild zeigt die Wagen als Reihe „in Bereitschaft“ ohne Demonstrierende davor |
| 5. Fehlender Anmelder korrekt zugeschrieben? | ✅ „laut Polizei“ / „Anmelder laut Polizeisprecher nicht erschienen“ (Polizeisprecher laut FNP) |
| 6. Teilnehmeraussage zum 20.11. eingeordnet? | ✅ „Ein Teilnehmer sagte der Zeitung …“; im Bild AUSSAGE, „Teilnehmer (19) laut FNP“, ohne Namen; Zitat wörtlich („sollte nur … hinweisen“) |
| 7. Datumsverwirrung nicht als Ursache ausgegeben? | ✅ „Ob das Hin und Her Leute ferngehalten hat, ist nicht belegt.“ + „MÖGLICHE ERKLÄRUNG – NICHT BEWIESEN“; keine Kausalsätze (Test) |
| 8. Polizeivorbereitung sachlich? | ✅ PM 13.11. (mehr Kräfte als am 31.10., Absperrgitter, Zugangskontrollen nur im Bedarfsfall) vs. Verlauf laut FNP; „Planung vorab nach möglichem Risiko“; keine Wertung („unnötig“, „absurd“ nur in der Caption als Zitat) |
| 9. Keine erfundenen Teilnehmerzahlen? | ✅ nur 13 / rund 10 / 3 (FNP), 8.000 (Polizei 31.10., nur Größenordnung); keine Prognose für den 20.11., keine Gesamtzahl an Beamten |
| Abweichung Uhrzeit | Polizei: 12:30–15:00 Uhr angemeldet; FNP: „Um 13 Uhr … angesagt“ → im Bild das Polizei-Zeitfenster |
| Neuere amtliche Angaben? | keine Polizeimeldung zum Verlauf bis 16.11., 13:42 Uhr (Presseportal geprüft) |

## 2. Stimme (Adam, Profil kurzformat-60)

- Lauf #45 (Hörprobe, 323 Zeichen): „16 Mannschaftswagen … 13 Leute … Bockenheimer Warte … nicht mal der Anmelder … Folgt Frankfurt Red 3 für mehr“
  korrekt; Begrüßung klang wie „Ava“, „zwei Dschen Zett Kundgebungen“ wie „zweitigen …“ → Begrüßung aus geprüftem Cache, Satz umgestellt.
- Lauf #46 (Vollvertonung): alle Sätze wortgetreu, nur „Kundgebungen der Dschen Zett“ → „Ginzette“.
- Lauf #47 (nur hook3 neu): „Aber zu zwei Kundgebungen von Gen Z-Regel[t] kamen zusammen gerade mal 13 Leute.“ ✅
- Pausen: zwei Stellen (415/406 ms) über `pauseAfterMs` 120 → 60 offline aus dem Cache gekürzt (0 Credits); längste Pause 391 ms ✅.
- Whisper (medium) Gesamttext: „Ey wa Frankfurt! Am Samstag standen laut Frankfurter Neuer Presse 16 Mannschaftswagen bereit … An der Hauptwache waren es
  rund zehn. Gegen 14 Uhr war schon Schluss … Was meint ihr? Terminkaos oder nur 'ne kleine Werbeaktion?“ · Ende einzeln: „… Folgt Frankfurt Red 3 für mehr.“ ✅
- ElevenLabs-Verbrauch: Hörprobe 323 + Vollvertonung ≈ 1.065 (Begrüßung aus dem Cache) + Nachvertonung ≈ 90 Zeichen ≈ 1.480 Zeichen; keine Soundeffekte erzeugt.

## 3. Länge

Sprache 0,12–58,43 s (Informationsteil bis 56,24 s, Abo-Aufruf 56,30–58,43 s) + 1,6 s Ausklang → **60,00 s = 1.800 Frames** (Ausnahme ≤ 64 s) ✅ ·
Abo-Phase 3,7 s. Szenen: Titelbild 5,0 · 16/13 4,8 · Karte 14,0 · Kalender 16,8 · Zeil 8,6 · 20.11. 8,6 · Abo 4,0 s.

## 4. Visuelle Prüfung (lokal, echte Adam-Zeiten, alle 45 bzw. 60 Frames)

Korrigiert: Wagenreihe kollidierte mit dem Serientitel → hinter den unteren Teil der „13“ verlegt · „?!“ ragte aus der roten Karte → 44 px ·
Unterzeile „16 MANNSCHAFTSWAGEN …“ reichte an den Profil-Knopf → 27 px · Bockenheimer Warte lag im alten Kartenausschnitt am Rand (Maske) →
neuer OSM-Ausschnitt `frankfurt-innenstadt-nordwest.json` · Bereitstellungs-Marke am Bildrand abgeschnitten → Kamera-Übersicht neu (alle drei
Orte sichtbar), Marke danach ausgeblendet · Figuren zu klein → größer · Absperrgitter im dunklen Vordergrund unsichtbar → weiter hinten ·
Stempel „ZEIL BLIEB RUHIG“ erst kurz vor dem Schnitt → ab „Zeil“ · Website-Karte berührte die Überschrift → tiefer.

## 5. Titelbild

- `DEMO13_COVER_LAYOUT`: Serientitel ab y 410, „13“ 524–860 (330 px, größte Zahl), Wagenreihe 700–860, rote Karte 890 (44 px), Unterzeile 980
  (27 px), kleine Zeile 1036, Logo + Account 1236–1290, im PNG Frage „WARUM KAM KAUM JEMAND?“ 1340–1420.
- Prüfbogen `FrankfurtErklaert13Demonstranten-CoverVorschau` (lokal): 9:16, 3:4, Profilraster (neben Phase 2 und 14.11., Profilbild = offizielles
  Logo), Videoframe mit App-Elementen – „13“, „NUR 13 DEMONSTRANTEN?!“ und Unterzeile vollständig lesbar.

## 6. Finaler Render

(folgt nach dem Workflow-Lauf)
