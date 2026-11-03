/**
 * Datenprüfung Folge 2 (shops.json): Status-Logik, Koordinaten, Quellen, Zählweise.
 * Schützt vor Fehlern beim späteren Ergänzen von Geschäften.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';

const data = JSON.parse(readFileSync(new URL('../src/videos/frankfurt-2026-10-31-geschaefte/data/shops.json', import.meta.url), 'utf8'));
const map = JSON.parse(readFileSync(new URL('../src/data/maps/frankfurt-innenstadt.json', import.meta.url), 'utf8'));

test('jedes Geschäft hat Pflichtfelder, gültigen Status und mindestens eine Quelle', () => {
	const ids = new Set<string>();
	for (const s of data.shops) {
		assert.ok(s.id && s.name && s.adresse && s.kurz, `Pflichtfeld fehlt bei ${s.id}`);
		assert.ok(!ids.has(s.id), `doppelte ID ${s.id}`);
		ids.add(s.id);
		assert.ok(['gepluendert', 'beschaedigt', 'ungeklaert'].includes(s.status), `Status ${s.status}`);
		assert.ok(['hoch', 'mittel', 'niedrig'].includes(s.belegstaerke));
		assert.ok(s.quellen.length > 0, `${s.id}: keine Quelle`);
		for (const q of s.quellen) {
			assert.ok(q.url || q.art === 'video', `${s.id}: Quelle ohne URL muss ein Video-Beleg sein`);
			assert.match(q.datum, /^2\d{3}-\d{2}-\d{2}$/);
		}
	}
});

test('Status passt zur Schadensart: „geplündert“ nur bei belegter Entwendung', () => {
	for (const s of data.shops) {
		if (s.status === 'gepluendert') assert.equal(s.schaden.entwendung, 'ja', `${s.id}: geplündert ohne belegte Entwendung`);
		if (s.status === 'beschaedigt') {
			assert.equal(s.schaden.sachschaden, true, `${s.id}`);
			assert.notEqual(s.schaden.entwendung, 'ja', `${s.id}: Entwendung belegt → müsste „gepluendert“ sein`);
		}
	}
});

test('Koordinaten liegen im Kartenausschnitt der Innenstadt', () => {
	const b = map.meta.bbox;
	for (const s of data.shops) {
		assert.ok(s.lat > b.minlat && s.lat < b.maxlat && s.lon > b.minlon && s.lon < b.maxlon, `${s.id} außerhalb der Karte`);
	}
});

test('Fotos existieren und sind als Schadens- oder Fassadenfoto gekennzeichnet', () => {
	for (const s of data.shops) {
		if (s.bild.typ === 'foto') {
			readFileSync(new URL(`../public/${s.bild.datei}`, import.meta.url));
			assert.ok(['schaden', 'fassade'].includes(s.bild.zeigt), `${s.id}: Bildinhalt angeben`);
			assert.ok(s.bild.credit, `${s.id}: Bildnachweis fehlt`);
		}
	}
});

test('Recherche-Zählung bleibt unter der offiziellen Bilanz und vermischt sie nicht', () => {
	const off = data.meta.offiziell;
	const theft = data.shops.filter((s: {status: string}) => s.status === 'gepluendert').length;
	const named = data.shops.filter((s: {status: string}) => s.status !== 'ungeklaert').length;
	assert.ok(theft <= off.gepluendert.anzahl, 'mehr belegte Plünderungen als offiziell gemeldet – Daten prüfen');
	assert.ok(named <= off.beschaedigt.anzahl);
});
