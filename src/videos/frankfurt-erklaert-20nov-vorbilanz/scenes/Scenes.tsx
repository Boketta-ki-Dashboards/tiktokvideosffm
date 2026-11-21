import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {FrankfurtSkyline} from '../../../components/backgrounds/FrankfurtSkyline';
import {BrandLogo} from '../../../components/brand/BrandLogo';
import {CityPlane, cityPlaneXY} from '../../../components/map/CityPlane';
import {type CityMapData, type LatLon, projectLatLon} from '../../../components/map/CityStreetMap';
import {interpolateCamera, type PlaneBillboard, type PlaneCamera} from '../../../components/map/TiltedPlane';
import nordwestMap from '../../../data/maps/frankfurt-innenstadt-nordwest.json';
import werftMap from '../../../data/maps/frankfurt-ostend-weseler-werft.json';
import {TopTag} from '../../../formats/frankfurt-erklaert/Branding';
import {ACCENT, FORMAT, LAYOUT} from '../../../formats/frankfurt-erklaert/theme';
import {DayTimeline} from '../../../formats/frankfurt-erklaert/visuals/DayTimeline';
import {clamp, EASE_IN_OUT, EASE_OUT, springIn} from '../../../lib/animation';
import {mix, withAlpha} from '../../../lib/color';
import {handleWithAt} from '../../../theme/brand';
import {COLORS, FONTS} from '../../../theme/tokens';
import {blendMood, MOODS, NightCity} from '../../frankfurt-2026-11-20-ausblick/premium/NightCity';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {EzbTowers, FloesserPylons} from '../../frankfurt-erklaert-20nov-demo-update/visuals/Illustrations';
import {Card, CountUp, P2Icon, type P2IconName, Stars, useSpring} from '../../frankfurt-erklaert-genz-phase2-2026-11-14/scenes/kit';
import {COMPARE, CONFLICT, COVER, DAY, DAY_NOTE, MARCH, OUTRO, POLICE, STAND, standText, WERFT} from '../content';
import {VORBILANZ_COVER_LAYOUT} from '../cover-layout';
import {Rain} from '../visuals/Weather';

const RED = ACCENT.brand;
const BLUE = ACCENT.info;
const GREEN = ACCENT.yes;
const YELLOW = COLORS.signal;
const ORANGE = '#FF8A3D';
const CYAN = '#46C2FF';
const VIOLET = '#B794F6';

/* ------------------------------------------------------------------ Kategorie-Chips */

type Kind = 'LAUT POLIZEI' | 'LAUT REPORTERN' | 'SCHILDERUNG' | 'AUSSAGE' | 'STELLUNGNAHME' | 'ILLUSTRATION' | 'SCHEMATISCH' | 'OFFEN' | 'VORBILANZ' | 'ERWARTUNG';
const KIND_COLOR: Record<Kind, string> = {
	'LAUT POLIZEI': BLUE,
	'LAUT REPORTERN': '#FFB15C',
	SCHILDERUNG: VIOLET,
	AUSSAGE: VIOLET,
	STELLUNGNAHME: VIOLET,
	ILLUSTRATION: '#9AA6CC',
	SCHEMATISCH: '#9AA6CC',
	OFFEN: ACCENT.no,
	VORBILANZ: RED,
	ERWARTUNG: YELLOW,
};
const Chip: React.FC<{kind: Kind; size?: number; style?: React.CSSProperties}> = ({kind, size = 18, style}) => {
	const c = KIND_COLOR[kind];
	return <span style={{display: 'inline-block', padding: `${size * 0.2}px ${size * 0.5}px`, borderRadius: size * 0.4, background: withAlpha(c, 0.18), border: `2px solid ${c}`, fontFamily: FONTS.heading, fontWeight: 900, fontSize: size, letterSpacing: 1.2, color: c, whiteSpace: 'nowrap', ...style}}>{kind}</span>;
};

/** Federnde Einblendung (nichts vor `at`). */
const In: React.FC<{at: number; children: React.ReactNode; dx?: number; dy?: number; style?: React.CSSProperties; out?: number}> = ({at, children, dx = 0, dy = 30, style, out = 1}) => {
	const s = useSpring(at, 13, 180);
	const frame = useCurrentFrame();
	if (frame < at - 1) return null;
	return <div style={{position: 'absolute', opacity: Math.min(1, s * 1.7) * out, translate: `${(1 - s) * dx}px ${(1 - s) * dy}px`, scale: String(0.92 + 0.08 * s), ...style}}>{children}</div>;
};

const SceneTag: React.FC<{text: string; color: string; icon: P2IconName}> = ({text, color, icon}) => <TopTag text={text} color={color} icon={<P2Icon name={icon} size={30} color={ACCENT.ink} stroke={2.6} />} />;

/** Lesbarkeit: dunkel oben (Kopfzeile, Titel) und unten (Untertitel-Band). */
const Shade: React.FC<{top?: number; bottom?: number; mid?: [number, number]}> = ({top = 0.94, bottom = 0.88, mid = [44, 70]}) => (
	<AbsoluteFill style={{background: `linear-gradient(rgba(4,6,20,${top}) 0%, rgba(4,6,20,${top * 0.86}) 22%, rgba(4,6,20,0) ${mid[0]}%, rgba(4,6,20,0) ${mid[1]}%, rgba(4,6,20,${bottom * 0.8}) 80%, rgba(4,6,20,${bottom}) 100%)`, pointerEvents: 'none'}} />
);

const Note: React.FC<{text: string; top: number; icon?: P2IconName; width?: number}> = ({text, top, icon = 'info', width = LAYOUT.width}) => (
	<div style={{position: 'absolute', left: LAYOUT.left, top, display: 'flex', alignItems: 'center', gap: 10, padding: '5px 14px', borderRadius: 12, background: 'rgba(8,10,28,0.88)', maxWidth: width, boxSizing: 'border-box'}}>
		<P2Icon name={icon} size={24} color={COLORS.textMuted} />
		<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, lineHeight: 1.2, color: COLORS.textMuted}}>{text}</span>
	</div>
);

/** Stempel (federnd, leicht gedreht). */
const Stamp: React.FC<{text: string; sub?: string; color: string; at: number; rotate?: number; size?: number}> = ({text, sub, color, at, rotate = -7, size = 54}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = springIn({frame, fps, delay: at, damping: 11, stiffness: 220});
	if (frame < at - 1) return null;
	return (
		<div style={{display: 'inline-flex', flexDirection: 'column', alignItems: 'center', padding: '10px 26px 12px', borderRadius: 14, border: `6px solid ${color}`, background: withAlpha('#080A1C', 0.88), rotate: `${rotate}deg`, scale: String(1.8 - 0.8 * s), opacity: Math.min(1, s * 2), boxShadow: `0 0 40px ${withAlpha(color, 0.35)}`}}>
			<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: size, lineHeight: 1, letterSpacing: 2, color, whiteSpace: 'nowrap'}}>{text}</span>
			{sub ? <span style={{marginTop: 6, fontFamily: FONTS.body, fontWeight: 800, fontSize: 22, color: COLORS.text, whiteSpace: 'nowrap'}}>{sub}</span> : null}
		</div>
	);
};

/** Marke (Pin + Beschriftung) für projizierte Kartenpunkte. */
const Marker: React.FC<{title: string; sub?: string; color: string; on: number; small?: boolean}> = ({title, sub, color, on, small}) => (
	<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: on, scale: String(0.7 + 0.3 * on), transformOrigin: '50% 100%'}}>
		<div style={{padding: small ? '4px 10px 5px' : '6px 14px 8px', borderRadius: 14, background: 'rgba(8,10,28,0.95)', border: `3px solid ${color}`, boxShadow: `0 12px 30px rgba(0,0,0,0.55), 0 0 24px ${withAlpha(color, 0.35)}`, textAlign: 'center', whiteSpace: 'nowrap'}}>
			{sub ? <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: small ? 17 : 20, letterSpacing: 1.4, color}}>{sub}</div> : null}
			<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: small ? 22 : 27, color: COLORS.text}}>{title}</div>
		</div>
		<div style={{width: 4, height: small ? 20 : 30, background: `linear-gradient(${color}, ${withAlpha(color, 0.1)})`}} />
		<div style={{width: 18, height: 18, borderRadius: 9, marginTop: -5, background: color, border: '3px solid #FFFFFF', boxShadow: `0 0 20px ${withAlpha(color, 0.9)}`}} />
	</div>
);

