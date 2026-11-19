import type {City} from './content';
import staedte from './data/staedte.json';

/** Die 73 Treffpunkte laut Website „Gen Z regelt“ (Stand 19.11.2026) – nur für die Szenen (Tests lesen die JSON-Datei direkt). */
export const CITIES = staedte.cities as City[];
