import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {BrandLogo} from '../../../components/brand/BrandLogo';
import {getWorld, projectPoint} from '../../../components/map/geo';
import {TopTag} from '../../../formats/frankfurt-erklaert/Branding';
import {ACCENT, FORMAT, LAYOUT} from '../../../formats/frankfurt-erklaert/theme';
import {clamp, EASE_IN_OUT, EASE_OUT, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {handleWithAt} from '../../../theme/brand';
import {COLORS, FONTS} from '../../../theme/tokens';
import {MOODS, NightCity} from '../../frankfurt-2026-11-20-ausblick/premium/NightCity';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {Card, CountUp, P2Icon, type P2IconName, Stars, useSpring} from '../../frankfurt-erklaert-genz-phase2-2026-11-14/scenes/kit';
import {AIRPORTS, AMT, COVER, EINSATZ, FLIGHTS, FLIGHTS_BY, KLINIK, ONBOARD, OUTRO, STAND, SYMPTOMS, SYMPTOMS_BY, URSACHE} from '../content';
import {CONDOR_COVER_LAYOUT} from '../cover-layout';
import {Airliner, Ambulance, Apron, Cabin, CaseFile, Hospital, Microscope, OfficeBuilding, PeopleGrid, PlaneIcon, VirusGlyph} from '../visuals/Aviation';

const RED = ACCENT.brand;
const BLUE = ACCENT.info;
const GREEN = ACCENT.yes;
const YELLOW = COLORS.signal;
const ORANGE = '#FF9F43';
const CYAN = '#46C2FF';
const AMBER = '#FFB547';
const SICK = '#9BE38E';
const NEWS = 'news' as const;

/* ------------------------------------------------------------------ Bausteine (wie #14–#16) */

type Kind = 'LAUT CONDOR' | 'LAUT FRAPORT' | 'LAUT HESSENSCHAU' | 'BERICHT' | 'VERDACHT' | 'OFFEN' | 'ILLUSTRATION';
const KIND_COLOR: Record<Kind, string> = {'LAUT CONDOR': CYAN, 'LAUT FRAPORT': BLUE, 'LAUT HESSENSCHAU': '#B794F6', BERICHT: AMBER, VERDACHT: AMBER, OFFEN: ACCENT.no, ILLUSTRATION: '#9AA6CC'};
const Chip: React.FC<{kind: Kind; size?: number; style?: React.CSSProperties}> = ({kind, size = 17, style}) => {
	const c = KIND_COLOR[kind];
	return <span style={{display: 'inline-block', padding: `${size * 0.2}px ${size * 0.5}px`, borderRadius: size * 0.4, background: withAlpha(c, 0.18), border: `2px solid ${c}`, fontFamily: FONTS.heading, fontWeight: 900, fontSize: size, letterSpacing: 1.2, color: c, whiteSpace: 'nowrap', ...style}}>{kind}</span>;
};

const In: React.FC<{at: number; children: React.ReactNode; dx?: number; dy?: number; style?: React.CSSProperties}> = ({at, children, dx = 0, dy = 30, style}) => {
	const s = useSpring(at, 13, 180);
	const frame = useCurrentFrame();
	if (frame < at - 1) return null;
	return <div style={{position: 'absolute', opacity: Math.min(1, s * 1.7), translate: `${(1 - s) * dx}px ${(1 - s) * dy}px`, scale: String(0.92 + 0.08 * s), ...style}}>{children}</div>;
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

const IllustrationMark: React.FC<{top?: number}> = ({top = 1238}) => (
	<div style={{position: 'absolute', right: 160, top, fontFamily: FONTS.body, fontWeight: 700, fontSize: 18, letterSpacing: 1.5, color: withAlpha('#FFFFFF', 0.6)}}>ILLUSTRATION</div>
);

/** Morgenhimmel (Sonntagmorgen) im Serien-Nachtblau. */
const MorningSky: React.FC = () => (
	<AbsoluteFill style={{background: 'linear-gradient(#070B26 0%, #141B4C 38%, #3A3F74 66%, #8E6E86 100%)'}} />
);

/* ------------------------------------------------------------------ Szene 1: Titelbild */

/**
 * Titelbild (Video-Frame 0 und PNG, nach COVER_ZONE): Serientitel, „FLUGHAFEN FRANKFURT · SONNTAG 22.11.“, riesig „2 FLÜGE“, rote Karte
 * „PASSAGIERE KRANK AN BORD“, Plakette „URSACHE UNKLAR · STAND 23.11.“, darunter zwei Jets im Anflug und ein wartender Rettungswagen
 * (ILLUSTRATION), Logo + neuer Account @frankfurtrednews; im PNG zusätzlich „WAS IST AM FLUGHAFEN PASSIERT?“.
 */
export const CondorCover: React.FC<{morph?: number; thumbnail?: boolean; meta?: number}> = ({morph = 0, thumbnail = false, meta = 1}) => {
	const frame = useCurrentFrame();
	const L = CONDOR_COVER_LAYOUT;
	const m = EASE_IN_OUT(Math.min(1, Math.max(0, morph)));
	const text = 1 - Math.min(1, m * 1.6);
	const bob = Math.sin(frame / 26) * 3;
	const drift = Math.sin(frame / 50) * 6;
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<MorningSky />
			<Stars seed="c17c" n={34} height={420} />
			{/* Rollfeld-Horizont */}
			<div style={{position: 'absolute', left: 0, right: 0, top: 1150, height: 140, background: 'linear-gradient(#3A3F5C, #1A1D2E)'}} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 1196, height: 6, background: withAlpha(YELLOW, 0.55)}} />
			{/* Jets im Anflug */}
			<div style={{position: 'absolute', left: 330 + drift, top: L.artTop + 6 - drift * 0.5, opacity: 0.85}}>
				<Airliner width={360} gear={1} seed="cv2" />
			</div>
			<div style={{position: 'absolute', left: 60 - drift, top: L.artTop + 78 + drift * 0.3}}>
				<Airliner width={560} gear={1} seed="cv1" />
			</div>
			<div style={{position: 'absolute', left: 640, top: 1110}}>
				<Ambulance width={250} lights={1} seed="cvr" facing={-1} />
			</div>
			<AbsoluteFill style={{background: `linear-gradient(rgba(4,6,20,${0.45 * text + 0.1}) 0%, rgba(4,6,20,${0.1 * text}) 14%, rgba(4,6,20,${0.6 * text}) 24%, rgba(4,6,20,${0.86 * text}) 34%, rgba(4,6,20,${0.86 * text}) 46%, rgba(4,6,20,${0.2 * text}) 50%, rgba(4,6,20,0) 60%, rgba(4,6,20,${0.7 * text}) 100%)`}} />
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
				<div style={{position: 'absolute', left: 0, right: 0, top: L.bigTop + bob, height: L.bigBottom - L.bigTop, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22}}>
					<div style={{width: 150, height: 150, borderRadius: 75, background: withAlpha('#FFFFFF', 0.1), border: `4px solid ${YELLOW}`, display: 'flex', alignItems: 'center', justifyContent: 'center', rotate: '-8deg'}}>
						<PlaneIcon size={104} color={YELLOW} />
					</div>
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: L.bigSize, lineHeight: 0.92, letterSpacing: -5, color: YELLOW, whiteSpace: 'nowrap', textShadow: `0 0 70px ${withAlpha(YELLOW, 0.45)}, 0 22px 55px rgba(0,0,0,0.85)`}}>{COVER.big}</span>
				</div>
				<div style={{position: 'absolute', left: L.sideMin - 20, right: L.sideMin - 20, top: L.cardTop, display: 'flex', justifyContent: 'center'}}>
					<div style={{padding: '8px 24px 10px', borderRadius: 18, background: 'linear-gradient(160deg, #FF6A78 0%, #FF4D5E 50%, #D93448 100%)', boxShadow: '0 5px 0 #B32A3C, 0 10px 0 #8E1F2E, 0 30px 60px rgba(0,0,0,0.6)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: L.cardFont, lineHeight: 1.1, color: '#FFFFFF', whiteSpace: 'nowrap'}}>{COVER.card}</div>
				</div>
				<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.tagTop, height: L.tagBottom - L.tagTop, display: 'flex', justifyContent: 'center'}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px', borderRadius: 23, background: 'rgba(8,10,28,0.94)', border: `2.5px solid ${YELLOW}`}}>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 24, letterSpacing: 2, color: YELLOW, whiteSpace: 'nowrap'}}>{COVER.tag}</span>
						<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 22, color: COLORS.text, whiteSpace: 'nowrap'}}>· STAND {STAND.date.slice(0, 6)}</span>
					</div>
				</div>
				<div style={{position: 'absolute', left: L.sideMin, top: L.artBottom - 34, fontFamily: FONTS.body, fontWeight: 700, fontSize: 18, letterSpacing: 1.5, color: withAlpha('#FFFFFF', 0.6)}}>ILLUSTRATION</div>
				<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.metaTop, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, opacity: meta}}>
					<BrandLogo size={52} />
					<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 30, color: COLORS.textMuted}}>{handleWithAt(NEWS)}</span>
				</div>
				{thumbnail ? (
					<div style={{position: 'absolute', left: L.sideMin, right: L.sideMin, top: L.thumbTop, display: 'flex', justifyContent: 'center'}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 22px', borderRadius: 16, background: 'rgba(8,10,28,0.92)', border: `2.5px solid ${YELLOW}`}}>
							<P2Icon name="alert" size={30} color={YELLOW} />
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
	const atUebel = wordFrame(cues, 'Übelkeit', h2.from + 30);
	const morph = interpolate(frame, [durationInFrames - 14, durationInFrames - 1], [0, 1], clamp);
	const meta = interpolate(frame, [h2.from - 8, h2.from], [1, 0], clamp);
	return (
		<AbsoluteFill>
			<CondorCover morph={morph} meta={meta} />
			<Sfx name="softImpact" at={0} volume={0.5} />
			<Sfx name="pop" at={atUebel} volume={0.45} />
			<Sfx name="whoosh" at={Math.max(0, durationInFrames - 14)} volume={0.45} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 2: Route La Romana → Frankfurt */

const RouteMap: React.FC<{draw: [number, number]; pins: number; zoom: number}> = ({draw, pins, zoom}) => {
	const frame = useCurrentFrame();
	const world = getWorld();
	const [ox, oy] = projectPoint(AIRPORTS.origin.at);
	const [dx, dy] = projectPoint(AIRPORTS.dest.at);
	const cx = (ox + dx) / 2;
	const cy = (oy + dy) / 2 - 20;
	const k = (720 / Math.hypot(dx - ox, dy - oy)) * zoom;
	const tx = 540 - cx * k;
	const ty = 770 - cy * k;
	const S = (x: number, y: number): [number, number] => [x * k + tx, y * k + ty];
	const [x0, y0] = S(ox, oy);
	const [x2, y2] = S(dx, dy);
	const arc = (lift: number) => {
		const mx = (x0 + x2) / 2;
		const my = (y0 + y2) / 2 - lift;
		return {mx, my, at: (t: number): [number, number] => [(1 - t) ** 2 * x0 + 2 * (1 - t) * t * mx + t * t * x2, (1 - t) ** 2 * y0 + 2 * (1 - t) * t * my + t * t * y2]};
	};
	const arcs = [arc(170), arc(250)];
	return (
		<svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
			<defs>
				<radialGradient id="rm-glow" cx="50%" cy="45%" r="70%">
					<stop offset="0" stopColor={withAlpha(CYAN, 0.12)} />
					<stop offset="1" stopColor="rgba(0,0,0,0)" />
				</radialGradient>
			</defs>
			<rect width={1080} height={1920} fill="#0A1236" />
			<rect width={1080} height={1920} fill="url(#rm-glow)" />
			<g transform={`translate(${tx} ${ty}) scale(${k})`}>
				<path d={world.graticule} fill="none" stroke={withAlpha('#FFFFFF', 0.06)} strokeWidth={1} vectorEffect="non-scaling-stroke" />
				<g fill="#1E2B63" stroke="#3A4C94" strokeWidth={0.8} strokeLinejoin="round">
					{world.countries.map((c) => (
						<path key={c.id + c.name} d={c.d} vectorEffect="non-scaling-stroke" fill={c.name === 'Dominican Rep.' || c.name === 'Germany' ? '#34468F' : undefined} />
					))}
				</g>
			</g>
			{arcs.map((a, i) => {
				const t = Math.max(0, Math.min(1, draw[i]));
				if (t <= 0) return null;
				const n = 48;
				const d = new Array(n + 1).fill(0).map((_, j) => {
					const [px, py] = a.at((j / n) * t);
					return `${j ? 'L' : 'M'}${px.toFixed(1)} ${py.toFixed(1)}`;
				}).join(' ');
				const [hx, hy] = a.at(t);
				const [bx, by] = a.at(Math.max(0, t - 0.01));
				const ang = (Math.atan2(hy - by, hx - bx) * 180) / Math.PI;
				const color = i ? YELLOW : CYAN;
				return (
					<g key={i}>
						<path d={d} fill="none" stroke={withAlpha(color, 0.25)} strokeWidth={14} strokeLinecap="round" />
						<path d={d} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" strokeDasharray="12 9" strokeDashoffset={-frame * 1.6} />
						<g transform={`translate(${hx} ${hy}) rotate(${ang})`}>
							<circle r={30} fill={withAlpha(color, 0.25)} />
							<g transform="translate(-22 -22)">
								<PlaneIcon size={44} color="#FFFFFF" />
							</g>
						</g>
					</g>
				);
			})}
			{[{p: [x0, y0], a: AIRPORTS.origin, dir: -1}, {p: [x2, y2], a: AIRPORTS.dest, dir: 1}].map(({p, a, dir}, i) => {
				const o = interpolate(pins, [i * 0.4, i * 0.4 + 0.3], [0, 1], clamp);
				return (
					<g key={a.code} opacity={o}>
						<circle cx={p[0]} cy={p[1]} r={12 + 8 * ((frame % 40) / 40)} fill="none" stroke={withAlpha(YELLOW, 0.6 * (1 - (frame % 40) / 40))} strokeWidth={3} />
						<circle cx={p[0]} cy={p[1]} r={11} fill={YELLOW} stroke="#FFFFFF" strokeWidth={3} />
						<text x={p[0] + (dir === -1 ? 0 : -10)} y={p[1] + (dir === -1 ? 52 : -46)} textAnchor={dir === -1 ? 'start' : 'end'} fontFamily="Montserrat, sans-serif" fontWeight={900} fontSize={34} fill="#FFFFFF">{a.name}</text>
						<text x={p[0] + (dir === -1 ? 0 : -10)} y={p[1] + (dir === -1 ? 80 : -18)} textAnchor={dir === -1 ? 'start' : 'end'} fontFamily="Inter, sans-serif" fontWeight={700} fontSize={22} fill={withAlpha('#FFFFFF', 0.7)}>{a.country}</text>
					</g>
				);
			})}
		</svg>
	);
};

export const RouteScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const a1 = cue(cues, 'a1', 0);
	const atCondor = wordFrame(cues, 'Condor-Maschinen', a1.from + 10) - 6;
	const atRomana = wordFrame(cues, 'Romana', atCondor + 10) - 6;
	const atFfm = wordFrame(cues, 'Frankfurt', atRomana + 20) - 4;
	const d0 = interpolate(frame, [Math.max(2, atRomana - 4), atFfm + 6], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const d1 = interpolate(frame, [Math.max(10, atRomana + 8), atFfm + 16], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const pins = interpolate(frame, [2, Math.max(20, atFfm)], [0, 1], clamp);
	const zoom = interpolate(frame, [0, durationInFrames], [1.08, 1], clamp);
	return (
		<AbsoluteFill style={{backgroundColor: '#0A1236', overflow: 'hidden'}}>
			<RouteMap draw={[d0, d1]} pins={pins} zoom={zoom} />
			<Shade top={0.95} bottom={0.88} mid={[26, 64]} />
			<SceneTag text="SONNTAG, 22.11." color={CYAN} icon="route" />
			<In at={Math.max(2, atCondor)} dy={24} style={{left: LAYOUT.left, top: 378, width: LAYOUT.width}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap'}}>
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 58, color: COLORS.text, whiteSpace: 'nowrap'}}>2 CONDOR-FLÜGE</span>
				</div>
				<div style={{marginTop: 4, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, color: YELLOW, whiteSpace: 'nowrap'}}>LA ROMANA → FRANKFURT</div>
			</In>
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 1140, display: 'flex', gap: 12}}>
				{FLIGHTS.map((f, i) => {
					const o = interpolate(frame, [atRomana + 6 + i * 10, atRomana + 14 + i * 10], [0, 1], clamp);
					return (
						<div key={f.no} style={{flex: 1, padding: '8px 14px', borderRadius: 14, background: 'rgba(8,10,28,0.92)', border: `2.5px solid ${i ? YELLOW : CYAN}`, opacity: o, translate: `0 ${(1 - o) * 20}px`}}>
							<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: i ? YELLOW : CYAN}}>{f.no}</div>
							<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.text}}>Ankunft FRA {f.arrival}</div>
						</div>
					);
				})}
			</div>
			<Note text={`${FLIGHTS_BY} · Karte: Natural Earth`} top={1240} opacity={interpolate(frame, [atRomana + 20, atRomana + 28], [0, 1], clamp)} />
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="blip" at={Math.max(2, atRomana - 4)} volume={0.5} />
			<Sfx name="blip" at={atFfm} volume={0.5} />
			<Sfx name="pop" at={atRomana + 6} volume={0.4} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 3: Beschwerden an Bord */

