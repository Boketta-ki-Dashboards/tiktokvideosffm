import React from 'react';
import {Sequence} from 'remotion';
import {BrandLogo} from '../../components/brand/BrandLogo';
import {CoverPreviewSheet} from '../../formats/frankfurt-erklaert/CoverPreview';
import {erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import {KontrollenCover} from '../frankfurt-erklaert-2150-kontrollen/scenes/Scenes';
import {BundesweitCover} from '../frankfurt-erklaert-20nov-bundesweit/scenes/Scenes';
import {erklaertVorbilanzDefaultProps, FrankfurtErklaert20NovemberVorbilanz, VORBILANZ_EPISODE} from './FrankfurtErklaert20NovemberVorbilanz';
import {VorbilanzCover} from './scenes/Scenes';

ensureFontsLoaded();

/**
 * Prüfbogen Titelbild „Frankfurt 20.11. – die erste Bilanz“ (Export FrankfurtRed3_20November_Vorbilanz_COVER_VORSCHAU.png, nicht zur Veröffentlichung).
 * Profilbild = offizielles Logo (BRAND.logoFile); Vorgänger im Raster: #13 und #12.
 */
export const FrankfurtErklaert20NovemberVorbilanzCoverVorschau: React.FC = () => (
	<CoverPreviewSheet
		title="Frankfurt 20.11. – Vorbilanz"
		caption="FRANKFURT 20.11. – DAS IST HEUTE PASSIERT! 🚨 … mehr"
		cover={<VorbilanzCover thumbnail />}
		avatar={(s) => <BrandLogo size={s} border={false} />}
		videoFrame={
			<Sequence from={-15}>
				<FrankfurtErklaert20NovemberVorbilanz {...erklaertVorbilanzDefaultProps} timeline={erklaertTimeline(VORBILANZ_EPISODE, erklaertVorbilanzDefaultProps.voiceover, VIDEO.fps)} />
			</Sequence>
		}
		previous={[
			{node: <KontrollenCover thumbnail />, label: '2.150 KONTROLLEN'},
			{node: <BundesweitCover thumbnail />, label: '73 STÄDTE'},
		]}
	/>
);
