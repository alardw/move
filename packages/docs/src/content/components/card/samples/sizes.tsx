import { Card, Stack, Text } from 'move';

const sizes = ['sm', 'md', 'lg'] as const;
const descriptions: Record<typeof sizes[number], string> = {
  sm: 'Tight padding, smaller title — for sidebars and dense dashboards.',
  md: 'The default. Page-level cards.',
  lg: 'Roomy padding and a larger title — for marketing surfaces and feature highlights.',
};

export default function SizesSample() {
  return (
    <Stack gap="md">
      {sizes.map((size) => (
        <Card.Root key={size} size={size}>
          <Card.Header>
            <Card.Title>size="{size}"</Card.Title>
            <Card.Description>{descriptions[size]}</Card.Description>
          </Card.Header>
          <Card.Body>
            <Text size="sm" color="muted">Padding scales; the proportions of the title-to-description gap stay consistent.</Text>
          </Card.Body>
        </Card.Root>
      ))}
    </Stack>
  );
}
