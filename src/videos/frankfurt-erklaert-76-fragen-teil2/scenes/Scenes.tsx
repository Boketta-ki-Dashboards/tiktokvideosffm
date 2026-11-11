import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {clamp, EASE_IN_OUT, EASE_OUT, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {handleWithAt} from '../../../theme/brand';
import {COLORS, FONTS} from '../../../theme/tokens';
import {BrandAvatar} from '../../../formats/frankfurt-erklaert/Branding';
import {Equation, Pop, SourceBar} from '../../../formats/frankfurt-erklaert/components';
import {ACCENT, FORMAT} from '../../../formats/frankfurt-erklaert/theme';
import {IsoCity} from '../../../formats/frankfurt-erklaert/visuals/IsoCity';
import {CalendarSheet, FeedPhone, Landtag} from '../../../formats/frankfurt-erklaert/visuals/Politics';
import {Icon, type IconName} from '../../frankfurt-2026-11-20-ausblick/premium/kit';
import {blendMood, MOODS, NightCity} from '../../frankfurt-2026-11-20-ausblick/premium/NightCity';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {ATTRIB, CONTRO, COVER, CTA, NOV20, NUMBERS, POLICE, STAND, STATUS, TIKTOK} from '../content';

/** Farben der vier Fragen (wie in Teil 1). */
export const QCOLOR = {'01': ACCENT.info, '02': ACCENT.no, '03': ACCENT.law, '04': ACCENT.signal} as const;
const de = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/** Zahl, die von `from` auf `to` rollt (Tausenderpunkt), mit Leuchten. */
const RollNumber: React.FC<{from: number; to: number; at: number; dur?: number; size: number; color: string}> = ({from, to, at, dur = 18, size, color}) => {
	const frame = useCurrentFrame();
	const v = interpolate(frame, [at, at + dur], [from, to], {...clamp, easing: EASE_OUT});
	const settle = interpolate(frame, [at + dur - 2, at + dur + 6], [0, 1], clamp);
	return (
		<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: size, lineHeight: 0.9, letterSpacing: -size * 0.04, color, fontVariantNumeric: 'tabular-nums', textShadow: `0 0 ${30 + 30 * Math.sin(settle * Math.PI)}px ${withAlpha(color, 0.6)}, 0 18px 50px rgba(0,0,0,0.6)`}}>
			{de(v)}
		</span>
	);
};

const Tag: React.FC<{num: keyof typeof QCOLOR; text: string; at?: number}> = ({num, text, at = 0}) => (
	<Pop at={at} dy={20}>
		<div style={{display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 14px 6px 6px', borderRadius: 12, background: 'rgba(8,10,28,0.88)', border: `2px solid ${QCOLOR[num]}`}}>
			<span style={{padding: '2px 10px', borderRadius: 8, background: QCOLOR[num], fontFamily: FONTS.heading, fontWeight: 900, fontSize: 24, color: ACCENT.ink}}>{num}</span>
			<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 24, letterSpacing: 1.5, color: COLORS.text}}>{text}</span>
		</div>
	</Pop>
);

const Status: React.FC<{kind: 'OFFEN' | 'TEILWEISE' | 'ANGEKÜNDIGT' | 'OFFIZIELL'; size?: number}> = ({kind, size = 22}) => {
	const c = {OFFEN: ACCENT.no, TEILWEISE: ACCENT.signal, ANGEKÜNDIGT: '#FFB15C', OFFIZIELL: ACCENT.info}[kind];
	return <span style={{display: 'inline-block', padding: `${size * 0.2}px ${size * 0.5}px`, borderRadius: size * 0.4, background: withAlpha(c, 0.18), border: `2px solid ${c}`, fontFamily: FONTS.heading, fontWeight: 900, fontSize: size, letterSpacing: 1.5, color: c}}>{kind}</span>;
};

const Headline: React.FC<{lines: string[]; at?: number; color?: string; size?: number}> = ({lines, at = 0, color = COLORS.text, size = 60}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = springIn({frame, fps, delay: at, damping: 15, stiffness: 180});
	return (
		<div style={{opacity: Math.min(1, s * 2), translate: `${(1 - s) * -40}px 0`}}>
			{lines.map((l, i) => (
				<div key={l} style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: size, lineHeight: 1.02, color: i === lines.length - 1 ? color : COLORS.text, textShadow: '0 8px 30px rgba(0,0,0,0.75)'}}>
					{l}
				</div>
			))}
		</div>
	);
};

const NightBg: React.FC<{progress: number; alert?: number}> = ({progress, alert = 0.3}) => (
	<>
		<NightCity mood={blendMood(MOODS.dusk, MOODS.alert, alert)} progress={progress} litRatio={0.4} bokeh={12} showPromenade={false} />
		<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.93) 0%, rgba(4,6,20,0.6) 32%, rgba(4,6,20,0.35) 60%, rgba(4,6,20,0.75) 100%)'}} />
	</>
);

