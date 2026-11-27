import React from 'react';
import {useCurrentFrame} from 'remotion';
import {withAlpha} from '../../../lib/color';
import {COLORS, FONTS} from '../../../theme/tokens';
import {germanyGeo} from '../../frankfurt-erklaert-genz-phase2-2026-11-14/visuals/GermanyPlane';
import {CITIES, type CityId} from '../data/staedte';

/**
 * Ermittlungs-Illustrationen #20 (neutral, ohne Personen, ohne Daten): Personen-Raster aus gleichförmigen Symbolen (Teilgruppen farbig
 * INNERHALB der Gesamtmenge), Ermittlungsordner, Gesetzbuch, Justizwaage, parlamentarische Drucksache, Mini-Deutschlandkarte als
 * wiederkehrender Navigator. Alles SVG/DOM, deterministisch.
 */

/** Neutrales Personensymbol (Kopf + Schultern), kein Gesicht. */
const Glyph: React.FC<{x: number; y: number; s: number; color: string; o: number}> = ({x, y, s, color, o}) => (
	<g opacity={o} transform={`translate(${x} ${y}) scale(${s})`}>
		<circle cx={10} cy={6} r={5} fill={color} />
		<path d="M1 22 Q1 12 10 12 Q19 12 19 22 Z" fill={color} />
	</g>
);

/**
 * Raster mit `total` Symbolen; `groups` färbt die ERSTEN n Symbole (Teilgruppen der Gesamtmenge, nie zusätzlich).
 * `fill` 0…1 lässt die Symbole nacheinander erscheinen, `groupOn` 0…1 färbt die Teilgruppen ein.
 */
export const PersonGrid: React.FC<{total: number; cols: number; width: number; fill: number; groups?: Array<{n: number; color: string; on: number}>; base?: string}> = ({total, cols, width, fill, groups = [], base = '#8E9AC8'}) => {
	const rows = Math.ceil(total / cols);
	const cell = width / cols;
	const s = (cell / 20) * 0.86;
	const height = rows * cell * 1.12;
	const colorOf = (i: number) => {
		let start = 0;
		for (const g of groups) {
			if (i >= start && i < start + g.n) return {c: g.color, on: g.on};
			start += g.n;
		}
		return null;
	};
	return (
		<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{display: 'block', overflow: 'visible'}}>
			{new Array(total).fill(0).map((_, i) => {
				const r = Math.floor(i / cols);
				const c = i % cols;
				const shown = Math.min(1, Math.max(0, fill * total - i));
				const g = colorOf(i);
				const color = g && g.on > 0.5 ? g.c : base;
				return <Glyph key={i} x={c * cell + cell * 0.07} y={r * cell * 1.12} s={s} color={color} o={shown * (g && g.on > 0.5 ? 1 : 0.75)} />;
			})}
		</svg>
	);
};

/** Ermittlungsordner-Stapel (abstrakt, ohne Namen). */
export const FolderStack: React.FC<{width: number; n?: number; open?: number; color?: string}> = ({width, n = 4, open = 1, color = '#FFD23F'}) => {
	const h = width * 0.78;
	return (
		<svg width={width} height={h + n * 14} viewBox={`0 0 ${width} ${h + n * 14}`} style={{overflow: 'visible'}}>
			{new Array(n).fill(0).map((_, i) => {
				const y = (n - 1 - i) * 14 * open;
				const x = i * 6;
				return (
					<g key={i} transform={`translate(${x} ${y})`}>
						<path d={`M0 ${h * 0.12} L${width * 0.36} ${h * 0.12} L${width * 0.42} 0 L${width - 24} 0 L${width - 24} ${h} L0 ${h} Z`} fill={i === n - 1 ? '#2E3A7E' : '#232D68'} stroke={withAlpha(color, i === n - 1 ? 0.9 : 0.4)} strokeWidth={3} />
						{i === n - 1 ? (
							<>
								{[0.34, 0.48, 0.62, 0.76].map((t) => (
									<rect key={t} x={width * 0.1} y={h * t} width={width * (t === 0.76 ? 0.4 : 0.62)} height={8} rx={4} fill={withAlpha('#FFFFFF', 0.35)} />
								))}
								<rect x={width * 0.1} y={h * 0.16} width={width * 0.32} height={12} rx={4} fill={withAlpha(color, 0.85)} />
							</>
						) : null}
					</g>
				);
			})}
		</svg>
	);
};

/** Gesetzbuch mit Paragraphzeichen. */
export const LawBook: React.FC<{width: number; label?: string; color?: string}> = ({width, label = '§', color = '#B794F6'}) => (
	<svg width={width} height={width * 1.25} viewBox="0 0 100 125">
		<rect x={8} y={4} width={84} height={114} rx={8} fill="#2A2F6E" stroke={color} strokeWidth={3} />
		<rect x={14} y={4} width={6} height={114} fill={withAlpha(color, 0.6)} />
		<rect x={86} y={10} width={10} height={104} rx={3} fill="#E8E4D8" />
		<text x={53} y={78} textAnchor="middle" fontFamily={FONTS.heading} fontWeight={900} fontSize={label.length > 2 ? 26 : 54} fill="#FFFFFF">
			{label}
		</text>
	</svg>
);

