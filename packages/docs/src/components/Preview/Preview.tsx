import { useRef, useState } from 'react';
import {
  Card,
  Stack,
  ToggleGroup,
  Tooltip,
  Button,
  Icon,
  Text,
  useMorphHeight,
} from 'move';
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
 * Live demo with a sample label above the card and a header row containing
 * the Preview/Code toggle on the left and a copy-to-clipboard button on
 * the right. The card itself carries only the frame + body.
 */
export function Preview({ title, code, children }: PreviewProps) {
  const [view, setView] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);

  const bodyRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useMorphHeight({ key: view, containerRef: bodyRef, innerRef });

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Stack gap="sm">
      {title && <Text weight="medium">{title}</Text>}
      <Card.Root className={styles.root}>
        <Card.Header className={styles.header}>
          <ToggleGroup.Root
            value={view}
            onValueChange={(v: string) => { if (v) setView(v as 'preview' | 'code'); }}
            size="sm"
            variant="secondary"
            aria-label="Toggle preview or code"
          >
            <ToggleGroup.Item value="preview">Preview</ToggleGroup.Item>
            <ToggleGroup.Item value="code">Code</ToggleGroup.Item>
          </ToggleGroup.Root>
          <Tooltip label={copied ? 'Copied' : 'Copy code'}>
            <Button
              variant="ghost"
              size="sm"
              aria-label="Copy code"
              onClick={handleCopy}
            >
              <Icon name={copied ? 'check' : 'copy'} />
            </Button>
          </Tooltip>
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
