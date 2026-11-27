import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {FrankfurtSkyline} from '../../../components/backgrounds/FrankfurtSkyline';
import {BrandLogo} from '../../../components/brand/BrandLogo';
import {CityPlane, cityPlaneXY} from '../../../components/map/CityPlane';
import type {CityMapData} from '../../../components/map/CityStreetMap';
import {interpolateCamera, type PlaneBillboard, type PlaneCamera} from '../../../components/map/TiltedPlane';
import gallusMap from '../../../data/maps/frankfurt-gallus-gewerkschaftshaus.json';
import {TopTag} from '../../../formats/frankfurt-erklaert/Branding';
import {ACCENT, FORMAT, LAYOUT} from '../../../formats/frankfurt-erklaert/theme';
import {CalendarSheet} from '../../../formats/frankfurt-erklaert/visuals/Politics';
import {clamp, EASE_IN_OUT, EASE_OUT, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {handleWithAt} from '../../../theme/brand';
import {COLORS, FONTS} from '../../../theme/tokens';
import {MOODS, NightCity} from '../../frankfurt-2026-11-20-ausblick/premium/NightCity';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {ZeilStreet} from '../../frankfurt-2026-11-polizeikontrollen/visuals/ZeilStreet';
import {Card, CountUp, P2Icon, type P2IconName, Stars, useSpring} from '../../frankfurt-erklaert-genz-phase2-2026-11-14/scenes/kit';
import {ABSTIMMUNG, COVER, DATES, FRAGE, ORGA, OUTRO, POLIZEI, POST, STAND, STUFEN, TERMIN, TREFFEN} from '../content';
import {PLANUNG_COVER_LAYOUT} from '../cover-layout';
import {ChatLock, MeetingRoom, PostPhone, RouteMark, StructureLink, Tech, UnionHouse, Vest} from '../visuals/Planning';

const RED = ACCENT.brand;
const BLUE = ACCENT.info;
const GREEN = ACCENT.yes;
const YELLOW = COLORS.signal;
const ORANGE = '#FF9F43';
const CYAN = '#46C2FF';
const AMBER = '#FFB547';
const VIOLET = '#B794F6';
const NEWS = 'news' as const;

/* ------------------------------------------------------------------ Bausteine (wie #14–#17) */

type Kind = 'AUSSAGE DER GRUPPE' | 'OFFIZIELL' | 'EINLADUNG' | 'ANGEKÜNDIGT' | 'LAUT WEBSITE' | 'RÜCKBLICK' | 'OFFEN' | 'ILLUSTRATION' | 'SYMBOLBILD' | 'NACHBILDUNG';
const KIND_COLOR: Record<Kind, string> = {
	'AUSSAGE DER GRUPPE': AMBER,
	OFFIZIELL: BLUE,
	EINLADUNG: YELLOW,
	ANGEKÜNDIGT: YELLOW,
	'LAUT WEBSITE': ORANGE,
	RÜCKBLICK: '#9AA6CC',
	OFFEN: ACCENT.no,
	ILLUSTRATION: '#9AA6CC',
	SYMBOLBILD: '#9AA6CC',
	NACHBILDUNG: '#9AA6CC',
};
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

const Mark: React.FC<{text?: string; top?: number; right?: number}> = ({text = 'ILLUSTRATION', top = 1238, right = 160}) => (
	<div style={{position: 'absolute', right, top, fontFamily: FONTS.body, fontWeight: 700, fontSize: 18, letterSpacing: 1.5, color: withAlpha('#FFFFFF', 0.6)}}>{text}</div>
);

/** Zitatkarte (wörtliche Kurzstelle aus dem Beitrag, als Aussage gekennzeichnet). */
const Quote: React.FC<{text: string; kind?: Kind; size?: number; width?: number; color?: string}> = ({text, kind = 'AUSSAGE DER GRUPPE', size = 34, width = LAYOUT.width, color = AMBER}) => (
	<div style={{width, boxSizing: 'border-box', padding: '12px 18px 14px', borderRadius: 18, background: 'rgba(8,10,28,0.94)', borderLeft: `8px solid ${color}`, boxShadow: '0 18px 40px rgba(0,0,0,0.5)'}}>
		<Chip kind={kind} size={15} />
		<div style={{marginTop: 8, fontFamily: FONTS.heading, fontWeight: 800, fontSize: size, lineHeight: 1.14, color: COLORS.text}}>{text}</div>
	</div>
);

const NightBack: React.FC<{progress: number; mood?: keyof typeof MOODS; lit?: number}> = ({progress, mood = 'calm', lit = 0.4}) => (
	<AbsoluteFill style={{scale: String(1.1 - progress * 0.06), transformOrigin: '50% 80%'}}>
		<NightCity mood={MOODS[mood]} progress={0.4 + progress * 0.3} litRatio={lit} bokeh={12} showPromenade={false} />
	</AbsoluteFill>
);

/* ------------------------------------------------------------------ Szene 1: Titelbild (Kalender 31.10. · 20.11. → 12.12.) */

const MiniCal: React.FC<{day: string; month: string; state: 'past' | 'next'; on: number; label: string}> = ({day, month, state, on, label}) => {
	const next = state === 'next';
	const c = next ? YELLOW : '#8E97BD';
	return (
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, opacity: 0.35 + 0.65 * on, scale: String(next ? 1 + 0.1 * on : 1)}}>
			<div style={{position: 'relative', filter: next ? `drop-shadow(0 0 ${26 * on}px ${withAlpha(YELLOW, 0.7)})` : undefined}}>
				<CalendarSheet to={{day, month}} at={0} width={next ? 170 : 140} accent={next ? RED : '#5B6390'} />
				{next ? (
					<div style={{position: 'absolute', right: -18, top: -16, width: 50, height: 50, borderRadius: 25, background: YELLOW, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, color: '#14141C', boxShadow: '0 8px 20px rgba(0,0,0,0.5)'}}>?</div>
				) : (
					<div style={{position: 'absolute', left: -8, right: -8, top: '52%', height: 8, borderRadius: 4, background: withAlpha(RED, 0.9 * on), rotate: '-14deg'}} />
				)}
			</div>
			<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 22, letterSpacing: 1.5, color: c, whiteSpace: 'nowrap'}}>{label}</span>
		</div>
	);
};

