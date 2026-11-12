import React from 'react';
import {ensureFontsLoaded} from '../../theme/fonts';
import {Teil4Cover} from './scenes/Scenes';

ensureFontsLoaded();

/**
 * Titelbild Teil 4 (Export FrankfurtRed3_76Fragen_Teil4_THUMBNAIL.png) – dieselbe Komponente wie die erste Videoszene (Frame 0),
 * zusätzlich die Antwortzeile im Untertitel-Band (im Video steht dort „Ewa, Frankfurt!“).
 */
export const FrankfurtErklaert76FragenTeil4Cover: React.FC = () => <Teil4Cover morph={0} thumbnail />;
