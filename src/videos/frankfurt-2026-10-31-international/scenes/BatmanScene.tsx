import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {Camera} from '../../../components/camera/Camera';
import {SafeArea} from '../../../components/layout/SafeArea';
import {Flag} from '../../../components/media/flags/Flag';
import {MediaBadge} from '../../../components/media/MediaBadge';
import {SourceCredit} from '../../../components/media/SourceCredit';
import {Kicker} from '../../../components/text/Kicker';
import {clamp, EASE_IN_OUT, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {COLORS, FONTS, RADII} from '../../../theme/tokens';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {BATMAN, BATMAN_ACCOUNT, mediaById} from '../content';
import {NewsCard, Pill, PopIn} from '../ui';

/** Stilisierte Flammen (SVG), flackern deterministisch. */
export const Flames: React.FC<{width: number; height: number; seed: string}> = ({width, height, seed}) => {
	const frame = useCurrentFrame();
	const tongues = 7;
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
				const w = (width / tongues) * 1.6;
				const sway = Math.sin(frame / 7 + i * 1.3) * w * 0.25;
				const d = `M ${cx - w / 2} ${height} Q ${cx - w / 2 + sway} ${height - h * 0.5} ${cx + sway * 1.6} ${height - h} Q ${cx + w / 2 + sway} ${height - h * 0.5} ${cx + w / 2} ${height} Z`;
				return <path key={i} d={d} fill={`url(#fl-${seed})`} opacity={0.88} />;
			})}
		</svg>
	);
};

/** Anonyme, stilisierte Kostüm-Silhouette (Umhang, spitze Ohren) – keine reale Person, kein Markenemblem. */
export const CapedFigure: React.FC<{height: number; glow: number}> = ({height, glow}) => (
	<svg height={height} viewBox="0 0 200 320" style={{filter: `drop-shadow(0 0 ${18 * glow}px ${withAlpha('#FF9A2E', 0.8)})`}}>
		<path
			d="M100 18 L88 4 L84 30 Q70 38 72 60 Q74 78 86 84 L60 96 Q40 104 34 140 L10 300 Q60 280 100 288 Q140 280 190 300 L166 140 Q160 104 140 96 L114 84 Q126 78 128 60 Q130 38 116 30 L112 4 Z"
			fill="#05060F"
		/>
		<path d="M86 52 h10 M104 52 h10" stroke={withAlpha('#FFE38A', 0.35 + 0.3 * glow)} strokeWidth={3} strokeLinecap="round" />
	</svg>
);

/** Kleines Feuer-Batman-Motiv (für Profilbild/Kacheln) – eigene Illustration. */
const FireBadge: React.FC<{size: number}> = ({size}) => (
	<div
		style={{
			width: size,
			height: size,
			borderRadius: size / 2,
			overflow: 'hidden',
			background: 'radial-gradient(circle at 50% 78%, #FFB24A 0%, #C8401C 38%, #2A0B10 72%, #07040A 100%)',
			display: 'flex',
			alignItems: 'flex-end',
			justifyContent: 'center',
			border: '3px solid #2B3A6B',
			flexShrink: 0,
		}}
	>
		<CapedFigure height={size * 0.82} glow={0.5} />
	</div>
);

/**
 * Straßenszene nach der Atmosphäre-Referenz des Kanalbetreibers: enge Gasse, Laternen, brennender Container,
 * Menschen filmen mit Handys (eigene Illustration, keine erkennbaren Personen).
 */
