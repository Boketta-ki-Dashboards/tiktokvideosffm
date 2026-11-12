import type {SceneSpec} from '../../lib/timeline';

/** Szenenplan „Polizeikontrollen auf der Zeil“: Schnitte folgen den Adam-Sätzen (buildTimeline). */
export const POLICE_RIGHTS_SCENES: SceneSpec[] = [
	{id: 'hook', segmentIds: ['hook1', 'hook2', 'hook3'], minSeconds: 6},
	{id: 'why', segmentIds: ['why1', 'why2'], transitionInFrames: 16},
	{id: 'phone', segmentIds: ['pho1', 'pho2', 'pho3', 'pho4'], transitionInFrames: 16},
	{id: 'law', segmentIds: ['law1', 'law2', 'law3', 'law4'], transitionInFrames: 16},
	{id: 'tips', segmentIds: ['tip1', 'tip2', 'tip3'], transitionInFrames: 16},
	{id: 'balance', segmentIds: ['bal1'], transitionInFrames: 16},
	{id: 'question', segmentIds: ['end1'], transitionInFrames: 16},
	{id: 'outro', segmentIds: ['outro'], transitionInFrames: 12},
];

/** Schlüsselwörter (Anzeigetext der Untertitel) → Cue-Frames je Szene. Zahlen müssen exakt passen, Wörter per Wortanfang. */
export const POLICE_RIGHTS_KEYWORDS: Record<string, string[]> = {
	hook: ['Ewa', 'Halloween', 'Zeil', 'Handy', 'Galerie'],
	why: ['31', 'Demo', 'Ausschreitungen', 'Plünderungen', 'Polizisten', 'Seitdem', 'hessenschau', 'Pauschalverdacht'],
	phone: ['Stadtverordneter', 'Handys', 'freiwillig', 'entlasten', 'bestätigt', 'Fotos', 'identifizieren', 'Zeugen', 'hochzuladen', 'Zeugenaufruf', 'Galerie'],
	law: ['Bruder', 'Identitätskontrolle', 'Personalien', 'automatisch', 'Fragt', 'Nein', 'Tatverdacht', 'Beweismittel', 'Gericht', 'Eilfällen', 'PIN', 'Fingerabdruck', 'Bundesgerichtshof'],
	tips: ['Checkt', 'ruhig', 'Weshalb', 'Ist', 'angeordnet', 'reicht', 'Beleidigung', 'Gegenwehr', 'löschen', 'Anwalt'],
	balance: ['Polizei', 'Rechte', 'Jungs', 'Halloween'],
	question: ['Ewa', 'Sicherheit', 'Kontrolle', 'Kommentare'],
	outro: ['Plus', 'nicht'],
};
