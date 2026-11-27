import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {EmergencyLights} from '../../../components/backgrounds/EmergencyLights';
import {type CityMapData, CityStreetMap} from '../../../components/map/CityStreetMap';
import {SafeArea} from '../../../components/layout/SafeArea';
import {SourceCredit} from '../../../components/media/SourceCredit';
import {Kicker} from '../../../components/text/Kicker';
import {clamp, EASE_OUT} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {COLORS, FONTS, RADII} from '../../../theme/tokens';
import innenstadt from '../../../data/maps/frankfurt-innenstadt.json';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {NIGHT} from '../content';
import {increasing, PopIn} from '../ui';

const MAP = innenstadt as unknown as CityMapData;

/** Uhr-/Datumsanzeige, springt zu belegten Zeitpunkten. */
const Clock: React.FC<{steps: Array<{frame: number; label: string; note: string}>}> = ({steps}) => {
	const frame = useCurrentFrame();
	const current = [...steps].reverse().find((s) => frame >= s.frame) ?? steps[0];
	const flip = interpolate(frame - current.frame, [0, 6], [0, 1], {...clamp, easing: EASE_OUT});
	return (
		<div
			style={{
				display: 'inline-flex',
				alignSelf: 'flex-start',
				flexDirection: 'column',
				padding: '12px 22px',
				borderRadius: RADII.md,
				background: 'rgba(7, 10, 28, 0.9)',
				border: `2px solid ${withAlpha(COLORS.signal, 0.6)}`,
			}}
		>
			<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 60, color: COLORS.signal, fontVariantNumeric: 'tabular-nums', opacity: flip, translate: `0 ${(1 - flip) * -14}px`}}>
				{current.label}
			</span>
			<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 25, color: COLORS.textMuted, maxWidth: 780}}>{current.note}</span>
		</div>
	);
};

/**
 * Szene 2: Was geschah (kurz) – kleine Übersichtskarte (Hauptwache, Zeil, Konstablerwache),
 * keine Chronologie, nur Demo → Abend; Unterscheidung der Gruppen laut Polizei.
 */
export const NightScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const e1 = cue(cues, 'ev1', 6);
	const e2 = cue(cues, 'ev2b', e1.to + 6);
	const atPeaceful = wordFrame(cues, 'friedlich', e1.to - 20);
	const atEsc = wordFrame(cues, 'eskaliert', e2.from + 8);
	const atZeil = wordFrame(cues, 'Zeil', e2.from + Math.round((e2.to - e2.from) * 0.8));
	const p = NIGHT.places;
	const [c0, c1] = NIGHT.clock;
	const steps = [
		{frame: 0, label: c0.label, note: c0.note},
		{frame: atEsc, label: c1.label, note: c1.note},
	];

	const camera = increasing([
		{frame: 0, center: p.center, zoom: 0.62},
		{frame: e2.from, center: p.center, zoom: 0.7},
		{frame: atZeil + 10, center: p.zeil, zoom: 0.95},
		{frame: durationInFrames, center: p.center, zoom: 0.8},
	]);
	const calm = 0;
	// Gruppen: friedliche Demo zuerst, dann (mit „eskaliert“) spätere Krawalle + Halloween
	const groupAt = [atPeaceful, atEsc + 2, atEsc + 10];
	const groupsAt = atPeaceful;

	return (
		<AbsoluteFill>
			<CityStreetMap
				map={MAP}
				camera={camera}
				anchor={[540, 820]}
				highlights={[{name: 'Zeil', color: withAlpha(COLORS.alert, 0.7), fromFrame: atZeil, width: 14, sweepFrames: 24}]}
				glows={[
					{at: p.hauptwache, radiusMeters: 70, color: COLORS.alert, fromFrame: atZeil + 4},
					{at: p.konstablerwache, radiusMeters: 70, color: COLORS.alert, fromFrame: atZeil + 10},
				]}
				streetLabels={[
					{text: 'Zeil', at: [50.11455, 8.6845], rotate: -2, size: 32},
					{text: 'Hauptwache', at: [50.1132, 8.6788], size: 26},
					{text: 'Konstablerwache', at: [50.1153, 8.6875], size: 26},
				]}
			/>
			<EmergencyLights intensity={0.32 * (1 - calm * 0.8)} y={0.45} />
			<AbsoluteFill style={{background: 'linear-gradient(rgba(7,11,26,0.94) 0%, rgba(7,11,26,0.4) 24%, rgba(7,11,26,0) 36%)'}} />

			<SafeArea>
				<div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
					<Kicker text={NIGHT.kicker} color={COLORS.alert} live delay={0} />
					<Clock steps={steps} />
				</div>
			</SafeArea>

			{/* Gruppen laut Polizei + Halloween */}
			<div style={{position: 'absolute', left: 64, width: 866, top: 990, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12}}>
				{NIGHT.groups.map((g, i) => (
					<PopIn key={g.id} delay={groupAt[i] ?? groupsAt} from={i % 2 === 0 ? 'left' : 'right'}>
						<div
							style={{
								padding: '12px 16px',
								borderRadius: RADII.md,
								background: 'rgba(7, 10, 28, 0.9)',
								border: `2px solid ${withAlpha(g.color, 0.8)}`,
								display: 'flex',
								flexDirection: 'column',
								gap: 2,
							}}
						>
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, color: g.color}}>{g.title}</span>
							<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 25, color: COLORS.text, lineHeight: 1.15}}>{g.text}</span>
						</div>
					</PopIn>
				))}
			</div>
			<div style={{position: 'absolute', left: 64, top: 1218, opacity: interpolate(frame, [groupsAt + 20, groupsAt + 32], [0, 1], clamp)}}>
				<SourceCredit sources={NIGHT.sources} />
			</div>

			{/* Ton: Chip-Klicks, Blaulicht-Akzent an der Zeil */}
			<Sfx name="click" at={atEsc} />
			<Sfx name="softImpact" at={atZeil + 2} volume={0.8} />
			{NIGHT.groups.map((g, i) => (
				<Sfx key={`g-${g.id}`} name="click" at={groupAt[i] ?? groupsAt} volume={0.8} />
			))}
		</AbsoluteFill>
	);
};
