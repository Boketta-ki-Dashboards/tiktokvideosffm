import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {clamp, EASE_IN_OUT, EASE_OUT, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {COLORS, FONTS} from '../../../theme/tokens';
import {Studio} from '../../frankfurt-2026-11-20-ausblick/premium/Studio';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {PHONE} from '../content';
import {GlassCard, InfoRow, KindChip, PIcon, type PIconName, SectionLabel} from '../ui';
import {Phone} from '../visuals/Phone';

const ORANGE = '#FFB15C';
const TAGS: Array<{label: string; icon: PIconName; side: 'left' | 'right'; y: number; idx: number}> = [
	{label: PHONE.why[0], icon: 'search', side: 'left', y: 940, idx: 7},
	{label: PHONE.why[1], icon: 'eye', side: 'right', y: 860, idx: 4},
	{label: PHONE.why[2], icon: 'doc', side: 'right', y: 1060, idx: 6},
];

/** Szene 3 – Handy: Schilderung (nicht bestätigt) → warum Aufnahmen wichtig sind → Zeugenaufruf (freiwillig) ≠ Pflicht. */
export const PhoneScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p1 = cue(cues, 'pho1', 6);
	const p2 = cue(cues, 'pho2', p1.to + 6);
	const p3 = cue(cues, 'pho3', p2.to + 6);
	const p4 = cue(cues, 'pho4', p3.to + 6);
	const atReport = wordFrame(cues, 'Stadtverordneter', p1.from + 4);
	const atSwipe = wordFrame(cues, 'Handys', atReport + 30);
	const atConfirm = wordFrame(cues, 'bestätigt', p2.from + 10);
	const atFotos = wordFrame(cues, 'Fotos', p3.from + 6);
	const atIdent = wordFrame(cues, 'identifizieren', atFotos + 40);
	const atAppeal = wordFrame(cues, 'Zeugen', p3.to - 60);
	const atUpload = wordFrame(cues, 'hochzuladen', p3.to - 10);
	const atNeq = wordFrame(cues, 'Zeugenaufruf', p4.from + 4);
	const atLock = wordFrame(cues, 'Galerie', p4.to - 25);
	const toWhy = interpolate(frame, [p3.from - 8, p3.from + 8], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const toNeq = interpolate(frame, [atNeq - 6, atNeq + 8], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const zoom = interpolate(frame, [0, 30], [0.86, 1], {...clamp, easing: EASE_OUT});
	const swipe = interpolate(frame, [atSwipe, atSwipe + 40], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const neq = springIn({frame, fps, delay: atNeq, damping: 12, stiffness: 170});
	const drift = interpolate(frame, [0, durationInFrames], [0, -20]);

	return (
		<AbsoluteFill>
			<Studio accent={ORANGE} second="#4F8BFF" seed="phone" horizon={1300} />
			<AbsoluteFill style={{background: 'linear-gradient(rgba(5,7,22,0.85) 0%, rgba(5,7,22,0) 30%)'}} />
			<div style={{position: 'absolute', left: 64, top: 200}}>
				<SectionLabel num="2" text="WAS IST MIT DEM HANDY?" color={ORANGE} />
			</div>

			{/* Smartphone (Mitte unten) */}
			<div style={{position: 'absolute', left: 540 - 190, top: 600 + drift, scale: String(zoom), transformOrigin: '50% 30%', filter: 'drop-shadow(0 50px 70px rgba(0,0,0,0.6))'}}>
				<Phone width={380} galleryAt={atReport - 6} scroll={swipe * 0.4} highlight={TAGS.map((t) => t.idx)} highlightAt={atFotos + 6} lockAt={atLock - 4} accent={toNeq > 0.5 ? COLORS.signal : ORANGE} />
				{frame > atSwipe && frame < atSwipe + 44 ? (
					<div style={{position: 'absolute', left: 180, top: 640 - swipe * 260, width: 60, height: 60, borderRadius: 30, background: 'rgba(255,255,255,0.35)', border: '3px solid rgba(255,255,255,0.85)', opacity: Math.sin(swipe * Math.PI)}} />
				) : null}
			</div>

			{/* Teil 1: Schilderung + nicht bestätigt */}
			<div style={{position: 'absolute', left: 64, top: 292, width: 866, display: 'flex', flexDirection: 'column', gap: 14, opacity: 1 - toWhy, translate: `0 ${-toWhy * 40}px`}}>
				<InfoRow kind="SCHILDERUNG" text={PHONE.report.text} sub={`${PHONE.report.who} · ${PHONE.report.source}`} at={atReport - 2} size={29} />
				{frame >= atConfirm - 4 ? (
					<div style={{alignSelf: 'flex-start'}}>
						<Rise2 at={atConfirm - 4}>
							<div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px', borderRadius: 16, background: 'rgba(8,10,28,0.9)', border: '2px solid rgba(195,202,230,0.6)'}}>
								<PIcon name="clock" size={30} color="#C3CAE6" />
								<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 28, color: COLORS.text}}>{PHONE.notConfirmed}</span>
							</div>
						</Rise2>
					</div>
				) : null}
			</div>

			{/* Teil 2: Warum Aufnahmen – Markierungen + Zeugenaufruf */}
			{TAGS.map((t, i) => {
				const at = (i === 0 ? atFotos : atIdent) + i * 6;
				if (frame < at || toNeq > 0.99) return null;
				const s = springIn({frame, fps, delay: at, damping: 13, stiffness: 170});
				const left = t.side === 'left';
				return (
					<div key={t.label} style={{position: 'absolute', top: t.y + drift, left: left ? 64 : undefined, right: left ? undefined : 150, opacity: Math.min(1, s * 2) * (1 - toNeq), translate: `${(1 - s) * (left ? -80 : 80)}px 0`}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', borderRadius: 999, background: ORANGE, boxShadow: '0 12px 30px rgba(0,0,0,0.45)'}}>
							<PIcon name={t.icon} size={28} color="#1A0E06" stroke={2.6} />
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, color: '#1A0E06'}}>{t.label}</span>
						</div>
					</div>
				);
			})}
			{toWhy > 0.01 && toNeq < 0.99 ? (
				<div style={{position: 'absolute', left: 64, top: 292, width: 866, opacity: toWhy * (1 - toNeq)}}>
					<Rise2 at={atAppeal - 6}>
						<GlassCard padding="0" tone="light">
							<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 22px', background: 'linear-gradient(90deg, #12204A, #1E3A8A)'}}>
								<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 24, color: '#FFFFFF'}}>{PHONE.appeal.sender}</span>
								<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
									<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: '#CFE0FF'}}>{PHONE.appeal.date}</span>
									<KindChip kind="OFFIZIELL" size={18} />
								</div>
							</div>
							<div style={{padding: '14px 24px 18px', display: 'flex', alignItems: 'center', gap: 18}}>
								<div style={{flex: 1}}>
									<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, lineHeight: 1.08, color: '#0B1029'}}>{PHONE.appeal.title}</div>
									<div style={{marginTop: 6, fontFamily: FONTS.body, fontWeight: 600, fontStyle: 'italic', fontSize: 24, color: '#3A4466'}}>„{PHONE.appeal.text}“</div>
								</div>
								<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 14px', borderRadius: 18, background: frame >= atUpload ? '#3DDC97' : '#E3E8F4'}}>
									<PIcon name="upload" size={40} color="#0B1029" stroke={2.6} />
									<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 16, letterSpacing: 0.5, color: '#0B1029', textAlign: 'center', lineHeight: 1.1}}>{PHONE.appeal.button}</span>
								</div>
							</div>
						</GlassCard>
					</Rise2>
				</div>
			) : null}

			{/* Teil 3: Zeugenaufruf ≠ Pflicht */}
			{toNeq > 0.01 ? (
				<div style={{position: 'absolute', left: 64, top: 300, width: 866, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, opacity: toNeq, scale: String(0.8 + 0.2 * neq)}}>
					<div style={{padding: '14px 28px', borderRadius: 20, background: '#3DDC97', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 52, color: '#062A1A', boxShadow: '0 4px 0 #22A06A, 0 24px 50px rgba(0,0,0,0.5)'}}>{PHONE.equation[0]}</div>
					<div style={{width: 96, height: 96, borderRadius: 48, background: COLORS.signal, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 76, color: '#0B1029', boxShadow: `0 0 40px ${withAlpha(COLORS.signal, 0.6)}`, rotate: `${(1 - neq) * -90}deg`}}>≠</div>
					<div style={{padding: '14px 26px', borderRadius: 20, background: 'rgba(8,10,28,0.92)', border: `3px solid ${COLORS.alert}`, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 44, color: COLORS.text, textAlign: 'center', lineHeight: 1.08}}>{PHONE.equation[1]}</div>
				</div>
			) : null}

			<Sfx name="notify" at={atReport - 2} />
			<Sfx name="click" at={atSwipe} />
			<Sfx name="click" at={atSwipe + 14} volume={0.7} />
			<Sfx name="pop" at={atConfirm - 4} volume={0.7} />
			<Sfx name="pop" at={atFotos} />
			<Sfx name="pop" at={atIdent + 6} />
			<Sfx name="pop" at={atIdent + 12} />
			<Sfx name="paper" at={atAppeal - 6} />
			<Sfx name="click" at={atUpload} />
			<Sfx name="softImpact" at={atNeq} volume={0.9} />
			<Sfx name="click" at={atLock - 4} />
		</AbsoluteFill>
	);
};

/** Kleiner Rise ohne Skalierung (für Karten im Fluss). */
const Rise2: React.FC<{at: number; children: React.ReactNode}> = ({at, children}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	if (frame < at - 1) return null;
	const s = springIn({frame, fps, delay: at, damping: 15, stiffness: 150});
	return <div style={{opacity: Math.min(1, s * 1.8), translate: `0 ${(1 - s) * 40}px`}}>{children}</div>;
};
