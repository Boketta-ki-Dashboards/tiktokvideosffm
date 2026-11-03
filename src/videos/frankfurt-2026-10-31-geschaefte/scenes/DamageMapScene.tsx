import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {type CityCameraKeyframe, type CityMapData, CityStreetMap, type LatLon, useCityCamera} from '../../../components/map/CityStreetMap';
import {type DamagePin, DamagePins} from '../../../components/map/DamagePins';
import {AnimatedNumber} from '../../../components/infographics/AnimatedNumber';
import {SafeArea} from '../../../components/layout/SafeArea';
import {ShopCard, STATUS_STYLE} from '../../../components/media/ShopCard';
import {SourceCredit} from '../../../components/media/SourceCredit';
import {Kicker} from '../../../components/text/Kicker';
import {clamp, EASE_OUT, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {COLORS, FONTS, RADII} from '../../../theme/tokens';
import innenstadt from '../../../data/maps/frankfurt-innenstadt.json';
import {cue, type SceneProps} from '../../frankfurt-2026-10-31/cues';
import {evidenceLine, KNOWN_LOSSES, RESEARCH_STATS, SHOP_DATA, SHOPS, shopById, TOUR} from '../shops';

const MAP = innenstadt as unknown as CityMapData;
const ANCHOR: [number, number] = [540, 600];
const OVERVIEW_CENTER: LatLon = [50.11425, 8.68245];

const STREETS = [
	'Zeil',
	'Hasengasse',
	'Berliner Straße',
	'Liebfrauenberg',
	'Große Friedberger Straße',
	'Große Eschenheimer Straße',
	'Fahrgasse',
	'Kurt-Schumacher-Straße',
	'Stiftstraße',
	'Schillerstraße',
	'Töngesgasse',
	'Holzgraben',
	'Bleidenstraße',
	'Brönnerstraße',
	'Schäfergasse',
	'Börsenstraße',
	'Steinweg',
	'Neue Kräme',
	'Domstraße',
	'Braubachstraße',
	'Bleichstraße',
	'Große Bockenheimer Straße',
	'Biebergasse',
];

const AREAS: Array<{label: string; at: LatLon}> = [
	{label: 'Zeil / Hasengasse', at: [50.11405, 8.6836]},
	{label: 'Berliner Straße', at: [50.11205, 8.68345]},
	{label: 'Eschenheimer Tor', at: [50.11625, 8.6797]},
];

const Legend: React.FC<{opacity: number}> = ({opacity}) => (
	<div
		style={{
			display: 'flex',
			gap: 16,
			padding: '10px 16px',
			borderRadius: RADII.md,
			background: 'rgba(7,10,28,0.88)',
			opacity,
			alignSelf: 'flex-start',
		}}
	>
		{(['gepluendert', 'beschaedigt', 'ungeklaert'] as const).map((s) => (
			<div key={s} style={{display: 'flex', alignItems: 'center', gap: 8}}>
				<div style={{width: 18, height: 18, borderRadius: 9, background: STATUS_STYLE[s].color, border: '3px solid #fff'}} />
				<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 21, color: COLORS.text}}>
					{s === 'gepluendert' ? 'Diebstahl belegt' : s === 'beschaedigt' ? 'Sachschaden' : 'ungeklärt'}
				</span>
			</div>
		))}
	</div>
);

