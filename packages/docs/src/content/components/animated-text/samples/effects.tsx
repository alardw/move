import { useState } from 'react';
import { Stack, Text, Button, Icon, Heading, AnimatedText } from 'move';

const effects = ['fade', 'slideUp', 'blurUp', 'scale'] as const;

export default function EffectsSample() {
  // Bumping the key remounts the AnimatedText instances so they replay.
  const [play, setPlay] = useState(0);
  return (
    <Stack gap="lg" align="start">
      <Button size="sm" variant="primary" onClick={() => setPlay((n) => n + 1)}>
        <Icon name="play" /> Replay
      </Button>
      {effects.map((effect) => (
        <Stack key={effect} gap="xs">
          <Text size="xs" color="subtle">
            effect="{effect}"
          </Text>
          <AnimatedText key={`${effect}-${play}`} asChild by="character" effect={effect} trigger="inView">
            <Heading level={3}>The quick brown fox</Heading>
          </AnimatedText>
        </Stack>
      ))}
    </Stack>
  );
}
