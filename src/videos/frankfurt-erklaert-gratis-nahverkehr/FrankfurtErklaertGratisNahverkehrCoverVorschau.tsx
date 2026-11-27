import React from 'react';
import {Sequence} from 'remotion';
import {BrandLogo} from '../../components/brand/BrandLogo';
import {CoverPreviewSheet} from '../../formats/frankfurt-erklaert/CoverPreview';
import {erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import {handleWithAt} from '../../theme/brand';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import {CondorCover} from '../frankfurt-erklaert-condor-fluege/scenes/Scenes';
import {PlanungCover} from '../frankfurt-erklaert-genz-planungstreffen/scenes/Scenes';
import {erklaertGratisDefaultProps, FrankfurtErklaertGratisNahverkehr, GRATIS_EPISODE} from './FrankfurtErklaertGratisNahverkehr';
import {GratisCover} from './scenes/Scenes';

ensureFontsLoaded();

/**
 * Prüfbogen Titelbild „Frankfurt macht Bus und Bahn kostenlos“ (Export …_COVER_VORSCHAU.png, nicht zur Veröffentlichung).
 * Profilbild = offizielles Logo (unverändert), Account = @frankfurtrednews (BRAND_NEWS); Vorgänger im Raster: #18 und #17.
 */
export const FrankfurtErklaertGratisNahverkehrCoverVorschau: React.FC = () => (
	<CoverPreviewSheet
		title="Gratis-Nahverkehr"
		caption="FRANKFURT MACHT BUS UND BAHN KOSTENLOS – AUSGERECHNET AM 12. DEZEMBER! … mehr"
		cover={<GratisCover thumbnail />}
		avatar={(s) => <BrandLogo size={s} border={false} />}
		handle={handleWithAt('news')}
		videoFrame={
			<Sequence from={-15}>
				<FrankfurtErklaertGratisNahverkehr {...erklaertGratisDefaultProps} timeline={erklaertTimeline(GRATIS_EPISODE, erklaertGratisDefaultProps.voiceover, VIDEO.fps)} />
			</Sequence>
		}
		previous={[
			{node: <PlanungCover thumbnail />, label: 'PLANUNGSTREFFEN'},
			{node: <CondorCover thumbnail />, label: 'CONDOR-FLÜGE'},
		]}
	/>
);
