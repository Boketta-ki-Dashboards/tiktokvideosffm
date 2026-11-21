import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {BrandLogo} from '../../../components/brand/BrandLogo';
import {interpolateCamera, type PlaneBillboard, type PlaneCamera} from '../../../components/map/TiltedPlane';
import {TopTag} from '../../../formats/frankfurt-erklaert/Branding';
import {ACCENT, FORMAT, LAYOUT} from '../../../formats/frankfurt-erklaert/theme';
import {clamp, EASE_IN_OUT, EASE_OUT, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {handleWithAt} from '../../../theme/brand';
import {COLORS, FONTS} from '../../../theme/tokens';
import {MOODS, NightCity} from '../../frankfurt-2026-11-20-ausblick/premium/NightCity';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {Card, CountUp, P2Icon, type P2IconName, Stars, useSpring} from '../../frankfurt-erklaert-genz-phase2-2026-11-14/scenes/kit';
import {germanyGeo, GermanyPlane} from '../../frankfurt-erklaert-genz-phase2-2026-11-14/visuals/GermanyPlane';
import {BERLIN, BREMEN, CITIES, type CityId, COVER, FRANKFURT, HAMBURG, LEIPZIG, OUTRO, PRINCIPLE, STAND, STUTTGART, VERLAUF, type Verlauf} from '../content';
import {STAEDTE_COVER_LAYOUT} from '../cover-layout';
import {PhaseBar, RingMini, RouteMini} from '../visuals/Infographics';

const RED = ACCENT.brand;
const BLUE = ACCENT.info;
const GREEN = VERLAUF.friedlich.color;
const AMBER = VERLAUF.waehrend.color;
const DANGER = VERLAUF.danach.color;
const YELLOW = COLORS.signal;
const VIOLET = '#B794F6';

/* ------------------------------------------------------------------ Bausteine */

type Kind = 'LAUT POLIZEI' | 'SCHEMATISCH' | 'VERDACHT ≠ SCHULD' | 'ZITAT' | 'EINORDNUNG';
const KIND_COLOR: Record<Kind, string> = {'LAUT POLIZEI': BLUE, SCHEMATISCH: '#9AA6CC', 'VERDACHT ≠ SCHULD': VIOLET, ZITAT: VIOLET, EINORDNUNG: YELLOW};
const Chip: React.FC<{kind: Kind; size?: number; style?: React.CSSProperties}> = ({kind, size = 17, style}) => {
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

const Shade: React.FC<{top?: number; bottom?: number; mid?: [number, number]}> = ({top = 0.94, bottom = 0.9, mid = [30, 46]}) => (
	<AbsoluteFill style={{background: `linear-gradient(rgba(4,6,20,${top}) 0%, rgba(4,6,20,${top * 0.7}) 17%, rgba(4,6,20,0) ${mid[0]}%, rgba(4,6,20,0.15) ${mid[1]}%, rgba(4,6,20,${bottom * 0.86}) 56%, rgba(4,6,20,${bottom}) 100%)`, pointerEvents: 'none'}} />
);

/* ------------------------------------------------------------------ Deutschlandkarte mit sechs Städten */

const cityXY = (id: CityId): [number, number] => {
	const c = CITIES.find((x) => x.id === id)!;
	return germanyGeo().project([c.lon, c.lat]);
};
/** Übersicht (wie #12) – Ende des Titelbilds = Anfang der Hamburg-Fahrt. */
const DE_OVERVIEW: PlaneCamera = {x: 500, y: 690, zoom: 0.74, tilt: 40, rotate: -1};
const focusCam = (id: CityId, zoom = 1.55): PlaneCamera => {
	const [x, y] = cityXY(id);
	return {x, y: y - 60, zoom, tilt: 47, rotate: -4};
};
/** Label-Versatz je Stadt (Hamburg/Bremen und Leipzig/Berlin liegen eng beieinander). */
const LABEL_SHIFT: Record<CityId, number> = {hamburg: 40, bremen: -60, berlin: 50, leipzig: 10, frankfurt: -50, stuttgart: 0};

export type DotState = {on: number; colored: number; active: number; label: number};

/** Stadtmarke: Leuchtpunkt + Name; vor der Einordnung weiß, danach in der Verlaufs-Farbe. */
const CityDot: React.FC<{name: string; verlauf: Verlauf; s: DotState; shift: number; small?: boolean}> = ({name, verlauf, s, shift, small}) => {
	const frame = useCurrentFrame();
	const vc = VERLAUF[verlauf].color;
	const color = s.colored > 0.5 ? vc : '#E8ECFF';
	const pulse = s.active * (0.5 + 0.5 * Math.sin(frame / 5));
	const d = (small ? 18 : 24) * (1 + 0.35 * s.active);
	return (
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: s.on, scale: String((0.6 + 0.4 * s.on) * (1 + 0.15 * s.active)), transformOrigin: '50% 100%'}}>
			<div style={{translate: `${shift}px 0`, padding: small ? '3px 10px' : '4px 12px', borderRadius: 10, background: 'rgba(8,10,28,0.92)', border: `3px solid ${color}`, fontFamily: FONTS.heading, fontWeight: 900, fontSize: small ? 22 : 27, letterSpacing: 1.2, color: '#FFFFFF', whiteSpace: 'nowrap', opacity: s.label, boxShadow: `0 8px 22px rgba(0,0,0,0.5), 0 0 ${10 + 20 * pulse}px ${withAlpha(color, 0.5)}`}}>{name}</div>
			<div style={{width: 3, height: small ? 26 : 40, background: `linear-gradient(${color}, ${withAlpha(color, 0.1)})`, opacity: s.label}} />
			<div style={{width: d, height: d, marginTop: -d / 2, borderRadius: d, background: color, border: '3px solid #FFFFFF', boxShadow: `0 0 ${14 + 22 * pulse}px ${withAlpha(color, 0.9)}`}} />
		</div>
	);
};

