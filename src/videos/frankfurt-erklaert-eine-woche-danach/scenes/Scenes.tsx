import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {FrankfurtSkyline} from '../../../components/backgrounds/FrankfurtSkyline';
import {BrandLogo} from '../../../components/brand/BrandLogo';
import {interpolateCamera, type PlaneBillboard, type PlaneCamera, projectPlanePoint} from '../../../components/map/TiltedPlane';
import {TopTag} from '../../../formats/frankfurt-erklaert/Branding';
import {ACCENT, FORMAT, LAYOUT} from '../../../formats/frankfurt-erklaert/theme';
import {CityDashboard, type DashboardCard} from '../../../formats/frankfurt-erklaert/visuals/CityDashboard';
import {clamp, EASE_IN_OUT, EASE_OUT, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {handleWithAt} from '../../../theme/brand';
import {COLORS, FONTS} from '../../../theme/tokens';
import {MOODS, NightCity} from '../../frankfurt-2026-11-20-ausblick/premium/NightCity';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {P2Icon, type P2IconName, Stars, useSpring} from '../../frankfurt-erklaert-genz-phase2-2026-11-14/scenes/kit';
import {germanyGeo, GermanyPlane} from '../../frankfurt-erklaert-genz-phase2-2026-11-14/visuals/GermanyPlane';
import {BERLIN, COVER, DASHBOARD, DRESDEN, FRANKFURT, HAMBURG, LEIPZIG, OUTRO, STAND, STUTTGART} from '../content';
import {WOCHE_COVER_LAYOUT} from '../cover-layout';
import {CITIES, cityById, type CityId, type CityStat} from '../data/staedte';
import {CityPanorama, FrankfurtMini, LANDMARK_CROP} from '../visuals/Cities';
import {FolderStack, JusticeScale, LawBook, MiniGermany, NotEqual, ParliamentDoc, PersonGrid} from '../visuals/Investigation';

const RED = ACCENT.brand;
const YELLOW = COLORS.signal;
const GREEN = '#3DDC97';
const NEWS = 'news' as const;
const ORDER: CityId[] = ['leipzig', 'hamburg', 'dresden', 'stuttgart', 'berlin', 'frankfurt'];
/** Farben der Leipziger Teilgruppen (Kinder, Jugendliche) – Teil der Gesamtmenge, nie zusätzlich. */
const GROUP_COLORS = ['#B794F6', '#FFB547'];

/* ------------------------------------------------------------------ Bausteine (wie #15–#19) */

const In: React.FC<{at: number; children: React.ReactNode; dx?: number; dy?: number; style?: React.CSSProperties; out?: number}> = ({at, children, dx = 0, dy = 30, style, out = 1}) => {
	const s = useSpring(at, 13, 180);
	const frame = useCurrentFrame();
	if (frame < at - 1) return null;
	return <div style={{position: 'absolute', opacity: Math.min(1, s * 1.7) * out, translate: `${(1 - s) * dx}px ${(1 - s) * dy}px`, scale: String(0.92 + 0.08 * s), ...style}}>{children}</div>;
};

const SceneTag: React.FC<{text: string; color: string; icon: P2IconName}> = ({text, color, icon}) => <TopTag text={text} color={color} icon={<P2Icon name={icon} size={30} color={ACCENT.ink} stroke={2.6} />} />;

const Mark: React.FC<{text?: string; top?: number; right?: number}> = ({text = 'ILLUSTRATION', top = 700, right = 160}) => (
	<div style={{position: 'absolute', right, top, fontFamily: FONTS.body, fontWeight: 700, fontSize: 18, letterSpacing: 1.5, color: withAlpha('#FFFFFF', 0.6)}}>{text}</div>
);

const Note: React.FC<{text: string; top: number; icon?: P2IconName; opacity?: number; color?: string}> = ({text, top, icon = 'info', opacity = 1, color = COLORS.textMuted}) => (
	<div style={{position: 'absolute', left: LAYOUT.left, top, maxWidth: LAYOUT.width, display: 'flex', alignItems: 'center', gap: 10, padding: '6px 14px', borderRadius: 12, background: 'rgba(8,10,28,0.9)', boxSizing: 'border-box', opacity}}>
		<P2Icon name={icon} size={24} color={color} />
		<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 23, lineHeight: 1.22, color}}>{text}</span>
	</div>
);

const Pill: React.FC<{text: string; color: string; icon?: P2IconName; size?: number; solid?: boolean}> = ({text, color, icon, size = 28, solid = false}) => (
	<div style={{display: 'inline-flex', alignItems: 'center', gap: 10, padding: `${size * 0.26}px ${size * 0.6}px`, borderRadius: size * 0.6, background: solid ? color : 'rgba(8,10,28,0.94)', border: `3px solid ${color}`, boxShadow: `0 10px 26px rgba(0,0,0,0.45)`}}>
		{icon ? <P2Icon name={icon} size={size * 1.05} color={solid ? ACCENT.ink : color} stroke={3} /> : null}
		<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: size, letterSpacing: 0.8, color: solid ? ACCENT.ink : COLORS.text, whiteSpace: 'nowrap'}}>{text}</span>
	</div>
);

/** Zähler: läuft vom Erscheinen (`from`) bis zum gesprochenen Wert (`to` = Wort-Cue), danach steht die Zahl. */
const Counter: React.FC<{value: number; prefix?: string; from: number; to: number; size: number; color: string}> = ({value, prefix = '', from, to, size, color}) => {
	const frame = useCurrentFrame();
	const v = Math.round(interpolate(frame, [from, Math.max(from + 6, to)], [0, value], {...clamp, easing: EASE_OUT}));
	return (
		<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: size, lineHeight: 0.95, letterSpacing: -2, color, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums', textShadow: `0 0 50px ${withAlpha(color, 0.4)}, 0 14px 36px rgba(0,0,0,0.85)`}}>
			{prefix}
			{v.toLocaleString('de-DE')}
		</span>
	);
};

const Label: React.FC<{text: string; size?: number; color?: string}> = ({text, size = 30, color = COLORS.text}) => (
	<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: size, letterSpacing: 1, color, whiteSpace: 'nowrap', textShadow: '0 4px 16px rgba(0,0,0,0.9)'}}>{text}</div>
);

/* ------------------------------------------------------------------ Deutschlandkarte: Kamera, Marker, Kartenflug */

const cityXY = (id: CityId): [number, number] => {
	const c = cityById(id);
	return germanyGeo().project([c.lon, c.lat]);
};
export const MAP_ANCHOR: [number, number] = [540, 1010];
export const DE_OVERVIEW: PlaneCamera = {x: 500, y: 680, zoom: 0.66, tilt: 42, rotate: -2};
const focusCam = (id: CityId, zoom = 2.2): PlaneCamera => {
	const [x, y] = cityXY(id);
	return {x, y: y - 10, zoom, tilt: 52, rotate: -5};
};
const PERSPECTIVE = 1400;
/** Label-Versatz (Leipzig/Dresden und Berlin liegen eng beieinander). */
const LABEL_SHIFT: Record<CityId, number> = {leipzig: -46, dresden: 52, berlin: 30, hamburg: 0, stuttgart: 0, frankfurt: -30};