/* ------------------------------------------------------------------ Szene 1: Titelbild = erste Szene */

/**
 * Titelbild (Video-Frame 0 und PNG, nach COVER_ZONE): Skyline bei Regen, Serientitel, „FRANKFURT 20.11.“, groß „DIE ERSTE BILANZ!“,
 * rote Karte „WAS IST HEUTE PASSIERT?“, Plakette „VORBILANZ · STAND …“, Tages-Zeitleiste mit Meldungszeiten, Logo + Account;
 * im PNG zusätzlich „STAND …, KEINE ENDBILANZ“. `morph` blendet die Texte aus (Fahrt zur Weseler Werft), `meta` die Logo-Zeile.
 */
export const VorbilanzCover: React.FC<{morph?: number; thumbnail?: boolean; meta?: number; reveal?: number[]}> = ({morph = 0, thumbnail = false, meta = 1, reveal}) => {
	const frame = useCurrentFrame();
	const L = VORBILANZ_COVER_LAYOUT;
	const m = EASE_IN_OUT(Math.min(1, Math.max(0, morph)));
	const text = 1 - Math.min(1, m * 1.6);
	const bob = Math.sin(frame / 26) * 3;
	const blink = 0.55 + 0.45 * Math.abs(Math.sin(frame / 9));
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{scale: String(1 + m * 0.12), transformOrigin: '50% 30%'}}>
				<NightCity mood={blendMood(MOODS.police, MOODS.calm, 0.35)} progress={0.3 + frame / 2400} litRatio={0.5} bokeh={14} showPromenade={false} emergency={0.35} />
			</AbsoluteFill>
			<Stars seed="vb14" n={20} height={300} />
			<Rain n={80} opacity={0.3} seed="cov" />
			<AbsoluteFill style={{background: `linear-gradient(rgba(4,6,20,${0.45 * text + 0.15}) 0%, rgba(4,6,20,${0.1 * text}) 14%, rgba(4,6,20,${0.55 * text}) 24%, rgba(4,6,20,${0.86 * text}) 36%, rgba(4,6,20,${0.9 * text}) 62%, rgba(4,6,20,${0.8 * text}) 100%)`}} />
			<div style={{opacity: text, translate: `0 ${(1 - text) * -30}px`}}>
				<div style={{position: 'absolute', left: 0, right: 0, top: L.brandTop, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16}}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 50, lineHeight: 0.98, color: COLORS.text, textAlign: 'right', textShadow: '0 6px 24px rgba(0,0,0,0.8)'}}>
						FRANKFURT
						<br />
						ERKLÄRT
					</div>
					<div style={{padding: '9px 16px', borderRadius: 10, background: RED, boxShadow: '0 10px 26px rgba(255,59,78,0.4)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, letterSpacing: 3, color: '#FFFFFF'}}>{FORMAT.sub}</div>
				</div>
				<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.kickerTop, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: L.kickerSize, lineHeight: 1.05, letterSpacing: 1, color: COLORS.text, whiteSpace: 'nowrap', textShadow: '0 8px 26px rgba(0,0,0,0.9)'}}>{COVER.kicker}</div>
				<div style={{position: 'absolute', left: 0, right: 0, top: L.bigTop + bob, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: L.bigSize, lineHeight: 1, letterSpacing: -3, whiteSpace: 'nowrap', textShadow: `0 0 70px ${withAlpha(YELLOW, 0.4)}, 0 20px 50px rgba(0,0,0,0.85)`}}>
					<div style={{color: COLORS.text}}>{COVER.big[0]}</div>
					<div style={{color: YELLOW}}>
						{COVER.big[1].replace('!', '')}
						<span style={{color: RED}}>!</span>
					</div>
				</div>
				<div style={{position: 'absolute', left: L.sideMin - 20, right: L.sideMin - 20, top: L.cardTop, display: 'flex', justifyContent: 'center'}}>
					<div style={{padding: '8px 24px 10px', borderRadius: 18, background: 'linear-gradient(160deg, #FF6A78 0%, #FF4D5E 50%, #D93448 100%)', boxShadow: '0 5px 0 #B32A3C, 0 10px 0 #8E1F2E, 0 30px 60px rgba(0,0,0,0.6)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: L.cardFont, lineHeight: 1.1, color: '#FFFFFF', whiteSpace: 'nowrap'}}>{COVER.card}</div>
				</div>
				<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.tagTop, height: L.tagBottom - L.tagTop, display: 'flex', justifyContent: 'center'}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px', borderRadius: 25, background: 'rgba(8,10,28,0.94)', border: `2.5px solid ${YELLOW}`}}>
						<div style={{width: 16, height: 16, borderRadius: 8, background: RED, opacity: blink, boxShadow: `0 0 14px ${RED}`}} />
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 27, letterSpacing: 2, color: YELLOW, whiteSpace: 'nowrap'}}>{COVER.tag}</span>
						<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 25, color: COLORS.text, whiteSpace: 'nowrap'}}>· {standText()}</span>
					</div>
				</div>
				<div style={{position: 'absolute', left: L.timelineLeft, top: L.timelineTop}}>
					<DayTimeline events={DAY.map((d) => ({id: d.id, time: d.time, label: d.label, color: d.color, icon: d.icon}))} width={L.timelineWidth} size={L.timelineOrb} reveal={reveal} highlight="werft" />
				</div>
				<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.metaTop, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, opacity: meta}}>
					<BrandLogo size={52} />
					<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 30, color: COLORS.textMuted}}>{handleWithAt()}</span>
					<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 20, color: withAlpha(COLORS.text, 0.6), marginLeft: 6}}>{DAY_NOTE}</span>
				</div>
				{thumbnail ? (
					<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.thumbTop, display: 'flex', justifyContent: 'center'}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 22px', borderRadius: 16, background: 'rgba(8,10,28,0.92)', border: `2.5px solid ${YELLOW}`}}>
							<P2Icon name="clock" size={30} color={YELLOW} />
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 32, color: COLORS.text, whiteSpace: 'nowrap'}}>{COVER.thumb}</span>
						</div>
					</div>
				) : null}
			</div>
		</AbsoluteFill>
	);
};