/** Schadenssumme: nur belegte Angaben – keine erfundenen Beträge. */
const DamagePanel: React.FC<{from: number; to: number}> = ({from, to}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = springIn({frame, fps, delay: from, damping: 16});
	const out = interpolate(frame, [to - 8, to], [1, 0], clamp);
	return (
		<div
			style={{
				position: 'absolute',
				top: 300,
				left: 64,
				right: 150,
				padding: '28px 30px',
				borderRadius: RADII.lg,
				background: 'linear-gradient(160deg, rgba(26,32,72,0.97), rgba(9,13,34,0.97))',
				border: `2px solid ${COLORS.panelBorder}`,
				display: 'flex',
				flexDirection: 'column',
				gap: 16,
				opacity: Math.min(1, s * 1.5) * out,
				translate: `0 ${(1 - s) * 80}px`,
			}}
		>
			<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, color: COLORS.text}}>Schadenssumme</span>
			<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 76, lineHeight: 1, color: COLORS.signal}}>nicht beziffert</span>
			<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 25, color: COLORS.textMuted}}>
				Polizei: „erheblich“ – genaue Höhe steht nicht fest (Stand 03.11.)
			</span>
			<div style={{height: 2, background: COLORS.panelBorder, margin: '4px 0'}} />
			<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 30, color: COLORS.text}}>Belegt gestohlen</span>
			{KNOWN_LOSSES.map((l, i) => {
				const p = interpolate(frame, [from + 8 + i * 5, from + 18 + i * 5], [0, 1], {...clamp, easing: EASE_OUT});
				return (
					<div key={l.shop} style={{display: 'flex', alignItems: 'baseline', gap: 12, opacity: p, translate: `${(1 - p) * 40}px 0`}}>
						<div style={{width: 14, height: 14, borderRadius: 7, background: STATUS_STYLE.gepluendert.color, flexShrink: 0}} />
						<span style={{fontFamily: FONTS.body, fontWeight: 800, fontSize: 27, color: COLORS.text}}>{l.shop}:</span>
						<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 27, color: COLORS.textMuted}}>{l.what}</span>
					</div>
				);
			})}
			<div
				style={{
					marginTop: 6,
					padding: '12px 16px',
					borderRadius: RADII.md,
					background: withAlpha(COLORS.cyan, 0.12),
					border: `2px solid ${withAlpha(COLORS.cyan, 0.5)}`,
					fontFamily: FONTS.body,
					fontWeight: 600,
					fontSize: 24,
					lineHeight: 1.25,
					color: COLORS.text,
				}}
			>
				Zuerst zahlt die Versicherung – reicht sie nicht, prüft die Stadt Hilfe (OB Josef).
			</div>
			<SourceCredit sources={['dpa 01.11.', 't-online 03.11.', 'Händlerangaben']} delay={from + 20} />
		</div>
	);
};

/** Gesamtübersicht: offizielle Bilanz vs. eigene Recherche – klar getrennt. */
const SummaryPanel: React.FC<{from: number}> = ({from}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = springIn({frame, fps, delay: from, damping: 16});
	const off = SHOP_DATA.meta.offiziell;
	const Stat = ({value, label, color, delay}: {value: number; label: string; color: string; delay: number}) => (
		<div style={{display: 'flex', alignItems: 'baseline', gap: 12}}>
			<AnimatedNumber value={value} delay={delay} durationInFrames={16} style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 58, color, minWidth: 64}} />
			<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 25, color: COLORS.text, lineHeight: 1.1}}>{label}</span>
		</div>
	);
	return (
		<div
			style={{
				position: 'absolute',
				top: 940,
				left: 64,
				right: 150,
				display: 'flex',
				gap: 14,
				opacity: Math.min(1, s * 1.5),
				translate: `0 ${(1 - s) * 80}px`,
			}}
		>
			<div style={{flex: 1, padding: '16px 18px', borderRadius: RADII.md, background: 'rgba(7,10,28,0.92)', border: `2px solid ${COLORS.panelBorder}`}}>
				<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 24, color: COLORS.textMuted, letterSpacing: 1.5}}>OFFIZIELL</div>
				<Stat value={off.beschaedigt.anzahl} label="beschädigt" color={STATUS_STYLE.beschaedigt.color} delay={from + 4} />
				<Stat value={off.gepluendert.anzahl} label="davon geplündert" color={STATUS_STYLE.gepluendert.color} delay={from + 8} />
				<div style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 19, color: COLORS.textDim}}>Innenministerium 02.11. · Polizei 01.11.</div>
			</div>
			<div style={{flex: 1, padding: '16px 18px', borderRadius: RADII.md, background: 'rgba(7,10,28,0.92)', border: `2px solid ${withAlpha(COLORS.signal, 0.6)}`}}>
				<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 24, color: COLORS.signal, letterSpacing: 1.5}}>RECHERCHE</div>
				<Stat value={RESEARCH_STATS.identified} label="Geschäfte zugeordnet" color={COLORS.text} delay={from + 10} />
				<Stat value={RESEARCH_STATS.theft} label="mit belegtem Diebstahl" color={STATUS_STYLE.gepluendert.color} delay={from + 14} />
				<Stat value={RESEARCH_STATS.unnamedPlaces} label="Orte ohne Namen" color={STATUS_STYLE.ungeklaert.color} delay={from + 18} />
			</div>
		</div>
	);
};

