import * as React from 'react';
import { codeToHtml } from 'shiki';
import styles from './InlineCode.module.css';

/** Shared cache so repeated type strings ("string", "boolean") don't hit Shiki. */
const cache = new Map<string, string>();

type TypeCategory = 'primitive' | 'union' | 'function' | 'event' | 'node' | 'identifier';

/**
 * Classify a TS type string into a broad category so the props table can
 * tint each cell. Priority matters — a function signature whose return type
 * is a union should still register as a function, etc.
 */
function classifyType(type: string): TypeCategory {
  const t = type.trim();
  if (t === 'string' || t === 'number' || t === 'boolean' || t === 'null' || t === 'undefined') {
    return 'primitive';
  }
  // String / number literals (and unions of them) are essentially a
  // constrained primitive at runtime — treat them like the underlying
  // type instead of a grab-bag union.
  const parts = t.split(/ \| /);
  if (parts.length > 0 && parts.every((p) => /^'[^']*'$/.test(p) || /^"[^"]*"$/.test(p) || /^-?\d+(\.\d+)?$/.test(p))) {
    return 'primitive';
  }
  if (/=>/.test(t)) return 'function';
  if (/\b(KeyboardEvent|MouseEvent|PointerEvent|TouchEvent|FocusEvent|ChangeEvent)\b/.test(t)) return 'event';
  if (/\b(React\.ReactNode|ReactNode|ReactElement|JSX\.Element)\b/.test(t)) return 'node';
  if (/ \| /.test(t)) return 'union';
  return 'identifier';
}

export interface InlineCodeProps {
  code: string;
  language?: string;
  /** When set, tints the pill background based on the type's shape. */
  tintByType?: boolean;
}

/**
 * Inline syntax-highlighted code — used in docs props tables so the Type
 * column reads like real source instead of a solid-colored mono blob.
 * Caches highlighted HTML by string so identical types (common in a props
 * table) don't pay for Shiki twice.
 */
export function InlineCode({ code, language = 'tsx', tintByType = false }: InlineCodeProps) {
  const [html, setHtml] = React.useState<string | null>(() => cache.get(code) ?? null);
  const category = tintByType ? classifyType(code) : undefined;

  React.useEffect(() => {
    const cached = cache.get(code);
    if (cached) {
      setHtml(cached);
      return;
    }
    let cancelled = false;
    // `tabindex: false` — Shiki's <pre> is a tab stop by default so keyboard
    // users can scroll overflowing code. These pills are inline and wrap
    // instead of scrolling, so the tab stop is pure noise in a props table.
    codeToHtml(code, { lang: language, theme: 'github-light', tabindex: false })
      .then((result) => {
        cache.set(code, result);
        if (!cancelled) setHtml(result);
      })
      .catch(() => {
        if (!cancelled) setHtml(null);
      });
    return () => {
      cancelled = true;
    };
  }, [code, language]);

  if (html) {
    return (
      <span
        className={styles.root}
        data-category={category}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
  return <span className={styles.fallback} data-category={category}>{code}</span>;
}
