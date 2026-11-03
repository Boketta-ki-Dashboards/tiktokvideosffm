import React from 'react';
import {Composition, Folder, Still} from 'remotion';
import {VIDEO} from './theme/tokens';
import {ComponentShowcase, SHOWCASE_DURATION} from './showcase/ComponentShowcase';
import {
	calculateFrankfurtMetadata,
	FrankfurtHeadlines,
	frankfurtDefaultProps,
	frankfurtSchema,
} from './videos/frankfurt-2026-10-31/FrankfurtHeadlines';
import {FrankfurtCover} from './videos/frankfurt-2026-10-31/FrankfurtCover';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Folder name="Videos">
				<Composition
					id="FrankfurtHeadlines"
					component={FrankfurtHeadlines}
					width={VIDEO.width}
					height={VIDEO.height}
					fps={VIDEO.fps}
					durationInFrames={600}
					schema={frankfurtSchema}
					defaultProps={frankfurtDefaultProps}
					calculateMetadata={calculateFrankfurtMetadata}
				/>
				<Still id="FrankfurtHeadlines-Cover" component={FrankfurtCover} width={VIDEO.width} height={VIDEO.height} />
			</Folder>
			<Folder name="Bibliothek">
				<Composition
					id="ComponentShowcase"
					component={ComponentShowcase}
					width={VIDEO.width}
					height={VIDEO.height}
					fps={VIDEO.fps}
					durationInFrames={SHOWCASE_DURATION}
				/>
			</Folder>
		</>
	);
};
