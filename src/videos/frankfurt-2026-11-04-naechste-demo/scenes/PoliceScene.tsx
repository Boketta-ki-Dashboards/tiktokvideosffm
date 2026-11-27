import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Clouds} from '../../../components/backgrounds/Clouds';
import {EmergencyLights} from '../../../components/backgrounds/EmergencyLights';
import {GradientSky} from '../../../components/backgrounds/GradientSky';
import {Stars} from '../../../components/backgrounds/Stars';
import {SafeArea} from '../../../components/layout/SafeArea';
import {SourceCredit} from '../../../components/media/SourceCredit';
import {DecisionTrack} from '../../../components/police/DecisionTrack';
import {PoliceCar} from '../../../components/police/PoliceCar';
import {PressRelease} from '../../../components/police/PressRelease';
import {Kicker} from '../../../components/text/Kicker';
import {clamp, EASE_OUT, springIn} from '../../../lib/animation';
import {COLORS, FONTS, RADII} from '../../../theme/tokens';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';

/** Gezeichnete Polizeiwache (neutral, ohne Wappen). */
const Station: React.FC = () => (
	<svg width={300} height={208} viewBox="0 0 360 250">
		<rect x={20} y={70} width={320} height={170} rx={8} fill="#1B2552" stroke="#3A4E8C" strokeWidth={5} />
		<rect x={0} y={52} width={360} height={30} rx={6} fill="#2A3770" stroke="#3A4E8C" strokeWidth={5} />
		<rect x={105} y={92} width={150} height={40} rx={8} fill="#2E6BFF" stroke="#0B1029" strokeWidth={4} />
		<text x={180} y={122} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={900} fontSize={30} fill="#FFFFFF" letterSpacing={3}>
			POLIZEI
		</text>
		{[50, 120, 220, 290].map((x) => (
			<rect key={x} x={x} y={150} width={32} height={44} rx={4} fill="#FFD98A" opacity={0.85} />
		))}
		<rect x={150} y={165} width={60} height={75} rx={4} fill="#0B1029" stroke="#3A4E8C" strokeWidth={4} />
	</svg>
);

