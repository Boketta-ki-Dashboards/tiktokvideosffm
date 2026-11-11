import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {clamp, EASE_IN_OUT, EASE_OUT, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {handleWithAt} from '../../../theme/brand';
import {COLORS, FONTS} from '../../../theme/tokens';
import {BrandAvatar} from '../../../formats/frankfurt-erklaert/Branding';
import {LawChip, Pop, SourceBar} from '../../../formats/frankfurt-erklaert/components';
import {ACCENT, FORMAT} from '../../../formats/frankfurt-erklaert/theme';
import {IsoCity} from '../../../formats/frankfurt-erklaert/visuals/IsoCity';
import {Dossier, Landtag} from '../../../formats/frankfurt-erklaert/visuals/Politics';
import {blendMood, MOODS, NightCity} from '../../frankfurt-2026-11-20-ausblick/premium/NightCity';
import {Person} from '../../frankfurt-2026-11-20-ausblick/premium/Person';
import {Storefront} from '../../frankfurt-2026-11-20-ausblick/premium/Storefront';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {COVER, CTA, DAMAGE, FORECAST, PHASES, QUESTIONS, STAND, STATUS, UNDER14} from '../content';

/** Farben der vier Fragen (Serienfarben). */
export const QCOLOR = {'01': ACCENT.info, '02': ACCENT.no, '03': ACCENT.law, '04': ACCENT.signal} as const;
type QNum = keyof typeof QCOLOR;
const de = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/**
 * Titelbild-Layout Teil 3 (y in px bei 1080 × 1920) – bewusst tiefer als Teil 2, alles in der Kernzone
 * (COVER_ZONE: 330–1450, im Video über den Untertiteln ≤ 1300) und im 3:4-Profilausschnitt (240–1680).
 * Wird von tests/erklaert-76-teil3.test.ts gegen COVER_ZONE geprüft.
 */
export const TEIL3_COVER_LAYOUT = {
	brandTop: 420,
	brandBottom: 528,
	numberTop: 520,
	numberSize: 360,
	numberBottom: 844,
	partTop: 576,
	partRight: 930,
	landtagTop: 756,
	landtagWidth: 780,
	kickerTop: 992,
	cardTop: 1060,
	subTop: 1184,
	metaTop: 1244,
	metaBottom: 1296,
	/** nur im PNG: Themenzeile im Band, in dem im Video die Untertitel stehen (≈ 1.320–1.440) */
	chipsTop: 1344,
	chipsBottom: 1420,
	sideMin: 96,
} as const;

/* ------------------------------------------------------------------ Bausteine */

export type T3IconName = 'crowd' | 'alert' | 'family' | 'book' | 'home' | 'shield' | 'cityhall' | 'search' | 'crack' | 'scales' | 'gavelOff' | 'clock' | 'check' | 'question' | 'calendar' | 'euro';

/** Linien-Icons (24er Raster) für Teil 3. */
export const T3Icon: React.FC<{name: T3IconName; size?: number; color?: string; stroke?: number}> = ({name, size = 36, color = '#FFFFFF', stroke = 2.2}) => {
	const p = {fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
	const body = (() => {
		switch (name) {
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
			case 'alert':
				return (
					<>
						<path d="M12 3 22 20H2L12 3z" {...p} />
						<path d="M12 9.5v5M12 17.3v.2" {...p} />
					</>
				);
			case 'family':
				return (
					<>
						<circle cx={8} cy={5.5} r={2.6} {...p} />
						<path d="M3.5 21v-6.5a4.5 4.5 0 0 1 9 0V21" {...p} />
						<circle cx={17} cy={10} r={2} {...p} />
						<path d="M14 21v-4a3 3 0 0 1 6 0v4" {...p} />
					</>
				);
			case 'book':
				return (
					<>
						<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5v-17z" {...p} />
						<path d="M4 21.5A2.5 2.5 0 0 1 6.5 19H20M9 7h7M9 10.5h5" {...p} />
					</>
				);
			case 'home':
				return (
					<>
						<path d="M3 11 12 3.5 21 11" {...p} />
						<path d="M5.5 9.5V20h13V9.5M10 20v-5.5h4V20" {...p} />
					</>
				);
			case 'shield':
				return (
					<>
						<path d="M12 2.5 20 5.5v6c0 5-3.5 8.7-8 10-4.5-1.3-8-5-8-10v-6l8-3z" {...p} />
						<path d="m8.5 12 2.5 2.5 4.5-5" {...p} />
					</>
				);
			case 'cityhall':
				return (
					<>
						<path d="M3 9.5 12 4l9 5.5M4 21h16M5.5 10v8.5M9.5 10v8.5M14.5 10v8.5M18.5 10v8.5M3 21v-2.5h18V21" {...p} />
					</>
				);
			case 'search':
				return (
					<>
						<circle cx={10.5} cy={10.5} r={6.5} {...p} />
						<path d="m15.5 15.5 5.5 5.5" {...p} />
					</>
				);
			case 'crack':
				return (
					<>
						<rect x={2.5} y={3} width={19} height={18} rx={1.5} {...p} />
						<path d="M12 12 9 3.5M12 12l7.5-4M12 12l-8 2.5M12 12l2.5 8.5M12 12l7 6" {...p} />
					</>
				);
			case 'scales':
				return (
					<>
						<path d="M12 3v18M7 21h10M5 7h14M5 7l-3 7a3 3 0 0 0 6 0L5 7zM19 7l-3 7a3 3 0 0 0 6 0l-3-7z" {...p} />
					</>
				);
			case 'gavelOff':
				return (
					<>
						<path d="m13.5 4.5 6 6M10.5 7.5l6 6M12 6l-4.5 4.5M15 9l-4.5 4.5M9 12l-6 6" {...p} />
						<path d="M3 3l18 18" {...p} stroke={color} strokeWidth={stroke * 1.3} />
					</>
				);
			case 'clock':
				return (
					<>
						<circle cx={12} cy={12} r={9} {...p} />
						<path d="M12 7v5l3.5 2" {...p} />
					</>
				);
			case 'check':
				return <path d="m4.5 12.5 5 5 10-11" {...p} />;
			case 'question':
				return (
					<>
						<circle cx={12} cy={12} r={9.5} {...p} />
						<path d="M9.3 9.3a2.8 2.8 0 1 1 3.9 2.6c-.8.4-1.2 1-1.2 1.9v.6M12 17.2v.2" {...p} />
					</>
				);
			case 'calendar':
				return (
					<>
						<rect x={3} y={4.5} width={18} height={16.5} rx={2.5} {...p} />
						<path d="M3 9.5h18M8 2.5v4M16 2.5v4" {...p} />
					</>
				);
			case 'euro':
				return (
					<>
						<path d="M18 6.5A7 7 0 1 0 18 17.5" {...p} />
						<path d="M4 10.5h9M4 13.5h9" {...p} />
					</>
				);
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

/** Zahl, die von `from` auf `to` rollt (Tausenderpunkt), mit kurzem Leuchten beim Einrasten. */
const RollNumber: React.FC<{from: number; to: number; at: number; dur?: number; size: number; color: string; suffix?: string}> = ({from, to, at, dur = 18, size, color, suffix = ''}) => {
	const frame = useCurrentFrame();
	const v = interpolate(frame, [at, at + dur], [from, to], {...clamp, easing: EASE_OUT});
	const settle = interpolate(frame, [at + dur - 2, at + dur + 8], [0, 1], clamp);
	return (
		<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: size, lineHeight: 0.9, letterSpacing: -size * 0.035, color, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', textShadow: `0 0 ${24 + 30 * Math.sin(settle * Math.PI)}px ${withAlpha(color, 0.55)}, 0 18px 50px rgba(0,0,0,0.6)`}}>
			{de(v)}
			{suffix}
		</span>
	);
};

const Tag: React.FC<{num: QNum; text: string; at?: number}> = ({num, text, at = 0}) => (
	<Pop at={at} dy={20}>
		<div style={{display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 16px 6px 6px', borderRadius: 12, background: 'rgba(8,10,28,0.9)', border: `2px solid ${QCOLOR[num]}`, boxShadow: `0 8px 24px ${withAlpha(QCOLOR[num], 0.25)}`}}>
			<span style={{padding: '2px 10px', borderRadius: 8, background: QCOLOR[num], fontFamily: FONTS.heading, fontWeight: 900, fontSize: 24, color: ACCENT.ink}}>{num}</span>
			<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 24, letterSpacing: 1.5, color: COLORS.text}}>{text}</span>
		</div>
	</Pop>
);

type StatusKind = 'OFFEN' | 'TEILWEISE' | 'OFFIZIELL' | 'BERICHT' | 'RECHT' | 'PRÜFUNG';
const STATUS_COLOR: Record<StatusKind, string> = {OFFEN: ACCENT.no, TEILWEISE: ACCENT.signal, OFFIZIELL: ACCENT.info, BERICHT: '#FFB15C', RECHT: ACCENT.law, PRÜFUNG: ACCENT.signal};
const Status: React.FC<{kind: StatusKind; size?: number}> = ({kind, size = 22}) => {
	const c = STATUS_COLOR[kind];
	return <span style={{display: 'inline-block', padding: `${size * 0.2}px ${size * 0.5}px`, borderRadius: size * 0.4, background: withAlpha(c, 0.18), border: `2px solid ${c}`, fontFamily: FONTS.heading, fontWeight: 900, fontSize: size, letterSpacing: 1.5, color: c, whiteSpace: 'nowrap'}}>{kind}</span>;
};

const Headline: React.FC<{lines: readonly string[]; at?: number; color?: string; size?: number}> = ({lines, at = 0, color = COLORS.text, size = 58}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = springIn({frame, fps, delay: at, damping: 15, stiffness: 180});
	return (
		<div style={{opacity: Math.min(1, s * 2), translate: `${(1 - s) * -40}px 0`}}>
			{lines.map((l, i) => (
				<div key={l} style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: size, lineHeight: 1.02, color: i === lines.length - 1 ? color : COLORS.text, textShadow: '0 8px 30px rgba(0,0,0,0.75)'}}>
					{l}
				</div>
			))}
		</div>
	);
};

/** Glas-Karte mit Akzentrand. */
const Card: React.FC<{children: React.ReactNode; color: string; style?: React.CSSProperties; glow?: number}> = ({children, color, style, glow = 0.2}) => (
	<div style={{borderRadius: 26, background: 'linear-gradient(160deg, rgba(20,24,58,0.96), rgba(9,11,30,0.96))', border: `2.5px solid ${withAlpha(color, 0.85)}`, boxShadow: `0 28px 60px rgba(0,0,0,0.55), 0 0 44px ${withAlpha(color, glow)}, inset 0 1px 0 rgba(255,255,255,0.08)`, ...style}}>{children}</div>
);

const IconOrb: React.FC<{name: T3IconName; color: string; size?: number}> = ({name, color, size = 76}) => (
	<div style={{width: size, height: size, borderRadius: size / 2, background: `radial-gradient(circle at 35% 30%, ${withAlpha(color, 0.35)}, ${withAlpha(color, 0.12)})`, border: `2px solid ${withAlpha(color, 0.7)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
		<T3Icon name={name} size={size * 0.56} color={color} />
	</div>
);

const NightBg: React.FC<{progress: number; alert?: number; blur?: number}> = ({progress, alert = 0.3, blur = 0}) => (
	<AbsoluteFill style={{filter: blur ? `blur(${blur}px) brightness(0.6)` : undefined}}>
		<NightCity mood={blendMood(MOODS.dusk, MOODS.alert, alert)} progress={progress} litRatio={0.4} bokeh={12} showPromenade={false} />
		<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.94) 0%, rgba(4,6,20,0.62) 32%, rgba(4,6,20,0.38) 60%, rgba(4,6,20,0.78) 100%)'}} />
	</AbsoluteFill>
);

/* ------------------------------------------------------------------ Szene 1: Titelbild */

/**
 * Titelbild Teil 3 (Video-Frame 0 und PNG): Nachthimmel oben (dekorativ), Serientitel, große gelbe 76 mit „TEIL 3“,
 * Landtag vor der Skyline, rote Themenkarte „4 FRAGEN BLEIBEN“ – alles tiefer als bei Teil 2 (siehe TEIL3_COVER_LAYOUT).
 * `morph` 0 → 1: Aus der 76 werden die vier Fragen-Kacheln (01–04); die Titelzeilen bleiben stehen.
 */
export const Teil3Cover: React.FC<{morph?: number; morphAt?: number; thumbnail?: boolean}> = ({morph = 0, morphAt = 0, thumbnail = false}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const L = TEIL3_COVER_LAYOUT;
	const m = interpolate(morph, [0, 1], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const twinkle = (i: number) => 0.4 + 0.6 * Math.abs(Math.sin(frame / 18 + i));
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse 120% 55% at 50% 52%, #2E2A70 0%, #141748 50%, #070A22 100%)'}} />
			<AbsoluteFill>
				<NightCity mood={blendMood(MOODS.dusk, MOODS.alert, 0.28)} progress={0.5 + m * 0.1} litRatio={0.42} bokeh={10} showPromenade={false} showMoon />
			</AbsoluteFill>
			{/* dekorativer Himmel oben: Sterne */}
			<svg width={1080} height={420} style={{position: 'absolute', left: 0, top: 0}}>
				{new Array(36).fill(0).map((_, i) => (
					<circle key={i} cx={random(`t3s-x-${i}`) * 1080} cy={30 + random(`t3s-y-${i}`) * 360} r={1 + random(`t3s-r-${i}`) * 2} fill="#FFFFFF" opacity={twinkle(i) * 0.7} />
				))}
			</svg>
			{/* Landtag hinter der Titelzone */}
			<div style={{position: 'absolute', left: (1080 - L.landtagWidth) / 2, top: L.landtagTop + m * 40, opacity: 0.92 - m * 0.35, scale: String(1 - m * 0.06), WebkitMaskImage: 'linear-gradient(#000 70%, transparent 100%)', maskImage: 'linear-gradient(#000 70%, transparent 100%)'}}>
				<Landtag width={L.landtagWidth} />
				<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(rgba(14,18,54,0.25), rgba(14,18,54,0.05))'}} />
			</div>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.55) 0%, rgba(4,6,20,0.1) 16%, rgba(4,6,20,0) 40%, rgba(4,6,20,0.2) 52%, rgba(4,6,20,0.82) 62%, rgba(4,6,20,0.9) 72%, rgba(4,6,20,0.75) 100%)'}} />
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
				<div style={{position: 'absolute', left: 0, right: 0, top: L.numberTop - m * 60, textAlign: 'center', opacity: 1 - m, scale: String(1 - m * 0.55), fontFamily: FONTS.heading, fontWeight: 900, fontSize: L.numberSize, lineHeight: 0.9, letterSpacing: -14, color: COLORS.signal, textShadow: `0 0 70px ${withAlpha(COLORS.signal, 0.55)}, 0 30px 80px rgba(0,0,0,0.7)`}}>
					{COVER.number}
				</div>
			) : null}
			{/* TEIL 3 */}
			<div style={{position: 'absolute', right: 1080 - L.partRight, top: L.partTop, rotate: '9deg', padding: '8px 18px', borderRadius: 12, background: '#FFFFFF', boxShadow: '0 12px 30px rgba(0,0,0,0.5)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 36, color: ACCENT.ink, opacity: 1 - m}}>{COVER.part}</div>
			{/* vier Fragen-Kacheln (aus der 76 heraus) */}
			{m > 0 ? (
				<div style={{position: 'absolute', left: 96, width: 888, top: 452, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18}}>
					{QUESTIONS.map((q, i) => {
						const s = springIn({frame, fps, delay: morphAt + 2 + i * 3, damping: 14, stiffness: 170});
						const fromX = (i % 2 === 0 ? 1 : -1) * 210;
						const fromY = (i < 2 ? 1 : -1) * 110 + 80;
						const icon: T3IconName[] = ['crowd', 'clock', 'scales', 'euro'];
						return (
							<div key={q.num} style={{opacity: Math.min(1, s * 1.6), translate: `${(1 - s) * fromX}px ${(1 - s) * fromY}px`, scale: String(0.5 + 0.5 * s)}}>
								<Card color={QCOLOR[q.num]} style={{height: 196, padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}} glow={0.3}>
									<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
										<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 56, lineHeight: 1, color: QCOLOR[q.num]}}>{q.num}</span>
										<IconOrb name={icon[i]} color={QCOLOR[q.num]} size={72} />
									</div>
									<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 36, color: COLORS.text}}>{q.short}</div>
								</Card>
							</div>
						);
					})}
				</div>
			) : null}
			{/* Titelzeilen (bleiben stehen) */}
			<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.kickerTop, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 58, lineHeight: 1, color: COLORS.text, textShadow: '0 8px 30px rgba(0,0,0,0.85)'}}>{COVER.kicker}</div>
			</div>
			<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.cardTop, display: 'flex', justifyContent: 'center'}}>
				<div style={{padding: '10px 30px 14px', borderRadius: 24, background: 'linear-gradient(160deg, #FF6A78 0%, #FF4D5E 50%, #D93448 100%)', boxShadow: '0 5px 0 #B32A3C, 0 10px 0 #8E1F2E, 0 40px 70px rgba(0,0,0,0.6)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 68, lineHeight: 1.05, color: '#FFFFFF', whiteSpace: 'nowrap'}}>{COVER.card}</div>
			</div>
			<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.subTop, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 800, fontSize: 34, color: COLORS.text, textShadow: '0 6px 24px rgba(0,0,0,0.9)'}}>{COVER.sub}</div>
			<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.metaTop, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, opacity: 1 - m}}>
				<BrandAvatar size={50} />
				<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 28, color: COLORS.textMuted}}>
					{COVER.date} · {handleWithAt()}
				</span>
			</div>
			{/* nur im PNG: die vier Themen als Zeile (im Video steht hier der Untertitel) */}
			{thumbnail ? (
				<div style={{position: 'absolute', left: L.sideMin - 30, right: L.sideMin - 30, top: L.chipsTop, display: 'flex', justifyContent: 'center', gap: 12}}>
					{QUESTIONS.map((q) => (
						<div key={q.num} style={{display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 14, background: 'rgba(8,10,28,0.88)', border: `2px solid ${QCOLOR[q.num]}`}}>
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 24, color: QCOLOR[q.num]}}>{q.num}</span>
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 22, color: COLORS.text, whiteSpace: 'nowrap'}}>{q.short}</span>
						</div>
					))}
				</div>
			) : null}
		</AbsoluteFill>
	);
};

/** Szene 1 – Titelbild im Video (ab Frame 0 vollständig, ≈ 1 s stehend), dann 76 → vier Fragen. */
export const CoverScene: React.FC<SceneProps> = ({cues}) => {
	const frame = useCurrentFrame();
	const h2 = cue(cues, 'hook2', 34);
	const morphAt = Math.max(30, Math.min(h2.from + 2, wordFrame(cues, '76', h2.from + 10)));
	const morph = interpolate(frame, [morphAt, morphAt + 16], [0, 1], clamp);
	return (
		<AbsoluteFill>
			<Teil3Cover morph={morph} morphAt={morphAt} />
			<Sfx name="impact" at={0} volume={0.5} />
			<Sfx name="whoosh" at={morphAt - 2} volume={0.7} />
			{[0, 1, 2, 3].map((i) => (
				<Sfx key={i} name="pop" at={morphAt + 4 + i * 3} volume={0.45} />
			))}
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 2: Prognose */

/** Punkte-Raster (1 Punkt ≈ 100 Menschen): erscheint als Welle; `soft` Punkte am Ende sind nur umrandet (Spanne). */
const DotGrid: React.FC<{count: number; soft?: number; cols: number; dot: number; gap: number; color: string; at: number}> = ({count, soft = 0, cols, dot, gap, color, at}) => {
	const frame = useCurrentFrame();
	return (
		<div style={{display: 'grid', gridTemplateColumns: `repeat(${cols}, ${dot}px)`, gap, direction: 'ltr'}}>
			{new Array(count + soft).fill(0).map((_, i) => {
				const row = Math.floor(i / cols);
				const col = i % cols;
				const d = (row + col * 0.6) * 0.9;
				const a = interpolate(frame, [at + d, at + d + 8], [0, 1], {...clamp, easing: EASE_OUT});
				const isSoft = i >= count;
				const bob = Math.sin(frame / 9 + i * 0.7) * 1.5 * a;
				return (
					<div
						key={i}
						style={{
							width: dot,
							height: dot,
							borderRadius: dot / 2,
							background: isSoft ? 'transparent' : `radial-gradient(circle at 35% 30%, ${withAlpha('#FFFFFF', 0.55)}, ${color} 55%)`,
							border: isSoft ? `2.5px dashed ${withAlpha(color, 0.9)}` : 'none',
							boxShadow: isSoft ? 'none' : `0 0 10px ${withAlpha(color, 0.45)}`,
							opacity: a,
							scale: String(0.4 + 0.6 * a),
							translate: `0 ${bob}px`,
						}}
					/>
				);
			})}
		</div>
	);
};

/** Szene 2 – Frage 1: Prognose 2.000 vs. tatsächlich 8.000–9.000 (abstrakte Menge), dann Planungsakte „Warum?“ (offen). */
export const ForecastScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const a = cue(cues, 'q1a', 4);
	const b = cue(cues, 'q1b', 80);
	const c = cue(cues, 'q1c', 150);
	const atExpected = Math.min(wordFrame(cues, '2.000', a.from + 40), a.from + 46);
	const atActual = wordFrame(cues, 'Gekommen', b.from);
	const atFactor = wordFrame(cues, 'viermal', b.from + 40);
	const atWhy = c.from;
	const toFile = interpolate(frame, [atWhy - 6, atWhy + 12], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const q = springIn({frame, fps, delay: atWhy + 10, damping: 9, stiffness: 200});
	const drift = interpolate(frame, [0, durationInFrames], [0, 1], clamp);
	const factor = springIn({frame, fps, delay: atFactor - 4, damping: 10, stiffness: 190});
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{top: 160, scale: String(1.05 + drift * 0.05), filter: `brightness(${0.75 - toFile * 0.25})`}}>
				<IsoCity progress={drift} crowd={60} centerY={1000} seed="t3-forecast" />
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.96) 0%, rgba(4,6,20,0.82) 26%, rgba(4,6,20,0.55) 50%, rgba(4,6,20,0.7) 75%, rgba(4,6,20,0.9) 100%)'}} />
			<div style={{position: 'absolute', left: 64, top: 290}}>
				<Tag num="01" text="FRAGE 01 · PROGNOSE" />
			</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 350}}>
				<Headline lines={QUESTIONS[0].title} color={ACCENT.info} size={56} />
			</div>
			{/* Vergleich Prognose ↔ tatsächlich */}
			<div style={{position: 'absolute', left: 64, width: 866, top: 492, opacity: 1 - toFile * 0.82, scale: String(1 - toFile * 0.12), transformOrigin: '50% 0%', filter: toFile > 0 ? `blur(${toFile * 3}px)` : undefined}}>
				<Card color={withAlpha('#FFFFFF', 0.35)} style={{padding: '22px 24px 22px', display: 'flex', gap: 26, alignItems: 'flex-end', height: 556}} glow={0}>
					<div style={{width: 300, display: 'flex', flexDirection: 'column', gap: 8, height: '100%'}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
							<T3Icon name="calendar" size={30} color={ACCENT.info} />
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, letterSpacing: 2, color: ACCENT.info}}>{FORECAST.expectedLabel}</span>
						</div>
						<div style={{height: 96}}>{frame >= atExpected - 8 ? <RollNumber from={0} to={FORECAST.expected} at={atExpected - 8} dur={16} size={96} color={ACCENT.info} /> : null}</div>
						<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted, opacity: interpolate(frame, [atExpected, atExpected + 8], [0, 1], clamp)}}>{FORECAST.expectedNote}</div>
						<div style={{flex: 1}} />
						<DotGrid count={FORECAST.expected / FORECAST.perDot} cols={5} dot={28} gap={7} color={ACCENT.info} at={atExpected - 4} />
					</div>
					<div style={{width: 2, alignSelf: 'stretch', background: 'linear-gradient(rgba(255,255,255,0), rgba(255,255,255,0.25), rgba(255,255,255,0))'}} />
					<div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 8, height: '100%'}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 10, opacity: interpolate(frame, [atActual - 8, atActual], [0.35, 1], clamp)}}>
							<T3Icon name="crowd" size={32} color={COLORS.signal} />
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, letterSpacing: 2, color: COLORS.signal}}>{FORECAST.actualLabel}</span>
						</div>
						<div style={{height: 96, display: 'flex', alignItems: 'center', gap: 0, whiteSpace: 'nowrap'}}>
							{frame >= atActual - 6 ? (
								<>
									<RollNumber from={FORECAST.expected} to={FORECAST.actualFrom} at={atActual - 6} dur={18} size={74} color={COLORS.signal} />
									<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 74, lineHeight: 0.9, letterSpacing: -2.6, color: COLORS.signal, whiteSpace: 'nowrap', opacity: interpolate(frame, [atActual + 10, atActual + 18], [0, 1], clamp)}}>–{de(FORECAST.actualTo)}</span>
								</>
							) : null}
						</div>
						<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted, opacity: interpolate(frame, [atActual + 6, atActual + 14], [0, 1], clamp)}}>{FORECAST.actualNote}</div>
						<div style={{flex: 1}} />
						{frame >= atActual - 6 ? <DotGrid count={FORECAST.actualFrom / FORECAST.perDot} soft={(FORECAST.actualTo - FORECAST.actualFrom) / FORECAST.perDot} cols={10} dot={28} gap={7} color={COLORS.signal} at={atActual - 4} /> : <div style={{height: 308}} />}
					</div>
				</Card>
				{/* Faktor-Plakette */}
				{frame >= atFactor - 5 ? (
					<div style={{position: 'absolute', left: 84, top: 214, width: 170, height: 170, borderRadius: 85, background: `radial-gradient(circle at 35% 30%, #FFE680, ${COLORS.signal} 60%, #E0A800)`, boxShadow: `0 0 50px ${withAlpha(COLORS.signal, 0.6)}, 0 20px 40px rgba(0,0,0,0.5)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: Math.min(1, factor * 2), scale: String(0.3 + 0.7 * factor), rotate: `${(1 - factor) * -30 - 8}deg`}}>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 58, lineHeight: 1, color: ACCENT.ink}}>{FORECAST.factor}</span>
						<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 22, color: ACCENT.ink}}>so viele</span>
					</div>
				) : null}
				<div style={{marginTop: 12, display: 'flex', justifyContent: 'space-between', fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted}}>
					<span>1 Punkt ≈ 100 Menschen · gestrichelt = Spanne bis 9.000</span>
				</div>
				<div style={{marginTop: 8, fontFamily: FONTS.body, fontWeight: 700, fontSize: 23, color: COLORS.text, opacity: interpolate(frame, [atFactor + 4, atFactor + 14], [0, 0.9], clamp)}}>{FORECAST.online}</div>
			</div>
			{/* Planungsakte + offene Frage */}
			{frame >= atWhy - 6 ? (
				<>
					<div style={{position: 'absolute', left: 180, top: 520 + (1 - toFile) * 260, opacity: toFile}}>
						<Dossier label={FORECAST.file} at={atWhy - 6} width={540} color={ACCENT.info} scanFrom={atWhy + 4} badge="ILLUSTRATION" />
						<div style={{position: 'absolute', left: 340, top: -60, width: 230, height: 230, borderRadius: 115, background: withAlpha(ACCENT.no, 0.18), border: `8px solid ${ACCENT.no}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 170, lineHeight: 1, color: '#FFFFFF', textShadow: `0 0 30px ${withAlpha(ACCENT.no, 0.8)}`, opacity: Math.min(1, q * 2), scale: String(1.8 - 0.8 * q), rotate: '10deg'}}>?</div>
					</div>
					<div style={{position: 'absolute', left: 64, width: 866, top: 950, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
						<Pop at={atWhy + 6} dy={30}>
							<div style={{padding: '12px 28px 16px', borderRadius: 24, background: 'linear-gradient(160deg, #FF6A78 0%, #FF4D5E 50%, #D93448 100%)', boxShadow: '0 5px 0 #B32A3C, 0 30px 60px rgba(0,0,0,0.55)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 54, lineHeight: 1.04, color: '#FFFFFF', textAlign: 'center'}}>
								{FORECAST.open[0]} {FORECAST.open[1]}
							</div>
						</Pop>
						<Pop at={atWhy + 14} dy={14}>
							<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
								<Status kind="OFFEN" size={24} />
								<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 27, color: COLORS.text, textShadow: '0 4px 16px rgba(0,0,0,0.9)'}}>{FORECAST.openNote}</span>
							</div>
						</Pop>
					</div>
				</>
			) : null}
			<SourceBar text={FORECAST.source} at={a.from + 10} />
			<Sfx name="whoosh" at={0} volume={0.45} />
			<Sfx name="pop" at={atExpected - 8} volume={0.6} />
			<Sfx name="softImpact" at={atActual - 6} volume={0.7} />
			<Sfx name="impact" at={atFactor - 4} volume={0.55} />
			<Sfx name="paper" at={atWhy - 6} volume={0.6} />
			<Sfx name="stamp" at={atWhy + 10} volume={0.55} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 3: Phasen */

/** Stilisierte, friedliche Demo (Illustration): Figuren mit Schildern, ruhiges Gehen. */
const DemoGroup: React.FC<{width: number; height: number; calm: number}> = ({width, height, calm}) => {
	const frame = useCurrentFrame();
	const people = new Array(9).fill(0).map((_, i) => ({x: 34 + i * ((width - 60) / 8) + (random(`dg-x-${i}`) - 0.5) * 18, y: height - 18 - (i % 3) * 22, h: 120 + random(`dg-h-${i}`) * 26, seed: `t3-demo-${i}`, sign: i % 2 === 0}));
	people.sort((p, q) => p.y - q.y);
	const colors = ['#FFD23F', '#3DDC97', '#4FC3F7', '#FF8FA3', '#B794F6'];
	return (
		<svg width={width} height={height} style={{position: 'absolute', left: 0, top: 0}}>
			<defs>
				<radialGradient id="t3-demo-glow" cx="50%" cy="100%" r="80%">
					<stop offset="0%" stopColor={withAlpha(ACCENT.yes, 0.35 * calm)} />
					<stop offset="100%" stopColor={withAlpha(ACCENT.yes, 0)} />
				</radialGradient>
			</defs>
			<rect x={0} y={0} width={width} height={height} fill="url(#t3-demo-glow)" />
			{people.map((p, i) => {
				const walk = Math.sin(frame / 7 + i);
				return (
					<g key={p.seed}>
						{p.sign ? (
							<g transform={`translate(${p.x + 14} ${p.y - p.h - 26 + walk * 2}) rotate(${walk * 3})`}>
								<rect x={-2} y={18} width={4} height={50} fill="#C9B79A" />
								<rect x={-30} y={-14} width={60} height={36} rx={4} fill={colors[i % colors.length]} stroke="#FFFFFF" strokeWidth={2} />
							</g>
						) : null}
						<Person x={p.x} y={p.y} h={p.h} seed={p.seed} step={walk * 0.35} rim={withAlpha(ACCENT.yes, 0.3 + 0.5 * calm)} />
					</g>
				);
			})}
		</svg>
	);
};

/** Abendliche Innenstadt nach der Auflösung (symbolisch: Lichtschein, Funken, Blaulicht – keine Gewaltdarstellung). */
const NightStreet: React.FC<{width: number; height: number; intensity: number}> = ({width, height, intensity}) => {
	const frame = useCurrentFrame();
	const blink = (k: number) => (Math.sin(frame / 3 + k) > 0.3 ? 1 : 0.25);
	return (
		<svg width={width} height={height} style={{position: 'absolute', left: 0, top: 0}}>
			<defs>
				<radialGradient id="t3-ns-glow" cx="55%" cy="80%" r="60%">
					<stop offset="0%" stopColor={withAlpha('#FF7A3D', 0.65 * intensity)} />
					<stop offset="100%" stopColor="rgba(255,122,61,0)" />
				</radialGradient>
				<linearGradient id="t3-ns-sky" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#0B0E2A" />
					<stop offset="1" stopColor="#2A1530" />
				</linearGradient>
			</defs>
			<rect x={0} y={0} width={width} height={height} fill="url(#t3-ns-sky)" />
			{new Array(7).fill(0).map((_, i) => {
				const bw = 40 + random(`ns-w-${i}`) * 40;
				const bh = 90 + random(`ns-h-${i}`) * (height * 0.55);
				const x = i * (width / 6.5) - 10;
				return (
					<g key={i}>
						<rect x={x} y={height - bh} width={bw} height={bh} fill="#141634" />
						{new Array(Math.floor(bh / 26)).fill(0).map((__, k) =>
							random(`ns-l-${i}-${k}`) > 0.55 ? <rect key={k} x={x + 8 + (k % 2) * 16} y={height - bh + 12 + k * 24} width={9} height={12} fill={withAlpha('#FFD58A', 0.75)} /> : null,
						)}
					</g>
				);
			})}
			<rect x={0} y={0} width={width} height={height} fill="url(#t3-ns-glow)" />
			{new Array(26).fill(0).map((_, i) => {
				const t = ((frame * (0.6 + random(`sp-v-${i}`) * 0.8) + random(`sp-o-${i}`) * 120) % 120) / 120;
				const x = width * (0.3 + random(`sp-x-${i}`) * 0.5) + Math.sin(t * 6 + i) * 10;
				const y = height * 0.95 - t * height * 0.75;
				return <circle key={i} cx={x} cy={y} r={2 + random(`sp-r-${i}`) * 2.5} fill="#FFB15C" opacity={(1 - t) * intensity} />;
			})}
			<circle cx={width * 0.14} cy={height * 0.82} r={16} fill={withAlpha('#3B7BFF', 0.85 * blink(0) * intensity)} />
			<circle cx={width * 0.14} cy={height * 0.82} r={46} fill={withAlpha('#3B7BFF', 0.25 * blink(0) * intensity)} />
			<circle cx={width * 0.86} cy={height * 0.86} r={14} fill={withAlpha('#3B7BFF', 0.85 * blink(2) * intensity)} />
			<circle cx={width * 0.86} cy={height * 0.86} r={40} fill={withAlpha('#3B7BFF', 0.22 * blink(2) * intensity)} />
		</svg>
	);
};

/** Szene 3 – Frage 2: Gewalt schon vor der Auflösung (6 Verletzte laut Innenminister), 181 nur als Kontext, Mehrheit friedlich. */
export const PhasesScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const a = cue(cues, 'q2a', 4);
	const b = cue(cues, 'q2b', 90);
	const c = cue(cues, 'q2c', 200);
	const atDiss = wordFrame(cues, 'Auflösung', a.from + 50);
	const atSix = wordFrame(cues, 'sechs', b.from + 10);
	const atSevere = wordFrame(cues, 'schwer', b.from + 40);
	const atTotal = Math.min(wordFrame(cues, 'insgesamt', b.from + 60), wordFrame(cues, '181', b.from + 80));
	const atPeace = Math.min(wordFrame(cues, 'Mehrheit', c.from + 10), c.from + 8);
	const head = interpolate(frame, [a.from, atDiss + 4], [0.04, 0.5], {...clamp, easing: EASE_IN_OUT});
	const head2 = interpolate(frame, [atTotal - 4, atTotal + 14], [0, 0.46], {...clamp, easing: EASE_IN_OUT});
	const playhead = head + head2;
	const six = springIn({frame, fps, delay: atSix - 4, damping: 10, stiffness: 200});
	const calm = interpolate(frame, [atPeace - 4, atPeace + 12], [0, 1], clamp);
	const rightOn = interpolate(frame, [atTotal - 6, atTotal + 10], [0.35, 1], clamp);
	const panelW = 420;
	const panelH = 360;
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<NightBg progress={frame / durationInFrames} alert={0.15 + rightOn * 0.25} blur={4} />
			<div style={{position: 'absolute', left: 64, top: 290}}>
				<Tag num="02" text="FRAGE 02 · GEWALT" />
			</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 350}}>
				<Headline lines={QUESTIONS[1].title} color={ACCENT.no} size={56} />
			</div>
			{/* Zitat (offizielle Angabe) */}
			<div style={{position: 'absolute', left: 64, width: 866, top: 482}}>
				<Pop at={a.from + 2} dy={24}>
					<Card color={ACCENT.info} style={{padding: '14px 20px 14px'}} glow={0.15}>
						<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
							<Status kind="OFFIZIELL" size={20} />
							<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted}}>{PHASES.quoteBy}</span>
						</div>
						<div style={{marginTop: 8, fontFamily: FONTS.heading, fontWeight: 800, fontSize: 31, lineHeight: 1.15, color: COLORS.text}}>{PHASES.quote}</div>
					</Card>
				</Pop>
			</div>
			{/* Zeitleiste */}
			<div style={{position: 'absolute', left: 64, width: 866, top: 668}}>
				<div style={{position: 'relative', height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.14)'}}>
					<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${playhead * 100}%`, borderRadius: 5, background: `linear-gradient(90deg, ${ACCENT.yes}, ${ACCENT.signal} 50%, #FF7A3D)`}} />
					<div style={{position: 'absolute', left: '50%', top: -16, width: 4, height: 42, translate: '-50% 0', background: '#FFFFFF', borderRadius: 2}} />
					<div style={{position: 'absolute', left: `${playhead * 100}%`, top: -9, width: 28, height: 28, borderRadius: 14, translate: '-50% 0', background: '#FFFFFF', boxShadow: `0 0 22px ${ACCENT.signal}`}} />
				</div>
				<div style={{position: 'absolute', left: '50%', top: 30, translate: '-50% 0', display: 'flex', alignItems: 'center', gap: 8, padding: '4px 12px', borderRadius: 10, background: 'rgba(8,10,28,0.92)', border: '2px solid rgba(255,255,255,0.4)'}}>
					<T3Icon name="clock" size={24} color="#FFFFFF" />
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 22, letterSpacing: 2, color: COLORS.text}}>AUFLÖSUNG</span>
				</div>
			</div>
			{/* zwei Phasen */}
			<div style={{position: 'absolute', left: 64, width: 866, top: 742, display: 'flex', justifyContent: 'space-between'}}>
				{/* links: während der Demo */}
				<div style={{position: 'relative', width: panelW, height: panelH, borderRadius: 26, overflow: 'hidden', border: `3px solid ${withAlpha(calm > 0 ? ACCENT.yes : ACCENT.signal, 0.9)}`, boxShadow: `0 24px 50px rgba(0,0,0,0.5), 0 0 ${30 + calm * 30}px ${withAlpha(calm > 0 ? ACCENT.yes : ACCENT.signal, 0.3)}`, background: 'linear-gradient(#1B2150, #0C1030)'}}>
					<DemoGroup width={panelW} height={panelH} calm={calm} />
					<div style={{position: 'absolute', left: 16, top: 14}}>
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: COLORS.text, textShadow: '0 3px 12px rgba(0,0,0,0.9)'}}>{PHASES.left.title}</div>
						<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted}}>{PHASES.left.sub}</div>
					</div>
					{/* kleines Warnsymbol */}
					<div style={{position: 'absolute', right: 18, top: 90, opacity: interpolate(frame, [a.from + 10, a.from + 20], [0, 1], clamp) * (0.75 + 0.25 * Math.sin(frame / 5))}}>
						<T3Icon name="alert" size={54} color={ACCENT.signal} stroke={2.4} />
					</div>
					{/* 6 Verletzte */}
					{frame >= atSix - 5 ? (
						<div style={{position: 'absolute', left: 14, right: 14, bottom: 14, padding: '10px 14px', borderRadius: 18, background: 'rgba(8,10,28,0.94)', border: `2px solid ${ACCENT.no}`, display: 'flex', alignItems: 'center', gap: 14, opacity: Math.min(1, six * 2), translate: `0 ${(1 - six) * 40}px`}}>
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 110, lineHeight: 0.9, color: ACCENT.no, textShadow: `0 0 30px ${withAlpha(ACCENT.no, 0.6)}`}}>{PHASES.injuredBefore}</span>
							<div>
								<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, lineHeight: 1.05, color: COLORS.text}}>{PHASES.injuredBeforeLabel}</div>
								<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted, opacity: interpolate(frame, [atSevere - 4, atSevere + 4], [0, 1], clamp)}}>{PHASES.severe}</div>
							</div>
						</div>
					) : null}
				</div>
				{/* rechts: nach der Auflösung */}
				<div style={{position: 'relative', width: panelW, height: panelH, borderRadius: 26, overflow: 'hidden', border: `3px solid ${withAlpha('#FF7A3D', 0.4 + 0.5 * rightOn)}`, boxShadow: '0 24px 50px rgba(0,0,0,0.5)', opacity: 0.55 + 0.45 * rightOn}}>
					<NightStreet width={panelW} height={panelH} intensity={0.35 + 0.65 * rightOn} />
					<div style={{position: 'absolute', left: 16, top: 14}}>
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: COLORS.text, textShadow: '0 3px 12px rgba(0,0,0,0.9)'}}>{PHASES.right.title}</div>
						<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted}}>{PHASES.right.sub}</div>
					</div>
					{frame >= atTotal - 4 ? (
						<div style={{position: 'absolute', left: 14, right: 14, bottom: 14}}>
							<Pop at={atTotal - 4} dy={20}>
								<div style={{padding: '8px 14px', borderRadius: 16, background: 'rgba(8,10,28,0.9)', border: '2px solid rgba(255,255,255,0.35)', display: 'flex', alignItems: 'baseline', gap: 10}}>
									<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 52, color: '#FFFFFF'}}>{PHASES.total}</span>
									<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, lineHeight: 1.1, color: COLORS.textMuted}}>{PHASES.totalLabel}</span>
								</div>
							</Pop>
						</div>
					) : null}
				</div>
			</div>
			{/* friedliche Mehrheit */}
			{frame >= atPeace - 6 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 1116, display: 'flex', justifyContent: 'center'}}>
					<Pop at={atPeace - 6} dy={24}>
						<div style={{display: 'inline-flex', alignItems: 'center', gap: 12, padding: '10px 22px', borderRadius: 18, background: 'rgba(8,10,28,0.95)', border: `3px solid ${ACCENT.yes}`, boxShadow: `0 0 30px ${withAlpha(ACCENT.yes, 0.35)}`}}>
							<T3Icon name="check" size={40} color={ACCENT.yes} stroke={3} />
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 36, color: COLORS.text}}>{PHASES.peaceful}</span>
						</div>
					</Pop>
				</div>
			) : null}
			<SourceBar text={PHASES.source} at={a.from + 10} />
			<Sfx name="whoosh" at={0} volume={0.45} />
			<Sfx name="paper" at={a.from + 2} volume={0.5} />
			<Sfx name="click" at={atDiss} volume={0.5} />
			<Sfx name="impact" at={atSix - 4} volume={0.6} />
			<Sfx name="blip" at={atTotal - 4} volume={0.5} />
			<Sfx name="pop" at={atPeace - 6} volume={0.6} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 4: Unter 14 */

