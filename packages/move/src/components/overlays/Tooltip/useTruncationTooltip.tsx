import * as React from 'react';
import { useTruncate } from '../../../hooks';
import { Tooltip } from './Tooltip';

export interface TruncationTooltip {
  /** Attach to the text element (merge with any forwarded ref). */
  ref: React.RefObject<HTMLElement>;
  /** Wraps the element in a Move Tooltip when enabled; returns it unchanged otherwise. */
  wrap: (element: React.ReactElement) => React.ReactElement;
}

/**
 * The "tooltip only when actually cut off" pattern for text primitives. Measures
 * the referenced element via `useTruncate` and, when `enabled`, wraps it in a
 * Move `Tooltip` that opens on hover ONLY while the text is truncated — gated on
 * `isTruncated`, so the element never re-parents. Attach `ref` to the text
 * element and wrap it with `wrap()`.
 */
export function useTruncationTooltip(enabled: boolean, label?: React.ReactNode): TruncationTooltip {
  const { ref, isTruncated } = useTruncate<HTMLElement>({ enabled });
  const [open, setOpen] = React.useState(false);
  const wrap = (element: React.ReactElement) =>
    enabled ? (
      <Tooltip label={label} open={open && isTruncated} onOpenChange={setOpen}>
        {element}
      </Tooltip>
    ) : (
      element
    );
  return { ref, wrap };
}
