'use client';

import * as React from 'react';
import { withMoveComponent } from '../../../engine';
import type { PassThrough } from '../../../engine/types';
import styles from './Skeleton.module.css';

// ============================================================================
// Context (reserved for future animation config)
// ============================================================================

interface SkeletonContextValue {}

const SkeletonContext = React.createContext<SkeletonContextValue | null>(null);

// ============================================================================
// Root
// ============================================================================

export interface SkeletonRootProps {
  children?: React.ReactNode;
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const SkeletonRoot: React.FC<SkeletonRootProps> = ({
  children,
  loading = true,
  className,
  style,
}) => {
  if (!loading) return null;

  return (
    <SkeletonContext.Provider value={{}}>
      <div
        className={[styles.root, className].filter(Boolean).join(' ')}
        style={style}
        aria-busy
        aria-live="polite"
      >
        {children}
      </div>
    </SkeletonContext.Provider>
  );
};
SkeletonRoot.displayName = 'Skeleton.Root';

// ============================================================================
// Circle
// ============================================================================

export interface SkeletonCircleProps extends Record<string, unknown> {
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
  pt?: PassThrough<'circle'>;
}

const SkeletonCircle = withMoveComponent<'circle', SkeletonCircleProps, HTMLDivElement>({
  name: 'SkeletonCircle',
  styles,
  slots: ['circle'] as const,
  defaults: { size: 40 },
  moveProps: ['size'],

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const circlePt = ptm('circle');
        const { className: ptClass, style: ptStyle, ...ptRest } = circlePt as Record<string, unknown>;

        const s = typeof props.size === 'number' ? `${props.size}px` : props.size;

        return (
          <div
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('circle', props.className, ptClass as string | undefined)}
            style={{
              width: s,
              height: s,
              ...props.style,
              ...(ptStyle as React.CSSProperties),
            }}
          />
        );
      },
    };
  },
});

// ============================================================================
// Rectangle
// ============================================================================

export interface SkeletonRectangleProps extends Record<string, unknown> {
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
  pt?: PassThrough<'rectangle'>;
}

const SkeletonRectangle = withMoveComponent<'rectangle', SkeletonRectangleProps, HTMLDivElement>({
  name: 'SkeletonRectangle',
  styles,
  slots: ['rectangle'] as const,
  defaults: { width: '100%', height: '1rem' },
  moveProps: ['width', 'height'],

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const rectPt = ptm('rectangle');
        const { className: ptClass, style: ptStyle, ...ptRest } = rectPt as Record<string, unknown>;

        const w = typeof props.width === 'number' ? `${props.width}px` : props.width;
        const h = typeof props.height === 'number' ? `${props.height}px` : props.height;

        return (
          <div
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('rectangle', props.className, ptClass as string | undefined)}
            style={{
              width: w,
              height: h,
              ...props.style,
              ...(ptStyle as React.CSSProperties),
            }}
          />
        );
      },
    };
  },
});

// ============================================================================
// Rounded
// ============================================================================

export interface SkeletonRoundedProps extends Record<string, unknown> {
  width?: number | string;
  height?: number | string;
  radius?: string;
  className?: string;
  style?: React.CSSProperties;
  pt?: PassThrough<'rounded'>;
}

const SkeletonRounded = withMoveComponent<'rounded', SkeletonRoundedProps, HTMLDivElement>({
  name: 'SkeletonRounded',
  styles,
  slots: ['rounded'] as const,
  defaults: { width: '100%', height: '1rem', radius: 'var(--move-skeleton-radius)' },
  moveProps: ['width', 'height', 'radius'],

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const roundedPt = ptm('rounded');
        const { className: ptClass, style: ptStyle, ...ptRest } = roundedPt as Record<string, unknown>;

        const w = typeof props.width === 'number' ? `${props.width}px` : props.width;
        const h = typeof props.height === 'number' ? `${props.height}px` : props.height;

        return (
          <div
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('rounded', props.className, ptClass as string | undefined)}
            style={{
              width: w,
              height: h,
              borderRadius: props.radius as string,
              ...props.style,
              ...(ptStyle as React.CSSProperties),
            }}
          />
        );
      },
    };
  },
});

// ============================================================================
// Text
// ============================================================================

export interface SkeletonTextProps extends Record<string, unknown> {
  lines?: number;
  spacing?: string;
  lineHeight?: string;
  lastLineWidth?: string;
  className?: string;
  style?: React.CSSProperties;
  pt?: PassThrough<'text' | 'line'>;
}

const SkeletonText = withMoveComponent<'text' | 'line', SkeletonTextProps, HTMLDivElement>({
  name: 'SkeletonText',
  styles,
  slots: ['text', 'line'] as const,
  defaults: {
    lines: 3,
    spacing: 'var(--move-skeleton-text-spacing)',
    lineHeight: 'var(--move-skeleton-text-line-height)',
    lastLineWidth: '60%',
  },
  moveProps: ['lines', 'spacing', 'lineHeight', 'lastLineWidth'],

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const textPt = ptm('text');
        const { className: ptClass, style: ptStyle, ...ptRest } = textPt as Record<string, unknown>;
        const linePt = ptm('line');
        const { className: linePtClass, style: linePtStyle, ...linePtRest } = linePt as Record<string, unknown>;

        const count = props.lines as number;
        const lineElements = Array.from({ length: count }, (_, i) => {
          const isLast = i === count - 1 && count > 1;
          return (
            <div
              key={i}
              {...linePtRest}
              className={cx('line', linePtClass as string | undefined)}
              style={{
                width: isLast ? (props.lastLineWidth as string) : '100%',
                height: props.lineHeight as string,
                ...(linePtStyle as React.CSSProperties),
              }}
            />
          );
        });

        return (
          <div
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('text', props.className, ptClass as string | undefined)}
            style={{
              gap: props.spacing as string,
              ...props.style,
              ...(ptStyle as React.CSSProperties),
            }}
          >
            {lineElements}
          </div>
        );
      },
    };
  },
});

// ============================================================================
// Export
// ============================================================================

export const Skeleton = {
  Root: SkeletonRoot,
  Circle: SkeletonCircle,
  Rectangle: SkeletonRectangle,
  Rounded: SkeletonRounded,
  Text: SkeletonText,
};
