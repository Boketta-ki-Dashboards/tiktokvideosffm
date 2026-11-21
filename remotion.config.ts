/**
 * Globale Remotion-Konfiguration für CLI-Renderings (`npx remotion render`, Studio).
 * Gilt NICHT für die Node-APIs (@remotion/renderer) – dort gelten die Werte aus scripts/.
 *
 * Exportstandard SmokingTikTok Studio: 1080×1920, 30 fps, H.264 (High), yuv420p, AAC.
 */
import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setCodec('h264');
Config.setPixelFormat('yuv420p');
Config.setCrf(18);
Config.setAudioCodec('aac');
Config.setAudioBitrate('192k');
Config.setOverwriteOutput(true);
Config.setChromiumOpenGlRenderer('angle');

// Optional eigener Chrome/Headless-Shell (z. B. in Cloud-Containern vorinstalliert).
// In GitHub Actions lädt Remotion automatisch die passende Chrome Headless Shell.
if (process.env.REMOTION_BROWSER_EXECUTABLE) {
	Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
}
