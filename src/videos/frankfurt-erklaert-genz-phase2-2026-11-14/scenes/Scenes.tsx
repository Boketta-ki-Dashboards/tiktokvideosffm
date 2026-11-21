import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {BrandLogo} from '../../../components/brand/BrandLogo';
import {interpolateCamera, type PlaneBillboard, type PlaneCamera} from '../../../components/map/TiltedPlane';
import {clamp, EASE_IN_OUT, EASE_OUT, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {handleWithAt} from '../../../theme/brand';
import {COLORS, FONTS} from '../../../theme/tokens';
import {Equation, SourceBar} from '../../../formats/frankfurt-erklaert/components';
import {ACCENT, FORMAT} from '../../../formats/frankfurt-erklaert/theme';
import {blendMood, MOODS, NightCity} from '../../frankfurt-2026-11-20-ausblick/premium/NightCity';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {BERLIN, BERLIN_CONNECTOR, CHARGES, CITIES, CITIES_SOURCE, CITY_POS, type CityId, CONTEXT, COVER, CTA, INCIDENTS, NEXT, OTHER_CITIES, QUESTION, ROUTE, STATS, STATS_SOURCE} from '../content';
import {PHASE2_COVER_LAYOUT} from '../cover-layout';
import {BerlinPlane, berlinXY} from '../visuals/BerlinPlane';
import {CityPin, germanyGeo, GermanyPlane} from '../visuals/GermanyPlane';
import {IncidentStreet} from '../visuals/IncidentStreet';
import {CalendarBlock, Card, CityGlyph, CountUp, IconOrb, MapShade, P2Icon, type P2IconName, Stars, Status, Tag, useSpring} from './kit';

const GENZ = ACCENT.brand;
const deXY = (id: CityId): [number, number] => germanyGeo().project(CITY_POS[id]);

/* ------------------------------------------------------------------ Kameras der Deutschlandkarte */

const COVER_CAM: PlaneCamera = {x: 500, y: 650, zoom: 0.36, tilt: 40, rotate: -4};
const COVER_ANCHOR: [number, number] = [540, 700];
/** Übersicht – Ende des Titelbilds = Anfang der Städte-Szene (nahtlos). */
export const DE_OVERVIEW: PlaneCamera = {x: 500, y: 640, zoom: 0.62, tilt: 44, rotate: 0};
const DE_ANCHOR: [number, number] = [540, 880];
const cityCam = (id: CityId, zoom = 1.2, rotate = 0): PlaneCamera => {
	const [x, y] = deXY(id);
	return {x, y, zoom, tilt: 52, rotate};
};

/** Kopfzeile „PHASE 2 · 14. NOVEMBER“ (Ende Titelbild + Städte-Szene, nahtlos). */
const PhaseTag: React.FC = () => (
	<div style={{display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 16px 6px 8px', borderRadius: 12, background: 'rgba(8,10,28,0.9)', border: `2px solid ${GENZ}`, boxShadow: `0 8px 24px ${withAlpha(GENZ, 0.25)}`}}>
		<span style={{width: 34, height: 34, borderRadius: 8, background: GENZ, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
			<P2Icon name="megaphone" size={24} color="#FFFFFF" stroke={2.6} />
		</span>
		<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 24, letterSpacing: 1.5, color: COLORS.text}}>PHASE 2 · 14. NOVEMBER · BUNDESWEIT</span>
	</div>
);

/* ------------------------------------------------------------------ Szene 1: Titelbild */

/**
 * Titelbild (Video-Frame 0 und PNG): Serientitel, 2,5D-Deutschlandkarte mit vier Orten, rote Karte „GEN Z REGELT – PHASE 2“,
 * große gelbe „20“ + „VORLÄUFIGE FESTNAHMEN IN BERLIN“, Unterzeile, Logo + Account – kompakt um die Bildmitte nach COVER_ZONE.
 * `morph` (0–1) blendet die Texte aus und fährt die Karte in die Übersicht der Städte-Szene.
 */
export const Phase2Cover: React.FC<{morph?: number; pulse?: number; thumbnail?: boolean}> = ({morph = 0, pulse = 0, thumbnail = false}) => {
	const frame = useCurrentFrame();
	const L = PHASE2_COVER_LAYOUT;
	const m = EASE_IN_OUT(Math.min(1, Math.max(0, morph)));
	const cam = interpolateCamera(m * 100, [
		{frame: 0, cam: {...COVER_CAM, rotate: COVER_CAM.rotate! + Math.sin(frame / 40) * 1.5}},
		{frame: 100, cam: DE_OVERVIEW},
	], (t) => t);
	const anchor: [number, number] = [540, COVER_ANCHOR[1] + (DE_ANCHOR[1] - COVER_ANCHOR[1]) * m];
	const text = 1 - Math.min(1, m * 1.6);
	const pinSize = 0.78 + 0.22 * m;
	const pop = 1 + 0.12 * pulse;
	const markers: PlaneBillboard[] = [
		{key: 'bremen', id: 'bremen' as CityId, name: 'BREMEN', color: ACCENT.yes, shift: -20, stem: 46},
		{key: 'karlsruhe', id: 'karlsruhe' as CityId, name: 'KARLSRUHE', color: ACCENT.yes, shift: -86, stem: 64},
		{key: 'stuttgart', id: 'stuttgart' as CityId, name: 'STUTTGART', color: ACCENT.signal, shift: 70, stem: 30},
		{key: 'berlin', id: 'berlin' as CityId, name: 'BERLIN', color: GENZ, shift: 10, stem: 54},
	].map((p) => {
		const [x, y] = deXY(p.id);
		return {key: p.key, x, y, node: <CityPin name={p.name} color={p.color} on={1 - interpolate(m, [0.55, 0.95], [0, 1], clamp)} size={pinSize * (p.key === 'berlin' ? 1.12 * pop : pop)} shift={p.shift} stem={p.stem} />};
	});
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse 110% 60% at 50% 46%, #2A2E78 0%, #121546 52%, #060920 100%)'}} />
			<Stars seed="p2c" n={46} height={520} />
			<GermanyPlane camera={cam} anchor={anchor} markers={markers} glow={1} />
			<AbsoluteFill style={{background: `linear-gradient(rgba(4,6,20,${0.55 * text}) 0%, rgba(4,6,20,0) 18%, rgba(4,6,20,0) 42%, rgba(4,6,20,${0.55 * text}) 50%, rgba(4,6,20,${0.9 * text}) 60%, rgba(4,6,20,${0.92 * text}) 74%, rgba(4,6,20,${0.7 * text}) 100%)`}} />
			{m > 0.4 ? (
				<div style={{position: 'absolute', left: 64, top: 290, opacity: interpolate(m, [0.4, 0.8], [0, 1], clamp), translate: `${interpolate(m, [0.4, 0.8], [-30, 0], clamp)}px 0`}}>
					<PhaseTag />
				</div>
			) : null}
			<div style={{opacity: text, translate: `0 ${(1 - text) * -30}px`}}>
				{/* Serientitel */}
				<div style={{position: 'absolute', left: 0, right: 0, top: L.brandTop, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16}}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 50, lineHeight: 0.98, color: COLORS.text, textAlign: 'right', textShadow: '0 6px 24px rgba(0,0,0,0.8)'}}>
						FRANKFURT
						<br />
						ERKLÄRT
					</div>
					<div style={{padding: '9px 16px', borderRadius: 10, background: ACCENT.brand, boxShadow: '0 10px 26px rgba(255,59,78,0.4)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, letterSpacing: 3, color: '#FFFFFF'}}>{FORMAT.sub}</div>
				</div>
				{/* rote Themenkarte */}
				<div style={{position: 'absolute', left: 0, right: 0, top: L.cardTop, display: 'flex', justifyContent: 'center'}}>
					<div style={{padding: '10px 24px 13px', borderRadius: 20, background: 'linear-gradient(160deg, #FF6A78 0%, #FF4D5E 50%, #D93448 100%)', boxShadow: '0 5px 0 #B32A3C, 0 10px 0 #8E1F2E, 0 40px 70px rgba(0,0,0,0.6)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: L.cardFont, maxWidth: L.cardMaxWidth, lineHeight: 1.05, color: '#FFFFFF', whiteSpace: 'nowrap'}}>{COVER.kicker}</div>
				</div>
				{/* große 20 + Zeilen */}
				<div style={{position: 'absolute', left: 0, right: 0, top: L.bigTop, height: L.bigBottom - L.bigTop, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22}}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: L.bigSize, lineHeight: 0.9, letterSpacing: -6, color: COLORS.signal, textShadow: `0 0 60px ${withAlpha(COLORS.signal, 0.45)}, 0 20px 50px rgba(0,0,0,0.7)`}}>{COVER.big}</div>
					<div style={{display: 'flex', flexDirection: 'column'}}>
						{COVER.bigLines.map((l, i) => (
							<div key={l} style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: L.linesSize, lineHeight: 1.04, color: i === 2 ? GENZ : COLORS.text, textShadow: '0 6px 20px rgba(0,0,0,0.9)'}}>
								{l}
							</div>
						))}
					</div>
				</div>
				<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.cityLineTop, textAlign: 'center', fontFamily: FONTS.body, fontWeight: 800, fontSize: 27, color: COLORS.text, textShadow: '0 6px 24px rgba(0,0,0,0.9)'}}>
					<span style={{color: ACCENT.yes}}>●</span> {COVER.sub}
				</div>
				<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.metaTop, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14}}>
					<BrandLogo size={52} />
					<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 30, color: COLORS.textMuted}}>{handleWithAt()}</span>
				</div>
				{thumbnail ? (
					<div style={{position: 'absolute', left: L.sideMin - 40, right: L.sideMin - 40, top: L.chipsTop, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12}}>
						<div style={{display: 'flex', gap: 12}}>
							<div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 14, background: 'rgba(8,10,28,0.9)', border: `2px solid ${COLORS.signal}`}}>
								<P2Icon name="clock" size={24} color={COLORS.signal} />
								<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 24, color: COLORS.text, whiteSpace: 'nowrap'}}>{COVER.date}</span>
							</div>
							<div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 14, background: 'rgba(8,10,28,0.9)', border: `2px solid ${withAlpha('#FFFFFF', 0.4)}`}}>
								<P2Icon name="pin" size={24} color="#C9CEDF" />
								<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 24, color: COLORS.text, whiteSpace: 'nowrap'}}>{COVER.chipsNote}</span>
							</div>
						</div>
					</div>
				) : null}
			</div>
		</AbsoluteFill>
	);
};

