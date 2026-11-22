/**
 * Titelbild-Layout „Nach dem 20. November: Schon die nächste Demo geplant?“ (#16; y in px bei 1080 × 1920) – nach COVER_ZONE, im etablierten
 * Stil: Serientitel 400–502, „GEN Z REGELT · NACH DEM 20.11.“ 518–570, Kalenderblatt + riesige „12.12.“ 588–842, rote Karte „SCHON DIE NÄCHSTE
 * DEMO?“ 862–926, Plakette „ANGEKÜNDIGT · 73 STÄDTE · STAND 22.11.“ 944–990 (endet über den App-Knöpfen), Mini-Deutschlandkarte 1010–1222
 * (x ≤ 900), Logo + Account 1236–1290; im PNG zusätzlich „WIE GEHT ES IN FRANKFURT WEITER?“ 1340–1410. Test: tests/erklaert-12dez-ausblick.test.ts.
 */
export const AUSBLICK_COVER_LAYOUT = {
	brandTop: 400,
	brandBottom: 502,
	kickerTop: 518,
	kickerSize: 44,
	kickerBottom: 570,
	bigTop: 588,
	bigSize: 210,
	bigBottom: 842,
	/** Kalenderblatt (links) + „12.12.“ (rechts) zusammen ≤ 880 px */
	bigMaxWidth: 880,
	cardTop: 862,
	cardFont: 40,
	cardBottom: 926,
	tagTop: 944,
	tagBottom: 990,
	mapTop: 1010,
	mapBottom: 1222,
	mapRight: 900,
	metaTop: 1236,
	metaBottom: 1290,
	thumbTop: 1340,
	thumbBottom: 1410,
	sideMin: 96,
} as const;
