import React from 'react';
import {ensureFontsLoaded} from '../../theme/fonts';
import {Nov14Cover} from './scenes/Scenes';

ensureFontsLoaded();

/**
 * Titelbild Sondervideo 14.11. (Export FrankfurtRed3_14November_THUMBNAIL.png) – dieselbe Komponente wie die erste Videoszene
 * (Frame 0), zusätzlich die Ortszeile im Untertitel-Band (im Video steht dort „Ewa, Frankfurt!“).
 */
export const FrankfurtErklaert14NovemberCover: React.FC = () => <Nov14Cover thumbnail />;
