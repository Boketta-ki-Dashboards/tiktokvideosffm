import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {FrankfurtSkyline} from '../../../components/backgrounds/FrankfurtSkyline';
import {BrandLogo} from '../../../components/brand/BrandLogo';
import {Crowd} from '../../../components/characters/Crowd';
import {interpolateCamera, type PlaneBillboard, type PlaneCamera} from '../../../components/map/TiltedPlane';
import {TopTag} from '../../../formats/frankfurt-erklaert/Branding';
import {ACCENT, FORMAT, LAYOUT} from '../../../formats/frankfurt-erklaert/theme';
import {clamp, EASE_IN_OUT, EASE_OUT, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {handleWithAt} from '../../../theme/brand';
import {COLORS, FONTS} from '../../../theme/tokens';
import {blendMood, MOODS, NightCity} from '../../frankfurt-2026-11-20-ausblick/premium/NightCity';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {CalendarBlock, Card, CountUp, P2Icon, type P2IconName, Stars, useSpring} from '../../frankfurt-erklaert-genz-phase2-2026-11-14/scenes/kit';
import {CityPin, germanyGeo, GermanyPlane} from '../../frankfurt-erklaert-genz-phase2-2026-11-14/visuals/GermanyPlane';
import {CITIES} from '../cities';
import {CENTRAL_IDS, type CentralId, CITY_COUNT, type City, COMPARE, COVER, CTA, DEMANDS, END, EXTREMES, LOCAL_COUNT, MAP, NUMBER_KINDS, PLEDGES, STAND} from '../content';
import {BUNDESWEIT_COVER_LAYOUT} from '../cover-layout';
import {CrowdQuestion, DemandIcon, type DemandIconName, DomTowers, PlanDoc, TicketPhone} from '../visuals/Illustrations';

const RED = ACCENT.brand;
const BLUE = ACCENT.info;
const GREEN = ACCENT.yes;
const YELLOW = COLORS.signal;
/** Orange wie auf der Karte der Initiative („Städte, die wir … hauptverantwortlich betreuen“), weiß = angeschlossen. */
export const ORANGE = '#FF9F43';
export const WHITE_DOT = '#E6EAF6';

/* ------------------------------------------------------------------ Kategorie-Chips */

type Kind = 'LAUT WEBSITE' | 'LAUT STADT' | 'LAUT POLIZEI' | 'PLANUNG' | 'OFFEN' | 'POSITION' | 'ILLUSTRATION';
const KIND_COLOR: Record<Kind, string> = {
	'LAUT WEBSITE': ORANGE,
	'LAUT STADT': BLUE,
	'LAUT POLIZEI': BLUE,
	PLANUNG: YELLOW,
	OFFEN: ACCENT.no,
	POSITION: '#B794F6',
	ILLUSTRATION: '#9AA6CC',
};
const Chip: React.FC<{kind: Kind; size?: number; style?: React.CSSProperties}> = ({kind, size = 20, style}) => {
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

/* ------------------------------------------------------------------ Deutschlandkarte mit 73 Treffpunkten */

const xy = (c: City): [number, number] => germanyGeo().project([c.lon, c.lat]);
const byId = (id: string) => CITIES.find((c) => c.id === id) as City;
/** Rang Nord → Süd (Welle bei „Kiel bis Lörrach“) und West → Ost (Lichtlauf bei „Aachen bis Cottbus“), 0–1. */
const RANK_NS = new Map([...CITIES].sort((a, b) => b.lat - a.lat).map((c, i) => [c.id, i / (CITIES.length - 1)]));
const RANK_WE = new Map([...CITIES].sort((a, b) => a.lon - b.lon).map((c, i) => [c.id, i / (CITIES.length - 1)]));

const COVER_CAM: PlaneCamera = {x: 500, y: 700, zoom: 0.66, tilt: 30, rotate: -3};
const COVER_ANCHOR: [number, number] = [540, 760];
/** Übersicht – Ende des Titelbilds = Anfang der Karten-Szene (nahtlos). */
export const DE_OVERVIEW: PlaneCamera = {x: 500, y: 680, zoom: 0.74, tilt: 40, rotate: -1};
export const DE_ANCHOR: [number, number] = [540, 900];

type DotState = {on: number; flash: number; dim: number; central: number};

/** Leuchtpunkt eines Treffpunkts: zentral = orange und größer, angeschlossen = weiß, „Standort folgt“ = offener Ring. */
const Dot: React.FC<{c: City; s: DotState}> = ({c, s}) => {
	const frame = useCurrentFrame();
	const isCentral = c.central && s.central > 0;
	const size = (c.central ? 16 + 12 * s.central : 13) * (1 + 0.7 * s.flash) * (0.4 + 0.6 * s.on);
	const color = c.central ? (s.central > 0 ? ORANGE : WHITE_DOT) : WHITE_DOT;
	const pulse = isCentral ? 0.5 + 0.5 * Math.sin(frame / 6) : 0;
	return (
		<div
			style={{
				width: size,
				height: size,
				marginBottom: -size / 2,
				borderRadius: size,
				opacity: s.on * (1 - 0.55 * s.dim),
				background: c.pending ? 'transparent' : color,
				border: c.pending ? `3px solid ${color}` : `2px solid ${withAlpha('#FFFFFF', 0.9)}`,
				boxSizing: 'border-box',
				boxShadow: `0 0 ${10 + 10 * s.flash + 16 * pulse}px ${withAlpha(color, 0.75)}`,
			}}
		/>
	);
};

const dotBillboards = (state: (c: City) => DotState): PlaneBillboard[] =>
	CITIES.map((c) => {
		const [x, y] = xy(c);
		return {key: `dot-${c.id}`, x, y, node: <Dot c={c} s={state(c)} />};
	});

/* ------------------------------------------------------------------ Szene 1: Titelbild */

/**
 * Titelbild (Video-Frame 0 und PNG, nach COVER_ZONE): Serientitel, riesige gelbe „73“ über der 2,5D-Deutschlandkarte mit allen Treffpunkten,
 * rote Karte „STÄDTE – EIN PROTESTTAG“, Datum, „4 ZENTRAL · 69 ANGESCHLOSSEN“, Logo + Account; im PNG zusätzlich „WAS PASSIERT MORGEN?“.
 * `morph` (0–1) blendet die Texte aus und fährt die Karte in die Übersicht der Karten-Szene.
 */
export const BundesweitCover: React.FC<{morph?: number; pulse?: number; thumbnail?: boolean; meta?: number}> = ({morph = 0, pulse = 0, thumbnail = false, meta = 1}) => {
	const frame = useCurrentFrame();
	const L = BUNDESWEIT_COVER_LAYOUT;
	const m = EASE_IN_OUT(Math.min(1, Math.max(0, morph)));
	const cam = interpolateCamera(m * 100, [
		{frame: 0, cam: {...COVER_CAM, rotate: (COVER_CAM.rotate ?? 0) + Math.sin(frame / 40) * 1.2}},
		{frame: 100, cam: DE_OVERVIEW},
	], (t) => t);
	const anchor: [number, number] = [540, COVER_ANCHOR[1] + (DE_ANCHOR[1] - COVER_ANCHOR[1]) * m];
	const text = 1 - Math.min(1, m * 1.6);
	const markers = dotBillboards((c) => ({on: 1, flash: pulse * (1 - RANK_NS.get(c.id)! * 0.5), dim: 0, central: 1}));
	const bob = Math.sin(frame / 26) * 3;
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse 110% 60% at 50% 46%, #2A2E78 0%, #121546 52%, #060920 100%)'}} />
			<Stars seed="bw12" n={46} height={520} />
			<GermanyPlane camera={cam} anchor={anchor} markers={markers} glow={1} />
			<AbsoluteFill style={{background: `linear-gradient(rgba(4,6,20,${0.6 * text}) 0%, rgba(4,6,20,${0.1 * text}) 17%, rgba(4,6,20,${0.42 * text}) 27%, rgba(4,6,20,${0.5 * text}) 46%, rgba(4,6,20,${0.82 * text}) 54%, rgba(4,6,20,${0.9 * text}) 72%, rgba(4,6,20,${0.75 * text}) 100%)`}} />
			<div style={{opacity: text, translate: `0 ${(1 - text) * -30}px`}}>
				<div style={{position: 'absolute', left: 0, right: 0, top: L.brandTop, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16}}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 50, lineHeight: 0.98, color: COLORS.text, textAlign: 'right', textShadow: '0 6px 24px rgba(0,0,0,0.8)'}}>
						FRANKFURT
						<br />
						ERKLÄRT
					</div>
					<div style={{padding: '9px 16px', borderRadius: 10, background: RED, boxShadow: '0 10px 26px rgba(255,59,78,0.4)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, letterSpacing: 3, color: '#FFFFFF'}}>{FORMAT.sub}</div>
				</div>
				<div style={{position: 'absolute', left: 0, right: 0, top: L.bigTop + bob, height: L.bigBottom - L.bigTop, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: L.bigSize, lineHeight: 0.92, letterSpacing: -10, color: YELLOW, scale: String(1 + 0.06 * Math.sin(pulse * Math.PI)), textShadow: `0 0 80px ${withAlpha(YELLOW, 0.45)}, 0 24px 60px rgba(0,0,0,0.85)`}}>{COVER.big}</span>
				</div>
				<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.cardTop, display: 'flex', justifyContent: 'center'}}>
					<div style={{padding: '9px 26px 11px', borderRadius: 18, background: 'linear-gradient(160deg, #FF6A78 0%, #FF4D5E 50%, #D93448 100%)', boxShadow: '0 5px 0 #B32A3C, 0 10px 0 #8E1F2E, 0 34px 60px rgba(0,0,0,0.6)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: L.cardFont, lineHeight: 1.05, color: '#FFFFFF', whiteSpace: 'nowrap'}}>{COVER.card}</div>
				</div>
				<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.dateTop, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, letterSpacing: 2.5, color: COLORS.text, whiteSpace: 'nowrap', textShadow: '0 4px 14px rgba(0,0,0,0.9)'}}>{COVER.date}</div>
				<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.splitTop, display: 'flex', justifyContent: 'center'}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '6px 18px', borderRadius: 14, background: 'rgba(8,10,28,0.88)', border: `2px solid ${withAlpha(ORANGE, 0.7)}`, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, color: COLORS.text, whiteSpace: 'nowrap'}}>
						<span style={{width: 18, height: 18, borderRadius: 9, background: ORANGE, boxShadow: `0 0 12px ${ORANGE}`}} />
						4 ZENTRAL
						<span style={{color: COLORS.textMuted}}>·</span>
						<span style={{width: 13, height: 13, borderRadius: 7, background: WHITE_DOT}} />
						{LOCAL_COUNT} ANGESCHLOSSEN
					</div>
				</div>
				{/* Logo-Zeile: im Video nur, bis der zweite Satz beginnt (zweizeilige Untertitel reichen bis ≈ y 1.274) */}
				<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.metaTop, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, opacity: meta}}>
					<BrandLogo size={52} />
					<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 30, color: COLORS.textMuted}}>{handleWithAt()}</span>
				</div>
				{thumbnail ? (
					<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.questionTop, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 22px', borderRadius: 16, background: 'rgba(8,10,28,0.92)', border: `2.5px solid ${YELLOW}`}}>
							<P2Icon name="alert" size={32} color={YELLOW} />
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 38, color: COLORS.text, whiteSpace: 'nowrap'}}>{COVER.question}</span>
						</div>
						<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted, whiteSpace: 'nowrap'}}>{COVER.stand}</span>
					</div>
				) : null}
			</div>
		</AbsoluteFill>
	);
};

