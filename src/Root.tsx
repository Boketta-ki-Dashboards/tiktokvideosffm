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
import {
	calculateShopsMetadata,
	FrankfurtShops,
	shopsDefaultProps,
	shopsSchema,
} from './videos/frankfurt-2026-10-31-geschaefte/FrankfurtShops';
import {FrankfurtShopsCover} from './videos/frankfurt-2026-10-31-geschaefte/FrankfurtShopsCover';
import {
	calculateNextDemoMetadata,
	FrankfurtNextDemo,
	nextDemoDefaultProps,
	nextDemoSchema,
} from './videos/frankfurt-2026-11-04-naechste-demo/FrankfurtNextDemo';
import {FrankfurtNextDemoCover} from './videos/frankfurt-2026-11-04-naechste-demo/FrankfurtNextDemoCover';

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
				{/* Folge 2: beschädigte und geplünderte Geschäfte */}
				<Composition
					id="FrankfurtShops"
					component={FrankfurtShops}
					width={VIDEO.width}
					height={VIDEO.height}
					fps={VIDEO.fps}
					durationInFrames={1800}
					schema={shopsSchema}
					defaultProps={shopsDefaultProps}
					calculateMetadata={calculateShopsMetadata}
				/>
				<Still id="FrankfurtShops-Cover" component={FrankfurtShopsCover} width={VIDEO.width} height={VIDEO.height} />
				{/* Folge 3: Wann geht es in Frankfurt weiter? (14./20./21. November) */}
				<Composition
					id="FrankfurtNextDemo"
					component={FrankfurtNextDemo}
					width={VIDEO.width}
					height={VIDEO.height}
					fps={VIDEO.fps}
					durationInFrames={1900}
					schema={nextDemoSchema}
					defaultProps={nextDemoDefaultProps}
					calculateMetadata={calculateNextDemoMetadata}
				/>
				<Still id="FrankfurtNextDemo-Cover" component={FrankfurtNextDemoCover} width={VIDEO.width} height={VIDEO.height} />
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
