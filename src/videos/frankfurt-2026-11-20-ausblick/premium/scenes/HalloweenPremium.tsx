import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, EASE_IN_OUT, springIn} from '../../../../lib/animation';
import {withAlpha} from '../../../../lib/color';
import {useSvgId} from '../../../../lib/svg';
import {COLORS, FONTS} from '../../../../theme/tokens';
import {cue, type SceneProps, wordFrame} from '../../../frankfurt-2026-10-31/cues';
import {HALLOWEEN} from '../../content';
import {GlassCard, Icon, type IconName, Rise, SectionLabel, SourceLine, StatusRow} from '../kit';
import {type Costume, Person} from '../Person';
import {Rain} from '../NightCity';
import {Legibility} from '../Studio';

const ORANGE = '#FF8A2A';
const BLUE = '#8FB4E8';

type Variant = 'halloween' | 'november';

/** Fassadenreihe (generische Altbauten mit Giebeln, keine reale Straße). */
const Facades: React.FC<{v: Variant; id: string}> = ({v, id}) => {
	const frame = useCurrentFrame();
	const warm = v === 'halloween';
	const houses = [
		{x: -40, w: 230, h: 760, gable: 'step'},
		{x: 190, w: 200, h: 700, gable: 'tri'},
		{x: 390, w: 260, h: 800, gable: 'step'},
		{x: 650, w: 210, h: 720, gable: 'flat'},
		{x: 860, w: 260, h: 780, gable: 'tri'},
	];
	const base = 1300;
	return (
		<g>
			{houses.map((hs, i) => {
				const top = base - hs.h;
				const wall = warm ? ['#4A2236', '#5A2A3A', '#3E1E34', '#55283A', '#46203A'][i] : ['#2C3A62', '#334270', '#28365C', '#30406A', '#2A3860'][i];
				const roof = hs.gable === 'tri' ? `M${hs.x} ${top} L${hs.x + hs.w / 2} ${top - 120} L${hs.x + hs.w} ${top} Z` : hs.gable === 'step' ? `M${hs.x} ${top} v-40 h40 v-40 h40 v-40 h${hs.w - 160} v40 h40 v40 h40 v40 Z` : `M${hs.x - 8} ${top} h${hs.w + 16} v-24 h-${hs.w + 16} Z`;
				const cols = Math.floor((hs.w - 30) / 62);
				return (
					<g key={i}>
						<path d={roof} fill={wall} />
						<rect x={hs.x} y={top} width={hs.w} height={hs.h} fill={wall} />
						<rect x={hs.x} y={top} width={hs.w} height={hs.h} fill={`url(#${id}-wallshade)`} />
						{new Array(cols * 6).fill(true).map((_, k) => {
							const c = k % cols;
							const r = Math.floor(k / cols);
							const lit = random(`${v}-w-${i}-${k}`) < (warm ? 0.75 : 0.35);
							const fl = warm ? 0.85 + Math.sin((frame + k * 13) / 9) * 0.08 : 1;
							return (
								<g key={k}>
									<rect x={hs.x + 22 + c * 62} y={top + 40 + r * 108} width={40} height={66} rx={4} fill={lit ? (warm ? '#FFB45A' : '#9CC2F0') : '#141830'} opacity={lit ? 0.85 * fl : 1} />
									<rect x={hs.x + 18 + c * 62} y={top + 106 + r * 108} width={48} height={6} rx={2} fill={withAlpha('#000000', 0.35)} />
								</g>
							);
						})}
						{/* Laden im Erdgeschoss */}
						<rect x={hs.x + 14} y={base - 150} width={hs.w - 28} height={150} rx={6} fill={warm ? '#FFCF8A' : '#7FA6D8'} opacity={warm ? 0.55 : 0.35} />
						<rect x={hs.x + 14} y={base - 176} width={hs.w - 28} height={22} rx={4} fill={warm ? '#2A1020' : '#18223E'} />
					</g>
				);
			})}
		</g>
	);
};

