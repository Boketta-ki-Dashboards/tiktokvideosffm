# Quellen – „Frankfurt erklärt in 60 Sekunden“ #02: 76 Fragen nach der Krawallnacht (Teil 1)

Komposition `FrankfurtErklaert76Fragen` · Video-ID `frankfurt-erklaert-76-fragen-landtag` · Format B (max. 60 s)
Abruf aller Quellen: **10.11.2026, 16:11 Uhr (MEZ)** – selbst heruntergeladen und gelesen (PDF-Text mit `pdftotext`).
Thema sind die **eingereichten Fragen** an die Landesregierung – keine Antworten, keine Beschlüsse.

## Originalquellen

| Quelle | Inhalt (geprüft) |
|---|---|
| [Tagesordnung Innenausschuss, 51. Sitzung][to] | „Dienstag, 10.11.2026, 20 Uhr“ · „Sitzungsraum 501 A - im Anschluss an die Plenarsitzung“ · TOP 1: Dringlicher Berichtsantrag BÜNDNIS 90/DIE GRÜNEN – Drucks. 21/5450 · TOP 2: Dringlicher Berichtsantrag Freie Demokraten – Drucks. 21/5459 · TOP 3: Verschiedenes. Ort: Hessischer Landtag, Wiesbaden (Druck/Auslieferung: Kanzlei des Hessischen Landtags, Wiesbaden). |
| [Drucksache 21/5450][d5450] | Dringlicher Berichtsantrag BÜNDNIS 90/DIE GRÜNEN „Polizeieinsatz rund um die Demonstrationen „GenZ regelt“ und anschließende Ausschreitungen in Frankfurt am Main“, 02.11.2026, **21 nummerierte Fragen** (1–10 Demonstration, 11–21 „Einsatz rund um die Ausschreitungen“). |
| [Drucksache 21/5459][d5459] | Dringlicher Berichtsantrag Fraktion der Freien Demokraten „Ausschreitungen am 31. Oktober 2026 in Frankfurt am Main – Gefahrenprognose, Polizeieinsatz, Strafverfolgung und Unterstützung der Geschädigten“, 02.11.2026, **55 nummerierte Fragen**: I. Erkenntnislage und Gefahrenprognose (1–8) · II. Vorbereitung und Verlauf des Polizeieinsatzes (1–18) · III. Straftaten, Tatverdächtige und Strafverfolgung (1–9) · IV. Umgang mit jungen und bereits bekannten Gewalttätern (1–9) · V. Information und Schutz des Einzelhandels (1–7) · VI. Schäden und Unterstützung der Betroffenen (1–4). |

**21 + 55 = 76** nummerierte Fragen (selbst gezählt; Test `tests/erklaert-76-fragen.test.ts`).

## Aussage → Beleg

