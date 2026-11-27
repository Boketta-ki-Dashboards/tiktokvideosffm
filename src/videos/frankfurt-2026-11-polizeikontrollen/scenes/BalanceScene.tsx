import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {clamp, EASE_OUT, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {COLORS, FONTS} from '../../../theme/tokens';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {BALANCE} from '../content';
import {PIcon, type PIconName, Rise} from '../ui';

const BLUE = '#4F8BFF';
const VIOLET = '#B794F6';

const Half: React.FC<{side: 'left' | 'right'; title: string; items: string[]; icons: PIconName[]; at: number; color: string}> = ({side, title, items, icons, at, color}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = springIn({frame, fps, delay: at - 4, damping: 14, stiffness: 140});
	const left = side === 'left';
	return (
		<div
			style={{
				position: 'absolute',
				top: 0,
				bottom: 0,
				left: left ? 0 : 540,
				width: 540,
				background: left ? 'linear-gradient(160deg, #0E1E4A 0%, #08102C 100%)' : 'linear-gradient(200deg, #2A1550 0%, #12082C 100%)',
				clipPath: left ? `inset(0 ${(1 - Math.min(1, s)) * 100}% 0 0)` : `inset(0 0 0 ${(1 - Math.min(1, s)) * 100}%)`,
			}}
		>
			<div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse 70% 40% at ${left ? 40 : 60}% 40%, ${withAlpha(color, 0.3)} 0%, rgba(0,0,0,0) 70%)`}} />
			<div style={{position: 'absolute', left: left ? 64 : 26, right: left ? 26 : 150, top: 330, display: 'flex', flexDirection: 'column', alignItems: left ? 'flex-start' : 'flex-end', gap: 18, textAlign: left ? 'left' : 'right'}}>
				<div style={{width: 150, height: 150, borderRadius: 75, background: `radial-gradient(circle at 35% 30%, ${withAlpha(color, 0.55)}, ${withAlpha(color, 0.15)})`, border: `4px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 50px ${withAlpha(color, 0.45)}`}}>
					<PIcon name={left ? 'shield' : 'lock'} size={88} color="#FFFFFF" stroke={2} />
				</div>
				<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 44, lineHeight: 1, color: COLORS.text}}>{title}</span>
				{items.map((it, i) => (
					<Rise key={it} at={at + 6 + i * 6} dx={left ? -30 : 30} dy={0}>
						<div style={{display: 'flex', alignItems: 'center', gap: 10, flexDirection: left ? 'row' : 'row-reverse'}}>
							<PIcon name={icons[i]} size={34} color={color} />
							<span style={{fontFamily: FONTS.body, fontWeight: 800, fontSize: 28, color: COLORS.text}}>{it}</span>
						</div>
					</Rise>
				))}
			</div>
		</div>
	);
};

/** Szene 6 – Sicherheit und Rechte: geteilte Grafik mit Waage in der Mitte. */
export const BalanceScene: React.FC<SceneProps> = ({cues}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const b = cue(cues, 'bal1', 6);
	const atPolice = wordFrame(cues, 'Polizei', b.from + 6);
	const atRights = wordFrame(cues, 'Rechte', atPolice + 50);
	const atJungs = wordFrame(cues, 'Jungs', b.to - 50);
	const tilt = interpolate(frame, [atPolice, atPolice + 20, atRights, atRights + 20, atJungs, atJungs + 20], [0, -10, -10, 8, 8, 0], {...clamp, easing: EASE_OUT});
	const scale = springIn({frame, fps, delay: atPolice + 10, damping: 12});
	const jungs = springIn({frame, fps, delay: atJungs - 4, damping: 13});

	return (
		<AbsoluteFill style={{backgroundColor: '#05071A'}}>
			<Half side="left" title={BALANCE.left.title} items={BALANCE.left.items} icons={['shield', 'search', 'person']} at={6} color={BLUE} />
			<Half side="right" title={BALANCE.right.title} items={BALANCE.right.items} icons={['phone', 'lock', 'scales']} at={atRights} color={VIOLET} />
			<div style={{position: 'absolute', left: 538, top: 0, bottom: 0, width: 4, background: 'linear-gradient(rgba(255,255,255,0), rgba(255,255,255,0.6), rgba(255,255,255,0))'}} />
			{/* Waage */}
			<div style={{position: 'absolute', left: 540 - 170, top: 880, width: 340, opacity: Math.min(1, scale * 2), scale: String(0.7 + 0.3 * scale)}}>
				<svg width={340} height={260} viewBox="0 0 340 260" style={{overflow: 'visible'}}>
					<rect x={164} y={60} width={12} height={170} rx={4} fill="#E3E8F6" />
					<rect x={110} y={226} width={120} height={16} rx={8} fill="#E3E8F6" />
					<circle cx={170} cy={58} r={14} fill={COLORS.signal} />
					<g transform={`rotate(${tilt} 170 58)`}>
						<rect x={20} y={52} width={300} height={10} rx={5} fill="#E3E8F6" />
						{[30, 310].map((x, k) => (
							<g key={x}>
								<path d={`M${x} 62 L${x - 34} 138 M${x} 62 L${x + 34} 138`} stroke="#C3CAE6" strokeWidth={3} />
								<path d={`M${x - 46} 138 Q${x} 176 ${x + 46} 138 Z`} fill={k === 0 ? BLUE : VIOLET} />
							</g>
						))}
					</g>
				</svg>
			</div>
			{/* „Nicht jeder ist verdächtig“ */}
			{frame >= atJungs - 4 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 1170, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 4, opacity: Math.min(1, jungs * 2), translate: `0 ${(1 - jungs) * 40}px`}}>
					<svg width={420} height={120} viewBox="0 0 420 120" style={{overflow: 'visible'}}>
						{[60, 130, 200, 270, 340].map((x, i) => (
							<g key={x} transform={`translate(${x} 118) scale(1.1)`}>
								<ellipse cx={0} cy={0} rx={16} ry={3} fill="#000" opacity={0.4} />
								<path d="M-6 -44 L-6 -2 M6 -44 L6 -2" stroke="#2A2C36" strokeWidth={8} strokeLinecap="round" />
								<path d="M-14 -80 Q0 -84 14 -80 L12 -42 Q0 -38 -12 -42 Z" fill={['#3D7BFF', '#8B5CF6', '#3DDC97', '#FF8A4A', '#FF5A6A'][i]} />
								<circle cx={0} cy={-90} r={8} fill={['#B98A66', '#E0B48E', '#7A4E36', '#F1D3B8', '#9C6B4E'][i]} />
							</g>
						))}
					</svg>
					<div style={{padding: '10px 18px', borderRadius: 16, background: 'rgba(8,10,28,0.9)', border: '2px solid rgba(255,255,255,0.25)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, color: COLORS.text, marginBottom: 20}}>
						auf der Zeil ≠ verdächtig
					</div>
				</div>
			) : null}

			<Sfx name="whoosh" at={atPolice - 6} volume={0.5} />
			<Sfx name="softImpact" at={atPolice + 10} volume={0.6} />
			<Sfx name="whoosh" at={atRights - 6} volume={0.5} />
			<Sfx name="pop" at={atJungs - 4} />
		</AbsoluteFill>
	);
};
