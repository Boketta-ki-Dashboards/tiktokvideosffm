import React from 'react';
import {Sequence} from 'remotion';
import {BrandLogo} from '../../components/brand/BrandLogo';
import {CoverPreviewSheet} from '../../formats/frankfurt-erklaert/CoverPreview';
import {erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import {Demo13Cover} from '../frankfurt-erklaert-13-demonstranten-2026-11-14/scenes/Scenes';
import {Phase2Cover} from '../frankfurt-erklaert-genz-phase2-2026-11-14/scenes/Scenes';
import {erklaert20NovemberDefaultProps, FrankfurtErklaert20NovemberDreiProteste, NOV20_EPISODE} from './FrankfurtErklaert20NovemberDreiProteste';
import {Nov20Cover} from './scenes/Scenes';

ensureFontsLoaded();

/**
 * Prüfbogen Titelbild „4 Proteste – 1 Freitag“ (Export FrankfurtRed3_20November_3Proteste_COVER_VORSCHAU.png, nicht zur Veröffentlichung).
 * Profilbild in Raster und App-Ansicht = offizielles Logo (BRAND.logoFile).
 */
export const FrankfurtErklaert20NovemberDreiProtesteCoverVorschau: React.FC = () => (
	<CoverPreviewSheet
		title="4 Proteste – 1 Freitag"
		caption="4 PROTESTE AN EINEM FREITAG – WAS PASSIERT AM 20.11. IN FRANKFURT? 🚨 … mehr"
		cover={<Nov20Cover thumbnail />}
		avatar={(s) => <BrandLogo size={s} border={false} />}
		videoFrame={
			<Sequence from={-15}>
				<FrankfurtErklaert20NovemberDreiProteste {...erklaert20NovemberDefaultProps} timeline={erklaertTimeline(NOV20_EPISODE, erklaert20NovemberDefaultProps.voiceover, VIDEO.fps)} />
			</Sequence>
		}
		previous={[
			{node: <Demo13Cover thumbnail />, label: '13 DEMO'},
			{node: <Phase2Cover thumbnail />, label: 'PHASE 2'},
		]}
	/>
);
