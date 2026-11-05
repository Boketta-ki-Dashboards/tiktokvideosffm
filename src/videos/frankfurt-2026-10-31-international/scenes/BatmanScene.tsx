import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {Camera} from '../../../components/camera/Camera';
import {SafeArea} from '../../../components/layout/SafeArea';
import {SourceCredit} from '../../../components/media/SourceCredit';
import {Kicker} from '../../../components/text/Kicker';
import {clamp, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {COLORS, FONTS} from '../../../theme/tokens';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {BATMAN, mediaById} from '../content';
import {NewsCard, Pill, PopIn, Stamp} from '../ui';

/** Stilisierte Flammen (SVG), flackern deterministisch. */
const Flames: React.FC<{width: number; height: number; seed: string}> = ({width, height, seed}) => {
	const frame = useCurrentFrame();
	const tongues = 9;
	return (
		<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
			<defs>
				<linearGradient id={`fl-${seed}`} x1="0" y1="1" x2="0" y2="0">
					<stop offset="0" stopColor="#FFE38A" />
					<stop offset="0.45" stopColor="#FF9A2E" />
					<stop offset="1" stopColor="#E2361F" stopOpacity="0" />
				</linearGradient>
			</defs>
			{new Array(tongues).fill(true).map((_, i) => {
				const cx = ((i + 0.5) / tongues) * width;
				const h = height * (0.55 + 0.4 * random(`${seed}-h-${i}`)) * (0.85 + 0.15 * Math.sin(frame / (3 + (i % 3)) + i));
				const w = (width / tongues) * 1.5;
				const sway = Math.sin(frame / 7 + i * 1.3) * w * 0.25;
				const d = `M ${cx - w / 2} ${height} Q ${cx - w / 2 + sway} ${height - h * 0.5} ${cx + sway * 1.6} ${height - h} Q ${cx + w / 2 + sway} ${height - h * 0.5} ${cx + w / 2} ${height} Z`;
				return <path key={i} d={d} fill={`url(#fl-${seed})`} opacity={0.85} />;
			})}
		</svg>
	);
};

/** Anonyme, stilisierte Kostüm-Silhouette (Umhang, spitze Ohren) – keine reale Person, kein Markenemblem. */
const CapedFigure: React.FC<{height: number; glow: number}> = ({height, glow}) => (
	<svg height={height} viewBox="0 0 200 320" style={{filter: `drop-shadow(0 0 ${18 * glow}px ${withAlpha('#FF9A2E', 0.8)})`}}>
		<path
			d="M100 18 L88 4 L84 30 Q70 38 72 60 Q74 78 86 84 L60 96 Q40 104 34 140 L10 300 Q60 280 100 288 Q140 280 190 300 L166 140 Q160 104 140 96 L114 84 Q126 78 128 60 Q130 38 116 30 L112 4 Z"
			fill="#05060F"
		/>
		<path d="M86 52 h10 M104 52 h10" stroke={withAlpha('#FFE38A', 0.35 + 0.3 * glow)} strokeWidth={3} strokeLinecap="round" />
	</svg>
);

/** Nachgestellter Agenturfoto-Rahmen (Illustration, kein Originalfoto). */
const PhotoFrame: React.FC<{label: string; at: number; rotate: number; x: number; y: number}> = ({label, at, rotate, x, y}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	if (frame < at) return null;
	const s = springIn({frame, fps, delay: at, damping: 12, stiffness: 160});
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				width: 300,
				padding: '12px 12px 14px',
				background: '#F4F1EA',
				borderRadius: 6,
				boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
				rotate: `${rotate * s}deg`,
				scale: String(0.5 + 0.5 * s),
				opacity: Math.min(1, s * 1.5),
			}}
		>
			<div style={{height: 190, borderRadius: 3, overflow: 'hidden', background: 'radial-gradient(circle at 50% 80%, #FF9A2E 0%, #6B1F12 45%, #0A0710 85%)', display: 'flex', justifyContent: 'center', alignItems: 'flex-end'}}>
				<CapedFigure height={150} glow={0.6} />
			</div>
			<div style={{marginTop: 8, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, color: '#0B1029'}}>AGENTURFOTO · {label}</div>
			<div style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, color: '#4A5170'}}>Illustration</div>
		</div>
	);
};

