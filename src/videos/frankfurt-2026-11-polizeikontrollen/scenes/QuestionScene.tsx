import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {Camera} from '../../../components/camera/Camera';
import {KineticText} from '../../../components/text/KineticText';
import {clamp, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {COLORS, FONTS} from '../../../theme/tokens';
import {MOODS, NightCity} from '../../frankfurt-2026-11-20-ausblick/premium/NightCity';
import {Legibility} from '../../frankfurt-2026-11-20-ausblick/premium/Studio';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {DISCLAIMER, QUESTION} from '../content';
import {GlassCard, LegalNote, PIcon, type PIconName} from '../ui';

const OPTS: Array<{color: string; deep: string; icon: PIconName; letter: string}> = [
	{color: '#4F8BFF', deep: '#2350B8', icon: 'shield', letter: 'A'},
	{color: '#B794F6', deep: '#6A3EC0', icon: 'lock', letter: 'B'},
];

/** Szene 7 – Fazit + Kommentarfrage: Skyline, Kamera zoomt heraus, zwei Antwortkarten, Hinweis „keine Rechtsberatung“. */
export const QuestionScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const e = cue(cues, 'end1', 6);
	const atSafe = wordFrame(cues, 'Sicherheit', e.from + 40);
	const atCtrl = wordFrame(cues, 'Kontrolle', atSafe + 20);
	const atComments = wordFrame(cues, 'Kommentare', e.to - 15);
	const optAt = [atSafe - 4, atCtrl - 4];
	const hint = springIn({frame, fps, delay: atComments - 4, damping: 12, stiffness: 170});
	const progress = interpolate(frame, [0, durationInFrames], [0, 1], clamp);

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night}}>
			<Camera keyframes={[{frame: 0, zoom: 1.28, y: 140}, {frame: durationInFrames, zoom: 1.0, y: 0}]}>
				<NightCity mood={MOODS.calm} progress={progress} litRatio={0.34} />
			</Camera>
			<Legibility topStrength={0.9} subtitleBand={0.3} />
			<div style={{position: 'absolute', left: 64, top: 230, width: 866}}>
				<KineticText text={QUESTION.title} highlight={['ZEIL']} fontSize={86} delay={e.from} stagger={3} maxWidth={866} lineHeight={1.02} />
			</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 640, display: 'flex', flexDirection: 'column', gap: 24}}>
				{QUESTION.options.map((o, i) => {
					if (frame < optAt[i]) return null;
					const s = springIn({frame, fps, delay: optAt[i], damping: 12, stiffness: 160});
					const c = OPTS[i];
					return (
						<div key={o} style={{scale: String((0.6 + 0.4 * s) * (1 + Math.sin((frame - optAt[i]) / 7) * 0.01)), opacity: Math.min(1, s * 2), translate: `${(1 - s) * (i === 0 ? -120 : 120)}px 0`}}>
							<div style={{display: 'flex', alignItems: 'center', gap: 22, padding: '22px 28px', borderRadius: 30, background: `linear-gradient(160deg, ${c.color} 0%, ${c.deep} 100%)`, boxShadow: `0 6px 0 rgba(0,0,0,0.35), 0 26px 60px rgba(0,0,0,0.5), 0 0 40px ${withAlpha(c.color, 0.3)}`, border: '3px solid rgba(255,255,255,0.35)'}}>
								<div style={{width: 84, height: 84, borderRadius: 24, background: '#0B1029', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 46, color: c.color}}>{c.letter}</div>
								<span style={{flex: 1, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 58, color: '#FFFFFF'}}>{o}</span>
								<PIcon name={c.icon} size={62} color="#FFFFFF" stroke={2.4} />
							</div>
						</div>
					);
				})}
			</div>
			{frame >= atComments - 4 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 1000, display: 'flex', justifyContent: 'center', scale: String(0.7 + 0.3 * hint), opacity: Math.min(1, hint * 2)}}>
					<GlassCard padding="16px 28px" style={{borderRadius: 999}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
							<PIcon name="chat" size={44} color={COLORS.signal} stroke={2.4} />
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, color: COLORS.text}}>{QUESTION.hint}</span>
						</div>
					</GlassCard>
				</div>
			) : null}
			<LegalNote text={DISCLAIMER} at={e.from + 10} top={1150} />

			<Sfx name="pop" at={optAt[0]} />
			<Sfx name="pop" at={optAt[1]} />
			<Sfx name="notify" at={atComments - 4} />
		</AbsoluteFill>
	);
};
