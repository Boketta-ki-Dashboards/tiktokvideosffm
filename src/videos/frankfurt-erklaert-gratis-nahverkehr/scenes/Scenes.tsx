import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {FrankfurtSkyline} from '../../../components/backgrounds/FrankfurtSkyline';
import {BrandLogo} from '../../../components/brand/BrandLogo';
import {VectorPerson} from '../../../components/characters/VectorPerson';
import {interpolateCamera, type PlaneBillboard, type PlaneCamera} from '../../../components/map/TiltedPlane';
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
import {BigClock, RoemerFacade, TramSide, UBahnTrain} from '../../frankfurt-erklaert-20nov-oepnv/visuals/Transit';
import {Card, CountUp, P2Icon, type P2IconName, Stars, useSpring} from '../../frankfurt-erklaert-genz-phase2-2026-11-14/scenes/kit';
import {AUSNAHMEN, COVER, GRATIS, HINTERGRUND, KAMPAGNE, MITTEL, OUTRO, PAKET, STAND, TAGE, UEBERSCHNEIDUNG, ZEIT} from '../content';
import {GRATIS_COVER_LAYOUT} from '../cover-layout';
import {CityBus, CoinStack, Garland, NewsTile, SBahnTrain, ShoppingBag, TARIF_AREAS, TariffPlane, tarifXY} from '../visuals/Transport';

const RED = ACCENT.brand;
const BLUE = ACCENT.info;
const GREEN = '#3DDC84';
const YELLOW = COLORS.signal;
const CYAN = '#46C2FF';
const AMBER = '#FFB547';
const VIOLET = '#B794F6';
const NEWS = 'news' as const;

/* ------------------------------------------------------------------ Bausteine (wie #14–#18) */

type Kind = 'OFFIZIELL' | 'LAUT FAZ' | 'ANGEKÜNDIGT' | 'RÜCKBLICK' | 'OFFEN' | 'ILLUSTRATION' | 'SCHEMATISCH' | 'AUSNAHME';
const KIND_COLOR: Record<Kind, string> = {OFFIZIELL: BLUE, 'LAUT FAZ': VIOLET, ANGEKÜNDIGT: YELLOW, RÜCKBLICK: '#9AA6CC', OFFEN: ACCENT.no, ILLUSTRATION: '#9AA6CC', SCHEMATISCH: '#9AA6CC', AUSNAHME: '#FF5A6E'};
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

const Note: React.FC<{text: string; top: number; icon?: P2IconName; opacity?: number}> = ({text, top, icon = 'info', opacity = 1}) => (
	<div style={{position: 'absolute', left: LAYOUT.left, top, maxWidth: LAYOUT.width, display: 'flex', alignItems: 'center', gap: 10, padding: '5px 14px', borderRadius: 12, background: 'rgba(8,10,28,0.88)', boxSizing: 'border-box', opacity}}>
		<P2Icon name={icon} size={24} color={COLORS.textMuted} />
		<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, lineHeight: 1.2, color: COLORS.textMuted}}>{text}</span>
	</div>
);

const Mark: React.FC<{text?: string; top?: number; right?: number}> = ({text = 'ILLUSTRATION', top = 1238, right = 160}) => (
	<div style={{position: 'absolute', right, top, fontFamily: FONTS.body, fontWeight: 700, fontSize: 18, letterSpacing: 1.5, color: withAlpha('#FFFFFF', 0.6)}}>{text}</div>
);

/** Weihnachtliche Nachtstadt (Serien-Nachtblau, warme Lichter). */
const XmasNight: React.FC<{progress: number; lit?: number; garland?: number}> = ({progress, lit = 0.55, garland = 1}) => (
	<AbsoluteFill>
		<AbsoluteFill style={{scale: String(1.1 - progress * 0.06), transformOrigin: '50% 80%'}}>
			<NightCity mood={MOODS.dusk} progress={0.45 + progress * 0.3} litRatio={lit} bokeh={18} showPromenade={false} />
		</AbsoluteFill>
		<div style={{position: 'absolute', left: -20, top: 300, opacity: garland}}>
			<Garland width={1120} sag={70} bulbs={24} seed="xg1" />
		</div>
	</AbsoluteFill>
);

/* ------------------------------------------------------------------ Szene 1: Titelbild */

/**
 * Titelbild (Video-Frame 0 und PNG, nach COVER_ZONE): Serientitel, „BUS & BAHN IN FRANKFURT“, riesig „0,00 €“, rote Karte
 * „AUSGERECHNET AM 12.12.!“, Plakette „12. + 19. DEZEMBER · STAND 26.11.“, Straßenbahn unter einer Lichterkette vor der Skyline
 * (ILLUSTRATION), Logo + @frankfurtrednews; im PNG zusätzlich „KOSTENLOS – WAS GILT?“.
 */
