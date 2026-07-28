'use client';
// Generated from Splitter.spec.ts
import * as React from 'react';
import type { Dimension } from '../../../shared/types';
import { withMoveComponent, useMergedRef } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import styles from './Splitter.module.css';

// ============================================================================
// Context
// ============================================================================

interface SplitterContextValue {
  layout: 'horizontal' | 'vertical';
  effectiveLayout: 'horizontal' | 'vertical';
  isCollapsed: boolean;
  panelSizes: number[];
  setPanelSize: (index: number, size: number) => void;
  registerPanel: (index: number, config: PanelConfig) => void;
  /** Measured length of the Root along its axis, for resolving Dimensions to %. */
  containerPx: number;
  /** Per-panel resolved config — the gutter reads each neighbour's minimum. */
  panelConfigRef: React.RefObject<PanelConfig[]>;
  gutterSize: number;
}

const SplitterContext = React.createContext<SplitterContextValue | null>(null);

function useSplitterContext() {
  const ctx = React.useContext(SplitterContext);
  if (!ctx) {
    throw new Error('Splitter.Panel must be used within Splitter.Root');
  }
  return ctx;
}

/**
 * Resolve a `Dimension` to a percentage of the Splitter's own length.
 *
 * The panel model is percentage-based (drag math, keyboard steps, and the
 * rendered `width`/`height` are all %), so a pixel or `rem` input has to be
 * converted once against the measured container. A `%` string passes through.
 * Other CSS units are measured with a probe inside the Root, so `em` and `rem`
 * resolve against the real inherited font size rather than the document's.
 */
