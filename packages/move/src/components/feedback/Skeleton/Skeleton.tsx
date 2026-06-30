'use client';
// Generated from Skeleton.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import * as React from 'react';
import { animate } from 'animejs';
import { withMoveComponent } from '../../../engine';
import { useAnimations, prefersReducedMotion } from '../../../animation';
import type { AnimationTrigger } from '../../../animation';
import type { SlotPropsMap } from '../../../engine/types';
import styles from './Skeleton.module.css';

// ============================================================================
// Types
// ============================================================================

export type SkeletonAnimation = 'pulse' | 'wave' | false;

// ============================================================================
// Context
// ============================================================================

interface SkeletonContextValue {
  animation: SkeletonAnimation;
}

const SkeletonContext = React.createContext<SkeletonContextValue>({ animation: 'pulse' });

// ============================================================================
// useSkeletonPulse — attaches looping pulse animation to a shape element
// ============================================================================

function useSkeletonPulse(ref: React.RefObject<HTMLElement | null>) {
  const { animation } = React.useContext(SkeletonContext);

  const pulseConfig: AnimationTrigger[] | null = React.useMemo(() => {
    if (animation !== 'pulse') return null;
    return [
      {
        trigger: 'Pulse.enter',
        sequence: [
          {
            target: 'Pulse',
            animation: {
              opacity: { from: 1, to: 0.4, duration: 750, ease: 'inOutQuad' },
              loop: true,
              alternate: true,
            },
          },
        ],
      },
    ];
  }, [animation]);

  const pulseRefs = React.useMemo(
    () => ({
      Pulse: ref as React.RefObject<HTMLElement | null>,
    }),
    [ref],
  );

  useAnimations(pulseConfig, pulseRefs);
}

// ============================================================================
// Root
// ============================================================================

export interface SkeletonRootProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  loading?: boolean;
  animation?: SkeletonAnimation;
  sp?: SlotPropsMap<'root'>;
}

const SkeletonRoot = withMoveComponent<'root', SkeletonRootProps, HTMLDivElement>({
  name: 'SkeletonRoot',
  styles,
  slots: ['root'] as const,
  defaults: { loading: true, animation: 'pulse' as SkeletonAnimation },
  moveProps: ['loading', 'animation'],

  setup({ props, ref, internalRef, cx, sp, attrs }) {
    const animation = props.animation as SkeletonAnimation;
    const ctxValue = React.useMemo(() => ({ animation }), [animation]);

    // Wave: animate a CSS custom property on the root, inherited by all shape descendants.
    // background-position-x goes from 100% -> 0%, sweeping the highlight left-to-right.
    // The gradient is 400% wide so the highlight is fully off-screen at both endpoints.
    React.useEffect(() => {
      const el = internalRef.current;
      if (!el || animation !== 'wave' || prefersReducedMotion()) return;

      const proxy = { v: 100 };
      const anim = animate(proxy, {
        v: [100, 0],
        duration: 1800,
        ease: 'inOutSine',
        loop: true,
        onRender: () => {
          el.style.setProperty('--move-skeleton-wave-x', `${proxy.v}%`);
        },
      });
      return () => {
        anim.pause();
      };
    }, [animation, internalRef]);

    return {
      render() {
        if (!props.loading) return null;

        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        return (
          <SkeletonContext.Provider value={ctxValue}>
            <div
              {...attrs}
              {...spRest}
              ref={ref}
              className={cx(
                'root',
                props.className as string | undefined,
                spClass as string | undefined,
              )}
              style={{
                ...(props.style as React.CSSProperties),
                ...(spStyle as React.CSSProperties),
              }}
              aria-busy
              aria-live="polite"
              data-animation={animation || undefined}
            >
              {props.children}
            </div>
          </SkeletonContext.Provider>
        );
      },
    };
  },
});

// ============================================================================
// Circle
// ============================================================================

export interface SkeletonCircleProps extends React.HTMLAttributes<HTMLElement> {
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
  sp?: SlotPropsMap<'circle'>;
}

