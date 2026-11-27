/**
 * Titelbild-Layout #19 „Frankfurt macht Bus und Bahn kostenlos“ (y in px bei 1080 × 1920) – nach COVER_ZONE, im
 * etablierten Stil: Serientitel 400–502, „BUS & BAHN IN FRANKFURT“ 518–566, riesig „0,00 €“ 582–752, rote Karte „AUSGERECHNET AM 12.12.!“
 * 772–836, Plakette „12. + 19. DEZEMBER · STAND 26.11.“ 852–898 (endet über den App-Knöpfen), Straßenbahn in weihnachtlicher Innenstadt vor der
 * Skyline 914–1222 (x ≤ 900), Logo + Account 1236–1290; im PNG zusätzlich „KOSTENLOS – WAS GILT?“ 1340–1410.
 * Test: tests/erklaert-gratis-nahverkehr.test.ts.
 */
export const GRATIS_COVER_LAYOUT = {
	brandTop: 400,
	brandBottom: 502,
	kickerTop: 518,
	kickerSize: 40,
	kickerBottom: 566,
	bigTop: 582,
	bigSize: 190,
	bigBottom: 752,
	bigMaxWidth: 880,
	cardTop: 772,
	cardFont: 46,
	cardBottom: 836,
	tagTop: 852,
	tagBottom: 898,
	artTop: 914,
	artBottom: 1222,
	artRight: 900,
	metaTop: 1236,
	metaBottom: 1290,
	thumbTop: 1340,
	thumbBottom: 1410,
	sideMin: 96,
} as const;
