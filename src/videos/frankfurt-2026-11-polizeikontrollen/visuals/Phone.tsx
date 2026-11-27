import React from 'react';
import {interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, EASE_OUT, springIn} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {FONTS} from '../../../theme/tokens';
import {PIcon} from '../ui';

export type ThumbKind = 'street' | 'window' | 'crowd' | 'police' | 'skyline' | 'friends' | 'food' | 'sneaker' | 'sunset' | 'concert' | 'cat' | 'tram';

/** Fiktive Mini-Fotos als Vektor (keine echten Bilder, keine erkennbaren Personen). */
export const Thumb: React.FC<{kind: ThumbKind; size: number; seed: string}> = ({kind, size, seed}) => {
	const frame = useCurrentFrame();
	const r = (k: string) => random(`${seed}-${k}`);
	const body = (() => {
		switch (kind) {
			case 'street':
				return (
					<>
						<rect width={100} height={100} fill="#141A3E" />
						<polygon points="0,20 38,48 38,62 0,100" fill="#2C3366" />
						<polygon points="100,15 62,48 62,62 100,100" fill="#33305E" />
						<polygon points="0,100 38,62 62,62 100,100" fill="#22203A" />
						{[10, 20, 30].map((y) => (
							<rect key={y} x={6} y={30 + y} width={8} height={5} fill="#FFC67A" opacity={0.8} />
						))}
						{[18, 28].map((y) => (
							<rect key={y} x={84} y={30 + y} width={8} height={5} fill="#9CC8FF" opacity={0.8} />
						))}
						<circle cx={50} cy={52} r={4} fill="#FFE2B0" opacity={0.7} />
					</>
				);
			case 'window':
				return (
					<>
						<rect width={100} height={100} fill="#1E2240" />
						<rect x={12} y={18} width={76} height={64} fill="#5D86B8" opacity={0.6} />
						<path d="M50 48 L20 22 M50 48 L84 30 M50 48 L76 80 M50 48 L22 76 M50 48 L56 18 M50 48 L88 58" stroke="#EAF4FF" strokeWidth={1.6} />
						<circle cx={50} cy={48} r={3} fill="#FFFFFF" />
						<rect x={10} y={16} width={80} height={68} fill="none" stroke="#B9C2DE" strokeWidth={3} />
					</>
				);
			case 'crowd':
				return (
					<>
						<rect width={100} height={100} fill="#3A1E2A" />
						<rect y={50} width={100} height={50} fill="#5A2A2A" />
						<ellipse cx={50} cy={40} rx={60} ry={20} fill="#FF8A4A" opacity={0.35} />
						{new Array(11).fill(true).map((_, i) => {
							const x = 6 + i * 9 + r(`x${i}`) * 4;
							const y = 62 + r(`y${i}`) * 14;
							return (
								<g key={i} fill="#120A10">
									<circle cx={x} cy={y - 10} r={4.4} />
									<path d={`M${x - 6} ${y + 14} Q${x} ${y - 8} ${x + 6} ${y + 14} Z`} />
								</g>
							);
						})}
					</>
				);
			case 'police': {
				const blink = Math.floor(frame / 6) % 2 === 0;
				return (
					<>
						<rect width={100} height={100} fill="#0E1636" />
						<ellipse cx={blink ? 40 : 60} cy={42} rx={30} ry={14} fill="#3D7BFF" opacity={0.45} />
						<path d="M14 70 Q14 58 26 56 L36 46 Q42 42 50 42 L64 42 Q72 44 76 52 L86 56 Q90 60 90 70 Z" fill="#E7EBF6" />
						<rect x={14} y={62} width={76} height={5} fill="#2F64D6" />
						<rect x={44} y={37} width={18} height={5} rx={2} fill={blink ? '#5A95FF' : '#1E3A8A'} />
						<circle cx={30} cy={72} r={7} fill="#0B0E1E" />
						<circle cx={74} cy={72} r={7} fill="#0B0E1E" />
					</>
				);
			}
			case 'skyline':
				return (
					<>
						<rect width={100} height={100} fill="#1A2152" />
						<rect y={70} width={100} height={30} fill="#0E1430" />
						{[
							[12, 40, 10],
							[28, 22, 9],
							[44, 34, 12],
							[60, 14, 9],
							[76, 30, 11],
						].map(([x, y, w]) => (
							<rect key={x} x={x} y={y} width={w} height={70 - y} fill="#2B3570" />
						))}
						<circle cx={64.5} cy={12} r={1.6} fill="#FF3B4E" />
					</>
				);
			case 'friends':
				return (
					<>
						<rect width={100} height={100} fill="#F2A65A" />
						<circle cx={80} cy={22} r={12} fill="#FFE2A8" />
						{[34, 66].map((x, i) => (
							<g key={x} fill={i ? '#6A3E7A' : '#2E4E8A'}>
								<circle cx={x} cy={46} r={12} fill={i ? '#7A4E36' : '#C99A76'} />
								<path d={`M${x - 20} 100 Q${x} 56 ${x + 20} 100 Z`} />
							</g>
						))}
					</>
				);
			case 'food':
				return (
					<>
						<rect width={100} height={100} fill="#2E6E62" />
						<ellipse cx={50} cy={64} rx={36} ry={14} fill="#F2F2F2" />
						<path d="M26 56 Q50 30 74 56 Z" fill="#E0A04A" />
						<rect x={26} y={56} width={48} height={6} fill="#5A2E1E" />
						<rect x={24} y={62} width={52} height={5} rx={2} fill="#E0A04A" />
						<path d="M28 56 h44" stroke="#5FBF4A" strokeWidth={3} />
					</>
				);
			case 'sneaker':
				return (
					<>
						<rect width={100} height={100} fill="#D9DDEA" />
						<path d="M14 66 Q18 46 34 44 L48 52 Q72 54 84 62 Q90 68 84 72 L16 72 Z" fill="#FF5A6A" />
						<path d="M14 72 h72" stroke="#FFFFFF" strokeWidth={6} />
						<path d="M36 50 l6 6 M42 47 l6 6" stroke="#FFFFFF" strokeWidth={2} />
					</>
				);
			case 'sunset':
				return (
					<>
						<rect width={100} height={100} fill="#FF8A5A" />
						<rect y={50} width={100} height={50} fill="#5A3A8A" />
						<circle cx={50} cy={52} r={16} fill="#FFE07A" />
						<rect y={60} width={100} height={40} fill="#3A2A6A" />
						<path d="M0 74 Q25 68 50 74 T100 74" stroke="#FFB07A" strokeWidth={2} fill="none" />
					</>
				);
			case 'concert':
				return (
					<>
						<rect width={100} height={100} fill="#160C2E" />
						<path d="M20 0 L40 70 M80 0 L60 70 M50 0 L50 70" stroke="#B794F6" strokeWidth={8} opacity={0.35} />
						{new Array(9).fill(true).map((_, i) => (
							<circle key={i} cx={8 + i * 11} cy={84 + (i % 2) * 4} r={6} fill="#05020E" />
						))}
					</>
				);
			case 'cat':
				return (
					<>
						<rect width={100} height={100} fill="#E8D9C2" />
						<ellipse cx={50} cy={66} rx={24} ry={18} fill="#6A6A72" />
						<circle cx={50} cy={42} r={14} fill="#6A6A72" />
						<path d="M38 34 l2 -12 l8 8 Z M62 34 l-2 -12 l-8 8 Z" fill="#6A6A72" />
						<circle cx={45} cy={42} r={2} fill="#FFE07A" />
						<circle cx={55} cy={42} r={2} fill="#FFE07A" />
					</>
				);
			case 'tram':
				return (
					<>
						<rect width={100} height={100} fill="#2A3A6A" />
						<rect x={10} y={40} width={80} height={36} rx={8} fill="#E8D24A" />
						<rect x={16} y={46} width={16} height={12} fill="#22305A" />
						<rect x={38} y={46} width={16} height={12} fill="#22305A" />
						<rect x={60} y={46} width={16} height={12} fill="#22305A" />
						<path d="M30 40 L50 24 L70 40" stroke="#1A1A22" strokeWidth={2} fill="none" />
					</>
				);
			default:
				return null;
		}
	})();
	return (
		<svg width={size} height={size} viewBox="0 0 100 100" style={{display: 'block', borderRadius: 4}}>
			{body}
		</svg>
	);
};

