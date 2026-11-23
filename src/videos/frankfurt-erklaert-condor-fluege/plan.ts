import type {SceneSpec} from '../../lib/timeline';

/**
 * Szenenplan #17 „Zwei Flugzeuge – Passagiere krank an Bord“: Titelbild (2 Flüge) → Route La Romana → Frankfurt (Weltkarte, zwei Jets)
 * → Kabine (Beschwerden laut Condor) → 620 an Bord ≠ Erkrankte (Personenraster, ≈ 30 laut Condor, ≈ 40 laut anderen Berichten) →
 * Rettungseinsatz auf dem Vorfeld (aufwendigste Szene: Anflug, wartende Einsatzfahrzeuge, dann Untersuchung an Bord) → 2 in Klinik →
 * Ursache (Norovirus? NICHT BESTÄTIGT, Kreuzfahrt laut Condor, laut hr schon vor Abflug krank) → Gesundheitsamt → Abo-Aufruf FrankfurtRedNews.
 */
export const CONDOR_SCENES: SceneSpec[] = [
	{id: 'cover', segmentIds: ['hook1', 'hook2'], minSeconds: 1},
	{id: 'route', segmentIds: ['a1'], transitionInFrames: 8},
	{id: 'kabine', segmentIds: ['a2'], transitionInFrames: 8},
	{id: 'bord', segmentIds: ['b1', 'b2'], transitionInFrames: 8},
	{id: 'einsatz', segmentIds: ['c1', 'c2'], transitionInFrames: 8},
	{id: 'klinik', segmentIds: ['d1', 'd2'], transitionInFrames: 8},
	{id: 'ursache', segmentIds: ['e1', 'e2', 'e3'], transitionInFrames: 8},
	{id: 'amt', segmentIds: ['f1', 'f2'], transitionInFrames: 8},
	{id: 'outro', segmentIds: ['cta'], transitionInFrames: 8},
];

/** Schlüsselwörter für bildgenaue Einblendungen (Zahlen exakt ohne Satzzeichen, Wörter per Wortanfang). */
export const CONDOR_KEYWORDS: Record<string, string[]> = {
	cover: ['Ewa', 'Frankfurt', 'Flugzeuge', 'Bord', 'Passagiere', 'Übelkeit'],
	route: ['Sonntag', 'Condor-Maschinen', 'La', 'Romana', 'Dominikanischen', 'Frankfurt'],
	kabine: ['Flüge', 'Reisende', 'Übelkeit', 'Unwohlsein', 'Erbrechen'],
	bord: ['Bord', '620', 'Menschen', 'wichtig', 'Nicht', 'krank', 'Condor', '30', 'Berichte', '40'],
	einsatz: ['Lage', 'unklar', 'Rettungskräfte', 'Landung', 'Fraport', 'zusätzlichen', 'medizinische', 'untersuchten', 'Bord'],
	klinik: ['Zwei', 'Krankenhaus', 'Condor', 'Kreislaufproblemen', 'Wunsch', 'anderen', 'fortsetzen'],
	ursache: ['dahinter', 'Medien', 'Norovirus-Verdacht', 'bestätigt', 'Charterflüge', 'Kreuzfahrt', 'hessenschau', 'Abflug'],
	amt: ['Gesundheitsamt', 'eingeschaltet', 'klären', 'Ergebnis', 'bekannt'],
	outro: ['Nachrichten', 'Frankfurt', 'folgt', 'FrankfurtRedNews'],
};
