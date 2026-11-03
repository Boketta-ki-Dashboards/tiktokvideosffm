import React from 'react';
import {useSvgId} from '../../../lib/svg';

/**
 * Nationalflaggen als SVG (gemeinfreie Hoheitszeichen, eigene Vektor-Nachzeichnung).
 * Flaggen mit komplexen Wappen/Schriftzeichen sind bewusst NICHT enthalten,
 * statt einer ungenauen Kopie wird ein neutrales Länderkürzel-Badge gezeigt.
 */
export type FlagCode =
	| 'DE'
	| 'FR'
	| 'GB'
	| 'AU'
	| 'KR'
	| 'IN'
	| 'US'
	| 'EU'
	| 'IT'
	| 'NL'
	| 'BE'
	| 'AT'
	| 'PL'
	| 'UA'
	| 'IE'
	| 'JP'
	| 'CH';

export type FlagProps = {
	code: FlagCode | string;
	/** Breite in px; Höhe ergibt sich aus 3:2 (bzw. 2:1 für GB/AU/US-ähnlich gerundet auf 3:2-Rahmen). */
	width?: number;
	rounded?: number;
	shadow?: boolean;
	style?: React.CSSProperties;
};

const Horizontal = ({colors}: {colors: string[]}) => (
	<>
		{colors.map((c, i) => (
			<rect key={i} x={0} y={(i * 60) / colors.length} width={90} height={60 / colors.length + 0.5} fill={c} />
		))}
	</>
);

const Vertical = ({colors}: {colors: string[]}) => (
	<>
		{colors.map((c, i) => (
			<rect key={i} x={(i * 90) / colors.length} y={0} width={90 / colors.length + 0.5} height={60} fill={c} />
		))}
	</>
);

const star = (cx: number, cy: number, outer: number, inner: number, points: number, rotation = -Math.PI / 2) =>
	new Array(points * 2)
		.fill(true)
		.map((_, i) => {
			const r = i % 2 === 0 ? outer : inner;
			const a = rotation + (i * Math.PI) / points;
			return `${(cx + Math.cos(a) * r).toFixed(2)},${(cy + Math.sin(a) * r).toFixed(2)}`;
		})
		.join(' ');

/** Union Jack in einem 60×30-Feld. */
const UnionJack: React.FC<{clipId: string}> = ({clipId}) => (
	<g>
		<clipPath id={clipId}>
			<path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
		</clipPath>
		<rect width={60} height={30} fill="#012169" />
		<path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" strokeWidth={6} />
		<path d="M0,0 L60,30 M60,0 L0,30" clipPath={`url(#${clipId})`} stroke="#C8102E" strokeWidth={4} />
		<path d="M30,0 v30 M0,15 h60" stroke="#FFFFFF" strokeWidth={10} />
		<path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth={6} />
	</g>
);

