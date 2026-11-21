import React from 'react';
import {ensureFontsLoaded} from '../../theme/fonts';
import {KontrollenCover} from './scenes/Scenes';

ensureFontsLoaded();

/**
 * Titelbild „Über 2.150 Kontrollen auf der Zeil“ (Export FrankfurtRed3_2150Kontrollen_THUMBNAIL.png) – dieselbe Komponente wie die erste
 * Videoszene (Frame 0), zusätzlich „BILANZ VOM 18.11.2026“ im Untertitel-Band (im Video steht dort „Ewa, Frankfurt!“).
 */
export const FrankfurtErklaert2150KontrollenCover: React.FC = () => <KontrollenCover thumbnail />;
