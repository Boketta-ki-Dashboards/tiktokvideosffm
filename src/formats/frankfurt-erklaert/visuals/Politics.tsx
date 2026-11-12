import React from 'react';
import {interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, EASE_IN_OUT, EASE_OUT, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {COLORS, FONTS} from '../../../theme/tokens';
import {Icon, type IconName} from '../../../videos/frankfurt-2026-11-20-ausblick/premium/kit';
import {ACCENT} from '../theme';

/**
 * Bausteine für Politik-/Aufarbeitungsfolgen des Formats („76 Fragen“ Teil 1 und 2):
 * stilisierter Landtag, Zähler, Fragen-Nummern, Akte, Kalenderblatt, neutraler Social-Feed.
 * Alles Illustration – keine echten Dokumente, Posts, Logos oder Personen.
 */

/** Stilisierter Landtag (klassizistischer Bau, Illustration, keine exakte Fassade) mit Hessen-Fahne. */
export const Landtag: React.FC<{width: number; light?: number; style?: React.CSSProperties}> = ({width, light = 1, style}) => {
	const frame = useCurrentFrame();
	const W = 1000;
	const H = 600;
	const wave = (x: number) => Math.sin(frame / 6 + x / 18) * 6;
	const flag = `M760 60 ${new Array(9)
		.fill(0)
		.map((_, i) => `L${760 + (i + 1) * 13} ${60 + wave(i * 13)}`)
		.join(' ')} L${760 + 117} ${100 + wave(117)} ${new Array(9)
		.fill(0)
		.map((_, i) => `L${760 + 117 - (i + 1) * 13} ${100 + wave(117 - (i + 1) * 13)}`)
		.join(' ')} Z`;
	const windows: React.ReactNode[] = [];
	for (let f = 0; f < 3; f++) {
		for (let c = 0; c < 14; c++) {
			if (c >= 5 && c <= 8) continue; // Portikus
			const x = 70 + c * 63;
			const y = 250 + f * 95;
			const lit = random(`lt-${f}-${c}`) > 0.3;
			windows.push(
				<g key={`${f}-${c}`}>
					<rect x={x} y={y} width={30} height={f === 0 ? 62 : 56} rx={f === 0 ? 15 : 3} fill={lit ? withAlpha('#FFD58A', 0.55 + 0.35 * light) : '#1A2048'} />
					<rect x={x - 4} y={y - 8} width={38} height={6} fill="#C9C2B2" opacity={0.8} />
				</g>,
			);
		}
	}

	return (
		<svg width={width} height={(width * H) / W} viewBox={`0 0 ${W} ${H}`} style={{overflow: 'visible', ...style}}>
			<defs>
				<linearGradient id="lt-facade" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#E8E1D0" />
					<stop offset="1" stopColor="#9C9584" />
				</linearGradient>
				<radialGradient id="lt-glow" cx="0.5" cy="1" r="0.8">
					<stop offset="0" stopColor="#FFC870" stopOpacity={0.35 * light} />
					<stop offset="1" stopColor="#FFC870" stopOpacity={0} />
				</radialGradient>
			</defs>
			<ellipse cx={500} cy={560} rx={560} ry={180} fill="url(#lt-glow)" />
			{/* Fahnenmast + Hessen-Fahne (rot/weiß) */}
			<line x1={760} y1={50} x2={760} y2={190} stroke="#C9C2B2" strokeWidth={5} />
			<clipPath id="lt-flag">
				<path d={flag} />
			</clipPath>
			<g clipPath="url(#lt-flag)">
				<rect x={755} y={20} width={140} height={60 + 20} fill="#E2232A" transform="translate(0 0)" />
				<rect x={755} y={80} width={140} height={60} fill="#FFFFFF" transform={`translate(0 ${-1})`} />
			</g>
			{/* Dach + Attika */}
			<rect x={30} y={180} width={940} height={26} fill="#5E5A70" />
			{new Array(46).fill(0).map((_, i) => (
				<rect key={i} x={40 + i * 20} y={162} width={8} height={20} fill="#BDB6A6" />
			))}
			<rect x={30} y={158} width={940} height={8} fill="#CFC8B8" />
			{/* Fassade */}
			<rect x={40} y={206} width={920} height={330} fill="url(#lt-facade)" />
			<rect x={40} y={336} width={920} height={6} fill="#B7AF9E" />
			<rect x={40} y={431} width={920} height={6} fill="#B7AF9E" />
			{windows}
			{/* Portikus mit Säulen */}
			<rect x={378} y={190} width={244} height={30} fill="#D9D2C2" />
			<path d="M368 190 L500 128 L632 190 Z" fill="#E6DFCF" stroke="#B7AF9E" strokeWidth={3} />
			{new Array(6).fill(0).map((_, i) => (
				<g key={i}>
					<rect x={386 + i * 42} y={222} width={20} height={300} fill="#F2EDE2" />
					<rect x={382 + i * 42} y={218} width={28} height={8} fill="#CFC8B8" />
				</g>
			))}
			<rect x={455} y={410} width={90} height={126} rx={45} fill="#2A2238" />
			<rect x={455} y={410} width={90} height={126} rx={45} fill={withAlpha('#FFC870', 0.35 * light)} />
			{/* Treppe */}
			<rect x={360} y={536} width={280} height={12} fill="#BDB6A6" />
			<rect x={340} y={548} width={320} height={12} fill="#A9A292" />
			<rect x={0} y={560} width={1000} height={8} fill="#2A2F5E" />
		</svg>
	);
};

/** Großer Zähler (z. B. 0 → 76) mit Leuchten und kurzem „Einrasten“. */
export const BigCount: React.FC<{to: number; at: number; duration?: number; size?: number; color?: string}> = ({to, at, duration = 22, size = 300, color = COLORS.signal}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	if (frame < at - 1) return null;
	const v = Math.round(interpolate(frame, [at, at + duration], [0, to], {...clamp, easing: EASE_OUT}));
	const settle = springIn({frame, fps, delay: at + duration - 2, damping: 9, stiffness: 220});
	const appear = springIn({frame, fps, delay: at, damping: 14, stiffness: 200});
	return (
		<div
			style={{
				fontFamily: FONTS.heading,
				fontWeight: 900,
				fontSize: size,
				lineHeight: 0.9,
				letterSpacing: -size * 0.04,
				color,
				fontVariantNumeric: 'tabular-nums',
				textShadow: `0 0 ${40 + settle * 40}px ${withAlpha(color, 0.65)}, 0 18px 60px rgba(0,0,0,0.6)`,
				scale: String((0.6 + 0.4 * appear) * (1 + (1 - settle) * 0.08 * (frame >= at + duration - 2 ? 1 : 0))),
				opacity: Math.min(1, appear * 2),
			}}
		>
			{v}
		</div>
	);
};

/**
 * Wiederkehrendes Fragen-Element: große Nummer fährt in den Vordergrund (Mitte), danach klein an den Titelplatz oben links;
 * Titel erscheint daneben. `focus()` liefert 1 → 0 (Hintergrund tritt währenddessen zurück).
 */
export const questionFocus = (frame: number, at: number) => 1 - interpolate(frame, [at + 12, at + 30], [0, 1], {...clamp, easing: EASE_IN_OUT});

export const QuestionNumber: React.FC<{num: string; title: string[]; at: number; color: string}> = ({num, title, at, color}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = springIn({frame, fps, delay: at, damping: 13, stiffness: 160});
	const p = interpolate(frame, [at + 12, at + 30], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const t = springIn({frame, fps, delay: at + 24, damping: 15, stiffness: 170});
	// groß: Mitte, klein: oben links (Titelzeile)
	const x = interpolate(p, [0, 1], [540, 64 + 62]);
	const y = interpolate(p, [0, 1], [820, 300 + 62]);
	const scale = interpolate(p, [0, 1], [1, 0.3]) * (0.5 + 0.5 * s);
	return (
		<>
			{p < 1 ? <div style={{position: 'absolute', inset: 0, background: `rgba(4,6,20,${0.55 * (1 - p) * Math.min(1, s * 2)})`}} /> : null}
			<div style={{position: 'absolute', left: x, top: y, translate: '-50% -50%', scale: String(scale), opacity: Math.min(1, s * 2)}}>
				<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 360, lineHeight: 1, letterSpacing: -14, color, textShadow: `0 0 60px ${withAlpha(color, 0.55)}, 0 30px 80px rgba(0,0,0,0.6)`}}>{num}</div>
			</div>
			<div style={{position: 'absolute', left: 64 + 160, top: 300, width: 706, opacity: Math.min(1, t * 2), translate: `${(1 - t) * 40}px 0`}}>
				{title.map((l, i) => (
					<div key={l} style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 58, lineHeight: 1.02, color: i === title.length - 1 ? color : COLORS.text, textShadow: '0 8px 30px rgba(0,0,0,0.75)'}}>
						{l}
					</div>
				))}
			</div>
		</>
	);
};

