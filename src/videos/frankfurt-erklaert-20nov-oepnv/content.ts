/**
 * Inhalte „Frankfurt morgen: Diese Bahnen sind betroffen!“ (Format B #11, produziert 19.11.2026 für Freitag, 20.11.2026).
 * Jede Angabe mit Quelle; Belege mit wörtlichen Zitaten in references/frankfurt-erklaert-20nov-oepnv/sources.md.
 *
 * Hauptquelle: VGF, „Veranstaltungen am Freitag: Betriebsbehinderungen möglich“ (18.11.2026, Informationsstand 14 Uhr) –
 * am 19.11.2026 erneut geprüft: keine neuere VGF-Meldung zum Freitag. Ein Planungsstand, keine eingetretene Störung.
 */

export const STAND = 'Stand: VGF, 18.11.2026, 14 Uhr · am 19.11. erneut geprüft';

/** Wörtliche Kernsätze der VGF-Meldung (Tests prüfen, dass sources.md sie enthält). */
export const VGF_QUOTES = {
	tram: 'werden die Straßenbahn-Linien 11, 12 und 14 am Freitag von 9 Uhr an nicht über die Altstadtstrecke verkehren können',
	maybe: 'Möglicherweise könnten auch die Linie 18 und die Buslinien 30 und M36 auf der Kurt-Schumacher-Straße / Konrad-Adenauer-Straße betroffen sein',
	ubahn: 'Die U-Bahnlinien U1, U2, U3, U4, U5 und U8 fahren nach heutigem Kenntnisstand nach Fahrplan',
	open: 'die Stationen „Willy-Brandt-Platz“ und „Dom / Römer“ bleiben offen',
	alt: 'die Linien U4 und U5 zwischen HBF, Willy-Brandt-Platz, Altstadt und Konstablerwache als Alternative zur Tram zur Verfügung stünden',
	info: 'Die VGF wird am Freitag auf ihrer Homepage',
	four: 'vier Veranstaltungen angemeldet, darunter drei Demonstrationszüge',
} as const;

export const COVER = {
	kicker: 'FRANKFURT',
	big: 'MORGEN!',
	sub: 'DIESE BAHNEN SIND BETROFFEN',
	small: 'FREITAG · 20. NOVEMBER 2026',
	question: 'WAS FÄHRT – WAS NICHT?',
	lines: ['11', '12', '14'],
};

/** Szene „Uhr + Linien“: ab 9 Uhr nicht über die Altstadtstrecke (laut VGF). */
export const TRAM = {
	lines: ['11', '12', '14'],
	time: '09:00',
	title: 'ALTSTADTSTRECKE BETROFFEN',
	sub: 'AB 9 UHR · LAUT VGF',
	/** bewusst NICHT: „alle Linien komplett eingestellt“ */
	notTotal: 'KEIN KOMPLETTAUSFALL GEMELDET',
	source: 'Quelle: VGF, „Veranstaltungen am Freitag: Betriebsbehinderungen möglich“, Informationsstand 18.11.2026, 14 Uhr',
};

/** Karte: Altstadtstrecke (Straßenbahn zwischen Willy-Brandt-Platz und Börneplatz, Haltestellen laut OSM-Linienverläufen). */
export const MAP = {
	altstadt: 'ALTSTADTSTRECKE',
	altstadtSub: '11 · 12 · 14 ab 9 Uhr nicht hier entlang (laut VGF)',
	stillRun: 'Rest der Linien: kein Ausfall gemeldet',
	/** Umleitungswege hat die VGF nicht veröffentlicht → keine eingezeichnet */
	noDetour: 'Umleitungswege nicht veröffentlicht – deshalb nicht eingezeichnet',
	maybeTitle: 'MÖGLICHE WEITERE AUSWIRKUNGEN',
	maybeLines: [
		{ref: '18', kind: 'tram' as const},
		{ref: '30', kind: 'bus' as const},
		{ref: 'M36', kind: 'bus' as const},
	],
	maybeStreets: ['Kurt-Schumacher-Straße', 'Konrad-Adenauer-Straße'],
	maybeNote: 'laut VGF nur „möglicherweise“',
	source: 'Quelle: VGF, 18.11., 14 Uhr · Karte © OpenStreetMap-Mitwirkende',
};

