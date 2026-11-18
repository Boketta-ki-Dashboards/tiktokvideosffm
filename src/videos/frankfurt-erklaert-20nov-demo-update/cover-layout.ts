/**
 * Titelbild-Layout „Gen-Z-Demo am 20.11. geändert!“ (#10; y in px bei 1080 × 1920) – nach COVER_ZONE, im etablierten Stil der Vorgänger:
 * Serientitel ab 400, Kicker „GEN-Z-DEMO AM 20.11.“ 520, große Zeile „GEÄNDERT!“ 584–712, rote Karte „KUNDGEBUNG STATT DEMOZUG“ 740–812,
 * Vorher/Nachher-Mini-Grafik 840–990 (rechte Kante ≤ 930, endet über y 1000), kleine Zeile „WESELER WERFT · 14–16:30 UHR“ 1016,
 * Logo + Account 1236–1290 (im Video über dem Untertitel-Band), im PNG zusätzlich die Frage 1340–1420.
 * Test: tests/erklaert-20nov-demo-update.test.ts.
 */
export const DEMOUPDATE_COVER_LAYOUT = {
	brandTop: 400,
	brandBottom: 502,
	kickerTop: 520,
	kickerSize: 54,
	bigTop: 584,
	bigSize: 128,
	bigBottom: 712,
	/** „GEÄNDERT!“ bei 128 px Montserrat 900 ≈ 800 px → mittig ≈ 140–940; Obergrenze für den Test */
	bigMaxWidth: 860,
	cardTop: 740,
	cardFont: 44,
	cardMaxWidth: 760,
	cardBottom: 812,
	vizTop: 840,
	vizLeft: 150,
	vizWidth: 780,
	vizBottom: 990,
	smallTop: 1016,
	smallBottom: 1052,
	metaTop: 1236,
	metaBottom: 1290,
	questionTop: 1340,
	questionBottom: 1420,
	sideMin: 96,
} as const;
