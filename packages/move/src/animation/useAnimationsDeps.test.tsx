import { render, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import * as React from 'react';
import { useAnimations } from './useAnimations';
import type { AnimationTrigger } from './types';

/**
 * A deps trigger fires when its deps change — including the change that brings
 * the trigger into existence.
 *
 * Components build these as `useMemo(() => ready ? [trigger] : null)`, so the
 * config is null until some state flips and the trigger's FIRST sighting IS the
 * flip. Recorded as a baseline it never fired, and anything hanging off
 * `onComplete` never happened. FileUpload's `removeOnComplete` was the case that
 * surfaced it: the finished row stayed on screen forever, while
 * `prefers-reduced-motion` — which removes the file without animating — worked,
 * so one prop behaved differently on the two branches.
 */
function Harness({ ready, onComplete }: { ready: boolean; onComplete: () => void }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const config: AnimationTrigger[] | null = React.useMemo(
    () =>
      ready
        ? [
            {
              trigger: 'item-exit',
              deps: [ready],
              sequence: [{ target: 'Item', animation: { opacity: { from: 1, to: 0 } } }],
              onComplete,
            },
          ]
        : null,
    [ready, onComplete],
  );
  const refs = React.useMemo(() => ({ Item: ref as React.RefObject<HTMLElement | null> }), []);
  useAnimations(config, refs);
  return <div ref={ref}>row</div>;
}

describe('useAnimations — deps triggers', () => {
  it('fires a trigger that appears after mount', async () => {
    const onComplete = vi.fn();
    const { rerender } = render(<Harness ready={false} onComplete={onComplete} />);
    expect(onComplete).not.toHaveBeenCalled();

    // The config arrives now. Its first sighting is the change it waits for.
    await act(async () => {
      rerender(<Harness ready onComplete={onComplete} />);
    });
    // executeSequence settles through a fallback timer in jsdom, where no frames
    // are produced, so give it longer than the real animation would need.
    await act(async () => {
      await new Promise((r) => setTimeout(r, 1300));
    });

    expect(onComplete).toHaveBeenCalled();
  });

  it('does not fire a trigger that was present at mount', async () => {
    // At mount the deps are a starting point, not a change — the enter
    // lifecycle owns that moment.
    const onComplete = vi.fn();
    await act(async () => {
      render(<Harness ready onComplete={onComplete} />);
    });
    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    expect(onComplete).not.toHaveBeenCalled();
  });
});
