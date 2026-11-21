/**
 * Markenangaben des TikTok-Kanals – EINZIGE Stelle für Accountname, Logo & Profilbild.
 * Alle Videos/Outros lesen von hier, damit nirgends ein alter Name oder Bildpfad doppelt steht.
 */
export const BRAND = {
	/** TikTok-Handle ohne @ */
	handle: 'frankfurtred3',
	/**
	 * Offizielles FrankfurtRed-Logo (FR-Monogramm, Skyline, Schriftzug „FRANKFURT RED“), 768 × 768 WebP,
	 * Pfad relativ zu `public/` (für `staticFile()`). Standard für ALLE neuen Outros, Follow-CTAs und Profilhinweise
	 * ab „Gen Z regelt – Phase 2“ (15.11.2026) – Darstellung nur über `<BrandLogo>` (src/components/brand/BrandLogo.tsx).
	 */
	logoFile: 'brand/frankfurtred-logo.webp',
	logoAlt: 'FrankfurtRed – offizielles Logo',
	/** Buchstabe im alten Profilbild – nur noch für bereits fertige Folgen (BrandAvatar), nicht für neue Produktionen */
	avatarLetter: 'S',
	/** Farbverlauf des alten Profilbilds / Akzent für Logo-Ring */
	avatarGradient: ['#FF3B4E', '#8B1E3F'] as const,
} as const;

export const handleWithAt = () => `@${BRAND.handle}`;
