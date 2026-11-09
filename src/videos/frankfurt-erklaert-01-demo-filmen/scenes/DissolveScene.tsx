import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {clamp, EASE_IN_OUT, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {COLORS, FONTS} from '../../../theme/tokens';
import {ChapterTitle, Equation, SourceBar} from '../../../formats/frankfurt-erklaert/components';
import {ACCENT} from '../../../formats/frankfurt-erklaert/theme';
import {IsoCity} from '../../../formats/frankfurt-erklaert/visuals/IsoCity';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {DISSOLVE} from '../content';

/** LED-Laufschrift-Tafel (Punktraster, bernsteinfarben). */
const LedBoard: React.FC<{lines: string[]; at: number}> = ({lines, at}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = springIn({frame, fps, delay: at, damping: 14, stiffness: 180});
	const on = frame >= at + 4 && (frame - at < 12 ? Math.floor((frame - at) / 2) % 2 === 0 : true);
	return (
		<div style={{opacity: Math.min(1, s * 2), scale: String(0.85 + 0.15 * s), padding: '18px 34px 22px', borderRadius: 20, background: '#0A0A10', border: '6px solid #2A2C3A', boxShadow: '0 0 0 3px #11131C, 0 30px 70px rgba(0,0,0,0.7)', backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1.5px, transparent 1.6px)', backgroundSize: '8px 8px'}}>
			{lines.map((l, i) => (
				<div key={l} style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 70, lineHeight: 1.06, letterSpacing: 4, textAlign: 'center', color: on ? '#FFB23A' : '#3A2A10', textShadow: on ? `0 0 18px ${withAlpha('#FF9A1A', 0.85)}, 0 0 4px #FFD27A` : 'none', opacity: on ? 0.92 + random(`led-${i}-${Math.floor(frame / 3)}`) * 0.08 : 1}}>
					{l}
				</div>
			))}
		</div>
	);
};

/**
 * Szene 5 – Auflösung: erhöhte Stadtansicht, LED-Tafel „VERSAMMLUNG AUFGELÖST“, Menschen gehen ruhig auseinander,
 * allgemeine Pfeile weg vom Platz (keine konkreten Wege) → „AUFLÖSUNG = ENTFERNEN“ (§ 14 Abs. 7 HVersFG).
 */
export const DissolveScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const e1 = cue(cues, 'end1', 4);
	const atAssembly = wordFrame(cues, 'Versammlung', e1.from + 8);
	const atDissolved = wordFrame(cues, 'aufgelöst', e1.from + 22);
	const atNow = wordFrame(cues, 'unverzüglich', e1.from + 70);
	const disperse = interpolate(frame, [atDissolved + 6, durationInFrames], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const arrows = interpolate(frame, [atDissolved + 10, atDissolved + 22], [0, 1], clamp);

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<IsoCity progress={frame / durationInFrames} disperse={disperse} arrows={arrows} centerY={820} seed="dissolve" />
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.92) 0%, rgba(4,6,20,0.45) 26%, rgba(4,6,20,0) 40%, rgba(4,6,20,0) 52%, rgba(4,6,20,0.55) 64%, rgba(4,6,20,0.3) 100%)'}} />
			<div style={{position: 'absolute', left: 64, top: 290}}>
				<ChapterTitle num={DISSOLVE.chapter.num} text={DISSOLVE.chapter.text} color={ACCENT.signal} at={-6} />
			</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 392, display: 'flex', justifyContent: 'center'}}>
				<LedBoard lines={DISSOLVE.board} at={atAssembly - 2} />
			</div>
			{frame >= atNow - 4 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 900, display: 'flex', justifyContent: 'center'}}>
					<Equation left={DISSOLVE.equation[0]} right={DISSOLVE.equation[1]} op="=" at={atNow - 4} size={58} layout="compact" leftColor={ACCENT.signal} rightColor={ACCENT.yes} />
				</div>
			) : null}
			<SourceBar text={DISSOLVE.source} at={atDissolved} />

			<Sfx name="blip" at={atAssembly} volume={0.8} />
			<Sfx name="stamp" at={atDissolved} volume={0.5} />
			<Sfx name="softImpact" at={atNow - 4} volume={0.7} />
		</AbsoluteFill>
	);
};
