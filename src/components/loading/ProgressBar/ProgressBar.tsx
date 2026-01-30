'use client';

import * as React from 'react';
import { Progress as RadixProgress } from 'radix-ui';
import { animate, spring } from 'animejs';
import { withMoveComponent } from '../../../engine';
import type { PassThrough } from '../../../engine/types';
import { prefersReducedMotion } from '../../../animation';
import styles from './ProgressBar.module.css';

// =============================================================================
// ProgressBar
// =============================================================================

export interface ProgressBarProps extends Record<string, unknown> {
  value?: number | null;
  max?: number;
  getValueLabel?: (value: number, max: number) => string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  pt?: PassThrough<'root' | 'indicator'>;
}

export const ProgressBar = withMoveComponent<'root' | 'indicator', ProgressBarProps, HTMLDivElement>({
  name: 'ProgressBar',
  styles,
  slots: ['root', 'indicator'] as const,
  defaults: { max: 100 },
  moveProps: ['value', 'max', 'getValueLabel'],

  setup({ props, ref, cx, ptm, attrs }) {
    const indicatorRef = React.useRef<HTMLDivElement | null>(null);
    const prevValueRef = React.useRef<number | null | undefined>(undefined);

    React.useEffect(() => {
      const indicator = indicatorRef.current;
      if (!indicator) return;

      const value = props.value as number | null | undefined;
      const max = props.max as number;

      // Indeterminate — CSS animation handles this
      if (value == null) {
        indicator.style.transform = '';
        prevValueRef.current = value;
        return;
      }

      const percentage = Math.min(100, Math.max(0, (value / max) * 100));

      // First render or reduced motion — set instantly
      if (prevValueRef.current === undefined || prefersReducedMotion()) {
        indicator.style.transform = `translateX(-${100 - percentage}%)`;
        prevValueRef.current = value;
        return;
      }

      // Animate the transition
      const prevVal = prevValueRef.current;
      const prevPercentage = prevVal != null
        ? Math.min(100, Math.max(0, (prevVal / max) * 100))
        : 0;

      animate(indicator, {
        translateX: [`-${100 - prevPercentage}%`, `-${100 - percentage}%`],
        ease: spring({ mass: 1, stiffness: 260, damping: 16, velocity: 0 }),
      });

      prevValueRef.current = value;
    }, [props.value, props.max]);

    return {
      render() {
        const rootPt = ptm('root');
        const { className: ptClass, style: ptStyle, ...ptRest } = rootPt as Record<string, unknown>;
        const indicatorPt = ptm('indicator');
        const { className: indPtClass, style: indPtStyle, ...indPtRest } = indicatorPt as Record<string, unknown>;

        return (
          <RadixProgress.Root
            {...attrs}
            {...ptRest}
            ref={ref}
            value={props.value as number | null | undefined}
            max={props.max as number}
            getValueLabel={props.getValueLabel as ((value: number, max: number) => string) | undefined}
            className={cx('root', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
          >
            <RadixProgress.Indicator
              {...indPtRest}
              ref={indicatorRef}
              className={cx('indicator', indPtClass as string | undefined)}
              style={indPtStyle as React.CSSProperties}
            />
          </RadixProgress.Root>
        );
      },
    };
  },
});
