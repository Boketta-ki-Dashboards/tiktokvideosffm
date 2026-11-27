import type {SceneSpec} from '../../lib/timeline';

/**
 * Szenenplan „Über 2.150 Kontrollen auf der Zeil“ (#13): Titelbild (2.150+ über der Zeil bei Nacht) → 2,5D-Zeil mit Zähler und
 * „KONTROLLIERT ≠ SCHULDIG“ → drei Statistik-Karten (78 · 435 · 182) mit Einordnung → Sicherstellungs-Übersicht → Ermittlungsakte
 * (2 identifiziert, 99 insgesamt) → Bewertung vs. Kritik + „Kontrollen sollen weitergehen“ → Frage + Abo-Aufruf mit Logo. Hartes Limit 60 s.
 */
export const KONTROLLEN_SCENES: SceneSpec[] = [
	{id: 'cover', segmentIds: ['hook1'], minSeconds: 1},
	{id: 'zeil', segmentIds: ['z1', 'z2'], transitionInFrames: 6},
	{id: 'stats', segmentIds: ['b1', 'b2', 'b3'], transitionInFrames: 10},
	{id: 'items', segmentIds: ['g1'], transitionInFrames: 8},
	{id: 'suspects', segmentIds: ['h1', 'h2'], transitionInFrames: 8},
	{id: 'debate', segmentIds: ['p1', 'p2', 'w1'], transitionInFrames: 8},
	{id: 'outro', segmentIds: ['q1', 'cta'], transitionInFrames: 8},
];

/** Schlüsselwörter für bildgenaue Einblendungen (Zahlen exakt ohne Satzzeichen, Wörter per Wortanfang). */
export const KONTROLLEN_KEYWORDS: Record<string, string[]> = {
	cover: ['Ewa', 'Frankfurt'],
	zeil: ['Zeil', 'Polizei', 'November', '2.150', 'Menschen', 'kontrolliert', 'Klar', 'Kontrolliert', 'automatisch', 'verdächtig'],
	stats: ['Bilanz', 'Innenministerium', '78', 'Strafanzeigen', '435', 'Ordnungswidrigkeiten', '182', 'Platzverweise', 'Achtung', 'Anzeige', 'Verurteilung', 'addieren'],
	items: ['Sichergestellt', 'Messer', 'Pfefferpistolen', 'Sturmhauben', 'Axt'],
	suspects: ['hessenschau', 'zwei', 'Tatverdächtige', 'Halloween-Krawalle', 'Insgesamt', 'Polizei', '99', 'ermittelt'],
	debate: ['Innenminister', 'Poseck', 'Sicherheitsgewinn', 'Kritiker', 'Stadtpolitik', 'Aussehen', 'widerspricht', 'Freitag', 'weitergehen'],
	outro: ['Sinnvolle', 'Vorsorge', 'Kontrolle', 'Folgt', 'FrankfurtRed3'],
};
