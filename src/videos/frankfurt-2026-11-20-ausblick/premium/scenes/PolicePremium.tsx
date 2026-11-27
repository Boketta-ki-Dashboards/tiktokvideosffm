import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Camera} from '../../../../components/camera/Camera';
import {clamp, EASE_IN_OUT, EASE_OUT, springIn} from '../../../../lib/animation';
import {withAlpha} from '../../../../lib/color';
import {COLORS, FONTS} from '../../../../theme/tokens';
import {cue, type SceneProps, wordFrame} from '../../../frankfurt-2026-10-31/cues';
import {POLICE} from '../../content';
import {GlassCard, Icon, Rise, SectionLabel, SourceLine, StatusRow, TYPE} from '../kit';
import {MOODS, NightCity} from '../NightCity';
import {PoliceVan} from '../PoliceVan';
import {Legibility} from '../Studio';

const BLUE = '#4F8BFF';

/** Pressezitat im Nachrichten-Look: Absender-Leiste, große Anführungszeichen, Schreibmaschinen-Aufbau. */
const QuoteCard: React.FC<{at: number; typeFrom: number}> = ({at, typeFrom}) => {
	const frame = useCurrentFrame();
	const text = `„${POLICE.quote}“`;
	const chars = Math.round(interpolate(frame, [typeFrom, typeFrom + 70], [0, text.length], clamp));
	return (
		<Rise at={at} dy={40}>
			<GlassCard padding="0" tone="light">
				<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', background: 'linear-gradient(90deg, #12204A, #1E3A8A)'}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
						<Icon name="megaphone" size={30} color="#FFFFFF" />
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, letterSpacing: 1.5, color: '#FFFFFF'}}>PRESSEMITTEILUNG</span>
					</div>
					<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, color: '#CFE0FF'}}>02.11.2026</span>
				</div>
				<div style={{position: 'relative', padding: '18px 28px 22px 28px'}}>
					<div style={{position: 'absolute', right: 18, top: -14, fontFamily: 'Georgia, serif', fontSize: 200, lineHeight: 1, color: withAlpha('#1E3A8A', 0.1)}}>”</div>
					<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 34, lineHeight: 1.25, color: '#0B1029', minHeight: 170}}>
						{text.slice(0, chars)}
						{chars < text.length ? <span style={{display: 'inline-block', width: 3, height: 34, background: '#1E3A8A', verticalAlign: 'middle', opacity: Math.floor(frame / 8) % 2}} /> : null}
					</div>
					<div style={{marginTop: 10, fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, color: '#4A5476'}}>{POLICE.quoteFrom}</div>
				</div>
			</GlassCard>
		</Rise>
	);
};

/** Vergleichsbalken ohne Zahlen: 31.10. Großaufgebot (belegt) vs. 20.11. „noch stärker“ (angekündigt, Umfang offen). */
const ForceBars: React.FC<{at: number}> = ({at}) => {
	const frame = useCurrentFrame();
	const a = interpolate(frame, [at, at + 22], [0, 1], {...clamp, easing: EASE_OUT});
	const b = interpolate(frame, [at + 10, at + 34], [0, 1], {...clamp, easing: EASE_OUT});
	const ext = interpolate(frame, [at + 30, at + 50], [0, 1], {...clamp, easing: EASE_OUT});
	const pulse = 0.6 + Math.sin(frame / 6) * 0.25;
	if (frame < at - 1) return null;
	const row = (label: string, sub: string, fill: number, extra: number, color: string) => (
		<div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
			<div style={{display: 'flex', alignItems: 'baseline', gap: 14}}>
				<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, color: COLORS.text}}>{label}</span>
				<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 26, color}}>{sub}</span>
			</div>
			<div style={{position: 'relative', height: 34, borderRadius: 17, background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.12)'}}>
				<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${fill * 64}%`, borderRadius: 17, background: `linear-gradient(90deg, ${withAlpha(color, 0.6)}, ${color})`, boxShadow: `0 0 20px ${withAlpha(color, 0.5)}`}} />
				{extra > 0 ? (
					<div style={{position: 'absolute', left: '64%', top: -2, bottom: -2, width: `${extra * 33}%`, borderRadius: 17, border: `3px dashed ${withAlpha(color, pulse)}`, background: withAlpha(color, 0.12)}} />
				) : null}
				{extra > 0.9 ? (
					<div style={{position: 'absolute', right: -6, top: -12, width: 56, height: 56, borderRadius: 28, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 24px ${withAlpha(color, 0.7)}`}}>
						<Icon name="question" size={34} color="#0B1029" stroke={3} />
					</div>
				) : null}
			</div>
		</div>
	);
	return (
		<Rise at={at} dy={30}>
			<GlassCard padding="20px 26px 24px" accent={BLUE}>
				<div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14}}>
					<Icon name="shield" size={34} color={BLUE} />
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, letterSpacing: 1.5, color: COLORS.text}}>POLIZEIAUFGEBOT</span>
				</div>
				<div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
					{row('31.10.', 'Großaufgebot', a, 0, '#7FA6E8')}
					{row('20.11.', '„noch stärker“ – angekündigt, ohne Zahl', b, ext, COLORS.cyan)}
				</div>
			</GlassCard>
		</Rise>
	);
};

