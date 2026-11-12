import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {evolvePath, getLength, getPointAtLength} from '@remotion/paths';
import {clamp, EASE_IN_OUT, EASE_OUT, springIn} from '../../lib/animation';
import {withAlpha} from '../../lib/color';
import {COLORS, FONTS} from '../../theme/tokens';
import {Flag, type FlagCode} from '../media/flags/Flag';
import {getWorld, projectPoint} from './geo';
import type {GeoPoint} from './places';

export type MapCameraKeyframe = {
	frame: number;
	center: GeoPoint;
	zoom: number;
};

export type MapArc = {
	id: string;
	from: GeoPoint;
	to: GeoPoint;
	startFrame: number;
	durationInFrames?: number;
	color?: string;
	/** Bogenhöhe relativ zur Distanz. */
	lift?: number;
};

export type MapPin = {
	id: string;
	at: GeoPoint;
	appearFrame: number;
	label?: string;
	sublabel?: string;
	flag?: FlagCode | string;
	/** Label-Versatz in Bildschirm-px. */
	labelOffset?: [number, number];
	labelAlign?: 'left' | 'right' | 'center';
	color?: string;
	pulse?: boolean;
	size?: number;
	/** Label ab diesem Frame wieder ausblenden (z. B. beim Herauszoomen). */
	hideLabelFrom?: number;
};

export type CountryHighlight = {
	id: string;
	color: string;
	fromFrame?: number;
	opacity?: number;
};

export type WorldMapProps = {
	camera: MapCameraKeyframe[];
	arcs?: MapArc[];
	pins?: MapPin[];
	highlights?: CountryHighlight[];
	showGraticule?: boolean;
	oceanColor?: string;
	landColor?: string;
	borderColor?: string;
};

const Countries: React.FC<{landColor: string; borderColor: string}> = React.memo(({landColor, borderColor}) => {
	const {countries} = getWorld();
	return (
		<g fill={landColor} stroke={borderColor} strokeWidth={0.9} strokeLinejoin="round">
			{countries.map((c) => (
				<path key={c.id + c.name} d={c.d} vectorEffect="non-scaling-stroke" />
			))}
		</g>
	);
});

const useMapCamera = (camera: MapCameraKeyframe[], frame: number) => {
	const projected = useMemo(() => camera.map((k) => ({...k, p: projectPoint(k.center)})), [camera]);
	if (projected.length === 1) {
		return {cx: projected[0].p[0], cy: projected[0].p[1], zoom: projected[0].zoom};
	}

	const frames = projected.map((k) => k.frame);
	const opts = {...clamp, easing: EASE_IN_OUT};
	return {
		cx: interpolate(frame, frames, projected.map((k) => k.p[0]), opts),
		cy: interpolate(frame, frames, projected.map((k) => k.p[1]), opts),
		// logarithmisch interpolieren → gleichmäßig wirkender Zoom
		zoom: Math.exp(interpolate(frame, frames, projected.map((k) => Math.log(k.zoom)), opts)),
	};
};

/**
 * Animierte Weltkarte (Natural Earth 1:50 Mio., Equal-Earth-Projektion).
 * Kamera fliegt per Keyframes, Länder leuchten auf, Bögen verbinden Orte, Pins tragen Flaggen-Labels.
 */
