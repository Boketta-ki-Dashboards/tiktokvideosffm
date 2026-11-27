import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {GridBackdrop} from '../../../components/backgrounds/GridBackdrop';
import {CalendarCard} from '../../../components/calendar/CalendarCard';
import {SafeArea} from '../../../components/layout/SafeArea';
import {SourceCredit} from '../../../components/media/SourceCredit';
import {Kicker} from '../../../components/text/Kicker';
import {clamp, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {COLORS, FONTS, RADII} from '../../../theme/tokens';
import {cue, type SceneProps} from '../../frankfurt-2026-10-31/cues';
import {STUFE_STYLE, TERMINE} from '../termine';

const CARD_W = 262;

/** Zeile unter der Karte: belegte Stufe (✓) oder offen (?) bzw. nicht vorhanden (–). */
const Row: React.FC<{label: string; state: 'ja' | 'offen' | 'nein'; from: number}> = ({label, state, from}) => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [from, from + 10], [0, 1], clamp);
	const color = state === 'ja' ? COLORS.green : state === 'offen' ? COLORS.textDim : COLORS.alert;
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: 8, height: 38, opacity: p}}>
			<span style={{width: 28, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, color}}>{state === 'ja' ? '✓' : state === 'offen' ? '?' : '✕'}</span>
			<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 26, color: COLORS.text, whiteSpace: 'nowrap'}}>{label}</span>
		</div>
	);
};

/** Szene 7: drei Kalenderkarten mit Status + „Durchführung in Frankfurt noch offen“. */
export const SummaryScene: React.FC<SceneProps> = ({cues}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s1 = cue(cues, 'sum1', 4);
	const s2 = cue(cues, 'sum2', s1.to + 4);
	const banner = springIn({frame, fps, delay: s2.from + Math.round((s2.to - s2.from) * 0.55), damping: 12, stiffness: 160});
	const bannerFrom = s2.from + Math.round((s2.to - s2.from) * 0.55);
	const delays: Record<string, number> = {'14-11': s1.from, '21-11': s1.from + Math.round((s1.to - s1.from) * 0.55), '20-11': s2.from};
	const dirs = {'14-11': 'left', '20-11': 'bottom', '21-11': 'right'} as const;
	const rowsFor = (id: string): Array<[string, 'ja' | 'offen' | 'nein']> =>
		id === '20-11'
			? [
					['Aufruf', 'ja'],
					['Anmeldung', 'offen'],
					['Entscheidung', 'offen'],
				]
			: id === '14-11'
				? [
						['Aufruf gelöscht', 'nein'],
						['Anmeldung', 'offen'],
						['Entscheidung', 'offen'],
					]
				: [
						['Kein Aufruf', 'nein'],
						['Anmeldung', 'offen'],
						['Entscheidung', 'offen'],
					];

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night}}>
			<GridBackdrop accent={COLORS.cyan} seed="sum" />
			<SafeArea>
				<Kicker text="DIE LAGE AM 4. NOVEMBER" color={COLORS.signal} delay={0} live />
			</SafeArea>

			<div style={{position: 'absolute', top: 290, left: 64, width: 866, display: 'flex', justifyContent: 'space-between'}}>
				{TERMINE.map((t, i) => {
					const stl = STUFE_STYLE[t.stufe];
					const mid = t.id === '20-11';
					return (
						<div key={t.id} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginTop: mid ? -18 : 0}}>
							<CalendarCard
								day={t.tag}
								weekday={t.wochentag}
								color={stl.color}
								status={stl.label}
								width={CARD_W}
								from={dirs[t.id as keyof typeof dirs]}
								delay={delays[t.id] ?? 0}
								tilt={i === 0 ? -3 : i === 2 ? 3 : 0}
								floatPhase={i * 2.3}
							/>
							<div style={{width: CARD_W - 8}}>
								{rowsFor(t.id).map(([label, state], k) => (
									<Row key={label} label={label} state={state} from={(delays[t.id] ?? 0) + 26 + k * 8} />
								))}
							</div>
						</div>
					);
				})}
			</div>

			{frame >= bannerFrom - 2 ? (
				<div
					style={{
						position: 'absolute',
						top: 900,
						left: 64,
						width: 866,
						opacity: Math.min(1, banner * 1.6),
						scale: String(0.88 + 0.12 * banner),
					}}
				>
					<div
						style={{
							padding: '20px 24px',
							borderRadius: RADII.lg,
							background: 'rgba(7,10,28,0.95)',
							border: `5px solid ${COLORS.signal}`,
							boxShadow: `0 0 60px ${withAlpha(COLORS.signal, 0.35)}`,
							fontFamily: FONTS.heading,
							fontWeight: 900,
							fontSize: 50,
							lineHeight: 1.08,
							color: COLORS.text,
							textAlign: 'center',
						}}
					>
						DURCHFÜHRUNG IN FRANKFURT <span style={{color: COLORS.signal}}>NOCH OFFEN</span>
					</div>
					<div style={{marginTop: 14, textAlign: 'center', fontFamily: FONTS.body, fontWeight: 700, fontSize: 28, color: COLORS.textMuted}}>
						✓ belegt · ✕ nicht vorhanden · ? nicht bekannt
					</div>
					<div style={{marginTop: 6, textAlign: 'center', fontFamily: FONTS.body, fontWeight: 700, fontSize: 27, color: COLORS.textMuted}}>
						Stand: 4. November 2026 – kann sich kurzfristig ändern.
					</div>
				</div>
			) : null}

			<div style={{position: 'absolute', left: 64, top: 1250}}>
				<SourceCredit sources={['genz-regelt.de', 'hessenschau', 'Innenministerium Hessen']} delay={s2.from} />
			</div>
		</AbsoluteFill>
	);
};
