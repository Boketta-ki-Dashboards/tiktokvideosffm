/**
 * Titelbild-Layout „Gen Z regelt – Phase 2“ (y in px bei 1080 × 1920) – nach COVER_ZONE, kompakt um die Bildmitte und
 * tiefer als frühere Cover: Serientitel ab 430, 2,5D-Deutschlandkarte 500–860, rote Themenkarte 880, große „20“ 968–1128,
 * Zeilen „VORLÄUFIGE FESTNAHMEN / IN BERLIN“ bis 1222, Account 1236–1290 (im Video über dem Untertitel-Band),
 * im PNG zusätzlich Unterzeile + Städtezeile 1330–1440. Test: tests/erklaert-genz-phase2.test.ts.
 */
export const PHASE2_COVER_LAYOUT = {
	brandTop: 430,
	brandBottom: 536,
	mapTop: 500,
	mapBottom: 860,
	cardTop: 880,
	/** rote Karte „GEN Z REGELT – PHASE 2“: Breite ≤ 720 mittig → rechte Kante ≤ 900 (App-Knöpfe ab x 930) */
	cardFont: 46,
	cardMaxWidth: 720,
	bigTop: 960,
	bigSize: 170,
	bigBottom: 1130,
	linesTop: 1000,
	linesLeft: 480,
	linesSize: 40,
	linesBottom: 1100,
	cityLineTop: 1140,
	cityLineBottom: 1186,
	metaTop: 1236,
	metaBottom: 1290,
	chipsTop: 1340,
	chipsBottom: 1440,
	sideMin: 96,
} as const;
