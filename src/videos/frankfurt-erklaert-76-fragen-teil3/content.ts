/**
 * „Frankfurt erklärt in 60 Sekunden“ #04 – 76 Fragen, Teil 3: Was ist immer noch offen?
 * Belege: references/frankfurt-erklaert-76-fragen-teil3/sources.md (Abruf 11.11.2026).
 * Kategorien im Bild: OFFIZIELL (Polizei/Innenminister/Stadt, berichtet von hr/dpa bzw. Pressemitteilung) · BERICHT (journalistisch) ·
 * RECHT (Gesetzestext, gesetze-im-internet.de) · OFFEN (nicht beantwortet / nicht beziffert).
 * Keine Wiederholung von Teil 2 (Polizeibilanz, Tatverdächtigen-Merkmale, TikTok, 20.11., Herkunftsdebatte).
 */

export const STAND = 'Stand: 11.11.2026';

export type Kind = 'offiziell' | 'bericht' | 'recht' | 'offen';

/** Titelbild (= erste Szene). */
export const COVER = {
	number: '76',
	part: 'TEIL 3',
	kicker: '76 FRAGEN –',
	card: '4 FRAGEN BLEIBEN',
	sub: 'Was wurde noch nicht vollständig geklärt?',
	date: '12. NOVEMBER 2026',
};

/** Die vier Fragen (Reihenfolge = Video). */
export const QUESTIONS = [
	{num: '01', short: 'PROGNOSE', title: ['WARUM SO WENIGE', 'ERWARTET?']},
	{num: '02', short: 'GEWALT', title: ['WANN BEGANN', 'DIE GEWALT?']},
	{num: '03', short: 'UNTER 14', title: ['TATVERDÄCHTIG', 'UNTER 14 – UND NUN?']},
	{num: '04', short: 'SCHÄDEN', title: ['WER ZAHLT', 'DIE SCHÄDEN?']},
] as const;

/** Frage 1 – Teilnehmerprognose vs. tatsächliche Beteiligung. */
export const FORECAST = {
	expected: 2000,
	expectedLabel: 'PROGNOSE',
	expectedNote: 'Polizei vorab (laut hr, 29./30.10.)',
	actualFrom: 8000,
	actualTo: 9000,
	actualLabel: 'TATSÄCHLICH',
	actualNote: 'Polizei: 8.000 · hr: 8.000–9.000',
	factor: '≈ 4×',
	/** 1 Punkt = 100 Menschen (abstrakt, gerundet) */
	perDot: 100,
	online: 'Vorab online: über 11.000 Zusagen (Website „Gen Z regelt“) – Zusage ≠ Teilnahme',
	open: ['WARUM DIE', 'ABWEICHUNG?'],
	openNote: 'Ursache und Folgen für die Einsatzplanung: öffentlich nicht erklärt',
	file: 'PLANUNG 31.10.',
	source: 'hr/tagesschau.de 30.10. + 31.10. · hessenschau 10.11. · Darstellung abstrakt (1 Punkt ≈ 100 Menschen)',
};

/** Frage 2 – Gewalt schon während des Aufzugs (Angaben des Innenministers), große Mehrheit friedlich. */
export const PHASES = {
	quote: '„Ausschreitungen begannen nicht erst nach Auflösung der Versammlung.“',
	quoteBy: 'Innenminister Poseck, Innenausschuss 10.11. (laut hr/dpa)',
	left: {title: 'WÄHREND DER DEMO', sub: 'bis zur Auflösung'},
	right: {title: 'NACH DER AUFLÖSUNG', sub: 'Krawalle, Plünderungen'},
	injuredBefore: 6,
	injuredBeforeLabel: 'VERLETZTE POLIZISTEN',
	severe: 'davon 1 schwer',
	total: 181,
	totalLabel: 'insgesamt (gesamter Einsatz)',
	peaceful: 'GROSSE MEHRHEIT: FRIEDLICH',
	peacefulNote: 'laut Innenminister: über Stunden ohne größere Zwischenfälle',
	source: 'Angaben des Innenministers (hr, dpa) · nach bisherigen Rückmeldungen · Illustration',
};

/** Frage 3 – Tatverdächtige unter 14 (allgemeine Rechtslage, keine Rechtsberatung). */
export const UNDER14 = {
	count: 2,
	countNote: 'von 73 Tatverdächtigen (laut Innenminister)',
	age: '14',
	headline: 'UNTER 14',
	stamp: 'STRAFUNMÜNDIG',
	law: '§ 19 StGB: „Schuldunfähig ist, wer bei Begehung der Tat noch nicht vierzehn Jahre alt ist.“',
	noPunish: {title: 'KEINE STRAFE', text: 'keine Verurteilung'},
	other: {title: 'ANDERE FOLGEN MÖGLICH', text: 'je nach Einzelfall'},
	items: [
		{icon: 'family', title: 'JUGENDAMT', text: 'Hilfen zur Erziehung', law: '§ 27 SGB VIII'},
		{icon: 'book', title: 'SCHADENERSATZ', text: 'wenn die nötige Einsicht da war', law: '§ 828 Abs. 3 BGB'},
		{icon: 'home', title: 'ELTERN', text: 'nicht automatisch – nur bei verletzter Aufsichtspflicht', law: '§ 832 BGB'},
	] as const,
	open: 'Welche Maßnahmen in diesen zwei Fällen? – gefragt in Drs. 21/5459 IV.5, öffentlich nicht beantwortet',
	disclaimer: 'Allgemeine Info, keine Rechtsberatung · Stand 11.11.2026',
};

