import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, EASE_IN_OUT} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';
import {FONTS} from '../../../theme/tokens';
import {PIcon} from '../components';

/**
 * Generisches Smartphone (keine Marke) mit Kamera-Oberfläche (REC, Timer, Fokusrahmen, Auslöser) und
 * „Veröffentlichen“-Ansicht (neutrale Social-Karte mit Prüfhinweisen). `children` = Live-Bild im Display
 * (wird als 1080×1920-Szene verkleinert hineingesetzt).
 */
const W = 400;
const H = 820;
const SCREEN = {x: 18, y: 18, w: 364, h: 784};

const LiveView: React.FC<{children: React.ReactNode; inset?: {x: number; y: number; w: number; h: number}}> = ({children, inset = {x: 0, y: 0, w: SCREEN.w, h: SCREEN.h}}) => {
	const scale = inset.h / 1920;
	return (
		<div style={{position: 'absolute', left: inset.x, top: inset.y, width: inset.w, height: inset.h, overflow: 'hidden'}}>
			<div style={{position: 'absolute', left: (inset.w - 1080 * scale) / 2, top: 0, width: 1080, height: 1920, scale: String(scale), transformOrigin: '0 0'}}>{children}</div>
		</div>
	);
};

export type CameraPhoneProps = {
	width?: number;
	children: React.ReactNode;
	/** 0 = Kamera, 1 = Veröffentlichen-Ansicht */
	post?: number;
	/** Frame, ab dem aufgenommen wird (REC-Timer). */
	recFrom?: number;
	/** Frames, ab denen die Prüfhinweise im Post-Screen erscheinen. */
	checksAt?: [number, number];
	style?: React.CSSProperties;
};

