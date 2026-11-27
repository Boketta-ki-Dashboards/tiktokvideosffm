import React, {useMemo} from 'react';
import {random, useCurrentFrame} from 'remotion';
import {withAlpha} from '../../../lib/color';
import {useSvgId} from '../../../lib/svg';
import {COLORS, FONTS} from '../../../theme/tokens';

/**
 * Illustrationen #18 (eigene Vektorgrafik, stilisiert, ohne Logos, ohne erkennbare Personen):
 * Gewerkschaftshaus am Abend (`UnionHouse`), Saal mit Stuhlkreis und Flipchart (`MeetingRoom`), neutrales Handy mit nachgebautem
 * Bildbeitrag (`PostPhone`, KEIN Screenshot, keine App-Marke), Ordnerweste, Technik, Route mit Fragezeichen, geschlossener Gruppenchat
 * und zwei Strukturen mit Verbindungslinie (`StructureLink`).
 */

const WARM = '#FFD27A';
const YELLOW = COLORS.signal;

/* ------------------------------------------------------------------ Gewerkschaftshaus (Außenansicht, Abend) */

export const UnionHouse: React.FC<{width: number; lit?: number; saal?: number; label?: string; arrivals?: number; seed?: string}> = ({width, lit = 0.5, saal = 0, label = 'DGB-HAUS', arrivals = 0, seed = 'uh'}) => {
	const frame = useCurrentFrame();
	const id = useSvgId('uh');
	const W = 640;
	const H = 470;
	const cols = 13;
	const rows = 6;
	const win = useMemo(() => new Array(rows * cols).fill(0).map((_, i) => random(`${seed}-w-${i}`)), [seed]);
	const walkers = [0, 1, 2, 3];
	return (
		<svg width={width} height={(width * H) / W} viewBox={`0 0 ${W} ${H}`} style={{overflow: 'visible'}}>
			<defs>
				<linearGradient id={`${id}-wall`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#39407A" />
					<stop offset="1" stopColor="#232858" />
				</linearGradient>
				<linearGradient id={`${id}-side`} x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor="#1B1F46" />
					<stop offset="1" stopColor="#12153A" />
				</linearGradient>
				<radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
					<stop offset="0" stopColor={withAlpha(WARM, 0.55)} />
					<stop offset="1" stopColor={withAlpha(WARM, 0)} />
				</radialGradient>
			</defs>
			{/* Seitenflügel (Tiefe) */}
			<path d="M520 70 L600 98 L600 420 L520 420 Z" fill={`url(#${id}-side)`} />
			{new Array(6).fill(0).map((_, r) => (
				<g key={`s-${r}`}>
					{[0, 1].map((c) => (
						<path key={c} d={`M${532 + c * 32} ${118 + r * 46 + c * 6} l22 7 v26 l-22 -7 Z`} fill={win[r * 2 + c] < lit * 0.7 ? withAlpha(WARM, 0.75) : '#262B5C'} />
					))}
				</g>
			))}
			{/* Hauptbau */}
			<rect x={40} y={70} width={480} height={350} fill={`url(#${id}-wall)`} />
			<rect x={34} y={62} width={492} height={14} fill="#4A529A" />
			{/* Schriftband (neutrale Beschriftung, kein Logo) */}
			<rect x={190} y={28} width={180} height={36} rx={6} fill="#10132E" stroke={withAlpha(WARM, 0.6)} strokeWidth={2} />
			<text x={280} y={54} textAnchor="middle" fontFamily={FONTS.heading} fontWeight={900} fontSize={22} letterSpacing={3} fill={WARM}>
				{label}
			</text>
			{/* Fensterraster */}
			{new Array(rows).fill(0).map((_, r) =>
				new Array(cols).fill(0).map((__, c) => {
					const v = win[r * cols + c];
					const on = v < lit;
					const flick = on ? 0.82 + 0.18 * Math.sin((frame + v * 90) / 23) : 1;
					return <rect key={`${r}-${c}`} x={58 + c * 35.5} y={90 + r * 46} width={24} height={30} rx={2} fill={on ? withAlpha(WARM, 0.85 * flick) : '#1D2252'} />;
				}),
			)}
			{/* Saal (breites Fenster im 1. OG) */}
			<rect x={300} y={320} width={196} height={42} rx={4} fill={withAlpha(WARM, 0.25 + 0.7 * saal)} stroke={withAlpha(WARM, saal)} strokeWidth={3} />
			{saal > 0.05 ? <ellipse cx={398} cy={341} rx={180 * saal} ry={70 * saal} fill={`url(#${id}-glow)`} /> : null}
			{/* Eingang mit Vordach */}
			<rect x={70} y={366} width={200} height={54} fill="#14173A" />
			<rect x={60} y={356} width={220} height={12} rx={3} fill="#4A529A" />
			<rect x={140} y={374} width={60} height={46} fill={withAlpha(WARM, 0.75)} />
			<line x1={170} y1={374} x2={170} y2={420} stroke="#14173A" strokeWidth={3} />
			{/* Gehweg, Laternen, Bäume */}
			<rect x={-40} y={420} width={720} height={50} fill="#171A36" />
			<rect x={-40} y={420} width={720} height={5} fill="#2A2F5C" />
			{[20, 330, 610].map((x) => (
				<g key={x}>
					<rect x={x} y={340} width={5} height={82} fill="#4A4F72" />
					<circle cx={x + 2.5} cy={338} r={8} fill={WARM} />
					<circle cx={x + 2.5} cy={338} r={26} fill={withAlpha(WARM, 0.14)} />
				</g>
			))}
			{/* Ankommende Personen (stilisiert, anonym) */}
			{walkers.map((i) => {
				const t = Math.max(0, Math.min(1, arrivals * 1.4 - i * 0.22));
				if (t <= 0) return null;
				const x = 640 - t * (470 - i * 18);
				const bob = Math.abs(Math.sin((frame + i * 7) / 4)) * 3;
				return (
					<g key={i} transform={`translate(${x} ${440 - bob})`} opacity={Math.min(1, t * 3) * (t > 0.95 ? Math.max(0, 1 - (t - 0.95) * 20) : 1)}>
						<circle cx={0} cy={-46} r={8} fill="#0C0F26" />
						<rect x={-9} y={-38} width={18} height={30} rx={8} fill="#0C0F26" />
						<rect x={-8} y={-10} width={6} height={18} rx={3} fill="#0C0F26" />
						<rect x={2} y={-10} width={6} height={18} rx={3} fill="#0C0F26" />
					</g>
				);
			})}
		</svg>
	);
};

/* ------------------------------------------------------------------ Saal mit Stuhlkreis und Flipchart */

export const MeetingRoom: React.FC<{width: number; people?: number; flip?: number; items: readonly string[]; door?: string; dim?: number}> = ({width, people = 1, flip = 1, items, door = 'SAAL A', dim = 0}) => {
	const frame = useCurrentFrame();
	const id = useSvgId('mr');
	const W = 760;
	const H = 560;
	// Stühle auf einer Ellipse (Blick leicht von oben)
	const seats = new Array(11).fill(0).map((_, i) => {
		const a = Math.PI * (0.08 + (i / 10) * 0.84);
		return {i, x: 330 + Math.cos(a) * 250, y: 400 + Math.sin(a) * 96, back: Math.sin(a) > 0.5};
	});
	const tones = ['#5D6BC4', '#C46A8E', '#4FA3A5', '#B7905A', '#7C6CC4', '#5FA06B'];
	return (
		<svg width={width} height={(width * H) / W} viewBox={`0 0 ${W} ${H}`}>
			<defs>
				<radialGradient id={`${id}-lamp`} cx="45%" cy="10%" r="80%">
					<stop offset="0" stopColor={withAlpha(WARM, 0.35)} />
					<stop offset="1" stopColor={withAlpha(WARM, 0)} />
				</radialGradient>
				<linearGradient id={`${id}-floor`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#2A2E58" />
					<stop offset="1" stopColor="#1A1D3E" />
				</linearGradient>
			</defs>
			{/* Rückwand + Boden */}
			<rect x={0} y={0} width={W} height={300} fill="#262B58" />
			<rect x={0} y={300} width={W} height={H - 300} fill={`url(#${id}-floor)`} />
			<rect x={0} y={296} width={W} height={6} fill="#363C74" />
			{/* Fenster (Abend) */}
			{[60, 220].map((x) => (
				<g key={x}>
					<rect x={x} y={60} width={130} height={170} rx={6} fill="#0E1336" stroke="#4A5296" strokeWidth={4} />
					<line x1={x + 65} y1={60} x2={x + 65} y2={230} stroke="#4A5296" strokeWidth={3} />
					{[0, 1, 2].map((k) => (
						<rect key={k} x={x + 14 + k * 36} y={200 - k * 40} width={18} height={30 + k * 40} fill="#1C2458" />
					))}
				</g>
			))}
			{/* Türschild */}
			<rect x={400} y={70} width={150} height={44} rx={8} fill="#0E1130" stroke={withAlpha(YELLOW, 0.8)} strokeWidth={3} />
			<text x={475} y={101} textAnchor="middle" fontFamily={FONTS.heading} fontWeight={900} fontSize={24} letterSpacing={2} fill={YELLOW}>
				{door}
			</text>
			{/* Lampenlicht */}
			<rect x={0} y={0} width={W} height={H} fill={`url(#${id}-lamp)`} />
			{/* Flipchart */}
			<g transform="translate(600 120)">
				<line x1={20} y1={260} x2={60} y2={20} stroke="#8A8FA8" strokeWidth={6} />
				<line x1={120} y1={260} x2={80} y2={20} stroke="#8A8FA8" strokeWidth={6} />
				<rect x={0} y={0} width={140} height={190} rx={4} fill="#F4F1E8" />
				{items.map((t, i) => {
					const on = Math.max(0, Math.min(1, flip * items.length - i));
					return (
						<g key={t} opacity={on}>
							<rect x={12} y={22 + i * 40} width={18} height={18} rx={3} fill="none" stroke="#2A2F48" strokeWidth={2.5} />
							<text x={40} y={38 + i * 40} fontFamily={FONTS.heading} fontWeight={900} fontSize={19} fill="#1B1F36">
								{t}
							</text>
							<text x={122} y={38 + i * 40} textAnchor="end" fontFamily={FONTS.heading} fontWeight={900} fontSize={20} fill="#D93448">
								?
							</text>
						</g>
					);
				})}
			</g>
			{/* Stuhlkreis mit anonymen Figuren */}
			{seats
				.slice()
				.sort((a, b) => a.y - b.y)
				.map((s) => {
					const filled = random(`mr-p-${s.i}`) < 0.78;
					const show = Math.max(0, Math.min(1, people * 12 - s.i * 0.9));
					const tone = tones[s.i % tones.length];
					const sway = Math.sin((frame + s.i * 11) / 18) * 1.5;
					return (
						<g key={s.i} transform={`translate(${s.x} ${s.y})`}>
							<rect x={-22} y={-8} width={44} height={10} rx={4} fill="#3B4272" />
							<rect x={-20} y={2} width={4} height={26} fill="#2A2F58" />
							<rect x={16} y={2} width={4} height={26} fill="#2A2F58" />
							{filled ? (
								<g opacity={show} transform={`translate(${sway} 0)`}>
									<rect x={-17} y={-54} width={34} height={50} rx={14} fill={tone} />
									<circle cx={0} cy={-66} r={14} fill="#0E1130" />
								</g>
							) : null}
							{s.back ? <rect x={-22} y={-40} width={44} height={8} rx={3} fill="#3B4272" opacity={0.9} /> : null}
						</g>
					);
				})}
			{dim > 0 ? <rect x={0} y={0} width={W} height={H} fill={`rgba(6,8,24,${0.55 * dim})`} /> : null}
		</svg>
	);
};

/* ------------------------------------------------------------------ Handy mit nachgebautem Bildbeitrag */

export const PostPhone: React.FC<{width?: number; page?: number; lines: {headline: string; quote: string; dates: readonly string[]; tag: string}}> = ({width = 400, page = 0, lines}) => {
	const frame = useCurrentFrame();
	const s = width / 400;
	return (
		<div style={{width, height: 820 * s, position: 'relative'}}>
			<div style={{position: 'absolute', left: 0, top: 0, width: 400, height: 820, scale: String(s), transformOrigin: '0 0'}}>
				<div style={{position: 'absolute', inset: 0, borderRadius: 64, background: 'linear-gradient(145deg, #5A6078 0%, #23263A 40%, #3C4258 100%)', boxShadow: '0 40px 90px rgba(0,0,0,0.6)'}} />
				<div style={{position: 'absolute', left: 18, top: 18, width: 364, height: 784, borderRadius: 48, overflow: 'hidden', background: '#0B0E22'}}>
					{/* Nachgebauter Bildbeitrag – eigene Gestaltung, kein Screenshot */}
					<div style={{position: 'absolute', left: 0, top: 0, width: 364 * 2, height: 784, display: 'flex', translate: `${-page * 364}px 0`}}>
						<div style={{position: 'relative', width: 364, height: 784, background: 'linear-gradient(170deg, #2A2F12 0%, #1A1D0C 100%)', padding: '120px 26px 0', boxSizing: 'border-box'}}>
							<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 22, letterSpacing: 2, color: YELLOW}}>KRITIK</div>
							<div style={{marginTop: 10, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, lineHeight: 1.08, color: '#FFFFFF'}}>{lines.quote}</div>
							<div style={{marginTop: 16, display: 'flex', gap: 10}}>
								{lines.dates.map((d) => (
									<span key={d} style={{padding: '4px 12px', borderRadius: 10, border: `2.5px solid ${YELLOW}`, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 22, color: YELLOW}}>
										{d}
									</span>
								))}
							</div>
							{[0.92, 0.8, 0.88, 0.62, 0.84, 0.5].map((w, i) => (
								<div key={i} style={{marginTop: i === 0 ? 26 : 12, height: 12, borderRadius: 6, width: `${w * 100}%`, background: withAlpha('#FFFFFF', 0.22)}} />
							))}
							<div style={{position: 'absolute', left: 26, right: 80, bottom: 120, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 46, lineHeight: 0.95, color: YELLOW}}>{lines.tag}</div>
						</div>
						<div style={{width: 364, height: 784, background: 'linear-gradient(170deg, #12163A 0%, #0B0E22 100%)', padding: '130px 26px 0', boxSizing: 'border-box'}}>
							<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 22, letterSpacing: 2, color: YELLOW}}>EINLADUNG</div>
							<div style={{marginTop: 10, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 36, lineHeight: 1.05, color: '#FFFFFF'}}>OFFENES PLANUNGS-TREFFEN</div>
							<div style={{marginTop: 18, fontFamily: FONTS.body, fontWeight: 800, fontSize: 24, lineHeight: 1.35, color: COLORS.textMuted}}>Di 24.11. · 19 Uhr<br />DGB-Haus · Saal A</div>
							<div style={{marginTop: 26, padding: '8px 14px', borderRadius: 12, background: withAlpha(YELLOW, 0.14), border: `2px solid ${YELLOW}`, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 22, color: YELLOW}}>Demo 12.12. · 14 Uhr · Gallusanlage</div>
						</div>
					</div>
					{/* neutrale App-Oberfläche (kein Logo) */}
					<div style={{position: 'absolute', top: 56, left: 20, right: 20, display: 'flex', alignItems: 'center', gap: 10}}>
						<div style={{width: 40, height: 40, borderRadius: 20, background: '#3A3F5E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 22, color: '#9AA3BF'}}>?</div>
						<span style={{fontFamily: FONTS.body, fontWeight: 800, fontSize: 17, color: '#C9CEE2'}}>Frankfurter Gruppe</span>
						<span style={{marginLeft: 'auto', fontFamily: FONTS.body, fontWeight: 700, fontSize: 14, color: '#9AA3BF'}}>Nachbildung</span>
					</div>
					<div style={{position: 'absolute', right: 14, bottom: 150, display: 'flex', flexDirection: 'column', gap: 22, alignItems: 'center'}}>
						{['♥', '✎', '➦'].map((c, i) => (
							<div key={c} style={{width: 46, height: 46, borderRadius: 23, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: 22, opacity: 0.75 + 0.25 * Math.sin((frame + i * 10) / 12)}}>
								{c}
							</div>
						))}
					</div>
					<div style={{position: 'absolute', bottom: 40, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 8}}>
						{[0, 1].map((i) => (
							<div key={i} style={{width: 10, height: 10, borderRadius: 5, background: Math.round(page) === i ? '#FFFFFF' : 'rgba(255,255,255,0.35)'}} />
						))}
					</div>
				</div>
				<div style={{position: 'absolute', left: '50%', top: 30, translate: '-50% 0', width: 120, height: 34, borderRadius: 18, background: '#000'}} />
			</div>
		</div>
	);
};

