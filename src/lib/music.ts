/**
 * The site's background tune: a sneaky, lofi "evil genius in a cardigan" loop.
 * Pure data + timing helpers; the Web Audio engine lives in src/scripts/music.ts.
 *
 * Everything is in 16th-note steps. One bar = 16 steps, one loop = 4 bars,
 * and the melody joins in on every other loop so it never gets tiresome.
 */

export const BPM = 78;
export const STEPS_PER_BAR = 16;
export const BARS = 4;
export const LOOP_STEPS = STEPS_PER_BAR * BARS;
/** 0 = straight, 0.5 = full triplet swing. Lofi lives around 0.2–0.3. */
export const SWING = 0.24;

export type Hit = { step: number; note: number };

export interface Bar {
  name: string;
  /** Rhodes voicing (MIDI notes), held for the bar. */
  chord: number[];
  /** Plucked upright bass. */
  bass: Hit[];
}

/** Am9 – Fmaj7(#11) – Dm9 – E7(b9): moody, curious, slightly up to something. */
export const BARS_DATA: Bar[] = [
  {
    name: 'Am9',
    chord: [60, 64, 67, 71],
    bass: [
      { step: 0, note: 45 },
      { step: 6, note: 40 },
      { step: 8, note: 43 },
      { step: 10, note: 45 },
      { step: 14, note: 42 },
    ],
  },
  {
    name: 'Fmaj7#11',
    chord: [57, 60, 64, 71],
    bass: [
      { step: 0, note: 41 },
      { step: 6, note: 48 },
      { step: 8, note: 45 },
      { step: 10, note: 41 },
      { step: 14, note: 37 },
    ],
  },
  {
    name: 'Dm9',
    chord: [53, 57, 60, 64],
    bass: [
      { step: 0, note: 38 },
      { step: 6, note: 45 },
      { step: 8, note: 41 },
      { step: 10, note: 38 },
      { step: 14, note: 39 },
    ],
  },
  {
    name: 'E7b9',
    chord: [56, 59, 62, 65],
    bass: [
      { step: 0, note: 40 },
      { step: 6, note: 47 },
      { step: 8, note: 44 },
      { step: 10, note: 40 },
      { step: 12, note: 41 },
      { step: 14, note: 44 },
    ],
  },
];

/** The scheming little vibraphone motif (steps are within the whole loop). */
export const MELODY: Hit[] = [
  { step: 4, note: 76 },
  { step: 6, note: 75 },
  { step: 8, note: 76 },
  { step: 12, note: 72 },
  { step: 14, note: 71 },
  { step: 18, note: 69 },
  { step: 36, note: 77 },
  { step: 38, note: 76 },
  { step: 40, note: 77 },
  { step: 44, note: 81 },
  { step: 48, note: 80 },
  { step: 52, note: 77 },
  { step: 56, note: 74 },
  { step: 60, note: 71 },
];

/** Drum pattern for one bar: velocities 0–1 per step. */
export const DRUMS = {
  kick: { 0: 1, 7: 0.5, 10: 0.85 } as Record<number, number>,
  snare: { 4: 0.8, 12: 0.85, 15: 0.25 } as Record<number, number>,
  hat: { 0: 0.5, 2: 0.6, 3: 0.2, 4: 0.4, 6: 0.6, 8: 0.5, 10: 0.6, 11: 0.2, 12: 0.4, 14: 0.6 } as Record<number, number>,
};

export function midiToFreq(note: number): number {
  return 440 * 2 ** ((note - 69) / 12);
}

/** Length of one 16th note in seconds. */
export function stepDuration(bpm = BPM): number {
  return 60 / bpm / 4;
}

/** When a step starts, relative to the start of its loop, with swing on the off-16ths. */
export function stepOffset(step: number, bpm = BPM, swing = SWING): number {
  const d = stepDuration(bpm);
  return step * d + (step % 2 === 1 ? swing * d : 0);
}

/** Does the melody play on this loop? (Every other loop, starting with the second.) */
export function melodyOn(loop: number): boolean {
  return loop % 2 === 1;
}
