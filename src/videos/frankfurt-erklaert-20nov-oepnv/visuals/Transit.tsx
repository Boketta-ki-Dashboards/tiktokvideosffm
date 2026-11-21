import React from 'react';
import {useCurrentFrame} from 'remotion';
import {withAlpha} from '../../../lib/color';
import {COLORS, FONTS} from '../../../theme/tokens';

/**
 * Stilisierte ÖPNV-Illustrationen für #11 (eigene Gestaltung, keine Herstellerformen, keine Logos, keine Live-Daten):
 * 2,5D-Straßenbahn, U-Bahn-Zug, große Uhr, Linienschilder, Römer-Fassade, Smartphone-Betriebsinfo, Anzeigetafel.
 */

export const TRAM_COLOR = '#22C9BF';
export const BUS_COLOR = '#B794F6';
export const MAYBE_COLOR = '#FFD23F';
export const U_COLORS: Record<string, string> = {U4: '#FF5AA8', U5: '#3DDC84'};
export const U_NEUTRAL = '#5B6BB0';

export type LineKind = 'tram' | 'bus' | 'ubahn';

/* ------------------------------------------------------------------ Linienschild */

const TramGlyph: React.FC<{size: number; color: string}> = ({size, color}) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
		<path d="M7 5h10a2 2 0 0 1 2 2v8a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V7a2 2 0 0 1 2-2z" />
		<path d="M5 11h14M9 2h6M12 2v3M8 21l1.5-3M16 21l-1.5-3" />
		<circle cx={8.5} cy={14.5} r={0.9} fill={color} />
		<circle cx={15.5} cy={14.5} r={0.9} fill={color} />
	</svg>
);

const BusGlyph: React.FC<{size: number; color: string}> = ({size, color}) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
		<rect x={4} y={3} width={16} height={15} rx={3} />
		<path d="M4 11h16M7 21v-3M17 21v-3" />
		<circle cx={8} cy={14.5} r={0.9} fill={color} />
		<circle cx={16} cy={14.5} r={0.9} fill={color} />
	</svg>
);

/** Liniennummer als Schild: Straßenbahn (türkis, Tram-Symbol), Bus (violett, „BUS“), U-Bahn (Quadrat „U4“). */
export const LineBadge: React.FC<{line: string; kind: LineKind; size?: number; color?: string; glow?: number; dim?: boolean; maybe?: boolean; style?: React.CSSProperties}> = ({line, kind, size = 120, color, glow = 0, dim = false, maybe = false, style}) => {
	const c = color ?? (kind === 'tram' ? TRAM_COLOR : kind === 'bus' ? BUS_COLOR : (U_COLORS[line] ?? U_NEUTRAL));
	const radius = kind === 'ubahn' ? size * 0.14 : size * 0.26;
	const w = kind === 'bus' ? size * (line.length > 2 ? 1.5 : 1.25) : kind === 'ubahn' ? size * 1.12 : size;
	const fontSize = size * (line.length > 2 ? 0.44 : line.length > 1 ? 0.5 : 0.56);
	return (
		<div
			style={{
				position: 'relative',
				width: w,
				height: size,
				borderRadius: radius,
				background: dim ? withAlpha(c, 0.25) : `linear-gradient(160deg, ${withAlpha('#FFFFFF', 0.28)} 0%, ${c} 38%, ${withAlpha(c, 0.86)} 100%)`,
				border: maybe ? `${Math.max(3, size * 0.05)}px dashed ${MAYBE_COLOR}` : `${Math.max(2, size * 0.03)}px solid ${withAlpha('#FFFFFF', 0.55)}`,
				boxShadow: `0 ${size * 0.12}px ${size * 0.3}px rgba(0,0,0,0.5), 0 0 ${size * 0.6 * glow}px ${withAlpha(c, 0.8 * glow)}`,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				boxSizing: 'border-box',
				...style,
			}}
		>
			{kind === 'tram' ? <TramGlyph size={size * 0.26} color="#FFFFFF" /> : null}
			{kind === 'bus' ? <div style={{display: 'flex', alignItems: 'center', gap: size * 0.04}}><BusGlyph size={size * 0.22} color="#FFFFFF" /><span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: size * 0.17, letterSpacing: 1, color: '#FFFFFF'}}>BUS</span></div> : null}
			<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize, lineHeight: 1, color: '#FFFFFF', textShadow: '0 3px 10px rgba(0,0,0,0.35)', fontVariantNumeric: 'tabular-nums', marginTop: kind === 'ubahn' ? 0 : size * 0.02}}>{line}</span>
			{maybe ? (
				<div style={{position: 'absolute', right: -size * 0.16, top: -size * 0.16, width: size * 0.38, height: size * 0.38, borderRadius: size, background: MAYBE_COLOR, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: size * 0.27, color: '#141414', boxShadow: '0 4px 12px rgba(0,0,0,0.4)'}}>?</div>
			) : null}
		</div>
	);
};

