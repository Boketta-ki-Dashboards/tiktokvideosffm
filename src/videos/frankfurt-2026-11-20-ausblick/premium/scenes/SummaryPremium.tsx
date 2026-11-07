import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, springIn} from '../../../../lib/animation';
import {withAlpha} from '../../../../lib/color';
import {COLORS, FONTS} from '../../../../theme/tokens';
import {cue, type SceneProps, wordFrame} from '../../../frankfurt-2026-10-31/cues';
import {SUMMARY} from '../../content';
import type {StatusKind} from '../../ui';
import {Icon, type IconName, SectionLabel, STATUS} from '../kit';
import {Studio} from '../Studio';

const ICONS: IconName[] = ['pumpkin', 'shield', 'board'];
const TINTS = ['#FF8A2A', '#4F8BFF', '#FFD23F'];

/** 2,5D-Faktorkarte: kippt aus der Tiefe herein, mit Seitenkante (Dicke), Glanz und Status-Chip. */
const FactorCard: React.FC<{i: number; at: number; title: string; kind: StatusKind; settle: number}> = ({i, at, title, kind, settle}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	if (frame < at - 1) return null;
	const s = springIn({frame, fps, delay: at, damping: 14, stiffness: 120});
	const side = i % 2 === 0 ? -1 : 1;
	const tilt = (1 - s) * 55 * side + side * 7 * (1 - settle);
	const tint = TINTS[i];
	const status = STATUS[kind];
	const gloss = interpolate(frame, [at + 6, at + 30], [-40, 140], clamp);
	return (
		<div style={{perspective: 1400}}>
			<div
				style={{
					position: 'relative',
					transform: `translateZ(${(1 - s) * -500}px) rotateY(${tilt}deg) rotateX(${(1 - s) * 18}deg)`,
					transformStyle: 'preserve-3d',
					opacity: Math.min(1, s * 1.6),
				}}
			>
				{/* Kartendicke */}
				<div style={{position: 'absolute', inset: 0, borderRadius: 30, background: withAlpha(tint, 0.55), translate: `${side * -8}px 10px`}} />
				<div
					style={{
						position: 'relative',
						display: 'flex',
						alignItems: 'center',
						gap: 24,
						padding: '22px 26px',
						borderRadius: 30,
						overflow: 'hidden',
						background: 'linear-gradient(150deg, rgba(40,52,110,0.97) 0%, rgba(16,21,54,0.98) 60%, rgba(10,13,36,0.98) 100%)',
						border: `2px solid ${withAlpha(tint, 0.65)}`,
						boxShadow: `inset 0 2px 0 rgba(255,255,255,0.18), 0 30px 60px rgba(0,0,0,0.55), 0 0 40px ${withAlpha(tint, 0.18)}`,
					}}
				>
					<div style={{position: 'relative', width: 120, height: 120, flexShrink: 0, borderRadius: 30, background: `radial-gradient(circle at 35% 30%, ${withAlpha(tint, 0.55)}, ${withAlpha(tint, 0.15)})`, border: `2px solid ${withAlpha(tint, 0.8)}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
						<Icon name={ICONS[i]} size={70} color={tint} stroke={2} />
						{i === 0 ? <div style={{position: 'absolute', width: 110, height: 7, borderRadius: 4, background: COLORS.alert, rotate: '-35deg', boxShadow: '0 0 10px rgba(255,77,94,0.7)'}} /> : null}
						<div style={{position: 'absolute', left: -12, top: -12, width: 40, height: 40, borderRadius: 20, background: '#FFFFFF', color: '#0B1029', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 24}}>{i + 1}</div>
					</div>
					<div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 44, lineHeight: 1.05, color: COLORS.text}}>{title}</span>
						<span style={{alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 12px', borderRadius: 10, background: status.color}}>
							<Icon name={status.icon} size={22} color="#0B1029" stroke={2.8} />
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 22, letterSpacing: 1, color: '#0B1029'}}>{kind}</span>
						</span>
					</div>
					<div style={{position: 'absolute', top: -60, bottom: -60, left: `${gloss}%`, width: 110, rotate: '20deg', background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.14), rgba(255,255,255,0))'}} />
				</div>
			</div>
		</div>
	);
};

/** Premium-Szene 5 – Zusammengefasst: drei 2,5D-Karten → Fazit-Plakette (Einschätzung, keine Prozentwerte). */
export const SummaryPremium: React.FC<SceneProps> = ({cues}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const a = cue(cues, 'sum1', 6);
	const b = cue(cues, 'sum2', a.to + 6);
	const at = [wordFrame(cues, 'Halloween-Trubel', a.from), wordFrame(cues, 'Polizei', a.from + 25), wordFrame(cues, 'Läden', a.from + 50)];
	const atCalm = wordFrame(cues, 'ruhiger', b.from + 25);
	const atNobody = wordFrame(cues, 'niemand', b.to - 15);
	const verdict = springIn({frame, fps, delay: atCalm - 6, damping: 12, stiffness: 150});
	const settle = interpolate(frame, [atCalm - 10, atCalm + 10], [0, 1], clamp);
	const caveat = interpolate(frame, [atNobody - 6, atNobody + 4], [0, 1], clamp);
	const shine = interpolate(frame, [atCalm + 4, atCalm + 30], [-40, 140], clamp);

	return (
		<AbsoluteFill>
			<Studio accent={COLORS.cyan} second="#7C5CFF" seed="sum" />
			<AbsoluteFill style={{background: 'linear-gradient(rgba(5,7,22,0.7) 0%, rgba(5,7,22,0) 25%)'}} />
			<div style={{position: 'absolute', left: 64, top: 200}}>
				<SectionLabel text="ZUSAMMENGEFASST" color={COLORS.cyan} />
			</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 300, display: 'flex', flexDirection: 'column', gap: 22}}>
				{SUMMARY.factors.map((f, i) => (
					<FactorCard key={f.id} i={i} at={at[i] - 4} title={f.title} kind={f.kind as StatusKind} settle={settle} />
				))}
			</div>
			{frame >= atCalm - 6 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 860, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 64, color: COLORS.signal, opacity: Math.min(1, verdict * 2), lineHeight: 1}}>=</div>
					<div
						style={{
							position: 'relative',
							overflow: 'hidden',
							padding: '20px 34px 24px',
							borderRadius: 26,
							background: 'linear-gradient(160deg, #FFE36A 0%, #FFD23F 50%, #F5B800 100%)',
							boxShadow: '0 4px 0 #D9A400, 0 8px 0 #B88A00, 0 36px 70px rgba(0,0,0,0.55), 0 0 60px rgba(255,210,63,0.25)',
							fontFamily: FONTS.heading,
							fontWeight: 900,
							fontSize: 58,
							lineHeight: 1.05,
							color: '#0B1029',
							textAlign: 'center',
							scale: String(0.7 + 0.3 * verdict),
							opacity: Math.min(1, verdict * 1.8),
						}}
					>
						{SUMMARY.verdict}
						<div style={{position: 'absolute', top: -40, bottom: -40, left: `${shine}%`, width: 110, rotate: '18deg', background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.55), rgba(255,255,255,0))'}} />
					</div>
					<div style={{display: 'flex', alignItems: 'center', gap: 10, maxWidth: 866, padding: '12px 22px', borderRadius: 22, background: 'rgba(8,10,28,0.85)', border: `2px solid ${withAlpha(STATUS.EINSCHÄTZUNG.color, 0.7)}`, opacity: caveat, translate: `0 ${(1 - caveat) * 20}px`}}>
						<Icon name="bulb" size={28} color={STATUS.EINSCHÄTZUNG.color} />
						<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 27, lineHeight: 1.2, color: COLORS.text}}>
							<b style={{color: STATUS.EINSCHÄTZUNG.color}}>Unsere Einschätzung</b> · {SUMMARY.caveat}
						</span>
					</div>
				</div>
			) : null}
		</AbsoluteFill>
	);
};
