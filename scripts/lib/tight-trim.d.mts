export type Alignment = {characters: string[]; character_start_times_seconds: number[]; character_end_times_seconds: number[]};
export function letterWindow(alignment: Alignment): {first: number; last: number};
export function compressGaps(alignment: Alignment, cutStart: number, cutEnd: number, maxGapSec: number): {ranges: Array<[number, number]>; removedSec: number; alignment: Alignment};
