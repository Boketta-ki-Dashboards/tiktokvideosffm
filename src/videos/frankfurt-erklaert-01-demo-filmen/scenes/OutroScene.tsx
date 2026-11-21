import React from 'react';
import {Sfx} from '../../../components/audio/Sfx';
import {ShortOutro} from '../../../formats/frankfurt-erklaert/Branding';
import type {SceneProps} from '../../frankfurt-2026-10-31/cues';

/** Format-Outro „FRANKFURT ERKLÄRT · IN 60 SEKUNDEN · @frankfurtred3“ (≈ 3 s). */
export const OutroScene: React.FC<SceneProps> = () => (
	<>
		<ShortOutro />
		<Sfx name="pop" at={12} volume={0.6} />
	</>
);