const cityMarkers = (state: (id: CityId) => DotState, small?: boolean): PlaneBillboard[] =>
	CITIES.map((c) => {
		const [x, y] = cityXY(c.id);
		return {key: `c-${c.id}`, x, y, z: c.id === 'hamburg' || c.id === 'leipzig' ? 6 : 3, node: <CityDot name={c.name} verlauf={c.verlauf} s={state(c.id)} shift={LABEL_SHIFT[c.id]} small={small} />};
	});

const MapBg: React.FC = () => (
	<>
		<AbsoluteFill style={{background: 'radial-gradient(ellipse 110% 60% at 50% 46%, #252A70 0%, #111444 52%, #060920 100%)'}} />
		<Stars seed="st15" n={40} height={480} />
	</>
);

/* ------------------------------------------------------------------ Szene 1: Titelbild */

/**
 * Titelbild (Video-Frame 0 und PNG, nach COVER_ZONE): Serientitel, „GEN-Z-PROTESTE · 20.11.“, groß „HAMBURG / LEIPZIG“, „+ BERLIN · STUTTGART ·
 * BREMEN“, rote Karte „WAS IST PASSIERT?“, Plakette „NACHBETRACHTUNG · STAND 21.11.“, 2,5D-Deutschlandkarte mit den sechs Städten (Farbe =
 * Verlauf), Logo + Account; im PNG zusätzlich die Quellenzeile. `morph` blendet die Texte aus und fährt die Karte in die Übersicht.
 */
