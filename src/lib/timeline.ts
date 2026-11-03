import type {VoiceoverManifest} from './script-timing';

export type SceneSpec = {
	id: string;
	/** Sprechersegmente, die in dieser Szene gesprochen werden (Reihenfolge wie im Skript). */
	segmentIds: string[];
	/**
	 * Für Szenen ohne eigenes Segment (z. B. stummes Outro):
	 * Szene beginnt `offsetMs` nach dem ENDE dieses Segments.
	 */
	startAfterSegment?: {id: string; offsetMs?: number};
	/** Erwartete Mindestdauer (s) – wird nur geprüft (Warnung), Schnitte folgen immer der Stimme. */
	minSeconds?: number;
	/** Dauer des Übergangs IN diese Szene (Frames). Ignoriert für die erste Szene. */
	transitionInFrames?: number;
};

export type TimelineScene = {
	id: string;
	/** Absoluter Startframe der Szene inkl. einlaufendem Übergang. */
	from: number;
	/** Länge der <TransitionSeries.Sequence>. */
	durationInFrames: number;
	/** Absoluter Frame des harten Schnittpunkts (Mitte des Übergangs). */
	cutFrame: number;
	transitionInFrames: number;
};

export type Timeline = {
	scenes: TimelineScene[];
	durationInFrames: number;
};

/**
 * Baut aus den Sprecher-Timings einen Szenenplan für <TransitionSeries>.
 *
 * Jede Szene beginnt (Schnittpunkt) kurz bevor ihr erstes Segment gesprochen wird.
 * Übergänge werden symmetrisch um den Schnittpunkt gelegt, sodass Bild und Stimme
 * synchron bleiben – auch wenn sich die Sprecherdatei ändert.
 */
export const buildTimeline = ({
	scenes,
	manifest,
	fps,
	tailMs = 1200,
	maxDurationMs,
	anticipationMs = 120,
}: {
	scenes: SceneSpec[];
	manifest: VoiceoverManifest;
	fps: number;
	tailMs?: number;
	/** Obergrenze: Nachlauf wird gekürzt (aber nie unter 1,5 s), damit das Video nicht zu lang wird. */
	maxDurationMs?: number;
	anticipationMs?: number;
}): Timeline => {
	const toFrames = (ms: number) => Math.round((ms / 1000) * fps);
	const segmentStart = (id: string) => manifest.segments.find((s) => s.id === id)?.startMs;
	const segmentEnd = (id: string) => manifest.segments.find((s) => s.id === id)?.endMs;

	// 1. Schnittpunkte bestimmen
	const cuts: number[] = scenes.map((scene, i) => {
		if (i === 0) {
			return 0;
		}

		if (scene.startAfterSegment) {
			const after = segmentEnd(scene.startAfterSegment.id);
			if (after === undefined) {
				throw new Error(`Szene "${scene.id}": Segment "${scene.startAfterSegment.id}" fehlt im Sprecher-Manifest.`);
			}

			return toFrames(after + (scene.startAfterSegment.offsetMs ?? 200));
		}

		const firstSegment = scene.segmentIds.map(segmentStart).find((v) => v !== undefined);
		if (firstSegment === undefined) {
			throw new Error(`Szene "${scene.id}": keines der Segmente ${scene.segmentIds.join(', ')} im Sprecher-Manifest gefunden.`);
		}

		return toFrames(Math.max(0, firstSegment - anticipationMs));
	});

	const tail = maxDurationMs ? Math.max(1500, Math.min(tailMs, maxDurationMs - manifest.durationMs)) : tailMs;
	const end = Math.floor(((manifest.durationMs + tail) / 1000) * fps);
	const ends = [...cuts.slice(1), end];

	// 2. Mindestdauern nur PRÜFEN – Schnitte bleiben an der Stimme verankert.
	//    (Mehr Zeit für eine Szene → längere `pauseAfterMs` im Skript, nie Schnitte verschieben,
	//    sonst laufen Bild und Ton auseinander.)
	for (let i = 0; i < scenes.length; i++) {
		const minFrames = toFrames((scenes[i].minSeconds ?? 0) * 1000);
		const start = i === 0 ? 0 : cuts[i];
		if (ends[i] - start < minFrames) {
			console.warn(
				`Szene "${scenes[i].id}" ist ${((ends[i] - start) / fps).toFixed(2)} s lang (Minimum ${scenes[i].minSeconds} s). ` +
					'Tipp: pauseAfterMs im Sprecherskript erhöhen.',
			);
		}
	}

	// 3. Sequenzlängen für TransitionSeries berechnen
	const transitions = scenes.map((s, i) => (i === 0 ? 0 : (s.transitionInFrames ?? 0)));
	const result: TimelineScene[] = scenes.map((scene, i) => {
		const tIn = transitions[i];
		const tOut = i + 1 < scenes.length ? transitions[i + 1] : 0;
		const from = cuts[i] - Math.floor(tIn / 2);
		const to = ends[i] + Math.ceil(tOut / 2);
		return {
			id: scene.id,
			from,
			durationInFrames: Math.max(1, to - from),
			cutFrame: cuts[i],
			transitionInFrames: tIn,
		};
	});

	return {
		scenes: result,
		durationInFrames: ends[ends.length - 1],
	};
};
