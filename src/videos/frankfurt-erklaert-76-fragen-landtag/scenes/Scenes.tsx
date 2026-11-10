import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {clamp, EASE_IN, EASE_IN_OUT, EASE_OUT, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {handleWithAt} from '../../../theme/brand';
import {COLORS, FONTS} from '../../../theme/tokens';
import {BrandAvatar, IntroSting} from '../../../formats/frankfurt-erklaert/Branding';
import {Equation, Pop, SourceBar} from '../../../formats/frankfurt-erklaert/components';
import {ACCENT, FORMAT} from '../../../formats/frankfurt-erklaert/theme';
import {BigCount, CalendarSheet, Dossier, FeedPhone, IconOrb, Landtag, QuestionNumber, questionFocus} from '../../../formats/frankfurt-erklaert/visuals/Politics';
import {Icon} from '../../frankfurt-2026-11-20-ausblick/premium/kit';
import {blendMood, MOODS, NightCity} from '../../frankfurt-2026-11-20-ausblick/premium/NightCity';
import {StreetBackdrop} from '../../frankfurt-2026-11-20-ausblick/premium/scenes/ShopsPremium';
import {Storefront} from '../../frankfurt-2026-11-20-ausblick/premium/Storefront';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {DOCS, NOTE, OUTRO, QUESTIONS, SESSION, STAND} from '../content';

const Plaque: React.FC<{lines: string[]; at: number; color?: string; size?: number}> = ({lines, at, color = ACCENT.no, size = 60}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	if (frame < at - 1) return null;
	const s = springIn({frame, fps, delay: at, damping: 11, stiffness: 200});
	return (
		<div style={{display: 'inline-block', padding: '14px 30px 18px', borderRadius: 24, background: `linear-gradient(160deg, ${withAlpha(color, 1)} 0%, ${withAlpha(color, 0.86)} 100%)`, boxShadow: `0 5px 0 ${withAlpha('#000000', 0.3)}, 0 30px 60px rgba(0,0,0,0.55)`, fontFamily: FONTS.heading, fontWeight: 900, fontSize: size, lineHeight: 1.04, color: '#FFFFFF', textAlign: 'center', opacity: Math.min(1, s * 2), scale: String(0.65 + 0.35 * s), rotate: `${-2 * s}deg`}}>
			{lines.map((l) => (
				<div key={l}>{l}</div>
			))}
		</div>
	);
};

const Scrim: React.FC<{top?: number}> = ({top = 0.92}) => <AbsoluteFill style={{background: `linear-gradient(rgba(4,6,20,${top}) 0%, rgba(4,6,20,0.55) 30%, rgba(4,6,20,0.2) 55%, rgba(4,6,20,0.55) 100%)`}} />;

/** Szene 1 – Hook: Skyline Frankfurt (Format-Intro, Datum 31.10.) → Flug nach Wiesbaden → Landtag → 76. */
export const HookScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const h2 = cue(cues, 'hook2', 58);
	const at76 = wordFrame(cues, '76', h2.from + 60);
	const atLandtag = wordFrame(cues, 'Landtag', h2.from + 105);
	const fly = interpolate(frame, [h2.from - 4, h2.from + 26], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const drift = interpolate(frame, [0, durationInFrames], [0, 1], clamp);
	const label = springIn({frame, fps, delay: atLandtag - 4, damping: 14, stiffness: 170});
	const sub = springIn({frame, fps, delay: at76 + 14, damping: 14, stiffness: 170});
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			{/* Frankfurt */}
			<AbsoluteFill style={{opacity: 1 - fly * 0.85, translate: `${-fly * 700}px ${fly * 120}px`, scale: String(1 + drift * 0.12 + fly * 0.5), transformOrigin: '50% 70%'}}>
				<NightCity mood={blendMood(MOODS.dusk, MOODS.alert, 0.35)} progress={drift} litRatio={0.38} bokeh={16} />
			</AbsoluteFill>
			{/* Wiesbaden: Landtag */}
			{fly > 0 ? (
				<AbsoluteFill style={{opacity: fly, translate: `${(1 - fly) * 600}px 0`}}>
					<AbsoluteFill style={{background: 'radial-gradient(ellipse 120% 70% at 50% 75%, #2A2766 0%, #0E1236 55%, #05071A 100%)'}} />
					{new Array(40).fill(0).map((_, i) => (
						<div key={i} style={{position: 'absolute', left: random(`st-${i}`) * 1080, top: random(`sy-${i}`) * 700, width: 3, height: 3, borderRadius: 2, background: '#FFFFFF', opacity: 0.25 + 0.5 * Math.abs(Math.sin((frame + i * 13) / 25))}} />
					))}
					<div style={{position: 'absolute', left: 50, top: 760, scale: String(1 + drift * 0.05), transformOrigin: '50% 100%'}}>
						<Landtag width={980} />
					</div>
					<div style={{position: 'absolute', left: 0, right: 0, top: 1300, height: 620, background: 'linear-gradient(#0B0E2A, #05071A)'}} />
				</AbsoluteFill>
			) : null}
			<Scrim top={0.7} />

			<IntroSting outAt={h2.from - 10} />
			{/* Datum 31.10. */}
			{fly < 1 ? (
				<div style={{position: 'absolute', left: 700, top: 300, rotate: '6deg', opacity: 1 - fly, translate: `${-fly * 300}px 0`}}>
					<CalendarSheet to={{day: '31', month: 'OKT 2026'}} at={0} width={200} />
				</div>
			) : null}

			{/* 76 */}
			<div style={{position: 'absolute', left: 64, width: 866, top: 330, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				<BigCount to={76} at={at76 - 2} duration={20} size={320} />
				{frame >= at76 + 12 ? (
					<div style={{marginTop: 6, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 60, lineHeight: 1.02, color: COLORS.text, textShadow: '0 8px 30px rgba(0,0,0,0.8)', opacity: Math.min(1, sub * 2), translate: `0 ${(1 - sub) * 30}px`}}>
						FRAGEN NACH DER
						<br />
						<span style={{color: ACCENT.no}}>KRAWALLNACHT</span>
					</div>
				) : null}
			</div>
			{frame >= atLandtag - 4 ? (
				<div style={{position: 'absolute', left: 64, top: 1130, opacity: Math.min(1, label * 2), translate: `${(1 - label) * -30}px 0`, display: 'flex', alignItems: 'center', gap: 10, padding: '8px 18px', borderRadius: 12, background: 'rgba(8,10,28,0.88)', border: `2px solid ${ACCENT.signal}`}}>
					<Icon name="columns" size={28} color={ACCENT.signal} />
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, letterSpacing: 1.5, color: COLORS.text}}>HESSISCHER LANDTAG · WIESBADEN</span>
					<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted}}>Illustration</span>
				</div>
			) : null}

			<Sfx name="whoosh" at={0} volume={0.6} />
			<Sfx name="pop" at={4} volume={0.5} />
			<Sfx name="whoosh" at={h2.from - 4} volume={0.8} />
			<Sfx name="impact" at={at76 + 18} volume={0.8} />
			<Sfx name="click" at={atLandtag - 4} volume={0.6} />
		</AbsoluteFill>
	);
};

