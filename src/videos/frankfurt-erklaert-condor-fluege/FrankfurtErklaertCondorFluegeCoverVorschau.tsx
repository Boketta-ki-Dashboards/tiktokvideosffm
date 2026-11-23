import React from 'react';
import {Sequence} from 'remotion';
import {BrandLogo} from '../../components/brand/BrandLogo';
import {CoverPreviewSheet} from '../../formats/frankfurt-erklaert/CoverPreview';
import {erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import {handleWithAt} from '../../theme/brand';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import {AusblickCover} from '../frankfurt-erklaert-12dez-ausblick/scenes/Scenes';
import {StaedteCover} from '../frankfurt-erklaert-20nov-staedte/scenes/Scenes';
import {CONDOR_EPISODE, erklaertCondorDefaultProps, FrankfurtErklaertCondorFluege} from './FrankfurtErklaertCondorFluege';
import {CondorCover} from './scenes/Scenes';

ensureFontsLoaded();

/**
 * Prüfbogen Titelbild „Zwei Flugzeuge – Passagiere krank an Bord“ (Export …_COVER_VORSCHAU.png, nicht zur Veröffentlichung).
 * Profilbild = offizielles Logo (unverändert), Account = neuer Name @frankfurtrednews (BRAND_NEWS); Vorgänger im Raster: #16 und #15.
 */
export const FrankfurtErklaertCondorFluegeCoverVorschau: React.FC = () => (
	<CoverPreviewSheet
		title="Zwei Condor-Flüge"
		caption="ZWEI FLUGZEUGE – PASSAGIERE KRANK AN BORD! WAS IST PASSIERT? … mehr"
		cover={<CondorCover thumbnail />}
		avatar={(s) => <BrandLogo size={s} border={false} />}
		handle={handleWithAt('news')}
		videoFrame={
			<Sequence from={-15}>
				<FrankfurtErklaertCondorFluege {...erklaertCondorDefaultProps} timeline={erklaertTimeline(CONDOR_EPISODE, erklaertCondorDefaultProps.voiceover, VIDEO.fps)} />
			</Sequence>
		}
		previous={[
			{node: <AusblickCover thumbnail />, label: '12.12.'},
			{node: <StaedteCover thumbnail />, label: 'ANDERE STÄDTE'},
		]}
	/>
);