/* ------------------------------------------------------------------ 2,5D-Straßenbahn */

/**
 * Stilisierte Niederflur-Straßenbahn (drei Wagenteile) in leichter Perspektive, türkis. `line` steht im Zielanzeiger.
 * `lit` lässt Scheinwerfer/Innenlicht glühen. Breite skaliert, Höhe ≈ 0.31 × Breite.
 */
export const TramSide: React.FC<{width: number; line?: string; lit?: number; bob?: boolean}> = ({width, line = '11', lit = 1, bob = true}) => {
	const frame = useCurrentFrame();
	const y = bob ? Math.sin(frame / 7) * 1.2 : 0;
	const W = 900;
	const H = 280;
	const joints = [318, 588];
	const doors = [118, 392, 662, 790];
	return (
		<svg width={width} height={(width * H) / W} viewBox={`0 0 ${W} ${H}`} style={{overflow: 'visible'}}>
			<defs>
				<linearGradient id="tramBody" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#5BE7DD" />
					<stop offset="0.45" stopColor={TRAM_COLOR} />
					<stop offset="1" stopColor="#0E8C8A" />
				</linearGradient>
				<linearGradient id="tramGlass" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stopColor="#14284F" />
					<stop offset="1" stopColor="#0A1430" />
				</linearGradient>
				<linearGradient id="tramShine" x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
					<stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.22" />
					<stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
				</linearGradient>
			</defs>
			{/* Schatten + Gleis */}
			<ellipse cx={450} cy={252} rx={440} ry={16} fill="rgba(0,0,0,0.45)" />
			<rect x={0} y={240} width={W} height={6} rx={3} fill="#4A5680" />
			<g transform={`translate(0 ${y})`}>
				{/* Stromabnehmer (mittlerer Wagenteil) */}
				<path d="M420 58 L456 22 L492 58 M440 22 H500" stroke="#3B4568" strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
				<line x1={0} y1={14} x2={W} y2={14} stroke="#5A6690" strokeWidth={3} opacity={0.7} />
				{/* Dachband */}
				<rect x={40} y={52} width={790} height={26} rx={12} fill="#E8FBF9" />
				{/* Wagenkasten mit Frontnase rechts */}
				<path d="M40 74 H812 Q872 78 884 150 L888 200 Q888 214 872 214 H52 Q40 214 40 202 Z" fill="url(#tramBody)" />
				{/* Schürze */}
				<path d="M44 186 H886 L888 200 Q888 214 872 214 H52 Q44 214 44 204 Z" fill="#0A6268" opacity={0.85} />
				{/* Fensterband */}
				<rect x={58} y={92} width={760} height={58} rx={10} fill="url(#tramGlass)" />
				<path d="M824 92 Q860 96 870 148 H824 Z" fill="url(#tramGlass)" />
				{/* Innenlicht */}
				<rect x={58} y={92} width={760} height={58} rx={10} fill={withAlpha('#FFE8A8', 0.12 * lit)} />
				{/* Reflexe */}
				{[0, 1, 2, 3].map((i) => (
					<path key={i} d={`M${90 + i * 200 + ((frame * 3) % 200)} 92 l40 0 l-36 58 l-40 0 z`} fill="url(#tramShine)" opacity={0.8} />
				))}
				{/* Gelenke */}
				{joints.map((x) => (
					<g key={x}>
						<rect x={x - 9} y={70} width={18} height={146} fill="#0B3E46" />
						{[0, 1, 2, 3, 4, 5].map((k) => (
							<line key={k} x1={x - 9} x2={x + 9} y1={84 + k * 22} y2={84 + k * 22} stroke="#1C6E76" strokeWidth={3} />
						))}
					</g>
				))}
				{/* Türen */}
				{doors.map((x) => (
					<g key={x}>
						<rect x={x} y={92} width={58} height={118} rx={6} fill="#0F2C4A" stroke="#E8FBF9" strokeWidth={4} />
						<line x1={x + 29} x2={x + 29} y1={94} y2={208} stroke="#E8FBF9" strokeWidth={3} />
						<circle cx={x + 66} cy={160} r={5} fill={COLORS.signal} />
					</g>
				))}
				{/* Zielanzeiger vorne */}
				<rect x={712} y={58} width={110} height={24} rx={5} fill="#120E06" />
				<text x={724} y={77} fontFamily={FONTS.heading} fontWeight={900} fontSize={20} fill="#FFB938">{line}</text>
				<text x={762} y={77} fontFamily={FONTS.heading} fontWeight={800} fontSize={13} fill="#FFB938" opacity={0.85}>
					FRANKFURT
				</text>
				{/* Scheinwerfer */}
				<ellipse cx={872} cy={176} rx={10} ry={7} fill="#FFF6D6" />
				<ellipse cx={890} cy={178} rx={60 * lit} ry={22 * lit} fill={withAlpha('#FFF1B8', 0.22 * lit)} />
				{/* Drehgestelle */}
				{[110, 300, 600, 790].map((x) => (
					<g key={x}>
						<rect x={x - 46} y={210} width={92} height={22} rx={8} fill="#1B2140" />
						<circle cx={x - 24} cy={230} r={12} fill="#2A3156" stroke="#5B668F" strokeWidth={3} />
						<circle cx={x + 24} cy={230} r={12} fill="#2A3156" stroke="#5B668F" strokeWidth={3} />
					</g>
				))}
				{/* Kante oben (Licht) */}
				<path d="M40 74 H812" stroke="#FFFFFF" strokeOpacity={0.5} strokeWidth={3} />
			</g>
		</svg>
	);
};

