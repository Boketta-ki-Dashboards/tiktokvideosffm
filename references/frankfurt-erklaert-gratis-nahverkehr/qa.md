# QA – #19 „Frankfurt macht Bus und Bahn kostenlos – ausgerechnet am 12. Dezember!“ (FrankfurtRedNews)

Render **Lauf #101** (Workflow „Video produzieren (ElevenLabs Adam)“, `stimme: vorhanden` – kein ElevenLabs-Aufruf), 26.11.2026.
Export `FrankfurtRedNews_Kostenloser_Nahverkehr_12_19Dezember_26Nov2026.mp4` + `…_THUMBNAIL.png` + `…_COVER_VORSCHAU.png` + `…_OVERLAY_PRUEFUNG.png` +
`…_QUELLEN_PRUEFUNG.png`. Lauf #100 (gleicher Ton, gleiche Timeline) wurde ersetzt, weil `blackdetect` einen fast leeren Szenenanfang meldete (siehe unten).

## Technik

| Prüfung | Ergebnis |
|---|---|
| Länge | **{LEN}** (Längen-Ausnahme: gesamt ≤ 66 s / 1.980 Frames) ✅ |
| Informationsteil | **59,62 s** bis Ende von f3 (Grenze 61,5 s), davon **58,61 s nach der Begrüßung** (Ziel 59–61 s, Toleranz 58–63 s) ✅ |
| Intro / Outro | Begrüßung „Ewa, Frankfurt!“ 0,12–1,00 s (Titelbild bis ≈ 5,2 s) · Abo-Aufruf 59,74–62,66 s + 1,5 s Abo-Phase ✅ |
| Datei | {FILE} ✅ |
| Video | H.264 High · 1080 × 1920 · 30 fps konstant · yuv420p · BT.709 · Faststart ✅ |
| Audio | AAC LC 48 kHz · **{LUFS}** ✅ |
| Dekodierung (ffmpeg, komplette Datei) | {DECODE} |
| Stille ≥ 0,4 s (−50 dB) | {SILENCE} |
| Schwarzbilder (`blackdetect` d=0,2 s, 95 %) | Lauf #100: 15,17–15,37 s (Szenenanfang „Verkehrsmittel“ nach dem Blitz-Übergang: Bus erst ab Frame 4–6, dunkler Hintergrund) → Bus ab Frame 0, Hintergrund heller; zusätzlich „Weihnachtsgeschäft“ (Plakat erst nach ≈ 0,9 s) → Plakat ab Frame 0 → **Lauf #101: {BLACK}** |
| Pausenprüfung Sprecherspur | längste Pause 394 ms (Grenze 400) ✅ |
| Whisper-Gegenprobe (medium) | Lauf #98: „Jane Z. regelt“ → f1 geteilt („Spannend ist der erste Termin.“ + „Gen Z regelt …“ am Satzanfang, wie #16) → Lauf #99: „Gen Z regelt hat für den 12. Dezember auch in Frankfurt den nächsten Protesttag angekündigt.“ ✅ · Begrüßung „Ey wa Frankfurt!“ ✅ · „Tarifgebiet“, „Flughafen ist ausgenommen“, „Offenbach“, „FAZ 400.000 Euro“, „Weihnachtsshopping“ ✅ · Abo-Aufruf in der Gesamtspur ausgelassen (bekannte Whisper-Lücke), Datei byte-gleich mit der geprüften Fassung aus #17/#18 ✅ |
| Tests | `npm run check` grün (TypeScript, ESLint, 297 Tests), davon 13 in `tests/erklaert-gratis-nahverkehr.test.ts`; {CI} ✅ |

## Stimme

