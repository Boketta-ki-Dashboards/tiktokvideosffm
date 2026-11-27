import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {Clouds} from '../../../components/backgrounds/Clouds';
import {EmergencyLights} from '../../../components/backgrounds/EmergencyLights';
import {FrankfurtSkyline} from '../../../components/backgrounds/FrankfurtSkyline';
import {GradientSky} from '../../../components/backgrounds/GradientSky';
import {Stars} from '../../../components/backgrounds/Stars';
import {Camera} from '../../../components/camera/Camera';
import {SafeArea} from '../../../components/layout/SafeArea';
import {Kicker} from '../../../components/text/Kicker';
import {clamp, EASE_OUT, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {COLORS, FONTS, RADII} from '../../../theme/tokens';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {HOOK} from '../content';
import {StatusChip} from '../ui';

/** Gesplitterte Glasscheibe (stilisiert) als Rückblick auf den 31.10. */
const Cracks: React.FC<{opacity: number}> = ({opacity}) => (
	<svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0, opacity}}>
		{new Array(14).fill(true).map((_, i) => {
			const a = (i / 14) * Math.PI * 2 + random(`c-${i}`) * 0.3;
			const len = 260 + random(`l-${i}`) * 520;
			const x2 = 540 + Math.cos(a) * len;
			const y2 = 880 + Math.sin(a) * len;
			const mx = 540 + Math.cos(a + 0.1) * len * 0.5;
			const my = 880 + Math.sin(a + 0.1) * len * 0.5;
			return <path key={i} d={`M540 880 L${mx} ${my} L${x2} ${y2}`} stroke="rgba(220,235,255,0.75)" strokeWidth={3} fill="none" />;
		})}
		{[90, 190, 320].map((r) => (
			<circle key={r} cx={540} cy={880} r={r} stroke="rgba(220,235,255,0.35)" strokeWidth={2} fill="none" strokeDasharray="40 30" />
		))}
	</svg>
);

/** Szene 1 – Hook: 31.10. (Rückblick, Blaulicht, Scherben) → harter Wechsel auf 20.11. → „WIEDER HALLOWEEN 2.0?“ */
export const HookScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
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
	const flip = springIn({frame, fps, delay: flipAt, damping: 11, stiffness: 200});
	const shake = before ? 0 : Math.max(0, 1 - (frame - flipAt) / 8) * Math.sin(frame * 3) * 14;
	const qIn = springIn({frame, fps, delay: qAt - 2, damping: 12});
	const push = interpolate(frame, [0, durationInFrames], [0, 1], clamp);

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night}}>
			<Camera keyframes={[{frame: 0, zoom: 1.12, y: 30}, {frame: durationInFrames, zoom: 1.0 + push * 0.04, y: 0}]} shake={before ? 3 : 0}>
				<GradientSky stops={before ? ['#08051A', '#2A0D2E', '#5A1A2E', '#A4322E'] : ['#050920', '#121446', '#2A1D52', '#4A2A62']} glowY={0.72} glowColor={before ? '#E2552E' : '#7C5CFF'} glowStrength={0.45} />
				<Stars count={90} maxY={0.4} opacity={0.6} />
				<Clouds count={5} opacity={0.07} band={[0.1, 0.36]} speed={0.5} />
				<AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center'}}>
					<FrankfurtSkyline width={1560} litRatio={0.28} style={{marginBottom: -40}} />
				</AbsoluteFill>
				{before ? <EmergencyLights intensity={0.55} y={0.8} /> : null}
			</Camera>
			{before ? <Cracks opacity={interpolate(frame, [2, 8], [0, 1], clamp)} /> : null}
			<AbsoluteFill style={{background: 'linear-gradient(rgba(6,9,26,0.85) 0%, rgba(6,9,26,0.35) 50%, rgba(6,9,26,0) 70%)'}} />

			<SafeArea>
				<Kicker text={before ? 'RÜCKBLICK · HALLOWEEN' : 'AUSBLICK · FRANKFURT'} color={before ? COLORS.alert : COLORS.signal} live delay={-20} />
				{/* Große Datumsanzeige */}
				<div style={{marginTop: 40, translate: `${shake}px 0`}}>
					<div
						style={{
							fontFamily: FONTS.heading,
							fontWeight: 900,
							fontSize: 168,
							lineHeight: 1,
							letterSpacing: -2,
							color: before ? COLORS.alert : COLORS.text,
							textShadow: '0 8px 30px rgba(0,0,0,0.6)',
							scale: before ? '1' : String(1.25 - 0.25 * flip),
						}}
					>
						{before ? HOOK.before : HOOK.after}
					</div>
					{before ? (
						<div style={{marginTop: 6, fontFamily: FONTS.body, fontWeight: 700, fontSize: 30, color: COLORS.textMuted}}>Plünderungen · Blaulicht · Scherben</div>
					) : null}
				</div>
				{frame >= qAt - 2 ? (
					<div
						style={{
							marginTop: 34,
							display: 'inline-block',
							padding: '14px 26px',
							borderRadius: RADII.md,
							background: COLORS.signal,
							border: '5px solid #0B1029',
							fontFamily: FONTS.heading,
							fontWeight: 900,
							fontSize: 74,
							lineHeight: 1.05,
							color: '#0B1029',
							rotate: `${-2 * qIn}deg`,
							scale: String(0.6 + 0.4 * qIn),
							opacity: Math.min(1, qIn * 2),
							boxShadow: `0 20px 60px ${withAlpha('#000000', 0.5)}`,
						}}
					>
						{HOOK.question}
					</div>
				) : null}
			</SafeArea>

			<div style={{position: 'absolute', left: 64, width: 866, top: 860, display: 'flex', flexDirection: 'column', gap: 14}}>
				<StatusChip kind="FAKT" text={HOOK.fact} at={factAt} />
				<StatusChip kind="EINSCHÄTZUNG" text={HOOK.opinion} at={opinionAt} />
			</div>
			<div style={{position: 'absolute', left: 64, top: 1215, opacity: interpolate(frame, [factAt + 6, factAt + 16], [0, 1], {...clamp, easing: EASE_OUT})}}>
				<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, color: COLORS.textMuted}}>Quelle: {HOOK.factSource}</span>
			</div>

			<Sfx name="impact" at={flipAt} volume={0.9} />
			<Sfx name="whoosh" at={flipAt - 4} volume={0.6} />
			<Sfx name="stamp" at={qAt - 2} volume={0.6} />
			<Sfx name="click" at={factAt} />
			<Sfx name="click" at={opinionAt} />
		</AbsoluteFill>
	);
};