/**
 * Titelbild (Video-Frame 0 und PNG, nach COVER_ZONE): Serientitel, „GEN Z REGELT FRANKFURT“, riesig „12.12.“, rote Karte „WAS SOLL SICH
 * ÄNDERN?“, Plakette „NEUSTART GEPLANT? · STAND 25.11.“, Kalenderleiste 31.10. · 20.11. (durchgestrichen = kritisiert) → 12.12. (?) vor der
 * Skyline, Logo + @frankfurtrednews; im PNG zusätzlich „KRITIK + PLANUNGSTREFFEN“.
 */
export const PlanungCover: React.FC<{morph?: number; thumbnail?: boolean; meta?: number; cal?: [number, number, number]}> = ({morph = 0, thumbnail = false, meta = 1, cal = [1, 1, 1]}) => {
	const frame = useCurrentFrame();
	const L = PLANUNG_COVER_LAYOUT;
	const m = EASE_IN_OUT(Math.min(1, Math.max(0, morph)));
	const text = 1 - Math.min(1, m * 1.6);
	const bob = Math.sin(frame / 26) * 3;
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{background: 'linear-gradient(#050820 0%, #0E1446 40%, #2A2462 70%, #4A2E66 100%)'}} />
			<Stars seed="c18c" n={36} height={460} />
			<div style={{position: 'absolute', left: 90 + Math.sin(frame / 60) * 8, top: 640, opacity: 0.75}}>
				<FrankfurtSkyline width={900} litRatio={0.5} showRiver showBridge={false} />
			</div>
			<AbsoluteFill style={{background: `linear-gradient(rgba(4,6,20,${0.45 * text + 0.1}) 0%, rgba(4,6,20,${0.1 * text}) 14%, rgba(4,6,20,${0.6 * text}) 24%, rgba(4,6,20,${0.86 * text}) 34%, rgba(4,6,20,${0.86 * text}) 46%, rgba(4,6,20,${0.35 * text}) 50%, rgba(4,6,20,${0.2 * text}) 60%, rgba(4,6,20,${0.75 * text}) 100%)`}} />
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
				<div style={{position: 'absolute', left: 0, right: 0, top: L.bigTop + bob, height: L.bigBottom - L.bigTop, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: L.bigSize, lineHeight: 0.92, letterSpacing: -5, color: YELLOW, whiteSpace: 'nowrap', textShadow: `0 0 70px ${withAlpha(YELLOW, 0.45)}, 0 22px 55px rgba(0,0,0,0.85)`}}>{COVER.big}</span>
				</div>
				<div style={{position: 'absolute', left: L.sideMin - 20, right: L.sideMin - 20, top: L.cardTop, display: 'flex', justifyContent: 'center'}}>
					<div style={{padding: '6px 26px 9px', borderRadius: 18, background: 'linear-gradient(160deg, #FF6A78 0%, #FF4D5E 50%, #D93448 100%)', boxShadow: '0 5px 0 #B32A3C, 0 10px 0 #8E1F2E, 0 30px 60px rgba(0,0,0,0.6)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: L.cardFont, lineHeight: 1.1, color: '#FFFFFF', whiteSpace: 'nowrap'}}>{COVER.card}</div>
				</div>
				<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.tagTop, height: L.tagBottom - L.tagTop, display: 'flex', justifyContent: 'center'}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px', borderRadius: 23, background: 'rgba(8,10,28,0.94)', border: `2.5px solid ${YELLOW}`}}>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 24, letterSpacing: 2, color: YELLOW, whiteSpace: 'nowrap'}}>{COVER.tag}</span>
						<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 22, color: COLORS.text, whiteSpace: 'nowrap'}}>· STAND {STAND.date.slice(0, 6)}</span>
					</div>
				</div>
				<div style={{position: 'absolute', left: L.sideMin, width: L.artRight - L.sideMin, top: L.artTop + 40, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 30}}>
					{DATES.map((d, i) => (
						<React.Fragment key={d.label}>
							{i === 2 ? <span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 60, color: YELLOW, marginBottom: 90, opacity: cal[2]}}>→</span> : null}
							<MiniCal day={d.day} month={d.month} state={d.state} on={cal[i]} label={d.state === 'next' ? 'NEUSTART?' : 'KRITIK'} />
						</React.Fragment>
					))}
				</div>
				<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.metaTop, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, opacity: meta}}>
					<BrandLogo size={52} />
					<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 30, color: COLORS.textMuted}}>{handleWithAt(NEWS)}</span>
				</div>
				{thumbnail ? (
					<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.thumbTop, display: 'flex', justifyContent: 'center'}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 22px', borderRadius: 16, background: 'rgba(8,10,28,0.92)', border: `2.5px solid ${YELLOW}`}}>
							<P2Icon name="users" size={30} color={YELLOW} />
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
	const atDemos = wordFrame(cues, 'Gen-Z-Demos', h2.from + 20) - 4;
	const atAendern = wordFrame(cues, 'ändern', atDemos + 30) - 6;
	const morph = interpolate(frame, [durationInFrames - 14, durationInFrames - 1], [0, 1], clamp);
	const meta = interpolate(frame, [h2.from - 8, h2.from], [1, 0], clamp);
	const past = interpolate(frame, [atDemos, atDemos + 8], [1, 0.55], clamp) + interpolate(frame, [atDemos + 8, atDemos + 16], [0, 0.45], clamp);
	const next = frame < h2.from ? 1 : interpolate(frame, [atAendern, atAendern + 10], [0.6, 1], clamp);
	return (
		<AbsoluteFill>
			<PlanungCover morph={morph} meta={meta} cal={[past, past, next]} />
			<Sfx name="softImpact" at={0} volume={0.5} />
			<Sfx name="tick" at={atDemos + 8} volume={0.4} />
			<Sfx name="pop" at={atAendern} volume={0.45} />
			<Sfx name="whoosh" at={Math.max(0, durationInFrames - 14)} volume={0.45} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 2: TikTok-Beitrag (Nachbildung auf neutralem Handy) */

export const BeitragScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const a1 = cue(cues, 'a1', 0);
	const atGruppe = Math.max(2, wordFrame(cues, 'Gruppe', a1.from + 10) - 6);
	const atTik = wordFrame(cues, 'TikTok', atGruppe + 10) - 4;
	const atOrga = wordFrame(cues, 'Organisation', atTik + 14) - 4;
	const at31 = wordFrame(cues, '31', atOrga + 20) - 4;
	const at20 = wordFrame(cues, '20', at31 + 20) - 4;
	const phone = springIn({frame, fps: 30, delay: 0, damping: 14, stiffness: 150});
	const pull = interpolate(frame, [0, durationInFrames], [0, 1], clamp);
	const tilt = interpolate(frame, [0, durationInFrames], [-6, -2], clamp);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<NightBack progress={pull} />
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.94) 0%, rgba(4,6,20,0.78) 30%, rgba(4,6,20,0.55) 60%, rgba(4,6,20,0.85) 100%)'}} />
			<SceneTag text="TIKTOK-BEITRAG" color={AMBER} icon="chat" />
			<In at={0} dy={20} style={{left: LAYOUT.left, top: 378, width: LAYOUT.width}}>
				<Card color={AMBER} style={{padding: '12px 18px'}} glow={0.3}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, lineHeight: 1.08, color: COLORS.text}}>{POST.headline}</div>
					<div style={{display: 'flex', gap: 8, marginTop: 8, opacity: interpolate(frame, [atGruppe, atGruppe + 8], [0, 1], clamp)}}>
						<Chip kind="AUSSAGE DER GRUPPE" size={15} />
						<Chip kind="NACHBILDUNG" size={15} />
					</div>
				</Card>
			</In>
			<div style={{position: 'absolute', left: 120, top: 540 + (1 - phone) * 260, rotate: `${tilt}deg`, opacity: Math.min(1, phone * 2)}}>
				<PostPhone width={340} page={0} lines={{headline: POST.headline, quote: POST.quote1, dates: POST.dates, tag: POST.hashtag}} />
			</div>
			<In at={atTik} dx={40} dy={0} style={{left: 520, top: 600}}>
				<div style={{padding: '10px 18px', borderRadius: 16, background: 'rgba(8,10,28,0.94)', border: `3px solid ${AMBER}`, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: COLORS.text, whiteSpace: 'nowrap'}}>ÖFFENTLICHE KRITIK</div>
			</In>
			<In at={atOrga} dx={40} dy={0} style={{left: 520, top: 690}}>
				<Quote text={POST.quote1} width={400} size={36} />
			</In>
			{[at31, at20].map((at, i) => (
				<In key={i} at={at} dy={-20} style={{left: 540 + i * 190, top: 860}}>
					<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
						<CalendarSheet to={{day: DATES[i].day, month: DATES[i].month}} at={0} width={150} accent="#5B6390" />
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 22, color: AMBER}}>DEMO</span>
					</div>
				</In>
			))}
			<Note text={POST.origin} top={1232} icon="doc" opacity={interpolate(frame, [atOrga, atOrga + 10], [0, 1], clamp)} />
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="notify" at={atTik} volume={0.45} />
			<Sfx name="typewriter" at={atOrga} volume={0.35} />
			<Sfx name="pop" at={at31} volume={0.4} />
			<Sfx name="pop" at={at20} volume={0.4} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 3: Kritik an kurzfristiger Planung */