/** Szene 1 – Titelbild im Video (ab Frame 0 vollständig); Zeitleiste pulsiert bei „Bilanz“, am Ende Fahrt zur Weseler Werft. */
export const CoverScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const h2 = cue(cues, 'hook2', 30);
	const atBilanz = wordFrame(cues, 'Bilanz', h2.from + 20);
	const morph = interpolate(frame, [durationInFrames - 14, durationInFrames - 1], [0, 1], clamp);
	// Logo-Zeile weicht vor dem zweiten Satz (mehrzeilige Untertitel würden sie verdecken)
	const meta = interpolate(frame, [h2.from - 8, h2.from], [1, 0], clamp);
	return (
		<AbsoluteFill>
			<VorbilanzCover morph={morph} meta={meta} />
			<Sfx name="softImpact" at={0} volume={0.5} />
			<Sfx name="tick" at={atBilanz} volume={0.5} />
			<Sfx name="whoosh" at={Math.max(0, durationInFrames - 14)} volume={0.45} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 2: Weseler Werft (OSM, 2,5D) */

const WERFT_MAP = werftMap as unknown as CityMapData;
const WERFT_K = 1.2;
const FLOESSER_PYLONS: LatLon = [50.1084, 8.6948];
const EZB_AT: LatLon = [50.10963, 8.70292];
const MAIN_LABEL_AT: LatLon = [50.10715, 8.7012];
const WERFT_LABEL_AT: LatLon = [50.10777, 8.69947];

/** Kundgebungsfläche (Lage laut Stadt, Ausdehnung schematisch): Platz für die erwartete Menge (graue Punkte) vs. tatsächlich (helle Punkte). */
const WerftGround: React.FC<{on: number; ghost: number; real: number}> = ({on, ghost, real}) => {
	const frame = useCurrentFrame();
	const [cx, cy] = projectLatLon(WERFT_MAP, WERFT.at);
	const pr = (frame % 40) / 40;
	const G = 160;
	return (
		<g opacity={on} transform={`rotate(13 ${cx} ${cy})`}>
			<ellipse cx={cx} cy={cy} rx={190 + pr * 26} ry={34 + pr * 8} fill="none" stroke={withAlpha(RED, 0.5 * (1 - pr))} strokeWidth={5} />
			<ellipse cx={cx} cy={cy} rx={186} ry={32} fill={withAlpha(RED, 0.14)} stroke={RED} strokeWidth={5} strokeDasharray="16 10" />
			{new Array(G).fill(0).map((_, i) => {
				const u = random(`g${i}`) * 2 - 1;
				const v = random(`gy${i}`) * 2 - 1;
				return <circle key={`g${i}`} cx={cx + u * 170} cy={cy + v * 24} r={3.6} fill="#9AA6CC" opacity={0.55 * ghost} />;
			})}
			{new Array(WERFT.presentDots).fill(0).map((_, i) => {
				const u = random(`r${i}`) * 2 - 1;
				const v = random(`ry${i}`) * 2 - 1;
				const wob = Math.sin(frame / 14 + i) * 1.5;
				return <circle key={`r${i}`} cx={cx - 40 + u * 34 + wob} cy={cy + v * 10} r={4.6} fill={i % 5 === 0 ? YELLOW : '#FFFFFF'} opacity={real} />;
			})}
		</g>
	);
};

export const WerftScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const w1 = cue(cues, 'w1', 0);
	const w2 = cue(cues, 'w2', 80);
	const at4000 = wordFrame(cues, '4.000', w1.from + 30);
	const atRep = Math.max(w2.from - 2, at4000 + 12);
	const at30 = wordFrame(cues, '30', atRep + 24);
	const atSchluss = at30 + 8;
	const [wx, wy] = cityPlaneXY(WERFT_MAP, WERFT_K, WERFT.at);
	const cam = interpolateCamera(
		frame,
		[
			{frame: 0, cam: {x: wx + 240, y: wy - 50, zoom: 1.0, tilt: 58, rotate: 60}},
			{frame: Math.max(20, atRep - 6), cam: {x: wx + 120, y: wy - 20, zoom: 1.3, tilt: 57, rotate: 66}},
			{frame: durationInFrames + 10, cam: {x: wx + 60, y: wy - 6, zoom: 1.6, tilt: 55, rotate: 70}},
		],
		EASE_IN_OUT,
	);
	const onArea = interpolate(frame, [2, 14], [0, 1], clamp);
	const ghost = interpolate(frame, [4, at4000 + 6, atRep, atRep + 16], [0.15, 1, 1, 0.12], clamp);
	const real = interpolate(frame, [atRep - 2, atRep + 10], [0, 1], clamp);
	const pyl = cityPlaneXY(WERFT_MAP, WERFT_K, FLOESSER_PYLONS);
	const ezb = cityPlaneXY(WERFT_MAP, WERFT_K, EZB_AT);
	const mainL = cityPlaneXY(WERFT_MAP, WERFT_K, MAIN_LABEL_AT);
	const wl = cityPlaneXY(WERFT_MAP, WERFT_K, WERFT_LABEL_AT);
	const markers: PlaneBillboard[] = [
		{key: 'ezb', x: ezb[0], y: ezb[1], node: <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}><EzbTowers size={230} lit={0.45} /><span style={{marginTop: 4, padding: '2px 10px', borderRadius: 8, background: 'rgba(8,10,28,0.85)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 22, color: '#BFD0FF'}}>EZB</span></div>},
		{key: 'floesser', x: pyl[0], y: pyl[1], node: <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}><FloesserPylons size={150} /><span style={{marginTop: 2, padding: '2px 10px', borderRadius: 8, background: 'rgba(8,10,28,0.85)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 22, color: '#D7DDAA'}}>FLÖSSERBRÜCKE</span></div>},
		{key: 'main', x: mainL[0], y: mainL[1], node: <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, letterSpacing: 10, color: withAlpha('#CFE2FF', 0.8), textShadow: '0 2px 10px rgba(0,0,0,0.8)'}}>MAIN</div>},
		{key: 'werft', x: wl[0], y: wl[1], z: 6, node: <Marker title={WERFT.name} sub="KUNDGEBUNG · ORTSGRUPPE" color={RED} on={interpolate(frame, [2, 14], [0, 1], clamp)} small />},
	];
	const sky = blendMood(MOODS.calm, MOODS.police, 0.5);
	const pulse4000 = Math.sin(interpolate(frame, [at4000 + 2, at4000 + 14], [0, 1], clamp) * Math.PI);
	const dim4000 = interpolate(frame, [atRep, atRep + 10], [1, 0.55], clamp);
	return (
		<AbsoluteFill style={{backgroundColor: '#070B22', overflow: 'hidden'}}>
			<AbsoluteFill style={{background: `linear-gradient(${sky.sky[0]} 0%, ${sky.sky[1]} 24%, ${sky.sky[2]} 33%, ${sky.sky[3]} 38%, #0A0F2A 46%)`}} />
			<div style={{position: 'absolute', left: 150 - frame * 0.12, top: 250, opacity: 0.75}}>
				<FrankfurtSkyline width={820} litRatio={0.4} showRiver={false} showBridge={false} />
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
					ground={{base: '#0B1130', parks: '#1A4A36', water: '#18488F', pedestrian: '#5A6AA8'}}
					groundExtras={<WerftGround on={onArea} ghost={ghost} real={real} />}
					markers={markers}
				/>
			</AbsoluteFill>
			<Rain n={60} opacity={0.24} seed="werft" />
			<Shade top={0.96} bottom={0.9} mid={[34, 64]} />
			<SceneTag text="1 · WESELER WERFT · OSTEND" color={RED} icon="pin" />
			{/* 4.000 erwartet */}
			<div style={{position: 'absolute', left: LAYOUT.left, top: 380, width: LAYOUT.width, opacity: dim4000}}>
				<Card color={YELLOW} style={{padding: '10px 22px', display: 'flex', alignItems: 'center', gap: 16}} glow={0.25 + 0.3 * pulse4000}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 28, lineHeight: 1, color: COLORS.textMuted, textAlign: 'right'}}>
						BIS
						<br />
						ZU
					</div>
					<CountUp value={WERFT.expected} at={2} dur={Math.max(12, at4000 + 2)} style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 104, lineHeight: 1, color: COLORS.text, textShadow: `0 0 40px ${withAlpha(YELLOW, 0.5)}`, scale: String(1 + 0.08 * pulse4000)}} />
					<div style={{flex: 1}}>
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, lineHeight: 1, color: YELLOW}}>{WERFT.expectedLabel}</div>
						<div style={{marginTop: 8, display: 'flex', alignItems: 'center', gap: 10}}>
							<Chip kind="LAUT POLIZEI" size={16} />
							<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted, whiteSpace: 'nowrap'}}>{WERFT.planned}</span>
						</div>
					</div>
				</Card>
			</div>
			{/* 20–30 vor Ort */}
			<In at={atRep} dy={50} style={{left: LAYOUT.left, top: 960, width: LAYOUT.width}}>
				<Card color={RED} style={{padding: '12px 22px', display: 'flex', alignItems: 'center', gap: 18}} glow={0.4}>
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, color: COLORS.textMuted}}>NUR</span>
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 104, lineHeight: 1, color: frame >= at30 - 3 ? RED : COLORS.text, letterSpacing: -2, textShadow: `0 0 40px ${withAlpha(RED, 0.6)}`}}>{WERFT.present}</span>
					<div style={{flex: 1}}>
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, lineHeight: 1, color: COLORS.text}}>{WERFT.presentLabel}</div>
						<div style={{marginTop: 8}}>
							<Chip kind="LAUT REPORTERN" size={16} />
						</div>
					</div>
				</Card>
				<div style={{marginTop: 8, fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted, paddingLeft: 8}}>{WERFT.presentBy}</div>
			</In>
			<div style={{position: 'absolute', left: 0, right: 150, top: 1130, display: 'flex', justifyContent: 'center'}}>
				<Stamp text={WERFT.ended} sub={WERFT.endedNote} color={RED} at={atSchluss} size={46} />
			</div>
			<div style={{position: 'absolute', left: LAYOUT.left, top: 528, display: 'flex', gap: 10}}>
				<Chip kind="ILLUSTRATION" size={15} />
				<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted, padding: '2px 8px', borderRadius: 8, background: 'rgba(8,10,28,0.8)'}}>Fläche schematisch · Karte © OpenStreetMap-Mitwirkende</span>
			</div>
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="blip" at={4} volume={0.5} />
			<Sfx name="softImpact" at={at4000 + 2} volume={0.6} />
			<Sfx name="pop" at={atRep} volume={0.5} />
			<Sfx name="stamp" at={atSchluss} volume={0.6} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 3: Zoff – Ortsgruppe vs. Bundesbewegung */

