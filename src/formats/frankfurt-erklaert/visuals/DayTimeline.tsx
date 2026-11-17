import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {COLORS, FONTS} from '../../../theme/tokens';
import {dayTimelineGeometry, dayTimelineX} from './day-timeline-geometry';

export {dayTimelineGeometry, dayTimelineX} from './day-timeline-geometry';

/**
 * Wiederverwendbare Tages-Timeline (Format B, ab #09 „Proteste am 20.11.“): leuchtende Zeitachse mit Markierungen in
 * chronologischer Reihenfolge, je Termin eine kleine Illustration (Orb), Uhrzeit darüber, Kurztitel darunter.
 * - `variant="full"`: große Fassung (Titelbild, Übersicht), Orb-Durchmesser `size`.
 * - `variant="strip"`: kompakte Orientierungsleiste oben in den Szenen; der gerade erklärte Termin (`active`) ist hervorgehoben.
 * Gleichmäßige Abstände (Reihenfolge, keine Zeitskala) – bewusst KEINE Verbindungslinien zwischen Orten/Routen: die Linie ist
 * nur die Uhrzeit-Achse. Animation kommt vollständig von außen (`draw`, `reveal`, `pulse`) bzw. aus `useCurrentFrame` (Lichtfunke).
 */

export type DayIconName = 'book' | 'flag' | 'sign' | 'banner';

export type DayEvent = {
	id: string;
	time: string;
	/** Kurztitel unter der Markierung (Zeilenumbruch mit „\n“). */
	label: string;
	place?: string;
	color: string;
	icon: DayIconName;
};

/** Kleine Strich-Illustrationen für die Markierungen (eigene Zeichnung, 24er-Raster). */
export const DayIcon: React.FC<{name: DayIconName; size?: number; color?: string; stroke?: number}> = ({name, size = 40, color = '#FFFFFF', stroke = 2.2}) => {
	const p = {fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" style={{flexShrink: 0, overflow: 'visible'}}>
			{name === 'book' ? (
				<>
					<path d="M2.5 6.2c3.2-1.4 6.3-1.3 9.5.8 3.2-2.1 6.3-2.2 9.5-.8v12.4c-3.2-1.4-6.3-1.3-9.5.8-3.2-2.1-6.3-2.2-9.5-.8z" {...p} />
					<path d="M12 7v12.4M5 9.3c1.6-.4 3.2-.3 4.6.3M5 12.3c1.6-.4 3.2-.3 4.6.3M14.4 9.6c1.4-.6 3-.7 4.6-.3" {...p} strokeWidth={stroke * 0.7} />
				</>
			) : name === 'flag' ? (
				<>
					<path d="M6 21.5V3" {...p} />
					<path d="M6 4h12.5l-2.6 4 2.6 4H6" {...p} fill={withAlpha(color, 0.18)} />
				</>
			) : name === 'sign' ? (
				<>
					<path d="M4 3h16v10H4z" {...p} fill={withAlpha(color, 0.18)} />
					<path d="M12 13v8.5M7.5 6.5h9M7.5 9.6h6" {...p} />
				</>
			) : (
				<>
					<path d="M3 21.5V3.5M21 21.5V3.5" {...p} />
					<path d="M3 5.2q4.5 2.1 9 0t9 0v7.2q-4.5 2.1-9 0t-9 0z" {...p} fill={withAlpha(color, 0.18)} />
					<path d="M7 8.8h10" {...p} strokeWidth={stroke * 0.7} />
				</>
			)}
		</svg>
	);
};

