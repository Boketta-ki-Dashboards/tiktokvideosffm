import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {FrankfurtSkyline} from '../../../components/backgrounds/FrankfurtSkyline';
import {BrandLogo} from '../../../components/brand/BrandLogo';
import {CityPlane, cityPlaneXY} from '../../../components/map/CityPlane';
import {type CityMapData, projectLatLon} from '../../../components/map/CityStreetMap';
import {interpolateCamera, type PlaneBillboard, type PlaneCamera, TiltedPlane} from '../../../components/map/TiltedPlane';
import werftMap from '../../../data/maps/frankfurt-ostend-weseler-werft.json';
import {TopTag} from '../../../formats/frankfurt-erklaert/Branding';
import {SourceBar} from '../../../formats/frankfurt-erklaert/components';
import {ACCENT, FORMAT, LAYOUT} from '../../../formats/frankfurt-erklaert/theme';
import {DayTimeline} from '../../../formats/frankfurt-erklaert/visuals/DayTimeline';
import {clamp, EASE_IN_OUT, EASE_OUT, springIn} from '../../../lib/animation';
import {mix, withAlpha} from '../../../lib/color';
import {handleWithAt} from '../../../theme/brand';
import {COLORS, FONTS} from '../../../theme/tokens';
import {blendMood, MOODS, NightCity} from '../../frankfurt-2026-11-20-ausblick/premium/NightCity';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {Card, CountUp, P2Icon, type P2IconName, Stars, useSpring} from '../../frankfurt-erklaert-genz-phase2-2026-11-14/scenes/kit';
import {ASSEMBLIES, BUND, CHANGE, COVER, CTA, FINAL, PRESS, RULES, RULES_EXTRA, RULES_SOURCE, SOURCES, STAND, WERFT} from '../content';
import {DEMOUPDATE_COVER_LAYOUT} from '../cover-layout';
import {EzbTowers, FloesserPylons, PressPodium, RuleGlyph, type RuleGlyphKind} from '../visuals/Illustrations';

const RED = ACCENT.brand;
const BLUE = ACCENT.info;
const ORANGE = '#FF8A3D';
const GREEN = ACCENT.yes;

/* ------------------------------------------------------------------ Kategorie-Chips */

type Kind = 'LAUT STADT' | 'LAUT INNENMINISTERIUM' | 'LAUT POLIZEI' | 'ILLUSTRATION' | 'SYMBOLISCH' | 'NEU SEIT 18.11.' | 'PROGNOSE' | 'OFFEN';
const KIND_COLOR: Record<Kind, string> = {
	'LAUT STADT': BLUE,
	'LAUT INNENMINISTERIUM': BLUE,
	'LAUT POLIZEI': BLUE,
	ILLUSTRATION: '#9AA6CC',
	SYMBOLISCH: '#9AA6CC',
	'NEU SEIT 18.11.': ORANGE,
	PROGNOSE: COLORS.signal,
	OFFEN: ACCENT.no,
};
const Chip: React.FC<{kind: Kind; size?: number; style?: React.CSSProperties}> = ({kind, size = 18, style}) => {
	const c = KIND_COLOR[kind];
	return <span style={{display: 'inline-block', padding: `${size * 0.2}px ${size * 0.5}px`, borderRadius: size * 0.4, background: withAlpha(c, 0.18), border: `2px solid ${c}`, fontFamily: FONTS.heading, fontWeight: 900, fontSize: size, letterSpacing: 1.2, color: c, whiteSpace: 'nowrap', ...style}}>{kind}</span>;
};

/** Federnde Einblendung als Wrapper (nichts vor `at`). */
const In: React.FC<{at: number; children: React.ReactNode; dx?: number; dy?: number; style?: React.CSSProperties; out?: number}> = ({at, children, dx = 0, dy = 30, style, out = 1}) => {
	const s = useSpring(at, 13, 180);
	const frame = useCurrentFrame();
	if (frame < at - 1) return null;
	return <div style={{position: 'absolute', opacity: Math.min(1, s * 1.7) * out, translate: `${(1 - s) * dx}px ${(1 - s) * dy}px`, scale: String(0.92 + 0.08 * s), ...style}}>{children}</div>;
};

/** Szenen-Box links oben (gleiche Linie und Höhe wie das Serien-Overlay rechts, y 272–342). */
const SceneTag: React.FC<{text: string; color: string; icon: P2IconName}> = ({text, color, icon}) => <TopTag text={text} color={color} icon={<P2Icon name={icon} size={30} color={ACCENT.ink} stroke={2.6} />} />;

/** Lesbarkeit: dunkel oben (Kopfzeile, Titel) und unten (Untertitel-Band). */
const Shade: React.FC<{top?: number; bottom?: number; mid?: [number, number]}> = ({top = 0.94, bottom = 0.88, mid = [44, 70]}) => (
	<AbsoluteFill style={{background: `linear-gradient(rgba(4,6,20,${top}) 0%, rgba(4,6,20,${top * 0.86}) 22%, rgba(4,6,20,0) ${mid[0]}%, rgba(4,6,20,0) ${mid[1]}%, rgba(4,6,20,${bottom * 0.8}) 80%, rgba(4,6,20,${bottom}) 100%)`, pointerEvents: 'none'}} />
);

const Note: React.FC<{text: string; top: number; icon?: P2IconName}> = ({text, top, icon = 'info'}) => (
	<div style={{position: 'absolute', left: LAYOUT.left, top, display: 'flex', alignItems: 'center', gap: 10, padding: '5px 14px', borderRadius: 12, background: 'rgba(8,10,28,0.88)', maxWidth: LAYOUT.width, boxSizing: 'border-box'}}>
		<P2Icon name={icon} size={24} color={COLORS.textMuted} />
		<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 23, color: COLORS.textMuted}}>{text}</span>
	</div>
);

/** Marke (Pin + Beschriftung) für projizierte Kartenpunkte. */
const Marker: React.FC<{title: string; sub?: string; color: string; on: number; small?: boolean}> = ({title, sub, color, on, small}) => (
	<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: on, scale: String(0.7 + 0.3 * on), transformOrigin: '50% 100%'}}>
		<div style={{padding: small ? '4px 10px 5px' : '6px 14px 8px', borderRadius: 14, background: 'rgba(8,10,28,0.95)', border: `3px solid ${color}`, boxShadow: `0 12px 30px rgba(0,0,0,0.55), 0 0 24px ${withAlpha(color, 0.35)}`, textAlign: 'center', whiteSpace: 'nowrap'}}>
			{sub ? <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: small ? 18 : 21, letterSpacing: 1.4, color}}>{sub}</div> : null}
			<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: small ? 23 : 28, color: COLORS.text}}>{title}</div>
		</div>
		<div style={{width: 4, height: small ? 22 : 34, background: `linear-gradient(${color}, ${withAlpha(color, 0.1)})`}} />
		<div style={{width: 20, height: 20, borderRadius: 10, marginTop: -5, background: color, border: '3px solid #FFFFFF', boxShadow: `0 0 20px ${withAlpha(color, 0.9)}`}} />
	</div>
);

/* ------------------------------------------------------------------ Mini-Grafik Vorher/Nachher (Titelbild) */

