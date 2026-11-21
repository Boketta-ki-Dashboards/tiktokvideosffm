import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Camera} from '../../../../components/camera/Camera';
import {KineticText} from '../../../../components/text/KineticText';
import {clamp, springIn} from '../../../../lib/animation';
import {withAlpha} from '../../../../lib/color';
import {COLORS, FONTS} from '../../../../theme/tokens';
import {cue, type SceneProps, wordFrame} from '../../../frankfurt-2026-10-31/cues';
import {QUESTION} from '../../content';
import {GlassCard, Icon, type IconName, SectionLabel, StatusRow} from '../kit';
import {MOODS, NightCity} from '../NightCity';
import {Legibility} from '../Studio';

const OPTIONS: Array<{color: string; deep: string; icon: IconName; letter: string}> = [
	{color: '#3DDC97', deep: '#14905E', icon: 'wave', letter: 'A'},
	{color: '#FF5A6A', deep: '#B0263A', icon: 'flame', letter: 'B'},
];

/** Große Antwortkarte (Kommentar-Impuls, keine echte Abstimmung). */
const AnswerCard: React.FC<{text: string; i: number; at: number}> = ({text, i, at}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	if (frame < at) return null;
	const o = OPTIONS[i];
	const s = springIn({frame, fps, delay: at, damping: 12, stiffness: 160});
	const pulse = 1 + Math.sin((frame - at) / 7) * 0.012;
	const shine = interpolate(frame, [at + 6, at + 30], [-30, 140], clamp);
	return (
		<div style={{scale: String((0.6 + 0.4 * s) * pulse), opacity: Math.min(1, s * 2), translate: `${(1 - s) * (i === 0 ? -120 : 120)}px 0`}}>
			<div
				style={{
					position: 'relative',
					overflow: 'hidden',
					display: 'flex',
					alignItems: 'center',
					gap: 22,
					padding: '22px 28px',
					borderRadius: 30,
					background: `linear-gradient(160deg, ${o.color} 0%, ${o.deep} 100%)`,
					boxShadow: `0 6px 0 ${withAlpha('#000000', 0.35)}, 0 26px 60px rgba(0,0,0,0.5), 0 0 40px ${withAlpha(o.color, 0.3)}`,
					border: '3px solid rgba(255,255,255,0.35)',
				}}
			>
				<div style={{width: 84, height: 84, borderRadius: 24, background: '#0B1029', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 46, color: o.color}}>{o.letter}</div>
				<span style={{flex: 1, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 58, lineHeight: 1.05, color: '#0B1029'}}>{text}</span>
				<Icon name={o.icon} size={64} color="#0B1029" stroke={2.6} />
				<div style={{position: 'absolute', top: -40, bottom: -40, left: `${shine}%`, width: 120, rotate: '18deg', background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.45), rgba(255,255,255,0))'}} />
			</div>
		</div>
	);
};

/** Premium-Szene 7 – Community-Frage: Skyline-Push-in, kinetischer Titel, Einschätzung, zwei Antwortkarten, Kommentar-Hinweis. */
export const QuestionPremium: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const e = cue(cues, 'end1', 6);
	const atCalm = wordFrame(cues, 'ruhiger', e.from + 30);
	const atReal = wordFrame(cues, 'Realistisch', atCalm + 15);
	const atEsc = wordFrame(cues, 'Eskalation', atReal + 15);
	const atComments = wordFrame(cues, 'Kommentare', e.to - 15);
	const optAt = [atReal - 2, atEsc - 2];
	const progress = interpolate(frame, [0, durationInFrames], [0, 1], clamp);
	const hint = springIn({frame, fps, delay: atComments - 4, damping: 12, stiffness: 170});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night}}>
			<Camera keyframes={[{frame: 0, zoom: 1.16, y: 50}, {frame: durationInFrames, zoom: 1.02, y: 0}]}>
				<NightCity mood={MOODS.dusk} progress={progress} litRatio={0.34} />
			</Camera>
			<Legibility topStrength={0.9} subtitleBand={0.3} />

			<div style={{position: 'absolute', left: 64, top: 200}}>
				<SectionLabel text="UNSERE EINSCHÄTZUNG" color={COLORS.signal} />
			</div>
			<div style={{position: 'absolute', left: 64, top: 290, width: 866}}>
				<KineticText text={QUESTION.title} highlight={['20.11.']} fontSize={100} delay={e.from} stagger={3} maxWidth={866} lineHeight={1.0} />
			</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 520}}>
				<StatusRow kind="EINSCHÄTZUNG" text="Könnte deutlich ruhiger werden – keine Garantie" at={atCalm - 4} />
			</div>

			<div style={{position: 'absolute', left: 64, width: 866, top: 690, display: 'flex', flexDirection: 'column', gap: 26}}>
				{QUESTION.options.map((o, i) => (
					<AnswerCard key={o} text={o} i={i} at={optAt[i]} />
				))}
			</div>

			{frame >= atComments - 4 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 1030, display: 'flex', justifyContent: 'center', scale: String(0.7 + 0.3 * hint), opacity: Math.min(1, hint * 2)}}>
					<GlassCard padding="16px 28px" style={{borderRadius: 999}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
							<Icon name="chat" size={44} color={COLORS.signal} stroke={2.4} />
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, color: COLORS.text}}>{QUESTION.hint}</span>
							<div style={{display: 'flex', gap: 6}}>
								{[0, 1, 2].map((k) => (
									<div key={k} style={{width: 10, height: 10, borderRadius: 5, background: COLORS.signal, opacity: 0.35 + 0.65 * ((Math.sin((frame - k * 4) / 4) + 1) / 2)}} />
								))}
							</div>
						</div>
					</GlassCard>
				</div>
			) : null}
		</AbsoluteFill>
	);
};
