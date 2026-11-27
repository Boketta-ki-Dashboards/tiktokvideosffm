import React from 'react';
import {ensureFontsLoaded} from '../../theme/fonts';
import {CondorCover} from './scenes/Scenes';

ensureFontsLoaded();

/**
 * Titelbild „Zwei Flugzeuge – Passagiere krank an Bord“ (Export FrankfurtRedNews_Condor_Flughafen_Krankheitsfaelle_23Nov2026_THUMBNAIL.png) –
 * dieselbe Komponente wie die erste Videoszene (Frame 0), zusätzlich die Themenzeile im Untertitel-Band (im Video steht dort „Ewa, Frankfurt!“).
 */
export const FrankfurtErklaertCondorFluegeCover: React.FC = () => <CondorCover thumbnail />;