/** Mini-Illustration links: Main + ortsfeste Kundgebung (Kreis mit wenigen Punkten). */
const StationaryMini: React.FC<{w: number; h: number; color: string}> = ({w, h, color}) => {
	const frame = useCurrentFrame();
	const pr = (frame % 40) / 40;
	return (
		<svg width={w} height={h}>
			<path d={`M0 ${h - 36} Q${w * 0.3} ${h - 50} ${w * 0.55} ${h - 36} T${w} ${h - 40} V${h} H0 Z`} fill="#1B4E96" opacity={0.85} />
			<ellipse cx={w / 2} cy={h * 0.48} rx={80 + pr * 20} ry={26 + pr * 6} fill="none" stroke={withAlpha(color, 0.7 * (1 - pr))} strokeWidth={3} />
			<ellipse cx={w / 2} cy={h * 0.48} rx={76} ry={24} fill={withAlpha(color, 0.18)} stroke={color} strokeWidth={3} strokeDasharray="10 7" />
			{new Array(7).fill(0).map((_, i) => (
				<circle key={i} cx={w / 2 - 30 + random(`sm${i}`) * 60} cy={h * 0.48 - 8 + random(`smy${i}`) * 16} r={5} fill={i % 3 === 0 ? YELLOW : '#FFFFFF'} />
			))}
			<g transform={`translate(${w / 2 - 13} ${h * 0.48 - 70})`}>
				<path d="M13 40s-12-13-12-23a12 12 0 0 1 24 0c0 10-12 23-12 23z" fill={color} stroke="#FFFFFF" strokeWidth={2} />
				<circle cx={13} cy={17} r={4.5} fill="#FFFFFF" />
			</g>
		</svg>
	);
};

/** Mini-Illustration rechts: Bahnhofshalle + laufender Zug (Punkte entlang einer geschwungenen Linie). */
const MarchMini: React.FC<{w: number; h: number; color: string}> = ({w, h, color}) => {
	const frame = useCurrentFrame();
	const path = (t: number) => [70 + t * (w - 100), h * 0.62 - Math.sin(t * Math.PI * 1.6) * 34] as const;
	const dots = new Array(14).fill(0).map((_, i) => path((((frame / 100 + i * 0.06) % 1) + 1) % 1));
	return (
		<svg width={w} height={h}>
			{/* Bahnhofshalle (Bögen) */}
			<g transform={`translate(8 ${h * 0.62 - 58})`} fill="none" stroke={withAlpha('#FFFFFF', 0.7)} strokeWidth={3}>
				<path d="M0 60 V30 Q16 4 32 30 V60 M32 30 Q48 4 64 30 V60" />
				<path d="M-4 60 H68" />
			</g>
			<path d={new Array(31).fill(0).map((_, i) => `${i ? 'L' : 'M'}${path(i / 30)[0]} ${path(i / 30)[1]}`).join(' ')} fill="none" stroke={withAlpha(color, 0.45)} strokeWidth={4} strokeDasharray="8 8" />
			{dots.map(([x, y], i) => (
				<circle key={i} cx={x} cy={y} r={6} fill={i % 3 === 0 ? YELLOW : '#FFFFFF'} />
			))}
		</svg>
	);
};

const SidePanel: React.FC<{side: 'left' | 'right'; color: string; who: string; what: string; how: string; quote: string; quoteBy: string; quoteKind: Kind; shellAt: number; at: number; quoteAt: number; mini: React.ReactNode}> = ({side, color, who, what, how, quote, quoteBy, quoteKind, shellAt, at, quoteAt, mini}) => {
	const frame = useCurrentFrame();
	const w = 421;
	const q = interpolate(frame, [quoteAt, quoteAt + 10], [0, 1], clamp);
	const body = interpolate(frame, [at, at + 10], [0, 1], clamp);
	return (
		<In at={shellAt} dx={side === 'left' ? -80 : 80} dy={0} style={{left: side === 'left' ? LAYOUT.left : LAYOUT.left + w + 24, top: 486, width: w}}>
			<Card color={color} style={{padding: '14px 16px 16px', height: 620, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8, opacity: 0.55 + 0.45 * body}} glow={0.08 + 0.25 * body}>
				<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 25, letterSpacing: 1.2, color}}>{who}</div>
				<div style={{borderRadius: 14, background: 'rgba(6,8,24,0.75)', overflow: 'hidden'}}>{mini}</div>
				<div style={{opacity: body, translate: `0 ${(1 - body) * 14}px`, display: 'flex', flexDirection: 'column', gap: 8}}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 31, lineHeight: 1.08, color: COLORS.text}}>{what}</div>
					<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, lineHeight: 1.2, color: COLORS.textMuted}}>{how}</div>
				</div>
				<div style={{marginTop: 'auto', padding: '10px 12px', borderRadius: 14, background: withAlpha(VIOLET, 0.12), border: `2px solid ${withAlpha(VIOLET, 0.7)}`, opacity: q, translate: `0 ${(1 - q) * 14}px`}}>
					<Chip kind={quoteKind} size={14} />
					<div style={{marginTop: 6, fontFamily: FONTS.heading, fontWeight: 800, fontSize: 27, lineHeight: 1.15, color: COLORS.text}}>{quote}</div>
					<div style={{marginTop: 4, fontFamily: FONTS.body, fontWeight: 700, fontSize: 19, lineHeight: 1.2, color: COLORS.textMuted}}>{quoteBy}</div>
				</div>
			</Card>
		</In>
	);
};

