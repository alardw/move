import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import styles from './StagedOverlay.module.css';

const noop = () => {};
const block = (event: Event) => event.preventDefault();

export interface StagedOverlayApi {
  /** The stage element — pass as the portal's `container`. */
  container: HTMLElement;
  /** Spread onto the overlay Root: forces it open, non-modal, and unclosable. */
  root: { open: boolean; modal: boolean; onOpenChange: (open: boolean) => void };
  /**
   * Spread onto the overlay Content: ignore every dismiss path. A non-modal
   * overlay otherwise listens for interaction anywhere on the page and tries to
   * close (a flash) the moment you click — these stop that, and block the
   * open-autofocus so it can't steal focus.
   */
  content: {
    onInteractOutside: (event: Event) => void;
    onEscapeKeyDown: (event: Event) => void;
    onPointerDownOutside: (event: Event) => void;
    onOpenAutoFocus: (event: Event) => void;
  };
  /** Spread onto the overlay Portal: scopes it into the stage. */
  portal: { container: HTMLElement };
}

/**
 * Stages a portalled overlay (Dialog, Popover, Drawer, Dropdown) OPEN inside a
 * contained, inert box — the generic mechanism behind overlay preview cards.
 *
 * It does three things no plain container can, all preview-only (no component
 * is modified — it relies on props the overlays already expose):
 *
 *  - establishes a containing block (`transform`) so the overlay's
 *    `position: fixed` parts resolve against this box, not the viewport;
 *  - hands its element to the render-prop as the portal `container`;
 *  - renders the box `inert` + `pointer-events: none`, so the open overlay is
 *    a dead snapshot: it can't steal focus, capture clicks, or block the card
 *    link wrapping it.
 *
 * The `root` props (`open`, `modal: false`, no-op `onOpenChange`) keep it open
 * without scroll-lock or focus-trap and stop it closing on stray interaction.
 */
export function StagedOverlay({
  minHeight = 240,
  align = 'center',
  children,
}: {
  minHeight?: number;
  /**
   * Vertical placement of the staged content. Default `center`. Use `start`
   * for overlays whose body opens downward from the trigger (Dropdown/Select)
   * so the menu has room within the card's clipped preview area.
   */
  align?: 'center' | 'start';
  children: (api: StagedOverlayApi) => ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [container, setContainer] = useState<HTMLElement | null>(null);

  // Set `inert` on the element once after mount — it's the real
  // non-interactivity guard (disables focus + clicks for the whole subtree,
  // overriding Radix's pointer-events:auto on content). Done in an effect
  // (not an inline ref callback, which would churn the container every render).
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.inert = true;
    setContainer(el);
  }, []);

  return (
    <div
      ref={ref}
      className={styles.stage}
      style={align === 'start' ? { minHeight, alignItems: 'start', paddingTop: 20 } : { minHeight }}
    >
      {container &&
        children({
          container,
          root: { open: true, modal: false, onOpenChange: noop },
          content: {
            onInteractOutside: block,
            onEscapeKeyDown: block,
            onPointerDownOutside: block,
            onOpenAutoFocus: block,
          },
          portal: { container },
        })}
    </div>
  );
}
