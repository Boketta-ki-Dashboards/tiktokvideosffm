# QA – „Frankfurt morgen: Diese Bahnen sind betroffen!“ (Frankfurt erklärt #11)

Produziert am 19.11.2026 für Freitag, 20.11.2026. **Stand im Video: VGF, 19.11.2026, 9 Uhr** (zuletzt geprüft 19.11.2026, 12:14 Uhr MEZ –
unverändert). Nicht automatisch veröffentlicht.

## 1. Wichtigste Änderung gegenüber dem Auftrag

Die VGF hat ihre Meldung am 19.11. aktualisiert (gleiche URL, neuer Titel „Veranstaltungen am Freitag: Behinderungen des Straßenbahnbetriebs“):

| Auftrag (VGF, 18.11., 14 Uhr) | Video (VGF, 19.11., 9 Uhr) |
|---|---|
| 11/12/14 ab **9 Uhr** nicht über die Altstadtstrecke | ab **8:30 Uhr**; „Zwischen Börneplatz und HBF stellt die VGF den Tram-Betrieb ein, die drei genannten Linien leitet sie über Sachsenhausen um.“ |
| vier Veranstaltungen, drei Demonstrationszüge | fünf Veranstaltungen, vier Demonstrationszüge (Ordnungsamt) |
| offen: Willy-Brandt-Platz, Dom/Römer | zusätzlich Hauptwache, Konstablerwache, Alte Oper |
| „U4/U5 nicht fälschlich alle Stationen zuordnen“ | laut OSM und Wikipedia (B-Strecke) bedienen **beide** Hbf – Willy-Brandt-Platz – Dom/Römer – Konstablerwache → so dargestellt |

## 2. Prüfliste aus dem Auftrag

| Prüfpunkt | Ergebnis |
|---|---|
| VGF-Meldung aktuell? | ✅ Stand 19.11., 9 Uhr, wörtlich in `sources.md` (auch die erste Fassung) |
| 11, 12, 14 korrekt, Beginn bestätigt? | ✅ 11 · 12 · 14 ab 8:30 Uhr (Ton „ab halb neun“) |
| Nicht als vollständig eingestellt bezeichnet? | ✅ „Von einem Komplettausfall ist keine Rede“; Bild: Umleitung über Sachsenhausen, „die Linien fahren, nur anders“ |
| 18, 30, M36 korrekt als möglich? | ✅ Fragezeichen-Schilder, Chip MÖGLICH, „laut VGF nur „möglicherweise““ |
| U-Bahn-Alternativen aktuell? | ✅ U1–U5/U8 nach Fahrplan, U4/U5 als Alternative, offene Stationen |
| Zahl der Versammlungen korrekt? | ✅ Ton: fünf Versammlungen (Innenministerium); Bild zusätzlich VGF/Ordnungsamt: 5 Veranstaltungen, 4 Demozüge |
| Keine erfundenen Verkehrsmaßnahmen? | ✅ Umleitungsweg nicht veröffentlicht → Bogen ausdrücklich „schematisch“; keine Endzeit; keine Abfahrtszeiten |
| Straßenbahnlinien gut erkennbar, Karte verständlich, schematisch gekennzeichnet? | ✅ OSM-Karte mit echten Linienverläufen (Routenrelationen), gesperrter Abschnitt rot, Hinweise SCHEMATISCH / © OpenStreetMap-Mitwirkende |
| Keine falsch eingezeichneten Strecken? | ✅ Linien aus OSM; Test prüft, welche Halte im gesperrten Abschnitt liegen |
| Liniennummern auf dem Smartphone lesbar? | ✅ Schilder 34 px, Illustration ohne Live-Daten |
| Großes Cover im gewohnten Design, Overlay sichtbar? | ✅ Titelbild-Prüfbogen, Overlay oben rechts (y 272) mit TopTag links |
| Original-Adam, speed 1.20, Ewa → Eywa, Liniennummern korrekt? | ✅ Profil kurzformat-60; Whisper: „Ey wa Frankfurt!“, „11, 12 und 14 ab halb neun“, „18 … 30 und M36“, „U4 und U5“, „VGF“ |
| Keine unnötigen Pausen, Untertitel synchron? | ✅ längste Pause 383 ms; Untertitel aus den ElevenLabs-Zeitstempeln |
| ≤ 60 s, 1080 × 1920, 30 fps, ≤ 1.800 Frames? | ✅ lokal 1.613 Frames = 53,8 s; finaler Wert siehe Abschnitt 4 |