const DocCard: React.FC<{drs: string; party: string; count: number; color: string; at: number; children?: React.ReactNode}> = ({drs, party, count, color, at, children}) => (
	<Pop at={at} dy={60}>
		<div style={{position: 'relative', padding: '18px 24px 20px', borderRadius: 24, background: 'rgba(10,12,34,0.94)', border: `2.5px solid ${withAlpha(color, 0.8)}`, boxShadow: `0 24px 60px rgba(0,0,0,0.55), 0 0 40px ${withAlpha(color, 0.18)}`}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 18}}>
				<div style={{width: 70, height: 88, borderRadius: 10, background: '#F4F1EA', position: 'relative', flexShrink: 0, boxShadow: '0 8px 20px rgba(0,0,0,0.4)'}}>
					{[18, 32, 46, 60].map((y) => (
						<div key={y} style={{position: 'absolute', left: 12, right: 12, top: y, height: 6, borderRadius: 3, background: '#B9B4A8'}} />
					))}
				</div>
				<div style={{flex: 1}}>
					<div style={{fontFamily: FONTS.body, fontWeight: 800, fontSize: 24, color: COLORS.textMuted}}>Drucksache {drs}</div>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color, lineHeight: 1.1}}>{party}</div>
				</div>
				<div style={{textAlign: 'right'}}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 84, lineHeight: 0.9, color: COLORS.text}}>{count}</div>
					<div style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 24, letterSpacing: 2, color: COLORS.textMuted}}>FRAGEN</div>
				</div>
			</div>
			{children}
		</div>
	</Pop>
);