/** Szene 1 – Titelbild im Video (ab Frame 0 vollständig); bei „Städten“ pulsieren die Orte, bei „Phase“ Verwandlung in die Karte. */
export const CoverScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const h2 = cue(cues, 'hook2', 34);
	const atCities = Math.max(36, wordFrame(cues, 'Städten', h2.from + 60));
	const atMorph = Math.max(atCities + 10, Math.min(wordFrame(cues, 'Phase', h2.to - 30), durationInFrames - 30));
	const pulse = interpolate(frame, [atCities, atCities + 6, atCities + 16], [0, 1, 0], clamp);
	const morph = interpolate(frame, [atMorph, durationInFrames - 2], [0, 1], clamp);
	return (
		<AbsoluteFill>
			<Phase2Cover morph={morph} pulse={pulse} />
			<Sfx name="impact" at={0} volume={0.5} />
			<Sfx name="blip" at={atCities} volume={0.6} />
			<Sfx name="whoosh" at={atMorph} volume={0.45} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 2: drei Städte */

type City = (typeof CITIES)[number];

const CityCard: React.FC<{c: City; at: number; atNum: number; atVerdict: number; out?: number}> = ({c, at, atNum, atVerdict, out}) => {
	const frame = useCurrentFrame();
	const s = useSpring(at, 14, 170);
	const v = useSpring(atVerdict, 12, 190);
	const exit = out === undefined ? 0 : interpolate(frame, [out - 2, out + 8], [0, 1], {...clamp, easing: EASE_IN_OUT});
	if (frame < at - 1 || exit >= 1) return null;
	const draw = interpolate(frame, [at, at + 26], [0, 1], {...clamp, easing: EASE_OUT});
	return (
		<div style={{position: 'absolute', left: 64, width: 866, top: 350, opacity: Math.min(1, s * 1.6) * (1 - exit), translate: `${(1 - s) * 140 - exit * 160}px 0`}}>
			<Card color={c.color} style={{padding: '18px 22px', display: 'flex', gap: 20, alignItems: 'center'}} glow={0.25}>
				<CityGlyph kind={c.glyph} color={c.color} size={128} draw={draw} />
				<div style={{flex: 1, minWidth: 0}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 44, letterSpacing: 2, color: COLORS.text}}>{c.name}</span>
						<span style={{marginLeft: 'auto'}}>
							<Status kind="LAUT POLIZEI" size={16} />
						</span>
					</div>
					<div style={{display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 2}}>
						{c.count !== null ? (
							<>
								<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 30, color: COLORS.textMuted}}>{c.prefix}</span>
								<CountUp value={c.count} at={at + 4} dur={Math.max(14, atNum + 12 - at - 4)} style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 84, lineHeight: 1, color: COLORS.signal}} />
							</>
						) : (
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 58, lineHeight: 1.1, color: COLORS.signal}}>{'countText' in c ? c.countText : ''}</span>
						)}
					</div>
					<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted}}>{c.countNote}</div>
					<div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 10, opacity: Math.min(1, v * 1.8), translate: `${(1 - v) * 30}px 0`}}>
						<span style={{display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 12, background: c.color, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, color: ACCENT.ink, whiteSpace: 'nowrap'}}>
							<P2Icon name={c.id === 'stuttgart' ? 'info' : 'check'} size={26} color={ACCENT.ink} stroke={3} />
							{c.verdict}
						</span>
					</div>
					<div style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, lineHeight: 1.25, color: COLORS.text, marginTop: 8, opacity: Math.min(1, v * 1.8)}}>{c.verdictNote}</div>
				</div>
			</Card>
		</div>
	);
};

