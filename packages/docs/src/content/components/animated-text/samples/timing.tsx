import { useState } from 'react';
import { Stack, Text, Button, Icon, Heading, AnimatedText } from 'move';

const presets = [
  { label: 'snappy — stagger=15 duration=350', stagger: 15, duration: 350 },
  { label: 'default', stagger: undefined, duration: undefined },
  { label: 'languid — stagger=90 duration=900', stagger: 90, duration: 900 },
] as const;

export default function TimingSample() {
  const [play, setPlay] = useState(0);
  return (
    <Stack gap="lg" align="start">
      <Text size="sm" color="muted">
        `stagger` (ms between segments) and `duration` shape the feel.
      </Text>
      <Button size="sm" variant="primary" onClick={() => setPlay((n) => n + 1)}>
        <Icon name="play" /> Replay
      </Button>
      {presets.map((p) => (
        <Stack key={p.label} gap="xs">
          <Text size="xs" color="subtle">
            {p.label}
          </Text>
          <AnimatedText
            key={`${p.label}-${play}`}
            asChild
            by="word"
            effect="fade"
            trigger="inView"
            stagger={p.stagger}
            duration={p.duration}
          >
            <Heading level={3}>Timing is everything in motion</Heading>
          </AnimatedText>
        </Stack>
      ))}
    </Stack>
  );
}
