import React from 'react';
import {type CityMapData, type LatLon, projectLatLon} from '../../../components/map/CityStreetMap';
import {type PlaneBillboard, type PlaneCamera, TiltedPlane} from '../../../components/map/TiltedPlane';
import berlin from '../../../data/maps/berlin-charlottenburg.json';
import {withAlpha} from '../../../lib/color';

const MAP = berlin as unknown as CityMapData;
/** px pro Meter in der Ebene */
export const BERLIN_K = 0.6;
const W = MAP.meta.sizeMeters.width;
const H = MAP.meta.sizeMeters.height;
export const BERLIN_PLANE = {width: Math.round(W * BERLIN_K), height: Math.round(H * BERLIN_K)} as const;

/** Geokoordinate → px in der Berlin-Ebene. */
export const berlinXY = (ll: LatLon): [number, number] => {
	const [mx, my] = projectLatLon(MAP, ll);
	return [(mx + W / 2) * BERLIN_K, (my + H / 2) * BERLIN_K];
};

const Svg: React.FC<{children: React.ReactNode}> = ({children}) => (
	<svg width={BERLIN_PLANE.width} height={BERLIN_PLANE.height} viewBox={`${-W / 2} ${-H / 2} ${W} ${H}`} style={{overflow: 'visible'}}>
		{children}
	</svg>
);

/**
 * Berlin-Charlottenburg als perspektivische 2,5D-Stadtkarte (OpenStreetMap, ODbL): Straßen, Grünflächen, Bahn auf dem Boden,
 * Gebäude als gestapelte Schichten (dezente Extrusion), Strecke als leuchtende rote Linie (`route`, wird über `progress`
 * gezeichnet), gestrichelter schematischer Abschnitt (`connector`), Ortsmarken als aufrechte `markers`.
 */
export const BerlinPlane: React.FC<{
	camera: PlaneCamera;
	anchor?: [number, number];
	route: LatLon[];
	connector?: [LatLon, LatLon];
	progress: number;
	connectorOn?: number;
	markers?: PlaneBillboard[];
	highlightStreet?: string;
	highlightOn?: number;
}> = ({camera, anchor = [540, 900], route, connector, progress, connectorOn = 1, markers = [], highlightStreet, highlightOn = 0}) => {
	const L = MAP.layers;
	const routeD = route
		.map((ll, i) => {
			const [x, y] = projectLatLon(MAP, ll);
			return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
		})
		.join(' ');
	const conn = connector ? connector.map((ll) => projectLatLon(MAP, ll)) : null;
	const street = highlightStreet ? (MAP.streets as Record<string, string>)[highlightStreet] : undefined;
	const floors = 6;
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
					<path d={L.pedestrian} fill="none" stroke="#323E78" strokeWidth={5} strokeLinecap="round" />
					<path d={L.streetsMajor} fill="none" stroke="#3E4C8C" strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" />
					{street ? <path d={street} fill="none" stroke={withAlpha('#FF4D5E', 0.35 * highlightOn)} strokeWidth={34} strokeLinecap="round" strokeLinejoin="round" /> : null}
					{conn ? <line x1={conn[0][0]} y1={conn[0][1]} x2={conn[1][0]} y2={conn[1][1]} stroke={withAlpha('#FFFFFF', 0.85 * connectorOn)} strokeWidth={9} strokeDasharray="22 18" strokeLinecap="round" /> : null}
					<path d={routeD} fill="none" stroke={withAlpha('#FF4D5E', 0.28)} strokeWidth={46} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - progress} />
					<path d={routeD} fill="none" stroke="#FF4D5E" strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - progress} />
					<path d={routeD} fill="none" stroke="#FFD6DA" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - progress} />
				</Svg>
			),
		},
		...new Array(floors).fill(0).map((_, k) => ({
			key: `b-${k}`,
			z: 4 + k * 3.2,
			node: (
				<Svg>
					<path d={L.buildings} fill={k === floors - 1 ? '#2E3C7C' : `rgb(${18 + k * 4}, ${24 + k * 5}, ${58 + k * 9})`} stroke={k === floors - 1 ? '#4558A6' : 'none'} strokeWidth={1.2} />
				</Svg>
			),
		})),
	];
	return <TiltedPlane width={BERLIN_PLANE.width} height={BERLIN_PLANE.height} camera={camera} anchor={anchor} perspective={1300} layers={layers} billboards={markers} mask="radial-gradient(ellipse 50% 50% at 50% 50%, #000 68%, rgba(0,0,0,0) 99%)" />;
};