/** Szene 2 – Zwei Berichtsanträge: 21 (Grüne) + 55 (FDP, sechs Abschnitte) = 76 → vier Themen im Video. */
export const DocsScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const d1 = cue(cues, 'docs1', 4);
	const d2 = cue(cues, 'docs2', 150);
	const atG = wordFrame(cues, 'Grünen', d1.from + 6);
	const atF = wordFrame(cues, 'FDP', d1.from + 28);
	const atSum = wordFrame(cues, 'wissen', d1.from + 50);
	const atFour = wordFrame(cues, 'Vier', d2.from);
	const max = Math.max(...DOCS.fdp.sections.map((s) => s.count));
	const sumOut = interpolate(frame, [atFour - 6, atFour + 4], [1, 0], clamp);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{filter: 'blur(6px) brightness(0.45)', scale: String(1.05 + (frame / durationInFrames) * 0.05)}}>
				<AbsoluteFill style={{background: 'radial-gradient(ellipse 120% 70% at 50% 75%, #2A2766 0%, #0E1236 55%, #05071A 100%)'}} />
				<div style={{position: 'absolute', left: 50, top: 760}}>
					<Landtag width={980} />
				</div>
			</AbsoluteFill>
			<div style={{position: 'absolute', left: 64, top: 290, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 58, lineHeight: 1.02, color: COLORS.text}}>
				ZWEI BERICHTSANTRÄGE
				<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 27, color: COLORS.textMuted, marginTop: 6}}>Fragen an die Landesregierung · Innenausschuss</div>
			</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 420}}>
				<DocCard drs={DOCS.gruene.drs} party={DOCS.gruene.party} count={DOCS.gruene.questions} color={ACCENT.yes} at={atG - 4} />
			</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 590}}>
				<DocCard drs={DOCS.fdp.drs} party={DOCS.fdp.party} count={DOCS.fdp.questions} color={ACCENT.signal} at={atF - 4}>
					<div style={{marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6}}>
						{DOCS.fdp.sections.map((s, i) => {
							const g = interpolate(frame, [atF + 4 + i * 3, atF + 16 + i * 3], [0, 1], {...clamp, easing: EASE_OUT});
							return (
								<div key={s.num} style={{display: 'flex', alignItems: 'center', gap: 10}}>
									<span style={{width: 250, fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted, whiteSpace: 'nowrap'}}>
										{s.num}. {s.title}
									</span>
									<div style={{flex: 1, height: 18, borderRadius: 9, background: 'rgba(255,255,255,0.08)'}}>
										<div style={{width: `${(s.count / max) * 100 * g}%`, height: 18, borderRadius: 9, background: ACCENT.signal}} />
									</div>
									<span style={{width: 34, textAlign: 'right', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 24, color: COLORS.text}}>{s.count}</span>
								</div>
							);
						})}
					</div>
				</DocCard>
			</div>
			{/* 21 + 55 = 76 → vier Themen */}
			{frame >= atSum - 2 && sumOut > 0 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 1060, display: 'flex', justifyContent: 'center', opacity: sumOut}}>
					<Pop at={atSum - 2} dy={30}>
						<div style={{display: 'flex', alignItems: 'baseline', gap: 18, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 72, color: COLORS.text}}>
							<span style={{color: ACCENT.yes}}>21</span>+<span style={{color: ACCENT.signal}}>55</span>=<span style={{color: ACCENT.no, textShadow: `0 0 30px ${withAlpha(ACCENT.no, 0.6)}`}}>76</span>
							<span style={{fontSize: 32, color: COLORS.textMuted}}>FRAGEN</span>
						</div>
					</Pop>
				</div>
			) : null}
			{frame >= atFour - 2 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 1060, display: 'flex', justifyContent: 'space-between'}}>
					{QUESTIONS.map((q, i) => (
						<Pop key={q.num} at={atFour - 2 + i * 4} dy={30}>
							<div style={{width: 200, padding: '10px 0 12px', borderRadius: 18, background: 'rgba(8,10,28,0.92)', border: `3px solid ${[ACCENT.info, ACCENT.no, ACCENT.law, ACCENT.signal][i]}`, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 58, color: [ACCENT.info, ACCENT.no, ACCENT.law, ACCENT.signal][i]}}>{q.num}</div>
						</Pop>
					))}
				</div>
			) : null}
			<SourceBar text={`Drucksachen 21/5450 und 21/5459 (starweb.hessen.de) · ${STAND}`} at={atG} />

			<Sfx name="paper" at={atG - 4} volume={0.8} />
			<Sfx name="paper" at={atF - 4} volume={0.8} />
			<Sfx name="softImpact" at={atSum - 2} volume={0.7} />
			{[0, 1, 2, 3].map((i) => (
				<Sfx key={i} name="click" at={atFour - 2 + i * 4} volume={0.6} />
			))}
		</AbsoluteFill>
	);
};

