import { describe, expect, it } from 'vitest';
import {
  BARS,
  BARS_DATA,
  DRUMS,
  LOOP_STEPS,
  MELODY,
  STEPS_PER_BAR,
  melodyOn,
  midiToFreq,
  stepDuration,
  stepOffset,
} from '@/lib/music';

describe('music', () => {
  it('converts MIDI notes to frequencies', () => {
    expect(midiToFreq(69)).toBe(440);
    expect(midiToFreq(57)).toBeCloseTo(220);
    expect(midiToFreq(60)).toBeCloseTo(261.63, 1);
  });

  it('has one bar of data per bar in the loop', () => {
    expect(BARS_DATA).toHaveLength(BARS);
    expect(LOOP_STEPS).toBe(BARS * STEPS_PER_BAR);
  });

  it('keeps every note on a valid step', () => {
    for (const bar of BARS_DATA) {
      for (const hit of bar.bass) {
        expect(hit.step).toBeGreaterThanOrEqual(0);
        expect(hit.step).toBeLessThan(STEPS_PER_BAR);
      }
      expect(bar.chord.length).toBeGreaterThan(2);
    }
    for (const hit of MELODY) expect(hit.step).toBeLessThan(LOOP_STEPS);
    for (const pattern of Object.values(DRUMS)) {
      for (const step of Object.keys(pattern)) expect(Number(step)).toBeLessThan(STEPS_PER_BAR);
    }
  });

  it('swings the off-beat sixteenths only', () => {
    const d = stepDuration(60);
    expect(d).toBeCloseTo(0.25);
    expect(stepOffset(2, 60, 0.25)).toBeCloseTo(0.5);
    expect(stepOffset(3, 60, 0.25)).toBeCloseTo(0.75 + 0.0625);
    expect(stepOffset(3, 60, 0)).toBeCloseTo(0.75);
  });

  it('brings the melody in on every other loop', () => {
    expect([0, 1, 2, 3].map(melodyOn)).toEqual([false, true, false, true]);
  });
});
