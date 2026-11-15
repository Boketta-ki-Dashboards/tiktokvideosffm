import React from 'react';
import {AbsoluteFill} from 'remotion';

/** Kamera über einer geneigten Ebene: Punkt (x, y) der Ebene liegt am Bildanker, `tilt` neigt die Ebene nach hinten. */
export type PlaneCamera = {x: number; y: number; zoom: number; tilt: number; rotate?: number};

export type PlaneLayer = {key: string; z: number; node: React.ReactNode; opacity?: number};
export type PlaneBillboard = {key: string; x: number; y: number; z?: number; node: React.ReactNode};

/**
 * 2,5D-Ebene mit echter Perspektive (CSS 3D, im Headless-Render getestet): Inhalte liegen als Schichten auf einer
 * geneigten Ebene (`layers`, Höhe über `z` → gestapelte Schichten ergeben Extrusion, z. B. Gebäude oder Landmasse),
 * `billboards` (Ortsmarken, Beschriftungen) werden NICHT im 3D-Kontext gezeichnet, sondern per `projectPlanePoint` exakt auf
 * den Bildschirm projiziert und als normale 2D-Ebene darübergelegt: so schneidet Chrome nichts an den Ebenenrändern ab und
 * Schrift bleibt scharf; leichte Größenänderung mit der Tiefe (`scale`, begrenzt).
 * Keine Geodaten-Logik: Koordinaten kommen bereits projiziert (px in der Ebene).
 */
export const TiltedPlane: React.FC<{
	width: number;
	height: number;
	camera: PlaneCamera;
	anchor: [number, number];
	perspective?: number;
	layers: PlaneLayer[];
	billboards?: PlaneBillboard[];
	/** optionale Maske je Schicht (z. B. radialer Verlauf → weicher Kartenrand bei Drehung) */
	mask?: string;
}> = ({width, height, camera, anchor, perspective = 1500, layers, billboards = [], mask}) => {
	const {x, y, zoom, tilt, rotate = 0} = camera;
	const plane = `translate3d(${anchor[0]}px, ${anchor[1]}px, 0px) rotateX(${tilt}deg) rotateZ(${rotate}deg) scale3d(${zoom}, ${zoom}, ${zoom}) translate3d(${-x}px, ${-y}px, 0px)`;
	const placed = billboards
		.map((b) => ({b, p: projectPlanePoint(camera, anchor, perspective, b.x, b.y, b.z ?? 0)}))
		.filter(({p}) => p.z < perspective * 0.85)
		.sort((a, c) => a.p.z - c.p.z);
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<AbsoluteFill style={{perspective, perspectiveOrigin: `${anchor[0]}px ${anchor[1]}px`}}>
				<div style={{position: 'absolute', left: 0, top: 0, width, height, transformOrigin: '0 0', transform: plane, transformStyle: 'preserve-3d'}}>
					{layers.map((l) => (
						<div key={l.key} style={{position: 'absolute', left: 0, top: 0, width, height, transform: `translate3d(0px, 0px, ${l.z}px)`, opacity: l.opacity, maskImage: mask, WebkitMaskImage: mask}}>
							{l.node}
						</div>
					))}
				</div>
			</AbsoluteFill>
			{placed.map(({b, p}) => (
				<div key={b.key} style={{position: 'absolute', left: p.x, top: p.y, width: 0, height: 0}}>
					<div style={{position: 'absolute', left: 0, bottom: 0, translate: '-50% 0', scale: String(Math.min(1.2, Math.max(0.8, p.scale))), transformOrigin: '50% 100%'}}>{b.node}</div>
				</div>
			))}
		</AbsoluteFill>
	);
};

/**
 * Bildschirmposition eines Ebenenpunkts (x, y in Ebenen-px, z Höhe) – exakt dieselbe Matrix wie die CSS-Transformation
 * (translate(anchor) · rotateX(tilt) · rotateZ(rotate) · scale(zoom) · translate(−cam)) mit Perspektive um den Anker.
 */
export const projectPlanePoint = (camera: PlaneCamera, anchor: [number, number], perspective: number, x: number, y: number, z = 0) => {
	const {zoom, tilt, rotate = 0} = camera;
	const px = (x - camera.x) * zoom;
	const py = (y - camera.y) * zoom;
	const pz = z * zoom;
	const r = (rotate * Math.PI) / 180;
	const rx = px * Math.cos(r) - py * Math.sin(r);
	const ry = px * Math.sin(r) + py * Math.cos(r);
	const t = (tilt * Math.PI) / 180;
	const ty = ry * Math.cos(t) - pz * Math.sin(t);
	const tz = ry * Math.sin(t) + pz * Math.cos(t);
	const s = perspective / (perspective - tz);
	return {x: anchor[0] + rx * s, y: anchor[1] + ty * s, z: tz, scale: s};
};

/** Kamera zwischen Schlüsselbildern (Frame → Kamera), weich überblendet. */
export const interpolateCamera = (frame: number, keys: {frame: number; cam: PlaneCamera}[], ease: (t: number) => number): PlaneCamera => {
	if (frame <= keys[0].frame) return keys[0].cam;
	for (let i = 1; i < keys.length; i++) {
		const a = keys[i - 1];
		const b = keys[i];
		if (frame <= b.frame) {
			const t = ease(Math.min(1, Math.max(0, (frame - a.frame) / Math.max(1, b.frame - a.frame))));
			const lerp = (p: number, q: number) => p + (q - p) * t;
			return {
				x: lerp(a.cam.x, b.cam.x),
				y: lerp(a.cam.y, b.cam.y),
				zoom: Math.exp(lerp(Math.log(a.cam.zoom), Math.log(b.cam.zoom))),
				tilt: lerp(a.cam.tilt, b.cam.tilt),
				rotate: lerp(a.cam.rotate ?? 0, b.cam.rotate ?? 0),
			};
		}
	}
	return keys[keys.length - 1].cam;
};