/* ------------------------------------------------------------------ Planungs-Symbole */

/** Ordnerweste (Warnweste ohne Aufschrift-Logo). */
export const Vest: React.FC<{size: number; color?: string}> = ({size, color = '#FFB547'}) => (
	<svg width={size} height={size} viewBox="0 0 120 120">
		<path d="M38 12 L50 12 Q60 30 70 12 L82 12 L100 30 L96 108 L64 108 L64 52 L56 52 L56 108 L24 108 L20 30 Z" fill={color} stroke="#7A4A10" strokeWidth={3} strokeLinejoin="round" />
		<rect x={24} y={70} width={32} height={9} fill="#E8EEF8" />
		<rect x={64} y={70} width={32} height={9} fill="#E8EEF8" />
		<rect x={25} y={88} width={31} height={9} fill="#E8EEF8" />
		<rect x={64} y={88} width={31} height={9} fill="#E8EEF8" />
	</svg>
);

/** Technik: Lautsprecher + Mikrofon. */
export const Tech: React.FC<{size: number; color?: string; level?: number}> = ({size, color = '#46C2FF', level = 0}) => (
	<svg width={size} height={size} viewBox="0 0 120 120">
		<rect x={14} y={22} width={50} height={84} rx={8} fill="#1C2148" stroke={color} strokeWidth={3.5} />
		<circle cx={39} cy={50} r={11} fill="none" stroke={color} strokeWidth={3.5} />
		<circle cx={39} cy={82} r={16} fill="none" stroke={color} strokeWidth={3.5} />
		<circle cx={39} cy={82} r={5 + level * 4} fill={color} />
		<rect x={80} y={18} width={18} height={34} rx={9} fill="none" stroke={color} strokeWidth={3.5} />
		<path d="M74 44 Q89 64 104 44" fill="none" stroke={color} strokeWidth={3.5} strokeLinecap="round" />
		<line x1={89} y1={58} x2={89} y2={100} stroke={color} strokeWidth={3.5} strokeLinecap="round" />
		<line x1={76} y1={102} x2={102} y2={102} stroke={color} strokeWidth={3.5} strokeLinecap="round" />
	</svg>
);

