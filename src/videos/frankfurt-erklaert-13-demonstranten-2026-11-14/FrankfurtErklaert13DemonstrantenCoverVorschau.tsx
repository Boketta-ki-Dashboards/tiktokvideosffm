import React from 'react';
import {Sequence} from 'remotion';
import {BrandLogo} from '../../components/brand/BrandLogo';
import {CoverPreviewSheet} from '../../formats/frankfurt-erklaert/CoverPreview';
import {erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import {Nov14Cover} from '../frankfurt-erklaert-14-november-2026/scenes/Scenes';
import {Phase2Cover} from '../frankfurt-erklaert-genz-phase2-2026-11-14/scenes/Scenes';
import {DEMO13_EPISODE, erklaert13DemonstrantenDefaultProps, FrankfurtErklaert13Demonstranten} from './FrankfurtErklaert13Demonstranten';
import {Demo13Cover} from './scenes/Scenes';

ensureFontsLoaded();

/**
 * Prüfbogen Titelbild „Nur 13 Demonstranten?“ (Export FrankfurtRed3_13Demonstranten_COVER_VORSCHAU.png, nicht zur Veröffentlichung).
 * Profilbild in Raster und App-Ansicht = offizielles Logo (BRAND.logoFile).
 */
export const FrankfurtErklaert13DemonstrantenCoverVorschau: React.FC = () => (
	<CoverPreviewSheet
		title="Nur 13 Demonstranten?"
		caption="13 DEMONSTRANTEN – ABER 16 POLIZEIWAGEN?! 🚨 … mehr"
		cover={<Demo13Cover thumbnail />}
		avatar={(s) => <BrandLogo size={s} border={false} />}
		videoFrame={
			<Sequence from={-15}>
				<FrankfurtErklaert13Demonstranten {...erklaert13DemonstrantenDefaultProps} timeline={erklaertTimeline(DEMO13_EPISODE, erklaert13DemonstrantenDefaultProps.voiceover, VIDEO.fps)} />
			</Sequence>
		}
		previous={[
			{node: <Phase2Cover thumbnail />, label: 'PHASE 2'},
			{node: <Nov14Cover thumbnail />, label: '14.11.'},
		]}
	/>
);
