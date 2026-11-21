import React from 'react';
import {geoMercator, geoPath} from 'd3-geo';
import {feature} from 'topojson-client';
import type {Feature, FeatureCollection, Geometry} from 'geojson';
import type {Topology} from 'topojson-specification';
import world50m from 'world-atlas/countries-50m.json';
import {random, useCurrentFrame} from 'remotion';
import {type PlaneBillboard, type PlaneCamera, TiltedPlane} from '../../../components/map/TiltedPlane';
import {withAlpha} from '../../../lib/color';

/** Ebenengröße der Deutschlandkarte in px (Projektion passt Deutschland hinein). */
export const DE_PLANE = {width: 1000, height: 1300} as const;

const GERMANY = '276';
const NEIGHBORS = ['250', '616', '203', '040', '756', '528', '056', '442', '208', '752', '380', '705', '348'];

type Geo = {germany: string; neighbors: string[]; project: (lonLat: [number, number]) => [number, number]};
let cache: Geo | null = null;

/** Natural-Earth-Geometrie (world-atlas 50m, gemeinfrei) einmalig projizieren. */
export const germanyGeo = (): Geo => {
	if (cache) return cache;
	const topology = world50m as unknown as Topology;
	const all = feature(topology, topology.objects.countries) as unknown as FeatureCollection<Geometry>;
	const de = all.features.find((f) => String(f.id) === GERMANY) as Feature<Geometry>;
	const projection = geoMercator().fitExtent(
		[
			[60, 60],
			[DE_PLANE.width - 60, DE_PLANE.height - 60],
		],
		de,
	);
	const path = geoPath(projection);
	cache = {
		germany: path(de) ?? '',
		neighbors: all.features.filter((f) => NEIGHBORS.includes(String(f.id))).map((f) => path(f) ?? ''),
		project: (ll) => projection(ll) as [number, number],
	};
	return cache;
};

export type MapCity = {id: string; name: string; lon: number; lat: number};

/**
 * Deutschlandkarte als 2,5D-Landmasse: Nachbarländer als dunkle Grundfläche, Deutschland als extrudierte Platte
 * (gestapelte Schichten) mit leuchtender Kante, Raster und „Stadtlichtern“; Orte als aufrechte Marker (`markers`).
 */