/** Vorher (Zug in Bewegung, durchgestrichen) → Jetzt (Kundgebung an einem Ort am Main). Symbolisch, keine Route. */
const BeforeAfterMini: React.FC<{width: number; strike?: number; pulse?: number}> = ({width, strike = 1, pulse = 0}) => {
	const frame = useCurrentFrame();
	const h = 150;
	const half = width * 0.43;
	// Zug: Punkte laufen eine geschwungene Linie entlang
	const path = (t: number) => {
		const x = 20 + t * (half - 40);
		const y = 86 + Math.sin(t * Math.PI * 2.2) * 26;
		return [x, y] as const;
	};
	const dots = new Array(11).fill(0).map((_, i) => path(((frame / 90 + i * 0.075) % 1 + 1) % 1));
	const ring = new Array(16).fill(0).map((_, i) => {
		const a = i * 2.39996;
		const r = 14 + Math.sqrt(i / 16) * 34;
		return [Math.cos(a) * r, Math.sin(a) * r * 0.45] as const;
	});
	const pr = (frame % 40) / 40;
	return (
		<div style={{position: 'relative', width, height: h}}>
			{/* VORHER */}
			<div style={{position: 'absolute', left: 0, top: 0, width: half, height: h, borderRadius: 20, background: 'rgba(10,12,32,0.86)', border: '2px solid rgba(255,255,255,0.16)', overflow: 'hidden'}}>
				<div style={{position: 'absolute', left: 14, top: 8, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 21, letterSpacing: 2, color: COLORS.textMuted}}>{CHANGE.before.label}</div>
				<svg width={half} height={h} style={{position: 'absolute', inset: 0}}>
					<path d={new Array(31).fill(0).map((_, i) => `${i ? 'L' : 'M'}${path(i / 30)[0]} ${path(i / 30)[1]}`).join(' ')} fill="none" stroke={withAlpha('#FFFFFF', 0.28)} strokeWidth={4} strokeDasharray="8 8" />
					{dots.map(([x, y], i) => (
						<circle key={i} cx={x} cy={y} r={7} fill={i % 3 === 0 ? COLORS.signal : '#E8ECFF'} />
					))}
				</svg>
				<div style={{position: 'absolute', left: 14, bottom: 8, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 23, color: COLORS.text, opacity: 0.85}}>DEMOZUG</div>
				{/* Durchstreichen */}
				<svg width={half} height={h} style={{position: 'absolute', inset: 0}}>
					<line x1={18} y1={h - 20} x2={18 + (half - 36) * strike} y2={h - 20 - (h - 40) * strike} stroke={ACCENT.no} strokeWidth={9} strokeLinecap="round" />
				</svg>
			</div>
			{/* Pfeil */}
			<svg width={width * 0.14} height={h} style={{position: 'absolute', left: half, top: 0}}>
				<path d={`M${width * 0.025} ${h / 2} H${width * 0.11}`} stroke={COLORS.signal} strokeWidth={8} strokeLinecap="round" />
				<path d={`M${width * 0.08} ${h / 2 - 16} L${width * 0.115} ${h / 2} L${width * 0.08} ${h / 2 + 16}`} fill="none" stroke={COLORS.signal} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
			</svg>
			{/* JETZT */}
			<div style={{position: 'absolute', left: width - half, top: 0, width: half, height: h, borderRadius: 20, background: 'rgba(10,12,32,0.92)', border: `3px solid ${RED}`, boxShadow: `0 0 ${24 + 30 * pulse}px ${withAlpha(RED, 0.35 + 0.3 * pulse)}`, overflow: 'hidden', scale: String(1 + 0.05 * Math.sin(pulse * Math.PI))}}>
				<div style={{position: 'absolute', left: 14, top: 8, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 21, letterSpacing: 2, color: RED}}>{CHANGE.after.label}</div>
				<svg width={half} height={h} style={{position: 'absolute', inset: 0}}>
					{/* Main */}
					<path d={`M0 ${h - 34} Q${half * 0.3} ${h - 44} ${half * 0.55} ${h - 34} T${half} ${h - 36} V${h} H0 Z`} fill="#1B4E96" opacity={0.85} />
					<ellipse cx={half / 2} cy={84} rx={56 + pr * 18} ry={24 + pr * 8} fill="none" stroke={withAlpha(RED, 0.7 * (1 - pr))} strokeWidth={3} />
					<ellipse cx={half / 2} cy={84} rx={52} ry={22} fill={withAlpha(RED, 0.25)} stroke={RED} strokeWidth={3} />
					{ring.map(([x, y], i) => (
						<circle key={i} cx={half / 2 + x} cy={84 + y} r={6} fill={i % 4 === 0 ? COLORS.signal : '#E8ECFF'} />
					))}
					<g transform={`translate(${half / 2 - 13} 22)`}>
						<path d="M13 40s-12-13-12-23a12 12 0 0 1 24 0c0 10-12 23-12 23z" fill={RED} stroke="#FFFFFF" strokeWidth={2} />
						<circle cx={13} cy={17} r={4.5} fill="#FFFFFF" />
					</g>
				</svg>
				<div style={{position: 'absolute', right: 14, bottom: 6, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 23, color: COLORS.text}}>KUNDGEBUNG</div>
			</div>
		</div>
	);
};

/* ------------------------------------------------------------------ Szene 1: Titelbild = erste Szene */

/**
 * Titelbild (Video-Frame 0 und PNG, nach COVER_ZONE): Serientitel, „GEN-Z-DEMO AM 20.11.“, groß „GEÄNDERT!“, rote Karte
 * „KUNDGEBUNG STATT DEMOZUG“, Mini-Grafik Vorher/Nachher, „WESELER WERFT · 14–16:30 UHR“, Logo + Account; im PNG zusätzlich die Frage.
 */
export const DemoUpdateCover: React.FC<{morph?: number; pulse?: number; thumbnail?: boolean}> = ({morph = 0, pulse = 0, thumbnail = false}) => {
	const frame = useCurrentFrame();
	const L = DEMOUPDATE_COVER_LAYOUT;
	const m = EASE_IN_OUT(Math.min(1, Math.max(0, morph)));
	const text = 1 - Math.min(1, m * 1.6);
	const bob = Math.sin(frame / 26) * 3;
	// Verwandlung: Kamera fliegt in das „JETZT“-Feld der Mini-Grafik
	const focusX = L.vizLeft + L.vizWidth * 0.78;
	const focusY = L.vizTop + 80;
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{scale: String(1 + m * 0.1), transformOrigin: '50% 40%'}}>
				<NightCity mood={blendMood(MOODS.dusk, MOODS.calm, 0.2)} progress={0.4 + frame / 2400} litRatio={0.45} bokeh={10} showPromenade={false} showMoon />
			</AbsoluteFill>
			<Stars seed="du10" n={36} height={380} />
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.5) 0%, rgba(4,6,20,0.12) 15%, rgba(4,6,20,0.25) 24%, rgba(4,6,20,0.72) 33%, rgba(4,6,20,0.9) 46%, rgba(4,6,20,0.92) 70%, rgba(4,6,20,0.82) 100%)'}} />
			<div style={{position: 'absolute', inset: 0, scale: String(1 + m * 1.2), transformOrigin: `${focusX}px ${focusY}px`}}>
				<div style={{opacity: text, translate: `0 ${(1 - text) * -24}px`}}>
					<div style={{position: 'absolute', left: 0, right: 0, top: L.brandTop, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16}}>
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 50, lineHeight: 0.98, color: COLORS.text, textAlign: 'right', textShadow: '0 6px 24px rgba(0,0,0,0.8)'}}>
							FRANKFURT
							<br />
							ERKLÄRT
						</div>
						<div style={{padding: '9px 16px', borderRadius: 10, background: RED, boxShadow: '0 10px 26px rgba(255,59,78,0.4)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, letterSpacing: 3, color: '#FFFFFF'}}>{FORMAT.sub}</div>
					</div>
					<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.kickerTop, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: L.kickerSize, lineHeight: 1.1, color: COLORS.text, whiteSpace: 'nowrap', textShadow: '0 8px 26px rgba(0,0,0,0.9)'}}>{COVER.kicker}</div>
					<div style={{position: 'absolute', left: 0, right: 0, top: L.bigTop + bob, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: L.bigSize, lineHeight: 1, letterSpacing: -4, color: COLORS.signal, whiteSpace: 'nowrap', textShadow: `0 0 70px ${withAlpha(COLORS.signal, 0.45)}, 0 20px 50px rgba(0,0,0,0.85)`}}>
						{COVER.big.replace('!', '')}
						<span style={{color: RED}}>!</span>
					</div>
					<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.cardTop, display: 'flex', justifyContent: 'center'}}>
						<div style={{padding: '8px 24px 10px', borderRadius: 16, background: RED, boxShadow: '0 16px 40px rgba(255,59,78,0.35)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: L.cardFont, lineHeight: 1.1, color: '#FFFFFF', whiteSpace: 'nowrap'}}>{COVER.sub}</div>
					</div>
				</div>
				<div style={{position: 'absolute', left: L.vizLeft, top: L.vizTop, opacity: Math.max(text, 1 - m * 0.4)}}>
					<BeforeAfterMini width={L.vizWidth} pulse={pulse} />
				</div>
				<div style={{opacity: text}}>
					<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.smallTop, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10}}>
						<P2Icon name="pin" size={32} color={RED} stroke={2.6} />
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, letterSpacing: 2, color: COLORS.text, whiteSpace: 'nowrap'}}>{COVER.small}</span>
					</div>
					<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.metaTop, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14}}>
						<BrandLogo size={52} />
						<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 30, color: COLORS.textMuted}}>{handleWithAt()}</span>
					</div>
					{thumbnail ? (
						<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.questionTop, display: 'flex', justifyContent: 'center'}}>
							<div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderRadius: 16, background: 'rgba(8,10,28,0.92)', border: `2.5px solid ${COLORS.signal}`}}>
								<P2Icon name="alert" size={30} color={COLORS.signal} />
								<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, color: COLORS.text, whiteSpace: 'nowrap'}}>{COVER.question}</span>
							</div>
						</div>
					) : null}
				</div>
			</div>
		</AbsoluteFill>
	);
};

