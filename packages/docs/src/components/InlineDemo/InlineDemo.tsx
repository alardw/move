import type { ReactNode } from 'react';
import { Stack, Text } from 'move';

/**
 * A live, interactive component dropped straight into the prose — no code
 * toggle, no card chrome — so the reader can feel the motion by using it.
 * `label` heads the demo (often a pattern or trigger name), `blurb` says what
 * to do to trigger the animation, and `block` stretches block-level
 * components like Accordion or Tabs to full width.
 */
export function InlineDemo({
  label,
  blurb,
  block,
  children,
}: {
  label?: ReactNode;
  blurb?: string;
  block?: boolean;
  children: ReactNode;
}) {
  return (
    <Stack gap="sm">
      {(label || blurb) && (
        <Stack gap="xs">
          {label && <Text weight="medium">{label}</Text>}
          {blurb && <Text color="muted" size="sm">{blurb}</Text>}
        </Stack>
      )}
      <Stack align={block ? 'stretch' : 'start'} padding="md">
        {children}
      </Stack>
    </Stack>
  );
}
