import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {Camera} from '../../../../components/camera/Camera';
import {clamp, EASE_IN_OUT, EASE_OUT, springIn} from '../../../../lib/animation';
import {withAlpha} from '../../../../lib/color';
import {COLORS, FONTS} from '../../../../theme/tokens';
import {cue, type SceneProps, wordFrame} from '../../../frankfurt-2026-10-31/cues';
import {HOOK} from '../../content';
import {SourceLine, StatusRow, TYPE} from '../kit';
import {blendMood, MOODS, NightCity} from '../NightCity';
import {Legibility} from '../Studio';

const TILE_W = 236;
const TILE_H = 256;

const Half: React.FC<{text: string; part: 'top' | 'bottom'; color: string; style?: React.CSSProperties}> = ({text, part, color, style}) => (
	<div
		style={{
			position: 'absolute',
			left: 0,
			top: part === 'top' ? 0 : TILE_H / 2,
			width: TILE_W,
			height: TILE_H / 2,
			overflow: 'hidden',
			borderRadius: part === 'top' ? '22px 22px 0 0' : '0 0 22px 22px',
			background: part === 'top' ? 'linear-gradient(180deg, #232A55 0%, #161B3C 100%)' : 'linear-gradient(180deg, #12162F 0%, #0B0E22 100%)',
			backfaceVisibility: 'hidden',
			...style,
		}}
	>
		<div
			style={{
				position: 'absolute',
				left: 0,
				top: part === 'top' ? 0 : -TILE_H / 2,
				width: TILE_W,
				height: TILE_H,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				fontFamily: FONTS.heading,
				fontWeight: 900,
				fontSize: 176,
				letterSpacing: -4,
				color,
				textShadow: `0 0 34px ${withAlpha(color, 0.35)}`,
			}}
		>
			{text}
		</div>
	</div>
);

/** Fallblatt-Kachel (Split-Flap): klappt bei `at` von `from` auf `to`. */
const FlapTile: React.FC<{from: string; to: string; at: number; fromColor: string; toColor: string}> = ({from, to, at, fromColor, toColor}) => {
	const frame = useCurrentFrame();
	const t = interpolate(frame, [at, at + 9], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const done = t >= 1;
	const started = t > 0;
	return (
		<div style={{position: 'relative', width: TILE_W, height: TILE_H, perspective: 900, filter: 'drop-shadow(0 26px 40px rgba(0,0,0,0.55))'}}>
			<Half text={started ? to : from} part="top" color={started ? toColor : fromColor} />
			<Half text={done ? to : from} part="bottom" color={done ? toColor : fromColor} />
			{started && !done ? (
				t < 0.5 ? (
					<Half text={from} part="top" color={fromColor} style={{transformOrigin: '50% 100%', transform: `rotateX(${-t * 180}deg)`, filter: `brightness(${1 - t})`}} />
				) : (
					<Half text={to} part="bottom" color={toColor} style={{transformOrigin: '50% 0%', transform: `rotateX(${(1 - t) * 180}deg)`, filter: `brightness(${t})`}} />
				)
			) : null}
			{/* Mittelfuge + Scharniere */}
			<div style={{position: 'absolute', left: 0, right: 0, top: TILE_H / 2 - 2, height: 4, background: '#05060F'}} />
			{[-6, TILE_W - 6].map((x) => (
				<div key={x} style={{position: 'absolute', left: x, top: TILE_H / 2 - 16, width: 12, height: 32, borderRadius: 4, background: '#3A4170'}} />
			))}
			<div style={{position: 'absolute', inset: 0, borderRadius: 22, border: '1.5px solid rgba(255,255,255,0.12)', pointerEvents: 'none'}} />
		</div>
	);
};

/** Glasriss, der beim Datumswechsel in Scherben zerfällt. */
const Shatter: React.FC<{flipAt: number}> = ({flipAt}) => {
	const frame = useCurrentFrame();
	const cx = 540;
	const cy = 900;
	const appear = interpolate(frame, [2, 8], [0, 1], clamp);
	const t = Math.max(0, frame - flipAt);
	const lineFade = interpolate(t, [0, 6], [1, 0], clamp);
	return (
		<svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
			{lineFade > 0
				? new Array(16).fill(true).map((_, i) => {
						const a = (i / 16) * Math.PI * 2 + random(`hc-${i}`) * 0.3;
						const len = 300 + random(`hl-${i}`) * 560;
						const mx = cx + Math.cos(a + 0.12) * len * 0.45;
						const my = cy + Math.sin(a + 0.12) * len * 0.45;
						return <path key={i} d={`M${cx} ${cy} L${mx} ${my} L${cx + Math.cos(a) * len} ${cy + Math.sin(a) * len}`} stroke="rgba(230,240,255,0.8)" strokeWidth={2.5} fill="none" opacity={appear * lineFade} />;
					})
				: null}
			{lineFade > 0 ? <circle cx={cx} cy={cy} r={14} fill="rgba(255,255,255,0.7)" opacity={appear * lineFade} /> : null}
			{t > 0 && t < 26
				? new Array(18).fill(true).map((_, i) => {
						const a = (i / 18) * Math.PI * 2 + random(`sa-${i}`) * 0.4;
						const r0 = 60 + random(`sr-${i}`) * 260;
						const v = 18 + random(`sv-${i}`) * 22;
						const x = cx + Math.cos(a) * (r0 + v * t);
						const y = cy + Math.sin(a) * (r0 + v * t) + 1.6 * t * t;
						const size = 26 + random(`ss-${i}`) * 40;
						const rot = t * (random(`sw-${i}`) - 0.5) * 30;
						return (
							<path
								key={i}
								d={`M0 ${-size / 2} L${size / 2} ${size / 3} L${-size / 2.4} ${size / 2.2} Z`}
								transform={`translate(${x} ${y}) rotate(${rot})`}
								fill="rgba(200,225,255,0.22)"
								stroke="rgba(240,248,255,0.85)"
								strokeWidth={2}
								opacity={interpolate(t, [0, 26], [1, 0], clamp)}
							/>
						);
					})
				: null}
		</svg>
	);
};

const LivePill: React.FC<{text: string; color: string}> = ({text, color}) => {
	const frame = useCurrentFrame();
	const pulse = (Math.sin(frame / 5) + 1) / 2;
	return (
		<div style={{display: 'inline-flex', alignItems: 'center', gap: 12, padding: '10px 20px 10px 16px', borderRadius: 999, background: 'rgba(8,10,28,0.78)', border: `2px solid ${withAlpha(color, 0.7)}`, boxShadow: `0 0 26px ${withAlpha(color, 0.25)}`}}>
			<div style={{width: 16, height: 16, borderRadius: 8, background: color, boxShadow: `0 0 ${8 + pulse * 14}px ${color}`}} />
			<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, letterSpacing: 2.5, color: COLORS.text}}>{text}</span>
		</div>
	);
};

