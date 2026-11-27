import React from 'react';
import {ensureFontsLoaded} from '../../theme/fonts';
import {VorbilanzCover} from './scenes/Scenes';

ensureFontsLoaded();

/**
 * Titelbild „Frankfurt 20.11. – die erste Bilanz“ (Export FrankfurtRed3_20November_Vorbilanz_THUMBNAIL.png) – dieselbe Komponente wie die erste
 * Videoszene (Frame 0), zusätzlich „STAND …, KEINE ENDBILANZ“ im Untertitel-Band (im Video steht dort „Ewa, Frankfurt!“).
 */
export const FrankfurtErklaert20NovemberVorbilanzCover: React.FC = () => <VorbilanzCover thumbnail />;