## 3. Stimme und ElevenLabs-Kontingent

- Hörprobe Lauf #63, Vollvertonung Lauf #64 (Stand 18.11.), Neuvertonung hook2 + t1 („ab halb neun“) in Lauf #65.
- **Lauf #65 brach danach ab: „This request exceeds your API key (FrankfurtRed3) quota of 10000. You have 18 credits remaining“.**
  Kein Wechsel zu einer Ersatzstimme. Lösung ohne weitere Credits:
  - t2: bereits bezahlte Aufnahme „Von einem Komplettausfall ist keine Rede – es geht um die Strecke durch die Altstadt.“ (weiterhin zutreffend).
  - w1: bereits bezahlte Aufnahme in der Pause hinter „Versammlungen“ gekürzt (3,30 s, 50 ms Ausblendung) → „Hintergrund: Laut Innenministerium
    gibt's morgen sogar fünf Versammlungen.“ Der überholte Halbsatz „die VGF-Meldung nannte noch vier“ entfällt. Cache-Eintrag
    `028a65d3b190d5d9ab12` mit Feld `derivedFrom` (Quelle `12062bdb1229995fda08`).
  - Spur offline aus dem Cache gebaut (0 Credits): 52,28 s Sprache, längste Pause 383 ms; Whisper (medium) wortgetreu.
- Für weitere Folgen muss das ElevenLabs-Kontingent erhöht oder der Key erneuert werden (nur vom Kanalbetreiber, nur als GitHub-Secret).

## 4. Render

- Lauf #66 und #67 scheiterten vor dem Render an der FFmpeg-Installation (apt hing, Ubuntu-Paketquellen vom Runner nicht erreichbar; 0 Credits).
  Ein Ausweichweg im Workflow (statischer FFmpeg-Build) wurde nicht eingebaut – die Änderung war in dieser Sitzung nicht freigegeben.
- **Lauf #68 (Run-ID 44516635259, `stimme: vorhanden`, kein ElevenLabs-Aufruf) – erfolgreich.** Artefakte:
  `FrankfurtRed3_20November_OePNV_ADAM_FINAL-run68` (MP4, Thumbnail, Titelbild- und Overlay-Prüfbogen, ID 14526147829),
  `…-Technikbericht-run68` (ID 14525529609), `…-Sprecher-Adam-run68` (ID 14527295372).

| Prüfung | Ergebnis |
|---|---|
| Datei | `FrankfurtRed3_20November_OePNV_ADAM_FINAL.mp4`, **14,09 MiB** (14.776.690 Byte, < 30 MB), SHA-256 `09b38b1242cb41a32be35f1c722c8f63867a8705829c34ee4589e56f9f73973c` |
| Video | H.264 High, 1080 × 1920, 30/1 fps, yuv420p, BT.709, **1.613 Frames = 53,781 s** (≤ 1.800), Faststart |
| Audio | AAC LC, 48 kHz, Stereo, 189 kbit/s · **−14,5 LUFS**, LRA 2,4 LU, True Peak −1,3 dBTP (Prüfbericht bestanden) |
| Dekodierung | vollständig fehlerfrei (ffmpeg, 0 Meldungen) |
| Stille ≥ 400 ms (−50 dB) / schwarze Bilder ≥ 0,2 s | keine / keine |
| Titelbild | `FrankfurtRed3_20November_OePNV_THUMBNAIL.png`; Prüfbogen: Titel, Linien und „AB 8:30 UHR“ in allen vier Ansichten lesbar |
| Overlay | Kopfzeile y 272–342 unter der simulierten Suchleiste; Linienschilder und Karte frei (Prüfbild Uhr/Linien und Karte) |
| Kontaktbogen | `kontaktbogen-run68.jpg` (alle 2 s aus dem MP4) |
| Workflow-Prüfungen | `verify-video`, `check-sync`, `check-pauses`, `tech-report --max-seconds 60` – alle grün; `npm run check` 192/192 Tests |

Bekannte Kleinigkeit: Bei dreizeiligen Untertiteln (z. B. „und / Konrad-Adenauer- / Straße.“) liegt die oberste Zeile für ≈ 0,5 s über der Quellenzeile.

Nicht automatisch veröffentlicht. Vor dem Posten am Abend lohnt ein letzter Blick auf vgf-ffm.de – ändert die VGF ihre Meldung erneut,
stimmt der Stand im Video (19.11., 9 Uhr) nicht mehr.
