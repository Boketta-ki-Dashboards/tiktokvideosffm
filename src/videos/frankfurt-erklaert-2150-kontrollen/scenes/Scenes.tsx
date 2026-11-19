import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {BrandLogo} from '../../../components/brand/BrandLogo';
import {TopTag} from '../../../formats/frankfurt-erklaert/Branding';
import {ACCENT, FORMAT, LAYOUT} from '../../../formats/frankfurt-erklaert/theme';
import {Dossier} from '../../../formats/frankfurt-erklaert/visuals/Politics';
import {clamp, EASE_IN_OUT, EASE_OUT, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {handleWithAt} from '../../../theme/brand';
import {COLORS, FONTS} from '../../../theme/tokens';
import {MOODS, NightCity} from '../../frankfurt-2026-11-20-ausblick/premium/NightCity';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {ZeilStreet} from '../../frankfurt-2026-11-polizeikontrollen/visuals/ZeilStreet';
import {Card, CountUp, P2Icon, type P2IconName, Stars, useSpring} from '../../frankfurt-erklaert-genz-phase2-2026-11-14/scenes/kit';
import {CONTROLS, COVER, DEBATE, ITEMS, ITEMS_NOTE, NO_SUM, OUTRO, type StatId, STATS, SUSPECTS} from '../content';
import {KONTROLLEN_COVER_LAYOUT} from '../cover-layout';
import {EvidenceTile, PeopleGrid, Silhouette} from '../visuals/Evidence';

const RED = ACCENT.brand;
const BLUE = ACCENT.info;
const GREEN = ACCENT.yes;
const YELLOW = COLORS.signal;
const VIOLET = '#B794F6';

/* ------------------------------------------------------------------ Kategorie-Chips */

type Kind = 'LAUT INNENMINISTERIUM' | 'LAUT HESSENSCHAU' | 'POSITION' | 'KRITIK' | 'ANGEKÜNDIGT' | 'ILLUSTRATION' | 'OFFIZIELL';
const KIND_COLOR: Record<Kind, string> = {
	'LAUT INNENMINISTERIUM': BLUE,
	'LAUT HESSENSCHAU': '#FFB15C',
	POSITION: VIOLET,
	KRITIK: '#FF8A65',
	ANGEKÜNDIGT: YELLOW,
	ILLUSTRATION: '#9AA6CC',
	OFFIZIELL: BLUE,
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

const IllustrationMark: React.FC<{top?: number}> = ({top = 1238}) => (
	<div style={{position: 'absolute', right: 160, top, fontFamily: FONTS.body, fontWeight: 700, fontSize: 18, letterSpacing: 1.5, color: withAlpha('#FFFFFF', 0.6)}}>ILLUSTRATION</div>
);

/* ------------------------------------------------------------------ Szene 1: Titelbild */

/**
 * Titelbild (Video-Frame 0 und PNG, nach COVER_ZONE): Zeil bei Nacht (2,5D, Blaulicht-Akzent), Serientitel, große gelbe „2.150+“, rote Karte
 * „POLIZEIKONTROLLEN AUF DER ZEIL“, Frage, Zeitraum + Urheber, Logo + Account; im PNG zusätzlich „BILANZ VOM 18.11.2026“.
 * `morph` (0–1) blendet die Texte aus und fährt in die Zeil hinein (nächste Szene beginnt dort).
 */
export const KontrollenCover: React.FC<{morph?: number; thumbnail?: boolean; meta?: number}> = ({morph = 0, thumbnail = false, meta = 1}) => {
	const frame = useCurrentFrame();
	const L = KONTROLLEN_COVER_LAYOUT;
	const m = EASE_IN_OUT(Math.min(1, Math.max(0, morph)));
	const text = 1 - Math.min(1, m * 1.6);
	const bob = Math.sin(frame / 26) * 3;
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<ZeilStreet dolly={m * 3} people={14} officers={4} vans warm={0.55} blueLight={0.35} seed="z13" />
			<AbsoluteFill style={{background: `linear-gradient(rgba(4,6,20,${0.62 * text + 0.2}) 0%, rgba(4,6,20,${0.4 * text + 0.1}) 18%, rgba(4,6,20,${0.66 * text}) 30%, rgba(4,6,20,${0.82 * text}) 44%, rgba(4,6,20,${0.84 * text}) 56%, rgba(4,6,20,${0.55 * text}) 68%, rgba(4,6,20,${0.7 * text + 0.1}) 100%)`}} />
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
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: L.bigSize, lineHeight: 0.92, letterSpacing: -8, color: YELLOW, whiteSpace: 'nowrap', textShadow: `0 0 70px ${withAlpha(YELLOW, 0.45)}, 0 0 40px ${withAlpha(BLUE, 0.25 + 0.15 * Math.sin(frame / 5))}, 0 22px 55px rgba(0,0,0,0.85)`}}>{COVER.big}</span>
				</div>
				<div style={{position: 'absolute', left: L.sideMin - 20, right: L.sideMin - 20, top: L.cardTop, display: 'flex', justifyContent: 'center'}}>
					<div style={{padding: '9px 24px 11px', borderRadius: 18, background: 'linear-gradient(160deg, #FF6A78 0%, #FF4D5E 50%, #D93448 100%)', boxShadow: '0 5px 0 #B32A3C, 0 10px 0 #8E1F2E, 0 34px 60px rgba(0,0,0,0.6)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: L.cardFont, lineHeight: 1.05, color: '#FFFFFF', whiteSpace: 'nowrap'}}>{COVER.card}</div>
				</div>
				<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.questionTop, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 36, color: COLORS.text, whiteSpace: 'nowrap', textShadow: '0 4px 16px rgba(0,0,0,0.95)'}}>{COVER.question}</div>
				<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.smallTop, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 800, fontSize: 23, letterSpacing: 1.5, color: withAlpha(COLORS.text, 0.85), whiteSpace: 'nowrap', textShadow: '0 4px 14px rgba(0,0,0,0.95)'}}>{COVER.small}</div>
				<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.metaTop, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, opacity: meta}}>
					<BrandLogo size={52} />
					<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 30, color: COLORS.textMuted}}>{handleWithAt()}</span>
				</div>
				{thumbnail ? (
					<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.thumbTop, display: 'flex', justifyContent: 'center'}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 22px', borderRadius: 16, background: 'rgba(8,10,28,0.92)', border: `2.5px solid ${YELLOW}`}}>
							<P2Icon name="doc" size={30} color={YELLOW} />
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, color: COLORS.text, whiteSpace: 'nowrap'}}>{COVER.thumb}</span>
						</div>
					</div>
				) : null}
			</div>
		</AbsoluteFill>
	);
};

