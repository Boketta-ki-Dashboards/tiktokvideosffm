import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {FrankfurtSkyline} from '../../../components/backgrounds/FrankfurtSkyline';
import {BrandLogo} from '../../../components/brand/BrandLogo';
import {clamp, EASE_IN_OUT, EASE_OUT, springIn} from '../../../lib/animation';
import {mix, withAlpha} from '../../../lib/color';
import {handleWithAt} from '../../../theme/brand';
import {COLORS, FONTS} from '../../../theme/tokens';
import {type CityMapData} from '../../../components/map/CityStreetMap';
import {CityPlane, cityPlaneXY} from '../../../components/map/CityPlane';
import {interpolateCamera, type PlaneBillboard, type PlaneCamera} from '../../../components/map/TiltedPlane';
import campusMap from '../../../data/maps/frankfurt-campus-westend.json';
import {TopTag} from '../../../formats/frankfurt-erklaert/Branding';
import {SourceBar} from '../../../formats/frankfurt-erklaert/components';
import {ACCENT, FORMAT, LAYOUT} from '../../../formats/frankfurt-erklaert/theme';
import {DayTimeline} from '../../../formats/frankfurt-erklaert/visuals/DayTimeline';
import {blendMood, type Mood, MOODS, NightCity} from '../../frankfurt-2026-11-20-ausblick/premium/NightCity';
import {CalendarBlock, Card, CountUp, IconOrb, P2Icon, type P2IconName, Stars, useSpring} from '../../frankfurt-erklaert-genz-phase2-2026-11-14/scenes/kit';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {BATMAN, CAMPUS, COVER, CTA, DEMANDS, EVENTS, type EventId, GENZ, GEWERK, SCHUL, SOURCES, STAND} from '../content';
import {NOV20_COVER_LAYOUT} from '../cover-layout';
import {BockenheimerDepot, CapeFigure, OfficerFigure, WillyBrandtPlatz} from '../visuals/Illustrations';

const RED = ACCENT.brand;
const BLUE = ACCENT.info;
const EV = Object.fromEntries(EVENTS.map((e) => [e.id, e])) as Record<EventId, (typeof EVENTS)[number]>;
/** Titelbild/Thumbnail unverändert lassen: dort behält der 11-Uhr-Zug seine ursprüngliche Farbe (in den Szenen violett). */
const COVER_EVENTS = EVENTS.map((e) => (e.id === 'campus' ? {...e, color: '#9AA6CC'} : e));

/** Skyline-Farben am Nachmittag (heller als die Nachtpalette). */
const SKY_DAY = {far: '#3A4A8A', mid: '#2C3A78', near: '#24306A', front: '#1A2250', glass: '#34509A', glassHi: '#6A8CDA', light: '#4E60A6', quay: '#161E44', waterTop: '#2A3A7A', waterBottom: '#0C1236'};

/** Nachmittag (14–16:30 Uhr): heller als die Nacht-Stimmungen, kippt zum Ende Richtung Dämmerung. */
const AFTERNOON: Mood = {sky: ['#0E1C4A', '#24407E', '#5A78B2', '#D49A82'], glow: '#FFB07A', hills: '#18244E', band: '#203060', fog: '#7A86B8', lamp: '#FFD27A'};

/* ------------------------------------------------------------------ Kategorie-Chips */

type Kind = 'LAUT STADT' | 'LAUT AUFRUF' | 'LAUT INITIATIVE' | 'LAUT GEW' | 'OFFEN' | 'ILLUSTRATION' | 'GAG' | 'ANGEKÜNDIGT' | 'LAUT YOUNES';
const KIND_COLOR: Record<Kind, string> = {
	'LAUT STADT': BLUE,
	'LAUT AUFRUF': COLORS.signal,
	'LAUT INITIATIVE': COLORS.signal,
	'LAUT GEW': COLORS.signal,
	ANGEKÜNDIGT: COLORS.signal,
	OFFEN: ACCENT.no,
	ILLUSTRATION: '#9AA6CC',
	GAG: ACCENT.law,
	'LAUT YOUNES': '#FF8A3D',
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

/**
 * Orientierungsleiste (chronologische Tages-Timeline) oben in jeder Inhaltsszene – unter der Kopfzeile (Overlay + TopTag, y 272–342).
 * Läuft nur vorwärts: Der gerade erklärte Termin leuchtet, alle früheren tragen einen grünen Haken.
 */
export const STRIP_TOP = 376;
const ORDER: EventId[] = ['schulstreik', 'campus', 'genz', 'gewerkschaft'];
const OrientationStrip: React.FC<{active: EventId | null; allDone?: boolean}> = ({active, allDone}) => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [0, 6], [0.4, 1], clamp);
	const idx = active ? ORDER.indexOf(active) : ORDER.length;
	const done = allDone ? ORDER : ORDER.slice(0, Math.max(0, idx));
	return (
		<div style={{position: 'absolute', left: LAYOUT.left - 14, top: STRIP_TOP - 10, width: LAYOUT.width + 28, padding: '10px 14px 4px', boxSizing: 'border-box', borderRadius: 22, background: 'rgba(6,8,24,0.72)', border: '1.5px solid rgba(255,255,255,0.12)', opacity: o}}>
			<DayTimeline events={EVENTS} width={LAYOUT.width} variant="strip" active={allDone ? null : active} done={done} />
		</div>
	);
};

/** Szenen-Box links oben (gleiche Linie und Höhe wie das Serien-Overlay rechts). */
const SceneTag: React.FC<{text: string; color: string; icon: P2IconName}> = ({text, color, icon}) => (
	<TopTag text={text} color={color} icon={<P2Icon name={icon} size={30} color={ACCENT.ink} stroke={2.6} />} />
);

const TopShade: React.FC<{strength?: number; bottom?: number}> = ({strength = 0.92, bottom = 0.85}) => (
	<AbsoluteFill style={{background: `linear-gradient(rgba(4,6,20,${strength}) 0%, rgba(4,6,20,${strength * 0.85}) 28%, rgba(4,6,20,${strength * 0.35}) 44%, rgba(4,6,20,0) 54%, rgba(4,6,20,0) 62%, rgba(4,6,20,${bottom * 0.7}) 72%, rgba(4,6,20,${bottom}) 100%)`, pointerEvents: 'none'}} />
);

/* ------------------------------------------------------------------ Szene 1: Titelbild = erste Szene */

/**
 * Titelbild (Video-Frame 0 und PNG): Skyline, Serientitel, „4 PROTESTE / 1 FREITAG“, große Tages-Timeline 10:00 · 11:00 · 14:00 · 17:30
 * (Gen Z betont), „FRANKFURT · FREITAG, 20.11.2026“, Chip „4 GETRENNTE VERSAMMLUNGEN · LAUT STADT“, Logo + Account.
 */
export const Nov20Cover: React.FC<{morph?: number; pulse?: readonly number[]; chipBump?: number; thumbnail?: boolean}> = ({morph = 0, pulse, chipBump = 0, thumbnail = false}) => {
	const frame = useCurrentFrame();
	const L = NOV20_COVER_LAYOUT;
	const m = EASE_IN_OUT(Math.min(1, Math.max(0, morph)));
	const text = 1 - Math.min(1, m * 1.6);
	const bob = Math.sin(frame / 26) * 3;
	// Verwandlung: Kamera zoomt auf die erste Markierung (10:00) der Timeline
	const focusX = L.timelineLeft + L.timelineWidth / 8;
	const focusY = L.timelineTop + 98;
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{scale: String(1 + m * 0.1), transformOrigin: '50% 40%'}}>
				<NightCity mood={blendMood(MOODS.dusk, MOODS.calm, 0.25)} progress={0.4 + frame / 2400} litRatio={0.45} bokeh={10} showPromenade={false} showMoon />
			</AbsoluteFill>
			<Stars seed="n20c" n={36} height={380} />
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.5) 0%, rgba(4,6,20,0.12) 15%, rgba(4,6,20,0.25) 24%, rgba(4,6,20,0.7) 34%, rgba(4,6,20,0.9) 48%, rgba(4,6,20,0.92) 70%, rgba(4,6,20,0.82) 100%)'}} />
			<div style={{position: 'absolute', inset: 0, scale: String(1 + m * 1.1), transformOrigin: `${focusX}px ${focusY}px`}}>
				<div style={{opacity: text, translate: `0 ${(1 - text) * -24}px`}}>
					<div style={{position: 'absolute', left: 0, right: 0, top: L.brandTop, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16}}>
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 50, lineHeight: 0.98, color: COLORS.text, textAlign: 'right', textShadow: '0 6px 24px rgba(0,0,0,0.8)'}}>
							FRANKFURT
							<br />
							ERKLÄRT
						</div>
						<div style={{padding: '9px 16px', borderRadius: 10, background: RED, boxShadow: '0 10px 26px rgba(255,59,78,0.4)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, letterSpacing: 3, color: '#FFFFFF'}}>{FORMAT.sub}</div>
					</div>
					<div style={{position: 'absolute', left: 0, right: 0, top: L.big1Top + bob, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: L.bigSize, lineHeight: 1, letterSpacing: -3, color: COLORS.signal, whiteSpace: 'nowrap', textShadow: `0 0 70px ${withAlpha(COLORS.signal, 0.45)}, 0 20px 50px rgba(0,0,0,0.85)`}}>{COVER.big}</div>
					<div style={{position: 'absolute', left: 0, right: 0, top: L.big2Top + bob, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: L.bigSize, lineHeight: 1, letterSpacing: -3, color: COLORS.text, whiteSpace: 'nowrap', textShadow: '0 20px 50px rgba(0,0,0,0.85)'}}>
						{COVER.big2}
						<span style={{color: RED}}>!</span>
					</div>
				</div>
				<div style={{position: 'absolute', left: L.timelineLeft, top: L.timelineTop, opacity: Math.max(text, 1 - m * 0.6)}}>
					<DayTimeline events={COVER_EVENTS} width={L.timelineWidth} size={L.timelineOrb} highlight="genz" pulse={pulse} />
				</div>
				<div style={{opacity: text}}>
					<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.smallTop, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 800, fontSize: 25, letterSpacing: 3, color: withAlpha('#FFFFFF', 0.78)}}>{COVER.small}</div>
					<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.chipTop, display: 'flex', justifyContent: 'center'}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '9px 18px', borderRadius: 16, background: 'rgba(8,10,28,0.92)', border: `2.5px solid ${withAlpha(BLUE, 0.6 + 0.4 * chipBump)}`, boxShadow: `0 0 ${30 * chipBump}px ${withAlpha(BLUE, 0.5)}`, scale: String(1 + 0.06 * Math.sin(chipBump * Math.PI))}}>
							<P2Icon name="users" size={30} color={BLUE} stroke={2.4} />
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, color: COLORS.text, whiteSpace: 'nowrap'}}>{COVER.chip}</span>
							<Chip kind="LAUT STADT" size={17} />
						</div>
					</div>
					<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.metaTop, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14}}>
						<BrandLogo size={52} />
						<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 30, color: COLORS.textMuted}}>{handleWithAt()}</span>
					</div>
					{thumbnail ? (
						<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.questionTop, display: 'flex', justifyContent: 'center'}}>
							<div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderRadius: 16, background: 'rgba(8,10,28,0.92)', border: `2.5px solid ${COLORS.signal}`}}>
								<P2Icon name="clock" size={30} color={COLORS.signal} />
								<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, color: COLORS.text, whiteSpace: 'nowrap'}}>{COVER.question}</span>
							</div>
						</div>
					) : null}
				</div>
			</div>
		</AbsoluteFill>
	);
};

