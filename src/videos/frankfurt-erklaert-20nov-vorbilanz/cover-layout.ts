/**
 * Titelbild-Layout „Frankfurt 20.11. – die erste Bilanz“ (#14; y in px bei 1080 × 1920) – nach COVER_ZONE, im etablierten Stil:
 * Serientitel 400–502, „FRANKFURT 20.11.“ 518–584, groß „DIE ERSTE / BILANZ!“ 598–842, rote Karte „WAS IST HEUTE PASSIERT?“ 860–924,
 * Plakette „VORBILANZ · STAND …“ 940–990 (endet über y 1000), Tages-Zeitleiste 1012–1189 (x 100–900, links der App-Knöpfe),
 * Logo + Account 1236–1290; im PNG zusätzlich „STAND …, KEINE ENDBILANZ“ 1340–1410. Test: tests/erklaert-20nov-vorbilanz.test.ts.
 */
export const VORBILANZ_COVER_LAYOUT = {
	brandTop: 400,
	brandBottom: 502,
	kickerTop: 518,
	kickerSize: 62,
	kickerBottom: 584,
	bigTop: 598,
	bigSize: 122,
	/** zwei Zeilen à 122 px, Zeilenhöhe 1,0 */
	bigBottom: 842,
	/** „DIE ERSTE“ bei 122 px Montserrat 900 ≈ 820 px */
	bigMaxWidth: 880,
	cardTop: 860,
	cardFont: 40,
	cardBottom: 924,
	tagTop: 940,
	tagBottom: 990,
	timelineTop: 1012,
	timelineLeft: 100,
	timelineWidth: 800,
	timelineOrb: 72,
	/** dayTimelineGeometry('full', 72).height = 177 */
	timelineBottom: 1189,
	metaTop: 1236,
	metaBottom: 1290,
	thumbTop: 1340,
	thumbBottom: 1410,
	sideMin: 96,
} as const;