export const GratisCover: React.FC<{morph?: number; thumbnail?: boolean; meta?: number}> = ({morph = 0, thumbnail = false, meta = 1}) => {
	const frame = useCurrentFrame();
	const L = GRATIS_COVER_LAYOUT;
	const m = EASE_IN_OUT(Math.min(1, Math.max(0, morph)));
	const text = 1 - Math.min(1, m * 1.6);
	const bob = Math.sin(frame / 26) * 3;
	const tramX = 40 - ((frame * 1.6) % 60);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{background: 'linear-gradient(#050820 0%, #0E1446 40%, #2A2462 70%, #4A2E66 100%)'}} />
			<Stars seed="c19c" n={36} height={460} />
			<div style={{position: 'absolute', left: 90 + Math.sin(frame / 60) * 8, top: 560, opacity: 0.7}}>
				<FrankfurtSkyline width={900} litRatio={0.55} showRiver={false} showBridge={false} />
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 1060, height: 200, background: 'linear-gradient(#232850, #12152E)'}} />
			<div style={{position: 'absolute', left: -20, top: L.artTop - 20}}>
				<Garland width={1120} sag={60} bulbs={22} seed="cvg" />
			</div>
			<div style={{position: 'absolute', left: tramX, top: L.artBottom - 210}}>
				<TramSide width={760} line="11" lit={1} />
			</div>
			<AbsoluteFill style={{background: `linear-gradient(rgba(4,6,20,${0.45 * text + 0.1}) 0%, rgba(4,6,20,${0.1 * text}) 14%, rgba(4,6,20,${0.6 * text}) 24%, rgba(4,6,20,${0.86 * text}) 34%, rgba(4,6,20,${0.86 * text}) 46%, rgba(4,6,20,${0.3 * text}) 50%, rgba(4,6,20,${0.1 * text}) 60%, rgba(4,6,20,${0.75 * text}) 100%)`}} />
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
				<div style={{position: 'absolute', left: L.sideMin, top: L.artBottom - 30, fontFamily: FONTS.body, fontWeight: 700, fontSize: 18, letterSpacing: 1.5, color: withAlpha('#FFFFFF', 0.6)}}>ILLUSTRATION</div>
				<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.metaTop, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, opacity: meta}}>
					<BrandLogo size={52} />
					<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 30, color: COLORS.textMuted}}>{handleWithAt(NEWS)}</span>
				</div>
				{thumbnail ? (
					<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.thumbTop, display: 'flex', justifyContent: 'center'}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 22px', borderRadius: 16, background: 'rgba(8,10,28,0.92)', border: `2.5px solid ${YELLOW}`}}>
							<P2Icon name="info" size={30} color={YELLOW} />
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
	const atKost = wordFrame(cues, 'kostenlos', h2.from + 30) - 4;
	const at12 = wordFrame(cues, '12', atKost + 20) - 4;
	const morph = interpolate(frame, [durationInFrames - 14, durationInFrames - 1], [0, 1], clamp);
	const meta = interpolate(frame, [h2.from - 8, h2.from], [1, 0], clamp);
	return (
		<AbsoluteFill>
			<GratisCover morph={morph} meta={meta} />
			<Sfx name="softImpact" at={0} volume={0.5} />
			<Sfx name="pop" at={atKost} volume={0.45} />
			<Sfx name="tick" at={at12} volume={0.4} />
			<Sfx name="whoosh" at={Math.max(0, durationInFrames - 14)} volume={0.45} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 2: Maßnahmenpaket */

export const PaketScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const a1 = cue(cues, 'a1', 0);
	const atMi = Math.max(2, wordFrame(cues, 'Mittwoch', a1.from) - 6);
	const atPaket = wordFrame(cues, 'Paket', atMi + 10) - 4;
	const atInnen = wordFrame(cues, 'Innenstadt', atPaket + 8) - 4;
	const atHandel = wordFrame(cues, 'Handel', atInnen + 8) - 4;
	const pull = interpolate(frame, [0, durationInFrames], [0, 1], clamp);
	const goals = [atPaket + 6, atInnen, atHandel];
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<XmasNight progress={pull} />
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.94) 0%, rgba(4,6,20,0.7) 34%, rgba(4,6,20,0.2) 58%, rgba(4,6,20,0.85) 100%)'}} />
			<div style={{position: 'absolute', left: 200, top: 760, scale: String(1.02 + pull * 0.04), transformOrigin: '50% 100%'}}>
				<RoemerFacade width={680} lit={0.85} />
			</div>
			<SceneTag text="STADT FRANKFURT" color={BLUE} icon="doc" />
			<In at={0} dy={20} style={{left: LAYOUT.left, top: 378, width: LAYOUT.width}}>
				<Card color={BLUE} style={{padding: '12px 18px'}} glow={0.3}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 44, lineHeight: 1.05, color: COLORS.text}}>{PAKET.headline}</div>
					<div style={{display: 'flex', gap: 10, alignItems: 'center', marginTop: 8, opacity: interpolate(frame, [atMi, atMi + 8], [0.2, 1], clamp)}}>
						<Chip kind="OFFIZIELL" size={15} />
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 24, color: YELLOW, whiteSpace: 'nowrap'}}>{PAKET.when}</span>
					</div>
				</Card>
			</In>
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 560, display: 'flex', flexDirection: 'column', gap: 14}}>
				{PAKET.goals.map((g, i) => (
					<div key={g} style={{position: 'relative', height: 62}}>
						<In at={goals[i]} dx={-40} dy={0} style={{left: 0, top: 0}}>
							<div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '8px 18px', borderRadius: 16, background: 'rgba(8,10,28,0.92)', border: `3px solid ${[GREEN, CYAN, AMBER][i]}`}}>
								<P2Icon name={(['check', 'users', 'plus'] as P2IconName[])[i]} size={30} color={[GREEN, CYAN, AMBER][i]} stroke={3} />
								<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 32, color: COLORS.text, whiteSpace: 'nowrap'}}>{g}</span>
							</div>
						</In>
					</div>
				))}
			</div>
			<Note text={PAKET.by} top={1206} icon="doc" opacity={interpolate(frame, [atPaket, atPaket + 10], [0, 1], clamp)} />
			<Mark top={1160} />
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="paper" at={atMi} volume={0.4} />
			{goals.map((g, i) => (
				<Sfx key={i} name="pop" at={g} volume={0.4} />
			))}
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 3: Die beiden Termine + 0,00 € */

