import React from 'react';
import {random, useCurrentFrame} from 'remotion';
import {withAlpha} from '../../../lib/color';
import type {CityId} from '../data/staedte';

/**
 * Stilisierte Stadtpanoramen der Sonderausgabe #20 (ILLUSTRATION, Serien-Nachtstil wie #15–#19): je Stadt die wiedererkennbaren
 * Wahrzeichen als flache Vektorflächen mit warmen Fensterlichtern – Leipzig (City-Hochhaus, Neues Rathaus, Gewandhaus/Augustusplatz),
 * Hamburg (Elbphilharmonie, Rathaus, Hafenkräne, Elbe), Dresden (Frauenkirche, Hofkirche, Semperoper, Augustusbrücke über der Elbe),
 * Stuttgart (Neues Schloss, Jubiläumssäule, Fernsehturm auf dem Hang, Kessellage), Berlin (Brandenburger Tor, Reichstagskuppel,
 * Fernsehturm). Frankfurt nutzt die bestehende `FrankfurtSkyline`. Stilisierte Panoramen – keine Straßenansicht, keine Personen.
 *
 * `crop` schneidet einen Ausschnitt (Dashboard-Karten), `mono` zeichnet nur die Silhouette in der Akzentfarbe.
 */
export const PANO = {width: 1080, height: 760} as const;

const C = {
	skyTop: '#060A24',
	skyMid: '#141A52',
	skyLow: '#2B2A72',
	far: '#121845',
	farEdge: '#22306E',
	body: '#1B2356',
	body2: '#232D68',
	face: '#2C387C',
	edge: '#5066C0',
	win: '#FFD9A0',
	copper: '#2F7F70',
	copperHi: '#57B39E',
	stone: '#6F6658',
	stoneHi: '#9A8E78',
	brick: '#5A3328',
	brickHi: '#7A4636',
	glass: '#4F9BE0',
	water: '#0B1440',
	ground: '#10163E',
} as const;

type Mode = {mono: boolean; accent: string};
const ModeCtx = React.createContext<Mode>({mono: false, accent: '#FFFFFF'});
const useFill = () => {
	const m = React.useContext(ModeCtx);
	return (c: string) => (m.mono ? withAlpha(m.accent, 0.9) : c);
};

/** Fensterraster mit deterministisch zufällig erleuchteten Fenstern (flackern leicht). */
const Windows: React.FC<{x: number; y: number; w: number; h: number; cols: number; rows: number; seed: string; lit?: number; size?: number}> = ({x, y, w, h, cols, rows, seed, lit = 0.55, size = 0.5}) => {
	const frame = useCurrentFrame();
	const m = React.useContext(ModeCtx);
	if (m.mono) return null;
	const cw = w / cols;
	const rh = h / rows;
	const cells: React.ReactNode[] = [];
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			const k = `${seed}-${r}-${c}`;
			if (random(k) > lit) continue;
			const flick = 0.7 + 0.3 * Math.sin(frame / (18 + random(`${k}f`) * 30) + random(`${k}p`) * 6);
			cells.push(<rect key={k} x={x + c * cw + cw * (1 - size) * 0.5} y={y + r * rh + rh * (1 - size) * 0.5} width={cw * size} height={rh * size * 1.1} fill={C.win} opacity={0.55 * flick} />);
		}
	}
	return <g>{cells}</g>;
};

/** Ferne Stadtsilhouette (generische Häuser) – Tiefe hinter den Wahrzeichen. */
const FarRow: React.FC<{seed: string; base: number; maxH?: number}> = ({seed, base, maxH = 120}) => {
	const fill = useFill();
	const blocks: React.ReactNode[] = [];
	let x = -40;
	let i = 0;
	while (x < PANO.width + 40) {
		const w = 40 + random(`${seed}-w-${i}`) * 70;
		const h = 30 + random(`${seed}-h-${i}`) * maxH;
		blocks.push(
			<g key={i}>
				<rect x={x} y={base - h} width={w} height={h + 4} fill={fill(C.far)} stroke={fill(C.farEdge)} strokeWidth={1} />
				<Windows x={x + 4} y={base - h + 6} w={w - 8} h={h - 10} cols={Math.max(2, Math.round(w / 14))} rows={Math.max(2, Math.round(h / 16))} seed={`${seed}-fw-${i}`} lit={0.3} size={0.42} />
			</g>,
		);
		x += w - 2;
		i++;
	}
	return <g>{blocks}</g>;
};