type DotState = {on: number; active: number; done: number; label: number};
const CityDot: React.FC<{c: CityStat; s: DotState; small?: boolean}> = ({c, s, small}) => {
	const frame = useCurrentFrame();
	const pulse = s.active * (0.5 + 0.5 * Math.sin(frame / 5));
	const color = s.active > 0.5 ? c.color : s.done > 0.5 ? GREEN : '#E8ECFF';
	const d = (small ? 16 : 22) * (1 + 0.45 * s.active);
	return (
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: s.on, scale: String((0.6 + 0.4 * s.on) * (1 + 0.2 * s.active)), transformOrigin: '50% 100%'}}>
			<div style={{translate: `${LABEL_SHIFT[c.id]}px 0`, padding: small ? '3px 9px' : '4px 12px', borderRadius: 10, background: 'rgba(8,10,28,0.92)', border: `3px solid ${color}`, fontFamily: FONTS.heading, fontWeight: 900, fontSize: small ? 20 : 26, letterSpacing: 1.2, color: '#FFFFFF', whiteSpace: 'nowrap', opacity: s.label, boxShadow: `0 8px 22px rgba(0,0,0,0.5), 0 0 ${10 + 20 * pulse}px ${withAlpha(color, 0.5)}`}}>{c.name}</div>
			<div style={{width: 3, height: small ? 22 : 34, background: `linear-gradient(${color}, ${withAlpha(color, 0.1)})`, opacity: s.label}} />
			<div style={{width: d, height: d, marginTop: -d / 2, borderRadius: d, background: color, border: '3px solid #FFFFFF', boxShadow: `0 0 ${14 + 22 * pulse}px ${withAlpha(color, 0.9)}`}} />
		</div>
	);
};

const markers = (state: (id: CityId, i: number) => DotState, small?: boolean): PlaneBillboard[] =>
	CITIES.map((c, i) => {
		const [x, y] = cityXY(c.id);
		return {key: `m-${c.id}`, x, y, z: 4, node: <CityDot c={c} s={state(c.id, i)} small={small} />};
	});

const MapBg: React.FC = () => (
	<>
		<AbsoluteFill style={{background: 'radial-gradient(ellipse 110% 60% at 50% 50%, #252A70 0%, #111444 52%, #060920 100%)'}} />
		<Stars seed="st20" n={40} height={520} />
	</>
);

/** Dauer des Kartenflugs am Anfang jeder Stadtszene (Frames) und der Kreis-Öffnung in die Stadtansicht. */
const HOP = 16;
const REVEAL: [number, number] = [9, 26];

/**
 * Stadt-Bühne: Kartenflug von der vorigen Stadt (bzw. Übersicht) zur Zielstadt, dann öffnet sich die Stadtansicht kreisförmig aus dem Marker.
 * Danach: Panorama oben (ILLUSTRATION), Mini-Deutschlandkarte rechts oben (Navigator), Inhalte darunter.
 */
const CityStage: React.FC<{city: CityId; prev: CityId | 'overview'; tag: string; icon: P2IconName; pano: React.ReactNode; children: React.ReactNode; durationInFrames: number}> = ({city, prev, tag, icon, pano, children, durationInFrames}) => {
	const frame = useCurrentFrame();
	const c = cityById(city);
	const idx = ORDER.indexOf(city);
	const done = ORDER.slice(0, idx);
	const fromCam = prev === 'overview' ? DE_OVERVIEW : {...focusCam(prev, 1.1), tilt: 46};
	const endCam = focusCam(city);
	const cam = interpolateCamera(frame, [
		{frame: 0, cam: fromCam},
		{frame: 5, cam: {...DE_OVERVIEW, zoom: prev === 'overview' ? DE_OVERVIEW.zoom : 0.8}},
		{frame: HOP, cam: endCam},
	], EASE_IN_OUT);
	const [mx, my] = cityXY(city);
	const p = projectPlanePoint(endCam, MAP_ANCHOR, PERSPECTIVE, mx, my);
	const rv = interpolate(frame, REVEAL, [0, 1], {...clamp, easing: EASE_IN_OUT});
	const pull = interpolate(frame, [REVEAL[0], durationInFrames], [0, 1], clamp);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			{frame < REVEAL[1] + 2 ? (
				<>
					<MapBg />
					<GermanyPlane camera={cam} anchor={MAP_ANCHOR} markers={markers((id) => ({on: 1, active: id === city ? 1 : 0, done: done.includes(id) ? 1 : 0, label: 1}), true)} glow={1} />
				</>
			) : null}
			<AbsoluteFill style={{opacity: Math.min(1, rv * 1.5), scale: String(0.06 + 0.94 * rv), transformOrigin: `${p.x}px ${p.y}px`, borderRadius: (1 - rv) * 400, overflow: 'hidden'}}>
				<AbsoluteFill style={{background: COLORS.night}} />
				<div style={{position: 'absolute', left: 0, top: 120, width: 1080, scale: String(1.08 - 0.06 * pull), transformOrigin: '50% 60%'}}>{pano}</div>
				<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.92) 0%, rgba(4,6,20,0.35) 18%, rgba(4,6,20,0) 26%, rgba(4,6,20,0) 32%, rgba(4,6,20,0.55) 40%, rgba(4,6,20,0.93) 47%, rgba(4,6,20,0.97) 100%)'}} />
				<Mark top={690} />
				{children}
			</AbsoluteFill>
			<SceneTag text={tag} color={c.color} icon={icon} />
			<div style={{position: 'absolute', right: 150, top: 366, opacity: interpolate(frame, [REVEAL[0], REVEAL[1]], [0, 1], clamp)}}>
				<div style={{padding: 8, borderRadius: 14, background: 'rgba(8,10,28,0.78)', border: `2px solid ${withAlpha(c.color, 0.6)}`}}>
					<MiniGermany width={104} active={city} done={done} color={c.color} />
				</div>
			</div>
			<Sfx name="whoosh" at={0} volume={0.38} />
			<Sfx name="blip" at={HOP - 2} volume={0.45} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 1: Titelbild + Kalender + sechs Städte */

const CalSheet: React.FC<{day: string; month: string; color: string; width: number}> = ({day, month, color, width}) => (
	<div style={{width, borderRadius: 16, overflow: 'hidden', background: '#F6F3EA', boxShadow: '0 16px 40px rgba(0,0,0,0.6)'}}>
		<div style={{background: color, padding: '6px 0', textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: width * 0.2, letterSpacing: 2, color: '#FFFFFF'}}>{month}</div>
		<div style={{textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: width * 0.52, lineHeight: 1.05, color: '#14141C'}}>{day}</div>
	</div>
);

