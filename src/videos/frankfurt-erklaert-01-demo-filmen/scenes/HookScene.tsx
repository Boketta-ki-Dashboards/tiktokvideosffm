import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {clamp, EASE_IN, EASE_IN_OUT, EASE_OUT, springIn} from '../../../lib/animation';
import {COLORS, FONTS} from '../../../theme/tokens';
import {IntroSting} from '../../../formats/frankfurt-erklaert/Branding';
import {SourceBar} from '../../../formats/frankfurt-erklaert/components';
import {ACCENT} from '../../../formats/frankfurt-erklaert/theme';
import {CameraPhone} from '../../../formats/frankfurt-erklaert/visuals/CameraPhone';
import {DemoStreet} from '../../../formats/frankfurt-erklaert/visuals/DemoStreet';
import {blendMood, MOODS, NightCity} from '../../frankfurt-2026-11-20-ausblick/premium/NightCity';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {DISCLAIMER, HOOK, STAND} from '../content';

/**
 * Szene 1 – Hook: Flug über die Skyline (Format-Intro) → Demo auf der Zeil, Handy filmt, im Hintergrund stilisierter
 * Konflikt (Lichtschein, abstrakte Flugbahnen) + Blaulicht → „NUR GEFILMT – TROTZDEM ÄRGER?“ → Zoom ins Handy.
 */
export const HookScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const h2 = cue(cues, 'hook2', 58);
	const atDemo = wordFrame(cues, 'Demo', h2.from + 34);
	const atSudden = wordFrame(cues, 'plötzlich', h2.from + 56);
	const atBottles = wordFrame(cues, 'Flaschen', h2.from + 78);
	const atStress = wordFrame(cues, 'Stress', h2.from + 118);
	const end = durationInFrames - 6;

	// Phase A: Skyline-Flug
	const flight = interpolate(frame, [0, h2.from + 10], [0, 1], {...clamp, easing: EASE_IN});
	const toStreet = interpolate(frame, [h2.from - 6, h2.from + 8], [0, 1], {...clamp, easing: EASE_IN_OUT});
	// Phase B: Straße
	const dolly = interpolate(frame, [h2.from - 6, durationInFrames], [0, 7], {...clamp, easing: EASE_OUT});
	const conflict = interpolate(frame, [atSudden, atBottles + 6], [0, 1], {...clamp, easing: EASE_OUT});
	const phoneIn = springIn({frame, fps, delay: h2.from + 4, damping: 15, stiffness: 120});
	const title = springIn({frame, fps, delay: atStress - 6, damping: 11, stiffness: 200});
	const zoom = interpolate(frame, [end - 16, end], [0, 1], {...clamp, easing: EASE_IN});
	const shake = frame >= atStress - 6 && frame < atStress + 4 ? Math.sin(frame * 2.3) * 6 * (1 - (frame - atStress + 6) / 10) : 0;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			{/* Skyline-Flug */}
			{toStreet < 1 ? (
				<AbsoluteFill style={{opacity: 1 - toStreet, scale: String(1 + flight * 0.55), transformOrigin: '50% 62%'}}>
					<NightCity mood={blendMood(MOODS.dusk, MOODS.alert, flight * 0.6)} progress={flight} litRatio={0.36} bokeh={18} />
				</AbsoluteFill>
			) : null}
			{/* Demo-Straße */}
			{toStreet > 0 ? (
				<AbsoluteFill style={{opacity: toStreet, translate: `${shake}px 0`}}>
					<DemoStreet dolly={dolly} pan={Math.sin(frame / 70) * 0.5} conflict={conflict} officers={4} seed="hook" />
					<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.9) 0%, rgba(4,6,20,0.5) 26%, rgba(4,6,20,0) 42%)'}} />
				</AbsoluteFill>
			) : null}

			<IntroSting outAt={h2.from - 8} />

			{/* Titel-Plakette */}
			{frame >= atStress - 7 ? (
				<div style={{position: 'absolute', left: 64, top: 300, width: 866, opacity: Math.min(1, title * 2) * (1 - zoom), scale: String(0.6 + 0.4 * title), transformOrigin: '0% 50%', rotate: `${-2.5 * title}deg`}}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 84, lineHeight: 1, letterSpacing: -1, color: COLORS.text, textShadow: '0 10px 40px rgba(0,0,0,0.75)'}}>{HOOK.title[0]}</div>
					<div style={{display: 'inline-block', marginTop: 14, padding: '12px 28px 16px', borderRadius: 22, background: 'linear-gradient(160deg, #FF6A78 0%, #FF4D5E 50%, #D93448 100%)', boxShadow: '0 4px 0 #B32A3C, 0 8px 0 #8E1F2E, 0 30px 60px rgba(0,0,0,0.55)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 80, lineHeight: 1, color: '#FFFFFF'}}>
						{HOOK.title[1]}
					</div>
				</div>
			) : null}

			{/* Handy filmt (Live-Bild = gleiche Straße, näher) */}
			{frame >= h2.from - 2 ? (
				<div
					style={{
						position: 'absolute',
						left: 600,
						top: 560 + (1 - phoneIn) * 900,
						rotate: `${(1 - phoneIn) * 10 + 5 * (1 - zoom)}deg`,
						scale: String(1 + zoom * 3.6),
						transformOrigin: '150px 307px',
						translate: `${-zoom * 210}px ${zoom * 93}px`,
						filter: 'drop-shadow(0 40px 60px rgba(0,0,0,0.6))',
					}}
				>
					<CameraPhone width={300} recFrom={atDemo}>
						<DemoStreet dolly={dolly + 9} pan={0.6} conflict={conflict} officers={4} seed="hook" crowd={18} />
					</CameraPhone>
				</div>
			) : null}
			{/* Illustration-Hinweis + Rechtshinweis */}
			{frame >= h2.from ? (
				<div style={{position: 'absolute', left: 64, top: 1150, opacity: interpolate(frame, [h2.from, h2.from + 10], [0, 1], clamp) * (1 - zoom), padding: '6px 14px', borderRadius: 10, background: 'rgba(8,10,28,0.8)', border: `1.5px solid ${ACCENT.signal}`, fontFamily: FONTS.heading, fontWeight: 800, fontSize: 22, letterSpacing: 2, color: ACCENT.signal}}>{HOOK.tag}</div>
			) : null}
			<SourceBar text={`${DISCLAIMER} · ${STAND}`} at={h2.from + 6} />

			<Sfx name="whoosh" at={0} volume={0.7} />
			<Sfx name="pop" at={4} volume={0.6} />
			<Sfx name="whoosh" at={h2.from - 6} volume={0.6} />
			<Sfx name="click" at={atDemo} volume={0.8} />
			<Sfx name="softImpact" at={atBottles} volume={0.6} />
			<Sfx name="impact" at={atStress - 6} volume={0.75} />
			<Sfx name="whoosh" at={end - 14} volume={0.6} />
		</AbsoluteFill>
	);
};
