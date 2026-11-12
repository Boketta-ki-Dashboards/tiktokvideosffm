import React from 'react';
import {AbsoluteFill} from 'remotion';
import {handleWithAt} from '../../theme/brand';
import {COLORS, FONTS} from '../../theme/tokens';
import {BrandAvatar} from './Branding';
import {ACCENT, COVER_ZONE} from './theme';

/**
 * Prüfbogen fürs Titelbild (nicht zur Veröffentlichung): zeigt dieselbe Cover-Komponente
 * 1. vollständig 9:16 mit Kernzone und 3:4-Ausschnitt, 2. als mittigen 3:4-Ausschnitt,
 * 3. im nachgebauten Profilraster (3 Spalten, Aufruf-Zähler, „Angepinnt“) neben den Vorgängern,
 * 4. als Videoframe mit TikTok-typischen Bedienelementen (neutral nachgezeichnet, keine Logos).
 * Größe 2420 × 1240.
 */
export const COVER_PREVIEW_SIZE = {width: 2420, height: 1240} as const;

const W = 1080;
const H = 1920;
const CROP_H = COVER_ZONE.crop34Bottom - COVER_ZONE.crop34Top; // 1440 → 3:4

const Label: React.FC<{n: string; title: string; sub: string}> = ({n, title, sub}) => (
	<div style={{display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 14, whiteSpace: 'nowrap', maxWidth: 600, overflow: 'hidden'}}>
		<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: ACCENT.signal}}>{n}</span>
		<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, color: COLORS.text}}>{title}</span>
		<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 17, color: COLORS.textMuted}}>{sub}</span>
	</div>
);

/** Ausschnitt eines 1080 × 1920-Inhalts (y0…y0+h) in Breite `width`. */
const Window: React.FC<{children: React.ReactNode; width: number; y0?: number; h?: number; radius?: number}> = ({children, width, y0 = 0, h = H, radius = 0}) => {
	const s = width / W;
	return (
		<div style={{position: 'relative', width, height: h * s, overflow: 'hidden', borderRadius: radius, background: '#000'}}>
			<div style={{position: 'absolute', left: 0, top: -y0 * s, width: W, height: H, scale: String(s), transformOrigin: '0 0'}}>{children}</div>
		</div>
	);
};

const Guides: React.FC<{scale: number}> = ({scale}) => {
	const line = (y: number, color: string, text: string, dashed = true) => (
		<div style={{position: 'absolute', left: 0, right: 0, top: y * scale, borderTop: `3px ${dashed ? 'dashed' : 'solid'} ${color}`}}>
			<span style={{position: 'absolute', right: 6, top: 2, padding: '1px 6px', borderRadius: 4, background: color, fontFamily: FONTS.body, fontWeight: 700, fontSize: 15, color: '#0B1029'}}>{text}</span>
		</div>
	);
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: COVER_ZONE.crop34Top * scale, background: 'rgba(255,0,60,0.28)'}} />
			<div style={{position: 'absolute', left: 0, right: 0, top: COVER_ZONE.crop34Bottom * scale, bottom: 0, background: 'rgba(255,0,60,0.28)'}} />
			{line(COVER_ZONE.crop34Top, '#FF6A78', `3:4-Rand y=${COVER_ZONE.crop34Top}`)}
			{line(COVER_ZONE.crop34Bottom, '#FF6A78', `3:4-Rand y=${COVER_ZONE.crop34Bottom}`)}
			{line(COVER_ZONE.coreTop, '#3DDC97', `Kernzone y=${COVER_ZONE.coreTop}`)}
			{line(COVER_ZONE.coreBottom, '#3DDC97', `Kernzone y=${COVER_ZONE.coreBottom}`)}
			<div style={{position: 'absolute', top: 0, bottom: 0, left: COVER_ZONE.side * scale, borderLeft: '2px dotted rgba(255,255,255,0.5)'}} />
			<div style={{position: 'absolute', top: 0, bottom: 0, left: (W - COVER_ZONE.side) * scale, borderLeft: '2px dotted rgba(255,255,255,0.5)'}} />
		</AbsoluteFill>
	);
};

