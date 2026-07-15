import { useRef, useState } from 'react';
import { Card, Stack, ToggleGroup, Text, useMorphHeight } from 'move';
import { CodeBlock } from '../CodeBlock';
import styles from './Preview.module.css';

export interface PreviewProps {
  /** Optional label shown above the card, unadorned, left-aligned. */
  title?: string;
  /** Source code shown when the user toggles to the Code view. */
  code: string;
  /** The live demo rendered when the view is set to Preview (default). */
  children: React.ReactNode;
}

/**
 * Live demo with a sample label above the card and a header row containing the
 * Preview/Code toggle. Copy-to-clipboard lives on the CodeBlock itself (shown
 * in the Code view), so there's a single, unambiguous copy affordance.
 */
export function Preview({ title, code, children }: PreviewProps) {
  const [view, setView] = useState<'preview' | 'code'>('preview');

  const bodyRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useMorphHeight({ key: view, containerRef: bodyRef, innerRef });

  return (
    <Stack gap="sm">
      {title && <Text weight="medium">{title}</Text>}
      <Card.Root className={styles.root}>
        <Card.Header className={styles.header}>
          <ToggleGroup.Root
            value={view}
            onValueChange={(v: string) => { if (v) setView(v as 'preview' | 'code'); }}
            size="sm"
            variant="pills"
            aria-label="Toggle preview or code"
          >
            <ToggleGroup.Item value="preview">Preview</ToggleGroup.Item>
            <ToggleGroup.Item value="code">Code</ToggleGroup.Item>
          </ToggleGroup.Root>
        </Card.Header>
        <div ref={bodyRef} className={styles.body}>
          <div ref={innerRef} key={view} className={styles.inner}>
            {view === 'preview' ? (
              <div className={styles.live}>{children}</div>
            ) : (
              <CodeBlock code={code} flush />
            )}
          </div>
        </div>
      </Card.Root>
    </Stack>
  );
}