export const KabineScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const a2 = cue(cues, 'a2', 0);
	const atReis = wordFrame(cues, 'Reisende', a2.from + 10) - 6;
	const symAt = [wordFrame(cues, 'Übelkeit', atReis + 4) - 4, wordFrame(cues, 'Unwohlsein', atReis + 14) - 4, wordFrame(cues, 'Erbrechen', atReis + 24) - 4];
	const unwellOn = interpolate(frame, [Math.max(4, atReis), Math.max(4, atReis) + 14], [0, 1], clamp);
	const crew = interpolate(frame, [symAt[0], symAt[0] + 12], [0, 1], clamp);
	const drift = interpolate(frame, [0, durationInFrames], [-0.6, 0.6], clamp);
	return (
		<AbsoluteFill style={{backgroundColor: '#0B1029', overflow: 'hidden'}}>
			<div style={{position: 'absolute', left: 0, top: 200, width: 1080, height: 1100, scale: String(1.04 - drift * 0.02)}}>
				<Cabin unwell={[3, 8, 14, 17, 21]} unwellOn={unwellOn} crew={crew} drift={drift} />
				{/* gedimmtes Kabinenlicht (Nachtflug) – passend zur Serien-Farbwelt */}
				<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(rgba(10,14,46,0.42), rgba(10,14,46,0.22) 55%, rgba(10,14,46,0.5))'}} />
			</div>
			<Shade top={0.95} bottom={0.92} mid={[30, 56]} />
			<SceneTag text="AN BORD" color={SICK} icon="users" />
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 378, display: 'flex', alignItems: 'center', gap: 12}}>
				<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 50, color: COLORS.text, whiteSpace: 'nowrap'}}>BESCHWERDEN IM FLUG</span>
			</div>
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 1110, display: 'flex', flexDirection: 'column', gap: 10}}>
				<div style={{display: 'flex', gap: 10}}>
					{SYMPTOMS.map((s, i) => {
						const o = interpolate(frame, [symAt[i], symAt[i] + 8], [0, 1], clamp);
						return (
							<div key={s} style={{flex: 1, padding: '10px 8px', borderRadius: 14, background: 'rgba(8,10,28,0.94)', border: `2.5px solid ${SICK}`, textAlign: 'center', opacity: o, scale: String(0.85 + 0.15 * o), fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, color: COLORS.text}}>{s}</div>
						);
					})}
				</div>
				<div style={{display: 'flex', gap: 10, alignItems: 'center', opacity: interpolate(frame, [symAt[0], symAt[0] + 8], [0, 1], clamp)}}>
					<Chip kind="LAUT CONDOR" size={15} />
					<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 21, color: COLORS.textMuted}}>{SYMPTOMS_BY} · nicht alle an Bord betroffen</span>
				</div>
			</div>
			<IllustrationMark top={1070} />
			<Sfx name="whoosh" at={0} volume={0.35} />
			{symAt.map((a, i) => (
				<Sfx key={i} name="pop" at={a} volume={0.4} />
			))}
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 4: 620 an Bord – nicht alle krank */