/** Szene 1 – Titelbild im Video (ab Frame 0 vollständig); bei „anders“ leuchtet das JETZT-Feld auf. */
export const CoverScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const h2 = cue(cues, 'hook2', 30);
	const atFreitag = wordFrame(cues, 'Freitag', h2.from + 30);
	const atAnders = wordFrame(cues, 'anders', h2.from + 60);
	const pulse = interpolate(frame, [atAnders - 2, atAnders + 18], [0, 1], clamp);
	const morph = interpolate(frame, [durationInFrames - 22, durationInFrames - 2], [0, 1], clamp);
	return (
		<AbsoluteFill>
			<DemoUpdateCover morph={morph} pulse={pulse > 0 && pulse < 1 ? pulse : 0} />
			<Sfx name="softImpact" at={0} volume={0.5} />
			<Sfx name="tick" at={atFreitag} volume={0.5} />
			<Sfx name="pop" at={atAnders - 2} volume={0.5} />
			<Sfx name="whoosh" at={durationInFrames - 20} volume={0.45} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 2: Vorher/Nachher (abstrakte Stadt, symbolisch) */

const CITY = 1400;
const CELL = 175;
const RIVER_Y = 1060;
/** Symbolischer Zug durch ein abstraktes Straßenraster – ausdrücklich KEINE echte Route (Strecke nicht veröffentlicht). */
const DEMO_PATH: [number, number][] = [
	[175, 175],
	[175, 525],
	[525, 525],
	[525, 350],
	[875, 350],
	[875, 700],
	[1225, 700],
	[1225, 525],
];
const PIN: [number, number] = [930, RIVER_Y - 58];
const pathAt = (t: number): [number, number] => {
	const seg = DEMO_PATH.slice(1).map((p, i) => Math.hypot(p[0] - DEMO_PATH[i][0], p[1] - DEMO_PATH[i][1]));
	const total = seg.reduce((a, b) => a + b, 0);
	let d = Math.min(1, Math.max(0, t)) * total;
	for (let i = 0; i < seg.length; i++) {
		if (d <= seg[i] || i === seg.length - 1) {
			const f = seg[i] ? Math.min(1, d / seg[i]) : 0;
			const a = DEMO_PATH[i];
			const b = DEMO_PATH[i + 1];
			return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
		}
		d -= seg[i];
	}
	return DEMO_PATH[DEMO_PATH.length - 1];
};

const BLOCKS = (() => {
	const out: {x: number; y: number; w: number; h: number}[] = [];
	for (let r = 0; r < 6; r++) {
		for (let c = 0; c < 8; c++) {
			const x = c * CELL + 18;
			const y = r * CELL + 18;
			if (y + CELL - 36 > RIVER_Y - 70) continue;
			const shrink = random(`b${r}-${c}`) * 22;
			out.push({x: x + shrink * 0.5, y: y + shrink * 0.3, w: CELL - 36 - shrink, h: CELL - 36 - shrink * 0.6});
		}
	}
	return out;
})();
const BLOCK_PATH = BLOCKS.map((b) => `M${b.x} ${b.y}h${b.w}v${b.h}h${-b.w}z`).join('');

export const ChangeScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const w1 = cue(cues, 'w1', 0);
	const atStatt = wordFrame(cues, 'Statt', w1.from);
	const atStation = wordFrame(cues, 'stationäre', w1.from + 60);
	const atWeseler = wordFrame(cues, 'Weseler', atStation + 30);
	const m = interpolate(frame, [atStation - 6, atStation + 22], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const cam = interpolateCamera(
		frame,
		[
			{frame: 0, cam: {x: 640, y: 520, zoom: 0.66, tilt: 46, rotate: -14}},
			{frame: atStation - 6, cam: {x: 700, y: 600, zoom: 0.7, tilt: 48, rotate: -10}},
			{frame: atStation + 26, cam: {x: PIN[0] - 40, y: PIN[1] - 20, zoom: 1.08, tilt: 54, rotate: -4}},
			{frame: durationInFrames + 10, cam: {x: PIN[0] - 30, y: PIN[1] - 10, zoom: 1.16, tilt: 56, rotate: -1}},
		],
		EASE_IN_OUT,
	);
	const N = 34;
	const base = frame / 150;
	const dots = new Array(N).fill(0).map((_, i) => {
		const t = (((base + i * 0.022) % 1) + 1) % 1;
		const [px, py] = pathAt(t);
		const a = i * 2.39996;
		const r = 24 + Math.sqrt(i / N) * 96;
		const tx = PIN[0] + Math.cos(a) * r;
		const ty = PIN[1] + Math.sin(a) * r * 0.36;
		const mi = interpolate(m, [Math.min(0.5, (i / N) * 0.5), Math.min(1, (i / N) * 0.5 + 0.5)], [0, 1], clamp);
		return {x: px + (tx - px) * mi, y: py + (ty - py) * mi, c: i % 4 === 0 ? COLORS.signal : '#EEF1FF'};
	});
	const pr = (frame % 36) / 36;
	const pathD = DEMO_PATH.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ');
	const ground = (
		<svg width={CITY} height={CITY} viewBox={`0 0 ${CITY} ${CITY}`} style={{overflow: 'visible'}}>
			<rect x={-400} y={-400} width={CITY + 800} height={CITY + 800} fill="#0A0F2A" />
			{/* Straßenraster */}
			{new Array(9).fill(0).map((_, i) => (
				<g key={i}>
					<line x1={i * CELL} y1={-200} x2={i * CELL} y2={RIVER_Y - 70} stroke="#222C60" strokeWidth={30} />
					<line x1={-200} y1={i * CELL} x2={CITY + 200} y2={i * CELL} stroke={i * CELL < RIVER_Y - 70 ? '#222C60' : 'none'} strokeWidth={30} />
				</g>
			))}
			{/* Ufer + Main */}
			<rect x={-400} y={RIVER_Y - 90} width={CITY + 800} height={70} fill="#16503A" />
			<path d={`M-400 ${RIVER_Y - 20} Q${CITY * 0.3} ${RIVER_Y - 34} ${CITY * 0.6} ${RIVER_Y - 18} T${CITY + 400} ${RIVER_Y - 22} V${CITY + 400} H-400 Z`} fill="#17488C" />
			{new Array(6).fill(0).map((_, i) => (
				<path key={i} d={`M${-200 + ((frame * 2 + i * 260) % (CITY + 400))} ${RIVER_Y + 40 + i * 30} q40 -8 80 0`} fill="none" stroke={withAlpha('#9CC4FF', 0.35)} strokeWidth={4} strokeLinecap="round" />
			))}
			{/* symbolischer Zug (verblasst nach dem Wechsel) */}
			<path d={pathD} fill="none" stroke={withAlpha(COLORS.signal, 0.4 * (1 - m))} strokeWidth={14} strokeDasharray="26 20" strokeLinejoin="round" strokeLinecap="round" />
			{/* Kundgebungsfläche */}
			<g opacity={m}>
				<ellipse cx={PIN[0]} cy={PIN[1]} rx={140 + pr * 40} ry={50 + pr * 14} fill="none" stroke={withAlpha(RED, 0.6 * (1 - pr))} strokeWidth={6} />
				<ellipse cx={PIN[0]} cy={PIN[1]} rx={134} ry={46} fill={withAlpha(RED, 0.22)} stroke={RED} strokeWidth={6} />
			</g>
		</svg>
	);
	const blocks = (i: number, n: number) => (
		<svg width={CITY} height={CITY} viewBox={`0 0 ${CITY} ${CITY}`}>
			<path d={BLOCK_PATH} fill={i === n - 1 ? '#2E3A7C' : `rgb(${20 + i * 5}, ${26 + i * 6}, ${62 + i * 10})`} stroke={i === n - 1 ? '#4A5CB0' : 'none'} strokeWidth={2} />
		</svg>
	);
	const dotsLayer = (
		<svg width={CITY} height={CITY} viewBox={`0 0 ${CITY} ${CITY}`} style={{overflow: 'visible'}}>
			{dots.map((d, i) => (
				<g key={i}>
					<circle cx={d.x} cy={d.y} r={15} fill={withAlpha(d.c, 0.25)} />
					<circle cx={d.x} cy={d.y} r={9} fill={d.c} />
				</g>
			))}
		</svg>
	);
	const floors = 4;
	const billboards: PlaneBillboard[] = [
		{key: 'werft', x: PIN[0], y: PIN[1], z: 20, node: <Marker title="WESELER WERFT" sub="JETZT · KUNDGEBUNG" color={RED} on={interpolate(frame, [atWeseler - 8, atWeseler + 4], [0, 1], clamp)} />},
		// Erst nach der Kamerafahrt: in der Totalen läge die Beschriftung auf der Quellenzeile, weiter links am Bildrand.
		{key: 'main', x: 690, y: RIVER_Y + 34, node: <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, letterSpacing: 10, color: withAlpha('#BFD8FF', 0.75), opacity: interpolate(frame, [atStation + 12, atStation + 26], [0, 1], clamp)}}>MAIN</div>},
	];
	const strike = interpolate(frame, [atStation - 4, atStation + 10], [0, 1], {...clamp, easing: EASE_OUT});
	const after = useSpring(atStation - 4, 12, 190);
	return (
		<AbsoluteFill style={{backgroundColor: '#070B22', overflow: 'hidden'}}>
			<TiltedPlane
				width={CITY}
				height={CITY}
				camera={cam as PlaneCamera}
				anchor={[540, 900]}
				perspective={1300}
				layers={[{key: 'g', z: 0, node: ground}, ...new Array(floors).fill(0).map((_, i) => ({key: `b${i}`, z: 4 + i * 4, node: blocks(i, floors)})), {key: 'dots', z: 22, node: dotsLayer}]}
				billboards={billboards}
				mask="radial-gradient(ellipse 50% 50% at 50% 50%, #000 62%, rgba(0,0,0,0) 99%)"
			/>
			{/* Blitz beim Umschalten */}
			<AbsoluteFill style={{background: `radial-gradient(circle at 60% 62%, ${withAlpha('#FFFFFF', 0.35 * Math.sin(Math.min(1, Math.max(0, (frame - atStation + 4) / 12)) * Math.PI))}, rgba(0,0,0,0) 60%)`, pointerEvents: 'none'}} />
			<Shade top={0.95} bottom={0.9} mid={[38, 66]} />
			<SceneTag text="VORHER → JETZT" color={RED} icon="route" />
			{/* Vorher */}
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 380, opacity: 1 - 0.45 * strike}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
					<span style={{padding: '4px 12px', borderRadius: 10, background: withAlpha('#FFFFFF', 0.14), fontFamily: FONTS.heading, fontWeight: 900, fontSize: 22, letterSpacing: 2, color: COLORS.textMuted}}>{CHANGE.before.label}</span>
					<Chip kind="SYMBOLISCH" size={16} />
				</div>
				<div style={{position: 'relative', display: 'inline-block', marginTop: 6, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 50, lineHeight: 1.05, color: COLORS.text, whiteSpace: 'nowrap'}}>
					{CHANGE.before.title}
					<div style={{position: 'absolute', left: -6, top: '52%', height: 8, width: `${strike * 104}%`, borderRadius: 4, background: ACCENT.no, rotate: '-2deg'}} />
				</div>
			</div>
			{/* Jetzt */}
			{frame >= atStation - 5 ? (
				<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 506, opacity: Math.min(1, after * 1.8), translate: `${(1 - after) * 60}px 0`}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
						<span style={{padding: '4px 12px', borderRadius: 10, background: RED, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 22, letterSpacing: 2, color: '#FFFFFF'}}>{CHANGE.after.label}</span>
						<Chip kind="LAUT STADT" size={16} />
					</div>
					<div style={{marginTop: 6, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 62, lineHeight: 1, color: RED, whiteSpace: 'nowrap', textShadow: `0 0 40px ${withAlpha(RED, 0.5)}, 0 8px 26px rgba(0,0,0,0.9)`}}>{CHANGE.after.title}</div>
				</div>
			) : null}
			<In at={atWeseler + 4} dy={14} style={{left: LAYOUT.left, top: 1062, width: LAYOUT.width}}>
				<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 25, lineHeight: 1.25, color: COLORS.textMuted}}>{CHANGE.why}</div>
			</In>
			<Note text="Symbolisch: Die ursprüngliche Strecke ist nicht veröffentlicht" top={1142} />
			<SourceBar text={CHANGE.source} at={6} />
			<Sfx name="whoosh" at={0} volume={0.3} />
			<Sfx name="click" at={atStatt} volume={0.4} />
			<Sfx name="whoosh" at={atStation - 8} volume={0.55} />
			<Sfx name="stamp" at={atStation - 2} volume={0.45} />
			<Sfx name="softImpact" at={atStation + 18} volume={0.6} />
			<Sfx name="blip" at={atWeseler - 4} volume={0.5} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 3: Weseler Werft (OSM, 2,5D) */