/** Szene 1 – Titelbild im Video (ab Frame 0 vollständig); bei „73“ leuchten alle Punkte auf, am Ende Fahrt in die Kartenübersicht. */
export const CoverScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const h2 = cue(cues, 'hook2', 30);
	const at73 = wordFrame(cues, '73', h2.from + 50);
	const pulse = interpolate(frame, [at73 - 2, at73 + 20], [0, 1], clamp);
	const morph = interpolate(frame, [durationInFrames - 20, durationInFrames - 1], [0, 1], clamp);
	const meta = 1 - interpolate(frame, [h2.from - 8, h2.from], [0, 1], clamp);
	return (
		<AbsoluteFill>
			<BundesweitCover morph={morph} pulse={pulse > 0 && pulse < 1 ? pulse : 0} meta={meta} />
			<Sfx name="softImpact" at={0} volume={0.5} />
			<Sfx name="riser" at={Math.max(0, at73 - 24)} volume={0.35} />
			<Sfx name="boom" at={at73} volume={0.4} />
			<Sfx name="whoosh" at={durationInFrames - 18} volume={0.45} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 2: Karte – alle 73, dann 4 zentral vs. 69 angeschlossen */

const EXTREME_PIN: Record<string, {word: string; shift: number; stem: number}> = {
	[EXTREMES.north]: {word: 'Kiel', shift: 0, stem: 54},
	[EXTREMES.south]: {word: 'Lörrach', shift: 40, stem: 54},
	[EXTREMES.west]: {word: 'Aachen', shift: 40, stem: 70},
	[EXTREMES.east]: {word: 'Cottbus', shift: -30, stem: 60},
};
const CENTRAL_PIN: Record<CentralId, {word: string; shift: number; stem: number}> = {
	berlin: {word: 'Berlin', shift: -20, stem: 66},
	frankfurt: {word: 'Frankfurt', shift: 70, stem: 52},
	muenchen: {word: 'München', shift: 0, stem: 60},
	koeln: {word: 'Köln', shift: -10, stem: 120},
};

/** Zähler + Legende oben (y 366–556): erst „73 STÄDTE“, ab „Aber“ Legende orange 4 / weiß 69. */
const MapHeader: React.FC<{atCount: number; countDur: number; atLegend: number; atLocal: number}> = ({atCount, countDur, atLegend, atLocal}) => {
	const frame = useCurrentFrame();
	const legend = interpolate(frame, [atLegend, atLegend + 10], [0, 1], {...clamp, easing: EASE_OUT});
	const local = interpolate(frame, [atLocal, atLocal + 10], [0, 1], {...clamp, easing: EASE_OUT});
	const row = (color: string, big: React.ReactNode, title: string, sub: string, o: number, dot: number, highlight: number) => (
		<div style={{display: 'flex', alignItems: 'center', gap: 16, opacity: o, translate: `${(1 - o) * -20}px 0`, padding: '8px 14px', borderRadius: 16, background: withAlpha(color, 0.08 + 0.1 * highlight)}}>
			<span style={{width: dot, height: dot, borderRadius: dot, background: color, border: '2px solid #FFFFFF', boxShadow: `0 0 14px ${withAlpha(color, 0.8)}`, flexShrink: 0}} />
			<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 56, lineHeight: 1, color, minWidth: 74, textAlign: 'center'}}>{big}</span>
			<div style={{display: 'flex', flexDirection: 'column'}}>
				<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 27, color: COLORS.text, whiteSpace: 'nowrap'}}>{title}</span>
				<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, color: COLORS.textMuted, whiteSpace: 'nowrap'}}>{sub}</span>
			</div>
		</div>
	);
	return (
		<>
			{/* Zähler (bis zur Legende) */}
			<div style={{position: 'absolute', left: LAYOUT.left, top: 368, opacity: 1 - legend, display: 'flex', alignItems: 'center', gap: 18}}>
				{/* „73“ ist im Titelbild bereits gesprochen → steht sofort (kein Hochzählen von 0) und pulsiert mit der Welle */}
				<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 112, lineHeight: 1, color: YELLOW, textShadow: `0 0 40px ${withAlpha(YELLOW, 0.4)}`, scale: String(1 + 0.06 * interpolate(frame, [atCount, atCount + 8, atCount + countDur], [0, 1, 0], clamp))}}>{CITY_COUNT}</span>
				<div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, color: COLORS.text}}>{MAP.counterLabel}</span>
					<Chip kind="LAUT WEBSITE" size={20} style={{alignSelf: 'flex-start'}} />
					<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, color: COLORS.textMuted}}>{MAP.growth}</span>
				</div>
			</div>
			{/* Legende */}
			<div style={{position: 'absolute', left: LAYOUT.left, top: 360, display: 'flex', flexDirection: 'column', gap: 8}}>
				{row(ORANGE, '4', MAP.legendCentral.title, MAP.legendCentral.sub, legend, 26, 1 - local)}
				{row(WHITE_DOT, <CountUp value={LOCAL_COUNT} at={atLocal} dur={16} />, MAP.legendLocal.title, MAP.legendLocal.sub, local, 18, local)}
			</div>
		</>
	);
};

