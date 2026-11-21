/**
 * Inhalte „Frankfurt morgen: Diese Bahnen sind betroffen!“ (Format B #11, produziert 19.11.2026 für Freitag, 20.11.2026).
 * Jede Angabe mit Quelle; Belege mit wörtlichen Zitaten in references/frankfurt-erklaert-20nov-oepnv/sources.md.
 *
 * Hauptquelle: VGF, „Veranstaltungen am Freitag: Behinderungen des Straßenbahnbetriebs“ – AKTUALISIERTE Meldung, Informationsstand
 * 19.11.2026, 9 Uhr (zuerst 18.11.2026, 14 Uhr: „ab 9 Uhr“, vier Veranstaltungen). Ein Planungsstand, keine eingetretene Störung.
 */

export const STAND = 'Stand: VGF, 19.11.2026, 9 Uhr';

/** Wörtliche Kernsätze der aktualisierten VGF-Meldung (19.11., 9 Uhr) – Tests prüfen, dass sources.md sie enthält. */
export const VGF_QUOTES = {
	tram: 'werden die Straßenbahn-Linien 11, 12 und 14 am Freitag von 8 Uhr 30 an nicht über die Altstadtstrecke verkehren',
	detour: 'Zwischen Börneplatz und HBF stellt die VGF den Tram-Betrieb ein, die drei genannten Linien leitet sie über Sachsenhausen um.',
	maybe: 'Möglicherweise könnten auch die Linie 18 und die Buslinien 30 und M36 auf der Kurt-Schumacher-Straße / Konrad-Adenauer-Straße betroffen sein',
	ubahn: 'Die U-Bahnlinien U1, U2, U3, U4, U5 und U8 fahren nach aktuellem Kenntnisstand nach Fahrplan',
	open: 'die Stationen „Willy-Brandt-Platz“, „Dom / Römer“, „Hauptwache”, „Konstablerwache” und „Alte Oper”  bleiben offen',
	alt: 'die Linien U4 und U5 zwischen HBF, Willy-Brandt-Platz, Altstadt und Konstablerwache als Alternative zur Tram zur Verfügung stünden',
	info: 'Die VGF wird im Laufe des Freitags auf ihrer Homepage',
	five: 'fünf Veranstaltungen angemeldet, darunter vier Demonstrationszüge auf unterschiedlichen Routen',
} as const;

export const COVER = {
	kicker: 'FRANKFURT',
	big: 'MORGEN!',
	sub: 'DIESE BAHNEN SIND BETROFFEN',
	small: 'FREITAG · 20. NOVEMBER 2026',
	question: 'WAS FÄHRT – WAS NICHT?',
	lines: ['11', '12', '14'],
	from: 'AB 8:30 UHR',
};

/** Szene „Uhr + Linien“: ab 8:30 Uhr nicht über die Altstadtstrecke (laut VGF, 19.11.). */
export const TRAM = {
	lines: ['11', '12', '14'],
	minutes: 8 * 60 + 30,
	time: '08:30',
	title: 'ALTSTADTSTRECKE GESPERRT',
	sub: 'AB 8:30 UHR · LAUT VGF',
	source: 'Quelle: VGF, „Veranstaltungen am Freitag: Behinderungen des Straßenbahnbetriebs“, Stand 19.11.2026, 9 Uhr',
};

/** Karte: kein Tram-Betrieb zwischen Hbf und Börneplatz, Umleitung über Sachsenhausen (Verlauf nicht im Detail veröffentlicht → schematisch). */
export const MAP = {
	altstadt: 'ALTSTADTSTRECKE',
	altstadtSub: 'ab 8:30 Uhr keine Tram zwischen Hbf und Börneplatz',
	detour: 'UMLEITUNG ÜBER SACHSENHAUSEN',
	detourSub: 'laut VGF · die Linien fahren, nur anders',
	/** genaue Umleitungsstrecke hat die VGF nicht beschrieben → Bogen nur schematisch */
	noDetour: 'Umleitung laut VGF „über Sachsenhausen“ – genauer Weg nicht veröffentlicht, Bogen schematisch',
	maybeTitle: 'MÖGLICHE WEITERE AUSWIRKUNGEN',
	maybeLines: [
		{ref: '18', kind: 'tram' as const},
		{ref: '30', kind: 'bus' as const},
		{ref: 'M36', kind: 'bus' as const},
	],
	maybeStreets: ['Kurt-Schumacher-Straße', 'Konrad-Adenauer-Straße'],
	maybeNote: 'laut VGF nur „möglicherweise“',
	source: 'Quelle: VGF, 19.11., 9 Uhr · Karte © OpenStreetMap-Mitwirkende',
};

