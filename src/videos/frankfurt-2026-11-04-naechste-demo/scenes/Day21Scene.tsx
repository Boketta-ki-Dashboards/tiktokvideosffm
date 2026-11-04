import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {GridBackdrop} from '../../../components/backgrounds/GridBackdrop';
import {MonthGrid} from '../../../components/calendar/MonthGrid';
import {SafeArea} from '../../../components/layout/SafeArea';
import {SourceCredit} from '../../../components/media/SourceCredit';
import {Kicker} from '../../../components/text/Kicker';
import {clamp, EASE_OUT, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {COLORS, FONTS, RADII} from '../../../theme/tokens';
import {cue, type SceneProps} from '../../frankfurt-2026-10-31/cues';

const CHECKS = ['Website des Veranstalters', 'Telegram-Kanal', 'Polizei und Stadt Frankfurt', 'Medienberichte'];

/** Szene 3: 21. November – Kalender, Quellen-Check ohne Treffer, klare Einordnung (nicht verboten, nicht abgesagt). */
export const Day21Scene: React.FC<SceneProps> = ({cues}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const d = cue(cues, 'd21', 4);
	const span = d.to - d.from;
	const checkStart = d.from + Math.round(span * 0.3);
	const bannerFrom = d.from + Math.round(span * 0.78);
	const bannerP = springIn({frame, fps, delay: bannerFrom, damping: 12, stiffness: 160});
	const checksOut = interpolate(frame, [bannerFrom - 4, bannerFrom + 8], [1, 0], clamp);
	const drift = interpolate(frame, [0, 600], [1, 1.06], clamp);

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night}}>
			<GridBackdrop accent={COLORS.violet} seed="d21" />
			<SafeArea>
				<Kicker text="21. NOVEMBER · KEINE QUELLE" color={COLORS.signal} delay={0} />
			</SafeArea>

			<div style={{position: 'absolute', top: 265, left: 83, scale: String(drift), transformOrigin: '50% 0%'}}>
				<MonthGrid
					title="NOVEMBER 2026"
					firstWeekday={7}
					daysInMonth={30}
					width={700}
					headerHeight={90}
					delay={2}
					highlights={[{day: 21, color: COLORS.cyan, from: d.from + 14, note: 'Sa.'}]}
				/>
			</div>

			{/* Quellen-Check */}
			<div style={{position: 'absolute', top: 1032, left: 64, width: 866, opacity: checksOut}}>
				<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, letterSpacing: 2, color: COLORS.textMuted, marginBottom: 8}}>GEPRÜFT AM 4. NOVEMBER</div>
				{CHECKS.map((c, i) => {
					const f = checkStart + i * Math.max(6, Math.round(span * 0.1));
					const p = interpolate(frame, [f, f + 12], [0, 1], {...clamp, easing: EASE_OUT});
					return (
						<div key={c} style={{display: 'flex', alignItems: 'center', gap: 16, height: 40, opacity: p, translate: `${(1 - p) * -60}px 0`}}>
							<div
								style={{
									width: 36,
									height: 36,
									borderRadius: '50%',
									background: withAlpha(COLORS.alert, 0.9),
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontFamily: FONTS.heading,
									fontWeight: 900,
									fontSize: 24,
									color: '#FFFFFF',
								}}
							>
								✕
							</div>
							<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 29, color: COLORS.text}}>{c}</span>
							<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 27, color: COLORS.textDim}}>– kein Treffer</span>
						</div>
					);
				})}
			</div>

			{/* Banner */}
			{frame >= bannerFrom ? (
				<div
					style={{
						position: 'absolute',
						top: 1040,
						left: 64,
						width: 866,
						opacity: Math.min(1, bannerP * 1.6),
						scale: String(0.9 + 0.1 * bannerP),
						translate: `0 ${(1 - bannerP) * 60}px`,
					}}
				>
					<div
						style={{
							padding: '18px 26px',
							borderRadius: RADII.md,
							background: 'rgba(7,10,28,0.94)',
							border: `5px solid ${COLORS.signal}`,
							boxShadow: `0 0 50px ${withAlpha(COLORS.signal, 0.3)}`,
							fontFamily: FONTS.heading,
							fontWeight: 900,
							fontSize: 46,
							lineHeight: 1.08,
							color: COLORS.text,
							textAlign: 'center',
						}}
					>
						KEINE BESTÄTIGTE <span style={{color: COLORS.signal}}>FRANKFURTER DEMO</span>
					</div>
					<div style={{marginTop: 12, textAlign: 'center', fontFamily: FONTS.body, fontWeight: 700, fontSize: 28, color: COLORS.textMuted}}>
						Kein Verbot, keine Absage – es gibt nur keine Quelle.
					</div>
				</div>
			) : null}

			<div style={{position: 'absolute', left: 64, top: 1250}}>
				<SourceCredit sources={['genz-regelt.de', 'hessenschau', 'taz', 'Innenministerium Hessen']} label="Geprüft" delay={checkStart} />
			</div>
		</AbsoluteFill>
	);
};