/** Lichterkette mit Mini-Kürbissen (nur Halloween). */
const Garland: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<g>
			{[0, 1].map((row) => {
				const y0 = 640 + row * 110;
				const pts = new Array(13).fill(true).map((_, k) => {
					const x = k * 90;
					return {x, y: y0 + Math.sin((k / 12) * Math.PI * 2) * 22 + 30};
				});
				return (
					<g key={row}>
						<path d={`M-20 ${y0} Q270 ${y0 + 90} 540 ${y0 + 30} T1100 ${y0}`} stroke="#1A0C10" strokeWidth={3} fill="none" />
						{pts.map((p, k) => {
							const on = Math.floor((frame + k * 3 + row * 5) / 12) % 3 !== 0;
							const y = row === 0 ? y0 + 30 + Math.sin(((p.x + 20) / 1120) * Math.PI) * 40 : p.y;
							return k % 3 === 1 ? (
								<g key={k} transform={`translate(${p.x} ${y + 8})`}>
									<ellipse rx={14} ry={11} fill="#F07A1E" />
									<path d="M-6 -2 l3 -4 l3 4 z M3 -2 l3 -4 l3 4 z M-6 4 q6 4 12 0" fill="#FFE38A" />
									<rect x={-2} y={-15} width={4} height={5} fill="#3A5A1E" />
								</g>
							) : (
								<circle key={k} cx={p.x} cy={y} r={7} fill={on ? '#FFC46A' : '#7A4A2A'} style={{filter: on ? 'drop-shadow(0 0 8px #FFB040)' : undefined}} />
							);
						})}
					</g>
				);
			})}
		</g>
	);
};

const COSTUMES: Costume[] = ['witch', 'cat', 'devil', 'skeleton', 'ghost', 'none', 'cat', 'witch', 'none'];
const NOV: Costume[] = ['umbrella', 'hood', 'scarf', 'umbrella', 'none', 'scarf'];

/** Komplette Straßenszene in einer Variante (immer volle 1080 px – keine Verzerrung). */
const Street: React.FC<{v: Variant; density: number; appear: number}> = ({v, density, appear}) => {
	const frame = useCurrentFrame();
	const id = useSvgId(`street-${v}`);
	const warm = v === 'halloween';
	const n = warm ? 34 : 7;
	const people = new Array(n).fill(true).map((_, i) => {
		const depth = random(`${v}-d-${i}`);
		return {
			i,
			depth,
			x: 40 + random(`${v}-x-${i}`) * 1000,
			y: 1330 + depth * 420,
			h: 150 + depth * 170,
		};
	});
	people.sort((a, b) => a.depth - b.depth);
	return (
		<svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
			<defs>
				<linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={warm ? '#12051A' : '#081026'} />
					<stop offset="0.7" stopColor={warm ? '#4A1626' : '#1C2A50'} />
					<stop offset="1" stopColor={warm ? '#8A3222' : '#2A3A62'} />
				</linearGradient>
				<linearGradient id={`${id}-wallshade`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#000000" stopOpacity={0.35} />
					<stop offset="1" stopColor="#000000" stopOpacity={0} />
				</linearGradient>
				<linearGradient id={`${id}-ground`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={warm ? '#6A3424' : '#2A3658'} />
					<stop offset="1" stopColor={warm ? '#2A120E' : '#0E1428'} />
				</linearGradient>
				<radialGradient id={`${id}-pool`}>
					<stop offset="0" stopColor={warm ? '#FFB45A' : '#9CC2F0'} stopOpacity={warm ? 0.45 : 0.3} />
					<stop offset="1" stopColor={warm ? '#FFB45A' : '#9CC2F0'} stopOpacity={0} />
				</radialGradient>
			</defs>
			<rect width={1080} height={1920} fill={`url(#${id}-sky)`} />
			<Facades v={v} id={id} />
			{warm ? <Garland /> : null}
			{/* Straße + Lichtpfützen */}
			<rect y={1300} width={1080} height={620} fill={`url(#${id}-ground)`} />
			{[0, 1, 2, 3, 4, 5].map((k) => (
				<line key={k} x1={540} y1={1300} x2={-500 + k * 420} y2={1920} stroke={withAlpha('#000000', 0.25)} strokeWidth={3} />
			))}
			{[150, 540, 930].map((x) => (
				<ellipse key={x} cx={x} cy={1420} rx={260} ry={60} fill={`url(#${id}-pool)`} />
			))}
			{!warm
				? [0, 1, 2, 3, 4].map((k) => (
						<rect key={k} x={60 + k * 210 + Math.sin(frame / 30 + k) * 6} y={1500 + (k % 2) * 120} width={110} height={6} rx={3} fill="#9CC2F0" opacity={0.25} />
					))
				: null}
			{warm
				? [0.08, 0.5, 0.9].map((f, k) => (
						<g key={f} transform={`translate(${f * 1080} ${1325 + k * 8}) scale(1.6)`}>
							<ellipse rx={30} ry={22} fill="#F07A1E" />
							<ellipse cx={-12} rx={12} ry={21} fill="#E06A12" />
							<ellipse cx={12} rx={12} ry={21} fill="#E06A12" />
							<path d="M-12 -5 l5 -7 l5 7 z M7 -5 l5 -7 l5 7 z M-12 7 q12 9 24 0 q-12 4 -24 0" fill="#FFE38A" />
							<rect x={-3} y={-28} width={6} height={8} rx={2} fill="#3A5A1E" />
						</g>
					))
				: null}
			{/* Menschen (Tiefe: hinten klein/hell, vorne groß) */}
			{people.map((p) => {
				if (p.i >= Math.round(n * density)) return null;
				const o = interpolate(frame, [appear + p.i * 1.5, appear + p.i * 1.5 + 8], [0, 1], clamp);
				const walk = (frame + p.i * 11) / (warm ? 5 : 7);
				const drift = warm ? Math.sin((frame + p.i * 30) / 40) * 10 : ((frame * (0.6 + random(`${v}-sp-${p.i}`)) + p.x) % 1200) - 60 - p.x;
				return (
					<g key={p.i} opacity={o}>
						<Person
							x={p.x + drift}
							y={p.y}
							h={p.h}
							seed={`${v}-p-${p.i}`}
							costume={warm ? COSTUMES[p.i % COSTUMES.length] : NOV[p.i % NOV.length]}
							step={warm ? walk * 0.3 : walk}
							light={warm ? '#FF9A4A' : '#3A5A9A'}
							lightAmount={warm ? 0.18 + (1 - p.depth) * 0.2 : 0.2 + (1 - p.depth) * 0.25}
							rim={warm ? '#FFC46A' : '#BFD8FF'}
							dir={random(`${v}-dir-${p.i}`) > 0.5 ? 1 : -1}
						/>
					</g>
				);
			})}
			{/* Dunst */}
			<rect y={1180} width={1080} height={300} fill={warm ? '#FF8A4A' : '#7A9AD0'} opacity={0.08} />
		</svg>
	);
};

const Tag: React.FC<{text: string; color: string; icon: IconName; dark?: boolean}> = ({text, color, icon, dark}) => (
	<div style={{display: 'inline-flex', alignItems: 'center', gap: 10, padding: '9px 16px 9px 10px', borderRadius: 999, background: withAlpha(color, 0.95), boxShadow: `0 10px 26px ${withAlpha('#000000', 0.45)}`}}>
		<div style={{width: 38, height: 38, borderRadius: 19, background: dark ? '#0B1029' : 'rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
			<Icon name={icon} size={24} color={dark ? color : '#1A0E0A'} stroke={2.6} />
		</div>
		<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 25, color: '#140C10', whiteSpace: 'nowrap'}}>{text}</span>
	</div>
);

const DateCard: React.FC<{date: string; label: string; color: string; icon: IconName}> = ({date, label, color, icon}) => (
	<GlassCard padding="16px 24px 18px" accent={color}>
		<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
			<Icon name={icon} size={52} color={color} stroke={2.2} />
			<div>
				<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 80, lineHeight: 0.95, color, letterSpacing: -1}}>{date}</div>
				<div style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 28, color: COLORS.text}}>{label}</div>
			</div>
		</div>
	</GlassCard>
);

