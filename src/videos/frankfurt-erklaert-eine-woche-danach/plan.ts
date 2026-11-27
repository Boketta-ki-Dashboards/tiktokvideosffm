import type {SceneSpec} from '../../lib/timeline';

/**
 * Szenenplan #20 „Eine Woche nach den Gen-Z-Protesten“ (verlängerte Sonderausgabe, Informationsteil ≈ 70 s): Titelbild auf der
 * 2,5D-Deutschlandkarte (20.11. → 27.11., sechs Städte) → Kartenreise Leipzig (ausführlichster Abschnitt: Personen-Raster, Ermittlungsakte,
 * § 125a, Einordnung) → Hamburg (keine Gesamtzahl, Korrektur, zwei Anfragen vom 23.11.) → Dresden (rund 80 Personalien) → Stuttgart (über 20
 * vorläufige Festnahmen, Vorwürfe) → Berlin (rund 4.000, friedlich) → Frankfurt (10 Festnahmen, 16 Strafanzeigen, kurz) → letzte Rückkehr zur
 * Karte und bundesweites Dashboard aller sechs Städte (getrennte Karten, keine Rangliste) → Abo-Aufruf FrankfurtRedNews.
 * Jede Stadtszene beginnt mit dem Kartenflug zur Stadt (gleiche Kamera-Logik), danach das Stadtpanorama.
 */
export const WOCHE_SCENES: SceneSpec[] = [
	{id: 'cover', segmentIds: ['hook1', 'o1', 'o2'], minSeconds: 1},
	{id: 'leipzig', segmentIds: ['l1', 'l2', 'l3'], transitionInFrames: 8},
	{id: 'hamburg', segmentIds: ['h1', 'h2'], transitionInFrames: 8},
	{id: 'dresden', segmentIds: ['d1'], transitionInFrames: 8},
	{id: 'stuttgart', segmentIds: ['s1'], transitionInFrames: 8},
	{id: 'berlin', segmentIds: ['b1'], transitionInFrames: 8},
	{id: 'frankfurt', segmentIds: ['f1'], transitionInFrames: 8},
	{id: 'dashboard', segmentIds: ['z1', 'z2'], transitionInFrames: 8},
	{id: 'outro', segmentIds: ['cta'], transitionInFrames: 8},
];

/** Schlüsselwörter für bildgenaue Einblendungen (Zahlen exakt wie angezeigt, Wörter per Wortanfang). */
export const WOCHE_KEYWORDS: Record<string, string[]> = {
	cover: ['Ewa', 'Frankfurt', 'Woche', 'Jugendprotesten', '20', 'November', 'Ermittlungen', 'geworden', 'schauen', 'sechs', 'Städte'],
	leipzig: ['Leipzig', 'Demo', 'Polizei', 'Identität', '200', 'Personen', 'vier', 'Kinder', 'vierzig', 'Jugendliche', 'Staatsanwaltschaft', 'wertet', 'schweren', 'Landfriedensbruchs', 'Ermittelt', 'Brandstiftung', 'Körperverletzung', 'Wichtig', 'Beschuldigte', 'Verurteilten', 'vierzehn', 'strafunmündig'],
	hamburg: ['Hamburg', 'Polizei', 'mehrere', 'Festnahmen', 'Gewahrsamnahmen', 'Gesamtzahl', 'bekannt', '23', 'politische', 'Anfragen', 'Antwort'],
	dresden: ['Dresden', 'achtzig', 'Personen', 'Personalien', 'Verdacht', 'Landfriedensbruch'],
	stuttgart: ['Stuttgarts', 'zwanzig', 'vorläufige', 'Festnahmen', 'Vorwürfe', 'Vermummung', 'Beleidigung', 'Widerstand'],
	berlin: ['Anders', 'Berlin', 'viertausend', 'Menschen', 'Polizei', 'friedlich', 'Stadt'],
	frankfurt: ['Frankfurt', 'Innenministerium', 'zehn', 'Festnahmen', 'sechzehn', 'Strafanzeigen', 'Exzesse', 'Halloween'],
	dashboard: ['Hier', 'Bilanzen', 'sechs', 'Städte', 'meisten', 'Zahlen', 'Polizeimeldungen', 'Anklagen', 'Urteile', 'bekannt'],
	outro: ['Nachrichten', 'Frankfurt', 'folgt', 'FrankfurtRedNews'],
};