export const StaedteCover: React.FC<{morph?: number; thumbnail?: boolean; meta?: number}> = ({morph = 0, thumbnail = false, meta = 1}) => {
	const frame = useCurrentFrame();
	const L = STAEDTE_COVER_LAYOUT;
	const m = EASE_IN_OUT(Math.min(1, Math.max(0, morph)));
	const coverCam: PlaneCamera = {x: 500, y: 650, zoom: 0.42, tilt: 60, rotate: -2 + Math.sin(frame / 40) * 1};
	const cam = interpolateCamera(m * 100, [
		{frame: 0, cam: coverCam},
		{frame: 100, cam: DE_OVERVIEW},
	], (t) => t);
	const anchor: [number, number] = [500 + 40 * m, 1160 - 260 * m];
	const text = 1 - Math.min(1, m * 1.6);
	const bob = Math.sin(frame / 26) * 3;
	const markers = cityMarkers(() => ({on: 1, colored: 1, active: 0, label: text > 0.5 ? 1 : 0}), true);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<MapBg />
			<GermanyPlane camera={cam} anchor={anchor} markers={markers} glow={1} />
			<AbsoluteFill style={{background: `linear-gradient(rgba(4,6,20,${0.55 * text}) 0%, rgba(4,6,20,${0.15 * text}) 15%, rgba(4,6,20,${0.7 * text}) 26%, rgba(4,6,20,${0.86 * text}) 40%, rgba(4,6,20,${0.6 * text}) 52%, rgba(4,6,20,0) 56%, rgba(4,6,20,0) 66%, rgba(4,6,20,${0.55 * text}) 76%, rgba(4,6,20,${0.8 * text}) 100%)`}} />
			<div style={{opacity: text, translate: `0 ${(1 - text) * -30}px`}}>
				<div style={{position: 'absolute', left: 0, right: 0, top: L.brandTop, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16}}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 50, lineHeight: 0.98, color: COLORS.text, textAlign: 'right', textShadow: '0 6px 24px rgba(0,0,0,0.8)'}}>
						FRANKFURT
						<br />
						ERKLÄRT
					</div>
					<div style={{padding: '9px 16px', borderRadius: 10, background: RED, boxShadow: '0 10px 26px rgba(255,59,78,0.4)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, letterSpacing: 3, color: '#FFFFFF'}}>{FORMAT.sub}</div>
				</div>
				<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.kickerTop, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: L.kickerSize, lineHeight: 1.1, letterSpacing: 1, color: COLORS.text, whiteSpace: 'nowrap', textShadow: '0 8px 26px rgba(0,0,0,0.9)'}}>{COVER.kicker}</div>
				<div style={{position: 'absolute', left: 0, right: 0, top: L.bigTop + bob, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: L.bigSize, lineHeight: 1, letterSpacing: -2, whiteSpace: 'nowrap', textShadow: `0 0 60px ${withAlpha(DANGER, 0.35)}, 0 20px 50px rgba(0,0,0,0.85)`}}>
					<div style={{color: YELLOW}}>{COVER.big[0]}</div>
					<div style={{color: COLORS.text}}>{COVER.big[1]}</div>
				</div>
				<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.moreTop, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, letterSpacing: 1.5, color: withAlpha(COLORS.text, 0.92), whiteSpace: 'nowrap', textShadow: '0 4px 16px rgba(0,0,0,0.95)'}}>{COVER.more}</div>
				<div style={{position: 'absolute', left: L.sideMin - 20, right: L.sideMin - 20, top: L.cardTop, display: 'flex', justifyContent: 'center'}}>
					<div style={{padding: '7px 24px 9px', borderRadius: 18, background: 'linear-gradient(160deg, #FF6A78 0%, #FF4D5E 50%, #D93448 100%)', boxShadow: '0 5px 0 #B32A3C, 0 10px 0 #8E1F2E, 0 30px 60px rgba(0,0,0,0.6)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: L.cardFont, lineHeight: 1.1, color: '#FFFFFF', whiteSpace: 'nowrap'}}>{COVER.card}</div>
				</div>
				<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.tagTop, height: L.tagBottom - L.tagTop, display: 'flex', justifyContent: 'center'}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px', borderRadius: 19, background: 'rgba(8,10,28,0.94)', border: `2.5px solid ${YELLOW}`}}>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 23, letterSpacing: 2, color: YELLOW, whiteSpace: 'nowrap'}}>{COVER.tag}</span>
						<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 22, color: COLORS.text, whiteSpace: 'nowrap'}}>· {STAND.label.replace('2026', '').trim()}</span>
					</div>
				</div>
				<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.metaTop, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, opacity: meta}}>
					<BrandLogo size={52} />
					<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 30, color: COLORS.textMuted}}>{handleWithAt()}</span>
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
	const h2 = cue(cues, 'hook2', 30);
	const atStaedte = wordFrame(cues, 'Städten', h2.from + 30);
	const morph = interpolate(frame, [durationInFrames - 16, durationInFrames - 1], [0, 1], clamp);
	const meta = interpolate(frame, [h2.from - 8, h2.from], [1, 0], clamp);
	return (
		<AbsoluteFill>
			<StaedteCover morph={morph} meta={meta} />
			<Sfx name="softImpact" at={0} volume={0.5} />
			<Sfx name="blip" at={atStaedte} volume={0.45} />
			<Sfx name="whoosh" at={Math.max(0, durationInFrames - 16)} volume={0.45} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Stadt-Szenen (Hamburg, Leipzig) */

/** Kopfkarte einer Stadt: Name, Zähler (läuft vom Erscheinen bis zum gesprochenen Wert), Urheber, rechts eine schematische Mini-Grafik. */
const CityHead: React.FC<{name: string; count: number; countAt: number; countEnd: number; countBy: string; extra?: string; color: string; mini: React.ReactNode}> = ({name, count, countAt, countEnd, countBy, extra, color, mini}) => (
	<Card color={color} style={{padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12}} glow={0.3}>
		<div style={{flex: 1}}>
			<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, letterSpacing: 2, color}}>{name}</div>
			<div style={{display: 'flex', alignItems: 'baseline', gap: 10}}>
				<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: COLORS.textMuted}}>RUND</span>
				<CountUp value={count} at={countAt} dur={Math.max(10, countEnd - countAt)} style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 84, lineHeight: 1, color: COLORS.text, textShadow: `0 0 34px ${withAlpha(color, 0.5)}`}} />
			</div>
			<div style={{marginTop: 4}}>
				<Chip kind="LAUT POLIZEI" size={15} />
			</div>
			<div style={{marginTop: 6, fontFamily: FONTS.body, fontWeight: 700, fontSize: 21, lineHeight: 1.2, color: COLORS.textMuted}}>{countBy}</div>
			{extra ? <div style={{marginTop: 2, fontFamily: FONTS.body, fontWeight: 700, fontSize: 21, lineHeight: 1.2, color: COLORS.textMuted}}>{extra}</div> : null}
		</div>
		<div style={{width: 330, borderRadius: 16, background: 'rgba(6,8,24,0.7)', overflow: 'hidden'}}>{mini}</div>
	</Card>
);