export const TermineScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const a2 = cue(cues, 'a2', 0);
	const at12 = Math.max(4, wordFrame(cues, '12', a2.from + 10) - 6);
	const at19 = wordFrame(cues, '19', at12 + 10) - 6;
	const atRmv = wordFrame(cues, 'Busse', at19 + 14) - 6;
	const atTarif = wordFrame(cues, 'Tarifgebiet', atRmv + 14) - 4;
	const atKost = wordFrame(cues, 'kostenlos', atTarif + 10) - 6;
	const price = useSpring(atRmv, 10, 220);
	const pull = interpolate(frame, [0, durationInFrames], [0, 1], clamp);
	const cals = [Math.min(at12, 3), Math.min(at19, 12)];
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<XmasNight progress={pull} lit={0.5} />
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.92) 0%, rgba(4,6,20,0.62) 40%, rgba(4,6,20,0.66) 70%, rgba(4,6,20,0.9) 100%)'}} />
			<SceneTag text="DIE TERMINE" color={YELLOW} icon="clock" />
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 400, display: 'flex', justifyContent: 'space-around'}}>
				{TAGE.map((t, i) => (
					<div key={t.label} style={{position: 'relative', width: 320, height: 420}}>
						<In at={cals[i]} dy={-40} style={{left: 10, top: 0}}>
							<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12}}>
								<div style={{filter: `drop-shadow(0 0 ${30 * Math.min(1, Math.max(0, (frame - cals[i]) / 10))}px ${withAlpha(YELLOW, 0.5)})`}}>
									<CalendarSheet to={{day: t.day, month: t.month}} at={0} width={280} accent={RED} />
								</div>
								<span style={{padding: '4px 16px', borderRadius: 12, background: YELLOW, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, letterSpacing: 2, color: '#14141C'}}>{t.weekday}</span>
							</div>
						</In>
					</div>
				))}
			</div>
			{frame >= atRmv - 1 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 830, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: Math.min(1, price * 1.6), scale: String(1.5 - 0.5 * price)}}>
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 170, lineHeight: 0.95, letterSpacing: -4, color: YELLOW, textShadow: `0 0 60px ${withAlpha(YELLOW, 0.5)}, 0 18px 40px rgba(0,0,0,0.8)`}}>{GRATIS.price}</span>
					<span style={{marginTop: 6, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, color: COLORS.text}}>{GRATIS.count}</span>
				</div>
			) : null}
			<In at={atTarif} dy={20} style={{left: LAYOUT.left, top: 1080, width: LAYOUT.width}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', borderRadius: 14, background: 'rgba(8,10,28,0.94)', border: `2.5px solid ${GREEN}`}}>
					<Chip kind="OFFIZIELL" size={14} />
					<div>
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 24, color: COLORS.text}}>{GRATIS.scope}</div>
						<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 19, color: COLORS.textMuted, opacity: interpolate(frame, [atKost, atKost + 8], [0.4, 1], clamp)}}>{GRATIS.scopeBy} · {GRATIS.notForever.toLowerCase()}</div>
					</div>
				</div>
			</In>
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="paper" at={at12} volume={0.45} />
			<Sfx name="paper" at={at19} volume={0.45} />
			<Sfx name="softImpact" at={atRmv} volume={0.55} />
			<Sfx name="click" at={atTarif} volume={0.4} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 4: Verkehrsmittel + Uhr */

export const FahrzeugeScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const b1 = cue(cues, 'b1', 0);
	const atBus = Math.max(2, wordFrame(cues, 'Bus', b1.from) - 6);
	const atTram = wordFrame(cues, 'Straßenbahn', atBus + 6) - 6;
	const atU = wordFrame(cues, 'U-', atTram + 6) - 6;
	const atS = wordFrame(cues, 'S-Bahn', atU + 4) - 6;
	const at0 = wordFrame(cues, '0', atS + 10) - 4;
	const at5 = wordFrame(cues, '5', at0 + 10) - 4;
	const pull = interpolate(frame, [0, durationInFrames], [0, 1], clamp);
	const minutes = interpolate(frame, [at0, at5 + 10], [0, 300], {...clamp, easing: EASE_IN_OUT});
	const rows = [
		{at: atBus, label: MITTEL[0].label, node: <CityBus width={560} />, color: VIOLET},
		{at: atTram, label: MITTEL[1].label, node: <TramSide width={560} line="12" />, color: '#22C9BF'},
		{at: atU, label: MITTEL[2].label, node: <UBahnTrain width={560} line="U4" />, color: '#FF5AA8'},
		{at: atS, label: MITTEL[3].label, node: <SBahnTrain width={560} line="S8" />, color: '#E5394A'},
	];
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<XmasNight progress={pull} lit={0.45} garland={0.6} />
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.94) 0%, rgba(4,6,20,0.78) 40%, rgba(4,6,20,0.78) 70%, rgba(4,6,20,0.92) 100%)'}} />
			<SceneTag text="ALLE RMV-VERKEHRSMITTEL" color={GREEN} icon="route" />
			{rows.map((r, i) => {
				const s = interpolate(frame, [r.at, r.at + 14], [0, 1], {...clamp, easing: EASE_OUT});
				return (
					<div key={r.label} style={{position: 'absolute', left: 0, top: 380 + i * 150, width: 1080, height: 150, opacity: frame < r.at - 1 ? 0 : 1}}>
						<div style={{position: 'absolute', left: -600 + s * 640 + (frame - r.at) * 0.6, top: 0}}>{r.node}</div>
						<div style={{position: 'absolute', right: 150, top: 40, opacity: s, padding: '6px 16px', borderRadius: 14, background: 'rgba(8,10,28,0.94)', border: `3px solid ${r.color}`, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: COLORS.text, whiteSpace: 'nowrap'}}>{r.label}</div>
					</div>
				);
			})}
			<In at={at0} dy={30} style={{left: LAYOUT.left, top: 990, width: LAYOUT.width}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 22, padding: '10px 18px', borderRadius: 20, background: 'rgba(8,10,28,0.94)', border: `3px solid ${YELLOW}`}}>
					<BigClock size={150} minutes={minutes} digital={`${Math.floor(minutes / 60)}:${String(Math.round(minutes % 60)).padStart(2, '0')}`} />
					<div>
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, lineHeight: 1.08, color: YELLOW}}>{ZEIT.label}</div>
						<div style={{marginTop: 6, fontFamily: FONTS.body, fontWeight: 700, fontSize: 21, color: COLORS.textMuted}}>{ZEIT.sub}</div>
					</div>
				</div>
			</In>
			<Mark top={1206} />
			<Sfx name="whoosh" at={atBus} volume={0.3} />
			<Sfx name="whoosh" at={atTram} volume={0.3} />
			<Sfx name="whoosh" at={atU} volume={0.3} />
			<Sfx name="whoosh" at={atS} volume={0.3} />
			<Sfx name="tick" at={at0} volume={0.45} />
			<Sfx name="tick" at={at5} volume={0.45} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 5: Tarifgebiet und Ausnahmen (2,5D-Karte) */

