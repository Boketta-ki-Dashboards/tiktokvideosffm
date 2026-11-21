import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {GridBackdrop} from '../../../components/backgrounds/GridBackdrop';
import {SafeArea} from '../../../components/layout/SafeArea';
import {StorefrontIllustration} from '../../../components/media/StorefrontIllustration';
import {Kicker} from '../../../components/text/Kicker';
import {clamp, EASE_OUT, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {COLORS, FONTS, RADII} from '../../../theme/tokens';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {SHOPS} from '../content';
import {PopIn, StatusChip} from '../ui';

/** Moderne Ladenfront mit großen Scheiben; Holzplatten schieben sich ab `boardFrom` davor. */
export const GlassShop: React.FC<{width: number; boardFrom: number; boards?: number; label?: string}> = ({width, boardFrom, boards = 3, label = 'STORE'}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const h = width * 0.78;
	const paneW = (width - 80) / boards;
	return (
		<div style={{position: 'relative', width, height: h}}>
			<svg width={width} height={h} viewBox={`0 0 ${width} ${h}`}>
				<rect x={0} y={0} width={width} height={h} rx={14} fill="#1E2A5A" />
				<rect x={20} y={20} width={width - 40} height={70} rx={8} fill="#0B1029" />
				<text x={width / 2} y={68} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={900} fontSize={40} fill={COLORS.signal} letterSpacing={6}>
					{label}
				</text>
				{new Array(boards).fill(true).map((_, i) => (
					<g key={i}>
						<rect x={40 + i * paneW} y={110} width={paneW - 16} height={h - 140} rx={6} fill="url(#glass)" stroke="#9FD8FF" strokeWidth={3} />
						<path d={`M${60 + i * paneW} ${140} l60 -0 M${60 + i * paneW} ${160} l30 0`} stroke="#FFFFFF" strokeWidth={4} opacity={0.5} />
					</g>
				))}
				<defs>
					<linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
						<stop offset="0" stopColor="#5AA9E6" stopOpacity={0.55} />
						<stop offset="1" stopColor="#1B3A7A" stopOpacity={0.55} />
					</linearGradient>
				</defs>
			</svg>
			{new Array(boards).fill(true).map((_, i) => {
				const s = springIn({frame, fps, delay: boardFrom + i * 6, damping: 13, stiffness: 170});
				if (frame < boardFrom + i * 6) return null;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: 36 + i * paneW,
							top: 106,
							width: paneW - 8,
							height: h - 132,
							borderRadius: 6,
							background: 'repeating-linear-gradient(90deg, #C9945A 0px, #C9945A 22px, #B98249 22px, #B98249 26px)',
							border: '4px solid #8A5A2E',
							translate: `0 ${(1 - s) * -h}px`,
							boxShadow: '0 10px 24px rgba(0,0,0,0.4)',
						}}
					>
						{[0.12, 0.88].map((t) => (
							<div key={t} style={{position: 'absolute', left: 10, top: `${t * 100}%`, width: 14, height: 14, borderRadius: 7, background: '#3A3A44'}} />
						))}
					</div>
				);
			})}
		</div>
	);
};

const ICONS: Record<string, React.ReactNode> = {
	boards: (
		<svg width={44} height={44} viewBox="0 0 24 24" fill="none" stroke="#0B1029" strokeWidth={2.4}>
			<rect x={3} y={5} width={18} height={14} rx={1} />
			<path d="M3 10h18M3 15h18" />
		</svg>
	),
	security: (
		<svg width={44} height={44} viewBox="0 0 24 24" fill="none" stroke="#0B1029" strokeWidth={2.4} strokeLinejoin="round">
			<path d="M12 2l8 3v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5z" />
		</svg>
	),
	close: (
		<svg width={44} height={44} viewBox="0 0 24 24" fill="none" stroke="#0B1029" strokeWidth={2.4} strokeLinecap="round">
			<circle cx={12} cy={12} r={9} />
			<path d="M12 7v5l3 2" />
		</svg>
	),
};