/* ------------------------------------------------------------------ U-Bahn-Zug */

/** Stilisierter U-Bahn-Zug (zwei Wagen, silbern mit Farbstreifen der Linie), Seitenansicht, fährt nach rechts. */
export const UBahnTrain: React.FC<{width: number; line?: 'U4' | 'U5'; lit?: number}> = ({width, line = 'U4', lit = 1}) => {
	const frame = useCurrentFrame();
	const W = 1000;
	const H = 200;
	const c = U_COLORS[line];
	return (
		<svg width={width} height={(width * H) / W} viewBox={`0 0 ${W} ${H}`} style={{overflow: 'visible'}}>
			<defs>
				<linearGradient id={`ubody${line}`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#F3F6FC" />
					<stop offset="0.6" stopColor="#C9D2E6" />
					<stop offset="1" stopColor="#8D98B6" />
				</linearGradient>
			</defs>
			<ellipse cx={500} cy={186} rx={490} ry={10} fill="rgba(0,0,0,0.5)" />
			{[0, 1].map((car) => {
				const x0 = car * 492;
				const front = car === 1;
				return (
					<g key={car}>
						<path d={front ? `M${x0 + 10} 40 H${x0 + 430} Q${x0 + 486} 46 ${x0 + 492} 120 V168 H${x0 + 10} Z` : `M${x0 + 10} 40 H${x0 + 486} V168 H${x0 + 10} Z`} fill={`url(#ubody${line})`} />
						<rect x={x0 + 10} y={124} width={front ? 478 : 476} height={14} fill={c} />
						<rect x={x0 + 26} y={58} width={front ? 400 : 440} height={50} rx={8} fill="#122247" />
						<rect x={x0 + 26} y={58} width={front ? 400 : 440} height={50} rx={8} fill={withAlpha('#FFF0C2', 0.14 * lit)} />
						{front ? <path d={`M${x0 + 438} 58 Q${x0 + 474} 62 ${x0 + 482} 106 H${x0 + 438} Z`} fill="#122247" /> : null}
						{[90, 250, 410].map((dx) =>
							dx < (front ? 400 : 470) ? (
								<g key={dx}>
									<rect x={x0 + dx} y={56} width={44} height={108} rx={4} fill="#2B3A66" stroke="#E9EEF8" strokeWidth={3} />
									<line x1={x0 + dx + 22} x2={x0 + dx + 22} y1={58} y2={162} stroke="#E9EEF8" strokeWidth={2} />
								</g>
							) : null,
						)}
						<rect x={x0 + 20} y={166} width={140} height={14} rx={5} fill="#232A48" />
						<rect x={x0 + 330} y={166} width={140} height={14} rx={5} fill="#232A48" />
					</g>
				);
			})}
			{/* Linienschild an der Front */}
			<rect x={914} y={44} width={58} height={34} rx={6} fill={c} stroke="#FFFFFF" strokeWidth={2} />
			<text x={943} y={70} textAnchor="middle" fontFamily={FONTS.heading} fontWeight={900} fontSize={22} fill="#FFFFFF">
				{line}
			</text>
			<ellipse cx={984} cy={150} rx={8} ry={6} fill="#FFF6D6" />
			<ellipse cx={1010} cy={152} rx={60 * lit} ry={18 * lit} fill={withAlpha('#FFF1B8', 0.25 * lit)} />
			{/* Fahrtwind-Streifen */}
			{[0, 1, 2].map((i) => (
				<line key={i} x1={-60 - ((frame * 9 + i * 70) % 220)} x2={-10 - ((frame * 9 + i * 70) % 220)} y1={70 + i * 34} y2={70 + i * 34} stroke={withAlpha('#FFFFFF', 0.35)} strokeWidth={4} strokeLinecap="round" />
			))}
		</svg>
	);
};

/* ------------------------------------------------------------------ Uhr */

/** Analoge Uhr mit Minutenwert (z. B. 540 = 9:00), dazu digitale Anzeige. `alarm` lässt den Rand rot pulsieren. */
export const BigClock: React.FC<{size: number; minutes: number; digital: string; alarm?: number}> = ({size, minutes, digital, alarm = 0}) => {
	const frame = useCurrentFrame();
	const hourA = ((minutes / 60) % 12) * 30;
	const minA = (minutes % 60) * 6;
	const secA = (frame * 12) % 360;
	const ring = withAlpha('#FF3B4E', 0.4 + 0.5 * alarm * (0.5 + 0.5 * Math.sin(frame / 3)));
	return (
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: size * 0.05}}>
			<svg width={size} height={size} viewBox="-130 -130 260 260" style={{overflow: 'visible'}}>
				<circle r={124} fill="#0D1330" stroke={ring} strokeWidth={10} />
				<circle r={110} fill="url(#clockFace)" />
				<defs>
					<radialGradient id="clockFace" cx="0.4" cy="0.35" r="0.8">
						<stop offset="0" stopColor="#1E2A5C" />
						<stop offset="1" stopColor="#0B1030" />
					</radialGradient>
				</defs>
				{new Array(60).fill(0).map((_, i) => {
					const a = (i * 6 * Math.PI) / 180;
					const big = i % 5 === 0;
					return <line key={i} x1={Math.sin(a) * (big ? 86 : 96)} y1={-Math.cos(a) * (big ? 86 : 96)} x2={Math.sin(a) * 104} y2={-Math.cos(a) * 104} stroke={big ? '#E8ECFF' : '#56609A'} strokeWidth={big ? 6 : 2.5} strokeLinecap="round" />;
				})}
				{[12, 3, 6, 9].map((n, i) => (
					<text key={n} x={Math.sin((i * Math.PI) / 2) * 66} y={-Math.cos((i * Math.PI) / 2) * 66 + 11} textAnchor="middle" fontFamily={FONTS.heading} fontWeight={900} fontSize={30} fill={n === 9 ? COLORS.signal : '#E8ECFF'}>
						{n}
					</text>
				))}
				<line x1={0} y1={12} x2={0} y2={-56} stroke="#FFFFFF" strokeWidth={11} strokeLinecap="round" transform={`rotate(${hourA})`} />
				<line x1={0} y1={16} x2={0} y2={-88} stroke="#FFFFFF" strokeWidth={7} strokeLinecap="round" transform={`rotate(${minA})`} />
				<line x1={0} y1={22} x2={0} y2={-96} stroke="#FF3B4E" strokeWidth={3} strokeLinecap="round" transform={`rotate(${secA})`} />
				<circle r={9} fill="#FF3B4E" stroke="#FFFFFF" strokeWidth={3} />
			</svg>
			<div style={{padding: `${size * 0.03}px ${size * 0.09}px`, borderRadius: size * 0.08, background: '#0B0F26', border: `3px solid ${withAlpha(COLORS.signal, 0.7)}`, fontFamily: FONTS.heading, fontWeight: 900, fontSize: size * 0.24, lineHeight: 1, letterSpacing: 2, color: COLORS.signal, fontVariantNumeric: 'tabular-nums', boxShadow: `0 0 30px ${withAlpha(COLORS.signal, 0.35)}`}}>{digital}</div>
		</div>
	);
};

