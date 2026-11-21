export function applyAussprache(text: string, regeln?: Record<string, string>): string;
export function ausspracheFor(voiceConfig: {aussprache?: {regeln?: Record<string, string>; ausnahmen?: string[]}}, videoId: string): Record<string, string>;
export function voiceSettingsFor(
	voiceConfig: {elevenlabs: {voiceSettings: Record<string, unknown>}; profiles?: Record<string, {voiceSettings?: Record<string, unknown>}>},
	script: {voice?: {profile?: string; elevenlabs?: {voiceSettings?: Record<string, unknown>}}} | null | undefined,
): Record<string, unknown>;
