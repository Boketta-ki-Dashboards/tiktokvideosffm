import React from 'react';
import {ensureFontsLoaded} from '../../theme/fonts';
import {StaedteCover} from './scenes/Scenes';

ensureFontsLoaded();

/**
 * Titelbild „Gen-Z-Proteste: Hamburg, Leipzig …“ (Export FrankfurtRed3_20November_Staedte_THUMBNAIL.png) – dieselbe Komponente wie die erste
 * Videoszene (Frame 0), zusätzlich die Quellenzeile im Untertitel-Band (im Video steht dort „Ewa, Frankfurt!“).
 */
export const FrankfurtErklaert20NovemberStaedteCover: React.FC = () => <StaedteCover thumbnail />;