const PIN_STYLE: Record<'bremen' | 'karlsruhe' | 'stuttgart', {shift: number; stem: number}> = {
	bremen: {shift: 0, stem: 70},
	karlsruhe: {shift: -96, stem: 112},
	stuttgart: {shift: 70, stem: 48},
};

export const CitiesScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const segs = [cue(cues, 'bremen', 0), cue(cues, 'karlsruhe', 110), cue(cues, 'stuttgart', 200)];
	const ats = [Math.max(0, segs[0].from), segs[1].from, segs[2].from];
	const atNums = [wordFrame(cues, '670', ats[0] + 30) - 6, wordFrame(cues, '220', ats[1] + 16) - 6, ats[2] + 10];
	const atVerdict = [wordFrame(cues, 'friedlich', ats[0] + 60) - 4, wordFrame(cues, 'weitgehend', ats[1] + 40) - 4, Math.min(wordFrame(cues, 'Demozug', ats[2] + 40), ats[2] + 50) - 4];
	const atBack = Math.max(ats[2] + 40, durationInFrames - 30);
	const cam = interpolateCamera(
		frame,
		[
			{frame: 0, cam: DE_OVERVIEW},
			{frame: ats[0] + 22, cam: cityCam('bremen', 1.15, -6)},
			{frame: ats[1] - 2, cam: cityCam('bremen', 1.22, -2)},
			{frame: ats[1] + 20, cam: cityCam('karlsruhe', 1.2, 4)},
			{frame: ats[2] - 2, cam: cityCam('karlsruhe', 1.26, 6)},
			{frame: ats[2] + 18, cam: cityCam('stuttgart', 1.2, 2)},
			{frame: atBack, cam: cityCam('stuttgart', 1.26, -2)},
			{frame: durationInFrames + 10, cam: {...DE_OVERVIEW, x: 560, y: 600, zoom: 0.7, rotate: -4}},
		],
		EASE_IN_OUT,
	);
	const back = interpolate(frame, [atBack, durationInFrames], [0, 1], clamp);
	const markers: PlaneBillboard[] = [
		...CITIES.map((c, i) => {
			const [x, y] = deXY(c.id);
			const on = interpolate(frame, [ats[i] + 6, ats[i] + 16], [0, 1], clamp);
			const sub = c.count !== null ? `${c.prefix} ${c.count.toLocaleString('de-DE')}` : 'MEHRERE HUNDERT';
			return {key: c.id, x, y, node: <CityPin name={c.name} color={c.color} on={on} sub={sub} shift={PIN_STYLE[c.id].shift} stem={PIN_STYLE[c.id].stem} />};
		}),
		...(['duesseldorf', 'wuppertal'] as CityId[]).map((id) => {
			const [x, y] = deXY(id);
			const o = interpolate(frame, [ats[2] + 30, ats[2] + 40], [0, 1], clamp);
			return {key: id, x, y, node: <div style={{width: 16, height: 16, borderRadius: 8, background: '#C9CEDF', border: '3px solid #FFFFFF', opacity: o, marginBottom: -8}} />};
		}),
		(() => {
			const [x, y] = deXY('berlin');
			return {key: 'berlin', x, y, node: <CityPin name="BERLIN" color={GENZ} on={back} sub="?" size={1.1} />};
		})(),
	];
	const otherO = interpolate(frame, [ats[2] + 30, ats[2] + 40], [0, 1], clamp);
	return (
		<AbsoluteFill style={{backgroundColor: '#060920', overflow: 'hidden'}}>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse 120% 70% at 50% 60%, #1E2366 0%, #0B0E33 55%, #05071C 100%)'}} />
			<GermanyPlane camera={cam} anchor={[540, 920]} markers={markers} />
			<MapShade top={0.92} bottom={0.88} />
			<div style={{position: 'absolute', left: 64, top: 290}}>
				<PhaseTag />
			</div>
			{CITIES.map((c, i) => (
				<CityCard key={c.id} c={c} at={ats[i]} atNum={atNums[i]} atVerdict={atVerdict[i]} out={i < 2 ? ats[i + 1] : undefined} />
			))}
			<div style={{position: 'absolute', left: 64, top: 1110, opacity: otherO, translate: `0 ${(1 - otherO) * 20}px`, display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', borderRadius: 14, background: 'rgba(8,10,28,0.9)', border: `2px solid ${withAlpha('#C9CEDF', 0.6)}`}}>
				<span style={{width: 14, height: 14, borderRadius: 7, background: '#C9CEDF', border: '2px solid #FFFFFF'}} />
				<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 23, color: COLORS.text}}>{OTHER_CITIES.text}</span>
				<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, color: COLORS.textMuted}}>({OTHER_CITIES.source})</span>
			</div>
			<SourceBar text={CITIES_SOURCE} at={8} />
			{ats.map((a, i) => (
				<React.Fragment key={i}>
					<Sfx name="whoosh" at={a} volume={0.35} />
					<Sfx name="blip" at={a + 8} volume={0.55} />
					<Sfx name="softImpact" at={atNums[i] + 10} volume={0.4} />
				</React.Fragment>
			))}
			<Sfx name="click" at={atVerdict[2]} volume={0.5} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 3: Berlin */

