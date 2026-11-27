import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {SafeArea} from '../../../components/layout/SafeArea';
import {Kicker} from '../../../components/text/Kicker';
import {clamp, EASE_IN_OUT, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {COLORS, FONTS, RADII} from '../../../theme/tokens';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {HALLOWEEN} from '../content';
import {Pill, PopIn, StatusChip} from '../ui';

type Costume = 'none' | 'witch' | 'ears' | 'horns';

/** Anonyme Silhouette (Kopf + Körper), optional mit Kostüm-Umriss – keine reale Person. */
const Figure: React.FC<{x: number; y: number; h: number; color: string; costume: Costume; bob: number}> = ({x, y, h, color, costume, bob}) => {
	const head = h * 0.22;
	return (
		<g transform={`translate(${x} ${y + bob})`}>
			<circle cx={0} cy={-h + head / 2} r={head / 2} fill={color} />
			<path d={`M${-h * 0.2} 0 L${-h * 0.17} ${-h + head * 1.1} Q0 ${-h + head * 0.8} ${h * 0.17} ${-h + head * 1.1} L${h * 0.2} 0 Z`} fill={color} />
			{costume === 'witch' ? <path d={`M${-head * 0.9} ${-h + head * 0.15} L0 ${-h - head * 1.2} L${head * 0.9} ${-h + head * 0.15} Z`} fill={color} /> : null}
			{costume === 'ears' ? (
				<>
					<path d={`M${-head * 0.45} ${-h + head * 0.1} L${-head * 0.3} ${-h - head * 0.55} L${-head * 0.05} ${-h + head * 0.05} Z`} fill={color} />
					<path d={`M${head * 0.45} ${-h + head * 0.1} L${head * 0.3} ${-h - head * 0.55} L${head * 0.05} ${-h + head * 0.05} Z`} fill={color} />
				</>
			) : null}
			{costume === 'horns' ? (
				<>
					<path d={`M${-head * 0.35} ${-h + head * 0.05} Q${-head * 0.7} ${-h - head * 0.5} ${-head * 0.15} ${-h - head * 0.35}`} stroke={color} strokeWidth={head * 0.18} fill="none" />
					<path d={`M${head * 0.35} ${-h + head * 0.05} Q${head * 0.7} ${-h - head * 0.5} ${head * 0.15} ${-h - head * 0.35}`} stroke={color} strokeWidth={head * 0.18} fill="none" />
				</>
			) : null}
		</g>
	);
};

const Pumpkin: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`}>
		<ellipse cx={0} cy={0} rx={34} ry={26} fill="#F07A1E" />
		<ellipse cx={-14} cy={0} rx={14} ry={25} fill="#E06A12" />
		<ellipse cx={14} cy={0} rx={14} ry={25} fill="#E06A12" />
		<rect x={-4} y={-34} width={8} height={10} rx={2} fill="#3A5A1E" />
		<path d="M-14 -6 l6 -8 l6 8 z M8 -6 l6 -8 l6 8 z M-14 8 q14 10 28 0 q-14 4 -28 0" fill="#FFE38A" />
	</g>
);

/** Eine Hälfte des Split-Screens als Straßenszene. */
const Half: React.FC<{side: 'left' | 'right'; dense: number; appear: number; width?: number}> = ({side, dense, appear, width = 540}) => {
	const frame = useCurrentFrame();
	const left = side === 'left';
	const W = Math.round(width);
	const n = left ? 26 : 7;
	const color = left ? '#0A0408' : '#0A0E1E';
	const costumes: Costume[] = ['witch', 'ears', 'horns', 'none'];
	return (
		<svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', left: left ? 0 : 540, top: 0}}>
			<defs>
				<linearGradient id={`sky-${side}`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={left ? '#1B0820' : '#0E1630'} />
					<stop offset="0.6" stopColor={left ? '#5A1E1A' : '#26324F'} />
					<stop offset="1" stopColor={left ? '#2A0E14' : '#151B30'} />
				</linearGradient>
			</defs>
			<rect width={W} height={1920} fill={`url(#sky-${side})`} />
			{/* Fassaden */}
			{new Array(Math.ceil(W / 140) + 1).fill(true).map((_, i) => (
				<rect key={i} x={i * 140 - 10} y={560 + (i % 2) * 60} width={130} height={560} fill={left ? '#4A2030' : '#2E3A62'} />
			))}
			{new Array(Math.ceil(W / 140) * 3).fill(true).map((_, i) => (
				<rect key={`w-${i}`} x={(i % Math.ceil(W / 140)) * 140 + 20} y={640 + Math.floor(i / Math.ceil(W / 140)) * 140} width={40} height={60} rx={4} fill={left ? '#FFB45A' : '#8FB4E8'} opacity={0.5} />
			))}
			{left
				? [0.11, 0.46, 0.83].map((f, i) => <Pumpkin key={f} x={f * W} y={1170} s={1.2 + (i % 2) * 0.3} />)
				: null}
			{left ? <path d={`M0 560 ${new Array(Math.ceil(W / 120)).fill(true).map((_, k) => `Q${k * 120 + 60} 600 ${k * 120 + 120} 560`).join(' ')}`} stroke="#F07A1E" strokeWidth={4} fill="none" opacity={0.8} /> : null}
			{/* Straße */}
			<rect y={1110} width={W} height={810} fill={left ? '#7A3A22' : '#3A4A6E'} />
			<rect y={1110} width={W} height={810} fill={`url(#sky-${side})`} opacity={0.35} />
			{/* Menschen */}
			{new Array(n).fill(true).map((_, i) => {
				const show = i < Math.round(n * dense);
				if (!show) return null;
				const x = 30 + random(`${side}-x-${i}`) * (W - 60);
				const y = 1180 + random(`${side}-y-${i}`) * 260;
				const h = 230 + random(`${side}-h-${i}`) * 80 + (y - 1180) * 0.35;
				const bob = Math.sin((frame + i * 9) / (left ? 5 : 9)) * (left ? 6 : 2);
				return (
					<g key={i} opacity={interpolate(frame, [appear + i, appear + i + 6], [0, 1], clamp)}>
						<Figure x={x} y={y} h={h} color={color} costume={left ? costumes[i % costumes.length] : 'none'} bob={bob} />
					</g>
				);
			})}
		</svg>
	);
};

