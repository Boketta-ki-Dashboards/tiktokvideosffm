# Vorbereitung Teil 2 – „76 Fragen nach der Krawallnacht – was hat die Landesregierung tatsächlich geantwortet?“

Teil 1 (`FrankfurtErklaert76Fragen`) zeigt nur die eingereichten Fragen. Teil 2 darf nur **offiziell bestätigte Antworten** zeigen.

## Benötigte offizielle Informationen

1. **Beschlussprotokoll / Protokoll der 51. INA-Sitzung** (Download-Bereich der Terminseite: „Einladung, Beschlussprotokoll und weitere Dokumente zur Sitzung“).
2. **Schriftlicher oder mündlicher Bericht der Landesregierung** zu Drs. 21/5450 und 21/5459 (Ausschussvorlage bzw. Wortprotokoll; ggf. Livestream-Aufzeichnung des Landtags).
3. **Pressemitteilungen** des Hessischen Ministeriums des Innern und des Landtags zum 10.11.2026.
4. Für jede der vier Fragen die **zugehörige Antwort** mit Fundstelle:
   - 01 Gefahrenprognose → Antworten zu 21/5459 I.1–I.8
   - 02 Schutzkonzept/Plünderungen → II.4, II.16, V.4, V.6
   - 03 TikTok/Absprachen → I.8
   - 04 Ermittlungen, Hilfe, Konsequenzen → 21/5450 Nr. 20, 21; 21/5459 III.8, IV.7, VI.2, VI.4
5. Falls Fragen **nicht oder nur teilweise** beantwortet wurden: genau so kennzeichnen („nicht beantwortet“ / „Antwort angekündigt“).

## Wiederverwendbares Designkonzept

- Gleiche Bausteine aus `src/formats/frankfurt-erklaert/visuals/Politics.tsx`: `Landtag`, `BigCount` (76), `QuestionNumber` (01–04 mit gleichen Farben:
  01 Cyan · 02 Rot · 03 Violett · 04 Gelb), `Dossier`, `CalendarSheet`, `FeedPhone`, `IconOrb`; Inhalte in `content.ts` (`QUESTIONS`, `DOCS`, `SESSION`).
- Teil 2: jede Fragekarte bekommt ein zweites Feld **„ANTWORT“** mit Status-Chip `BEANTWORTET` · `TEILWEISE` · `OFFEN` und Quelle (Protokoll/Seite).
- Hook: 76 zählt zurück auf die Zahl der beantworteten Fragen – nur wenn diese Zahl aus dem Protokoll belegt ist.
- Titelbild: gleiches Layout, Zeile „Was wurde wirklich beantwortet?“.