const WERFT_MAP = werftMap as unknown as CityMapData;
const WERFT_K = 1.2;
const FLOESSER_PYLONS: [number, number] = [50.1084, 8.6948];
const EZB_AT: [number, number] = [50.10963, 8.70292];
const MAIN_LABEL_AT: [number, number] = [50.10715, 8.7012];
/** Werft-Marke etwas östlich der Mitte der Fläche (verdeckt so nicht die Pylone der Flößerbrücke). */
const WERFT_LABEL_AT: [number, number] = [50.10777, 8.69947];

/** Kundgebungsfläche (Lage laut Stadt, Ausdehnung schematisch) + angedeutete Menge als Bodenpunkte. */
const WerftGround: React.FC<{on: number; fill: number}> = ({on, fill}) => {
	const frame = useCurrentFrame();
	const [cx, cy] = projectLatLon(WERFT_MAP, WERFT.at);
	const pr = (frame % 40) / 40;
	const N = 90;
	return (
		<g opacity={on} transform={`rotate(13 ${cx} ${cy})`}>
			<ellipse cx={cx} cy={cy} rx={190 + pr * 26} ry={34 + pr * 8} fill="none" stroke={withAlpha(RED, 0.55 * (1 - pr))} strokeWidth={5} />
			<ellipse cx={cx} cy={cy} rx={186} ry={32} fill={withAlpha(RED, 0.2)} stroke={RED} strokeWidth={5} strokeDasharray="16 10" />
			{new Array(N).fill(0).map((_, i) => {
				if (i / N > fill) return null;
				const u = random(`wx${i}`) * 2 - 1;
				const v = random(`wy${i}`) * 2 - 1;
				return <circle key={i} cx={cx + u * 168} cy={cy + v * 22} r={4.2} fill={i % 5 === 0 ? COLORS.signal : '#EEF1FF'} opacity={0.9} />;
			})}
		</g>
	);
};