export const BordScene: React.FC<SceneProps> = ({cues}) => {
	const frame = useCurrentFrame();
	const b1 = cue(cues, 'b1', 0);
	const b2 = cue(cues, 'b2', 90);
	const at620 = wordFrame(cues, '620', b1.from + 10);
	const atNicht = wordFrame(cues, 'Nicht', at620 + 20) - 4;
	const atCondor = Math.max(atNicht + 12, wordFrame(cues, 'Condor', b2.from + 2) - 4);
	const at40 = wordFrame(cues, '40', atCondor + 20) - 4;
	const onCount = Math.round(interpolate(frame, [2, Math.max(20, at620 + 2)], [0, 620], {...clamp, easing: EASE_OUT}));
	const stamp = useSpring(atNicht, 12, 200);
	const hotOn = interpolate(frame, [atCondor, atCondor + 14], [0, 1], clamp);
	const extraOn = interpolate(frame, [at40, at40 + 12], [0, 1], clamp);
	const stampOut = interpolate(frame, [atCondor - 4, atCondor + 6], [1, 0.0], clamp);
	return (
		<AbsoluteFill style={{backgroundColor: '#090C24', overflow: 'hidden'}}>
			<AbsoluteFill style={{background: `radial-gradient(ellipse 80% 50% at 50% 55%, ${withAlpha(BLUE, 0.14)} 0%, rgba(0,0,0,0) 70%)`}} />
			<SceneTag text="IN BEIDEN MASCHINEN" color={YELLOW} icon="users" />
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 372, display: 'flex', alignItems: 'center', gap: 16}}>
				<CountUp value={ONBOARD.total} at={2} dur={Math.max(18, at620)} style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 124, lineHeight: 1, color: YELLOW, whiteSpace: 'nowrap', textShadow: `0 0 50px ${withAlpha(YELLOW, 0.5)}`}} prefix="≈ " />
				<div>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, lineHeight: 1, color: COLORS.text}}>{ONBOARD.totalLabel}</div>
					<div style={{marginTop: 6, fontFamily: FONTS.body, fontWeight: 700, fontSize: 21, lineHeight: 1.2, color: COLORS.textMuted, maxWidth: 520}}>{ONBOARD.totalBy}</div>
				</div>
			</div>
			<div style={{position: 'absolute', left: 140, top: 545}}>
				<PeopleGrid width={800} onCount={onCount} hot={ONBOARD.condor} hotOn={hotOn} extra={ONBOARD.reports - ONBOARD.condor} extraOn={extraOn} />
			</div>
			{/* Stempel */}
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 820, display: 'flex', justifyContent: 'center', opacity: Math.min(1, stamp * 1.7) * stampOut, scale: String(1.4 - 0.4 * stamp)}}>
				<div style={{padding: '12px 26px', borderRadius: 16, border: `5px solid ${ACCENT.no}`, background: 'rgba(8,10,28,0.95)', rotate: '-4deg', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 54, color: COLORS.text, whiteSpace: 'nowrap'}}>
					NICHT ALLE <span style={{color: ACCENT.no}}>KRANK</span>
				</div>
			</div>
			{/* Legende */}
			<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top: 1198, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center'}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 12, background: 'rgba(8,10,28,0.92)', border: `2px solid ${ORANGE}`, opacity: hotOn}}>
					<span style={{width: 16, height: 16, borderRadius: 8, background: ORANGE}} />
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 24, color: COLORS.text}}>≈ {ONBOARD.condor}</span>
					<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 21, color: COLORS.textMuted}}>laut Condor</span>
				</div>
				<div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 12, background: 'rgba(8,10,28,0.92)', border: `2px dashed ${YELLOW}`, opacity: extraOn}}>
					<span style={{width: 16, height: 16, borderRadius: 8, border: `2px dashed ${YELLOW}`}} />
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 24, color: COLORS.text}}>≈ {ONBOARD.reports}</span>
					<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 21, color: COLORS.textMuted}}>andere Berichte</span>
				</div>
			</div>
			<Note text={ONBOARD.note} top={1250} icon="info" opacity={extraOn} />
			<Sfx name="softImpact" at={Math.max(2, at620)} volume={0.5} />
			<Sfx name="stamp" at={atNicht} volume={0.5} />
			<Sfx name="pop" at={atCondor} volume={0.45} />
			<Sfx name="pop" at={at40} volume={0.4} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 5: Rettungseinsatz auf dem Vorfeld */

