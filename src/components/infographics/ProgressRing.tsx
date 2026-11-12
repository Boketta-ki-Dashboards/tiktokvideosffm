import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, EASE_OUT} from '../../lib/animation';
import {withAlpha} from '../../lib/color';
import {COLORS, FONTS} from '../../theme/tokens';

/** Kreisdiagramm für Anteile (0–1), z. B. Wahlbeteiligung oder Prozentwerte. */
export const ProgressRing: React.FC<{
	value: number;
	size?: number;
	thickness?: number;
	color?: string;
	label?: string;
	delay?: number;
	durationInFrames?: number;
}> = ({value, size = 260, thickness = 26, color = COLORS.signal, label, delay = 0, durationInFrames = 40}) => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [delay, delay + durationInFrames], [0, value], {...clamp, easing: EASE_OUT});
	const r = (size - thickness) / 2;
	const c = 2 * Math.PI * r;
	return (
		<div style={{position: 'relative', width: size, height: size}}>
			<svg width={size} height={size} style={{rotate: '-90deg'}}>
				<circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={withAlpha('#FFFFFF', 0.1)} strokeWidth={thickness} />
				<circle
					cx={size / 2}
					cy={size / 2}
					r={r}
					fill="none"
					stroke={color}
					strokeWidth={thickness}
					strokeLinecap="round"
					strokeDasharray={`${c * p} ${c}`}
				/>
			</svg>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					fontFamily: FONTS.heading,
					color: COLORS.text,
				}}
			>
				<span style={{fontWeight: 900, fontSize: size * 0.26}}>{Math.round(p * 100)} %</span>
				{label ? <span style={{fontWeight: 700, fontSize: size * 0.09, color: COLORS.textMuted}}>{label}</span> : null}
			</div>
		</div>
	);
};
