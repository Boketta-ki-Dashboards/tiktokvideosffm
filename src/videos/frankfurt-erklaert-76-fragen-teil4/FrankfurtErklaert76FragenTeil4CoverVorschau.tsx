import React from 'react';
import {Sequence} from 'remotion';
import {CoverPreviewSheet} from '../../formats/frankfurt-erklaert/CoverPreview';
import {erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import {Teil2Cover} from '../frankfurt-erklaert-76-fragen-teil2/scenes/Scenes';
import {Teil3Cover} from '../frankfurt-erklaert-76-fragen-teil3/scenes/Scenes';
import {erklaert76Teil4DefaultProps, FrankfurtErklaert76FragenTeil4, TEIL4_EPISODE} from './FrankfurtErklaert76FragenTeil4';
import {Teil4Cover} from './scenes/Scenes';

ensureFontsLoaded();

/** Prüfbogen Titelbild Teil 4 (Export FrankfurtRed3_76Fragen_Teil4_COVER_VORSCHAU.png, nicht zur Veröffentlichung). */
export const FrankfurtErklaert76FragenTeil4CoverVorschau: React.FC = () => (
	<CoverPreviewSheet
		title="76 Fragen – Teil 4"
		caption="76 FRAGEN – 4 WEITERE ANTWORTEN! … mehr"
		cover={<Teil4Cover morph={0} thumbnail />}
		videoFrame={
			<Sequence from={-15}>
				<FrankfurtErklaert76FragenTeil4 {...erklaert76Teil4DefaultProps} timeline={erklaertTimeline(TEIL4_EPISODE, erklaert76Teil4DefaultProps.voiceover, VIDEO.fps)} />
			</Sequence>
		}
		previous={[
			{node: <Teil3Cover morph={0} thumbnail />, label: 'TEIL 3'},
			{node: <Teil2Cover morph={0} thumbnail />, label: 'TEIL 2'},
		]}
	/>
);
