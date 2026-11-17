# QA – „4 Proteste – 1 Freitag! Was passiert am 20.11. in Frankfurt?“ (Frankfurt erklärt #09, überarbeitete Fassung)

Aktuelle Fassung: **`FrankfurtRed3_20November_3Proteste_BATMAN_UPDATED.mp4`** aus Lauf **#54** (17.11.2026). Die erste Fassung (Lauf #51,
`…_ADAM_FINAL.mp4`, 58,1 s) ist unten in Abschnitt 7 dokumentiert und durch diese Fassung ersetzt.

## 1. Überarbeitung auf Wunsch des Kanalbetreibers (17.11.2026)

| Wunsch | Umsetzung |
|---|---|
| Overlay etwas höher, linke Box auf gleicher Linie, dauerhaft symmetrisch | Overlay y 304 → **272**; neue Szenen-Box `TopTag` mit gleicher Oberkante und Höhe (70 px) → Kopfzeile y 272–342; Regel in CLAUDE.md + Test |
| Vier Versammlungen, aber nur drei erklärt | 11-Uhr-Zug als **eigener Punkt** mit eigener Szene: perspektivische OSM-Karte Campus Westend, Start Adorno-Platz → Ziel Gisèle-Freund-Platz (laut Anmeldung, Verlauf schematisch), 75 angemeldet, Internationaler Jugendverband, „quer über den Campus“, laut Stadt im Zusammenhang mit dem Schulstreik |
| Timeline springt hin und her | Reihenfolge **chronologisch** 10 → 11 → 14 → 17:30; Leiste läuft nur vorwärts, erledigte Termine mit grünem Haken; Gen Z bleibt der längste Protest-Teil (14,0 s Sprache) |
| Kurze Pause nach der Begrüßung | 60 ms → **339 ms** nach „Ewa, Frankfurt!“ (Grenze 400 ms) |
| Batman-Sequenz nach Younes' eigenem TikTok (verbindliches Briefing) | siehe Abschnitt 2 |
| Thumbnail, großes Intro, Typografie, Farbpalette unverändert | Thumbnail **byte-gleich** mit Lauf #51 (`cmp`), Titelbild-Komponente unverändert (11-Uhr-Markierung behält dort ihre alte Farbe) |

## 2. Batman-Sequenz – Prüfliste aus dem Briefing