/** Akte/Mappe mit Reiter-Beschriftung, angedeuteten (unlesbaren) Blättern und Scan-Linie. Keine erfundenen Inhalte. */
export const Dossier: React.FC<{label: string; at: number; width?: number; color?: string; scanFrom?: number; badge?: string}> = ({label, at, width = 560, color = ACCENT.info, scanFrom, badge}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = springIn({frame, fps, delay: at, damping: 14, stiffness: 150});
	const open = interpolate(frame, [at + 8, at + 26], [0, 1], {...clamp, easing: EASE_OUT});
	const scan = scanFrom !== undefined ? ((Math.max(0, frame - scanFrom) % 50) / 50) : -1;
	const h = width * 0.72;
	return (
		<div style={{position: 'relative', width, height: h, opacity: Math.min(1, s * 2), translate: `0 ${(1 - s) * 80}px`, rotate: `${-3 + s * 3}deg`}}>
			{/* Rückwand */}
			<div style={{position: 'absolute', left: 0, top: h * 0.08, width, height: h * 0.92, borderRadius: 18, background: 'linear-gradient(160deg, #2C3566, #1B2148)', border: '2px solid rgba(255,255,255,0.12)'}} />
			<div style={{position: 'absolute', left: 24, top: 0, width: width * 0.42, height: h * 0.16, borderRadius: '14px 14px 0 0', background: '#2C3566', display: 'flex', alignItems: 'center', paddingLeft: 18}}>
				<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: width * 0.042, letterSpacing: 2, color: withAlpha(color, 0.9)}}>AKTE</span>
			</div>
			{/* Blätter (nur Linien, kein Text) */}
			{[0, 1, 2].map((i) => (
				<div key={i} style={{position: 'absolute', left: 40 + i * 12, top: h * 0.12 - open * (40 - i * 12), width: width - 80 - i * 24, height: h * 0.7, borderRadius: 8, background: i === 2 ? '#F4F1EA' : '#DCD7CB', boxShadow: '0 6px 18px rgba(0,0,0,0.3)', overflow: 'hidden'}}>
					{i === 2
						? new Array(7).fill(0).map((_, k) => <div key={k} style={{margin: `${k === 0 ? 26 : 14}px 26px 0`, height: 12, borderRadius: 6, background: '#B9B4A8', width: `${60 + random(`dl-${k}`) * 35}%`, opacity: 0.8}} />)
						: null}
				</div>
			))}
			{/* Vorderklappe mit Beschriftung */}
			<div style={{position: 'absolute', left: 0, top: h * 0.38, width, height: h * 0.62, borderRadius: 18, background: 'linear-gradient(160deg, #36407A, #222A58)', border: `2px solid ${withAlpha(color, 0.6)}`, boxShadow: '0 30px 60px rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<div style={{padding: '12px 26px', border: `3px solid ${color}`, borderRadius: 10, fontFamily: FONTS.heading, fontWeight: 900, fontSize: width * 0.075, letterSpacing: 3, color: COLORS.text}}>{label}</div>
				{badge ? <div style={{position: 'absolute', right: 18, bottom: 14, fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted}}>{badge}</div> : null}
			</div>
			{/* Scan-Linie */}
			{scan >= 0 ? (
				<div style={{position: 'absolute', left: -10, right: -10, top: h * 0.1 + scan * h * 0.85, height: 6, borderRadius: 3, background: color, boxShadow: `0 0 24px 6px ${withAlpha(color, 0.6)}`, opacity: Math.sin(scan * Math.PI)}} />
			) : null}
		</div>
	);
};

