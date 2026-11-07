import {geoEqualEarth, geoGraticule10, geoPath, type GeoProjection} from 'd3-geo';
import {feature} from 'topojson-client';
import type {FeatureCollection, Geometry} from 'geojson';
import type {Topology} from 'topojson-specification';
import world50m from 'world-atlas/countries-50m.json';
import type {GeoPoint} from './places';

/** Kartenbreite in Basis-Koordinaten (Zoom 1 = ganze Welt 2400 px breit). */
export const MAP_BASE_WIDTH = 2400;

export type CountryShape = {id: string; name: string; d: string};

let cache: {projection: GeoProjection; countries: CountryShape[]; graticule: string; height: number} | null = null;

/** Projiziert die Natural-Earth-Länder (1:50 Mio.) einmalig und cached die SVG-Pfade. */
export const getWorld = () => {
	if (cache) {
		return cache;
	}

	const topology = world50m as unknown as Topology;
	const collection = feature(topology, topology.objects.countries) as unknown as FeatureCollection<Geometry, {name: string}>;
	const projection = geoEqualEarth().fitWidth(MAP_BASE_WIDTH, {type: 'Sphere'});
	const path = geoPath(projection);
	const countries = collection.features
		.filter((f) => f.properties.name !== 'Antarctica')
		.map((f) => ({id: String(f.id ?? ''), name: f.properties.name, d: path(f) ?? ''}));
	const bounds = path.bounds({type: 'Sphere'});
	cache = {
		projection,
		countries,
		graticule: path(geoGraticule10()) ?? '',
		height: bounds[1][1] - bounds[0][1],
	};
	return cache;
};

export const projectPoint = (point: GeoPoint): [number, number] => {
	const p = getWorld().projection(point);
	if (!p) {
		throw new Error(`Punkt nicht projizierbar: ${point.join(', ')}`);
	}

	return p;
};