/** 3D-Abreißkalender mit Ringbindung. */
const Calendar: React.FC<{at: number}> = ({at}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	if (frame < at - 1) return null;
	const s = springIn({frame, fps, delay: at, damping: 13, stiffness: 150});
	return (
		<div style={{perspective: 1200, opacity: Math.min(1, s * 2)}}>
			<div style={{width: 330, transform: `rotateY(${(1 - s) * -40}deg) rotateX(6deg)`, transformOrigin: '50% 0%', filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.55))'}}>
				<div style={{position: 'relative', height: 74, borderRadius: '24px 24px 0 0', background: 'linear-gradient(180deg, #FF5A6A, #D93448)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, letterSpacing: 4, color: '#FFFFFF'}}>
					NOVEMBER 2026
					{[70, 260].map((x) => (
						<div key={x} style={{position: 'absolute', left: x - 9, top: -22, width: 18, height: 44, borderRadius: 9, background: 'linear-gradient(90deg, #8A93B8, #E8ECF8, #8A93B8)'}} />
					))}
				</div>
				<div style={{height: 250, borderRadius: '0 0 24px 24px', background: 'linear-gradient(180deg, #FFFFFF, #E9EDF8)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden'}}>
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 170, lineHeight: 0.9, color: '#0B1029'}}>20</span>
					<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 32, letterSpacing: 3, color: '#4A5476'}}>FREITAG</span>
					<div style={{position: 'absolute', right: 0, bottom: 0, width: 70, height: 70, background: 'linear-gradient(135deg, #E9EDF8 50%, #C8CFE4 50%)', boxShadow: '-4px -4px 10px rgba(0,0,0,0.08)'}} />
				</div>
			</div>
		</div>
	);
};

