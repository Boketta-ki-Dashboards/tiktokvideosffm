import React from 'react';
import {ensureFontsLoaded} from '../../theme/fonts';
import {Teil3Cover} from './scenes/Scenes';

ensureFontsLoaded();

/**
 * Titelbild Teil 3 (Export FrankfurtRed3_76Fragen_Teil3_THUMBNAIL.png) – dieselbe Komponente wie die erste Videoszene (Frame 0),
 * zusätzlich die Themenzeile im Untertitel-Band (im Video steht dort „Ewa, Frankfurt!“).
 */
export const FrankfurtErklaert76FragenTeil3Cover: React.FC = () => <Teil3Cover morph={0} thumbnail />;
