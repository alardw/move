import { render, cleanup } from '@testing-library/react';
import { afterEach, describe, it, expect } from 'vitest';
import { DatePicker } from './DatePicker';

// Real-browser invariant: a popup must reopen after it closes. The exit
// animation runs through anime.js with real RAF timing here — jsdom resolves
// runExit() instantly and so CANNOT catch "opens once, then nothing happens"
// (a stalled exit leaving isClosing stuck true). This is where that class of
// bug is actually catchable.

afterEach(cleanup);

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
async function waitFor(fn: () => boolean, timeout = 2500): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (fn()) return true;
    await sleep(40);
  }
  return fn();
}

const gridPresent = () => !!document.querySelector('[role="grid"]');
const openButton = () =>
  [...document.querySelectorAll('button')].find(
    (b) => b.getAttribute('aria-label') === 'Open calendar',
  ) as HTMLElement | undefined;

function DP() {
  return (
    <DatePicker.Root>
      <DatePicker.Trigger>
        <DatePicker.Input />
      </DatePicker.Trigger>
      <DatePicker.Content>
        <div role="grid">
          <div role="gridcell">1</div>
          <div role="gridcell">2</div>
          <div role="gridcell">3</div>
        </div>
      </DatePicker.Content>
    </DatePicker.Root>
  );
}

describe('DatePicker — open/close/reopen (real browser)', () => {
  it('INVARIANT: reopens after closing — a stalled exit must not lock the trigger', async () => {
    render(<DP />);
    const btn = openButton();
    expect(btn).toBeTruthy();

    // 1. Opens on first click
    btn!.click();
    expect(await waitFor(gridPresent)).toBe(true);

    // 2. Closes on Escape (runs the real exit animation)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(await waitFor(() => !gridPresent())).toBe(true);

    // 3. REOPENS — the regression was "works once, then nothing happens"
    //    (isClosing stuck true because the exit animation's promise never
    //    resolved, blocking openPopover's `!isOpen && !isClosing` guard).
    btn!.click();
    expect(await waitFor(gridPresent)).toBe(true);
  });

  it('INVARIANT: reopening MID-CLOSE wins — rapid open/close does not skip', async () => {
    render(<DP />);
    const btn = openButton();
    expect(btn).toBeTruthy();

    btn!.click();
    expect(await waitFor(gridPresent)).toBe(true);

    // Start closing, then reopen WHILE the exit animation is still playing.
    // The open must cancel the close — the popup ends open, not closed.
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await sleep(30); // mid-exit
    btn!.click();

    // Give the (cancelled) exit + any deferred close ample time to (not) fire.
    await sleep(500);
    expect(gridPresent()).toBe(true);
  });
});
