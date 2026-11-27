/**
 * Titelbild-Layout „73 Städte – ein Protesttag!“ (#12; y in px bei 1080 × 1920) – nach COVER_ZONE, im etablierten Stil:
 * Serientitel 400–502, große „73“ 512–790 (mittig, Deutschlandkarte mit 73 Punkten dahinter), rote Karte „STÄDTE – EIN PROTESTTAG“ 806–874,
 * Datum 894–930, Zeile „4 ZENTRAL · 69 ANGESCHLOSSEN“ 950–994 (endet über y 1000, rechte Kante ≤ 930), Logo + Account 1236–1290,
 * im PNG zusätzlich die Frage „WAS PASSIERT MORGEN?“ 1340–1420. Test: tests/erklaert-20nov-bundesweit.test.ts.
 */
export const BUNDESWEIT_COVER_LAYOUT = {
	brandTop: 400,
	brandBottom: 502,
	bigTop: 512,
	bigSize: 300,
	bigBottom: 790,
	/** „73“ bei 300 px Montserrat 900 ≈ 390 px breit */
	bigMaxWidth: 520,
	cardTop: 806,
	cardFont: 46,
	cardMaxWidth: 790,
	cardBottom: 874,
	dateTop: 894,
	dateBottom: 930,
	splitTop: 950,
	splitBottom: 994,
	splitMaxWidth: 760,
	metaTop: 1236,
	metaBottom: 1290,
	questionTop: 1340,
	questionBottom: 1420,
	sideMin: 96,
} as const;