const MapLabel: React.FC<{title: string; sub?: string; color: string; on: number; small?: boolean}> = ({title, sub, color, on, small = false}) => (
	<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: on, scale: String(0.7 + 0.3 * on), transformOrigin: '50% 100%'}}>
		<div style={{padding: small ? '4px 10px' : '6px 14px 8px', borderRadius: 14, background: 'rgba(8,10,28,0.95)', border: `3px solid ${color}`, textAlign: 'center', whiteSpace: 'nowrap', boxShadow: `0 12px 30px rgba(0,0,0,0.55), 0 0 24px ${withAlpha(color, 0.35)}`}}>
			<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: small ? 20 : 28, color: COLORS.text}}>{title}</div>
			{sub ? <div style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: small ? 15 : 19, letterSpacing: 1, color}}>{sub}</div> : null}
		</div>
		<div style={{width: 4, height: small ? 18 : 28, background: `linear-gradient(${color}, ${withAlpha(color, 0.1)})`}} />
		<div style={{width: 14, height: 14, borderRadius: 7, marginTop: -4, background: color, border: '3px solid #FFFFFF'}} />
	</div>
);

export const TarifScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const c1 = cue(cues, 'c1', 0);
	const atFlug = Math.max(6, wordFrame(cues, 'Flughafen', c1.from) - 6);
	const c2 = cue(cues, 'c2', atFlug + 40);
	const atUml = Math.max(atFlug + 10, wordFrame(cues, 'Umland', c2.from) - 6);
	const atOff = wordFrame(cues, 'Offenbach', atUml + 10) - 4;
	const atGrenze = wordFrame(cues, 'Stadtgrenze', atOff + 10) - 6;
	const [fx, fy] = tarifXY(TARIF_AREAS.frankfurt.center);
	const [ax, ay] = tarifXY(TARIF_AREAS.flughafen.center);
	const [ox, oy] = tarifXY(TARIF_AREAS.offenbach.center);
	const cam = interpolateCamera(
		frame,
		[
			{frame: 0, cam: {x: fx - 40, y: fy + 20, zoom: 0.92, tilt: 44, rotate: -4}},
			{frame: atFlug + 10, cam: {x: (fx + ax) / 2, y: (fy + ay) / 2, zoom: 1.0, tilt: 48, rotate: -2}},
			{frame: atOff + 6, cam: {x: (fx + ox) / 2, y: fy + 10, zoom: 0.98, tilt: 48, rotate: 2}},
			{frame: durationInFrames + 10, cam: {x: (fx + ox) / 2 - 10, y: fy + 20, zoom: 1.02, tilt: 50, rotate: 3}},
		],
		EASE_IN_OUT,
	);
	const zoneOn = interpolate(frame, [0, 12], [0.4, 1], clamp);
	const airportOn = interpolate(frame, [atFlug, atFlug + 10], [0, 1], clamp);
	const neighborsOn = interpolate(frame, [atUml, atUml + 10], [0.25, 1], clamp);
	const route = interpolate(frame, [atOff, atGrenze + 14], [0, 0.55], {...clamp, easing: EASE_IN_OUT});
	const stamp = useSpring(atFlug + 4, 12, 200);
	const billboards: PlaneBillboard[] = [
		{key: 'f', x: fx - 70, y: fy - 10, z: 8, node: <MapLabel title="FRANKFURT" sub={`${AUSNAHMEN.zone} · KOSTENLOS`} color={GREEN} on={zoneOn} />},
		{key: 'a', x: ax, y: ay, z: 8, node: <MapLabel title="FLUGHAFEN" sub="5090 · AUSGENOMMEN" color="#FF5A6E" on={airportOn} />},
		{key: 'o', x: ox + 40, y: oy + 30, z: 4, node: <MapLabel title="OFFENBACH" sub="UMLAND" color="#8E97BD" on={neighborsOn} small />},
	];
	return (
		<AbsoluteFill style={{backgroundColor: '#0A0F2B', overflow: 'hidden'}}>
			<TariffPlane camera={cam as PlaneCamera} anchor={[540, 900]} zoneOn={zoneOn} airportOn={airportOn} neighborsOn={neighborsOn} route={route} billboards={billboards} />
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.95) 0%, rgba(4,6,20,0.7) 24%, rgba(4,6,20,0) 32%, rgba(4,6,20,0) 62%, rgba(4,6,20,0.85) 80%, rgba(4,6,20,0.95) 100%)', pointerEvents: 'none'}} />
			<SceneTag text="TARIFGEBIET" color={GREEN} icon="pin" />
			<In at={0} dy={20} style={{left: LAYOUT.left, top: 378, width: LAYOUT.width}}>
				<Card color={GREEN} style={{padding: '10px 18px'}} glow={0.3}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 38, lineHeight: 1.08, color: COLORS.text}}>{AUSNAHMEN.umland}</div>
					<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 21, color: COLORS.textMuted, marginTop: 4}}>kostenlos: {AUSNAHMEN.zone} ({AUSNAHMEN.zoneSub}) · laut Stadt</div>
				</Card>
			</In>
			<div style={{position: 'absolute', left: LAYOUT.left, top: 520, opacity: Math.min(1, stamp * 1.7), scale: String(1.3 - 0.3 * stamp), transformOrigin: '0 50%'}}>
				<div style={{padding: '8px 18px', borderRadius: 14, border: '4px solid #FF5A6E', background: 'rgba(8,10,28,0.95)', rotate: '-3deg', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 32, color: '#FF5A6E', whiteSpace: 'nowrap'}}>{AUSNAHMEN.airport}</div>
				<div style={{marginTop: 6, fontFamily: FONTS.body, fontWeight: 700, fontSize: 20, color: COLORS.textMuted}}>{AUSNAHMEN.airportSub}</div>
			</div>
			<In at={atGrenze} dy={20} style={{left: LAYOUT.left, top: 1090, width: LAYOUT.width}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '8px 14px', borderRadius: 14, background: 'rgba(8,10,28,0.94)', border: `2.5px solid ${AMBER}`}}>
					<div style={{width: 46, height: 46, borderRadius: 23, background: '#E5394A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 20, color: '#FFFFFF', flexShrink: 0}}>S</div>
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 25, lineHeight: 1.15, color: COLORS.text}}>{AUSNAHMEN.umlandSub}</span>
				</div>
			</In>
			<div style={{position: 'absolute', left: LAYOUT.left, top: 1190, fontFamily: FONTS.body, fontWeight: 700, fontSize: 18, color: withAlpha(COLORS.text, 0.6)}}>{AUSNAHMEN.mapNote}</div>
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="stamp" at={atFlug + 4} volume={0.45} />
			<Sfx name="blip" at={atUml} volume={0.4} />
			<Sfx name="whoosh" at={atOff} volume={0.3} />
			<Sfx name="click" at={atGrenze} volume={0.4} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 6: Hintergrund (Zeil, 31.10. → Belebung) */

