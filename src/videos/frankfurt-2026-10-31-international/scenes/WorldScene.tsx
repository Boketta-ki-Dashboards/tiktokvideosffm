import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {Flag} from '../../../components/media/flags/Flag';
import {HeadlineCard} from '../../../components/media/HeadlineCard';
import {type CountryHighlight, type MapArc, type MapPin, WorldMap} from '../../../components/map/WorldMap';
import {PLACES} from '../../../components/map/places';
import {SafeArea} from '../../../components/layout/SafeArea';
import {Kicker} from '../../../components/text/Kicker';
import {clamp} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {COLORS, FONTS, RADII} from '../../../theme/tokens';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {MEDIA, type MediaEntry, mediaById, WORLD} from '../content';
import {COUNTRY_NUMERIC} from '../geo';
import {increasing, PopIn} from '../ui';

const AGENCY = COLORS.cyan;
const OWN = COLORS.signal;
const colorOf = (m: MediaEntry) => (m.art === 'agentur' ? AGENCY : OWN);

/** Ein Medium pro Land (für Bögen/Pins); gezählte Länder ohne Deutschland/EU. */
export const countryRepresentatives = (): MediaEntry[] => {
	const seen = new Set<string>();
	const out: MediaEntry[] = [];
	for (const m of MEDIA) {
		if (!m.zaehlt || m.landZaehlt === false || m.country === 'DE' || seen.has(m.country)) continue;
		seen.add(m.country);
		out.push(m);
	}

	return out;
};

const ListRow: React.FC<{m: MediaEntry; delay: number}> = ({m, delay}) => (
	<PopIn delay={delay} from="left">
		<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
			<Flag code={m.country} width={42} rounded={4} shadow={false} />
			<div style={{display: 'flex', flexDirection: 'column', lineHeight: 1.05}}>
				<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 27, color: COLORS.text}}>{m.land}</span>
				<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, color: COLORS.textMuted}}>{m.outlet}</span>
			</div>
		</div>
	</PopIn>
);

