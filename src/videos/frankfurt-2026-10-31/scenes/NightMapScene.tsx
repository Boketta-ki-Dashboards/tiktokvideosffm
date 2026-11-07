import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {EmergencyLights} from '../../../components/backgrounds/EmergencyLights';
import {type CityMapData, type CityMarker, CityStreetMap} from '../../../components/map/CityStreetMap';
import {SafeArea} from '../../../components/layout/SafeArea';
import {SourceCredit} from '../../../components/media/SourceCredit';
import {Kicker} from '../../../components/text/Kicker';
import {clamp, EASE_OUT} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {COLORS, FONTS, RADII} from '../../../theme/tokens';
import innenstadt from '../../../data/maps/frankfurt-innenstadt.json';
import {NIGHT_EVENTS, NIGHT_MAP, type NightEvent} from '../content';
import {cue, type SceneProps} from '../cues';

const MAP = innenstadt as unknown as CityMapData;
const EVENT_COLORS = [COLORS.alert, '#FF8A3D', '#FF5FA2', '#FFB020', '#C77DFF'];

/** Legende der Übersicht: Nummer, Uhrzeit, Ort, Art – in zeitlicher Reihenfolge. */
const Legend: React.FC<{from: number}> = ({from}) => {
	const frame = useCurrentFrame();
	return (
		<div
			style={{
				padding: '16px 20px',
				borderRadius: RADII.md,
				background: 'rgba(7, 10, 28, 0.9)',
				border: `2px solid ${COLORS.panelBorder}`,
				display: 'flex',
				flexDirection: 'column',
				gap: 8,
			}}
		>
			{NIGHT_EVENTS.map((e, i) => {
				const p = interpolate(frame, [from + i * 4, from + i * 4 + 10], [0, 1], {...clamp, easing: EASE_OUT});
				return (
					<div key={e.id} style={{display: 'flex', alignItems: 'center', gap: 14, opacity: p, translate: `${(1 - p) * 30}px 0`}}>
						<div
							style={{
								width: 34,
								height: 34,
								borderRadius: 17,
								background: EVENT_COLORS[i % EVENT_COLORS.length],
								border: '3px solid #fff',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontFamily: FONTS.heading,
								fontWeight: 900,
								fontSize: 18,
								color: '#fff',
								flexShrink: 0,
							}}
						>
							{i + 1}
						</div>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 25, color: COLORS.signal, minWidth: 92}}>
							{e.time === 'kurz vor 23 Uhr' ? '~23 Uhr' : e.time}
						</span>
						<span style={{fontFamily: FONTS.body, fontWeight: 800, fontSize: 25, color: COLORS.text}}>{e.title}</span>
						<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 21, color: COLORS.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
							{e.status.split(' · ')[0]}
						</span>
					</div>
				);
			})}
		</div>
	);
};

const ICONS: Record<NightEvent['icon'], (c: string) => React.ReactNode> = {
	shoe: (c) => (
		<svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2.2} strokeLinejoin="round">
			<path d="M2 16v-5l5-1 3 3 4 1 6 1a2 2 0 0 1 2 2v1H2z" />
			<path d="M2 19h20" />
		</svg>
	),
	perfume: (c) => (
		<svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2.2} strokeLinejoin="round">
			<rect x={6} y={9} width={12} height={12} rx={3} />
			<path d="M10 9V6h4v3M12 6V3" />
		</svg>
	),
	shield: (c) => (
		<svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2.2} strokeLinejoin="round">
			<path d="M12 2l8 3v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5z" />
			<path d="M12 8v5M12 16v.5" strokeLinecap="round" />
		</svg>
	),
	run: (c) => (
		<svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
			<circle cx={14} cy={4} r={2} />
			<path d="M8 21l3-6 3 2v5M6 12l3-3 4 1 3 3 3 1M11 15l-2-4" />
		</svg>
	),
};