export const HamburgScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const h1 = cue(cues, 'h1', 0);
	const h2 = cue(cues, 'h2', 90);
	const at4000 = wordFrame(cues, '4.000', h1.from + 20);
	const atDamm = wordFrame(cues, 'Dammtor', at4000 + 10) - 4;
	const atFried = wordFrame(cues, 'friedlich', atDamm + 30) - 6;
	const atEnde = Math.max(atFried + 8, h2.from - 2);
	const atGew = wordFrame(cues, 'Gewahrsam', atEnde + 40) - 8;
	const cam = interpolateCamera(frame, [
		{frame: 0, cam: DE_OVERVIEW},
		{frame: 22, cam: focusCam('hamburg', 1.5)},
		{frame: durationInFrames + 10, cam: {...focusCam('hamburg', 1.75), rotate: -9}},
	], EASE_IN_OUT);
	const markers = cityMarkers((id) => ({on: 1, colored: id === 'hamburg' ? interpolate(frame, [atEnde, atEnde + 8], [0, 1], clamp) : 0, active: id === 'hamburg' ? 1 : 0, label: id === 'hamburg' || id === 'bremen' ? 1 : 0}));
	const demoFill = interpolate(frame, [atDamm, atFried + 10], [0, 1], {...clamp, easing: EASE_OUT});
	const afterFill = interpolate(frame, [atEnde + 4, atGew + 10], [0, 1], {...clamp, easing: EASE_OUT});
	return (
		<AbsoluteFill style={{backgroundColor: '#070B22', overflow: 'hidden'}}>
			<MapBg />
			<GermanyPlane camera={cam} anchor={[540, 760]} markers={markers} />
			<Shade />
			<SceneTag text="1 · HAMBURG" color={DANGER} icon="pin" />
			<In at={2} dy={30} style={{left: LAYOUT.left, top: 378, width: LAYOUT.width}}>
				<CityHead name="HAMBURG" count={HAMBURG.count} countAt={2} countEnd={at4000 + 2} countBy={HAMBURG.countBy} extra={HAMBURG.total} color={YELLOW} mini={<RouteMini width={330} height={170} from={HAMBURG.route[0]} to={HAMBURG.route[1]} color={YELLOW} draw={interpolate(frame, [Math.min(8, atDamm), atDamm + 20], [0, 1], clamp)} />} />
			</In>
			<div style={{position: 'absolute', left: LAYOUT.left, top: 930, width: LAYOUT.width}}>
				<PhaseBar width={LAYOUT.width} demo={{...HAMBURG.demo, color: GREEN, fill: demoFill}} after={{...HAMBURG.after, color: DANGER, fill: afterFill}} endLabel="ENDE DER DEMO" endOn={interpolate(frame, [atEnde - 6, atEnde + 2], [0, 1], clamp)} demoFrom={`Start ${HAMBURG.demo.from}`} demoTo={`Meldung ${HAMBURG.demo.to}`} />
			</div>
			<In at={atGew} dy={30} style={{left: LAYOUT.left, top: 1112, width: LAYOUT.width}}>
				<div style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>
					{HAMBURG.afterItems.map((t, i) => (
						<div key={t} style={{padding: '5px 12px', borderRadius: 12, background: 'rgba(10,12,32,0.94)', border: `2px solid ${withAlpha(DANGER, 0.7)}`, fontFamily: FONTS.body, fontWeight: 800, fontSize: 21, color: COLORS.text, opacity: interpolate(frame, [atGew + i * 4, atGew + i * 4 + 6], [0, 1], clamp)}}>{t}</div>
					))}
				</div>
				<div style={{marginTop: 8, fontFamily: FONTS.body, fontWeight: 700, fontSize: 20, color: COLORS.textMuted}}>{HAMBURG.correction}</div>
			</In>
			<Sfx name="whoosh" at={0} volume={0.4} />
			<Sfx name="blip" at={20} volume={0.5} />
			<Sfx name="softImpact" at={at4000 + 2} volume={0.5} />
			<Sfx name="tick" at={atEnde} volume={0.55} />
			<Sfx name="pop" at={atGew} volume={0.45} />
		</AbsoluteFill>
	);
};

