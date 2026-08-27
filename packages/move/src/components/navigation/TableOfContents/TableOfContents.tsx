'use client';

import * as React from 'react';
import { withMoveComponent } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import { usePositionTracker } from '../../../animation';
import styles from './TableOfContents.module.css';

// =============================================================================
// Context
// =============================================================================

interface TocContextValue {
  activeHref: string | null;
  register: (href: string) => () => void;
  /** Set the active href immediately and suspend scroll-spy briefly while
   * a click-initiated smooth scroll is in flight. Prevents intermediate
   * sections from flickering as "active" on the way to the target. */
  lockActive: (href: string) => void;
}

const TableOfContentsContext = React.createContext<TocContextValue | null>(null);

function useTocContext() {
  const ctx = React.useContext(TableOfContentsContext);
  if (!ctx) {
    throw new Error('TableOfContents.Item must be used within TableOfContents.Root');
  }
  return ctx;
}

// =============================================================================
// Root
// =============================================================================

export interface TableOfContentsLabels {
  /** Accessible label for the navigation landmark. */
  label: string;
}

const DEFAULT_LABELS: TableOfContentsLabels = {
  label: 'On this page',
};

export interface TableOfContentsRootProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  /** Offset in pixels from the top of the viewport used when determining
   * which heading is "current." Default: 80. */
  offset?: number;
  labels?: Partial<TableOfContentsLabels>;
  sp?: SlotPropsMap<'root'>;
}

const TableOfContentsRoot = withMoveComponent<
  'root' | 'indicator',
  TableOfContentsRootProps,
  HTMLElement
>({
  name: 'TableOfContentsRoot',
  styles,
  slots: ['root', 'indicator'] as const,
  defaults: { offset: 80 },
  moveProps: ['offset', 'labels'],

  setup({ props, ref, internalRef, cx, sp, attrs }) {
    const labels = { ...DEFAULT_LABELS, ...(props.labels as Partial<TableOfContentsLabels>) };
    const offset = (props.offset as number) ?? 80;
    const [activeHref, setActiveHref] = React.useState<string | null>(null);
    const hrefsRef = React.useRef<Set<string>>(new Set());
    const [registrationVersion, setRegistrationVersion] = React.useState(0);
    const lockRef = React.useRef<string | null>(null);
    const lockTimerRef = React.useRef<number | null>(null);

    const register = React.useCallback((href: string) => {
      hrefsRef.current.add(href);
      setRegistrationVersion((v) => v + 1);
      return () => {
        hrefsRef.current.delete(href);
        setRegistrationVersion((v) => v + 1);
      };
    }, []);

    // Reschedule the unlock — called on click (initial lock) and on every
    // scroll event while locked. The lock releases only after scrolling has
    // been quiet for `SCROLL_END_MS`, adapting to the actual smooth-scroll
    // duration regardless of jump distance.
    const SCROLL_END_MS = 150;
    const scheduleUnlock = React.useCallback(() => {
      if (lockTimerRef.current != null) window.clearTimeout(lockTimerRef.current);
      lockTimerRef.current = window.setTimeout(() => {
        lockRef.current = null;
      }, SCROLL_END_MS);
    }, []);

    const lockActive = React.useCallback(
      (href: string) => {
        lockRef.current = href;
        setActiveHref(href);
        scheduleUnlock();
      },
      [scheduleUnlock],
    );

    // Scroll-spy: the active heading is the last one whose top has crossed
    // the offset line from below (i.e. the most recently scrolled-past
    // heading). Uses a scroll listener with `capture: true` so it catches
    // scroll from nested containers too (e.g. ScrollArea.Content in docs).
    React.useEffect(() => {
      if (typeof window === 'undefined') return;

      const computeActive = () => {
        // Suppressed while a click-initiated smooth-scroll is animating —
        // avoids the "all intermediate sections light up on the way" effect.
        // Each scroll event during a locked window reschedules the unlock,
        // so the lock naturally releases once scrolling settles.
        if (lockRef.current) {
          scheduleUnlock();
          return;
        }
        const hrefs = Array.from(hrefsRef.current);
        if (hrefs.length === 0) return;
        let next: string | null = null;
        for (const href of hrefs) {
          const id = href.startsWith('#') ? href.slice(1) : href;
          const el = document.getElementById(id);
          if (!el) continue;
          const top = el.getBoundingClientRect().top;
          if (top <= offset) next = href;
        }
        // If nothing has scrolled past yet, default to the first registered href.
        if (!next && hrefs[0]) next = hrefs[0];
        setActiveHref(next);
      };

      computeActive();
      window.addEventListener('scroll', computeActive, { passive: true, capture: true });
      window.addEventListener('resize', computeActive);

      return () => {
        window.removeEventListener('scroll', computeActive, {
          capture: true,
        } as EventListenerOptions);
        window.removeEventListener('resize', computeActive);
      };
    }, [registrationVersion, offset, scheduleUnlock]);

    const ctx = React.useMemo<TocContextValue>(
      () => ({ activeHref, register, lockActive }),
      [activeHref, register, lockActive],
    );

    // Sliding indicator — single shared element that physically moves to the
    // active item (same engine Tabs + ToggleGroup use). Tracks height so the
    // indicator resizes for wrapped multi-line labels.
    const { indicatorRef, update } = usePositionTracker({
      containerRef: internalRef as React.RefObject<HTMLElement | null>,
      activeSelector: '[data-active]',
      track: 'height',
    });

    // Re-position whenever activeHref changes.
    React.useEffect(() => {
      update();
    }, [activeHref, update]);

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;
        const indicatorSp = sp('indicator');
        const {
          className: indClass,
          style: indStyle,
          ...indRest
        } = indicatorSp as Record<string, unknown>;
        return (
          <TableOfContentsContext.Provider value={ctx}>
            <nav
              aria-label={labels.label}
              {...attrs}
              {...spRest}
              ref={ref as React.Ref<HTMLElement>}
              className={cx('root', props.className, spClass as string | undefined)}
              style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            >
              {props.children}
              <div
                {...indRest}
                ref={indicatorRef}
                aria-hidden="true"
                className={cx('indicator', indClass as string | undefined)}
                style={indStyle as React.CSSProperties}
              />
            </nav>
          </TableOfContentsContext.Provider>
        );
      },
    };
  },
});

