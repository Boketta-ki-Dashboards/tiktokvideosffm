import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {clamp, EASE_OUT} from '../../../../lib/animation';
import {withAlpha} from '../../../../lib/color';
import {COLORS, FONTS} from '../../../../theme/tokens';
import {cue, type SceneProps, wordFrame} from '../../../frankfurt-2026-10-31/cues';
import {SHOPS} from '../../content';
import {GlassCard, Icon, type IconName, Rise, SectionLabel, SourceLine, StatusRow} from '../kit';
import {Person} from '../Person';
import {Storefront} from '../Storefront';

const AMBER = '#FFD23F';

/** Nächtliche Einkaufsstraße als Kulisse: Backstein, Kopfsteinpflaster, Laternenlicht, Bokeh. */
export const StreetBackdrop: React.FC<{drift: number}> = ({drift}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill
			style={{
				overflow: 'hidden',
				background: 'linear-gradient(180deg, #0B0A1E 0%, #171230 45%, #1E1534 70%, #0C0A18 100%)',
			}}
		>
			<svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0, translate: `${drift}px 0`}}>
				{/* Backsteinwand angedeutet */}
				{new Array(26)
					.fill(true)
					.map((_, r) => new Array(10).fill(true).map((__, c) => <rect key={`${r}-${c}`} x={c * 120 - (r % 2) * 60 - 40} y={180 + r * 46} width={112} height={40} rx={4} fill="#FFFFFF" opacity={0.018 + random(`br-${r}-${c}`) * 0.02} />))}
				{/* Kopfsteinpflaster */}
				<rect x={-60} y={1380} width={1200} height={540} fill="#0E0C1C" />
				{new Array(9).fill(true).map((_, r) =>
					new Array(14).fill(true).map((__, c) => {
						const y = 1400 + r * r * 7 + r * 26;
						const w = 60 + r * 8;
						return <ellipse key={`${r}-${c}`} cx={c * w - (r % 2) * (w / 2)} cy={y} rx={w * 0.42} ry={6 + r * 1.4} fill="#2A2440" opacity={0.6} />;
					}),
				)}
			</svg>
			{/* Laternenlicht */}
			<AbsoluteFill
				style={{
					background: 'radial-gradient(ellipse 50% 30% at 12% 20%, rgba(255,200,120,0.22) 0%, rgba(255,200,120,0) 70%)',
				}}
			/>
			<AbsoluteFill
				style={{
					background: 'radial-gradient(ellipse 50% 28% at 92% 64%, rgba(255,170,90,0.16) 0%, rgba(255,170,90,0) 70%)',
				}}
			/>
			{new Array(10).fill(true).map((_, i) => {
				const s = 60 + random(`sb-s-${i}`) * 120;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: random(`sb-x-${i}`) * 1080 - drift * 1.5,
							top: 1300 + random(`sb-y-${i}`) * 560 + Math.sin((frame + i * 30) / 40) * 8,
							width: s,
							height: s,
							borderRadius: s,
							background: `radial-gradient(circle, ${withAlpha(i % 2 ? '#FFB46A' : '#FFD23F', 0.22)} 0%, rgba(0,0,0,0) 70%)`,
						}}
					/>
				);
			})}
		</AbsoluteFill>
	);
};

/** Mini-Illustration „früher schließen“: Rollladen fährt herunter, Uhrzeiger laufen. */
const Shutter: React.FC<{at: number}> = ({at}) => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [at, at + 40], [0, 0.7], {
		...clamp,
		easing: EASE_OUT,
	});
	const angle = interpolate(frame, [at, at + 40], [0, -120], clamp);
	return (
		<div style={{position: 'relative', width: 230, height: 168}}>
			<Storefront width={230} upper={false} panes={2} motif="fashion" seed="opt-close" />
			<div
				style={{
					position: 'absolute',
					left: 14,
					right: 14,
					top: 44,
					height: 116 * p + 2,
					background: 'repeating-linear-gradient(180deg, #8A93B8 0px, #8A93B8 8px, #6A7398 8px, #6A7398 10px)',
					borderRadius: 3,
					boxShadow: '0 6px 10px rgba(0,0,0,0.4)',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					right: -10,
					top: -14,
					width: 64,
					height: 64,
					borderRadius: 32,
					background: '#FFFFFF',
					border: '4px solid #0B1029',
					boxShadow: '0 6px 16px rgba(0,0,0,0.5)',
				}}
			>
				<div
					style={{
						position: 'absolute',
						left: 28,
						top: 12,
						width: 4,
						height: 20,
						borderRadius: 2,
						background: '#0B1029',
						transformOrigin: '50% 100%',
						rotate: `${angle}deg`,
					}}
				/>
				<div
					style={{
						position: 'absolute',
						left: 28,
						top: 18,
						width: 4,
						height: 14,
						borderRadius: 2,
						background: COLORS.alert,
						transformOrigin: '50% 100%',
						rotate: `${angle / 12 - 40}deg`,
					}}
				/>
			</div>
		</div>
	);
};

