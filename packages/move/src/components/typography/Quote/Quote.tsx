'use client';
// Generated from Quote.spec.ts
import React from 'react';
import { withMoveComponent } from '../../../engine';
import styles from './Quote.module.css';

export type QuoteVariant = 'block' | 'pull';

export interface QuoteProps extends React.HTMLAttributes<HTMLElement> {
  /** block = inline indented blockquote with a left accent rule; pull = larger pull-quote emphasis. */
  variant?: QuoteVariant;
  /** Italic quote text (default). Set `false` for upright. */
  italic?: boolean;
  /** Attribution content (name + optional source); rendered in a `<figcaption>`. */
  attribution?: React.ReactNode;
  /** Source URL → the `<blockquote cite>` HTML attribute. */
  cite?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const Quote = withMoveComponent<'root', QuoteProps, HTMLElement>({
  name: 'Quote',
  styles,
  slots: ['root'] as const,
  defaults: { variant: 'block' as QuoteVariant },
  moveProps: ['italic', 'attribution', 'cite'],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        const variant = props.variant as string;
        const cite = props.cite as string | undefined;
        const attribution = props.attribution as React.ReactNode;
        const hasAttribution = attribution != null && attribution !== false;
        // Italic by default; only mark the override.
        const italicAttr = props.italic === false ? { 'data-italic': 'false' } : {};

        // Attributed → <figure> is the root, wrapping <blockquote> + <figcaption>.
        if (hasAttribution) {
          return (
            <figure
              {...attrs}
              {...spRest}
              ref={ref as React.Ref<HTMLElement>}
              className={cx('root', props.className, spClass as string | undefined)}
              style={{
                ...(props.style as React.CSSProperties),
                ...(spStyle as React.CSSProperties),
              }}
              data-variant={variant}
              {...italicAttr}
            >
              <blockquote className={styles.quote} cite={cite}>
                {props.children}
              </blockquote>
              <figcaption className={styles.attribution}>{attribution}</figcaption>
            </figure>
          );
        }

        // No attribution → the <blockquote> is the root (carries root + quote styles).
        return (
          <blockquote
            {...attrs}
            {...spRest}
            ref={ref as React.Ref<HTMLQuoteElement>}
            className={cx('root', styles.quote, props.className, spClass as string | undefined)}
            style={{
              ...(props.style as React.CSSProperties),
              ...(spStyle as React.CSSProperties),
            }}
            cite={cite}
            data-variant={variant}
            {...italicAttr}
          >
            {props.children}
          </blockquote>
        );
      },
    };
  },
});