const Marker: React.FC<{title: string; sub: string; color: string; on: number}> = ({title, sub, color, on}) => (
	<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: on, scale: String(0.7 + 0.3 * on), transformOrigin: '50% 100%'}}>
		<div style={{padding: '6px 14px 8px', borderRadius: 12, background: 'rgba(8,10,28,0.94)', border: `3px solid ${color}`, boxShadow: `0 12px 30px rgba(0,0,0,0.55), 0 0 24px ${withAlpha(color, 0.35)}`, textAlign: 'center', whiteSpace: 'nowrap'}}>
			<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, letterSpacing: 1, color: COLORS.text}}>{title}</div>
			<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 20, color: withAlpha('#FFFFFF', 0.78)}}>{sub}</div>
		</div>
		<div style={{width: 4, height: 54, background: `linear-gradient(${color}, ${withAlpha(color, 0.15)})`}} />
		<div style={{width: 24, height: 24, borderRadius: 12, marginTop: -12, background: color, border: '3px solid #FFFFFF', boxShadow: `0 0 22px ${withAlpha(color, 0.9)}`}} />
	</div>
);

export const BerlinScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const b1 = cue(cues, 'berlin1', 0);
	const b2 = cue(cues, 'berlin2', 150);
	const atReg = Math.min(wordFrame(cues, 'Angemeldet', b1.from + 40), b1.from + 50) - 4;
	const atCame = Math.min(wordFrame(cues, '1.200', b1.to - 30), b1.to - 16) - 8;
	const at700 = Math.max(b2.from - 4, atCame + 20);
	const atStart = Math.min(wordFrame(cues, 'Savignyplatz', b2.from + 70), b2.to - 70) - 4;
	const atKudamm = Math.max(atStart + 14, Math.min(wordFrame(cues, "Ku'damm", atStart + 30), b2.to - 40) - 6);
	const atEnd = Math.max(atKudamm + 26, Math.min(wordFrame(cues, 'Halensee', b2.to - 20), b2.to - 10));
	const reg = springIn({frame, fps, delay: atReg, damping: 14, stiffness: 170});
	const came = interpolate(frame, [atCame, atCame + 22], [0, 1], {...clamp, easing: EASE_OUT});
	const s700 = springIn({frame, fps, delay: at700, damping: 13, stiffness: 180});
	const connectorOn = interpolate(frame, [atStart + 4, atStart + 14], [0, 1], clamp);
	const progress = interpolate(frame, [atKudamm - 2, atEnd + 8], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const [sx, sy] = berlinXY(BERLIN.start.at);
	const [ex, ey] = berlinXY(BERLIN.end.at);
	const [mx, my] = berlinXY(ROUTE[Math.floor(ROUTE.length * 0.45)]);
	const midX = (sx + ex) / 2;
	const midY = (sy + ey) / 2;
	const cam = interpolateCamera(
		frame,
		[
			{frame: 0, cam: {x: midX + 200, y: midY - 100, zoom: 0.95, tilt: 44, rotate: -24}},
			{frame: b1.to, cam: {x: midX + 80, y: midY - 40, zoom: 0.7, tilt: 48, rotate: -30}},
			{frame: atStart + 10, cam: {x: midX + 20, y: midY, zoom: 0.56, tilt: 52, rotate: -36}},
			{frame: atEnd + 10, cam: {x: midX - 40, y: midY + 20, zoom: 0.58, tilt: 55, rotate: -40}},
			{frame: durationInFrames + 10, cam: {x: midX - 70, y: midY + 30, zoom: 0.62, tilt: 56, rotate: -42}},
		],
		EASE_IN_OUT,
	);
	const markers: PlaneBillboard[] = [
		{key: 'start', x: sx, y: sy, node: <Marker title={`START: ${BERLIN.start.name}`} sub={BERLIN.start.note} color="#FFFFFF" on={interpolate(frame, [atStart, atStart + 10], [0, 1], clamp)} />},
		{key: 'kudamm', x: mx, y: my, node: <div style={{opacity: interpolate(frame, [atKudamm + 4, atKudamm + 14], [0, 1], clamp), padding: '6px 16px', borderRadius: 12, background: GENZ, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, letterSpacing: 2, color: '#FFFFFF', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', marginBottom: 14, whiteSpace: 'nowrap'}}>{BERLIN.street.name}</div>},
		{key: 'end', x: ex, y: ey, node: <Marker title={`ENDE: ${BERLIN.end.name}`} sub={BERLIN.end.note} color={GENZ} on={interpolate(frame, [atEnd, atEnd + 10], [0, 1], clamp)} />},
	];
	const barW = 400;
	const compact = interpolate(frame, [at700 - 4, at700 + 10], [0, 1], {...clamp, easing: EASE_IN_OUT});
	return (
		<AbsoluteFill style={{backgroundColor: '#080C1F', overflow: 'hidden'}}>
			<BerlinPlane camera={cam} anchor={[540, 880]} route={ROUTE} connector={BERLIN_CONNECTOR} progress={progress} connectorOn={connectorOn} markers={markers} highlightStreet={BERLIN.street.osm} highlightOn={interpolate(frame, [atKudamm, atKudamm + 12], [0, 1], clamp)} />
			<MapShade top={0.95} bottom={0.9} />
			<div style={{position: 'absolute', left: 64, top: 290}}>
				<Tag text="BERLIN · SAMSTAGABEND" color={GENZ} icon="pin" />
			</div>
			{/* Vergleich angemeldet vs. gekommen (b1 groß, ab „700“ als kompakte Zeile) */}
			{compact < 1 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 350, opacity: (1 - compact) * Math.min(1, frame / 6), translate: `0 ${(1 - Math.min(1, frame / 8)) * 30}px`, scale: String(1 - compact * 0.1), transformOrigin: '50% 0%'}}>
					<Card color={GENZ} style={{padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: 14}} glow={0.25}>
						<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
							<span style={{width: 250, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, color: COLORS.textMuted, whiteSpace: 'nowrap'}}>ANGEMELDET</span>
							<div style={{width: barW, height: 34, borderRadius: 10, background: withAlpha('#FFFFFF', 0.08), position: 'relative'}}>
								<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: (barW / 12) * reg, borderRadius: 10, background: '#C9CEDF'}} />
							</div>
							<span style={{marginLeft: 'auto', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 52, color: COLORS.text, opacity: Math.min(1, reg * 1.6), scale: String(0.7 + 0.3 * reg)}}>{BERLIN.registered}</span>
						</div>
						<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
							<span style={{width: 250, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, color: COLORS.text, whiteSpace: 'nowrap'}}>LAUT POLIZEI</span>
							<div style={{width: barW, height: 34, borderRadius: 10, background: withAlpha('#FFFFFF', 0.08), position: 'relative'}}>
								<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: barW * came, borderRadius: 10, background: `linear-gradient(90deg, ${withAlpha(GENZ, 0.7)}, ${GENZ})`, boxShadow: `0 0 24px ${withAlpha(GENZ, 0.6)}`}} />
							</div>
							<span style={{marginLeft: 'auto', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 52, color: GENZ, whiteSpace: 'nowrap', opacity: frame >= atCame - 2 ? 1 : 0.25}}>
								{frame >= atCame - 2 ? <CountUp value={BERLIN.came} at={atCame} dur={22} /> : '?'}
							</span>
						</div>
						<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted, opacity: frame >= atCame - 2 ? 1 : 0}}>„rund 1.200“ laut Polizei · angemeldet waren 100</div>
					</Card>
				</div>
			) : null}
			{compact > 0 ? (
				<div style={{position: 'absolute', left: 64, top: 350, opacity: compact, translate: `0 ${(1 - compact) * 20}px`, display: 'flex', alignItems: 'center', gap: 14, padding: '10px 18px', borderRadius: 16, background: 'rgba(8,10,28,0.94)', border: `2.5px solid ${GENZ}`}}>
					<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 26, color: COLORS.textMuted}}>ANGEMELDET</span>
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 38, color: COLORS.text}}>100</span>
					<svg width={40} height={20}>
						<path d="M2 10h32M26 3l8 7-8 7" fill="none" stroke={GENZ} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
					</svg>
					<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 26, color: COLORS.textMuted}}>LAUT POLIZEI RUND</span>
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 38, color: GENZ}}>1.200</span>
				</div>
			) : null}
			{/* 700 Einsatzkräfte */}
			{frame >= at700 - 1 ? (
				<div style={{position: 'absolute', left: 64, top: 432, opacity: Math.min(1, s700 * 1.6), translate: `${(1 - s700) * -40}px 0`, display: 'flex', alignItems: 'center', gap: 14, padding: '8px 18px 8px 8px', borderRadius: 18, background: 'rgba(8,10,28,0.94)', border: `2.5px solid ${ACCENT.info}`, boxShadow: `0 18px 40px rgba(0,0,0,0.5), 0 0 30px ${withAlpha(ACCENT.info, 0.25)}`}}>
					<IconOrb name="shield" color={ACCENT.info} size={54} />
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 38, color: COLORS.text}}>
						<CountUp value={BERLIN.officers} at={at700} dur={16} /> EINSATZKRÄFTE
					</span>
					<Status kind="LAUT POLIZEI" size={16} />
				</div>
			) : null}
			{/* Legende Strecke */}
			<div style={{position: 'absolute', left: 64, top: 516, opacity: connectorOn, display: 'flex', alignItems: 'center', gap: 12, padding: '6px 14px', borderRadius: 12, background: 'rgba(8,10,28,0.9)', border: `2px solid ${withAlpha('#FFFFFF', 0.3)}`}}>
				<svg width={46} height={14}>
					<line x1={2} y1={7} x2={44} y2={7} stroke={GENZ} strokeWidth={7} strokeLinecap="round" />
				</svg>
				<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.text}}>Strecke laut rbb24</span>
				<svg width={46} height={14}>
					<line x1={2} y1={7} x2={44} y2={7} stroke="#FFFFFF" strokeWidth={5} strokeDasharray="10 7" strokeLinecap="round" />
				</svg>
				<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.text}}>Verbindung schematisch</span>
			</div>
			<SourceBar text={BERLIN.source} at={8} />
			<Sfx name="whoosh" at={0} volume={0.45} />
			<Sfx name="click" at={atReg} volume={0.5} />
			<Sfx name="softImpact" at={atCame + 16} volume={0.6} />
			<Sfx name="pop" at={at700} volume={0.5} />
			<Sfx name="blip" at={atStart} volume={0.55} />
			<Sfx name="whoosh" at={atKudamm} volume={0.3} />
			<Sfx name="blip" at={atEnd} volume={0.55} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 4: Zwischenfälle (stilisiert) */