/** Mini-Illustration „Security“: anonyme Person mit Warnweste vor dem Eingang. */
const Guard: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<div style={{position: 'relative', width: 230, height: 168}}>
			<Storefront width={230} upper={false} panes={2} motif="sports" seed="opt-sec" light={0.8} />
			<svg width={230} height={168} viewBox="0 0 230 168" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				<Person x={115} y={170} h={150} seed="guard-3" costume="none" step={Math.sin(frame / 20) * 0.2} rim="#FFD23F" />
				<path d="M101 99 L129 99 L127 128 L103 128 Z" fill="#FFD23F" opacity={0.95} />
				<path d="M103 108 H127 M103 118 H127" stroke="#C9CEDF" strokeWidth={2.5} />
			</svg>
			<div
				style={{
					position: 'absolute',
					right: -10,
					top: -14,
					width: 64,
					height: 64,
					borderRadius: 32,
					background: COLORS.cyan,
					border: '4px solid #0B1029',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					boxShadow: '0 6px 16px rgba(0,0,0,0.5)',
				}}
			>
				<Icon name="shield" size={36} color="#0B1029" stroke={2.8} />
			</div>
		</div>
	);
};

const OptionCard: React.FC<{
	at: number;
	label: string;
	icon: IconName;
	children: React.ReactNode;
}> = ({at, label, icon, children}) => (
	<div style={{width: 282, flexShrink: 0}}>
		<Rise at={at} dy={60}>
			<GlassCard padding="18px 10px 16px" style={{width: 282}}>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: 12,
					}}
				>
					{children}
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 6,
							padding: '7px 12px',
							borderRadius: 999,
							background: AMBER,
						}}
					>
						<Icon name={icon} size={22} color="#0B1029" stroke={2.8} />
						<span
							style={{
								fontFamily: FONTS.heading,
								fontWeight: 900,
								fontSize: 23,
								color: '#0B1029',
								whiteSpace: 'nowrap',
							}}
						>
							{label}
						</span>
					</div>
					<span
						style={{
							fontFamily: FONTS.body,
							fontWeight: 700,
							fontSize: 22,
							color: AMBER,
							whiteSpace: 'nowrap',
						}}
					>
						{SHOPS.maybe}
					</span>
				</div>
			</GlassCard>
		</Rise>
	</div>
);

