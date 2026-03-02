'use client';
// Generated from Align.spec.ts (schemaVersion: 6, specHash: 6cbf8097)
import { withMoveComponent } from '../../../engine';
import styles from './Align.module.css';

export type AlignGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none';
export type AlignVertical = 'start' | 'center' | 'end' | 'stretch' | 'baseline';

export interface AlignProps extends Record<string, unknown> {
  gap?: AlignGap;
  align?: AlignVertical;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export interface AlignSectionProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const AlignRoot = withMoveComponent<'root', AlignProps, HTMLDivElement>({
  name: 'Align',
  styles,
  slots: ['root'] as const,
  defaults: { gap: 'md' as AlignGap, align: 'center' as AlignVertical },
  moveProps: [],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('root', props.className, spClass as string | undefined)}
            style={{ ...(props.style as React.CSSProperties), ...(spStyle as React.CSSProperties) }}
            data-gap={props.gap as string}
            data-align={props.align as string}
          >
            {props.children}
          </div>
        );
      },
    };
  },
});

const AlignStart = withMoveComponent<'start', AlignSectionProps, HTMLDivElement>({
  name: 'AlignStart',
  styles,
  slots: ['start'] as const,
  moveProps: [],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const startSp = sp('start');
        const { className: spClass, style: spStyle, ...spRest } = startSp as Record<string, unknown>;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('start', props.className, spClass as string | undefined)}
            style={{ ...(props.style as React.CSSProperties), ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </div>
        );
      },
    };
  },
});

const AlignCenter = withMoveComponent<'center', AlignSectionProps, HTMLDivElement>({
  name: 'AlignCenter',
  styles,
  slots: ['center'] as const,
  moveProps: [],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const centerSp = sp('center');
        const { className: spClass, style: spStyle, ...spRest } = centerSp as Record<string, unknown>;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('center', props.className, spClass as string | undefined)}
            style={{ ...(props.style as React.CSSProperties), ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </div>
        );
      },
    };
  },
});

const AlignEnd = withMoveComponent<'end', AlignSectionProps, HTMLDivElement>({
  name: 'AlignEnd',
  styles,
  slots: ['end'] as const,
  moveProps: [],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const endSp = sp('end');
        const { className: spClass, style: spStyle, ...spRest } = endSp as Record<string, unknown>;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('end', props.className, spClass as string | undefined)}
            style={{ ...(props.style as React.CSSProperties), ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </div>
        );
      },
    };
  },
});

export const Align = Object.assign(AlignRoot, {
  Start: AlignStart,
  Center: AlignCenter,
  End: AlignEnd,
});
