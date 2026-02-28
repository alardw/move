'use client';

import { withMoveComponent } from '../../../engine';
import type { SlotPropsMap } from '../../../engine/types';
import styles from './ScrollArea.module.css';

// ============================================================================
// Root
// ============================================================================

export interface ScrollAreaRootProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'root'>;
}

const ScrollAreaRoot = withMoveComponent<'root', ScrollAreaRootProps, HTMLDivElement>({
  name: 'ScrollAreaRoot',
  styles,
  slots: ['root'] as const,

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
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </div>
        );
      },
    };
  },
});

// ============================================================================
// Header
// ============================================================================

export interface ScrollAreaHeaderProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  /** Whether to apply padding. Default: true */
  padded?: boolean;
  sp?: SlotPropsMap<'header'>;
}

const ScrollAreaHeader = withMoveComponent<'header', ScrollAreaHeaderProps, HTMLDivElement>({
  name: 'ScrollAreaHeader',
  styles,
  slots: ['header'] as const,
  defaults: { padded: true },
  moveProps: ['padded'],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const headerSp = sp('header');
        const { className: spClass, style: spStyle, ...spRest } = headerSp as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            data-padded={props.padded}
            className={cx('header', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </div>
        );
      },
    };
  },
});

// ============================================================================
// Content
// ============================================================================

export interface ScrollAreaContentProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  /** Whether to apply padding. Default: false */
  padded?: boolean;
  sp?: SlotPropsMap<'content'>;
}

const ScrollAreaContent = withMoveComponent<'content', ScrollAreaContentProps, HTMLDivElement>({
  name: 'ScrollAreaContent',
  styles,
  slots: ['content'] as const,
  defaults: { padded: false },
  moveProps: ['padded'],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const contentSp = sp('content');
        const { className: spClass, style: spStyle, ...spRest } = contentSp as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            data-padded={props.padded}
            className={cx('content', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </div>
        );
      },
    };
  },
});

// ============================================================================
// Footer
// ============================================================================

export interface ScrollAreaFooterProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  /** Whether to apply padding. Default: true */
  padded?: boolean;
  sp?: SlotPropsMap<'footer'>;
}

const ScrollAreaFooter = withMoveComponent<'footer', ScrollAreaFooterProps, HTMLDivElement>({
  name: 'ScrollAreaFooter',
  styles,
  slots: ['footer'] as const,
  defaults: { padded: true },
  moveProps: ['padded'],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const footerSp = sp('footer');
        const { className: spClass, style: spStyle, ...spRest } = footerSp as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            data-padded={props.padded}
            className={cx('footer', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </div>
        );
      },
    };
  },
});

// ============================================================================
// Export
// ============================================================================

export const ScrollArea = {
  Root: ScrollAreaRoot,
  Header: ScrollAreaHeader,
  Content: ScrollAreaContent,
  Footer: ScrollAreaFooter,
};