/** Szene 4 – Frage 3: zwei Tatverdächtige unter 14 → strafunmündig (§ 19 StGB) → andere Folgen möglich (Jugendamt, Schadenersatz, Eltern nicht automatisch). */
export const Under14Scene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const a = cue(cues, 'q3a', 4);
	const b = cue(cues, 'q3b', 80);
	const cc = cue(cues, 'q3c', 130);
	const d = cue(cues, 'q3d', 230);
	const at14 = Math.min(wordFrame(cues, '14', a.from + 50), a.from + 40);
	const atStamp = Math.min(wordFrame(cues, 'strafunmündig', b.from + 6), b.from + 6);
	const atYouth = Math.min(wordFrame(cues, 'Jugendamt', cc.from + 10), cc.from + 8);
	const atCivil = wordFrame(cues, 'Schadenersatz', cc.from + 60);
	const atParents = Math.min(wordFrame(cues, 'Eltern', d.from + 2), d.from + 2);
	const stamp = springIn({frame, fps, delay: atStamp - 6, damping: 9, stiffness: 220});
	const compact = interpolate(frame, [cc.from - 8, cc.from + 10], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const drift = frame / durationInFrames;
	const ageS = springIn({frame, fps, delay: a.from, damping: 13, stiffness: 160});
	const itemAt = [atYouth - 2, atCivil - 4, atParents - 4];
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse 110% 60% at 50% 45%, #2C2160 0%, #131544 50%, #070A22 100%)'}} />
			{/* Waage als Wasserzeichen */}
			<div style={{position: 'absolute', left: 540 - 380, top: 560 - drift * 40, opacity: 0.08, rotate: `${Math.sin(frame / 40) * 3}deg`}}>
				<T3Icon name="scales" size={760} color="#FFFFFF" stroke={0.6} />
			</div>
			<div style={{position: 'absolute', left: 64, top: 290}}>
				<Tag num="03" text="FRAGE 03 · RECHT" />
			</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 350}}>
				<Headline lines={['2 TATVERDÄCHTIGE', 'UNTER 14']} color={ACCENT.law} size={56} />
			</div>
			{/* Alter + Stempel (rückt nach oben, sobald die Folgen kommen) */}
			<div style={{position: 'absolute', left: 64, width: 866, top: 492 - compact * 10, height: 360, scale: String(1 - compact * 0.5), transformOrigin: '0% 0%'}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 28, opacity: Math.min(1, ageS * 2), translate: `0 ${(1 - ageS) * 40}px`}}>
					{/* Kalender-Alters-Symbol */}
					<div style={{position: 'relative', width: 230, height: 250, borderRadius: 26, background: 'linear-gradient(#F4F1EA, #DCD7CB)', boxShadow: '0 24px 50px rgba(0,0,0,0.5)', overflow: 'hidden', flexShrink: 0}}>
						<div style={{height: 64, background: ACCENT.law, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 32, letterSpacing: 3, color: '#FFFFFF'}}>{UNDER14.headline}</div>
						<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 186, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 150, color: ACCENT.ink}}>{frame >= at14 - 10 ? <RollNumber from={18} to={14} at={at14 - 10} dur={12} size={150} color={ACCENT.ink} /> : '?'}</div>
					</div>
					<div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
						<div style={{display: 'flex', alignItems: 'baseline', gap: 14}}>
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 150, lineHeight: 0.9, color: ACCENT.law, textShadow: `0 0 40px ${withAlpha(ACCENT.law, 0.6)}`}}>{UNDER14.count}</span>
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, lineHeight: 1.05, color: COLORS.text}}>
								TATVER-
								<br />
								DÄCHTIGE
							</span>
						</div>
						<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
							<Status kind="OFFIZIELL" size={20} />
							<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 23, color: COLORS.textMuted}}>{UNDER14.countNote}</span>
						</div>
					</div>
				</div>
				{frame >= atStamp - 6 ? (
					<div style={{position: 'absolute', left: 70, top: 266, opacity: Math.min(1, stamp * 2), scale: String(1.7 - 0.7 * stamp), rotate: '-4deg'}}>
						<div style={{padding: '10px 26px 12px', border: `7px solid ${ACCENT.law}`, borderRadius: 18, background: 'rgba(20,12,48,0.9)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 66, letterSpacing: 2, color: '#FFFFFF', textShadow: `0 0 24px ${withAlpha(ACCENT.law, 0.8)}`}}>{UNDER14.stamp}</div>
					</div>
				) : null}
			</div>
			{/* § 19 StGB */}
			{frame >= atStamp ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 900, opacity: 1 - compact, display: 'flex', flexDirection: 'column', gap: 8}}>
					<Pop at={atStamp} dy={16}>
						<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
							<LawChip text="§ 19 StGB" size={28} />
							<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, lineHeight: 1.2, color: COLORS.text, maxWidth: 640}}>{UNDER14.law.replace('§ 19 StGB: ', '')}</span>
						</div>
					</Pop>
				</div>
			) : null}
			{/* zwei Karten + Folgen */}
			{frame >= cc.from - 8 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 690, display: 'flex', flexDirection: 'column', gap: 12}}>
					<div style={{display: 'flex', gap: 16}}>
						<Pop at={cc.from - 6} dy={24} style={{flex: '0 0 318px'}}>
							<Card color={ACCENT.no} style={{height: 104, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12}} glow={0.15}>
								<T3Icon name="gavelOff" size={44} color={ACCENT.no} />
								<div>
									<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 27, color: COLORS.text, whiteSpace: 'nowrap'}}>{UNDER14.noPunish.title}</div>
									<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 19, lineHeight: 1.15, color: COLORS.textMuted}}>{UNDER14.noPunish.text}</div>
								</div>
							</Card>
						</Pop>
						<Pop at={cc.from - 2} dy={24} style={{flex: 1}}>
							<Card color={ACCENT.law} style={{height: 104, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 14}} glow={0.3}>
								<IconOrb name="book" color={ACCENT.law} size={64} />
								<div>
									<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 27, color: COLORS.text, whiteSpace: 'nowrap'}}>{UNDER14.other.title}</div>
									<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted}}>{UNDER14.other.text}</div>
								</div>
							</Card>
						</Pop>
					</div>
					{UNDER14.items.map((it, i) => (
						<Pop key={it.title} at={itemAt[i]} dx={60} dy={0}>
							<div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '10px 16px', borderRadius: 20, background: 'rgba(12,12,40,0.93)', border: `2px solid ${withAlpha(ACCENT.law, i === 2 ? 0.95 : 0.6)}`}}>
								<IconOrb name={it.icon as T3IconName} color={i === 2 ? ACCENT.signal : ACCENT.law} size={58} />
								<div style={{flex: 1}}>
									<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, color: COLORS.text}}>{it.title}</div>
									<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted}}>{it.text}</div>
								</div>
								<LawChip text={it.law} size={20} />
							</div>
						</Pop>
					))}
				</div>
			) : null}
			<div style={{position: 'absolute', left: 64, width: 866, top: 1150, opacity: interpolate(frame, [a.from + 6, a.from + 16], [0, 1], clamp), fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: ACCENT.law}}>{UNDER14.disclaimer}</div>
			<SourceBar text="§ 19 StGB · §§ 828, 832 BGB · § 27 SGB VIII (gesetze-im-internet.de) · Zahl: Innenminister (hr, dpa)" at={a.from + 10} />
			<Sfx name="whoosh" at={0} volume={0.45} />
			<Sfx name="click" at={at14 - 10} volume={0.6} />
			<Sfx name="stamp" at={atStamp - 6} volume={0.7} />
			<Sfx name="pop" at={cc.from - 6} volume={0.5} />
			{itemAt.map((f, i) => (
				<Sfx key={i} name="click" at={f} volume={0.5} />
			))}
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 5: Schäden */