const IncidentRow: React.FC<{icon: P2IconName; title: string; note: string; color: string; at: number}> = ({icon, title, note, color, at}) => {
	const frame = useCurrentFrame();
	const s = useSpring(at, 14, 180);
	if (frame < at - 1) return null;
	return (
		<div style={{opacity: Math.min(1, s * 1.6), translate: `${(1 - s) * 60}px 0`}}>
			<Card color={color} style={{padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 16, minHeight: 96, boxSizing: 'border-box'}} glow={0.22}>
				<IconOrb name={icon} color={color} size={66} />
				<div style={{flex: 1}}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, lineHeight: 1.08, color: COLORS.text}}>{title}</div>
					<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted}}>{note}</div>
				</div>
			</Card>
		</div>
	);
};

export const IncidentsScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const i1 = cue(cues, 'inc1', 0);
	const i2 = cue(cues, 'inc2', 90);
	const atLine = Math.max(4, Math.min(wordFrame(cues, 'Polizeikette', i1.from + 40), i1.to - 30) - 6);
	const atPush = Math.max(atLine + 8, Math.min(wordFrame(cues, 'durchbrechen', atLine + 20), i1.to - 16) - 4);
	const atPyro = Math.min(wordFrame(cues, 'Pyrotechnik', i2.from + 20), i2.from + 30) - 4;
	const atClash = Math.max(atPyro + 16, Math.min(wordFrame(cues, 'Auseinandersetzungen', i2.from + 50), i2.to - 30) - 4);
	const dolly = interpolate(frame, [0, durationInFrames], [0, 1.6], {easing: EASE_IN_OUT});
	const line = interpolate(frame, [atLine, atLine + 14], [0, 1], clamp);
	const push = interpolate(frame, [atPush, atPush + 8, atPyro, atPyro + 10], [0, 1, 1, 0.35], clamp);
	const pyro = interpolate(frame, [atPyro, atPyro + 8], [0, 1], clamp);
	const clash = interpolate(frame, [atClash, atClash + 10], [0, 1], clamp);
	const colors = [COLORS.signal, '#FF8A4D', GENZ];
	const ats = [Math.max(2, atLine - 10), atPyro, atClash];
	return (
		<AbsoluteFill style={{backgroundColor: '#05071A', overflow: 'hidden'}}>
			<IncidentStreet dolly={dolly} line={line} push={push} pyro={pyro} clash={clash} />
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.97) 0%, rgba(4,6,20,0.9) 20%, rgba(4,6,20,0.45) 33%, rgba(4,6,20,0) 40%, rgba(4,6,20,0) 64%, rgba(4,6,20,0.8) 76%, rgba(4,6,20,0.95) 100%)'}} />
			<div style={{position: 'absolute', left: 64, top: 290, display: 'flex', alignItems: 'center', gap: 12}}>
				<Tag text="WAS DIE POLIZEI MELDET" color={ACCENT.info} icon="info" />
			</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 352, display: 'flex', flexDirection: 'column', gap: 12}}>
				{INCIDENTS.items.map((it, i) => (
					<IncidentRow key={it.title} icon={it.icon as P2IconName} title={it.title} note={it.note} color={colors[i]} at={ats[i]} />
				))}
			</div>
			<div style={{position: 'absolute', left: 64, top: 1146, display: 'flex', alignItems: 'center', gap: 10}}>
				<Status kind="ILLUSTRATION" size={18} />
				<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted, textShadow: '0 2px 8px rgba(0,0,0,0.9)'}}>{INCIDENTS.label.replace('ILLUSTRATION · ', '')}</span>
			</div>
			<SourceBar text={INCIDENTS.source} at={8} />
			<Sfx name="whoosh" at={0} volume={0.45} />
			<Sfx name="click" at={ats[0]} volume={0.5} />
			<Sfx name="pop" at={atLine + 4} volume={0.45} />
			<Sfx name="softImpact" at={atPyro + 2} volume={0.55} />
			<Sfx name="click" at={atClash} volume={0.5} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 5: Bilanz */

