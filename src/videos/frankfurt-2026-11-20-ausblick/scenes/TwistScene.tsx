import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {GradientSky} from '../../../components/backgrounds/GradientSky';
import {SafeArea} from '../../../components/layout/SafeArea';
import {Kicker} from '../../../components/text/Kicker';
import {clamp, EASE_IN_OUT, springIn} from '../../../lib/animation';
import {COLORS, FONTS, RADII} from '../../../theme/tokens';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {TWIST} from '../content';
import {GlassShop} from './ShopsScene';

/** Comic-Handwerker (stilisiert, ohne reale Person): Helm, Latzhose, Werkzeugkoffer, schwenkender Akkuschrauber. */
const Craftsman: React.FC<{height: number; drill: number}> = ({height, drill}) => (
	<svg height={height} viewBox="0 0 260 420">
		{/* Beine */}
		<rect x={92} y={300} width={30} height={100} rx={10} fill="#2B3A6B" />
		<rect x={138} y={300} width={30} height={100} rx={10} fill="#2B3A6B" />
		<ellipse cx={104} cy={404} rx={26} ry={12} fill="#1A1A22" />
		<ellipse cx={156} cy={404} rx={26} ry={12} fill="#1A1A22" />
		{/* Latzhose */}
		<path d="M78 170 Q130 150 182 170 L188 310 L72 310 Z" fill="#2E6BFF" />
		<rect x={104} y={186} width={52} height={40} rx={6} fill="#2558D8" />
		{/* Arme */}
		<path d="M78 180 Q40 230 54 280" stroke="#F2C9A0" strokeWidth={24} strokeLinecap="round" fill="none" />
		<g transform={`rotate(${-20 + drill * 25} 182 180)`}>
			<path d="M182 180 Q230 190 236 150" stroke="#F2C9A0" strokeWidth={24} strokeLinecap="round" fill="none" />
			<rect x={222} y={110} width={26} height={44} rx={6} fill={COLORS.signal} />
			<rect x={230} y={86} width={8} height={26} fill="#9AA5C8" />
		</g>
		{/* Kopf + Helm */}
		<circle cx={130} cy={118} r={44} fill="#F2C9A0" />
		<path d="M82 110 Q84 60 130 58 Q176 60 178 110 Z" fill={COLORS.signal} />
		<rect x={74} y={104} width={112} height={12} rx={6} fill="#E5B800" />
		<circle cx={114} cy={126} r={5} fill="#0B1029" />
		<circle cx={146} cy={126} r={5} fill="#0B1029" />
		<path d="M112 146 Q130 160 148 146" stroke="#0B1029" strokeWidth={5} fill="none" strokeLinecap="round" />
		{/* Werkzeugkoffer */}
		<rect x={18} y={280} width={74} height={54} rx={8} fill="#D9381E" />
		<path d="M38 280 v-12 h34 v12" stroke="#7A1E10" strokeWidth={6} fill="none" />
	</svg>
);