/** Uhr-Anzeige: springt zu belegten Zeitpunkten (keine erfundene Minutengenauigkeit). */
const NightClock: React.FC<{steps: Array<{frame: number; label: string; note: string}>}> = ({steps}) => {
	const frame = useCurrentFrame();
	const current = [...steps].reverse().find((s) => frame >= s.frame) ?? steps[0];
	const since = frame - current.frame;
	const flip = interpolate(since, [0, 6], [0, 1], {...clamp, easing: EASE_OUT});
	return (
		<div
			style={{
				display: 'inline-flex',
				alignSelf: 'flex-start',
				flexDirection: 'column',
				alignItems: 'flex-start',
				padding: '12px 22px',
				borderRadius: RADII.md,
				background: 'rgba(7, 10, 28, 0.88)',
				border: `2px solid ${withAlpha(COLORS.signal, 0.6)}`,
			}}
		>
			<span
				style={{
					fontFamily: FONTS.heading,
					fontWeight: 900,
					fontSize: 54,
					color: COLORS.signal,
					fontVariantNumeric: 'tabular-nums',
					opacity: flip,
					translate: `0 ${(1 - flip) * -14}px`,
				}}
			>
				{current.label}
			</span>
			<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 21, color: COLORS.textMuted}}>{current.note}</span>
		</div>
	);
};

/**
 * Szene: Stadtplan der Innenstadt bei Nacht – Kamera fährt die gemeldeten Brennpunkte in
 * zeitlicher Reihenfolge ab, danach Übersicht mit Abfolge-Linie.
 */
