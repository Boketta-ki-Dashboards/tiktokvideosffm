import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {GridBackdrop} from '../../../components/backgrounds/GridBackdrop';
import {HurdleLadder} from '../../../components/law/HurdleLadder';
import {ArticleCard} from '../../../components/law/ArticleCard';
import {LawScale} from '../../../components/law/LawScale';
import {SafeArea} from '../../../components/layout/SafeArea';
import {SourceCredit} from '../../../components/media/SourceCredit';
import {Kicker} from '../../../components/text/Kicker';
import {clamp, EASE_OUT, springIn} from '../../../lib/animation';
import {COLORS, FONTS} from '../../../theme/tokens';
import {cue, type SceneProps} from '../../frankfurt-2026-10-31/cues';
import {TERMIN_DATA} from '../termine';

/** Szene 6: Rechtslage – Art. 8 GG (wörtlich), Waage, Hürden für ein Verbot laut Rechtsexperte. */
export const LawScene: React.FC<SceneProps> = ({cues}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const l1 = cue(cues, 'law1', 4);
	const l2 = cue(cues, 'law2', l1.to + 4);
	const {artikel8, huerden} = TERMIN_DATA.recht;
	const phase2 = l2.from - 6;
	const out1 = interpolate(frame, [phase2 - 8, phase2 + 6], [1, 0], clamp);
	const in2 = interpolate(frame, [phase2 + 4, phase2 + 20], [0, 1], {...clamp, easing: EASE_OUT});
	const span = l2.to - l2.from;
	const headline = springIn({frame, fps, delay: 4, damping: 14});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night}}>
			<GridBackdrop accent={COLORS.signal} seed="law" stops={['#0C1236', '#05081A']} />
			<SafeArea>
				<Kicker text="RECHTLICHE LAGE" color={COLORS.signal} delay={0} />
			</SafeArea>

			{/* Phase 1: Artikel 8 + Waage */}
			<div style={{position: 'absolute', inset: 0, opacity: out1}}>
				<div style={{position: 'absolute', top: 255, left: 64, width: 866, opacity: Math.min(1, headline * 1.6), translate: `0 ${(1 - headline) * 30}px`}}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 58, lineHeight: 1.02, color: COLORS.text}}>
						ARTIKEL 8 <span style={{color: COLORS.signal}}>GRUNDGESETZ</span>
					</div>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 62, lineHeight: 1.02, color: COLORS.signal, marginTop: 4}}>VERSAMMLUNGSFREIHEIT</div>
				</div>
				<div style={{position: 'absolute', top: 465, left: 64}}>
					<ArticleCard
						heading="ARTIKEL 8 · ABSATZ 1"
						law="GRUNDGESETZ"
						text={artikel8.absatz1}
						mark="friedlich und ohne Waffen zu versammeln"
						delay={10}
						markFrame={l1.from + 36}
						width={866}
					/>
				</div>
				<div style={{position: 'absolute', top: 800, left: 170}}>
					<LawScale
						leftLabel="FREIHEIT"
						rightLabel="BESCHRÄNKUNG"
						width={600}
						delay={22}
						tilt={[
							{frame: 0, deg: 0},
							{frame: l1.from + 30, deg: 0},
							{frame: l1.from + 60, deg: -7},
						]}
					/>
				</div>
			</div>

			{/* Phase 2: Hürden */}
			{frame >= phase2 ? (
				<div style={{position: 'absolute', inset: 0, opacity: in2}}>
					<div style={{position: 'absolute', top: 255, left: 64, width: 866, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 52, lineHeight: 1.05, color: COLORS.text}}>
						VERBOT? DAS MÜSSTE <span style={{color: COLORS.signal}}>ERFÜLLT</span> SEIN:
					</div>
					<div style={{position: 'absolute', top: 440, left: 64}}>
						<HurdleLadder
							topLabel="VERBOT"
							topFrame={l2.from + Math.round(span * 0.82)}
							hurdles={huerden.map((h, i) => ({...h, from: l2.from + 6 + Math.round(span * 0.18 * i) + Math.round(span * 0.12)}))}
						/>
					</div>
					<div
						style={{
							position: 'absolute',
							left: 64,
							top: 1118,
							width: 866,
							display: 'flex',
							alignItems: 'center',
							gap: 22,
							padding: '16px 24px',
							borderRadius: 24,
							background: 'rgba(7,10,28,0.92)',
							border: `3px solid ${COLORS.panelBorder}`,
							opacity: interpolate(frame, [phase2 + 30, phase2 + 44], [0, 1], clamp),
						}}
					>
						<svg width={74} height={74} viewBox="0 0 74 74" style={{flexShrink: 0}}>
							<circle cx={37} cy={37} r={36} fill="#2A3770" stroke="#5B74C4" strokeWidth={3} />
							<circle cx={37} cy={29} r={12} fill="#8B93B8" />
							<path d="M 13 64 Q 37 34 61 64 Z" fill="#8B93B8" />
						</svg>
						<div style={{display: 'flex', flexDirection: 'column'}}>
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, color: COLORS.text, lineHeight: 1.1}}>Prof. Matthias Jahn</span>
							<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 27, color: COLORS.textMuted, lineHeight: 1.2}}>Strafrecht, Goethe-Universität Frankfurt – Einordnung</span>
						</div>
					</div>
				</div>
			) : null}

			<div style={{position: 'absolute', left: 64, top: 1250}}>
				<SourceCredit sources={['Grundgesetz Art. 8', 'hessenschau 02.11. (Prof. Jahn)']} delay={20} />
			</div>
		</AbsoluteFill>
	);
};
