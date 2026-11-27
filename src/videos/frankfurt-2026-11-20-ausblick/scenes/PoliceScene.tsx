import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {EmergencyLights} from '../../../components/backgrounds/EmergencyLights';
import {FrankfurtSkyline} from '../../../components/backgrounds/FrankfurtSkyline';
import {GradientSky} from '../../../components/backgrounds/GradientSky';
import {CalendarCard} from '../../../components/calendar/CalendarCard';
import {Camera} from '../../../components/camera/Camera';
import {SafeArea} from '../../../components/layout/SafeArea';
import {PoliceCar} from '../../../components/police/PoliceCar';
import {PressRelease} from '../../../components/police/PressRelease';
import {Kicker} from '../../../components/text/Kicker';
import {clamp, EASE_IN_OUT, EASE_OUT, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {COLORS, FONTS, RADII} from '../../../theme/tokens';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {POLICE} from '../content';
import {StatusChip} from '../ui';

/** Neutrales Polizei-Icon (Schild). */
const Shield: React.FC<{size: number}> = ({size}) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={1.8} strokeLinejoin="round">
		<path d="M12 2l8 3v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5z" fill="#2E6BFF" />
		<path d="M12 7l1.5 3 3.2.4-2.4 2.2.6 3.2L12 14.3 9.1 15.8l.6-3.2-2.4-2.2 3.2-.4z" fill="#FFFFFF" stroke="none" />
	</svg>
);

/** Verstärkungs-Anzeige: Balken füllt sich – bewusst ohne Zahl (keine konkrete Stärke angekündigt). */
const Reinforcement: React.FC<{from: number}> = ({from}) => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [from, from + 30], [0, 1], {...clamp, easing: EASE_OUT});
	const segments = 12;
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '16px 20px', borderRadius: RADII.md, background: 'rgba(7,10,28,0.9)', border: `2px solid ${withAlpha('#2E6BFF', 0.8)}`}}>
			<Shield size={70} />
			<div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 8}}>
				<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 32, color: COLORS.text}}>Polizeiaufgebot</span>
				<div style={{display: 'flex', gap: 6}}>
					{new Array(segments).fill(true).map((_, i) => {
						const on = p * segments > i;
						const extra = i >= 8;
						return <div key={i} style={{flex: 1, height: 26, borderRadius: 5, background: on ? (extra ? COLORS.cyan : '#2E6BFF') : '#1C2550', boxShadow: on && extra ? `0 0 14px ${COLORS.cyan}` : undefined}} />;
					})}
				</div>
				<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, color: COLORS.cyan, opacity: p}}>„noch stärker“ – angekündigt, ohne Zahl</span>
			</div>
		</div>
	);
};

