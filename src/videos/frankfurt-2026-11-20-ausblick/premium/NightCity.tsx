import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {EmergencyLights} from '../../../components/backgrounds/EmergencyLights';
import {FrankfurtSkyline} from '../../../components/backgrounds/FrankfurtSkyline';
import {Stars} from '../../../components/backgrounds/Stars';
import {clamp} from '../../../lib/animation';
import {mix, withAlpha} from '../../../lib/color';
import {useSvgId} from '../../../lib/svg';

/** Farbstimmungen der Premium-Nachtszene. */
export type Mood = {
	sky: [string, string, string, string];
	glow: string;
	hills: string;
	band: string;
	fog: string;
	lamp: string;
};

export const MOODS = {
	alert: {sky: ['#07040F', '#25091F', '#5C1626', '#B0402A'], glow: '#FF6A3D', hills: '#2A0C1C', band: '#3A1222', fog: '#7A2A2A', lamp: '#FFB46A'},
	calm: {sky: ['#040820', '#0E1546', '#272058', '#53306A'], glow: '#8C6CFF', hills: '#141A44', band: '#1C2456', fog: '#4A3A7A', lamp: '#FFD27A'},
	police: {sky: ['#030719', '#0A1640', '#132A62', '#1D3C7E'], glow: '#3A7BFF', hills: '#0C1838', band: '#132350', fog: '#2A4C8E', lamp: '#CFE2FF'},
	dusk: {sky: ['#060A24', '#1A1450', '#4A2464', '#A2405E'], glow: '#FF7A6A', hills: '#1E1440', band: '#2A1A4E', fog: '#7A3A6A', lamp: '#FFD27A'},
} satisfies Record<string, Mood>;

/** Mischt zwei Stimmungen (t = 0 → a, t = 1 → b). */
export const blendMood = (a: Mood, b: Mood, t: number): Mood => ({
	sky: a.sky.map((c, i) => mix(c, b.sky[i], t)) as Mood['sky'],
	glow: mix(a.glow, b.glow, t),
	hills: mix(a.hills, b.hills, t),
	band: mix(a.band, b.band, t),
	fog: mix(a.fog, b.fog, t),
	lamp: mix(a.lamp, b.lamp, t),
});

