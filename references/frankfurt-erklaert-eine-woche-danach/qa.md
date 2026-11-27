# QA – #20 „Eine Woche nach den Gen-Z-Protesten – was ist aus den Ermittlungen geworden?“ (FrankfurtRedNews)

Render **Lauf #105** (Workflow „Video produzieren (ElevenLabs Adam)“, `stimme: vorhanden` – kein ElevenLabs-Aufruf), 27.11.2026.
Export `FrankfurtRedNews_GenZ_EineWocheDanach_Ermittlungsbilanz_27Nov2026.mp4` + `…_THUMBNAIL.png` + `…_COVER_VORSCHAU.png` + `…_OVERLAY_PRUEFUNG.png` +
`…_QUELLEN_PRUEFUNG.png` + **`FrankfurtRedNews_GenZ_BundesweiteStatistik_27Nov2026.png`** (Dashboard-Frame 2053 aus dem Video, 1080 × 1920).

## Technik

| Prüfung | Ergebnis |
|---|---|
| Länge | **75,008 s = 2.250 Frames** (Sonderausgabe: gesamt ≤ 80 s / 2.400 Frames) ✅ |
| Informationsteil | **70,32 s nach der Begrüßung** (Ziel 69–71 s), 71,33 s ab Frame 0 (Grenze 73,5 s) ✅ |
| Intro / Outro | Begrüßung „Ewa, Frankfurt!“ 0,12–1,00 s · Abo-Aufruf 71,44–74,36 s + 1,5 s Abo-Phase ✅ |
| Abschnitte (Sprecher) | Überblick 6,21 s · **Leipzig 19,35 s** · Hamburg 11,59 s · Dresden 6,66 s · Stuttgart 7,35 s · Berlin 4,38 s · Frankfurt 6,47 s · Dashboard 7,16 s ✅ |
| Dashboard | Szene 63,90–71,47 s; Aufbau 46 Frames (1,53 s), danach ≈ 5,8 s vollständig ruhig bis zum Outro-Übergang ✅ |
| Datei | 19,75 MB (20.710.532 Byte), SHA-256 `78432a94bb2cc17a…`; Sprecherspur SHA-256 `e71b0ddf615fe8d9…` ✅ |
| Video | H.264 High · 1080 × 1920 · 30 fps konstant · yuv420p · BT.709 · Faststart ✅ |
| Audio | AAC LC 48 kHz · **−14,6 LUFS** · LRA 1,9 LU · True Peak **−1,5 dBTP** ✅ |
| Dekodierung (ffmpeg, komplette Datei) | fehlerfrei ✅ |
| Stille ≥ 0,4 s (−50 dB) | keine ✅ |
| Schwarzbilder (`blackdetect` d=0,2 s, 95 %) | keine ✅ |
| Pausenprüfung Sprecherspur | längste Pause 372 ms (Grenze 400) ✅ |
| Whisper-Gegenprobe (medium) | Gesamtspur wortgetreu (u. a. „Landfriedensbruchs“, „strafunmündig“, „Gewahrsamnahmen“, „politische Anfragen“, „Personalien“, „Frankfurt Red News“); „eine Gesamtzahl“ in der Gesamtspur als „Die Zahl“ verhört, Einzelabschnitt korrekt; Begrüßung „Ey wa Frankfurt!“; o2 einzeln geprüft ✅ |
| Tests | `npm run check` grün (TypeScript, ESLint, 311 Tests), davon 13 in `tests/erklaert-eine-woche-danach.test.ts` ✅ |

## Stimme

ElevenLabs **Adam** (`pNInz6obpgDQGcFmaJgB`, `eleven_multilingual_v2`), Profil `kurzformat-60`: speed **1.20**, stability 0.45, similarity_boost 0.8,
style 0.2, use_speaker_boost true, seed 20261104, `mp3_44100_128`. Begrüßung (Cache 14.11.) und Abo-Aufruf FrankfurtRedNews (Cache #17) wiederverwendet.
Hörprobe #102 (295 Zeichen), Vollvertonung #103 (14 Sätze, 1.269 Zeichen), Nachvertonung #104 (nur o2 „Wir schauen auf sechs Städte.“, 29 Zeichen –
Informationsteil von 68,66 s auf 70,32 s in den Zielbereich). Render #105 ohne ElevenLabs-Aufruf. „Gen Z“ wird bewusst nicht gesprochen (nur im Bild).

