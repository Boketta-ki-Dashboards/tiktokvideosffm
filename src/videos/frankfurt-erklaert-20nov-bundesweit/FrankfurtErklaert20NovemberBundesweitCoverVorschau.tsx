import React from 'react';
import {Sequence} from 'remotion';
import {BrandLogo} from '../../components/brand/BrandLogo';
import {CoverPreviewSheet} from '../../formats/frankfurt-erklaert/CoverPreview';
import {erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import {DemoUpdateCover} from '../frankfurt-erklaert-20nov-demo-update/scenes/Scenes';
import {OepnvCover} from '../frankfurt-erklaert-20nov-oepnv/scenes/Scenes';
import {BUNDESWEIT_EPISODE, erklaertBundesweitDefaultProps, FrankfurtErklaert20NovemberBundesweit} from './FrankfurtErklaert20NovemberBundesweit';
import {BundesweitCover} from './scenes/Scenes';

ensureFontsLoaded();

/**
 * Prüfbogen Titelbild „73 Städte – ein Protesttag!“ (Export FrankfurtRed3_20November_Bundesweit_COVER_VORSCHAU.png, nicht zur Veröffentlichung).
 * Profilbild = offizielles Logo (BRAND.logoFile); Vorgänger im Raster: #11 und #10.
 */
export const FrankfurtErklaert20NovemberBundesweitCoverVorschau: React.FC = () => (
	<CoverPreviewSheet
		title="73 Städte – ein Protesttag"
		caption="73 STÄDTE – EIN PROTESTTAG! WAS PASSIERT MORGEN? 🚨 … mehr"
		cover={<BundesweitCover thumbnail />}
		avatar={(s) => <BrandLogo size={s} border={false} />}
		videoFrame={
			<Sequence from={-15}>
				<FrankfurtErklaert20NovemberBundesweit {...erklaertBundesweitDefaultProps} timeline={erklaertTimeline(BUNDESWEIT_EPISODE, erklaertBundesweitDefaultProps.voiceover, VIDEO.fps)} />
			</Sequence>
		}
		previous={[
			{node: <OepnvCover thumbnail />, label: 'BAHNEN'},
			{node: <DemoUpdateCover thumbnail />, label: 'GEÄNDERT'},
		]}
	/>
);
