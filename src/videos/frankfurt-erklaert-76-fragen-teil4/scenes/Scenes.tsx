import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {type CityCameraKeyframe, type CityMapData, CityStreetMap, useCityCamera} from '../../../components/map/CityStreetMap';
import innenstadt from '../../../data/maps/frankfurt-innenstadt.json';
import {clamp, EASE_IN_OUT, EASE_OUT, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {handleWithAt} from '../../../theme/brand';
import {COLORS, FONTS} from '../../../theme/tokens';
import {BrandAvatar} from '../../../formats/frankfurt-erklaert/Branding';
import {Equation, Pop, SourceBar} from '../../../formats/frankfurt-erklaert/components';
import {ACCENT, FORMAT} from '../../../formats/frankfurt-erklaert/theme';
import {Landtag} from '../../../formats/frankfurt-erklaert/visuals/Politics';
import {blendMood, MOODS, NightCity} from '../../frankfurt-2026-11-20-ausblick/premium/NightCity';
import {Storefront} from '../../frankfurt-2026-11-20-ausblick/premium/Storefront';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {ANSWERS, COVER, CTA, DAMAGE, JUSTICE, SPOTS, SUMMARY, WEAPONS} from '../content';
import {TEIL4_COVER_LAYOUT} from '../cover-layout';

const MAP = innenstadt as unknown as CityMapData;

/** Farben der vier Antworten (Serienfarben). */
export const ACOLOR = {'01': ACCENT.info, '02': ACCENT.signal, '03': ACCENT.no, '04': ACCENT.law} as const;
type ANum = keyof typeof ACOLOR;
const de = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/* ------------------------------------------------------------------ Icons */

type T4IconName = 'pin' | 'store' | 'bag' | 'doc' | 'person' | 'shield' | 'scales' | 'check' | 'alley' | 'crowd' | 'shift' | 'euro' | 'lock' | 'plus';

const T4Icon: React.FC<{name: T4IconName; size?: number; color?: string; stroke?: number}> = ({name, size = 36, color = '#FFFFFF', stroke = 2.2}) => {
	const p = {fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
	const body = (() => {
		switch (name) {
			case 'pin':
				return (
					<>
						<path d="M12 21.5s-7-6.2-7-11.5a7 7 0 0 1 14 0c0 5.3-7 11.5-7 11.5z" {...p} />
						<circle cx={12} cy={10} r={2.6} {...p} />
					</>
				);
			case 'store':
				return (
					<>
						<path d="M3.5 9 5 3.5h14L20.5 9M3.5 9h17M3.5 9c0 1.7 1.4 2.8 2.9 2.8S9.3 10.7 9.3 9c0 1.7 1.3 2.8 2.7 2.8S14.7 10.7 14.7 9c0 1.7 1.4 2.8 2.9 2.8s2.9-1.1 2.9-2.8" {...p} />
						<path d="M5 12v8.5h14V12M9.5 20.5v-5h5v5" {...p} />
					</>
				);
			case 'bag':
				return (
					<>
						<path d="M5 7h14l-1.2 13.5H6.2L5 7z" {...p} />
						<path d="M9 7V5.5a3 3 0 0 1 6 0V7M8.5 12.5l2.3 2.3 4.7-4.6" {...p} />
					</>
				);
			case 'doc':
				return (
					<>
						<path d="M6 2.5h8l4 4v15H6z" {...p} />
						<path d="M14 2.5v4h4M9 11h6M9 14.5h6M9 18h4" {...p} />
					</>
				);
			case 'person':
				return (
					<>
						<circle cx={12} cy={7} r={3.6} {...p} />
						<path d="M4.5 21v-1.5A7.5 7.5 0 0 1 19.5 19.5V21" {...p} />
					</>
				);
			case 'shield':
				return (
					<>
						<path d="M12 2.5 20 5.5v6c0 5-3.5 8.7-8 10-4.5-1.3-8-5-8-10v-6l8-3z" {...p} />
						<path d="m8.5 12 2.5 2.5 4.5-5" {...p} />
					</>
				);
			case 'scales':
				return <path d="M12 3v18M7 21h10M5 7h14M5 7l-3 7a3 3 0 0 0 6 0L5 7zM19 7l-3 7a3 3 0 0 0 6 0l-3-7z" {...p} />;
			case 'check':
				return <path d="m4.5 12.5 5 5 10-11" {...p} />;
			case 'alley':
				return <path d="M3 21V4h5v17M16 21V4h5v17M8 21l2-17h4l2 17M11.5 8h1M11 13h2M10.5 18h3" {...p} />;
			case 'crowd':
				return (
					<>
						<circle cx={12} cy={7} r={3} {...p} />
						<path d="M6.5 20v-2.5A5.5 5.5 0 0 1 17.5 17.5V20" {...p} />
						<circle cx={4.5} cy={9.5} r={2.2} {...p} />
						<circle cx={19.5} cy={9.5} r={2.2} {...p} />
						<path d="M1.5 19v-1.5a3.5 3.5 0 0 1 4-3.4M22.5 19v-1.5a3.5 3.5 0 0 0-4-3.4" {...p} />
					</>
				);
			case 'shift':
				return <path d="M3 17c4-8 10-11 17-11M15 2.5 20 6l-3.5 5" {...p} />;
			case 'euro':
				return (
					<>
						<path d="M18 6.5A7 7 0 1 0 18 17.5" {...p} />
						<path d="M4 10.5h9M4 13.5h9" {...p} />
					</>
				);
			case 'lock':
				return (
					<>
						<rect x={4.5} y={10.5} width={15} height={10.5} rx={2} {...p} />
						<path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" {...p} />
					</>
				);
			case 'plus':
				return <path d="M12 5v14M5 12h14" {...p} />;
			default:
				return null;
		}
	})();
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" style={{flexShrink: 0}}>
			{body}
		</svg>
	);
};

/* ------------------------------------------------------------------ Bausteine */

const RollNumber: React.FC<{from: number; to: number; at: number; dur?: number; size: number; color: string}> = ({from, to, at, dur = 18, size, color}) => {
	const frame = useCurrentFrame();
	const v = interpolate(frame, [at, at + dur], [from, to], {...clamp, easing: EASE_OUT});
	const settle = interpolate(frame, [at + dur - 2, at + dur + 8], [0, 1], clamp);
	return (
		<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: size, lineHeight: 0.9, letterSpacing: -size * 0.035, color, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', textShadow: `0 0 ${24 + 30 * Math.sin(settle * Math.PI)}px ${withAlpha(color, 0.55)}, 0 18px 50px rgba(0,0,0,0.6)`}}>
			{de(v)}
		</span>
	);
};

const Tag: React.FC<{num: ANum; text: string; at?: number}> = ({num, text, at = 0}) => (
	<Pop at={at} dy={20}>
		<div style={{display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 16px 6px 6px', borderRadius: 12, background: 'rgba(8,10,28,0.9)', border: `2px solid ${ACOLOR[num]}`, boxShadow: `0 8px 24px ${withAlpha(ACOLOR[num], 0.25)}`}}>
			<span style={{padding: '2px 10px', borderRadius: 8, background: ACOLOR[num], fontFamily: FONTS.heading, fontWeight: 900, fontSize: 24, color: ACCENT.ink}}>{num}</span>
			<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 24, letterSpacing: 1.5, color: COLORS.text}}>{text}</span>
		</div>
	</Pop>
);

type StatusKind = 'OFFEN' | 'OFFIZIELL' | 'BERICHT' | 'POSITION' | 'SYMBOLISCH';
const STATUS_COLOR: Record<StatusKind, string> = {OFFEN: ACCENT.no, OFFIZIELL: ACCENT.info, BERICHT: '#FFB15C', POSITION: ACCENT.law, SYMBOLISCH: '#9AA6CC'};
const Status: React.FC<{kind: StatusKind; size?: number}> = ({kind, size = 22}) => {
	const c = STATUS_COLOR[kind];
	return <span style={{display: 'inline-block', padding: `${size * 0.2}px ${size * 0.5}px`, borderRadius: size * 0.4, background: withAlpha(c, 0.18), border: `2px solid ${c}`, fontFamily: FONTS.heading, fontWeight: 900, fontSize: size, letterSpacing: 1.5, color: c, whiteSpace: 'nowrap'}}>{kind}</span>;
};

const Headline: React.FC<{lines: readonly string[]; at?: number; color?: string; size?: number}> = ({lines, at = 0, color = COLORS.text, size = 56}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = springIn({frame, fps, delay: at, damping: 15, stiffness: 180});
	return (
		<div style={{opacity: Math.min(1, s * 2), translate: `${(1 - s) * -40}px 0`}}>
			{lines.map((l, i) => (
				<div key={l} style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: size, lineHeight: 1.02, color: i === lines.length - 1 ? color : COLORS.text, textShadow: '0 8px 30px rgba(0,0,0,0.8)'}}>
					{l}
				</div>
			))}
		</div>
	);
};

