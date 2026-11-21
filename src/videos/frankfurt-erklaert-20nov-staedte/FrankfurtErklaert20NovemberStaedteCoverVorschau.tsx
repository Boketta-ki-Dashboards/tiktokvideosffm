import React from 'react';
import {Sequence} from 'remotion';
import {BrandLogo} from '../../components/brand/BrandLogo';
import {CoverPreviewSheet} from '../../formats/frankfurt-erklaert/CoverPreview';
import {erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import {KontrollenCover} from '../frankfurt-erklaert-2150-kontrollen/scenes/Scenes';
import {VorbilanzCover} from '../frankfurt-erklaert-20nov-vorbilanz/scenes/Scenes';
import {erklaertStaedteDefaultProps, FrankfurtErklaert20NovemberStaedte, STAEDTE_EPISODE} from './FrankfurtErklaert20NovemberStaedte';
import {StaedteCover} from './scenes/Scenes';

ensureFontsLoaded();

/**
 * Prüfbogen Titelbild „Gen-Z-Proteste: Hamburg, Leipzig …“ (Export FrankfurtRed3_20November_Staedte_COVER_VORSCHAU.png, nicht zur Veröffentlichung).
 * Profilbild = offizielles Logo (BRAND.logoFile); Vorgänger im Raster: #14 und #13.
 */
export const FrankfurtErklaert20NovemberStaedteCoverVorschau: React.FC = () => (
	<CoverPreviewSheet
		title="Gen-Z-Proteste in anderen Städten"
		caption="GEN-Z-PROTESTE: WAS IST IN HAMBURG, LEIPZIG UND DEN ANDEREN STÄDTEN PASSIERT? … mehr"
		cover={<StaedteCover thumbnail />}
		avatar={(s) => <BrandLogo size={s} border={false} />}
		videoFrame={
			<Sequence from={-15}>
				<FrankfurtErklaert20NovemberStaedte {...erklaertStaedteDefaultProps} timeline={erklaertTimeline(STAEDTE_EPISODE, erklaertStaedteDefaultProps.voiceover, VIDEO.fps)} />
			</Sequence>
		}
		previous={[
			{node: <VorbilanzCover thumbnail />, label: 'VORBILANZ'},
			{node: <KontrollenCover thumbnail />, label: '2.150 KONTROLLEN'},
		]}
	/>
);
