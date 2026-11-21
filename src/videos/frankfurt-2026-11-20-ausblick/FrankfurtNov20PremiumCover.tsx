import React from 'react';
import {AbsoluteFill} from 'remotion';
import {COLORS, FONTS} from '../../theme/tokens';
import {ensureFontsLoaded} from '../../theme/fonts';
import {MOODS, NightCity} from './premium/NightCity';
import {Legibility} from './premium/Studio';

ensureFontsLoaded();

/** TikTok-Cover der Premium-Fassung: mehrschichtige Nacht-Skyline, großes Datum, 3D-Frageplakette (gleiche Aussage wie das Original-Cover). */
export const FrankfurtNov20PremiumCover: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: COLORS.night}}>
		<AbsoluteFill style={{scale: '1.08', transformOrigin: '50% 80%'}}>
			<NightCity mood={MOODS.dusk} progress={0.3} litRatio={0.34} emergency={0.25} />
		</AbsoluteFill>
		<Legibility topStrength={0.88} subtitleBand={0} />
		<div style={{position: 'absolute', left: 64, top: 260, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 230, lineHeight: 0.95, letterSpacing: -4, color: COLORS.text, textShadow: '0 12px 50px rgba(0,0,0,0.7)'}}>20.11.</div>
		<div
			style={{
				position: 'absolute',
				left: 64,
				top: 520,
				padding: '20px 36px 26px',
				borderRadius: 30,
				rotate: '-2.5deg',
				background: 'linear-gradient(160deg, #FFE36A 0%, #FFD23F 45%, #F5B800 100%)',
				boxShadow: '0 5px 0 #D9A400, 0 10px 0 #B88A00, 0 15px 0 #8E6A00, 0 40px 70px rgba(0,0,0,0.6)',
				fontFamily: FONTS.heading,
				fontWeight: 900,
				fontSize: 100,
				lineHeight: 1.0,
				color: '#0B1029',
			}}
		>
			WIEDER
			<br />
			ESKALATION?
		</div>
	</AbsoluteFill>
);
