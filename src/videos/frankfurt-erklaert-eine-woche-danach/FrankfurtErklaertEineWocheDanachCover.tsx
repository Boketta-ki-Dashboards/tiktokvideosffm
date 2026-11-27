import React from 'react';
import {ensureFontsLoaded} from '../../theme/fonts';
import {WocheCover} from './scenes/Scenes';

ensureFontsLoaded();

/**
 * Titelbild „Gen Z: eine Woche danach – was ermittelt die Polizei?“ (Export FrankfurtRedNews_GenZ_EineWocheDanach_Ermittlungsbilanz_27Nov2026_THUMBNAIL.png) –
 * dieselbe Komponente wie die erste Videoszene (Frame 0), zusätzlich die Themenzeile im Untertitel-Band (im Video steht dort „Ewa, Frankfurt!“).
 */
export const FrankfurtErklaertEineWocheDanachCover: React.FC = () => <WocheCover thumbnail />;
