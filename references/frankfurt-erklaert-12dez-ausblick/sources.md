# Quellen – „Nach dem 20. November: Schon die nächste Demo geplant?“ (Format B #16)

Komposition `FrankfurtErklaert12DezemberAusblick` · produziert 22.11.2026 · Thema: nächster bundesweiter Protesttag von „Gen Z regelt“ am
Samstag, 12.12.2026, und was davon für Frankfurt feststeht.

**Letzter Faktencheck: 22.11.2026, 17:54 Uhr** (MEZ) – Website, Zusagen-Zähler, Mitmachen- und Förderpool-Seite erneut abgerufen,
Städteliste mit `data/staedte.json` verglichen (73 = 73, namensgleich), Polizei Frankfurt (presseportal) und Innenministerium ohne Meldung
zum 12.12., hessenschau-Bericht vom 21.11. unverändert („Stand: 21.11.26, 12:17 Uhr“). Stand im Bild: `content.ts → STAND`, nicht im Ton.

## Grundsätze dieser Folge

- **Stufen getrennt** (CLAUDE.md, Terminmeldungen): Ankündigung (Veranstalter-Website) ✓ · Anmeldung (öffentlich nicht bekannt) ? ·
  behördliche Entscheidung/Mitteilung (Stadt, Polizei, Innenministerium: keine) ? – im Ton (f3, f4) und im Bild (drei Stufen).
- **Keine erfundene Uhrzeit, kein Treffpunkt, keine Route**: auf der Website steht für alle 73 Städte „Standort folgt“ und
  „Samstag, 12.12., Uhrzeit folgt“. Die Karte zeigt die Lage der Städte, nicht Treffpunkte.
- **Keine Spaltung behaupten**: nur „unterschiedliche Planungen von Ortsgruppe und Bundesinitiative“ am 20.11.; im Bild „keine Aussage über
  eine dauerhafte Trennung“. Kein „gespalten“, kein „aufgelöst“ (Test).
- **Online-Zusagen ≠ Teilnehmende** – mit dem Wortlaut der Website; der Zählerstand nur als Momentaufnahme mit Uhrzeit.
- **Keine Prognose, kein Aufruf, keine Werbung**: Die Schlussfrage bleibt offen; der Vergleich zeigt 20.11. (Polizeischätzung) | 12.12. (offen).
  Kein „kommt alle“, keine Links zu Tickets/Telegram, Forderungen der Initiative nicht wiedergegeben.
- Rückblick auf den 20.11. nur ≈ 9 s (r1, r2), ohne frühere Folgen nachzuerzählen.

## Quellen