const GRID: ThumbKind[] = ['friends', 'food', 'street', 'skyline', 'crowd', 'sneaker', 'police', 'window', 'sunset', 'concert', 'cat', 'tram', 'street', 'friends', 'skyline'];

export type PhoneProps = {
	width?: number;
	/** Frame, ab dem die Galerie aufgebaut wird. */
	galleryAt?: number;
	/** Indizes im Raster, die markiert werden (mit Rahmen + Puls). */
	highlight?: number[];
	highlightAt?: number;
	/** Sperrbildschirm-Overlay ab Frame (Schloss). */
	lockAt?: number;
	/** Freiwillig-Dialog ab Frame. */
	dialogAt?: number;
	/** 0–1 Scrollposition der Galerie. */
	scroll?: number;
	accent?: string;
	style?: React.CSSProperties;
};

/** Generisches Smartphone (ohne Marke/Logo) mit animierter Galerie, Schloss-Overlay und Einwilligungs-Dialog. */
export const Phone: React.FC<PhoneProps> = ({width = 400, galleryAt = 0, highlight = [], highlightAt = 99999, lockAt, dialogAt, scroll = 0, accent = '#FFD23F', style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = width / 400;
	const H = 820;
	const cell = 116;
	const gap = 4;
	const lockP = lockAt !== undefined ? interpolate(frame, [lockAt, lockAt + 10], [0, 1], {...clamp, easing: EASE_OUT}) : 0;
	const dialog = dialogAt !== undefined && frame >= dialogAt ? springIn({frame, fps, delay: dialogAt, damping: 14, stiffness: 180}) : 0;
	const pulse = (Math.sin(frame / 5) + 1) / 2;
	return (
		<div style={{width, height: H * s, position: 'relative', ...style}}>
			<div style={{position: 'absolute', left: 0, top: 0, width: 400, height: H, scale: String(s), transformOrigin: '0 0'}}>
				{/* Gehäuse */}
				<div style={{position: 'absolute', inset: 0, borderRadius: 64, background: 'linear-gradient(145deg, #5A6078 0%, #23263A 40%, #3C4258 100%)', boxShadow: '0 40px 90px rgba(0,0,0,0.6), inset 0 2px 2px rgba(255,255,255,0.35)'}} />
				{[160, 230].map((y) => (
					<div key={y} style={{position: 'absolute', left: -4, top: y, width: 5, height: 52, borderRadius: 3, background: '#3C4258'}} />
				))}
				<div style={{position: 'absolute', right: -4, top: 200, width: 5, height: 86, borderRadius: 3, background: '#3C4258'}} />
				<div style={{position: 'absolute', left: 10, top: 10, right: 10, bottom: 10, borderRadius: 54, background: '#05060C'}} />
				{/* Bildschirm */}
				<div style={{position: 'absolute', left: 18, top: 18, right: 18, bottom: 18, borderRadius: 48, overflow: 'hidden', background: '#0B0D18'}}>
					{/* Statusleiste */}
					<div style={{position: 'absolute', left: 30, right: 26, top: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: FONTS.body, fontWeight: 700, fontSize: 20, color: '#FFFFFF', zIndex: 3}}>
						<span>21:30</span>
						<span style={{display: 'flex', gap: 6, alignItems: 'center'}}>
							{[6, 9, 12, 15].map((h) => (
								<span key={h} style={{width: 4, height: h, borderRadius: 1, background: '#FFFFFF', display: 'inline-block'}} />
							))}
							<span style={{marginLeft: 6, width: 30, height: 14, borderRadius: 4, border: '2px solid #FFFFFF', display: 'inline-block', position: 'relative'}}>
								<span style={{position: 'absolute', left: 1, top: 1, bottom: 1, width: 18, borderRadius: 2, background: '#FFFFFF'}} />
							</span>
						</span>
					</div>
					<div style={{position: 'absolute', left: '50%', top: 12, translate: '-50% 0', width: 120, height: 34, borderRadius: 18, background: '#000000', zIndex: 4}} />
					{/* Galerie */}
					<div style={{position: 'absolute', left: 0, right: 0, top: 64, padding: '0 18px', zIndex: 1}}>
						<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 36, color: '#FFFFFF'}}>Fotos</div>
						<div style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 18, color: '#9AA3BF', marginBottom: 12}}>Alle Fotos · privat</div>
					</div>
					<div style={{position: 'absolute', left: 0, right: 0, top: 150, bottom: 0, overflow: 'hidden'}}>
						<div style={{display: 'grid', gridTemplateColumns: `repeat(3, ${cell}px)`, gap, padding: `0 ${(364 - cell * 3 - gap * 2) / 2}px`, translate: `0 ${-scroll * 220}px`}}>
							{GRID.map((k, i) => {
								const at = galleryAt + i * 2;
								const p = springIn({frame, fps, delay: at, damping: 15, stiffness: 180});
								const hi = highlight.includes(i) && frame >= highlightAt;
								return (
									<div key={i} style={{position: 'relative', opacity: frame < at ? 0 : Math.min(1, p * 2), scale: String(0.6 + 0.4 * p)}}>
										<Thumb kind={k} size={cell} seed={`g-${i}`} />
										{hi ? <div style={{position: 'absolute', inset: -3, borderRadius: 6, border: `4px solid ${accent}`, boxShadow: `0 0 ${10 + pulse * 16}px ${withAlpha(accent, 0.8)}`}} /> : null}
									</div>
								);
							})}
						</div>
					</div>
					{/* Schloss / privat */}
					{lockP > 0 ? (
						<div style={{position: 'absolute', inset: 0, zIndex: 5, background: `rgba(6,8,20,${0.78 * lockP})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14}}>
							<div style={{width: 130, height: 130, borderRadius: 65, background: withAlpha(accent, 0.18 * lockP), border: `3px solid ${withAlpha(accent, lockP)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', scale: String(0.7 + 0.3 * lockP)}}>
								<PIcon name="lock" size={74} color={accent} stroke={2.2} />
							</div>
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: '#FFFFFF', opacity: lockP}}>PRIVAT</span>
						</div>
					) : null}
					{/* Einwilligungs-Dialog */}
					{dialog > 0 ? (
						<div style={{position: 'absolute', inset: 0, zIndex: 6, background: `rgba(0,0,0,${0.45 * Math.min(1, dialog)})`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
							<div style={{width: 300, borderRadius: 26, overflow: 'hidden', background: 'rgba(238,240,248,0.97)', scale: String(0.8 + 0.2 * dialog), opacity: Math.min(1, dialog * 2)}}>
								<div style={{padding: '22px 20px 16px', textAlign: 'center'}}>
									<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 24, color: '#0B1029'}}>Fotos zeigen?</div>
									<div style={{marginTop: 6, fontFamily: FONTS.body, fontWeight: 600, fontSize: 18, lineHeight: 1.3, color: '#3A4466'}}>Freiwillige Bitte – du entscheidest.</div>
								</div>
								<div style={{display: 'flex', borderTop: '1.5px solid #C9CEDF'}}>
									<div style={{flex: 1, padding: '14px 0', textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 21, color: '#1E7A4A', background: withAlpha('#3DDC97', 0.18 + 0.2 * pulse), borderRight: '1.5px solid #C9CEDF'}}>Nein danke</div>
									<div style={{flex: 1, padding: '14px 0', textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 700, fontSize: 21, color: '#2E64D6'}}>Zeigen</div>
								</div>
							</div>
						</div>
					) : null}
					{/* Glasreflex */}
					<div style={{position: 'absolute', inset: 0, zIndex: 7, background: 'linear-gradient(125deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 35%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.05) 100%)', pointerEvents: 'none'}} />
				</div>
			</div>
		</div>
	);
};
