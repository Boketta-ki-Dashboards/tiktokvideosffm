# QA – „Über 2.150 Kontrollen auf der Zeil – was hat die Polizei gefunden?“ (Frankfurt erklärt #13)

Produziert am 19.11.2026. **Stand im Video: Bilanz des Hessischen Innenministeriums vom 18.11.2026 (Kontrollen seit 01.11.2026)** – am 19.11.
(17:55 Uhr) keine neuere Bilanz veröffentlicht (Aktualitätsprüfung mit 8 Fragen in `sources.md`). Nicht automatisch veröffentlicht.

## Ergebnis – Lauf #75

- [Lauf #75](https://github.com/Boketta-ki-Dashboards/tiktokvideosffm/actions/runs/44575344981) (`stimme: vorhanden`, kein ElevenLabs-Aufruf) – grün.
- Artefakte: `FrankfurtRed3_2150Kontrollen_ADAM_FINAL-run75` (MP4, Thumbnail, Titelbild-, Overlay- und Quellen-Prüfbogen, ID 14555749602),
  `…-Technikbericht-run75` (ID 14556623486), `…-Sprecher-Adam-run75` (ID 14556598480).

| Prüfung | Ergebnis |
|---|---|
| Datei | `FrankfurtRed3_2150Kontrollen_ADAM_FINAL.mp4`, **13,0 MiB** (13.627.824 Byte, < 30 MB), SHA-256 `c9f6bbd603fb94399a105fa74fc241f9a5e95cf58d461a66c165f5a3dcab836f` |
| Video | H.264 High, 1080 × 1920 (echte Full-HD-Pixel), 30/1 fps, yuv420p, BT.709, **1.691 Frames = 56,384 s** (≤ 1.800), Faststart |
| Audio | AAC LC, 48 kHz, Stereo, 189 kbit/s · **−14,5 LUFS**, LRA 2,2 LU, True Peak −1,6 dBTP |
| Dekodierung / Stille ≥ 400 ms / Schwarzbilder ≥ 0,2 s | fehlerfrei / keine / keine |
| Pausen in der Sprecherspur | längste 367 ms (Grenze 400 ms) |
| Workflow-Prüfungen | `verify-video`, `check-sync`, `check-pauses`, `tech-report --max-seconds 60` – grün; `npm run check` 219/219 Tests |
| Kontaktbogen | `kontaktbogen-run75.jpg` (alle 2 s aus dem MP4) |
| Prüfbögen | Titelbild (Kernzone, 3:4, Profilraster, Video + App), Overlay (Suchleiste), Quellenzeile (1-/2-zeilige Untertitel, simulierte App) |

## Stimme

- Hörprobe **Lauf #73** (Whisper: „2150 … 78 Strafanzeigen, 435 Ordnungswidrigkeiten und 182 Platzverweise“ – Zahlen deutlich).
- Vollvertonung **Lauf #74** (Adam, Profil kurzformat-60, speed 1.20); Begrüßung und Abo-Aufruf aus dem geprüften Cache (0 Credits).
- Whisper (medium) auf der Spur: „Ey wa Frankfurt! Auf der Zeil hat die Polizei seit Anfang November über 2150 Menschen kontrolliert. Klar ist aber,
  kontrolliert heißt nicht automatisch verdächtig. … 78 Strafanzeigen, 435 Ordnungswidrigkeiten und 182 Platzverweise. Achtung, Anzeige heißt nicht
  Verurteilung … Laut Hessenschau identifizierte die Polizei so auch zwei Tatverdächtige der Halloween-Krawalle. Insgesamt sind laut Polizei schon 99
  ermittelt. … Folgt Frankfurt Red drei für mehr.“ – wortgetreu („Posek“ = Whispers Schreibweise).

## Korrekturen nach den Standbildern mit echten Adam-Zeiten

- Zeil-Szene: Zitat Poseck erschien erst nach dem Schnitt → jetzt kurz nach dem Stempel „KONTROLLIERT ≠ SCHULDIG“; Stempel tiefer, „ILLUSTRATION“ frei.
- Sicherstellungen: drei nicht gesprochene Gegenstände erschienen zu spät → erscheinen zwischen den genannten; Raster 4 + 3 innerhalb der Sicherheitszone,
  Etiketten zweizeilig (21 px), Mengen-Plaketten.
- Debatte: „SICHERHEITSGEWINN“ lief über den Kartenrand → umbrochen; Karten kompakter; Antwort und Ausblick überlappen nicht mehr.
- Band „NICHT ADDIEREN“ gekürzt (ragte links aus der Sicherheitszone).

## Prüfliste aus dem Auftrag

| # | Prüfpunkt | Ergebnis |
|---|---|---|
| 1 | Polizeizahlen aktuell und richtig | ✅ 2.150+ / 78 / 435 / 182 wörtlich (PM 18.11.), am 19.11. keine neuere Bilanz |
| 2 | Zeitraum seit 1. November | ✅ Ton „seit Anfang November“, Bild „SEIT 1. NOVEMBER“ |
| 3 | Kontrollierte nicht als Tatverdächtige | ✅ „Kontrolliert heißt nicht automatisch verdächtig“, Stempel „KONTROLLIERT ≠ SCHULDIG“, Poseck-Zitat zu Unbescholtenen |
| 4 | Anzeigen ≠ Verurteilungen | ✅ Ton + „≠ VERURTEILUNG“ |
| 5 | Ordnungswidrigkeiten unterschieden | ✅ „Verstöße unterhalb einer Straftat“, „≠ STRAFTAT“ |
| 6 | Platzverweise ≠ Festnahmen | ✅ „Ort für eine Zeit verlassen“, „≠ FESTNAHME“ |
| 7 | Gegenstände sachlich | ✅ neutrale Liniensymbole, exakte Mengen, „kein belegter Bezug zur Demo am 20.11.“ |
| 8 | 2 Halloween-Tatverdächtige korrekt | ✅ „durch die Zeil-Kontrollen · laut hessenschau“, getrennt von „99 insgesamt“, „nicht die ganze Halloween-Bilanz“ |
| 9 | Keine unbelegten Aussagen über Kontrollierte | ✅ (Test) |
| 10 | Kritik und Bewertung eingeordnet | ✅ POSITION vs. KRITIK, Zurückweisung zitiert, kein Urteil |
| 11–13 | Adam unverändert, speed 1.20, Ewa → Eywa | ✅ |
| 14 | Untertitel synchron | ✅ ElevenLabs-Zeitstempel, `check-sync` grün |
| 15–16 | Quellen unter den Untertiteln, nicht über Illustrationen | ✅ `sourceLine`, keine `SourceBar` (Test) |
| 17 | Serien-Overlay rechts unter der Suchleiste | ✅ `top-right`, Overlay-Prüfbogen |
| 18 | Großes Intro unverändert | ✅ etablierter Titelbild-Stil |
| 19 | Echtes Logo | ✅ `BrandLogo` (Titelbild, Abo-Aufruf) |
| 20–22 | ≤ 60 s, Full HD, FFprobe | ✅ 56,384 s, 1080 × 1920, bestanden |
| 23 | Projekttests | ✅ 219/219 |
| 24 | Artefakt | ✅ Lauf #75 |

Nicht automatisch veröffentlicht. Hinweis: Das Video sagt „Stand 18.11.“ – meldet das Innenministerium am 20.11. eine neue Bilanz, bleibt die
Aussage als Stand korrekt.
