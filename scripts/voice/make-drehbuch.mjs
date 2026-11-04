#!/usr/bin/env node
/**
 * Erzeugt references/<video>/drehbuch.md aus script.json + voiceover.json (echte Sprecherzeiten).
 * Bild-/Beleg-Spalten stehen in der Datei references/<video>/drehbuch-meta.json ({segmentId: {bild, beleg}}).
 *   node scripts/voice/make-drehbuch.mjs --video frankfurt-2026-11-04-naechste-demo --title "…" --comp FrankfurtNextDemo
 */
import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {parseArgs, ROOT} from '../lib/project.mjs';

const args = parseArgs(process.argv.slice(2));
const id = args.video;
if (!id) {
	console.error('--video <id> fehlt');
	process.exit(1);
}

const script = JSON.parse(readFileSync(path.join(ROOT, 'src/videos', id, 'script.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(path.join(ROOT, 'src/videos', id, 'voiceover.json'), 'utf8'));
const refDir = args.refs ?? path.join('references', id);
const metaPath = path.join(ROOT, refDir, 'drehbuch-meta.json');
const meta = existsSync(metaPath) ? JSON.parse(readFileSync(metaPath, 'utf8')) : {};
const spoken = (t) => t.replace(/\{([^|}]*)\|[^}]*\}/g, '$1');
const secs = (ms) => (ms / 1000).toFixed(1);

const rows = script.segments.map((seg) => {
	const t = manifest.segments.find((s) => s.id === seg.id);
	const m = meta[seg.id] ?? {};
	return `| ${t ? `${secs(t.startMs)}–${secs(t.endMs)} s` : '–'} | ${m.bild ?? ''} | ${spoken(seg.text)} | ${m.beleg ?? ''} |`;
});

const out = `# Drehbuch – ${args.title ?? id}

Komposition \`${args.comp ?? ''}\` · 1080×1920 · 30 fps · Stimme: Chatterbox (Vorlage Thorsten-Voice, CC0) · Sprechzeit ≈ ${secs(manifest.durationMs)} s

| Zeit | Bild | Sprechertext (wörtlich, Anzeigeform) | Beleg |
|---|---|---|---|
${rows.join('\n')}

Aussprachehilfen im Skript stehen als \`{Anzeige|Gesprochen}\` in \`script.json\`. Erzeugt mit \`scripts/voice/make-drehbuch.mjs\`.
`;
writeFileSync(path.join(ROOT, refDir, 'drehbuch.md'), out);
console.log(`✔ ${path.join(refDir, 'drehbuch.md')}`);
