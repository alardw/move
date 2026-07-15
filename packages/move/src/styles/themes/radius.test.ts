import { describe, it, expect } from 'vitest';
import { radiusScale } from './radius';

describe('radiusScale', () => {
  it('factor 1 (default md) reproduces the current scale', () => {
    const r = radiusScale('md');
    expect(r['--move-rounded-sm']).toBe('0.25rem');
    expect(r['--move-rounded-md']).toBe('0.5rem');
    expect(r['--move-rounded-lg']).toBe('0.75rem');
    expect(r['--move-rounded-xl']).toBe('1rem');
  });

  it('none is sharp everywhere; full stays a pill', () => {
    const r = radiusScale('none');
    expect(r['--move-rounded-sm']).toBe('0');
    expect(r['--move-rounded-xl']).toBe('0');
    expect(r['--move-rounded-none']).toBe('0');
    expect(r['--move-rounded-full']).toBe('9999px');
  });

  it('a numeric factor scales sm→xl proportionally, pinning none/full', () => {
    const r = radiusScale(2);
    expect(r['--move-rounded-sm']).toBe('0.5rem');
    expect(r['--move-rounded-md']).toBe('1rem');
    expect(r['--move-rounded-xl']).toBe('2rem');
    expect(r['--move-rounded-none']).toBe('0');
    expect(r['--move-rounded-full']).toBe('9999px');
  });

  it('defaults to md and clamps negatives to 0', () => {
    expect(radiusScale()['--move-rounded-md']).toBe('0.5rem');
    expect(radiusScale(-3)['--move-rounded-md']).toBe('0');
  });
});
