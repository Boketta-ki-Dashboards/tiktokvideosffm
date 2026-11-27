/**
 * Titelbild-Layout #20 „Gen Z: eine Woche danach“ (y in px bei 1080 × 1920) – nach COVER_ZONE, im etablierten Stil (wie #15–#19):
 * Serientitel 400–502, Kicker „GEN Z: EINE WOCHE DANACH“ 518–570, große Frage „WAS ERMITTELT DIE POLIZEI?“ (zweizeilig) 586–790,
 * Kalender-Plakette „20.11. → 27.11. · 7 TAGE“ 806–866, 2,5D-Deutschlandkarte mit sechs Städten 880–1222 (Marker x ≤ 900), Logo + Account
 * 1236–1290; im PNG zusätzlich „ERMITTLUNGEN · FESTNAHMEN · ANFRAGEN“ 1340–1410.
 * Test: tests/erklaert-eine-woche-danach.test.ts.
 */
export const WOCHE_COVER_LAYOUT = {
	brandTop: 400,
	brandBottom: 502,
	kickerTop: 518,
	kickerSize: 46,
	kickerBottom: 570,
	bigTop: 586,
	bigSize: 92,
	bigBottom: 790,
	bigMaxWidth: 900,
	tagTop: 806,
	tagBottom: 866,
	artTop: 880,
	artBottom: 1222,
	artRight: 900,
	metaTop: 1236,
	metaBottom: 1290,
	thumbTop: 1340,
	thumbBottom: 1410,
	sideMin: 96,
} as const;
