import { useState } from 'react';
import { Stack, Text, Button, Icon, Heading, AnimatedText } from 'move';

const granularities = ['character', 'word', 'line'] as const;

// Explicit line breaks (rendered via white-space: pre-line) give the `line`
// split deterministic lines to stagger, instead of relying on wrapping width.
const TEXT = `Motion should feel intentional.
Never decorative.
Every stagger earns its place.`;

export default function GranularitySample() {
  const [play, setPlay] = useState(0);
  return (
    <Stack gap="lg" align="start">
      <Text size="sm" color="muted">
        `by` controls what gets staggered — note how `line` reveals each line in turn.
      </Text>
      <Button size="sm" variant="primary" onClick={() => setPlay((n) => n + 1)}>
        <Icon name="play" /> Replay
      </Button>
      {granularities.map((by) => (
        <Stack key={by} gap="xs">
          <Text size="xs" color="subtle">
            by="{by}"
          </Text>
          <AnimatedText
            key={`${by}-${play}`}
            asChild
            by={by}
            effect="slideUp"
            trigger="inView"
            // recipe-purity-ignore: white-space: pre-line honours the explicit line breaks; no Move prop expresses it
            style={{ whiteSpace: 'pre-line' }}
          >
            <Heading level={3}>{TEXT}</Heading>
          </AnimatedText>
        </Stack>
      ))}
    </Stack>
  );
}