export const WerftScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const w2 = cue(cues, 'w2', 0);
	const w3 = cue(cues, 'w3', 80);
	const at14 = wordFrame(cues, '14', w2.from + 4);
	const at1630 = wordFrame(cues, '16:30', at14 + 20);
	const atDunkel = wordFrame(cues, 'Dunkelheit', at1630 + 30);
	const atAngem = wordFrame(cues, 'Erwartet', w3.from);
	const at4000 = wordFrame(cues, '4.000', atAngem + 16);
	const atPlanung = wordFrame(cues, 'Prognose', at4000 + 24);
	const atTeil = wordFrame(cues, 'Zählung', atPlanung + 20);
	const [wx, wy] = cityPlaneXY(WERFT_MAP, WERFT_K, WERFT.at);
	const cam = interpolateCamera(
		frame,
		[
			{frame: 0, cam: {x: wx + 220, y: wy - 40, zoom: 1.05, tilt: 58, rotate: 62}},
			{frame: Math.max(20, atAngem - 10), cam: {x: wx + 140, y: wy - 20, zoom: 1.24, tilt: 57, rotate: 66}},
			{frame: durationInFrames + 10, cam: {x: wx + 120, y: wy - 16, zoom: 1.32, tilt: 56, rotate: 68}},
		],
		EASE_IN_OUT,
	);
	const dusk = interpolate(frame, [atDunkel - 10, atDunkel + 40], [0, 1], clamp);
	const onArea = interpolate(frame, [4, 18], [0, 1], clamp);
	const fill = interpolate(frame, [atAngem - 4, at4000 + 6], [0.08, 1], {...clamp, easing: EASE_OUT});
	const pyl = cityPlaneXY(WERFT_MAP, WERFT_K, FLOESSER_PYLONS);
	const ezb = cityPlaneXY(WERFT_MAP, WERFT_K, EZB_AT);
	const mainL = cityPlaneXY(WERFT_MAP, WERFT_K, MAIN_LABEL_AT);
	const wl = cityPlaneXY(WERFT_MAP, WERFT_K, WERFT_LABEL_AT);
	const markers: PlaneBillboard[] = [
		{key: 'ezb', x: ezb[0], y: ezb[1], node: <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}><EzbTowers size={230} lit={0.3 + dusk * 0.4} /><span style={{marginTop: 4, padding: '2px 10px', borderRadius: 8, background: 'rgba(8,10,28,0.85)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 22, color: '#BFD0FF'}}>EZB</span></div>},
		{key: 'floesser', x: pyl[0], y: pyl[1], node: <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}><FloesserPylons size={150} /><span style={{marginTop: 2, padding: '2px 10px', borderRadius: 8, background: 'rgba(8,10,28,0.85)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 22, color: '#D7DDAA'}}>FLÖSSERBRÜCKE</span></div>},
		{key: 'main', x: mainL[0], y: mainL[1], node: <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, letterSpacing: 10, color: withAlpha('#CFE2FF', 0.8), textShadow: '0 2px 10px rgba(0,0,0,0.8)'}}>MAIN</div>},
		{key: 'werft', x: wl[0], y: wl[1], z: 6, node: <Marker title={WERFT.name} sub="KUNDGEBUNG · LAUT STADT" color={RED} on={interpolate(frame, [2, 14], [0, 1], clamp)} />},
	];
	const sky = blendMood(MOODS.calm, MOODS.dusk, 0.35 + dusk * 0.5);
	return (
		<AbsoluteFill style={{backgroundColor: '#070B22', overflow: 'hidden'}}>
			{/* Himmel + ferne Skyline am Horizont (Blick mainabwärts nach Westen) */}
			<AbsoluteFill style={{background: `linear-gradient(${sky.sky[0]} 0%, ${sky.sky[1]} 24%, ${sky.sky[2]} 33%, ${sky.sky[3]} 38%, #0A0F2A 46%)`}} />
			{/* ferne Skyline am Horizont (Blick mainabwärts Richtung Innenstadt, schematisch) */}
			<div style={{position: 'absolute', left: 150 - frame * 0.12, top: 250, opacity: 0.8}}>
				<FrankfurtSkyline width={820} litRatio={0.2 + dusk * 0.35} showRiver={false} showBridge={false} />
			</div>
			<AbsoluteFill style={{translate: '0 40px'}}>
				<CityPlane
					map={WERFT_MAP}
					k={WERFT_K}
					camera={cam as PlaneCamera}
					anchor={[540, 900]}
					perspective={1250}
					floors={4}
					tint="#34428A"
					ground={{base: '#0B1130', parks: mix('#1E5A3C', '#163C30', dusk * 0.5), water: mix('#1D55A6', '#143A78', dusk * 0.5), pedestrian: '#5A6AA8'}}
					groundExtras={<WerftGround on={onArea} fill={fill} />}
					markers={markers}
				/>
			</AbsoluteFill>
			<Shade top={0.96} bottom={0.9} mid={[34, 64]} />
			<SceneTag text="FREITAG · 14:00 UHR" color={RED} icon="clock" />
			{/* Titel */}
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 378}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
					<Chip kind="LAUT STADT" size={17} />
					<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 25, color: COLORS.textMuted, whiteSpace: 'nowrap'}}>{WERFT.where}</span>
				</div>
				<div style={{marginTop: 4, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 72, lineHeight: 1, letterSpacing: -1, color: RED, whiteSpace: 'nowrap', textShadow: `0 0 40px ${withAlpha(RED, 0.5)}, 0 8px 28px rgba(0,0,0,0.9)`}}>{WERFT.name}</div>
			</div>
			<In at={Math.max(2, at14 - 4)} dx={-40} dy={0} style={{left: LAYOUT.left, top: 494}}>
				<Card color={COLORS.signal} style={{padding: '8px 18px', display: 'flex', alignItems: 'center', gap: 12}} glow={0.25}>
					<P2Icon name="clock" size={44} color={COLORS.signal} stroke={2.4} />
					<div>
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, color: COLORS.text, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap'}}>
							14:00–<span style={{color: frame >= at1630 - 3 ? COLORS.signal : COLORS.text}}>16:30</span> UHR
						</div>
						{frame >= atDunkel - 6 ? <div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 25, color: mix('#AEB6D3', '#FFB07A', dusk), whiteSpace: 'nowrap'}}>{WERFT.timeNote}</div> : null}
						{frame >= atDunkel + 6 ? <div style={{marginTop: 2, fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted, whiteSpace: 'nowrap', opacity: interpolate(frame, [atDunkel + 6, atDunkel + 14], [0, 1], clamp)}}>{WERFT.endQuote}</div> : null}
					</div>
				</Card>
			</In>
			{/* 4.000 angemeldet */}
			<In at={atAngem - 4} dy={40} style={{left: LAYOUT.left, top: 966, width: LAYOUT.width}}>
				<Card color={RED} style={{padding: '10px 22px', display: 'flex', alignItems: 'center', gap: 16}} glow={0.4}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 28, lineHeight: 1, color: COLORS.textMuted, textAlign: 'right'}}>
						BIS
						<br />
						ZU
					</div>
					<CountUp value={WERFT.count} at={atAngem - 4} dur={Math.max(10, at4000 + 4 - (atAngem - 4))} style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 112, lineHeight: 1, color: COLORS.text, textShadow: `0 0 40px ${withAlpha(RED, 0.7)}`, scale: String(1 + 0.08 * Math.sin(interpolate(frame, [at4000 + 2, at4000 + 14], [0, 1], clamp) * Math.PI))}} />
					<div style={{flex: 1}}>
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, lineHeight: 1, color: RED}}>{WERFT.countLabel}</div>
						<div style={{marginTop: 8, display: 'flex', alignItems: 'center', gap: 8, opacity: frame >= atPlanung - 4 ? 1 : 0}}>
							<Chip kind="PROGNOSE" size={17} />
						</div>
						<div style={{marginTop: 6, fontFamily: FONTS.body, fontWeight: 700, fontSize: 25, lineHeight: 1.15, color: COLORS.textMuted, opacity: frame >= atTeil - 4 ? 1 : 0}}>keine Zählung</div>
					</div>
				</Card>
			</In>
			<div style={{position: 'absolute', left: LAYOUT.left, top: 1156, display: 'flex', gap: 10}}>
				<Chip kind="ILLUSTRATION" size={15} />
				<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted, padding: '2px 8px', borderRadius: 8, background: 'rgba(8,10,28,0.8)'}}>Fläche schematisch · Karte © OpenStreetMap-Mitwirkende</span>
			</div>
			<SourceBar text={WERFT.source} at={8} />
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="blip" at={4} volume={0.5} />
			<Sfx name="tick" at={Math.max(2, at14 - 4)} volume={0.6} />
			<Sfx name="tick" at={at1630 - 3} volume={0.55} />
			<Sfx name="pop" at={atAngem - 4} volume={0.45} />
			<Sfx name="softImpact" at={at4000 + 2} volume={0.7} />
			<Sfx name="boom" at={at4000 + 2} volume={0.25} />
			<Sfx name="click" at={atPlanung - 4} volume={0.45} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 4: Auflagen */

export const RulesScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const a1 = cue(cues, 'a1', 0);
	const a2 = cue(cues, 'a2', 140);
	const atAuflagen = wordFrame(cues, 'Auflagen', a1.from + 6);
	const items: {kind: RuleGlyphKind; title: string; sub: string; at: number; wide?: boolean}[] = [
		{kind: 'pyro', title: RULES[0].title, sub: 'nichts abbrennen', at: wordFrame(cues, 'Pyro', a1.from + 40)},
		{kind: 'glass', title: RULES[1].title, sub: 'keine Glasflaschen', at: wordFrame(cues, 'Alkohol', a1.from + 60)},
		{kind: 'dog', title: RULES_EXTRA, sub: 'nicht mitbringen', at: wordFrame(cues, 'Hunde', a1.from + 90)},
		{kind: 'mask', title: RULES[2].title, sub: 'Vermummungsverbot', at: wordFrame(cues, 'Vermummung', a1.from + 110)},
		{kind: 'pole', title: 'STANGEN: MAX. 2 METER', sub: 'für Transparente · nur weiches Holz oder Kunststoff', at: wordFrame(cues, 'Transparent', a2.from + 4), wide: true},
	];
	const atZwei = wordFrame(cues, 'zwei', items[4].at + 20);
	const drift = interpolate(frame, [0, durationInFrames], [0, 1]);
	return (
		<AbsoluteFill style={{backgroundColor: '#060920', overflow: 'hidden'}}>
			<AbsoluteFill style={{background: `radial-gradient(ellipse 70% 40% at ${40 + drift * 20}% 58%, ${withAlpha(RED, 0.12)}, rgba(0,0,0,0) 70%), linear-gradient(#0C1036, #05071A)`}} />
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: 0.1}}>
				{new Array(24).fill(0).map((_, i) => (
					<line key={i} x1={0} y1={i * 84 + drift * 84} x2={1080} y2={i * 84 + drift * 84} stroke="#6A7BD8" strokeWidth={1} />
				))}
			</svg>
			<SceneTag text="AUFLAGEN DER STADT" color={BLUE} icon="shield" />
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 384}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 64, color: COLORS.text, whiteSpace: 'nowrap', scale: String(1 + 0.05 * Math.sin(interpolate(frame, [atAuflagen - 2, atAuflagen + 12], [0, 1], clamp) * Math.PI)), transformOrigin: '0 50%'}}>DIE AUFLAGEN</span>
					<Chip kind="LAUT STADT" size={17} />
				</div>
				<div style={{marginTop: 4, fontFamily: FONTS.body, fontWeight: 700, fontSize: 27, color: COLORS.textMuted}}>gelten für alle angemeldeten Versammlungen am 20.11.</div>
			</div>
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 528, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
				{items.map((it, i) => {
					const a = it.at - 4;
					const s = interpolate(frame, [a, a + 9], [0, 1], {...clamp, easing: EASE_OUT});
					const strike = interpolate(frame, [a + 4, a + 14], [0, 1], clamp);
					const measure = it.kind === 'pole' ? interpolate(frame, [atZwei - 10, atZwei + 6], [0, 1], clamp) : 1;
					if (s <= 0) {
						return (
							<div key={it.kind} style={{gridColumn: it.wide ? '1 / span 2' : undefined, height: it.wide ? 150 : 190, borderRadius: 24, border: '2.5px dashed rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.025)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: interpolate(frame, [i * 2, i * 2 + 8], [0, 1], clamp)}}>
								<div style={{opacity: 0.16}}>
									<RuleGlyph kind={it.kind} on={0} size={it.wide ? 96 : 84} measure={0} />
								</div>
							</div>
						);
					}
					return (
						<div key={it.kind} style={{gridColumn: it.wide ? '1 / span 2' : undefined, opacity: s, scale: String(1.22 - 0.22 * s), rotate: `${(1 - s) * (i % 2 ? 3 : -3)}deg`}}>
							<Card color={it.kind === 'pole' ? COLORS.signal : ACCENT.no} style={{height: it.wide ? 150 : 190, boxSizing: 'border-box', padding: it.wide ? '10px 20px' : '12px 14px', display: 'flex', flexDirection: it.wide ? 'row' : 'column', alignItems: 'center', justifyContent: it.wide ? 'flex-start' : 'center', gap: it.wide ? 20 : 4}} glow={0.25 * s}>
								<RuleGlyph kind={it.kind} on={strike} size={it.wide ? 116 : 96} measure={measure} />
								<div style={{textAlign: it.wide ? 'left' : 'center'}}>
									<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: it.wide ? 40 : 31, lineHeight: 1.05, color: COLORS.text, whiteSpace: 'nowrap'}}>{it.title}</div>
									<div style={{marginTop: 2, fontFamily: FONTS.body, fontWeight: 700, fontSize: it.wide ? 26 : 23, color: COLORS.textMuted, whiteSpace: 'nowrap'}}>{it.sub}</div>
								</div>
							</Card>
						</div>
					);
				})}
			</div>
			<SourceBar text={RULES_SOURCE} at={6} />
			<Sfx name="click" at={0} volume={0.35} />
			<Sfx name="click" at={atAuflagen - 2} volume={0.4} />
			{items.map((it) => (
				<Sfx key={it.kind} name="stamp" at={it.at - 2} volume={0.45} />
			))}
			<Sfx name="tick" at={atZwei - 4} volume={0.55} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 5: jetzt fünf Versammlungen (neu: Bundesbewegung) */

