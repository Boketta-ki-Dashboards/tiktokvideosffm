/** Typen zu elevenlabs.mjs (für Tests und Editor). */
export type Alignment = {characters: string[]; character_start_times_seconds: number[]; character_end_times_seconds: number[]};
export type Caption = {text: string; startMs: number; endMs: number; timestampMs: number | null; confidence: number | null};
export type Voice = {voice_id?: string; name?: string; category?: string; [k: string]: unknown};
export const API_BASE: string;
export class ElevenLabsError extends Error {
	status?: number;
	code?: string;
	detail?: unknown;
	constructor(message: string, o?: {status?: number; code?: string; detail?: unknown});
}
export type Client = {
	getVoice(voiceId: string): Promise<Voice>;
	searchVoices(search: string): Promise<Voice[]>;
	searchSharedVoices(search: string): Promise<Voice[]>;
	getModels(): Promise<Array<Record<string, unknown>>>;
	getSubscription(): Promise<Record<string, unknown>>;
	ttsWithTimestamps(o: Record<string, unknown>): Promise<{audio: Buffer; alignment: Alignment | null; normalizedAlignment: Alignment | null; requestId: string | null}>;
	soundGeneration(o: {text: string; modelId: string; durationSeconds?: number; promptInfluence?: number; loop?: boolean; outputFormat?: string}): Promise<{audio: Buffer; requestId: string | null}>;
};
export function createClient(o?: {apiKey?: string; fetchImpl?: typeof fetch; base?: string; log?: (s: string) => void}): Client;
export function segmentCacheKey(o: {voiceId: string; modelId: string; outputFormat: string; voiceSettings: Record<string, unknown>; seed?: number; text: string}): string;
export function isOriginalAdam(voice: Voice | null | undefined, o?: {voiceName?: string; requireCategory?: string[]}): boolean;
export function modelSupportsGerman(models: unknown, modelId: string): {ok: boolean; reason?: string; model?: unknown};
export function tokenizeForAlignment(text: string): {spoken: string; tokens: Array<{text: string; start: number; end: number}>};
export function speechWindow(alignment: Alignment): {first: number; last: number};
export function captionsFromAlignment(o: {text: string; alignment: Alignment; offsetMs: number; cutStartSec: number; first?: boolean}): {captions: Caption[]; exact: boolean};
export function estimateCredits(texts: string[]): number;
export function sfxCacheKey(o: {modelId: string; outputFormat: string; text: string; durationSeconds?: number; promptInfluence?: number; loop?: boolean}): string;
export function isPermissionError(err: unknown): boolean;
