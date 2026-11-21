import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Clouds} from '../../components/backgrounds/Clouds';
import {EmergencyLights} from '../../components/backgrounds/EmergencyLights';
import {FrankfurtSkyline} from '../../components/backgrounds/FrankfurtSkyline';
import {GradientSky} from '../../components/backgrounds/GradientSky';
import {Stars} from '../../components/backgrounds/Stars';
import {SafeArea} from '../../components/layout/SafeArea';
import {COLORS, FONTS, RADII} from '../../theme/tokens';
import {ensureFontsLoaded} from '../../theme/fonts';

ensureFontsLoaded();

/** TikTok-Cover: Skyline bei Nacht, großer Text „20.11. – WIEDER ESKALATION?“ */
export const FrankfurtNov20Cover: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: COLORS.night}}>
		<GradientSky stops={['#050920', '#121446', '#3A1D55', '#7A2C55']} glowY={0.72} glowColor="#C2454F" glowStrength={0.5} />
		<Stars count={90} maxY={0.4} opacity={0.6} />
		<Clouds count={5} opacity={0.07} band={[0.1, 0.36]} speed={0.5} />
		<AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center'}}>
			<FrankfurtSkyline width={1560} litRatio={0.3} style={{marginBottom: -40}} />
		</AbsoluteFill>
		<EmergencyLights intensity={0.3} y={0.86} />
		<AbsoluteFill style={{background: 'linear-gradient(rgba(6,9,26,0.9) 0%, rgba(6,9,26,0.4) 52%, rgba(6,9,26,0) 72%)'}} />
		<SafeArea>
			<div style={{marginTop: 80, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 230, lineHeight: 0.95, color: COLORS.text, textShadow: '0 10px 40px rgba(0,0,0,0.6)'}}>20.11.</div>
			<div style={{marginTop: 30, display: 'inline-block', padding: '18px 30px', borderRadius: RADII.md, background: COLORS.signal, border: '6px solid #0B1029', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 92, lineHeight: 1.0, color: '#0B1029', rotate: '-2deg'}}>
				WIEDER
				<br />
				ESKALATION?
			</div>
		</SafeArea>
	</AbsoluteFill>
);
