import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {clamp, EASE_IN_OUT} from '../../../lib/animation';
import {COLORS} from '../../../theme/tokens';
import {ChapterTitle, Equation, InfoCard, SourceBar} from '../../../formats/frankfurt-erklaert/components';
import {ACCENT} from '../../../formats/frankfurt-erklaert/theme';
import {CameraOverlay, CameraPhone} from '../../../formats/frankfurt-erklaert/visuals/CameraPhone';
import {DemoStreet} from '../../../formats/frankfurt-erklaert/visuals/DemoStreet';
import {MOODS, NightCity} from '../../frankfurt-2026-11-20-ausblick/premium/NightCity';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {FILM} from '../content';

// Handy-Position (links) und Mittelpunkt des Displays für den Zoom „aus der Kamera heraus“
const PHONE = {left: 70, top: 420, width: 360};
const SCREEN_CENTER = {x: 180, y: 369};

/**
 * Szene 3 – Filmen: Start im Kamerabild (REC), Rückzug aus dem Display aufs Handy. AUFNEHMEN (grundsätzlich erlaubt)
 * und NICHT BEHINDERN; dann Veröffentlichen-Ansicht mit Prüfhinweisen (erkennbare Personen, private Gespräche)
 * → „FILMEN ≠ ALLES POSTEN DÜRFEN“.
 */
export const FilmScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const f1 = cue(cues, 'film1', 4);
	const f2 = cue(cues, 'film2', 216);
	const atFilm = wordFrame(cues, 'filmen', f1.from + 42);
	const atOk = wordFrame(cues, 'erlaubt', f1.from + 78);
	const atPolice = wordFrame(cues, 'Polizeieinsätze', f1.from + 108);
	const atObstruct = wordFrame(cues, 'behinder', f1.from + 160);
	const atUpload = wordFrame(cues, 'Hochladen', f2.from + 6);
	const atFaces = wordFrame(cues, 'Erkennbare', f2.from + 50);
	const atPrivate = wordFrame(cues, 'private', f2.from + 80);
	const atProblem = wordFrame(cues, 'problematisch', f2.from + 115);

	const pull = interpolate(frame, [10, 40], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const k = 3.8 - 2.8 * pull;
	const tx = (540 - (PHONE.left + SCREEN_CENTER.x)) * (1 - pull);
	const ty = (960 - (PHONE.top + SCREEN_CENTER.y)) * (1 - pull);
	const post = interpolate(frame, [atUpload - 4, atUpload + 12], [0, 1], clamp);
	const firstOut = interpolate(frame, [atUpload - 6, atUpload + 2], [1, 0], clamp);
	const dim = interpolate(frame, [atProblem - 4, atProblem + 6], [1, 0.55], clamp);
	const dolly = interpolate(frame, [0, durationInFrames], [6, 11], clamp);

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{opacity: 0.85}}>
				<NightCity mood={MOODS.police} progress={frame / durationInFrames} litRatio={0.3} bokeh={20} showPromenade={false} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.9) 0%, rgba(4,6,20,0.55) 40%, rgba(4,6,20,0.75) 100%)'}} />

			<div style={{position: 'absolute', left: 64, top: 290, opacity: pull}}>
				<ChapterTitle num={FILM.chapter.num} text={FILM.chapter.text} color={ACCENT.info} at={24} />
			</div>

			{/* Karten rechts */}
			<div style={{position: 'absolute', left: 452, width: 478, top: 430, opacity: firstOut}}>
				{firstOut > 0 ? <InfoCard icon="camera" title={FILM.record.title} text={FILM.record.text} color={ACCENT.yes} at={atOk - 2} /> : null}
			</div>
			<div style={{position: 'absolute', left: 452, width: 478, top: 700, opacity: firstOut}}>
				{firstOut > 0 ? <InfoCard icon="hand" title={FILM.distance.title} text={FILM.distance.text} color={ACCENT.signal} at={atObstruct - 2} /> : null}
			</div>
			<div style={{position: 'absolute', left: 452, width: 478, top: 430, opacity: dim}}>
				{post > 0 ? <InfoCard icon="person" title={FILM.publish.title} text={FILM.publish.text} law={FILM.publish.law} color={ACCENT.no} at={atUpload + 4} titleSize={29} /> : null}
			</div>
			<div style={{position: 'absolute', left: 452, width: 478, top: 720, opacity: dim}}>
				{post > 0 ? <InfoCard icon="chat" title={FILM.speech.title} text={FILM.speech.text} law={FILM.speech.law} color={ACCENT.law} at={atPrivate - 2} titleSize={29} /> : null}
			</div>

			{/* Handy: Start im Kamerabild, dann Rückzug */}
			<div style={{position: 'absolute', left: PHONE.left, top: PHONE.top, scale: String(k), translate: `${tx}px ${ty}px`, transformOrigin: `${SCREEN_CENTER.x}px ${SCREEN_CENTER.y}px`, filter: pull > 0.6 ? 'drop-shadow(0 40px 60px rgba(0,0,0,0.6))' : undefined, opacity: frame >= atProblem ? dim + 0.2 : 1}}>
				<CameraPhone width={PHONE.width} recFrom={atFilm} post={post} checksAt={[atFaces, atPrivate]}>
					<DemoStreet dolly={dolly} pan={1.2} officers={5} crowd={20} seed="film" />
				</CameraPhone>
			</div>

			{pull < 0.5 ? <CameraOverlay recFrom={atFilm} opacity={1 - pull * 2} /> : null}

			{/* Kernaussage */}
			{frame >= atProblem - 2 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 935, display: 'flex', justifyContent: 'center'}}>
					<Equation left={FILM.equation[0]} right={FILM.equation[1]} at={atProblem - 2} size={58} layout="compact" leftColor={ACCENT.yes} rightColor={ACCENT.no} />
				</div>
			) : null}

			<SourceBar text={FILM.source} at={atOk} />

			<Sfx name="whoosh" at={12} volume={0.5} />
			<Sfx name="click" at={atFilm} volume={0.9} />
			<Sfx name="pop" at={atOk - 2} volume={0.6} />
			<Sfx name="blip" at={atPolice} volume={0.6} />
			<Sfx name="pop" at={atObstruct - 2} volume={0.6} />
			<Sfx name="notify" at={atUpload} volume={0.8} />
			<Sfx name="click" at={atFaces} volume={0.7} />
			<Sfx name="click" at={atPrivate} volume={0.7} />
			<Sfx name="stamp" at={atProblem - 2} volume={0.6} />
		</AbsoluteFill>
	);
};
