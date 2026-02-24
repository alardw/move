'use client';

import { withMoveComponent } from '../../../engine';
import type { PassThrough } from '../../../engine/types';
import styles from './ScrollArea.module.css';

// ============================================================================
// Root
// ============================================================================

export interface ScrollAreaRootProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  pt?: PassThrough<'root'>;
}

const ScrollAreaRoot = withMoveComponent<'root', ScrollAreaRootProps, HTMLDivElement>({
  name: 'ScrollAreaRoot',
  styles,
  slots: ['root'] as const,

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const rootPt = ptm('root');
        const { className: ptClass, style: ptStyle, ...ptRest } = rootPt as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('root', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
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
  pt?: PassThrough<'header'>;
}

const ScrollAreaHeader = withMoveComponent<'header', ScrollAreaHeaderProps, HTMLDivElement>({
  name: 'ScrollAreaHeader',
  styles,
  slots: ['header'] as const,
  defaults: { padded: true },
  moveProps: ['padded'],

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const headerPt = ptm('header');
        const { className: ptClass, style: ptStyle, ...ptRest } = headerPt as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...ptRest}
            ref={ref}
            data-padded={props.padded}
            className={cx('header', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
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
  pt?: PassThrough<'content'>;
}

const ScrollAreaContent = withMoveComponent<'content', ScrollAreaContentProps, HTMLDivElement>({
  name: 'ScrollAreaContent',
  styles,
  slots: ['content'] as const,
  defaults: { padded: false },
  moveProps: ['padded'],

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const contentPt = ptm('content');
        const { className: ptClass, style: ptStyle, ...ptRest } = contentPt as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...ptRest}
            ref={ref}
            data-padded={props.padded}
            className={cx('content', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
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
  pt?: PassThrough<'footer'>;
}

const ScrollAreaFooter = withMoveComponent<'footer', ScrollAreaFooterProps, HTMLDivElement>({
  name: 'ScrollAreaFooter',
  styles,
  slots: ['footer'] as const,
  defaults: { padded: true },
  moveProps: ['padded'],

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const footerPt = ptm('footer');
        const { className: ptClass, style: ptStyle, ...ptRest } = footerPt as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...ptRest}
            ref={ref}
            data-padded={props.padded}
            className={cx('footer', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
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