/** Gemeinsamer Rahmen der vier Fragen: Hintergrund tritt zurück, solange die Nummer im Vordergrund steht. */
const QuestionFrame: React.FC<{index: number; children: React.ReactNode; background: React.ReactNode; durationInFrames: number}> = ({index, children, background, durationInFrames}) => {
	const frame = useCurrentFrame();
	const q = QUESTIONS[index];
	const color = [ACCENT.info, ACCENT.no, ACCENT.law, ACCENT.signal][index];
	const focus = questionFocus(frame, 0);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{scale: String(1.04 + (frame / durationInFrames) * 0.05 - focus * 0.06), filter: `brightness(${1 - focus * 0.45})`}}>{background}</AbsoluteFill>
			<Scrim />
			{children}
			<QuestionNumber num={q.num} title={[...q.title]} at={0} color={color} />
			<SourceBar text={q.refs} at={30} />
			<Sfx name="whoosh" at={0} volume={0.6} />
			<Sfx name="softImpact" at={10} volume={0.6} />
		</AbsoluteFill>
	);
};

/** Frage 01 – Was wusste die Polizei vorher? Akte „GEFAHRENPROGNOSE“, Kalender springt auf den 31.10., Info/?/Schild, Scan. */
export const Q1Scene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const c = cue(cues, 'q1', 4);
	const atBefore = wordFrame(cues, 'vorher', c.from + 30);
	return (
		<QuestionFrame index={0} durationInFrames={durationInFrames} background={<NightCity mood={MOODS.police} progress={0.4} litRatio={0.3} bokeh={14} />}>
			<div style={{position: 'absolute', left: 64, width: 866, top: 470, display: 'flex', justifyContent: 'center', gap: 46}}>
				{(
					[
						['bulb', ACCENT.info, 'INFOS'],
						['question', ACCENT.signal, 'OFFEN'],
						['shield', ACCENT.yes, 'POLIZEI'],
					] as const
				).map(([icon, color, label], i) => (
					<IconOrb key={label} icon={icon} color={color} size={108} label={label} at={30 + i * 6} />
				))}
			</div>
			<div style={{position: 'absolute', left: 220, top: 720}}>
				<Dossier label={QUESTIONS[0].folder} at={26} width={640} scanFrom={44} badge="Fragen I.1–I.8" />
			</div>
			<div style={{position: 'absolute', left: 100, top: 690, rotate: '-8deg'}}>
				<CalendarSheet from={{day: '10', month: 'NOV'}} to={{day: '31', month: 'OKT'}} at={atBefore} width={170} />
			</div>
			<Sfx name="paper" at={26} volume={0.7} />
			<Sfx name="click" at={atBefore} volume={0.7} />
			<Sfx name="blip" at={44} volume={0.6} />
		</QuestionFrame>
	);
};

