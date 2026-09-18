import * as React from 'react';
import { measureTruncated } from '../../../hooks';
import { Tooltip } from './Tooltip';

export interface TruncationTooltip {
  /** Attach to the text element (merge with any forwarded ref). */
  ref: React.RefObject<HTMLElement | null>;
  /** Wraps the element in a Move Tooltip when enabled; returns it unchanged otherwise. */
  wrap: (element: React.ReactElement) => React.ReactElement;
}

/**
 * The full string back on hover, and only when it is actually cut off.
 *
 * MEASURED WHEN SOMEONE REACHES FOR IT, not continuously. Reading `scrollWidth`
 * forces the browser to lay the page out, so holding "is this truncated" as
 * state means every truncated element on the page pays that on every render,
 * plus a `ResizeObserver` each to keep it true. A table of four hundred trimmed
 * cells makes that a visible cost — and it buys an answer nobody is asking for,
 * because the answer only matters at the instant a pointer arrives.
 *
 * So the question is asked then. Radix reports the hover or focus through
 * `onOpenChange`, the element is measured once on the spot, and a tooltip opens
 * only if there is something hidden to show. At rest this costs nothing at all,
 * and a box that has since been resized gets a fresh reading on the next hover
 * rather than a remembered one.
 */
export function useTruncationTooltip(enabled: boolean, label?: React.ReactNode): TruncationTooltip {
  const ref = React.useRef<HTMLElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const [cutOff, setCutOff] = React.useState(false);

  const onOpenChange = React.useCallback((next: boolean) => {
    // Only on the way in: measuring on the way out would be reading the page
    // to decide something that is closing anyway.
    if (next) setCutOff(ref.current ? measureTruncated(ref.current) : false);
    setOpen(next);
  }, []);

  const wrap = (element: React.ReactElement) =>
    enabled ? (
      <Tooltip label={label} open={open && cutOff} onOpenChange={onOpenChange}>
        {element}
      </Tooltip>
    ) : (
      element
    );
  return { ref, wrap };
}
