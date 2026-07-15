'use client';
// Generated from Code.spec.ts
import * as React from 'react';

export type HighlightResult = React.ReactNode | string;

export type CodeHighlighterFn = (
  code: string,
  language: string,
) => HighlightResult | Promise<HighlightResult>;

export interface CodeHighlighterProviderProps {
  children: React.ReactNode;
  /**
   * Function that highlights code and returns styled React nodes or an HTML string.
   * You create this based on your syntax highlighting library of choice.
   *
   * @example
   * ```tsx
   * // With Shiki
   * import { codeToHtml } from 'shiki';
   * const highlighter = (code, lang) => codeToHtml(code, { lang, theme: 'nord' });
   *
   * // With Prism (synchronous)
   * import Prism from 'prismjs';
   * const highlighter = (code, lang) => Prism.highlight(code, Prism.languages[lang], lang);
   * ```
   */
  highlighter: CodeHighlighterFn;
}

interface CodeHighlighterContextValue {
  highlighter: CodeHighlighterFn;
}

const CodeHighlighterContext = React.createContext<CodeHighlighterContextValue | null>(null);

export function useCodeHighlighter() {
  return React.useContext(CodeHighlighterContext);
}

/**
 * Provider that supplies a syntax highlighter to all Code components in the tree.
 *
 * The highlighter is a simple function you write -- move doesn't know or care
 * which syntax highlighting library you use.
 *
 * @example
 * ```tsx
 * // Shiki
 * import { codeToHtml } from 'shiki';
 *
 * <CodeHighlighterProvider highlighter={(code, lang) => codeToHtml(code, { lang, theme: 'nord' })}>
 *   <Code block language="tsx">{myCode}</Code>
 * </CodeHighlighterProvider>
 * ```
 */
export function CodeHighlighterProvider({ children, highlighter }: CodeHighlighterProviderProps) {
  const value = React.useMemo(() => ({ highlighter }), [highlighter]);

  return (
    <CodeHighlighterContext.Provider value={value}>{children}</CodeHighlighterContext.Provider>
  );
}

CodeHighlighterProvider.displayName = 'CodeHighlighterProvider';