/** U-Bahn: planmäßig nach bisherigem Stand, U4/U5 als Alternative (beide bedienen Hbf – Willy-Brandt-Platz – Dom/Römer – Konstablerwache). */
export const UBAHN = {
	planned: ['U1', 'U2', 'U3', 'U4', 'U5', 'U8'],
	plannedTitle: 'U-BAHNEN NACH BISHERIGEM STAND PLANMÄSSIG',
	alt: ['U4', 'U5'],
	altLabel: 'LAUT VGF ALS ALTERNATIVE',
	stations: [
		{name: 'HAUPTBAHNHOF', open: false},
		{name: 'WILLY-BRANDT-PLATZ', open: true},
		{name: 'DOM/RÖMER', open: true},
		{name: 'KONSTABLERWACHE', open: false},
	],
	openLabel: 'BLEIBT OFFEN',
	source: 'Quelle: VGF, 18.11.2026, 14 Uhr · Linienverlauf U4/U5 laut OSM · schematisch',
};

/** Hinweis Wochenende (VGF, 16.11.2026): DTC-Testfahrten. Gilt NICHT für Freitag. */
export const WEEKEND = {
	tag: 'ACHTUNG WOCHENENDE',
	title: 'U4 + U5 FALLEN AUS',
	when: 'SA 21.11. CA. 3:30 UHR – MO 23.11. CA. 3:30 UHR',
	why: 'DTC-Testfahrten · Dom/Römer am Wochenende geschlossen',
	ersatz: 'Ersatz laut VGF: Tram-Sonderlinie 10 · SEV-Busse für die U5',
	source: 'Quelle: VGF, „Für DTC-Testfahrten: U4 und U5 entfallen“, 16.11.2026',
};

/** Hintergrund: fünf Versammlungen (Innenministerium, 18.11.) – die VGF-Meldung (18.11., 14 Uhr) nannte noch vier. */
export const WHY = {
	count: 5,
	before: 4,
	label: 'VERSAMMLUNGEN AM FREITAG',
	land: 'laut Innenministerium (18.11.)',
	vgf: 'VGF-Meldung (18.11., 14 Uhr): „vier Veranstaltungen angemeldet“',
	note: 'Ob die fünfte Versammlung den Verkehrsplan ändert, hat die VGF bislang nicht gemeldet.',
	source: 'Quelle: Hessisches Innenministerium, PM 18.11.2026 · VGF, 18.11.2026, 14 Uhr',
};

/** Vor der Fahrt prüfen: Kanäle laut VGF-Meldung (Homepage + Anzeiger der Dynamischen Fahrgast-Informationen). */
export const CHECK = {
	title: 'VOR DER FAHRT CHECKEN!',
	web: 'vgf-ffm.de',
	webLabel: 'VGF-WEBSITE',
	dfi: 'ANZEIGER AN STATION + HALTESTELLE',
	phoneHeader: 'Betriebsinfo',
	phoneNote: 'Illustration · keine Live-Daten',
	question: 'WELCHE LINIE NEHMT IHR MORGEN?',
	questionSub: 'Schreibt’s in die Kommentare',
	source: 'Quelle: VGF, 18.11.2026 („Die VGF wird am Freitag auf ihrer Homepage … berichten“)',
};

export const CTA = {title: 'FOLGT FÜR MEHR', sub: 'FRANKFURT ERKLÄRT · IN 60 SEKUNDEN'};

/** Wichtige Kartenpunkte (WGS84). Römer = Rathaus am Römerberg (OSM). */
export const PLACES = {
	roemer: [50.11063, 8.68195] as [number, number],
};

export const SOURCES = [
	{id: 'vgf', label: 'VGF – Veranstaltungen am Freitag: Betriebsbehinderungen möglich (18.11.2026, Stand 14 Uhr)', url: 'https://www.vgf-ffm.de/de/aktuelles/news/einzelansicht/veranstaltungen-am-freitag-betriebsbehinderungen-moeglich'},
	{id: 'vgfdtc', label: 'VGF – Für DTC-Testfahrten: U4 und U5 entfallen (16.11.2026)', url: 'https://www.vgf-ffm.de/de/aktuelles/news/einzelansicht/dtc-testfahrten-u4-und-u5-entfallen'},
	{id: 'land', label: 'Hessisches Innenministerium – Appell zur friedlichen Demonstration (18.11.2026)', url: 'https://innen.hessen.de/presse/appell-zur-friedlichen-demonstration'},
	{id: 'osm', label: 'OpenStreetMap – Karte und Linienverläufe (Routenrelationen), © OpenStreetMap-Mitwirkende, ODbL', url: 'https://www.openstreetmap.org/copyright'},
] as const;