/** Taunus-Silhouette + entfernte Stadtkante (zwei Tiefenebenen). */
const FarLayers: React.FC<{mood: Mood; shift: number}> = ({mood, shift}) => {
	const id = useSvgId('far');
	return (
		<svg width={1400} height={700} viewBox="0 0 1400 700" style={{position: 'absolute', left: -160 + shift, top: 820}}>
			<defs>
				<linearGradient id={`${id}-h`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={mood.hills} />
					<stop offset="1" stopColor={mix(mood.hills, mood.sky[3], 0.35)} />
				</linearGradient>
			</defs>
			<path
				d="M0 300 C120 230 210 250 300 210 C390 170 470 200 560 180 C660 160 740 120 840 150 C930 176 1010 140 1100 170 C1200 204 1300 180 1400 210 L1400 700 L0 700 Z"
				fill={`url(#${id}-h)`}
				opacity={0.85}
			/>
			{/* Fernmeldeturm-artige Antenne als Tiefenmarke (generisch) */}
			<g opacity={0.6}>
				<rect x={1046} y={60} width={6} height={110} fill={mood.hills} />
				<ellipse cx={1049} cy={110} rx={14} ry={7} fill={mood.hills} />
			</g>
			{/* entfernte Häuserkante mit kleinen Lichtern */}
			<path d="M0 380 h60 v-24 h40 v14 h70 v-30 h50 v22 h80 v-16 h60 v28 h90 v-20 h70 v12 h110 v-26 h60 v18 h90 v-12 h80 v24 h100 v-18 h70 v14 h90 v-22 h80 v700 H0 Z" fill={mood.band} />
			{new Array(60).fill(true).map((_, i) => (
				<rect key={i} x={10 + random(`fl-x-${i}`) * 1380} y={370 + random(`fl-y-${i}`) * 50} width={3} height={3} fill={mood.lamp} opacity={0.35 + random(`fl-o-${i}`) * 0.4} />
			))}
		</svg>
	);
};

/** Uferpromenade im Vordergrund: Geländer + Laternen mit Lichtkegel (größte Parallaxe). */
const Promenade: React.FC<{mood: Mood; shift: number}> = ({mood, shift}) => {
	const id = useSvgId('prom');
	const lamps = [70, 980];
	return (
		<svg width={1300} height={520} viewBox="0 0 1300 520" style={{position: 'absolute', left: -110 + shift, top: 1430}}>
			<defs>
				<radialGradient id={`${id}-glow`}>
					<stop offset="0" stopColor={mood.lamp} stopOpacity={0.55} />
					<stop offset="0.4" stopColor={mood.lamp} stopOpacity={0.16} />
					<stop offset="1" stopColor={mood.lamp} stopOpacity={0} />
				</radialGradient>
				<linearGradient id={`${id}-cone`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={mood.lamp} stopOpacity={0.22} />
					<stop offset="1" stopColor={mood.lamp} stopOpacity={0} />
				</linearGradient>
			</defs>
			{lamps.map((x) => (
				<g key={x}>
					<path d={`M${x + 110} 92 L${x + 30} 520 L${x + 190} 520 Z`} fill={`url(#${id}-cone)`} />
					<circle cx={x + 110} cy={84} r={150} fill={`url(#${id}-glow)`} />
					<rect x={x + 104} y={92} width={12} height={430} rx={4} fill="#06070F" />
					<rect x={x + 96} y={92} width={28} height={14} rx={4} fill="#06070F" />
					<path d={`M${x + 90} 62 Q${x + 110} 40 ${x + 130} 62 L${x + 124} 92 L${x + 96} 92 Z`} fill="#0A0B16" />
					<rect x={x + 99} y={66} width={22} height={22} rx={4} fill={mood.lamp} />
				</g>
			))}
			{/* Geländer */}
			<rect x={0} y={402} width={1300} height={10} rx={5} fill="#05060D" />
			<rect x={0} y={448} width={1300} height={6} rx={3} fill="#05060D" />
			{new Array(27).fill(true).map((_, i) => (
				<rect key={i} x={i * 50} y={402} width={6} height={118} fill="#05060D" />
			))}
			<rect x={0} y={402} width={1300} height={2} fill={withAlpha(mood.lamp, 0.4)} />
		</svg>
	);
};

/** Bokeh-Lichter (ohne teuren Blur: weiche Radialverläufe). */
const Bokeh: React.FC<{mood: Mood; shift: number; count?: number}> = ({mood, shift, count = 14}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			{new Array(count).fill(true).map((_, i) => {
				const size = 40 + random(`bk-s-${i}`) * 110;
				const x = random(`bk-x-${i}`) * 1180 - 50 + shift * (0.6 + random(`bk-p-${i}`) * 0.8);
				const y = 1150 + random(`bk-y-${i}`) * 700 + Math.sin((frame + i * 23) / 40) * 10;
				const c = i % 3 === 0 ? mood.glow : mood.lamp;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x,
							top: y,
							width: size,
							height: size,
							borderRadius: size / 2,
							background: `radial-gradient(circle, ${withAlpha(c, 0.32)} 0%, ${withAlpha(c, 0.12)} 45%, ${withAlpha(c, 0)} 70%)`,
							opacity: 0.55 + Math.sin((frame + i * 17) / 25) * 0.2,
						}}
					/>
				);
			})}
		</AbsoluteFill>
	);
};

/** Feiner Regen (für die Novemberstimmung). */
export const Rain: React.FC<{amount?: number; width?: number; height?: number; seed?: string}> = ({amount = 1, width = 1080, height = 1920, seed = 'rain'}) => {
	const frame = useCurrentFrame();
	const n = Math.round(90 * amount);
	return (
		<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
			{new Array(n).fill(true).map((_, i) => {
				const speed = 38 + random(`${seed}-v-${i}`) * 20;
				const x = random(`${seed}-x-${i}`) * (width + 200) - 100;
				const y = ((random(`${seed}-y-${i}`) * (height + 200) + frame * speed) % (height + 200)) - 100;
				const len = 26 + random(`${seed}-l-${i}`) * 30;
				return <line key={i} x1={x} y1={y} x2={x - len * 0.18} y2={y + len} stroke="rgba(200,220,255,0.28)" strokeWidth={2} strokeLinecap="round" />;
			})}
		</svg>
	);
};