export const StatsScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const st = cue(cues, 'stats', 0);
	const ch = cue(cues, 'charges', 120);
	const cx = cue(cues, 'context', 200);
	const atNum = [Math.max(6, Math.min(wordFrame(cues, '20', st.from + 40), st.from + 50) - 6), Math.min(wordFrame(cues, '28', st.from + 90), st.to - 50) - 6, Math.min(wordFrame(cues, 'drei', st.to - 40), st.to - 26) - 6];
	const atCharges = Math.min(wordFrame(cues, 'Vorwürfe', ch.from + 4), ch.from + 8) - 4;
	const atLand = Math.min(wordFrame(cues, 'Landfriedensbruch', ch.from + 40), ch.to - 30) - 4;
	const atWid = Math.min(wordFrame(cues, 'Widerstand', ch.to - 20), ch.to - 10) - 4;
	const chipAt = [atLand, atLand + 6, atWid, atWid + 6];
	const atCtx = Math.min(wordFrame(cues, 'betrifft', cx.from + 6), cx.from + 10) - 4;
	const atEq = Math.max(atCtx + 20, Math.min(wordFrame(cues, 'festgenommen', cx.to - 50), cx.to - 34) - 6);
	const drift = interpolate(frame, [0, durationInFrames], [0, 1]);
	const ctx = useSpring(atCtx, 14, 170);
	const head = useSpring(atCharges, 14, 180);
	return (
		<AbsoluteFill style={{backgroundColor: '#05071A', overflow: 'hidden'}}>
			<AbsoluteFill style={{background: `radial-gradient(ellipse 70% 40% at ${20 + drift * 10}% 18%, ${withAlpha(GENZ, 0.22)}, rgba(0,0,0,0) 70%), radial-gradient(ellipse 70% 40% at ${80 - drift * 10}% 22%, ${withAlpha(ACCENT.info, 0.22)}, rgba(0,0,0,0) 70%), linear-gradient(#0B0F33, #05071A)`}} />
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: 0.18}}>
				{new Array(24).fill(0).map((_, i) => (
					<line key={i} x1={-200 + i * 70 + drift * 70} y1={0} x2={-600 + i * 70 + drift * 70} y2={1920} stroke="#6A7BD8" strokeWidth={1} />
				))}
			</svg>
			<div style={{position: 'absolute', left: 64, top: 290, display: 'flex', alignItems: 'center', gap: 12}}>
				<Tag text="BILANZ · POLIZEI BERLIN" color={GENZ} icon="doc" />
				<Status kind="OFFIZIELL" size={17} />
			</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 356, display: 'flex', gap: 22}}>
				{STATS.map((s, i) => {
					const enter = 2 + i * 4;
					const sp = springIn({frame, fps: 30, delay: enter, damping: 12, stiffness: 180});
					const lock = springIn({frame, fps: 30, delay: atNum[i] + 8, damping: 9, stiffness: 220});
					return (
						<div key={s.label} style={{flex: 1, opacity: Math.min(1, sp * 1.6), translate: `0 ${(1 - sp) * 50}px`, scale: String(0.9 + 0.1 * sp)}}>
							<Card color={s.color} style={{padding: '16px 14px 16px', height: 282, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}} glow={0.3}>
								<CountUp value={s.value} at={enter + 2} dur={Math.max(16, atNum[i] + 10 - enter - 2)} style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 116, lineHeight: 1, color: s.color, textShadow: `0 0 ${20 + 30 * lock}px ${withAlpha(s.color, 0.3 + 0.3 * lock)}`, scale: String(1 + 0.08 * Math.sin(Math.min(1, lock) * Math.PI)), display: 'inline-block'}} />
								<div style={{marginTop: 6, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, lineHeight: 1.08, color: COLORS.text}}>{s.label}</div>
								{s.note ? <div style={{marginTop: 'auto', fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, lineHeight: 1.15, color: COLORS.textMuted}}>{s.note}</div> : null}
							</Card>
						</div>
					);
				})}
			</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 652, fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted, opacity: interpolate(frame, [atNum[2] + 10, atNum[2] + 20], [0, 1], clamp)}}>
				<span style={{color: COLORS.signal}}>●</span> {CONTEXT.caveat}
			</div>
			{/* Vorwürfe */}
			<div style={{position: 'absolute', left: 64, width: 866, top: 704, opacity: Math.min(1, head * 1.6), translate: `${(1 - head) * 40}px 0`}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10}}>
					<IconOrb name="gavel" color={ACCENT.law} size={50} />
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 32, color: COLORS.text}}>VORWÜRFE</span>
					<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted}}>unter anderem · laut Polizei</span>
				</div>
				<div style={{display: 'flex', flexWrap: 'wrap', gap: 10}}>
					{CHARGES.map((c, i) => {
						const s = springIn({frame, fps: 30, delay: chipAt[i], damping: 13, stiffness: 200});
						return (
							<span key={c} style={{opacity: Math.min(1, s * 1.6), scale: String(0.8 + 0.2 * s), padding: '8px 16px', borderRadius: 14, background: withAlpha(ACCENT.law, 0.16), border: `2px solid ${ACCENT.law}`, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 27, color: COLORS.text}}>
								{c}
							</span>
						);
					})}
				</div>
			</div>
			{/* Einordnung */}
			{frame >= atCtx - 1 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 900, opacity: Math.min(1, ctx * 1.6), translate: `0 ${(1 - ctx) * 30}px`}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderRadius: 16, background: 'rgba(8,10,28,0.92)', border: `2px solid ${withAlpha(ACCENT.yes, 0.8)}`}}>
						<P2Icon name="users" size={36} color={ACCENT.yes} />
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 29, color: COLORS.text}}>{CONTEXT.line2}</span>
					</div>
				</div>
			) : null}
			<div style={{position: 'absolute', left: 64, width: 866, top: 1000, display: 'flex', justifyContent: 'center'}}>
				<Equation left={CONTEXT.left} right={CONTEXT.right} op="≠" at={atEq} size={42} layout="compact" leftColor={COLORS.signal} rightColor={ACCENT.law} />
			</div>
			<SourceBar text={STATS_SOURCE} at={8} />
			<Sfx name="whoosh" at={0} volume={0.4} />
			{atNum.map((a, i) => (
				<Sfx key={i} name="softImpact" at={a + 12} volume={0.6} />
			))}
			<Sfx name="click" at={atCharges} volume={0.5} />
			<Sfx name="pop" at={atLand} volume={0.4} />
			<Sfx name="pop" at={atWid} volume={0.4} />
			<Sfx name="click" at={atCtx} volume={0.5} />
			<Sfx name="stamp" at={atEq + 8} volume={0.6} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 6: 20. November */