/**
 * Titelbild (Video-Frame 0 und PNG, nach COVER_ZONE): Serientitel, Kicker „GEN Z: EINE WOCHE DANACH“, große Frage „WAS ERMITTELT DIE
 * POLIZEI?“, Plakette „20.11. → 27.11. · 7 TAGE“, 2,5D-Deutschlandkarte mit den sechs Städten, Logo + Account; im PNG zusätzlich die
 * Themenzeile. `morph` blendet die Texte aus und fährt die Karte in die Übersicht.
 */
export const WocheCover: React.FC<{morph?: number; thumbnail?: boolean; meta?: number}> = ({morph = 0, thumbnail = false, meta = 1}) => {
	const frame = useCurrentFrame();
	const L = WOCHE_COVER_LAYOUT;
	const m = EASE_IN_OUT(Math.min(1, Math.max(0, morph)));
	const coverCam: PlaneCamera = {x: 470, y: 660, zoom: 0.46, tilt: 56, rotate: -2 + Math.sin(frame / 40) * 1};
	const cam = interpolateCamera(m * 100, [
		{frame: 0, cam: coverCam},
		{frame: 100, cam: DE_OVERVIEW},
	], (t) => t);
	const anchor: [number, number] = [540, 1110 - 100 * m];
	const text = 1 - Math.min(1, m * 1.6);
	const bob = Math.sin(frame / 26) * 3;
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<MapBg />
			<GermanyPlane camera={cam} anchor={anchor} markers={markers(() => ({on: 1, active: 0, done: 0, label: text > 0.5 ? 1 : 0}), true)} glow={1} />
			<AbsoluteFill style={{background: `linear-gradient(rgba(4,6,20,${0.5 * text}) 0%, rgba(4,6,20,${0.15 * text}) 15%, rgba(4,6,20,${0.72 * text}) 26%, rgba(4,6,20,${0.88 * text}) 40%, rgba(4,6,20,${0.55 * text}) 46%, rgba(4,6,20,0) 52%, rgba(4,6,20,0) 66%, rgba(4,6,20,${0.55 * text}) 76%, rgba(4,6,20,${0.8 * text}) 100%)`}} />
			<div style={{opacity: text, translate: `0 ${(1 - text) * -30}px`}}>
				<div style={{position: 'absolute', left: 0, right: 0, top: L.brandTop, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16}}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 50, lineHeight: 0.98, color: COLORS.text, textAlign: 'right', textShadow: '0 6px 24px rgba(0,0,0,0.8)'}}>
						FRANKFURT
						<br />
						ERKLÄRT
					</div>
					<div style={{padding: '9px 16px', borderRadius: 10, background: RED, boxShadow: '0 10px 26px rgba(255,59,78,0.4)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, letterSpacing: 3, color: '#FFFFFF'}}>{FORMAT.sub}</div>
				</div>
				<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.kickerTop, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: L.kickerSize, lineHeight: 1.1, letterSpacing: 1, color: YELLOW, whiteSpace: 'nowrap', textShadow: '0 8px 26px rgba(0,0,0,0.9)'}}>{COVER.kicker}</div>
				<div style={{position: 'absolute', left: 0, right: 0, top: L.bigTop + bob, height: L.bigBottom - L.bigTop, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: L.bigSize, lineHeight: 1.02, letterSpacing: -1.5, color: COLORS.text, textShadow: '0 20px 50px rgba(0,0,0,0.85)'}}>
					WAS ERMITTELT
					<br />
					DIE POLIZEI?
				</div>
				<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.tagTop, height: L.tagBottom - L.tagTop, display: 'flex', justifyContent: 'center'}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px', borderRadius: 30, background: 'rgba(8,10,28,0.94)', border: `3px solid ${YELLOW}`}}>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, letterSpacing: 1, color: COLORS.text, whiteSpace: 'nowrap'}}>{COVER.from}</span>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: YELLOW}}>→</span>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, letterSpacing: 1, color: COLORS.text, whiteSpace: 'nowrap'}}>{COVER.to}</span>
						<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 24, letterSpacing: 2, color: YELLOW, whiteSpace: 'nowrap'}}>· {COVER.days} · 6 STÄDTE</span>
					</div>
				</div>
				<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.metaTop, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, opacity: meta}}>
					<BrandLogo size={52} />
					<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 30, color: COLORS.textMuted}}>{handleWithAt(NEWS)}</span>
				</div>
				{thumbnail ? (
					<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.thumbTop, display: 'flex', justifyContent: 'center'}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 22px', borderRadius: 16, background: 'rgba(8,10,28,0.92)', border: `2.5px solid ${YELLOW}`}}>
							<P2Icon name="doc" size={30} color={YELLOW} />
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: COLORS.text, whiteSpace: 'nowrap'}}>{COVER.thumb}</span>
						</div>
					</div>
				) : null}
			</div>
		</AbsoluteFill>
	);
};