export const OrgaScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const b1 = cue(cues, 'b1', 0);
	const atSpaet = Math.max(4, wordFrame(cues, 'spät', b1.from + 14) - 6);
	const atOrdner = wordFrame(cues, 'Ordner', atSpaet + 14) - 4;
	const atTechnik = wordFrame(cues, 'Technik', atOrdner + 10) - 4;
	const atRoute = wordFrame(cues, 'Route', atTechnik + 10) - 4;
	const atKurz = wordFrame(cues, 'kurz', atRoute + 10) - 4;
	const pull = interpolate(frame, [0, durationInFrames], [0, 1], clamp);
	const items = [
		{at: atOrdner, node: <Vest size={150} />, label: ORGA.items[0].label, color: AMBER},
		{at: atTechnik, node: <Tech size={150} level={0.5 + 0.5 * Math.sin(frame / 3)} />, label: ORGA.items[1].label, color: CYAN},
		{at: atRoute, node: <RouteMark size={150} draw={interpolate(frame, [atRoute, atRoute + 18], [0, 1], clamp)} />, label: ORGA.items[2].label, color: ORANGE},
	];
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<NightBack progress={pull} lit={0.5} />
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.9) 0%, rgba(4,6,20,0.6) 50%, rgba(4,6,20,0.82) 100%)'}} />
			<SceneTag text="KRITIK · PLANUNG" color={AMBER} icon="alert" />
			<In at={0} dy={20} style={{left: LAYOUT.left, top: 378, width: LAYOUT.width}}>
				<Card color={AMBER} style={{padding: '12px 18px'}} glow={0.3}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, lineHeight: 1.08, color: COLORS.text}}>{ORGA.headline}</div>
					<div style={{marginTop: 8}}>
						<Chip kind="AUSSAGE DER GRUPPE" size={15} />
					</div>
				</Card>
			</In>
			<In at={Math.min(atSpaet, 6)} dy={24} style={{left: LAYOUT.left, top: 540, width: LAYOUT.width}}>
				<div style={{display: 'flex', gap: 20, alignItems: 'center'}}>
					<div style={{flexShrink: 0, width: 150, height: 150, borderRadius: 24, background: 'linear-gradient(160deg, #FF6A78, #D93448)', boxShadow: '0 16px 36px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 84, lineHeight: 0.9, color: '#FFFFFF'}}>3</span>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 18, letterSpacing: 1.5, color: '#FFFFFF'}}>{ORGA.countdown}</span>
					</div>
					<Quote text={ORGA.quote} width={LAYOUT.width - 170} size={32} />
				</div>
			</In>
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 780, display: 'flex', justifyContent: 'space-between'}}>
				{items.map((it) => (
					<div key={it.label} style={{position: 'relative', width: 270, height: 300}}>
						<In at={it.at} dy={40} style={{left: 0, top: 0, width: 270}}>
							<div style={{height: 290, borderRadius: 24, background: 'rgba(14,18,48,0.95)', border: `3px solid ${it.color}`, boxShadow: `0 20px 44px rgba(0,0,0,0.5), 0 0 30px ${withAlpha(it.color, 0.25)}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6}}>
								{it.node}
								<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 32, color: COLORS.text}}>{it.label}</span>
								<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 18, letterSpacing: 1.2, color: it.color, opacity: interpolate(frame, [atKurz, atKurz + 8], [0, 1], clamp)}}>KURZ VORHER GESUCHT</span>
							</div>
						</In>
					</div>
				))}
			</div>
			<Mark text="ILLUSTRATION" top={1100} />
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="paper" at={atSpaet} volume={0.45} />
			<Sfx name="pop" at={atOrdner} volume={0.45} />
			<Sfx name="pop" at={atTechnik} volume={0.45} />
			<Sfx name="pop" at={atRoute} volume={0.45} />
			<Sfx name="tick" at={atKurz} volume={0.35} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 4: Kommunikation und Polizei (Aussage vs. offiziell) */

export const PolizeiScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const c1 = cue(cues, 'c1', 0);
	const atTele = Math.max(2, wordFrame(cues, 'Telegram', c1.from) - 6);
	const atPol = wordFrame(cues, 'Polizei', atTele + 14) - 6;
	const atJug = wordFrame(cues, 'Jugendliche', atPol + 14) - 6;
	const c2 = cue(cues, 'c2', atJug + 60);
	const atIm = Math.max(atJug + 20, wordFrame(cues, 'Innenministerium', c2.from) - 6);
	const atVerh = wordFrame(cues, 'Verhalten', atIm + 14) - 4;
	const dolly = interpolate(frame, [0, durationInFrames], [0, 14], clamp);
	const blue = 0.25 + 0.1 * Math.sin(frame / 5);
	const lock = interpolate(frame, [atTele + 10, atTele + 20], [0, 1], clamp);
	const claimUp = interpolate(frame, [atIm - 4, atIm + 10], [0, 1], {...clamp, easing: EASE_IN_OUT});
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{opacity: interpolate(frame, [atPol - 6, atPol + 10], [0.6, 1], clamp)}}>
				<ZeilStreet dolly={dolly} pan={Math.sin(frame / 60) * 0.3} people={12} officers={3} vans warm={0.5} blueLight={blue} seed="z18" />
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.96) 0%, rgba(4,6,20,0.8) 28%, rgba(4,6,20,0.05) 40%, rgba(4,6,20,0.1) 58%, rgba(4,6,20,0.85) 80%, rgba(4,6,20,0.95) 100%)'}} />
			<SceneTag text="KRITIK · POLIZEI" color={AMBER} icon="shield" />
			<In at={0} dy={20} style={{left: LAYOUT.left, top: 378, width: LAYOUT.width}}>
				<Card color={AMBER} style={{padding: '10px 18px'}} glow={0.3}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 36, lineHeight: 1.08, color: COLORS.text}}>{POLIZEI.headline}</div>
				</Card>
			</In>
			<In at={atTele} dx={-30} dy={0} style={{left: LAYOUT.left, top: 500, width: LAYOUT.width}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
					<ChatLock size={130} lock={lock} />
					<Quote text={POLIZEI.telegram} width={LAYOUT.width - 150} size={28} />
				</div>
			</In>
			<In at={atJug} dy={30} style={{left: LAYOUT.left, top: 880 - claimUp * 120, width: LAYOUT.width}}>
				<Quote text={POLIZEI.claim} size={34} />
			</In>
			<In at={atIm} dy={40} style={{left: LAYOUT.left, top: 920, width: LAYOUT.width}}>
				<div style={{boxSizing: 'border-box', width: LAYOUT.width, padding: '12px 18px 14px', borderRadius: 18, background: 'rgba(8,10,28,0.95)', borderLeft: `8px solid ${BLUE}`, boxShadow: '0 18px 40px rgba(0,0,0,0.5)'}}>
					<div style={{display: 'flex', gap: 10, alignItems: 'center'}}>
						<Chip kind="OFFIZIELL" size={15} />
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 18, letterSpacing: 1.2, color: BLUE}}>{POLIZEI.officialBy}</span>
					</div>
					<div style={{marginTop: 8, fontFamily: FONTS.heading, fontWeight: 800, fontSize: 32, lineHeight: 1.14, color: COLORS.text}}>
						„{POLIZEI.official.split('Verhalten')[0]}
						<span style={{color: YELLOW, opacity: interpolate(frame, [atVerh, atVerh + 6], [0.5, 1], clamp)}}>Verhalten</span>“
					</div>
				</div>
			</In>
			<Note text={POLIZEI.count} top={1110} icon="doc" opacity={interpolate(frame, [atVerh, atVerh + 10], [0, 1], clamp)} />
			<Mark text="ILLUSTRATION" top={1196} />
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="notify" at={atTele} volume={0.4} />
			<Sfx name="click" at={atTele + 14} volume={0.4} />
			<Sfx name="pop" at={atJug} volume={0.4} />
			<Sfx name="stamp" at={atIm} volume={0.4} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 5: Offenes Planungstreffen (aufwendigste Szene) */

export const TreffenScene: React.FC<SceneProps> = ({cues}) => {
	const frame = useCurrentFrame();
	const d1 = cue(cues, 'd1', 0);
	const atAnsatz = Math.max(2, wordFrame(cues, 'Ansatz', d1.from) - 6);
	const atDi = wordFrame(cues, 'Dienstagabend', atAnsatz + 10) - 4;
	const atPlan = wordFrame(cues, 'Planungstreffen', atDi + 20) - 6;
	const atHaus = wordFrame(cues, 'DGB-Haus', atPlan + 14) - 4;
	const d2 = cue(cues, 'd2', atHaus + 30);
	const atWochen = Math.max(atHaus + 10, wordFrame(cues, 'zwei', d2.from) - 4);
	const d3 = cue(cues, 'd3', atWochen + 50);
	const atBespr = Math.max(atWochen + 20, wordFrame(cues, 'besprochen', d3.from) - 10);
	const atBekannt = atBespr + 14;
	// Außen → Saal: Kamera fährt auf das Saalfenster, dann Innenansicht
	const into = interpolate(frame, [d3.from - 16, d3.from + 4], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const push = interpolate(frame, [0, d3.from - 16], [0, 1], clamp);
	const houseScale = 1 + push * 0.08 + into * 1.6;
	const lit = interpolate(frame, [0, atHaus], [0.3, 0.62], clamp);
	const saal = interpolate(frame, [atHaus, atHaus + 12], [0, 1], clamp);
	const arrivals = interpolate(frame, [atPlan - 10, atWochen + 20], [0, 1], clamp);
	const people = interpolate(frame, [d3.from, d3.from + 24], [0, 1], clamp);
	const flip = interpolate(frame, [d3.from + 4, atBespr + 30], [0, 1], clamp);
	const dim = interpolate(frame, [atBekannt - 4, atBekannt + 8], [0, 1], clamp);
	const stamp = useSpring(atBekannt, 12, 200);
	const lead = useSpring(atWochen, 13, 170);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{background: 'linear-gradient(#050820 0%, #101848 45%, #2C2660 75%, #3A2C5E 100%)'}} />
			<Stars seed="tr18" n={30} height={520} />
			{/* Außenansicht */}
			<div style={{position: 'absolute', left: 110, top: 560, width: 860, opacity: 1 - into, scale: String(houseScale), transformOrigin: '62% 72%'}}>
				<UnionHouse width={860} lit={lit} saal={saal} label={TREFFEN.building} arrivals={arrivals} />
			</div>
			{/* Innenansicht (Symbolbild) */}
			<div style={{position: 'absolute', left: 90, top: 560, width: 900, opacity: into, scale: String(1.15 - 0.15 * into)}}>
				<MeetingRoom width={900} people={people} flip={flip} items={TREFFEN.flip} dim={dim} />
			</div>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.95) 0%, rgba(4,6,20,0.7) 24%, rgba(4,6,20,0) 32%, rgba(4,6,20,0) 66%, rgba(4,6,20,0.85) 84%, rgba(4,6,20,0.95) 100%)'}} />
			<SceneTag text="PLANUNGSTREFFEN" color={YELLOW} icon="users" />
			<In at={atAnsatz} dy={20} style={{left: LAYOUT.left, top: 378, width: LAYOUT.width}}>
				<Card color={YELLOW} style={{padding: '12px 18px'}} glow={0.35}>
					<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
						<Chip kind="EINLADUNG" size={15} />
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 18, letterSpacing: 1.2, color: COLORS.textMuted}}>{TREFFEN.invite}</span>
					</div>
					<div style={{marginTop: 6, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 44, lineHeight: 1.05, color: COLORS.text, opacity: interpolate(frame, [atPlan, atPlan + 8], [0.25, 1], clamp)}}>{TREFFEN.label}</div>
					<div style={{display: 'flex', gap: 14, marginTop: 8, alignItems: 'center'}}>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, color: YELLOW, opacity: interpolate(frame, [atDi, atDi + 8], [0, 1], clamp), whiteSpace: 'nowrap'}}>{TREFFEN.when}</span>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, color: COLORS.text, opacity: interpolate(frame, [atHaus, atHaus + 8], [0, 1], clamp), whiteSpace: 'nowrap'}}>{TREFFEN.where}</span>
					</div>
				</Card>
			</In>
			{/* Vorlauf bis zum 12.12. */}
			{frame >= atWochen - 1 ? (
				<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 1110, opacity: Math.min(1, lead * 1.6) * (1 - interpolate(frame, [atBekannt - 6, atBekannt + 4], [0, 1], clamp)), translate: `0 ${(1 - lead) * 30}px`}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 16px', borderRadius: 16, background: 'rgba(8,10,28,0.94)', border: `2.5px solid ${YELLOW}`}}>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, color: COLORS.text, whiteSpace: 'nowrap'}}>24.11.</span>
						<div style={{flex: 1, height: 10, borderRadius: 5, background: withAlpha('#FFFFFF', 0.15), position: 'relative'}}>
							<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${interpolate(frame, [atWochen, atWochen + 22], [0, 100], clamp)}%`, borderRadius: 5, background: YELLOW}} />
						</div>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, color: YELLOW, whiteSpace: 'nowrap'}}>12.12.</span>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: YELLOW, whiteSpace: 'nowrap'}}>
							<CountUp value={18} at={atWochen} dur={22} /> TAGE
						</span>
					</div>
				</div>
			) : null}
			{/* Ergebnis nicht öffentlich bekannt */}
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 840, display: 'flex', justifyContent: 'center', opacity: Math.min(1, stamp * 1.7), scale: String(1.3 - 0.3 * stamp)}}>
				<div style={{padding: '10px 22px', borderRadius: 14, border: `4px solid ${AMBER}`, background: 'rgba(8,10,28,0.95)', rotate: '-3deg', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, color: AMBER, whiteSpace: 'nowrap'}}>{TREFFEN.result}</div>
			</div>
			<Note text={TREFFEN.dgb} top={1186} icon="info" opacity={interpolate(frame, [atHaus + 6, atHaus + 16], [0, 1], clamp)} />
			<Mark text={into > 0.5 ? 'SYMBOLBILD · ILLUSTRATION' : 'ILLUSTRATION'} top={1150} right={150} />
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="click" at={atDi} volume={0.4} />
			<Sfx name="pop" at={atPlan} volume={0.45} />
			<Sfx name="blip" at={atHaus} volume={0.45} />
			<Sfx name="tick" at={atWochen} volume={0.4} />
			<Sfx name="whoosh" at={d3.from - 16} volume={0.4} />
			<Sfx name="stamp" at={atBekannt} volume={0.45} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 6: Abstimmung? + Rückblick 20.11. */

