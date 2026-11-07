import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, EASE_IN_OUT, EASE_OUT, springIn} from '../../lib/animation';
import {withAlpha} from '../../lib/color';
import {FONTS} from '../../theme/tokens';
import {type DamageStatus, STATUS_STYLE} from '../media/ShopCard';
import {type CityCameraKeyframe, type CityMapData, type LatLon, useCityCamera} from './CityStreetMap';

export type DamagePin = {
	id: string;
	at: LatLon;
	status: DamageStatus;
	label: string;
	appearFrame: number;
	/** Nur ungefähre Lage (Straße bekannt, Hausnummer nicht). */
	approx?: boolean;
};

export type DamagePinsProps = {
	map: CityMapData;
	camera: CityCameraKeyframe[];
	anchor?: [number, number];
	pins: DamagePin[];
	/** Welcher Pin wann hervorgehoben ist (Kamera ist dort). */
	active?: Array<{id: string; from: number; to: number}>;
	/** Animierte Verbindungslinien (z. B. Kamerafahrt von Laden zu Laden). */
	connectors?: Array<{from: string; to: string; startFrame: number; durationInFrames: number}>;
	/** Ab diesem Frame Namensschilder an allen Pins zeigen (Übersicht). */
	labelsFrom?: number;
	clusterRadiusPx?: number;
	/** Bildschirmbereich (y), in dem Übersichts-Schilder stehen dürfen. */
	labelArea?: {top: number; bottom: number};
};

const PinGlyph: React.FC<{status: DamageStatus}> = ({status}) => {
	if (status === 'gepluendert') {
		return <path d="M -6 -5 L 6 -5 L 8 7 L -8 7 Z M -3 -5 Q 0 -11 3 -5" fill="none" stroke="#FFFFFF" strokeWidth={2.6} strokeLinejoin="round" />;
	}

	if (status === 'beschaedigt') {
		return <path d="M -7 -7 L -1 -1 L -5 3 L 2 8 M -1 -1 L 7 -5" fill="none" stroke="#FFFFFF" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />;
	}

	return (
		<text y={7} textAnchor="middle" fontSize={20} fontWeight={900} fill="#FFFFFF" fontFamily="Montserrat, sans-serif">
			?
		</text>
	);
};

type Placed = {pin: DamagePin; x: number; y: number; s: number};

/**
 * Overlay für den Stadtplan: farbige Schadenspins mit Pop-in, Hervorhebung, Clustern bei Überlappung
 * und kollisionsfreien Namensschildern. Nutzt exakt dieselbe Kamera wie <CityStreetMap>.
 */