/* ------------------------------------------------------------------ Römer (Treppengiebel) */

/** Stilisierte Römer-Fassade (drei Treppengiebel + Mittelhaus), warmes Fensterlicht. */
export const RoemerFacade: React.FC<{width: number; lit?: number}> = ({width, lit = 0.8}) => {
	const W = 240;
	const H = 190;
	const house = (x: number, w: number, h: number, key: string, color: string) => {
		const top = H - h;
		const steps = 4;
		const sw = w / (steps * 2 + 1);
		let d = `M${x} ${H} V${top + 40}`;
		for (let i = 0; i < steps; i++) d += ` H${x + sw * (i + 1)} V${top + 40 - (i + 1) * 9}`;
		d += ` H${x + w - sw * steps} `;
		for (let i = steps - 1; i >= 0; i--) d += ` V${top + 40 - i * 9} H${x + w - sw * i}`;
		d += ` V${top + 40} V${H} Z`;
		return (
			<g key={key}>
				<path d={d} fill={color} stroke="#2A1C14" strokeWidth={2} />
				{[0, 1, 2].map((r) =>
					[0, 1, 2].map((c) => <rect key={`${r}-${c}`} x={x + w * 0.16 + c * w * 0.26} y={top + 52 + r * 30} width={w * 0.15} height={18} rx={2} fill={withAlpha('#FFC66B', 0.35 + 0.55 * lit * ((r + c) % 3 === 0 ? 1 : 0.7))} />),
				)}
			</g>
		);
	};
	return (
		<svg width={width} height={(width * H) / W} viewBox={`0 0 ${W} ${H}`}>
			{house(4, 70, 150, 'a', '#8E4E3A')}
			{house(78, 84, 168, 'b', '#A35A3F')}
			{house(166, 70, 150, 'c', '#8E4E3A')}
			<rect x={92} y={H - 30} width={56} height={30} rx={4} fill="#2A1C14" />
			<rect x={0} y={H - 4} width={W} height={4} fill="#2A1C14" />
		</svg>
	);
};

