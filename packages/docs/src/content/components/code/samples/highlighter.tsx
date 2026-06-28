import { Code, CodeHighlighterProvider, Stack, Text } from 'move';

const KEYWORDS = new Set(['import', 'from', 'export', 'const', 'function', 'return', 'if', 'else', 'true', 'false']);

/**
 * Tiny pretend-highlighter to demonstrate the contract — wraps keywords
 * in a span tinted with the indigo palette. In a real app, swap for
 * Shiki, Prism, highlight.js, or whatever your build can afford.
 */
const highlighter = (code: string) => {
  const parts = code.split(/(\s+|[(){}[\];,])/);
  return (
    <>
      {parts.map((p, i) =>
        KEYWORDS.has(p)
          // recipe-purity-ignore: coloured token output is the whole point of a syntax highlighter; no Move primitive
          ? <span key={i} style={{ color: 'var(--move-indigo-400)', fontWeight: 600 }}>{p}</span>
          : p
      )}
    </>
  );
};

const snippet = `export function MoveButton({ label }) {
  if (!label) return null;
  return <button>{label}</button>;
}`;

export default function HighlighterSample() {
  return (
    <CodeHighlighterProvider highlighter={highlighter}>
      <Stack gap="md">
        <Text size="sm" color="muted">
          Wrap part of the tree in <Code>CodeHighlighterProvider</Code> with a function
          that turns code text into ReactNode (or HTML string). Every <Code>{'<Code language="...">'}</Code>{' '}
          inside picks it up.
        </Text>
        <Code block language="tsx">{snippet}</Code>
      </Stack>
    </CodeHighlighterProvider>
  );
}