const StreetNight: React.FC<{phonesFrom: number; figureAt: number}> = ({phonesFrom, figureAt}) => {
	const frame = useCurrentFrame();
	const glow = interpolate(frame, [figureAt, figureAt + 12], [0.25, 1], clamp);
	const flick = 0.85 + 0.15 * Math.sin(frame / 2.3) * Math.sin(frame / 5.1);
	const windows = (side: 'l' | 'r') =>
		new Array(14).fill(true).map((_, i) => {
			const col = i % 2;
			const row = Math.floor(i / 2);
			const lit = random(`win-${side}-${i}`) > 0.55;
			const x = side === 'l' ? 40 + col * 150 - row * 6 : 820 - col * 150 + row * 6;
			const y = 260 + row * 120;
			return <rect key={`${side}-${i}`} x={x} y={y} width={90} height={70} rx={4} fill={lit ? '#FFD98A' : '#1B1A2A'} opacity={lit ? 0.55 : 0.8} />;
		});

	return (
		<AbsoluteFill>
			<svg width={1080} height={1920} viewBox="0 0 1080 1920">
				<defs>
					<radialGradient id="fireglow" cx="50%" cy="58%" r="45%">
						<stop offset="0" stopColor="#FF8A2A" stopOpacity={0.55 * flick} />
						<stop offset="1" stopColor="#FF8A2A" stopOpacity="0" />
					</radialGradient>
					<radialGradient id="lamp" cx="50%" cy="50%" r="50%">
						<stop offset="0" stopColor="#FFE2A0" stopOpacity="0.9" />
						<stop offset="1" stopColor="#FFE2A0" stopOpacity="0" />
					</radialGradient>
				</defs>
				<rect width={1080} height={1920} fill="#0A0812" />
				{/* Fassaden links/rechts, Fluchtpunkt in der Bildmitte */}
				<polygon points="0,0 400,520 400,1080 0,1500" fill="#3A2A22" />
				<polygon points="1080,0 680,520 680,1080 1080,1500" fill="#4A3826" />
				<polygon points="400,520 680,520 680,1080 400,1080" fill="#1C1620" />
				{windows('l')}
				{windows('r')}
				{/* Straße */}
				<polygon points="0,1500 400,1080 680,1080 1080,1500 1080,1920 0,1920" fill="#2A211C" />
				<circle cx={450} cy={600} r={90} fill="url(#lamp)" />
				<circle cx={630} cy={560} r={70} fill="url(#lamp)" />
				<rect width={1080} height={1920} fill="url(#fireglow)" />
				{/* Container */}
				<rect x={455} y={1110} width={170} height={110} rx={10} fill="#141018" stroke="#2A2230" strokeWidth={4} />
			</svg>
			<div style={{position: 'absolute', left: 430, top: 950, width: 220}}>
				<Flames width={220} height={190} seed="container" />
			</div>
			<div style={{position: 'absolute', left: 640, top: 930, opacity: interpolate(frame, [figureAt - 4, figureAt + 8], [0, 1], clamp)}}>
				<CapedFigure height={300} glow={glow} />
			</div>
			{/* Vordergrund: Menschen filmen (Silhouetten mit leuchtenden Displays) */}
			{new Array(9).fill(true).map((_, i) => {
				const x = 20 + i * 118 + (random(`p-${i}`) - 0.5) * 30;
				const y = 1340 + random(`py-${i}`) * 120;
				const phone = frame >= phonesFrom + i * 3;
				return (
					<div key={i} style={{position: 'absolute', left: x, top: y}}>
						<div style={{width: 96, height: 96, borderRadius: 48, background: '#07060C'}} />
						<div style={{width: 150, height: 260, marginLeft: -27, marginTop: -8, borderRadius: '70px 70px 0 0', background: '#07060C'}} />
						{phone ? (
							<div
								style={{
									position: 'absolute',
									left: 30 + (i % 2) * 20,
									top: -70,
									width: 38,
									height: 64,
									borderRadius: 8,
									background: '#9FD8FF',
									boxShadow: '0 0 30px rgba(159,216,255,0.8)',
									opacity: 0.85 + 0.15 * Math.sin((frame + i * 7) / 4),
								}}
							/>
						) : null}
					</div>
				);
			})}
			{new Array(24).fill(true).map((_, i) => {
				const t = ((frame + random(`em-${i}`) * 200) % 110) / 110;
				return (
					<div
						key={`e-${i}`}
						style={{position: 'absolute', left: 470 + random(`ex-${i}`) * 150 + Math.sin(frame / 10 + i) * 18, top: 1080 - t * 420, width: 6, height: 6, borderRadius: 3, background: '#FFB24A', opacity: (1 - t) * 0.9}}
					/>
				);
			})}
		</AbsoluteFill>
	);
};

/** Nachgestellter Agenturfoto-Rahmen (Illustration, kein Originalfoto). */
const PhotoFrame: React.FC<{label: string; at: number; rotate: number; x: number; y: number; out: number}> = ({label, at, rotate, x, y, out}) => {
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
				width: 280,
				padding: '10px 10px 12px',
				background: '#F4F1EA',
				borderRadius: 6,
				boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
				rotate: `${rotate * s}deg`,
				scale: String((0.5 + 0.5 * s) * (1 - out * 0.3)),
				opacity: Math.min(1, s * 1.5) * (1 - out),
			}}
		>
			<div style={{height: 170, borderRadius: 3, overflow: 'hidden', background: 'radial-gradient(circle at 50% 80%, #FF9A2E 0%, #6B1F12 45%, #0A0710 85%)', display: 'flex', justifyContent: 'center', alignItems: 'flex-end'}}>
				<CapedFigure height={140} glow={0.6} />
			</div>
			<div style={{marginTop: 8, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 27, color: '#0B1029'}}>AGENTURFOTO · {label}</div>
			<div style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, color: '#4A5170'}}>Illustration</div>
		</div>
	);
};

