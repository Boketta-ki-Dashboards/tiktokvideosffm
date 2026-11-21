import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {BrandLogo} from '../../../components/brand/BrandLogo';
import {type CityMapData} from '../../../components/map/CityStreetMap';
import {CityPlane, cityPlaneXY} from '../../../components/map/CityPlane';
import {interpolateCamera, type PlaneBillboard, type PlaneCamera} from '../../../components/map/TiltedPlane';
import nordwest from '../../../data/maps/frankfurt-innenstadt-nordwest.json';
import {clamp, EASE_IN_OUT, EASE_OUT, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {handleWithAt} from '../../../theme/brand';
import {COLORS, FONTS} from '../../../theme/tokens';
import {SourceBar} from '../../../formats/frankfurt-erklaert/components';
import {ACCENT, FORMAT} from '../../../formats/frankfurt-erklaert/theme';
import {blendMood, MOODS, NightCity} from '../../frankfurt-2026-11-20-ausblick/premium/NightCity';
import {Person} from '../../frankfurt-2026-11-20-ausblick/premium/Person';
import {PoliceVan} from '../../frankfurt-2026-11-20-ausblick/premium/PoliceVan';
import {ZeilStreet} from '../../frankfurt-2026-11-polizeikontrollen/visuals/ZeilStreet';
import {CalendarBlock, Card, CountUp, IconOrb, MapShade, P2Icon, type P2IconName, Stars, Tag, useSpring} from '../../frankfurt-erklaert-genz-phase2-2026-11-14/scenes/kit';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {CONFUSION, CONTRAST, COVER, CTA, NEXT, PLACES, POLICE} from '../content';
import {DEMO13_COVER_LAYOUT} from '../cover-layout';

const GENZ = ACCENT.brand;
const BLUE = ACCENT.info;
const MAP = nordwest as unknown as CityMapData;
const MAP_K = 0.5;

/* ------------------------------------------------------------------ Kategorie-Chips */

type Kind = 'BERICHT' | 'OFFIZIELL' | 'AUSSAGE' | 'MÖGLICHE ERKLÄRUNG – NICHT BEWIESEN' | 'ANGEKÜNDIGT' | 'ILLUSTRATION' | 'LAUT FNP';
const KIND_COLOR: Record<Kind, string> = {
	BERICHT: '#FFB15C',
	'LAUT FNP': '#FFB15C',
	OFFIZIELL: BLUE,
	AUSSAGE: ACCENT.law,
	'MÖGLICHE ERKLÄRUNG – NICHT BEWIESEN': COLORS.signal,
	ANGEKÜNDIGT: COLORS.signal,
	ILLUSTRATION: '#9AA6CC',
};
const Chip: React.FC<{kind: Kind; size?: number}> = ({kind, size = 18}) => {
	const c = KIND_COLOR[kind];
	return <span style={{display: 'inline-block', padding: `${size * 0.2}px ${size * 0.5}px`, borderRadius: size * 0.4, background: withAlpha(c, 0.18), border: `2px solid ${c}`, fontFamily: FONTS.heading, fontWeight: 900, fontSize: size, letterSpacing: 1.2, color: c, whiteSpace: 'nowrap'}}>{kind}</span>;
};

/** Kleine, anonyme Menschengruppe (Rückenansicht, keine Gesichter) – Illustration. */
const MiniCrowd: React.FC<{n: number; h?: number; spread?: number; seed: string; on?: number; light?: string}> = ({n, h = 46, spread = 22, seed, on = 1, light}) => {
	const frame = useCurrentFrame();
	const cols = Math.min(n, 5);
	const rows = Math.ceil(n / cols);
	const w = cols * spread + 30;
	const hh = h + rows * 10 + 10;
	return (
		<svg width={w} height={hh} viewBox={`0 0 ${w} ${hh}`} style={{overflow: 'visible', opacity: on}}>
			{new Array(n).fill(0).map((_, i) => {
				const r = Math.floor(i / cols);
				const c = i % cols;
				const x = 15 + c * spread + (r % 2) * spread * 0.5 + (random(`${seed}-x-${i}`) - 0.5) * 6;
				const y = h + 4 + r * 10;
				const pop = interpolate(on, [i / n, Math.min(1, i / n + 0.3)], [0, 1], clamp);
				return (
					<g key={i} opacity={pop} transform={`translate(0 ${(1 - pop) * 10})`}>
						<Person x={x} y={y} h={h * (0.92 + random(`${seed}-h-${i}`) * 0.16)} seed={`${seed}-${i}`} step={frame / 10 + i} light={light} lightAmount={light ? 0.2 : 0} />
					</g>
				);
			})}
		</svg>
	);
};

/* ------------------------------------------------------------------ Szene 1: Titelbild */

/** Reihe stilisierter Mannschaftswagen (eigene Vektorzeichnung, keine Kennzeichen/Wappen). */
const VanRow: React.FC<{n: number; lit: number}> = ({n, lit}) => (
	<div style={{position: 'relative', width: 1080, height: 160}}>
		{new Array(n).fill(0).map((_, i) => {
			const back = i % 2 === 0;
			const k = Math.floor(i / 2);
			const x = 30 + k * 132 + (back ? 40 : 0);
			const w = back ? 108 : 132;
			const on = interpolate(lit, [i / n, i / n + 0.08], [0.35, 1], clamp);
			return (
				<div key={i} style={{position: 'absolute', left: x, top: back ? 18 : 64, opacity: on, filter: back ? 'brightness(0.62)' : 'brightness(0.85)'}}>
					<PoliceVan width={w} phase={i * 3} lights={on > 0.6} />
				</div>
			);
		})}
	</div>
);

/**
 * Titelbild (Video-Frame 0 und PNG): Skyline, Serientitel, Reihe von 16 Mannschaftswagen (Bereitschaft, Illustration) hinter der großen
 * gelben „13“, rote Karte „NUR 13 DEMONSTRANTEN?!“, „16 MANNSCHAFTSWAGEN IN BEREITSCHAFT“, „GEN Z REGELT · FRANKFURT · 14.11.“, Logo + Account.
 */
export const Demo13Cover: React.FC<{morph?: number; lit?: number; thumbnail?: boolean}> = ({morph = 0, lit = 1, thumbnail = false}) => {
	const frame = useCurrentFrame();
	const L = DEMO13_COVER_LAYOUT;
	const m = EASE_IN_OUT(Math.min(1, Math.max(0, morph)));
	const text = 1 - Math.min(1, m * 1.5);
	const bob = Math.sin(frame / 24) * 3;
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{scale: String(1 + m * 0.12), transformOrigin: '50% 40%'}}>
				<NightCity mood={blendMood(MOODS.dusk, MOODS.alert, 0.18)} progress={0.45 + frame / 2200} litRatio={0.42} bokeh={10} showPromenade={false} showMoon />
			</AbsoluteFill>
			<Stars seed="d13c" n={36} height={380} />
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.55) 0%, rgba(4,6,20,0.15) 16%, rgba(4,6,20,0.2) 26%, rgba(4,6,20,0.65) 36%, rgba(4,6,20,0.9) 52%, rgba(4,6,20,0.92) 70%, rgba(4,6,20,0.8) 100%)'}} />
			{/* Straße mit Blaulicht-Schimmer */}
			<div style={{position: 'absolute', left: 0, right: 0, top: L.vansTop - 40, height: 260, background: `radial-gradient(ellipse 60% 50% at 50% 60%, ${withAlpha(BLUE, 0.22 + 0.06 * Math.sin(frame / 3))}, rgba(0,0,0,0) 70%)`}} />
			<div style={{position: 'absolute', left: 0, top: L.vansTop, opacity: 1 - m * 0.6}}>
				<VanRow n={16} lit={lit} />
			</div>
			<div style={{opacity: text, translate: `0 ${(1 - text) * -24}px`}}>
				<div style={{position: 'absolute', left: 0, right: 0, top: L.brandTop, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16}}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 50, lineHeight: 0.98, color: COLORS.text, textAlign: 'right', textShadow: '0 6px 24px rgba(0,0,0,0.8)'}}>
						FRANKFURT
						<br />
						ERKLÄRT
					</div>
					<div style={{padding: '9px 16px', borderRadius: 10, background: ACCENT.brand, boxShadow: '0 10px 26px rgba(255,59,78,0.4)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, letterSpacing: 3, color: '#FFFFFF'}}>{FORMAT.sub}</div>
				</div>
				<div style={{position: 'absolute', left: 0, right: 0, top: L.bigTop + bob, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: L.bigSize, lineHeight: 1, letterSpacing: -14, color: COLORS.signal, textShadow: `0 0 80px ${withAlpha(COLORS.signal, 0.5)}, 0 24px 60px rgba(0,0,0,0.85)`}}>{COVER.big}</div>
				<div style={{position: 'absolute', left: 0, right: 0, top: L.cardTop, display: 'flex', justifyContent: 'center'}}>
					<div style={{padding: '10px 24px 13px', borderRadius: 20, background: 'linear-gradient(160deg, #FF6A78 0%, #FF4D5E 50%, #D93448 100%)', boxShadow: '0 5px 0 #B32A3C, 0 10px 0 #8E1F2E, 0 40px 70px rgba(0,0,0,0.6)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: L.cardFont, maxWidth: L.cardMaxWidth, lineHeight: 1.05, color: '#FFFFFF', whiteSpace: 'nowrap'}}>{COVER.card}</div>
				</div>
				<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.subTop, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12}}>
					<P2Icon name="shield" size={34} color={BLUE} stroke={2.6} />
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: L.subSize, letterSpacing: 1, color: COLORS.text, textShadow: '0 4px 18px rgba(0,0,0,0.9)', whiteSpace: 'nowrap'}}>{COVER.thumbSub}</span>
				</div>
				<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.smallTop, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 800, fontSize: 24, letterSpacing: 3, color: withAlpha('#FFFFFF', 0.72)}}>{COVER.small}</div>
				<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.metaTop, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14}}>
					<BrandLogo size={52} />
					<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 30, color: COLORS.textMuted}}>{handleWithAt()}</span>
				</div>
				{thumbnail ? (
					<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.chipsTop, display: 'flex', justifyContent: 'center'}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderRadius: 16, background: 'rgba(8,10,28,0.92)', border: `2.5px solid ${COLORS.signal}`}}>
							<P2Icon name="chat" size={30} color={COLORS.signal} />
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 32, color: COLORS.text, whiteSpace: 'nowrap'}}>WARUM KAM KAUM JEMAND?</span>
						</div>
					</div>
				) : null}
			</div>
		</AbsoluteFill>
	);
};