/** Frage 02 – Warum trotzdem Plünderungen? Ladenfront, Schutzschild, Fragezeichen, „TROTZ SCHUTZKONZEPT?“ */
export const Q2Scene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const c = cue(cues, 'q2', 4);
	const atLoot = wordFrame(cues, 'geplündert', c.from + 30);
	const atShield = wordFrame(cues, 'Schutzkonzept', c.from + 72);
	const shield = springIn({frame, fps, delay: atShield - 6, damping: 12, stiffness: 160});
	const crack = interpolate(frame, [atLoot, atLoot + 8], [0, 1], clamp);
	const q = springIn({frame, fps, delay: atShield + 22, damping: 9, stiffness: 200});
	const flicker = frame > atShield + 18 ? 0.55 + 0.45 * Math.abs(Math.sin(frame / 3)) : 1;
	return (
		<QuestionFrame index={1} durationInFrames={durationInFrames} background={<StreetBackdrop drift={frame / durationInFrames} />}>
			<div style={{position: 'absolute', left: 150, top: 470, width: 780}}>
				<Storefront width={780} label="STORE" motif="fashion" panes={3} seed="q2" light={0.9} upper />
				{/* stilisierte Risse im Glas (keine Personen, keine Gewalt) */}
				<svg width={780} height={700} style={{position: 'absolute', left: 0, top: 0, opacity: crack}}>
					{[
						[230, 470],
						[520, 500],
					].map(([x, y], k) => (
						<g key={k} stroke="#E9F2FF" strokeWidth={3} fill="none" opacity={0.85}>
							{new Array(7).fill(0).map((_, j) => {
								const a = (j / 7) * Math.PI * 2 + k;
								const r = 60 + random(`cr-${k}-${j}`) * 70;
								return <path key={j} d={`M${x} ${y} L${x + Math.cos(a) * r * 0.5} ${y + Math.sin(a) * r * 0.5 + 6} L${x + Math.cos(a) * r} ${y + Math.sin(a) * r}`} />;
							})}
						</g>
					))}
				</svg>
			</div>
			{/* Schutzschild */}
			{frame >= atShield - 6 ? (
				<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
					<path d="M540 470 L860 560 L860 820 Q860 1040 540 1150 Q220 1040 220 820 L220 560 Z" fill={withAlpha(ACCENT.info, 0.1 * shield)} stroke={ACCENT.info} strokeWidth={8} strokeDasharray={frame > atShield + 18 ? '30 18' : undefined} opacity={Math.min(1, shield * 1.4) * flicker} style={{scale: String(0.8 + 0.2 * shield), transformOrigin: '540px 810px'}} />
				</svg>
			) : null}
			{frame >= atShield + 22 ? (
				<div style={{position: 'absolute', left: 540, top: 760, translate: '-50% -50%', width: 190, height: 190, borderRadius: 95, background: ACCENT.no, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 150, color: '#FFFFFF', boxShadow: `0 0 60px ${withAlpha(ACCENT.no, 0.7)}`, scale: String(q), rotate: `${(1 - q) * -60}deg`}}>?</div>
			) : null}
			<div style={{position: 'absolute', left: 64, width: 866, top: 1040, display: 'flex', justifyContent: 'center'}}>
				<Plaque lines={[QUESTIONS[1].plaque]} at={atShield + 30} color={ACCENT.no} size={58} />
			</div>
			<Sfx name="click" at={atLoot} volume={0.6} />
			<Sfx name="pop" at={atShield - 6} volume={0.6} />
			<Sfx name="softImpact" at={atShield + 22} volume={0.7} />
		</QuestionFrame>
	);
};

/** Frage 03 – Welche Rolle spielte TikTok? Neutraler Feed → geteiltes Display: Demo-Aufrufe | Absprachen zu Straftaten? */
export const Q3Scene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const c = cue(cues, 'q3', 4);
	const atCall = wordFrame(cues, 'Demo-Aufrufe', c.from + 60);
	const atDeal = wordFrame(cues, 'Absprachen', c.from + 120);
	const scroll = interpolate(frame, [24, atDeal], [0, 0.55], {...clamp, easing: EASE_IN_OUT});
	const split = interpolate(frame, [atDeal - 4, atDeal + 14], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const L = springIn({frame, fps, delay: atDeal, damping: 14, stiffness: 170});
	const R = springIn({frame, fps, delay: atDeal + 8, damping: 14, stiffness: 170});
	const panel = (title: string, text: string, color: string, icon: 'megaphone' | 'question', s: number) => (
		<div style={{width: 410, height: 430, borderRadius: 28, background: 'rgba(10,12,34,0.95)', border: `3px solid ${color}`, boxShadow: `0 30px 60px rgba(0,0,0,0.5), 0 0 40px ${withAlpha(color, 0.25)}`, padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, opacity: Math.min(1, s * 2), translate: `0 ${(1 - s) * 60}px`}}>
			<div style={{width: 130, height: 130, borderRadius: 65, background: withAlpha(color, 0.2), display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<Icon name={icon} size={78} color={color} />
			</div>
			<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 36, lineHeight: 1.05, color: COLORS.text, textAlign: 'center'}}>{title}</div>
			<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 27, color: COLORS.textMuted, textAlign: 'center'}}>{text}</div>
		</div>
	);
	return (
		<QuestionFrame index={2} durationInFrames={durationInFrames} background={<NightCity mood={MOODS.calm} progress={0.6} litRatio={0.35} bokeh={20} showPromenade={false} />}>
			<div style={{position: 'absolute', left: 540 - 170, top: 450, opacity: 1 - split, scale: String(1 - split * 0.3), filter: 'drop-shadow(0 40px 60px rgba(0,0,0,0.6))'}}>
				<FeedPhone width={340} scroll={scroll} highlight={frame >= atCall ? 'call' : undefined} />
			</div>
			{split > 0 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 470, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
					{panel(QUESTIONS[2].left.title, QUESTIONS[2].left.text, ACCENT.yes, 'megaphone', L)}
					{panel(QUESTIONS[2].right.title, QUESTIONS[2].right.text, ACCENT.no, 'question', R)}
				</div>
			) : null}
			<div style={{position: 'absolute', left: 64, width: 866, top: 960, display: 'flex', justifyContent: 'center'}}>
				<Plaque lines={[...QUESTIONS[2].plaque]} at={atDeal + 30} color={ACCENT.law} size={56} />
			</div>
			<Sfx name="notify" at={30} volume={0.7} />
			<Sfx name="click" at={atCall} volume={0.7} />
			<Sfx name="whoosh" at={atDeal - 4} volume={0.6} />
			<Sfx name="softImpact" at={atDeal + 30} volume={0.6} />
		</QuestionFrame>
	);
};

