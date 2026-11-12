/**
 * „Frankfurt erklärt in 60 Sekunden“ #05 – 76 Fragen, Teil 4: vier weitere Antworten.
 * Belege: references/frankfurt-erklaert-76-fragen-teil4/sources.md (Abruf 12.11.2026).
 * Kategorien im Bild: OFFIZIELL (Polizei/Innenminister/Justizministerium) · BERICHT (Medienbericht) · POSITION · OFFEN.
 */
import type {LatLon} from '../../components/map/CityStreetMap';

export const STAND = 'Stand: 12.11.2026';

/** Titelbild (= erste Szene). */
export const COVER = {
	number: '76',
	part: 'TEIL 4',
	kicker: '76 FRAGEN –',
	card: '4 WEITERE ANTWORTEN',
	sub: 'Neue Erkenntnisse zur Krawallnacht',
};

/** Die vier Antworten (Reihenfolge = Video). */
export const ANSWERS = [
	{num: '01', short: 'EINSATZ', title: ['WARUM NICHT', 'ÜBERALL?']},
	{num: '02', short: 'SCHADEN', title: ['WIE HOCH WAR', 'DER SCHADEN?']},
	{num: '03', short: 'WAFFEN', title: ['WAS WURDE AUS', 'DEN WAFFEN?']},
	{num: '04', short: 'ERMITTLUNGEN', title: ['WAS HAT DIE JUSTIZ', 'BISHER ERGEBEN?']},
] as const;

/** Antwort 1 – viele Einsatzorte gleichzeitig (Polizei/Innenministerium, Pressekonferenz 1.11.). */
export const SPOTS = {
	max: 30,
	label: 'EINSATZORTE GLEICHZEITIG',
	labelPre: 'BIS ZU',
	note: 'zeitweise · laut Polizei (Pressekonferenz 1.11.)',
	factors: [
		{icon: 'alley', title: 'GASSEN & INNENHÖFE', text: 'viele Straßen, schwer zu überblicken'},
		{icon: 'crowd', title: 'VIELE RANDALIERER', text: 'große Zahl laut Polizei'},
		{icon: 'shift', title: 'VERLAGERUNG', text: 'u. a. zum Eschenheimer Tor (Polizei, 23:27)'},
	] as const,
	verdict: ['ERKLÄRUNG', 'BEWERTUNG'] as const,
	open: 'Ob alles richtig lief: Aufarbeitung läuft',
	positions: 'Poseck: Einsatz „überwiegend erfolgreich“ · FDP: ergebnisoffen aufarbeiten (Landtag, 11.11.)',
	legend: 'Punkte: belegte Schadensorte (Auswahl) · Schilde/Linien symbolisch',
	/** belegte Orte (Folge 2: data/shops.json + Plätze) */
	points: [
		{id: 'hauptwache', at: [50.1138071, 8.6791483] as LatLon},
		{id: 'konstablerwache', at: [50.1146301, 8.6868253] as LatLon},
		{id: 'zeil79', at: [50.1143647, 8.6837118] as LatLon},
		{id: 'hasengasse', at: [50.11365, 8.68376] as LatLon},
		{id: 'liebfrauenberg', at: [50.1129357, 8.6814517] as LatLon},
		{id: 'berliner-1', at: [50.111953, 8.682851] as LatLon},
		{id: 'berliner-2', at: [50.1122644, 8.683702] as LatLon},
		{id: 'berliner-3', at: [50.11223, 8.68474] as LatLon},
		{id: 'gr-friedberger', at: [50.1163831, 8.6859088] as LatLon},
		{id: 'gr-eschenheimer', at: [50.1155921, 8.6793306] as LatLon},
		{id: 'eschenheimer-tor', at: [50.1167128, 8.6801031] as LatLon},
	],
	center: [50.1142, 8.6825] as LatLon,
	eschenheimerTor: [50.1167128, 8.6801031] as LatLon,
	zeil: [50.11455, 8.6845] as LatLon,
	source: 'Polizei/Innenministerium, Pressekonferenz 1.11. (hessenschau) · hessenschau-Ticker 23:27 · Karte: © OpenStreetMap-Mitwirkende',
};