/** Szene 1 – Titelbild im Video (ab Frame 0 vollständig, unter „Ewa, Frankfurt!“); am Ende Fahrt in die Zeil. */
export const CoverScene: React.FC<SceneProps> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const morph = interpolate(frame, [durationInFrames - 14, durationInFrames - 1], [0, 1], clamp);
	return (
		<AbsoluteFill>
			<KontrollenCover morph={morph} />
			<Sfx name="softImpact" at={0} volume={0.5} />
			<Sfx name="whoosh" at={Math.max(0, durationInFrames - 14)} volume={0.45} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 2: Zeil + 2.150 + „KONTROLLIERT ≠ SCHULDIG“ */

export const ZeilScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const z1 = cue(cues, 'z1', 0);
	const z2 = cue(cues, 'z2', 120);
	const at2150 = wordFrame(cues, '2.150', z1.from + 70);
	const atStamp = Math.max(at2150 + 20, wordFrame(cues, 'Kontrolliert', z2.from + 20) - 2);
	const atQuote = Math.max(atStamp + 18, wordFrame(cues, 'verdächtig', z2.from + 50) - 2);
	const dolly = 3 + interpolate(frame, [0, durationInFrames], [0, 7], {easing: EASE_IN_OUT});
	const count = interpolate(frame, [2, at2150 + 2], [0, 1], {...clamp, easing: EASE_OUT});
	const stamp = interpolate(frame, [atStamp, atStamp + 7], [0, 1], {...clamp, easing: EASE_OUT});
	const dim = interpolate(frame, [atStamp - 4, atStamp + 6], [0, 0.35], clamp);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<ZeilStreet dolly={dolly} people={16} officers={5} vans warm={0.55} blueLight={0.3 + 0.1 * Math.sin(frame / 6)} seed="z13" />
			<AbsoluteFill style={{background: `linear-gradient(rgba(4,6,20,0.92) 0%, rgba(4,6,20,0.78) 22%, rgba(4,6,20,${0.12 + dim}) 40%, rgba(4,6,20,${0.12 + dim}) 62%, rgba(4,6,20,0.78) 74%, rgba(4,6,20,0.92) 100%)`}} />
			<SceneTag text="ZEIL · SEIT 1. NOVEMBER" color={BLUE} icon="shield" />
			{/* Zähler */}
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 372, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
				<div style={{display: 'flex', alignItems: 'baseline'}}>
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 168, lineHeight: 1, letterSpacing: -6, color: YELLOW, fontVariantNumeric: 'tabular-nums', textShadow: `0 0 60px ${withAlpha(YELLOW, 0.4)}, 0 0 30px ${withAlpha(RED, 0.25 + 0.2 * Math.sin(frame / 4))}`}}>{Math.round(CONTROLS.value * count).toLocaleString('de-DE')}</span>
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 120, color: YELLOW, opacity: count > 0.98 ? 1 : 0}}>{CONTROLS.plus}</span>
				</div>
				<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, letterSpacing: 2, color: COLORS.text}}>{CONTROLS.label}</span>
				<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
					<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 26, color: BLUE}}>{CONTROLS.since}</span>
					<Chip kind="LAUT INNENMINISTERIUM" size={18} />
				</div>
				<div style={{marginTop: 8, opacity: 0.95}}>
					<PeopleGrid cols={18} rows={3} cell={36} fill={count} color={withAlpha(YELLOW, 0.9)} />
				</div>
			</div>
			{/* KONTROLLIERT ≠ SCHULDIG */}
			{frame >= atStamp ? (
				<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 860, display: 'flex', justifyContent: 'center'}}>
					<div style={{padding: '14px 28px', borderRadius: 18, border: `6px solid ${GREEN}`, background: 'rgba(8,10,28,0.94)', rotate: '-4deg', scale: String(1.5 - 0.5 * stamp), opacity: stamp, boxShadow: '0 30px 70px rgba(0,0,0,0.7)', textAlign: 'center'}}>
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 60, letterSpacing: 1, color: GREEN, whiteSpace: 'nowrap'}}>{CONTROLS.stamp}</div>
						<div style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 25, color: COLORS.text, whiteSpace: 'nowrap'}}>{CONTROLS.stampSub}</div>
					</div>
				</div>
			) : null}
			<In at={atQuote} style={{left: LAYOUT.left, width: LAYOUT.width, top: 1060}} dy={20}>
				<Card color={VIOLET} style={{padding: '14px 22px'}} glow={0.15}>
					<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 27, lineHeight: 1.3, color: COLORS.text}}>{CONTROLS.quote}</div>
					<div style={{marginTop: 6, fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, color: COLORS.textMuted}}>{CONTROLS.quoteBy}</div>
				</Card>
			</In>
			<IllustrationMark top={1000} />
			<Sfx name="riser" at={2} volume={0.25} />
			<Sfx name="softImpact" at={at2150} volume={0.5} />
			<Sfx name="stamp" at={atStamp + 4} volume={0.6} />
			<Sfx name="pop" at={atQuote} volume={0.4} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 3: 78 · 435 · 182 */

