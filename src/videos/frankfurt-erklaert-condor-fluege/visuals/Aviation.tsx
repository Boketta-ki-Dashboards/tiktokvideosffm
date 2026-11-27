import React from 'react';
import {interpolate, random, useCurrentFrame} from 'remotion';
import {VectorPerson, type PersonPalette} from '../../../components/characters/VectorPerson';
import {clamp} from '../../../lib/animation';
import {withAlpha} from '../../../lib/color';

/**
 * Illustrationen für #17 „Krankheitsfälle auf zwei Condor-Flügen“ – alle stilisiert und im Bild als ILLUSTRATION gekennzeichnet:
 * Langstreckenjet mit zwei Triebwerken (Proportionen eines A330neo, neutrale Lackierung OHNE Airline-Logo/-Design), Draufsicht-Symbol,
 * Rettungswagen und Feuerwehrfahrzeug mit Blaulicht, Vorfeld mit Terminal und Tower, Kabine von vorn, Personenraster (620 an Bord),
 * Klinik, Mikroskop, abstrakte Virussymbole, Gesundheitsamt und Akte. Keine realen Personen, keine Gewalt, keine Panik.
 */

const NAVY = '#0B1029';
const BODY = '#EEF1F8';
const BODY_SHADE = '#C9D0E2';
const TAIL = '#2E3A6E';
const ENGINE = '#D8DDEA';

/* ------------------------------------------------------------------ Flugzeug (Seitenansicht) */

/**
 * Seitenansicht eines zweistrahligen Großraumjets (Länge = `width`, Höhe ≈ 0,3 × width). `gear` 0–1 fährt das Fahrwerk aus,
 * Positionslichter blinken über `useCurrentFrame`. `facing` -1 spiegelt (Flug nach links).
 */
