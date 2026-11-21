import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, EASE_IN_OUT, springIn} from '../../../../lib/animation';
import {withAlpha} from '../../../../lib/color';
import {COLORS, FONTS} from '../../../../theme/tokens';
import {cue, type SceneProps, wordFrame} from '../../../frankfurt-2026-10-31/cues';
import {TWIST} from '../../content';
import {Craftsman} from '../Craftsman';
import {GlassCard, Icon, type IconName, SectionLabel, STATUS} from '../kit';
import {Storefront} from '../Storefront';
import {Studio} from '../Studio';
import {StreetBackdrop} from './ShopsPremium';

const VIOLET = '#B794F6';

/** „Kandidat“ mit Icon, wird rot durchgestrichen und entsättigt. */
const Candidate: React.FC<{label: string; icon: IconName; at: number}> = ({label, icon, at}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	if (frame < at - 2) return null;
	const s = springIn({frame, fps, delay: at - 2, damping: 12, stiffness: 170});
	const strike = interpolate(frame, [at + 8, at + 16], [0, 1], {...clamp, easing: EASE_IN_OUT});
	return (
		<div style={{position: 'relative', scale: String((0.6 + 0.4 * s) * (1 - strike * 0.06)), opacity: Math.min(1, s * 2)}}>
			<GlassCard padding="22px 34px" style={{filter: `grayscale(${strike * 0.85}) brightness(${1 - strike * 0.25})`}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 18}}>
					<Icon name={icon} size={60} color="#CFE0FF" stroke={2} />
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 58, color: COLORS.text}}>{label}</span>
				</div>
			</GlassCard>
			<div style={{position: 'absolute', left: -14, right: -14, top: '50%', height: 12, borderRadius: 6, background: COLORS.alert, boxShadow: '0 0 18px rgba(255,77,94,0.8)', scale: `${strike} 1`, transformOrigin: '0% 50%', rotate: '-7deg'}} />
		</div>
	);
};

/** Münzen fliegen im Bogen (Schwerkraft, Drehung über scaleX). */
const CoinBurst: React.FC<{at: number; x: number; y: number; count?: number; seed: string}> = ({at, x, y, count = 14, seed}) => {
	const frame = useCurrentFrame();
	const t = frame - at;
	if (t < 0 || t > 50) return null;
	return (
		<>
			{new Array(count).fill(true).map((_, i) => {
				const a = -Math.PI / 2 + (random(`${seed}-a-${i}`) - 0.5) * 2.4;
				const v = 16 + random(`${seed}-v-${i}`) * 12;
				const px = x + Math.cos(a) * v * t;
				const py = y + Math.sin(a) * v * t + 0.9 * t * t;
				const spin = Math.cos((t + i * 3) / 3);
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: px - 26,
							top: py - 26,
							width: 52,
							height: 52,
							borderRadius: 26,
							background: 'radial-gradient(circle at 35% 30%, #FFF1A8 0%, #FFD23F 45%, #D9A400 100%)',
							border: '3px solid #B88A00',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontFamily: FONTS.heading,
							fontWeight: 900,
							fontSize: 28,
							color: '#8A6400',
							scale: `${Math.max(0.15, Math.abs(spin))} 1`,
							opacity: interpolate(t, [36, 50], [1, 0], clamp),
							boxShadow: '0 6px 14px rgba(0,0,0,0.4)',
						}}
					>
						€
					</div>
				);
			})}
		</>
	);
};

/** Diskussions-Blasen („Frankfurt diskutiert“) – reine Stimmungsillustration, keine Zitate. */
const Bubble: React.FC<{text: string; at: number; x: number; y: number; flip?: boolean}> = ({text, at, x, y, flip}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	if (frame < at - 1) return null;
	const s = springIn({frame, fps, delay: at, damping: 12, stiffness: 180});
	const out = interpolate(frame, [at + 46, at + 58], [1, 0], clamp);
	return (
		<div style={{position: 'absolute', left: x, top: y + Math.sin((frame + x) / 12) * 4, scale: String(0.5 + 0.5 * s), opacity: Math.min(1, s * 2) * out, transformOrigin: flip ? '90% 100%' : '10% 100%'}}>
			<div style={{position: 'relative', padding: '12px 22px', borderRadius: 24, background: '#FFFFFF', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, color: '#0B1029', boxShadow: '0 12px 30px rgba(0,0,0,0.45)'}}>
				{text}
				<div style={{position: 'absolute', [flip ? 'right' : 'left']: 22, bottom: -12, width: 24, height: 24, background: '#FFFFFF', rotate: '45deg'}} />
			</div>
		</div>
	);
};

