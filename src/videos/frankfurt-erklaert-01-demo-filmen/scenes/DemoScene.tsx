import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {clamp, EASE_IN_OUT, EASE_OUT} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {COLORS, FONTS} from '../../../theme/tokens';
import {ChapterTitle, Equation, InfoCard, LawChip, Pop, SourceBar} from '../../../formats/frankfurt-erklaert/components';
import {ACCENT} from '../../../formats/frankfurt-erklaert/theme';
import {DemoStreet} from '../../../formats/frankfurt-erklaert/visuals/DemoStreet';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {DEMO} from '../content';

/**
 * Szene 2 – Friedlich dabei: 2,5D-Zeil mit Demonstrierenden und Schildern, hervorgehobene Person („DU: FRIEDLICH“),
 * hinten stilisiert „EINZELNE RANDALIEREN“. Art. 8 GG → „DABEI SEIN ≠ STRAFBAR SEIN“ → § 125 StGB: eigene Beteiligung.
 */
export const DemoScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const d1 = cue(cues, 'demo1', 4);
	const d2 = cue(cues, 'demo2', 74);
	const atRiot = wordFrame(cues, 'Randaliert', d2.from);
	const atAuto = wordFrame(cues, 'automatisch', d2.from + 54);
	const atLaw = wordFrame(cues, 'Landfriedensbruch', d2.from + 106);
	const atR = [wordFrame(cues, 'mitmachst', d2.from + 154), wordFrame(cues, 'unterstützt', d2.from + 172), wordFrame(cues, 'anstachelst', d2.from + 210)];

	const dolly = interpolate(frame, [0, durationInFrames], [2, 8], {...clamp, easing: EASE_IN_OUT});
	const hi = interpolate(frame, [d1.from + 4, d1.from + 20], [0, 1], {...clamp, easing: EASE_OUT});
	const conflict = interpolate(frame, [atRiot - 4, atRiot + 16], [0, 1], {...clamp, easing: EASE_OUT});
	const labels = interpolate(frame, [atRiot + 10, atRiot + 22], [0, 1], clamp);
	// Phasen der Texttafel
	const phaseA = 1 - interpolate(frame, [atAuto - 8, atAuto], [0, 1], clamp);
	const phaseC = interpolate(frame, [atR[0] - 8, atR[0] + 2], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const scrim = interpolate(frame, [atAuto - 6, atAuto + 6], [0, 0.4], clamp);

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<DemoStreet dolly={dolly} pan={-0.4 + Math.sin(frame / 90) * 0.3} highlight="auto" highlightZ={20} highlightAmount={hi} conflict={conflict} conflictX={8} officers={3} seed="demo" youLabel={DEMO.labels.you} riotLabel={DEMO.labels.riot} labels={labels} />
			<AbsoluteFill style={{background: `linear-gradient(rgba(4,6,20,0.94) 0%, rgba(4,6,20,${0.62 + scrim * 0.5}) 30%, rgba(4,6,20,${scrim * 0.6}) 46%, rgba(4,6,20,0) 60%)`}} />

			<div style={{position: 'absolute', left: 64, top: 290}}>
				<ChapterTitle num={DEMO.chapter.num} text={DEMO.chapter.text} color={ACCENT.yes} at={-6} />
			</div>

			{/* Phase A: Art. 8 GG */}
			{phaseA > 0 ? (
				<div style={{position: 'absolute', left: 64, top: 400, width: 866, opacity: phaseA}}>
					<InfoCard icon="person" title={DEMO.right.title} text={DEMO.right.text} law={DEMO.right.law} color={ACCENT.yes} at={d1.from + 2} />
				</div>
			) : null}

			{/* Phase B: Kernaussage */}
			{frame >= atAuto - 2 && phaseC < 1 ? (
				<div style={{position: 'absolute', left: 64, top: 392, width: 866, opacity: 1 - phaseC, translate: `0 ${-phaseC * 60}px`}}>
					<Equation left={DEMO.equation[0]} right={DEMO.equation[1]} at={atAuto - 2} size={60} />
				</div>
			) : null}

			{/* Phase C: § 125 StGB – eigene Beteiligung */}
			{frame >= atLaw - 4 ? (
				<div style={{position: 'absolute', left: 64, top: 720 - 320 * phaseC, width: 866, display: 'flex', justifyContent: 'center', opacity: interpolate(frame, [atLaw - 4, atLaw + 6], [0, 1], clamp)}}>
					<LawChip text={DEMO.law} size={32} color={ACCENT.law} style={{background: 'rgba(14,12,40,0.96)'}} />
				</div>
			) : null}
			{phaseC > 0 ? (
				<>
					<div style={{position: 'absolute', left: 64, top: 470, width: 866, display: 'flex', justifyContent: 'space-between'}}>
						{DEMO.roles.map((r, i) => (
							<Pop key={r} at={atR[i] - 2} dy={30}>
								<div style={{width: 276, padding: '16px 0 18px', borderRadius: 20, background: 'rgba(8,10,28,0.9)', border: `3px solid ${ACCENT.no}`, boxShadow: `0 16px 40px ${withAlpha(ACCENT.no, 0.25)}`, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 31, color: COLORS.text}}>{r}</div>
							</Pop>
						))}
					</div>
					<div style={{position: 'absolute', left: 64, top: 556, width: 866, display: 'flex', justifyContent: 'center'}}>
						<Pop at={atR[2] + 12} dy={40}>
							<div style={{padding: '14px 30px 16px', borderRadius: 22, background: `linear-gradient(160deg, ${COLORS.signal} 0%, #FFB82E 100%)`, boxShadow: '0 4px 0 #C98A12, 0 26px 50px rgba(0,0,0,0.55)', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 52, lineHeight: 1.04, color: ACCENT.ink, textAlign: 'center'}}>
								{DEMO.banner[0]}
								<br />
								{DEMO.banner[1]}
							</div>
						</Pop>
					</div>
				</>
			) : null}

			<SourceBar text={DEMO.source} at={d1.from + 10} />

			<Sfx name="pop" at={d1.from + 2} volume={0.7} />
			<Sfx name="blip" at={atRiot + 10} volume={0.8} />
			<Sfx name="softImpact" at={atAuto - 2} volume={0.7} />
			<Sfx name="click" at={atLaw - 4} volume={0.7} />
			{atR.map((f, i) => (
				<Sfx key={i} name="pop" at={f - 2} volume={0.55} />
			))}
			<Sfx name="stamp" at={atR[2] + 12} volume={0.6} />
		</AbsoluteFill>
	);
};
