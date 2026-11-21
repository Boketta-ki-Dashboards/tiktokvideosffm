import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, EASE_IN_OUT, EASE_OUT, springIn} from '../../lib/animation';
import {withAlpha} from '../../lib/color';
import {COLORS, FONTS, RADII, SHADOWS} from '../../theme/tokens';

export type MonthHighlight = {
	day: number;
	color: string;
	/** Frame, ab dem der Tag hervorgehoben wird. */
	from: number;
	/** Optionaler Text im Feld (z. B. „14 Uhr“). */
	note?: string;
};

export type MonthGridProps = {
	/** Monatsname und Jahr (Anzeige). */
	title: string;
	/** Wochentag des 1. (1 = Montag … 7 = Sonntag). */
	firstWeekday: number;
	daysInMonth: number;
	highlights?: MonthHighlight[];
	/** Kamerafahrt auf einen Tag: Zoom und Verschiebung zwischen `from` und `to`. */
	focus?: {day: number; from: number; to: number; zoom?: number};
	delay?: number;
	width?: number;
	/** Höhe der Titelzeile in px. */
	headerHeight?: number;
	style?: React.CSSProperties;
};

const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

/** Monatsansicht (z. B. November 2026) mit Hervorhebungen und Kamerafahrt auf einen Tag. */
export const MonthGrid: React.FC<MonthGridProps> = ({title, firstWeekday, daysInMonth, highlights = [], focus, delay = 0, width = 880, headerHeight = 130, style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const cell = width / 7;
	const rows = Math.ceil((firstWeekday - 1 + daysInMonth) / 7);
	const headerH = headerHeight;
	const height = headerH + 56 + rows * cell;
	const intro = springIn({frame, fps, delay, damping: 16});

	const cellCenter = (day: number): [number, number] => {
		const idx = firstWeekday - 1 + (day - 1);
		return [(idx % 7) * cell + cell / 2, headerH + 56 + Math.floor(idx / 7) * cell + cell / 2];
	};

	let zoom = 1;
	let tx = 0;
	let ty = 0;
	if (focus) {
		const p = interpolate(frame, [focus.from, focus.to], [0, 1], {...clamp, easing: EASE_IN_OUT});
		const [cx, cy] = cellCenter(focus.day);
		zoom = 1 + p * ((focus.zoom ?? 1.5) - 1);
		tx = p * (width / 2 - cx) * zoom;
		ty = p * (height / 2 - cy) * zoom;
	}

	// Die Kamera bleibt im Rahmen: Verschiebung nie größer als der Überstand durch den Zoom
	const maxX = ((zoom - 1) * width) / 2;
	const maxY = ((zoom - 1) * height) / 2;
	tx = Math.max(-maxX, Math.min(maxX, tx));
	ty = Math.max(-maxY, Math.min(maxY, ty));

	return (
		<div
			style={{
				width,
				height,
				translate: `0 ${(1 - intro) * 120}px`,
				scale: String(0.92 + 0.08 * intro),
				opacity: Math.min(1, intro * 1.6),
				borderRadius: RADII.lg,
				border: `3px solid ${COLORS.panelBorder}`,
				boxShadow: SHADOWS.card,
				overflow: 'hidden',
				position: 'relative',
				...style,
			}}
		>
		<div
			style={{
				position: 'absolute',
				inset: 0,
				translate: `${tx}px ${ty}px`,
				scale: String(zoom),
				background: 'linear-gradient(170deg, rgba(25,33,72,0.96), rgba(9,13,34,0.96))',
			}}
		>
			<div
				style={{
					height: headerH,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontFamily: FONTS.heading,
					fontWeight: 900,
					fontSize: 58,
					letterSpacing: 3,
					color: COLORS.text,
				}}
			>
				{title}
			</div>
			<div style={{display: 'flex', height: 56}}>
				{WEEKDAYS.map((w, i) => (
					<div
						key={w}
						style={{
							width: cell,
							textAlign: 'center',
							fontFamily: FONTS.heading,
							fontWeight: 800,
							fontSize: 28,
							color: i >= 5 ? COLORS.textMuted : COLORS.textDim,
						}}
					>
						{w}
					</div>
				))}
			</div>
			{new Array(daysInMonth).fill(0).map((_, i) => {
				const day = i + 1;
				const idx = firstWeekday - 1 + i;
				const col = idx % 7;
				const row = Math.floor(idx / 7);
				const appear = interpolate(frame, [delay + 6 + i * 0.9, delay + 16 + i * 0.9], [0, 1], {...clamp, easing: EASE_OUT});
				const hl = highlights.find((h) => h.day === day);
				const hp = hl ? springIn({frame, fps, delay: hl.from, damping: 11, stiffness: 170}) : 0;
				const pulse = hl && frame >= hl.from ? 0.5 + 0.5 * Math.sin((frame - hl.from) * 0.18) : 0;
				return (
					<div
						key={day}
						style={{
							position: 'absolute',
							left: col * cell + 5,
							top: headerH + 56 + row * cell + 5,
							width: cell - 10,
							height: cell - 10,
							borderRadius: 16,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							flexDirection: 'column',
							opacity: appear,
							scale: String(1 + hp * 0.14),
							zIndex: hl ? 2 : 1,
							background: hl ? withAlpha(hl.color, 0.18 + hp * 0.7) : 'rgba(255,255,255,0.05)',
							border: hl ? `4px solid ${withAlpha(hl.color, hp)}` : '2px solid rgba(255,255,255,0.06)',
							boxShadow: hl ? `0 0 ${30 + pulse * 30}px ${withAlpha(hl.color, 0.55 * hp)}` : undefined,
							fontFamily: FONTS.heading,
							fontWeight: 900,
							fontSize: hl ? 52 : 40,
							color: hl && hp > 0.5 ? '#0B1029' : COLORS.textMuted,
						}}
					>
						{day}
						{hl?.note && hp > 0.6 ? (
							<span style={{fontFamily: FONTS.body, fontWeight: 800, fontSize: 20, marginTop: -4, color: '#0B1029'}}>{hl.note}</span>
						) : null}
					</div>
				);
			})}
		</div>
		</div>
	);
};