export const CameraPhone: React.FC<CameraPhoneProps> = ({width = W, children, post = 0, recFrom = 0, checksAt = [99999, 99999], style}) => {
	const frame = useCurrentFrame();
	const s = width / W;
	const recSec = Math.max(0, Math.floor((frame - recFrom) / 30));
	const blink = Math.floor(frame / 15) % 2 === 0;
	const p = interpolate(post, [0, 1], [0, 1], {...clamp, easing: EASE_IN_OUT});
	const c1 = interpolate(frame, [checksAt[0], checksAt[0] + 8], [0, 1], clamp);
	const c2 = interpolate(frame, [checksAt[1], checksAt[1] + 8], [0, 1], clamp);
	return (
		<div style={{width, height: H * s, position: 'relative', ...style}}>
			<div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, scale: String(s), transformOrigin: '0 0'}}>
				<div style={{position: 'absolute', inset: 0, borderRadius: 64, background: 'linear-gradient(145deg, #5A6078 0%, #23263A 40%, #3C4258 100%)', boxShadow: '0 40px 90px rgba(0,0,0,0.6), inset 0 2px 2px rgba(255,255,255,0.35)'}} />
				{[160, 230].map((y) => (
					<div key={y} style={{position: 'absolute', left: -4, top: y, width: 5, height: 52, borderRadius: 3, background: '#3C4258'}} />
				))}
				<div style={{position: 'absolute', right: -4, top: 200, width: 5, height: 86, borderRadius: 3, background: '#3C4258'}} />
				<div style={{position: 'absolute', left: 10, top: 10, right: 10, bottom: 10, borderRadius: 54, background: '#05060C'}} />
				<div style={{position: 'absolute', left: SCREEN.x, top: SCREEN.y, width: SCREEN.w, height: SCREEN.h, borderRadius: 48, overflow: 'hidden', background: '#000'}}>
					{/* Kamera-Ansicht */}
					<div style={{position: 'absolute', inset: 0, opacity: 1 - p}}>
						<LiveView>{children}</LiveView>
						{/* Raster + Fokus */}
						<svg width={SCREEN.w} height={SCREEN.h} style={{position: 'absolute', inset: 0}}>
							{[1, 2].map((k) => (
								<g key={k} stroke="rgba(255,255,255,0.18)" strokeWidth={1}>
									<line x1={(SCREEN.w * k) / 3} y1={0} x2={(SCREEN.w * k) / 3} y2={SCREEN.h} />
									<line x1={0} y1={(SCREEN.h * k) / 3} x2={SCREEN.w} y2={(SCREEN.h * k) / 3} />
								</g>
							))}
							<path d={`M${SCREEN.w / 2 - 44} ${SCREEN.h / 2 - 24} v-20 h20 M${SCREEN.w / 2 + 24} ${SCREEN.h / 2 - 44} h20 v20 M${SCREEN.w / 2 + 44} ${SCREEN.h / 2 + 24} v20 h-20 M${SCREEN.w / 2 - 24} ${SCREEN.h / 2 + 44} h-20 v-20`} stroke="#FFD23F" strokeWidth={3} fill="none" />
						</svg>
						<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 110, background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0))'}} />
						<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 190, background: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.75))'}} />
						<div style={{position: 'absolute', top: 58, left: '50%', translate: '-50% 0', display: 'flex', alignItems: 'center', gap: 8, padding: '5px 12px', borderRadius: 8, background: frame >= recFrom ? '#E0303E' : 'rgba(0,0,0,0.5)'}}>
							<div style={{width: 10, height: 10, borderRadius: 5, background: '#FFFFFF', opacity: frame >= recFrom && blink ? 1 : 0.4}} />
							<span style={{fontFamily: FONTS.body, fontWeight: 800, fontSize: 18, color: '#FFFFFF', fontVariantNumeric: 'tabular-nums'}}>00:{String(recSec).padStart(2, '0')}</span>
						</div>
						<div style={{position: 'absolute', bottom: 150, left: '50%', translate: '-50% 0', display: 'flex', gap: 10}}>
							{['0,5', '1×', '3'].map((z, i) => (
								<div key={z} style={{width: 40, height: 40, borderRadius: 20, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.body, fontWeight: 800, fontSize: 14, color: i === 1 ? '#FFD23F' : '#FFFFFF'}}>{z}</div>
							))}
						</div>
						<div style={{position: 'absolute', bottom: 112, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 26, fontFamily: FONTS.heading, fontWeight: 800, fontSize: 15, letterSpacing: 1.5}}>
							<span style={{color: 'rgba(255,255,255,0.6)'}}>FOTO</span>
							<span style={{color: '#FFD23F'}}>VIDEO</span>
							<span style={{color: 'rgba(255,255,255,0.6)'}}>ZEITLUPE</span>
						</div>
						<div style={{position: 'absolute', bottom: 26, left: '50%', translate: '-50% 0', width: 76, height: 76, borderRadius: 38, border: '5px solid #FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
							<div style={{width: frame >= recFrom ? 30 : 58, height: frame >= recFrom ? 30 : 58, borderRadius: frame >= recFrom ? 7 : 29, background: '#E0303E'}} />
						</div>
					</div>
					{/* Veröffentlichen-Ansicht (neutral, keine Plattform-Marke) */}
					{p > 0.01 ? (
						<div style={{position: 'absolute', inset: 0, opacity: p, translate: `${(1 - p) * 120}px 0`, background: '#0E1024'}}>
							<div style={{position: 'absolute', top: 60, left: 22, right: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
								<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, color: '#FFFFFF'}}>Neuer Beitrag</span>
								<PIcon name="x" size={24} color="#9AA3BF" />
							</div>
							<div style={{position: 'absolute', top: 110, left: 22, width: 150, height: 268, borderRadius: 14, overflow: 'hidden', border: '2px solid rgba(255,255,255,0.2)'}}>
								<LiveView inset={{x: 0, y: 0, w: 150, h: 268}}>{children}</LiveView>
								{/* verpixelte Gesichter als Prüfsymbol */}
								{c1 > 0 ? (
									<>
										{[
											[38, 150],
											[92, 136],
										].map(([x, y]) => (
											<div key={x} style={{position: 'absolute', left: x, top: y, width: 26, height: 26, borderRadius: 6, background: 'repeating-conic-gradient(#8A93B8 0% 25%, #C9CEDF 0% 50%) 50% / 8px 8px', opacity: c1 * 0.9, border: '2px solid #FFD23F'}} />
										))}
									</>
								) : null}
							</div>
							<div style={{position: 'absolute', top: 110, left: 186, right: 22, display: 'flex', flexDirection: 'column', gap: 8}}>
								<div style={{height: 14, borderRadius: 7, background: 'rgba(255,255,255,0.25)', width: '90%'}} />
								<div style={{height: 14, borderRadius: 7, background: 'rgba(255,255,255,0.18)', width: '70%'}} />
								<div style={{height: 14, borderRadius: 7, background: 'rgba(255,255,255,0.12)', width: '80%'}} />
								<div style={{marginTop: 10, display: 'flex', gap: 10}}>
									{(['eye', 'chat'] as const).map((n) => (
										<div key={n} style={{width: 36, height: 36, borderRadius: 18, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
											<PIcon name={n} size={20} color="#C9CEDF" />
										</div>
									))}
								</div>
							</div>
							{/* Prüfhinweise */}
							<div style={{position: 'absolute', top: 410, left: 22, right: 22, display: 'flex', flexDirection: 'column', gap: 12}}>
								{[
									{icon: 'person' as const, text: 'Erkennbare Personen?', t: c1},
									{icon: 'chat' as const, text: 'Private Gespräche?', t: c2},
								].map((c) => (
									<div key={c.text} style={{display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 14, background: withAlpha('#FFD23F', 0.14), border: '2px solid rgba(255,210,63,0.7)', opacity: c.t, translate: `${(1 - c.t) * 40}px 0`}}>
										<PIcon name={c.icon} size={28} color="#FFD23F" />
										<span style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 21, color: '#FFFFFF'}}>{c.text}</span>
										<div style={{marginLeft: 'auto'}}>
											<PIcon name="alert" size={24} color="#FFD23F" />
										</div>
									</div>
								))}
							</div>
							<div style={{position: 'absolute', bottom: 40, left: 22, right: 22, height: 64, borderRadius: 18, background: c2 > 0.5 ? 'linear-gradient(90deg, #FFB15C, #FFD23F)' : '#FF3B4E', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10}}>
								<PIcon name={c2 > 0.5 ? 'search' : 'upload'} size={26} color="#0B1029" stroke={2.6} />
								<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 24, color: '#0B1029'}}>{c2 > 0.5 ? 'ERST PRÜFEN' : 'POSTEN'}</span>
							</div>
						</div>
					) : null}
					<div style={{position: 'absolute', left: '50%', top: 12, translate: '-50% 0', width: 120, height: 34, borderRadius: 18, background: '#000000'}} />
					<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(125deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 35%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.05) 100%)', pointerEvents: 'none'}} />
				</div>
			</div>
		</div>
	);
};