export const WorldMap: React.FC<WorldMapProps> = ({
	camera,
	arcs = [],
	pins = [],
	highlights = [],
	showGraticule = true,
	oceanColor = COLORS.ocean,
	landColor = COLORS.land,
	borderColor = COLORS.landStroke,
}) => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();
	const world = getWorld();
	const {cx, cy, zoom} = useMapCamera(camera, frame);

	const tx = width / 2 - cx * zoom;
	const ty = height / 2 - cy * zoom;
	const toScreen = (pt: GeoPoint): [number, number] => {
		const [x, y] = projectPoint(pt);
		return [x * zoom + tx, y * zoom + ty];
	};

	const highlightShapes = useMemo(
		() => highlights.map((h) => ({...h, shapes: world.countries.filter((c) => c.id === h.id)})),
		[highlights, world.countries],
	);

	return (
		<AbsoluteFill style={{backgroundColor: oceanColor}}>
			<svg width={width} height={height}>
				<defs>
					<radialGradient id="map-ocean-glow" cx="50%" cy="45%" r="70%">
						<stop offset="0" stopColor={withAlpha(COLORS.cyan, 0.1)} />
						<stop offset="1" stopColor="rgba(0,0,0,0)" />
					</radialGradient>
				</defs>
				<rect width={width} height={height} fill="url(#map-ocean-glow)" />
				<g transform={`translate(${tx} ${ty}) scale(${zoom})`}>
					{showGraticule ? (
						<path d={world.graticule} fill="none" stroke={withAlpha('#FFFFFF', 0.06)} strokeWidth={1} vectorEffect="non-scaling-stroke" />
					) : null}
					<Countries landColor={landColor} borderColor={borderColor} />
					{highlightShapes.map((h) => {
						const o = interpolate(frame, [h.fromFrame ?? 0, (h.fromFrame ?? 0) + 15], [0, h.opacity ?? 1], clamp);
						return (
							<g key={h.id} fill={h.color} opacity={o} stroke={withAlpha('#FFFFFF', 0.7)} strokeWidth={1.4}>
								{h.shapes.map((s) => (
									<path key={s.name} d={s.d} vectorEffect="non-scaling-stroke" />
								))}
							</g>
						);
					})}
				</g>

				{/* Verbindungsbögen in Bildschirmkoordinaten (konstante Linienstärke) */}
				{arcs.map((arc) => {
					const dur = arc.durationInFrames ?? 30;
					const t = interpolate(frame, [arc.startFrame, arc.startFrame + dur], [0, 1], {...clamp, easing: EASE_IN_OUT});
					if (t <= 0) {
						return null;
					}

					const [x0, y0] = toScreen(arc.from);
					const [x2, y2] = toScreen(arc.to);
					const dx = x2 - x0;
					const dy = y2 - y0;
					const dist = Math.hypot(dx, dy) || 1;
					const lift = (arc.lift ?? 0.28) * dist;
					// Normale, die nach „oben“ zeigt
					let nx = -dy / dist;
					let ny = dx / dist;
					if (ny > 0) {
						nx = -nx;
						ny = -ny;
					}

					const x1 = (x0 + x2) / 2 + nx * lift;
					const y1 = (y0 + y2) / 2 + ny * lift;
					const d = `M ${x0} ${y0} Q ${x1} ${y1} ${x2} ${y2}`;
					const evolved = evolvePath(t, d);
					const head = getPointAtLength(d, getLength(d) * t);
					const color = arc.color ?? COLORS.cyan;
					return (
						<g key={arc.id}>
							<path d={d} fill="none" stroke={withAlpha(color, 0.25)} strokeWidth={14} strokeLinecap="round" {...evolved} />
							<path d={d} fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" {...evolved} />
							{t < 1 && head ? (
								<>
									<circle cx={head.x} cy={head.y} r={16} fill={withAlpha(color, 0.3)} />
									<circle cx={head.x} cy={head.y} r={7} fill="#FFFFFF" />
								</>
							) : null}
						</g>
					);
				})}

				{/* Pins */}
				{pins.map((pin) => {
					const s = springIn({frame, fps, delay: pin.appearFrame, damping: 12});
					if (frame < pin.appearFrame) {
						return null;
					}

					const [x, y] = toScreen(pin.at);
					const color = pin.color ?? COLORS.signal;
					const size = pin.size ?? 9;
					const pulseT = ((frame - pin.appearFrame) % 45) / 45;
					return (
						<g key={pin.id} transform={`translate(${x} ${y}) scale(${s})`}>
							{pin.pulse !== false ? (
								<circle r={size + pulseT * 34} fill="none" stroke={color} strokeWidth={3} opacity={(1 - pulseT) * 0.8} />
							) : null}
							<circle r={size + 5} fill={withAlpha(color, 0.35)} />
							<circle r={size} fill={color} stroke="#FFFFFF" strokeWidth={3} />
						</g>
					);
				})}
			</svg>

			{/* HTML-Labels (bessere Typografie, Flaggen) */}
			{pins.map((pin) => {
				if (!pin.label || frame < pin.appearFrame + 4) {
					return null;
				}

				const [x, y] = toScreen(pin.at);
				const [ox, oy] = pin.labelOffset ?? [24, -24];
				const fadeOut = pin.hideLabelFrom === undefined ? 1 : interpolate(frame, [pin.hideLabelFrom, pin.hideLabelFrom + 10], [1, 0], clamp);
				const p = interpolate(frame, [pin.appearFrame + 4, pin.appearFrame + 18], [0, 1], {...clamp, easing: EASE_OUT}) * fadeOut;
				if (p <= 0.001) {
					return null;
				}

				const align = pin.labelAlign ?? 'left';
				const shiftX = align === 'left' ? '0%' : align === 'right' ? '-100%' : '-50%';
				return (
					<div
						key={`label-${pin.id}`}
						style={{
							position: 'absolute',
							left: x + ox,
							top: y + oy,
							translate: `${shiftX} -50%`,
							opacity: p,
							scale: String(0.85 + 0.15 * p),
							display: 'flex',
							alignItems: 'center',
							gap: 14,
							padding: '12px 20px 12px 14px',
							borderRadius: 18,
							background: 'rgba(8, 12, 32, 0.82)',
							border: `2px solid ${withAlpha(pin.color ?? COLORS.signal, 0.7)}`,
							boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
							whiteSpace: 'nowrap',
						}}
					>
						{pin.flag ? <Flag code={pin.flag} width={54} rounded={5} shadow={false} /> : null}
						<div style={{display: 'flex', flexDirection: 'column', lineHeight: 1.1}}>
							<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 30, color: COLORS.text}}>{pin.label}</span>
							{pin.sublabel ? (
								<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, color: COLORS.textMuted}}>{pin.sublabel}</span>
							) : null}
						</div>
					</div>
				);
			})}
		</AbsoluteFill>
	);
};