| Kürzel | Quelle | URL | Stand beim Abruf |
|---|---|---|---|
| GZ | Website „Gen Z regelt“, Startseite (Seitentitel „Gen Z regelt – Generation Z steht auf: Protest am 12.12. in 73 Städten“) | https://genz-regelt.de/ | 22.11.2026, 17:26 und 17:54 Uhr |
| GZ-API | Zusagen-Zähler der Website (Schnittstelle `api/counts`, Feld `total`) | https://genz-regelt.de/api/counts | 794 um 17:26 Uhr, **814 um 17:54 Uhr** (Rohdaten: `zusagen-zaehler-2026-11-22-1726.json`, `…-1754.json`) |
| GZ-M | Website „Gen Z regelt“, Seite „Mitmachen“ | https://genz-regelt.de/mitmachen.html | 22.11.2026, 17:54 Uhr |
| GZ-F | Website „Gen Z regelt“, Seite „Förderpool“ | https://genz-regelt.de/foerderpool.html | 22.11.2026, 17:54 Uhr |
| HS | hessenschau, „Ruhige Nacht nach verregneten Gen-Z-Protesten in Hessen“ | https://www.hessenschau.de/gesellschaft/ruhige-nacht-nach-verregneten-gen-z-protesten-in-hessen-v11,genz-demos-freitag-100.html | „Stand: 21.11.26, 12:17 Uhr“ (am 22.11., 17:54 Uhr unverändert) |
| TO | t-online Frankfurt, Newsblog „Gen Z regelt“-Demo (Planungen 20.11.) | https://frankfurt.t-online.de/region/frankfurt-am-main/id_101536286/-gen-z-regelt-demo-frankfurt-im-newsblog-regen-und-wenig-teilnehmer.html | „Aktualisiert am 20.11.2026 - 18:40 Uhr“ (Belege in `references/frankfurt-erklaert-20nov-vorbilanz/sources.md`) |
| FFM-TO | t-online Frankfurt, „Mehrere Festnahmen in der Nacht – Bilanz“ (Polizeiangaben) | https://frankfurt.t-online.de/region/frankfurt-am-main/id_101536286/gen-z-demo-in-frankfurt-mehrere-festnahmen-in-der-nacht-bilanz.html | „Aktualisiert am 21.11.2026, 11:22 Uhr“ (Belege in `references/frankfurt-erklaert-20nov-staedte/sources.md`) |
| ZDF | ZDFheute-Liveblog „Gen-Z-Demos enden weitgehend friedlich“ (Polizeiangaben Frankfurt) | https://www.zdfheute.de/politik/deutschland/gen-z-proteste-schulpolitik-militaerdienst-liveblog-100.html | 20./21.11.2026 (Beleg in `references/frankfurt-erklaert-20nov-staedte/sources.md`) |
| PP | Polizeipräsidium Frankfurt am Main, presseportal | https://www.presseportal.de/blaulicht/nr/4970 | 22.11.2026, 17:54 Uhr: jüngste Meldungen 1456/1457 (22.11., 11:27/11:28 Uhr, andere Themen) – **nichts zum 12.12.** |
| IM | Hessisches Innenministerium, Presse | https://innen.hessen.de/presse | 22.11.2026, 17:54 Uhr – **nichts zum 12.12.** |
| STADT | Stadt Frankfurt (frankfurt.de) | https://frankfurt.de/ | mit Skript nicht abrufbar (HTTP 403); in Medien keine Stadt-Mitteilung zum 12.12. gefunden → im Video „von Stadt oder Polizei gibt es dazu noch nichts“ |

## Wortlaute (wörtlich übernommen)

- GZ: „Samstag, 12. Dezember 2026“ · „in 73 Städten“
- GZ: „Unsere 4 Städte“ · „Hier organisiert Gen Z regelt Inhalte und Ablauf.“ – Liste: Berlin, Frankfurt am Main, München, Köln
- GZ: „Orange: Städte, die wir als GenZ hauptverantwortlich betreuen.“ · „Weiß: Städte, die sich der Initiative Gen Z regelt angeschlossen haben (wir sind nicht für Inhalt und Organisation zuständig)“
- GZ, Eintrag Frankfurt am Main: „Standort folgt“ · „Samstag, 12.12., Uhrzeit folgt“
- GZ: „Die Zahl zeigt, wie viele zugesagt haben. Sie ist keine Garantie, dass genau so viele Menschen vor Ort teilnehmen.“
- GZ-M: „In 73 Städten gehen wir auf die Straße, und überall brauchen wir mehr Leute, die mit anpacken: als Helfer*in, als Ordner*in oder fest im Team.“
- GZ-M: „Ordner*innen sorgen dafür, dass der Protest sicher und friedlich bleibt.“
- GZ-M: „Sie tragen eine weiße Armbinde mit der Aufschrift „Ordner“, achten auf die Teilnehmenden und holen bei Problemen Hilfe. Sie haben keine Befugnisse wie die Polizei. Ordner*innen müssen mindestens 18 Jahre alt sein.“
- GZ-M: „Du willst regelmäßig mitarbeiten, auch über den 12. Dezember hinaus? Dann komm ins Team von Gen Z regelt.“
- GZ-F: „Das Geld im Pool stammt nur aus unserer GoFundMe-Sammlung.“
- GZ-F: „Unsere Proteste sind laut, radikal ehrlich, aber immer gewaltfrei, demokratisch und diskriminierungsfrei. Wer bei uns mitmacht, unterschreibt das.“
- GZ-F: „Ihr stellt euren Bedarf für Bühne, Technik oder Flyer vor. Das Plenum stimmt ab, es braucht eine 2/3-Mehrheit“
- HS: „Deutlich weniger Menschen als angekündigt sind zu den Gen-Z-Protesten gegen Wehrpflicht und Sozialkürzungen gekommen.“
- HS: „Befürchtete Krawalle und Plünderungen blieben aus.“
- HS: „Laut Innenministerium waren 2.900 Polizisten und Polizistinnen im Einsatz.“
- HS: „Wie das Innenministerium am Samstag mitteilte, wurden zehn Personen in Frankfurt festgenommen, zwei von ihnen kamen in Gewahrsam.“
- HS: „Insgesamt wurden laut Innenministerium 342 Menschen in Frankfurt kontrolliert, 16 Strafanzeigen gefertigt und 13 Ordnungswidrigkeiten festgestellt.“
- HS: „An den anderen vier Frankfurter Demonstrationen zuvor, die von der "Gen Z regelt"-Bundesbewegung und anderen Initiativen organisiert waren, beteiligten sich insgesamt nach Schätzungen der Polizei etwa 1.700 Menschen. Der Zulauf war damit geringer als erwartet.“
- HS: „Auf Instagram wurde aufgerufen, zum Hauptbahnhof statt wie geplant zur Weseler Werft zu kommen. Vom Bahnhofsviertel startete schließlich ein Demonstrationszug der Bundesinitiative zum Bockenheimer Depot.“
- HS: „Sie hatte deshalb eine stationäre Kundgebung am Mainufer an der Weseler Werft geplant.“
- ZDF (Polizeiangaben): „Nach Angaben der Polizei sind die Gen-Z-Proteste in Frankfurt weitgehend friedlich verlaufen.“

