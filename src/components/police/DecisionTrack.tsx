import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, EASE_OUT, springIn} from '../../lib/animation';
import {withAlpha} from '../../lib/color';
import {COLORS, FONTS, RADII, SHADOWS} from '../../theme/tokens';

export type TrackStep = {
	id: string;
	label: string;
	/** Kurzer Zusatz (z. B. „Poseck, 02.11.“ oder „nicht bekannt“). */
	note: string;
	/** erledigt = gefüllt, offen = gestrichelt mit Fragezeichen. */
	state: 'done' | 'open';
	from: number;
	color?: string;
};

/**
 * Unterschied zwischen politischer Ankündigung und behördlicher Entscheidung:
 * Stufen von oben nach unten, nur belegte Stufen sind gefüllt – offene bleiben gestrichelt.
 */
export const DecisionTrack: React.FC<{steps: TrackStep[]; width?: number}> = ({steps, width = 866}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return (
		<div style={{width, display: 'flex', flexDirection: 'column', gap: 0, position: 'relative'}}>
			{steps.map((st, i) => {
				const p = springIn({frame, fps, delay: st.from, damping: 14, stiffness: 150});
				const color = st.color ?? (st.state === 'done' ? COLORS.signal : '#8C95B4');
				const line = interpolate(frame, [st.from + 6, st.from + 22], [0, 1], {...clamp, easing: EASE_OUT});
				return (
					<div key={st.id} style={{display: 'flex', gap: 22, alignItems: 'stretch', opacity: Math.min(1, p * 1.6), translate: `${(1 - p) * -90}px 0`}}>
						{/* Knoten + Linie */}
						<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: 70}}>
							<div
								style={{
									width: 66,
									height: 66,
									borderRadius: '50%',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									background: st.state === 'done' ? color : 'rgba(255,255,255,0.06)',
									border: st.state === 'done' ? `4px solid #0B1029` : `4px dashed ${color}`,
									fontFamily: FONTS.heading,
									fontWeight: 900,
									fontSize: 38,
									color: st.state === 'done' ? '#0B1029' : color,
									boxShadow: st.state === 'done' ? `0 0 ${24}px ${withAlpha(color, 0.5)}` : undefined,
								}}
							>
								{st.state === 'done' ? '✓' : '?'}
							</div>
							{i < steps.length - 1 ? (
								<div style={{width: 5, flex: 1, minHeight: 26, background: `linear-gradient(${withAlpha(color, 0.8)}, rgba(255,255,255,0.12))`, scale: `1 ${line}`, transformOrigin: 'top'}} />
							) : null}
						</div>
						<div
							style={{
								flex: 1,
								marginBottom: i < steps.length - 1 ? 14 : 0,
								padding: '14px 24px',
								borderRadius: RADII.md,
								background: st.state === 'done' ? 'linear-gradient(160deg, rgba(40,48,98,0.98), rgba(14,20,48,0.98))' : 'rgba(9,13,34,0.78)',
								border: st.state === 'done' ? `3px solid ${withAlpha(color, 0.8)}` : `3px dashed ${withAlpha(color, 0.6)}`,
								boxShadow: st.state === 'done' ? SHADOWS.card : undefined,
							}}
						>
							<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, color: st.state === 'done' ? COLORS.text : COLORS.textMuted, lineHeight: 1.1}}>{st.label}</div>
							<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 27, color: st.state === 'done' ? color : COLORS.textDim, marginTop: 2}}>{st.note}</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};
