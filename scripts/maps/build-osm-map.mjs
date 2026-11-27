#!/usr/bin/env node
/**
 * Baut aus OpenStreetMap-Daten eine kompakte Vektorkarte für <CityStreetMap>.
 *
 *   node scripts/maps/build-osm-map.mjs --bbox 8.6700,50.1085,8.6915,50.1185 --out src/data/maps/frankfurt-innenstadt.json
 *   node scripts/maps/build-osm-map.mjs --input innenstadt.osm --out …      (lokale .osm-Datei)
 *
 * Datenquelle: OpenStreetMap-API (kostenlos, ohne Key). Lizenz der Daten: ODbL 1.0 –
 * im Video IMMER „© OpenStreetMap-Mitwirkende“ einblenden (macht <CityStreetMap> automatisch).
 */
import {readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {parseArgs, ROOT} from '../lib/project.mjs';

const args = parseArgs(process.argv.slice(2));
const out = path.resolve(ROOT, args.out ?? 'src/data/maps/map.json');

const fetchOsm = async (bbox) => {
	const url = `https://api.openstreetmap.org/api/0.6/map?bbox=${bbox}`;
	for (let attempt = 1; attempt <= 6; attempt++) {
		try {
			const res = await fetch(url, {headers: {'User-Agent': 'SmokingTikTokStudio/0.1 (Remotion map build)'}});
			const text = await res.text();
			if (res.ok && text.trimEnd().endsWith('</osm>')) {
				return text;
			}

			console.warn(`  Versuch ${attempt}: HTTP ${res.status}, ${text.length} Bytes – wiederhole …`);
		} catch (err) {
			console.warn(`  Versuch ${attempt}: ${err.message} – wiederhole …`);
		}

		await new Promise((r) => setTimeout(r, attempt * 3000));
	}

	throw new Error('OSM-Download fehlgeschlagen.');
};

const xml = args.input ? readFileSync(args.input, 'utf8') : await fetchOsm(args.bbox);
const bboxMatch = xml.match(/<bounds minlat="([\d.-]+)" minlon="([\d.-]+)" maxlat="([\d.-]+)" maxlon="([\d.-]+)"/);
const [minlat, minlon, maxlat, maxlon] = bboxMatch
	? bboxMatch.slice(1).map(Number)
	: String(args.bbox).split(',').map(Number).reduce((acc, v, i) => ((acc[[1, 0, 3, 2][i]] = v), acc), []);

// ---------- Parsen (OSM-XML ist regelmäßig aufgebaut → Regex genügt) ----------
const attr = (s, name) => s.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
const decode = (s) => s.replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const nodes = new Map();
for (const m of xml.matchAll(/<node\b([^>]*?)(\/>|>)/g)) {
	nodes.set(attr(m[1], 'id'), [Number(attr(m[1], 'lat')), Number(attr(m[1], 'lon'))]);
}

const ways = [];
for (const m of xml.matchAll(/<way\b([^>]*)>([\s\S]*?)<\/way>/g)) {
	const refs = [...m[2].matchAll(/<nd ref="(\d+)"/g)].map((r) => r[1]);
	const tags = Object.fromEntries([...m[2].matchAll(/<tag k="([^"]*)" v="([^"]*)"/g)].map((t) => [decode(t[1]), decode(t[2])]));
	ways.push({refs, tags});
}

// ---------- Projektion: lokale Meter um den Kartenmittelpunkt ----------
const lat0 = (minlat + maxlat) / 2;
const lon0 = (minlon + maxlon) / 2;
const kx = 111320 * Math.cos((lat0 * Math.PI) / 180);
const ky = 110574;
const project = ([lat, lon]) => [(lon - lon0) * kx, -(lat - lat0) * ky];

const simplify = (pts, tol) => {
	if (pts.length <= 2) return pts;
	const [a, b] = [pts[0], pts[pts.length - 1]];
	let maxD = -1;
	let idx = 0;
	const dx = b[0] - a[0];
	const dy = b[1] - a[1];
	const len = Math.hypot(dx, dy) || 1;
	for (let i = 1; i < pts.length - 1; i++) {
		const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + b[0] * a[1] - b[1] * a[0]) / len;
		if (d > maxD) {
			maxD = d;
			idx = i;
		}
	}

	if (maxD <= tol) return [a, b];
	return [...simplify(pts.slice(0, idx + 1), tol).slice(0, -1), ...simplify(pts.slice(idx), tol)];
};