export const EinsatzScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const c1 = cue(cues, 'c1', 0);
	const c2 = cue(cues, 'c2', 90);
	const atRett = wordFrame(cues, 'Rettungskräfte', c1.from + 10) - 6;
	const atLand = wordFrame(cues, 'Landung', atRett + 10) - 4;
	const atFraport = Math.max(atLand + 10, wordFrame(cues, 'Fraport', c2.from) - 4);
	const atMed = wordFrame(cues, 'medizinische', atFraport + 12) - 6;
	const atUnters = wordFrame(cues, 'untersuchten', atMed + 6) - 4;
	// Phase 1: Jet im Anflug, Fahrzeuge warten · Phase 2 (ab c2): Jet steht, Treppe, Einsatzkräfte
	const land = interpolate(frame, [0, Math.max(30, c2.from - 6)], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const taxi = interpolate(frame, [c2.from - 6, c2.from + 20], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const planeX = interpolate(land, [0, 1], [1260, 700]) + taxi * -120;
	const planeY = interpolate(land, [0, 1], [190, 640]) + taxi * 20;
	const planeScale = interpolate(land, [0, 1], [0.42, 0.62]) + taxi * 0.08;
	const vehicles = interpolate(frame, [0, Math.max(10, atRett + 30)], [0.36, 1], clamp);
	const crew = interpolate(frame, [atMed - 4, atMed + 16], [0, 1], clamp);
	const stairs = interpolate(frame, [atMed - 10, atMed + 14], [0, 1], {...clamp, easing: EASE_OUT});
	const door = interpolate(frame, [atMed + 6, atMed + 16], [0, 1], clamp);
	const zoom = interpolate(frame, [0, durationInFrames], [1.0, 1.06], clamp);
	return (
		<AbsoluteFill style={{backgroundColor: '#141B4C', overflow: 'hidden'}}>
			<MorningSky />
			<div style={{position: 'absolute', left: 0, top: 220, width: 1080, height: 1180, scale: String(zoom), transformOrigin: '50% 60%'}}>
				<Apron planeX={planeX} planeY={planeY} planeScale={planeScale} gear={1} vehicles={vehicles} crew={crew} stairs={stairs} lights={1} doorOpen={door} />
			</div>
			<Shade top={0.95} bottom={0.9} mid={[28, 62]} />
			<SceneTag text="RETTUNGSEINSATZ · FRA" color={BLUE} icon="shield" />
			<In at={Math.max(2, atRett)} dx={-50} dy={0} style={{left: LAYOUT.left, top: 378, width: LAYOUT.width}}>
				<Card color={BLUE} style={{padding: '12px 18px'}} glow={0.3}>
					<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, color: COLORS.text}}>{EINSATZ.ready}</span>
						<Chip kind="LAUT HESSENSCHAU" size={14} />
					</div>
					<div style={{marginTop: 4, fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted}}>{EINSATZ.readySub}</div>
				</Card>
			</In>
			<In at={atFraport} dx={50} dy={0} style={{left: LAYOUT.left, top: 520, width: LAYOUT.width}}>
				<div style={{display: 'flex', gap: 10}}>
					<div style={{flex: 1, padding: '10px 14px', borderRadius: 16, background: 'rgba(8,10,28,0.94)', border: `2.5px solid ${BLUE}`}}>
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, color: COLORS.text}}>{EINSATZ.extra}</div>
						<Chip kind="LAUT FRAPORT" size={14} style={{marginTop: 6}} />
					</div>
					<div style={{flex: 1, padding: '10px 14px', borderRadius: 16, background: 'rgba(8,10,28,0.94)', border: `2.5px solid ${GREEN}`, opacity: interpolate(frame, [atUnters, atUnters + 8], [0, 1], clamp)}}>
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, color: COLORS.text}}>{EINSATZ.board}</div>
						<div style={{marginTop: 4, fontFamily: FONTS.body, fontWeight: 700, fontSize: 21, color: COLORS.textMuted}}>{EINSATZ.boardBy}</div>
					</div>
				</div>
			</In>
			<IllustrationMark top={1250} />
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="pop" at={Math.max(2, atRett)} volume={0.45} />
			<Sfx name="pop" at={atFraport} volume={0.45} />
			<Sfx name="click" at={atUnters} volume={0.4} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 6: Zwei Personen im Krankenhaus */