export const LeipzigScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const l1 = cue(cues, 'l1', 0);
	const l2 = cue(cues, 'l2', 100);
	const l3 = cue(cues, 'l3', 150);
	const at2500 = wordFrame(cues, '2.500', l1.from + 20);
	const atRing = wordFrame(cues, 'Ring', at2500 + 10) - 6;
	const atEnde = wordFrame(cues, 'Ende', atRing + 10) - 4;
	const atAus = wordFrame(cues, 'Ausschreitungen', atEnde + 10) - 4;
	const atWasser = Math.max(atAus + 8, l2.from - 2);
	const atFuenf = wordFrame(cues, 'fünf', atWasser + 20) - 4;
	const at200 = Math.max(atFuenf + 10, l3.from - 2);
	const atLand = wordFrame(cues, 'Landfriedensbruchs', at200 + 30) - 6;
	const cam = interpolateCamera(frame, [
		{frame: 0, cam: focusCam('hamburg', 1.4)},
		{frame: 24, cam: focusCam('leipzig', 1.5)},
		{frame: durationInFrames + 10, cam: {...focusCam('leipzig', 1.8), rotate: 4}},
	], EASE_IN_OUT);
	const markers = cityMarkers((id) => ({on: 1, colored: id === 'hamburg' ? 1 : id === 'leipzig' ? interpolate(frame, [atEnde, atEnde + 8], [0, 1], clamp) : 0, active: id === 'leipzig' ? 1 : 0, label: id === 'leipzig' || id === 'berlin' ? 1 : 0}));
	const demoFill = interpolate(frame, [atRing - 4, atEnde], [0, 1], {...clamp, easing: EASE_OUT});
	const afterFill = interpolate(frame, [atEnde + 2, atAus + 16], [0, 1], {...clamp, easing: EASE_OUT});
	const big = interpolate(frame, [at200 - 2, at200 + 10], [0, 1], {...clamp, easing: EASE_OUT});
	return (
		<AbsoluteFill style={{backgroundColor: '#070B22', overflow: 'hidden'}}>
			<MapBg />
			<GermanyPlane camera={cam} anchor={[540, 760]} markers={markers} />
			<Shade />
			<SceneTag text="2 · LEIPZIG" color={DANGER} icon="pin" />
			<In at={2} dy={30} style={{left: LAYOUT.left, top: 378, width: LAYOUT.width}}>
				<CityHead name="LEIPZIG" count={LEIPZIG.count} countAt={2} countEnd={at2500 + 2} countBy={LEIPZIG.countBy} extra={LEIPZIG.forces} color={YELLOW} mini={<RingMini size={170} color={YELLOW} draw={interpolate(frame, [Math.min(8, atRing), atRing + 24], [0, 1], clamp)} />} />
			</In>
			{/* > 200 Identitäten (über der Karte) */}
			{big > 0 ? (
				<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 646, opacity: big, translate: `0 ${(1 - big) * 30}px`}}>
					<Card color={VIOLET} style={{padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 18}} glow={0.4}>
						<div style={{display: 'flex', alignItems: 'baseline'}}>
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 52, color: COLORS.textMuted}}>&gt;</span>
							<CountUp value={LEIPZIG.ids} at={at200} dur={Math.max(10, wordFrame(cues, '200', at200 + 10) + 2 - at200)} style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 110, lineHeight: 1, color: COLORS.text, textShadow: `0 0 36px ${withAlpha(VIOLET, 0.6)}`}} />
						</div>
						<div style={{flex: 1}}>
							<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, lineHeight: 1.05, color: COLORS.text}}>{LEIPZIG.idsLabel}</div>
							<div style={{marginTop: 4, fontFamily: FONTS.body, fontWeight: 700, fontSize: 21, color: COLORS.textMuted}}>{LEIPZIG.idsSub}</div>
							<div style={{marginTop: 6, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', opacity: interpolate(frame, [atLand, atLand + 8], [0, 1], clamp)}}>
								<Chip kind="VERDACHT ≠ SCHULD" size={15} />
								<Chip kind="LAUT POLIZEI" size={15} />
							</div>
						</div>
					</Card>
					<div style={{marginTop: 6, padding: '4px 12px', borderRadius: 10, background: 'rgba(8,10,28,0.9)', fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.text, opacity: interpolate(frame, [atLand, atLand + 8], [0, 1], clamp)}}>{LEIPZIG.probe}</div>
				</div>
			) : null}
			<div style={{position: 'absolute', left: LAYOUT.left, top: 930, width: LAYOUT.width}}>
				<PhaseBar width={LAYOUT.width} demo={{...LEIPZIG.demo, color: GREEN, fill: demoFill}} after={{...LEIPZIG.after, color: DANGER, fill: afterFill}} endLabel="ENDE DER DEMO" endOn={interpolate(frame, [atEnde - 6, atEnde + 2], [0, 1], clamp)} demoFrom={`Start ${LEIPZIG.demo.from}`} demoTo={LEIPZIG.demo.to} />
			</div>
			<In at={atWasser} dy={30} style={{left: LAYOUT.left, top: 1112, width: LAYOUT.width}}>
				<div style={{display: 'flex', gap: 12}}>
					<div style={{flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', borderRadius: 14, background: 'rgba(10,12,32,0.94)', border: `2px solid ${withAlpha(BLUE, 0.8)}`}}>
						<svg width={46} height={46} viewBox="0 0 48 48">
							<rect x={4} y={22} width={30} height={14} rx={3} fill="none" stroke={BLUE} strokeWidth={3} />
							<path d="M34 26 h6 l4 6 v4 h-10 z" fill="none" stroke={BLUE} strokeWidth={3} strokeLinejoin="round" />
							<circle cx={12} cy={38} r={4} fill={BLUE} />
							<circle cx={34} cy={38} r={4} fill={BLUE} />
							<path d="M16 22 l10 -12" stroke={BLUE} strokeWidth={3} strokeLinecap="round" />
							{[0, 1, 2].map((i) => (
								<circle key={i} cx={28 + i * 4 + ((frame / 3 + i * 3) % 6)} cy={8 - i * 1.5} r={1.8} fill="#9FD3FF" />
							))}
						</svg>
						<div>
							<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 25, color: COLORS.text}}>{LEIPZIG.water}</div>
							<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 18, color: COLORS.textMuted}}>{LEIPZIG.waterSub}</div>
						</div>
					</div>
					<div style={{flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', borderRadius: 14, background: 'rgba(10,12,32,0.94)', border: `2px solid ${withAlpha(DANGER, 0.8)}`, opacity: interpolate(frame, [atFuenf - 2, atFuenf + 6], [0, 1], clamp)}}>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 56, lineHeight: 1, color: DANGER}}>{LEIPZIG.injured}</span>
						<div>
							<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 24, color: COLORS.text}}>{LEIPZIG.injuredLabel}</div>
							<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 18, color: COLORS.textMuted}}>{LEIPZIG.injuredSub}</div>
						</div>
					</div>
				</div>
			</In>
			<Sfx name="whoosh" at={0} volume={0.4} />
			<Sfx name="blip" at={22} volume={0.5} />
			<Sfx name="softImpact" at={at2500 + 2} volume={0.5} />
			<Sfx name="tick" at={atEnde} volume={0.55} />
			<Sfx name="pop" at={atWasser} volume={0.45} />
			<Sfx name="click" at={atFuenf} volume={0.4} />
			<Sfx name="softImpact" at={at200} volume={0.55} />
			<Sfx name="stamp" at={atLand} volume={0.4} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 4: Berlin · Stuttgart · Bremen */