export const StreitScene: React.FC<SceneProps> = ({cues}) => {
	const frame = useCurrentFrame();
	const k1 = cue(cues, 'k1', 0);
	const k2 = cue(cues, 'k2', 40);
	const k3 = cue(cues, 'k3', 100);
	const k4 = cue(cues, 'k4', 150);
	const atZoff = wordFrame(cues, 'Zoff', k1.from + 14);
	const atLeft = Math.max(2, k2.from - 4);
	const atRight = Math.max(atLeft + 10, k3.from - 4);
	const atClaim = Math.max(atRight + 10, k4.from - 2);
	const zoff = Math.sin(interpolate(frame, [atZoff - 2, atZoff + 12], [0, 1], clamp) * Math.PI);
	const bolt = interpolate(frame, [atZoff - 4, atZoff + 4], [0, 1], clamp);
	const jitter = frame >= atZoff - 2 && frame < atZoff + 14 ? Math.sin(frame * 2.3) * 4 : 0;
	return (
		<AbsoluteFill style={{backgroundColor: '#070A1E', overflow: 'hidden'}}>
			<AbsoluteFill style={{background: `radial-gradient(ellipse 60% 40% at 25% 50%, ${withAlpha(CYAN, 0.16)} 0%, rgba(0,0,0,0) 70%), radial-gradient(ellipse 60% 40% at 75% 50%, ${withAlpha(ORANGE, 0.16)} 0%, rgba(0,0,0,0) 70%)`}} />
			<Rain n={40} opacity={0.16} seed="streit" />
			<SceneTag text="2 · STREIT IN DER BEWEGUNG" color={VIOLET} icon="megaphone" />
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 376, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, translate: `${jitter}px 0`}}>
				<svg width={60} height={84} viewBox="0 0 60 84" style={{opacity: bolt, scale: String(1 + 0.25 * zoff)}}>
					<path d="M36 2 L6 48 H28 L20 82 L54 30 H32 Z" fill={YELLOW} stroke="#FFFFFF" strokeWidth={3} strokeLinejoin="round" />
				</svg>
				<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 60, letterSpacing: -1, color: COLORS.text, whiteSpace: 'nowrap', scale: String(1 + 0.06 * zoff), textShadow: `0 0 ${30 * zoff}px ${withAlpha(YELLOW, 0.6)}`}}>{CONFLICT.title}</span>
			</div>
			<SidePanel side="left" color={CYAN} who={CONFLICT.left.who} what={CONFLICT.left.what} how={CONFLICT.left.how} quote={CONFLICT.left.quote} quoteBy={CONFLICT.left.quoteBy} quoteKind="AUSSAGE" shellAt={2} at={atLeft} quoteAt={atLeft + 26} mini={<StationaryMini w={389} h={170} color={CYAN} />} />
			<SidePanel side="right" color={ORANGE} who={CONFLICT.right.who} what={CONFLICT.right.what} how={CONFLICT.right.how} quote={CONFLICT.right.quote} quoteBy={CONFLICT.right.quoteBy} quoteKind="STELLUNGNAHME" shellAt={6} at={atRight} quoteAt={atRight + 24} mini={<MarchMini w={389} h={170} color={ORANGE} />} />
			{/* VS-Plakette zwischen den Hälften */}
			{frame >= atZoff - 2 ? (
				<div style={{position: 'absolute', left: LAYOUT.left + 421 + 12 - 40, top: 610, width: 80, height: 80, borderRadius: 40, background: '#0B0E26', border: `4px solid ${YELLOW}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: YELLOW, scale: String(interpolate(frame, [atZoff - 2, atZoff + 6], [0.4, 1], {...clamp, easing: EASE_OUT}) * (1 + 0.2 * zoff)), zIndex: 5}}>VS</div>
			) : null}
			{/* Schilderung der Ortsgruppe */}
			<In at={atClaim} dy={40} style={{left: LAYOUT.left, top: 1140, width: LAYOUT.width}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 18px', borderRadius: 18, background: 'rgba(10,12,32,0.95)', border: `2.5px solid ${VIOLET}`}}>
					<div style={{position: 'relative', width: 54, height: 54, flexShrink: 0}}>
						<P2Icon name="users" size={54} color={COLORS.textMuted} />
						<svg width={54} height={54} style={{position: 'absolute', inset: 0}}>
							<line x1={6} y1={48} x2={6 + 42 * interpolate(frame, [atClaim + 8, atClaim + 18], [0, 1], clamp)} y2={48 - 42 * interpolate(frame, [atClaim + 8, atClaim + 18], [0, 1], clamp)} stroke={ACCENT.no} strokeWidth={5} strokeLinecap="round" />
						</svg>
					</div>
					<div style={{flex: 1}}>
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 29, lineHeight: 1.1, color: COLORS.text}}>{CONFLICT.claim}</div>
						<div style={{marginTop: 4, fontFamily: FONTS.body, fontWeight: 700, fontSize: 19, color: VIOLET}}>{CONFLICT.claimBy}</div>
					</div>
				</div>
			</In>
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="boom" at={atZoff - 2} volume={0.25} />
			<Sfx name="pop" at={atZoff} volume={0.5} />
			<Sfx name="whoosh" at={atLeft} volume={0.35} />
			<Sfx name="whoosh" at={atRight} volume={0.35} />
			<Sfx name="click" at={atRight + 2} volume={0.4} />
			<Sfx name="notify" at={atClaim} volume={0.4} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 4: Demozug (OSM nordwest, 2,5D) */

const ZUG_MAP = nordwestMap as unknown as CityMapData;
const ZUG_K = 0.5;
const STOP = Object.fromEntries(MARCH.stops.map((s) => [s.id, s])) as Record<'start' | 'taunus' | 'oper' | 'ziel', (typeof MARCH.stops)[number]>;

/** Gelaufener Abschnitt bis `head` (0–3 = Anzahl Teilstrecken): gestrichelte Linie + wandernde Punkte (schematisch, zwischen gemeldeten Punkten). */
const MarchTrail: React.FC<{head: number}> = ({head}) => {
	const frame = useCurrentFrame();
	const pts = MARCH.stops.map((s) => projectLatLon(ZUG_MAP, s.at));
	const at = (t: number): [number, number] => {
		const i = Math.min(pts.length - 2, Math.max(0, Math.floor(t)));
		const f = Math.min(1, Math.max(0, t - i));
		return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f];
	};
	if (head <= 0) return null;
	const steps = Math.max(2, Math.round(head * 30));
	const d = new Array(steps + 1).fill(0).map((_, i) => {
		const [x, y] = at((head * i) / steps);
		return `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
	}).join(' ');
	const crowd = new Array(22).fill(0).map((_, i) => {
		const t = head - 0.02 - i * 0.012;
		if (t <= 0) return null;
		const [x, y] = at(t);
		const ox = (random(`mc${i}`) - 0.5) * 26 + Math.sin(frame / 9 + i) * 2;
		const oy = (random(`mcy${i}`) - 0.5) * 26;
		return <circle key={i} cx={x + ox} cy={y + oy} r={7} fill={i % 4 === 0 ? YELLOW : '#FFFFFF'} opacity={0.95} />;
	});
	return (
		<g>
			<path d={d} fill="none" stroke={withAlpha(ORANGE, 0.35)} strokeWidth={34} strokeLinecap="round" strokeLinejoin="round" />
			<path d={d} fill="none" stroke={ORANGE} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="22 16" strokeDashoffset={-frame * 2} />
			{crowd}
		</g>
	);
};

export const ZugScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const d1 = cue(cues, 'd1', 0);
	const d2 = cue(cues, 'd2', 70);
	const d3 = cue(cues, 'd3', 150);
	const atLate = wordFrame(cues, 'halbe', d1.from + 30) - 6;
	const atOper = wordFrame(cues, 'Oper', d2.from + 14) - 4;
	const atBock = wordFrame(cues, 'Bockenheim', atOper + 16) - 4;
	const atAngek = wordFrame(cues, 'angekommen', atBock + 16) - 4;
	const at1000 = wordFrame(cues, '1.000', d3.from + 30);
	const atCount = Math.max(atAngek + 12, d3.from - 4);
	const head = interpolate(frame, [4, Math.max(20, d2.from - 2), atOper + 4, atBock + 10], [0, 1, 2, 3], {...clamp, easing: EASE_IN_OUT});
	const xy = (id: 'start' | 'taunus' | 'oper' | 'ziel') => cityPlaneXY(ZUG_MAP, ZUG_K, STOP[id].at);
	const [sx, sy] = xy('start');
	const [tx, ty] = xy('taunus');
	const [ox, oy] = xy('oper');
	const [zx, zy] = xy('ziel');
	const cam = interpolateCamera(
		frame,
		[
			{frame: 0, cam: {x: sx + 40, y: sy - 30, zoom: 1.3, tilt: 52, rotate: -30}},
			{frame: Math.max(16, d2.from - 4), cam: {x: (tx + ox) / 2, y: (ty + oy) / 2, zoom: 1.25, tilt: 52, rotate: -36}},
			{frame: atBock + 6, cam: {x: (ox + zx) / 2 + 30, y: (oy + zy) / 2, zoom: 0.9, tilt: 50, rotate: -44}},
			{frame: durationInFrames + 10, cam: {x: (sx + zx) / 2 + 40, y: (sy + zy) / 2 - 40, zoom: 0.66, tilt: 48, rotate: -44}},
		],
		EASE_IN_OUT,
	);
	const on = (id: string) => {
		// Start-Marke blendet während der Fahrt Richtung Bockenheim kurz aus (läge sonst angeschnitten am rechten Rand) und kehrt in der Übersicht zurück
		if (id === 'start') return interpolate(frame, [0, 8, d2.from + 4, d2.from + 14, atBock + 14, atBock + 26], [0, 1, 1, 0, 0, 1], clamp);
		const start = id === 'taunus' ? Math.max(8, d2.from - 8) : id === 'oper' ? atOper : atBock;
		return interpolate(frame, [start, start + 10], [0, 1], clamp);
	};
	const pulse = (frame % 40) / 40;
	const markers: PlaneBillboard[] = MARCH.stops.map((s) => {
		const [x, y] = xy(s.id as 'start');
		const color = s.id === 'ziel' ? YELLOW : s.id === 'start' ? ORANGE : '#FFB15C';
		return {key: s.id, x, y, z: s.id === 'ziel' ? 8 : 4, node: <Marker title={s.name} sub={s.sub} color={color} on={on(s.id)} small={s.id === 'taunus'} />};
	});
	const lateOn = useSpring(atLate, 13, 180);
	const arrOn = useSpring(atAngek, 13, 180);
	return (
		<AbsoluteFill style={{backgroundColor: '#080C1F', overflow: 'hidden'}}>
			<CityPlane
				map={ZUG_MAP}
				k={ZUG_K}
				camera={cam as PlaneCamera}
				anchor={[540, 880]}
				floors={4}
				spots={[
					{at: STOP.start.at, color: ORANGE, radius: 60, on: on('start'), pulse},
					{at: STOP.ziel.at, color: YELLOW, radius: 70, on: on('ziel'), pulse},
				]}
				highlightStreets={[
					{name: 'Taunusanlage', color: ORANGE, on: interpolate(head, [0.6, 1.2], [0, 0.8], clamp)},
					{name: 'Bockenheimer Landstraße', color: ORANGE, on: interpolate(head, [2.1, 2.8], [0, 0.6], clamp)},
				]}
				groundExtras={<MarchTrail head={head} />}
				markers={markers}
			/>
			<Rain n={60} opacity={0.22} seed="zug" />
			<Shade top={0.95} bottom={0.9} mid={[36, 62]} />
			<SceneTag text="3 · DEMOZUG BUNDESBEWEGUNG" color={ORANGE} icon="route" />
			{/* Status-Leiste oben */}
			<div style={{position: 'absolute', left: LAYOUT.left, top: 378, width: LAYOUT.width, display: 'flex', flexDirection: 'column', gap: 10}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '8px 16px', borderRadius: 16, background: 'rgba(10,12,32,0.94)', border: `2.5px solid ${ORANGE}`, opacity: Math.min(1, lateOn * 1.7), translate: `${(1 - lateOn) * -60}px 0`}}>
					<P2Icon name="clock" size={40} color={ORANGE} stroke={2.6} />
					<div>
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, color: COLORS.text, whiteSpace: 'nowrap'}}>{MARCH.late}</div>
						<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted, whiteSpace: 'nowrap'}}>{MARCH.lateNote}</div>
					</div>
				</div>
				<div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '8px 16px', borderRadius: 16, background: 'rgba(10,12,32,0.94)', border: `2.5px solid ${YELLOW}`, opacity: Math.min(1, arrOn * 1.7), translate: `${(1 - arrOn) * -60}px 0`}}>
					<P2Icon name="check" size={40} color={YELLOW} stroke={3} />
					<div>
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, color: COLORS.text, whiteSpace: 'nowrap'}}>{MARCH.arrived}</div>
						<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted, whiteSpace: 'nowrap'}}>{MARCH.arrivedNote}</div>
					</div>
				</div>
			</div>
			{/* Teilnehmerzahl */}
			<In at={atCount} dy={50} style={{left: LAYOUT.left, top: 1000, width: LAYOUT.width}}>
				<Card color={BLUE} style={{padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 6}} glow={0.35}>
					<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 36, color: COLORS.textMuted}}>RUND</span>
						<CountUp value={MARCH.count} at={atCount} dur={Math.max(10, at1000 + 2 - atCount)} style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 96, lineHeight: 1, color: COLORS.text, textShadow: `0 0 40px ${withAlpha(BLUE, 0.6)}`}} />
						<div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: COLORS.text}}>TEILNEHMENDE</span>
							<Chip kind="LAUT POLIZEI" size={15} />
						</div>
					</div>
					<div style={{display: 'flex', gap: 8}}>
						{MARCH.counts.map((c, i) => (
							<div key={c.time} style={{flex: 1, padding: '4px 8px', borderRadius: 10, background: withAlpha(i === 2 ? BLUE : '#FFFFFF', i === 2 ? 0.2 : 0.07), opacity: interpolate(frame, [atCount + 6 + i * 5, atCount + 12 + i * 5], [0, 1], clamp)}}>
								<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 20, color: i === 2 ? COLORS.text : COLORS.textMuted}}>
									{c.time} · {c.value}
								</div>
								<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 17, lineHeight: 1.15, color: COLORS.textMuted}}>{c.by}</div>
							</div>
						))}
					</div>
					<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 19, color: withAlpha(COLORS.text, 0.6)}}>{MARCH.unofficial}</div>
				</Card>
			</In>
			<div style={{opacity: interpolate(frame, [atCount - 4, atCount + 4], [1, 0], clamp)}}>
				<Note text={MARCH.mapNote} top={1000} icon="route" />
			</div>
			<div style={{position: 'absolute', left: LAYOUT.left, top: 1202, opacity: interpolate(frame, [atCount + 8, atCount + 16], [0, 1], clamp)}}>
				<Chip kind="SCHEMATISCH" size={15} />
				<span style={{marginLeft: 10, fontFamily: FONTS.body, fontWeight: 700, fontSize: 20, color: COLORS.textMuted, padding: '2px 8px', borderRadius: 8, background: 'rgba(8,10,28,0.8)'}}>Verlauf zwischen gemeldeten Punkten · © OpenStreetMap-Mitwirkende</span>
			</div>
			<Sfx name="whoosh" at={0} volume={0.4} />
			<Sfx name="blip" at={4} volume={0.5} />
			<Sfx name="tick" at={atLate} volume={0.55} />
			<Sfx name="blip" at={atOper} volume={0.5} />
			<Sfx name="whoosh" at={atBock - 4} volume={0.3} />
			<Sfx name="blip" at={atBock} volume={0.55} />
			<Sfx name="pop" at={atAngek} volume={0.45} />
			<Sfx name="softImpact" at={at1000 + 2} volume={0.6} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 5: Erwartung vs. tatsächlich */