const Card: React.FC<{children: React.ReactNode; color: string; style?: React.CSSProperties; glow?: number}> = ({children, color, style, glow = 0.2}) => (
	<div style={{borderRadius: 24, background: 'linear-gradient(160deg, rgba(20,24,58,0.96), rgba(9,11,30,0.96))', border: `2.5px solid ${withAlpha(color, 0.85)}`, boxShadow: `0 28px 60px rgba(0,0,0,0.55), 0 0 44px ${withAlpha(color, glow)}, inset 0 1px 0 rgba(255,255,255,0.08)`, ...style}}>{children}</div>
);

const IconOrb: React.FC<{name: T4IconName; color: string; size?: number}> = ({name, color, size = 72}) => (
	<div style={{width: size, height: size, borderRadius: size / 2, background: `radial-gradient(circle at 35% 30%, ${withAlpha(color, 0.35)}, ${withAlpha(color, 0.12)})`, border: `2px solid ${withAlpha(color, 0.7)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
		<T4Icon name={name} size={size * 0.56} color={color} />
	</div>
);

const NightBg: React.FC<{progress: number; alert?: number; blur?: number}> = ({progress, alert = 0.25, blur = 0}) => (
	<AbsoluteFill style={{filter: blur ? `blur(${blur}px) brightness(0.6)` : undefined}}>
		<NightCity mood={blendMood(MOODS.dusk, MOODS.alert, alert)} progress={progress} litRatio={0.4} bokeh={12} showPromenade={false} />
		<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.95) 0%, rgba(4,6,20,0.66) 32%, rgba(4,6,20,0.42) 60%, rgba(4,6,20,0.8) 100%)'}} />
	</AbsoluteFill>
);

/* ------------------------------------------------------------------ Szene 1: Titelbild */

/**
 * Titelbild Teil 4 (Video-Frame 0 und PNG): Serientitel, gelbe 76, „TEIL 4“, Landtag vor der Skyline,
 * rote Karte „4 WEITERE ANTWORTEN“ – Layout nach COVER_ZONE, noch etwas tiefer als Teil 3 (TEIL4_COVER_LAYOUT).
 * `morph` 0 → 1: Aus der 76 werden die vier Antwort-Kacheln mit Haken; die Titelzeilen bleiben.
 */
export const Teil4Cover: React.FC<{morph?: number; morphAt?: number; thumbnail?: boolean}> = ({morph = 0, morphAt = 0, thumbnail = false}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const L = TEIL4_COVER_LAYOUT;
	const m = interpolate(morph, [0, 1], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const twinkle = (i: number) => 0.4 + 0.6 * Math.abs(Math.sin(frame / 18 + i));
	const icon: T4IconName[] = ['pin', 'store', 'bag', 'scales'];
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse 120% 55% at 50% 54%, #2E2A70 0%, #141748 50%, #070A22 100%)'}} />
			<AbsoluteFill>
				<NightCity mood={blendMood(MOODS.dusk, MOODS.alert, 0.28)} progress={0.52 + m * 0.1} litRatio={0.42} bokeh={10} showPromenade={false} showMoon />
			</AbsoluteFill>
			<svg width={1080} height={440} style={{position: 'absolute', left: 0, top: 0}}>
				{new Array(40).fill(0).map((_, i) => (
					<circle key={i} cx={random(`t4s-x-${i}`) * 1080} cy={24 + random(`t4s-y-${i}`) * 400} r={1 + random(`t4s-r-${i}`) * 2} fill="#FFFFFF" opacity={twinkle(i) * 0.7} />
				))}
			</svg>
			<div style={{position: 'absolute', left: (1080 - L.landtagWidth) / 2, top: L.landtagTop + m * 40, opacity: 0.92 - m * 0.35, scale: String(1 - m * 0.06), WebkitMaskImage: 'linear-gradient(#000 70%, transparent 100%)', maskImage: 'linear-gradient(#000 70%, transparent 100%)'}}>
				<Landtag width={L.landtagWidth} />
				<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(rgba(14,18,54,0.25), rgba(14,18,54,0.05))'}} />
			</div>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.55) 0%, rgba(4,6,20,0.1) 16%, rgba(4,6,20,0) 40%, rgba(4,6,20,0.2) 53%, rgba(4,6,20,0.82) 63%, rgba(4,6,20,0.9) 73%, rgba(4,6,20,0.75) 100%)'}} />
			{/* Serientitel */}
			<div style={{position: 'absolute', left: 0, right: 0, top: L.brandTop, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, opacity: 1 - m}}>
				<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 54, lineHeight: 0.98, color: COLORS.text, textAlign: 'right', textShadow: '0 6px 24px rgba(0,0,0,0.8)'}}>
					FRANKFURT
					<br />
					ERKLÄRT
				</div>
				<div style={{padding: '9px 16px', borderRadius: 10, background: ACCENT.brand, boxShadow: '0 10px 26px rgba(255,59,78,0.4)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, letterSpacing: 3, color: '#FFFFFF'}}>{FORMAT.sub}</div>
			</div>
			{/* große 76 */}
			{m < 1 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: L.numberTop - m * 60, textAlign: 'center', opacity: 1 - m, scale: String(1 - m * 0.55), fontFamily: FONTS.heading, fontWeight: 900, fontSize: L.numberSize, lineHeight: 0.9, letterSpacing: -13, color: COLORS.signal, textShadow: `0 0 70px ${withAlpha(COLORS.signal, 0.55)}, 0 30px 80px rgba(0,0,0,0.7)`}}>
					{COVER.number}
				</div>
			) : null}
			{/* TEIL 4 */}
			<div style={{position: 'absolute', right: 1080 - L.partRight, top: L.partTop, rotate: '9deg', padding: '8px 18px', borderRadius: 12, background: '#FFFFFF', boxShadow: '0 12px 30px rgba(0,0,0,0.5)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 36, color: ACCENT.ink, opacity: 1 - m}}>{COVER.part}</div>
			{/* vier Antwort-Kacheln (aus der 76 heraus) */}
			{m > 0 ? (
				<div style={{position: 'absolute', left: 96, width: 888, top: 470, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18}}>
					{ANSWERS.map((q, i) => {
						const s = springIn({frame, fps, delay: morphAt + 2 + i * 3, damping: 14, stiffness: 170});
						const fromX = (i % 2 === 0 ? 1 : -1) * 210;
						const fromY = (i < 2 ? 1 : -1) * 110 + 80;
						const c = ACOLOR[q.num];
						return (
							<div key={q.num} style={{opacity: Math.min(1, s * 1.6), translate: `${(1 - s) * fromX}px ${(1 - s) * fromY}px`, scale: String(0.5 + 0.5 * s)}}>
								<Card color={c} style={{height: 196, padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}} glow={0.3}>
									<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
										<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 56, lineHeight: 1, color: c}}>{q.num}</span>
										<IconOrb name={icon[i]} color={c} size={72} />
									</div>
									<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
										<T4Icon name="check" size={30} color={ACCENT.yes} stroke={3} />
										<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 32, color: COLORS.text}}>{q.short}</span>
									</div>
								</Card>
							</div>
						);
					})}
				</div>
			) : null}
			{/* Titelzeilen */}
			<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.kickerTop, display: 'flex', justifyContent: 'center'}}>
				<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 58, lineHeight: 1, color: COLORS.text, textShadow: '0 8px 30px rgba(0,0,0,0.85)'}}>{COVER.kicker}</div>
			</div>
			<div style={{position: 'absolute', left: L.sideMin - 30, right: L.sideMin - 30, top: L.cardTop, display: 'flex', justifyContent: 'center'}}>
				<div style={{padding: '10px 22px 14px', borderRadius: 22, background: 'linear-gradient(160deg, #FF6A78 0%, #FF4D5E 50%, #D93448 100%)', boxShadow: '0 5px 0 #B32A3C, 0 10px 0 #8E1F2E, 0 40px 70px rgba(0,0,0,0.6)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: L.cardFont, maxWidth: L.cardMaxWidth, lineHeight: 1.05, color: '#FFFFFF', whiteSpace: 'nowrap'}}>{COVER.card}</div>
			</div>
			<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.subTop, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 800, fontSize: 34, color: COLORS.text, textShadow: '0 6px 24px rgba(0,0,0,0.9)'}}>{COVER.sub}</div>
			<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.metaTop, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, opacity: 1 - m}}>
				<BrandAvatar size={50} />
				<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 30, color: COLORS.textMuted}}>{handleWithAt()}</span>
			</div>
			{thumbnail ? (
				<div style={{position: 'absolute', left: L.sideMin - 40, right: L.sideMin - 40, top: L.chipsTop, display: 'flex', justifyContent: 'center', gap: 10}}>
					{ANSWERS.map((q) => (
						<div key={q.num} style={{display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 14, background: 'rgba(8,10,28,0.88)', border: `2px solid ${ACOLOR[q.num]}`}}>
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 23, color: ACOLOR[q.num]}}>{q.num}</span>
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 21, color: COLORS.text, whiteSpace: 'nowrap'}}>{q.short}</span>
						</div>
					))}
				</div>
			) : null}
		</AbsoluteFill>
	);
};

/** Szene 1 – Titelbild im Video (ab Frame 0 vollständig, ≈ 1 s stehend), dann 76 → vier Antworten. */
export const CoverScene: React.FC<SceneProps> = ({cues}) => {
	const frame = useCurrentFrame();
	const h2 = cue(cues, 'hook2', 34);
	const morphAt = Math.max(30, h2.from + 4);
	const morph = interpolate(frame, [morphAt, morphAt + 16], [0, 1], clamp);
	return (
		<AbsoluteFill>
			<Teil4Cover morph={morph} morphAt={morphAt} />
			<Sfx name="impact" at={0} volume={0.5} />
			<Sfx name="whoosh" at={morphAt - 2} volume={0.7} />
			{[0, 1, 2, 3].map((i) => (
				<Sfx key={i} name="pop" at={morphAt + 4 + i * 3} volume={0.45} />
			))}
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 2: Einsatzorte */

/** Szene 2 – Antwort 1: bis zu 30 Einsatzorte gleichzeitig, Gassen/Innenhöfe, viele Randalierer, Verlagerung; Erklärung ≠ Bewertung. */
export const SpotsScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const a = cue(cues, 'p1a', 4);
	const b = cue(cues, 'p1b', 90);
	const c = cue(cues, 'p1c', 230);
	const d = cue(cues, 'p1d', 400);
	const at30 = Math.min(wordFrame(cues, '30', b.from + 40), b.from + 46);
	const atSpread = wordFrame(cues, 'verteilt', b.from + 90);
	const atAlley = Math.min(wordFrame(cues, 'Gassen', c.from + 20), c.from + 16);
	const atRiot = wordFrame(cues, 'Randalierer', c.from + 60);
	const atShift = wordFrame(cues, 'verlagerten', c.from + 100);
	const atVerdict = d.from;
	// Frage-Phase: Einsatzkräfte stehen gebündelt, ab „überall“ leuchten die Brennpunkte nacheinander auf (bis „30“)
	const atQ = Math.min(wordFrame(cues, 'überall', a.from + 34), at30 - 30);
	const camera: CityCameraKeyframe[] = [
		{frame: 0, center: SPOTS.center, zoom: 0.6},
		{frame: Math.max(1, b.from), center: SPOTS.center, zoom: 0.66},
		{frame: Math.max(2, atAlley + 4), center: [50.1131, 8.6833], zoom: 1.0},
		{frame: Math.max(3, atShift + 2), center: [50.1152, 8.6822], zoom: 0.8},
		{frame: Math.max(4, durationInFrames), center: SPOTS.center, zoom: 0.62},
	];
	const anchor: [number, number] = [540, 960];
	const {toScreen, zoom} = useCityCamera(MAP, camera, anchor, frame);
	const base = toScreen([50.1149, 8.6868]);
	const step = Math.max(2, (at30 - 4 - atQ) / SPOTS.points.length);
	const pts = SPOTS.points.map((p, i) => ({...p, xy: toScreen(p.at), appear: Math.round(atQ + i * step)}));
	const unitsIn = interpolate(frame, [4, 14], [0, 1], clamp);
	const units = [0, 1, 2, 3, 4].map((i) => {
		const target = pts[[2, 5, 9, 0, 8][i]];
		const t = interpolate(frame, [atSpread - 4 + i * 5, atSpread + 18 + i * 5], [0, 1], {...clamp, easing: EASE_IN_OUT});
		const second = pts[[3, 6, 10, 4, 1][i]];
		const t2 = interpolate(frame, [atShift + i * 4, atShift + 22 + i * 4], [0, 1], {...clamp, easing: EASE_IN_OUT});
		const ox = Math.cos(i * 1.26) * 30 * (1 - t);
		const oy = Math.sin(i * 1.26) * 30 * (1 - t);
		const x1 = base[0] + ox + (target.xy[0] - base[0]) * t;
		const y1 = base[1] + oy + (target.xy[1] - base[1]) * t;
		return {i, t, x: x1 + (second.xy[0] - target.xy[0]) * t2, y: y1 + (second.xy[1] - target.xy[1]) * t2};
	});
	const counter = springIn({frame, fps, delay: at30 - 8, damping: 14, stiffness: 170});
	const factorAt = [atAlley - 4, atRiot - 4, atShift - 4];
	const fadeFactors = interpolate(frame, [atVerdict - 6, atVerdict + 6], [1, 0], clamp);
	const shiftDraw = interpolate(frame, [atShift - 2, atShift + 20], [0, 1], {...clamp, easing: EASE_OUT});
	const from = toScreen(SPOTS.zeil);
	const to = toScreen(SPOTS.eschenheimerTor);
	const ctrl: [number, number] = [(from[0] + to[0]) / 2 + 60, Math.min(from[1], to[1]) - 90];
	const pulse = (k: number) => 0.5 + 0.5 * Math.sin(frame / 5 + k);
	return (
		<AbsoluteFill style={{backgroundColor: '#090D20', overflow: 'hidden'}}>
			<CityStreetMap map={MAP} camera={camera} anchor={anchor} highlights={[{name: 'Zeil', color: withAlpha(ACCENT.no, 0.55), fromFrame: at30, width: 14, sweepFrames: 26}]} streetLabels={[{text: 'Zeil', at: SPOTS.zeil, rotate: -2, size: 30}, {text: 'Eschenheimer Tor', at: [50.11705, 8.6801], size: 24}, {text: 'Hauptwache', at: [50.1133, 8.6787], size: 24}]} labelOpacity={interpolate(frame, [0, 15], [0, 0.9], clamp)} />
			{/* Brennpunkte, Einsatzkräfte (symbolisch), Verlagerung */}
			<svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
				{units.map((u) => (u.t > 0 ? <line key={`l-${u.i}`} x1={base[0]} y1={base[1]} x2={u.x} y2={u.y} stroke={withAlpha(ACCENT.info, 0.55)} strokeWidth={3} strokeDasharray="8 9" strokeDashoffset={-frame * 1.5} /> : null))}
				{pts.map((p, i) => {
					const o = interpolate(frame, [p.appear, p.appear + 8], [0, 1], clamp);
					if (o <= 0) return null;
					const r = (14 + 6 * pulse(i)) * Math.max(0.7, zoom);
					return (
						<g key={p.id} opacity={o}>
							<circle cx={p.xy[0]} cy={p.xy[1]} r={r * 2.6} fill={withAlpha('#FF7A3D', 0.16 * (0.6 + 0.4 * pulse(i + 1)))} />
							<circle cx={p.xy[0]} cy={p.xy[1]} r={r * 1.5} fill="none" stroke={withAlpha('#FF7A3D', 0.6)} strokeWidth={3} />
							<circle cx={p.xy[0]} cy={p.xy[1]} r={r * 0.75} fill={ACCENT.no} stroke="#FFFFFF" strokeWidth={2.5} />
						</g>
					);
				})}
				{shiftDraw > 0 ? (
					<g opacity={fadeFactors * 0.95 + 0.05}>
						<path d={`M${from[0]} ${from[1]} Q${ctrl[0]} ${ctrl[1]} ${to[0]} ${to[1]}`} fill="none" stroke={COLORS.signal} strokeWidth={6} strokeLinecap="round" strokeDasharray={1400} strokeDashoffset={1400 * (1 - shiftDraw)} />
						<circle cx={to[0]} cy={to[1]} r={12 * shiftDraw} fill={COLORS.signal} />
					</g>
				) : null}
				{units.map((u) =>
					unitsIn > 0 ? (
						<g key={`u-${u.i}`} transform={`translate(${u.x} ${u.y})`} opacity={unitsIn}>
							<circle r={24} fill={withAlpha(ACCENT.info, 0.25)} />
							<path d="M0 -16 L13 -10 L13 1 Q13 11 0 17 Q-13 11 -13 1 L-13 -10 Z" fill={ACCENT.info} stroke="#FFFFFF" strokeWidth={2.5} />
						</g>
					) : null,
				)}
			</svg>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(6,9,24,0.95) 0%, rgba(6,9,24,0.78) 22%, rgba(6,9,24,0.05) 38%, rgba(6,9,24,0) 52%, rgba(6,9,24,0.35) 62%, rgba(6,9,24,0.88) 78%, rgba(6,9,24,0.95) 100%)'}} />
			<div style={{position: 'absolute', left: 64, top: 290}}>
				<Tag num="01" text="ANTWORT 01 · EINSATZ" />
			</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 350}}>
				<Headline lines={ANSWERS[0].title} color={ACCENT.info} />
			</div>
			{/* Zähler */}
			{frame >= at30 - 8 ? (
				<div style={{position: 'absolute', right: 150, top: 486, opacity: Math.min(1, counter * 2) * (1 - interpolate(frame, [atVerdict - 6, atVerdict + 6], [0, 0.35], clamp)), scale: String(0.7 + 0.3 * counter), transformOrigin: '100% 0%'}}>
					<Card color={COLORS.signal} style={{padding: '12px 18px 12px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}} glow={0.3}>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, letterSpacing: 2, color: COLORS.textMuted}}>{SPOTS.labelPre}</span>
						<RollNumber from={0} to={SPOTS.max} at={at30 - 8} dur={20} size={130} color={COLORS.signal} />
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 22, color: COLORS.text}}>{SPOTS.label}</span>
						<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 20, color: COLORS.textMuted}}>{SPOTS.note}</span>
					</Card>
				</div>
			) : null}
			{/* Gründe */}
			<div style={{position: 'absolute', left: 64, width: 866, top: 912, display: 'flex', flexDirection: 'column', gap: 8, opacity: fadeFactors}}>
				{SPOTS.factors.map((f, i) => (
					<Pop key={f.title} at={factorAt[i]} dx={-60} dy={0}>
						<div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '6px 14px', borderRadius: 16, background: 'rgba(8,10,28,0.93)', border: `2px solid ${withAlpha(i === 2 ? COLORS.signal : ACCENT.info, 0.8)}`}}>
							<IconOrb name={f.icon as T4IconName} color={i === 2 ? COLORS.signal : ACCENT.info} size={44} />
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, color: COLORS.text, whiteSpace: 'nowrap'}}>{f.title}</span>
							<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 21, color: COLORS.textMuted}}>{f.text}</span>
						</div>
					</Pop>
				))}
			</div>
			{/* Erklärung ≠ Bewertung */}
			{frame >= atVerdict - 6 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 880, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12}}>
					<Equation left={SPOTS.verdict[0]} right={SPOTS.verdict[1]} at={atVerdict - 6} size={50} layout="compact" leftColor={ACCENT.info} rightColor={ACCENT.no} />
					<Pop at={atVerdict + 8} dy={14}>
						<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
							<Status kind="OFFEN" size={20} />
							<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 25, color: COLORS.text, textShadow: '0 4px 14px rgba(0,0,0,0.9)'}}>{SPOTS.open}</span>
						</div>
					</Pop>
					<Pop at={atVerdict + 16} dy={10}>
						<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
							<Status kind="POSITION" size={18} />
							<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 21, color: COLORS.textMuted, textShadow: '0 4px 14px rgba(0,0,0,0.9)'}}>{SPOTS.positions}</span>
						</div>
					</Pop>
				</div>
			) : null}
			<div style={{position: 'absolute', left: 64, width: 866, top: 1150, opacity: interpolate(frame, [8, 20], [0, 1], clamp) * interpolate(frame, [atVerdict - 6, atVerdict + 4], [1, 0], clamp), display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap'}}>
				<Status kind="SYMBOLISCH" size={16} />
				<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 19, color: COLORS.textMuted, textShadow: '0 2px 8px rgba(0,0,0,0.95)'}}>{SPOTS.legend}</span>
			</div>
			<SourceBar text={SPOTS.source} at={a.from + 10} />
			<Sfx name="whoosh" at={0} volume={0.45} />
			<Sfx name="softImpact" at={at30 - 8} volume={0.7} />
			{pts.map((p, i) => (i % 3 === 0 ? <Sfx key={p.id} name="blip" at={p.appear} volume={0.35} /> : null))}
			<Sfx name="whoosh" at={atSpread - 4} volume={0.4} />
			{factorAt.map((f, i) => (
				<Sfx key={i} name="click" at={f} volume={0.5} />
			))}
			<Sfx name="whoosh" at={atShift - 2} volume={0.5} />
			<Sfx name="stamp" at={atVerdict - 6} volume={0.5} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 3: Schaden */

const ShopIcon: React.FC<{state: 'off' | 'damaged' | 'looted'; size: number; appear: number}> = ({state, size, appear}) => {
	const c = state === 'looted' ? ACCENT.no : state === 'damaged' ? COLORS.signal : 'rgba(255,255,255,0.18)';
	return (
		<div style={{width: size, height: size, opacity: Math.max(0.25, appear), scale: String(0.7 + 0.3 * appear), position: 'relative'}}>
			<svg width={size} height={size} viewBox="0 0 24 24">
				<path d="M3 9 4.5 4h15L21 9z" fill={withAlpha(c, state === 'off' ? 0.25 : 0.9)} />
				<rect x={4} y={9} width={16} height={11.5} rx={1} fill="none" stroke={c} strokeWidth={1.8} />
				<rect x={6.5} y={11.5} width={6} height={5} fill={withAlpha(c, state === 'off' ? 0.12 : 0.3)} />
				<rect x={14} y={12} width={3.5} height={8.5} fill={withAlpha(c, state === 'off' ? 0.12 : 0.4)} />
				{state !== 'off' ? <path d="M9.5 14 7.5 12.2M9.5 14l2.6-1.7M9.5 14l-.6 2.4" stroke="#FFFFFF" strokeWidth={0.9} /> : null}
			</svg>
			{state === 'looted' ? <div style={{position: 'absolute', right: -3, top: -3, width: size * 0.32, height: size * 0.32, borderRadius: size, background: ACCENT.no, border: '2px solid #FFFFFF'}} /> : null}
		</div>
	);
};

/** Szene 3 – Antwort 2: Anfangsbilanz 17/5 → später genannt (laut Wiesbadener Kurier) 35/6 + sechsstelliger Schaden. */
export const DamageScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const a = cue(cues, 'p2a', 4);
	const b = cue(cues, 'p2b', 120);
	const at17 = Math.min(wordFrame(cues, '17', a.from + 50), a.from + 40);
	const atKurier = Math.min(wordFrame(cues, 'Wiesbadener', b.from + 10), b.from + 8);
	const at35 = wordFrame(cues, '35', b.from + 90);
	const atSum = wordFrame(cues, 'sechsstelligen', b.from + 170);
	const later = interpolate(frame, [at35 - 8, at35 + 8], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const sum = springIn({frame, fps, delay: atSum - 6, damping: 11, stiffness: 190});
	const damaged = Math.round(interpolate(frame, [at35 - 8, at35 + 14], [DAMAGE.before.damaged, DAMAGE.after.damaged], clamp));
	const looted = frame >= at35 + 6 ? DAMAGE.after.looted : DAMAGE.before.looted;
	const icons = 36;
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<NightBg progress={frame / durationInFrames} alert={0.2} blur={3} />
			<div style={{position: 'absolute', left: 64, top: 290}}>
				<Tag num="02" text="ANTWORT 02 · SCHADEN" />
			</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 350}}>
				<Headline lines={ANSWERS[1].title} color={COLORS.signal} />
			</div>
			{/* Bilanztafel */}
			<div style={{position: 'absolute', left: 64, width: 866, top: 490}}>
				<Card color={later > 0.5 ? COLORS.signal : withAlpha('#FFFFFF', 0.5)} style={{padding: '16px 22px 18px'}} glow={0.2 * later}>
					<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
							<Status kind={later > 0.5 ? 'BERICHT' : 'OFFIZIELL'} size={18} />
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, letterSpacing: 2, color: COLORS.text}}>{later > 0.5 ? DAMAGE.after.label : DAMAGE.before.label}</span>
						</div>
						<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 20, color: COLORS.textMuted, maxWidth: 400, textAlign: 'right'}}>{later > 0.5 ? DAMAGE.after.when : DAMAGE.before.when}</span>
					</div>
					<div style={{display: 'flex', gap: 30, marginTop: 10, alignItems: 'flex-end', opacity: interpolate(frame, [at17 - 6, at17 + 4], [0, 1], clamp)}}>
						<div style={{display: 'flex', alignItems: 'baseline', gap: 10}}>
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 110, lineHeight: 0.9, color: COLORS.signal, fontVariantNumeric: 'tabular-nums', textShadow: `0 0 30px ${withAlpha(COLORS.signal, 0.5)}`}}>{damaged}</span>
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, color: COLORS.text}}>BESCHÄDIGT</span>
						</div>
						<div style={{display: 'flex', alignItems: 'baseline', gap: 10}}>
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 110, lineHeight: 0.9, color: ACCENT.no, fontVariantNumeric: 'tabular-nums', textShadow: `0 0 30px ${withAlpha(ACCENT.no, 0.5)}`}}>{looted}</span>
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, color: COLORS.text}}>GEPLÜNDERT</span>
						</div>
					</div>
					{later < 0.5 ? <div style={{marginTop: 6, fontFamily: FONTS.body, fontWeight: 700, fontSize: 21, color: COLORS.textMuted, opacity: interpolate(frame, [at17, at17 + 10], [0, 1], clamp)}}>{DAMAGE.before.note}</div> : null}
				</Card>
			</div>
			{/* Laden-Raster */}
			<div style={{position: 'absolute', left: 64, width: 866, top: 762, display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', rowGap: 12, justifyItems: 'center'}}>
				{new Array(icons).fill(0).map((_, i) => {
					const state = i < looted ? 'looted' : i < damaged ? 'damaged' : 'off';
					const ap = interpolate(frame, [at17 - 6 + i * 0.6, at17 + i * 0.6], [0, 1], clamp);
					return <ShopIcon key={i} state={state} size={58} appear={state === 'off' ? 0.25 : ap} />;
				})}
			</div>
			<div style={{position: 'absolute', left: 64, top: 980, display: 'flex', gap: 20, fontFamily: FONTS.body, fontWeight: 700, fontSize: 20, color: COLORS.textMuted}}>
				<span style={{color: COLORS.signal}}>■ beschädigt</span>
				<span style={{color: ACCENT.no}}>● geplündert</span>
				<span>1 Symbol = 1 Laden · Illustration</span>
			</div>
			{/* sechsstellig */}
			{frame >= atSum - 6 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 1030, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: Math.min(1, sum * 2), scale: String(1.3 - 0.3 * sum)}}>
					<div style={{display: 'inline-flex', alignItems: 'center', gap: 12, padding: '10px 24px', borderRadius: 18, background: `linear-gradient(160deg, ${COLORS.signal}, #E0A800)`, boxShadow: `0 0 40px ${withAlpha(COLORS.signal, 0.5)}, 0 20px 40px rgba(0,0,0,0.5)`}}>
						<T4Icon name="euro" size={44} color={ACCENT.ink} stroke={2.8} />
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 46, color: ACCENT.ink}}>{DAMAGE.sum}</span>
					</div>
					<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted, textShadow: '0 2px 8px rgba(0,0,0,0.9)'}}>{DAMAGE.sumNote}</span>
				</div>
			) : null}
			<SourceBar text={DAMAGE.source} at={a.from + 10} />
			<Sfx name="whoosh" at={0} volume={0.45} />
			<Sfx name="softImpact" at={at17 - 6} volume={0.6} />
			<Sfx name="paper" at={atKurier} volume={0.5} />
			<Sfx name="impact" at={at35 - 8} volume={0.6} />
			<Sfx name="stamp" at={atSum - 6} volume={0.55} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 4: Waffengeschäft */

