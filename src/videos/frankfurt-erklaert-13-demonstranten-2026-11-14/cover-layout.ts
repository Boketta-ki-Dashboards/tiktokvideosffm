/**
 * Titelbild-Layout „Nur 13 Demonstranten?“ (y in px bei 1080 × 1920) – nach COVER_ZONE, kompakt um die Bildmitte und tiefer:
 * Serientitel ab 410, große „13“ 524–850, Mannschaftswagen-Reihe 700–860 (hinter dem unteren Teil der 13), rote Karte 890,
 * Unterzeile 980, kleine Zeile 1036, Logo + Account 1236–1290 (im Video über dem Untertitel-Band), im PNG zusätzlich die Frage 1340–1420.
 * Test: tests/erklaert-13-demonstranten.test.ts.
 */
export const DEMO13_COVER_LAYOUT = {
	brandTop: 410,
	brandBottom: 512,
	vansTop: 700,
	vansBottom: 860,
	bigTop: 524,
	bigSize: 330,
	bigBottom: 860,
	cardTop: 890,
	/** rote Karte „NUR 13 DEMONSTRANTEN?!“: Breite ≤ 720 mittig → rechte Kante ≤ 900 (App-Knöpfe ab x 930) */
	cardFont: 44,
	cardMaxWidth: 720,
	subTop: 980,
	subSize: 27,
	smallTop: 1036,
	smallBottom: 1070,
	metaTop: 1236,
	metaBottom: 1290,
	chipsTop: 1340,
	chipsBottom: 1420,
	sideMin: 96,
} as const;
