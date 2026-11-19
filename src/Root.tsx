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
import {
	calculateErklaert76Teil4Metadata,
	erklaert76Teil4DefaultProps,
	erklaert76Teil4Schema,
	FrankfurtErklaert76FragenTeil4,
} from './videos/frankfurt-erklaert-76-fragen-teil4/FrankfurtErklaert76FragenTeil4';
import {FrankfurtErklaert76FragenTeil4Cover} from './videos/frankfurt-erklaert-76-fragen-teil4/FrankfurtErklaert76FragenTeil4Cover';
import {FrankfurtErklaert76FragenTeil4CoverVorschau} from './videos/frankfurt-erklaert-76-fragen-teil4/FrankfurtErklaert76FragenTeil4CoverVorschau';
import {
	calculateErklaert14NovemberMetadata,
	erklaert14NovemberDefaultProps,
	erklaert14NovemberSchema,
	FrankfurtErklaert14November,
} from './videos/frankfurt-erklaert-14-november-2026/FrankfurtErklaert14November';
import {FrankfurtErklaert14NovemberCover} from './videos/frankfurt-erklaert-14-november-2026/FrankfurtErklaert14NovemberCover';
import {FrankfurtErklaert14NovemberCoverVorschau} from './videos/frankfurt-erklaert-14-november-2026/FrankfurtErklaert14NovemberCoverVorschau';
import {
	calculateErklaertGenZPhase2Metadata,
	erklaertGenZPhase2DefaultProps,
	erklaertGenZPhase2Schema,
	FrankfurtErklaertGenZPhase2,
} from './videos/frankfurt-erklaert-genz-phase2-2026-11-14/FrankfurtErklaertGenZPhase2';
import {FrankfurtErklaertGenZPhase2Cover} from './videos/frankfurt-erklaert-genz-phase2-2026-11-14/FrankfurtErklaertGenZPhase2Cover';
import {FrankfurtErklaertGenZPhase2CoverVorschau} from './videos/frankfurt-erklaert-genz-phase2-2026-11-14/FrankfurtErklaertGenZPhase2CoverVorschau';
import {
	calculateErklaert13DemonstrantenMetadata,
	erklaert13DemonstrantenDefaultProps,
	erklaert13DemonstrantenSchema,
	FrankfurtErklaert13Demonstranten,
} from './videos/frankfurt-erklaert-13-demonstranten-2026-11-14/FrankfurtErklaert13Demonstranten';
import {FrankfurtErklaert13DemonstrantenCover} from './videos/frankfurt-erklaert-13-demonstranten-2026-11-14/FrankfurtErklaert13DemonstrantenCover';
import {FrankfurtErklaert13DemonstrantenCoverVorschau} from './videos/frankfurt-erklaert-13-demonstranten-2026-11-14/FrankfurtErklaert13DemonstrantenCoverVorschau';
import {
	calculateErklaert20NovemberMetadata,
	erklaert20NovemberDefaultProps,
	erklaert20NovemberSchema,
	FrankfurtErklaert20NovemberDreiProteste,
} from './videos/frankfurt-erklaert-20nov-drei-proteste/FrankfurtErklaert20NovemberDreiProteste';
import {FrankfurtErklaert20NovemberDreiProtesteCover} from './videos/frankfurt-erklaert-20nov-drei-proteste/FrankfurtErklaert20NovemberDreiProtesteCover';
import {FrankfurtErklaert20NovemberDreiProtesteCoverVorschau} from './videos/frankfurt-erklaert-20nov-drei-proteste/FrankfurtErklaert20NovemberDreiProtesteCoverVorschau';
import {FrankfurtErklaert20NovemberDreiProtesteOverlayCheck} from './videos/frankfurt-erklaert-20nov-drei-proteste/FrankfurtErklaert20NovemberDreiProtesteOverlayCheck';
import {
	calculateErklaertDemoUpdateMetadata,
	erklaertDemoUpdateDefaultProps,
	erklaertDemoUpdateSchema,
	FrankfurtErklaert20NovemberDemoUpdate,
} from './videos/frankfurt-erklaert-20nov-demo-update/FrankfurtErklaert20NovemberDemoUpdate';
import {FrankfurtErklaert20NovemberDemoUpdateCover} from './videos/frankfurt-erklaert-20nov-demo-update/FrankfurtErklaert20NovemberDemoUpdateCover';
import {FrankfurtErklaert20NovemberDemoUpdateCoverVorschau} from './videos/frankfurt-erklaert-20nov-demo-update/FrankfurtErklaert20NovemberDemoUpdateCoverVorschau';
import {FrankfurtErklaert20NovemberDemoUpdateOverlayCheck} from './videos/frankfurt-erklaert-20nov-demo-update/FrankfurtErklaert20NovemberDemoUpdateOverlayCheck';
import {
	calculateErklaertOepnvMetadata,
	erklaertOepnvDefaultProps,
	erklaertOepnvSchema,
	FrankfurtErklaert20NovemberOepnv,
} from './videos/frankfurt-erklaert-20nov-oepnv/FrankfurtErklaert20NovemberOepnv';
import {FrankfurtErklaert20NovemberOepnvCover} from './videos/frankfurt-erklaert-20nov-oepnv/FrankfurtErklaert20NovemberOepnvCover';
import {FrankfurtErklaert20NovemberOepnvCoverVorschau} from './videos/frankfurt-erklaert-20nov-oepnv/FrankfurtErklaert20NovemberOepnvCoverVorschau';
import {FrankfurtErklaert20NovemberOepnvOverlayCheck} from './videos/frankfurt-erklaert-20nov-oepnv/FrankfurtErklaert20NovemberOepnvOverlayCheck';
import {
	calculateErklaertBundesweitMetadata,
	erklaertBundesweitDefaultProps,
	erklaertBundesweitSchema,
	FrankfurtErklaert20NovemberBundesweit,
} from './videos/frankfurt-erklaert-20nov-bundesweit/FrankfurtErklaert20NovemberBundesweit';
import {FrankfurtErklaert20NovemberBundesweitCover} from './videos/frankfurt-erklaert-20nov-bundesweit/FrankfurtErklaert20NovemberBundesweitCover';
import {FrankfurtErklaert20NovemberBundesweitCoverVorschau} from './videos/frankfurt-erklaert-20nov-bundesweit/FrankfurtErklaert20NovemberBundesweitCoverVorschau';
import {
	FrankfurtErklaert20NovemberBundesweitOverlayCheck,
	FrankfurtErklaert20NovemberBundesweitSourceCheck,
	SOURCE_CHECK_SIZE,
} from './videos/frankfurt-erklaert-20nov-bundesweit/FrankfurtErklaert20NovemberBundesweitOverlayCheck';
import {OVERLAY_CHECK_SIZE} from './formats/frankfurt-erklaert/OverlayCheck';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Folder name="Videos">
				{/* Format B #12 – 73 Städte – ein Protesttag! (Stand 19.11.2026, 14 Uhr): hartes Limit 60 s inkl. Abo-Aufruf, erste Folge mit Quellenzeile UNTER den Untertiteln */}
				<Composition
					id="FrankfurtErklaert20NovemberBundesweit"
					component={FrankfurtErklaert20NovemberBundesweit}
					width={VIDEO.width}
					height={VIDEO.height}
					fps={VIDEO.fps}
					durationInFrames={1800}
					schema={erklaertBundesweitSchema}
					defaultProps={erklaertBundesweitDefaultProps}
					calculateMetadata={calculateErklaertBundesweitMetadata}
				/>
				<Still id="FrankfurtErklaert20NovemberBundesweit-Cover" component={FrankfurtErklaert20NovemberBundesweitCover} width={VIDEO.width} height={VIDEO.height} />
				<Composition id="FrankfurtErklaert20NovemberBundesweit-CoverVorschau" component={FrankfurtErklaert20NovemberBundesweitCoverVorschau} width={COVER_PREVIEW_SIZE.width} height={COVER_PREVIEW_SIZE.height} fps={VIDEO.fps} durationInFrames={1} />
				<Composition id="FrankfurtErklaert20NovemberBundesweit-OverlayCheck" component={FrankfurtErklaert20NovemberBundesweitOverlayCheck} width={OVERLAY_CHECK_SIZE.width} height={OVERLAY_CHECK_SIZE.height} fps={VIDEO.fps} durationInFrames={1} />
				<Composition id="FrankfurtErklaert20NovemberBundesweit-QuellenCheck" component={FrankfurtErklaert20NovemberBundesweitSourceCheck} width={SOURCE_CHECK_SIZE.width} height={SOURCE_CHECK_SIZE.height} fps={VIDEO.fps} durationInFrames={1} />
				{/* Format B #11 – Frankfurt morgen: Diese Bahnen sind betroffen! (Stand VGF 18.11.2026, 14 Uhr): hartes Limit 60 s inkl. Abo-Aufruf, Kopfzeile symmetrisch oben */}
				<Composition
					id="FrankfurtErklaert20NovemberOepnv"
					component={FrankfurtErklaert20NovemberOepnv}
					width={VIDEO.width}
					height={VIDEO.height}
					fps={VIDEO.fps}
					durationInFrames={1800}
					schema={erklaertOepnvSchema}
					defaultProps={erklaertOepnvDefaultProps}
					calculateMetadata={calculateErklaertOepnvMetadata}
				/>
				<Still id="FrankfurtErklaert20NovemberOepnv-Cover" component={FrankfurtErklaert20NovemberOepnvCover} width={VIDEO.width} height={VIDEO.height} />
				<Composition id="FrankfurtErklaert20NovemberOepnv-CoverVorschau" component={FrankfurtErklaert20NovemberOepnvCoverVorschau} width={COVER_PREVIEW_SIZE.width} height={COVER_PREVIEW_SIZE.height} fps={VIDEO.fps} durationInFrames={1} />
				<Composition id="FrankfurtErklaert20NovemberOepnv-OverlayCheck" component={FrankfurtErklaert20NovemberOepnvOverlayCheck} width={OVERLAY_CHECK_SIZE.width} height={OVERLAY_CHECK_SIZE.height} fps={VIDEO.fps} durationInFrames={1} />
				{/* Format B #10 – Gen-Z-Demo am 20.11. geändert! (Stand 18.11.2026, 15:28 Uhr): hartes Limit 60 s inkl. Abo-Aufruf, Kopfzeile symmetrisch oben */}
				<Composition
					id="FrankfurtErklaert20NovemberDemoUpdate"
					component={FrankfurtErklaert20NovemberDemoUpdate}
					width={VIDEO.width}
					height={VIDEO.height}
					fps={VIDEO.fps}
					durationInFrames={1800}
					schema={erklaertDemoUpdateSchema}
					defaultProps={erklaertDemoUpdateDefaultProps}
					calculateMetadata={calculateErklaertDemoUpdateMetadata}
				/>
				<Still id="FrankfurtErklaert20NovemberDemoUpdate-Cover" component={FrankfurtErklaert20NovemberDemoUpdateCover} width={VIDEO.width} height={VIDEO.height} />
				<Composition id="FrankfurtErklaert20NovemberDemoUpdate-CoverVorschau" component={FrankfurtErklaert20NovemberDemoUpdateCoverVorschau} width={COVER_PREVIEW_SIZE.width} height={COVER_PREVIEW_SIZE.height} fps={VIDEO.fps} durationInFrames={1} />
				<Composition id="FrankfurtErklaert20NovemberDemoUpdate-OverlayCheck" component={FrankfurtErklaert20NovemberDemoUpdateOverlayCheck} width={OVERLAY_CHECK_SIZE.width} height={OVERLAY_CHECK_SIZE.height} fps={VIDEO.fps} durationInFrames={1} />
				{/* Format B #09 – 4 Proteste, 1 Freitag (Frankfurt 20.11.2026, Stand 17.11.): Serien-Overlay oben rechts; Längen-Ausnahme Info ≤ 61,5 s + Abo-Aufruf, ≤ 64 s */}
				<Composition
					id="FrankfurtErklaert20NovemberDreiProteste"
					component={FrankfurtErklaert20NovemberDreiProteste}
					width={VIDEO.width}
					height={VIDEO.height}
					fps={VIDEO.fps}
					durationInFrames={1920}
					schema={erklaert20NovemberSchema}
					defaultProps={erklaert20NovemberDefaultProps}
					calculateMetadata={calculateErklaert20NovemberMetadata}
				/>
				<Still id="FrankfurtErklaert20NovemberDreiProteste-Cover" component={FrankfurtErklaert20NovemberDreiProtesteCover} width={VIDEO.width} height={VIDEO.height} />
				<Composition id="FrankfurtErklaert20NovemberDreiProteste-CoverVorschau" component={FrankfurtErklaert20NovemberDreiProtesteCoverVorschau} width={COVER_PREVIEW_SIZE.width} height={COVER_PREVIEW_SIZE.height} fps={VIDEO.fps} durationInFrames={1} />
				<Composition id="FrankfurtErklaert20NovemberDreiProteste-OverlayCheck" component={FrankfurtErklaert20NovemberDreiProtesteOverlayCheck} width={OVERLAY_CHECK_SIZE.width} height={OVERLAY_CHECK_SIZE.height} fps={VIDEO.fps} durationInFrames={1} />
				{/* Format B #08 – Nur 13 Demonstranten? (Frankfurt 14.11.2026, Stand 16.11.): Längen-Ausnahme Info ≤ 61,5 s + Abo-Aufruf, ≤ 64 s */}
				<Composition
					id="FrankfurtErklaert13Demonstranten"
					component={FrankfurtErklaert13Demonstranten}
					width={VIDEO.width}
					height={VIDEO.height}
					fps={VIDEO.fps}
					durationInFrames={1920}
					schema={erklaert13DemonstrantenSchema}
					defaultProps={erklaert13DemonstrantenDefaultProps}
					calculateMetadata={calculateErklaert13DemonstrantenMetadata}
				/>
				<Still id="FrankfurtErklaert13Demonstranten-Cover" component={FrankfurtErklaert13DemonstrantenCover} width={VIDEO.width} height={VIDEO.height} />
				<Composition id="FrankfurtErklaert13Demonstranten-CoverVorschau" component={FrankfurtErklaert13DemonstrantenCoverVorschau} width={COVER_PREVIEW_SIZE.width} height={COVER_PREVIEW_SIZE.height} fps={VIDEO.fps} durationInFrames={1} />
				{/* Format B #07 – Gen Z regelt, Phase 2 (Proteste 14.11.2026, Stand 15.11.): hartes Limit 60 s inkl. Abo-Aufruf */}
				<Composition
					id="FrankfurtErklaertGenZPhase2"
					component={FrankfurtErklaertGenZPhase2}
					width={VIDEO.width}
					height={VIDEO.height}
					fps={VIDEO.fps}
					durationInFrames={1800}
					schema={erklaertGenZPhase2Schema}
					defaultProps={erklaertGenZPhase2DefaultProps}
					calculateMetadata={calculateErklaertGenZPhase2Metadata}
				/>
				<Still id="FrankfurtErklaertGenZPhase2-Cover" component={FrankfurtErklaertGenZPhase2Cover} width={VIDEO.width} height={VIDEO.height} />
				<Composition id="FrankfurtErklaertGenZPhase2-CoverVorschau" component={FrankfurtErklaertGenZPhase2CoverVorschau} width={COVER_PREVIEW_SIZE.width} height={COVER_PREVIEW_SIZE.height} fps={VIDEO.fps} durationInFrames={1} />
				{/* Format B – Sondervideo 14.11.2026: Doch eine Gen-Z-Demo? Längen-Ausnahme (Info ≤ 61,5 s + Abo-Aufruf, ≤ 66 s) */}
				<Composition
					id="FrankfurtErklaert14November"
					component={FrankfurtErklaert14November}
					width={VIDEO.width}
					height={VIDEO.height}
					fps={VIDEO.fps}
					durationInFrames={1980}
					schema={erklaert14NovemberSchema}
					defaultProps={erklaert14NovemberDefaultProps}
					calculateMetadata={calculateErklaert14NovemberMetadata}
				/>
				<Still id="FrankfurtErklaert14November-Cover" component={FrankfurtErklaert14NovemberCover} width={VIDEO.width} height={VIDEO.height} />
				<Composition id="FrankfurtErklaert14November-CoverVorschau" component={FrankfurtErklaert14NovemberCoverVorschau} width={COVER_PREVIEW_SIZE.width} height={COVER_PREVIEW_SIZE.height} fps={VIDEO.fps} durationInFrames={1} />
				{/* Format B #05 – 76 Fragen, Teil 4: vier weitere Antworten; begründete Längen-Ausnahme (Info ≤ 61,5 s + Abo-Aufruf, ≤ 66 s) */}
				<Composition
					id="FrankfurtErklaert76FragenTeil4"
					component={FrankfurtErklaert76FragenTeil4}
					width={VIDEO.width}
					height={VIDEO.height}
					fps={VIDEO.fps}
					durationInFrames={1980}
					schema={erklaert76Teil4Schema}
					defaultProps={erklaert76Teil4DefaultProps}
					calculateMetadata={calculateErklaert76Teil4Metadata}
				/>
				<Still id="FrankfurtErklaert76FragenTeil4-Cover" component={FrankfurtErklaert76FragenTeil4Cover} width={VIDEO.width} height={VIDEO.height} />
				<Composition id="FrankfurtErklaert76FragenTeil4-CoverVorschau" component={FrankfurtErklaert76FragenTeil4CoverVorschau} width={COVER_PREVIEW_SIZE.width} height={COVER_PREVIEW_SIZE.height} fps={VIDEO.fps} durationInFrames={1} />
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
