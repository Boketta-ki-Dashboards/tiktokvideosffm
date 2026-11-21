import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {Clouds} from '../../../components/backgrounds/Clouds';
import {FrankfurtSkyline} from '../../../components/backgrounds/FrankfurtSkyline';
import {GradientSky} from '../../../components/backgrounds/GradientSky';
import {Stars} from '../../../components/backgrounds/Stars';
import {Camera} from '../../../components/camera/Camera';
import {SafeArea} from '../../../components/layout/SafeArea';
import {Kicker} from '../../../components/text/Kicker';
import {KineticText} from '../../../components/text/KineticText';
import {clamp, springIn} from '../../../lib/animation';
import {COLORS, FONTS, RADII} from '../../../theme/tokens';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {QUESTION} from '../content';

/** Szene 7 – Meinung + Community-Frage: Skyline, zwei Antwort-„Buttons“ (nur Kommentar-Impuls, keine echte Abstimmung). */
export const QuestionScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const e = cue(cues, 'end1', 6);
	const atCalm = wordFrame(cues, 'ruhiger', e.from + 30);
	const atReal = wordFrame(cues, 'Realistisch', atCalm + 15);
	const atEsc = wordFrame(cues, 'Eskalation', atReal + 15);
	const atComments = wordFrame(cues, 'Kommentare', e.to - 15);
	const optAt = [atReal - 2, atEsc - 2];

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night}}>
			<Camera keyframes={[{frame: 0, zoom: 1.15, y: 40}, {frame: durationInFrames, zoom: 1.0, y: 0}]}>
				<GradientSky stops={['#050920', '#121446', '#2A1D52', '#5A2A5A']} glowY={0.72} glowColor="#C2454F" glowStrength={0.4} />
				<Stars count={90} maxY={0.4} opacity={0.6} />
				<Clouds count={5} opacity={0.07} band={[0.1, 0.36]} speed={0.5} />
				<AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center'}}>
					<FrankfurtSkyline width={1560} litRatio={0.3} style={{marginBottom: -40}} />
				</AbsoluteFill>
			</Camera>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(6,9,26,0.9) 0%, rgba(6,9,26,0.45) 50%, rgba(6,9,26,0) 70%)'}} />

			<SafeArea>
				<Kicker text="UNSERE EINSCHÄTZUNG" color={COLORS.signal} delay={0} />
				<div style={{marginTop: 26}}>
					<KineticText text={QUESTION.title} highlight={['20.11.']} fontSize={92} delay={e.from} stagger={3} maxWidth={866} lineHeight={1.0} />
				</div>
				<div style={{marginTop: 18, fontFamily: FONTS.body, fontWeight: 700, fontSize: 30, color: COLORS.textMuted, opacity: interpolate(frame, [atCalm - 4, atCalm + 6], [0, 1], clamp)}}>
					Unsere Prognose: könnte deutlich ruhiger werden – keine Garantie.
				</div>
			</SafeArea>

			<div style={{position: 'absolute', left: 64, width: 866, top: 760, display: 'flex', flexDirection: 'column', gap: 22}}>
				{QUESTION.options.map((o, i) => {
					const s = springIn({frame, fps, delay: optAt[i], damping: 12, stiffness: 160});
					const pulse = 1 + Math.sin((frame - optAt[i]) / 6) * 0.015;
					if (frame < optAt[i]) return null;
					return (
						<div
							key={o}
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 18,
								padding: '22px 30px',
								borderRadius: RADII.pill,
								background: i === 0 ? COLORS.green : COLORS.alert,
								border: '5px solid #0B1029',
								boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
								fontFamily: FONTS.heading,
								fontWeight: 900,
								fontSize: 52,
								color: '#0B1029',
								scale: String((0.6 + 0.4 * s) * pulse),
								opacity: Math.min(1, s * 2),
							}}
						>
							<span style={{width: 60, height: 60, borderRadius: 30, background: '#0B1029', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34}}>{i === 0 ? 'A' : 'B'}</span>
							{o}
						</div>
					);
				})}
				{frame >= atComments - 4 ? (
					<div style={{alignSelf: 'center', marginTop: 6, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 38, color: COLORS.signal, opacity: interpolate(frame, [atComments - 4, atComments + 6], [0, 1], clamp)}}>
						{QUESTION.hint}
					</div>
				) : null}
			</div>

			<Sfx name="pop" at={optAt[0]} />
			<Sfx name="pop" at={optAt[1]} />
			<Sfx name="notify" at={atComments - 4} />
		</AbsoluteFill>
	);
};