const BAR_W = 540;
const barLen = (v: number) => Math.max(8, (v / COMPARE.max) * BAR_W);

const CompareRow: React.FC<{row: (typeof COMPARE.rows)[number]; at: number; expAt: number; claimAt: number; actAt: number; color: string}> = ({row, at, expAt, claimAt, actAt, color}) => {
	const frame = useCurrentFrame();
	const e = interpolate(frame, [expAt, expAt + 14], [0, 1], {...clamp, easing: EASE_OUT});
	const c = interpolate(frame, [claimAt, claimAt + 16], [0, 1], {...clamp, easing: EASE_OUT});
	const a = interpolate(frame, [actAt, actAt + 14], [0, 1], {...clamp, easing: EASE_OUT});
	return (
		<In at={at} dx={-50} dy={0} style={{left: LAYOUT.left, width: LAYOUT.width}}>
			<Card color={color} style={{padding: '12px 18px 14px'}} glow={0.2}>
				<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 32, color, letterSpacing: 0.5}}>{row.title}</div>
				<div style={{position: 'relative', marginTop: 12, height: 100}}>
					{/* Skala-Hintergrund */}
					<div style={{position: 'absolute', left: 0, top: 0, width: BAR_W, height: 42, borderRadius: 10, background: withAlpha('#FFFFFF', 0.05)}} />
					{row.claim ? <div style={{position: 'absolute', left: 0, top: 0, width: barLen(row.claim) * c, height: 42, borderRadius: 10, border: `3px dashed ${withAlpha('#FFFFFF', 0.9)}`, background: `repeating-linear-gradient(135deg, ${withAlpha('#FFFFFF', 0.12)} 0 8px, rgba(0,0,0,0) 8px 16px)`, boxSizing: 'border-box'}} /> : null}
					{row.expected ? <div style={{position: 'absolute', left: 0, top: 0, width: barLen(row.expected) * e, height: 42, borderRadius: 10, border: `3px solid ${YELLOW}`, background: withAlpha(YELLOW, 0.12), boxSizing: 'border-box'}} /> : null}
					<div style={{position: 'absolute', left: 0, top: 54, width: barLen(row.actual) * a, height: 42, borderRadius: 10, background: `linear-gradient(90deg, ${color}, ${mix(color, '#FFFFFF', 0.3)})`, boxShadow: `0 0 18px ${withAlpha(color, 0.5)}`}} />
					<div style={{position: 'absolute', left: BAR_W + 16, top: 0, width: LAYOUT.width - BAR_W - 52, display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 50, lineHeight: 1, color: COLORS.text, opacity: a, whiteSpace: 'nowrap'}}>{row.actualText}</span>
						<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted, opacity: a}}>laut {row.actualBy}</span>
					</div>
				</div>
				<div style={{marginTop: 4, display: 'flex', gap: 18, flexWrap: 'wrap', fontFamily: FONTS.body, fontWeight: 700, fontSize: 23, color: COLORS.textMuted}}>
					{row.expected ? <span style={{color: YELLOW, opacity: Math.max(0.35, e)}}>■ {row.expectedText}</span> : <span>{row.expectedText}</span>}
					{row.claimText ? <span style={{opacity: Math.max(0.35, c)}}>┅ {row.claimText}</span> : null}
				</div>
			</Card>
		</In>
	);
};