function toPercent(
  value: Dimension | undefined,
  containerPx: number,
  axis: 'width' | 'height',
  host: HTMLElement | null,
): number | undefined {
  if (value == null) return undefined;
  // A percentage is already in the model's own unit — resolve it before anything
  // needs a measurement, so it holds on the first render too (and under jsdom,
  // where getBoundingClientRect is always 0).
  if (typeof value === 'string' && value.trim().endsWith('%')) return parseFloat(value);
  if (containerPx <= 0) return undefined;
  if (typeof value === 'number') return (value / containerPx) * 100;
  const trimmed = value.trim();
  if (!host || typeof document === 'undefined') return undefined;
  const probe = document.createElement('div');
  probe.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;${axis}:${trimmed}`;
  host.appendChild(probe);
  const px = axis === 'width' ? probe.offsetWidth : probe.offsetHeight;
  probe.remove();
  return (px / containerPx) * 100;
}

/**
 * Split 100% across the panels: each `size` is honoured, and the panels WITHOUT
 * one share whatever is left.
 *
 * Previously an unsized panel took `100 / panelCount` regardless of what its
 * siblings had claimed — so `<Panel size={38} /><Panel />` came to 88% and left
 * 12% of the Splitter empty. The remainder is only knowable here, where every
 * panel's config is visible; a panel can't compute it alone.
 */
function distributeSizes(configs: PanelConfig[]): number[] {
  const present = Array.from(configs, (c) => c).filter(Boolean);
  const claimed = present.reduce((sum, c) => sum + (c.sizePct ?? 0), 0);
  const unsized = present.filter((c) => c.sizePct === undefined).length;
  const share = unsized > 0 ? Math.max(0, 100 - claimed) / unsized : 0;
  return Array.from(configs, (c) => (c ? (c.sizePct ?? share) : 0));
}

interface PanelConfig {
  /** Resolved minimum, as a percentage of the Splitter's length. */
  minPct: number;
  /** Resolved explicit size, or undefined when this panel takes the remainder. */
  sizePct?: number;
}

// ============================================================================
// Root
// ============================================================================

export interface SplitterRootProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  /** Layout direction. Default: 'horizontal' */
  layout?: 'horizontal' | 'vertical';
  /** Size of the gutter/handle in pixels. Default: 4 */
  gutterSize?: number;
  /** Width in pixels below which horizontal layout collapses to vertical. Default: undefined (no collapse) */
  collapseBelow?: number;
  /** Callback when panel sizes change */
  onResizeEnd?: (sizes: number[]) => void;
  /** Where the Root's height comes from. It already fills its parent (100%); set
   *  `'remaining'` when it sits in a flex chain and should take the space left
   *  after siblings. See /systems/layout. */
  fill?: 'remaining';
  sp?: SlotPropsMap<'root'>;
}

const SplitterRoot = withMoveComponent<'root', SplitterRootProps, HTMLDivElement>({
  name: 'SplitterRoot',
  styles,
  slots: ['root'] as const,
  defaults: { layout: 'horizontal', gutterSize: 4 },
  moveProps: ['layout', 'gutterSize', 'collapseBelow', 'onResizeEnd', 'fill'],

  setup({ props, ref, cx, sp, attrs }) {
    const layout = props.layout as 'horizontal' | 'vertical';
    const gutterSize = props.gutterSize as number;
    const collapseBelow = props.collapseBelow as number | undefined;
    const onResizeEnd = props.onResizeEnd as ((sizes: number[]) => void) | undefined;

    const rootRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRef(ref, rootRef);

    // Track collapsed state based on container width
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    React.useLayoutEffect(() => {
      if (!collapseBelow || !rootRef.current) return;

      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const width = entry.contentRect.width;
          setIsCollapsed(width < collapseBelow);
        }
      });

      observer.observe(rootRef.current);
      return () => observer.disconnect();
    }, [collapseBelow]);

    // Effective layout accounts for collapse
    const effectiveLayout = isCollapsed && layout === 'horizontal' ? 'vertical' : layout;

    // Track panel sizes as percentages
    const [panelSizes, setPanelSizes] = React.useState<number[]>([]);
    const panelConfigRef = React.useRef<PanelConfig[]>([]);
    const [containerPx, setContainerPx] = React.useState(0);

    const registerPanel = React.useCallback((index: number, config: PanelConfig) => {
      panelConfigRef.current[index] = config;
      setPanelSizes(() => distributeSizes(panelConfigRef.current));
    }, []);

    const setPanelSize = React.useCallback((index: number, size: number) => {
      setPanelSizes((prev) => {
        const next = [...prev];
        next[index] = size;
        return next;
      });
    }, []);

    // The panel model is percentage-based, so a px/rem `defaultSize` or `minSize`
    // needs the Root's own length to convert against — and it has to stay current,
    // or a resized window would clamp against a stale number.
    React.useLayoutEffect(() => {
      const el = rootRef.current;
      if (!el) return;
      const read = () => {
        const r = el.getBoundingClientRect();
        setContainerPx(effectiveLayout === 'horizontal' ? r.width : r.height);
      };
      read();
      const ro = new ResizeObserver(read);
      ro.observe(el);
      return () => ro.disconnect();
    }, [effectiveLayout]);

    // Notify on resize end
    const handleResizeEnd = React.useCallback(() => {
      onResizeEnd?.(panelSizes);
    }, [onResizeEnd, panelSizes]);

    const contextValue = React.useMemo<SplitterContextValue>(
      () => ({
        layout,
        effectiveLayout,
        isCollapsed,
        panelSizes,
        setPanelSize,
        registerPanel,
        gutterSize,
        containerPx,
        panelConfigRef,
      }),
      [
        layout,
        effectiveLayout,
        isCollapsed,
        panelSizes,
        setPanelSize,
        registerPanel,
        gutterSize,
        containerPx,
      ],
    );

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        // Inject gutters between panels
        const children = React.Children.toArray(props.children);
        const elements: React.ReactNode[] = [];

        children.forEach((child, i) => {
          elements.push(child);
          if (i < children.length - 1) {
            elements.push(
              <SplitterGutter key={`gutter-${i}`} index={i} onResizeEnd={handleResizeEnd} />,
            );
          }
        });

        return (
          <SplitterContext.Provider value={contextValue}>
            <div
              {...attrs}
              {...spRest}
              ref={mergedRef}
              data-layout={effectiveLayout}
              data-fill={props.fill as string | undefined}
              data-collapsed={isCollapsed || undefined}
              className={cx('root', props.className, spClass as string | undefined)}
              style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            >
              {elements}
            </div>
          </SplitterContext.Provider>
        );
      },
    };
  },
});

// ============================================================================
// Gutter (internal)
// ============================================================================

interface SplitterGutterProps {
  index: number;
  onResizeEnd: () => void;
}

const SplitterGutter: React.FC<SplitterGutterProps> = ({ index, onResizeEnd }) => {
  const {
    effectiveLayout: layout,
    isCollapsed,
    panelSizes,
    setPanelSize,
    gutterSize,
    panelConfigRef,
  } = useSplitterContext();
  const gutterRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);

      const startPos = layout === 'horizontal' ? e.clientX : e.clientY;
      const startSizes = [...panelSizes];

      const parentEl = gutterRef.current?.parentElement;
      if (!parentEl) return;

      const parentRect = parentEl.getBoundingClientRect();
      const totalSize = layout === 'horizontal' ? parentRect.width : parentRect.height;

      // Each panel's OWN minimum, not a hardcoded 5. minSize was registered and
      // then never read here, so every panel clamped at 5% whatever it declared —
      // which is why the prop's unit never mattered.
      const minA = panelConfigRef.current?.[index]?.minPct ?? 0;
      const minB = panelConfigRef.current?.[index + 1]?.minPct ?? 0;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const currentPos = layout === 'horizontal' ? moveEvent.clientX : moveEvent.clientY;
        const delta = currentPos - startPos;
        const deltaPercent = (delta / totalSize) * 100;

        // Same clamp as the keyboard path: slide to the stop, conserve the pair.
        const a0 = startSizes[index];
        const b0 = startSizes[index + 1];
        const d = Math.min(Math.max(deltaPercent, minA - a0), b0 - minB);
        setPanelSize(index, a0 + d);
        setPanelSize(index + 1, b0 - d);
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        onResizeEnd();
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [layout, panelSizes, setPanelSize, index, onResizeEnd, panelConfigRef],
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      const step = 2; // Percentage step for keyboard navigation

      // The pair trades a fixed total: whatever one gains the other gives up. The
      // move is refused outright if either would cross its own floor — clamping
      // just one side (the previous behaviour, against a hardcoded 5) let the two
      // sum past 100% and pushed the far panel off the end.
      const minA = panelConfigRef.current?.[index]?.minPct ?? 0;
      const minB = panelConfigRef.current?.[index + 1]?.minPct ?? 0;
      const shift = (delta: number) => {
        const a0 = panelSizes[index];
        const b0 = panelSizes[index + 1];
        // Clamp the DELTA rather than refusing the move, so a keypress or drag
        // slides to the stop instead of sticking short of it. Both panels move by
        // the same amount, so the pair's total is conserved — the old code
        // clamped one side and applied the full step to the other, which could
        // sum past 100%.
        const d = Math.min(Math.max(delta, minA - a0), b0 - minB);
        if (d === 0) return false;
        setPanelSize(index, a0 + d);
        setPanelSize(index + 1, b0 - d);
        return true;
      };

      const back = layout === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
      const forward = layout === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
      let handled = false;
      if (e.key === back) handled = shift(-step);
      else if (e.key === forward) handled = shift(step);
      // Home/End go all the way to whichever floor stops them first — the panel's
      // own minimum, or its neighbour's.
      else if (e.key === 'Home') handled = shift(minA - panelSizes[index]);
      else if (e.key === 'End') handled = shift(panelSizes[index + 1] - minB);

      if (handled) {
        e.preventDefault();
        onResizeEnd();
      }
    },
    [layout, panelSizes, setPanelSize, index, onResizeEnd, panelConfigRef],
  );

  // Hide gutter when collapsed (stacked layout doesn't need resizing)
  if (isCollapsed) {
    return null;
  }

  return (
    <div
      ref={gutterRef}
      role="separator"
      aria-orientation={layout === 'horizontal' ? 'vertical' : 'horizontal'}
      aria-valuenow={Math.round(panelSizes[index] || 50)}
      tabIndex={0}
      data-dragging={isDragging || undefined}
      className={styles.gutter}
      style={{
        [layout === 'horizontal' ? 'width' : 'height']: `${gutterSize}px`,
      }}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
    />
  );
};

// ============================================================================
// Panel
// ============================================================================

export interface SplitterPanelProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  /**
   * Starting size, before the user drags. A number is pixels; a string is any CSS
   * length or percentage. Applies along the Splitter's axis — width when
   * horizontal, height when vertical. Omit it and the panel takes an equal share
   * of whatever its sized siblings leave.
   *
   * Named `defaultSize`, not `size`, because `size` is the scale token
   * ('sm' | 'md' | 'lg') everywhere else in Move — and because it IS a default:
   * the user owns it after the first drag.
   */
  defaultSize?: Dimension;
  /**
   * Smallest the panel can be dragged to. A number is pixels; a string is any CSS
   * length or percentage. Defaults to 44px — the WCAG 2.5.8 enhanced target size,
   * below which a panel can't hold a usable control. Unlike a percentage default,
   * it means the same thing in both orientations and at every window size.
   */
  minSize?: Dimension;
  sp?: SlotPropsMap<'panel'>;
}

const SplitterPanel = withMoveComponent<'panel', SplitterPanelProps, HTMLDivElement>({
  name: 'SplitterPanel',
  styles,
  slots: ['panel'] as const,
  defaults: { minSize: 44 },
  moveProps: ['defaultSize', 'minSize'],

  setup({ props, ref, cx, sp, attrs }) {
    const {
      effectiveLayout: layout,
      isCollapsed,
      panelSizes,
      registerPanel,
      containerPx,
    } = useSplitterContext();
    const indexRef = React.useRef<number>(-1);
    const panelRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRef(ref, panelRef);

    // Determine panel index from DOM position
    React.useLayoutEffect(() => {
      const el = panelRef.current;
      if (!el || !el.parentElement) return;

      const siblings = Array.from(el.parentElement.children).filter((child) =>
        child.classList.contains(styles.panel),
      );
      const idx = siblings.indexOf(el);
      indexRef.current = idx;

      // Resolve this panel's own Dimensions against the measured Root, then
      // register. The Root distributes the remainder across the unsized panels —
      // the only place that total is known.
      const axis = layout === 'horizontal' ? 'width' : 'height';
      registerPanel(idx, {
        minPct: toPercent(props.minSize as Dimension, containerPx, axis, el) ?? 0,
        sizePct: toPercent(props.defaultSize as Dimension | undefined, containerPx, axis, el),
      });
    }, [registerPanel, props.defaultSize, props.minSize, containerPx, layout]);

    const currentSize = panelSizes[indexRef.current];

    return {
      render() {
        const panelSp = sp('panel');
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = panelSp as Record<string, unknown>;

        // When collapsed, panels stack with auto height; otherwise use percentage sizes
        const sizeStyle = isCollapsed
          ? {}
          : currentSize !== undefined
            ? { [layout === 'horizontal' ? 'width' : 'height']: `${currentSize}%` }
            : { flex: 1 };

        return (
          <div
            {...attrs}
            {...spRest}
            ref={mergedRef}
            data-layout={layout}
            className={cx('panel', props.className, spClass as string | undefined)}
            style={{
              ...sizeStyle,
              ...props.style,
              ...(spStyle as React.CSSProperties),
            }}
          >
            {props.children}
          </div>
        );
      },
    };
  },
});

// ============================================================================
// Export
// ============================================================================

export const Splitter = {
  Root: SplitterRoot,
  Panel: SplitterPanel,
};