/** Abreißkalender-Blatt; klappt bei `at` von `from` auf `to` (Tag + Monat). */
export const CalendarSheet: React.FC<{from?: {day: string; month: string}; to: {day: string; month: string}; at: number; width?: number; accent?: string}> = ({from, to, at, width = 260, accent = ACCENT.brand}) => {
	const frame = useCurrentFrame();
	const flip = from ? interpolate(frame, [at, at + 12], [0, 1], {...clamp, easing: EASE_IN_OUT}) : 1;
	const cur = flip < 0.5 && from ? from : to;
	const rot = from ? (flip < 0.5 ? flip * 180 : (1 - flip) * -180) : 0;
	const h = width * 1.12;
	return (
		<div style={{position: 'relative', width, height: h, perspective: 900}}>
			<div style={{position: 'absolute', inset: 0, borderRadius: 22, background: '#F7F4EC', boxShadow: '0 30px 60px rgba(0,0,0,0.55)', overflow: 'hidden', rotate: `x ${rot}deg`, transformOrigin: '50% 0%'}}>
				<div style={{height: h * 0.27, background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: width * 0.15, letterSpacing: 4, color: '#FFFFFF'}}>{cur.month}</div>
				<div style={{height: h * 0.73, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: width * 0.46, color: '#14141C', letterSpacing: -4}}>{cur.day}</div>
			</div>
			{[0.25, 0.75].map((x) => (
				<div key={x} style={{position: 'absolute', left: width * x - 10, top: -14, width: 20, height: 36, borderRadius: 10, background: '#8A8FA8', border: '3px solid #2A2F48'}} />
			))}
		</div>
	);
};