/** Szene 2 – Der Halloween-Faktor: Split-Screen 31.10. (voll, verkleidet) vs. 20.11. (Alltag). */
export const HalloweenScene: React.FC<SceneProps> = ({cues}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const a1 = cue(cues, 'hal1', 6);
	const a2 = cue(cues, 'hal2', a1.to + 6);
	const a3 = cue(cues, 'hal3', a2.to + 6);
	const at31 = wordFrame(cues, '31', a1.from + 20);
	const atCostume = wordFrame(cues, 'verkleidet', a1.to - 20);
	const atNot = wordFrame(cues, 'Randalierer', a2.from + 10);
	const atFull = wordFrame(cues, 'voll', a2.from + Math.round((a2.to - a2.from) * 0.6));
	const atNoFuss = wordFrame(cues, 'Trubel', a3.from + 14);
	const atOverview = wordFrame(cues, 'überblicken', a3.to - 20);
	const split = interpolate(frame, [a3.from - 8, a3.from + 10], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const leftDense = interpolate(frame, [at31, atCostume + 10], [0.3, 1], clamp);
	const rightIn = springIn({frame, fps, delay: a3.from - 6, damping: 15});
	const tagsLeft = HALLOWEEN.left.tags;

	return (
		<AbsoluteFill style={{backgroundColor: '#07060C'}}>
			{/* links 31.10. – wird anfangs vollflächig gezeigt, dann geteilt */}
			<div style={{position: 'absolute', inset: 0}}>
				<Half side="left" dense={leftDense} appear={a1.from} width={1080 - 540 * split} />
			</div>
			<div style={{position: 'absolute', inset: 0, translate: `${(1 - rightIn) * 560}px 0`}}>
				<Half side="right" dense={1} appear={a3.from} />
			</div>
			<div style={{position: 'absolute', left: 538, top: 0, width: 4, height: 1920, background: '#FFFFFF', opacity: split * 0.8}} />
			<AbsoluteFill style={{background: 'linear-gradient(rgba(7,6,12,0.88) 0%, rgba(7,6,12,0.3) 26%, rgba(7,6,12,0) 40%)'}} />

			<SafeArea>
				<Kicker text="ERSTENS: HALLOWEEN" color="#F07A1E" delay={0} />
			</SafeArea>

			{/* Datumsetiketten */}
			<div style={{position: 'absolute', left: 64, top: 300}}>
				<PopIn delay={at31 - 4} from="left">
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 84, color: '#F07A1E', lineHeight: 1}}>{HALLOWEEN.left.date}</div>
					<div style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 32, color: COLORS.text}}>{HALLOWEEN.left.label}</div>
				</PopIn>
			</div>
			{split > 0.05 ? (
				<div style={{position: 'absolute', left: 580, top: 300, opacity: split}}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 84, color: '#8FB4E8', lineHeight: 1}}>{HALLOWEEN.right.date}</div>
					<div style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 32, color: COLORS.text}}>{HALLOWEEN.right.label}</div>
				</div>
			) : null}

			{/* Merkmale */}
			<div style={{position: 'absolute', left: 64, top: 470, width: split > 0.5 ? 440 : 866, display: 'flex', flexDirection: 'column', gap: 10}}>
				{tagsLeft.map((t, i) => (
					<PopIn key={t} delay={[at31 + 4, atCostume, atFull][i]} from="left">
						<span style={{display: 'inline-block', padding: '8px 14px', borderRadius: RADII.pill, background: withAlpha('#F07A1E', 0.9), fontFamily: FONTS.heading, fontWeight: 800, fontSize: 28, color: '#1A0E0A'}}>{t}</span>
					</PopIn>
				))}
			</div>
			{split > 0.05 ? (
				<div style={{position: 'absolute', left: 580, top: 470, width: 360, display: 'flex', flexDirection: 'column', gap: 10, opacity: split}}>
					{HALLOWEEN.right.tags.map((t, i) => (
						<PopIn key={t} delay={atNoFuss + i * 6} from="right">
							<span style={{display: 'inline-block', padding: '8px 14px', borderRadius: RADII.pill, background: withAlpha('#8FB4E8', 0.9), fontFamily: FONTS.heading, fontWeight: 800, fontSize: 28, color: '#0B1029'}}>{t}</span>
						</PopIn>
					))}
				</div>
			) : null}

			{/* Klarstellung + Einschätzung */}
			{frame >= atNot - 4 && frame < a3.from ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 1020, display: 'flex', justifyContent: 'center'}}>
					<PopIn delay={atNot - 4}>
						<Pill color={COLORS.text} dark size={44}>
							{HALLOWEEN.disclaimer}
						</Pill>
					</PopIn>
				</div>
			) : null}
			<div style={{position: 'absolute', left: 64, width: 866, top: 1040}}>
				<StatusChip kind="EINSCHÄTZUNG" text={HALLOWEEN.opinion} at={atOverview - 6} />
			</div>
			<div style={{position: 'absolute', left: 64, top: 1235, opacity: interpolate(frame, [a2.from, a2.from + 10], [0, 1], clamp)}}>
				<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, color: COLORS.textMuted}}>Quelle: {HALLOWEEN.source}</span>
			</div>

			<Sfx name="pop" at={at31 - 4} />
			<Sfx name="click" at={atCostume} />
			<Sfx name="click" at={atFull} />
			<Sfx name="pop" at={atNot - 4} />
			<Sfx name="whoosh" at={a3.from - 8} volume={0.8} />
			<Sfx name="click" at={atNoFuss} />
			<Sfx name="click" at={atOverview - 6} />
		</AbsoluteFill>
	);
};