/** Szene 1 – Titelbild im Video (ab Frame 0 vollständig); bei „16 Mannschaftswagen“ gehen die Wagen der Reihe nach an. */
export const CoverScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const h2 = cue(cues, 'hook2', 30);
	const atVans = Math.max(30, Math.min(wordFrame(cues, '16', h2.from + 50), h2.to - 30) - 4);
	const lit = frame < atVans ? 1 : interpolate(frame, [atVans, atVans + 24], [0, 1], clamp);
	const morph = interpolate(frame, [durationInFrames - 22, durationInFrames - 2], [0, 1], clamp);
	return (
		<AbsoluteFill>
			<Demo13Cover lit={lit} morph={morph} />
			<Sfx name="impact" at={0} volume={0.5} />
			<Sfx name="click" at={atVans} volume={0.45} />
			<Sfx name="softImpact" at={atVans + 22} volume={0.5} />
			<Sfx name="whoosh" at={durationInFrames - 20} volume={0.4} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 2: 16 Wagen / 13 Menschen */

const Panel: React.FC<{color: string; at: number; children: React.ReactNode; tilt: number}> = ({color, at, children, tilt}) => {
	const s = useSpring(at, 14, 160);
	return (
		<div style={{flex: 1, opacity: Math.min(1, s * 1.6), transform: `perspective(1400px) rotateY(${tilt * (1 - s * 0.6)}deg) translateY(${(1 - s) * 60}px)`}}>
			<Card color={color} style={{padding: '18px 18px 16px', height: 520, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center'}} glow={0.3}>
				{children}
			</Card>
		</div>
	);
};

export const ContrastScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const h3 = cue(cues, 'hook3', 0);
	const atPeople = Math.max(8, Math.min(wordFrame(cues, 'zwei', h3.from + 10), h3.from + 16));
	const at13 = Math.min(wordFrame(cues, '13', h3.to - 30), h3.to - 18) - 6;
	const vansOn = interpolate(frame, [2, 26], [0, 1], clamp);
	const ppl = interpolate(frame, [atPeople, at13 + 6], [0, 1], clamp);
	const hint = useSpring(at13 + 8, 14, 180);
	const drift = interpolate(frame, [0, durationInFrames], [0, 1]);
	return (
		<AbsoluteFill style={{backgroundColor: '#060920', overflow: 'hidden'}}>
			<AbsoluteFill style={{background: `radial-gradient(ellipse 60% 40% at ${22 + drift * 6}% 40%, ${withAlpha(BLUE, 0.2)}, rgba(0,0,0,0) 70%), radial-gradient(ellipse 60% 40% at ${78 - drift * 6}% 40%, ${withAlpha(GENZ, 0.2)}, rgba(0,0,0,0) 70%), linear-gradient(#0C1036, #05071A)`}} />
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: 0.16}}>
				{new Array(26).fill(0).map((_, i) => (
					<line key={i} x1={i * 46 - 60 + drift * 46} y1={0} x2={i * 46 - 360 + drift * 46} y2={1920} stroke="#6A7BD8" strokeWidth={1} />
				))}
			</svg>
			<div style={{position: 'absolute', left: 64, top: 290}}>
				<Tag text="SAMSTAG, 14.11. · FRANKFURT" color={GENZ} icon="clock" />
			</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 352, display: 'flex', gap: 22}}>
				<Panel color={BLUE} at={0} tilt={14}>
					<CountUp value={CONTRAST.vans.value} at={2} dur={22} style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 120, lineHeight: 1, color: BLUE, textShadow: `0 0 40px ${withAlpha(BLUE, 0.5)}`}} />
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, color: COLORS.text, marginTop: 4}}>{CONTRAST.vans.label}</div>
					<div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 86px)', gap: '4px 6px', marginTop: 16}}>
						{new Array(16).fill(0).map((_, i) => {
							const o = interpolate(vansOn, [i / 16, i / 16 + 0.1], [0, 1], clamp);
							return (
								<div key={i} style={{opacity: o, scale: String(0.6 + 0.4 * o)}}>
									<PoliceVan width={86} phase={i * 2} lights={false} />
								</div>
							);
						})}
					</div>
					<div style={{marginTop: 'auto', textAlign: 'center', fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, lineHeight: 1.2, color: COLORS.textMuted}}>{CONTRAST.vans.note}</div>
				</Panel>
				<Panel color={GENZ} at={4} tilt={-14}>
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 120, lineHeight: 1, color: GENZ, textShadow: `0 0 40px ${withAlpha(GENZ, 0.5)}`}}>
						{frame >= atPeople ? <CountUp value={CONTRAST.people.value} at={atPeople} dur={Math.max(14, at13 + 6 - atPeople)} /> : '?'}
					</span>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, color: COLORS.text, marginTop: 4}}>{CONTRAST.people.label}</div>
					<div style={{display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10, width: '100%'}}>
						{CONTRAST.split.map((sp, i) => {
							const o = interpolate(ppl, i === 0 ? [0, 0.7] : [0.7, 1], [0, 1], clamp);
							return (
								<div key={sp.place} style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8, padding: '4px 10px', borderRadius: 14, background: withAlpha('#FFFFFF', 0.05), border: `1.5px solid ${withAlpha(GENZ, 0.35)}`, opacity: Math.max(0.25, o)}}>
									<MiniCrowd n={i === 0 ? 10 : 3} seed={`d13-c${i}`} h={58} spread={i === 0 ? 34 : 40} on={o} />
									<div style={{textAlign: 'right', paddingBottom: 6}}>
										<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: COLORS.signal}}>{sp.value}</div>
										<div style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 17, color: COLORS.text, whiteSpace: 'nowrap'}}>{sp.place}</div>
									</div>
								</div>
							);
						})}
					</div>
					<div style={{marginTop: 'auto', textAlign: 'center', fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, lineHeight: 1.2, color: COLORS.textMuted}}>{CONTRAST.people.note}</div>
				</Panel>
			</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 900, display: 'flex', justifyContent: 'center', opacity: Math.min(1, hint * 1.6), translate: `0 ${(1 - hint) * 20}px`}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px', borderRadius: 16, background: 'rgba(8,10,28,0.92)', border: `2px solid ${withAlpha('#FFFFFF', 0.35)}`}}>
					<P2Icon name="pin" size={30} color="#C9CEDF" />
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 27, color: COLORS.text}}>{CONTRAST.hint}</span>
				</div>
			</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 986, display: 'flex', justifyContent: 'center', opacity: Math.min(1, hint * 1.6)}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '8px 16px', borderRadius: 14, background: withAlpha('#FFFFFF', 0.06), border: `1.5px dashed ${withAlpha('#FFFFFF', 0.3)}`}}>
					<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted}}>Zum Vergleich {CONTRAST.compare.label}:</span>
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, color: COLORS.text}}>{CONTRAST.compare.value}</span>
					<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted}}>{CONTRAST.compare.note}</span>
				</div>
			</div>
			<div style={{position: 'absolute', left: 64, top: 1150}}>
				<Chip kind="BERICHT" size={16} />
			</div>
			<SourceBar text={CONTRAST.source} at={6} />
			<Sfx name="whoosh" at={0} volume={0.4} />
			{new Array(4).fill(0).map((_, i) => (
				<Sfx key={i} name="pop" at={3 + i * 6} volume={0.3} />
			))}
			<Sfx name="softImpact" at={at13 + 6} volume={0.6} />
			<Sfx name="click" at={at13 + 10} volume={0.4} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 3: Karte */

