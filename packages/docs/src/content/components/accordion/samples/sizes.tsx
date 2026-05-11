import { Accordion, Stack, Text } from 'move';

const faq = [
  {
    value: 'density',
    label: 'Which size should I use?',
    body: 'Match the density of the surrounding page. `sm` for compact settings panels where every pixel is earning its keep, `md` for body content, `lg` when the accordion is the star of the section.',
  },
  {
    value: 'tokens',
    label: 'What actually changes?',
    body: 'Padding, font size, and the chevron scale. Nothing structural — the same DOM renders, just with different inline-token values. Override via the tokens on Root if you want something between the presets.',
  },
];

const sizes = ['sm', 'md', 'lg'] as const;

export default function SizesSample() {
  return (
    <Stack gap="lg">
      {sizes.map((size) => (
        <Stack key={size} gap="xs">
          <Text size="sm" weight="medium">size="{size}"</Text>
          <Accordion.Root type="single" collapsible size={size} defaultValue="density">
            {faq.map((it) => (
              <Accordion.Item key={it.value} value={it.value}>
                <Accordion.Header>
                  <Accordion.Trigger>{it.label}</Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content>{it.body}</Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </Stack>
      ))}
    </Stack>
  );
}
