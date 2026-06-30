import { useState, type ReactNode } from 'react';
import { Stack, Text, Button, Icon } from 'move';

/**
 * A live, interactive component dropped straight into the prose — no code
 * toggle, no card chrome — so the reader can feel the motion by using it.
 * `label` heads the demo (often a pattern or trigger name), `blurb` says what
 * to do to trigger the animation, and `block` stretches block-level
 * components like Accordion or Tabs to full width. `replay` adds a button that
 * remounts the demo, so a one-shot on-mount animation can be watched again.
 */
export function InlineDemo({
  label,
  blurb,
  block,
  replay,
  children,
}: {
  label?: ReactNode;
  blurb?: string;
  block?: boolean;
  replay?: boolean;
  children: ReactNode;
}) {
  const [runId, setRunId] = useState(0);
  return (
    <Stack gap="sm">
      {(label || blurb || replay) && (
        <Stack direction="row" justify="between" align="end" gap="sm">
          <Stack gap="xs">
            {label && <Text weight="medium">{label}</Text>}
            {blurb && <Text color="muted" size="sm">{blurb}</Text>}
          </Stack>
          {replay && (
            <Button variant="ghost" size="sm" onClick={() => setRunId((n) => n + 1)}>
              <Icon name="rotate-ccw" />
              Replay
            </Button>
          )}
        </Stack>
      )}
      <Stack key={runId} align={block ? 'stretch' : 'start'} padding="md">
        {children}
      </Stack>
    </Stack>
  );
}
