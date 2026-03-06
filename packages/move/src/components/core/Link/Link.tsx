'use client';
// Generated from Link.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { Slot } from 'radix-ui';
import { withMoveComponent } from '../../../engine';
import styles from './Link.module.css';

export type LinkVariant = 'default' | 'muted' | 'subtle';
export type LinkUnderline = 'always' | 'hover' | 'none';
export type LinkSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl';

export interface LinkProps extends Record<string, unknown> {
  variant?: LinkVariant;
  underline?: LinkUnderline;
  size?: LinkSize;
  external?: boolean;
  asChild?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const Link = withMoveComponent<'root', LinkProps, HTMLAnchorElement>({
  name: 'Link',
  styles,
  slots: ['root'] as const,
  defaults: { variant: 'default' as LinkVariant, underline: 'hover' as LinkUnderline, asChild: false },
  moveProps: ['size', 'external'],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        const Comp = props.asChild ? Slot.Root : 'a';
        const externalProps = props.external
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {};

        return (
          <Comp
            {...attrs}
            {...externalProps}
            {...spRest}
            ref={ref}
            className={cx('root', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            data-variant={props.variant}
            data-underline={props.underline}
            {...(props.size ? { 'data-size': props.size } : {})}
          >
            {props.children}
          </Comp>
        );
      },
    };
  },
});