/** Frage 04 – Konsequenzen: Ermittlungen · Hilfe für Läden · künftige Demos (20.11.), verbunden durch Linien. */
export const Q4Scene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const c = cue(cues, 'q4', 4);
	const at = [wordFrame(cues, 'Tatverdächtigen', c.from + 26), wordFrame(cues, 'Läden', c.from + 80), wordFrame(cues, 'Konsequenzen', c.from + 125)];
	const P = [
		{x: 290, y: 600},
		{x: 790, y: 720},
		{x: 330, y: 900},
	];
	const line = (a: number, b: number, from: number) => {
		const t = interpolate(frame, [from, from + 14], [0, 1], {...clamp, easing: EASE_OUT});
		if (t <= 0) return null;
		const x = P[a].x + (P[b].x - P[a].x) * t;
		const y = P[a].y + (P[b].y - P[a].y) * t;
		return <line x1={P[a].x} y1={P[a].y} x2={x} y2={y} stroke={ACCENT.signal} strokeWidth={5} strokeDasharray="14 12" strokeDashoffset={-frame * 2} opacity={0.85} />;
	};
	const camY = interpolate(frame, [0, durationInFrames], [20, -20], clamp);
	const items = QUESTIONS[3].items;
	return (
		<QuestionFrame index={3} durationInFrames={durationInFrames} background={<NightCity mood={MOODS.dusk} progress={0.8} litRatio={0.4} bokeh={16} />}>
			<div style={{position: 'absolute', inset: 0, translate: `0 ${camY}px`}}>
				<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
					{line(0, 1, at[1] - 6)}
					{line(1, 2, at[2] - 6)}
				</svg>
				<div style={{position: 'absolute', left: P[0].x, top: P[0].y, translate: '-50% -50%'}}>
					<IconOrb icon="scales" color={ACCENT.info} size={150} label={items[0].label} sub={items[0].sub} at={at[0] - 4} />
				</div>
				<div style={{position: 'absolute', left: P[1].x, top: P[1].y, translate: '-50% -50%'}}>
					<IconOrb icon="store" color={ACCENT.yes} size={150} label={items[1].label} sub={items[1].sub} at={at[1] - 4} />
				</div>
				{frame >= at[2] - 6 ? (
					<div style={{position: 'absolute', left: P[2].x, top: P[2].y, translate: '-50% -30%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
						<Pop at={at[2] - 6} dy={30}>
							<CalendarSheet to={{day: '20', month: 'NOV'}} at={0} width={150} accent={ACCENT.signal} />
						</Pop>
						<Pop at={at[2] - 2} dy={20}>
							<div style={{textAlign: 'center'}}>
								<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: COLORS.text}}>{items[2].label}</div>
								<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted}}>{items[2].sub}</div>
							</div>
						</Pop>
					</div>
				) : null}
			</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 1080, display: 'flex', justifyContent: 'center'}}>
				<Plaque lines={[QUESTIONS[3].plaque]} at={at[2] + 26} color={ACCENT.brand} size={52} />
			</div>
			{at.map((f, i) => (
				<Sfx key={i} name="pop" at={f - 4} volume={0.6} />
			))}
			<Sfx name="softImpact" at={at[2] + 26} volume={0.6} />
		</QuestionFrame>
	);
};

