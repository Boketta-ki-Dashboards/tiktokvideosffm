import React from 'react';
import {ensureFontsLoaded} from '../../theme/fonts';
import {Nov20Cover} from './scenes/Scenes';

ensureFontsLoaded();

/**
 * Titelbild „4 Proteste – 1 Freitag“ (Export FrankfurtRed3_20November_3Proteste_THUMBNAIL.png) – dieselbe Komponente wie die erste
 * Videoszene (Frame 0), zusätzlich die Frage „WAS PASSIERT AM 20.11.?“ im Untertitel-Band (im Video steht dort „Ewa, Frankfurt!“).
 */
export const FrankfurtErklaert20NovemberDreiProtesteCover: React.FC = () => <Nov20Cover thumbnail />;