/** Szene 1 – Titelbild im Video (ab Frame 0 vollständig); bei „vier“ hüpfen die vier Markierungen nacheinander, bei „getrennte“ der Chip. */
export const CoverScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const h2 = cue(cues, 'hook2', 30);
	const atGen = wordFrame(cues, 'Gen', h2.from + 30);
	const atVier = wordFrame(cues, 'vier', h2.from + 80);
	const atGetrennt = wordFrame(cues, 'getrennte', atVier + 6);
	const pulse = EVENTS.map((e, i) => {
		const at = atVier - 2 + i * 4;
		const genBump = e.id === 'genz' ? interpolate(frame, [atGen - 2, atGen + 12], [0, 1], clamp) % 1 : 0;
		const v = interpolate(frame, [at, at + 12], [0, 1], clamp);
		return v > 0 && v < 1 ? v : genBump;
	});
	const chipBump = interpolate(frame, [atGetrennt - 2, atGetrennt + 16], [0, 1], clamp);
	const morph = interpolate(frame, [durationInFrames - 24, durationInFrames - 2], [0, 1], clamp);
	return (
		<AbsoluteFill>
			<Nov20Cover morph={morph} pulse={pulse} chipBump={chipBump > 0 && chipBump < 1 ? chipBump : 0} />
			<Sfx name="softImpact" at={0} volume={0.5} />
			<Sfx name="blip" at={atGen} volume={0.4} />
			{EVENTS.map((e, i) => (
				<Sfx key={e.id} name="tick" at={atVier - 2 + i * 4} volume={0.6} />
			))}
			<Sfx name="click" at={atGetrennt} volume={0.45} />
			<Sfx name="whoosh" at={durationInFrames - 22} volume={0.4} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Kopfzeile je Termin */

const EventHeader: React.FC<{id: EventId; at?: number; kicker: string; title: string; titleSize?: number; place: string; kind?: Kind; out?: number}> = ({id, at = 0, kicker, title, titleSize = 74, place, kind = 'LAUT STADT', out = 1}) => {
	const e = EV[id];
	const s = useSpring(at, 14, 190);
	return (
		<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 540, opacity: Math.min(1, s * 1.7) * out, translate: `${(1 - s) * -50}px 0`}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
				<span style={{padding: '6px 14px', borderRadius: 10, background: e.color, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: ACCENT.ink, fontVariantNumeric: 'tabular-nums'}}>{kicker}</span>
				<Chip kind={kind} size={17} />
			</div>
			<div style={{marginTop: 8, fontFamily: FONTS.heading, fontWeight: 900, fontSize: titleSize, lineHeight: 1, letterSpacing: -1.5, color: e.color, textShadow: `0 0 40px ${withAlpha(e.color, 0.45)}, 0 8px 28px rgba(0,0,0,0.9)`, whiteSpace: 'nowrap'}}>{title}</div>
			<div style={{marginTop: 8, display: 'flex', alignItems: 'center', gap: 10}}>
				<P2Icon name="pin" size={34} color={COLORS.text} stroke={2.4} />
				<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 36, color: COLORS.text, textShadow: '0 4px 18px rgba(0,0,0,0.95)', whiteSpace: 'nowrap'}}>{place}</span>
			</div>
		</div>
	);
};

const InfoRow: React.FC<{icon: P2IconName; color: string; title: string; sub?: string; chip?: Kind; width?: number}> = ({icon, color, title, sub, chip, width = LAYOUT.width}) => (
	<Card color={color} style={{width, boxSizing: 'border-box', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 16}} glow={0.25}>
		<IconOrb name={icon} color={color} size={68} />
		<div style={{flex: 1, minWidth: 0}}>
			<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 38, lineHeight: 1.05, color: COLORS.text}}>{title}</div>
			{sub ? <div style={{marginTop: 4, fontFamily: FONTS.body, fontWeight: 700, fontSize: 27, lineHeight: 1.2, color: COLORS.textMuted}}>{sub}</div> : null}
		</div>
		{chip ? <Chip kind={chip} size={16} style={{alignSelf: 'flex-start'}} /> : null}
	</Card>
);

/* ------------------------------------------------------------------ Szene 2: Schulstreik (10 Uhr) */

export const SchulstreikScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const s1 = cue(cues, 's1', 0);
	const s2 = cue(cues, 's2', 200);
	const atWehr = wordFrame(cues, 'Wehrpflicht', s1.from + 90);
	const atAufruf = wordFrame(cues, 'Aufruf', atWehr + 24);
	const atCount = Math.max(atAufruf + 20, s2.from - 4);
	const at1200 = wordFrame(cues, '1.200', atCount + 12);
	const atZiel = wordFrame(cues, 'Ziel', at1200 + 30);
	const cam = interpolate(frame, [0, durationInFrames], [0, 0.6], clamp);
	const crowd = interpolate(frame, [0, 40], [0.15, 1], clamp);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{scale: String(1.04 + cam * 0.05), transformOrigin: '60% 70%'}}>
				<WillyBrandtPlatz cam={cam} crowd={crowd} morning={0.35 + cam * 0.4} />
			</AbsoluteFill>
			<TopShade />
			<SceneTag text="FREITAG · 10:00 UHR" color={EV.schulstreik.color} icon="clock" />
			<OrientationStrip active="schulstreik" />
			<EventHeader id="schulstreik" kicker="10:00–15:00" title="SCHULSTREIK" place="WILLY-BRANDT-PLATZ" />
			<In at={atWehr - 4} dy={30} style={{left: LAYOUT.left, top: 752}}>
				<InfoRow icon="school" color={EV.schulstreik.color} title={`GEGEN DIE WEHRPFLICHT`} sub={frame >= atAufruf - 4 ? SCHUL.topicCall : ' '} chip={frame >= atAufruf - 4 ? 'LAUT AUFRUF' : undefined} />
			</In>
			<In at={atCount} dy={30} style={{left: LAYOUT.left, top: 900}}>
				<div style={{display: 'flex', gap: 14}}>
					<Card color={EV.schulstreik.color} style={{padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 14}} glow={0.3}>
						<P2Icon name="users" size={46} color={EV.schulstreik.color} stroke={2.4} />
						<div>
							<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 56, lineHeight: 1, color: COLORS.text}}>
								BIS ZU <CountUp value={SCHUL.count} at={atCount} dur={Math.max(10, at1200 + 6 - atCount)} />
							</div>
							<div style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 24, color: COLORS.textMuted}}>ANGEMELDET · LAUT STADT</div>
						</div>
					</Card>
					{frame >= atZiel - 4 ? (
						<In at={atZiel - 4} dx={40} dy={0} style={{position: 'relative'}}>
							<Card color={COLORS.signal} style={{padding: '12px 18px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center'}} glow={0.25}>
								<div style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 24, color: COLORS.signal}}>ZIEL →</div>
								<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 36, lineHeight: 1.05, color: COLORS.text, whiteSpace: 'nowrap'}}>CAMPUS WESTEND</div>
							</Card>
						</In>
					) : null}
				</div>
			</In>
			<div style={{position: 'absolute', left: LAYOUT.left, top: 1128}}>
				<Chip kind="ILLUSTRATION" size={16} />
			</div>
			<SourceBar text={SCHUL.source} at={8} />
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="tick" at={2} volume={0.6} />
			<Sfx name="pop" at={atWehr - 4} volume={0.45} />
			<Sfx name="click" at={atAufruf - 4} volume={0.4} />
			<Sfx name="softImpact" at={at1200 + 4} volume={0.55} />
			<Sfx name="click" at={atZiel - 4} volume={0.4} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 3: kleiner Zug am Campus Westend (11 Uhr) */

