import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {clamp, EASE_IN_OUT} from '../../../lib/animation';
import {mix, withAlpha} from '../../../lib/color';

/**
 * Erhöhte Stadtansicht (isometrisch) einer Fußgängerzone mit Platz: Häuserblöcke als Prismen mit Fensterlicht,
 * eine Menschenmenge in der Mitte, die bei `disperse` ruhig nach außen geht. Pfeile zeigen nur die allgemeine
 * Richtung „weg vom Versammlungsort“ – bewusst keine echten Straßen, Wege, Absperrungen oder Taktiken.
 */
const S = 50;
const COS = 0.866;
const CX = 540;

type Box = {x: number; y: number; w: number; d: number; h: number; hue: number; seed: string};

const BLOCKS: Box[] = (() => {
	const out: Box[] = [];
	const quad = (sx: number, sy: number) => {
		let x = 2.2;
		let k = 0;
		while (x < 13) {
			const w = 1.6 + random(`iso-w-${sx}-${sy}-${k}`) * 1.6;
			const d = 3.2 + random(`iso-d-${sx}-${sy}-${k}`) * 2.4;
			// vordere Blöcke (zum Betrachter) flach, damit der Platz sichtbar bleibt
			const h = sy > 0 ? 0.7 + random(`iso-h-${sx}-${sy}-${k}`) * 0.9 : 2 + random(`iso-h-${sx}-${sy}-${k}`) * 3.6;
			out.push({x: sx > 0 ? x : -x - w, y: sy > 0 ? 2.4 : -2.4 - d, w, d, h, hue: random(`iso-c-${sx}-${sy}-${k}`), seed: `iso-${sx}-${sy}-${k}`});
			x += w + 0.25;
			k++;
		}
	};

	quad(1, 1);
	quad(1, -1);
	quad(-1, 1);
	quad(-1, -1);
	return out.sort((a, b) => a.x + a.w + a.y + a.d - (b.x + b.w + b.y + b.d));
})();

export type IsoCityProps = {
	/** 0–1: Kamera (leichter Zoom/Schwenk). */
	progress?: number;
	/** 0–1: Menschen gehen ruhig auseinander. */
	disperse?: number;
	/** 0–1: Richtungspfeile am Boden. */
	arrows?: number;
	crowd?: number;
	/** Vertikale Lage des Platzes auf dem Bildschirm. */
	centerY?: number;
	seed?: string;
};

