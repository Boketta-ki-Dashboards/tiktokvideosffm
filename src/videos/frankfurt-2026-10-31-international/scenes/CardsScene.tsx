import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {AnimatedNumber} from '../../../components/infographics/AnimatedNumber';
import {SafeArea} from '../../../components/layout/SafeArea';
import {Flag} from '../../../components/media/flags/Flag';
import {SourceCredit} from '../../../components/media/SourceCredit';
import {type CountryHighlight, WorldMap} from '../../../components/map/WorldMap';
import {Kicker} from '../../../components/text/Kicker';
import {clamp, EASE_IN, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {COLORS, FONTS} from '../../../theme/tokens';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {countMedia, MEDIA_STAND, mediaById, type MediaEntry} from '../content';
import {COUNTRY_NUMERIC} from '../geo';
import {NewsCard, PopIn} from '../ui';
import {countryRepresentatives} from './WorldScene';

type Region = {id: string; title: string; card: string; highlight?: string; chips: string[]};

/** Regionen in fester Reihenfolge; je Region eine Schlüssel-Schlagzeile + Flaggen weiterer belegter Länder. */
const REGIONS: Region[] = [
	{id: 'europa', title: 'Europa', card: 'interia', chips: ['GB', 'FR', 'AT', 'CZ', 'BE', 'CH', 'IT', 'NL', 'AL']},
	{id: 'amerika', title: 'Amerika', card: 'excelsior', highlight: 'ahora en Alemania', chips: ['US', 'AR', 'BR']},
	{id: 'nahost', title: 'Nahost', card: 'dailysabah', chips: ['QA', 'IL', 'KW', 'SA']},
	{id: 'asien', title: 'Asien, Ozeanien & Afrika', card: 'abc', highlight: 'riots spread to Germany', chips: ['IN', 'KR', 'PK', 'NG']},
];

const RegionBlock: React.FC<{r: Region; delay: number}> = ({r, delay}) => {
	const m: MediaEntry = mediaById(r.card);
	return (
		<PopIn delay={delay} from="right">
			<div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap'}}>
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 32, color: COLORS.signal, marginRight: 6}}>{r.title.toUpperCase()}</span>
					{r.chips.map((c) => (
						<Flag key={c} code={c} width={40} rounded={4} shadow={false} />
					))}
				</div>
				<NewsCard m={m} headlineSize={29} highlight={r.highlight ? {text: r.highlight, from: delay + 14} : undefined} />
			</div>
		</PopIn>
	);
};

