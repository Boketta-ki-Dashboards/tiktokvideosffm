const parse = (hex: string): [number, number, number] => {
	const h = hex.replace('#', '');
	const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h.slice(0, 6);
	const n = parseInt(full, 16);
	return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const toHex = (r: number, g: number, b: number) =>
	`#${[r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('')}`;

/** Lineare Mischung zweier Hex-Farben (t = 0 → a, t = 1 → b). */
export const mix = (a: string, b: string, t: number) => {
	const [r1, g1, b1] = parse(a);
	const [r2, g2, b2] = parse(b);
	return toHex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t);
};

/** Abdunkeln (f < 1) bzw. Aufhellen (f > 1) einer Hex-Farbe. */
export const shade = (hex: string, f: number) => {
	const [r, g, b] = parse(hex);
	return f <= 1 ? toHex(r * f, g * f, b * f) : mix(hex, '#ffffff', Math.min(1, f - 1));
};

export const withAlpha = (hex: string, alpha: number) => {
	const [r, g, b] = parse(hex);
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
