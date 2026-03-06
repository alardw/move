'use client';
// Generated from Heading.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { withMoveComponent } from '../../../engine';
import styles from './Heading.module.css';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
export type HeadingWeight = 'medium' | 'semibold' | 'bold';
export type HeadingColor = 'base' | 'muted' | 'subtle';
export type HeadingTracking = 'tight' | 'normal';
export type HeadingAlign = 'left' | 'center' | 'right';

const levelToSize: Record<HeadingLevel, HeadingSize> = {
  1: '4xl',
  2: '3xl',
  3: '2xl',
  4: 'xl',
  5: 'lg',
  6: 'base',
};

export interface HeadingProps extends Record<string, unknown> {
  level?: HeadingLevel;
  size?: HeadingSize;
  weight?: HeadingWeight;
  color?: HeadingColor;
  tracking?: HeadingTracking;
  align?: HeadingAlign;
  truncate?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const Heading = withMoveComponent<'root', HeadingProps, HTMLHeadingElement>({
  name: 'Heading',
  styles,
  slots: ['root'] as const,
  defaults: { level: 2 as HeadingLevel, weight: 'bold' as HeadingWeight, color: 'base' as HeadingColor, tracking: 'tight' as HeadingTracking },
  moveProps: ['size', 'align', 'truncate'],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        const level = props.level || 2;
        const resolvedSize = props.size || levelToSize[level as HeadingLevel];
        const Comp = `h${level}` as React.ElementType;

        return (
          <Comp
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('root', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            data-size={resolvedSize}
            data-weight={props.weight}
            data-color={props.color}
            data-tracking={props.tracking}
            {...(props.align ? { 'data-align': props.align } : {})}
            {...(props.truncate ? { 'data-truncate': '' } : {})}
          >
            {props.children}
          </Comp>
        );
      },
    };
  },
});
