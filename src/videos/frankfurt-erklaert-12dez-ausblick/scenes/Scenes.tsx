import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {FrankfurtSkyline} from '../../../components/backgrounds/FrankfurtSkyline';
import {BrandLogo} from '../../../components/brand/BrandLogo';
import {Crowd} from '../../../components/characters/Crowd';
import {VectorPerson} from '../../../components/characters/VectorPerson';
import {CityPlane, cityPlaneXY} from '../../../components/map/CityPlane';
import type {CityMapData} from '../../../components/map/CityStreetMap';
import {interpolateCamera, type PlaneBillboard, type PlaneCamera} from '../../../components/map/TiltedPlane';
import oepnvMap from '../../../data/maps/frankfurt-altstadt-oepnv.json';
import {TopTag} from '../../../formats/frankfurt-erklaert/Branding';
import {ACCENT, FORMAT, LAYOUT} from '../../../formats/frankfurt-erklaert/theme';
import {CalendarSheet} from '../../../formats/frankfurt-erklaert/visuals/Politics';
import {clamp, EASE_IN_OUT, EASE_OUT, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {handleWithAt} from '../../../theme/brand';
import {COLORS, FONTS} from '../../../theme/tokens';
import {blendMood, MOODS, NightCity} from '../../frankfurt-2026-11-20-ausblick/premium/NightCity';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {ZeilStreet} from '../../frankfurt-2026-11-polizeikontrollen/visuals/ZeilStreet';
import {TicketPhone} from '../../frankfurt-erklaert-20nov-bundesweit/visuals/Illustrations';
import {Card, CountUp, P2Icon, type P2IconName, Stars, useSpring} from '../../frankfurt-erklaert-genz-phase2-2026-11-14/scenes/kit';
import {CityPin, germanyGeo, GermanyPlane} from '../../frankfurt-erklaert-genz-phase2-2026-11-14/visuals/GermanyPlane';
import {type City12, CITIES_12} from '../cities';
import {COVER, FRAGE, FRANKFURT, ORGA, PLANUNGEN, RUECKBLICK, STAND, TERMIN, ZUSAGEN} from '../content';
import {AUSBLICK_COVER_LAYOUT} from '../cover-layout';

const RED = ACCENT.brand;
const BLUE = ACCENT.info;
const GREEN = ACCENT.yes;
const YELLOW = COLORS.signal;
const ORANGE = '#FF9F43';
const CYAN = '#46C2FF';
const AMBER = '#FFB547';
const WHITE_DOT = '#E6EAF6';

/* ------------------------------------------------------------------ Bausteine (wie #14/#15) */

type Kind = 'ANGEKÜNDIGT' | 'LAUT POLIZEI' | 'OFFEN' | 'ILLUSTRATION' | 'SCHEMATISCH' | 'LAUT WEBSITE' | 'RÜCKBLICK';
const KIND_COLOR: Record<Kind, string> = {ANGEKÜNDIGT: YELLOW, 'LAUT POLIZEI': BLUE, OFFEN: ACCENT.no, ILLUSTRATION: '#9AA6CC', SCHEMATISCH: '#9AA6CC', 'LAUT WEBSITE': ORANGE, RÜCKBLICK: '#9AA6CC'};
const Chip: React.FC<{kind: Kind; size?: number; style?: React.CSSProperties}> = ({kind, size = 17, style}) => {
	const c = KIND_COLOR[kind];
	return <span style={{display: 'inline-block', padding: `${size * 0.2}px ${size * 0.5}px`, borderRadius: size * 0.4, background: withAlpha(c, 0.18), border: `2px solid ${c}`, fontFamily: FONTS.heading, fontWeight: 900, fontSize: size, letterSpacing: 1.2, color: c, whiteSpace: 'nowrap', ...style}}>{kind}</span>;
};

const In: React.FC<{at: number; children: React.ReactNode; dx?: number; dy?: number; style?: React.CSSProperties; out?: number}> = ({at, children, dx = 0, dy = 30, style, out = 1}) => {
	const s = useSpring(at, 13, 180);
	const frame = useCurrentFrame();
	if (frame < at - 1) return null;
	return <div style={{position: 'absolute', opacity: Math.min(1, s * 1.7) * out, translate: `${(1 - s) * dx}px ${(1 - s) * dy}px`, scale: String(0.92 + 0.08 * s), ...style}}>{children}</div>;
};

const SceneTag: React.FC<{text: string; color: string; icon: P2IconName}> = ({text, color, icon}) => <TopTag text={text} color={color} icon={<P2Icon name={icon} size={30} color={ACCENT.ink} stroke={2.6} />} />;

const Shade: React.FC<{top?: number; bottom?: number; mid?: [number, number]}> = ({top = 0.94, bottom = 0.9, mid = [34, 60]}) => (
	<AbsoluteFill style={{background: `linear-gradient(rgba(4,6,20,${top}) 0%, rgba(4,6,20,${top * 0.82}) 20%, rgba(4,6,20,0) ${mid[0]}%, rgba(4,6,20,0) ${mid[1]}%, rgba(4,6,20,${bottom * 0.85}) 78%, rgba(4,6,20,${bottom}) 100%)`, pointerEvents: 'none'}} />
);

const Note: React.FC<{text: string; top: number; icon?: P2IconName; opacity?: number}> = ({text, top, icon = 'info', opacity = 1}) => (
	<div style={{position: 'absolute', left: LAYOUT.left, top, maxWidth: LAYOUT.width, display: 'flex', alignItems: 'center', gap: 10, padding: '5px 14px', borderRadius: 12, background: 'rgba(8,10,28,0.88)', boxSizing: 'border-box', opacity}}>
		<P2Icon name={icon} size={24} color={COLORS.textMuted} />
		<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, lineHeight: 1.2, color: COLORS.textMuted}}>{text}</span>
	</div>
);

/** `Crowd` liefert eine SVG-Gruppe – hier im eigenen <svg> (Unterkante = `height`). */
const CrowdBand: React.FC<{top: number; height: number; opacity?: number; children: React.ReactNode}> = ({top, height, opacity = 1, children}) => (
	<svg width={1080} height={height} viewBox={`0 0 1080 ${height}`} style={{position: 'absolute', left: 0, top, opacity, overflow: 'hidden'}}>
		{children}
	</svg>
);

const IllustrationMark: React.FC<{top?: number}> = ({top = 1238}) => (
	<div style={{position: 'absolute', right: 160, top, fontFamily: FONTS.body, fontWeight: 700, fontSize: 18, letterSpacing: 1.5, color: withAlpha('#FFFFFF', 0.6)}}>ILLUSTRATION</div>
);

/** Zustand fest (✓) oder offen (?). */
const StateIcon: React.FC<{state: 'ok' | 'open'; size?: number}> = ({state, size = 40}) => (
	<div style={{width: size, height: size, borderRadius: size / 2, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: withAlpha(state === 'ok' ? GREEN : AMBER, 0.2), border: `3px solid ${state === 'ok' ? GREEN : AMBER}`}}>
		{state === 'ok' ? <P2Icon name="check" size={size * 0.62} color={GREEN} stroke={3.4} /> : <span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: size * 0.62, lineHeight: 1, color: AMBER}}>?</span>}
	</div>
);

