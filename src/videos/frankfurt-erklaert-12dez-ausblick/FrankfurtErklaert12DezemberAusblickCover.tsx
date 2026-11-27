import React from 'react';
import {ensureFontsLoaded} from '../../theme/fonts';
import {AusblickCover} from './scenes/Scenes';

ensureFontsLoaded();

/**
 * Titelbild „Nach dem 20. November: Schon die nächste Demo geplant?“ (Export FrankfurtRed3_GenZ_WieGehtEsWeiter_12Dezember_THUMBNAIL.png) –
 * dieselbe Komponente wie die erste Videoszene (Frame 0), zusätzlich die Themenzeile im Untertitel-Band (im Video steht dort „Ewa, Frankfurt!“).
 */
export const FrankfurtErklaert12DezemberAusblickCover: React.FC = () => <AusblickCover thumbnail />;