export const MapScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const k1 = cue(cues, 'k1', 0);
	const z1 = cue(cues, 'z1', 110);
	const z2 = cue(cues, 'z2', 230);
	const atWave = Math.max(0, k1.from - 2);
	const waveDur = Math.max(30, Math.min(70, wordFrame(cues, 'Cottbus', atWave + 60) - atWave));
	const atAachen = wordFrame(cues, 'Aachen', atWave + 40);
	const atAber = z1.from;
	const atVier = wordFrame(cues, 'vier', atAber + 30);
	const atLocal = z2.from;
	const words: Record<string, number> = {};
	for (const id of Object.keys(EXTREME_PIN)) words[id] = wordFrame(cues, EXTREME_PIN[id].word, atWave + 20);
	const cWords = Object.fromEntries(CENTRAL_IDS.map((id, i) => [id, wordFrame(cues, CENTRAL_PIN[id].word, atVier + 10 + i * 12)])) as Record<CentralId, number>;

	const cam = interpolateCamera(
		frame,
		[
			{frame: 0, cam: DE_OVERVIEW},
			{frame: atAber, cam: {x: 505, y: 690, zoom: 0.8, tilt: 43, rotate: 2}},
			{frame: atAber + 24, cam: {x: 480, y: 720, zoom: 0.86, tilt: 46, rotate: 0}},
			{frame: atLocal + 10, cam: {x: 490, y: 715, zoom: 0.84, tilt: 46, rotate: -1}},
			{frame: durationInFrames + 10, cam: {x: 500, y: 705, zoom: 0.8, tilt: 46, rotate: -4}},
		],
		EASE_IN_OUT,
	);
	const dimOthers = interpolate(frame, [atAber, atAber + 12], [0, 1], clamp) * (1 - interpolate(frame, [atLocal, atLocal + 14], [0, 1], clamp));
	const markers: PlaneBillboard[] = [
		...dotBillboards((c) => {
			const ns = RANK_NS.get(c.id)!;
			const we = RANK_WE.get(c.id)!;
			// Punkte stehen schon im Titelbild → bleiben sichtbar; die Welle Nord → Süd lässt sie nur aufleuchten
			const appear = atWave + ns * waveDur;
			const on = 1;
			const sweep = atAachen + we * 34;
			const flashWE = interpolate(frame, [sweep, sweep + 5, sweep + 16], [0, 1, 0], clamp);
			const flashIn = interpolate(frame, [appear, appear + 4, appear + 14], [0, 1, 0], clamp);
			const localWave = atLocal + 4 + ns * 26;
			const flashLocal = c.central ? 0 : interpolate(frame, [localWave, localWave + 5, localWave + 16], [0, 1, 0], clamp);
			const central = c.central ? interpolate(frame, [cWords[c.id as CentralId] - 4, cWords[c.id as CentralId] + 6], [0, 1], clamp) : 0;
			return {on, flash: Math.max(flashWE, flashIn, flashLocal), dim: c.central ? 0 : dimOthers, central};
		}),
		...Object.entries(EXTREME_PIN).map(([id, p]) => {
			const c = byId(id);
			const [x, y] = xy(c);
			const o = interpolate(frame, [words[id] - 2, words[id] + 8], [0, 1], clamp) * (1 - interpolate(frame, [atAber - 6, atAber + 4], [0, 1], clamp));
			return {key: `x-${id}`, x, y, node: <CityPin name={c.name.toUpperCase()} color={WHITE_DOT} on={o} size={0.72} shift={p.shift} stem={p.stem} />};
		}),
		...CENTRAL_IDS.map((id) => {
			const c = byId(id);
			const [x, y] = xy(c);
			const p = CENTRAL_PIN[id];
			const o = interpolate(frame, [cWords[id] - 4, cWords[id] + 8], [0, 1], clamp);
			const sub = interpolate(frame, [atLocal - 10, atLocal], [1, 0.0], clamp) > 0.5 ? MAP.centralSub[id] : undefined;
			return {key: `c-${id}`, x, y, node: <CityPin name={MAP.centralNames[id]} color={ORANGE} on={o} size={0.86} shift={p.shift} stem={p.stem} sub={sub} />};
		}),
	];
	return (
		<AbsoluteFill style={{backgroundColor: '#060920', overflow: 'hidden'}}>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse 120% 70% at 50% 60%, #1E2366 0%, #0B0E33 55%, #05071C 100%)'}} />
			<GermanyPlane camera={cam} anchor={DE_ANCHOR} markers={markers} />
			<AbsoluteFill style={{background: 'linear-gradient(rgba(5,7,26,0.9) 0%, rgba(5,7,26,0.55) 20%, rgba(5,7,26,0) 32%, rgba(5,7,26,0) 62%, rgba(5,7,26,0.55) 74%, rgba(5,7,26,0.9) 100%)'}} />
			<SceneTag text="BUNDESWEIT · 20.11." color={ORANGE} icon="pin" />
			<MapHeader atCount={atWave} countDur={waveDur + 8} atLegend={atVier - 4} atLocal={atLocal} />
			<Sfx name="riser" at={atWave} volume={0.25} />
			{Object.keys(EXTREME_PIN).map((id) => (
				<Sfx key={id} name="blip" at={words[id]} volume={0.4} />
			))}
			<Sfx name="whoosh" at={atAachen - 2} volume={0.3} />
			<Sfx name="softImpact" at={atAber} volume={0.35} />
			{CENTRAL_IDS.map((id) => (
				<Sfx key={id} name="pop" at={cWords[id]} volume={0.45} />
			))}
			<Sfx name="click" at={atLocal} volume={0.4} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 3: Frankfurt vs. Köln (nur Planungszahlen) */

const CityCard: React.FC<{side: 'left' | 'right'; at: number; atNum: number; atPlace: number; city: 'frankfurt' | 'koeln'; color: string}> = ({side, at, atNum, atPlace, city, color}) => {
	const frame = useCurrentFrame();
	const d = COMPARE[city];
	const s = useSpring(at, 14, 170);
	const place = interpolate(frame, [atPlace, atPlace + 10], [0, 1], clamp);
	const w = 420;
	const left = side === 'left' ? LAYOUT.left : LAYOUT.left + LAYOUT.width - w;
	if (frame < at - 1) return null;
	return (
		<div style={{position: 'absolute', left, top: 372, width: w, opacity: Math.min(1, s * 1.7), translate: `${(1 - s) * (side === 'left' ? -60 : 60)}px 0`}}>
			<Card color={color} style={{width: w, height: 600, overflow: 'hidden', position: 'relative'}} glow={0.25}>
				{/* Illustration oben */}
				<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 250, overflow: 'hidden', background: `linear-gradient(${withAlpha(color, 0.18)}, rgba(0,0,0,0))`}}>
					{city === 'frankfurt' ? (
						<div style={{position: 'absolute', left: -40, top: -40, width: 500}}>
							<FrankfurtSkyline width={500} showBridge={false} litRatio={0.4} />
						</div>
					) : (
						<div style={{position: 'absolute', left: 110, top: 20}}>
							<DomTowers width={200} />
						</div>
					)}
					<span style={{position: 'absolute', right: 12, top: 10, fontFamily: FONTS.body, fontWeight: 700, fontSize: 16, letterSpacing: 1.5, color: withAlpha('#FFFFFF', 0.65)}}>{COMPARE.illustration}</span>
				</div>
				<div style={{position: 'absolute', left: 24, right: 20, top: 262, display: 'flex', flexDirection: 'column', gap: 6}}>
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 52, lineHeight: 1, color: COLORS.text}}>{d.name}</span>
					<div style={{display: 'flex', alignItems: 'center', gap: 8, opacity: place, translate: `${(1 - place) * 16}px 0`}}>
						<P2Icon name="pin" size={26} color={color} />
						<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 28, color}}>{d.place}</span>
					</div>
					{'placeNote' in d ? <span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, color: COLORS.textMuted, opacity: place}}>{d.placeNote}</span> : <span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, color: COLORS.textMuted}}>{d.time}</span>}
					<div style={{marginTop: 10, fontFamily: FONTS.heading, fontWeight: 900, fontSize: city === 'koeln' ? 46 : 64, lineHeight: 1, color: YELLOW, whiteSpace: 'nowrap', textShadow: `0 0 30px ${withAlpha(YELLOW, 0.35)}`}}>
						{/* Zähler laufen vom Erscheinen der Karte bis zum gesprochenen Wert (kein stehendes „0“) */}
						{city === 'frankfurt' ? (
							<>
								<span style={{fontSize: 34}}>BIS ZU </span>
								<CountUp value={d.max} at={at} dur={Math.max(14, atNum - at + 4)} />
							</>
						) : (
							<>
								<CountUp value={d.min} at={at} dur={Math.max(12, atNum - at + 2)} />
								<span>–</span>
								<CountUp value={d.max} at={at} dur={Math.max(16, atNum - at + 14)} />
							</>
						)}
					</div>
					<span style={{marginTop: 6, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 22, letterSpacing: 0.8, lineHeight: 1.2, color}}>{d.kind}</span>
				</div>
			</Card>
		</div>
	);
};

