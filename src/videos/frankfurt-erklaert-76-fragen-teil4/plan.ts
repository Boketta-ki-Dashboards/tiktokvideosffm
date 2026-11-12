import type {SceneSpec} from '../../lib/timeline';

/**
 * Szenenplan „76 Fragen – Teil 4“: Titelbild → vier Antworten (Antwort 1 am längsten, ≈ 18 s) → Zusammenfassung + Abo-Aufruf.
 * Schnitte an den Adam-Sätzen, Übergänge ≤ 10 Frames. Ausnahme Länge: Informationsteil ≤ 61,5 s, danach `cta` (gesamt ≤ 66 s).
 */
export const TEIL4_SCENES: SceneSpec[] = [
	{id: 'cover', segmentIds: ['hook1', 'hook2'], minSeconds: 3},
	{id: 'spots', segmentIds: ['p1a', 'p1b', 'p1c', 'p1d'], transitionInFrames: 10},
	{id: 'damage', segmentIds: ['p2a', 'p2b'], transitionInFrames: 10},
	{id: 'weapons', segmentIds: ['p3a', 'p3b', 'p3c', 'p3d'], transitionInFrames: 10},
	{id: 'justice', segmentIds: ['p4a', 'p4b', 'p4c'], transitionInFrames: 10},
	{id: 'outro', segmentIds: ['end', 'cta'], transitionInFrames: 8},
];

/** Schlüsselwörter für bildgenaue Einblendungen (Zahlen exakt, Wörter per Wortanfang). */
export const TEIL4_KEYWORDS: Record<string, string[]> = {
	cover: ['Ewa', 'Antworten', 'vier', 'Erkenntnisse'],
	spots: ['Erstens', 'Polizei', '30', 'Einsatzorte', 'verteilt', 'Straßen', 'Gassen', 'Innenhöfe', 'Randalierer', 'verlagerten', 'erklärt', 'richtig', 'beantwortet'],
	damage: ['Zweitens', 'Anfangsbilanz', '17', '5', 'Wiesbadener', 'Poseck', '35', '6', 'sechsstelligen'],
	weapons: ['Drittens', 'Waffengeschäft', 'Polizei', 'Schreckschusswaffen', 'sichergestellt', '18-Jähriger', 'Untersuchungshaft', 'Vorwurf', 'Verurteilung'],
	justice: ['Viertens', '110', 'Strafanzeigen', '53', 'Festnahmen', 'Minister', '73', 'Tatverdächtige', 'verdächtig', 'verurteilt'],
	outro: ['waren', 'Antworten', 'Folgt', 'FrankfurtRed3', 'mehr'],
};
