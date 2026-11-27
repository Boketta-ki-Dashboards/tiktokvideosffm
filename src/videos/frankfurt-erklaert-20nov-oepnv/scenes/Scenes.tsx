import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {FrankfurtSkyline} from '../../../components/backgrounds/FrankfurtSkyline';
import {BrandLogo} from '../../../components/brand/BrandLogo';
import {CityPlane, cityPlaneXY} from '../../../components/map/CityPlane';
import {type CityMapData, type LatLon, projectLatLon} from '../../../components/map/CityStreetMap';
import {interpolateCamera, type PlaneBillboard, type PlaneCamera} from '../../../components/map/TiltedPlane';
import oepnvMap from '../../../data/maps/frankfurt-altstadt-oepnv.json';
import oepnvRoutes from '../../../data/maps/frankfurt-altstadt-oepnv.routes.json';
import {TopTag} from '../../../formats/frankfurt-erklaert/Branding';
import {SourceBar} from '../../../formats/frankfurt-erklaert/components';
import {ACCENT, FORMAT, LAYOUT} from '../../../formats/frankfurt-erklaert/theme';
import {DayTimeline} from '../../../formats/frankfurt-erklaert/visuals/DayTimeline';
import {clamp, EASE_IN_OUT, EASE_OUT, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {handleWithAt} from '../../../theme/brand';
import {COLORS, FONTS} from '../../../theme/tokens';
import {blendMood, MOODS, NightCity} from '../../frankfurt-2026-11-20-ausblick/premium/NightCity';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {ASSEMBLIES} from '../../frankfurt-erklaert-20nov-demo-update/content';
import {Card, P2Icon, type P2IconName, Stars, useSpring} from '../../frankfurt-erklaert-genz-phase2-2026-11-14/scenes/kit';
import {CHECK, COVER, CTA, MAP as MAPTXT, PLACES, SOURCES, STAND, TRAM, UBAHN, WEEKEND, WHY} from '../content';
import {OEPNV_COVER_LAYOUT} from '../cover-layout';
import {BigClock, BUS_COLOR, DfiBoard, LineBadge, MAYBE_COLOR, RoemerFacade, TRAM_COLOR, TramSide, TransitPhone, U_COLORS, UBahnTrain} from '../visuals/Transit';

const RED = ACCENT.brand;
const BLUE = ACCENT.info;
const GREEN = ACCENT.yes;
const ORANGE = '#FF8A3D';

/* ------------------------------------------------------------------ Kategorie-Chips */

type Kind = 'LAUT VGF' | 'LAUT INNENMINISTERIUM' | 'NACH BISHERIGEM STAND' | 'MÖGLICH' | 'SCHEMATISCH' | 'ILLUSTRATION' | 'WOCHENENDE';
const KIND_COLOR: Record<Kind, string> = {
	'LAUT VGF': BLUE,
	'LAUT INNENMINISTERIUM': BLUE,
	'NACH BISHERIGEM STAND': GREEN,
	MÖGLICH: MAYBE_COLOR,
	SCHEMATISCH: '#9AA6CC',
	ILLUSTRATION: '#9AA6CC',
	WOCHENENDE: ORANGE,
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

/** Pop-Einblendung für Linienschilder (überschwingend). */
const PopIn: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, children, style}) => {
	const s = useSpring(at, 9, 220);
	const frame = useCurrentFrame();
	if (frame < at - 1) return null;
	return <div style={{opacity: Math.min(1, s * 2), scale: String(0.4 + 0.6 * s), rotate: `${(1 - s) * -12}deg`, ...style}}>{children}</div>;
};

const SceneTag: React.FC<{text: string; color: string; icon: P2IconName}> = ({text, color, icon}) => <TopTag text={text} color={color} icon={<P2Icon name={icon} size={30} color={ACCENT.ink} stroke={2.6} />} />;

const Shade: React.FC<{top?: number; bottom?: number; mid?: [number, number]}> = ({top = 0.94, bottom = 0.88, mid = [44, 70]}) => (
	<AbsoluteFill style={{background: `linear-gradient(rgba(4,6,20,${top}) 0%, rgba(4,6,20,${top * 0.86}) 22%, rgba(4,6,20,0) ${mid[0]}%, rgba(4,6,20,0) ${mid[1]}%, rgba(4,6,20,${bottom * 0.8}) 80%, rgba(4,6,20,${bottom}) 100%)`, pointerEvents: 'none'}} />
);

const Hint: React.FC<{text: string; top: number; kind?: Kind}> = ({text, top, kind}) => (
	<div style={{position: 'absolute', left: LAYOUT.left, top, display: 'flex', alignItems: 'center', gap: 10, maxWidth: LAYOUT.width}}>
		{kind ? <Chip kind={kind} size={15} /> : null}
		<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted, padding: '2px 8px', borderRadius: 8, background: 'rgba(8,10,28,0.85)'}}>{text}</span>
	</div>
);

/** Kartenbeschriftung (Pin + Name) – 2D über der Ebene. */
const Marker: React.FC<{title: string; sub?: string; color: string; on: number; small?: boolean; icon?: React.ReactNode}> = ({title, sub, color, on, small, icon}) => (
	<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: on, scale: String(0.7 + 0.3 * on), transformOrigin: '50% 100%'}}>
		<div style={{display: 'flex', alignItems: 'center', gap: 8, padding: small ? '4px 10px 5px' : '6px 14px 8px', borderRadius: 14, background: 'rgba(8,10,28,0.95)', border: `3px solid ${color}`, boxShadow: `0 12px 30px rgba(0,0,0,0.55), 0 0 24px ${withAlpha(color, 0.35)}`, whiteSpace: 'nowrap'}}>
			{icon}
			<div style={{textAlign: 'center'}}>
				{sub ? <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: small ? 16 : 19, letterSpacing: 1.3, color}}>{sub}</div> : null}
				<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: small ? 21 : 26, color: COLORS.text}}>{title}</div>
			</div>
		</div>
		<div style={{width: 4, height: small ? 18 : 28, background: `linear-gradient(${color}, ${withAlpha(color, 0.1)})`}} />
		<div style={{width: 18, height: 18, borderRadius: 9, marginTop: -4, background: color, border: '3px solid #FFFFFF', boxShadow: `0 0 18px ${withAlpha(color, 0.9)}`}} />
	</div>
);

/* ------------------------------------------------------------------ Szene 1: Titelbild = erste Szene */

/** Grafik im Titelbild: Uhr (8:30) + Straßenbahn – Höhe 150 px. */
const CoverViz: React.FC<{width: number; pulse?: number}> = ({width, pulse = 0}) => {
	const clock = 104;
	const tramW = 482;
	const gap = 40;
	const left = (width - (clock + gap + tramW)) / 2;
	return (
		<div style={{position: 'relative', width, height: 150}}>
			<div style={{position: 'absolute', left, top: 0, scale: String(1 + 0.08 * Math.sin(pulse * Math.PI))}}>
				<BigClock size={clock} minutes={TRAM.minutes} digital={TRAM.time} alarm={pulse > 0 ? 1 : 0.3} />
			</div>
			<div style={{position: 'absolute', left: left + clock + gap, top: 0}}>
				<TramSide width={tramW} line="11" />
			</div>
		</div>
	);
};

