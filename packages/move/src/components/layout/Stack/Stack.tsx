'use client';
// Generated from Stack.spec.ts
import * as React from 'react';
import { withMoveComponent } from '../../../engine';
import { useAnimations, resolveAnimationsConfig, staggerEnter } from '../../../animation';
import type { AnimationTrigger } from '../../../animation';
import type { SlotPropsMap } from '../../../engine/types';
import type { Gap, GapWithXL2 } from '../../../shared/types';
import { directionalAttrs, type Shorthand } from '../../../shared/shorthand';
import styles from './Stack.module.css';

// ============================================================================
// Types
// ============================================================================

export type StackDirection = 'row' | 'column';
/** Re-exported for backwards-compatible imports. Prefer `Gap` from
 *  `'move'` directly going forward. */
export type StackGap = Gap;
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'evenly';
/** A single token, or a two-value `"block inline"` shorthand (like CSS), e.g.
 *  `"md 2xl"` (top/bottom md, left/right 2xl). Uses the extended spacing scale. */
export type StackPadding = Shorthand<GapWithXL2>;
export type StackFlex = 1 | 'auto' | 'none';
/**
 * Where this box's height comes from — see /systems/layout.
 *
 * `'parent'` takes all of the parent's height (the parent must be sized, and you
 * must be its only child, or you'll overflow it). `'remaining'` takes the space
 * left after your siblings, and waives the right to be as tall as your content —
 * which is what lets a scroll region below you actually scroll. `'remaining'` is
 * correct in both cases, so prefer it unless the parent isn't a flex container.
 *
 * Neither knows what a viewport is. That constraint enters at the app boundary
 * via `<MoveRoot fullHeight>`, and everything below is relative to it.
 */
export type StackFill = 'parent' | 'remaining';

/** Opt-in staggered entrance for direct children. `true` uses defaults;
 *  the object form tunes the per-item delay and the stagger origin. */
export type StackStagger = boolean | { delay?: number; from?: 'first' | 'last' | 'center' };

export interface StackProps extends React.HTMLAttributes<HTMLElement> {
  direction?: StackDirection;
  gap?: StackGap;
  align?: StackAlign;
  justify?: StackJustify;
  padding?: StackPadding;
  flex?: StackFlex;
  fill?: StackFill;
  /** Clip anything that overflows this box (`overflow: clip`) — a boundary, not a
   *  scroller. Deliberately not `overflow: hidden`: hidden stays programmatically
   *  scrollable, so focusing a child below the fold silently scrolls the box with
   *  no scrollbar to get back. `clip` cannot. To scroll, use ScrollArea. */
  clip?: boolean;
  wrap?: boolean;
  collapseBelow?: string;
  /** Reveal direct children with a staggered fade+rise on mount. Off by default. */
  stagger?: StackStagger;
  /** Override or disable the entrance stagger (only relevant when `stagger` is set). */
  animations?: AnimationTrigger[] | false;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'root'>;
}

// ============================================================================
// Stack
// ============================================================================

export const Stack = withMoveComponent<'root', StackProps, HTMLDivElement>({
  name: 'Stack',
  styles,
  slots: ['root'] as const,
  defaults: {
    direction: 'column' as StackDirection,
    gap: 'md' as StackGap,
    align: 'stretch' as StackAlign,
    justify: 'start' as StackJustify,
    wrap: false,
    stagger: false as StackStagger,
  },
  moveProps: ['collapseBelow', 'fill', 'clip', 'stagger', 'animations', 'padding', 'flex'],

  setup({ props, ref, internalRef, cx, sp, attrs }) {
    const collapseBelow = props.collapseBelow as string | undefined;

    // Opt-in staggered entrance — the standard declarative children-stagger
    // (List/Table/Timeline pattern). Off (and zero-cost) when `stagger` is unset.
    const staggerProp = props.stagger as StackStagger | undefined;
    const staggerOn = !!staggerProp;
    const staggerCfg = (typeof staggerProp === 'object' && staggerProp) || {};
    const animConfig = React.useMemo(() => {
      if (!staggerOn || props.animations === false) return null;
      return resolveAnimationsConfig(
        [staggerEnter({ delay: staggerCfg.delay, from: staggerCfg.from })],
        props.animations as AnimationTrigger[] | undefined,
      );
    }, [staggerOn, staggerCfg.delay, staggerCfg.from, props.animations]);
    const animRefs = React.useMemo(
      () => ({ Root: internalRef as React.RefObject<HTMLElement | null> }),
      [internalRef],
    );
    useAnimations(animConfig, animRefs);

    React.useEffect(() => {
      const el = internalRef.current;
      if (!el || !collapseBelow) return;

      const threshold = parseFloat(collapseBelow);
      if (isNaN(threshold)) return;

      const observer = new ResizeObserver((entries) => {
        const width = entries[0].contentRect.width;
        if (width < threshold) {
          el.dataset.collapsed = '';
        } else {
          delete el.dataset.collapsed;
        }
      });
      observer.observe(el);
      return () => observer.disconnect();
    }, [collapseBelow, internalRef]);

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('root', props.className, spClass as string | undefined)}
            style={{ ...(props.style as React.CSSProperties), ...(spStyle as React.CSSProperties) }}
            data-direction={props.direction as string}
            data-gap={props.gap as string}
            data-align={props.align as string}
            data-justify={props.justify as string}
            {...directionalAttrs('padding', props.padding as string | undefined)}
            data-flex={props.flex != null ? String(props.flex) : undefined}
            data-fill={props.fill as string | undefined}
            data-clip={props.clip ? '' : undefined}
            data-wrap={props.wrap ? '' : undefined}
          >
            {props.children}
          </div>
        );
      },
    };
  },
});