const CAMPUS_MAP = campusMap as unknown as CityMapData;
const CAMPUS_K = 1.25;

const CampusMarker: React.FC<{title: string; sub: string; color: string; on: number}> = ({title, sub, color, on}) => (
	<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: on, scale: String(0.7 + 0.3 * on), transformOrigin: '50% 100%'}}>
		<div style={{padding: '6px 14px 8px', borderRadius: 14, background: 'rgba(8,10,28,0.95)', border: `3px solid ${color}`, boxShadow: `0 12px 30px rgba(0,0,0,0.55), 0 0 24px ${withAlpha(color, 0.35)}`, textAlign: 'center', whiteSpace: 'nowrap'}}>
			<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 22, letterSpacing: 1.5, color}}>{sub}</div>
			<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 27, color: COLORS.text}}>{title}</div>
		</div>
		<div style={{width: 4, height: 36, background: `linear-gradient(${color}, ${withAlpha(color, 0.1)})`}} />
		<div style={{width: 22, height: 22, borderRadius: 11, marginTop: -6, background: color, border: '3px solid #FFFFFF', boxShadow: `0 0 20px ${withAlpha(color, 0.9)}`}} />
	</div>
);

/** Kleine anonyme Gruppe (Punkte mit Schildern) – wandert schematisch vom Start zum Ziel. */
const MarchDots: React.FC<{color: string}> = ({color}) => {
	const frame = useCurrentFrame();
	return (
		<svg width={120} height={70} viewBox="0 0 120 70" style={{overflow: 'visible'}}>
			{new Array(9).fill(0).map((_, i) => {
				const x = 14 + (i % 5) * 22 + (Math.floor(i / 5) % 2) * 11;
				const y = 40 + Math.floor(i / 5) * 16 + Math.sin(frame / 4 + i) * 1.6;
				return (
					<g key={i}>
						<line x1={x + 4} y1={y - 6} x2={x + 4} y2={y - 22} stroke="#E8E2FF" strokeWidth={2} />
						<rect x={x - 3} y={y - 32} width={14} height={10} rx={2} fill={i % 3 === 0 ? '#FFE08A' : '#F2EDE2'} />
						<circle cx={x} cy={y} r={6} fill={color} stroke="#FFFFFF" strokeWidth={1.5} />
					</g>
				);
			})}
		</svg>
	);
};

export const CampusScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const c1 = cue(cues, 'c1', 0);
	const at11 = wordFrame(cues, '11', c1.from + 10);
	const at75 = wordFrame(cues, '75', at11 + 40);
	const atQuer = wordFrame(cues, 'quer', at75 + 20);
	const atSchul = wordFrame(cues, 'Schulstreik', c1.to - 30);
	const color = EV.campus.color;
	const [sx, sy] = cityPlaneXY(CAMPUS_MAP, CAMPUS_K, CAMPUS.start.at);
	const [ex, ey] = cityPlaneXY(CAMPUS_MAP, CAMPUS_K, CAMPUS.end.at);
	const cam = interpolateCamera(
		frame,
		[
			{frame: 0, cam: {x: sx + 40, y: sy + 30, zoom: 1.35, tilt: 52, rotate: 10}},
			{frame: atQuer - 6, cam: {x: sx + 60, y: sy + 20, zoom: 1.2, tilt: 50, rotate: 6}},
			{frame: atQuer + 40, cam: {x: (sx + ex) / 2, y: (sy + ey) / 2, zoom: 0.95, tilt: 48, rotate: -4}},
			{frame: durationInFrames + 10, cam: {x: (sx + ex) / 2 + 30, y: (sy + ey) / 2, zoom: 0.9, tilt: 50, rotate: -8}},
		],
		EASE_IN_OUT,
	);
	const sOn = interpolate(frame, [2, 12], [0, 1], clamp);
	const draw = interpolate(frame, [atQuer - 4, atQuer + 36], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const eOn = interpolate(frame, [atQuer + 20, atQuer + 32], [0, 1], clamp);
	const walk = interpolate(frame, [atQuer, durationInFrames], [0, 0.85], clamp);
	const wx = sx + (ex - sx) * walk;
	const wy = sy + (ey - sy) * walk;
	const pulse = (frame % 40) / 40;
	const markers: PlaneBillboard[] = [
		{key: 'start', x: sx, y: sy, node: <CampusMarker title={CAMPUS.start.name} sub="START 11:00" color={color} on={sOn} />},
		{key: 'end', x: ex, y: ey, node: <CampusMarker title={CAMPUS.end.name} sub="ZIEL" color={color} on={eOn} />},
		{key: 'march', x: wx, y: wy, node: <div style={{opacity: interpolate(frame, [atQuer - 2, atQuer + 8], [0, 1], clamp)}}><MarchDots color={color} /></div>},
	];
	return (
		<AbsoluteFill style={{backgroundColor: '#080C1F', overflow: 'hidden'}}>
			<AbsoluteFill style={{translate: '0 180px'}}>
				<CityPlane
					map={CAMPUS_MAP}
					k={CAMPUS_K}
					camera={cam as PlaneCamera}
					anchor={[540, 980]}
					floors={4}
					tint="#3A2E7C"
					spots={[
						{at: CAMPUS.start.at, color, radius: 34, on: sOn, pulse},
						{at: CAMPUS.end.at, color, radius: 34, on: eOn, pulse},
					]}
					arrows={[{from: CAMPUS.start.at, to: CAMPUS.end.at, color, draw, width: 7}]}
					markers={markers}
				/>
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.96) 0%, rgba(4,6,20,0.9) 36%, rgba(4,6,20,0.35) 50%, rgba(4,6,20,0) 58%, rgba(4,6,20,0) 74%, rgba(4,6,20,0.75) 86%, rgba(4,6,20,0.92) 100%)', pointerEvents: 'none'}} />
			<SceneTag text="FREITAG · 11:00 UHR" color={color} icon="clock" />
			<OrientationStrip active="campus" />
			<EventHeader id="campus" kicker="11:00–13:30" title="KLEINER ZUG" place="CAMPUS WESTEND" />
			<In at={Math.max(4, at11 - 4)} dy={24} style={{left: LAYOUT.left, top: 752}}>
				<Card color={color} style={{width: LAYOUT.width, boxSizing: 'border-box', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 18}} glow={0.25}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 84, lineHeight: 1, color: COLORS.text, minWidth: 120, textAlign: 'center'}}>
						<CountUp value={CAMPUS.count} at={Math.max(4, at11 - 4)} dur={Math.max(10, at75 + 4 - Math.max(4, at11 - 4))} />
					</div>
					<div style={{flex: 1}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, color: COLORS.text}}>ANGEMELDET</span>
							<Chip kind="LAUT STADT" size={15} />
						</div>
						<div style={{marginTop: 4, fontFamily: FONTS.body, fontWeight: 700, fontSize: 27, color: COLORS.textMuted}}>Anmeldung: {CAMPUS.by}</div>
						<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 25, color: COLORS.textMuted}}>Demozug quer über den Campus</div>
					</div>
				</Card>
			</In>
			<In at={atSchul - 4} dy={18} style={{left: LAYOUT.left, top: 912}}>
				<div style={{display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 16px', borderRadius: 14, background: 'rgba(8,10,28,0.92)', border: `2px solid ${withAlpha(EV.schulstreik.color, 0.8)}`}}>
					<P2Icon name="school" size={28} color={EV.schulstreik.color} />
					<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 26, color: COLORS.text}}>{CAMPUS.link}</span>
				</div>
			</In>
			<div style={{position: 'absolute', left: LAYOUT.left, top: 1150, display: 'flex', alignItems: 'center', gap: 10, padding: '4px 12px', borderRadius: 10, background: 'rgba(8,10,28,0.85)'}}>
				<P2Icon name="info" size={22} color={COLORS.textMuted} />
				<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted}}>{CAMPUS.mapNote}</span>
			</div>
			<SourceBar text={CAMPUS.source} at={6} />
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="tick" at={2} volume={0.6} />
			<Sfx name="blip" at={4} volume={0.45} />
			<Sfx name="softImpact" at={at75 + 2} volume={0.5} />
			<Sfx name="whoosh" at={atQuer - 4} volume={0.3} />
			<Sfx name="blip" at={atQuer + 22} volume={0.45} />
			<Sfx name="click" at={atSchul - 4} volume={0.4} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 3: Gewerkschaftsjugend (17:30, Bockenheimer Depot) */

