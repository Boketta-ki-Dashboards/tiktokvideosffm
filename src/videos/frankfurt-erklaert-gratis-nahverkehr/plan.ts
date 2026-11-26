import type {SceneSpec} from '../../lib/timeline';

/**
 * Szenenplan #19 „Frankfurt macht Bus und Bahn kostenlos – ausgerechnet am 12. Dezember“: Titelbild (0,00 €, Straßenbahn in weihnachtlicher
 * Innenstadt) → Maßnahmenpaket (Römer, Ziele) → zwei Kalenderblätter 12./19.12. + „0,00 €“ → Verkehrsmittel (Bus, Straßenbahn, U-Bahn, S-Bahn)
 * mit Uhr 0–5 Uhr → Tarifkarte 2,5D (Tarifgebiet 5000, Flughafen 5090 ausgenommen, S-Bahn aus dem Umland bis zur Stadtgrenze) → Hintergrund
 * (Zeil, 31.10. → Belebung) → Kosten (400.000 € laut FAZ, unversicherte Schäden) → Weihnachtsgeschäft (Kampagne, 6. Januar) → zwei Ereignisse,
 * ein Datum (aufwendigste Szene) → Einordnung „Direkter Zusammenhang nicht belegt“ → Abo-Aufruf FrankfurtRedNews.
 */
export const GRATIS_SCENES: SceneSpec[] = [
	{id: 'cover', segmentIds: ['hook1', 'hook2'], minSeconds: 1},
	{id: 'paket', segmentIds: ['a1'], transitionInFrames: 8},
	{id: 'termine', segmentIds: ['a2'], transitionInFrames: 8},
	{id: 'fahrzeuge', segmentIds: ['b1'], transitionInFrames: 8},
	{id: 'tarif', segmentIds: ['c1', 'c2'], transitionInFrames: 8},
	{id: 'hintergrund', segmentIds: ['d1'], transitionInFrames: 8},
	{id: 'kosten', segmentIds: ['d2', 'd3'], transitionInFrames: 8},
	{id: 'kampagne', segmentIds: ['e1'], transitionInFrames: 8},
	{id: 'datum', segmentIds: ['f0', 'f1', 'f2'], transitionInFrames: 8},
	{id: 'einordnung', segmentIds: ['f3'], transitionInFrames: 8},
	{id: 'outro', segmentIds: ['cta'], transitionInFrames: 8},
];

/** Schlüsselwörter für bildgenaue Einblendungen (Zahlen exakt ohne Satzzeichen, Wörter per Wortanfang). */
export const GRATIS_KEYWORDS: Record<string, string[]> = {
	cover: ['Ewa', 'Frankfurt', 'Bus', 'Bahn', 'kostenlos', 'ausgerechnet', '12'],
	paket: ['Stadt', 'Mittwoch', 'Paket', 'Innenstadt', 'Handel'],
	termine: ['zwei', 'Samstagen', '12', '19', 'Busse', 'Tarifgebiet', 'kostenlos'],
	fahrzeuge: ['Bus', 'Straßenbahn', 'U-', 'S-Bahn', '0', '5', 'Sonntagmorgen'],
	tarif: ['Achtung', 'Flughafen', 'ausgenommen', 'Umland', 'Offenbach', 'Stadtgrenze', 'normalen'],
	hintergrund: ['Hintergrund', 'Ausschreitungen', '31', 'Handel', 'Hilfe'],
	kosten: ['Freifahrten', 'FAZ', '400.000', 'Händlern', 'Versicherung', 'Sachschäden'],
	kampagne: ['Werbekampagne', 'Weihnachtsshopping', '6', 'Januar', 'Einkaufsaktion'],
	datum: ['Spannend', 'Termin', 'Gen', '12', 'Frankfurt', 'Protesttag', 'angekündigt', 'Gratis-Nahverkehr', 'Weihnachtsshopping', 'Demo', 'Samstag'],
	einordnung: ['direkter', 'Zusammenhang', 'belegt'],
	outro: ['Nachrichten', 'Frankfurt', 'folgt', 'FrankfurtRedNews'],
};
