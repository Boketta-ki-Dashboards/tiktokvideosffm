#!/usr/bin/env node
/**
 * Linienverläufe (OSM-Routenrelationen) und Haltestellen für eine mit build-osm-map.mjs erzeugte Karte.
 * Gleiche Projektion wie die Karte (Mittelpunkt + Meter pro Grad aus deren `meta`), damit Linien exakt auf den Straßen liegen.
 *
 *   node scripts/maps/build-osm-routes.mjs --input a.osm,b.osm --map src/data/maps/frankfurt-altstadt-oepnv.json \
 *     --refs "tram:11,12,14,18;bus:30,M36;subway:U4,U5" --out src/data/maps/frankfurt-altstadt-oepnv.routes.json
 *
 * Mehrere Eingabedateien (Kacheln) werden zusammengeführt. Daten: © OpenStreetMap-Mitwirkende (ODbL 1.0).
 */
import {readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {parseArgs, ROOT} from '../lib/project.mjs';

const args = parseArgs(process.argv.slice(2));
if (!args.input || !args.map || !args.refs || !args.out) {
	console.error('Aufruf: --input a.osm[,b.osm] --map <karte.json> --refs "tram:11,12;subway:U4" --out <datei.json>');
	process.exit(1);
}

const attr = (s, name) => s.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
const decode = (s) => s.replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const tagsOf = (body) => Object.fromEntries([...body.matchAll(/<tag k="([^"]*)" v="([^"]*)"/g)].map((t) => [decode(t[1]), decode(t[2])]));

const nodes = new Map();
const nodeTags = new Map();
const ways = new Map();
const relations = new Map();
for (const file of String(args.input).split(',')) {
	const xml = readFileSync(file, 'utf8');
	for (const m of xml.matchAll(/<node\b([^>]*?)(?:\/>|>([\s\S]*?)<\/node>)/g)) {
		const id = attr(m[1], 'id');
		nodes.set(id, [Number(attr(m[1], 'lat')), Number(attr(m[1], 'lon'))]);
		if (m[2]) nodeTags.set(id, tagsOf(m[2]));
	}

	for (const m of xml.matchAll(/<way\b([^>]*)>([\s\S]*?)<\/way>/g)) {
		ways.set(attr(m[1], 'id'), {refs: [...m[2].matchAll(/<nd ref="(\d+)"/g)].map((r) => r[1]), tags: tagsOf(m[2])});
	}

	for (const m of xml.matchAll(/<relation\b([^>]*)>([\s\S]*?)<\/relation>/g)) {
		const tags = tagsOf(m[2]);
		if (tags.type !== 'route') continue;
		const members = [...m[2].matchAll(/<member type="(\w+)" ref="(\d+)" role="([^"]*)"/g)].map((x) => ({type: x[1], ref: x[2], role: x[3]}));
		relations.set(attr(m[1], 'id'), {tags, members});
	}
}

const map = JSON.parse(readFileSync(path.resolve(ROOT, args.map), 'utf8'));
const {center, metersPerDegree} = map.meta;
const project = ([lat, lon]) => [(lon - center.lon) * metersPerDegree.x, -(lat - center.lat) * metersPerDegree.y];
const r1 = (v) => Math.round(v * 10) / 10;
const toPath = (pts) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${r1(p[0])} ${r1(p[1])}`).join('');

const wanted = String(args.refs)
	.split(';')
	.flatMap((part) => {
		const [route, list] = part.split(':');
		return list.split(',').map((ref) => ({route, ref}));
	});

const routes = {};
const stops = {};
for (const {route, ref} of wanted) {
	const rels = [...relations.values()].filter((r) => r.tags.ref === ref && (r.tags.route === route || (route === 'subway' && r.tags.route === 'light_rail')));
	if (rels.length === 0) {
		console.warn(`  ⚠ keine Relation für ${route} ${ref}`);
		continue;
	}

	const wayIds = new Set();
	const stopNames = new Set();
	for (const rel of rels) {
		for (const mem of rel.members) {
			if (mem.type === 'way' && !/platform/.test(mem.role) && ways.has(mem.ref)) wayIds.add(mem.ref);
			if (mem.type === 'node' && /^stop/.test(mem.role) && nodeTags.has(mem.ref)) {
				const name = nodeTags.get(mem.ref).name;
				if (name) {
					stopNames.add(name);
					(stops[name] ??= {points: [], lines: new Set()}).points.push(project(nodes.get(mem.ref)));
					stops[name].lines.add(ref);
				}
			}
		}
	}

	const parts = [...wayIds].map((id) => ways.get(id).refs.map((r) => nodes.get(r)).filter(Boolean).map(project)).filter((p) => p.length > 1);
	routes[ref] = {route, name: rels[0].tags.name ?? ref, stops: [...stopNames], d: parts.map(toPath).join('')};
	console.log(`  ${route} ${ref}: ${parts.length} Abschnitte, Halte: ${[...stopNames].join(' · ')}`);
}

const stopOut = Object.fromEntries(
	Object.entries(stops).map(([name, s]) => {
		const x = s.points.reduce((a, p) => a + p[0], 0) / s.points.length;
		const y = s.points.reduce((a, p) => a + p[1], 0) / s.points.length;
		return [name, {x: r1(x), y: r1(y), lines: [...s.lines]}];
	}),
);

const result = {
	meta: {source: 'OpenStreetMap (Routenrelationen)', attribution: '© OpenStreetMap-Mitwirkende', license: 'ODbL 1.0', retrieved: new Date().toISOString().slice(0, 10), map: args.map},
	routes,
	stops: stopOut,
};
writeFileSync(path.resolve(ROOT, args.out), JSON.stringify(result));
console.log(`✔ ${args.out}: ${Object.keys(routes).length} Linien, ${Object.keys(stopOut).length} Halte`);