export const AbstimmungScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const e1 = cue(cues, 'e1', 0);
	const atFfm = Math.min(6, wordFrame(cues, 'Frankfurter', e1.from) - 6);
	const atBund = wordFrame(cues, 'Bundesinitiative', atFfm + 14) - 6;
	const atBesser = wordFrame(cues, 'besser', atBund + 10) - 6;
	const e2 = cue(cues, 'e2', atBesser + 40);
	const at20 = Math.max(atBesser + 10, wordFrame(cues, '20', e2.from) - 6);
	const atKund = wordFrame(cues, 'Kundgebung', at20 + 30) - 6;
	const atZug = wordFrame(cues, 'Zug', atKund + 20) - 6;
	const left = interpolate(frame, [atFfm, atFfm + 10], [0, 1], clamp);
	const right = interpolate(frame, [atBund, atBund + 10], [0, 1], clamp);
	const link = interpolate(frame, [atBesser, atBesser + 16], [0, 1], {...clamp, easing: EASE_OUT});
	const up = interpolate(frame, [at20 - 4, at20 + 12], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const pull = interpolate(frame, [0, durationInFrames], [0, 1], clamp);
	const cardA = useSpring(atKund, 13, 180);
	const cardB = useSpring(atZug, 13, 180);
	const RetroCard: React.FC<{s: number; at: number; color: string; where: string; n: number; by: string}> = ({s, at, color, where, n, by}) => (
		<div style={{width: 420, opacity: Math.min(1, s * 1.7), translate: `0 ${(1 - s) * 40}px`, boxSizing: 'border-box', padding: '12px 16px 14px', borderRadius: 18, background: 'rgba(8,10,28,0.95)', border: `3px solid ${color}`, boxShadow: '0 18px 40px rgba(0,0,0,0.5)'}}>
			<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 24, lineHeight: 1.1, color}}>{where}</div>
			<div style={{marginTop: 6, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 64, lineHeight: 1, color: COLORS.text}}>
				ca. <CountUp value={n} at={at} dur={18} />
			</div>
			<div style={{marginTop: 4, fontFamily: FONTS.body, fontWeight: 700, fontSize: 21, color: COLORS.textMuted}}>{by}</div>
		</div>
	);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<NightBack progress={pull} mood="calm" lit={0.35} />
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.95) 0%, rgba(4,6,20,0.85) 50%, rgba(4,6,20,0.93) 100%)'}} />
			<SceneTag text={up > 0.5 ? 'RÜCKBLICK 20.11.' : 'ABSTIMMUNG?'} color={VIOLET} icon="users" />
			<In at={0} dy={20} style={{left: LAYOUT.left, top: 378, width: LAYOUT.width}}>
				<Card color={VIOLET} style={{padding: '12px 18px'}} glow={0.3}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 42, lineHeight: 1.08, color: COLORS.text}}>{ABSTIMMUNG.headline}</div>
					<div style={{marginTop: 8, display: 'flex', gap: 8}}>
						<Chip kind="OFFEN" size={15} />
					</div>
				</Card>
			</In>
			<div style={{position: 'absolute', left: 110, top: 590 - up * 60, scale: String(1 - up * 0.22), transformOrigin: '50% 0%'}}>
				<StructureLink width={860} left={ABSTIMMUNG.left} right={ABSTIMMUNG.right} leftColor={YELLOW} rightColor={ORANGE} link={link} on={[left, right]} />
			</div>
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 900, display: 'flex', gap: 20, alignItems: 'center', opacity: interpolate(frame, [atBesser + 6, atBesser + 16], [0, 1], clamp) * (1 - up), translate: `0 ${up * 40}px`}}>
				<CalendarSheet to={{day: TERMIN.day, month: TERMIN.month}} at={0} width={150} accent={RED} />
				<div style={{flex: 1, padding: '14px 18px', borderRadius: 18, background: 'rgba(8,10,28,0.94)', border: `2.5px solid ${withAlpha(VIOLET, 0.8)}`}}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, lineHeight: 1.1, color: COLORS.text}}>{ABSTIMMUNG.open}</div>
					<div style={{marginTop: 6}}>
						<Chip kind="OFFEN" size={15} />
					</div>
				</div>
			</div>
			{frame >= at20 - 4 ? (
				<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 800, opacity: up}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
						<Chip kind="RÜCKBLICK" size={16} />
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 32, color: COLORS.text}}>{ABSTIMMUNG.retro}</span>
					</div>
					<div style={{marginTop: 16, display: 'flex', justifyContent: 'space-between'}}>
						<RetroCard s={cardA} at={atKund} color={CYAN} where={ABSTIMMUNG.a.where} n={ABSTIMMUNG.a.n} by={ABSTIMMUNG.a.by} />
						<RetroCard s={cardB} at={atZug} color={ORANGE} where={ABSTIMMUNG.b.where} n={ABSTIMMUNG.b.n} by={ABSTIMMUNG.b.by} />
					</div>
				</div>
			) : null}
			<Note text={ABSTIMMUNG.note} top={1186} icon="info" opacity={interpolate(frame, [atZug + 6, atZug + 16], [0, 1], clamp)} />
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="blip" at={atFfm} volume={0.45} />
			<Sfx name="blip" at={atBund} volume={0.45} />
			<Sfx name="pop" at={atBesser + 8} volume={0.45} />
			<Sfx name="tick" at={at20} volume={0.4} />
			<Sfx name="softImpact" at={atKund} volume={0.4} />
			<Sfx name="softImpact" at={atZug} volume={0.4} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 7: 12.12. Gallusanlage (OSM) vs. Website „Standort folgt“ */