export const KlinikScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const d1 = cue(cues, 'd1', 0);
	const d2 = cue(cues, 'd2', 90);
	const atKH = wordFrame(cues, 'Krankenhaus', d1.from + 6) - 6;
	const atKreis = wordFrame(cues, 'Kreislaufproblemen', atKH + 10) - 6;
	const atWunsch = wordFrame(cues, 'Wunsch', atKreis + 10) - 6;
	const atRest = Math.max(atWunsch + 10, d2.from - 2);
	const drive = interpolate(frame, [0, Math.max(30, atKH + 30)], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const pull = interpolate(frame, [0, durationInFrames], [0, 1], clamp);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{scale: String(1.08 - pull * 0.06), transformOrigin: '50% 80%'}}>
				<NightCity mood={MOODS.police} progress={0.4 + pull * 0.2} litRatio={0.4} bokeh={12} showPromenade={false} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.94) 0%, rgba(4,6,20,0.82) 44%, rgba(4,6,20,0.3) 62%, rgba(4,6,20,0.75) 100%)'}} />
			<div style={{position: 'absolute', left: 560, top: 880}}>
				<Hospital width={360} />
			</div>
			<div style={{position: 'absolute', left: -320 + drive * 520, top: 1080}}>
				<Ambulance width={300} lights={1} seed="kl" />
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 1240, height: 8, background: withAlpha('#FFFFFF', 0.1)}} />
			<SceneTag text="KRANKENHAUS" color={RED} icon="alert" />
			<In at={2} dy={24} style={{left: LAYOUT.left, top: 378, width: LAYOUT.width}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 18}}>
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 150, lineHeight: 1, color: YELLOW, textShadow: `0 0 50px ${withAlpha(YELLOW, 0.45)}`, opacity: interpolate(frame, [atKH - 4, atKH + 4], [0.25, 1], clamp)}}>{KLINIK.count}</span>
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 44, lineHeight: 1.05, color: COLORS.text}}>
						PERSONEN IM
						<br />
						KRANKENHAUS
					</span>
				</div>
			</In>
			<div style={{position: 'absolute', left: LAYOUT.left, width: 560, top: 570, display: 'flex', flexDirection: 'column', gap: 8}}>
				{KLINIK.reasons.map((r, i) => {
					const a = i ? atWunsch : atKreis;
					const o = interpolate(frame, [a, a + 8], [0, 1], clamp);
					return (
						<div key={r} style={{display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', borderRadius: 14, background: 'rgba(8,10,28,0.94)', border: `2px solid ${withAlpha(RED, 0.8)}`, opacity: o, translate: `${(1 - o) * -30}px 0`}}>
							<svg width={34} height={34} viewBox="0 0 34 34">
								<circle cx={17} cy={11} r={7} fill="#FFFFFF" />
								<path d="M 4 32 q 13 -20 26 0 z" fill="#FFFFFF" />
							</svg>
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, color: COLORS.text}}>{r}</span>
						</div>
					);
				})}
				<div style={{display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', opacity: interpolate(frame, [atKreis, atKreis + 8], [0, 1], clamp)}}>
					<Chip kind="LAUT CONDOR" size={14} />
					<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 21, color: COLORS.textMuted}}>{KLINIK.reasonsBy}</span>
				</div>
				<div style={{display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', opacity: interpolate(frame, [atWunsch + 6, atWunsch + 14], [0, 1], clamp)}}>
					<Chip kind="LAUT FRAPORT" size={14} />
					<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 21, color: COLORS.textMuted}}>{KLINIK.perFlight}</span>
				</div>
			</div>
			<In at={atRest} dy={24} style={{left: LAYOUT.left, top: 812, width: 560}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 16, background: 'rgba(8,10,28,0.94)', border: `2.5px solid ${GREEN}`}}>
					<P2Icon name="check" size={34} color={GREEN} stroke={3.2} />
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, lineHeight: 1.1, color: COLORS.text}}>{KLINIK.rest}</span>
				</div>
			</In>
			<IllustrationMark top={1252} />
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="softImpact" at={atKH} volume={0.5} />
			<Sfx name="pop" at={atKreis} volume={0.4} />
			<Sfx name="pop" at={atWunsch} volume={0.4} />
			<Sfx name="pop" at={atRest} volume={0.4} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 7: Ursache – Verdacht, nicht bestätigt */

