import {LAYOUT} from '../theme.ts';

/**
 * Geometrie des bundesweiten Stadt-Dashboards (ohne React, für Tests importierbar): 2 Spalten × 3 Reihen innerhalb der Untertitel-Achse
 * x 64–930 (rechts frei für die App-Knöpfe), Raster y 500–1262 (darunter Untertitel ab ≈ y 1300 und Quellenzeile y 1512–1630).
 */
export const DASHBOARD_LAYOUT = {
	top: 362,
	headerTitleTop: 392,
	hintTop: 452,
	gridTop: 500,
	gridBottom: 1262,
	left: LAYOUT.left,
	width: LAYOUT.width,
	cols: 2,
	colGap: 14,
	rowGap: 12,
	valueSize: 48,
	labelSize: 21,
	extraSize: 20,
	footSize: 20,
	nameSize: 28,
} as const;

export const dashboardCell = (i: number, n: number, L = DASHBOARD_LAYOUT) => {
	const rows = Math.ceil(n / L.cols);
	const w = (L.width - (L.cols - 1) * L.colGap) / L.cols;
	const h = (L.gridBottom - L.gridTop - (rows - 1) * L.rowGap) / rows;
	const col = i % L.cols;
	const row = Math.floor(i / L.cols);
	return {x: L.left + col * (w + L.colGap), y: L.gridTop + row * (h + L.rowGap), w, h};
};