/** Neutrale Nachzeichnung typischer Bedienelemente einer Kurzvideo-App (keine Logos, keine Marken). */
const AppOverlay: React.FC<{caption: string}> = ({caption}) => {
	const icon = (y: number, d: React.ReactNode, count: string) => (
		<div style={{position: 'absolute', left: 950, top: y, width: 110, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
			<svg width={84} height={84} viewBox="0 0 24 24" style={{filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))'}}>
				{d}
			</svg>
			<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 26, color: '#FFFFFF', textShadow: '0 2px 6px rgba(0,0,0,0.8)'}}>{count}</span>
		</div>
	);
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 200, background: 'linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0))'}} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 96, display: 'flex', justifyContent: 'center', gap: 40, fontFamily: FONTS.heading, fontWeight: 800, fontSize: 36, color: 'rgba(255,255,255,0.7)'}}>
				<span>Folge ich</span>
				<span style={{color: '#FFFFFF', borderBottom: '4px solid #FFFFFF', paddingBottom: 6}}>Für dich</span>
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 560, background: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.55))'}} />
			{/* rechte Knopfleiste */}
			<div style={{position: 'absolute', left: 962, top: 1000, width: 92, height: 92, borderRadius: 46, overflow: 'hidden', border: '3px solid #FFFFFF'}}>
				<BrandAvatar size={86} />
			</div>
			{icon(1150, <path d="M12 21s-7-4.4-9.3-9C1 8.6 3.4 5 6.9 5c2 0 3.4 1 5.1 3 1.7-2 3.1-3 5.1-3 3.5 0 5.9 3.6 4.2 7-2.3 4.6-9.3 9-9.3 9z" fill="#FFFFFF" />, '12,3K')}
			{icon(1300, <path d="M4 5h16v11H9l-5 4V5z" fill="#FFFFFF" />, '845')}
			{icon(1450, <path d="M6 3h12v18l-6-4-6 4V3z" fill="#FFFFFF" />, '1.204')}
			{icon(1600, <path d="M14 4l7 7-7 7v-4c-6 0-9 2-11 6 1-6 4-10 11-11V4z" fill="#FFFFFF" />, 'Teilen')}
			{/* unten links: Account, Beschreibung, Ton */}
			<div style={{position: 'absolute', left: 32, top: 1590, width: 860, display: 'flex', flexDirection: 'column', gap: 10, textShadow: '0 2px 6px rgba(0,0,0,0.8)'}}>
				<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 36, color: '#FFFFFF'}}>{handleWithAt()}</span>
				<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 30, color: '#FFFFFF'}}>{caption}</span>
				<span style={{fontFamily: FONTS.body, fontWeight: 600, fontSize: 28, color: 'rgba(255,255,255,0.85)'}}>♫ Originalton – {handleWithAt()}</span>
			</div>
			{/* untere Navigationsleiste */}
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 120, background: '#000', display: 'flex', justifyContent: 'space-around', alignItems: 'center', fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, color: 'rgba(255,255,255,0.85)'}}>
				<span>Start</span>
				<span>Freunde</span>
				<span style={{width: 96, height: 60, borderRadius: 14, background: '#FFFFFF', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44, fontWeight: 900}}>+</span>
				<span>Postfach</span>
				<span>Profil</span>
			</div>
		</AbsoluteFill>
	);
};

