import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {FrankfurtSkyline} from '../../../components/backgrounds/FrankfurtSkyline';
import {BrandLogo} from '../../../components/brand/BrandLogo';
import {clamp, EASE_IN_OUT, EASE_OUT, springIn} from '../../../lib/animation';
import {mix, withAlpha} from '../../../lib/color';
import {handleWithAt} from '../../../theme/brand';
import {COLORS, FONTS} from '../../../theme/tokens';
import {SourceBar} from '../../../formats/frankfurt-erklaert/components';
import {ACCENT, FORMAT, LAYOUT} from '../../../formats/frankfurt-erklaert/theme';
import {DayTimeline} from '../../../formats/frankfurt-erklaert/visuals/DayTimeline';
import {blendMood, type Mood, MOODS, NightCity} from '../../frankfurt-2026-11-20-ausblick/premium/NightCity';
import {PoliceVan} from '../../frankfurt-2026-11-20-ausblick/premium/PoliceVan';
import {Card, CountUp, IconOrb, P2Icon, type P2IconName, Stars, Tag, useSpring} from '../../frankfurt-erklaert-genz-phase2-2026-11-14/scenes/kit';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {BATMAN, COVER, CTA, DEMANDS, EVENTS, type EventId, GENZ, GEWERK, SCHUL, SOURCES, STAND} from '../content';
import {NOV20_COVER_LAYOUT} from '../cover-layout';
import {BockenheimerDepot, CapeFigure, OfficerFigure, WillyBrandtPlatz} from '../visuals/Illustrations';

const RED = ACCENT.brand;
const BLUE = ACCENT.info;
const EV = Object.fromEntries(EVENTS.map((e) => [e.id, e])) as Record<EventId, (typeof EVENTS)[number]>;

/** Skyline-Farben am Nachmittag (heller als die Nachtpalette). */
const SKY_DAY = {far: '#3A4A8A', mid: '#2C3A78', near: '#24306A', front: '#1A2250', glass: '#34509A', glassHi: '#6A8CDA', light: '#4E60A6', quay: '#161E44', waterTop: '#2A3A7A', waterBottom: '#0C1236'};

/** Nachmittag (14–16:30 Uhr): heller als die Nacht-Stimmungen, kippt zum Ende Richtung Dämmerung. */
const AFTERNOON: Mood = {sky: ['#0E1C4A', '#24407E', '#5A78B2', '#D49A82'], glow: '#FFB07A', hills: '#18244E', band: '#203060', fog: '#7A86B8', lamp: '#FFD27A'};

/* ------------------------------------------------------------------ Kategorie-Chips */

type Kind = 'LAUT STADT' | 'LAUT AUFRUF' | 'LAUT INITIATIVE' | 'LAUT GEW' | 'OFFEN' | 'ILLUSTRATION' | 'GAG' | 'ANGEKÜNDIGT';
const KIND_COLOR: Record<Kind, string> = {
	'LAUT STADT': BLUE,
	'LAUT AUFRUF': COLORS.signal,
	'LAUT INITIATIVE': COLORS.signal,
	'LAUT GEW': COLORS.signal,
	ANGEKÜNDIGT: COLORS.signal,
	OFFEN: ACCENT.no,
	ILLUSTRATION: '#9AA6CC',
	GAG: ACCENT.law,
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

/** Orientierungsleiste (chronologische Tages-Timeline) oben in jeder Inhaltsszene – unter dem Serien-Overlay (y ≥ 400). */
export const STRIP_TOP = 404;
const OrientationStrip: React.FC<{active: EventId | null; pulseAll?: number}> = ({active, pulseAll}) => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [0, 6], [0.4, 1], clamp);
	return (
		<div style={{position: 'absolute', left: LAYOUT.left - 14, top: STRIP_TOP - 10, width: LAYOUT.width + 28, padding: '10px 14px 4px', boxSizing: 'border-box', borderRadius: 22, background: 'rgba(6,8,24,0.72)', border: '1.5px solid rgba(255,255,255,0.12)', opacity: o}}>
			<DayTimeline events={EVENTS} width={LAYOUT.width} variant="strip" active={active} pulse={pulseAll !== undefined ? EVENTS.map((_, i) => interpolate(pulseAll, [i * 0.15, i * 0.15 + 0.4], [0, 1], clamp)) : undefined} />
		</div>
	);
};

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
					<DayTimeline events={EVENTS} width={L.timelineWidth} size={L.timelineOrb} highlight="genz" pulse={pulse} />
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