/** Balkenvergleich: Frankfurt 0–4.000 (Erwartung), Köln 5.000–10.000 (Spanne der Anmelderinnen) – Skala 0–10.000. */
const RangeBars: React.FC<{atFfm: number; atKoeln: number}> = ({atFfm, atKoeln}) => {
	const frame = useCurrentFrame();
	const W = 640;
	const sx = (v: number) => (v / 10000) * W;
	const f = interpolate(frame, [atFfm, atFfm + 20], [0, 1], {...clamp, easing: EASE_OUT});
	const k = interpolate(frame, [atKoeln, atKoeln + 22], [0, 1], {...clamp, easing: EASE_OUT});
	const bar = (label: string, color: string, from: number, to: number, t: number, hatched: boolean) => (
		<div style={{display: 'flex', alignItems: 'center', gap: 16, height: 46}}>
			<span style={{width: 190, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, color: COLORS.text, textAlign: 'right'}}>{label}</span>
			<div style={{position: 'relative', width: W, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.06)'}}>
				<div
					style={{
						position: 'absolute',
						left: sx(from),
						width: sx(to - from) * t,
						top: 0,
						bottom: 0,
						borderRadius: 8,
						background: hatched ? `repeating-linear-gradient(135deg, ${color} 0 10px, ${withAlpha(color, 0.45)} 10px 20px)` : color,
						boxShadow: `0 0 18px ${withAlpha(color, 0.5)}`,
					}}
				/>
			</div>
		</div>
	);
	return (
		<div style={{position: 'absolute', left: LAYOUT.left, top: 1000, opacity: Math.max(f > 0 ? 1 : 0, 0)}}>
			{bar('FRANKFURT', BLUE, 0, 4000, f, false)}
			{bar('KÖLN', GREEN, 5000, 10000, k, true)}
			<div style={{display: 'flex', gap: 0, marginLeft: 206, width: W, justifyContent: 'space-between', fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, color: COLORS.textMuted}}>
				<span>0</span>
				<span>5.000</span>
				<span>10.000</span>
			</div>
		</div>
	);
};

/** Stempel „ANGABEN ZUR PLANUNG – KEINE TATSÄCHLICHE TEILNEHMERZAHL“ bei „Wichtig: Das sind Planungszahlen“. */
const PlanStamp: React.FC<{at: number}> = ({at}) => {
	const frame = useCurrentFrame();
	const s = interpolate(frame, [at, at + 7], [0, 1], {...clamp, easing: EASE_OUT});
	if (frame < at) return null;
	return (
		<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 640, display: 'flex', justifyContent: 'center'}}>
			<div style={{padding: '14px 26px', borderRadius: 18, border: `6px solid ${YELLOW}`, background: 'rgba(8,10,28,0.94)', rotate: '-6deg', scale: String(1.5 - 0.5 * s), opacity: s, boxShadow: '0 30px 70px rgba(0,0,0,0.7)', textAlign: 'center'}}>
				<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 52, letterSpacing: 1, color: YELLOW, whiteSpace: 'nowrap'}}>{COMPARE.stamp}</div>
				<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: COLORS.text, whiteSpace: 'nowrap'}}>{COMPARE.stampSub}</div>
			</div>
		</div>
	);
};