/** Nachgebaute (neutrale) Profilansicht – KEIN Screenshot, kein Gesicht, kein Plattform-Logo. */
const ProfileMock: React.FC<{at: number; viewsAt: number}> = ({at, viewsAt}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = springIn({frame, fps, delay: at, damping: 15});
	if (frame < at - 1) return null;
	const a = BATMAN_ACCOUNT;
	return (
		<div
			style={{
				position: 'absolute',
				left: 140,
				width: 740,
				top: 300,
				padding: '26px 26px 22px',
				borderRadius: 40,
				background: '#05060B',
				border: '3px solid #2B3A6B',
				boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
				translate: `0 ${(1 - s) * 900}px`,
				display: 'flex',
				flexDirection: 'column',
				gap: 18,
			}}
		>
			<div style={{display: 'flex', alignItems: 'center', gap: 22}}>
				<FireBadge size={150} />
				<div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
					<MediaBadge name={a.platform} size="sm" accent={COLORS.cyan} />
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 46, color: COLORS.text}}>{a.handle}</span>
					<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 27, color: COLORS.textMuted}}>
						{a.followers} Follower · {a.likes} Likes
					</span>
				</div>
			</div>
			<div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10}}>
				{a.clipViews.map((v, i) => {
					const t = springIn({frame, fps, delay: viewsAt + i * 5, damping: 12});
					return (
						<div
							key={v}
							style={{
								height: 300,
								borderRadius: 14,
								overflow: 'hidden',
								position: 'relative',
								background: i === 1 ? 'linear-gradient(#1B2244, #0A0D20)' : 'radial-gradient(circle at 50% 78%, #FF9A2E 0%, #6B1F12 42%, #0A0710 85%)',
								display: 'flex',
								alignItems: 'flex-end',
								justifyContent: 'center',
							}}
						>
							<CapedFigure height={i === 1 ? 230 : 200} glow={i === 1 ? 0.1 : 0.6} />
							<div
								style={{
									position: 'absolute',
									left: 10,
									bottom: 10,
									display: 'flex',
									alignItems: 'center',
									gap: 6,
									padding: '4px 10px',
									borderRadius: 8,
									background: 'rgba(0,0,0,0.65)',
									opacity: t,
									scale: String(0.7 + 0.3 * t),
								}}
							>
								<svg width={20} height={20} viewBox="0 0 24 24" fill="#FFFFFF">
									<path d="M7 4l13 8-13 8z" />
								</svg>
								<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 27, color: COLORS.text}}>{v}</span>
							</div>
						</div>
					);
				})}
			</div>
			<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, color: COLORS.textDim}}>{a.stand}</span>
		</div>
	);
};

/**
 * Szene 4: Virale Bilder – Batman. Straßenszene (Handys filmen), Agenturfotos (AP/Reuters), Medien GB/IN,
 * dann die Selbstdarstellung des TikTok-Accounts @ichbinyounes und „Social-Media-Moment der Nacht“.
 */