/** Premium-Szene 1 – Hook: Rückblick 31.10. (Glasriss, Blaulicht) → Fallblatt auf 20.11. → 3D-Frage-Plakette. */
export const HookPremium: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const h1 = cue(cues, 'hook1', 6);
	const h2 = cue(cues, 'hook2', h1.to + 6);
	const h3 = cue(cues, 'hook3', h2.to + 6);
	const flipAt = Math.max(10, wordFrame(cues, '20', h1.from + 4) - 2);
	const qAt = wordFrame(cues, 'Eskaliert', h2.from + Math.round((h2.to - h2.from) * 0.55));
	const factAt = wordFrame(cues, 'Fakt', h3.from);
	const opinionAt = wordFrame(cues, 'Einschätzung', h3.from + Math.round((h3.to - h3.from) * 0.55));
	const before = frame < flipAt;
	const toCalm = interpolate(frame, [flipAt, flipAt + 14], [0, 1], {...clamp, easing: EASE_OUT});
	const mood = blendMood(MOODS.alert, MOODS.calm, toCalm);
	const progress = interpolate(frame, [0, durationInFrames], [0, 1], clamp);
	const kick = springIn({frame, fps, delay: flipAt, damping: 10, stiffness: 220});
	const q = springIn({frame, fps, delay: qAt - 2, damping: 13, stiffness: 150});
	const qReveal = interpolate(frame, [qAt - 2, qAt + 10], [0, 1], {...clamp, easing: EASE_OUT});
	const shimmer = interpolate(frame, [qAt + 8, qAt + 34], [-40, 140], clamp);
	const accent = before ? COLORS.alert : COLORS.signal;
	const sub = interpolate(frame, [flipAt + 4, flipAt + 16], [0, 1], clamp);

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night}}>
			<Camera
				keyframes={[
					{frame: 0, zoom: 1.16, y: 60},
					{frame: durationInFrames, zoom: 1.03, y: 0},
				]}
				shake={before ? 3 : Math.max(0, 1 - (frame - flipAt) / 10) * 10}
			>
				<NightCity mood={mood} progress={progress} litRatio={0.3 + toCalm * 0.05} emergency={0.55 * (1 - toCalm)} />
			</Camera>
			{/* roter Rückblick-Schleier */}
			<AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 30%, ${withAlpha('#5A0010', 0.55 * (1 - toCalm))} 100%)`}} />
			<Shatter flipAt={flipAt} />
			<Legibility topStrength={0.8} />
			{/* Lichtblitz beim Wechsel */}
			<AbsoluteFill style={{background: '#FFFFFF', opacity: interpolate(frame, [flipAt, flipAt + 2, flipAt + 8], [0, 0.35, 0], clamp), pointerEvents: 'none'}} />

			<div style={{position: 'absolute', left: 64, top: 200}}>
				<LivePill text={before ? 'RÜCKBLICK · HALLOWEEN' : 'AUSBLICK · FRANKFURT'} color={accent} />
			</div>

			{/* Fallblatt-Datum */}
			<div style={{position: 'absolute', left: 64, top: 290, display: 'flex', alignItems: 'flex-end', gap: 14, scale: String(1 + (1 - kick) * 0.06 * (before ? 0 : 1)), transformOrigin: '0% 100%'}}>
				<FlapTile from="31" to="20" at={flipAt} fromColor={COLORS.alert} toColor="#FFFFFF" />
				<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 120, lineHeight: 1, color: accent, paddingBottom: 14}}>.</div>
				<FlapTile from="10" to="11" at={flipAt + 3} fromColor={COLORS.alert} toColor="#FFFFFF" />
				<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 120, lineHeight: 1, color: accent, paddingBottom: 14}}>.</div>
			</div>
			<div style={{position: 'absolute', left: 64, top: 566, display: 'flex', alignItems: 'center', gap: 18}}>
				<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 64, letterSpacing: 10, color: 'transparent', WebkitTextStroke: `2.5px ${accent}`}}>2026</span>
				<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 30, color: COLORS.textMuted}}>{before ? 'Plünderungen · Blaulicht · Scherben' : ''}</span>
				{!before ? <span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 32, letterSpacing: 2, color: COLORS.text, opacity: sub}}>FREITAG</span> : null}
			</div>

			{/* 3D-Frage-Plakette */}
			{frame >= qAt - 2 ? (
				<div style={{position: 'absolute', left: 64, top: 660, rotate: `${-2.5 * q}deg`, scale: String(0.7 + 0.3 * q), transformOrigin: '20% 50%', opacity: Math.min(1, q * 2)}}>
					<div
						style={{
							position: 'relative',
							padding: '18px 34px 22px',
							borderRadius: 26,
							background: 'linear-gradient(160deg, #FFE36A 0%, #FFD23F 45%, #F5B800 100%)',
							boxShadow: '0 4px 0 #D9A400, 0 8px 0 #B88A00, 0 12px 0 #8E6A00, 0 34px 60px rgba(0,0,0,0.55)',
							clipPath: `inset(-40px ${(1 - qReveal) * 100}% -80px -40px)`,
							overflow: 'hidden',
						}}
					>
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 50, lineHeight: 1, letterSpacing: 4, color: '#3A2A00'}}>{HOOK.question.split(' ')[0]}</div>
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 88, lineHeight: 1.02, letterSpacing: -1, color: '#0B1029'}}>{HOOK.question.split(' ').slice(1).join(' ')}</div>
						<div style={{position: 'absolute', top: -40, bottom: -40, left: `${shimmer}%`, width: 120, rotate: '18deg', background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.55), rgba(255,255,255,0))'}} />
					</div>
				</div>
			) : null}

			<div style={{position: 'absolute', left: 64, width: 866, top: 900, display: 'flex', flexDirection: 'column', gap: 16}}>
				<StatusRow kind="FAKT" text={HOOK.fact} at={factAt} size={TYPE.body} />
				<StatusRow kind="EINSCHÄTZUNG" text={HOOK.opinion} at={opinionAt} size={TYPE.body} />
			</div>
			<SourceLine text={`Quelle: ${HOOK.factSource}`} at={factAt + 6} top={1170} />
		</AbsoluteFill>
	);
};