export const FiveScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const v1 = cue(cues, 'v1', 0);
	const v2 = cue(cues, 'v2', 110);
	const atNeu = wordFrame(cues, 'Neu', v1.from);
	const atInnen = wordFrame(cues, 'Innenministerium', atNeu + 20);
	const atFuenf = wordFrame(cues, 'fünf', atInnen + 30);
	const atDarunter = wordFrame(cues, 'Darunter', v2.from);
	const atBund = wordFrame(cues, 'Bundesbewegung', atDarunter + 20);
	const at15 = wordFrame(cues, '15', atBund + 20);
	const atHbf = wordFrame(cues, 'Hauptbahnhof', at15 + 16);
	const atBock = wordFrame(cues, 'Bockenheim', atHbf + 14);
	const at1500 = wordFrame(cues, '1.500', atBock + 20);
	const newOn = springIn({frame, fps, delay: atFuenf - 4, damping: 11, stiffness: 160});
	const reveal = ASSEMBLIES.map((a, i) => (a.isNew ? newOn : interpolate(frame, [2 + i * 3, 12 + i * 3], [0, 1], clamp)));
	const pulse = ASSEMBLIES.map((_, i) => interpolate(frame, [atFuenf + 6 + i * 3, atFuenf + 18 + i * 3], [0, 1], clamp) % 1);
	const flip = interpolate(frame, [atFuenf - 4, atFuenf + 6], [0, 1], clamp);
	const draw = interpolate(frame, [atHbf - 4, atBock + 8], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const zoomOut = interpolate(frame, [0, durationInFrames], [1.04, 1]);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{scale: String(zoomOut), opacity: 0.5}}>
				<NightCity mood={blendMood(MOODS.calm, MOODS.dusk, 0.4)} progress={0.5 + frame / 3000} litRatio={0.35} bokeh={8} showPromenade={false} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.95) 0%, rgba(4,6,20,0.82) 40%, rgba(4,6,20,0.78) 70%, rgba(4,6,20,0.94) 100%)'}} />
			<SceneTag text="FREITAG · 20.11." color={ORANGE} icon="clock" />
			{/* Kopf: 4 → 5 Versammlungen */}
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 378, display: 'flex', alignItems: 'center', gap: 20}}>
				<div style={{position: 'relative', width: 128, height: 140, borderRadius: 22, background: 'rgba(10,12,32,0.95)', border: `3px solid ${flip > 0.5 ? ORANGE : 'rgba(255,255,255,0.35)'}`, boxShadow: `0 0 ${40 * flip}px ${withAlpha(ORANGE, 0.5)}`, overflow: 'hidden', flexShrink: 0}}>
					<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 112, color: COLORS.textMuted, translate: `0 ${-flip * 140}px`}}>4</div>
					<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 112, color: ORANGE, translate: `0 ${(1 - flip) * 140}px`}}>5</div>
				</div>
				<div>
					<div style={{display: 'flex', alignItems: 'center', gap: 10, opacity: frame >= atNeu - 4 ? 1 : 0.0}}>
						<Chip kind="NEU SEIT 18.11." size={17} />
						{frame >= atInnen - 4 ? <Chip kind="LAUT INNENMINISTERIUM" size={17} /> : null}
					</div>
					<div style={{marginTop: 8, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 56, lineHeight: 1, color: COLORS.text, whiteSpace: 'nowrap'}}>VERSAMMLUNGEN</div>
					<div style={{marginTop: 4, fontFamily: FONTS.body, fontWeight: 700, fontSize: 27, color: COLORS.textMuted, whiteSpace: 'nowrap'}}>am Freitag zwischen 10 und 21:30 Uhr</div>
				</div>
			</div>
			<div style={{position: 'absolute', left: LAYOUT.left, top: 560}}>
				<DayTimeline events={ASSEMBLIES} width={LAYOUT.width} size={76} reveal={reveal} pulse={pulse} highlight={frame >= atFuenf - 4 ? 'bund' : null} />
			</div>
			{/* NEU-Plakette über der 15-Uhr-Markierung */}
			{frame >= atFuenf - 4 ? (
				<div style={{position: 'absolute', left: LAYOUT.left + (LAYOUT.width * 3.5) / 5 - 40, top: 532, width: 80, textAlign: 'center', opacity: Math.min(1, newOn * 2), scale: String(0.6 + 0.4 * newOn), rotate: '-8deg'}}>
					<span style={{padding: '3px 10px', borderRadius: 8, background: ORANGE, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 20, color: ACCENT.ink}}>NEU</span>
				</div>
			) : null}
			{/* Karte: Aufzug „GenZ regelt Bundesbewegung“ */}
			<In at={atDarunter - 4} dy={40} style={{left: LAYOUT.left, top: 790, width: LAYOUT.width}}>
				<Card color={ORANGE} style={{padding: '14px 22px 14px', boxSizing: 'border-box'}} glow={0.35}>
					<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
						<span style={{padding: '3px 10px', borderRadius: 8, background: ORANGE, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 20, color: ACCENT.ink}}>{BUND.kind}</span>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: COLORS.text, fontVariantNumeric: 'tabular-nums', opacity: frame >= at15 - 4 ? 1 : 0.35}}>{BUND.time}</span>
						<Chip kind="LAUT INNENMINISTERIUM" size={14} style={{marginLeft: 'auto'}} />
					</div>
					<div style={{marginTop: 6, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, lineHeight: 1.05, color: ORANGE, whiteSpace: 'nowrap', scale: String(1 + 0.04 * Math.sin(interpolate(frame, [atBund - 2, atBund + 12], [0, 1], clamp) * Math.PI)), transformOrigin: '0 50%'}}>„GENZ REGELT BUNDESBEWEGUNG“</div>
					{/* Start → Ziel (schematisch) */}
					<div style={{position: 'relative', marginTop: 12, height: 116}}>
						<svg width={LAYOUT.width - 44} height={116} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
							<line x1={30} y1={34} x2={30 + (LAYOUT.width - 104) * draw} y2={34} stroke={ORANGE} strokeWidth={6} strokeDasharray="16 12" strokeLinecap="round" />
							{draw > 0.96 ? <path d={`M${LAYOUT.width - 92} 20 L${LAYOUT.width - 70} 34 L${LAYOUT.width - 92} 48`} fill="none" stroke={ORANGE} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" /> : null}
							<circle cx={30} cy={34} r={14} fill={ORANGE} stroke="#FFFFFF" strokeWidth={3} opacity={frame >= atHbf - 6 ? 1 : 0.3} />
							<circle cx={LAYOUT.width - 74} cy={34} r={14} fill={ORANGE} stroke="#FFFFFF" strokeWidth={3} opacity={draw > 0.96 ? 1 : 0} />
						</svg>
						<div style={{position: 'absolute', left: 0, top: 56, opacity: frame >= atHbf - 6 ? 1 : 0.3}}>
							<div style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 19, letterSpacing: 1.5, color: ORANGE}}>START</div>
							<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 27, color: COLORS.text, whiteSpace: 'nowrap'}}>{BUND.from.name} <span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 23, color: COLORS.textMuted}}>· {BUND.from.hint}</span></div>
						</div>
						<div style={{position: 'absolute', right: 0, top: 56, textAlign: 'right', opacity: draw > 0.96 ? 1 : 0}}>
							<div style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 19, letterSpacing: 1.5, color: ORANGE}}>ZIEL</div>
							<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 27, color: COLORS.text, whiteSpace: 'nowrap'}}>{BUND.to.name}</div>
							<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 23, color: COLORS.textMuted}}>{BUND.to.hint}</div>
						</div>
					</div>
					<div style={{marginTop: 8, display: 'flex', alignItems: 'center', gap: 14}}>
						<P2Icon name="users" size={40} color={ORANGE} stroke={2.4} />
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, color: COLORS.text}}>
							BIS <CountUp value={1500} at={atDarunter - 4} dur={Math.max(12, at1500 + 4 - (atDarunter - 4))} />
						</span>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, color: ORANGE}}>ERWARTET</span>
					</div>
				</Card>
			</In>
			<In at={atBock + 8} dy={12} style={{left: LAYOUT.left, top: 1104, width: LAYOUT.width}}>
				<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, lineHeight: 1.3, color: COLORS.textMuted}}>
					Start und Ziel laut Innenministerium · Verlauf nicht veröffentlicht
					<br />
					Eigene Versammlung – nicht die Kundgebung an der Weseler Werft
				</div>
			</In>
			<SourceBar text={BUND.source} at={6} />
			<Sfx name="whoosh" at={0} volume={0.3} />
			{ASSEMBLIES.filter((a) => !a.isNew).map((a, i) => (
				<Sfx key={a.id} name="tick" at={2 + i * 3} volume={0.4} />
			))}
			<Sfx name="click" at={atNeu - 4} volume={0.45} />
			<Sfx name="pop" at={atFuenf - 4} volume={0.6} />
			<Sfx name="stamp" at={atFuenf + 2} volume={0.45} />
			<Sfx name="paper" at={atDarunter - 4} volume={0.4} />
			<Sfx name="blip" at={atHbf - 4} volume={0.5} />
			<Sfx name="whoosh" at={atHbf} volume={0.25} />
			<Sfx name="blip" at={atBock} volume={0.5} />
			<Sfx name="softImpact" at={at1500 + 2} volume={0.55} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 6: Sicherheits-Pressekonferenz (Nachrichtengrafik) */

