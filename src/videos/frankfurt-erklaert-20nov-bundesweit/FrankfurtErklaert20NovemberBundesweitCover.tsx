import React from 'react';
import {ensureFontsLoaded} from '../../theme/fonts';
import {BundesweitCover} from './scenes/Scenes';

ensureFontsLoaded();

/**
 * Titelbild „73 Städte – ein Protesttag!“ (Export FrankfurtRed3_20November_Bundesweit_THUMBNAIL.png) – dieselbe Komponente wie die erste
 * Videoszene (Frame 0), zusätzlich „WAS PASSIERT MORGEN?“ + Stand im Untertitel-Band (im Video steht dort „Ewa, Frankfurt!“).
 */
export const FrankfurtErklaert20NovemberBundesweitCover: React.FC = () => <BundesweitCover thumbnail />;
