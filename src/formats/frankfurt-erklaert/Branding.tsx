import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, EASE_IN_OUT, EASE_OUT, springIn} from '../../lib/animation';
import {withAlpha} from '../../lib/color';
import {BRAND, handleWithAt} from '../../theme/brand';
import {COLORS, FONTS} from '../../theme/tokens';
import {ACCENT, FORMAT, LAYOUT} from './theme';

/** Profilbild „S“ aus src/theme/brand.ts. */
export const BrandAvatar: React.FC<{size: number; ring?: number}> = ({size, ring = 0}) => (
	<div
		style={{
			width: size,
			height: size,
			borderRadius: size / 2,
			background: `linear-gradient(145deg, ${BRAND.avatarGradient[0]}, ${BRAND.avatarGradient[1]})`,
			border: `${Math.max(3, size * 0.05)}px solid #FFFFFF`,
			boxShadow: `0 0 0 ${ring}px ${withAlpha(BRAND.avatarGradient[0], 0.35)}, 0 18px 40px rgba(0,0,0,0.5)`,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			fontFamily: FONTS.heading,
			fontWeight: 900,
			fontSize: size * 0.56,
			color: '#FFFFFF',
		}}
	>
		{BRAND.avatarLetter}
	</div>
);

/**
 * Format-Badge oben links (in jeder Folge gleich): „FRANKFURT ERKLÄRT #01“ mit 60-Sekunden-Ring,
 * der über die Folge abläuft – das Wiedererkennungsmerkmal des Kurzformats.
 */
export const FormatBadge: React.FC<{episode: string; totalFrames: number; hideFrom?: number; showFrom?: number}> = ({episode, totalFrames, hideFrom, showFrom = 2}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const appear = springIn({frame, fps, delay: showFrom, damping: 16, stiffness: 160});
	const out = hideFrom !== undefined ? interpolate(frame, [hideFrom, hideFrom + 8], [1, 0], clamp) : 1;
	const p = Math.min(1, frame / Math.max(1, totalFrames));
	const secondsLeft = Math.max(0, Math.ceil(FORMAT.maxSeconds - frame / fps));
	const r = 20;
	const c = 2 * Math.PI * r;
	return (
		<div style={{position: 'absolute', left: LAYOUT.left, top: LAYOUT.badgeTop, opacity: Math.min(1, appear * 2) * out, translate: `${(1 - appear) * -30}px 0`, display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px 8px 8px', borderRadius: 999, background: 'rgba(6,8,22,0.82)', border: '1.5px solid rgba(255,255,255,0.16)', boxShadow: '0 10px 30px rgba(0,0,0,0.45)'}}>
			<svg width={50} height={50} viewBox="0 0 50 50">
				<circle cx={25} cy={25} r={r} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={5} />
				<circle cx={25} cy={25} r={r} fill="none" stroke={ACCENT.brand} strokeWidth={5} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * p} transform="rotate(-90 25 25)" />
				<text x={25} y={31} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={900} fontSize={17} fill="#FFFFFF">
					{secondsLeft}
				</text>
			</svg>
			<div style={{display: 'flex', flexDirection: 'column', lineHeight: 1}}>
				<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 25, letterSpacing: 2, color: COLORS.text}}>{FORMAT.name}</span>
				<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 22, letterSpacing: 2.5, color: ACCENT.brand, marginTop: 4}}>
					{FORMAT.sub} · {episode}
				</span>
			</div>
		</div>
	);
};

/**
 * Einheitliches Format-Outro (≈ 2,5–3 s): Schriftzug „FRANKFURT ERKLÄRT“ fährt ein, „IN 60 SEKUNDEN“ als roter Balken,
 * Profilbild „S“ + Handle, abschließender Lichtschweif. Keine Stimme nötig – liegt unter dem Schluss-Satz.
 */