const ForceBar: React.FC<{label: string; value: string; color: string; fill: number; on: number; strong?: boolean}> = ({label, value, color, fill, on, strong}) => (
	<div style={{display: 'flex', alignItems: 'center', gap: 14, opacity: 0.25 + 0.75 * on}}>
		<div style={{width: 150, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 27, color: strong ? COLORS.text : COLORS.textMuted, whiteSpace: 'nowrap'}}>{label}</div>
		<div style={{position: 'relative', flex: 1, height: 46, borderRadius: 12, background: 'rgba(255,255,255,0.07)', overflow: 'hidden'}}>
			<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${fill * 100}%`, borderRadius: 12, background: `linear-gradient(90deg, ${withAlpha(color, 0.65)}, ${color})`, boxShadow: `0 0 24px ${withAlpha(color, 0.5)}`}} />
			<div style={{position: 'absolute', left: 16, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: '#FFFFFF', textShadow: '0 2px 8px rgba(0,0,0,0.7)', whiteSpace: 'nowrap'}}>{value}</div>
		</div>
	</div>
);

export const PressScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const p1 = cue(cues, 'p1', 0);
	const p2 = cue(cues, 'p2', 130);
	const p3 = cue(cues, 'p3', 290);
	const atPolizei = wordFrame(cues, 'Polizei', p1.from);
	const at2000 = wordFrame(cues, '2.000', atPolizei + 20);
	const atHallo = wordFrame(cues, 'Halloween', at2000 + 30);
	const at1300 = wordFrame(cues, '1.300', atHallo + 20);
	const at49 = wordFrame(cues, '49', p2.from + 6);
	const atAuf = wordFrame(cues, 'Aufenthaltsverbote', at49 + 16);
	const at36 = wordFrame(cues, '36', atAuf + 30);
	const atMeld = wordFrame(cues, 'Meldeauflagen', at36 + 30);
	const atBedarf = wordFrame(cues, 'Bedarf', p3.from + 6);
	const atZeil = wordFrame(cues, 'Zeil', atBedarf + 20);
	const podium = [0, 1, 2].map((i) => interpolate(frame, [2 + i * 4, 14 + i * 4], [0, 1], {...clamp, easing: EASE_OUT}));
	const nowFill = interpolate(frame, [at2000 - 14, at2000 + 6], [0, 1], {...clamp, easing: EASE_OUT});
	const beforeFill = interpolate(frame, [at1300 - 14, at1300 + 6], [0, 0.65], {...clamp, easing: EASE_OUT});
	const drift = interpolate(frame, [0, durationInFrames], [0, 1]);
	const flash = interpolate(frame, [0, 30], [1, 0.3], clamp);
	return (
		<AbsoluteFill style={{backgroundColor: '#060920', overflow: 'hidden'}}>
			<AbsoluteFill style={{background: `radial-gradient(ellipse 80% 30% at 50% ${32 + drift * 4}%, ${withAlpha(BLUE, 0.16)}, rgba(0,0,0,0) 70%), linear-gradient(#0C1238, #05071A)`}} />
			{/* Laufband-Linien (Nachrichtenlook) */}
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: 0.08}}>
				{new Array(16).fill(0).map((_, i) => (
					<line key={i} x1={-200 + ((i * 140 + frame * 3) % 1500)} y1={0} x2={-500 + ((i * 140 + frame * 3) % 1500)} y2={1920} stroke="#8FA8FF" strokeWidth={2} />
				))}
			</svg>
			<SceneTag text="PRESSEKONFERENZ · 18.11." color={BLUE} icon="megaphone" />
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 376}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
					<span style={{display: 'inline-flex', alignItems: 'center', gap: 8, padding: '3px 12px', borderRadius: 8, background: RED, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 20, letterSpacing: 2, color: '#FFFFFF'}}>
						<span style={{width: 10, height: 10, borderRadius: 5, background: '#FFFFFF', opacity: 0.5 + 0.5 * Math.sin(frame / 4)}} />
						UPDATE
					</span>
					<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 24, color: COLORS.textMuted, fontVariantNumeric: 'tabular-nums'}}>{PRESS.date}</span>
				</div>
				<div style={{marginTop: 4, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 50, lineHeight: 1, color: COLORS.text, whiteSpace: 'nowrap'}}>{PRESS.title}</div>
			</div>
			<div style={{position: 'absolute', left: LAYOUT.left, top: 486}}>
				<PressPodium width={LAYOUT.width} on={podium} flash={flash} />
			</div>
			<div style={{position: 'absolute', right: 1080 - LAYOUT.left - LAYOUT.width + 10, top: 676}}>
				<Chip kind="ILLUSTRATION" size={14} />
			</div>
			{/* Einsatzkräfte */}
			<In at={atPolizei - 4} dy={24} style={{left: LAYOUT.left, top: 730, width: LAYOUT.width}}>
				<Card color={BLUE} style={{padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: 10}} glow={0.25}>
					<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
						<P2Icon name="shield" size={34} color={BLUE} stroke={2.4} />
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: COLORS.text}}>{PRESS.forces.label}</span>
						<Chip kind="LAUT INNENMINISTERIUM" size={14} style={{marginLeft: 'auto'}} />
					</div>
					<ForceBar label="20.11." value={nowFill > 0.05 ? `ÜBER ${Math.round(2000 * nowFill).toLocaleString('de-DE')}` : ''} color={RED} fill={nowFill} on={nowFill > 0 ? 1 : 0} strong />
					<ForceBar label="31.10." value={beforeFill > 0.03 ? Math.round(1300 * (beforeFill / 0.65)).toLocaleString('de-DE') : ''} color="#7C8BC8" fill={beforeFill} on={beforeFill > 0 ? 1 : 0} />
				</Card>
			</In>
			{/* 49 / 36 */}
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 930, display: 'flex', gap: 16}}>
				{[
					{at: at49, val: PRESS.bans.count, label: 'AUFENTHALTS-\nVERBOTE', sub: 'gegen 49 Personen', hi: atAuf},
					{at: at36, val: PRESS.reports.count, label: 'MELDE-\nAUFLAGEN', sub: 'gegen 36 Tatverdächtige', hi: atMeld},
				].map((c, i) => (
					<In key={i} at={c.at - 6} dy={30} style={{position: 'relative', flex: 1}}>
						<Card color={COLORS.signal} style={{padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 14, height: 140, boxSizing: 'border-box'}} glow={0.25}>
							<CountUp value={c.val} at={c.at - 6} dur={10} style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 84, lineHeight: 1, color: COLORS.signal, minWidth: 104, textAlign: 'center'}} />
							<div>
								<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 27, lineHeight: 1.05, color: COLORS.text, whiteSpace: 'pre-line', opacity: frame >= c.hi - 6 ? 1 : 0.35}}>{c.label}</div>
								<div style={{marginTop: 4, fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted, whiteSpace: 'nowrap'}}>{c.sub}</div>
							</div>
						</Card>
					</In>
				))}
			</div>
			{/* Zeil */}
			<In at={atBedarf - 4} dy={24} style={{left: LAYOUT.left, top: 1088, width: LAYOUT.width}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px', borderRadius: 18, background: 'rgba(10,12,32,0.95)', border: `2.5px solid ${withAlpha(BLUE, 0.8)}`, boxShadow: `0 0 ${frame >= atZeil - 2 ? 30 : 0}px ${withAlpha(BLUE, 0.4)}`}}>
					<P2Icon name="alert" size={36} color={BLUE} stroke={2.4} />
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, lineHeight: 1.05, color: COLORS.text, whiteSpace: 'nowrap'}}>
						ZEIL: BEI BEDARF <span style={{color: frame >= atZeil - 2 ? BLUE : COLORS.text}}>ALLE ZUGÄNGE</span> KONTROLLIERT
					</div>
				</div>
			</In>
			<SourceBar text={PRESS.source} at={6} />
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="paper" at={2} volume={0.4} />
			<Sfx name="click" at={atPolizei - 4} volume={0.4} />
			<Sfx name="softImpact" at={at2000 + 2} volume={0.6} />
			<Sfx name="tick" at={at1300 - 4} volume={0.5} />
			<Sfx name="pop" at={at49 - 6} volume={0.45} />
			<Sfx name="pop" at={at36 - 6} volume={0.45} />
			<Sfx name="click" at={atBedarf - 4} volume={0.45} />
			<Sfx name="blip" at={atZeil - 2} volume={0.45} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 7: Fazit + Frage */