/** Szene 6 – Plot-Twist: „Und wer gewinnt am 20.11.?“ → nicht Politik, nicht Polizei → der Unternehmer mit den Holzplatten (erfundene Firma). */
export const TwistScene: React.FC<SceneProps> = ({cues}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t1 = cue(cues, 'tw1', 6);
	const t2 = cue(cues, 'tw2', t1.to + 10);
	const t3 = cue(cues, 'tw3', t2.to + 6);
	const atPolitics = wordFrame(cues, 'Politik', t2.from + 4);
	const atPolice = wordFrame(cues, 'Polizei', atPolitics + 20);
	const atGuy = wordFrame(cues, 'Typ', atPolice + 25);
	const atCompany = wordFrame(cues, 'Firma', atGuy + 25);
	const atScrew = wordFrame(cues, 'Holzplatte', t3.to - 20);
	const qIn = springIn({frame, fps, delay: t1.from, damping: 11});
	const toReveal = interpolate(frame, [atGuy - 8, atGuy + 6], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const guy = springIn({frame, fps, delay: atGuy - 4, damping: 11, stiffness: 160});
	const sign = springIn({frame, fps, delay: atCompany - 2, damping: 10, stiffness: 180});
	const drill = (Math.sin(frame / 2.2) + 1) / 2;
	const check = springIn({frame, fps, delay: atScrew + 4, damping: 10, stiffness: 200});
	const coins = frame >= atCompany + 6;

	return (
		<AbsoluteFill>
			<GradientSky stops={['#1A1036', '#2A1A52', '#4A2A62', '#7A3A5A']} glowY={0.7} glowColor="#FFB45A" glowStrength={0.35} />
			<SafeArea>
				<Kicker text="PLOT-TWIST" color={COLORS.violet} delay={0} />
			</SafeArea>

			{/* Frage + durchgestrichene „Kandidaten“ */}
			<div style={{position: 'absolute', left: 64, width: 866, top: 300, opacity: 1 - toReveal, scale: String(1 - toReveal * 0.1)}}>
				<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 96, lineHeight: 1.0, color: COLORS.text, opacity: Math.min(1, qIn * 2), translate: `0 ${(1 - qIn) * 60}px`}}>
					{TWIST.question.split(' AM ')[0]}
					<br />
					<span style={{color: COLORS.signal}}>AM 20.11.?</span>
				</div>
				<div style={{display: 'flex', gap: 24, marginTop: 50}}>
					{TWIST.losers.map((l, i) => {
						const at = i === 0 ? atPolitics : atPolice;
						const s = springIn({frame, fps, delay: at - 2, damping: 12});
						const strike = interpolate(frame, [at + 8, at + 16], [0, 1], clamp);
						if (frame < at - 2) return null;
						return (
							<div key={l} style={{position: 'relative', padding: '18px 34px', borderRadius: RADII.md, background: 'rgba(7,10,28,0.9)', border: '3px solid #B4BEDC', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 52, color: COLORS.text, scale: String(0.7 + 0.3 * s), opacity: Math.min(1, s * 2)}}>
								{l}
								<div style={{position: 'absolute', left: 10, right: 10, top: '50%', height: 8, borderRadius: 4, background: COLORS.alert, scale: `${strike} 1`, transformOrigin: '0% 50%', rotate: '-6deg'}} />
							</div>
						);
					})}
				</div>
			</div>

			{/* Auflösung: Unternehmer + Schaufenster + erfundenes Firmenschild */}
			{toReveal > 0.01 ? (
				<div style={{position: 'absolute', inset: 0, opacity: toReveal}}>
					<div style={{position: 'absolute', left: 320, top: 620}}>
						<GlassShop width={640} boardFrom={atGuy + 20} boards={3} label="STORE" />
					</div>
					<div style={{position: 'absolute', left: 60, top: 620, scale: String(guy), transformOrigin: '50% 100%'}}>
						<Craftsman height={520} drill={drill} />
					</div>
					<div
						style={{
							position: 'absolute',
							left: 64,
							width: 866,
							top: 300,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: 10,
							rotate: `${(1 - sign) * -12}deg`,
							scale: String(sign),
						}}
					>
						<div style={{padding: '16px 30px', borderRadius: RADII.md, background: '#FFF6E0', border: '6px solid #8A5A2E', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 52, color: '#5A3A1A', textAlign: 'center', lineHeight: 1.05}}>
							{TWIST.company}
						</div>
						<span style={{padding: '4px 14px', borderRadius: 8, background: COLORS.violet, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 24, color: '#FFFFFF'}}>FIKTION · {TWIST.fictional}</span>
					</div>
					{coins
						? new Array(10).fill(true).map((_, i) => {
								const t = ((frame - atCompany - 6 + i * 7) % 50) / 50;
								return (
									<div
										key={i}
										style={{
											position: 'absolute',
											left: 120 + random(`coin-${i}`) * 820,
											top: 560 - t * 260,
											width: 46,
											height: 46,
											borderRadius: 23,
											background: COLORS.signal,
											border: '4px solid #E5B800',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											fontFamily: FONTS.heading,
											fontWeight: 900,
											fontSize: 26,
											color: '#8A6A00',
											opacity: (1 - t) * 0.9,
										}}
									>
										€
									</div>
								);
							})
						: null}
					{frame >= atScrew + 4 ? (
						<div style={{position: 'absolute', left: 560, top: 760, scale: String(check), opacity: Math.min(1, check * 2)}}>
							<svg width={220} height={220} viewBox="0 0 24 24" fill="none" stroke={COLORS.green} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" style={{filter: `drop-shadow(0 0 20px ${COLORS.green})`}}>
								<path d="M4 12l5 5L20 6" />
							</svg>
						</div>
					) : null}
				</div>
			) : null}

			<Sfx name="riser" at={t1.from} volume={0.5} />
			<Sfx name="stamp" at={atPolitics + 8} volume={0.6} />
			<Sfx name="stamp" at={atPolice + 8} volume={0.6} />
			<Sfx name="whoosh" at={atGuy - 8} />
			<Sfx name="pop" at={atGuy - 4} />
			<Sfx name="cash" at={atCompany + 4} />
			{[0, 1, 2].map((i) => (
				<Sfx key={`d-${i}`} name="click" at={atGuy + 20 + i * 6} volume={0.8} />
			))}
			<Sfx name="softImpact" at={atScrew + 4} volume={0.6} />
		</AbsoluteFill>
	);
};