| # | Prüfpunkt | Ergebnis |
|---|---|---|
| 1 | Younes korrekt als Quelle seiner Erzählung genannt? | ✅ „Der Batman von Halloween hat sich selbst auf TikTok gemeldet. Younes erzählt …“; Quellenkarte @ichbinyounes · BATMAN VON HALLOWEEN; Quellenzeile „Quelle: TikTok @ichbinyounes – eigener Bericht zum 20.11.“ |
| 2 | Sichtbarer Originaltitel „20.11 Hausarrest“ korrekt? | ✅ wörtlich im Ton („Sein neues Video heißt: „20.11 Hausarrest““), auf dem stilisierten Smartphone und als Titelkarte; Stempel „„HAUSARREST““ in Anführungszeichen = sein Videotitel, kein angeordneter Hausarrest |
| 3 | Nur belegte Aussagen? | ✅ Tonspur lokal mit Whisper `medium` transkribiert (84,2 s, vollständig, `younes-transkript.md`): geklingelt (00:00), am 20.11. nicht nach Frankfurt (00:07), zweimal melden (00:18), bis 5.1. nicht in die Innenstadt (00:30), Zitat „Batman steht für Kriminalität oder steht er für Gerechtigkeit?“ (01:12) |
| 4 | Verständlicher und unterhaltsamer als vorher? | ✅ kleine Geschichte in fünf Phasen (Symbol → Quellenkarte → Tür → Smartphone → Kalender + Pointe), Ton locker („Sieht schlecht aus, Bras – diesmal wohl ohne Batman!“) |
| 5 | Keine zusätzlichen polizeilichen Maßnahmen erfunden? | ✅ nur seine drei Aussagen (LAUT YOUNES); keine Begründungen („Gefahr für die Gesellschaft“, „kriminell“ bewusst weggelassen), keine Beamtenzahl, keine Rechtsbegriffe; zwei stilisierte Figuren = Illustration |
| 6 | Tür-Animation hochwertig? | ✅ 2,5D-Wohnungstür (Rahmen mit gestapelter Tiefe, Kassetten, Spion, Griff, Deckenlicht, Fußmatte), Klingel leuchtet mit Wellen, „DING-DONG!“ + Klingelton; **Hinweis:** Younes sagt „geklingelt“, nicht „geklopft“ → Klingeln statt Klopfen |
| 7 | Quellenkarte gut lesbar? | ✅ Handle 40 px, Unterzeilen 30/24 px, Aussagen 31 px (Screenshots `batman-sequenz-run54.jpg`) |
| 8 | Passt zum FrankfurtRed3-Design? | ✅ gleiche Karten, Chips, Farben (Violett/Orange-Akzente aus der Palette), Skyline, Kopfzeile; eigenes Masken-Symbol statt Fledermaus-Logo |
| 9 | Stimme, Untertitel, Animation synchron? | ✅ Einblendungen an Wort-Cues (geklingelt, 20, zweimal, Hausarrest, Freitag, ohne); `check-sync` im Workflow grün; Whisper: „Younes erzählt, die Polizei habe bei ihm geklingelt. Am 20. dürfe er nicht nach Frankfurt und müsse sich zweimal melden. Sein neues Video heißt 20.11. – Hausarrest – Batman am Freitag in Frankfurt? Sieht schlecht aus, Bras. Diesmal wohl ohne Batman.“ |
| 10 | Drei bzw. vier Protestveranstaltungen vollständig erklärt? | ✅ alle vier mit Uhrzeit, Ort, Zahl, Anmeldung; keine Sachaussage gestrichen |
| 11 | Follow-Outro funktioniert? | ✅ Abo-Aufruf 68,27–70,29 s + 1,5 s Ausklang, Plus → Haken |
| 12 | Echtes Markenlogo sichtbar? | ✅ `public/brand/frankfurtred-logo.webp` (BrandLogo 250 px), kein „S“ |
| 13 | Neue Dauer technisch geprüft? | ✅ 2.153 Frames = **71,787 s** (Sonderausnahme ≤ 75 s, Informationsteil 68,21 s ≤ 69 s); Batman-Sequenz 18,2 s (b1–b5) |
| 14 | Echte 1080 × 1920 bei 30 fps? | ✅ ffprobe: 1080 × 1920, 30/1, H.264 High, yuv420p, BT.709 |
| 15 | GitHub-Actions-Export funktioniert? | ✅ Lauf #54 grün, Artefakte siehe Abschnitt 5 |

## 3. Stimme (Adam, Profil kurzformat-60, speed 1.20 – Werte unverändert)

- Lauf #52 (nur geänderte Sätze): s2, c1 und eine erste Batman-Fassung; Lauf #53: die fünf finalen Batman-Sätze (b1–b5). Alle übrigen Sätze aus dem Cache.
- Whisper (medium): Begrüßung „Ey wa, Frankfurt!“ ✅ · c1 „Dort zieht um 11 der Internationale Jugendverband mit 75 Leuten quer über den Campus. Laut Stadt im
  Zusammenhang mit dem Schulstreik.“ ✅ · Batman wortgetreu ✅ („Bras“ korrekt erkannt).
- Pausen: längste 385 ms, nach der Begrüßung 339 ms (`check-pauses` grün).
- ElevenLabs-Verbrauch der Überarbeitung: Lauf #52 ≈ 420 Zeichen (davon ≈ 210 für die später ersetzte Batman-Fassung), Lauf #53 ≈ 360 Zeichen;
  keine Soundeffekte erzeugt.