const MapMarker: React.FC<{title: string; sub: string; color: string; on: number; crowd?: number; seed?: string; van?: boolean}> = ({title, sub, color, on, crowd = 0, seed = 'mm', van}) => (
	<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: on, scale: String(0.7 + 0.3 * on), transformOrigin: '50% 100%'}}>
		<div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '6px 14px 8px', borderRadius: 14, background: 'rgba(8,10,28,0.95)', border: `3px solid ${color}`, boxShadow: `0 12px 30px rgba(0,0,0,0.55), 0 0 24px ${withAlpha(color, 0.35)}`, whiteSpace: 'nowrap'}}>
			{van ? <PoliceVan width={64} lights={false} /> : null}
			<div style={{textAlign: 'center'}}>
				<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 27, letterSpacing: 1, color: COLORS.text}}>{title}</div>
				<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 24, color}}>{sub}</div>
			</div>
		</div>
		{crowd > 0 ? (
			<div style={{marginTop: 4}}>
				<MiniCrowd n={crowd} h={40} spread={crowd > 5 ? 24 : 30} seed={seed} on={on} />
			</div>
		) : (
			<div style={{width: 4, height: 40, background: `linear-gradient(${color}, ${withAlpha(color, 0.1)})`}} />
		)}
		<div style={{width: 22, height: 22, borderRadius: 11, marginTop: -6, background: color, border: '3px solid #FFFFFF', boxShadow: `0 0 20px ${withAlpha(color, 0.9)}`}} />
	</div>
);

const InfoLine: React.FC<{icon: P2IconName; text: string; color?: string; at: number}> = ({icon, text, color = COLORS.text, at}) => {
	const s = useSpring(at, 15, 200);
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: 10, opacity: Math.min(1, s * 1.6), translate: `${(1 - s) * 30}px 0`}}>
			<P2Icon name={icon} size={26} color={color} />
			<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 25, color}}>{text}</span>
		</div>
	);
};

