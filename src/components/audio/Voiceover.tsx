import React from 'react';
import {Audio} from '@remotion/media';
import {Sequence, staticFile, useVideoConfig} from 'remotion';
import type {SegmentTiming, VoiceoverManifest} from '../../lib/script-timing';

/**
 * Spielt die Sprecherdatei aus dem Manifest ab (public/voiceover/…).
 * Ohne Datei (audioFile = null) bleibt das Video stumm – Rendern schlägt nicht fehl.
 */
export const Voiceover: React.FC<{manifest: VoiceoverManifest; volume?: number}> = ({manifest, volume = 1}) => {
	if (!manifest.audioFile) {
		return null;
	}

	return <Audio name="Sprecher" src={staticFile(manifest.audioFile)} volume={volume} />;
};

/** Kurzer Soundeffekt ab einem bestimmten Frame. */
export const SoundEffect: React.FC<{src: string; at: number; volume?: number; name?: string}> = ({src, at, volume = 0.5, name}) => (
	<Sequence from={at} name={name ?? `SFX ${src}`} layout="none">
		<Audio src={staticFile(src)} volume={volume} />
	</Sequence>
);

/**
 * Musikbett mit automatischem „Ducking“: Während gesprochen wird, sinkt die Lautstärke.
 * Nur lizenzfreie Musik verwenden (CC0 / eigene Produktion) und in references/ dokumentieren.
 */
export const MusicBed: React.FC<{
	src: string;
	segments: SegmentTiming[];
	volume?: number;
	duckedVolume?: number;
	fadeMs?: number;
}> = ({src, segments, volume = 0.35, duckedVolume = 0.12, fadeMs = 250}) => {
	const {fps} = useVideoConfig();
	return (
		<Audio
			name="Musik"
			src={staticFile(src)}
			loop
			volume={(f) => {
				const ms = (f / fps) * 1000;
				let v = volume;
				for (const s of segments) {
					if (ms >= s.startMs - fadeMs && ms <= s.endMs + fadeMs) {
						const inT = Math.min(1, Math.max(0, (ms - (s.startMs - fadeMs)) / fadeMs));
						const outT = Math.min(1, Math.max(0, (s.endMs + fadeMs - ms) / fadeMs));
						v = Math.min(v, volume - (volume - duckedVolume) * Math.min(inT, outT));
					}
				}

				return v;
			}}
		/>
	);
};