/** Gesprungenes Glas über der Ladenfront (Illustration). */
const Cracks: React.FC<{width: number; amount: number}> = ({width, amount}) => {
	const h = (width * 580) / 800;
	const lines = (cx: number, cy: number, seed: string) =>
		new Array(9).fill(0).map((_, i) => {
			const ang = (i / 9) * Math.PI * 2 + random(`${seed}-a-${i}`) * 0.5;
			const len = 60 + random(`${seed}-l-${i}`) * 100;
			const x2 = cx + Math.cos(ang) * len * amount;
			const y2 = cy + Math.sin(ang) * len * amount;
			return <path key={i} d={`M${cx} ${cy} L${(cx + x2) / 2 + random(`${seed}-j-${i}`) * 10} ${(cy + y2) / 2} L${x2} ${y2}`} stroke="#E8F4FF" strokeWidth={2.4} fill="none" opacity={0.85} />;
		});
	return (
		<svg width={width} height={h} viewBox="0 300 800 580" style={{position: 'absolute', left: 0, top: 0}}>
			<g opacity={amount}>{lines(170, 660, 'w1')}</g>
		</svg>
	);
};

/** Neutrales Piktogramm einer Schreckschusspistole (keine Marke, keine Gewaltdarstellung). */
const BlankGun: React.FC<{size: number; color: string}> = ({size, color}) => (
	<svg width={size} height={size * 0.62} viewBox="0 0 100 62">
		<path d="M6 10h70l6 6h12v10H52l-4 6H40l-6 26H16l6-26-16-6z" fill={withAlpha(color, 0.18)} stroke={color} strokeWidth={3} strokeLinejoin="round" />
		<circle cx={84} cy={21} r={3} fill={color} />
		<path d="M40 32c3 6 8 8 12 8" fill="none" stroke={color} strokeWidth={3} />
	</svg>
);