/* ------------------------------------------------------------------ Deutschlandkarte mit den 73 Städten */

const deXY = (c: City12): [number, number] => germanyGeo().project([c.lon, c.lat]);
const RANK_NS = new Map([...CITIES_12].sort((a, b) => b.lat - a.lat).map((c, i) => [c.name, i / (CITIES_12.length - 1)]));
const DE_OVERVIEW: PlaneCamera = {x: 500, y: 680, zoom: 0.74, tilt: 40, rotate: -1};
const SHORT: Record<string, string> = {'Frankfurt am Main': 'FRANKFURT', Berlin: 'BERLIN', München: 'MÜNCHEN', Köln: 'KÖLN'};
const PIN_SHIFT: Record<string, number> = {'Frankfurt am Main': -40, Berlin: 30, München: 20, Köln: -50};

type DotState = {on: number; central: number; dim: number; flash: number};
const Dot: React.FC<{c: City12; s: DotState; size?: number}> = ({c, s, size = 13}) => {
	const isC = c.central && s.central > 0;
	const color = isC ? ORANGE : WHITE_DOT;
	const d = (isC ? size * 1.6 + 6 * s.central : size) * (1 + 0.7 * s.flash) * (0.4 + 0.6 * s.on);
	return <div style={{width: d, height: d, marginBottom: -d / 2, borderRadius: d, opacity: s.on * (1 - 0.55 * s.dim), background: color, border: `2px solid ${withAlpha('#FFFFFF', 0.9)}`, boxSizing: 'border-box', boxShadow: `0 0 ${10 + 12 * s.flash}px ${withAlpha(color, 0.75)}`}} />;
};
const dots = (state: (c: City12) => DotState, size?: number): PlaneBillboard[] =>
	CITIES_12.map((c) => {
		const [x, y] = deXY(c);
		return {key: `d-${c.name}`, x, y, z: c.central ? 4 : 1, node: <Dot c={c} s={state(c)} size={size} />};
	});

const MapBg: React.FC<{seed?: string}> = ({seed = 'au16'}) => (
	<>
		<AbsoluteFill style={{background: 'radial-gradient(ellipse 110% 60% at 50% 46%, #252A70 0%, #111444 52%, #060920 100%)'}} />
		<Stars seed={seed} n={40} height={480} />
	</>
);

/* ------------------------------------------------------------------ Szene 1: Titelbild */

/**
 * Titelbild (Video-Frame 0 und PNG, nach COVER_ZONE): Serientitel, „GEN Z REGELT · NACH DEM 20.11.“, Kalenderblatt + riesige „12.12.“, rote Karte
 * „SCHON DIE NÄCHSTE DEMO?“, Plakette „ANGEKÜNDIGT · 73 STÄDTE · STAND 22.11.“, flache 2,5D-Deutschlandkarte mit den 73 Städten (4 orange),
 * Logo + Account; im PNG zusätzlich „WIE GEHT ES IN FRANKFURT WEITER?“. `morph` blendet die Texte aus, `meta` die Logo-Zeile.
 */
export const AusblickCover: React.FC<{morph?: number; thumbnail?: boolean; meta?: number}> = ({morph = 0, thumbnail = false, meta = 1}) => {
	const frame = useCurrentFrame();
	const L = AUSBLICK_COVER_LAYOUT;
	const m = EASE_IN_OUT(Math.min(1, Math.max(0, morph)));
	const text = 1 - Math.min(1, m * 1.6);
	const bob = Math.sin(frame / 26) * 3;
	const cam: PlaneCamera = {x: 500, y: 650, zoom: 0.33, tilt: 58, rotate: -2 + Math.sin(frame / 40)};
	const markers = dots((c) => ({on: 1, central: 1, dim: 0, flash: c.central ? 0.25 + 0.25 * Math.sin(frame / 6) : 0}), 9);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{scale: String(1 + m * 0.12), transformOrigin: '50% 40%'}}>
				<NightCity mood={blendMood(MOODS.calm, MOODS.dusk, 0.35)} progress={0.35 + frame / 2400} litRatio={0.48} bokeh={12} showPromenade={false} showMoon />
			</AbsoluteFill>
			<Stars seed="au16c" n={30} height={360} />
			<AbsoluteFill style={{background: `linear-gradient(rgba(4,6,20,${0.5 * text + 0.1}) 0%, rgba(4,6,20,${0.12 * text}) 14%, rgba(4,6,20,${0.62 * text}) 25%, rgba(4,6,20,${0.88 * text}) 38%, rgba(4,6,20,${0.88 * text}) 52%, rgba(4,6,20,${0.55 * text}) 56%, rgba(4,6,20,${0.4 * text}) 64%, rgba(4,6,20,${0.75 * text}) 100%)`}} />
			<AbsoluteFill style={{opacity: text}}>
				<GermanyPlane camera={cam} anchor={[500, 1100]} markers={markers} glow={1} />
			</AbsoluteFill>
			<div style={{opacity: text, translate: `0 ${(1 - text) * -30}px`}}>
				<div style={{position: 'absolute', left: 0, right: 0, top: L.brandTop, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16}}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 50, lineHeight: 0.98, color: COLORS.text, textAlign: 'right', textShadow: '0 6px 24px rgba(0,0,0,0.8)'}}>
						FRANKFURT
						<br />
						ERKLÄRT
					</div>
					<div style={{padding: '9px 16px', borderRadius: 10, background: RED, boxShadow: '0 10px 26px rgba(255,59,78,0.4)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, letterSpacing: 3, color: '#FFFFFF'}}>{FORMAT.sub}</div>
				</div>
				<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.kickerTop, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: L.kickerSize, lineHeight: 1.15, letterSpacing: 1, color: COLORS.text, whiteSpace: 'nowrap', textShadow: '0 8px 26px rgba(0,0,0,0.9)'}}>{COVER.kicker}</div>
				<div style={{position: 'absolute', left: 0, right: 0, top: L.bigTop + bob, height: L.bigBottom - L.bigTop, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 26}}>
					<div style={{rotate: '-6deg'}}>
						<CalendarSheet to={{day: TERMIN.day, month: TERMIN.month}} at={0} width={176} accent={RED} />
					</div>
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: L.bigSize, lineHeight: 0.92, letterSpacing: -6, color: YELLOW, whiteSpace: 'nowrap', textShadow: `0 0 70px ${withAlpha(YELLOW, 0.45)}, 0 22px 55px rgba(0,0,0,0.85)`}}>{COVER.big}</span>
				</div>
				<div style={{position: 'absolute', left: L.sideMin - 20, right: L.sideMin - 20, top: L.cardTop, display: 'flex', justifyContent: 'center'}}>
					<div style={{padding: '8px 24px 10px', borderRadius: 18, background: 'linear-gradient(160deg, #FF6A78 0%, #FF4D5E 50%, #D93448 100%)', boxShadow: '0 5px 0 #B32A3C, 0 10px 0 #8E1F2E, 0 30px 60px rgba(0,0,0,0.6)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: L.cardFont, lineHeight: 1.1, color: '#FFFFFF', whiteSpace: 'nowrap'}}>{COVER.card}</div>
				</div>
				<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.tagTop, height: L.tagBottom - L.tagTop, display: 'flex', justifyContent: 'center'}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px', borderRadius: 23, background: 'rgba(8,10,28,0.94)', border: `2.5px solid ${YELLOW}`}}>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 24, letterSpacing: 2, color: YELLOW, whiteSpace: 'nowrap'}}>{COVER.tag}</span>
						<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 22, color: COLORS.text, whiteSpace: 'nowrap'}}>· STAND {STAND.date.slice(0, 6)}</span>
					</div>
				</div>
				<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.metaTop, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, opacity: meta}}>
					<BrandLogo size={52} />
					<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 30, color: COLORS.textMuted}}>{handleWithAt()}</span>
				</div>
				{thumbnail ? (
					<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.thumbTop, display: 'flex', justifyContent: 'center'}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 22px', borderRadius: 16, background: 'rgba(8,10,28,0.92)', border: `2.5px solid ${YELLOW}`}}>
							<P2Icon name="alert" size={30} color={YELLOW} />
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 32, color: COLORS.text, whiteSpace: 'nowrap'}}>{COVER.thumb}</span>
						</div>
					</div>
				) : null}
			</div>
		</AbsoluteFill>
	);
};

