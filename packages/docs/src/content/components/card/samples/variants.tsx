import { Card, Stack, Text } from 'move';

const variants = ['default', 'elevated', 'ghost'] as const;
const descriptions: Record<typeof variants[number], string> = {
  default: 'Border + subtle background. The neutral choice for any list of cards.',
  elevated: 'Drop shadow, no border. Feels lifted — best for cards that should pop on a busy page.',
  ghost: 'No frame at all — just spacing. For cards that share a parent with their own background.',
};

export default function VariantsSample() {
  return (
    <Stack gap="md">
      {variants.map((v) => (
        <Card.Root key={v} variant={v}>
          <Card.Header>
            <Card.Title>variant="{v}"</Card.Title>
            <Card.Description>{descriptions[v]}</Card.Description>
          </Card.Header>
          <Card.Body>
            <Text size="sm" color="muted">The body still gets standard spacing — only the chrome changes.</Text>
          </Card.Body>
        </Card.Root>
      ))}
    </Stack>
  );
}
