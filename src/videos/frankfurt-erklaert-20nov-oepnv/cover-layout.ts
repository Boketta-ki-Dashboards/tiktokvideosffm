/**
 * Titelbild-Layout „Frankfurt morgen: Diese Bahnen sind betroffen!“ (#11; y in px bei 1080 × 1920) – nach COVER_ZONE, im etablierten Stil:
 * Serientitel ab 400, „FRANKFURT“ 516, große Zeile „MORGEN!“ 610–742, rote Karte „DIESE BAHNEN SIND BETROFFEN“ 762–830,
 * Grafik Uhr + Straßenbahn 848–998 (rechte Kante ≤ 930, endet über y 1000), Linienschilder „11 · 12 · 14 AB 9 UHR“ 1014–1076, Datum 1094, Logo + Account 1236–1290,
 * im PNG zusätzlich die Frage 1340–1420. Test: tests/erklaert-20nov-oepnv.test.ts.
 */
export const OEPNV_COVER_LAYOUT = {
	brandTop: 400,
	brandBottom: 502,
	kickerTop: 516,
	kickerSize: 84,
	bigTop: 610,
	bigSize: 132,
	bigBottom: 742,
	/** „MORGEN!“ bei 132 px Montserrat 900 ≈ 740 px → mittig ≈ 170–910; Obergrenze für den Test */
	bigMaxWidth: 860,
	cardTop: 762,
	cardFont: 42,
	cardMaxWidth: 790,
	cardBottom: 830,
	vizTop: 848,
	vizLeft: 150,
	vizWidth: 780,
	vizBottom: 998,
	/** Linienschilder 11 · 12 · 14 + „AB 9 UHR“ (58 px) */
	smallTop: 1014,
	smallBottom: 1076,
	/** Datum „FREITAG · 20. NOVEMBER 2026“ */
	dateTop: 1094,
	dateBottom: 1130,
	metaTop: 1236,
	metaBottom: 1290,
	questionTop: 1340,
	questionBottom: 1420,
	sideMin: 96,
} as const;
