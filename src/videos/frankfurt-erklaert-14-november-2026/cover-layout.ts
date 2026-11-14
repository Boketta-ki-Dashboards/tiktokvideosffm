/**
 * Titelbild-Layout Sondervideo 14.11. (y in px bei 1080 × 1920) – nach COVER_ZONE, kompakt in der Bildmitte:
 * Serientitel ab 440, Kalenderblatt 520–905, gelbes Datum 930, rote Themenkarte 1046, Unterzeile 1160, Account 1236–1290
 * (im Video über dem Untertitel-Band), im PNG zusätzlich die Ortszeile 1344–1416. Test: tests/erklaert-14-november.test.ts.
 */
export const NOV14_COVER_LAYOUT = {
	brandTop: 440,
	brandBottom: 546,
	calendarTop: 572,
	calendarWidth: 300,
	calendarBottom: 908,
	dateTop: 930,
	dateSize: 96,
	cardTop: 1046,
	/** rote Karte „DOCH EINE GEN-Z-DEMO?“: Breite ≤ 760 mittig → rechte Kante ≤ 920 (App-Knöpfe ab x 930) */
	cardFont: 54,
	cardMaxWidth: 760,
	subTop: 1160,
	metaTop: 1236,
	metaBottom: 1290,
	chipsTop: 1344,
	chipsBottom: 1416,
	sideMin: 96,
} as const;
