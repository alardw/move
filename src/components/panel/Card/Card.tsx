'use client';

import { withMoveComponent } from '../../../engine';
import type { PassThrough } from '../../../engine/types';
import styles from './Card.module.css';

// ============================================================================
// Root
// ============================================================================

export type CardVariant = 'default' | 'elevated' | 'ghost';

export interface CardRootProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  variant?: CardVariant;
  pt?: PassThrough<'root'>;
}

const CardRoot = withMoveComponent<'root', CardRootProps, HTMLDivElement>({
  name: 'CardRoot',
  styles,
  slots: ['root'] as const,
  defaults: { variant: 'default' },
  moveProps: ['variant'],

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
            data-variant={props.variant}
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

export interface CardHeaderProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  pt?: PassThrough<'header'>;
}

const CardHeader = withMoveComponent<'header', CardHeaderProps, HTMLDivElement>({
  name: 'CardHeader',
  styles,
  slots: ['header'] as const,

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
// Title
// ============================================================================

export interface CardTitleProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  pt?: PassThrough<'title'>;
}

const CardTitle = withMoveComponent<'title', CardTitleProps, HTMLHeadingElement>({
  name: 'CardTitle',
  styles,
  slots: ['title'] as const,

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const titlePt = ptm('title');
        const { className: ptClass, style: ptStyle, ...ptRest } = titlePt as Record<string, unknown>;
        return (
          <h3
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('title', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
          >
            {props.children}
          </h3>
        );
      },
    };
  },
});

// ============================================================================
// Description
// ============================================================================

export interface CardDescriptionProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  pt?: PassThrough<'description'>;
}

const CardDescription = withMoveComponent<'description', CardDescriptionProps, HTMLParagraphElement>({
  name: 'CardDescription',
  styles,
  slots: ['description'] as const,

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const descPt = ptm('description');
        const { className: ptClass, style: ptStyle, ...ptRest } = descPt as Record<string, unknown>;
        return (
          <p
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('description', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
          >
            {props.children}
          </p>
        );
      },
    };
  },
});

// ============================================================================
// Body
// ============================================================================

export interface CardBodyProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  pt?: PassThrough<'body'>;
}

const CardBody = withMoveComponent<'body', CardBodyProps, HTMLDivElement>({
  name: 'CardBody',
  styles,
  slots: ['body'] as const,

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const bodyPt = ptm('body');
        const { className: ptClass, style: ptStyle, ...ptRest } = bodyPt as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('body', props.className, ptClass as string | undefined)}
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

export interface CardFooterProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  pt?: PassThrough<'footer'>;
}

const CardFooter = withMoveComponent<'footer', CardFooterProps, HTMLDivElement>({
  name: 'CardFooter',
  styles,
  slots: ['footer'] as const,

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
// FooterStart
// ============================================================================

export interface CardFooterStartProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  pt?: PassThrough<'footerStart'>;
}

const CardFooterStart = withMoveComponent<'footerStart', CardFooterStartProps, HTMLDivElement>({
  name: 'CardFooterStart',
  styles,
  slots: ['footerStart'] as const,

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const pt = ptm('footerStart');
        const { className: ptClass, style: ptStyle, ...ptRest } = pt as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('footerStart', props.className, ptClass as string | undefined)}
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
// FooterEnd
// ============================================================================

export interface CardFooterEndProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  pt?: PassThrough<'footerEnd'>;
}

const CardFooterEnd = withMoveComponent<'footerEnd', CardFooterEndProps, HTMLDivElement>({
  name: 'CardFooterEnd',
  styles,
  slots: ['footerEnd'] as const,

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const pt = ptm('footerEnd');
        const { className: ptClass, style: ptStyle, ...ptRest } = pt as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('footerEnd', props.className, ptClass as string | undefined)}
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

export const Card = {
  Root: CardRoot,
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Body: CardBody,
  Footer: CardFooter,
  FooterStart: CardFooterStart,
  FooterEnd: CardFooterEnd,
};
