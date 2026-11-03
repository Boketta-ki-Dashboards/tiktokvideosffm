import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {evolvePath, getLength, getPointAtLength} from '@remotion/paths';
import {clamp, EASE_IN_OUT, EASE_OUT, springIn} from '../../lib/animation';
import {withAlpha} from '../../lib/color';
import {useSvgId} from '../../lib/svg';
import {COLORS, FONTS, SAFE_AREA} from '../../theme/tokens';

/** Vektorkarte aus scripts/maps/build-osm-map.mjs (OpenStreetMap, ODbL). */
export type CityMapData = {
	meta: {
		attribution: string;
		center: {lat: number; lon: number};
		metersPerDegree: {x: number; y: number};
		sizeMeters: {width: number; height: number};
	};
	layers: Record<'buildings' | 'parks' | 'water' | 'squares' | 'streetsMajor' | 'streetsMinor' | 'pedestrian' | 'rail', string>;
	streets: Record<string, string>;
};

export type LatLon = [number, number];

export type CityCameraKeyframe = {
	frame: number;
	center: LatLon;
	/** Pixel pro Meter. */
	zoom: number;
};

export type CityMarker = {
	id: string;
	at: LatLon;
	appearFrame: number;
	title: string;
	/** z. B. „Plünderung · Zeil“ */
	status?: string;
	/** z. B. „21:41 · Meldung“ */
	time?: string;
	color?: string;
	icon?: React.ReactNode;
	/** Kartenversatz des Labels in Bildschirm-px relativ zum Marker. */
	labelOffset?: [number, number];
	labelAlign?: 'left' | 'right' | 'center';
	/** Label ab diesem Frame verkleinert zeigen (Übersicht). */
	compactFrom?: number;
	/** Info-Karte ab diesem Frame ausblenden (Marker bleibt). */
	hideCardFrom?: number;
	/** Kurztext im Marker, z. B. Nummer „1“. */
	badge?: string;
};

export type StreetHighlight = {
	name: string;
	color: string;
	fromFrame: number;
	/** Breite in Metern. */
	width?: number;
	/** Pfad „wächst“ entlang der Straße (z. B. Räumung) statt einzublenden. */
	sweepFrames?: number;
	fadeOutFrame?: number;
};

export type AreaGlow = {
	at: LatLon;
	radiusMeters: number;
	color: string;
	fromFrame: number;
	label?: string;
};

export type CityStreetMapProps = {
	map: CityMapData;
	camera: CityCameraKeyframe[];
	markers?: CityMarker[];
	highlights?: StreetHighlight[];
	glows?: AreaGlow[];
	/** Marker-IDs in zeitlicher Reihenfolge → gestrichelte Abfolge-Linie. */
	sequence?: {ids: string[]; fromFrame: number; durationInFrames: number; color?: string};
	/** Bildschirmpunkt, auf den die Kamera zentriert (Standard: leicht oberhalb der Mitte). */
	anchor?: [number, number];
	streetLabels?: Array<{text: string; at: LatLon; rotate?: number; size?: number}>;
	theme?: Partial<typeof DEFAULT_THEME>;
};

const DEFAULT_THEME = {
	background: '#090D20',
	buildings: '#1F2A5C',
	buildingStroke: '#2D3A78',
	parks: '#0F2A2A',
	water: '#0D2A4D',
	squares: '#1B2350',
	major: '#3C4A86',
	minor: '#323D72',
	pedestrian: '#3B4785',
	rail: '#2A335F',
};

export const projectLatLon = (map: CityMapData, [lat, lon]: LatLon): [number, number] => [
	(lon - map.meta.center.lon) * map.meta.metersPerDegree.x,
	-(lat - map.meta.center.lat) * map.meta.metersPerDegree.y,
];

