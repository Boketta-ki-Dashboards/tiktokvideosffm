#!/usr/bin/env node
/**
 * Erstellt ein Sprecher-Manifest OHNE Audiodatei (Timings aus dem Text geschätzt).
 * Damit ist jedes Video sofort renderbar – stumm, aber mit synchronen Untertiteln.
 *
 *   node scripts/voice/estimate-manifest.mjs --video frankfurt-2026-10-31
 */
import {buildEstimatedManifest} from '../../src/lib/script-timing.ts';
import {parseArgs, readScript, writeManifest} from '../lib/project.mjs';

const args = parseArgs(process.argv.slice(2));
const videoId = args.video ?? 'frankfurt-2026-10-31';
const script = readScript(videoId);
const manifest = buildEstimatedManifest(script);
manifest.generatedAt = new Date().toISOString();
const file = writeManifest(videoId, manifest);
console.log(`✔ Geschätztes Manifest geschrieben: ${file} (${(manifest.durationMs / 1000).toFixed(2)} s Sprechzeit, keine Audiodatei)`);
