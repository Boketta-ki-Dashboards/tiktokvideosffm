import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {clamp, EASE_IN_OUT, EASE_OUT, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {COLORS, FONTS} from '../../../theme/tokens';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {LAW} from '../content';
import {Bubble, GlassCard, KindChip, PIcon, Rise, SectionLabel} from '../ui';
import {Officer, Youth} from '../visuals/Characters';
import {ZeilStreet} from '../visuals/ZeilStreet';

const GREEN = '#3DDC97';
const BLUE = '#5A95FF';
const VIOLET = '#B794F6';

const Row: React.FC<{ok: boolean; text: string; at: number; size?: number}> = ({ok, text, at, size = 32}) => (
	<Rise at={at} dx={-40} dy={0}>
		<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
			<div style={{width: 46, height: 46, borderRadius: 23, flexShrink: 0, background: ok ? GREEN : COLORS.alert, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<PIcon name={ok ? 'check' : 'x'} size={28} color="#0B1029" stroke={3.2} />
			</div>
			<span style={{fontFamily: FONTS.body, fontWeight: 800, fontSize: size, lineHeight: 1.18, color: COLORS.text}}>{text}</span>
		</div>
	</Rise>
);

const LawCard: React.FC<{tag: string; title: string; lines: string[]; color: string; at: number; lineAt: number[]; dim: number; basis?: string; icon: 'unlock' | 'gavel'}> = ({tag, title, lines, color, at, lineAt, dim, basis, icon}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	if (frame < at - 1) return null;
	const s = springIn({frame, fps, delay: at, damping: 14, stiffness: 150});
	return (
		<div style={{flex: 1, opacity: Math.min(1, s * 1.8) * (1 - dim * 0.55), translate: `0 ${(1 - s) * 60}px`, scale: String(1 - dim * 0.04)}}>
			<GlassCard padding="0" style={{height: '100%', border: `2.5px solid ${withAlpha(color, 0.85)}`}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: `linear-gradient(90deg, ${withAlpha(color, 0.35)}, ${withAlpha(color, 0.08)})`}}>
					<div style={{width: 50, height: 50, borderRadius: 14, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: '#0B1029'}}>{tag}</div>
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 27, lineHeight: 1.05, color: COLORS.text}}>{title}</span>
					<div style={{marginLeft: 'auto'}}>
						<PIcon name={icon} size={36} color={color} />
					</div>
				</div>
				<div style={{padding: '14px 18px 18px', display: 'flex', flexDirection: 'column', gap: 10}}>
					{lines.map((l, i) =>
						frame >= lineAt[i] - 1 ? (
							<div key={l} style={{display: 'flex', gap: 10, opacity: interpolate(frame, [lineAt[i], lineAt[i] + 8], [0, 1], clamp)}}>
								<div style={{width: 10, height: 10, borderRadius: 5, marginTop: 11, flexShrink: 0, background: color}} />
								<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 27, lineHeight: 1.22, color: COLORS.text}}>{l}</span>
							</div>
						) : null,
					)}
					{basis ? <span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, color: COLORS.textMuted}}>{basis}</span> : null}
				</div>
			</GlassCard>
		</div>
	);
};

