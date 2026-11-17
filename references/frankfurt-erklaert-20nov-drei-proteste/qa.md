# QA – „4 Proteste – 1 Freitag! Was passiert am 20.11. in Frankfurt?“ (Frankfurt erklärt #09)

## 1. Faktenprüfung (Details und Wortlaute: `sources.md`, Abruf 17.11.2026)

| Prüfpunkt | Ergebnis |
|---|---|
| Wie viele Versammlungen? | ⚠️ Auftrag „3 Proteste“ → laut Stadt (t-online, 17.11., 13:27 Uhr) **vier** registriert → Titel, Titelbild und Timeline „4 PROTESTE“ (10:00 · 11:00 · 14:00 · 17:30) |
| Reihenfolge im Video | ✅ Ton: Schulstreik (10/11 Uhr) → Gewerkschaftsjugend (17:30) → Gen Z (14 Uhr, längster Teil, ≈ 17,9 s Sprache); Orientierungsleiste immer chronologisch |
| Schulstreik 10 Uhr | ✅ laut Stadt ver.di-Jugend, 10–15 Uhr, bis zu 1.200, Willy-Brandt-Platz → Café Koz am Campus Westend; Themen „laut Aufruf“ (Frankfurter Info: „gegen Sozialkürzungen Wehrpflicht und Krieg“) |
| Kleiner Zug 11 Uhr | ✅ laut Stadt Internationaler Jugendverband, 11–13:30 Uhr, 75, Adorno-Platz → Gisèle-Freund-Platz |
| Gen Z regelt 14 Uhr | ✅ laut Stadt Weseler Werft, 14–16:30 Uhr, stationär statt Demozug, vor Einbruch der Dunkelheit, bis zu 4.000 erwartet; Website weiterhin „Standort folgt“ (im Bild genannt), Lage „schematisch“ am Nordufer |
| Gewerkschaftsjugend 17:30 | ✅ Bockenheimer **Depot** (GEW; nicht die Warte – Test), laut Stadt ver.di-Jugend, 17:30–21:30, bis zu 500, Motto wörtlich, **Route wird geprüft** → OFFEN |
| Organisatoren | ✅ keine Aussage „unterschiedliche Organisatoren“ (10:00 und 17:30 laut Stadt beide ver.di-Jugend); kein gemeinsamer Zug, keine Routenlinien (Test) |
| Forderungen | ✅ wörtlich nach genz-regelt.de („Was wir fordern“): Bildung/Gesundheit (Suchthilfe, Psychotherapie), bezahlbares Leben, Nein zur Wehrpflicht, Kürzungen „auf unseren Rücken“ (Zitat-Test) |
| Auflagen | ✅ laut Stadt für alle vier: Pyrotechnik, Abbrennen/Verbrennen, Hunde, Alkohol, Glasflaschen verboten, Vermummungsverbot, Transparente an ≤ 2 m Stangen; **kein Verbot** der Versammlungen |
| Batman | ✅ Türklopfen unbelegt → Pointe auf Reuters-Bildunterschrift („Police detain a demonstrator dressed as Batman …“) und heute.at („"Gen Z regelt"? Am Ende wird sogar Batman abgeführt“); GAG + ILLUSTRATION, „abgeführt ≠ schuldig“, keine Person/Accounts |
| Neuester Stand | t-online 17.11., 13:27 Uhr; Websuche am Nachmittag ohne neueren Bericht; Pressekonferenz 18.11. angekündigt (im Abo-Aufruf als Hinweis, Stand im Bild) |
| Bewusst nicht verwendet | Indymedia-Aufruf (Echtheit unbestätigt), Sicherheitsbedenken vorab, Teilnehmerprognosen, „Verbot“ (nur politisch ins Spiel gebracht) |

## 2. Stimme (Adam, Profil kurzformat-60)

- Lauf #49 (Hörprobe, 316 Zeichen, 17,83 s): „Weseler Werft … Campus West End … Bockenheimer Depot … Folgt Frankfurt Rett drei für mehr!“ korrekt;
  Begrüßung vorab aus dem geprüften Cache (`f50850868202c0738f23`, „Ey wa“).
