/**
 * Titelbild-Layout #17 „Zwei Flugzeuge – Passagiere krank an Bord“ (y in px bei 1080 × 1920) – nach COVER_ZONE, im etablierten Stil:
 * Serientitel 400–502, „FLUGHAFEN FRANKFURT · SONNTAG 22.11.“ 518–566, riesig „2 FLÜGE“ 582–752, rote Karte „PASSAGIERE KRANK AN BORD“
 * 772–836, Plakette „URSACHE UNKLAR · STAND 23.11.“ 852–898 (endet über den App-Knöpfen), Vorfeld-Illustration mit Jet + Rettungswagen
 * 914–1222 (x ≤ 900), Logo + Account 1236–1290; im PNG zusätzlich „WAS IST AM FLUGHAFEN PASSIERT?“ 1340–1410.
 * Test: tests/erklaert-condor-fluege.test.ts.
 */
export const CONDOR_COVER_LAYOUT = {
	brandTop: 400,
	brandBottom: 502,
	kickerTop: 518,
	kickerSize: 40,
	kickerBottom: 566,
	bigTop: 582,
	bigSize: 190,
	bigBottom: 752,
	bigMaxWidth: 880,
	cardTop: 772,
	cardFont: 42,
	cardBottom: 836,
	tagTop: 852,
	tagBottom: 898,
	artTop: 914,
	artBottom: 1222,
	artRight: 900,
	metaTop: 1236,
	metaBottom: 1290,
	thumbTop: 1340,
	thumbBottom: 1410,
	sideMin: 96,
} as const;
