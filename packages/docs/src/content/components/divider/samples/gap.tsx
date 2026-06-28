import { Card, Divider, Stack, Text } from 'move';

const gaps = ['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const;
const descriptions: Record<typeof gaps[number], string> = {
  none: 'Flush separator — no margin around the line. For tightly stacked rows that already have their own padding.',
  xs:   'A whisper of breathing room.',
  sm:   'Tight but visible — list rows, settings panels.',
  md:   'The default. Page-level section breaks.',
  lg:   'Generous spacing — major content shifts.',
  xl:   'Hero-level — for marketing pages where the divider is the breath between sections.',
};

export default function GapSample() {
  return (
    <Stack gap="lg">
      {gaps.map((g) => (
        <Stack key={g} gap="xs">
          <Text size="sm" weight="medium">gap="{g}"</Text>
          <Text size="sm" color="muted">{descriptions[g]}</Text>
          <Card.Root>
            <Stack gap="none" padding="sm">
              <Text>Above the line</Text>
              <Divider gap={g} />
              <Text>Below the line</Text>
            </Stack>
          </Card.Root>
        </Stack>
      ))}
    </Stack>
  );
}
