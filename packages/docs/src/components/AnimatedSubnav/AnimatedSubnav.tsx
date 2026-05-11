import * as React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAnimations, useSlidingIndicator, type AnimationTrigger } from 'move';
import styles from './AnimatedSubnav.module.css';

interface SubnavItem {
  to: string;
  label: string;
}

export interface AnimatedSubnavProps {
  items: SubnavItem[];
  /** Whether the parent disclosure is currently open. Drives the
   *  stagger reveal — items animate in on mount (when initially
   *  open) and on every subsequent open transition. */
  open?: boolean;
}

/**
 * Sub-nav panel shown under the active section in AppSidebar. Mirrors the
 * TOC setup (rail + sliding indicator), driven by the current route via
 * NavLink. Enter/exit is handled by the parent Collapsible wrapper; this
 * component layers a stagger reveal on top so items don't all appear at
 * once when the section opens — same pattern Accordion.Content uses.
 */
export function AnimatedSubnav({ items, open = true }: AnimatedSubnavProps) {
  const containerRef = React.useRef<HTMLElement>(null);
  const { pathname } = useLocation();

  const { indicatorRef, update } = useSlidingIndicator({
    containerRef,
    activeSelector: '[data-active]',
    track: 'height',
  });

  // Re-measure on pathname change — MutationObserver only watches data-state
  // mutations, so attribute changes from React re-renders need a manual nudge.
  React.useEffect(() => {
    update();
  }, [pathname, update]);

  // Stagger reveal — fires on mount (if initially open) and on every
  // subsequent open transition. Items fade + slide up sequentially,
  // starting after a small delay so the parent's height-morph has
  // already begun (matches the Accordion content reveal feel).
  const staggerStep = React.useMemo(
    () => ({
      target: 'Container' as const,
      children: 'a',
      stagger: { delay: 30 },
      animation: {
        opacity: { from: 0, to: 1, ease: 'outQuart', duration: 240, delay: 80 },
        translateY: { from: 6, to: 0, ease: 'outQuart', duration: 240, delay: 80 },
      },
    }),
    [],
  );

  const triggers: AnimationTrigger[] = React.useMemo(
    () => [
      // Lifecycle — runs once when AnimatedSubnav mounts. Only
      // animates if the section starts open.
      {
        trigger: 'Container.enter',
        sequence: open ? [staggerStep] : false,
      },
      // Deps — re-fires whenever `open` changes. Animates only on
      // open=true transitions; open=false runs nothing.
      {
        trigger: 'reveal-on-open',
        deps: [open],
        sequence: open ? [staggerStep] : false,
      },
    ],
    [open, staggerStep],
  );

  const animationRefs = React.useMemo(
    () => ({ Container: containerRef as React.RefObject<HTMLElement | null> }),
    [],
  );

  useAnimations(triggers, animationRefs);

  return (
    <nav ref={containerRef} className={styles.root} aria-label="Section navigation">
      <div ref={indicatorRef} aria-hidden="true" className={styles.indicator} />
      {items.map((item) => {
        // Exact match only — matches NavLink's `end` behaviour. Prefix
        // matching would make an overview item like `/components` stay
        // active while on `/components/select`, and the indicator would
        // snap to the wrong row.
        const active = pathname === item.to;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end
            data-active={active ? '' : undefined}
            className={styles.item}
          >
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
}