export const Airliner: React.FC<{width: number; gear?: number; facing?: 1 | -1; lights?: boolean; doorOpen?: number; seed?: string}> = ({width, gear = 1, facing = 1, lights = true, doorOpen = 0, seed = 'a'}) => {
	const frame = useCurrentFrame();
	const h = width * 0.3;
	const beacon = lights && Math.floor((frame + random(seed) * 20) / 18) % 2 === 0;
	const strobe = lights && (frame + Math.floor(random(seed + 's') * 30)) % 36 < 3;
	const g = Math.max(0, Math.min(1, gear));
	const windows = new Array(42).fill(0).map((_, i) => 150 + i * 15.5).filter((x) => Math.abs(x - 330) > 14 && Math.abs(x - 600) > 14);
	return (
		<svg width={width} height={h} viewBox="0 0 1000 300" style={{overflow: 'visible'}}>
			<defs>
				<linearGradient id={`fus-${seed}`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#FFFFFF" />
					<stop offset="0.55" stopColor={BODY} />
					<stop offset="1" stopColor={BODY_SHADE} />
				</linearGradient>
				<linearGradient id={`tail-${seed}`} x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stopColor="#3B4A86" />
					<stop offset="1" stopColor={TAIL} />
				</linearGradient>
				<linearGradient id={`eng-${seed}`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#F4F6FB" />
					<stop offset="1" stopColor="#AEB6CC" />
				</linearGradient>
			</defs>
			<g transform={facing === -1 ? 'translate(1000 0) scale(-1 1)' : undefined}>
			{/* Fahrwerk */}
			{g > 0 ? (
				<g opacity={g}>
					<rect x={116} y={180} width={7} height={34 * g} fill="#6B7290" />
					<circle cx={119} cy={184 + 34 * g} r={10} fill="#1A1F33" stroke="#4A5170" strokeWidth={3} />
					{[520, 548, 590, 618].map((x) => (
						<g key={x}>
							<rect x={x - 3} y={186} width={6} height={36 * g} fill="#6B7290" />
							<circle cx={x} cy={190 + 36 * g} r={13} fill="#1A1F33" stroke="#4A5170" strokeWidth={3} />
						</g>
					))}
				</g>
			) : null}
			{/* Seitenleitwerk */}
			<path d="M 790 118 L 880 14 L 948 14 L 972 100 Z" fill={`url(#tail-${seed})`} stroke={NAVY} strokeWidth={2} />
			<path d="M 884 22 L 944 22" stroke={withAlpha('#FFFFFF', 0.25)} strokeWidth={3} />
			{/* Rumpf */}
			<path d="M 26 162 C 26 132, 58 116, 112 114 L 820 114 C 880 114, 930 104, 988 90 L 994 100 C 962 132, 904 170, 832 184 L 112 186 C 58 186, 26 182, 26 162 Z" fill={`url(#fus-${seed})`} stroke={NAVY} strokeWidth={2.5} />
			{/* Bauchlinie */}
			<path d="M 60 174 C 140 182, 700 182, 830 176" fill="none" stroke={withAlpha(NAVY, 0.18)} strokeWidth={6} />
			{/* Cockpit */}
			<path d="M 48 138 C 58 128, 74 124, 92 123 L 96 136 L 52 140 Z" fill="#243055" />
			{/* Fenster */}
			{windows.map((x) => (
				<rect key={x} x={x} y={130} width={7} height={11} rx={3.5} fill="#2C3A66" />
			))}
			{/* Türen */}
			{[140, 330, 600, 800].map((x, i) => (
				<g key={x}>
					<rect x={x - 9} y={120} width={18} height={44} rx={4} fill="none" stroke={withAlpha(NAVY, 0.4)} strokeWidth={2} />
					{i === 0 && doorOpen > 0 ? <rect x={x - 9} y={120} width={18 * doorOpen} height={44} rx={3} fill="#1B2140" /> : null}
				</g>
			))}
			{/* Höhenleitwerk */}
			<path d="M 868 124 L 958 104 L 978 110 L 904 132 Z" fill={BODY_SHADE} stroke={NAVY} strokeWidth={2} />
			{/* Tragfläche (nahe Seite, schmal) */}
			<path d="M 380 164 L 590 160 L 720 196 L 690 202 L 440 186 Z" fill="#D5DBEA" stroke={NAVY} strokeWidth={2} />
			{/* Triebwerk */}
			<path d="M 450 186 L 470 176 L 520 176 L 524 190 Z" fill="#B8C0D6" stroke={NAVY} strokeWidth={1.5} />
			<rect x={392} y={182} width={150} height={52} rx={24} fill={`url(#eng-${seed})`} stroke={NAVY} strokeWidth={2.5} />
			<ellipse cx={396} cy={208} rx={10} ry={25} fill="#2A3150" stroke={NAVY} strokeWidth={2} />
			<rect x={520} y={192} width={40} height={32} rx={12} fill={ENGINE} stroke={NAVY} strokeWidth={2} />
			{/* Lichter */}
			{beacon ? (
				<>
					<circle cx={480} cy={112} r={6} fill="#FF3B4E" />
					<circle cx={480} cy={112} r={16} fill={withAlpha('#FF3B4E', 0.35)} />
					<circle cx={480} cy={188} r={5} fill="#FF3B4E" />
				</>
			) : null}
			{strobe ? <circle cx={994} cy={96} r={14} fill={withAlpha('#FFFFFF', 0.85)} /> : null}
			<circle cx={994} cy={96} r={3} fill="#FFFFFF" />
			</g>
		</svg>
	);
};

/** Draufsicht-Symbol eines Langstreckenjets (für Karten), Nase zeigt nach rechts. */
export const PlaneIcon: React.FC<{size: number; color?: string}> = ({size, color = '#FFFFFF'}) => (
	<svg width={size} height={size} viewBox="-50 -50 100 100" style={{overflow: 'visible'}}>
		<path
			d="M 44 0 C 44 -4, 38 -5, 30 -5 L 8 -5 L -14 -40 L -24 -40 L -10 -5 L -30 -5 L -38 -18 L -46 -18 L -40 0 L -46 18 L -38 18 L -30 5 L -10 5 L -24 40 L -14 40 L 8 5 L 30 5 C 38 5, 44 4, 44 0 Z"
			fill={color}
			stroke={NAVY}
			strokeWidth={3}
			strokeLinejoin="round"
		/>
	</svg>
);

/* ------------------------------------------------------------------ Einsatzfahrzeuge */

/** Rettungswagen (Seitenansicht, Breite `width`), Blaulichter blinken wechselweise. Neutral beschriftet („RETTUNGSDIENST“). */
export const Ambulance: React.FC<{width: number; lights?: number; seed?: string; facing?: 1 | -1}> = ({width, lights = 1, seed = 'rtw', facing = 1}) => {
	const frame = useCurrentFrame();
	const ph = Math.floor((frame + random(seed) * 10) / 5) % 2;
	const on = lights > 0.05;
	return (
		<svg width={width} height={width * 0.52} viewBox="0 0 360 188" style={{overflow: 'visible'}}>
			<g transform={facing === -1 ? 'translate(360 0) scale(-1 1)' : undefined}>
			{/* Blaulicht-Schein */}
			{on ? <ellipse cx={180} cy={14} rx={150} ry={40} fill={withAlpha('#3D7BFF', 0.22 * lights * (ph ? 1 : 0.6))} /> : null}
			{/* Kofferaufbau */}
			<path d="M 10 30 L 240 30 L 240 150 L 10 150 Z" fill="#F4F6FA" stroke={NAVY} strokeWidth={3} />
			{/* Fahrerhaus */}
			<path d="M 240 60 L 300 60 L 344 104 L 350 150 L 240 150 Z" fill="#F4F6FA" stroke={NAVY} strokeWidth={3} />
			<path d="M 252 70 L 296 70 L 330 104 L 252 104 Z" fill="#2C3A66" />
			{/* Warnstreifen */}
			<rect x={10} y={102} width={340} height={14} fill="#E63946" />
			<rect x={10} y={118} width={340} height={8} fill="#FFD23F" />
			{/* Kreuz + Beschriftung */}
			<rect x={56} y={50} width={14} height={40} fill="#E63946" />
			<rect x={43} y={63} width={40} height={14} fill="#E63946" />
			<text x={160} y={82} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={900} fontSize={17} fill="#1B2140" transform={facing === -1 ? 'translate(320 0) scale(-1 1)' : undefined}>RETTUNGSDIENST</text>
			{/* Hecktür */}
			<line x1={22} y1={36} x2={22} y2={146} stroke={withAlpha(NAVY, 0.3)} strokeWidth={2} />
			{/* Räder */}
			{[70, 290].map((x) => (
				<g key={x}>
					<circle cx={x} cy={154} r={24} fill="#1A1F33" stroke={NAVY} strokeWidth={3} />
					<circle cx={x} cy={154} r={10} fill="#8A93B0" />
				</g>
			))}
			{/* Blaulichter */}
			{[30, 210, 270].map((x, i) => (
				<g key={x}>
					<rect x={x - 12} y={i === 2 ? 48 : 18} width={24} height={12} rx={4} fill={on && (i + ph) % 2 === 0 ? '#5A9BFF' : '#2A3F7A'} stroke={NAVY} strokeWidth={2} />
					{on && (i + ph) % 2 === 0 ? <circle cx={x} cy={i === 2 ? 54 : 24} r={22} fill={withAlpha('#5A9BFF', 0.35 * lights)} /> : null}
				</g>
			))}
			</g>
		</svg>
	);
};

/** Feuerwehrfahrzeug (Seitenansicht), rot, Blaulichter. */
export const FireTruck: React.FC<{width: number; lights?: number; seed?: string}> = ({width, lights = 1, seed = 'fw'}) => {
	const frame = useCurrentFrame();
	const ph = Math.floor((frame + random(seed) * 10) / 6) % 2;
	return (
		<svg width={width} height={width * 0.46} viewBox="0 0 420 194" style={{overflow: 'visible'}}>
			{lights > 0.05 ? <ellipse cx={330} cy={30} rx={110} ry={34} fill={withAlpha('#3D7BFF', 0.2 * lights * (ph ? 1 : 0.6))} /> : null}
			<path d="M 10 50 L 300 50 L 300 156 L 10 156 Z" fill="#D7263D" stroke={NAVY} strokeWidth={3} />
			<path d="M 300 56 L 372 56 L 408 110 L 410 156 L 300 156 Z" fill="#D7263D" stroke={NAVY} strokeWidth={3} />
			<path d="M 312 66 L 366 66 L 394 108 L 312 108 Z" fill="#2C3A66" />
			{[30, 100, 170, 240].map((x) => (
				<rect key={x} x={x} y={66} width={54} height={62} rx={4} fill="#B81F33" stroke={withAlpha(NAVY, 0.5)} strokeWidth={2} />
			))}
			<rect x={10} y={132} width={400} height={10} fill="#F4F6FA" />
			<rect x={20} y={38} width={250} height={10} rx={3} fill="#C9CED9" stroke={NAVY} strokeWidth={2} />
			{[70, 230, 360].map((x) => (
				<g key={x}>
					<circle cx={x} cy={160} r={24} fill="#1A1F33" stroke={NAVY} strokeWidth={3} />
					<circle cx={x} cy={160} r={10} fill="#8A93B0" />
				</g>
			))}
			{[330, 360].map((x, i) => (
				<g key={x}>
					<rect x={x - 11} y={42} width={22} height={12} rx={4} fill={(i + ph) % 2 === 0 && lights > 0.05 ? '#5A9BFF' : '#2A3F7A'} stroke={NAVY} strokeWidth={2} />
					{(i + ph) % 2 === 0 && lights > 0.05 ? <circle cx={x} cy={48} r={20} fill={withAlpha('#5A9BFF', 0.35 * lights)} /> : null}
				</g>
			))}
		</svg>
	);
};

/** Fahrbare Passagiertreppe (Seitenansicht, Treppe steigt nach rechts zur Tür). */
export const AirStairs: React.FC<{width: number}> = ({width}) => (
	<svg width={width} height={width * 0.8} viewBox="0 0 200 160" style={{overflow: 'visible'}}>
		<path d="M 10 130 L 190 130 L 190 142 L 10 142 Z" fill="#E7EBF3" stroke={NAVY} strokeWidth={2.5} />
		<path d="M 30 130 L 150 20 L 190 20 L 190 30 L 160 30 L 44 130 Z" fill="#F4F6FA" stroke={NAVY} strokeWidth={2.5} />
		{new Array(9).fill(0).map((_, i) => (
			<line key={i} x1={44 + i * 13} y1={122 - i * 11.6} x2={60 + i * 13} y2={122 - i * 11.6} stroke={withAlpha(NAVY, 0.5)} strokeWidth={2} />
		))}
		<path d="M 30 100 L 150 -6 L 190 -6" fill="none" stroke="#FFB547" strokeWidth={4} />
		{[40, 160].map((x) => (
			<circle key={x} cx={x} cy={148} r={10} fill="#1A1F33" />
		))}
	</svg>
);

/* ------------------------------------------------------------------ Vorfeld mit Terminal und Tower */

const PALETTES: Record<string, PersonPalette> = {
	medic: {skin: '#E8B48A', shirt: '#E63946', pants: '#F4F6FA', hair: '#3A2A1E'},
	medic2: {skin: '#C68A5E', shirt: '#E63946', pants: '#F4F6FA', hair: '#1E1A16'},
	ground: {skin: '#F1C9A5', shirt: '#FF9F43', pants: '#2A3150', hair: '#6B3E26'},
	fire: {skin: '#D9A47A', shirt: '#2E3A6E', pants: '#2E3A6E', hair: '#2A1E16'},
};

/**
 * Vorfeld des Flughafens (SVG 1080 × 1180, Morgenstimmung): Terminal mit Fluggastbrücken, Tower, Rollbahnmarkierungen, ein Jet
 * (`planeX`/`planeY`/`planeScale`/`gear`), wartende Einsatzfahrzeuge mit Blaulicht (`vehicles` 0–1 fahren ein) und Einsatzkräfte
 * (`crew` 0–1). `stairs` 0–1 schiebt eine Treppe an die vordere Tür. Alles stilisiert (ILLUSTRATION).
 */
export const Apron: React.FC<{planeX: number; planeY: number; planeScale?: number; gear?: number; vehicles?: number; crew?: number; stairs?: number; lights?: number; doorOpen?: number}> = ({planeX, planeY, planeScale = 1, gear = 1, vehicles = 1, crew = 1, stairs = 0, lights = 1, doorOpen = 0}) => {
	const frame = useCurrentFrame();
	const horizon = 560;
	const pw = 900 * planeScale;
	const veh = (i: number) => interpolate(vehicles, [i * 0.18, i * 0.18 + 0.4], [0, 1], clamp);
	const vehs = [
		{kind: 'rtw', x: 40, y: 940, w: 280},
		{kind: 'rtw', x: 330, y: 960, w: 280},
		{kind: 'fw', x: 650, y: 920, w: 330},
		{kind: 'rtw', x: 760, y: 1010, w: 250},
	];
	return (
		<svg width={1080} height={1180} viewBox="0 0 1080 1180" style={{position: 'absolute', left: 0, top: 0, overflow: 'hidden'}}>
			<defs>
				<linearGradient id="apr-sky" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#1B2350" />
					<stop offset="0.6" stopColor="#4A4F7E" />
					<stop offset="1" stopColor="#B88A8F" />
				</linearGradient>
				<linearGradient id="apr-ground" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#4A4F66" />
					<stop offset="1" stopColor="#262A3C" />
				</linearGradient>
			</defs>
			<rect width={1080} height={horizon} fill="url(#apr-sky)" />
			{/* Wolkenbänder */}
			{[0, 1, 2].map((i) => (
				<ellipse key={i} cx={((i * 420 + frame * (0.4 + i * 0.15)) % 1500) - 200} cy={160 + i * 90} rx={260} ry={22} fill={withAlpha('#FFFFFF', 0.06)} />
			))}
			{/* Skyline in der Ferne */}
			<g opacity={0.5}>
				{[60, 110, 150, 205, 250, 300].map((x, i) => (
					<rect key={x} x={x} y={horizon - 70 - (i % 3) * 30} width={34} height={70 + (i % 3) * 30} fill="#2A2F55" />
				))}
			</g>
			{/* Tower */}
			<g>
				<rect x={826} y={300} width={26} height={horizon - 300} fill="#3A4170" stroke={NAVY} strokeWidth={2} />
				<path d="M 800 300 L 878 300 L 890 270 L 788 270 Z" fill="#4C5590" stroke={NAVY} strokeWidth={2} />
				<rect x={796} y={246} width={86} height={24} fill="#7FA8E8" stroke={NAVY} strokeWidth={2} />
				<rect x={806} y={236} width={66} height={10} fill="#3A4170" />
				<line x1={839} y1={236} x2={839} y2={206} stroke="#3A4170" strokeWidth={3} />
				<circle cx={839} cy={204} r={4} fill={Math.floor(frame / 15) % 2 ? '#FF3B4E' : '#7A2030'} />
			</g>
			{/* Terminal */}
			<rect x={0} y={horizon - 96} width={1080} height={96} fill="#353B66" stroke={NAVY} strokeWidth={2} />
			<rect x={0} y={horizon - 96} width={1080} height={16} fill="#454C82" />
			{new Array(36).fill(0).map((_, i) => (
				<rect key={i} x={10 + i * 30} y={horizon - 70} width={22} height={40} fill={withAlpha('#9EC2FF', 0.25 + (i % 4 === 0 ? 0.25 : 0))} />
			))}
			{/* Fluggastbrücken */}
			{[160, 470].map((x) => (
				<g key={x}>
					<path d={`M ${x} ${horizon - 40} L ${x + 120} ${horizon - 20} L ${x + 120} ${horizon + 6} L ${x} ${horizon - 14} Z`} fill="#5A6196" stroke={NAVY} strokeWidth={2} />
					<rect x={x + 112} y={horizon + 6} width={8} height={40} fill="#3A4170" />
				</g>
			))}
			{/* Boden + Markierungen */}
			<rect x={0} y={horizon} width={1080} height={1180 - horizon} fill="url(#apr-ground)" />
			{[-600, -200, 200, 600, 1000, 1400].map((x) => (
				<line key={x} x1={540 + (x - 540) * 0.08} y1={horizon} x2={x} y2={1180} stroke={withAlpha('#FFD23F', 0.35)} strokeWidth={4} />
			))}
			<path d={`M 0 ${horizon + 210} C 300 ${horizon + 180}, 700 ${horizon + 180}, 1080 ${horizon + 220}`} fill="none" stroke={withAlpha('#FFD23F', 0.7)} strokeWidth={6} />
			<path d={`M 0 ${horizon + 210} C 300 ${horizon + 180}, 700 ${horizon + 180}, 1080 ${horizon + 220}`} fill="none" stroke={withAlpha('#FFD23F', 0.18)} strokeWidth={22} />
			{/* Blaulicht-Reflexe am Boden */}
			{lights > 0.05 ? <ellipse cx={540} cy={1040} rx={560} ry={120} fill={withAlpha('#3D7BFF', 0.1 * lights * (Math.floor(frame / 5) % 2 ? 1 : 0.5))} /> : null}
			{/* Flugzeug */}
			<g transform={`translate(${planeX - pw / 2} ${planeY - pw * 0.3 * 0.62})`}>
				<Airliner width={pw} gear={gear} seed="apr" doorOpen={doorOpen} />
			</g>
			{/* Treppe an der vorderen Tür */}
			{stairs > 0 ? (
				<g transform={`translate(${planeX - pw / 2 + pw * 0.14 - 190 * planeScale + (1 - stairs) * -260} ${planeY - pw * 0.3 * 0.62 + pw * 0.3 * 0.4 - 4})`} opacity={Math.min(1, stairs * 2)}>
					<AirStairs width={200 * planeScale} />
				</g>
			) : null}
			{/* Einsatzkräfte */}
			{crew > 0 ? (
				<g opacity={Math.min(1, crew * 2)}>
					{[
						{x: 150, p: PALETTES.medic, f: 1 as const},
						{x: 205, p: PALETTES.medic2, f: -1 as const},
						{x: 470, p: PALETTES.ground, f: 1 as const},
						{x: 620, p: PALETTES.medic, f: -1 as const},
						{x: 900, p: PALETTES.fire, f: -1 as const},
					].map((m, i) => (
						<VectorPerson key={i} x={m.x + (1 - crew) * (i % 2 ? 40 : -40)} y={905 + (i % 2) * 12} height={130} palette={m.p} hair={i % 3 === 0 ? 'cap' : 'short'} walkPhase={crew < 1 ? frame / 6 + i : null} facing={m.f} />
					))}
				</g>
			) : null}
			{/* Fahrzeuge */}
			{vehs.map((v, i) => {
				const o = veh(i);
				if (o <= 0) return null;
				const dx = (1 - o) * (v.x < 540 ? -420 : 420);
				return (
					<g key={i} transform={`translate(${v.x + dx} ${v.y - v.w * 0.5})`} opacity={Math.min(1, o * 2)}>
						{v.kind === 'fw' ? <FireTruck width={v.w} lights={lights} seed={`fw${i}`} /> : <Ambulance width={v.w} lights={lights} seed={`rtw${i}`} facing={v.x < 540 ? 1 : -1} />}
					</g>
				);
			})}
		</svg>
	);
};

/* ------------------------------------------------------------------ Kabine von vorn */

const SKIN = ['#F1C9A5', '#E8B48A', '#C68A5E', '#8D5A3B', '#F5D6BE'];
const HAIR = ['#3A2A1E', '#6B3E26', '#1E1A16', '#C9A15A', '#8A8A8A'];

/**
 * Kabine eines Großraumjets, Blick von vorn den Gang entlang (SVG 1080 × 1100). Sitzreihen links/rechts mit Fluggästen (Köpfe/Schultern),
 * `unwell` (Liste von Sitz-Indizes) zeigt einzelne Reisende mit Unwohlsein (blasser Ton, Wirbel-Symbol, Hand am Bauch) – zurückhaltend,
 * ohne Erbrechen. `crew` 0–1 lässt eine Flugbegleiterin mit Becher im Gang erscheinen. ILLUSTRATION.
 */
export const Cabin: React.FC<{unwell: number[]; unwellOn: number; crew: number; drift?: number}> = ({unwell, unwellOn, crew, drift = 0}) => {
	const frame = useCurrentFrame();
	const vx = 540 + drift * 30;
	const vy = 420;
	const rows = 6;
	const depth = (r: number) => 1 - r * 0.13; // vorn 1 → hinten 0,35
	const seats: {x: number; y: number; s: number; side: number; seat: number; idx: number}[] = [];
	let idx = 0;
	for (let r = rows - 1; r >= 0; r--) {
		const s = depth(r);
		const y = vy + (1100 - vy) * s * 0.62;
		for (const side of [-1, 1]) {
			for (let k = 0; k < 2; k++) {
				const x = vx + side * (120 + k * 175) * s;
				seats.push({x, y, s, side, seat: k, idx: idx++});
			}
		}
	}
	const ring = (frame % 50) / 50;
	return (
		<svg width={1080} height={1100} viewBox="0 0 1080 1100" style={{position: 'absolute', left: 0, top: 0}}>
			<defs>
				<linearGradient id="cab-wall" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#E9ECF5" />
					<stop offset="1" stopColor="#B9C1D6" />
				</linearGradient>
				<radialGradient id="cab-light" cx="50%" cy="20%" r="70%">
					<stop offset="0" stopColor={withAlpha('#FFE7C2', 0.35)} />
					<stop offset="1" stopColor="rgba(0,0,0,0)" />
				</radialGradient>
			</defs>
			<rect width={1080} height={1100} fill="#C7CDDE" />
			{/* Decke + Gepäckfächer */}
			<path d={`M 0 0 L 1080 0 L ${vx + 120} ${vy - 120} L ${vx - 120} ${vy - 120} Z`} fill="#F2F4FA" />
			<path d={`M 0 0 L ${vx - 120} ${vy - 120} L ${vx - 150} ${vy - 40} L 0 230 Z`} fill="#DDE2EE" stroke="#9AA3BE" strokeWidth={2} />
			<path d={`M 1080 0 L ${vx + 120} ${vy - 120} L ${vx + 150} ${vy - 40} L 1080 230 Z`} fill="#DDE2EE" stroke="#9AA3BE" strokeWidth={2} />
			{[0.25, 0.5, 0.75].map((t) => (
				<g key={t}>
					<line x1={t * (vx - 120)} y1={t * (vy - 120)} x2={t * (vx - 150)} y2={230 + t * (vy - 40 - 230)} stroke="#9AA3BE" strokeWidth={2} />
					<line x1={1080 - t * (1080 - vx - 120)} y1={t * (vy - 120)} x2={1080 - t * (1080 - vx - 150)} y2={230 + t * (vy - 40 - 230)} stroke="#9AA3BE" strokeWidth={2} />
				</g>
			))}
			{/* Seitenwände mit Fenstern */}
			<path d={`M 0 230 L ${vx - 150} ${vy - 40} L ${vx - 150} ${vy + 120} L 0 1100 Z`} fill="url(#cab-wall)" />
			<path d={`M 1080 230 L ${vx + 150} ${vy - 40} L ${vx + 150} ${vy + 120} L 1080 1100 Z`} fill="url(#cab-wall)" />
			{[0.15, 0.35, 0.55, 0.72].map((t) => {
				const xl = t * (vx - 150);
				const yl = 300 + t * (vy - 300);
				const w = 46 * (1 - t * 0.7);
				return (
					<g key={t}>
						<rect x={xl + 10} y={yl} width={w * 0.7} height={w} rx={w * 0.3} fill="#7FA8E8" stroke="#8C95B2" strokeWidth={2} />
						<rect x={1080 - xl - 10 - w * 0.7} y={yl} width={w * 0.7} height={w} rx={w * 0.3} fill="#7FA8E8" stroke="#8C95B2" strokeWidth={2} />
					</g>
				);
			})}
			{/* Rückwand + Gang */}
			<rect x={vx - 150} y={vy - 40} width={300} height={160} fill="#AEB6CC" />
			<path d={`M ${vx - 40} ${vy + 120} L ${vx + 40} ${vy + 120} L ${vx + 160} 1100 L ${vx - 160} 1100 Z`} fill="#5A6290" />
			<path d={`M ${vx - 6} ${vy + 120} L ${vx + 6} ${vy + 120} L ${vx + 24} 1100 L ${vx - 24} 1100 Z`} fill={withAlpha('#FFD23F', 0.25)} />
			<rect width={1080} height={1100} fill="url(#cab-light)" />
			{/* Sitze + Fluggäste (hinten → vorn) */}
			{seats.map((st) => {
				const sick = unwell.includes(st.idx);
				const sk = SKIN[st.idx % SKIN.length];
				const hr = HAIR[(st.idx * 3) % HAIR.length];
				const w = 150 * st.s;
				const hh = 190 * st.s;
				const sway = Math.sin(frame / 30 + st.idx) * 2 * st.s;
				const pale = sick ? unwellOn : 0;
				const slump = sick ? unwellOn * 8 * st.s : 0;
				return (
					<g key={st.idx} transform={`translate(${st.x - w / 2} ${st.y - hh})`}>
						{/* Kopf + Schultern */}
						<g transform={`translate(${sway} ${slump}) rotate(${sick ? -8 * unwellOn * st.side : 0} ${w / 2} ${hh * 0.4})`}>
							<path d={`M ${w * 0.18} ${hh * 0.78} C ${w * 0.2} ${hh * 0.56}, ${w * 0.8} ${hh * 0.56}, ${w * 0.82} ${hh * 0.78} Z`} fill={['#46C2FF', '#B794F6', '#3DDC97', '#FF9F43', '#FF6A78'][st.idx % 5]} />
							<circle cx={w / 2} cy={hh * 0.42} r={w * 0.17} fill={sk} />
							<circle cx={w / 2} cy={hh * 0.42} r={w * 0.17} fill={withAlpha('#BFE3C0', 0.45 * pale)} />
							<path d={`M ${w * 0.33} ${hh * 0.38} C ${w * 0.33} ${hh * 0.22}, ${w * 0.67} ${hh * 0.22}, ${w * 0.67} ${hh * 0.38} C ${w * 0.6} ${hh * 0.32}, ${w * 0.4} ${hh * 0.32}, ${w * 0.33} ${hh * 0.38} Z`} fill={hr} />
							{sick ? <path d={`M ${w * 0.42} ${hh * 0.86} q ${w * 0.08} ${-hh * 0.06} ${w * 0.16} 0`} stroke={sk} strokeWidth={w * 0.06} strokeLinecap="round" fill="none" opacity={unwellOn} /> : null}
						</g>
						{/* Sitzlehne */}
						<rect x={0} y={hh * 0.58} width={w} height={hh * 0.5} rx={w * 0.12} fill="#2E3A6E" stroke={NAVY} strokeWidth={2} />
						<rect x={w * 0.1} y={hh * 0.62} width={w * 0.8} height={hh * 0.1} rx={4} fill="#3F4C88" />
						{/* Unwohlsein-Symbol */}
						{sick && unwellOn > 0.05 ? (
							<g transform={`translate(${w * 0.5} ${hh * 0.05})`} opacity={unwellOn}>
								<circle r={w * 0.16} fill="rgba(8,10,28,0.85)" stroke="#9BE38E" strokeWidth={3} />
								<path d={`M ${-w * 0.08} 0 a ${w * 0.08} ${w * 0.08} 0 1 1 ${w * 0.08} ${w * 0.08} a ${w * 0.05} ${w * 0.05} 0 1 1 ${-w * 0.03} ${-w * 0.07}`} fill="none" stroke="#9BE38E" strokeWidth={3} strokeLinecap="round" transform={`rotate(${frame * 4})`} />
								<circle r={w * (0.16 + ring * 0.1)} fill="none" stroke={withAlpha('#9BE38E', 0.5 * (1 - ring))} strokeWidth={2} />
							</g>
						) : null}
					</g>
				);
			})}
			{/* Flugbegleiterin im Gang */}
			{crew > 0 ? (
				<g opacity={Math.min(1, crew * 2)} transform={`translate(${(1 - crew) * 40} 0)`}>
					<VectorPerson x={vx + 10} y={1060} height={430} palette={{skin: '#E8B48A', shirt: '#2E3A6E', pants: '#2E3A6E', hair: '#3A2A1E'}} hair="bun" walkPhase={null} facing={-1} />
					<rect x={vx - 80} y={760} width={30} height={36} rx={5} fill="#F4F6FA" stroke={NAVY} strokeWidth={2} />
				</g>
			) : null}
		</svg>
	);
};

/* ------------------------------------------------------------------ Personenraster */

/**
 * 620 Personen-Symbole (31 × 20). `onCount` füllt von links oben (Zähler), `hot` markiert die ersten `hot` Personen in einer
 * ruhigen, zufälligen Verteilung orange (laut Condor ≈ 30), `extra` weitere gestrichelt (andere Berichte: 40). Keine Aussage über Sitzplätze.
 */
export const PeopleGrid: React.FC<{width: number; onCount: number; hot: number; hotOn: number; extra: number; extraOn: number}> = ({width, onCount, hot, hotOn, extra, extraOn}) => {
	const frame = useCurrentFrame();
	const cols = 31;
	const rows = 20;
	const cw = width / cols;
	const ch = cw * 1.25;
	const order = React.useMemo(() => {
		const ids = new Array(cols * rows).fill(0).map((_, i) => i);
		return ids.sort((a, b) => random(`pg-${a}`) - random(`pg-${b}`));
	}, []);
	const hotSet = new Set(order.slice(0, hot));
	const extraSet = new Set(order.slice(hot, hot + extra));
	const pulse = 0.5 + 0.5 * Math.sin(frame / 7);
	return (
		<svg width={width} height={rows * ch} viewBox={`0 0 ${width} ${rows * ch}`}>
			{new Array(cols * rows).fill(0).map((_, i) => {
				const c = i % cols;
				const r = Math.floor(i / cols);
				const x = c * cw + cw / 2;
				const y = r * ch + ch * 0.45;
				const on = i < onCount;
				const isHot = hotSet.has(i) && hotOn > 0;
				const isExtra = extraSet.has(i) && extraOn > 0;
				const col = isHot ? '#FF9F43' : '#9AA6CC';
				const op = on ? (isHot ? 0.5 + 0.5 * hotOn : 0.55) : 0.08;
				return (
					<g key={i} opacity={op}>
						{isExtra ? (
							<g opacity={extraOn}>
								<circle cx={x} cy={y - cw * 0.16} r={cw * 0.17} fill="none" stroke="#FFD23F" strokeWidth={1.6} strokeDasharray="2 2" />
								<path d={`M ${x - cw * 0.3} ${y + cw * 0.36} q ${cw * 0.3} ${-cw * 0.5} ${cw * 0.6} 0`} fill="none" stroke="#FFD23F" strokeWidth={1.6} strokeDasharray="2 2" />
							</g>
						) : (
							<>
								<circle cx={x} cy={y - cw * 0.16} r={cw * 0.17 * (isHot ? 1 + 0.15 * pulse * hotOn : 1)} fill={col} />
								<path d={`M ${x - cw * 0.3} ${y + cw * 0.36} q ${cw * 0.3} ${-cw * 0.5} ${cw * 0.6} 0 z`} fill={col} />
							</>
						)}
					</g>
				);
			})}
		</svg>
	);
};

/* ------------------------------------------------------------------ Klinik, Labor, Amt */

/** Krankenhaus-Gebäude mit Kreuz (stilisiert). */
export const Hospital: React.FC<{width: number; glow?: number}> = ({width, glow = 1}) => {
	const frame = useCurrentFrame();
	return (
		<svg width={width} height={width * 0.8} viewBox="0 0 400 320" style={{overflow: 'visible'}}>
			<ellipse cx={200} cy={300} rx={190} ry={16} fill="rgba(0,0,0,0.35)" />
			<rect x={40} y={90} width={320} height={210} fill="#E9ECF5" stroke={NAVY} strokeWidth={3} />
			<rect x={140} y={40} width={120} height={60} fill="#DDE2EE" stroke={NAVY} strokeWidth={3} />
			<rect x={186} y={50} width={28} height={40} fill="#E63946" />
			<rect x={180} y={56} width={40} height={0} fill="#E63946" />
			<rect x={174} y={60} width={52} height={20} fill="#E63946" />
			{new Array(12).fill(0).map((_, i) => (
				<rect key={i} x={62 + (i % 6) * 48} y={118 + Math.floor(i / 6) * 60} width={30} height={36} fill={withAlpha('#9EC2FF', 0.5 + 0.3 * Math.sin(frame / 20 + i) * glow)} stroke={NAVY} strokeWidth={2} />
			))}
			<rect x={170} y={240} width={60} height={60} fill="#2C3A66" stroke={NAVY} strokeWidth={3} />
			<rect x={60} y={248} width={90} height={22} rx={4} fill="#E63946" />
			<text x={105} y={264} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={900} fontSize={13} fill="#FFFFFF">NOTAUFNAHME</text>
		</svg>
	);
};

/** Mikroskop (stilisiert). */
export const Microscope: React.FC<{size: number}> = ({size}) => (
	<svg width={size} height={size} viewBox="0 0 200 200" style={{overflow: 'visible'}}>
		<rect x={30} y={170} width={140} height={18} rx={6} fill="#C9D0E2" stroke={NAVY} strokeWidth={3} />
		<path d="M 120 170 C 150 150, 150 100, 120 80" fill="none" stroke="#9AA6CC" strokeWidth={14} strokeLinecap="round" />
		<rect x={60} y={120} width={80} height={12} rx={4} fill="#DDE2EE" stroke={NAVY} strokeWidth={3} />
		<g transform="rotate(-25 100 70)">
			<rect x={86} y={20} width={28} height={90} rx={8} fill="#EEF1F8" stroke={NAVY} strokeWidth={3} />
			<rect x={90} y={6} width={20} height={18} rx={4} fill="#2E3A6E" />
			<rect x={92} y={108} width={16} height={16} fill="#2E3A6E" />
		</g>
		<circle cx={98} cy={140} r={6} fill="#46C2FF" />
	</svg>
);

/** Abstraktes Virussymbol (Kugel mit Spikes) – rein symbolisch, keine Diagnose. */
export const VirusGlyph: React.FC<{size: number; color?: string; spin?: number; dashed?: boolean}> = ({size, color = '#9BE38E', spin = 0, dashed = false}) => (
	<svg width={size} height={size} viewBox="-50 -50 100 100" style={{overflow: 'visible', rotate: `${spin}deg`}}>
		{new Array(12).fill(0).map((_, i) => {
			const a = (i / 12) * Math.PI * 2;
			return (
				<g key={i}>
					<line x1={Math.cos(a) * 26} y1={Math.sin(a) * 26} x2={Math.cos(a) * 40} y2={Math.sin(a) * 40} stroke={color} strokeWidth={4} strokeLinecap="round" strokeDasharray={dashed ? '3 3' : undefined} />
					<circle cx={Math.cos(a) * 42} cy={Math.sin(a) * 42} r={5} fill={dashed ? 'none' : color} stroke={color} strokeWidth={2} />
				</g>
			);
		})}
		<circle r={27} fill={dashed ? 'none' : withAlpha(color, 0.35)} stroke={color} strokeWidth={4} strokeDasharray={dashed ? '6 4' : undefined} />
		{dashed ? null : (
			<>
				<circle cx={-8} cy={-6} r={5} fill={withAlpha(color, 0.8)} />
				<circle cx={9} cy={8} r={4} fill={withAlpha(color, 0.8)} />
			</>
		)}
	</svg>
);

/** Amtsgebäude mit neutraler Aufschrift (keine echte Fassade, kein Logo). */
export const OfficeBuilding: React.FC<{width: number; label: string}> = ({width, label}) => {
	const frame = useCurrentFrame();
	return (
		<svg width={width} height={width * 0.75} viewBox="0 0 400 300" style={{overflow: 'visible'}}>
			<ellipse cx={200} cy={290} rx={190} ry={12} fill="rgba(0,0,0,0.35)" />
			<path d="M 30 90 L 200 30 L 370 90 Z" fill="#4C5590" stroke={NAVY} strokeWidth={3} />
			<rect x={40} y={90} width={320} height={200} fill="#DDE2EE" stroke={NAVY} strokeWidth={3} />
			{[70, 130, 190, 250, 310].map((x) => (
				<rect key={x} x={x - 8} y={100} width={16} height={190} fill="#C9D0E2" stroke={withAlpha(NAVY, 0.4)} strokeWidth={2} />
			))}
			{new Array(8).fill(0).map((_, i) => (
				<rect key={i} x={84 + (i % 4) * 60} y={130 + Math.floor(i / 4) * 70} width={30} height={40} fill={withAlpha('#FFE7A0', 0.35 + 0.25 * Math.sin(frame / 25 + i))} stroke={NAVY} strokeWidth={2} />
			))}
			<rect x={95} y={66} width={210} height={26} rx={4} fill={NAVY} />
			<text x={200} y={85} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={900} fontSize={16} letterSpacing={1} fill="#FFFFFF">{label}</text>
		</svg>
	);
};

/** Untersuchungsakte mit zwei Flugsymbolen, Verbindungslinie und Fragezeichen (offene Frage, ob ein Zusammenhang besteht). */
export const CaseFile: React.FC<{width: number; link: number; labels: [string, string]}> = ({width, link, labels}) => {
	const frame = useCurrentFrame();
	const dash = -frame * 1.5;
	return (
		<svg width={width} height={width * 0.7} viewBox="0 0 500 350" style={{overflow: 'visible'}}>
			<path d="M 20 40 L 180 40 L 205 64 L 480 64 L 480 330 L 20 330 Z" fill="#F3D9A4" stroke={NAVY} strokeWidth={3} />
			<rect x={36} y={80} width={428} height={236} rx={8} fill="#FBF7EE" stroke={withAlpha(NAVY, 0.4)} strokeWidth={2} />
			{[0, 1].map((i) => (
				<g key={i} transform={`translate(${i ? 360 : 140} 170)`}>
					<circle r={52} fill={withAlpha('#2E3A6E', 0.1)} stroke="#2E3A6E" strokeWidth={3} />
					<g transform={`rotate(${i ? 180 : 0}) scale(0.9)`}>
						<path d="M 44 0 C 44 -4, 38 -5, 30 -5 L 8 -5 L -14 -40 L -24 -40 L -10 -5 L -30 -5 L -38 -18 L -46 -18 L -40 0 L -46 18 L -38 18 L -30 5 L -10 5 L -24 40 L -14 40 L 8 5 L 30 5 C 38 5, 44 4, 44 0 Z" fill="#2E3A6E" />
					</g>
					<text y={86} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={900} fontSize={22} fill="#1B2140">{labels[i]}</text>
				</g>
			))}
			<line x1={196} y1={170} x2={196 + 108 * link} y2={170} stroke="#E63946" strokeWidth={5} strokeDasharray="10 8" strokeDashoffset={dash} />
			{link > 0.5 ? (
				<g transform="translate(250 170)" opacity={Math.min(1, (link - 0.5) * 3)}>
					<circle r={30} fill="#FFFFFF" stroke="#E63946" strokeWidth={4} />
					<text y={13} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={900} fontSize={38} fill="#E63946">?</text>
				</g>
			) : null}
			{[0, 1, 2].map((i) => (
				<rect key={i} x={70} y={270 + i * 14} width={360 - i * 80} height={6} rx={3} fill={withAlpha(NAVY, 0.18)} />
			))}
		</svg>
	);
};