const PLAN_MAP = gallusMap as unknown as CityMapData;
const MAP_K = 0.62;

const PlaceMarker: React.FC<{top: string; title: string; sub: string; color: string; on: number; shift?: number; small?: boolean}> = ({top, title, sub, color, on, shift = 0, small = false}) => (
	<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: on, scale: String(0.7 + 0.3 * on), transformOrigin: '50% 100%'}}>
		<div style={{translate: `${shift}px 0`, padding: small ? '4px 10px 6px' : '6px 14px 8px', borderRadius: 14, background: 'rgba(8,10,28,0.95)', border: `3px solid ${color}`, textAlign: 'center', whiteSpace: 'nowrap', boxShadow: `0 12px 30px rgba(0,0,0,0.55), 0 0 24px ${withAlpha(color, 0.35)}`}}>
			<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: small ? 15 : 19, letterSpacing: 1.3, color}}>{top}</div>
			<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: small ? 22 : 32, color: COLORS.text}}>{title}</div>
			<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: small ? 15 : 19, color: COLORS.textMuted}}>{sub}</div>
		</div>
		<div style={{width: 4, height: small ? 22 : 34, background: `linear-gradient(${color}, ${withAlpha(color, 0.1)})`}} />
		<div style={{width: small ? 14 : 20, height: small ? 14 : 20, borderRadius: 10, marginTop: -5, background: color, border: '3px solid #FFFFFF', boxShadow: `0 0 20px ${withAlpha(color, 0.9)}`}} />
	</div>
);

