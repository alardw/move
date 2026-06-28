'use client';
// Generated from LayoutGroup.spec.ts (schemaVersion: 7, specHash: ca963d3b)
import * as React from 'react';
import { Slot } from 'radix-ui';
import { withMoveComponent, useMergedRef } from '../../../engine';
import { useAutoLayout } from '../../../animation';
import type { LayoutEnterExit } from '../../../animation';
import styles from './LayoutGroup.module.css';

export type LayoutGroupAs = 'div' | 'ul' | 'ol' | 'section';
export type LayoutGroupAnim = LayoutEnterExit;

export interface LayoutGroupProps extends React.HTMLAttributes<HTMLElement> {
  /** Items to lay out. Each needs a stable React key so the FLIP engine can
   *  track it across reorders. */
  children?: React.ReactNode;
  /** Semantic container element to render. */
  as?: LayoutGroupAs;
  /** Render onto the single child element (e.g. wrap a Stack/Grid) so it provides
   *  the layout while LayoutGroup FLIP-animates its children. */
  asChild?: boolean;
  /** Entrance animation for newly added children. */
  enter?: LayoutGroupAnim;
  /** Exit animation for removed children. */
  exit?: LayoutGroupAnim;
  /** ms for the position move and enter/exit animations. */
  duration?: number;
  /** ms between consecutive children (0 = off). */
  stagger?: number;
  /** Also play the enter animation (staggered) for the children present at mount. */
  initial?: boolean;
  /** Opt out of animation — children jump straight to their final layout. */
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const LayoutGroup = withMoveComponent<'root', LayoutGroupProps, HTMLElement>({
  name: 'LayoutGroup',
  styles,
  slots: ['root'] as const,
  defaults: {
    as: 'div' as LayoutGroupAs,
    asChild: false,
    enter: 'fade-scale' as LayoutGroupAnim,
    exit: 'fade-scale' as LayoutGroupAnim,
    duration: 350,
    stagger: 0,
    initial: false,
    disabled: false,
  },
  moveProps: ['as', 'asChild', 'enter', 'exit', 'duration', 'stagger', 'initial', 'disabled'],

  setup({ props, ref, cx, sp, attrs }) {
    const { ref: layoutRef } = useAutoLayout({
      enter: props.enter as LayoutGroupAnim,
      exit: props.exit as LayoutGroupAnim,
      duration: props.duration as number,
      stagger: props.stagger as number,
      initial: props.initial as boolean,
      disabled: props.disabled as boolean,
    });

    const mergedRef = useMergedRef<HTMLElement>(ref, layoutRef as React.RefObject<HTMLElement>);

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        // With asChild, Slot merges our ref/className/data-attrs onto the wrapped
        // element (e.g. a Stack/Grid), which then provides the layout and is the
        // container useAutoLayout tracks.
        const Comp = (props.asChild ? Slot.Root : (props.as || 'div')) as React.ElementType;

        return (
          <Comp
            {...attrs}
            {...spRest}
            ref={mergedRef}
            className={cx('root', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            data-enter={props.enter}
            data-exit={props.exit}
          >
            {props.children as React.ReactNode}
          </Comp>
        );
      },
    };
  },
});