/** Premium-Szene 4 – Läden: detailreiche Ladenfront, Holzplatten werden montiert (belegt) → drei mögliche Vorbereitungen → offen. */
export const ShopsPremium: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const s1 = cue(cues, 'shop1', 6);
	const s2 = cue(cues, 'shop2', s1.to + 6);
	const s3 = cue(cues, 'shop3', s2.to + 6);
	const atBoards = wordFrame(cues, 'Holzplatten', s1.to - 25);
	const optAt = [wordFrame(cues, 'Platten', s2.from + 40), wordFrame(cues, 'Security', s2.from + 55), wordFrame(cues, 'schließen', s2.from + 70)];
	const atOpen = wordFrame(cues, 'offen', s3.to - 12);
	const shrink = interpolate(frame, [s2.from - 6, s2.from + 12], [0, 1], {
		...clamp,
		easing: EASE_OUT,
	});
	const drift = interpolate(frame, [0, durationInFrames], [0, -40]);
	const zoom = interpolate(frame, [0, atBoards], [1.05, 1], clamp);
	const sweep = interpolate(frame, [s1.from + 10, s1.from + 60], [-30, 130], clamp);
	const boarded = frame >= atBoards + 10;
	const stateIn = interpolate(frame, [atBoards + 10, atBoards + 18], [0, 1], clamp);

	return (
		<AbsoluteFill>
			<StreetBackdrop drift={drift} />
			<AbsoluteFill
				style={{
					background: 'linear-gradient(rgba(6,6,20,0.85) 0%, rgba(6,6,20,0.2) 22%, rgba(6,6,20,0) 30%)',
				}}
			/>
			<div style={{position: 'absolute', left: 64, top: 200}}>
				<SectionLabel num="3" text="DRITTENS: DIE LÄDEN" color={AMBER} />
			</div>

			{/* Große Ladenfront (Illustration) */}
			<div
				style={{
					position: 'absolute',
					left: 64,
					width: 866,
					top: 288,
					display: 'flex',
					justifyContent: 'center',
					scale: String((1 - shrink * 0.54) * zoom),
					translate: `0 ${-shrink * 10}px`,
					transformOrigin: '50% 0%',
				}}
			>
				<div
					style={{
						position: 'relative',
						filter: 'drop-shadow(0 40px 50px rgba(0,0,0,0.6))',
					}}
				>
					<Storefront width={700} boardFrom={atBoards - 2} panes={3} motif="shoe" seed="hero" />
					{/* Lichtreflex über die Scheiben (vor den Platten) */}
					{frame < atBoards ? (
						<div
							style={{
								position: 'absolute',
								left: 40,
								right: 40,
								top: 390,
								height: 330,
								overflow: 'hidden',
								borderRadius: 6,
							}}
						>
							<div
								style={{
									position: 'absolute',
									top: -40,
									bottom: -40,
									left: `${sweep}%`,
									width: 90,
									rotate: '16deg',
									background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.35), rgba(255,255,255,0))',
								}}
							/>
						</div>
					) : null}
					{/* Zustandsetikett */}
					<div
						style={{
							position: 'absolute',
							left: -12,
							top: -26,
							display: 'flex',
							alignItems: 'center',
							gap: 8,
							padding: '8px 16px',
							borderRadius: 999,
							background: boarded ? '#C98A4A' : 'rgba(10,12,30,0.9)',
							border: `2px solid ${boarded ? '#FFE0B0' : 'rgba(255,255,255,0.3)'}`,
							boxShadow: '0 10px 24px rgba(0,0,0,0.5)',
							scale: boarded ? String(0.85 + 0.15 * stateIn) : '1',
							opacity: 1 - shrink,
						}}
					>
						<Icon name={boarded ? 'board' : 'store'} size={28} color={boarded ? '#2A1606' : '#FFFFFF'} stroke={2.6} />
						<span
							style={{
								fontFamily: FONTS.heading,
								fontWeight: 900,
								fontSize: 24,
								letterSpacing: 1.5,
								color: boarded ? '#2A1606' : '#FFFFFF',
							}}
						>
							{boarded ? 'GESICHERT' : 'SCHAUFENSTER'}
						</span>
					</div>
				</div>
			</div>
			<div
				style={{
					position: 'absolute',
					left: 64,
					width: 866,
					top: 1066,
					opacity: 1 - shrink,
				}}
			>
				<StatusRow kind="FAKT" text={SHOPS.fact} at={atBoards + 6} />
			</div>
			<div style={{opacity: 1 - shrink}}>
				<SourceLine text={`Quelle: ${SHOPS.factSource} · Illustration`} at={atBoards + 10} top={1192} />
			</div>

			{/* Optionen: mögliche Vorbereitung */}
			{shrink > 0.01 ? (
				<div
					style={{
						position: 'absolute',
						left: 64,
						width: 866,
						top: 656,
						display: 'flex',
						flexDirection: 'column',
						gap: 10,
						opacity: shrink,
					}}
				>
					<div style={{display: 'flex', justifyContent: 'space-between'}}>
						<OptionCard at={optAt[0] - 4} label={SHOPS.options[0].label} icon="board">
							<Storefront width={230} upper={false} panes={2} motif="shoe" seed="opt-boards" boardFrom={optAt[0] + 4} boardStagger={5} />
						</OptionCard>
						<OptionCard at={optAt[1] - 4} label={SHOPS.options[1].label} icon="shield">
							<Guard />
						</OptionCard>
						<OptionCard at={optAt[2] - 4} label={SHOPS.options[2].label} icon="clock">
							<Shutter at={optAt[2]} />
						</OptionCard>
					</div>
					<div
						style={{
							fontFamily: FONTS.body,
							fontWeight: 600,
							fontSize: 22,
							color: COLORS.textMuted,
						}}
					>
						Illustration · mögliche Maßnahmen, keine bestätigten Pläne
					</div>
				</div>
			) : null}

			{/* Offen: konkrete Läden */}
			<div
				style={{
					position: 'absolute',
					left: 64,
					width: 866,
					top: 1018,
					display: 'flex',
					flexDirection: 'column',
					gap: 12,
				}}
			>
				<Rise at={s3.from - 4} dx={-50} dy={0}>
					<GlassCard padding="14px 20px">
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 12,
								flexWrap: 'wrap',
							}}
						>
							{SHOPS.affected.map((n) => (
								<span
									key={n}
									style={{
										padding: '6px 16px',
										borderRadius: 999,
										background: '#FFFFFF',
										fontFamily: FONTS.heading,
										fontWeight: 800,
										fontSize: 27,
										color: '#0B1020',
										boxShadow: `inset 0 -4px 0 ${COLORS.alert}`,
									}}
								>
									{n}
								</span>
							))}
							<span
								style={{
									fontFamily: FONTS.body,
									fontWeight: 700,
									fontSize: 26,
									color: COLORS.text,
								}}
							>
								{SHOPS.affectedNote}
							</span>
						</div>
					</GlassCard>
				</Rise>
				<StatusRow kind="OFFEN" text="Wer was plant: nicht bekannt (Stand 06.11.2026)" at={atOpen - 6} size={28} />
			</div>
		</AbsoluteFill>
	);
};
