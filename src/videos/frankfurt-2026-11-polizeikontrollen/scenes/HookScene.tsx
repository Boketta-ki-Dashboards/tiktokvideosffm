import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {clamp, EASE_IN_OUT, EASE_OUT, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {COLORS, FONTS} from '../../../theme/tokens';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {HOOK} from '../content';
import {Phone} from '../visuals/Phone';
import {ZeilStreet} from '../visuals/ZeilStreet';

const LivePill: React.FC<{text: string; color: string}> = ({text, color}) => {
	const frame = useCurrentFrame();
	const pulse = (Math.sin(frame / 5) + 1) / 2;
	return (
		<div style={{display: 'inline-flex', alignItems: 'center', gap: 12, padding: '10px 20px 10px 16px', borderRadius: 999, background: 'rgba(8,10,28,0.8)', border: `2px solid ${withAlpha(color, 0.7)}`}}>
			<div style={{width: 16, height: 16, borderRadius: 8, background: color, boxShadow: `0 0 ${8 + pulse * 14}px ${color}`}} />
			<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, letterSpacing: 2.5, color: COLORS.text}}>{text}</span>
		</div>
	);
};

/** Szene 1 – Hook: Zeil bei Nacht, Kamerafahrt, Smartphone mit Galerie, „POLIZEI WILL DEINE GALERIE SEHEN?“ → „MUSST DU DAS?“ */
export const HookScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const h1 = cue(cues, 'hook1', 6);
	const h3 = cue(cues, 'hook3', h1.to + 60);
	const atHandy = wordFrame(cues, 'Handy', h3.from + 20);
	const atGalerie = wordFrame(cues, 'Galerie', h3.to - 20);
	const dolly = interpolate(frame, [0, durationInFrames], [0, 14], {...clamp, easing: EASE_IN_OUT});
	const phoneIn = springIn({frame, fps, delay: 4, damping: 15, stiffness: 110});
	const title = springIn({frame, fps, delay: -12, damping: 14});
	const q = springIn({frame, fps, delay: atGalerie - 2, damping: 11, stiffness: 190});
	const qReveal = interpolate(frame, [atGalerie - 2, atGalerie + 8], [0, 1], {...clamp, easing: EASE_OUT});
	const shimmer = interpolate(frame, [atGalerie + 6, atGalerie + 30], [-40, 140], clamp);
	const swipe = interpolate(frame, [atHandy + 12, atHandy + 40], [0, 1], {...clamp, easing: EASE_IN_OUT});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night}}>
			<ZeilStreet dolly={dolly} pan={Math.sin(frame / 80) * 0.6} people={16} officers={4} warm={0.7} blueLight={0.3} seed="hook" />
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.92) 0%, rgba(4,6,20,0.55) 28%, rgba(4,6,20,0) 46%)'}} />

			<div style={{position: 'absolute', left: 64, top: 200}}>
				<LivePill text={HOOK.place} color={COLORS.signal} />
			</div>
			{/* Titel */}
			<div style={{position: 'absolute', left: 64, top: 284, width: 866, opacity: Math.min(1, title * 1.6), translate: `0 ${(1 - title) * 40}px`}}>
				<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 76, lineHeight: 1.0, letterSpacing: -1, color: COLORS.text, textShadow: '0 10px 40px rgba(0,0,0,0.7)'}}>
					{HOOK.title[0]}
					<br />
					<span style={{color: COLORS.signal}}>{HOOK.title[1]}</span>
				</div>
			</div>
			{/* „MUSST DU DAS?“ als 3D-Plakette */}
			{frame >= atGalerie - 2 ? (
				<div style={{position: 'absolute', left: 64, top: 470, rotate: `${-3 * q}deg`, scale: String(0.7 + 0.3 * q), transformOrigin: '10% 50%', opacity: Math.min(1, q * 2)}}>
					<div
						style={{
							position: 'relative',
							overflow: 'hidden',
							padding: '14px 32px 18px',
							borderRadius: 24,
							background: 'linear-gradient(160deg, #FF6A78 0%, #FF4D5E 50%, #D93448 100%)',
							boxShadow: '0 4px 0 #B32A3C, 0 8px 0 #8E1F2E, 0 30px 60px rgba(0,0,0,0.55)',
							clipPath: `inset(-40px ${(1 - qReveal) * 100}% -80px -40px)`,
							fontFamily: FONTS.heading,
							fontWeight: 900,
							fontSize: 78,
							lineHeight: 1,
							color: '#FFFFFF',
						}}
					>
						{HOOK.question}
						<div style={{position: 'absolute', top: -40, bottom: -40, left: `${shimmer}%`, width: 110, rotate: '18deg', background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.5), rgba(255,255,255,0))'}} />
					</div>
				</div>
			) : null}

			{/* Smartphone */}
			<div style={{position: 'absolute', left: 540 - 165, top: 640 + (1 - phoneIn) * 900, rotate: `${(1 - phoneIn) * 8 - 3}deg`, filter: 'drop-shadow(0 40px 60px rgba(0,0,0,0.6))'}}>
				<Phone width={330} galleryAt={8} scroll={swipe * 0.5} highlight={[4, 6, 7]} highlightAt={atGalerie} />
				{/* Wisch-Finger */}
				{frame > atHandy + 8 && frame < atHandy + 46 ? (
					<div style={{position: 'absolute', left: 150, top: 520 - swipe * 220, width: 54, height: 54, borderRadius: 27, background: 'rgba(255,255,255,0.35)', border: '3px solid rgba(255,255,255,0.8)', opacity: Math.sin(swipe * Math.PI)}} />
				) : null}
			</div>

			<Sfx name="whoosh" at={2} volume={0.6} />
			<Sfx name="notify" at={atHandy - 4} />
			{[0, 1, 2].map((i) => (
				<Sfx key={i} name="click" at={atHandy + i * 6} volume={0.7} />
			))}
			<Sfx name="softImpact" at={atGalerie - 2} volume={0.8} />
		</AbsoluteFill>
	);
};