## Satz → Beleg

| Segment | Gesprochen (Anzeige) | Beleg |
|---|---|---|
| hook2 | „Nach dem 20. November ist schon die nächste Demo geplant!“ | GZ (Termin 12.12. angekündigt). „geplant“ = Planung des Veranstalters, nicht Anmeldung. |
| r1 | „Der 20. lief hier weitgehend friedlich, aber mit deutlich weniger Leuten als angekündigt.“ | ZDF (Polizei: „weitgehend friedlich“), FFM-TO, HS („Deutlich weniger Menschen als angekündigt“, „Befürchtete Krawalle … blieben aus“). Bild: ≈ 1.700 laut Polizei (vier Demos zusammen, HS), 2.900 Kräfte, 10 Festnahmen, 342 Kontrollen (Innenministerium laut HS). |
| r2 | „Dazu kamen unterschiedliche Planungen von Ortsgruppe und Bundesinitiative.“ | HS (Weseler Werft stationär vs. Demozug der Bundesinitiative ab Bahnhofsviertel), TO. **Nicht** „Spaltung“ – HS zitiert die Ortsgruppe mit „Zerwürfnis“; das übernehmen wir nicht als Tatsache. |
| n1 | „Trotzdem geht es weiter – Gen Z regelt kündigt den nächsten bundesweiten Protesttag an: Samstag, der 12. Dezember.“ | GZ („Samstag, 12. Dezember 2026“, „Bundesweiter Protest“). Stufe: ANKÜNDIGUNG. |
| n2 | „Die Website nennt 73 Städte – dieselbe Liste wie beim letzten Mal.“ | GZ (73 Einträge); Vergleich mit der Liste vom 19.11.2026 (`frankfurt-erklaert-20nov-bundesweit/data/staedte.json`): namensgleich (nur „Frankfurt“ → „Frankfurt am Main“, „Halle“ → „Halle (Saale)“). |
| f1 | „Frankfurt gehört wieder zu den vier Städten, in denen die Initiative selbst organisiert – neben Berlin, München und Köln.“ | GZ („Unsere 4 Städte – Hier organisiert Gen Z regelt Inhalte und Ablauf.“); „wieder“: auch am 20.11. zentral (#12). |
| f2 | „Treffpunkt und Uhrzeit stehen aber noch nicht fest – auf der Website steht nur: folgt.“ | GZ („Standort folgt“, „Uhrzeit folgt“). |
| f3 | „Und: Das ist eine Veranstalter-Ankündigung – von Stadt oder Polizei gibt es dazu noch nichts.“ | PP, IM (nichts zum 12.12.), STADT (keine Mitteilung gefunden). Stand im Bild. |
| f4 | „Ob die Demo angemeldet ist, ist öffentlich nicht bekannt.“ | Keine öffentliche Angabe (GZ, PP, IM, Medien). Bild: „Fehlende Mitteilung heißt nicht, dass nichts angemeldet ist“. |
| m1 | „Neu: Die Initiative sucht Helfer – und Ordner, die für einen friedlichen Ablauf sorgen sollen.“ | GZ-M (Helfer*innen, Ordner*innen „sicher und friedlich“, Team). Ursprüngliche Fassung „Helfer und Ordner – die sollen dafür sorgen …“ wurde präzisiert, weil laut Website nur die Ordner diese Aufgabe haben. |
| m2 | „Und lokale Gruppen können Geld aus einem Förderpool beantragen.“ | GZ-F (Geld aus der GoFundMe-Sammlung, Konsens gewaltfrei/demokratisch/diskriminierungsfrei, Plenum mit 2/3-Mehrheit). |
| z1 | „Wichtig: Online-Zusagen sind keine Teilnehmerzahlen, schreibt die Initiative selbst.“ | GZ („Sie ist keine Garantie, dass genau so viele Menschen vor Ort teilnehmen.“). Zähler im Bild: 814 (Stand 22.11., 17:54 Uhr). |
| q1 | „Bleibt die Frage: Kommen am 12. Dezember wieder mehr Menschen?“ | Offene Frage, keine Prognose. Bild: 20.11. ≈ 1.700 laut Polizei (vier Demos zusammen) | 12.12. OFFEN. |
| cta | „Folgt FrankfurtRed3 für mehr!“ | Abo-Aufruf aus dem Cache (#11). |

## Bewusst NICHT verwendet

- **„Treffpunkt Hauptbahnhof / Kaiserstraße“ für Frankfurt am 12.12.** (im Auftrag genannt, „erneut prüfen“): steht weder auf der Website
  (dort „Standort folgt“) noch in einer Behörden- oder Medienmeldung → nicht verwendet, kein Treffpunkt im Bild.
- **Uhrzeit, Route, erwartete Teilnehmerzahl für den 12.12.**: nirgends veröffentlicht.
- **„Die Bewegung hat sich gespalten“ / „Ortsgruppe aufgelöst“**: nicht belegt. HS zitiert die Ortsgruppe mit „Zerwürfnis“ und einen Sprecher
  („jetzt stehen wir hier allein“) – Schilderung einer Seite vom 20.11., keine Aussage über die Zukunft; eine neue Stellungnahme der Ortsgruppe
  nach dem 20.11. haben wir nicht gefunden.
- **Zählerstand als Teilnehmerprognose** und der Website-Satz „Wie viele schaffen wir dieses Mal?“: Werbetext, nicht übernommen.
- **„Letztes Mal viele Zusagen“-Vergleich** (≈ 20.000 Online-Zusagen am 19.11., #12) gegen 814 heute: verschiedene Zeitpunkte vor dem jeweiligen
  Termin, nicht vergleichbar → weggelassen.
- **Forderungen, Telegram-Gruppen, Ticket-/Spendenlinks**: kein Aufruf, keine Werbung.
- **Köln-Ort (Medienbericht „Ort noch nicht entschieden“, 22.11.)**: Aggregator ohne eigene Quelle, für Frankfurt irrelevant.
- **Teilnehmerzahl der fünften Frankfurter Versammlung am 20.11.** (Verdi, laut Polizei bis zu 250): andere Veranstalterin, nicht Teil der
  „vier Demos“-Zahl; im Vergleich nur die belegte Zahl mit genauer Beschreibung.
- **frankfurt.de**: per Skript nicht abrufbar (HTTP 403) – deshalb „von Stadt oder Polizei gibt es dazu noch nichts“ nur auf Basis von
  Polizei, Innenministerium und Medienlage, mit Stand-Datum.

## Karten und Bilder

- Deutschlandkarte: Natural Earth (gemeinfrei) über `GermanyPlane` (#07); Städte = Lage der Stadt (Koordinaten aus den Kartendaten der Website
  vom 19.11.), **keine Treffpunkte**; orange = „Unsere 4 Städte“.
- Planungen: OpenStreetMap `frankfurt-altstadt-oepnv.json` (© OpenStreetMap-Mitwirkende, ODbL), Punkte Weseler Werft (OSM) und Bahnhofsviertel
  (Kaisersack) nur als Orte der Planungen vom 20.11.
- Figuren, Menge, Skyline, Handy: stilisierte Illustrationen, im Bild „ILLUSTRATION“; keine realen Personen, keine Logos.
