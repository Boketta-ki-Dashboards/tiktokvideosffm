/**
 * Titelbild-Layout „Über 2.150 Kontrollen auf der Zeil“ (#13; y in px bei 1080 × 1920) – nach COVER_ZONE, im etablierten Stil:
 * Serientitel 400–502, große „2.150+“ 520–752 (mittig), rote Karte „POLIZEIKONTROLLEN AUF DER ZEIL“ 772–838, Frage „WAS HAT DIE POLIZEI
 * GEFUNDEN?“ 856–902, Zeile „SEIT 1. NOVEMBER 2026 · LAUT INNENMINISTERIUM“ 918–950 (endet über y 1000), Logo + Account 1236–1290,
 * im PNG zusätzlich „BILANZ VOM 18.11.2026“ 1340–1410. Test: tests/erklaert-2150-kontrollen.test.ts.
 */
export const KONTROLLEN_COVER_LAYOUT = {
	brandTop: 400,
	brandBottom: 502,
	bigTop: 520,
	bigSize: 220,
	bigBottom: 752,
	/** „2.150+“ bei 220 px Montserrat 900 ≈ 760 px */
	bigMaxWidth: 880,
	cardTop: 772,
	cardFont: 40,
	cardMaxWidth: 840,
	cardBottom: 838,
	questionTop: 856,
	questionBottom: 902,
	smallTop: 918,
	smallBottom: 950,
	metaTop: 1236,
	metaBottom: 1290,
	thumbTop: 1340,
	thumbBottom: 1410,
	sideMin: 96,
} as const;