export const HintergrundScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const d1 = cue(cues, 'd1', 0);
	const at31 = Math.max(4, wordFrame(cues, '31', d1.from + 10) - 6);
	const atHilfe = wordFrame(cues, 'Hilfe', at31 + 20) - 6;
	const lightsOn = interpolate(frame, [atHilfe - 6, atHilfe + 16], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const dolly = interpolate(frame, [0, durationInFrames], [2, 12], clamp);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{filter: `saturate(${0.5 + 0.5 * lightsOn}) brightness(${0.7 + 0.35 * lightsOn})`}}>
				<ZeilStreet dolly={dolly} pan={Math.sin(frame / 70) * 0.2} people={6 + Math.round(10 * lightsOn)} officers={0} vans={false} warm={0.4 + 0.5 * lightsOn} blueLight={0} seed="z19" />
			</AbsoluteFill>
			<div style={{position: 'absolute', left: -20, top: 560}}>
				<Garland width={1120} sag={50} bulbs={24} seed="hg" on={lightsOn} />
			</div>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.95) 0%, rgba(4,6,20,0.78) 28%, rgba(4,6,20,0.1) 44%, rgba(4,6,20,0.15) 62%, rgba(4,6,20,0.88) 82%, rgba(4,6,20,0.95) 100%)'}} />
			<SceneTag text="WARUM?" color={AMBER} icon="info" />
			<In at={0} dy={20} style={{left: LAYOUT.left, top: 378, width: LAYOUT.width}}>
				<Card color={AMBER} style={{padding: '10px 18px'}} glow={0.3}>
					<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
						<Chip kind="RÜCKBLICK" size={15} />
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: YELLOW, opacity: interpolate(frame, [at31, at31 + 8], [0.2, 1], clamp)}}>{HINTERGRUND.date}</span>
					</div>
					<div style={{marginTop: 6, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, lineHeight: 1.1, color: COLORS.text}}>{HINTERGRUND.retro}</div>
				</Card>
			</In>
			<In at={atHilfe} dy={30} style={{left: LAYOUT.left, top: 990, width: LAYOUT.width}}>
				<div style={{boxSizing: 'border-box', width: LAYOUT.width, padding: '10px 16px 12px', borderRadius: 18, background: 'rgba(8,10,28,0.95)', borderLeft: `8px solid ${BLUE}`}}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 28, lineHeight: 1.15, color: COLORS.text}}>{HINTERGRUND.quote}</div>
					<div style={{marginTop: 4, fontFamily: FONTS.body, fontWeight: 700, fontSize: 19, color: COLORS.textMuted}}>{HINTERGRUND.quoteBy}</div>
				</div>
			</In>
			<Note text={HINTERGRUND.zeil} top={1176} icon="users" opacity={interpolate(frame, [atHilfe + 8, atHilfe + 18], [0, 1], clamp)} />
			<Mark top={1236} />
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="tick" at={at31} volume={0.4} />
			<Sfx name="pop" at={atHilfe} volume={0.4} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 7: Kosten + unversicherte Schäden */

