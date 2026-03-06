import { useState } from 'react';
import { Stack, Heading, Text, Button, Code } from 'move';

export function HomePage() {
  const [count, setCount] = useState(0);

  return (
    <Stack gap="lg" align="center">
      <Heading level={1}>Welcome to Move</Heading>
      <Text color="muted" size="lg">
        Edit <Code>src/pages/HomePage.tsx</Code> to get started.
      </Text>
      <Button onClick={() => setCount((c) => c + 1)}>
        Count: {count}
      </Button>
    </Stack>
  );
}