/** Szene 4 – Werden die Läden besser geschützt? Fakt: Holzplatten vor Halloween; Rest: mögliche Vorbereitung. */
export const ShopsScene: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const s1 = cue(cues, 'shop1', 6);
	const s2 = cue(cues, 'shop2', s1.to + 6);
	const s3 = cue(cues, 'shop3', s2.to + 6);
	const atBoards = wordFrame(cues, 'Holzplatten', s1.to - 25);
	const optAt = [wordFrame(cues, 'Platten', s2.from + 40), wordFrame(cues, 'Security', s2.from + 55), wordFrame(cues, 'schließen', s2.from + 70)];
	const atOpen = wordFrame(cues, 'offen', s3.to - 12);
	const shrink = interpolate(frame, [s2.from - 6, s2.from + 12], [0, 1], {...clamp, easing: EASE_OUT});
	const drift = interpolate(frame, [0, durationInFrames], [0, -30]);

	return (
		<AbsoluteFill>
			<GridBackdrop accent={COLORS.signal} stops={['#12102A', '#05081A']} particles={18} seed="shops" />
			<SafeArea>
				<Kicker text="DRITTENS: DIE LÄDEN" color={COLORS.signal} delay={0} />
			</SafeArea>

			{/* Großer Laden: erst Glas, dann Holzplatten (belegt vor Halloween) */}
			<div style={{position: 'absolute', left: 64, width: 866, top: 310 + drift, display: 'flex', justifyContent: 'center', scale: String(1 - shrink * 0.45), transformOrigin: '50% 0%'}}>
				<GlassShop width={760} boardFrom={atBoards - 2} boards={3} />
			</div>
			<div style={{position: 'absolute', left: 64, width: 866, top: 920, opacity: 1 - shrink}}>
				<StatusChip kind="FAKT" text={SHOPS.fact} at={atBoards + 6} />
				<div style={{marginTop: 8, fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, color: COLORS.textMuted, opacity: interpolate(frame, [atBoards + 10, atBoards + 20], [0, 1], clamp)}}>
					Quelle: {SHOPS.factSource} · Illustration
				</div>
			</div>

			{/* Optionen: mögliche Vorbereitung */}
			{shrink > 0.01 ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 660, display: 'flex', flexDirection: 'column', gap: 16, opacity: shrink}}>
					<div style={{display: 'flex', gap: 14, justifyContent: 'space-between'}}>
						{SHOPS.options.map((o, i) => (
							<PopIn key={o.id} delay={optAt[i] - 4}>
								<div style={{width: 270, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
									<StorefrontIllustration motif={i === 0 ? 'shoe' : i === 1 ? 'sports' : 'perfume'} width={250} height={190} boarded={i === 0} seed={`opt-${i}`} />
									<div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: RADII.pill, background: COLORS.signal}}>
										{ICONS[o.id]}
										<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 27, color: '#0B1029'}}>{o.label}</span>
									</div>
									<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.signal}}>{SHOPS.maybe}</span>
								</div>
							</PopIn>
						))}
					</div>
					<div style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, color: COLORS.textMuted}}>Illustration · mögliche Maßnahmen, keine bestätigten Pläne</div>
				</div>
			) : null}

			{/* Offen: konkrete Läden */}
			<div style={{position: 'absolute', left: 64, width: 866, top: 1080, display: 'flex', flexDirection: 'column', gap: 10}}>
				{frame >= s3.from - 4 ? (
					<PopIn delay={s3.from - 4} from="left">
						<div style={{display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap'}}>
							{SHOPS.affected.map((n) => (
								<span key={n} style={{padding: '6px 14px', borderRadius: RADII.pill, background: '#FFFFFF', fontFamily: FONTS.heading, fontWeight: 800, fontSize: 27, color: '#0B1020', boxShadow: `inset 0 -3px 0 ${withAlpha(COLORS.alert, 1)}`}}>
									{n}
								</span>
							))}
							<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 25, color: COLORS.text}}>{SHOPS.affectedNote}</span>
						</div>
					</PopIn>
				) : null}
				<StatusChip kind="OFFEN" text="Wer was plant: nicht bekannt (Stand 06.11.2026)" at={atOpen - 6} size={28} />
			</div>

			<Sfx name="pop" at={s1.from} />
			{[0, 1, 2].map((i) => (
				<Sfx key={`b-${i}`} name="softImpact" at={atBoards - 2 + i * 6} volume={0.55} />
			))}
			<Sfx name="click" at={atBoards + 6} />
			{optAt.map((f, i) => (
				<Sfx key={`o-${i}`} name="pop" at={f - 4} />
			))}
			<Sfx name="click" at={s3.from - 4} />
			<Sfx name="click" at={atOpen - 6} />
		</AbsoluteFill>
	);
};
