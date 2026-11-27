import React from 'react';
import {ensureFontsLoaded} from '../../theme/fonts';
import {DemoUpdateCover} from './scenes/Scenes';

ensureFontsLoaded();

/**
 * Titelbild „Gen-Z-Demo am 20.11. geändert!“ (Export FrankfurtRed3_20November_DemoUpdate_THUMBNAIL.png) – dieselbe Komponente wie die erste
 * Videoszene (Frame 0), zusätzlich die Frage „WAS IST JETZT ANDERS?“ im Untertitel-Band (im Video steht dort „Ewa, Frankfurt!“).
 */
export const FrankfurtErklaert20NovemberDemoUpdateCover: React.FC = () => <DemoUpdateCover thumbnail />;