ElevenLabs **Adam** (`pNInz6obpgDQGcFmaJgB`, `eleven_multilingual_v2`), Profil `kurzformat-60`: speed **1.20**, stability 0.45, similarity_boost 0.8,
style 0.2, use_speaker_boost true, seed 20261104, `mp3_44100_128`. Begrüßung (Cache-Eintrag vom 14.11.2026, in früheren Folgen per Whisper geprüft) und Abo-Aufruf „Für mehr Nachrichten aus Frankfurt folgt
FrankfurtRedNews!“ (Cache #17) wiederverwendet. Hörprobe #96 (≈ 300 Zeichen), Vollvertonung #97 (13 Sätze, 1.092 Zeichen), Nachvertonung #98
(a2 ohne Abkürzung „Er Em Vau“, f1 neu: 256 Zeichen) und #99 (f0/f1 getrennt: 133 Zeichen). Render #100 und #101 ohne ElevenLabs-Aufruf.

## Inhalt / Faktencheck

- Faktencheck **26.11.2026, 14:40 Uhr** (Stand im Bild), Nachkontrolle **15:17 Uhr** ohne neue oder abweichende Meldung (Websuche; Datenliste der
  Website „Gen Z regelt“: Frankfurt weiter „Standort folgt“). Pressemitteilung auf frankfurt.de nicht abrufbar (403, nicht umgangen) – Inhalte über
  FAZ, hessenschau, Journal Frankfurt, Radio Frankfurt belegt.
- Geltungsbereich nur wie berichtet: alle RMV-Verkehrsmittel im Tarifgebiet 5000 inkl. Grenztarifgebiete, 0 Uhr Samstag bis 5 Uhr Sonntag;
  Flughafen (5090) ausgenommen; Umland (Offenbach, Bad Homburg) bis zur Stadtgrenze regulär. Keine Ticketregeln erfunden; ICE/IC nicht als kostenlos.
- „NUR AN DIESEN BEIDEN TAGEN“ – keine dauerhafte Freifahrt.
- Kosten nur „laut FAZ“ (400.000 Euro); Land Hessen 600.000 Euro nur im Bild (Journal Frankfurt); keine Umsatz- oder Schadenssummen.
- Gen-Z-Protesttag 12.12. nur als zeitliche Überschneidung: „Ein direkter Zusammenhang ist bislang nicht belegt.“ – im Bild „ZWEI EREIGNISSE – EIN DATUM“,
  „BEIDES AM GLEICHEN TAG“, „DIREKTER ZUSAMMENHANG NICHT BELEGT“; Ort/Uhrzeit der Frankfurter Gruppe nur im Bild als deren Angabe, Anmeldung/Behörde
  „keine Mitteilung“. Keine Teilnahmeaufforderung, keine Prognose, keine Spekulation über Ausschreitungen oder Verkehrsbehinderungen.

## Visuelle Prüfung

- Standbilder mit echten Adam-Zeiten (zwei Durchgänge + Detailbilder), Prüfbögen (Titelbild, Overlay, Quellenzeile) und Kontaktbogen der fertigen MP4
  (0,5 fps, `kontaktbogen-run101.jpg`).
- Korrigiert vor dem ersten Render: leerer Szenenanfang „Termine“ (Kalender früher, 0,00 € schon bei „Busse“), Etiketten Frankfurt/Offenbach auf der
  Tarifkarte überlappend, Bad-Homburg-Etikett am Stempel (entfernt, Bad Homburg nur in Caption/Quellen), untere Hälfte „Kosten“ leer (neues Layout mit
  Münzstapel + Zähler + Versicherungs-Karte), „Ein Datum“: Überschrift fehlte, „SAMSTAG · 2026“ verdeckte den Kalender, Demo-Schild verdeckte Text,
  „BEIDES AM GLEICHEN TAG“ zu spät.
- Nach Lauf #100: Szenenanfänge „Verkehrsmittel“ und „Weihnachtsgeschäft“ (siehe Technik) → Lauf #101.
- Kopfzeile oben rechts (y 272), Quellenzeile unter den Untertiteln (1- und 2-zeilige Untertitel geprüft), Titelbild in allen vier Ansichten lesbar,
  @frankfurtrednews im Profilraster, in der App-Simulation und im Abspann (Logo unverändert).

## Hinweise

- Keine automatische Veröffentlichung.