const FlagArt: React.FC<{code: string; clipId: string}> = ({code, clipId}) => {
	switch (code) {
		case 'DE':
			return <Horizontal colors={['#000000', '#DD0000', '#FFCE00']} />;
		case 'FR':
			return <Vertical colors={['#002395', '#FFFFFF', '#ED2939']} />;
		case 'IT':
			return <Vertical colors={['#009246', '#FFFFFF', '#CE2B37']} />;
		case 'BE':
			return <Vertical colors={['#000000', '#FDDA24', '#EF3340']} />;
		case 'IE':
			return <Vertical colors={['#169B62', '#FFFFFF', '#FF883E']} />;
		case 'NL':
			return <Horizontal colors={['#AE1C28', '#FFFFFF', '#21468B']} />;
		case 'AT':
			return <Horizontal colors={['#ED2939', '#FFFFFF', '#ED2939']} />;
		case 'PL':
			return <Horizontal colors={['#FFFFFF', '#DC143C']} />;
		case 'UA':
			return <Horizontal colors={['#0057B7', '#FFD700']} />;
		case 'JP':
			return (
				<>
					<rect width={90} height={60} fill="#FFFFFF" />
					<circle cx={45} cy={30} r={18} fill="#BC002D" />
				</>
			);
		case 'CH':
			return (
				<>
					<rect width={90} height={60} fill="#DA291C" />
					<rect x={39} y={12} width={12} height={36} fill="#FFFFFF" />
					<rect x={27} y={24} width={36} height={12} fill="#FFFFFF" />
				</>
			);
		case 'GB':
			return (
				<g transform="scale(1.5 2)">
					<UnionJack clipId={clipId} />
				</g>
			);
		case 'AU': {
			// Blue Ensign mit Commonwealth-Stern und Kreuz des Südens (Proportionen nach Flags Act 1953)
			const sx = 90 / 10080;
			const sy = 60 / 5040;
			const big = (x: number, y: number) => star(x * sx, y * sy, 360 * sy, 360 * sy * (4 / 9), 7);
			return (
				<>
					<rect width={90} height={60} fill="#012169" />
					<g transform="scale(0.75 1)">
						<UnionJack clipId={clipId} />
					</g>
					<polygon points={star(2520 * sx, 3780 * sy, 756 * sy, 756 * sy * (4 / 9), 7)} fill="#FFFFFF" />
					<polygon points={big(7560, 4200)} fill="#FFFFFF" />
					<polygon points={big(6300, 2205)} fill="#FFFFFF" />
					<polygon points={big(7560, 840)} fill="#FFFFFF" />
					<polygon points={big(8835, 1935)} fill="#FFFFFF" />
					<polygon points={star(8064 * sx, 2730 * sy, 210 * sy, 210 * sy * 0.4, 5)} fill="#FFFFFF" />
				</>
			);
		}

		case 'KR':
			// Taegukgi nach offizieller Konstruktion (viewBox −36…36 × −24…24)
			return (
				<g transform="translate(45 30) scale(1.25)">
					<rect x={-36} y={-24} width={72} height={48} fill="#FFFFFF" />
					<g transform="rotate(-56.3099)">
						<g>
							<path d="M-6-25H6M-6-22H6M-6-19H6" stroke="#000" strokeWidth={2} />
							<path d="M-6 19H6M-6 22H6M-6 25H6" stroke="#000" strokeWidth={2} />
						</g>
						<path stroke="#FFF" strokeWidth={1} d="M0,17v10" />
						<circle r={12} fill="#CD2E3A" />
						<path fill="#0047A0" d="M0-12A6,6 0 0 0 0,0A6,6 0 0 1 0,12A12,12 0 0,1 0-12z" />
					</g>
					<g transform="rotate(-123.6901)">
						<path d="M-6-25H6M-6-22H6M-6-19H6" stroke="#000" strokeWidth={2} />
						<path d="M-6 19H6M-6 22H6M-6 25H6" stroke="#000" strokeWidth={2} />
						<path stroke="#FFF" strokeWidth={1} d="M0-23.5v3M0,17v3.5M0,23.5v3" />
					</g>
				</g>
			);
		case 'IN':
			return (
				<>
					<Horizontal colors={['#FF9933', '#FFFFFF', '#138808']} />
					<g transform="translate(45 30)">
						<circle r={8.6} fill="none" stroke="#000080" strokeWidth={1.3} />
						<circle r={1.6} fill="#000080" />
						{new Array(24).fill(true).map((_, i) => (
							<line key={i} x1={0} y1={0} x2={0} y2={-8.2} stroke="#000080" strokeWidth={0.6} transform={`rotate(${i * 15})`} />
						))}
					</g>
				</>
			);
		case 'US': {
			const stars: string[] = [];
			for (let r = 0; r < 9; r++) {
				const cols = r % 2 === 0 ? 6 : 5;
				for (let c = 0; c < cols; c++) {
					const x = (r % 2 === 0 ? 3 : 6) + c * 6;
					const y = 2.6 + r * 3.55;
					stars.push(star(x, y, 1.25, 0.5, 5));
				}
			}

			return (
				<>
					{new Array(13).fill(true).map((_, i) => (
						<rect key={i} x={0} y={(i * 60) / 13} width={90} height={60 / 13 + 0.3} fill={i % 2 === 0 ? '#B22234' : '#FFFFFF'} />
					))}
					<rect width={36} height={(60 / 13) * 7} fill="#3C3B6E" />
					{stars.map((pts, i) => (
						<polygon key={i} points={pts} fill="#FFFFFF" />
					))}
				</>
			);
		}

		case 'EU':
			return (
				<>
					<rect width={90} height={60} fill="#003399" />
					{new Array(12).fill(true).map((_, i) => {
						const a = (i / 12) * Math.PI * 2;
						return <polygon key={i} points={star(45 + Math.sin(a) * 20, 30 - Math.cos(a) * 20, 3.3, 1.3, 5)} fill="#FFCC00" />;
					})}
				</>
			);
		default:
			return (
				<>
					<rect width={90} height={60} fill="#2B3A6B" />
					<text x={45} y={39} textAnchor="middle" fontSize={26} fontWeight={800} fill="#FFFFFF" fontFamily="Inter, sans-serif">
						{code.slice(0, 3).toUpperCase()}
					</text>
				</>
			);
	}
};

export const Flag: React.FC<FlagProps> = ({code, width = 72, rounded = 6, shadow = true, style}) => {
	const clipId = useSvgId(`flag-uj-${code}`);
	const frameId = useSvgId(`flag-frame-${code}`);
	const height = (width * 2) / 3;
	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 90 60"
			style={{
				borderRadius: rounded,
				boxShadow: shadow ? '0 6px 18px rgba(0,0,0,0.45)' : undefined,
				flexShrink: 0,
				...style,
			}}
		>
			<clipPath id={frameId}>
				<rect width={90} height={60} rx={(rounded * 90) / width} />
			</clipPath>
			<g clipPath={`url(#${frameId})`}>
				<FlagArt code={code} clipId={clipId} />
			</g>
			<rect width={90} height={60} rx={(rounded * 90) / width} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={1.2} />
		</svg>
	);
};
