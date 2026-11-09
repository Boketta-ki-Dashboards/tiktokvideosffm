import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BrandAvatar} from '../../formats/frankfurt-erklaert/Branding';
import {ACCENT, FORMAT} from '../../formats/frankfurt-erklaert/theme';
import {CameraPhone} from '../../formats/frankfurt-erklaert/visuals/CameraPhone';
import {DemoStreet} from '../../formats/frankfurt-erklaert/visuals/DemoStreet';
import {ensureFontsLoaded} from '../../theme/fonts';
import {COLORS, FONTS} from '../../theme/tokens';
import {HOOK} from './content';

ensureFontsLoaded();

/** TikTok-Cover: Demo-Straße (Illustration), filmendes Handy, „NUR GEFILMT – TROTZDEM ÄRGER?“ + Format-Marke. */
export const FrankfurtErklaertDemoFilmenCover: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: COLORS.night}}>
		<DemoStreet dolly={5} conflict={0.8} officers={4} seed="cover" />
		<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.95) 0%, rgba(4,6,20,0.65) 32%, rgba(4,6,20,0) 50%)'}} />
		<div style={{position: 'absolute', left: 64, top: 210, display: 'flex', alignItems: 'center', gap: 14}}>
			<BrandAvatar size={64} />
			<div style={{display: 'flex', flexDirection: 'column', lineHeight: 1}}>
				<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 32, letterSpacing: 2, color: COLORS.text}}>{FORMAT.name}</span>
				<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 24, letterSpacing: 3, color: ACCENT.brand, marginTop: 6}}>{FORMAT.sub} · #01</span>
			</div>
		</div>
		<div style={{position: 'absolute', left: 64, top: 320, width: 900, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 108, lineHeight: 0.98, letterSpacing: -2, color: COLORS.text, textShadow: '0 12px 50px rgba(0,0,0,0.7)'}}>
			NUR GEFILMT –
		</div>
		<div style={{position: 'absolute', left: 64, top: 450, rotate: '-3deg', padding: '16px 34px 20px', borderRadius: 26, background: 'linear-gradient(160deg, #FF6A78 0%, #FF4D5E 50%, #D93448 100%)', boxShadow: '0 5px 0 #B32A3C, 0 10px 0 #8E1F2E, 0 40px 70px rgba(0,0,0,0.6)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 86, lineHeight: 1, color: '#FFFFFF'}}>
			{HOOK.title[1]}
		</div>
		<div style={{position: 'absolute', left: 560, top: 700, rotate: '6deg', filter: 'drop-shadow(0 40px 60px rgba(0,0,0,0.6))'}}>
			<CameraPhone width={330} recFrom={-300}>
				<DemoStreet dolly={13} pan={0.6} conflict={0.8} officers={4} crowd={18} seed="cover" />
			</CameraPhone>
		</div>
		<div style={{position: 'absolute', left: 64, top: 1180, padding: '6px 14px', borderRadius: 10, background: 'rgba(8,10,28,0.8)', border: `1.5px solid ${ACCENT.signal}`, fontFamily: FONTS.heading, fontWeight: 800, fontSize: 22, letterSpacing: 2, color: ACCENT.signal}}>{HOOK.tag}</div>
	</AbsoluteFill>
);
