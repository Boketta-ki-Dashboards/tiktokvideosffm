/* eslint-disable */
// Automatisch geschrieben von scripts/audio/elevenlabs-sfx.mjs – nicht von Hand ändern.
// Leer = nur selbst erzeugte Effekte (public/sfx/*.wav). Einträge ersetzen den gleichnamigen Effekt in src/lib/sfx.ts.
export const PREMIUM_SFX: Record<string, {file: string; prompt: string; model: string; cacheKey: string}> = {
	"boom": {
		"file": "sfx/premium/boom.mp3",
		"prompt": "Deep cinematic trailer impact, low sub boom with a long dark reverb tail, no music, no voice",
		"model": "eleven_text_to_sound_v3",
		"cacheKey": "5816d4759300ddf2f7bacb9a"
	},
	"typewriter": {
		"file": "sfx/premium/typewriter.mp3",
		"prompt": "Fast typing on a modern laptop keyboard, about ten crisp key presses, dry studio recording, no voice",
		"model": "eleven_text_to_sound_v3",
		"cacheKey": "5b0f04bfbcbdde8eb8825237"
	},
	"notify": {
		"file": "sfx/premium/notify.mp3",
		"prompt": "Short friendly two-tone smartphone notification chime, clean and modern, no voice",
		"model": "eleven_text_to_sound_v3",
		"cacheKey": "7017757c4519368900094229"
	},
	"blip": {
		"file": "sfx/premium/blip.mp3",
		"prompt": "Short soft electronic data blip for a digital map marker appearing, futuristic UI sound, no voice",
		"model": "eleven_text_to_sound_v3",
		"cacheKey": "e8cabf46c3d8492ecd24f086"
	}
};