/** Antwort 2 – Schaden: Anfangsbilanz → später genannte Zahlen (laut Wiesbadener Kurier). */
export const DAMAGE = {
	before: {damaged: 17, looted: 5, label: 'ANFANGSBILANZ', when: 'Polizei/Innenministerium, 1./2.11.', note: 'davon 5 geplündert'},
	after: {damaged: 35, looted: 6, label: 'SPÄTER GENANNT', when: 'Poseck in der Sitzung laut Wiesbadener Kurier'},
	sum: 'SCHADEN: SECHSSTELLIG',
	sumNote: '= 100.000 bis unter 1 Mio. € · keine genaue Summe',
	source: 'Anfangsbilanz: Innenministerium (PM 2.11.), Polizei 1.11. · später: Bericht des Wiesbadener Kurier · Läden: Illustration',
};

/** Antwort 3 – Waffengeschäft. */
export const WEAPONS = {
	shop: 'WAFFENGESCHÄFT',
	shopNote: 'Berliner Straße · Name nicht genannt',
	seized: 'SCHRECKSCHUSSWAFFEN SICHERGESTELLT',
	seizedNote: 'laut Polizei, Pressekonferenz 1.11. · mehrere Festnahmen vor Ort',
	custody: {age: '18', title: 'UNTERSUCHUNGSHAFT', text: 'Vorwurf: Diebstahl einer Waffe · Haftbefehl Amtsgericht (Justizministerium, 2./3.11.)'},
	equation: ['U-HAFT', 'VERURTEILUNG'] as const,
	source: 'Polizei 1.11. (hessenschau) · Hess. Justizministerium 2./3.11. (hessenschau, osthessen-news) · Ladenfront: Illustration',
};

/** Antwort 4 – Strafverfolgung: vier Begriffe, nicht dasselbe. */
export const JUSTICE = {
	steps: [
		{n: 110, title: 'STRAFANZEIGEN', note: 'laut Polizei (zuerst 87)', icon: 'doc'},
		{n: 53, title: 'FESTNAHMEN', note: 'am 31.10. · laut Polizei', icon: 'cuffsOff'},
		{n: 73, title: 'TATVERDÄCHTIGE', note: 'laut Innenminister, 10.11.', icon: 'person'},
	] as const,
	equation: ['VERDÄCHTIG', 'VERURTEILT'] as const,
	note: 'Es gilt die Unschuldsvermutung',
	source: 'Polizei Frankfurt (dpa 9.11.; Anfragen von Apollo News 9.11./Tichys Einblick 12.11.) · Innenminister im Innenausschuss 10.11. (hr, dpa)',
};

export const SUMMARY = [
	{num: '01', title: 'BIS ZU 30 EINSATZORTE', note: 'gleichzeitig'},
	{num: '02', title: '35 / 6 · SECHSSTELLIG', note: 'laut Wiesbadener Kurier'},
	{num: '03', title: 'SCHRECKSCHUSSWAFFEN', note: 'sichergestellt · 1 U-Haft'},
	{num: '04', title: '110 · 53 · 73', note: 'Anzeigen · Festnahmen · Verdächtige'},
];

export const CTA = {title: 'FOLGT FÜR MEHR', sub: 'FRANKFURT ERKLÄRT'};

