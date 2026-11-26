import React from 'react';
import {ensureFontsLoaded} from '../../theme/fonts';
import {GratisCover} from './scenes/Scenes';

ensureFontsLoaded();

/**
 * Titelbild „Frankfurt macht Bus und Bahn kostenlos“ (Export FrankfurtRedNews_Kostenloser_Nahverkehr_12_19Dezember_26Nov2026_THUMBNAIL.png) –
 * dieselbe Komponente wie die erste Videoszene (Frame 0), zusätzlich die Themenzeile im Untertitel-Band (im Video steht dort „Ewa, Frankfurt!“).
 */
export const FrankfurtErklaertGratisNahverkehrCover: React.FC = () => <GratisCover thumbnail />;
