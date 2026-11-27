import {useId} from 'react';

/** SVG-taugliche, eindeutige ID (React-IDs enthalten Sonderzeichen, die url(#…) brechen). */
export const useSvgId = (prefix: string) => {
	const id = useId();
	return `${prefix}-${id.replace(/[^a-zA-Z0-9_-]/g, '')}`;
};
