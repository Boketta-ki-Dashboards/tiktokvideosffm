import React from 'react';
import {Sequence} from 'remotion';
import {CoverPreviewSheet} from '../../formats/frankfurt-erklaert/CoverPreview';
import {erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import {Teil3Cover} from '../frankfurt-erklaert-76-fragen-teil3/scenes/Scenes';
import {Teil4Cover} from '../frankfurt-erklaert-76-fragen-teil4/scenes/Scenes';
import {erklaert14NovemberDefaultProps, FrankfurtErklaert14November, NOV14_EPISODE} from './FrankfurtErklaert14November';
import {Nov14Cover} from './scenes/Scenes';

ensureFontsLoaded();

/** Prüfbogen Titelbild 14.11. (Export FrankfurtRed3_14November_COVER_VORSCHAU.png, nicht zur Veröffentlichung). */
export const FrankfurtErklaert14NovemberCoverVorschau: React.FC = () => (
	<CoverPreviewSheet
		title="14.11. – Doch eine Gen-Z-Demo?"
		caption="14.11. – DOCH EINE GEN-Z-DEMO IN FRANKFURT?! … mehr"
		cover={<Nov14Cover thumbnail />}
		videoFrame={
			<Sequence from={-15}>
				<FrankfurtErklaert14November {...erklaert14NovemberDefaultProps} timeline={erklaertTimeline(NOV14_EPISODE, erklaert14NovemberDefaultProps.voiceover, VIDEO.fps)} />
			</Sequence>
		}
		previous={[
			{node: <Teil4Cover morph={0} thumbnail />, label: 'TEIL 4'},
			{node: <Teil3Cover morph={0} thumbnail />, label: 'TEIL 3'},
		]}
	/>
);
