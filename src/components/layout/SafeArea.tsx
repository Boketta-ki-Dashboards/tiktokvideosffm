import React from 'react';
import {AbsoluteFill} from 'remotion';
import {SAFE_AREA} from '../../theme/tokens';

/** Inhalt innerhalb der TikTok-Sicherheitszonen. */
export const SafeArea: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
	<AbsoluteFill
		style={{
			paddingTop: SAFE_AREA.top,
			paddingRight: SAFE_AREA.right,
			paddingBottom: SAFE_AREA.bottom,
			paddingLeft: SAFE_AREA.left,
			...style,
		}}
	>
		{children}
	</AbsoluteFill>
);

/** Hilfslinien der Sicherheitszonen (nur für die Vorschau im Studio einschalten). */
export const SafeAreaGuides: React.FC = () => (
	<AbsoluteFill style={{pointerEvents: 'none'}}>
		<div
			style={{
				position: 'absolute',
				top: SAFE_AREA.top,
				right: SAFE_AREA.right,
				bottom: SAFE_AREA.bottom,
				left: SAFE_AREA.left,
				border: '3px dashed rgba(255, 0, 128, 0.8)',
			}}
		/>
	</AbsoluteFill>
);