## 4. Visuelle Prüfung (lokal mit echten Adam-Zeiten, danach am fertigen MP4)

Korrigiert während der Überarbeitung: Aussagen-Karte hatte vor den Aussagen leere Fläche → Karte wächst mit · Polizeifiguren zu klein/dunkel → größer,
heller, seitlich neben der Tür (Tür bleibt sichtbar) · „DING-DONG“ zu blass → kräftiger, über der Tür · Zitat stand nur ≈ 0,5 s → ab Beginn des
Smartphone-Teils · Kalender-Phase erst ab „Freitag“, damit die Frage noch beim Smartphone steht.
Overlay-Prüfbogen (`overlay-pruefung.jpg`): Kopfzeile y 272–342 unter der simulierten Suchleiste (Unterkante 238), Box links und Overlay rechts exakt auf
einer Linie; Gen-Z-Szene mit allen Karten frei.

## 5. Finaler Render

Lauf **#54** (Run-ID 44142431164, Commit 8e92ef9, `stimme: vorhanden` – kein ElevenLabs-Aufruf) – **erfolgreich**.
Artefakte: `FrankfurtRed3_20November_3Proteste_BATMAN_UPDATED-run54` (MP4, Thumbnail, Titelbild- und Overlay-Prüfbogen, ID 14354933348),
`…-Technikbericht-run54` (ID 14356575121), `…-Sprecher-Adam-run54` (ID 14354519334).

| Prüfung | Ergebnis |
|---|---|
| Datei | `FrankfurtRed3_20November_3Proteste_BATMAN_UPDATED.mp4`, **18,88 MiB** (19.793.402 Byte, < 30 MB), SHA-256 `7087872b841c0765b2519a0b779b398e128da6f34d743bb4b0cec9e806e979ef` |
| Video | H.264 High, 1080 × 1920, 30/1 fps, yuv420p, BT.709, **2.153 Frames = 71,787 s**, Faststart |
| Audio | AAC LC, 48 kHz, Stereo, 189 kbit/s · **−14,6 LUFS**, LRA 2,4 LU, True Peak **−1,4 dBTP** (Ziel −1,5; Prüfbericht bestanden) |
| Dekodierung | vollständig fehlerfrei |
| Stille ≥ 400 ms (−50 dB) | keine |
| Thumbnail | `…_THUMBNAIL.png` byte-gleich mit Lauf #51 (unverändert) |
| Kontaktbogen | `kontaktbogen-run54.jpg` (alle 2 s aus dem MP4), Batman-Screenshots `batman-sequenz-run54.jpg` (6 Bilder aus dem MP4) |
| Workflow-Prüfungen | `verify-video`, `check-sync`, `check-pauses`, `tech-report --max-seconds 75` – alle grün |

Nicht automatisch veröffentlicht.

## 6. Fakten (unverändert, Details in `sources.md`)

Stadt Frankfurt laut t-online (17.11., 13:27 Uhr): vier Versammlungen, Auflagen für alle; Weseler Werft, 14–16:30, bis 4.000; Schulstreik 10–15, bis 1.200;
Internationaler Jugendverband 11–13:30, 75; ver.di-Jugend 17:30–21:30, bis 500, Route wird geprüft. Websuche am Nachmittag ohne neueren Bericht.

## 7. Erste Fassung (ersetzt)

Lauf #51 (Run-ID 44091978672): `FrankfurtRed3_20November_3Proteste_ADAM_FINAL.mp4`, 58,133 s, 16,25 MB, −14,5 LUFS, −1,7 dBTP – Reihenfolge 10 → 11 → 17:30 → 14,
11-Uhr-Zug nur als Halbsatz, Batman-Pointe über das Agenturfoto der Halloween-Nacht. Kontaktbogen `kontaktbogen-run51.jpg`.