export const CoverScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const o1 = cue(cues, 'o1', 30);
	const o2 = cue(cues, 'o2', o1.to);
	const atJug = wordFrame(cues, 'Jugendprotesten', o1.from + 14);
	const morphAt = atJug - 4;
	const morph = interpolate(frame, [morphAt, morphAt + 14], [0, 1], clamp);
	const meta = interpolate(frame, [o1.from - 8, o1.from], [1, 0], clamp);
	const at20 = wordFrame(cues, '20', atJug + 10) - 4;
	const atWeek = at20 + 18;
	const atErm = wordFrame(cues, 'Ermittlungen', at20 + 20) - 4;
	const atSechs = wordFrame(cues, 'sechs', o2.from + 10) - 6;
	/* Kalender: 20 → 27, Tag für Tag */
	const dayP = interpolate(frame, [at20 + 4, at20 + 26], [0, 7], {...clamp, easing: EASE_IN_OUT});
	const day = 20 + Math.floor(dayP + 0.0001);
	const cal = useSpring(at20, 14, 170);
	const camEnd = interpolate(frame, [durationInFrames - 10, durationInFrames], [0, 1], clamp);
	const after = frame >= morphAt + 10;
	return (
		<AbsoluteFill>
			{after ? (
				<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
					<MapBg />
					<GermanyPlane
						camera={interpolateCamera(camEnd * 10, [
							{frame: 0, cam: DE_OVERVIEW},
							{frame: 10, cam: {...DE_OVERVIEW, zoom: DE_OVERVIEW.zoom * 1.04}},
						], (t) => t)}
						anchor={MAP_ANCHOR}
						markers={markers((_, i) => ({on: interpolate(frame, [atSechs + i * 4, atSechs + i * 4 + 8], [0.25, 1], clamp), active: frame >= atSechs + i * 4 ? 1 : 0, done: 0, label: interpolate(frame, [atSechs + i * 4, atSechs + i * 4 + 6], [0, 1], clamp)}), true)}
						glow={1}
					/>
					<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.9) 0%, rgba(4,6,20,0.45) 30%, rgba(4,6,20,0) 42%, rgba(4,6,20,0) 70%, rgba(4,6,20,0.7) 100%)'}} />
				</AbsoluteFill>
			) : null}
			{frame < morphAt + 16 ? (
				<AbsoluteFill style={{opacity: after ? interpolate(frame, [morphAt + 10, morphAt + 16], [1, 0], clamp) : 1}}>
					<WocheCover morph={morph} meta={meta} />
				</AbsoluteFill>
			) : null}
			{after ? (
				<>
					<div style={{position: 'absolute', left: 0, right: 0, top: 380, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 26, opacity: Math.min(1, cal * 1.6), translate: `0 ${(1 - cal) * -30}px`}}>
						<CalSheet day="20" month="NOV" color="#8E9AC8" width={150} />
						<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
							<div style={{display: 'flex', gap: 6}}>
								{new Array(7).fill(0).map((_, i) => (
									<div key={i} style={{width: 22, height: 22, borderRadius: 6, background: i < dayP ? YELLOW : 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.4)'}} />
								))}
							</div>
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: YELLOW, letterSpacing: 2}}>{COVER.days}</span>
						</div>
						<CalSheet day={String(Math.min(27, Math.max(20, day)))} month="NOV" color={RED} width={150} />
					</div>
					<In at={atWeek} dy={20} style={{left: 0, right: 0, top: 600, display: 'flex', justifyContent: 'center'}}>
						<div style={{padding: '8px 26px 10px', borderRadius: 18, background: 'linear-gradient(160deg, #FF6A78 0%, #FF4D5E 50%, #D93448 100%)', boxShadow: '0 5px 0 #B32A3C, 0 10px 0 #8E1F2E, 0 30px 60px rgba(0,0,0,0.6)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 48, color: '#FFFFFF', whiteSpace: 'nowrap'}}>EINE WOCHE DANACH</div>
					</In>
					<In at={atErm} dy={16} style={{left: 0, right: 0, top: 700, display: 'flex', justifyContent: 'center'}}>
						<Pill text="WAS IST AUS DEN ERMITTLUNGEN GEWORDEN?" color={YELLOW} icon="doc" size={27} />
					</In>
					<In at={atSechs} dy={16} style={{left: 0, right: 0, top: 1262, display: 'flex', justifyContent: 'center'}}>
						<Pill text="6 STÄDTE · RECHERCHESTAND 27.11." color="#9CC2FF" icon="pin" size={24} />
					</In>
				</>
			) : null}
			<Sfx name="softImpact" at={0} volume={0.5} />
			<Sfx name="whoosh" at={morphAt} volume={0.4} />
			<Sfx name="tick" at={at20 + 4} volume={0.4} />
			<Sfx name="tick" at={at20 + 26} volume={0.4} />
			<Sfx name="stamp" at={atWeek} volume={0.45} />
			<Sfx name="blip" at={atSechs} volume={0.4} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 2: Leipzig (ausführlichster Abschnitt) */

export const LeipzigScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const c = cityById('leipzig');
	const l1 = cue(cues, 'l1', 0);
	const l2 = cue(cues, 'l2', l1.to);
	const l3 = cue(cues, 'l3', l2.to);
	const atId = Math.max(REVEAL[1] - 2, wordFrame(cues, 'Identität', l1.from + 20) - 8);
	const at200 = wordFrame(cues, '200', atId + 20);
	const atKinder = wordFrame(cues, 'Kinder', at200 + 10) - 4;
	const atJug = wordFrame(cues, 'Jugendliche', atKinder + 10) - 4;
	const atSta = Math.max(l2.from - 4, atJug + 10);
	const atSchwer = wordFrame(cues, 'schweren', atSta + 20) - 4;
	const atBrand = wordFrame(cues, 'Brandstiftung', atSchwer + 20) - 4;
	const atKv = wordFrame(cues, 'Körperverletzung', atBrand + 10) - 4;
	const atWichtig = Math.max(l3.from - 4, atKv + 10);
	const atBesch = wordFrame(cues, 'Beschuldigte', atWichtig + 6) - 4;
	const atStraf = wordFrame(cues, 'vierzehn', atBesch + 20) - 6;
	const pA = frame < atSta + 6 ? 1 : interpolate(frame, [atSta, atSta + 8], [1, 0], clamp);
	const pB = interpolate(frame, [atSta, atSta + 8, atWichtig, atWichtig + 8], [0, 1, 1, 0], clamp);
	const pC = interpolate(frame, [atWichtig, atWichtig + 8], [0, 1], clamp);
	const gridFill = interpolate(frame, [atId, at200], [0, 1], clamp);
	const deliktAt = [atBrand, atKv, atKv + 8, atKv + 14];
	return (
		<CityStage city="leipzig" prev="overview" tag={LEIPZIG.tag} icon="doc" durationInFrames={durationInFrames} pano={<CityPanorama city="leipzig" accent={c.color} width={1080} />}>
			{/* Phase A: über 200 Personen, Raster mit Teilgruppen */}
			<div style={{opacity: pA}}>
				<In at={atId} dy={30} style={{left: LAYOUT.left, top: 720}}>
					<Counter value={c.main.count ?? 0} prefix={c.main.prefix} from={atId} to={at200} size={124} color={c.color} />
				</In>
				<In at={atId + 4} dy={20} style={{left: LAYOUT.left, top: 852}}>
					<Label text={LEIPZIG.label} size={32} />
					<div style={{marginTop: 6, fontFamily: FONTS.body, fontWeight: 700, fontSize: 23, color: COLORS.textMuted, whiteSpace: 'nowrap'}}>
						{LEIPZIG.policeWord} · {LEIPZIG.forces}
					</div>
				</In>
				{frame >= atId ? (
					<div style={{position: 'absolute', left: LAYOUT.left, top: 960}}>
						<PersonGrid total={c.main.count ?? 0} cols={40} width={LAYOUT.width} fill={gridFill} groups={(c.groups ?? []).map((g, i) => ({n: g.n, color: GROUP_COLORS[i], on: frame >= [atKinder, atJug][i] ? 1 : 0}))} />
					</div>
				) : null}
				<In at={atKinder} dy={16} style={{left: LAYOUT.left, top: 1100, display: 'flex', gap: 12, alignItems: 'center'}}>
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 24, letterSpacing: 2, color: COLORS.textMuted}}>{LEIPZIG.subgroups}</span>
					<Pill text={c.groups?.[0]?.label ?? ''} color={GROUP_COLORS[0]} size={26} />
					{frame >= atJug ? <Pill text={c.groups?.[1]?.label ?? ''} color={GROUP_COLORS[1]} size={26} /> : null}
				</In>
				<In at={atJug + 8} dy={10} style={{left: LAYOUT.left, top: 1172}}>
					<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 23, color: COLORS.textMuted}}>↳ {LEIPZIG.notExtra} (in den über 200 enthalten)</div>
				</In>
			</div>
			{/* Phase B: Ermittlungsakte, § 125a, Delikte */}
			{frame >= atSta - 1 ? (
				<div style={{opacity: pB}}>
					<In at={atSta} dy={24} style={{left: LAYOUT.left, top: 720, width: LAYOUT.width}}>
						<div style={{padding: '12px 18px', borderRadius: 18, background: 'rgba(8,10,28,0.94)', border: `3px solid ${c.color}`}}>
							<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 22, letterSpacing: 2, color: c.color}}>STAATSANWALTSCHAFT LEIPZIG</div>
							<div style={{marginTop: 4, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, lineHeight: 1.1, color: COLORS.text}}>schwerer Fall des Landfriedensbruchs</div>
						</div>
					</In>
					<In at={atSta + 6} dy={30} style={{left: LAYOUT.left, top: 880}}>
						<div style={{position: 'relative'}}>
							<FolderStack width={250} n={4} color={c.color} />
							<div style={{position: 'absolute', left: 40, top: 90, rotate: '-12deg', scale: String(interpolate(frame, [atSchwer, atSchwer + 6], [1.6, 1], clamp)), opacity: interpolate(frame, [atSchwer, atSchwer + 4], [0, 1], clamp), padding: '4px 12px', border: `4px solid ${RED}`, borderRadius: 8, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 24, letterSpacing: 1.5, color: RED, background: 'rgba(255,255,255,0.9)'}}>{LEIPZIG.suspicion}</div>
						</div>
					</In>
					<In at={atSchwer} dy={30} style={{left: 330, top: 900}}>
						<LawBook width={110} label="§125a" color="#B794F6" />
					</In>
					<In at={atBrand - 4} dy={0} dx={30} style={{left: 470, top: 880, width: 460}}>
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 22, letterSpacing: 1.5, color: COLORS.textMuted}}>ERMITTELT WIRD U. A. WEGEN</div>
					</In>
					{LEIPZIG.delikte.map((d, i) => (
						<In key={d} at={deliktAt[i]} dx={30} dy={0} style={{left: 470, top: 920 + i * 66}}>
							<Pill text={d.toUpperCase()} color={i < 2 ? YELLOW : '#9AA6CC'} size={26} />
						</In>
					))}
					<In at={atKv + 18} dy={10} style={{left: 0, top: 0, width: 1080}}>
						<Note text={LEIPZIG.verfahren} top={1200} icon="clock" />
					</In>
				</div>
			) : null}
			{/* Phase C: Einordnung */}
			{frame >= atWichtig - 1 ? (
				<div style={{opacity: pC}}>
					<In at={atWichtig} dy={20} style={{left: 0, right: 0, top: 720, display: 'flex', justifyContent: 'center'}}>
						<JusticeScale width={170} color={YELLOW} />
					</In>
					<In at={atBesch} dy={24} style={{left: 0, right: 0, top: 920, display: 'flex', justifyContent: 'center'}}>
						<NotEqual left={LEIPZIG.notGuilty[0]} right={LEIPZIG.notGuilty[1]} color={RED} size={38} />
					</In>
					<In at={atStraf} dy={24} style={{left: 0, right: 0, top: 1030, display: 'flex', justifyContent: 'center'}}>
						<NotEqual left={LEIPZIG.kidsLaw[0]} right={LEIPZIG.kidsLaw[1]} sign="=" color="#B794F6" size={34} />
					</In>
					<In at={atStraf + 8} dy={10} style={{left: 0, top: 0, width: 1080}}>
						<Note text={`${LEIPZIG.kidsLawRef} · keine Rechtsberatung`} top={1140} icon="info" />
					</In>
				</div>
			) : null}
			<Sfx name="softImpact" at={at200} volume={0.45} />
			<Sfx name="pop" at={atKinder} volume={0.4} />
			<Sfx name="pop" at={atJug} volume={0.4} />
			<Sfx name="paper" at={atSta + 6} volume={0.45} />
			<Sfx name="stamp" at={atSchwer} volume={0.5} />
			<Sfx name="click" at={atBrand} volume={0.4} />
			<Sfx name="click" at={atKv} volume={0.4} />
			<Sfx name="pop" at={atBesch} volume={0.45} />
			<Sfx name="pop" at={atStraf} volume={0.45} />
		</CityStage>
	);
};