export const BatmanScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const v1 = cue(cues, 'viral1', 6);
	const b1 = cue(cues, 'bat1', v1.to + 6);
	const b2 = cue(cues, 'bat2', b1.to + 6);
	const b3 = cue(cues, 'bat3', b2.to + 6);
	const atImages = wordFrame(cues, 'Bilder', v1.from + 20);
	const atBatman = wordFrame(cues, 'Batman', b1.from + 8);
	const atAP = wordFrame(cues, 'AP', b1.from + Math.round((b1.to - b1.from) * 0.35));
	const atReuters = wordFrame(cues, 'Reuters', atAP + 10);
	const atGB = wordFrame(cues, 'Großbritannien', atReuters + 20);
	const atIN = wordFrame(cues, 'Indien', atGB + 18);
	const atTikTok = wordFrame(cues, 'TikTok', b2.from + 2);
	const atViews = wordFrame(cues, 'Hunderttausenden', b2.from + Math.round((b2.to - b2.from) * 0.7));
	const atMoment = wordFrame(cues, 'wiedererkennbarer', b3.from + 10);
	const toProfile = interpolate(frame, [atTikTok - 10, atTikTok + 4], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const flash = [atAP, atReuters].reduce((acc, f) => Math.max(acc, interpolate(frame, [f, f + 2, f + 8], [0, 0.4, 0], clamp)), 0);

	return (
		<AbsoluteFill style={{backgroundColor: '#07060C'}}>
			<Camera keyframes={[{frame: 0, zoom: 1.12, y: 40}, {frame: atTikTok, zoom: 1.0, y: 0}, {frame: durationInFrames, zoom: 1.06, y: -20}]}>
				<StreetNight phonesFrom={atImages - 4} figureAt={atBatman} />
			</Camera>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(5,6,15,0.92) 0%, rgba(5,6,15,0.25) 22%, rgba(5,6,15,0) 40%)'}} />
			<AbsoluteFill style={{backgroundColor: '#05060F', opacity: toProfile * 0.72}} />
			<AbsoluteFill style={{backgroundColor: '#FFFFFF', opacity: flash}} />

			<SafeArea>
				<Kicker text={BATMAN.kicker} color={COLORS.violet} delay={0} />
				<div style={{marginTop: 12, fontFamily: FONTS.body, fontWeight: 600, fontSize: 24, color: COLORS.textMuted}}>Illustration · keine Originalfotos</div>
			</SafeArea>

			{/* Agenturfotos + Medien (bis TikTok-Teil) */}
			<PhotoFrame label="AP" at={atAP} rotate={-7} x={70} y={380} out={toProfile} />
			<PhotoFrame label="REUTERS" at={atReuters} rotate={6} x={640} y={410} out={toProfile} />
			<div style={{position: 'absolute', left: 64, width: 866, top: 700, display: 'flex', flexDirection: 'column', gap: 12, opacity: 1 - toProfile}}>
				<PopIn delay={atGB - 2} from="left">
					<NewsCard m={mediaById('independent')} headlineSize={28} />
				</PopIn>
				<PopIn delay={atIN - 2} from="right">
					<div style={{display: 'flex', gap: 12, flexWrap: 'wrap'}}>
						{BATMAN.media.slice(1).map((id) => {
							const m = mediaById(id);
							return (
								<div key={id} style={{display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', borderRadius: RADII.pill, background: 'rgba(8,12,32,0.92)', border: `2px solid ${COLORS.panelBorder}`}}>
									<Flag code={m.country} width={40} rounded={4} shadow={false} />
									<MediaBadge name={m.outlet} size="sm" />
									<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted}}>{m.land}</span>
								</div>
							);
						})}
					</div>
				</PopIn>
			</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 296, opacity: interpolate(frame, [atAP, atAP + 10], [0, 1], clamp) * (1 - toProfile)}}>
				<SourceCredit sources={BATMAN.sources} />
			</div>

			{/* TikTok: Selbstdarstellung des Accounts */}
			<ProfileMock at={atTikTok - 6} viewsAt={atViews - 4} />
			<div style={{position: 'absolute', left: 64, width: 866, top: 1170, opacity: interpolate(frame, [atTikTok + 6, atTikTok + 16], [0, 1], clamp)}}>
				<div style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, color: COLORS.textMuted, lineHeight: 1.3}}>{BATMAN_ACCOUNT.note}</div>
			</div>
			{frame >= atMoment - 4 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 1010, display: 'flex', justifyContent: 'center'}}>
					<PopIn delay={atMoment - 4} from="bottom">
						<Pill color={COLORS.signal} dark={false} size={36}>
							{BATMAN.moment}
						</Pill>
					</PopIn>
				</div>
			) : null}

			<Sfx name="riser" at={v1.from} volume={0.6} />
			{new Array(4).fill(true).map((_, i) => (
				<Sfx key={`ph-${i}`} name="click" at={atImages - 4 + i * 6} volume={0.6} />
			))}
			<Sfx name="softImpact" at={atBatman} volume={0.7} />
			<Sfx name="click" at={atAP} volume={1.4} />
			<Sfx name="paper" at={atAP + 2} />
			<Sfx name="click" at={atReuters} volume={1.4} />
			<Sfx name="paper" at={atReuters + 2} />
			<Sfx name="typewriter" at={atGB} />
			<Sfx name="pop" at={atIN} />
			<Sfx name="whoosh" at={atTikTok - 10} volume={0.8} />
			<Sfx name="notify" at={atTikTok + 2} />
			{BATMAN_ACCOUNT.clipViews.map((v, i) => (
				<Sfx key={`v-${v}`} name="pop" at={atViews - 4 + i * 5} volume={0.7} />
			))}
			<Sfx name="notify" at={atMoment - 4} />
			<Sfx name="softImpact" at={atMoment} volume={0.6} />
		</AbsoluteFill>
	);
};