export const NightMapScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const esc = cue(cues, 'escalation', 6);
	const s1 = cue(cues, 'shop1', esc.to + 6);
	const s2 = cue(cues, 'shop2', s1.to + 6);
	const s3 = cue(cues, 'shop3', s2.to + 6);
	const s4 = cue(cues, 'shop4', s3.to + 6);
	const segFrom = {shop1: s1.from, shop2: s2.from, shop3: s3.from, shop4: s4.from};
	const p = NIGHT_MAP.places;
	const overviewAt = Math.min(durationInFrames - 50, s4.to + 4);
	const nextSegFrom: Record<NightEvent['segment'], number> = {shop1: s2.from - 4, shop2: s3.from - 4, shop3: s4.from - 4, shop4: overviewAt};

	const markers: CityMarker[] = NIGHT_EVENTS.map((e, i) => {
		const sameSeg = NIGHT_EVENTS.filter((x) => x.segment === e.segment);
		const idx = sameSeg.indexOf(e);
		const color = EVENT_COLORS[i % EVENT_COLORS.length];
		return {
			id: e.id,
			at: e.at,
			appearFrame: segFrom[e.segment] + 6 + idx * 16,
			title: e.title,
			status: e.status,
			time: `${e.time} · ${e.timeKind}`,
			color,
			icon: ICONS[e.icon](color),
			labelOffset: e.labelOffset,
			labelAlign: e.labelAlign,
			// Karte einklappen, sobald der nächste Ort kommt → keine Überlappungen
			hideCardFrom: nextSegFrom[e.segment],
			badge: String(i + 1),
		};
	});

	const clockSteps = [
		{frame: 0, label: '21:00', note: 'Samstagabend, 31.10.'},
		{frame: s1.from + 4, label: '21:41', note: 'Meldung hessenschau-Liveticker'},
		{frame: s2.from - 4, label: '22:03', note: 'Polizei räumt die Zeil'},
		{frame: s2.from + 22, label: '22:37', note: 'Meldung hessenschau-Liveticker'},
		{frame: s3.from + 4, label: 'kurz vor 23 Uhr', note: 'Alarm laut Inhaber'},
		{frame: s4.from + 4, label: '23:27', note: 'Polizei: Verlagerung zum Eschenheimer Tor'},
		{frame: s4.from + Math.round((s4.to - s4.from) * 0.55), label: '00:47', note: 'Meldung hessenschau-Liveticker'},
	];

	// Kamera: fährt zügig zum Ort, verweilt, schwenkt erst kurz vor dem nächsten Satz weiter
	const spot = {
		shop1: [50.11415, 8.683] as [number, number],
		shop2a: [50.1133, 8.6815] as [number, number],
		shop2: [50.11245, 8.6821] as [number, number],
		shop3: [50.1158, 8.685] as [number, number],
		shop4: [50.1166, 8.68] as [number, number],
		overview: [50.11285, 8.6830] as [number, number],
	};
	const camera = [
		{frame: 0, center: p.center, zoom: 0.62},
		{frame: Math.max(10, s1.from - 10), center: p.center, zoom: 0.72},
		{frame: s1.from + 8, center: spot.shop1, zoom: 1.45},
		{frame: s2.from - 6, center: spot.shop1, zoom: 1.45},
		{frame: s2.from + 6, center: spot.shop2a, zoom: 1.05},
		{frame: s2.from + 24, center: spot.shop2, zoom: 1.5},
		{frame: s3.from - 6, center: spot.shop2, zoom: 1.5},
		{frame: s3.from + 8, center: spot.shop3, zoom: 1.45},
		{frame: s4.from - 6, center: spot.shop3, zoom: 1.45},
		{frame: s4.from + 10, center: spot.shop4, zoom: 1.4},
		{frame: overviewAt, center: spot.shop4, zoom: 1.4},
		{frame: overviewAt + 20, center: spot.overview, zoom: 0.86},
		{frame: durationInFrames, center: spot.overview, zoom: 0.82},
	];

	const footIn = interpolate(frame, [overviewAt + 10, overviewAt + 24], [0, 1], clamp);
	const titleIn = interpolate(frame, [0, 12], [0, 1], clamp);

	return (
		<AbsoluteFill>
			<CityStreetMap
				map={MAP}
				camera={camera}
				anchor={[540, 860]}
				markers={markers}
				highlights={[
					{name: 'Zeil', color: withAlpha(COLORS.signal, 0.55), fromFrame: 8, width: 12, fadeOutFrame: s2.from - 8},
					{name: 'Zeil', color: '#2B6BFF', fromFrame: s2.from - 6, width: 16, sweepFrames: 22, fadeOutFrame: s2.from + 40},
				]}
				glows={[{at: NIGHT_MAP.hotspot.at, radiusMeters: 90, color: COLORS.alert, fromFrame: s4.from + 2}]}
				sequence={{ids: NIGHT_EVENTS.map((e) => e.id), fromFrame: overviewAt + 4, durationInFrames: 36, color: COLORS.signal}}
				streetLabels={[
					{text: 'Zeil', at: [50.11455, 8.6845], rotate: -2, size: 30},
					{text: 'Hauptwache', at: [50.1132, 8.6788], size: 22},
					{text: 'Konstablerwache', at: [50.1153, 8.6875], size: 22},
					{text: 'Eschenheimer Tor', at: [50.1180, 8.6797], size: 22},
					{text: 'Berliner Str.', at: [50.1113, 8.6808], rotate: -14, size: 20},
				]}
			/>
			<EmergencyLights intensity={0.28} y={0.5} />
			<AbsoluteFill style={{background: 'linear-gradient(rgba(7,11,26,0.92) 0%, rgba(7,11,26,0.35) 22%, rgba(7,11,26,0) 34%)'}} />

			<SafeArea>
				<div style={{display: 'flex', flexDirection: 'column', gap: 16, opacity: titleIn}}>
					<Kicker text={NIGHT_MAP.kicker} color={COLORS.alert} delay={0} live />
					<NightClock steps={clockSteps} />
				</div>
			</SafeArea>

			<div
				style={{
					position: 'absolute',
					left: 64,
					right: 150,
					top: 1010,
					display: 'flex',
					flexDirection: 'column',
					gap: 8,
					opacity: footIn,
				}}
			>
				<Legend from={overviewAt + 8} />
				<div
					style={{
						padding: '14px 18px',
						borderRadius: RADII.md,
						background: 'rgba(7, 10, 28, 0.88)',
						fontFamily: FONTS.body,
						fontWeight: 600,
						fontSize: 21,
						lineHeight: 1.28,
						color: COLORS.textMuted,
					}}
				>
					{NIGHT_MAP.footnote}
				</div>
				<SourceCredit sources={NIGHT_MAP.sources} delay={overviewAt + 14} />
			</div>
		</AbsoluteFill>
	);
};
