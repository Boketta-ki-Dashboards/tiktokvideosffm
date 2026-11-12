import React, {createContext, useContext} from 'react';
import {Audio} from '@remotion/media';
import {Sequence, staticFile} from 'remotion';
import {resolveSfx, type SfxCue, type SfxName} from '../../lib/sfx';

type SfxSettings = {enabled: boolean; master: number};
const SfxContext = createContext<SfxSettings>({enabled: true, master: 1});

/** Schaltet alle <Sfx> darunter an/aus und setzt eine Master-Lautstärke (Props `sfx` der Komposition). */
export const SfxProvider: React.FC<{enabled: boolean; master?: number; children: React.ReactNode}> = ({enabled, master = 1, children}) => (
	<SfxContext.Provider value={{enabled, master}}>{children}</SfxContext.Provider>
);

/**
 * Bildgenauer Soundeffekt: `at` ist der Frame relativ zur umgebenden Sequenz/Szene.
 * Direkt neben die Animation schreiben, die ihn auslöst – so bleibt er synchron, auch wenn sich Szenen verschieben.
 */
export const Sfx: React.FC<{name: SfxName; at: number; volume?: number}> = ({name, at, volume = 1}) => {
	const {enabled, master} = useContext(SfxContext);
	if (!enabled || !Number.isFinite(at)) {
		return null;
	}

	const {src, volume: base} = resolveSfx(name);
	return (
		<Sequence from={Math.round(at)} layout="none" name={`SFX ${name}`}>
			<Audio src={staticFile(src)} volume={Math.min(1, base * volume * master)} />
		</Sequence>
	);
};

/** Liste von Cues (z. B. aus einem Szenenplan) abspielen. */
export const SfxCues: React.FC<{cues: SfxCue[]}> = ({cues}) => (
	<>
		{cues.map((c, i) => (
			<Sfx key={`${c.name}-${c.at}-${i}`} name={c.name} at={c.at} volume={c.volume} />
		))}
	</>
);