/** Szene – Heutige Sitzung: Landtag bei Nacht, Termin-Karte (geplant, keine Ergebnisse). */
export const SessionScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const c = cue(cues, 'sess', 4);
	const atAusschuss = wordFrame(cues, 'Innenausschuss', c.from + 50);
	const atTime = wordFrame(cues, '20', c.from + 150);
	const card = springIn({frame, fps, delay: c.from, damping: 15, stiffness: 150});
	const push = interpolate(frame, [0, durationInFrames], [1.0, 1.1], clamp);
	const row = (text: string, at: number, size: number, color: string, weight = 900, font: string = FONTS.heading) => (
		<Pop at={at} dy={20}>
			<div style={{fontFamily: font, fontWeight: weight, fontSize: size, lineHeight: 1.08, color}}>{text}</div>
		</Pop>
	);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse 120% 70% at 50% 75%, #2A2766 0%, #0E1236 55%, #05071A 100%)'}} />
			<div style={{position: 'absolute', left: 40, top: 800, scale: String(push), transformOrigin: '50% 100%'}}>
				<Landtag width={1000} />
			</div>
			<Scrim top={0.85} />
			<div style={{position: 'absolute', left: 64, width: 866, top: 300, opacity: Math.min(1, card * 2), translate: `0 ${(1 - card) * 40}px`}}>
				<div style={{padding: '24px 30px 26px', borderRadius: 28, background: 'rgba(8,10,28,0.9)', border: `2.5px solid ${withAlpha(ACCENT.signal, 0.7)}`, boxShadow: '0 30px 70px rgba(0,0,0,0.55)', display: 'flex', flexDirection: 'column', gap: 6}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
						<Icon name="calendar" size={44} color={ACCENT.signal} />
						{row(`${SESSION.weekday}, ${SESSION.date}`, c.from, 58, COLORS.text)}
					</div>
					{row(`${SESSION.body} · ${SESSION.number}`, atAusschuss - 4, 46, ACCENT.info)}
					{row(SESSION.time, atTime - 4, 64, ACCENT.signal)}
					{row(`${SESSION.after} · ${SESSION.room}`, atTime + 6, 27, COLORS.textMuted, 700, FONTS.body)}
					{row(SESSION.place, atTime + 10, 27, COLORS.textMuted, 700, FONTS.body)}
				</div>
				<div style={{marginTop: 18}}>
					<Pop at={atAusschuss + 10} dy={20}>
						<div style={{display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 18px', borderRadius: 14, background: withAlpha(ACCENT.law, 0.16), border: `2px solid ${ACCENT.law}`, fontFamily: FONTS.heading, fontWeight: 800, fontSize: 27, color: COLORS.text}}>
							<Icon name="board" size={30} color={ACCENT.law} />
							{SESSION.agenda}
						</div>
					</Pop>
				</div>
			</div>
			<SourceBar text={`${SESSION.source} · ${STAND}`} at={c.from + 10} />
			<Sfx name="whoosh" at={0} volume={0.6} />
			<Sfx name="click" at={atAusschuss - 4} volume={0.6} />
			<Sfx name="click" at={atTime - 4} volume={0.7} />
		</AbsoluteFill>
	);
};

/** Szene – Wichtig: bisher Fragen, noch keine Antworten. */
export const NoteScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const c = cue(cues, 'note', 4);
	const atQ = wordFrame(cues, 'Fragen', c.from + 30);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse 100% 60% at 50% 45%, #1C2258 0%, #0A0D2A 60%, #05071A 100%)'}} />
			{new Array(18).fill(0).map((_, i) => {
				const x = random(`nq-x-${i}`) * 1000;
				const y = ((random(`nq-y-${i}`) * 1600 - frame * (0.8 + random(`nq-v-${i}`))) % 1600) + 200;
				return (
					<div key={i} style={{position: 'absolute', left: x, top: y < 200 ? y + 1600 : y, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 60 + random(`nq-s-${i}`) * 80, color: withAlpha(ACCENT.info, 0.08 + random(`nq-o-${i}`) * 0.12)}}>
						?
					</div>
				);
			})}
			<div style={{position: 'absolute', left: 64, width: 866, top: 300, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 64, color: ACCENT.signal, opacity: interpolate(frame, [c.from - 4, c.from + 6], [0, 1], clamp)}}>WICHTIG</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 420, display: 'flex', justifyContent: 'center'}}>
				{frame >= atQ - 4 ? <Equation left={NOTE.equation[0]} right={NOTE.equation[1]} at={atQ - 4} size={58} leftColor={ACCENT.info} rightColor={ACCENT.no} /> : null}
			</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 920, display: 'flex', justifyContent: 'center'}}>
				<Pop at={atQ + 24} dy={20}>
					<div style={{padding: '12px 22px', borderRadius: 16, background: 'rgba(8,10,28,0.9)', border: `2px solid ${withAlpha(ACCENT.law, 0.8)}`, fontFamily: FONTS.body, fontWeight: 800, fontSize: 28, color: COLORS.text, textAlign: 'center'}}>{NOTE.line}</div>
				</Pop>
			</div>
			<SourceBar text={`Drucksachen 21/5450, 21/5459 · ${STAND}`} at={c.from + 6} />
			<Sfx name="stamp" at={atQ - 4} volume={0.6} />
			<Sfx name="click" at={atQ + 24} volume={0.5} />
			{durationInFrames > 0 ? null : null}
		</AbsoluteFill>
	);
};

