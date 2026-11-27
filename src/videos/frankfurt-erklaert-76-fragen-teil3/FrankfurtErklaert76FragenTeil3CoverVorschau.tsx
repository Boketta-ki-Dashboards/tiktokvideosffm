import React from 'react';
import {Sequence} from 'remotion';
import {CoverPreviewSheet} from '../../formats/frankfurt-erklaert/CoverPreview';
import {ensureFontsLoaded} from '../../theme/fonts';
import {Teil2Cover} from '../frankfurt-erklaert-76-fragen-teil2/scenes/Scenes';
import {FrankfurtErklaert76FragenCover} from '../frankfurt-erklaert-76-fragen-landtag/FrankfurtErklaert76FragenCover';
import {erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import {VIDEO} from '../../theme/tokens';
import {erklaert76Teil3DefaultProps, FrankfurtErklaert76FragenTeil3, TEIL3_EPISODE} from './FrankfurtErklaert76FragenTeil3';
import {Teil3Cover} from './scenes/Scenes';

ensureFontsLoaded();

/**
 * Prüfbogen fürs Titelbild Teil 3 (Export FrankfurtRed3_76Fragen_Teil3_COVER_VORSCHAU.png, nicht zur Veröffentlichung):
 * 9:16 mit Zonen, 3:4-Ausschnitt, Profilraster neben Teil 2 und Teil 1, Videoframe 15 mit App-Bedienelementen.
 */
export const FrankfurtErklaert76FragenTeil3CoverVorschau: React.FC = () => (
	<CoverPreviewSheet
		title="76 Fragen – Teil 3"
		cover={<Teil3Cover morph={0} thumbnail />}
		videoFrame={
			<Sequence from={-15}>
				<FrankfurtErklaert76FragenTeil3 {...erklaert76Teil3DefaultProps} timeline={erklaertTimeline(TEIL3_EPISODE, erklaert76Teil3DefaultProps.voiceover, VIDEO.fps)} />
			</Sequence>
		}
		previous={[
			{node: <Teil2Cover morph={0} thumbnail />, label: 'TEIL 2'},
			{node: <FrankfurtErklaert76FragenCover />, label: 'TEIL 1'},
		]}
	/>
);
