'use client';
import * as React from 'react';

/**
 * A drop target for files coming from OUTSIDE the browser.
 *
 * The sibling of `useDropTarget`, and deliberately not built on it. That one
 * moves something already in the page, through a registry and pointer events,
 * because HTML5 drag has no touch support and no control over its own preview.
 * This one receives files from the desktop, which the browser only ever hands
 * over through the native `drop` event's `DataTransfer` — pointer events cannot
 * see them, so there is no version of this that shares the mechanism.
 *
 * What the two DO share is everything the reader experiences: the same three
 * states on the same attributes, so a drop target looks and sounds the same
 * whether the payload came from the page or the desktop.
 *
 * No `data-drag-active` here. Native drag tells a zone when something is over
 * IT, and nothing about a drag happening elsewhere on the page — so the zone
 * cannot honestly claim to know, and says only what it does know.
 */
export interface UseFileDropTargetOptions {
  /** Accepted types, as the `accept` attribute spells them (`image/*`, `.pdf`). */
  accept?: string[];
  disabled?: boolean;
  /** Called with the dropped files once they land. */
  onDrop?: (files: File[]) => void;
  /** What the live region says when files land, or when a refusal happens. */
  announce?: (count: number, accepted: boolean) => string;
}

export interface UseFileDropTargetReturn {
  /** Spread onto the element that should receive drops. */
  handlers: {
    onDragEnter: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
  };
  /** Something is being dragged over this zone right now. */
  isOver: boolean;
  /** This zone would take what is over it. */
  canDrop: boolean;
  /** Text for the live region. Empty between announcements. */
  message: string;
}

/** Does a DataTransferItem's type satisfy one `accept` entry? */
function typeMatches(type: string, pattern: string): boolean {
  const p = pattern.trim().toLowerCase();
  const t = type.toLowerCase();
  if (!p) return true;
  // `.pdf` — extension rules cannot be checked during a drag: the browser
  // exposes only the MIME type until the drop, so an extension entry can only
  // be honoured afterwards. Treated as a match here rather than a refusal,
  // because refusing something that would have been accepted is the worse half.
  if (p.startsWith('.')) return true;
  if (p.endsWith('/*')) return t.startsWith(p.slice(0, -1));
  return t === p;
}

export function useFileDropTarget({
  accept,
  disabled = false,
  onDrop,
  announce,
}: UseFileDropTargetOptions = {}): UseFileDropTargetReturn {
  const [isOver, setIsOver] = React.useState(false);
  const [canDrop, setCanDrop] = React.useState(true);
  const [message, setMessage] = React.useState('');

  // dragenter/dragleave fire for every child element the pointer crosses, so a
  // boolean flickers off the moment the pointer moves onto a child of the zone.
  // Counting entries against leaves is what makes the state survive the trip.
  const depth = React.useRef(0);

  const acceptsAll = !accept || accept.length === 0;
  const acceptKey = (accept ?? []).join(',');

  const handlers = React.useMemo(
    () => ({
      onDragEnter(e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) return;
        depth.current += 1;
        if (depth.current !== 1) return;

        setIsOver(true);
        const items = Array.from(e.dataTransfer.items).filter((i) => i.kind === 'file');
        const list = acceptKey ? acceptKey.split(',') : [];
        const ok = acceptsAll || items.every((i) => list.some((p) => typeMatches(i.type, p)));
        setCanDrop(ok);
      },

      onDragOver(e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) return;
        // The cursor is the signal nobody has to learn — but it cannot be the
        // only one, because a touch user has no cursor, which is why the zone
        // also changes shape and announces.
        e.dataTransfer.dropEffect = canDrop ? 'copy' : 'none';
      },

      onDragLeave(e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        depth.current -= 1;
        if (depth.current > 0) return;
        depth.current = 0;
        setIsOver(false);
        setCanDrop(true);
      },

      onDrop(e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        depth.current = 0;
        const accepted = canDrop;
        setIsOver(false);
        setCanDrop(true);
        if (disabled) return;

        const files = Array.from(e.dataTransfer.files);
        if (announce) setMessage(announce(files.length, accepted));
        if (accepted) onDrop?.(files);
      },
    }),
    [disabled, canDrop, acceptsAll, acceptKey, onDrop, announce],
  );

  return { handlers, isOver, canDrop, message };
}
