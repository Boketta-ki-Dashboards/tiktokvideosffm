import React from 'react';
import {ensureFontsLoaded} from '../../theme/fonts';
import {Demo13Cover} from './scenes/Scenes';

ensureFontsLoaded();

/**
 * Titelbild „Nur 13 Demonstranten?“ (Export FrankfurtRed3_13Demonstranten_THUMBNAIL.png) – dieselbe Komponente wie die erste Videoszene
 * (Frame 0), zusätzlich die Frage „WARUM KAM KAUM JEMAND?“ im Untertitel-Band (im Video steht dort „Ewa, Frankfurt!“).
 */
export const FrankfurtErklaert13DemonstrantenCover: React.FC = () => <Demo13Cover thumbnail />;