/** Siegertreppchen im Spotlight mit leuchtendem „?“ – füllt die Bühne, bis die Auflösung kommt. */
const Podium: React.FC<{at: number}> = ({at}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	if (frame < at - 1) return null;
	const s = springIn({frame, fps, delay: at, damping: 14, stiffness: 120});
	const float = Math.sin(frame / 10) * 8;
	const rays = frame * 0.6;
	return (
		<div style={{position: 'absolute', left: 190, top: 780, width: 700, height: 470, opacity: Math.min(1, s * 1.6), translate: `0 ${(1 - s) * 120}px`}}>
			<svg width={700} height={470} viewBox="0 0 700 470" style={{overflow: 'visible'}}>
				<defs>
					<linearGradient id="tw-pod-top" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor="#3A2A6A" />
						<stop offset="1" stopColor="#22184A" />
					</linearGradient>
					<radialGradient id="tw-pod-glow">
						<stop offset="0" stopColor="#FFE9A8" stopOpacity={0.55} />
						<stop offset="1" stopColor="#FFE9A8" stopOpacity={0} />
					</radialGradient>
				</defs>
				{new Array(10).fill(true).map((_, i) => (
					<path key={i} d="M350 150 L330 -260 L370 -260 Z" fill="#FFE9A8" opacity={0.06} transform={`rotate(${i * 36 + rays} 350 150)`} />
				))}
				<circle cx={350} cy={150} r={170} fill="url(#tw-pod-glow)" />
				{/* Stufen 2 · 1 · 3 */}
				<rect x={90} y={300} width={180} height={150} rx={10} fill="url(#tw-pod-top)" stroke="#B794F6" strokeWidth={3} />
				<rect x={260} y={240} width={180} height={210} rx={10} fill="url(#tw-pod-top)" stroke="#FFD23F" strokeWidth={4} />
				<rect x={430} y={330} width={180} height={120} rx={10} fill="url(#tw-pod-top)" stroke="#B794F6" strokeWidth={3} />
				<rect x={90} y={300} width={180} height={14} rx={6} fill="#B794F6" opacity={0.5} />
				<rect x={260} y={240} width={180} height={14} rx={6} fill="#FFD23F" opacity={0.6} />
				<rect x={430} y={330} width={180} height={14} rx={6} fill="#B794F6" opacity={0.5} />
				<text x={180} y={400} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={900} fontSize={64} fill="#B794F6" opacity={0.7}>2</text>
				<text x={350} y={370} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={900} fontSize={84} fill="#FFD23F">1</text>
				<text x={520} y={418} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={900} fontSize={56} fill="#B794F6" opacity={0.7}>3</text>
				<ellipse cx={350} cy={456} rx={320} ry={14} fill="#000000" opacity={0.4} />
				{/* schwebende Frage-Medaille */}
				<g transform={`translate(350 ${150 + float})`}>
					<circle r={86} fill="#FFD23F" stroke="#FFF1A8" strokeWidth={6} />
					<circle r={70} fill="none" stroke="#C99A00" strokeWidth={3} />
					<text y={36} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={900} fontSize={104} fill="#0B1029">?</text>
				</g>
			</svg>
		</div>
	);
};