export const GewerkschaftScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const g1 = cue(cues, 'g1', 0);
	const g2 = cue(cues, 'g2', 160);
	const atDepot = wordFrame(cues, 'Bockenheimer', g1.from + 40);
	const atWehr = wordFrame(cues, 'Wehrpflicht', atDepot + 30);
	const atRoute = wordFrame(cues, 'Route', g2.from + 4);
	const cam = interpolate(frame, [0, durationInFrames], [0, 1], clamp);
	const lights = interpolate(frame, [0, 24], [0.3, 1], clamp);
	const stamp = useSpring(atRoute, 10, 220);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{translate: '0 120px'}}>
				<BockenheimerDepot cam={cam} crowd={interpolate(frame, [0, 30], [0.2, 1], clamp)} lights={lights} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.95) 0%, rgba(4,6,20,0.88) 24%, rgba(4,6,20,0.25) 38%, rgba(4,6,20,0) 46%, rgba(4,6,20,0) 66%, rgba(4,6,20,0.75) 76%, rgba(4,6,20,0.9) 100%)'}} />
			<SceneTag text="FREITAG · 17:30 UHR" color={EV.gewerkschaft.color} icon="clock" />
			<OrientationStrip active="gewerkschaft" />
			<EventHeader id="gewerkschaft" kicker="17:30–21:30" title="GEWERKSCHAFTSJUGEND" titleSize={56} place="AM BOCKENHEIMER DEPOT" />
			<In at={atWehr - 4} style={{left: LAYOUT.left, top: 1000}}>
				<Card color={EV.gewerkschaft.color} style={{width: LAYOUT.width, boxSizing: 'border-box', padding: '12px 20px'}} glow={0.25}>
					<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
						<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 22, letterSpacing: 1.5, color: EV.gewerkschaft.color}}>MOTTO</span>
						<Chip kind="LAUT STADT" size={15} />
						<span style={{marginLeft: 'auto', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 24, color: COLORS.text}}>{GEWERK.count}</span>
					</div>
					<div style={{marginTop: 4, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 32, lineHeight: 1.12, color: COLORS.text}}>{GEWERK.motto}</div>
				</Card>
			</In>
			{frame >= atRoute - 1 ? (
				<div style={{position: 'absolute', right: 150, top: 830, opacity: Math.min(1, stamp * 2), scale: String(1.6 - 0.6 * stamp), rotate: '-6deg'}}>
					<div style={{padding: '10px 18px', borderRadius: 14, border: `5px solid ${ACCENT.no}`, background: 'rgba(20,6,12,0.88)', boxShadow: `0 0 40px ${withAlpha(ACCENT.no, 0.35)}`}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
							<P2Icon name="route" size={40} color={ACCENT.no} stroke={2.6} />
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 38, color: COLORS.text, whiteSpace: 'nowrap'}}>{GEWERK.route}</span>
						</div>
						<div style={{display: 'flex', alignItems: 'center', gap: 8, marginTop: 6}}>
							<Chip kind="OFFEN" size={15} />
							<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted}}>{GEWERK.routeNote}</span>
						</div>
					</div>
				</div>
			) : null}
			<div style={{position: 'absolute', left: 0, right: 0, top: 1120, height: 150, background: 'linear-gradient(rgba(4,6,20,0), rgba(4,6,20,0.85) 25%, rgba(4,6,20,0.85) 75%, rgba(4,6,20,0))'}} />
			<div style={{position: 'absolute', left: LAYOUT.left, top: 1146}}>
				<Chip kind="ILLUSTRATION" size={16} />
			</div>
			<SourceBar text={GEWERK.source} at={8} />
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="tick" at={2} volume={0.6} />
			<Sfx name="blip" at={atDepot} volume={0.4} />
			<Sfx name="pop" at={atWehr - 4} volume={0.45} />
			<Sfx name="stamp" at={atRoute + 2} volume={0.6} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 4: Gen Z regelt (14 Uhr, Weseler Werft laut Stadt) */

export const GenZScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const z2 = cue(cues, 'z2', 80);
	const atGen = wordFrame(cues, 'Gen', 30);
	const atStatt = wordFrame(cues, 'Statt', z2.from);
	const atWeseler = wordFrame(cues, 'Weseler', atStatt + 70);
	const at1630 = wordFrame(cues, '16:30', atWeseler + 24);
	const atErw = wordFrame(cues, 'erwartet', at1630 + 20);
	const at4000 = wordFrame(cues, '4.000', atErw + 25);
	const dusk = interpolate(frame, [at1630 - 6, at1630 + 50], [0, 0.85], clamp);
	const mood = blendMood(AFTERNOON, MOODS.dusk, dusk);
	const drift = interpolate(frame, [0, durationInFrames], [0, 1]);
	const title = springIn({frame, fps, delay: 0, damping: 14, stiffness: 190});
	const genPop = interpolate(frame, [atGen - 2, atGen + 10], [0, 1], clamp);
	const pin = useSpring(atWeseler - 4, 10, 200);
	// Skyline (Main Tower, Commerzbank Tower …): Uferlinie G = 820 im Viewbox → bei Breite 1180 auf y ≈ 1160
	const skyW = 1180;
	const k = skyW / 1400;
	const skyLeft = 120 - drift * 30;
	const skyTop = 469 + (1 - title) * 30;
	// Weseler Werft: Nordufer (Seite der Skyline), östlich der Innenstadt → rechts; Lage schematisch
	const pinX = 860;
	const pinY = skyTop + 826 * k;
	const sunY = interpolate(dusk, [0, 0.85], [820, 1010]);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{background: `linear-gradient(${mood.sky[0]} 0%, ${mood.sky[1]} 32%, ${mood.sky[2]} 48%, ${mood.sky[3]} 60%, ${mood.sky[3]} 100%)`}} />
			<div style={{position: 'absolute', left: 900 - 260, top: sunY - 260, width: 520, height: 520, borderRadius: '50%', background: `radial-gradient(circle, ${withAlpha('#FFD9A0', 0.55)} 0%, ${withAlpha('#FF9A6A', 0.18)} 35%, rgba(0,0,0,0) 70%)`}} />
			<div style={{position: 'absolute', left: 900 - 34, top: sunY - 34, width: 68, height: 68, borderRadius: 34, background: '#FFE6B8', opacity: 0.85}} />
			<div style={{position: 'absolute', left: skyLeft, top: skyTop}}>
				<FrankfurtSkyline width={skyW} litRatio={0.12 + dusk * 0.35} palette={SKY_DAY} />
			</div>
			{/* links neben dem Skyline-Bild: Main + Ufer fortsetzen */}
			<div style={{position: 'absolute', left: 0, width: skyLeft + 24, top: skyTop + 812 * k, height: 12 * k, background: SKY_DAY.quay}} />
			<div style={{position: 'absolute', left: 0, width: skyLeft + 24, top: skyTop + 824 * k, height: 276 * k, background: `linear-gradient(${SKY_DAY.waterTop}, ${SKY_DAY.waterBottom})`}} />
			{/* unter dem Skyline-Bild: dunkles Wasser bis zum Bildrand */}
			<div style={{position: 'absolute', left: 0, right: 0, top: skyTop + 1090 * k, bottom: 0, background: 'linear-gradient(#0C1236, #070A20)'}} />
			<TopShade strength={0.9} bottom={0.55} />
			<SceneTag text="FREITAG · 14:00 UHR" color={RED} icon="clock" />
			<OrientationStrip active="genz" />
			{/* Titel */}
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 536, opacity: Math.min(1, title * 1.7), translate: `0 ${(1 - title) * 30}px`}}>
				<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 96, lineHeight: 0.98, letterSpacing: -2, color: RED, scale: String(1 + 0.05 * Math.sin(genPop * Math.PI)), transformOrigin: '0% 50%', textShadow: `0 0 50px ${withAlpha(RED, 0.5)}, 0 10px 30px rgba(0,0,0,0.9)`, whiteSpace: 'nowrap'}}>GEN Z REGELT</div>
				<div style={{marginTop: 6, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 46, color: COLORS.text, textShadow: '0 6px 20px rgba(0,0,0,0.9)', whiteSpace: 'nowrap'}}>20.11.2026 · 14:00 UHR</div>
			</div>
			{/* linke Spalte: stationäre Kundgebung · Uhrzeit · bis zu 4.000 */}
			<In at={atStatt - 4} dx={-40} dy={0} style={{left: LAYOUT.left, top: 724}}>
				<Card color={RED} style={{width: 500, boxSizing: 'border-box', padding: '10px 18px'}} glow={0.3}>
					<div style={{display: 'flex', alignItems: 'center', gap: 8}}>
						<Chip kind="LAUT STADT" size={15} />
						<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted, textDecoration: 'line-through'}}>Demozug</span>
					</div>
					<div style={{marginTop: 2, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 36, lineHeight: 1.04, color: COLORS.text, whiteSpace: 'nowrap'}}>STATIONÄRE KUNDGEBUNG</div>
				</Card>
			</In>
			<In at={at1630 - 4} dx={-40} dy={0} style={{left: LAYOUT.left, top: 846}}>
				<Card color={COLORS.signal} style={{width: 500, boxSizing: 'border-box', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: 12}} glow={0.25}>
					<P2Icon name="clock" size={44} color={COLORS.signal} stroke={2.4} />
					<div>
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 36, color: COLORS.text, fontVariantNumeric: 'tabular-nums'}}>14:00–16:30 UHR</div>
						<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted}}>endet vor Einbruch der Dunkelheit</div>
					</div>
				</Card>
			</In>
			<In at={atErw - 4} dx={-40} dy={0} style={{left: LAYOUT.left, top: 958}}>
				<Card color={RED} style={{width: 500, boxSizing: 'border-box', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 12, overflow: 'hidden'}} glow={0.35}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 24, lineHeight: 1, color: COLORS.textMuted, textAlign: 'right'}}>
						BIS
						<br />
						ZU
					</div>
					<CountUp value={4000} at={atErw - 4} dur={Math.max(10, at4000 + 4 - (atErw - 4))} style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 68, lineHeight: 1, color: COLORS.text, textShadow: `0 0 30px ${withAlpha(RED, 0.6)}`}} />
					<div>
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 27, color: RED}}>ERWARTET</div>
						<Chip kind="LAUT STADT" size={14} />
					</div>
				</Card>
			</In>
			{/* Ortsmarke am Nordufer (schematisch) */}
			{frame >= atWeseler - 5 ? (
				<div style={{position: 'absolute', left: pinX, top: pinY, opacity: Math.min(1, pin * 2)}}>
					<div style={{position: 'absolute', left: -60 * pin, top: -12 * pin, width: 120 * pin, height: 24 * pin, borderRadius: '50%', border: `3px solid ${withAlpha(RED, 0.85)}`, background: withAlpha(RED, 0.25)}} />
					<div style={{position: 'absolute', left: -26, top: -78 - (1 - pin) * 120}}>
						<svg width={52} height={78} viewBox="0 0 24 36">
							<path d="M12 35s-11-12-11-21a11 11 0 0 1 22 0c0 9-11 21-11 21z" fill={RED} stroke="#FFFFFF" strokeWidth={1.6} />
							<circle cx={12} cy={13} r={4.2} fill="#FFFFFF" />
						</svg>
					</div>
					<div style={{position: 'absolute', right: -50, top: -214, opacity: Math.min(1, pin * 1.5), translate: `0 ${(1 - pin) * 20}px`}}>
						<div style={{padding: '8px 14px', borderRadius: 14, background: 'rgba(8,10,28,0.94)', border: `2.5px solid ${RED}`, textAlign: 'right'}}>
							<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 32, color: COLORS.text, whiteSpace: 'nowrap'}}>WESELER WERFT</div>
							<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, lineHeight: 1.2, color: COLORS.textMuted, whiteSpace: 'nowrap'}}>
								laut Stadt · am Main
								<br />
								Lage schematisch
							</div>
						</div>
					</div>
				</div>
			) : null}
			<div style={{position: 'absolute', left: LAYOUT.left, top: 1146}}>
				<Chip kind="ILLUSTRATION" size={16} />
			</div>
			<SourceBar text="Quelle: Stadt Frankfurt laut t-online (17.11.) · genz-regelt.de: „Standort folgt“ (17.11.)" at={8} />
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="tick" at={2} volume={0.6} />
			<Sfx name="softImpact" at={atGen} volume={0.5} />
			<Sfx name="click" at={atStatt - 4} volume={0.45} />
			<Sfx name="blip" at={atWeseler - 2} volume={0.55} />
			<Sfx name="tick" at={at1630 - 4} volume={0.6} />
			<Sfx name="pop" at={atErw - 4} volume={0.4} />
			<Sfx name="softImpact" at={at4000 + 4} volume={0.6} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 5: Forderungen laut Initiative */