/** Szene 6: Weltkarte – von Frankfurt über Europa in die Welt; Bögen zu den Ländern mit belegten Berichten. */
export const WorldScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const w1 = cue(cues, 'w1', 6);
	const w2 = cue(cues, 'w2', w1.to + 6);
	const atReuters = wordFrame(cues, 'Reuters', w1.from + 10);
	const spoken: Array<{id: string; word: string; fallback: number}> = [
		{id: 'koreatimes', word: 'Südkorea', fallback: w2.from + 30},
		{id: 'arabnews', word: 'Saudi-Arabien', fallback: w2.from + 45},
		{id: 'abc', word: 'Australien', fallback: w2.from + 60},
		{id: 'orf', word: 'Österreich', fallback: w2.from + 95},
		{id: 'interia', word: 'Polen', fallback: w2.from + 110},
		{id: 'cbs', word: 'USA', fallback: w2.from + 125},
	];
	const spokenAt = spoken.map((s) => ({...s, at: wordFrame(cues, s.word, s.fallback)}));
	// Übrige Länder zwischen „Australien“ und „Eigene Berichte“ (sonst endet die Szene vor dem letzten Bogen)
	const restFrom = spokenAt[2].at + 10;
	const reps = countryRepresentatives();
	const rest = reps.filter((m) => !spoken.some((s) => mediaById(s.id).country === m.country));
	const arcAt = new Map<string, number>([...spokenAt.map((s) => [mediaById(s.id).country, s.at] as [string, number]), ...rest.map((m, i) => [m.country, restFrom + i * 2] as [string, number])]);

	const arcs: MapArc[] = reps.map((m) => ({
		id: `arc-${m.country}`,
		from: PLACES.frankfurt,
		to: m.at,
		startFrame: (arcAt.get(m.country) ?? restFrom) - 12,
		durationInFrames: 14,
		color: colorOf(m),
		lift: 0.22,
	}));
	const pins: MapPin[] = [
		{id: 'ffm', at: PLACES.frankfurt, appearFrame: 0, color: COLORS.alert, size: 10},
		...reps.map((m) => ({id: `pin-${m.country}`, at: m.at, appearFrame: arcAt.get(m.country) ?? restFrom, color: colorOf(m), size: 7, pulse: false})),
	];
	const highlights: CountryHighlight[] = [
		{id: '276', color: withAlpha(COLORS.alert, 0.55), fromFrame: 0},
		...reps.flatMap((m) => {
			const id = COUNTRY_NUMERIC[m.country];
			return id ? [{id, color: withAlpha(colorOf(m), 0.42), fromFrame: arcAt.get(m.country) ?? restFrom}] : [];
		}),
	];

	const camera = increasing([
		{frame: 0, center: PLACES.frankfurt, zoom: 7},
		{frame: atReuters + 6, center: PLACES.frankfurt, zoom: 5.2},
		{frame: w2.from - 4, center: [10, 50] as [number, number], zoom: 2.4},
		{frame: w2.from + 22, center: [22, 8] as [number, number], zoom: 0.52},
		{frame: durationInFrames, center: [22, 8] as [number, number], zoom: 0.5},
	]);
	const reutersOut = interpolate(frame, [w2.from - 8, w2.from + 4], [1, 0], clamp);
	const listIn = interpolate(frame, [w2.from + 6, w2.from + 16], [0, 1], clamp);

	return (
		<AbsoluteFill>
			<WorldMap camera={camera} arcs={arcs} pins={pins} highlights={highlights} />
			<AbsoluteFill style={{background: 'linear-gradient(rgba(7,11,26,0.95) 0%, rgba(7,11,26,0.55) 30%, rgba(7,11,26,0) 38%)'}} />

			<SafeArea>
				<Kicker text={WORLD.kicker} color={COLORS.cyan} delay={0} live />
			</SafeArea>

			{/* Reuters noch in der Nacht */}
			<div style={{position: 'absolute', left: 64, width: 866, top: 300, opacity: reutersOut}}>
				<PopIn delay={atReuters - 4} from="top">
					<HeadlineCard
						outlet={WORLD.reuters.outlet}
						country={WORLD.reuters.country}
						countryLabel="Nachrichtenagentur"
						headline={WORLD.reuters.headline}
						translation={WORLD.reuters.de}
						date={WORLD.reuters.date}
						width={866}
					/>
				</PopIn>
			</div>

			{/* Im Ton genannte Länder: links Agentur-Übernahmen, rechts eigene Berichte */}
			<div style={{position: 'absolute', left: 64, width: 866, top: 300, opacity: listIn}}>
				<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: '16px 20px', borderRadius: RADII.md, background: 'rgba(7, 10, 28, 0.88)', border: `2px solid ${COLORS.panelBorder}`}}>
					<div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, color: AGENCY}}>● AGENTURMELDUNG</span>
						{spokenAt.slice(0, 3).map((s) => (
							<ListRow key={s.id} m={mediaById(s.id)} delay={s.at - 2} />
						))}
					</div>
					<div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, color: OWN}}>● EIGENER BERICHT</span>
						{spokenAt.slice(3).map((s) => (
							<ListRow key={s.id} m={mediaById(s.id)} delay={s.at - 2} />
						))}
					</div>
				</div>
				<div style={{marginTop: 10, fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, color: COLORS.textMuted}}>
					Linie = belegter Bericht über Frankfurt in diesem Land (Auswahl, Stand 05.11.2026)
				</div>
			</div>

			<Sfx name="typewriter" at={atReuters} />
			<Sfx name="whoosh" at={w2.from - 4} volume={0.8} />
			{spokenAt.map((s) => (
				<Sfx key={`b-${s.id}`} name="blip" at={s.at} />
			))}
			{rest.map((m, i) => (i % 4 === 0 ? <Sfx key={`r-${m.country}`} name="blip" at={restFrom + i * 2} volume={0.5} /> : null))}
		</AbsoluteFill>
	);
};