const STAT_STYLE: Record<StatId, {color: string; icon: P2IconName}> = {
	anzeigen: {color: RED, icon: 'doc'},
	owi: {color: YELLOW, icon: 'alert'},
	platzverweise: {color: BLUE, icon: 'pin'},
};

const StatCard: React.FC<{i: number; at: number; atNum: number; atNot: number}> = ({i, at, atNum, atNot}) => {
	const frame = useCurrentFrame();
	const st = STATS[i];
	const sty = STAT_STYLE[st.id];
	const s = useSpring(at, 14, 170);
	const not = interpolate(frame, [atNot, atNot + 8], [0, 1], {...clamp, easing: EASE_OUT});
	const pulse = interpolate(frame, [atNum, atNum + 6, atNum + 20], [0, 1, 0], clamp);
	if (frame < at - 1) return null;
	return (
		<div style={{position: 'absolute', left: LAYOUT.left, top: 430 + i * 262, width: LAYOUT.width, opacity: Math.min(1, s * 1.7), translate: `${(1 - s) * (i % 2 ? 90 : -90)}px 0`, scale: String(1 + 0.03 * pulse)}}>
			<Card color={sty.color} style={{height: 236, display: 'flex', alignItems: 'center', gap: 24, padding: '0 26px', position: 'relative'}} glow={0.15 + 0.25 * pulse}>
				<div style={{width: 120, height: 120, borderRadius: 60, background: `radial-gradient(circle at 35% 30%, ${withAlpha(sty.color, 0.4)}, ${withAlpha(sty.color, 0.1)})`, border: `2px solid ${withAlpha(sty.color, 0.7)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, rotate: `${(1 - s) * -40}deg`}}>
					<P2Icon name={sty.icon} size={66} color={sty.color} stroke={2.4} />
				</div>
				<div style={{display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0}}>
					{/* Zähler vom Erscheinen bis zum gesprochenen Wert */}
					<CountUp value={st.value} at={at} dur={Math.max(12, atNum - at + 2)} style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 96, lineHeight: 1, color: sty.color === YELLOW ? YELLOW : COLORS.text, textShadow: `0 0 30px ${withAlpha(sty.color, 0.4)}`}} />
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, color: COLORS.text, whiteSpace: 'nowrap'}}>{st.title}</span>
					<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 25, color: COLORS.textMuted}}>{st.meaning}</span>
				</div>
				<div style={{position: 'absolute', right: 22, top: 22, padding: '6px 12px', borderRadius: 12, background: withAlpha(GREEN, 0.16), border: `2.5px solid ${GREEN}`, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 24, color: GREEN, opacity: not, scale: String(1.3 - 0.3 * not), rotate: '-4deg', whiteSpace: 'nowrap'}}>{st.not}</div>
			</Card>
		</div>
	);
};

export const StatsScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const b1 = cue(cues, 'b1', 0);
	const b2 = cue(cues, 'b2', 70);
	const b3 = cue(cues, 'b3', 230);
	const atNums = [wordFrame(cues, '78', b2.from + 2), wordFrame(cues, '435', b2.from + 50), wordFrame(cues, '182', b2.from + 130)];
	const ats = [Math.max(0, b1.from), Math.max(atNums[0] + 14, atNums[1] - 12), Math.max(atNums[1] + 14, atNums[2] - 12)];
	const atNot = wordFrame(cues, 'Verurteilung', b3.from + 30) - 4;
	const atSum = wordFrame(cues, 'addieren', b3.from + 60) - 4;
	const sum = interpolate(frame, [atSum, atSum + 10], [0, 1], {...clamp, easing: EASE_OUT});
	const drift = interpolate(frame, [0, durationInFrames], [0, 1]);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{opacity: 0.35, scale: String(1.1 - drift * 0.05)}}>
				<ZeilStreet dolly={14 + drift * 6} people={10} officers={3} vans={false} warm={0.4} blueLight={0.2} seed="z13b" />
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.9) 0%, rgba(4,6,20,0.8) 50%, rgba(4,6,20,0.9) 100%)'}} />
			<SceneTag text="BILANZ SEIT 1. NOVEMBER" color={RED} icon="doc" />
			<div style={{position: 'absolute', left: LAYOUT.left, top: 368, display: 'flex', alignItems: 'center', gap: 12}}>
				<Chip kind="LAUT INNENMINISTERIUM" size={20} />
				<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, color: COLORS.textMuted}}>Stand 18.11.2026</span>
			</div>
			{STATS.map((_, i) => (
				<StatCard key={i} i={i} at={ats[i]} atNum={atNums[i]} atNot={atNot + i * 4} />
			))}
			{/* Nicht addieren */}
			{frame >= atSum ? (
				<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 1206, display: 'flex', justifyContent: 'center', opacity: sum, translate: `0 ${(1 - sum) * 20}px`}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '8px 18px', borderRadius: 14, background: 'rgba(8,10,28,0.95)', border: `2.5px solid ${RED}`}}>
						<span style={{position: 'relative', width: 34, height: 34, borderRadius: 17, background: withAlpha(RED, 0.2), display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: RED}}>
							+
							<span style={{position: 'absolute', left: 3, right: 3, top: 16, height: 3, background: RED, rotate: '-45deg'}} />
						</span>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, color: COLORS.text, whiteSpace: 'nowrap'}}>{NO_SUM.title}</span>
						<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, color: COLORS.textMuted, whiteSpace: 'nowrap'}}>{NO_SUM.sub}</span>
					</div>
				</div>
			) : null}
			{atNums.map((a, i) => (
				<Sfx key={i} name="softImpact" at={a} volume={0.4} />
			))}
			{ats.map((a, i) => (
				<Sfx key={`w${i}`} name="whoosh" at={a} volume={0.25} />
			))}
			<Sfx name="stamp" at={atNot + 4} volume={0.5} />
			<Sfx name="click" at={atSum} volume={0.5} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 4: Sicherstellungen */

export const ItemsScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const g1 = cue(cues, 'g1', 0);
	const wordAt = (w: string | undefined, fb: number) => (w ? wordFrame(cues, w, fb) - 2 : fb);
	const named = ITEMS.filter((it) => it.word);
	const rest = ITEMS.filter((it) => !it.word);
	const lastNamed = Math.max(...named.map((it, i) => wordAt(it.word, g1.from + 30 + i * 18)));
	const ats = ITEMS.map((it, i) => (it.word ? wordAt(it.word, g1.from + 30 + i * 18) : lastNamed + 10 + rest.indexOf(it) * 5));
	const tileW = 250;
	const gap = 58;
	const drift = interpolate(frame, [0, durationInFrames], [0, 1]);
	return (
		<AbsoluteFill style={{backgroundColor: '#070A1F', overflow: 'hidden'}}>
			<AbsoluteFill style={{background: `radial-gradient(ellipse 90% 60% at ${45 + drift * 10}% 45%, #1A2150 0%, #0B0F2C 60%, #05071A 100%)`}} />
			{/* Raster-Tischfläche */}
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: 0.18}}>
				{new Array(30).fill(0).map((_, i) => (
					<line key={`h${i}`} x1={0} x2={1080} y1={i * 64 + ((frame * 0.4) % 64)} y2={i * 64 + ((frame * 0.4) % 64)} stroke="#4F6BD8" strokeWidth={1} />
				))}
				{new Array(18).fill(0).map((_, i) => (
					<line key={`v${i}`} y1={0} y2={1920} x1={i * 64} x2={i * 64} stroke="#4F6BD8" strokeWidth={1} />
				))}
			</svg>
			<SceneTag text="SICHERGESTELLT" color={YELLOW} icon="shield" />
			<div style={{position: 'absolute', left: LAYOUT.left, top: 368, display: 'flex', alignItems: 'center', gap: 12}}>
				<Chip kind="LAUT INNENMINISTERIUM" size={20} />
				<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, color: COLORS.textMuted}}>Kontrollen seit 1.11. · Auswahl</span>
			</div>
			{ITEMS.map((it, i) => {
				const col = i % 3;
				const row = Math.floor(i / 3);
				const rowCount = row < 2 ? 3 : ITEMS.length - 6;
				const rowW = rowCount * tileW + (rowCount - 1) * gap;
				const x = (1080 - 150 + 64 - rowW) / 2 + col * (tileW + gap) - 32;
				const y = 432 + row * (tileW * 1.18 + 26);
				const hl = it.word ? interpolate(frame, [ats[i], ats[i] + 6, ats[i] + 24], [0, 1, 0.25], clamp) : 0;
				return (
					<div key={it.id} style={{position: 'absolute', left: x, top: y}}>
						<EvidenceTile id={it.id} name={it.name} qty={it.qty} at={i === 0 ? Math.min(ats[i], 6) : ats[i]} width={tileW} color={it.qty === '1' || it.qty === '3' ? RED : '#1D3A8A'} highlight={hl} />
					</div>
				);
			})}
			<In at={lastNamed + 20} style={{left: LAYOUT.left, width: LAYOUT.width, top: 1230}} dy={14}>
				<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
					<P2Icon name="info" size={24} color={COLORS.textMuted} />
					<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, color: COLORS.textMuted}}>{ITEMS_NOTE}</span>
				</div>
			</In>
			<IllustrationMark top={398} />
			{ats.map((a, i) => (
				<Sfx key={i} name={i < named.length ? 'pop' : 'click'} at={a} volume={i < named.length ? 0.45 : 0.3} />
			))}
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 5: Ermittlungsakte – 2 identifiziert, 99 insgesamt */

