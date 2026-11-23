/**
 * Inhalte „Zwei Flugzeuge – Passagiere krank an Bord“ (Format B #17, produziert 23.11.2026, Ereignis Sonntag 22.11.2026).
 * Belege: references/frankfurt-erklaert-condor-fluege/sources.md. Grundsätze: 620 = alle Menschen an Bord, NICHT die Zahl der Erkrankten;
 * abweichende Betroffenenzahlen (laut Condor ≈ 30, andere Berichte ≈ 40) getrennt nennen; keine Notlandung, keine Lebensgefahr, keine
 * Diagnose – Norovirus nur als unbestätigter Verdacht aus Medienberichten; keine Schuldzuweisung an Airline, Bordverpflegung oder Reederei.
 */

/** Letzter Faktencheck (MEZ) – im Bild, nicht im Ton. */
export const STAND = {date: '23.11.2026', time: '11:30', label: 'STAND 23.11.2026'} as const;

/** Flughäfen (Lage für die Karte): La Romana (LRM) und Frankfurt (FRA), [Länge, Breite]. */
export const AIRPORTS = {
	origin: {code: 'LRM', name: 'LA ROMANA', country: 'DOMINIKANISCHE REPUBLIK', at: [-68.9118, 18.4507] as [number, number]},
	dest: {code: 'FRA', name: 'FRANKFURT', country: 'DEUTSCHLAND', at: [8.5622, 50.0379] as [number, number]},
};

/** Die beiden Flüge laut aeroTELEGRAPH (22.11.2026) – Flugnummern und Ankunftszeiten nur im Bild. */
export const FLIGHTS = [
	{no: 'DE3705', arrival: '9:32 Uhr'},
	{no: 'DE3845', arrival: '10:56 Uhr'},
] as const;
export const FLIGHTS_BY = 'Flugnummern + Ankunft laut aeroTELEGRAPH';

export const COVER = {
	kicker: 'FLUGHAFEN FRANKFURT · SONNTAG 22.11.',
	big: '2 FLÜGE',
	card: 'PASSAGIERE KRANK AN BORD',
	tag: 'URSACHE UNKLAR',
	thumb: 'WAS IST AM FLUGHAFEN PASSIERT?',
};

/** Beschwerden laut Condor (Sprecherin gegenüber hessenschau, 22.11.2026). */
export const SYMPTOMS = ['ÜBELKEIT', 'UNWOHLSEIN', 'ERBRECHEN'] as const;
export const SYMPTOMS_BY = 'laut Condor';

/** Menschen an Bord und Betroffene. */
export const ONBOARD = {
	total: 620,
	totalLabel: 'MENSCHEN AN BORD',
	totalBy: 'beide Maschinen zusammen · laut hessenschau „rund 620 Personen“',
	notAll: 'NICHT ALLE WAREN KRANK',
	condor: 30,
	condorBy: 'laut Condor rund 30 betroffen',
	reports: 40,
	reportsBy: 'andere Berichte: rund 40',
	note: 'Genaue Zahl offiziell nicht bestätigt',
};

/** Rettungseinsatz. */
export const EINSATZ = {
	ready: 'RETTUNGSKRÄFTE BEREIT',
	readySub: 'schon während die Flugzeuge in der Luft waren',
	readyBy: 'laut hessenschau',
	extra: 'VORSORGLICH ZUSÄTZLICHE KRÄFTE',
	extraBy: 'laut Fraport',
	board: 'UNTERSUCHUNG AN BORD',
	boardBy: 'medizinische Teams · laut Fraport',
};

/** Zwei Klinikaufnahmen. */
export const KLINIK = {
	count: 2,
	label: 'PERSONEN IM KRANKENHAUS',
	reasons: ['1 × Kreislaufprobleme', '1 × auf eigenen Wunsch'],
	reasonsBy: 'Gründe laut Condor',
	perFlight: 'je eine Person aus jedem Flug',
	rest: 'ALLE ANDEREN: REISE FORTGESETZT',
};

/** Ursache – nur Verdacht. */
export const URSACHE = {
	question: 'NOROVIRUS?',
	stamp: 'NICHT BESTÄTIGT',
	reportBy: 'Verdacht laut Medienberichten',
	unclear: 'URSACHE NOCH UNKLAR',
	cruise: 'Charterflüge nach einer Kreuzfahrt',
	cruiseBy: 'laut Condor',
	before: 'Betroffene schon vor dem Abflug krank',
	beforeBy: 'laut hessenschau (hr-Informationen)',
};

/** Gesundheitsamt. */
export const AMT = {
	building: 'GESUNDHEITSAMT FRANKFURT',
	label: 'GESUNDHEITSAMT PRÜFT URSACHE',
	by: 'Fall wie vorgeschrieben gemeldet',
	cruise: 'Condor im Kontakt mit den Kreuzfahrtbetreibern',
	open: 'Ergebnis noch nicht veröffentlicht',
	result: 'ERGEBNIS: NOCH NICHT BEKANNT',
	link: 'gleiche Ursache auf beiden Flügen? OFFEN',
};

export const OUTRO = {
	cta: 'FOLGEN',
	ctaSub: 'FÜR MEHR NACHRICHTEN AUS FRANKFURT',
};

/** Quellenzeile unter den Untertiteln (≤ 112 Zeichen, keine URLs). */
export const SOURCE_LINE = [
	{from: 'hook2', text: 'hessenschau, 22.11.2026 (Stand 23.11.2026, 10:46 Uhr) · hessenschau-Ticker, 23.11.2026'},
	{from: 'a1', text: 'aeroTELEGRAPH, 22.11.2026 (Flüge aus La Romana) · hessenschau, 22.11.2026'},
	{from: 'a2', text: 'Condor-Sprecherin laut hessenschau, 22.11.2026 (Stand 23.11.2026, 10:46 Uhr)'},
	{from: 'b1', text: 'hessenschau, 22.11.2026: „rund 620 Personen“ in beiden Maschinen'},
	{from: 'b2', text: 'Condor laut hessenschau-Ticker, 23.11.2026, 9:59 Uhr · rund 40: Frankfurter Rundschau/Bild, aero.de'},
	{from: 'c1', text: 'hessenschau, 22.11.2026 (Stand 23.11.2026, 10:46 Uhr)'},
	{from: 'c2', text: 'Fraport laut dpa, 23.11.2026'},
	{from: 'd1', text: 'Condor laut hessenschau, 22.11.2026 · Fraport laut dpa, 23.11.2026'},
	{from: 'e2', text: 'Verdacht laut Medienberichten (Bild, aeroTELEGRAPH) – nicht bestätigt'},
	{from: 'e3', text: 'Condor laut hessenschau-Ticker, 23.11.2026, 9:59 Uhr · hr-Informationen'},
	{from: 'f1', text: 'Condor laut hessenschau, Stand 23.11.2026, 10:46 Uhr · hessenschau-Ticker, 23.11.2026'},
	{from: 'f2', text: 'Stand 23.11.2026, 11:30 Uhr: kein Ergebnis veröffentlicht (Condor, Fraport, Gesundheitsamt)'},
] as const;