/** Gesprungenes Glas über den Schaufenstern (Illustration). */
const Cracks: React.FC<{width: number; amount: number}> = ({width, amount}) => {
	const h = (width * 580) / 800;
	const lines = (cx: number, cy: number, seed: string) =>
		new Array(9).fill(0).map((_, i) => {
			const ang = (i / 9) * Math.PI * 2 + random(`${seed}-a-${i}`) * 0.5;
			const len = 60 + random(`${seed}-l-${i}`) * 110;
			const mid = 0.5 + random(`${seed}-m-${i}`) * 0.2;
			const x1 = cx + Math.cos(ang) * len * mid + random(`${seed}-j-${i}`) * 12;
			const y1 = cy + Math.sin(ang) * len * mid;
			const x2 = cx + Math.cos(ang) * len * amount;
			const y2 = cy + Math.sin(ang) * len * amount;
			return <path key={i} d={`M${cx} ${cy} L${x1} ${y1} L${x2} ${y2}`} stroke="#E8F4FF" strokeWidth={2.4} fill="none" opacity={0.85} />;
		});
	return (
		<svg width={width} height={h} viewBox="0 300 800 580" style={{position: 'absolute', left: 0, top: 0}}>
			<g opacity={amount}>
				{lines(400, 640, 'ck1')}
				<circle cx={400} cy={640} r={10} fill="none" stroke="#E8F4FF" strokeWidth={2} />
				{lines(170, 700, 'ck2')}
			</g>
		</svg>
	);
};

