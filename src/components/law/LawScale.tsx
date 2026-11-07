import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, EASE_IN_OUT, springIn} from '../../lib/animation';
import {withAlpha} from '../../lib/color';
import {COLORS} from '../../theme/tokens';

export type LawScaleProps = {
	/** Beschriftung der linken / rechten Schale. */
	leftLabel: string;
	rightLabel: string;
	/** Neigung der Waage in Grad (negativ = links schwerer). Tween zwischen den Keyframes. */
	tilt: Array<{frame: number; deg: number}>;
	leftColor?: string;
	rightColor?: string;
	width?: number;
	delay?: number;
};

/** Gezeichnete Waage (SVG): Balken kippt animiert, Schalen hängen waagerecht daran. */
export const LawScale: React.FC<LawScaleProps> = ({leftLabel, rightLabel, tilt, leftColor = COLORS.signal, rightColor = COLORS.cyan, width = 800, delay = 0}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const intro = springIn({frame, fps, delay, damping: 15});
	const deg = interpolate(
		frame,
		tilt.map((t) => t.frame),
		tilt.map((t) => t.deg),
		{...clamp, easing: EASE_IN_OUT},
	);
	const swing = Math.sin(frame * 0.09) * 0.6 * Math.min(1, Math.abs(deg) / 6 + 0.2);
	const a = ((deg + swing) * Math.PI) / 180;
	const arm = 300;
	const cx = 400;
	const cy = 150;
	const lx = cx - Math.cos(a) * arm;
	const ly = cy - Math.sin(a) * arm;
	const rx = cx + Math.cos(a) * arm;
	const ry = cy + Math.sin(a) * arm;
	const pan = (x: number, y: number, color: string, label: string) => (
		<g>
			<line x1={x} y1={y} x2={x - 90} y2={y + 170} stroke="#8B93B8" strokeWidth={4} />
			<line x1={x} y1={y} x2={x + 90} y2={y + 170} stroke="#8B93B8" strokeWidth={4} />
			<path d={`M ${x - 120} ${y + 170} Q ${x} ${y + 240} ${x + 120} ${y + 170} Z`} fill={color} stroke="#0B1029" strokeWidth={4} />
			<text x={x} y={y + 300} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={900} fontSize={30} fill="#FFFFFF" stroke="#05081A" strokeWidth={6} paintOrder="stroke">
				{label}
			</text>
		</g>
	);
	return (
		<svg width={width} height={width * 0.72} viewBox="0 0 800 576" style={{opacity: Math.min(1, intro * 1.5), scale: String(0.9 + 0.1 * intro), overflow: 'visible'}}>
			<defs>
				<linearGradient id="scale-metal" x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor="#8B93B8" />
					<stop offset="0.5" stopColor="#E9EDF8" />
					<stop offset="1" stopColor="#8B93B8" />
				</linearGradient>
			</defs>
			<ellipse cx={cx} cy={cy + 360} rx={110} ry={20} fill={withAlpha('#000000', 0.45)} />
			<rect x={cx - 14} y={cy} width={28} height={350} rx={10} fill="url(#scale-metal)" />
			<path d={`M ${cx - 90} ${cy + 360} L ${cx + 90} ${cy + 360} L ${cx + 50} ${cy + 330} L ${cx - 50} ${cy + 330} Z`} fill="url(#scale-metal)" />
			<line x1={lx} y1={ly} x2={rx} y2={ry} stroke="url(#scale-metal)" strokeWidth={14} strokeLinecap="round" />
			<circle cx={cx} cy={cy} r={22} fill={COLORS.signal} stroke="#0B1029" strokeWidth={5} />
			{pan(lx, ly, leftColor, leftLabel)}
			{pan(rx, ry, rightColor, rightLabel)}
		</svg>
	);
};