const CruiseShip: React.FC<{width: number}> = ({width}) => {
	const frame = useCurrentFrame();
	const bob = Math.sin(frame / 14) * 3;
	return (
		<svg width={width} height={width * 0.5} viewBox="0 0 300 150" style={{overflow: 'visible'}}>
			<g transform={`translate(0 ${bob})`}>
				<path d="M 10 90 L 290 90 L 262 130 L 34 130 Z" fill="#EEF1F8" stroke="#0B1029" strokeWidth={3} />
				<rect x={60} y={58} width={190} height={32} fill="#DDE2EE" stroke="#0B1029" strokeWidth={3} />
				<rect x={90} y={34} width={130} height={24} fill="#C9D0E2" stroke="#0B1029" strokeWidth={3} />
				{new Array(9).fill(0).map((_, i) => (
					<rect key={i} x={70 + i * 20} y={66} width={12} height={12} rx={2} fill="#2C3A66" />
				))}
				<rect x={190} y={14} width={22} height={20} fill="#2E3A6E" stroke="#0B1029" strokeWidth={3} />
			</g>
			<path d={`M 0 ${136 + bob * 0.5} q 25 -8 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0`} fill="none" stroke={withAlpha(CYAN, 0.7)} strokeWidth={4} />
		</svg>
	);
};

