import React from 'react';
import {random} from 'remotion';

export type WindowGridSpec = {
	x: number;
	y: number;
	w: number;
	h: number;
	seed: string;
	litRatio: number;
	colW?: number;
	rowH?: number;
	winW?: number;
	winH?: number;
	colors?: string[];
};

export type WindowRect = {x: number; y: number; w: number; h: number; color: string; flicker: boolean};

/** Erzeugt beleuchtete Fenster (nur die leuchtenden – unbeleuchtete sind Fassade). */
export const makeWindows = ({
	x,
	y,
	w,
	h,
	seed,
	litRatio,
	colW = 11,
	rowH = 13,
	winW = 5,
	winH = 6,
	colors = ['#FFD98A', '#FFE7B0', '#9FD8FF'],
}: WindowGridSpec): WindowRect[] => {
	const cols = Math.max(1, Math.floor((w - 4) / colW));
	const rows = Math.max(1, Math.floor((h - 6) / rowH));
	const offsetX = x + (w - cols * colW) / 2 + (colW - winW) / 2;
	const out: WindowRect[] = [];
	for (let r = 0; r < rows; r++) {
		// ganze Etagen sind manchmal dunkel/hell → realistischere Muster
		const floorBias = random(`${seed}-floor-${r}`) - 0.5;
		for (let c = 0; c < cols; c++) {
			const v = random(`${seed}-${r}-${c}`);
			if (v < litRatio + floorBias * 0.35) {
				out.push({
					x: offsetX + c * colW,
					y: y + 4 + r * rowH,
					w: winW,
					h: winH,
					color: colors[Math.floor(random(`${seed}-c-${r}-${c}`) * colors.length)],
					flicker: random(`${seed}-f-${r}-${c}`) < 0.04,
				});
			}
		}
	}

	return out;
};

export const StaticWindows: React.FC<{windows: WindowRect[]; opacity?: number}> = React.memo(
	({windows, opacity = 1}) => (
		<g opacity={opacity}>
			{windows.map((win, i) =>
				win.flicker ? null : <rect key={i} x={win.x} y={win.y} width={win.w} height={win.h} fill={win.color} />,
			)}
		</g>
	),
);

/** Einzelne Fenster, die über die Zeit an-/ausgehen (benötigt den aktuellen Frame). */
export const FlickerWindows: React.FC<{windows: WindowRect[]; frame: number; seed: string; opacity?: number}> = ({
	windows,
	frame,
	seed,
	opacity = 1,
}) => (
	<g opacity={opacity}>
		{windows.map((win, i) =>
			win.flicker && random(`${seed}-${i}-${Math.floor((frame + i * 7) / 24)}`) > 0.45 ? (
				<rect key={i} x={win.x} y={win.y} width={win.w} height={win.h} fill={win.color} />
			) : null,
		)}
	</g>
);