export const CompareScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const f1 = cue(cues, 'f1', 0);
	const k2 = cue(cues, 'k2', 90);
	const n1 = cue(cues, 'n1', 200);
	const atFfmNum = wordFrame(cues, '4.000', f1.from + 40);
	const atWeseler = wordFrame(cues, 'Weseler', f1.from + 60);
	const atKoeln = Math.max(6, k2.from - 4);
	const atKNum = wordFrame(cues, '5.000', k2.from + 50);
	const atDeutz = wordFrame(cues, 'Deutzer', k2.from + 80);
	const atStamp = wordFrame(cues, 'Planungszahlen', n1.from + 14) - 2;
	const drift = interpolate(frame, [0, durationInFrames], [0, 1]);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{scale: String(1.08 - drift * 0.06), opacity: 0.5}}>
				<NightCity mood={blendMood(MOODS.dusk, MOODS.calm, 0.4)} progress={0.5 + drift * 0.2} litRatio={0.35} bokeh={12} showPromenade={false} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.92) 0%, rgba(4,6,20,0.78) 40%, rgba(4,6,20,0.86) 100%)'}} />
			<SceneTag text="FRANKFURT VS. KÖLN" color={BLUE} icon="users" />
			<CityCard side="left" city="frankfurt" color={BLUE} at={0} atNum={atFfmNum} atPlace={atWeseler - 4} />
			<CityCard side="right" city="koeln" color={GREEN} at={atKoeln} atNum={atKNum} atPlace={atDeutz - 4} />
			<RangeBars atFfm={Math.max(4, atFfmNum - 10)} atKoeln={atKNum - 6} />
			<In at={Math.max(atKoeln + 20, atDeutz)} style={{left: LAYOUT.left, top: 1150, width: LAYOUT.width}}>
				<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, color: COLORS.textMuted}}>{COMPARE.frankfurt.extra}</span>
			</In>
			<PlanStamp at={atStamp} />
			<Sfx name="whoosh" at={0} volume={0.3} />
			<Sfx name="softImpact" at={atFfmNum} volume={0.4} />
			<Sfx name="whoosh" at={atKoeln} volume={0.35} />
			<Sfx name="softImpact" at={atKNum} volume={0.45} />
			<Sfx name="stamp" at={atStamp + 4} volume={0.6} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 4: Drei Arten von Zahlen */