export type DayTimelineProps = {
	events: readonly DayEvent[];
	width: number;
	variant?: 'full' | 'strip';
	/** Orb-Durchmesser in px (full: Standard 88, strip: 44). */
	size?: number;
	/** 0–1: Achse wird von links gezeichnet. */
	draw?: number;
	/** je Termin 0–1 (Einblendung); Standard: alle sichtbar. */
	reveal?: readonly number[];
	/** je Termin 0–1 (kurzer Hüpfer, z. B. beim Wort „vier“). */
	pulse?: readonly number[];
	/** gerade erklärter Termin: größer, Leuchtring; übrige gedimmt. */
	active?: string | null;
	/** dauerhaft betonter Termin (z. B. Gen Z auf dem Titelbild), ohne die anderen zu dimmen. */
	highlight?: string | null;
	showPlace?: boolean;
	/** 0–1: wie stark nicht aktive Termine gedimmt werden. */
	dim?: number;
	/** bereits erklärte Termine: grüner Haken am Orb, nur leicht gedimmt (Leiste läuft nur vorwärts). */
	done?: readonly string[];
};

export const DayTimeline: React.FC<DayTimelineProps> = ({events, width, variant = 'full', size, draw = 1, reveal, pulse, active = null, highlight = null, showPlace = false, dim = 1, done = []}) => {
	const frame = useCurrentFrame();
	const n = events.length;
	const g = dayTimelineGeometry(variant, size);
	const strip = variant === 'strip';
	const gid = `dtl-${variant}-${width}-${n}`;
	const xs = events.map((_, i) => dayTimelineX(i, n, width));
	const drawX = interpolate(draw, [0, 1], [0, width], clamp);
	// Lichtfunke, der die Achse entlangläuft (≈ alle 2,7 s)
	const spark = ((frame % 80) / 80) * width;
	const lineW = strip ? 4 : 6;
	return (
		<div style={{position: 'relative', width, height: g.height}}>
			<svg width={width} height={g.height} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
				<defs>
					<linearGradient id={`${gid}-line`} x1={0} x2={width} y1={0} y2={0} gradientUnits="userSpaceOnUse">
						<stop offset={0} stopColor={events[0]?.color ?? '#FFFFFF'} stopOpacity={0} />
						{events.map((e, i) => (
							<stop key={e.id} offset={xs[i] / width} stopColor={e.color} stopOpacity={1} />
						))}
						<stop offset={1} stopColor={events[n - 1]?.color ?? '#FFFFFF'} stopOpacity={0} />
					</linearGradient>
					<clipPath id={`${gid}-clip`}>
						<rect x={0} y={0} width={drawX} height={g.height} />
					</clipPath>
				</defs>
				<g clipPath={`url(#${gid}-clip)`}>
					{/* Leuchten: breite, transparente Striche statt teurem Blur */}
					<line x1={0} x2={width} y1={g.lineY} y2={g.lineY} stroke={`url(#${gid}-line)`} strokeWidth={lineW * 5} strokeLinecap="round" opacity={0.12} />
					<line x1={0} x2={width} y1={g.lineY} y2={g.lineY} stroke={`url(#${gid}-line)`} strokeWidth={lineW * 2.4} strokeLinecap="round" opacity={0.28} />
					<line x1={0} x2={width} y1={g.lineY} y2={g.lineY} stroke={`url(#${gid}-line)`} strokeWidth={lineW} strokeLinecap="round" />
					{/* Stundenstriche zwischen den Markierungen (nur Rhythmus, keine Zeitskala) */}
					{xs.slice(0, -1).map((x, i) => {
						const mid = (x + xs[i + 1]) / 2;
						return <line key={i} x1={mid} x2={mid} y1={g.lineY - lineW * 1.4} y2={g.lineY + lineW * 1.4} stroke="#FFFFFF" strokeOpacity={0.35} strokeWidth={2} strokeLinecap="round" />;
					})}
					<circle cx={spark} cy={g.lineY} r={lineW * 1.6} fill="#FFFFFF" opacity={0.55 * Math.sin((spark / width) * Math.PI)} />
				</g>
			</svg>
			{events.map((e, i) => {
				const r = reveal ? (reveal[i] ?? 0) : 1;
				if (r <= 0.001) return null;
				const isActive = active === e.id;
				const isHi = highlight === e.id;
				const isDone = done.includes(e.id) && !isActive;
				const dimmed = active !== null && !isActive && !isDone;
				const bump = pulse ? (pulse[i] ?? 0) : 0;
				const sc = (0.45 + 0.55 * r) * (isActive ? 1.16 : 1) * (1 + 0.16 * Math.sin(bump * Math.PI));
				const op = Math.min(1, r * 1.6) * (dimmed ? 1 - 0.55 * dim : isDone ? 0.82 : 1);
				const ring = isActive || isHi ? (frame % 36) / 36 : 0;
				const timeColor = e.color;
				return (
					<React.Fragment key={e.id}>
						{/* Uhrzeit */}
						<div style={{position: 'absolute', left: xs[i] - 120, width: 240, top: (1 - r) * 14, textAlign: 'center', opacity: op, fontFamily: FONTS.heading, fontWeight: 900, fontSize: g.timeFont * (isActive || isHi ? 1.08 : 1), lineHeight: 1.1, letterSpacing: strip ? 0.5 : -1, color: timeColor, textShadow: `0 0 ${strip ? 14 : 26}px ${withAlpha(timeColor, 0.55)}, 0 4px 14px rgba(0,0,0,0.9)`, fontVariantNumeric: 'tabular-nums'}}>{e.time}</div>
						{/* Orb mit Mini-Illustration */}
						<div style={{position: 'absolute', left: xs[i] - g.d / 2, top: g.lineY - g.d / 2, width: g.d, height: g.d, opacity: op, scale: String(sc)}}>
							{ring > 0 ? <div style={{position: 'absolute', inset: -ring * g.d * 0.45, borderRadius: '50%', border: `${strip ? 2 : 3}px solid ${withAlpha(e.color, 0.8 * (1 - ring))}`}} /> : null}
							<div
								style={{
									position: 'absolute',
									inset: 0,
									borderRadius: '50%',
									background: `radial-gradient(circle at 34% 30%, ${withAlpha(e.color, 0.95)}, ${withAlpha(e.color, 0.55)} 55%, ${withAlpha(e.color, 0.3)})`,
									border: `${strip ? 2.5 : 4}px solid ${isActive || isHi ? '#FFFFFF' : withAlpha('#FFFFFF', 0.55)}`,
									boxShadow: `0 0 ${isActive || isHi ? g.d * 0.6 : g.d * 0.3}px ${withAlpha(e.color, isActive || isHi ? 0.75 : 0.4)}, 0 ${g.d * 0.12}px ${g.d * 0.3}px rgba(0,0,0,0.55)`,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<DayIcon name={e.icon} size={g.d * 0.56} color={COLORS.night} stroke={strip ? 2.6 : 2.3} />
							</div>
							{isDone ? (
								<div style={{position: 'absolute', right: -g.d * 0.22, top: -g.d * 0.22, width: g.d * 0.58, height: g.d * 0.58, borderRadius: '50%', background: '#3DDC97', border: `${strip ? 2 : 3}px solid #FFFFFF`, boxShadow: '0 4px 12px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
									<svg width={g.d * 0.36} height={g.d * 0.36} viewBox="0 0 24 24">
										<path d="m4.5 12.5 5 5 10-11" fill="none" stroke="#0B1029" strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								</div>
							) : null}
						</div>
						{/* Kurztitel (strip: nur der aktive Termin) */}
						{!strip || isActive ? (
							<div style={{position: 'absolute', left: xs[i] - 120, width: 240, top: g.labelTop + (1 - r) * 10, textAlign: 'center', opacity: op, fontFamily: FONTS.heading, fontWeight: 900, fontSize: g.labelFont, lineHeight: 1.05, color: strip ? e.color : COLORS.text, whiteSpace: 'pre-line', textShadow: '0 3px 12px rgba(0,0,0,0.95)'}}>
								{e.label}
								{showPlace && e.place && !strip ? <div style={{marginTop: 6, fontFamily: FONTS.body, fontWeight: 700, fontSize: Math.max(22, g.labelFont * 0.86), color: COLORS.textMuted, whiteSpace: 'nowrap'}}>{e.place}</div> : null}
							</div>
						) : null}
					</React.Fragment>
				);
			})}
		</div>
	);
};
