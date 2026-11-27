import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {type Caption, createTikTokStyleCaptions, type TikTokPage} from '@remotion/captions';
import {clamp} from '../../lib/animation';
import {COLORS, FONTS, SAFE_AREA} from '../../theme/tokens';

export type TikTokSubtitlesProps = {
	captions: Caption[];
	/** Wörter innerhalb dieses Zeitfensters werden zu einer Seite zusammengefasst. */
	combineWithinMs?: number;
	/** Neue Seite nach einer Sprechpause dieser Länge (verhindert Seiten über Satzgrenzen). */
	breakOnSilenceMs?: number;
	/** Abstand der Untertitel-Mitte vom unteren Bildrand. */
	bottom?: number;
	fontSize?: number;
	highlightColor?: string;
	/** Seiten mit mehr Zeichen werden umbrochen (max. 2 Zeilen). */
	maxWidth?: number;
};

const Page: React.FC<{page: TikTokPage; fontSize: number; highlightColor: string; maxWidth: number}> = ({
	page,
	fontSize,
	highlightColor,
	maxWidth,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const timeMs = (frame / fps) * 1000 + page.startMs;
	const enter = interpolate(frame, [0, 5], [0, 1], clamp);

	return (
		<div
			style={{
				maxWidth,
				textAlign: 'center',
				fontFamily: FONTS.heading,
				fontWeight: 900,
				fontSize,
				lineHeight: 1.12,
				color: COLORS.text,
				scale: String(0.82 + 0.18 * enter),
				opacity: enter,
				// dicker schwarzer Rand wie bei TikTok-Untertiteln
				WebkitTextStroke: `${Math.round(fontSize * 0.13)}px #000`,
				paintOrder: 'stroke fill',
				textShadow: '0 6px 0 rgba(0,0,0,0.55)',
			}}
		>
			{page.tokens.map((token, i) => {
				const active = token.fromMs <= timeMs && token.toMs > timeMs;
				const t = interpolate(timeMs, [token.fromMs, token.fromMs + 90], [0, 1], clamp);
				return (
					<span
						key={i}
						style={{
							display: 'inline-block',
							marginLeft: i === 0 ? 0 : '0.34em',
							color: active ? highlightColor : COLORS.text,
							// nur nach oben „poppen“, damit der Wortabstand erhalten bleibt
							translate: active ? `0 ${-0.06 * t}em` : undefined,
						}}
					>
						{token.text.trim()}
					</span>
				);
			})}
		</div>
	);
};

/**
 * TikTok-typische Untertitel: 1–3 Wörter pro Seite, aktives Wort gelb hervorgehoben.
 * Erwartet Captions im @remotion/captions-Format (aus Sprecher-Manifest oder Whisper).
 */
export const TikTokSubtitles: React.FC<TikTokSubtitlesProps> = ({
	captions,
	combineWithinMs = 700,
	breakOnSilenceMs = 90,
	bottom = SAFE_AREA.bottom + 120,
	fontSize = 74,
	highlightColor = COLORS.signal,
	maxWidth = 1080 - SAFE_AREA.left - SAFE_AREA.right,
}) => {
	const {fps} = useVideoConfig();
	const {pages} = useMemo(
		() =>
			createTikTokStyleCaptions({
				captions,
				combineTokensWithinMilliseconds: combineWithinMs,
				breakOnSilenceAfterMilliseconds: breakOnSilenceMs,
			}),
		[captions, combineWithinMs, breakOnSilenceMs],
	);

	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			{pages.map((page, index) => {
				const next = pages[index + 1];
				const startFrame = Math.round((page.startMs / 1000) * fps);
				// Seite endet kurz nach ihrem letzten Wort (nicht erst beim nächsten Satz) → keine „hängenden“ Untertitel in Pausen
				const lastWordEnd = page.tokens.length > 0 ? page.tokens[page.tokens.length - 1].toMs : page.startMs + page.durationMs;
				const endMs = Math.min(next ? next.startMs : Infinity, lastWordEnd + 350);
				const endFrame = Math.round((endMs / 1000) * fps);
				const durationInFrames = Math.max(1, endFrame - startFrame);
				return (
					<Sequence key={index} from={startFrame} durationInFrames={durationInFrames} name={`Untertitel ${index + 1}`} layout="none">
						<AbsoluteFill
							style={{
								justifyContent: 'flex-end',
								alignItems: 'center',
								paddingBottom: bottom,
								paddingLeft: SAFE_AREA.left,
								paddingRight: SAFE_AREA.right,
							}}
						>
							<Page page={page} fontSize={fontSize} highlightColor={highlightColor} maxWidth={maxWidth} />
						</AbsoluteFill>
					</Sequence>
				);
			})}
		</AbsoluteFill>
	);
};