/** Premium-Szene 6 – Plot-Twist: Spotlight-Frage, Kandidaten gestrichen → Handwerker montiert Platten, erfundene Firma (FIKTION), Münzregen. */
export const TwistPremium: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t1 = cue(cues, 'tw1', 6);
	const t2 = cue(cues, 'tw2', t1.to + 10);
	const t3 = cue(cues, 'tw3', t2.to + 6);
	const atPolitics = wordFrame(cues, 'Politik', t2.from + 4);
	const atPolice = wordFrame(cues, 'Polizei', atPolitics + 20);
	const atGuy = wordFrame(cues, 'Typ', atPolice + 25);
	const atCompany = wordFrame(cues, 'Firma', atGuy + 25);
	const atCity = wordFrame(cues, 'Frankfurt', t3.from + 8);
	const atScrew = wordFrame(cues, 'Holzplatte', t3.to - 20);
	const qIn = springIn({frame, fps, delay: t1.from, damping: 12, stiffness: 140});
	const toReveal = interpolate(frame, [atGuy - 8, atGuy + 6], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const guy = springIn({frame, fps, delay: atGuy - 4, damping: 11, stiffness: 160});
	const sign = springIn({frame, fps, delay: atCompany - 2, damping: 9, stiffness: 160});
	const swing = Math.sin((frame - atCompany) / 9) * 4 * Math.exp(-Math.max(0, frame - atCompany) / 60);
	const boardFrom = atGuy + 20;
	const drillA = interpolate(frame, [boardFrom - 2, boardFrom + 2, boardFrom + 26, boardFrom + 30], [0, 1, 1, 0], clamp);
	const drillB = interpolate(frame, [atScrew - 16, atScrew - 12, atScrew + 2, atScrew + 6], [0, 1, 1, 0], clamp);
	const check = springIn({frame, fps, delay: atScrew + 4, damping: 10, stiffness: 200});
	const spot = interpolate(frame, [0, 40], [0.2, 1], clamp);
	const blink = frame % 90 > 85;
	const [qTop, qBottom] = TWIST.question.split(' AM ');

	return (
		<AbsoluteFill>
			{/* Phase 1: Bühne mit Spotlight */}
			<AbsoluteFill style={{opacity: 1 - toReveal}}>
				<Studio accent={VIOLET} second="#FF7AB8" seed="twist" />
				<AbsoluteFill style={{background: `radial-gradient(ellipse 46% 30% at 50% 30%, rgba(255,240,200,${0.16 * spot}) 0%, rgba(255,240,200,0) 70%)`}} />
				<div style={{position: 'absolute', left: 64, width: 866, top: 300, scale: String(1 - toReveal * 0.1)}}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 104, lineHeight: 1.0, color: COLORS.text, opacity: Math.min(1, qIn * 2), translate: `0 ${(1 - qIn) * 60}px`, textShadow: '0 10px 40px rgba(0,0,0,0.6)'}}>
						{qTop}
						<br />
						<span style={{color: COLORS.signal}}>AM {qBottom}</span>
					</div>
					<div style={{display: 'flex', gap: 26, marginTop: 64}}>
						<Candidate label={TWIST.losers[0]} icon="columns" at={atPolitics} />
						<Candidate label={TWIST.losers[1]} icon="shield" at={atPolice} />
					</div>
				</div>
				<Podium at={t1.from + 14} />
			</AbsoluteFill>

			{/* Phase 2: Auflösung */}
			{toReveal > 0.01 ? (
				<AbsoluteFill style={{opacity: toReveal}}>
					<StreetBackdrop drift={interpolate(frame, [atGuy, durationInFrames], [0, -30], clamp)} />
					<div style={{position: 'absolute', left: 360, top: 560, filter: 'drop-shadow(0 40px 50px rgba(0,0,0,0.6))'}}>
						<Storefront width={560} boardFrom={boardFrom} panes={3} motif="sports" seed="twist-shop" label="STORE" />
					</div>
					<Bubble text="Verbot?" at={atCity - 2} x={430} y={590} />
					<Bubble text="Demo?" at={atCity + 6} x={690} y={660} flip />
					<Bubble text="Polizei?" at={atCity + 14} x={520} y={760} />
					<div style={{position: 'absolute', left: 30, top: 640, scale: String(guy), transformOrigin: '50% 100%'}}>
						<Craftsman height={580} drilling={Math.max(drillA, drillB)} blink={blink} />
					</div>
					{frame >= atScrew + 4 ? (
						<div style={{position: 'absolute', left: 560, top: 840, scale: String(check), opacity: Math.min(1, check * 2)}}>
							<div style={{width: 170, height: 170, borderRadius: 85, background: 'radial-gradient(circle at 35% 30%, #6AF0B8, #22B37A)', border: '6px solid #FFFFFF', boxShadow: '0 0 50px rgba(61,220,151,0.7), 0 20px 40px rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
								<Icon name="check" size={110} color="#FFFFFF" stroke={3.4} />
							</div>
						</div>
					) : null}

					{/* Hängendes Firmenschild (erfunden) */}
					<div style={{position: 'absolute', left: 64, width: 866, top: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', rotate: `${(1 - sign) * -14 + swing}deg`, transformOrigin: '50% 0%', scale: String(0.4 + 0.6 * sign), opacity: Math.min(1, sign * 2)}}>
						<svg width={520} height={70} viewBox="0 0 520 70">
							<path d="M120 0 L80 70 M400 0 L440 70" stroke="#C0C6D8" strokeWidth={5} strokeDasharray="10 6" />
						</svg>
						<div style={{position: 'relative', padding: '22px 36px', borderRadius: 22, background: 'linear-gradient(170deg, #FFF8E8 0%, #F3E2BE 100%)', border: '8px solid #8A5A2E', boxShadow: 'inset 0 0 0 3px #C99A5E, 0 30px 60px rgba(0,0,0,0.55)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 54, color: '#4A2E12', textAlign: 'center', lineHeight: 1.05}}>
							{TWIST.company}
							{[18, 'calc(100% - 30px)'].map((l) => (
								<div key={String(l)} style={{position: 'absolute', left: l, top: 10, width: 12, height: 12, borderRadius: 6, background: '#6A6E80'}} />
							))}
						</div>
						<div style={{marginTop: 14, display: 'flex', alignItems: 'center', gap: 10, padding: '8px 18px', borderRadius: 999, background: STATUS.FIKTION.color, boxShadow: '0 10px 24px rgba(0,0,0,0.4)'}}>
							<Icon name="sparkle" size={26} color="#1A0E36" stroke={2.6} />
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, color: '#1A0E36'}}>FIKTION · {TWIST.fictional}</span>
						</div>
					</div>
					<CoinBurst at={atCompany + 4} x={540} y={420} seed="c1" />
					<CoinBurst at={atScrew + 4} x={640} y={900} count={8} seed="c2" />
				</AbsoluteFill>
			) : null}

			<div style={{position: 'absolute', left: 64, top: 200, opacity: 1 - toReveal}}>
				<SectionLabel text="PLOT-TWIST" color={VIOLET} />
			</div>
			{/* Gegen Überdeckung: Untertitel-Kontrast */}
			<AbsoluteFill style={{background: `linear-gradient(rgba(0,0,0,0) 62%, ${withAlpha('#000000', 0.25)} 72%, rgba(0,0,0,0) 82%)`, pointerEvents: 'none'}} />
		</AbsoluteFill>
	);
};
