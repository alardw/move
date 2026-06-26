'use client';

import * as React from 'react';
import { Progress as RadixProgress } from 'radix-ui';
import { withMoveComponent } from '../../../engine';
import type { SlotPropsMap } from '../../../engine/types';

import styles from './ProgressBar.module.css';

// =============================================================================
// Types
// =============================================================================

export type ProgressBarSize = 'sm' | 'md' | 'lg';
export type ProgressBarVariant = 'default' | 'success' | 'warning' | 'error';

export interface ProgressBarLabels {
  /** Accessible name for the progress bar; applied as aria-label when set. */
  label: string;
}

const DEFAULT_LABELS: ProgressBarLabels = {
  label: 'Progress',
};

export interface ProgressBarProps extends Record<string, unknown> {
  value?: number | null;
  max?: number;
  size?: ProgressBarSize;
  variant?: ProgressBarVariant;
  getValueLabel?: (value: number, max: number) => string;
  labels?: Partial<ProgressBarLabels>;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'root' | 'indicator'>;
}

// =============================================================================
// ProgressBar
// =============================================================================

export const ProgressBar = withMoveComponent<'root' | 'indicator', ProgressBarProps, HTMLDivElement>({
  name: 'ProgressBar',
  styles,
  slots: ['root', 'indicator'] as const,
  defaults: { max: 100, size: 'md', variant: 'default' },
  moveProps: ['value', 'max', 'getValueLabel', 'size', 'variant', 'labels'],

  setup({ props, ref, cx, sp, attrs }) {
    const labels = { ...DEFAULT_LABELS, ...(props.labels as Partial<ProgressBarLabels>) };
    const indicatorRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
      const indicator = indicatorRef.current;
      if (!indicator) return;

      const value = props.value as number | null | undefined;
      const max = props.max as number;

      // Indeterminate — CSS animation handles this
      if (value == null) {
        indicator.style.transform = '';
        return;
      }

      const percentage = Math.min(100, Math.max(0, (value / max) * 100));
      indicator.style.transform = `translateX(-${100 - percentage}%)`;
    }, [props.value, props.max]);

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;
        const indicatorSp = sp('indicator');
        const { className: indSpClass, style: indSpStyle, ...indSpRest } = indicatorSp as Record<string, unknown>;

        return (
          <RadixProgress.Root
            aria-label={labels.label}
            {...attrs}
            {...spRest}
            ref={ref}
            value={props.value as number | null | undefined}
            max={props.max as number}
            getValueLabel={props.getValueLabel as ((value: number, max: number) => string) | undefined}
            data-size={props.size}
            data-variant={props.variant}
            className={cx('root', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            <RadixProgress.Indicator
              {...indSpRest}
              ref={indicatorRef}
              className={cx('indicator', indSpClass as string | undefined)}
              style={indSpStyle as React.CSSProperties}
            />
          </RadixProgress.Root>
        );
      },
    };
  },
});