export const NextScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const n = cue(cues, 'ffm', 0);
	const atCal = Math.max(2, n.from);
	const atTitle = Math.min(wordFrame(cues, 'Jugendproteste', n.from + 30), n.from + 40) - 6;
	const atFfm = Math.min(wordFrame(cues, 'Frankfurt', n.to - 24), n.to - 14) - 6;
	const itemsAt = [atTitle + 14, atTitle + 24, atTitle + 34];
	const cal = springIn({frame, fps, delay: atCal, damping: 12, stiffness: 160});
	const title = springIn({frame, fps, delay: atTitle, damping: 14, stiffness: 180});
	const ffm = springIn({frame, fps, delay: atFfm, damping: 12, stiffness: 190});
	const drift = interpolate(frame, [0, durationInFrames], [0, 1]);
	const pull = interpolate(frame, [0, durationInFrames], [1.14, 1], {easing: EASE_OUT});
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{scale: String(pull), transformOrigin: '50% 70%'}}>
				<NightCity mood={blendMood(MOODS.dusk, MOODS.alert, 0.1)} progress={0.6 + drift * 0.25} litRatio={0.42} showMoon bokeh={16} showPromenade={false} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.95) 0%, rgba(4,6,20,0.7) 26%, rgba(4,6,20,0.3) 45%, rgba(4,6,20,0.78) 60%, rgba(4,6,20,0.93) 100%)'}} />
			<div style={{position: 'absolute', left: 64, top: 290}}>
				<Tag text="UND JETZT?" color={COLORS.signal} icon="clock" />
			</div>
			<div style={{position: 'absolute', left: 120, top: 380, opacity: Math.min(1, cal * 1.6), scale: String(0.7 + 0.3 * cal), rotate: `${(1 - cal) * 14}deg`, transformOrigin: '50% 0%'}}>
				<CalendarBlock day="20" month="NOVEMBER 2026" weekday="FREITAG" width={300} accent={COLORS.signal} tilt={-4} />
			</div>
			<div style={{position: 'absolute', left: 470, width: 470, top: 440, opacity: Math.min(1, ffm * 1.6), translate: `${(1 - ffm) * 60}px 0`}}>
				<div style={{display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 18px', borderRadius: 16, background: GENZ, boxShadow: '0 16px 40px rgba(255,59,78,0.4)'}}>
					<P2Icon name="pin" size={34} color="#FFFFFF" stroke={2.6} />
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, color: '#FFFFFF', whiteSpace: 'nowrap'}}>AUCH IN FRANKFURT</span>
				</div>
				<div style={{marginTop: 14, fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, lineHeight: 1.25, color: COLORS.text, textShadow: '0 4px 14px rgba(0,0,0,0.9)'}}>{NEXT.berlin}</div>
			</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 780, opacity: Math.min(1, title * 1.6), translate: `0 ${(1 - title) * 30}px`}}>
				<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 46, lineHeight: 1.05, color: COLORS.signal, textShadow: '0 6px 24px rgba(0,0,0,0.9)'}}>{NEXT.title}</div>
				<div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 8}}>
					<Status kind="ANGEKÜNDIGT" size={17} />
					<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, color: COLORS.text}}>{NEXT.sub}</span>
				</div>
			</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 930, display: 'flex', flexDirection: 'column', gap: 10}}>
				{NEXT.items.map((it, i) => {
					const s = springIn({frame, fps, delay: itemsAt[i], damping: 14, stiffness: 180});
					return (
						<div key={it.text} style={{opacity: Math.min(1, s * 1.6), translate: `${(1 - s) * 50}px 0`, display: 'flex', alignItems: 'center', gap: 14, padding: '10px 16px', borderRadius: 16, background: 'rgba(10,12,34,0.92)', border: `2px solid ${withAlpha(i === 1 ? GENZ : COLORS.signal, 0.75)}`}}>
							<span style={{width: 108, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, color: i === 1 ? GENZ : COLORS.signal}}>{it.time}</span>
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: COLORS.text}}>{it.text}</span>
							<span style={{marginLeft: 'auto', fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted}}>{it.place}</span>
						</div>
					);
				})}
			</div>
			<SourceBar text={NEXT.source} at={8} />
			<Sfx name="whoosh" at={0} volume={0.45} />
			<Sfx name="softImpact" at={atCal + 6} volume={0.6} />
			<Sfx name="click" at={atTitle} volume={0.5} />
			{itemsAt.map((a, i) => (
				<Sfx key={i} name="pop" at={a} volume={0.35} />
			))}
			<Sfx name="blip" at={atFfm} volume={0.55} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 7: Frage + Abo-Aufruf (offizielles Logo) */