export const SuspectsScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const h1 = cue(cues, 'h1', 0);
	const h2 = cue(cues, 'h2', 110);
	const atTwo = wordFrame(cues, 'zwei', h1.from + 50) - 4;
	const atTotal = Math.max(atTwo + 30, h2.from - 2);
	const at99 = wordFrame(cues, '99', h2.from + 40);
	const two = springIn({frame, fps, delay: atTwo, damping: 13, stiffness: 170});
	const shrink = interpolate(frame, [atTotal, atTotal + 14], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const drift = interpolate(frame, [0, durationInFrames], [0, 1]);
	return (
		<AbsoluteFill style={{backgroundColor: '#070A1F', overflow: 'hidden'}}>
			<AbsoluteFill style={{background: `radial-gradient(ellipse 100% 60% at 50% ${40 + drift * 8}%, #241B52 0%, #0D0B2E 60%, #05071A 100%)`}} />
			<Stars seed="z13s" n={30} height={1920} />
			<SceneTag text="ERMITTLUNGEN 31.10." color="#FFB15C" icon="doc" />
			<div style={{position: 'absolute', left: LAYOUT.left, top: 368, display: 'flex', alignItems: 'center', gap: 12}}>
				<Chip kind="LAUT HESSENSCHAU" size={20} />
				<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, color: COLORS.textMuted}}>Angaben der Polizei, 18.11.</span>
			</div>
			{/* Akte im Hintergrund */}
			<div style={{position: 'absolute', left: 540 - 280, top: 440, opacity: 0.9 - shrink * 0.5, scale: String(1 - shrink * 0.12)}}>
				<Dossier label="ZEIL-KONTROLLEN" at={0} width={560} color="#FFB15C" scanFrom={4} badge="ILLUSTRATION" />
			</div>
			{/* Karte: 2 identifiziert */}
			{frame >= atTwo - 1 ? (
				<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 600 - shrink * 120, opacity: Math.min(1, two * 1.7), scale: String((0.8 + 0.2 * two) * (1 - shrink * 0.12)), transformOrigin: '50% 0%'}}>
					<Card color="#FFB15C" style={{padding: '22px 26px', display: 'flex', alignItems: 'center', gap: 22}} glow={0.3}>
						<div style={{display: 'flex', gap: 6}}>
							<Silhouette size={96} color="#4A3C7A" />
							<Silhouette size={96} color="#4A3C7A" />
						</div>
						<div style={{display: 'flex', flexDirection: 'column'}}>
							<div style={{display: 'flex', alignItems: 'baseline', gap: 14}}>
								<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 120, lineHeight: 0.95, color: YELLOW}}>{SUSPECTS.two.value}</span>
								<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 32, lineHeight: 1.1, color: COLORS.text, maxWidth: 380}}>{SUSPECTS.two.title}</span>
							</div>
							<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, color: COLORS.text}}>{SUSPECTS.two.sub}</span>
							<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, color: COLORS.textMuted}}>{SUSPECTS.two.by}</span>
						</div>
					</Card>
				</div>
			) : null}
			{/* Karte: 99 insgesamt */}
			<In at={atTotal} style={{left: LAYOUT.left, width: LAYOUT.width, top: 880}} dy={40}>
				<Card color={BLUE} style={{padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 20}} glow={0.2}>
					<CountUp value={SUSPECTS.total.value} at={atTotal} dur={Math.max(12, at99 - atTotal + 2)} style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 96, lineHeight: 1, color: BLUE, minWidth: 130}} />
					<div style={{display: 'flex', flexDirection: 'column', gap: 2}}>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, lineHeight: 1.1, color: COLORS.text}}>{SUSPECTS.total.title}</span>
						<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, color: COLORS.textMuted}}>{SUSPECTS.total.by}</span>
					</div>
				</Card>
			</In>
			<In at={atTotal + 18} style={{left: LAYOUT.left, width: LAYOUT.width, top: 1090}} dy={16}>
				<div style={{display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap'}}>
					<span style={{padding: '8px 16px', borderRadius: 14, background: 'rgba(8,10,28,0.92)', border: `2px solid ${GREEN}`, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, color: GREEN}}>{SUSPECTS.note}</span>
					<span style={{padding: '8px 16px', borderRadius: 14, background: 'rgba(8,10,28,0.92)', border: `2px solid ${withAlpha('#FFFFFF', 0.35)}`, fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, color: COLORS.text}}>{SUSPECTS.notAll}</span>
				</div>
			</In>
			<Sfx name="paper" at={2} volume={0.4} />
			<Sfx name="softImpact" at={atTwo + 2} volume={0.5} />
			<Sfx name="whoosh" at={atTotal} volume={0.3} />
			<Sfx name="click" at={at99} volume={0.4} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 6: Bewertung vs. Kritik + Ausblick */

export const DebateScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p1 = cue(cues, 'p1', 0);
	const p2 = cue(cues, 'p2', 70);
	const w1 = cue(cues, 'w1', 200);
	const atLeft = Math.max(0, p1.from - 2);
	const atRight = Math.max(atLeft + 20, p2.from - 2);
	const atReply = wordFrame(cues, 'widerspricht', p2.from + 80) - 6;
	const atNext = Math.max(atReply + 12, w1.from - 2);
	// Kamera schwenkt langsam von links nach rechts
	const pan = interpolate(frame, [atLeft, atRight + 10, atReply + 20, durationInFrames], [-30, 30, 0, -10], {...clamp, easing: EASE_IN_OUT});
	const left = springIn({frame, fps, delay: atLeft, damping: 14, stiffness: 170});
	const right = springIn({frame, fps, delay: atRight, damping: 14, stiffness: 170});
	const focus = interpolate(frame, [atRight, atRight + 10], [0, 1], clamp);
	const next = springIn({frame, fps, delay: atNext, damping: 13, stiffness: 160});
	const colW = 415;
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{opacity: 0.4}}>
				<NightCity mood={MOODS.calm} progress={0.5 + frame / 2400} litRatio={0.35} bokeh={10} showPromenade={false} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.92) 0%, rgba(4,6,20,0.8) 50%, rgba(4,6,20,0.92) 100%)'}} />
			<SceneTag text="DIE DEBATTE" color={VIOLET} icon="chat" />
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 380, height: 620, translate: `${pan}px 0`}}>
				{/* links: Innenminister */}
				<div style={{position: 'absolute', left: 0, top: 0, width: colW, opacity: Math.min(1, left * 1.7) * (1 - 0.35 * focus), translate: `${(1 - left) * -60}px 0`}}>
					<Card color={BLUE} style={{padding: '20px 20px', height: 560, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 10}} glow={0.2}>
						<Chip kind="POSITION" size={18} style={{alignSelf: 'flex-start'}} />
						<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 22, letterSpacing: 1.5, color: BLUE}}>{DEBATE.left.kicker}</span>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 38, lineHeight: 1.05, color: COLORS.text}}>{DEBATE.left.title}</span>
						<P2Icon name="shield" size={70} color={BLUE} />
						<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 25, lineHeight: 1.3, color: COLORS.text}}>{DEBATE.left.quote}</span>
						<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, color: COLORS.textMuted}}>{DEBATE.left.by}</span>
					</Card>
				</div>
				{/* rechts: Kritik */}
				{frame >= atRight - 1 ? (
					<div style={{position: 'absolute', right: 0, top: 0, width: colW, opacity: Math.min(1, right * 1.7), translate: `${(1 - right) * 60}px 0`}}>
						<Card color="#FF8A65" style={{padding: '20px 20px', height: 560, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 10}} glow={0.2}>
							<Chip kind="KRITIK" size={18} style={{alignSelf: 'flex-start'}} />
							<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 22, letterSpacing: 1.2, color: '#FF8A65'}}>{DEBATE.right.kicker}</span>
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 38, lineHeight: 1.05, color: COLORS.text}}>{DEBATE.right.title}</span>
							<P2Icon name="users" size={70} color="#FF8A65" />
							<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 25, lineHeight: 1.3, color: COLORS.text}}>{DEBATE.right.sub}</span>
						</Card>
					</div>
				) : null}
				{/* Trennlinie */}
				<div style={{position: 'absolute', left: LAYOUT.width / 2 - 1.5, top: 30, width: 3, height: 500, background: `linear-gradient(${withAlpha('#FFFFFF', 0)}, ${withAlpha('#FFFFFF', 0.35)}, ${withAlpha('#FFFFFF', 0)})`, opacity: right}} />
			</div>
			{/* Antwort */}
			<In at={atReply} style={{left: LAYOUT.left, width: LAYOUT.width, top: 980}} dy={20} out={1 - interpolate(frame, [atNext, atNext + 8], [0, 1], clamp) * 0.35}>
				<div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '12px 18px', borderRadius: 16, background: 'rgba(8,10,28,0.95)', border: `2.5px solid ${BLUE}`}}>
					<span style={{padding: '4px 10px', borderRadius: 10, background: withAlpha(BLUE, 0.2), fontFamily: FONTS.heading, fontWeight: 900, fontSize: 22, color: BLUE, whiteSpace: 'nowrap'}}>{DEBATE.reply.title}</span>
					<div style={{display: 'flex', flexDirection: 'column'}}>
						<span style={{fontFamily: FONTS.body, fontWeight: 800, fontSize: 27, color: COLORS.text}}>{DEBATE.reply.quote}</span>
						<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, color: COLORS.textMuted}}>{DEBATE.reply.by}</span>
					</div>
				</div>
			</In>
			{/* Ausblick */}
			{frame >= atNext - 1 ? (
				<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 1112, display: 'flex', justifyContent: 'center', opacity: Math.min(1, next * 1.7), scale: String(0.85 + 0.15 * next)}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '12px 22px', borderRadius: 18, background: RED, boxShadow: '0 20px 50px rgba(255,59,78,0.35)'}}>
						<P2Icon name="clock" size={36} color="#FFFFFF" />
						<div style={{display: 'flex', flexDirection: 'column'}}>
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, color: '#FFFFFF', whiteSpace: 'nowrap'}}>{DEBATE.next}</span>
							<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: withAlpha('#FFFFFF', 0.85)}}>{DEBATE.nextSub}</span>
						</div>
						<Chip kind="ANGEKÜNDIGT" size={18} style={{background: 'rgba(8,10,28,0.6)'}} />
					</div>
				</div>
			) : null}
			<Sfx name="whoosh" at={atLeft} volume={0.3} />
			<Sfx name="whoosh" at={atRight} volume={0.3} />
			<Sfx name="click" at={atReply} volume={0.45} />
			<Sfx name="pop" at={atNext} volume={0.5} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 7: Frage + Abo-Aufruf mit offiziellem Logo */