export const FinalScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const f1 = cue(cues, 'f1', 0);
	const q1 = cue(cues, 'q1', 70);
	const atAbgesagt = wordFrame(cues, 'abgesagt', f1.from + 20);
	const atAnders = wordFrame(cues, 'anders', atAbgesagt + 20);
	const atHaltet = wordFrame(cues, 'haltet', q1.from + 2);
	const stamp = useSpring(atAbgesagt - 4, 10, 220);
	const changed = useSpring(atAnders - 4, 12, 200);
	const drift = interpolate(frame, [0, durationInFrames], [0, 1]);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{scale: String(1.08 - drift * 0.05), transformOrigin: '50% 70%'}}>
				<NightCity mood={blendMood(MOODS.calm, MOODS.dusk, 0.6)} progress={0.6 + drift * 0.2} litRatio={0.45} bokeh={12} showMoon />
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.95) 0%, rgba(4,6,20,0.8) 34%, rgba(4,6,20,0.62) 60%, rgba(4,6,20,0.9) 100%)'}} />
			<SceneTag text="HEISST:" color={GREEN} icon="check" />
			{/* Kurz-Rückblick */}
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 384, display: 'flex', flexWrap: 'wrap', gap: 10}}>
				{[
					{t: '14–16:30 · WESELER WERFT', c: RED},
					{t: '5 VERSAMMLUNGEN', c: ORANGE},
					{t: 'ÜBER 2.000 EINSATZKRÄFTE', c: BLUE},
				].map((x, i) => (
					<div key={i} style={{opacity: interpolate(frame, [2 + i * 4, 10 + i * 4], [0, 1], clamp), translate: `0 ${interpolate(frame, [2 + i * 4, 10 + i * 4], [16, 0], clamp)}px`, padding: '6px 14px', borderRadius: 12, background: 'rgba(8,10,28,0.9)', border: `2px solid ${withAlpha(x.c, 0.85)}`, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 25, color: COLORS.text, whiteSpace: 'nowrap'}}>
						{x.t}
					</div>
				))}
			</div>
			{/* Stempel */}
			{frame >= atAbgesagt - 5 ? (
				<div style={{position: 'absolute', left: 0, right: 150, top: 560, display: 'flex', justifyContent: 'center', opacity: Math.min(1, stamp * 2), scale: String(1.7 - 0.7 * stamp), rotate: '-5deg'}}>
					<div style={{padding: '18px 30px', borderRadius: 20, border: `7px solid ${GREEN}`, background: 'rgba(6,20,16,0.88)', boxShadow: `0 0 50px ${withAlpha(GREEN, 0.35)}`, display: 'flex', alignItems: 'center', gap: 16}}>
						<P2Icon name="check" size={70} color={GREEN} stroke={3.2} />
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 72, lineHeight: 1, color: COLORS.text, whiteSpace: 'nowrap'}}>NICHT ABGESAGT</span>
					</div>
				</div>
			) : null}
			{frame >= atAnders - 5 ? (
				<div style={{position: 'absolute', left: 0, right: 150, top: 742, display: 'flex', justifyContent: 'center', opacity: Math.min(1, changed * 2), translate: `0 ${(1 - changed) * 30}px`}}>
					<div style={{padding: '10px 26px', borderRadius: 16, background: COLORS.signal, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 56, color: ACCENT.ink, whiteSpace: 'nowrap', boxShadow: `0 16px 40px ${withAlpha(COLORS.signal, 0.3)}`}}>ABLAUF GEÄNDERT</div>
				</div>
			) : null}
			{/* Frage */}
			<In at={atHaltet - 6} dy={40} style={{left: LAYOUT.left, top: 920, width: LAYOUT.width - 60}}>
				<div style={{position: 'relative', padding: '18px 24px', borderRadius: 26, background: 'rgba(250,250,255,0.97)', boxShadow: '0 24px 60px rgba(0,0,0,0.5)'}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
						<P2Icon name="chat" size={52} color={RED} stroke={2.6} />
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, lineHeight: 1.08, color: ACCENT.ink}}>{FINAL.question}</div>
					</div>
					<div style={{marginTop: 8, fontFamily: FONTS.body, fontWeight: 700, fontSize: 25, color: '#4A5070'}}>Schreibt es in die Kommentare</div>
					<div style={{position: 'absolute', left: 60, bottom: -22, width: 0, height: 0, borderLeft: '22px solid transparent', borderRight: '22px solid transparent', borderTop: '24px solid rgba(250,250,255,0.97)'}} />
				</div>
			</In>
			<SourceBar text={`${STAND} · Stadt Frankfurt, Hessisches Innenministerium`} at={8} />
			<Sfx name="whoosh" at={0} volume={0.3} />
			<Sfx name="stamp" at={atAbgesagt - 2} volume={0.65} />
			<Sfx name="softImpact" at={atAbgesagt} volume={0.45} />
			<Sfx name="pop" at={atAnders - 4} volume={0.5} />
			<Sfx name="notify" at={atHaltet - 6} volume={0.45} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 8: Abo-Aufruf (offizielles Logo) */

export const OutroScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const c = cue(cues, 'cta', 0);
	const atCta = Math.max(0, c.from - 2);
	const cta = springIn({frame, fps, delay: atCta, damping: 13, stiffness: 180});
	const pull = interpolate(frame, [0, durationInFrames], [0, 1], {...clamp, easing: EASE_OUT});
	const press = frame >= atCta + 24 ? interpolate(frame, [atCta + 24, atCta + 30, atCta + 36], [1, 0.9, 1], clamp) : 1;
	const followed = frame >= atCta + 28;
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{scale: String(1.15 - pull * 0.15), transformOrigin: '50% 70%'}}>
				<NightCity mood={MOODS.dusk} progress={pull} litRatio={0.42} showMoon bokeh={16} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.94) 0%, rgba(4,6,20,0.72) 50%, rgba(4,6,20,0.5) 75%, rgba(4,6,20,0.8) 100%)'}} />
			<div style={{position: 'absolute', left: 64, width: 866, top: 470, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, opacity: Math.min(1, cta * 2), translate: `0 ${(1 - cta) * 50}px`}}>
				<div style={{position: 'relative'}}>
					<BrandLogo size={250} ring={6 + Math.sin(frame / 4) * 3} />
					<div style={{position: 'absolute', left: '50%', bottom: -26, translate: '-50% 0', scale: String(press), width: 68, height: 68, borderRadius: 34, background: followed ? ACCENT.yes : RED, border: '4px solid #FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 24px rgba(0,0,0,0.5)'}}>
						<P2Icon name={followed ? 'check' : 'plus'} size={38} color="#FFFFFF" stroke={3.4} />
					</div>
				</div>
				<span style={{marginTop: 12, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 54, color: COLORS.text}}>{handleWithAt()}</span>
				<div style={{padding: '12px 30px 14px', borderRadius: 20, background: RED, boxShadow: '0 20px 50px rgba(255,59,78,0.35)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 42, color: '#FFFFFF', scale: String(followed ? 1 + 0.035 * Math.sin((frame - atCta - 28) / 5) : 1)}}>{CTA.title}</div>
				<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 24, letterSpacing: 2.5, color: COLORS.signal}}>{CTA.sub}</span>
			</div>
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 1180, textAlign: 'center', fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, color: COLORS.textMuted}}>{STAND} · Angaben laut Stadt Frankfurt und Hessischem Innenministerium</div>
			<Sfx name="pop" at={atCta} volume={0.6} />
			<Sfx name="click" at={atCta + 26} volume={0.6} />
		</AbsoluteFill>
	);
};

/** Für Tests/Doku: alle Quellen-IDs, die im Bild genannt werden. */
export const SCENE_SOURCE_IDS = SOURCES.map((s) => s.id);