/** Szene 4 – Antwort 3: Waffengeschäft → Schreckschusswaffen sichergestellt → 18-Jähriger in U-Haft → U-Haft ≠ Verurteilung. */
export const WeaponsScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const a = cue(cues, 'p3a', 4);
	const b = cue(cues, 'p3b', 50);
	const c = cue(cues, 'p3c', 120);
	const d = cue(cues, 'p3d', 220);
	const atSeized = Math.min(wordFrame(cues, 'Schreckschusswaffen', b.from + 30), b.from + 24);
	const atStamp = wordFrame(cues, 'sichergestellt', atSeized + 30);
	const atCustody = Math.min(wordFrame(cues, '18-Jähriger', c.from + 4), c.from + 4);
	const atEq = Math.min(wordFrame(cues, 'Verurteilung', d.from + 30), d.from + 10);
	const crack = interpolate(frame, [a.from + 4, a.from + 16], [0, 1], {...clamp, easing: EASE_OUT});
	const toCards = interpolate(frame, [atSeized - 10, atSeized + 8], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const stamp = springIn({frame, fps, delay: atStamp - 4, damping: 9, stiffness: 220});
	const dolly = interpolate(frame, [0, durationInFrames], [0, 1], clamp);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{scale: String(1.06 - dolly * 0.04)}}>
				<NightCity mood={blendMood(MOODS.dusk, MOODS.alert, 0.35)} progress={dolly} litRatio={0.32} bokeh={10} showPromenade={false} />
			</AbsoluteFill>
			{/* Ladenfront (Illustration) */}
			<div style={{position: 'absolute', left: 140, top: 470 - toCards * 40, scale: String(1 + (1 - toCards) * dolly * 0.06 - toCards * 0.22), transformOrigin: '50% 0%', opacity: 1 - toCards * 0.7, filter: toCards > 0 ? `blur(${toCards * 5}px)` : undefined}}>
				<div style={{position: 'relative'}}>
					<Storefront width={800} label={WEAPONS.shop} motif="boxes" panes={3} upper={false} light={0.75} seed="t4-weapons" />
					<Cracks width={800} amount={crack} />
					<div style={{position: 'absolute', right: 12, top: 12, padding: '4px 10px', borderRadius: 8, background: 'rgba(8,10,28,0.85)', fontFamily: FONTS.body, fontWeight: 800, fontSize: 19, letterSpacing: 1.5, color: COLORS.textMuted}}>ILLUSTRATION</div>
				</div>
			</div>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.95) 0%, rgba(4,6,20,0.7) 22%, rgba(4,6,20,0.1) 38%, rgba(4,6,20,0.3) 70%, rgba(4,6,20,0.9) 100%)'}} />
			<div style={{position: 'absolute', left: 64, top: 290}}>
				<Tag num="03" text="ANTWORT 03 · WAFFEN" />
			</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 350}}>
				<Headline lines={ANSWERS[2].title} color={ACCENT.no} />
			</div>
			<div style={{position: 'absolute', left: 140, width: 800, top: 948, display: 'flex', justifyContent: 'center', opacity: 1 - toCards}}>
				<Pop at={a.from + 6} dy={14}>
					<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, color: COLORS.text, padding: '6px 16px', borderRadius: 12, background: 'rgba(8,10,28,0.85)'}}>{WEAPONS.shopNote}</span>
				</Pop>
			</div>
			{/* sichergestellt */}
			{frame >= atSeized - 10 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 500}}>
					<Pop at={atSeized - 8} dy={30}>
						<Card color={ACCENT.info} style={{padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 20}} glow={0.25}>
							<div style={{position: 'relative', width: 180, height: 140, borderRadius: 18, background: 'rgba(255,255,255,0.04)', border: '2px dashed rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
								<BlankGun size={140} color="#DDE6FF" />
								<div style={{position: 'absolute', right: -14, bottom: -14}}>
									<IconOrb name="bag" color={ACCENT.yes} size={58} />
								</div>
							</div>
							<div style={{flex: 1}}>
								<Status kind="OFFIZIELL" size={18} />
								<div style={{marginTop: 8, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 36, lineHeight: 1.05, color: COLORS.text}}>{WEAPONS.seized}</div>
								<div style={{marginTop: 4, fontFamily: FONTS.body, fontWeight: 700, fontSize: 21, color: COLORS.textMuted}}>{WEAPONS.seizedNote}</div>
							</div>
						</Card>
					</Pop>
					{frame >= atStamp - 4 ? (
						<div style={{position: 'absolute', right: 30, top: -30, opacity: Math.min(1, stamp * 2), scale: String(1.6 - 0.6 * stamp), rotate: '-8deg'}}>
							<div style={{padding: '6px 16px', border: `5px solid ${ACCENT.yes}`, borderRadius: 14, background: 'rgba(8,28,20,0.9)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, letterSpacing: 2, color: ACCENT.yes}}>SICHERGESTELLT</div>
						</div>
					) : null}
				</div>
			) : null}
			{/* Untersuchungshaft */}
			{frame >= atCustody - 6 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 760}}>
					<Pop at={atCustody - 6} dx={60} dy={0}>
						<Card color={ACCENT.no} style={{padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 18}} glow={0.2}>
							<div style={{width: 110, height: 110, borderRadius: 22, background: withAlpha(ACCENT.no, 0.15), border: `2px solid ${ACCENT.no}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
								<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 56, lineHeight: 0.95, color: COLORS.text}}>{WEAPONS.custody.age}</span>
								<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 16, color: COLORS.textMuted}}>JAHRE</span>
							</div>
							<div style={{flex: 1}}>
								<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
									<T4Icon name="lock" size={34} color={ACCENT.no} />
									<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 38, color: COLORS.text}}>{WEAPONS.custody.title}</span>
								</div>
								<div style={{marginTop: 4, fontFamily: FONTS.body, fontWeight: 700, fontSize: 21, lineHeight: 1.2, color: COLORS.textMuted}}>{WEAPONS.custody.text}</div>
							</div>
						</Card>
					</Pop>
				</div>
			) : null}
			{frame >= atEq - 8 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 1000, display: 'flex', justifyContent: 'center'}}>
					<Equation left={WEAPONS.equation[0]} right={WEAPONS.equation[1]} at={atEq - 8} size={50} layout="compact" leftColor={COLORS.signal} rightColor={ACCENT.no} />
				</div>
			) : null}
			<SourceBar text={WEAPONS.source} at={a.from + 10} />
			<Sfx name="whoosh" at={0} volume={0.45} />
			<Sfx name="softImpact" at={a.from + 4} volume={0.5} />
			<Sfx name="pop" at={atSeized - 8} volume={0.6} />
			<Sfx name="stamp" at={atStamp - 4} volume={0.6} />
			<Sfx name="click" at={atCustody - 6} volume={0.6} />
			<Sfx name="stamp" at={atEq - 8} volume={0.45} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 5: Strafverfolgung */

/** Szene 5 – Antwort 4: 110 Anzeigen · 53 Festnahmen · 73 Tatverdächtige – verdächtig ≠ verurteilt. */
export const JusticeScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const a = cue(cues, 'p4a', 4);
	const b = cue(cues, 'p4b', 120);
	const c = cue(cues, 'p4c', 190);
	const at = [Math.min(wordFrame(cues, '110', a.from + 50), a.from + 40), wordFrame(cues, '53', a.from + 100), Math.min(wordFrame(cues, '73', b.from + 30), b.from + 24)];
	const atEq = Math.min(wordFrame(cues, 'verdächtig', c.from + 8), c.from + 6);
	const icons: T4IconName[] = ['doc', 'lock', 'person'];
	const colors = [ACCENT.info, COLORS.signal, ACCENT.law];
	const meaning = ['Vorwurf wird angezeigt', 'vorläufig, am 31.10.', 'Verdacht – kein Urteil'];
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse 110% 60% at 50% 45%, #2C2160 0%, #131544 50%, #070A22 100%)'}} />
			<div style={{position: 'absolute', left: 540 - 360, top: 520 - (frame / durationInFrames) * 40, opacity: 0.07, rotate: `${Math.sin(frame / 40) * 3}deg`}}>
				<T4Icon name="scales" size={720} color="#FFFFFF" stroke={0.6} />
			</div>
			<div style={{position: 'absolute', left: 64, top: 290}}>
				<Tag num="04" text="ANTWORT 04 · ERMITTLUNGEN" />
			</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 350}}>
				<Headline lines={ANSWERS[3].title} color={ACCENT.law} size={54} />
			</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 500, display: 'flex', gap: 16}}>
				{JUSTICE.steps.map((s, i) => (
					<div key={s.title} style={{flex: 1}}>
						<Pop at={at[i] - 8} dy={40}>
							<Card color={colors[i]} style={{height: 360, padding: '18px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}} glow={0.25}>
								<IconOrb name={icons[i]} color={colors[i]} size={66} />
								<RollNumber from={0} to={s.n} at={at[i] - 8} dur={16} size={92} color={colors[i]} />
								<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 25, color: COLORS.text, textAlign: 'center'}}>{s.title}</div>
								<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 19, color: COLORS.textMuted, textAlign: 'center'}}>{s.note}</div>
								<div style={{marginTop: 'auto', padding: '6px 10px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', fontFamily: FONTS.body, fontWeight: 700, fontSize: 19, lineHeight: 1.15, color: COLORS.text, textAlign: 'center'}}>{meaning[i]}</div>
							</Card>
						</Pop>
					</div>
				))}
			</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 880, display: 'flex', justifyContent: 'center', opacity: interpolate(frame, [at[2] + 4, at[2] + 14], [0, 1], clamp)}}>
				<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted}}>verschiedene Zählungen – nicht einfach addieren</span>
			</div>
			{frame >= atEq - 8 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 950, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12}}>
					<Equation left={JUSTICE.equation[0]} right={JUSTICE.equation[1]} at={atEq - 8} size={54} layout="compact" leftColor={COLORS.signal} rightColor={ACCENT.no} />
					<Pop at={atEq + 10} dy={12}>
						<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 25, color: COLORS.text}}>{JUSTICE.note}</span>
					</Pop>
				</div>
			) : null}
			<SourceBar text={JUSTICE.source} at={a.from + 10} />
			<Sfx name="whoosh" at={0} volume={0.45} />
			{at.map((f, i) => (
				<Sfx key={i} name="softImpact" at={f - 8} volume={0.55} />
			))}
			<Sfx name="stamp" at={atEq - 8} volume={0.55} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 6: Zusammenfassung + Abo-Aufruf */

/** Szene 6 – vier Antworten auf einen Blick, dann kurzer Abo-Aufruf (Profil + Folgen-Knopf). */
export const OutroScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const e = cue(cues, 'end', 4);
	const c = cue(cues, 'cta', 70);
	const atCta = Math.min(wordFrame(cues, 'Folgt', c.from), c.from);
	const cta = springIn({frame, fps, delay: atCta - 6, damping: 13, stiffness: 180});
	const shrink = interpolate(frame, [atCta - 8, atCta + 8], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const pull = interpolate(frame, [0, durationInFrames], [0, 1], {...clamp, easing: EASE_OUT});
	const press = frame >= atCta + 26 ? interpolate(frame, [atCta + 26, atCta + 32, atCta + 38], [1, 0.9, 1], clamp) : 1;
	const followed = frame >= atCta + 30;
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{scale: String(1.2 - pull * 0.2), transformOrigin: '50% 70%'}}>
				<NightCity mood={MOODS.dusk} progress={pull} litRatio={0.42} showMoon bokeh={16} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.94) 0%, rgba(4,6,20,0.72) 50%, rgba(4,6,20,0.5) 75%, rgba(4,6,20,0.8) 100%)'}} />
			<div style={{position: 'absolute', left: 64, width: 866, top: 300 - shrink * 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, scale: String(1 - shrink * 0.12), transformOrigin: '50% 0%', opacity: 1 - shrink * 0.35}}>
				{SUMMARY.map((s, i) => (
					<Pop key={s.num} at={e.from + i * 3} dy={24}>
						<div style={{height: 150, padding: '12px 16px', borderRadius: 22, background: 'rgba(10,12,34,0.94)', border: `2px solid ${withAlpha(ACOLOR[s.num as ANum], 0.85)}`, display: 'flex', flexDirection: 'column', gap: 6}}>
							<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
								<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 32, color: ACOLOR[s.num as ANum]}}>{s.num}</span>
								<T4Icon name="check" size={28} color={ACCENT.yes} stroke={3} />
							</div>
							<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 27, lineHeight: 1.08, color: COLORS.text}}>{s.title}</div>
							<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 21, color: COLORS.textMuted}}>{s.note}</div>
						</div>
					</Pop>
				))}
			</div>
			{frame >= atCta - 6 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 700, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, opacity: Math.min(1, cta * 2), translate: `0 ${(1 - cta) * 50}px`}}>
					<div style={{position: 'relative'}}>
						<BrandAvatar size={190} ring={6 + Math.sin(frame / 4) * 3} />
						<div style={{position: 'absolute', left: '50%', bottom: -26, translate: '-50% 0', scale: String(press), width: 64, height: 64, borderRadius: 32, background: followed ? ACCENT.yes : ACCENT.brand, border: '4px solid #FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 24px rgba(0,0,0,0.5)'}}>
							<T4Icon name={followed ? 'check' : 'plus'} size={36} color="#FFFFFF" stroke={3.4} />
						</div>
					</div>
					<span style={{marginTop: 12, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 52, color: COLORS.text}}>{handleWithAt()}</span>
					<div style={{padding: '12px 30px 14px', borderRadius: 20, background: ACCENT.brand, boxShadow: '0 20px 50px rgba(255,59,78,0.35)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, color: '#FFFFFF', scale: String(followed ? 1 + 0.035 * Math.sin((frame - atCta - 30) / 5) : 1)}}>{CTA.title}</div>
					<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 24, letterSpacing: 2.5, color: COLORS.signal}}>
						{CTA.sub} · {FORMAT.sub}
					</span>
				</div>
			) : null}
			{[0, 1, 2, 3].map((i) => (
				<Sfx key={i} name="click" at={e.from + i * 3} volume={0.45} />
			))}
			<Sfx name="pop" at={atCta - 6} volume={0.6} />
			<Sfx name="click" at={atCta + 28} volume={0.6} />
		</AbsoluteFill>
	);
};
