/**
 * Titelbild-Layout „Gen-Z-Proteste: Hamburg, Leipzig …“ (#15; y in px bei 1080 × 1920) – nach COVER_ZONE, im etablierten Stil:
 * Serientitel 400–502, „GEN-Z-PROTESTE · 20.11.“ 518–576, groß „HAMBURG / LEIPZIG“ 590–826, „+ BERLIN · STUTTGART · BREMEN“ 838–876,
 * rote Karte „WAS IST PASSIERT?“ 892–954, Plakette „NACHBETRACHTUNG · STAND 21.11.“ 966–1000 (Oberkante der App-Knöpfe nicht überschritten),
 * 2,5D-Deutschlandkarte mit den sechs Städten darunter (x ≤ 930), Logo + Account 1236–1290; im PNG zusätzlich die Quellenzeile 1340–1410.
 * Test: tests/erklaert-20nov-staedte.test.ts.
 */
export const STAEDTE_COVER_LAYOUT = {
	brandTop: 400,
	brandBottom: 502,
	kickerTop: 518,
	kickerSize: 52,
	kickerBottom: 576,
	bigTop: 590,
	bigSize: 118,
	/** zwei Zeilen à 118 px, Zeilenhöhe 1,0 */
	bigBottom: 826,
	/** „HAMBURG“ bei 118 px Montserrat 900 ≈ 640 px */
	bigMaxWidth: 880,
	moreTop: 838,
	moreBottom: 876,
	cardTop: 892,
	cardFont: 40,
	cardBottom: 954,
	tagTop: 962,
	tagBottom: 1000,
	/** Kartenbereich (Deutschland samt Stadtmarken) */
	mapTop: 1010,
	mapBottom: 1226,
	mapRight: 900,
	metaTop: 1236,
	metaBottom: 1290,
	thumbTop: 1340,
	thumbBottom: 1410,
	sideMin: 96,
} as const;