/** Szene 4 – Die Rechtslage: Identitätskontrolle ≠ Handydurchsuchung · freiwillig (A) vs. angeordnet (B) · PIN vs. Fingerabdruck (BGH). */
export const LawScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const l1 = cue(cues, 'law1', 6);
	const l2 = cue(cues, 'law2', l1.to + 6);
	const l3 = cue(cues, 'law3', l2.to + 6);
	const l4 = cue(cues, 'law4', l3.to + 6);
	const atId = wordFrame(cues, 'Identitätskontrolle', l1.from + 30);
	const atPers = wordFrame(cues, 'Personalien', atId + 30);
	const atAuto = wordFrame(cues, 'automatisch', l1.to - 20);
	const atAsk = wordFrame(cues, 'Fragt', l2.from);
	const atNo = wordFrame(cues, 'Nein', l2.to - 15);
	const atSusp = wordFrame(cues, 'Tatverdacht', l3.from + 4);
	const atEvid = wordFrame(cues, 'Beweismittel', atSusp + 30);
	const atCourt = wordFrame(cues, 'Gericht', l3.to - 70);
	const atRush = wordFrame(cues, 'Eilfällen', l3.to - 40);
	const atPin = wordFrame(cues, 'PIN', l4.from + 4);
	const atFinger = wordFrame(cues, 'Fingerabdruck', atPin + 60);
	const atBgh = wordFrame(cues, 'Bundesgerichtshof', l4.to - 25);
	const toCards = interpolate(frame, [atAsk - 8, atAsk + 8], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const toPin = interpolate(frame, [l4.from - 8, l4.from + 8], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const freeze = interpolate(frame, [atAsk + 22, atAsk + 30, atNo - 10, atNo], [0, 1, 1, 0], clamp);
	const qIn = springIn({frame, fps, delay: atAsk + 24, damping: 11, stiffness: 200});
	const dolly = interpolate(frame, [0, durationInFrames], [30, 36]);
	const bubble = springIn({frame, fps, delay: atAsk + 2, damping: 13, stiffness: 170});
	const gesture = interpolate(frame, [atAsk, atAsk + 14, atNo, atNo + 14], [0, 1, 1, 0.2], {...clamp, easing: EASE_OUT});
	const finger = springIn({frame, fps, delay: atFinger - 2, damping: 13});
	const bgh = springIn({frame, fps, delay: atBgh - 4, damping: 10, stiffness: 190});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night}}>
			<AbsoluteFill style={{filter: `saturate(${1 - freeze * 0.8}) brightness(${1 - freeze * 0.25})`}}>
				<ZeilStreet dolly={dolly} pan={1.5} people={8} officers={2} warm={0.55} blueLight={0.2} seed="law" />
				<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.95) 0%, rgba(4,6,20,0.82) 45%, rgba(4,6,20,0.25) 64%, rgba(4,6,20,0.1) 100%)'}} />
				{/* Kontrollszene (fiktiv): Jugendlicher links, Einsatzkraft rechts */}
				<div style={{position: 'absolute', left: 120, top: 1420}}>
					<Youth height={700} hoodie="#3D7BFF" phoneUp={interpolate(frame, [atAsk + 4, atAsk + 18], [0, 0.35], clamp)} calm />
				</div>
				<div style={{position: 'absolute', left: 620, top: 1400}}>
					<Officer height={720} gesture={gesture} talk={frame >= atAsk && frame < atAsk + 40} flip />
				</div>
			</AbsoluteFill>
			{freeze > 0.01 ? (
				<>
					<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 90 * freeze, background: '#000'}} />
					<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 90 * freeze, background: '#000'}} />
				</>
			) : null}

			<div style={{position: 'absolute', left: 64, top: 200, opacity: 1 - freeze}}>
				<SectionLabel num="3" text="DIE RECHTSLAGE" color={VIOLET} />
			</div>

			{/* Teil 1: Identitätskontrolle */}
			<div style={{position: 'absolute', left: 64, top: 296, width: 866, opacity: 1 - toCards, translate: `${-toCards * 120}px 0`}}>
				<Rise at={atId - 4} dy={40}>
					<GlassCard padding="20px 26px 24px" accent="#4FC3F7">
						<div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16}}>
							<PIcon name="id" size={46} color="#4FC3F7" />
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, color: COLORS.text}}>{LAW.idCheck.title}</span>
							<div style={{marginLeft: 'auto'}}>
								<KindChip kind="RECHT" size={20} />
							</div>
						</div>
						<div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
							<Row ok text={LAW.idCheck.yes[0]} at={atPers - 2} />
							<Row ok text={LAW.idCheck.yes[1]} at={atPers + 10} />
							<Row ok={false} text={LAW.idCheck.no} at={atAuto - 4} />
						</div>
						<div style={{marginTop: 16, fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, color: COLORS.textMuted}}>{LAW.idCheck.basis}</div>
					</GlassCard>
				</Rise>
			</div>

			{/* Sprechblase der Einsatzkraft */}
			{frame >= atAsk && frame < atSusp + 6 ? (
				<div style={{position: 'absolute', left: 250, top: 1190, opacity: Math.min(1, bubble * 2) * interpolate(frame, [atSusp - 6, atSusp + 6], [1, 0], clamp), scale: String(0.7 + 0.3 * bubble), transformOrigin: '90% 100%'}}>
					<Bubble tail="down-right" maxWidth={600}>
						{LAW.officerAsks}
					</Bubble>
				</div>
			) : null}

			{/* Freiwillig oder angeordnet? */}
			{freeze > 0.01 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 330, display: 'flex', justifyContent: 'center', opacity: freeze, scale: String(0.6 + 0.4 * qIn)}}>
					<div style={{padding: '18px 30px', borderRadius: 22, background: COLORS.signal, boxShadow: '0 4px 0 #D9A400, 0 8px 0 #B88A00, 0 30px 60px rgba(0,0,0,0.6)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 60, lineHeight: 1.04, color: '#0B1029', textAlign: 'center'}}>
						{LAW.question}
					</div>
				</div>
			) : null}

			{/* Teil 2: Karten A / B */}
			{toCards > 0.01 && toPin < 0.99 ? (
				<div style={{position: 'absolute', left: 64, top: 300, width: 866, display: 'flex', flexDirection: 'column', gap: 14, opacity: (1 - toPin) * (1 - freeze), translate: `${-toPin * 120}px 0`}}>
					<div style={{display: 'flex', gap: 16, alignItems: 'stretch'}}>
						<LawCard tag={LAW.cardA.tag} title={LAW.cardA.title} lines={LAW.cardA.lines} color={GREEN} at={atNo - 8} lineAt={[atNo - 6, atNo + 2]} dim={interpolate(frame, [atSusp - 4, atSusp + 8], [0, 1], clamp)} icon="unlock" />
						<LawCard tag={LAW.cardB.tag} title={LAW.cardB.title} lines={LAW.cardB.lines} color={BLUE} at={atSusp - 4} lineAt={[atSusp, atEvid, atCourt]} dim={0} basis={LAW.cardB.basis} icon="gavel" />
					</div>
					{frame >= atRush ? (
						<Rise at={atRush} dy={30}>
							<GlassCard padding="14px 20px" accent={VIOLET}>
								<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
									<PIcon name="eye" size={36} color={VIOLET} />
									<div>
										<div style={{fontFamily: FONTS.body, fontWeight: 800, fontSize: 27, lineHeight: 1.22, color: COLORS.text}}>{LAW.review}</div>
										<div style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, color: COLORS.textMuted}}>{LAW.reviewBasis}</div>
									</div>
								</div>
							</GlassCard>
						</Rise>
					) : null}
				</div>
			) : null}

			{/* Teil 3: PIN vs. Fingerabdruck */}
			{toPin > 0.01 ? (
				<div style={{position: 'absolute', left: 64, top: 300, width: 866, display: 'flex', flexDirection: 'column', gap: 18, opacity: toPin, translate: `${(1 - toPin) * 120}px 0`}}>
					<div style={{display: 'flex', gap: 16}}>
						{[
							{...LAW.pin, icon: 'pin' as const, color: GREEN, at: atPin - 2, sc: 1},
							{...LAW.finger, icon: 'fingerprint' as const, color: COLORS.signal, at: atFinger - 2, sc: finger},
						].map((t) => (
							<div key={t.title} style={{flex: 1, opacity: frame < t.at ? 0 : 1}}>
								<Rise at={t.at} dy={50}>
									<GlassCard padding="20px 20px 22px" style={{border: `2.5px solid ${withAlpha(t.color, 0.8)}`, minHeight: 330}}>
										<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, textAlign: 'center'}}>
											<div style={{width: 120, height: 120, borderRadius: 60, background: `radial-gradient(circle at 35% 30%, ${withAlpha(t.color, 0.5)}, ${withAlpha(t.color, 0.12)})`, border: `3px solid ${t.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
												<PIcon name={t.icon} size={70} color={t.color} stroke={2} />
											</div>
											<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 36, color: COLORS.text}}>{t.title}</span>
											<span style={{fontFamily: FONTS.body, fontWeight: 800, fontSize: 28, lineHeight: 1.22, color: COLORS.text}}>{t.text}</span>
										</div>
									</GlassCard>
								</Rise>
							</div>
						))}
					</div>
					{frame >= atBgh - 4 ? (
						<div style={{alignSelf: 'center', scale: String(1.5 - 0.5 * bgh), rotate: `${-3 * bgh}deg`, opacity: Math.min(1, bgh * 2)}}>
							<div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '12px 22px', borderRadius: 16, border: `4px solid ${VIOLET}`, background: 'rgba(8,10,28,0.92)'}}>
								<PIcon name="scales" size={38} color={VIOLET} />
								<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, color: COLORS.text}}>{LAW.bgh}</span>
							</div>
						</div>
					) : null}
				</div>
			) : null}

			<Sfx name="click" at={atId - 4} />
			<Sfx name="pop" at={atPers - 2} volume={0.7} />
			<Sfx name="pop" at={atPers + 10} volume={0.7} />
			<Sfx name="pop" at={atAuto - 4} volume={0.8} />
			<Sfx name="notify" at={atAsk + 2} />
			<Sfx name="softImpact" at={atAsk + 24} volume={0.9} />
			<Sfx name="pop" at={atNo - 8} />
			<Sfx name="pop" at={atSusp - 4} />
			<Sfx name="click" at={atRush} />
			<Sfx name="whoosh" at={l4.from - 8} volume={0.6} />
			<Sfx name="click" at={atPin - 2} />
			<Sfx name="click" at={atFinger - 2} />
			<Sfx name="stamp" at={atBgh - 4} volume={0.7} />
		</AbsoluteFill>
	);
};
