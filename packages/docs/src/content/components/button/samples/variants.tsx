import { Button, Stack, Text } from 'move';

const variants = ['primary', 'secondary', 'ghost', 'danger'] as const;
const descriptions: Record<typeof variants[number], string> = {
  primary: 'The one action you want people to take. Use it sparingly — one per region.',
  secondary: 'Sits next to a primary. The "OK, but maybe later" of buttons.',
  ghost: 'No fill, no border. Slips into toolbars and tight rows without shouting.',
  danger: 'Destructive actions. Reserve for things that can’t be undone with a click of regret.',
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
          <Stack direction="row" gap="sm">
            <Button variant={variant}>Confirm</Button>
            <Button variant={variant} disabled>Disabled</Button>
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}