export type FeedKind = 'call' | 'share' | 'comments' | 'chat';
const FEED: Record<FeedKind, {icon: IconName; label: string; color: string}> = {
	call: {icon: 'megaphone', label: 'DEMO-AUFRUF', color: ACCENT.yes},
	share: {icon: 'wave', label: 'GETEILT', color: ACCENT.info},
	comments: {icon: 'chat', label: 'KOMMENTARE', color: '#FFB15C'},
	chat: {icon: 'question', label: 'KOMMUNIKATION?', color: ACCENT.no},
};

/** Neutraler Social-Feed (keine echte Plattform, keine echten Posts): Karten mit Symbolen laufen durchs Display. */
export const FeedPhone: React.FC<{width?: number; scroll: number; highlight?: FeedKind}> = ({width = 380, scroll, highlight}) => {
	const frame = useCurrentFrame();
	const s = width / 400;
	const order: FeedKind[] = ['call', 'share', 'comments', 'chat', 'call', 'share', 'chat', 'comments'];
	return (
		<div style={{width, height: 820 * s, position: 'relative'}}>
			<div style={{position: 'absolute', left: 0, top: 0, width: 400, height: 820, scale: String(s), transformOrigin: '0 0'}}>
				<div style={{position: 'absolute', inset: 0, borderRadius: 64, background: 'linear-gradient(145deg, #5A6078 0%, #23263A 40%, #3C4258 100%)', boxShadow: '0 40px 90px rgba(0,0,0,0.6)'}} />
				<div style={{position: 'absolute', left: 18, top: 18, width: 364, height: 784, borderRadius: 48, overflow: 'hidden', background: '#0B0E22'}}>
					<div style={{position: 'absolute', top: 54, left: 22, right: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2}}>
						<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 24, color: '#FFFFFF'}}>Feed</span>
						<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 16, color: '#9AA3BF'}}>Beispiel · fiktiv</span>
					</div>
					<div style={{position: 'absolute', left: 16, right: 16, top: 100 - scroll * 560}}>
						{order.map((k, i) => {
							const f = FEED[k];
							const hi = highlight === k;
							return (
								<div key={i} style={{marginBottom: 14, padding: '14px 16px', borderRadius: 18, background: hi ? withAlpha(f.color, 0.18) : 'rgba(255,255,255,0.06)', border: `2px solid ${hi ? f.color : 'rgba(255,255,255,0.1)'}`, display: 'flex', gap: 14, alignItems: 'center'}}>
									<div style={{width: 58, height: 58, borderRadius: 16, background: withAlpha(f.color, 0.2), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
										<Icon name={f.icon} size={34} color={f.color} />
									</div>
									<div style={{flex: 1}}>
										<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 17, letterSpacing: 1.5, color: f.color}}>{f.label}</div>
										<div style={{marginTop: 8, height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.22)', width: `${55 + random(`fd-${i}`) * 40}%`}} />
										<div style={{marginTop: 6, height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.12)', width: `${40 + random(`fe-${i}`) * 40}%`}} />
									</div>
									<div style={{fontFamily: FONTS.body, fontWeight: 800, fontSize: 15, color: '#9AA3BF', opacity: 0.6 + 0.4 * Math.sin((frame + i * 9) / 10)}}>♥</div>
								</div>
							);
						})}
					</div>
				</div>
				<div style={{position: 'absolute', left: '50%', top: 30, translate: '-50% 0', width: 120, height: 34, borderRadius: 18, background: '#000'}} />
			</div>
		</div>
	);
};

/** Rundes Symbol mit Ring (für Verbindungs-Grafiken). */
export const IconOrb: React.FC<{icon: IconName; color: string; size?: number; label?: string; sub?: string; at: number}> = ({icon, color, size = 190, label, sub, at}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = springIn({frame, fps, delay: at, damping: 12, stiffness: 180});
	if (frame < at - 1) return null;
	return (
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, opacity: Math.min(1, s * 2), scale: String(0.6 + 0.4 * s)}}>
			<div style={{width: size, height: size, borderRadius: size / 2, background: `radial-gradient(circle at 35% 30%, ${withAlpha(color, 0.55)}, ${withAlpha(color, 0.12)} 70%)`, border: `4px solid ${color}`, boxShadow: `0 0 50px ${withAlpha(color, 0.45)}, 0 24px 50px rgba(0,0,0,0.5)`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<Icon name={icon} size={size * 0.5} color={color} stroke={2} />
			</div>
			{label ? <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: COLORS.text, textAlign: 'center', lineHeight: 1.05}}>{label}</div> : null}
			{sub ? <div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 22, color: COLORS.textMuted, textAlign: 'center'}}>{sub}</div> : null}
		</div>
	);
};