const BaseLayers: React.FC<{map: CityMapData; theme: typeof DEFAULT_THEME}> = React.memo(({map, theme}) => (
	<g>
		<path d={map.layers.water} fill={theme.water} />
		<path d={map.layers.parks} fill={theme.parks} />
		<path d={map.layers.squares} fill={theme.squares} />
		<g fill="none" strokeLinecap="round" strokeLinejoin="round">
			<path d={map.layers.rail} stroke={theme.rail} strokeWidth={2} strokeDasharray="6 5" />
			<path d={map.layers.streetsMinor} stroke={theme.minor} strokeWidth={7} />
			<path d={map.layers.pedestrian} stroke={theme.pedestrian} strokeWidth={8} />
			<path d={map.layers.streetsMajor} stroke={theme.major} strokeWidth={12} />
		</g>
		<path d={map.layers.buildings} fill={theme.buildings} stroke={theme.buildingStroke} strokeWidth={0.8} />
	</g>
));

/**
 * Animierter Stadtplan (Draufsicht) auf Basis echter OpenStreetMap-Geometrie.
 * Kamera per Keyframes (Mittelpunkt + Zoom in px/m), Marker mit Info-Karten,
 * Straßen-Highlights/-Sweeps, Leucht-Bereiche und eine Abfolge-Linie.
 */