/** Route mit Fragezeichen (kein echter Verlauf). */
export const RouteMark: React.FC<{size: number; color?: string; draw?: number}> = ({size, color = '#FF9F43', draw = 1}) => {
	const len = 220;
	return (
		<svg width={size} height={size} viewBox="0 0 120 120">
			<rect x={8} y={8} width={104} height={104} rx={14} fill="#1C2148" stroke={withAlpha('#FFFFFF', 0.25)} strokeWidth={2} />
			<path d="M8 44 H112 M8 80 H112 M44 8 V112 M80 8 V112" stroke={withAlpha('#FFFFFF', 0.08)} strokeWidth={6} />
			<path d="M22 96 C 40 92, 34 62, 58 60 S 84 30, 98 24" fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" strokeDasharray={`10 8`} strokeDashoffset={0} style={{strokeDasharray: `${len * draw} ${len}`}} />
			<circle cx={22} cy={96} r={7} fill={color} />
			<text x={92} y={70} textAnchor="middle" fontFamily={FONTS.heading} fontWeight={900} fontSize={40} fill={YELLOW} opacity={draw}>
				?
			</text>
		</svg>
	);
};

/** Gruppenchat mit Schloss (geschlossen) – neutrales Sprechblasen-Symbol, keine App-Marke. */
export const ChatLock: React.FC<{size: number; color?: string; lock?: number}> = ({size, color = '#46C2FF', lock = 1}) => (
	<svg width={size} height={size} viewBox="0 0 140 120">
		<path d="M14 18 Q14 8 24 8 H98 Q108 8 108 18 V64 Q108 74 98 74 H48 L28 92 L30 74 H24 Q14 74 14 64 Z" fill="#1C2148" stroke={color} strokeWidth={4} strokeLinejoin="round" />
		{[26, 42, 58].map((y, i) => (
			<rect key={y} x={28} y={y - 4} width={[62, 48, 30][i]} height={8} rx={4} fill={withAlpha(color, 0.45)} />
		))}
		<g transform={`translate(104 66) scale(${0.6 + 0.4 * lock})`} opacity={lock}>
			<rect x={-20} y={-6} width={40} height={32} rx={6} fill="#FF4D5E" />
			<path d="M-12 -6 V-14 Q-12 -26 0 -26 Q12 -26 12 -14 V-6" fill="none" stroke="#FF4D5E" strokeWidth={6} />
			<circle cx={0} cy={8} r={4.5} fill="#FFFFFF" />
		</g>
	</svg>
);