## Inhalt / Faktencheck

- Recherchestand **27.11.2026, 15:15 Uhr**, Nachkontrolle 15:49 Uhr ohne Änderung (siehe `sources.md`).
- Ergebnis der Aktualitätsprüfung 22.–27.11.: keine neueren Polizei-/Staatsanwaltschafts-Bilanzen; neu nur die zwei Hamburger Anfragen vom 23.11.
  (ohne Antwort). Im Ton: „Die meisten Zahlen sind noch die ersten Polizeimeldungen – Anklagen oder Urteile sind nicht bekannt.“
- Begriffe getrennt (Identität festgestellt / Personalien ≠ vorläufige Festnahme ≠ Gewahrsam ≠ Strafanzeige ≠ Urteil); „Beschuldigte sind keine
  Verurteilten“, „Kinder unter vierzehn sind strafunmündig“ (§ 19 StGB, keine Rechtsberatung).
- Teilgruppen (4 Kinder, über 40 Jugendliche) innerhalb der über 200 (Personen-Raster färbt Symbole der Gesamtmenge; Hinweis „nicht zusätzlich“).
- Hamburg ohne erfundene Zahl („MEHRERE“, „Gesamtzahl öffentlich nicht bekannt“); Korrektur der Bundespolizei nur auf diese Meldung bezogen.
- Berlin: vorsichtigere Polizeiangabe rund 4.000, abweichende Meldung (rund 4.500) im Bild genannt.
- Frankfurt: Zahlen des gesamten Polizeieinsatzes (Innenministerium 21.11.); 31.10.-Festnahme nur mit zeitlicher Einordnung, Haftrichter-Entscheidung
  nicht veröffentlicht. Kein eigenes Frankfurt-Dashboard.
- Dashboard: getrennte Karten, eigene Kategorie + Meldestand je Stadt, keine Summe, keine Rangliste, Hinweise „nicht direkt vergleichbar“,
  „Beschuldigte sind keine Verurteilten“, „Meldestände je Stadt unterschiedlich“. Szenen und Dashboard lesen dieselbe Datei `data/staedte.ts` (Test).
- 31.10.-Zahlen (Hamburg 130, Stuttgart 36/57) ausgeschlossen (Test).

## Visuelle Prüfung

- Standbilder mit echten Adam-Zeiten (`--every 45` + Detailbilder in zwei Durchgängen), Prüfbögen (Titelbild in 9:16/3:4/Profilraster/App,
  Overlay mit Suchleiste, Quellenzeile mit 1-/2-zeiligen Untertiteln, Dashboard mit App-Oberfläche) und Kontaktbogen der fertigen MP4
  (0,5 fps, `kontaktbogen-run105.jpg`).
- Vor dem Render korrigiert: kreisförmige Öffnung zeigte eine schwarze Scheibe → Zoom aus dem Stadtmarker; Hinweiszeilen zu schmal; Hamburger
  Drucksachen zu spät; Stuttgarter Fernsehturm angeschnitten bzw. hinter dem Navigator, Frauenkirche und Berliner Fernsehturm hinter dem Navigator →
  verschoben; Dashboard-Karten: Zusatzzeilen rechts abgeschnitten, Silhouetten über den Hauptzahlen → gekürzt, Silhouette nur in der Kopfzeile;
  Raster 18 px höher (Abstand zu zweizeiligen Untertiteln); Stuttgart/Berlin mit leerer unterer Hälfte → Vorwurfs-Chips gedimmt vorab, friedlicher
  Demozug (Illustration); Zähler „ÜBER 0“ im Dashboard → Zähler laufen ab Erscheinen.
- Kopfzeile oben rechts (y 272), Quellenzeile unter den Untertiteln, @frankfurtrednews im Profilraster, in der App-Simulation und im Abspann (Logo unverändert).

## Hinweise

- Keine automatische Veröffentlichung.
- Bürgerschafts-Original Drs. 23/6066 war bei mehreren Abrufen nicht erreichbar (Verbindungsabbruch/HTTP 503) – nur Metadaten verwendet.
