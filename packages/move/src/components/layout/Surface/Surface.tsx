'use client';
// Generated from Surface.spec.ts
import * as React from 'react';
import { Slot } from 'radix-ui';
import { withMoveComponent } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import { useSurfaceFlip, SurfaceProvider } from '../../../infrastructure/Surface';
import type { SurfaceTone } from '../../../infrastructure/Surface';
import styles from './Surface.module.css';

export type SurfaceFill = 'parent' | 'remaining';
export type SurfaceFlex = 1 | 'auto' | 'none';

export interface SurfaceProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  /** Pin the ground instead of alternating. Unset, it takes the opposite of
   *  whatever it landed on — which is what makes nesting work with nobody
   *  setting a colour. */
  tone?: SurfaceTone;
  /** Where this box's height comes from. A ground that stops short of the edges
   *  is not a ground, so this is how it reaches them. See /systems/layout. */
  fill?: SurfaceFill;
  /** Flex sizing along the parent's main axis. */
  flex?: SurfaceFlex;
  /** Paint an element that already exists rather than adding one. */
  asChild?: boolean;
  sp?: SlotPropsMap<'root'>;
}

/**
 * A ground, and nothing else.
 *
 * Owning a surface is four things, and before this they were four things every
 * container did for itself: take the alternate tone of whatever you landed on,
 * hand that tone to your children, mark it for CSS, and paint it. Seven
 * components each wrote the first three by hand. Only three painted from the
 * relative token, and the two sets barely overlapped — so a library where a
 * panel "shades itself against whatever it sits on" had components owning a
 * ground they never painted, and components painting one they did not own.
 *
 * The docs had to spell the whole mechanism out in a raw <div> to show it, with
 * the purity check silenced on four lines. A style composed code cannot write is
 * a missing component.
 *
 * What it deliberately does NOT have: radius, padding, width, height. Those make
 * it the Box primitive Move refused, and the refusal is the good part — a call
 * site expresses constraints and participation, never a size. `fill` and `flex`
 * are participation (a parent can still overrule them); a dimension would not be.
 */
export const Surface = withMoveComponent<'root', SurfaceProps, HTMLElement>({
  name: 'Surface',
  styles,
  slots: ['root'] as const,
  defaults: { asChild: false },
  moveProps: ['tone', 'fill', 'flex', 'asChild'],

  setup({ props, ref, cx, sp, attrs }) {
    const flipped = useSurfaceFlip();
    const tone = (props.tone as SurfaceTone | undefined) ?? flipped;

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        // Unlike LayoutGroup, the root class stays ON the wrapped element under
        // asChild: painting is the whole job, and a Surface that hands its class
        // over is a Surface that does nothing. The corollary is that a component
        // composing this must stop painting its own background — two equal-weight
        // rules on one element are settled by stylesheet order, and the dev server
        // and the bundled CSS do not agree on it.
        const Comp = (props.asChild ? Slot.Root : 'div') as React.ElementType;

        return (
          <SurfaceProvider value={tone}>
            <Comp
              {...attrs}
              {...spRest}
              ref={ref}
              className={cx('root', props.className, spClass as string | undefined)}
              style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
              data-surface={tone}
              {...(props.fill ? { 'data-fill': props.fill } : {})}
              {...(props.flex != null ? { 'data-flex': String(props.flex) } : {})}
            >
              {props.children as React.ReactNode}
            </Comp>
          </SurfaceProvider>
        );
      },
    };
  },
});
