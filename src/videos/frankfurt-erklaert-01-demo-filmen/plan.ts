import type {SceneSpec} from '../../lib/timeline';

/** Szenenplan „Frankfurt erklärt #01“: Schnitte folgen den Adam-Sätzen (buildTimeline), Gesamtlänge ≤ 60 s. */
export const DEMO_FILMEN_SCENES: SceneSpec[] = [
	{id: 'hook', segmentIds: ['hook1', 'hook2'], minSeconds: 6},
	{id: 'demo', segmentIds: ['demo1', 'demo2'], transitionInFrames: 12},
	{id: 'film', segmentIds: ['film1', 'film2'], transitionInFrames: 12},
	{id: 'police', segmentIds: ['pol1', 'pol2'], transitionInFrames: 12},
	{id: 'dissolve', segmentIds: ['end1'], transitionInFrames: 10},
	{id: 'fazit', segmentIds: ['fazit'], transitionInFrames: 12},
	{id: 'outro', segmentIds: ['outro'], transitionInFrames: 10},
];

/** Schlüsselwörter (Anzeigetext der Untertitel) → Cue-Frames je Szene. */
export const DEMO_FILMEN_KEYWORDS: Record<string, string[]> = {
	hook: ['Ewa', 'Demo', 'plötzlich', 'Flaschen', 'Stress'],
	demo: ['Friedlich', 'Recht', 'Randaliert', 'automatisch', 'strafbar', 'Landfriedensbruch', 'mitmachst', 'unterstützt', 'anstachelst'],
	film: ['öffentlichen', 'filmen', 'erlaubt', 'Polizeieinsätze', 'behinder', 'Hochladen', 'Erkennbare', 'private', 'problematisch'],
	police: ['Polizei', 'kontrollieren', 'Zeuge', 'Videos', 'Beweise', 'Handy', 'sichergestellt', 'automatisch', 'Galerie'],
	dissolve: ['Versammlung', 'aufgelöst', 'unverzüglich', 'entfernen'],
	fazit: ['Fazit', 'ruhig', 'Abstand', 'sachlich', 'Kontrollgrund'],
	outro: ['Frankfurt', 'folgt'],
};