export const UrsacheScene: React.FC<SceneProps> = ({cues}) => {
	const frame = useCurrentFrame();
	const e2 = cue(cues, 'e2', 30);
	const e3 = cue(cues, 'e3', 90);
	const atNoro = wordFrame(cues, 'Norovirus-Verdacht', e2.from + 6) - 6;
	const atBest = wordFrame(cues, 'bestätigt', atNoro + 10) - 4;
	const atCharter = Math.max(atBest + 10, wordFrame(cues, 'Charterflüge', e3.from + 6) - 6);
	const atHs = wordFrame(cues, 'hessenschau', atCharter + 10) - 6;
	const q = useSpring(2, 12, 170);
	const stamp = useSpring(atBest, 12, 200);
	const noro = interpolate(frame, [atNoro, atNoro + 10], [0, 1], clamp);
	return (
		<AbsoluteFill style={{backgroundColor: '#0A0E26', overflow: 'hidden'}}>
			<AbsoluteFill style={{background: `radial-gradient(ellipse 70% 45% at 50% 40%, ${withAlpha(SICK, 0.1)} 0%, rgba(0,0,0,0) 70%)`}} />
			{/* schwebende Symbole (gestrichelt = Verdacht) */}
			{[0, 1, 2, 3, 4].map((i) => (
				<div key={i} style={{position: 'absolute', left: 120 + i * 190, top: 980 + Math.sin(frame / 22 + i) * 24 + (i % 2) * 90, opacity: 0.25 + 0.5 * noro}}>
					<VirusGlyph size={70 + (i % 3) * 20} spin={frame * (i % 2 ? 0.6 : -0.5)} dashed color={SICK} />
				</div>
			))}
			<SceneTag text="URSACHE" color={AMBER} icon="info" />
			<div style={{position: 'absolute', left: LAYOUT.left, top: 380, display: 'flex', alignItems: 'center', gap: 20}}>
				<div style={{scale: String(0.6 + 0.4 * q), opacity: Math.min(1, q * 1.6)}}>
					<Microscope size={190} />
				</div>
				<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 170, lineHeight: 1, color: AMBER, opacity: Math.min(1, q * 1.6), rotate: `${Math.sin(frame / 16) * 4}deg`}}>?</div>
			</div>
			<div style={{position: 'absolute', left: LAYOUT.left + 420, top: 410, opacity: noro, translate: `${(1 - noro) * 30}px 0`}}>
				<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 62, color: COLORS.text}}>{URSACHE.question}</div>
				<div style={{display: 'flex', gap: 8, alignItems: 'center', marginTop: 4}}>
					<Chip kind="VERDACHT" size={14} />
					<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 21, color: COLORS.textMuted}}>{URSACHE.reportBy}</span>
				</div>
			</div>
			<div style={{position: 'absolute', left: LAYOUT.left + 420, top: 548, opacity: Math.min(1, stamp * 1.7), scale: String(1.4 - 0.4 * stamp)}}>
				<div style={{padding: '8px 20px', borderRadius: 14, border: `5px solid ${ACCENT.no}`, background: 'rgba(8,10,28,0.95)', rotate: '-5deg', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, color: ACCENT.no, whiteSpace: 'nowrap'}}>{URSACHE.stamp}</div>
			</div>
			{/* Hinweise aus der Recherche */}
			<In at={atCharter} dx={-40} dy={0} style={{left: LAYOUT.left, top: 650, width: LAYOUT.width}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 16px', borderRadius: 16, background: 'rgba(8,10,28,0.94)', border: `2.5px solid ${CYAN}`}}>
					<CruiseShip width={170} />
					<div>
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, lineHeight: 1.1, color: COLORS.text}}>{URSACHE.cruise}</div>
						<Chip kind="LAUT CONDOR" size={14} style={{marginTop: 6}} />
					</div>
				</div>
			</In>
			<In at={atHs} dx={40} dy={0} style={{left: LAYOUT.left, top: 812, width: LAYOUT.width}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 16px', borderRadius: 16, background: 'rgba(8,10,28,0.94)', border: '2.5px solid #B794F6'}}>
					<P2Icon name="clock" size={44} color="#B794F6" />
					<div>
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, lineHeight: 1.1, color: COLORS.text}}>{URSACHE.before}</div>
						<div style={{display: 'flex', gap: 8, alignItems: 'center', marginTop: 6}}>
							<Chip kind="BERICHT" size={14} />
							<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 21, color: COLORS.textMuted}}>{URSACHE.beforeBy}</span>
						</div>
					</div>
				</div>
			</In>
			<Note text={URSACHE.unclear} top={1230} icon="alert" opacity={interpolate(frame, [atBest + 4, atBest + 12], [0, 1], clamp)} />
			<IllustrationMark top={1180} />
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="tick" at={2} volume={0.4} />
			<Sfx name="pop" at={atNoro} volume={0.45} />
			<Sfx name="stamp" at={atBest} volume={0.5} />
			<Sfx name="pop" at={atCharter} volume={0.4} />
			<Sfx name="pop" at={atHs} volume={0.4} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 8: Gesundheitsamt */