export const IsoCity: React.FC<IsoCityProps> = ({progress = 0, disperse = 0, arrows = 0, crowd = 70, centerY = 760, seed = 'iso'}) => {
	const frame = useCurrentFrame();
	const cam = interpolate(progress, [0, 1], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const zoom = 1.12 - cam * 0.1;
	const P = (x: number, y: number, z = 0): [number, number] => [CX + (x - y) * COS * S, centerY + (x + y) * 0.5 * S - z * S];
	const poly = (pts: Array<[number, number]>) => pts.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(' ');

	const people = new Array(crowd).fill(true).map((_, i) => {
		const a = random(`${seed}-a-${i}`) * Math.PI * 2;
		const r = Math.sqrt(random(`${seed}-r-${i}`)) * 2.1;
		const x0 = Math.cos(a) * r * 1.5;
		const y0 = Math.sin(a) * r * 0.75;
		// Richtung: entlang der Straße nach außen bzw. in die Querstraße – allgemein „weg vom Platz“
		const lane = random(`${seed}-l-${i}`);
		const dir: [number, number] = lane < 0.38 ? [1, 0] : lane < 0.76 ? [-1, 0] : lane < 0.88 ? [0, 1] : [0, -1];
		const dist = (5 + random(`${seed}-d-${i}`) * 6) * disperse;
		const x = x0 + dir[0] * dist + (dir[0] === 0 ? 0 : 0);
		const y = dir[1] === 0 ? y0 * (1 - disperse * 0.3) : y0 * 0.3 + dir[1] * dist;
		const xx = dir[0] === 0 ? x0 * (1 - disperse * 0.65) : x;
		return {i, x: xx, y, color: ['#FFD23F', '#3DDC97', '#FF8FA3', '#4FC3F7', '#FFFFFF', '#FFB15C', '#B794F6'][i % 7], moving: disperse > 0.02};
	});
	people.sort((a, b) => a.x + a.y - (b.x + b.y));

	const arrow = (x: number, y: number, dx: number, dy: number, k: number) => {
		const t = ((frame + k * 9) % 40) / 40;
		const len = 2.4;
		const off = t * 0.8;
		const ax = x + dx * off;
		const ay = y + dy * off;
		const [x1, y1] = P(ax, ay);
		const [x2, y2] = P(ax + dx * len, ay + dy * len);
		const ang = Math.atan2(y2 - y1, x2 - x1);
		const head = 30;
		return (
			<g key={k} opacity={arrows * (0.55 + 0.45 * Math.sin(t * Math.PI))}>
				<line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FFD23F" strokeWidth={14} strokeLinecap="round" />
				<path d={`M${x2 + Math.cos(ang) * 10} ${y2 + Math.sin(ang) * 10} L${x2 - Math.cos(ang - 0.55) * head} ${y2 - Math.sin(ang - 0.55) * head} L${x2 - Math.cos(ang + 0.55) * head} ${y2 - Math.sin(ang + 0.55) * head} Z`} fill="#FFD23F" />
			</g>
		);
	};

	const building = (b: Box) => {
		const top = poly([P(b.x, b.y, b.h), P(b.x + b.w, b.y, b.h), P(b.x + b.w, b.y + b.d, b.h), P(b.x, b.y + b.d, b.h)]);
		const left = poly([P(b.x, b.y + b.d, 0), P(b.x + b.w, b.y + b.d, 0), P(b.x + b.w, b.y + b.d, b.h), P(b.x, b.y + b.d, b.h)]);
		const right = poly([P(b.x + b.w, b.y, 0), P(b.x + b.w, b.y + b.d, 0), P(b.x + b.w, b.y + b.d, b.h), P(b.x + b.w, b.y, b.h)]);
		const base = mix('#1B2150', '#3A2A5A', b.hue);
		const windows: React.ReactNode[] = [];
		const rows = Math.floor(b.h / 0.75);
		for (let r = 0; r < rows; r++) {
			const z = 0.45 + r * 0.75;
			for (let c = 0; c < Math.floor(b.w / 0.55); c++) {
				const lit = random(`${b.seed}-wl-${r}-${c}`) > 0.55;
				const x = b.x + 0.25 + c * 0.55;
				const pts = poly([P(x, b.y + b.d, z), P(x + 0.28, b.y + b.d, z), P(x + 0.28, b.y + b.d, z + 0.36), P(x, b.y + b.d, z + 0.36)]);
				windows.push(<polygon key={`l-${r}-${c}`} points={pts} fill={lit ? '#FFD27A' : '#0C1030'} opacity={lit ? 0.85 : 0.6} />);
			}

			for (let c = 0; c < Math.floor(b.d / 0.55); c++) {
				const lit = random(`${b.seed}-wr-${r}-${c}`) > 0.6;
				const y = b.y + 0.25 + c * 0.55;
				const pts = poly([P(b.x + b.w, y, z), P(b.x + b.w, y + 0.28, z), P(b.x + b.w, y + 0.28, z + 0.36), P(b.x + b.w, y, z + 0.36)]);
				windows.push(<polygon key={`r-${r}-${c}`} points={pts} fill={lit ? '#FFC46A' : '#0A0D28'} opacity={lit ? 0.75 : 0.6} />);
			}
		}

		return (
			<g key={b.seed}>
				<polygon points={left} fill={mix(base, '#000000', 0.15)} />
				<polygon points={right} fill={mix(base, '#000000', 0.42)} />
				{windows}
				<polygon points={top} fill={mix(base, '#8C9CFF', 0.22)} stroke={withAlpha('#B9C4FF', 0.35)} strokeWidth={1.5} />
			</g>
		);
	};

	const ground = poly([P(-14, -11), P(14, -11), P(14, 11), P(-14, 11)]);
	const street = poly([P(-14, -1.9), P(14, -1.9), P(14, 1.9), P(-14, 1.9)]);
	const cross = poly([P(-1.6, -11), P(1.6, -11), P(1.6, 11), P(-1.6, 11)]);
	const [px, py] = P(0, 0);

	return (
		<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 35%, #1A1F52 0%, #0A0D2A 55%, #05071A 100%)'}}>
			<svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0, scale: String(zoom), transformOrigin: `540px ${centerY}px`}}>
				<defs>
					<radialGradient id={`${seed}-plaza`}>
						<stop offset="0" stopColor="#FFB86B" stopOpacity={0.4} />
						<stop offset="1" stopColor="#FFB86B" stopOpacity={0} />
					</radialGradient>
				</defs>
				<polygon points={ground} fill="#0E1238" />
				<polygon points={street} fill="#2A2F5E" />
				<polygon points={cross} fill="#262B58" />
				{/* Pflaster-Fugen entlang der Straße */}
				{new Array(28).fill(true).map((_, k) => {
					const x = -14 + k;
					const [a, b] = P(x, -1.9);
					const [c, d] = P(x, 1.9);
					return <line key={k} x1={a} y1={b} x2={c} y2={d} stroke="rgba(255,255,255,0.05)" strokeWidth={2} />;
				})}
				<ellipse cx={px} cy={py} rx={S * 4.2} ry={S * 2.2} fill={`url(#${seed}-plaza)`} />
				{/* Pfeile: allgemeine Richtung weg vom Platz */}
				{arrows > 0 ? [arrow(3.2, 0, 1, 0, 0), arrow(-3.2, 0, -1, 0, 1), arrow(0, 3.0, 0, 1, 2), arrow(0, -3.0, 0, -1, 3)] : null}
				{/* hintere Blöcke */}
				{BLOCKS.filter((b) => b.y < 0).map(building)}
				{/* Menschen */}
				{people.map((pp) => {
					const [sx, sy] = P(pp.x, pp.y);
					const bob = pp.moving ? Math.abs(Math.sin((frame + pp.i * 7) / 4)) * 3 : Math.sin((frame + pp.i * 11) / 20) * 1;
					return (
						<g key={pp.i}>
							<ellipse cx={sx} cy={sy} rx={11} ry={5} fill="rgba(0,0,0,0.45)" />
							<rect x={sx - 7} y={sy - 33 - bob} width={14} height={27} rx={7} fill={mix(pp.color, '#1A1A2E', 0.3)} />
							<circle cx={sx} cy={sy - 40 - bob} r={7.5} fill={pp.color} />
						</g>
					);
				})}
				{/* vordere Blöcke */}
				{BLOCKS.filter((b) => b.y > 0).map(building)}
			</svg>
		</AbsoluteFill>
	);
};
