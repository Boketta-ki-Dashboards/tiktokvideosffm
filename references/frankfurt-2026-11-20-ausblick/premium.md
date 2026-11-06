# PREMIUM-Fassung – „Frankfurt am 20. November – wieder Eskalation?“

Komposition `FrankfurtNov20ForecastPremium` · Export `FrankfurtRed3_20November_Ausblick_ADAM_PREMIUM_FINAL.mp4` ·
Original bleibt unverändert: `FrankfurtNov20Forecast` → `FrankfurtRed3_20November_Ausblick_ADAM_FINAL.mp4`.

## Was gleich bleibt (technisch erzwungen)

| Bereich | Wie sichergestellt |
|---|---|
| Sprechertext | `script.json` unverändert; SHA-256 in `premium/lock.json`, Test `tests/nov20-premium.test.ts` |
| Adam-Stimme | dieselbe Datei `public/voiceover/frankfurt-2026-11-20-ausblick/voiceover-adam.mp3` (SHA-256 gesperrt); Workflow mit `stimme: vorhanden` → **kein** ElevenLabs-Aufruf, keine Credits, kein Time-Stretching |
| Audiomischung (Stimme, Musikbett, alle SFX, Schnitt-Whooshes) | Die Original-Komposition läuft unsichtbar (`display: none`, Untertitel aus) als **einzige** Tonquelle mit – derselbe Code mischt denselben Ton. Premium-Szenen enthalten keinen Ton (Test). Prüfung Sample für Sample: siehe unten |
| Szenenstruktur, Dauer, Schnitte | dieselbe `buildTimeline` aus demselben Manifest + `plan.ts`; 7 Szenen + Outro, 3228 Frames = 107,6 s (Test) |
| Animations-Timing | jede Premium-Szene nutzt exakt dieselben Stimm-Cues/Schlüsselwörter wie die Original-Szene (Test vergleicht die Cue-Listen) → Bild sitzt auf denselben Frames wie die Original-SFX |
| Übergänge | identische `TRANSITIONS` an denselben Schnitten (Test vergleicht den Quelltext) |
| Untertitel | dieselbe Komponente `TikTokSubtitles`, dieselben Captions, `bottom={480}`; neu nur ein weiches Kontrastband dahinter |
| Branding / Outro | `OutroScene` unverändert (@frankfurtred3, Profil „S“ aus `src/theme/brand.ts`) |
| Aussagen & Status | gleiche Inhalte aus `content.ts`; jede Aussage weiter als FAKT · ANGEKÜNDIGT · EINSCHÄTZUNG · OFFEN · FIKTION gekennzeichnet; keine Prozentwerte, kein „verboten“ (Test). Neue Bildtexte: `sources.md`, Abschnitt „PREMIUM-Fassung“ |

## Was neu ist (nur Bildebene)

Gemeinsames Designsystem `premium/kit.tsx`: eine Typo-Skala (104/64/40/32/24/22 px), ein Kartenstil (Glas mit Lichtkante, doppelter Schatten,
Akzentstreifen), ein Linien-Icon-Set, Status-Zeilen mit Icon-Disc und Lichtkante, einheitliche Quellenzeile, Abschnittslabels mit Nummer.