/**
 * Titelbild Teil 2 (Video-Frame 0 und PNG): Landtag hinten, Skyline vorne, große 76, „76 FRAGEN – ERSTE ANTWORTEN“.
 * `morph` 0 → 1: die 76 verwandelt sich in die Zahlenkarten 181 VERLETZTE und 73 TATVERDÄCHTIGE.
 */
export const Teil2Cover: React.FC<{morph?: number; morphAt?: number; thumbnail?: boolean}> = ({morph = 0, morphAt = 0, thumbnail = false}) => {
	const m = interpolate(morph, [0, 1], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const cardOffset = (side: -1 | 1) => `${side * (1 - m) * 160}px ${(1 - m) * 60}px`;
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse 120% 60% at 50% 40%, #2A2766 0%, #0E1236 55%, #05071A 100%)'}} />
			<AbsoluteFill>
				<NightCity mood={blendMood(MOODS.dusk, MOODS.alert, 0.3)} progress={0.5 + m * 0.1} litRatio={0.42} bokeh={10} showPromenade={false} />
			</AbsoluteFill>
			<div style={{position: 'absolute', left: 170, top: 560 + m * 40, opacity: 0.95 - m * 0.25, scale: String(1 - m * 0.08), WebkitMaskImage: 'linear-gradient(#000 78%, transparent 100%)', maskImage: 'linear-gradient(#000 78%, transparent 100%)'}}>
				<Landtag width={740} />
				<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(rgba(14,18,54,0.35), rgba(14,18,54,0.1))'}} />
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 1000, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 800, fontSize: 24, letterSpacing: 3, color: withAlpha('#FFFFFF', thumbnail ? 0.85 : 0), textShadow: '0 4px 16px rgba(0,0,0,0.9)'}}>HESSISCHER LANDTAG · WIESBADEN</div>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.95) 0%, rgba(4,6,20,0.35) 18%, rgba(4,6,20,0) 30%, rgba(4,6,20,0) 52%, rgba(4,6,20,0.8) 68%, rgba(4,6,20,0.95) 100%)'}} />
			{/* Serienbranding */}
			<div style={{position: 'absolute', left: 64, top: 210, display: 'flex', alignItems: 'center', gap: 14, opacity: 1 - m}}>
				<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 62, lineHeight: 0.95, color: COLORS.text}}>
					FRANKFURT
					<br />
					ERKLÄRT
				</div>
				<div style={{padding: '8px 16px', borderRadius: 10, background: ACCENT.brand, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, letterSpacing: 3, color: '#FFFFFF', alignSelf: 'flex-end'}}>{FORMAT.sub}</div>
			</div>
			{/* große 76 */}
			{m < 1 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', opacity: 1 - m, scale: String(1 - m * 0.5), fontFamily: FONTS.heading, fontWeight: 900, fontSize: 400, lineHeight: 0.9, letterSpacing: -16, color: COLORS.signal, textShadow: `0 0 70px ${withAlpha(COLORS.signal, 0.6)}, 0 30px 80px rgba(0,0,0,0.7)`}}>76</div>
			) : null}
			{/* TEIL 2 */}
			<div style={{position: 'absolute', left: 770, top: 360, rotate: '10deg', padding: '8px 16px', borderRadius: 12, background: '#FFFFFF', boxShadow: '0 12px 30px rgba(0,0,0,0.5)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, color: ACCENT.ink, opacity: 1 - m}}>{COVER.part}</div>
			{/* Zahlenkarten (aus der 76 heraus) */}
			{m > 0 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 300, display: 'flex', justifyContent: 'space-between', opacity: Math.min(1, m * 1.6)}}>
					{(
						[
							{n: NUMBERS.injured, label: 'VERLETZTE', sub: 'Polizisten', color: ACCENT.no, side: -1},
							{n: NUMBERS.suspects, label: 'TATVERDÄCHTIGE', sub: 'Stand 10.11.', color: ACCENT.signal, side: 1},
						] as const
					).map((c) => (
						<div key={c.label} style={{width: 420, padding: '20px 22px 22px', borderRadius: 28, background: 'rgba(10,12,34,0.92)', border: `3px solid ${c.color}`, boxShadow: `0 30px 60px rgba(0,0,0,0.55), 0 0 50px ${withAlpha(c.color, 0.25)}`, translate: cardOffset(c.side), display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
							<RollNumber from={76} to={c.n} at={morphAt + 4} dur={16} size={170} color={c.color} />
							<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, color: COLORS.text, marginTop: 6}}>{c.label}</div>
							<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, color: COLORS.textMuted}}>{c.sub}</div>
						</div>
					))}
				</div>
			) : null}
			{/* Titel + Untertitel (bleiben stehen) */}
			<div style={{position: 'absolute', left: 64, width: 866, top: thumbnail ? 1080 : 1010, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
				<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 64, lineHeight: 1, color: COLORS.text, textShadow: '0 8px 30px rgba(0,0,0,0.85)'}}>{COVER.title[0]}</div>
				<div style={{padding: '12px 30px 16px', borderRadius: 24, background: 'linear-gradient(160deg, #FF6A78 0%, #FF4D5E 50%, #D93448 100%)', boxShadow: '0 5px 0 #B32A3C, 0 10px 0 #8E1F2E, 0 40px 70px rgba(0,0,0,0.6)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 70, lineHeight: 1, color: '#FFFFFF'}}>{COVER.title[1]}</div>
				<div style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 34, color: COLORS.text, textShadow: '0 6px 24px rgba(0,0,0,0.85)', marginTop: 4}}>{COVER.sub}</div>
				<div style={{display: 'flex', alignItems: 'center', gap: 14, opacity: 1 - m}}>
					<BrandAvatar size={50} />
					<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 28, color: COLORS.textMuted}}>
						{COVER.date} · {handleWithAt()}
					</span>
				</div>
			</div>
		</AbsoluteFill>
	);
};

