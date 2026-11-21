import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {clamp, EASE_IN_OUT, EASE_OUT, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {COLORS, FONTS} from '../../../theme/tokens';
import {ChapterTitle, InfoCard, Pop, SourceBar} from '../../../formats/frankfurt-erklaert/components';
import {ACCENT} from '../../../formats/frankfurt-erklaert/theme';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {Officer, Youth} from '../../frankfurt-2026-11-polizeikontrollen/visuals/Characters';
import {Phone} from '../../frankfurt-2026-11-polizeikontrollen/visuals/Phone';
import {ZeilStreet} from '../../frankfurt-2026-11-polizeikontrollen/visuals/ZeilStreet';
import {POLICE} from '../content';

const CARD_TOPS = [420, 612, 804];
const PHONE = {left: 590, top: 410, width: 330};

/**
 * Szene 4 – Kontrolle: stilisierte, ruhige Kontrollsituation (Identitätsfeststellung, auch als Zeuge) → Handy in der Mitte
 * mit drei Karten IDENTITÄT · BEWEISMITTEL · SICHERSTELLUNG und Verbindungslinien → „NICHT AUTOMATISCH DIE GANZE GALERIE“.
 * Keine Gegenwehr, keine Taktik – beide Figuren bleiben ruhig.
 */
export const PoliceScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p1 = cue(cues, 'pol1', 4);
	const p2 = cue(cues, 'pol2', 152);
	const atControl = wordFrame(cues, 'kontrollieren', p1.from + 78);
	const atWitness = wordFrame(cues, 'Zeuge', p1.from + 124);
	const atEvidence = wordFrame(cues, 'Beweise', p2.from + 30);
	const atSeize = wordFrame(cues, 'sichergestellt', p2.from + 94);
	const atAuto = wordFrame(cues, 'automatisch', p2.from + 152);
	const atGallery = wordFrame(cues, 'Galerie', p2.from + 200);
	const cardFrames = [p2.from + 2, atEvidence - 2, atSeize - 2];

	const swap = interpolate(frame, [p2.from - 8, p2.from + 8], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const gesture = interpolate(frame, [atControl - 6, atControl + 8], [0, 0.8], {...clamp, easing: EASE_OUT});
	const phoneIn = springIn({frame, fps, delay: p2.from, damping: 15, stiffness: 120});
	const banner = springIn({frame, fps, delay: atAuto - 2, damping: 12, stiffness: 190});
	const dolly = interpolate(frame, [0, durationInFrames], [4, 9], clamp);

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{filter: `blur(${swap * 4}px) brightness(${1 - swap * 0.35})`}}>
				<ZeilStreet dolly={dolly} pan={1.2} people={8} officers={3} warm={0.55} blueLight={0.45} seed="erk-police" />
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.95) 0%, rgba(4,6,20,0.7) 32%, rgba(4,6,20,0.2) 56%, rgba(4,6,20,0.35) 100%)'}} />

			<div style={{position: 'absolute', left: 64, top: 290}}>
				<ChapterTitle num={POLICE.chapter.num} text={POLICE.chapter.text} color={ACCENT.info} at={-6} />
			</div>

			{/* Phase A: Kontrollsituation (fiktiv, stilisiert) */}
			{swap < 1 ? (
				<>
					<div style={{position: 'absolute', left: 120, top: 610 + swap * 700, opacity: 1 - swap}}>
						<Youth height={700} hoodie="#3D7BFF" phoneUp={0.3} calm />
					</div>
					<div style={{position: 'absolute', left: 610, top: 590 + swap * 700, opacity: 1 - swap}}>
						<Officer height={720} gesture={gesture} talk={frame >= atControl - 6 && frame < atWitness + 10} flip />
					</div>
					{frame >= atWitness - 2 ? (
						<div style={{position: 'absolute', left: 300, top: 640, opacity: 1 - swap}}>
							<Pop at={atWitness - 2} dy={20}>
								<div style={{padding: '8px 20px 10px', borderRadius: 14, background: ACCENT.info, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 32, color: ACCENT.ink, boxShadow: '0 12px 30px rgba(0,0,0,0.5)'}}>AUCH ALS ZEUGE</div>
							</Pop>
						</div>
					) : null}
					<div style={{position: 'absolute', left: 64, width: 866, top: 384, opacity: 1 - swap}}>
						<InfoCard icon="id" title={POLICE.idCheck.title} text={POLICE.idCheck.text} law={POLICE.idCheck.law} color={ACCENT.info} at={atControl - 4} />
					</div>
				</>
			) : null}

			{/* Phase B: Handy + drei Karten */}
			{swap > 0 ? (
				<>
					<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
						{CARD_TOPS.map((t, i) => {
							const o = interpolate(frame, [cardFrames[i] + 4, cardFrames[i] + 14], [0, 1], clamp);
							if (o <= 0) return null;
							const y1 = t + 88;
							const y2 = PHONE.top + 150 + i * 170;
							return (
								<g key={i} opacity={o}>
									<path d={`M540 ${y1} C 570 ${y1}, 570 ${y2}, ${PHONE.left + 22} ${y2}`} stroke={ACCENT.signal} strokeWidth={4} fill="none" strokeDasharray="10 10" strokeDashoffset={-frame * 1.5} />
									<circle cx={PHONE.left + 22} cy={y2} r={9} fill={ACCENT.signal} />
									<circle cx={540} cy={y1} r={7} fill={ACCENT.signal} />
								</g>
							);
						})}
					</svg>
					{POLICE.cards.map((c, i) => (
						<div key={c.title} style={{position: 'absolute', left: 64, width: 476, top: CARD_TOPS[i]}}>
							<InfoCard icon={c.icon} title={c.title} text={c.text} law={c.law} color={[ACCENT.info, ACCENT.signal, ACCENT.law][i]} at={cardFrames[i]} />
						</div>
					))}
					<div style={{position: 'absolute', left: PHONE.left, top: PHONE.top + (1 - phoneIn) * 1000, rotate: `${(1 - phoneIn) * 8 + 3}deg`, filter: 'drop-shadow(0 40px 60px rgba(0,0,0,0.6))'}}>
						<Phone width={PHONE.width} galleryAt={p2.from + 4} lockAt={atGallery - 4} highlight={[2, 5]} highlightAt={atEvidence} />
					</div>
				</>
			) : null}

			{/* Kernaussage */}
			{frame >= atAuto - 3 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 1004, display: 'flex', justifyContent: 'center', opacity: Math.min(1, banner * 2), scale: String(0.75 + 0.25 * banner)}}>
					<div style={{padding: '14px 30px 18px', borderRadius: 24, background: 'rgba(8,10,28,0.96)', border: `4px solid ${ACCENT.no}`, boxShadow: `0 0 50px ${withAlpha(ACCENT.no, 0.35)}, 0 30px 60px rgba(0,0,0,0.6)`, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 58, lineHeight: 1.04, color: COLORS.text}}>
						{POLICE.banner[0]}
						<br />
						<span style={{color: ACCENT.no}}>{POLICE.banner[1]}</span>
					</div>
				</div>
			) : null}

			<SourceBar text={frame >= atGallery ? POLICE.review : POLICE.source} at={atControl} />

			<Sfx name="pop" at={atControl - 4} volume={0.6} />
			<Sfx name="pop" at={atWitness - 2} volume={0.6} />
			<Sfx name="whoosh" at={p2.from - 6} volume={0.5} />
			{cardFrames.map((f, i) => (
				<Sfx key={i} name="click" at={f + 4} volume={0.7} />
			))}
			<Sfx name="blip" at={atEvidence} volume={0.6} />
			<Sfx name="softImpact" at={atAuto - 2} volume={0.7} />
			<Sfx name="click" at={atGallery - 4} volume={0.8} />
		</AbsoluteFill>
	);
};
