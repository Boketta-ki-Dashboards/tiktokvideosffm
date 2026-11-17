import React from 'react';
import {AbsoluteFill} from 'remotion';
import {COLORS, FONTS} from '../../theme/tokens';
import {ACCENT, LAYOUT} from './theme';

/**
 * Prüfbogen für das kleine Serien-Overlay (nicht zur Veröffentlichung): zeigt Videoframes 1:2 verkleinert, wahlweise mit einer
 * neutral nachgezeichneten TikTok-Suchleiste (keine Logos, keine Marken) – so wird sichtbar, ob Countdown, „FRANKFURT ERKLÄRT“,
 * „IN 60 SEKUNDEN“ und Folgennummer unter der Suchleiste frei bleiben. Die Suchleiste wird NIE ins Video gerendert.
 */
export const OVERLAY_CHECK_SIZE = {width: 1720, height: 1080} as const;

/** Bereich, den die TikTok-Suchleiste in der App überlagert (y in px bei 1080 × 1920, aus den Screenshots des Kanalbetreibers abgeschätzt). */
export const TIKTOK_SEARCH_ZONE = {top: 92, bottom: 238} as const;

const SearchBarSim: React.FC = () => (
	<AbsoluteFill style={{pointerEvents: 'none'}}>
		{/* Statusleiste */}
		<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 84, background: 'linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0))', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 56px', fontFamily: FONTS.body, fontWeight: 700, fontSize: 34, color: '#FFFFFF'}}>
			<span>9:41</span>
			<span style={{letterSpacing: 4}}>▮▮▮ ◔ ▭</span>
		</div>
		{/* Suchleiste */}
		<div style={{position: 'absolute', left: 36, right: 36, top: TIKTOK_SEARCH_ZONE.top + 18, height: 104, display: 'flex', alignItems: 'center', gap: 22}}>
			<span style={{fontFamily: FONTS.body, fontWeight: 800, fontSize: 56, color: '#FFFFFF'}}>‹</span>
			<div style={{flex: 1, height: 96, borderRadius: 18, background: 'rgba(60,60,64,0.92)', display: 'flex', alignItems: 'center', gap: 18, padding: '0 26px'}}>
				<svg width={44} height={44} viewBox="0 0 24 24">
					<circle cx={10.5} cy={10.5} r={6.5} fill="none" stroke="#C9C9CF" strokeWidth={2.4} />
					<path d="m15.5 15.5 5 5" stroke="#C9C9CF" strokeWidth={2.4} strokeLinecap="round" />
				</svg>
				<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 36, color: '#B9B9C2'}}>gen z demo frankfurt</span>
			</div>
			<span style={{fontFamily: FONTS.body, fontWeight: 800, fontSize: 38, color: '#FF3B5C'}}>Suchen</span>
		</div>
		<div style={{position: 'absolute', left: 0, right: 0, top: TIKTOK_SEARCH_ZONE.bottom, borderTop: '3px dashed rgba(255,80,80,0.9)'}}>
			<span style={{position: 'absolute', left: 10, top: 4, padding: '2px 8px', borderRadius: 6, background: 'rgba(255,80,80,0.9)', fontFamily: FONTS.body, fontWeight: 800, fontSize: 24, color: '#111'}}>Unterkante Suchleiste y={TIKTOK_SEARCH_ZONE.bottom}</span>
		</div>
		<div style={{position: 'absolute', right: 0, width: 1080, top: LAYOUT.badgeTopRight, borderTop: '3px dashed rgba(61,220,151,0.9)'}}>
			<span style={{position: 'absolute', right: 10, top: -36, padding: '2px 8px', borderRadius: 6, background: 'rgba(61,220,151,0.9)', fontFamily: FONTS.body, fontWeight: 800, fontSize: 24, color: '#111'}}>Overlay ab y={LAYOUT.badgeTopRight}</span>
		</div>
	</AbsoluteFill>
);

export type OverlayCheckPanel = {label: string; sub: string; node: React.ReactNode; search?: boolean};

export const OverlayCheckSheet: React.FC<{title: string; panels: OverlayCheckPanel[]}> = ({title, panels}) => {
	const w = 520;
	const s = w / 1080;
	return (
		<AbsoluteFill style={{background: '#0B0E1E', padding: 40, fontFamily: FONTS.body}}>
			<div style={{display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 22}}>
				<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, color: COLORS.text}}>SERIEN-OVERLAY-PRÜFUNG · {title}</span>
				<span style={{fontWeight: 700, fontSize: 22, color: ACCENT.brand}}>Prüfansicht – Suchleiste nur simuliert, nicht im Video</span>
			</div>
			<div style={{display: 'flex', gap: 40}}>
				{panels.map((p) => (
					<div key={p.label}>
						<div style={{display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 10}}>
							<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, color: ACCENT.signal}}>{p.label}</span>
							<span style={{fontWeight: 600, fontSize: 18, color: COLORS.textMuted}}>{p.sub}</span>
						</div>
						<div style={{position: 'relative', width: w, height: 1920 * s, overflow: 'hidden', borderRadius: 16, background: '#000'}}>
							<div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, scale: String(s), transformOrigin: '0 0'}}>
								{p.node}
								{p.search ? <SearchBarSim /> : null}
							</div>
						</div>
					</div>
				))}
			</div>
		</AbsoluteFill>
	);
};