/** Szene 7: So berichtete die Welt – Schlagzeilen nach Regionen, danach die Zählung (Stichprobe). */
export const CardsScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const w3 = cue(cues, 'w3', 6);
	const w4 = cue(cues, 'w4', w3.to + 6);
	const half = wordFrame(cues, 'greifen', w3.from + Math.round((w3.to - w3.from) * 0.45));
	const atCount = wordFrame(cues, '26', w4.from + 14);
	const atCountries = wordFrame(cues, '24', atCount + 24);
	const atSample = wordFrame(cues, 'Stichprobe', atCountries + 30);
	const {brands, countries} = countMedia();
	const reps = countryRepresentatives();

	const firstOut = interpolate(frame, [half - 6, half + 4], [1, 0], {...clamp, easing: EASE_IN});
	const secondOut = interpolate(frame, [w4.from - 6, w4.from + 4], [1, 0], {...clamp, easing: EASE_IN});
	const counterIn = springIn({frame, fps, delay: w4.from, damping: 13});
	const numbersIn = interpolate(frame, [atCount - 8, atCount - 2], [0, 1], clamp);
	const highlights: CountryHighlight[] = reps.flatMap((m) => {
		const id = COUNTRY_NUMERIC[m.country];
		return id ? [{id, color: withAlpha(m.art === 'agentur' ? COLORS.cyan : COLORS.signal, 0.42), fromFrame: 0}] : [];
	});

	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', inset: 0, opacity: 0.55}}>
				<WorldMap
					camera={[
						{frame: 0, center: [22, 8], zoom: 0.5},
						{frame: durationInFrames, center: [14, 14], zoom: 0.56},
					]}
					highlights={[{id: '276', color: withAlpha(COLORS.alert, 0.6), fromFrame: 0}, ...highlights]}
					showGraticule={false}
				/>
			</div>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(7,11,26,0.9) 0%, rgba(7,11,26,0.55) 40%, rgba(7,11,26,0.75) 100%)'}} />

			<SafeArea>
				<Kicker text="SO BERICHTETE DIE WELT" color={COLORS.cyan} delay={0} />
			</SafeArea>

			{/* Teil 1: Europa + Amerika */}
			<div style={{position: 'absolute', left: 64, width: 866, top: 300, display: 'flex', flexDirection: 'column', gap: 26, opacity: firstOut}}>
				<RegionBlock r={REGIONS[0]} delay={w3.from - 4} />
				<RegionBlock r={REGIONS[1]} delay={w3.from + 8} />
			</div>
			{/* Teil 2: Nahost + Asien/Ozeanien/Afrika */}
			{frame >= half - 6 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 300, display: 'flex', flexDirection: 'column', gap: 26, opacity: secondOut}}>
					<RegionBlock r={REGIONS[2]} delay={half} />
					<RegionBlock r={REGIONS[3]} delay={half + 10} />
				</div>
			) : null}

			{/* Teil 3: Zählung */}
			{frame >= w4.from - 2 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: Math.min(1, counterIn * 1.5), scale: String(0.9 + 0.1 * counterIn)}}>
					<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, color: COLORS.textMuted, letterSpacing: 4}}>MINDESTENS</span>
					<div style={{display: 'flex', gap: 60, alignItems: 'flex-end', opacity: numbersIn}}>
						<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
							<AnimatedNumber value={brands} delay={atCount - 4} durationInFrames={22} style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 170, lineHeight: 1, color: COLORS.signal}} />
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 44, color: COLORS.text}}>MEDIEN</span>
						</div>
						<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
							<AnimatedNumber value={countries} delay={atCountries - 4} durationInFrames={22} style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 170, lineHeight: 1, color: COLORS.cyan}} />
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 44, color: COLORS.text}}>LÄNDER</span>
						</div>
					</div>
					<div style={{display: 'grid', gridTemplateColumns: 'repeat(6, 110px)', gap: 18, marginTop: 26}}>
						{reps.map((m, i) => (
							<PopIn key={m.country} delay={atCountries + i * 2} from="none">
								<Flag code={m.country} width={110} rounded={8} />
							</PopIn>
						))}
					</div>
					<div style={{marginTop: 22, textAlign: 'center', opacity: interpolate(frame, [atSample - 4, atSample + 6], [0, 1], clamp)}}>
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, color: COLORS.signal}}>NUR EINE STICHPROBE</div>
						<div style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 24, color: COLORS.textMuted, marginTop: 4}}>
							selbst geprüfte Berichte außerhalb Deutschlands · Stand {MEDIA_STAND.split('-').reverse().join('.')}
						</div>
					</div>
				</div>
			) : null}
			<div style={{position: 'absolute', left: 64, top: 1235, opacity: interpolate(frame, [w3.from, w3.from + 10], [0, 1], clamp)}}>
				<SourceCredit label="Hinweis" sources={['Schlagzeilen im Wortlaut · DE = eigene Übersetzung · Abruf 05.11.2026']} />
			</div>

			<Sfx name="paper" at={w3.from - 4} />
			<Sfx name="typewriter" at={w3.from + 2} volume={0.8} />
			<Sfx name="paper" at={w3.from + 8} />
			<Sfx name="paper" at={half} />
			<Sfx name="typewriter" at={half + 6} volume={0.8} />
			<Sfx name="paper" at={half + 10} />
			<Sfx name="riser" at={w4.from - 42} />
			<Sfx name="boom" at={atCount - 2} />
			<Sfx name="softImpact" at={atCountries} />
			{reps.map((m, i) => (i % 4 === 0 ? <Sfx key={`f-${m.country}`} name="pop" at={atCountries + i * 2} volume={0.6} /> : null))}
		</AbsoluteFill>
	);
};
