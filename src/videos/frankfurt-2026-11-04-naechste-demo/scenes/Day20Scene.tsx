import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {GridBackdrop} from '../../../components/backgrounds/GridBackdrop';
import {MonthGrid} from '../../../components/calendar/MonthGrid';
import {AnimatedNumber} from '../../../components/infographics/AnimatedNumber';
import {SafeArea} from '../../../components/layout/SafeArea';
import {GermanyMap} from '../../../components/map/GermanyMap';
import {SourceCredit} from '../../../components/media/SourceCredit';
import {Kicker} from '../../../components/text/Kicker';
import {clamp, EASE_IN_OUT, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {COLORS, FONTS, RADII} from '../../../theme/tokens';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {ANNOUNCED_CITY_COUNT, STAEDTE, STUFE_STYLE, terminById} from '../termine';

const MAP_W = 560;
const MAP_H = 747;

/** Szene 4: 20. November – Kalender schwenkt auf Freitag, danach Deutschlandkarte mit den 34 angekündigten Städten. */
export const Day20Scene: React.FC<SceneProps> = ({cues}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const a = cue(cues, 'd20a', 4);
	const b = cue(cues, 'd20b', a.to + 4);
	const t = terminById('20-11');
	const st = STUFE_STYLE.ankuendigung;
	// Wechsel zur Karte beim Wort „34“
	const toMap = wordFrame(cues, '34', a.from + Math.round((a.to - a.from) * 0.5)) - 6;
	const mapIn = interpolate(frame, [toMap, toMap + 18], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const calOut = 1 - mapIn;
	const mapStart = toMap + 14;
	const step = 1.5;
	const frankfurtAt = mapStart + STAEDTE.length * step + 10;
	const headerP = springIn({frame, fps, delay: 6, damping: 14});
	const strikeIn = springIn({frame, fps, delay: b.from + 2, damping: 12, stiffness: 160});
	const stand = springIn({frame, fps, delay: b.from + Math.round((b.to - b.from) * 0.55), damping: 13});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night}}>
			<GridBackdrop accent={COLORS.signal} seed="d20" />
			<SafeArea>
				<div style={{opacity: calOut}}>
					<Kicker text="20. NOVEMBER · FREITAG" color={COLORS.signal} delay={0} />
				</div>
			</SafeArea>

			{/* Phase A: Kalender */}
			<div style={{position: 'absolute', inset: 0, opacity: calOut, pointerEvents: 'none'}}>
				<div style={{position: 'absolute', top: 285, left: 83}}>
					<MonthGrid
						title="NOVEMBER 2026"
						firstWeekday={7}
						daysInMonth={30}
						width={700}
						headerHeight={90}
						delay={2}
						highlights={[{day: 20, color: COLORS.signal, from: a.from + 10, note: '14 Uhr'}]}
						focus={{day: 20, from: a.from + 24, to: a.from + 54, zoom: 1.2}}
					/>
				</div>
				<div
					style={{
						position: 'absolute',
						top: 1085,
						left: 64,
						width: 866,
						textAlign: 'center',
						fontFamily: FONTS.heading,
						fontWeight: 900,
						fontSize: 54,
						lineHeight: 1.05,
						color: COLORS.text,
						opacity: Math.min(1, headerP * 1.6),
					}}
				>
					FREITAG, <span style={{color: COLORS.signal}}>20. NOVEMBER</span>
				</div>
			</div>

			{/* Phase B: Karte */}
			<div style={{position: 'absolute', inset: 0, opacity: mapIn}}>
				<div style={{position: 'absolute', top: 215, left: 64, width: 866}}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 64, lineHeight: 1, color: COLORS.signal}}>20. NOVEMBER 2026</div>
					{frame >= b.from ? (
						<div
							style={{
								marginTop: 12,
								width: 'fit-content',
								padding: '8px 22px',
								borderRadius: RADII.pill,
								background: COLORS.cyan,
								border: '4px solid #0B1029',
								fontFamily: FONTS.heading,
								fontWeight: 900,
								fontSize: 31,
								letterSpacing: 1,
								color: '#0B1029',
								opacity: Math.min(1, strikeIn * 1.6),
								scale: String(0.85 + 0.15 * strikeIn),
								transformOrigin: 'left center',
							}}
						>
							INTERNATIONALER JUGENDSTREIKTAG
						</div>
					) : null}
				</div>

				<div style={{position: 'absolute', top: 380, left: 64}}>
					<GermanyMap
						cities={STAEDTE}
						width={MAP_W}
						height={MAP_H}
						startFrame={mapStart}
						stepFrames={step}
						delay={toMap}
						highlightId="frankfurt"
						highlightFrame={frankfurtAt}
						highlightLabel="FRANKFURT"
						labelIds={['berlin', 'hamburg', 'muenchen', 'koeln']}
					/>
				</div>

				{/* Zähler + Legende */}
				<div style={{position: 'absolute', top: 400, left: 650, width: 280, display: 'flex', flexDirection: 'column', gap: 6}}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 138, lineHeight: 0.95, color: COLORS.text, textShadow: `0 0 40px ${withAlpha(COLORS.signal, 0.5)}`}}>
						<AnimatedNumber value={ANNOUNCED_CITY_COUNT} delay={mapStart} durationInFrames={Math.round(STAEDTE.length * step) + 6} />
					</div>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, color: COLORS.signal}}>STÄDTE</div>
					<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 25, lineHeight: 1.2, color: COLORS.textMuted}}>laut „Gen Z regelt“</div>
					<div style={{marginTop: 22, display: 'flex', flexDirection: 'column', gap: 12, opacity: interpolate(frame, [mapStart + 30, mapStart + 46], [0, 1], clamp)}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
							<div style={{width: 24, height: 24, borderRadius: '50%', background: '#FF9A2E', border: '3px solid #0B1029', flexShrink: 0}} />
							<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, lineHeight: 1.15, color: COLORS.text}}>5 selbst organisiert</span>
						</div>
						<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
							<div style={{width: 24, height: 24, borderRadius: '50%', background: '#FFFFFF', border: '3px solid #0B1029', flexShrink: 0}} />
							<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, lineHeight: 1.15, color: COLORS.text}}>angeschlossen</span>
						</div>
					</div>
				</div>

				{/* Status Frankfurt */}
				<div
					style={{
						position: 'absolute',
						top: 1138,
						left: 64,
						width: 866,
						padding: '12px 24px 14px',
						borderRadius: RADII.md,
						background: 'rgba(7,10,28,0.94)',
						border: `4px solid ${st.color}`,
						boxShadow: `0 0 40px ${withAlpha(st.color, 0.3)}`,
						opacity: Math.min(1, stand * 1.6),
						translate: `0 ${(1 - stand) * 40}px`,
					}}
				>
					<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 36, lineHeight: 1.05, color: st.color}}>FRANKFURT: PROTEST {st.label}</div>
					<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 27, color: COLORS.textMuted, marginTop: 4}}>
						Treffpunkt: {t.frankfurt.toLowerCase()} · Anmeldung: {t.anmeldung}
					</div>
				</div>
			</div>

			<div style={{position: 'absolute', left: 64, top: 1250, opacity: mapIn}}>
				<SourceCredit sources={['genz-regelt.de 04.11.', 'taz 01.11.', 'hessenschau 02.11.']} delay={toMap + 20} />
			</div>
		</AbsoluteFill>
	);
};
