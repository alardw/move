'use client';
// Generated from Spinner.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import * as React from 'react';
import { withMoveComponent } from '../../../engine';
import type { SlotPropsMap } from '../../../engine/types';
import styles from './Spinner.module.css';

// =============================================================================
// Types
// =============================================================================

export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerVariant = 'default' | 'secondary' | 'current';

type SpinnerSlots = 'root' | 'svg' | 'circle';

export interface SpinnerProps extends React.HTMLAttributes<HTMLElement> {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<SpinnerSlots>;
}

// =============================================================================
// Spinner
// =============================================================================

export const Spinner = withMoveComponent<SpinnerSlots, SpinnerProps, HTMLDivElement>({
  name: 'Spinner',
  styles,
  slots: ['root', 'svg', 'circle'] as const,
  defaults: { size: 'md' as SpinnerSize, strokeWidth: 3, variant: 'default' as SpinnerVariant },
  moveProps: ['size', 'strokeWidth', 'variant'],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        const svgSp = sp('svg');
        const { className: svgSpClass, style: svgSpStyle, ...svgSpRest } = svgSp as Record<string, unknown>;

        const circleSp = sp('circle');
        const { className: circleSpClass, style: circleSpStyle, ...circleSpRest } = circleSp as Record<string, unknown>;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            role="progressbar"
            aria-busy
            className={cx('root', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            data-size={props.size as string}
            data-variant={props.variant as string}
          >
            <svg
              {...(svgSpRest as React.SVGAttributes<SVGSVGElement>)}
              className={cx('svg', svgSpClass as string | undefined)}
              style={svgSpStyle as React.CSSProperties}
              viewBox="25 25 50 50"
            >
              <circle
                {...(circleSpRest as React.SVGAttributes<SVGCircleElement>)}
                className={cx('circle', circleSpClass as string | undefined)}
                style={circleSpStyle as React.CSSProperties}
                cx="50"
                cy="50"
                r="20"
                fill="none"
                strokeWidth={props.strokeWidth as number}
                strokeMiterlimit="10"
              />
            </svg>
          </div>
        );
      },
    };
  },
});