export const TerminScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const f1 = cue(cues, 'f1', 0);
	const at12 = Math.max(2, wordFrame(cues, '12', f1.from) - 6);
	const at14 = wordFrame(cues, '14', at12 + 20) - 4;
	const atGallus = wordFrame(cues, 'Gallusanlage', at14 + 10) - 6;
	const f2 = cue(cues, 'f2', atGallus + 40);
	const atBund = Math.max(atGallus + 10, wordFrame(cues, 'Bundesinitiative', f2.from) - 6);
	const atStandort = wordFrame(cues, 'Standort', atBund + 14) - 4;
	const [gx, gy] = cityPlaneXY(PLAN_MAP, MAP_K, TERMIN.at);
	const [dx, dy] = cityPlaneXY(PLAN_MAP, MAP_K, TREFFEN.at);
	const [hx, hy] = cityPlaneXY(PLAN_MAP, MAP_K, TERMIN.hbf);
	const cam = interpolateCamera(
		frame,
		[
			{frame: 0, cam: {x: (gx + dx + hx) / 3, y: (gy + dy + hy) / 3 - 40, zoom: 0.78, tilt: 46, rotate: -6}},
			{frame: atGallus + 6, cam: {x: gx - 30, y: gy + 30, zoom: 1.25, tilt: 54, rotate: -2}},
			{frame: durationInFrames + 10, cam: {x: gx - 20, y: gy + 40, zoom: 1.32, tilt: 55, rotate: 2}},
		],
		EASE_IN_OUT,
	);
	const gOn = interpolate(frame, [atGallus, atGallus + 10], [0, 1], clamp);
	const away = interpolate(frame, [at14 - 4, at14 + 8], [1, 0], clamp);
	const dOn = interpolate(frame, [4, 14], [0, 1], clamp) * away;
	const hOn = interpolate(frame, [8, 18], [0, 0.85], clamp) * away;
	const pulse = (frame % 40) / 40;
	const web = useSpring(atBund, 13, 170);
	const hi = interpolate(frame, [atStandort, atStandort + 6], [0, 1], clamp);
	const markers: PlaneBillboard[] = [
		{key: 'h', x: hx, y: hy, z: 4, node: <PlaceMarker top="ORIENTIERUNG" title="HAUPTBAHNHOF" sub="" color="#9AA6CC" on={hOn} small />},
		{key: 'd', x: dx, y: dy, z: 4, node: <PlaceMarker top="TREFFEN 24.11." title="DGB-HAUS" sub="" color={CYAN} on={dOn} small shift={-40} />},
		{key: 'g', x: gx, y: gy, z: 4, node: <PlaceMarker top="LAUT GRUPPE" title={TERMIN.place} sub={`12.12. · 14 Uhr · ${TERMIN.area.toLowerCase().replace(/^./, (c) => c.toUpperCase())}`} color={YELLOW} on={gOn} />},
	];
	return (
		<AbsoluteFill style={{backgroundColor: '#080C1F', overflow: 'hidden'}}>
			<CityPlane
				map={PLAN_MAP}
				k={MAP_K}
				camera={cam as PlaneCamera}
				anchor={[540, 980]}
				floors={6}
				spots={[
					{at: TERMIN.at, color: YELLOW, radius: 80, on: gOn, pulse},
					{at: TREFFEN.at, color: CYAN, radius: 40, on: dOn * 0.8},
				]}
				ground={{parks: '#123A34'}}
				markers={markers}
			/>
			<Shade top={0.95} bottom={0.92} mid={[30, 60]} />
			<SceneTag text="12.12. · ANGEKÜNDIGT" color={YELLOW} icon="pin" />
			<In at={at12} dy={20} style={{left: LAYOUT.left, top: 378, width: LAYOUT.width}}>
				<div style={{display: 'flex', gap: 18, alignItems: 'center'}}>
					<CalendarSheet to={{day: TERMIN.day, month: TERMIN.month}} at={0} width={140} accent={RED} />
					<div>
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 50, lineHeight: 1, color: COLORS.text, whiteSpace: 'nowrap'}}>
							{TERMIN.date}
							<span style={{color: YELLOW, opacity: interpolate(frame, [at14, at14 + 6], [0, 1], clamp)}}> · {TERMIN.time}</span>
						</div>
						<div style={{marginTop: 8, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, color: YELLOW, opacity: gOn}}>{TERMIN.place}</div>
						<div style={{marginTop: 8, display: 'flex', gap: 8, alignItems: 'center'}}>
							<Chip kind="ANGEKÜNDIGT" size={14} />
							<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 17, letterSpacing: 1, color: COLORS.textMuted, whiteSpace: 'nowrap'}}>{TERMIN.by}</span>
						</div>
					</div>
				</div>
			</In>
			{frame >= atBund - 1 ? (
				<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 950, opacity: Math.min(1, web * 1.7), translate: `0 ${(1 - web) * 60}px`}}>
					<div style={{borderRadius: 20, overflow: 'hidden', background: '#F4F5FA', boxShadow: '0 30px 70px rgba(0,0,0,0.6)'}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#D9DCE8'}}>
							{['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
								<div key={c} style={{width: 14, height: 14, borderRadius: 7, background: c}} />
							))}
							<span style={{marginLeft: 10, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 18, letterSpacing: 1.2, color: '#3A3F5C'}}>{TERMIN.website}</span>
						</div>
						<div style={{padding: '14px 20px 16px'}}>
							<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: '#14141C'}}>{TERMIN.websiteCity}</div>
							<div style={{marginTop: 6, display: 'inline-block', padding: '2px 10px', borderRadius: 10, border: `3px solid ${withAlpha('#E8A400', hi)}`, background: withAlpha('#FFE08A', 0.6 * hi), fontFamily: FONTS.body, fontWeight: 800, fontSize: 30, color: '#14141C'}}>{TERMIN.websitePlace}</div>
							<div style={{marginTop: 6, fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, color: '#4A4F6A'}}>{TERMIN.websiteTime}</div>
							<div style={{marginTop: 6, fontFamily: FONTS.body, fontWeight: 700, fontSize: 19, color: '#7A7F9A'}}>{TERMIN.websiteStand}</div>
						</div>
					</div>
				</div>
			) : null}
			<div style={{position: 'absolute', left: LAYOUT.left, top: 1206, fontFamily: FONTS.body, fontWeight: 700, fontSize: 19, color: withAlpha(COLORS.text, 0.6)}}>Karte © OpenStreetMap-Mitwirkende · Ort laut Beitrag der Gruppe · keine Route veröffentlicht</div>
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="click" at={at12} volume={0.4} />
			<Sfx name="tick" at={at14} volume={0.4} />
			<Sfx name="blip" at={atGallus} volume={0.5} />
			<Sfx name="notify" at={atBund} volume={0.4} />
			<Sfx name="click" at={atStandort} volume={0.4} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 8: Was ist offen? (Stufen) */

