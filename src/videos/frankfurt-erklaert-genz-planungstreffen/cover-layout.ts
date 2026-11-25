/**
 * Titelbild-Layout #18 „Gen Z regelt Frankfurt – was soll sich am 12. Dezember ändern?“ (y in px bei 1080 × 1920) – nach COVER_ZONE, im
 * etablierten Stil: Serientitel 400–502, „GEN Z REGELT FRANKFURT“ 518–566, riesig „12.12.“ 582–752, rote Karte „WAS SOLL SICH ÄNDERN?“
 * 772–836, Plakette „NEUSTART GEPLANT? · STAND 25.11.“ 852–898 (endet über den App-Knöpfen), Kalenderleiste 31.10. · 20.11. → 12.12. mit
 * Skyline 914–1222 (x ≤ 900), Logo + Account 1236–1290; im PNG zusätzlich „KRITIK + PLANUNGSTREFFEN“ 1340–1410.
 * Test: tests/erklaert-genz-planungstreffen.test.ts.
 */
export const PLANUNG_COVER_LAYOUT = {
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
