import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, EASE_OUT} from '../../lib/animation';
import {formatNumber} from '../../lib/format';

export type AnimatedNumberProps = {
	value: number;
	from?: number;
	/** Startframe des Hochzählens (relativ zur Sequenz). */
	delay?: number;
	durationInFrames?: number;
	decimals?: number;
	prefix?: string;
	suffix?: string;
	style?: React.CSSProperties;
};

/** Zählt eine Zahl im deutschen Format hoch (8.000, 1,5 Mio. …). */
export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
	value,
	from = 0,
	delay = 0,
	durationInFrames = 36,
	decimals = 0,
	prefix = '',
	suffix = '',
	style,
}) => {
	const frame = useCurrentFrame();
	const v = interpolate(frame, [delay, delay + durationInFrames], [from, value], {...clamp, easing: EASE_OUT});
	const shown = decimals === 0 ? Math.round(v) : v;
	return (
		<span style={{fontVariantNumeric: 'tabular-nums', ...style}}>
			{prefix}
			{formatNumber(shown, {decimals})}
			{suffix}
		</span>
	);
};
