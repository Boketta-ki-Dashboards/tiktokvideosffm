import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {clamp, EASE_IN_OUT, EASE_OUT, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {COLORS, FONTS} from '../../../theme/tokens';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {WHY} from '../content';
import {GlassCard, KindChip, PIcon, type PIconName, Rise, SectionLabel, SourceLine} from '../ui';
import {ZeilStreet} from '../visuals/ZeilStreet';

const CHAIN_ICONS: PIconName[] = ['person', 'alert', 'image', 'shield'];
const CYAN = '#4FC3F7';

/** Szene 2 – Warum die Kontrollen: 31.10. als Ereigniskette (offiziell) → hessenschau-Bericht + Stimmen (Bericht). */
export const WhyScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const w1 = cue(cues, 'why1', 6);
	const w2 = cue(cues, 'why2', w1.to + 6);
	const at31 = wordFrame(cues, '31', w1.from + 4);
	const chainAt = [wordFrame(cues, 'Demo', at31 + 20), wordFrame(cues, 'Ausschreitungen', at31 + 34), wordFrame(cues, 'Plünderungen', at31 + 50), wordFrame(cues, 'Polizisten', at31 + 70)];
	const atNews = wordFrame(cues, 'Seitdem', w2.from);
	const atHr = wordFrame(cues, 'hessenschau', atNews + 30);
	const atVoices = wordFrame(cues, 'Pauschalverdacht', w2.to - 30);
	const toNews = interpolate(frame, [atNews - 8, atNews + 8], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const dolly = interpolate(frame, [0, durationInFrames], [16, 30]);
	const date = springIn({frame, fps, delay: at31 - 4, damping: 13});
	const line = interpolate(frame, [chainAt[0], chainAt[3] + 6], [0, 1], {...clamp, easing: EASE_OUT});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night}}>
			<ZeilStreet dolly={dolly} pan={-1.2} people={10} officers={7} warm={0.5} blueLight={0.5} seed="why" />
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.94) 0%, rgba(4,6,20,0.75) 40%, rgba(4,6,20,0.15) 62%)'}} />
			<div style={{position: 'absolute', left: 64, top: 200}}>
				<SectionLabel num="1" text="WARUM DIE KONTROLLEN?" color={CYAN} />
			</div>

			{/* Teil 1: Ereigniskette 31.10. */}
			<div style={{position: 'absolute', left: 64, top: 300, width: 866, opacity: 1 - toNews, translate: `${-toNews * 120}px 0`}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 18, opacity: Math.min(1, date * 2), scale: String(0.85 + 0.15 * date), transformOrigin: '0 50%'}}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 96, lineHeight: 1, letterSpacing: -2, color: COLORS.text}}>{WHY.date.slice(0, 6)}</div>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 54, color: withAlpha('#FFFFFF', 0.5)}}>{WHY.date.slice(6)}</div>
					<KindChip kind="OFFIZIELL" />
				</div>
				<div style={{position: 'relative', marginTop: 40, display: 'flex', flexDirection: 'column', gap: 18}}>
					<div style={{position: 'absolute', left: 37, top: 30, width: 4, height: `${line * 82}%`, background: `linear-gradient(${CYAN}, ${COLORS.alert})`, borderRadius: 2}} />
					{WHY.chain.map((c, i) => (
						<Rise key={c.id} at={chainAt[i] - 3} dx={-40} dy={0}>
							<div style={{display: 'flex', alignItems: 'center', gap: 20}}>
								<div style={{width: 78, height: 78, borderRadius: 39, background: i === 0 ? withAlpha(CYAN, 0.25) : withAlpha(COLORS.alert, 0.22), border: `3px solid ${i === 0 ? CYAN : COLORS.alert}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 26px rgba(0,0,0,0.5)'}}>
									<PIcon name={CHAIN_ICONS[i]} size={40} color={i === 0 ? CYAN : '#FF8A94'} stroke={2.3} />
								</div>
								<GlassCard padding="14px 24px" style={{flex: 1}}>
									<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, color: COLORS.text}}>{c.label}</span>
								</GlassCard>
							</div>
						</Rise>
					))}
				</div>
			</div>
			{toNews < 0.5 ? <SourceLine text={`Quelle: ${WHY.chainSource}`} at={chainAt[1]} top={1150} /> : null}

			{/* Teil 2: Bericht hessenschau + Stimmen */}
			{toNews > 0.01 ? (
				<div style={{position: 'absolute', left: 64, top: 300, width: 866, opacity: toNews, translate: `${(1 - toNews) * 120}px 0`, display: 'flex', flexDirection: 'column', gap: 18}}>
					<Rise at={atNews - 4} dy={40}>
						<GlassCard padding="0" tone="light">
							<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', background: 'linear-gradient(90deg, #0E2A4A, #155E8A)'}}>
								<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, letterSpacing: 0.5, color: '#FFFFFF'}}>{WHY.news.outlet}</span>
								<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
									<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, color: '#CFE6FF'}}>{WHY.news.date}</span>
									<KindChip kind="BERICHT" size={20} />
								</div>
							</div>
							<div style={{padding: '18px 26px 24px'}}>
								<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, color: '#3A6A9A'}}>{WHY.news.kicker}</div>
								<div style={{marginTop: 6, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 42, lineHeight: 1.12, color: '#0B1029'}}>{WHY.news.headline}</div>
								<div style={{marginTop: 14, padding: '10px 16px', borderLeft: `5px solid ${CYAN}`, background: '#EEF4FA', fontFamily: FONTS.body, fontWeight: 700, fontStyle: 'italic', fontSize: 30, lineHeight: 1.25, color: '#22305A'}}>{WHY.news.quote}</div>
							</div>
						</GlassCard>
					</Rise>
					<div style={{display: 'flex', gap: 16}}>
						{WHY.voices.map((v, i) => (
							<Rise key={v.who} at={(i === 0 ? atVoices : atVoices + 12) - 4} dy={30} style={{flex: 1}}>
								<GlassCard padding="16px 20px" accent={i === 0 ? '#FFB15C' : '#3DDC97'}>
									<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
										<PIcon name="chat" size={30} color={i === 0 ? '#FFB15C' : '#3DDC97'} />
										<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 24, letterSpacing: 1, color: i === 0 ? '#FFB15C' : '#3DDC97'}}>{v.who.toUpperCase()}</span>
									</div>
									<div style={{marginTop: 6, fontFamily: FONTS.body, fontWeight: 800, fontSize: 30, lineHeight: 1.2, color: COLORS.text}}>{v.text}</div>
								</GlassCard>
							</Rise>
						))}
					</div>
					<Rise at={atVoices + 20} dy={20}>
						<div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderRadius: 16, background: 'rgba(8,10,28,0.8)', border: '1.5px solid rgba(255,255,255,0.14)'}}>
							<PIcon name="tv" size={28} color={COLORS.textMuted} />
							<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 23, lineHeight: 1.25, color: COLORS.textMuted}}>{WHY.tv}</span>
						</div>
					</Rise>
				</div>
			) : null}

			<Sfx name="click" at={at31 - 4} />
			{chainAt.map((f, i) => (
				<Sfx key={`c-${i}`} name="pop" at={f - 3} volume={0.7} />
			))}
			<Sfx name="paper" at={atNews - 4} />
			<Sfx name="typewriter" at={atHr} volume={0.8} />
			<Sfx name="notify" at={atVoices - 4} />
			<Sfx name="notify" at={atVoices + 8} volume={0.7} />
		</AbsoluteFill>
	);
};