/* ------------------------------------------------------------------ Szene 3: Hamburg */

export const HamburgScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const c = cityById('hamburg');
	const h1 = cue(cues, 'h1', 0);
	const h2 = cue(cues, 'h2', h1.to);
	const atFest = Math.max(REVEAL[1] - 2, wordFrame(cues, 'Festnahmen', h1.from + 20) - 8);
	const atGes = wordFrame(cues, 'Gesamtzahl', atFest + 20) - 4;
	const atKorr = wordFrame(cues, 'bekannt', atGes + 10) - 4;
	const atB = Math.max(h2.from - 4, atKorr + 12);
	const at23 = wordFrame(cues, '23', atB + 4) - 4;
	const atAnf = Math.min(wordFrame(cues, 'Anfragen', at23 + 10) - 6, at23 + 8);
	const atAntw = wordFrame(cues, 'Antwort', atAnf + 10) - 4;
	const pA = interpolate(frame, [atB, atB + 8], [1, 0], clamp);
	const pB = interpolate(frame, [atB, atB + 8], [0, 1], clamp);
	return (
		<CityStage city="hamburg" prev="leipzig" tag={HAMBURG.tag} icon="doc" durationInFrames={durationInFrames} pano={<CityPanorama city="hamburg" accent={c.color} width={1080} />}>
			<div style={{opacity: pA}}>
				<In at={atFest} dy={30} style={{left: LAYOUT.left, top: 720}}>
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 112, lineHeight: 0.95, letterSpacing: -2, color: c.color, textShadow: `0 0 50px ${withAlpha(c.color, 0.4)}, 0 14px 36px rgba(0,0,0,0.85)`}}>{HAMBURG.main}</span>
				</In>
				<In at={atFest + 4} dy={20} style={{left: LAYOUT.left, top: 840}}>
					<Label text={HAMBURG.label} size={34} />
					<div style={{marginTop: 4, fontFamily: FONTS.body, fontWeight: 700, fontSize: 23, color: COLORS.textMuted}}>laut Polizei (NDR, tagesschau, Bundespolizei)</div>
				</In>
				<In at={atGes} dy={20} style={{left: LAYOUT.left, top: 940, width: LAYOUT.width}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '10px 18px', borderRadius: 18, background: 'rgba(8,10,28,0.94)', border: `3px solid ${withAlpha('#FFFFFF', 0.5)}`}}>
						<div style={{width: 64, height: 64, borderRadius: 32, background: withAlpha(c.color, 0.2), border: `3px solid ${c.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 42, color: c.color}}>?</div>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, lineHeight: 1.1, color: COLORS.text}}>{HAMBURG.total}</span>
					</div>
				</In>
				<In at={atKorr} dy={20} style={{left: LAYOUT.left, top: 1060, width: LAYOUT.width}}>
					<div style={{padding: '10px 18px', borderRadius: 18, background: 'rgba(8,10,28,0.94)', border: `3px solid ${YELLOW}`}}>
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 22, letterSpacing: 2, color: YELLOW}}>{HAMBURG.correction[0]}</div>
						<div style={{marginTop: 4, display: 'flex', alignItems: 'center', gap: 14}}>
							<span style={{position: 'relative', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 32, color: '#9AA6CC'}}>
								FLASCHEN
								<span style={{position: 'absolute', left: -4, right: -4, top: '52%', height: 5, background: RED, scale: `${interpolate(frame, [atKorr + 6, atKorr + 14], [0, 1], clamp)} 1`, transformOrigin: '0 50%'}} />
							</span>
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 32, color: YELLOW}}>→</span>
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 32, color: COLORS.text, opacity: interpolate(frame, [atKorr + 12, atKorr + 18], [0, 1], clamp)}}>PYROTECHNIK</span>
						</div>
						<div style={{marginTop: 2, fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted}}>{HAMBURG.correctionBy} – betrifft diese eine Meldung</div>
					</div>
				</In>
			</div>
			{frame >= atB - 1 ? (
				<div style={{opacity: pB}}>
					<In at={atB} dy={20} style={{left: LAYOUT.left, top: 718, width: LAYOUT.width}}>
						<Label text={HAMBURG.headline} size={40} />
					</In>
					<In at={at23} dy={14} style={{left: LAYOUT.left, top: 776}}>
						<Pill text="ANFRAGEN VOM 23.11." color={c.color} icon="doc" size={26} />
					</In>
					{HAMBURG.docs.map((d, i) => (
						<In key={d.nr} at={atAnf + i * 8} dy={50} style={{left: LAYOUT.left + i * 446, top: 852, rotate: `${i === 0 ? -2 : 2}deg`}}>
							<ParliamentDoc body={d.body} nr={d.nr} kind={d.kind} by={d.by} date={d.date} topic={i === 0 ? 'Thema: Polizeieinsatz nach der Demo' : 'Fragen u. a.: Festnahmen, Schäden, Kosten'} stamp={HAMBURG.noAnswer} stampOn={interpolate(frame, [atAntw + i * 4, atAntw + i * 4 + 6], [0, 1], clamp)} width={420} color={RED} />
						</In>
					))}
					<In at={atAntw + 10} dy={10} style={{left: 0, top: 0, width: 1080}}>
						<Note text="Fragen sind keine Ergebnisse – Antworten bis 27.11. nicht veröffentlicht" top={1196} icon="info" />
					</In>
				</div>
			) : null}
			<Sfx name="softImpact" at={atFest} volume={0.4} />
			<Sfx name="pop" at={atGes} volume={0.4} />
			<Sfx name="stamp" at={atKorr + 8} volume={0.4} />
			<Sfx name="paper" at={atAnf} volume={0.45} />
			<Sfx name="paper" at={atAnf + 8} volume={0.4} />
			<Sfx name="stamp" at={atAntw} volume={0.45} />
		</CityStage>
	);
};

/* ------------------------------------------------------------------ Szene 4: Dresden */

export const DresdenScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const c = cityById('dresden');
	const d1 = cue(cues, 'd1', 0);
	const at80 = wordFrame(cues, 'achtzig', d1.from + 20);
	const atStart = Math.max(REVEAL[1] - 2, at80 - 22);
	const atPers = wordFrame(cues, 'Personalien', at80 + 10) - 4;
	const atVerd = wordFrame(cues, 'Verdacht', atPers + 10) - 4;
	return (
		<CityStage city="dresden" prev="hamburg" tag={DRESDEN.tag} icon="shield" durationInFrames={durationInFrames} pano={<CityPanorama city="dresden" accent={c.color} width={1080} />}>
			<In at={atStart} dy={30} style={{left: LAYOUT.left, top: 720}}>
				<Counter value={c.main.count ?? 0} prefix={c.main.prefix} from={atStart} to={at80} size={124} color={c.color} />
			</In>
			<In at={atStart + 4} dy={20} style={{left: LAYOUT.left, top: 852}}>
				<Label text={DRESDEN.label} size={32} />
			</In>
			{frame >= atStart ? (
				<div style={{position: 'absolute', left: LAYOUT.left, top: 920}}>
					<PersonGrid total={c.main.count ?? 0} cols={20} width={560} fill={interpolate(frame, [atStart, at80], [0, 1], clamp)} base="#B9A8E8" />
				</div>
			) : null}
			<In at={atPers} dx={30} dy={0} style={{left: 660, top: 930}}>
				<div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
					<Pill text="≠ FESTNAHMEN" color={RED} size={26} />
					<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted, maxWidth: 270}}>{DRESDEN.notArrests}</span>
				</div>
			</In>
			<In at={atVerd} dy={20} style={{left: LAYOUT.left, top: 1070}}>
				<Pill text={DRESDEN.suspicion} color={c.color} icon="alert" size={28} />
			</In>
			<In at={atVerd + 10} dy={10} style={{left: 0, top: 0, width: 1080}}>
				<Note text={`${DRESDEN.detail} · mind. 3 Polizisten leicht verletzt`} top={1160} icon="info" />
			</In>
			<Sfx name="softImpact" at={at80} volume={0.4} />
			<Sfx name="pop" at={atPers} volume={0.4} />
			<Sfx name="stamp" at={atVerd} volume={0.4} />
		</CityStage>
	);
};

/* ------------------------------------------------------------------ Szene 5: Stuttgart */

export const StuttgartScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const c = cityById('stuttgart');
	const s1 = cue(cues, 's1', 0);
	const at20 = wordFrame(cues, 'zwanzig', s1.from + 20);
	const atStart = Math.max(REVEAL[1] - 2, at20 - 22);
	const atVorw = wordFrame(cues, 'Vorwürfe', at20 + 20) - 4;
	const chargeAt = [wordFrame(cues, 'Vermummung', atVorw + 6) - 4, wordFrame(cues, 'Beleidigung', atVorw + 14) - 4, wordFrame(cues, 'Widerstand', atVorw + 22) - 4];
	return (
		<CityStage city="stuttgart" prev="dresden" tag={STUTTGART.tag} icon="shield" durationInFrames={durationInFrames} pano={<CityPanorama city="stuttgart" accent={c.color} width={1080} />}>
			<In at={atStart} dy={30} style={{left: LAYOUT.left, top: 720}}>
				<Counter value={c.main.count ?? 0} prefix={c.main.prefix} from={atStart} to={at20} size={124} color={c.color} />
			</In>
			<In at={atStart + 4} dy={20} style={{left: LAYOUT.left, top: 852}}>
				<Label text={STUTTGART.label} size={36} />
				<div style={{marginTop: 4, fontFamily: FONTS.body, fontWeight: 700, fontSize: 23, color: COLORS.textMuted}}>laut Polizei · vorläufig ≠ Haft ≠ Urteil</div>
			</In>
			<In at={atStart + 8} dy={14} style={{left: LAYOUT.left, top: 968}}>
				<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 24, letterSpacing: 2, color: COLORS.textMuted}}>{STUTTGART.head}</span>
			</In>
			{STUTTGART.charges.map((ch, i) => {
				const lit = interpolate(frame, [chargeAt[i], chargeAt[i] + 6], [0, 1], clamp);
				return (
					<In key={ch} at={atStart + 10 + i * 3} dy={20} style={{left: LAYOUT.left + [0, 300, 590][i], top: 1010, opacity: 0.35 + 0.65 * lit, scale: String(1 + 0.08 * Math.sin(Math.min(1, lit) * Math.PI))}}>
						<Pill text={ch} color={lit > 0.5 ? c.color : '#6B7396'} size={27} />
					</In>
				);
			})}
			<In at={chargeAt[2] + 10} dy={10} style={{left: 0, top: 0, width: 1080}}>
				<Note text={`${STUTTGART.note} · laut Polizei „versammlungstypische Straftaten“`} top={1100} icon="info" />
			</In>
			<Sfx name="softImpact" at={at20} volume={0.4} />
			{chargeAt.map((a) => (
				<Sfx key={a} name="click" at={a} volume={0.4} />
			))}
		</CityStage>
	);
};

/* ------------------------------------------------------------------ Szene 6: Berlin (kurzer Kontrast) */

const PeacefulCrowd: React.FC<{top: number}> = ({top}) => {
	const frame = useCurrentFrame();
	return (
		<div style={{position: 'absolute', left: 0, top, width: 1080, height: 70, overflow: 'hidden'}}>
			{new Array(46).fill(0).map((_, i) => {
				const x = ((i * 26 + frame * 0.9) % 1180) - 60;
				const row = i % 3;
				return (
					<svg key={i} width={20} height={34} viewBox="0 0 20 34" style={{position: 'absolute', left: x, top: 10 + row * 12, opacity: 0.85 - row * 0.15}}>
						<circle cx={10} cy={6} r={5} fill="#C9D3F2" />
						<path d="M2 32 Q2 13 10 13 Q18 13 18 32 Z" fill={['#3DDC97', '#4FC3F7', '#B794F6', '#FFD23F'][i % 4]} opacity={0.85} />
					</svg>
				);
			})}
		</div>
	);
};

/** Friedlicher Demonstrationszug (ILLUSTRATION): anonyme Figuren mit leeren Schildern, langsam von links nach rechts. */
const MarchingCrowd: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<div style={{position: 'relative', width: 1080, height: 170, overflow: 'hidden'}}>
			{new Array(30).fill(0).map((_, i) => {
				const row = i % 3;
				const x = ((i * 41 + frame * (1.1 + row * 0.15)) % 1200) - 80;
				const bob = Math.sin(frame / 5 + i) * 2;
				const s = 1.2 - row * 0.15;
				const sign = i % 5 === 0;
				return (
					<svg key={i} width={44 * s} height={86 * s} viewBox="0 0 44 86" style={{position: 'absolute', left: x, top: 60 - row * 26 + bob, opacity: 1 - row * 0.18}}>
						{sign ? (
							<>
								<rect x={6} y={0} width={32} height={20} rx={3} fill="#E8ECFF" />
								<path d="M22 20 L22 40" stroke="#E8ECFF" strokeWidth={3} />
							</>
						) : null}
						<circle cx={22} cy={34} r={9} fill="#C9D3F2" />
						<path d="M6 86 Q6 46 22 46 Q38 46 38 86 Z" fill={['#3DDC97', '#4FC3F7', '#B794F6', '#FFD23F', '#FF9F43'][i % 5]} />
					</svg>
				);
			})}
		</div>
	);
};

export const BerlinScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const c = cityById('berlin');
	const b1 = cue(cues, 'b1', 0);
	const at4000 = wordFrame(cues, 'viertausend', b1.from + 16);
	const atStart = Math.max(REVEAL[1] - 2, at4000 - 18);
	const atFried = wordFrame(cues, 'friedlich', at4000 + 10) - 4;
	return (
		<CityStage
			city="berlin"
			prev="stuttgart"
			tag={BERLIN.tag}
			icon="users"
			durationInFrames={durationInFrames}
			pano={
				<div style={{position: 'relative'}}>
					<CityPanorama city="berlin" accent={c.color} width={1080} />
					<PeacefulCrowd top={520} />
				</div>
			}
		>
			<In at={atStart} dy={30} style={{left: LAYOUT.left, top: 720}}>
				<Counter value={c.main.count ?? 0} prefix={c.main.prefix} from={atStart} to={at4000} size={118} color={c.color} />
			</In>
			<In at={atStart + 4} dy={20} style={{left: LAYOUT.left, top: 846}}>
				<Label text={BERLIN.label} size={34} />
			</In>
			<In at={atStart + 6} dy={20} style={{left: 0, top: 900, width: 1080}}>
				<MarchingCrowd />
			</In>
			<In at={atFried} dy={20} style={{left: LAYOUT.left, top: 1090}}>
				<Pill text={BERLIN.peaceful} color={c.color} icon="check" size={34} solid />
			</In>
			<In at={atFried + 8} dy={10} style={{left: 0, top: 0, width: 1080}}>
				<Note text={`${BERLIN.alt} · keine Ermittlungszahlen veröffentlicht`} top={1186} icon="info" />
			</In>
			<Sfx name="softImpact" at={at4000} volume={0.4} />
			<Sfx name="pop" at={atFried} volume={0.45} />
		</CityStage>
	);
};

/* ------------------------------------------------------------------ Szene 7: Frankfurt (kurz, kein eigenes Dashboard) */

export const FrankfurtScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const c = cityById('frankfurt');
	const f1 = cue(cues, 'f1', 0);
	const at10 = wordFrame(cues, 'zehn', f1.from + 30);
	const at16 = wordFrame(cues, 'sechzehn', at10 + 10);
	const atStart = Math.max(REVEAL[1] - 2, at10 - 18);
	const atEx = wordFrame(cues, 'Exzesse', at16 + 10) - 4;
	return (
		<CityStage
			city="frankfurt"
			prev="berlin"
			tag={FRANKFURT.tag}
			icon="shield"
			durationInFrames={durationInFrames}
			pano={
				<div style={{position: 'relative', height: 760, overflow: 'hidden', background: 'linear-gradient(#060A24 0%, #141A52 60%, #2B2A72 100%)'}}>
					<div style={{position: 'absolute', left: 40, top: 40}}>
						<FrankfurtSkyline width={1000} litRatio={0.55} showRiver showBridge />
					</div>
				</div>
			}
		>
			<In at={atStart} dy={30} style={{left: LAYOUT.left, top: 720}}>
				<div style={{display: 'flex', alignItems: 'flex-end', gap: 14}}>
					<Counter value={c.main.count ?? 0} from={atStart} to={at10} size={124} color={c.color} />
					<span style={{marginBottom: 14, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, color: COLORS.text}}>FESTNAHMEN</span>
				</div>
			</In>
			<In at={at16 - 6} dy={30} style={{left: 520, top: 720}}>
				<div style={{display: 'flex', alignItems: 'flex-end', gap: 14}}>
					<Counter value={c.second?.count ?? 0} from={at16 - 6} to={at16} size={124} color={COLORS.text} />
					<span style={{marginBottom: 14, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, lineHeight: 1, color: COLORS.text}}>
						STRAF-
						<br />
						ANZEIGEN
					</span>
				</div>
			</In>
			<In at={atStart + 6} dy={16} style={{left: LAYOUT.left, top: 862}}>
				<div style={{fontFamily: FONTS.body, fontWeight: 800, fontSize: 25, color: COLORS.text, whiteSpace: 'nowrap'}}>342 Personenkontrollen · 52 Platzverweise · rund 2.900 Kräfte</div>
				<div style={{marginTop: 10}}>
					<Pill text={FRANKFURT.scope} color="#9AA6CC" icon="info" size={22} />
				</div>
			</In>
			<In at={atEx} dy={20} style={{left: LAYOUT.left, top: 990}}>
				<Pill text={FRANKFURT.noRepeat} color={GREEN} icon="check" size={28} />
			</In>
			<In at={atEx + 10} dy={10} style={{left: 0, top: 0, width: 1080}}>
				<Note text={FRANKFURT.halloween} top={1080} icon="clock" />
			</In>
			<Sfx name="softImpact" at={at10} volume={0.4} />
			<Sfx name="softImpact" at={at16} volume={0.35} />
			<Sfx name="pop" at={atEx} volume={0.4} />
		</CityStage>
	);
};

/* ------------------------------------------------------------------ Szene 8: Bundesweites Dashboard */

export const dashboardCards = (): DashboardCard[] =>
	CITIES.map((c) => ({
		id: c.id,
		name: c.name,
		color: c.color,
		illustration: c.id === 'frankfurt' ? <FrankfurtMini height={44} color={c.color} /> : <CityPanorama city={c.id} accent={c.color} height={44} crop={LANDMARK_CROP[c.id]} mono />,
		value: c.main.value,
		count: c.main.count,
		prefix: c.main.prefix,
		label: c.main.label,
		extras: c.extras,
		stand: c.standShort,
		source: c.sourceShort,
	}));

/** Frames im Dashboard, ab denen alles vollständig steht (Aufbau ≈ 1,5 s). */
export const DASHBOARD_BUILD = 46;

export const DashboardScene: React.FC<SceneProps> = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const cam = interpolateCamera(frame, [
		{frame: 0, cam: {...focusCam('frankfurt', 1.2), tilt: 46}},
		{frame: 14, cam: DE_OVERVIEW},
	], EASE_IN_OUT);
	const mapFade = interpolate(frame, [16, 30], [1, 0.16], clamp);
	const from = CITIES.map((c) => {
		const [x, y] = cityXY(c.id);
		const p = projectPlanePoint(DE_OVERVIEW, MAP_ANCHOR, PERSPECTIVE, x, y);
		return [p.x, p.y] as [number, number];
	});
	const appear = CITIES.map((_, i) => springIn({frame, fps, delay: 12 + i * 3, damping: 15, stiffness: 160}));
	const count = interpolate(frame, [14, 40], [0.35, 1], {...clamp, easing: EASE_OUT});
	const head = interpolate(frame, [8, 16], [0, 1], clamp);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<MapBg />
			<AbsoluteFill style={{opacity: mapFade}}>
				<GermanyPlane camera={cam} anchor={MAP_ANCHOR} markers={markers(() => ({on: 1, active: 1, done: 0, label: interpolate(frame, [12, 18], [1, 0], clamp)}), true)} glow={1} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: `linear-gradient(rgba(4,6,20,${0.5 + 0.4 * (1 - mapFade)}) 0%, rgba(4,6,20,${0.2 + 0.5 * (1 - mapFade)}) 40%, rgba(4,6,20,${0.4 + 0.5 * (1 - mapFade)}) 100%)`}} />
			<SceneTag text={DASHBOARD.tag} color={YELLOW} icon="info" />
			<CityDashboard kicker={DASHBOARD.kicker} title={DASHBOARD.title} hint={DASHBOARD.hint} cards={dashboardCards()} appear={appear} count={count} head={head} from={from} />
			<Sfx name="whoosh" at={0} volume={0.4} />
			{CITIES.map((c, i) => (
				<Sfx key={c.id} name="pop" at={16 + i * 3} volume={0.28} />
			))}
			<Sfx name="softImpact" at={42} volume={0.4} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 9: Abo-Aufruf FrankfurtRedNews */

export const OutroScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const c = cue(cues, 'cta', 0);
	const atCta = Math.max(2, c.from - 4);
	const cta = springIn({frame, fps, delay: atCta, damping: 13, stiffness: 180});
	const pull = interpolate(frame, [0, durationInFrames], [0, 1], {...clamp, easing: EASE_OUT});
	const atName = wordFrame(cues, 'FrankfurtRedNews', atCta + 20);
	const press = frame >= atName ? interpolate(frame, [atName, atName + 6, atName + 12], [1, 0.9, 1], clamp) : 1;
	const followed = frame >= atName + 4;
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{scale: String(1.15 - pull * 0.15), transformOrigin: '50% 70%'}}>
				<NightCity mood={MOODS.dusk} progress={pull} litRatio={0.5} showMoon bokeh={16} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.9) 0%, rgba(4,6,20,0.6) 50%, rgba(4,6,20,0.5) 75%, rgba(4,6,20,0.8) 100%)'}} />
			<div style={{position: 'absolute', left: 64, width: 866, top: 470, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, opacity: Math.min(1, 0.35 + cta * 2), translate: `0 ${(1 - cta) * 50}px`}}>
				<div style={{position: 'relative'}}>
					<BrandLogo size={230} ring={6 + Math.sin(frame / 4) * 3} />
					<div style={{position: 'absolute', left: '50%', bottom: -26, translate: '-50% 0', scale: String(press), width: 68, height: 68, borderRadius: 34, background: followed ? GREEN : RED, border: '4px solid #FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 24px rgba(0,0,0,0.5)'}}>
						<P2Icon name={followed ? 'check' : 'plus'} size={38} color="#FFFFFF" stroke={3.4} />
					</div>
				</div>
				<span style={{marginTop: 12, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 54, color: COLORS.text}}>{handleWithAt(NEWS)}</span>
				<div style={{padding: '12px 30px 14px', borderRadius: 20, background: RED, boxShadow: '0 20px 50px rgba(255,59,78,0.35)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 42, color: '#FFFFFF', scale: String(followed ? 1 + 0.035 * Math.sin((frame - atName) / 5) : 1)}}>FOLGEN</div>
				<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 24, letterSpacing: 2.5, color: YELLOW}}>{OUTRO.line}</span>
				<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted}}>{STAND.label}</span>
			</div>
			<Sfx name="pop" at={atCta} volume={0.6} />
			<Sfx name="click" at={atName + 2} volume={0.6} />
		</AbsoluteFill>
	);
};
