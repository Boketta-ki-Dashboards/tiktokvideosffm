import type {SceneSpec} from '../../lib/timeline';

/**
 * Szenenplan „76 Fragen – Teil 2“: Schnitte folgen den Adam-Sätzen; kurze Übergänge (8–10 Frames), damit die nächste
 * Grafik schon beim letzten Wort der vorherigen Aussage einsetzt. Gesamtlänge ≤ 60 s.
 */
export const TEIL2_SCENES: SceneSpec[] = [
	{id: 'cover', segmentIds: ['hook1', 'hook2'], minSeconds: 4},
	{id: 'police', segmentIds: ['pol1', 'pol2'], transitionInFrames: 10},
	{id: 'numbers', segmentIds: ['num1', 'num2', 'num3'], transitionInFrames: 10},
	{id: 'tiktok', segmentIds: ['tiktok'], transitionInFrames: 10},
	{id: 'nov20', segmentIds: ['nov1', 'nov2'], transitionInFrames: 10},
	{id: 'contro', segmentIds: ['contro', 'note'], transitionInFrames: 10},
	{id: 'outro', segmentIds: ['end'], transitionInFrames: 8},
];

export const TEIL2_KEYWORDS: Record<string, string[]> = {
	cover: ['Ewa', '76', 'Landtag', 'Antworten'],
	police: ['Polizei', 'Poseck', '1.300', 'geplündert', 'geklärt'],
	numbers: ['Zahlen', '181', '13', '73', 'zwei', 'Hälfte', 'Viertel'],
	tiktok: ['TikTok', 'Straftaten', 'belegt'],
	nov20: ['20', 'Maßnahmen', 'Auflagen', 'präventiver', 'Demo-Verbot'],
	contro: ['umstrittene', 'migrantisch', 'Minister', 'Verdächtige', 'friedlich'],
	outro: ['offen', 'reichen'],
};
