import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {clamp, EASE_IN_OUT, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {COLORS, FONTS} from '../../../theme/tokens';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {TIPS} from '../content';
import {Bubble, GlassCard, KindChip, PIcon, Rise, SectionLabel} from '../ui';
import {Officer, Youth} from '../visuals/Characters';
import {ZeilStreet} from '../visuals/ZeilStreet';

const YELLOW = '#FFD23F';

/** Szene 5 – Was sagst du bei einer Kontrolle? Ruhig bleiben, drei Sätze, Dos & Don’ts. */
export const TipsScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t1 = cue(cues, 'tip1', 6);
	const t2 = cue(cues, 'tip2', t1.to + 6);
	const t3 = cue(cues, 'tip3', t2.to + 6);
	const atCalm = wordFrame(cues, 'ruhig', t1.from + 30);
	const atQ1 = wordFrame(cues, 'Weshalb', atCalm + 15);
	const atQ2 = wordFrame(cues, 'Ist', t1.to - 60);
	const atQ3 = wordFrame(cues, 'reicht', t2.from + 10);
	const atList = t3.from - 4;
	const dosAt = [atCalm, wordFrame(cues, 'Beleidigung', t3.from + 2), wordFrame(cues, 'Gegenwehr', t3.from + 30), wordFrame(cues, 'löschen', t3.from + 55), wordFrame(cues, 'Anwalt', t3.to - 20) - 30];
	const toList = interpolate(frame, [atList - 6, atList + 10], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const dolly = interpolate(frame, [0, durationInFrames], [40, 46]);
	const calm = springIn({frame, fps, delay: atCalm - 4, damping: 12});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night}}>
			<ZeilStreet dolly={dolly} pan={-0.8} people={10} officers={0} warm={0.75} blueLight={0.1} seed="tips" />
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.94) 0%, rgba(4,6,20,0.78) 46%, rgba(4,6,20,0.2) 64%, rgba(4,6,20,0.05) 100%)'}} />
			{/* Kontrolle, ruhig: Jugendlicher + zwei Einsatzkräfte */}
			<div style={{position: 'absolute', left: 100, top: 1430}}>
				<Youth height={690} hoodie="#8B5CF6" skin="#E0B48E" calm />
			</div>
			<div style={{position: 'absolute', left: 560, top: 1450}}>
				<Officer height={650} flip gesture={0.15} />
			</div>
			<div style={{position: 'absolute', left: 770, top: 1500}}>
				<Officer height={590} flip />
			</div>

			<div style={{position: 'absolute', left: 64, top: 200}}>
				<SectionLabel num="4" text="WAS SAGST DU?" color={YELLOW} />
			</div>
			{/* „Ruhig bleiben“-Badge */}
			{frame >= atCalm - 4 ? (
				<div style={{position: 'absolute', right: 150, top: 196, scale: String(0.6 + 0.4 * calm), opacity: Math.min(1, calm * 2) * (1 - toList)}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', borderRadius: 999, background: '#3DDC97', boxShadow: '0 12px 30px rgba(0,0,0,0.45)'}}>
						<PIcon name="calm" size={30} color="#062A1A" stroke={2.6} />
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, color: '#062A1A'}}>RUHIG BLEIBEN</span>
					</div>
				</div>
			) : null}

			{/* Drei Sätze */}
			<div style={{position: 'absolute', left: 64, top: 300, width: 866, display: 'flex', flexDirection: 'column', gap: 22, opacity: 1 - toList, translate: `${-toList * 120}px 0`}}>
				{TIPS.phrases.map((p, i) => {
					const at = [atQ1, atQ2, atQ3][i] - 4;
					return (
						<Rise key={p} at={at} dx={-40} dy={0}>
							<div style={{display: 'flex', alignItems: 'flex-start', gap: 14}}>
								<div style={{width: 54, height: 54, borderRadius: 16, flexShrink: 0, background: YELLOW, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: '#0B1029', marginTop: 6}}>{i + 1}</div>
								<div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
									<Bubble tail="left" maxWidth={790} style={{fontSize: 32, padding: '14px 22px'}}>
										{p}
									</Bubble>
									<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
										<KindChip kind="TIPP" size={18} />
										<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, color: i === 2 ? YELLOW : COLORS.textMuted}}>{TIPS.phraseNotes[i]}</span>
									</div>
								</div>
							</div>
						</Rise>
					);
				})}
			</div>

			{/* Dos & Don’ts */}
			{toList > 0.01 ? (
				<div style={{position: 'absolute', left: 64, top: 300, width: 866, opacity: toList, translate: `${(1 - toList) * 120}px 0`}}>
					<GlassCard padding="22px 26px 24px" accent={YELLOW}>
						<div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16}}>
							<PIcon name="shield" size={40} color={YELLOW} />
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 38, color: COLORS.text}}>SO BLEIBST DU AUF DER SICHEREN SEITE</span>
						</div>
						<div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
							{TIPS.dos.map((d, i) => (
								<Rise key={d.text} at={Math.max(atList, dosAt[i]) - 2} dx={-40} dy={0}>
									<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
										<div style={{width: 48, height: 48, borderRadius: 24, flexShrink: 0, background: d.ok ? '#3DDC97' : COLORS.alert, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
											<PIcon name={d.ok ? 'check' : 'x'} size={28} color="#0B1029" stroke={3.2} />
										</div>
										<span style={{fontFamily: FONTS.body, fontWeight: 800, fontSize: 32, color: COLORS.text}}>{d.text}</span>
									</div>
								</Rise>
							))}
						</div>
						<div style={{marginTop: 16, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 14, background: withAlpha('#B794F6', 0.15), opacity: interpolate(frame, [dosAt[4], dosAt[4] + 10], [0, 1], clamp)}}>
							<PIcon name="scales" size={26} color="#B794F6" />
							<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 23, color: COLORS.text}}>{TIPS.basis}</span>
						</div>
					</GlassCard>
				</div>
			) : null}

			<Sfx name="pop" at={atCalm - 4} />
			<Sfx name="notify" at={atQ1 - 4} />
			<Sfx name="notify" at={atQ2 - 4} />
			<Sfx name="notify" at={atQ3 - 4} />
			<Sfx name="whoosh" at={atList - 6} volume={0.5} />
			{dosAt.slice(1).map((f, i) => (
				<Sfx key={`d-${i}`} name="click" at={Math.max(atList, f) - 2} volume={0.8} />
			))}
		</AbsoluteFill>
	);
};