/**
 * Szene 2: animierte Schadenskarte – Übersicht → Geschäft für Geschäft → Schadenshöhe → Gesamtbilanz.
 * Alle Daten aus data/shops.json; Kamerafahrten folgen den Sprecher-Cues.
 */
export const DamageMapScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const m = cue(cues, 'map1', 4);
	const tourCues = TOUR.map((t, i) => ({...t, c: cue(cues, t.segment, m.to + 20 + i * 90)}));
	const sc = cue(cues, 'schaden', tourCues[tourCues.length - 1].c.to + 10);
	const o1 = cue(cues, 'over1', sc.to + 10);

	const pins: DamagePin[] = useMemo(
		() =>
			SHOPS.map((s, i) => ({
				id: s.id,
				at: [s.lat, s.lon] as LatLon,
				status: s.status,
				label: s.name,
				appearFrame: m.from + 2 + i * 4,
				approx: s.praezision !== 'adresse',
			})),
		[m.from],
	);

	const {camera, active, connectors, cards} = useMemo(() => {
		const cam: CityCameraKeyframe[] = [
			{frame: 0, center: OVERVIEW_CENTER, zoom: 0.5},
			{frame: Math.max(6, m.from + 4), center: OVERVIEW_CENTER, zoom: 0.62},
			{frame: Math.max(20, m.to), center: OVERVIEW_CENTER, zoom: 1.0},
		];
		const act: Array<{id: string; from: number; to: number}> = [];
		const con: Array<{from: string; to: string; startFrame: number; durationInFrames: number}> = [];
		const crd: Array<{shopId: string; from: number; to: number; note?: string; index: number}> = [];
		let prev: string | null = null;
		tourCues.forEach((t, i) => {
			const next = tourCues[i + 1]?.c.from ?? sc.from;
			const shops = t.shops.map(shopById);
			const lat = shops.reduce((a, s) => a + s.lat, 0) / shops.length;
			const lon = shops.reduce((a, s) => a + s.lon, 0) / shops.length;
			const zoom = t.shops.length > 1 ? 1.9 : 2.1;
			cam.push({frame: t.c.from + 2, center: [lat, lon], zoom});
			cam.push({frame: Math.max(t.c.from + 3, next - 8), center: [lat, lon], zoom});
			const span = Math.max(1, next - 4 - (t.c.from + 4));
			shops.forEach((s, k) => {
				const from = t.c.from + 4 + Math.round((span / shops.length) * k);
				const to = t.c.from + 4 + Math.round((span / shops.length) * (k + 1));
				act.push({id: s.id, from, to});
				crd.push({shopId: s.id, from: from + 4, to: to - 2, note: k === shops.length - 1 ? t.note : undefined, index: crd.length});
				if (prev) con.push({from: prev, to: s.id, startFrame: from - 10, durationInFrames: 16});
				prev = s.id;
			});
		});
		cam.push({frame: sc.from + 4, center: OVERVIEW_CENTER, zoom: 0.92});
		// Übersicht: alle Pins zwischen Legende (oben) und Bilanz-Panel (unten)
		cam.push({frame: o1.from + 6, center: [50.11464, 8.68255], zoom: 0.92});
		cam.push({frame: durationInFrames, center: [50.11464, 8.68255], zoom: 0.9});
		return {camera: cam, active: act, connectors: con, cards: crd};
	}, [m.from, m.to, tourCues, sc.from, o1.from, durationInFrames]);

	const {toScreen, zoom} = useCityCamera(MAP, camera, ANCHOR, frame);
	const areaOpacity = interpolate(frame, [m.from + 10, m.from + 22, tourCues[0].c.from - 6, tourCues[0].c.from + 4], [0, 1, 1, 0], clamp);
	const legendOpacity = Math.max(
		interpolate(frame, [m.from + 6, m.from + 18, tourCues[0].c.from, tourCues[0].c.from + 10], [0, 1, 1, 0], clamp),
		interpolate(frame, [o1.from + 4, o1.from + 16], [0, 1], clamp),
	);
	const dim = interpolate(frame, [sc.from - 4, sc.from + 8, o1.from - 6, o1.from + 4], [0, 0.62, 0.62, 0.2], clamp);
	const kicker =
		frame < tourCues[0].c.from - 4 ? 'SCHADENSKARTE' : frame < sc.from - 4 ? 'GESCHÄFT FÜR GESCHÄFT' : frame < o1.from - 4 ? 'SCHADENSHÖHE' : 'GESAMTÜBERSICHT';

	return (
		<AbsoluteFill style={{backgroundColor: '#090D20'}}>
			<CityStreetMap
				map={MAP}
				camera={camera}
				anchor={ANCHOR}
				autoStreetLabels={STREETS}
				labelOpacity={interpolate(zoom, [0.7, 1.0], [0, 1], clamp)}
				streetLabels={[
					{text: 'Hauptwache', at: [50.11372, 8.67905], size: 20},
					{text: 'Konstablerwache', at: [50.11505, 8.68705], size: 20},
				]}
				highlights={[{name: 'Zeil', color: withAlpha(COLORS.signal, 0.35), fromFrame: m.from + 6, width: 10}]}
				glows={AREAS.map((a, i) => ({at: a.at, radiusMeters: 90, color: COLORS.alert, fromFrame: m.from + 12 + i * 6}))}
			/>
			<DamagePins
				map={MAP}
				camera={camera}
				anchor={ANCHOR}
				pins={pins}
				active={active}
				connectors={connectors}
				labelsFrom={o1.from + 10}
				labelArea={{top: 345, bottom: 925}}
			/>

			{/* Bereichsnamen bei der ersten Übersicht */}
			{AREAS.map((a) => {
				const [x, y] = toScreen(a.at);
				return (
					<div
						key={a.label}
						style={{
							position: 'absolute',
							left: x,
							top: y + 64,
							translate: '-50% 0',
							padding: '6px 14px',
							borderRadius: 10,
							background: withAlpha(COLORS.alert, 0.9),
							fontFamily: FONTS.heading,
							fontWeight: 900,
							fontSize: 24,
							color: '#fff',
							whiteSpace: 'nowrap',
							opacity: areaOpacity,
						}}
					>
						{a.label}
					</div>
				);
			})}

			<AbsoluteFill style={{backgroundColor: `rgba(5,7,20,${dim})`}} />
			<AbsoluteFill style={{background: 'linear-gradient(rgba(7,11,26,0.92) 0%, rgba(7,11,26,0.4) 16%, rgba(7,11,26,0) 26%)'}} />

			<SafeArea>
				<div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
						<Kicker text={kicker} color={kicker === 'SCHADENSHÖHE' ? COLORS.signal : COLORS.alert} delay={0} />
					</div>
					<Legend opacity={legendOpacity} />
				</div>
			</SafeArea>

			{/* Infokarten der Geschäfte */}
			{cards.map((c) => {
				const s = shopById(c.shopId);
				return (
					<div key={c.shopId} style={{position: 'absolute', top: 870, left: 64}}>
						<ShopCard
							name={s.name}
							address={s.adresse}
							status={s.status}
							description={s.kurz}
							evidence={evidenceLine(s)}
							image={s.bild.typ === 'foto' ? {kind: 'photo', file: s.bild.datei, credit: s.bild.credit} : {kind: 'illustration', motif: s.bild.motiv}}
							delay={c.from}
							hideFrom={c.to}
							width={866}
						/>
						{c.note && frame >= c.from + 10 && frame < c.to ? (
							<div
								style={{
									marginTop: 10,
									padding: '8px 14px',
									borderRadius: 12,
									background: 'rgba(7,10,28,0.9)',
									borderLeft: `5px solid ${STATUS_STYLE.ungeklaert.color}`,
									fontFamily: FONTS.body,
									fontWeight: 600,
									fontSize: 22,
									color: COLORS.textMuted,
									opacity: interpolate(frame, [c.from + 10, c.from + 20], [0, 1], clamp),
								}}
							>
								{c.note}
							</div>
						) : null}
					</div>
				);
			})}

			{frame >= sc.from - 6 && frame < o1.from ? <DamagePanel from={sc.from - 2} to={o1.from - 2} /> : null}
			{frame >= o1.from ? <SummaryPanel from={o1.from + 2} /> : null}
		</AbsoluteFill>
	);
};
