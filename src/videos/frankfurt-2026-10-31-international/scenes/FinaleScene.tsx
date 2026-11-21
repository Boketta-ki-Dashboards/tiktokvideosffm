import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {Clouds} from '../../../components/backgrounds/Clouds';
import {FrankfurtSkyline} from '../../../components/backgrounds/FrankfurtSkyline';
import {GradientSky} from '../../../components/backgrounds/GradientSky';
import {Stars} from '../../../components/backgrounds/Stars';
import {Camera} from '../../../components/camera/Camera';
import {SafeArea} from '../../../components/layout/SafeArea';
import {type MapArc, type MapPin, WorldMap} from '../../../components/map/WorldMap';
import {PLACES} from '../../../components/map/places';
import {Kicker} from '../../../components/text/Kicker';
import {clamp, EASE_IN_OUT} from '../../../lib/animation';
import {COLORS, FONTS} from '../../../theme/tokens';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {SUMMARY} from '../content';
import {increasing, PopIn} from '../ui';
import {countryRepresentatives} from './WorldScene';

/** Szene 8: Fazit – die Welt zoomt zurück auf Frankfurt, dann die Skyline; drei Bausteine → Weltnachricht. */
export const FinaleScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const e = cue(cues, 'end1', 8);
	const atRiots = wordFrame(cues, 'Ausschreitungen', e.from + 10);
	const atImages = wordFrame(cues, 'Bilder', atRiots + 24);
	const atMemes = wordFrame(cues, 'Memes', atImages + 20);
	const atNews = wordFrame(cues, 'Nachricht', atMemes + 20);
	const zoomEnd = Math.max(atNews - 10, Math.round(durationInFrames * 0.5));
	const reps = countryRepresentatives();
	const arcs: MapArc[] = reps.map((m) => ({id: `fa-${m.country}`, from: m.at, to: PLACES.frankfurt, startFrame: -40, durationInFrames: 10, color: m.art === 'agentur' ? COLORS.cyan : COLORS.signal, lift: 0.22}));
	const pins: MapPin[] = [{id: 'ffm', at: PLACES.frankfurt, appearFrame: -20, color: COLORS.alert, size: 12}];
	const skyline = interpolate(frame, [zoomEnd - 14, zoomEnd + 8], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const camera = increasing([
		{frame: 0, center: [22, 8] as [number, number], zoom: 0.5},
		{frame: zoomEnd, center: PLACES.frankfurt, zoom: 9},
	]);
	const words = [
		{text: SUMMARY.words[0], at: atRiots, color: COLORS.alert},
		{text: SUMMARY.words[1], at: atImages, color: COLORS.violet},
		{text: SUMMARY.words[2], at: atMemes, color: COLORS.signal},
	];

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night}}>
			<div style={{position: 'absolute', inset: 0, opacity: 1 - skyline}}>
				<WorldMap camera={camera} arcs={arcs} pins={pins} highlights={[{id: '276', color: COLORS.alert, fromFrame: -10, opacity: 0.7}]} />
			</div>
			<div style={{position: 'absolute', inset: 0, opacity: skyline}}>
				<Camera keyframes={[{frame: zoomEnd - 14, zoom: 1.5, y: -80}, {frame: durationInFrames, zoom: 1.0, y: 0}]}>
					<GradientSky stops={['#050920', '#121446', '#331B52', '#6E2A52']} glowY={0.72} glowColor="#C2454F" glowStrength={0.45} />
					<Stars count={90} maxY={0.4} opacity={0.6} />
					<Clouds count={5} opacity={0.07} band={[0.1, 0.36]} speed={0.5} />
					<AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center'}}>
						<FrankfurtSkyline width={1560} litRatio={0.3} style={{marginBottom: -40}} />
					</AbsoluteFill>
				</Camera>
			</div>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(6,9,26,0.9) 0%, rgba(6,9,26,0.4) 45%, rgba(6,9,26,0) 68%)'}} />

			<SafeArea>
				<Kicker text="FAZIT" color={COLORS.signal} delay={0} />
				<div style={{marginTop: 30, display: 'flex', flexDirection: 'column', gap: 14}}>
					{words.map((w) => (
						<PopIn key={w.text} delay={w.at} from="left">
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 66, color: w.color, lineHeight: 1, textShadow: '0 6px 24px rgba(0,0,0,0.7)'}}>+ {w.text}</span>
						</PopIn>
					))}
					<PopIn delay={atNews} from="bottom">
						<div style={{marginTop: 18, display: 'inline-flex', padding: '14px 30px', borderRadius: 999, background: COLORS.signal, border: '4px solid #0B1029'}}>
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 64, color: '#0B1029', letterSpacing: 2}}>= {SUMMARY.result}</span>
						</div>
					</PopIn>
				</div>
			</SafeArea>

			<Sfx name="whoosh" at={2} volume={0.9} />
			{words.map((w) => (
				<Sfx key={`w-${w.text}`} name="click" at={w.at} />
			))}
			<Sfx name="softImpact" at={atNews} />
		</AbsoluteFill>
	);
};