// =============================================================================
// Item
// =============================================================================

export interface TableOfContentsItemProps extends React.HTMLAttributes<HTMLElement> {
  href: string;
  children?: React.ReactNode;
  /** Nesting level — 1 (default, no indent), 2, 3, 4. */
  depth?: 1 | 2 | 3 | 4;
  className?: string;
  style?: React.CSSProperties;
  sp?: SlotPropsMap<'item'>;
}

const TableOfContentsItem = withMoveComponent<'item', TableOfContentsItemProps, HTMLAnchorElement>({
  name: 'TableOfContentsItem',
  styles,
  slots: ['item'] as const,
  defaults: { depth: 1 },
  moveProps: ['href', 'depth'],

  setup({ props, ref, cx, sp, attrs }) {
    const { activeHref, register, lockActive } = useTocContext();
    const href = props.href as string;

    React.useEffect(() => register(href), [register, href]);

    const isActive = activeHref === href;

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (!href.startsWith('#')) return;
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      // Active state updates instantly; scroll-spy is suppressed while the
      // smooth-scroll runs so intermediate sections don't flicker as active.
      lockActive(href);

      // Find nearest scrollable ancestor (e.g. ScrollArea.Content).
      let scrollParent: HTMLElement | null = target.parentElement;
      while (scrollParent) {
        const style = getComputedStyle(scrollParent);
        if (style.overflowY === 'auto' || style.overflowY === 'scroll') break;
        scrollParent = scrollParent.parentElement;
      }

      // If the target is near the very top of the scroll container (i.e.
      // the first anchor, sitting inside padding), scroll all the way to 0
      // so the padding above it becomes visible. Otherwise align normally.
      const TOP_THRESHOLD_PX = 120;
      if (scrollParent) {
        const targetTop =
          target.getBoundingClientRect().top -
          scrollParent.getBoundingClientRect().top +
          scrollParent.scrollTop;
        if (targetTop <= TOP_THRESHOLD_PX) {
          scrollParent.scrollTo({ top: 0, behavior: 'smooth' });
          history.replaceState(null, '', href);
          return;
        }
      }

      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', href);
    };

    return {
      render() {
        const itemSp = sp('item');
        const { className: spClass, style: spStyle, ...spRest } = itemSp as Record<string, unknown>;
        return (
          <a
            {...attrs}
            {...spRest}
            ref={ref}
            href={href}
            onClick={handleClick}
            data-depth={props.depth}
            data-active={isActive ? '' : undefined}
            aria-current={isActive ? 'location' : undefined}
            className={cx('item', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </a>
        );
      },
    };
  },
});

// =============================================================================
// Export
// =============================================================================

export const TableOfContents = {
  Root: TableOfContentsRoot,
  Item: TableOfContentsItem,
};
