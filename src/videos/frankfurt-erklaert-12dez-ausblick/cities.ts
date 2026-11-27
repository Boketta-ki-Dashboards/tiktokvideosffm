import staedte from './data/staedte.json';

/** Städteliste der Website für den 12.12.2026 (Lage der Städte; Treffpunkte noch nicht veröffentlicht). */
export type City12 = {name: string; lat: number; lon: number; central: boolean};
export const CITIES_12 = staedte.cities as City12[];
