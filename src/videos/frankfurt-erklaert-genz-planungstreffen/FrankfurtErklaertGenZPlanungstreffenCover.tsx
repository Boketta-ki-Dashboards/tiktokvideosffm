import React from 'react';
import {ensureFontsLoaded} from '../../theme/fonts';
import {PlanungCover} from './scenes/Scenes';

ensureFontsLoaded();

/**
 * Titelbild „Gen Z regelt Frankfurt – was soll sich am 12. Dezember ändern?“ (Export FrankfurtRedNews_GenZ_Planungstreffen_12Dezember_25Nov2026_THUMBNAIL.png) –
 * dieselbe Komponente wie die erste Videoszene (Frame 0), zusätzlich die Themenzeile im Untertitel-Band (im Video steht dort „Ewa, Frankfurt!“).
 */
export const FrankfurtErklaertGenZPlanungstreffenCover: React.FC = () => <PlanungCover thumbnail />;
