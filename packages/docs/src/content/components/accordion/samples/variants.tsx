import { Accordion, Stack, Text } from 'move';

const items = [
  {
    value: 'performance',
    label: 'Is animation free?',
    body: 'Nothing is free, but this is close. The height animation runs on the compositor where possible and respects prefers-reduced-motion — so reduced-motion users skip straight to the final state, no drama.',
  },
  {
    value: 'customization',
    label: 'Can I style the chevron?',
    body: 'Pass an `icon` prop to Accordion.Trigger with any ReactNode — an Icon, an SVG, a plus sign made of hyphens and pipes. Whatever you ship rotates with the open state automatically.',
  },
];

const variants = ['default', 'contained', 'ghost'] as const;
const descriptions: Record<typeof variants[number], string> = {
  default: 'Divider lines between items. The neutral choice for most pages.',
  contained: 'Each item in its own card — good when the accordion sits on a busy page.',
  ghost: 'No chrome at all. Best for a single disclosure inside an already-framed container.',
};

export default function VariantsSample() {
  return (
    <Stack gap="lg">
      {variants.map((variant) => (
        <Stack key={variant} gap="xs">
          <Stack direction="row" gap="sm" align="baseline">
            <Text size="sm" weight="medium">variant="{variant}"</Text>
            <Text size="sm" color="muted">{descriptions[variant]}</Text>
          </Stack>
          <Accordion.Root type="single" collapsible defaultValue="performance" variant={variant}>
            {items.map((it) => (
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