/**
 * Titelbild (Video-Frame 0 und PNG, nach COVER_ZONE): Serientitel, „FRANKFURT“, groß „MORGEN!“, rote Karte „DIESE BAHNEN SIND BETROFFEN“,
 * Uhr + Straßenbahn, Linienschilder 11 · 12 · 14 „AB 8:30 UHR“, Datum, Logo + Account; im PNG zusätzlich die Frage.
 */
export const OepnvCover: React.FC<{morph?: number; pulse?: number; thumbnail?: boolean}> = ({morph = 0, pulse = 0, thumbnail = false}) => {
	const frame = useCurrentFrame();
	const L = OEPNV_COVER_LAYOUT;
	const m = EASE_IN_OUT(Math.min(1, Math.max(0, morph)));
	const text = 1 - Math.min(1, m * 1.6);
	const bob = Math.sin(frame / 26) * 3;
	// Verwandlung: Kamera fliegt in die Uhr (nächste Szene beginnt mit der großen Uhr)
	const focusX = L.vizLeft + (L.vizWidth - (104 + 40 + 482)) / 2 + 52;
	const focusY = L.vizTop + 52;
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{scale: String(1 + m * 0.1), transformOrigin: '50% 40%'}}>
				<NightCity mood={blendMood(MOODS.dusk, MOODS.calm, 0.25)} progress={0.4 + frame / 2400} litRatio={0.45} bokeh={10} showPromenade={false} showMoon />
			</AbsoluteFill>
			<Stars seed="oe11" n={36} height={380} />
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.5) 0%, rgba(4,6,20,0.12) 15%, rgba(4,6,20,0.25) 24%, rgba(4,6,20,0.72) 33%, rgba(4,6,20,0.9) 46%, rgba(4,6,20,0.92) 70%, rgba(4,6,20,0.82) 100%)'}} />
			<div style={{position: 'absolute', inset: 0, scale: String(1 + m * 1.6), transformOrigin: `${focusX}px ${focusY}px`}}>
				<div style={{opacity: text, translate: `0 ${(1 - text) * -24}px`}}>
					<div style={{position: 'absolute', left: 0, right: 0, top: L.brandTop, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16}}>
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 50, lineHeight: 0.98, color: COLORS.text, textAlign: 'right', textShadow: '0 6px 24px rgba(0,0,0,0.8)'}}>
							FRANKFURT
							<br />
							ERKLÄRT
						</div>
						<div style={{padding: '9px 16px', borderRadius: 10, background: RED, boxShadow: '0 10px 26px rgba(255,59,78,0.4)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, letterSpacing: 3, color: '#FFFFFF'}}>{FORMAT.sub}</div>
					</div>
					<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.kickerTop, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: L.kickerSize, lineHeight: 1.05, letterSpacing: 1, color: COLORS.text, whiteSpace: 'nowrap', textShadow: '0 8px 26px rgba(0,0,0,0.9)'}}>{COVER.kicker}</div>
					<div style={{position: 'absolute', left: 0, right: 0, top: L.bigTop + bob, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: L.bigSize, lineHeight: 1, letterSpacing: -4, color: COLORS.signal, whiteSpace: 'nowrap', textShadow: `0 0 70px ${withAlpha(COLORS.signal, 0.45)}, 0 20px 50px rgba(0,0,0,0.85)`}}>
						{COVER.big.replace('!', '')}
						<span style={{color: RED}}>!</span>
					</div>
					<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.cardTop, display: 'flex', justifyContent: 'center'}}>
						<div style={{padding: '8px 24px 10px', borderRadius: 16, background: RED, boxShadow: '0 16px 40px rgba(255,59,78,0.35)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: L.cardFont, lineHeight: 1.1, color: '#FFFFFF', whiteSpace: 'nowrap'}}>{COVER.sub}</div>
					</div>
				</div>
				<div style={{position: 'absolute', left: L.vizLeft, top: L.vizTop, opacity: Math.max(text, 1 - m * 0.3)}}>
					<CoverViz width={L.vizWidth} pulse={pulse} />
				</div>
				<div style={{opacity: text}}>
					<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.smallTop, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12}}>
						{COVER.lines.map((l) => (
							<LineBadge key={l} line={l} kind="tram" size={58} glow={0.4} />
						))}
						<span style={{marginLeft: 6, padding: '6px 14px', borderRadius: 12, background: 'rgba(8,10,28,0.92)', border: `2.5px solid ${COLORS.signal}`, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 32, color: COLORS.signal, whiteSpace: 'nowrap'}}>{COVER.from}</span>
					</div>
					<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.dateTop, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, letterSpacing: 2.5, color: COLORS.text, whiteSpace: 'nowrap', textShadow: '0 4px 14px rgba(0,0,0,0.9)'}}>{COVER.small}</div>
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