export const KostenScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const d2 = cue(cues, 'd2', 0);
	const atFaz = Math.max(4, wordFrame(cues, 'FAZ', d2.from + 10) - 6);
	const at400 = wordFrame(cues, '400.000', atFaz + 6) - 6;
	const d3 = cue(cues, 'd3', at400 + 40);
	const atHaend = Math.max(at400 + 10, wordFrame(cues, 'Händlern', d3.from) - 6);
	const atSach = wordFrame(cues, 'Sachschäden', atHaend + 14) - 6;
	const level = interpolate(frame, [Math.min(4, at400), at400 + 20], [0.15, 1], {...clamp, easing: EASE_OUT});
	const pull = interpolate(frame, [0, durationInFrames], [0, 1], clamp);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<XmasNight progress={pull} lit={0.5} garland={0.5} />
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.94) 0%, rgba(4,6,20,0.82) 50%, rgba(4,6,20,0.92) 100%)'}} />
			<SceneTag text="KOSTEN" color={VIOLET} icon="doc" />
			<In at={0} dy={20} style={{left: LAYOUT.left, top: 378, width: LAYOUT.width}}>
				<Card color={VIOLET} style={{padding: '10px 18px'}} glow={0.3}>
					<div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 38, color: COLORS.text}}>{HINTERGRUND.costLabel}</span>
						<Chip kind="LAUT FAZ" size={15} style={{opacity: interpolate(frame, [atFaz, atFaz + 8], [0.3, 1], clamp)}} />
					</div>
				</Card>
			</In>
			<div style={{position: 'absolute', left: 0, right: 0, top: 480, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				<CoinStack size={300} level={level} />
				<div style={{marginTop: -10, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 118, lineHeight: 1, color: YELLOW, textShadow: `0 0 50px ${withAlpha(YELLOW, 0.4)}, 0 14px 30px rgba(0,0,0,0.7)`}}>
					<CountUp value={HINTERGRUND.cost} at={Math.min(4, at400)} dur={Math.max(12, at400 + 8 - Math.min(4, at400))} /> €
				</div>
				<div style={{marginTop: 4, fontFamily: FONTS.body, fontWeight: 700, fontSize: 21, color: COLORS.textMuted}}>Freifahrten am 12. und 19.12. · {HINTERGRUND.costBy}</div>
			</div>
			<In at={atHaend} dy={30} style={{left: LAYOUT.left, top: 920, width: LAYOUT.width}}>
				<Card color={BLUE} style={{padding: '14px 18px'}} glow={0.3}>
					<div style={{display: 'flex', gap: 14, alignItems: 'center'}}>
						<div style={{width: 80, height: 80, borderRadius: 40, flexShrink: 0, background: withAlpha(BLUE, 0.18), border: `3px solid ${BLUE}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
							<P2Icon name="shield" size={46} color={BLUE} stroke={2.6} />
						</div>
						<div>
							<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 32, lineHeight: 1.12, color: COLORS.text}}>
								{HINTERGRUND.uninsured.split('Sachschäden')[0]}
								<span style={{color: YELLOW, opacity: interpolate(frame, [atSach, atSach + 6], [0.5, 1], clamp)}}>Sachschäden</span>
								{HINTERGRUND.uninsured.split('Sachschäden')[1]}
							</div>
							<div style={{marginTop: 4, fontFamily: FONTS.body, fontWeight: 700, fontSize: 19, color: COLORS.textMuted}}>{HINTERGRUND.uninsuredBy}</div>
						</div>
					</div>
				</Card>
			</In>
			<Note text={HINTERGRUND.land} top={1166} icon="info" opacity={interpolate(frame, [atSach + 6, atSach + 16], [0, 1], clamp)} />
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="softImpact" at={at400} volume={0.5} />
			<Sfx name="pop" at={atHaend} volume={0.4} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 8: Weihnachtsgeschäft (Kampagne, 6. Januar) */

export const KampagneScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const e1 = cue(cues, 'e1', 0);
	const atKamp = Math.max(2, wordFrame(cues, 'Werbekampagne', e1.from) - 6);
	const at6 = wordFrame(cues, '6', atKamp + 20) - 6;
	const dolly = interpolate(frame, [0, durationInFrames], [4, 14], clamp);
	const poster = useSpring(atKamp, 12, 170);
	const bags = [0, 1, 2, 3];
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<ZeilStreet dolly={dolly} pan={Math.sin(frame / 60) * 0.25} people={16} officers={0} vans={false} warm={0.95} blueLight={0} seed="z19b" />
			<div style={{position: 'absolute', left: -20, top: 520}}>
				<Garland width={1120} sag={60} bulbs={26} seed="kg" />
			</div>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.94) 0%, rgba(4,6,20,0.7) 26%, rgba(4,6,20,0.05) 42%, rgba(4,6,20,0.1) 62%, rgba(4,6,20,0.86) 82%, rgba(4,6,20,0.95) 100%)'}} />
			<SceneTag text="WEIHNACHTSGESCHÄFT" color={RED} icon="megaphone" />
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 378, opacity: Math.min(1, poster * 1.7), scale: String(0.9 + 0.1 * poster), transformOrigin: '50% 0%'}}>
				<div style={{padding: '14px 20px', borderRadius: 20, background: 'linear-gradient(150deg, #2A1036, #5A1430)', border: `4px solid ${YELLOW}`, boxShadow: `0 20px 50px rgba(0,0,0,0.6), 0 0 40px ${withAlpha(YELLOW, 0.25)}`}}>
					<div style={{display: 'flex', gap: 10, alignItems: 'center'}}>
						<Chip kind="OFFIZIELL" size={14} />
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 18, letterSpacing: 1.4, color: COLORS.textMuted}}>KAMPAGNE DER STADT</span>
					</div>
					<div style={{marginTop: 6, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 46, lineHeight: 1.02, color: YELLOW}}>{KAMPAGNE.name}</div>
					<div style={{marginTop: 4, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, color: COLORS.text}}>{KAMPAGNE.until}</div>
					<div style={{marginTop: 4, fontFamily: FONTS.body, fontWeight: 700, fontSize: 19, color: COLORS.textMuted}}>{KAMPAGNE.how}</div>
				</div>
			</div>
			{bags.map((i) => {
				const at = atKamp + 8 + i * 4;
				const s = interpolate(frame, [at, at + 10], [0, 1], {...clamp, easing: EASE_OUT});
				const hop = Math.abs(Math.sin((frame + i * 9) / 9)) * 10;
				return (
					<div key={i} style={{position: 'absolute', left: 120 + i * 210, top: 760 - hop, opacity: s, scale: String(0.6 + 0.4 * s)}}>
						<ShoppingBag size={120} color={[RED, CYAN, VIOLET, GREEN][i]} />
					</div>
				);
			})}
			<In at={at6} dy={30} style={{left: LAYOUT.left, top: 920, width: LAYOUT.width}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '10px 16px', borderRadius: 18, background: 'rgba(8,10,28,0.95)', border: `3px solid ${CYAN}`}}>
					<CalendarSheet to={{day: KAMPAGNE.jan.day, month: KAMPAGNE.jan.month}} at={0} width={120} accent={BLUE} />
					<div>
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, color: COLORS.text}}>{KAMPAGNE.jan.label}</div>
						<div style={{marginTop: 4, fontFamily: FONTS.body, fontWeight: 700, fontSize: 20, lineHeight: 1.25, color: COLORS.textMuted}}>{KAMPAGNE.jan.sub}</div>
					</div>
				</div>
			</In>
			<Mark top={1236} />
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="pop" at={atKamp} volume={0.45} />
			<Sfx name="paper" at={at6} volume={0.45} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 9: Zwei Ereignisse – ein Datum (aufwendigste Szene) */

const GROUP = [
	{x: 50, palette: {skin: '#E8B48A', shirt: '#46C2FF', pants: '#2A3150', hair: '#3A2A1E'}, hair: 'short' as const},
	{x: 120, palette: {skin: '#C68A5E', shirt: '#B794F6', pants: '#232A44', hair: '#1E1A16'}, hair: 'long' as const},
	{x: 190, palette: {skin: '#F1C9A5', shirt: '#FFB547', pants: '#2A3150', hair: '#6B3E26'}, hair: 'cap' as const},
	{x: 260, palette: {skin: '#8D5A3C', shirt: '#3DDC84', pants: '#232A44', hair: '#1E1A16'}, hair: 'bun' as const},
];

export const DatumScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const f0 = cue(cues, 'f0', 0);
	const atTermin = Math.max(4, wordFrame(cues, 'Termin', f0.from + 10) - 6);
	const atGenz = wordFrame(cues, 'Gen', atTermin + 6) - 6;
	const f2 = cue(cues, 'f2', atGenz + 40);
	const atG = Math.max(atGenz + 10, wordFrame(cues, 'Gratis-Nahverkehr', f2.from) - 4);
	const atW = wordFrame(cues, 'Weihnachtsshopping', atG + 10) - 4;
	const atD = wordFrame(cues, 'Demo', atW + 10) - 4;
	const cal = useSpring(0, 12, 160);
	const left = interpolate(frame, [Math.min(atTermin, 10), Math.min(atTermin, 10) + 12], [0, 1], clamp);
	const right = interpolate(frame, [atGenz, atGenz + 12], [0, 1], clamp);
	const linkL = interpolate(frame, [Math.min(atTermin, 10) + 4, Math.min(atTermin, 10) + 20], [0, 1], {...clamp, easing: EASE_OUT});
	const linkR = interpolate(frame, [atGenz + 4, atGenz + 20], [0, 1], {...clamp, easing: EASE_OUT});
	const same = useSpring(atD + 8, 12, 190);
	const pull = interpolate(frame, [0, durationInFrames], [0, 1], clamp);
	const pills = [
		{at: atG, text: 'GRATIS-NAHVERKEHR', color: GREEN},
		{at: atW, text: 'WEIHNACHTSSHOPPING', color: RED},
		{at: atD, text: 'ANGEKÜNDIGTE DEMO', color: AMBER},
	];
	const glow = 0.5 + 0.5 * Math.sin(frame / 7);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{background: 'linear-gradient(#050820 0%, #101848 45%, #2C2660 75%, #3A2C5E 100%)'}} />
			<Stars seed="dt19" n={30} height={520} />
			<div style={{position: 'absolute', left: 90 - pull * 20, top: 760, opacity: 0.45}}>
				<FrankfurtSkyline width={900} litRatio={0.5} showRiver={false} showBridge={false} />
			</div>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.9) 0%, rgba(4,6,20,0.5) 40%, rgba(4,6,20,0.55) 70%, rgba(4,6,20,0.9) 100%)'}} />
			<SceneTag text="AUSGERECHNET DER 12.12." color={YELLOW} icon="clock" />
			{/* Verbindungslinien vom Kalender zu beiden Ereignissen */}
			<svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
				<path d="M540 700 C 540 740, 300 730, 290 780" fill="none" stroke={withAlpha(GREEN, 0.9)} strokeWidth={6} strokeDasharray="14 10" pathLength={1} strokeDashoffset={0} style={{strokeDasharray: `${linkL} 1`}} />
				<path d="M540 700 C 540 740, 780 730, 790 780" fill="none" stroke={withAlpha(AMBER, 0.9)} strokeWidth={6} pathLength={1} style={{strokeDasharray: `${linkR} 1`}} />
			</svg>
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 378, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 44, color: YELLOW, opacity: Math.min(1, cal * 1.6), textShadow: '0 8px 24px rgba(0,0,0,0.8)'}}>{UEBERSCHNEIDUNG.headline}</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 448, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: Math.min(1, cal * 1.6), scale: String(0.85 + 0.15 * cal)}}>
				<div style={{filter: `drop-shadow(0 0 ${20 + 20 * glow}px ${withAlpha(YELLOW, 0.45)})`}}>
					<CalendarSheet to={{day: '12', month: 'DEZ'}} at={0} width={170} accent={RED} />
				</div>
				<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 24, letterSpacing: 2, color: YELLOW}}>SAMSTAG · 2026</div>
			</div>
			{/* links: kostenloser Nahverkehr */}
			<div style={{position: 'absolute', left: LAYOUT.left, top: 770, width: 440, opacity: left, translate: `${(1 - left) * -60}px 0`}}>
				<NewsTile width={440} kicker={UEBERSCHNEIDUNG.leftBy.toUpperCase()} title={UEBERSCHNEIDUNG.left} lines={['0,00 € im Tarifgebiet 5000']} color={GREEN} icon={<P2Icon name="route" size={22} color={GREEN} />} />
				<div style={{position: 'relative', height: 120, marginTop: 6, overflow: 'visible'}}>
					<div style={{position: 'absolute', left: -30 + ((frame * 1.4) % 40), top: 10}}>
						<TramSide width={330} line="11" />
					</div>
				</div>
			</div>
			{/* rechts: angekündigte Demo (neutrale Nachrichtengrafik) */}
			<div style={{position: 'absolute', left: 576, top: 770, width: 440, opacity: right, translate: `${(1 - right) * 60}px 0`}}>
				<NewsTile width={440} kicker="ANGEKÜNDIGT" title={UEBERSCHNEIDUNG.right} lines={[UEBERSCHNEIDUNG.rightGroup, UEBERSCHNEIDUNG.open]} color={AMBER} icon={<P2Icon name="megaphone" size={22} color={AMBER} />} />
				<svg width={330} height={120} viewBox="0 0 330 120" style={{marginTop: 6, overflow: 'visible'}}>
					{GROUP.map((p, i) => (
						<VectorPerson key={i} x={p.x} y={116} height={96} palette={p.palette} hair={p.hair} walkPhase={null} sign={null} facing={i % 2 ? -1 : 1} />
					))}
				</svg>
			</div>
			{/* gemeinsamer Samstag */}
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 1096, display: 'flex', justifyContent: 'space-between', gap: 8}}>
				{pills.map((p) => {
					const o = interpolate(frame, [p.at, p.at + 6], [0, 1], clamp);
					return (
						<div key={p.text} style={{opacity: o, translate: `0 ${(1 - o) * 14}px`, padding: '6px 10px', borderRadius: 12, background: 'rgba(8,10,28,0.95)', border: `2.5px solid ${p.color}`, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 19, color: p.color, whiteSpace: 'nowrap'}}>
							{p.text}
						</div>
					);
				})}
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 1170, display: 'flex', justifyContent: 'center', opacity: Math.min(1, same * 1.7), scale: String(1.25 - 0.25 * same)}}>
				<div style={{padding: '6px 22px', borderRadius: 14, background: YELLOW, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, color: '#14141C', whiteSpace: 'nowrap'}}>{UEBERSCHNEIDUNG.same}</div>
			</div>
			<Mark top={1236} />
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="paper" at={2} volume={0.4} />
			<Sfx name="pop" at={Math.min(atTermin, 10)} volume={0.4} />
			<Sfx name="notify" at={atGenz} volume={0.45} />
			{pills.map((p) => (
				<Sfx key={p.text} name="click" at={p.at} volume={0.4} />
			))}
			<Sfx name="softImpact" at={atD + 8} volume={0.5} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 10: Einordnung */

export const EinordnungScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const f3 = cue(cues, 'f3', 0);
	const atDir = Math.max(2, Math.min(8, wordFrame(cues, 'direkter', f3.from) - 4));
	const stamp = useSpring(atDir, 11, 200);
	const pull = interpolate(frame, [0, durationInFrames], [0, 1], clamp);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<XmasNight progress={pull} lit={0.55} />
			<div style={{position: 'absolute', left: -200 + frame * 3, top: 1010}}>
				<TramSide width={620} line="11" />
			</div>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.95) 0%, rgba(4,6,20,0.72) 40%, rgba(4,6,20,0.35) 62%, rgba(4,6,20,0.85) 100%)'}} />
			<SceneTag text="EINORDNUNG" color={BLUE} icon="info" />
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 430, display: 'flex', justifyContent: 'center', opacity: Math.min(1, stamp * 1.7), scale: String(1.35 - 0.35 * stamp)}}>
				<div style={{padding: '12px 26px', borderRadius: 18, border: `5px solid ${YELLOW}`, background: 'rgba(8,10,28,0.95)', rotate: '-3deg', textAlign: 'center'}}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 44, lineHeight: 1.08, color: YELLOW}}>{UEBERSCHNEIDUNG.noLink}</div>
				</div>
			</div>
			<In at={Math.min(10, atDir + 6)} dy={20} style={{left: LAYOUT.left, top: 640, width: LAYOUT.width}}>
				<div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
					<Note text={UEBERSCHNEIDUNG.noLinkSub} top={0} icon="doc" />
					<div style={{height: 50}} />
					<Note text={`Termine: Samstage vor dem 3. und 4. Advent · ${HINTERGRUND.partners}`} top={70} icon="clock" />
				</div>
			</In>
			<Mark top={1236} />
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="stamp" at={atDir} volume={0.5} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 11: Abo-Aufruf FrankfurtRedNews */

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
			<div style={{position: 'absolute', left: -20, top: 300, opacity: 0.8}}>
				<Garland width={1120} sag={60} bulbs={24} seed="og" />
			</div>
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
