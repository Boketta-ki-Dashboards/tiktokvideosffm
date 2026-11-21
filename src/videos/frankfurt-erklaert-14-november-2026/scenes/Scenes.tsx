import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {type CityCameraKeyframe, type CityMapData, CityStreetMap, useCityCamera} from '../../../components/map/CityStreetMap';
import innenstadtWest from '../../../data/maps/frankfurt-innenstadt-west.json';
import {clamp, EASE_IN_OUT, EASE_OUT, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {handleWithAt} from '../../../theme/brand';
import {COLORS, FONTS} from '../../../theme/tokens';
import {BrandAvatar} from '../../../formats/frankfurt-erklaert/Branding';
import {Pop, SourceBar} from '../../../formats/frankfurt-erklaert/components';
import {ACCENT, FORMAT} from '../../../formats/frankfurt-erklaert/theme';
import {blendMood, MOODS, NightCity} from '../../frankfurt-2026-11-20-ausblick/premium/NightCity';
import {PoliceVan} from '../../frankfurt-2026-11-20-ausblick/premium/PoliceVan';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {COVER, CTA, HAUPTWACHE, MAP_NOTE, MAP_SOURCE, NEXT, POLICE, QUESTION, STAND, VENUES, WEBSITE} from '../content';
import {NOV14_COVER_LAYOUT} from '../cover-layout';
import {HauptwacheIllustration} from '../visuals/Hauptwache';

const MAP = innenstadtWest as unknown as CityMapData;
const GENZ = ACCENT.brand;

/* ------------------------------------------------------------------ Icons */

type N14IconName = 'pin' | 'shield' | 'gate' | 'check' | 'plus' | 'chat' | 'globe' | 'clock' | 'flag' | 'school' | 'megaphone' | 'users' | 'info';

const N14Icon: React.FC<{name: N14IconName; size?: number; color?: string; stroke?: number}> = ({name, size = 36, color = '#FFFFFF', stroke = 2.2}) => {
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
			case 'shield':
				return <path d="M12 2.5 20 5.5v6c0 5-3.5 8.7-8 10-4.5-1.3-8-5-8-10v-6l8-3z" {...p} />;
			case 'gate':
				return <path d="M3 7h18M3 13h18M5 7v12M19 7v12M9 7v6M15 7v6M3 19h4M17 19h4" {...p} />;
			case 'check':
				return <path d="m4.5 12.5 5 5 10-11" {...p} />;
			case 'plus':
				return <path d="M12 5v14M5 12h14" {...p} />;
			case 'chat':
				return <path d="M4 5h16v11H10l-5 4v-4H4z" {...p} />;
			case 'globe':
				return (
					<>
						<circle cx={12} cy={12} r={9} {...p} />
						<path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18" {...p} />
					</>
				);
			case 'clock':
				return (
					<>
						<circle cx={12} cy={12} r={9} {...p} />
						<path d="M12 7v5l3.5 2" {...p} />
					</>
				);
			case 'flag':
				return <path d="M5 21V4M5 4h11l-2 4 2 4H5" {...p} />;
			case 'school':
				return <path d="M2.5 9 12 4.5 21.5 9 12 13.5zM6 11v5c3.5 2.5 8.5 2.5 12 0v-5M21.5 9v6" {...p} />;
			case 'megaphone':
				return <path d="M3 10v4h3l8 5V5L6 10H3zM18 9a4 4 0 0 1 0 6" {...p} />;
			case 'users':
				return (
					<>
						<circle cx={9} cy={8} r={3.2} {...p} />
						<path d="M3 20v-1.5a6 6 0 0 1 12 0V20" {...p} />
						<circle cx={17.5} cy={9} r={2.5} {...p} />
						<path d="M16.5 14.2a4.8 4.8 0 0 1 5 4.6V20" {...p} />
					</>
				);
			case 'info':
				return (
					<>
						<circle cx={12} cy={12} r={9} {...p} />
						<path d="M12 11v6M12 7.5v.5" {...p} />
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

/* ------------------------------------------------------------------ Bausteine */

const Tag: React.FC<{text: string; color: string; icon?: N14IconName; at?: number}> = ({text, color, icon = 'pin', at = 0}) => (
	<Pop at={at} dy={20}>
		<div style={{display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 16px 6px 8px', borderRadius: 12, background: 'rgba(8,10,28,0.9)', border: `2px solid ${color}`, boxShadow: `0 8px 24px ${withAlpha(color, 0.25)}`}}>
			<span style={{width: 34, height: 34, borderRadius: 8, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<N14Icon name={icon} size={24} color={ACCENT.ink} stroke={2.6} />
			</span>
			<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 24, letterSpacing: 1.5, color: COLORS.text}}>{text}</span>
		</div>
	</Pop>
);

type StatusKind = 'OFFIZIELL' | 'BERICHT' | 'ANGEKÜNDIGT' | 'VORBEREITET' | 'OFFEN' | 'ILLUSTRATION';
const STATUS_COLOR: Record<StatusKind, string> = {OFFIZIELL: ACCENT.info, BERICHT: '#FFB15C', ANGEKÜNDIGT: ACCENT.signal, VORBEREITET: ACCENT.law, OFFEN: ACCENT.no, ILLUSTRATION: '#9AA6CC'};
const Status: React.FC<{kind: StatusKind; size?: number}> = ({kind, size = 20}) => {
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

const IconOrb: React.FC<{name: N14IconName; color: string; size?: number}> = ({name, color, size = 72}) => (
	<div style={{width: size, height: size, borderRadius: size / 2, background: `radial-gradient(circle at 35% 30%, ${withAlpha(color, 0.35)}, ${withAlpha(color, 0.12)})`, border: `2px solid ${withAlpha(color, 0.7)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
		<N14Icon name={name} size={size * 0.56} color={color} />
	</div>
);

const NightBg: React.FC<{progress: number; alert?: number; blur?: number; dim?: number}> = ({progress, alert = 0.2, blur = 0, dim = 0}) => (
	<AbsoluteFill style={{filter: blur ? `blur(${blur}px) brightness(${0.65 - dim})` : undefined}}>
		<NightCity mood={blendMood(MOODS.dusk, MOODS.alert, alert)} progress={progress} litRatio={0.4} bokeh={12} showPromenade={false} />
		<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.95) 0%, rgba(4,6,20,0.66) 32%, rgba(4,6,20,0.42) 60%, rgba(4,6,20,0.8) 100%)'}} />
	</AbsoluteFill>
);

const Stars: React.FC<{seed: string; n?: number; height?: number}> = ({seed, n = 40, height = 440}) => {
	const frame = useCurrentFrame();
	return (
		<svg width={1080} height={height} style={{position: 'absolute', left: 0, top: 0}}>
			{new Array(n).fill(0).map((_, i) => (
				<circle key={i} cx={random(`${seed}-x-${i}`) * 1080} cy={24 + random(`${seed}-y-${i}`) * (height - 40)} r={1 + random(`${seed}-r-${i}`) * 2} fill="#FFFFFF" opacity={(0.4 + 0.6 * Math.abs(Math.sin(frame / 18 + i))) * 0.7} />
			))}
		</svg>
	);
};

/** 2,5D-Abreißkalender (Titelbild und Schlussszene): roter Kopf, große Tageszahl, Wochentag; optional Durchstreichung. */
const CalendarBlock: React.FC<{day: string; month: string; weekday: string; width: number; accent?: string; strike?: number; tilt?: number; dayColor?: string}> = ({day, month, weekday, width, accent = ACCENT.brand, strike = 0, tilt = -4, dayColor = '#14141C'}) => {
	const h = width * 1.12;
	return (
		<div style={{position: 'relative', width, height: h, rotate: `${tilt}deg`}}>
			<div style={{position: 'absolute', left: 12, top: 16, width, height: h, borderRadius: 26, background: '#C8C2B4', opacity: 0.85}} />
			<div style={{position: 'absolute', left: 6, top: 8, width, height: h, borderRadius: 26, background: '#E3DED2'}} />
			<div style={{position: 'absolute', inset: 0, borderRadius: 26, background: '#F7F4EC', boxShadow: '0 34px 70px rgba(0,0,0,0.6)', overflow: 'hidden'}}>
				<div style={{height: h * 0.24, background: `linear-gradient(170deg, ${accent}, ${withAlpha(accent, 0.85)})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: width * (month.length > 9 ? 0.082 : 0.105), letterSpacing: 2, color: '#FFFFFF', whiteSpace: 'nowrap'}}>{month}</div>
				<div style={{height: h * 0.58, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: width * 0.56, letterSpacing: -6, color: dayColor, lineHeight: 1}}>{day}</div>
				<div style={{height: h * 0.18, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 800, fontSize: width * 0.085, letterSpacing: 4, color: '#6B6A78'}}>{weekday}</div>
				{strike > 0 ? (
					<svg width={width} height={h} style={{position: 'absolute', left: 0, top: 0}}>
						<path d={`M${width * 0.12} ${h * 0.66} Q${width * 0.5} ${h * 0.5} ${width * 0.9} ${h * 0.36}`} stroke={ACCENT.no} strokeWidth={width * 0.05} strokeLinecap="round" fill="none" strokeDasharray={width * 1.2} strokeDashoffset={width * 1.2 * (1 - strike)} opacity={0.92} />
					</svg>
				) : null}
			</div>
			{[0.25, 0.75].map((x) => (
				<div key={x} style={{position: 'absolute', left: width * x - 10, top: -14, width: 20, height: 36, borderRadius: 10, background: '#8A8FA8', border: '3px solid #2A2F48'}} />
			))}
		</div>
	);
};

/* ------------------------------------------------------------------ Szene 1: Titelbild */

/**
 * Titelbild (Video-Frame 0 und PNG): Serientitel, Kalenderblatt „14 · NOVEMBER 2026 · SAMSTAG“, gelbes Datum, rote Karte
 * „DOCH EINE GEN-Z-DEMO?“, Unterzeile – kompakt in der Bildmitte nach COVER_ZONE (NOV14_COVER_LAYOUT).
 * `strike` zeichnet die Durchstreichung („war doch gestrichen“), `question` das Fragezeichen.
 */
export const Nov14Cover: React.FC<{strike?: number; question?: number; thumbnail?: boolean}> = ({strike = 0, question = 0, thumbnail = false}) => {
	const frame = useCurrentFrame();
	const L = NOV14_COVER_LAYOUT;
	const bob = Math.sin(frame / 22) * 4;
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse 120% 55% at 50% 54%, #2E2A70 0%, #141748 50%, #070A22 100%)'}} />
			<AbsoluteFill>
				<NightCity mood={blendMood(MOODS.dusk, MOODS.alert, 0.22)} progress={0.5 + frame / 2000} litRatio={0.42} bokeh={10} showPromenade={false} showMoon />
			</AbsoluteFill>
			<Stars seed="n14c" />
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.55) 0%, rgba(4,6,20,0.1) 16%, rgba(4,6,20,0) 36%, rgba(4,6,20,0.25) 50%, rgba(4,6,20,0.82) 60%, rgba(4,6,20,0.9) 72%, rgba(4,6,20,0.75) 100%)'}} />
			{/* Serientitel */}
			<div style={{position: 'absolute', left: 0, right: 0, top: L.brandTop, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16}}>
				<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 54, lineHeight: 0.98, color: COLORS.text, textAlign: 'right', textShadow: '0 6px 24px rgba(0,0,0,0.8)'}}>
					FRANKFURT
					<br />
					ERKLÄRT
				</div>
				<div style={{padding: '9px 16px', borderRadius: 10, background: ACCENT.brand, boxShadow: '0 10px 26px rgba(255,59,78,0.4)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, letterSpacing: 3, color: '#FFFFFF'}}>{FORMAT.sub}</div>
			</div>
			{/* Kalenderblatt */}
			<div style={{position: 'absolute', left: (1080 - L.calendarWidth) / 2, top: L.calendarTop + bob}}>
				<CalendarBlock day={COVER.day} month={COVER.month} weekday={COVER.weekday} width={L.calendarWidth} strike={strike} />
				{question > 0 ? (
					<div style={{position: 'absolute', right: -112, top: 40, width: 120, height: 120, borderRadius: 60, background: COLORS.signal, boxShadow: `0 0 50px ${withAlpha(COLORS.signal, 0.6)}, 0 20px 40px rgba(0,0,0,0.5)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 92, color: ACCENT.ink, scale: String(question), rotate: `${(1 - question) * 40 + 8}deg`}}>?</div>
				) : null}
			</div>
			{/* gelbes Datum */}
			<div style={{position: 'absolute', left: 0, right: 0, top: L.dateTop, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: L.dateSize, lineHeight: 1, letterSpacing: -2, color: COLORS.signal, textShadow: `0 0 50px ${withAlpha(COLORS.signal, 0.45)}, 0 20px 50px rgba(0,0,0,0.7)`}}>{COVER.date}</div>
			{/* rote Themenkarte */}
			<div style={{position: 'absolute', left: 0, right: 0, top: L.cardTop, display: 'flex', justifyContent: 'center'}}>
				<div style={{padding: '10px 22px 14px', borderRadius: 22, background: 'linear-gradient(160deg, #FF6A78 0%, #FF4D5E 50%, #D93448 100%)', boxShadow: '0 5px 0 #B32A3C, 0 10px 0 #8E1F2E, 0 40px 70px rgba(0,0,0,0.6)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: L.cardFont, maxWidth: L.cardMaxWidth, lineHeight: 1.05, color: '#FFFFFF', whiteSpace: 'nowrap'}}>{COVER.card}</div>
			</div>
			<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.subTop, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 800, fontSize: 34, color: COLORS.text, textShadow: '0 6px 24px rgba(0,0,0,0.9)'}}>{COVER.sub}</div>
			<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.metaTop, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14}}>
				<BrandAvatar size={50} />
				<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 30, color: COLORS.textMuted}}>{handleWithAt()}</span>
			</div>
			{thumbnail ? (
				<div style={{position: 'absolute', left: L.sideMin - 50, right: L.sideMin - 50, top: L.chipsTop, display: 'flex', justifyContent: 'center', gap: 10}}>
					{COVER.chips.map((c, i) => (
						<div key={c} style={{display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 14, background: 'rgba(8,10,28,0.88)', border: `2px solid ${i === 0 ? GENZ : i === 3 ? COLORS.signal : withAlpha('#FFFFFF', 0.4)}`}}>
							<N14Icon name={i === 3 ? 'clock' : 'pin'} size={22} color={i === 0 ? GENZ : i === 3 ? COLORS.signal : '#C9CEDF'} />
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 20, color: COLORS.text, whiteSpace: 'nowrap'}}>{c}</span>
						</div>
					))}
				</div>
			) : null}
		</AbsoluteFill>
	);
};

/** Szene 1 – Titelbild im Video (ab Frame 0 vollständig); bei „gestrichen“ Durchstreichung, bei „warum“ Fragezeichen. */
export const CoverScene: React.FC<SceneProps> = ({cues}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const h2 = cue(cues, 'hook2', 34);
	const atStrike = Math.max(32, wordFrame(cues, 'gestrichen', h2.from + 20));
	const atWhy = Math.max(atStrike + 8, wordFrame(cues, 'warum', h2.from + 40));
	const strike = interpolate(frame, [atStrike, atStrike + 12], [0, 1], {...clamp, easing: EASE_OUT});
	const question = springIn({frame, fps, delay: atWhy, damping: 10, stiffness: 190});
	return (
		<AbsoluteFill>
			<Nov14Cover strike={strike} question={question} />
			<Sfx name="impact" at={0} volume={0.5} />
			<Sfx name="paper" at={atStrike} volume={0.55} />
			<Sfx name="pop" at={atWhy} volume={0.6} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 2: Website – genannt, entfernt, doch Aktionstag */

const NOV_FIRST = 7; // 1. November 2026 = Sonntag

/** Stilisierte Website (keine Bildschirmaufnahme) mit Novemberkalender. */
export const WebsiteScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const w1 = cue(cues, 'w1', 0);
	const w2 = cue(cues, 'w2', 80);
	const w3 = cue(cues, 'w3', 130);
	const w4 = cue(cues, 'w4', 180);
	const atGone = Math.min(wordFrame(cues, 'weg', w2.from + 14), w2.from + 18);
	const atBald = Math.min(wordFrame(cues, 'bald', w2.from + 30), w2.to);
	const atNext = Math.min(wordFrame(cues, 'Nächstes', w3.from + 6), w3.from + 10);
	const atBack = Math.min(wordFrame(cues, 'Aktionstag', w4.from + 40), w4.from + 46);
	const atMotto = Math.min(wordFrame(cues, 'Motto', w4.from + 60), w4.to - 10);
	const hl14 = springIn({frame, fps, delay: Math.max(4, w1.from + 8), damping: 12, stiffness: 170});
	const gone = interpolate(frame, [atGone, atGone + 10], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const back = springIn({frame, fps, delay: atBack, damping: 11, stiffness: 160});
	const hl20 = springIn({frame, fps, delay: atNext, damping: 12, stiffness: 170});
	const stage = frame >= atBack - 4 ? 3 : frame >= atNext - 2 ? 2 : frame >= atGone - 2 ? 1 : 0;
	const labels = [WEBSITE.named, WEBSITE.removed, WEBSITE.next, {title: WEBSITE.back.title, when: WEBSITE.back.when}];
	const labelColor = [GENZ, ACCENT.no, COLORS.signal, GENZ][stage];
	const labelAt = [0, atGone - 2, atNext - 2, atBack - 4][stage];
	const drift = interpolate(frame, [0, durationInFrames], [0, 1]);
	const cell = {w: 104, h: 60};
	const gx = 116;
	const gy = 668;
	const cellXY = (day: number): [number, number] => {
		const idx = NOV_FIRST - 1 + (day - 1);
		return [gx + (idx % 7) * cell.w, gy + Math.floor(idx / 7) * cell.h];
	};
	const [x14, y14] = cellXY(14);
		return (
		<AbsoluteFill style={{backgroundColor: '#090D20', overflow: 'hidden'}}>
			<NightBg progress={0.2 + drift * 0.2} blur={6} dim={0.1} />
			<div style={{position: 'absolute', left: 64, top: 290}}>
				<Tag text="DAS DATUM" color={GENZ} icon="clock" />
			</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 350}}>
				<Headline lines={['ERST GENANNT,', 'DANN ENTFERNT?']} color={GENZ} />
			</div>
			{/* Browserfenster (stilisiert) */}
			<div style={{position: 'absolute', left: 90, width: 900, top: 500, translate: `0 ${interpolate(frame, [0, 14], [60, 0], {...clamp, easing: EASE_OUT})}px`, opacity: interpolate(frame, [0, 8], [0, 1], clamp), rotate: `${-1 + drift * 1.2}deg`}}>
				<div style={{borderRadius: 26, overflow: 'hidden', background: 'linear-gradient(170deg, #F5F3FA, #E6E3F0)', boxShadow: '0 40px 90px rgba(0,0,0,0.6)', height: 548}}>
					<div style={{height: 56, background: '#2A2D45', display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px'}}>
						{['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
							<span key={c} style={{width: 16, height: 16, borderRadius: 8, background: c}} />
						))}
						<div style={{marginLeft: 16, flex: 1, height: 32, borderRadius: 16, background: '#3B3F5E', display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px'}}>
							<N14Icon name="globe" size={20} color="#9AA6CC" />
							<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 20, color: '#C9CEDF'}}>{WEBSITE.label}</span>
						</div>
					</div>
					<div style={{padding: '18px 26px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 38, color: '#1B1C2E'}}>PROTESTTERMINE</span>
						<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 26, color: '#6B6A78'}}>NOVEMBER 2026</span>
					</div>
					<div style={{display: 'flex', padding: '10px 0 0 26px'}}>
						{['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((d) => (
							<span key={d} style={{width: cell.w, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 800, fontSize: 22, color: '#8A8FA8'}}>{d}</span>
						))}
					</div>
				</div>
			</div>
			{/* Kalendertage (absolute Positionen, damit Hervorhebungen über dem Fenster liegen) */}
			<div style={{position: 'absolute', left: 0, top: 0, translate: `0 ${interpolate(frame, [0, 14], [60, 0], {...clamp, easing: EASE_OUT})}px`, opacity: interpolate(frame, [2, 10], [0, 1], clamp)}}>
				{new Array(30).fill(0).map((_, i) => {
					const day = i + 1;
					const [x, y] = cellXY(day);
					const is14 = day === 14;
					const is20 = day === 20;
					const h14 = is14 ? (stage === 3 ? back : hl14 * (1 - gone)) : 0;
					const h20 = is20 ? hl20 : 0;
					const strong = Math.max(h14, h20);
					const col = is20 ? COLORS.signal : GENZ;
					return (
						<div key={day} style={{position: 'absolute', left: x + 4, top: y + 4, width: cell.w - 8, height: cell.h - 8, borderRadius: 12, background: strong > 0 ? withAlpha(col, 0.18 + 0.7 * strong) : 'rgba(27,28,46,0.05)', border: strong > 0 ? `3px solid ${col}` : '2px solid rgba(27,28,46,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', scale: String(1 + strong * 0.12), boxShadow: strong > 0 ? `0 10px 30px ${withAlpha(col, 0.45 * strong)}` : undefined, zIndex: strong > 0 ? 2 : 1}}>
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: strong > 0.4 ? (is20 ? ACCENT.ink : '#FFFFFF') : '#2A2B3D', opacity: is14 && stage >= 1 && stage < 3 ? 0.25 : 1}}>{day}</span>
						</div>
					);
				})}
				{/* „entfernt“: Radierstrich + „bald“ */}
				{stage >= 1 && stage < 3 ? (
					<>
						<svg width={cell.w + 40} height={cell.h + 20} style={{position: 'absolute', left: x14 - 20, top: y14 - 10}}>
							<path d={`M10 ${cell.h + 6} L${cell.w + 30} 14`} stroke={ACCENT.no} strokeWidth={9} strokeLinecap="round" strokeDasharray={200} strokeDashoffset={200 * (1 - gone)} />
						</svg>
						<div style={{position: 'absolute', left: gx + 6, top: gy + 6, width: cell.w * 6 - 12, height: cell.h - 12, opacity: interpolate(frame, [atBald - 4, atBald + 6], [0, 1], clamp), scale: String(interpolate(frame, [atBald - 4, atBald + 8], [0.8, 1], {...clamp, easing: EASE_OUT})), borderRadius: 12, background: '#1B1C2E', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, color: '#FFFFFF', boxShadow: '0 12px 30px rgba(0,0,0,0.4)', zIndex: 3}}>NEUE PROTESTE: <span style={{color: COLORS.signal}}>„BALD“</span></div>
					</>
				) : null}
				{/* zurück: Aktionstag „Phase 2“ */}
				{stage === 3 ? (
					<div style={{position: 'absolute', left: gx + 30, top: gy - 8, rotate: '-4deg', scale: String(0.6 + 0.4 * back), opacity: Math.min(1, back * 1.5), padding: '6px 18px', borderRadius: 14, border: `5px solid ${GENZ}`, background: 'rgba(255,255,255,0.96)', boxShadow: '0 16px 40px rgba(0,0,0,0.45)', zIndex: 4, display: 'flex', alignItems: 'baseline', gap: 14, whiteSpace: 'nowrap'}}>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 36, lineHeight: 1, color: GENZ, letterSpacing: 1}}>14.11. AKTIONSTAG</span>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 32, lineHeight: 1, color: '#1B1C2E', opacity: interpolate(frame, [atMotto - 4, atMotto + 6], [0, 1], clamp)}}>{WEBSITE.back.motto}</span>
					</div>
				) : null}
			</div>
			{/* Status-Zeile unter dem Fenster */}
			<div key={stage} style={{position: 'absolute', left: 90, width: 900, top: 1064, display: 'flex', alignItems: 'center', gap: 14}}>
				<Pop at={labelAt} dy={18}>
					<div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 20px', borderRadius: 18, background: 'rgba(8,10,28,0.94)', border: `3px solid ${labelColor}`, boxShadow: `0 16px 40px rgba(0,0,0,0.5), 0 0 30px ${withAlpha(labelColor, 0.3)}`}}>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, color: labelColor, whiteSpace: 'nowrap'}}>{labels[stage].title}</span>
					</div>
				</Pop>
			</div>
			<div style={{position: 'absolute', left: 92, width: 860, top: 1132, display: 'flex', alignItems: 'center', gap: 10, opacity: interpolate(frame, [labelAt, labelAt + 8], [0, 1], clamp)}}>
				<Status kind={stage === 3 ? 'OFFIZIELL' : 'BERICHT'} size={17} />
				<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 23, color: COLORS.text, textShadow: '0 2px 10px rgba(0,0,0,0.9)'}}>{labels[stage].when}</span>
			</div>
			<div style={{position: 'absolute', right: 96, top: 1006, padding: '3px 10px', borderRadius: 8, background: 'rgba(8,10,28,0.85)', fontFamily: FONTS.body, fontWeight: 800, fontSize: 18, letterSpacing: 1.5, color: COLORS.textMuted}}>ILLUSTRATION · {WEBSITE.note}</div>
			<SourceBar text={WEBSITE.source} at={8} />
			<Sfx name="whoosh" at={0} volume={0.45} />
			<Sfx name="click" at={Math.max(4, w1.from + 10)} volume={0.5} />
			<Sfx name="paper" at={atGone} volume={0.55} />
			<Sfx name="pop" at={atBald} volume={0.45} />
			<Sfx name="softImpact" at={atNext} volume={0.6} />
			<Sfx name="stamp" at={atBack} volume={0.6} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 3: Hauptwache */

export const HauptwacheScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const f1 = cue(cues, 'f1', 0);
	const f2 = cue(cues, 'f2', 120);
	const atPlace = Math.min(wordFrame(cues, 'Hauptwache', f1.from + 40), f1.from + 50);
	const atTime = Math.min(f1.to - 40, atPlace + 30);
	const atOpen = Math.max(f2.from - 4, 0);
	const drift = interpolate(frame, [0, durationInFrames], [0, 1]);
	const card = springIn({frame, fps, delay: 2, damping: 14, stiffness: 170});
	const zoom = interpolate(frame, [0, durationInFrames], [1.08, 1], {easing: EASE_OUT});
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{scale: String(zoom), transformOrigin: '50% 75%'}}>
				<NightCity mood={blendMood(MOODS.dusk, MOODS.alert, 0.12)} progress={0.35 + drift * 0.15} litRatio={0.45} bokeh={14} showPromenade={false} showMoon />
			</AbsoluteFill>
			<div style={{position: 'absolute', left: -40, top: 720, scale: String(1 + drift * 0.04), transformOrigin: '60% 100%'}}>
				<HauptwacheIllustration width={1160} light={interpolate(frame, [0, 30], [0.4, 1], clamp)} people={interpolate(frame, [6, 60], [0, 1], clamp)} drift={drift} />
			</div>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.96) 0%, rgba(4,6,20,0.75) 22%, rgba(4,6,20,0.15) 38%, rgba(4,6,20,0) 55%, rgba(4,6,20,0.25) 66%, rgba(4,6,20,0.85) 78%, rgba(4,6,20,0.95) 100%)'}} />
			<div style={{position: 'absolute', left: 64, top: 290}}>
				<Tag text="HEUTE IN FRANKFURT" color={GENZ} icon="pin" />
			</div>
			{/* große Informationskarte */}
			<div style={{position: 'absolute', left: 64, width: 866, top: 352, opacity: Math.min(1, card * 1.6), translate: `0 ${(1 - card) * 50}px`}}>
				<Card color={GENZ} style={{padding: '18px 26px 20px'}} glow={0.3}>
					<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, letterSpacing: 1, color: COLORS.signal}}>{HAUPTWACHE.date}</span>
						<Status kind="OFFIZIELL" size={18} />
					</div>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 84, lineHeight: 1, color: COLORS.text, marginTop: 4, opacity: interpolate(frame, [atPlace - 6, atPlace + 4], [0.25, 1], clamp)}}>{HAUPTWACHE.place}</div>
					<div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, opacity: interpolate(frame, [atTime - 6, atTime + 6], [0.25, 1], clamp)}}>
						<N14Icon name="clock" size={40} color={COLORS.signal} />
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 52, color: COLORS.signal}}>{HAUPTWACHE.time}</span>
					</div>
					<div style={{marginTop: 12, display: 'inline-block', padding: '8px 16px', borderRadius: 14, background: GENZ, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 32, color: '#FFFFFF'}}>{HAUPTWACHE.kind}</div>
					<div style={{marginTop: 10, fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, color: COLORS.textMuted}}>
						{HAUPTWACHE.attribution} · {HAUPTWACHE.note}
					</div>
				</Card>
			</div>
			{/* Verlauf offen */}
			{frame >= atOpen ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 1066}}>
					<Pop at={atOpen} dy={20}>
						<div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '12px 18px', borderRadius: 18, background: 'rgba(8,10,28,0.94)', border: `3px solid ${ACCENT.no}`}}>
							<Status kind="OFFEN" size={20} />
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: COLORS.text}}>{HAUPTWACHE.open}</span>
						</div>
						<div style={{marginTop: 6, fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted, textShadow: '0 2px 8px rgba(0,0,0,0.9)'}}>{STAND} · keine Teilnehmerzahl bekannt</div>
					</Pop>
				</div>
			) : null}
			<div style={{position: 'absolute', right: 150, top: 740, padding: '3px 10px', borderRadius: 8, background: 'rgba(8,10,28,0.8)', fontFamily: FONTS.body, fontWeight: 800, fontSize: 18, letterSpacing: 1.5, color: COLORS.textMuted}}>ILLUSTRATION</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 1180, height: 74, background: 'linear-gradient(rgba(4,6,20,0), rgba(4,6,20,0.82) 30%, rgba(4,6,20,0.82) 70%, rgba(4,6,20,0))'}} />
			<SourceBar text={HAUPTWACHE.source} at={10} />
			<Sfx name="whoosh" at={0} volume={0.5} />
			<Sfx name="softImpact" at={atPlace} volume={0.6} />
			<Sfx name="click" at={atTime} volume={0.5} />
			<Sfx name="pop" at={atOpen} volume={0.5} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 4: drei getrennte Versammlungen */

export const VenuesScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const m1 = cue(cues, 'm1', 0);
	const m2 = cue(cues, 'm2', 100);
	const atBW = Math.min(wordFrame(cues, 'Bockenheimer', m1.from + 30), m1.from + 36);
	const atGP = Math.min(wordFrame(cues, 'Goetheplatz', m1.from + 80), m1.to - 6);
	const atIran = Math.min(wordFrame(cues, 'Irankonflikt', m2.from + 40), m2.from + 50);
	const atNot = Math.min(wordFrame(cues, 'keine', m2.from + 70), m2.to - 10);
	const center: [number, number] = [50.1168, 8.6652];
	const camera: CityCameraKeyframe[] = [
		{frame: 0, center: [50.1137, 8.6775], zoom: 0.95},
		{frame: Math.max(1, atBW - 6), center: [50.1150, 8.6720], zoom: 0.62},
		{frame: Math.max(2, atBW + 18), center, zoom: 0.38},
		{frame: Math.max(3, durationInFrames), center: [50.1166, 8.6655], zoom: 0.4},
	];
	const anchor: [number, number] = [540, 860];
	const {toScreen} = useCityCamera(MAP, camera, anchor, frame);
	const appear = [0, atBW, atGP];
	const cardPos: {left: number; top: number}[] = [
		{left: 470, top: 708},
		{left: 150, top: 494},
		{left: 236, top: 948},
	];
	return (
		<AbsoluteFill style={{backgroundColor: '#090D20', overflow: 'hidden'}}>
			<CityStreetMap map={MAP} camera={camera} anchor={anchor} streetLabels={[{text: 'Zeil', at: [50.11455, 8.6845], rotate: -2, size: 26}]} labelOpacity={interpolate(frame, [0, 15], [0, 0.8], clamp)} />
			<AbsoluteFill style={{background: 'linear-gradient(rgba(6,9,24,0.96) 0%, rgba(6,9,24,0.8) 20%, rgba(6,9,24,0.05) 30%, rgba(6,9,24,0) 52%, rgba(6,9,24,0.25) 62%, rgba(6,9,24,0.85) 74%, rgba(6,9,24,0.95) 100%)'}} />
			{/* Marker + Verbindungslinien */}
			<svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
				{VENUES.map((v, i) => {
					const o = interpolate(frame, [appear[i], appear[i] + 8], [0, 1], clamp);
					if (o <= 0) return null;
					const [x, y] = toScreen(v.at);
					const c = cardPos[i];
					const cx = Math.max(c.left + 40, Math.min(c.left + 380, x));
					const cy = c.top + (c.top > y ? 0 : 128);
					const pulse = 0.5 + 0.5 * Math.sin(frame / 6 + i);
					return (
						<g key={v.id} opacity={o}>
							<line x1={x} y1={y} x2={cx} y2={cy} stroke={withAlpha(v.color, 0.85)} strokeWidth={3} strokeDasharray="6 7" />
							<circle cx={x} cy={y} r={34 + 10 * pulse} fill={withAlpha(v.color, 0.16)} />
							<circle cx={x} cy={y} r={16} fill={v.color} stroke="#FFFFFF" strokeWidth={4} />
						</g>
					);
				})}
			</svg>
			<div style={{position: 'absolute', left: 64, top: 290}}>
				<Tag text="MEHRERE VERSAMMLUNGEN" color={ACCENT.info} icon="users" />
			</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 350}}>
				<Headline lines={['DREI TERMINE –', 'NICHT EINE DEMO']} color={ACCENT.info} size={56} />
			</div>
			{VENUES.map((v, i) => {
				const s = springIn({frame, fps, delay: appear[i] + 2, damping: 14, stiffness: 180});
				if (frame < appear[i]) return null;
				const isIran = v.id === 'goetheplatz';
				const focus = isIran ? interpolate(frame, [atIran - 4, atIran + 8], [0, 1], clamp) : 0;
				return (
					<div key={v.id} style={{position: 'absolute', left: cardPos[i].left, top: cardPos[i].top, width: 460, opacity: Math.min(1, s * 1.6), scale: String((0.8 + 0.2 * s) * (1 + focus * 0.04)), transformOrigin: '50% 50%'}}>
						<Card color={v.color} style={{padding: '12px 16px'}} glow={0.2 + focus * 0.3}>
							<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8}}>
								<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 29, color: v.color, whiteSpace: 'nowrap'}}>{v.name}</span>
							</div>
							<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 24, color: COLORS.text, whiteSpace: 'nowrap', marginTop: 2}}>{v.kind}</div>
							<div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 6}}>
								<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 21, color: ACCENT.ink, background: v.color, padding: '2px 8px', borderRadius: 8, whiteSpace: 'nowrap'}}>{v.time} UHR</span>
								<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 20, color: COLORS.textMuted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{v.note}</span>
							</div>
						</Card>
					</div>
				);
			})}
			{frame >= atNot - 6 ? (
				<div style={{position: 'absolute', left: cardPos[2].left + 300, top: cardPos[2].top - 34, rotate: '-8deg', scale: String(interpolate(frame, [atNot - 6, atNot + 4], [1.6, 1], {...clamp, easing: EASE_OUT})), opacity: interpolate(frame, [atNot - 6, atNot], [0, 1], clamp), padding: '6px 14px', borderRadius: 12, border: `4px solid ${GENZ}`, background: 'rgba(8,10,28,0.92)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: GENZ, whiteSpace: 'nowrap', boxShadow: '0 12px 30px rgba(0,0,0,0.5)'}}>≠ GEN-Z-DEMO</div>
			) : null}
				<div style={{position: 'absolute', left: 64, width: 866, top: 1116, display: 'flex', justifyContent: 'center', opacity: interpolate(frame, [atGP, atGP + 10], [0, 1], clamp)}}>
					<span style={{padding: '6px 14px', borderRadius: 12, background: 'rgba(8,10,28,0.9)', fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted}}>{MAP_NOTE}</span>
				</div>
			<SourceBar text={MAP_SOURCE} at={10} />
			<Sfx name="whoosh" at={0} volume={0.45} />
			<Sfx name="blip" at={4} volume={0.45} />
			<Sfx name="whoosh" at={atBW - 6} volume={0.4} />
			<Sfx name="blip" at={atBW} volume={0.45} />
			<Sfx name="blip" at={atGP} volume={0.45} />
			<Sfx name="stamp" at={atNot - 6} volume={0.55} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 5: Polizei */

export const PoliceScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p1 = cue(cues, 'p1', 0);
	const p2 = cue(cues, 'p2', 90);
	const p3 = cue(cues, 'p3', 180);
	const atForce = Math.min(wordFrame(cues, 'Kräfte', p1.from + 20), p1.from + 26);
	const atZeil = Math.min(wordFrame(cues, 'Zeil', p2.from + 40), p2.from + 30);
	const atNeed = Math.min(wordFrame(cues, 'Bedarf', p2.from + 6), p2.from + 8);
	const atKey = Math.max(p3.from - 4, 0);
	const at = [atForce, atZeil - 14, atNeed];
	const drift = interpolate(frame, [0, durationInFrames], [0, 1]);
	const vanX = interpolate(frame, [0, 40], [700, 0], {...clamp, easing: EASE_OUT});
	const compact = interpolate(frame, [atKey - 4, atKey + 10], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const key = springIn({frame, fps, delay: atKey, damping: 13, stiffness: 160});
	const statusOf = (s: string): StatusKind => (s === 'VORBEREITET' ? 'VORBEREITET' : 'ANGEKÜNDIGT');
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<NightBg progress={0.55 + drift * 0.2} alert={0.35} />
			{/* Einsatzfahrzeuge + Absperrgitter (Illustration) */}
			<div style={{position: 'absolute', left: 420 + vanX, top: 520, opacity: 0.95}}>
				<PoliceVan width={560} phase={0} />
			</div>
			<div style={{position: 'absolute', left: 120 + vanX * 0.6, top: 590, opacity: 0.55, scale: '0.7'}}>
				<PoliceVan width={420} phase={2} />
			</div>
			<svg width={1080} height={160} style={{position: 'absolute', left: 0, top: 690}}>
				{[0, 1, 2, 3, 4].map((i) => {
					const o = interpolate(frame, [atNeed + i * 3, atNeed + i * 3 + 8], [0, 1], clamp);
					const x = 90 + i * 150;
					return (
						<g key={i} opacity={o} transform={`translate(${x} ${20 + (1 - o) * 30})`}>
							<rect x={0} y={20} width={130} height={8} rx={3} fill="#E9EDF7" />
							<rect x={0} y={56} width={130} height={8} rx={3} fill="#E9EDF7" />
							{[10, 40, 70, 100].map((bx) => (
								<rect key={bx} x={bx} y={20} width={5} height={44} fill="#C9CEDF" />
							))}
							<rect x={6} y={64} width={8} height={22} fill="#9AA6CC" />
							<rect x={116} y={64} width={8} height={22} fill="#9AA6CC" />
						</g>
					);
				})}
			</svg>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.95) 0%, rgba(4,6,20,0.7) 24%, rgba(4,6,20,0.1) 36%, rgba(4,6,20,0.2) 46%, rgba(4,6,20,0.85) 56%, rgba(4,6,20,0.95) 100%)'}} />
			<div style={{position: 'absolute', left: 64, top: 290}}>
				<Tag text="POLIZEI · EINSATZKONZEPT" color={ACCENT.info} icon="shield" />
			</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 350}}>
				<Headline lines={['STÄRKER', 'VORBEREITET']} color={ACCENT.info} />
			</div>
			{/* drei Punkte */}
			<div style={{position: 'absolute', left: 64, width: 866, top: 830 - compact * 40, display: 'flex', flexDirection: 'column', gap: 12, opacity: 1 - compact, scale: String(1 - compact * 0.12), transformOrigin: '50% 0%'}}>
				{POLICE.items.map((it, i) => {
					const s = springIn({frame, fps, delay: at[i], damping: 14, stiffness: 180});
					if (frame < at[i] - 2) return <div key={it.title} style={{height: 104}} />;
					const c = i === 2 ? ACCENT.law : ACCENT.info;
					return (
						<div key={it.title} style={{opacity: Math.min(1, s * 1.6), translate: `${(1 - s) * 60}px 0`}}>
							<Card color={c} style={{padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 16, height: 104, boxSizing: 'border-box'}}>
								<IconOrb name={it.icon as N14IconName} color={c} size={70} />
								<div style={{flex: 1}}>
									<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
										<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: COLORS.text, whiteSpace: 'nowrap'}}>{it.title}</span>
										<Status kind={statusOf(it.status)} size={15} />
									</div>
									<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted}}>{it.text}</div>
								</div>
							</Card>
						</div>
					);
				})}
			</div>
			{/* Kernaussage */}
			{frame >= atKey ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 790, opacity: Math.min(1, key * 1.6), scale: String(0.85 + 0.15 * key)}}>
					<Card color={ACCENT.yes} style={{padding: '22px 26px', textAlign: 'center'}} glow={0.35}>
						<div style={{display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 8}}>
							<Status kind="OFFIZIELL" size={18} />
						</div>
						{POLICE.key.map((l) => (
							<div key={l} style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 46, lineHeight: 1.08, color: COLORS.text}}>
								{l}
							</div>
						))}
						<div style={{marginTop: 8, fontFamily: FONTS.body, fontWeight: 700, fontSize: 23, color: ACCENT.yes}}>{POLICE.keyNote}</div>
					</Card>
				</div>
			) : null}
			<SourceBar text={POLICE.source} at={10} />
			<Sfx name="whoosh" at={0} volume={0.5} />
			<Sfx name="click" at={atForce} volume={0.5} />
			<Sfx name="click" at={atZeil - 14} volume={0.5} />
			<Sfx name="click" at={atNeed} volume={0.5} />
			<Sfx name="softImpact" at={atKey} volume={0.6} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 6: 20. November */

export const NextScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const n1 = cue(cues, 'n1', 0);
	const atSwap = Math.max(4, n1.from + 2);
	const atItems = [wordFrame(cues, 'Schulstreik', n1.from + 60), wordFrame(cues, 'Demo', n1.from + 80), wordFrame(cues, 'Gewerkschaftsjugend', n1.from + 100)];
	const swap = interpolate(frame, [atSwap, atSwap + 18], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const drift = interpolate(frame, [0, durationInFrames], [0, 1]);
	const pull = interpolate(frame, [0, durationInFrames], [1.12, 1], {easing: EASE_OUT});
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{scale: String(pull), transformOrigin: '50% 70%'}}>
				<NightCity mood={MOODS.dusk} progress={0.65 + drift * 0.25} litRatio={0.42} showMoon bokeh={16} showPromenade={false} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.95) 0%, rgba(4,6,20,0.7) 26%, rgba(4,6,20,0.3) 45%, rgba(4,6,20,0.75) 62%, rgba(4,6,20,0.92) 100%)'}} />
			<div style={{position: 'absolute', left: 64, top: 290}}>
				<Tag text="UND DANN?" color={COLORS.signal} icon="clock" />
			</div>
			{/* 14 → klein, 20 → groß */}
			<div style={{position: 'absolute', left: 120 - swap * 40, top: 420 + swap * 90, scale: String(1 - swap * 0.45), opacity: 1 - swap * 0.45, transformOrigin: '0% 0%'}}>
				<CalendarBlock day="14" month="NOVEMBER" weekday="HEUTE" width={260} accent={ACCENT.brand} tilt={-6} />
			</div>
			<div style={{position: 'absolute', left: 380 + (1 - swap) * 420, top: 380 + (1 - swap) * 60, scale: String(0.7 + swap * 0.3), opacity: Math.min(1, swap * 1.8), rotate: `${(1 - swap) * 18}deg`, transformOrigin: '50% 0%'}}>
				<CalendarBlock day="20" month="NOVEMBER" weekday="FREITAG" width={320} accent={COLORS.signal} tilt={4} />
			</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 800, opacity: swap, translate: `0 ${(1 - swap) * 30}px`}}>
				<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 44, lineHeight: 1.05, color: COLORS.signal, textShadow: '0 6px 24px rgba(0,0,0,0.9)'}}>{NEXT.title}</div>
				<div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 8}}>
					<Status kind="ANGEKÜNDIGT" size={17} />
					<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, color: COLORS.text}}>{NEXT.sub}</span>
				</div>
			</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 948, display: 'flex', flexDirection: 'column', gap: 10}}>
				{NEXT.items.map((it, i) => {
					const s = springIn({frame, fps, delay: Math.min(atItems[i], n1.to - 20) - 4, damping: 14, stiffness: 180});
					return (
						<div key={it.text} style={{opacity: Math.min(1, s * 1.6), translate: `${(1 - s) * 50}px 0`, display: 'flex', alignItems: 'center', gap: 14, padding: '10px 16px', borderRadius: 16, background: 'rgba(10,12,34,0.92)', border: `2px solid ${withAlpha(i === 1 ? GENZ : COLORS.signal, 0.75)}`}}>
							<span style={{width: 108, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, color: i === 1 ? GENZ : COLORS.signal}}>{it.time}</span>
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: COLORS.text}}>{it.text}</span>
							<span style={{marginLeft: 'auto', fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted}}>{it.place}</span>
						</div>
					);
				})}
			</div>
			<SourceBar text={NEXT.source} at={10} />
			<Sfx name="whoosh" at={0} volume={0.45} />
			<Sfx name="softImpact" at={atSwap + 6} volume={0.7} />
			<Sfx name="click" at={atSwap + 2} volume={0.5} />
			{atItems.map((a, i) => (
				<Sfx key={i} name="pop" at={Math.min(a, n1.to - 20) - 4} volume={0.4} />
			))}
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 7: Frage + Abo-Aufruf */

export const OutroScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const q = cue(cues, 'q1', 2);
	const c = cue(cues, 'cta', 50);
	const atCta = Math.min(wordFrame(cues, 'Folgt', c.from), c.from);
	const ques = springIn({frame, fps, delay: Math.max(0, q.from - 2), damping: 13, stiffness: 180});
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
			<div style={{position: 'absolute', left: 64, width: 866, top: 330 - shrink * 30, opacity: Math.min(1, ques * 1.6) * (1 - shrink * 0.3), scale: String((0.85 + 0.15 * ques) * (1 - shrink * 0.15)), transformOrigin: '50% 0%'}}>
				<Card color={COLORS.signal} style={{padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 18}} glow={0.3}>
					<IconOrb name="chat" color={COLORS.signal} size={86} />
					<div>
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 46, lineHeight: 1.05, color: COLORS.text}}>{QUESTION}</div>
						<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, color: COLORS.textMuted, marginTop: 4}}>Schreibt’s in die Kommentare · sachlich bleiben</div>
					</div>
				</Card>
			</div>
			{frame >= atCta - 6 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 640, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, opacity: Math.min(1, cta * 2), translate: `0 ${(1 - cta) * 50}px`}}>
					<div style={{position: 'relative'}}>
						<BrandAvatar size={190} ring={6 + Math.sin(frame / 4) * 3} />
						<div style={{position: 'absolute', left: '50%', bottom: -26, translate: '-50% 0', scale: String(press), width: 64, height: 64, borderRadius: 32, background: followed ? ACCENT.yes : ACCENT.brand, border: '4px solid #FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 24px rgba(0,0,0,0.5)'}}>
							<N14Icon name={followed ? 'check' : 'plus'} size={36} color="#FFFFFF" stroke={3.4} />
						</div>
					</div>
					<span style={{marginTop: 12, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 52, color: COLORS.text}}>{handleWithAt()}</span>
					<div style={{padding: '12px 30px 14px', borderRadius: 20, background: ACCENT.brand, boxShadow: '0 20px 50px rgba(255,59,78,0.35)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, color: '#FFFFFF', scale: String(followed ? 1 + 0.035 * Math.sin((frame - atCta - 30) / 5) : 1)}}>{CTA.title}</div>
					<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 24, letterSpacing: 2.5, color: COLORS.signal}}>
						{CTA.sub}
					</span>
				</div>
			) : null}
			<Sfx name="pop" at={Math.max(0, q.from - 2)} volume={0.55} />
			<Sfx name="pop" at={atCta - 6} volume={0.6} />
			<Sfx name="click" at={atCta + 28} volume={0.6} />
		</AbsoluteFill>
	);
};