const KIND_STYLE: Record<(typeof NUMBER_KINDS)[number]['id'], {color: string; chip: Kind}> = {
	online: {color: ORANGE, chip: 'LAUT WEBSITE'},
	plan: {color: YELLOW, chip: 'PLANUNG'},
	real: {color: ACCENT.no, chip: 'OFFEN'},
};

const ROW_TOP = 372;
const ROW_STEP = 300;
const ROW_H = 250;

const NumberRow: React.FC<{i: number; at: number; active: number; children: React.ReactNode; valueNode: React.ReactNode}> = ({i, at, active, children, valueNode}) => {
	const k = NUMBER_KINDS[i];
	const st = KIND_STYLE[k.id];
	const s = useSpring(at, 14, 170);
	const frame = useCurrentFrame();
	if (frame < at - 1) return null;
	return (
		<div style={{position: 'absolute', left: LAYOUT.left, top: ROW_TOP + i * ROW_STEP, width: LAYOUT.width, opacity: Math.min(1, s * 1.7) * (0.45 + 0.55 * active), translate: `${(1 - s) * 80}px 0`, scale: String(0.97 + 0.03 * active)}}>
			<Card color={st.color} style={{height: ROW_H, display: 'flex', alignItems: 'center', gap: 22, padding: '0 26px', position: 'relative'}} glow={0.12 + 0.2 * active}>
				<div style={{width: 210, height: 230, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>{children}</div>
				<div style={{display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 24, color: withAlpha(st.color, 0.9)}}>{i + 1}</span>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 32, color: COLORS.text, whiteSpace: 'nowrap'}}>{k.title}</span>
					</div>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 54, lineHeight: 1.05, color: st.color, whiteSpace: 'nowrap'}}>{valueNode}</div>
					<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 24, color: COLORS.textMuted}}>{k.sub}</span>
					<div>
						<Chip kind={st.chip} size={19} />
					</div>
				</div>
			</Card>
		</div>
	);
};

