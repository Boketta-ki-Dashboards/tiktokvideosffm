import React from 'react';
import {Sequence} from 'remotion';
import {BrandLogo} from '../../components/brand/BrandLogo';
import {CoverPreviewSheet} from '../../formats/frankfurt-erklaert/CoverPreview';
import {erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import {Demo13Cover} from '../frankfurt-erklaert-13-demonstranten-2026-11-14/scenes/Scenes';
import {Nov20Cover} from '../frankfurt-erklaert-20nov-drei-proteste/scenes/Scenes';
import {DEMOUPDATE_EPISODE, erklaertDemoUpdateDefaultProps, FrankfurtErklaert20NovemberDemoUpdate} from './FrankfurtErklaert20NovemberDemoUpdate';
import {DemoUpdateCover} from './scenes/Scenes';

ensureFontsLoaded();

/**
 * Prüfbogen Titelbild „Gen-Z-Demo am 20.11. geändert!“ (Export FrankfurtRed3_20November_DemoUpdate_COVER_VORSCHAU.png, nicht zur Veröffentlichung).
 * Profilbild in Raster und App-Ansicht = offizielles Logo (BRAND.logoFile); Vorgänger im Raster: #09 und #08.
 */
export const FrankfurtErklaert20NovemberDemoUpdateCoverVorschau: React.FC = () => (
	<CoverPreviewSheet
		title="Gen-Z-Demo geändert"
		caption="GEN-Z-DEMO AM 20.11. GEÄNDERT! 🚨 NEUER ABLAUF IN FRANKFURT … mehr"
		cover={<DemoUpdateCover thumbnail />}
		avatar={(s) => <BrandLogo size={s} border={false} />}
		videoFrame={
			<Sequence from={-15}>
				<FrankfurtErklaert20NovemberDemoUpdate {...erklaertDemoUpdateDefaultProps} timeline={erklaertTimeline(DEMOUPDATE_EPISODE, erklaertDemoUpdateDefaultProps.voiceover, VIDEO.fps)} />
			</Sequence>
		}
		previous={[
			{node: <Nov20Cover thumbnail />, label: '4 PROTESTE'},
			{node: <Demo13Cover thumbnail />, label: '13 DEMO'},
		]}
	/>
);
