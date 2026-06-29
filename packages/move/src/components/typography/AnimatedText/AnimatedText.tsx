'use client';
// Generated from AnimatedText.spec.ts (schemaVersion: 7, specHash: e7eefb38)
import * as React from 'react';
import { Slot } from 'radix-ui';
import { withMoveComponent, useMergedRef } from '../../../engine';
import { useSplitText } from '../../../animation';
import type { SplitTextBy, SplitTextEffect, SplitTextTrigger } from '../../../animation';
import type { DisplaySize } from '../../../shared/types';
import styles from './AnimatedText.module.css';

/** Flatten a React node tree to its text content (for splitText + re-split key). */
function nodeText(node: React.ReactNode): string {
  if (node == null || node === false) return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join('');
  if (React.isValidElement(node)) return nodeText((node.props as { children?: React.ReactNode }).children);
  return '';
}

export type AnimatedTextBy = SplitTextBy;
export type AnimatedTextEffect = SplitTextEffect;
export type AnimatedTextTrigger = SplitTextTrigger;
export type AnimatedTextAs = 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type AnimatedTextSize = DisplaySize;
export type AnimatedTextWeight = 'normal' | 'medium' | 'semibold' | 'bold';

export interface AnimatedTextProps extends React.HTMLAttributes<HTMLElement> {
  /** The text to animate. A plain string, or (with `asChild`) a single element
   *  like `<Heading>` whose text content is split. */
  children?: React.ReactNode;
  /** Render onto the single child element (e.g. wrap a `Heading`/`Text`) instead
   *  of AnimatedText's own element, so it inherits that component's typography. */
  asChild?: boolean;
  /** HTML element to render the container as (semantic only — typography comes from size/weight). */
  as?: AnimatedTextAs;
  /** Font size from the Move typography scale. */
  size?: AnimatedTextSize;
  /** Font weight from the Move typography scale. */
  weight?: AnimatedTextWeight;
  /** Split granularity. */
  by?: AnimatedTextBy;
  /** Per-segment entrance effect. */
  effect?: AnimatedTextEffect;
  /** When the reveal runs. */
  trigger?: AnimatedTextTrigger;
  /** For inView/hover, only animate the first time. */
  once?: boolean;
  /** ms between segments. `null` → sensible per-`by` default. */
  stagger?: number | null;
  /** ms before the first segment animates. */
  delay?: number;
  /** ms duration of each segment animation. */
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const AnimatedText = withMoveComponent<'root', AnimatedTextProps, HTMLElement>({
  name: 'AnimatedText',
  styles,
  slots: ['root'] as const,
  defaults: {
    as: 'span' as AnimatedTextAs,
    asChild: false,
    by: 'word' as AnimatedTextBy,
    effect: 'fade' as AnimatedTextEffect,
    trigger: 'inView' as AnimatedTextTrigger,
    once: true,
    stagger: null,
    delay: 0,
    duration: 600,
  },
  moveProps: ['as', 'asChild', 'size', 'weight', 'by', 'effect', 'trigger', 'once', 'stagger', 'delay', 'duration'],

  setup({ props, ref, cx, sp, attrs }) {
    const asChild = !!props.asChild;
    const childEl = asChild ? React.Children.only(props.children as React.ReactElement) : null;
    // With asChild the text lives inside the wrapped element; otherwise it's the
    // string children directly.
    const text = asChild ? nodeText(childEl) : String(props.children ?? '');

    const { ref: splitRef, animated } = useSplitText({
      text,
      by: props.by as AnimatedTextBy,
      effect: props.effect as AnimatedTextEffect,
      trigger: props.trigger as AnimatedTextTrigger,
      once: props.once as boolean,
      stagger: props.stagger as number | null,
      delay: props.delay as number,
      duration: props.duration as number,
    });

    const mergedRef = useMergedRef<HTMLElement>(ref, splitRef as React.RefObject<HTMLElement>);

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        // With asChild, Slot merges our ref/className/data-attrs onto the wrapped
        // element (e.g. a Heading), and splitText runs on that element — so it
        // keeps the wrapped component's typography.
        const Comp = (asChild ? Slot.Root : (props.as || 'span')) as React.ElementType;

        return (
          // Keyed on the text so a content change remounts cleanly instead of
          // letting React reconcile against the splitText-mutated DOM.
          <Comp
            key={text}
            {...attrs}
            {...spRest}
            ref={mergedRef}
            className={cx('root', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            data-by={props.by}
            data-effect={props.effect}
            {...(props.size ? { 'data-size': props.size } : {})}
            {...(props.weight ? { 'data-weight': props.weight } : {})}
            {...(animated ? { 'data-animated': '' } : {})}
          >
            {asChild ? childEl : text}
          </Comp>
        );
      },
    };
  },
});