/** Innen-Ansicht der Kamera als Vollbild-Rahmen (nach dem Zoom ins Display): REC + Fokus über einer Szene. */
export const CameraOverlay: React.FC<{recFrom: number; opacity?: number}> = ({recFrom, opacity = 1}) => {
	const frame = useCurrentFrame();
	const recSec = Math.max(0, Math.floor((frame - recFrom) / 30));
	const blink = Math.floor(frame / 15) % 2 === 0;
	return (
		<div style={{position: 'absolute', inset: 0, opacity, pointerEvents: 'none'}}>
			<svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
				{[1, 2].map((k) => (
					<g key={k} stroke="rgba(255,255,255,0.14)" strokeWidth={2}>
						<line x1={360 * k} y1={0} x2={360 * k} y2={1920} />
						<line x1={0} y1={640 * k} x2={1080} y2={640 * k} />
					</g>
				))}
				<path d="M80 300 v-60 h60 M940 240 h60 v60 M1000 1560 v60 h-60 M140 1620 h-60 v-60" stroke="#FFFFFF" strokeWidth={6} fill="none" opacity={0.7} />
			</svg>
			<div style={{position: 'absolute', top: 290, right: 160, display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', borderRadius: 12, background: '#E0303E'}}>
				<div style={{width: 16, height: 16, borderRadius: 8, background: '#FFFFFF', opacity: blink ? 1 : 0.35}} />
				<span style={{fontFamily: FONTS.body, fontWeight: 800, fontSize: 30, color: '#FFFFFF'}}>REC 00:{String(recSec).padStart(2, '0')}</span>
			</div>
		</div>
	);
};
