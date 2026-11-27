import React from 'react';
import {Sequence} from 'remotion';
import {BrandLogo} from '../../components/brand/BrandLogo';
import {CoverPreviewSheet} from '../../formats/frankfurt-erklaert/CoverPreview';
import {erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import {DemoUpdateCover} from '../frankfurt-erklaert-20nov-demo-update/scenes/Scenes';
import {Nov20Cover} from '../frankfurt-erklaert-20nov-drei-proteste/scenes/Scenes';
import {erklaertOepnvDefaultProps, FrankfurtErklaert20NovemberOepnv, OEPNV_EPISODE} from './FrankfurtErklaert20NovemberOepnv';
import {OepnvCover} from './scenes/Scenes';

ensureFontsLoaded();

/**
 * Prüfbogen Titelbild „Frankfurt morgen: Diese Bahnen sind betroffen!“ (Export FrankfurtRed3_20November_OePNV_COVER_VORSCHAU.png, nicht zur
 * Veröffentlichung). Profilbild = offizielles Logo (BRAND.logoFile); Vorgänger im Raster: #10 und #09.
 */
export const FrankfurtErklaert20NovemberOepnvCoverVorschau: React.FC = () => (
	<CoverPreviewSheet
		title="Frankfurt morgen – Bahnen"
		caption="FRANKFURT MORGEN: DIESE BAHNEN SIND BETROFFEN! 🚨🚋 … mehr"
		cover={<OepnvCover thumbnail />}
		avatar={(s) => <BrandLogo size={s} border={false} />}
		videoFrame={
			<Sequence from={-15}>
				<FrankfurtErklaert20NovemberOepnv {...erklaertOepnvDefaultProps} timeline={erklaertTimeline(OEPNV_EPISODE, erklaertOepnvDefaultProps.voiceover, VIDEO.fps)} />
			</Sequence>
		}
		previous={[
			{node: <DemoUpdateCover thumbnail />, label: 'GEÄNDERT'},
			{node: <Nov20Cover thumbnail />, label: '4 PROTESTE'},
		]}
	/>
);
