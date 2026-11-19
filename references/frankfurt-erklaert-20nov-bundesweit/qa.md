# QA – „73 Städte – ein Protesttag! Was passiert morgen?“ (Frankfurt erklärt #12)

Produziert am 19.11.2026 für Freitag, 20.11.2026. Stand im Video: **19.11.2026, ≈ 14 Uhr**. Nicht automatisch veröffentlicht.

## ⚠ Status: UNVOLLSTÄNDIG – Adam-Stimme fehlt, kein finaler Export

- Hörprobe **Lauf #69** (Run 44528344974, 19.11., 13:59 Uhr MEZ) wurde von ElevenLabs abgelehnt:
  „This request exceeds your API key (FrankfurtRed3) quota of 10000. You have 18 credits remaining, while 74 credits are required for this request.“
  → **0 Credits verbraucht.** Kein Wechsel zu Chatterbox/Piper, keine weiteren Versuche (Vorgabe).
- Benötigt für die Vollvertonung: ≈ 916 Credits (966 gesprochene Zeichen minus Begrüßung und Abo-Aufruf, die als bereits bezahlte, geprüfte
  Aufnahmen aus #11 im Cache liegen) + ≈ 190 für die Hörprobe.
- Alles andere ist fertig: Recherche, Sprechertext, Szenen, Karte, Quellenzeile, Titelbild, Prüfbögen, Tests, Caption, Workflow-Eintrag.
  Sobald das Kontingent erhöht bzw. der Key erneuert ist (nur als GitHub-Secret `ELEVENLABS_API_KEY`), erzeugt **ein** Lauf
  `{"video": "FrankfurtErklaert20NovemberBundesweit", "aktion": "video"}` (nach der Hörprobe) Stimme, Untertitel, MP4, Thumbnail und alle Prüfbögen.
- Die Datei `voiceover.json` ist bis dahin ein **geschätztes** Manifest (stumm, `estimate-manifest`). Vorschaubilder:
  `kontaktbogen-vorschau-ohne-stimme.jpg` (ausdrücklich KEIN Export).

## 1. Wichtigste Abweichungen vom Auftrag

| Auftrag | Video | Grund |
|---|---|---|
| 54 Städte | **73 Städte** (überall: Ton, Bild, Thumbnail, Titel, Caption) | Website am 19.11., 13:47 Uhr: „Protest am 20.11. in 73 Städten“ (Liste mit 73 Einträgen); am 16.11. laut Stuttgarter Zeitung 39 |
| Frankfurt „≈ 4.000 angemeldet“ | „bis zu 4.000 **erwartet** · laut Stadt“ | Quellen sagen „erwartet“, nicht „angemeldet“ (wie schon in #10) |
| Köln 5.000–10.000 (KStA 16.11.) | 5.000–10.000 als Erwartung der Anmelderinnen **laut Polizei Köln (PM 19.11., 7:58 Uhr)**; Deutzer Werft statt Innenstadt | neuere, behördliche Quelle |
| Berlin/München „prüfen“ | Berlin: 5.000 erwartet laut Polizei (Tagesspiegel 18.11.), nur im Bild; München: „Zahl offen“ | keine behördliche Angabe für München gefunden |

## 2. Prüfliste

| Prüfpunkt | Ergebnis |
|---|---|
| Stadtzahl aktuell und überall gleich? | ✅ 73 (Test: Liste = 73, Ton/Bild/Titel/Caption, keine „54“) |
| Karte mit echten Positionen, keine erfundenen Marker? | ✅ Treffpunkt-Koordinaten der Website; Test: alle in Deutschland, Berlin/Frankfurt/München/Köln/Hamburg plausibel, Extrempunkte = Ton |
| Zentral vs. lokal mit Legende? | ✅ orange 4 / weiß 69, Legende wörtlich nach Website |
| Drei Zahlenarten getrennt? | ✅ Online-Zusage (≈ 20.000, „keine Garantie“) · Anmeldung/Erwartung · tatsächlich „NOCH OFFEN“ |
| „Angaben zur Planung – keine tatsächliche Teilnehmerzahl“ im Vergleich? | ✅ Stempel bei „Planungszahlen“ |
| Keine Werbung, keine Krawall-Spekulation, keine Polizeiplanung Frankfurt? | ✅ Test auf Begriffe; Gewaltaufrufe/Kontrollstellen aus der PM Köln bewusst nicht verwendet |
| Forderungen neutral? | ✅ „POSITION · laut Website · Auswahl 3 von 6“ |
| Quellen unter den Untertiteln (neue Regel)? | ✅ `sourceLine`, y 1.512–1.630, 1–2 Zeilen, kurze Labels; Prüfbogen `-QuellenCheck` (1-/2-zeilige Untertitel, Vergleich, Karte, simulierte App) |
| Serien-Overlay oben rechts? | ✅ `badgePlacement: 'top-right'`, TopTag links (y 272–342) |
| Titelbild nach COVER_ZONE, lesbar im Profilraster? | ✅ Prüfbogen `-CoverVorschau` (alle vier Ansichten) |
| Logo im Outro/Titelbild? | ✅ `BrandLogo` |
| ≤ 60 s? | ⏳ geschätzt ≈ 56 s (966 Zeichen bei ≈ 18 Zeichen/s inkl. Abo-Aufruf); endgültig erst mit der Adam-Spur (`enforceMaxFrames`, Workflow `--max 60`, `tech-report --max-seconds 60`) |
| Adam, speed 1.20, Ewa → Eywa, Pausen ≤ 400 ms, Whisper-Gegenprobe | ⏳ ausstehend (Kontingent) |
| Render 1080 × 1920, 30 fps, H.264/AAC, < 30 MB | ⏳ ausstehend |
| `npm run check` | ✅ TypeScript, ESLint, 206/206 Tests |

## 3. Nach dem Aufstocken (Reihenfolge)

1. Kurz neu prüfen: Website (Stadtzahl, Zähler), Polizei Köln, Stadt Frankfurt. Ändert sich die Stadtzahl, ALLE Stellen gemeinsam ändern
   (`content.ts → CITY_COUNT`, `data/staedte.json`, Skript, Caption, Titel) – oder „Stand: Donnerstagmittag“ beibehalten.
2. `voice-jobs/auftrag.json` → `{"video": "FrankfurtErklaert20NovemberBundesweit", "aktion": "hoerprobe", "nr": 70}` → anhören / Whisper.
3. `{"video": "FrankfurtErklaert20NovemberBundesweit", "aktion": "video", "nr": 71}` → Artefakt `FrankfurtRed3_20November_Bundesweit_ADAM_FINAL-run…`.
4. Drehbuch mit echten Zeiten neu erzeugen (`node scripts/voice/make-drehbuch.mjs …`), Kontaktbogen aus dem MP4, diesen Bericht ergänzen.