export const NumbersScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const n2 = cue(cues, 'n2', 0);
	const n3 = cue(cues, 'n3', 120);
	const atOnline = Math.max(2, n2.from - 2);
	const at20 = wordFrame(cues, '20.000', n2.from + 40);
	const atGarantie = wordFrame(cues, 'Garantie', n2.from + 70);
	const atReal = Math.max(atOnline + 20, n3.from - 2);
	const realActive = interpolate(frame, [atReal, atReal + 8], [0, 1], clamp);
	const onlineActive = interpolate(frame, [atOnline, atOnline + 8], [0, 1], clamp) * (1 - realActive);
	const drift = interpolate(frame, [0, durationInFrames], [0, 1]);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{background: `radial-gradient(ellipse 90% 60% at ${40 + drift * 20}% 40%, #1C2160 0%, #0A0D2E 60%, #05071A 100%)`}} />
			<Stars seed="bw12n" n={30} height={1920} />
			<SceneTag text="3 ARTEN VON ZAHLEN" color={YELLOW} icon="info" />
			<NumberRow i={1} at={0} active={1 - Math.max(onlineActive, realActive) * 0.8} valueNode={NUMBER_KINDS[1].value}>
				<PlanDoc width={150} at={0} color={YELLOW} />
			</NumberRow>
			<NumberRow i={0} at={atOnline} active={onlineActive} valueNode={<CountUp value={PLEDGES.total} at={atOnline} dur={Math.max(14, at20 - atOnline + 4)} prefix="≈ " />}>
				<TicketPhone width={118} at={atOnline + 4} color={ORANGE} value="✓" />
			</NumberRow>
			<NumberRow i={2} at={atReal} active={realActive} valueNode={NUMBER_KINDS[2].value}>
				<CrowdQuestion width={210} at={atReal + 6} color={ACCENT.no} />
			</NumberRow>
			{/* Zitat „keine Garantie“ + Städtezahlen (nur Bild) */}
			<In at={atGarantie - 4} style={{left: LAYOUT.left, top: ROW_TOP + ROW_H + 8, width: LAYOUT.width}} dy={14} out={1 - realActive}>
				<div style={{display: 'flex', gap: 8, flexWrap: 'nowrap', justifyContent: 'center', fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.text}}>
					{PLEDGES.cities.map((c) => (
						<span key={c.name} style={{padding: '4px 10px', borderRadius: 10, background: 'rgba(8,10,28,0.92)', border: `1.5px solid ${withAlpha(ORANGE, 0.6)}`, whiteSpace: 'nowrap'}}>
							{c.name} {c.value}
						</span>
					))}
				</div>
			</In>
			<Sfx name="notify" at={atOnline + 2} volume={0.45} />
			<Sfx name="softImpact" at={at20} volume={0.4} />
			<Sfx name="pop" at={atReal + 6} volume={0.5} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 5: Forderungen laut Website */