/** Szene 1 – Titelbild im Video (ab Frame 0 vollständig); bei „halb neun“ pulsiert die Uhr, am Ende Flug in die Uhr. */
export const CoverScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const h2 = cue(cues, 'hook2', 30);
	const atBahn = wordFrame(cues, 'Straßenbahnen', h2.from + 20);
	const at9 = wordFrame(cues, '8:30', h2.from + 60);
	const pulse = interpolate(frame, [at9 - 2, at9 + 18], [0, 1], clamp);
	const morph = interpolate(frame, [durationInFrames - 22, durationInFrames - 2], [0, 1], clamp);
	return (
		<AbsoluteFill>
			<OepnvCover morph={morph} pulse={pulse > 0 && pulse < 1 ? pulse : 0} />
			<Sfx name="softImpact" at={0} volume={0.5} />
			<Sfx name="whoosh" at={atBahn - 2} volume={0.3} />
			<Sfx name="tick" at={at9 - 2} volume={0.6} />
			<Sfx name="whoosh" at={durationInFrames - 20} volume={0.45} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 2: Uhr 8:30 + Linien 11/12/14 + Straßenbahn */

export const TramScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const t1 = cue(cues, 't1', 0);
	const atVgf = wordFrame(cues, 'VGF', t1.from + 4);
	const at11 = wordFrame(cues, '11', t1.from + 30);
	const at12 = wordFrame(cues, '12', at11 + 10);
	const at14 = wordFrame(cues, '14', at12 + 10);
	const at9 = wordFrame(cues, '8:30', at14 + 20);
	const atAlt = wordFrame(cues, 'Altstadtstrecke', at9 + 30);
	// Uhr läuft auf 8:30 und bleibt dort
	const minutes = interpolate(frame, [0, Math.max(14, at9 - 2)], [TRAM.minutes - 12, TRAM.minutes], {...clamp, easing: EASE_OUT});
	const alarm = interpolate(frame, [at9 - 2, at9 + 10], [0, 1], clamp);
	// Straßenbahn fährt ein und bremst vor der Altstadt
	const drive = interpolate(frame, [0, Math.max(20, at11 + 6)], [0, 1], {...clamp, easing: EASE_OUT});
	const tramX = -980 + drive * 1050;
	const stopShake = frame >= atAlt - 2 ? Math.sin((frame - atAlt) / 1.6) * Math.max(0, 6 - (frame - atAlt) * 0.4) : 0;
	const barrier = useSpring(atAlt - 2, 11, 200);
	const lines = [
		{l: '11', at: at11},
		{l: '12', at: at12},
		{l: '14', at: at14},
	];
	return (
		<AbsoluteFill style={{backgroundColor: '#070B22', overflow: 'hidden'}}>
			<AbsoluteFill style={{background: 'linear-gradient(#0A0E2C 0%, #1B1745 34%, #3A2050 46%, #12163A 58%, #090C22 100%)'}} />
			<Stars seed="oe11b" n={30} height={420} />
			<div style={{position: 'absolute', left: -60 - frame * 0.25, top: 470, opacity: 0.55}}>
				<FrankfurtSkyline width={1300} litRatio={0.35} showRiver={false} showBridge={false} />
			</div>
			{/* Altstadt-Häuserzeile (Römer-Giebel, stilisiert) */}
			<div style={{position: 'absolute', left: 0, right: 0, top: 742, display: 'flex', justifyContent: 'space-around', opacity: 0.95, translate: `${-frame * 0.4}px 0`}}>
				<RoemerFacade width={300} lit={0.6} />
				<RoemerFacade width={300} lit={0.8} />
				<RoemerFacade width={300} lit={0.7} />
				<RoemerFacade width={300} lit={0.6} />
			</div>
			{/* Straße mit Gleis */}
			<div style={{position: 'absolute', left: 0, right: 0, top: 976, height: 260, background: 'linear-gradient(#1A1F3E, #0B0E24)'}} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 1110, height: 6, background: '#4A5680'}} />
			<div style={{position: 'absolute', left: tramX + stopShake, top: 862}}>
				<TramSide width={900} line="11" />
			</div>
			{/* Sperr-Balken über der Strecke (Symbol für „nicht über die Altstadtstrecke“) */}
			{frame >= atAlt - 3 ? (
				<div style={{position: 'absolute', left: 960 - 120 * barrier, top: 900, width: 110, height: 220, opacity: Math.min(1, barrier * 1.5)}}>
					<div style={{position: 'absolute', left: 48, top: 0, width: 12, height: 220, background: '#D9DEEF', borderRadius: 4}} />
					<div style={{position: 'absolute', left: 0, top: 30, width: 110, height: 40, borderRadius: 8, background: 'repeating-linear-gradient(-45deg, #FF3B4E 0 18px, #FFFFFF 18px 36px)', boxShadow: '0 8px 20px rgba(0,0,0,0.5)'}} />
				</div>
			) : null}
			<Shade top={0.95} bottom={0.88} mid={[38, 62]} />
			<SceneTag text="FREITAG · AB 8:30 UHR" color={RED} icon="clock" />
			<div style={{position: 'absolute', left: LAYOUT.left, top: 370, display: 'flex', alignItems: 'center', gap: 12, opacity: interpolate(frame, [atVgf - 6, atVgf + 4], [0.35, 1], clamp)}}>
				<Chip kind="LAUT VGF" size={18} />
				<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, color: COLORS.textMuted}}>Stand 19.11., 9 Uhr</span>
			</div>
			{/* Uhr */}
			<div style={{position: 'absolute', left: LAYOUT.left, top: 418, scale: String(1 + 0.05 * Math.sin(alarm * Math.PI))}}>
				<BigClock size={236} minutes={minutes} digital={TRAM.time} alarm={alarm} />
			</div>
			{/* Linienschilder */}
			<div style={{position: 'absolute', left: 340, top: 430, display: 'flex', gap: 22}}>
				{lines.map(({l, at}) => (
					<PopIn key={l} at={at - 3}>
						<LineBadge line={l} kind="tram" size={176} glow={frame >= atAlt - 2 ? 0.2 : 0.6} />
					</PopIn>
				))}
			</div>
			{/* Titelkarte */}
			<In at={atAlt - 4} dy={30} style={{left: 372, top: 640, width: 644}}>
				<div style={{padding: '12px 22px 14px', borderRadius: 20, background: RED, boxShadow: '0 20px 50px rgba(255,59,78,0.4)'}}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 52, lineHeight: 1.02, color: '#FFFFFF'}}>
						ALTSTADTSTRECKE
						<br />
						GESPERRT
					</div>
				</div>
				<div style={{marginTop: 10, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, letterSpacing: 1.5, color: COLORS.signal}}>{TRAM.sub}</div>
			</In>
			<div style={{position: 'absolute', left: LAYOUT.left, top: 1150, display: 'flex', gap: 10}}>
				<Chip kind="ILLUSTRATION" size={15} />
			</div>
			<SourceBar text={TRAM.source} at={6} />
			<Sfx name="tick" at={2} volume={0.45} />
			<Sfx name="whoosh" at={4} volume={0.35} />
			{lines.map(({l, at}) => (
				<Sfx key={l} name="pop" at={at - 3} volume={0.55} />
			))}
			<Sfx name="tick" at={at9 - 2} volume={0.65} />
			<Sfx name="softImpact" at={atAlt - 3} volume={0.6} />
			<Sfx name="stamp" at={atAlt - 2} volume={0.35} />
			<Sfx name="whoosh" at={durationInFrames - 12} volume={0.3} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 3: OSM-Karte – Altstadtstrecke + mögliche Auswirkungen */

type RoutesFile = {routes: Record<string, {d: string}>; stops: Record<string, {x: number; y: number; lines: string[]}>};
const OEPNV_MAP = oepnvMap as unknown as CityMapData;
const ROUTES = oepnvRoutes as unknown as RoutesFile;
const MAP_K = 0.62;
const MW2 = OEPNV_MAP.meta.sizeMeters.width / 2;
const MH2 = OEPNV_MAP.meta.sizeMeters.height / 2;
/** Kartenmeter (wie in den Routendaten) → px in der Ebene. */
const mpx = (x: number, y: number): [number, number] => [(x + MW2) * MAP_K, (y + MH2) * MAP_K];
/** Geokoordinate → px in der Ebene. */
const llpx = (ll: LatLon): [number, number] => cityPlaneXY(OEPNV_MAP, MAP_K, ll);
const TRAM_D = ['11', '12', '14'].map((r) => ROUTES.routes[r].d).join('');
/**
 * Gesperrter Abschnitt (WGS84) laut VGF (19.11.): „Zwischen Börneplatz und HBF stellt die VGF den Tram-Betrieb ein“ – Straßenbahn der Linien
 * 11/12/14 von der Münchener Straße (östlich Halt Hbf/Münchener Straße) über Willy-Brandt-Platz und die Altstadtstrecke (Weißfrauen-, Bethmann-,
 * Braubachstraße; Halte Karmeliterkloster, Römer/Paulskirche) bis Börneplatz. Test prüft, welche Halte innen/außen liegen.
 */
export const ALTSTADT_CLIP: readonly LatLon[] = [
	[50.10643, 8.666596],
	[50.10738, 8.670238],
	[50.108556, 8.67416],
	[50.109957, 8.679202],
	[50.110952, 8.683405],
	[50.112037, 8.687607],
	[50.112942, 8.687607],
	[50.111766, 8.683405],
	[50.110862, 8.679202],
	[50.109596, 8.67416],
	[50.108465, 8.670238],
	[50.107606, 8.666596],
];
/** Umleitung „über Sachsenhausen“ (laut VGF) – genauer Weg nicht veröffentlicht: nur schematischer Bogen südlich des Mains. */
const DETOUR_LL: readonly LatLon[] = [
	[50.1069, 8.6662],
	[50.101, 8.679],
	[50.1121, 8.69],
];
const DETOUR_D = (() => {
	const [a, c, b] = DETOUR_LL.map((ll) => projectLatLon(OEPNV_MAP, ll).map((v) => Math.round(v * 10) / 10));
	return `M${a[0]} ${a[1]} Q${c[0]} ${c[1]} ${b[0]} ${b[1]}`;
})();
const ALT_CLIP_D = `M${ALTSTADT_CLIP.map((ll) => projectLatLon(OEPNV_MAP, ll).map((v) => Math.round(v * 10) / 10).join(' ')).join(' L')} Z`;
/** Kamerapunkte und Straßenbeschriftungen (WGS84). */
const MAP_VIEW = {
	overview: [50.1092, 8.6782] as LatLon,
	altstadt: [50.1086, 8.6786] as LatLon,
	sachsenhausen: [50.10505, 8.6795] as LatLon,
	east: [50.1131, 8.6879] as LatLon,
	kss: [50.11158, 8.68887] as LatLon,
	kas: [50.11629, 8.68852] as LatLon,
};

