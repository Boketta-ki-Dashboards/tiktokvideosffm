import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BrandAvatar} from '../../formats/frankfurt-erklaert/Branding';
import {ACCENT, FORMAT} from '../../formats/frankfurt-erklaert/theme';
import {Landtag} from '../../formats/frankfurt-erklaert/visuals/Politics';
import {withAlpha} from '../../lib/color';
import {handleWithAt} from '../../theme/brand';
import {ensureFontsLoaded} from '../../theme/fonts';
import {COLORS, FONTS} from '../../theme/tokens';
import {blendMood, MOODS, NightCity} from '../frankfurt-2026-11-20-ausblick/premium/NightCity';

ensureFontsLoaded();

/**
 * Titelbild „76 Fragen“ (Export FrankfurtRed3_76Fragen_THUMBNAIL.png): hinten der Landtag in Wiesbaden (Ort der Aufarbeitung),
 * vorne die Frankfurter Skyline (Ort des Ereignisses), große 76.
 */
export const FrankfurtErklaert76FragenCover: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
		<AbsoluteFill style={{background: 'radial-gradient(ellipse 120% 60% at 50% 40%, #2A2766 0%, #0E1236 55%, #05071A 100%)'}} />
		{/* vordere Ebene unten: Frankfurter Skyline (Ort des Ereignisses) */}
		<AbsoluteFill>
			<NightCity mood={blendMood(MOODS.dusk, MOODS.alert, 0.3)} progress={0.5} litRatio={0.4} bokeh={10} showPromenade={false} />
		</AbsoluteFill>
		{/* hintere Ebene: Landtag Wiesbaden (Ort der Aufarbeitung) – kleiner, im Dunst, hinter der 76 */}
		<div style={{position: 'absolute', left: 170, top: 560, opacity: 0.95, WebkitMaskImage: 'linear-gradient(#000 78%, transparent 100%)', maskImage: 'linear-gradient(#000 78%, transparent 100%)'}}>
			<Landtag width={740} />
			<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(rgba(14,18,54,0.35), rgba(14,18,54,0.1))'}} />
		</div>
		<div style={{position: 'absolute', left: 0, right: 0, top: 1000, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 800, fontSize: 24, letterSpacing: 3, color: withAlpha('#FFFFFF', 0.85), textShadow: '0 4px 16px rgba(0,0,0,0.9)'}}>HESSISCHER LANDTAG · WIESBADEN</div>
		<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.95) 0%, rgba(4,6,20,0.35) 18%, rgba(4,6,20,0) 30%, rgba(4,6,20,0) 58%, rgba(4,6,20,0.8) 74%, rgba(4,6,20,0.95) 100%)'}} />
		{/* Serienbranding */}
		<div style={{position: 'absolute', left: 64, top: 210, display: 'flex', alignItems: 'center', gap: 14}}>
			<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 64, lineHeight: 0.95, color: COLORS.text}}>
				FRANKFURT
				<br />
				ERKLÄRT
			</div>
			<div style={{padding: '8px 16px', borderRadius: 10, background: ACCENT.brand, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, letterSpacing: 3, color: '#FFFFFF', alignSelf: 'flex-end'}}>{FORMAT.sub}</div>
		</div>
		{/* 76 */}
		<div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 400, lineHeight: 0.9, letterSpacing: -16, color: COLORS.signal, textShadow: `0 0 70px ${withAlpha(COLORS.signal, 0.6)}, 0 30px 80px rgba(0,0,0,0.7)`}}>76</div>
		{/* unten */}
		<div style={{position: 'absolute', left: 64, width: 866, top: 1110, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
			<div style={{padding: '14px 30px 18px', borderRadius: 24, background: 'linear-gradient(160deg, #FF6A78 0%, #FF4D5E 50%, #D93448 100%)', boxShadow: '0 5px 0 #B32A3C, 0 10px 0 #8E1F2E, 0 40px 70px rgba(0,0,0,0.6)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 64, lineHeight: 1, color: '#FFFFFF', textAlign: 'center'}}>76 FRAGEN AN DIE POLITIK</div>
			<div style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 40, color: COLORS.text, textShadow: '0 6px 24px rgba(0,0,0,0.8)'}}>Was wird heute Abend aufgeklärt?</div>
			<div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 6}}>
				<BrandAvatar size={58} />
				<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 30, color: COLORS.textMuted}}>10. NOVEMBER 2026 · {handleWithAt()}</span>
			</div>
		</div>
	</AbsoluteFill>
);
