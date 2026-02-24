'use client';

import * as React from 'react';
import { withMoveComponent, useMergedRef } from '../../../engine';
import type { PassThrough } from '../../../engine/types';
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
  registerPanel: (index: number, minSize: number, size: number) => void;
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

// ============================================================================
// Root
// ============================================================================

export interface SplitterRootProps extends Record<string, unknown> {
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
  pt?: PassThrough<'root'>;
}

const SplitterRoot = withMoveComponent<'root', SplitterRootProps, HTMLDivElement>({
  name: 'SplitterRoot',
  styles,
  slots: ['root'] as const,
  defaults: { layout: 'horizontal', gutterSize: 4 },
  moveProps: ['layout', 'gutterSize', 'collapseBelow', 'onResizeEnd'],

  setup({ props, ref, cx, ptm, attrs }) {
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
    const panelConfigRef = React.useRef<{ minSize: number; initialSize: number }[]>([]);

    const registerPanel = React.useCallback((index: number, minSize: number, size: number) => {
      panelConfigRef.current[index] = { minSize, initialSize: size };
      setPanelSizes((prev) => {
        const next = [...prev];
        next[index] = size;
        return next;
      });
    }, []);

    const setPanelSize = React.useCallback((index: number, size: number) => {
      setPanelSizes((prev) => {
        const next = [...prev];
        next[index] = size;
        return next;
      });
    }, []);

    // Notify on resize end
    const handleResizeEnd = React.useCallback(() => {
      onResizeEnd?.(panelSizes);
    }, [onResizeEnd, panelSizes]);

    const contextValue = React.useMemo<SplitterContextValue>(() => ({
      layout,
      effectiveLayout,
      isCollapsed,
      panelSizes,
      setPanelSize,
      registerPanel,
      gutterSize,
    }), [layout, effectiveLayout, isCollapsed, panelSizes, setPanelSize, registerPanel, gutterSize]);

    return {
      render() {
        const rootPt = ptm('root');
        const { className: ptClass, style: ptStyle, ...ptRest } = rootPt as Record<string, unknown>;

        // Inject gutters between panels
        const children = React.Children.toArray(props.children);
        const elements: React.ReactNode[] = [];

        children.forEach((child, i) => {
          elements.push(child);
          if (i < children.length - 1) {
            elements.push(
              <SplitterGutter
                key={`gutter-${i}`}
                index={i}
                onResizeEnd={handleResizeEnd}
              />
            );
          }
        });

        return (
          <SplitterContext.Provider value={contextValue}>
            <div
              {...attrs}
              {...ptRest}
              ref={mergedRef}
              data-layout={effectiveLayout}
              data-collapsed={isCollapsed || undefined}
              className={cx('root', props.className, ptClass as string | undefined)}
              style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
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
  const { effectiveLayout: layout, isCollapsed, panelSizes, setPanelSize, gutterSize } = useSplitterContext();
  const gutterRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const startPos = layout === 'horizontal' ? e.clientX : e.clientY;
    const startSizes = [...panelSizes];

    const parentEl = gutterRef.current?.parentElement;
    if (!parentEl) return;

    const parentRect = parentEl.getBoundingClientRect();
    const totalSize = layout === 'horizontal' ? parentRect.width : parentRect.height;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const currentPos = layout === 'horizontal' ? moveEvent.clientX : moveEvent.clientY;
      const delta = currentPos - startPos;
      const deltaPercent = (delta / totalSize) * 100;

      const newSize1 = Math.max(5, startSizes[index] + deltaPercent);
      const newSize2 = Math.max(5, startSizes[index + 1] - deltaPercent);

      // Only update if both panels stay above minimum
      if (newSize1 >= 5 && newSize2 >= 5) {
        setPanelSize(index, newSize1);
        setPanelSize(index + 1, newSize2);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      onResizeEnd();
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [layout, panelSizes, setPanelSize, index, onResizeEnd]);

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    const step = 2; // Percentage step for keyboard navigation
    let handled = false;

    if (layout === 'horizontal') {
      if (e.key === 'ArrowLeft') {
        const newSize1 = Math.max(5, panelSizes[index] - step);
        const newSize2 = panelSizes[index + 1] + step;
        setPanelSize(index, newSize1);
        setPanelSize(index + 1, newSize2);
        handled = true;
      } else if (e.key === 'ArrowRight') {
        const newSize1 = panelSizes[index] + step;
        const newSize2 = Math.max(5, panelSizes[index + 1] - step);
        setPanelSize(index, newSize1);
        setPanelSize(index + 1, newSize2);
        handled = true;
      }
    } else {
      if (e.key === 'ArrowUp') {
        const newSize1 = Math.max(5, panelSizes[index] - step);
        const newSize2 = panelSizes[index + 1] + step;
        setPanelSize(index, newSize1);
        setPanelSize(index + 1, newSize2);
        handled = true;
      } else if (e.key === 'ArrowDown') {
        const newSize1 = panelSizes[index] + step;
        const newSize2 = Math.max(5, panelSizes[index + 1] - step);
        setPanelSize(index, newSize1);
        setPanelSize(index + 1, newSize2);
        handled = true;
      }
    }

    if (e.key === 'Home') {
      // Minimize first panel
      setPanelSize(index, 5);
      setPanelSize(index + 1, panelSizes[index] + panelSizes[index + 1] - 5);
      handled = true;
    } else if (e.key === 'End') {
      // Maximize first panel
      setPanelSize(index, panelSizes[index] + panelSizes[index + 1] - 5);
      setPanelSize(index + 1, 5);
      handled = true;
    }

    if (handled) {
      e.preventDefault();
      onResizeEnd();
    }
  }, [layout, panelSizes, setPanelSize, index, onResizeEnd]);

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

export interface SplitterPanelProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  /** Initial size as percentage. Default: auto-distributed */
  size?: number;
  /** Minimum size as percentage. Default: 5 */
  minSize?: number;
  pt?: PassThrough<'panel'>;
}

const SplitterPanel = withMoveComponent<'panel', SplitterPanelProps, HTMLDivElement>({
  name: 'SplitterPanel',
  styles,
  slots: ['panel'] as const,
  defaults: { minSize: 5 },
  moveProps: ['size', 'minSize'],

  setup({ props, ref, cx, ptm, attrs }) {
    const { effectiveLayout: layout, isCollapsed, panelSizes, registerPanel } = useSplitterContext();
    const indexRef = React.useRef<number>(-1);
    const panelRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRef(ref, panelRef);

    // Determine panel index from DOM position
    React.useLayoutEffect(() => {
      const el = panelRef.current;
      if (!el || !el.parentElement) return;

      const siblings = Array.from(el.parentElement.children).filter(
        (child) => child.classList.contains(styles.panel)
      );
      const idx = siblings.indexOf(el);
      indexRef.current = idx;

      // Calculate initial size
      const siblingCount = siblings.length;
      const initialSize = props.size !== undefined
        ? (props.size as number)
        : 100 / siblingCount;

      registerPanel(idx, props.minSize as number, initialSize);
    }, [registerPanel, props.size, props.minSize]);

    const currentSize = panelSizes[indexRef.current];

    return {
      render() {
        const panelPt = ptm('panel');
        const { className: ptClass, style: ptStyle, ...ptRest } = panelPt as Record<string, unknown>;

        // When collapsed, panels stack with auto height; otherwise use percentage sizes
        const sizeStyle = isCollapsed
          ? {}
          : currentSize !== undefined
            ? { [layout === 'horizontal' ? 'width' : 'height']: `${currentSize}%` }
            : { flex: 1 };

        return (
          <div
            {...attrs}
            {...ptRest}
            ref={mergedRef}
            data-layout={layout}
            className={cx('panel', props.className, ptClass as string | undefined)}
            style={{
              ...sizeStyle,
              ...props.style,
              ...(ptStyle as React.CSSProperties),
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
