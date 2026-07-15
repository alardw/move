'use client';
import * as React from 'react';
// Generated from Link.spec.ts
import { Slot } from 'radix-ui';
import { withMoveComponent, useMergedRef } from '../../../engine';
import type { TypographySize, Truncate } from '../../../shared/types';
import { resolveTruncate } from '../../../shared/truncate';
import { useTruncationTooltip } from '../../overlays/Tooltip';
import styles from './Link.module.css';

export type LinkVariant = 'default' | 'muted' | 'subtle';
export type LinkUnderline = 'always' | 'hover' | 'none';
/** Re-exported for backwards-compatible imports. Prefer
 *  `TypographySize` from `'move'` directly going forward. */
export type LinkSize = TypographySize;

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: LinkVariant;
  underline?: LinkUnderline;
  size?: LinkSize;
  external?: boolean;
  asChild?: boolean;
  /** Truncate overflowing text: `true`/`'end'`, `'start'`, or `'clamp'`.
   *  Needs a block/inline-block/flex context (a bare inline link in flowing
   *  text has no bounded width to ellipsize against). */
  truncate?: Truncate;
  /** Max lines for `truncate="clamp"` (default 2). */
  lines?: number;
  /** With `truncate`, show the full text in a tooltip when it's cut off
   *  (ignored with `asChild`). */
  tooltip?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const Link = withMoveComponent<'root', LinkProps, HTMLAnchorElement>({
  name: 'Link',
  styles,
  slots: ['root'] as const,
  defaults: {
    variant: 'default' as LinkVariant,
    underline: 'always' as LinkUnderline,
    asChild: false,
  },
  moveProps: ['size', 'external', 'truncate', 'lines', 'tooltip'],

  setup({ props, ref, cx, sp, attrs }) {
    const trunc = resolveTruncate(
      props.truncate as Truncate | undefined,
      props.lines as number,
      props.children,
    );
    const fullText = typeof props.children === 'string' ? props.children : undefined;
    const wantTooltip = !!props.tooltip && !!trunc.mode && fullText !== undefined && !props.asChild;
    const { ref: truncRef, wrap } = useTruncationTooltip(wantTooltip, fullText);
    const mergedRef = useMergedRef<HTMLElement>(ref, truncRef);

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        const Comp = props.asChild ? Slot.Root : 'a';
        const externalProps = props.external
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {};

        return wrap(
          <Comp
            {...attrs}
            {...externalProps}
            {...spRest}
            ref={mergedRef}
            className={cx('root', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties), ...trunc.style }}
            data-variant={props.variant}
            data-underline={props.underline}
            {...(props.size ? { 'data-size': props.size } : {})}
            {...(trunc.mode ? { 'data-truncate': trunc.mode } : {})}
          >
            {trunc.content}
          </Comp>,
        );
      },
    };
  },
});
