/**
 * Titelbild-Layout „4 Proteste – 1 Freitag“ (#09; y in px bei 1080 × 1920) – nach COVER_ZONE, im etablierten Stil der Vorgänger:
 * Serientitel ab 400, große Zeilen „4 PROTESTE“ / „1 FREITAG“ 512–772, Tages-Timeline 792–990 (rechte Kante ≤ 930, endet über
 * y 1000 → keine Kollision mit den App-Knöpfen), kleine Zeile 1012, Chip „4 GETRENNTE VERSAMMLUNGEN · LAUT STADT“ 1080–1140,
 * Logo + Account 1236–1290 (im Video über dem Untertitel-Band), im PNG zusätzlich die Frage 1340–1420.
 * Test: tests/erklaert-20nov-drei-proteste.test.ts.
 */
export const NOV20_COVER_LAYOUT = {
	brandTop: 400,
	brandBottom: 502,
	big1Top: 512,
	big2Top: 642,
	bigSize: 128,
	bigBottom: 772,
	/** „4 PROTESTE“ bei 128 px Montserrat 900 ≈ 790 px → mittig 145–935; Obergrenze für den Test */
	bigMaxWidth: 840,
	timelineTop: 792,
	timelineLeft: 150,
	timelineWidth: 780,
	timelineOrb: 84,
	timelineBottom: 990,
	smallTop: 1012,
	smallBottom: 1046,
	chipTop: 1080,
	chipBottom: 1140,
	metaTop: 1236,
	metaBottom: 1290,
	questionTop: 1340,
	questionBottom: 1420,
	sideMin: 96,
} as const;