/** Zwei Strukturen mit (gestrichelter) Verbindung und Fragezeichen. */
export const StructureLink: React.FC<{width: number; left: string; right: string; leftColor: string; rightColor: string; link: number; on: [number, number]}> = ({width, left, right, leftColor, rightColor, link, on}) => {
	const frame = useCurrentFrame();
	const W = 860;
	const H = 300;
	const pulse = 1 + 0.08 * Math.sin(frame / 6);
	const Node: React.FC<{x: number; color: string; label: string; o: number}> = ({x, color, label, o}) => (
		<g transform={`translate(${x} 120)`} opacity={o}>
			<circle r={92} fill={withAlpha(color, 0.12)} />
			<circle r={70} fill="#11153A" stroke={color} strokeWidth={6} />
			{[-26, 0, 26].map((dx, i) => (
				<g key={i} transform={`translate(${dx} ${i === 1 ? -8 : 4})`}>
					<circle cx={0} cy={-14} r={11} fill={color} />
					<rect x={-14} y={0} width={28} height={26} rx={12} fill={color} />
				</g>
			))}
			<text y={130} textAnchor="middle" fontFamily={FONTS.heading} fontWeight={900} fontSize={30} fill={COLORS.text}>
				{label}
			</text>
		</g>
	);
	const x1 = 200;
	const x2 = 660;
	const t = Math.max(0, Math.min(1, link));
	return (
		<svg width={width} height={(width * H) / W} viewBox={`0 0 ${W} ${H}`} style={{overflow: 'visible'}}>
			<line x1={x1 + 96} y1={120} x2={x1 + 96 + (x2 - x1 - 192) * t} y2={120} stroke={withAlpha('#FFFFFF', 0.75)} strokeWidth={7} strokeDasharray="16 12" strokeLinecap="round" />
			<g transform={`translate(${(x1 + x2) / 2} 120) scale(${pulse * t})`} opacity={t}>
				<circle r={36} fill={YELLOW} />
				<text y={15} textAnchor="middle" fontFamily={FONTS.heading} fontWeight={900} fontSize={46} fill="#14141C">
					?
				</text>
			</g>
			<Node x={x1} color={leftColor} label={left} o={on[0]} />
			<Node x={x2} color={rightColor} label={right} o={on[1]} />
		</svg>
	);
};