/** Premium-Szene 2 – Halloween-Faktor: dieselbe Straße zweimal (31.10. warm/voll vs. 20.11. kühl/Alltag) mit Schieberegler-Wipe. */
export const HalloweenPremium: React.FC<SceneProps> = ({cues, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const a1 = cue(cues, 'hal1', 6);
	const a2 = cue(cues, 'hal2', a1.to + 6);
	const a3 = cue(cues, 'hal3', a2.to + 6);
	const at31 = wordFrame(cues, '31', a1.from + 20);
	const atCostume = wordFrame(cues, 'verkleidet', a1.to - 20);
	const atNot = wordFrame(cues, 'Randalierer', a2.from + 10);
	const atFull = wordFrame(cues, 'voll', a2.from + Math.round((a2.to - a2.from) * 0.6));
	const atNoFuss = wordFrame(cues, 'Trubel', a3.from + 14);
	const atOverview = wordFrame(cues, 'überblicken', a3.to - 20);
	const split = interpolate(frame, [a3.from - 8, a3.from + 10], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const leftDense = interpolate(frame, [at31, atCostume + 10], [0.3, 1], clamp);
	const knob = springIn({frame, fps, delay: a3.from - 6, damping: 15});
	const divider = 1080 - 540 * split;
	const push = interpolate(frame, [0, durationInFrames], [1.06, 1], clamp);
	const icons: IconName[] = ['megaphone', 'sparkle', 'wave'];

	return (
		<AbsoluteFill style={{backgroundColor: '#07060C', overflow: 'hidden'}}>
			<AbsoluteFill style={{scale: String(push), transformOrigin: '50% 70%'}}>
				<Street v="halloween" density={leftDense} appear={a1.from} />
				{split > 0 ? (
					<AbsoluteFill style={{clipPath: `inset(0 0 0 ${divider}px)`}}>
						<Street v="november" density={1} appear={a3.from - 8} />
						<Rain amount={0.9} seed="hal-rain" />
					</AbsoluteFill>
				) : null}
			</AbsoluteFill>
			<Legibility topStrength={0.9} subtitleBand={0.3} />

			{/* Schieberegler-Trennlinie */}
			{split > 0 ? (
				<>
					<div style={{position: 'absolute', left: divider - 2, top: 0, width: 4, height: 1920, background: 'linear-gradient(180deg, rgba(255,255,255,0.2), #FFFFFF 40%, rgba(255,255,255,0.2))', boxShadow: '0 0 24px rgba(255,255,255,0.6)'}} />
					<div style={{position: 'absolute', left: divider - 38, top: 1200, width: 76, height: 76, borderRadius: 38, background: '#FFFFFF', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', scale: String(knob)}}>
						<svg width={44} height={24} viewBox="0 0 44 24">
							<path d="M14 4 L4 12 L14 20 M30 4 L40 12 L30 20" stroke="#0B1029" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</div>
				</>
			) : null}

			<div style={{position: 'absolute', left: 64, top: 200}}>
				<SectionLabel num="1" text="ERSTENS: HALLOWEEN" color={ORANGE} />
			</div>

			{/* Datumskarten */}
			<div style={{position: 'absolute', left: 64, top: 296}}>
				<Rise at={at31 - 4} dx={-60} dy={0}>
					<DateCard date={HALLOWEEN.left.date} label={HALLOWEEN.left.label} color={ORANGE} icon="pumpkin" />
				</Rise>
			</div>
			{split > 0.05 ? (
				<div style={{position: 'absolute', left: 584, top: 296, opacity: split, translate: `${(1 - split) * 80}px 0`}}>
					<DateCard date={HALLOWEEN.right.date} label={HALLOWEEN.right.label} color={BLUE} icon="calendar" />
				</div>
			) : null}

			{/* Merkmale */}
			<div style={{position: 'absolute', left: 64, top: 482, width: 470, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12}}>
				{HALLOWEEN.left.tags.map((t, i) => (
					<Rise key={t} at={[at31 + 4, atCostume, atFull][i]} dx={-50} dy={0}>
						<Tag text={t} color={ORANGE} icon={icons[i]} />
					</Rise>
				))}
			</div>
			{split > 0.05 ? (
				<div style={{position: 'absolute', left: 584, top: 482, width: 346, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12, opacity: split}}>
					{HALLOWEEN.right.tags.map((t, i) => (
						<Rise key={t} at={atNoFuss + i * 6} dx={50} dy={0}>
							<Tag text={t} color={BLUE} icon={i === 0 ? 'pumpkin' : 'clock'} />
						</Rise>
					))}
				</div>
			) : null}

			{/* Klarstellung: Kostüm ≠ Täter */}
			{frame >= atNot - 4 && frame < a3.from ? (
				<div style={{position: 'absolute', left: 64, width: 866, top: 1000, display: 'flex', justifyContent: 'center'}}>
					<Rise at={atNot - 4} dy={40}>
						<GlassCard padding="18px 34px" style={{borderRadius: 999}}>
							<div style={{display: 'flex', alignItems: 'center', gap: 22, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 52, color: COLORS.text}}>
								<span>{HALLOWEEN.disclaimer.split('≠')[0].trim()}</span>
								<span style={{width: 70, height: 70, borderRadius: 35, background: COLORS.signal, color: '#0B1029', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 50}}>≠</span>
								<span>{HALLOWEEN.disclaimer.split('≠')[1].trim()}</span>
							</div>
						</GlassCard>
					</Rise>
				</div>
			) : null}
			<div style={{position: 'absolute', left: 64, width: 866, top: 1030}}>
				<StatusRow kind="EINSCHÄTZUNG" text={HALLOWEEN.opinion} at={atOverview - 6} />
			</div>
			<SourceLine text={`Quelle: ${HALLOWEEN.source}`} at={a2.from} top={1172} />
		</AbsoluteFill>
	);
};
