/**
 * Inhalte „Polizeikontrollen auf der Zeil – musst du dein Handy zeigen?“ (FrankfurtPoliceRights).
 * Jede Aussage trägt eine Kategorie: OFFIZIELL · BERICHT · SCHILDERUNG · RECHT · TIPP.
 * Belege und Rechtsgrundlagen: references/frankfurt-2026-11-polizeikontrollen/sources.md (Stand 07.11.2026).
 * Allgemeine Information, keine Rechtsberatung.
 */
export const STAND = '07.11.2026';
export const DISCLAIMER = `Allgemeine Info – keine Rechtsberatung · Stand ${STAND}`;

export type InfoKind = 'OFFIZIELL' | 'BERICHT' | 'SCHILDERUNG' | 'RECHT' | 'TIPP';

export const HOOK = {
	place: 'FRANKFURT · ZEIL',
	title: ['POLIZEI WILL DEINE', 'GALERIE SEHEN?'],
	question: 'MUSST DU DAS?',
};

export const WHY = {
	date: '31.10.2026',
	chain: [
		{id: 'demo', label: 'Demo'},
		{id: 'riot', label: 'Ausschreitungen'},
		{id: 'shops', label: 'Geschäfte beschädigt'},
		{id: 'police', label: 'Angriffe auf Beamte'},
	],
	chainSource: 'Polizei Hessen 31.10.2026 · Innenministerium 02.11.2026',
	news: {
		outlet: 'hessenschau',
		date: '05.11.2026',
		kicker: 'Verstärkte Polizeikontrollen nach Ausschreitungen',
		headline: 'Jugendliche abends auf der Zeil: Zwischen Wut und Stigmatisierung',
		quote: '„Ausweiskontrolle, Identitätscheck, manchmal auch Leibesvisite.“',
	},
	voices: [
		{text: 'fühlen sich unter Pauschalverdacht', who: 'manche Jugendliche'},
		{text: 'finden die Kontrollen gut', who: 'andere'},
	],
	tv: 'hessenschau DAS THEMA, 06.11.2026: „Nach Krawallen: Polizei in Frankfurt hat Jugendliche auf Zeil im Fokus“',
	source: 'hessenschau 05.11.2026 · ARD-Mediathek 06.11.2026',
};

export const PHONE = {
	report: {
		who: 'Stadtverordneter (Die Linke) über den 03.11.',
		text: 'Beamte hätten Smartphones von Jugendlichen durchgesehen – „freiwillig“, um sich zu „entlasten“',
		source: 'Erklärung Die Linke im Römer 04.11.2026 · TikTok-Video des Stadtverordneten',
	},
	notConfirmed: `Polizei: öffentlich nicht bestätigt (Stand ${STAND})`,
	why: ['Beweismittel', 'Zeugenhinweise', 'Ermittlungen'],
	appeal: {
		sender: 'Polizei Hessen · PP Frankfurt',
		date: '31.10.2026',
		title: 'Wer hat Fotos oder Videos?',
		text: 'Zeuginnen und Zeugen … werden gebeten, diese … hochzuladen',
		button: 'FREIWILLIG HOCHLADEN',
	},
	equation: ['ZEUGENAUFRUF', 'PFLICHT ZUR HANDY-DURCHSICHT'],
};

export const LAW = {
	idCheck: {
		title: 'IDENTITÄTSKONTROLLE',
		yes: ['Personalien angeben', 'mitgeführten Ausweis aushändigen'],
		no: 'Handy durchsuchen – nicht automatisch',
		basis: '§ 18 HSOG · § 163b StPO · § 111 OWiG',
	},
	officerAsks: '„Können Sie mir bitte Ihre Fotos zeigen?“',
	question: 'FREIWILLIG ODER ANGEORDNET?',
	cardA: {
		tag: 'A',
		title: 'FREIWILLIGE BITTE',
		lines: ['Nur mit deinem Einverständnis', 'Du kannst grundsätzlich Nein sagen'],
	},
	cardB: {
		tag: 'B',
		title: 'ANGEORDNETE MASSNAHME',
		lines: ['Braucht Tatverdacht + Rechtsgrundlage', 'Handy kann auch ohne Einwilligung sichergestellt werden', 'Anordnung: Gericht – bei Gefahr im Verzug auch StA/Polizei'],
		basis: '§§ 94, 98, 102, 105 StPO',
	},
	review: 'Daten durchsehen: Staatsanwaltschaft – oder Beamte in ihrem Auftrag. Sonst nur mit deinem Okay.',
	reviewBasis: '§ 110 StPO',
	pin: {title: 'PIN', text: 'Als Beschuldigter musst du sie nicht nennen'},
	finger: {title: 'FINGERABDRUCK', text: 'Kann unter strengen Voraussetzungen erzwungen werden'},
	bgh: 'BGH, Beschluss vom 13.03.2025 – 2 StR 232/24',
};

export const TIPS = {
	phrases: [
		'„Darf ich fragen, weshalb ich kontrolliert werde?“',
		'„Ist das eine freiwillige Bitte oder eine angeordnete Maßnahme?“',
		'„Wenn es freiwillig ist, möchte ich meine privaten Bilder nicht zeigen.“',
	],
	phraseNotes: ['Ruhig nach dem Anlass fragen', 'Klären: Einwilligung oder Befugnis?', 'Nur bei einer freiwilligen Bitte'],
	dos: [
		{ok: true, text: 'Ruhig und respektvoll bleiben'},
		{ok: false, text: 'Keine Beleidigungen'},
		{ok: false, text: 'Keine körperliche Gegenwehr'},
		{ok: false, text: 'Nichts löschen oder verstecken'},
		{ok: true, text: 'Später prüfen lassen – z. B. mit Anwalt'},
	],
	basis: 'Gegen Beschlagnahme: gerichtliche Entscheidung beantragen (§ 98 Abs. 2 StPO)',
};

export const BALANCE = {
	left: {title: 'SICHERHEIT', items: ['Polizei in der Innenstadt', 'Straftaten aufklären', 'Schutz für alle']},
	right: {title: 'PRIVATSPHÄRE', items: ['Dein Smartphone', 'Datenschutz', 'Bürgerrechte']},
};

export const QUESTION = {
	title: 'KONTROLLEN AUF DER ZEIL – WAS MEINT IHR?',
	options: ['Mehr Sicherheit', 'Zu viel Kontrolle?'],
	hint: 'Schreibt’s in die Kommentare',
};