/** Szene 1 – Titelbild im Video (ab Frame 0 vollständig), 76 → 181 / 73. */
export const CoverScene: React.FC<SceneProps> = ({cues}) => {
	const frame = useCurrentFrame();
	const h2 = cue(cues, 'hook2', 42);
	const morphAt = Math.max(30, h2.from - 6);
	const morph = interpolate(frame, [morphAt, morphAt + 16], [0, 1], clamp);
	const atLandtag = wordFrame(cues, 'Landtag', h2.from + 70);
	return (
		<AbsoluteFill>
			<Teil2Cover morph={morph} morphAt={morphAt} />
			{frame >= atLandtag - 4 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 690, display: 'flex', justifyContent: 'center'}}>
					<Pop at={atLandtag - 4} dy={16}>
						<div style={{display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 18px', borderRadius: 12, background: 'rgba(8,10,28,0.9)', border: `2px solid ${ACCENT.info}`}}>
							<Icon name="columns" size={28} color={ACCENT.info} />
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, color: COLORS.text}}>INNENAUSSCHUSS · 10.11. · WIESBADEN</span>
						</div>
					</Pop>
				</div>
			) : null}
			<Sfx name="impact" at={0} volume={0.5} />
			<Sfx name="whoosh" at={morphAt - 2} volume={0.7} />
			<Sfx name="softImpact" at={morphAt + 18} volume={0.8} />
			<Sfx name="click" at={atLandtag - 4} volume={0.5} />
		</AbsoluteFill>
	);
};

