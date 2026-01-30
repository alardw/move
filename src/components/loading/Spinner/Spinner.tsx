'use client';

import { withMoveComponent } from '../../../engine';
import styles from './Spinner.module.css';

// =============================================================================
// Spinner
// =============================================================================

export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps extends Record<string, unknown> {
  size?: SpinnerSize;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Spinner = withMoveComponent<'root' | 'svg' | 'circle', SpinnerProps, HTMLDivElement>({
  name: 'Spinner',
  styles,
  slots: ['root', 'svg', 'circle'] as const,
  defaults: { size: 'md', strokeWidth: 3 },
  moveProps: ['size', 'strokeWidth'],

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const rootPt = ptm('root');
        const { className: ptClass, style: ptStyle, ...ptRest } = rootPt as Record<string, unknown>;
        const svgPt = ptm('svg');
        const { className: svgPtClass, style: svgPtStyle, ...svgPtRest } = svgPt as Record<string, unknown>;
        const circlePt = ptm('circle');
        const { className: circlePtClass, style: circlePtStyle, ...circlePtRest } = circlePt as Record<string, unknown>;

        return (
          <div
            {...attrs}
            {...ptRest}
            ref={ref}
            role="progressbar"
            aria-busy
            className={cx('root', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
            data-size={props.size}
          >
            <svg
              {...(svgPtRest as React.SVGAttributes<SVGSVGElement>)}
              className={cx('svg', svgPtClass as string | undefined)}
              style={svgPtStyle as React.CSSProperties}
              viewBox="25 25 50 50"
            >
              <circle
                {...(circlePtRest as React.SVGAttributes<SVGCircleElement>)}
                className={cx('circle', circlePtClass as string | undefined)}
                style={circlePtStyle as React.CSSProperties}
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
