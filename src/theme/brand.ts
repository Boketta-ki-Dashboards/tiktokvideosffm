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

/**
 * Kanalname ab „Krankheitsfälle auf zwei Condor-Flügen“ (#17, 23.11.2026): Der TikTok-Account heißt jetzt **FrankfurtRedNews**
 * (vorher FrankfurtRed3). Profilbild/Logo, Farben und Stil bleiben unverändert. Fertige Folgen (#01–#16) behalten `BRAND.handle`
 * und werden nicht verändert – neue Folgen wählen ausdrücklich `'news'` (Outro, Titelbild-Logozeile, Prüfbögen).
 * `spoken` = Lautschrift für Adam (wie „Frankfurt Rett Drei“ bei FrankfurtRed3, damit „Red“ nicht wie „rät“ klingt).
 */
export const BRAND_NEWS = {
	name: 'FrankfurtRedNews',
	handle: 'frankfurtrednews',
	spoken: 'Frankfurt Rett News',
	since: '2026-11-23',
} as const;

/** Kanal-Variante: `'red3'` = bisheriger Name (Standard für alle fertigen Folgen), `'news'` = FrankfurtRedNews (ab #17). */
export type BrandVariant = 'red3' | 'news';

export const handleWithAt = (variant: BrandVariant = 'red3') => `@${variant === 'news' ? BRAND_NEWS.handle : BRAND.handle}`;