const SkeletonCircle = withMoveComponent<'circle', SkeletonCircleProps, HTMLDivElement>({
  name: 'SkeletonCircle',
  styles,
  slots: ['circle'] as const,
  defaults: { size: 40 },
  moveProps: ['size'],

  setup({ props, ref, internalRef, cx, sp, attrs }) {
    useSkeletonPulse(internalRef);

    return {
      render() {
        const circleSp = sp('circle');
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = circleSp as Record<string, unknown>;

        const s = typeof props.size === 'number' ? `${props.size}px` : props.size;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('circle', props.className, spClass as string | undefined)}
            style={{
              width: s,
              height: s,
              ...props.style,
              ...(spStyle as React.CSSProperties),
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

export interface SkeletonRectangleProps extends React.HTMLAttributes<HTMLElement> {
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
  sp?: SlotPropsMap<'rectangle'>;
}

const SkeletonRectangle = withMoveComponent<'rectangle', SkeletonRectangleProps, HTMLDivElement>({
  name: 'SkeletonRectangle',
  styles,
  slots: ['rectangle'] as const,
  defaults: { width: '100%', height: '1rem' },
  moveProps: ['width', 'height'],

  setup({ props, ref, internalRef, cx, sp, attrs }) {
    useSkeletonPulse(internalRef);

    return {
      render() {
        const rectSp = sp('rectangle');
        const { className: spClass, style: spStyle, ...spRest } = rectSp as Record<string, unknown>;

        const w = typeof props.width === 'number' ? `${props.width}px` : props.width;
        const h = typeof props.height === 'number' ? `${props.height}px` : props.height;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('rectangle', props.className, spClass as string | undefined)}
            style={{
              width: w,
              height: h,
              ...props.style,
              ...(spStyle as React.CSSProperties),
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

export interface SkeletonRoundedProps extends React.HTMLAttributes<HTMLElement> {
  width?: number | string;
  height?: number | string;
  radius?: string;
  className?: string;
  style?: React.CSSProperties;
  sp?: SlotPropsMap<'rounded'>;
}

const SkeletonRounded = withMoveComponent<'rounded', SkeletonRoundedProps, HTMLDivElement>({
  name: 'SkeletonRounded',
  styles,
  slots: ['rounded'] as const,
  defaults: { width: '100%', height: '1rem', radius: 'var(--move-skeleton-radius)' },
  moveProps: ['width', 'height', 'radius'],

  setup({ props, ref, internalRef, cx, sp, attrs }) {
    useSkeletonPulse(internalRef);

    return {
      render() {
        const roundedSp = sp('rounded');
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = roundedSp as Record<string, unknown>;

        const w = typeof props.width === 'number' ? `${props.width}px` : props.width;
        const h = typeof props.height === 'number' ? `${props.height}px` : props.height;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('rounded', props.className, spClass as string | undefined)}
            style={{
              width: w,
              height: h,
              borderRadius: props.radius as string,
              ...props.style,
              ...(spStyle as React.CSSProperties),
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

export interface SkeletonTextProps extends React.HTMLAttributes<HTMLElement> {
  lines?: number;
  spacing?: string;
  lineHeight?: string;
  lastLineWidth?: string;
  className?: string;
  style?: React.CSSProperties;
  sp?: SlotPropsMap<'text' | 'line'>;
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

  setup({ props, ref, internalRef, cx, sp, attrs }) {
    useSkeletonPulse(internalRef);

    return {
      render() {
        const textSp = sp('text');
        const { className: spClass, style: spStyle, ...spRest } = textSp as Record<string, unknown>;
        const lineSp = sp('line');
        const {
          className: lineSpClass,
          style: lineSpStyle,
          ...lineSpRest
        } = lineSp as Record<string, unknown>;

        const count = props.lines as number;
        const lineElements = Array.from({ length: count }, (_, i) => {
          const isLast = i === count - 1 && count > 1;
          return (
            <div
              key={i}
              {...lineSpRest}
              className={cx('line', lineSpClass as string | undefined)}
              style={{
                width: isLast ? (props.lastLineWidth as string) : '100%',
                height: props.lineHeight as string,
                ...(lineSpStyle as React.CSSProperties),
              }}
            />
          );
        });

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('text', props.className, spClass as string | undefined)}
            style={{
              gap: props.spacing as string,
              ...props.style,
              ...(spStyle as React.CSSProperties),
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
