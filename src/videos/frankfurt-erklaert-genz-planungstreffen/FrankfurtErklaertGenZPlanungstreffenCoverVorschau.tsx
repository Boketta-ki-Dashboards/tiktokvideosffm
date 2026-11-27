import React from 'react';
import {Sequence} from 'remotion';
import {BrandLogo} from '../../components/brand/BrandLogo';
import {CoverPreviewSheet} from '../../formats/frankfurt-erklaert/CoverPreview';
import {erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import {handleWithAt} from '../../theme/brand';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import {AusblickCover} from '../frankfurt-erklaert-12dez-ausblick/scenes/Scenes';
import {CondorCover} from '../frankfurt-erklaert-condor-fluege/scenes/Scenes';
import {erklaertPlanungDefaultProps, FrankfurtErklaertGenZPlanungstreffen, PLANUNG_EPISODE} from './FrankfurtErklaertGenZPlanungstreffen';
import {PlanungCover} from './scenes/Scenes';

ensureFontsLoaded();

/**
 * Prüfbogen Titelbild „Gen Z regelt Frankfurt – was soll sich am 12. Dezember ändern?“ (Export …_COVER_VORSCHAU.png, nicht zur Veröffentlichung).
 * Profilbild = offizielles Logo (unverändert), Account = @frankfurtrednews (BRAND_NEWS); Vorgänger im Raster: #17 und #16.
 */
export const FrankfurtErklaertGenZPlanungstreffenCoverVorschau: React.FC = () => (
	<CoverPreviewSheet
		title="Gen Z Planungstreffen"
		caption="GEN Z REGELT FRANKFURT – WAS SOLL SICH AM 12. DEZEMBER ÄNDERN? … mehr"
		cover={<PlanungCover thumbnail />}
		avatar={(s) => <BrandLogo size={s} border={false} />}
		handle={handleWithAt('news')}
		videoFrame={
			<Sequence from={-15}>
				<FrankfurtErklaertGenZPlanungstreffen {...erklaertPlanungDefaultProps} timeline={erklaertTimeline(PLANUNG_EPISODE, erklaertPlanungDefaultProps.voiceover, VIDEO.fps)} />
			</Sequence>
		}
		previous={[
			{node: <CondorCover thumbnail />, label: 'CONDOR-FLÜGE'},
			{node: <AusblickCover thumbnail />, label: '12.12.'},
		]}
	/>
);
