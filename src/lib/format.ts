const formatters = new Map<string, Intl.NumberFormat>();

/** Zahl im deutschen Format (8.000 / 1,5) – Formatter werden gecacht. */
export const formatNumber = (
	value: number,
	{decimals = 0, locale = 'de-DE'}: {decimals?: number; locale?: string} = {},
) => {
	const key = `${locale}-${decimals}`;
	let formatter = formatters.get(key);
	if (!formatter) {
		formatter = new Intl.NumberFormat(locale, {
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals,
		});
		formatters.set(key, formatter);
	}

	return formatter.format(value);
};
