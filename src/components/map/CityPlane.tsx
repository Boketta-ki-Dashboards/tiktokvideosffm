import React from 'react';
import {withAlpha} from '../../lib/color';
import {type CityMapData, type LatLon, projectLatLon} from './CityStreetMap';
import {type PlaneBillboard, type PlaneCamera, TiltedPlane} from './TiltedPlane';

/**
 * Beliebige OSM-Stadtkarte (`CityMapData`, z. B. aus `scripts/maps/build-osm-map.mjs`) als perspektivische 2,5D-Ebene:
 * Straßen, Grün, Wasser, Plätze und Bahn am Boden, Gebäude als gestapelte Schichten (dezente Extrusion), weicher Rand per Maske.
 * `spots` leuchten als Bodenkreise (Orte ohne Routen), `highlightStreets` färben benannte Straßen ein. Beschriftungen kommen als
 * `markers` (2D-Ebene über `projectPlanePoint`). Lizenzhinweis „© OpenStreetMap-Mitwirkende“ muss die Szene selbst zeigen.
 */
export type CityPlaneSpot = {at: LatLon; color: string; radius: number; on: number; pulse?: number};

export const cityPlaneSize = (map: CityMapData, k: number) => ({width: Math.round(map.meta.sizeMeters.width * k), height: Math.round(map.meta.sizeMeters.height * k)});

/** Geokoordinate → px in der Ebene (gleiche Skala wie `CityPlane`). */
export const cityPlaneXY = (map: CityMapData, k: number, ll: LatLon): [number, number] => {
	const [mx, my] = projectLatLon(map, ll);
	return [(mx + map.meta.sizeMeters.width / 2) * k, (my + map.meta.sizeMeters.height / 2) * k];
};

export const CityPlane: React.FC<{
	map: CityMapData;
	k: number;
	camera: PlaneCamera;
	anchor: [number, number];
	perspective?: number;
	floors?: number;
	spots?: CityPlaneSpot[];
	highlightStreets?: {name: string; color: string; on: number}[];
	markers?: PlaneBillboard[];
	tint?: string;
}> = ({map, k, camera, anchor, perspective = 1300, floors = 6, spots = [], highlightStreets = [], markers = [], tint = '#2E3C7C'}) => {
	const W = map.meta.sizeMeters.width;
	const H = map.meta.sizeMeters.height;
	const size = cityPlaneSize(map, k);
	const L = map.layers;
	const streets = map.streets as Record<string, string>;
	const Svg: React.FC<{children: React.ReactNode}> = ({children}) => (
		<svg width={size.width} height={size.height} viewBox={`${-W / 2} ${-H / 2} ${W} ${H}`} style={{overflow: 'visible'}}>
			{children}
		</svg>
	);
	const layers = [
		{
			key: 'ground',
			z: 0,
			node: (
				<Svg>
					<rect x={-W} y={-H} width={W * 3} height={H * 3} fill="#080C1F" />
					<path d={L.parks} fill="#0E2A2C" />
					<path d={L.water} fill="#0C2A50" />
					<path d={L.squares} fill="#1A2352" />
					<path d={L.rail} fill="none" stroke="#2C3664" strokeWidth={4} strokeDasharray="10 8" />
					<path d={L.streetsMinor} fill="none" stroke="#2B3568" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
					<path d={L.pedestrian} fill="none" stroke="#323E78" strokeWidth={6} strokeLinecap="round" />
					<path d={L.streetsMajor} fill="none" stroke="#3E4C8C" strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" />
					{highlightStreets.map((h) =>
						streets[h.name] ? <path key={h.name} d={streets[h.name]} fill="none" stroke={withAlpha(h.color, 0.55 * h.on)} strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" /> : null,
					)}
					{spots.map((s, i) => {
						const [x, y] = projectLatLon(map, s.at);
						const p = s.pulse ?? 0;
						return (
							<g key={i} opacity={s.on}>
								<circle cx={x} cy={y} r={s.radius * (1.6 + 0.5 * p)} fill={withAlpha(s.color, 0.12 * (1 - p))} />
								<circle cx={x} cy={y} r={s.radius} fill={withAlpha(s.color, 0.28)} stroke={s.color} strokeWidth={6} />
								<circle cx={x} cy={y} r={s.radius * 0.18} fill={s.color} />
							</g>
						);
					})}
				</Svg>
			),
		},
		...new Array(floors).fill(0).map((_, i) => ({
			key: `b-${i}`,
			z: 4 + i * 3.2,
			node: (
				<Svg>
					<path d={L.buildings} fill={i === floors - 1 ? tint : `rgb(${18 + i * 4}, ${24 + i * 5}, ${58 + i * 9})`} stroke={i === floors - 1 ? '#4558A6' : 'none'} strokeWidth={1.2} />
				</Svg>
			),
		})),
	];
	return <TiltedPlane width={size.width} height={size.height} camera={camera} anchor={anchor} perspective={perspective} layers={layers} billboards={markers} mask="radial-gradient(ellipse 50% 50% at 50% 50%, #000 66%, rgba(0,0,0,0) 99%)" />;
};
