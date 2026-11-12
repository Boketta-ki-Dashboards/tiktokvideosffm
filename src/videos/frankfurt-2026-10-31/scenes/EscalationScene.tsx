import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {EmergencyLights} from '../../../components/backgrounds/EmergencyLights';
import {FrankfurtSkyline} from '../../../components/backgrounds/FrankfurtSkyline';
import {GradientSky} from '../../../components/backgrounds/GradientSky';
import {StreetFacades} from '../../../components/backgrounds/StreetFacades';
import {Camera} from '../../../components/camera/Camera';
import {StatCard} from '../../../components/infographics/StatCard';
import {SafeArea} from '../../../components/layout/SafeArea';
import {SourceCredit} from '../../../components/media/SourceCredit';
import {Kicker} from '../../../components/text/Kicker';
import {LowerThird} from '../../../components/text/LowerThird';
import {clamp} from '../../../lib/animation';
import {COLORS} from '../../../theme/tokens';
import {TOLL} from '../content';
import {cue, type SceneProps} from '../cues';

const icons = {
	arrest: (
		<svg width={56} height={56} viewBox="0 0 24 24" fill="none" stroke={COLORS.alert} strokeWidth={2.2} strokeLinecap="round">
			<circle cx={7} cy={14} r={4} />
			<circle cx={17} cy={14} r={4} />
			<path d="M11 14h2M7 10V6M17 10V6" />
		</svg>
	),
	police: (
		<svg width={56} height={56} viewBox="0 0 24 24" fill="none" stroke={COLORS.signal} strokeWidth={2.2} strokeLinejoin="round">
			<path d="M12 2l8 3v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5z" />
			<path d="M12 8v5M12 16v.5" strokeLinecap="round" />
		</svg>
	),
	shop: (
		<svg width={56} height={56} viewBox="0 0 24 24" fill="none" stroke={COLORS.cyan} strokeWidth={2.2} strokeLinejoin="round">
			<path d="M3 9l1.5-5h15L21 9M4 9v11h16V9M3 9h18" />
			<path d="M9 20v-6h6v6" />
		</svg>
	),
};

const ICONS = [icons.arrest, icons.police, icons.shop];
const ACCENTS = [COLORS.alert, COLORS.signal, COLORS.cyan];

/** Szene: Bilanz der Nacht (Polizei / Innenministerium) vor nächtlicher Häuserzeile mit Blaulicht-Stimmung. */
export const EscalationScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const bilanz = cue(cues, 'bilanz', 8);
	const dim = interpolate(frame, [0, 14], [0.2, 0.55], clamp);

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night}}>
			<Camera keyframes={[{frame: 0, zoom: 1.12, x: -40}, {frame: durationInFrames, zoom: 1.0, x: 40}]} shake={2.2}>
				<GradientSky stops={['#04060F', '#0B1030', '#151A45']} glowY={0.8} glowColor="#2B3FA0" glowStrength={0.35} />
				<AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', paddingTop: 380, opacity: 0.55}}>
					<FrankfurtSkyline
						width={1500}
						showRiver={false}
						showBridge={false}
						litRatio={0.18}
						palette={{far: '#151B42', mid: '#121838', near: '#10152F', front: '#0D1129', glass: '#141B44', glassHi: '#1E2963', light: '#1A2150', stone: '#1D1838'}}
					/>
				</AbsoluteFill>
				<AbsoluteFill>
					<svg width={1080} height={1920}>
						<StreetFacades groundY={1640} litShops={0.35} boarded={2} />
						<rect x={0} y={1654} width={1080} height={266} fill="#0B0E24" />
						<g fill="#FFFFFF" opacity={0.18}>
							{new Array(8).fill(true).map((_, i) => (
								<rect key={i} x={i * 150 - 40} y={1760} width={80} height={10} rx={5} />
							))}
						</g>
					</svg>
				</AbsoluteFill>
				<EmergencyLights intensity={0.6} y={0.78} />
			</Camera>

			<AbsoluteFill style={{backgroundColor: `rgba(4, 6, 16, ${dim})`}} />
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,16,0.9) 0%, rgba(4,6,16,0.2) 40%, rgba(4,6,16,0) 60%)'}} />

			<SafeArea>
				<div style={{display: 'flex', flexDirection: 'column', gap: 24, marginTop: 10}}>
					<Kicker text="BILANZ DER NACHT" color={COLORS.alert} delay={2} />
					<LowerThird title={TOLL.place} subtitle={TOLL.when} delay={6} accent={COLORS.alert} />
					<div style={{display: 'flex', flexDirection: 'column', gap: 18, marginTop: 30}}>
						{TOLL.stats.map((s, i) => (
							<StatCard
								key={s.label}
								value={s.value}
								prefix={'prefix' in s ? s.prefix : undefined}
								label={s.label}
								attribution={s.attribution}
								delay={Math.max(10, bilanz.from + 8) + i * 9}
								accent={ACCENTS[i]}
								icon={ICONS[i]}
							/>
						))}
					</div>
					<SourceCredit sources={[TOLL.source]} delay={Math.max(10, bilanz.from + 8) + 26} />
				</div>
			</SafeArea>
		</AbsoluteFill>
	);
};