/* ------------------------------------------------------------------ Smartphone: Betriebsinfo (Illustration, keine Live-Daten) */

export type PhoneRow = {lines: {line: string; kind: LineKind}[]; text: string; tone: 'alert' | 'maybe' | 'ok'};

export const TransitPhone: React.FC<{width: number; header: string; banner: string; rows: PhoneRow[]; reveal: number; footer: string; note: string}> = ({width, header, banner, rows, reveal, footer, note}) => {
	const frame = useCurrentFrame();
	const s = width / 360;
	const tone = {alert: '#FF3B4E', maybe: MAYBE_COLOR, ok: '#3DDC84'};
	return (
		<div style={{position: 'relative', width, height: 700 * s, borderRadius: 54 * s, background: 'linear-gradient(160deg, #3A4064, #141832)', padding: 12 * s, boxSizing: 'border-box', boxShadow: '0 40px 90px rgba(0,0,0,0.6)'}}>
			<div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 44 * s, overflow: 'hidden', background: 'linear-gradient(#0E1433, #0A0E26)'}}>
				<div style={{position: 'absolute', left: '50%', top: 10 * s, translate: '-50% 0', width: 110 * s, height: 28 * s, borderRadius: 14 * s, background: '#05060F'}} />
				<div style={{position: 'absolute', left: 22 * s, right: 22 * s, top: 52 * s}}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26 * s, color: COLORS.text}}>{header}</div>
					<div style={{marginTop: 4 * s, fontFamily: FONTS.body, fontWeight: 700, fontSize: 14 * s, color: COLORS.textMuted}}>Freitag, 20.11.2026</div>
					<div style={{marginTop: 12 * s, padding: `${8 * s}px ${10 * s}px`, borderRadius: 12 * s, background: withAlpha('#FF3B4E', 0.16), border: `${2 * s}px solid #FF3B4E`, fontFamily: FONTS.body, fontWeight: 800, fontSize: 15 * s, lineHeight: 1.25, color: COLORS.text}}>⚠ {banner}</div>
					{rows.map((r, i) => {
						const on = Math.max(0, Math.min(1, reveal * rows.length - i));
						return (
							<div key={i} style={{marginTop: 10 * s, padding: `${8 * s}px ${10 * s}px`, borderRadius: 12 * s, background: 'rgba(255,255,255,0.06)', borderLeft: `${5 * s}px solid ${tone[r.tone]}`, opacity: on, translate: `${(1 - on) * 30 * s}px 0`}}>
								<div style={{display: 'flex', gap: 6 * s, flexWrap: 'wrap'}}>
									{r.lines.map((l) => (
										<LineBadge key={l.line} line={l.line} kind={l.kind} size={34 * s} maybe={r.tone === 'maybe'} />
									))}
								</div>
								<div style={{marginTop: 6 * s, fontFamily: FONTS.body, fontWeight: 700, fontSize: 15 * s, lineHeight: 1.2, color: COLORS.text}}>{r.text}</div>
							</div>
						);
					})}
				</div>
				<div style={{position: 'absolute', left: 22 * s, right: 22 * s, bottom: 42 * s, padding: `${9 * s}px ${12 * s}px`, borderRadius: 14 * s, background: withAlpha(TRAM_COLOR, 0.18), border: `${2 * s}px solid ${TRAM_COLOR}`, display: 'flex', alignItems: 'center', gap: 8 * s}}>
					<div style={{width: 10 * s, height: 10 * s, borderRadius: 10 * s, background: TRAM_COLOR, opacity: 0.5 + 0.5 * Math.sin(frame / 5)}} />
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 17 * s, color: COLORS.text}}>{footer}</span>
				</div>
				<div style={{position: 'absolute', left: 0, right: 0, bottom: 14 * s, textAlign: 'center', fontFamily: FONTS.body, fontWeight: 700, fontSize: 11 * s, letterSpacing: 1, color: COLORS.textMuted}}>{note}</div>
			</div>
		</div>
	);
};