/** Animierte Mini-Illustrationen der vier Forderungen (eigene Zeichnung). */
const DemandArt: React.FC<{id: (typeof DEMANDS)[number]['id']; color: string; on: number; strike?: number}> = ({id, color, on, strike = 0}) => {
	const frame = useCurrentFrame();
	const p = {fill: 'none', stroke: color, strokeWidth: 5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
	const t = frame / 30;
	return (
		<svg width={150} height={130} viewBox="0 0 150 130" style={{overflow: 'visible'}}>
			<circle cx={75} cy={65} r={58} fill={withAlpha(color, 0.12)} stroke={withAlpha(color, 0.35)} strokeWidth={2} />
			{id === 'bildung' ? (
				<g>
					<path d="M30 48 75 28l45 20-45 20z" {...p} fill={withAlpha(color, 0.25)} />
					<path d="M47 58v20c16 12 40 12 56 0V58" {...p} />
					<path d="M120 48v26" {...p} />
					<circle cx={120} cy={78 + Math.sin(t * 4) * 3} r={5} fill={color} />
				</g>
			) : id === 'gesundheit' ? (
				<g>
					<path d="M75 100s-38-22-38-48a20 20 0 0 1 38-9 20 20 0 0 1 38 9c0 26-38 48-38 48z" {...p} fill={withAlpha(color, 0.2)} style={{scale: String(1 + 0.06 * Math.max(0, Math.sin(t * 7))), transformOrigin: '75px 65px'}} />
					<path d="M22 66h28l8-16 10 30 8-20 6 6h46" {...p} strokeWidth={4} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - Math.min(1, on * 1.4)} />
				</g>
			) : id === 'leben' ? (
				<g>
					<path d="M30 40h12l12 46h52l10-34H48" {...p} />
					<circle cx={60} cy={100} r={6} fill={color} />
					<circle cx={98} cy={100} r={6} fill={color} />
					<g transform={`translate(0 ${-Math.abs(Math.sin(t * 3)) * 10})`}>
						<circle cx={84} cy={34} r={15} fill={withAlpha(color, 0.3)} stroke={color} strokeWidth={4} />
						<text x={84} y={41} textAnchor="middle" fontFamily={FONTS.heading} fontWeight={900} fontSize={20} fill={color}>
							€
						</text>
					</g>
				</g>
			) : (
				<g>
					<path d="M38 80c0-26 16-42 37-42s37 16 37 42z" {...p} fill={withAlpha(color, 0.2)} />
					<path d="M30 80h90M75 38v-8" {...p} />
					<line x1={34} y1={110} x2={34 + 82 * strike} y2={110 - 82 * strike} stroke={ACCENT.no} strokeWidth={8} strokeLinecap="round" />
				</g>
			)}
		</svg>
	);
};

export const DemandsScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const z3 = cue(cues, 'z3', 0);
	const at = {
		bildung: wordFrame(cues, 'Bildung', z3.from + 30),
		gesundheit: wordFrame(cues, 'Gesundheit', z3.from + 50),
		leben: wordFrame(cues, 'bezahlbares', z3.from + 70),
		wehrpflicht: wordFrame(cues, 'Wehrpflicht', z3.from + 130),
	};
	const atSpar = wordFrame(cues, 'Sparkurs', at.wehrpflicht + 16);
	const drift = interpolate(frame, [0, durationInFrames], [0, 1]);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{translate: '0 -120px', scale: String(1.1 - drift * 0.04), transformOrigin: '50% 80%', opacity: 0.55}}>
				<NightCity mood={blendMood(AFTERNOON, MOODS.dusk, 0.55)} progress={0.55 + drift * 0.2} litRatio={0.3} bokeh={8} showPromenade={false} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.95) 0%, rgba(4,6,20,0.85) 30%, rgba(4,6,20,0.7) 60%, rgba(4,6,20,0.92) 100%)'}} />
			<SceneTag text="GEN Z REGELT · WOFÜR?" color={RED} icon="megaphone" />
			<OrientationStrip active="genz" />
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 540, display: 'flex', alignItems: 'center', gap: 14}}>
				<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 60, color: COLORS.text, whiteSpace: 'nowrap'}}>DIE FORDERUNGEN</span>
				<Chip kind="LAUT INITIATIVE" size={17} />
			</div>
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 640, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18}}>
				{DEMANDS.map((d, i) => {
					const a = at[d.id] - 4;
					const on = interpolate(frame, [a, a + 14], [0, 1], {...clamp, easing: EASE_OUT});
					const strike = d.id === 'wehrpflicht' ? interpolate(frame, [a + 4, a + 16], [0, 1], clamp) : 0;
					const spar = d.id === 'wehrpflicht' ? interpolate(frame, [atSpar - 3, atSpar + 8], [0, 1], clamp) : 0;
					return (
						<div key={d.id} style={{opacity: 0.18 + 0.82 * on, scale: String(0.88 + 0.12 * on), rotate: `${(1 - on) * (i % 2 ? 4 : -4)}deg`}}>
							<Card color={d.color} style={{height: 250, boxSizing: 'border-box', padding: '12px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center'}} glow={0.15 + 0.25 * on}>
								<DemandArt id={d.id} color={d.color} on={on} strike={strike} />
								<div style={{marginTop: 6, fontFamily: FONTS.heading, fontWeight: 900, fontSize: d.title.length > 14 ? 30 : 36, lineHeight: 1.02, color: COLORS.text, textAlign: 'center', whiteSpace: 'nowrap'}}>{d.title}</div>
								<div style={{marginTop: 4, fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: d.id === 'wehrpflicht' && spar > 0 ? mix('#AEB6D3', COLORS.signal, spar) : COLORS.textMuted, textAlign: 'center', whiteSpace: 'nowrap'}}>{d.sub}</div>
							</Card>
						</div>
					);
				})}
			</div>
			<SourceBar text="Quelle: genz-regelt.de („Was wir fordern“) · Abruf 17.11.2026" at={8} />
			<Sfx name="whoosh" at={0} volume={0.3} />
			{DEMANDS.map((d) => (
				<Sfx key={d.id} name="pop" at={at[d.id] - 4} volume={0.45} />
			))}
			<Sfx name="click" at={atSpar - 3} volume={0.4} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 6: Auflagen für alle vier */

