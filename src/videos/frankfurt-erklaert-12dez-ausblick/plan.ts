import type {SceneSpec} from '../../lib/timeline';

/**
 * Szenenplan „Nach dem 20. November: Schon die nächste Demo geplant?“ (#16): Titelbild (12.12.) → Rückblick 20.11. (Zeil, weitgehend friedlich,
 * weniger Teilnehmer) → unterschiedliche Planungen (Weseler Werft | Bahnhofsviertel, OSM-Karte) → Kalender 20.11. → 12.12. → Deutschlandkarte
 * 73 Städte, 4 zentral, Zoom Frankfurt → Frankfurt-Infokarte (fest / offen, Ankündigung ≠ Anmeldung ≠ Behörde) → Helfer, Ordner, Förderpool →
 * Online-Zusagen ≠ Teilnehmer → Frage + Abo-Aufruf. Längen-Ausnahme: Informationsteil ≤ 61,5 s, gesamt ≤ 66 s.
 */
export const AUSBLICK_SCENES: SceneSpec[] = [
	{id: 'cover', segmentIds: ['hook1', 'hook2'], minSeconds: 1},
	{id: 'rueckblick', segmentIds: ['r1'], transitionInFrames: 8},
	{id: 'planungen', segmentIds: ['r2'], transitionInFrames: 8},
	{id: 'termin', segmentIds: ['n1'], transitionInFrames: 8},
	{id: 'karte', segmentIds: ['n2', 'f1'], transitionInFrames: 8},
	{id: 'frankfurt', segmentIds: ['f2', 'f3', 'f4'], transitionInFrames: 8},
	{id: 'orga', segmentIds: ['m1', 'm2'], transitionInFrames: 8},
	{id: 'zusagen', segmentIds: ['z1'], transitionInFrames: 8},
	{id: 'outro', segmentIds: ['q1', 'cta'], transitionInFrames: 8},
];

/** Schlüsselwörter für bildgenaue Einblendungen (Zahlen exakt ohne Satzzeichen, Wörter per Wortanfang). */
export const AUSBLICK_KEYWORDS: Record<string, string[]> = {
	cover: ['Ewa', 'Frankfurt', 'November', 'nächste', 'Demo', 'geplant'],
	rueckblick: ['lief', 'friedlich', 'weniger', 'Leuten', 'angekündigt'],
	planungen: ['unterschiedliche', 'Planungen', 'Ortsgruppe', 'Bundesinitiative'],
	termin: ['Trotzdem', 'weiter', 'kündigt', 'bundesweiten', 'Protesttag', 'Samstag', 'Dezember'],
	karte: ['Website', '73', 'Städte', 'dieselbe', 'Frankfurt', 'vier', 'selbst', 'Berlin', 'München', 'Köln'],
	frankfurt: ['Treffpunkt', 'Uhrzeit', 'folgt', 'Veranstalter-Ankündigung', 'Stadt', 'Polizei', 'nichts', 'angemeldet', 'bekannt'],
	orga: ['Neu', 'Helfer', 'Ordner', 'friedlich', 'lokale', 'Förderpool', 'beantragen'],
	zusagen: ['Wichtig', 'Online-Zusagen', 'Teilnehmerzahlen', 'Initiative'],
	outro: ['Frage', 'Dezember', 'mehr', 'Menschen', 'Folgt', 'FrankfurtRed3'],
};