export const OutroScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const q = cue(cues, 'q1', 2);
	const c = cue(cues, 'cta', 44);
	const atCta = Math.min(wordFrame(cues, 'Folgt', c.from), c.from);
	const ques = springIn({frame, fps, delay: Math.max(0, q.from - 2), damping: 13, stiffness: 180});
	const cta = springIn({frame, fps, delay: atCta - 6, damping: 13, stiffness: 180});
	const shrink = interpolate(frame, [atCta - 8, atCta + 8], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const pull = interpolate(frame, [0, durationInFrames], [0, 1], {...clamp, easing: EASE_OUT});
	const press = frame >= atCta + 22 ? interpolate(frame, [atCta + 22, atCta + 28, atCta + 34], [1, 0.9, 1], clamp) : 1;
	const followed = frame >= atCta + 26;
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
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 48, lineHeight: 1.05, color: COLORS.text}}>{QUESTION}</div>
						<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, color: COLORS.textMuted, marginTop: 4}}>Schreibt’s in die Kommentare · sachlich bleiben</div>
					</div>
				</Card>
			</div>
			{frame >= atCta - 6 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 620, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, opacity: Math.min(1, cta * 2), translate: `0 ${(1 - cta) * 50}px`}}>
					<div style={{position: 'relative'}}>
						<BrandLogo size={230} ring={6 + Math.sin(frame / 4) * 3} />
						<div style={{position: 'absolute', left: '50%', bottom: -26, translate: '-50% 0', scale: String(press), width: 66, height: 66, borderRadius: 33, background: followed ? ACCENT.yes : ACCENT.brand, border: '4px solid #FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 24px rgba(0,0,0,0.5)'}}>
							<P2Icon name={followed ? 'check' : 'plus'} size={38} color="#FFFFFF" stroke={3.4} />
						</div>
					</div>
					<span style={{marginTop: 12, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 52, color: COLORS.text}}>{handleWithAt()}</span>
					<div style={{padding: '12px 30px 14px', borderRadius: 20, background: ACCENT.brand, boxShadow: '0 20px 50px rgba(255,59,78,0.35)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, color: '#FFFFFF', scale: String(followed ? 1 + 0.035 * Math.sin((frame - atCta - 26) / 5) : 1)}}>{CTA.title}</div>
					<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 24, letterSpacing: 2.5, color: COLORS.signal}}>{CTA.sub}</span>
				</div>
			) : null}
			<Sfx name="pop" at={Math.max(0, q.from - 2)} volume={0.55} />
			<Sfx name="pop" at={atCta - 6} volume={0.6} />
			<Sfx name="click" at={atCta + 24} volume={0.6} />
		</AbsoluteFill>
	);
};
