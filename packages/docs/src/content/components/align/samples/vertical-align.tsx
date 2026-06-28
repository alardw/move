import { Align, Card, Stack, Text } from 'move';

const aligns = ['start', 'center', 'end', 'baseline', 'stretch'] as const;

const Tall = () => (
  <Card.Root>
    <Stack padding="lg"><Text>Tall</Text></Stack>
  </Card.Root>
);
const Short = () => (
  <Card.Root>
    <Stack padding="xs"><Text>Short</Text></Stack>
  </Card.Root>
);

/**
 * `align` controls vertical alignment when the slots have different
 * intrinsic heights — useful when one side is a tall block (e.g. a
 * card) and the others are inline text or buttons.
 */
export default function VerticalAlignSample() {
  return (
    <Stack gap="md">
      {aligns.map((a) => (
        <Stack key={a} gap="xs">
          <Text size="sm" weight="medium">align="{a}"</Text>
          <Card.Root>
            <Card.Body>
              <Align align={a} gap="md">
                <Align.Start><Tall /></Align.Start>
                <Align.Center><Short /></Align.Center>
                <Align.End><Short /></Align.End>
              </Align>
            </Card.Body>
          </Card.Root>
        </Stack>
      ))}
    </Stack>
  );
}