/** Szene 3 – Die Polizei ist vorbereitet: Ankündigung, Verbotsdebatte (offen), Abschreckung (offen), Art. 8 GG. */
export const PoliceScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p1 = cue(cues, 'pol1', 6);
	const p2 = cue(cues, 'pol2', p1.to + 6);
	const p3 = cue(cues, 'pol3', p2.to + 6);
	const atForce = wordFrame(cues, 'Aufgebot', p1.from + Math.round((p1.to - p1.from) * 0.7));
	const atBan = wordFrame(cues, 'Verbot', p2.from + Math.round((p2.to - p2.from) * 0.55));
	const atOpen = wordFrame(cues, 'entschieden', atBan + 20);
	const atDeter = wordFrame(cues, 'abschrecken', p3.from + 10);
	const atGuarantee = wordFrame(cues, 'garantiert', atDeter + 15);
	const atProtest = wordFrame(cues, 'Protest', p3.to - 25);
	const toCalendar = interpolate(frame, [p2.from - 6, p2.from + 10], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const toRights = interpolate(frame, [p3.from - 6, p3.from + 10], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const carX = interpolate(frame, [0, durationInFrames], [-380, 1200]);
	const q = springIn({frame, fps, delay: atBan, damping: 9, stiffness: 200});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night}}>
			<Camera keyframes={[{frame: 0, zoom: 1.08, y: 20}, {frame: durationInFrames, zoom: 1.0, y: 0}]}>
				<GradientSky stops={['#050920', '#0E1A48', '#16285E', '#1E3270']} glowY={0.75} glowColor="#2E6BFF" glowStrength={0.4} />
				<AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center'}}>
					<FrankfurtSkyline width={1560} litRatio={0.25} style={{marginBottom: -40}} />
				</AbsoluteFill>
				<EmergencyLights intensity={0.22} y={0.82} colors={['#2E6BFF', '#2E6BFF']} />
			</Camera>
			<div style={{position: 'absolute', left: carX, top: 1590}}>
				<PoliceCar width={360} />
			</div>
			<AbsoluteFill style={{background: 'linear-gradient(rgba(5,9,32,0.92) 0%, rgba(5,9,32,0.5) 48%, rgba(5,9,32,0.1) 70%)'}} />

			<SafeArea>
				<Kicker text="ZWEITENS: DIE POLIZEI" color="#2E6BFF" delay={0} />
			</SafeArea>

			{/* Teil 1: Ankündigung */}
			<div style={{position: 'absolute', left: 64, width: 866, top: 300, display: 'flex', flexDirection: 'column', gap: 18, opacity: 1 - toCalendar, translate: `${-toCalendar * 200}px 0`}}>
				<Reinforcement from={atForce - 6} />
				<PressRelease sender="Hessisches Innenministerium" date="02.11.2026" quotes={[{text: `„${POLICE.quote}“`, from: p1.from + 10}]} delay={p1.from + 4} width={866} />
				<StatusChip kind="ANGEKÜNDIGT" text={POLICE.quoteFrom} at={atForce} size={26} />
			</div>

			{/* Teil 2: Kalender + Verbotsfrage */}
			{toCalendar > 0.01 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, opacity: toCalendar * (1 - toRights), translate: `${(1 - toCalendar) * 200}px 0`}}>
					<CalendarCard day={20} month="NOVEMBER" weekday="Freitag" color={COLORS.signal} delay={p2.from - 4} width={330} from="right" />
					{frame >= atBan ? (
						<div
							style={{
								padding: '12px 26px',
								borderRadius: RADII.md,
								background: withAlpha(COLORS.alert, 0.92),
								border: '4px solid #FFFFFF',
								fontFamily: FONTS.heading,
								fontWeight: 900,
								fontSize: 60,
								color: '#FFFFFF',
								rotate: '-3deg',
								scale: String(1.6 - 0.6 * q),
								opacity: Math.min(1, q * 2),
							}}
						>
							{POLICE.banQuestion}
						</div>
					) : null}
					<div style={{alignSelf: 'stretch'}}>
						<StatusChip kind="OFFEN" text={POLICE.banStatus} at={atOpen - 4} />
					</div>
				</div>
			) : null}

			{/* Teil 3: Abschreckung offen, Versammlungsfreiheit */}
			{toRights > 0.01 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 330, display: 'flex', flexDirection: 'column', gap: 16, opacity: toRights}}>
					<div style={{display: 'flex', justifyContent: 'center', marginBottom: 10}}>
						<Shield size={220} />
					</div>
					<StatusChip kind="EINSCHÄTZUNG" text={POLICE.deterrence} at={atDeter - 4} />
					<StatusChip kind="OFFEN" text="Ob es wirkt? Weiß vorher niemand" at={atGuarantee} />
					<StatusChip kind="FAKT" text={POLICE.law} at={atProtest - 6} />
				</div>
			) : null}
			<div style={{position: 'absolute', left: 64, top: 1235, opacity: interpolate(frame, [p1.from + 10, p1.from + 20], [0, 1], clamp)}}>
				<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, color: COLORS.textMuted}}>Quellen: {POLICE.source}</span>
			</div>

			<Sfx name="paper" at={p1.from + 4} />
			<Sfx name="riser" at={atForce - 10} volume={0.6} />
			<Sfx name="softImpact" at={atForce + 20} volume={0.7} />
			<Sfx name="whoosh" at={p2.from - 6} volume={0.7} />
			<Sfx name="stamp" at={atBan} />
			<Sfx name="click" at={atOpen - 4} />
			<Sfx name="whoosh" at={p3.from - 6} volume={0.6} />
			<Sfx name="click" at={atDeter - 4} />
			<Sfx name="click" at={atGuarantee} />
			<Sfx name="pop" at={atProtest - 6} />
		</AbsoluteFill>
	);
};
