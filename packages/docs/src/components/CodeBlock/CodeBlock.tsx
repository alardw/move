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
  const { theme } = useTheme();
  const shikiTheme = theme.name === 'dark' ? 'github-dark' : 'github-light';

  React.useEffect(() => {
    let cancelled = false;
    codeToHtml(code, { lang: language, theme: shikiTheme })
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
        <div className={styles.body} dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <pre className={styles.fallback}>
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
