import React from 'react';
import {Sequence} from 'remotion';
import {BrandLogo} from '../../components/brand/BrandLogo';
import {CoverPreviewSheet} from '../../formats/frankfurt-erklaert/CoverPreview';
import {erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import {StaedteCover} from '../frankfurt-erklaert-20nov-staedte/scenes/Scenes';
import {VorbilanzCover} from '../frankfurt-erklaert-20nov-vorbilanz/scenes/Scenes';
import {AUSBLICK_EPISODE, erklaertAusblickDefaultProps, FrankfurtErklaert12DezemberAusblick} from './FrankfurtErklaert12DezemberAusblick';
import {AusblickCover} from './scenes/Scenes';

ensureFontsLoaded();

/**
 * Prüfbogen Titelbild „Nach dem 20. November: Schon die nächste Demo geplant?“ (Export FrankfurtRed3_GenZ_WieGehtEsWeiter_12Dezember_COVER_VORSCHAU.png,
 * nicht zur Veröffentlichung). Profilbild = offizielles Logo (BRAND.logoFile); Vorgänger im Raster: #15 und #14.
 */
export const FrankfurtErklaert12DezemberAusblickCoverVorschau: React.FC = () => (
	<CoverPreviewSheet
		title="Wie geht es weiter? 12.12."
		caption="NACH DEM 20. NOVEMBER: SCHON DIE NÄCHSTE DEMO GEPLANT? … mehr"
		cover={<AusblickCover thumbnail />}
		avatar={(s) => <BrandLogo size={s} border={false} />}
		videoFrame={
			<Sequence from={-15}>
				<FrankfurtErklaert12DezemberAusblick {...erklaertAusblickDefaultProps} timeline={erklaertTimeline(AUSBLICK_EPISODE, erklaertAusblickDefaultProps.voiceover, VIDEO.fps)} />
			</Sequence>
		}
		previous={[
			{node: <StaedteCover thumbnail />, label: 'ANDERE STÄDTE'},
			{node: <VorbilanzCover thumbnail />, label: 'VORBILANZ'},
		]}
	/>
);
