'use client';

import * as React from 'react';
import { animate } from 'animejs';
import { withMoveComponent } from '../../../engine';
import { prefersReducedMotion } from '../../../animation';
import styles from './Loader.module.css';

// =============================================================================
// Types
// =============================================================================

export type LoaderVariant = 'spinner' | 'dots';
export type LoaderColor = 'primary' | 'secondary' | 'current';
export type LoaderSize = 'sm' | 'md' | 'lg';

export interface LoaderProps extends Record<string, unknown> {
  variant?: LoaderVariant;
  color?: LoaderColor;
  size?: LoaderSize;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}

// =============================================================================
// Loader
// =============================================================================

export const Loader = withMoveComponent<
  'root' | 'svg' | 'circle' | 'dot',
  LoaderProps,
  HTMLDivElement
>({
  name: 'Loader',
  styles,
  slots: ['root', 'svg', 'circle', 'dot'] as const,
  defaults: { variant: 'spinner', color: 'primary', size: 'md', strokeWidth: 3 },
  moveProps: ['variant', 'color', 'size', 'strokeWidth'],

  setup({ props, ref, cx, sp, attrs }) {
    const svgRef = React.useRef<SVGSVGElement | null>(null);
    const circleRef = React.useRef<SVGCircleElement | null>(null);
    const dotsRef = React.useRef<(HTMLSpanElement | null)[]>([]);

    // Spinner: anime.js rotation + stroke-dash animation
    React.useEffect(() => {
      if (props.variant !== 'spinner') return;

      const svg = svgRef.current;
      const circle = circleRef.current;
      if (!svg || !circle) return;

      if (prefersReducedMotion()) {
        circle.style.strokeDasharray = '89, 200';
        return;
      }

      const rotateAnim = animate(svg, {
        rotate: [0, 360],
        duration: 2000,
        ease: 'linear',
        loop: true,
      });

      const proxy = { len: 1, offset: 0 };
      const dashAnim = animate(proxy, {
        keyframes: [
          { len: 1, offset: 0 },
          { len: 89, offset: -35 },
          { len: 89, offset: -124 },
        ],
        duration: 1500,
        ease: 'inOutQuad',
        loop: true,
        onRender: () => {
          circle.style.strokeDasharray = `${proxy.len}, 200`;
          circle.style.strokeDashoffset = `${proxy.offset}`;
        },
      });

      return () => {
        rotateAnim.pause();
        dashAnim.pause();
      };
    }, [props.variant]);

    // Dots: bouncing dots with shadows
    React.useEffect(() => {
      if (props.variant !== 'dots' || prefersReducedMotion()) return;

      const dots = dotsRef.current.filter(Boolean) as HTMLSpanElement[];
      if (dots.length === 0) return;

      const travelMap: Record<string, number> = { sm: 14, md: 22, lg: 32 };
      const travel = travelMap[(props.size as string) || 'md'] ?? 22;
      const delays = [0, 200, 300];
      const anims: ReturnType<typeof animate>[] = [];

      for (let i = 0; i < 3; i++) {
        const dot = dots[i];

        // Single progress value 0→1 with custom mapping:
        // - Squish resolves quickly in the first 30% of the animation
        // - Vertical bounce spans the full duration
        // - out(2) easing = fast off the ground, slow at the top (natural gravity)
        const dp = { t: 0 };
        anims.push(animate(dp, {
          t: [0, 1],
          duration: 500,
          delay: delays[i],
          alternate: true,
          loop: true,
          ease: 'out(2)',
          onRender: () => {
            const t = dp.t;
            const squish = Math.min(t / 0.3, 1);
            const sx = 1.3 - 0.3 * squish;
            const sy = 0.6 + 0.4 * squish;
            dot.style.transform = `translateY(${-travel * t}px) scaleX(${sx}) scaleY(${sy})`;
          },
        }));
      }

      return () => {
        anims.forEach((a) => a.pause());
      };
    }, [props.variant, props.size]);

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        if (props.variant === 'dots') {
          const dotSp = sp('dot');
          const { className: dotSpClass, style: dotSpStyle, ...dotSpRest } = dotSp as Record<string, unknown>;

          return (
            <div
              {...attrs}
              {...spRest}
              ref={ref}
              role="progressbar"
              aria-busy
              aria-label="Loading"
              className={cx('root', props.className, spClass as string | undefined)}
              style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
              data-variant="dots"
              data-color={props.color}
              data-size={props.size}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={`dot-${i}`}
                  {...dotSpRest}
                  ref={(el) => { dotsRef.current[i] = el; }}
                  className={cx('dot', dotSpClass as string | undefined)}
                  style={dotSpStyle as React.CSSProperties}
                />
              ))}
            </div>
          );
        }

        // Spinner variant
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
            data-variant="spinner"
            data-color={props.color}
            data-size={props.size}
          >
            <svg
              {...(svgSpRest as React.SVGAttributes<SVGSVGElement>)}
              ref={svgRef}
              className={cx('svg', svgSpClass as string | undefined)}
              style={svgSpStyle as React.CSSProperties}
              viewBox="25 25 50 50"
            >
              <circle
                {...(circleSpRest as React.SVGAttributes<SVGCircleElement>)}
                ref={circleRef}
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
