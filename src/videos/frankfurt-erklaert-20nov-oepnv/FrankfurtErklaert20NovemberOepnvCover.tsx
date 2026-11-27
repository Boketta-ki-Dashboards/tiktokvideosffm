import React from 'react';
import {ensureFontsLoaded} from '../../theme/fonts';
import {OepnvCover} from './scenes/Scenes';

ensureFontsLoaded();

/**
 * Titelbild „Frankfurt morgen: Diese Bahnen sind betroffen!“ (Export FrankfurtRed3_20November_OePNV_THUMBNAIL.png) – dieselbe Komponente wie
 * die erste Videoszene (Frame 0), zusätzlich die Frage „WAS FÄHRT – WAS NICHT?“ im Untertitel-Band (im Video steht dort „Ewa, Frankfurt!“).
 */
export const FrankfurtErklaert20NovemberOepnvCover: React.FC = () => <OepnvCover thumbnail />;