export const MapScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const hw1 = cue(cues, 'hw1', 0);
	const hw2 = cue(cues, 'hw2', 110);
	const bw1 = cue(cues, 'bw1', 260);
	const at14 = Math.min(wordFrame(cues, '14', hw1.from + 50), hw1.to - 20) - 6;
	const atQuote = Math.max(hw2.from - 2, 6);
	const atBw = bw1.from - 2;
	const atAnm = Math.min(wordFrame(cues, 'Anmelder', bw1.to - 26), bw1.to - 16) - 10;
	const [hx, hy] = cityPlaneXY(MAP, MAP_K, PLACES.hauptwache.at);
	const [bx, by] = cityPlaneXY(MAP, MAP_K, PLACES.warte.at);
	const [sx, sy] = cityPlaneXY(MAP, MAP_K, PLACES.staging.at);
	const cam = interpolateCamera(
		frame,
		[
			{frame: 0, cam: {x: hx - 30, y: hy + 20, zoom: 1.35, tilt: 50, rotate: 14}},
			{frame: atBw - 26, cam: {x: hx - 60, y: hy, zoom: 1.2, tilt: 52, rotate: 8}},
			{frame: atBw + 8, cam: {x: (hx + bx + sx) / 3 + 60, y: (hy + by + sy) / 3, zoom: 0.58, tilt: 46, rotate: 24}},
			{frame: atBw + 34, cam: {x: bx + 40, y: by + 10, zoom: 1.25, tilt: 52, rotate: -12}},
			{frame: durationInFrames + 10, cam: {x: bx + 70, y: by + 30, zoom: 1.1, tilt: 54, rotate: -16}},
		],
		EASE_IN_OUT,
	);
	const hOn = interpolate(frame, [2, 12], [0, 1], clamp);
	const bOn = interpolate(frame, [atBw + 4, atBw + 16], [0, 1], clamp);
	const sOn = interpolate(frame, [atBw - 4, atBw + 6, atBw + 22, atBw + 30], [0, 1, 1, 0], clamp);
	const markers: PlaneBillboard[] = [
		{key: 'hw', x: hx, y: hy, node: <MapMarker title={PLACES.hauptwache.name} sub={PLACES.hauptwache.count} color={GENZ} on={hOn} crowd={10} seed="d13-hw" />},
		{key: 'bw', x: bx, y: by, node: <MapMarker title={PLACES.warte.name} sub={PLACES.warte.count} color={GENZ} on={bOn} crowd={3} seed="d13-bw" />},
		{key: 'st', x: sx, y: sy, node: <MapMarker title={PLACES.staging.name} sub="16 WAGEN · laut FNP" color="#9AA6CC" on={sOn} van />},
	];
	const pulse = (frame % 40) / 40;
	const hwCard = springIn({frame, fps, delay: 0, damping: 14, stiffness: 180});
	const quote = springIn({frame, fps, delay: atQuote, damping: 14, stiffness: 180});
	const bwCard = springIn({frame, fps, delay: atBw, damping: 14, stiffness: 180});
	const swap = interpolate(frame, [atBw - 4, atBw + 6], [0, 1], {...clamp, easing: EASE_IN_OUT});
	return (
		<AbsoluteFill style={{backgroundColor: '#080C1F', overflow: 'hidden'}}>
			<CityPlane
				map={MAP}
				k={MAP_K}
				camera={cam as PlaneCamera}
				anchor={[540, 980]}
				floors={4}
				spots={[
					{at: PLACES.hauptwache.at, color: GENZ, radius: 70, on: hOn, pulse},
					{at: PLACES.warte.at, color: GENZ, radius: 70, on: bOn, pulse},
					{at: PLACES.staging.at, color: '#9AA6CC', radius: 60, on: sOn, pulse: 0},
				]}
				highlightStreets={[{name: 'Zeil', color: GENZ, on: 0.35 * hOn * (1 - swap)}]}
				markers={markers}
			/>
			<MapShade top={0.95} bottom={0.9} />
			<div style={{position: 'absolute', left: 64, top: 290}}>
				<Tag text={swap < 0.5 ? '1 · HAUPTWACHE' : '2 · BOCKENHEIMER WARTE'} color={GENZ} icon="pin" />
			</div>
			{/* Hauptwache */}
			{swap < 1 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 352, opacity: Math.min(1, hwCard * 1.6) * (1 - swap), translate: `${-swap * 120}px 0`}}>
					<Card color={GENZ} style={{padding: '16px 22px', display: 'flex', flexDirection: 'column', gap: 8}} glow={0.25}>
						<div style={{display: 'flex', alignItems: 'baseline', gap: 14}}>
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 64, lineHeight: 1, color: COLORS.signal}}>RUND 10</span>
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, color: COLORS.text}}>DEMONSTRIERENDE</span>
							<span style={{marginLeft: 'auto'}}>
								<Chip kind="LAUT FNP" size={15} />
							</span>
						</div>
						<InfoLine icon="clock" text={PLACES.hauptwache.window} color={COLORS.textMuted} at={4} />
						<InfoLine icon="clock" text={PLACES.hauptwache.end} at={at14} />
						{frame >= atQuote - 1 ? (
							<div style={{marginTop: 6, padding: '10px 14px', borderRadius: 14, background: withAlpha(ACCENT.law, 0.12), border: `2px solid ${withAlpha(ACCENT.law, 0.7)}`, opacity: Math.min(1, quote * 1.6), translate: `0 ${(1 - quote) * 16}px`}}>
								<div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4}}>
									<Chip kind="AUSSAGE" size={15} />
									<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted}}>{PLACES.hauptwache.quoteBy}</span>
								</div>
								<div style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 29, lineHeight: 1.15, color: COLORS.text}}>{PLACES.hauptwache.quote}</div>
							</div>
						) : null}
					</Card>
				</div>
			) : null}
			{/* Bockenheimer Warte */}
			{swap > 0 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 352, opacity: Math.min(1, bwCard * 1.6) * swap, translate: `${(1 - swap) * 120}px 0`}}>
					<Card color={GENZ} style={{padding: '16px 22px', display: 'flex', flexDirection: 'column', gap: 8}} glow={0.25}>
						<div style={{display: 'flex', alignItems: 'baseline', gap: 14}}>
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 64, lineHeight: 1, color: COLORS.signal}}>3</span>
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, color: COLORS.text}}>DEMONSTRIERENDE</span>
							<span style={{marginLeft: 'auto'}}>
								<Chip kind="LAUT FNP" size={15} />
							</span>
						</div>
						<InfoLine icon="clock" text={`${PLACES.warte.window} · ${PLACES.warte.end}`} color={COLORS.textMuted} at={atBw + 6} />
						<InfoLine icon="users" text={PLACES.warte.passersby} color={COLORS.textMuted} at={atBw + 12} />
						<div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 4, opacity: interpolate(frame, [atAnm, atAnm + 8], [0, 1], clamp)}}>
							<Chip kind="OFFIZIELL" size={15} />
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, color: COLORS.text}}>{PLACES.warte.note.toUpperCase()}</span>
						</div>
					</Card>
				</div>
			) : null}
			<div style={{position: 'absolute', left: 64, top: 1150, display: 'flex', alignItems: 'center', gap: 10, padding: '4px 12px', borderRadius: 10, background: 'rgba(8,10,28,0.85)'}}>
				<P2Icon name="info" size={22} color={COLORS.textMuted} />
				<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted}}>{PLACES.mapNote}</span>
			</div>
			<SourceBar text={PLACES.source} at={6} />
			<Sfx name="whoosh" at={0} volume={0.45} />
			<Sfx name="blip" at={4} volume={0.55} />
			<Sfx name="click" at={at14} volume={0.4} />
			<Sfx name="pop" at={atQuote} volume={0.45} />
			<Sfx name="whoosh" at={atBw - 6} volume={0.4} />
			<Sfx name="blip" at={atBw + 8} volume={0.55} />
			<Sfx name="click" at={atAnm} volume={0.45} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 4: Datumschaos (Kalender) */

