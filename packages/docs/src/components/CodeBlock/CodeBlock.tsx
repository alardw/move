import * as React from 'react';
import { codeToHtml } from 'shiki';
import { Button, Icon, useTheme } from 'move';
import styles from './CodeBlock.module.css';

export interface CodeBlockProps {
  code: string;
  language?: string;
  /** When true, removes the outer border and radius (use when nested in another container like Preview). */
  flush?: boolean;
}

export function CodeBlock({ code, language = 'tsx', flush = false }: CodeBlockProps) {
  const [html, setHtml] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [scrollable, setScrollable] = React.useState(false);
  const scrollRef = React.useRef<HTMLElement | null>(null);
  const { theme } = useTheme();
  const shikiTheme = theme.name === 'dark' ? 'github-dark' : 'github-light';

  React.useEffect(() => {
    let cancelled = false;
    // `tabindex: false` — Shiki puts tabindex="0" on its own <pre> so keyboard
    // users can scroll overflowing code. That tab stop belongs on our scroll
    // container, and only when the code actually overflows (see below).
    codeToHtml(code, { lang: language, theme: shikiTheme, tabindex: false })
      .then((result) => {
        if (!cancelled) setHtml(result);
      })
      .catch(() => {
        if (!cancelled) setHtml(null);
      });
    return () => {
      cancelled = true;
    };
  }, [code, language, shikiTheme]);

  // A scrollable region has to be keyboard-reachable (WCAG 2.1.1), so the tab
  // stop follows the overflow: a sample that fits stays out of the tab order.
  // Re-measured on container resize and whenever the rendered code changes.
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // +1 absorbs sub-pixel rounding, which otherwise reads as overflow.
    const measure = () => setScrollable(el.scrollWidth > el.clientWidth + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [html, code]);

  const scrollProps = scrollable
    ? { tabIndex: 0, role: 'region', 'aria-label': `${language} code sample` }
    : {};

  const handleCopy = React.useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    });
  }, [code]);

  return (
    <div className={styles.root} data-flush={flush || undefined}>
      <div className={styles.copy}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          aria-label={copied ? 'Copied' : 'Copy code'}
        >
          <Icon name={copied ? 'check' : 'copy'} />
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      {html ? (
        <div
          ref={scrollRef as React.Ref<HTMLDivElement>}
          className={styles.body}
          {...scrollProps}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre
          ref={scrollRef as React.Ref<HTMLPreElement>}
          className={styles.fallback}
          {...scrollProps}
        >
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
