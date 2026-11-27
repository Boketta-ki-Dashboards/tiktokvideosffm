import React from 'react';
import {Sequence} from 'remotion';
import {BrandLogo} from '../../components/brand/BrandLogo';
import {CoverPreviewSheet} from '../../formats/frankfurt-erklaert/CoverPreview';
import {erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import {handleWithAt} from '../../theme/brand';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import {GratisCover} from '../frankfurt-erklaert-gratis-nahverkehr/scenes/Scenes';
import {PlanungCover} from '../frankfurt-erklaert-genz-planungstreffen/scenes/Scenes';
import {erklaertWocheDefaultProps, FrankfurtErklaertEineWocheDanach, WOCHE_EPISODE} from './FrankfurtErklaertEineWocheDanach';
import {WocheCover} from './scenes/Scenes';

ensureFontsLoaded();

/**
 * Prüfbogen Titelbild „Gen Z: eine Woche danach“ (Export …_COVER_VORSCHAU.png, nicht zur Veröffentlichung).
 * Profilbild = offizielles Logo (unverändert), Account = @frankfurtrednews (BRAND_NEWS); Vorgänger im Raster: #19 und #18.
 */
export const FrankfurtErklaertEineWocheDanachCoverVorschau: React.FC = () => (
	<CoverPreviewSheet
		title="Eine Woche danach"
		caption="GEN Z: EINE WOCHE DANACH – WAS ERMITTELT DIE POLIZEI? … mehr"
		cover={<WocheCover thumbnail />}
		avatar={(s) => <BrandLogo size={s} border={false} />}
		handle={handleWithAt('news')}
		videoFrame={
			<Sequence from={-15}>
				<FrankfurtErklaertEineWocheDanach {...erklaertWocheDefaultProps} timeline={erklaertTimeline(WOCHE_EPISODE, erklaertWocheDefaultProps.voiceover, VIDEO.fps)} />
			</Sequence>
		}
		previous={[
			{node: <GratisCover thumbnail />, label: 'GRATIS-NAHVERKEHR'},
			{node: <PlanungCover thumbnail />, label: 'PLANUNGSTREFFEN'},
		]}
	/>
);