const NOV_FIRST_COL = 6; // 1. November 2026 = Sonntag (Mo = 0)
const CAL = {left: 112, top: 520, cellW: 122, cellH: 74, headH: 70, wdH: 36};
const cellOf = (day: number) => {
	const idx = NOV_FIRST_COL + day - 1;
	return {x: CAL.left + (idx % 7) * CAL.cellW, y: CAL.top + CAL.headH + CAL.wdH + Math.floor(idx / 7) * CAL.cellH};
};

const DayMark: React.FC<{day: number; color: string; on: number; strike?: number; fill?: boolean}> = ({day, color, on, strike = 0, fill}) => {
	const {x, y} = cellOf(day);
	return (
		<div style={{position: 'absolute', left: x + 4, top: y + 3, width: CAL.cellW - 8, height: CAL.cellH - 6, borderRadius: 14, border: `3.5px solid ${color}`, background: fill ? withAlpha(color, 0.9) : withAlpha(color, 0.18), boxShadow: `0 0 ${24 * on}px ${withAlpha(color, 0.7)}`, opacity: on, scale: String(0.85 + 0.15 * on), display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 36, color: fill ? ACCENT.ink : COLORS.text}}>
			{day}
			{strike > 0 ? (
				<svg width={CAL.cellW - 8} height={CAL.cellH - 6} style={{position: 'absolute', left: 0, top: 0}}>
					<line x1={8} y1={CAL.cellH - 14} x2={8 + (CAL.cellW - 24) * strike} y2={CAL.cellH - 14 - (CAL.cellH - 26) * strike} stroke={ACCENT.no} strokeWidth={7} strokeLinecap="round" />
				</svg>
			) : null}
		</div>
	);
};

const Callout: React.FC<{day: number; text: string; color: string; on: number; dx?: number; dy?: number; kind?: Kind}> = ({day, text, color, on, dx = 0, dy = -66, kind}) => {
	const {x, y} = cellOf(day);
	return (
		<div style={{position: 'absolute', left: x + CAL.cellW / 2 + dx, top: y + dy, translate: '-50% 0', opacity: on, scale: String(0.8 + 0.2 * on), transformOrigin: '50% 100%', display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 12, background: 'rgba(8,10,28,0.95)', border: `2.5px solid ${color}`, boxShadow: '0 10px 26px rgba(0,0,0,0.5)', whiteSpace: 'nowrap', zIndex: 5}}>
			{kind ? <Chip kind={kind} size={13} /> : null}
			<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 22, color: COLORS.text}}>{text}</span>
		</div>
	);
};

