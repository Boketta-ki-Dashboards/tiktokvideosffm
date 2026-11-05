import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../../components/audio/Sfx';
import {GridBackdrop} from '../../../components/backgrounds/GridBackdrop';
import {AnimatedNumber} from '../../../components/infographics/AnimatedNumber';
import {SafeArea} from '../../../components/layout/SafeArea';
import {SourceCredit} from '../../../components/media/SourceCredit';
import {Kicker} from '../../../components/text/Kicker';
import {clamp, EASE_OUT, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {COLORS, FONTS, RADII} from '../../../theme/tokens';
import {cue, type SceneProps, wordFrame} from '../../frankfurt-2026-10-31/cues';
import {type Stat, STATS, STATS_SOURCE} from '../content';
import {PopIn} from '../ui';

/** 17 Ladensymbole – die 5 geplünderten sind TEIL der 17 (Regel: nie addieren). */
const ShopRow: React.FC<{from: number; lootFrom: number}> = ({from, lootFrom}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return (
		<div style={{display: 'flex', flexWrap: 'wrap', gap: 8, width: 820}}>
			{new Array(17).fill(true).map((_, i) => {
				const s = springIn({frame, fps, delay: from + i * 1.5, damping: 12, stiffness: 180});
				const looted = i < 5;
				const l = looted ? interpolate(frame, [lootFrom + i * 3, lootFrom + i * 3 + 8], [0, 1], {...clamp, easing: EASE_OUT}) : 0;
				const color = looted && l > 0.5 ? COLORS.alert : '#FFB020';
				return (
					<svg key={i} width={40} height={40} viewBox="0 0 24 24" style={{scale: String(s), opacity: Math.min(1, s * 2)}}>
						<path d="M3 9l1.5-5h15L21 9z" fill={withAlpha(color, 0.9)} />
						<rect x={4} y={9} width={16} height={11} rx={1.5} fill="none" stroke={color} strokeWidth={2} />
						<rect x={10} y={13} width={4} height={7} fill={color} />
						{looted ? <path d="M6 11l4 4M10 11l-4 4" stroke="#FFFFFF" strokeWidth={1.6} opacity={l} /> : null}
					</svg>
				);
			})}
		</div>
	);
};

const StatTile: React.FC<{s: Stat; delay: number; size?: number}> = ({s, delay, size = 74}) => (
	<PopIn delay={delay} from="bottom">
		<div
			style={{
				padding: '14px 18px',
				borderRadius: RADII.md,
				background: 'linear-gradient(140deg, rgba(25, 34, 76, 0.96), rgba(11, 16, 40, 0.96))',
				border: `2px solid ${withAlpha(s.accent, 0.6)}`,
				display: 'flex',
				flexDirection: 'column',
				gap: 2,
			}}
		>
			<AnimatedNumber
				value={s.value}
				prefix={s.prefix}
				delay={delay + 2}
				durationInFrames={24}
				style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: size, lineHeight: 1, color: s.accent}}
			/>
			<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 30, color: COLORS.text, lineHeight: 1.1}}>{s.label}</span>
			{s.sub ? <span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 23, color: COLORS.textMuted}}>{s.sub}</span> : null}
		</div>
	</PopIn>
);

/** Szene 3: Die Bilanz laut Polizei/Innenministerium – Kacheln rasten im Takt der Stimme ein. */
export const NumbersScene: React.FC<SceneProps> = ({cues}) => {
	const frame = useCurrentFrame();
	const n1 = cue(cues, 'num1', 6);
	const n2 = cue(cues, 'num2', n1.to + 6);
	const at17 = wordFrame(cues, '17', n1.from + 14);
	const at5 = wordFrame(cues, 'fünf', at17 + 30);
	const at54 = wordFrame(cues, '54', n2.from);
	const at100 = wordFrame(cues, 'mindestens', at54 + 25);
	const at87 = wordFrame(cues, '87', at100 + 30);
	const [shops, arrests, injured, reports, removals, checks] = STATS;
	const restAt = at87 + 6;

	return (
		<AbsoluteFill>
			<GridBackdrop accent={COLORS.alert} stops={['#140A22', '#06081A']} particles={20} seed="bilanz" />
			<SafeArea>
				<Kicker text="DIE BILANZ" color={COLORS.alert} delay={0} />
				<div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 28, color: COLORS.textMuted, marginTop: 14}}>laut Polizei und Innenministerium Hessen</div>

				{/* Geschäfte: 17 beschädigt, davon 5 geplündert */}
				<div style={{marginTop: 26}}>
					<PopIn delay={at17 - 4} from="left">
						<div style={{padding: '18px 22px', borderRadius: RADII.md, background: 'rgba(10, 13, 34, 0.92)', border: `2px solid ${withAlpha(shops.accent, 0.6)}`}}>
							<div style={{display: 'flex', alignItems: 'baseline', gap: 18}}>
								<AnimatedNumber value={17} delay={at17} durationInFrames={20} style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 96, color: '#FFB020', lineHeight: 1}} />
								<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 38, color: COLORS.text}}>{shops.label}</span>
							</div>
							<div style={{marginTop: 12}}>
								<ShopRow from={at17 + 4} lootFrom={at5} />
							</div>
							<div
								style={{
									marginTop: 10,
									fontFamily: FONTS.heading,
									fontWeight: 900,
									fontSize: 34,
									color: COLORS.alert,
									opacity: interpolate(frame, [at5, at5 + 10], [0, 1], clamp),
								}}
							>
								davon 5 geplündert
							</div>
						</div>
					</PopIn>
				</div>

				<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 18}}>
					<StatTile s={arrests} delay={at54 - 3} />
					<StatTile s={injured} delay={at100 - 3} />
					<StatTile s={reports} delay={at87 - 3} />
					<StatTile s={removals} delay={restAt} size={60} />
				</div>
				<div style={{marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
					<PopIn delay={restAt + 8}>
						<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 30, color: COLORS.textMuted}}>
							+ {checks.value} {checks.label}
						</span>
					</PopIn>
				</div>
				<div style={{marginTop: 12, opacity: interpolate(frame, [restAt + 10, restAt + 22], [0, 1], clamp)}}>
					<SourceCredit sources={STATS_SOURCE} />
				</div>
			</SafeArea>

			<Sfx name="softImpact" at={at17} />
			<Sfx name="stamp" at={at5 + 2} volume={0.7} />
			<Sfx name="softImpact" at={at54} />
			<Sfx name="softImpact" at={at100} />
			<Sfx name="softImpact" at={at87} />
			<Sfx name="click" at={restAt} />
			<Sfx name="click" at={restAt + 8} />
		</AbsoluteFill>
	);
};