/** Frage 4 – Schäden der Geschäfte: Versicherung zuerst, Stadt prüft (keine Zahlungszusage). */
export const DAMAGE = {
	meeting: 'Römer, 2.11.: Stadt + Handelsverband + betroffene Händler',
	steps: [
		{num: '1', title: 'SCHADEN', text: 'am Geschäft', kind: 'damage'},
		{num: '2', title: 'VERSICHERUNG', text: 'zuerst kontaktieren', kind: 'insurance'},
		{num: '3', title: 'MÖGLICHE STADTHILFE', text: 'Stadtmarketing prüft – keine feste Zusage', kind: 'check'},
	] as const,
	quote: '„… prüfen, ob wir seitens der Stadt eine finanzielle Unterstützung leisten können“',
	quoteBy: 'OB Mike Josef, Pressemitteilung der Stadt Frankfurt (2./3.11.)',
	extra: 'Dazu: Kampagnen fürs Einkaufen in der Innenstadt',
	open: 'GESAMTSCHADEN: BISHER NICHT OFFIZIELL BEZIFFERT',
	source: 'Stadt Frankfurt (PM „Schnelle, unbürokratische Hilfe“) · Ladenfront: Illustration',
};

/** Fazit – Status der vier Fragen. */
export const STATUS = [
	{num: '01', title: 'PROGNOSE 2.000 → 8.000+', status: 'OFFEN' as const, note: 'Ursache nicht erklärt'},
	{num: '02', title: 'GEWALT VOR DER AUFLÖSUNG', status: 'TEILWEISE' as const, note: '6 Verletzte bis dahin'},
	{num: '03', title: 'UNTER 14: STRAFUNMÜNDIG', status: 'TEILWEISE' as const, note: 'Maßnahmen offen'},
	{num: '04', title: 'SCHÄDEN DER GESCHÄFTE', status: 'TEILWEISE' as const, note: 'Versicherung, Stadt prüft'},
];

export const CTA = {title: ['WELCHE FRAGE IST EUCH', 'AM WICHTIGSTEN?']};

export const SOURCES = [
	{id: 'ts30', text: 'tagesschau.de (hr): „Zwei Gen-Z-Demos in Frankfurt: Tausende Teilnehmer und ein Polizei-Großaufgebot“, 30.10.2026', url: 'https://www.tagesschau.de/inland/regional/hessen/hr-gleich-zwei-gen-z-demos-am-samstag-in-frankfurt-polizei-mit-grossaufgebot-100.html'},
	{id: 'ts31', text: 'tagesschau.de (hr): „Polizei löst Gen-Z-Protest in Frankfurt auf - tausende Teilnehmende“, 31.10./01.11.2026', url: 'https://www.tagesschau.de/inland/regional/hessen/hr-gen-z-demo-in-frankfurt-tausende-demonstrierende-bei-protesten-in-innenstadt-erwartet-100.html'},
	{id: 'hs31', text: 'hessenschau: „Polizei löst Gen-Z-Protest in Frankfurt auf - tausende Teilnehmende“, 31.10.2026', url: 'https://www.hessenschau.de/panorama/polizei-loest-gen-z-protest-in-frankfurt-auf---tausende-teilnehmende-v16,frankfurt-gen-z-demo-100.html'},
	{id: 'hs10', text: 'hessenschau (hr, dpa/lhe): „Nach Gen Z-Krawallen: Poseck verteidigt Aussagen zu Migrationshintergrund“, 10./11.11.2026', url: 'https://www.hessenschau.de/politik/nach-gen-z-krawallen-poseck-verteidigt-aussagen-zu-migrationshintergrund--v2,poseck-innenausschuss-100.html'},
	{id: 'stadt', text: 'Stadt Frankfurt am Main: „Schnelle, unbürokratische Hilfe“ (Pressemitteilung, 03.11.2026)', url: 'https://frankfurt.de/de-de/aktuelle-meldung/meldungen/schnelle-unbuerokratische-hilfe/'},
	{id: 'd5450', text: 'Hessischer Landtag, Drs. 21/5450 (Berichtsantrag Grüne)', url: 'https://starweb.hessen.de/cache/DRS/21/0/05450.pdf'},
	{id: 'd5459', text: 'Hessischer Landtag, Drs. 21/5459 (Berichtsantrag FDP)', url: 'https://starweb.hessen.de/cache/DRS/21/9/05459.pdf'},
	{id: 'ina', text: 'Hessischer Landtag – Innenausschuss, 51. Sitzung', url: 'https://hessischer-landtag.de/termine/innenausschuss-51-sitzung'},
	{id: 'stgb19', text: '§ 19 StGB', url: 'https://www.gesetze-im-internet.de/stgb/__19.html'},
	{id: 'bgb828', text: '§ 828 BGB', url: 'https://www.gesetze-im-internet.de/bgb/__828.html'},
	{id: 'bgb832', text: '§ 832 BGB', url: 'https://www.gesetze-im-internet.de/bgb/__832.html'},
	{id: 'sgb8', text: '§ 27 SGB VIII', url: 'https://www.gesetze-im-internet.de/sgb_8/__27.html'},
];
