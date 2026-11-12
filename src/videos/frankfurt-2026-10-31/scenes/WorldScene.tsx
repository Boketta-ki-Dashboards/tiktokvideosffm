import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {SafeArea} from '../../../components/layout/SafeArea';
import {PLACES} from '../../../components/map/places';
import {type MapArc, type MapCameraKeyframe, type MapPin, WorldMap} from '../../../components/map/WorldMap';
import {Kicker} from '../../../components/text/Kicker';
import {KineticText} from '../../../components/text/KineticText';
import {clamp} from '../../../lib/animation';
import {COLORS} from '../../../theme/tokens';
import {COVERAGE} from '../content';
import {cue, type SceneProps} from '../cues';
import {COUNTRY_IDS} from '../../../components/map/places';

/** Szene 4: Weltkarte – von Frankfurt aus spannen sich Verbindungen zu den berichtenden Medien. */
export const WorldScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const m1 = cue(cues, 'media1', 10);
	const m2 = cue(cues, 'media2', m1.to + 4);

	const {camera, arcs, pins, highlights} = useMemo(() => {
		const europe = COVERAGE.filter((c) => c.segment === 'media1');
		const world = COVERAGE.filter((c) => c.segment === 'media2');
		const arcStart = (i: number, base: number, step: number) => base + i * step;

		const cam: MapCameraKeyframe[] = [
			{frame: 0, center: [6, 50.5], zoom: 9},
			{frame: Math.max(8, m1.from + 4), center: [4.5, 50.2], zoom: 6.2},
			{frame: Math.max(20, m2.from - 2), center: [4.5, 50.2], zoom: 5.6},
			{frame: Math.max(40, m2.from + 34), center: [69.6, -7.8], zoom: 0.9},
			{frame: durationInFrames, center: [69.6, -7.8], zoom: 0.86},
		];

		const a: MapArc[] = [
			...europe.map((c, i) => ({
				id: c.id,
				from: PLACES.frankfurt,
				to: c.at,
				startFrame: arcStart(i, m1.from + 6, 9),
				durationInFrames: 20,
				color: COLORS.cyan,
				lift: 0.35,
			})),
			...world.map((c, i) => ({
				id: c.id,
				from: PLACES.frankfurt,
				to: c.at,
				startFrame: arcStart(i, m2.from + 14, 8),
				durationInFrames: 26,
				color: COLORS.signal,
				lift: 0.22,
			})),
		];

		const arrival = (id: string) => {
			const arc = a.find((x) => x.id === id);
			return arc ? arc.startFrame + (arc.durationInFrames ?? 30) - 2 : 0;
		};

		const p: MapPin[] = [
			{
				id: 'ffm',
				at: PLACES.frankfurt,
				appearFrame: 2,
				label: 'Frankfurt',
				flag: 'DE',
				labelOffset: [26, 52],
				labelAlign: 'left',
				color: COLORS.alert,
				size: 11,
			},
			...COVERAGE.map((c) => ({
				id: c.id,
				at: c.at,
				appearFrame: arrival(c.id),
				label: c.countryName,
				sublabel: c.outlet,
				flag: c.country,
				labelOffset: c.labelOffset,
				labelAlign: c.labelAlign,
				color: c.segment === 'media1' ? COLORS.cyan : COLORS.signal,
				// Europa-Labels beim Herauszoomen ausblenden (sonst überlappen sie Frankfurt)
				hideLabelFrom: c.segment === 'media1' ? Math.max(30, m2.from - 8) : undefined,
			})),
		];

		const h = [
			{id: COUNTRY_IDS.germany, color: COLORS.alert, fromFrame: 0, opacity: 0.85},
			...COVERAGE.map((c) => ({
				id: c.countryId,
				color: c.segment === 'media1' ? COLORS.cyan : COLORS.signal,
				fromFrame: arrival(c.id),
				opacity: 0.55,
			})),
		];

		return {camera: cam, arcs: a, pins: p, highlights: h};
	}, [m1.from, m2.from, durationInFrames]);

	const titleOpacity = interpolate(frame, [0, 10], [0, 1], clamp);

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.ocean}}>
			<WorldMap camera={camera} arcs={arcs} pins={pins} highlights={highlights} />
			<AbsoluteFill style={{background: 'linear-gradient(rgba(7,11,26,0.92) 0%, rgba(7,11,26,0.5) 20%, rgba(7,11,26,0) 30%)'}} />
			<SafeArea>
				<div style={{display: 'flex', flexDirection: 'column', gap: 20, opacity: titleOpacity, marginTop: 10}}>
					<Kicker text="WELTWEIT" color={COLORS.cyan} delay={2} />
					<KineticText text="Frankfurt in den Schlagzeilen" highlight={['Schlagzeilen']} delay={4} stagger={3} fontSize={74} maxWidth={860} />
				</div>
			</SafeArea>
		</AbsoluteFill>
	);
};
