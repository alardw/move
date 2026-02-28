'use client';

import React from 'react';
import { withMoveComponent } from '../../../engine';
import { useCodeHighlighter } from './CodeHighlighter';
import styles from './Code.module.css';

export type CodeVariant = 'subtle' | 'outline' | 'ghost';
export type CodeSize = 'xs' | 'sm' | 'base' | 'lg';

export interface CodeProps extends Record<string, unknown> {
  variant?: CodeVariant;
  size?: CodeSize;
  block?: boolean;
  /** Language for syntax highlighting (requires CodeHighlighterProvider) */
  language?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const Code = withMoveComponent<'root', CodeProps, HTMLElement>({
  name: 'Code',
  styles,
  slots: ['root'] as const,
  defaults: { variant: 'subtle', size: 'sm' },
  moveProps: ['variant', 'size', 'block', 'language'],

  setup({ props, ref, cx, sp, attrs }) {
    const ctx = useCodeHighlighter();
    const [highlighted, setHighlighted] = React.useState<React.ReactNode | null>(null);

    const code = typeof props.children === 'string' ? props.children : null;
    const language = props.language as string | undefined;

    React.useEffect(() => {
      if (!ctx?.highlighter || !code || !language) {
        setHighlighted(null);
        return;
      }

      const result = ctx.highlighter(code, language);

      if (result instanceof Promise) {
        let cancelled = false;
        result.then((r) => { if (!cancelled) setHighlighted(r); });
        return () => { cancelled = true; };
      }

      setHighlighted(result);
    }, [ctx, code, language]);

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        const isBlock = !!props.block;

        if (isBlock) {
          const content = highlighted != null
            ? typeof highlighted === 'string'
              ? <code dangerouslySetInnerHTML={{ __html: highlighted }} />
              : <code>{highlighted}</code>
            : <code>{props.children}</code>;

          return (
            <pre
              {...attrs}
              {...spRest}
              ref={ref as React.Ref<HTMLPreElement>}
              className={cx('root', props.className, spClass as string | undefined)}
              style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
              data-variant={props.variant}
              data-size={props.size}
              data-block=""
              data-language={language}
            >
              {content}
            </pre>
          );
        }

        return (
          <code
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('root', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            data-variant={props.variant}
            data-size={props.size}
          >
            {props.children}
          </code>
        );
      },
    };
  },
});
