import React from 'react';
import {AbsoluteFill} from 'remotion';
import {COLORS, FONTS} from '../../theme/tokens';
import {ensureFontsLoaded} from '../../theme/fonts';
import {Phone} from './visuals/Phone';
import {ZeilStreet} from './visuals/ZeilStreet';

ensureFontsLoaded();

/** TikTok-Cover / Thumbnail: Zeil bei Nacht, Smartphone mit gesperrter Galerie, „POLIZEI WILL DEINE GALERIE SEHEN?“ + „MUSST DU DAS?“ */
export const FrankfurtPoliceRightsCover: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: COLORS.night}}>
		<ZeilStreet dolly={8} people={14} officers={5} warm={0.7} blueLight={0.45} seed="cover" />
		<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.92) 0%, rgba(4,6,20,0.6) 34%, rgba(4,6,20,0) 52%)'}} />
		<div style={{position: 'absolute', left: 64, top: 230, width: 900, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 104, lineHeight: 0.98, letterSpacing: -2, color: COLORS.text, textShadow: '0 12px 50px rgba(0,0,0,0.7)'}}>
			POLIZEI WILL
			<br />
			DEINE <span style={{color: COLORS.signal}}>GALERIE</span>
			<br />
			SEHEN?
		</div>
		<div style={{position: 'absolute', left: 64, top: 600, rotate: '-3deg', padding: '16px 34px 20px', borderRadius: 26, background: 'linear-gradient(160deg, #FF6A78 0%, #FF4D5E 50%, #D93448 100%)', boxShadow: '0 5px 0 #B32A3C, 0 10px 0 #8E1F2E, 0 40px 70px rgba(0,0,0,0.6)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 88, lineHeight: 1, color: '#FFFFFF'}}>
			MUSST DU DAS?
		</div>
		<div style={{position: 'absolute', left: 560, top: 820, rotate: '6deg', filter: 'drop-shadow(0 40px 60px rgba(0,0,0,0.6))'}}>
			<Phone width={330} galleryAt={-60} lockAt={-30} highlight={[]} />
		</div>
	</AbsoluteFill>
);
