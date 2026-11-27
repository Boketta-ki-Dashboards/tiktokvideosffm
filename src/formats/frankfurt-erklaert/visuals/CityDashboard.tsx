import React from 'react';
import {COLORS, FONTS} from '../../../theme/tokens';
import {withAlpha} from '../../../lib/color';
import {DASHBOARD_LAYOUT, dashboardCell} from './city-dashboard-geometry';

/**
 * Bundesweites Stadt-Dashboard (Format B, erstmals #20 „Eine Woche danach“, 27.11.2026) – wiederverwendbar, datengetrieben, deterministisch.
 *
 * Journalistische Regeln sind in der Komponente verankert:
 * - alle Karten gleich groß, gleiche Typografie, keine Rangfolge, keine Platzierungen, keine gemeinsame Skala oder Summe;
 * - jede Hauptzahl steht direkt über ihrer eigenen Kategorie (`label`) und mit eigenem Meldestand (`stand`);
 * - fehlt eine Zahl, zeigt die Karte Text statt einer geschätzten Zahl (kein „0“).
 * Animation kommt von außen (`appear` je Karte 0…1, optional `from` = Startpunkt auf dem Bildschirm, `count` 0…1 für Zähler) – stehen alle
 * Werte auf 1, ist das Dashboard vollständig ruhig (Pausier-Bild, Infografik-PNG).
 */
export {DASHBOARD_LAYOUT, dashboardCell};

export type DashboardCard = {
	id: string;
	name: string;
	color: string;
	illustration?: React.ReactNode;
	value: string;
	/** Zahl für den Zähler (ohne Zusatz); fehlt sie, erscheint `value` sofort als Text. */
	count?: number;
	prefix?: string;
	label: string;
	extras: string[];
	stand: string;
	source: string;
};

const fmt = (n: number) => n.toLocaleString('de-DE');

const Card: React.FC<{card: DashboardCard; w: number; h: number; count: number}> = ({card, w, h, count}) => {
	const L = DASHBOARD_LAYOUT;
	const shown = card.count !== undefined ? `${card.prefix ?? ''}${fmt(Math.round(card.count * Math.min(1, Math.max(0, count))))}` : card.value;
	return (
		<div style={{position: 'relative', width: w, height: h, boxSizing: 'border-box', borderRadius: 22, overflow: 'hidden', background: 'linear-gradient(165deg, rgba(22,28,72,0.97) 0%, rgba(10,13,38,0.97) 70%)', border: `3px solid ${withAlpha(card.color, 0.85)}`, boxShadow: `0 16px 40px rgba(0,0,0,0.55), 0 0 26px ${withAlpha(card.color, 0.18)}`}}>
			{card.illustration ? <div style={{position: 'absolute', right: 10, top: 6, height: 44, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', opacity: 0.9}}>{card.illustration}</div> : null}
			<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 4, background: card.color}} />
			<div style={{position: 'absolute', left: 16, top: 14, display: 'flex', alignItems: 'center', gap: 10}}>
				<div style={{width: 14, height: 14, borderRadius: 7, background: card.color, boxShadow: `0 0 12px ${withAlpha(card.color, 0.9)}`}} />
				<span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: L.nameSize, letterSpacing: 1.5, color: '#FFFFFF', textShadow: '0 3px 10px rgba(0,0,0,0.8)'}}>{card.name}</span>
			</div>
			<div style={{position: 'absolute', left: 16, right: 12, top: 50}}>
				<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: L.valueSize, lineHeight: 1, letterSpacing: -0.5, color: card.color, whiteSpace: 'nowrap', textShadow: `0 0 24px ${withAlpha(card.color, 0.35)}`, fontVariantNumeric: 'tabular-nums'}}>{shown}</div>
				<div style={{marginTop: 4, fontFamily: FONTS.body, fontWeight: 800, fontSize: L.labelSize, lineHeight: 1.15, color: '#FFFFFF', whiteSpace: 'nowrap'}}>{card.label}</div>
				<div style={{marginTop: 4, display: 'flex', flexDirection: 'column', gap: 1}}>
					{card.extras.slice(0, 3).map((x) => (
						<div key={x} style={{display: 'flex', gap: 7, alignItems: 'baseline', fontFamily: FONTS.body, fontWeight: 700, fontSize: L.extraSize, lineHeight: 1.18, color: '#C9CEE0', whiteSpace: 'nowrap'}}>
							<span style={{color: card.color}}>•</span>
							<span>{x}</span>
						</div>
					))}
				</div>
			</div>
			<div style={{position: 'absolute', left: 16, right: 12, bottom: 8, fontFamily: FONTS.body, fontWeight: 800, fontSize: L.footSize, letterSpacing: 0.2, color: withAlpha('#FFFFFF', 0.74), whiteSpace: 'nowrap'}}>
				STAND {card.stand} · {card.source}
			</div>
		</div>
	);
};

/**
 * Vollständiges Dashboard (Überschrift, Hinweiszeile, 2 × 3 Karten). `appear[i]` blendet Karte i ein und bewegt sie von `from[i]`
 * (Bildschirmkoordinate, z. B. Stadtmarker der Karte) an ihren Rasterplatz; `head` blendet Überschrift und Hinweis ein.
 */
export const CityDashboard: React.FC<{
	kicker: string;
	title: string;
	hint: readonly string[];
	cards: DashboardCard[];
	appear: number[];
	count: number;
	head?: number;
	from?: Array<[number, number] | undefined>;
}> = ({kicker, title, hint, cards, appear, count, head = 1, from = []}) => {
	const L = DASHBOARD_LAYOUT;
	return (
		<>
			<div style={{position: 'absolute', left: L.left, width: L.width, top: L.top, opacity: head, translate: `0 ${(1 - head) * -16}px`}}>
				<div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 22, letterSpacing: 2, color: COLORS.signal, whiteSpace: 'nowrap'}}>{kicker}</div>
				<div style={{position: 'absolute', top: L.headerTitleTop - L.top, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 50, lineHeight: 1, letterSpacing: -0.5, color: '#FFFFFF', whiteSpace: 'nowrap', textShadow: '0 6px 20px rgba(0,0,0,0.8)'}}>{title}</div>
				<div style={{position: 'absolute', top: L.hintTop - L.top, display: 'flex', flexDirection: 'column', gap: 1}}>
					{hint.map((h) => (
						<div key={h} style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 19, lineHeight: 1.2, color: '#C9CEE0', whiteSpace: 'nowrap'}}>
							{h}
						</div>
					))}
				</div>
			</div>
			{cards.map((card, i) => {
				const cell = dashboardCell(i, cards.length);
				const a = Math.min(1, Math.max(0, appear[i] ?? 1));
				const o = from[i];
				const dx = o ? (o[0] - (cell.x + cell.w / 2)) * (1 - a) : 0;
				const dy = o ? (o[1] - (cell.y + cell.h / 2)) * (1 - a) : (1 - a) * 30;
				return (
					<div key={card.id} style={{position: 'absolute', left: cell.x, top: cell.y, width: cell.w, height: cell.h, opacity: Math.min(1, a * 1.6), translate: `${dx}px ${dy}px`, scale: String(0.35 + 0.65 * a), transformOrigin: '50% 50%'}}>
						<Card card={card} w={cell.w} h={cell.h} count={count} />
					</div>
				);
			})}
		</>
	);
};