- Lauf #50 (Vollvertonung): Whisper (medium) wortgetreu – „Ey wa, Frankfurt! Am Freitag ist nicht nur Gen Z regelt unterwegs. Laut Stadt sind vier
  getrennte Versammlungen angemeldet. Um 10 startet am Willy-Brandt-Platz der Schulstreik …“ · Mittelteil „… Kundgebung an der Weseler Werft bis halb fünf.
  Erwartet werden bis zu 4.000 …“ · z3 einzeln „… und gegen Wehrpflicht und Sparkurs.“ · Ende „… dass es diesmal ohne Batman sein muss. Folgt Frankfurt Rett 3 für mehr.“ ✅
- Pausen: längste 364 ms (Grenze 400 ms), keine Nachbearbeitung nötig ✅.
- ElevenLabs-Verbrauch: Hörprobe 316 + Vollvertonung ≈ 1.100 Zeichen (Begrüßung aus dem Cache) ≈ 1.420 Zeichen; keine Soundeffekte erzeugt
  (neuer Effekt `tick` ist eine kostenlose FFmpeg-Synthese).

## 3. Länge

Sprache 0,12–56,65 s (Informationsteil bis 54,57 s, Abo-Aufruf 54,63–56,65 s) + 1,5 s Ausklang → **58,13 s = 1.744 Frames** (≤ 64 s) ✅ ·
Abo-Phase 3,5 s. Szenen: Titelbild 6,0 · Schulstreik 14,0 · Gewerkschaft 8,0 · Gen Z 8,4 · Forderungen 6,2 · Auflagen 4,2 · Batman 9,5 · Abo 3,8 s.

## 4. Visuelle Prüfung (lokal, echte Adam-Zeiten, alle 45 Frames + gezielte Frames)

Korrigiert: Euro-Skulptur hinter Karten und Schildern verdeckt → Karten höher, Skulptur rechts, Gruppe kleiner · Gen-Z-Skyline zu dunkel/klein →
eigene Skyline-Ebene (Main Tower, Commerzbank Tower) mit Nachmittagslicht, Sonne sinkt bei „16:30“ · Ortsmarke zuerst am falschen (Süd-)Ufer gedacht →
Nordufer, östlich, „Lage schematisch“ · Ortslabel überdeckte die 4.000-Karte → schmaler, zweizeilig · rosa Fläche unter dem Main → Wasser bis zum Rand ·
Quelle am Bockenheimer Depot auf Backstein schlecht lesbar → dunkles Band · Batman: Fragezeichen-Szene blieb nach dem Wechsel halb sichtbar → ganz
ausgeblendet; Figuren größer; Reuters-Karte vor dem Pointe-Stempel ausgeblendet · Zitat „auf unserem Rücken“ ungenau → wörtlich „auf unseren Rücken“.

## 5. Titelbild und Serien-Overlay

- `NOV20_COVER_LAYOUT`: Serientitel ab y 400 (unverändert im etablierten Stil), „4 PROTESTE“ 512 / „1 FREITAG!“ 642 (128 px), Timeline 792–988
  (rechte Kante 930, endet über y 1000), kleine Zeile 1012, Chip „4 GETRENNTE VERSAMMLUNGEN · LAUT STADT“ 1080, Logo + Account 1236–1290,
  im PNG Frage „WAS PASSIERT AM 20.11.?“ 1340–1420.
- Prüfbogen `-CoverVorschau` (lokal): 9:16, 3:4, Profilraster (neben #08 und Phase 2, Profilbild = offizielles Logo), Videoframe mit App-Elementen –
  Hauptzeilen und Timeline in allen vier Ansichten vollständig lesbar.
- Serien-Overlay `-OverlayCheck` (`overlay-pruefung.jpg`): 1) Rohframe Schulstreik, 2) derselbe Frame mit simulierter Suchleiste (Unterkante y 238),
  3) Gen-Z-Szene mit allen Karten + Suchleiste → Countdown, „FRANKFURT ERKLÄRT“, „IN 60 SEKUNDEN · #09“ ab y 304 vollständig frei, rechts 48 px Abstand;
  großes Intro/Titelbild unverändert; Suchleiste nicht im MP4.
