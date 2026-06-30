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
          {/* A full grid's worth of cells so the stagger is long enough to
              still be mid-flight when we interrupt it. */}
          {Array.from({ length: 28 }, (_, i) => (
            <div key={i} role="gridcell">
              {i + 1}
            </div>
          ))}
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

    // …and the gridcells must NOT be left frozen half-faded mid-stagger — the
    // close-cancel must re-run the enter so every cell ends fully visible.
    const cells = [...document.querySelectorAll('[role="gridcell"]')];
    expect(cells.length).toBe(28);
    const allVisible = await waitFor(() =>
      cells.every((c) => Number(getComputedStyle(c).opacity) > 0.9),
    );
    expect(allVisible).toBe(true);
  });

  it('INVARIANT: a sibling calendar opens on the FIRST click after another closed', async () => {
    render(
      <>
        <DP />
        <DP />
      </>,
    );
    const btns = [...document.querySelectorAll('button')].filter(
      (b) => b.getAttribute('aria-label') === 'Open calendar',
    );
    expect(btns.length).toBe(2);

    // Open #1, then close it fully (Escape — not by clicking #2).
    btns[0].click();
    expect(await waitFor(gridPresent)).toBe(true);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(await waitFor(() => !gridPresent())).toBe(true);

    // A single click on #2 must open it (no "needs 2 clicks" sibling lockout).
    btns[1].click();
    expect(await waitFor(gridPresent)).toBe(true);
  });

  it('INVARIANT: closes after selecting a date (close-on-select not cancelled)', async () => {
    render(
      <DatePicker.Root defaultValue={new Date(2026, 5, 15)}>
        <DatePicker.Trigger>
          <DatePicker.Input />
        </DatePicker.Trigger>
        <DatePicker.Content />
      </DatePicker.Root>,
    );
    // Focus the input first (real flow — clicking a day then blurs it).
    (document.querySelector('input') as HTMLElement)?.focus();
    const btn = openButton();
    expect(btn).toBeTruthy();
    btn!.click();
    expect(await waitFor(gridPresent)).toBe(true);

    // Selecting a day must actually close — a spurious open() fired during the
    // deliberate close-on-select must NOT cancel it.
    const day = [...document.querySelectorAll('button[role="gridcell"]')].find(
      (b) => b.textContent?.trim() === '20' && !(b as HTMLButtonElement).disabled,
    ) as HTMLElement | undefined;
    expect(day).toBeTruthy();
    day!.click();

    expect(await waitFor(() => !gridPresent(), 2000)).toBe(true);
  });
});
