import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {geoMercator, geoPath} from 'd3-geo';
import {feature} from 'topojson-client';
import type {Feature, FeatureCollection, Geometry} from 'geojson';
import type {Topology} from 'topojson-specification';
import world50m from 'world-atlas/countries-50m.json';
import {clamp, EASE_OUT, springIn} from '../../lib/animation';
import {withAlpha} from '../../lib/color';
import {COLORS, FONTS} from '../../theme/tokens';

export type GermanyCity = {id: string; name: string; lon: number; lat: number; selbst?: boolean};

export type GermanyMapProps = {
	cities: GermanyCity[];
	/** Kartengröße in px. */
	width: number;
	height: number;
	/** Frame, ab dem die ersten Städte erscheinen. */
	startFrame?: number;
	/** Frames zwischen zwei Städten (Reihenfolge laut `cities`). */
	stepFrames?: number;
	/** Stadt mit zusätzlicher Animation (Ripple + Schild). */
	highlightId?: string;
	/** Frame, ab dem die Hervorhebung läuft. */
	highlightFrame?: number;
	highlightLabel?: string;
	/** Städte, deren Name dauerhaft neben dem Punkt steht. */
	labelIds?: string[];
	/** Farbe der von Gen Z regelt selbst organisierten Städte (orange) bzw. der angeschlossenen (weiß). */
	colorSelf?: string;
	colorOther?: string;
	delay?: number;
};

type Shape = {id: string; d: string};

const NEIGHBORS = ['250', '616', '203', '040', '756', '528', '056', '442', '208', '752'];
const GERMANY = '276';

let cache: {projection: ReturnType<typeof geoMercator>; shapes: Shape[]; w: number; h: number} | null = null;

const build = (width: number, height: number) => {
	if (cache && cache.w === width && cache.h === height) {
		return cache;
	}

	const topology = world50m as unknown as Topology;
	const all = feature(topology, topology.objects.countries) as unknown as FeatureCollection<Geometry>;
	const germany = all.features.find((f) => String(f.id) === GERMANY) as Feature<Geometry>;
	const projection = geoMercator().fitExtent(
		[
			[24, 24],
			[width - 24, height - 24],
		],
		germany,
	);
	const path = geoPath(projection);
	const shapes: Shape[] = all.features
		.filter((f) => NEIGHBORS.includes(String(f.id)) || String(f.id) === GERMANY)
		.map((f) => ({id: String(f.id), d: path(f) ?? ''}));
	cache = {projection, shapes, w: width, h: height};
	return cache;
};

/** Deutschlandkarte (Natural Earth) mit animiert erscheinenden Städtepunkten. Keine erfundenen Orte – Daten kommen von außen. */
export const GermanyMap: React.FC<GermanyMapProps> = ({
	cities,
	width,
	height,
	startFrame = 0,
	stepFrames = 1.6,
	highlightId,
	highlightFrame = 0,
	highlightLabel,
	labelIds = [],
	colorSelf = '#FF9A2E',
	colorOther = '#FFFFFF',
	delay = 0,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {projection, shapes} = build(width, height);
	const intro = interpolate(frame, [delay, delay + 16], [0, 1], {...clamp, easing: EASE_OUT});
	const pts = cities.map((c) => ({city: c, p: projection([c.lon, c.lat]) as [number, number]}));
	const hl = pts.find((x) => x.city.id === highlightId);
	const hlOn = hl ? interpolate(frame, [highlightFrame, highlightFrame + 12], [0, 1], {...clamp, easing: EASE_OUT}) : 0;

	return (
		<div style={{position: 'relative', width, height, opacity: intro, overflow: 'hidden', borderRadius: 28, border: '3px solid rgba(255,255,255,0.16)', background: 'rgba(8,12,34,0.55)'}}>
			<svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
				{shapes.map((s) => (
					<path
						key={s.id}
						d={s.d}
						fill={s.id === GERMANY ? '#243464' : '#161F42'}
						stroke={s.id === GERMANY ? '#5B74C4' : '#2B3A6B'}
						strokeWidth={s.id === GERMANY ? 3 : 1.5}
						strokeLinejoin="round"
					/>
				))}

				{/* Städtepunkte */}
				{pts.map(({city, p}, i) => {
					const d = startFrame + i * stepFrames;
					const s = springIn({frame, fps, delay: d, damping: 9, stiffness: 190});
					if (frame < d) {
						return null;
					}

					const isHl = city.id === highlightId;
					const color = city.selbst ? colorSelf : colorOther;
					const r = isHl ? 15 : city.selbst ? 12 : 8.5;
					const burst = interpolate(frame, [d, d + 14], [1, 0], {...clamp, easing: EASE_OUT});
					return (
						<g key={city.id} transform={`translate(${p[0]} ${p[1]})`}>
							<circle r={r + 24 * burst} fill="none" stroke={withAlpha(color, 0.7 * burst)} strokeWidth={3} />
							<circle r={(r + 8) * s} fill={withAlpha(color, 0.22)} />
							<circle r={r * s} fill={color} stroke="#0B1029" strokeWidth={2.5} />
						</g>
					);
				})}

				{/* Frankfurt: Wellen */}
				{hl && frame >= highlightFrame
					? [0, 1, 2].map((k) => {
							const t = ((frame - highlightFrame + k * 16) % 48) / 48;
							return (
								<circle
									key={k}
									cx={hl.p[0]}
									cy={hl.p[1]}
									r={18 + t * 90}
									fill="none"
									stroke={withAlpha(COLORS.signal, (1 - t) * 0.9 * hlOn)}
									strokeWidth={5 - t * 3}
								/>
							);
						})
					: null}
			</svg>

			{/* Namensschilder */}
			{pts
				.filter(({city}) => labelIds.includes(city.id) && city.id !== highlightId)
				.map(({city, p}) => {
					const i = cities.findIndex((c) => c.id === city.id);
					const o = interpolate(frame, [startFrame + i * stepFrames + 8, startFrame + i * stepFrames + 18], [0, 1], clamp);
					return (
						<div
							key={city.id}
							style={{
								position: 'absolute',
								left: p[0] + 16,
								top: p[1] - 15,
								opacity: o,
								fontFamily: FONTS.body,
								fontWeight: 800,
								fontSize: 24,
								color: COLORS.text,
								textShadow: '0 2px 8px #000, 0 0 3px #000',
								whiteSpace: 'nowrap',
							}}
						>
							{city.name}
						</div>
					);
				})}

			{hl && highlightLabel ? (
				<div
					style={{
						position: 'absolute',
						left: hl.p[0] + 26,
						top: hl.p[1] - 62 + (1 - hlOn) * 16,
						opacity: hlOn,
						padding: '6px 16px',
						borderRadius: 12,
						background: COLORS.signal,
						border: '3px solid #0B1029',
						fontFamily: FONTS.heading,
						fontWeight: 900,
						fontSize: 28,
						color: '#0B1029',
						whiteSpace: 'nowrap',
						boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
					}}
				>
					{highlightLabel}
				</div>
			) : null}
		</div>
	);
};
