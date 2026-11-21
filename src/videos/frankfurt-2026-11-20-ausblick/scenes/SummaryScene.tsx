import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {GridBackdrop} from '../../../components/backgrounds/GridBackdrop';
import {SafeArea} from '../../../components/layout/SafeArea';
import {Kicker} from '../../../components/text/Kicker';
import {clamp, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {COLORS, FONTS, RADII} from '../../../theme/tokens';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {SUMMARY} from '../content';
import {STATUS_COLORS, type StatusKind} from '../ui';

/** Szene 5 – Warum es ruhiger werden könnte: drei Faktoren → nüchternes Fazit (ohne Prozentwerte). */
export const SummaryScene: React.FC<SceneProps> = ({cues}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const a = cue(cues, 'sum1', 6);
	const b = cue(cues, 'sum2', a.to + 6);
	const at = [wordFrame(cues, 'Halloween-Trubel', a.from), wordFrame(cues, 'Polizei', a.from + 25), wordFrame(cues, 'Läden', a.from + 50)];
	const atCalm = wordFrame(cues, 'ruhiger', b.from + 25);
	const atNobody = wordFrame(cues, 'niemand', b.to - 15);
	const verdict = springIn({frame, fps, delay: atCalm - 6, damping: 12});

	return (
		<AbsoluteFill>
			<GridBackdrop accent={COLORS.cyan} stops={['#0A1236', '#05081A']} particles={22} seed="summary" />
			<SafeArea>
				<Kicker text="ZUSAMMENGEFASST" color={COLORS.cyan} delay={0} />
			</SafeArea>
			<div style={{position: 'absolute', left: 64, width: 866, top: 300, display: 'flex', flexDirection: 'column', gap: 18}}>
				{SUMMARY.factors.map((f, i) => {
					const s = springIn({frame, fps, delay: at[i] - 4, damping: 13});
					const color = STATUS_COLORS[f.kind as StatusKind];
					return (
						<div
							key={f.id}
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 20,
								padding: '18px 22px',
								borderRadius: RADII.lg,
								background: 'linear-gradient(140deg, rgba(25,34,76,0.96), rgba(11,16,40,0.96))',
								border: `2px solid ${withAlpha(color, 0.7)}`,
								opacity: Math.min(1, s * 1.6),
								translate: `${(1 - s) * (i % 2 === 0 ? -300 : 300)}px 0`,
							}}
						>
							<div style={{width: 84, height: 84, borderRadius: 22, background: withAlpha(color, 0.2), display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 46, color}}>
								{i + 1}
							</div>
							<div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
								<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 42, color: COLORS.text}}>{f.title}</span>
								<span style={{alignSelf: 'flex-start', padding: '2px 10px', borderRadius: 8, background: color, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 22, color: '#0B1029'}}>{f.kind}</span>
							</div>
						</div>
					);
				})}
			</div>
			{frame >= atCalm - 6 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 900, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, opacity: Math.min(1, verdict * 1.6), scale: String(0.8 + 0.2 * verdict)}}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 54, color: '#0B1029', background: COLORS.signal, padding: '14px 26px', borderRadius: RADII.md, textAlign: 'center'}}>
						= {SUMMARY.verdict}
					</div>
					<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 28, color: COLORS.textMuted, opacity: interpolate(frame, [atNobody - 6, atNobody + 4], [0, 1], clamp)}}>
						Unsere Einschätzung · {SUMMARY.caveat}
					</div>
				</div>
			) : null}
			{at.map((f, i) => (
				<Sfx key={`f-${i}`} name="softImpact" at={f - 4} volume={0.7} />
			))}
			<Sfx name="riser" at={atCalm - 30} volume={0.5} />
			<Sfx name="pop" at={atCalm - 6} />
		</AbsoluteFill>
	);
};