/* ------------------------------------------------------------------ Szene 2: Schulstreik (10 Uhr) + kleiner Zug (11 Uhr) */

export const SchulstreikScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const s1 = cue(cues, 's1', 0);
	const s2 = cue(cues, 's2', 200);
	const atWehr = wordFrame(cues, 'Wehrpflicht', s1.from + 90);
	const atAufruf = wordFrame(cues, 'Aufruf', atWehr + 24);
	const atCount = Math.max(atAufruf + 20, s2.from - 4);
	const at1200 = wordFrame(cues, '1.200', atCount + 12);
	const atZiel = wordFrame(cues, 'Ziel', at1200 + 40);
	const at11 = wordFrame(cues, '11', s2.to - 70);
	const at75 = wordFrame(cues, '75', at11 + 36);
	const swap = interpolate(frame, [at11 - 8, at11 + 6], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const cam = interpolate(frame, [0, at11 - 8, at11 + 20, durationInFrames], [0, 0.45, 0.9, 1], clamp);
	const crowd = interpolate(frame, [0, 40], [0.15, 1], clamp);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{scale: String(1.04 + cam * 0.05), transformOrigin: '60% 70%'}}>
				<WillyBrandtPlatz cam={cam} crowd={crowd} morning={0.35 + cam * 0.4} />
			</AbsoluteFill>
			<TopShade />
			<div style={{position: 'absolute', left: LAYOUT.left, top: 290}}>
				<Tag text="FREITAG · 10:00 UHR" color={EV.schulstreik.color} icon="clock" />
			</div>
			<OrientationStrip active={frame < at11 - 2 ? 'schulstreik' : 'campus'} />
			{/* Phase A: Schulstreik */}
			<div style={{position: 'absolute', inset: 0, opacity: 1 - swap, translate: `${-swap * 120}px 0`}}>
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
			</div>
			{/* Phase B: kleiner Zug am Campus (11 Uhr) */}
			{frame >= at11 - 8 ? (
				<div style={{position: 'absolute', inset: 0, opacity: swap, translate: `${(1 - swap) * 120}px 0`}}>
					<EventHeader id="campus" at={at11 - 8} kicker={`${SCHUL.small.time}–13:30`} title="KLEINER ZUG" titleSize={74} place="CAMPUS WESTEND" />
					<In at={at11 + 4} style={{left: LAYOUT.left, top: 752}}>
						<Card color={EV.campus.color} style={{width: LAYOUT.width, boxSizing: 'border-box', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 18}} glow={0.25}>
							<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 92, lineHeight: 1, color: COLORS.text, minWidth: 128, textAlign: 'center'}}>
								<CountUp value={SCHUL.small.count} at={at11 + 4} dur={Math.max(10, at75 + 4 - (at11 + 4))} />
							</div>
							<div>
								<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 36, color: COLORS.text}}>ANGEMELDET · LAUT STADT</div>
								<div style={{marginTop: 4, fontFamily: FONTS.body, fontWeight: 700, fontSize: 27, color: COLORS.textMuted}}>{SCHUL.small.route}</div>
								<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, color: COLORS.textMuted}}>Anmeldung: {SCHUL.small.by}</div>
							</div>
						</Card>
					</In>
					<In at={at75} dy={20} style={{left: LAYOUT.left, top: 930}}>
						<div style={{display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 16px', borderRadius: 14, background: 'rgba(8,10,28,0.9)', border: `2px solid ${withAlpha('#FFFFFF', 0.3)}`}}>
							<P2Icon name="info" size={28} color="#C9CEDF" />
							<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 26, color: COLORS.text}}>laut Stadt im Zusammenhang mit dem Schulstreik</span>
						</div>
					</In>
				</div>
			) : null}
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
			<Sfx name="whoosh" at={at11 - 8} volume={0.35} />
			<Sfx name="tick" at={at11 - 2} volume={0.6} />
			<Sfx name="softImpact" at={at75 + 2} volume={0.5} />
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
			<div style={{position: 'absolute', left: LAYOUT.left, top: 290}}>
				<Tag text="FREITAG · 17:30 UHR" color={EV.gewerkschaft.color} icon="clock" />
			</div>
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
			<div style={{position: 'absolute', left: LAYOUT.left, top: 290}}>
				<Tag text="FREITAG · 14:00 UHR" color={RED} icon="clock" />
			</div>
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
			<div style={{position: 'absolute', left: LAYOUT.left, top: 290}}>
				<Tag text="GEN Z REGELT · WOFÜR?" color={RED} icon="megaphone" />
			</div>
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
			<div style={{position: 'absolute', left: LAYOUT.left, top: 290}}>
				<Tag text="AUFLAGEN DER STADT" color={BLUE} icon="shield" />
			</div>
			<div style={{position: 'absolute', left: LAYOUT.left, top: 410}}>
				<DayTimeline events={EVENTS} width={LAYOUT.width} size={64} pulse={EVENTS.map((_, i) => interpolate(pulseAll, [i * 0.15, i * 0.15 + 0.4], [0, 1], clamp))} />
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

