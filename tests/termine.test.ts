/**
 * Datenprüfung Folge 3 (termine.json): Stufen-Logik, Quellen, Städteliste.
 * Schützt davor, unbelegte Termine als „angekündigt“ oder „beschlossen“ auszugeben.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';

const data = JSON.parse(readFileSync(new URL('../src/videos/frankfurt-2026-11-04-naechste-demo/data/termine.json', import.meta.url), 'utf8'));

test('jeder Termin hat gültige Stufe, Wochentag passend zum Datum und mindestens eine bekannte Quelle', () => {
	const weekdays = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
	for (const t of data.termine) {
		assert.ok(['geruecht', 'ankuendigung', 'anmeldung', 'behoerdlich'].includes(t.stufe), `${t.id}: Stufe`);
		assert.equal(weekdays[new Date(`${t.datum}T12:00:00Z`).getUTCDay()], t.wochentag, `${t.id}: Wochentag`);
		assert.ok(t.quellen.length > 0, `${t.id}: keine Quelle`);
		for (const q of t.quellen) assert.ok(data.quellen[q], `${t.id}: Quelle "${q}" fehlt`);
	}
});

test('nur der 20.11. ist angekündigt; 14.11. und 21.11. bleiben unbestätigt', () => {
	const stufe = (id: string) => data.termine.find((t: {id: string}) => t.id === id).stufe;
	assert.equal(stufe('14-11'), 'geruecht');
	assert.equal(stufe('21-11'), 'geruecht');
	assert.equal(stufe('20-11'), 'ankuendigung');
});

test('Anmeldung/Entscheidung sind für den 20.11. nicht belegt und dürfen nicht als erledigt erscheinen', () => {
	const t = data.termine.find((x: {id: string}) => x.id === '20-11');
	assert.equal(t.anmeldung, 'nicht bekannt');
	assert.equal(t.behoerdlicheEntscheidung, 'nicht bekannt');
	assert.equal(data.politik.verbotBeschlossen, false);
});

test('Städteliste stimmt mit der angekündigten Zahl überein, enthält Frankfurt und liegt in Deutschland', () => {
	const t = data.termine.find((x: {id: string}) => x.id === '20-11');
	assert.equal(data.staedte.length, t.staedte);
	assert.equal(new Set(data.staedte.map((s: {id: string}) => s.id)).size, data.staedte.length, 'doppelte Stadt');
	assert.ok(data.staedte.some((s: {id: string}) => s.id === 'frankfurt'));
	for (const s of data.staedte) {
		assert.ok(s.lon > 5.8 && s.lon < 15.1 && s.lat > 47.2 && s.lat < 55.1, `${s.id}: außerhalb Deutschlands`);
	}

	assert.equal(data.staedte.filter((s: {selbst: boolean}) => s.selbst).length, 5, 'laut Website 5 selbst organisierte Städte');
});

test('Quellen haben URL und Abrufdatum', () => {
	for (const [k, q] of Object.entries<{url: string; abgerufen: string}>(data.quellen)) {
		assert.match(q.url, /^https:\/\//, k);
		assert.match(q.abgerufen, /^2026-11-\d\d$/, k);
	}
});