export const GermanyPlane: React.FC<{camera: PlaneCamera; anchor?: [number, number]; markers?: PlaneBillboard[]; glow?: number; extrude?: number}> = ({camera, anchor = [540, 860], markers = [], glow = 1, extrude = 8}) => {
	const frame = useCurrentFrame();
	const geo = germanyGeo();
	const {width, height} = DE_PLANE;
	const lights = React.useMemo(
		() =>
			new Array(70).fill(0).map((_, i) => ({
				x: 160 + random(`de-l-x-${i}`) * 680,
				y: 140 + random(`de-l-y-${i}`) * 1020,
				r: 1.5 + random(`de-l-r-${i}`) * 2.5,
				p: random(`de-l-p-${i}`) * 6,
			})),
		[],
	);
	const svg = (children: React.ReactNode) => (
		<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{overflow: 'visible'}}>
			{children}
		</svg>
	);
	const layers = [
		{
			key: 'base',
			z: -extrude * 4 - 6,
			node: svg(
				<>
					<rect x={-2000} y={-2000} width={width + 4000} height={height + 4000} fill="#070B22" />
					{geo.neighbors.map((d, i) => (
						<path key={i} d={d} fill="#111A3C" stroke="#25336A" strokeWidth={2} strokeLinejoin="round" />
					))}
					<g opacity={0.25}>
						{new Array(30).fill(0).map((_, i) => (
							<line key={`h${i}`} x1={-2000} x2={width + 2000} y1={i * 60 - 200} y2={i * 60 - 200} stroke="#2A3A7A" strokeWidth={1} />
						))}
						{new Array(30).fill(0).map((_, i) => (
							<line key={`v${i}`} y1={-2000} y2={height + 2000} x1={i * 60 - 400} x2={i * 60 - 400} stroke="#2A3A7A" strokeWidth={1} />
						))}
					</g>
				</>,
			),
		},
		...new Array(extrude).fill(0).map((_, k) => ({
			key: `slab-${k}`,
			z: -(extrude - k) * 4,
			node: svg(<path d={geo.germany} fill={k === 0 ? '#0E1434' : `rgb(${22 + k * 3}, ${30 + k * 4}, ${78 + k * 6})`} stroke="#3B4F9E" strokeWidth={1.5} strokeLinejoin="round" />),
		})),
		{
			key: 'top',
			z: 0,
			node: svg(
				<>
					<defs>
						<linearGradient id="de-top" x1="0" y1="0" x2="1" y2="1">
							<stop offset="0" stopColor="#3A4E9C" />
							<stop offset="0.55" stopColor="#2A3A7E" />
							<stop offset="1" stopColor="#1E2A62" />
						</linearGradient>
						<clipPath id="de-clip">
							<path d={geo.germany} />
						</clipPath>
					</defs>
					<path d={geo.germany} fill="url(#de-top)" />
					<g clipPath="url(#de-clip)">
						{new Array(26).fill(0).map((_, i) => (
							<line key={`gh${i}`} x1={0} x2={width} y1={i * 50} y2={i * 50} stroke="#FFFFFF" strokeOpacity={0.05} strokeWidth={1} />
						))}
						{new Array(22).fill(0).map((_, i) => (
							<line key={`gv${i}`} y1={0} y2={height} x1={i * 50} x2={i * 50} stroke="#FFFFFF" strokeOpacity={0.05} strokeWidth={1} />
						))}
						{lights.map((l, i) => (
							<circle key={i} cx={l.x} cy={l.y} r={l.r} fill="#FFD9A0" opacity={0.25 + 0.2 * Math.sin(frame / 14 + l.p)} />
						))}
					</g>
					<path d={geo.germany} fill="none" stroke={withAlpha('#8FB4FF', 0.35 * glow)} strokeWidth={14} strokeLinejoin="round" />
					<path d={geo.germany} fill="none" stroke="#9CC2FF" strokeWidth={3} strokeLinejoin="round" />
				</>,
			),
		},
	];
	return <TiltedPlane width={width} height={height} camera={camera} anchor={anchor} perspective={1400} layers={layers} billboards={markers} />;
};

/** Aufrechter Ortsmarker: Leuchtsäule + Stadtname (bleibt bei jeder Kamerafahrt lesbar). */
export const CityPin: React.FC<{name: string; color: string; on: number; size?: number; sub?: string; shift?: number; stem?: number}> = ({name, color, on, size = 1, sub, shift = 0, stem = 70}) => {
	const frame = useCurrentFrame();
	const pulse = 0.5 + 0.5 * Math.sin(frame / 6);
	return (
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: on, scale: String((0.6 + 0.4 * on) * size), transformOrigin: '50% 100%'}}>
			<div style={{translate: `${shift}px 0`, padding: '6px 14px', borderRadius: 12, background: 'rgba(8,10,28,0.92)', border: `3px solid ${color}`, boxShadow: `0 10px 30px rgba(0,0,0,0.5), 0 0 24px ${withAlpha(color, 0.35)}`, fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 30, letterSpacing: 1.5, color: '#FFFFFF', whiteSpace: 'nowrap', textAlign: 'center'}}>
				{name}
				{sub ? <div style={{fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 18, letterSpacing: 0.5, color: withAlpha('#FFFFFF', 0.75)}}>{sub}</div> : null}
			</div>
			<div style={{width: 4, height: stem, background: `linear-gradient(${color}, ${withAlpha(color, 0.1)})`}} />
			<div style={{width: 26, height: 26, borderRadius: 13, marginTop: -13, background: color, boxShadow: `0 0 ${18 + 16 * pulse}px ${withAlpha(color, 0.8)}`, border: '3px solid #FFFFFF'}} />
		</div>
	);
};