/* ------------------------------------------------------------------ Anzeigetafel (Dynamische Fahrgast-Information, stilisiert) */

/** Stilisierte Anzeigetafel an der Haltestelle mit Lauftext – bewusst ohne Abfahrtszeiten (keine erfundenen Daten). */
export const DfiBoard: React.FC<{width: number; title: string; ticker: string}> = ({width, title, ticker}) => {
	const frame = useCurrentFrame();
	const s = width / 520;
	const tw = ticker.length * 15 * s;
	const x = width - ((frame * 4 * s) % (tw + width));
	return (
		<div style={{width, borderRadius: 16 * s, background: '#05060C', border: `${5 * s}px solid #2A3156`, boxShadow: '0 24px 60px rgba(0,0,0,0.6)', padding: `${12 * s}px ${16 * s}px`, boxSizing: 'border-box'}}>
			<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 24 * s, letterSpacing: 2, color: '#FFB938'}}>{title}</div>
			<div style={{position: 'relative', marginTop: 8 * s, height: 34 * s, overflow: 'hidden', borderTop: `${2 * s}px solid #2A2010`}}>
				<div style={{position: 'absolute', left: x, top: 4 * s, whiteSpace: 'nowrap', fontFamily: FONTS.heading, fontWeight: 800, fontSize: 24 * s, color: '#FFB938', textShadow: '0 0 8px rgba(255,185,56,0.6)'}}>{ticker}</div>
			</div>
		</div>
	);
};