/** Justizwaage (leicht pendelnd). */
export const JusticeScale: React.FC<{width: number; color?: string}> = ({width, color = '#FFD23F'}) => {
	const frame = useCurrentFrame();
	const tilt = Math.sin(frame / 22) * 4;
	return (
		<svg width={width} height={width} viewBox="0 0 100 100" style={{overflow: 'visible'}}>
			<path d="M50 14 L50 86 M32 90 L68 90" stroke={color} strokeWidth={4} strokeLinecap="round" />
			<circle cx={50} cy={12} r={4} fill={color} />
			<g transform={`rotate(${tilt} 50 22)`}>
				<path d="M14 22 L86 22" stroke={color} strokeWidth={4} strokeLinecap="round" />
				{[14, 86].map((x) => (
					<g key={x}>
						<path d={`M${x} 22 L${x - 12} 50 M${x} 22 L${x + 12} 50`} stroke={withAlpha(color, 0.8)} strokeWidth={2} />
						<path d={`M${x - 15} 50 Q${x} 62 ${x + 15} 50 Z`} fill={withAlpha(color, 0.85)} />
					</g>
				))}
			</g>
		</svg>
	);
};

/** Parlamentarische Drucksache (Titelblatt, ohne Wappen/Logo): Gremium, Nummer, Art, Urheber, Datum, Stempel „noch ohne Antwort“. */
export const ParliamentDoc: React.FC<{body: string; nr: string; kind: string; by: string; date: string; topic?: string; stamp?: string; stampOn?: number; width: number; color: string}> = ({body, nr, kind, by, date, topic, stamp, stampOn = 0, width, color}) => (
	<div style={{position: 'relative', width, boxSizing: 'border-box', padding: '14px 18px 16px', borderRadius: 10, background: 'linear-gradient(170deg, #F4F1E8 0%, #E2DDD0 100%)', boxShadow: '0 16px 40px rgba(0,0,0,0.55)', color: '#1A1F3A'}}>
		<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 19, letterSpacing: 1.2, color: '#5A6188'}}>{body}</div>
		<div style={{marginTop: 4, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: '#1A1F3A'}}>{nr}</div>
		<div style={{marginTop: 2, fontFamily: FONTS.body, fontWeight: 800, fontSize: 22, color: '#2C3258'}}>
			{kind} · {by}
		</div>
		<div style={{marginTop: 2, fontFamily: FONTS.body, fontWeight: 700, fontSize: 21, color: '#4A5078'}}>{date}</div>
		{topic ? <div style={{marginTop: 6, fontFamily: FONTS.body, fontWeight: 800, fontSize: 21, lineHeight: 1.2, color: '#1A1F3A'}}>{topic}</div> : null}
		<div style={{marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6}}>
			{[0.92, 0.84, 0.66].map((w) => (
				<div key={w} style={{height: 7, width: `${w * 100}%`, borderRadius: 4, background: 'rgba(26,31,58,0.18)'}} />
			))}
		</div>
		{stamp ? (
			<div style={{position: 'absolute', right: 12, bottom: 12, rotate: '-8deg', scale: String(1.4 - 0.4 * stampOn), opacity: stampOn, padding: '4px 12px', border: `3px solid ${color}`, borderRadius: 8, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 20, letterSpacing: 1.5, color, background: 'rgba(255,255,255,0.6)'}}>{stamp}</div>
		) : null}
	</div>
);

/** Ungleich-Gleichung (zwei Begriffe mit ≠ bzw. =). */
export const NotEqual: React.FC<{left: string; right: string; sign?: '≠' | '='; color: string; size?: number}> = ({left, right, sign = '≠', color, size = 30}) => (
	<div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '8px 16px', borderRadius: 16, background: 'rgba(8,10,28,0.94)', border: `3px solid ${color}`}}>
		<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: size, color: COLORS.text, whiteSpace: 'nowrap'}}>{left}</span>
		<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: size * 1.25, color, lineHeight: 1}}>{sign}</span>
		<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: size, color: COLORS.text, whiteSpace: 'nowrap'}}>{right}</span>
	</div>
);

let miniCache: {path: string; box: [number, number, number, number]; pts: Record<CityId, [number, number]>} | null = null;
const miniGeo = () => {
	if (miniCache) return miniCache;
	const geo = germanyGeo();
	const pts = Object.fromEntries(CITIES.map((c) => [c.id, geo.project([c.lon, c.lat])])) as Record<CityId, [number, number]>;
	miniCache = {path: geo.germany, box: [40, 40, 920, 1220], pts};
	return miniCache;
};

/** Mini-Deutschlandkarte (Navigator): alle sechs Städte, die aktive leuchtet, bereits besuchte bekommen einen Haken-Ring. */
export const MiniGermany: React.FC<{width: number; active?: CityId; done?: CityId[]; color?: string}> = ({width, active, done = [], color = '#FFD23F'}) => {
	const frame = useCurrentFrame();
	const g = miniGeo();
	const [x, y, w, h] = g.box;
	const k = 1000 / width;
	const pulse = 0.5 + 0.5 * Math.sin(frame / 5);
	return (
		<svg width={width} height={(width * h) / w} viewBox={`${x} ${y} ${w} ${h}`} style={{display: 'block', overflow: 'visible'}}>
			<path d={g.path} fill="rgba(42,58,126,0.92)" stroke="#9CC2FF" strokeWidth={3 * k * 0.5} strokeLinejoin="round" />
			{CITIES.map((c) => {
				const [px, py] = g.pts[c.id];
				const isA = c.id === active;
				const isD = done.includes(c.id);
				const r = (isA ? 10 + 4 * pulse : 7) * k * 0.6;
				return (
					<g key={c.id}>
						{isA ? <circle cx={px} cy={py} r={r * 2.4} fill={withAlpha(color, 0.25 * pulse)} /> : null}
						<circle cx={px} cy={py} r={r} fill={isA ? color : isD ? '#3DDC97' : '#E8ECFF'} stroke="#FFFFFF" strokeWidth={2 * k * 0.5} />
					</g>
				);
			})}
		</svg>
	);
};