const TransitGround: React.FC<{alt: number; detour: number; maybe: number}> = ({alt, detour, maybe}) => {
	const frame = useCurrentFrame();
	const pulse = 0.5 + 0.5 * Math.sin(frame / 5);
	return (
		<g>
			<defs>
				<clipPath id="oepnvAltstadt">
					<path d={ALT_CLIP_D} />
				</clipPath>
			</defs>
			{/* U4/U5 unterirdisch – nur angedeutet */}
			<path d={ROUTES.routes.U4.d} fill="none" stroke={withAlpha(U_COLORS.U4, 0.22)} strokeWidth={7} strokeDasharray="5 12" strokeLinecap="round" />
			{/* Straßenbahn 11 · 12 · 14 */}
			<path d={TRAM_D} fill="none" stroke={withAlpha(TRAM_COLOR, 0.3)} strokeWidth={30} strokeLinecap="round" strokeLinejoin="round" />
			<path d={TRAM_D} fill="none" stroke={TRAM_COLOR} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />
			{/* 18 · 30 · M36 (Kontext) */}
			<g opacity={0.35 + 0.65 * maybe}>
				<path d={ROUTES.routes['18'].d} fill="none" stroke={TRAM_COLOR} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" opacity={0.75} />
				<path d={ROUTES.routes['30'].d} fill="none" stroke={BUS_COLOR} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="14 8" />
			</g>
			{/* Umleitung über Sachsenhausen: schematischer Bogen */}
			{detour > 0 ? (
				<g>
					<path d={DETOUR_D} fill="none" stroke={withAlpha(ORANGE, 0.3)} strokeWidth={44} strokeLinecap="round" pathLength={1} strokeDasharray={`${detour} 1`} />
					<path d={DETOUR_D} fill="none" stroke={ORANGE} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={`${detour} 1`} />
					{detour >= 1 ? <path d={DETOUR_D} fill="none" stroke="#FFFFFF" strokeOpacity={0.7} strokeWidth={6} strokeLinecap="round" strokeDasharray="8 30" strokeDashoffset={-frame * 3} /> : null}
				</g>
			) : null}
			{/* gesperrter Abschnitt: rot markiert */}
			<g clipPath="url(#oepnvAltstadt)" opacity={alt}>
				<path d={TRAM_D} fill="none" stroke={withAlpha(RED, 0.4 + 0.2 * pulse)} strokeWidth={60} strokeLinecap="round" strokeLinejoin="round" />
				<path d={TRAM_D} fill="none" stroke={RED} strokeWidth={17} strokeDasharray="26 16" strokeDashoffset={-frame * 2} strokeLinecap="round" />
			</g>
		</g>
	);
};

const S = ROUTES.stops;
const stopPx = (name: string) => mpx(S[name].x, S[name].y);

