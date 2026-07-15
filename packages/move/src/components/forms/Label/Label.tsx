'use client';
// Generated from Label.spec.ts
import * as React from 'react';
import { Label as RadixLabel } from 'radix-ui';
import { withMoveComponent, useMergedRef } from '../../../engine';
import type { Truncate } from '../../../shared/types';
import { resolveTruncate } from '../../../shared/truncate';
import { useTruncationTooltip } from '../../overlays/Tooltip';
import styles from './Label.module.css';

export type LabelSize = 'sm' | 'md' | 'lg';

export interface LabelProps extends React.HTMLAttributes<HTMLElement> {
  htmlFor?: string;
  required?: boolean;
  disabled?: boolean;
  size?: LabelSize;
  /** Truncate overflowing text: `true`/`'end'`, `'start'`, or `'clamp'`.
   *  Needs a block/inline-block/flex context to have a width to ellipsize. */
  truncate?: Truncate;
  /** Max lines for `truncate="clamp"` (default 2). */
  lines?: number;
  /** With `truncate`, show the full label in a tooltip when it's cut off. */
  tooltip?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Label = withMoveComponent<'root' | 'asterisk', LabelProps, HTMLLabelElement>({
  name: 'Label',
  styles,
  slots: ['root', 'asterisk'] as const,
  defaults: { size: 'md' as LabelSize },
  moveProps: ['htmlFor', 'required', 'disabled', 'truncate', 'lines', 'tooltip'],

  setup({ props, ref, cx, sp, attrs }) {
    const trunc = resolveTruncate(
      props.truncate as Truncate | undefined,
      props.lines as number,
      props.children,
    );
    const fullText = typeof props.children === 'string' ? props.children : undefined;
    const wantTooltip = !!props.tooltip && !!trunc.mode && fullText !== undefined;
    const { ref: truncRef, wrap } = useTruncationTooltip(wantTooltip, fullText);
    const mergedRef = useMergedRef<HTMLElement>(ref, truncRef);

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;
        const asteriskSp = sp('asterisk');
        const {
          className: astSpClass,
          style: astSpStyle,
          ...astSpRest
        } = asteriskSp as Record<string, unknown>;

        return wrap(
          <RadixLabel.Root
            {...attrs}
            {...spRest}
            ref={mergedRef}
            htmlFor={props.htmlFor as string}
            className={cx('root', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties), ...trunc.style }}
            data-size={props.size}
            {...(props.disabled ? { 'data-disabled': '' } : {})}
            {...(trunc.mode ? { 'data-truncate': trunc.mode } : {})}
          >
            {trunc.content}
            {props.required && (
              <span
                {...astSpRest}
                className={cx('asterisk', astSpClass as string | undefined)}
                style={astSpStyle as React.CSSProperties}
                aria-hidden="true"
              >
                *
              </span>
            )}
          </RadixLabel.Root>,
        );
      },
    };
  },
});