/** Szene 5 – Frage 4: Wer zahlt? Schaden → Versicherung → mögliche Stadthilfe (Prüfung, keine Zusage); Gesamtschaden offen. */
export const DamageScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const a = cue(cues, 'q4a', 4);
	const b = cue(cues, 'q4b', 60);
	const c = cue(cues, 'q4c', 150);
	const d = cue(cues, 'q4d', 230);
	const atCity = Math.min(wordFrame(cues, 'Stadt', b.from + 4), b.from + 4);
	const atIns = wordFrame(cues, 'Versicherungen', b.from + 50);
	const atCheck = Math.min(wordFrame(cues, 'prüft', c.from + 30), c.from + 24);
	const atNoPromise = wordFrame(cues, 'Zusage', c.from + 60);
	const atTotal = Math.min(wordFrame(cues, 'Gesamtschaden', d.from + 2), d.from + 2);
	const toFlow = interpolate(frame, [atCity - 8, atCity + 12], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const dolly = interpolate(frame, [0, durationInFrames], [0, 1], clamp);
	const crack = interpolate(frame, [a.from + 8, a.from + 20], [0, 1], {...clamp, easing: EASE_OUT});
	const stepAt = [atCity + 2, atIns - 4, atCheck - 4];
	const stepColor = [ACCENT.no, ACCENT.info, ACCENT.signal];
	const stepIcon: T3IconName[] = ['crack', 'shield', 'search'];
	const qPulse = 0.6 + 0.4 * Math.sin(frame / 6);
	const noProm = springIn({frame, fps, delay: atNoPromise - 6, damping: 11, stiffness: 200});
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{scale: String(1.08 - dolly * 0.04)}}>
				<NightCity mood={MOODS.dusk} progress={dolly} litRatio={0.35} bokeh={10} showPromenade={false} />
			</AbsoluteFill>
			{/* Ladenfront (Illustration) – Kamera fährt danach nach oben auf die Übersicht */}
			<div style={{position: 'absolute', left: 90, top: 520 - toFlow * 120, scale: String(1 + (1 - toFlow) * dolly * 0.08 - toFlow * 0.12), transformOrigin: '50% 30%', opacity: 1 - toFlow * 0.72, filter: toFlow > 0 ? `blur(${toFlow * 5}px)` : undefined}}>
				<div style={{position: 'relative'}}>
					<Storefront width={900} label="GESCHÄFT" motif="fashion" panes={3} upper={false} light={0.8} seed="t3-shop" />
					<Cracks width={900} amount={crack} />
					<div style={{position: 'absolute', right: 14, top: 14, padding: '4px 10px', borderRadius: 8, background: 'rgba(8,10,28,0.85)', fontFamily: FONTS.body, fontWeight: 800, fontSize: 20, letterSpacing: 1.5, color: COLORS.textMuted}}>ILLUSTRATION</div>
				</div>
			</div>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.95) 0%, rgba(4,6,20,0.7) 24%, rgba(4,6,20,0.15) 40%, rgba(4,6,20,0.25) 70%, rgba(4,6,20,0.85) 100%)'}} />
			<div style={{position: 'absolute', left: 64, top: 290}}>
				<Tag num="04" text="FRAGE 04 · SCHÄDEN" />
			</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 350}}>
				<Headline lines={QUESTIONS[3].title} color={COLORS.signal} size={56} />
			</div>
			{/* Treffen im Römer */}
			{frame >= atCity - 6 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 484}}>
					<Pop at={atCity - 6} dy={20}>
						<div style={{display: 'inline-flex', alignItems: 'center', gap: 12, padding: '8px 16px', borderRadius: 14, background: 'rgba(8,10,28,0.93)', border: `2px solid ${ACCENT.info}`}}>
							<T3Icon name="cityhall" size={32} color={ACCENT.info} />
							<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 25, color: COLORS.text}}>{DAMAGE.meeting}</span>
						</div>
					</Pop>
				</div>
			) : null}
			{/* Ablauf: Schaden → Versicherung → mögliche Stadthilfe */}
			<div style={{position: 'absolute', left: 64, width: 866, top: 566, display: 'flex', flexDirection: 'column', gap: 0}}>
				{DAMAGE.steps.map((s, i) => {
					const on = frame >= stepAt[i] - 1;
					const arrow = interpolate(frame, [stepAt[i] - 8, stepAt[i]], [0, 1], clamp);
					return (
						<div key={s.num}>
							{i > 0 ? (
								<div style={{height: 42, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
									<svg width={40} height={42} style={{opacity: arrow}}>
										<path d={`M20 2 V${2 + 30 * arrow}`} stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" strokeDasharray="6 7" strokeDashoffset={-frame * 1.2} />
										<path d="M10 28 L20 39 L30 28" stroke="#FFFFFF" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={arrow} />
									</svg>
								</div>
							) : null}
							{on ? (
								<Pop at={stepAt[i]} dx={-60} dy={0}>
									<Card color={stepColor[i]} style={{height: 118, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 16, outline: i === 2 && frame >= atNoPromise - 6 ? `3px dashed ${withAlpha(ACCENT.signal, qPulse)}` : undefined, outlineOffset: 6}} glow={0.25}>
										<div style={{width: 58, height: 58, borderRadius: 29, background: stepColor[i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 32, color: ACCENT.ink, flexShrink: 0}}>{s.num}</div>
										<IconOrb name={stepIcon[i]} color={stepColor[i]} size={66} />
										<div style={{flex: 1}}>
											<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, color: COLORS.text}}>{s.title}</div>
											<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 23, color: COLORS.textMuted}}>{s.text}</div>
										</div>
										{i === 2 ? (
											<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
												<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 54, lineHeight: 1, color: ACCENT.signal, opacity: qPulse}}>?</span>
												<Status kind="PRÜFUNG" size={18} />
											</div>
										) : i === 1 ? (
											<Status kind="OFFIZIELL" size={18} />
										) : null}
									</Card>
								</Pop>
							) : (
								<div style={{height: 118}} />
							)}
						</div>
					);
				})}
			</div>
			{/* keine feste Zusage */}
			{frame >= atNoPromise - 6 ? (
				<div style={{position: 'absolute', right: 150, top: 1012, opacity: Math.min(1, noProm * 2), scale: String(1.4 - 0.4 * noProm), rotate: '-5deg'}}>
					<div style={{padding: '6px 14px', borderRadius: 12, border: `4px solid ${ACCENT.signal}`, background: 'rgba(30,24,8,0.92)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, color: COLORS.signal}}>KEINE FESTE ZUSAGE</div>
				</div>
			) : null}
			{/* Gesamtschaden offen */}
			{frame >= atTotal - 6 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 1086, display: 'flex', justifyContent: 'center'}}>
					<Pop at={atTotal - 6} dy={20}>
						<div style={{display: 'inline-flex', alignItems: 'center', gap: 12, padding: '10px 18px', borderRadius: 16, background: 'rgba(8,10,28,0.95)', border: `2px solid ${ACCENT.no}`}}>
							<Status kind="OFFEN" size={22} />
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, color: COLORS.text}}>{DAMAGE.open}</span>
						</div>
					</Pop>
				</div>
			) : null}
			<SourceBar text={DAMAGE.source} at={a.from + 10} />
			<Sfx name="whoosh" at={0} volume={0.45} />
			<Sfx name="softImpact" at={a.from + 8} volume={0.5} />
			<Sfx name="whoosh" at={atCity - 8} volume={0.5} />
			{stepAt.map((f, i) => (
				<Sfx key={i} name="pop" at={f} volume={0.55} />
			))}
			<Sfx name="stamp" at={atNoPromise - 6} volume={0.55} />
			<Sfx name="click" at={atTotal - 6} volume={0.6} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 6: Fazit */