/** Entscheidungs-Spur: diskutiert (erreicht) → entschieden (offen). */
const DecisionTrack: React.FC<{at: number}> = ({at}) => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [at, at + 24], [0, 1], {...clamp, easing: EASE_OUT});
	const pulse = 0.5 + (Math.sin(frame / 5) + 1) * 0.25;
	if (frame < at - 1) return null;
	const node = (label: string, done: boolean, x: string) => (
		<div style={{position: 'absolute', left: x, top: 0, translate: '-50% 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
			<div style={{width: 58, height: 58, borderRadius: 29, background: done ? COLORS.signal : 'rgba(255,255,255,0.08)', border: `3px ${done ? 'solid' : 'dashed'} ${done ? COLORS.signal : withAlpha('#FFFFFF', pulse)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: done ? `0 0 22px ${withAlpha(COLORS.signal, 0.6)}` : undefined}}>
				<Icon name={done ? 'chat' : 'question'} size={30} color={done ? '#0B1029' : '#FFFFFF'} stroke={2.6} />
			</div>
			<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, letterSpacing: 1, color: done ? COLORS.signal : COLORS.textMuted}}>{label}</span>
		</div>
	);
	return (
		<div style={{position: 'relative', width: 866, height: 108, opacity: Math.min(1, p * 2)}}>
			<div style={{position: 'absolute', left: '15%', right: '15%', top: 27, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.12)'}} />
			<div style={{position: 'absolute', left: '15%', top: 27, height: 6, width: `${p * 35}%`, borderRadius: 3, background: COLORS.signal}} />
			{node('DISKUTIERT', true, '15%')}
			{node('ENTSCHIEDEN?', false, '85%')}
		</div>
	);
};

/** Premium-Szene 3 – Polizei: Pressezitat + Balken (ohne Zahl) → Kalender + Verbotsfrage (offen) → Art. 8 GG. */
export const PolicePremium: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p1 = cue(cues, 'pol1', 6);
	const p2 = cue(cues, 'pol2', p1.to + 6);
	const p3 = cue(cues, 'pol3', p2.to + 6);
	const atForce = wordFrame(cues, 'Aufgebot', p1.from + Math.round((p1.to - p1.from) * 0.7));
	const atBan = wordFrame(cues, 'Verbot', p2.from + Math.round((p2.to - p2.from) * 0.55));
	const atOpen = wordFrame(cues, 'entschieden', atBan + 20);
	const atDeter = wordFrame(cues, 'abschrecken', p3.from + 10);
	const atGuarantee = wordFrame(cues, 'garantiert', atDeter + 15);
	const atProtest = wordFrame(cues, 'Protest', p3.to - 25);
	const toCalendar = interpolate(frame, [p2.from - 6, p2.from + 10], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const toRights = interpolate(frame, [p3.from - 6, p3.from + 10], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const progress = interpolate(frame, [0, durationInFrames], [0, 1], clamp);
	const vanX = interpolate(frame, [0, durationInFrames], [-560, 1180]);
	const ban = springIn({frame, fps, delay: atBan, damping: 10, stiffness: 190});
	const medal = springIn({frame, fps, delay: p3.from - 2, damping: 13});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night}}>
			<Camera keyframes={[{frame: 0, zoom: 1.1, y: 30, x: 20}, {frame: durationInFrames, zoom: 1.0, y: 0, x: -20}]}>
				<NightCity mood={MOODS.police} progress={progress} litRatio={0.26} emergency={0.24} emergencyColors={['#2E6BFF', '#4F8BFF']} />
			</Camera>
			<div style={{position: 'absolute', left: vanX, top: 1540}}>
				<PoliceVan width={420} />
			</div>
			<div style={{position: 'absolute', left: vanX - 470, top: 1556}}>
				<PoliceVan width={400} phase={2} />
			</div>
			<Legibility topStrength={0.92} subtitleBand={0.3} />

			<div style={{position: 'absolute', left: 64, top: 200}}>
				<SectionLabel num="2" text="ZWEITENS: DIE POLIZEI" color={BLUE} />
			</div>

			{/* Teil 1: Ankündigung */}
			<div style={{position: 'absolute', left: 64, width: 866, top: 292, display: 'flex', flexDirection: 'column', gap: 18, opacity: 1 - toCalendar, translate: `${-toCalendar * 160}px 0`}}>
				<QuoteCard at={p1.from + 4} typeFrom={p1.from + 10} />
				<ForceBars at={atForce - 6} />
				<StatusRow kind="ANGEKÜNDIGT" text="Stärkeres Aufgebot angekündigt – Umfang offen" at={atForce} size={TYPE.body} />
			</div>

			{/* Teil 2: Kalender + Verbotsfrage */}
			{toCalendar > 0.01 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, opacity: toCalendar * (1 - toRights), translate: `${(1 - toCalendar) * 160}px 0`}}>
					<Calendar at={p2.from - 4} />
					<div style={{height: 96, display: 'flex', alignItems: 'center'}}>
						{frame >= atBan ? (
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: 14,
									padding: '12px 28px',
									borderRadius: 20,
									background: 'linear-gradient(160deg, #FF6A78, #E0304A)',
									boxShadow: '0 4px 0 #A81E32, 0 24px 50px rgba(0,0,0,0.5)',
									fontFamily: FONTS.heading,
									fontWeight: 900,
									fontSize: 58,
									color: '#FFFFFF',
									rotate: `${-3 * ban}deg`,
									scale: String(1.5 - 0.5 * ban),
									opacity: Math.min(1, ban * 2),
								}}
							>
								<Icon name="scales" size={50} color="#FFFFFF" stroke={2.4} />
								{POLICE.banQuestion}
							</div>
						) : null}
					</div>
					<DecisionTrack at={atOpen - 8} />
					<div style={{alignSelf: 'stretch'}}>
						<StatusRow kind="OFFEN" text={POLICE.banStatus} at={atOpen - 4} />
					</div>
				</div>
			) : null}

			{/* Teil 3: Abschreckung offen, Versammlungsfreiheit */}
			{toRights > 0.01 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 300, display: 'flex', flexDirection: 'column', gap: 16, opacity: toRights}}>
					<div style={{display: 'flex', justifyContent: 'center', marginBottom: 6}}>
						<div style={{position: 'relative', width: 250, height: 250, scale: String(0.6 + 0.4 * medal), opacity: Math.min(1, medal * 2)}}>
							<div style={{position: 'absolute', inset: -40, borderRadius: 999, background: `radial-gradient(circle, ${withAlpha(BLUE, 0.45)} 0%, ${withAlpha(BLUE, 0)} 70%)`}} />
							<div style={{position: 'absolute', inset: 0, borderRadius: 999, background: 'linear-gradient(160deg, #2A4A9A, #0E1A48)', border: '4px solid rgba(255,255,255,0.25)', boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.2), 0 30px 60px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4}}>
								<Icon name="scales" size={110} color="#FFFFFF" stroke={1.8} />
								<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, color: COLORS.signal}}>Art. 8 GG</span>
							</div>
						</div>
					</div>
					<StatusRow kind="EINSCHÄTZUNG" text={POLICE.deterrence} at={atDeter - 4} />
					<StatusRow kind="OFFEN" text="Ob es wirkt? Weiß vorher niemand" at={atGuarantee} />
					<StatusRow kind="FAKT" text={POLICE.law} at={atProtest - 6} />
				</div>
			) : null}
			<SourceLine text={`Quellen: ${POLICE.source}`} at={p1.from + 10} top={1182} />
		</AbsoluteFill>
	);
};