export const AmtScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const f1 = cue(cues, 'f1', 0);
	const atAmt = Math.max(2, wordFrame(cues, 'Gesundheitsamt', f1.from) - 6);
	const atKlaer = wordFrame(cues, 'klären', atAmt + 20) - 6;
	const f2 = cue(cues, 'f2', atKlaer + 40);
	const atErg = Math.max(atKlaer + 10, wordFrame(cues, 'Ergebnis', f2.from) - 4);
	const res = useSpring(atErg, 12, 200);
	const link = interpolate(frame, [atKlaer - 6, atKlaer + 18], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const pull = interpolate(frame, [0, durationInFrames], [0, 1], clamp);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{scale: String(1.08 - pull * 0.06), transformOrigin: '50% 80%'}}>
				<NightCity mood={MOODS.calm} progress={0.5 + pull * 0.2} litRatio={0.45} bokeh={12} showPromenade={false} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.94) 0%, rgba(4,6,20,0.8) 46%, rgba(4,6,20,0.4) 64%, rgba(4,6,20,0.8) 100%)'}} />
			<div style={{position: 'absolute', left: 520, top: 940, opacity: interpolate(frame, [atAmt, atAmt + 10], [0.3, 1], clamp)}}>
				<OfficeBuilding width={400} label={AMT.building} />
			</div>
			<SceneTag text="BEHÖRDE" color={GREEN} icon="doc" />
			<In at={atAmt} dy={24} style={{left: LAYOUT.left, top: 378, width: LAYOUT.width}}>
				<Card color={GREEN} style={{padding: '12px 18px'}} glow={0.3}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, color: COLORS.text}}>{AMT.label}</div>
					<div style={{display: 'flex', gap: 8, alignItems: 'center', marginTop: 6}}>
						<Chip kind="LAUT CONDOR" size={14} />
						<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 21, color: COLORS.textMuted}}>{AMT.by}</span>
					</div>
					<div style={{display: 'flex', gap: 8, alignItems: 'center', marginTop: 4, opacity: interpolate(frame, [atKlaer, atKlaer + 8], [0, 1], clamp)}}>
						<Chip kind="LAUT CONDOR" size={14} />
						<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 21, color: COLORS.textMuted}}>{AMT.cruise}</span>
					</div>
				</Card>
			</In>
			<div style={{position: 'absolute', left: LAYOUT.left + 10, top: 560, opacity: interpolate(frame, [atAmt + 6, atAmt + 16], [0, 1], clamp), rotate: '-3deg'}}>
				<CaseFile width={460} link={link} labels={[FLIGHTS[0].no, FLIGHTS[1].no]} />
			</div>
			<div style={{position: 'absolute', left: LAYOUT.left + 40, top: 900, opacity: Math.min(1, res * 1.7), scale: String(1.3 - 0.3 * res)}}>
				<div style={{padding: '8px 20px', borderRadius: 14, border: `4px solid ${AMBER}`, background: 'rgba(8,10,28,0.95)', rotate: '-3deg', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 32, color: AMBER, whiteSpace: 'nowrap'}}>{AMT.result}</div>
			</div>
			<Note text={AMT.link} top={1232} icon="info" opacity={interpolate(frame, [atKlaer + 8, atKlaer + 16], [0, 1], clamp)} />
			<IllustrationMark top={1190} />
			<Sfx name="whoosh" at={0} volume={0.35} />
			<Sfx name="paper" at={atAmt + 6} volume={0.45} />
			<Sfx name="tick" at={atKlaer} volume={0.4} />
			<Sfx name="stamp" at={atErg} volume={0.4} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ Szene 9: Abo-Aufruf (neuer Kanalname) */

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
	const planes = useMemo(() => [0, 1], []);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{scale: String(1.15 - pull * 0.15), transformOrigin: '50% 70%'}}>
				<NightCity mood={MOODS.dusk} progress={pull} litRatio={0.42} showMoon bokeh={16} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.9) 0%, rgba(4,6,20,0.6) 50%, rgba(4,6,20,0.5) 75%, rgba(4,6,20,0.8) 100%)'}} />
			{planes.map((i) => (
				<div key={i} style={{position: 'absolute', left: -200 + ((frame * (2.2 + i)) % 1500), top: 260 + i * 90, opacity: 0.35}}>
					<PlaneIcon size={46 - i * 12} color="#FFFFFF" />
				</div>
			))}
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