| Szene | Original | Premium |
|---|---|---|
| 1 Hook | flache Skyline, großes Datum als Text, gelbe Box | mehrschichtige Nacht (`NightCity`: Himmel, Sterne, Taunus, ferne Stadtkante, Skyline, Main-Dunst, Uferpromenade mit Laternen, Bokeh – je eigene Parallaxe), Kamerafahrt 1,16 → 1,03; **Fallblatt-Datum** 31.10 → 20.11 mit Klappanimation, Glasriss zerfällt beim Wechsel in Scherben, Stimmungswechsel Rot → Violett, 3D-Frageplakette mit Masken-Reveal und Glanz |
| 2 Halloween | flache Silhouetten, Strichfiguren | dieselbe Altbau-Straße zweimal gezeichnet: 31.10. warm mit Lichterkette, Kürbissen und ~34 Figuren (Hexe, Katze, Teufel, Skelett, Gespenst – freundlich, ohne Gesichter) · 20.11. kühl mit Regen, nassen Reflexen, wenigen Passanten mit Schirm; **Schieberegler-Wipe** statt gestauchtem Split; „Verkleidet ≠ Randalierer“ als großes Glas-Banner |
| 3 Polizei | Balken mit 12 Segmenten, kleines Pressekärtchen | Nachrichten-Infografik: Pressemitteilungs-Karte mit Schreibmaschinen-Zitat, Vergleichsbalken „31.10. Großaufgebot“ vs. „20.11. „noch stärker“ – angekündigt, ohne Zahl“ (gestrichelt, „?“), detaillierte Einsatz-Transporter (Lichtbalken, Felgen drehen), 3D-Abreißkalender, „VERSAMMLUNGSVERBOT?“-Plakette, Entscheidungs-Spur **DISKUTIERT → ENTSCHIEDEN?** (offen, pulsierend), Medaille Art. 8 GG |
| 4 Läden | einfache Glasfront, Platten als Streifenmuster | detailreiche Ladenfront (Gesims, Obergeschoss mit Licht, beleuchtetes Schild, Markise, Auslage, Spiegelungen); Holzplatten mit Maserung, Astlöchern, Kantenlicht, Schatten und eingedrehten Schrauben; Vorher/Nachher-Etikett „SCHAUFENSTER → GESICHERT“; drei Optionskarten mit Mini-Animationen (Platten fallen, Security-Person, Rollladen + Uhr) |
| 5 Fazit | drei flache Zeilen | drei 2,5D-Karten kippen aus der Tiefe (Kartendicke, Glanz, Icon + Status-Chip), Studio-Bühne mit Fluchtpunktboden, Fazit-Plakette mit Prägung – weiterhin ohne Prozent/Score |
| 6 Plot-Twist | Kasten-Handwerker | Spotlight-Bühne mit Siegertreppchen und schwebendem „?“, Kandidaten werden rot gestrichen und entsättigt; sympathischer Handwerker (Gesicht mit Glanzaugen, Helm mit Glanz, Werkzeuggürtel, Funken beim Schrauben), Platten an derselben Stelle wie die Original-Klicks, schwingendes Firmenschild mit FIKTION-Kennzeichnung, Münz-Bogen, Diskussionsblasen |
| 7 Frage | Pillen-Buttons | große Antwortkarten A/B mit Icon, Prägung und Glanz, Einschätzung als Status-Zeile, Kommentar-Hinweis mit Tipp-Animation; alles innerhalb der TikTok-Sicherheitszonen |
| Outro | – | unverändert |

## Auflösung (gemeldete 512 × 910)

Die Kompositionen sind mit `VIDEO.width/height` = 1080 × 1920 registriert, `scripts/render.mjs` rendert ohne Skalierung, und
`scripts/verify-video.mjs` bricht schon bisher ab, wenn die Datei nicht 1080 × 1920 hat. FFprobe auf der lokal gerenderten Original-MP4:
1080 × 1920, 30/1 fps, H.264 High, yuv420p. Die 512 × 910 entstehen also nicht beim Rendern, sondern sehr wahrscheinlich in einer Vorschau-/
Weitergabe-Kopie (z. B. App-Vorschau oder Messenger, die Videos verkleinert). Für TikTok immer die MP4 aus dem Artefakt (ZIP) hochladen.
Zusätzlich prüft jetzt `scripts/tech-report.mjs` die fertige Datei direkt mit FFprobe und bricht den Workflow ab, wenn sie nicht
1080 × 1920 / 30 fps / H.264 / yuv420p / AAC / Faststart ist; der Bericht liegt als eigenes Artefakt bei.