export const CalendarScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const why = cue(cues, 'why', 0);
	const d1 = cue(cues, 'd1', 40);
	const d2 = cue(cues, 'd2', 150);
	const d3 = cue(cues, 'd3', 210);
	const d4 = cue(cues, 'd4', 360);
	const atSite = Math.max(why.to - 4, Math.min(wordFrame(cues, 'Website', d1.from + 50), d1.from + 60) - 10);
	const at14 = Math.min(wordFrame(cues, '14', d1.from + 30), d1.from + 36) - 4;
	const atGone = Math.min(wordFrame(cues, 'weg', d1.to - 12), d1.to - 6) - 4;
	const at20 = Math.min(wordFrame(cues, '20', d2.to - 20), d2.to - 14) - 6;
	const atAction = Math.min(wordFrame(cues, 'Aktionstag', d3.from + 24), d3.from + 30) - 6;
	const atPolice = Math.min(wordFrame(cues, 'Polizei', d3.from + 50), d3.to - 30) - 4;
	const atDoubt = d4.from - 2;
	const enter = springIn({frame, fps, delay: 0, damping: 14, stiffness: 150});
	const site = springIn({frame, fps, delay: atSite, damping: 14, stiffness: 170});
	const siteOut = interpolate(frame, [d2.from - 2, d2.from + 10], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const m14 = interpolate(frame, [at14, at14 + 8], [0, 1], clamp);
	const strike = interpolate(frame, [atGone, atGone + 10], [0, 1], {...clamp, easing: EASE_OUT});
	const m20 = interpolate(frame, [at20, at20 + 8], [0, 1], clamp);
	const back14 = interpolate(frame, [atAction, atAction + 8], [0, 1], clamp);
	const m13 = interpolate(frame, [atPolice, atPolice + 8], [0, 1], clamp);
	const doubt = springIn({frame, fps, delay: atDoubt, damping: 12, stiffness: 170});
	const dim = interpolate(frame, [atDoubt, atDoubt + 10], [0, 1], clamp);
	const drift = interpolate(frame, [0, durationInFrames], [0, 1]);
	const steps = [
		{label: '1.11.', text: '14.11. kurz genannt, dann entfernt', at: at14, color: GENZ},
		{label: '20.11.', text: 'als nächster Termin genannt', at: at20, color: COLORS.signal},
		{label: 'bis 12.11.', text: 'doch Aktionstag „Phase 2“', at: atAction, color: GENZ},
		{label: 'Fr 13.11.', text: 'Polizei nennt Kundgebungen', at: atPolice, color: BLUE},
		{label: 'Sa 14.11.', text: 'rund 10 + 3', at: atDoubt - 8, color: COLORS.signal},
	];
	return (
		<AbsoluteFill style={{backgroundColor: '#070A22', overflow: 'hidden'}}>
			<AbsoluteFill style={{background: `radial-gradient(ellipse 80% 50% at ${40 + drift * 20}% 45%, #1C2266 0%, #0A0D2C 60%, #05071A 100%)`}} />
			<div style={{position: 'absolute', left: 64, top: 290}}>
				<Tag text="DAS DATUMSCHAOS" color={COLORS.signal} icon="clock" />
			</div>
			<div style={{position: 'absolute', left: 64, width: 900, top: 352, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 60, lineHeight: 1.02, color: COLORS.text, opacity: Math.min(1, enter * 1.6), translate: `${(1 - enter) * -40}px 0`, textShadow: '0 8px 30px rgba(0,0,0,0.8)'}}>
				WARUM SO <span style={{color: GENZ}}>WENIGE?</span>
			</div>
			{/* Kalender (2,5D) */}
			<div style={{position: 'absolute', inset: 0, transform: `perspective(1800px) rotateX(${10 - drift * 4}deg) rotateZ(${-1.5 + drift * 1.5}deg) translateY(${(1 - enter) * 80}px)`, transformOrigin: '50% 60%', opacity: Math.min(1, enter * 1.4) * (1 - dim * 0.55), filter: dim ? `blur(${dim * 2}px)` : undefined}}>
				<div style={{position: 'absolute', left: CAL.left - 18, top: CAL.top - 14, width: CAL.cellW * 7 + 36, height: CAL.headH + CAL.wdH + CAL.cellH * 5 + 30, borderRadius: 28, background: 'linear-gradient(170deg, #F7F4EC, #E6E1D4)', boxShadow: '0 50px 90px rgba(0,0,0,0.65), 0 10px 0 #C8C2B4'}} />
				<div style={{position: 'absolute', left: CAL.left - 18, top: CAL.top - 14, width: CAL.cellW * 7 + 36, height: CAL.headH, borderRadius: '28px 28px 0 0', background: `linear-gradient(170deg, ${GENZ}, #C92D40)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 38, letterSpacing: 4, color: '#FFFFFF'}}>NOVEMBER 2026</div>
				{['MO', 'DI', 'MI', 'DO', 'FR', 'SA', 'SO'].map((d, i) => (
					<div key={d} style={{position: 'absolute', left: CAL.left + i * CAL.cellW, top: CAL.top + CAL.headH - 6, width: CAL.cellW, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 800, fontSize: 22, color: '#8A8FA8'}}>
						{d}
					</div>
				))}
				{new Array(30).fill(0).map((_, i) => {
					const {x, y} = cellOf(i + 1);
					return (
						<div key={i} style={{position: 'absolute', left: x, top: y, width: CAL.cellW, height: CAL.cellH, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 800, fontSize: 32, color: (NOV_FIRST_COL + i) % 7 >= 5 ? '#C04050' : '#2A2B3D', borderTop: '1px solid rgba(0,0,0,0.06)'}}>
							{i + 1}
						</div>
					);
				})}
				<DayMark day={1} color="#8A8FA8" on={interpolate(frame, [at14 - 6, at14], [0, 1], clamp)} />
				<DayMark day={14} color={back14 > 0 ? GENZ : ACCENT.no} on={Math.max(m14, back14)} strike={back14 > 0 ? 0 : strike} fill={back14 > 0} />
				<DayMark day={20} color={COLORS.signal} on={m20} fill />
				<DayMark day={13} color={BLUE} on={m13} />
				<Callout day={14} text={back14 > 0 ? 'DOCH AKTIONSTAG' : strike > 0.5 ? 'ENTFERNT – „BALD“' : 'KURZ GENANNT'} color={back14 > 0 ? GENZ : strike > 0.5 ? ACCENT.no : '#FFB15C'} on={m14} dx={-40} kind="BERICHT" />
				<Callout day={20} text="NÄCHSTER TERMIN" color={COLORS.signal} on={m20} dy={CAL.cellH + 6} />
				<Callout day={13} text="POLIZEI-MELDUNG" color={BLUE} on={m13} dx={-150} dy={-4} kind="OFFIZIELL" />
			</div>
			{/* stilisierte Website (keine Bildschirmaufnahme) */}
			{frame >= atSite - 1 && siteOut < 1 ? (
				<div style={{position: 'absolute', left: 470, top: 432, width: 470, opacity: Math.min(1, site * 1.6) * (1 - siteOut), translate: `${(1 - site) * 80 + siteOut * 200}px 0`, rotate: '3deg'}}>
					<div style={{borderRadius: 18, overflow: 'hidden', background: '#F5F3FA', boxShadow: '0 30px 70px rgba(0,0,0,0.6)'}}>
						<div style={{height: 40, background: '#2A2D45', display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px'}}>
							{['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
								<span key={c} style={{width: 12, height: 12, borderRadius: 6, background: c}} />
							))}
							<span style={{marginLeft: 10, fontFamily: FONTS.body, fontWeight: 700, fontSize: 17, color: '#C9CEDF'}}>Website der Initiative · stilisiert</span>
						</div>
						<div style={{padding: '14px 18px 16px'}}>
							<div style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 20, color: '#6B6A78'}}>NÄCHSTER PROTESTTAG</div>
							<div style={{position: 'relative', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 52, color: strike > 0.5 ? '#B0AFBD' : '#1B1C2E'}}>
								{strike > 0.6 ? '„BALD“' : '14. NOVEMBER'}
								{strike > 0 && strike <= 0.6 ? <div style={{position: 'absolute', left: 0, top: '52%', height: 7, width: `${strike * 160}%`, maxWidth: '100%', background: ACCENT.no, borderRadius: 4}} /> : null}
							</div>
						</div>
					</div>
				</div>
			) : null}
			{/* Zeitleiste */}
			<div style={{position: 'absolute', left: 64, width: 900, top: 1022, display: 'flex', gap: 8, opacity: 1 - dim * 0.4}}>
				{steps.map((s) => {
					const o = interpolate(frame, [s.at, s.at + 8], [0, 1], clamp);
					return (
						<div key={s.label} style={{flex: 1, opacity: 0.25 + 0.75 * o, translate: `0 ${(1 - o) * 10}px`}}>
							<div style={{height: 6, borderRadius: 3, background: o > 0.5 ? s.color : withAlpha('#FFFFFF', 0.2), marginBottom: 6}} />
							<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 22, color: s.color}}>{s.label}</div>
							<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 19, lineHeight: 1.15, color: COLORS.text}}>{s.text}</div>
						</div>
					);
				})}
			</div>
			{/* Einordnung */}
			{frame >= atDoubt - 1 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 620, opacity: Math.min(1, doubt * 1.6), scale: String(0.85 + 0.15 * doubt)}}>
					<Card color={COLORS.signal} style={{padding: '22px 26px', textAlign: 'center'}} glow={0.35}>
						<div style={{display: 'flex', justifyContent: 'center', marginBottom: 10}}>
							<Chip kind="MÖGLICHE ERKLÄRUNG – NICHT BEWIESEN" size={18} />
						</div>
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 54, lineHeight: 1.05, color: COLORS.text}}>{CONFUSION.headline}</div>
						<div style={{marginTop: 12, fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, color: COLORS.textMuted}}>Teilnehmer laut FNP: Hauptwache sollte nur auf den 20.11. hinweisen</div>
					</Card>
				</div>
			) : null}
			<SourceBar text={CONFUSION.source} at={6} />
			<Sfx name="whoosh" at={0} volume={0.4} />
			<Sfx name="paper" at={4} volume={0.4} />
			<Sfx name="click" at={at14} volume={0.5} />
			<Sfx name="pop" at={atSite} volume={0.45} />
			<Sfx name="paper" at={atGone} volume={0.5} />
			<Sfx name="click" at={at20} volume={0.5} />
			<Sfx name="stamp" at={atAction + 2} volume={0.5} />
			<Sfx name="click" at={atPolice} volume={0.45} />
			<Sfx name="softImpact" at={atDoubt + 4} volume={0.55} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 5: Vorbereitung vs. Verlauf (Zeil) */

/** Absperrgitter am Straßenrand (gleiche Perspektive wie ZeilStreet: F 860, Horizont 880, Augenhöhe 1,65 m). */
const Barriers: React.FC<{dolly: number; on: number}> = ({dolly, on}) => {
	const P = (x: number, y: number, z: number): [number, number] => {
		const zz = Math.max(0.6, z - dolly);
		return [540 + (860 * x) / zz, 880 - (860 * (y - 1.65)) / zz];
	};
	const segs = [-1, 1].flatMap((side) => new Array(9).fill(0).map((_, i) => ({side, z: 10 + i * 2.6})));
	return (
		<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: on}}>
			{segs
				.sort((a, b) => b.z - a.z)
				.map(({side, z}, i) => {
					const x = side * 5.6;
					const [ax, ay] = P(x, 0, z);
					const [bx, by] = P(x, 0, z + 2.3);
					const [cx, cy] = P(x, 1.1, z + 2.3);
					const [dx, dy] = P(x, 1.1, z);
					const bars = new Array(6).fill(0).map((_, k) => {
						const t = (k + 0.5) / 6;
						const [px, py] = P(x, 0.1, z + 2.3 * t);
						const [qx, qy] = P(x, 1.0, z + 2.3 * t);
						return <line key={k} x1={px} y1={py} x2={qx} y2={qy} stroke="#C9D2E6" strokeWidth={Math.max(1, 6 / (z - dolly))} />;
					});
					return (
						<g key={i}>
							<polygon points={`${ax},${ay} ${bx},${by} ${cx},${cy} ${dx},${dy}`} fill="rgba(200,210,230,0.06)" stroke="#E2E8F5" strokeWidth={Math.max(1.5, 10 / (z - dolly))} strokeLinejoin="round" />
							{bars}
						</g>
					);
				})}
		</svg>
	);
};

export const PoliceScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p1 = cue(cues, 'p1', 0);
	const p2 = cue(cues, 'p2', 80);
	const atRisk = Math.min(wordFrame(cues, 'Störungen', p1.to - 20), p1.to - 12) - 8;
	const atGitter = Math.max(p2.from - 2, 6);
	const atNot = Math.min(wordFrame(cues, 'nötig', p2.from + 30), p2.from + 40) - 6;
	const atCalm = Math.min(wordFrame(cues, 'Zeil', p2.to - 30), p2.to - 24) - 4;
	const dolly = interpolate(frame, [0, durationInFrames], [0, 6], {easing: EASE_IN_OUT});
	const plan = springIn({frame, fps, delay: 0, damping: 14, stiffness: 170});
	const outcome = springIn({frame, fps, delay: atNot, damping: 14, stiffness: 170});
	const stamp = springIn({frame, fps, delay: atCalm, damping: 9, stiffness: 220});
	const gitter = interpolate(frame, [atGitter - 4, atGitter + 10], [0.35, 1], clamp);
	return (
		<AbsoluteFill style={{backgroundColor: '#070A22', overflow: 'hidden'}}>
			<ZeilStreet dolly={dolly} people={5} officers={3} vans warm={0.55} blueLight={0.2} seed="d13-zeil" />
			<Barriers dolly={dolly} on={gitter} />
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.96) 0%, rgba(4,6,20,0.88) 24%, rgba(4,6,20,0.3) 40%, rgba(4,6,20,0.05) 55%, rgba(4,6,20,0.5) 72%, rgba(4,6,20,0.92) 100%)'}} />
			<div style={{position: 'absolute', left: 64, top: 290}}>
				<Tag text="NACH HALLOWEEN VORBEREITET" color={BLUE} icon="shield" />
			</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 352, display: 'flex', gap: 18}}>
				<div style={{flex: 1, opacity: Math.min(1, plan * 1.6), translate: `${(1 - plan) * -50}px 0`}}>
					<Card color={BLUE} style={{padding: '14px 16px', height: 268, boxSizing: 'border-box'}} glow={0.25}>
						<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8}}>
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: BLUE}}>{POLICE.plan.title}</span>
							<Chip kind="OFFIZIELL" size={13} />
						</div>
						{POLICE.plan.items.map((t, i) => (
							<div key={t} style={{display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 6, opacity: interpolate(frame, [4 + i * 6, 12 + i * 6], [0, 1], clamp)}}>
								<P2Icon name="check" size={24} color={BLUE} stroke={3} />
								<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 23, lineHeight: 1.2, color: i === 1 && frame >= atGitter ? COLORS.signal : COLORS.text}}>{t}</span>
							</div>
						))}
						<div style={{marginTop: 8, fontFamily: FONTS.body, fontWeight: 600, fontSize: 20, color: COLORS.textMuted}}>{POLICE.plan.source}</div>
					</Card>
				</div>
				<div style={{flex: 1, opacity: frame >= atNot - 1 ? Math.min(1, outcome * 1.6) : 0.15, translate: `${(1 - outcome) * 50}px 0`}}>
					<Card color={ACCENT.yes} style={{padding: '14px 16px', height: 268, boxSizing: 'border-box'}} glow={0.25}>
						<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8}}>
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: ACCENT.yes}}>{POLICE.outcome.title}</span>
							<Chip kind="LAUT FNP" size={13} />
						</div>
						{POLICE.outcome.items.map((t) => (
							<div key={t} style={{display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 8}}>
								<P2Icon name="check" size={26} color={ACCENT.yes} stroke={3} />
								<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 25, lineHeight: 1.15, color: COLORS.text}}>{t}</span>
							</div>
						))}
					</Card>
				</div>
			</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 640, display: 'flex', alignItems: 'center', gap: 10, opacity: interpolate(frame, [atRisk, atRisk + 10], [0, 1], clamp)}}>
				<P2Icon name="info" size={26} color={COLORS.textMuted} />
				<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 23, color: COLORS.text, textShadow: '0 2px 10px rgba(0,0,0,0.9)'}}>{POLICE.why}</span>
			</div>
			{frame >= atCalm - 1 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 860, display: 'flex', justifyContent: 'center', opacity: Math.min(1, stamp * 1.6), scale: String(1.4 - 0.4 * stamp), rotate: '-4deg'}}>
					<div style={{padding: '12px 30px 14px', borderRadius: 18, border: `6px solid ${ACCENT.yes}`, background: 'rgba(8,24,20,0.85)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 64, letterSpacing: 2, color: ACCENT.yes, boxShadow: `0 0 50px ${withAlpha(ACCENT.yes, 0.35)}`}}>ZEIL BLIEB RUHIG</div>
				</div>
			) : null}
			<div style={{position: 'absolute', left: 64, top: 1150}}>
				<Chip kind="ILLUSTRATION" size={16} />
			</div>
			<SourceBar text={POLICE.source} at={6} />
			<Sfx name="whoosh" at={0} volume={0.45} />
			<Sfx name="click" at={6} volume={0.35} />
			<Sfx name="click" at={atGitter} volume={0.45} />
			<Sfx name="pop" at={atNot} volume={0.45} />
			<Sfx name="stamp" at={atCalm + 4} volume={0.6} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 6: 20. November + Frage */

export const NextScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const n1 = cue(cues, 'n1', 0);
	const q1 = cue(cues, 'q1', 120);
	const atFfm = Math.min(wordFrame(cues, 'Frankfurt', n1.to - 20), n1.to - 12) - 6;
	const atQ = Math.max(q1.from - 4, 10);
	const cal = springIn({frame, fps, delay: 2, damping: 12, stiffness: 160});
	const title = springIn({frame, fps, delay: 8, damping: 14, stiffness: 180});
	const ffm = springIn({frame, fps, delay: atFfm, damping: 12, stiffness: 190});
	const q = springIn({frame, fps, delay: atQ, damping: 13, stiffness: 180});
	const drift = interpolate(frame, [0, durationInFrames], [0, 1]);
	const pull = interpolate(frame, [0, durationInFrames], [1.12, 1], {easing: EASE_OUT});
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{scale: String(pull), transformOrigin: '50% 70%'}}>
				<NightCity mood={MOODS.dusk} progress={0.6 + drift * 0.25} litRatio={0.42} showMoon bokeh={16} showPromenade={false} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.95) 0%, rgba(4,6,20,0.7) 26%, rgba(4,6,20,0.35) 45%, rgba(4,6,20,0.8) 62%, rgba(4,6,20,0.93) 100%)'}} />
			<div style={{position: 'absolute', left: 64, top: 290}}>
				<Tag text="UND JETZT?" color={COLORS.signal} icon="clock" />
			</div>
			<div style={{position: 'absolute', left: 110, top: 380, opacity: Math.min(1, cal * 1.6), scale: String(0.7 + 0.3 * cal), rotate: `${(1 - cal) * 14}deg`, transformOrigin: '50% 0%'}}>
				<CalendarBlock day="20" month="NOVEMBER 2026" weekday="FREITAG" width={290} accent={COLORS.signal} tilt={-4} />
			</div>
			<div style={{position: 'absolute', left: 460, width: 480, top: 420, opacity: Math.min(1, title * 1.6), translate: `${(1 - title) * 60}px 0`}}>
				<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 44, lineHeight: 1.05, color: COLORS.signal, textShadow: '0 6px 24px rgba(0,0,0,0.9)'}}>{NEXT.title}</div>
				<div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 10}}>
					<Chip kind="ANGEKÜNDIGT" size={17} />
				</div>
				<div style={{marginTop: 10, fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, lineHeight: 1.25, color: COLORS.text}}>{NEXT.sub}</div>
				<div style={{marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 16px', borderRadius: 14, background: GENZ, opacity: Math.min(1, ffm * 1.6), scale: String(0.8 + 0.2 * ffm), boxShadow: '0 14px 34px rgba(255,59,78,0.4)'}}>
					<P2Icon name="pin" size={28} color="#FFFFFF" stroke={2.6} />
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: '#FFFFFF', whiteSpace: 'nowrap'}}>AUCH IN FRANKFURT</span>
				</div>
			</div>
			{frame >= atQ - 1 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 800, opacity: Math.min(1, q * 1.6), scale: String(0.85 + 0.15 * q)}}>
					<Card color={COLORS.signal} style={{padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 18}} glow={0.3}>
						<IconOrb name="chat" color={COLORS.signal} size={86} />
						<div>
							<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 46, lineHeight: 1.05, color: COLORS.text}}>{NEXT.question}</div>
							<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, color: COLORS.textMuted, marginTop: 4}}>Schreibt’s in die Kommentare · sachlich bleiben</div>
						</div>
					</Card>
				</div>
			) : null}
			<SourceBar text={NEXT.source} at={8} />
			<Sfx name="whoosh" at={0} volume={0.45} />
			<Sfx name="softImpact" at={8} volume={0.55} />
			<Sfx name="blip" at={atFfm} volume={0.5} />
			<Sfx name="pop" at={atQ} volume={0.55} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 7: Abo-Aufruf (offizielles Logo) */

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
					<div style={{position: 'absolute', left: '50%', bottom: -26, translate: '-50% 0', scale: String(press), width: 68, height: 68, borderRadius: 34, background: followed ? ACCENT.yes : ACCENT.brand, border: '4px solid #FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 24px rgba(0,0,0,0.5)'}}>
						<P2Icon name={followed ? 'check' : 'plus'} size={38} color="#FFFFFF" stroke={3.4} />
					</div>
				</div>
				<span style={{marginTop: 12, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 54, color: COLORS.text}}>{handleWithAt()}</span>
				<div style={{padding: '12px 30px 14px', borderRadius: 20, background: ACCENT.brand, boxShadow: '0 20px 50px rgba(255,59,78,0.35)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 42, color: '#FFFFFF', scale: String(followed ? 1 + 0.035 * Math.sin((frame - atCta - 28) / 5) : 1)}}>{CTA.title}</div>
				<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 24, letterSpacing: 2.5, color: COLORS.signal}}>{CTA.sub}</span>
			</div>
			<Sfx name="pop" at={atCta} volume={0.6} />
			<Sfx name="click" at={atCta + 26} volume={0.6} />
		</AbsoluteFill>
	);
};
