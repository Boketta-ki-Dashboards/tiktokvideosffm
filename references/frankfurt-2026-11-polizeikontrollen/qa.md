# Qualitätskontrolle – FrankfurtPoliceRights

## Adam-Hörproben (Slang-Aussprache)

| Lauf | Text | Prüfung | Ergebnis |
|---|---|---|---|
| #12 | „Ewa, Frankfurt. Seit Halloween wird auf der Zeil ordentlich kontrolliert. Und jetzt kommt der wichtige Punkt, Bruder: Musst du einfach deine ganze Galerie zeigen? Checkt mal.“ (174 Credits, 10,3 s) | Whisper medium (lokal) + Tonhöhenverlauf | „Ewa“ wird wie im Frankfurter Slang gesprochen (Whisper: „Eva“ – also „Ä-wa“, nicht buchstabiert). „Bruder“ und „Checkt mal!“ werden wortgetreu erkannt. **Aber:** „Ewa? Frankfurt?“ mit steigender Frage-Melodie (≈ 105 → 180 Hz). |
| #13 | „Ewa, Frankfurt! Seit Halloween wird auf der Zeil verstärkt kontrolliert. Ewa, jetzt wisst ihr Bescheid.“ (≈ 100 Credits) | wie oben | Mit Ausrufezeichen fallende Grußmelodie (Whisper: „Eva, Frankfurt!“), Schluss-„Ewa“ natürlich. → Schreibweise „Ewa, Frankfurt!“ übernommen. |

Stimme und Einstellungen unverändert (Adam `pNInz6obpgDQGcFmaJgB`, speed 1.16, stability 0.45, similarity 0.8, style 0.2, seed 20261104).
Komplette Spur danach **einmal** erzeugt (Lauf #14, 19 Sätze, ≈ 2.071 Zeichen-Credits) – 122,9 s Sprechzeit, 292 Untertitel-Wörter aus den ElevenLabs-Zeitstempeln.

## Slang-Dosis

Vier lockere Ausdrücke in 123 s: „Ewa, Frankfurt!“ · „Bruder“ (Rechtsteil) · „Checkt mal“ (Tipps) · „Ewa“ (Schluss) + „mit seinen Jungs“.
Juristische Sätze ohne Slang, klar formuliert (Test `tests/polizeirechte.test.ts`).

## Visuelle Prüfung (Kontaktbogen)

Erster Kontaktbogen (32 Frames, je Szene Anfang/33 %/66 %/Ende) → Korrekturen:
- „POLIZEI“-Schriftzug bei gespiegelten Figuren war spiegelverkehrt → Schrift außerhalb der Spiegelung.
- Gesichter der Figuren lagen hinter den Untertiteln → Figuren unter die Untertitelzone verschoben.
- „PRIVATSPHÄRE“ abgeschnitten → kleinere Titel, Rand innerhalb der Sicherheitszone.
- Waage-Szene: erste Sekunde leer → linke Hälfte sofort.
- Sprechblase der Einsatzkraft blieb zu lange stehen → nur während der „freiwillig“-Erklärung.
- Zeil zu dunkel, nahe Baumkronen im Titelbereich → hellere Fassaden/Boden, nahe Bäume ausgeblendet.
- Hook: Galerie startete leer → von Anfang an gefüllt (Vorschaubild Frame 0).
- Mützenschirm der Einsatzkraft wirkte wie Sonnenbrille → höher gesetzt.