export const DamagePins: React.FC<DamagePinsProps> = ({map, camera, anchor, pins, active = [], connectors = [], labelsFrom, clusterRadiusPx = 34, labelArea}) => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();
	const {toScreen} = useCityCamera(map, camera, anchor, frame);
	const activeId = active.find((a) => frame >= a.from && frame < a.to)?.id;

	const visible: Placed[] = pins
		.filter((p) => frame >= p.appearFrame)
		.map((pin) => {
			const [x, y] = toScreen(pin.at);
			return {pin, x, y, s: springIn({frame, fps, delay: pin.appearFrame, damping: 10, stiffness: 170})};
		});

	// Cluster bilden (aktiver Pin bleibt immer einzeln)
	const clusters: Placed[][] = [];
	for (const v of visible) {
		if (v.pin.id === activeId) {
			clusters.push([v]);
			continue;
		}

		const hit = clusters.find((c) => c[0].pin.id !== activeId && c.some((o) => Math.hypot(o.x - v.x, o.y - v.y) < clusterRadiusPx));
		if (hit) hit.push(v);
		else clusters.push([v]);
	}

	const byId = new Map(visible.map((v) => [v.pin.id, v]));
	const labelsOn = labelsFrom !== undefined ? interpolate(frame, [labelsFrom, labelsFrom + 12], [0, 1], clamp) : 0;

	// Kollisionsfreie Beschriftung (gierig: rechts, links, oben, unten)
	const taken: Array<{x: number; y: number; w: number; h: number}> = [];
	const labelBoxes: Array<{key: string; x: number; y: number; text: string; color: string}> = [];
	if (labelsOn > 0) {
		for (const c of clusters) {
			const cx = c.reduce((a, v) => a + v.x, 0) / c.length;
			const cy = c.reduce((a, v) => a + v.y, 0) / c.length;
			taken.push({x: cx - 22, y: cy - 22, w: 44, h: 44});
		}

		for (const c of clusters) {
			const cx = c.reduce((a, v) => a + v.x, 0) / c.length;
			const cy = c.reduce((a, v) => a + v.y, 0) / c.length;
			const text = c.length === 1 ? c[0].pin.label : `${c.length} Läden`;
			const w = text.length * 13 + 24;
			const h = 34;
			const options = [
				{x: cx + 26, y: cy - h / 2},
				{x: cx - 26 - w, y: cy - h / 2},
				{x: cx - w / 2, y: cy - 30 - h},
				{x: cx - w / 2, y: cy + 30},
			];
			const ok = options.find(
				(o) =>
					o.x > 20 &&
					o.x + w < width - 20 &&
					o.y > (labelArea?.top ?? 200) &&
					o.y + h < (labelArea?.bottom ?? height - 450) &&
					!taken.some((t) => o.x < t.x + t.w && o.x + w > t.x && o.y < t.y + t.h && o.y + h > t.y),
			);
			if (ok) {
				taken.push({...ok, w, h});
				labelBoxes.push({key: c.map((v) => v.pin.id).join('+'), x: ok.x, y: ok.y, text, color: STATUS_STYLE[c[0].pin.status].color});
			}
		}
	}

	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<svg width={width} height={height}>
				{/* Verbindungslinien (Kamerafahrt) */}
				{connectors.map((cn) => {
					const a = pins.find((p) => p.id === cn.from);
					const b = pins.find((p) => p.id === cn.to);
					if (!a || !b) return null;
					const t = interpolate(frame, [cn.startFrame, cn.startFrame + cn.durationInFrames], [0, 1], {...clamp, easing: EASE_IN_OUT});
					if (t <= 0) return null;
					const fade = interpolate(frame, [cn.startFrame + cn.durationInFrames + 20, cn.startFrame + cn.durationInFrames + 45], [1, 0.25], clamp);
					const [x0, y0] = toScreen(a.at);
					const [x1, y1] = toScreen(b.at);
					const mx = (x0 + x1) / 2;
					const my = (y0 + y1) / 2 - Math.hypot(x1 - x0, y1 - y0) * 0.18;
					// Quadratische Bézierkurve bis t abschneiden (de Casteljau) → gepunktete Linie „wächst“
					const qx = x0 + (mx - x0) * t;
					const qy = y0 + (my - y0) * t;
					const ex = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * mx + t * t * x1;
					const ey = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * my + t * t * y1;
					const d = `M ${x0} ${y0} Q ${qx} ${qy} ${ex} ${ey}`;
					return (
						<g key={`${cn.from}-${cn.to}`} opacity={fade}>
							<path d={d} fill="none" stroke={withAlpha('#FFFFFF', 0.85)} strokeWidth={4} strokeDasharray="2 11" strokeLinecap="round" />
							{t < 1 ? <circle cx={ex} cy={ey} r={6} fill="#FFFFFF" /> : null}
						</g>
					);
				})}

				{clusters.map((c) => {
					if (c.length > 1) {
						const cx = c.reduce((a, v) => a + v.x, 0) / c.length;
						const cy = c.reduce((a, v) => a + v.y, 0) / c.length;
						const s = Math.min(...c.map((v) => v.s));
						const total = c.length;
						return (
							<g key={c.map((v) => v.pin.id).join('+')} transform={`translate(${cx} ${cy}) scale(${s})`}>
								<circle r={30} fill={withAlpha('#090D20', 0.85)} />
								{c.map((v, i) => {
									const a0 = (i / total) * Math.PI * 2 - Math.PI / 2;
									const a1 = ((i + 1) / total) * Math.PI * 2 - Math.PI / 2 - 0.08;
									const r = 25;
									return (
										<path
											key={v.pin.id}
											d={`M ${Math.cos(a0) * r} ${Math.sin(a0) * r} A ${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${Math.cos(a1) * r} ${Math.sin(a1) * r}`}
											fill="none"
											stroke={STATUS_STYLE[v.pin.status].color}
											strokeWidth={8}
										/>
									);
								})}
								<text y={9} textAnchor="middle" fontSize={26} fontWeight={900} fill="#FFFFFF" fontFamily="Montserrat, sans-serif">
									{total}
								</text>
							</g>
						);
					}

					const v = c[0];
					const isActive = v.pin.id === activeId;
					const color = STATUS_STYLE[v.pin.status].color;
					const pulse = ((frame - v.pin.appearFrame) % 36) / 36;
					const scale = v.s * (isActive ? 1.35 : 1);
					return (
						<g key={v.pin.id} transform={`translate(${v.x} ${v.y}) scale(${scale})`} opacity={activeId && !isActive ? 0.7 : 1}>
							{isActive ? <circle r={20 + pulse * 34} fill="none" stroke={color} strokeWidth={4} opacity={(1 - pulse) * 0.9} /> : null}
							{v.pin.approx ? <circle r={26} fill="none" stroke={withAlpha('#FFFFFF', 0.75)} strokeWidth={2.5} strokeDasharray="5 5" /> : null}
							<circle r={22} fill={withAlpha(color, 0.3)} />
							<circle r={16} fill={color} stroke="#FFFFFF" strokeWidth={3.5} />
							<PinGlyph status={v.pin.status} />
						</g>
					);
				})}
			</svg>

			{/* Namensschild am aktiven Pin */}
			{activeId && byId.get(activeId) ? (() => {
				const v = byId.get(activeId)!;
				const color = STATUS_STYLE[v.pin.status].color;
				const range = active.find((a) => a.id === activeId)!;
				const p = interpolate(frame, [range.from, range.from + 10], [0, 1], {...clamp, easing: EASE_OUT});
				return (
					<div
						style={{
							position: 'absolute',
							left: v.x,
							top: v.y - 58,
							translate: '-50% -50%',
							opacity: p,
							scale: String(0.8 + 0.2 * p),
							padding: '8px 18px',
							borderRadius: 14,
							background: 'rgba(7,10,28,0.92)',
							border: `3px solid ${color}`,
							fontFamily: FONTS.heading,
							fontWeight: 900,
							fontSize: 30,
							color: '#FFFFFF',
							whiteSpace: 'nowrap',
						}}
					>
						{v.pin.label}
					</div>
				);
			})() : null}

			{/* Übersicht: Schilder an allen Pins/Clustern, kollisionsfrei */}
			{labelBoxes.map((l) => (
				<div
					key={l.key}
					style={{
						position: 'absolute',
						left: l.x,
						top: l.y,
						height: 34,
						padding: '0 12px',
						display: 'flex',
						alignItems: 'center',
						borderRadius: 10,
						background: 'rgba(7,10,28,0.88)',
						borderLeft: `5px solid ${l.color}`,
						fontFamily: FONTS.body,
						fontWeight: 800,
						fontSize: 21,
						color: '#FFFFFF',
						whiteSpace: 'nowrap',
						opacity: labelsOn,
					}}
				>
					{l.text}
				</div>
			))}
		</AbsoluteFill>
	);
};