/** Szene 2 – War die Polizei vorbereitet? Lagebild (Illustration), 1.300 Kräfte über den Abend, offene Frage Plünderungen. */
export const PoliceScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p1 = cue(cues, 'pol1', 4);
	const p2 = cue(cues, 'pol2', 140);
	const atForces = wordFrame(cues, '1.300', p1.from + 80);
	const atLoot = wordFrame(cues, 'geplündert', p2.from + 20);
	const play = interpolate(frame, [p1.from, p2.from], [0, 1], clamp);
	const markers = new Array(26).fill(0).map((_, i) => ({x: 120 + random(`pm-x-${i}`) * 840, y: 760 + random(`pm-y-${i}`) * 360, t: i / 26}));
	const shrink = interpolate(frame, [p2.from - 6, p2.from + 10], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const q = springIn({frame, fps, delay: atLoot - 4, damping: 10, stiffness: 200});
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{top: 120, filter: `saturate(${1 - shrink * 0.3})`}}>
				<IsoCity progress={frame / durationInFrames} crowd={30} centerY={900} seed="t2-police" />
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.95) 0%, rgba(4,6,20,0.75) 30%, rgba(4,6,20,0.1) 48%, rgba(4,6,20,0.1) 70%, rgba(4,6,20,0.7) 100%)'}} />
			{/* Einsatz-Symbole erscheinen über den Abend verteilt (Illustration, keine echten Positionen) */}
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				{markers.map((mk, i) => {
					const o = interpolate(play, [mk.t * 0.9, mk.t * 0.9 + 0.06], [0, 1], clamp);
					if (o <= 0) return null;
					return (
						<g key={i} opacity={o * (1 - shrink * 0.5)} transform={`translate(${mk.x} ${mk.y - (1 - o) * 20})`}>
							<circle r={22} fill={withAlpha(ACCENT.info, 0.18)} />
							<path d="M0 -14 L11 -9 L11 1 Q11 10 0 15 Q-11 10 -11 1 L-11 -9 Z" fill={ACCENT.info} stroke="#FFFFFF" strokeWidth={2} />
						</g>
					);
				})}
			</svg>
			<div style={{position: 'absolute', left: 64, top: 290}}>
				<Tag num="01" text="ZU FRAGE 01" />
			</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 350}}>
				<Headline lines={['WAR DIE POLIZEI', 'VORBEREITET?']} color={ACCENT.info} />
			</div>
			{/* 1.300 */}
			<div style={{position: 'absolute', left: 64, width: 866, top: 500 - shrink * 20, scale: String(1 - shrink * 0.2), transformOrigin: '0% 0%', display: 'flex', alignItems: 'flex-end', gap: 22}}>
				{frame >= atForces - 8 ? <RollNumber from={0} to={POLICE.forces} at={atForces - 8} dur={20} size={190} color={ACCENT.info} /> : null}
				{frame >= atForces ? (
					<Pop at={atForces} dy={20}>
						<div style={{paddingBottom: 18}}>
							<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, color: COLORS.text}}>{POLICE.forcesLabel}</div>
							<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 27, color: COLORS.textMuted, maxWidth: 380}}>über den Abend verteilt</div>
						</div>
					</Pop>
				) : null}
			</div>
			{/* Zeitleiste */}
			<div style={{position: 'absolute', left: 64, width: 866, top: 1110}}>
				<div style={{position: 'relative', height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.15)'}}>
					<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${play * 100}%`, borderRadius: 4, background: ACCENT.info}} />
					<div style={{position: 'absolute', left: `${play * 100}%`, top: -8, width: 24, height: 24, borderRadius: 12, translate: '-50% 0', background: '#FFFFFF', boxShadow: `0 0 20px ${ACCENT.info}`}} />
				</div>
				<div style={{display: 'flex', justifyContent: 'space-between', marginTop: 14, fontFamily: FONTS.heading, fontWeight: 800, fontSize: 24, letterSpacing: 2, color: COLORS.textMuted}}>
					{POLICE.timeline.map((t) => (
						<span key={t}>{t}</span>
					))}
				</div>
			</div>
			{/* offene Frage */}
			{frame >= atLoot - 4 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 740, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, opacity: Math.min(1, q * 2), scale: String(0.7 + 0.3 * q)}}>
					<div style={{padding: '14px 28px 18px', borderRadius: 24, background: 'linear-gradient(160deg, #FF6A78 0%, #FF4D5E 50%, #D93448 100%)', boxShadow: '0 5px 0 #B32A3C, 0 30px 60px rgba(0,0,0,0.55)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 58, lineHeight: 1.04, color: '#FFFFFF', textAlign: 'center'}}>
						WARUM TROTZDEM
						<br />
						PLÜNDERUNGEN?
					</div>
					<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
						<Status kind="OFFEN" size={26} />
						<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 27, color: COLORS.text, textShadow: '0 4px 16px rgba(0,0,0,0.9)'}}>{POLICE.openNote}</span>
					</div>
				</div>
			) : null}
			<SourceBar text={`1.300: ${ATTRIB} · Illustration`} at={atForces} />
			<Sfx name="whoosh" at={0} volume={0.5} />
			<Sfx name="softImpact" at={atForces - 8} volume={0.7} />
			<Sfx name="impact" at={atLoot - 4} volume={0.5} />
		</AbsoluteFill>
	);
};

/** Szene 3 – Die neuen Zahlen: 181 → 13 nicht dienstfähig → 73 Tatverdächtige, Anteile im Punkte-Raster (je Merkmal einzeln). */
export const NumbersScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const n1 = cue(cues, 'num1', 4);
	const n2 = cue(cues, 'num2', 150);
	const n3 = cue(cues, 'num3', 300);
	const at181 = wordFrame(cues, '181', n1.from + 30);
	const at13 = wordFrame(cues, '13', n1.from + 90);
	const at73 = wordFrame(cues, '73', n2.from + 10);
	const atTwo = wordFrame(cues, 'zwei', n2.from + 50);
	const atHalf = wordFrame(cues, 'Hälfte', n2.from + 110);
	const atQuarter = wordFrame(cues, 'Viertel', n3.from + 20);
	const toTop = interpolate(frame, [at73 - 10, at73 + 6], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const bar13 = interpolate(frame, [at13, at13 + 14], [0, 13 / 181], {...clamp, easing: EASE_OUT});
	// welches Merkmal gerade gezeigt wird (nacheinander, nicht überlagert)
	const phase = frame >= atQuarter - 2 ? 3 : frame >= atHalf - 2 ? 2 : frame >= atTwo - 2 ? 1 : 0;
	const shares = [0, Math.round(73 * NUMBERS.under21.share), Math.round(73 * 0.52), Math.round(73 * NUMBERS.frankfurt.share)];
	const colors = ['', '#FFB15C', ACCENT.law, ACCENT.info];
	const labels = ['', NUMBERS.under21.label, NUMBERS.known.label, NUMBERS.frankfurt.label];
	const phaseStart = [0, atTwo - 2, atHalf - 2, atQuarter - 2][phase];
	const fill = interpolate(frame, [phaseStart, phaseStart + 14], [0, 1], clamp);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{filter: 'blur(5px) brightness(0.5)'}}>
				<NightBg progress={frame / durationInFrames} alert={0.45} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 50% at 50% 40%, rgba(255,77,94,0.12), rgba(0,0,0,0) 70%)'}} />
			{/* 181 – groß, dann kompakt oben */}
			<div style={{position: 'absolute', left: 64, width: 866, top: interpolate(toTop, [0, 1], [330, 290]), scale: String(interpolate(toTop, [0, 1], [1, 0.42])), transformOrigin: '0% 0%'}}>
				<div style={{display: 'flex', alignItems: 'flex-end', gap: 20}}>
					<RollNumber from={76} to={NUMBERS.injured} at={2} dur={16} size={300} color={ACCENT.no} />
					<div style={{paddingBottom: 30, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 44, lineHeight: 1.05, color: COLORS.text}}>
						VERLETZTE
						<br />
						POLIZISTEN
					</div>
				</div>
			</div>
			{toTop < 1 ? (
				<div style={{position: 'absolute', left: 64, top: 600, opacity: 1 - toTop}}>
					<Pop at={6} dy={16}>
						<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
							<Status kind="OFFIZIELL" size={22} />
							<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 27, color: COLORS.text}}>laut Innenminister · Stand 10.11.2026</span>
						</div>
					</Pop>
				</div>
			) : null}
			{toTop < 1 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 670, opacity: 1 - toTop}}>
					{frame >= at13 - 4 ? (
						<Pop at={at13 - 4} dy={20}>
							<div style={{padding: '18px 22px', borderRadius: 22, background: 'rgba(10,12,34,0.92)', border: `2px solid ${withAlpha(ACCENT.no, 0.7)}`}}>
								<div style={{display: 'flex', alignItems: 'baseline', gap: 16}}>
									<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 88, color: ACCENT.no}}>{NUMBERS.unfit}</span>
									<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 36, color: COLORS.text}}>{NUMBERS.unfitLabel}</span>
								</div>
								<div style={{marginTop: 10, height: 20, borderRadius: 10, background: 'rgba(255,255,255,0.1)'}}>
									<div style={{width: `${bar13 * 100}%`, height: 20, borderRadius: 10, background: ACCENT.no}} />
								</div>
								<div style={{marginTop: 12, fontFamily: FONTS.body, fontWeight: 700, fontSize: 27, color: COLORS.textMuted}}>{NUMBERS.beforeDissolution}</div>
							</div>
						</Pop>
					) : null}
				</div>
			) : null}
			{/* kompakte Zeile oben, sobald 73 kommt */}
			{toTop > 0 ? (
				<div style={{position: 'absolute', left: 64 + 380, top: 326, opacity: toTop, fontFamily: FONTS.heading, fontWeight: 800, fontSize: 27, color: COLORS.textMuted}}>
					· {NUMBERS.unfit} bislang nicht dienstfähig
				</div>
			) : null}
			{/* 73 + Punkte-Raster */}
			{frame >= at73 - 10 ? (
				<>
					<div style={{position: 'absolute', left: 64, width: 866, top: 420, display: 'flex', alignItems: 'flex-end', gap: 20}}>
						<RollNumber from={181} to={NUMBERS.suspects} at={at73 - 10} dur={16} size={230} color={ACCENT.signal} />
						<div style={{paddingBottom: 24}}>
							<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 48, color: COLORS.text}}>{NUMBERS.suspectsLabel}</div>
							<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 27, color: COLORS.textMuted}}>{NUMBERS.suspectsNote}</div>
						</div>
					</div>
					<div style={{position: 'absolute', left: 64, top: 700, display: 'grid', gridTemplateColumns: 'repeat(13, 44px)', gap: 10}}>
						{new Array(73).fill(0).map((_, i) => {
							const lit = phase > 0 && i < shares[phase] && i / shares[phase] <= fill;
							const appear = interpolate(frame, [at73 - 6 + i * 0.4, at73 + i * 0.4], [0, 1], clamp);
							return <div key={i} style={{width: 44, height: 44, borderRadius: 22, background: lit ? colors[phase] : 'rgba(255,255,255,0.14)', boxShadow: lit ? `0 0 14px ${withAlpha(colors[phase], 0.6)}` : 'none', opacity: appear, scale: String(0.6 + 0.4 * appear)}} />;
						})}
					</div>
					{phase > 0 ? (
						<div key={phase} style={{position: 'absolute', left: 64, width: 866, top: 1060}}>
							<Pop at={phaseStart} dy={16}>
								<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
									<div style={{width: 30, height: 30, borderRadius: 15, background: colors[phase]}} />
									<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 38, color: COLORS.text}}>{labels[phase]}</span>
								</div>
							</Pop>
						</div>
					) : null}
					<div style={{position: 'absolute', left: 64 + 610, top: 1130, fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted}}>{NUMBERS.rounding}</div>
				</>
			) : null}
			<SourceBar text={`${ATTRIB} · Stand 10.11.2026`} at={at181} />
			<Sfx name="impact" at={at181 - 4} volume={0.6} />
			<Sfx name="click" at={at13 - 4} volume={0.6} />
			<Sfx name="impact" at={at73 - 10} volume={0.7} />
			{[atTwo, atHalf, atQuarter].map((f, i) => (
				<Sfx key={i} name="blip" at={f - 2} volume={0.6} />
			))}
		</AbsoluteFill>
	);
};

/** Szene 4 – TikTok: Demo-Aufrufe ≠ abgesprochene Straftaten → „bisher nicht öffentlich belegt“. */
export const TikTokScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const c = cue(cues, 'tiktok', 4);
	const atDeal = wordFrame(cues, 'Straftaten', c.from + 30);
	const atProof = Math.min(wordFrame(cues, 'belegt', c.from + 90), wordFrame(cues, 'bisher', c.from + 80));
	const stamp = springIn({frame, fps, delay: atProof - 10, damping: 9, stiffness: 220});
	const card = (title: string, text: string, color: string, icon: IconName, at: number) => (
		<Pop at={at} dy={30}>
			<div style={{padding: '18px 20px', borderRadius: 24, background: 'rgba(10,12,34,0.94)', border: `3px solid ${color}`, display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 24px 50px rgba(0,0,0,0.5)'}}>
				<div style={{width: 84, height: 84, borderRadius: 42, background: withAlpha(color, 0.2), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
					<Icon name={icon} size={50} color={color} />
				</div>
				<div>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, lineHeight: 1.05, color: COLORS.text}}>{title}</div>
					<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 27, color: COLORS.textMuted}}>{text}</div>
				</div>
			</div>
		</Pop>
	);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<NightBg progress={frame / durationInFrames} alert={0.1} />
			<div style={{position: 'absolute', left: 64, top: 290}}>
				<Tag num="03" text="ZU FRAGE 03" />
			</div>
			<div style={{position: 'absolute', left: 64, top: 350}}>
				<Headline lines={['UND TIKTOK?']} size={64} />
			</div>
			<div style={{position: 'absolute', left: 64, top: 450, rotate: '-4deg', filter: 'drop-shadow(0 30px 50px rgba(0,0,0,0.6))'}}>
				<FeedPhone width={300} scroll={interpolate(frame, [0, durationInFrames], [0, 0.5], clamp)} highlight={frame >= atDeal ? 'chat' : 'call'} />
			</div>
			<div style={{position: 'absolute', left: 400, width: 530, top: 470, display: 'flex', flexDirection: 'column', gap: 18}}>
				{card(TIKTOK.left.title, TIKTOK.left.text, ACCENT.yes, 'megaphone', 6)}
				{card(TIKTOK.right.title, TIKTOK.right.text, ACCENT.no, 'question', atDeal - 6)}
			</div>
			{frame >= atProof - 10 ? (
				<div style={{position: 'absolute', left: 400, width: 530, top: 860, display: 'flex', justifyContent: 'center', opacity: Math.min(1, stamp * 2), scale: String(1.6 - 0.6 * stamp), rotate: '-6deg'}}>
					<div style={{padding: '12px 22px 14px', border: `6px solid ${ACCENT.law}`, borderRadius: 18, background: withAlpha(ACCENT.law, 0.15), fontFamily: FONTS.heading, fontWeight: 900, fontSize: 44, lineHeight: 1.05, color: '#FFFFFF', textAlign: 'center', textShadow: '0 4px 20px rgba(0,0,0,0.7)'}}>
						{TIKTOK.stamp[0]}
						<br />
						{TIKTOK.stamp[1]}
					</div>
				</div>
			) : null}
			<SourceBar text={`${TIKTOK.note} (hr, dpa) · Feed: Beispiel, fiktiv`} at={10} />
			<Sfx name="notify" at={4} volume={0.6} />
			<Sfx name="pop" at={atDeal - 6} volume={0.6} />
			<Sfx name="stamp" at={atProof - 8} volume={0.7} />
		</AbsoluteFill>
	);
};

/** Szene 5 – 20. November: Maßnahmen angekündigt (Auflagen, Unterbindungsgewahrsam) – kein pauschales Verbot. */
export const Nov20Scene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const n1 = cue(cues, 'nov1', 4);
	const n2 = cue(cues, 'nov2', 160);
	const atMeasures = wordFrame(cues, 'Maßnahmen', n1.from + 50);
	const atAuflagen = wordFrame(cues, 'Auflagen', n1.from + 100);
	const atGewahrsam = wordFrame(cues, 'präventiver', n1.from + 130);
	const atBan = Math.min(wordFrame(cues, 'Demo-Verbot', n2.from + 20), n2.from + 4);
	const glow = 0.5 + 0.5 * Math.sin(frame / 8);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<NightBg progress={frame / durationInFrames} alert={0.2} />
			<div style={{position: 'absolute', left: 64, top: 290}}>
				<Tag num="04" text="ZU FRAGE 04 · AUSBLICK" />
			</div>
			<div style={{position: 'absolute', left: 64, top: 360, rotate: '-5deg', filter: `drop-shadow(0 0 ${20 + glow * 30}px ${withAlpha(ACCENT.signal, 0.5)})`}}>
				<Pop at={0} dy={40}>
					<CalendarSheet to={{day: NOV20.day, month: NOV20.month}} at={0} width={280} accent={ACCENT.signal} />
				</Pop>
			</div>
			<div style={{position: 'absolute', left: 400, width: 530, top: 380}}>
				{frame >= atMeasures - 6 ? <Headline lines={[...NOV20.headline]} at={atMeasures - 6} color={'#FFB15C'} size={50} /> : null}
			</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 720, display: 'flex', flexDirection: 'column', gap: 16}}>
				{NOV20.items.map((it, i) => (
					<Pop key={it.title} at={[atAuflagen, atGewahrsam][i] - 6} dy={30}>
						<div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '16px 20px', borderRadius: 22, background: 'rgba(10,12,34,0.92)', border: `2px solid ${withAlpha('#FFB15C', 0.75)}`}}>
							<div style={{width: 76, height: 76, borderRadius: 38, background: withAlpha('#FFB15C', 0.18), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
								<Icon name={it.icon} size={44} color="#FFB15C" />
							</div>
							<div style={{flex: 1}}>
								<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, color: COLORS.text}}>{it.title}</div>
								<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 27, color: COLORS.textMuted}}>{it.text}</div>
							</div>
							<Status kind="ANGEKÜNDIGT" size={20} />
						</div>
					</Pop>
				))}
			</div>
			{frame >= atBan - 6 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 1030, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
					<Pop at={atBan - 6} dy={20}>
						<div style={{display: 'inline-flex', alignItems: 'center', gap: 12, padding: '12px 24px', borderRadius: 18, background: withAlpha(ACCENT.yes, 0.16), border: `3px solid ${ACCENT.yes}`, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, color: COLORS.text}}>
							<Icon name="check" size={40} color={ACCENT.yes} />
							{NOV20.noBan}
						</div>
					</Pop>
					<Pop at={atBan + 4} dy={10}>
						<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, color: COLORS.textMuted}}>{NOV20.noBanNote}</div>
					</Pop>
				</div>
			) : null}
			<SourceBar text={`Maßnahmenbündel: ${ATTRIB}`} at={atMeasures} />
			<Sfx name="whoosh" at={0} volume={0.5} />
			<Sfx name="click" at={atAuflagen - 6} volume={0.6} />
			<Sfx name="click" at={atGewahrsam - 6} volume={0.6} />
			<Sfx name="softImpact" at={atBan - 6} volume={0.6} />
		</AbsoluteFill>
	);
};

/** Szene 6 – Kontroverse: Position des Ministers, sachlich; Verdacht ≠ Verurteilung; die meisten friedlich. */
export const ControScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const c = cue(cues, 'contro', 4);
	const n = cue(cues, 'note', 130);
	const atNote = wordFrame(cues, 'Verdächtige', n.from + 10);
	const atPeace = wordFrame(cues, 'friedlich', n.from + 60);
	const card = springIn({frame, fps, delay: c.from - 2, damping: 15, stiffness: 160});
	const slide = interpolate(frame, [atNote - 10, atNote + 6], [0, 1], {...clamp, easing: EASE_IN_OUT});
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse 120% 70% at 50% 75%, #2A2766 0%, #0E1236 55%, #05071A 100%)'}} />
			<div style={{position: 'absolute', left: 40, top: 860, scale: String(1 + (frame / durationInFrames) * 0.08), transformOrigin: '50% 100%', opacity: 0.8}}>
				<Landtag width={1000} />
			</div>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.95) 0%, rgba(4,6,20,0.75) 45%, rgba(4,6,20,0.35) 70%, rgba(4,6,20,0.7) 100%)'}} />
			{/* Nachrichtenkarte (keine Personendarstellung) */}
			<div style={{position: 'absolute', left: 64, width: 866, top: 300 - slide * 10, opacity: Math.min(1, card * 2), translate: `0 ${(1 - card) * 40}px`, scale: String(1 - slide * 0.06), transformOrigin: '50% 0%'}}>
				<div style={{padding: '22px 26px 24px', borderRadius: 28, background: 'rgba(10,12,34,0.94)', border: `2.5px solid ${withAlpha(ACCENT.law, 0.8)}`, boxShadow: '0 30px 70px rgba(0,0,0,0.55)'}}>
					<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
						<span style={{padding: '4px 12px', borderRadius: 8, background: withAlpha(ACCENT.law, 0.2), border: `2px solid ${ACCENT.law}`, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 22, letterSpacing: 2, color: ACCENT.law}}>{CONTRO.label}</span>
						<Icon name="columns" size={36} color={withAlpha('#FFFFFF', 0.5)} />
					</div>
					<div style={{marginTop: 14, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 62, lineHeight: 1, color: COLORS.text}}>{CONTRO.name}</div>
					<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 28, color: COLORS.textMuted}}>{CONTRO.role} · Innenausschuss, 10.11.</div>
					<div style={{marginTop: 18, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 44, lineHeight: 1.1, color: '#FFB15C'}}>{CONTRO.quote}</div>
					<div style={{marginTop: 6, fontFamily: FONTS.body, fontWeight: 700, fontSize: 28, color: COLORS.text}}>{CONTRO.text}</div>
					<div style={{marginTop: 12, fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, color: COLORS.textMuted}}>Hinweis: {CONTRO.hint}</div>
				</div>
			</div>
			{frame >= atNote - 6 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 800, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
					<Equation left={CONTRO.equation[0]} right={CONTRO.equation[1]} at={atNote - 6} size={56} layout="compact" leftColor={ACCENT.signal} rightColor={ACCENT.no} />
					<Pop at={Math.min(atPeace - 6, atNote + 30)} dy={20}>
						<div style={{display: 'inline-flex', alignItems: 'center', gap: 12, padding: '10px 20px', borderRadius: 16, background: 'rgba(8,10,28,0.94)', border: `2px solid ${ACCENT.yes}`, fontFamily: FONTS.heading, fontWeight: 800, fontSize: 27, color: COLORS.text}}>
							<Icon name="check" size={30} color={ACCENT.yes} />
							{CONTRO.peaceful}
						</div>
					</Pop>
				</div>
			) : null}
			<SourceBar text="Position: Innenminister (hr, dpa) · 8.000–9.000 Teilnehmende laut hr" at={c.from + 10} />
			<Sfx name="paper" at={c.from - 2} volume={0.7} />
			<Sfx name="stamp" at={atNote - 6} volume={0.6} />
			<Sfx name="pop" at={Math.min(atPeace - 6, atNote + 30)} volume={0.5} />
		</AbsoluteFill>
	);
};

/** Szene 7 – Status der vier Fragen + Frage an die Community + Profil. */
export const EndScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const c = cue(cues, 'end', 4);
	const atAsk = Math.min(wordFrame(cues, 'reichen', c.from + 50), c.from + 26);
	const ask = springIn({frame, fps, delay: atAsk - 6, damping: 13, stiffness: 180});
	const pull = interpolate(frame, [0, durationInFrames], [0, 1], {...clamp, easing: EASE_OUT});
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{scale: String(1.2 - pull * 0.2), transformOrigin: '50% 70%'}}>
				<NightCity mood={MOODS.dusk} progress={pull} litRatio={0.42} showMoon bokeh={16} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.94) 0%, rgba(4,6,20,0.7) 50%, rgba(4,6,20,0.5) 75%, rgba(4,6,20,0.75) 100%)'}} />
			<div style={{position: 'absolute', left: 64, width: 866, top: 290, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
				{STATUS.map((s, i) => (
					<Pop key={s.num} at={2 + i * 4} dy={24}>
						<div style={{height: 170, padding: '14px 16px', borderRadius: 22, background: 'rgba(10,12,34,0.93)', border: `2px solid ${withAlpha(QCOLOR[s.num as keyof typeof QCOLOR], 0.8)}`, display: 'flex', flexDirection: 'column', gap: 8}}>
							<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
								<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, color: QCOLOR[s.num as keyof typeof QCOLOR]}}>{s.num}</span>
								<Status kind={s.status} size={20} />
							</div>
							<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 27, lineHeight: 1.1, color: COLORS.text}}>{s.title}</div>
							<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted}}>{s.note}</div>
						</div>
					</Pop>
				))}
			</div>
			{frame >= atAsk - 6 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 720, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, opacity: Math.min(1, ask * 2), translate: `0 ${(1 - ask) * 40}px`}}>
					<div style={{padding: '14px 26px 18px', borderRadius: 24, background: ACCENT.brand, boxShadow: '0 30px 60px rgba(0,0,0,0.55)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 52, lineHeight: 1.05, color: '#FFFFFF', textAlign: 'center'}}>
						REICHEN EUCH
						<br />
						DIESE ANTWORTEN?
					</div>
					<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
						<BrandAvatar size={96} ring={5 + Math.sin(frame / 4) * 3} />
						<div style={{display: 'flex', flexDirection: 'column'}}>
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, color: COLORS.text}}>{handleWithAt()}</span>
							<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 22, letterSpacing: 2, color: COLORS.signal}}>
								{FORMAT.name} · {FORMAT.sub}
							</span>
						</div>
					</div>
				</div>
			) : null}
			<SourceBar text={`${CTA.title.length > 0 ? 'Status nach Berichten zur Sitzung' : ''} · ${STAND}`} at={6} />
			{[0, 1, 2, 3].map((i) => (
				<Sfx key={i} name="click" at={2 + i * 4} volume={0.5} />
			))}
			<Sfx name="pop" at={atAsk - 6} volume={0.6} />
		</AbsoluteFill>
	);
};