/** U-Bahn: nach aktuellem Stand nach Fahrplan, U4/U5 als Alternative (beide bedienen Hbf – Willy-Brandt-Platz – Dom/Römer – Konstablerwache). */
export const UBAHN = {
	planned: ['U1', 'U2', 'U3', 'U4', 'U5', 'U8'],
	plannedTitle: 'U-BAHNEN NACH BISHERIGEM STAND PLANMÄSSIG',
	alt: ['U4', 'U5'],
	altLabel: 'LAUT VGF ALS ALTERNATIVE',
	stations: [
		{name: 'HAUPTBAHNHOF', open: false},
		{name: 'WILLY-BRANDT-PLATZ', open: true},
		{name: 'DOM/RÖMER', open: true},
		{name: 'KONSTABLERWACHE', open: true},
	],
	openLabel: 'BLEIBT OFFEN',
	alsoOpen: 'Auch Hauptwache und Alte Oper bleiben offen',
	source: 'Quelle: VGF, 19.11.2026, 9 Uhr · Linienverlauf U4/U5 laut OSM · schematisch',
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

/** Hintergrund: fünf Versammlungen (Innenministerium, 18.11.) – laut Ordnungsamt (über VGF, 19.11.) fünf Veranstaltungen, darunter vier Demozüge. */
export const WHY = {
	count: 5,
	marches: 4,
	label: 'VERSAMMLUNGEN AM FREITAG',
	when: 'zwischen 10 und 21:30 Uhr',
	who: 'Pressemitteilung 18.11.',
	vgf: 'Angaben des Ordnungsamts (VGF, 19.11.)',
	note: 'Weitere Änderungen sind möglich – die VGF informiert im Laufe des Freitags.',
	source: 'Quelle: Innenministerium, 18.11.2026 · VGF, 19.11.2026, 9 Uhr (Angaben des Ordnungsamts)',
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
	source: 'Quelle: VGF, 19.11.2026 („im Laufe des Freitags auf ihrer Homepage … berichten“)',
};

export const CTA = {title: 'FOLGT FÜR MEHR', sub: 'FRANKFURT ERKLÄRT · IN 60 SEKUNDEN'};

/** Wichtige Kartenpunkte (WGS84). Römer = Rathaus am Römerberg (OSM). */
export const PLACES = {
	roemer: [50.11063, 8.68195] as [number, number],
};

export const SOURCES = [
	{id: 'vgf', label: 'VGF – Veranstaltungen am Freitag: Behinderungen des Straßenbahnbetriebs (aktualisiert, Stand 19.11.2026, 9 Uhr; zuerst 18.11.2026, 14 Uhr)', url: 'https://www.vgf-ffm.de/de/aktuelles/news/einzelansicht/veranstaltungen-am-freitag-betriebsbehinderungen-moeglich'},
	{id: 'vgfdtc', label: 'VGF – Für DTC-Testfahrten: U4 und U5 entfallen (16.11.2026)', url: 'https://www.vgf-ffm.de/de/aktuelles/news/einzelansicht/dtc-testfahrten-u4-und-u5-entfallen'},
	{id: 'land', label: 'Hessisches Innenministerium – Appell zur friedlichen Demonstration (18.11.2026)', url: 'https://innen.hessen.de/presse/appell-zur-friedlichen-demonstration'},
	{id: 'osm', label: 'OpenStreetMap – Karte und Linienverläufe (Routenrelationen), © OpenStreetMap-Mitwirkende, ODbL', url: 'https://www.openstreetmap.org/copyright'},
] as const;
