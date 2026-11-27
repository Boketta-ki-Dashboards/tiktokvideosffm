import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {clamp, EASE_OUT, springIn} from '../../../lib/animation';
import {COLORS, FONTS} from '../../../theme/tokens';
import {InfoCard, SourceBar} from '../../../formats/frankfurt-erklaert/components';
import {ACCENT} from '../../../formats/frankfurt-erklaert/theme';
import {MOODS, NightCity} from '../../frankfurt-2026-11-20-ausblick/premium/NightCity';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {DISCLAIMER, FAZIT, STAND} from '../content';

/** Szene 6 – Fazit: Skyline zieht zurück, drei Verhaltens-Icons im Takt der Stimme, „DEINE RECHTE KENNEN.“ */
export const FazitScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const f = cue(cues, 'fazit', 4);
	const at = [wordFrame(cues, 'ruhig', f.from + 34), wordFrame(cues, 'Abstand', f.from + 60), wordFrame(cues, 'sachlich', f.from + 122)];
	const atEnd = wordFrame(cues, 'Kontrollgrund', f.from + 146);
	const pull = interpolate(frame, [0, durationInFrames], [0, 1], {...clamp, easing: EASE_OUT});
	const title = springIn({frame, fps, delay: f.from - 2, damping: 14, stiffness: 170});
	const claim = springIn({frame, fps, delay: atEnd - 4, damping: 12, stiffness: 180});
	const underline = interpolate(frame, [atEnd + 4, atEnd + 18], [0, 1], {...clamp, easing: EASE_OUT});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{scale: String(1.3 - pull * 0.3), transformOrigin: '50% 70%'}}>
				<NightCity mood={MOODS.calm} progress={pull} litRatio={0.42} showMoon bokeh={16} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(4,6,20,0.92) 0%, rgba(4,6,20,0.6) 40%, rgba(4,6,20,0.25) 70%, rgba(4,6,20,0.5) 100%)'}} />

			<div style={{position: 'absolute', left: 64, top: 290, opacity: Math.min(1, title * 2), translate: `${(1 - title) * -40}px 0`, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 84, letterSpacing: 4, color: COLORS.text, textShadow: '0 10px 40px rgba(0,0,0,0.7)'}}>
				{FAZIT.title}
			</div>
			{FAZIT.items.map((it, i) => (
				<div key={it.title} style={{position: 'absolute', left: 64, width: 866, top: 420 + i * 184}}>
					<InfoCard icon={it.icon} title={it.title} text={it.text} color={[ACCENT.yes, ACCENT.signal, ACCENT.info][i]} at={at[i] - 3} />
				</div>
			))}
			{frame >= atEnd - 5 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 990, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: Math.min(1, claim * 2), scale: String(0.8 + 0.2 * claim)}}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 72, lineHeight: 1, color: COLORS.text, textShadow: '0 10px 40px rgba(0,0,0,0.75)'}}>{FAZIT.claim}</div>
					<div style={{marginTop: 14, height: 10, width: 640, borderRadius: 5, background: ACCENT.brand, scale: `${underline} 1`, transformOrigin: '0% 50%'}} />
				</div>
			) : null}
			<SourceBar text={`${DISCLAIMER} · ${STAND}`} at={f.from} />

			{at.map((a, i) => (
				<Sfx key={i} name="pop" at={a - 3} volume={0.6} />
			))}
			<Sfx name="softImpact" at={atEnd - 4} volume={0.6} />
		</AbsoluteFill>
	);
};
