/**
 * Inhalte „Frankfurt macht Bus und Bahn kostenlos – ausgerechnet am 12. Dezember“ (Format B #19, FrankfurtRedNews, produziert 26.11.2026).
 * Belege: references/frankfurt-erklaert-gratis-nahverkehr/sources.md (+ wortlaute-2026-11-26.md). Grundsätze: zwei befristete Aktionstage
 * (keine dauerhafte Abschaffung der Fahrpreise), Geltungsbereich nur wie berichtet (Tarifgebiet 5000 inkl. Grenztarifgebiete, ohne 5090
 * Flughafen, Umland bis zur Stadtgrenze regulär), keine erfundenen Ticketregeln, Kosten nur „laut FAZ“, keine Umsatz- oder Schadenssummen,
 * Gen-Z-Demo nur als zeitliche Überschneidung – kein ursächlicher Zusammenhang, keine Aufforderung, keine Prognose.
 */

/** Letzter Faktencheck (MEZ) – im Bild, nicht im Ton. */
export const STAND = {date: '26.11.2026', time: '14:40', label: 'STAND 26.11.2026'} as const;

export const COVER = {
	kicker: 'BUS & BAHN IN FRANKFURT',
	big: '0,00 €',
	card: 'AUSGERECHNET AM 12.12.!',
	tag: '12. + 19. DEZEMBER',
	thumb: 'KOSTENLOS – WAS GILT?',
};

/** Ankündigung (Pressekonferenz Mi 25.11.2026). */
export const PAKET = {
	headline: 'MASSNAHMENPAKET DER STADT',
	when: 'VORGESTELLT AM MI 25.11.',
	by: 'OB Mike Josef mit dem Handelsverband Hessen (laut FAZ)',
	goals: ['INNENSTADT STÄRKEN', 'EINZELHANDEL UNTERSTÜTZEN', 'WEIHNACHTSGESCHÄFT'],
};

/** Die beiden Aktionstage. */
export const TAGE = [
	{day: '12', month: 'DEZ', label: '12. DEZEMBER', weekday: 'SAMSTAG', note: 'Samstag vor dem 3. Advent'},
	{day: '19', month: 'DEZ', label: '19. DEZEMBER', weekday: 'SAMSTAG', note: 'Samstag vor dem 4. Advent'},
] as const;
export const GRATIS = {
	price: '0,00 €',
	count: '2 KOSTENLOSE NAHVERKEHRSTAGE',
	scope: 'ALLE RMV-VERKEHRSMITTEL IM TARIFGEBIET 5000',
	scopeBy: 'laut Stadt · inkl. Grenztarifgebiete',
	notForever: 'NUR AN DIESEN BEIDEN TAGEN',
};

/** Verkehrsmittel (die Stadt nennt „alle RMV-Verkehrsmittel“; im Ton beispielhaft die vier Hauptarten). */
export const MITTEL = [
	{key: 'bus', label: 'BUS'},
	{key: 'tram', label: 'STRASSENBAHN'},
	{key: 'ubahn', label: 'U-BAHN'},
	{key: 'sbahn', label: 'S-BAHN'},
] as const;
export const ZEIT = {
	from: '0 UHR',
	to: '5 UHR',
	label: '0 UHR BIS 5 UHR AM FOLGETAG',
	sub: 'Samstag 0 Uhr bis Sonntagmorgen 5 Uhr (Betriebsschluss)',
};

/** Ausnahmen. */
export const AUSNAHMEN = {
	airport: 'FLUGHAFEN AUSGENOMMEN',
	airportSub: 'Tarifgebiet 5090 – weiter reguläres Ticket',
	umland: 'NICHT DAS GESAMTE RMV-GEBIET',
	umlandSub: 'aus dem Umland: bis zur Stadtgrenze regulärer Preis',
	zone: 'TARIFGEBIET 5000',
	zoneSub: 'Stadtgebiet Frankfurt',
	mapNote: 'SCHEMATISCH · Stadtgrenzen laut OpenStreetMap · Grenztarifgebiete nicht eingezeichnet',
};