export const ZahlenScene: React.FC<SceneProps> = ({cues}) => {
	const e1 = cue(cues, 'e1', 0);
	const e2 = cue(cues, 'e2', 80);
	const at1500 = wordFrame(cues, '1.500', e1.from + 30) - 4;
	const at5000 = wordFrame(cues, '5.000', at1500 + 30) - 4;
	const atSchul = Math.max(at5000 + 10, e2.from - 4);
	const at600 = wordFrame(cues, '600', atSchul + 30);
	const atNoSum = at600 + 6;
	const [zug, werft, schul] = COMPARE.rows;
	return (
		<AbsoluteFill style={{backgroundColor: '#070A1E', overflow: 'hidden'}}>
			<AbsoluteFill style={{background: `radial-gradient(ellipse 80% 50% at 50% 40%, ${withAlpha(BLUE, 0.14)} 0%, rgba(0,0,0,0) 70%)`}} />
			<Rain n={36} opacity={0.14} seed="zahlen" />
			<SceneTag text="4 · ERWARTET VS. GEKOMMEN" color={YELLOW} icon="users" />
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 376, display: 'flex', alignItems: 'center', gap: 14}}>
				<Chip kind="ERWARTUNG" size={17} />
				<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 23, color: COLORS.textMuted}}>Rahmen = erwartet · Balken = tatsächlich · gleiche Skala</span>
			</div>
			<div style={{position: 'absolute', top: 428}}>
				<CompareRow row={zug} at={0} expAt={at1500} claimAt={at5000} actAt={4} color={ORANGE} />
			</div>
			<div style={{position: 'absolute', top: 670}}>
				<CompareRow row={werft} at={10} expAt={14} claimAt={0} actAt={22} color={RED} />
			</div>
			<div style={{position: 'absolute', top: 912}}>
				<CompareRow row={schul} at={atSchul} expAt={atSchul} claimAt={0} actAt={at600 - 8} color={CYAN} />
			</div>
			<In at={atNoSum} dy={30} style={{left: LAYOUT.left, top: 1160, width: LAYOUT.width}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 18px', borderRadius: 18, background: 'rgba(10,12,32,0.95)', border: `3px solid ${ACCENT.no}`}}>
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 44, color: ACCENT.no}}>≠ Σ</span>
					<div>
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 32, color: COLORS.text}}>{COMPARE.noSum}</div>
						<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted}}>{COMPARE.noSumSub}</div>
					</div>
				</div>
			</In>
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="click" at={10} volume={0.35} />
			<Sfx name="pop" at={at1500} volume={0.45} />
			<Sfx name="pop" at={at5000} volume={0.45} />
			<Sfx name="click" at={atSchul} volume={0.4} />
			<Sfx name="softImpact" at={at600} volume={0.5} />
			<Sfx name="stamp" at={atNoSum} volume={0.4} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 6: Polizei */