export const CityStreetMap: React.FC<CityStreetMapProps> = ({
	map,
	camera,
	markers = [],
	highlights = [],
	glows = [],
	sequence,
	anchor,
	streetLabels = [],
	theme: themeOverride,
}) => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();
	const theme = useMemo(() => ({...DEFAULT_THEME, ...themeOverride}), [themeOverride]);
	const maskId = useSvgId('city-map');
	const [ax, ay] = anchor ?? [width / 2, height * 0.43];

	const cam = useMemo(() => camera.map((k) => ({...k, p: projectLatLon(map, k.center)})), [camera, map]);
	const opts = {...clamp, easing: EASE_IN_OUT};
	const frames = cam.map((k) => k.frame);
	const cx = cam.length > 1 ? interpolate(frame, frames, cam.map((k) => k.p[0]), opts) : cam[0].p[0];
	const cy = cam.length > 1 ? interpolate(frame, frames, cam.map((k) => k.p[1]), opts) : cam[0].p[1];
	const zoom = cam.length > 1 ? Math.exp(interpolate(frame, frames, cam.map((k) => Math.log(k.zoom)), opts)) : cam[0].zoom;
	const tx = ax - cx * zoom;
	const ty = ay - cy * zoom;
	const toScreen = (ll: LatLon): [number, number] => {
		const [x, y] = projectLatLon(map, ll);
		return [x * zoom + tx, y * zoom + ty];
	};

	const sequencePath = useMemo(() => {
		if (!sequence) {
			return null;
		}

		return sequence.ids
			.map((id) => markers.find((m) => m.id === id))
			.filter((m): m is CityMarker => Boolean(m))
			.map((m) => projectLatLon(map, m.at));
	}, [sequence, markers, map]);

	return (
		<AbsoluteFill style={{backgroundColor: theme.background}}>
			<svg width={width} height={height}>
				<g transform={`translate(${tx} ${ty}) scale(${zoom})`}>
					<BaseLayers map={map} theme={theme} />

					{glows.map((g, i) => {
						const [x, y] = projectLatLon(map, g.at);
						const o = interpolate(frame, [g.fromFrame, g.fromFrame + 15], [0, 1], clamp);
						const pulse = 0.75 + 0.25 * Math.sin((frame - g.fromFrame) * 0.18);
						return (
							<g key={i} opacity={o}>
								<circle cx={x} cy={y} r={g.radiusMeters * 1.6} fill={withAlpha(g.color, 0.08 * pulse)} />
								<circle cx={x} cy={y} r={g.radiusMeters} fill={withAlpha(g.color, 0.18 * pulse)} />
							</g>
						);
					})}

					{highlights.map((h) => {
						const d = map.streets[h.name];
						if (!d) {
							return null;
						}

						const out = h.fadeOutFrame === undefined ? 1 : interpolate(frame, [h.fadeOutFrame, h.fadeOutFrame + 12], [1, 0], clamp);
						const w = h.width ?? 14;
						if (h.sweepFrames) {
							const p = interpolate(frame, [h.fromFrame, h.fromFrame + h.sweepFrames], [0, 1], {...clamp, easing: EASE_IN_OUT});
							if (p <= 0) {
								return null;
							}

							return (
								<g key={h.name} opacity={out}>
									<path d={d} fill="none" stroke={withAlpha(h.color, 0.25)} strokeWidth={w * 2.2} strokeLinecap="round" {...evolvePath(p, d)} />
									<path d={d} fill="none" stroke={h.color} strokeWidth={w} strokeLinecap="round" {...evolvePath(p, d)} />
								</g>
							);
						}

						const o = interpolate(frame, [h.fromFrame, h.fromFrame + 12], [0, 1], clamp) * out;
						return (
							<g key={h.name} opacity={o} fill="none" strokeLinecap="round" strokeLinejoin="round">
								<path d={d} stroke={withAlpha(h.color, 0.25)} strokeWidth={w * 2.2} />
								<path d={d} stroke={h.color} strokeWidth={w} />
							</g>
						);
					})}
				</g>

				{/* Abfolge-Linie (Bildschirmkoordinaten → konstante Strichstärke), gestrichelt und fortschreitend */}
				{sequence && sequencePath && sequencePath.length > 1
					? (() => {
							const d = sequencePath
								.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${(x * zoom + tx).toFixed(1)} ${(y * zoom + ty).toFixed(1)}`)
								.join(' ');
							const p = interpolate(frame, [sequence.fromFrame, sequence.fromFrame + sequence.durationInFrames], [0, 1], {
								...clamp,
								easing: EASE_IN_OUT,
							});
							if (p <= 0) {
								return null;
							}

							const head = getPointAtLength(d, getLength(d) * p);
							const color = sequence.color ?? COLORS.signal;
							return (
								<g>
									<defs>
										<mask id={`${maskId}-seq`} maskUnits="userSpaceOnUse" x={0} y={0} width={width} height={height}>
											<path d={d} fill="none" stroke="#FFFFFF" strokeWidth={14} strokeLinecap="round" {...evolvePath(p, d)} />
										</mask>
									</defs>
									<g mask={`url(#${maskId}-seq)`}>
										<path d={d} fill="none" stroke={withAlpha('#000000', 0.5)} strokeWidth={9} strokeLinecap="round" />
										<path d={d} fill="none" stroke={color} strokeWidth={5} strokeDasharray="16 12" strokeDashoffset={-frame * 1.2} strokeLinecap="round" />
									</g>
									{p < 1 && head ? <circle cx={head.x} cy={head.y} r={9} fill="#FFFFFF" /> : null}
								</g>
							);
						})()
					: null}

				{/* Marker */}
				{markers.map((m) => {
					if (frame < m.appearFrame) {
						return null;
					}

					const s = springIn({frame, fps, delay: m.appearFrame, damping: 11});
					const [x, y] = toScreen(m.at);
					const color = m.color ?? COLORS.alert;
					const pulseT = ((frame - m.appearFrame) % 40) / 40;
					return (
						<g key={m.id} transform={`translate(${x} ${y}) scale(${s})`}>
							<circle r={14 + pulseT * 40} fill="none" stroke={color} strokeWidth={4} opacity={(1 - pulseT) * 0.85} />
							<circle r={m.badge ? 26 : 22} fill={withAlpha(color, 0.35)} />
							<circle r={m.badge ? 19 : 13} fill={color} stroke="#FFFFFF" strokeWidth={4} />
							{m.badge ? (
								<text y={8} textAnchor="middle" fontSize={22} fontWeight={900} fill="#FFFFFF" fontFamily="Montserrat, sans-serif">
									{m.badge}
								</text>
							) : null}
						</g>
					);
				})}
			</svg>

			{/* Straßennamen */}
			{streetLabels.map((l) => {
				const [x, y] = toScreen(l.at);
				return (
					<div
						key={l.text}
						style={{
							position: 'absolute',
							left: x,
							top: y,
							translate: '-50% -50%',
							rotate: `${l.rotate ?? 0}deg`,
							fontFamily: FONTS.heading,
							fontWeight: 800,
							fontSize: (l.size ?? 26) * Math.min(1.4, Math.max(0.7, zoom / 1.2)),
							letterSpacing: 3,
							color: withAlpha('#C9D3FF', 0.75),
							textTransform: 'uppercase',
							whiteSpace: 'nowrap',
							textShadow: '0 2px 6px rgba(0,0,0,0.9)',
						}}
					>
						{l.text}
					</div>
				);
			})}

			{/* Info-Karten der Marker */}
			{markers.map((m) => {
				if (frame < m.appearFrame + 3) {
					return null;
				}

				const [x, y] = toScreen(m.at);
				const hide = m.hideCardFrom === undefined ? 1 : interpolate(frame, [m.hideCardFrom, m.hideCardFrom + 8], [1, 0], clamp);
				const p = interpolate(frame, [m.appearFrame + 3, m.appearFrame + 16], [0, 1], {...clamp, easing: EASE_OUT}) * hide;
				if (p <= 0.001) {
					return null;
				}

				const compact = m.compactFrom !== undefined ? interpolate(frame, [m.compactFrom, m.compactFrom + 12], [0, 1], clamp) : 0;
				const [ox, oy] = m.labelOffset ?? [34, -34];
				const align = m.labelAlign ?? 'left';
				const shiftX = align === 'left' ? '0%' : align === 'right' ? '-100%' : '-50%';
				const color = m.color ?? COLORS.alert;
				return (
					<div
						key={`card-${m.id}`}
						style={{
							position: 'absolute',
							left: x + ox,
							top: y + oy,
							translate: `${shiftX} -50%`,
							opacity: p,
							scale: String((0.85 + 0.15 * p) * (1 - 0.32 * compact)),
							transformOrigin: align === 'left' ? 'left center' : align === 'right' ? 'right center' : 'center',
							display: 'flex',
							alignItems: 'center',
							gap: 14,
							padding: '12px 20px 12px 14px',
							borderRadius: 18,
							background: 'rgba(7, 10, 28, 0.9)',
							border: `3px solid ${withAlpha(color, 0.85)}`,
							boxShadow: `0 12px 30px rgba(0,0,0,0.5), 0 0 24px ${withAlpha(color, 0.25)}`,
							whiteSpace: 'nowrap',
						}}
					>
						{m.icon ? (
							<div
								style={{
									width: 58,
									height: 58,
									borderRadius: 14,
									background: withAlpha(color, 0.18),
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								{m.icon}
							</div>
						) : null}
						<div style={{display: 'flex', flexDirection: 'column', lineHeight: 1.12}}>
							{m.time ? (
								<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, color, opacity: 1 - compact * 0.2}}>{m.time}</span>
							) : null}
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 32, color: COLORS.text}}>{m.title}</span>
							{m.status ? (
								<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 23, color: COLORS.textMuted}}>{m.status}</span>
							) : null}
						</div>
					</div>
				);
			})}

			{/* Pflicht-Hinweis der OpenStreetMap-Lizenz (ODbL) – innerhalb der sichtbaren Zone */}
			<div
				style={{
					position: 'absolute',
					left: SAFE_AREA.left,
					bottom: SAFE_AREA.bottom + 22,
					fontFamily: FONTS.body,
					fontWeight: 600,
					fontSize: 20,
					color: withAlpha('#FFFFFF', 0.6),
					textShadow: '0 2px 6px rgba(0,0,0,0.9)',
				}}
			>
				Karte: {map.meta.attribution}
			</div>
		</AbsoluteFill>
	);
};
