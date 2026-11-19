import type {SceneSpec} from '../../lib/timeline';

/**
 * Szenenplan „Frankfurt morgen: Diese Bahnen sind betroffen!“ (#11): Titelbild → Uhr 8:30 + Linien 11/12/14 + Straßenbahn →
 * OSM-Karte (kein Tram-Betrieb Hbf–Börneplatz, Umleitung über Sachsenhausen) + mögliche Auswirkungen 18/30/M36 → U-Bahn als Alternative (U4/U5, offene Stationen,
 * Hinweis Wochenende) → Hintergrund fünf Veranstaltungen → Vor der Fahrt checken + Frage → Abo-Aufruf mit Logo. Hartes Limit 60 s.
 */
export const OEPNV_SCENES: SceneSpec[] = [
	{id: 'cover', segmentIds: ['hook1', 'hook2'], minSeconds: 3},
	{id: 'tram', segmentIds: ['t1'], transitionInFrames: 8},
	{id: 'map', segmentIds: ['t2', 'm1'], transitionInFrames: 10},
	{id: 'ubahn', segmentIds: ['u1', 'u2', 'u3'], transitionInFrames: 10},
	{id: 'why', segmentIds: ['w1'], transitionInFrames: 8},
	{id: 'check', segmentIds: ['c1', 'q1'], transitionInFrames: 8},
	{id: 'outro', segmentIds: ['cta'], transitionInFrames: 8},
];

/** Schlüsselwörter für bildgenaue Einblendungen (Zahlen exakt ohne Satzzeichen, Wörter per Wortanfang). */
export const OEPNV_KEYWORDS: Record<string, string[]> = {
	cover: ['Ewa', 'Morgen', 'Straßenbahnen', 'anders', '8:30'],
	tram: ['VGF', 'Linien', '11', '12', '14', '8:30', 'Altstadtstrecke'],
	map: ['Komplettausfall', 'Rede', 'Strecke', 'Altstadt', 'Möglicherweise', '18', 'Busse', '30', 'M36', 'Kurt-Schumacher-', 'Konrad-Adenauer-Straße'],
	ubahn: ['gute', 'U1', 'U5', 'U8', 'Fahrplan', 'Willy-Brandt-Platz', 'Dom/Römer', 'offen', 'U4', 'Alternative', 'Hauptbahnhof', 'Konstablerwache', 'Achtung', 'Samstagfrüh', 'Testfahrten', 'Montag'],
	why: ['Hintergrund', 'Innenministerium', 'fünf', 'Versammlungen'],
	check: ['Änderungen', 'möglich', 'Checkt', 'VGF-Website', 'Anzeigen', 'Haltestelle', 'Linie', 'morgen'],
	outro: ['Folgt', 'FrankfurtRed3'],
};