const Sky: React.FC<{accent: string; seed: string}> = ({accent, seed}) => {
	const frame = useCurrentFrame();
	const m = React.useContext(ModeCtx);
	if (m.mono) return null;
	return (
		<g>
			<defs>
				<linearGradient id={`sky-${seed}`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={C.skyTop} />
					<stop offset="0.6" stopColor={C.skyMid} />
					<stop offset="1" stopColor={C.skyLow} />
				</linearGradient>
				<radialGradient id={`glow-${seed}`} cx="0.5" cy="0.85" r="0.6">
					<stop offset="0" stopColor={withAlpha(accent, 0.35)} />
					<stop offset="1" stopColor={withAlpha(accent, 0)} />
				</radialGradient>
			</defs>
			<rect x={0} y={0} width={PANO.width} height={PANO.height} fill={`url(#sky-${seed})`} />
			<rect x={0} y={0} width={PANO.width} height={PANO.height} fill={`url(#glow-${seed})`} />
			{new Array(28).fill(0).map((_, i) => (
				<circle key={i} cx={random(`${seed}-sx-${i}`) * PANO.width} cy={random(`${seed}-sy-${i}`) * 300} r={0.8 + random(`${seed}-sr-${i}`) * 1.6} fill="#FFFFFF" opacity={0.25 + 0.35 * (0.5 + 0.5 * Math.sin(frame / 20 + i))} />
			))}
		</g>
	);
};

const Water: React.FC<{y: number; seed: string; accent: string}> = ({y, seed, accent}) => {
	const frame = useCurrentFrame();
	const m = React.useContext(ModeCtx);
	if (m.mono) return null;
	return (
		<g>
			<rect x={0} y={y} width={PANO.width} height={PANO.height - y} fill={C.water} />
			{new Array(16).fill(0).map((_, i) => {
				const yy = y + 12 + i * 14;
				const off = Math.sin(frame / 14 + i) * 18;
				return <rect key={i} x={60 + random(`${seed}-wx-${i}`) * 800 + off} y={yy} width={60 + random(`${seed}-ww-${i}`) * 140} height={3} rx={1.5} fill={i % 3 === 0 ? withAlpha(accent, 0.35) : withAlpha(C.win, 0.22)} />;
			})}
		</g>
	);
};

const Ground: React.FC<{y: number}> = ({y}) => {
	const fill = useFill();
	return <rect x={0} y={y} width={PANO.width} height={PANO.height - y} fill={fill(C.ground)} />;
};

/* ------------------------------------------------------------------ Leipzig */

const Leipzig: React.FC = () => {
	const fill = useFill();
	const base = 600;
	return (
		<g>
			<FarRow seed="le-far" base={base} maxH={110} />
			{/* Neues Rathaus: breiter Bau + Turm mit Kupferhaube und Laterne */}
			<rect x={120} y={base - 190} width={330} height={190} fill={fill(C.body)} stroke={fill(C.edge)} strokeWidth={2} />
			<path d={`M120 ${base - 190} L285 ${base - 245} L450 ${base - 190} Z`} fill={fill(C.body2)} stroke={fill(C.edge)} strokeWidth={2} />
			<Windows x={135} y={base - 175} w={300} h={160} cols={12} rows={5} seed="le-rh" lit={0.6} />
			<rect x={255} y={base - 430} width={64} height={250} fill={fill(C.face)} stroke={fill(C.edge)} strokeWidth={2} />
			<Windows x={262} y={base - 400} w={50} h={200} cols={2} rows={8} seed="le-rt" lit={0.5} />
			<path d={`M248 ${base - 430} Q287 ${base - 500} 326 ${base - 430} Z`} fill={fill(C.copper)} stroke={fill(C.copperHi)} strokeWidth={2} />
			<rect x={279} y={base - 520} width={16} height={34} fill={fill(C.copper)} stroke={fill(C.copperHi)} strokeWidth={2} />
			<path d={`M279 ${base - 520} L287 ${base - 548} L295 ${base - 520} Z`} fill={fill(C.copperHi)} />
			{/* City-Hochhaus (Uniriese): schlanke Scheibe mit geschwungenem Abschluss */}
			<path d={`M600 ${base} L600 ${base - 470} Q660 ${base - 500} 730 ${base - 476} L730 ${base} Z`} fill={fill(C.body2)} stroke={fill(C.edge)} strokeWidth={2.5} />
			<path d={`M605 ${base - 466} Q662 ${base - 494} 725 ${base - 472}`} fill="none" stroke={fill('#8FB4FF')} strokeWidth={3} opacity={0.8} />
			<Windows x={612} y={base - 450} w={106} h={440} cols={6} rows={26} seed="le-ch" lit={0.5} size={0.55} />
			{/* Gewandhaus (Glasfront, warm erleuchtet) am Augustusplatz */}
			<path d={`M770 ${base} L780 ${base - 150} L1040 ${base - 150} L1050 ${base} Z`} fill={fill(C.body)} stroke={fill(C.edge)} strokeWidth={2} />
			<path d={`M790 ${base - 140} L1030 ${base - 140} L1036 ${base - 20} L784 ${base - 20} Z`} fill={fill(withAlpha(C.win, 0.28))} stroke={fill(withAlpha(C.win, 0.6))} strokeWidth={2} />
			{new Array(9).fill(0).map((_, i) => (
				<line key={i} x1={810 + i * 26} y1={base - 140} x2={808 + i * 26.5} y2={base - 20} stroke={fill(withAlpha(C.win, 0.5))} strokeWidth={2} />
			))}
			{/* Paulinum-Giebel */}
			<path d={`M470 ${base} L470 ${base - 160} L530 ${base - 250} L590 ${base - 160} L590 ${base} Z`} fill={fill(C.face)} stroke={fill(C.edge)} strokeWidth={2} />
			<path d={`M512 ${base - 40} L512 ${base - 170} L530 ${base - 205} L548 ${base - 170} L548 ${base - 40} Z`} fill={fill(withAlpha('#9CC2FF', 0.35))} stroke={fill('#9CC2FF')} strokeWidth={2} />
			<Ground y={base} />
			{/* Augustusplatz: Platz mit Lichtpunkten + Mendebrunnen */}
			<path d={`M0 ${base + 30} L1080 ${base + 30}`} stroke={fill(withAlpha('#9CC2FF', 0.25))} strokeWidth={2} />
			<rect x={890} y={base + 10} width={14} height={36} fill={fill(C.stone)} />
			<circle cx={897} cy={base + 6} r={10} fill={fill(C.stoneHi)} />
		</g>
	);
};

/* ------------------------------------------------------------------ Hamburg */

const Hamburg: React.FC<{accent: string}> = ({accent}) => {
	const fill = useFill();
	const base = 560;
	return (
		<g>
			<FarRow seed="hh-far" base={base} maxH={90} />
			{/* Hafenkräne */}
			{[880, 980].map((x, i) => (
				<g key={x} stroke={fill('#6A7BC8')} strokeWidth={4} fill="none">
					<path d={`M${x} ${base} L${x} ${base - 210 - i * 20} M${x - 70} ${base - 200 - i * 20} L${x + 60} ${base - 200 - i * 20} M${x} ${base - 210 - i * 20} L${x - 70} ${base - 200 - i * 20} M${x} ${base - 210 - i * 20} L${x + 60} ${base - 200 - i * 20}`} />
					<path d={`M${x - 50} ${base - 200 - i * 20} L${x - 50} ${base - 120 - i * 20}`} strokeWidth={2} />
				</g>
			))}
			{/* Rathaus mit Mittelturm */}
			<rect x={600} y={base - 170} width={250} height={170} fill={fill(C.body)} stroke={fill(C.edge)} strokeWidth={2} />
			<path d={`M600 ${base - 170} L725 ${base - 205} L850 ${base - 170} Z`} fill={fill(C.copper)} stroke={fill(C.copperHi)} strokeWidth={2} />
			<Windows x={612} y={base - 155} w={226} h={140} cols={10} rows={4} seed="hh-rh" lit={0.6} />
			<rect x={705} y={base - 330} width={40} height={140} fill={fill(C.face)} stroke={fill(C.edge)} strokeWidth={2} />
			<path d={`M700 ${base - 330} L725 ${base - 420} L750 ${base - 330} Z`} fill={fill(C.copper)} stroke={fill(C.copperHi)} strokeWidth={2} />
			<rect x={719} y={base - 312} width={12} height={20} fill={fill(withAlpha(C.win, 0.7))} />
			{/* Elbphilharmonie: Backstein-Sockel + Glasaufbau mit Wellendach */}
			<path d={`M110 ${base} L130 ${base - 120} L520 ${base - 120} L540 ${base} Z`} fill={fill(C.brick)} stroke={fill(C.brickHi)} strokeWidth={2} />
			<Windows x={140} y={base - 112} w={370} h={100} cols={22} rows={5} seed="hh-sp" lit={0.35} size={0.4} />
			<path
				d={`M130 ${base - 120} L130 ${base - 230} Q170 ${base - 300} 215 ${base - 250} Q260 ${base - 330} 310 ${base - 255} Q360 ${base - 345} 410 ${base - 262} Q455 ${base - 312} 490 ${base - 250} Q510 ${base - 270} 520 ${base - 240} L520 ${base - 120} Z`}
				fill={fill(withAlpha(C.glass, 0.55))}
				stroke={fill('#BFE0FF')}
				strokeWidth={3}
			/>
			{new Array(8).fill(0).map((_, i) => (
				<path key={i} d={`M${150 + i * 48} ${base - 125} L${150 + i * 48} ${base - 225 + Math.sin(i) * 20}`} stroke={fill(withAlpha('#BFE0FF', 0.45))} strokeWidth={2} />
			))}
			<path d={`M130 ${base - 175} L520 ${base - 175}`} stroke={fill(withAlpha(C.win, 0.6))} strokeWidth={4} />
			<Water y={base} seed="hh-w" accent={accent} />
		</g>
	);
};

/* ------------------------------------------------------------------ Dresden */

const Dresden: React.FC<{accent: string}> = ({accent}) => {
	const fill = useFill();
	const base = 520;
	return (
		<g>
			<FarRow seed="dd-far" base={base} maxH={70} />
			{/* Semperoper: Halbrund mit Exedra und Quadriga */}
			<rect x={70} y={base - 140} width={300} height={140} fill={fill(C.stone)} stroke={fill(C.stoneHi)} strokeWidth={2} />
			<path d={`M150 ${base - 140} Q220 ${base - 200} 290 ${base - 140} Z`} fill={fill(C.stoneHi)} stroke={fill(C.stoneHi)} strokeWidth={2} />
			<rect x={190} y={base - 260} width={60} height={70} fill={fill(C.stone)} stroke={fill(C.stoneHi)} strokeWidth={2} />
			<path d={`M185 ${base - 260} Q220 ${base - 292} 255 ${base - 260} Z`} fill={fill(C.copper)} />
			<path d={`M205 ${base - 292} l8 -14 l8 14 l8 -14 l6 14`} stroke={fill(C.stoneHi)} strokeWidth={3} fill="none" />
			<Windows x={84} y={base - 128} w={272} h={100} cols={12} rows={3} seed="dd-so" lit={0.7} />
			{/* Katholische Hofkirche: schlanker Turm */}
			<g transform="translate(-50 0)">
			<rect x={410} y={base - 150} width={150} height={150} fill={fill(C.stone)} stroke={fill(C.stoneHi)} strokeWidth={2} />
			<rect x={466} y={base - 330} width={38} height={190} fill={fill(C.stone)} stroke={fill(C.stoneHi)} strokeWidth={2} />
			<path d={`M462 ${base - 330} Q485 ${base - 380} 508 ${base - 330} Z`} fill={fill(C.copper)} stroke={fill(C.copperHi)} strokeWidth={2} />
			<path d={`M485 ${base - 378} L485 ${base - 410}`} stroke={fill(C.copperHi)} strokeWidth={4} />
			<Windows x={420} y={base - 135} w={130} h={110} cols={6} rows={3} seed="dd-hk" lit={0.5} />
			</g>
			{/* Frauenkirche: Glockenkuppel, Ecktürme, Laterne */}
			<g transform="translate(-130 0)">
			<rect x={640} y={base - 170} width={200} height={170} fill={fill(C.stone)} stroke={fill(C.stoneHi)} strokeWidth={2} />
			{[640, 812].map((x) => (
				<g key={x}>
					<rect x={x} y={base - 230} width={28} height={70} fill={fill(C.stone)} stroke={fill(C.stoneHi)} strokeWidth={2} />
					<path d={`M${x - 2} ${base - 230} L${x + 14} ${base - 262} L${x + 30} ${base - 230} Z`} fill={fill(C.stoneHi)} />
				</g>
			))}
			<path d={`M660 ${base - 170} C 660 ${base - 300}, 700 ${base - 360}, 740 ${base - 370} C 780 ${base - 360}, 820 ${base - 300}, 820 ${base - 170} Z`} fill={fill(C.stoneHi)} stroke={fill('#C9B892')} strokeWidth={2.5} />
			<rect x={727} y={base - 420} width={26} height={54} fill={fill(C.stoneHi)} stroke={fill('#C9B892')} strokeWidth={2} />
			<path d={`M740 ${base - 420} L740 ${base - 452} M730 ${base - 440} L750 ${base - 440}`} stroke={fill('#E8D7A8')} strokeWidth={4} />
			<Windows x={660} y={base - 150} w={160} h={120} cols={5} rows={3} seed="dd-fk" lit={0.6} size={0.4} />
			</g>
			<Water y={base} seed="dd-w" accent={accent} />
			{/* Augustusbrücke: Bogenbrücke über die Elbe */}
			<path d={`M-20 ${base + 40} L1100 ${base + 40} L1100 ${base + 70} L-20 ${base + 70} Z`} fill={fill(C.stone)} stroke={fill(C.stoneHi)} strokeWidth={2} />
			{new Array(7).fill(0).map((_, i) => {
				const x = -10 + i * 170;
				return <path key={i} d={`M${x} ${base + 150} L${x} ${base + 70} Q${x + 85} ${base + 10} ${x + 170} ${base + 70} L${x + 170} ${base + 150}`} fill="none" stroke={fill(C.stone)} strokeWidth={20} />;
			})}
			{new Array(14).fill(0).map((_, i) => (
				<circle key={i} cx={30 + i * 78} cy={base + 30} r={5} fill={fill(C.win)} opacity={0.8} />
			))}
		</g>
	);
};

/* ------------------------------------------------------------------ Stuttgart */

const Stuttgart: React.FC = () => {
	const fill = useFill();
	const base = 600;
	return (
		<g>
			{/* Kessellage: Hänge links und rechts mit Lichtern */}
			<path d={`M-20 ${base} L-20 ${base - 330} Q200 ${base - 290} 360 ${base - 120} L380 ${base} Z`} fill={fill('#151C4C')} stroke={fill(C.farEdge)} strokeWidth={2} />
			<path d={`M1100 ${base} L1100 ${base - 360} Q860 ${base - 330} 700 ${base - 130} L680 ${base} Z`} fill={fill('#151C4C')} stroke={fill(C.farEdge)} strokeWidth={2} />
			{new Array(40).fill(0).map((_, i) => {
				const left = i % 2 === 0;
				const t = random(`st-h-${i}`);
				const x = left ? t * 330 : 1080 - t * 380;
				const yMax = left ? base - 320 + t * 260 : base - 350 + t * 280;
				const y = yMax + random(`st-v-${i}`) * (base - yMax) * 0.9;
				return <circle key={i} cx={x} cy={y} r={2.5} fill={fill(C.win)} opacity={0.6} />;
			})}
			{/* Fernsehturm auf dem Hang */}
			<g transform="translate(-150 30)">
			<path d={`M900 ${base - 280} L908 ${base - 470} L920 ${base - 470} L928 ${base - 280} Z`} fill={fill('#C9CCD8')} stroke={fill('#E4E8F5')} strokeWidth={1.5} opacity={0.95} />
			<path d={`M890 ${base - 470} L938 ${base - 470} L934 ${base - 510} L894 ${base - 510} Z`} fill={fill('#D7DAE6')} stroke={fill('#FFFFFF')} strokeWidth={1.5} />
			<rect x={896} y={base - 500} width={36} height={10} fill={fill(withAlpha(C.win, 0.8))} />
			<path d={`M914 ${base - 510} L914 ${base - 580}`} stroke={fill('#E4E8F5')} strokeWidth={4} />
			<circle cx={914} cy={base - 582} r={4} fill={fill('#FF4D5E')} />
			</g>
			{/* Neues Schloss: Mittelbau + Seitenflügel */}
			<rect x={300} y={base - 170} width={400} height={170} fill={fill(C.body2)} stroke={fill(C.edge)} strokeWidth={2} />
			<path d={`M300 ${base - 170} L500 ${base - 205} L700 ${base - 170} Z`} fill={fill(C.copper)} stroke={fill(C.copperHi)} strokeWidth={2} />
			<rect x={455} y={base - 240} width={90} height={60} fill={fill(C.face)} stroke={fill(C.edge)} strokeWidth={2} />
			<path d={`M450 ${base - 240} Q500 ${base - 290} 550 ${base - 240} Z`} fill={fill(C.copper)} stroke={fill(C.copperHi)} strokeWidth={2} />
			<path d={`M492 ${base - 286} l8 -12 l8 12`} stroke={fill('#E8D7A8')} strokeWidth={3} fill="none" />
			<Windows x={312} y={base - 158} w={376} h={140} cols={18} rows={4} seed="st-ns" lit={0.65} />
			{[230, 700].map((x) => (
				<g key={x}>
					<rect x={x} y={base - 120} width={70} height={120} fill={fill(C.body)} stroke={fill(C.edge)} strokeWidth={2} />
					<Windows x={x + 6} y={base - 110} w={58} h={100} cols={3} rows={3} seed={`st-w-${x}`} lit={0.55} />
				</g>
			))}
			<Ground y={base} />
			{/* Jubiläumssäule auf dem Schlossplatz */}
			<rect x={812} y={base - 210} width={20} height={230} fill={fill(C.stoneHi)} stroke={fill('#C9B892')} strokeWidth={1.5} />
			<rect x={802} y={base + 10} width={40} height={18} fill={fill(C.stone)} />
			<path d={`M822 ${base - 210} l-8 -22 l8 -14 l8 14 Z`} fill={fill('#E8D7A8')} />
			<path d={`M0 ${base + 40} L1080 ${base + 40}`} stroke={fill(withAlpha('#9CC2FF', 0.25))} strokeWidth={2} />
		</g>
	);
};

/* ------------------------------------------------------------------ Berlin */

const Berlin: React.FC = () => {
	const fill = useFill();
	const base = 600;
	return (
		<g>
			<FarRow seed="be-far" base={base} maxH={100} />
			{/* Fernsehturm */}
			<g transform="translate(-40 0)">
			<path d={`M770 ${base} L780 ${base - 380} L796 ${base - 380} L806 ${base} Z`} fill={fill('#C9CCD8')} stroke={fill('#E4E8F5')} strokeWidth={1.5} />
			<circle cx={788} cy={base - 420} r={46} fill={fill('#B9BDCC')} stroke={fill('#FFFFFF')} strokeWidth={2} />
			<path d={`M744 ${base - 420} L832 ${base - 420}`} stroke={fill(withAlpha(C.win, 0.8))} strokeWidth={5} />
			<path d={`M788 ${base - 466} L788 ${base - 600}`} stroke={fill('#E4E8F5')} strokeWidth={6} />
			<path d={`M788 ${base - 600} L788 ${base - 660}`} stroke={fill('#FF4D5E')} strokeWidth={4} />
			</g>
			{/* Reichstagsgebäude mit Glaskuppel */}
			<rect x={420} y={base - 150} width={290} height={150} fill={fill(C.stone)} stroke={fill(C.stoneHi)} strokeWidth={2} />
			{[420, 676].map((x) => (
				<rect key={x} x={x} y={base - 190} width={34} height={190} fill={fill(C.stone)} stroke={fill(C.stoneHi)} strokeWidth={2} />
			))}
			<path d={`M505 ${base - 150} Q565 ${base - 260} 625 ${base - 150} Z`} fill={fill(withAlpha(C.glass, 0.45))} stroke={fill('#BFE0FF')} strokeWidth={2.5} />
			{new Array(5).fill(0).map((_, i) => (
				<path key={i} d={`M${520 + i * 22} ${base - 160} Q565 ${base - 250} ${610 - i * 22} ${base - 160}`} fill="none" stroke={fill(withAlpha('#BFE0FF', 0.4))} strokeWidth={1.5} />
			))}
			<Windows x={460} y={base - 140} w={210} h={120} cols={10} rows={3} seed="be-rt" lit={0.6} />
			{/* Brandenburger Tor: sechs Säulenpaare, Attika, Quadriga */}
			<rect x={70} y={base - 250} width={300} height={44} fill={fill(C.stoneHi)} stroke={fill('#C9B892')} strokeWidth={2} />
			<rect x={150} y={base - 286} width={140} height={36} fill={fill(C.stoneHi)} stroke={fill('#C9B892')} strokeWidth={2} />
			{new Array(6).fill(0).map((_, i) => (
				<rect key={i} x={82 + i * 52} y={base - 206} width={20} height={206} fill={fill(C.stoneHi)} stroke={fill('#C9B892')} strokeWidth={1.5} />
			))}
			<path d={`M195 ${base - 286} l12 -30 l14 8 l14 -8 l14 8 l12 22 Z`} fill={fill('#5DB89E')} stroke={fill('#8ED9C4')} strokeWidth={1.5} />
			<Ground y={base} />
			<path d={`M0 ${base + 40} L1080 ${base + 40}`} stroke={fill(withAlpha('#9CC2FF', 0.25))} strokeWidth={2} />
		</g>
	);
};

const DRAW: Record<Exclude<CityId, 'frankfurt'>, React.FC<{accent: string}>> = {
	leipzig: Leipzig,
	hamburg: Hamburg,
	dresden: Dresden,
	stuttgart: Stuttgart,
	berlin: Berlin,
};

/** Stadtpanorama (1080 × 760). `crop` = Ausschnitt [x, y, w, h], `mono` = nur Silhouette in der Akzentfarbe (Dashboard). */
export const CityPanorama: React.FC<{city: Exclude<CityId, 'frankfurt'>; accent: string; width?: number; height?: number; crop?: [number, number, number, number]; mono?: boolean; style?: React.CSSProperties}> = ({city, accent, width = PANO.width, height, crop, mono = false, style}) => {
	const [x, y, w, h] = crop ?? [0, 0, PANO.width, PANO.height];
	const Draw = DRAW[city];
	return (
		<ModeCtx.Provider value={{mono, accent}}>
			<svg width={height ? (height * w) / h : width} height={height ?? (width * h) / w} viewBox={`${x} ${y} ${w} ${h}`} preserveAspectRatio="xMaxYMax meet" style={{display: 'block', overflow: 'hidden', ...style}}>
				<Sky accent={accent} seed={`${city}-${mono ? 'm' : 'f'}`} />
				<Draw accent={accent} />
			</svg>
		</ModeCtx.Provider>
	);
};

/** Ausschnitt mit den Wahrzeichen je Stadt (für die Dashboard-Karten). */
export const LANDMARK_CROP: Record<Exclude<CityId, 'frankfurt'>, [number, number, number, number]> = {
	leipzig: [60, 30, 1020, 600],
	hamburg: [60, 120, 1020, 470],
	dresden: [40, 60, 1000, 480],
	stuttgart: [180, -110, 900, 740],
	berlin: [40, -80, 940, 700],
};

/** Frankfurt-Silhouette für das Dashboard (Commerzbank Tower, Main Tower, Messeturm-Spitze, Westendturm-Krone) – nur Umriss in der Akzentfarbe. */
export const FrankfurtMini: React.FC<{height: number; color: string}> = ({height, color}) => (
	<svg width={(height * 200) / 60} height={height} viewBox="0 0 200 60" style={{display: 'block'}}>
		<g fill={withAlpha(color, 0.9)}>
			<rect x={4} y={34} width={18} height={26} />
			<path d="M26 60 L26 14 L32 4 L38 14 L38 60 Z" />
			<rect x={44} y={22} width={16} height={38} />
			<path d="M64 60 L64 10 L72 2 L80 10 L80 60 Z" />
			<rect x={84} y={8} width={14} height={52} />
			<path d="M84 8 L91 0 L98 8 Z" />
			<rect x={104} y={26} width={20} height={34} />
			<path d="M128 60 L128 12 L136 2 L144 12 L144 60 Z" />
			<rect x={148} y={30} width={16} height={30} />
			<path d="M168 60 L168 20 L176 16 L184 20 L184 60 Z" />
			<rect x={188} y={38} width={10} height={22} />
		</g>
	</svg>
);