const RuleIcon: React.FC<{kind: 'pyro' | 'glass' | 'mask'; on: number}> = ({kind, on}) => {
	const p = {fill: 'none', stroke: '#FFFFFF', strokeWidth: 4.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
	return (
		<svg width={96} height={96} viewBox="0 0 96 96">
			<circle cx={48} cy={48} r={42} fill={withAlpha(ACCENT.no, 0.16)} stroke={ACCENT.no} strokeWidth={6} />
			{kind === 'pyro' ? (
				<g>
					<path d="M48 76V54M40 54h16M48 54c-10-8-10-20 0-32 10 12 10 24 0 32z" {...p} />
					<path d="M30 30l4 4M66 30l-4 4M48 16v3" {...p} />
				</g>
			) : kind === 'glass' ? (
				<g>
					<path d="M42 18h12v12c6 3 8 8 8 14v30H34V44c0-6 2-11 8-14z" {...p} />
					<path d="M34 50h28" {...p} />
				</g>
			) : (
				<g>
					<path d="M24 40c0-12 10-20 24-20s24 8 24 20v8c0 14-10 26-24 26S24 62 24 48z" {...p} />
					<path d="M24 48h48M34 40h8M54 40h8" {...p} />
				</g>
			)}
			<line x1={20} y1={76} x2={20 + 56 * on} y2={76 - 56 * on} stroke={ACCENT.no} strokeWidth={7} strokeLinecap="round" />
		</svg>
	);
};

export const RulesScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const z4 = cue(cues, 'z4', 0);
	const atVier = wordFrame(cues, 'vier', z4.from + 10);
	const ats = [wordFrame(cues, 'Pyro', z4.from + 34), wordFrame(cues, 'Alkohol', z4.from + 56), wordFrame(cues, 'Vermummung', z4.from + 80)];
	const kinds = ['pyro', 'glass', 'mask'] as const;
	const pulseAll = interpolate(frame, [atVier - 4, atVier + 20], [0, 1], clamp);
	const drift = interpolate(frame, [0, durationInFrames], [0, 1]);
	return (
		<AbsoluteFill style={{backgroundColor: '#060920', overflow: 'hidden'}}>
			<AbsoluteFill style={{background: `radial-gradient(ellipse 70% 40% at ${40 + drift * 20}% 55%, ${withAlpha(BLUE, 0.16)}, rgba(0,0,0,0) 70%), linear-gradient(#0C1036, #05071A)`}} />
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: 0.12}}>
				{new Array(24).fill(0).map((_, i) => (
					<line key={i} x1={0} y1={i * 84 + drift * 84} x2={1080} y2={i * 84 + drift * 84} stroke="#6A7BD8" strokeWidth={1} />
				))}
			</svg>
			<SceneTag text="AUFLAGEN DER STADT" color={BLUE} icon="shield" />
			<div style={{position: 'absolute', left: LAYOUT.left, top: 380}}>
				<DayTimeline events={EVENTS} width={LAYOUT.width} size={64} done={ORDER} pulse={EVENTS.map((_, i) => interpolate(pulseAll, [i * 0.15, i * 0.15 + 0.4], [0, 1], clamp))} />
			</div>
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 600, display: 'flex', alignItems: 'center', gap: 14}}>
				<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 58, color: COLORS.text, whiteSpace: 'nowrap'}}>FÜR ALLE VIER GILT:</span>
				<Chip kind="LAUT STADT" size={17} />
			</div>
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 690, display: 'flex', flexDirection: 'column', gap: 14}}>
				{GENZ.rules.map((r, i) => {
					const a = ats[i] - 4;
					const s = interpolate(frame, [a, a + 8], [0, 1], {...clamp, easing: EASE_OUT});
					return (
						<div key={r} style={{opacity: 0.15 + 0.85 * s, scale: String(1.25 - 0.25 * s), transformOrigin: '20% 50%'}}>
							<Card color={ACCENT.no} style={{padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 20}} glow={0.2 * s}>
								<RuleIcon kind={kinds[i]} on={s} />
								<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 44, color: COLORS.text, whiteSpace: 'nowrap'}}>{r}</span>
							</Card>
						</div>
					);
				})}
			</div>
			<In at={ats[2] + 6} dy={16} style={{left: LAYOUT.left, top: 1078, width: LAYOUT.width}}>
				<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 25, lineHeight: 1.25, color: COLORS.textMuted}}>außerdem u. a.: keine Hunde, nichts abbrennen, Transparente höchstens 2 m</div>
			</In>
			<SourceBar text="Quelle: Stadt Frankfurt laut t-online (17.11.2026)" at={6} />
			<Sfx name="click" at={0} volume={0.35} />
			{EVENTS.map((e, i) => (
				<Sfx key={e.id} name="tick" at={atVier - 4 + i * 4} volume={0.55} />
			))}
			{ats.map((a, i) => (
				<Sfx key={i} name="stamp" at={a - 2} volume={0.5} />
			))}
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 8: Batman – Younes' eigene TikTok-Erzählung */

const VIOLET = ACCENT.law;
const ORANGE = '#FF8A3D';

/** Eigenes kleines Masken-Symbol (Kostüm-Maske mit kurzen Ohren) – bewusst KEIN Fledermaus-Logo. */
const MaskGlyph: React.FC<{size: number; color?: string}> = ({size, color = '#FFF4C8'}) => (
	<svg width={size} height={size * 0.62} viewBox="0 0 100 62">
		<path d="M6 30 Q8 10 24 8 L30 0 L36 10 H64 L70 0 L76 8 Q92 10 94 30 Q92 52 70 54 Q58 54 50 44 Q42 54 30 54 Q8 52 6 30 Z" fill={color} />
		<path d="M24 28 Q30 22 40 28 Q32 36 24 28 Z M60 28 Q70 22 76 28 Q68 36 60 28 Z" fill="#141A3A" />
	</svg>
);

/** Stilisiertes Wohnhaus bei Nacht (Illustration), ein Fenster warm erleuchtet. */
const ApartmentBlock: React.FC<{lit: number}> = ({lit}) => {
	const frame = useCurrentFrame();
	return (
		<svg width={560} height={760} viewBox="0 0 560 760" style={{overflow: 'visible'}}>
			<rect x={40} y={60} width={480} height={700} fill="#161C42" />
			<rect x={40} y={60} width={480} height={18} fill="#232B5C" />
			<rect x={20} y={44} width={520} height={20} fill="#0E1332" />
			{new Array(5).fill(0).map((_, r) =>
				new Array(4).fill(0).map((__, c) => {
					const key = r * 4 + c;
					const special = r === 3 && c === 2;
					const on = special ? lit : ((key * 37) % 7) / 10;
					return <rect key={key} x={80 + c * 110} y={110 + r * 118} width={70} height={80} rx={4} fill={special ? mix('#2A3366', '#FFD27A', lit * (0.85 + 0.15 * Math.sin(frame / 5))) : mix('#20285A', '#FFE3A0', on > 0.45 ? 0.55 : 0)} />;
				}),
			)}
			<rect x={235} y={640} width={90} height={120} rx={6} fill="#3A2A22" />
			<rect x={225} y={630} width={110} height={12} fill="#2A3366" />
			<circle cx={280} cy={620} r={10} fill="#FFE3A0" opacity={0.9} />
		</svg>
	);
};

