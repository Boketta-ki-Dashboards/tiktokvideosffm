/**
 * Markenangaben des TikTok-Kanals – EINZIGE Stelle für Accountname & Profilbild.
 * Alle Videos/Outros lesen von hier, damit nirgends ein alter Name stehen bleibt.
 */
export const BRAND = {
	/** TikTok-Handle ohne @ */
	handle: 'frankfurtred3',
	/** Buchstabe im Profilbild */
	avatarLetter: 'S',
	/** Farbverlauf des Profilbilds */
	avatarGradient: ['#FF3B4E', '#8B1E3F'] as const,
} as const;

export const handleWithAt = () => `@${BRAND.handle}`;
