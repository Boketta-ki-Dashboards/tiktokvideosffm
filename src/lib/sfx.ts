import {PREMIUM_SFX} from './sfx-premium.ts';

/**
 * Zentrale Soundeffekt-Bibliothek (für alle Folgen).
 *
 * - Semantische Namen statt Dateipfade: Szenen schreiben `<Sfx name="pop" at={…} />`.
 * - Grundlautstärken sind so gewählt, dass Effekte dezent UNTER der Stimme liegen (Stimme −14 LUFS).
 * - Selbst erzeugt: `scripts/audio/generate-sfx.mjs` (FFmpeg, lizenzfrei).
 * - Optional ElevenLabs-Premium-Effekte (`scripts/audio/elevenlabs-sfx.mjs`): sind sie in
 *   `sfx-premium.ts` eingetragen, ersetzen sie automatisch den gleichnamigen Synth-Effekt.
 */
export type SfxName =
	| 'whoosh'
	| 'impact'
	| 'pop'
	| 'click'
	| 'notify'
	| 'blip'
	| 'typewriter'
	| 'paper'
	| 'softImpact'
	| 'boom'
	| 'riser'
	| 'stamp';

export type SfxDefinition = {
	file: string;
	/** Grundlautstärke 0–1 (vor Master). */
	volume: number;
	/** Wofür der Effekt gedacht ist. */
	use: string;
};

export const SFX_LIBRARY: Record<SfxName, SfxDefinition> = {
	whoosh: {file: 'sfx/whoosh.wav', volume: 0.35, use: 'Szenenwechsel, Kameraschwenk'},
	impact: {file: 'sfx/impact.wav', volume: 0.3, use: 'harter Schnitt, Stempel (Bestand)'},
	pop: {file: 'sfx/pop.wav', volume: 0.25, use: 'Element erscheint (Bestand)'},
	click: {file: 'sfx/click.wav', volume: 0.16, use: 'Text-Chip, Kalender, Uhrzeit'},
	notify: {file: 'sfx/notify.wav', volume: 0.14, use: 'Social-Karte, Benachrichtigung'},
	blip: {file: 'sfx/blip.wav', volume: 0.12, use: 'Kartenpunkt, Land leuchtet auf'},
	typewriter: {file: 'sfx/typewriter.wav', volume: 0.1, use: 'Schlagzeile erscheint'},
	paper: {file: 'sfx/paper.wav', volume: 0.14, use: 'Nachrichtenkarte fliegt ein'},
	softImpact: {file: 'sfx/soft-impact.wav', volume: 0.2, use: 'Statistik-Karte, Zahl rastet ein'},
	boom: {file: 'sfx/boom.wav', volume: 0.32, use: 'cineastischer Akzent (Finale Weltkarte)'},
	riser: {file: 'sfx/riser.wav', volume: 0.14, use: 'Spannungsaufbau vor dem Finale'},
	stamp: {file: 'sfx/stamp.wav', volume: 0.22, use: 'Faktencheck-Stempel'},
};

type PremiumEntry = {file: string; gain?: number};
const PREMIUM = PREMIUM_SFX as Partial<Record<SfxName, PremiumEntry>>;

/** Datei und Lautstärke eines Effekts (Premium-Version, falls vorhanden). */
export const resolveSfx = (name: SfxName): {src: string; volume: number; premium: boolean} => {
	const def = SFX_LIBRARY[name];
	const p = PREMIUM[name];
	if (p) {
		return {src: p.file, volume: def.volume * (p.gain ?? 1), premium: true};
	}

	return {src: def.file, volume: def.volume, premium: false};
};

export type SfxCue = {name: SfxName; at: number; volume?: number};
