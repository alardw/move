import { render, cleanup } from '@testing-library/react';
import { afterEach, describe, it, expect } from 'vitest';
import { ToggleGroup } from './ToggleGroup';

// Real-browser invariant for the sliding indicator (usePositionTracker). jsdom
// can't position it (no layout), so this is where the "indicator comes from the
// origin / wrong spot" class of bug is actually catchable.

afterEach(cleanup);

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const rect = (el: Element) => el.getBoundingClientRect();

function Group({ value }: { value: string }) {
  return (
    <ToggleGroup.Root value={value} style={{ width: '360px' }}>
      <ToggleGroup.Item value="a">Alpha</ToggleGroup.Item>
      <ToggleGroup.Item value="b">Beta</ToggleGroup.Item>
      <ToggleGroup.Item value="c">Gamma</ToggleGroup.Item>
    </ToggleGroup.Root>
  );
}

describe('ToggleGroup — sliding indicator invariants (real browser)', () => {
  it('INVARIANT: the indicator sits under the active item, not at the origin', async () => {
    const { container } = render(<Group value="b" />);
    const root = container.firstElementChild!;
    await sleep(400); // let the indicator settle under the active item

    const indicator = root.querySelector('[class*="indicator"]')!;
    const active = root.querySelector('[data-state="on"]')!;
    const firstItem = root.querySelector('button')!; // item "a"

    const ind = rect(indicator);
    const act = rect(active);

    // Aligned with the ACTIVE item (b) — width + left within a few px.
    expect(Math.abs(ind.left - act.left)).toBeLessThanOrEqual(3);
    expect(Math.abs(ind.width - act.width)).toBeLessThanOrEqual(3);
    // NOT parked at the first item (a) — the "comes from the origin" bug.
    expect(ind.left).toBeGreaterThan(rect(firstItem).left + 5);
  });

  it('INVARIANT: the indicator follows when the active item changes', async () => {
    const { rerender, container } = render(<Group value="a" />);
    const root = container.firstElementChild!;
    await sleep(400);
    const atA = rect(root.querySelector('[class*="indicator"]')!).left;

    rerender(<Group value="c" />);
    await sleep(400);
    const atC = rect(root.querySelector('[class*="indicator"]')!).left;
    const itemC = rect([...root.querySelectorAll('button')][2]);

    expect(atC).toBeGreaterThan(atA);                 // moved right toward c
    expect(Math.abs(atC - itemC.left)).toBeLessThanOrEqual(3); // landed under c
  });
});