/** Geschlossene Ringe (Anfang = Ende) am weitest entfernten Punkt teilen, sonst kollabiert Douglas-Peucker. */
const simplifyRing = (pts, tol) => {
	const ring = pts.slice(0, -1);
	if (ring.length < 4) return pts;
	let far = 1;
	let best = -1;
	for (let i = 1; i < ring.length; i++) {
		const d = Math.hypot(ring[i][0] - ring[0][0], ring[i][1] - ring[0][1]);
		if (d > best) {
			best = d;
			far = i;
		}
	}

	const a = simplify(ring.slice(0, far + 1), tol);
	const b = simplify([...ring.slice(far), ring[0]], tol);
	return [...a.slice(0, -1), ...b];
};

const r1 = (v) => Math.round(v * 10) / 10;
const toPath = (pts, closed) => {
	if (pts.length < 2) return '';
	const s = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${r1(p[0])} ${r1(p[1])}`).join('');
	return closed ? `${s}Z` : s;
};

const wayPoints = (w) => w.refs.map((r) => nodes.get(r)).filter(Boolean).map(project);
const isClosed = (w) => w.refs.length > 3 && w.refs[0] === w.refs[w.refs.length - 1];

const layers = {buildings: [], parks: [], water: [], squares: [], streetsMajor: [], streetsMinor: [], pedestrian: [], rail: []};
const named = {};
const MAJOR = new Set(['motorway', 'trunk', 'primary', 'secondary', 'tertiary', 'primary_link', 'secondary_link', 'tertiary_link']);
const MINOR = new Set(['residential', 'unclassified', 'living_street', 'service', 'road']);
const PED = new Set(['pedestrian', 'footway']);

for (const w of ways) {
	const t = w.tags;
	const closed = isClosed(w);
	const pts = wayPoints(w);
	if (pts.length < 2) continue;
	if (t.building && closed) {
		layers.buildings.push(toPath(simplifyRing(pts, 0.6), true));
	} else if ((t.leisure === 'park' || t.landuse === 'grass' || t.leisure === 'garden') && closed) {
		layers.parks.push(toPath(simplifyRing(pts, 1), true));
	} else if ((t.natural === 'water' || t.waterway === 'riverbank') && closed) {
		layers.water.push(toPath(simplifyRing(pts, 1), true));
	} else if ((t.highway === 'pedestrian' && (t.area === 'yes' || closed)) || (t.place === 'square' && closed)) {
		layers.squares.push(toPath(simplifyRing(pts, 0.6), true));
	} else if (t.highway && !t.area) {
		const d = toPath(simplify(pts, 0.6), false);
		if (MAJOR.has(t.highway)) layers.streetsMajor.push(d);
		else if (MINOR.has(t.highway) && t.service === undefined) layers.streetsMinor.push(d);
		else if (PED.has(t.highway) && (t.highway === 'pedestrian' || t.name)) layers.pedestrian.push(d);
		if (t.name && (MAJOR.has(t.highway) || MINOR.has(t.highway) || t.highway === 'pedestrian')) {
			(named[t.name] ??= []).push(d);
		}
	} else if (t.railway === 'tram' || t.railway === 'rail') {
		layers.rail.push(toPath(simplify(pts, 1), false));
	}
}

const width = (maxlon - minlon) * kx;
const height = (maxlat - minlat) * ky;
const result = {
	meta: {
		source: 'OpenStreetMap',
		attribution: '© OpenStreetMap-Mitwirkende',
		license: 'ODbL 1.0 (https://opendatacommons.org/licenses/odbl/1-0/)',
		retrieved: new Date().toISOString().slice(0, 10),
		bbox: {minlat, minlon, maxlat, maxlon},
		center: {lat: lat0, lon: lon0},
		metersPerDegree: {x: kx, y: ky},
		sizeMeters: {width: r1(width), height: r1(height)},
	},
	layers: Object.fromEntries(Object.entries(layers).map(([k, v]) => [k, v.join('')])),
	streets: Object.fromEntries(Object.entries(named).map(([k, v]) => [k, v.join('')])),
};
writeFileSync(out, JSON.stringify(result));
const kb = (JSON.stringify(result).length / 1024).toFixed(0);
console.log(`✔ ${path.relative(ROOT, out)}: ${kb} KB · ${layers.buildings.length} Gebäude · ${Object.keys(named).length} benannte Straßen · ${r1(width)}×${r1(height)} m`);