export const OffenScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const g1 = cue(cues, 'g1', 0);
	const atAnm = Math.max(10, wordFrame(cues, 'angemeldet', g1.from) - 6);
	const atOeff = wordFrame(cues, 'öffentlich', atAnm + 10) - 4;
	const pull = interpolate(frame, [0, durationInFrames], [0, 1], clamp);
	const ats = [0, atAnm, atAnm + 8, atOeff + 4];
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<NightBack progress={pull} mood="police" lit={0.5} />
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.9) 0%, rgba(4,6,20,0.6) 50%, rgba(4,6,20,0.84) 100%)'}} />
			<SceneTag text="WAS IST OFFEN?" color={ACCENT.no} icon="clock" />
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 400, display: 'flex', flexDirection: 'column', gap: 22}}>
				{STUFEN.map((s, i) => {
					const yes = s.state === 'yes';
					const c = yes ? GREEN : AMBER;
					const strong = i === 1 ? interpolate(frame, [atAnm, atAnm + 8], [0, 1], clamp) : i === 3 ? interpolate(frame, [ats[3], ats[3] + 8], [0, 1], clamp) : 0;
					return (
						<div key={s.label} style={{position: 'relative', height: 150}}>
							<In at={ats[i]} dx={-40} dy={0} style={{left: 0, top: 0, width: LAYOUT.width}}>
								<div style={{display: 'flex', alignItems: 'center', gap: 20, padding: '16px 20px', borderRadius: 22, background: 'rgba(12,16,44,0.95)', border: `3px solid ${withAlpha(c, 0.5 + 0.5 * strong)}`, boxShadow: `0 16px 36px rgba(0,0,0,0.5), 0 0 ${30 * strong}px ${withAlpha(c, 0.4)}`}}>
									<div style={{width: 96, height: 96, borderRadius: 48, flexShrink: 0, background: withAlpha(c, 0.18), border: `4px solid ${c}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 56, color: c}}>
										{yes ? <P2Icon name="check" size={56} color={c} stroke={3.4} /> : '?'}
									</div>
									<div>
										<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, lineHeight: 1.05, color: COLORS.text}}>{s.label}</div>
										<div style={{marginTop: 4, fontFamily: FONTS.body, fontWeight: 700, fontSize: 26, color: c}}>{s.sub}</div>
									</div>
								</div>
							</In>
						</div>
					);
				})}
			</div>
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="click" at={2} volume={0.4} />
			<Sfx name="pop" at={atAnm} volume={0.4} />
			<Sfx name="pop" at={atAnm + 8} volume={0.4} />
			<Sfx name="pop" at={ats[3]} volume={0.4} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 9: Schlussfrage */

export const FrageScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const q1 = cue(cues, 'q1', 0);
	const atOffen = wordFrame(cues, 'offen', q1.from + 50) - 14;
	const stamp = useSpring(atOffen, 12, 200);
	const pull = interpolate(frame, [0, durationInFrames], [0, 1], clamp);
	const icons = [<Vest key="v" size={110} />, <Tech key="t" size={110} level={0.5 + 0.5 * Math.sin(frame / 3)} />, <RouteMark key="r" size={110} />];
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{background: 'linear-gradient(#050820 0%, #101848 50%, #2A2462 100%)'}} />
			<Stars seed="fr18" n={30} height={600} />
			<div style={{position: 'absolute', left: 90 - pull * 30, top: 760, opacity: 0.8}}>
				<FrankfurtSkyline width={900} litRatio={0.5} showRiver showBridge={false} />
			</div>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.95) 0%, rgba(4,6,20,0.8) 40%, rgba(4,6,20,0.35) 62%, rgba(4,6,20,0.85) 100%)'}} />
			<SceneTag text="DIE FRAGE" color={YELLOW} icon="megaphone" />
			<In at={0} dy={24} style={{left: LAYOUT.left, top: 390, width: LAYOUT.width}}>
				<Card color={YELLOW} style={{padding: '16px 22px'}} glow={0.4}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 58, lineHeight: 1.05, color: COLORS.text}}>{FRAGE.q}</div>
				</Card>
			</In>
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 760, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
				{icons.map((ic, i) => (
					<In key={i} at={4 + i * 5} dy={30} style={{position: 'relative'}}>
						<div style={{width: 180, height: 180, borderRadius: 26, background: 'rgba(14,18,48,0.92)', border: `3px solid ${withAlpha('#FFFFFF', 0.25)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
							{ic}
							<div style={{position: 'absolute', right: -12, top: -12, width: 44, height: 44, borderRadius: 22, background: YELLOW, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: '#14141C'}}>?</div>
						</div>
					</In>
				))}
				<In at={18} dy={30} style={{position: 'relative'}}>
					<CalendarSheet to={{day: TERMIN.day, month: TERMIN.month}} at={0} width={170} accent={RED} />
				</In>
			</div>
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 1010, display: 'flex', justifyContent: 'center', opacity: Math.min(1, stamp * 1.7), scale: String(1.4 - 0.4 * stamp)}}>
				<div style={{padding: '8px 34px', borderRadius: 16, border: `5px solid ${ACCENT.no}`, background: 'rgba(8,10,28,0.95)', rotate: '-4deg', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 64, letterSpacing: 6, color: ACCENT.no}}>{FRAGE.open}</div>
			</div>
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="pop" at={4} volume={0.4} />
			<Sfx name="stamp" at={atOffen} volume={0.5} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 10: Abo-Aufruf FrankfurtRedNews */

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
				<NightCity mood={MOODS.dusk} progress={pull} litRatio={0.42} showMoon bokeh={16} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.9) 0%, rgba(4,6,20,0.6) 50%, rgba(4,6,20,0.5) 75%, rgba(4,6,20,0.8) 100%)'}} />
			<div style={{position: 'absolute', left: 64, width: 866, top: 470, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, opacity: Math.min(1, cta * 2), translate: `0 ${(1 - cta) * 50}px`}}>
				<div style={{position: 'relative'}}>
					<BrandLogo size={230} ring={6 + Math.sin(frame / 4) * 3} />
					<div style={{position: 'absolute', left: '50%', bottom: -26, translate: '-50% 0', scale: String(press), width: 68, height: 68, borderRadius: 34, background: followed ? GREEN : RED, border: '4px solid #FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 24px rgba(0,0,0,0.5)'}}>
						<P2Icon name={followed ? 'check' : 'plus'} size={38} color="#FFFFFF" stroke={3.4} />
					</div>
				</div>
				<span style={{marginTop: 12, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 54, color: COLORS.text}}>{handleWithAt(NEWS)}</span>
				<div style={{padding: '12px 30px 14px', borderRadius: 20, background: RED, boxShadow: '0 20px 50px rgba(255,59,78,0.35)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 42, color: '#FFFFFF', scale: String(followed ? 1 + 0.035 * Math.sin((frame - atName) / 5) : 1)}}>{OUTRO.cta}</div>
				<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 24, letterSpacing: 2.5, color: YELLOW}}>{OUTRO.ctaSub}</span>
			</div>
			<Sfx name="pop" at={atCta} volume={0.6} />
			<Sfx name="click" at={atName + 2} volume={0.6} />
		</AbsoluteFill>
	);
};
