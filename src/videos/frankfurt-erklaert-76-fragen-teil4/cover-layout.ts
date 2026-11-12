/**
 * Titelbild-Layout Teil 4 (y in px bei 1080 × 1920) – nach COVER_ZONE und noch etwas tiefer als Teil 3:
 * Serientitel ab 446, Themenkarte ab 1072, im Video alles über dem Untertitel-Band (≤ 1300), im PNG zusätzlich die
 * Antwortzeile 1346–1420. Wird von tests/erklaert-76-teil4.test.ts gegen COVER_ZONE geprüft.
 */
export const TEIL4_COVER_LAYOUT = {
	brandTop: 446,
	brandBottom: 552,
	numberTop: 548,
	numberSize: 340,
	numberBottom: 854,
	partTop: 600,
	partRight: 924,
	landtagTop: 790,
	landtagWidth: 760,
	kickerTop: 1006,
	cardTop: 1072,
	subTop: 1192,
	metaTop: 1250,
	metaBottom: 1300,
	chipsTop: 1346,
	chipsBottom: 1420,
	sideMin: 96,
} as const;