export const ShortOutro: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t1 = springIn({frame, fps, delay: 0, damping: 14, stiffness: 190});
	const t2 = springIn({frame, fps, delay: 6, damping: 13, stiffness: 190});
	const av = springIn({frame, fps, delay: 12, damping: 11, stiffness: 180});
	const bar = interpolate(frame, [4, 16], [0, 1], {...clamp, easing: EASE_OUT});
	const sweep = interpolate(frame, [16, 40], [-30, 130], {...clamp, easing: EASE_IN_OUT});
	return (
		<AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 60% at 50% 42%, #2A1030 0%, #12081E 55%, #05030C 100%)', overflow: 'hidden'}}>
			{/* Lichtstreifen */}
			{new Array(10).fill(true).map((_, i) => {
				const y = 200 + random(`ol-y-${i}`) * 1300;
				const x = ((random(`ol-x-${i}`) * 1400 + frame * (14 + random(`ol-v-${i}`) * 18)) % 1600) - 300;
				return <div key={i} style={{position: 'absolute', left: x, top: y, width: 260, height: 3, borderRadius: 2, background: `linear-gradient(90deg, rgba(255,59,78,0), ${withAlpha(i % 2 ? '#FF3B4E' : '#FFD23F', 0.5)}, rgba(255,59,78,0))`}} />;
			})}
			<div style={{position: 'absolute', left: 64, width: 866, top: 560, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
				<div style={{position: 'relative', overflow: 'hidden', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 104, lineHeight: 0.98, letterSpacing: -2, color: COLORS.text, textAlign: 'center', opacity: Math.min(1, t1 * 2), translate: `0 ${(1 - t1) * 60}px`}}>
					FRANKFURT
					<br />
					ERKLÄRT
					<div style={{position: 'absolute', top: 0, bottom: 0, left: `${sweep}%`, width: 120, background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.4), rgba(255,255,255,0))'}} />
				</div>
				<div style={{position: 'relative', padding: '10px 28px', borderRadius: 14, overflow: 'hidden', opacity: Math.min(1, t2 * 2), scale: String(0.8 + 0.2 * t2)}}>
					<div style={{position: 'absolute', inset: 0, background: ACCENT.brand, scale: `${bar} 1`, transformOrigin: '0% 50%', borderRadius: 14}} />
					<span style={{position: 'relative', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 44, letterSpacing: 6, color: '#FFFFFF'}}>{FORMAT.sub}</span>
				</div>
				<div style={{marginTop: 34, display: 'flex', alignItems: 'center', gap: 18, opacity: Math.min(1, av * 2), scale: String(0.6 + 0.4 * av)}}>
					<BrandAvatar size={110} ring={6 + Math.sin(frame / 4) * 3} />
					<div style={{display: 'flex', flexDirection: 'column'}}>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, color: COLORS.text}}>{handleWithAt()}</span>
						<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 26, color: COLORS.signal}}>Folgen für mehr</span>
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};

/**
 * Format-Intro (≈ 1,5–2 s, liegt unter „Ewa, Frankfurt!“): „FRANKFURT ERKLÄRT“ mit Lichtkante, roter Balken
 * „IN 60 SEKUNDEN“. Ab Frame 0 lesbar (TikTok-Vorschaubild), fliegt bei `outAt` nach oben weg.
 */
export const IntroSting: React.FC<{outAt: number; top?: number}> = ({outAt, top = 560}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t1 = springIn({frame, fps, delay: -24, damping: 15, stiffness: 170});
	const bar = interpolate(frame, [-14, 0], [0, 1], {...clamp, easing: EASE_OUT});
	const sweep = interpolate(frame, [4, 30], [-30, 130], {...clamp, easing: EASE_IN_OUT});
	const out = interpolate(frame, [outAt, outAt + 10], [0, 1], {...clamp, easing: EASE_IN_OUT});
	if (out >= 1) return null;
	return (
		<div style={{position: 'absolute', left: LAYOUT.left, width: LAYOUT.width, top, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, opacity: 1 - out, translate: `0 ${-out * 160}px`, scale: String(1 + out * 0.25)}}>
			<div style={{position: 'relative', overflow: 'hidden', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 112, lineHeight: 0.96, letterSpacing: -2, color: COLORS.text, textAlign: 'center', textShadow: '0 12px 50px rgba(0,0,0,0.75)', opacity: Math.min(1, t1 * 2), translate: `0 ${(1 - t1) * 50}px`}}>
				FRANKFURT
				<br />
				ERKLÄRT
				<div style={{position: 'absolute', top: 0, bottom: 0, left: `${sweep}%`, width: 120, background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.45), rgba(255,255,255,0))'}} />
			</div>
			<div style={{position: 'relative', padding: '10px 30px', borderRadius: 14, overflow: 'hidden'}}>
				<div style={{position: 'absolute', inset: 0, background: ACCENT.brand, scale: `${bar} 1`, transformOrigin: '0% 50%', borderRadius: 14, boxShadow: `0 12px 40px ${withAlpha(ACCENT.brand, 0.5)}`}} />
				<span style={{position: 'relative', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 48, letterSpacing: 6, color: '#FFFFFF', opacity: bar}}>{FORMAT.sub}</span>
			</div>
		</div>
	);
};