/** Hintergrund. */
export const HINTERGRUND = {
	date: '31.10.',
	retro: 'Nach den Ausschreitungen: Stadt sagte dem Handel Hilfe zu',
	quote: '„Wir haben Unterstützung zugesagt, zugehört und handeln jetzt auch.“',
	quoteBy: 'OB Mike Josef laut FAZ, 25.11.',
	cost: 400000,
	costLabel: 'KOSTEN FÜR DIE STADT',
	costBy: 'laut FAZ, 25.11.2026',
	uninsured: 'Händler ohne Versicherung: Stadt will für Sachschäden einstehen',
	uninsuredBy: 'laut OB Josef (FAZ)',
	land: 'Zusätzlich: Land Hessen stellt 600.000 € für betroffene Betriebe bereit',
	landBy: 'laut Journal Frankfurt, 26.11.',
	partners: 'In Absprache mit Handelsverband, DEHOGA Hessen, RMV und traffiQ (laut FAZ)',
	zeil: 'Zeil 2025: rund 22,7 Mio. Passanten – Platz 3 bundesweit (laut Stadt)',
};

/** Weitere Maßnahmen. */
export const KAMPAGNE = {
	name: 'FRANKFURT CHRISTMAS SHOPPING',
	until: 'BIS 19. DEZEMBER',
	how: 'Werbung an Bahnhöfen und in Social Media – Metropolregion Rhein-Main',
	jan: {day: '6', month: 'JAN', label: '„ZU GAST IN FRANKFURT“', sub: 'Dreikönigstag: Feiertag in Bayern und Baden-Württemberg, in Hessen nicht'},
};

/** Die zeitliche Überschneidung. */
export const UEBERSCHNEIDUNG = {
	headline: 'ZWEI EREIGNISSE – EIN DATUM',
	same: 'BEIDES AM GLEICHEN TAG',
	left: 'KOSTENLOSER NAHVERKEHR',
	leftBy: 'Stadt Frankfurt',
	right: 'GEN-Z-PROTESTTAG ANGEKÜNDIGT',
	rightBy: 'Website „Gen Z regelt“: 73 Städte, Frankfurt „Standort folgt“',
	rightGroup: 'Frankfurter Gruppe (TikTok-Beitrag): 14 Uhr, Gallusanlage',
	open: 'Anmeldung / Behörde: keine Mitteilung',
	noLink: 'DIREKTER ZUSAMMENHANG NICHT BELEGT',
	noLinkSub: 'In den geprüften Meldungen von Stadt, Medien, RMV und traffiQ: kein Kommentar zur Überschneidung',
};

export const OUTRO = {
	cta: 'FOLGEN',
	ctaSub: 'FÜR MEHR NACHRICHTEN AUS FRANKFURT',
};

/** Quellenzeile unter den Untertiteln (≤ 112 Zeichen, keine URLs). */
export const SOURCE_LINE = [
	{from: 'hook2', text: 'FAZ, 25.11.2026, 17:04 Uhr · hessenschau, 25.11.2026, 18:22 Uhr'},
	{from: 'a1', text: 'Pressekonferenz der Stadt am 25.11.2026 laut hessenschau und FAZ'},
	{from: 'a2', text: 'Stadt Frankfurt laut Radio Frankfurt und Journal Frankfurt, 25./26.11.2026'},
	{from: 'b1', text: 'FAZ, 25.11.2026: „von 0 Uhr am Samstag bis 5 Uhr am Sonntagmorgen“'},
	{from: 'c1', text: 'Stadt Frankfurt laut Journal Frankfurt (26.11.) und hessenschau (25.11.)'},
	{from: 'd1', text: 'hessenschau, 25.11.2026 · FAZ, 25.11.2026'},
	{from: 'd2', text: 'FAZ, 25.11.2026, 17:04 Uhr: „Kostenpunkt für die Stadt: 400.000 Euro“'},
	{from: 'e1', text: 'Stadt Frankfurt laut Radio Frankfurt, 25.11.2026 · FAZ, 25.11.2026'},
	{from: 'f0', text: 'Website „Gen Z regelt“, abgerufen 26.11.2026, 14:40 Uhr · TikTok-Beitrag der Frankfurter Gruppe'},
	{from: 'f3', text: 'Stand 26.11.2026, 14:40 Uhr: keine Stellungnahme von Stadt, RMV, VGF oder traffiQ zur Überschneidung'},
] as const;