export const MapScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const t2 = cue(cues, 't2', 0);
	const m1 = cue(cues, 'm1', 120);
	// Sperrung Hbf–Börneplatz ab Szenenbeginn; bei „Komplettausfall“ zeichnet sich die Umleitung über Sachsenhausen (die Linien fahren weiter)
	const atBoerne = Math.max(2, t2.from + 2);
	const atHbf = atBoerne + 12;
	const atKomplett = wordFrame(cues, 'Komplettausfall', t2.from + 20);
	const atSachs = atKomplett + 4;
	const atMaybe = wordFrame(cues, 'Möglicherweise', m1.from);
	const at18 = wordFrame(cues, '18', atMaybe + 20);
	const at30 = wordFrame(cues, '30', at18 + 20);
	const atM36 = wordFrame(cues, 'M36', at30 + 10);
	const atKss = wordFrame(cues, 'Kurt-Schumacher-', atM36 + 20);
	const atKas = wordFrame(cues, 'Konrad-Adenauer-Straße', atKss + 20);
	const [cx0, cy0] = llpx(MAP_VIEW.overview);
	const [cx1, cy1] = llpx(MAP_VIEW.altstadt);
	const [cx2, cy2] = llpx(MAP_VIEW.east);
	const cam = interpolateCamera(
		frame,
		[
			{frame: 0, cam: {x: cx0, y: cy0, zoom: 1.0, tilt: 48, rotate: -14}},
			{frame: Math.max(12, atSachs), cam: {x: cx1, y: cy1, zoom: 0.94, tilt: 50, rotate: -10}},
			{frame: Math.max(atSachs + 20, m1.from - 4), cam: {x: cx1 + 20, y: cy1 - 6, zoom: 0.97, tilt: 50, rotate: -9}},
			{frame: Math.max(atSachs + 40, atMaybe + 26), cam: {x: cx2, y: cy2, zoom: 1.34, tilt: 50, rotate: -2}},
			{frame: durationInFrames + 10, cam: {x: cx2, y: cy2 - 16, zoom: 1.4, tilt: 51, rotate: 0}},
		],
		EASE_IN_OUT,
	);
	const alt = interpolate(frame, [Math.max(2, atBoerne - 8), atHbf + 6], [0, 1], clamp);
	const detour = interpolate(frame, [atSachs - 10, atSachs + 22], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const maybe = interpolate(frame, [atMaybe - 6, atMaybe + 10], [0, 1], clamp);
	const phaseB = interpolate(frame, [m1.from - 8, m1.from + 4], [0, 1], clamp);
	const pulse = 0.5 + 0.5 * Math.sin(frame / 5);
	const on = (at: number) => interpolate(frame, [at - 6, at + 6], [0, 1], clamp);
	const [wx, wy] = stopPx('Willy-Brandt-Platz');
	const [bx, by] = stopPx('Börneplatz');
	const [kx, ky] = stopPx('Konstablerwache');
	const [rx, ry] = llpx(PLACES.roemer);
	const [hx, hy] = stopPx('Hauptbahnhof');
	const [ksx, ksy] = llpx(MAP_VIEW.kss);
	const [kax, kay] = llpx(MAP_VIEW.kas);
	const [sx, sy] = llpx(MAP_VIEW.sachsenhausen);
	const markers: PlaneBillboard[] = [
		{key: 'hbf', x: hx, y: hy, node: <Marker title="HAUPTBAHNHOF" color={RED} on={on(Math.max(4, atHbf - 4)) * (1 - phaseB)} small />},
		{key: 'sachs', x: sx, y: sy, node: <Marker title="SACHSENHAUSEN" sub="UMLEITUNG" color={ORANGE} on={on(atSachs + 6) * (1 - phaseB)} small />},
		{key: 'wbp', x: wx, y: wy, node: <Marker title="WILLY-BRANDT-PLATZ" color={TRAM_COLOR} on={on(6) * (1 - phaseB)} small />},
		{key: 'roemer', x: rx, y: ry, z: 4, node: <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: on(8) * (1 - phaseB * 0.6)}}><RoemerFacade width={130} lit={0.9} /><span style={{marginTop: 2, padding: '2px 10px', borderRadius: 8, background: 'rgba(8,10,28,0.88)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 21, color: '#FFC66B'}}>RÖMER</span></div>},
		{key: 'boerne', x: bx, y: by, node: <Marker title="BÖRNEPLATZ" color={TRAM_COLOR} on={on(10) * (1 - phaseB * 0.85)} small />},
		{key: 'konsti', x: kx, y: ky, node: <Marker title="KONSTABLERWACHE" color="#9AA6CC" on={on(12)} small />},
		{key: 'kss', x: ksx, y: ksy, node: <Marker title="KURT-SCHUMACHER-STR." color={MAYBE_COLOR} on={on(atKss - 2) * maybe} small />},
		{key: 'kas', x: kax, y: kay, node: <Marker title="KONRAD-ADENAUER-STR." color={MAYBE_COLOR} on={on(atKas - 2) * maybe} small />},
	];
	return (
		<AbsoluteFill style={{backgroundColor: '#070B22', overflow: 'hidden'}}>
			<AbsoluteFill style={{background: 'linear-gradient(#0A0E2C 0%, #231B4C 22%, #3B2251 30%, #0A0F2A 40%)'}} />
			<div style={{position: 'absolute', left: 120 - frame * 0.15, top: 344, opacity: 0.45}}>
				<FrankfurtSkyline width={860} litRatio={0.4} showRiver={false} showBridge={false} />
			</div>
			<CityPlane
				map={OEPNV_MAP}
				k={MAP_K}
				camera={cam as PlaneCamera}
				anchor={[540, 880]}
				perspective={1250}
				floors={4}
				tint="#3A4894"
				ground={{base: '#0E1538', parks: '#1A4638', water: '#1D57A8', pedestrian: '#4E5C9E'}}
				highlightStreets={MAPTXT.maybeStreets.map((name) => ({name, color: MAYBE_COLOR, on: maybe * (0.55 + 0.45 * pulse)}))}
				groundExtras={<TransitGround alt={alt} detour={detour} maybe={maybe} />}
				markers={markers}
			/>
			<Shade top={0.96} bottom={0.9} mid={[30, 64]} />
			<SceneTag text="ALTSTADT · AB 8:30 UHR" color={RED} icon="route" />
			{/* Titel A: Altstadtstrecke */}
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 372, opacity: 1 - phaseB}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
					<Chip kind="LAUT VGF" size={17} />
					<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 25, color: COLORS.textMuted, whiteSpace: 'nowrap'}}>Straßenbahn 11 · 12 · 14 ab 8:30 Uhr</span>
				</div>
				<div style={{marginTop: 4, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 70, lineHeight: 1, letterSpacing: -1, color: RED, whiteSpace: 'nowrap', textShadow: `0 0 40px ${withAlpha(RED, 0.5)}, 0 8px 28px rgba(0,0,0,0.9)`}}>{MAPTXT.altstadt}</div>
				<div style={{marginTop: 6, fontFamily: FONTS.body, fontWeight: 700, fontSize: 25, color: COLORS.text, opacity: alt}}>{MAPTXT.altstadtSub}</div>
			</div>
			{/* Titel B + Karte: mögliche weitere Auswirkungen (oben, Karte bleibt frei) */}
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 372, opacity: phaseB}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
					<Chip kind="MÖGLICH" size={17} />
					<Chip kind="LAUT VGF" size={17} />
				</div>
				<div style={{marginTop: 6, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 50, lineHeight: 1.04, color: MAYBE_COLOR, textShadow: '0 8px 28px rgba(0,0,0,0.9)'}}>MÖGLICHE WEITERE AUSWIRKUNGEN</div>
			</div>
			{frame >= atMaybe - 6 ? (
				<div style={{position: 'absolute', left: LAYOUT.left, top: 528, width: LAYOUT.width, opacity: phaseB}}>
					<Card color={MAYBE_COLOR} style={{padding: '12px 20px 14px', display: 'flex', alignItems: 'center', gap: 18}} glow={0.3}>
						<div style={{display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0}}>
							<PopIn at={at18 - 3}>
								<LineBadge line="18" kind="tram" size={84} maybe glow={0.3} />
							</PopIn>
							<PopIn at={at30 - 3}>
								<LineBadge line="30" kind="bus" size={84} maybe glow={0.3} />
							</PopIn>
							<PopIn at={atM36 - 3}>
								<LineBadge line="M36" kind="bus" size={84} maybe glow={0.3} />
							</PopIn>
						</div>
						<div>
							<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 25, lineHeight: 1.1, color: COLORS.text, opacity: frame >= atKss - 6 ? 1 : 0.3}}>
								Kurt-Schumacher- /
								<br />
								Konrad-Adenauer-Straße
							</div>
							<div style={{marginTop: 4, fontFamily: FONTS.body, fontWeight: 700, fontSize: 21, lineHeight: 1.15, color: COLORS.textMuted}}>{MAPTXT.maybeNote}</div>
						</div>
					</Card>
				</div>
			) : null}
			{/* Karte A: Umleitung über Sachsenhausen (unten) */}
			<In at={atSachs - 4} dy={40} out={1 - phaseB} style={{left: LAYOUT.left, top: 1010, width: LAYOUT.width}}>
				<Card color={ORANGE} style={{padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 14}} glow={0.35}>
					<div style={{width: 54, height: 54, borderRadius: 27, background: withAlpha(ORANGE, 0.18), border: `3px solid ${ORANGE}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
						<P2Icon name="route" size={30} color={ORANGE} stroke={2.6} />
					</div>
					<div>
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 32, lineHeight: 1.05, color: COLORS.text}}>{MAPTXT.detour}</div>
						<div style={{marginTop: 4, fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, color: COLORS.textMuted}}>{MAPTXT.detourSub}</div>
					</div>
				</Card>
			</In>
			<Hint text={phaseB > 0.5 || frame < atSachs - 4 ? 'Linien laut OSM · Karte schematisch' : 'Umleitungsweg nicht veröffentlicht – Bogen schematisch'} top={1150} kind="SCHEMATISCH" />
			<SourceBar text={MAPTXT.source} at={8} />
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="blip" at={6} volume={0.45} />
			<Sfx name="softImpact" at={atBoerne - 4} volume={0.45} />
			<Sfx name="blip" at={atHbf - 3} volume={0.4} />
			<Sfx name="whoosh" at={atSachs - 6} volume={0.4} />
			<Sfx name="whoosh" at={atMaybe - 2} volume={0.4} />
			<Sfx name="pop" at={at18 - 3} volume={0.5} />
			<Sfx name="pop" at={at30 - 3} volume={0.5} />
			<Sfx name="pop" at={atM36 - 3} volume={0.5} />
			<Sfx name="blip" at={atKss - 2} volume={0.4} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 4: U-Bahn als Alternative (schematisch) */

const STATION_X = [118, 344, 570, 796];

const Underground: React.FC<{trainX: number; trainOn: number; open: number; altOn: number; dim: number}> = ({trainX, trainOn, open, altOn, dim}) => {
	const frame = useCurrentFrame();
	const W = LAYOUT.width + 40;
	return (
		<div style={{position: 'relative', width: W, height: 470, borderRadius: 28, overflow: 'hidden', border: '2px solid rgba(255,255,255,0.12)', boxShadow: '0 30px 70px rgba(0,0,0,0.55)', filter: dim > 0 ? `saturate(${1 - dim * 0.7}) brightness(${1 - dim * 0.35})` : undefined}}>
			{/* Oberfläche: Himmel, Skyline, Römer */}
			<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(#15193F 0%, #2A2052 24%, #1B2148 30%, #3B2A1F 31%, #24180F 100%)'}} />
			<div style={{position: 'absolute', left: -40 - frame * 0.2, top: 8, opacity: 0.75}}>
				<FrankfurtSkyline width={760} litRatio={0.4} showRiver={false} showBridge={false} />
			</div>
			<div style={{position: 'absolute', left: STATION_X[2] - 60, top: 46}}>
				<RoemerFacade width={120} lit={0.9} />
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 140, height: 6, background: '#5B4A3A'}} />
			{/* Erdreich-Textur */}
			{new Array(26).fill(0).map((_, i) => (
				<div key={i} style={{position: 'absolute', left: (i * 97) % W, top: 170 + ((i * 53) % 260), width: 6 + (i % 4) * 3, height: 6 + (i % 3) * 2, borderRadius: 6, background: 'rgba(255,220,180,0.06)'}} />
			))}
			{/* Tunnel */}
			<div style={{position: 'absolute', left: 0, right: 0, top: 214, height: 150, background: 'linear-gradient(#0B0F24, #141A3A 50%, #0B0F24)', borderTop: '4px solid #39304A', borderBottom: '4px solid #39304A'}} />
			{new Array(12).fill(0).map((_, i) => (
				<div key={i} style={{position: 'absolute', left: ((i * 90 - frame * 3) % (W + 90)) + (i * 90 - frame * 3 < 0 ? W + 90 : 0) - 45, top: 222, width: 26, height: 6, borderRadius: 3, background: '#FFE7A6', opacity: 0.5, boxShadow: '0 0 14px rgba(255,231,166,0.7)'}} />
			))}
			<div style={{position: 'absolute', left: 0, right: 0, top: 350, height: 5, background: '#5A6488'}} />
			{/* Bahnsteige */}
			{UBAHN.stations.map((s, i) => (
				<div key={s.name} style={{position: 'absolute', left: STATION_X[i] - 70, top: 344, width: 140, height: 14, borderRadius: 4, background: '#8B95B8'}} />
			))}
			{/* Zug */}
			<div style={{position: 'absolute', left: trainX, top: 262, opacity: trainOn}}>
				<UBahnTrain width={480} line="U4" />
			</div>
			{/* Stationsnamen */}
			{UBAHN.stations.map((s, i) => {
				const isOpen = s.open && open > 0;
				return (
					<div key={s.name} style={{position: 'absolute', left: STATION_X[i] - 100, top: 372, width: 200, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
						<div style={{width: 14, height: 14, borderRadius: 7, background: '#FFFFFF', border: `4px solid ${withAlpha(isOpen ? GREEN : '#9AA6CC', 1)}`}} />
						<div style={{marginTop: 4, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 21, lineHeight: 1.05, textAlign: 'center', color: COLORS.text, whiteSpace: 'pre-line'}}>{s.name.replace('WILLY-BRANDT-PLATZ', 'WILLY-BRANDT-\nPLATZ').replace('KONSTABLERWACHE', 'KONSTABLER-\nWACHE').replace('HAUPTBAHNHOF', 'HAUPT-\nBAHNHOF')}</div>
						{s.open ? (
							<div style={{position: 'absolute', top: -186, display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 10, background: withAlpha(GREEN, 0.2), border: `2.5px solid ${GREEN}`, opacity: open, scale: String(0.6 + 0.4 * open)}}>
								<P2Icon name="check" size={22} color={GREEN} stroke={3} />
								<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 18, color: GREEN, whiteSpace: 'nowrap'}}>{UBAHN.openLabel}</span>
							</div>
						) : null}
					</div>
				);
			})}
			{/* U4/U5 Linienband */}
			<div style={{position: 'absolute', left: 14, top: 160, display: 'flex', alignItems: 'center', gap: 8, opacity: altOn}}>
				<LineBadge line="U4" kind="ubahn" size={40} />
				<LineBadge line="U5" kind="ubahn" size={40} />
				<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 18, color: COLORS.text, padding: '3px 8px', borderRadius: 8, background: 'rgba(8,10,28,0.8)'}}>beide Linien: alle vier Stationen</span>
			</div>
		</div>
	);
};

export const UBahnScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const u1 = cue(cues, 'u1', 0);
	const u2 = cue(cues, 'u2', 120);
	const u3 = cue(cues, 'u3', 240);
	const atGood = wordFrame(cues, 'gute', u1.from + 2);
	const atU1 = wordFrame(cues, 'U1', u1.from + 20);
	const atU5 = wordFrame(cues, 'U5', atU1 + 16);
	const atU8 = wordFrame(cues, 'U8', atU5 + 10);
	const atPlan = wordFrame(cues, 'Fahrplan', atU8 + 20);
	const atOffen = wordFrame(cues, 'offen', u2.from + 40);
	const atU4 = wordFrame(cues, 'U4', atOffen + 6);
	const atAlt = wordFrame(cues, 'Alternative', atU4 + 30);
	const atHbf = wordFrame(cues, 'Hauptbahnhof', atAlt + 10);
	const atKonsti = wordFrame(cues, 'Konstablerwache', atHbf + 16);
	const atAchtung = wordFrame(cues, 'Achtung', u3.from);
	const badgeTimes: Record<string, number> = {
		U1: atU1,
		U2: atU1 + Math.round((atU5 - atU1) / 4),
		U3: atU1 + Math.round((atU5 - atU1) / 2),
		U4: atU1 + Math.round(((atU5 - atU1) * 3) / 4),
		U5: atU5,
		U8: atU8,
	};
	const altGlow = interpolate(frame, [atU4 - 4, atU4 + 8], [0, 1], clamp);
	const open = interpolate(frame, [atOffen - 6, atOffen + 6], [0, 1], clamp);
	const trainX = interpolate(frame, [Math.max(0, atHbf - 24), atKonsti + 30], [-200, 610], {...clamp, easing: EASE_IN_OUT});
	const trainOn = interpolate(frame, [atU4 - 10, atU4 + 4], [0, 1], clamp);
	const weekend = useSpring(atAchtung - 4, 12, 170);
	const wkOn = frame >= atAchtung - 5 ? weekend : 0;
	return (
		<AbsoluteFill style={{backgroundColor: '#070B22', overflow: 'hidden'}}>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 60%, #1A2150 0%, #0A0E26 60%, #05071A 100%)'}} />
			<Shade top={0.9} bottom={0.85} mid={[30, 70]} />
			<SceneTag text="U-BAHN · ALTERNATIVE" color={GREEN} icon="line" />
			<div style={{position: 'absolute', left: LAYOUT.left, top: 370, display: 'flex', alignItems: 'center', gap: 12, opacity: interpolate(frame, [atGood - 6, atGood + 4], [0.3, 1], clamp)}}>
				<Chip kind="LAUT VGF" size={17} />
				<Chip kind="NACH BISHERIGEM STAND" size={17} />
			</div>
			<div style={{position: 'absolute', left: LAYOUT.left, top: 412, width: LAYOUT.width, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 56, lineHeight: 1.02, color: COLORS.text, textShadow: '0 8px 28px rgba(0,0,0,0.9)'}}>
				U-BAHNEN <span style={{color: GREEN}}>PLANMÄSSIG</span>
				<div style={{fontSize: 26, fontFamily: FONTS.body, fontWeight: 700, color: COLORS.textMuted, marginTop: 6, opacity: frame >= atPlan - 6 ? 1 : 0.25}}>„nach heutigem Kenntnisstand nach Fahrplan“ (VGF, 18.11.)</div>
			</div>
			{/* Linienschilder U1 … U8 */}
			<div style={{position: 'absolute', left: LAYOUT.left, top: 528, display: 'flex', gap: 14}}>
				{UBAHN.planned.map((l) => {
					const isAlt = l === 'U4' || l === 'U5';
					return (
						<PopIn key={l} at={badgeTimes[l] - 3}>
							<div style={{scale: String(isAlt ? 1 + 0.12 * altGlow : 1 - 0.1 * altGlow), opacity: isAlt ? 1 : 1 - 0.45 * altGlow}}>
								<LineBadge line={l} kind="ubahn" size={84} color={isAlt && altGlow > 0.05 ? U_COLORS[l] : '#5B6BB0'} glow={isAlt ? altGlow : 0} />
							</div>
						</PopIn>
					);
				})}
			</div>
			{/* „laut VGF als Alternative“ */}
			<In at={atAlt - 4} dx={30} dy={0} style={{left: LAYOUT.left + 120, top: 636}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', borderRadius: 14, background: 'rgba(8,10,28,0.92)', border: `2.5px solid ${U_COLORS.U4}`}}>
					<P2Icon name="route" size={30} color={U_COLORS.U4} />
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, color: COLORS.text, whiteSpace: 'nowrap'}}>{UBAHN.altLabel}</span>
				</div>
			</In>
			{/* Querschnitt */}
			<div style={{position: 'absolute', left: LAYOUT.left - 20, top: 700}}>
				<Underground trainX={trainX} trainOn={trainOn} open={open} altOn={altGlow} dim={wkOn * 0.9} />
			</div>
			<div style={{position: 'absolute', left: LAYOUT.left + LAYOUT.width - 150, top: 712}}>
				<Chip kind="SCHEMATISCH" size={15} />
			</div>
			<div style={{opacity: interpolate(frame, [atOffen - 4, atOffen + 8], [0, 1], clamp) * (1 - wkOn)}}>
				<Hint text={UBAHN.alsoOpen} top={1150} kind="LAUT VGF" />
			</div>
			{/* Hinweis Wochenende */}
			{wkOn > 0 ? (
				<div style={{position: 'absolute', left: LAYOUT.left, top: 790, width: LAYOUT.width, opacity: Math.min(1, wkOn * 1.6), translate: `0 ${(1 - wkOn) * 60}px`}}>
					<Card color={ORANGE} style={{padding: '18px 24px 20px'}} glow={0.45}>
						<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
							<Chip kind="WOCHENENDE" size={18} />
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 24, color: ORANGE}}>gilt NICHT für Freitag</span>
						</div>
						<div style={{marginTop: 10, display: 'flex', alignItems: 'center', gap: 14}}>
							<LineBadge line="U4" kind="ubahn" size={70} />
							<LineBadge line="U5" kind="ubahn" size={70} />
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 46, lineHeight: 1, color: COLORS.text}}>FALLEN AUS</span>
						</div>
						<div style={{marginTop: 12, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, color: COLORS.signal, fontVariantNumeric: 'tabular-nums'}}>{WEEKEND.when}</div>
						<div style={{marginTop: 6, fontFamily: FONTS.body, fontWeight: 700, fontSize: 25, lineHeight: 1.2, color: COLORS.textMuted}}>{WEEKEND.why}</div>
					</Card>
				</div>
			) : null}
			<SourceBar text={wkOn > 0.5 ? WEEKEND.source : UBAHN.source} at={8} />
			<Sfx name="whoosh" at={0} volume={0.4} />
			{UBAHN.planned.map((l) => (
				<Sfx key={l} name="click" at={badgeTimes[l] - 3} volume={0.4} />
			))}
			<Sfx name="pop" at={atOffen - 4} volume={0.5} />
			<Sfx name="softImpact" at={atU4 - 3} volume={0.5} />
			<Sfx name="whoosh" at={Math.max(0, atHbf - 22)} volume={0.35} />
			<Sfx name="notify" at={atAchtung - 4} volume={0.45} />
			<Sfx name="whoosh" at={durationInFrames - 12} volume={0.3} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 5: Hintergrund – fünf Versammlungen */

export const WhyScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const w1 = cue(cues, 'w1', 0);
	const atAmt = wordFrame(cues, 'Innenministerium', w1.from + 10);
	const atFuenf = wordFrame(cues, 'fünf', atAmt + 16);
	const atVier = atFuenf + 4;
	const big = useSpring(atFuenf - 4, 10, 200);
	const reveal = ASSEMBLIES.map((_, i) => interpolate(frame, [4 + i * 4, 14 + i * 4], [0, 1], clamp));
	const pulse = ASSEMBLIES.map((_, i) => interpolate(frame, [atFuenf + i * 2, atFuenf + 8 + i * 2, atFuenf + 16 + i * 2], [0, 1, 0], clamp));
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{scale: '1.08'}}>
				<NightCity mood={MOODS.calm} progress={0.6 + frame / 3000} litRatio={0.35} bokeh={10} showPromenade={false} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.95) 0%, rgba(4,6,20,0.85) 50%, rgba(4,6,20,0.92) 100%)'}} />
			<SceneTag text="HINTERGRUND · FR 20.11." color={BLUE} icon="users" />
			<div style={{position: 'absolute', left: LAYOUT.left, top: 372, display: 'flex', alignItems: 'center', gap: 12, opacity: interpolate(frame, [atAmt - 6, atAmt + 4], [0.3, 1], clamp)}}>
				<Chip kind="LAUT INNENMINISTERIUM" size={17} />
				<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, color: COLORS.textMuted}}>{WHY.who}</span>
			</div>
			<div style={{position: 'absolute', left: LAYOUT.left, top: 412, display: 'flex', alignItems: 'center', gap: 22}}>
				<div style={{width: 150, height: 200, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 210, lineHeight: 0.95, color: COLORS.signal, opacity: frame >= atFuenf - 5 ? Math.min(1, big * 1.5) : 0.25, scale: String(0.7 + 0.3 * big), textShadow: `0 0 60px ${withAlpha(COLORS.signal, 0.45)}`}}>{WHY.count}</div>
				<div>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 52, lineHeight: 1.02, color: COLORS.text}}>
						VERSAMMLUNGEN
						<br />
						AM FREITAG
					</div>
					<div style={{marginTop: 8, fontFamily: FONTS.body, fontWeight: 700, fontSize: 26, color: COLORS.textMuted}}>{WHY.when}</div>
				</div>
			</div>
			<div style={{position: 'absolute', left: LAYOUT.left, top: 650}}>
				<DayTimeline events={ASSEMBLIES} width={LAYOUT.width} size={72} reveal={reveal} pulse={pulse} />
			</div>
			<In at={atVier - 4} dy={30} style={{left: LAYOUT.left, top: 880, width: LAYOUT.width}}>
				<Card color={BLUE} style={{padding: '14px 22px'}} glow={0.25}>
					<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
						<Chip kind="LAUT VGF" size={16} />
						<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 23, color: COLORS.textMuted}}>{WHY.vgf}</span>
					</div>
					<div style={{marginTop: 8, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 32, lineHeight: 1.1, color: COLORS.text}}>
						5 Veranstaltungen, darunter <span style={{color: COLORS.signal}}>4 Demozüge</span>
					</div>
					<div style={{marginTop: 4, fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, color: COLORS.textMuted}}>auf unterschiedlichen Routen</div>
					<div style={{marginTop: 8, fontFamily: FONTS.body, fontWeight: 700, fontSize: 23, lineHeight: 1.2, color: COLORS.textMuted}}>{WHY.note}</div>
				</Card>
			</In>
			<SourceBar text={WHY.source} at={8} />
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="tick" at={6} volume={0.35} />
			<Sfx name="softImpact" at={atFuenf - 3} volume={0.55} />
			<Sfx name="paper" at={atVier - 4} volume={0.4} />
			<Sfx name="whoosh" at={durationInFrames - 12} volume={0.3} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 6: Vor der Fahrt checken + Frage */

export const CheckScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const c1 = cue(cues, 'c1', 0);
	const q1 = cue(cues, 'q1', 120);
	const atMoeglich = wordFrame(cues, 'möglich', c1.from + 10);
	const atCheckt = wordFrame(cues, 'Checkt', atMoeglich + 10);
	const atWeb = wordFrame(cues, 'VGF-Website', atCheckt + 16);
	const atAnz = wordFrame(cues, 'Anzeigen', atWeb + 16);
	const atLinie = wordFrame(cues, 'Linie', q1.from + 6);
	const phone = useSpring(2, 14, 160);
	const reveal = interpolate(frame, [8, Math.max(30, atWeb + 10)], [0, 1], clamp);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{scale: '1.06'}}>
				<NightCity mood={MOODS.calm} progress={0.7 + frame / 3000} litRatio={0.4} bokeh={14} showPromenade={false} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.95) 0%, rgba(4,6,20,0.82) 45%, rgba(4,6,20,0.9) 100%)'}} />
			<SceneTag text="FREITAG · VOR DER FAHRT" color={COLORS.signal} icon="info" />
			<div style={{position: 'absolute', left: LAYOUT.left, top: 372, display: 'flex', alignItems: 'center', gap: 10, opacity: interpolate(frame, [atMoeglich - 6, atMoeglich + 4], [0.3, 1], clamp)}}>
				<P2Icon name="alert" size={30} color={MAYBE_COLOR} />
				<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: MAYBE_COLOR}}>ÄNDERUNGEN MÖGLICH</span>
			</div>
			<div style={{position: 'absolute', left: LAYOUT.left, top: 414, width: LAYOUT.width, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 66, lineHeight: 1, color: COLORS.text, whiteSpace: 'nowrap', textShadow: '0 8px 28px rgba(0,0,0,0.9)', scale: String(frame >= atCheckt - 3 ? 1 + 0.04 * Math.sin(interpolate(frame, [atCheckt - 3, atCheckt + 9], [0, 1], clamp) * Math.PI) : 1), transformOrigin: '0 50%'}}>
				VOR DER FAHRT <span style={{color: COLORS.signal}}>CHECKEN!</span>
			</div>
			{/* Smartphone (Illustration, keine Live-Daten) */}
			<div style={{position: 'absolute', left: LAYOUT.left + 6, top: 520, opacity: Math.min(1, phone * 1.6), translate: `${(1 - phone) * -60}px 0`, rotate: `${-4 + Math.sin(frame / 40) * 0.8}deg`}}>
				<TransitPhone
					width={330}
					header={CHECK.phoneHeader}
					banner="Behinderungen des Straßenbahnbetriebs"
					rows={[
						{lines: [{line: '11', kind: 'tram'}, {line: '12', kind: 'tram'}, {line: '14', kind: 'tram'}], text: 'ab 8:30 Uhr Umleitung über Sachsenhausen', tone: 'alert'},
						{lines: [{line: '18', kind: 'tram'}, {line: '30', kind: 'bus'}, {line: 'M36', kind: 'bus'}], text: 'möglicherweise betroffen', tone: 'maybe'},
						{lines: [{line: 'U4', kind: 'ubahn'}, {line: 'U5', kind: 'ubahn'}], text: 'nach bisherigem Stand nach Fahrplan', tone: 'ok'},
					]}
					reveal={reveal}
					footer={`Aktuell: ${CHECK.web}`}
					note={CHECK.phoneNote.toUpperCase()}
				/>
			</div>
			{/* rechte Spalte */}
			<In at={atWeb - 4} dx={40} dy={0} style={{left: 430, top: 540, width: 586}}>
				<Card color={TRAM_COLOR} style={{padding: '14px 20px'}} glow={0.3}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 22, letterSpacing: 1.5, color: TRAM_COLOR}}>1 · {CHECK.webLabel}</div>
					<div style={{marginTop: 4, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 44, color: COLORS.text}}>{CHECK.web}</div>
					<div style={{marginTop: 2, fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted}}>VGF berichtet im Laufe des Freitags</div>
				</Card>
			</In>
			<In at={atAnz - 4} dx={40} dy={0} style={{left: 430, top: 760, width: 586}}>
				<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 22, letterSpacing: 1.5, color: '#FFB938', marginBottom: 8}}>2 · {CHECK.dfi}</div>
				<DfiBoard width={586} title="HINWEIS" ticker="Aktuelle Informationen zu Betriebsbehinderungen beachten  •  Aktuelle Informationen zu Betriebsbehinderungen beachten" />
			</In>
			{/* Frage */}
			<In at={atLinie - 6} dy={40} style={{left: 430, top: 952, width: 586}}>
				<div style={{position: 'relative', padding: '16px 22px', borderRadius: 24, background: '#FFFFFF', boxShadow: '0 24px 60px rgba(0,0,0,0.5)'}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
						<P2Icon name="chat" size={36} color={RED} stroke={2.6} />
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 32, lineHeight: 1.05, color: '#14182E'}}>{CHECK.question}</span>
					</div>
					<div style={{marginTop: 6, fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: '#5A6080'}}>{CHECK.questionSub}</div>
					<div style={{position: 'absolute', left: 40, bottom: -18, width: 0, height: 0, borderLeft: '18px solid transparent', borderRight: '18px solid transparent', borderTop: '20px solid #FFFFFF'}} />
				</div>
			</In>
			<SourceBar text={CHECK.source} at={8} />
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="notify" at={6} volume={0.4} />
			<Sfx name="stamp" at={atCheckt - 3} volume={0.35} />
			<Sfx name="click" at={atWeb - 4} volume={0.5} />
			<Sfx name="typewriter" at={atAnz - 4} volume={0.3} />
			<Sfx name="pop" at={atLinie - 6} volume={0.5} />
			<Sfx name="whoosh" at={durationInFrames - 10} volume={0.3} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 7: Abo-Aufruf mit echtem Logo */

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
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 1180, textAlign: 'center', fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, color: COLORS.textMuted}}>{STAND} · Angaben laut VGF und Hessischem Innenministerium</div>
			<Sfx name="pop" at={atCta} volume={0.6} />
			<Sfx name="click" at={atCta + 26} volume={0.6} />
		</AbsoluteFill>
	);
};

/** Für Tests/Doku: alle Quellen-IDs, die im Bild genannt werden. */
export const SCENE_SOURCE_IDS = SOURCES.map((s) => s.id);
