'use client';
// Generated from Card.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { withMoveComponent } from '../../../engine';
import type { SlotPropsMap } from '../../../engine/types';
import { useSurfaceFlip, SurfaceProvider } from '../../../infrastructure/Surface';
import styles from './Card.module.css';

// =============================================================================
// Types
// =============================================================================

export type CardVariant = 'default' | 'elevated' | 'ghost';
export type CardSize = 'sm' | 'md' | 'lg';

// =============================================================================
// Root
// =============================================================================

export interface CardRootProps extends Record<string, unknown> {
  variant?: CardVariant;
  size?: CardSize;
  maxWidth?: string | number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'root'>;
}

const CardRoot = withMoveComponent<'root', CardRootProps, HTMLDivElement>({
  name: 'CardRoot',
  styles,
  slots: ['root'] as const,
  defaults: { variant: 'default' as CardVariant, size: 'md' as CardSize },
  moveProps: ['variant', 'size', 'maxWidth'],

  setup({ props, ref, cx, sp, attrs }) {
    const surface = useSurfaceFlip();

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;
        const maxWidth = props.maxWidth != null
          ? typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth
          : undefined;

        return (
          <SurfaceProvider value={surface}>
            <div
              {...attrs}
              {...spRest}
              ref={ref}
              data-variant={props.variant as string}
              data-size={props.size as string}
              data-surface={surface}
              className={cx('root', props.className, spClass as string | undefined)}
              style={{ '--move-card-max-width': maxWidth, ...(props.style as React.CSSProperties), ...(spStyle as React.CSSProperties) } as React.CSSProperties}
            >
              {props.children}
            </div>
          </SurfaceProvider>
        );
      },
    };
  },
});

// =============================================================================
// Header
// =============================================================================

export interface CardHeaderProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'header'>;
}

const CardHeader = withMoveComponent<'header', CardHeaderProps, HTMLDivElement>({
  name: 'CardHeader',
  styles,
  slots: ['header'] as const,

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
            className={cx('header', props.className, spClass as string | undefined)}
            style={{ ...(props.style as React.CSSProperties), ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </div>
        );
      },
    };
  },
});

// =============================================================================
// Title
// =============================================================================

export interface CardTitleProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'title'>;
}

const CardTitle = withMoveComponent<'title', CardTitleProps, HTMLHeadingElement>({
  name: 'CardTitle',
  styles,
  slots: ['title'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const titleSp = sp('title');
        const { className: spClass, style: spStyle, ...spRest } = titleSp as Record<string, unknown>;

        return (
          <h3
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('title', props.className, spClass as string | undefined)}
            style={{ ...(props.style as React.CSSProperties), ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </h3>
        );
      },
    };
  },
});

// =============================================================================
// Description
// =============================================================================

export interface CardDescriptionProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'description'>;
}

const CardDescription = withMoveComponent<'description', CardDescriptionProps, HTMLDivElement>({
  name: 'CardDescription',
  styles,
  slots: ['description'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const descSp = sp('description');
        const { className: spClass, style: spStyle, ...spRest } = descSp as Record<string, unknown>;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('description', props.className, spClass as string | undefined)}
            style={{ ...(props.style as React.CSSProperties), ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </div>
        );
      },
    };
  },
});

// =============================================================================
// Body
// =============================================================================

export interface CardBodyProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'body'>;
}

const CardBody = withMoveComponent<'body', CardBodyProps, HTMLDivElement>({
  name: 'CardBody',
  styles,
  slots: ['body'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const bodySp = sp('body');
        const { className: spClass, style: spStyle, ...spRest } = bodySp as Record<string, unknown>;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('body', props.className, spClass as string | undefined)}
            style={{ ...(props.style as React.CSSProperties), ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </div>
        );
      },
    };
  },
});

// =============================================================================
// Footer
// =============================================================================

export interface CardFooterProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'footer'>;
}

const CardFooter = withMoveComponent<'footer', CardFooterProps, HTMLDivElement>({
  name: 'CardFooter',
  styles,
  slots: ['footer'] as const,

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
            className={cx('footer', props.className, spClass as string | undefined)}
            style={{ ...(props.style as React.CSSProperties), ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </div>
        );
      },
    };
  },
});

// =============================================================================
// FooterStart
// =============================================================================

export interface CardFooterStartProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'footerStart'>;
}

const CardFooterStart = withMoveComponent<'footerStart', CardFooterStartProps, HTMLDivElement>({
  name: 'CardFooterStart',
  styles,
  slots: ['footerStart'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const footerStartSp = sp('footerStart');
        const { className: spClass, style: spStyle, ...spRest } = footerStartSp as Record<string, unknown>;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('footerStart', props.className, spClass as string | undefined)}
            style={{ ...(props.style as React.CSSProperties), ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </div>
        );
      },
    };
  },
});

// =============================================================================
// FooterEnd
// =============================================================================

export interface CardFooterEndProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'footerEnd'>;
}

const CardFooterEnd = withMoveComponent<'footerEnd', CardFooterEndProps, HTMLDivElement>({
  name: 'CardFooterEnd',
  styles,
  slots: ['footerEnd'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const footerEndSp = sp('footerEnd');
        const { className: spClass, style: spStyle, ...spRest } = footerEndSp as Record<string, unknown>;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('footerEnd', props.className, spClass as string | undefined)}
            style={{ ...(props.style as React.CSSProperties), ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </div>
        );
      },
    };
  },
});

// =============================================================================
// Export
// =============================================================================

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