export const CoverScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const h2 = cue(cues, 'hook2', 30);
	const atNaechste = wordFrame(cues, 'nächste', h2.from + 30);
	const morph = interpolate(frame, [durationInFrames - 14, durationInFrames - 1], [0, 1], clamp);
	const meta = interpolate(frame, [h2.from - 8, h2.from], [1, 0], clamp);
	return (
		<AbsoluteFill>
			<AusblickCover morph={morph} meta={meta} />
			<Sfx name="softImpact" at={0} volume={0.5} />
			<Sfx name="pop" at={atNaechste} volume={0.45} />
			<Sfx name="whoosh" at={Math.max(0, durationInFrames - 14)} volume={0.45} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 2: Rückblick 20.11. */

export const RueckblickScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const r1 = cue(cues, 'r1', 0);
	const atFried = wordFrame(cues, 'friedlich', r1.from + 20) - 6;
	const atWeniger = wordFrame(cues, 'weniger', atFried + 20) - 6;
	const dolly = interpolate(frame, [0, durationInFrames], [0.2, 0.9], clamp);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<ZeilStreet dolly={dolly} people={16} officers={5} vans warm={0.5} blueLight={0.15} seed="z16" />
			<Shade top={0.95} bottom={0.88} mid={[38, 62]} />
			<SceneTag text="RÜCKBLICK · 20.11." color="#9AA6CC" icon="clock" />
			<In at={2} dy={30} style={{left: LAYOUT.left, top: 380, width: LAYOUT.width}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
					<div style={{padding: '6px 14px', borderRadius: 12, background: 'rgba(8,10,28,0.94)', border: '2px solid rgba(255,255,255,0.3)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: COLORS.text}}>FR {RUECKBLICK.date}</div>
					<Chip kind="RÜCKBLICK" size={16} />
				</div>
			</In>
			<In at={Math.max(4, atFried)} dx={-60} dy={0} style={{left: LAYOUT.left, top: 460, width: LAYOUT.width}}>
				<Card color={GREEN} style={{padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16}} glow={0.3}>
					<StateIcon state="ok" size={70} />
					<div>
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 46, lineHeight: 1, color: COLORS.text}}>{RUECKBLICK.calm}</div>
						<div style={{marginTop: 6, fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted}}>{RUECKBLICK.calmBy}</div>
					</div>
				</Card>
			</In>
			<In at={atWeniger} dx={60} dy={0} style={{left: LAYOUT.left, top: 640, width: LAYOUT.width}}>
				<Card color={AMBER} style={{padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16}} glow={0.3}>
					<div style={{width: 70, height: 70, borderRadius: 35, flexShrink: 0, background: withAlpha(AMBER, 0.2), border: `3px solid ${AMBER}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
						<P2Icon name="users" size={42} color={AMBER} />
					</div>
					<div>
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 36, lineHeight: 1.05, color: COLORS.text}}>{RUECKBLICK.fewer}</div>
						<div style={{marginTop: 6, fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted}}>{RUECKBLICK.fewerBy}</div>
					</div>
				</Card>
			</In>
			<In at={Math.max(atWeniger + 10, 20)} dy={20} style={{left: LAYOUT.left, top: 1150, width: LAYOUT.width}}>
				<div style={{display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center'}}>
					{RUECKBLICK.facts.map((f) => (
						<span key={f} style={{padding: '4px 12px', borderRadius: 10, background: 'rgba(8,10,28,0.9)', border: `2px solid ${withAlpha(BLUE, 0.6)}`, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 22, color: COLORS.text}}>{f}</span>
					))}
					<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 19, color: COLORS.textMuted}}>{RUECKBLICK.factsBy}</span>
				</div>
			</In>
			<IllustrationMark top={1110} />
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="pop" at={Math.max(4, atFried)} volume={0.45} />
			<Sfx name="pop" at={atWeniger} volume={0.45} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 3: Unterschiedliche Planungen (OSM) */

const OEPNV_MAP = oepnvMap as unknown as CityMapData;
const MAP_K = 0.62;

const PlanMarker: React.FC<{who: string; where: string; how: string; color: string; on: number; shift?: number}> = ({who, where, how, color, on, shift = 0}) => (
	<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: on, scale: String(0.7 + 0.3 * on), transformOrigin: '50% 100%'}}>
		<div style={{translate: `${shift}px 0`, padding: '6px 14px 8px', borderRadius: 14, background: 'rgba(8,10,28,0.95)', border: `3px solid ${color}`, textAlign: 'center', whiteSpace: 'nowrap', boxShadow: `0 12px 30px rgba(0,0,0,0.55), 0 0 24px ${withAlpha(color, 0.35)}`}}>
			<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 20, letterSpacing: 1.4, color}}>{who}</div>
			<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, color: COLORS.text}}>{where}</div>
			<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 18, color: COLORS.textMuted}}>{how}</div>
		</div>
		<div style={{width: 4, height: 34, background: `linear-gradient(${color}, ${withAlpha(color, 0.1)})`}} />
		<div style={{width: 20, height: 20, borderRadius: 10, marginTop: -5, background: color, border: '3px solid #FFFFFF', boxShadow: `0 0 20px ${withAlpha(color, 0.9)}`}} />
	</div>
);

export const PlanungenScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const r2 = cue(cues, 'r2', 0);
	const atOrts = wordFrame(cues, 'Ortsgruppe', r2.from + 20) - 6;
	const atBund = wordFrame(cues, 'Bundesinitiative', atOrts + 12) - 6;
	const [lx, ly] = cityPlaneXY(OEPNV_MAP, MAP_K, PLANUNGEN.left.at);
	const [rx, ry] = cityPlaneXY(OEPNV_MAP, MAP_K, PLANUNGEN.right.at);
	const cx = (lx + rx) / 2;
	const cy = (ly + ry) / 2;
	const cam = interpolateCamera(frame, [
		{frame: 0, cam: {x: cx, y: cy - 60, zoom: 0.42, tilt: 50, rotate: -3}},
		{frame: durationInFrames + 10, cam: {x: cx, y: cy - 40, zoom: 0.47, tilt: 52, rotate: 2}},
	], EASE_IN_OUT);
	const lOn = interpolate(frame, [Math.min(atOrts, 8), Math.min(atOrts, 8) + 10], [0, 1], clamp);
	const rOn = interpolate(frame, [atBund, atBund + 10], [0, 1], clamp);
	const pulse = (frame % 40) / 40;
	const markers: PlaneBillboard[] = [
		{key: 'l', x: lx, y: ly, z: 4, node: <PlanMarker who={PLANUNGEN.left.who} where={PLANUNGEN.left.where} how={PLANUNGEN.left.how} color={CYAN} on={lOn} shift={-70} />},
		{key: 'r', x: rx, y: ry, z: 4, node: <PlanMarker who={PLANUNGEN.right.who} where={PLANUNGEN.right.where} how={PLANUNGEN.right.how} color={ORANGE} on={rOn} shift={70} />},
	];
	return (
		<AbsoluteFill style={{backgroundColor: '#080C1F', overflow: 'hidden'}}>
			<CityPlane
				map={OEPNV_MAP}
				k={MAP_K}
				camera={cam as PlaneCamera}
				anchor={[540, 900]}
				floors={4}
				spots={[
					{at: PLANUNGEN.left.at, color: CYAN, radius: 70, on: lOn, pulse},
					{at: PLANUNGEN.right.at, color: ORANGE, radius: 70, on: rOn, pulse},
				]}
				markers={markers}
			/>
			<Shade top={0.95} bottom={0.9} mid={[30, 62]} />
			<SceneTag text="RÜCKBLICK · ZWEI PLANUNGEN" color={VIOLET_TAG} icon="pin" />
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 380, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18}}>
				<div style={{padding: '8px 16px', borderRadius: 14, background: 'rgba(8,10,28,0.94)', border: `3px solid ${CYAN}`, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: CYAN, opacity: lOn}}>ORTSGRUPPE</div>
				<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, color: YELLOW, opacity: rOn}}>≠</span>
				<div style={{padding: '8px 16px', borderRadius: 14, background: 'rgba(8,10,28,0.94)', border: `3px solid ${ORANGE}`, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: ORANGE, opacity: rOn}}>BUNDESINITIATIVE</div>
			</div>
			<Note text={PLANUNGEN.note} top={1150} />
			<div style={{position: 'absolute', left: LAYOUT.left, top: 1206, fontFamily: FONTS.body, fontWeight: 700, fontSize: 19, color: withAlpha(COLORS.text, 0.6)}}>Karte © OpenStreetMap-Mitwirkende · Orte laut hessenschau und t-online (20./21.11.)</div>
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="blip" at={Math.min(atOrts, 8)} volume={0.5} />
			<Sfx name="blip" at={atBund} volume={0.5} />
		</AbsoluteFill>
	);
};
const VIOLET_TAG = '#B794F6';

/* ------------------------------------------------------------------ Szene 4: Neuer Termin (Kalender) */

export const TerminScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const n1 = cue(cues, 'n1', 0);
	const atProt = wordFrame(cues, 'Protesttag', n1.from + 30) - 6;
	const atSamstag = wordFrame(cues, 'Samstag', atProt + 10) - 6;
	const date = useSpring(atSamstag + 10, 12, 170);
	const pull = interpolate(frame, [0, durationInFrames], [0, 1], clamp);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{scale: String(1.08 - pull * 0.06), transformOrigin: '50% 70%'}}>
				<NightCity mood={MOODS.dusk} progress={0.5 + pull * 0.2} litRatio={0.45} bokeh={14} showPromenade={false} showMoon />
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.92) 0%, rgba(4,6,20,0.7) 45%, rgba(4,6,20,0.45) 70%, rgba(4,6,20,0.85) 100%)'}} />
			<SceneTag text="DER NEUE TERMIN" color={YELLOW} icon="clock" />
			<div style={{position: 'absolute', left: 0, right: 150, top: 392, display: 'flex', justifyContent: 'center', paddingLeft: 75}}>
				<CalendarSheet from={{day: '20', month: 'NOV'}} to={{day: TERMIN.day, month: TERMIN.month}} at={atSamstag} width={300} accent={RED} />
			</div>
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 770, textAlign: 'center', opacity: Math.min(1, date * 1.6), translate: `0 ${(1 - date) * 20}px`}}>
				<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, letterSpacing: 4, color: COLORS.textMuted}}>{TERMIN.weekday}</div>
				<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 96, lineHeight: 1, letterSpacing: -2, color: YELLOW, textShadow: `0 0 50px ${withAlpha(YELLOW, 0.45)}`}}>{TERMIN.full}</div>
			</div>
			<In at={atProt} dy={30} style={{left: LAYOUT.left, top: 930, width: LAYOUT.width}}>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
					<div style={{padding: '8px 22px 10px', borderRadius: 16, background: RED, boxShadow: '0 16px 40px rgba(255,59,78,0.35)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, color: '#FFFFFF', whiteSpace: 'nowrap'}}>{TERMIN.label}</div>
					<div style={{display: 'flex', gap: 10, alignItems: 'center'}}>
						<Chip kind="ANGEKÜNDIGT" size={16} />
						<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 21, color: COLORS.textMuted}}>{TERMIN.by}</span>
					</div>
				</div>
			</In>
			<CrowdBand top={1040} height={250} opacity={0.95}>
				<Crowd width={1080} baseY={245} rows={3} perRow={11} seed="t16" personHeight={130} marchSpeed={0.6} signRatio={0.3} depthFade={0.55} />
			</CrowdBand>
			<IllustrationMark top={1050} />
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="paper" at={atSamstag} volume={0.5} />
			<Sfx name="softImpact" at={atSamstag + 12} volume={0.5} />
			<Sfx name="pop" at={atProt} volume={0.45} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 5: 73 Städte, 4 zentral, Frankfurt */

export const KarteScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const n2 = cue(cues, 'n2', 0);
	const f1 = cue(cues, 'f1', 100);
	const at73 = wordFrame(cues, '73', n2.from + 20);
	const atSame = wordFrame(cues, 'dieselbe', at73 + 20) - 6;
	const atFfm = Math.max(atSame + 10, f1.from - 2);
	const atVier = wordFrame(cues, 'vier', atFfm + 10) - 4;
	const atBerlin = wordFrame(cues, 'Berlin', atVier + 20) - 4;
	const atMuc = wordFrame(cues, 'München', atBerlin + 6) - 4;
	const atKoeln = wordFrame(cues, 'Köln', atMuc + 6) - 4;
	const [fx, fy] = deXY(CITIES_12.find((c) => c.name === 'Frankfurt am Main')!);
	const cam = interpolateCamera(frame, [
		{frame: 0, cam: DE_OVERVIEW},
		{frame: Math.max(10, atFfm - 4), cam: {...DE_OVERVIEW, zoom: 0.76, rotate: 1}},
		{frame: atFfm + 16, cam: {x: fx, y: fy - 40, zoom: 1.35, tilt: 46, rotate: -3}},
		{frame: Math.max(atFfm + 30, atBerlin - 6), cam: {x: fx, y: fy - 30, zoom: 1.45, tilt: 46, rotate: -5}},
		{frame: atBerlin + 14, cam: {...DE_OVERVIEW, zoom: 0.78}},
		{frame: durationInFrames + 10, cam: {...DE_OVERVIEW, zoom: 0.82, rotate: 2}},
	], EASE_IN_OUT);
	const centralOn = interpolate(frame, [atFfm, atFfm + 8], [0, 1], clamp);
	const dimOthers = interpolate(frame, [atVier, atVier + 10], [0, 1], clamp);
	const flashOf = (name: string) => {
		const at = name === 'Frankfurt am Main' ? atFfm : name === 'Berlin' ? atBerlin : name === 'München' ? atMuc : name === 'Köln' ? atKoeln : -999;
		return frame >= at && frame < at + 14 ? Math.sin(((frame - at) / 14) * Math.PI) : 0;
	};
	const markers: PlaneBillboard[] = [
		...dots((c) => {
			const appear = 2 + RANK_NS.get(c.name)! * Math.max(10, at73 - 4);
			return {on: interpolate(frame, [appear, appear + 6], [0, 1], clamp), central: c.central ? (c.name === 'Frankfurt am Main' ? centralOn : dimOthers) : 0, dim: c.central ? 0 : dimOthers, flash: flashOf(c.name) + (c.name === 'Frankfurt am Main' ? 0.3 * centralOn : 0)};
		}),
		...CITIES_12.filter((c) => c.central).map((c) => {
			const [x, y] = deXY(c);
			const on = c.name === 'Frankfurt am Main' ? centralOn : interpolate(frame, [c.name === 'Berlin' ? atBerlin : c.name === 'München' ? atMuc : atKoeln, (c.name === 'Berlin' ? atBerlin : c.name === 'München' ? atMuc : atKoeln) + 8], [0, 1], clamp);
			return {key: `p-${c.name}`, x, y, z: 8, node: <CityPin name={SHORT[c.name]} color={ORANGE} on={on} size={c.name === 'Frankfurt am Main' ? 0.95 : 0.78} shift={PIN_SHIFT[c.name]} stem={c.name === 'Frankfurt am Main' ? 80 : 60} sub={c.name === 'Frankfurt am Main' ? 'ORGANISIERT DIE INITIATIVE SELBST' : undefined} />};
		}),
	];
	const countOn = useSpring(4, 13, 180);
	return (
		<AbsoluteFill style={{backgroundColor: '#070B22', overflow: 'hidden'}}>
			<MapBg />
			<GermanyPlane camera={cam} anchor={[540, 940]} markers={markers} />
			<Shade top={0.95} bottom={0.9} mid={[28, 62]} />
			<SceneTag text="12.12. · BUNDESWEIT" color={ORANGE} icon="pin" />
			{/* 73 Städte */}
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 378, display: 'flex', alignItems: 'center', gap: 16, opacity: Math.min(1, countOn * 1.6) * interpolate(frame, [atFfm - 4, atFfm + 6], [1, 0], clamp)}}>
				<CountUp value={73} at={4} dur={Math.max(10, at73 + 2 - 4)} style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 130, lineHeight: 1, color: YELLOW, textShadow: `0 0 50px ${withAlpha(YELLOW, 0.5)}`}} />
				<div>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 44, lineHeight: 1, color: COLORS.text}}>STÄDTE</div>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: COLORS.text}}>ANGEKÜNDIGT</div>
					<div style={{marginTop: 6, display: 'flex', gap: 8, alignItems: 'center'}}>
						<Chip kind="LAUT WEBSITE" size={15} />
						<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 21, color: COLORS.textMuted, opacity: interpolate(frame, [atSame, atSame + 8], [0, 1], clamp)}}>{TERMIN.sameList}</span>
					</div>
				</div>
			</div>
			{/* 4 zentral */}
			<In at={atVier} dy={30} style={{left: LAYOUT.left, top: 378, width: LAYOUT.width}}>
				<Card color={ORANGE} style={{padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 16}} glow={0.3}>
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 96, lineHeight: 1, color: ORANGE}}>4</span>
					<div>
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, lineHeight: 1.05, color: COLORS.text}}>{TERMIN.centralLabel}</div>
						<div style={{marginTop: 4, fontFamily: FONTS.body, fontWeight: 700, fontSize: 21, color: COLORS.textMuted}}>{TERMIN.centralSub}</div>
						<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 21, color: COLORS.textMuted}}>{TERMIN.otherSub}</div>
					</div>
				</Card>
			</In>
			<Note text={TERMIN.mapNote} top={1200} icon="pin" />
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="softImpact" at={at73 + 2} volume={0.5} />
			<Sfx name="blip" at={atFfm} volume={0.55} />
			<Sfx name="pop" at={atVier} volume={0.45} />
			<Sfx name="blip" at={atBerlin} volume={0.4} />
			<Sfx name="blip" at={atMuc} volume={0.4} />
			<Sfx name="blip" at={atKoeln} volume={0.4} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 6: Frankfurt – fest und offen */

export const FrankfurtScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const f2 = cue(cues, 'f2', 0);
	const f3 = cue(cues, 'f3', 120);
	const f4 = cue(cues, 'f4', 200);
	const atTreff = wordFrame(cues, 'Treffpunkt', f2.from + 4) - 4;
	const atUhr = wordFrame(cues, 'Uhrzeit', atTreff + 10) - 4;
	const atFolgt = wordFrame(cues, 'folgt', atUhr + 20) - 4;
	const atAnk = Math.max(atFolgt + 10, f3.from - 2);
	const atStadt = wordFrame(cues, 'Stadt', atAnk + 20) - 6;
	const atAnm = Math.max(atStadt + 12, wordFrame(cues, 'angemeldet', f4.from + 6) - 6);
	const atBekannt = wordFrame(cues, 'bekannt', atAnm + 10);
	const rowAt = [2, 8, Math.max(12, atTreff), Math.max(16, atUhr), Math.max(20, atFolgt + 4)];
	// Reihenfolge im Ton: Ankündigung (f3) → Behörde („Stadt oder Polizei“) → Anmeldung (f4); im Bild stehen die Stufen in fester Reihenfolge.
	const stepAt = [atAnk, atAnm, atStadt];
	const pull = interpolate(frame, [0, durationInFrames], [0, 1], clamp);
	const pin = 0.5 + 0.5 * Math.sin(frame / 8);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{scale: String(1.1 - pull * 0.08), transformOrigin: '50% 80%'}}>
				<NightCity mood={blendMood(MOODS.calm, MOODS.dusk, 0.5)} progress={0.4 + pull * 0.3} litRatio={0.5} bokeh={14} showPromenade={false} />
			</AbsoluteFill>
			<div style={{position: 'absolute', left: 120 - pull * 30, top: 1010, opacity: 0.85}}>
				<FrankfurtSkyline width={840} litRatio={0.45} showRiver showBridge={false} />
			</div>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.94) 0%, rgba(4,6,20,0.82) 42%, rgba(4,6,20,0.35) 62%, rgba(4,6,20,0.25) 78%, rgba(4,6,20,0.85) 100%)'}} />
			<SceneTag text="FRANKFURT · 12.12." color={ORANGE} icon="pin" />
			{/* Infokarte */}
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 378}}>
				<Card color={ORANGE} style={{padding: '12px 18px 14px'}} glow={0.25}>
					<div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6}}>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 32, color: ORANGE}}>FRANKFURT AM MAIN</span>
						<Chip kind="LAUT WEBSITE" size={14} />
					</div>
					{FRANKFURT.rows.map((r, i) => {
						const o = interpolate(frame, [rowAt[i], rowAt[i] + 8], [0, 1], clamp);
						return (
							<div key={r.k} style={{display: 'flex', alignItems: 'center', gap: 12, padding: '5px 0', borderTop: i ? `1px solid ${withAlpha('#FFFFFF', 0.08)}` : 'none', opacity: o, translate: `${(1 - o) * -24}px 0`}}>
								<StateIcon state={r.state} size={36} />
								<span style={{width: 210, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 24, letterSpacing: 1, color: COLORS.textMuted}}>{r.k}</span>
								<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 27, color: r.state === 'ok' ? COLORS.text : AMBER}}>{r.v}</span>
							</div>
						);
					})}
				</Card>
			</div>
			{/* Stufen: Ankündigung ≠ Anmeldung ≠ Behörde */}
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 790, display: 'flex', alignItems: 'stretch', gap: 8}}>
				{FRANKFURT.steps.map((s, i) => {
					const o = interpolate(frame, [stepAt[i], stepAt[i] + 8], [0, 1], clamp);
					const c = s.state === 'ok' ? GREEN : AMBER;
					return (
						<React.Fragment key={s.k}>
							{i ? <div style={{alignSelf: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, color: withAlpha('#FFFFFF', 0.6 * o)}}>›</div> : null}
							<div style={{flex: 1, padding: '10px 10px 12px', borderRadius: 16, background: 'rgba(8,10,28,0.94)', border: `2.5px solid ${withAlpha(c, 0.9)}`, opacity: o, scale: String(0.9 + 0.1 * o), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, textAlign: 'center'}}>
								<StateIcon state={s.state} size={40} />
								<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 24, letterSpacing: 0.5, color: COLORS.text}}>{s.k}</span>
								<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 21, lineHeight: 1.2, color: COLORS.textMuted}}>{s.v}</span>
							</div>
						</React.Fragment>
					);
				})}
			</div>
			<Note text={FRANKFURT.stepsNote} top={1000} opacity={interpolate(frame, [atBekannt, atBekannt + 8], [0, 1], clamp)} />
			{/* Standort-Pin mit Fragezeichen über der Skyline */}
			<div style={{position: 'absolute', left: 470, top: 1080 - pin * 10, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: interpolate(frame, [atTreff, atTreff + 8], [0, 1], clamp)}}>
				<div style={{padding: '4px 12px', borderRadius: 10, background: 'rgba(8,10,28,0.92)', border: `2.5px solid ${AMBER}`, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 20, color: AMBER, whiteSpace: 'nowrap'}}>STANDORT FOLGT</div>
				<svg width={60} height={78} viewBox="0 0 26 34" style={{marginTop: 4}}>
					<path d="M13 33s-12-13-12-21a12 12 0 0 1 24 0c0 8-12 21-12 21z" fill={AMBER} stroke="#FFFFFF" strokeWidth={1.6} />
					<text x={13} y={17} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={900} fontSize={13} fill="#0B1029">?</text>
				</svg>
			</div>
			<IllustrationMark top={1240} />
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="click" at={rowAt[0]} volume={0.35} />
			<Sfx name="click" at={rowAt[2]} volume={0.4} />
			<Sfx name="click" at={rowAt[3]} volume={0.4} />
			<Sfx name="pop" at={atAnk} volume={0.45} />
			<Sfx name="stamp" at={atStadt} volume={0.4} />
			<Sfx name="pop" at={atAnm} volume={0.4} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 7: Helfer, Ordner, Förderpool */

const Coin: React.FC<{x: number; y: number; r: number}> = ({x, y, r}) => (
	<g>
		<circle cx={x} cy={y} r={r} fill="#FFD23F" stroke="#B8860B" strokeWidth={2} />
		<text x={x} y={y + r * 0.35} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={900} fontSize={r} fill="#8A6500">€</text>
	</g>
);

export const OrgaScene: React.FC<SceneProps> = ({cues}) => {
	const frame = useCurrentFrame();
	const m1 = cue(cues, 'm1', 0);
	const m2 = cue(cues, 'm2', 120);
	const atHelfer = wordFrame(cues, 'Helfer', m1.from + 10) - 6;
	const atOrdner = wordFrame(cues, 'Ordner', atHelfer + 10) - 6;
	const atFried = wordFrame(cues, 'friedlich', atOrdner + 20) - 6;
	const atPool = Math.max(atFried + 10, m2.from - 2);
	const atFoerder = wordFrame(cues, 'Förderpool', atPool + 10) - 6;
	const roleAt = [Math.max(4, atHelfer), atOrdner, atFried];
	const people = [
		{x: 250, at: Math.max(4, atHelfer), hair: 'short' as const, palette: {skin: '#E8B48A', shirt: '#46C2FF', pants: '#2A3150', hair: '#3A2A1E'}, sign: {icon: 'book' as const}},
		{x: 470, at: atOrdner, hair: 'cap' as const, palette: {skin: '#C68A5E', shirt: '#F3F4F8', pants: '#232A44', hair: '#1E1A16'}, sign: null},
		{x: 690, at: atFried, hair: 'long' as const, palette: {skin: '#F1C9A5', shirt: '#B794F6', pants: '#2A3150', hair: '#6B3E26'}, sign: {icon: 'heart' as const, color: '#FF4D5E'}},
	];
	const pool = interpolate(frame, [atFoerder, atFoerder + 30], [0, 1], clamp);
	return (
		<AbsoluteFill style={{backgroundColor: '#090C24', overflow: 'hidden'}}>
			<AbsoluteFill style={{background: `radial-gradient(ellipse 80% 50% at 50% 70%, ${withAlpha(CYAN, 0.12)} 0%, rgba(0,0,0,0) 70%)`}} />
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: 0.12}}>
				{new Array(24).fill(0).map((_, i) => (
					<line key={i} x1={0} x2={1080} y1={i * 80 + ((frame * 0.4) % 80)} y2={i * 80 + ((frame * 0.4) % 80)} stroke="#5A6AA8" strokeWidth={1} />
				))}
			</svg>
			<SceneTag text="ORGANISATION" color={CYAN} icon="users" />
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 378, display: 'flex', alignItems: 'center', gap: 12}}>
				<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 58, lineHeight: 1, color: COLORS.text, whiteSpace: 'nowrap'}}>{ORGA.title}</span>
			</div>
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 456, display: 'flex', flexDirection: 'column', gap: 8}}>
				{ORGA.roles.map((r, i) => {
					const o = interpolate(frame, [roleAt[i], roleAt[i] + 8], [0, 1], clamp);
					return (
						<div key={r.k} style={{display: 'flex', alignItems: 'center', gap: 12, padding: '8px 14px', borderRadius: 14, background: 'rgba(12,15,38,0.94)', border: `2px solid ${withAlpha(CYAN, 0.6)}`, opacity: o, translate: `${(1 - o) * -40}px 0`}}>
							<span style={{width: 250, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, color: CYAN}}>{r.k}</span>
							<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, lineHeight: 1.2, color: COLORS.text}}>{r.v}</span>
						</div>
					);
				})}
			</div>
			{/* Förderpool */}
			<In at={atFoerder} dy={30} style={{left: LAYOUT.left, top: 700, width: LAYOUT.width}}>
				<Card color={YELLOW} style={{padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 14}} glow={0.3}>
					<svg width={110} height={110} viewBox="0 0 110 110" style={{flexShrink: 0}}>
						<path d="M22 40 h66 l-6 58 h-54 z" fill={withAlpha('#FFFFFF', 0.12)} stroke="#FFFFFF" strokeWidth={3} strokeLinejoin="round" />
						<rect x={18} y={32} width={74} height={10} rx={4} fill="#FFFFFF" />
						{[0, 1, 2, 3, 4].map((i) => {
							const t = Math.min(1, Math.max(0, pool * 5 - i));
							return <Coin key={i} x={38 + (i % 3) * 17} y={-10 + t * (86 - Math.floor(i / 3) * 16)} r={9} />;
						})}
					</svg>
					<div style={{flex: 1}}>
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, lineHeight: 1.05, color: COLORS.text}}>{ORGA.pool}</div>
						<div style={{marginTop: 4, fontFamily: FONTS.body, fontWeight: 700, fontSize: 21, lineHeight: 1.25, color: COLORS.textMuted}}>{ORGA.poolSub}</div>
					</div>
				</Card>
			</In>
			<Note text={ORGA.by} top={646} opacity={interpolate(frame, [roleAt[2] + 6, roleAt[2] + 14], [0, 1], clamp)} />
			{/* Figuren: Team wächst (bewusst klein) */}
			<svg width={1080} height={450} style={{position: 'absolute', left: 0, top: 820}}>
				<rect x={330} y={330} width={300} height={16} rx={6} fill="#3A4685" />
				<rect x={350} y={306} width={70} height={24} rx={3} fill="#F3F4F8" />
				<rect x={440} y={300} width={56} height={30} rx={3} fill="#FFD23F" />
				<rect x={516} y={310} width={90} height={20} rx={3} fill="#46C2FF" />
				{people.map((p, i) => {
					const o = interpolate(frame, [p.at, p.at + 10], [0, 1], clamp);
					return (
						<g key={i} opacity={o} transform={`translate(0 ${(1 - o) * 30})`}>
							<VectorPerson x={p.x} y={400} height={210} palette={p.palette} hair={p.hair} walkPhase={null} cheer={i === 2 ? 0.4 + 0.3 * Math.sin(frame / 8) : 0} sign={p.sign} facing={i === 0 ? 1 : -1} />
							<rect x={p.x - 70} y={404} width={140} height={34} rx={10} fill="rgba(8,10,28,0.92)" stroke={CYAN} strokeWidth={2} />
							<text x={p.x} y={428} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={900} fontSize={21} fill="#FFFFFF">{['HELFER', 'ORDNER', 'TEAM'][i]}</text>
						</g>
					);
				})}
			</svg>
			<IllustrationMark top={1240} />
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="pop" at={roleAt[0]} volume={0.45} />
			<Sfx name="pop" at={roleAt[1]} volume={0.45} />
			<Sfx name="pop" at={roleAt[2]} volume={0.4} />
			<Sfx name="softImpact" at={atFoerder} volume={0.45} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 8: Online-Zusagen ≠ Teilnehmer */

export const ZusagenScene: React.FC<SceneProps> = ({cues}) => {
	const frame = useCurrentFrame();
	const z1 = cue(cues, 'z1', 0);
	const atTeil = wordFrame(cues, 'Teilnehmerzahlen', z1.from + 20) - 6;
	const neq = useSpring(atTeil, 12, 200);
	const crowdOn = interpolate(frame, [atTeil + 4, atTeil + 16], [0, 1], clamp);
	return (
		<AbsoluteFill style={{backgroundColor: '#090C24', overflow: 'hidden'}}>
			<AbsoluteFill style={{background: `radial-gradient(ellipse 70% 45% at 30% 45%, ${withAlpha(ORANGE, 0.14)} 0%, rgba(0,0,0,0) 70%), radial-gradient(ellipse 70% 45% at 75% 70%, ${withAlpha(BLUE, 0.14)} 0%, rgba(0,0,0,0) 70%)`}} />
			<SceneTag text="ONLINE-ZUSAGEN" color={ORANGE} icon="users" />
			<div style={{position: 'absolute', left: LAYOUT.left + 10, top: 390}}>
				<TicketPhone width={260} at={2} color={ORANGE} value={String(ZUSAGEN.count)} />
			</div>
			<div style={{position: 'absolute', left: LAYOUT.left + 310, width: LAYOUT.width - 310, top: 410}}>
				<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: COLORS.textMuted}}>ZUSAGEN-ZÄHLER</div>
				<CountUp value={ZUSAGEN.count} at={2} dur={22} style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 110, lineHeight: 1, color: ORANGE, textShadow: `0 0 40px ${withAlpha(ORANGE, 0.5)}`}} />
				<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, lineHeight: 1.25, color: COLORS.textMuted}}>{ZUSAGEN.countAt}</div>
				<div style={{marginTop: 14, padding: '10px 12px', borderRadius: 14, background: withAlpha('#B794F6', 0.12), border: `2px solid ${withAlpha('#B794F6', 0.7)}`}}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 25, lineHeight: 1.2, color: COLORS.text}}>{ZUSAGEN.quote}</div>
					<div style={{marginTop: 4, fontFamily: FONTS.body, fontWeight: 700, fontSize: 18, color: COLORS.textMuted}}>{ZUSAGEN.quoteBy}</div>
				</div>
			</div>
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 920, display: 'flex', justifyContent: 'center', opacity: Math.min(1, neq * 1.7), scale: String(1.4 - 0.4 * neq)}}>
				<div style={{padding: '10px 24px', borderRadius: 16, border: `5px solid ${ACCENT.no}`, background: 'rgba(8,10,28,0.94)', rotate: '-3deg', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 46, color: COLORS.text, whiteSpace: 'nowrap'}}>
					ONLINE-ZUSAGEN <span style={{color: ACCENT.no}}>≠</span> TEILNEHMER
				</div>
			</div>
			<CrowdBand top={1050} height={240} opacity={crowdOn}>
				<Crowd width={1080} baseY={236} rows={2} perRow={9} seed="z16c" personHeight={140} marchSpeed={0} signRatio={0} depthFade={0.6} />
			</CrowdBand>
			<div style={{position: 'absolute', left: 0, right: 150, top: 1012, display: 'flex', justifyContent: 'center', opacity: crowdOn}}>
				<span style={{padding: '3px 12px', borderRadius: 10, background: 'rgba(8,10,28,0.9)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 24, color: COLORS.text}}>VOR ORT: <span style={{color: AMBER}}>?</span></span>
			</div>
			<IllustrationMark top={1030} />
			<Sfx name="notify" at={2} volume={0.45} />
			<Sfx name="stamp" at={atTeil} volume={0.5} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 9: Offene Frage + Abo-Aufruf */

export const OutroScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const q = cue(cues, 'q1', 0);
	const c = cue(cues, 'cta', 100);
	const atQ = Math.max(2, q.from - 2);
	const atKommen = wordFrame(cues, 'Kommen', atQ + 8) - 6;
	const atMehr = wordFrame(cues, 'mehr', atKommen + 10) - 6;
	const atCta = Math.max(atMehr + 10, c.from - 2);
	const swap = interpolate(frame, [atCta - 6, atCta + 6], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const qs = springIn({frame, fps, delay: atKommen, damping: 13, stiffness: 180});
	const cmp = interpolate(frame, [atQ + 2, atQ + 14], [0, 1], clamp);
	const mehrFlash = frame >= atMehr && frame < atMehr + 16 ? Math.sin(((frame - atMehr) / 16) * Math.PI) : 0;
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
			{/* Phase 1: Kalender + offene Frage + Vergleich (20.11. laut Polizei | 12.12. offen) – keine Prognose */}
			<div style={{opacity: 1 - swap, translate: `0 ${swap * -40}px`}}>
				<div style={{position: 'absolute', left: 0, right: 150, top: 380, paddingLeft: 75, display: 'flex', justifyContent: 'center'}}>
					<CalendarSheet to={{day: TERMIN.day, month: TERMIN.month}} at={atQ} width={200} accent={RED} />
				</div>
				<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 640, display: 'flex', justifyContent: 'center', opacity: Math.min(1, qs * 1.7), translate: `0 ${(1 - qs) * 30}px`}}>
					<div style={{padding: '14px 24px', borderRadius: 22, background: 'rgba(8,10,28,0.95)', border: `3px solid ${YELLOW}`, boxShadow: `0 20px 50px rgba(0,0,0,0.6), 0 0 ${30 + 30 * mehrFlash}px ${withAlpha(YELLOW, 0.25 + 0.3 * mehrFlash)}`, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 46, color: COLORS.text, whiteSpace: 'nowrap'}}>{FRAGE.question}</div>
				</div>
				<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 790, display: 'flex', gap: 16, opacity: cmp, translate: `0 ${(1 - cmp) * 30}px`}}>
					{[FRAGE.before, FRAGE.after].map((col, ci) => (
						<div key={col.date} style={{flex: 1, padding: '12px 14px 14px', borderRadius: 18, background: 'rgba(8,10,28,0.92)', border: ci ? `3px dashed ${withAlpha(AMBER, 0.85)}` : `2.5px solid ${withAlpha(BLUE, 0.8)}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 36, color: ci ? AMBER : COLORS.text}}>{col.date}</span>
							<svg width={330} height={150} viewBox="0 0 330 150">
								{new Array(12).fill(0).map((_, i) => {
									const x = 28 + (i % 6) * 55;
									const y = 18 + Math.floor(i / 6) * 70;
									const pop = interpolate(frame, [atQ + 4 + i * 1.5, atQ + 10 + i * 1.5], [0, 1], clamp);
									return ci ? (
										<g key={i} opacity={pop * (0.55 + 0.25 * Math.sin(frame / 9 + i))}>
											<circle cx={x} cy={y + 10} r={10} fill="none" stroke={AMBER} strokeWidth={2.5} strokeDasharray="4 3" />
											<path d={`M${x - 16} ${y + 50} q16 -32 32 0`} fill="none" stroke={AMBER} strokeWidth={2.5} strokeDasharray="4 3" />
										</g>
									) : (
										<g key={i} opacity={pop}>
											<circle cx={x} cy={y + 10} r={10} fill={withAlpha(BLUE, 0.9)} />
											<path d={`M${x - 16} ${y + 50} q16 -32 32 0 z`} fill={withAlpha(BLUE, 0.9)} />
										</g>
									);
								})}
								{ci ? <text x={165} y={98} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={900} fontSize={84} fill={AMBER} opacity={0.95}>?</text> : null}
							</svg>
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, color: COLORS.text, textAlign: 'center'}}>{col.value}</span>
							<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 21, lineHeight: 1.2, color: COLORS.textMuted, textAlign: 'center'}}>{col.by}</span>
						</div>
					))}
				</div>
				<IllustrationMark top={1250} />
			</div>
			{/* Phase 2: Logo + Abo */}
			<div style={{position: 'absolute', left: 64, width: 866, top: 470, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, opacity: Math.min(1, cta * 2), translate: `0 ${(1 - cta) * 50}px`}}>
				<div style={{position: 'relative'}}>
					<BrandLogo size={230} ring={6 + Math.sin(frame / 4) * 3} />
					<div style={{position: 'absolute', left: '50%', bottom: -26, translate: '-50% 0', scale: String(press), width: 68, height: 68, borderRadius: 34, background: followed ? GREEN : RED, border: '4px solid #FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 24px rgba(0,0,0,0.5)'}}>
						<P2Icon name={followed ? 'check' : 'plus'} size={38} color="#FFFFFF" stroke={3.4} />
					</div>
				</div>
				<span style={{marginTop: 12, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 54, color: COLORS.text}}>{handleWithAt()}</span>
				<div style={{padding: '12px 30px 14px', borderRadius: 20, background: RED, boxShadow: '0 20px 50px rgba(255,59,78,0.35)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 42, color: '#FFFFFF', scale: String(followed ? 1 + 0.035 * Math.sin((frame - atCta - 28) / 5) : 1)}}>{FRAGE.cta}</div>
				<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 24, letterSpacing: 2.5, color: YELLOW}}>{FRAGE.ctaSub}</span>
			</div>
			<Sfx name="tick" at={atQ} volume={0.45} />
			<Sfx name="notify" at={atMehr} volume={0.45} />
			<Sfx name="pop" at={atCta} volume={0.6} />
			<Sfx name="click" at={atCta + 26} volume={0.6} />
		</AbsoluteFill>
	);
};