/** 2,5D-Wohnungstür (Illustration): Rahmen mit Tiefe, Türblatt mit Kassetten, Spion, Klingel, Deckenlicht, Fußmatte. */
const Door25D: React.FC<{ring: number}> = ({ring}) => {
	const frame = useCurrentFrame();
	const press = ring > 0 && ring < 1 ? Math.sin(ring * Math.PI) : 0;
	return (
		<div style={{position: 'relative', width: 560, height: 760, perspective: 1400}}>
			{/* Lichtkegel */}
			<div style={{position: 'absolute', left: 80, top: -40, width: 400, height: 820, background: 'radial-gradient(ellipse 50% 60% at 50% 0%, rgba(255,226,170,0.32), rgba(255,226,170,0) 70%)'}} />
			<div style={{position: 'absolute', left: 90, top: 60, width: 380, height: 640, transformStyle: 'preserve-3d', rotate: '0deg', transform: 'rotateY(-16deg)'}}>
				{/* Rahmen-Tiefe (gestapelte Ebenen) */}
				{[0, 1, 2, 3].map((i) => (
					<div key={i} style={{position: 'absolute', inset: -22, borderRadius: 6, background: i === 3 ? '#C9B79A' : '#8E7B62', transform: `translateZ(${-6 - i * 6}px)`, opacity: 0.9}} />
				))}
				<div style={{position: 'absolute', inset: -22, borderRadius: 6, background: 'linear-gradient(90deg, #D8C8AA, #BBA886)', transform: 'translateZ(0px)'}} />
				{/* Türblatt */}
				<div style={{position: 'absolute', inset: 0, borderRadius: 4, background: 'linear-gradient(100deg, #6A4630 0%, #5A3A26 60%, #4A2E1E 100%)', boxShadow: 'inset 0 0 40px rgba(0,0,0,0.45)', transform: 'translateZ(2px)'}}>
					{[0, 1].map((r) => (
						<div key={r} style={{position: 'absolute', left: 44, right: 44, top: 50 + r * 290, height: 240, borderRadius: 6, border: '5px solid #3E2618', boxShadow: 'inset 0 0 18px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.08)'}} />
					))}
					<div style={{position: 'absolute', left: '50%', top: 130, width: 18, height: 18, marginLeft: -9, borderRadius: 9, background: '#C9C2B0', border: '3px solid #2A1A10'}} />
					<div style={{position: 'absolute', right: 34, top: 330, width: 64, height: 18, borderRadius: 9, background: 'linear-gradient(#E8D9A8, #B39A5A)', boxShadow: '0 4px 8px rgba(0,0,0,0.5)'}} />
				</div>
			</div>
			{/* Klingel an der Wand rechts */}
			<div style={{position: 'absolute', left: 498, top: 360, width: 40, height: 70, borderRadius: 8, background: '#2A3150', border: '2px solid #4A5280', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<div style={{width: 20, height: 20, borderRadius: 10, background: press > 0 ? '#FFE3A0' : '#9AA6CC', scale: String(1 - 0.2 * press), boxShadow: press > 0 ? `0 0 ${24 * press}px #FFE3A0` : 'none'}} />
			</div>
			{/* Klingel-Wellen */}
			{ring > 0 && ring < 1
				? [0, 1, 2].map((i) => {
						const t = (ring * 2 + i * 0.33) % 1;
						return <div key={i} style={{position: 'absolute', left: 518 - 30 - t * 60, top: 395 - 30 - t * 60, width: 60 + t * 120, height: 60 + t * 120, borderRadius: '50%', border: `3px solid ${withAlpha('#FFE3A0', 0.7 * (1 - t))}`}} />;
					})
				: null}
			{/* Fußmatte */}
			<div style={{position: 'absolute', left: 150, top: 716, width: 280, height: 34, borderRadius: 6, background: '#3A3A46', transform: 'perspective(400px) rotateX(55deg)', opacity: 0.9}} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 740 + Math.sin(frame / 30) * 0, height: 30, background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0))'}} />
		</div>
	);
};