export const DemandsScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const d1 = cue(cues, 'd1', 0);
	const ats: Record<DemandIconName, number> = {
		bildung: wordFrame(cues, 'Bildung', d1.from + 50),
		leben: wordFrame(cues, 'bezahlbares', d1.from + 75),
		wehrpflicht: wordFrame(cues, 'Nein', d1.from + 110),
	};
	const colors: Record<DemandIconName, string> = {bildung: BLUE, leben: GREEN, wehrpflicht: RED};
	const drift = interpolate(frame, [0, durationInFrames], [0, 1]);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse 100% 60% at 50% 30%, #2A1E5C 0%, #0D0B2E 60%, #05071A 100%)'}} />
			<div style={{position: 'absolute', left: -60 - drift * 40, top: 0, width: 1240, height: 1920, opacity: 0.55}}>
				<Crowd width={1240} baseY={1330} rows={3} perRow={11} seed="bw12-crowd" personHeight={150} marchSpeed={0.5} signRatio={0.3} />
			</div>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(5,7,26,0.94) 0%, rgba(5,7,26,0.7) 45%, rgba(5,7,26,0.45) 62%, rgba(5,7,26,0.85) 76%, rgba(5,7,26,0.95) 100%)'}} />
			<SceneTag text="FORDERUNGEN" color="#B794F6" icon="megaphone" />
			<div style={{position: 'absolute', left: LAYOUT.left, top: 372, display: 'flex', alignItems: 'center', gap: 12}}>
				<Chip kind="POSITION" size={22} />
				<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, color: COLORS.textMuted}}>laut Website · {DEMANDS.note}</span>
			</div>
			{DEMANDS.items.map((it, i) => {
				const id = it.id as DemandIconName;
				const at = ats[id] - 4;
				const draw = interpolate(frame, [at, at + 16], [0, 1], {...clamp, easing: EASE_OUT});
				return (
					<In key={id} at={i === 0 ? Math.min(at, 8) : at} dx={-60} dy={0} style={{left: LAYOUT.left, top: 440 + i * 240, width: LAYOUT.width}}>
						<Card color={colors[id]} style={{height: 210, display: 'flex', alignItems: 'center', gap: 26, padding: '0 28px'}} glow={0.2}>
							<div style={{width: 140, height: 140, borderRadius: 70, background: withAlpha(colors[id], 0.14), border: `2px solid ${withAlpha(colors[id], 0.6)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
								<DemandIcon name={id} size={100} color={colors[id]} draw={i === 0 && frame < at ? 1 : draw} />
							</div>
							<div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
								<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 44, lineHeight: 1.05, color: COLORS.text}}>{it.title}</span>
								<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 26, color: COLORS.textMuted}}>{it.sub}</span>
							</div>
						</Card>
					</In>
				);
			})}
			<div style={{position: 'absolute', right: 160, top: 1196, fontFamily: FONTS.body, fontWeight: 700, fontSize: 18, letterSpacing: 1.5, color: withAlpha('#FFFFFF', 0.55)}}>ILLUSTRATION</div>
			{(Object.keys(ats) as DemandIconName[]).map((id) => (
				<Sfx key={id} name="pop" at={ats[id] - 2} volume={0.45} />
			))}
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 6: Morgen zeigt sich … Welche Stadt wird am größten? */

export const EndScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const e1 = cue(cues, 'e1', 0);
	const q1 = cue(cues, 'q1', 70);
	const atQ = Math.max(e1.from + 20, q1.from - 4);
	const q = springIn({frame, fps, delay: atQ, damping: 13, stiffness: 170});
	const cam = interpolateCamera(
		frame,
		[
			{frame: 0, cam: {x: 500, y: 700, zoom: 0.68, tilt: 48, rotate: 6}},
			{frame: durationInFrames, cam: {x: 500, y: 690, zoom: 0.74, tilt: 44, rotate: -4}},
		],
		EASE_IN_OUT,
	);
	const markers: PlaneBillboard[] = [
		...dotBillboards((c) => ({on: 1, flash: c.central ? 0 : interpolate(frame, [6 + RANK_NS.get(c.id)! * 30, 12 + RANK_NS.get(c.id)! * 30, 22 + RANK_NS.get(c.id)! * 30], [0, 1, 0], clamp), dim: 0, central: 1})),
		...CENTRAL_IDS.map((id) => {
			const c = byId(id);
			const [x, y] = xy(c);
			const p = CENTRAL_PIN[id];
			return {key: `e-${id}`, x, y, node: <CityPin name={MAP.centralNames[id]} color={ORANGE} on={1} size={0.8 + 0.06 * Math.sin(frame / 7 + x)} shift={p.shift} stem={p.stem} />};
		}),
	];
	return (
		<AbsoluteFill style={{backgroundColor: '#060920', overflow: 'hidden'}}>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse 120% 70% at 50% 60%, #1E2366 0%, #0B0E33 55%, #05071C 100%)'}} />
			<GermanyPlane camera={cam} anchor={[540, 940]} markers={markers} />
			<AbsoluteFill style={{background: 'linear-gradient(rgba(5,7,26,0.9) 0%, rgba(5,7,26,0.5) 22%, rgba(5,7,26,0) 34%, rgba(5,7,26,0) 60%, rgba(5,7,26,0.6) 72%, rgba(5,7,26,0.92) 100%)'}} />
			<SceneTag text="MORGEN, 20.11." color={RED} icon="clock" />
			<In at={0} style={{left: LAYOUT.left, top: 380}} dx={-40} dy={0}>
				<CalendarBlock day={END.day.day} month={END.day.month} weekday={END.day.weekday} width={170} accent={RED} tilt={-5} />
			</In>
			<In at={6} style={{left: LAYOUT.left + 210, top: 404, width: 640}} dy={16}>
				<div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, lineHeight: 1.08, color: COLORS.text}}>{CITY_COUNT} STÄDTE · 1 TAG</span>
					<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 24, color: COLORS.textMuted}}>Wie groß es wird, zeigt sich erst morgen.</span>
				</div>
			</In>
			{frame >= atQ - 1 ? (
				<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 1060, display: 'flex', justifyContent: 'center', opacity: Math.min(1, q * 1.7), translate: `0 ${(1 - q) * 40}px`, scale: String(0.9 + 0.1 * q)}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 26px', borderRadius: 22, background: 'rgba(8,10,28,0.95)', border: `3px solid ${YELLOW}`, boxShadow: `0 20px 50px rgba(0,0,0,0.6), 0 0 30px ${withAlpha(YELLOW, 0.25)}`}}>
						<P2Icon name="chat" size={40} color={YELLOW} />
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, color: COLORS.text, whiteSpace: 'nowrap'}}>{END.question}</span>
					</div>
				</div>
			) : null}
			<Sfx name="paper" at={2} volume={0.4} />
			<Sfx name="notify" at={atQ} volume={0.5} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 7: Abo-Aufruf mit offiziellem Logo */

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
					<div style={{position: 'absolute', left: '50%', bottom: -26, translate: '-50% 0', scale: String(press), width: 68, height: 68, borderRadius: 34, background: followed ? GREEN : RED, border: '4px solid #FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 24px rgba(0,0,0,0.5)'}}>
						<P2Icon name={followed ? 'check' : 'plus'} size={38} color="#FFFFFF" stroke={3.4} />
					</div>
				</div>
				<span style={{marginTop: 12, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 54, color: COLORS.text}}>{handleWithAt()}</span>
				<div style={{padding: '12px 30px 14px', borderRadius: 20, background: RED, boxShadow: '0 20px 50px rgba(255,59,78,0.35)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 42, color: '#FFFFFF', scale: String(followed ? 1 + 0.035 * Math.sin((frame - atCta - 28) / 5) : 1)}}>{CTA.title}</div>
				<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 24, letterSpacing: 2.5, color: YELLOW}}>{CTA.sub}</span>
			</div>
			<Sfx name="pop" at={atCta} volume={0.6} />
			<Sfx name="click" at={atCta + 26} volume={0.6} />
		</AbsoluteFill>
	);
};

/** Für Tests/Doku: Stand im Bild. */
export const SCENE_STAND = STAND;
