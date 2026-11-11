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
import {
	calculateWorldwideMetadata,
	FrankfurtWorldwide,
	worldwideDefaultProps,
	worldwideSchema,
} from './videos/frankfurt-2026-10-31-international/FrankfurtWorldwide';
import {FrankfurtWorldwideCover} from './videos/frankfurt-2026-10-31-international/FrankfurtWorldwideCover';
import {
	calculateNov20Metadata,
	FrankfurtNov20Forecast,
	nov20DefaultProps,
	nov20Schema,
} from './videos/frankfurt-2026-11-20-ausblick/FrankfurtNov20Forecast';
import {FrankfurtNov20Cover} from './videos/frankfurt-2026-11-20-ausblick/FrankfurtNov20Cover';
import {FrankfurtNov20ForecastPremium} from './videos/frankfurt-2026-11-20-ausblick/FrankfurtNov20ForecastPremium';
import {FrankfurtNov20PremiumCover} from './videos/frankfurt-2026-11-20-ausblick/FrankfurtNov20PremiumCover';
import {
	calculatePoliceRightsMetadata,
	FrankfurtPoliceRights,
	policeRightsDefaultProps,
	policeRightsSchema,
} from './videos/frankfurt-2026-11-polizeikontrollen/FrankfurtPoliceRights';
import {FrankfurtPoliceRightsCover} from './videos/frankfurt-2026-11-polizeikontrollen/FrankfurtPoliceRightsCover';
import {
	calculateErklaertDemoFilmenMetadata,
	erklaertDemoFilmenDefaultProps,
	erklaertDemoFilmenSchema,
	FrankfurtErklaertDemoFilmen,
} from './videos/frankfurt-erklaert-01-demo-filmen/FrankfurtErklaertDemoFilmen';
import {FrankfurtErklaertDemoFilmenCover} from './videos/frankfurt-erklaert-01-demo-filmen/FrankfurtErklaertDemoFilmenCover';
import {
	calculateErklaert76Metadata,
	erklaert76DefaultProps,
	erklaert76Schema,
	FrankfurtErklaert76Fragen,
} from './videos/frankfurt-erklaert-76-fragen-landtag/FrankfurtErklaert76Fragen';
import {FrankfurtErklaert76FragenCover} from './videos/frankfurt-erklaert-76-fragen-landtag/FrankfurtErklaert76FragenCover';
import {
	calculateErklaert76Teil2Metadata,
	erklaert76Teil2DefaultProps,
	erklaert76Teil2Schema,
	FrankfurtErklaert76FragenTeil2,
} from './videos/frankfurt-erklaert-76-fragen-teil2/FrankfurtErklaert76FragenTeil2';
import {FrankfurtErklaert76FragenTeil2Cover} from './videos/frankfurt-erklaert-76-fragen-teil2/FrankfurtErklaert76FragenTeil2Cover';
import {
	calculateErklaert76Teil3Metadata,
	erklaert76Teil3DefaultProps,
	erklaert76Teil3Schema,
	FrankfurtErklaert76FragenTeil3,
} from './videos/frankfurt-erklaert-76-fragen-teil3/FrankfurtErklaert76FragenTeil3';
import {FrankfurtErklaert76FragenTeil3Cover} from './videos/frankfurt-erklaert-76-fragen-teil3/FrankfurtErklaert76FragenTeil3Cover';
import {FrankfurtErklaert76FragenTeil3CoverVorschau} from './videos/frankfurt-erklaert-76-fragen-teil3/FrankfurtErklaert76FragenTeil3CoverVorschau';
import {COVER_PREVIEW_SIZE} from './formats/frankfurt-erklaert/CoverPreview';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Folder name="Videos">
				{/* Format B #04 – 76 Fragen, Teil 3: Was ist immer noch offen? (12.11.2026), Titelbild tiefer (COVER_ZONE), max. 1.800 Frames */}
				<Composition
					id="FrankfurtErklaert76FragenTeil3"
					component={FrankfurtErklaert76FragenTeil3}
					width={VIDEO.width}
					height={VIDEO.height}
					fps={VIDEO.fps}
					durationInFrames={1800}
					schema={erklaert76Teil3Schema}
					defaultProps={erklaert76Teil3DefaultProps}
					calculateMetadata={calculateErklaert76Teil3Metadata}
				/>
				<Still id="FrankfurtErklaert76FragenTeil3-Cover" component={FrankfurtErklaert76FragenTeil3Cover} width={VIDEO.width} height={VIDEO.height} />
				{/* Prüfbogen Titelbild (eigene Komposition mit 30 fps, damit der eingebettete Videoframe echte Federn/Timings hat) */}
				<Composition id="FrankfurtErklaert76FragenTeil3-CoverVorschau" component={FrankfurtErklaert76FragenTeil3CoverVorschau} width={COVER_PREVIEW_SIZE.width} height={COVER_PREVIEW_SIZE.height} fps={VIDEO.fps} durationInFrames={1} />
				{/* Format B #03 – 76 Fragen, Teil 2: erste Antworten (11.11.2026), Titelbild im Video, max. 1.800 Frames */}
				<Composition
					id="FrankfurtErklaert76FragenTeil2"
					component={FrankfurtErklaert76FragenTeil2}
					width={VIDEO.width}
					height={VIDEO.height}
					fps={VIDEO.fps}
					durationInFrames={1800}
					schema={erklaert76Teil2Schema}
					defaultProps={erklaert76Teil2DefaultProps}
					calculateMetadata={calculateErklaert76Teil2Metadata}
				/>
				<Still id="FrankfurtErklaert76FragenTeil2-Cover" component={FrankfurtErklaert76FragenTeil2Cover} width={VIDEO.width} height={VIDEO.height} />
				{/* Format B #02 – 76 Fragen nach der Krawallnacht (Innenausschuss 10.11.2026), max. 1.800 Frames */}
				<Composition
					id="FrankfurtErklaert76Fragen"
					component={FrankfurtErklaert76Fragen}
					width={VIDEO.width}
					height={VIDEO.height}
					fps={VIDEO.fps}
					durationInFrames={1800}
					schema={erklaert76Schema}
					defaultProps={erklaert76DefaultProps}
					calculateMetadata={calculateErklaert76Metadata}
				/>
				<Still id="FrankfurtErklaert76Fragen-Cover" component={FrankfurtErklaert76FragenCover} width={VIDEO.width} height={VIDEO.height} />
				{/* Format B „Frankfurt erklärt in 60 Sekunden“ #01 – Nur gefilmt – trotzdem Ärger? (max. 1.800 Frames) */}
				<Composition
					id="FrankfurtErklaertDemoFilmen"
					component={FrankfurtErklaertDemoFilmen}
					width={VIDEO.width}
					height={VIDEO.height}
					fps={VIDEO.fps}
					durationInFrames={1800}
					schema={erklaertDemoFilmenSchema}
					defaultProps={erklaertDemoFilmenDefaultProps}
					calculateMetadata={calculateErklaertDemoFilmenMetadata}
				/>
				<Still id="FrankfurtErklaertDemoFilmen-Cover" component={FrankfurtErklaertDemoFilmenCover} width={VIDEO.width} height={VIDEO.height} />
				{/* Polizeikontrollen auf der Zeil – musst du dein Handy zeigen? */}
				<Composition
					id="FrankfurtPoliceRights"
					component={FrankfurtPoliceRights}
					width={VIDEO.width}
					height={VIDEO.height}
					fps={VIDEO.fps}
					durationInFrames={3900}
					schema={policeRightsSchema}
					defaultProps={policeRightsDefaultProps}
					calculateMetadata={calculatePoliceRightsMetadata}
				/>
				<Still id="FrankfurtPoliceRights-Cover" component={FrankfurtPoliceRightsCover} width={VIDEO.width} height={VIDEO.height} />
				{/* Ausblick: Frankfurt am 20. November – wieder Eskalation? */}
				<Composition
					id="FrankfurtNov20Forecast"
					component={FrankfurtNov20Forecast}
					width={VIDEO.width}
					height={VIDEO.height}
					fps={VIDEO.fps}
					durationInFrames={3300}
					schema={nov20Schema}
					defaultProps={nov20DefaultProps}
					calculateMetadata={calculateNov20Metadata}
				/>
				<Still id="FrankfurtNov20Forecast-Cover" component={FrankfurtNov20Cover} width={VIDEO.width} height={VIDEO.height} />
				{/* PREMIUM-Fassung: neue Bildebene, Ton/Timing/Untertitel unverändert aus FrankfurtNov20Forecast */}
				<Composition
					id="FrankfurtNov20ForecastPremium"
					component={FrankfurtNov20ForecastPremium}
					width={VIDEO.width}
					height={VIDEO.height}
					fps={VIDEO.fps}
					durationInFrames={3300}
					schema={nov20Schema}
					defaultProps={nov20DefaultProps}
					calculateMetadata={calculateNov20Metadata}
				/>
				<Still id="FrankfurtNov20ForecastPremium-Cover" component={FrankfurtNov20PremiumCover} width={VIDEO.width} height={VIDEO.height} />
				{/* Neufassung der unveröffentlichten Folge 1: Wie Frankfurt weltweit Schlagzeilen machte */}
				<Composition
					id="FrankfurtWorldwide"
					component={FrankfurtWorldwide}
					width={VIDEO.width}
					height={VIDEO.height}
					fps={VIDEO.fps}
					durationInFrames={3000}
					schema={worldwideSchema}
					defaultProps={worldwideDefaultProps}
					calculateMetadata={calculateWorldwideMetadata}
				/>
				<Still id="FrankfurtWorldwide-Cover" component={FrankfurtWorldwideCover} width={VIDEO.width} height={VIDEO.height} />
				{/* Folge 1 (Sicherung, unveröffentlicht) */}
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