export const OutroScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const q = cue(cues, 'q1', 0);
	const c = cue(cues, 'cta', 60);
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
			{/* Frage */}
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 400, display: 'flex', justifyContent: 'center', opacity: Math.min(1, qs * 1.7), translate: `0 ${(1 - qs) * 30}px`, scale: String((0.9 + 0.1 * qs) * (1 - 0.06 * cta))}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 24px', borderRadius: 22, background: 'rgba(8,10,28,0.95)', border: `3px solid ${YELLOW}`, boxShadow: `0 20px 50px rgba(0,0,0,0.6), 0 0 30px ${withAlpha(YELLOW, 0.25)}`}}>
					<P2Icon name="chat" size={40} color={YELLOW} />
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, lineHeight: 1.1, color: COLORS.text, maxWidth: 680}}>{OUTRO.question}</span>
				</div>
			</div>
			{/* Logo + Abo */}
			<div style={{position: 'absolute', left: 64, width: 866, top: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, opacity: Math.min(1, cta * 2), translate: `0 ${(1 - cta) * 50}px`}}>
				<div style={{position: 'relative'}}>
					<BrandLogo size={230} ring={6 + Math.sin(frame / 4) * 3} />
					<div style={{position: 'absolute', left: '50%', bottom: -26, translate: '-50% 0', scale: String(press), width: 68, height: 68, borderRadius: 34, background: followed ? GREEN : RED, border: '4px solid #FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 24px rgba(0,0,0,0.5)'}}>
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