export type NightCityProps = {
	mood: Mood;
	/** 0 → 1 über die Szene: treibt Parallaxe (Ebenen bewegen sich unterschiedlich schnell). */
	progress: number;
	litRatio?: number;
	emergency?: number;
	emergencyColors?: [string, string];
	showPromenade?: boolean;
	showMoon?: boolean;
	bokeh?: number;
};

/**
 * Mehrschichtige Frankfurter Nacht: Himmel, Sterne, Mond, Taunus, ferne Stadtkante, Skyline, Dunst,
 * Uferpromenade, Bokeh. Jede Ebene hat ihre eigene Parallaxe → echte Tiefe bei Kamerafahrten.
 */
export const NightCity: React.FC<NightCityProps> = ({mood, progress, litRatio = 0.3, emergency = 0, emergencyColors, showPromenade = true, showMoon = false, bokeh = 14}) => {
	const frame = useCurrentFrame();
	const p = interpolate(progress, [0, 1], [0, 1], clamp);
	const twinkle = 0.75 + Math.sin(frame / 18) * 0.05;
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<AbsoluteFill style={{background: `linear-gradient(180deg, ${mood.sky[0]} 0%, ${mood.sky[1]} 34%, ${mood.sky[2]} 62%, ${mood.sky[3]} 86%)`}} />
			<AbsoluteFill style={{background: `radial-gradient(ellipse 90% 26% at 50% 74%, ${withAlpha(mood.glow, 0.42)} 0%, ${withAlpha(mood.glow, 0)} 100%)`}} />
			<div style={{position: 'absolute', inset: 0, translate: `${-p * 10}px 0`}}>
				<Stars count={110} maxY={0.42} opacity={twinkle} />
			</div>
			{showMoon ? (
				<div style={{position: 'absolute', left: 760 - p * 18, top: 300 + p * 6}}>
					<div style={{position: 'absolute', left: -120, top: -120, width: 330, height: 330, borderRadius: 165, background: `radial-gradient(circle, ${withAlpha('#FFF4D6', 0.22)} 0%, ${withAlpha('#FFF4D6', 0)} 65%)`}} />
					<div style={{width: 90, height: 90, borderRadius: 45, background: 'radial-gradient(circle at 38% 36%, #FFFBEA 0%, #F2E6C4 55%, #D9C9A0 100%)', boxShadow: '0 0 40px rgba(255,244,214,0.45)'}} />
				</div>
			) : null}
			<FarLayers mood={mood} shift={-p * 30} />
			{/* Skyline (mittlere Ebene) */}
			<AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', translate: `${-p * 60}px 0`, scale: String(1 + p * 0.025), transformOrigin: '50% 90%'}}>
				<FrankfurtSkyline width={1600} litRatio={litRatio} style={{marginBottom: -60}} />
			</AbsoluteFill>
			{/* Dunst über dem Main */}
			<div style={{position: 'absolute', left: -100, right: -100, top: 1460, height: 260, background: `linear-gradient(180deg, ${withAlpha(mood.fog, 0)} 0%, ${withAlpha(mood.fog, 0.28)} 50%, ${withAlpha(mood.fog, 0)} 100%)`, translate: `${Math.sin(frame / 60) * 30}px 0`}} />
			{emergency > 0 ? <EmergencyLights intensity={emergency} y={0.8} colors={emergencyColors} /> : null}
			{showPromenade ? <Promenade mood={mood} shift={-p * 140} /> : null}
			{bokeh > 0 ? <Bokeh mood={mood} shift={-p * 200} count={bokeh} /> : null}
		</AbsoluteFill>
	);
};
