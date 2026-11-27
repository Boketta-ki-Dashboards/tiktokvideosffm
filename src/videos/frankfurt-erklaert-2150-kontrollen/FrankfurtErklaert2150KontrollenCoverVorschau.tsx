import React from 'react';
import {Sequence} from 'remotion';
import {BrandLogo} from '../../components/brand/BrandLogo';
import {CoverPreviewSheet} from '../../formats/frankfurt-erklaert/CoverPreview';
import {erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import {BundesweitCover} from '../frankfurt-erklaert-20nov-bundesweit/scenes/Scenes';
import {OepnvCover} from '../frankfurt-erklaert-20nov-oepnv/scenes/Scenes';
import {erklaertKontrollenDefaultProps, FrankfurtErklaert2150Kontrollen, KONTROLLEN_EPISODE} from './FrankfurtErklaert2150Kontrollen';
import {KontrollenCover} from './scenes/Scenes';

ensureFontsLoaded();

/**
 * Prüfbogen Titelbild „Über 2.150 Kontrollen auf der Zeil“ (Export FrankfurtRed3_2150Kontrollen_COVER_VORSCHAU.png, nicht zur Veröffentlichung).
 * Profilbild = offizielles Logo (BRAND.logoFile); Vorgänger im Raster: #12 und #11.
 */
export const FrankfurtErklaert2150KontrollenCoverVorschau: React.FC = () => (
	<CoverPreviewSheet
		title="2.150 Kontrollen auf der Zeil"
		caption="2.150 KONTROLLEN AUF DER ZEIL – WAS HAT DIE POLIZEI GEFUNDEN? 🚨 … mehr"
		cover={<KontrollenCover thumbnail />}
		avatar={(s) => <BrandLogo size={s} border={false} />}
		videoFrame={
			<Sequence from={-15}>
				<FrankfurtErklaert2150Kontrollen {...erklaertKontrollenDefaultProps} timeline={erklaertTimeline(KONTROLLEN_EPISODE, erklaertKontrollenDefaultProps.voiceover, VIDEO.fps)} />
			</Sequence>
		}
		previous={[
			{node: <BundesweitCover thumbnail />, label: '73 STÄDTE'},
			{node: <OepnvCover thumbnail />, label: 'BAHNEN'},
		]}
	/>
);