/** Stilisiertes Smartphone mit eigener Nachbildung seines Videos (kein Screenshot, keine Logos, kein Gesicht). */
const PhoneHausarrest: React.FC<{on: number}> = ({on}) => {
	const frame = useCurrentFrame();
	const W = 350;
	const H = 700;
	return (
		<div style={{position: 'relative', width: W, height: H, borderRadius: 52, background: '#0A0C16', border: '6px solid #2C3254', boxShadow: '0 40px 90px rgba(0,0,0,0.6), 0 0 40px rgba(183,148,246,0.25)', overflow: 'hidden', opacity: on, translate: `0 ${(1 - on) * 80}px`, rotate: `${(1 - on) * 6}deg`}}>
			{/* Bildschirm: Zimmer bei Nacht mit Lampe, Umhang-Figur sitzt zu Hause */}
			<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(#1A1E3C, #2A2240 60%, #161226)'}} />
			<div style={{position: 'absolute', left: 40, top: 120, width: 120, height: 150, borderRadius: 8, background: 'linear-gradient(#24305E, #141A3A)', border: '4px solid #3A3250'}} />
			<div style={{position: 'absolute', right: 30, top: 300, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,214,150,0.35), rgba(255,214,150,0) 70%)'}} />
			<svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
				<rect x={30} y={520} width={290} height={70} rx={14} fill="#3A2E4A" />
				<CapeFigure x={175} y={560} h={250} step={frame / 10} wind={0.2} />
			</svg>
			{/* Einblendung wie im Original-Titel */}
			<div style={{position: 'absolute', left: 0, right: 0, top: 210, display: 'flex', justifyContent: 'center'}}>
				<span style={{padding: '6px 14px', borderRadius: 8, background: 'rgba(0,0,0,0.55)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, color: '#FFFFFF', textShadow: '0 3px 0 #000, 0 0 12px rgba(0,0,0,0.9)', whiteSpace: 'nowrap', scale: String(0.9 + 0.1 * on)}}>{BATMAN.title}</span>
			</div>
			{/* neutrale App-Elemente rechts (keine Logos) */}
			{['♥', '💬', '↗'].map((g, i) => (
				<div key={g} style={{position: 'absolute', right: 14, top: 360 + i * 74, width: 52, height: 52, borderRadius: 26, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, color: '#FFFFFF'}}>{g}</div>
			))}
			<div style={{position: 'absolute', left: 22, bottom: 34, fontFamily: FONTS.heading, fontWeight: 800, fontSize: 24, color: '#FFFFFF', textShadow: '0 2px 6px rgba(0,0,0,0.9)'}}>{BATMAN.handle}</div>
			<div style={{position: 'absolute', left: '50%', top: 12, width: 110, height: 26, marginLeft: -55, borderRadius: 13, background: '#000'}} />
		</div>
	);
};

export const BatmanScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const b2 = cue(cues, 'b2', 60);
	const b3 = cue(cues, 'b3', 150);
	const b4 = cue(cues, 'b4', 350);
	const b5 = cue(cues, 'b5', 430);
	const atKling = wordFrame(cues, 'geklingelt', b3.from + 50);
	const at20 = wordFrame(cues, '20', atKling + 20);
	const atZweimal = wordFrame(cues, 'zweimal', at20 + 40);
	const atHaus = wordFrame(cues, 'Hausarrest', b4.from + 30);
	const atOhne = wordFrame(cues, 'ohne', durationInFrames - 50);
	const atFreitag = wordFrame(cues, 'Freitag', b5.from + 20);
	// Phasen: A Skyline/Symbol → B Quellenkarte → C Tür → D Smartphone → E Kalender + Pointe
	const toB = interpolate(frame, [b2.from - 8, b2.from + 6], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const toC = interpolate(frame, [b3.from - 8, b3.from + 8], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const toD = interpolate(frame, [b4.from - 8, b4.from + 8], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const toE = interpolate(frame, [atFreitag - 8, atFreitag + 6], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const dark = interpolate(frame, [0, 20], [0, 1], clamp) * (1 - toE * 0.7);
	const mask = springIn({frame, fps, delay: 4, damping: 11, stiffness: 190});
	const title = springIn({frame, fps, delay: 0, damping: 14, stiffness: 190});
	const card = springIn({frame, fps, delay: b2.from - 4, damping: 14, stiffness: 180});
	const head = springIn({frame, fps, delay: atKling + 2, damping: 13, stiffness: 200});
	const ring = interpolate(frame, [atKling - 2, atKling + 26], [0, 1], clamp);
	const officers = interpolate(frame, [b3.from + 2, b3.from + 16], [0, 1], clamp);
	const phone = springIn({frame, fps, delay: b4.from - 6, damping: 14, stiffness: 170});
	const quote = springIn({frame, fps, delay: b4.from + 10, damping: 14, stiffness: 180});
	const cal = springIn({frame, fps, delay: atFreitag - 4, damping: 12, stiffness: 170});
	const stamp = springIn({frame, fps, delay: atFreitag + 14, damping: 10, stiffness: 230});
	const punch = springIn({frame, fps, delay: atOhne - 6, damping: 11, stiffness: 210});
	const claimAt = [at20 - 4, atZweimal - 4, atZweimal + 22];
	// Kamera: Fahrt aufs Wohnhaus (A/B), Zoom auf die Tür (C), zurück zur Skyline (E)
	const camScale = interpolate(frame, [0, b2.from + 10, b3.from + 10], [1, 1.12, 1.3], clamp) * (1 - toE * 0.25);
	const housePos = interpolate(toB, [0, 1], [180, 0]);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{scale: String(camScale), transformOrigin: '50% 70%'}}>
				<NightCity mood={blendMood(MOODS.dusk, MOODS.calm, 0.6 * dark)} progress={0.5 + frame / 1200} litRatio={0.3 + 0.2 * toE} showMoon bokeh={10} showPromenade={false} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: `rgba(4,6,20,${0.35 + 0.4 * dark})`}} />
			{/* A: Masken-Symbol am Himmel + Titel */}
			<div style={{position: 'absolute', left: 0, right: 0, top: 430, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, opacity: (1 - toB) * Math.min(1, mask * 2)}}>
				<div style={{padding: 26, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,244,200,0.35), rgba(255,244,200,0) 70%)', scale: String(0.6 + 0.4 * mask)}}>
					<MaskGlyph size={150} />
				</div>
				<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 84, color: COLORS.text, textShadow: '0 8px 30px rgba(0,0,0,0.9)', opacity: Math.min(1, title * 1.6)}}>UND BATMAN?</div>
			</div>
			{/* A/B: Wohnhaus, ein Fenster leuchtet */}
			<div style={{position: 'absolute', left: 260, top: 760 + housePos, opacity: (1 - toC) * interpolate(frame, [6, 20], [0, 1], clamp), scale: String(0.85 + 0.15 * toB), transformOrigin: '50% 100%'}}>
				<ApartmentBlock lit={interpolate(frame, [b2.from, b2.from + 20], [0.2, 1], clamp)} />
			</div>
			{/* B: Quellenkarte @ichbinyounes */}
			{frame >= b2.from - 6 ? (
				<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 400, opacity: Math.min(1, card * 1.8) * (1 - toD), translate: `${(1 - card) * -80}px 0`}}>
					<Card color={VIOLET} style={{padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 18}} glow={0.3}>
						<div style={{width: 96, height: 96, borderRadius: 48, background: `radial-gradient(circle at 35% 30%, ${VIOLET}, #3A2470)`, border: '4px solid #FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
							<MaskGlyph size={62} color="#141A3A" />
						</div>
						<div style={{flex: 1, minWidth: 0}}>
							<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, color: COLORS.text}}>{BATMAN.handle}</div>
							<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: VIOLET, letterSpacing: 1}}>{BATMAN.who}</div>
							<div style={{marginTop: 4, fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, color: COLORS.textMuted}}>hat sich selbst auf TikTok gemeldet</div>
						</div>
						<P2Icon name="chat" size={44} color={VIOLET} />
					</Card>
					{/* C: zentrale Aussage + Punkte (seine eigene Schilderung) */}
					{frame >= atKling ? (
						<div style={{marginTop: 16, opacity: Math.min(1, head * 1.8), translate: `0 ${(1 - head) * 24}px`}}>
							<Card color={ORANGE} style={{padding: '14px 20px'}} glow={0.25}>
								<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
									<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 42, color: COLORS.text, whiteSpace: 'nowrap'}}>{BATMAN.headline}</span>
								</div>
								<div style={{marginTop: 6}}>
									<Chip kind="LAUT YOUNES" size={16} />
								</div>
								<div style={{marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8}}>
									{BATMAN.claims.map((c, i) => {
										const o = interpolate(frame, [claimAt[i], claimAt[i] + 8], [0, 1], clamp);
										if (o <= 0) return null;
										return (
											<div key={c} style={{display: 'flex', alignItems: 'center', gap: 12, opacity: o, translate: `${(1 - o) * 30}px 0`}}>
												<div style={{width: 30, height: 30, borderRadius: 8, background: withAlpha(ORANGE, 0.25), border: `2px solid ${ORANGE}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 18, color: ORANGE}}>{i + 1}</div>
												<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 31, color: COLORS.text}}>{c}</span>
											</div>
										);
									})}
								</div>
							</Card>
						</div>
					) : null}
				</div>
			) : null}
			{/* C: Tür mit Polizeifiguren (Illustration seiner Erzählung) */}
			{toC > 0 && toD < 1 ? (
				<div style={{position: 'absolute', left: 250, top: 800, opacity: toC * (1 - toD), scale: String(0.64 + 0.06 * toC), transformOrigin: '50% 0%'}}>
					<Door25D ring={ring} />
					<svg width={560} height={760} style={{position: 'absolute', inset: 0, overflow: 'visible', opacity: officers, filter: 'brightness(1.6) saturate(1.2)'}}>
						<ellipse cx={280} cy={700} rx={230} ry={30} fill="rgba(255,226,170,0.12)" />
						<OfficerFigure x={70} y={720} h={380} step={frame / 14} />
						<OfficerFigure x={500} y={728} h={390} step={frame / 14 + 2} dir={-1} />
					</svg>
					{ring > 0 && ring < 1 ? (
						<div style={{position: 'absolute', left: 0, right: 0, top: -10, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 72, color: '#FFE3A0', rotate: '-6deg', textShadow: '0 6px 20px rgba(0,0,0,0.9)', opacity: Math.min(1, Math.sin(ring * Math.PI) * 2.2), scale: String(0.85 + 0.15 * Math.sin(ring * Math.PI))}}>DING-DONG!</div>
					) : null}
				</div>
			) : null}
			{/* D: sein neues TikTok (stilisiert) + Zitat */}
			{toD > 0 && toE < 1 ? (
				<div style={{position: 'absolute', inset: 0, opacity: toD * (1 - toE)}}>
					<div style={{position: 'absolute', left: LAYOUT.left, top: 410, display: 'flex', alignItems: 'center', gap: 12}}>
						<span style={{padding: '6px 14px', borderRadius: 10, background: VIOLET, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, color: ACCENT.ink}}>SEIN NEUES TIKTOK</span>
						<Chip kind="ILLUSTRATION" size={15} />
					</div>
					<div style={{position: 'absolute', left: 520, top: 480}}>
						<PhoneHausarrest on={Math.min(1, phone * 1.3)} />
					</div>
					<div style={{position: 'absolute', left: LAYOUT.left, width: 430, top: 520, opacity: Math.min(1, phone * 1.6)}}>
						<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, color: COLORS.textMuted}}>Titel im Video:</div>
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 58, lineHeight: 1.02, color: COLORS.text, textShadow: '0 6px 24px rgba(0,0,0,0.9)'}}>„20.11<br />HAUSARREST“</div>
					</div>
					{frame >= b4.from + 8 ? (
						<div style={{position: 'absolute', left: LAYOUT.left, width: 430, top: 700, opacity: Math.min(1, quote * 1.7), translate: `0 ${(1 - quote) * 20}px`}}>
							<Card color={ORANGE} style={{padding: '12px 16px'}} glow={0.2}>
								<div style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 29, lineHeight: 1.18, color: COLORS.text}}>{BATMAN.quote}</div>
								<div style={{marginTop: 6, fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted}}>– Younes in seinem Video</div>
							</Card>
						</div>
					) : null}
				</div>
			) : null}
			{/* E: Kalender 20.11. + Umhang-Figur mit „Hausarrest“-Stempel + Pointe */}
			{toE > 0 ? (
				<div style={{position: 'absolute', inset: 0, opacity: toE}}>
					<div style={{position: 'absolute', left: 110, top: 430, opacity: Math.min(1, cal * 1.6), scale: String(0.7 + 0.3 * cal), rotate: `${(1 - cal) * 12}deg`, transformOrigin: '50% 0%'}}>
						<CalendarBlock day="20" month="NOVEMBER" weekday="FREITAG" width={300} accent={RED} tilt={-5} />
					</div>
					<div style={{position: 'absolute', left: 520, top: 380}}>
						<svg width={380} height={520} viewBox="-190 -500 380 520" style={{overflow: 'visible'}}>
							<ellipse cx={0} cy={0} rx={130} ry={18} fill="rgba(0,0,0,0.45)" />
							<CapeFigure x={0} y={0} h={440} step={0} wind={0.35 + 0.15 * Math.sin(frame / 9)} />
						</svg>
						{frame >= atFreitag + 12 ? (
							<div style={{position: 'absolute', left: -20, top: 200, padding: '8px 18px', borderRadius: 12, border: `6px solid ${RED}`, background: 'rgba(30,6,12,0.82)', rotate: '-14deg', scale: String(1.8 - 0.8 * stamp), opacity: Math.min(1, stamp * 2), fontFamily: FONTS.heading, fontWeight: 900, fontSize: 52, letterSpacing: 2, color: RED, whiteSpace: 'nowrap', boxShadow: `0 0 40px ${withAlpha(RED, 0.4)}`}}>„HAUSARREST“</div>
						) : null}
					</div>
					{frame >= atOhne - 7 ? (
						<div style={{position: 'absolute', left: 0, right: 0, top: 960, display: 'flex', justifyContent: 'center', opacity: Math.min(1, punch * 2), scale: String(1.4 - 0.4 * punch)}}>
							<div style={{padding: '12px 26px', borderRadius: 18, background: RED, boxShadow: '0 20px 50px rgba(255,59,78,0.45)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 52, color: '#FFFFFF', whiteSpace: 'nowrap'}}>{BATMAN.punch}</div>
						</div>
					) : null}
				</div>
			) : null}
			<div style={{position: 'absolute', left: LAYOUT.left, top: 1146}}>
				<Chip kind="ILLUSTRATION" size={16} />
			</div>
			<SourceBar text={BATMAN.source} at={b2.from} />
			<Sfx name="whoosh" at={0} volume={0.4} />
			<Sfx name="blip" at={6} volume={0.45} />
			<Sfx name="notify" at={b2.from - 4} volume={0.5} />
			<Sfx name="whoosh" at={b3.from - 6} volume={0.35} />
			<Sfx name="notify" at={atKling - 2} volume={0.65} />
			<Sfx name="pop" at={atKling + 2} volume={0.45} />
			{claimAt.map((c, i) => (
				<Sfx key={i} name="click" at={c} volume={0.4} />
			))}
			<Sfx name="paper" at={b4.from - 6} volume={0.45} />
			<Sfx name="pop" at={b4.from + 10} volume={0.4} />
			<Sfx name="click" at={atHaus} volume={0.4} />
			<Sfx name="whoosh" at={atFreitag - 8} volume={0.35} />
			<Sfx name="stamp" at={atFreitag + 14} volume={0.6} />
			<Sfx name="softImpact" at={atOhne - 4} volume={0.6} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 9: Abo-Aufruf (offizielles Logo) */

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
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 1180, textAlign: 'center', fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, color: COLORS.textMuted}}>{STAND} · Infos von Innenministerium, Polizei und Stadt am 18.11. angekündigt</div>
			<Sfx name="pop" at={atCta} volume={0.6} />
			<Sfx name="click" at={atCta + 26} volume={0.6} />
		</AbsoluteFill>
	);
};

/** Für Tests/Doku: alle Quellen-IDs, die im Bild genannt werden. */
export const SCENE_SOURCE_IDS = SOURCES.map((s) => s.id);