const CityCard: React.FC<{name: string; verlauf: Verlauf; count: string; countBy: string; what: string; result: string; resultBy: string; at: number; resultAt: number}> = ({name, verlauf, count, countBy, what, result, resultBy, at, resultAt}) => {
	const frame = useCurrentFrame();
	const c = VERLAUF[verlauf].color;
	const r = interpolate(frame, [resultAt, resultAt + 8], [0, 1], clamp);
	return (
		<In at={at} dx={-70} dy={0} style={{left: LAYOUT.left, width: LAYOUT.width}}>
			<div style={{display: 'flex', alignItems: 'stretch', borderRadius: 20, overflow: 'hidden', background: 'linear-gradient(160deg, rgba(20,24,58,0.97), rgba(9,11,30,0.97))', border: `2.5px solid ${withAlpha(c, 0.9)}`, boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 30px ${withAlpha(c, 0.25)}`}}>
				<div style={{width: 12, background: c}} />
				<div style={{flex: 1, padding: '10px 16px'}}>
					<div style={{display: 'flex', alignItems: 'baseline', gap: 12, whiteSpace: 'nowrap'}}>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, letterSpacing: 1.5, color: c}}>{name}</span>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, color: COLORS.text}}>{count}</span>
						<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 18, color: COLORS.textMuted, overflow: 'hidden', textOverflow: 'ellipsis'}}>{countBy}</span>
					</div>
					<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, lineHeight: 1.2, color: COLORS.textMuted}}>{what}</div>
					<div style={{marginTop: 4, display: 'flex', alignItems: 'center', gap: 10, opacity: r, translate: `${(1 - r) * 20}px 0`}}>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, color: COLORS.text}}>{result}</span>
					</div>
					<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 18, color: withAlpha(c, 0.95), opacity: r}}>{resultBy}</div>
				</div>
			</div>
		</In>
	);
};

export const MehrScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const b1 = cue(cues, 'b1', 0);
	const s1 = cue(cues, 's1', 80);
	const r1 = cue(cues, 'r1', 160);
	const atBerlin = 2;
	const atVork = wordFrame(cues, 'Vorkommnisse', b1.from + 40) - 10;
	const atStutt = Math.max(atVork + 8, s1.from - 2);
	const atFest = wordFrame(cues, 'zwanzig', atStutt + 30) - 6;
	const atBremen = Math.max(atFest + 8, r1.from - 2);
	const atAuto = wordFrame(cues, 'Versuch', atBremen + 20) - 6;
	const cam = interpolateCamera(frame, [
		{frame: 0, cam: focusCam('leipzig', 1.3)},
		{frame: 20, cam: {x: 500, y: 640, zoom: 0.5, tilt: 46, rotate: -2}},
		{frame: durationInFrames + 10, cam: {x: 500, y: 660, zoom: 0.54, tilt: 48, rotate: 2}},
	], EASE_IN_OUT);
	const colorAt: Record<CityId, number> = {hamburg: 0, leipzig: 0, berlin: atBerlin + 6, stuttgart: atStutt + 6, bremen: atBremen + 6, frankfurt: 99999};
	const activeOf = (id: CityId) => (id === 'berlin' ? frame < atStutt : id === 'stuttgart' ? frame >= atStutt && frame < atBremen : id === 'bremen' ? frame >= atBremen : false);
	const markers = cityMarkers((id) => ({on: id === 'frankfurt' ? 0.5 : 1, colored: frame >= colorAt[id] ? 1 : 0, active: activeOf(id) ? 1 : 0, label: id === 'frankfurt' ? 0 : 1}), true);
	return (
		<AbsoluteFill style={{backgroundColor: '#070B22', overflow: 'hidden'}}>
			<MapBg />
			<GermanyPlane camera={cam} anchor={[540, 1150]} markers={markers} />
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.95) 0%, rgba(4,6,20,0.85) 22%, rgba(4,6,20,0.55) 44%, rgba(4,6,20,0.05) 54%, rgba(4,6,20,0) 66%, rgba(4,6,20,0.7) 80%, rgba(4,6,20,0.9) 100%)'}} />
			<SceneTag text="3 · BERLIN · STUTTGART · BREMEN" color={AMBER} icon="pin" />
			<div style={{position: 'absolute', top: 376}}>
				<CityCard name="BERLIN" verlauf="friedlich" count={`RUND ${BERLIN.count}`} countBy={BERLIN.countBy} what={BERLIN.route} result={BERLIN.result} resultBy={BERLIN.resultBy} at={atBerlin} resultAt={atVork} />
			</div>
			<div style={{position: 'absolute', top: 572}}>
				<CityCard name="STUTTGART" verlauf="waehrend" count={STUTTGART.count} countBy={STUTTGART.countBy} what={STUTTGART.what} result={STUTTGART.result} resultBy={STUTTGART.resultBy} at={atStutt} resultAt={atFest} />
			</div>
			<div style={{position: 'absolute', top: 768}}>
				<CityCard name="BREMEN" verlauf="waehrend" count={BREMEN.count} countBy={BREMEN.countBy} what={BREMEN.what} result={BREMEN.result} resultBy={BREMEN.resultBy} at={atBremen} resultAt={atAuto} />
			</div>
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="blip" at={atBerlin + 4} volume={0.45} />
			<Sfx name="stamp" at={atVork} volume={0.35} />
			<Sfx name="blip" at={atStutt + 4} volume={0.45} />
			<Sfx name="softImpact" at={atFest} volume={0.5} />
			<Sfx name="blip" at={atBremen + 4} volume={0.45} />
			<Sfx name="pop" at={atAuto} volume={0.45} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 5: Frankfurt + Einordnung */

export const VergleichScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const f1 = cue(cues, 'f1', 0);
	const z1 = cue(cues, 'z1', 90);
	const atMin = wordFrame(cues, 'Innenminister', f1.from + 20) - 6;
	const atZ = Math.max(atMin + 20, z1.from - 2);
	const zOn = interpolate(frame, [atZ - 2, atZ + 10], [0, 1], {...clamp, easing: EASE_OUT});
	const cam = interpolateCamera(frame, [
		{frame: 0, cam: {x: 500, y: 660, zoom: 0.66, tilt: 44, rotate: 2}},
		{frame: Math.max(20, atZ - 10), cam: {x: 500, y: 680, zoom: 0.7, tilt: 42, rotate: -1}},
		{frame: durationInFrames + 10, cam: {x: 500, y: 690, zoom: 0.64, tilt: 40, rotate: -3}},
	], EASE_IN_OUT);
	const markers = cityMarkers((id) => ({on: 1, colored: id === 'frankfurt' ? interpolate(frame, [atMin, atMin + 6], [0, 1], clamp) : 1, active: id === 'frankfurt' && frame < atZ ? 1 : 0, label: 1}), true);
	const legend: Verlauf[] = ['friedlich', 'waehrend', 'danach'];
	return (
		<AbsoluteFill style={{backgroundColor: '#070B22', overflow: 'hidden'}}>
			<MapBg />
			<GermanyPlane camera={cam} anchor={[540, 1050]} markers={markers} />
			<AbsoluteFill style={{background: `linear-gradient(rgba(4,6,20,0.95) 0%, rgba(4,6,20,0.8) 22%, rgba(4,6,20,${0.1 + 0.6 * zOn}) 42%, rgba(4,6,20,${0.6 * zOn}) 64%, rgba(4,6,20,0.85) 82%, rgba(4,6,20,0.92) 100%)`}} />
			<SceneTag text="4 · UND FRANKFURT?" color={GREEN} icon="pin" />
			{/* Legende */}
			<div style={{position: 'absolute', left: LAYOUT.left, top: 378, display: 'flex', flexDirection: 'column', gap: 6}}>
				{legend.map((v, i) => (
					<div key={v} style={{display: 'flex', alignItems: 'center', gap: 10, opacity: interpolate(frame, [2 + i * 4, 8 + i * 4], [0, 1], clamp)}}>
						<div style={{width: 20, height: 20, borderRadius: 10, background: VERLAUF[v].color, border: '2px solid #FFFFFF'}} />
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 22, letterSpacing: 1, color: COLORS.text}}>{VERLAUF[v].label}</span>
					</div>
				))}
				<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 19, color: COLORS.textMuted}}>{PRINCIPLE.note}</span>
			</div>
			{/* Frankfurt */}
			<In at={atMin} dy={30} style={{left: LAYOUT.left, top: 540, width: LAYOUT.width}} out={1 - 0.6 * zOn}>
				<Card color={GREEN} style={{padding: '12px 18px'}} glow={0.3}>
					<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 32, letterSpacing: 1.5, color: GREEN}}>FRANKFURT</span>
						<Chip kind="ZITAT" size={15} />
					</div>
					<div style={{marginTop: 4, fontFamily: FONTS.heading, fontWeight: 800, fontSize: 30, lineHeight: 1.15, color: COLORS.text}}>{FRANKFURT.quote}</div>
					<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 20, color: COLORS.textMuted}}>{FRANKFURT.quoteBy}</div>
					<div style={{marginTop: 6, fontFamily: FONTS.body, fontWeight: 700, fontSize: 21, lineHeight: 1.2, color: COLORS.textMuted}}>
						{FRANKFURT.police}
						<br />
						{FRANKFURT.arrests}
					</div>
				</Card>
			</In>
			{/* Einordnung */}
			{zOn > 0 ? (
				<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 840, display: 'flex', justifyContent: 'center', opacity: zOn, scale: String(0.9 + 0.1 * zOn)}}>
					<div style={{padding: '18px 26px', borderRadius: 22, background: 'rgba(8,10,28,0.96)', border: `3px solid ${YELLOW}`, boxShadow: `0 20px 50px rgba(0,0,0,0.6), 0 0 34px ${withAlpha(YELLOW, 0.25)}`, textAlign: 'center'}}>
						<Chip kind="EINORDNUNG" size={16} />
						<div style={{marginTop: 8, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 60, lineHeight: 1, letterSpacing: -1, color: COLORS.text, whiteSpace: 'nowrap'}}>
							DEMO <span style={{color: YELLOW}}>≠</span> AUSSCHREITUNG
						</div>
						<div style={{marginTop: 8, fontFamily: FONTS.heading, fontWeight: 800, fontSize: 28, color: COLORS.textMuted}}>{PRINCIPLE.sub}</div>
					</div>
				</div>
			) : null}
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="click" at={4} volume={0.35} />
			<Sfx name="blip" at={atMin} volume={0.5} />
			<Sfx name="stamp" at={atZ} volume={0.5} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 6: Frage + Abo */

export const OutroScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const q = cue(cues, 'q1', 0);
	const c = cue(cues, 'cta', 50);
	const atQ = Math.max(0, q.from - 2);
	const atCta = Math.max(atQ + 20, c.from - 2);
	const qs = springIn({frame, fps, delay: atQ, damping: 13, stiffness: 180});
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
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 400, display: 'flex', justifyContent: 'center', opacity: Math.min(1, qs * 1.7), translate: `0 ${(1 - qs) * 30}px`, scale: String((0.9 + 0.1 * qs) * (1 - 0.06 * cta))}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 24px', borderRadius: 22, background: 'rgba(8,10,28,0.95)', border: `3px solid ${YELLOW}`, boxShadow: `0 20px 50px rgba(0,0,0,0.6), 0 0 30px ${withAlpha(YELLOW, 0.25)}`}}>
					<P2Icon name="chat" size={40} color={YELLOW} />
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 36, lineHeight: 1.1, color: COLORS.text, whiteSpace: 'nowrap'}}>{OUTRO.question}</span>
				</div>
			</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 590, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, opacity: Math.min(1, cta * 2), translate: `0 ${(1 - cta) * 50}px`}}>
				<div style={{position: 'relative'}}>
					<BrandLogo size={230} ring={6 + Math.sin(frame / 4) * 3} />
					<div style={{position: 'absolute', left: '50%', bottom: -26, translate: '-50% 0', scale: String(press), width: 68, height: 68, borderRadius: 34, background: followed ? ACCENT.yes : RED, border: '4px solid #FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 24px rgba(0,0,0,0.5)'}}>
						<P2Icon name={followed ? 'check' : 'plus'} size={38} color="#FFFFFF" stroke={3.4} />
					</div>
				</div>
				<span style={{marginTop: 12, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 54, color: COLORS.text}}>{handleWithAt()}</span>
				<div style={{padding: '12px 30px 14px', borderRadius: 20, background: RED, boxShadow: '0 20px 50px rgba(255,59,78,0.35)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 42, color: '#FFFFFF', scale: String(followed ? 1 + 0.035 * Math.sin((frame - atCta - 28) / 5) : 1)}}>{OUTRO.cta}</div>
				<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 24, letterSpacing: 2.5, color: YELLOW}}>{OUTRO.ctaSub}</span>
			</div>
			<Sfx name="notify" at={atQ} volume={0.45} />
			<Sfx name="pop" at={atCta} volume={0.6} />
			<Sfx name="click" at={atCta + 26} volume={0.6} />
		</AbsoluteFill>
	);
};