/** Szene 4: Virale Bilder – die Batman-Silhouette vor dem Feuer, Agenturfotos, Medien in GB und Indien. */
export const BatmanScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const m1 = cue(cues, 'mem1', 6);
	const m2 = cue(cues, 'mem2', m1.to + 6);
	const m3 = cue(cues, 'mem3', m2.to + 6);
	const atCostume = wordFrame(cues, 'Batman-Kostüm', m2.from + 4);
	const atAP = wordFrame(cues, 'AP', m2.from + Math.round((m2.to - m2.from) * 0.45));
	const atReuters = wordFrame(cues, 'Reuters', atAP + 12);
	const atGB = wordFrame(cues, 'Großbritannien', atReuters + 20);
	const atIN = wordFrame(cues, 'Indien', atGB + 20);
	const atQ = wordFrame(cues, 'Demonstrant', m3.from);
	const atNo = wordFrame(cues, 'nicht', m3.from + Math.round((m3.to - m3.from) * 0.7));
	const glow = interpolate(frame, [atCostume, atCostume + 12], [0.2, 1], clamp);
	const cardsOut = interpolate(frame, [atQ - 6, atQ + 6], [1, 0], clamp);
	const flash = [atAP, atReuters].reduce((a, f) => Math.max(a, interpolate(frame, [f, f + 2, f + 8], [0, 0.4, 0], clamp)), 0);
	const ember = (i: number) => {
		const t = ((frame + random(`em-${i}`) * 200) % 120) / 120;
		return {x: 200 + random(`ex-${i}`) * 680 + Math.sin(frame / 10 + i) * 20, y: 880 - t * 560, o: (1 - t) * 0.9};
	};

	return (
		<AbsoluteFill style={{background: 'linear-gradient(#05060F 0%, #120A16 55%, #2A0F0C 100%)'}}>
			<Camera keyframes={[{frame: 0, zoom: 1.08, y: 30}, {frame: durationInFrames, zoom: 1.0, y: 0}]}>
				<AbsoluteFill style={{background: `radial-gradient(circle at 52% 66%, ${withAlpha('#FF7A1F', 0.55 * glow + 0.15)} 0%, rgba(0,0,0,0) 48%)`}} />
				<div style={{position: 'absolute', left: 240, top: 690, width: 600}}>
					<Flames width={600} height={260} seed="street" />
				</div>
				<div style={{position: 'absolute', left: 0, right: 0, top: 360, display: 'flex', justifyContent: 'center', opacity: interpolate(frame, [m1.from, m1.from + 14], [0, 1], clamp)}}>
					<CapedFigure height={560} glow={glow} />
				</div>
				{new Array(26).fill(true).map((_, i) => {
					const e = ember(i);
					return <div key={i} style={{position: 'absolute', left: e.x, top: e.y, width: 6, height: 6, borderRadius: 3, background: '#FFB24A', opacity: e.o}} />;
				})}
			</Camera>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(5,6,15,0.92) 0%, rgba(5,6,15,0.2) 22%, rgba(5,6,15,0) 40%, rgba(5,6,15,0.55) 75%)'}} />
			<AbsoluteFill style={{backgroundColor: '#FFFFFF', opacity: flash}} />

			<SafeArea>
				<Kicker text={BATMAN.kicker} color={COLORS.violet} delay={0} />
				<div style={{marginTop: 12, fontFamily: FONTS.body, fontWeight: 600, fontSize: 24, color: COLORS.textMuted}}>Illustration · keine Originalfotos</div>
			</SafeArea>

			<PhotoFrame label="AP" at={atAP} rotate={-7} x={70} y={372} />
			<PhotoFrame label="REUTERS" at={atReuters} rotate={6} x={600} y={400} />

			{/* Medien, die das Bild aufgriffen */}
			<div style={{position: 'absolute', left: 64, width: 866, top: 850, display: 'flex', flexDirection: 'column', gap: 12, opacity: cardsOut}}>
				<PopIn delay={atGB - 2} from="left">
					<NewsCard m={mediaById('independent')} headlineSize={28} />
				</PopIn>
				<PopIn delay={atIN - 2} from="right">
					<NewsCard m={mediaById('fpj')} headlineSize={28} showTranslation={false} />
				</PopIn>
			</div>

			{/* Wer war das? – nicht bekannt */}
			<div style={{position: 'absolute', left: 64, width: 866, top: 930, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
				{frame >= atQ ? (
					<PopIn delay={atQ}>
						<Pill color={COLORS.signal} size={40}>
							{BATMAN.question}
						</Pill>
					</PopIn>
				) : null}
				<Stamp text="NICHT BEKANNT" at={atNo} color={COLORS.signal} rotate={-5} size={70} />
			</div>
			{/* Quelle oben unter der Kennzeichnung – unten liegen die Medienkarten */}
			<div style={{position: 'absolute', left: 64, width: 866, top: 296, opacity: interpolate(frame, [atAP, atAP + 10], [0, 1], clamp)}}>
				<SourceCredit sources={BATMAN.sources} />
			</div>

			<Sfx name="riser" at={m1.from} volume={0.7} />
			<Sfx name="softImpact" at={atCostume} volume={0.7} />
			<Sfx name="click" at={atAP} volume={1.4} />
			<Sfx name="paper" at={atAP + 2} />
			<Sfx name="click" at={atReuters} volume={1.4} />
			<Sfx name="paper" at={atReuters + 2} />
			<Sfx name="typewriter" at={atGB} />
			<Sfx name="typewriter" at={atIN} />
			<Sfx name="notify" at={atQ} />
			<Sfx name="stamp" at={atNo} />
		</AbsoluteFill>
	);
};
