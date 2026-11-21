/**
 * Dauerhafte Ausspracheregeln (config/voice.json → "aussprache"): Wörter werden im Sprechertext automatisch
 * in Anzeige-/Sprech-Markup umgewandelt, z. B. „Ewa“ → „{Ewa|Eywa}“ (Untertitel zeigen „Ewa“, Adam spricht „Eywa“).
 * Bereits vorhandenes Markup {…|…} bleibt unangetastet. Videos aus "ausnahmen" (schon fertig produziert) bleiben
 * unverändert, damit ihre Sprecherspur bei einer erneuten Erzeugung byte-gleich aus dem Cache kommt.
 */
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const applyAussprache = (text, regeln = {}) => {
	const parts = text.split(/(\{[^}]*\})/g);
	return parts
		.map((part) => {
			if (part.startsWith('{')) return part;
			let out = part;
			for (const [wort, gesprochen] of Object.entries(regeln)) {
				out = out.replace(new RegExp(`(?<![\\p{L}\\d])${escape(wort)}(?![\\p{L}\\d])`, 'gu'), `{${wort}|${gesprochen}}`);
			}
			return out;
		})
		.join('');
};

export const ausspracheFor = (voiceConfig, videoId) => {
	const a = voiceConfig.aussprache ?? {};
	if (!a.regeln || (a.ausnahmen ?? []).includes(videoId)) return {};
	return a.regeln;
};

/** Stimmprofil (z. B. „kurzformat-60“: speed 1.20) über die Grundeinstellungen legen – nur wenn das Skript es nennt. */
export const voiceSettingsFor = (voiceConfig, script) => {
	const base = voiceConfig.elevenlabs.voiceSettings;
	const profileName = script?.voice?.profile;
	const profile = profileName ? voiceConfig.profiles?.[profileName] : undefined;
	if (profileName && !profile) throw new Error(`Stimmprofil „${profileName}“ fehlt in config/voice.json → profiles.`);
	return {...base, ...(profile?.voiceSettings ?? {}), ...(script?.voice?.elevenlabs?.voiceSettings ?? {})};
};