/** Outro – Skyline, „FOLGT FÜR TEIL 2“, „WAS WURDE WIRKLICH BEANTWORTET?“, Profilbild + Handle. */
export const OutroScene: React.FC<SceneProps> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const pull = interpolate(frame, [0, durationInFrames], [0, 1], {...clamp, easing: EASE_OUT});
	const t1 = springIn({frame, fps, delay: 4, damping: 13, stiffness: 180});
	const t2 = springIn({frame, fps, delay: 14, damping: 13, stiffness: 180});
	const av = springIn({frame, fps, delay: 24, damping: 11, stiffness: 180});
	const sweep = interpolate(frame, [10, 36], [-30, 130], {...clamp, easing: EASE_IN});
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{scale: String(1.25 - pull * 0.25), transformOrigin: '50% 70%'}}>
				<NightCity mood={MOODS.dusk} progress={pull} litRatio={0.42} showMoon bokeh={18} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.92) 0%, rgba(4,6,20,0.6) 45%, rgba(4,6,20,0.3) 70%, rgba(4,6,20,0.6) 100%)'}} />
			<div style={{position: 'absolute', left: 64, width: 866, top: 380, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
				<div style={{position: 'relative', overflow: 'hidden', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 74, lineHeight: 1, whiteSpace: 'nowrap', color: COLORS.text, textAlign: 'center', opacity: Math.min(1, t1 * 2), translate: `0 ${(1 - t1) * 50}px`}}>
					{OUTRO.title}
					<div style={{position: 'absolute', top: 0, bottom: 0, left: `${sweep}%`, width: 120, background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.4), rgba(255,255,255,0))'}} />
				</div>
				<div style={{padding: '12px 26px', borderRadius: 16, background: ACCENT.brand, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, lineHeight: 1.1, color: '#FFFFFF', textAlign: 'center', opacity: Math.min(1, t2 * 2), scale: String(0.8 + 0.2 * t2)}}>{OUTRO.sub}</div>
				<div style={{marginTop: 30, display: 'flex', alignItems: 'center', gap: 18, opacity: Math.min(1, av * 2), scale: String(0.6 + 0.4 * av)}}>
					<BrandAvatar size={110} ring={6 + Math.sin(frame / 4) * 3} />
					<div style={{display: 'flex', flexDirection: 'column'}}>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 42, color: COLORS.text}}>{handleWithAt()}</span>
						<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 24, letterSpacing: 2, color: COLORS.signal}}>
							{FORMAT.name} · {FORMAT.sub}
						</span>
					</div>
				</div>
			</div>
			<Sfx name="pop" at={4} volume={0.6} />
			<Sfx name="pop" at={24} volume={0.5} />
		</AbsoluteFill>
	);
};