/** Szene 6 – Status der vier Fragen + Kommentarfrage + Profil. */
export const EndScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const c = cue(cues, 'end', 4);
	const atAsk = Math.min(wordFrame(cues, 'Welche', c.from + 50), c.from + 30);
	const ask = springIn({frame, fps, delay: atAsk - 6, damping: 13, stiffness: 180});
	const pull = interpolate(frame, [0, durationInFrames], [0, 1], {...clamp, easing: EASE_OUT});
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{scale: String(1.2 - pull * 0.2), transformOrigin: '50% 70%'}}>
				<NightCity mood={MOODS.dusk} progress={pull} litRatio={0.42} showMoon bokeh={16} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.94) 0%, rgba(4,6,20,0.72) 50%, rgba(4,6,20,0.5) 75%, rgba(4,6,20,0.78) 100%)'}} />
			<div style={{position: 'absolute', left: 64, width: 866, top: 290, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
				{STATUS.map((s, i) => (
					<Pop key={s.num} at={2 + i * 3} dy={24}>
						<div style={{height: 168, padding: '14px 16px', borderRadius: 22, background: 'rgba(10,12,34,0.94)', border: `2px solid ${withAlpha(QCOLOR[s.num as QNum], 0.85)}`, display: 'flex', flexDirection: 'column', gap: 8}}>
							<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
								<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, color: QCOLOR[s.num as QNum]}}>{s.num}</span>
								<Status kind={s.status} size={19} />
							</div>
							<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, lineHeight: 1.1, color: COLORS.text}}>{s.title}</div>
							<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted}}>{s.note}</div>
						</div>
					</Pop>
				))}
			</div>
			{frame >= atAsk - 6 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 690, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, opacity: Math.min(1, ask * 2), translate: `0 ${(1 - ask) * 40}px`}}>
					<div style={{padding: '14px 26px 18px', borderRadius: 24, background: ACCENT.brand, boxShadow: '0 30px 60px rgba(0,0,0,0.55)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 50, lineHeight: 1.05, color: '#FFFFFF', textAlign: 'center'}}>
						{CTA.title[0]}
						<br />
						{CTA.title[1]}
					</div>
					<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
						<BrandAvatar size={96} ring={5 + Math.sin(frame / 4) * 3} />
						<div style={{display: 'flex', flexDirection: 'column'}}>
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, color: COLORS.text}}>{handleWithAt()}</span>
							<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 22, letterSpacing: 2, color: COLORS.signal}}>
								{FORMAT.name} · {FORMAT.sub}
							</span>
						</div>
					</div>
				</div>
			) : null}
			<SourceBar text={`Status nach Berichten und Pressemitteilungen · ${STAND}`} at={6} />
			{[0, 1, 2, 3].map((i) => (
				<Sfx key={i} name="click" at={2 + i * 3} volume={0.5} />
			))}
			<Sfx name="pop" at={atAsk - 6} volume={0.6} />
		</AbsoluteFill>
	);
};
