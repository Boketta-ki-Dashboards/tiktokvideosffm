import React from 'react';
import {ensureFontsLoaded} from '../../theme/fonts';
import {Phase2Cover} from './scenes/Scenes';

ensureFontsLoaded();

/**
 * Titelbild „Gen Z regelt – Phase 2“ (Export FrankfurtRed3_GenZPhase2_THUMBNAIL.png) – dieselbe Komponente wie die erste
 * Videoszene (Frame 0), zusätzlich Datum + „4 Städte im Überblick“ im Untertitel-Band (im Video steht dort „Ewa, Frankfurt!“).
 */
export const FrankfurtErklaertGenZPhase2Cover: React.FC = () => <Phase2Cover thumbnail />;