/** Szene 5: Polizei und Land – Ankündigung (Politik) vs. behördliche Entscheidung (nicht bekannt). */
export const PoliceScene: React.FC<SceneProps> = ({cues}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p1 = cue(cues, 'pol1', 4);
	const p2 = cue(cues, 'pol2', p1.to + 4);
	const verbotWord = wordFrame(cues, 'Demonstrationsverbot', p1.from + Math.round((p1.to - p1.from) * 0.55));
	const showTrack = p2.from - 8;
	const releaseOut = interpolate(frame, [showTrack - 6, showTrack + 8], [1, 0], clamp);
	const label1 = springIn({frame, fps, delay: p1.from + 6, damping: 12, stiffness: 170});
	const label2 = springIn({frame, fps, delay: verbotWord, damping: 12, stiffness: 170});
	const stationIn = springIn({frame, fps, delay: 2, damping: 16});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night}}>
			<GradientSky stops={['#060A22', '#151548', '#2A1D55', '#5A2A55']} glowY={0.45} glowColor="#2E6BFF" glowStrength={0.35} />
			<Stars count={60} maxY={0.3} opacity={0.5} />
			<Clouds count={4} opacity={0.07} band={[0.1, 0.3]} speed={0.4} />
			<EmergencyLights intensity={0.45} y={0.3} colors={['#2E6BFF', '#FF3B4E']} />
			<SafeArea>
				<Kicker text="POLIZEI UND LAND HESSEN" color={COLORS.signal} delay={0} live />
			</SafeArea>

			{/* Straßenszene */}
			<div style={{position: 'absolute', top: 312, left: 50, translate: `${(1 - stationIn) * -300}px 0`, opacity: Math.min(1, stationIn * 1.6)}}>
				<Station />
			</div>
			<div style={{position: 'absolute', top: 505, left: 0, right: 0, height: 8, background: 'linear-gradient(90deg, transparent, #3A4E8C, transparent)', opacity: 0.7}} />
			{[0, 1, 2].map((i) => {
				const start = 8 + i * 14;
				const x = interpolate(frame, [start, start + 50], [1200, 290 + i * 190], {...clamp, easing: EASE_OUT});
				return (
					<div key={i} style={{position: 'absolute', top: 400 + (i % 2) * 14, left: x, opacity: interpolate(frame, [start, start + 8], [0, 1], clamp)}}>
						<PoliceCar width={230} phase={i * 3} direction={-1} />
					</div>
				);
			})}

			{/* Pillen */}
			<div style={{position: 'absolute', top: 580, left: 64, width: 866, display: 'flex', flexDirection: 'column', gap: 12, opacity: releaseOut}}>
				<div
					style={{
						width: 'fit-content',
						padding: '10px 28px',
						borderRadius: RADII.pill,
						background: COLORS.cyan,
						border: '4px solid #0B1029',
						fontFamily: FONTS.heading,
						fontWeight: 900,
						fontSize: 40,
						color: '#0B1029',
						opacity: Math.min(1, label1 * 1.6),
						scale: String(0.85 + 0.15 * label1),
						transformOrigin: 'left center',
					}}
				>
					MEHR POLIZEIPRÄSENZ
				</div>
				{frame >= verbotWord - 2 ? (
					<div
						style={{
							width: 'fit-content',
							padding: '10px 28px',
							borderRadius: RADII.pill,
							background: COLORS.signal,
							border: '4px solid #0B1029',
							fontFamily: FONTS.heading,
							fontWeight: 900,
							fontSize: 36,
							color: '#0B1029',
							opacity: Math.min(1, label2 * 1.6),
							scale: String(0.85 + 0.15 * label2),
							transformOrigin: 'left center',
						}}
					>
						MÖGLICHES DEMONSTRATIONSVERBOT?
					</div>
				) : null}
			</div>

			{/* Pressemitteilung */}
			<div style={{position: 'absolute', top: 760, left: 64, opacity: releaseOut}}>
				<PressRelease
					sender="Hessisches Innenministerium"
					date="02.11.2026"
					delay={14}
					width={866}
					quotes={[
						{text: 'mit einem noch stärkeren Aufgebot im Einsatz sein und von Anfang an robust vorgehen', from: p1.from + 12},
						{text: 'Aus meiner Sicht darf am 20. November daher auch keine mit gestern vergleichbare Versammlung in Frankfurt stattfinden.', from: verbotWord + 4},
					]}
				/>
			</div>

			{/* Ankündigung ≠ Entscheidung */}
			{frame >= showTrack ? (
				<div style={{position: 'absolute', top: 600, left: 64, width: 866}}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 38, lineHeight: 1.1, color: COLORS.text, marginBottom: 18, opacity: interpolate(frame, [showTrack, showTrack + 10], [0, 1], clamp)}}>
						ANKÜNDIGUNG <span style={{color: COLORS.signal}}>≠</span> ENTSCHEIDUNG
					</div>
					<DecisionTrack
						steps={[
							{id: 'ank', label: 'ANKÜNDIGUNG', note: 'Politik: Poseck, 02.11.', state: 'done', from: showTrack + 6},
							{id: 'anm', label: 'ANMELDUNG am 20.11.', note: 'nicht bekannt', state: 'open', from: showTrack + 22},
							{id: 'ent', label: 'BEHÖRDLICHE ENTSCHEIDUNG', note: 'nicht bekannt (Stand 04.11.)', state: 'open', from: showTrack + 38},
						]}
					/>
				</div>
			) : null}

			<div style={{position: 'absolute', left: 64, top: 1250}}>
				<SourceCredit sources={['Innenministerium Hessen 02.11.', 'hessenschau 02.11.']} delay={30} />
			</div>
		</AbsoluteFill>
	);
};
