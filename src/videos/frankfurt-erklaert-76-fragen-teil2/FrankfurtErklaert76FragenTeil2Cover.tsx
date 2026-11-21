import React from 'react';
import {ensureFontsLoaded} from '../../theme/fonts';
import {Teil2Cover} from './scenes/Scenes';

ensureFontsLoaded();

/** Titelbild Teil 2 (Export FrankfurtRed3_76Fragen_Teil2_THUMBNAIL.png) – dieselbe Komponente wie die erste Videoszene. */
export const FrankfurtErklaert76FragenTeil2Cover: React.FC = () => <Teil2Cover morph={0} thumbnail />;