/** Nachgebautes Profil mit 3-Spalten-Raster (Kacheln 3:4, mittig beschnitten). */
const ProfileGrid: React.FC<{tiles: {node: React.ReactNode; label?: string; views: string; pinned?: boolean; mark?: string}[]; width: number}> = ({tiles, width}) => {
	const gap = 4;
	const tw = (width - 2 * gap) / 3;
	return (
		<div style={{width, borderRadius: 36, background: '#0E0E12', border: '3px solid #2A2A35', overflow: 'hidden', paddingBottom: 12}}>
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '26px 0 18px'}}>
				<BrandAvatar size={96} />
				<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, color: '#FFFFFF'}}>{handleWithAt()}</span>
				<div style={{display: 'flex', gap: 30, fontFamily: FONTS.body, fontWeight: 700, fontSize: 18, color: 'rgba(255,255,255,0.7)'}}>
					<span>Gefolgt</span>
					<span>Follower</span>
					<span>Likes</span>
				</div>
			</div>
			<div style={{display: 'flex', justifyContent: 'center', borderBottom: '1px solid #2A2A35', paddingBottom: 10, marginBottom: 6, fontFamily: FONTS.body, fontWeight: 800, fontSize: 18, color: '#FFFFFF'}}>Videos</div>
			<div style={{display: 'grid', gridTemplateColumns: `repeat(3, ${tw}px)`, gap}}>
				{tiles.map((t, i) => (
					<div key={i} style={{position: 'relative', width: tw, height: tw * (4 / 3), overflow: 'hidden', background: '#1C1C24'}}>
						{t.node ? <Window width={tw} y0={COVER_ZONE.crop34Top} h={CROP_H}>{t.node}</Window> : null}
						{t.pinned ? <span style={{position: 'absolute', left: 6, top: 6, padding: '2px 8px', borderRadius: 4, background: '#FF3B5C', fontFamily: FONTS.body, fontWeight: 800, fontSize: 14, color: '#FFFFFF'}}>Angepinnt</span> : null}
						<span style={{position: 'absolute', left: 8, bottom: 6, fontFamily: FONTS.body, fontWeight: 800, fontSize: 16, color: '#FFFFFF', textShadow: '0 1px 4px rgba(0,0,0,0.9)'}}>▷ {t.views}</span>
						{t.mark ? <span style={{position: 'absolute', right: 6, top: 6, padding: '2px 6px', borderRadius: 4, background: t.mark === 'NEU' ? '#3DDC97' : 'rgba(0,0,0,0.6)', fontFamily: FONTS.body, fontWeight: 800, fontSize: 13, color: t.mark === 'NEU' ? '#0B1029' : '#FFFFFF'}}>{t.mark}</span> : null}
					</div>
				))}
			</div>
		</div>
	);
};

export const CoverPreviewSheet: React.FC<{
	title: string;
	cover: React.ReactNode;
	/** Videoframe kurz nach Start (mit Untertitel), z. B. <Sequence from={-15}><Episode/></Sequence> */
	videoFrame: React.ReactNode;
	/** Vorgänger-Cover für das Profilraster (neueste zuerst) */
	previous?: {node: React.ReactNode; label: string}[];
	/** Beschreibungszeile im App-Overlay (TikTok-Titel, gekürzt; Standard = Teil 3) */
	caption?: string;
}> = ({title, cover, videoFrame, previous = [], caption = '76 FRAGEN – 4 DINGE SIND IMMER NOCH OFFEN! … mehr'}) => {
	const s = 0.5;
	return (
		<AbsoluteFill style={{background: '#0A0C1C', padding: '30px 40px'}}>
			<div style={{display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 24}}>
				<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, color: COLORS.text}}>TITELBILD-PRÜFUNG · {title}</span>
				<span style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 24, color: ACCENT.no}}>Prüfansicht – nicht zur Veröffentlichung · Bedienelemente neutral nachgezeichnet</span>
			</div>
			<div style={{display: 'flex', gap: 40, alignItems: 'flex-start'}}>
				<div>
					<Label n="1" title="9:16" sub="grün = Kernzone · rot = außerhalb 3:4" />
					<div style={{position: 'relative'}}>
						<Window width={W * s}>{cover}</Window>
						<Guides scale={s} />
					</div>
				</div>
				<div>
					<Label n="2" title="3:4 mittig" sub={`y ${COVER_ZONE.crop34Top}–${COVER_ZONE.crop34Bottom}`} />
					<Window width={W * s} y0={COVER_ZONE.crop34Top} h={CROP_H}>
						{cover}
					</Window>
				</div>
				<div>
					<Label n="3" title="Profilraster" sub="Kachel ≈ Handygröße ×2" />
					<ProfileGrid
						width={600}
						tiles={[
							{node: cover, views: '0', pinned: true, mark: 'NEU'},
							...previous.map((p) => ({node: p.node, views: '–', mark: p.label})),
							...new Array(Math.max(0, 6 - 1 - previous.length)).fill(0).map(() => ({node: null, views: '–'})),
						]}
					/>
				</div>
				<div>
					<Label n="4" title="Video + App" sub="Frame 15 mit Untertitel" />
					<Window width={W * s}>
						{videoFrame}
						<AppOverlay caption={caption} />
					</Window>
				</div>
			</div>
		</AbsoluteFill>
	);
};
