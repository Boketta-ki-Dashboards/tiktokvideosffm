import React from 'react';
import {AbsoluteFill} from 'remotion';
import {linearTiming, springTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {CitySkyline} from '../components/backgrounds/CitySkyline';
import {GradientSky} from '../components/backgrounds/GradientSky';
import {GrainOverlay} from '../components/backgrounds/GrainOverlay';
import {Stars} from '../components/backgrounds/Stars';
import {Camera} from '../components/camera/Camera';
import {Crowd} from '../components/characters/Crowd';
import {VectorPerson} from '../components/characters/VectorPerson';
import {ProgressRing} from '../components/infographics/ProgressRing';
import {StatCard} from '../components/infographics/StatCard';
import {Timeline} from '../components/infographics/Timeline';
import {SafeArea} from '../components/layout/SafeArea';
import {PLACES} from '../components/map/places';
import {WorldMap} from '../components/map/WorldMap';
import {Flag} from '../components/media/flags/Flag';
import {HeadlineCard} from '../components/media/HeadlineCard';
import {MediaBadge} from '../components/media/MediaBadge';
import {circleReveal} from '../components/transitions/presentations';
import {Kicker} from '../components/text/Kicker';
import {KineticText} from '../components/text/KineticText';
import {LowerThird} from '../components/text/LowerThird';
import {ensureFontsLoaded} from '../theme/fonts';
import {COLORS} from '../theme/tokens';

ensureFontsLoaded();

const SCENE = 105;
export const SHOWCASE_DURATION = SCENE * 5 - 15 * 4;

const Label: React.FC<{kicker: string; title: string}> = ({kicker, title}) => (
	<div style={{display: 'flex', flexDirection: 'column', gap: 18}}>
		<Kicker text={kicker} color={COLORS.violet} />
		<KineticText text={title} fontSize={64} maxWidth={860} />
	</div>
);

const CityDemo = () => (
	<AbsoluteFill>
		<Camera keyframes={[{frame: 0, zoom: 1.1}, {frame: SCENE, zoom: 1}]}>
			<GradientSky stops={['#060A1F', '#141B4A', '#2A2366']} glowColor="#5A4BD1" glowStrength={0.4} />
			<Stars />
			<AbsoluteFill style={{top: 900}}>
				<CitySkyline width={1080} height={1020} groundY={760} seed="showcase" />
			</AbsoluteFill>
			<AbsoluteFill>
				<svg width={1080} height={1920}>
					<rect y={1660} width={1080} height={260} fill="#0A0E26" />
					<Crowd width={1080} baseY={1860} rows={3} perRow={9} personHeight={230} marchSpeed={0} signRatio={0.35} />
					<VectorPerson x={540} y={1650} height={300} palette={{skin: '#E0A982', shirt: '#FFD23F', pants: '#1F2937', hair: '#1C1917'}} cheer={1} />
				</svg>
			</AbsoluteFill>
		</Camera>
		<SafeArea>
			<Label kicker="HINTERGRÜNDE & FIGUREN" title="Prozedurale Städte, Vektorfiguren, Menschenmengen" />
		</SafeArea>
	</AbsoluteFill>
);

const InfoDemo = () => (
	<AbsoluteFill style={{backgroundColor: COLORS.navy}}>
		<SafeArea>
			<Label kicker="INFOGRAFIKEN" title="Zahlen, Anteile, Chronologien" />
			<div style={{display: 'flex', gap: 40, marginTop: 50, alignItems: 'center'}}>
				<ProgressRing value={0.62} label="Beispielwert" delay={10} />
				<Timeline
					delay={14}
					width={520}
					events={[
						{time: '15:30', label: 'Beispiel A'},
						{time: '18:20', label: 'Beispiel B', color: COLORS.cyan},
						{time: '20:00', label: 'Beispiel C', color: COLORS.alert},
					]}
				/>
			</div>
			<div style={{marginTop: 50}}>
				<StatCard value={1234} label="Beispiel-Kennzahl" attribution="Platzhalter – keine echte Zahl" delay={20} />
			</div>
		</SafeArea>
	</AbsoluteFill>
);

const MediaDemo = () => (
	<AbsoluteFill style={{backgroundColor: COLORS.night}}>
		<SafeArea>
			<Label kicker="FLAGGEN & MEDIEN" title="Flaggen, Wortmarken, Schlagzeilen-Karten" />
			<div style={{display: 'flex', flexWrap: 'wrap', gap: 18, marginTop: 40}}>
				{['DE', 'FR', 'GB', 'AU', 'KR', 'IN', 'US', 'EU', 'IT', 'NL', 'BE', 'AT', 'PL', 'UA', 'IE', 'JP', 'CH', 'XX'].map((c) => (
					<Flag key={c} code={c} width={96} />
				))}
			</div>
			<div style={{display: 'flex', gap: 12, marginTop: 34}}>
				<MediaBadge name="Medium A" />
				<MediaBadge name="Medium B" accent={COLORS.cyan} />
			</div>
			<HeadlineCard
				outlet="Beispielmedium"
				country="EU"
				date="TT.MM.JJJJ"
				headline="Platzhalter-Schlagzeile – hier steht später der belegte Wortlaut"
				translation="Übersetzung (falls fremdsprachig)"
				width={866}
				style={{marginTop: 34}}
			/>
		</SafeArea>
	</AbsoluteFill>
);

const MapDemo = () => (
	<AbsoluteFill>
		<WorldMap
			camera={[
				{frame: 0, center: PLACES.berlin, zoom: 5},
				{frame: 80, center: [40, 30], zoom: 0.9},
			]}
			arcs={[
				{id: 'ny', from: PLACES.berlin, to: PLACES.newYork, startFrame: 30, color: COLORS.cyan},
				{id: 'tk', from: PLACES.berlin, to: PLACES.tokyo, startFrame: 40, color: COLORS.signal},
				{id: 'jb', from: PLACES.berlin, to: PLACES.johannesburg, startFrame: 50, color: COLORS.alert},
			]}
			pins={[
				{id: 'b', at: PLACES.berlin, appearFrame: 2, label: 'Berlin', flag: 'DE'},
				{id: 'ny', at: PLACES.newYork, appearFrame: 58, label: 'New York', flag: 'US', labelOffset: [20, 50]},
				{id: 'tk', at: PLACES.tokyo, appearFrame: 68, label: 'Tokio', flag: 'JP', labelAlign: 'right', labelOffset: [-20, 50]},
			]}
			highlights={[{id: '276', color: COLORS.alert}]}
		/>
		<SafeArea>
			<Label kicker="WELTKARTE" title="Kamerafahrten, Länder, Verbindungen" />
		</SafeArea>
	</AbsoluteFill>
);

const TextDemo = () => (
	<AbsoluteFill style={{backgroundColor: COLORS.deep}}>
		<SafeArea style={{justifyContent: 'center'}}>
			<Label kicker="TEXT & ÜBERGÄNGE" title="Kinetische Titel, Bauchbinden, Übergänge" />
			<div style={{marginTop: 50}}>
				<LowerThird title="Ort · Stadtteil" subtitle="Zusatzzeile" delay={12} />
			</div>
		</SafeArea>
	</AbsoluteFill>
);

/** Vorschau aller Bausteine der Bibliothek (Platzhalterinhalte, keine Fakten). */
export const ComponentShowcase: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: COLORS.night}}>
		<TransitionSeries>
			<TransitionSeries.Sequence durationInFrames={SCENE}>
				<CityDemo />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition presentation={slide({direction: 'from-right'})} timing={springTiming({config: {damping: 200}, durationInFrames: 15})} />
			<TransitionSeries.Sequence durationInFrames={SCENE}>
				<InfoDemo />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition presentation={wipe({direction: 'from-left'})} timing={linearTiming({durationInFrames: 15})} />
			<TransitionSeries.Sequence durationInFrames={SCENE}>
				<MediaDemo />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition presentation={circleReveal({x: '50%', y: '40%'})} timing={linearTiming({durationInFrames: 15})} />
			<TransitionSeries.Sequence durationInFrames={SCENE}>
				<MapDemo />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
			<TransitionSeries.Sequence durationInFrames={SCENE}>
				<TextDemo />
			</TransitionSeries.Sequence>
		</TransitionSeries>
		<GrainOverlay />
	</AbsoluteFill>
);
