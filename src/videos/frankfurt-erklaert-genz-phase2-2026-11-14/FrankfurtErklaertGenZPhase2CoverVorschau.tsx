import React from 'react';
import {Sequence} from 'remotion';
import {BrandLogo} from '../../components/brand/BrandLogo';
import {CoverPreviewSheet} from '../../formats/frankfurt-erklaert/CoverPreview';
import {erklaertTimeline} from '../../formats/frankfurt-erklaert/ErklaertFrame';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VIDEO} from '../../theme/tokens';
import {Nov14Cover} from '../frankfurt-erklaert-14-november-2026/scenes/Scenes';
import {Teil4Cover} from '../frankfurt-erklaert-76-fragen-teil4/scenes/Scenes';
import {erklaertGenZPhase2DefaultProps, FrankfurtErklaertGenZPhase2, PHASE2_EPISODE} from './FrankfurtErklaertGenZPhase2';
import {Phase2Cover} from './scenes/Scenes';

ensureFontsLoaded();

/**
 * Prüfbogen Titelbild „Gen Z regelt – Phase 2“ (Export FrankfurtRed3_GenZPhase2_COVER_VORSCHAU.png, nicht zur Veröffentlichung).
 * Profilbild in Raster und App-Ansicht = offizielles Logo (BRAND.logoFile).
 */
export const FrankfurtErklaertGenZPhase2CoverVorschau: React.FC = () => (
	<CoverPreviewSheet
		title="Gen Z regelt – Phase 2"
		caption="GEN Z PHASE 2 – 20 FESTNAHMEN IN BERLIN! 🚨 … mehr"
		cover={<Phase2Cover thumbnail />}
		avatar={(s) => <BrandLogo size={s} border={false} />}
		videoFrame={
			<Sequence from={-15}>
				<FrankfurtErklaertGenZPhase2 {...erklaertGenZPhase2DefaultProps} timeline={erklaertTimeline(PHASE2_EPISODE, erklaertGenZPhase2DefaultProps.voiceover, VIDEO.fps)} />
			</Sequence>
		}
		previous={[
			{node: <Nov14Cover thumbnail />, label: '14.11.'},
			{node: <Teil4Cover morph={0} thumbnail />, label: 'TEIL 4'},
		]}
	/>
);
