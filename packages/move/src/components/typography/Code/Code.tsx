'use client';
// Generated from Code.spec.ts
import React from 'react';
import { withMoveComponent, useMergedRef } from '../../../engine';
import { useCodeHighlighter } from './CodeHighlighter';
import type { TypographySize, Truncate } from '../../../shared/types';
import { resolveTruncate } from '../../../shared/truncate';
import { useTruncationTooltip } from '../../overlays/Tooltip';
import styles from './Code.module.css';

export type CodeVariant = 'subtle' | 'outline' | 'ghost';
/** Re-exported for backwards-compatible imports. Prefer
 *  `TypographySize` from `'move'` directly going forward. */
export type CodeSize = TypographySize;

export interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  variant?: CodeVariant;
  size?: CodeSize;
  block?: boolean;
  /** Language for syntax highlighting (requires CodeHighlighterProvider) */
  language?: string;
  /** Truncate overflowing inline code: `true`/`'end'`, `'start'`, or `'clamp'`.
   *  Ignored for `block` code (a scrolling code block, not a single line). */
  truncate?: Truncate;
  /** Max lines for `truncate="clamp"` (default 2). */
  lines?: number;
  /** With `truncate`, show the full inline code in a tooltip when it's cut off. */
  tooltip?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const Code = withMoveComponent<'root', CodeProps, HTMLElement>({
  name: 'Code',
  styles,
  slots: ['root'] as const,
  defaults: { variant: 'subtle' as CodeVariant, size: 'sm' as CodeSize },
  moveProps: ['block', 'language', 'truncate', 'lines', 'tooltip'],

  setup({ props, ref, cx, sp, attrs }) {
    const ctx = useCodeHighlighter();
    const [highlighted, setHighlighted] = React.useState<React.ReactNode | null>(null);

    const code = typeof props.children === 'string' ? props.children : null;
    const language = props.language as string | undefined;

    // Tooltip only for inline code with a plain-string value.
    const wantTooltip = !!props.tooltip && !!props.truncate && !props.block && code !== null;
    const { ref: truncRef, wrap } = useTruncationTooltip(wantTooltip, code ?? undefined);
    const mergedRef = useMergedRef<HTMLElement>(ref, truncRef);

    React.useEffect(() => {
      if (!ctx?.highlighter || !code || !language) {
        setHighlighted(null);
        return;
      }

      const result = ctx.highlighter(code, language);

      if (result instanceof Promise) {
        let cancelled = false;
        result.then((r) => {
          if (!cancelled) setHighlighted(r);
        });
        return () => {
          cancelled = true;
        };
      }

      setHighlighted(result);
    }, [ctx, code, language]);

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        const isBlock = !!props.block;
        const content =
          highlighted != null ? (
            typeof highlighted === 'string' ? (
              <code dangerouslySetInnerHTML={{ __html: highlighted }} />
            ) : (
              <code>{highlighted}</code>
            )
          ) : (
            <code>{props.children}</code>
          );

        if (isBlock) {
          return (
            <pre
              {...attrs}
              {...spRest}
              ref={ref as React.Ref<HTMLPreElement>}
              className={cx('root', props.className, spClass as string | undefined)}
              style={{
                ...(props.style as React.CSSProperties),
                ...(spStyle as React.CSSProperties),
              }}
              data-variant={props.variant as string}
              data-size={props.size as string}
              data-block=""
              data-language={language}
            >
              {content}
            </pre>
          );
        }

        const inlineContent = highlighted != null ? highlighted : props.children;
        const trunc = resolveTruncate(
          props.truncate as Truncate | undefined,
          props.lines as number,
          inlineContent,
        );
        return wrap(
          <code
            {...attrs}
            {...spRest}
            ref={mergedRef}
            className={cx('root', props.className, spClass as string | undefined)}
            style={{
              ...(props.style as React.CSSProperties),
              ...(spStyle as React.CSSProperties),
              ...trunc.style,
            }}
            data-variant={props.variant as string}
            data-size={props.size as string}
            data-language={language}
            {...(trunc.mode ? { 'data-truncate': trunc.mode } : {})}
          >
            {trunc.content}
          </code>,
        );
      },
    };
  },
});