/* ------------------------------------------------------------------ Szene 7: Batman-Gag */

export const BatmanScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const b2 = cue(cues, 'b2', 100);
	const atNicht = wordFrame(cues, 'nicht', 80);
	const atHalloween = wordFrame(cues, 'Halloween', b2.from + 8);
	const atPolizei = wordFrame(cues, 'Polizei', atHalloween + 30);
	const atMit = wordFrame(cues, 'mitgenommen', atPolizei + 12);
	const atOhne = wordFrame(cues, 'ohne', durationInFrames - 50);
	const back = interpolate(frame, [atHalloween - 8, atHalloween + 10], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const title = springIn({frame, fps, delay: 0, damping: 14, stiffness: 180});
	const q = springIn({frame, fps, delay: atNicht - 4, damping: 11, stiffness: 200});
	// Abführen: Gruppe geht von links zum Wagen, verschwindet bei „mitgenommen“
	const walk = interpolate(frame, [atHalloween, atMit + 6], [0, 1], clamp);
	const inVan = interpolate(frame, [atMit + 4, atMit + 14], [1, 0], clamp);
	const gx = interpolate(walk, [0, 1], [170, 560]);
	const ohne = springIn({frame, fps, delay: atOhne - 6, damping: 10, stiffness: 220});
	const beam = Math.sin(frame / 16) * 8;
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{scale: String(1.08 - back * 0.05), transformOrigin: '50% 60%'}}>
				<NightCity mood={blendMood(MOODS.calm, MOODS.police, back * 0.6)} progress={0.5 + frame / 900} litRatio={0.38} showMoon bokeh={10} showPromenade={false} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.9) 0%, rgba(4,6,20,0.55) 28%, rgba(4,6,20,0.3) 46%, rgba(4,6,20,0.75) 64%, rgba(4,6,20,0.95) 100%)'}} />
			{/* Suchscheinwerfer mit Fragezeichen (eigene Gestaltung, kein Logo) */}
			<div style={{position: 'absolute', inset: 0, opacity: 1 - back}}>
				<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
					<defs>
						<linearGradient id="bm-beam" x1={0} x2={0} y1={1} y2={0}>
							<stop offset={0} stopColor="#FFF4C8" stopOpacity={0.05} />
							<stop offset={1} stopColor="#FFF4C8" stopOpacity={0.28} />
						</linearGradient>
					</defs>
					<path d={`M500 1240 L${470 + beam} 560 L${730 + beam} 560 L560 1240 Z`} fill="url(#bm-beam)" />
					<ellipse cx={600 + beam} cy={590} rx={150} ry={92} fill="#FFF4C8" opacity={0.85} />
					<text x={600 + beam} y={636} textAnchor="middle" fontFamily={FONTS.heading} fontWeight={900} fontSize={120} fill="#141A3A">
						?
					</text>
				</svg>
				{/* gestrichelte Umhang-Silhouette auf dem Dach: „ob er kommt?“ */}
				<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible', opacity: 0.55 + 0.35 * Math.sin(frame / 7)}}>
					<rect x={700} y={1150} width={300} height={14} rx={4} fill="#1A2046" />
					<CapeFigure x={850} y={1150} h={200} step={0} wind={0.4 + 0.3 * Math.sin(frame / 11)} outline />
				</svg>
				<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 720, opacity: Math.min(1, title * 1.6), translate: `0 ${(1 - title) * 30}px`}}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 80, lineHeight: 1, color: COLORS.text, textShadow: '0 8px 30px rgba(0,0,0,0.9)', whiteSpace: 'nowrap'}}>BATMAN AM 20.11.?</div>
					{frame >= atNicht - 5 ? (
						<div style={{marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 12, padding: '8px 18px', borderRadius: 14, background: ACCENT.law, scale: String(0.8 + 0.2 * q), opacity: Math.min(1, q * 2)}}>
							<P2Icon name="info" size={32} color={ACCENT.ink} stroke={2.6} />
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 36, color: ACCENT.ink}}>WISSEN WIR (NOCH) NICHT</span>
						</div>
					) : null}
				</div>
			</div>
			{/* Rückblick Halloween: Umhang-Figur wird abgeführt (Illustration) */}
			{frame >= atHalloween - 8 ? (
				<div style={{position: 'absolute', inset: 0, opacity: back}}>
					<div style={{position: 'absolute', left: LAYOUT.left, top: 540, display: 'flex', alignItems: 'center', gap: 12}}>
						<span style={{padding: '6px 14px', borderRadius: 10, background: '#FF8A3D', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: ACCENT.ink}}>RÜCKBLICK: HALLOWEEN, 31.10.</span>
					</div>
					<div style={{position: 'absolute', left: 0, right: 0, top: 1060, height: 200, background: 'linear-gradient(#1A2042, #0C1030)'}} />
					<div style={{position: 'absolute', left: 560, top: 905}}>
						<PoliceVan width={420} phase={frame} lights />
					</div>
					<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
						<g opacity={inVan}>
							<OfficerFigure x={gx - 86} y={1160} h={190} step={frame / 6} />
							<CapeFigure x={gx} y={1160} h={190} step={frame / 6} wind={walk} />
							<OfficerFigure x={gx + 86} y={1160} h={190} step={frame / 6 + 1} />
						</g>
					</svg>
					<In at={atPolizei - 4} dy={20} style={{left: LAYOUT.left, top: 640, width: LAYOUT.width}} out={interpolate(frame, [atOhne - 8, atOhne], [1, 0], clamp)}>
						<Card color={ACCENT.law} style={{padding: '12px 18px'}} glow={0.25}>
							<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 36, lineHeight: 1.08, color: COLORS.text}}>DEMONSTRIERENDE PERSON IM BATMAN-KOSTÜM VON DER POLIZEI ABGEFÜHRT</div>
							<div style={{marginTop: 4, fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, color: COLORS.textMuted}}>laut Reuters-Bildunterschrift (31.10.) · abgeführt ≠ schuldig</div>
						</Card>
					</In>
				</div>
			) : null}
			{/* Pointe: diesmal ohne Batman */}
			{frame >= atOhne - 7 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 690, display: 'flex', justifyContent: 'center', opacity: Math.min(1, ohne * 2), scale: String(1.5 - 0.5 * ohne), rotate: '-5deg'}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '12px 22px', borderRadius: 18, border: `5px solid ${ACCENT.law}`, background: 'rgba(14,8,30,0.92)'}}>
						<svg width={70} height={110} viewBox="-40 -115 80 120" style={{overflow: 'visible'}}>
							<CapeFigure x={0} y={0} h={100} outline />
							<line x1={-34} y1={-4} x2={34} y2={-108} stroke={ACCENT.no} strokeWidth={7} strokeLinecap="round" />
						</svg>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 50, color: COLORS.text, whiteSpace: 'nowrap'}}>20.11.: OHNE BATMAN?</span>
					</div>
				</div>
			) : null}
			<div style={{position: 'absolute', left: LAYOUT.left, top: 1130, display: 'flex', gap: 10}}>
				<Chip kind="GAG" size={17} />
				<Chip kind="ILLUSTRATION" size={17} />
			</div>
			<SourceBar text={`${BATMAN.note} (Reuters via The Independent; heute.at)`} at={8} />
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="blip" at={6} volume={0.4} />
			<Sfx name="pop" at={atNicht - 4} volume={0.5} />
			<Sfx name="whoosh" at={atHalloween - 8} volume={0.35} />
			<Sfx name="paper" at={atPolizei - 4} volume={0.4} />
			<Sfx name="click" at={atMit + 6} volume={0.45} />
			<Sfx name="stamp" at={atOhne - 4} volume={0.55} />
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
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 1180, textAlign: 'center', fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, color: COLORS.textMuted}}>{STAND} · Infos von Innenministerium, Polizei und Stadt am 18.11. angekündigt</div>
			<Sfx name="pop" at={atCta} volume={0.6} />
			<Sfx name="click" at={atCta + 26} volume={0.6} />
		</AbsoluteFill>
	);
};

/** Für Tests/Doku: alle Quellen-IDs, die im Bild genannt werden. */
export const SCENE_SOURCE_IDS = SOURCES.map((s) => s.id);