export const SOURCES = [
	{id: 'hs-pk', text: 'hessenschau: „Bilanz der Ausschreitungen in Frankfurt: Festnahmen und verletzte Polizisten“, 01.11.2026', url: 'https://www.hessenschau.de/panorama/bilanz-der-ausschreitungen-in-frankfurt-festnahmen-und-verletzte-polizisten-v1,bilanz-frankfurt-100.html'},
	{id: 'hr-ticker', text: 'hessenschau-Liveticker 31.10./01.11.2026', url: 'https://www.hessenschau.de/panorama/eskalation-nach-gen-z-protesten-in-frankfurt-aktuelle-meldungen-im-ticker,gen-z-demo-frankfurt-100.html'},
	{id: 'im', text: 'Hessisches Innenministerium, PM 02.11.2026', url: 'https://innen.hessen.de/presse/erste-einordnung-nach-gewaltausbruechen-waehrend-und-nach-der-versammlung-der-generation-z'},
	{id: 'wk', text: 'Wiesbadener Kurier: „Nach Krawallen kündigt Minister Poseck „härtere Gangart“ an“, 11.11.2026 (Bezahlinhalt)', url: 'https://www.wiesbadener-kurier.de/politik/politik-hessen/nach-krawallen-kuendigt-minister-poseck-haertere-gangart-an-6752727'},
	{id: 'wk-landtag', text: 'Wiesbadener Kurier (dpa): „Landtag streitet über Aufarbeitung der Krawalle in Frankfurt“, 12.11.2026', url: 'https://www.wiesbadener-kurier.de/lokales/hessen/landtag-streitet-ueber-aufarbeitung-der-krawalle-in-frankfurt-6805055'},
	{id: 'wk-53', text: 'Wiesbadener Kurier (dpa): „Polizei: Gewaltbereite Männer bei Ausschreitungen beteiligt“, 09.11.2026', url: 'https://www.wiesbadener-kurier.de/lokales/hessen/polizei-gewaltbereite-maenner-bei-ausschreitungen-beteiligt-6771553'},
	{id: 'wk-waffe', text: 'Wiesbadener Kurier (dpa): „Festnahmen nach Attacke auf Waffengeschäft in Frankfurt“, 31.10.2026', url: 'https://www.wiesbadener-kurier.de/lokales/hessen/festnahmen-nach-attacke-auf-waffengeschaeft-in-frankfurt-6647997'},
	{id: 'hs-uhaft', text: 'hessenschau: „Krawalle in Frankfurt werden „keine drakonischen Strafen“ nach sich ziehen“, 03.11.2026', url: 'https://www.hessenschau.de/gesellschaft/krawalle-in-frankfurt-werden-keine-drakonischen-strafen-nach-sich-ziehen-v1,strafrechtliche-konsequenzen-krawall-frankfurt-100.html'},
	{id: 'on-uhaft', text: 'osthessen-news (PM Justizministerium): „Gen-Z-Demo in Frankfurt: 18-jähriger Syrer in U-Haft“, 03.11.2026', url: 'https://osthessen-news.de/n11802469/gen-z-demo-in-frankfurt-18-jahriger-syrer-in-u-haft.html'},
	{id: 'apollo', text: 'Apollo News: „Frankfurter Krawallnacht: Unter ausländischen Festgenommenen dominieren Afghanen und Marokkaner“ (Antwort Polizeipräsidium Frankfurt, Stand 9.11.), 09.11.2026', url: 'https://apollo-news.net/frankfurter-krawallnacht-unter-auslndischen-festgenommenen-dominieren-afghanen-und-syrer/'},
	{id: 'tichy', text: 'Tichys Einblick: „Unruhen in Frankfurt: 110 Strafanzeigen, Täter aus elf Nationen“ (Antwort Innenministerium), 12.11.2026', url: 'https://www.tichyseinblick.de/daili-es-sentials/frankfurt-110-strafanzeigen'},
	{id: 'hs-ina', text: 'hessenschau (dpa/lhe): „Nach Gen Z-Krawallen: Poseck verteidigt Aussagen zu Migrationshintergrund“, 10./11.11.2026', url: 'https://www.hessenschau.de/politik/nach-gen-z-krawallen-poseck-verteidigt-aussagen-zu-migrationshintergrund--v2,poseck-innenausschuss-100.html'},
];
