/**
 * Titelbild-Layout Teil 3 (y in px bei 1080 × 1920) – bewusst tiefer als Teil 2, alles in der Kernzone
 * (COVER_ZONE: 330–1450, im Video über den Untertiteln ≤ 1300) und im 3:4-Profilausschnitt (240–1680).
 * Wird von tests/erklaert-76-teil3.test.ts gegen COVER_ZONE geprüft.
 */
export const TEIL3_COVER_LAYOUT = {
	brandTop: 420,
	brandBottom: 528,
	numberTop: 520,
	numberSize: 360,
	numberBottom: 844,
	partTop: 576,
	partRight: 930,
	landtagTop: 756,
	landtagWidth: 780,
	kickerTop: 992,
	cardTop: 1060,
	subTop: 1184,
	metaTop: 1244,
	metaBottom: 1296,
	/** nur im PNG: Themenzeile im Band, in dem im Video die Untertitel stehen (≈ 1.320–1.440) */
	chipsTop: 1344,
	chipsBottom: 1420,
	sideMin: 96,
} as const;