| Sprechertext / Bild | Beleg (wörtlich aus den Drucksachen) |
|---|---|
| „Nach der Krawallnacht an Halloween landen 76 Fragen im Hessischen Landtag.“ / „76 – FRAGEN NACH DER KRAWALLNACHT“ | 21 Fragen (21/5450) + 55 Fragen (21/5459), beide auf der Tagesordnung des INA am 10.11.2026. |
| „Die Grünen und die FDP wollen wissen, was am 31. Oktober genau passiert ist.“ / Bild: zwei Drucksachen, 21 + 55 = 76, FDP-Abschnitte mit Fragenzahl | Titel und Einleitung beider Anträge (31. Oktober 2026, Frankfurt am Main). |
| 01 „Was wusste die Polizei vorher über mögliche Gewalttäter?“ / Akte „GEFAHRENPROGNOSE“ | 21/5459 I.1: „Welche Erkenntnisse lagen den Sicherheitsbehörden im Vorfeld der Versammlungen über gewaltbereite Personen und Gruppen vor?“ · I.3: „Wie wurden diese Erkenntnisse in der Gefahrenprognose und der Einsatzplanung berücksichtigt?“ (Abschnitt I „Erkenntnislage und Gefahrenprognose“). Als FRAGE dargestellt – keine Aussage, was bekannt war. |
| 02 „Warum konnten Geschäfte geplündert werden, obwohl ein Schutzkonzept angekündigt war?“ / „TROTZ SCHUTZKONZEPT?“ | 21/5459 V.6: „Welche Erkenntnisse liegen darüber vor, weshalb es trotz des angekündigten Schutzkonzepts zu Schäden und Plünderungen kommen konnte?“ · V.4 (angekündigter verstärkter Objektschutz) · II.16: „Wie wurde der Schutz der Zeil und der angrenzenden Einkaufsstraßen vorbereitet?“ · II.4 (verfügbare Einsatzkräfte je Phase). Bewusst „angekündigt“ (Wortlaut V.6). |
| 03 „Welche Rolle spielte TikTok – nur Demo-Aufrufe oder auch mögliche Absprachen zu Straftaten?“ / „DEMO-AUFRUFE | ABSPRACHEN ZU STRAFTATEN? – Gefragt – nicht belegt“ | 21/5459 I.8: „Welche Erkenntnisse bestehen über die Mobilisierung zu den Versammlungen und den späteren Ausschreitungen über soziale Netzwerke, insbesondere TikTok, sowie über eine gezielte Verabredung, Vorbereitung oder Koordinierung von Gewalttaten?“ Die Frage belegt keine Absprachen – im Bild „Gefragt – nicht belegt“; Feed als „Beispiel · fiktiv“, keine echten Posts, kein Logo. |
| 04 „Und was passiert mit den Tatverdächtigen, wie werden geschädigte Läden unterstützt, welche Konsequenzen folgen?“ / ERMITTLUNGEN · HILFE FÜR LÄDEN · KÜNFTIGE DEMOS | 21/5450 Nr. 20 (Ermittlungsverfahren), Nr. 21: „Welche Schlüsse und Konsequenzen zieht die Landesregierung aus dem Einsatz?“ · 21/5459 III.8 (Ermittlungsverfahren, U-Haft), VI.2 (Unterstützungsangebote), VI.4 (Härtefallhilfe geprüft?), IV.7 (Konsequenzen „für vergleichbare Versammlungslagen“). Kalender „20.11.“ nur als „Protesttag laut Veranstalter“ (Stand-Recherche `references/frankfurt-2026-11-20-ausblick/sources.md`, Ankündigung des Veranstalters) – **kein** Bezug auf ein Verbot; der Ausschuss berät Berichtsanträge. |
| „Heute Abend soll die Landesregierung im Innenausschuss in Wiesbaden berichten – angesetzt für 20 Uhr.“ / Karte „Dienstag, 10.11.2026 · INNENAUSSCHUSS · 51. Sitzung · 20:00 UHR – GEPLANT · im Anschluss an die Plenarsitzung · Sitzungsraum 501 A“ | Tagesordnung (s. o.). „Die Landesregierung wird ersucht, im Innenausschuss (INA) über folgenden Gegenstand zu berichten“ (beide Drucksachen). Zeitprüfung: Produktion 10.11.2026 ab 16:10 Uhr, geplante Veröffentlichung 17:30–18:15 Uhr → Sitzung liegt noch in der Zukunft („heute Abend“, „angesetzt“). |
| „Wichtig: Das sind bisher Fragen, noch keine Antworten.“ / „BISHER FRAGEN ≠ NOCH KEINE ANTWORTEN“, „Berichtsantrag = Bitte um Bericht – kein Verbotsantrag“ | Art der Anträge laut Titel: „Dringlicher Berichtsantrag“. Tagesordnung enthält keinen Verbotsantrag. |
| Outro „FOLGT FÜR TEIL 2 – WAS WURDE WIRKLICH BEANTWORTET?“ | Ankündigung einer Folge, keine Tatsachenbehauptung. |

## Bewusst NICHT verwendet

- **„rund 1.300 eingesetzte Polizeikräfte“ / „bis zu 1.500 gewaltbereite Störer“** (21/5459 I.6, II.5): Die FDP stellt genau deren zeitliche und
  räumliche Vergleichbarkeit in Frage → im 60-s-Video weggelassen, damit sie nicht als gleichzeitig anwesende Gruppen erscheinen.
- **„rund 80 gewaltbereite Linksextremisten“** (I.4), **Herkunft/Migrationshintergrund** (III.4–III.6): sensible Einzelangaben aus den Fragen, ohne
  Antwort der Landesregierung nicht einordbar → nicht verwendet.
- Aussagen wie „Die Polizei hat versagt“, „TikTok hat die Gewalt organisiert“, „Heute wird der 20. November verboten“, „Maßnahmen werden beschlossen“ –
  nicht belegt; Test prüft, dass sie nicht vorkommen.
- Ergebnisse der Sitzung – liegen erst nach der Sitzung vor (Teil 2, siehe `teil2-notiz.md`).

## Quellenliste

- [to]: https://hessischer-landtag.de/termine/innenausschuss-51-sitzung
- [d5450]: https://starweb.hessen.de/cache/DRS/21/0/05450.pdf
- [d5459]: https://starweb.hessen.de/cache/DRS/21/9/05459.pdf

[to]: https://hessischer-landtag.de/termine/innenausschuss-51-sitzung
[d5450]: https://starweb.hessen.de/cache/DRS/21/0/05450.pdf
[d5459]: https://starweb.hessen.de/cache/DRS/21/9/05459.pdf