export const PolizeiScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const p1 = cue(cues, 'p1', 0);
	const atFried = wordFrame(cues, 'friedlich', p1.from + 20) - 6;
	const atPyro = wordFrame(cues, 'Pyrotechnik', atFried + 30) - 6;
	const spark = interpolate(frame, [atPyro, atPyro + 30], [0, 1], clamp);
	const pull = interpolate(frame, [0, durationInFrames], [0, 1], clamp);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{scale: String(1.1 - pull * 0.08), transformOrigin: '50% 70%'}}>
				<NightCity mood={MOODS.police} progress={0.6 + pull * 0.2} litRatio={0.4} emergency={0.9} bokeh={18} showPromenade={false} />
			</AbsoluteFill>
			<Rain n={70} opacity={0.26} seed="pol" />
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.94) 0%, rgba(4,6,20,0.78) 40%, rgba(4,6,20,0.5) 70%, rgba(4,6,20,0.85) 100%)'}} />
			<SceneTag text="5 · POLIZEI-ZWISCHENSTAND" color={BLUE} icon="shield" />
			{/* friedlich */}
			<In at={Math.max(2, Math.min(atFried, 10))} dx={-60} dy={0} style={{left: LAYOUT.left, top: 380, width: LAYOUT.width}}>
				<Card color={GREEN} style={{padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 18}} glow={0.3}>
					<div style={{width: 92, height: 92, borderRadius: 46, background: withAlpha(GREEN, 0.18), border: `3px solid ${GREEN}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
						<P2Icon name="check" size={58} color={GREEN} stroke={3.4} />
					</div>
					<div>
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 52, lineHeight: 1, color: COLORS.text}}>{POLICE.calm}</div>
						<div style={{marginTop: 8, display: 'flex', alignItems: 'center', gap: 10}}>
							<Chip kind="LAUT POLIZEI" size={15} />
							<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 21, color: COLORS.textMuted}}>{POLICE.calmNote}</span>
						</div>
					</div>
				</Card>
			</In>
			{/* Pyrotechnik */}
			<In at={atPyro} dx={60} dy={0} style={{left: LAYOUT.left, top: 586, width: LAYOUT.width}}>
				<Card color={ORANGE} style={{padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 18}} glow={0.35 + 0.3 * Math.sin(spark * Math.PI)}>
					<div style={{position: 'relative', width: 92, height: 92, borderRadius: 46, background: withAlpha(ORANGE, 0.18), border: `3px solid ${ORANGE}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
						<P2Icon name="flare" size={58} color={ORANGE} stroke={2.8} />
						{new Array(8).fill(0).map((_, i) => {
							const a = (i / 8) * Math.PI * 2;
							const r = 40 + spark * 34;
							return <div key={i} style={{position: 'absolute', left: 46 + Math.cos(a) * r - 4, top: 46 + Math.sin(a) * r - 4, width: 8, height: 8, borderRadius: 4, background: i % 2 ? YELLOW : ORANGE, opacity: (1 - spark) * 0.9}} />;
						})}
					</div>
					<div style={{flex: 1}}>
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, lineHeight: 1.05, color: COLORS.text}}>{POLICE.pyro}</div>
						<div style={{marginTop: 8, display: 'flex', alignItems: 'center', gap: 10}}>
							<Chip kind="LAUT POLIZEI" size={15} />
							<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 21, color: COLORS.textMuted}}>{POLICE.pyroNote}</span>
						</div>
						<div style={{marginTop: 6, fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, lineHeight: 1.2, color: COLORS.textMuted}}>{POLICE.gear}</div>
					</div>
				</Card>
			</In>
			{/* Kontext */}
			<In at={atPyro + 14} dy={30} style={{left: LAYOUT.left, top: 846, width: LAYOUT.width}}>
				<div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '8px 16px', borderRadius: 14, background: 'rgba(10,12,32,0.9)', border: `2px solid ${withAlpha(BLUE, 0.6)}`}}>
						<P2Icon name="shield" size={32} color={BLUE} />
						<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, color: COLORS.text}}>
							{POLICE.force} <span style={{color: COLORS.textMuted}}>({POLICE.forceBy})</span>
						</span>
					</div>
					<div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '8px 16px', borderRadius: 14, background: 'rgba(10,12,32,0.9)', border: `2px solid ${withAlpha(BLUE, 0.6)}`}}>
						<P2Icon name="pin" size={32} color={BLUE} />
						<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, color: COLORS.text}}>{POLICE.zeil}</span>
					</div>
				</div>
			</In>
			<div style={{position: 'absolute', right: 160, top: 1238, fontFamily: FONTS.body, fontWeight: 700, fontSize: 18, letterSpacing: 1.5, color: withAlpha('#FFFFFF', 0.6)}}>ILLUSTRATION</div>
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="pop" at={Math.max(2, Math.min(atFried, 10))} volume={0.45} />
			<Sfx name="softImpact" at={atPyro} volume={0.5} />
			<Sfx name="click" at={atPyro + 14} volume={0.35} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 7: Offen + Abo-Aufruf */

export const OutroScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const q = cue(cues, 'q1', 50);
	const c = cue(cues, 'cta', 100);
	const atQ = Math.max(20, q.from - 2);
	const atCta = Math.max(atQ + 20, c.from - 2);
	const swap = interpolate(frame, [atQ - 6, atQ + 6], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const qs = springIn({frame, fps, delay: atQ, damping: 13, stiffness: 180});
	const cta = springIn({frame, fps, delay: atCta, damping: 13, stiffness: 180});
	const pull = interpolate(frame, [0, durationInFrames], [0, 1], {...clamp, easing: EASE_OUT});
	const press = frame >= atCta + 24 ? interpolate(frame, [atCta + 24, atCta + 30, atCta + 36], [1, 0.9, 1], clamp) : 1;
	const followed = frame >= atCta + 28;
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{scale: String(1.15 - pull * 0.15), transformOrigin: '50% 70%'}}>
				<NightCity mood={blendMood(MOODS.police, MOODS.dusk, 0.5)} progress={pull} litRatio={0.42} showMoon={false} bokeh={16} />
			</AbsoluteFill>
			<Rain n={50} opacity={0.2} seed="out" />
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.94) 0%, rgba(4,6,20,0.76) 50%, rgba(4,6,20,0.55) 75%, rgba(4,6,20,0.85) 100%)'}} />
			{/* Phase 1: Vorbilanz + offen */}
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 384 - swap * 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, scale: String(1 - swap * 0.32), transformOrigin: '50% 0%'}}>
				<Stamp text={STAND.label} sub={`STAND ${STAND.date}, ${STAND.time} UHR`} color={RED} at={0} rotate={-4} size={64} />
			</div>
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 560, opacity: 1 - swap, translate: `0 ${swap * -30}px`}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12}}>
					<Chip kind="OFFEN" size={20} />
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, color: COLORS.text}}>{OUTRO.openTitle}</span>
				</div>
				{OUTRO.open.map((it, i) => (
					<div key={it.text} style={{display: 'flex', alignItems: 'center', gap: 14, padding: '12px 18px', marginBottom: 12, borderRadius: 16, background: 'rgba(10,12,32,0.92)', border: `2px solid ${withAlpha(ACCENT.no, 0.6)}`, opacity: interpolate(frame, [6 + i * 8, 14 + i * 8], [0, 1], clamp)}}>
						<P2Icon name={it.icon as P2IconName} size={36} color={ACCENT.no} />
						<span style={{fontFamily: FONTS.body, fontWeight: 800, fontSize: 28, lineHeight: 1.2, color: COLORS.text}}>{it.text}</span>
					</div>
				))}
				<div style={{marginTop: 8, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, letterSpacing: 2, color: YELLOW, textAlign: 'center', opacity: interpolate(frame, [20, 30], [0, 1], clamp)}}>{OUTRO.noFinal}</div>
			</div>
			{/* Phase 2: Frage + Logo + Abo */}
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 500, display: 'flex', justifyContent: 'center', opacity: Math.min(1, qs * 1.7), translate: `0 ${(1 - qs) * 30}px`, scale: String((0.9 + 0.1 * qs) * (1 - 0.06 * cta))}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 24px', borderRadius: 22, background: 'rgba(8,10,28,0.95)', border: `3px solid ${YELLOW}`, boxShadow: `0 20px 50px rgba(0,0,0,0.6), 0 0 30px ${withAlpha(YELLOW, 0.25)}`}}>
					<P2Icon name="chat" size={40} color={YELLOW} />
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, lineHeight: 1.1, color: COLORS.text, maxWidth: 680}}>{OUTRO.question}</span>
				</div>
			</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 650, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, opacity: Math.min(1, cta * 2), translate: `0 ${(1 - cta) * 50}px`}}>
				<div style={{position: 'relative'}}>
					<BrandLogo size={220} ring={6 + Math.sin(frame / 4) * 3} />
					<div style={{position: 'absolute', left: '50%', bottom: -26, translate: '-50% 0', scale: String(press), width: 68, height: 68, borderRadius: 34, background: followed ? GREEN : RED, border: '4px solid #FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 24px rgba(0,0,0,0.5)'}}>
						<P2Icon name={followed ? 'check' : 'plus'} size={38} color="#FFFFFF" stroke={3.4} />
					</div>
				</div>
				<span style={{marginTop: 12, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 52, color: COLORS.text}}>{handleWithAt()}</span>
				<div style={{padding: '12px 30px 14px', borderRadius: 20, background: RED, boxShadow: '0 20px 50px rgba(255,59,78,0.35)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 42, color: '#FFFFFF', scale: String(followed ? 1 + 0.035 * Math.sin((frame - atCta - 28) / 5) : 1)}}>{OUTRO.cta}</div>
				<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 24, letterSpacing: 2.5, color: YELLOW}}>{OUTRO.ctaSub}</span>
			</div>
			<Sfx name="stamp" at={0} volume={0.5} />
			<Sfx name="click" at={6} volume={0.35} />
			<Sfx name="notify" at={atQ} volume={0.45} />
			<Sfx name="pop" at={atCta} volume={0.6} />
			<Sfx name="click" at={atCta + 26} volume={0.6} />
		</AbsoluteFill>
	);
};
